export interface Account {
    username: string;
    password?: string | number;
    email: string;
    isAdmin?: boolean;
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
    _id?: string;
    email: string;
    isAdmin?: boolean;
    username: string;
}
export interface imageData {
    savedPhoto: string;
    userID: string;
    _id: string;
    isPublic?: boolean;
    dateObj?: { date: ""; time: "" };
    caption?: "";
}

export interface caption {
    username: string;
    caption: string;
}
