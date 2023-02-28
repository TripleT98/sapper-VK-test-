import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SapperViewComponent } from './sapper-view.component';



@NgModule({
  declarations: [
    SapperViewComponent
  ],
  imports: [
    CommonModule
  ],
  exports :[
    SapperViewComponent
  ],
})
export class SapperViewModule { }
