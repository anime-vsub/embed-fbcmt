import 'dart:html';
import "dart:async";

Future<void> loadFBSdk({required String lang}) {
  final scriptEl = ScriptElement();

  scriptEl.src =
      "https://connect.facebook.net/$lang/sdk.js#xfbml=1&version=v15.0&autoLogAppEvents=1";
  scriptEl.nonce = "XStSrfhG";

  final completer = Completer<void>();
  StreamSubscription<Event>? loadListener, errorListener;

  void onLoad(Event event) {
    loadListener?.cancel();
    errorListener?.cancel();

    completer.complete();
  }

  void onError(Event event) {
    loadListener?.cancel();
    errorListener?.cancel();
    completer.completeError(Error());
  }

  loadListener = scriptEl.onLoad.listen(onLoad);
  errorListener = scriptEl.onError.listen(onError);

  document.head?.children.add(scriptEl);

  return completer.future;
}
