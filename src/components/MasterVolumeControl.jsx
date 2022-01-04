import React from "react";

import { audioCtx, initAudioCtx, globalVolumeSliderDefault, setGlobalVolume } from "../App.jsx";
import { clipsEx } from "./ClipList.jsx";

/**
 * returns the logarithm of x with in the input base
 * @param {number} base 
 * @param {number} x 
 */
const logb = (base, x) => {
    return Math.log(x) / Math.log(base);
}

export const convertSliderValueToAmplitude = sliderVal => {
    // use exponential scale to go from 0 to 1 so the volume slider feels more natural
    const tension = 10; // how extreme the curve is (higher = more extreme, slower start faster end)
    const n = 1 / (1 - logb(1 / tension, 1 + (1 / tension)));         
    const val = Math.pow(1 / tension, 1 - (sliderVal / 100) / n) - 1 / tension;
    return val;
}

const doVolumeInput = e => {
    if(!audioCtx){
        initAudioCtx();
    }
    
    console.log("volume slider changed");
    
    const val = convertSliderValueToAmplitude(e.target.value);
    setGlobalVolume(val);
    for(let clip of clipsEx){
        clip.setVolume(val);
    }
}

export default function MasterVolumeControl(){
    return (
        <>
        <label htmlFor="globalVolumeSlider">Master Volume </label>
        <button onClick={() => {
            const elem = document.getElementById("globalVolumeSlider");
            elem.value = globalVolumeSliderDefault;
            elem.click();
        }}>
            Reset
        </button> <br/>
        <input
            id="globalVolumeSlider"
            type="range"
            defaultValue={80}
            onClick={e => {
                doVolumeInput(e);
            }}
            onChange={e => {
                doVolumeInput(e);
            }}
            style={{
                display: 'inline-block',
                verticalAlign: 'middle'
            }}
        />
        </>
    )
}