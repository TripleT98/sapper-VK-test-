import { NgModule } from '@angular/core';
import { GetIconPipe } from './getIconPipe';
import { GetErrorPipe } from './getError.pipe';

@NgModule({
  declarations:[
    GetIconPipe,
    GetErrorPipe
  ],
  exports:[
    GetIconPipe,
    GetErrorPipe
  ]
})
export class PipesModule{

}
