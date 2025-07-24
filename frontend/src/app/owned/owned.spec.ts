import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Owned } from './owned';

describe('Owned', () => {
  let component: Owned;
  let fixture: ComponentFixture<Owned>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Owned]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Owned);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
