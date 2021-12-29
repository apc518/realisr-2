import React, { useState } from "react";

import { audioCtx, initAudioCtx, audioBufferNodes, setGlobalSpeed } from "../App.jsx";

export default function PlaybackRateControl(){
    const [globSpeedDisplay, setGlobSpeedDisplay] = useState(1);
    
    return (
        <>
            <label htmlFor="globalSpeedSlider">Playback Rate: </label>
            <input
                id="globalSpeedSlider"
                type="range"
                onChange={e => {
                    if(!audioCtx){
                        initAudioCtx();
                    }

                    let val = Math.pow(1/10, (1 - e.target.value * 2 / 100));
                    
                    setGlobSpeedDisplay(val);
                    setGlobalSpeed(val);
                    
                    for(let abn of audioBufferNodes){
                        abn.playbackRate.value = val;
                    }
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