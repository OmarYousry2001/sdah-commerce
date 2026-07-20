import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addcomment } from './addcomment';

describe('Addcomment', () => {
  let component: Addcomment;
  let fixture: ComponentFixture<Addcomment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Addcomment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addcomment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
