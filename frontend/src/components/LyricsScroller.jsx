import React, { useEffect, useRef, useState } from 'react';

const LyricsScroller = ({ lyrics, isPlaying, startTime }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!isPlaying) return;
        const interval = setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000;
            const idx = Math.min(Math.floor(elapsed / 3), lyrics.length - 1);
            setActiveIndex(idx);
            
            if(containerRef.current) {
                const el = containerRef.current.children[idx];
                if(el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 500);

        return () => clearInterval(interval);
    }, [isPlaying, startTime, lyrics.length]);

    return (
        <div ref={containerRef} className="lyrics-box">
            {lyrics.map((line, i) => (
                <div key={i} className={`lyric-line ${i === activeIndex ? 'active' : ''}`}>
                    {line}
                </div>
            ))}
        </div>
    );
};

export default LyricsScroller;