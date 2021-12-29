import React from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";
import Swal from "sweetalert2";
import { cloneDeep } from "lodash";

import { canvasWidth, canvasHeight, timeplot, timeplotDefault } from "../App.jsx";

export const invalidTimeplotFile = (filename, details) => {
    Swal.fire({
        icon: 'error',
        html: `${filename} is not a valid timeplot.<br/>Details: ${details}`
    });
}

export const loadTimeplotObj = (newTimeplot, name, resetClipsOutputs) => {
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
        
        resetClipsOutputs();
    }
    catch(e){
        invalidTimeplotFile(name, e.message);
    }
}

// matplotlib default colors, omage to Realisr 1
const lineColors = ['#0099dc', '#fc4f30', '#e5ae38', '#6db04f', '#bbb', '#c12fac'];

let canvas;

export default function TimeplotEditor({ resetClipsOutputs, lightGrayUI }){
    const sketchBgColorDefault = lightGrayUI;
    const sketchBgColorOnDragover = "#111";
    let sketchBgColor = sketchBgColorDefault;

    const sketch = p5 => {
        const gotFile = f => {
            if(f.subtype === 'json'){
                const newTimeplot = f.data;
                loadTimeplotObj(newTimeplot, f.name, resetClipsOutputs);
            }
            else{
                invalidTimeplotFile(f.name, "Not a json file");
            }
            
            sketchBgColor = sketchBgColorDefault;
        }

        const onDragOver = () => {
            sketchBgColor = sketchBgColorOnDragover;
        }

        const onDragLeave = () => {
            sketchBgColor = sketchBgColorDefault;
        }

        p5.setup = () => {
            canvas = p5.createCanvas(canvasWidth, canvasHeight);
            canvas.drop(gotFile);
            canvas.dragOver(onDragOver);
            canvas.dragLeave(onDragLeave);
        };
    
        p5.draw = () => {
            p5.background(sketchBgColor);
            p5.strokeWeight(2);
            if(timeplot.points.length == 1){
                p5.push();
                p5.fill(lineColors[0]);
                p5.noStroke();
                p5.ellipse(canvasWidth / 2, canvasHeight / 2, 6);
                p5.pop();

                p5.textAlign(p5.CENTER);
                p5.textFont("Trebuchet MS");
                p5.textSize(20);
                p5.fill("#aaa");
                p5.text("Click to draw, or drag and drop a timeplot file", canvasWidth / 2, canvasHeight / 2 - 20);
                p5.text("Press backspace to delete the last segment", canvasWidth / 2, canvasHeight / 2 + 35);
            }
            for(let i = 1; i < timeplot.points.length; i++){
                const color = lineColors[(i-1) % 6];

                // line 
                p5.push();
                p5.noFill();
                p5.stroke(color);
                let [prevX, prevY] = [timeplot.points[i-1].x, -timeplot.points[i-1].y];
                let [x, y] = [timeplot.points[i].x, -timeplot.points[i].y];
                p5.translate(canvasWidth / 2, canvasHeight / 2);
                p5.line(prevX, prevY, x, y);
    
                // arrowhead
                p5.noStroke();
                p5.fill(color);
                let angle = p5.atan2(prevY - y, prevX - x);
                p5.translate(x, y);
                p5.rotate(angle - p5.HALF_PI);
                let triSize = 8;
                p5.triangle(0, 0, -triSize/2, triSize, triSize/2, triSize);
                p5.pop();
            }
        }

        p5.mousePressed = () => {
            if (p5.mouseX < canvasWidth && p5.mouseX > 0 && p5.mouseY < canvasHeight && p5.mouseY > 0){
                timeplot.points.push({ x: p5.mouseX - (canvasWidth / 2), y: - p5.mouseY + (canvasHeight / 2) });
                resetClipsOutputs();
            }
        }
    
        p5.keyPressed = e => {
            if(e.key === "Backspace"){
                if (timeplot.points.length > 1) {
                    timeplot.points.splice(timeplot.points.length - 1, 1);
                    resetClipsOutputs();
                }
            }
        }
    }

    return (
        <ReactP5Wrapper sketch={sketch} />
    )
}