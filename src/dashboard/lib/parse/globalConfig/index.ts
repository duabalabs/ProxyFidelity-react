import { BaseClass } from "../class/baseClasses";
import { ParseFunctions } from "../class/parseFunctions";

export type KeysEnum<T> = { [P in keyof Required<T>]: true };
export class CloudConfig extends BaseClass {
  constructor(cloudConfig?: any) {
    super();
    this.fromObject(cloudConfig);
  }
  async initialize(configKeys: KeysEnum<any>) {
    const cloudConfig = {} as any;
    const config = await ParseFunctions.performAction(Parse.Config.get(), true);
    if (!config) {
      return;
    }
    Object.keys(configKeys).forEach((param) => {
      cloudConfig[`${param}`] = config.get(param);
    });
    this.fromObject(cloudConfig);
  }
}

/* 
Ex: 
export interface ICloudConfig {
  phoneNumber: string;
  email: string;
  distanceNearFilter: number;
  orderRadiusBoundaryMiles: number;
  orderTimeout: number;
  serviceFee: string;
  deliveryFee: string;
}

export const ICloudConfigKeys: KeysEnum<ICloudConfig> = {
  phoneNumber: true,
  email: true,
  distanceNearFilter: true,
  orderRadiusBoundaryMiles: true,
  orderTimeout: true,
  serviceFee: true,
  deliveryFee: true,
};

const cloudConfig = new CloudConfig() as ICloudConfig
cloudConfig.initialize()

*/