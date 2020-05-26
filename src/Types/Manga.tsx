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

export const getColorFromPublisher = (publisher: Publisher): string => {
    switch (publisher) {
        case Publisher.altraverse:
            return "#02A9FF";
        case Publisher.Carlsen:
            return "#72E342";
        case Publisher.Egmont:
            return "#f779a4";
        case Publisher.Kaze:
            return "#f79a63";
        case Publisher.MangaCult:
            return "#5c4dec";
        case Publisher.SevenSeas:
            return "#23c4c4";
        case Publisher.Tokyopop:
            return "#f14f63";
        case Publisher.VizMedia:
            return "#f5f36d";
        case Publisher.YenPress:
            return "#a44dfc";
        case Publisher.Other:
            return "#848286";
    }
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

export const getColorFromGenre = (genre: Genre): string => {
    switch (genre) {
        case Genre.Action:
            return "#f14f63";
        case Genre.Adventure:
            return "#f79a63";
        case Genre.Comedy:
            return "#72e342";
        case Genre.Drama:
            return "#f5f36d";
        case Genre.Fantasy:
            return "#524dec";
        case Genre.Horror:
            return "#000000";
        case Genre.Isekai:
            return "#02a9ff";
        case Genre.Mystery:
            return "#848286";
        case Genre.Shojo:
            return "#f779a4";
        case Genre.SliceOfLife:
            return "#23c4c4";
        case Genre.Yuri:
            return "#a44dec";

    }
}