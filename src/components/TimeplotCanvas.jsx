import React from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";
import Swal from "sweetalert2";

import { canvasWidth, canvasHeight, timeplot } from "../App.jsx";

// matplotlib default colors, omage to Realisr 1
const lineColors = ['#0099dc', '#fc4f30', '#e5ae38', '#6db04f', '#bbb', '#c12fac'];

let canvas;

export default function TimeplotEditor({ resetClipsOutputs, lightGrayUI }){
    const sketchBgColorDefault = lightGrayUI;
    const sketchBgColorOnDragover = "#111";
    let sketchBgColor = sketchBgColorDefault;

    const sketch = p5 => {
        const gotFile = f => {
            const invalidTimeplotFile = () => {
                Swal.fire({
                    icon: 'error',
                    text: `${f.name} is not a valid timeplot.`
                });
            }

            if(f.subtype === 'json'){
                const newTimeplot = f.data;
                if(Object.keys(newTimeplot).indexOf("points") < 0){
                    invalidTimeplotFile();
                }
                else{
                    for(let key of Object.keys(newTimeplot)){
                        try{
                            timeplot[key] = newTimeplot[key];
                        }
                        catch{
                            continue;
                        }
                    }
                    
                    resetClipsOutputs();
                }
            }
            else{
                invalidTimeplotFile();
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
                p5.textSize(22);
                p5.fill("#aaa");
                p5.text("Click in here to draw a timeplot", canvasWidth / 2, canvasHeight / 2 - 20);
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