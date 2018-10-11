import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ImageEmitterService {
    private _AnnounceImageSource = new Subject<string>();
    subscribeToImageSource = this._AnnounceImageSource.asObservable();

    constructor() { }

    setImageUrl(value: string) {
        this._AnnounceImageSource.next(value);
    }

}