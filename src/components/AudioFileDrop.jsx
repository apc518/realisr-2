import React, { useState } from "react";
import Swal from "sweetalert2";

import { canvasWidth, globalButtonsWidth, audioCtx, initAudioCtx, lightTextColor, clipsMessageDefault, clipsMessageLoading } from '../App.jsx';
import { setClipsEx, clipsEx } from "./ClipList.jsx";
import { Clip } from "../classes/Clip.js";

const inactiveColor = "#d0d";
const activeColor = "#d77";

export default function AudioAudioFileDrop({ setClipsMessage }){
    const [bgColor, setBgColor] = useState(inactiveColor);

    const loadFiles = fileList => {
        if (fileList.length < 1) return; // this could happen if the user drops something that isnt a file
        
        setClipsMessage(clipsMessageLoading);

        if(!audioCtx){
            initAudioCtx();
        }

        const newClips = clipsEx.slice();

        const files = [];
        for(let f of fileList){
            files.push(f);
        }

        let i = 0;

        const failedFilenames = [];

        const trySetClips = () => {
            if(i === files.length - 1){
                setClipsEx(newClips);
                setClipsMessage(clipsMessageDefault);

                if(failedFilenames.length > 0){
                    Swal.fire({
                        icon: 'error',
                        html: `These files could not be decoded as audio:<br/>${failedFilenames.toString().replaceAll(",", ", ")}`
                    });
                }
            }
            
            i++;
        }

        for(let f of files){
            f.arrayBuffer().then(res => {
                audioCtx.decodeAudioData(res).then(decodedData => {
                    console.log(decodedData);
                    
                    newClips.push(new Clip(decodedData, f.name));

                    trySetClips();
                })
                .catch(() => {
                    failedFilenames.push(f.name);

                    trySetClips();
                });
            })
            .catch(e => console.error(e));
        }
    }

    return (
        <button 
            style={{
                width: canvasWidth - globalButtonsWidth,
                height: 200,
                backgroundColor: bgColor,
                color: lightTextColor,
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
                border: 'none'
            }}

            // on click, open up a file input prompt
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

            onDragLeave={e => {
                e.preventDefault();
                e.stopPropagation();

                setBgColor(inactiveColor);
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
                textAlign: 'center',
                fontSize: 20,
                userSelect: 'none'
            }}>
                Drag and drop audio files here!
            </div>
        </button>
    )
}