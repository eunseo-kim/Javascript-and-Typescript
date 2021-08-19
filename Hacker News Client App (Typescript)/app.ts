interface Store {
  currentPage: number;
  feeds: NewsFeed[];
}

interface News {
  readonly id: number;
  readonly time_ago: string;
  readonly title: string;
  readonly url: string;
  readonly user: string;
  readonly content: string;
}

interface NewsFeed extends News {
  readonly comments_count: number;
  readonly points: string;
  read?: boolean; // ?: 있을수도 없을수도 있다
}

interface NewsDetail extends News {
  readonly comments_count: number;
  readonly comments: [];
}

interface NewsComment extends News {
  readonly comments: [];
  readonly level: number;
}

const container: HTMLElement | null = document.getElementById("root");
const ajax: XMLHttpRequest = new XMLHttpRequest();
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";
const store: Store = {
  currentPage: 1,
  feeds: [],
};

// getData의 반환값은 2가지 종류인데 어떻게 타입을 지정할까?
// 타입 2가지 => newsFeed 타입 & 2. newsContent
// sol 1) '|'으로 해결하기
// => 만약 getData가 반환하는 타입의 종류가 더 많아지면? 그때로 다 '|'으로 처리하나?
// 그런데 '|' 중 어떤 타입인지 하나하나 if-else로 타입 가드 코드를 작성하는 것은 좀...
// sol 2) 제네릭
// => 호출하는 쪽에서 유형을 명시해주면 그 유형을 받아서 사용하겠다~
function getData<AjaxResponse>(url: string): AjaxResponse {
  ajax.open("GET", url, false); // 동기적으로 가져옴
  ajax.send();

  return JSON.parse(ajax.response);
}

function makeFeeds(feeds: NewsFeed[]): NewsFeed[] {
  for (let i = 0; i < feeds.length; i++) {
    feeds[i].read = false;
  }

  return feeds;
}

function updateView(html: string): void {
  if (container) {
    container.innerHTML = html;
  } else {
    console.log("최상위 컨테이너가 없어 UI 진행 불가능!");
  }
}

function newsFeed(): void {
  const newsList = [];
  let newsFeed: NewsFeed[] = store.feeds;

  if (newsFeed.length === 0) {
    newsFeed = store.feeds = makeFeeds(getData<NewsFeed[]>(NEWS_URL));
  }

  let template = `
    <div class="bg-gray-600 min-h-screen">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <a href="#/page/1">
                <h1 class="font-extrabold">Hacker News</h1>
              </a>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/{{__prev_page__}}" class="text-gray-500">
                Previous
              </a>
              <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
                Next
              </a>
            </div>
          </div> 
        </div>
      </div>
      <div class="p-4 text-2xl text-gray-700">
        {{__news_feed__}}        
      </div>
    </div>
  `;

  for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    newsList.push(`
      <div class="p-6 ${newsFeed[i].read ? "bg-red-100" : "bg-white"} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
        <div class="flex">
          <div class="flex-auto">
            <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>  
          </div>
          <div class="text-center text-sm">
            <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${newsFeed[i].comments_count}</div>
          </div>
        </div>
        <div class="flex mt-3">
          <div class="grid grid-cols-3 text-sm text-gray-500">
            <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
            <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</div>
            <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
          </div>  
        </div>
      </div>    
    `);
  }

  const lastPage = newsFeed.length / 10;

  template = template.replace("{{__news_feed__}}", newsList.join(""));
  template = template.replace("{{__prev_page__}}", String(store.currentPage > 1 ? store.currentPage - 1 : 1));
  template = template.replace("{{__next_page__}}", String(store.currentPage < lastPage ? store.currentPage + 1 : lastPage));

  updateView(template);
}

function newsDetail(): void {
  const id = location.hash.substring(7);
  const newsContent = getData<NewsDetail>(CONTENT_URL.replace("@id", id));
  let template = `
    <div class="bg-gray-600 min-h-screen pb-8">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <a href="#/page/1">
                <h1 class="font-extrabold">Hacker News</h1>
              </a>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/${store.currentPage}" class="text-gray-500">
                <i class="fa fa-times"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="h-full border rounded-xl bg-white m-6 p-4 ">
        <h1 class="text-4xl font-extrabold" >${newsContent.title}</h1>
        <div class="text-gray-400 h-20">
          ${newsContent.content}
        </div>

        {{__comments__}}

      </div>
    </div>
  `;

  for (let i = 0; i < store.feeds.length; i++) {
    if (store.feeds[i].id === Number(id)) {
      store.feeds[i].read = true;
      break;
    }
  }

  updateView(template.replace("{{__comments__}}", makeComment(newsContent.comments)));
}

function makeComment(comments: NewsComment[]): string {
  const commentString = [];

  for (let i = 0; i < comments.length; i++) {
    const comment: NewsComment = comments[i];

    commentString.push(`
      <div style="padding-left: ${comment.level * 40}px;" class="mt-4">
        <div class="text-gray-400">
          <i class="fa fa-sort-up mr-2"></i>
          <strong>${comment.user}</strong> ${comment.time_ago}
        </div>
        <p class="text-gray-700">${comment.content}</p>
      </div>      
    `);

    if (comment.comments.length > 0) {
      commentString.push(makeComment(comment.comments));
    }
  }

  return commentString.join("");
}

function router(): void {
  const routePath = location.hash;

  if (routePath === "") {
    newsFeed();
  } else if (routePath.indexOf("#/page/") >= 0) {
    store.currentPage = Number(routePath.substr(7));
    newsFeed();
  } else {
    newsDetail();
  }
}

window.addEventListener("hashchange", router);
router();
