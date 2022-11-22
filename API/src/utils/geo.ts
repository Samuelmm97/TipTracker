import { Client, GeocodeRequest, LatLngLiteral, ReverseGeocodeRequest } from "@googlemaps/google-maps-services-js";
import { geocode } from "@googlemaps/google-maps-services-js/dist/geocode/geocode";
import {Address} from "../models/models";

const client = new Client();

export const geo = {

    geocode: async(address: Address) => {
        try {
            const args: GeocodeRequest = {
                params: {
                    key: String(process.env.GOOGLE_API_KEY),
                    address: address.address1 + " " + 
                            address.city + " " +
                            address.state + " " +
                            address.zip_code, 
                }
            };

            const gcResponse = await client.geocode(args);

            return gcResponse.data.results[0].geometry.location;
        } catch (e) {
            console.log("Error geocoding location", e, address);
            return e;
        }
    },

    reverseGeocode: async(lat: number, lng: number) => {
        try {
            const args: ReverseGeocodeRequest = {
                params: {
                    key: String(process.env.GOOGLE_API_KEY),
                    latlng: {
                        lat: lat,
                        lng: lng,
                    },
                }
            };

            const rgcREsponse = await client.reverseGeocode(args);

            return rgcREsponse.data.results[0].address_components;
        } catch (e) {
            console.log("Error reverse geocoding location", e, lat, lng);
            return e;
        }
    },
};
