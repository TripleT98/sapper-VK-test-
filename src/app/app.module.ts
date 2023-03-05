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

import { BehaviorSubject } from 'rxjs';

export interface ICell {
  readonly x: number;
  readonly y:number;
  status$: BehaviorSubject<CellStatus>;
  setStatus(status: CellStatus):void;
}

export enum CellStatus {
  closed,
  clear,
  numbered,
  flag,
  mayBe,
  bombMarked,
  bombBlast,
  bombMarkedWrong,
}

export class Cell implements ICell {

  readonly status$ = new BehaviorSubject<CellStatus>(CellStatus['closed']);

  constructor(readonly x:number, readonly y: number){
    this.x = x;
    this.y = y;
  }

  public setStatus(status: CellStatus): void{
    this.status$.next(status);
  }

}
