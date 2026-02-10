import React, { useEffect, useRef } from 'react';

const AudioPlayer = ({ notes, isPlaying, onEnded }) => {
    const audioCtxRef = useRef(null);
    const timeoutIdsRef = useRef([]);
    const activeNodesRef = useRef([]);

    useEffect(() => {
        if (isPlaying) {
            if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
            const ctx = audioCtxRef.current;
            if (ctx.state === 'suspended') ctx.resume();

            const now = ctx.currentTime;
            
            activeNodesRef.current = [];

            notes.forEach(note => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.type = note.freq > 400 ? 'sine' : 'triangle';
                osc.frequency.value = note.freq;
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                const t = now + note.start;
                osc.start(t);

                gain.gain.setValueAtTime(0.1, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + note.duration);
                osc.stop(t + note.duration);

                activeNodesRef.current.push(osc, gain);
            });

            const totalDuration = notes.length > 0 ? notes[notes.length-1].start + notes[notes.length-1].duration + 0.5 : 0;
            const endTimer = setTimeout(onEnded, totalDuration * 1000);
            timeoutIdsRef.current.push(endTimer);
        }

        return () => {
            activeNodesRef.current.forEach(node => {
                try {
                    if (node.stop) node.stop(); 
                    node.disconnect();
                } catch (e) {}
            });
            activeNodesRef.current = [];
            
            timeoutIdsRef.current.forEach(clearTimeout);
            timeoutIdsRef.current = [];
        };
    }, [isPlaying, notes, onEnded]);

    return null;
};

export default AudioPlayer;