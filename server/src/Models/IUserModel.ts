import typia, {tags} from "typia";

export interface IUserModel {
    userid: number;
    name: string & tags.MaxLength<64>;
    email: string & tags.Format<"email">;
    score: number;
    password: string;
}