import React from "react";
import Swal from "sweetalert2";

import { timeplot, globalButtonsWidth, audioBufferNodes } from "../App.jsx";

export default function GlobalButtons({ resetClipsOutputs }) {
    return (
        <div style={{
            display: 'grid',
            placeItems: "center",
            width: globalButtonsWidth
        }}>
            <button 
                onClick={() => {
                    for(let x of audioBufferNodes){
                        x.stop();
                    }
                    audioBufferNodes.splice(0, audioBufferNodes.length);
                }}
                className="globalBtn"
            >Stop all audio</button>

            <button 
                onClick={() => {
                    timeplot.points.splice(1, timeplot.points.length - 1);
                    resetClipsOutputs();
                }}
                className="globalBtn"
            >Clear timeplot</button>

            <button 
                onClick={() => {
                    let plotJson = JSON.stringify(timeplot);

                    let blob = URL.createObjectURL(new Blob([plotJson], { type: 'application/json' }));

                    let downloadElem = document.createElement('a');
                    downloadElem.href = blob;
                    Swal.fire({
                        title: "Name:",
                        input: "text",
                        showCancelButton: true
                    }).then(res => {
                        if(res.isConfirmed){
                            let name = res.value;
                            if(name === ""){
                                name = "New Timeplot.json"
                            }
                            else if (!name.endsWith(".json")){
                                name = name + ".json";
                            }
                            downloadElem.download = name;
                            downloadElem.click();
                            Swal.fire({
                                icon: "success",
                                text: "Success",
                                timer: 1000,
                                showConfirmButton: false
                            });
                        }
                    })
                }}
                className="globalBtn"
            >Save timeplot as</button>

            <button 
                onClick={() => {
                    const fileInput = document.createElement('input');
                    fileInput.type = 'file';
                    fileInput.multiple = false;
                    
                    fileInput.onchange = e => {
                        e.preventDefault();
                        e.stopPropagation();

                        if(fileInput.files.length > 0){
                            let f = fileInput.files[0];
                            f.text().then(res => {
                                try{
                                    const newTimeplot = JSON.parse(res);
                                    for(let key of Object.keys(newTimeplot)){
                                        try{
                                            timeplot[key] = newTimeplot[key];
                                        }
                                        catch{
                                            continue;
                                        }
                                    }
                                }
                                catch(e){
                                    Swal.fire({
                                        icon: 'error',
                                        text: 'Input file is not a valid timeplot.'
                                    })
                                }
                            })
                        }

                    }
                    
                    fileInput.click();
                }}
                className="globalBtn"
            >Load timeplot</button>
        </div>
    )
}