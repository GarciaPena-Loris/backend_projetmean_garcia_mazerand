const {connect, disconnect} = require('../../config/db.config');
const {Bien} = require('../models/biensModel');

class BiensRepository {

    constructor() {
        connect();
    }

    async getBiens() {
        const biens = await Bien.find({});
        console.info('Biens récupérés avec succès! ');
        return biens;
    }

    async getBienById(bienId) {
        const bien = await Bien.findOne({idBien: bienId});
        if (!bien) {
            console.info('Bien non trouvé: ' + bienId);
            return {status: 'false'};
        }
        console.info('Bien récupéré avec succès! ');
        return bien;
    }

    async getLastBienId() {
        const bien = await Bien.find({}).sort({idBien: -1}).limit(1);
        if (bien.length === 0) {
            return 0;
        }
        console.info('Dernier id : ' + bien[0].idBien);
        return bien[0].idBien;
    }

    async createBien(bien) {
        let data = {};
        try {
            data = await Bien.create(bien);
            console.info('Bien créé avec succès: ' + data);
        } catch (err) {
            console.error('Error::' + err);
        }
        return data;
    }

    async updateBien(bien) {
        let data = {};
        try {
            data = await Bien.updateOne(bien);
            console.info('Bien mis à jour avec succès: ' + data);
        } catch (err) {
            console.error('Error::' + err);
        }
        return data;
    }

    async deleteBien(bienId) {
        let data = {};
        try {
            data = await Bien.deleteOne({_id: bienId});
            console.info('Bien supprimé avec succès: ' + data);
        } catch (err) {
            console.error('Error::' + err);
        }
        return {status: `${(data.deletedCount > 0)}`};
    }

    // recherche de bien

    // biensRepository.js
    async getBiensByCriteria(criteria, biensLouesIds) {
        // Construire l'objet de critères de recherche
        const searchCriteria = {};

        // Ajouter chaque critère à l'objet de recherche s'il est fourni
        if (criteria.commune) searchCriteria.commune = criteria.commune;
        if (criteria.typeLogement) searchCriteria.typeLogement = criteria.typeLogement;
        if (criteria.prixMax) searchCriteria.prix = { $lte: criteria.prixMax };
        if (criteria.nbChambresMin) searchCriteria.nbChambres = { $gte: criteria.nbChambresMin };
        if (criteria.nbCouchagesMin) searchCriteria.nbCouchages = { $gte: criteria.nbCouchagesMin };
        if (criteria.distanceMax) searchCriteria.distance = { $lte: criteria.distanceMax };

        // Exclure les biens déjà loués
        searchCriteria.idBien = { $nin: biensLouesIds };

        // Effectuer la recherche avec les critères fournis
        return Bien.find(searchCriteria);
    }

}

module.exports = new BiensRepository();