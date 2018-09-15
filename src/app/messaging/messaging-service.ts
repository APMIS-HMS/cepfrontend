import { Injectable } from '@angular/core';
import  {Http} from "@angular/http";
import  {API_LOCALHOST, API_DEV , API_LIVE} from "../shared-module/helpers/global-config";
import {IMessage, IMessageChannel, IMessenger} from "./messaging-model";
const  HOST  =  API_LOCALHOST;
const MESSAGE_ENDPOINT  = "/messages", CHANNEL_ENDPOINT = "/channels", COMMUNICATION_ENDPOINT = "/communication";


@Injectable()
export class MessagingService {
 private baseUrl : string  = `${HOST}`;
 constructor(private http : Http) { }
 
 /*
 *  We assume that the Deafult HttpInterceptor will attach the bearer token for every request
 *  ---- SOCKET Calls not implemented yet
 *  
 * */
  // get message call :  returns all messages / conversation for the given channel-id (for a group or a one-to-one private conversation) 
 //expect to return an observable of ApiResonse object that will include a messages payload in the data property
 // and also an pagination object, statuses for the call etc
  getMessages(criteria : any)
  {
     let result =  this.http.get(`${this.baseUrl}${MESSAGE_ENDPOINT}`,{params : criteria} );
     return result;
  }
  sendMessage (message : IMessage )
  {
      return this.http.post(`${this.baseUrl}${MESSAGE_ENDPOINT}` , {message:message})
  }
  
  /*
    Proposed functionalities: 
  Create and initlize a new channel (Group) where conversation can occur 
  
  */
  createChannel (channelDetails : IMessageChannel)
  {
      //Todo :  Code to create a channel goes here
  }
  addUsersToChannel( channelInfo : IMessageChannel, contacts : IMessenger[] )
  {
      // TODO  :  Add users to the specified channel
  }
  
  getChannel (channelId : string)
  {
      //TODO  :  get a channel from the appropritate endpoint
      
  }
  getChannels (criteria : any )
  {
      ///Todo  this will return all  channels by the specified criteria
      // if criteria is null then we wil return  all  available channels
  }
}