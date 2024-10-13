import React, { useState } from "react";
import StarTwoToneIcon from "@mui/icons-material/StarTwoTone";
import Player from "../../types/Players";
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import Tooltip from '@mui/joy/Tooltip';
import CardActions from '@mui/joy/CardActions';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';

import Typography from '@mui/joy/Typography';

interface PlayerCardProps {
  player: Player;
  isFavorited: boolean;
  onFavoriteClick: ( player: Player) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, isFavorited, onFavoriteClick }) => {
const { id, first_name, last_name, team_name, position, height, weight } = player;

const handleFavoriteClick = () => {
    onFavoriteClick(player);
  };

 return (
   <Card size="lg" variant="outlined" className="card">
     <CardActions>
          <Typography level="title-lg" sx={{ mr: 'auto' }}>
            {first_name} { last_name}
          </Typography>
          <Tooltip color='primary'
         title={`Click to ${isFavorited ? "remove" : "add"} this player ${
           isFavorited ? "from" : "to"
         } your favorites.`}
         arrow
       >
         <Box className="favorite-icon-container" onClick={handleFavoriteClick}>
           <StarTwoToneIcon
             color={isFavorited ? 'warning' : 'grey'}
             className={`favorite-icon ${
               isFavorited ? "favorited" : "not-favorited"
             }`}
           />
         </Box>
       </Tooltip>
        </CardActions>
       <Chip size="sm" variant="outlined" color="neutral">
         {team_name}
        </Chip>
        <Divider inset="none" />
        <Typography> Position: {position} </Typography>
        <Typography> Height: {height} </Typography>
        <Typography> Weight: {weight} </Typography>
   </Card>
 );
};


export default PlayerCard;