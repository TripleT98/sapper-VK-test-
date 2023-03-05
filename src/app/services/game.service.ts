import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Field } from '@interfaces/mineField';
import { Cell, CellStatus } from '@interfaces/cell';

@Injectable()
export class SapperGameService{

  readonly score$ = new BehaviorSubject<number>(0);
  readonly time$ = new BehaviorSubject<number>(0);
  private gameField = new Field();
  private isGameStarted: boolean = false;

  constructor(){}

  public setTime(time: number): boolean{
    this.time$.next(time)
    return true;
  }

  public setScore(score: number): boolean{
    this.score$.next(score);
    return true;
  }

  public getMatrix$():BehaviorSubject<Cell[][]>{
    return this.gameField.matrix$
  }

  public setFieldWidth(width:number){
    this.gameField.setFieldWidth(width);
  }

  public setFieldHeight(height:number){
    this.gameField.setFieldHeight(height);
  }

  public setCellStatus(x:number, y:number, status: CellStatus){
    this.gameField.setCellStatus(x,y,status);
  }

  private startGame(initialCell:Cell){
    this.isGameStarted = true;
    this.gameField.startGame(initialCell);
  }

  public openCell(cell: Cell){
    if(!this.isGameStarted){
      this.startGame(cell);
    }
    this.gameField.openCell(cell);
  }

  public markCell(cell: Cell){
    if(!this.isGameStarted){
      this.startGame(cell);
    }
    this.gameField.markCell(cell);
  }

}
