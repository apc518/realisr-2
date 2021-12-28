import React, { useState } from "react";
import Swal from "sweetalert2";

import { AudioContext, canvasWidth, globalButtonsWidth } from '../App.jsx';

import { Clip } from "../classes/Clip.js";

const inactiveColor = "#d0d";
const activeColor = "#d77";

export default function FileDrop({ audioCtx, clips, setClips }){
    const [bgColor, setBgColor] = useState(inactiveColor);

    const loadFiles = fileList => {
        if(!audioCtx){
            audioCtx = new AudioContext();
        }

        const newClips = clips.slice();

        const files = [];
        for(let f of fileList){
            files.push(f);
        }

        let i = 0;

        const failedFilenames = [];

        const trySetClips = () => {
            if(i === files.length - 1){
                setClips(newClips);

                if(failedFilenames.length > 0){
                    console.log(failedFilenames);
                    console.log(failedFilenames.toString());
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
        <div 
            style={{
                width: canvasWidth - globalButtonsWidth,
                height: 200,
                backgroundColor: bgColor,
                display: 'grid',
                placeItems: 'center',
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
                textAlign: 'center',
                fontSize: 20,
                userSelect: 'none'
            }}>
                Drag and drop audio files here!
            </div>
        </div>
    )
}