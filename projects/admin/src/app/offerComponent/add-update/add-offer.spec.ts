import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOffer } from './add-offer';

describe('AddOffer', () => {
  let component: AddOffer;
  let fixture: ComponentFixture<AddOffer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOffer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOffer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
