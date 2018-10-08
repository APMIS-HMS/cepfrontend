import { Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ImageEmitterService } from '../../services/facility-manager/image-emitter.service';
import { ISubscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit, OnDestroy {
  @Input() imageSrc: String = <String>'';
  ISubscriber: ISubscription;
  constructor(
    private imageEmitterService: ImageEmitterService
  ) {
    // Assign the subscription to an ISubscription to be able to unsubscribe.
    this.ISubscriber = this.imageEmitterService.subscribeToImageSource.subscribe(value => {
      this.imageSrc = value;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    // Unsubscribe from the observable.
    this.ISubscriber.unsubscribe();
  }
}
