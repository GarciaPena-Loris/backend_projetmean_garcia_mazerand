const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');

require('dotenv').config()

const utilisateursController = require('./app/controllers/utilisateursController')
const biensController = require('./app/controllers/biensController')
const locationsController = require('./app/controllers/locationsController')

const app = express();
const port = process.env.PORT || 3080;

app.use(bodyParser.json());
app.use(cors())
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({message: 'Internal server error'});
});


// Routes pour les utilisateurs
// GET all users
app.get('/api/utilisateurs', (req, res) => {
    utilisateursController.getUtilisateurs(res, res);
});

// POST new user
app.post('/api/utilisateurs', (req, res) => {
    utilisateursController.createUtilisateur(req, res);
});

// DELETE user
app.delete('/api/utilisateurs/:id', (req, res) => {
    utilisateursController.deleteUtilisateur(req, res);
});

// Register new user
app.post('/api/register', (req, res) => {
    utilisateursController.register(req, res);
});

// Login user
app.post('/api/login', (req, res) => {
    utilisateursController.login(req, res);
});


// Routes pour les biens
app.get('/api/biens', (req, res) => {
    biensController.getBiens(req, res);
});

app.get('/api/biens/:id', (req, res) => {
    biensController.getBienById(req, res);
});

app.get('/api/lastBienId', (req, res) => {
    biensController.getLastBienId(req, res);
});

app.post('/api/creerBienAleatoire', (req, res) => {
    biensController.createBienAleatoire(req, res);
});

app.post('/api/creerMultipleBienAleatoire', (req, res) => {
    biensController.createMultipleBienAleatoire(req, res);
});

app.post('/api/creerMultipleBiensFromCityAleatoire', (req, res) => {
    biensController.createMultipleBiensFromCityAleatoire(req, res);
});

app.post('/api/biens/search', (req, res) => {
    biensController.getBiensByCriteria(req, res);
});


// Routes pour les locations
app.get('/api/locations', (req, res) => {
    locationsController.getLocations(req, res);
});

app.get('/api/locations/:bienId', (req, res) => {
    locationsController.getLocationByBienId(req, res);
});

app.post('/api/creerFausseReservation', (req, res) => {
    locationsController.createFakeReservations(req, res);
});

app.get('/api/afficherFausseReservation', (req, res) => {
    locationsController.showFakeReservations(req, res);
});

// Add location
app.post('/api/location/new', (req, res) => {
    locationsController.newLocation(req, res);
});

// Get date already booked
app.get('/api/location/:bienId/reservations', (req, res) => {
    locationsController.getReservationsByBienId(req, res);
});

// Get locations by user email
app.get('/api/location/:email/locations', (req, res) => {
    locationsController.getLocationsByUserEmail(req, res);
});

// Post review to location
app.post('/api/location/:id/review', (req, res) => {
    locationsController.addReviewToLocation(req, res);
});

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.send(`<h1>API Works !!!</h1>`)
});


app.listen(port, () => {
    console.info(`Server listening on the port  ${port}`);
})