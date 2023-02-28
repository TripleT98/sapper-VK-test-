import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SapperViewModule } from './modules/sapper-view/sapper-view.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SapperViewModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
