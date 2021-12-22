"use strict";
(self["webpackChunkrealisr_2"] = self["webpackChunkrealisr_2"] || []).push([["build_realisr_2_js"],{

/***/ "./build/realisr_2.js":
/*!****************************!*\
  !*** ./build/realisr_2.js ***!
  \****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__) => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "__wbg_alert_8d43f723b291f1fc": () => (/* reexport safe */ _realisr_2_bg_js__WEBPACK_IMPORTED_MODULE_1__.__wbg_alert_8d43f723b291f1fc),
/* harmony export */   "__wbindgen_throw": () => (/* reexport safe */ _realisr_2_bg_js__WEBPACK_IMPORTED_MODULE_1__.__wbindgen_throw),
/* harmony export */   "big_computation": () => (/* reexport safe */ _realisr_2_bg_js__WEBPACK_IMPORTED_MODULE_1__.big_computation),
/* harmony export */   "divide_by_two": () => (/* reexport safe */ _realisr_2_bg_js__WEBPACK_IMPORTED_MODULE_1__.divide_by_two),
/* harmony export */   "welcome": () => (/* reexport safe */ _realisr_2_bg_js__WEBPACK_IMPORTED_MODULE_1__.welcome)
/* harmony export */ });
/* harmony import */ var _realisr_2_bg_wasm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./realisr_2_bg.wasm */ "./build/realisr_2_bg.wasm");
/* harmony import */ var _realisr_2_bg_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./realisr_2_bg.js */ "./build/realisr_2_bg.js");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_realisr_2_bg_js__WEBPACK_IMPORTED_MODULE_1__, _realisr_2_bg_wasm__WEBPACK_IMPORTED_MODULE_0__]);
([_realisr_2_bg_js__WEBPACK_IMPORTED_MODULE_1__, _realisr_2_bg_wasm__WEBPACK_IMPORTED_MODULE_0__] = __webpack_async_dependencies__.then ? await __webpack_async_dependencies__ : __webpack_async_dependencies__);


});

/***/ }),

/***/ "./build/realisr_2_bg.js":
/*!*******************************!*\
  !*** ./build/realisr_2_bg.js ***!
  \*******************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__) => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "big_computation": () => (/* binding */ big_computation),
/* harmony export */   "welcome": () => (/* binding */ welcome),
/* harmony export */   "divide_by_two": () => (/* binding */ divide_by_two),
/* harmony export */   "__wbg_alert_8d43f723b291f1fc": () => (/* binding */ __wbg_alert_8d43f723b291f1fc),
/* harmony export */   "__wbindgen_throw": () => (/* binding */ __wbindgen_throw)
/* harmony export */ });
/* harmony import */ var _realisr_2_bg_wasm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./realisr_2_bg.wasm */ "./build/realisr_2_bg.wasm");
/* module decorator */ module = __webpack_require__.hmd(module);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_realisr_2_bg_wasm__WEBPACK_IMPORTED_MODULE_0__]);
_realisr_2_bg_wasm__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? await __webpack_async_dependencies__ : __webpack_async_dependencies__)[0];

var lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;
var cachedTextDecoder = new lTextDecoder('utf-8', {
  ignoreBOM: true,
  fatal: true
});
cachedTextDecoder.decode();
var cachegetUint8Memory0 = null;

function getUint8Memory0() {
  if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== _realisr_2_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.memory.buffer) {
    cachegetUint8Memory0 = new Uint8Array(_realisr_2_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.memory.buffer);
  }

  return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}
/**
*/


function big_computation() {
  _realisr_2_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.big_computation();
}
var WASM_VECTOR_LEN = 0;
var lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;
var cachedTextEncoder = new lTextEncoder('utf-8');
var encodeString = typeof cachedTextEncoder.encodeInto === 'function' ? function (arg, view) {
  return cachedTextEncoder.encodeInto(arg, view);
} : function (arg, view) {
  var buf = cachedTextEncoder.encode(arg);
  view.set(buf);
  return {
    read: arg.length,
    written: buf.length
  };
};

