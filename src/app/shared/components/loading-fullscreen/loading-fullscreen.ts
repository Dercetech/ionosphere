import {
  Component,
  trigger,
  state,
  style,
  transition,
  animate,
  HostBinding
} from '@angular/core';

const stateEnteringDom = { opacity: 0 };
const stateInDOM = { opacity: 1 };
const stateLeavingDom = { opacity: 0 };

@Component({
  selector: 'loading-fullscreen',
  templateUrl: 'loading-fullscreen.html',
  animations: [
    trigger('coverTrigger', [
      state('in', style(stateInDOM)),
      transition('void => *', [style(stateEnteringDom)]),
      transition('* => void', [animate(200, style(stateLeavingDom))])
    ])
  ]
})
export class LoadingFullscreenComponent {
  @HostBinding('@coverTrigger') coverTrigger = 'in';
}
