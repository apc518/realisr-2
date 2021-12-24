# Realisr 2 🕰️
Ground-up reboot of Realisr as a client-side-only webapp with way more features

[Realisr 1](https://github.com/apc518/realisr.git) was written in Python and was not well optimized.

Realisr 2 is written in JavaScript and Rust, taking advantage of WebAssembly for increased performance.

## Setup

Must have [Node.js](https://nodejs.org/) and [Rust](https://www.rust-lang.org/tools/install) installed.
```sh
git clone https://github.com/apc518/realisr-2.git
cd realisr-2
npm ci
npm run build
npm run dev
```

## New Features (WIP)

- Live Editor: a simple click-and-drag editor that enables manual creation of timeplots
- Subdivisions: smooth out timeplots to create even weirder sounds
