import React, { useState } from 'react';
import Swal from 'sweetalert2';

import { AudioContext, timeplot } from '../App.jsx';

let audioCtx;

const linkColorAtRest = "#0ff";

export default function ClipList({ clips, setClips }){
    const [linkColor, setLinkColor] = useState(linkColorAtRest);

    return (
        <div style={{
            display: 'grid',
            gap: 0,
            gridTemplateColumns: 'repeat(3, 1fr)'
        }}>
            {clips.map((clip, idx) => (
                <div 
                    key={idx}
                    style={{
                        width: 'fit-content',
                        height: 'fit-content',
                        background: '#444',
                        textAlign: 'center',
                        padding: 5,
                        margin: 5,
                        maxWidth: 200,
                        wordWrap: 'break-word',
                        borderRadius: 10
                    }}
                >
                {clip.name}<br/>
                <button
                    onClick={() => {
                        if(!audioCtx){
                            audioCtx = new AudioContext();
                        }

                        if (timeplot.length < 2){
                            Swal.fire({
                                icon: "error",
                                text: "A timeplot with no segments? Not gonna work. Click around on the green canvas!"
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
                                console.time("realising");
                                clip.realise();
                                console.timeEnd("realising");
                            }
                            clip.play();
                        }

                        setClips([...clips]);
                    }}
                >
                    Realise
                </button><br/>
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