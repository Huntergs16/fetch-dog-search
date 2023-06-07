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

// Function to search dogs with filter options
export const searchDogs = async (queryParameters: {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
}) => {
  const response = await fetchWithAuth('/dogs/search', 'GET', queryParameters);
  return response;
};

// Function to search dogs with filter options
export const fetchDogs = async (queryParameters: {
  id?: string[];
}) => {
  const response = await fetchWithAuth('/dogs', 'POST', queryParameters);
  return response;
};