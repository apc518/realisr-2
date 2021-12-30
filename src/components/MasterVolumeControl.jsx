import React from "react";

import { audioCtx, globalVolume, setGlobalVolume } from "../App.jsx";
import { clipsEx } from "./ClipList.jsx";

/**
 * returns the logarithm of x with in the input base
 * @param {number} base 
 * @param {number} x 
 */
const logb = (base, x) => {
    return Math.log(x) / Math.log(base);
}

export default function MasterVolumeControl({}){
    return (
        <>
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
                setGlobalVolume(val);
                for(let clip of clipsEx){
                    clip.setVolume(val);
                }
            }}
            style={{
                display: 'inline-block',
                verticalAlign: 'middle'
            }}
        />
        </>
    )
}