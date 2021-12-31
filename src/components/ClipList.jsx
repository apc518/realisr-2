import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import { audioCtx, initAudioCtx, lightGrayUI, timeplot } from '../App.jsx';

export let setClipsEx;
export let clipsEx = [];

const linkColorAtRest = "#0ff";

export const resetClipsOutputs = () => {
    for (let c of clipsEx) {
        if(!(c.blob === null && c.outAudioBuffer === null && c.isRealised === false)){
            c.blob = null;
            c.outAudioBuffer = null;
            c.isRealised = false;
        }
    }
    setClipsEx([...clipsEx]); // refresh clip list
}

export default function ClipList({ clipsMessage }){
    const [linkColor, setLinkColor] = useState(linkColorAtRest);
    const [clips, setClips] = useState([]); // don't use setClips directly, use setClipsEx instead

    useEffect(() => {
        setClipsEx = (x) => {
            clipsEx = x;
            setClips(x);
        };
        clipsEx = clips;
    }, []);

    return (
        <>
        {clips.length === 0 ?
        <div style={{ paddingLeft: 10 }}>{clipsMessage}</div>
        : 
        <div style={{
            display: 'grid',
            gap: 10,
            placeItems: 'flex-start',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'auto 1fr',
            marginLeft: 10,
            height: 'fit-content'
        }}>
            {clips.map((clip, idx) => (
                <div 
                    key={idx}
                    style={{
                        width: '100%',
                        height: 'fit-content',
                        background: lightGrayUI,
                        textAlign: 'center',
                        padding: 5,
                        maxWidth: 200,
                        wordWrap: 'break-word',
                        borderRadius: 10,
                        userSelect: 'none'
                    }}
                >
                    <div
                        style={{
                            width: 16,
                            height: 16,
                            float: 'right',
                            padding: 0,
                            borderRadius: 8,
                            display: 'grid',
                            placeItems: 'center'
                        }}
                        className="closeButton"
                        onClick={() => {
                            clip.stop();
                            clips.splice(idx, 1);
                            console.log(clip, clips);
                            setClipsEx([...clips]);
                        }}
                    >
                        <svg style={{ color: '#d44' }} fill="currentColor" focusable="false" viewBox="0 0 24 24" aria-hidden="true" data-testid="CloseIcon" aria-label="fontSize medium"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
                    </div>
                    {clip.name}<br/>
                    <button
                        onClick={() => {
                            if(!audioCtx){
                                initAudioCtx();
                            }

                            if(clip.playingOut && clip.isRealised){
                                clip.stopOut();
                                setClipsEx([...clips]);
                                return;
                            }

                            if (timeplot.points.length < 2){
                                Swal.fire({
                                    icon: "error",
                                    text: "A timeplot with no segments? Not gonna work. Click around on the gray canvas!"
                                })
                            }
                            else if (clip.inAudioBuffer.numberOfChannels < 1) {
                                Swal.fire({
                                    icon: "error",
                                    text: "A file with no channels? No-can-do I'm afraid."
                                });
                            }
                            else{
                                if(!clip.isRealised) {
                                    Swal.fire({
                                        icon: 'info',
                                        text: `Realising ${clip.name}...`,
                                        showConfirmButton: false,
                                        timer: 100
                                    }).then(() => {
                                        clip.stopOut();
                                        console.time("realising");
                                        clip.realise();
                                        console.timeEnd("realising");
                                        clip.play();
                                        setClipsEx([...clips]);
                                    });
                                }
                                else{
                                    clip.stopOut();
                                    clip.play();
                                    setClipsEx([...clips]);
                                }
                            }

                        }}
                    >
                        {clip.isRealised ? (clip.playingOut ? "Stop" : "Play") : "Realise"}
                    </button>
                    <button
                        onClick={() => {
                            if(!audioCtx){
                                initAudioCtx();
                            }

                            if(clip.playingOriginal){
                                clip.stopOriginal();
                                setClipsEx([...clips]);
                            }
                            else{
                                clip.playOriginal();
                                setClipsEx([...clips]);
                            }
                        }}
                    >
                        {clip.playingOriginal ? "Stop" : "Play"} Original
                    </button>
                    { (clip.blob && clip.isRealised) ?
                        <>
                        <br/>
                        <a
                            href={clip.blob}
                            download={(() => {
                                let pos = clip.name.lastIndexOf(".");
                                let no_ext = clip.name.slice(0, pos);
                                return no_ext + "_realised.wav";
                            })()}
                            style={{
                                color: linkColor
                            }}
                            onMouseDown={() => setLinkColor("#fff")}
                            onMouseUp={() => setLinkColor("#0ff")}
                        >Download</a>
                        </>
                        :
                        <></>
                    }
                </div>
            ))}
        </div>
        }
        </>
    )
}