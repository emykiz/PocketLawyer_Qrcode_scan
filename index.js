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
