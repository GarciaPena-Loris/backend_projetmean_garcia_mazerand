const locationsService = require('../services/locationsService');

class LocationsController {

    async getLocations(req, res) {
        console.info('Controller: getLocations');
        try {
            const locations = await locationsService.getLocations();
            res.status(200).json(locations);
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({error: error.message});
        }
    }

    async getLocationByBienId(req, res) {
        console.info('Controller: getLocationByBienId');
        try {
            const bienId = req.params.bienId;
            const location = await locationsService.getLocationByBienId(bienId);
            res.status(200).json(location);
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({error: error.message});
        }
    }

    async createLocation(req, res) {
        console.info('Controller: createLocation');
        try {
            const location = req.body.location;
            const createdLocation = await locationsService.createLocation(location);
            res.status(201).json(createdLocation);
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({error: error.message});
        }
    }

    async updateLocation(req, res) {
        console.info('Controller: updateLocation');
        try {
            const location = req.body.location;
            const updatedLocation = await locationsService.updateLocation(location);
            res.status(200).json(updatedLocation);
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({error: error.message});
        }
    }

    async deleteLocation(req, res) {
        console.info('Controller: deleteLocation');
        try {
            const locationId = req.params.locationId;
            await locationsService.deleteLocation(locationId);
            res.status(204).send();
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({error: error.message});
        }
    }

    async createFakeReservations(req, res) {
        console.info('Controller: createFakeReservations');
        try {
            await locationsService.createFakeReservations();
            res.status(204).send();
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({error: error.message});
        }
    }

    async showFakeReservations(req, res) {
        console.info('Controller: showFakeReservations');
        try {
            const reservations = await locationsService.showFakeReservations();
            res.status(200).json(reservations);
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({error: error.message});
        }
    }

    async newLocation(req, res) {
        console.info('Controller: newLocation');
        try {
            const location = req.body.location;
            const createdLocation = await locationsService.newLocation(location);
            res.status(201).json(createdLocation);
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({error: error.message});
        }
    }

    async getReservationsByBienId(req, res) {
        console.info('Controller: getReservationsByBienId');
        try {
            const bienId = req.params.bienId;
            const reservations = await locationsService.getReservationsByBienId(bienId);
            res.status(200).json(reservations);
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({error: error.message});
        }
    }

    async getLocationsByUserEmail(req, res) {
        console.info('Controller: getLocationsByUserEmail');
        try {
            const userEmail = req.params.email;
            const locations = await locationsService.getLocationsByUserEmail(userEmail);
            res.status(200).json(locations);
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({error: error.message});
        }
    }

    async addReviewToLocation(req, res) {
        console.info('Controller: addReviewToLocation');
        try {
            const locationId = req.params.id;
            const review = req.body.review;
            const updatedLocation = await locationsService.addReviewToLocation(locationId, review);
            res.status(200).json(updatedLocation);
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({error: error.message});
        }
    }
}

module.exports = new LocationsController();
