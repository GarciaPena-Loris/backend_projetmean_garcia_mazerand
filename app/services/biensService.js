const biensRepository = require('../repositories/biensRepository');
const locationsService = require('./locationsService');
const imagesConfig = require('../../config/imagesConfig');
const mailConfig = require('../../config/mailConfig');
const {fakerFR: faker} = require('@faker-js/faker');
const axios = require('axios');

class BiensService {

    constructor() {
    }

    async getBiens() {
        return await biensRepository.getBiens();
    }

    async getBienById(bienId) {
        return await biensRepository.getBienById(bienId);
    }

    async getLastBienId() {
        return await biensRepository.getLastBienId();
    }

    async createBien(bien) {
        return await biensRepository.createBien(bien);
    }

    async updateBien(bien) {
        return await biensRepository.updateBien(bien);
    }

    async deleteBien(bienId) {
        return await biensRepository.deleteBien(bienId);
    }

    //region Création de biens aléatoires
    async createMultipleBiensAleatoire(nombreBiens) {
        let mailProprio;
        let bien;
        let nombreBienCrees = 0;
        for (let i = 0; i < nombreBiens; i++) {
            mailProprio = this.getRandomFromArray(mailConfig.mail);
            bien = await this.createBienAleatoire(mailProprio);
            if (bien) {
                nombreBienCrees++;
            }
        }
        return {nombreBiensCrees: nombreBienCrees};
    }

    async createMultipleBiensFromCityAleatoire(nombreBiens, city) {
        let mailProprio;
        let bien;
        let nombreBienCrees = 0;
        for (let i = 0; i < nombreBiens; i++) {
            mailProprio = this.getRandomFromArray(mailConfig.mail);
            bien = await this.createBienFromCityAleatoire(mailProprio, city);
            if (bien) {
                nombreBienCrees++;
            }
        }
        return {nombreBiensCrees: nombreBienCrees};
    }

    async createBienAleatoire(mailProprio) {
        const adresse = await this.generateAdresses();
        if (!adresse) {
            console.error('Impossible de récupérer les informations de la ville');
            return null;
        }
        const typeLogement = this.getRandomTypeLogement();
        const nombreDeChambres = this.getRandomNbChambres(typeLogement);
        const nombreDeCouchages = this.getRandomNbCouchages(typeLogement, nombreDeChambres);
        const surface = this.getRandomSurface(typeLogement);
        const images = this.getRandomImages(typeLogement);
        const prix = this.getRandomPrix(nombreDeChambres, nombreDeCouchages, surface, typeLogement, adresse.distance, adresse.commune);
        const bien = {
            idBien: await this.getNextIdBien(),
            mailProprio: mailProprio,
            commune: adresse.commune,
            rue: adresse.rue,
            cp: adresse.cp,
            latitude: adresse.latitude,
            longitude: adresse.longitude,
            nbCouchages: nombreDeCouchages,
            nbChambres: nombreDeChambres,
            distance: adresse.distance,
            prix: prix,
            surface: surface,
            typeLogement: typeLogement,
            description: this.getRandomDescription(nombreDeChambres, nombreDeCouchages, typeLogement, adresse.distance, adresse.commune, prix),
            imagePrincipale: images.imagePrincipale,
            images: images.images
        };
        return await biensRepository.createBien(bien);
    }

    async createBienFromCityAleatoire(mailProprio, city) {
        const adresse = await this.generateAdressesFromCity(city);
        const typeLogement = this.getRandomTypeLogement();
        const nombreDeChambres = this.getRandomNbChambres(typeLogement);
        const nombreDeCouchages = this.getRandomNbCouchages(typeLogement, nombreDeChambres);
        const surface = this.getRandomSurface(typeLogement);
        const images = this.getRandomImages(typeLogement);
        const prix = this.getRandomPrix(nombreDeChambres, nombreDeCouchages, surface, typeLogement, adresse.distance, adresse.commune);
        const bien = {
            idBien: await this.getNextIdBien(),
            mailProprio: mailProprio,
            commune: adresse.commune,
            rue: adresse.rue,
            cp: adresse.cp,
            latitude: adresse.latitude,
            longitude: adresse.longitude,
            nbCouchages: nombreDeCouchages,
            nbChambres: nombreDeChambres,
            distance: adresse.distance,
            prix: prix,
            surface: surface,
            typeLogement: typeLogement,
            description: this.getRandomDescription(nombreDeChambres, nombreDeCouchages, typeLogement, adresse.distance, adresse.commune, prix),
            imagePrincipale: images.imagePrincipale,
            images: images.images
        };
        return await biensRepository.createBien(bien);
    }

