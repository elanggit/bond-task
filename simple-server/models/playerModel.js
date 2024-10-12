class Player {
  constructor({id, first_name, last_name, position, height, weight, team_name }) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.position = position;
    this.height = height;
    this.weight = weight;
    this.team_name = team_name;
    this.id = id;
  }
};

module.exports = Player;