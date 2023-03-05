import { Component, OnInit, ViewChild, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SapperGameService, GameStatus } from  '@services/game.service';
import { Cell, State } from '@interfaces/cell';
import { SmileStatus } from '@interfaces/smile';
import { fromEvent, Observable, merge } from 'rxjs';
import { withLatestFrom, map, mapTo, tap, take, filter } from 'rxjs/operators';

@Component({
  selector: 'app-sapper-view',
  templateUrl: './sapper-view.component.html',
  styleUrls: ['./sapper-view.component.scss'],
  providers: [SapperGameService]
})
export class SapperViewComponent implements OnInit, AfterViewInit {

  @ViewChild('button') button: ElementRef;
  @ViewChild('smile') smile: ElementRef;
  @ViewChild('playground') playground: ElementRef;

  readonly score$ = this.gameS.score$.pipe(map(score=>this.numberToStrArr(score)));
  readonly time$ = this.gameS.time$.pipe(map(time=>this.numberToStrArr(time)));
  readonly matrix$ = this.gameS.getMatrix$();

  private smileMouseDown$: Observable<SmileStatus>;
  private smileMouseLeave$: Observable<SmileStatus>;
  private smileClick$: Observable<SmileStatus>;
  private playgoundDown$: Observable<SmileStatus>;
  private playgoundUp$: Observable<SmileStatus>;

  public smile$: Observable<SmileStatus>;

  private gameStatus$: Observable<SmileStatus> = this.gameS.gameStatus$.pipe(map(gameStatus=>{
    switch (gameStatus){
      case GameStatus.notStarted:
      case GameStatus.onGoing: return SmileStatus.onGame;
      case GameStatus.preRestart: return SmileStatus.onGameDown;
      case GameStatus.lose: return SmileStatus.gameOver;
      case GameStatus.win: return SmileStatus.win;
      default: return SmileStatus.onGame;
    }
  }))
  public form = new FormGroup({
    width: new FormControl(this.matrix$.value?.length || 0),
    height: new FormControl(this.matrix$.value?.[0]?.length || 0),
  })

  constructor(
    private gameS: SapperGameService
  ) {}

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    this.playgoundDown$ = fromEvent(this.playground.nativeElement, 'mousedown').pipe(filter(()=>!this.cantClick()), mapTo(SmileStatus.onLMKDown));
    this.playgoundUp$ = fromEvent(this.playground.nativeElement, 'mouseup').pipe(filter(()=>!this.cantClick()), mapTo(SmileStatus.onGame));
    fromEvent(this.smile.nativeElement, 'click').subscribe(()=>{this.gameS.restartGame()});
    fromEvent(this.button.nativeElement, 'click').pipe(withLatestFrom(this.form.valueChanges)).subscribe(([_, {width,height}])=>{
      if(typeof height === 'number'){
        this.gameS.setFieldHeight(height);
      }
      if(typeof width === 'number'){
        this.gameS.setFieldWidth(width);
      }
    });

    this.smileMouseDown$ = fromEvent(this.smile.nativeElement, 'mousedown').pipe(mapTo(SmileStatus.onGameDown));
    this.smileMouseLeave$ = fromEvent(this.smile.nativeElement, 'mouseleave').pipe(mapTo(SmileStatus.onGame));
    this.smile$ = merge(this.gameStatus$, this.smileMouseDown$, this.smileMouseLeave$, this.playgoundDown$, this.playgoundUp$);
  }

  cellLeftClickHandler(cell: Cell){
    if(this.cantClick()){return};
    this.gameS.openCell(cell);
  }

  cellRightClickHandler(cell: Cell){
    if(this.cantClick()){return};
    this.gameS.markCell(cell);
  }

  cellMouseDown(cell: Cell, event: Event){
    const gameSatus = this.gameS.gameStatus$.value;
    if(cell.state$.value === State.opened || this.cantClick()){
      event.stopImmediatePropagation();
    }
  }

  private cantClick(){
    const gameSatus = this.gameS.gameStatus$.value;
    return gameSatus === GameStatus.win || gameSatus === GameStatus.lose;
  }

  private numberToStrArr(num: number){
    const strArr = String(num).split('').map(s=>Number(s));
    while(strArr.length < 3){
      strArr.unshift(0);
    }
    return strArr;
  }

}
