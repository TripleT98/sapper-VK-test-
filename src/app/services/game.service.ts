import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SapperGameService{

  readonly score$ = new BehaviorSubject<number>(0);
  readonly time$ = new BehaviorSubject<number>(0);
  readonly fieldHeight$ = new BehaviorSubject<number>(0);
  readonly fieldWidth$ = new BehaviorSubject<number>(0);
  //readonly fieldModel$ = new BehaviorSubject<>

  public setTime(time: number): boolean{
    this.time$.next(time)
    return true;
  }

  public setScore(score: number): boolean{
    this.score$.next(score);
    return true;
  }

  public setFieldHeight(height: number): boolean{
    this.fieldHeight$.next(height);
    return true;
  }

  public setFieldWidth(width: number): boolean{
    this.fieldWidth$.next(width);
    return true;
  }

  public setFieldSize(size: [number, number]): boolean{
    const [height, width] = size;
    this.setFieldHeight(height);
    this.setFieldWidth(width);
    return true;
  }

}
