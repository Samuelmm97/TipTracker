import { Client, GeocodeRequest, LatLngLiteral, ReverseGeocodeRequest } from "@googlemaps/google-maps-services-js";
import { geocode } from "@googlemaps/google-maps-services-js/dist/geocode/geocode";
import {Address, latlng} from "../models/models";

const client = new Client();

/**
 * TODO:
 * fix api to fit prototype db (done)
 * geocode all locations (done)
 * add "return by proximity" function
 */

export const geo = {

    /**
     * @function geocode()
     * 
     * @brief   This function returns the longitude and latitude corresponding to an address making
     *          use of the Google Maps Geocoding API.
     * 
     * @param   {Address}       address 
     * 
     * @returns {}
     * 
     * @example
     *      geocode(address1);
     *      await geocode({
     *          address_1: "4000 Central Florida Blvd",
     *          address_2: "",
     *          city: "Orlando",
     *          state: "FL",
     *          zip_code: "32816"});
     */
    geocode: async(address: Address): Promise<latlng> => {
        try {
            const args: GeocodeRequest = {
                params: {
                    key: String(process.env.GOOGLE_API_KEY),
                    address: address.address_1 + " " + 
                            address.city + " " +
                            address.state + " " +
                            address.zip_code, 
                }
            };

            const gcResponse = await client.geocode(args);

            return gcResponse.data.results[0].geometry.location;
        } catch (e) {
            console.log("Error geocoding location", e, address);
            return { lat: null, lng: null};
        }
    },

    /**
     * @function reverseGeocode()
     * 
     * @brief   This function takes a latitude and longitude, and returns the address corresponding
     *          to it using the Google Maps Geocoding API.
     * 
     * @param   {number}    lat 
     * @param   {number}    lng 
     * 
     * @returns {}
     * 
     * @example
     *      reverseGeocode(lat1, lng1);
     *      await reverseGeocode(28.5971482, -81.203793);
     */
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
