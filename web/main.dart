import 'dart:html';
import "dart:async";
import 'dart:js' as js;
import "./FB.dart";

Future<void> loadFBSdk([
  String? lang
]) {
  lang ??= window.navigator.language.replaceFirst("-", "_");
  
  final scriptEl = ScriptElement();
  
  scriptEl.src = "https://connect.facebook.net/$lang/sdk.js#xfbml=1&version=v15.0&autoLogAppEvents=1";
  scriptEl.nonce = "XStSrfhG";
  
  final completer = Completer<void>();
  var loadListener;
  var errorListener;
  
  void onLoad(Event event) {
    loadListener ?.cancel();
    errorListener?.cancel();
    
    completer.complete();
  }
  void onError(Event event) {
    loadListener ?.cancel();
    errorListener?.cancel();
    
    completer.completeError(event);
  }
  
  loadListener  = scriptEl.onLoad.listen(onLoad);
  errorListener = scriptEl.onError.listen(onError);
  
  
  document.head?.children.add(scriptEl);
  
  return completer.future;
}

void setConfig({
  String colorscheme = "light",
  required String href,
  bool lazy = false,
  bool? mobile,
  int num_posts = 10,
  String order_by = "reverse_time"/* "time" | "reverse_time" */,
  int width = 550
}) {
  
  final commentsEl = querySelector("#comments");
  
  if (commentsEl == null) {
    throw Exception("#comments not exists");
  }
//  data-href="" data-width="" data-numposts="5"
  commentsEl.dataset["colorscheme"]     = colorscheme;
  commentsEl.dataset["href"]            = href;
  commentsEl.dataset["lazy"]            = lazy ? "true" : "false";
  if (mobile is bool)
    commentsEl.dataset["mobile"]        = mobile ? "true" : "false";
  commentsEl.dataset["numposts"]        = num_posts.toString();
  commentsEl.dataset["order-by"]        = order_by;
  commentsEl.dataset["width"]           = width.toString();

  if (js.context["FB"] != null)
    FB.XFBML.parse();
}

void main() async {
  await loadFBSdk().catchError((e) {
    print("load FB SDK failied");
    throw Exception(e);
  });
  
  print("FB SDK loaded");
  final href =("https://developers.facebook.com/docs/plugins/comments#configurator");

  setConfig(href: "https://googe.com", colorscheme: "dark");
}
