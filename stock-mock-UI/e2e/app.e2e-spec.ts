import { StockMockPage } from './app.po';

describe('stock-mock App', () => {
  let page: StockMockPage;

  beforeEach(() => {
    page = new StockMockPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
