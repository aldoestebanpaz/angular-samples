import { MessageService } from './message.service';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    service = new MessageService();
  });

  it('should have no messages to start', () => {
    // assert
    expect(service.messages.length).toBe(0);
  });

  it('should add a message when add() is called', () => {
    // act
    service.add('message1');

    // assert
    expect(service.messages.length).toBe(1);
  });

  it('should remove all messages when clear() is called', () => {
    // arrange
    service.add('message1');
    service.add('message2');

    // act
    service.clear();

    // assert
    expect(service.messages.length).toBe(0);
  });
});
