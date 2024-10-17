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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFavoritePlayer = exports.addFavoritePlayer = exports.getFavoritePlayerIds = void 0;
const db_1 = __importDefault(require("../db/db"));
const getFavoritePlayerIds = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.default.query('SELECT player_id FROM favorite_players WHERE user_id = $1', [userId]);
        return result.rows.map(({ player_id }) => player_id);
    }
    catch (error) {
        throw error;
    }
});
exports.getFavoritePlayerIds = getFavoritePlayerIds;
const addFavoritePlayer = (userId, playerId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.default.query('INSERT INTO favorite_players (player_id, user_id) VALUES ($1, $2) RETURNING *', [playerId, userId]);
        return result.rows[0];
    }
    catch (error) {
        throw error;
    }
});
exports.addFavoritePlayer = addFavoritePlayer;
const removeFavoritePlayer = (userId, playerId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'DELETE FROM favorite_players WHERE player_id = $1 AND user_id = $2 RETURNING *';
        const values = [playerId, userId];
        const result = yield db_1.default.query(query, values);
        return result.rows[0];
    }
    catch (error) {
        throw error;
    }
});
exports.removeFavoritePlayer = removeFavoritePlayer;
