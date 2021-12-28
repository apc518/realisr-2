import React, { useState } from "react";

import { AudioContext, Clip, canvasWidth } from '../App.jsx';

const inactiveColor = "#d0d";
const activeColor = "#d77";

export default function FileDrop({ audioCtx, clips, setClips }){
    const [bgColor, setBgColor] = useState(inactiveColor);

    const loadFiles = fileList => {
        if(!audioCtx){
            audioCtx = new AudioContext();
        }

        const newClips = [];

        const files = [];
        for(let f of fileList){
            files.push(f);
        }

        let i = 0;

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
    }

    return (
        <div 
            style={{
                width: canvasWidth,
                height: 200,
                backgroundColor: bgColor,
                display: 'grid',
                placeItems: 'center',
                borderRadius: 10,
                cursor: 'pointer'
            }}

            onClick={e => {
                e.preventDefault();
                e.stopPropagation();

                const inputElem = document.createElement('input');
                inputElem.type = 'file';
                inputElem.multiple = true;

                inputElem.onchange = () => {
                    loadFiles(inputElem.files);
                }

                inputElem.click();
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

                loadFiles(e.dataTransfer.files);
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