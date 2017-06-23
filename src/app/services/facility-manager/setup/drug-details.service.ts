import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class DrugDetailsService {
    public _socket;
    private _rest;
    constructor(
        private _socketService: SocketService,
        private _restService: RestService
    ) {
        this._rest = _restService.getService('drug-details-api');
        this._socket = _socketService.getService('drug-details-api');
        this._socket.on('created', function (gender) {
        });
    }

    find(query: any) {
        return this._rest.find(query);
    }

    findAll() {
        return this._socket.find();
    }

    get(id: string, query: any) {
        return this._rest.get(id, query);
    }

    create(strength: any) {
        return this._socket.create(strength);
    }

    update(strength: any) {
        return this._socket.update(strength._id, strength);
    }

    remove(id: string, query: any) {
        return this._socket.remove(id, query);
    }

}
