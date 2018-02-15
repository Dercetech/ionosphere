import {Component} from "@angular/core";
import {NavController} from "ionic-angular";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  activeSegment: string = "processing";

  bots: any[] = [
    {
      name: "MyBot_1",
      status: "processing",
      algo: "generic",
      gap: "2%",
      lease: "1h",
      personality: "neutral"
    },
    {
      name: "Columbus Tracker",
      status: "idle",
      algo: "columbus",
      gap: "5%",
      threshold: "10%",
      personality: "cautious"
    },
    {
      name: "Split oportunist",
      status: "monitoring",
      gap: "0.02%",
      reserve: "33%",
      personality: "reckless"
    }
  ];

  constructor() { }
}
