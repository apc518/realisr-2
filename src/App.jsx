import React, { useEffect, useState } from "react";

import { cloneDeep } from "lodash";

import { convertSliderValueToAmplitude } from './components/MasterVolumeControl.jsx';

import ClipList from "./components/ClipList.jsx";
import AudioFileDrop from "./components/AudioFileDrop.jsx";
import GlobalButtons from "./components/GlobalButtons.jsx";
import TimeplotCanvas from "./components/TimeplotCanvas.jsx";
import PlaybackRateControl from "./components/PlaybackRateControl.jsx";
import MasterVolumeControl from "./components/MasterVolumeControl.jsx";

export const AudioContext = window.AudioContext || window.webkitAudioContext;

export const canvasWidth = 500;
export const canvasHeight = 500;
export const globalButtonsWidth = 180;
export const lightTextColor = "#eee";
export const lightGrayUI = "#444";

export let audioCtx;

export const globalVolumeSliderDefault = 80; // out of 100
export const globalVolumeDefault = convertSliderValueToAmplitude(globalVolumeSliderDefault);
export let globalVolume = globalVolumeDefault;
export let globalSpeed = 1;

export const clipsMessageDefault = "No clips loaded.";
export const clipsMessageLoading = "Loading clips...";

export const timeplotDefault = Object.freeze({
    falloffExponent: 0,
    finalSpeed: 1,
    subdivisions: 1,
    points: [] // will contain objects of the type { x: <number>, y: <number> }
});

export const timeplot = cloneDeep(timeplotDefault);

export const setGlobalVolume = v => {
    globalVolume = v;
}

export const setGlobalSpeed = s => {
    globalSpeed = s;
}

export const initAudioCtx = () => {
    audioCtx = new AudioContext();
}

export default function App(){
    const [files, setFiles] = useState([]);
    const [clipsMessage, setClipsMessage] = useState(clipsMessageDefault);
    
    useEffect(() => {
        document.addEventListener('contextmenu', e => e.preventDefault());
    }, []);

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
            <div id="globalSliders" style={{ display: 'flex' }}>
                <div style={{ marginRight: '1.5rem' }}>
                    <MasterVolumeControl/>
                </div>
                <div>
                    <PlaybackRateControl/>
                </div>
            </div>

            <div style={{
                display: "flex"
            }}>
                <div>
                    <div style={{ display: "flex" }}>
                        <AudioFileDrop 
                            files={files}
                            setFiles={setFiles}
                            audioCtx={audioCtx}
                            setClipsMessage={setClipsMessage}
                        />

                        <GlobalButtons />
                    </div>

                    <TimeplotCanvas lightGrayUI={lightGrayUI} />
                </div>
                
                <ClipList clipsMessage={clipsMessage}/>
            </div>

            <footer style={{
                marginTop: 'auto',
                color: "#888",
                lineHeight: '1.5rem',
                paddingBottom: '0.5rem'
            }}>
            <div><a className="footerLink" target="_blank" rel="noreferrer" href="https://youtu.be/iTOonc3Lr2A" title="About Video">What the hell is this???</a></div>
            <div><a className="footerLink" target="_blank" rel="noreferrer" href="https://github.com/apc518/realisr-2" title="Realisr 2 Github">GitHub</a></div>
            <div>Copyright &copy; 2022 <a className="footerLink" target="_blank" rel="noreferrer" href="https://chambercode.com/about/andy" title="ChamberCode Portfolio">Andy Chamberlain</a></div>
            </footer>
        </div>
    );
}