import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from "@angular/core/testing";
import { Location } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import { HeroService } from "src/app/services/hero.service";
import { HeroDetailComponent } from "./hero-detail.component";
import { FormsModule } from "@angular/forms";
import { of } from "rxjs";
import { Hero } from "src/app/models/hero";

describe('HeroDetailComponent', () => {
  const mockActivatedRoute = {
    // mock for sentence: Number(this.route.snapshot.paramMap.get('id'))
    snapshot: {
      paramMap: { get: () => { return 4; } }
    }
  };
  const mockHeroService = jasmine.createSpyObj(['getHero', 'updateHero']);
  const mockLocation = jasmine.createSpyObj(['back']);
  let fixture: ComponentFixture<HeroDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ HeroDetailComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: HeroService, useValue: mockHeroService },
        { provide: Location, useValue: mockLocation },
      ]
    });
    fixture = TestBed.createComponent(HeroDetailComponent);
  });

  it('should render the hero name in a h2 tag', () => {
    //arrange
    const hero: Hero = { id: 1, name: 'superyo', strength: 1, canFly: true };
    mockHeroService.getHero.and.returnValue(of(hero));

    // act - render the template
    fixture.detectChanges();

    // assert
    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('SUPERYO');
  });

  // created just for demo of Async call testing
  it('should call updateHero when saveAsync1 is called (testing asyncs, method 1)', (done) => {
    // arrange
    mockHeroService.updateHero.and.returnValue(of({}));

    // act
    fixture.componentInstance.saveAsync1();

    // assert
    setTimeout(() => {
      expect(mockHeroService.updateHero).toHaveBeenCalled();
      done(); // let Jasmine know when the test is finalized
    }, 300);
  });

  // created just for demo of Async call testing
  it('should call updateHero when saveAsync1 is called (testing asyncs, method 2)',
    fakeAsync(() => { // using fakeAsync timers are synchronous
      // arrange
      mockHeroService.updateHero.and.returnValue(of({}));

      // act
      fixture.componentInstance.saveAsync1();
      tick(250); // simulate the asynchronous passage of time, 250ms in this case

      // assert
      expect(mockHeroService.updateHero).toHaveBeenCalled();
    })
  );

  // created just for demo of Async call testing
  it('should call updateHero when saveAsync1 is called (testing asyncs, method 3)',
    fakeAsync(() => { // using fakeAsync timers are synchronous
      // arrange
      mockHeroService.updateHero.and.returnValue(of({}));

      // act
      fixture.componentInstance.saveAsync1();
      // flush any pending microtasks
      // and simulates the asynchronous passage of time for the timers in the fakeAsync zone
      // by draining the macrotask queue until it is empty.
      flush();

      // assert
      expect(mockHeroService.updateHero).toHaveBeenCalled();
    })
  );

  // created just for demo of Async call testing
  it('should call updateHero when saveAsync2 is called (testing asyncs, method 3)',
    fakeAsync(() => { // using fakeAsync timers are synchronous
      // arrange
      mockHeroService.updateHero.and.returnValue(of({}));

      // act
      fixture.componentInstance.saveAsync2();
      // flush any pending microtasks
      // and simulates the asynchronous passage of time for the timers in the fakeAsync zone
      // by draining the macrotask queue until it is empty.
      flush();

      // assert
      expect(mockHeroService.updateHero).toHaveBeenCalled();
    })
  );

  // created just for demo of Async call testing
  it('should call updateHero when saveAsync2 is called (testing asyncs, method 4)',
    waitForAsync(() => { // using fakeAsync timers are synchronous
      // arrange
      mockHeroService.updateHero.and.returnValue(of({}));

      // act
      fixture.componentInstance.saveAsync2();

      // assert
      // 'whenStable' returns a promise that resolves when the fixture is stable
      // (that is, it doesn't has async tasks that have not been completed yet)
      fixture.whenStable().then(() => {
        expect(mockHeroService.updateHero).toHaveBeenCalled();
      });
    })
  );
});
