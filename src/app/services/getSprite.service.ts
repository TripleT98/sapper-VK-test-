import { Injectable } from '@angular/core';
import { CellStatus, Cell, State } from '@interfaces/cell';
import { SmileStatus } from '@interfaces/smile';

const smileChildren: ChildrenType<SmileStatus>[] = [
  {status: SmileStatus.onGame},
  {status: SmileStatus.onGameDown},
  {status: SmileStatus.onLMKDown},
  {status: SmileStatus.win},
  {status: SmileStatus.gameOver}
]

const cellsChildren: ChildrenType<CellStatus, State>[] = [
  {state: State.closed,status: CellStatus.closed},
  {state: State.opened,status: CellStatus.clear},
  {state: State.marked,status: CellStatus.flag},
  {state: State.marked,status: CellStatus.mayBe},
  {state: State.opened,status: CellStatus.mayBe},
  {state: State.opened,status: CellStatus.bombMarked},
  {state: State.opened,status: CellStatus.bombBlast},
  {state: State.opened,status: CellStatus.bombMarkedWrong},
]

@Injectable({
  providedIn: 'root'
})
export class GetSpriteService {

  readonly spriteBlosks: Record<SpriteType, SpriteBlockWithouChildren> = {} as unknown as any;
  readonly spriteBlosksWithChildren: Record<SpriteType, SpriteBlock<CellStatus | SmileStatus, State | undefined>> = {} as unknown as any;

  constructor(){
    this.spriteBlosks[SpriteType.numbers] = new SpriteBlockWithouChildren(13,23,[0,0]) as any;
    this.spriteBlosks[SpriteType.numberCells] = new SpriteBlockWithouChildren(16,16,[0,68]);
    this.spriteBlosksWithChildren[SpriteType.smiles] = new SpriteBlock<SmileStatus>(26,26,[0,24],smileChildren);
    this.spriteBlosksWithChildren[SpriteType.cells] = new SpriteBlock<CellStatus, State>(16,16,[0,51],cellsChildren) as any;
  }

}

export class SpriteBlockWithouChildren {

  protected spaceBetweenSprites: number = 1;
  protected width: number;
  protected height: number;
  protected start: [number,number];

  constructor(width:number, height: number, start: [number, number]){
    this.width = width;
    this.height = height;
    this.start = start;
  }

  public getBackPositionByIndex(index: number){
    const spritePositionX: number = this.spaceBetweenSprites * index + this.width * index + this.start[0];
    const spritePositionY: number = this.start[1];
    return {backgroundPosition: `-${spritePositionX}px -${spritePositionY}px`, height:this.height + 'px', width: this.width + 'px'}
  }

}

export class SpriteBlock<T,D = undefined> extends SpriteBlockWithouChildren  implements ISpriteBlock<T,D>{


  private children: ChildrenType<T,D>[];

  constructor(width:number, height: number, start: [number, number], children: ChildrenType<T, D>[]){
    super(width,height,start);
    this.children = children;
  }

  public getSprite(status: T, state?: D): {backgroundPosition: string, height: string, width: string}{
    let index: number = 0;
    const child = this.children.find((ch,i)=>{
      index = i;
      return ch.status === status && ch?.state === state;
    });
    return this.getBackPositionByIndex(index);
  }

}



export interface ISpriteBlock<T,D = undefined> {
  getSprite(status: T, state?: D): {backgroundPosition: string};
}

export type ChildrenType<T, D = undefined> = {
  status: T;
  state?: D;
}

export enum SpriteType {
  numberCells = 'numberCells',
  numbers = 'numbers',
  smiles = 'smiles',
  cells = 'cells',
}
