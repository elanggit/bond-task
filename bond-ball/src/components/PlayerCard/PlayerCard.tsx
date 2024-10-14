import React from 'react';
import Player from '../../types/Players';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import CardContent from '@mui/joy/CardOverflow';

import Typography from '@mui/joy/Typography';
import FavoriteIcon from '../FavoriteIcon';

interface PlayerCardProps {
  player: Player;
  isFavorited: boolean;
  onFavoriteClick: (player: Player) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isFavorited,
  onFavoriteClick,
}) => {
  const { first_name, last_name, team_name, position, height, weight } = player;

  const handleFavoriteClick = () => {
    onFavoriteClick(player);
  };

  return (
    <Card sx={{ width: '350px' }} size="lg" variant="outlined" className="card">
      <CardActions>
        <Typography level="title-lg" sx={{ mr: 'auto' }}>
          {first_name} {last_name}
        </Typography>
        <FavoriteIcon
          isFavorited={isFavorited}
          handleFavoriteClick={handleFavoriteClick}
        />
      </CardActions>
      <Chip size="md" variant="outlined" color="neutral">
        {team_name}
      </Chip>
      <Divider inset="none" />
      <CardContent sx={{ alignItems: 'center', textAlign: 'center', gap: 2 }}>
        <Typography> Position: {position} </Typography>
        <Typography> Height: {height} </Typography>
        <Typography> Weight: {weight} </Typography>
      </CardContent>
    </Card>
  );
};

export default PlayerCard;
