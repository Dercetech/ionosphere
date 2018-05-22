import {NgModule} from "@angular/core";
import {CustomValidators} from "./custom-validators";

@NgModule({
  providers:[
    CustomValidators
  ]
})

export class ValidatorsModule{}
