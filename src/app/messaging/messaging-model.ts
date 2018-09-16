import {User} from "../models";

export enum MessageStatus {
    Pending =1,
    Sent,
    Delivered,
    Received
}

export interface IMessage
{
    facilityId: string | any,
    sender: string;
    reciever: string;
    message: string;
    messageChannel:string;  
    messageStatus:string; /* Message Status should be a  fixed constant*/
    channel:string;
    dateCreated? : Date;
}

export interface IMessageChannel
{
    title  : string,
    description  :string;
    _id : string,
    users : IMessenger[],
    dateCreated? : Date
    createdBy? : IMessenger;
    lastMessage? : IMessage;
    totalOfflineMessage? : number;
}


export interface IMessenger
{
    displayName  :  string;
    id : string;
    onlineStatus? :  "Online" | "Offline" | "Busy";
    fromUser?(user :  User) : IMessenger ;
    
}



