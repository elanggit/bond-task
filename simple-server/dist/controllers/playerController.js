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
exports.PlayerController = void 0;
const axios_1 = __importDefault(require("axios"));
const user_1 = __importDefault(require("../models/user"));
const dotenv_1 = __importDefault(require("dotenv"));
const node_cache_1 = __importDefault(require("node-cache"));
const { formatPlayerData } = require('../services/playerService');
dotenv_1.default.config();
const ball_dont_lie_player_endpoint = 'https://api.balldontlie.io/v1/players';
const access_token = process.env.ACCESS_TOKEN;
// thirty minute cache. It is unlikely that the data will change in that time.
const cache = new node_cache_1.default({ stdTTL: 1800 });
const headers = { Authorization: access_token };
const handleMissingToken = (res) => {
    return res.status(500).send('No authorization token found');
};
class PlayerController {
    getPlayers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!access_token)
                return handleMissingToken(res);
            const { page = 1, limit = 5, search = '', cursor = null, } = req.query;
            const cacheKey = `players_${page}_${limit}_${search}_${cursor}`;
            const cachedData = cache.get(cacheKey);
            if (cachedData)
                return this.handleSuccess(res, cachedData, 'Players fetched successfully');
            ;
            try {
                const player_response = yield axios_1.default.get(ball_dont_lie_player_endpoint, {
                    headers: headers,
                    params: {
                        per_page: limit,
                        search: search,
                        cursor: page,
                    },
                });
                const data = formatPlayerData(player_response.data.data);
                cache.set(cacheKey, data, 3600);
                return this.handleSuccess(res, data, 'Players fetched successfully');
            }
            catch (error) {
                return this.handleError(res, error);
            }
        });
    }
    addFavorite(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.updateFavoritePlayers(req, res, 'add');
        });
    }
    removeFavorite(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.updateFavoritePlayers(req, res, 'remove');
        });
    }
    getFavorites(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.query;
            if (!userId) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
            const user = new user_1.default(userId);
            try {
                const playerIds = yield user.getFavoritePlayerIds();
                const playersFavorited = playerIds.length > 0;
                if (!playersFavorited) {
                    return this.handleSuccess(res, [], 'No favorite players found');
                }
                const queryString = playerIds.map((id) => `player_ids[]=${id}`).join('&');
                const url = `${ball_dont_lie_player_endpoint}?${queryString}`;
                const response = yield axios_1.default.get(url, { headers: headers });
                const data = formatPlayerData(response.data.data);
                return this.handleSuccess(res, data, 'Favorite players fetched successfully');
            }
            catch (error) {
                return this.handleError(res, error);
            }
        });
    }
    handleError(res, error) {
        if (axios_1.default.isAxiosError(error)) {
            return this.handleAxiosErrorResponse(res, error);
        }
        else
            return res.status(500).json({ message: this.getErrorMessage(error) });
    }
    handleAxiosErrorResponse(res, error) {
        var _a, _b;
        const status = ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || 500;
        return res.status(status).json({
            data: (_b = error.response) === null || _b === void 0 ? void 0 : _b.data,
            message: this.getErrorMessage(error),
        });
    }
    getErrorMessage(error) {
        if (error instanceof Error)
            return error.message;
        return String(error);
    }
    handleSuccess(res, data, message) {
        return res
            .status(200)
            .json({ data: data, message: message, status: 'success' });
    }
    updateFavoritePlayers(req, res, action) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!access_token)
                return handleMissingToken(res);
            const { userId, playerId } = req.body;
            if (!userId || !playerId) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
            const user = new user_1.default(userId);
            try {
                const response = action === 'add'
                    ? yield user.addFavoritePlayer(playerId)
                    : yield user.removeFavoritePlayer(playerId);
                const message = `Player ${action === 'add' ? 'added' : 'removed'} from favorites successfully`;
                return this.handleSuccess(res, response, message);
            }
            catch (error) {
                return this.handleError(res, error);
            }
        });
    }
}
exports.PlayerController = PlayerController;
