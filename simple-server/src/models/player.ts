class Player {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  height: string;
  weight: string;
  team_name: string;
  constructor({id, first_name, last_name, position, height, weight, team_name }: {id: number, first_name: string, last_name: string, position: string, height: string, weight: string, team_name: string}) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.position = position;
    this.height = height;
    this.weight = weight;
    this.team_name = team_name;
  }
};

export default Player;