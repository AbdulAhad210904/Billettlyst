export interface Event {
  id: string;
  name: string;
  type: string;
  url: string;
  locale: string;
  images: Image[];
  sales: {
    public: {
      startDateTime: string;
      endDateTime: string;
    };
  };
  dates: {
    start: {
      localDate: string;
      localTime: string;
      dateTime: string;
    };
    timezone: string;
    status: {
      code: string;
    };
  };
  classifications?: Classification[];
  promoter?: {
    id: string;
    name: string;
  };
  priceRanges?: PriceRange[];
  _embedded?: {
    venues?: Venue[];
    attractions?: Attraction[];
  };
  info?: string;
  pleaseNote?: string;
}

export interface Image {
  ratio: string;
  url: string;
  width: number;
  height: number;
}

export interface Classification {
  primary: boolean;
  segment: {
    id: string;
    name: string;
  };
  genre: {
    id: string;
    name: string;
  };
  subGenre: {
    id: string;
    name: string;
  };
}

export interface PriceRange {
  type: string;
  currency: string;
  min: number;
  max: number;
}

export interface Venue {
  id: string;
  name: string;
  type: string;
  url: string;
  locale: string;
  images?: Image[];
  postalCode: string;
  timezone: string;
  city: {
    name: string;
  };
  state: {
    name: string;
    stateCode: string;
  };
  country: {
    name: string;
    countryCode: string;
  };
  address: {
    line1: string;
  };
  location: {
    longitude: string;
    latitude: string;
  };
}

export interface Attraction {
  id: string;
  name: string;
  type: string;
  url: string;
  locale: string;
  images?: Image[];
  classifications: Classification[];
}

export interface WishlistItem {
  id: string;
  type: 'event' | 'attraction' | 'venue';
  name: string;
  image?: string;
}