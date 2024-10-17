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
const db_1 = __importDefault(require("./db"));
const createTables = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.default.connect();
    try {
        yield client.query('BEGIN');
        yield client.query('DROP TABLE IF EXISTS favorite_players CASCADE;');
        yield client.query('DROP TABLE IF EXISTS users CASCADE;');
        yield client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR UNIQUE NOT NULL,
                email VARCHAR UNIQUE NOT NULL,
                hashed_password VARCHAR NOT NULL
            );
        `);
        yield client.query(`
            CREATE TABLE IF NOT EXISTS favorite_players (
                id SERIAL PRIMARY KEY,
                player_id INTEGER NOT NULL,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE (player_id, user_id)
            );
        `);
        yield client.query('COMMIT');
        console.log('Tables created successfully');
    }
    catch (error) {
        yield client.query('ROLLBACK');
        console.error('Error creating tables:', error);
    }
    finally {
        client.release();
    }
});
createTables().catch((error) => console.error('Error in createTables:', error));
