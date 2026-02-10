class PRNG {
    constructor(seed) {
        let h = 0x811c9dc5;
        if (typeof seed === 'string') {
            for (let i = 0; i < seed.length; i++) {
                h ^= seed.charCodeAt(i);
                h = Math.imul(h, 0x01000193);
            }
        } else {
            h = seed >>> 0;
        }
        this.state = h;
    }
    next() {
        let t = this.state += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    nextInt(min, max) {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }
}

module.exports = PRNG;