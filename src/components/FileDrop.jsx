import React, { useState } from "react";

import { AudioContext } from '../App.jsx';

const inactiveColor = "#f0f";
const activeColor = "#f88";

export default function FileDrop({ audioCtx, setAudioCtx, audioBuffers, setAudioBuffers }){
    const [bgColor, setBgColor] = useState(inactiveColor);

    return (
        <div 
            style={{
                minWidth: 200,
                maxWidth: 200,
                minHeight: 200,
                maxHeight: 200,
                backgroundColor: bgColor,
                display: 'grid',
                placeItems: 'center'
            }}

            onDragOver={e => {
                e.preventDefault();
                e.stopPropagation();

                setBgColor(activeColor);
                e.dataTransfer.dropEffect = 'copy';
            }}

            onDrop={e => {
                e.preventDefault();
                e.stopPropagation();

                setBgColor(inactiveColor);

                console.log(e.dataTransfer.files[0]);

                let aCtx;
                if(!audioCtx){
                    aCtx = new AudioContext();
                    setAudioCtx(aCtx);
                }
                else{
                    aCtx = audioCtx;
                }

                e.dataTransfer.files[0].arrayBuffer().then(res => {
                    aCtx.decodeAudioData(res).then(decodedData => {
                        console.log(decodedData);
                
                        setAudioBuffers([...audioBuffers, decodedData])
                    });
                })
                .catch(e => console.error(e));
            }}
        >
            File drop
        </div>
    )
}