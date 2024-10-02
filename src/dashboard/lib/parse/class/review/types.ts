import Parse from 'parse'
import { Customer } from "..";

export interface IReview extends Parse.Object {
    customer: Customer;
    rating: number;
    review: string;
    imageUri: string
}