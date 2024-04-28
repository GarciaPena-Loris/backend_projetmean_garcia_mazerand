const locationsService = require('../services/locationsService');

class LocationsController {

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

    async getLocations(req, res) {
        console.info('Controller: getLocations');
        const locations = await locationsService.getLocations();
        res.status(200).json(locations);
    }

    async getLocationByBienId(req, res) {
        console.info('Controller: getLocationByBienId', req.params.bienId);
        const bienId = req.params.bienId;
        const location = await locationsService.getLocationByBienId(bienId);
        res.status(200).json(location);
    }

    async createLocation(req, res) {
        console.info('Controller: createLocation', req.body.location);
        const location = req.body.location;
        const createdLocation = await locationsService.createLocation(location);
        res.status(201).json(createdLocation);
    }

    async updateLocation(req, res) {
        console.info('Controller: updateLocation', req.body.location);
        const location = req.body.location;
        const updatedLocation = await locationsService.updateLocation(location);
        res.status(200).json(updatedLocation);
    }

    async deleteLocation(req, res) {
        console.info('Controller: deleteLocation', req.params.locationId);
        const locationId = req.params.locationId;
        await locationsService.deleteLocation(locationId);
        res.status(204).send();
    }

    async createFakeReservations(req, res) {
        console.info('Controller: createFakeReservations');
        await locationsService.createFakeReservations();
        res.status(204).send();
    }

    async showFakeReservations(req, res) {
        console.info('Controller: showFakeReservations');
        const reservations = await locationsService.showFakeReservations();
        res.status(200).json(reservations);
    }

    async getReservationsByBienId(req, res) {
        console.info('Controller: getReservationsByBienId', req.params.bienId);
        const bienId = req.params.bienId;
        const reservations = await locationsService.getReservationsByBienId(bienId);
        res.status(200).json(reservations);
    }

    async newLocation(req, res) {
        console.info('Controller: newLocation', req.body.location);
        const location = req.body.location;
        const createdLocation = await locationsService.newLocation(location);
        res.status(201).json(createdLocation);
    }

    async getLocationsByUserEmail(req, res) {
        console.info('Controller: getLocationsByUserEmail', req.params.email);
        const userEmail = req.params.email;
        const locations = await locationsService.getLocationsByUserEmail(userEmail);
        res.status(200).json(locations);
    }

    async addReviewToLocation(req, res) {
        console.info('Controller: addReviewToLocation', req.params.id, req.body.review);
        const locationId = req.params.id;
        const review = req.body.review;
        const updatedLocation = await locationsService.addReviewToLocation(locationId, review);
        res.status(200).json(updatedLocation);
    }
}

module.exports = new LocationsController();
