import React from "react";
import { Buffer } from 'buffer';
import { ReactP5Wrapper } from "react-p5-wrapper";
import Swal from "sweetalert2";
import { cloneDeep } from "lodash";

import { canvasWidth, canvasHeight, timeplot, timeplotDefault } from "../App.jsx";

import { resetClipsOutputs } from "./ClipList.jsx";

export const fitTimeplotToCanvas = (scaleUp=false) => {
    let oneIsOut = false; // whether at least one point is outside the canvas border

    let maxDistance = -1;
    for(let point of timeplot.points) {
        if(point.x > canvasWidth/2 || point.y > canvasHeight/2 || point.x < -canvasWidth/2 || point.y < -canvasHeight/2){
            oneIsOut = true;
        }
        if(Math.sqrt(point.x * point.x + point.y * point.y) > maxDistance) {
            maxDistance = Math.sqrt(point.x * point.x + point.y * point.y);
        }
    }

    if(!oneIsOut && !scaleUp) return;
    
    // rescale all points so the farthest one out is just inside the border
    let ratio = (canvasWidth / 2 - 10) / maxDistance;
    for(let point of timeplot.points){
        point.x *= ratio;
        point.y *= ratio;
        
    }
}

export const invalidTimeplotFile = (filename, details) => {
    Swal.fire({
        icon: 'error',
        html: `${filename} is not a valid timeplot.<br/>Details: ${details}`
    });
}

export const loadTimeplotObj = (newTimeplot, name) => {
    try{
        // try to read and confirm type of points field
        if(!("points" in newTimeplot)){
            throw new Error("Field 'points' was not found.");
        }

        if(!Array.isArray(newTimeplot.points)){
            throw new Error("Field 'points' must be a list.");
        }

        if(newTimeplot.points.length < 2){
            throw new Error("Field 'points' must be a list of at least 2 points.");
        }

        for(let point of newTimeplot.points){
            if(typeof point.x !== 'number' || typeof point.y !== 'number'){
                throw new Error("Field 'points' must be a list of objects each containing an 'x' and a 'y' property, both of which must be numbers.");
            }
        }

        for(let key of Object.keys(newTimeplot)){
            // only add the field if its part of the template we have
            if(!(key in timeplotDefault)){
                throw new Error(`Field '${key}' is unrecognized.`);
            }
            else if(typeof timeplotDefault[key] !== typeof newTimeplot[key]){
                throw new Error(`Field '${key}' is recognized but has a value of type ${typeof newTimeplot[key]}. '${key}' should have a value of type ${typeof timeplotDefault[key]}.`);
            }
            else{
                timeplot[key] = newTimeplot[key];
            }
        }

        // set fields that are present in timeplotDefault but not in newTimeplot to the default value
        for(let key of Object.keys(timeplotDefault)){
            if(!(key in newTimeplot)){
                timeplot[key] = cloneDeep(timeplotDefault[key]);
            }
        }
        
        
        fitTimeplotToCanvas();
        resetClipsOutputs();

        p5sketch.draw();
    }
    catch(e){
        invalidTimeplotFile(name, e.message);
    }
}

export let p5sketch;

// these specifiy where the timeplot's own (0, 0) is on the canvas (by default, at (canvasWidth / 2, canvasHeight / 2))
let centerX;
let centerY;

let showGridLines = false;
let circleMode = false;

let selection = [0,0,0,0]; // x1, y1, x2, y2 defining a rectangular selection on the canvas
let selecting = false;

export const resetCanvasCenter = () => {
    centerX = canvasWidth / 2;
    centerY = canvasHeight / 2;
}

// matplotlib default colors, omage to Realisr 1
const lineColors = ['#0099dc', '#fc4f30', '#e5ae38', '#6db04f', '#bbb', '#c12fac'];

