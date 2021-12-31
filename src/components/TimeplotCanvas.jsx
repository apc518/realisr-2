import React from "react";
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
                invalidTimeplotFile(f.name, "Not a json file");
            }
            
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

        let movingPerspective = false;

        p5.setup = () => {
            let canvas = p5.createCanvas(canvasWidth, canvasHeight);
            canvas.drop(gotFile);
            canvas.dragOver(onDragOver);
            canvas.dragLeave(onDragLeave);
            p5sketch = p5;
            centerX = canvasWidth / 2;
            centerY = canvasHeight / 2;
        };
    
        p5.draw = () => {
            p5.background(sketchBgColor);

            if(p5.mouseIsPressed){
                if(p5.mouseButton === p5.LEFT && (p5.mouseX !== p5.pmouseX || p5.mouseY !== p5.pmouseY)){
                    tryPlacePoint(p5.mouseX, p5.mouseY);
                }
                if(p5.mouseButton === p5.CENTER){
                    if(movingPerspective){
                        centerX += (p5.mouseX - p5.pmouseX);
                        centerY += (p5.mouseY - p5.pmouseY);
                    }
                    else if(timeplot.points.length > 0){
                        movingPerspective = true;
                    }
                }
            }

            if(p5.keyIsDown(8)){
                backspaceHoldCountdown = p5.max(0, backspaceHoldCountdown - 1);
                
                // only delete the point if the backspace button has been held for enough time
                // also only delete every other frame
                if(backspaceHoldCountdown === 0){
                    tryDeletePoint();
                }
            }
            else{
                backspaceHoldCountdown = backspaceHoldTime;
            }
            
            let colorCounter = 0;

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
            p5.frameRate(drawingFramerate);
            if(p5.mouseButton === p5.RIGHT){
                tryPlacePoint(p5.mouseX, p5.mouseY);
            }
        }

        p5.mouseReleased = () => {
            p5.frameRate(restingFramerate);
            movingPerspective = false;
        }
    
        p5.keyPressed = e => {
            if(e.key === "Backspace"){
                p5.frameRate(drawingFramerate);
                tryDeletePoint();
            }
        }

        p5.keyReleased = e => {
            if(e.key === "Backspace"){
                p5.frameRate(restingFramerate);
            }
        }
    }

    return (
        <ReactP5Wrapper sketch={sketch} />
    )
}