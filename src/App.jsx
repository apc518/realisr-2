import React, { useState } from "react";
import FileDrop from "./components/FileDrop.jsx";

export const AudioContext = window.AudioContext || window.webkitAudioContext;

export default function App({ wasm }){
    const [files, setFiles] = useState([]);
    const [audioCtx, setAudioCtx] = useState(null);
    const [audioBuffers, setAudioBuffers] = useState([]);
    const [audioBufferNodes, setAudioBufferNodes] = useState([]);

    const [val, setVal] = useState(0);

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
                    fontSize: 24,
                    fontFamily: 'Trebuchet MS'
                }}
            >
                <input type="number" onChange={e => setVal(wasm.divide_by_two(e.target.value))}></input>
                / 2 = {val}
                <br/> {arr}
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
                    
                        let source = aCtx.createBufferSource();
                        source.buffer = ab;
                        source.connect(aCtx.destination);
                        setAudioBufferNodes([...audioBufferNodes, source]); // audioBufferNodes.push(source)
                        source.playbackRate.value = 0.5;
                        source.start();
                    }}
                >
                    Play clip {i}
                </button>
            ))}
        </div>
    );
}