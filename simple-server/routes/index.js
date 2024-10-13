import express from 'express';
import bodyParser from 'body-parser';

import playerController from '../controllers/player';

const router = express.Router();

router.get('/', playerController.getPlayers);

router.get('/favorites', playerController.getFavorites);
router.post('/addFavorite', playerController.addFavorite);
router.post('/removeFavorite', playerController.removeFavorite);

module.exports = router;
