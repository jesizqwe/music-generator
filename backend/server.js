const express = require('express');
const cors = require('cors');
const routes = require('./routes/song.routes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/', routes);

if (require.main === module) {
    app.listen(5000, () => {
        console.log(`Server running on port 5000`);
    });
}

module.exports = app;