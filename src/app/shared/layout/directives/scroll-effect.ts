import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  /*SimpleChanges,*/
  OnDestroy,
  QueryList
} from '@angular/core';
import { Content } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

export interface ScrollEffectConfig {
  effect: string;
  from?: number;
}

// https://medium.com/@gregor.srdic/ionic3-hidding-header-on-footer-on-content-scroll-15ab95b05dc5
@Directive({
  selector: '[scrollEffect]'
})
export class ScrollEffectDirective implements OnDestroy {
  @Input('scrollEffect') config: ScrollEffectConfig;
  @Input('scrollContent') scrollContent: Content;
  @Input('siblingComponent') siblingComponent: ElementRef;
  @Input('siblingQuery') siblingQuery: QueryList<ElementRef>;

  private subscriptions: Subscription[] = [];

  constructor(private element: ElementRef, private renderer: Renderer2) {}

  /*
  ngOnChanges is called right after the data-bound properties have been checked and before view and content children are checked if at least one of them has changed. The changes parameter contains the changed properties.
  */
  // ngOnChanges(/*changes: SimpleChanges*/) {
  ngAfterViewInit() {
    if (!this.siblingComponent) {
      console.log('cunt crap pee');
    }

    if (this.scrollContent && this.config) {
      this.unsubscribeAndClearSubscriptions();

      let logic;
      switch (this.config.effect) {
        // Don't use for now
        case 'HIDE': {
          logic = ({ scrollTop }) => {
            scrollTop < this.config.from ? this.showMe() : this.hideMe();
          };
          logic({ scrollTop: 0 });
          break;
        }

        case 'FADE-SHOW': {
          logic = ({ scrollTop }) => {
            const siblings =
              this.siblingQuery &&
              this.siblingQuery.toArray &&
              this.siblingQuery.toArray();
            const sibling =
              siblings && siblings[0] && siblings[0].nativeElement;
            if (sibling) {
              //scrollTop > this.config.from ? this.showMe() : this.hideMe();
              sibling.getBoundingClientRect().bottom < 10
                ? this.showMe()
                : this.hideMe();
            }
          };

          // Start hidden (applied before transition property is set)
          this.hideMe();

          // Apply some styling
          this.renderer.setStyle(
            this.element.nativeElement,
            'transition',
            'margin 1s'
          );
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
    //this.renderer.removeStyle(this.element.nativeElement, 'display');
    this.renderer.removeStyle(this.element.nativeElement, 'margin-top');
  }

  private unsubscribeAndClearSubscriptions() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions.length = 0;
  }

  private hideMe() {
    //this.renderer.setStyle(this.element.nativeElement, 'display', 'none');
    this.renderer.setStyle(this.element.nativeElement, 'margin-top', '-100%');
  }

  private showMe() {
    //this.renderer.removeStyle(this.element.nativeElement, 'display');
    this.renderer.setStyle(this.element.nativeElement, 'margin-top', '0%');
  }
}
