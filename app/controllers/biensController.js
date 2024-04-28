const biensService = require('../services/biensService');

class BiensController {

    async handleAsync(fn) {
        return async (req, res, next) => {
            try {
                await fn(req, res, next);
            } catch (error) {
                console.error('Controller Error:', error.message);
                res.status(500).json({ error: 'Internal Server Error: ' + error.message });
            }
        };
    }

    async getBiens(req, res) {
        console.info('Controller: getBiens');
        const biens = await biensService.getBiens();
        res.status(200).json(biens);
    }

    async getBienById(req, res) {
        console.info('Controller: getBienById', req.params.bienId);
        const bienId = req.params.bienId;
        const bien = await biensService.getBienById(bienId);
        res.status(200).json(bien);
    }

    async getLastBienId(req, res) {
        console.info('Controller: getLastBienId');
        const lastBienId = await biensService.getLastBienId();
        res.status(200).json(lastBienId);
    }

    async createBien(req, res) {
        console.info('Controller: createBien', req.body.bien);
        const bien = req.body.bien;
        const createdBien = await biensService.createBien(bien);
        res.status(201).json(createdBien);
    }

    async updateBien(req, res) {
        console.info('Controller: updateBien', req.body.bien);
        const bien = req.body.bien;
        const updatedBien = await biensService.updateBien(bien);
        res.status(200).json(updatedBien);
    }

    async deleteBien(req, res) {
        console.info('Controller: deleteBien', req.params.bienId);
        const bienId = req.params.bienId;
        await biensService.deleteBien(bienId);
        res.status(204).send();
    }

    async createBienAleatoire(req, res) {
        console.info('Controller: createBienAleatoire', req.body.mailProprio);
        const mailProprio = req.body.mailProprio;
        const createdBien = await biensService.createBienAleatoire(mailProprio);
        res.status(201).json(createdBien);
    }

    async createMultipleBienAleatoire(req, res) {
        console.info('Controller: createMultipleBien', req.body.nombreBien);
        const nombreBien = req.body.nombreBien;
        const createdBiens = await biensService.createMultipleBiensAleatoire(nombreBien);
        res.status(201).json(createdBiens);
    }

    async createMultipleBiensFromCityAleatoire(req, res) {
        console.info('Controller: createMultipleBiensFromCityAleatoire', req.body.nombreBien, req.body.city);
        const nombreBien = req.body.nombreBien;
        const city = req.body.city;
        const createdBiens = await biensService.createMultipleBiensFromCityAleatoire(nombreBien, city);
        res.status(201).json(createdBiens);
    }

    async getBiensByCriteria(req, res) {
        console.info('Controller: getBiensByCriteria', req.body.criteria);
        const criteria = req.body.criteria;
        const biens = await biensService.getBiensByCriteria(criteria);
        res.status(200).json(biens);
    }
}

module.exports = new BiensController();
