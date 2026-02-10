import React, { useState } from 'react';
import CoverArt from './CoverArt';
import AudioPlayer from './AudioPlayer';
import LyricsScroller from './LyricsScroller';

const SongDetail = ({ song }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [playStartTime, setPlayStartTime] = useState(0);

    const handlePlay = () => {
        if(isPlaying) {
            setIsPlaying(false);
        } else {
            setPlayStartTime(Date.now());
            setIsPlaying(true);
        }
    };

    const handleEnded = () => setIsPlaying(false);

    return (
        <div className="detail-content">
            <div className="cover-art" style={{width: 150, height: 150}} onClick={handlePlay}>
                <CoverArt data={song.coverData} width={150} height={150} />
                <div className="play-overlay">
                    <span className="play-icon">{isPlaying ? '❚❚' : '▶'}</span>
                </div>
            </div>
            <div className="song-info">
                <h3>{song.title}</h3>
                <p style={{color: 'var(--primary-color)'}}>{song.artist}</p>
                <p>{song.album} • {song.genre}</p>
                <p className="likes-badge">★ {song.likes}</p>
                <p style={{fontStyle: 'italic', marginTop: '10px'}}>"{song.review}"</p>
                
                {isPlaying && (
                     <LyricsScroller lyrics={song.lyrics} isPlaying={isPlaying} startTime={playStartTime} />
                )}
            </div>
            <AudioPlayer notes={song.notes} isPlaying={isPlaying} onEnded={handleEnded} />
        </div>
    );
};

export default SongDetail;