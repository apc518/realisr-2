import React, { useState } from "react";

import { AudioContext, Clip, canvasWidth } from '../App.jsx';

const inactiveColor = "#d0d";
const activeColor = "#d77";

export default function FileDrop({ audioCtx, clips, setClips }){
    const [bgColor, setBgColor] = useState(inactiveColor);

    return (
        <div 
            style={{
                width: canvasWidth,
                height: 200,
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

                if(!audioCtx){
                    audioCtx = new AudioContext();
                }
                
                const newClips = clips.slice();

                let i = 0;

                console.log("at first, files: ", e.dataTransfer.files);

                let files = [];
                for(let f of e.dataTransfer.files){
                    files.push(f);
                }

                for(let f of files){
                    console.log("files at top of loop", files);
                    f.arrayBuffer().then(res => {
                        console.log("files after arrayBuffer()", files, res);
                        audioCtx.decodeAudioData(res).then(decodedData => {
                            console.log(decodedData);
                            
                            newClips.push(new Clip(decodedData, f.name));

                            console.log("files", files);
                            console.log("files length", files.length);
                            console.log("new clips:", newClips);
                            
                            if(i === files.length - 1){
                                console.log("general kenobi?");
                                console.log(newClips);
                                setClips(newClips);
                            }

                            i++;
                            console.log("i", i);
                        });
                    })
                    .catch(e => console.error(e));
                }
            }}
        >
            <div style={{
                maxWidth: 150,
                textAlign: 'center'
            }}>
                Drag and drop audio files here!
            </div>
        </div>
    )
}