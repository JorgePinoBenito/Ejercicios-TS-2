type info = {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
};

type results = {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  url: string;
};

type location = {
  name: string;
  url: string;
};

type Planet = {
  name: string;
  url: string;
};

enum STATUS {
  ALIVE = "Alive",
  DEAD = "Dead",
  UNKNOWN = "unknown",
}

enum Gender {
  MALE = "Male",
  FEMALE = "Female",
  UNKNOWN = "unknown",
}
type Characters = {
  info: any;
  id: number;
  name: string;
  status: STATUS;
  species: string;
  gender: Gender;
  type: string;
  origin: Planet;
  location: location;
  image: string;
  episode: string[];
  url: string;
  created: string;
  results: results[];
};

type origin = {
  name: string;
  url: string;
};

const jsonResponse = await fetch("https://rickandmortyapi.com/api/character");
const jsonData: Characters = await jsonResponse.json();
debugger;

const ricks = jsonData.results
  .filter((char) => char.name.includes("Rick"))
  .map((char) => {
    return {
      name: char.name,
      status: char.status,
    };
  });

let next = jsonData.info.next;

while (next) {
  const response = await fetch(next);
  const data: Characters = await response.json();
  const loopricks = data.results
    .filter((char) => char.name.includes("Rick"))
    .map((char) => {
      return {
        name: char.name,
        status: char.status,
      };
    });
  ricks.push(...loopricks);
  next = data.info.next;
}

console.log(ricks);
