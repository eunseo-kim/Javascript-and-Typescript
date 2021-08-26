import Router from "./core/router";
import { NewsFeedView, NewsDetailView } from "./page";
import { Store } from "./types";

// store을 전역으로 처리하기 (그렇게 좋은 방법은 아님..ㅎ)
const store: Store = {
  currentPage: 1,
  feeds: [],
};

declare global {
  interface Window {
    store: Store;
  }
}
window.store = store;
const router: Router = new Router();
const newsFeedView = new NewsFeedView("root");
const newsDetailView = new NewsDetailView("root");

router.setDefaultPage(newsFeedView);
router.addRoutePath("/page/", newsFeedView);
router.addRoutePath("/show/", newsDetailView);

router.route();
