import React from "react";
import Swal from "sweetalert2";

import { timeplot, globalButtonsWidth, audioBufferNodes, canvasWidth } from "../App.jsx";
import { loadTimeplotObj } from "./TimeplotCanvas.jsx";

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
                    if(timeplot.points.length < 2){
                        Swal.fire({
                            icon: "error",
                            text: "Cannot save a timeplot with no segments! Draw some by clicking on the gray canvas."
                        });
                        return;
                    }

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
                                    loadTimeplotObj(newTimeplot, f.name, resetClipsOutputs);
                                }
                                catch(e){
                                    Swal.fire({
                                        icon: 'error',
                                        text: `${f.name} is not a valid timeplot.`
                                    })
                                }
                            })
                        }
                    }
                    
                    fileInput.click();
                }}

                className="globalBtn"
            >Load timeplot</button>

            <button
                onClick={() => {
                    timeplot.points = [{x: 0, y: 0}];
                    let numberOfSegments = Math.round(Math.random() * 24 + 1);
                    for(let i = 1; i <= numberOfSegments; i++){
                        let theta_min = 0;
                        let theta_max = 360 * Math.PI / 180;
                        let theta = Math.random() * (theta_max - theta_min) + theta_min;
                        let dx = 20 * Math.cos(theta);
                        let dy = 20 * Math.sin(theta);
                        timeplot.points.push({x: timeplot.points[i-1].x + dx, y: timeplot.points[i-1].y + dy});
                    }
                    
                    // find point farthest from center
                    let maxDistance = -1;
                    for(let point of timeplot.points) {
                        if(Math.sqrt(point.x * point.x + point.y * point.y) > maxDistance) {
                            maxDistance = Math.sqrt(point.x * point.x + point.y * point.y);
                        }
                    }
                    
                    // rescale all points so the farthest one out is 240 away from center
                    let ratio = (canvasWidth / 2 - 10) / maxDistance;
                    for(let point of timeplot.points){
                        point.x *= ratio;
                        point.y *= ratio;
                    }

                    resetClipsOutputs();
                }}
            className="globalBtn"
            >
                Random Walk
            </button>
        </div>
    )
}