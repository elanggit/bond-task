import React from "react";
import { Box } from "@mui/material";
import "./PlayerCardContainer.css";

import PlayerCard from "../PlayerCard/PlayerCard.tsx";
import Player from "../../types/Players";


interface PlayerCardContainerProps {
  players: Player[];
}


const PlayerCardContainer: React.FC<PlayerCardContainerProps> = ({
  players,
}) => {
 return (
  <Box
     sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        flexWrap: 'wrap', 
        maxHeight: '500px', 
        overflowY: 'scroll'
    }}
   >
     {players && players.map((player, index) => <PlayerCard key={index} player={player} />)}
   </Box>
 );
};

export default PlayerCardContainer;
