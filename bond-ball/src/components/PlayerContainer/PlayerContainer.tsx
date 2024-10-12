import React, { useState, useMemo, useEffect } from 'react';

import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import Chip from '@mui/joy/Chip';
import Typography from '@mui/joy/Typography';

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
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from "@mui/icons-material/Clear";
import {
  FormControl,
  InputAdornment
} from "@material-ui/core";

import { SelectChangeEvent } from '@mui/material';
const RESULTS_PER_PAGE = [5, 15, 25, 50, 100];
const PLAYER_API_URL = "http://localhost:3001/api/players";
const FAVORITE_PLAYER_API_URL = "http://localhost:3001/api/players/getFavorites";

const PlayerContainer: React.FC = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [favoritedPlayers, setFavoritedPlayers] = useState<Player[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [nextCursor, setNextCursor] = useState(1);
    const [playersPerPage, setPlayersPerPage] = useState(5);
    const [showClearIcon, setShowClearIcon] = useState("none");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const player_options = useMemo(() => ({
        params: {
            limit: playersPerPage,
            page,
            search: searchTerm,
        },
    }), [playersPerPage, page, searchTerm]);

    const { data: playerData, error: playerError, loading: playerLoading } = useFetch<{
        players: Player[];
        totalPages: number;
        nextCursor: number;
    }>(PLAYER_API_URL, player_options);

    const favorite_player_options = useMemo(() => ({
      params: {
        user_id: 1 
      },
  }), []);

    const { data: favoriteData, error: favoriteError, loading: favoriteLoading } = useFetch<{
      players: Player[];
      totalPages: number;
      nextCursor: number;
    }>(FAVORITE_PLAYER_API_URL, favorite_player_options);

    useEffect(() => {
      if (playerData) {
        setPlayers(playerData.players);
        setTotalPages(playerData.totalPages);
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
      event: React.ChangeEvent<HTMLInputElement>,
      value: number
    ) => {
      setPage(parseInt(event.target.value));
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
        // Perform search logic here using 'searchTerm'
        console.log(searchQuery);
        setSearchTerm(searchQuery);
      }
    };

   
    return (
      <>
        <Box
          sx={{
            width: '100%',
            height: '70%',
            display: 'flex',
            flexDirection: 'row',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
            gap: 4,
          }}
        >
          <Card width='20%' height='70%' size="lg" variant="outlined">
            <Chip size="sm" variant="outlined" color="neutral">
              Players
            </Chip>
            {/* <Input placeholder="Search for players…" /> */}
            <FormControl>
            <Input
              size="small"
              variant="outlined"
              onChange={handleCreateSearchTerm}
              onKeyDown={handleKeyDown}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  // <InputAdornment
                  //   position="end"
                  //   style={{ display: showClearIcon }}
                  //   onClick={handleClick}
                  // >
                    <ClearIcon />
                  // </InputAdornment>
                )
              }}
            />
          </FormControl>
            <ResultsPerPage
              playersPerPage={playersPerPage}
              handlePlayersPerPageChange={handlePlayersPerPageChange}
              options={RESULTS_PER_PAGE}
            />
            {players && players.length > 0 && <PlayerCardContainer players={players} />}
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
            />
          </Card>
          <Card width='20%' height='70%' size="lg" variant="outlined">
            <FavoritePlayersHeader/>
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
