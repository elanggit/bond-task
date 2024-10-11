import express from 'express';
import playerController from '../controllers/playerController';

const router = express.Router();

router.get('/', playerController.getPlayers);
// router.get('/', playerController.getPlayers);

router.get('/getFavorites', playerController.getFavoritePlayers);
// router.post('/', playerController.addFavoritePlayer);
// router.post('/', playerController.removeFavoritePlayer);
module.exports = router;