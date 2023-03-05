import { Component, OnInit, ViewChild, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SapperGameService } from  '@services/game.service';
import { Cell } from '@interfaces/cell';
import { fromEvent } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-sapper-view',
  templateUrl: './sapper-view.component.html',
  styleUrls: ['./sapper-view.component.scss'],
  providers: [SapperGameService]
})
export class SapperViewComponent implements OnInit, AfterViewInit {

  @ViewChild('button') button: ElementRef;

  readonly score$ = this.gameS.score$;
  readonly time$ = this.gameS.time$;
  readonly matrix$ = this.gameS.getMatrix$();
  private isFirstClick = true;

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
    fromEvent(this.button.nativeElement, 'click').pipe(withLatestFrom(this.form.valueChanges)).subscribe(([_, {width,height}])=>{
      if(typeof height === 'number'){
        this.gameS.setFieldHeight(height);
      }
      if(typeof width === 'number'){
        this.gameS.setFieldWidth(width);
      }
    });
  }

  cellLeftClickHandler(cell: Cell){
    this.gameS.openCell(cell);
  }

  cellRightClickHandler(cell: Cell){
    this.gameS.markCell(cell);
  }

}
