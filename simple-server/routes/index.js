import express from 'express';
import playerController from '../controllers/playerController';

const router = express.Router();

router.get('/', playerController.getPlayers);
router.get('/', playerController.getPlayers);


module.exports = router;