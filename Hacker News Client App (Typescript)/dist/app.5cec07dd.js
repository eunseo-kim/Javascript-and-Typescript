// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/core/router.ts":[function(require,module,exports) {
"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Router = /*#__PURE__*/function () {
  function Router() {
    _classCallCheck(this, Router);

    window.addEventListener("hashchange", this.route.bind(this)); // 넘겨줄 때 현재의 this로 고정.(bind(this))

    this.routeTable = [];
    this.defaultRoute = null;
  }

  _createClass(Router, [{
    key: "setDefaultPage",
    value: function setDefaultPage(page) {
      this.defaultRoute = {
        path: "",
        page: page
      };
    }
  }, {
    key: "addRoutePath",
    value: function addRoutePath(path, page) {
      this.routeTable.push({
        path: path,
        page: page
      });
    }
  }, {
    key: "route",
    value: function route() {
      var routePath = location.hash;

      if (routePath === "" && this.defaultRoute) {
        this.defaultRoute.page.render();
        return;
      }

      var _iterator = _createForOfIteratorHelper(this.routeTable),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var routeInfo = _step.value;

          if (routePath.indexOf(routeInfo.path) >= 0) {
            routeInfo.page.render();
            break;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }]);

  return Router;
}();

exports.default = Router;
},{}],"src/core/view.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
}); // View Class(공통 View 클래스)
// private : (자식에서도 접근 X) View 안에서만 접근 가능

var View = /*#__PURE__*/function () {
  function View(containerId, template) {
    _classCallCheck(this, View);

    var containerElement = document.getElementById(containerId);

    if (!containerElement) {
      throw "최상위 컨테이너가 없어 UI를 진행할 수 없습니다.";
    }

    this.container = containerElement;
    this.template = template;
    this.htmlList = [];
    this.renderTemplate = template;
  }

  _createClass(View, [{
    key: "updateView",
    value: function updateView() {
      this.container.innerHTML = this.renderTemplate;
      this.renderTemplate = this.template;
    }
  }, {
    key: "addHtml",
    value: function addHtml(htmlString) {
      this.htmlList.push(htmlString);
    }
  }, {
    key: "clearHtmlList",
    value: function clearHtmlList() {
      this.htmlList = [];
    }
  }, {
    key: "getHtml",
    value: function getHtml() {
      var snapshot = this.htmlList.join("");
      this.clearHtmlList();
      return snapshot;
    }
  }, {
    key: "setTemplateData",
    value: function setTemplateData(key, value) {
      this.renderTemplate = this.renderTemplate.replace("{{__".concat(key, "__}}"), value);
    }
  }]);

  return View;
}();

exports.default = View;
},{}],"src/core/api.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NewsDetailApi = exports.NewsFeedApi = exports.Api = void 0;

var Api = /*#__PURE__*/function () {
  function Api(url) {
    _classCallCheck(this, Api);

    this.url = url;
    this.ajax = new XMLHttpRequest();
  }

  _createClass(Api, [{
    key: "getRequest",
    value: function getRequest() {
      this.ajax.open("GET", this.url);
      this.ajax.send();
      return JSON.parse(this.ajax.response);
    }
  }]);

  return Api;
}();

exports.Api = Api;

var NewsFeedApi = /*#__PURE__*/function (_Api) {
  _inherits(NewsFeedApi, _Api);

  var _super = _createSuper(NewsFeedApi);

  function NewsFeedApi() {
    _classCallCheck(this, NewsFeedApi);

    return _super.apply(this, arguments);
  }

  _createClass(NewsFeedApi, [{
    key: "getData",
    value: function getData() {
      return this.getRequest();
    }
  }]);

  return NewsFeedApi;
}(Api);

exports.NewsFeedApi = NewsFeedApi;

var NewsDetailApi = /*#__PURE__*/function (_Api2) {
  _inherits(NewsDetailApi, _Api2);

  var _super2 = _createSuper(NewsDetailApi);

  function NewsDetailApi() {
    _classCallCheck(this, NewsDetailApi);

    return _super2.apply(this, arguments);
  }

  _createClass(NewsDetailApi, [{
    key: "getData",
    value: function getData() {
      return this.getRequest();
    }
  }]);

  return NewsDetailApi;
}(Api);

exports.NewsDetailApi = NewsDetailApi;
},{}],"src/config.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CONTENT_URL = exports.NEWS_URL = void 0;
exports.NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
exports.CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";
},{}],"src/page/news-detail-view.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var view_1 = __importDefault(require("../core/view"));

var api_1 = require("../core/api");

var config_1 = require("../config");

