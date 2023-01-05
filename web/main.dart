import 'dart:core';
import 'dart:html';
import "dart:async";
import 'dart:web_gl';
import 'dart:js' as js;

import 'load-fb-sdk.dart';
import 'set-config.dart';
import 'FB.dart';
import 'constants.dart';

class App {
  late String colorscheme;
  late String href;
  late bool lazy = false;
  late bool? mobile;
  late int num_posts;
  late String order_by; /* "time" | "reverse_time" */

  late String lang;
  late bool web_soket;

  set status(String name) {
    window.parent?.postMessage({'type': "status", 'error': name}, "*");

    final wrapper = querySelector("#wrapper");
    final loader = querySelector("#loader");
    final error = querySelector('#error');

    switch (name) {
      case LOADING_PLUGIN:
      case LOADING_SDK:
        wrapper?.style.display = "block";
        loader?.style.display = "flex";
        error?.style.display = "none";
        querySelector("#loading_code")?.text = name;
        break;
      case DONE:
        wrapper?.style.display = "block";
        loader?.style.display = "none";
        error?.style.display = "none";
        querySelector("#loading_code")?.text = name;
        break;
      case ERROR_PARAM_REQUIRED:
      case ERROR_LOAD_SDK:
      case ERROR_UNKNOWN:
        wrapper?.style.display = "none";
        loader?.style.display = "none";
        error?.style.display = "flex";
        querySelector("#error_code")?.text = name;

        break;
      default:
        window.console.warn("unknown status code: $name");
    }
  }

  App() {
    // final uri = Uri.parse(window.location.toString());
    final search = UrlSearchParams(window.location.search);

    colorscheme = search.get("colorscheme") ?? 'light';
    href = search.get("href") ?? '';
    lazy = search.get("href") == "true";
    final _mobile = search.get("mobile");
    mobile = _mobile == "true" ? true : (_mobile == "false" ? false : null);
    num_posts = int.tryParse(search.get("num_posts") ?? '') ?? 10;
    order_by = search.get("order_by") ?? "reverse_time";

    lang = search.get("locale") ??
        window.navigator.language.replaceFirst("-", "_");
    web_soket = search.get("web_soket") != "false";

    if (!web_soket) disableWebSocket();
  }

  Future<void> init() async {
    try {
      await loadSdk();

      listenMessage();
      observeDuck();

      reloadFBPlugin();
    } catch (e) {
      status = ERROR_UNKNOWN;
      window.parent?.postMessage({"type": "error", "error": e}, "*");
    }
  }

  void disableWebSocket() {
    js.context["WebSocket"] = null;
  }

  Future<void> loadSdk() async {
    status = LOADING_SDK;
    await loadFBSdk(lang: lang).catchError((e) {
      print("load FB SDK failed");
      status = ERROR_LOAD_SDK;
      throw Exception(e);
    });

    print("FB SDK loaded");
  }

  void listenMessage() {
    window.onMessage.listen((event) {
      if (event.data is! Object || event.data["type"] != "update_value") return;
      // if (event.data?.type != "update_value") return;

      final value = event.data.value;
      bool refreshPlugin = false;

      switch (event.data.key) {
        case "colorscheme":
          if (colorscheme != value) {
            colorscheme = value;
            refreshPlugin = true;
          }
          break;
        case "href":
          if (href != value) {
            href = value;
            refreshPlugin = true;
          }
          ;
          break;
        case "lazy":
          if (lazy != value) {
            lazy = value;
            refreshPlugin = true;
          }
          ;
          break;
        case "mobile":
          if (mobile != value) {
            mobile = value;
            refreshPlugin = true;
          }
          ;
          break;
        case "num_posts":
          if (num_posts != value) {
            num_posts = value;
            refreshPlugin = true;
          }
          ;
          break;
        case "order_by":
          if (order_by != value) {
            order_by = value;
            refreshPlugin = true;
          }
          ;
          break;
      }

      if (refreshPlugin) {
        reloadFBPlugin();
      }
    });
  }

  void reloadFBPlugin() {
    if (href == "") {
      window.console.warn("Param 'href' is required");
      status = ERROR_PARAM_REQUIRED;
      window.parent
          ?.postMessage({'type': "error", 'error': ERROR_PARAM_REQUIRED}, "*");
      return;
    }

    status = LOADING_PLUGIN;
    FB.Event.subscribe('xfbml.render', () {
      status = DONE;
      // final frame = querySelector("iframe");
      // frame?.onLoad.listen((event) {
      //   status = "DONE";
      // });
    });

    setConfig(
        colorscheme: colorscheme,
        href: href,
        lazy: lazy,
        mobile: mobile,
        num_posts: num_posts,
        order_by: order_by);
  }

  void observeDuck() {
    final wrapperEl = querySelector("#wrapper");

    if (wrapperEl == null) {
      throw Exception("#wrapper");
    }

    final observer = MutationObserver((mutationList, observer) {
      final nodeAdd = (mutationList[0].addedNodes[0] as Element);

      if (nodeAdd.classes.contains("fb-comments") ||
          nodeAdd.classes.contains("fb:comments")) {
        // check for comments
        reloadFBPlugin();
        print("re-mount plugin comment");
      }
    });

    observer.observe(wrapperEl, childList: true);
  }
}

void main() async {
  App().init();
}
