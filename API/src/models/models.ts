export type AuthRequestBody = {
  email: string;
  password: string;
};

export enum VehiclePatchMode {
  cost_to_own, make, model, year,
};

export enum LocationPatchMode {
  address1, address2, city, state, zip_code,
};