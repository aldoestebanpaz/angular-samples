import { inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { HeroService } from './hero.service';
import { MessageService } from './message.service';

describe('HeroService (integration test of HTTP calls)', () => {
  let mockMessageService: jasmine.SpyObj<MessageService>;

  beforeEach(() => {
    mockMessageService = jasmine.createSpyObj(['add']);
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        HeroService,
        { provide: MessageService, useValue: mockMessageService }
      ]
    });
  });

  it('should make a GET request with the correct URL (using TestBed.inject)', () => {
    // arrange
    const httpTestingController = TestBed.inject(HttpTestingController);
    const heroService = TestBed.inject(HeroService);

    // act
    heroService.getHero(4).subscribe(); // call 'subscribe' to trigger the http request

    // assert
    const req = httpTestingController.expectOne('api/heroes/4'); // check the request to the URL was done
    expect(req.request.method).toEqual('GET'); // check it was a GET
    httpTestingController.verify(); // check no more requests were done
  });

  it(
    'should make a GET request with the correct URL  (using the inject helper)',
    inject(
      [HttpTestingController, HeroService],
      (httpTestingController: HttpTestingController, heroService: HeroService) => {
        // act
        heroService.getHero(4).subscribe(); // call 'subscribe' to trigger the http request

        // assert
        const req = httpTestingController.expectOne('api/heroes/4'); // check the request to the URL was done
        req.flush({ id: 1, name: 'ella', strength: 10, canFly: false });
        expect(req.request.method).toEqual('GET'); // check it was a GET
        httpTestingController.verify(); // check no more requests were done
      }
    )
  );
});
