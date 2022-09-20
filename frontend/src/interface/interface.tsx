export interface Account {
  username: string;
  password: string | number;
  email: string;
}

export interface handleInput {
  target: { value: string; name: string };
}