    async getNextIdBien() {
        const lastBienId = await biensRepository.getLastBienId();
        return lastBienId ? lastBienId + 1 : 1;
    }

    getRandomFromArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    getRandomNbChambres(typeLogement) {
        let minChambres, maxChambres;
        switch (typeLogement) {
            case "appartement":
                minChambres = 1;
                maxChambres = 3;
                break;
            case "maison":
                minChambres = 2;
                maxChambres = 6;
                break;
            case "studio":
                minChambres = 1;
                maxChambres = 1;
                break;
            default:
                minChambres = 1;
                maxChambres = 4;
                break;
        }
        // Génère un nombre de chambres aléatoire en fonction du type de logement
        return Math.floor(Math.random() * (maxChambres - minChambres + 1)) + minChambres;
    }

    getRandomNbCouchages(typeLogement, nombreDeChambres) {
        let minCouchages, maxCouchages;
        switch (typeLogement) {
            case "appartement":
                minCouchages = nombreDeChambres + 1;
                maxCouchages = nombreDeChambres * 2 + 1;
                break;
            case "maison":
                minCouchages = nombreDeChambres * 2;
                maxCouchages = nombreDeChambres * 3;
                break;
            case "studio":
                minCouchages = 1;
                maxCouchages = 2;
                break;
            default:
                minCouchages = 1;
                maxCouchages = 4;
                break;
        }
        // Génère un nombre de couchages aléatoire en fonction du type de logement et du nombre de chambres
        return Math.floor(Math.random() * (maxCouchages - minCouchages + 1)) + minCouchages;
    }

    getRandomTypeLogement() {
        // Retourne un type de logement aléatoire parmi les trois types suivants
        const typesLogement = ["appartement", "maison", "studio"];
        return this.getRandomFromArray(typesLogement);
    }

    async generateAdresses() {
        const commune = faker.location.city();
        const rue = faker.location.streetAddress(true);
        const adresse = await this.getRealInfoFromCity(commune);
        if (!adresse) {
            return;
        }
        const {cp, distance, latitude, longitude} = adresse;
        return {commune, rue, cp, distance, latitude, longitude};
    }

    generateAdressesFromCity(city) {
        const commune = city;
        const rue = faker.location.streetAddress(true);
        const {cp, distance, latitude, longitude} = this.getInfoFromCity(city);
        return {commune, rue, cp, distance, latitude, longitude};
    }

    distance(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // Rayon de la Terre en mètres
        const phi1 = lat1 * Math.PI / 180; // Conversion de degrés en radians
        const phi2 = lat2 * Math.PI / 180;
        const deltaPhi = (lat2 - lat1) * Math.PI / 180;
        const deltaLambda = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance en mètre
    }

