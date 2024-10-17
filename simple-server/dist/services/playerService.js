"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPlayerData = void 0;
const player_1 = __importDefault(require("../models/player"));
const formatPlayerData = (playerData) => playerData === null || playerData === void 0 ? void 0 : playerData.map((playerData) => {
    return new player_1.default({
        first_name: playerData.first_name,
        last_name: playerData.last_name,
        position: playerData.position,
        height: playerData.height,
        weight: playerData.weight,
        team_name: playerData.team.full_name,
        id: playerData.id,
    });
});
exports.formatPlayerData = formatPlayerData;
