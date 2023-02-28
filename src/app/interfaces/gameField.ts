import { BehaviorSubject } from 'rxjs';

export interface ICell {
  x: number;
  y:number;
  status$: BehaviorSubject<CellStatus>;
  setStatus(status: CellStatus):void;
  getX(): number;
  getY(): number;
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

  public getX(): number{
    return this.x;
  }

  public getY(): number{
    return this.y;
  }

}
