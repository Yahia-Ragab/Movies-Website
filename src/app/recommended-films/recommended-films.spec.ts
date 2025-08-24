import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedFilms } from './recommended-films';

describe('RecommendedFilms', () => {
  let component: RecommendedFilms;
  let fixture: ComponentFixture<RecommendedFilms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendedFilms]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendedFilms);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
