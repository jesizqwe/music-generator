const express = require('express');
const cors = require('cors');
const routes = require('./routes/song.routes');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const buildPath = path.resolve(__dirname, '../frontend/build');
app.use(express.static(buildPath));

app.use('/', routes);

if (require.main === module) {
    app.listen(5000, () => {
        console.log(`Server running on port 5000`);
    });
}

app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

module.exports = app;