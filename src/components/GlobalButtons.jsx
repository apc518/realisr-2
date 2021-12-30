import React, { useState } from "react";
import Swal from "sweetalert2";

import StopIcon from '@mui/icons-material/Stop';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import SaveIcon from '@mui/icons-material/Save';
import UploadIcon from '@mui/icons-material/Upload';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';

import { timeplot, globalButtonsWidth } from "../App.jsx";
import { fitTimeplotToCanvas, loadTimeplotObj, p5sketch } from "./TimeplotCanvas.jsx";
import { clipsEx, resetClipsOutputs } from "./ClipList.jsx";

let minSegmentsInRandomWalk = 1;
let maxSegmentsInRandomWalk = 24;

const iconOffset = 40;

export default function GlobalButtons() {
    const [showRandomWalkSettings, setShowRandomWalkSettings] = useState(false);

    return (
        <>
        <div style={{
            display: 'grid',
            placeItems: "center",
            width: globalButtonsWidth
        }}>
            {/* Stop all audio */}
            <button 
                onClick={() => {
                    for(let x of clipsEx){
                        x.stop();
                    }
                }}
                className="globalBtn"
            >
                <div style={{ minWidth: iconOffset / 2 }} />
                <span style={{ flexGrow: 1 }}>
                    Stop all audio
                </span>
                <StopIcon  style={{ minWidth: iconOffset }} />
            </button>

            {/* Clear timeplot */}
            <button 
                onClick={() => {
                    timeplot.points.splice(0, timeplot.points.length);
                    resetClipsOutputs();
                    try{
                        p5sketch.draw();
                    }
                    catch{
                        console.log("The clear timeplot button was pressed before the drawing canvas was initialized.");
                    }
                }}
                className="globalBtn"
            >
                <div style={{ minWidth: iconOffset / 2 }} />
                <span style={{ flexGrow: 1 }}>
                    Clear timeplot
                </span>
                <ClearAllIcon style={{ minWidth: iconOffset }} />
            </button>

            {/* Save timeplot */}
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
            >
                <div style={{ minWidth: iconOffset / 2 }} />
                <span style={{ flexGrow: 1 }}>
                    Save timeplot as
                </span>
                <SaveIcon style={{ minWidth: iconOffset }} />
            </button>

            {/* Load timeplot */}
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
                                    loadTimeplotObj(newTimeplot, f.name);
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
            >
                <div style={{ minWidth: iconOffset / 2 }} />
                <span style={{ flexGrow: 1 }}>
                    Load timeplot
                </span>
                <UploadIcon style={{ minWidth: iconOffset }} />
            </button>

            {/* Random Walk */}
            <button
                onClick={() => {
                    timeplot.points = [{x: 0, y: 0}];
                    let numberOfSegments = Math.round(Math.random() * (maxSegmentsInRandomWalk - minSegmentsInRandomWalk) + minSegmentsInRandomWalk);
                    for(let i = 1; i <= numberOfSegments; i++){
                        let theta_min = 0;
                        let theta_max = 360 * Math.PI / 180;
                        let theta = Math.random() * (theta_max - theta_min) + theta_min;
                        let dx = Math.cos(theta);
                        let dy = Math.sin(theta);
                        timeplot.points.push({x: timeplot.points[i-1].x + dx, y: timeplot.points[i-1].y + dy});
                    }
                    
                    fitTimeplotToCanvas(true);                    
                    resetClipsOutputs();
                    p5sketch.draw();
                }}
                className="globalBtn"
            >
                <div style={{ minWidth: iconOffset / 2 }} />
                <span style={{ flexGrow: 1 }}>
                    Random Walk
                </span>
                <TransferWithinAStationIcon style={{ minWidth: iconOffset }} />
            </button>
        </div>
        
        {/* modal for random walk settings */}
        {showRandomWalkSettings ?
        <>
            <div 
                style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    width: '100vw',
                    height: '100vh',
                    background: "#000",
                    opacity: 0.5,
                    pointerEvents: 'none',
                    zIndex: 99
                }}
                onClick={e => {
                    e.preventDefault();
                    e.stopImmediatePropogation();
                    e.stopPropagation();
                    return false;
                }}
            >
            </div>
            <div style={{
                position: "fixed",
                zIndex: 100,
                transform: 'translate(-50%, -50%)',
                left: '50vw',
                top: '50vh',
                width: 600,
                height: 600,
                background: "#0f0"
            }}>
                <button onClick={() => setShowRandomWalkSettings(false)}>Okay</button>
            </div>
        </>
        : <></>}
        
        </>


    )
}