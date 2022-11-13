export interface AuthRequestBody {
  email: string;
  password: string;
};

export enum VehiclePatchMode {
  cost_to_own, make, model, year,
};

export enum LocationPatchMode {
  address1, address2, city, state, zip_code,
};

export type Metric = {
  total: number;
  average: number;
  period: "1d" | "7d" | "30d" | "1y" | "all";
};

export interface ProfileReqBody {
  employeeType: "mobile" | "stationary";
  hoursPerWeek?: number; // if stationary
  workAddress?: string; // if statiionary
  wage: number;
  userId: string;
}

export class Profile {
  profile_id: number = 0;
  employee_type: "mobile" | "stationary" = "mobile";
  hours_per_week: number = 0;
  work_address: string = "";
  wage: number = 0;
  user_id = 1;
  last_modified: string = new Date().toDateString();
}

export interface Car {
  make: string;
  model: string;
  year: string;
}

export interface Finances {
  fixedWage: number;
  tipsPerHour: number;
  adjustedWage: number;
  hours: number;
  driverFinances?: DriverFinances;
}

export interface DriverFinances {
  cpm: number; // Cost per mile
  miles: number;
  repairs: number;
  fines: number;
}

export interface Location {
  x: number;
  y: number;
}

export interface Transaction {
  amount: number;
  location: Location;
  time: number;
}
