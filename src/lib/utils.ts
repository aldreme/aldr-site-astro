import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function productSlug(productName: string) {
  return productName.toLowerCase().replace(/\s+/g, "-")
}

export async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export interface GeoLocation {
  city: string,
  country: string
}

/**
 * readLocationFromLocalStorage function reads the location from the local storage.
 * @returns GeoLocation object with city and country properties or `null` if the location is not found in the local storage.
 */
export function readLocationFromLocalStorage() {
  if (typeof window === 'undefined') {
    console.info('running on server, localStorage is not defined, cannot read location from local storage.')
    return null;
  }

  console.info('reading location from local storage...');
  const storedLocation = localStorage.getItem('location');

  if (!storedLocation) {
    return null;
  }

  const { city, country } = JSON.parse(storedLocation);

  if (!city || !country) {
    return null;
  }

  return { city, country } as GeoLocation;
}

/**
 * writeLocationToLocalStorage function writes the location to the local storage.
 * @param location GeoLocation object with city and country properties.
 */
export function writeLocationToLocalStorage(location: GeoLocation) {
  if (typeof window === 'undefined') {
    console.info('running on server, localStorage is not defined, cannot save location to local storage.')
    return null;
  }

  console.info(`saving location to local storage: ${JSON.stringify(location)}`);

  localStorage.setItem('location', JSON.stringify(location));
}

/**
 * detectLocation function calls the supabase edge function `location` to detect the client's location.
 * @returns GeoLocation object with city and country properties or `null` if the location cannot be detected.
 */
export async function detectLocation() {
  let location = readLocationFromLocalStorage();
  if (location != null) {
    console.info(`location detected from local storage: ${JSON.stringify(location)}`);

    return location;
  }

  console.info('no location saved locally, detecting location from API...');

  const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_KEY;

  const locationApiEndpoint = `${SUPABASE_URL}/functions/v1/location`;
  const resp = await fetch(locationApiEndpoint, {
    headers: {
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    }
  });

  if (!resp.ok) {
    console.error(`failed to detect location through the location API, error: ${await resp.text()}`)
    return null;
  }

  const respJson = await resp.json();

  const { city, country }= respJson;

  if (!city || !country) {
    console.error(`failed to detect location through the location API, no city or country found`);
    return null;
  }

  location = {city, country};

  writeLocationToLocalStorage(location);

  console.info(`location detected from API: ${JSON.stringify(location)}`);

  return location;
}