import React, { useState, useEffect } from 'react';

import Card from '@mui/joy/Card';

import Pagination from '@mui/material/Pagination';
import NoFavoritePlayers from '../NoFavoritePlayers/NoFavoritePlayers';
import PlayerCardContainer from '../PlayerCardContainer/PlayerCardContainer';
import ResultsPerPage from '../ResultsPerPage/ResultsPerPage';
import Input from '@mui/joy/Input';
import { Box, FormControl, Typography } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import { fetchPlayers } from '../../redux/slices/playerSlice';
import { fetchFavoritePlayers } from '../../redux/slices/userSlice';
import { RootState, AppDispatch } from '../../redux/store';
import ErrorComponent from '../errors/ErrorComponent';
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
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchPlayers({ playersPerPage: 5, page: 1 }));
    dispatch(fetchFavoritePlayers({ userId: user.id }));
  }, [dispatch]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <ErrorComponent message={''}/>
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
          maxWidth: '100vw',
          maxHeight: '100vh',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          overflow: 'auto',
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
            variant="h2"
            component="h2"
            gutterBottom
            sx={{
              fontSize: {
                xs: '1rem',
                sm: '1.5rem',
                md: '2rem',
                lg: '2.5rem',
                xl: '3rem',
              },
            }}
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
                xs: '1rem',
                sm: '1.5rem',
                md: '2rem',
                lg: '2.5rem',
                xl: '3rem',
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
