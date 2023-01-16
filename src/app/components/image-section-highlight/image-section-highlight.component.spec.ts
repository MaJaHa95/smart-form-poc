import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSectionHighlightComponent } from './image-section-highlight.component';

describe('ImageSectionHighlightComponent', () => {
  let component: ImageSectionHighlightComponent;
  let fixture: ComponentFixture<ImageSectionHighlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageSectionHighlightComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageSectionHighlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
