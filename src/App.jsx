import React, { useEffect, useState } from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";
import Swal from "sweetalert2";

import { TimePlot } from '../build/realisr_2';
import { memory } from '../build/realisr_2_bg.wasm';

import FileDrop from "./components/FileDrop.jsx";

export const AudioContext = window.AudioContext || window.webkitAudioContext;

const timeplot = [
    { x: 0, y: 0 }
]

const sketch = p5 => {
    const canvasWidth = 400;
    const canvasHeight = 300;

    p5.setup = () => p5.createCanvas(canvasWidth, canvasHeight);

    p5.draw = () => {
        p5.background(63, 255, 127);
        p5.strokeWeight(2);
        if(timeplot.length == 1){
            p5.push();
            p5.fill(255, 0, 0);
            p5.noStroke();
            p5.ellipse(canvasWidth / 2, canvasHeight / 2, 6);
            p5.pop();
        }
        for(let i = 1; i < timeplot.length; i++){
            // line
            p5.push();
            p5.noFill();
            p5.stroke(255, 0, 0);
            let [prevX, prevY] = [timeplot[i-1].x, -timeplot[i-1].y];
            let [x, y] = [timeplot[i].x, -timeplot[i].y];
            p5.translate(canvasWidth / 2, canvasHeight / 2);
            p5.line(prevX, prevY, x, y);

            // arrowhead
            p5.noStroke();
            p5.fill(255, 0, 0);
            let angle = p5.atan2(prevY - y, prevX - x);
            p5.translate(x, y);
            p5.rotate(angle - p5.HALF_PI);
            let triSize = 10;
            p5.triangle(0, 0, -triSize/2, triSize, triSize/2, triSize);
            p5.pop();
        }
    }

    p5.mousePressed = e => {
        if (p5.mouseX < canvasWidth && p5.mouseX > 0 && p5.mouseY < canvasHeight && p5.mouseY > 0){
            timeplot.push({ x: p5.mouseX - (canvasWidth / 2), y: - p5.mouseY + (canvasHeight / 2) });
        }
    }

    p5.keyPressed = e => {
        if (timeplot.length > 1) {
            timeplot.splice(timeplot.length - 1, 1);
        }
    }
}

export default function App({ wasm }){
    const [files, setFiles] = useState([]);
    const [audioCtx, setAudioCtx] = useState(null);
    const [audioBuffers, setAudioBuffers] = useState([]);
    const [audioBufferNodes, setAudioBufferNodes] = useState([]);

    useEffect(() => {
        document.addEventListener('contextmenu', e => e.preventDefault());
    }, []);
    
    return (
        <div
            style={{
                height: '100vh',
                width: '100vw',
                fontFamily: 'Trebuchet MS',
                position: 'absolute',
                left: 0,
                top: 0,
                background: '#223',
                color: '#eee',
                paddingLeft: 10
            }}
        >
            <p>
                Drag an mp3 or wav file into the magenta file drop box.<br/>
                Then, draw a timeplot by clicking in the green box. Press backspace to undo.<br/>
                Finally click the Realise button that will appear below!
            </p>

            <FileDrop 
                files={files}
                setFiles={setFiles}
                audioCtx={audioCtx}
                setAudioCtx={setAudioCtx}
                audioBuffers={audioBuffers}
                setAudioBuffers={setAudioBuffers}
            />

            <button 
                onClick={() => {
                    for(let x of audioBufferNodes){
                        x.stop();
                    }
                }}
            >Stop all audio</button>
            
            <ReactP5Wrapper sketch={sketch}/>

            {audioBuffers.map((ab, i) => (
                <button
                    key={i}
                    onClick={() => {
                        const doTimePlot = () => {
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
                            console.time("input data to rust");
                            timeplot.map(p => rustTimePlot.add_point(p.x, p.y));
                            
                            let channel = ab.getChannelData(0);
                            if(ab.numberOfChannels > 1){
                                for(let i = 0; i < channel.length; i++){
                                    let val = 0;
                                    for(let k = 0; k < ab.numberOfChannels; k++){
                                        val += ab.getChannelData(k)[i];
                                    }
                                    rustTimePlot.add_input_audio_frame(val);
                                }
                            }
                            else {
                                for(let i = 0; i < channel.length; i++){
                                    rustTimePlot.add_input_audio_frame(channel[i]);
                                }
                            }
                            console.timeEnd("input data to rust");
    
                            // compute LSR
                            console.time("compute timeplot");
                            rustTimePlot.compute_true_timeplot();
                            console.timeEnd("compute timeplot");
                            
                            // get output from Rust
                            console.time("get and copy output from Rust");
                            const rustBufferPtr = rustTimePlot.get_out_audio_buffer();
                            const rustBuffer = new Float32Array(memory.buffer, rustBufferPtr, rustTimePlot.get_out_audio_buffer_length());
                            
                            const rustAudioBuffer = new AudioBuffer({ length: rustBuffer.length, numberOfChannels: 1, sampleRate: ab.sampleRate });
                            rustAudioBuffer.copyToChannel(rustBuffer, 0);
                            console.timeEnd("get and copy output from Rust");
                            
                            console.log(rustTimePlot.my_to_string());
                            
                            let source = aCtx.createBufferSource();
                            source.buffer = rustAudioBuffer;
                            source.connect(aCtx.destination);
                            setAudioBufferNodes([...audioBufferNodes, source]); // audioBufferNodes.push(source)
                            source.start();
                        }
                        
                        if (timeplot.length < 2){
                            Swal.fire({
                                icon: "error",
                                text: "A timeplot with no segments? Not gonna work. Click around on the green canvas!"
                            })
                        }
                        else if (ab.numberOfChannels < 1) {
                            Swal.fire({
                                icon: "error",
                                text: "A file with no channels? No-can-do I'm afraid."
                            });
                        }
                        else if (ab.numberOfChannels > 1) {
                            Swal.fire({
                                icon: 'info',
                                text: "File will be mixed down to mono.",
                                showConfirmButton: false,
                                timer: 1000
                            }).then(() => {
                                doTimePlot();
                                return;
                            });
                        }
                        else{
                            doTimePlot();
                        }
                    }}
                >
                    Realise clip {i}
                </button>
            ))}
        </div>
    );
}