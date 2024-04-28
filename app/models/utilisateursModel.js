const mongoose = require('mongoose');

const utilisateurSchema = new mongoose.Schema({
                nom: 'string',
                prenom: 'string',
                mail: 'string',
                mdp: 'string',
                telephone: 'string'});

const Utilisateur = mongoose.model('utilisateurs', utilisateurSchema);

module.exports = {
    Utilisateur
}