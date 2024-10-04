import Parse from 'parse'

import { User } from '../user';


export interface IReview extends Parse.Object {
    user: User;
    rating: number;
    review: string;
    imageUri: string
}