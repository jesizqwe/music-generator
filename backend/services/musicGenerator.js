const PRNG = require('./prng');

class MusicGenerator {
    static generateNotes(seed, durationSec = 15) {
        const rng = new PRNG(seed);
        const notes = [];
        const scales = [
            [261.63, 293.66, 329.63, 392.00, 440.00], 
            [220.00, 246.94, 293.66, 329.63, 392.00], 
            [261.63, 311.13, 349.23, 392.00, 466.16]  
        ];
        const scale = scales[rng.nextInt(0, scales.length - 1)];
        let currentTime = 0;
        while (currentTime < durationSec) {
            const noteFreq = scale[rng.nextInt(0, scale.length - 1)] * (Math.random() > 0.8 ? 2 : 1);
            const duration = 0.2 + rng.next() * 0.4;
            notes.push({ freq: noteFreq, start: currentTime, duration: duration });
            currentTime += duration;
        }
        return notes;
    }
}

module.exports = MusicGenerator;