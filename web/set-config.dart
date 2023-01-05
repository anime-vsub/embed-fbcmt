import 'dart:html';
import "dart:async";
import 'dart:js' as js;
import 'FB.dart';

void setConfig({
  required String colorscheme,
  required String href,
  required bool lazy,
  required bool? mobile,
  required int num_posts,
  required String order_by /* "time" | "reverse_time" */,
}) {
  final commentsEl = querySelector("#wrapper > *");

  if (commentsEl == null) {
    throw Exception("#wrapper > *");
  }
//  data-href="" data-width="" data-numposts="5"
  commentsEl.dataset["colorscheme"] = colorscheme;
  commentsEl.dataset["href"] = href;
  commentsEl.dataset["lazy"] = lazy ? "true" : "false";
  if (mobile is bool) commentsEl.dataset["mobile"] = mobile ? "true" : "false";
  commentsEl.dataset["numposts"] = num_posts.toString();
  commentsEl.dataset["order-by"] = order_by;
  commentsEl.dataset["width"] = "100%";

  if (js.context["FB"] != null) FB.XFBML.parse();
}
