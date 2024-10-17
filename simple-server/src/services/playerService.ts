import Player from '../models/player';

interface Team {
  full_name: string;
}

interface PlayerData {
  first_name: string;
  last_name: string;
  position: string;
  height: string;
  weight: string;
  team: Team;
  id: number;
}

export const formatPlayerData = (playerData: PlayerData[]) =>
  playerData?.map((playerData: PlayerData) => {
    return new Player({
      first_name: playerData.first_name,
      last_name: playerData.last_name,
      position: playerData.position,
      height: playerData.height,
      weight: playerData.weight,
      team_name: playerData.team.full_name,
      id: playerData.id,
    });
  });
