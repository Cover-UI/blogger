"use strict";function sd_get_search_url(t){return"/search?q=".concat(t)}function sd_get_hashtag_el(t){return'<a class="sd_blogger_hashtag" href="'.concat(sd_get_search_url(t),'"><b>#</b><strong>').concat(t,"</strong></a>")}function sd_hashtag_split(t){for(var s=[],h=0;h<t.length;h++){var a=t[h];0!=h&&(t[h-1].endsWith('href="')||t[h-1].endsWith("href='"))||s.push(a)}return s}$.fn.blogger_hashtag_plugin=function(){var t=$(this).html();t=sd_hashtag_split(t=t.split("#"));for(var s=1;s<t.length;s++){var h=t[s].split(" ");h[0]=sd_get_hashtag_el(h[0]),t[s]=h.join(" ")}t=t.join(""),$(this).html(t)};