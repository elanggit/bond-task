import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { selectIsPlayerFavorited } from '../../redux/selectors/userSelectors';

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
  const dispatch = useDispatch<AppDispatch>();

  const onFavoriteClick = (player: Player) => {
    const isFavorited = favoritedPlayers?.some(
      (favoritedPlayer) => favoritedPlayer.id === player.id
    );
    if (isFavorited) {
      dispatch(removeFavoritePlayer({ userId: 1, player: player }));
    } else {
      dispatch(addFavoritePlayer({ userId: 1, player: player }));
    }
  };

  return (
    <Box
    sx={{
      width: { xs: 'auto', sm: '100%' },
      maxWidth: '100%',
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      flexWrap: 'wrap',
      gap: 4,
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
