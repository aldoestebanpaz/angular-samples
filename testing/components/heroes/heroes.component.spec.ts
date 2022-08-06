import { Component, Directive, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Hero } from '../../models/hero';
import { HeroService } from '../../services/hero.service';
import { HeroComponent } from '../hero/hero.component';
import { HeroesComponent } from './heroes.component';

// isolated and interaction tests
describe('HeroesComponent', () => {
  let component: HeroesComponent;
  const HEROES: Hero[] = [
    { id: 1, name: 'Mr. Nice', strength: 10, canFly: false },
    { id: 2, name: 'Narco', strength: 5, canFly: false },
    { id: 3, name: 'Bombasto', strength: 8, canFly: false }
  ];
  let mockHeroService: jasmine.SpyObj<HeroService>;

  beforeEach(() => {
    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);
    component = new HeroesComponent(mockHeroService);
  });

  describe('delete()', () => {
    // this is an Isolated test
    it('should remove the indicated hero from the heroes list', () => {
      // arrange
      mockHeroService.deleteHero.and.returnValue(of(HEROES[2]));
      component.heroes = HEROES;

      // act
      component.delete(HEROES[2]);

      // assert
      expect(component.heroes.length).toBe(2);
      expect(component.heroes[0].name).toBe(HEROES[0].name);
      expect(component.heroes[1].name).toBe(HEROES[1].name);
    });

    // This is an Interaction test (an special type of isolated test)
    it('should call deleteHero', () => {
      // arrange
      mockHeroService.deleteHero.and.returnValue(of(HEROES[2]));
      component.heroes = HEROES;

      // act
      component.delete(HEROES[2]);

      // assert
      expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[2]);
    });
  });

  // TODO: test the other methods
});

// integration tests - shallow
describe('HeroesComponent (shallow)', () => {
  const HEROES: Hero[] = [
    { id: 1, name: 'Mr. Nice', strength: 10, canFly: false },
    { id: 2, name: 'Narco', strength: 5, canFly: false },
    { id: 3, name: 'Bombasto', strength: 8, canFly: false }
  ];

  @Component({ selector: 'app-hero', template: '<div></div>' })
  class FakeHeroComponent {
    @Input() hero!: Hero | undefined;
    // @Output not needed here
  }

  let mockHeroService: jasmine.SpyObj<HeroService>;
  let fixture: ComponentFixture<HeroesComponent>;

  beforeEach(() => {
    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);
    TestBed.configureTestingModule({
      declarations: [ HeroesComponent, FakeHeroComponent ],
      providers: [ { provide: HeroService, useValue: mockHeroService } ]
    });
    fixture = TestBed.createComponent(HeroesComponent);
  });

  it('should set heroes correctly from service on initialization', () => {
    // arrange
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    // act - run ngOnInit and render
    fixture.detectChanges()

    // assert
    expect(fixture.componentInstance.heroes.length).toBe(3);
  });

  it('should create one <li> for each hero', () => {
    // arrange
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    // act - run ngOnInit and render
    fixture.detectChanges()

    // assert
    const debugElementsOfLi = fixture.debugElement.queryAll(By.css('li'));
    expect(debugElementsOfLi.length).toBe(3);
  });
});

