import { BehaviorSubject, Subject } from 'rxjs';

export interface ICell {
  x: number;
  y: number;
  isBomb: boolean;
  bombsAround: number;
  status$: BehaviorSubject<CellStatus>;
  state$: BehaviorSubject<State>;
  setStatus(status: CellStatus):void;
  setState(state: State):void;
  makeItBomb(isBomb:boolean):void;
  setBombsAround(bombsAmount: number):void;
  openCell():void;
  getX():number;
  getY():number;
}

export enum CellStatus {
  closed,//зарыта
  clear,//открытая и без бомб вокруг
  numbered,//с бомбами вокруг (числовая ячейка)
  flag,// влажок на ячейке
  mayBe,//Вопрос на ячейке
  bombMarked,//неразминированная бомба. Отображается после окончания игры (проигрыш)
  bombBlast,//взорванная бомба
  bombMarkedWrong,//бомба замаркированная неправильно. Иконка отображается после завершения игры (проигрыш)
}

export enum State {
  closed,
  opened,
  marked,
}

export class Cell implements ICell {

  readonly status$ = new BehaviorSubject<CellStatus>(CellStatus.closed);
  readonly state$ = new BehaviorSubject<State>(State.closed);
  private bombMakeCounter = 0;
  isBomb = false;
  private setBombsAroundCounter = 0;
  bombsAround: number = 0;
  explodeObserver$ = new Subject<Cell>();

  constructor(readonly x:number, readonly y: number){
    this.x = x;
    this.y = y;
  }

  public setStatus(status: CellStatus): void{
    this.status$.next(status);
  }

  public setState(state: State): void{
    this.state$.next(state);
  }

  public getX(): number{
    return this.x;
  }

  public getY(): number{
    return this.y;
  }

  public makeItBomb(isBomb: boolean){
    if(this.bombMakeCounter > 0){
      console.log("Если клетка стала бомбой, то все!")
      return;
    }
    this.bombMakeCounter++;
    this.isBomb = isBomb;
  }

  public setBombsAround(bombsAmount: number){
    if(this.setBombsAroundCounter > 0){
      console.log('Кол-во бомб устанавливается только 1 раз');
      return;
    }
    if(this.isBomb){
      console.log('Для ячейки-бомбы эта информация бесполезна');
      return;
    }
    this.setBombsAroundCounter++;
    this.bombsAround = bombsAmount;
    if(bombsAmount > 0){
      this.setStatus(CellStatus.numbered)
    }else{
      this.setStatus(CellStatus.clear);
    }
  }

  //Взорвать бомбу
  private explode(){
    if(!this.isBomb){console.log('Этоя чейка - не бомба!');return}
    this.setStatus(CellStatus.bombBlast);
    this.explodeObserver$.next(this);
  }

  //Открываю ячейку (улик ЛКМ), ячейка может быть или бомбой(при открытии взрывается) или числом (ячейка возле бомбы) или путстотой (ячейа буз бомб вокруг)
  //Если ячейка промаркированна (флаг или вопрос), то ее нельзя отркрыть, повторно открывать так-же нельзя
  public openCell(){
    if(this.state$.value !== State.closed){console.log("Нельзя открыть");return}
    this.setState(State.opened);
    if(this.isBomb){
      this.explode();
    }else if(this.bombsAround){
      this.setStatus(CellStatus.numbered)
    }else{
      this.setStatus(CellStatus.clear)
    }
  }

  //Маркировать (кликнуть ПКМ)
  //Если ячейка открыта, то ее нельзя марировать
  public markCell(){
    const state = this.state$.value;
    const status = this.status$.value;
    if(state === State.opened){console.log("Нельзя промаркировать");return}
    if(state === State.closed){
      this.setState(State.marked);
      this.setStatus(CellStatus.flag);
    }else if(state === State.marked && status === CellStatus.flag){
      this.setStatus(CellStatus.mayBe);
    }else{
      this.setStatus(CellStatus.closed);
      this.setState(State.closed);
    }
  }

}
