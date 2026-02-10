function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

function audioBufferToWav(abuffer) {
    const numOfChan = abuffer.numberOfChannels;
    const length = abuffer.length * numOfChan * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
    const channels = [];
    let i;
    let sample;
    let offset = 0;
    let pos = 0;

    writeString(view, 0, 'RIFF');
    view.setUint32(4, length - 8, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numOfChan, true);
    view.setUint32(24, abuffer.sampleRate, true);
    view.setUint32(28, abuffer.sampleRate * 2 * numOfChan, true);
    view.setUint16(32, numOfChan * 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, length - 44, true);

    for (i = 0; i < abuffer.numberOfChannels; i++) {
        channels.push(abuffer.getChannelData(i));
    }

    while (pos < abuffer.length) {
        for (i = 0; i < numOfChan; i++) {
            sample = Math.max(-1, Math.min(1, channels[i][pos]));
            sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
            view.setInt16(44 + offset, sample, true);
            offset += 2;
        }
        pos++;
    }

    return new Blob([view], { type: "audio/wav" });
}

export const generateSimpleWav = async (notes) => {
    const duration = 15; 
    const sampleRate = 44100;
    const offlineCtx = new OfflineAudioContext(1, sampleRate * duration, sampleRate);

    notes.forEach(note => {
        const osc = offlineCtx.createOscillator();
        const gain = offlineCtx.createGain();
        
        osc.type = note.freq > 400 ? 'sine' : 'triangle';
        osc.frequency.value = note.freq;
        
        osc.connect(gain);
        gain.connect(offlineCtx.destination);
        
        gain.gain.setValueAtTime(0.1, note.start);
        gain.gain.exponentialRampToValueAtTime(0.001, note.start + note.duration);
        
        osc.start(note.start);
        osc.stop(note.start + note.duration);
    });

    const renderedBuffer = await offlineCtx.startRendering();

    return audioBufferToWav(renderedBuffer);
};