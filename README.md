# Realisr 2 🕰️
Ground-up reboot of Realisr as a client-side-only webapp with way more features!

https://realisr2.netlify.app

![image](https://user-images.githubusercontent.com/56745633/147755892-50d33fd7-19fa-4268-a314-e39bfa3c347b.png)

[Realisr 1](https://github.com/apc518/realisr.git) was written in Python and was not well optimized.

[Realisr 2](https://realisr2.netlify.app) is written in JavaScript and Rust, taking advantage of WebAssembly for increased performance.

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
