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
            return "#009de0";            
        case Publisher.Carlsen:
            return "#24921f";          
        case Publisher.Egmont:
            return "#ffed00";         
        case Publisher.Kaze:
            return "#b80000";          
        case Publisher.MangaCult:
            return "#b80000";         
        case Publisher.SevenSeas:
            return "#";           
        case Publisher.Tokyopop:
            return "b80000";           
        case Publisher.VizMedia:
            return "#";            
        case Publisher.YenPress:
            return "#";           
        case Publisher.Other:
            return "#";           
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