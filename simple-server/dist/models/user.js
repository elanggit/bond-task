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
const userService_1 = require("../services/userService");
const errors_1 = require("../utils/errors");
class User {
    constructor(id) {
        this.getFavoritePlayerIds = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const favorite_playerIds = yield (0, userService_1.getFavoritePlayerIds)(this.id);
                this.favoritePlayerIds = favorite_playerIds;
                return this.favoritePlayerIds;
            }
            catch (error) {
                throw new Error((0, errors_1.errorMessage)(error));
            }
        });
        this.addFavoritePlayer = (playerId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const favorites = yield this.getFavoritePlayerIds();
                const alreadyFavorited = favorites.some((fave_playerId) => fave_playerId === playerId);
                if (alreadyFavorited) {
                    return { error: 'The player is already favorited.' };
                }
                else {
                    const response = yield (0, userService_1.addFavoritePlayer)(this.id, playerId);
                    this.favoritePlayerIds.push(playerId);
                    return response;
                }
            }
            catch (error) {
                throw new Error((0, errors_1.errorMessage)(error));
            }
        });
        this.removeFavoritePlayer = (playerId) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.favoritePlayerIds = this.favoritePlayerIds.filter((fave_playerId) => fave_playerId !== playerId);
                const reponse = yield (0, userService_1.removeFavoritePlayer)(this.id, playerId);
                return reponse;
            }
            catch (error) {
                throw new Error((0, errors_1.errorMessage)(error));
            }
        });
        this.id = id;
        this.favoritePlayerIds = [];
        this.getFavoritePlayerIds();
    }
}
exports.default = User;
