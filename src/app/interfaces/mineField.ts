import { Cell, CellStatus, State } from './cell';
import { BehaviorSubject, Subject } from 'rxjs';

export interface IField {
  readonly fieldHeight$: BehaviorSubject<number>;
  readonly fieldWidth$: BehaviorSubject<number>;
  readonly matrix$: BehaviorSubject<Cell[][]>;
}

/*export abstract class ACField {
  abstract rebuildMatrix():void;
  abstract buidMatrix(): Cell[][];
  abstract setFieldHeight(height: number): boolean;
  abstract setFieldWidth(width: number): boolean;
}*/

export class Field implements IField{
  readonly fieldHeight$: BehaviorSubject<number> = new BehaviorSubject(16);
  readonly fieldWidth$: BehaviorSubject<number> = new BehaviorSubject(16);
  readonly matrix$: BehaviorSubject<Cell[][]> = new BehaviorSubject(this.buidMatrix());
  readonly bombsAmount$: BehaviorSubject<number> = new BehaviorSubject(0);
  //Коэффициент кол-ва бомб
  readonly bombK: number = 6.4;
  //Выкидывает true, когда обнаруженна бомба
  readonly explode$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  //Выкидывает true, когда победа
  readonly win$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  //Выкидывает значение кол-во бомб - кол-во флагов
  readonly score$: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(
    height?: number,
    width?: number
  ){
    if(height){
      this.fieldHeight$.next(height);
    }
    if(width){
      this.fieldWidth$.next(width);
    }
    this.matrix$.subscribe(()=>{this.scanMatrix();});
    this.matrix$.next(this.buidMatrix());
    this.score$.next(Math.floor((this.fieldHeight$.value * this.fieldWidth$.value)/this.bombK));
  }

  public restartGame(){
    this.explode$.next(false);
    this.win$.next(false);
    this.rebuildMatrix();
  }

  public startGame(initialCell: Cell){
    //Наполняем бомбами
    let matrix = this.fillMatrixWithBombs(initialCell);
    //Наполняетм матрицу ячейками-числами (возле которых находтся бомбы);
    matrix = this.fillMatrixWithNumbers();
    //Перестраиваю матрицу с учетом изменений
    this.rebuildMatrix(matrix);
  }

  public setFieldHeight(height: number): boolean{
    this.fieldHeight$.next(height);
    this.rebuildMatrix();
    this.score$.next(Math.floor((this.fieldHeight$.value * this.fieldWidth$.value)/this.bombK));
    return true;
  }

  public setFieldWidth(width: number): boolean{
    this.fieldWidth$.next(width);
    this.rebuildMatrix();
    this.score$.next(Math.floor((this.fieldHeight$.value * this.fieldWidth$.value)/this.bombK));
    return true;
  }

  public getCell(x:number, y:number): Cell{
    return this.matrix$.value[x][y];
  }

  public setCellStatus(x:number, y:number, status: CellStatus):void{
    const cell: Cell = Object.assign({}, this.getCell(x,y));
    cell.setStatus(status);
    this.changeCellInMatrix(cell);
  }

  private changeCellInMatrix(cell: Cell){
    const matrix = [...this.matrix$.value];
    matrix[cell.x][cell.y] = cell;
    this.rebuildMatrix(matrix);
  }

  private rebuildMatrix(matrix?: Cell[][]): void{
    if(matrix){
      this.matrix$.next(matrix);
      return;
    }
    this.matrix$.next(this.buidMatrix());
  }

  private buidMatrix(): Cell[][]{
    const matrix: Cell[][] = [];
    const width = this.fieldWidth$.value;
    const height = this.fieldHeight$.value;
    for(let i = 0; i < width; i++){
      const row: Cell[] = [];
      for(let j = 0; j < height; j++){
        row.push(new Cell(i,j))
      }
      matrix.push(row);
    }
    return matrix;
  }

  private fillMatrixWithBombs(initialCell: Cell):Cell[][]{
    //initialCell - ячейка, по которой кликнули впервые, она не может быть бомбой
    const {width, height} = this.getMatrixSize();
    //Площадь игрового поля (в клетках)
    const square = width * height;
    const bombsAmount = this.setBombsAmount(Math.floor(square/this.bombK));
    //Мапа в которой временно будут храниться ячейки, которые являются бомбами, формат ключа 'x|y'
    const bombCoords: BombMap = new Map();
    //Наполняю матрицу бомбами со случайными координатами
    for(let i = 0; i < bombsAmount; i++){
      const x = Math.floor(Math.random()*width);
      const y = Math.floor(Math.random()*height);
      const key = `${x}|${y}`;
      //Если в мапе уже есть такие координаты (x|y) то i--, так до тех пор, пока не i < кол-ва бомб
      //Первая ячейка по которой кликнули так-же не может быть бомбой
      if(bombCoords.get(key) || (initialCell.x === x && initialCell.y === y)){
        i--;
        continue;
      }
      bombCoords.set(key, {x,y});
    }
    const newMatrix = [...this.matrix$.value];
    for(let {x,y} of bombCoords.values()){
      const currentCell = newMatrix[x][y];
      currentCell.makeItBomb(true);
    }
    return newMatrix;
  }