// integration tests - deep
describe('HeroesComponent (deep)', () => {
  let HEROES: Hero[];
  let mockHeroService: jasmine.SpyObj<HeroService>;
  let fixture: ComponentFixture<HeroesComponent>;

  beforeEach(() => {
    HEROES = [
      { id: 1, name: 'Mr. Nice', strength: 10, canFly: false },
      { id: 2, name: 'Narco', strength: 5, canFly: false },
      { id: 3, name: 'Bombasto', strength: 8, canFly: false }
    ];
    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);
    TestBed.configureTestingModule({
      declarations: [ HeroesComponent, HeroComponent ],
      providers: [ { provide: HeroService, useValue: mockHeroService } ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
    fixture = TestBed.createComponent(HeroesComponent);
  });

  it('should render each hero using the child component HeroComponent', () => {
    // arrange
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    // act - run ngOnInit and render
    fixture.detectChanges()

    // assert
    const debugElementsOfHeroComponent =
      fixture.debugElement.queryAll(By.directive(HeroComponent));
    expect(debugElementsOfHeroComponent.length).toBe(3);
    expect(debugElementsOfHeroComponent[0].componentInstance.hero).toEqual(HEROES[0]);
    expect(debugElementsOfHeroComponent[0].componentInstance.hero.name).toEqual('Mr. Nice');
  });

  // This is a deep integration test where the custom event is triggered from the child component without digging deeper in the elements of the template
  it(`should call 'delete' methhod when 'delete' button is clicked in HeroComponent (the child component) (raising the event in child component)`, () => {
    // arrange
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    spyOn(fixture.componentInstance, 'delete');

    // act - run ngOnInit and render
    fixture.detectChanges()

    // assert
    const debugElementsOfHeroComponent =
      fixture.debugElement.queryAll(By.directive(HeroComponent));
    debugElementsOfHeroComponent[0]
      .triggerEventHandler('delete'); // it raises the event in parentheses "(delete)=" that is found in the template
    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
  });

  // This is a deep integration test where the click event is triggered from the button element of the child component
  it(`should call 'delete' methhod when 'delete' button is clicked in HeroComponent (the child component) (using click event in button element)`, () => {
    // arrange
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    spyOn(fixture.componentInstance, 'delete');

    // act - run ngOnInit and render
    fixture.detectChanges()

    // assert
    const debugElementsOfHeroComponent =
      fixture.debugElement.queryAll(By.directive(HeroComponent));
    const mockClickEvent = { stopPropagation: () => {} };
    debugElementsOfHeroComponent[0].query(By.css('button'))
      .triggerEventHandler('click', mockClickEvent); // it triggers the click event in the button element of the child component
    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
  });

  // This is a deep integration test where the event is raised using the EventEmitter object of the child component
  it(`should call 'delete' methhod when 'delete' button is clicked in HeroComponent (the child component) (using emit)`, () => {
    // arrange
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    spyOn(fixture.componentInstance, 'delete');

    // act - run ngOnInit and render
    fixture.detectChanges()

    // assert
    const debugElementsOfHeroComponent =
      fixture.debugElement.queryAll(By.directive(HeroComponent));
    const childComponent = (<HeroComponent>debugElementsOfHeroComponent[0].componentInstance);
    childComponent.delete.emit(); // 'emit' and 'next' do the same thing, 'emit' sounds better
    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
  });

  it(`should add a new hero to the list when the 'add' button is clicked`, () => {
    // arrange
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    const newHero: Hero = { id: 4, name: 'ella', strength: 10, canFly: false };
    mockHeroService.addHero.and.returnValue(of(newHero));

    // act - run ngOnInit and render
    fixture.detectChanges();
    const nameInputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    nameInputEl.value = newHero.name;
    const addButtonDebugEl = fixture.debugElement.query(By.css('button')); // get the first button, it will return the add button
    addButtonDebugEl.triggerEventHandler('click');
    fixture.detectChanges(); // refresh the bindings (the list of the child component being rendered) of the template

    // assert
    const ulTextContent = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;
    expect(ulTextContent).toContain(newHero.name);
  });
});

// integration tests - deep - example of mocking the 'routerLink' directive
describe('HeroesComponent (deep)', () => {
  const HEROES: Hero[] = [
    { id: 1, name: 'Mr. Nice', strength: 10, canFly: false },
    { id: 2, name: 'Narco', strength: 5, canFly: false },
    { id: 3, name: 'Bombasto', strength: 8, canFly: false }
  ];
  let mockHeroService: jasmine.SpyObj<HeroService>;

  @Directive({
    selector: '[routerLink]', // this directive can be instantiated only when used only as an attribute of an element
    host: { '(click)': 'onClickHandler()' }
  })
  class RouterLinkDirectiveStub {
    @Input('routerLink') link: any; // get the value of the attribute
    navigatedTo: any = null;

    onClickHandler() {
      this.navigatedTo = this.link;
    }
  }

  let fixture: ComponentFixture<HeroesComponent>;

  beforeEach(() => {
    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);
    TestBed.configureTestingModule({
      declarations: [ HeroesComponent, HeroComponent, RouterLinkDirectiveStub ],
      providers: [ { provide: HeroService, useValue: mockHeroService } ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
    fixture = TestBed.createComponent(HeroesComponent);
  });


  it('should bind the correct URL on routeLink directive', () => {
    // arrange
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    // act - run ngOnInit and render
    fixture.detectChanges();
    const debugElementOfHero0 = fixture.debugElement.query(By.directive(HeroComponent));
    const debugElementOfA = debugElementOfHero0.query(By.directive(RouterLinkDirectiveStub));
    debugElementOfA.triggerEventHandler('click');
    // same as: debugElementOfHero0.query(By.css('a')).triggerEventHandler('click');

    // assert
    const routerLinkDirective = debugElementOfA.injector.get(RouterLinkDirectiveStub);
    expect(routerLinkDirective.link).toBe(`/detail/${HEROES[0].id}`);
    expect(routerLinkDirective.navigatedTo).toBe(`/detail/${HEROES[0].id}`);
  });
});