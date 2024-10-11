
import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid2 } from '@mui/material';
import axios from 'axios';
import './PlayerContainer.css';
import PlayerCardContainer from '/Users/elizabethlang/Documents/bond-task/bond-ball/src/components/PlayerCardContainer/PlayerCardContainer.tsx';
import ErrorComponent from '/Users/elizabethlang/Documents/bond-task/bond-ball/src/errors/ErrorComponent.tsx';

const favoritedPlayers = [
    {
        "first_name": "Stephen",
        "last_name": "Curry",
        "position": "G",
        "height": "6-2",
        "weight": "185",
        "team_name": "Golden State Warriors"
    },
    {
        "first_name": "Test",
        "last_name": "Test",
        "position": "G",
        "height": "6-2",
        "weight": "185",
        "team_name": "Golden State Warriors"
    }
]

const PlayerContainer: React.FC = () => {
    const [players, setPlayers] = useState([]);
    const [favoritedPlayers, setFavoritedPlayers] = useState<string[]>([]);
    const [error, setError] = useState<{ message: string } | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [nextCursor, setNextCursor] = useState(1);


    const playersPerPage = 5;

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
        }, [page]);

    if (error) {
        return <ErrorComponent message={error.message} />;
    }

    return (
        <Box className="container">
                <Grid2 container spacing={8}>
                    <Grid2 item xs={12} md={4}>
                    <Typography variant="h4" className="heading">
                        Favorite Players
                    </Typography>
                    {favoritedPlayers.length > 0 ? (
                        favoritedPlayers.map((player) => {
                            return (
                                player && (
                                    <PlayerCardContainer
                                        key={`${player.first_name}-${player.last_name}`}
                                        first_name={player.first_name}
                                        last_name={player.last_name}
                                        team_name={player.team_name}
                                    />
                                )
                            );
                        })
                    ) : (
                        <Typography variant="body1" className="no-favorites">
                            No favorite players yet.
                        </Typography>
                    )}
                </Grid2>
                <Grid2 item xs={15} md={12}>
                    <Typography variant="h4" className="heading">
                        All Players
                    </Typography>
                    {players.map((player) => (
                        <PlayerCardContainer
                            key={`${player.first_name}-${player.last_name}`}
                            first_name={player.first_name}
                            last_name={player.last_name}
                            team_name={player.team_name}
                        />
                    ))}
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default PlayerContainer;