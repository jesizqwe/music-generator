import React from 'react';
import SongDetail from './SongDetail';

const SongModal = ({ song, onClose }) => {
    if (!song) return null;

    // Закрытие по клику на затемненный фон
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>&times;</button>
                <SongDetail song={song} />
            </div>
        </div>
    );
};

export default SongModal;