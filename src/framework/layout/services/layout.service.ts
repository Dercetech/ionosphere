import {Inject, OnDestroy} from "@angular/core";
import {Platform} from "ionic-angular";

import {Subscription} from "rxjs/Subscription";

export class LayoutService implements OnDestroy {

  private _app: boolean = true;

  private subscriptions: Subscription[] = [];

  constructor(@Inject(Platform) private _platform: Platform){

  }

  ngOnDestroy(){
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onWidthSet(width:number):void{
    //this._width$.next(width);
  }

}
