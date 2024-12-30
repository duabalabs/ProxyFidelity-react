import Parse from 'parse'
export interface ICoordinates extends Parse.GeoPoint {
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  altitudeAccuracy?: number;
}
export interface IAddress extends Parse.Object {
  label?: string;
  coordinates?: ICoordinates;
  digitalAddress?: string;
  houseNumber?: string;
  streetNumber?: string;
  streetName?: string;
  name?: string;
  fullName?: string;
  formattedAddress?: string;
  postCode?: string;
  zipCode?: string;
  city?: string;
  district?: string;
  region?: string;
  area?: string;
  state?: string;
  country?: string;
  countryCode?: string;
  adminArea?: string;
  locality?: string;
}
