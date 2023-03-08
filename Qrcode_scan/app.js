// const QRCode = require('qrcode');
// const express = require('express');
// const app = express();
// const moviesData = require('./movies.json');
// const movies = moviesData.movies;
// // Generate a unique link each time the script is run
// const generateLink = async () => {
//   const randomMovies = movies.sort(() => Math.random() - 0.5).slice(0, 5);
//   const link = `https://example.com/movies/?movies=${randomMovies.map(movie => movie.id).join(',')}`;
//   const qrCode = await QRCode.toDataURL(link);
//   return qrCode;
// };



// // Define an endpoint for scanning the QR code
// app.get('/movies/:id', async (req, res) => {
//   const id = req.params.id;
//   const movie = movies.find(movie => movie.id === id);
//   if (!movie) {
//     return res.status(404).send('Movie not found');
//   }
//   res.send(movie);
// });


// // Start the server
// const port = 3000;
// const server = app.listen(port, async () => {
//   const link = await generateLink();
//   console.log(`Server started on port ${port}`);
//   console.log(`Generated link: ${link}`);
// });




//Create a database schema with a table for storing movie data. This can be done using Sequelize ORM's model definition syntax.
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'postgres',
});

const Movie = sequelize.define('Movie', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  director: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});


//Read the movie data from the JSON file and use it to populate the database. This can be done using Node.js's built-in fs module to read the file and JSON.parse() to parse the data.
const fs = require('fs');
const moviesData = JSON.parse(fs.readFileSync('movies.json'));

for (const movieData of moviesData) {
  await Movie.create({
    title: movieData.title,
    director: movieData.director,
    year: movieData.year,
    genre: movieData.genre,
  });
}


//Define a route handler for generating the QR code. This route handler should generate a random selection of 5 movies from the database and encode the data as a JSON object. This JSON object can then be used to generate a QR code using a third-party library such as qrcode.
const qrcode = require('qrcode');
const express = require('express');
const router = express.Router();

router.get('/movies', async (req, res) => {
  const movies = await Movie.findAll({
    order: Sequelize.literal('random()'),
    limit: 5,
  });

  const movieData = movies.map(movie => ({
    title: movie.title,
    director: movie.director,
    year: movie.year,
    genre: movie.genre,
  }));

  const jsonData = JSON.stringify(movieData);
  const qrCode = await qrcode.toDataURL(jsonData);

  res.send(`<img src="${qrCode}"/>`);
});
