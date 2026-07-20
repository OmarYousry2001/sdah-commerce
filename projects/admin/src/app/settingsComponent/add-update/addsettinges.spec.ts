import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addsettinges } from './addsettinges';

describe('Addsettinges', () => {
  let component: Addsettinges;
  let fixture: ComponentFixture<Addsettinges>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Addsettinges]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addsettinges);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
