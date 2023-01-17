type Info = {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
};

type EpisodeInfo = {
  name: string;
  episode: string;
};

enum Gender {
  male = "Male",
  female = "Female",
  unknown = "Unknown",
}

/*enum Status {
  alive = "Alive",
  death = "Death",
  unknown = "Unknown",
}*/

export type Character = {
  id: number;
  name: string;
  status: string;
  species: string;
  episode: EpisodeInfo[];
};

/*export type CharactersData = {
  info: Info;
  results: Character[];
};*/
