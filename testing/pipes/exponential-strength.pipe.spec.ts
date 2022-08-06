import { ExponentialStrengthPipe } from './exponential-strength.pipe';

describe('ExponentialStrengthPipe', () => {
  it('should return the same number by default', () => {
    // arrange
    let pipe = new ExponentialStrengthPipe();

    // act & assert
    expect(pipe.transform(10)).toBe(10);
  });

  it('should return 1024 if 2 ^ 10', () => {
    // arrange
    let pipe = new ExponentialStrengthPipe();

    // act & assert
    expect(pipe.transform(2, 10)).toBe(1024);
  });
});
