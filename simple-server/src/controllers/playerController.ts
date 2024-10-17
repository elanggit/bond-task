import axios, { AxiosError, AxiosResponse } from 'axios';
import User from '../models/user';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';
import { Response, Request } from 'express';
import Player from '../models/player';

const { formatPlayerData } = require('../services/playerService');

dotenv.config();

const ball_dont_lie_player_endpoint = 'https://api.balldontlie.io/v1/players';
const access_token = process.env.ACCESS_TOKEN;

// thirty minute cache. It is unlikely that the data will change in that time.
const cache = new NodeCache({ stdTTL: 1800 });

const headers = { Authorization: access_token };

const handleMissingToken = (res: Response): Response => {
  return res.status(500).send('No authorization token found');
};

interface PlayerResponse {
  players: Player[];
  next_cursor: string | null;
  prev_cursor: string | null;
}

export class PlayerController {
  public async getPlayers(req: Request, res: Response): Promise<Response> {
    if (!access_token) return handleMissingToken(res);
    const {
      page = 1,
      limit = 5,
      search = '',
      cursor = null,
    } = req.query as {
      page?: number;
      limit?: number;
      search?: string;
      cursor?: string | null;
    };
    const cacheKey = `players_${page}_${limit}_${search}_${cursor}`;
    const cachedData = cache.get<PlayerResponse>(cacheKey);
    // if (cachedData) return res.status(200).json(cachedData);
    try {
      const player_response: AxiosResponse = await axios.get(
        ball_dont_lie_player_endpoint,
        {
          headers: headers,
          params: {
            per_page: limit,
            search: search,
            cursor: page,
          },
        }
      );
      const data = formatPlayerData(player_response.data.data);
      return this.handleSuccess(res, data, 'Players fetched successfully');
    } catch (error: unknown) {
      return this.handleError(res, error);
    }
  }


  private handleSuccess(res: Response, data: any, message: string): Response {
    return res
      .status(200)
      .json({ data: data, message: message, status: 'success' });
  }

  private async updateFavoritePlayers(
    req: Request,
    res: Response,
    action: string
  ): Promise<Response> {
    if (!access_token) return handleMissingToken(res);
    const { userId, playerId } = req.body as {
      userId: number;
      playerId: number;
    };

    if (!userId || !playerId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = new User(userId);
    try {
      const response =
        action === 'add'
          ? await user.addFavoritePlayer(playerId)
          : await user.removeFavoritePlayer(playerId);
      const message = `Player ${action === 'add' ? 'added' : 'removed'} from favorites successfully`;
      return this.handleSuccess(res, response, message);
    } catch (error: unknown) {
      return this.handleError(res, error);
    }
  }

  public async addFavorite(req: Request, res: Response): Promise<Response> {
    return this.updateFavoritePlayers(req, res, 'add');
  }

  public async removeFavorite(req: Request, res: Response): Promise<Response> {
    return this.updateFavoritePlayers(req, res, 'remove');
  }

  public async getFavorites(req: Request, res: Response): Promise<Response> {
    const { userId } = req.query as { userId?: number };
    if (!userId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const user = new User(userId);
    try {
      const playerIds = await user.getFavoritePlayerIds();
      const playersFavorited = playerIds.length > 0;
      if (!playersFavorited) {
        return this.handleSuccess(res, [], 'No favorite players found');
      }
      const queryString = playerIds.map((id) => `player_ids[]=${id}`).join('&');
      const url = `${ball_dont_lie_player_endpoint}?${queryString}`;
      const response = await axios.get(url, { headers: headers });
      const data = formatPlayerData(response.data.data);
      return this.handleSuccess(res, data, 'Favorite players fetched successfully');
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  private handleError(res: Response, error: unknown): Response {
    if (axios.isAxiosError(error)) {
      return this.handleAxiosErrorResponse(res, error);
    } else
      return res.status(500).json({ message: this.getErrorMessage(error) });
  }
  private handleAxiosErrorResponse(res: Response, error: AxiosError): Response {
    const status = error.response?.data || 500;
    return res.status(status).json({
      data: error.response?.data,
      message: this.getErrorMessage(error),
    });
  }

  private getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message;
    return String(error);
  }
}
