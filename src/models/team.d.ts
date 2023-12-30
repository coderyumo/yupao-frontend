/**
 * 队伍类别
 */
import {UserType} from "./user";

export type TeamType = {
    id: number;
    name: string;
    description: string;
    password: string;
    maxNum: number;
    expireTime?:Date;
    userId:number;
    createUsername: string;
    createAvatarUrl?: string;
    status: number;
    createTime: Date;
    updateTime: Date;
    userList: UserType[]
};