export default function TimeplotEditor({ lightGrayUI }){
    const sketchBgColorDefault = lightGrayUI;
    const sketchBgColorOnDragover = "#111";
    let sketchBgColor = sketchBgColorDefault;

    const sketch = p5 => {
        const gotFile = f => {
            if(f.subtype === 'json'){
                const newTimeplot = f.data;
                loadTimeplotObj(newTimeplot, f.name);
            }
            else{
                try{
                    const newTimeplot = JSON.parse(Buffer.from(f.data.slice(f.data.indexOf(",")+1), 'base64').toString());
                    loadTimeplotObj(newTimeplot, f.name);
                }
                catch{
                    invalidTimeplotFile(f.name, "Not a json file");
                }
            }
            
            sketchBgColor = sketchBgColorDefault;
            p5.draw();
        }

        const onDrop = () => {
            sketchBgColor = sketchBgColorDefault;
            p5.draw();
        }

        const onDragOver = () => {
            sketchBgColor = sketchBgColorOnDragover;
            p5.draw();
        }

        const onDragLeave = () => {
            sketchBgColor = sketchBgColorDefault;
            p5.draw();
        }

        const tryPlacePoint = (x, y) => {
            if (x < canvasWidth && x > 0 && y < canvasHeight && y > 0){
                timeplot.points.push({ x: x - centerX, y: - y + centerY });
                resetClipsOutputs();
            }
        }

        const tryDeletePoint = () => {
            if (timeplot.points.length > 0) {
                timeplot.points.splice(timeplot.points.length - 1, 1);
                resetClipsOutputs();
            }
        }

        const arrowheadSize = 8;

        const drawingFramerate = 60;
        const restingFramerate = 1;

        const backspaceHoldTime = drawingFramerate / 2; // approximately half a second
        let backspaceHoldCountdown = backspaceHoldTime;

        let drawingInCanvas = false;

        let movingPerspective = false;

        let preShapePoints = [];

        p5.setup = () => {
            let canvas = p5.createCanvas(canvasWidth, canvasHeight);
            console.log(canvas);
            canvas.drop(gotFile, onDrop);
            canvas.dragOver(onDragOver);
            canvas.dragLeave(onDragLeave);
            p5sketch = p5;
            centerX = canvasWidth / 2;
            centerY = canvasHeight / 2;
        };
    
        p5.draw = () => {
            p5.background(sketchBgColor);

            if(circleMode){
                p5.cursor(p5.CROSS);
            }
            else{
                p5.cursor(p5.ARROW);
            }

            // grid
            if(showGridLines){
                const gridLines = 10;
                const gridColor = "#5a5a5a";
                p5.push();
                p5.noFill();
                p5.stroke(gridColor);
                for(let i = 0; i < gridLines; i++){
                    // vertical lines
                    p5.line(i * canvasWidth / gridLines, 0, i * canvasWidth / gridLines, canvasHeight);
                    // horizontal lines
                    p5.line(0, i * canvasHeight / gridLines, canvasWidth, i * canvasHeight / gridLines);
                }
                p5.pop();
            }
            
            if(p5.mouseIsPressed && drawingInCanvas){
                // normal drawing
                if(p5.mouseButton === p5.CENTER){
                    if(movingPerspective){
                        centerX += (p5.mouseX - p5.pmouseX);
                        centerY += (p5.mouseY - p5.pmouseY);
                    }
                    else if(timeplot.points.length > 0){
                        movingPerspective = true;
                    }
                }
                if(!selecting && !circleMode){
                    if(p5.mouseButton === p5.LEFT && (p5.mouseX !== p5.pmouseX || p5.mouseY !== p5.pmouseY)){
                        tryPlacePoint(p5.mouseX, p5.mouseY);
                    }
                }
                // selecting (click+drag to make a rectangle)
                else if ((selecting || circleMode) && !(p5.mouseButton === p5.CENTER)){
                    // update selection
                    selection[2] = p5.mouseX - selection[0];
                    selection[3] = p5.mouseY - selection[1];

                    // lock the selection to a square if holding shift or in circle mode
                    if(p5.keyIsDown(16) || circleMode){
                        selection[2] = Math.sign(selection[2]) * Math.max(Math.abs(selection[2]), Math.abs(selection[3]));
                        selection[3] = Math.sign(selection[3]) * Math.max(Math.abs(selection[2]), Math.abs(selection[3]));
                    }    
                    
                    // draw selection
                    p5.push();
                    p5.stroke(200, 50, 50);
                    p5.strokeWeight(2);
                    p5.noFill();
                    p5.rect(...selection);
                    p5.pop();

                    if(circleMode){
                        let circleBoundingBoxSize = Math.abs(selection[2]);
                        const resolution = Math.min(200, Math.max(30, Math.floor(circleBoundingBoxSize / 2)));

                        timeplot.points = preShapePoints.slice();

                        let deltaTheta = 2 * p5.PI / resolution;
                        let radius = Math.abs(selection[2] / 2); // same as selection[3] / 2, since in circle mode selection is square
                        let centerX = selection[0] + selection[2] / 2;
                        let centerY = selection[1] + selection[3] / 2;
                        for(let theta = 0; theta < 2 * p5.PI; theta += deltaTheta){
                            timeplot.points.push({
                                x: radius * p5.cos(theta) + (centerX - canvasWidth / 2),
                                y: radius * p5.sin(theta) - (centerY - canvasHeight / 2)
                            });
                        }
                    }
                }
            }

            if(p5.keyIsDown(8)){
                backspaceHoldCountdown = p5.max(0, backspaceHoldCountdown - 1);
                
                // only delete the point if the backspace button has been held for enough time
                if(backspaceHoldCountdown === 0){
                    tryDeletePoint();
                }
            }
            else{
                backspaceHoldCountdown = backspaceHoldTime;
            }
            
            let colorCounter = 0;

            // if plot is empty,
            // draw instruction message
            if(timeplot.points.length < 1){
                p5.push()
                p5.translate(canvasWidth / 2, canvasHeight / 2); // this should always be in the actual center rather than centerX and centerY
                p5.textAlign(p5.CENTER);
                p5.textFont("Trebuchet MS");
                p5.textSize(20);
                p5.fill("#bbb");
                p5.text("Start drawing or drag and drop a timeplot file!\nRight click to draw segments one at a time,\nor left click and hold to freehand.\nUse backspace to delete segments.", 0, -20);
                p5.pop();
                return;
            }

            // draw timeplot
            p5.strokeWeight(2);
            p5.push();
            p5.translate(centerX, centerY);
            if(timeplot.points.length === 1){
                p5.push();
                p5.fill(lineColors[0]);
                p5.noStroke();
                p5.ellipse(timeplot.points[0].x, -timeplot.points[0].y, 6);                
                p5.pop();
            }
            for(let i = 1; i < timeplot.points.length; i++){
                const color = lineColors[colorCounter % 6];

                // line 
                p5.push();
                p5.noFill();
                p5.stroke(color);
                let [prevX, prevY] = [timeplot.points[i-1].x, -timeplot.points[i-1].y];
                let [x, y] = [timeplot.points[i].x, -timeplot.points[i].y];
                p5.line(prevX, prevY, x, y);
    
                // arrowhead
                // only draw the arrowhead if the length of the segment is longer than the arrowhead, or if its the last segment
                if(Math.sqrt((x - prevX) * (x - prevX) + (y - prevY) * (y - prevY)) > arrowheadSize * 2 || i === timeplot.points.length - 1){
                    p5.noStroke();
                    p5.fill(color);
                    let angle = p5.atan2(prevY - y, prevX - x);
                    p5.translate(x, y);
                    p5.rotate(angle - p5.HALF_PI);
                    p5.triangle(0, 0, -arrowheadSize/2, arrowheadSize, arrowheadSize/2, arrowheadSize);

                    colorCounter++;
                }

                p5.pop();
            }
            p5.pop();
        }

        p5.mousePressed = () => {
            // if the mouse is clicked outside the canvas
            if(p5.mouseX > canvasWidth || p5.mouseY > canvasHeight || p5.mouseX < 0 || p5.mouseY < 0){
                drawingInCanvas = false;
                return;
            }
            drawingInCanvas = true;

            p5.frameRate(drawingFramerate);
            
            if(circleMode){
                preShapePoints = timeplot.points.slice();
            }

            if(p5.keyIsDown(17)){
                selecting = true;
            }
            else{
                selecting = false;
            }
            
            if(!selecting && !circleMode){
                if(p5.mouseButton === p5.RIGHT){
                    tryPlacePoint(p5.mouseX, p5.mouseY);
                }
            }
            else{
                selecting = true;
                selection[0] = p5.mouseX;
                selection[1] = p5.mouseY;
            }
        }

        p5.mouseReleased = () => {
            p5.frameRate(restingFramerate);
            movingPerspective = false;
            p5.draw();
        }
    
        p5.keyPressed = e => {
            if(e.key === "Backspace"){
                p5.frameRate(drawingFramerate);
                tryDeletePoint();
            }
            if(e.key === "Control"){
                selecting = true;
                p5.cursor(p5.CROSS);
            }
        }

        p5.keyReleased = e => {
            if(e.key === "Backspace"){
                p5.frameRate(restingFramerate);
                backspaceHoldCountdown = backspaceHoldTime;
            }
            if(e.key === "Control"){
                selecting = false;
                p5.cursor(p5.ARROW);

            }
        }
    }

    return (
        <>
        <ReactP5Wrapper sketch={sketch} />
        <input id="gridCheckbox" type="checkbox" onClick={e => { 
            showGridLines = e.target.checked;
            p5sketch.draw();
        }}/>
        <label htmlFor="gridCheckbox">Grid</label>
        <input id="makeCircle" type="checkbox" onClick={e => { 
            circleMode = e.target.checked;
            p5sketch.draw();
        }}/>
        <label htmlFor="makeCircle">Make Circles</label>
        
        </>
    )
}