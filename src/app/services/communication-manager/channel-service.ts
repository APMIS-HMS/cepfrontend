import { Injectable } from '@angular/core';
import { Channels, ChannelNames } from '../../models/channels/channels';

@Injectable()
export class ChannelService {
private currentUserChannel;

  constructor() { }
public getCurrentUserChannel() {
  return this.currentUserChannel;
}

public setCurrentUserChannel(data) {
  const dataToJson = JSON.parse(data);
  console.log(`setting current user channels ${dataToJson}`);

  return this.currentUserChannel = dataToJson;
}
}
