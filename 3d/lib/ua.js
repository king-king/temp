/**
 * Created by 白 on 2015/5/14.
 */

library( function () {
	var ua = {
		touch : "ontouchstart" in document,
		ie : !!window.ActiveXObject || "ActiveXObject" in window
	};

	module.exports = ua;
} );