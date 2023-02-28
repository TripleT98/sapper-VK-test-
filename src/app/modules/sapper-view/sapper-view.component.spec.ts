import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SapperViewComponent } from './sapper-view.component';

describe('SapperViewComponent', () => {
  let component: SapperViewComponent;
  let fixture: ComponentFixture<SapperViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SapperViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SapperViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
