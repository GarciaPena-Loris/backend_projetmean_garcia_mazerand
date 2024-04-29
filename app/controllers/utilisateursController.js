const utilisateurService = require('../services/utilisateursService');
const bcrypt = require('bcrypt');

class UtilisateurController {

    async getUtilisateurs(req, res) {
        console.info('Controller: getUtilisateurs');
        try {
            const utilisateurs = await utilisateurService.getUtilisateurs();
            res.status(200).json(utilisateurs);
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({error: 'Internal Server Error:' + error.message});
        }
    }

    async createUtilisateur(req, res) {
        console.info('Controller: createUtilisateur');
        try {
            const utilisateur = req.body.utilisateur;
            const createdUtilisateur = await utilisateurService.createUtilisateur(utilisateur);
            res.status(201).json(createdUtilisateur);
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({error: 'Internal Server Error:' + error.message});
        }
    }

    async deleteUtilisateur(req, res) {
        console.info('Controller: deleteUtilisateur');
        try {
            const utilisateurId = req.params.id;
            await utilisateurService.deleteUtilisateur(utilisateurId);
            res.status(204).send();
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({error: 'Internal Server Error:' + error.message});
        }
    }

    async register(req, res) {
        console.info('Controller: register');
        try {
            const utilisateur = req.body.utilisateur;
            utilisateur.mdp = await bcrypt.hash(utilisateur.mdp, 10);
            const createdUtilisateur = await utilisateurService.createUtilisateur(utilisateur);
            res.status(201).json(createdUtilisateur);
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({error: 'Internal Server Error:' + error.message});
        }
    }

    async login(req, res) {
        console.info('Controller: login');
        try {
            const utilisateur = await utilisateurService.getUtilisateurByEmail(req.body.mail);
            if (utilisateur && await bcrypt.compare(req.body.mdp, utilisateur.mdp)) {
                return res.json(utilisateur); // Login successful
            }
            throw new Error('Invalid email or password');
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({error: 'Internal Server Error:' + error.message});
        }
    }

}

module.exports = new UtilisateurController();
