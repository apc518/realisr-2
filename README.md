# Realisr 2 🕰️
Ground-up reboot of Realisr as a client-side-only webapp with way more features!

https://chambercode.com/music/realisr2 or https://realisr2.netlify.app

![image](https://user-images.githubusercontent.com/56745633/148028104-f420b3d0-0105-496b-baa8-c60e6b7bc646.png)

[Realisr 1](https://github.com/apc518/realisr) was written in Python and was not well optimized.

[Realisr 2](https://chambercode.com/music/realisr2) is written in JavaScript and Rust, taking advantage of WebAssembly for increased performance.

## Development Setup

Must have [Node.js](https://nodejs.org/) and [Rust](https://www.rust-lang.org/tools/install) installed.

Windows users, good luck. You probably will need to install wasm-pack with the [executable](https://rustwasm.github.io/wasm-pack/installer/) but even that may not work. If you have a Linux VM, just use that. If not, you're on your own for now until I figure out how to get it to work.
```sh
git clone https://github.com/apc518/realisr-2.git
cd realisr-2
cargo install -f wasm-bindgen-cli
rustup target add wasm32-unknown-unknown
npm ci
npm run build
npm run dev
```

## Where the Name "Realisr" Comes From

The name "realisr" is a double entendre of sorts:
1. Randomized Linked Segmented Rescale. As an acronym, RLSR, it kind of sounds like "realiser". This is what the original Realisr was, and while Realisr 2 also includes RLSR functionality, it is not limited to that. This acronym is why I use the British spelling (with an 's' rather than a 'z'), even though I am American.
2. The theoretical backing of this project was projecting music from complex time into real time, so literally "making real" or "realizing".

Then the "e" is dropped from "realiser" to line up with the naming convention of my previous music apps, Flippr and Spookr. A convention that arose just because I wanted the apps to be distinct from their namesake english verbs.
