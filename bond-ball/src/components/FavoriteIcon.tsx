
import React from "react";
import Box from '@mui/joy/Box';
import Tooltip from '@mui/joy/Tooltip';
import StarTwoToneIcon from "@mui/icons-material/StarTwoTone";

interface FavoriteIconProps {
  isFavorited: Boolean;
}

const FavoriteIcon: React.FC<FavoriteIconProps> = ({
    isFavorited,
}) => {
  const action_text = isFavorited ? "remove" : "add"
  const preposition = isFavorited ? "from" : "to"
 return (
  <>
    <Tooltip 
      color='primary'
      title={`Click to ${action_text} this player ${preposition} your favorites.`}
      arrow
    >
   <Box className="favorite-icon-container" onClick={handleFavorite}>
     <StarTwoToneIcon
       className={`favorite-icon ${
         isFavorited ? "favorited" : "not-favorited"
       }`}
     />
   </Box>
 </Tooltip>
  </>
 );
};


export default PlayerCardContainer;