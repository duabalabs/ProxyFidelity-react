import Parse from "parse/react-native";

import { Actions } from "lib_cloud/base_classes/actions";
import { IPayment } from "./types"
import { IPaymentActions } from "lib_cloud/parse/config/ICloud";

export class PaymentActions extends Actions implements IPaymentActions {
  requestOTPValidation = async (payment: IPayment) => {
    try {
      const body = { phoneNumber: payment.phoneNumber };
      const response = await Parse.Cloud.run("requestOTPValidation", body);
      return Promise.resolve(response);
    } catch (err) {
      return Promise.reject(err);
    }
  };
  validateoMomoOTP = async (payment: IPayment, otp: string) => {
    try {
      const body = { paymentId: payment.id, otp: otp };
      return Parse.Cloud.run("validateoMomoOTP", body);
    } catch (err) {
      return Promise.reject(err);
    }
  };
}
