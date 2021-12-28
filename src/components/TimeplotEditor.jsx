import React from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";

import { canvasWidth, canvasHeight } from "../App.jsx";

// matplotlib default colors, omage to Realisr 1
const lineColors = ['#008fd5', '#fc4f30', '#e5ae38', '#6db04f', '#aaa', '#810f7c'];

export default function TimeplotEditor({ resetClipsOutputs, timeplot }){
    const sketch = p5 => {
        p5.setup = () => p5.createCanvas(canvasWidth, canvasHeight);
    
        p5.draw = () => {
            p5.background('#444');
            p5.strokeWeight(2);
            if(timeplot.length == 1){
                p5.push();
                p5.fill(lineColors[0]);
                p5.noStroke();
                p5.ellipse(canvasWidth / 2, canvasHeight / 2, 6);
                p5.pop();
            }
            for(let i = 1; i < timeplot.length; i++){
                const color = lineColors[(i-1) % 6];

                // line 
                p5.push();
                p5.noFill();
                p5.stroke(color);
                let [prevX, prevY] = [timeplot[i-1].x, -timeplot[i-1].y];
                let [x, y] = [timeplot[i].x, -timeplot[i].y];
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
                timeplot.push({ x: p5.mouseX - (canvasWidth / 2), y: - p5.mouseY + (canvasHeight / 2) });
                resetClipsOutputs();
            }
        }
    
        p5.keyPressed = e => {
            if(e.key === "Backspace"){
                if (timeplot.length > 1) {
                    timeplot.splice(timeplot.length - 1, 1);
                    resetClipsOutputs();
                }
            }
        }
    }

    return (
        <ReactP5Wrapper sketch={sketch}/>
    )
}