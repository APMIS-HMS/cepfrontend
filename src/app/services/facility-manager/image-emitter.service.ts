import { Injectable } from '@angular/core';

@Injectable()
export class ImageEmitterService {
    src : string = "../../../../../assets/images/logos/default.png"
    setSrc(src : string)
    {
        this.src  =  src;

    }

}