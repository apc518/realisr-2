use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct WalkPoint {
    x: f32,
    y: f32,

    // this is used for the "true timeplot" mode, newly introduced in Realisr 2
    // "classic" mode is where you split the audio into equal segments first, then scale them accordingly
    path_position: f32, // length of the path up until this point. Used to calculate what the analogous position of this point would be in the input audio
    length_from_previous: f32
}


// holds data about a timeplot including the input and output audio buffers
// this struct only considers mono audio, channels are handled by javascript (since channels are independent of each other in realisr computations)
#[wasm_bindgen]
pub struct TimePlot {
    points: Vec<WalkPoint>,
    path_length: f32,
    min_x: f32,
    max_x: f32,
    in_audio_buffer: Vec<f32>,
    out_audio_buffer: Vec<f32>
}

#[wasm_bindgen]
impl TimePlot {
    pub fn add_point(&mut self, x: f32, y: f32){
        self.points.push(WalkPoint { x: x, y: y, path_position: 0.0, length_from_previous: 0.0 });
    }

    // calculate useful information about the time plot and its walkpoints
    // initialize the output buffer and return the length of the output buffer
    pub fn init(&mut self) {
        let mut length: f32 = 0.0;

        if self.points.len() == 0 { return; }

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

        let output_length = (self.in_audio_buffer.len() as f32 * ((self.max_x - self.min_x) / self.path_length)).floor() as usize;

        self.out_audio_buffer = vec![0.0; output_length];
    }

    pub fn get_path_length(&self) -> f32 {
        self.path_length
    }

    pub fn my_to_string(&self) -> String {
        format!("# of walkpoints: {}\npath_length: {}\nmin_x: {}\nmax_x: {}\nin_audio_buffer length: {}\nout_audio_buffer length: {}", 
            self.points.len(), 
            self.path_length,
            self.min_x,
            self.max_x,
            self.in_audio_buffer.len(),
            self.out_audio_buffer.len()
        )
    }
    
    fn linear_interp(&self, idx: f32) -> f32 {
        let mut ceil_idx = idx.ceil() as usize;
        let mut floor_idx = idx.floor() as usize;
        let portion = idx - (idx.floor());
        if ceil_idx >= self.in_audio_buffer.len() {
            ceil_idx = self.in_audio_buffer.len() - 1;
        }
        if floor_idx >= self.in_audio_buffer.len() {
            floor_idx = self.in_audio_buffer.len() - 1;
        }
        let diff = self.in_audio_buffer[ceil_idx] - self.in_audio_buffer[floor_idx];

        self.in_audio_buffer[floor_idx] + (portion as f32) * diff
    }
    
    pub fn compute_true_timeplot(&mut self) {
        // compute stats if stats are not initialized yet (indicated by path length being negative)
        if self.path_length < 0.0 {
            self.init();
        }
        
        // compute length of output buffer
        let output_buffer_length = self.out_audio_buffer.len();

        if output_buffer_length < 1 {
            return;
        }
        
        // web_sys::console::log_1(&format!("output_buffer_length: {}", output_buffer_length).into());
        // web_sys::console::log_1(&format!("self.out_audio_buffer.len(): {}", self.out_audio_buffer.len()).into());
        
        if self.points.len() < 2 { return } // guard against length 0 timeplots (1 point, 0 segments)
        
        // go through each walkpoint starting at the second (index 1)
        for i in 1..self.points.len() {
            // starting index in output buffer
            let start_out_idx = (output_buffer_length as f32 * ((self.points[i-1].x - self.min_x) / (self.max_x - self.min_x))).floor() as usize;
            
            // ending index in output buffer
            let end_out_idx = (output_buffer_length as f32 * ((self.points[i].x - self.min_x) / (self.max_x - self.min_x))).floor() as usize;
            
            
            // starting index in output buffer
            let in_idx_start = self.in_audio_buffer.len() as f32 * self.points[i-1].path_position / self.path_length;
            
            // ratio of segment length to segment x component. Also the speedup factor applied to the input audio for this segment
            let ratio = (self.points[i].length_from_previous / (self.points[i].x - self.points[i-1].x)).abs();
            
            // if this segment is going forwards
            if self.points[i].x > self.points[i-1].x {
                let out_interval = end_out_idx - start_out_idx;
                
                for k in 0..out_interval {
                    self.out_audio_buffer[k + start_out_idx] += self.linear_interp(k as f32 * ratio + in_idx_start);
                }
            }
            // segment goes backwards
            else if self.points[i].x < self.points[i-1].x {
                let out_interval = start_out_idx - end_out_idx;

                // web_sys::console::log_1(&format!("SEGMENT: {}, start out: {}, end out: {}, interval: {}, start in: {}", i, start_out_idx, end_out_idx, out_interval, in_idx_start).into());

                for k in 0..out_interval {
                    let output_index = start_out_idx - k - 1;
                    let input_index = k as f32 * ratio + in_idx_start;
                    self.out_audio_buffer[output_index] += self.linear_interp(input_index);
                }
            }
            // segment is vertical, do nothing
        }
        
        let mut max = self.out_audio_buffer[0];

        for i in 0..self.out_audio_buffer.len() {
            if self.out_audio_buffer[i].abs() > max {
                max = self.out_audio_buffer[i].abs();
            }
        }

        // if max is already 1.0 or less, no normalization needed
        // we dont normalize up to 0db, only push down to avoid clipping (if the user inputs a quiet file, they probably expect a quiet output)
        if max <= 1.0 {
            return;
        }

        let normalization_ratio = 1.0 / max;

        for i in 0..self.out_audio_buffer.len() {
            self.out_audio_buffer[i] *= normalization_ratio;
        }
    }
    
    pub fn generate_out_audio(&mut self) {
        for i in 0..self.in_audio_buffer.len() {
            self.out_audio_buffer.push(self.in_audio_buffer[i]);
        }
    }
    
    pub fn populate_input_audio_buffer(&mut self, val: &JsValue) {
        let f32_arr = js_sys::Float32Array::new(val);
        self.in_audio_buffer = f32_arr.to_vec();
    }

    pub fn get_out_audio_buffer(&self) -> *const f32 {
        self.out_audio_buffer.as_ptr()
    }

    pub fn get_out_audio_buffer_length(&self) -> usize {
        self.out_audio_buffer.len()
    }

    pub fn new() -> TimePlot{
        console_error_panic_hook::set_once();

        TimePlot{
            points: vec![],
            path_length: -1.0, // construct with nonsense value to indicate that this timeplot is uninitialized
            min_x: f32::INFINITY,
            max_x: f32::NEG_INFINITY,
            in_audio_buffer: vec![],
            out_audio_buffer: vec![]
        }
    }
}