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
    utilisateursController.getUtilisateurs();
});

// POST new user
app.post('/api/utilisateurs', (req, res) => {
    utilisateursController.createUtilisateur(req.body);
});

// PUT update user
app.put('/api/utilisateurs/:id', (req, res) => {
    utilisateursController.updateUtilisateur(req.params.id, req.body);
});

// DELETE user
app.delete('/api/utilisateurs/:id', (req, res) => {
    utilisateursController.deleteUtilisateur(req.params.id);
});

// Register new user
app.post('/api/register', (req, res) => {
    utilisateursController.register(req.body);
});

// Login user
app.post('/api/login', (req, res, next) => {
    utilisateursController.login(req, res, next);
});


// Routes pour les biens
app.get('/api/biens', (req, res) => {
    biensController.getBiens();
});

app.get('/api/biens/:id', (req, res) => {
    biensController.getBienById(req.params.id);
});

app.get('/api/lastBienId', (req, res) => {
    biensController.getLastBienId();
});

app.post('/api/bien', (req, res) => {
    biensController.createBien(req.body.bien);
});

app.put('/api/bien', (req, res) => {
    biensController.updateBien(req.body.bien);
});

app.delete('/api/bien/:id', (req, res) => {
    biensController.deleteBien(req.params.id);
});

app.post('/api/creerBienAleatoire', (req, res) => {
    biensController.createBienAleatoire(req.body.mailProprio);
});

app.post('/api/creerMultipleBienAleatoire', (req, res) => {
    biensController.createMultipleBienAleatoire(req.body.nombreBien);
});

app.post('/api/creerMultipleBiensFromCityAleatoire', (req, res) => {
    biensController.createMultipleBiensFromCityAleatoire(req.body.nombreBien, req.body.city);
});

app.post('/api/biens/search', (req, res) => {
    const {criteria} = req.body;
    biensController.getBiensByCriteria(criteria);
});


// Routes pour les locations
app.get('/api/locations', (req, res) => {
    locationsController.getLocations();
});

app.get('/api/locations/:bienId', (req, res) => {
    locationsController.getLocationByBienId(req.params.bienId);
});

app.post('/api/location', (req, res) => {
    console.info(req.body);
    locationsController.createLocation(req.body.location);
});

app.put('/api/location', (req, res) => {
    locationsController.updateLocation(req.body.location);
});

app.delete('/api/location/:id', (req, res) => {
    locationsController.deleteLocation(req.params.id);
});

app.post('/api/creerFausseReservation', (req, res) => {
    locationsController.createFakeReservations();
});
app.get('/api/afficherFausseReservation', (req, res) => {
    locationsController.showFakeReservations();
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