import {Injectable} from '@angular/core';
import {IMessage, IMessageChannel, IMessenger} from "./messaging-model";
import {RestService, SocketService} from "../feathers/feathers.service";
import {JoinChannelService} from "../services/facility-manager/setup/join-channel.service";


const MESSAGE_ENDPOINT = "/messages", CHANNEL_ENDPOINT = "/channels", COMMUNICATION_ENDPOINT = "/communication";


@Injectable()
export class MessagingService {
   
    rest : any ; socket : any;
    constructor(private joinFacilityChannel : JoinChannelService  , private socketIoService: SocketService, private restfulService : RestService) {
        this.rest    = restfulService.getService("invoices");
        console.log(this.rest);
    }

    /*
    *  We assume that the Deafult HttpInterceptor will attach the bearer token for every request
    *  ---- SOCKET Calls not implemented yet
    *  
    * */
    // get message call :  returns all messages / conversation for the given channel-id (for a group or a one-to-one private conversation) 
    //expect to return an observable of ApiResonse object that will include a messages payload in the data property
    // and also an pagination object, statuses for the call etc
    getMessages(criteria: any) {
       // let result = this.http.get(`${this.baseUrl}${MESSAGE_ENDPOINT}`, {params: criteria});
        let res : IMessage[]  = [];
        if(criteria.channelId === "0001")
        {
            res = [
                {
                    message: "The Patient is Sleeping and healthy",
                    channel : "0001",
                    facilityId : "facility-a",
                    messageStatus : "Sent",
                    dateCreated : new Date(),
                    messageChannel :"0001",
                    reciever : "group",
                    sender : "alfredobialo",
                    senderInfo: {
                        displayName: "Alfred Obialo",
                        id: "alfredobialo",
                        onlineStatus: "Online"
                    }
                },
                {
                    message: "When last did the doctor check on them, please review discharge schedule again for proper " +
                        "documentation",
                    channel : "0001",
                    facilityId : "facility-a",
                    messageStatus : "Sent",
                    dateCreated : new Date(),
                    messageChannel :"0001",
                    reciever : "group",
                    sender : "olivia",
                    senderInfo: {
                        displayName: "Olivia Obialo",
                        id: "olivia",
                        onlineStatus: "Online"
                    }
                }
            ]
        }
        return res;
    }

    async sendMessage(message: IMessage) {
        //return this.http.post(`${this.baseUrl}${MESSAGE_ENDPOINT}`, {message: message})
        return {success : true, 
                message : "Message Sent",
                data  : message
        }
    }

    /*
      Proposed functionalities: 
    Create and initlize a new channel (Group) where conversation can occur 
    
    */
    createChannel(channelDetails: IMessageChannel) {
        //Todo :  Code to create a channel goes here
    }

    addUsersToChannel(channelInfo: IMessageChannel, contacts: IMessenger[]) {
        // TODO  :  Add users to the specified channel
    }

    getChannel(channelId: string) {
        //TODO  :  get a channel from the appropritate endpoint

    }
    getChannelOfflineMessageCount(channelId : string)
    {
        if(channelId === "0001")
        {
            return 2;
        }
        else if(channelId === "0002")
        {
            return 4;
        }
        else if(channelId === "00011")
        {
            return 1;
        }
        return 0;
    }
    getChannels(criteria: any) {
        
        const  channels   =  this.joinFacilityChannel.findAll();
        console.log(channels);
        const clinicalChannels: IMessageChannel[] = [
            {
                _id: "0001",
                title: "Emergency Surgical Team",
                description: "Call this team for urgent emergency reasons",
                dateCreated: new Date(),
                users: [{
                    displayName: "Alfred Obialo",
                    id: "alfredobialo",
                    onlineStatus: "Online"
                },
                    {
                        displayName: "Olivia Obialo",
                        id: "olivia",
                        onlineStatus: "Offline"
                    },
                    {
                        displayName: "Maryann Somkene",
                        id: "somkene",
                        onlineStatus: "Online"
                    }
                ],
                lastMessage: {
                    message: "The Patient is Sleeping and healthy",
                    channel : "0001",
                    facilityId : "facility-a",
                    messageStatus : "Sent",
                    dateCreated : new Date(),
                    messageChannel :"0001",
                    reciever : "group",
                    sender : "alfredobialo"

                },
                createdBy: {
                    displayName: "Alfred Obialo",
                    id: "alfredobialo",
                    onlineStatus: "Online"
                }
            },
            // Second Channel
            {
                _id: "0002",
                title: "Diabetic Patient Ward",
                description: "Private patient ward that handles special Diabetic cases",
                dateCreated: new Date(),
                users: [{
                    displayName: "Chioma Leneh",
                    id: "chiomalenh",
                    onlineStatus: "Offline"
                }],
                lastMessage: {
                    message: "3 Patients are not responding to treatment : Mr Okafor Ikeh, Jude Alias, and Chioma Chukwuma",
                    channel : "0002",
                    facilityId : "facility-b",
                    messageStatus : "Received",
                    dateCreated : new Date(),
                    messageChannel :"0002",
                    reciever : "group",
                    sender : "chioma"

                },
                createdBy: {
                    displayName: "Chioma Leneh",
                    id: "chiomalenh",
                    onlineStatus: "Offline"
                }
            }

        ];
        const nonClinicalChannels: IMessageChannel[] = [
            {
                _id: "00011",
                title: "Radiology",
                description: "Reports from radiology section",
                dateCreated: new Date(),
                users: [{
                    displayName: "John Ekeh",
                    id: "johnekeh",
                    onlineStatus: "Busy"
                }],
                lastMessage: {
                    message: "The X-ray Equipment are malfunctioning, can anyone call engineers in charge?",
                    channel : "00011",
                    facilityId : "facility-d",
                    messageStatus : "Received",
                    dateCreated : new Date(),
                    messageChannel :"00011",
                    reciever : "group",
                    sender : "biodu"

                },
                createdBy: {
                    displayName: "Mathew Okoye",
                    id: "mathew",
                    onlineStatus: "Online"
                }
            }
            
        ];
        ///Todo  this will return all  channels by the specified criteria
        // if criteria is null then we wil return  all  available channels
        return criteria.tag ? (criteria.tag === "clinical" ? clinicalChannels : nonClinicalChannels) : clinicalChannels;
    }
}