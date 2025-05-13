import { Event, Attraction, Venue } from '../types';

const API_KEY = 'Ox90qokGcqgD08yQVKM9iDpXjic6b8hD'; // Updated API key
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';

export async function fetchEventsByCity(city: string, size: number = 10): Promise<Event[]> {
  try {
    const encodedCity = encodeURIComponent(city);
    const response = await fetch(
      `${BASE_URL}/events.json?apikey=${API_KEY}&city=${encodedCity}&size=${size}`
    );
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data._embedded?.events || [];
  } catch (error) {
    console.error('Error fetching events by city:', error);
    return [];
  }
}

export async function fetchEventById(id: string): Promise<Event | null> {
  try {
    const encodedId = encodeURIComponent(id);
    const response = await fetch(
      `${BASE_URL}/events/${encodedId}.json?apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching event details:', error);
    return null;
  }
}

export async function searchEvents(keyword: string): Promise<Event[]> {
  try {
    const encodedKeyword = encodeURIComponent(keyword);
    const response = await fetch(
      `${BASE_URL}/events.json?apikey=${API_KEY}&keyword=${encodedKeyword}`
    );
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data._embedded?.events || [];
  } catch (error) {
    console.error('Error searching events:', error);
    return [];
  }
}

export async function fetchCategoryContent(
  type: string,
  filters: { date?: string; country?: string; city?: string } = {}
): Promise<{ attractions: Attraction[]; events: Event[]; venues: Venue[] }> {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams({
      apikey: API_KEY,
      keyword: encodeURIComponent(type),
    });
    
    // Add filters if they exist
    if (filters.date) queryParams.append('startDateTime', filters.date);
    if (filters.country) queryParams.append('countryCode', filters.country);
    if (filters.city) queryParams.append('city', encodeURIComponent(filters.city));
    
    // Fetch attractions
    const attractionsResponse = await fetch(
      `${BASE_URL}/attractions.json?${queryParams.toString()}`
    );
    
    // Fetch events
    const eventsResponse = await fetch(
      `${BASE_URL}/events.json?${queryParams.toString()}`
    );
    
    // Fetch venues
    const venuesResponse = await fetch(
      `${BASE_URL}/venues.json?${queryParams.toString()}`
    );
    
    const attractionsData = await attractionsResponse.json();
    const eventsData = await eventsResponse.json();
    const venuesData = await venuesResponse.json();
    
    return {
      attractions: attractionsData._embedded?.attractions || [],
      events: eventsData._embedded?.events || [],
      venues: venuesData._embedded?.venues || [],
    };
  } catch (error) {
    console.error('Error fetching category content:', error);
    return { attractions: [], events: [], venues: [] };
  }
}

export async function fetchSuggest(keyword: string): Promise<{
  attractions: Attraction[];
  events: Event[];
  venues: Venue[];
}> {
  try {
    const encodedKeyword = encodeURIComponent(keyword);
    const response = await fetch(
      `${BASE_URL}/suggest.json?apikey=${API_KEY}&keyword=${encodedKeyword}`
    );
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    
    return {
      attractions: data._embedded?.attractions || [],
      events: data._embedded?.events || [],
      venues: data._embedded?.venues || [],
    };
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return { attractions: [], events: [], venues: [] };
  }
}