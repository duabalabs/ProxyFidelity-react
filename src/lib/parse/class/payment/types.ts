import Parse from 'parse'
import { Address } from "..";

export enum PAYMENT_METHODS {
  MOMO = "momo",
  CARD = "card",
  PAYPAL = "paypal",
  APPLEPAY = "applepay",
  GOOGLEPAY = "googlepay",
}
export enum MOMO_TYPES {
  MTN = "mtn",
  AIRTEL_TIGO = "airteltigo",
  VODAFONE = "vodafone",
}
export enum CARD_TYPES {
  VISA = "visa",
  DISCOVER = "discover",
  MASTERCARD = "mastercard",
}

export interface PaymentMethodType {
  id: MOMO_TYPES | CARD_TYPES;
  name: string;
  image: string;
}
export interface IPaymentMethod {
  id: PAYMENT_METHODS;
  name: string;
  image: string;
  supportedCountryCodes: [];
  types: PaymentMethodType[];
}

interface IPaymentCard {
  name: string;
  cardNumber: string;
  expireDate: Date;
  cvv: string;
  billingAddress: Address;
}

export interface IPayment extends Parse.Object {
  label?: string;
  method: PAYMENT_METHODS;
  type: MOMO_TYPES | CARD_TYPES;
  data?: string;
  countryCode?: string;
  phoneNumber?: string;
  paymentCard?: IPaymentCard;
  otpValidated?: boolean;
  active?: boolean;
}
