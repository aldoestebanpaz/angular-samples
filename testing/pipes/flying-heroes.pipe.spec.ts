import { Hero } from '../models/hero';
import { FlyingHeroesPipe, FlyingHeroesImpurePipe } from './flying-heroes.pipe';

describe('FlyingHeroesPipe', () => {
  it('should return an array with heroes that can fly', () => {
    // arrange
    const pipe = new FlyingHeroesPipe();
    const heroes: Hero[] = [
      { id: 11, name: 'Mr. Nice', strength: 10, canFly: false },
      { id: 12, name: 'Narco', strength: 5, canFly: false },
      { id: 13, name: 'Bombasto', strength: 8, canFly: false },
      { id: 14, name: 'Celeritas', strength: 15, canFly: false },
      { id: 15, name: 'Magneta', strength: 22, canFly: true },
      { id: 16, name: 'RubberMan', strength: 50, canFly: false },
      { id: 17, name: 'Dynama', strength: 43, canFly: false },
      { id: 18, name: 'Dr. IQ', strength: 4, canFly: true },
      { id: 19, name: 'Magma', strength: 18, canFly: false },
      { id: 20, name: 'Tornado', strength: 15, canFly: true }
    ];
    const expectedOutput: Hero[] = [
      { id: 15, name: 'Magneta', strength: 22 , canFly: true },
      { id: 18, name: 'Dr. IQ', strength: 4, canFly: true },
      { id: 20, name: 'Tornado', strength: 15, canFly: true }
    ];

    // act & assert
    expect(pipe.transform(heroes)).toEqual(expectedOutput);
  });
});

// TODO: testing of impure pipe