    getRealInfoFromCity(city) {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY; // Assurez-vous de stocker votre clé API dans une variable d'environnement
        const requestUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${apiKey}`;

        return axios.get(requestUrl)
            .then(response => {
                if (response.data.status === 'OK') {
                    const location = response.data.results[0].geometry.location;
                    let cp = faker.location.zipCode();
                    const addressComponents = response.data.results[0].address_components;
                    for (let i = 0; i < addressComponents.length; i++) {
                        if (addressComponents[i].long_name.match(/^\d{5}$/)) {
                            cp = addressComponents[i].long_name;
                            break;
                        }
                    }
                    const diffLatitude = 0.045;
                    const diffLongitude = 0.045;
                    const latitude = faker.location.latitude({max: location.lat + diffLatitude, min: location.lat - diffLatitude, precision: 16});
                    const longitude = faker.location.longitude({max: location.lng + diffLongitude, min: location.lng - diffLongitude, precision: 16});
                    const distance = parseFloat(this.distance(location.lat, location.lng, latitude, longitude).toFixed(2));
                    return {cp, distance, latitude, longitude};
                } else {
                    console.log(`Failed to get location from Google Maps API from city: ${city}: ${response.data.status}`);
                    return null;
                }
            })
            .catch(error => {
                console.error(error);
                throw error;
            });
    }

    getInfoFromCity(city) {
        let cp, distance, latitude, longitude;
        switch (city) {
            case "Paris":
                cp = "75000";
                // Distance entre 0 et la taille de paris (105km)
                distance = Math.floor(Math.random() * 105000) + 50;
                latitude = faker.location.latitude({max: 48.95, min: 48.78, precision: 16});
                longitude = faker.location.longitude({max: 2.5, min: 2.2, precision: 16});
                break;
            case "Marseille":
                cp = "13000";
                // Distance entre 0 et la taille de Marseille (50km)
                distance = Math.floor(Math.random() * 50000) + 50;
                latitude = faker.location.latitude({max: 43.33, min: 43.20, precision: 16});
                longitude = faker.location.longitude({max: 5.44, min: 5.35, precision: 16});
                break;
            case "Lyon":
                cp = "69000";
                // Distance entre 0 et la taille de Lyon (30km)
                distance = Math.floor(Math.random() * 30000) + 50;
                latitude = faker.location.latitude({max: 45.83, min: 45.70, precision: 16});
                longitude = faker.location.longitude({max: 4.93, min: 4.80, precision: 16});
                break;
            case "Toulouse":
                cp = "31000";
                // Distance entre 0 et la taille de Toulouse (20km)
                distance = Math.floor(Math.random() * 20000) + 50;
                latitude = faker.location.latitude({max: 43.65, min: 43.55, precision: 16});
                longitude = faker.location.longitude({max: 1.50, min: 1.40, precision: 16});
                break;
            case "Nice":
                cp = "06000";
                // Distance entre 0 et la taille de Nice (15km)
                distance = Math.floor(Math.random() * 15000) + 50;
                latitude = faker.location.latitude({max: 43.75, min: 43.65, precision: 16});
                longitude = faker.location.longitude({max: 7.30, min: 7.20, precision: 16});
                break;
            case "Nantes":
                cp = "44000";
                // Distance entre 0 et la taille de Nantes (20km)
                distance = Math.floor(Math.random() * 20000) + 50;
                latitude = faker.location.latitude({max: 47.25, min: 47.15, precision: 16});
                longitude = faker.location.longitude({max: -1.50, min: -1.60, precision: 16});
                break;
            case "Montpellier":
                cp = "34000";
                // Distance entre 0 et la taille de Montpellier (15km)
                distance = Math.floor(Math.random() * 15000) + 50;
                latitude = faker.location.latitude({max: 43.65, min: 43.55, precision: 16});
                longitude = faker.location.longitude({max: 3.90, min: 3.80, precision: 16});
                break;
            case "Strasbourg":
                cp = "67000";
                // Distance entre 0 et la taille de Strasbourg (15km)
                distance = Math.floor(Math.random() * 15000) + 50;
                latitude = faker.location.latitude({max: 48.63, min: 48.53, precision: 16});
                longitude = faker.location.longitude({max: 7.80, min: 7.70, precision: 16});
                break;
            case "Bordeaux":
                cp = "33000";
                // Distance entre 0 et la taille de Bordeaux (20km)
                distance = Math.floor(Math.random() * 20000) + 50;
                latitude = faker.location.latitude({max: 44.90, min: 44.80, precision: 16});
                longitude = faker.location.longitude({max: -0.55, min: -0.65, precision: 16});
                break;
            case "Lille":
                cp = "59000";
                // Distance entre 0 et la taille de Lille (10km)
                distance = Math.floor(Math.random() * 10000) + 50;
                latitude = faker.location.latitude({max: 50.70, min: 50.60, precision: 16});
                longitude = faker.location.longitude({max: 3.10, min: 3.00, precision: 16});
                break;
        }
        return {cp, distance, latitude, longitude};
    }

    getRandomSurface(typeLogement) {
        let minSurface, maxSurface;
        switch (typeLogement) {
            case "appartement":
                minSurface = 20;
                maxSurface = 100;
                break;
            case "maison":
                minSurface = 50;
                maxSurface = 500;
                break;
            case "studio":
                minSurface = 15;
                maxSurface = 50;
                break;
            default:
                minSurface = 20;
                maxSurface = 200;
                break;
        }
        // Génère une surface aléatoire en fonction du type de logement
        return Math.floor(Math.random() * (maxSurface - minSurface + 1)) + minSurface;
    }

    getRandomDescription(nombreDeChambres, nombreDeCouchages, typeLogement, distance, ville, prix) {
        // Phrases préfabriquées pour la description
        const phrasesPrefabriquees = {
            "appartement": ["Bel appartement", "Joli appartement", "Charmant appartement", "Appartement spacieux", "Appartement moderne", "Appartement confortable"],
            "maison": ["Belle maison", "Agréable maison", "Charmante maison", "Maison spacieuse", "Maison moderne", "Maison confortable"],
            "studio": ["Joli studio", "Charmant studio", "Agréable studio", "Studio spacieux", "Studio moderne", "Studio confortable"],
            "descriptionGenerale": ["situé à {ville}, à proximité du centre ville ({distance} mètres)", "situé à {distance} mètres du centre-ville de {ville}", "à seulement {distance} mètres de {ville}", "à une distance de {distance} mètres de {ville}"],
            "phrasesSupplementaires": [
                "Très lumineux",
                "Situé dans un endroit tranquille",
                "Vue imprenable",
                "Décoré avec goût",
                "Proche des transports en commun",
                "Idéal pour les familles",
                "Parfait pour un séjour de détente",
                "Offre une vue panoramique",
                "Situé dans un quartier animé",
                "Proche de toutes commodités",
                "À quelques pas des restaurants et des boutiques",
                "Entièrement équipé pour un séjour confortable",
                "Dispose d'un jardin privé pour se détendre",
                "Offre un accès facile aux principaux sites touristiques",
                "Ambiance chaleureuse et accueillante",
                "À proximité de sentiers de randonnée et de pistes cyclables",
                "Propose une cuisine entièrement équipée pour préparer vos repas",
                "À quelques minutes des attractions touristiques populaires",
                "Dispose d'une connexion Wi-Fi haut débit",
                "Permet de profiter d'une vue magnifique depuis le balcon",
                "Inclut un parking gratuit pour plus de commodité",
                "Idéal pour les voyageurs d'affaires",
                "Situé dans un quartier historique",
            ]
        };

        // Sélection aléatoire d'une phrase préfabriquée en fonction du type de logement
        const phraseTypeLogement = phrasesPrefabriquees[typeLogement][Math.floor(Math.random() * phrasesPrefabriquees[typeLogement].length)];

        // Sélection aléatoire d'une phrase préfabriquée pour la description générale
        const phraseDescriptionGenerale = phrasesPrefabriquees["descriptionGenerale"][Math.floor(Math.random() * phrasesPrefabriquees["descriptionGenerale"].length)];

        // Remplacer les variables dans la phrase de description générale
        const descriptionGenerale = phraseDescriptionGenerale.replace("{ville}", ville).replace("{distance}", distance);

        // Sélection aléatoire de quelques phrases supplémentaires
        const phrasesSupplementaires = [];
        for (let i = 0; i < 2; i++) { // Choisissez 2 phrases supplémentaires au hasard
            const phrase = phrasesPrefabriquees["phrasesSupplementaires"][Math.floor(Math.random() * phrasesPrefabriquees["phrasesSupplementaires"].length)];
            phrasesSupplementaires.push(phrase);
        }

        // Générer la description complète en combinant les phrases
        return `${phraseTypeLogement} ${descriptionGenerale}. ${phrasesPrefabriquees["phrasesSupplementaires"][Math.floor(Math.random() * phrasesPrefabriquees["phrasesSupplementaires"].length)]}. Ce logement dispose de ${nombreDeChambres} chambre${nombreDeChambres > 1 ? 's' : ''} et peut accueillir jusqu'à ${nombreDeCouchages} personne${nombreDeCouchages > 1 ? 's' : ''}. Le prix par nuit est de ${prix}€. ${phrasesSupplementaires.join(", ")}.`;
    }

