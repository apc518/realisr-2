import React, { useState } from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";

import { TimePlot } from '../build/realisr_2';
import { memory } from '../build/realisr_2_bg.wasm';

import FileDrop from "./components/FileDrop.jsx";

export const AudioContext = window.AudioContext || window.webkitAudioContext;

const timeplot = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 3},
    { x: 2, y: -1},
    { x: 0, y: -2}
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

const rustTimePlot = TimePlot.new();

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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >


            <div
                style={{
                    position: 'absolute',
                    left: 10,
                    top: 10,
                    fontSize: 20,
                    fontFamily: 'Trebuchet MS'
                }}
            >
                <button
                    onClick={() => {
                        timeplot.map(p => rustTimePlot.add_point(p.x, p.y));
                        rustTimePlot.calc_stats();
                        console.log(rustTimePlot.my_to_string());
                        setPathLength(rustTimePlot.get_path_length());
                    }}
                >Calculate path statistics</button>
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

                        for(let ch = 0; ch < ab.numberOfChannels; ch++){
                            let channel = ab.getChannelData(ch);
                            for(let i = 0; i < channel.length; i++){
                                rustTimePlot.add_input_audio_frame(channel[i]);
                            }
                        }

                        rustTimePlot.generate_out_audio();

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