import { Component, OnInit, Input } from '@angular/core';
import { ImageEmitterService } from '../../services/facility-manager/image-emitter.service';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit {
  @Input() imageSrc: String = <String>'';
  constructor(
    private imageEmitterService: ImageEmitterService
  ) {
    this.imageEmitterService.subscribeToImageSource.subscribe(value => {
      console.log('Image source ', value);
      this.imageSrc = value;
    });
  }

  ngOnInit() {
  }

}
