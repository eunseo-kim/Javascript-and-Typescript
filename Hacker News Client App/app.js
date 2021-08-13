const ajax = new XMLHttpRequest();
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";
const container = document.getElementById("root");
const store = {
  currentPage: 1,
};

// 리팩토링-중복되는 코드를 함수로 묶기
function getData(url) {
  ajax.open("GET", url, false); // 동기적으로 가져옴
  ajax.send();

  // JSON.parse-json 응답값을 객체로 바꾸기
  return JSON.parse(ajax.response);
}

// 글 목록을 불러오는 함수 만들기
function newsFeed() {
  const newsList = [];
  const newsFeed = getData(NEWS_URL);

  newsList.push("<ul>");
  for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    newsList.push(`
     <li>
      <a href="#/show/${newsFeed[i].id}">
        ${newsFeed[i].title} (${newsFeed[i].comments_count})
      </a>
     </li>
    `);
  }
  newsList.push("</ul>");

  // 숙제: 다음 페이지 버그 수정해보기(없는 페이지로 이동하는 버그)
  const lastPage = newsFeed.length / 10;

  newsList.push(`
    <div>
      <a href="#/page/${store.currentPage > 1 ? store.currentPage - 1 : 1}">이전 페이지</a>
      <a href="#/page/${store.currentPage < lastPage ? store.currentPage + 1 : lastPage}">다음 페이지</a>
    </div>
  `);

  container.innerHTML = newsList.join("");
}

// 글 내용을 띄워주는 함수
function newsDetail() {
  const id = location.hash.substring(7);
  const newsContents = getData(CONTENT_URL.replace("@id", id));
  container.innerHTML = `
    <h1>${newsContents.title}</h1>
    
    <div>
      <a href="#/page/${store.currentPage}">목록으로</a>
    </div>
  `;
}

// 라우터 만들기
function router() {
  const routePath = location.hash;
  // 참고로, location.hash에 #만 들어있으면 ''를 반환한다.

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
