import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ImageEmitterService} from '../../services/facility-manager/image-emitter.service';

@Component({
    selector: 'app-image-viewer',
    templateUrl: './image-viewer.component.html',
    styleUrls: ['./image-viewer.component.scss'],
    //changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageViewerComponent implements OnInit {
    constructor(private logoService: ImageEmitterService) {
    }

    ngOnInit() {
    }

}
