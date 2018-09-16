import {User} from "../models";

export enum MessageStatus {
    Pending =1,
    Sent,
    Delivered,
    Received
}

export interface IMessage
{
    facilityId: string | any;
    sender: string;
    senderInfo? : IMessenger;
    reciever: string;
    message: string;  // previously called message will be changed to content
    messageChannel:string;  
    messageStatus?:string; /* Message Status should be a  fixed constant*/
    channel:string;
    dateCreated? : Date;
    /*
    *  More proposed fields
    *  isGroupMessage
    *  isBlobMessage
    *  blobType :  Image | Video | pdf | World | Audio
    *  
    * 
    * */
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
export interface IDataPager
{
    pageSize: number ;  
    currentPage: number ; 
    totalRecord: number ; 
    totalPages: number ;
}
export interface IApiResponse<T> {
    pagination? : IDataPager;
    data: T;
    extraData? : any;
    query? : any;
    success:boolean;
    message : string;
    meta? : any;
    statusCode? : number;
    serverExceptions? : any;
    validations? : IValidationInfo;
    
}

export class ValidationRule {
    
   
    constructor(public title:string,public message :string , public content:string = "")
    {
        
    }
    public static createRule(title : string, message: string ) : ValidationRule
    {
        const res  = new ValidationRule(title, message)
        return res;
    }
    public static createRuleWithContent(title : string, message: string, content:string ) : ValidationRule
    {
        const res  = new ValidationRule(title, message,content)
        return res;
    }
}

export interface IValidationInfo
{
    hasIssues  : boolean;
    issues? : ValidationRule[] 
}

