import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { selectIsPlayerFavorited } from '../../redux/selectors/userSelectors';

import { Box } from '@mui/material';
import './PlayerCardContainer.css';

import PlayerCard from '../PlayerCard/PlayerCard';
import Player from '../../types/Players';

interface PlayerCardContainerProps {
  players: Player[];
  favoritedPlayers: Player[];
  onFavoriteClick: (player: Player) => void;
}

const PlayerCardContainer: React.FC<PlayerCardContainerProps> = ({ players, onFavoriteClick }) => {
  const favoritedPlayers = useSelector((state: RootState) => state.user.favoritedPlayers);

  return (
    <Box>
      {players.map((player, index) => {
        const isFavorited = favoritedPlayers.some(favoritedPlayer => favoritedPlayer.id === player.id);
        return (
          <PlayerCard
            key={index}
            player={player}
            isFavorited={isFavorited}
            onFavoriteClick={onFavoriteClick}
          />
        );
      })}
    </Box>
  );
};

export default PlayerCardContainer;
