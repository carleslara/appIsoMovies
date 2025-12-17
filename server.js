const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Ruta per servir l'index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta per obtenir les pel·lícules
app.get('/movies', (req, res) => {
    fs.readFile('movies.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error llegint el fitxer de pel·lícules.');
        }
        res.json(JSON.parse(data));
    });
});

// Ruta per afegir una nova pel·lícula
app.post('/movies', express.json(), (req, res) => {
    const newMovie = req.body;

    fs.readFile('movies.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error llegint el fitxer de pel·lícules.');

        const movies = JSON.parse(data);
        movies.push(newMovie);

        fs.writeFile('movies.json', JSON.stringify(movies, null, 2), 'utf8', (err) => {
            if (err) return res.status(500).send('Error escrivint al fitxer de pel·lícules.');
            res.status(201).send(newMovie);
        });
    });
});

// Ruta per actualitzar tota la llista (toggle vist i eliminar)
app.put('/movies', express.json(), (req, res) => {
    const updatedMovies = req.body;
    fs.writeFile('movies.json', JSON.stringify(updatedMovies, null, 2), 'utf8', (err) => {
        if (err) return res.status(500).send('Error actualitzant les pel·lícules.');
        res.status(200).send(updatedMovies);
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciat a http://localhost:${PORT}`);
});
