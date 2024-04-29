const {connect, disconnect} = require('../../config/db.config');
const {Utilisateur} = require('../models/utilisateursModel');

class UtilisateurRepository {

    constructor() {
        connect();
    }

    async getUtilisateurs() {
        const utilisateurs = await Utilisateur.find({});
        console.info('Utilisateurs récupérés avec succès! ');
        return utilisateurs;
    }

    async getUtilisateurByEmail(mail) {
        const utilisateur = await Utilisateur.findOne({mail: mail});
        console.info('Utilisateur récupéré avec succès! ' );
        return utilisateur;
    }

    async createUtilisateur(utilisateur) {
        let data = {};
        try {
            data = await Utilisateur.create(utilisateur);
            console.info('Utilisateur créé avec succès: ' + data);
        } catch (err) {
            console.error('Error::' + err);
        }
        return data;
    }

    async deleteUtilisateur(utilisateurId) {
        let data = {};
        try {
            data = await Utilisateur.deleteOne({_id: utilisateurId});
            if (data.deletedCount === 0) {
                console.info('Utilisateur non trouvé: ' + utilisateurId);
                return {status: 'false'};
            }
            console.info('Utilisateur supprimé avec succès: ' + data);
        } catch (err) {
            console.error('Error::' + err);
        }
        return {status: `${(data.deletedCount > 0)}`};
    }

}

module.exports = new UtilisateurRepository();