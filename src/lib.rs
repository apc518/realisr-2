use wasm_bindgen::prelude::*;

extern crate web_sys;

#[wasm_bindgen]
pub struct WalkPoint {
    x: f64,
    y: f64,
    path_position: f64, // length of the path up until this point. Used to calculate what the analogous position of this point would be in the input audio
    length_from_previous: f64
}

#[wasm_bindgen]
pub struct TimePlot {
    points: Vec<WalkPoint>,
    path_length: f64,
    min_x: f64,
    max_x: f64
}

#[wasm_bindgen]
impl TimePlot {
    pub fn add_point(&mut self, x: f64, y: f64){
        self.points.push(WalkPoint { x: x, y: y, path_position: 0.0, length_from_previous: 0.0 });
    }

    // calculate useful information about the time plot and its walkpoints
    pub fn calc_stats(&mut self) {
        let mut length: f64 = 0.0;

        if self.points.len() == 0 { return }

        self.min_x = self.points[0].x;
        self.max_x = self.points[0].x;

        for i in 1..self.points.len(){
            // check if this point has the max or min x value
            if self.points[i].x > self.max_x {
                self.max_x = self.points[i].x;
            }
            if self.points[i].x < self.min_x {
                self.min_x = self.points[i].x;
            }

            // calculate length between this point and the previous point
            let delta_x = self.points[i].x - self.points[i-1].x;
            let delta_y = self.points[i].y - self.points[i-1].y;
            let this_segments_length = (delta_x * delta_x + delta_y * delta_y).sqrt();
            
            // update this points segment length
            self.points[i].length_from_previous = this_segments_length;
            
            // update total length
            length += this_segments_length;

            // update length up until this point
            self.points[i].path_position = length;
        }

        self.path_length = length;
    }

    pub fn get_path_length(&self) -> f64 {
        self.path_length
    }

    pub fn my_to_string(&self) -> String {
        format!("# of walkpoints: {}\npath_length: {}\nmin_x: {}\nmax_x: {}", self.points.len(), self.path_length, self.min_x, self.max_x)
    }

    pub fn new() -> TimePlot{
        TimePlot{
            points: vec![],
            path_length: 0.0,
            min_x: f64::INFINITY,
            max_x: f64::NEG_INFINITY
        }
    }
}