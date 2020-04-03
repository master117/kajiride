export interface Manga {
    mangaid: number;
    name: string;
    author: string;
    artist: string;
    publisher: Publisher;
    status: Status;
    volumes: number;
    language: Language;
    genre: Genre;
    image: string;
    description: string;
    originalname: string;
}

export enum Publisher {
    altraverse = "altraverse",
    Carlsen = "Carlsen",
    Egmont = "Egmont",
    Kaze = "Kazé",
    MangaCult = "Manga Cult",
    SevenSeas = "Seven Seas",
    Tokyopop = "Tokyopop",
    VizMedia = "Viz Media",
    YenPress = "Yen Press",
    Other = "Other",
}

export enum Status {
    releasing = "releasing", 
    finished = "finished",
}

export enum Language {
    de = "de", 
    en = "en", 
    jp = "jp",
}

export enum Genre {
    Action = "Action",
    Adventure = "Adventure",
    Comedy = "Comedy",
    Drama = "Drama",
    Fantasy = "Fantasy",
    Horror = "Horror",
    Isekai = "Isekai",
    Mystery = "Mystery",
    Shojo = "Shojo",
    SliceOfLife = "Slice of Life",
    Yuri = "Yuri",
}