import React, { useEffect, useState } from "react";

import { cloneDeep } from "lodash";

import ClipList from "./components/ClipList.jsx";
import AudioFileDrop from "./components/AudioFileDrop.jsx";
import GlobalButtons from "./components/GlobalButtons.jsx";
import TimeplotCanvas from "./components/TimeplotCanvas.jsx";
import PlaybackRateControl from "./components/PlaybackRateControl.jsx";

export const AudioContext = window.AudioContext || window.webkitAudioContext;

export const canvasWidth = 500;
export const canvasHeight = 500;
export const globalButtonsWidth = 180;
export const lightTextColor = "#eee";
export const lightGrayUI = "#444";

export const audioBufferNodes = [];
export const gainNodes = [];

export let audioCtx;

export const globalVolumeDefault = 0.5264; // this is 80% on the slider
export let globalVolume = globalVolumeDefault;
export let globalSpeed = 1;

export const setGlobalSpeed = s => {
    globalSpeed = s;
}

export const initAudioCtx = () => {
    audioCtx = new AudioContext();
}

export const timeplotDefault = Object.freeze({
    falloffExponent: 0,
    finalSpeed: 1,
    subdivisions: 1,
    points: [] // will contain objects of the type { x: <number>, y: <number> }
});

export const timeplot = cloneDeep(timeplotDefault);

export const clipsMessageDefault = "No clips loaded.";
export const clipsMessageLoading = "Loading clips...";

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
    const [clipsMessage, setClipsMessage] = useState(clipsMessageDefault);
    
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
                color: lightTextColor,
                paddingLeft: 10,
                paddingTop: 10,
                minHeight: '100vh',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <div id="globalSliders">
                <label htmlFor="globalVolumeSlider">Master Volume: </label>
                <input
                    id="globalVolumeSlider"
                    type="range"
                    defaultValue={80}
                    onChange={e => {
                        if(!audioCtx){
                            initAudioCtx();
                        }

                        // use exponential scale to go from 0 to 1 so the volume slider feels more natural
                        const tension = 10; // how extreme the curve is (higher = more extreme, slower start faster end)
                        const n = 1 / (1 - logb(1 / tension, 1 + (1 / tension)));
                        
                        const val = Math.pow(1 / tension, 1 - (e.target.value / 100) / n) - 1 / tension;
                        globalVolume = val;
                        for(let gn of gainNodes){
                            gn.gain.value = val;
                        }
                    }}
                    style={{
                        display: 'inline-block',
                        verticalAlign: 'middle'
                    }}
                /> <br/>
                <PlaybackRateControl/>
            </div>

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
                            setClipsMessage={setClipsMessage}
                        />

                        <GlobalButtons clips={clips} setClips={setClips} resetClipsOutputs={resetClipsOutputs} />
                    </div>

                    <TimeplotCanvas resetClipsOutputs={resetClipsOutputs} lightGrayUI={lightGrayUI} />
                </div>
                
                {clips.length > 0 ?
                    <ClipList clips={clips} setClips={setClips} />
                    :
                    <div style={{ paddingLeft: 10 }}>{clipsMessage}</div>
                }
            </div>

            <footer style={{
                marginTop: 'auto',
                height: '3.5rem',
                color: "#888",
                lineHeight: '1.5rem'
            }}>
            <div>Copyright &copy; 2022 <a className="footerLink" target="_blank" rel="noreferrer" href="https://chambercode.com/about/andy" title="ChamberCode Portfolio">Andy Chamberlain</a></div>
            <div><a className="footerLink" target="_blank" rel="noreferrer" href="https://github.com/apc518/realisr-2" title="Realisr 2 Github">GitHub</a></div>
            </footer>
        </div>
    );
}