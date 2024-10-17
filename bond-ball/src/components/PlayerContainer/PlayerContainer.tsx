import React, { useState, useEffect } from 'react';

import Card from '@mui/joy/Card';

import Pagination from '@mui/material/Pagination';
import NoFavoritePlayers from '../NoFavoritePlayers/NoFavoritePlayers';
import PlayerCardContainer from '../PlayerCardContainer/PlayerCardContainer';
import ResultsPerPage from '../ResultsPerPage/ResultsPerPage';
import Input from '@mui/joy/Input';
import { Box, Chip, FormControl, Typography } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import { fetchPlayers } from '../../redux/slices/playerSlice';
import { fetchFavoritePlayers } from '../../redux/slices/userSlice';
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
    setPage(1);
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

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          overflow: 'wrap',
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Card sx={{ width: '50%' }} size="lg" variant="outlined">
          <FormControl>
            <Input
              placeholder="Search for players by first or last name"
              size="sm"
              variant="outlined"
              onChange={handleCreateSearchTerm}
              onKeyDown={handleKeyDown}
            />
          </FormControl>

          <Typography
            sx={{
              fontSize: {
                xs: '1.5rem',
                sm: '2rem',
                md: '2.5rem',
                lg: '3rem',
                xl: '3.75rem',
              },
            }}
            variant="h2"
            component="h2"
            gutterBottom
          >
            Players
          </Typography>

          {players && players.length > 0 ? (
            <PlayerCardContainer players={players} />
          ) : (
            <Typography>
              {' '}
              There are no results. Please note, you can only search by first or
              last name.{' '}
            </Typography>
          )}
          <ResultsPerPage
            playersPerPage={playersPerPage}
            handlePlayersPerPageChange={handlePlayersPerPageChange}
            options={RESULTS_PER_PAGE}
          />
          <Pagination count={100} page={page} onChange={handlePageChange} />
        </Card>
        <Card sx={{ width: '50%' }} size="lg" variant="outlined">
          <Typography
            sx={{
              fontSize: {
                xs: '1.5rem',
                sm: '2rem',
                md: '2.5rem',
                lg: '3rem',
                xl: '3.75rem',
              },
            }}
            variant="h2"
            component="h2"
            gutterBottom
          >
            Favorite Players
          </Typography>

          {favoritedPlayers && favoritedPlayers.length > 0 ? (
            <PlayerCardContainer players={favoritedPlayers} />
          ) : (
            <NoFavoritePlayers />
          )}
        </Card>
      </Box>
    </>
  );
};

export default PlayerContainer;
