import { StocksPage } from './app.po';

describe('stocks App', () => {
  let page: StocksPage;

  beforeEach(() => {
    page = new StocksPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
