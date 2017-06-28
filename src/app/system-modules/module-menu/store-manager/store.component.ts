import { Component, OnInit } from '@angular/core';
import { StoreEmitterService } from '../../../services/facility-manager/store-emitter.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  pageInView: string;
  contentSecMenuShow = false;
  constructor(private _storeEventEmitter: StoreEmitterService) { }

  ngOnInit() {
    this._storeEventEmitter.announcedUrl.subscribe(url => {
      this.pageInView = url;
    });
  }

  contentSecMenuToggle() {
    this.contentSecMenuShow = !this.contentSecMenuShow;
  }

  navItemClick(value) {
    this.contentSecMenuShow = false;
  }


  closeActivate(e) {
    if (e.srcElement.id !== 'contentSecMenuToggle') {
      this.contentSecMenuShow = false;
    }
  }

	// pageInViewLoader(title) {
	// 	this.pageInView = title;
	// }
}
