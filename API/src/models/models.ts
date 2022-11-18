//email and password for authentification 
export interface AuthRequestBody {
  email: string;
  password: string;
};
//vehicle information
export enum VehiclePatchMode {
  cost_to_own, make, model, year,
};
//user inputted address
export enum LocationPatchMode {
  address1, address2, city, state, zip_code,
};
//time metric used for data analysis 
export type Metric = {
  total: number;
  average: number;
  period: "1d" | "7d" | "30d" | "1y" | "all";
};
//type of user, for registration and editing data
export interface ProfileReqBody {
  employeeType: "mobile" | "stationary";
  hoursPerWeek?: number; // if stationary
  workAddress?: string; // if statiionary
  wage: number;
  userId: string;
}
//profile information
export class Profile {
  profile_id: number = 0;
  employee_type: "mobile" | "stationary" = "mobile";
  hours_per_week: number = 0;
  work_address: string = "";
  wage: number = 0;
  user_id = 1;
  last_modified: string = new Date().toDateString();
}
//car information
export interface Car {
  make: string;
  model: string;
  year: string;
}
//financial information to be inputted, additional driver option if selected
export interface Finances {
  fixedWage: number;
  tipsPerHour: number;
  adjustedWage: number;
  hours: number;
  driverFinances?: DriverFinances;
}
//detailed driver finance information 
export interface DriverFinances {
  cpm: number; // Cost per mile
  miles: number;
  repairs: number;
  fines: number;
}
//current location (lat,long)
export interface Location {
  x: number;
  y: number;
}
//transactional information to input
export interface Transaction {
  amount: number;
  location: Location;
  time: number;
}
