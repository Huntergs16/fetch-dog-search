import { convertAgeToString } from './utils';

interface Dog {
    id: string
    img: string
    name: string
    age: number
    zip_code: string
    breed: string
}

// Update the Dog interface using a custom getter for the age property
export interface DogWithCustomAge extends Dog {
    age: number | string;
}
  
export interface Location {
    zip_code: string
    latitude: number
    longitude: number
    city: string
    state: string
    county: string
}

export interface DogSearchResult {
    resultIds: string[];
    total: number;
    next?: string;
    prev?: string;
}

export interface Match {
    match: string
}