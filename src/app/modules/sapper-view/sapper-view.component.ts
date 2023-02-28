import { Component, OnInit } from '@angular/core';
import { SapperGameService } from  '@services/game.service';

@Component({
  selector: 'app-sapper-view',
  templateUrl: './sapper-view.component.html',
  styleUrls: ['./sapper-view.component.scss'],
  providers: [SapperGameService]
})
export class SapperViewComponent implements OnInit {

  readonly score$ = this.gameS.score$;
  readonly time$ = this.gameS.time$;
  readonly fieldHeight$ = this.gameS.fieldHeight$;
  readonly fieldWidth$ = this.gameS.fieldWidth$;

  constructor(
    private gameS: SapperGameService
  ) { }

  ngOnInit(): void {
  }

}
