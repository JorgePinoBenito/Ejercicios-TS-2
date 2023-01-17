export type Human = {
  name: string;
  id: string;
  car: Car;
};

export type Car = {
  plate: string;
  driver: Human;
};
