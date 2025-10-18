// Authentication
export interface CredentialsData {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface GoogleOauthData {
  firstName: string;
  lastName: string;
  email: string;
  oauthUid: string;
  oauthProvider: string;
  oauthPicture: string;
}

// Current user interface
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  oauthProvider: string;
  oauthUid: string;
  oauthPicture: string;
  isOauth: boolean;
  passwordResetToken: string;
  activationToken: string;
  isActive: boolean;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITrip {
  _id?: string;
  tripName: string;
  origin: string;
  originCityCode: string;
  destination: string;
  destinationCityCode: string;
  startDate: string;
  endDate: string;
  budget: number;
  markers: { lat: number; lng: number; label: string }[];
  validationStatus?: {
    isValid: boolean;
    reason: string | null;
    lastChecked: string | null;
  };
  createdAt?: string;
}

export interface FilterState {
  tripName: string;
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  minBudget: string;
  maxBudget: string;
}

export interface CityCode {
  name: string;
  iataCode: string;
}

// Flight and Hotel Offers
export interface FlightSegment {
  departure: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  arrival: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  carrierCode: string;
  number: string;
  aircraft: {
    code: string;
  };
  operating?: {
    carrierCode?: string;
    carrierName?: string;
  };
  duration: string;
  id: string;
  numberOfStops: number;
  blacklistedInEU: boolean;
}

export interface FlightItinerary {
  duration: string;
  segments: FlightSegment[];
}

export interface FlightPrice {
  currency: string;
  total: string;
  base: string;
  fees: Array<{
    amount: string;
    type: string;
  }>;
  grandTotal: string;
  additionalServices?: Array<{
    amount: string;
    type: string;
  }>;
}

export interface Amenity {
  description: string;
  isChargeable: boolean;
  amenityType: string;
  amenityProvider: {
    name: string;
  };
}

export interface FareDetailsBySegment {
  segmentId: string;
  cabin: string;
  fareBasis: string;
  brandedFare: string;
  brandedFareLabel: string;
  class: string;
  includedCheckedBags: {
    quantity: number;
  };
  includedCabinBags: {
    quantity: number;
  };
  amenities: Amenity[];
}

export interface TravelerPricing {
  travelerId: string;
  fareOption: string;
  travelerType: string;
  price: {
    currency: string;
    total: string;
    base: string;
  };
  fareDetailsBySegment: FareDetailsBySegment[];
}

export interface FlightOffer {
  type: string;
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  isUpsellOffer: boolean;
  lastTicketingDate: string;
  lastTicketingDateTime: string;
  numberOfBookableSeats: number;
  itineraries: FlightItinerary[];
  price: FlightPrice;
  pricingOptions: {
    fareType: string[];
    includedCheckedBagsOnly: boolean;
  };
  validatingAirlineCodes: string[];
  travelerPricings: TravelerPricing[];
}

export interface HotelOffer {
  chainCode: string;
  iataCode: string;
  dupeId: number;
  name: string;
  hotelId: string;
  geoCode: {
    latitude: number;
    longitude: number;
  };
  address: {
    countryCode: string;
    postalCode: string;
    cityName: string;
    lines: string[];
  };
  masterChainCode?: string;
  lastUpdate: string;
}

export interface RecommendedOffer {
  flight: FlightOffer;
  hotel: HotelOffer;
  combinedPrice: number;
  combinedScore: number;
  fitsBudget: boolean;
  flightScore: number;
  hotelScore: number;
  currency: string;
  flightPrice: string;
  hotelPrice: string;
}

export interface TripOffersData {
  tip: string;
  recommended: RecommendedOffer;
  flights: FlightOffer[];
  hotels: HotelOffer[];
  currency: string;
}
