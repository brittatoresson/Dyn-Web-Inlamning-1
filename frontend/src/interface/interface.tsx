export interface Account {
    username: string;
    password: string | number;
    email: string;
    isAdmin: boolean;
}
export interface handleInput {
    target: { value: string; name: string };
}

export interface Start {
    state: StateStart;
}
interface StateStart {
    start: boolean;
    setStart: (active: boolean) => void;
}

export interface userData {
  _id?: "";
  userdata: { _id: ""; username: "" };
  username: "";
}
