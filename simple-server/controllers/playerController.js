import axios from 'axios';
import Player from '../models/playerModel';
import dotenv from 'dotenv';
import handleError from './errorHandler';

dotenv.config();

const ball_dont_lie_host = 'https://api.balldontlie.io/v1/'
const access_token = process.env.ACCESS_TOKEN;

const getPlayers = async (req, res) => {
    try {
        if (!access_token) {
            return res.status(500).send('No authorization token found');
        }

        const { page = 1, limit = 10 } = req.query;

        const response = await axios.get(`${ball_dont_lie_host}/players`, {
            headers: {
              'Authorization': access_token
            },
            params: {
                per_page: limit
            }
          });
        const players = response.data.data.map(playerData => {
            return new Player({
                first_name: playerData.first_name,
                last_name: playerData.last_name,
                position: playerData.position,
                height: playerData.height,
                weight: playerData.weight,
                team_name: playerData.team.full_name
            });
        });
        const meta = response.data.meta
        let total_pages = Math.ceil(meta.total_count / limit);
        const next_cursor = meta.next_cursor;

        res.json({
            players: players,
            total_pages: total_pages,
            next_cursor: next_cursor
        });
    } catch (error) {
        handleError(error, res);
    }
};

module.exports = {
    getPlayers,
};