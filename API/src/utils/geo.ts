import { Client, GeocodeRequest, LatLngLiteral, ReverseGeocodeRequest } from "@googlemaps/google-maps-services-js";
import { geocode } from "@googlemaps/google-maps-services-js/dist/geocode/geocode";
import {Address, latlng} from "../models/models";

const client = new Client();

export const geo = {

    /**
     * @function geocode()
     * 
     * @brief   This function returns the longitude and latitude corresponding to an address making
     *          use of the Google Maps Geocoding API.
     * 
     * @param   {Address}       address 
     * 
     * @returns {Promise<latlng>} a latitude and longitude pair corresponding to the address
     * 
     * @example
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
            return { lat: null, lng: null };
        }
    },

    /**
     * @function reverseGeocode()
     * 
     * @brief   This function takes a latitude and longitude, and returns the address corresponding
     *          to it using the Google Maps Geocoding API.
     * 
     * @param   {latlng} latlng
     * 
     * @returns {}
     * 
     * @example
     *      await reverseGeocode(28.5971482, -81.203793);
     */
    reverseGeocode: async(latlng: latlng): Promise<Address> => {
        try {
            if (latlng.lat == null || latlng.lng == null) {
                throw new Error("latlng has a null field");
            }

            const args: ReverseGeocodeRequest = {
                params: {
                    key: String(process.env.GOOGLE_API_KEY),
                    latlng: {
                        lat: latlng.lat,
                        lng: latlng.lng,
                    },
                }
            };

            const rgcREsponse = await client.reverseGeocode(args);
            const components = rgcREsponse.data.results[0].address_components;

            return { address_1: `${components[0].long_name} ${components[1].long_name}`,
                    address_2: ``,
                    city: `${components[2].long_name}`,
                    state: `${components[4].short_name}`,
                    zip_code: `${components[6].short_name}`
                };
        } catch (e) {
            console.log("Error reverse geocoding location", e, latlng.lat, latlng.lng);
            return {address_1: "", address_2: "", city: "", state: "", zip_code: ""};
        }
    },
};
