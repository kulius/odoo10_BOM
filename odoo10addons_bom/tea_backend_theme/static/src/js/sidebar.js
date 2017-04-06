// Sets the link for the sidebar in developer mode

odoo.define('sidebar', function (require) {
    "use strict";

    var session = require('web.session');

    $(function(){
        (function ($) {
            $.delDebug = function (url) {
                var str  = stringFn.between(url, "web", "#");
                //alert(str);
                url = url.replace("str/g","");
                return url;
            }
            $.addDebug = function (url) {
                var str  = stringFn.between(url, "web", "#");
                var url = url.replace(/(.{4})/,"$1?debug");
                //url = url.replace("str/g","$1?debug");
                return url;
            }
            $.addDebugWithAssets = function (url) {
                var str  = stringFn.between(url, "web", "#");
                var url = url.replace(/(.{4})/,"$1?debug=assets");
                //url = url.replace("str/g","?debug=assets");
                return url;
            }
        })(jQuery);

        $("#sidebar a").each(function(){
            var url = $(this).attr('href');
            var str  = stringFn.between(url, "web", "#");

            if (session.debug ==false) //url.indexOf("debug")  //stringFn.glob(url, "debug")==true
                $(this).attr('href',$.delDebug(url));
            if (session.debug ==1)
                $(this).attr('href',$.addDebug(url));
            if (session.debug =='assets')
                $(this).attr('href',$.addDebugWithAssets(url));
        });

    });
});

