import { tags } from "typia";

export type CreateUserData =  {
    name: string & tags.MaxLength<64>;
    email: string & tags.Format<"email">;
    password: string;
}