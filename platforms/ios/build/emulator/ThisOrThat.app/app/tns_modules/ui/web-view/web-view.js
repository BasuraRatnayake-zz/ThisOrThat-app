var common = require("./web-view-common");
var trace = require("trace");
global.moduleMerge(common, exports);
var UIWebViewDelegateImpl = (function (_super) {
    __extends(UIWebViewDelegateImpl, _super);
    function UIWebViewDelegateImpl() {
        _super.apply(this, arguments);
    }
    UIWebViewDelegateImpl.new = function () {
        return _super.new.call(this);
    };
    UIWebViewDelegateImpl.prototype.initWithOwner = function (owner) {
        this._owner = owner;
        return this;
    };
    UIWebViewDelegateImpl.prototype.webViewShouldStartLoadWithRequestNavigationType = function (webView, request, navigationType) {
        if (request.URL) {
            trace.write("UIWebViewDelegateClass.webViewShouldStartLoadWithRequestNavigationType(" + request.URL.absoluteString + ", " + navigationType + ")", trace.categories.Debug);
            this._owner._onLoadStarted(request.URL.absoluteString);
        }
        return true;
    };
    UIWebViewDelegateImpl.prototype.webViewDidStartLoad = function (webView) {
        trace.write("UIWebViewDelegateClass.webViewDidStartLoad(" + webView.request.URL + ")", trace.categories.Debug);
    };
    UIWebViewDelegateImpl.prototype.webViewDidFinishLoad = function (webView) {
        trace.write("UIWebViewDelegateClass.webViewDidFinishLoad(" + webView.request.URL + ")", trace.categories.Debug);
        this._owner._onLoadFinished(webView.request.URL.absoluteString);
    };
    UIWebViewDelegateImpl.prototype.webViewDidFailLoadWithError = function (webView, error) {
        var url = this._owner.url;
        if (webView.request && webView.request.URL) {
            url = webView.request.URL.absoluteString;
        }
        trace.write("UIWebViewDelegateClass.webViewDidFailLoadWithError(" + error.localizedDescription + ")", trace.categories.Debug);
        this._owner._onLoadFinished(url, error.localizedDescription);
    };
    UIWebViewDelegateImpl.ObjCProtocols = [UIWebViewDelegate];
    return UIWebViewDelegateImpl;
})(NSObject);
var WebView = (function (_super) {
    __extends(WebView, _super);
    function WebView() {
        _super.call(this);
        this._ios = new UIWebView();
        this._delegate = UIWebViewDelegateImpl.new().initWithOwner(this);
    }
    WebView.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this._ios.delegate = this._delegate;
    };
    WebView.prototype.onUnloaded = function () {
        this._ios.delegate = null;
        _super.prototype.onUnloaded.call(this);
    };
    Object.defineProperty(WebView.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    WebView.prototype.stopLoading = function () {
        this._ios.stopLoading();
    };
    WebView.prototype._loadUrl = function (url) {
        trace.write("WebView._loadUrl(" + url + ")", trace.categories.Debug);
        if (this._ios.loading) {
            this._ios.stopLoading();
        }
        this._ios.loadRequest(NSURLRequest.requestWithURL(NSURL.URLWithString(url)));
    };
    WebView.prototype._loadFileOrResource = function (path, content) {
        var baseURL = NSURL.fileURLWithPath(NSString.stringWithString(path).stringByDeletingLastPathComponent);
        this._ios.loadHTMLStringBaseURL(content, baseURL);
    };
    WebView.prototype._loadHttp = function (src) {
        this._ios.loadRequest(NSURLRequest.requestWithURL(NSURL.URLWithString(src)));
    };
    WebView.prototype._loadData = function (src) {
        this._ios.loadHTMLStringBaseURL(src, null);
    };
    Object.defineProperty(WebView.prototype, "canGoBack", {
        get: function () {
            return this._ios.canGoBack;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebView.prototype, "canGoForward", {
        get: function () {
            return this._ios.canGoForward;
        },
        enumerable: true,
        configurable: true
    });
    WebView.prototype.goBack = function () {
        this._ios.goBack();
    };
    WebView.prototype.goForward = function () {
        this._ios.goForward();
    };
    WebView.prototype.reload = function () {
        this._ios.reload();
    };
    return WebView;
})(common.WebView);
exports.WebView = WebView;
