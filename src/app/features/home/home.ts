import {Component, OnInit} from "@angular/core";
import {NavController} from "ionic-angular";
import {Select} from "ngrx-actions";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{

  @Select('menu') display$;

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

  ngOnInit(){
    this.display$.subscribe(data => {
      console.log('data ', data)
      debugger;
    })
  }
}
