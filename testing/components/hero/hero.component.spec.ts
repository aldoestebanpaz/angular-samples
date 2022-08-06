import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { HeroComponent } from "./hero.component";

describe('HeroComponent', () => {
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ HeroComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
    fixture = TestBed.createComponent(HeroComponent);
  });

  it('should render hero name in an anchor tag', () => {
    // arrange
    const component = fixture.componentInstance;
    component.hero = { id: 1, name: 'Spock', strength: 10, canFly: false };

    // act
    fixture.detectChanges();

    // assert (using nativeElement)
    const el = fixture.nativeElement;
    expect(el.querySelector('a').textContent).toContain('Spock');

    // assert (using debugElement)
    const debugElementOfA = fixture.debugElement.query(By.css('a'));
    expect(debugElementOfA.nativeElement.textContent).toContain('Spock');
  });
});