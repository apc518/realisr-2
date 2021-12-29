import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

import ClipList from "./components/ClipList.jsx";
import AudioFileDrop from "./components/AudioFileDrop.jsx";
import GlobalButtons from "./components/GlobalButtons.jsx";
import TimeplotCanvas from "./components/TimeplotCanvas.jsx";

export const AudioContext = window.AudioContext || window.webkitAudioContext;

export const canvasWidth = 500;
export const canvasHeight = 500;
export const globalButtonsWidth = 180;

export let globalSpeed = 1;

let audioCtx;

export const timeplot = {
    falloffExponent: 0,
    finalSpeed: 1,
    subdivisions: 1,
    points: [
        { x: 0, y: 0 }
    ]
}

export const audioBufferNodes = [];

export default function App({ wasm }){
    const [files, setFiles] = useState([]);
    const [clips, setClips] = useState([]); // list of Clips (instances of the class defined above)
    const [globSpeedDisplay, setGlobSpeedDisplay] = useState(1);
    
    useEffect(() => {
        document.addEventListener('contextmenu', e => e.preventDefault());
    }, []);
    
    const resetClipsOutputs = () => {
        let changed = false;
        for (let c of clips) {
            if(!(c.blob === null && c.outAudioBuffer === null && c.isRealised === false)){
                c.blob = null;
                c.outAudioBuffer = null;
                c.isRealised = false;

                changed = true;
            }
        }
        if(changed){
            setClips([...clips]); // refresh clip list
        }
    }

    return (
        <div
            style={{
                maxWidth: '100vw',
                position: 'absolute',
                left: 0,
                top: 0,
                color: '#eee',
                paddingLeft: 10
            }}
        >
            <p>
                Drag an mp3 or wav file into the magenta file drop box.<br/>
                Then, draw a timeplot by clicking in the green box. Press backspace to undo.<br/>
                Finally click the Realise button that will appear below!
            </p>

            {/* <button onClick={() => console.log(clips)}>log clips</button> */}
            {/* <button onClick={() => console.log(timeplot.points)}>log points</button> */}

            <div style={{
                display: "flex"
            }}>
                <div>
                    <div style={{ display: "flex" }}>
                        <AudioFileDrop 
                            files={files}
                            setFiles={setFiles}
                            audioCtx={audioCtx}
                            clips={clips}
                            setClips={setClips}
                        />

                        <GlobalButtons clips={clips} setClips={setClips} resetClipsOutputs={resetClipsOutputs} />
                    </div>

                    <TimeplotCanvas resetClipsOutputs={resetClipsOutputs} />
                </div>
                
                <ClipList clips={clips} setClips={setClips} />
            </div>

            <label htmlFor="globalSpeedSlider">Playback Rate: </label>
            <input
                id="globalSpeedSlider"
                type="range"
                onChange={e => {
                    let val = Math.pow(1/100, (1 - e.target.value * 2 / 100));
                    
                    setGlobSpeedDisplay(val);
                    globalSpeed = val;
                    
                    for(let abn of audioBufferNodes){
                        abn.playbackRate.value = val;
                    }
                }}
                style={{
                    display: 'inline-block',
                    verticalAlign: 'middle'
                }}
            />
            <label htmlFor="globalSpeedSlider">{globSpeedDisplay.toFixed(2)}</label>
        </div>
    );
}