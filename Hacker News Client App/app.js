const ajax = new XMLHttpRequest();
const content = document.createElement("div");
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";
const container = document.getElementById("root");

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
  for (let i = 0; i < newsFeed.length; i++) {
    newsList.push(`
     <li>
      <a href="#${newsFeed[i].id}">
        ${newsFeed[i].title} (${newsFeed[i].comments_count})
      </a>
     </li>
    `);
  }
  newsList.push("</ul>");
  container.innerHTML = newsList.join("");
}

// 글 내용을 띄워주는 함수
function newsDetail() {
  const id = location.hash.substring(1);
  const newsContents = getData(CONTENT_URL.replace("@id", id));
  container.innerHTML = `
    <h1>${newsContents.title}</h1>
    
    <div>
      <a href="#">목록으로</a>
    </div>
  `;
}

// 라우터 만들기
function router() {
  const routePath = location.hash;
  // 참고로, location.hash에 #만 들어있으면 ''를 반환한다.

  if (routePath === "") {
    newsFeed();
  } else {
    newsDetail();
  }
}

window.addEventListener("hashchange", router);
router();