  //После заполнения бомбами, матрицу нужно будет заполнить цифрами от 0 до 9, которые будут обозначать кол-во бомб вокруг данной ячейки
  //Если рядом с ячейкой бомб нет, то цифру ей не присваиваю
  private fillMatrixWithNumbers():Cell[][]{
    const matrix = [...this.matrix$.value];
    //Проверяю кадждую ячейку, и узнаю информацию, сколько вокруг нее бомб, использую мапу для записи информации
    const {width, height} = this.getMatrixSize();
    for(let i = 0; i < width; i++){
      for(let j = 0; j < height; j++){
        const currCell = matrix[i][j];
        if(currCell.isBomb){continue};
        const cellsAround = this.getCellsAround(currCell);
        const bombsAround = cellsAround.reduce<number>((acc,e)=>{if(e.isBomb){return acc+1};return acc},0);
        currCell.setBombsAround(bombsAround);
      }
    }
    return matrix;
  }

  private setBombsAmount(bombsAmount: number):number{
    this.bombsAmount$.next(bombsAmount);
    return bombsAmount;
  }

  private getMatrixSize():{width:number, height:number}{
    const matrix = this.matrix$.value;
    return  {width: matrix.length, height: matrix[0].length};
  }

  private getCellsAround(cell: Cell): Cell[]{
    const matrix = this.matrix$.value;
    const {x,y} = cell;
    const {width, height} = this.getMatrixSize();
    //Иксы и игрики ячеек, которые могут быть вокруг
    const xs = [x - 1, x, x + 1].filter(e=> e >= 0 && e < width);
    const ys = [y - 1, y, y + 1].filter(e=> e >= 0 && e < height);
    const cellsAround: Cell[] = [];
    xs.forEach(X=>{
      ys.forEach(Y=>{
        cellsAround.push(matrix[X][Y]);
      })
    });
    return cellsAround;
  }

  public openCell(cell: Cell){
    const matrix = this.matrix$.value;
    if(cell.state$.value === State.opened){return;}
    cell.openCell();
    matrix[cell.x][cell.y] = Object.setPrototypeOf({...cell}, Object.getPrototypeOf(cell));
    this.rebuildMatrix(matrix);
    //Если кликнули на ячейку без бомб вокруг, и не являющейся бомбой, то открываем все ячейки вокруг
    if(cell.status$.value !== CellStatus.clear){return}
    //Открываем только ячейки с номерами и пустые
    const cellsAround = this.getCellsAround(cell).filter(curCell=>curCell.status$.value === CellStatus.clear || curCell.status$.value === CellStatus.numbered);
    //Открываем отфильтрованные ячейки
    cellsAround.forEach(currCell=>this.openCell(currCell));
  }

  public markCell(cell: Cell){
    const matrix = this.matrix$.value;
    cell.markCell();
    matrix[cell.x][cell.y] = Object.setPrototypeOf({...cell}, Object.getPrototypeOf(cell));
    this.rebuildMatrix(matrix);
  }

  public scanMatrix(){
    //Сканирую матрицу, что бы найти взорванные бомбы, флажки или выяснить сколько ячеек открыто
    let flagsAmount = 0;
    let openedCellsAmount = 0;
    let isBombOpened = false;
    this.matrix$.value.forEach(row=>{
      row.forEach(cell=>{
        const state = cell.state$.value;
        const status = cell.status$.value;
        if(state === State.opened && status === CellStatus.bombBlast){
          isBombOpened = true;
        }else if(state === State.marked && status === CellStatus.flag){
          flagsAmount++;
          if(cell.isBomb){
            openedCellsAmount++;
          }
        }else if(state === State.opened && (status === CellStatus.clear || status === CellStatus.numbered)){
          openedCellsAmount++;
        }
      })
    })
    this.score$.next(this.bombsAmount$.value - flagsAmount);
    if(isBombOpened){
      this.explode$.next(true);
      return;
    }
    const {width, height} = this.getMatrixSize();
    const cellsAmount = width*height;
    if(openedCellsAmount === cellsAmount){
      this.win$.next(true);
      return;
    }
  }

  public openMatrix(){
    const matrix = this.matrix$.value;

  }
}


type BombMap = Map<string, {x:number, y:number}>;
