import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Field } from '@interfaces/mineField';
import { Cell, CellStatus } from '@interfaces/cell';
import { filter } from 'rxjs/operators';


@Injectable()
export class SapperGameService{

  private timer: any;
  readonly time$ = new BehaviorSubject<number>(0);
  private gameField = new Field();
  private isGameStarted: boolean = false;
  readonly gameStatus$ = new BehaviorSubject<GameStatus>(GameStatus.notStarted);
  readonly score$ = this.gameField.score$;

  constructor(){
    this.gameField.explode$.pipe(filter(isExplode=>isExplode)).subscribe(()=>{this.gameStatus$.next(GameStatus.lose);this.clearTimer()});
    this.gameField.win$.pipe(filter(isWin=>isWin)).subscribe(()=>{this.gameStatus$.next(GameStatus.win);this.clearTimer()});
    this.gameStatus$.pipe(filter(status=>status === GameStatus.notStarted)).subscribe(()=>{this.time$.next(0)});
  }

  private setTime(): boolean{
    this.timer = setInterval(()=>{this.time$.next(this.time$.value+1)},1000)
    return true;
  }

  private clearTimer(){
    clearInterval(this.timer);
  }
  /*public setScore(score: number): boolean{
    this.score$.next(score);
    return true;
  }*/

  public getMatrix$():BehaviorSubject<Cell[][]>{
    return this.gameField.matrix$
  }

  public setFieldWidth(width:number){
    this.clearTimer();
    this.isGameStarted = false;
    this.gameField.setFieldWidth(width);
    this.gameStatus$.next(GameStatus.notStarted);
  }

  public setFieldHeight(height:number){
    this.clearTimer();
    this.isGameStarted = false;
    this.gameField.setFieldHeight(height);
    this.gameStatus$.next(GameStatus.notStarted);
  }

  public setCellStatus(x:number, y:number, status: CellStatus){
    this.gameField.setCellStatus(x,y,status);
  }

  private startGame(initialCell:Cell){
    this.isGameStarted = true;
    this.gameField.startGame(initialCell);
    this.gameStatus$.next(GameStatus.onGoing);
    this.setTime();
  }

  public openCell(cell: Cell){
    if(!this.isGameStarted){
      this.startGame(cell);
    }
    this.gameField.openCell(cell);
    //this.gameField.scanMatrix();
  }

  public markCell(cell: Cell){
    if(!this.isGameStarted){
      this.startGame(cell);
    }
    this.gameField.markCell(cell);
    //this.gameField.scanMatrix();
  }

  public restartGame(){
    this.isGameStarted = false;
    this.gameField.restartGame();
    this.gameStatus$.next(GameStatus.notStarted);
    this.clearTimer();
  }

  public gameOver(status: GameStatus.win | GameStatus.lose){
    this.isGameStarted = false;
    if(status === GameStatus.win){
      this.gameStatus$.next(GameStatus.win);
    }else{
      this.gameStatus$.next(GameStatus.lose);
    }
  }

}

export enum GameStatus {
  notStarted,
  //Сугубо для изменения иконки смайла
  preRestart,
  onGoing,
  win,
  lose,
}
