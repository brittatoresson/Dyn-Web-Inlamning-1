export interface Account {
  username: string;
  password: string | number;
  email: string;
  isAdmin: boolean;
}
export interface handleInput {
  target: { value: string; name: string };
}
