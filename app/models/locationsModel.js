const mongoose = require('mongoose');

const avisSchema = new mongoose.Schema({
    note: 'number',
    commentaire: 'string'
});

const locationSchema = new mongoose.Schema({
    idLocation: 'number',
    idBien: { type: mongoose.Schema.Types.Number, ref: 'biens' }, // référence à idBien de bienModel
    mailLoueur: { type: mongoose.Schema.Types.String, ref: 'utilisateurs' }, // référence à mail d'utilisateurModel
    dateDebut: 'number', // date sous la forme timestamp
    dateFin: 'number', // date sous la forme timestamp
    avis: avisSchema
});

const Location = mongoose.model('locations', locationSchema);

module.exports = {
    Location
}