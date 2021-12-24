import React, { useState } from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";

import { TimePlot } from '../build/realisr_2';
import { memory } from '../build/realisr_2_bg.wasm';

import FileDrop from "./components/FileDrop.jsx";

export const AudioContext = window.AudioContext || window.webkitAudioContext;

const timeplot = [
    { x: 0, y: 0 },
    { x: 3, y: 4 },
    { x: 8, y: 4}
]

const transformCoords = (vec) => {
    return [ vec.x * 10 + 200, -vec.y * 10 + 150 ]
}

const sketch = p5 => {
    p5.setup = () => p5.createCanvas(400, 300);

    p5.draw = () => {
        p5.background(63, 255, 127);
        for(let i = 1; i < timeplot.length; i++){
            p5.push();
            p5.noFill();
            p5.stroke(255, 0, 0);
            p5.strokeWeight(3);
            let [prevX, prevY] = transformCoords(timeplot[i-1]);
            let [x, y] = transformCoords(timeplot[i]);
            p5.line(prevX, prevY, x, y);
            p5.pop();
        }
    }
}

export default function App({ wasm }){
    const [files, setFiles] = useState([]);
    const [audioCtx, setAudioCtx] = useState(null);
    const [audioBuffers, setAudioBuffers] = useState([]);
    const [audioBufferNodes, setAudioBufferNodes] = useState([]);
    
    const [pathLength, setPathLength] = useState(null);
    
    return (
        <div
            style={{
                height: '100%',
            }}
        >
            <div
                style={{
                    fontSize: 20,
                    fontFamily: 'Trebuchet MS'
                }}
            >
                <button
                    onClick={() => {
                        console.log(rustTimePlot.my_to_string());
                    }}
                >Log path statistics</button>
                { pathLength ? <><br/>Path length: {pathLength}</> : <></>}
                <ReactP5Wrapper sketch={sketch}/>
            </div>
            <FileDrop 
                files={files}
                setFiles={setFiles}
                audioCtx={audioCtx}
                setAudioCtx={setAudioCtx}
                audioBuffers={audioBuffers}
                setAudioBuffers={setAudioBuffers}
            />
            
            {audioBuffers.map((ab, i) => (
                <button
                    key={i}
                    onClick={() => {
                        let aCtx;
                        if(!audioCtx){
                            aCtx = new AudioContext();
                            setAudioCtx(aCtx);
                        }
                        else{
                            aCtx = audioCtx;
                        }

                        const rustTimePlot = TimePlot.new();

                        // input our data into rust
                        timeplot.map(p => rustTimePlot.add_point(p.x, p.y));

                        for(let ch = 0; ch < ab.numberOfChannels; ch++){
                            let channel = ab.getChannelData(ch);
                            for(let i = 0; i < channel.length; i++){
                                rustTimePlot.add_input_audio_frame(channel[i]);
                            }
                        }

                        console.time();
                        // compute LSR
                        rustTimePlot.compute_true_timeplot();
                        console.timeEnd();

                        // get output from Rust
                        const rustBufferPtr = rustTimePlot.get_out_audio_buffer();
                        const rustBuffer = new Float32Array(memory.buffer, rustBufferPtr, rustTimePlot.get_out_audio_buffer_length());

                        const rustAudioBuffer = new AudioBuffer({ length: rustBuffer.length, numberOfChannels: 1, sampleRate: ab.sampleRate });
                        rustAudioBuffer.copyToChannel(rustBuffer, 0);

                        console.log(rustTimePlot.my_to_string());
                    
                        let source = aCtx.createBufferSource();
                        source.buffer = rustAudioBuffer;
                        source.connect(aCtx.destination);
                        setAudioBufferNodes([...audioBufferNodes, source]); // audioBufferNodes.push(source)
                        source.start();
                    }}
                >

                    Play clip {i}
                </button>
            ))}
        </div>
    );
}