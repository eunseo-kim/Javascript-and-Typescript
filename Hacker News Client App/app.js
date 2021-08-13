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

const newsFeed = getData(NEWS_URL);
const ul = document.createElement("ul");

window.addEventListener("hashchange", function () {
  const id = location.hash.substring(1);

  const newsContents = getData(CONTENT_URL.replace("@id", id));

  const title = document.createElement("h1");
  title.innerHTML = newsContents.title;

  content.appendChild(title);
  console.log(newsContents);
});

for (let i = 0; i < newsFeed.length; i++) {
  const div = document.createElement("div");

  div.innerHTML = `
   <li>
    <a href="#${newsFeed[i].id}">
      ${newsFeed[i].title} (${newsFeed[i].comments_count})
    </a>
   </li>
  `;

  // ul.appendChild(div.children[0]);
  ul.appendChild(div.firstElementChild);
}

container.appendChild(ul);
container.appendChild(content);