var template = "\n  <div class=\"bg-gray-600 min-h-screen pb-8\">\n    <div class=\"bg-white text-xl\">\n      <div class=\"mx-auto px-4\">\n        <div class=\"flex justify-between items-center py-6\">\n          <div class=\"flex justify-start\">\n            <a href=\"#/page/1\">\n              <h1 class=\"font-extrabold\">Hacker News</h1>\n            </a>\n          </div>\n          <div class=\"items-center justify-end\">\n            <a href=\"#/page/{{__currentPage__}}\" class=\"text-gray-500\">\n              <i class=\"fa fa-times\"></i>\n            </a>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"h-full border rounded-xl bg-white m-6 p-4 \">\n      <h1 class=\"text-4xl font-extrabold\" >{{__title__}}</h1>\n      <div class=\"text-gray-400 h-20\">\n        {{__content__}}\n      </div>\n\n      {{__comments__}}\n\n    </div>\n  </div>\n";

var NewsDetailView = /*#__PURE__*/function (_view_1$default) {
  _inherits(NewsDetailView, _view_1$default);

  var _super = _createSuper(NewsDetailView);

  function NewsDetailView(containerId, store) {
    var _this;

    _classCallCheck(this, NewsDetailView);

    _this = _super.call(this, containerId, template);

    _this.render = function (id) {
      var api = new api_1.NewsDetailApi(config_1.CONTENT_URL.replace("@id", id));
      var newsDetail = api.getData();

      _this.store.makeRead(Number(id));

      _this.setTemplateData("currentPage", _this.store.currentPage.toString());

      _this.setTemplateData("title", newsDetail.title);

      _this.setTemplateData("content", newsDetail.content);

      _this.setTemplateData("comments", _this.makeComment(newsDetail.comments));

      _this.updateView();
    };

    _this.store = store;
    return _this;
  }

  _createClass(NewsDetailView, [{
    key: "makeComment",
    value: function makeComment(comments) {
      for (var i = 0; i < comments.length; i++) {
        var comment = comments[i];
        this.addHtml("\n          <div style=\"padding-left: ".concat(comment.level * 40, "px;\" class=\"mt-4\">\n            <div class=\"text-gray-400\">\n              <i class=\"fa fa-sort-up mr-2\"></i>\n              <strong>").concat(comment.user, "</strong> ").concat(comment.time_ago, "\n            </div>\n            <p class=\"text-gray-700\">").concat(comment.content, "</p>\n          </div>      \n        "));

        if (comment.comments.length > 0) {
          this.addHtml(this.makeComment(comment.comments));
        }
      }

      return this.getHtml();
    }
  }]);

  return NewsDetailView;
}(view_1.default);

exports.default = NewsDetailView;
},{"../core/view":"src/core/view.ts","../core/api":"src/core/api.ts","../config":"src/config.ts"}],"src/page/news-feed-view.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var view_1 = __importDefault(require("../core/view"));

var api_1 = require("../core/api");

var config_1 = require("../config");

var template = "\n<div class=\"bg-gray-600 min-h-screen\">\n  <div class=\"bg-white text-xl\">\n    <div class=\"mx-auto px-4\">\n      <div class=\"flex justify-between items-center py-6\">\n        <div class=\"flex justify-start\">\n          <a href=\"#/page/1\">\n            <h1 class=\"font-extrabold\">Hacker News</h1>\n          </a>\n        </div>\n        <div class=\"items-center justify-end\">\n          <a href=\"#/page/{{__prev_page__}}\" class=\"text-gray-500\">\n            Previous\n          </a>\n          <a href=\"#/page/{{__next_page__}}\" class=\"text-gray-500 ml-4\">\n            Next\n          </a>\n        </div>\n      </div> \n    </div>\n  </div>\n  <div class=\"p-4 text-2xl text-gray-700\">\n    {{__news_feed__}}        \n  </div>\n</div>\n";

