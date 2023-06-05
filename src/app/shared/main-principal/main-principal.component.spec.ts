import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPrincipalComponent } from './main-principal.component';

describe('MainPrincipalComponent', () => {
  let component: MainPrincipalComponent;
  let fixture: ComponentFixture<MainPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainPrincipalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
