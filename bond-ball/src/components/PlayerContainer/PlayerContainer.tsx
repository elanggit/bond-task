
import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid2, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import Pagination from '@mui/material/Pagination';

import axios from 'axios';
import './PlayerContainer.css';
import PlayerCardContainer from '../PlayerCardContainer/PlayerCardContainer.tsx';
import ErrorComponent from '../errors/ErrorComponent.tsx';
const results_per_page = [5,15,25,50,100];
const PlayerContainer: React.FC = () => {
    const [players, setPlayers] = useState([]);
    const [favoritedPlayers, setFavoritedPlayers] = useState<string[]>([]);
    const [error, setError] = useState<{ message: string } | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [nextCursor, setNextCursor] = useState(1);
    const [playersPerPage, setPlayersPerPage] = useState(10);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/players', {
                    params: {
                        limit: playersPerPage
                    }
                });
                setPlayers(response.data.players);
                setTotalPages(response.data.totalPages);
                setNextCursor(response.data.nextCursor);
            } catch (error) {
                setError({ message: 'OOPS! Something went wrong' });
            }
            };
    
            fetchPlayers();
        }, [page, playersPerPage]);

    if (error) {
        return <ErrorComponent message={error.message} />;
    }

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handlePlayersPerPageChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setPlayersPerPage(event.target.value as number);
        setPage(1); 
    };

    return (
        <div style={{ paddingTop: '20px' }}>
            <Typography variant="h4" className="heading">
                Players
            </Typography>
            <FormControl variant="outlined" style={{ minWidth: 120, marginBottom: '20px' }}>
                <InputLabel id="players-per-page-label">Results per page</InputLabel>
                <Select
                    labelId="players-per-page-label"
                    value={playersPerPage}
                    onChange={handlePlayersPerPageChange}
                    label="Results per page"
                >
                    {results_per_page.map((option: any) =>(
                      <MenuItem value={option}> {option} </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Grid2 container spacing={2}>
                {players.map((player: any) => (
                    <Grid2 item key={player.id} xs={12} sm={6} md={4}>
                        <PlayerCardContainer
                            first_name={player.first_name}
                            last_name={player.last_name}
                            team_name={player.team_name}
                        />
                    </Grid2>
                ))}
            </Grid2>
            <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
            />
            <Typography variant="h4" className="heading">
                Favorite Players
            </Typography>
            {favoritedPlayers && favoritedPlayers.length > 0 ? (
                favoritedPlayers.map((player) => (
                    player && (
                        <PlayerCardContainer
                            key={`${player.first_name}-${player.last_name}`}
                            first_name={player.first_name}
                            last_name={player.last_name}
                            team_name={player.team_name}
                        />
                    )
                ))
            ) : (
                <Typography variant="body1" className="no-favorites">
                    No favorite players yet. Click on the star icon to add a player to your favorites.
                </Typography>
            )}
        </div>
    );
};

export default PlayerContainer;