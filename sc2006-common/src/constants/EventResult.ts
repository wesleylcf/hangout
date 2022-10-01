import { Timestamp } from 'firebase/firestore';

export interface DbEventResult {
	// Because firebase doesn't allow directly nested arrays
	suggestedDates: Record<string, Array<{ start: string; end: string }>>;
	suggestions: {
		[category: string]: DbPlace;
	};
	createdAt: Timestamp;
}

export const EVENT_DATETIME_FORMAT = 'ddd LL HH:mm';
export const EVENT_DATE_FORMAT = 'ddd (DD MMM)';

export interface DbPlace {
	name: string;
	address: string;
	postal: number;
	coordinates: [lat: number, lng: number];
	distanceFromCenter: number;
}

export interface GeoapifyResponse {
	type: 'FeatureCollection';
	features: Array<GeoapifyFeature>;
}

export interface GeoapifyFeature {
	type: 'Feature';
	properties: {
		name: string;
		street: string;
		suburb: string;
		county: string;
		postcode: string;
		country: string;
		country_code: string;
		lon: number;
		lat: number;
		formatted: string;
		address_line1: string;
		address_line2: string;
		categories: string[];
		details: string[];
		datasource: any;
		distance: number;
		place_id: string;
	};
}
