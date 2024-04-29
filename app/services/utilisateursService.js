const utilisateurRepository = require('../repositories/utilisateursRepository');

class UtilisateurService {

    constructor() {}

    async getUtilisateurs() {
        return await utilisateurRepository.getUtilisateurs();
    }

    async createUtilisateur(utilisateur) {
        return await utilisateurRepository.createUtilisateur(utilisateur);
    }

    async deleteUtilisateur(utilisateurId) {
        return await utilisateurRepository.deleteUtilisateur(utilisateurId);
    }

    async getUtilisateurByEmail(email) {
        return await utilisateurRepository.getUtilisateurByEmail(email);
    }

}

module.exports = new UtilisateurService();