function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    var buf = cachedTextEncoder.encode(arg);

    var _ptr = malloc(buf.length);

    getUint8Memory0().subarray(_ptr, _ptr + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return _ptr;
  }

  var len = arg.length;
  var ptr = malloc(len);
  var mem = getUint8Memory0();
  var offset = 0;

  for (; offset < len; offset++) {
    var code = arg.charCodeAt(offset);
    if (code > 0x7F) break;
    mem[ptr + offset] = code;
  }

  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }

    ptr = realloc(ptr, len, len = offset + arg.length * 3);
    var view = getUint8Memory0().subarray(ptr + offset, ptr + len);
    var ret = encodeString(arg, view);
    offset += ret.written;
  }

  WASM_VECTOR_LEN = offset;
  return ptr;
}
/**
* @param {string} name
*/


function welcome(name) {
  var ptr0 = passStringToWasm0(name, _realisr_2_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_malloc, _realisr_2_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_realloc);
  var len0 = WASM_VECTOR_LEN;
  _realisr_2_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.welcome(ptr0, len0);
}
/**
* @param {number} num
* @returns {number}
*/

function divide_by_two(num) {
  var ret = _realisr_2_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.divide_by_two(num);
  return ret;
}
function __wbg_alert_8d43f723b291f1fc(arg0, arg1) {
  alert(getStringFromWasm0(arg0, arg1));
}
;
function __wbindgen_throw(arg0, arg1) {
  throw new Error(getStringFromWasm0(arg0, arg1));
}
;
});

/***/ }),

/***/ "./build/realisr_2_bg.wasm":
/*!*********************************!*\
  !*** ./build/realisr_2_bg.wasm ***!
  \*********************************/
