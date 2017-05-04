import { BerryfrontNewPage } from './app.po';

describe('berryfront-new App', () => {
  let page: BerryfrontNewPage;

  beforeEach(() => {
    page = new BerryfrontNewPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
