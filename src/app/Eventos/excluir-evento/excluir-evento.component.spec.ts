import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcluirEventoComponent } from './excluir-evento.component';

describe('ExcluirEventoComponent', () => {
  let component: ExcluirEventoComponent;
  let fixture: ComponentFixture<ExcluirEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcluirEventoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExcluirEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
