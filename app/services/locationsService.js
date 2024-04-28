const locationsRepository = require('../repositories/locationsRepository');
const biensRepository = require('../repositories/biensRepository');
const faker = require('faker');
const mailConfig = require('../../config/mailConfig');
const commentPieces = require('../../config/commentsConfig');
const { addDays } = require('date-fns');

class LocationsService {

    constructor() {
    }

    async getLocations() {
        return await locationsRepository.getLocations();
    }

    async getLocationByBienId(bienId) {
        return await locationsRepository.getLocationByBienId(bienId);
    }

    async createLocation(location) {
        return await locationsRepository.createLocation(location);
    }

    async updateLocation(location) {
        return await locationsRepository.updateLocation(location);
    }

    async deleteLocation(locationId) {
        return await locationsRepository.deleteLocation(locationId);
    }

    // Recherche de location
    async getLocationsByDate(dateDebut, dateFin) {
        // Vérifier si les dates sont fournies
        if (dateDebut && dateFin) {
            return await locationsRepository.getLocationsByDate(dateDebut, dateFin);
        } else if (dateDebut) {
            return await locationsRepository.getLocationsByStartDate(dateDebut);
        } else if (dateFin) {
            return await locationsRepository.getLocationsByEndDate(dateFin);
        } else {
            // Si aucune date n'est fournie, retourner un tableau vide
            return [];
        }
    }

    // Création fausse location
    async createFakeReservations() {
        const biens = await biensRepository.getBiens();
        let nombreReservations = 0;

        for (const bien of biens) {
            const numReservations = Math.floor(Math.random() * 10) + 1;

            for (let i = 0; i < numReservations; i++) {
                const mailLoueur = mailConfig.mail[Math.floor(Math.random() * mailConfig.mail.length)];
                const dateDebut = faker.date.between(addDays(new Date(), -365), addDays(new Date(), 60)).getTime(); // Générer une date entre un an avant aujourd'hui et un an après aujourd'hui
                const dateFin = addDays(dateDebut, Math.floor(Math.random() * 15) + 1).getTime();
                const note = (Math.floor(Math.random() * 10) + 1) / 2;
                const commentaire = this.generateFakeComment(bien, note);

                const fakeReservation = {
                    idLocation: await this.getNextIdLocation(),
                    idBien: bien.idBien,
                    mailLoueur,
                    dateDebut,
                    dateFin,
                    avis: dateDebut > Date.now() ? {} : { // Si la date de début est dans le futur, laisser l'avis vide
                        note,
                        commentaire
                    }
                };

                const createdReservation = await this.createLocation(fakeReservation);
                console.log('Created fake reservation:', createdReservation);
                nombreReservations++
            }
        }

        return nombreReservations;
    }

    async getNextIdLocation() {
        const lastIdLocation = await locationsRepository.getLastIdLocation();
        return lastIdLocation ? lastIdLocation + 1 : 1;
    }

    async showFakeReservations() {
        // Recupere une bien aleatoire et afficher une fakeComment pour ce bien
        const biens = await biensRepository.getBiens();

        // Recupere une bien aletaoire
        const bien = biens[Math.floor(Math.random() * biens.length)];
        const randomNote = (Math.floor(Math.random() * 10) + 1) / 2;
        return this.generateFakeComment(bien, randomNote);
    }

    generateFakeComment(bien, note) {
        let comment = '';

        // Ajout de pièces génériques en fonction du type de logement
        if (bien.typeLogement in commentPieces) {
            comment += this.getRandomFromArray(commentPieces[bien.typeLogement][this.getCommentType(note)]) + ' ';
        }

        // Ajout de pièces spécifiques en fonction de la commune
        if (bien.commune in commentPieces.ville) {
            comment += this.getRandomFromArray(commentPieces.ville[bien.commune][this.getCommentType(note)]) + ' ';
        }

        // Ajout de commentaires en fonction de la surface
        if (bien.surface <= 20) {
            comment += this.getRandomFromArray(commentPieces.surface.small[this.getCommentType(note)]) + ' ';
        } else if (bien.surface <= 50) {
            comment += this.getRandomFromArray(commentPieces.surface.medium[this.getCommentType(note)]) + ' ';
        } else {
            comment += this.getRandomFromArray(commentPieces.surface.large[this.getCommentType(note)]) + ' ';
        }

        // Ajout de commentaires en fonction de la distance
        if (bien.distance <= 200) {
            comment += this.getRandomFromArray(commentPieces.distance.close[this.getCommentType(note)]) + ' ';
        } else if (bien.distance <= 5000) {
            comment += this.getRandomFromArray(commentPieces.distance.medium[this.getCommentType(note)]) + ' ';
        } else {
            comment += this.getRandomFromArray(commentPieces.distance.far[this.getCommentType(note)]) + ' ';
        }

        // Ajout de commentaires en fonction du prix
        if (bien.prix <= 50) {
            comment += this.getRandomFromArray(commentPieces.prix.low[this.getCommentType(note)]) + ' ';
        } else if (bien.prix <= 150) {
            comment += this.getRandomFromArray(commentPieces.prix.medium[this.getCommentType(note)]) + ' ';
        } else {
            comment += this.getRandomFromArray(commentPieces.prix.high[this.getCommentType(note)]) + ' ';
        }

        // Ajout de pièces spécifiques en fonction de la surface, du prix, de la distance, du nombre de chambres et du nombre de couchages
        comment += this.getRandomFromArray(commentPieces.nbChambres[this.getCommentType(note)]) + ' ';
        comment += this.getRandomFromArray(commentPieces.nbCouchages[this.getCommentType(note)]) + ' ';

        return comment.trim();
    }

    getRandomFromArray(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    getCommentType(note) {
        if (note < 2) {
            return 'bad';
        } else if (note <= 3.5) {
            return 'average';
        } else {
            return 'good';
        }
    }

    async getReservationsByBienId(bienId) {
        return await locationsRepository.getReservationsByBienId(bienId);
    }

    async newLocation(location) {
        location.dateDebut = new Date(location.dateDebut).setHours(23, 59, 59, 0);
        console.log(location.dateDebut, Date.now())
        console.log(location.dateDebut >= Date.now())
        // Vérifier si les dates sont valides
        if (location.dateDebut >= Date.now() && location.dateFin > location.dateDebut) {
            // Récupérer toutes les locations pour l'idBien actuel
            const existingLocations = await locationsRepository.getLocationByBienId(location.idBien);
            // Vérifier si aucune de ces locations ne se chevauche avec les dates fournies
            if (existingLocations.some(existingLocation => existingLocation.dateFin > location.dateDebut && existingLocation.dateDebut < location.dateFin)) {
                throw new Error('Le bien est déjà loué pendant cette période');
            } else {
                // Si tout est valide, créer la location
                location.idLocation = await this.getNextIdLocation();
                return await locationsRepository.createLocation(location);
            }
        } else {
            throw new Error('Les dates ne sont pas valides');
        }
    }

    async getLocationsByUserEmail(userEmail) {
        return await locationsRepository.getLocationsByUserEmail(userEmail);
    }

    async addReviewToLocation(locationId, review) {
        return await locationsRepository.addReviewToLocation(locationId, review);
    }
}

module.exports = new LocationsService();