/***/ ((module, exports, __webpack_require__) => {

var __webpack_instantiate__ = ([WEBPACK_IMPORTED_MODULE_0]) => {
	return __webpack_require__.v(exports, module.id, "0bff458d16ea85f09fb3", {
		"./realisr_2_bg.js": {
			"__wbg_alert_8d43f723b291f1fc": WEBPACK_IMPORTED_MODULE_0.__wbg_alert_8d43f723b291f1fc,
			"__wbindgen_throw": WEBPACK_IMPORTED_MODULE_0.__wbindgen_throw
		}
	});
}
__webpack_require__.a(module, (__webpack_handle_async_dependencies__) => {
	/* harmony import */ var WEBPACK_IMPORTED_MODULE_0 = __webpack_require__(/*! ./realisr_2_bg.js */ "./build/realisr_2_bg.js");
	var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([WEBPACK_IMPORTED_MODULE_0]);
	return __webpack_async_dependencies__.then ? __webpack_async_dependencies__.then(__webpack_instantiate__) : __webpack_instantiate__(__webpack_async_dependencies__);
}, 1);

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRfcmVhbGlzcl8yX2pzLmJ1bmRsZS43OTVhYWM1OWEwZGVhNzhlYTcxOC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUVBLElBQU1DLFlBQVksR0FBRyxPQUFPQyxXQUFQLEtBQXVCLFdBQXZCLEdBQXFDLENBQUMsR0FBR0MsTUFBTSxDQUFDQyxPQUFYLEVBQW9CLE1BQXBCLEVBQTRCRixXQUFqRSxHQUErRUEsV0FBcEc7QUFFQSxJQUFJRyxpQkFBaUIsR0FBRyxJQUFJSixZQUFKLENBQWlCLE9BQWpCLEVBQTBCO0FBQUVLLEVBQUFBLFNBQVMsRUFBRSxJQUFiO0FBQW1CQyxFQUFBQSxLQUFLLEVBQUU7QUFBMUIsQ0FBMUIsQ0FBeEI7QUFFQUYsaUJBQWlCLENBQUNHLE1BQWxCO0FBRUEsSUFBSUMsb0JBQW9CLEdBQUcsSUFBM0I7O0FBQ0EsU0FBU0MsZUFBVCxHQUEyQjtBQUN2QixNQUFJRCxvQkFBb0IsS0FBSyxJQUF6QixJQUFpQ0Esb0JBQW9CLENBQUNFLE1BQXJCLEtBQWdDWCw2REFBckUsRUFBeUY7QUFDckZTLElBQUFBLG9CQUFvQixHQUFHLElBQUlJLFVBQUosQ0FBZWIsNkRBQWYsQ0FBdkI7QUFDSDs7QUFDRCxTQUFPUyxvQkFBUDtBQUNIOztBQUVELFNBQVNLLGtCQUFULENBQTRCQyxHQUE1QixFQUFpQ0MsR0FBakMsRUFBc0M7QUFDbEMsU0FBT1gsaUJBQWlCLENBQUNHLE1BQWxCLENBQXlCRSxlQUFlLEdBQUdPLFFBQWxCLENBQTJCRixHQUEzQixFQUFnQ0EsR0FBRyxHQUFHQyxHQUF0QyxDQUF6QixDQUFQO0FBQ0g7QUFDRDtBQUNBOzs7QUFDTyxTQUFTRSxlQUFULEdBQTJCO0FBQzlCbEIsRUFBQUEsK0RBQUE7QUFDSDtBQUVELElBQUltQixlQUFlLEdBQUcsQ0FBdEI7QUFFQSxJQUFNQyxZQUFZLEdBQUcsT0FBT0MsV0FBUCxLQUF1QixXQUF2QixH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akIsRUFBdUI7QUFDMUIsTUFBSUMsSUFBSSxHQUFHWixpQkFBaUIsQ0FBQ1csSUFBRCxFQUFPNUMsaUVBQVAsRUFBK0JBLGtFQUEvQixDQUE1QjtBQUNBLE1BQUlnRCxJQUFJLEdBQUc3QixlQUFYO0FBQ0FuQixFQUFBQSx1REFBQSxDQUFhNkMsSUFBYixFQUFtQkcsSUFBbkI7QUFDSDtBQUVEO0FBQ0E7QUFDQTtBQUNBOztBQUNPLFNBQVNDLGFBQVQsQ0FBdUJDLEdBQXZCLEVBQTRCO0FBQy9CLE1BQUlSLEdBQUcsR0FBRzFDLDZEQUFBLENBQW1Ca0QsR0FBbkIsQ0FBVjtBQUNBLFNBQU9SLEdBQVA7QUFDSDtBQUVNLFNBQVNTLDRCQUFULENBQXNDQyxJQUF0QyxFQUE0Q0MsSUFBNUMsRUFBa0Q7QUFDckRDLEVBQUFBLEtBQUssQ0FBQ3hDLGtCQUFrQixDQUFDc0MsSUFBRCxFQUFPQyxJQUFQLENBQW5CLENBQUw7QUFDSDtBQUFBO0FBRU0sU0FBU0UsZ0JBQVQsQ0FBMEJILElBQTFCLEVBQWdDQyxJQUFoQyxFQUFzQztBQUN6QyxRQUFNLElBQUlHLEtBQUosQ0FBVTFDLGtCQUFrQixDQUFDc0MsSUFBRCxFQUFPQyxJQUFQLENBQTVCLENBQU47QUFDSDtBQUFBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcmVhbGlzci0yLy4vYnVpbGQvcmVhbGlzcl8yLmpzIiwid2VicGFjazovL3JlYWxpc3ItMi8uL2J1aWxkL3JlYWxpc3JfMl9iZy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB3YXNtIGZyb20gXCIuL3JlYWxpc3JfMl9iZy53YXNtXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9yZWFsaXNyXzJfYmcuanNcIjsiLCJpbXBvcnQgKiBhcyB3YXNtIGZyb20gJy4vcmVhbGlzcl8yX2JnLndhc20nO1xuXG5jb25zdCBsVGV4dERlY29kZXIgPSB0eXBlb2YgVGV4dERlY29kZXIgPT09ICd1bmRlZmluZWQnID8gKDAsIG1vZHVsZS5yZXF1aXJlKSgndXRpbCcpLlRleHREZWNvZGVyIDogVGV4dERlY29kZXI7XG5cbmxldCBjYWNoZWRUZXh0RGVjb2RlciA9IG5ldyBsVGV4dERlY29kZXIoJ3V0Zi04JywgeyBpZ25vcmVCT006IHRydWUsIGZhdGFsOiB0cnVlIH0pO1xuXG5jYWNoZWRUZXh0RGVjb2Rlci5kZWNvZGUoKTtcblxubGV0IGNhY2hlZ2V0VWludDhNZW1vcnkwID0gbnVsbDtcbmZ1bmN0aW9uIGdldFVpbnQ4TWVtb3J5MCgpIHtcbiAgICBpZiAoY2FjaGVnZXRVaW50OE1lbW9yeTAgPT09IG51bGwgfHwgY2FjaGVnZXRVaW50OE1lbW9yeTAuYnVmZmVyICE9PSB3YXNtLm1lbW9yeS5idWZmZXIpIHtcbiAgICAgICAgY2FjaGVnZXRVaW50OE1lbW9yeTAgPSBuZXcgVWludDhBcnJheSh3YXNtLm1lbW9yeS5idWZmZXIpO1xuICAgIH1cbiAgICByZXR1cm4gY2FjaGVnZXRVaW50OE1lbW9yeTA7XG59XG5cbmZ1bmN0aW9uIGdldFN0cmluZ0Zyb21XYXNtMChwdHIsIGxlbikge1xuICAgIHJldHVybiBjYWNoZWRUZXh0RGVjb2Rlci5kZWNvZGUoZ2V0VWludDhNZW1vcnkwKCkuc3ViYXJyYXkocHRyLCBwdHIgKyBsZW4pKTtcbn1cbi8qKlxuKi9cbmV4cG9ydCBmdW5jdGlvbiBiaWdfY29tcHV0YXRpb24oKSB7XG4gICAgd2FzbS5iaWdfY29tcHV0YXRpb24oKTtcbn1cblxubGV0IFdBU01fVkVDVE9SX0xFTiA9IDA7XG5cbmNvbnN0IGxUZXh0RW5jb2RlciA9IHR5cGVvZiBUZXh0RW5jb2RlciA9PT0gJ3VuZGVmaW5lZCcgPyAoMCwgbW9kdWxlLnJlcXVpcmUpKCd1dGlsJykuVGV4dEVuY29kZXIgOiBUZXh0RW5jb2RlcjtcblxubGV0IGNhY2hlZFRleHRFbmNvZGVyID0gbmV3IGxUZXh0RW5jb2RlcigndXRmLTgnKTtcblxuY29uc3QgZW5jb2RlU3RyaW5nID0gKHR5cGVvZiBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGVJbnRvID09PSAnZnVuY3Rpb24nXG4gICAgPyBmdW5jdGlvbiAoYXJnLCB2aWV3KSB7XG4gICAgcmV0dXJuIGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZUludG8oYXJnLCB2aWV3KTtcbn1cbiAgICA6IGZ1bmN0aW9uIChhcmcsIHZpZXcpIHtcbiAgICBjb25zdCBidWYgPSBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGUoYXJnKTtcbiAgICB2aWV3LnNldChidWYpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlYWQ6IGFyZy5sZW5ndGgsXG4gICAgICAgIHdyaXR0ZW46IGJ1Zi5sZW5ndGhcbiAgICB9O1xufSk7XG5cbmZ1bmN0aW9uIHBhc3NTdHJpbmdUb1dhc20wKGFyZywgbWFsbG9jLCByZWFsbG9jKSB7XG5cbiAgICBpZiAocmVhbGxvYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IGJ1ZiA9IGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZShhcmcpO1xuICAgICAgICBjb25zdCBwdHIgPSBtYWxsb2MoYnVmLmxlbmd0aCk7XG4gICAgICAgIGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0ciwgcHRyICsgYnVmLmxlbmd0aCkuc2V0KGJ1Zik7XG4gICAgICAgIFdBU01fVkVDVE9SX0xFTiA9IGJ1Zi5sZW5ndGg7XG4gICAgICAgIHJldHVybiBwdHI7XG4gICAgfVxuXG4gICAgbGV0IGxlbiA9IGFyZy5sZW5ndGg7XG4gICAgbGV0IHB0ciA9IG1hbGxvYyhsZW4pO1xuXG4gICAgY29uc3QgbWVtID0gZ2V0VWludDhNZW1vcnkwKCk7XG5cbiAgICBsZXQgb2Zmc2V0ID0gMDtcblxuICAgIGZvciAoOyBvZmZzZXQgPCBsZW47IG9mZnNldCsrKSB7XG4gICAgICAgIGNvbnN0IGNvZGUgPSBhcmcuY2hhckNvZGVBdChvZmZzZXQpO1xuICAgICAgICBpZiAoY29kZSA+IDB4N0YpIGJyZWFrO1xuICAgICAgICBtZW1bcHRyICsgb2Zmc2V0XSA9IGNvZGU7XG4gICAgfVxuXG4gICAgaWYgKG9mZnNldCAhPT0gbGVuKSB7XG4gICAgICAgIGlmIChvZmZzZXQgIT09IDApIHtcbiAgICAgICAgICAgIGFyZyA9IGFyZy5zbGljZShvZmZzZXQpO1xuICAgICAgICB9XG4gICAgICAgIHB0ciA9IHJlYWxsb2MocHRyLCBsZW4sIGxlbiA9IG9mZnNldCArIGFyZy5sZW5ndGggKiAzKTtcbiAgICAgICAgY29uc3QgdmlldyA9IGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0ciArIG9mZnNldCwgcHRyICsgbGVuKTtcbiAgICAgICAgY29uc3QgcmV0ID0gZW5jb2RlU3RyaW5nKGFyZywgdmlldyk7XG5cbiAgICAgICAgb2Zmc2V0ICs9IHJldC53cml0dGVuO1xuICAgIH1cblxuICAgIFdBU01fVkVDVE9SX0xFTiA9IG9mZnNldDtcbiAgICByZXR1cm4gcHRyO1xufVxuLyoqXG4qIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIHdlbGNvbWUobmFtZSkge1xuICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAobmFtZSwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHdhc20ud2VsY29tZShwdHIwLCBsZW4wKTtcbn1cblxuLyoqXG4qIEBwYXJhbSB7bnVtYmVyfSBudW1cbiogQHJldHVybnMge251bWJlcn1cbiovXG5leHBvcnQgZnVuY3Rpb24gZGl2aWRlX2J5X3R3byhudW0pIHtcbiAgICB2YXIgcmV0ID0gd2FzbS5kaXZpZGVfYnlfdHdvKG51bSk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fd2JnX2FsZXJ0XzhkNDNmNzIzYjI5MWYxZmMoYXJnMCwgYXJnMSkge1xuICAgIGFsZXJ0KGdldFN0cmluZ0Zyb21XYXNtMChhcmcwLCBhcmcxKSk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gX193YmluZGdlbl90aHJvdyhhcmcwLCBhcmcxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGdldFN0cmluZ0Zyb21XYXNtMChhcmcwLCBhcmcxKSk7XG59O1xuXG4iXSwibmFtZXMiOlsid2FzbSIsImxUZXh0RGVjb2RlciIsIlRleHREZWNvZGVyIiwibW9kdWxlIiwicmVxdWlyZSIsImNhY2hlZFRleHREZWNvZGVyIiwiaWdub3JlQk9NIiwiZmF0YWwiLCJkZWNvZGUiLCJjYWNoZWdldFVpbnQ4TWVtb3J5MCIsImdldFVpbnQ4TWVtb3J5MCIsImJ1ZmZlciIsIm1lbW9yeSIsIlVpbnQ4QXJyYXkiLCJnZXRTdHJpbmdGcm9tV2FzbTAiLCJwdHIiLCJsZW4iLCJzdWJhcnJheSIsImJpZ19jb21wdXRhdGlvbiIsIldBU01fVkVDVE9SX0xFTiIsImxUZXh0RW5jb2RlciIsIlRleHRFbmNvZGVyIiwiY2FjaGVkVGV4dEVuY29kZXIiLCJlbmNvZGVTdHJpbmciLCJlbmNvZGVJbnRvIiwiYXJnIiwidmlldyIsImJ1ZiIsImVuY29kZSIsInNldCIsInJlYWQiLCJsZW5ndGgiLCJ3cml0dGVuIiwicGFzc1N0cmluZ1RvV2FzbTAiLCJtYWxsb2MiLCJyZWFsbG9jIiwidW5kZWZpbmVkIiwibWVtIiwib2Zmc2V0IiwiY29kZSIsImNoYXJDb2RlQXQiLCJzbGljZSIsInJldCIsIndlbGNvbWUiLCJuYW1lIiwicHRyMCIsIl9fd2JpbmRnZW5fbWFsbG9jIiwiX193YmluZGdlbl9yZWFsbG9jIiwibGVuMCIsImRpdmlkZV9ieV90d28iLCJudW0iLCJfX3diZ19hbGVydF84ZDQzZjcyM2IyOTFmMWZjIiwiYXJnMCIsImFyZzEiLCJhbGVydCIsIl9fd2JpbmRnZW5fdGhyb3ciLCJFcnJvciJdLCJzb3VyY2VSb290IjoiIn0=