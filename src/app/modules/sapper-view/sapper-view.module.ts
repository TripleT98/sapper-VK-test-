import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SapperViewComponent } from './sapper-view.component';
import { PipesModule } from "@pipes/pipes.module";

@NgModule({
  declarations: [
    SapperViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule
  ],
  exports :[
    SapperViewComponent
  ],
})
export class SapperViewModule { }
