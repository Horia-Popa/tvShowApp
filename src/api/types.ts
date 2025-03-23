export interface ShowResponse {
  id: number;
  url: string;
  name: string;
  type: string;
  language: string;
  genres: string[];
  status: string;
  runtime: number | null;
  averageRuntime: number;
  premiered: string;
  ended: string | null;
  officialSite: string;
  schedule: {
    time: string;
    days: string[];
  };
  rating: {
    average: number | null;
  };
  weight: number;
  network: null;
  webChannel: {
    id: number;
    name: string;
    country: any;
    officialSite: string;
  } | null;
  dvdCountry: any;
  externals: {
    tvrage: number | null;
    thetvdb: number | null;
    imdb: string | null;
  };
  image: {
    medium: string;
    original: string;
  } | null;
  summary: string;
  updated: number;
  _links: {
    self: {
      href: string;
    };
    previousepisode?: {
      href: string;
      name: string;
    };
  };
}

export interface EpisodeResponse {
  id: number;
  url: string;
  name: string;
  season: number;
  number: number;
  type: string;
  airdate: string;
  airtime: string;
  airstamp: string;
  runtime: number;
  rating: {
    average: number | null;
  };
  image: {
    medium: string;
    original: string;
  } | null;
  summary: string;
  _links: {
    self: {
      href: string;
    };
    show?: {
      href: string;
    };
  };
}

export interface CastMemberResponse {
  person: {
    id: number;
    url: string;
    name: string;
    country: {
      name: string;
      code: string;
      timezone: string;
    } | null;
    birthday: string | null;
    deathday: string | null;
    gender: string | null;
    image: {
      medium: string;
      original: string;
    } | null;
    updated: number;
    _links: {
      self: {
        href: string;
      };
    };
  };
  character: {
    id: number;
    url: string;
    name: string;
    image: {
      medium: string;
      original: string;
    } | null;
    _links: {
      self: {
        href: string;
      };
    };
  };
  self: boolean;
  voice: boolean;
}