    getRandomImages(typeLogement) {
        let imagePrincipale, images = [], nombreImages;
        switch (typeLogement) {
            case "appartement":
                imagePrincipale = this.getRandomFromArray(imagesConfig.devantureAppartement);
                nombreImages = Math.floor(Math.random() * 6) + 1; // Entre 1 et 6 images
                for (let i = 0; i < nombreImages; i++) {
                    images.push(this.getRandomFromArray(imagesConfig.appartement));
                }
                break;
            case "maison":
                imagePrincipale = this.getRandomFromArray(imagesConfig.devantureMaison);
                nombreImages = Math.floor(Math.random() * 6) + 3;
                for (let i = 0; i < nombreImages; i++) {
                    images.push(this.getRandomFromArray(imagesConfig.maison));
                }
                break;
            case "studio":
                imagePrincipale = this.getRandomFromArray(imagesConfig.devantureAppartement);
                nombreImages = Math.floor(Math.random() * 3) + 1;
                for (let i = 0; i < nombreImages; i++) {
                    images.push(this.getRandomFromArray(imagesConfig.appartement));
                }
                break;
            default:
                imagePrincipale = this.getRandomFromArray(imagesConfig.devantureAppartement);
                nombreImages = Math.floor(Math.random() * 6) + 1;
                for (let i = 0; i < nombreImages; i++) {
                    images.push(this.getRandomFromArray(imagesConfig.appartement));
                }
                break;
        }
        return {imagePrincipale, images};

    }

