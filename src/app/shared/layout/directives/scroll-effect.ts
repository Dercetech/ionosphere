import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  /*SimpleChanges,*/
  OnDestroy
} from '@angular/core';
import { Content } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

export interface ScrollEffectConfig {
  effect: string;
  from: number;
}

// https://medium.com/@gregor.srdic/ionic3-hidding-header-on-footer-on-content-scroll-15ab95b05dc5
@Directive({
  selector: '[scrollEffect]'
})
export class ScrollEffectDirective implements OnDestroy {
  @Input('scrollEffect') config: ScrollEffectConfig;
  @Input('scrollContent') scrollContent: Content;

  private subscriptions: Subscription[] = [];

  constructor(private element: ElementRef, private renderer: Renderer2) {}

  /*
  ngOnChanges is called right after the data-bound properties have been checked and before view and content children are checked if at least one of them has changed. The changes parameter contains the changed properties.
  */
  ngOnChanges(/*changes: SimpleChanges*/) {
    if (this.scrollContent && this.config) {
      this.unsubscribeAndClearSubscriptions();

      let logic;
      switch (this.config.effect) {
        case 'HIDE': {
          logic = ({ startY }) => {
            startY < this.config.from ? this.showMe() : this.hideMe();
          };
          break;
        }

        case 'SHOW': {
          logic = ({ startY }) => {
            startY > this.config.from ? this.showMe() : this.hideMe();
          };
          break;
        }

        default: {
          logic = scrollY => {};
        }
      }

      this.subscriptions.push(this.scrollContent.ionScroll.subscribe(logic));
    }
  }

  ngOnDestroy() {
    this.unsubscribeAndClearSubscriptions();
  }

  private unsubscribeAndClearSubscriptions() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions.length = 0;
  }

  private hideMe() {
    this.renderer.setStyle(this.element.nativeElement, 'display', 'none');
  }

  private showMe() {
    this.renderer.removeStyle(this.element.nativeElement, 'display');
  }
}
