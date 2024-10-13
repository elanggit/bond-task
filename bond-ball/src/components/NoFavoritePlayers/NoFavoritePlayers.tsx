import React from 'react';
import { Typography } from '@mui/material';
import './NoFavoritePlayers.css'; // Import the CSS file

const NoFavoritePlayers = () => {
    return (
        <Typography variant="body1" className="no-favorites">
            No favorite players yet. Click on the star icon to add a player to your favorites.
        </Typography>
    );
};

export default NoFavoritePlayers;