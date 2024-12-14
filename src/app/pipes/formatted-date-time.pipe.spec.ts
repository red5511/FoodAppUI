import { FormattedDateTimePipe } from './formatted-date-time.pipe';

describe('FormattedDateTimePipe', () => {
  it('create an instance', () => {
    const pipe = new FormattedDateTimePipe();
    expect(pipe).toBeTruthy();
  });
});
