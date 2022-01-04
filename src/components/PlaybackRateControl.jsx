import React, { useState } from "react";

import { audioCtx, initAudioCtx, setGlobalSpeed } from "../App.jsx";
import { clipsEx } from "./ClipList.jsx";

const doSpeedInput = (e, setGlobSpeedDisplay) => {
    if(!audioCtx){
        initAudioCtx();
    }
    
    let val = Math.pow(1/10, (1 - e.target.value * 2 / 100));
    
    setGlobSpeedDisplay(val);
    setGlobalSpeed(val);
    
    for(let clip of clipsEx){
        clip.setPlaybackRate(val);
    }
}

export default function PlaybackRateControl(){
    const [globSpeedDisplay, setGlobSpeedDisplay] = useState(1);
    
    return (
        <>
        <label htmlFor="globalSpeedSlider">Playback Rate </label>
        <button onClick={() => {
            const elem = document.getElementById("globalSpeedSlider");
            elem.value = 50;
            elem.click();
        }}
        >
            Reset
        </button><br/>
        <input
            id="globalSpeedSlider"
            type="range"
            onClick={e => {
                doSpeedInput(e, setGlobSpeedDisplay);
            }}
            onChange={e => {
                doSpeedInput(e, setGlobSpeedDisplay);
            }}
            style={{
                display: 'inline-block',
                verticalAlign: 'middle'
            }}
        />
        <span htmlFor="globalSpeedSlider">{globSpeedDisplay.toFixed(2)}</span>
        </>
    )
}