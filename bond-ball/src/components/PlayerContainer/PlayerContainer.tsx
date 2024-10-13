import React, { useState, useMemo, useEffect } from 'react';

import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import Chip from '@mui/joy/Chip';
import Typography from '@mui/joy/Typography';

import axios from 'axios';

import Pagination from "@mui/material/Pagination";
import './PlayerContainer.css';
import { useFetch } from '../../hooks/useFetch.tsx';
import  NoFavoritePlayers from '../NoFavoritePlayers/NoFavoritePlayers.tsx';
import Player from "../../types/Players.ts";
import PlayerCardContainer from "../PlayerCardContainer/PlayerCardContainer.tsx";
import ErrorComponent from "../errors/ErrorComponent.tsx";
import FavoritePlayersHeader from '../FavoritePlayerHeaders.tsx';
import ResultsPerPage from '../ResultsPerPage/ResultsPerPage.tsx';
import Input from '@mui/joy/Input';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { FormControl } from "@material-ui/core";

import { PaginationItem, SelectChangeEvent } from '@mui/material';
import { PLAYER_API_URL, FAVORITE_PLAYER_API_URL } from '../../constants/apiUrls.ts';
const RESULTS_PER_PAGE = [5, 15, 25, 50, 100];

const PlayerContainer: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [favoritedPlayers, setFavoritedPlayers] = useState<Player[]>([]);
  const [page, setPage] = useState(1);
  const [nextCursor, setNextCursor] = useState(1);
  const [queryWithNextCursor, setQueryWithNextCursor] = useState(false);
  const [playersPerPage, setPlayersPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const player_options = useMemo(() => {
    const params: { limit: number; page: number; search?: string, cursor?: number } = {
      limit: playersPerPage,
      page,
    };
    if (searchTerm.length > 1) { params.search = searchTerm;}
    if (nextCursor && queryWithNextCursor) params.cursor = nextCursor;

    return { params };
    }, [playersPerPage, page, searchTerm]);

    const { data: playerData, error: playerError, loading: playerLoading } = useFetch<{
      players: Player[];
      nextCursor: number;
    }>(PLAYER_API_URL, player_options);

    const favorite_player_options = useMemo(() => ({
      params: {
        user_id: 1 
      },
  }), []);

    const { data: favoriteData, error: favoriteError, loading: favoriteLoading } = useFetch<{
      players: Player[];
      nextCursor: number;
    }>(FAVORITE_PLAYER_API_URL, favorite_player_options);

    useEffect(() => {
      if (playerData) {
        setPlayers(playerData.players);
        setNextCursor(playerData.nextCursor);
      }
      if (favoriteData) {
        setFavoritedPlayers(favoriteData.players);
      }
  }, [playerData, favoriteData]);
  
    if (playerLoading) {
      return <Typography>Loading...</Typography>;
    }
   
    if (playerError) {
      return <ErrorComponent message={playerError} />;
    }
   
    const handlePageChange = (
      event: React.ChangeEvent<unknown>,
      value: number
    ) => {
      setPage(value);
      setNextCursor(value);
      setQueryWithNextCursor(true);
    };
   
    const handlePlayersPerPageChange = (
      event: SelectChangeEvent<number>
    ) => {
      setPlayersPerPage(parseInt(event.target.value as string));      
      setPage(1);
    };

    const handleCreateSearchTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
    };
  
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        setSearchTerm(searchQuery.toLowerCase());
      }
    };

    const handleFavoritePlayer = async (player: Player) => {
      setFavoritedPlayers((prevFavoritedPlayers) => {
        if (prevFavoritedPlayers.some(favPlayer => favPlayer.id === player.id)) {
          return prevFavoritedPlayers.filter(favPlayer => favPlayer.id !== player.id);
        } else {
          return [...prevFavoritedPlayers, player];
        }
      });
  
      try {
        const body = { player_id: player.id, user_id: 1 };
        const playerFavorited = favoritedPlayers.some(favPlayer => favPlayer.id === player.id);
        const url_suffix = playerFavorited ? '/removeFavorite' : '/addFavorite';

        await axios.post(`${PLAYER_API_URL}${url_suffix}`, body);
      } catch (error) {
        console.error('Error updating favorite player:', error);
      };
    };
   
    return (
      <>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
            gap: 4,
          }}
        >
          <Card sx={{ width: '80%', height: '100%' }} size="lg" variant="outlined">
            <Chip size="sm" variant="outlined" color="neutral">
              Players
            </Chip>
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
            {players && players.length > 0 && 
            <
              PlayerCardContainer players={players}
              favoritedPlayers={favoritedPlayers}
              onFavoriteClick={handleFavoritePlayer}
              />}
             <Pagination 
                onChange={handlePageChange}
                count={100} 
                size="small"
                renderItem={(item) => ( 
                    <PaginationItem 
                      slots={{ 
                          previous: ArrowBackIcon, 
                          next: ArrowForwardIcon 
                      }} 
                      {...item} 
                    /> 
                )} 
            /> 
          </Card>
          <Card sx={{ width: '20%', height: '70%' }} size="lg" variant="outlined">
            <FavoritePlayersHeader/>
            {favoritedPlayers && favoritedPlayers.length > 0 ? (
              <PlayerCardContainer
                players={favoritedPlayers}
                favoritedPlayers={favoritedPlayers}
                onFavoriteClick={handleFavoritePlayer}
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
