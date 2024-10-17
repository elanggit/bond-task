import { Router } from 'express';

import { PlayerController } from '../controllers/playerController';
const playerController = new PlayerController();

import express, { Request, Response } from 'express';
const router: Router = Router();

router.get('/', async (req, res, next) => {
  try {
    await playerController.getPlayers(req, res);
  } catch (error) {
    throw error;
  }
});
router.get('/favorites', async (req, res) => {
  try {
    await playerController.getFavorites(req, res);
  } catch (error) {
    throw error;
  }
});

router.post('/addFavorite', async (req, res) => {
  try {
    await playerController.addFavorite(req, res);
  } catch (error) {
    console.error('Error adding favorite player:', error);
    throw error;
  }
});

router.post('/removeFavorite', async (req, res) => {
  try {
    await playerController.removeFavorite(req, res);
  } catch (error) {
    throw error;
  }
});
// router.get('/', playerController.getPlayers);
// router.get('/favorites', playerController.getFavorites);
// router.post('/addFavorite', playerController.addFavorite);
// router.post('/removeFavorite', playerController.removeFavorite);

export default router;
