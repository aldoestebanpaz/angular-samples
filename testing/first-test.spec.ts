// file: first-test.spec.ts

describe('my first test', () => {
    let sut: any;

    beforeEach(() => {
        sut = {}
    });

    // For this example, this string will show up next to our failing notification:
    // """
    // my first test
    //   should be true if true
    // """
    it('should be true if true', () => {
        // arrange
        sut.a = false;

        // act
        sut.a = true;

        // assert
        expect(sut.a).toBe(true);
    });
});
