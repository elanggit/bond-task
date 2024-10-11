import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Tooltip } from '@mui/material';
import StarTwoToneIcon from '@mui/icons-material/StarTwoTone';
import './PlayerCardContainer.css';

interface PlayerCardContainerProps {
    id: string;
    key: string;
    first_name: string;
    last_name: string;
    team_name: string;
    weight: string;
    height: string;
    position: string;
}

const PlayerCardContainer: React.FC<PlayerCardContainerProps> = ({ id, first_name, last_name, team_name, height, weight }) => {
    const [isFavorited, setIsFavorited] = useState(false);

    const handleFavorite = () => {
        setIsFavorited(!isFavorited);
    };

    return (
        <Box className="card-container">
            <Card className="card">
                <CardContent className="card-content">
                    <Typography variant="h5" component="div">
                        {first_name} {last_name}
                    </Typography>
                </CardContent>
                <Box className="team-name">
                    <Typography variant="body2" color="text.secondary">
                        Team: {team_name}
                    </Typography>
                </Box>
            </Card>
            <Tooltip title={`Click to ${isFavorited ? 'remove' : 'add'} this player ${isFavorited ? 'from' : 'to'} your favorites.`} arrow>
                <Box 
                    className="favorite-icon-container" 
                    onClick={handleFavorite}
                >
                    <StarTwoToneIcon 
                        className={`favorite-icon ${isFavorited ? 'favorited' : 'not-favorited'}`} 
                    />
                </Box>
            </Tooltip>
        </Box>
    );
};

export default PlayerCardContainer;