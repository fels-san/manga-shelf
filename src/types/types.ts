export type Manga = {
  id: number;
  poster: string;
  miniPoster: string;
  title: string;
  originalTitle: string;
  licenseNameRu: string;
  licensors: string[];
  description: string;
  score: number;
  genres: string[];
  authors: { name: string; role: string }[];
  publishers: string[];
  airedOn: {
    year: number;
    month: number;
    day: number | null;
    date: string | null;
  };
  releasedOn: {
    year: number;
    month: number;
    day: number | null;
    date: string | null;
  };
  chapters: number;
  volumes: number;
};

export type MangaResponse = {
  id: number;
  name: string;
  russian: string;
  licenseNameRu: string;
  licensors: string[];
  score: number;
  poster: {
    originalUrl: string;
    mainUrl: string;
  };
  descriptionHtml: string;
  genres: {
    russian: string;
  }[];
  personRoles: {
    rolesRu: string[];
    person: {
      id: number;
      name: string;
      poster: {
        id: number;
      };
    };
  }[];
  publishers: { id: number; name: string }[];
  airedOn: {
    year: number | null;
    month: number | null;
    day: number | null;
    date: string | null;
  };
  releasedOn: {
    year: number | null;
    month: number | null;
    day: number | null;
    date: string | null;
  };
  chapters: number;
  volumes: number;
};

export type MangaAwards = {
  [key: string]: {
    name: string;
    description: string;
    winners: {
      [year: number]: string[];
    };
  };
};
