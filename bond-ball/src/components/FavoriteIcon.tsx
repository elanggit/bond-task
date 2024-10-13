import React from 'react';
import Box from '@mui/joy/Box';
import Tooltip from '@mui/joy/Tooltip';
import StarTwoToneIcon from '@mui/icons-material/StarTwoTone';

interface FavoriteIconProps {
  isFavorited: Boolean;
  handleFavoriteClick: () => void;
}

const FavoriteIcon: React.FC<FavoriteIconProps> = ({ isFavorited, handleFavoriteClick }) => {
  const action_text = isFavorited ? 'remove' : 'add';
  const preposition = isFavorited ? 'from' : 'to';
  return (
    <>
      <Tooltip
        color="primary"
        title={`Click to ${action_text} this player ${preposition} your favorites.`}
        arrow
      >
        <Box className="favorite-icon-container" onClick={handleFavoriteClick}>
          <StarTwoToneIcon
            className={`favorite-icon ${
              isFavorited ? 'favorited' : 'not-favorited'
            }`}
          />
        </Box>
      </Tooltip>
    </>
  );
};

export default FavoriteIcon;
