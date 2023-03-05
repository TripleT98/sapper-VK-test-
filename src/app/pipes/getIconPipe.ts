import { Pipe, PipeTransform } from '@angular/core';
import { CellStatus, Cell, State } from '@interfaces/cell';
import { SmileStatus } from '@interfaces/smile';
import { SpriteType, GetSpriteService, SpriteBlock, SpriteBlockWithouChildren} from '@services/getSprite.service';

@Pipe({
  name: 'getIcon'
})
export class GetIconPipe implements PipeTransform {

  constructor(
    private spriteS: GetSpriteService
  ){}

  transform(cell:Cell){
    const status = cell.status$.value;
    const state = cell.state$.value;
    const {isBomb, bombsAround} = cell;
    let styles = {};
    if(state === State.closed || state === State.marked){
      styles = this.spriteS.spriteBlosksWithChildren[SpriteType.cells].getSprite(status, state);
    }else if(state === State.opened && !isBomb && !bombsAround){
      styles = this.spriteS.spriteBlosksWithChildren[SpriteType.cells].getSprite(status, state);
    }else if(state === State.opened && isBomb){
      styles = this.spriteS.spriteBlosksWithChildren[SpriteType.cells].getSprite(status, state);
    }else if(state === State.opened && !isBomb && bombsAround){
      //для смещения индекса передаем bombsAmount - 1
      styles = this.spriteS.spriteBlosks[SpriteType.numberCells].getBackPositionByIndex(bombsAround-1);
    }
    return styles;
  }

}
