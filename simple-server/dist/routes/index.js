"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const playerController_1 = require("../controllers/playerController");
const playerController = new playerController_1.PlayerController();
const router = (0, express_1.Router)();
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield playerController.getPlayers(req, res);
    }
    catch (error) {
        throw error;
    }
}));
router.get('/favorites', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield playerController.getFavorites(req, res);
    }
    catch (error) {
        throw error;
    }
}));
router.post('/addFavorite', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield playerController.addFavorite(req, res);
    }
    catch (error) {
        console.error('Error adding favorite player:', error);
        throw error;
    }
}));
router.post('/removeFavorite', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield playerController.removeFavorite(req, res);
    }
    catch (error) {
        throw error;
    }
}));
// router.get('/', playerController.getPlayers);
// router.get('/favorites', playerController.getFavorites);
// router.post('/addFavorite', playerController.addFavorite);
// router.post('/removeFavorite', playerController.removeFavorite);
exports.default = router;
