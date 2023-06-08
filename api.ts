import axios from 'axios';

const BASE_URL = 'https://frontend-take-home-service.fetch.com';

// Function to make authenticated requests
const fetchWithAuth = async (url: string, method = 'GET', data = {}) => {
  const response = await axios({
    method,
    url: `${BASE_URL}${url}`,
    withCredentials: true,
    data,
  });
  return response.data;
};

// Function to log in and obtain the auth cookie
export const login = async (name: string, email: string) => {
  const response = await fetchWithAuth('/auth/login', 'POST', { name, email });
  return response;
};

// Function to log out and invalidate the auth cookie
export const logout = async () => {
  const response = await fetchWithAuth('/auth/logout', 'POST');
  return response;
};

// Function to fetch dogs data
export const fetchBreeds = async () => {
  const response = await fetchWithAuth('/dogs/breeds');
  return response;
};

// Function to fetch location data
export const fetchLocations = async () => {
  const response = await fetchWithAuth('/locations');
  return response;
};

export const searchDogs = async (queryParameters: {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  sort?: string;
}) => {
  const url = `/dogs/search`;

  // Remove undefined and convert arrays to comma-separated strings
  const processedQueryParameters: Record<string, string> = {};

  if (queryParameters.breeds && queryParameters.breeds.length > 0) {
    processedQueryParameters.breeds = queryParameters.breeds.join(',');
  }

  if (queryParameters.zipCodes && queryParameters.zipCodes.length > 0) {
    processedQueryParameters.zipCodes = queryParameters.zipCodes.join(',');
  }

  if (queryParameters.ageMin !== undefined) {
    processedQueryParameters.ageMin = queryParameters.ageMin.toString();
  }

  if (queryParameters.ageMax !== undefined) {
    processedQueryParameters.ageMax = queryParameters.ageMax.toString();
  }

  if (queryParameters.sort) {
    processedQueryParameters.sort = queryParameters.sort;
  }

  const queryParams = new URLSearchParams(processedQueryParameters);
  const completeUrl = `${url}?${queryParameters}`;
  console.log('Search URL:', completeUrl);

  const response = await fetchWithAuth(completeUrl, 'GET');
  return response;
};

// Function to fetch dogs by IDs
export const fetchDogs = async (dogIds: string[]) => {
  const response = await fetchWithAuth('/dogs', 'POST', dogIds);
  return response;
};

// Function to fetch next results
export const fetchNextResults = async (nextResultsUrl: string) => {
  const response = await fetchWithAuth(nextResultsUrl);
  return response;
}

// Function to get previous results
export const fetchPreviousResults = async (previousResultsUrl: string) => {
  const response = await fetchWithAuth(previousResultsUrl);
  return response;
}

// Function to match with a dog for adoption
export const matchDogForAdoption = async (dogIds: string[]) => {
  const response = await fetchWithAuth('/dogs/match', 'POST', dogIds);
  return response;
};