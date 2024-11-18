import { tags } from "typia";

export interface ICreateUserData {
    name: string & tags.MaxLength<64>;
    email: string & tags.Format<"email">;
    password: string;
}