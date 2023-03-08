const QRCode = require('qrcode');
const express = require('express');
const app = express();
const moviesData = require('./movies.json');
const movies = moviesData.movies;
// Generate a unique link each time the script is run
const generateLink = async () => {
  const randomMovies = movies.sort(() => Math.random() - 0.5).slice(0, 5);
  const link = `https://example.com/movies/?movies=${randomMovies.map(movie => movie.id).join(',')}`;
  const qrCode = await QRCode.toDataURL(link);
  return qrCode;
};

//healthcheck endpoint
app.get("/", (req, res) => {
  res.json({ message: "Welcome to pocketLawyer application." });
});


// Define an endpoint for scanning the QR code
app.get('/movies/:id', async (req, res) => {
  const id = req.params.id;
  const movie = movies.find(movie => movie.id === id);
  if (!movie) {
    return res.status(404).send('Movie not found');
  }
  res.send(movie);
});


// Start the server
const port = 3000;
const server = app.listen(port, async () => {
  const link = await generateLink();
  console.log(`Server started on port ${port}`);
  console.log(`Generated link: ${link}`);
});




