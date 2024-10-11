import axios from 'axios';
import Player from '../models/playerModel';
import dotenv from 'dotenv';

dotenv.config();

const ball_dont_lie_host = 'https://api.balldontlie.io/v1/'
const access_token = process.env.ACCESS_TOKEN;

const getPlayers = async (req, res) => {
    try {
        const response = await axios.get(`${ball_dont_lie_host}/players`, {
            headers: {
              'Authorization': access_token
            }
          });
        const players = response.data.data.map(playerData => {
            console.log('response', playerData.team.full_name)
            return new Player({
                first_name: playerData.first_name,
                last_name: playerData.last_name,
                position: playerData.position,
                height: playerData.height,
                weight: playerData.weight,
                team_name: playerData.team.full_name
            });
        });

        res.json(players);
    } catch (error) {
        console.error('Error fetching players data:', error);
        res.status(500).json({ error: 'Failed to fetch players data' });
    }
};

module.exports = {
    getPlayers,
};