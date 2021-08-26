import { NewsFeed, NewsStore } from "./types";

export default class Store implements NewsStore {
  private feeds: NewsFeed[];
  private _currentPage: number;

  constructor() {
    this.feeds = [];
    this._currentPage = 1;
  }

  // 외부에서는 속성처럼 보이지만 내부에서는 함수로 작동하는 getter, setter!
  get currentPage(): number {
    return this._currentPage;
  }

  set currentPage(page: number) {
    if (page <= 0) return;
    this._currentPage = page;
  }

  get nextPage(): number {
    return this._currentPage < this.lastPage ? this._currentPage + 1 : this._currentPage;
  }

  get prevPage(): number {
    return this._currentPage > 1 ? this._currentPage - 1 : 1;
  }

  get numberOfFeed(): number {
    return this.feeds.length;
  }

  get lastPage(): number {
    return this.numberOfFeed / 10;
  }

  get hasFeeds(): boolean {
    return this.feeds.length > 0;
  }

  getAllFeeds(): NewsFeed[] {
    return this.feeds;
  }

  getFeed(position: number): NewsFeed {
    return this.feeds[position];
  }

  // spread operator, map 함수 학습하기
  setFeeds(feeds: NewsFeed[]): void {
    feeds.map((feed) => ({
      ...feed,
      read: false,
    }));
  }

  makeRead(id: number): void {
    const feed = this.feeds.find((feed: NewsFeed) => feed.id === id);

    if (feed) {
      feed.read = true;
    }
  }
}
