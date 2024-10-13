
const Player = require('../models/player'); 

const formatPlayerData = (player_data) => player_data.map(playerData => {
  return new Player({
    first_name: playerData.first_name,
    last_name: playerData.last_name,
    position: playerData.position,
    height: playerData.height,
    weight: parseFloat(playerData.weight),
    team_name: playerData.team.full_name,
    id: playerData.id
  });
});

module.exports = {
  formatPlayerData
};
