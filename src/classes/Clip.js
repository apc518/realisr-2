import { timeplot, audioBufferNodes, globalSpeed, audioCtx, initAudioCtx, masterGainNode } from "../App.jsx";
import { TimePlot } from '../../build/realisr_2';
import { memory } from '../../build/realisr_2_bg.wasm';

export class Clip {
    constructor(audioBuffer, name){
        // input
        this.name = name;
        this.inAudioBuffer = audioBuffer;

        // output
        this.outAudioBuffer = null;
        this.isRealised = false;
        this.blob = null;
    }

    realise(){
        // compute timeplot.points for each channel
        let rustBuffers = [];
        for(let i = 0; i < this.inAudioBuffer.numberOfChannels; i++){
            // input our data into rust
            const rustTimePlot = TimePlot.new();
            timeplot.points.map(p => rustTimePlot.add_point(p.x, p.y));
            
            let channel = this.inAudioBuffer.getChannelData(i);
            rustTimePlot.populate_input_audio_buffer(channel);
            
            // compute LSR (linked segmented rescale)
            rustTimePlot.compute_true_timeplot();
            
            // get output from Rust
            const rustBufferPtr = rustTimePlot.get_out_audio_buffer();
            const rustBuffer = new Float32Array(memory.buffer, rustBufferPtr, rustTimePlot.get_out_audio_buffer_length());
            
            rustBuffers.push(rustBuffer.slice());
        }
        
        // create the output audio buffer
        this.outAudioBuffer = new AudioBuffer({
            length: rustBuffers[0].length,
            numberOfChannels: rustBuffers.length,
            sampleRate: this.inAudioBuffer.sampleRate
        });
        
        // copy channel data into output audio buffer
        for (let i = 0; i < rustBuffers.length; i++){
            this.outAudioBuffer.copyToChannel(rustBuffers[i], i);
        }

        this.isRealised = true;
    }

    play(){
        if(!audioCtx){
            initAudioCtx();
        }

        let source = audioCtx.createBufferSource();
        if(this.outAudioBuffer){
            source.buffer = this.outAudioBuffer;
            source.connect(masterGainNode);
            source.playbackRate.value = globalSpeed;
            audioBufferNodes.push(source);
            source.start();
        }
    }

    playOriginal(){
        if(!audioCtx){
            initAudioCtx();
        }

        let source = audioCtx.createBufferSource();
        if(this.inAudioBuffer){
            source.buffer = this.inAudioBuffer;
            source.connect(masterGainNode);
            source.playbackRate.value = globalSpeed;
            audioBufferNodes.push(source);
            source.start();
        }
    }

    generateDownload(){
        // function by Russell Good, some modifications by me https://www.russellgood.com/how-to-convert-audiobuffer-to-audio-file/
        const bufferToWave = (abuffer) => {
            const numOfChan = abuffer.numberOfChannels;
            const length = abuffer.length * numOfChan * 2 + 44;
            let buffer = new ArrayBuffer(length);
            let view = new DataView(buffer);
            let channels = [];
            let pos = 0;
            let offset = 0;
            
            const writeUint16 = (data) => {
                // little endian
                view.setUint16(pos, data, true);
                pos += 2;
            }
            
            const writeUint32 = (data) => {
                // little endian
                view.setUint32(pos, data, true);
                pos += 4;
            }

            // write WAVE header
            writeUint32(0x46464952); // "RIFF" backwards (since setUint32 does little endian, but this needs to actually be forwards)
            writeUint32(length - 8); // bytes in file after this word
            writeUint32(0x45564157); // "WAVE" also backwards, see two lines above
            writeUint32(0x20746d66); // "fmt " also backwards
            writeUint32(16); // length of file up until this point
            writeUint16(1); // type PCM
            writeUint16(numOfChan);
            writeUint32(abuffer.sampleRate);
            writeUint32(abuffer.sampleRate * 2 * numOfChan); // average bytes/sec
            writeUint16(numOfChan * 2) // block alignment (bits/sample * number of channels)
            writeUint16(16) // bit depth

            writeUint32(0x61746164); // "data" backwards, since setUint32 does little endian but this needs to actually be forwards
            writeUint32(length - pos - 4); // number of bytes

            // write interleaved data
            for(let i = 0; i < numOfChan; i++){
                channels.push(abuffer.getChannelData(i));
            }

            // write the data
            while(pos < length) {
                for(let i = 0; i < numOfChan; i++){
                    let sample = Math.max(-1, Math.min(1, channels[i][offset]));
                    sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
                    view.setInt16(pos, sample, true);
                    pos += 2;
                }
                offset++;
            }

            // create Blob
            return new Blob([buffer], { type: "audio/wav" });
        }

        this.blob =  URL.createObjectURL(bufferToWave(this.outAudioBuffer));
        console.log(this.blob);
    }
}