var NewsFeedView = /*#__PURE__*/function (_view_1$default) {
  _inherits(NewsFeedView, _view_1$default);

  var _super = _createSuper(NewsFeedView);

  function NewsFeedView(containerId, store) {
    var _this;

    _classCallCheck(this, NewsFeedView);

    _this = _super.call(this, containerId, template);

    _this.render = function () {
      var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "1";
      _this.store.currentPage = Number(location.hash.substr(7) || 1);

      for (var i = (_this.store.currentPage - 1) * 10; i < _this.store.currentPage * 10; i++) {
        // 구조 분해 할당
        var _this$store$getFeed = _this.store.getFeed(i),
            id = _this$store$getFeed.id,
            title = _this$store$getFeed.title,
            comments_count = _this$store$getFeed.comments_count,
            user = _this$store$getFeed.user,
            points = _this$store$getFeed.points,
            time_ago = _this$store$getFeed.time_ago,
            read = _this$store$getFeed.read;

        _this.addHtml("\n          <div class=\"p-6 ".concat(read ? "bg-red-100" : "bg-white", " mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100\">\n            <div class=\"flex\">\n              <div class=\"flex-auto\">\n                <a href=\"#/show/").concat(id, "\">").concat(title, "</a>  \n              </div>\n              <div class=\"text-center text-sm\">\n                <div class=\"w-10 text-white bg-green-300 rounded-lg px-0 py-2\">").concat(comments_count, "</div>\n              </div>\n            </div>\n            <div class=\"flex mt-3\">\n              <div class=\"grid grid-cols-3 text-sm text-gray-500\">\n                <div><i class=\"fas fa-user mr-1\"></i>").concat(user, "</div>\n                <div><i class=\"fas fa-heart mr-1\"></i>").concat(points, "</div>\n                <div><i class=\"far fa-clock mr-1\"></i>").concat(time_ago, "</div>\n              </div>  \n            </div>\n          </div>    \n        "));
      } // const lastPage = this.feeds.length / 10;


      _this.setTemplateData("news_feed", _this.getHtml());

      _this.setTemplateData("prev_page", String(_this.store.prevPage));

      _this.setTemplateData("next_page", String(_this.store.nextPage));

      _this.updateView();
    };

    _this.store = store;
    _this.api = new api_1.NewsFeedApi(config_1.NEWS_URL);

    if (!_this.store.hasFeeds) {
      _this.store.setFeeds(_this.api.getData());
    }

    return _this;
  }

  return NewsFeedView;
}(view_1.default);

exports.default = NewsFeedView;
},{"../core/view":"src/core/view.ts","../core/api":"src/core/api.ts","../config":"src/config.ts"}],"src/page/index.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NewsFeedView = exports.NewsDetailView = void 0;

var news_detail_view_1 = require("./news-detail-view");

Object.defineProperty(exports, "NewsDetailView", {
  enumerable: true,
  get: function get() {
    return __importDefault(news_detail_view_1).default;
  }
});

var news_feed_view_1 = require("./news-feed-view");

Object.defineProperty(exports, "NewsFeedView", {
  enumerable: true,
  get: function get() {
    return __importDefault(news_feed_view_1).default;
  }
});
},{"./news-detail-view":"src/page/news-detail-view.ts","./news-feed-view":"src/page/news-feed-view.ts"}],"src/store.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Store = /*#__PURE__*/function () {
  function Store() {
    _classCallCheck(this, Store);

    this.feeds = [];
    this._currentPage = 1;
  } // 외부에서는 속성처럼 보이지만 내부에서는 함수로 작동하는 getter, setter!


  _createClass(Store, [{
    key: "currentPage",
    get: function get() {
      return this._currentPage;
    },
    set: function set(page) {
      if (page <= 0) return;
      this._currentPage = page;
    }
  }, {
    key: "nextPage",
    get: function get() {
      return this._currentPage < this.lastPage ? this._currentPage + 1 : this._currentPage;
    }
  }, {
    key: "prevPage",
    get: function get() {
      return this._currentPage > 1 ? this._currentPage - 1 : 1;
    }
  }, {
    key: "numberOfFeed",
    get: function get() {
      return this.feeds.length;
    }
  }, {
    key: "lastPage",
    get: function get() {
      return this.numberOfFeed / 10;
    }
  }, {
    key: "hasFeeds",
    get: function get() {
      return this.feeds.length > 0;
    }
  }, {
    key: "getAllFeeds",
    value: function getAllFeeds() {
      return this.feeds;
    }
  }, {
    key: "getFeed",
    value: function getFeed(position) {
      return this.feeds[position];
    } // spread operator, map 함수 학습하기

  }, {
    key: "setFeeds",
    value: function setFeeds(feeds) {
      feeds.map(function (feed) {
        return Object.assign(Object.assign({}, feed), {
          read: false
        });
      });
    }
  }, {
    key: "makeRead",
    value: function makeRead(id) {
      var feed = this.feeds.find(function (feed) {
        return feed.id === id;
      });

      if (feed) {
        feed.read = true;
      }
    }
  }]);

  return Store;
}();

exports.default = Store;
},{}],"src/app.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var router_1 = __importDefault(require("./core/router"));

var page_1 = require("./page");

var store_1 = __importDefault(require("./store"));

var store = new store_1.default();
var router = new router_1.default();
var newsFeedView = new page_1.NewsFeedView("root", store);
var newsDetailView = new page_1.NewsDetailView("root", store);
router.setDefaultPage(newsFeedView);
router.addRoutePath("/page/", newsFeedView);
router.addRoutePath("/show/", newsDetailView);
router.route();
},{"./core/router":"src/core/router.ts","./page":"src/page/index.ts","./store":"src/store.ts"}],"../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62330" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/app.ts"], null)
//# sourceMappingURL=/app.5cec07dd.js.map