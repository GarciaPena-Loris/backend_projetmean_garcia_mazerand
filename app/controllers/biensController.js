const biensService = require('../services/biensService');

class BiensController {

    async getBiens(req, res) {
        console.info('Controller: getBiens');
        try {
            const biens = await biensService.getBiens();
            res.status(200).json(biens);
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({error: 'Internal Server Error: ' + error.message});
        }
    }

    async getBienById(req, res) {
        console.info('Controller: getBienById');
        try {
            const bienId = req.params.id;
            const bien = await biensService.getBienById(bienId);
            res.status(200).json(bien);
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({error: 'Internal Server Error: ' + error.message});
        }
    }

    async getLastBienId(req, res) {
        console.info('Controller: getLastBienId');
        try {
            const lastBienId = await biensService.getLastBienId();
            res.status(200).json(lastBienId);
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({error: 'Internal Server Error: ' + error.message});
        }
    }

    async createBien(req, res) {
        console.info('Controller: createBien');
        try {
            const bien = req.body.bien;
            const createdBien = await biensService.createBien(bien);
            res.status(201).json(createdBien);
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({error: 'Internal Server Error: ' + error.message});
        }
    }

    async updateBien(req, res) {
        console.info('Controller: updateBien');
        try {
            const bien = req.body.bien;
            const updatedBien = await biensService.updateBien(bien);
            res.status(200).json(updatedBien);
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({error: 'Internal Server Error: ' + error.message});
        }
    }

    async deleteBien(req, res) {
        console.info('Controller: deleteBien');
        try {
            const bienId = req.params.bienId;
            await biensService.deleteBien(bienId);
            res.status(204).send();
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({error: 'Internal Server Error: ' + error.message});
        }
    }

    async createBienAleatoire(req, res) {
        console.info('Controller: createBienAleatoire');
        try {
            const mailProprio = req.body.mailProprio;
            const createdBien = await biensService.createBienAleatoire(mailProprio);
            res.status(201).json(createdBien);
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({error: 'Internal Server Error: ' + error.message});
        }
    }

    async createMultipleBienAleatoire(req, res) {
        console.info('Controller: createMultipleBien');
        try {
            const nombreBien = req.body.nombreBien;
            const createdBiens = await biensService.createMultipleBiensAleatoire(nombreBien);
            res.status(201).json(createdBiens);
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({error: 'Internal Server Error: ' + error.message});
        }
    }

    async createMultipleBiensFromCityAleatoire(req, res) {
        console.info('Controller: createMultipleBiensFromCityAleatoire');
        try {
            const nombreBien = req.body.nombreBien;
            const city = req.body.city;
            const createdBiens = await biensService.createMultipleBiensFromCityAleatoire(nombreBien, city);
            res.status(201).json(createdBiens);
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({error: 'Internal Server Error: ' + error.message});
        }
    }

    async getBiensByCriteria(req, res) {
        console.info('Controller: getBiensByCriteria');
        try {
            const criteria = req.body.criteria;
            const biens = await biensService.getBiensByCriteria(criteria);
            res.status(200).json(biens);
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({error: 'Internal Server Error: ' + error.message});
        }
    }
}

module.exports = new BiensController();
