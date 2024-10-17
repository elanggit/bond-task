import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';

import { Box } from '@mui/material';

import PlayerCard from '../PlayerCard/PlayerCard';
import Player from '../../types/Players';

import {
  addFavoritePlayer,
  removeFavoritePlayer,
} from '../../redux/slices/userSlice';
interface PlayerCardContainerProps {
  players: Player[];
}

const PlayerCardContainer: React.FC<PlayerCardContainerProps> = ({
  players,
}) => {
  const favoritedPlayers = useSelector(
    (state: RootState) => state.user.favoritedPlayers
  );
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const onFavoriteClick = (player: Player) => {
    const isFavorited = favoritedPlayers?.some(
      (favoritedPlayer) => favoritedPlayer.id === player.id
    );
    if (isFavorited) {
      dispatch(removeFavoritePlayer({ userId: user.id, player: player }));
    } else {
      dispatch(addFavoritePlayer({ userId: user.id, player: player }));
    }
  };

  return (
    <Box
    sx={{
      width: { xs: 'auto', sm: '100%' },
      height: '80%',
      maxHeight: '100vh',
      maxWidth: '100%',
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      flexWrap: 'wrap',
      overflow: 'auto',
      gap: 2,
      gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(auto-fill, minmax(300px, 1fr))',
      },
    }}
    >
      {players?.map((player, index) => {
        const isFavorited = favoritedPlayers.some(
          (favoritedPlayer) => favoritedPlayer.id === player.id
        );

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
