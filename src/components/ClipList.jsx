import React, { useState } from 'react';
import Swal from 'sweetalert2';

import { initAudioCtx, lightGrayUI, timeplot } from '../App.jsx';

let audioCtx;

const linkColorAtRest = "#0ff";

export default function ClipList({ clips, setClips }){
    const [linkColor, setLinkColor] = useState(linkColorAtRest);

    return (
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
                            clips.splice(idx, 1);
                            setClips([...clips]);
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
                                        console.time("realising");
                                        clip.realise();
                                        console.timeEnd("realising");
                                        clip.play();
                                        setClips([...clips]);
                                    });
                                }
                                else{
                                    clip.play();
                                    setClips([...clips]);
                                }
                            }

                        }}
                    >
                        {clip.isRealised ? "Play" : "Realise"}
                    </button>
                    <button
                        onClick={() => {
                            if(!audioCtx){
                                initAudioCtx();
                            }

                            clip.playOriginal();
                        }}
                    >
                        Play Original
                    </button>
                    <br/>
                    {
                        (clip.blob && clip.isRealised) ? 
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
                        : <button
                            onClick={() => { 
                                clip.generateDownload();
                                setClips([...clips]);
                            }}
                            disabled={!clip.isRealised}
                        >Generate Download</button>
                    }
                </div>
            ))}
        </div>
    )
}