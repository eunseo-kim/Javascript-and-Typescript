import View from "../core/view";

export interface Store {
  currentPage: number;
  feeds: NewsFeed[];
}

export interface News {
  readonly id: number;
  readonly time_ago: string;
  readonly title: string;
  readonly url: string;
  readonly user: string;
  readonly content: string;
}

export interface NewsFeed extends News {
  readonly comments_count: number;
  readonly points: string;
  read?: boolean; // ?: 있을수도 없을수도 있다
}

export interface NewsDetail extends News {
  readonly comments_count: number;
  readonly comments: [];
}

export interface NewsComment extends News {
  readonly comments: [];
  readonly level: number;
}

export interface RouteInfo {
  path: string;
  page: View;
}
