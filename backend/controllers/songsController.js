const PRNG = require('../services/prng');
const MusicGenerator = require('../services/musicGenerator');
const locales = require('../data/locales');

exports.getSongs = (req, res) => {
    const { page = 1, seed, locale = 'en-US', avgLikes = 5, mode = 'table' } = req.query;
    
    const pageSize = mode === 'table' ? 10 : 20;
    const data = [];
    const startIndex = (parseInt(page) - 1) * pageSize;

    const resData = locales[locale] || locales['en-US'];

    for (let i = 0; i < pageSize; i++) {
        const index = startIndex + i + 1;
        
        const contentRng = new PRNG(`${seed}_${index}`);
        
        const adj = resData.adjectives[contentRng.nextInt(0, resData.adjectives.length - 1)];
        const noun = resData.nouns[contentRng.nextInt(0, resData.nouns.length - 1)];
        const title = `${adj} ${noun}`;
        
        const artist = resData.artists[contentRng.nextInt(0, resData.artists.length - 1)];
        const album = contentRng.next() > 0.3 
            ? resData.albums[contentRng.nextInt(0, resData.albums.length - 1)] 
            : resData.singleAlbum;
        const genre = resData.genres[contentRng.nextInt(0, resData.genres.length - 1)];

        const likesRng = new PRNG(`${seed}_${index}_likes`);
        let likesCount = 0;
        const p = Math.min(Math.max(parseFloat(avgLikes), 0), 10) / 10;
        for(let k=0; k<10; k++) {
            if (likesRng.next() < p) likesCount++;
        }

        const reviewTemplate = resData.reviewTemplates[contentRng.nextInt(0, resData.reviewTemplates.length - 1)];
        const review = reviewTemplate.replace("{adj}", adj).replace("{noun}", noun).replace("{genre}", genre);

        const lyrics = [];
        for(let l=0; l<5; l++) {
            lyrics.push(`${resData.nouns[contentRng.nextInt(0, resData.nouns.length-1)]}, ${resData.adjectives[contentRng.nextInt(0, resData.adjectives.length-1)]} ${resData.nouns[contentRng.nextInt(0, resData.nouns.length-1)]}...`);
        }

        const coverRng = new PRNG(`${seed}_${index}_cover`);
        const colors = ["#BB86FC", "#03DAC6", "#CF6679", "#FFB74D", "#A1887F"];
        const bg = colors[coverRng.nextInt(0, colors.length - 1)];
        const pattern = coverRng.nextInt(0, 2);
        const coverData = { bg, pattern, title, artist };

        const notes = MusicGenerator.generateNotes(`${seed}_${index}`);

        data.push({
            id: index,
            title,
            artist,
            album,
            genre,
            likes: likesCount,
            review,
            lyrics,
            notes,
            coverData
        });
    }

    res.json({
        data,
        page: parseInt(page),
        total: 100000
    });
};