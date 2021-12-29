import React, { useEffect, useState } from "react";

import ClipList from "./components/ClipList.jsx";
import AudioFileDrop from "./components/AudioFileDrop.jsx";
import GlobalButtons from "./components/GlobalButtons.jsx";
import TimeplotCanvas from "./components/TimeplotCanvas.jsx";
import PlaybackRateControl from "./components/PlaybackRateControl.jsx";

export const AudioContext = window.AudioContext || window.webkitAudioContext;

export const canvasWidth = 500;
export const canvasHeight = 500;
export const globalButtonsWidth = 180;

export let audioCtx;
export let masterGainNode;

export const globalVolumeDefault = 0.5264; // this is 80% on the slider
export let globalSpeed = 1;

export const setGlobalSpeed = s => {
    globalSpeed = s;
}

export const initAudioCtx = () => {
    audioCtx = new AudioContext();
    masterGainNode = audioCtx.createGain();
    masterGainNode.gain.value = globalVolumeDefault;
    masterGainNode.connect(audioCtx.destination);
}

export const timeplot = {
    falloffExponent: 0,
    finalSpeed: 1,
    subdivisions: 1,
    points: [
        { x: 0, y: 0 }
    ]
}

export const audioBufferNodes = [];

/**
 * returns the logarithm of x with in the input base
 * @param {number} base 
 * @param {number} x 
 */
const logb = (base, x) => {
    return Math.log(x) / Math.log(base);
}

export default function App(){
    const [files, setFiles] = useState([]);
    const [clips, setClips] = useState([]); // list of Clips (instances of the class defined above)
    
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
                paddingLeft: 10,
                paddingTop: 10
            }}
        >
            <label htmlFor="globalVolumeSlider">Master Volume: </label>
            <input
                id="globalVolumeSlider"
                type="range"
                defaultValue={80}
                onChange={e => {
                    if(!audioCtx){
                        initAudioCtx();
                    }

                    // use exponential scale to go from 0,0 to 1,1 so the volume slider feels more natural
                    const tension = 10; // how extreme the curve is (higher = more extreme, slower start faster end)
                    const n = 1 / (1 - logb(1 / tension, 1 + (1 / tension)));
                    
                    const val = Math.pow(1 / tension, 1 - (e.target.value / 100) / n) - 1 / tension;
                    masterGainNode.gain.value = val;
                }}
                style={{
                    display: 'inline-block',
                    verticalAlign: 'middle'
                }}
            /> <br/>
            <PlaybackRateControl/>

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
        </div>
    );
}