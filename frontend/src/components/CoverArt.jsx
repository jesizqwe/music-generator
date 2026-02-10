import React, { useEffect, useRef } from 'react';

const CoverArt = ({ data, width = 150, height = 150 }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        const { bg, pattern, title, artist } = data;

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.lineWidth = 2;
        if (pattern === 0) {
            for(let i=0; i<width; i+=20) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
            }
        } else {
            for(let i=0; i<10; i++) {
                ctx.beginPath();
                ctx.arc(Math.random()*width, Math.random()*height, Math.random()*50, 0, Math.PI*2);
                ctx.stroke();
            }
        }

        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.shadowColor="rgba(0,0,0,0.8)";
        ctx.shadowBlur=4;

        ctx.font = "bold 16px Arial";
        const words = title.split(' ');
        let y = height / 2 - 10;
        words.forEach((word, i) => {
            ctx.fillText(word, width/2, y + (i*20));
        });

        ctx.font = "12px Arial";
        ctx.fillText(artist, width/2, height - 15);

    }, [data, width, height]);

    return <canvas ref={canvasRef} width={width} height={height} className="cover-art" />;
};

export default CoverArt;