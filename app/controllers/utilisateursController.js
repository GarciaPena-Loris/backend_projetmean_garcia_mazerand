const utilisateurService = require('../services/utilisateursService');
const bcrypt = require('bcrypt');

class UtilisateurController {

    async handleAsync(fn) {
        return async (req, res, next) => {
            try {
                await fn(req, res, next);
            } catch (error) {
                console.error('Controller Error:', error.message);
                res.status(500).json({ error: 'Internal Server Error:' + error.message });
            }
        };
    }

    async getUtilisateurs(req, res) {
        console.info('Controller: getUtilisateurs');
        const utilisateurs = await utilisateurService.getUtilisateurs();
        res.status(200).json(utilisateurs);
    }

    async createUtilisateur(req, res) {
        console.info('Controller: createUtilisateur', req.body.utilisateur);
        const utilisateur = req.body.utilisateur;
        const createdUtilisateur = await utilisateurService.createUtilisateur(utilisateur);
        res.status(201).json(createdUtilisateur);
    }

    async updateUtilisateur(req, res) {
        console.info('Controller: updateUtilisateur', req.params.utilisateurId, req.body.utilisateur);
        const utilisateurId = req.params.utilisateurId;
        const utilisateur = req.body.utilisateur;
        const updatedUtilisateur = await utilisateurService.updateUtilisateur(utilisateurId, utilisateur);
        res.status(200).json(updatedUtilisateur);
    }

    async deleteUtilisateur(req, res) {
        console.info('Controller: deleteUtilisateur', req.params.utilisateurId);
        const utilisateurId = req.params.utilisateurId;
        await utilisateurService.deleteUtilisateur(utilisateurId);
        res.status(204).send();
    }

    async register(req, res) {
        console.info('Controller: register', req.body.utilisateur);
        const utilisateur = req.body.utilisateur;
        utilisateur.mdp = await bcrypt.hash(utilisateur.mdp, 10);
        const createdUtilisateur = await utilisateurService.createUtilisateur(utilisateur);
        res.status(201).json(createdUtilisateur);
    }

    async login(req, res, next) {
        console.info('Controller: login', req.body.mail);
        try {
            const utilisateur = await utilisateurService.getUtilisateurByEmail(req.body.mail);
            if (utilisateur && await bcrypt.compare(req.body.mdp, utilisateur.mdp)) {
                return res.json(utilisateur); // Login successful
            }
            throw new Error('Invalid email or password');
        } catch (error) {
            next(error); // Pass the error to the Express error handler
        }
    }

}

module.exports = new UtilisateurController();
