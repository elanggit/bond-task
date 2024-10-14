import React, { useState, useMemo, useEffect } from 'react';

import Card from '@mui/joy/Card';

import Pagination from '@mui/material/Pagination';
import './PlayerContainer.css';
import { useFetch } from '../../hooks/useFetch';
import NoFavoritePlayers from '../NoFavoritePlayers/NoFavoritePlayers';
import Player from '../../types/Players';
import PlayerCardContainer from '../PlayerCardContainer/PlayerCardContainer';
import ErrorComponent from '../errors/ErrorComponent';
import FavoritePlayersHeader from '../FavoritePlayerHeaders';
import ResultsPerPage from '../ResultsPerPage/ResultsPerPage';
import Input from '@mui/joy/Input';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Chip, FormControl } from '@mui/material';
import {
  getFavoritePlayerOptions,
  getPlayerOptions,
} from '../../utils/playerOptions';
import { PaginationItem, SelectChangeEvent } from '@mui/material';
import { PLAYER_API_HOST, FAVORITE_PLAYER_URL } from '../../constants/apiUrls';
import {
  addFavoritePlayer,
  removeFavoritePlayer,
} from '../../services/playerService.js';
import handleFavoritePlayer from '../../utils/handleFavoritePlayer';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlayers } from '../../redux/slices/playerSlice';
import { fetchFavoritePlayers } from '../../redux/slices/userSlice';
import { setFavoritePlayers } from '../../redux/slices/userSlice';
import { RootState, AppDispatch } from '../../redux/store';
const RESULTS_PER_PAGE = [5, 15, 25, 50, 100];

const PlayerContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const players = useSelector((state: RootState) => state.player.players);

  const favoritedPlayers = useSelector(
    (state: RootState) => state.user.favoritedPlayers
  );
  const status = useSelector((state: RootState) => state.player.status);
  const [page, setPage] = useState(1);
  const [playersPerPage, setPlayersPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchPlayers({ playersPerPage: 5, page: 1 }));
    dispatch(fetchFavoritePlayers({ userId: 1 }));
  }, [dispatch]);

  const handlesetFavoritePlayers = async () => {
    const resultAction = await dispatch(fetchFavoritePlayers({ userId: 1 }));
    if (fetchFavoritePlayers.fulfilled.match(resultAction)) {
      dispatch(setFavoritePlayers(resultAction.payload));
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error loading players</div>;
  }

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    dispatch(fetchPlayers({ playersPerPage, page: value }));
  };

  const handlePlayersPerPageChange = (event: SelectChangeEvent<number>) => {
    const playersPerPage = parseInt(event.target.value as string);
    setPlayersPerPage(playersPerPage);
    dispatch(fetchPlayers({ playersPerPage: playersPerPage, page: 1 }));
  };

  const handleCreateSearchTerm = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const query = searchQuery.toLowerCase();
      dispatch(
        fetchPlayers({ playersPerPage: 10, page: 1, searchTerm: query })
      );
    }
  };

  const handleAddRemovePlayer = async (player: Player) => {
    const updatedFavoritedPlayers = await handleFavoritePlayer(
      player,
      favoritedPlayers,
      1,
      dispatch
    );
    setFavoritePlayers(updatedFavoritedPlayers);
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          gridTemplateColumns:
            'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
          gap: 4,
        }}
      >
        <Chip size="small" variant="outlined" color="default" label="Players" />
        <FormControl>
          <Input
            placeholder="Search for players by first or last name"
            size="sm"
            variant="outlined"
            onChange={handleCreateSearchTerm}
            onKeyDown={handleKeyDown}
          />
        </FormControl>
        <ResultsPerPage
          playersPerPage={playersPerPage}
          handlePlayersPerPageChange={handlePlayersPerPageChange}
          options={RESULTS_PER_PAGE}
        />
        <Card sx={{ width: '75%', height: '70%' }} size="lg" variant="outlined">
          <PlayerCardContainer
            players={players}
            favoritedPlayers={favoritedPlayers}
            onFavoriteClick={handleAddRemovePlayer}
          />
          <Pagination
            count={playersPerPage}
            page={page}
            onChange={handlePageChange}
          />
        </Card>
        <Card sx={{ width: '20%', height: '70%' }} size="lg" variant="outlined">
          <FavoritePlayersHeader />
          {favoritedPlayers && favoritedPlayers.length > 0 ? (
            <PlayerCardContainer
              players={favoritedPlayers}
              favoritedPlayers={favoritedPlayers}
              onFavoriteClick={handlesetFavoritePlayers}
            />
          ) : (
            <NoFavoritePlayers />
          )}
        </Card>
      </Box>
    </>
  );
};

export default PlayerContainer;