    getRandomPrix(nombreDeChambres, nombreDeCouchages, surface, typeLogement, distance, ville) {
        // Coefficients pour ajuster le prix en fonction des différents facteurs
        const coefficientChambres = 8;
        const coefficientCouchages = 5;
        const coefficientSurface = 1.5;

        const coefficientTypeLogement = {
            "appartement": 1.5,
            "maison": 2,
            "studio": 0.8
        };
        const coefficientDistance = 0.001; // Prix augmenté de 0.001€ par mètre de distance
        const coefficientVille = {
            "Paris": 2.5,
            "Marseille": 1.6,
            "Lyon": 1.5,
            "Toulouse": 1.4,
            "Nice": 1.3,
            "Nantes": 1.3,
            "Montpellier": 1.2,
            "Strasbourg": 1.2,
            "Bordeaux": 1.4,
            "Lille": 1.1,
        };

        // Calcul du prix de base en fonction du nombre de chambres et de couchages
        let prixBase = (nombreDeChambres * coefficientChambres) + (nombreDeCouchages * coefficientCouchages) + (surface * coefficientSurface);

        // Ajustement du prix en fonction de la distance
        const reductionDistance = distance * coefficientDistance
        prixBase -= reductionDistance;
        if (prixBase < 20) {
            prixBase = 40;
        }

        // Ajustement du prix en fonction du type de logement
        if (coefficientTypeLogement[typeLogement]) {
            prixBase *= coefficientTypeLogement[typeLogement];
        }

        // Ajustement du prix en fonction de la ville
        let coefficientVilleSpecifique = coefficientVille[ville];
        if (!coefficientVilleSpecifique) {
            coefficientVilleSpecifique = 1.0; // Si la ville n'est pas spécifiée ou n'est pas dans la liste, pas d'ajustement de prix
        }
        prixBase *= coefficientVilleSpecifique;

        // Générer un prix aléatoire dans une certaine fourchette autour du prix de base
        const prixMin = prixBase * 0.8; // 80% du prix de base
        const prixMax = prixBase * 1.2; // 120% du prix de base
        if (typeLogement === "maison" && surface > 200) {
            // Si c'est une grande maison, augmenter le prix de 40%
            return parseFloat((prixBase * 1.4).toFixed(1));
        }
        const prixAleatoire = Math.random() * (prixMax - prixMin) + prixMin;

        return parseFloat(prixAleatoire.toFixed(1)); // Arrondir à une décimale et retourner le prix
    }

    //endregion

    //region Recherche de biens
    async getBiensByCriteria(criteria) {
        // Convertir les dates en nombres pour la comparaison
        let dateDebutNumber, dateFinNumber;
        if (criteria.dateDebut)
            dateDebutNumber = parseInt(criteria.dateDebut.replace(/-/g, ''));
        if (criteria.dateFin)
            dateFinNumber = parseInt(criteria.dateFin.replace(/-/g, ''));

        // Récupérer les locations pour la période donnée
        const locations = await locationsService.getLocationsByDate(dateDebutNumber, dateFinNumber);

        // Récupérer les id des biens déjà loués
        const biensLouesIds = locations.map(location => location.idBien);

        // Récupérer les biens qui correspondent aux critères et qui ne sont pas déjà loués
        return await biensRepository.getBiensByCriteria(criteria, biensLouesIds);
    }
    //endregion

}

module.exports = new BiensService();