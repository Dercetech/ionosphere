import {
  Directive, Host, Input, OnDestroy, Optional, Renderer2, Self, ViewContainerRef
} from '@angular/core';
import {Content, ScrollEvent} from 'ionic-angular';

@Directive({
  selector: '[headerShadowAfterScroll]'
})
export class HeaderShadowAfterScroll implements OnDestroy
{

  @Input('headerShadowAfterScroll') offsetHeight: number;

  private headerNativeElement: any = null;
  private ionScrollSubscription:any = null;
  private hidden: boolean = false;

  constructor(private _view: ViewContainerRef,
              private _renderer: Renderer2,
              @Host() @Self() @Optional() public scrollableContentToWatch: Content) { }

  ngAfterViewInit() {
    const nativeElement = this._view.element.nativeElement;
    let potentialHeaders = nativeElement.parentElement.getElementsByClassName('toggle-shadow');
    if(!potentialHeaders) potentialHeaders = nativeElement.parentElement.parentElement.getElementsByClassName('toggle-shadow');

    if(potentialHeaders && (potentialHeaders.length > 0)){
      this.headerNativeElement = potentialHeaders[0];
      this.setHideShadowClass();
      this.scrollableContentToWatch.ionScroll.subscribe( (event: ScrollEvent) => this.onScroll(event) );
    }
  }

  ngOnDestroy() {
    console.log('destroying...');
    this.ionScrollSubscription && this.ionScrollSubscription.unsubscribe();
  }

  private setHideShadowClass(): void {
    this.hidden = true;
    this.headerNativeElement && this._renderer.addClass(this.headerNativeElement, 'no-shadow');
  }

  private unsetHideShadowClass(): void {
    this.hidden = false;
    this.headerNativeElement && this._renderer.removeClass(this.headerNativeElement, 'no-shadow');
  }

  private onScroll(event: ScrollEvent): void {

    const offsetHeight = this.offsetHeight ? this.offsetHeight : 30;

    if(!this.headerNativeElement){
      return console.warn('missing header for shadow hiding');
    }

    if(this.hidden && event.scrollTop >= offsetHeight && event.deltaY > 0){
      this.unsetHideShadowClass();
    }

    if(!this.hidden && event.scrollTop < offsetHeight && event.deltaY < 0){
      this.setHideShadowClass();
    }
  }

}
