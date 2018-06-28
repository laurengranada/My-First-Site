/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */
/* Copyright 2012 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*jshint globalstrict: false */
/* globals PDFJS */

// Initializing PDFJS global object (if still undefined)
if (typeof PDFJS === 'undefined') {
  (typeof window !== 'undefined' ? window : this).PDFJS = {};
}

PDFJS.version = '1.1.114';
PDFJS.build = '3fd44fd';

(function pdfjsWrapper() {
  // Use strict in our context only - users might not want it
  'use strict';

/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */
/* Copyright 2012 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* globals Cmd, ColorSpace, Dict, MozBlobBuilder, Name, PDFJS, Ref, URL,
           Promise */

'use strict';

var globalScope = (typeof window === 'undefined') ? this : window;

var isWorker = (typeof window === 'undefined');

var FONT_IDENTITY_MATRIX = [0.001, 0, 0, 0.001, 0, 0];

var TextRenderingMode = {
  FILL: 0,
  STROKE: 1,
  FILL_STROKE: 2,
  INVISIBLE: 3,
  FILL_ADD_TO_PATH: 4,
  STROKE_ADD_TO_PATH: 5,
  FILL_STROKE_ADD_TO_PATH: 6,
  ADD_TO_PATH: 7,
  FILL_STROKE_MASK: 3,
  ADD_TO_PATH_FLAG: 4
};

var ImageKind = {
  GRAYSCALE_1BPP: 1,
  RGB_24BPP: 2,
  RGBA_32BPP: 3
};

var AnnotationType = {
  WIDGET: 1,
  TEXT: 2,
  LINK: 3
};

var StreamType = {
  UNKNOWN: 0,
  FLATE: 1,
  LZW: 2,
  DCT: 3,
  JPX: 4,
  JBIG: 5,
  A85: 6,
  AHX: 7,
  CCF: 8,
  RL: 9
};

var FontType = {
  UNKNOWN: 0,
  TYPE1: 1,
  TYPE1C: 2,
  CIDFONTTYPE0: 3,
  CIDFONTTYPE0C: 4,
  TRUETYPE: 5,
  CIDFONTTYPE2: 6,
  TYPE3: 7,
  OPENTYPE: 8,
  TYPE0: 9,
  MMTYPE1: 10
};

// The global PDFJS object exposes the API
// In production, it will be declared outside a global wrapper
// In development, it will be declared here
if (!globalScope.PDFJS) {
  globalScope.PDFJS = {};
}

globalScope.PDFJS.pdfBug = false;

PDFJS.VERBOSITY_LEVELS = {
  errors: 0,
  warnings: 1,
  infos: 5
};

// All the possible operations for an operator list.
var OPS = PDFJS.OPS = {
  // Intentionally start from 1 so it is easy to spot bad operators that will be
  // 0's.
  dependency: 1,
  setLineWidth: 2,
  setLineCap: 3,
  setLineJoin: 4,
  setMiterLimit: 5,
  setDash: 6,
  setRenderingIntent: 7,
  setFlatness: 8,
  setGState: 9,
  save: 10,
  restore: 11,
  transform: 12,
  moveTo: 13,
  lineTo: 14,
  curveTo: 15,
  curveTo2: 16,
  curveTo3: 17,
  closePath: 18,
  rectangle: 19,
  stroke: 20,
  closeStroke: 21,
  fill: 22,
  eoFill: 23,
  fillStroke: 24,
  eoFillStroke: 25,
  closeFillStroke: 26,
  closeEOFillStroke: 27,
  endPath: 28,
  clip: 29,
  eoClip: 30,
  beginText: 31,
  endText: 32,
  setCharSpacing: 33,
  setWordSpacing: 34,
  setHScale: 35,
  setLeading: 36,
  setFont: 37,
  setTextRenderingMode: 38,
  setTextRise: 39,
  moveText: 40,
  setLeadingMoveText: 41,
  setTextMatrix: 42,
  nextLine: 43,
  showText: 44,
  showSpacedText: 45,
  nextLineShowText: 46,
  nextLineSetSpacingShowText: 47,
  setCharWidth: 48,
  setCharWidthAndBounds: 49,
  setStrokeColorSpace: 50,
  setFillColorSpace: 51,
  setStrokeColor: 52,
  setStrokeColorN: 53,
  setFillColor: 54,
  setFillColorN: 55,
  setStrokeGray: 56,
  setFillGray: 57,
  setStrokeRGBColor: 58,
  setFillRGBColor: 59,
  setStrokeCMYKColor: 60,
  setFillCMYKColor: 61,
  shadingFill: 62,
  beginInlineImage: 63,
  beginImageData: 64,
  endInlineImage: 65,
  paintXObject: 66,
  markPoint: 67,
  markPointProps: 68,
  beginMarkedContent: 69,
  beginMarkedContentProps: 70,
  endMarkedContent: 71,
  beginCompat: 72,
  endCompat: 73,
  paintFormXObjectBegin: 74,
  paintFormXObjectEnd: 75,
  beginGroup: 76,
  endGroup: 77,
  beginAnnotations: 78,
  endAnnotations: 79,
  beginAnnotation: 80,
  endAnnotation: 81,
  paintJpegXObject: 82,
  paintImageMaskXObject: 83,
  paintImageMaskXObjectGroup: 84,
  paintImageXObject: 85,
  paintInlineImageXObject: 86,
  paintInlineImageXObjectGroup: 87,
  paintImageXObjectRepeat: 88,
  paintImageMaskXObjectRepeat: 89,
  paintSolidColorImageMask: 90,
  constructPath: 91
};

// A notice for devs. These are good for things that are helpful to devs, such
// as warning that Workers were disabled, which is important to devs but not
// end users.
function info(msg) {
  if (PDFJS.verbosity >= PDFJS.VERBOSITY_LEVELS.infos) {
    console.log('Info: ' + msg);
  }
}

// Non-fatal warnings.
function warn(msg) {
  if (PDFJS.verbosity >= PDFJS.VERBOSITY_LEVELS.warnings) {
    console.log('Warning: ' + msg);
  }
}

// Fatal errors that should trigger the fallback UI and halt execution by
// throwing an exception.
function error(msg) {
  if (PDFJS.verbosity >= PDFJS.VERBOSITY_LEVELS.errors) {
    console.log('Error: ' + msg);
    console.log(backtrace());
  }
  UnsupportedManager.notify(UNSUPPORTED_FEATURES.unknown);
  throw new Error(msg);
}

function backtrace() {
  try {
    throw new Error();
  } catch (e) {
    return e.stack ? e.stack.split('\n').slice(2).join('\n') : '';
  }
}

function assert(cond, msg) {
  if (!cond) {
    error(msg);
  }
}

var UNSUPPORTED_FEATURES = PDFJS.UNSUPPORTED_FEATURES = {
  unknown: 'unknown',
  forms: 'forms',
  javaScript: 'javaScript',
  smask: 'smask',
  shadingPattern: 'shadingPattern',
  font: 'font'
};

var UnsupportedManager = PDFJS.UnsupportedManager =
  (function UnsupportedManagerClosure() {
  var listeners = [];
  return {
    listen: function (cb) {
      listeners.push(cb);
    },
    notify: function (featureId) {
      warn('Unsupported feature "' + featureId + '"');
      for (var i = 0, ii = listeners.length; i < ii; i++) {
        listeners[i](featureId);
      }
    }
  };
})();

// Combines two URLs. The baseUrl shall be absolute URL. If the url is an
// absolute URL, it will be returned as is.
function combineUrl(baseUrl, url) {
  if (!url) {
    return baseUrl;
  }
  if (/^[a-z][a-z0-9+\-.]*:/i.test(url)) {
    return url;
  }
  var i;
  if (url.charAt(0) === '/') {
    // absolute path
    i = baseUrl.indexOf('://');
    if (url.charAt(1) === '/') {
      ++i;
    } else {
      i = baseUrl.indexOf('/', i + 3);
    }
    return baseUrl.substring(0, i) + url;
  } else {
    // relative path
    var pathLength = baseUrl.length;
    i = baseUrl.lastIndexOf('#');
    pathLength = i >= 0 ? i : pathLength;
    i = baseUrl.lastIndexOf('?', pathLength);
    pathLength = i >= 0 ? i : pathLength;
    var prefixLength = baseUrl.lastIndexOf('/', pathLength);
    return baseUrl.substring(0, prefixLength + 1) + url;
  }
}

// Validates if URL is safe and allowed, e.g. to avoid XSS.
function isValidUrl(url, allowRelative) {
  if (!url) {
    return false;
  }
  // RFC 3986 (http://tools.ietf.org/html/rfc3986#section-3.1)
  // scheme = ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )
  var protocol = /^[a-z][a-z0-9+\-.]*(?=:)/i.exec(url);
  if (!protocol) {
    return allowRelative;
  }
  protocol = protocol[0].toLowerCase();
  switch (protocol) {
    case 'http':
    case 'https':
    case 'ftp':
    case 'mailto':
    case 'tel':
      return true;
    default:
      return false;
  }
}
PDFJS.isValidUrl = isValidUrl;

function shadow(obj, prop, value) {
  Object.defineProperty(obj, prop, { value: value,
                                     enumerable: true,
                                     configurable: true,
                                     writable: false });
  return value;
}
PDFJS.shadow = shadow;

var PasswordResponses = PDFJS.PasswordResponses = {
  NEED_PASSWORD: 1,
  INCORRECT_PASSWORD: 2
};

var PasswordException = (function PasswordExceptionClosure() {
  function PasswordException(msg, code) {
    this.name = 'PasswordException';
    this.message = msg;
    this.code = code;
  }

  PasswordException.prototype = new Error();
  PasswordException.constructor = PasswordException;

  return PasswordException;
})();
PDFJS.PasswordException = PasswordException;

var UnknownErrorException = (function UnknownErrorExceptionClosure() {
  function UnknownErrorException(msg, details) {
    this.name = 'UnknownErrorException';
    this.message = msg;
    this.details = details;
  }

  UnknownErrorException.prototype = new Error();
  UnknownErrorException.constructor = UnknownErrorException;

  return UnknownErrorException;
})();
PDFJS.UnknownErrorException = UnknownErrorException;

var InvalidPDFException = (function InvalidPDFExceptionClosure() {
  function InvalidPDFException(msg) {
    this.name = 'InvalidPDFException';
    this.message = msg;
  }

  InvalidPDFException.prototype = new Error();
  InvalidPDFException.constructor = InvalidPDFException;

  return InvalidPDFException;
})();
PDFJS.InvalidPDFException = InvalidPDFException;

var MissingPDFException = (function MissingPDFExceptionClosure() {
  function MissingPDFException(msg) {
    this.name = 'MissingPDFException';
    this.message = msg;
  }

  MissingPDFException.prototype = new Error();
  MissingPDFException.constructor = MissingPDFException;

  return MissingPDFException;
})();
PDFJS.MissingPDFException = MissingPDFException;

var UnexpectedResponseException =
    (function UnexpectedResponseExceptionClosure() {
  function UnexpectedResponseException(msg, status) {
    this.name = 'UnexpectedResponseException';
    this.message = msg;
    this.status = status;
  }

  UnexpectedResponseException.prototype = new Error();
  UnexpectedResponseException.constructor = UnexpectedResponseException;

  return UnexpectedResponseException;
})();
PDFJS.UnexpectedResponseException = UnexpectedResponseException;

var NotImplementedException = (function NotImplementedExceptionClosure() {
  function NotImplementedException(msg) {
    this.message = msg;
  }

  NotImplementedException.prototype = new Error();
  NotImplementedException.prototype.name = 'NotImplementedException';
  NotImplementedException.constructor = NotImplementedException;

  return NotImplementedException;
})();

var MissingDataException = (function MissingDataExceptionClosure() {
  function MissingDataException(begin, end) {
    this.begin = begin;
    this.end = end;
    this.message = 'Missing data [' + begin + ', ' + end + ')';
  }

  MissingDataException.prototype = new Error();
  MissingDataException.prototype.name = 'MissingDataException';
  MissingDataException.constructor = MissingDataException;

  return MissingDataException;
})();

var XRefParseException = (function XRefParseExceptionClosure() {
  function XRefParseException(msg) {
    this.message = msg;
  }

  XRefParseException.prototype = new Error();
  XRefParseException.prototype.name = 'XRefParseException';
  XRefParseException.constructor = XRefParseException;

  return XRefParseException;
})();


function bytesToString(bytes) {
  assert(bytes !== null && typeof bytes === 'object' &&
         bytes.length !== undefined, 'Invalid argument for bytesToString');
  var length = bytes.length;
  var MAX_ARGUMENT_COUNT = 8192;
  if (length < MAX_ARGUMENT_COUNT) {
    return String.fromCharCode.apply(null, bytes);
  }
  var strBuf = [];
  for (var i = 0; i < length; i += MAX_ARGUMENT_COUNT) {
    var chunkEnd = Math.min(i + MAX_ARGUMENT_COUNT, length);
    var chunk = bytes.subarray(i, chunkEnd);
    strBuf.push(String.fromCharCode.apply(null, chunk));
  }
  return strBuf.join('');
}

function stringToBytes(str) {
  assert(typeof str === 'string', 'Invalid argument for stringToBytes');
  var length = str.length;
  var bytes = new Uint8Array(length);
  for (var i = 0; i < length; ++i) {
    bytes[i] = str.charCodeAt(i) & 0xFF;
  }
  return bytes;
}

function string32(value) {
  return String.fromCharCode((value >> 24) & 0xff, (value >> 16) & 0xff,
                             (value >> 8) & 0xff, value & 0xff);
}

function log2(x) {
  var n = 1, i = 0;
  while (x > n) {
    n <<= 1;
    i++;
  }
  return i;
}

function readInt8(data, start) {
  return (data[start] << 24) >> 24;
}

function readUint16(data, offset) {
  return (data[offset] << 8) | data[offset + 1];
}

function readUint32(data, offset) {
  return ((data[offset] << 24) | (data[offset + 1] << 16) |
         (data[offset + 2] << 8) | data[offset + 3]) >>> 0;
}

// Lazy test the endianness of the platform
// NOTE: This will be 'true' for simulated TypedArrays
function isLittleEndian() {
  var buffer8 = new Uint8Array(2);
  buffer8[0] = 1;
  var buffer16 = new Uint16Array(buffer8.buffer);
  return (buffer16[0] === 1);
}

Object.defineProperty(PDFJS, 'isLittleEndian', {
  configurable: true,
  get: function PDFJS_isLittleEndian() {
    return shadow(PDFJS, 'isLittleEndian', isLittleEndian());
  }
});

//#if !(FIREFOX || MOZCENTRAL || B2G || CHROME)
//// Lazy test if the userAgant support CanvasTypedArrays
function hasCanvasTypedArrays() {
  var canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  var ctx = canvas.getContext('2d');
  var imageData = ctx.createImageData(1, 1);
  return (typeof imageData.data.buffer !== 'undefined');
}

Object.defineProperty(PDFJS, 'hasCanvasTypedArrays', {
  configurable: true,
  get: function PDFJS_hasCanvasTypedArrays() {
    return shadow(PDFJS, 'hasCanvasTypedArrays', hasCanvasTypedArrays());
  }
});

var Uint32ArrayView = (function Uint32ArrayViewClosure() {

  function Uint32ArrayView(buffer, length) {
    this.buffer = buffer;
    this.byteLength = buffer.length;
    this.length = length === undefined ? (this.byteLength >> 2) : length;
    ensureUint32ArrayViewProps(this.length);
  }
  Uint32ArrayView.prototype = Object.create(null);

  var uint32ArrayViewSetters = 0;
  function createUint32ArrayProp(index) {
    return {
      get: function () {
        var buffer = this.buffer, offset = index << 2;
        return (buffer[offset] | (buffer[offset + 1] << 8) |
          (buffer[offset + 2] << 16) | (buffer[offset + 3] << 24)) >>> 0;
      },
      set: function (value) {
        var buffer = this.buffer, offset = index << 2;
        buffer[offset] = value & 255;
        buffer[offset + 1] = (value >> 8) & 255;
        buffer[offset + 2] = (value >> 16) & 255;
        buffer[offset + 3] = (value >>> 24) & 255;
      }
    };
  }

  function ensureUint32ArrayViewProps(length) {
    while (uint32ArrayViewSetters < length) {
      Object.defineProperty(Uint32ArrayView.prototype,
        uint32ArrayViewSetters,
        createUint32ArrayProp(uint32ArrayViewSetters));
      uint32ArrayViewSetters++;
    }
  }

  return Uint32ArrayView;
})();
//#else
//PDFJS.hasCanvasTypedArrays = true;
//#endif

var IDENTITY_MATRIX = [1, 0, 0, 1, 0, 0];

var Util = PDFJS.Util = (function UtilClosure() {
  function Util() {}

  var rgbBuf = ['rgb(', 0, ',', 0, ',', 0, ')'];

  // makeCssRgb() can be called thousands of times. Using |rgbBuf| avoids
  // creating many intermediate strings.
  Util.makeCssRgb = function Util_makeCssRgb(r, g, b) {
    rgbBuf[1] = r;
    rgbBuf[3] = g;
    rgbBuf[5] = b;
    return rgbBuf.join('');
  };

  // Concatenates two transformation matrices together and returns the result.
  Util.transform = function Util_transform(m1, m2) {
    return [
      m1[0] * m2[0] + m1[2] * m2[1],
      m1[1] * m2[0] + m1[3] * m2[1],
      m1[0] * m2[2] + m1[2] * m2[3],
      m1[1] * m2[2] + m1[3] * m2[3],
      m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
      m1[1] * m2[4] + m1[3] * m2[5] + m1[5]
    ];
  };

  // For 2d affine transforms
  Util.applyTransform = function Util_applyTransform(p, m) {
    var xt = p[0] * m[0] + p[1] * m[2] + m[4];
    var yt = p[0] * m[1] + p[1] * m[3] + m[5];
    return [xt, yt];
  };

  Util.applyInverseTransform = function Util_applyInverseTransform(p, m) {
    var d = m[0] * m[3] - m[1] * m[2];
    var xt = (p[0] * m[3] - p[1] * m[2] + m[2] * m[5] - m[4] * m[3]) / d;
    var yt = (-p[0] * m[1] + p[1] * m[0] + m[4] * m[1] - m[5] * m[0]) / d;
    return [xt, yt];
  };

  // Applies the transform to the rectangle and finds the minimum axially
  // aligned bounding box.
  Util.getAxialAlignedBoundingBox =
    function Util_getAxialAlignedBoundingBox(r, m) {

    var p1 = Util.applyTransform(r, m);
    var p2 = Util.applyTransform(r.slice(2, 4), m);
    var p3 = Util.applyTransform([r[0], r[3]], m);
    var p4 = Util.applyTransform([r[2], r[1]], m);
    return [
      Math.min(p1[0], p2[0], p3[0], p4[0]),
      Math.min(p1[1], p2[1], p3[1], p4[1]),
      Math.max(p1[0], p2[0], p3[0], p4[0]),
      Math.max(p1[1], p2[1], p3[1], p4[1])
    ];
  };

  Util.inverseTransform = function Util_inverseTransform(m) {
    var d = m[0] * m[3] - m[1] * m[2];
    return [m[3] / d, -m[1] / d, -m[2] / d, m[0] / d,
      (m[2] * m[5] - m[4] * m[3]) / d, (m[4] * m[1] - m[5] * m[0]) / d];
  };

  // Apply a generic 3d matrix M on a 3-vector v:
  //   | a b c |   | X |
  //   | d e f | x | Y |
  //   | g h i |   | Z |
  // M is assumed to be serialized as [a,b,c,d,e,f,g,h,i],
  // with v as [X,Y,Z]
  Util.apply3dTransform = function Util_apply3dTransform(m, v) {
    return [
      m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
      m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
      m[6] * v[0] + m[7] * v[1] + m[8] * v[2]
    ];
  };

  // This calculation uses Singular Value Decomposition.
  // The SVD can be represented with formula A = USV. We are interested in the
  // matrix S here because it represents the scale values.
  Util.singularValueDecompose2dScale =
    function Util_singularValueDecompose2dScale(m) {

    var transpose = [m[0], m[2], m[1], m[3]];

    // Multiply matrix m with its transpose.
    var a = m[0] * transpose[0] + m[1] * transpose[2];
    var b = m[0] * transpose[1] + m[1] * transpose[3];
    var c = m[2] * transpose[0] + m[3] * transpose[2];
    var d = m[2] * transpose[1] + m[3] * transpose[3];

    // Solve the second degree polynomial to get roots.
    var first = (a + d) / 2;
    var second = Math.sqrt((a + d) * (a + d) - 4 * (a * d - c * b)) / 2;
    var sx = first + second || 1;
    var sy = first - second || 1;

    // Scale values are the square roots of the eigenvalues.
    return [Math.sqrt(sx), Math.sqrt(sy)];
  };

  // Normalize rectangle rect=[x1, y1, x2, y2] so that (x1,y1) < (x2,y2)
  // For coordinate systems whose origin lies in the bottom-left, this
  // means normalization to (BL,TR) ordering. For systems with origin in the
  // top-left, this means (TL,BR) ordering.
  Util.normalizeRect = function Util_normalizeRect(rect) {
    var r = rect.slice(0); // clone rect
    if (rect[0] > rect[2]) {
      r[0] = rect[2];
      r[2] = rect[0];
    }
    if (rect[1] > rect[3]) {
      r[1] = rect[3];
      r[3] = rect[1];
    }
    return r;
  };

  // Returns a rectangle [x1, y1, x2, y2] corresponding to the
  // intersection of rect1 and rect2. If no intersection, returns 'false'
  // The rectangle coordinates of rect1, rect2 should be [x1, y1, x2, y2]
  Util.intersect = function Util_intersect(rect1, rect2) {
    function compare(a, b) {
      return a - b;
    }

    // Order points along the axes
    var orderedX = [rect1[0], rect1[2], rect2[0], rect2[2]].sort(compare),
        orderedY = [rect1[1], rect1[3], rect2[1], rect2[3]].sort(compare),
        result = [];

    rect1 = Util.normalizeRect(rect1);
    rect2 = Util.normalizeRect(rect2);

    // X: first and second points belong to different rectangles?
    if ((orderedX[0] === rect1[0] && orderedX[1] === rect2[0]) ||
        (orderedX[0] === rect2[0] && orderedX[1] === rect1[0])) {
      // Intersection must be between second and third points
      result[0] = orderedX[1];
      result[2] = orderedX[2];
    } else {
      return false;
    }

    // Y: first and second points belong to different rectangles?
    if ((orderedY[0] === rect1[1] && orderedY[1] === rect2[1]) ||
        (orderedY[0] === rect2[1] && orderedY[1] === rect1[1])) {
      // Intersection must be between second and third points
      result[1] = orderedY[1];
      result[3] = orderedY[2];
    } else {
      return false;
    }

    return result;
  };

  Util.sign = function Util_sign(num) {
    return num < 0 ? -1 : 1;
  };

  Util.appendToArray = function Util_appendToArray(arr1, arr2) {
    Array.prototype.push.apply(arr1, arr2);
  };

  Util.prependToArray = function Util_prependToArray(arr1, arr2) {
    Array.prototype.unshift.apply(arr1, arr2);
  };

  Util.extendObj = function extendObj(obj1, obj2) {
    for (var key in obj2) {
      obj1[key] = obj2[key];
    }
  };

  Util.getInheritableProperty = function Util_getInheritableProperty(dict,
                                                                     name) {
    while (dict && !dict.has(name)) {
      dict = dict.get('Parent');
    }
    if (!dict) {
      return null;
    }
    return dict.get(name);
  };

  Util.inherit = function Util_inherit(sub, base, prototype) {
    sub.prototype = Object.create(base.prototype);
    sub.prototype.constructor = sub;
    for (var prop in prototype) {
      sub.prototype[prop] = prototype[prop];
    }
  };

  Util.loadScript = function Util_loadScript(src, callback) {
    var script = document.createElement('script');
    var loaded = false;
    script.setAttribute('src', src);
    if (callback) {
      script.onload = function() {
        if (!loaded) {
          callback();
        }
        loaded = true;
      };
    }
    document.getElementsByTagName('head')[0].appendChild(script);
  };

  return Util;
})();

/**
 * PDF page viewport created based on scale, rotation and offset.
 * @class
 * @alias PDFJS.PageViewport
 */
var PageViewport = PDFJS.PageViewport = (function PageViewportClosure() {
  /**
   * @constructor
   * @private
   * @param viewBox {Array} xMin, yMin, xMax and yMax coordinates.
   * @param scale {number} scale of the viewport.
   * @param rotation {number} rotations of the viewport in degrees.
   * @param offsetX {number} offset X
   * @param offsetY {number} offset Y
   * @param dontFlip {boolean} if true, axis Y will not be flipped.
   */
  function PageViewport(viewBox, scale, rotation, offsetX, offsetY, dontFlip) {
    this.viewBox = viewBox;
    this.scale = scale;
    this.rotation = rotation;
    this.offsetX = offsetX;
    this.offsetY = offsetY;

    // creating transform to convert pdf coordinate system to the normal
    // canvas like coordinates taking in account scale and rotation
    var centerX = (viewBox[2] + viewBox[0]) / 2;
    var centerY = (viewBox[3] + viewBox[1]) / 2;
    var rotateA, rotateB, rotateC, rotateD;
    rotation = rotation % 360;
    rotation = rotation < 0 ? rotation + 360 : rotation;
    switch (rotation) {
      case 180:
        rotateA = -1; rotateB = 0; rotateC = 0; rotateD = 1;
        break;
      case 90:
        rotateA = 0; rotateB = 1; rotateC = 1; rotateD = 0;
        break;
      case 270:
        rotateA = 0; rotateB = -1; rotateC = -1; rotateD = 0;
        break;
      //case 0:
      default:
        rotateA = 1; rotateB = 0; rotateC = 0; rotateD = -1;
        break;
    }

    if (dontFlip) {
      rotateC = -rotateC; rotateD = -rotateD;
    }

    var offsetCanvasX, offsetCanvasY;
    var width, height;
    if (rotateA === 0) {
      offsetCanvasX = Math.abs(centerY - viewBox[1]) * scale + offsetX;
      offsetCanvasY = Math.abs(centerX - viewBox[0]) * scale + offsetY;
      width = Math.abs(viewBox[3] - viewBox[1]) * scale;
      height = Math.abs(viewBox[2] - viewBox[0]) * scale;
    } else {
      offsetCanvasX = Math.abs(centerX - viewBox[0]) * scale + offsetX;
      offsetCanvasY = Math.abs(centerY - viewBox[1]) * scale + offsetY;
      width = Math.abs(viewBox[2] - viewBox[0]) * scale;
      height = Math.abs(viewBox[3] - viewBox[1]) * scale;
    }
    // creating transform for the following operations:
    // translate(-centerX, -centerY), rotate and flip vertically,
    // scale, and translate(offsetCanvasX, offsetCanvasY)
    this.transform = [
      rotateA * scale,
      rotateB * scale,
      rotateC * scale,
      rotateD * scale,
      offsetCanvasX - rotateA * scale * centerX - rotateC * scale * centerY,
      offsetCanvasY - rotateB * scale * centerX - rotateD * scale * centerY
    ];

    this.width = width;
    this.height = height;
    this.fontScale = scale;
  }
  PageViewport.prototype = /** @lends PDFJS.PageViewport.prototype */ {
    /**
     * Clones viewport with additional properties.
     * @param args {Object} (optional) If specified, may contain the 'scale' or
     * 'rotation' properties to override the corresponding properties in
     * the cloned viewport.
     * @returns {PDFJS.PageViewport} Cloned viewport.
     */
    clone: function PageViewPort_clone(args) {
      args = args || {};
      var scale = 'scale' in args ? args.scale : this.scale;
      var rotation = 'rotation' in args ? args.rotation : this.rotation;
      return new PageViewport(this.viewBox.slice(), scale, rotation,
                              this.offsetX, this.offsetY, args.dontFlip);
    },
    /**
     * Converts PDF point to the viewport coordinates. For examples, useful for
     * converting PDF location into canvas pixel coordinates.
     * @param x {number} X coordinate.
     * @param y {number} Y coordinate.
     * @returns {Object} Object that contains 'x' and 'y' properties of the
     * point in the viewport coordinate space.
     * @see {@link convertToPdfPoint}
     * @see {@link convertToViewportRectangle}
     */
    convertToViewportPoint: function PageViewport_convertToViewportPoint(x, y) {
      return Util.applyTransform([x, y], this.transform);
    },
    /**
     * Converts PDF rectangle to the viewport coordinates.
     * @param rect {Array} xMin, yMin, xMax and yMax coordinates.
     * @returns {Array} Contains corresponding coordinates of the rectangle
     * in the viewport coordinate space.
     * @see {@link convertToViewportPoint}
     */
    convertToViewportRectangle:
      function PageViewport_convertToViewportRectangle(rect) {
      var tl = Util.applyTransform([rect[0], rect[1]], this.transform);
      var br = Util.applyTransform([rect[2], rect[3]], this.transform);
      return [tl[0], tl[1], br[0], br[1]];
    },
    /**
     * Converts viewport coordinates to the PDF location. For examples, useful
     * for converting canvas pixel location into PDF one.
     * @param x {number} X coordinate.
     * @param y {number} Y coordinate.
     * @returns {Object} Object that contains 'x' and 'y' properties of the
     * point in the PDF coordinate space.
     * @see {@link convertToViewportPoint}
     */
    convertToPdfPoint: function PageViewport_convertToPdfPoint(x, y) {
      return Util.applyInverseTransform([x, y], this.transform);
    }
  };
  return PageViewport;
})();

var PDFStringTranslateTable = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0x2D8, 0x2C7, 0x2C6, 0x2D9, 0x2DD, 0x2DB, 0x2DA, 0x2DC, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x2022, 0x2020, 0x2021, 0x2026, 0x2014,
  0x2013, 0x192, 0x2044, 0x2039, 0x203A, 0x2212, 0x2030, 0x201E, 0x201C,
  0x201D, 0x2018, 0x2019, 0x201A, 0x2122, 0xFB01, 0xFB02, 0x141, 0x152, 0x160,
  0x178, 0x17D, 0x131, 0x142, 0x153, 0x161, 0x17E, 0, 0x20AC
];

function stringToPDFString(str) {
  var i, n = str.length, strBuf = [];
  if (str[0] === '\xFE' && str[1] === '\xFF') {
    // UTF16BE BOM
    for (i = 2; i < n; i += 2) {
      strBuf.push(String.fromCharCode(
        (str.charCodeAt(i) << 8) | str.charCodeAt(i + 1)));
    }
  } else {
    for (i = 0; i < n; ++i) {
      var code = PDFStringTranslateTable[str.charCodeAt(i)];
      strBuf.push(code ? String.fromCharCode(code) : str.charAt(i));
    }
  }
  return strBuf.join('');
}

function stringToUTF8String(str) {
  return decodeURIComponent(escape(str));
}

function isEmptyObj(obj) {
  for (var key in obj) {
    return false;
  }
  return true;
}

function isBool(v) {
  return typeof v === 'boolean';
}

function isInt(v) {
  return typeof v === 'number' && ((v | 0) === v);
}

function isNum(v) {
  return typeof v === 'number';
}

function isString(v) {
  return typeof v === 'string';
}

function isName(v) {
  return v instanceof Name;
}

function isCmd(v, cmd) {
  return v instanceof Cmd && (cmd === undefined || v.cmd === cmd);
}

function isDict(v, type) {
  if (!(v instanceof Dict)) {
    return false;
  }
  if (!type) {
    return true;
  }
  var dictType = v.get('Type');
  return isName(dictType) && dictType.name === type;
}

function isArray(v) {
  return v instanceof Array;
}

function isStream(v) {
  return typeof v === 'object' && v !== null && v.getBytes !== undefined;
}

function isArrayBuffer(v) {
  return typeof v === 'object' && v !== null && v.byteLength !== undefined;
}

function isRef(v) {
  return v instanceof Ref;
}

/**
 * Promise Capability object.
 *
 * @typedef {Object} PromiseCapability
 * @property {Promise} promise - A promise object.
 * @property {function} resolve - Fullfills the promise.
 * @property {function} reject - Rejects the promise.
 */

/**
 * Creates a promise capability object.
 * @alias PDFJS.createPromiseCapability
 *
 * @return {PromiseCapability} A capability object contains:
 * - a Promise, resolve and reject methods.
 */
function createPromiseCapability() {
  var capability = {};
  capability.promise = new Promise(function (resolve, reject) {
    capability.resolve = resolve;
    capability.reject = reject;
  });
  return capability;
}

PDFJS.createPromiseCapability = createPromiseCapability;

/**
 * Polyfill for Promises:
 * The following promise implementation tries to generally implement the
 * Promise/A+ spec. Some notable differences from other promise libaries are:
 * - There currently isn't a seperate deferred and promise object.
 * - Unhandled rejections eventually show an error if they aren't handled.
 *
 * Based off of the work in:
 * https://bugzilla.mozilla.org/show_bug.cgi?id=810490
 */
(function PromiseClosure() {
  if (globalScope.Promise) {
    // Promises existing in the DOM/Worker, checking presence of all/resolve
    if (typeof globalScope.Promise.all !== 'function') {
      globalScope.Promise.all = function (iterable) {
        var count = 0, results = [], resolve, reject;
        var promise = new globalScope.Promise(function (resolve_, reject_) {
          resolve = resolve_;
          reject = reject_;
        });
        iterable.forEach(function (p, i) {
          count++;
          p.then(function (result) {
            results[i] = result;
            count--;
            if (count === 0) {
              resolve(results);
            }
          }, reject);
        });
        if (count === 0) {
          resolve(results);
        }
        return promise;
      };
    }
    if (typeof globalScope.Promise.resolve !== 'function') {
      globalScope.Promise.resolve = function (value) {
        return new globalScope.Promise(function (resolve) { resolve(value); });
      };
    }
    if (typeof globalScope.Promise.reject !== 'function') {
      globalScope.Promise.reject = function (reason) {
        return new globalScope.Promise(function (resolve, reject) {
          reject(reason);
        });
      };
    }
    if (typeof globalScope.Promise.prototype.catch !== 'function') {
      globalScope.Promise.prototype.catch = function (onReject) {
        return globalScope.Promise.prototype.then(undefined, onReject);
      };
    }
    return;
  }
//#if !MOZCENTRAL
  var STATUS_PENDING = 0;
  var STATUS_RESOLVED = 1;
  var STATUS_REJECTED = 2;

  // In an attempt to avoid silent exceptions, unhandled rejections are
  // tracked and if they aren't handled in a certain amount of time an
  // error is logged.
  var REJECTION_TIMEOUT = 500;

  var HandlerManager = {
    handlers: [],
    running: false,
    unhandledRejections: [],
    pendingRejectionCheck: false,

    scheduleHandlers: function scheduleHandlers(promise) {
      if (promise._status === STATUS_PENDING) {
        return;
      }

      this.handlers = this.handlers.concat(promise._handlers);
      promise._handlers = [];

      if (this.running) {
        return;
      }
      this.running = true;

      setTimeout(this.runHandlers.bind(this), 0);
    },

    runHandlers: function runHandlers() {
      var RUN_TIMEOUT = 1; // ms
      var timeoutAt = Date.now() + RUN_TIMEOUT;
      while (this.handlers.length > 0) {
        var handler = this.handlers.shift();

        var nextStatus = handler.thisPromise._status;
        var nextValue = handler.thisPromise._value;

        try {
          if (nextStatus === STATUS_RESOLVED) {
            if (typeof handler.onResolve === 'function') {
              nextValue = handler.onResolve(nextValue);
            }
          } else if (typeof handler.onReject === 'function') {
              nextValue = handler.onReject(nextValue);
              nextStatus = STATUS_RESOLVED;

              if (handler.thisPromise._unhandledRejection) {
                this.removeUnhandeledRejection(handler.thisPromise);
              }
          }
        } catch (ex) {
          nextStatus = STATUS_REJECTED;
          nextValue = ex;
        }

        handler.nextPromise._updateStatus(nextStatus, nextValue);
        if (Date.now() >= timeoutAt) {
          break;
        }
      }

      if (this.handlers.length > 0) {
        setTimeout(this.runHandlers.bind(this), 0);
        return;
      }

      this.running = false;
    },

    addUnhandledRejection: function addUnhandledRejection(promise) {
      this.unhandledRejections.push({
        promise: promise,
        time: Date.now()
      });
      this.scheduleRejectionCheck();
    },

    removeUnhandeledRejection: function removeUnhandeledRejection(promise) {
      promise._unhandledRejection = false;
      for (var i = 0; i < this.unhandledRejections.length; i++) {
        if (this.unhandledRejections[i].promise === promise) {
          this.unhandledRejections.splice(i);
          i--;
        }
      }
    },

    scheduleRejectionCheck: function scheduleRejectionCheck() {
      if (this.pendingRejectionCheck) {
        return;
      }
      this.pendingRejectionCheck = true;
      setTimeout(function rejectionCheck() {
        this.pendingRejectionCheck = false;
        var now = Date.now();
        for (var i = 0; i < this.unhandledRejections.length; i++) {
          if (now - this.unhandledRejections[i].time > REJECTION_TIMEOUT) {
            var unhandled = this.unhandledRejections[i].promise._value;
            var msg = 'Unhandled rejection: ' + unhandled;
            if (unhandled.stack) {
              msg += '\n' + unhandled.stack;
            }
            warn(msg);
            this.unhandledRejections.splice(i);
            i--;
          }
        }
        if (this.unhandledRejections.length) {
          this.scheduleRejectionCheck();
        }
      }.bind(this), REJECTION_TIMEOUT);
    }
  };

  function Promise(resolver) {
    this._status = STATUS_PENDING;
    this._handlers = [];
    try {
      resolver.call(this, this._resolve.bind(this), this._reject.bind(this));
    } catch (e) {
      this._reject(e);
    }
  }
  /**
   * Builds a promise that is resolved when all the passed in promises are
   * resolved.
   * @param {array} array of data and/or promises to wait for.
   * @return {Promise} New dependant promise.
   */
  Promise.all = function Promise_all(promises) {
    var resolveAll, rejectAll;
    var deferred = new Promise(function (resolve, reject) {
      resolveAll = resolve;
      rejectAll = reject;
    });
    var unresolved = promises.length;
    var results = [];
    if (unresolved === 0) {
      resolveAll(results);
      return deferred;
    }
    function reject(reason) {
      if (deferred._status === STATUS_REJECTED) {
        return;
      }
      results = [];
      rejectAll(reason);
    }
    for (var i = 0, ii = promises.length; i < ii; ++i) {
      var promise = promises[i];
      var resolve = (function(i) {
        return function(value) {
          if (deferred._status === STATUS_REJECTED) {
            return;
          }
          results[i] = value;
          unresolved--;
          if (unresolved === 0) {
            resolveAll(results);
          }
        };
      })(i);
      if (Promise.isPromise(promise)) {
        promise.then(resolve, reject);
      } else {
        resolve(promise);
      }
    }
    return deferred;
  };

  /**
   * Checks if the value is likely a promise (has a 'then' function).
   * @return {boolean} true if value is thenable
   */
  Promise.isPromise = function Promise_isPromise(value) {
    return value && typeof value.then === 'function';
  };

  /**
   * Creates resolved promise
   * @param value resolve value
   * @returns {Promise}
   */
  Promise.resolve = function Promise_resolve(value) {
    return new Promise(function (resolve) { resolve(value); });
  };

  /**
   * Creates rejected promise
   * @param reason rejection value
   * @returns {Promise}
   */
  Promise.reject = function Promise_reject(reason) {
    return new Promise(function (resolve, reject) { reject(reason); });
  };

  Promise.prototype = {
    _status: null,
    _value: null,
    _handlers: null,
    _unhandledRejection: null,

    _updateStatus: function Promise__updateStatus(status, value) {
      if (this._status === STATUS_RESOLVED ||
          this._status === STATUS_REJECTED) {
        return;
      }

      if (status === STATUS_RESOLVED &&
          Promise.isPromise(value)) {
        value.then(this._updateStatus.bind(this, STATUS_RESOLVED),
                   this._updateStatus.bind(this, STATUS_REJECTED));
        return;
      }

      this._status = status;
      this._value = value;

      if (status === STATUS_REJECTED && this._handlers.length === 0) {
        this._unhandledRejection = true;
        HandlerManager.addUnhandledRejection(this);
      }

      HandlerManager.scheduleHandlers(this);
    },

    _resolve: function Promise_resolve(value) {
      this._updateStatus(STATUS_RESOLVED, value);
    },

    _reject: function Promise_reject(reason) {
      this._updateStatus(STATUS_REJECTED, reason);
    },

    then: function Promise_then(onResolve, onReject) {
      var nextPromise = new Promise(function (resolve, reject) {
        this.resolve = resolve;
        this.reject = reject;
      });
      this._handlers.push({
        thisPromise: this,
        onResolve: onResolve,
        onReject: onReject,
        nextPromise: nextPromise
      });
      HandlerManager.scheduleHandlers(this);
      return nextPromise;
    },

    catch: function Promise_catch(onReject) {
      return this.then(undefined, onReject);
    }
  };

  globalScope.Promise = Promise;
//#else
//throw new Error('DOM Promise is not present');
//#endif
})();

var StatTimer = (function StatTimerClosure() {
  function rpad(str, pad, length) {
    while (str.length < length) {
      str += pad;
    }
    return str;
  }
  function StatTimer() {
    this.started = {};
    this.times = [];
    this.enabled = true;
  }
  StatTimer.prototype = {
    time: function StatTimer_time(name) {
      if (!this.enabled) {
        return;
      }
      if (name in this.started) {
        warn('Timer is already running for ' + name);
      }
      this.started[name] = Date.now();
    },
    timeEnd: function StatTimer_timeEnd(name) {
      if (!this.enabled) {
        return;
      }
      if (!(name in this.started)) {
        warn('Timer has not been started for ' + name);
      }
      this.times.push({
        'name': name,
        'start': this.started[name],
        'end': Date.now()
      });
      // Remove timer from started so it can be called again.
      delete this.started[name];
    },
    toString: function StatTimer_toString() {
      var i, ii;
      var times = this.times;
      var out = '';
      // Find the longest name for padding purposes.
      var longest = 0;
      for (i = 0, ii = times.length; i < ii; ++i) {
        var name = times[i]['name'];
        if (name.length > longest) {
          longest = name.length;
        }
      }
      for (i = 0, ii = times.length; i < ii; ++i) {
        var span = times[i];
        var duration = span.end - span.start;
        out += rpad(span['name'], ' ', longest) + ' ' + duration + 'ms\n';
      }
      return out;
    }
  };
  return StatTimer;
})();

PDFJS.createBlob = function createBlob(data, contentType) {
  if (typeof Blob !== 'undefined') {
    return new Blob([data], { type: contentType });
  }
  // Blob builder is deprecated in FF14 and removed in FF18.
  var bb = new MozBlobBuilder();
  bb.append(data);
  return bb.getBlob(contentType);
};

PDFJS.createObjectURL = (function createObjectURLClosure() {
  // Blob/createObjectURL is not available, falling back to data schema.
  var digits =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  return function createObjectURL(data, contentType) {
    if (!PDFJS.disableCreateObjectURL &&
        typeof URL !== 'undefined' && URL.createObjectURL) {
      var blob = PDFJS.createBlob(data, contentType);
      return URL.createObjectURL(blob);
    }

    var buffer = 'data:' + contentType + ';base64,';
    for (var i = 0, ii = data.length; i < ii; i += 3) {
      var b1 = data[i] & 0xFF;
      var b2 = data[i + 1] & 0xFF;
      var b3 = data[i + 2] & 0xFF;
      var d1 = b1 >> 2, d2 = ((b1 & 3) << 4) | (b2 >> 4);
      var d3 = i + 1 < ii ? ((b2 & 0xF) << 2) | (b3 >> 6) : 64;
      var d4 = i + 2 < ii ? (b3 & 0x3F) : 64;
      buffer += digits[d1] + digits[d2] + digits[d3] + digits[d4];
    }
    return buffer;
  };
})();

function MessageHandler(name, comObj) {
  this.name = name;
  this.comObj = comObj;
  this.callbackIndex = 1;
  this.postMessageTransfers = true;
  var callbacksCapabilities = this.callbacksCapabilities = {};
  var ah = this.actionHandler = {};

  ah['console_log'] = [function ahConsoleLog(data) {
    console.log.apply(console, data);
  }];
  ah['console_error'] = [function ahConsoleError(data) {
    console.error.apply(console, data);
  }];
  ah['_unsupported_feature'] = [function ah_unsupportedFeature(data) {
    UnsupportedManager.notify(data);
  }];

  comObj.onmessage = function messageHandlerComObjOnMessage(event) {
    var data = event.data;
    if (data.isReply) {
      var callbackId = data.callbackId;
      if (data.callbackId in callbacksCapabilities) {
        var callback = callbacksCapabilities[callbackId];
        delete callbacksCapabilities[callbackId];
        if ('error' in data) {
          callback.reject(data.error);
        } else {
          callback.resolve(data.data);
        }
      } else {
        error('Cannot resolve callback ' + callbackId);
      }
    } else if (data.action in ah) {
      var action = ah[data.action];
      if (data.callbackId) {
        Promise.resolve().then(function () {
          return action[0].call(action[1], data.data);
        }).then(function (result) {
          comObj.postMessage({
            isReply: true,
            callbackId: data.callbackId,
            data: result
          });
        }, function (reason) {
          comObj.postMessage({
            isReply: true,
            callbackId: data.callbackId,
            error: reason
          });
        });
      } else {
        action[0].call(action[1], data.data);
      }
    } else {
      error('Unknown action from worker: ' + data.action);
    }
  };
}

MessageHandler.prototype = {
  on: function messageHandlerOn(actionName, handler, scope) {
    var ah = this.actionHandler;
    if (ah[actionName]) {
      error('There is already an actionName called "' + actionName + '"');
    }
    ah[actionName] = [handler, scope];
  },
  /**
   * Sends a message to the comObj to invoke the action with the supplied data.
   * @param {String} actionName Action to call.
   * @param {JSON} data JSON data to send.
   * @param {Array} [transfers] Optional list of transfers/ArrayBuffers
   */
  send: function messageHandlerSend(actionName, data, transfers) {
    var message = {
      action: actionName,
      data: data
    };
    this.postMessage(message, transfers);
  },
  /**
   * Sends a message to the comObj to invoke the action with the supplied data.
   * Expects that other side will callback with the response.
   * @param {String} actionName Action to call.
   * @param {JSON} data JSON data to send.
   * @param {Array} [transfers] Optional list of transfers/ArrayBuffers.
   * @returns {Promise} Promise to be resolved with response data.
   */
  sendWithPromise:
    function messageHandlerSendWithPromise(actionName, data, transfers) {
    var callbackId = this.callbackIndex++;
    var message = {
      action: actionName,
      data: data,
      callbackId: callbackId
    };
    var capability = createPromiseCapability();
    this.callbacksCapabilities[callbackId] = capability;
    try {
      this.postMessage(message, transfers);
    } catch (e) {
      capability.reject(e);
    }
    return capability.promise;
  },
  /**
   * Sends raw message to the comObj.
   * @private
   * @param message {Object} Raw message.
   * @param transfers List of transfers/ArrayBuffers, or undefined.
   */
  postMessage: function (message, transfers) {
    if (transfers && this.postMessageTransfers) {
      this.comObj.postMessage(message, transfers);
    } else {
      this.comObj.postMessage(message);
    }
  }
};

function loadJpegStream(id, imageUrl, objs) {
  var img = new Image();
  img.onload = (function loadJpegStream_onloadClosure() {
    objs.resolve(id, img);
  });
  img.onerror = (function loadJpegStream_onerrorClosure() {
    objs.resolve(id, null);
    warn('Error during JPEG image loading');
  });
  img.src = imageUrl;
}



//#if (FIREFOX || MOZCENTRAL)
//
//Components.utils.import('resource://gre/modules/Services.jsm');
//
//var EXPORTED_SYMBOLS = ['NetworkManager'];
//
//var console = {
//  log: function console_log(aMsg) {
//    var msg = 'network.js: ' + (aMsg.join ? aMsg.join('') : aMsg);
//    Services.console.logStringMessage(msg);
//    // TODO(mack): dump() doesn't seem to work here...
//    dump(msg + '\n');
//  }
//}
//#endif

var NetworkManager = (function NetworkManagerClosure() {

  var OK_RESPONSE = 200;
  var PARTIAL_CONTENT_RESPONSE = 206;

  function NetworkManager(url, args) {
    this.url = url;
    args = args || {};
    this.isHttp = /^https?:/i.test(url);
    this.httpHeaders = (this.isHttp && args.httpHeaders) || {};
    this.withCredentials = args.withCredentials || false;
    this.getXhr = args.getXhr ||
      function NetworkManager_getXhr() {
//#if B2G
//      return new XMLHttpRequest({ mozSystem: true });
//#else
        return new XMLHttpRequest();
//#endif
      };

    this.currXhrId = 0;
    this.pendingRequests = {};
    this.loadedRequests = {};
  }

  function getArrayBuffer(xhr) {
    var data = xhr.response;
    if (typeof data !== 'string') {
      return data;
    }
    var length = data.length;
    var array = new Uint8Array(length);
    for (var i = 0; i < length; i++) {
      array[i] = data.charCodeAt(i) & 0xFF;
    }
    return array.buffer;
  }

  NetworkManager.prototype = {
    requestRange: function NetworkManager_requestRange(begin, end, listeners) {
      var args = {
        begin: begin,
        end: end
      };
      for (var prop in listeners) {
        args[prop] = listeners[prop];
      }
      return this.request(args);
    },

    requestFull: function NetworkManager_requestFull(listeners) {
      return this.request(listeners);
    },

    request: function NetworkManager_request(args) {
      var xhr = this.getXhr();
      var xhrId = this.currXhrId++;
      var pendingRequest = this.pendingRequests[xhrId] = {
        xhr: xhr
      };

      xhr.open('GET', this.url);
      xhr.withCredentials = this.withCredentials;
      for (var property in this.httpHeaders) {
        var value = this.httpHeaders[property];
        if (typeof value === 'undefined') {
          continue;
        }
        xhr.setRequestHeader(property, value);
      }
      if (this.isHttp && 'begin' in args && 'end' in args) {
        var rangeStr = args.begin + '-' + (args.end - 1);
        xhr.setRequestHeader('Range', 'bytes=' + rangeStr);
        pendingRequest.expectedStatus = 206;
      } else {
        pendingRequest.expectedStatus = 200;
      }

      if (args.onProgressiveData) {
        // Some legacy browsers might throw an exception.
        try {
          xhr.responseType = 'moz-chunked-arraybuffer';
        } catch(e) {}
        if (xhr.responseType === 'moz-chunked-arraybuffer') {
          pendingRequest.onProgressiveData = args.onProgressiveData;
          pendingRequest.mozChunked = true;
        } else {
          xhr.responseType = 'arraybuffer';
        }
      } else {
        xhr.responseType = 'arraybuffer';
      }

      if (args.onError) {
        xhr.onerror = function(evt) {
          args.onError(xhr.status);
        };
      }
      xhr.onreadystatechange = this.onStateChange.bind(this, xhrId);
      xhr.onprogress = this.onProgress.bind(this, xhrId);

      pendingRequest.onHeadersReceived = args.onHeadersReceived;
      pendingRequest.onDone = args.onDone;
      pendingRequest.onError = args.onError;
      pendingRequest.onProgress = args.onProgress;

      xhr.send(null);

      return xhrId;
    },

    onProgress: function NetworkManager_onProgress(xhrId, evt) {
      var pendingRequest = this.pendingRequests[xhrId];
      if (!pendingRequest) {
        // Maybe abortRequest was called...
        return;
      }

      if (pendingRequest.mozChunked) {
        var chunk = getArrayBuffer(pendingRequest.xhr);
        pendingRequest.onProgressiveData(chunk);
      }

      var onProgress = pendingRequest.onProgress;
      if (onProgress) {
        onProgress(evt);
      }
    },

    onStateChange: function NetworkManager_onStateChange(xhrId, evt) {
      var pendingRequest = this.pendingRequests[xhrId];
      if (!pendingRequest) {
        // Maybe abortRequest was called...
        return;
      }

      var xhr = pendingRequest.xhr;
      if (xhr.readyState >= 2 && pendingRequest.onHeadersReceived) {
        pendingRequest.onHeadersReceived();
        delete pendingRequest.onHeadersReceived;
      }

      if (xhr.readyState !== 4) {
        return;
      }

      if (!(xhrId in this.pendingRequests)) {
        // The XHR request might have been aborted in onHeadersReceived()
        // callback, in which case we should abort request
        return;
      }

      delete this.pendingRequests[xhrId];

      // success status == 0 can be on ftp, file and other protocols
      if (xhr.status === 0 && this.isHttp) {
        if (pendingRequest.onError) {
          pendingRequest.onError(xhr.status);
        }
        return;
      }
      var xhrStatus = xhr.status || OK_RESPONSE;

      // From http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.35.2:
      // "A server MAY ignore the Range header". This means it's possible to
      // get a 200 rather than a 206 response from a range request.
      var ok_response_on_range_request =
          xhrStatus === OK_RESPONSE &&
          pendingRequest.expectedStatus === PARTIAL_CONTENT_RESPONSE;

      if (!ok_response_on_range_request &&
          xhrStatus !== pendingRequest.expectedStatus) {
        if (pendingRequest.onError) {
          pendingRequest.onError(xhr.status);
        }
        return;
      }

      this.loadedRequests[xhrId] = true;

      var chunk = getArrayBuffer(xhr);
      if (xhrStatus === PARTIAL_CONTENT_RESPONSE) {
        var rangeHeader = xhr.getResponseHeader('Content-Range');
        var matches = /bytes (\d+)-(\d+)\/(\d+)/.exec(rangeHeader);
        var begin = parseInt(matches[1], 10);
        pendingRequest.onDone({
          begin: begin,
          chunk: chunk
        });
      } else if (pendingRequest.onProgressiveData) {
        pendingRequest.onDone(null);
      } else {
        pendingRequest.onDone({
          begin: 0,
          chunk: chunk
        });
      }
    },

    hasPendingRequests: function NetworkManager_hasPendingRequests() {
      for (var xhrId in this.pendingRequests) {
        return true;
      }
      return false;
    },

    getRequestXhr: function NetworkManager_getXhr(xhrId) {
      return this.pendingRequests[xhrId].xhr;
    },

    isStreamingRequest: function NetworkManager_isStreamingRequest(xhrId) {
      return !!(this.pendingRequests[xhrId].onProgressiveData);
    },

    isPendingRequest: function NetworkManager_isPendingRequest(xhrId) {
      return xhrId in this.pendingRequests;
    },

    isLoadedRequest: function NetworkManager_isLoadedRequest(xhrId) {
      return xhrId in this.loadedRequests;
    },

    abortAllRequests: function NetworkManager_abortAllRequests() {
      for (var xhrId in this.pendingRequests) {
        this.abortRequest(xhrId | 0);
      }
    },

    abortRequest: function NetworkManager_abortRequest(xhrId) {
      var xhr = this.pendingRequests[xhrId].xhr;
      delete this.pendingRequests[xhrId];
      xhr.abort();
    }
  };

  return NetworkManager;
})();


var ChunkedStream = (function ChunkedStreamClosure() {
  function ChunkedStream(length, chunkSize, manager) {
    this.bytes = new Uint8Array(length);
    this.start = 0;
    this.pos = 0;
    this.end = length;
    this.chunkSize = chunkSize;
    this.loadedChunks = [];
    this.numChunksLoaded = 0;
    this.numChunks = Math.ceil(length / chunkSize);
    this.manager = manager;
    this.progressiveDataLength = 0;
    this.lastSuccessfulEnsureByteChunk = -1;  // a single-entry cache
  }

  // required methods for a stream. if a particular stream does not
  // implement these, an error should be thrown
  ChunkedStream.prototype = {

    getMissingChunks: function ChunkedStream_getMissingChunks() {
      var chunks = [];
      for (var chunk = 0, n = this.numChunks; chunk < n; ++chunk) {
        if (!this.loadedChunks[chunk]) {
          chunks.push(chunk);
        }
      }
      return chunks;
    },

    getBaseStreams: function ChunkedStream_getBaseStreams() {
      return [this];
    },

    allChunksLoaded: function ChunkedStream_allChunksLoaded() {
      return this.numChunksLoaded === this.numChunks;
    },

    onReceiveData: function ChunkedStream_onReceiveData(begin, chunk) {
      var end = begin + chunk.byteLength;

      assert(begin % this.chunkSize === 0, 'Bad begin offset: ' + begin);
      // Using this.length is inaccurate here since this.start can be moved
      // See ChunkedStream.moveStart()
      var length = this.bytes.length;
      assert(end % this.chunkSize === 0 || end === length,
             'Bad end offset: ' + end);

      this.bytes.set(new Uint8Array(chunk), begin);
      var chunkSize = this.chunkSize;
      var beginChunk = Math.floor(begin / chunkSize);
      var endChunk = Math.floor((end - 1) / chunkSize) + 1;
      var curChunk;

      for (curChunk = beginChunk; curChunk < endChunk; ++curChunk) {
        if (!this.loadedChunks[curChunk]) {
          this.loadedChunks[curChunk] = true;
          ++this.numChunksLoaded;
        }
      }
    },

    onReceiveProgressiveData:
        function ChunkedStream_onReceiveProgressiveData(data) {
      var position = this.progressiveDataLength;
      var beginChunk = Math.floor(position / this.chunkSize);

      this.bytes.set(new Uint8Array(data), position);
      position += data.byteLength;
      this.progressiveDataLength = position;
      var endChunk = position >= this.end ? this.numChunks :
                     Math.floor(position / this.chunkSize);
      var curChunk;
      for (curChunk = beginChunk; curChunk < endChunk; ++curChunk) {
        if (!this.loadedChunks[curChunk]) {
          this.loadedChunks[curChunk] = true;
          ++this.numChunksLoaded;
        }
      }
    },

    ensureByte: function ChunkedStream_ensureByte(pos) {
      var chunk = Math.floor(pos / this.chunkSize);
      if (chunk === this.lastSuccessfulEnsureByteChunk) {
        return;
      }

      if (!this.loadedChunks[chunk]) {
        throw new MissingDataException(pos, pos + 1);
      }
      this.lastSuccessfulEnsureByteChunk = chunk;
    },

    ensureRange: function ChunkedStream_ensureRange(begin, end) {
      if (begin >= end) {
        return;
      }

      if (end <= this.progressiveDataLength) {
        return;
      }

      var chunkSize = this.chunkSize;
      var beginChunk = Math.floor(begin / chunkSize);
      var endChunk = Math.floor((end - 1) / chunkSize) + 1;
      for (var chunk = beginChunk; chunk < endChunk; ++chunk) {
        if (!this.loadedChunks[chunk]) {
          throw new MissingDataException(begin, end);
        }
      }
    },

    nextEmptyChunk: function ChunkedStream_nextEmptyChunk(beginChunk) {
      var chunk, n;
      for (chunk = beginChunk, n = this.numChunks; chunk < n; ++chunk) {
        if (!this.loadedChunks[chunk]) {
          return chunk;
        }
      }
      // Wrap around to beginning
      for (chunk = 0; chunk < beginChunk; ++chunk) {
        if (!this.loadedChunks[chunk]) {
          return chunk;
        }
      }
      return null;
    },

    hasChunk: function ChunkedStream_hasChunk(chunk) {
      return !!this.loadedChunks[chunk];
    },

    get length() {
      return this.end - this.start;
    },

    get isEmpty() {
      return this.length === 0;
    },

    getByte: function ChunkedStream_getByte() {
      var pos = this.pos;
      if (pos >= this.end) {
        return -1;
      }
      this.ensureByte(pos);
      return this.bytes[this.pos++];
    },

    getUint16: function ChunkedStream_getUint16() {
      var b0 = this.getByte();
      var b1 = this.getByte();
      if (b0 === -1 || b1 === -1) {
        return -1;
      }
      return (b0 << 8) + b1;
    },

    getInt32: function ChunkedStream_getInt32() {
      var b0 = this.getByte();
      var b1 = this.getByte();
      var b2 = this.getByte();
      var b3 = this.getByte();
      return (b0 << 24) + (b1 << 16) + (b2 << 8) + b3;
    },

    // returns subarray of original buffer
    // should only be read
    getBytes: function ChunkedStream_getBytes(length) {
      var bytes = this.bytes;
      var pos = this.pos;
      var strEnd = this.end;

      if (!length) {
        this.ensureRange(pos, strEnd);
        return bytes.subarray(pos, strEnd);
      }

      var end = pos + length;
      if (end > strEnd) {
        end = strEnd;
      }
      this.ensureRange(pos, end);

      this.pos = end;
      return bytes.subarray(pos, end);
    },

    peekByte: function ChunkedStream_peekByte() {
      var peekedByte = this.getByte();
      this.pos--;
      return peekedByte;
    },

    peekBytes: function ChunkedStream_peekBytes(length) {
      var bytes = this.getBytes(length);
      this.pos -= bytes.length;
      return bytes;
    },

    getByteRange: function ChunkedStream_getBytes(begin, end) {
      this.ensureRange(begin, end);
      return this.bytes.subarray(begin, end);
    },

    skip: function ChunkedStream_skip(n) {
      if (!n) {
        n = 1;
      }
      this.pos += n;
    },

    reset: function ChunkedStream_reset() {
      this.pos = this.start;
    },

    moveStart: function ChunkedStream_moveStart() {
      this.start = this.pos;
    },

    makeSubStream: function ChunkedStream_makeSubStream(start, length, dict) {
      this.ensureRange(start, start + length);

      function ChunkedStreamSubstream() {}
      ChunkedStreamSubstream.prototype = Object.create(this);
      ChunkedStreamSubstream.prototype.getMissingChunks = function() {
        var chunkSize = this.chunkSize;
        var beginChunk = Math.floor(this.start / chunkSize);
        var endChunk = Math.floor((this.end - 1) / chunkSize) + 1;
        var missingChunks = [];
        for (var chunk = beginChunk; chunk < endChunk; ++chunk) {
          if (!this.loadedChunks[chunk]) {
            missingChunks.push(chunk);
          }
        }
        return missingChunks;
      };
      var subStream = new ChunkedStreamSubstream();
      subStream.pos = subStream.start = start;
      subStream.end = start + length || this.end;
      subStream.dict = dict;
      return subStream;
    },

    isStream: true
  };

  return ChunkedStream;
})();

var ChunkedStreamManager = (function ChunkedStreamManagerClosure() {

  function ChunkedStreamManager(length, chunkSize, url, args) {
    this.stream = new ChunkedStream(length, chunkSize, this);
    this.length = length;
    this.chunkSize = chunkSize;
    this.url = url;
    this.disableAutoFetch = args.disableAutoFetch;
    var msgHandler = this.msgHandler = args.msgHandler;

    if (args.chunkedViewerLoading) {
      msgHandler.on('OnDataRange', this.onReceiveData.bind(this));
      msgHandler.on('OnDataProgress', this.onProgress.bind(this));
      this.sendRequest = function ChunkedStreamManager_sendRequest(begin, end) {
        msgHandler.send('RequestDataRange', { begin: begin, end: end });
      };
    } else {

      var getXhr = function getXhr() {
//#if B2G
//      return new XMLHttpRequest({ mozSystem: true });
//#else
        return new XMLHttpRequest();
//#endif
      };
      this.networkManager = new NetworkManager(this.url, {
        getXhr: getXhr,
        httpHeaders: args.httpHeaders,
        withCredentials: args.withCredentials
      });
      this.sendRequest = function ChunkedStreamManager_sendRequest(begin, end) {
        this.networkManager.requestRange(begin, end, {
          onDone: this.onReceiveData.bind(this),
          onProgress: this.onProgress.bind(this)
        });
      };
    }

    this.currRequestId = 0;

    this.chunksNeededByRequest = {};
    this.requestsByChunk = {};
    this.callbacksByRequest = {};
    this.progressiveDataLength = 0;

    this._loadedStreamCapability = createPromiseCapability();

    if (args.initialData) {
      this.onReceiveData({chunk: args.initialData});
    }
  }

  ChunkedStreamManager.prototype = {
    onLoadedStream: function ChunkedStreamManager_getLoadedStream() {
      return this._loadedStreamCapability.promise;
    },

    // Get all the chunks that are not yet loaded and groups them into
    // contiguous ranges to load in as few requests as possible
    requestAllChunks: function ChunkedStreamManager_requestAllChunks() {
      var missingChunks = this.stream.getMissingChunks();
      this.requestChunks(missingChunks);
      return this._loadedStreamCapability.promise;
    },

    requestChunks: function ChunkedStreamManager_requestChunks(chunks,
                                                               callback) {
      var requestId = this.currRequestId++;

      var chunksNeeded;
      var i, ii;
      this.chunksNeededByRequest[requestId] = chunksNeeded = {};
      for (i = 0, ii = chunks.length; i < ii; i++) {
        if (!this.stream.hasChunk(chunks[i])) {
          chunksNeeded[chunks[i]] = true;
        }
      }

      if (isEmptyObj(chunksNeeded)) {
        if (callback) {
          callback();
        }
        return;
      }

      this.callbacksByRequest[requestId] = callback;

      var chunksToRequest = [];
      for (var chunk in chunksNeeded) {
        chunk = chunk | 0;
        if (!(chunk in this.requestsByChunk)) {
          this.requestsByChunk[chunk] = [];
          chunksToRequest.push(chunk);
        }
        this.requestsByChunk[chunk].push(requestId);
      }

      if (!chunksToRequest.length) {
        return;
      }

      var groupedChunksToRequest = this.groupChunks(chunksToRequest);

      for (i = 0; i < groupedChunksToRequest.length; ++i) {
        var groupedChunk = groupedChunksToRequest[i];
        var begin = groupedChunk.beginChunk * this.chunkSize;
        var end = Math.min(groupedChunk.endChunk * this.chunkSize, this.length);
        this.sendRequest(begin, end);
      }
    },

    getStream: function ChunkedStreamManager_getStream() {
      return this.stream;
    },

    // Loads any chunks in the requested range that are not yet loaded
    requestRange: function ChunkedStreamManager_requestRange(
                      begin, end, callback) {

      end = Math.min(end, this.length);

      var beginChunk = this.getBeginChunk(begin);
      var endChunk = this.getEndChunk(end);

      var chunks = [];
      for (var chunk = beginChunk; chunk < endChunk; ++chunk) {
        chunks.push(chunk);
      }

      this.requestChunks(chunks, callback);
    },

    requestRanges: function ChunkedStreamManager_requestRanges(ranges,
                                                               callback) {
      ranges = ranges || [];
      var chunksToRequest = [];

      for (var i = 0; i < ranges.length; i++) {
        var beginChunk = this.getBeginChunk(ranges[i].begin);
        var endChunk = this.getEndChunk(ranges[i].end);
        for (var chunk = beginChunk; chunk < endChunk; ++chunk) {
          if (chunksToRequest.indexOf(chunk) < 0) {
            chunksToRequest.push(chunk);
          }
        }
      }

      chunksToRequest.sort(function(a, b) { return a - b; });
      this.requestChunks(chunksToRequest, callback);
    },

    // Groups a sorted array of chunks into as few continguous larger
    // chunks as possible
    groupChunks: function ChunkedStreamManager_groupChunks(chunks) {
      var groupedChunks = [];
      var beginChunk = -1;
      var prevChunk = -1;
      for (var i = 0; i < chunks.length; ++i) {
        var chunk = chunks[i];

        if (beginChunk < 0) {
          beginChunk = chunk;
        }

        if (prevChunk >= 0 && prevChunk + 1 !== chunk) {
          groupedChunks.push({ beginChunk: beginChunk,
                               endChunk: prevChunk + 1 });
          beginChunk = chunk;
        }
        if (i + 1 === chunks.length) {
          groupedChunks.push({ beginChunk: beginChunk,
                               endChunk: chunk + 1 });
        }

        prevChunk = chunk;
      }
      return groupedChunks;
    },

    onProgress: function ChunkedStreamManager_onProgress(args) {
      var bytesLoaded = (this.stream.numChunksLoaded * this.chunkSize +
                         args.loaded);
      this.msgHandler.send('DocProgress', {
        loaded: bytesLoaded,
        total: this.length
      });
    },

    onReceiveData: function ChunkedStreamManager_onReceiveData(args) {
      var chunk = args.chunk;
      var isProgressive = args.begin === undefined;
      var begin = isProgressive ? this.progressiveDataLength : args.begin;
      var end = begin + chunk.byteLength;

      var beginChunk = Math.floor(begin / this.chunkSize);
      var endChunk = end < this.length ? Math.floor(end / this.chunkSize) :
                                         Math.ceil(end / this.chunkSize);

      if (isProgressive) {
        this.stream.onReceiveProgressiveData(chunk);
        this.progressiveDataLength = end;
      } else {
        this.stream.onReceiveData(begin, chunk);
      }

      if (this.stream.allChunksLoaded()) {
        this._loadedStreamCapability.resolve(this.stream);
      }

      var loadedRequests = [];
      var i, requestId;
      for (chunk = beginChunk; chunk < endChunk; ++chunk) {
        // The server might return more chunks than requested
        var requestIds = this.requestsByChunk[chunk] || [];
        delete this.requestsByChunk[chunk];

        for (i = 0; i < requestIds.length; ++i) {
          requestId = requestIds[i];
          var chunksNeeded = this.chunksNeededByRequest[requestId];
          if (chunk in chunksNeeded) {
            delete chunksNeeded[chunk];
          }

          if (!isEmptyObj(chunksNeeded)) {
            continue;
          }

          loadedRequests.push(requestId);
        }
      }

      // If there are no pending requests, automatically fetch the next
      // unfetched chunk of the PDF
      if (!this.disableAutoFetch && isEmptyObj(this.requestsByChunk)) {
        var nextEmptyChunk;
        if (this.stream.numChunksLoaded === 1) {
          // This is a special optimization so that after fetching the first
          // chunk, rather than fetching the second chunk, we fetch the last
          // chunk.
          var lastChunk = this.stream.numChunks - 1;
          if (!this.stream.hasChunk(lastChunk)) {
            nextEmptyChunk = lastChunk;
          }
        } else {
          nextEmptyChunk = this.stream.nextEmptyChunk(endChunk);
        }
        if (isInt(nextEmptyChunk)) {
          this.requestChunks([nextEmptyChunk]);
        }
      }

      for (i = 0; i < loadedRequests.length; ++i) {
        requestId = loadedRequests[i];
        var callback = this.callbacksByRequest[requestId];
        delete this.callbacksByRequest[requestId];
        if (callback) {
          callback();
        }
      }

      this.msgHandler.send('DocProgress', {
        loaded: this.stream.numChunksLoaded * this.chunkSize,
        total: this.length
      });
    },

    onError: function ChunkedStreamManager_onError(err) {
      this._loadedStreamCapability.reject(err);
    },

    getBeginChunk: function ChunkedStreamManager_getBeginChunk(begin) {
      var chunk = Math.floor(begin / this.chunkSize);
      return chunk;
    },

    getEndChunk: function ChunkedStreamManager_getEndChunk(end) {
      if (end % this.chunkSize === 0) {
        return end / this.chunkSize;
      }

      // 0 -> 0
      // 1 -> 1
      // 99 -> 1
      // 100 -> 1
      // 101 -> 2
      var chunk = Math.floor((end - 1) / this.chunkSize) + 1;
      return chunk;
    }
  };

  return ChunkedStreamManager;
})();


// The maximum number of bytes fetched per range request
var RANGE_CHUNK_SIZE = 65536;

// TODO(mack): Make use of PDFJS.Util.inherit() when it becomes available
var BasePdfManager = (function BasePdfManagerClosure() {
  function BasePdfManager() {
    throw new Error('Cannot initialize BaseManagerManager');
  }

  BasePdfManager.prototype = {
    onLoadedStream: function BasePdfManager_onLoadedStream() {
      throw new NotImplementedException();
    },

    ensureDoc: function BasePdfManager_ensureDoc(prop, args) {
      return this.ensure(this.pdfDocument, prop, args);
    },

    ensureXRef: function BasePdfManager_ensureXRef(prop, args) {
      return this.ensure(this.pdfDocument.xref, prop, args);
    },

    ensureCatalog: function BasePdfManager_ensureCatalog(prop, args) {
      return this.ensure(this.pdfDocument.catalog, prop, args);
    },

    getPage: function BasePdfManager_pagePage(pageIndex) {
      return this.pdfDocument.getPage(pageIndex);
    },

    cleanup: function BasePdfManager_cleanup() {
      return this.pdfDocument.cleanup();
    },

    ensure: function BasePdfManager_ensure(obj, prop, args) {
      return new NotImplementedException();
    },

    requestRange: function BasePdfManager_ensure(begin, end) {
      return new NotImplementedException();
    },

    requestLoadedStream: function BasePdfManager_requestLoadedStream() {
      return new NotImplementedException();
    },

    sendProgressiveData: function BasePdfManager_sendProgressiveData(chunk) {
      return new NotImplementedException();
    },

    updatePassword: function BasePdfManager_updatePassword(password) {
      this.pdfDocument.xref.password = this.password = password;
      if (this._passwordChangedCapability) {
        this._passwordChangedCapability.resolve();
      }
    },

    passwordChanged: function BasePdfManager_passwordChanged() {
      this._passwordChangedCapability = createPromiseCapability();
      return this._passwordChangedCapability.promise;
    },

    terminate: function BasePdfManager_terminate() {
      return new NotImplementedException();
    }
  };

  return BasePdfManager;
})();

var LocalPdfManager = (function LocalPdfManagerClosure() {
  function LocalPdfManager(data, password) {
    var stream = new Stream(data);
    this.pdfDocument = new PDFDocument(this, stream, password);
    this._loadedStreamCapability = createPromiseCapability();
    this._loadedStreamCapability.resolve(stream);
  }

  LocalPdfManager.prototype = Object.create(BasePdfManager.prototype);
  LocalPdfManager.prototype.constructor = LocalPdfManager;

  LocalPdfManager.prototype.ensure =
      function LocalPdfManager_ensure(obj, prop, args) {
    return new Promise(function (resolve, reject) {
      try {
        var value = obj[prop];
        var result;
        if (typeof value === 'function') {
          result = value.apply(obj, args);
        } else {
          result = value;
        }
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
  };

  LocalPdfManager.prototype.requestRange =
      function LocalPdfManager_requestRange(begin, end) {
    return Promise.resolve();
  };

  LocalPdfManager.prototype.requestLoadedStream =
      function LocalPdfManager_requestLoadedStream() {
  };

  LocalPdfManager.prototype.onLoadedStream =
      function LocalPdfManager_getLoadedStream() {
    return this._loadedStreamCapability.promise;
  };

  LocalPdfManager.prototype.terminate =
      function LocalPdfManager_terminate() {
    return;
  };

  return LocalPdfManager;
})();

var NetworkPdfManager = (function NetworkPdfManagerClosure() {
  function NetworkPdfManager(args, msgHandler) {

    this.msgHandler = msgHandler;

    var params = {
      msgHandler: msgHandler,
      httpHeaders: args.httpHeaders,
      withCredentials: args.withCredentials,
      chunkedViewerLoading: args.chunkedViewerLoading,
      disableAutoFetch: args.disableAutoFetch,
      initialData: args.initialData
    };
    this.streamManager = new ChunkedStreamManager(args.length, RANGE_CHUNK_SIZE,
                                                  args.url, params);

    this.pdfDocument = new PDFDocument(this, this.streamManager.getStream(),
                                    args.password);
  }

  NetworkPdfManager.prototype = Object.create(BasePdfManager.prototype);
  NetworkPdfManager.prototype.constructor = NetworkPdfManager;

  NetworkPdfManager.prototype.ensure =
      function NetworkPdfManager_ensure(obj, prop, args) {
    var pdfManager = this;

    return new Promise(function (resolve, reject) {
      function ensureHelper() {
        try {
          var result;
          var value = obj[prop];
          if (typeof value === 'function') {
            result = value.apply(obj, args);
          } else {
            result = value;
          }
          resolve(result);
        } catch(e) {
          if (!(e instanceof MissingDataException)) {
            reject(e);
            return;
          }
          pdfManager.streamManager.requestRange(e.begin, e.end, ensureHelper);
        }
      }

      ensureHelper();
    });
  };

  NetworkPdfManager.prototype.requestRange =
      function NetworkPdfManager_requestRange(begin, end) {
    return new Promise(function (resolve) {
      this.streamManager.requestRange(begin, end, function() {
        resolve();
      });
    }.bind(this));
  };

  NetworkPdfManager.prototype.requestLoadedStream =
      function NetworkPdfManager_requestLoadedStream() {
    this.streamManager.requestAllChunks();
  };

  NetworkPdfManager.prototype.sendProgressiveData =
      function NetworkPdfManager_sendProgressiveData(chunk) {
    this.streamManager.onReceiveData({ chunk: chunk });
  };

  NetworkPdfManager.prototype.onLoadedStream =
      function NetworkPdfManager_getLoadedStream() {
    return this.streamManager.onLoadedStream();
  };

  NetworkPdfManager.prototype.terminate =
      function NetworkPdfManager_terminate() {
    this.streamManager.networkManager.abortAllRequests();
  };

  return NetworkPdfManager;
})();


var Page = (function PageClosure() {

  var LETTER_SIZE_MEDIABOX = [0, 0, 612, 792];

  function Page(pdfManager, xref, pageIndex, pageDict, ref, fontCache) {
    this.pdfManager = pdfManager;
    this.pageIndex = pageIndex;
    this.pageDict = pageDict;
    this.xref = xref;
    this.ref = ref;
    this.fontCache = fontCache;
    this.idCounters = {
      obj: 0
    };
    this.resourcesPromise = null;
  }

  Page.prototype = {
    getPageProp: function Page_getPageProp(key) {
      return this.pageDict.get(key);
    },

    getInheritedPageProp: function Page_inheritPageProp(key) {
      var dict = this.pageDict;
      var value = dict.get(key);
      while (value === undefined) {
        dict = dict.get('Parent');
        if (!dict) {
          break;
        }
        value = dict.get(key);
      }
      return value;
    },

    get content() {
      return this.getPageProp('Contents');
    },

    get resources() {
      var value = this.getInheritedPageProp('Resources');
      // For robustness: The spec states that a \Resources entry has to be
      // present, but can be empty. Some document omit it still. In this case
      // return an empty dictionary:
      if (value === undefined) {
        value = Dict.empty;
      }
      return shadow(this, 'resources', value);
    },

    get mediaBox() {
      var obj = this.getInheritedPageProp('MediaBox');
      // Reset invalid media box to letter size.
      if (!isArray(obj) || obj.length !== 4) {
        obj = LETTER_SIZE_MEDIABOX;
      }
      return shadow(this, 'mediaBox', obj);
    },

    get view() {
      var mediaBox = this.mediaBox;
      var cropBox = this.getInheritedPageProp('CropBox');
      if (!isArray(cropBox) || cropBox.length !== 4) {
        return shadow(this, 'view', mediaBox);
      }

      // From the spec, 6th ed., p.963:
      // "The crop, bleed, trim, and art boxes should not ordinarily
      // extend beyond the boundaries of the media box. If they do, they are
      // effectively reduced to their intersection with the media box."
      cropBox = Util.intersect(cropBox, mediaBox);
      if (!cropBox) {
        return shadow(this, 'view', mediaBox);
      }
      return shadow(this, 'view', cropBox);
    },

    get annotationRefs() {
      return shadow(this, 'annotationRefs',
                    this.getInheritedPageProp('Annots'));
    },

    get rotate() {
      var rotate = this.getInheritedPageProp('Rotate') || 0;
      // Normalize rotation so it's a multiple of 90 and between 0 and 270
      if (rotate % 90 !== 0) {
        rotate = 0;
      } else if (rotate >= 360) {
        rotate = rotate % 360;
      } else if (rotate < 0) {
        // The spec doesn't cover negatives, assume its counterclockwise
        // rotation. The following is the other implementation of modulo.
        rotate = ((rotate % 360) + 360) % 360;
      }
      return shadow(this, 'rotate', rotate);
    },

    getContentStream: function Page_getContentStream() {
      var content = this.content;
      var stream;
      if (isArray(content)) {
        // fetching items
        var xref = this.xref;
        var i, n = content.length;
        var streams = [];
        for (i = 0; i < n; ++i) {
          streams.push(xref.fetchIfRef(content[i]));
        }
        stream = new StreamsSequenceStream(streams);
      } else if (isStream(content)) {
        stream = content;
      } else {
        // replacing non-existent page content with empty one
        stream = new NullStream();
      }
      return stream;
    },

    loadResources: function Page_loadResources(keys) {
      if (!this.resourcesPromise) {
        // TODO: add async getInheritedPageProp and remove this.
        this.resourcesPromise = this.pdfManager.ensure(this, 'resources');
      }
      return this.resourcesPromise.then(function resourceSuccess() {
        var objectLoader = new ObjectLoader(this.resources.map,
                                            keys,
                                            this.xref);
        return objectLoader.load();
      }.bind(this));
    },

    getOperatorList: function Page_getOperatorList(handler, intent) {
      var self = this;

      var pdfManager = this.pdfManager;
      var contentStreamPromise = pdfManager.ensure(this, 'getContentStream',
                                                   []);
      var resourcesPromise = this.loadResources([
        'ExtGState',
        'ColorSpace',
        'Pattern',
        'Shading',
        'XObject',
        'Font'
        // ProcSet
        // Properties
      ]);

      var partialEvaluator = new PartialEvaluator(pdfManager, this.xref,
                                                  handler, this.pageIndex,
                                                  'p' + this.pageIndex + '_',
                                                  this.idCounters,
                                                  this.fontCache);

      var dataPromises = Promise.all([contentStreamPromise, resourcesPromise]);
      var pageListPromise = dataPromises.then(function(data) {
        var contentStream = data[0];
        var opList = new OperatorList(intent, handler, self.pageIndex);

        handler.send('StartRenderPage', {
          transparency: partialEvaluator.hasBlendModes(self.resources),
          pageIndex: self.pageIndex,
          intent: intent
        });
        return partialEvaluator.getOperatorList(contentStream, self.resources,
          opList).then(function () {
            return opList;
          });
      });

      var annotationsPromise = pdfManager.ensure(this, 'annotations');
      return Promise.all([pageListPromise, annotationsPromise]).then(
          function(datas) {
        var pageOpList = datas[0];
        var annotations = datas[1];

        if (annotations.length === 0) {
          pageOpList.flush(true);
          return pageOpList;
        }

        var annotationsReadyPromise = Annotation.appendToOperatorList(
          annotations, pageOpList, pdfManager, partialEvaluator, intent);
        return annotationsReadyPromise.then(function () {
          pageOpList.flush(true);
          return pageOpList;
        });
      });
    },

    extractTextContent: function Page_extractTextContent() {
      var handler = {
        on: function nullHandlerOn() {},
        send: function nullHandlerSend() {}
      };

      var self = this;

      var pdfManager = this.pdfManager;
      var contentStreamPromise = pdfManager.ensure(this, 'getContentStream',
                                                   []);

      var resourcesPromise = this.loadResources([
        'ExtGState',
        'XObject',
        'Font'
      ]);

      var dataPromises = Promise.all([contentStreamPromise,
                                      resourcesPromise]);
      return dataPromises.then(function(data) {
        var contentStream = data[0];
        var partialEvaluator = new PartialEvaluator(pdfManager, self.xref,
                                                    handler, self.pageIndex,
                                                    'p' + self.pageIndex + '_',
                                                    self.idCounters,
                                                    self.fontCache);

        return partialEvaluator.getTextContent(contentStream,
                                               self.resources);
      });
    },

    getAnnotationsData: function Page_getAnnotationsData() {
      var annotations = this.annotations;
      var annotationsData = [];
      for (var i = 0, n = annotations.length; i < n; ++i) {
        annotationsData.push(annotations[i].getData());
      }
      return annotationsData;
    },

    get annotations() {
      var annotations = [];
      var annotationRefs = (this.annotationRefs || []);
      for (var i = 0, n = annotationRefs.length; i < n; ++i) {
        var annotationRef = annotationRefs[i];
        var annotation = Annotation.fromRef(this.xref, annotationRef);
        if (annotation) {
          annotations.push(annotation);
        }
      }
      return shadow(this, 'annotations', annotations);
    }
  };

  return Page;
})();

/**
 * The `PDFDocument` holds all the data of the PDF file. Compared to the
 * `PDFDoc`, this one doesn't have any job management code.
 * Right now there exists one PDFDocument on the main thread + one object
 * for each worker. If there is no worker support enabled, there are two
 * `PDFDocument` objects on the main thread created.
 */
var PDFDocument = (function PDFDocumentClosure() {
  var FINGERPRINT_FIRST_BYTES = 1024;
  var EMPTY_FINGERPRINT = '\x00\x00\x00\x00\x00\x00\x00' +
    '\x00\x00\x00\x00\x00\x00\x00\x00\x00';

  function PDFDocument(pdfManager, arg, password) {
    if (isStream(arg)) {
      init.call(this, pdfManager, arg, password);
    } else if (isArrayBuffer(arg)) {
      init.call(this, pdfManager, new Stream(arg), password);
    } else {
      error('PDFDocument: Unknown argument type');
    }
  }

  function init(pdfManager, stream, password) {
    assert(stream.length > 0, 'stream must have data');
    this.pdfManager = pdfManager;
    this.stream = stream;
    var xref = new XRef(this.stream, password, pdfManager);
    this.xref = xref;
  }

  function find(stream, needle, limit, backwards) {
    var pos = stream.pos;
    var end = stream.end;
    var strBuf = [];
    if (pos + limit > end) {
      limit = end - pos;
    }
    for (var n = 0; n < limit; ++n) {
      strBuf.push(String.fromCharCode(stream.getByte()));
    }
    var str = strBuf.join('');
    stream.pos = pos;
    var index = backwards ? str.lastIndexOf(needle) : str.indexOf(needle);
    if (index === -1) {
      return false; /* not found */
    }
    stream.pos += index;
    return true; /* found */
  }

  var DocumentInfoValidators = {
    get entries() {
      // Lazily build this since all the validation functions below are not
      // defined until after this file loads.
      return shadow(this, 'entries', {
        Title: isString,
        Author: isString,
        Subject: isString,
        Keywords: isString,
        Creator: isString,
        Producer: isString,
        CreationDate: isString,
        ModDate: isString,
        Trapped: isName
      });
    }
  };

  PDFDocument.prototype = {
    parse: function PDFDocument_parse(recoveryMode) {
      this.setup(recoveryMode);
      try {
        // checking if AcroForm is present
        this.acroForm = this.catalog.catDict.get('AcroForm');
        if (this.acroForm) {
          this.xfa = this.acroForm.get('XFA');
          var fields = this.acroForm.get('Fields');
          if ((!fields || !isArray(fields) || fields.length === 0) &&
              !this.xfa) {
            // no fields and no XFA -- not a form (?)
            this.acroForm = null;
          }
        }
      } catch (ex) {
        info('Something wrong with AcroForm entry');
        this.acroForm = null;
      }
    },

    get linearization() {
      var linearization = null;
      if (this.stream.length) {
        try {
          linearization = Linearization.create(this.stream);
        } catch (err) {
          if (err instanceof MissingDataException) {
            throw err;
          }
          info(err);
        }
      }
      // shadow the prototype getter with a data property
      return shadow(this, 'linearization', linearization);
    },
    get startXRef() {
      var stream = this.stream;
      var startXRef = 0;
      var linearization = this.linearization;
      if (linearization) {
        // Find end of first obj.
        stream.reset();
        if (find(stream, 'endobj', 1024)) {
          startXRef = stream.pos + 6;
        }
      } else {
        // Find startxref by jumping backward from the end of the file.
        var step = 1024;
        var found = false, pos = stream.end;
        while (!found && pos > 0) {
          pos -= step - 'startxref'.length;
          if (pos < 0) {
            pos = 0;
          }
          stream.pos = pos;
          found = find(stream, 'startxref', step, true);
        }
        if (found) {
          stream.skip(9);
          var ch;
          do {
            ch = stream.getByte();
          } while (Lexer.isSpace(ch));
          var str = '';
          while (ch >= 0x20 && ch <= 0x39) { // < '9'
            str += String.fromCharCode(ch);
            ch = stream.getByte();
          }
          startXRef = parseInt(str, 10);
          if (isNaN(startXRef)) {
            startXRef = 0;
          }
        }
      }
      // shadow the prototype getter with a data property
      return shadow(this, 'startXRef', startXRef);
    },
    get mainXRefEntriesOffset() {
      var mainXRefEntriesOffset = 0;
      var linearization = this.linearization;
      if (linearization) {
        mainXRefEntriesOffset = linearization.mainXRefEntriesOffset;
      }
      // shadow the prototype getter with a data property
      return shadow(this, 'mainXRefEntriesOffset', mainXRefEntriesOffset);
    },
    // Find the header, remove leading garbage and setup the stream
    // starting from the header.
    checkHeader: function PDFDocument_checkHeader() {
      var stream = this.stream;
      stream.reset();
      if (find(stream, '%PDF-', 1024)) {
        // Found the header, trim off any garbage before it.
        stream.moveStart();
        // Reading file format version
        var MAX_VERSION_LENGTH = 12;
        var version = '', ch;
        while ((ch = stream.getByte()) > 0x20) { // SPACE
          if (version.length >= MAX_VERSION_LENGTH) {
            break;
          }
          version += String.fromCharCode(ch);
        }
        // removing "%PDF-"-prefix
        this.pdfFormatVersion = version.substring(5);
        return;
      }
      // May not be a PDF file, continue anyway.
    },
    parseStartXRef: function PDFDocument_parseStartXRef() {
      var startXRef = this.startXRef;
      this.xref.setStartXRef(startXRef);
    },
    setup: function PDFDocument_setup(recoveryMode) {
      this.xref.parse(recoveryMode);
      this.catalog = new Catalog(this.pdfManager, this.xref);
    },
    get numPages() {
      var linearization = this.linearization;
      var num = linearization ? linearization.numPages : this.catalog.numPages;
      // shadow the prototype getter
      return shadow(this, 'numPages', num);
    },
    get documentInfo() {
      var docInfo = {
        PDFFormatVersion: this.pdfFormatVersion,
        IsAcroFormPresent: !!this.acroForm,
        IsXFAPresent: !!this.xfa
      };
      var infoDict;
      try {
        infoDict = this.xref.trailer.get('Info');
      } catch (err) {
        info('The document information dictionary is invalid.');
      }
      if (infoDict) {
        var validEntries = DocumentInfoValidators.entries;
        // Only fill the document info with valid entries from the spec.
        for (var key in validEntries) {
          if (infoDict.has(key)) {
            var value = infoDict.get(key);
            // Make sure the value conforms to the spec.
            if (validEntries[key](value)) {
              docInfo[key] = (typeof value !== 'string' ?
                              value : stringToPDFString(value));
            } else {
              info('Bad value in document info for "' + key + '"');
            }
          }
        }
      }
      return shadow(this, 'documentInfo', docInfo);
    },
    get fingerprint() {
      var xref = this.xref, idArray, hash, fileID = '';

      if (xref.trailer.has('ID')) {
        idArray = xref.trailer.get('ID');
      }
      if (idArray && isArray(idArray) && idArray[0] !== EMPTY_FINGERPRINT) {
        hash = stringToBytes(idArray[0]);
      } else {
        if (this.stream.ensureRange) {
          this.stream.ensureRange(0,
            Math.min(FINGERPRINT_FIRST_BYTES, this.stream.end));
        }
        hash = calculateMD5(this.stream.bytes.subarray(0,
          FINGERPRINT_FIRST_BYTES), 0, FINGERPRINT_FIRST_BYTES);
      }

      for (var i = 0, n = hash.length; i < n; i++) {
        var hex = hash[i].toString(16);
        fileID += hex.length === 1 ? '0' + hex : hex;
      }

      return shadow(this, 'fingerprint', fileID);
    },

    getPage: function PDFDocument_getPage(pageIndex) {
      return this.catalog.getPage(pageIndex);
    },

    cleanup: function PDFDocument_cleanup() {
      return this.catalog.cleanup();
    }
  };

  return PDFDocument;
})();


var Name = (function NameClosure() {
  function Name(name) {
    this.name = name;
  }

  Name.prototype = {};

  var nameCache = {};

  Name.get = function Name_get(name) {
    var nameValue = nameCache[name];
    return (nameValue ? nameValue : (nameCache[name] = new Name(name)));
  };

  return Name;
})();

var Cmd = (function CmdClosure() {
  function Cmd(cmd) {
    this.cmd = cmd;
  }

  Cmd.prototype = {};

  var cmdCache = {};

  Cmd.get = function Cmd_get(cmd) {
    var cmdValue = cmdCache[cmd];
    return (cmdValue ? cmdValue : (cmdCache[cmd] = new Cmd(cmd)));
  };

  return Cmd;
})();

var Dict = (function DictClosure() {
  var nonSerializable = function nonSerializableClosure() {
    return nonSerializable; // creating closure on some variable
  };

  var GETALL_DICTIONARY_TYPES_WHITELIST = {
    'Background': true,
    'ExtGState': true,
    'Halftone': true,
    'Layout': true,
    'Mask': true,
    'Pagination': true,
    'Printing': true
  };

  function isRecursionAllowedFor(dict) {
    if (!isName(dict.Type)) {
      return true;
    }
    var dictType = dict.Type.name;
    return GETALL_DICTIONARY_TYPES_WHITELIST[dictType] === true;
  }

  // xref is optional
  function Dict(xref) {
    // Map should only be used internally, use functions below to access.
    this.map = Object.create(null);
    this.xref = xref;
    this.objId = null;
    this.__nonSerializable__ = nonSerializable; // disable cloning of the Dict
  }

  Dict.prototype = {
    assignXref: function Dict_assignXref(newXref) {
      this.xref = newXref;
    },

    // automatically dereferences Ref objects
    get: function Dict_get(key1, key2, key3) {
      var value;
      var xref = this.xref;
      if (typeof (value = this.map[key1]) !== 'undefined' || key1 in this.map ||
          typeof key2 === 'undefined') {
        return xref ? xref.fetchIfRef(value) : value;
      }
      if (typeof (value = this.map[key2]) !== 'undefined' || key2 in this.map ||
          typeof key3 === 'undefined') {
        return xref ? xref.fetchIfRef(value) : value;
      }
      value = this.map[key3] || null;
      return xref ? xref.fetchIfRef(value) : value;
    },

    // Same as get(), but returns a promise and uses fetchIfRefAsync().
    getAsync: function Dict_getAsync(key1, key2, key3) {
      var value;
      var xref = this.xref;
      if (typeof (value = this.map[key1]) !== 'undefined' || key1 in this.map ||
          typeof key2 === 'undefined') {
        if (xref) {
          return xref.fetchIfRefAsync(value);
        }
        return Promise.resolve(value);
      }
      if (typeof (value = this.map[key2]) !== 'undefined' || key2 in this.map ||
          typeof key3 === 'undefined') {
        if (xref) {
          return xref.fetchIfRefAsync(value);
        }
        return Promise.resolve(value);
      }
      value = this.map[key3] || null;
      if (xref) {
        return xref.fetchIfRefAsync(value);
      }
      return Promise.resolve(value);
    },

    // no dereferencing
    getRaw: function Dict_getRaw(key) {
      return this.map[key];
    },

    // creates new map and dereferences all Refs
    getAll: function Dict_getAll() {
      var all = Object.create(null);
      var queue = null;
      var key, obj;
      for (key in this.map) {
        obj = this.get(key);
        if (obj instanceof Dict) {
          if (isRecursionAllowedFor(obj)) {
            (queue || (queue = [])).push({target: all, key: key, obj: obj});
          } else {
            all[key] = this.getRaw(key);
          }
        } else {
          all[key] = obj;
        }
      }
      if (!queue) {
        return all;
      }

      // trying to take cyclic references into the account
      var processed = Object.create(null);
      while (queue.length > 0) {
        var item = queue.shift();
        var itemObj = item.obj;
        var objId = itemObj.objId;
        if (objId && objId in processed) {
          item.target[item.key] = processed[objId];
          continue;
        }
        var dereferenced = Object.create(null);
        for (key in itemObj.map) {
          obj = itemObj.get(key);
          if (obj instanceof Dict) {
            if (isRecursionAllowedFor(obj)) {
              queue.push({target: dereferenced, key: key, obj: obj});
            } else {
              dereferenced[key] = itemObj.getRaw(key);
            }
          } else {
            dereferenced[key] = obj;
          }
        }
        if (objId) {
          processed[objId] = dereferenced;
        }
        item.target[item.key] = dereferenced;
      }
      return all;
    },

    getKeys: function Dict_getKeys() {
      return Object.keys(this.map);
    },

    set: function Dict_set(key, value) {
      this.map[key] = value;
    },

    has: function Dict_has(key) {
      return key in this.map;
    },

    forEach: function Dict_forEach(callback) {
      for (var key in this.map) {
        callback(key, this.get(key));
      }
    }
  };

  Dict.empty = new Dict(null);

  return Dict;
})();

var Ref = (function RefClosure() {
  function Ref(num, gen) {
    this.num = num;
    this.gen = gen;
  }

  Ref.prototype = {
    toString: function Ref_toString() {
      // This function is hot, so we make the string as compact as possible.
      // |this.gen| is almost always zero, so we treat that case specially.
      var str = this.num + 'R';
      if (this.gen !== 0) {
        str += this.gen;
      }
      return str;
    }
  };

  return Ref;
})();

// The reference is identified by number and generation.
// This structure stores only one instance of the reference.
var RefSet = (function RefSetClosure() {
  function RefSet() {
    this.dict = {};
  }

  RefSet.prototype = {
    has: function RefSet_has(ref) {
      return ref.toString() in this.dict;
    },

    put: function RefSet_put(ref) {
      this.dict[ref.toString()] = true;
    },

    remove: function RefSet_remove(ref) {
      delete this.dict[ref.toString()];
    }
  };

  return RefSet;
})();

var RefSetCache = (function RefSetCacheClosure() {
  function RefSetCache() {
    this.dict = Object.create(null);
  }

  RefSetCache.prototype = {
    get: function RefSetCache_get(ref) {
      return this.dict[ref.toString()];
    },

    has: function RefSetCache_has(ref) {
      return ref.toString() in this.dict;
    },

    put: function RefSetCache_put(ref, obj) {
      this.dict[ref.toString()] = obj;
    },

    putAlias: function RefSetCache_putAlias(ref, aliasRef) {
      this.dict[ref.toString()] = this.get(aliasRef);
    },

    forEach: function RefSetCache_forEach(fn, thisArg) {
      for (var i in this.dict) {
        fn.call(thisArg, this.dict[i]);
      }
    },

    clear: function RefSetCache_clear() {
      this.dict = Object.create(null);
    }
  };

  return RefSetCache;
})();

var Catalog = (function CatalogClosure() {
  function Catalog(pdfManager, xref) {
    this.pdfManager = pdfManager;
    this.xref = xref;
    this.catDict = xref.getCatalogObj();
    this.fontCache = new RefSetCache();
    assert(isDict(this.catDict),
      'catalog object is not a dictionary');

    this.pagePromises = [];
  }

  Catalog.prototype = {
    get metadata() {
      var streamRef = this.catDict.getRaw('Metadata');
      if (!isRef(streamRef)) {
        return shadow(this, 'metadata', null);
      }

      var encryptMetadata = (!this.xref.encrypt ? false :
                             this.xref.encrypt.encryptMetadata);

      var stream = this.xref.fetch(streamRef, !encryptMetadata);
      var metadata;
      if (stream && isDict(stream.dict)) {
        var type = stream.dict.get('Type');
        var subtype = stream.dict.get('Subtype');

        if (isName(type) && isName(subtype) &&
            type.name === 'Metadata' && subtype.name === 'XML') {
          // XXX: This should examine the charset the XML document defines,
          // however since there are currently no real means to decode
          // arbitrary charsets, let's just hope that the author of the PDF
          // was reasonable enough to stick with the XML default charset,
          // which is UTF-8.
          try {
            metadata = stringToUTF8String(bytesToString(stream.getBytes()));
          } catch (e) {
            info('Skipping invalid metadata.');
          }
        }
      }

      return shadow(this, 'metadata', metadata);
    },
    get toplevelPagesDict() {
      var pagesObj = this.catDict.get('Pages');
      assert(isDict(pagesObj), 'invalid top-level pages dictionary');
      // shadow the prototype getter
      return shadow(this, 'toplevelPagesDict', pagesObj);
    },
    get documentOutline() {
      var obj = null;
      try {
        obj = this.readDocumentOutline();
      } catch (ex) {
        if (ex instanceof MissingDataException) {
          throw ex;
        }
        warn('Unable to read document outline');
      }
      return shadow(this, 'documentOutline', obj);
    },
    readDocumentOutline: function Catalog_readDocumentOutline() {
      var xref = this.xref;
      var obj = this.catDict.get('Outlines');
      var root = { items: [] };
      if (isDict(obj)) {
        obj = obj.getRaw('First');
        var processed = new RefSet();
        if (isRef(obj)) {
          var queue = [{obj: obj, parent: root}];
          // to avoid recursion keeping track of the items
          // in the processed dictionary
          processed.put(obj);
          while (queue.length > 0) {
            var i = queue.shift();
            var outlineDict = xref.fetchIfRef(i.obj);
            if (outlineDict === null) {
              continue;
            }
            if (!outlineDict.has('Title')) {
              error('Invalid outline item');
            }
            var dest = outlineDict.get('A');
            if (dest) {
              dest = dest.get('D');
            } else if (outlineDict.has('Dest')) {
              dest = outlineDict.getRaw('Dest');
              if (isName(dest)) {
                dest = dest.name;
              }
            }
            var title = outlineDict.get('Title');
            var outlineItem = {
              dest: dest,
              title: stringToPDFString(title),
              color: outlineDict.get('C') || [0, 0, 0],
              count: outlineDict.get('Count'),
              bold: !!(outlineDict.get('F') & 2),
              italic: !!(outlineDict.get('F') & 1),
              items: []
            };
            i.parent.items.push(outlineItem);
            obj = outlineDict.getRaw('First');
            if (isRef(obj) && !processed.has(obj)) {
              queue.push({obj: obj, parent: outlineItem});
              processed.put(obj);
            }
            obj = outlineDict.getRaw('Next');
            if (isRef(obj) && !processed.has(obj)) {
              queue.push({obj: obj, parent: i.parent});
              processed.put(obj);
            }
          }
        }
      }
      return (root.items.length > 0 ? root.items : null);
    },
    get numPages() {
      var obj = this.toplevelPagesDict.get('Count');
      assert(
        isInt(obj),
        'page count in top level pages object is not an integer'
      );
      // shadow the prototype getter
      return shadow(this, 'num', obj);
    },
    get destinations() {
      function fetchDestination(dest) {
        return isDict(dest) ? dest.get('D') : dest;
      }

      var xref = this.xref;
      var dests = {}, nameTreeRef, nameDictionaryRef;
      var obj = this.catDict.get('Names');
      if (obj && obj.has('Dests')) {
        nameTreeRef = obj.getRaw('Dests');
      } else if (this.catDict.has('Dests')) {
        nameDictionaryRef = this.catDict.get('Dests');
      }

      if (nameDictionaryRef) {
        // reading simple destination dictionary
        obj = nameDictionaryRef;
        obj.forEach(function catalogForEach(key, value) {
          if (!value) {
            return;
          }
          dests[key] = fetchDestination(value);
        });
      }
      if (nameTreeRef) {
        var nameTree = new NameTree(nameTreeRef, xref);
        var names = nameTree.getAll();
        for (var name in names) {
          if (!names.hasOwnProperty(name)) {
            continue;
          }
          dests[name] = fetchDestination(names[name]);
        }
      }
      return shadow(this, 'destinations', dests);
    },
    getDestination: function Catalog_getDestination(destinationId) {
      function fetchDestination(dest) {
        return isDict(dest) ? dest.get('D') : dest;
      }

      var xref = this.xref;
      var dest, nameTreeRef, nameDictionaryRef;
      var obj = this.catDict.get('Names');
      if (obj && obj.has('Dests')) {
        nameTreeRef = obj.getRaw('Dests');
      } else if (this.catDict.has('Dests')) {
        nameDictionaryRef = this.catDict.get('Dests');
      }

      if (nameDictionaryRef) {
        // reading simple destination dictionary
        obj = nameDictionaryRef;
        obj.forEach(function catalogForEach(key, value) {
          if (!value) {
            return;
          }
          if (key === destinationId) {
            dest = fetchDestination(value);
          }
        });
      }
      if (nameTreeRef) {
        var nameTree = new NameTree(nameTreeRef, xref);
        dest = fetchDestination(nameTree.get(destinationId));
      }
      return dest;
    },
    get attachments() {
      var xref = this.xref;
      var attachments = null, nameTreeRef;
      var obj = this.catDict.get('Names');
      if (obj) {
        nameTreeRef = obj.getRaw('EmbeddedFiles');
      }

      if (nameTreeRef) {
        var nameTree = new NameTree(nameTreeRef, xref);
        var names = nameTree.getAll();
        for (var name in names) {
          if (!names.hasOwnProperty(name)) {
            continue;
          }
          var fs = new FileSpec(names[name], xref);
          if (!attachments) {
            attachments = {};
          }
          attachments[stringToPDFString(name)] = fs.serializable;
        }
      }
      return shadow(this, 'attachments', attachments);
    },
    get javaScript() {
      var xref = this.xref;
      var obj = this.catDict.get('Names');

      var javaScript = [];
      if (obj && obj.has('JavaScript')) {
        var nameTree = new NameTree(obj.getRaw('JavaScript'), xref);
        var names = nameTree.getAll();
        for (var name in names) {
          if (!names.hasOwnProperty(name)) {
            continue;
          }
          // We don't really use the JavaScript right now. This code is
          // defensive so we don't cause errors on document load.
          var jsDict = names[name];
          if (!isDict(jsDict)) {
            continue;
          }
          var type = jsDict.get('S');
          if (!isName(type) || type.name !== 'JavaScript') {
            continue;
          }
          var js = jsDict.get('JS');
          if (!isString(js) && !isStream(js)) {
            continue;
          }
          if (isStream(js)) {
            js = bytesToString(js.getBytes());
          }
          javaScript.push(stringToPDFString(js));
        }
      }

      // Append OpenAction actions to javaScript array
      var openactionDict = this.catDict.get('OpenAction');
      if (isDict(openactionDict)) {
        var objType = openactionDict.get('Type');
        var actionType = openactionDict.get('S');
        var action = openactionDict.get('N');
        var isPrintAction = (isName(objType) && objType.name === 'Action' &&
                            isName(actionType) && actionType.name === 'Named' &&
                            isName(action) && action.name === 'Print');

        if (isPrintAction) {
          javaScript.push('print(true);');
        }
      }

      return shadow(this, 'javaScript', javaScript);
    },

    cleanup: function Catalog_cleanup() {
      var promises = [];
      this.fontCache.forEach(function (promise) {
        promises.push(promise);
      });
      return Promise.all(promises).then(function (translatedFonts) {
        for (var i = 0, ii = translatedFonts.length; i < ii; i++) {
          var font = translatedFonts[i].dict;
          delete font.translated;
        }
        this.fontCache.clear();
      }.bind(this));
    },

    getPage: function Catalog_getPage(pageIndex) {
      if (!(pageIndex in this.pagePromises)) {
        this.pagePromises[pageIndex] = this.getPageDict(pageIndex).then(
          function (a) {
            var dict = a[0];
            var ref = a[1];
            return new Page(this.pdfManager, this.xref, pageIndex, dict, ref,
                            this.fontCache);
          }.bind(this)
        );
      }
      return this.pagePromises[pageIndex];
    },

    getPageDict: function Catalog_getPageDict(pageIndex) {
      var capability = createPromiseCapability();
      var nodesToVisit = [this.catDict.getRaw('Pages')];
      var currentPageIndex = 0;
      var xref = this.xref;
      var checkAllKids = false;

      function next() {
        while (nodesToVisit.length) {
          var currentNode = nodesToVisit.pop();

          if (isRef(currentNode)) {
            xref.fetchAsync(currentNode).then(function (obj) {
              if (isDict(obj, 'Page') || (isDict(obj) && !obj.has('Kids'))) {
                if (pageIndex === currentPageIndex) {
                  capability.resolve([obj, currentNode]);
                } else {
                  currentPageIndex++;
                  next();
                }
                return;
              }
              nodesToVisit.push(obj);
              next();
            }, capability.reject);
            return;
          }

          // Must be a child page dictionary.
          assert(
            isDict(currentNode),
            'page dictionary kid reference points to wrong type of object'
          );
          var count = currentNode.get('Count');
          // If the current node doesn't have any children, avoid getting stuck
          // in an empty node further down in the tree (see issue5644.pdf).
          if (count === 0) {
            checkAllKids = true;
          }
          // Skip nodes where the page can't be.
          if (currentPageIndex + count <= pageIndex) {
            currentPageIndex += count;
            continue;
          }

          var kids = currentNode.get('Kids');
          assert(isArray(kids), 'page dictionary kids object is not an array');
          if (!checkAllKids && count === kids.length) {
            // Nodes that don't have the page have been skipped and this is the
            // bottom of the tree which means the page requested must be a
            // descendant of this pages node. Ideally we would just resolve the
            // promise with the page ref here, but there is the case where more
            // pages nodes could link to single a page (see issue 3666 pdf). To
            // handle this push it back on the queue so if it is a pages node it
            // will be descended into.
            nodesToVisit = [kids[pageIndex - currentPageIndex]];
            currentPageIndex = pageIndex;
            continue;
          } else {
            for (var last = kids.length - 1; last >= 0; last--) {
              nodesToVisit.push(kids[last]);
            }
          }
        }
        capability.reject('Page index ' + pageIndex + ' not found.');
      }
      next();
      return capability.promise;
    },

    getPageIndex: function Catalog_getPageIndex(ref) {
      // The page tree nodes have the count of all the leaves below them. To get
      // how many pages are before we just have to walk up the tree and keep
      // adding the count of siblings to the left of the node.
      var xref = this.xref;
      function pagesBeforeRef(kidRef) {
        var total = 0;
        var parentRef;
        return xref.fetchAsync(kidRef).then(function (node) {
          if (!node) {
            return null;
          }
          parentRef = node.getRaw('Parent');
          return node.getAsync('Parent');
        }).then(function (parent) {
          if (!parent) {
            return null;
          }
          return parent.getAsync('Kids');
        }).then(function (kids) {
          if (!kids) {
            return null;
          }
          var kidPromises = [];
          var found = false;
          for (var i = 0; i < kids.length; i++) {
            var kid = kids[i];
            assert(isRef(kid), 'kids must be a ref');
            if (kid.num === kidRef.num) {
              found = true;
              break;
            }
            kidPromises.push(xref.fetchAsync(kid).then(function (kid) {
              if (kid.has('Count')) {
                var count = kid.get('Count');
                total += count;
              } else { // page leaf node
                total++;
              }
            }));
          }
          if (!found) {
            error('kid ref not found in parents kids');
          }
          return Promise.all(kidPromises).then(function () {
            return [total, parentRef];
          });
        });
      }

      var total = 0;
      function next(ref) {
        return pagesBeforeRef(ref).then(function (args) {
          if (!args) {
            return total;
          }
          var count = args[0];
          var parentRef = args[1];
          total += count;
          return next(parentRef);
        });
      }

      return next(ref);
    }
  };

  return Catalog;
})();

var XRef = (function XRefClosure() {
  function XRef(stream, password) {
    this.stream = stream;
    this.entries = [];
    this.xrefstms = {};
    // prepare the XRef cache
    this.cache = [];
    this.password = password;
    this.stats = {
      streamTypes: [],
      fontTypes: []
    };
  }

  XRef.prototype = {
    setStartXRef: function XRef_setStartXRef(startXRef) {
      // Store the starting positions of xref tables as we process them
      // so we can recover from missing data errors
      this.startXRefQueue = [startXRef];
    },

    parse: function XRef_parse(recoveryMode) {
      var trailerDict;
      if (!recoveryMode) {
        trailerDict = this.readXRef();
      } else {
        warn('Indexing all PDF objects');
        trailerDict = this.indexObjects();
      }
      trailerDict.assignXref(this);
      this.trailer = trailerDict;
      var encrypt = trailerDict.get('Encrypt');
      if (encrypt) {
        var ids = trailerDict.get('ID');
        var fileId = (ids && ids.length) ? ids[0] : '';
        this.encrypt = new CipherTransformFactory(encrypt, fileId,
                                                  this.password);
      }

      // get the root dictionary (catalog) object
      if (!(this.root = trailerDict.get('Root'))) {
        error('Invalid root reference');
      }
    },

    processXRefTable: function XRef_processXRefTable(parser) {
      if (!('tableState' in this)) {
        // Stores state of the table as we process it so we can resume
        // from middle of table in case of missing data error
        this.tableState = {
          entryNum: 0,
          streamPos: parser.lexer.stream.pos,
          parserBuf1: parser.buf1,
          parserBuf2: parser.buf2
        };
      }

      var obj = this.readXRefTable(parser);

      // Sanity check
      if (!isCmd(obj, 'trailer')) {
        error('Invalid XRef table: could not find trailer dictionary');
      }
      // Read trailer dictionary, e.g.
      // trailer
      //    << /Size 22
      //      /Root 20R
      //      /Info 10R
      //      /ID [ <81b14aafa313db63dbd6f981e49f94f4> ]
      //    >>
      // The parser goes through the entire stream << ... >> and provides
      // a getter interface for the key-value table
      var dict = parser.getObj();

      // The pdflib PDF generator can generate a nested trailer dictionary
      if (!isDict(dict) && dict.dict) {
        dict = dict.dict;
      }
      if (!isDict(dict)) {
        error('Invalid XRef table: could not parse trailer dictionary');
      }
      delete this.tableState;

      return dict;
    },

    readXRefTable: function XRef_readXRefTable(parser) {
      // Example of cross-reference table:
      // xref
      // 0 1                    <-- subsection header (first obj #, obj count)
      // 0000000000 65535 f     <-- actual object (offset, generation #, f/n)
      // 23 2                   <-- subsection header ... and so on ...
      // 0000025518 00002 n
      // 0000025635 00000 n
      // trailer
      // ...

      var stream = parser.lexer.stream;
      var tableState = this.tableState;
      stream.pos = tableState.streamPos;
      parser.buf1 = tableState.parserBuf1;
      parser.buf2 = tableState.parserBuf2;

      // Outer loop is over subsection headers
      var obj;

      while (true) {
        if (!('firstEntryNum' in tableState) || !('entryCount' in tableState)) {
          if (isCmd(obj = parser.getObj(), 'trailer')) {
            break;
          }
          tableState.firstEntryNum = obj;
          tableState.entryCount = parser.getObj();
        }

        var first = tableState.firstEntryNum;
        var count = tableState.entryCount;
        if (!isInt(first) || !isInt(count)) {
          error('Invalid XRef table: wrong types in subsection header');
        }
        // Inner loop is over objects themselves
        for (var i = tableState.entryNum; i < count; i++) {
          tableState.streamPos = stream.pos;
          tableState.entryNum = i;
          tableState.parserBuf1 = parser.buf1;
          tableState.parserBuf2 = parser.buf2;

          var entry = {};
          entry.offset = parser.getObj();
          entry.gen = parser.getObj();
          var type = parser.getObj();

          if (isCmd(type, 'f')) {
            entry.free = true;
          } else if (isCmd(type, 'n')) {
            entry.uncompressed = true;
          }

          // Validate entry obj
          if (!isInt(entry.offset) || !isInt(entry.gen) ||
              !(entry.free || entry.uncompressed)) {
            error('Invalid entry in XRef subsection: ' + first + ', ' + count);
          }

          if (!this.entries[i + first]) {
            this.entries[i + first] = entry;
          }
        }

        tableState.entryNum = 0;
        tableState.streamPos = stream.pos;
        tableState.parserBuf1 = parser.buf1;
        tableState.parserBuf2 = parser.buf2;
        delete tableState.firstEntryNum;
        delete tableState.entryCount;
      }

      // Per issue 3248: hp scanners generate bad XRef
      if (first === 1 && this.entries[1] && this.entries[1].free) {
        // shifting the entries
        this.entries.shift();
      }

      // Sanity check: as per spec, first object must be free
      if (this.entries[0] && !this.entries[0].free) {
        error('Invalid XRef table: unexpected first object');
      }
      return obj;
    },

    processXRefStream: function XRef_processXRefStream(stream) {
      if (!('streamState' in this)) {
        // Stores state of the stream as we process it so we can resume
        // from middle of stream in case of missing data error
        var streamParameters = stream.dict;
        var byteWidths = streamParameters.get('W');
        var range = streamParameters.get('Index');
        if (!range) {
          range = [0, streamParameters.get('Size')];
        }

        this.streamState = {
          entryRanges: range,
          byteWidths: byteWidths,
          entryNum: 0,
          streamPos: stream.pos
        };
      }
      this.readXRefStream(stream);
      delete this.streamState;

      return stream.dict;
    },

    readXRefStream: function XRef_readXRefStream(stream) {
      var i, j;
      var streamState = this.streamState;
      stream.pos = streamState.streamPos;

      var byteWidths = streamState.byteWidths;
      var typeFieldWidth = byteWidths[0];
      var offsetFieldWidth = byteWidths[1];
      var generationFieldWidth = byteWidths[2];

      var entryRanges = streamState.entryRanges;
      while (entryRanges.length > 0) {
        var first = entryRanges[0];
        var n = entryRanges[1];

        if (!isInt(first) || !isInt(n)) {
          error('Invalid XRef range fields: ' + first + ', ' + n);
        }
        if (!isInt(typeFieldWidth) || !isInt(offsetFieldWidth) ||
            !isInt(generationFieldWidth)) {
          error('Invalid XRef entry fields length: ' + first + ', ' + n);
        }
        for (i = streamState.entryNum; i < n; ++i) {
          streamState.entryNum = i;
          streamState.streamPos = stream.pos;

          var type = 0, offset = 0, generation = 0;
          for (j = 0; j < typeFieldWidth; ++j) {
            type = (type << 8) | stream.getByte();
          }
          // if type field is absent, its default value is 1
          if (typeFieldWidth === 0) {
            type = 1;
          }
          for (j = 0; j < offsetFieldWidth; ++j) {
            offset = (offset << 8) | stream.getByte();
          }
          for (j = 0; j < generationFieldWidth; ++j) {
            generation = (generation << 8) | stream.getByte();
          }
          var entry = {};
          entry.offset = offset;
          entry.gen = generation;
          switch (type) {
            case 0:
              entry.free = true;
              break;
            case 1:
              entry.uncompressed = true;
              break;
            case 2:
              break;
            default:
              error('Invalid XRef entry type: ' + type);
          }
          if (!this.entries[first + i]) {
            this.entries[first + i] = entry;
          }
        }

        streamState.entryNum = 0;
        streamState.streamPos = stream.pos;
        entryRanges.splice(0, 2);
      }
    },

    indexObjects: function XRef_indexObjects() {
      // Simple scan through the PDF content to find objects,
      // trailers and XRef streams.
      function readToken(data, offset) {
        var token = '', ch = data[offset];
        while (ch !== 13 && ch !== 10) {
          if (++offset >= data.length) {
            break;
          }
          token += String.fromCharCode(ch);
          ch = data[offset];
        }
        return token;
      }
      function skipUntil(data, offset, what) {
        var length = what.length, dataLength = data.length;
        var skipped = 0;
        // finding byte sequence
        while (offset < dataLength) {
          var i = 0;
          while (i < length && data[offset + i] === what[i]) {
            ++i;
          }
          if (i >= length) {
            break; // sequence found
          }
          offset++;
          skipped++;
        }
        return skipped;
      }
      var trailerBytes = new Uint8Array([116, 114, 97, 105, 108, 101, 114]);
      var startxrefBytes = new Uint8Array([115, 116, 97, 114, 116, 120, 114,
                                          101, 102]);
      var endobjBytes = new Uint8Array([101, 110, 100, 111, 98, 106]);
      var xrefBytes = new Uint8Array([47, 88, 82, 101, 102]);

      var stream = this.stream;
      stream.pos = 0;
      var buffer = stream.getBytes();
      var position = stream.start, length = buffer.length;
      var trailers = [], xrefStms = [];
      while (position < length) {
        var ch = buffer[position];
        if (ch === 32 || ch === 9 || ch === 13 || ch === 10) {
          ++position;
          continue;
        }
        if (ch === 37) { // %-comment
          do {
            ++position;
            if (position >= length) {
              break;
            }
            ch = buffer[position];
          } while (ch !== 13 && ch !== 10);
          continue;
        }
        var token = readToken(buffer, position);
        var m;
        if (token === 'xref') {
          position += skipUntil(buffer, position, trailerBytes);
          trailers.push(position);
          position += skipUntil(buffer, position, startxrefBytes);
        } else if ((m = /^(\d+)\s+(\d+)\s+obj\b/.exec(token))) {
          this.entries[m[1]] = {
            offset: position,
            gen: m[2] | 0,
            uncompressed: true
          };

          var contentLength = skipUntil(buffer, position, endobjBytes) + 7;
          var content = buffer.subarray(position, position + contentLength);

          // checking XRef stream suspect
          // (it shall have '/XRef' and next char is not a letter)
          var xrefTagOffset = skipUntil(content, 0, xrefBytes);
          if (xrefTagOffset < contentLength &&
              content[xrefTagOffset + 5] < 64) {
            xrefStms.push(position);
            this.xrefstms[position] = 1; // don't read it recursively
          }

          position += contentLength;
        } else {
          position += token.length + 1;
        }
      }
      // reading XRef streams
      var i, ii;
      for (i = 0, ii = xrefStms.length; i < ii; ++i) {
        this.startXRefQueue.push(xrefStms[i]);
        this.readXRef(/* recoveryMode */ true);
      }
      // finding main trailer
      var dict;
      for (i = 0, ii = trailers.length; i < ii; ++i) {
        stream.pos = trailers[i];
        var parser = new Parser(new Lexer(stream), true, this);
        var obj = parser.getObj();
        if (!isCmd(obj, 'trailer')) {
          continue;
        }
        // read the trailer dictionary
        if (!isDict(dict = parser.getObj())) {
          continue;
        }
        // taking the first one with 'ID'
        if (dict.has('ID')) {
          return dict;
        }
      }
      // no tailer with 'ID', taking last one (if exists)
      if (dict) {
        return dict;
      }
      // nothing helps
      // calling error() would reject worker with an UnknownErrorException.
      throw new InvalidPDFException('Invalid PDF structure');
    },

    readXRef: function XRef_readXRef(recoveryMode) {
      var stream = this.stream;

      try {
        while (this.startXRefQueue.length) {
          var startXRef = this.startXRefQueue[0];

          stream.pos = startXRef + stream.start;

          var parser = new Parser(new Lexer(stream), true, this);
          var obj = parser.getObj();
          var dict;

          // Get dictionary
          if (isCmd(obj, 'xref')) {
            // Parse end-of-file XRef
            dict = this.processXRefTable(parser);
            if (!this.topDict) {
              this.topDict = dict;
            }

            // Recursively get other XRefs 'XRefStm', if any
            obj = dict.get('XRefStm');
            if (isInt(obj)) {
              var pos = obj;
              // ignore previously loaded xref streams
              // (possible infinite recursion)
              if (!(pos in this.xrefstms)) {
                this.xrefstms[pos] = 1;
                this.startXRefQueue.push(pos);
              }
            }
          } else if (isInt(obj)) {
            // Parse in-stream XRef
            if (!isInt(parser.getObj()) ||
                !isCmd(parser.getObj(), 'obj') ||
                !isStream(obj = parser.getObj())) {
              error('Invalid XRef stream');
            }
            dict = this.processXRefStream(obj);
            if (!this.topDict) {
              this.topDict = dict;
            }
            if (!dict) {
              error('Failed to read XRef stream');
            }
          } else {
            error('Invalid XRef stream header');
          }

          // Recursively get previous dictionary, if any
          obj = dict.get('Prev');
          if (isInt(obj)) {
            this.startXRefQueue.push(obj);
          } else if (isRef(obj)) {
            // The spec says Prev must not be a reference, i.e. "/Prev NNN"
            // This is a fallback for non-compliant PDFs, i.e. "/Prev NNN 0 R"
            this.startXRefQueue.push(obj.num);
          }

          this.startXRefQueue.shift();
        }

        return this.topDict;
      } catch (e) {
        if (e instanceof MissingDataException) {
          throw e;
        }
        info('(while reading XRef): ' + e);
      }

      if (recoveryMode) {
        return;
      }
      throw new XRefParseException();
    },

    getEntry: function XRef_getEntry(i) {
      var xrefEntry = this.entries[i];
      if (xrefEntry && !xrefEntry.free && xrefEntry.offset) {
        return xrefEntry;
      }
      return null;
    },

    fetchIfRef: function XRef_fetchIfRef(obj) {
      if (!isRef(obj)) {
        return obj;
      }
      return this.fetch(obj);
    },

    fetch: function XRef_fetch(ref, suppressEncryption) {
      assert(isRef(ref), 'ref object is not a reference');
      var num = ref.num;
      if (num in this.cache) {
        var cacheEntry = this.cache[num];
        return cacheEntry;
      }

      var xrefEntry = this.getEntry(num);

      // the referenced entry can be free
      if (xrefEntry === null) {
        return (this.cache[num] = null);
      }

      if (xrefEntry.uncompressed) {
        xrefEntry = this.fetchUncompressed(ref, xrefEntry, suppressEncryption);
      } else {
        xrefEntry = this.fetchCompressed(xrefEntry, suppressEncryption);
      }
      if (isDict(xrefEntry)){
        xrefEntry.objId = ref.toString();
      } else if (isStream(xrefEntry)) {
        xrefEntry.dict.objId = ref.toString();
      }
      return xrefEntry;
    },

    fetchUncompressed: function XRef_fetchUncompressed(ref, xrefEntry,
                                                       suppressEncryption) {
      var gen = ref.gen;
      var num = ref.num;
      if (xrefEntry.gen !== gen) {
        error('inconsistent generation in XRef');
      }
      var stream = this.stream.makeSubStream(xrefEntry.offset +
                                             this.stream.start);
      var parser = new Parser(new Lexer(stream), true, this);
      var obj1 = parser.getObj();
      var obj2 = parser.getObj();
      var obj3 = parser.getObj();
      if (!isInt(obj1) || parseInt(obj1, 10) !== num ||
          !isInt(obj2) || parseInt(obj2, 10) !== gen ||
          !isCmd(obj3)) {
        error('bad XRef entry');
      }
      if (!isCmd(obj3, 'obj')) {
        // some bad PDFs use "obj1234" and really mean 1234
        if (obj3.cmd.indexOf('obj') === 0) {
          num = parseInt(obj3.cmd.substring(3), 10);
          if (!isNaN(num)) {
            return num;
          }
        }
        error('bad XRef entry');
      }
      if (this.encrypt && !suppressEncryption) {
        xrefEntry = parser.getObj(this.encrypt.createCipherTransform(num, gen));
      } else {
        xrefEntry = parser.getObj();
      }
      if (!isStream(xrefEntry)) {
        this.cache[num] = xrefEntry;
      }
      return xrefEntry;
    },

    fetchCompressed: function XRef_fetchCompressed(xrefEntry,
                                                   suppressEncryption) {
      var tableOffset = xrefEntry.offset;
      var stream = this.fetch(new Ref(tableOffset, 0));
      if (!isStream(stream)) {
        error('bad ObjStm stream');
      }
      var first = stream.dict.get('First');
      var n = stream.dict.get('N');
      if (!isInt(first) || !isInt(n)) {
        error('invalid first and n parameters for ObjStm stream');
      }
      var parser = new Parser(new Lexer(stream), false, this);
      parser.allowStreams = true;
      var i, entries = [], num, nums = [];
      // read the object numbers to populate cache
      for (i = 0; i < n; ++i) {
        num = parser.getObj();
        if (!isInt(num)) {
          error('invalid object number in the ObjStm stream: ' + num);
        }
        nums.push(num);
        var offset = parser.getObj();
        if (!isInt(offset)) {
          error('invalid object offset in the ObjStm stream: ' + offset);
        }
      }
      // read stream objects for cache
      for (i = 0; i < n; ++i) {
        entries.push(parser.getObj());
        num = nums[i];
        var entry = this.entries[num];
        if (entry && entry.offset === tableOffset && entry.gen === i) {
          this.cache[num] = entries[i];
        }
      }
      xrefEntry = entries[xrefEntry.gen];
      if (xrefEntry === undefined) {
        error('bad XRef entry for compressed object');
      }
      return xrefEntry;
    },

    fetchIfRefAsync: function XRef_fetchIfRefAsync(obj) {
      if (!isRef(obj)) {
        return Promise.resolve(obj);
      }
      return this.fetchAsync(obj);
    },

    fetchAsync: function XRef_fetchAsync(ref, suppressEncryption) {
      var streamManager = this.stream.manager;
      var xref = this;
      return new Promise(function tryFetch(resolve, reject) {
        try {
          resolve(xref.fetch(ref, suppressEncryption));
        } catch (e) {
          if (e instanceof MissingDataException) {
            streamManager.requestRange(e.begin, e.end, function () {
              tryFetch(resolve, reject);
            });
            return;
          }
          reject(e);
        }
      });
    },

    getCatalogObj: function XRef_getCatalogObj() {
      return this.root;
    }
  };

  return XRef;
})();

/**
 * A NameTree is like a Dict but has some advantageous properties, see the
 * spec (7.9.6) for more details.
 * TODO: implement all the Dict functions and make this more efficent.
 */
var NameTree = (function NameTreeClosure() {
  function NameTree(root, xref) {
    this.root = root;
    this.xref = xref;
  }

  NameTree.prototype = {
    getAll: function NameTree_getAll() {
      var dict = {};
      if (!this.root) {
        return dict;
      }
      var xref = this.xref;
      // reading name tree
      var processed = new RefSet();
      processed.put(this.root);
      var queue = [this.root];
      while (queue.length > 0) {
        var i, n;
        var obj = xref.fetchIfRef(queue.shift());
        if (!isDict(obj)) {
          continue;
        }
        if (obj.has('Kids')) {
          var kids = obj.get('Kids');
          for (i = 0, n = kids.length; i < n; i++) {
            var kid = kids[i];
            if (processed.has(kid)) {
              error('invalid destinations');
            }
            queue.push(kid);
            processed.put(kid);
          }
          continue;
        }
        var names = obj.get('Names');
        if (names) {
          for (i = 0, n = names.length; i < n; i += 2) {
            dict[names[i]] = xref.fetchIfRef(names[i + 1]);
          }
        }
      }
      return dict;
    },

    get: function NameTree_get(destinationId) {
      if (!this.root) {
        return null;
      }

      var xref = this.xref;
      var kidsOrNames = xref.fetchIfRef(this.root);
      var loopCount = 0;
      var MAX_NAMES_LEVELS = 10;
      var l, r, m;

      // Perform a binary search to quickly find the entry that
      // contains the named destination we are looking for.
      while (kidsOrNames.has('Kids')) {
        loopCount++;
        if (loopCount > MAX_NAMES_LEVELS) {
          warn('Search depth limit for named destionations has been reached.');
          return null;
        }

        var kids = kidsOrNames.get('Kids');
        if (!isArray(kids)) {
          return null;
        }

        l = 0;
        r = kids.length - 1;
        while (l <= r) {
          m = (l + r) >> 1;
          var kid = xref.fetchIfRef(kids[m]);
          var limits = kid.get('Limits');

          if (destinationId < limits[0]) {
            r = m - 1;
          } else if (destinationId > limits[1]) {
            l = m + 1;
          } else {
            kidsOrNames = xref.fetchIfRef(kids[m]);
            break;
          }
        }
        if (l > r) {
          return null;
        }
      }

      // If we get here, then we have found the right entry. Now
      // go through the named destinations in the Named dictionary
      // until we find the exact destination we're looking for.
      var names = kidsOrNames.get('Names');
      if (isArray(names)) {
        // Perform a binary search to reduce the lookup time.
        l = 0;
        r = names.length - 2;
        while (l <= r) {
          // Check only even indices (0, 2, 4, ...) because the
          // odd indices contain the actual D array.
          m = (l + r) & ~1;
          if (destinationId < names[m]) {
            r = m - 2;
          } else if (destinationId > names[m]) {
            l = m + 2;
          } else {
            return xref.fetchIfRef(names[m + 1]);
          }
        }
      }
      return null;
    }
  };
  return NameTree;
})();

/**
 * "A PDF file can refer to the contents of another file by using a File
 * Specification (PDF 1.1)", see the spec (7.11) for more details.
 * NOTE: Only embedded files are supported (as part of the attachments support)
 * TODO: support the 'URL' file system (with caching if !/V), portable
 * collections attributes and related files (/RF)
 */
var FileSpec = (function FileSpecClosure() {
  function FileSpec(root, xref) {
    if (!root || !isDict(root)) {
      return;
    }
    this.xref = xref;
    this.root = root;
    if (root.has('FS')) {
      this.fs = root.get('FS');
    }
    this.description = root.has('Desc') ?
                         stringToPDFString(root.get('Desc')) :
                         '';
    if (root.has('RF')) {
      warn('Related file specifications are not supported');
    }
    this.contentAvailable = true;
    if (!root.has('EF')) {
      this.contentAvailable = false;
      warn('Non-embedded file specifications are not supported');
    }
  }

  function pickPlatformItem(dict) {
    // Look for the filename in this order:
    // UF, F, Unix, Mac, DOS
    if (dict.has('UF')) {
      return dict.get('UF');
    } else if (dict.has('F')) {
      return dict.get('F');
    } else if (dict.has('Unix')) {
      return dict.get('Unix');
    } else if (dict.has('Mac')) {
      return dict.get('Mac');
    } else if (dict.has('DOS')) {
      return dict.get('DOS');
    } else {
      return null;
    }
  }

  FileSpec.prototype = {
    get filename() {
      if (!this._filename && this.root) {
        var filename = pickPlatformItem(this.root) || 'unnamed';
        this._filename = stringToPDFString(filename).
          replace(/\\\\/g, '\\').
          replace(/\\\//g, '/').
          replace(/\\/g, '/');
      }
      return this._filename;
    },
    get content() {
      if (!this.contentAvailable) {
        return null;
      }
      if (!this.contentRef && this.root) {
        this.contentRef = pickPlatformItem(this.root.get('EF'));
      }
      var content = null;
      if (this.contentRef) {
        var xref = this.xref;
        var fileObj = xref.fetchIfRef(this.contentRef);
        if (fileObj && isStream(fileObj)) {
          content = fileObj.getBytes();
        } else {
          warn('Embedded file specification points to non-existing/invalid ' +
            'content');
        }
      } else {
        warn('Embedded file specification does not have a content');
      }
      return content;
    },
    get serializable() {
      return {
        filename: this.filename,
        content: this.content
      };
    }
  };
  return FileSpec;
})();

/**
 * A helper for loading missing data in object graphs. It traverses the graph
 * depth first and queues up any objects that have missing data. Once it has
 * has traversed as many objects that are available it attempts to bundle the
 * missing data requests and then resume from the nodes that weren't ready.
 *
 * NOTE: It provides protection from circular references by keeping track of
 * of loaded references. However, you must be careful not to load any graphs
 * that have references to the catalog or other pages since that will cause the
 * entire PDF document object graph to be traversed.
 */
var ObjectLoader = (function() {
  function mayHaveChildren(value) {
    return isRef(value) || isDict(value) || isArray(value) || isStream(value);
  }

  function addChildren(node, nodesToVisit) {
    var value;
    if (isDict(node) || isStream(node)) {
      var map;
      if (isDict(node)) {
        map = node.map;
      } else {
        map = node.dict.map;
      }
      for (var key in map) {
        value = map[key];
        if (mayHaveChildren(value)) {
          nodesToVisit.push(value);
        }
      }
    } else if (isArray(node)) {
      for (var i = 0, ii = node.length; i < ii; i++) {
        value = node[i];
        if (mayHaveChildren(value)) {
          nodesToVisit.push(value);
        }
      }
    }
  }

  function ObjectLoader(obj, keys, xref) {
    this.obj = obj;
    this.keys = keys;
    this.xref = xref;
    this.refSet = null;
  }

  ObjectLoader.prototype = {
    load: function ObjectLoader_load() {
      var keys = this.keys;
      this.capability = createPromiseCapability();
      // Don't walk the graph if all the data is already loaded.
      if (!(this.xref.stream instanceof ChunkedStream) ||
          this.xref.stream.getMissingChunks().length === 0) {
        this.capability.resolve();
        return this.capability.promise;
      }

      this.refSet = new RefSet();
      // Setup the initial nodes to visit.
      var nodesToVisit = [];
      for (var i = 0; i < keys.length; i++) {
        nodesToVisit.push(this.obj[keys[i]]);
      }

      this.walk(nodesToVisit);
      return this.capability.promise;
    },

    walk: function ObjectLoader_walk(nodesToVisit) {
      var nodesToRevisit = [];
      var pendingRequests = [];
      // DFS walk of the object graph.
      while (nodesToVisit.length) {
        var currentNode = nodesToVisit.pop();

        // Only references or chunked streams can cause missing data exceptions.
        if (isRef(currentNode)) {
          // Skip nodes that have already been visited.
          if (this.refSet.has(currentNode)) {
            continue;
          }
          try {
            var ref = currentNode;
            this.refSet.put(ref);
            currentNode = this.xref.fetch(currentNode);
          } catch (e) {
            if (!(e instanceof MissingDataException)) {
              throw e;
            }
            nodesToRevisit.push(currentNode);
            pendingRequests.push({ begin: e.begin, end: e.end });
          }
        }
        if (currentNode && currentNode.getBaseStreams) {
          var baseStreams = currentNode.getBaseStreams();
          var foundMissingData = false;
          for (var i = 0; i < baseStreams.length; i++) {
            var stream = baseStreams[i];
            if (stream.getMissingChunks && stream.getMissingChunks().length) {
              foundMissingData = true;
              pendingRequests.push({
                begin: stream.start,
                end: stream.end
              });
            }
          }
          if (foundMissingData) {
            nodesToRevisit.push(currentNode);
          }
        }

        addChildren(currentNode, nodesToVisit);
      }

      if (pendingRequests.length) {
        this.xref.stream.manager.requestRanges(pendingRequests,
            function pendingRequestCallback() {
          nodesToVisit = nodesToRevisit;
          for (var i = 0; i < nodesToRevisit.length; i++) {
            var node = nodesToRevisit[i];
            // Remove any reference nodes from the currrent refset so they
            // aren't skipped when we revist them.
            if (isRef(node)) {
              this.refSet.remove(node);
            }
          }
          this.walk(nodesToVisit);
        }.bind(this));
        return;
      }
      // Everything is loaded.
      this.refSet = null;
      this.capability.resolve();
    }
  };

  return ObjectLoader;
})();


var ISOAdobeCharset = [
  '.notdef', 'space', 'exclam', 'quotedbl', 'numbersign', 'dollar',
  'percent', 'ampersand', 'quoteright', 'parenleft', 'parenright',
  'asterisk', 'plus', 'comma', 'hyphen', 'period', 'slash', 'zero',
  'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight',
  'nine', 'colon', 'semicolon', 'less', 'equal', 'greater', 'question',
  'at', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  'bracketleft', 'backslash', 'bracketright', 'asciicircum', 'underscore',
  'quoteleft', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
  'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  'braceleft', 'bar', 'braceright', 'asciitilde', 'exclamdown', 'cent',
  'sterling', 'fraction', 'yen', 'florin', 'section', 'currency',
  'quotesingle', 'quotedblleft', 'guillemotleft', 'guilsinglleft',
  'guilsinglright', 'fi', 'fl', 'endash', 'dagger', 'daggerdbl',
  'periodcentered', 'paragraph', 'bullet', 'quotesinglbase',
  'quotedblbase', 'quotedblright', 'guillemotright', 'ellipsis',
  'perthousand', 'questiondown', 'grave', 'acute', 'circumflex', 'tilde',
  'macron', 'breve', 'dotaccent', 'dieresis', 'ring', 'cedilla',
  'hungarumlaut', 'ogonek', 'caron', 'emdash', 'AE', 'ordfeminine',
  'Lslash', 'Oslash', 'OE', 'ordmasculine', 'ae', 'dotlessi', 'lslash',
  'oslash', 'oe', 'germandbls', 'onesuperior', 'logicalnot', 'mu',
  'trademark', 'Eth', 'onehalf', 'plusminus', 'Thorn', 'onequarter',
  'divide', 'brokenbar', 'degree', 'thorn', 'threequarters', 'twosuperior',
  'registered', 'minus', 'eth', 'multiply', 'threesuperior', 'copyright',
  'Aacute', 'Acircumflex', 'Adieresis', 'Agrave', 'Aring', 'Atilde',
  'Ccedilla', 'Eacute', 'Ecircumflex', 'Edieresis', 'Egrave', 'Iacute',
  'Icircumflex', 'Idieresis', 'Igrave', 'Ntilde', 'Oacute', 'Ocircumflex',
  'Odieresis', 'Ograve', 'Otilde', 'Scaron', 'Uacute', 'Ucircumflex',
  'Udieresis', 'Ugrave', 'Yacute', 'Ydieresis', 'Zcaron', 'aacute',
  'acircumflex', 'adieresis', 'agrave', 'aring', 'atilde', 'ccedilla',
  'eacute', 'ecircumflex', 'edieresis', 'egrave', 'iacute', 'icircumflex',
  'idieresis', 'igrave', 'ntilde', 'oacute', 'ocircumflex', 'odieresis',
  'ograve', 'otilde', 'scaron', 'uacute', 'ucircumflex', 'udieresis',
  'ugrave', 'yacute', 'ydieresis', 'zcaron'
];

var ExpertCharset = [
  '.notdef', 'space', 'exclamsmall', 'Hungarumlautsmall', 'dollaroldstyle',
  'dollarsuperior', 'ampersandsmall', 'Acutesmall', 'parenleftsuperior',
  'parenrightsuperior', 'twodotenleader', 'onedotenleader', 'comma',
  'hyphen', 'period', 'fraction', 'zerooldstyle', 'oneoldstyle',
  'twooldstyle', 'threeoldstyle', 'fouroldstyle', 'fiveoldstyle',
  'sixoldstyle', 'sevenoldstyle', 'eightoldstyle', 'nineoldstyle',
  'colon', 'semicolon', 'commasuperior', 'threequartersemdash',
  'periodsuperior', 'questionsmall', 'asuperior', 'bsuperior',
  'centsuperior', 'dsuperior', 'esuperior', 'isuperior', 'lsuperior',
  'msuperior', 'nsuperior', 'osuperior', 'rsuperior', 'ssuperior',
  'tsuperior', 'ff', 'fi', 'fl', 'ffi', 'ffl', 'parenleftinferior',
  'parenrightinferior', 'Circumflexsmall', 'hyphensuperior', 'Gravesmall',
  'Asmall', 'Bsmall', 'Csmall', 'Dsmall', 'Esmall', 'Fsmall', 'Gsmall',
  'Hsmall', 'Ismall', 'Jsmall', 'Ksmall', 'Lsmall', 'Msmall', 'Nsmall',
  'Osmall', 'Psmall', 'Qsmall', 'Rsmall', 'Ssmall', 'Tsmall', 'Usmall',
  'Vsmall', 'Wsmall', 'Xsmall', 'Ysmall', 'Zsmall', 'colonmonetary',
  'onefitted', 'rupiah', 'Tildesmall', 'exclamdownsmall', 'centoldstyle',
  'Lslashsmall', 'Scaronsmall', 'Zcaronsmall', 'Dieresissmall',
  'Brevesmall', 'Caronsmall', 'Dotaccentsmall', 'Macronsmall',
  'figuredash', 'hypheninferior', 'Ogoneksmall', 'Ringsmall',
  'Cedillasmall', 'onequarter', 'onehalf', 'threequarters',
  'questiondownsmall', 'oneeighth', 'threeeighths', 'fiveeighths',
  'seveneighths', 'onethird', 'twothirds', 'zerosuperior', 'onesuperior',
  'twosuperior', 'threesuperior', 'foursuperior', 'fivesuperior',
  'sixsuperior', 'sevensuperior', 'eightsuperior', 'ninesuperior',
  'zeroinferior', 'oneinferior', 'twoinferior', 'threeinferior',
  'fourinferior', 'fiveinferior', 'sixinferior', 'seveninferior',
  'eightinferior', 'nineinferior', 'centinferior', 'dollarinferior',
  'periodinferior', 'commainferior', 'Agravesmall', 'Aacutesmall',
  'Acircumflexsmall', 'Atildesmall', 'Adieresissmall', 'Aringsmall',
  'AEsmall', 'Ccedillasmall', 'Egravesmall', 'Eacutesmall',
  'Ecircumflexsmall', 'Edieresissmall', 'Igravesmall', 'Iacutesmall',
  'Icircumflexsmall', 'Idieresissmall', 'Ethsmall', 'Ntildesmall',
  'Ogravesmall', 'Oacutesmall', 'Ocircumflexsmall', 'Otildesmall',
  'Odieresissmall', 'OEsmall', 'Oslashsmall', 'Ugravesmall', 'Uacutesmall',
  'Ucircumflexsmall', 'Udieresissmall', 'Yacutesmall', 'Thornsmall',
  'Ydieresissmall'
];

var ExpertSubsetCharset = [
  '.notdef', 'space', 'dollaroldstyle', 'dollarsuperior',
  'parenleftsuperior', 'parenrightsuperior', 'twodotenleader',
  'onedotenleader', 'comma', 'hyphen', 'period', 'fraction',
  'zerooldstyle', 'oneoldstyle', 'twooldstyle', 'threeoldstyle',
  'fouroldstyle', 'fiveoldstyle', 'sixoldstyle', 'sevenoldstyle',
  'eightoldstyle', 'nineoldstyle', 'colon', 'semicolon', 'commasuperior',
  'threequartersemdash', 'periodsuperior', 'asuperior', 'bsuperior',
  'centsuperior', 'dsuperior', 'esuperior', 'isuperior', 'lsuperior',
  'msuperior', 'nsuperior', 'osuperior', 'rsuperior', 'ssuperior',
  'tsuperior', 'ff', 'fi', 'fl', 'ffi', 'ffl', 'parenleftinferior',
  'parenrightinferior', 'hyphensuperior', 'colonmonetary', 'onefitted',
  'rupiah', 'centoldstyle', 'figuredash', 'hypheninferior', 'onequarter',
  'onehalf', 'threequarters', 'oneeighth', 'threeeighths', 'fiveeighths',
  'seveneighths', 'onethird', 'twothirds', 'zerosuperior', 'onesuperior',
  'twosuperior', 'threesuperior', 'foursuperior', 'fivesuperior',
  'sixsuperior', 'sevensuperior', 'eightsuperior', 'ninesuperior',
  'zeroinferior', 'oneinferior', 'twoinferior', 'threeinferior',
  'fourinferior', 'fiveinferior', 'sixinferior', 'seveninferior',
  'eightinferior', 'nineinferior', 'centinferior', 'dollarinferior',
  'periodinferior', 'commainferior'
];


var DEFAULT_ICON_SIZE = 22; // px
var SUPPORTED_TYPES = ['Link', 'Text', 'Widget'];

var Annotation = (function AnnotationClosure() {
  // 12.5.5: Algorithm: Appearance streams
  function getTransformMatrix(rect, bbox, matrix) {
    var bounds = Util.getAxialAlignedBoundingBox(bbox, matrix);
    var minX = bounds[0];
    var minY = bounds[1];
    var maxX = bounds[2];
    var maxY = bounds[3];

    if (minX === maxX || minY === maxY) {
      // From real-life file, bbox was [0, 0, 0, 0]. In this case,
      // just apply the transform for rect
      return [1, 0, 0, 1, rect[0], rect[1]];
    }

    var xRatio = (rect[2] - rect[0]) / (maxX - minX);
    var yRatio = (rect[3] - rect[1]) / (maxY - minY);
    return [
      xRatio,
      0,
      0,
      yRatio,
      rect[0] - minX * xRatio,
      rect[1] - minY * yRatio
    ];
  }

  function getDefaultAppearance(dict) {
    var appearanceState = dict.get('AP');
    if (!isDict(appearanceState)) {
      return;
    }

    var appearance;
    var appearances = appearanceState.get('N');
    if (isDict(appearances)) {
      var as = dict.get('AS');
      if (as && appearances.has(as.name)) {
        appearance = appearances.get(as.name);
      }
    } else {
      appearance = appearances;
    }
    return appearance;
  }

  function Annotation(params) {
    var dict = params.dict;
    var data = this.data = {};

    data.subtype = dict.get('Subtype').name;
    var rect = dict.get('Rect') || [0, 0, 0, 0];
    data.rect = Util.normalizeRect(rect);
    data.annotationFlags = dict.get('F');

    var color = dict.get('C');
    if (!color) {
      // The PDF spec does not mention how a missing color array is interpreted.
      // Adobe Reader seems to default to black in this case.
      data.color = [0, 0, 0];
    } else if (isArray(color)) {
      switch (color.length) {
        case 0:
          // Empty array denotes transparent border.
          data.color = null;
          break;
        case 1:
          // TODO: implement DeviceGray
          break;
        case 3:
          data.color = color;
          break;
        case 4:
          // TODO: implement DeviceCMYK
          break;
      }
    }

    // Some types of annotations have border style dict which has more
    // info than the border array
    if (dict.has('BS')) {
      var borderStyle = dict.get('BS');
      data.borderWidth = borderStyle.has('W') ? borderStyle.get('W') : 1;
    } else {
      var borderArray = dict.get('Border') || [0, 0, 1];
      data.borderWidth = borderArray[2] || 0;

      // TODO: implement proper support for annotations with line dash patterns.
      var dashArray = borderArray[3];
      if (data.borderWidth > 0 && dashArray) {
        if (!isArray(dashArray)) {
          // Ignore the border if dashArray is not actually an array,
          // this is consistent with the behaviour in Adobe Reader.
          data.borderWidth = 0;
        } else {
          var dashArrayLength = dashArray.length;
          if (dashArrayLength > 0) {
            // According to the PDF specification: the elements in a dashArray
            // shall be numbers that are nonnegative and not all equal to zero.
            var isInvalid = false;
            var numPositive = 0;
            for (var i = 0; i < dashArrayLength; i++) {
              var validNumber = (+dashArray[i] >= 0);
              if (!validNumber) {
                isInvalid = true;
                break;
              } else if (dashArray[i] > 0) {
                numPositive++;
              }
            }
            if (isInvalid || numPositive === 0) {
              data.borderWidth = 0;
            }
          }
        }
      }
    }

    this.appearance = getDefaultAppearance(dict);
    data.hasAppearance = !!this.appearance;
    data.id = params.ref.num;
  }

  Annotation.prototype = {

    getData: function Annotation_getData() {
      return this.data;
    },

    isInvisible: function Annotation_isInvisible() {
      var data = this.data;
      if (data && SUPPORTED_TYPES.indexOf(data.subtype) !== -1) {
        return false;
      } else {
        return !!(data &&
                  data.annotationFlags &&            // Default: not invisible
                  data.annotationFlags & 0x1);       // Invisible
      }
    },

    isViewable: function Annotation_isViewable() {
      var data = this.data;
      return !!(!this.isInvisible() &&
                data &&
                (!data.annotationFlags ||
                 !(data.annotationFlags & 0x22)) &&  // Hidden or NoView
                data.rect);                          // rectangle is necessary
    },

    isPrintable: function Annotation_isPrintable() {
      var data = this.data;
      return !!(!this.isInvisible() &&
                data &&
                data.annotationFlags &&              // Default: not printable
                data.annotationFlags & 0x4 &&        // Print
                !(data.annotationFlags & 0x2) &&     // Hidden
                data.rect);                          // rectangle is necessary
    },

    loadResources: function Annotation_loadResources(keys) {
      return new Promise(function (resolve, reject) {
        this.appearance.dict.getAsync('Resources').then(function (resources) {
          if (!resources) {
            resolve();
            return;
          }
          var objectLoader = new ObjectLoader(resources.map,
                                              keys,
                                              resources.xref);
          objectLoader.load().then(function() {
            resolve(resources);
          }, reject);
        }, reject);
      }.bind(this));
    },

    getOperatorList: function Annotation_getOperatorList(evaluator) {

      if (!this.appearance) {
        return Promise.resolve(new OperatorList());
      }

      var data = this.data;

      var appearanceDict = this.appearance.dict;
      var resourcesPromise = this.loadResources([
        'ExtGState',
        'ColorSpace',
        'Pattern',
        'Shading',
        'XObject',
        'Font'
        // ProcSet
        // Properties
      ]);
      var bbox = appearanceDict.get('BBox') || [0, 0, 1, 1];
      var matrix = appearanceDict.get('Matrix') || [1, 0, 0, 1, 0 ,0];
      var transform = getTransformMatrix(data.rect, bbox, matrix);
      var self = this;

      return resourcesPromise.then(function(resources) {
          var opList = new OperatorList();
          opList.addOp(OPS.beginAnnotation, [data.rect, transform, matrix]);
          return evaluator.getOperatorList(self.appearance, resources, opList).
            then(function () {
              opList.addOp(OPS.endAnnotation, []);
              self.appearance.reset();
              return opList;
            });
        });
    }
  };

  Annotation.getConstructor =
      function Annotation_getConstructor(subtype, fieldType) {

    if (!subtype) {
      return;
    }

    // TODO(mack): Implement FreeText annotations
    if (subtype === 'Link') {
      return LinkAnnotation;
    } else if (subtype === 'Text') {
      return TextAnnotation;
    } else if (subtype === 'Widget') {
      if (!fieldType) {
        return;
      }

      if (fieldType === 'Tx') {
        return TextWidgetAnnotation;
      } else {
        return WidgetAnnotation;
      }
    } else {
      return Annotation;
    }
  };

  Annotation.fromRef = function Annotation_fromRef(xref, ref) {

    var dict = xref.fetchIfRef(ref);
    if (!isDict(dict)) {
      return;
    }

    var subtype = dict.get('Subtype');
    subtype = isName(subtype) ? subtype.name : '';
    if (!subtype) {
      return;
    }

    var fieldType = Util.getInheritableProperty(dict, 'FT');
    fieldType = isName(fieldType) ? fieldType.name : '';

    var Constructor = Annotation.getConstructor(subtype, fieldType);
    if (!Constructor) {
      return;
    }

    var params = {
      dict: dict,
      ref: ref,
    };

    var annotation = new Constructor(params);

    if (annotation.isViewable() || annotation.isPrintable()) {
      return annotation;
    } else {
      if (SUPPORTED_TYPES.indexOf(subtype) === -1) {
        warn('unimplemented annotation type: ' + subtype);
      }
    }
  };

  Annotation.appendToOperatorList = function Annotation_appendToOperatorList(
      annotations, opList, pdfManager, partialEvaluator, intent) {

    function reject(e) {
      annotationsReadyCapability.reject(e);
    }

    var annotationsReadyCapability = createPromiseCapability();

    var annotationPromises = [];
    for (var i = 0, n = annotations.length; i < n; ++i) {
      if (intent === 'display' && annotations[i].isViewable() ||
          intent === 'print' && annotations[i].isPrintable()) {
        annotationPromises.push(
          annotations[i].getOperatorList(partialEvaluator));
      }
    }
    Promise.all(annotationPromises).then(function(datas) {
      opList.addOp(OPS.beginAnnotations, []);
      for (var i = 0, n = datas.length; i < n; ++i) {
        var annotOpList = datas[i];
        opList.addOpList(annotOpList);
      }
      opList.addOp(OPS.endAnnotations, []);
      annotationsReadyCapability.resolve();
    }, reject);

    return annotationsReadyCapability.promise;
  };

  return Annotation;
})();

var WidgetAnnotation = (function WidgetAnnotationClosure() {

  function WidgetAnnotation(params) {
    Annotation.call(this, params);

    var dict = params.dict;
    var data = this.data;

    data.fieldValue = stringToPDFString(
      Util.getInheritableProperty(dict, 'V') || '');
    data.alternativeText = stringToPDFString(dict.get('TU') || '');
    data.defaultAppearance = Util.getInheritableProperty(dict, 'DA') || '';
    var fieldType = Util.getInheritableProperty(dict, 'FT');
    data.fieldType = isName(fieldType) ? fieldType.name : '';
    data.fieldFlags = Util.getInheritableProperty(dict, 'Ff') || 0;
    this.fieldResources = Util.getInheritableProperty(dict, 'DR') || Dict.empty;

    // Building the full field name by collecting the field and
    // its ancestors 'T' data and joining them using '.'.
    var fieldName = [];
    var namedItem = dict;
    var ref = params.ref;
    while (namedItem) {
      var parent = namedItem.get('Parent');
      var parentRef = namedItem.getRaw('Parent');
      var name = namedItem.get('T');
      if (name) {
        fieldName.unshift(stringToPDFString(name));
      } else if (parent && ref) {
        // The field name is absent, that means more than one field
        // with the same name may exist. Replacing the empty name
        // with the '`' plus index in the parent's 'Kids' array.
        // This is not in the PDF spec but necessary to id the
        // the input controls.
        var kids = parent.get('Kids');
        var j, jj;
        for (j = 0, jj = kids.length; j < jj; j++) {
          var kidRef = kids[j];
          if (kidRef.num === ref.num && kidRef.gen === ref.gen) {
            break;
          }
        }
        fieldName.unshift('`' + j);
      }
      namedItem = parent;
      ref = parentRef;
    }
    data.fullName = fieldName.join('.');
  }

  var parent = Annotation.prototype;
  Util.inherit(WidgetAnnotation, Annotation, {
    isViewable: function WidgetAnnotation_isViewable() {
      if (this.data.fieldType === 'Sig') {
        warn('unimplemented annotation type: Widget signature');
        return false;
      }

      return parent.isViewable.call(this);
    }
  });

  return WidgetAnnotation;
})();

var TextWidgetAnnotation = (function TextWidgetAnnotationClosure() {
  function TextWidgetAnnotation(params) {
    WidgetAnnotation.call(this, params);

    this.data.textAlignment = Util.getInheritableProperty(params.dict, 'Q');
    this.data.annotationType = AnnotationType.WIDGET;
    this.data.hasHtml = !this.data.hasAppearance && !!this.data.fieldValue;
  }

  Util.inherit(TextWidgetAnnotation, WidgetAnnotation, {
    getOperatorList: function TextWidgetAnnotation_getOperatorList(evaluator) {
      if (this.appearance) {
        return Annotation.prototype.getOperatorList.call(this, evaluator);
      }

      var opList = new OperatorList();
      var data = this.data;

      // Even if there is an appearance stream, ignore it. This is the
      // behaviour used by Adobe Reader.
      if (!data.defaultAppearance) {
        return Promise.resolve(opList);
      }

      var stream = new Stream(stringToBytes(data.defaultAppearance));
      return evaluator.getOperatorList(stream, this.fieldResources, opList).
        then(function () {
          return opList;
        });
    }
  });

  return TextWidgetAnnotation;
})();

var InteractiveAnnotation = (function InteractiveAnnotationClosure() {
  function InteractiveAnnotation(params) {
    Annotation.call(this, params);

    this.data.hasHtml = true;
  }

  Util.inherit(InteractiveAnnotation, Annotation, { });

  return InteractiveAnnotation;
})();

var TextAnnotation = (function TextAnnotationClosure() {
  function TextAnnotation(params) {
    InteractiveAnnotation.call(this, params);

    var dict = params.dict;
    var data = this.data;

    var content = dict.get('Contents');
    var title = dict.get('T');
    data.annotationType = AnnotationType.TEXT;
    data.content = stringToPDFString(content || '');
    data.title = stringToPDFString(title || '');

    if (data.hasAppearance) {
      data.name = 'NoIcon';
    } else {
      data.rect[1] = data.rect[3] - DEFAULT_ICON_SIZE;
      data.rect[2] = data.rect[0] + DEFAULT_ICON_SIZE;
      data.name = dict.has('Name') ? dict.get('Name').name : 'Note';
    }

    if (dict.has('C')) {
      data.hasBgColor = true;
    }
  }

  Util.inherit(TextAnnotation, InteractiveAnnotation, { });

  return TextAnnotation;
})();

var LinkAnnotation = (function LinkAnnotationClosure() {
  function LinkAnnotation(params) {
    InteractiveAnnotation.call(this, params);

    var dict = params.dict;
    var data = this.data;
    data.annotationType = AnnotationType.LINK;

    var action = dict.get('A');
    if (action && isDict(action)) {
      var linkType = action.get('S').name;
      if (linkType === 'URI') {
        var url = action.get('URI');
        if (isName(url)) {
          // Some bad PDFs do not put parentheses around relative URLs.
          url = '/' + url.name;
        } else if (url) {
          url = addDefaultProtocolToUrl(url);
        }
        // TODO: pdf spec mentions urls can be relative to a Base
        // entry in the dictionary.
        if (!isValidUrl(url, false)) {
          url = '';
        }
        data.url = url;
      } else if (linkType === 'GoTo') {
        data.dest = action.get('D');
      } else if (linkType === 'GoToR') {
        var urlDict = action.get('F');
        if (isDict(urlDict)) {
          // We assume that the 'url' is a Filspec dictionary
          // and fetch the url without checking any further
          url = urlDict.get('F') || '';
        }

        // TODO: pdf reference says that GoToR
        // can also have 'NewWindow' attribute
        if (!isValidUrl(url, false)) {
          url = '';
        }
        data.url = url;
        data.dest = action.get('D');
      } else if (linkType === 'Named') {
        data.action = action.get('N').name;
      } else {
        warn('unrecognized link type: ' + linkType);
      }
    } else if (dict.has('Dest')) {
      // simple destination link
      var dest = dict.get('Dest');
      data.dest = isName(dest) ? dest.name : dest;
    }
  }

  // Lets URLs beginning with 'www.' default to using the 'http://' protocol.
  function addDefaultProtocolToUrl(url) {
    if (url && url.indexOf('www.') === 0) {
      return ('http://' + url);
    }
    return url;
  }

  Util.inherit(LinkAnnotation, InteractiveAnnotation, { });

  return LinkAnnotation;
})();


var PDFFunction = (function PDFFunctionClosure() {
  var CONSTRUCT_SAMPLED = 0;
  var CONSTRUCT_INTERPOLATED = 2;
  var CONSTRUCT_STICHED = 3;
  var CONSTRUCT_POSTSCRIPT = 4;

  return {
    getSampleArray: function PDFFunction_getSampleArray(size, outputSize, bps,
                                                       str) {
      var i, ii;
      var length = 1;
      for (i = 0, ii = size.length; i < ii; i++) {
        length *= size[i];
      }
      length *= outputSize;

      var array = new Array(length);
      var codeSize = 0;
      var codeBuf = 0;
      // 32 is a valid bps so shifting won't work
      var sampleMul = 1.0 / (Math.pow(2.0, bps) - 1);

      var strBytes = str.getBytes((length * bps + 7) / 8);
      var strIdx = 0;
      for (i = 0; i < length; i++) {
        while (codeSize < bps) {
          codeBuf <<= 8;
          codeBuf |= strBytes[strIdx++];
          codeSize += 8;
        }
        codeSize -= bps;
        array[i] = (codeBuf >> codeSize) * sampleMul;
        codeBuf &= (1 << codeSize) - 1;
      }
      return array;
    },

    getIR: function PDFFunction_getIR(xref, fn) {
      var dict = fn.dict;
      if (!dict) {
        dict = fn;
      }

      var types = [this.constructSampled,
                   null,
                   this.constructInterpolated,
                   this.constructStiched,
                   this.constructPostScript];

      var typeNum = dict.get('FunctionType');
      var typeFn = types[typeNum];
      if (!typeFn) {
        error('Unknown type of function');
      }

      return typeFn.call(this, fn, dict, xref);
    },

    fromIR: function PDFFunction_fromIR(IR) {
      var type = IR[0];
      switch (type) {
        case CONSTRUCT_SAMPLED:
          return this.constructSampledFromIR(IR);
        case CONSTRUCT_INTERPOLATED:
          return this.constructInterpolatedFromIR(IR);
        case CONSTRUCT_STICHED:
          return this.constructStichedFromIR(IR);
        //case CONSTRUCT_POSTSCRIPT:
        default:
          return this.constructPostScriptFromIR(IR);
      }
    },

    parse: function PDFFunction_parse(xref, fn) {
      var IR = this.getIR(xref, fn);
      return this.fromIR(IR);
    },

    parseArray: function PDFFunction_parseArray(xref, fnObj) {
      if (!isArray(fnObj)) {
        // not an array -- parsing as regular function
        return this.parse(xref, fnObj);
      }

      var fnArray = [];
      for (var j = 0, jj = fnObj.length; j < jj; j++) {
        var obj = xref.fetchIfRef(fnObj[j]);
        fnArray.push(PDFFunction.parse(xref, obj));
      }
      return function (src, srcOffset, dest, destOffset) {
        for (var i = 0, ii = fnArray.length; i < ii; i++) {
          fnArray[i](src, srcOffset, dest, destOffset + i);
        }
      };
    },

    constructSampled: function PDFFunction_constructSampled(str, dict) {
      function toMultiArray(arr) {
        var inputLength = arr.length;
        var out = [];
        var index = 0;
        for (var i = 0; i < inputLength; i += 2) {
          out[index] = [arr[i], arr[i + 1]];
          ++index;
        }
        return out;
      }
      var domain = dict.get('Domain');
      var range = dict.get('Range');

      if (!domain || !range) {
        error('No domain or range');
      }

      var inputSize = domain.length / 2;
      var outputSize = range.length / 2;

      domain = toMultiArray(domain);
      range = toMultiArray(range);

      var size = dict.get('Size');
      var bps = dict.get('BitsPerSample');
      var order = dict.get('Order') || 1;
      if (order !== 1) {
        // No description how cubic spline interpolation works in PDF32000:2008
        // As in poppler, ignoring order, linear interpolation may work as good
        info('No support for cubic spline interpolation: ' + order);
      }

      var encode = dict.get('Encode');
      if (!encode) {
        encode = [];
        for (var i = 0; i < inputSize; ++i) {
          encode.push(0);
          encode.push(size[i] - 1);
        }
      }
      encode = toMultiArray(encode);

      var decode = dict.get('Decode');
      if (!decode) {
        decode = range;
      } else {
        decode = toMultiArray(decode);
      }

      var samples = this.getSampleArray(size, outputSize, bps, str);

      return [
        CONSTRUCT_SAMPLED, inputSize, domain, encode, decode, samples, size,
        outputSize, Math.pow(2, bps) - 1, range
      ];
    },

    constructSampledFromIR: function PDFFunction_constructSampledFromIR(IR) {
      // See chapter 3, page 109 of the PDF reference
      function interpolate(x, xmin, xmax, ymin, ymax) {
        return ymin + ((x - xmin) * ((ymax - ymin) / (xmax - xmin)));
      }

      return function constructSampledFromIRResult(src, srcOffset,
                                                   dest, destOffset) {
        // See chapter 3, page 110 of the PDF reference.
        var m = IR[1];
        var domain = IR[2];
        var encode = IR[3];
        var decode = IR[4];
        var samples = IR[5];
        var size = IR[6];
        var n = IR[7];
        //var mask = IR[8];
        var range = IR[9];

        // Building the cube vertices: its part and sample index
        // http://rjwagner49.com/Mathematics/Interpolation.pdf
        var cubeVertices = 1 << m;
        var cubeN = new Float64Array(cubeVertices);
        var cubeVertex = new Uint32Array(cubeVertices);
        var i, j;
        for (j = 0; j < cubeVertices; j++) {
          cubeN[j] = 1;
        }

        var k = n, pos = 1;
        // Map x_i to y_j for 0 <= i < m using the sampled function.
        for (i = 0; i < m; ++i) {
          // x_i' = min(max(x_i, Domain_2i), Domain_2i+1)
          var domain_2i = domain[i][0];
          var domain_2i_1 = domain[i][1];
          var xi = Math.min(Math.max(src[srcOffset +i], domain_2i),
                            domain_2i_1);

          // e_i = Interpolate(x_i', Domain_2i, Domain_2i+1,
          //                   Encode_2i, Encode_2i+1)
          var e = interpolate(xi, domain_2i, domain_2i_1,
                              encode[i][0], encode[i][1]);

          // e_i' = min(max(e_i, 0), Size_i - 1)
          var size_i = size[i];
          e = Math.min(Math.max(e, 0), size_i - 1);

          // Adjusting the cube: N and vertex sample index
          var e0 = e < size_i - 1 ? Math.floor(e) : e - 1; // e1 = e0 + 1;
          var n0 = e0 + 1 - e; // (e1 - e) / (e1 - e0);
          var n1 = e - e0; // (e - e0) / (e1 - e0);
          var offset0 = e0 * k;
          var offset1 = offset0 + k; // e1 * k
          for (j = 0; j < cubeVertices; j++) {
            if (j & pos) {
              cubeN[j] *= n1;
              cubeVertex[j] += offset1;
            } else {
              cubeN[j] *= n0;
              cubeVertex[j] += offset0;
            }
          }

          k *= size_i;
          pos <<= 1;
        }

        for (j = 0; j < n; ++j) {
          // Sum all cube vertices' samples portions
          var rj = 0;
          for (i = 0; i < cubeVertices; i++) {
            rj += samples[cubeVertex[i] + j] * cubeN[i];
          }

          // r_j' = Interpolate(r_j, 0, 2^BitsPerSample - 1,
          //                    Decode_2j, Decode_2j+1)
          rj = interpolate(rj, 0, 1, decode[j][0], decode[j][1]);

          // y_j = min(max(r_j, range_2j), range_2j+1)
          dest[destOffset + j] = Math.min(Math.max(rj, range[j][0]),
                                          range[j][1]);
        }
      };
    },

    constructInterpolated: function PDFFunction_constructInterpolated(str,
                                                                      dict) {
      var c0 = dict.get('C0') || [0];
      var c1 = dict.get('C1') || [1];
      var n = dict.get('N');

      if (!isArray(c0) || !isArray(c1)) {
        error('Illegal dictionary for interpolated function');
      }

      var length = c0.length;
      var diff = [];
      for (var i = 0; i < length; ++i) {
        diff.push(c1[i] - c0[i]);
      }

      return [CONSTRUCT_INTERPOLATED, c0, diff, n];
    },

    constructInterpolatedFromIR:
      function PDFFunction_constructInterpolatedFromIR(IR) {
      var c0 = IR[1];
      var diff = IR[2];
      var n = IR[3];

      var length = diff.length;

      return function constructInterpolatedFromIRResult(src, srcOffset,
                                                        dest, destOffset) {
        var x = n === 1 ? src[srcOffset] : Math.pow(src[srcOffset], n);

        for (var j = 0; j < length; ++j) {
          dest[destOffset + j] = c0[j] + (x * diff[j]);
        }
      };
    },

    constructStiched: function PDFFunction_constructStiched(fn, dict, xref) {
      var domain = dict.get('Domain');

      if (!domain) {
        error('No domain');
      }

      var inputSize = domain.length / 2;
      if (inputSize !== 1) {
        error('Bad domain for stiched function');
      }

      var fnRefs = dict.get('Functions');
      var fns = [];
      for (var i = 0, ii = fnRefs.length; i < ii; ++i) {
        fns.push(PDFFunction.getIR(xref, xref.fetchIfRef(fnRefs[i])));
      }

      var bounds = dict.get('Bounds');
      var encode = dict.get('Encode');

      return [CONSTRUCT_STICHED, domain, bounds, encode, fns];
    },

    constructStichedFromIR: function PDFFunction_constructStichedFromIR(IR) {
      var domain = IR[1];
      var bounds = IR[2];
      var encode = IR[3];
      var fnsIR = IR[4];
      var fns = [];
      var tmpBuf = new Float32Array(1);

      for (var i = 0, ii = fnsIR.length; i < ii; i++) {
        fns.push(PDFFunction.fromIR(fnsIR[i]));
      }

      return function constructStichedFromIRResult(src, srcOffset,
                                                   dest, destOffset) {
        var clip = function constructStichedFromIRClip(v, min, max) {
          if (v > max) {
            v = max;
          } else if (v < min) {
            v = min;
          }
          return v;
        };

        // clip to domain
        var v = clip(src[srcOffset], domain[0], domain[1]);
        // calulate which bound the value is in
        for (var i = 0, ii = bounds.length; i < ii; ++i) {
          if (v < bounds[i]) {
            break;
          }
        }

        // encode value into domain of function
        var dmin = domain[0];
        if (i > 0) {
          dmin = bounds[i - 1];
        }
        var dmax = domain[1];
        if (i < bounds.length) {
          dmax = bounds[i];
        }

        var rmin = encode[2 * i];
        var rmax = encode[2 * i + 1];

        tmpBuf[0] = rmin + (v - dmin) * (rmax - rmin) / (dmax - dmin);

        // call the appropriate function
        fns[i](tmpBuf, 0, dest, destOffset);
      };
    },

    constructPostScript: function PDFFunction_constructPostScript(fn, dict,
                                                                  xref) {
      var domain = dict.get('Domain');
      var range = dict.get('Range');

      if (!domain) {
        error('No domain.');
      }

      if (!range) {
        error('No range.');
      }

      var lexer = new PostScriptLexer(fn);
      var parser = new PostScriptParser(lexer);
      var code = parser.parse();

      return [CONSTRUCT_POSTSCRIPT, domain, range, code];
    },

    constructPostScriptFromIR: function PDFFunction_constructPostScriptFromIR(
                                          IR) {
      var domain = IR[1];
      var range = IR[2];
      var code = IR[3];

      var compiled = (new PostScriptCompiler()).compile(code, domain, range);
      if (compiled) {
        // Compiled function consists of simple expressions such as addition,
        // subtraction, Math.max, and also contains 'var' and 'return'
        // statements. See the generation in the PostScriptCompiler below.
        /*jshint -W054 */
        return new Function('src', 'srcOffset', 'dest', 'destOffset', compiled);
      }

      info('Unable to compile PS function');

      var numOutputs = range.length >> 1;
      var numInputs = domain.length >> 1;
      var evaluator = new PostScriptEvaluator(code);
      // Cache the values for a big speed up, the cache size is limited though
      // since the number of possible values can be huge from a PS function.
      var cache = {};
      // The MAX_CACHE_SIZE is set to ~4x the maximum number of distinct values
      // seen in our tests.
      var MAX_CACHE_SIZE = 2048 * 4;
      var cache_available = MAX_CACHE_SIZE;
      var tmpBuf = new Float32Array(numInputs);

      return function constructPostScriptFromIRResult(src, srcOffset,
                                                      dest, destOffset) {
        var i, value;
        var key = '';
        var input = tmpBuf;
        for (i = 0; i < numInputs; i++) {
          value = src[srcOffset + i];
          input[i] = value;
          key += value + '_';
        }

        var cachedValue = cache[key];
        if (cachedValue !== undefined) {
          dest.set(cachedValue, destOffset);
          return;
        }

        var output = new Float32Array(numOutputs);
        var stack = evaluator.execute(input);
        var stackIndex = stack.length - numOutputs;
        for (i = 0; i < numOutputs; i++) {
          value = stack[stackIndex + i];
          var bound = range[i * 2];
          if (value < bound) {
            value = bound;
          } else {
            bound = range[i * 2 +1];
            if (value > bound) {
              value = bound;
            }
          }
          output[i] = value;
        }
        if (cache_available > 0) {
          cache_available--;
          cache[key] = output;
        }
        dest.set(output, destOffset);
      };
    }
  };
})();

function isPDFFunction(v) {
  var fnDict;
  if (typeof v !== 'object') {
    return false;
  } else if (isDict(v)) {
    fnDict = v;
  } else if (isStream(v)) {
    fnDict = v.dict;
  } else {
    return false;
  }
  return fnDict.has('FunctionType');
}

var PostScriptStack = (function PostScriptStackClosure() {
  var MAX_STACK_SIZE = 100;
  function PostScriptStack(initialStack) {
    this.stack = !initialStack ? [] :
                 Array.prototype.slice.call(initialStack, 0);
  }

  PostScriptStack.prototype = {
    push: function PostScriptStack_push(value) {
      if (this.stack.length >= MAX_STACK_SIZE) {
        error('PostScript function stack overflow.');
      }
      this.stack.push(value);
    },
    pop: function PostScriptStack_pop() {
      if (this.stack.length <= 0) {
        error('PostScript function stack underflow.');
      }
      return this.stack.pop();
    },
    copy: function PostScriptStack_copy(n) {
      if (this.stack.length + n >= MAX_STACK_SIZE) {
        error('PostScript function stack overflow.');
      }
      var stack = this.stack;
      for (var i = stack.length - n, j = n - 1; j >= 0; j--, i++) {
        stack.push(stack[i]);
      }
    },
    index: function PostScriptStack_index(n) {
      this.push(this.stack[this.stack.length - n - 1]);
    },
    // rotate the last n stack elements p times
    roll: function PostScriptStack_roll(n, p) {
      var stack = this.stack;
      var l = stack.length - n;
      var r = stack.length - 1, c = l + (p - Math.floor(p / n) * n), i, j, t;
      for (i = l, j = r; i < j; i++, j--) {
        t = stack[i]; stack[i] = stack[j]; stack[j] = t;
      }
      for (i = l, j = c - 1; i < j; i++, j--) {
        t = stack[i]; stack[i] = stack[j]; stack[j] = t;
      }
      for (i = c, j = r; i < j; i++, j--) {
        t = stack[i]; stack[i] = stack[j]; stack[j] = t;
      }
    }
  };
  return PostScriptStack;
})();
var PostScriptEvaluator = (function PostScriptEvaluatorClosure() {
  function PostScriptEvaluator(operators) {
    this.operators = operators;
  }
  PostScriptEvaluator.prototype = {
    execute: function PostScriptEvaluator_execute(initialStack) {
      var stack = new PostScriptStack(initialStack);
      var counter = 0;
      var operators = this.operators;
      var length = operators.length;
      var operator, a, b;
      while (counter < length) {
        operator = operators[counter++];
        if (typeof operator === 'number') {
          // Operator is really an operand and should be pushed to the stack.
          stack.push(operator);
          continue;
        }
        switch (operator) {
          // non standard ps operators
          case 'jz': // jump if false
            b = stack.pop();
            a = stack.pop();
            if (!a) {
              counter = b;
            }
            break;
          case 'j': // jump
            a = stack.pop();
            counter = a;
            break;

          // all ps operators in alphabetical order (excluding if/ifelse)
          case 'abs':
            a = stack.pop();
            stack.push(Math.abs(a));
            break;
          case 'add':
            b = stack.pop();
            a = stack.pop();
            stack.push(a + b);
            break;
          case 'and':
            b = stack.pop();
            a = stack.pop();
            if (isBool(a) && isBool(b)) {
              stack.push(a && b);
            } else {
              stack.push(a & b);
            }
            break;
          case 'atan':
            a = stack.pop();
            stack.push(Math.atan(a));
            break;
          case 'bitshift':
            b = stack.pop();
            a = stack.pop();
            if (a > 0) {
              stack.push(a << b);
            } else {
              stack.push(a >> b);
            }
            break;
          case 'ceiling':
            a = stack.pop();
            stack.push(Math.ceil(a));
            break;
          case 'copy':
            a = stack.pop();
            stack.copy(a);
            break;
          case 'cos':
            a = stack.pop();
            stack.push(Math.cos(a));
            break;
          case 'cvi':
            a = stack.pop() | 0;
            stack.push(a);
            break;
          case 'cvr':
            // noop
            break;
          case 'div':
            b = stack.pop();
            a = stack.pop();
            stack.push(a / b);
            break;
          case 'dup':
            stack.copy(1);
            break;
          case 'eq':
            b = stack.pop();
            a = stack.pop();
            stack.push(a === b);
            break;
          case 'exch':
            stack.roll(2, 1);
            break;
          case 'exp':
            b = stack.pop();
            a = stack.pop();
            stack.push(Math.pow(a, b));
            break;
          case 'false':
            stack.push(false);
            break;
          case 'floor':
            a = stack.pop();
            stack.push(Math.floor(a));
            break;
          case 'ge':
            b = stack.pop();
            a = stack.pop();
            stack.push(a >= b);
            break;
          case 'gt':
            b = stack.pop();
            a = stack.pop();
            stack.push(a > b);
            break;
          case 'idiv':
            b = stack.pop();
            a = stack.pop();
            stack.push((a / b) | 0);
            break;
          case 'index':
            a = stack.pop();
            stack.index(a);
            break;
          case 'le':
            b = stack.pop();
            a = stack.pop();
            stack.push(a <= b);
            break;
          case 'ln':
            a = stack.pop();
            stack.push(Math.log(a));
            break;
          case 'log':
            a = stack.pop();
            stack.push(Math.log(a) / Math.LN10);
            break;
          case 'lt':
            b = stack.pop();
            a = stack.pop();
            stack.push(a < b);
            break;
          case 'mod':
            b = stack.pop();
            a = stack.pop();
            stack.push(a % b);
            break;
          case 'mul':
            b = stack.pop();
            a = stack.pop();
            stack.push(a * b);
            break;
          case 'ne':
            b = stack.pop();
            a = stack.pop();
            stack.push(a !== b);
            break;
          case 'neg':
            a = stack.pop();
            stack.push(-a);
            break;
          case 'not':
            a = stack.pop();
            if (isBool(a)) {
              stack.push(!a);
            } else {
              stack.push(~a);
            }
            break;
          case 'or':
            b = stack.pop();
            a = stack.pop();
            if (isBool(a) && isBool(b)) {
              stack.push(a || b);
            } else {
              stack.push(a | b);
            }
            break;
          case 'pop':
            stack.pop();
            break;
          case 'roll':
            b = stack.pop();
            a = stack.pop();
            stack.roll(a, b);
            break;
          case 'round':
            a = stack.pop();
            stack.push(Math.round(a));
            break;
          case 'sin':
            a = stack.pop();
            stack.push(Math.sin(a));
            break;
          case 'sqrt':
            a = stack.pop();
            stack.push(Math.sqrt(a));
            break;
          case 'sub':
            b = stack.pop();
            a = stack.pop();
            stack.push(a - b);
            break;
          case 'true':
            stack.push(true);
            break;
          case 'truncate':
            a = stack.pop();
            a = a < 0 ? Math.ceil(a) : Math.floor(a);
            stack.push(a);
            break;
          case 'xor':
            b = stack.pop();
            a = stack.pop();
            if (isBool(a) && isBool(b)) {
              stack.push(a !== b);
            } else {
              stack.push(a ^ b);
            }
            break;
          default:
            error('Unknown operator ' + operator);
            break;
        }
      }
      return stack.stack;
    }
  };
  return PostScriptEvaluator;
})();

// Most of the PDFs functions consist of simple operations such as:
//   roll, exch, sub, cvr, pop, index, dup, mul, if, gt, add.
//
// We can compile most of such programs, and at the same moment, we can
// optimize some expressions using basic math properties. Keeping track of
// min/max values will allow us to avoid extra Math.min/Math.max calls.
var PostScriptCompiler = (function PostScriptCompilerClosure() {
  function AstNode(type) {
    this.type = type;
  }
  AstNode.prototype.visit = function (visitor) {
    throw new Error('abstract method');
  };

  function AstArgument(index, min, max) {
    AstNode.call(this, 'args');
    this.index = index;
    this.min = min;
    this.max = max;
  }
  AstArgument.prototype = Object.create(AstNode.prototype);
  AstArgument.prototype.visit = function (visitor) {
    visitor.visitArgument(this);
  };

  function AstLiteral(number) {
    AstNode.call(this, 'literal');
    this.number = number;
    this.min = number;
    this.max = number;
  }
  AstLiteral.prototype = Object.create(AstNode.prototype);
  AstLiteral.prototype.visit = function (visitor) {
    visitor.visitLiteral(this);
  };

  function AstBinaryOperation(op, arg1, arg2, min, max) {
    AstNode.call(this, 'binary');
    this.op = op;
    this.arg1 = arg1;
    this.arg2 = arg2;
    this.min = min;
    this.max = max;
  }
  AstBinaryOperation.prototype = Object.create(AstNode.prototype);
  AstBinaryOperation.prototype.visit = function (visitor) {
    visitor.visitBinaryOperation(this);
  };

  function AstMin(arg, max) {
    AstNode.call(this, 'max');
    this.arg = arg;
    this.min = arg.min;
    this.max = max;
  }
  AstMin.prototype = Object.create(AstNode.prototype);
  AstMin.prototype.visit = function (visitor) {
    visitor.visitMin(this);
  };

  function AstVariable(index, min, max) {
    AstNode.call(this, 'var');
    this.index = index;
    this.min = min;
    this.max = max;
  }
  AstVariable.prototype = Object.create(AstNode.prototype);
  AstVariable.prototype.visit = function (visitor) {
    visitor.visitVariable(this);
  };

  function AstVariableDefinition(variable, arg) {
    AstNode.call(this, 'definition');
    this.variable = variable;
    this.arg = arg;
  }
  AstVariableDefinition.prototype = Object.create(AstNode.prototype);
  AstVariableDefinition.prototype.visit = function (visitor) {
    visitor.visitVariableDefinition(this);
  };

  function ExpressionBuilderVisitor() {
    this.parts = [];
  }
  ExpressionBuilderVisitor.prototype = {
    visitArgument: function (arg) {
      this.parts.push('Math.max(', arg.min, ', Math.min(',
                      arg.max, ', src[srcOffset + ', arg.index, ']))');
    },
    visitVariable: function (variable) {
      this.parts.push('v', variable.index);
    },
    visitLiteral: function (literal) {
      this.parts.push(literal.number);
    },
    visitBinaryOperation: function (operation) {
      this.parts.push('(');
      operation.arg1.visit(this);
      this.parts.push(' ', operation.op, ' ');
      operation.arg2.visit(this);
      this.parts.push(')');
    },
    visitVariableDefinition: function (definition) {
      this.parts.push('var ');
      definition.variable.visit(this);
      this.parts.push(' = ');
      definition.arg.visit(this);
      this.parts.push(';');
    },
    visitMin: function (max) {
      this.parts.push('Math.min(');
      max.arg.visit(this);
      this.parts.push(', ', max.max, ')');
    },
    toString: function () {
      return this.parts.join('');
    }
  };

  function buildAddOperation(num1, num2) {
    if (num2.type === 'literal' && num2.number === 0) {
      // optimization: second operand is 0
      return num1;
    }
    if (num1.type === 'literal' && num1.number === 0) {
      // optimization: first operand is 0
      return num2;
    }
    if (num2.type === 'literal' && num1.type === 'literal') {
      // optimization: operands operand are literals
      return new AstLiteral(num1.number + num2.number);
    }
    return new AstBinaryOperation('+', num1, num2,
                                  num1.min + num2.min, num1.max + num2.max);
  }

  function buildMulOperation(num1, num2) {
    if (num2.type === 'literal') {
      // optimization: second operands is a literal...
      if (num2.number === 0) {
        return new AstLiteral(0); // and it's 0
      } else if (num2.number === 1) {
        return num1; // and it's 1
      } else if (num1.type === 'literal') {
        // ... and first operands is a literal too
        return new AstLiteral(num1.number * num2.number);
      }
    }
    if (num1.type === 'literal') {
      // optimization: first operands is a literal...
      if (num1.number === 0) {
        return new AstLiteral(0); // and it's 0
      } else if (num1.number === 1) {
        return num2; // and it's 1
      }
    }
    var min = Math.min(num1.min * num2.min, num1.min * num2.max,
                       num1.max * num2.min, num1.max * num2.max);
    var max = Math.max(num1.min * num2.min, num1.min * num2.max,
                       num1.max * num2.min, num1.max * num2.max);
    return new AstBinaryOperation('*', num1, num2, min, max);
  }

  function buildSubOperation(num1, num2) {
    if (num2.type === 'literal') {
      // optimization: second operands is a literal...
      if (num2.number === 0) {
        return num1; // ... and it's 0
      } else if (num1.type === 'literal') {
        // ... and first operands is a literal too
        return new AstLiteral(num1.number - num2.number);
      }
    }
    if (num2.type === 'binary' && num2.op === '-' &&
      num1.type === 'literal' && num1.number === 1 &&
      num2.arg1.type === 'literal' && num2.arg1.number === 1) {
      // optimization for case: 1 - (1 - x)
      return num2.arg2;
    }
    return new AstBinaryOperation('-', num1, num2,
                                  num1.min - num2.max, num1.max - num2.min);
  }

  function buildMinOperation(num1, max) {
    if (num1.min >= max) {
      // optimization: num1 min value is not less than required max
      return new AstLiteral(max); // just returning max
    } else if (num1.max <= max) {
      // optimization: num1 max value is not greater than required max
      return num1; // just returning an argument
    }
    return new AstMin(num1, max);
  }

  function PostScriptCompiler() {}
  PostScriptCompiler.prototype = {
    compile: function PostScriptCompiler_compile(code, domain, range) {
      var stack = [];
      var i, ii;
      var instructions = [];
      var inputSize = domain.length >> 1, outputSize = range.length >> 1;
      var lastRegister = 0;
      var n, j, min, max;
      var num1, num2, ast1, ast2, tmpVar, item;
      for (i = 0; i < inputSize; i++) {
        stack.push(new AstArgument(i, domain[i * 2], domain[i * 2 + 1]));
      }

      for (i = 0, ii = code.length; i < ii; i++) {
        item = code[i];
        if (typeof item === 'number') {
          stack.push(new AstLiteral(item));
          continue;
        }

        switch (item) {
          case 'add':
            if (stack.length < 2) {
              return null;
            }
            num2 = stack.pop();
            num1 = stack.pop();
            stack.push(buildAddOperation(num1, num2));
            break;
          case 'cvr':
            if (stack.length < 1) {
              return null;
            }
            break;
          case 'mul':
            if (stack.length < 2) {
              return null;
            }
            num2 = stack.pop();
            num1 = stack.pop();
            stack.push(buildMulOperation(num1, num2));
            break;
          case 'sub':
            if (stack.length < 2) {
              return null;
            }
            num2 = stack.pop();
            num1 = stack.pop();
            stack.push(buildSubOperation(num1, num2));
            break;
          case 'exch':
            if (stack.length < 2) {
              return null;
            }
            ast1 = stack.pop(); ast2 = stack.pop();
            stack.push(ast1, ast2);
            break;
          case 'pop':
            if (stack.length < 1) {
              return null;
            }
            stack.pop();
            break;
          case 'index':
            if (stack.length < 1) {
              return null;
            }
            num1 = stack.pop();
            if (num1.type !== 'literal') {
              return null;
            }
            n = num1.number;
            if (n < 0 || (n|0) !== n || stack.length < n) {
              return null;
            }
            ast1 = stack[stack.length - n - 1];
            if (ast1.type === 'literal' || ast1.type === 'var') {
              stack.push(ast1);
              break;
            }
            tmpVar = new AstVariable(lastRegister++, ast1.min, ast1.max);
            stack[stack.length - n - 1] = tmpVar;
            stack.push(tmpVar);
            instructions.push(new AstVariableDefinition(tmpVar, ast1));
            break;
          case 'dup':
            if (stack.length < 1) {
              return null;
            }
            if (typeof code[i + 1] === 'number' && code[i + 2] === 'gt' &&
                code[i + 3] === i + 7 && code[i + 4] === 'jz' &&
                code[i + 5] === 'pop' && code[i + 6] === code[i + 1]) {
              // special case of the commands sequence for the min operation
              num1 = stack.pop();
              stack.push(buildMinOperation(num1, code[i + 1]));
              i += 6;
              break;
            }
            ast1 = stack[stack.length - 1];
            if (ast1.type === 'literal' || ast1.type === 'var') {
              // we don't have to save into intermediate variable a literal or
              // variable.
              stack.push(ast1);
              break;
            }
            tmpVar = new AstVariable(lastRegister++, ast1.min, ast1.max);
            stack[stack.length - 1] = tmpVar;
            stack.push(tmpVar);
            instructions.push(new AstVariableDefinition(tmpVar, ast1));
            break;
          case 'roll':
            if (stack.length < 2) {
              return null;
            }
            num2 = stack.pop();
            num1 = stack.pop();
            if (num2.type !== 'literal' || num1.type !== 'literal') {
              // both roll operands must be numbers
              return null;
            }
            j = num2.number;
            n = num1.number;
            if (n <= 0 || (n|0) !== n || (j|0) !== j || stack.length < n) {
              // ... and integers
              return null;
            }
            j = ((j % n) + n) % n;
            if (j === 0) {
              break; // just skipping -- there are nothing to rotate
            }
            Array.prototype.push.apply(stack,
                                       stack.splice(stack.length - n, n - j));
            break;
          default:
            return null; // unsupported operator
        }
      }

      if (stack.length !== outputSize) {
        return null;
      }

      var result = [];
      instructions.forEach(function (instruction) {
        var statementBuilder = new ExpressionBuilderVisitor();
        instruction.visit(statementBuilder);
        result.push(statementBuilder.toString());
      });
      stack.forEach(function (expr, i) {
        var statementBuilder = new ExpressionBuilderVisitor();
        expr.visit(statementBuilder);
        var min = range[i * 2], max = range[i * 2 + 1];
        var out = [statementBuilder.toString()];
        if (min > expr.min) {
          out.unshift('Math.max(', min, ', ');
          out.push(')');
        }
        if (max < expr.max) {
          out.unshift('Math.min(', max, ', ');
          out.push(')');
        }
        out.unshift('dest[destOffset + ', i, '] = ');
        out.push(';');
        result.push(out.join(''));
      });
      return result.join('\n');
    }
  };

  return PostScriptCompiler;
})();


var ColorSpace = (function ColorSpaceClosure() {
  // Constructor should define this.numComps, this.defaultColor, this.name
  function ColorSpace() {
    error('should not call ColorSpace constructor');
  }

  ColorSpace.prototype = {
    /**
     * Converts the color value to the RGB color. The color components are
     * located in the src array starting from the srcOffset. Returns the array
     * of the rgb components, each value ranging from [0,255].
     */
    getRgb: function ColorSpace_getRgb(src, srcOffset) {
      var rgb = new Uint8Array(3);
      this.getRgbItem(src, srcOffset, rgb, 0);
      return rgb;
    },
    /**
     * Converts the color value to the RGB color, similar to the getRgb method.
     * The result placed into the dest array starting from the destOffset.
     */
    getRgbItem: function ColorSpace_getRgbItem(src, srcOffset,
                                               dest, destOffset) {
      error('Should not call ColorSpace.getRgbItem');
    },
    /**
     * Converts the specified number of the color values to the RGB colors.
     * The colors are located in the src array starting from the srcOffset.
     * The result is placed into the dest array starting from the destOffset.
     * The src array items shall be in [0,2^bits) range, the dest array items
     * will be in [0,255] range. alpha01 indicates how many alpha components
     * there are in the dest array; it will be either 0 (RGB array) or 1 (RGBA
     * array).
     */
    getRgbBuffer: function ColorSpace_getRgbBuffer(src, srcOffset, count,
                                                   dest, destOffset, bits,
                                                   alpha01) {
      error('Should not call ColorSpace.getRgbBuffer');
    },
    /**
     * Determines the number of bytes required to store the result of the
     * conversion done by the getRgbBuffer method. As in getRgbBuffer,
     * |alpha01| is either 0 (RGB output) or 1 (RGBA output).
     */
    getOutputLength: function ColorSpace_getOutputLength(inputLength,
                                                         alpha01) {
      error('Should not call ColorSpace.getOutputLength');
    },
    /**
     * Returns true if source data will be equal the result/output data.
     */
    isPassthrough: function ColorSpace_isPassthrough(bits) {
      return false;
    },
    /**
     * Fills in the RGB colors in the destination buffer.  alpha01 indicates
     * how many alpha components there are in the dest array; it will be either
     * 0 (RGB array) or 1 (RGBA array).
     */
    fillRgb: function ColorSpace_fillRgb(dest, originalWidth,
                                         originalHeight, width, height,
                                         actualHeight, bpc, comps, alpha01) {
      var count = originalWidth * originalHeight;
      var rgbBuf = null;
      var numComponentColors = 1 << bpc;
      var needsResizing = originalHeight !== height || originalWidth !== width;
      var i, ii;

      if (this.isPassthrough(bpc)) {
        rgbBuf = comps;
      } else if (this.numComps === 1 && count > numComponentColors &&
          this.name !== 'DeviceGray' && this.name !== 'DeviceRGB') {
        // Optimization: create a color map when there is just one component and
        // we are converting more colors than the size of the color map. We
        // don't build the map if the colorspace is gray or rgb since those
        // methods are faster than building a map. This mainly offers big speed
        // ups for indexed and alternate colorspaces.
        //
        // TODO it may be worth while to cache the color map. While running
        // testing I never hit a cache so I will leave that out for now (perhaps
        // we are reparsing colorspaces too much?).
        var allColors = bpc <= 8 ? new Uint8Array(numComponentColors) :
                                   new Uint16Array(numComponentColors);
        var key;
        for (i = 0; i < numComponentColors; i++) {
          allColors[i] = i;
        }
        var colorMap = new Uint8Array(numComponentColors * 3);
        this.getRgbBuffer(allColors, 0, numComponentColors, colorMap, 0, bpc,
                          /* alpha01 = */ 0);

        var destPos, rgbPos;
        if (!needsResizing) {
          // Fill in the RGB values directly into |dest|.
          destPos = 0;
          for (i = 0; i < count; ++i) {
            key = comps[i] * 3;
            dest[destPos++] = colorMap[key];
            dest[destPos++] = colorMap[key + 1];
            dest[destPos++] = colorMap[key + 2];
            destPos += alpha01;
          }
        } else {
          rgbBuf = new Uint8Array(count * 3);
          rgbPos = 0;
          for (i = 0; i < count; ++i) {
            key = comps[i] * 3;
            rgbBuf[rgbPos++] = colorMap[key];
            rgbBuf[rgbPos++] = colorMap[key + 1];
            rgbBuf[rgbPos++] = colorMap[key + 2];
          }
        }
      } else {
        if (!needsResizing) {
          // Fill in the RGB values directly into |dest|.
          this.getRgbBuffer(comps, 0, width * actualHeight, dest, 0, bpc,
                            alpha01);
        } else {
          rgbBuf = new Uint8Array(count * 3);
          this.getRgbBuffer(comps, 0, count, rgbBuf, 0, bpc,
                            /* alpha01 = */ 0);
        }
      }

      if (rgbBuf) {
        if (needsResizing) {
          PDFImage.resize(rgbBuf, bpc, 3, originalWidth, originalHeight, width,
                          height, dest, alpha01);
        } else {
          rgbPos = 0;
          destPos = 0;
          for (i = 0, ii = width * actualHeight; i < ii; i++) {
            dest[destPos++] = rgbBuf[rgbPos++];
            dest[destPos++] = rgbBuf[rgbPos++];
            dest[destPos++] = rgbBuf[rgbPos++];
            destPos += alpha01;
          }
        }
      }
    },
    /**
     * True if the colorspace has components in the default range of [0, 1].
     * This should be true for all colorspaces except for lab color spaces
     * which are [0,100], [-128, 127], [-128, 127].
     */
    usesZeroToOneRange: true
  };

  ColorSpace.parse = function ColorSpace_parse(cs, xref, res) {
    var IR = ColorSpace.parseToIR(cs, xref, res);
    if (IR instanceof AlternateCS) {
      return IR;
    }
    return ColorSpace.fromIR(IR);
  };

  ColorSpace.fromIR = function ColorSpace_fromIR(IR) {
    var name = isArray(IR) ? IR[0] : IR;
    var whitePoint, blackPoint, gamma;

    switch (name) {
      case 'DeviceGrayCS':
        return this.singletons.gray;
      case 'DeviceRgbCS':
        return this.singletons.rgb;
      case 'DeviceCmykCS':
        return this.singletons.cmyk;
      case 'CalGrayCS':
        whitePoint = IR[1].WhitePoint;
        blackPoint = IR[1].BlackPoint;
        gamma = IR[1].Gamma;
        return new CalGrayCS(whitePoint, blackPoint, gamma);
      case 'CalRGBCS':
        whitePoint = IR[1].WhitePoint;
        blackPoint = IR[1].BlackPoint;
        gamma = IR[1].Gamma;
        var matrix = IR[1].Matrix;
        return new CalRGBCS(whitePoint, blackPoint, gamma, matrix);
      case 'PatternCS':
        var basePatternCS = IR[1];
        if (basePatternCS) {
          basePatternCS = ColorSpace.fromIR(basePatternCS);
        }
        return new PatternCS(basePatternCS);
      case 'IndexedCS':
        var baseIndexedCS = IR[1];
        var hiVal = IR[2];
        var lookup = IR[3];
        return new IndexedCS(ColorSpace.fromIR(baseIndexedCS), hiVal, lookup);
      case 'AlternateCS':
        var numComps = IR[1];
        var alt = IR[2];
        var tintFnIR = IR[3];

        return new AlternateCS(numComps, ColorSpace.fromIR(alt),
                                PDFFunction.fromIR(tintFnIR));
      case 'LabCS':
        whitePoint = IR[1].WhitePoint;
        blackPoint = IR[1].BlackPoint;
        var range = IR[1].Range;
        return new LabCS(whitePoint, blackPoint, range);
      default:
        error('Unknown name ' + name);
    }
    return null;
  };

  ColorSpace.parseToIR = function ColorSpace_parseToIR(cs, xref, res) {
    if (isName(cs)) {
      var colorSpaces = res.get('ColorSpace');
      if (isDict(colorSpaces)) {
        var refcs = colorSpaces.get(cs.name);
        if (refcs) {
          cs = refcs;
        }
      }
    }

    cs = xref.fetchIfRef(cs);
    var mode;

    if (isName(cs)) {
      mode = cs.name;
      this.mode = mode;

      switch (mode) {
        case 'DeviceGray':
        case 'G':
          return 'DeviceGrayCS';
        case 'DeviceRGB':
        case 'RGB':
          return 'DeviceRgbCS';
        case 'DeviceCMYK':
        case 'CMYK':
          return 'DeviceCmykCS';
        case 'Pattern':
          return ['PatternCS', null];
        default:
          error('unrecognized colorspace ' + mode);
      }
    } else if (isArray(cs)) {
      mode = cs[0].name;
      this.mode = mode;
      var numComps, params;

      switch (mode) {
        case 'DeviceGray':
        case 'G':
          return 'DeviceGrayCS';
        case 'DeviceRGB':
        case 'RGB':
          return 'DeviceRgbCS';
        case 'DeviceCMYK':
        case 'CMYK':
          return 'DeviceCmykCS';
        case 'CalGray':
          params = xref.fetchIfRef(cs[1]).getAll();
          return ['CalGrayCS', params];
        case 'CalRGB':
          params = xref.fetchIfRef(cs[1]).getAll();
          return ['CalRGBCS', params];
        case 'ICCBased':
          var stream = xref.fetchIfRef(cs[1]);
          var dict = stream.dict;
          numComps = dict.get('N');
          if (numComps === 1) {
            return 'DeviceGrayCS';
          } else if (numComps === 3) {
            return 'DeviceRgbCS';
          } else if (numComps === 4) {
            return 'DeviceCmykCS';
          }
          break;
        case 'Pattern':
          var basePatternCS = cs[1];
          if (basePatternCS) {
            basePatternCS = ColorSpace.parseToIR(basePatternCS, xref, res);
          }
          return ['PatternCS', basePatternCS];
        case 'Indexed':
        case 'I':
          var baseIndexedCS = ColorSpace.parseToIR(cs[1], xref, res);
          var hiVal = cs[2] + 1;
          var lookup = xref.fetchIfRef(cs[3]);
          if (isStream(lookup)) {
            lookup = lookup.getBytes();
          }
          return ['IndexedCS', baseIndexedCS, hiVal, lookup];
        case 'Separation':
        case 'DeviceN':
          var name = cs[1];
          numComps = 1;
          if (isName(name)) {
            numComps = 1;
          } else if (isArray(name)) {
            numComps = name.length;
          }
          var alt = ColorSpace.parseToIR(cs[2], xref, res);
          var tintFnIR = PDFFunction.getIR(xref, xref.fetchIfRef(cs[3]));
          return ['AlternateCS', numComps, alt, tintFnIR];
        case 'Lab':
          params = cs[1].getAll();
          return ['LabCS', params];
        default:
          error('unimplemented color space object "' + mode + '"');
      }
    } else {
      error('unrecognized color space object: "' + cs + '"');
    }
    return null;
  };
  /**
   * Checks if a decode map matches the default decode map for a color space.
   * This handles the general decode maps where there are two values per
   * component. e.g. [0, 1, 0, 1, 0, 1] for a RGB color.
   * This does not handle Lab, Indexed, or Pattern decode maps since they are
   * slightly different.
   * @param {Array} decode Decode map (usually from an image).
   * @param {Number} n Number of components the color space has.
   */
  ColorSpace.isDefaultDecode = function ColorSpace_isDefaultDecode(decode, n) {
    if (!decode) {
      return true;
    }

    if (n * 2 !== decode.length) {
      warn('The decode map is not the correct length');
      return true;
    }
    for (var i = 0, ii = decode.length; i < ii; i += 2) {
      if (decode[i] !== 0 || decode[i + 1] !== 1) {
        return false;
      }
    }
    return true;
  };

  ColorSpace.singletons = {
    get gray() {
      return shadow(this, 'gray', new DeviceGrayCS());
    },
    get rgb() {
      return shadow(this, 'rgb', new DeviceRgbCS());
    },
    get cmyk() {
      return shadow(this, 'cmyk', new DeviceCmykCS());
    }
  };

  return ColorSpace;
})();

/**
 * Alternate color space handles both Separation and DeviceN color spaces.  A
 * Separation color space is actually just a DeviceN with one color component.
 * Both color spaces use a tinting function to convert colors to a base color
 * space.
 */
var AlternateCS = (function AlternateCSClosure() {
  function AlternateCS(numComps, base, tintFn) {
    this.name = 'Alternate';
    this.numComps = numComps;
    this.defaultColor = new Float32Array(numComps);
    for (var i = 0; i < numComps; ++i) {
      this.defaultColor[i] = 1;
    }
    this.base = base;
    this.tintFn = tintFn;
    this.tmpBuf = new Float32Array(base.numComps);
  }

  AlternateCS.prototype = {
    getRgb: ColorSpace.prototype.getRgb,
    getRgbItem: function AlternateCS_getRgbItem(src, srcOffset,
                                                dest, destOffset) {
      var tmpBuf = this.tmpBuf;
      this.tintFn(src, srcOffset, tmpBuf, 0);
      this.base.getRgbItem(tmpBuf, 0, dest, destOffset);
    },
    getRgbBuffer: function AlternateCS_getRgbBuffer(src, srcOffset, count,
                                                    dest, destOffset, bits,
                                                    alpha01) {
      var tintFn = this.tintFn;
      var base = this.base;
      var scale = 1 / ((1 << bits) - 1);
      var baseNumComps = base.numComps;
      var usesZeroToOneRange = base.usesZeroToOneRange;
      var isPassthrough = (base.isPassthrough(8) || !usesZeroToOneRange) &&
                          alpha01 === 0;
      var pos = isPassthrough ? destOffset : 0;
      var baseBuf = isPassthrough ? dest : new Uint8Array(baseNumComps * count);
      var numComps = this.numComps;

      var scaled = new Float32Array(numComps);
      var tinted = new Float32Array(baseNumComps);
      var i, j;
      if (usesZeroToOneRange) {
        for (i = 0; i < count; i++) {
          for (j = 0; j < numComps; j++) {
            scaled[j] = src[srcOffset++] * scale;
          }
          tintFn(scaled, 0, tinted, 0);
          for (j = 0; j < baseNumComps; j++) {
            baseBuf[pos++] = tinted[j] * 255;
          }
        }
      } else {
        for (i = 0; i < count; i++) {
          for (j = 0; j < numComps; j++) {
            scaled[j] = src[srcOffset++] * scale;
          }
          tintFn(scaled, 0, tinted, 0);
          base.getRgbItem(tinted, 0, baseBuf, pos);
          pos += baseNumComps;
        }
      }
      if (!isPassthrough) {
        base.getRgbBuffer(baseBuf, 0, count, dest, destOffset, 8, alpha01);
      }
    },
    getOutputLength: function AlternateCS_getOutputLength(inputLength,
                                                          alpha01) {
      return this.base.getOutputLength(inputLength *
                                       this.base.numComps / this.numComps,
                                       alpha01);
    },
    isPassthrough: ColorSpace.prototype.isPassthrough,
    fillRgb: ColorSpace.prototype.fillRgb,
    isDefaultDecode: function AlternateCS_isDefaultDecode(decodeMap) {
      return ColorSpace.isDefaultDecode(decodeMap, this.numComps);
    },
    usesZeroToOneRange: true
  };

  return AlternateCS;
})();

var PatternCS = (function PatternCSClosure() {
  function PatternCS(baseCS) {
    this.name = 'Pattern';
    this.base = baseCS;
  }
  PatternCS.prototype = {};

  return PatternCS;
})();

var IndexedCS = (function IndexedCSClosure() {
  function IndexedCS(base, highVal, lookup) {
    this.name = 'Indexed';
    this.numComps = 1;
    this.defaultColor = new Uint8Array([0]);
    this.base = base;
    this.highVal = highVal;

    var baseNumComps = base.numComps;
    var length = baseNumComps * highVal;
    var lookupArray;

    if (isStream(lookup)) {
      lookupArray = new Uint8Array(length);
      var bytes = lookup.getBytes(length);
      lookupArray.set(bytes);
    } else if (isString(lookup)) {
      lookupArray = new Uint8Array(length);
      for (var i = 0; i < length; ++i) {
        lookupArray[i] = lookup.charCodeAt(i);
      }
    } else if (lookup instanceof Uint8Array || lookup instanceof Array) {
      lookupArray = lookup;
    } else {
      error('Unrecognized lookup table: ' + lookup);
    }
    this.lookup = lookupArray;
  }

  IndexedCS.prototype = {
    getRgb: ColorSpace.prototype.getRgb,
    getRgbItem: function IndexedCS_getRgbItem(src, srcOffset,
                                              dest, destOffset) {
      var numComps = this.base.numComps;
      var start = src[srcOffset] * numComps;
      this.base.getRgbItem(this.lookup, start, dest, destOffset);
    },
    getRgbBuffer: function IndexedCS_getRgbBuffer(src, srcOffset, count,
                                                  dest, destOffset, bits,
                                                  alpha01) {
      var base = this.base;
      var numComps = base.numComps;
      var outputDelta = base.getOutputLength(numComps, alpha01);
      var lookup = this.lookup;

      for (var i = 0; i < count; ++i) {
        var lookupPos = src[srcOffset++] * numComps;
        base.getRgbBuffer(lookup, lookupPos, 1, dest, destOffset, 8, alpha01);
        destOffset += outputDelta;
      }
    },
    getOutputLength: function IndexedCS_getOutputLength(inputLength, alpha01) {
      return this.base.getOutputLength(inputLength * this.base.numComps,
                                       alpha01);
    },
    isPassthrough: ColorSpace.prototype.isPassthrough,
    fillRgb: ColorSpace.prototype.fillRgb,
    isDefaultDecode: function IndexedCS_isDefaultDecode(decodeMap) {
      // indexed color maps shouldn't be changed
      return true;
    },
    usesZeroToOneRange: true
  };
  return IndexedCS;
})();

var DeviceGrayCS = (function DeviceGrayCSClosure() {
  function DeviceGrayCS() {
    this.name = 'DeviceGray';
    this.numComps = 1;
    this.defaultColor = new Float32Array([0]);
  }

  DeviceGrayCS.prototype = {
    getRgb: ColorSpace.prototype.getRgb,
    getRgbItem: function DeviceGrayCS_getRgbItem(src, srcOffset,
                                                 dest, destOffset) {
      var c = (src[srcOffset] * 255) | 0;
      c = c < 0 ? 0 : c > 255 ? 255 : c;
      dest[destOffset] = dest[destOffset + 1] = dest[destOffset + 2] = c;
    },
    getRgbBuffer: function DeviceGrayCS_getRgbBuffer(src, srcOffset, count,
                                                     dest, destOffset, bits,
                                                     alpha01) {
      var scale = 255 / ((1 << bits) - 1);
      var j = srcOffset, q = destOffset;
      for (var i = 0; i < count; ++i) {
        var c = (scale * src[j++]) | 0;
        dest[q++] = c;
        dest[q++] = c;
        dest[q++] = c;
        q += alpha01;
      }
    },
    getOutputLength: function DeviceGrayCS_getOutputLength(inputLength,
                                                           alpha01) {
      return inputLength * (3 + alpha01);
    },
    isPassthrough: ColorSpace.prototype.isPassthrough,
    fillRgb: ColorSpace.prototype.fillRgb,
    isDefaultDecode: function DeviceGrayCS_isDefaultDecode(decodeMap) {
      return ColorSpace.isDefaultDecode(decodeMap, this.numComps);
    },
    usesZeroToOneRange: true
  };
  return DeviceGrayCS;
})();

var DeviceRgbCS = (function DeviceRgbCSClosure() {
  function DeviceRgbCS() {
    this.name = 'DeviceRGB';
    this.numComps = 3;
    this.defaultColor = new Float32Array([0, 0, 0]);
  }
  DeviceRgbCS.prototype = {
    getRgb: ColorSpace.prototype.getRgb,
    getRgbItem: function DeviceRgbCS_getRgbItem(src, srcOffset,
                                                dest, destOffset) {
      var r = (src[srcOffset] * 255) | 0;
      var g = (src[srcOffset + 1] * 255) | 0;
      var b = (src[srcOffset + 2] * 255) | 0;
      dest[destOffset] = r < 0 ? 0 : r > 255 ? 255 : r;
      dest[destOffset + 1] = g < 0 ? 0 : g > 255 ? 255 : g;
      dest[destOffset + 2] = b < 0 ? 0 : b > 255 ? 255 : b;
    },
    getRgbBuffer: function DeviceRgbCS_getRgbBuffer(src, srcOffset, count,
                                                    dest, destOffset, bits,
                                                    alpha01) {
      if (bits === 8 && alpha01 === 0) {
        dest.set(src.subarray(srcOffset, srcOffset + count * 3), destOffset);
        return;
      }
      var scale = 255 / ((1 << bits) - 1);
      var j = srcOffset, q = destOffset;
      for (var i = 0; i < count; ++i) {
        dest[q++] = (scale * src[j++]) | 0;
        dest[q++] = (scale * src[j++]) | 0;
        dest[q++] = (scale * src[j++]) | 0;
        q += alpha01;
      }
    },
    getOutputLength: function DeviceRgbCS_getOutputLength(inputLength,
                                                          alpha01) {
      return (inputLength * (3 + alpha01) / 3) | 0;
    },
    isPassthrough: function DeviceRgbCS_isPassthrough(bits) {
      return bits === 8;
    },
    fillRgb: ColorSpace.prototype.fillRgb,
    isDefaultDecode: function DeviceRgbCS_isDefaultDecode(decodeMap) {
      return ColorSpace.isDefaultDecode(decodeMap, this.numComps);
    },
    usesZeroToOneRange: true
  };
  return DeviceRgbCS;
})();

var DeviceCmykCS = (function DeviceCmykCSClosure() {
  // The coefficients below was found using numerical analysis: the method of
  // steepest descent for the sum((f_i - color_value_i)^2) for r/g/b colors,
  // where color_value is the tabular value from the table of sampled RGB colors
  // from CMYK US Web Coated (SWOP) colorspace, and f_i is the corresponding
  // CMYK color conversion using the estimation below:
  //   f(A, B,.. N) = Acc+Bcm+Ccy+Dck+c+Fmm+Gmy+Hmk+Im+Jyy+Kyk+Ly+Mkk+Nk+255
  function convertToRgb(src, srcOffset, srcScale, dest, destOffset) {
    var c = src[srcOffset + 0] * srcScale;
    var m = src[srcOffset + 1] * srcScale;
    var y = src[srcOffset + 2] * srcScale;
    var k = src[srcOffset + 3] * srcScale;

    var r =
      (c * (-4.387332384609988 * c + 54.48615194189176 * m +
            18.82290502165302 * y + 212.25662451639585 * k +
            -285.2331026137004) +
       m * (1.7149763477362134 * m - 5.6096736904047315 * y +
            -17.873870861415444 * k - 5.497006427196366) +
       y * (-2.5217340131683033 * y - 21.248923337353073 * k +
            17.5119270841813) +
       k * (-21.86122147463605 * k - 189.48180835922747) + 255) | 0;
    var g =
      (c * (8.841041422036149 * c + 60.118027045597366 * m +
            6.871425592049007 * y + 31.159100130055922 * k +
            -79.2970844816548) +
       m * (-15.310361306967817 * m + 17.575251261109482 * y +
            131.35250912493976 * k - 190.9453302588951) +
       y * (4.444339102852739 * y + 9.8632861493405 * k - 24.86741582555878) +
       k * (-20.737325471181034 * k - 187.80453709719578) + 255) | 0;
    var b =
      (c * (0.8842522430003296 * c + 8.078677503112928 * m +
            30.89978309703729 * y - 0.23883238689178934 * k +
            -14.183576799673286) +
       m * (10.49593273432072 * m + 63.02378494754052 * y +
            50.606957656360734 * k - 112.23884253719248) +
       y * (0.03296041114873217 * y + 115.60384449646641 * k +
            -193.58209356861505) +
       k * (-22.33816807309886 * k - 180.12613974708367) + 255) | 0;

    dest[destOffset] = r > 255 ? 255 : r < 0 ? 0 : r;
    dest[destOffset + 1] = g > 255 ? 255 : g < 0 ? 0 : g;
    dest[destOffset + 2] = b > 255 ? 255 : b < 0 ? 0 : b;
  }

  function DeviceCmykCS() {
    this.name = 'DeviceCMYK';
    this.numComps = 4;
    this.defaultColor = new Float32Array([0, 0, 0, 1]);
  }
  DeviceCmykCS.prototype = {
    getRgb: ColorSpace.prototype.getRgb,
    getRgbItem: function DeviceCmykCS_getRgbItem(src, srcOffset,
                                                 dest, destOffset) {
      convertToRgb(src, srcOffset, 1, dest, destOffset);
    },
    getRgbBuffer: function DeviceCmykCS_getRgbBuffer(src, srcOffset, count,
                                                     dest, destOffset, bits,
                                                     alpha01) {
      var scale = 1 / ((1 << bits) - 1);
      for (var i = 0; i < count; i++) {
        convertToRgb(src, srcOffset, scale, dest, destOffset);
        srcOffset += 4;
        destOffset += 3 + alpha01;
      }
    },
    getOutputLength: function DeviceCmykCS_getOutputLength(inputLength,
                                                           alpha01) {
      return (inputLength / 4 * (3 + alpha01)) | 0;
    },
    isPassthrough: ColorSpace.prototype.isPassthrough,
    fillRgb: ColorSpace.prototype.fillRgb,
    isDefaultDecode: function DeviceCmykCS_isDefaultDecode(decodeMap) {
      return ColorSpace.isDefaultDecode(decodeMap, this.numComps);
    },
    usesZeroToOneRange: true
  };

  return DeviceCmykCS;
})();

//
// CalGrayCS: Based on "PDF Reference, Sixth Ed", p.245
//
var CalGrayCS = (function CalGrayCSClosure() {
  function CalGrayCS(whitePoint, blackPoint, gamma) {
    this.name = 'CalGray';
    this.numComps = 1;
    this.defaultColor = new Float32Array([0]);

    if (!whitePoint) {
      error('WhitePoint missing - required for color space CalGray');
    }
    blackPoint = blackPoint || [0, 0, 0];
    gamma = gamma || 1;

    // Translate arguments to spec variables.
    this.XW = whitePoint[0];
    this.YW = whitePoint[1];
    this.ZW = whitePoint[2];

    this.XB = blackPoint[0];
    this.YB = blackPoint[1];
    this.ZB = blackPoint[2];

    this.G = gamma;

    // Validate variables as per spec.
    if (this.XW < 0 || this.ZW < 0 || this.YW !== 1) {
      error('Invalid WhitePoint components for ' + this.name +
            ', no fallback available');
    }

    if (this.XB < 0 || this.YB < 0 || this.ZB < 0) {
      info('Invalid BlackPoint for ' + this.name + ', falling back to default');
      this.XB = this.YB = this.ZB = 0;
    }

    if (this.XB !== 0 || this.YB !== 0 || this.ZB !== 0) {
      warn(this.name + ', BlackPoint: XB: ' + this.XB + ', YB: ' + this.YB +
           ', ZB: ' + this.ZB + ', only default values are supported.');
    }

    if (this.G < 1) {
      info('Invalid Gamma: ' + this.G + ' for ' + this.name +
           ', falling back to default');
      this.G = 1;
    }
  }

  function convertToRgb(cs, src, srcOffset, dest, destOffset, scale) {
    // A represents a gray component of a calibrated gray space.
    // A <---> AG in the spec
    var A = src[srcOffset] * scale;
    var AG = Math.pow(A, cs.G);

    // Computes L as per spec. ( = cs.YW * AG )
    // Except if other than default BlackPoint values are used.
    var L = cs.YW * AG;
    // http://www.poynton.com/notes/colour_and_gamma/ColorFAQ.html, Ch 4.
    // Convert values to rgb range [0, 255].
    var val = Math.max(295.8 * Math.pow(L, 0.333333333333333333) - 40.8, 0) | 0;
    dest[destOffset] = val;
    dest[destOffset + 1] = val;
    dest[destOffset + 2] = val;
  }

  CalGrayCS.prototype = {
    getRgb: ColorSpace.prototype.getRgb,
    getRgbItem: function CalGrayCS_getRgbItem(src, srcOffset,
                                              dest, destOffset) {
      convertToRgb(this, src, srcOffset, dest, destOffset, 1);
    },
    getRgbBuffer: function CalGrayCS_getRgbBuffer(src, srcOffset, count,
                                                  dest, destOffset, bits,
                                                  alpha01) {
      var scale = 1 / ((1 << bits) - 1);

      for (var i = 0; i < count; ++i) {
        convertToRgb(this, src, srcOffset, dest, destOffset, scale);
        srcOffset += 1;
        destOffset += 3 + alpha01;
      }
    },
    getOutputLength: function CalGrayCS_getOutputLength(inputLength, alpha01) {
      return inputLength * (3 + alpha01);
    },
    isPassthrough: ColorSpace.prototype.isPassthrough,
    fillRgb: ColorSpace.prototype.fillRgb,
    isDefaultDecode: function CalGrayCS_isDefaultDecode(decodeMap) {
      return ColorSpace.isDefaultDecode(decodeMap, this.numComps);
    },
    usesZeroToOneRange: true
  };
  return CalGrayCS;
})();

//
// CalRGBCS: Based on "PDF Reference, Sixth Ed", p.247
//
var CalRGBCS = (function CalRGBCSClosure() {

  // See http://www.brucelindbloom.com/index.html?Eqn_ChromAdapt.html for these
  // matrices.
  var BRADFORD_SCALE_MATRIX = new Float32Array([
    0.8951, 0.2664, -0.1614,
    -0.7502, 1.7135, 0.0367,
    0.0389, -0.0685, 1.0296]);

  var BRADFORD_SCALE_INVERSE_MATRIX = new Float32Array([
    0.9869929, -0.1470543, 0.1599627,
    0.4323053, 0.5183603, 0.0492912,
    -0.0085287, 0.0400428, 0.9684867]);

  // See http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html.
  var SRGB_D65_XYZ_TO_RGB_MATRIX = new Float32Array([
    3.2404542, -1.5371385, -0.4985314,
    -0.9692660, 1.8760108, 0.0415560,
    0.0556434, -0.2040259, 1.0572252]);

  var FLAT_WHITEPOINT_MATRIX = new Float32Array([1, 1, 1]);

  var tempNormalizeMatrix = new Float32Array(3);
  var tempConvertMatrix1 = new Float32Array(3);
  var tempConvertMatrix2 = new Float32Array(3);

  var DECODE_L_CONSTANT = Math.pow(((8 + 16) / 116), 3) / 8.0;

  function CalRGBCS(whitePoint, blackPoint, gamma, matrix) {
    this.name = 'CalRGB';
    this.numComps = 3;
    this.defaultColor = new Float32Array(3);

    if (!whitePoint) {
      error('WhitePoint missing - required for color space CalRGB');
    }
    blackPoint = blackPoint || new Float32Array(3);
    gamma = gamma || new Float32Array([1, 1, 1]);
    matrix = matrix || new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

    // Translate arguments to spec variables.
    var XW = whitePoint[0];
    var YW = whitePoint[1];
    var ZW = whitePoint[2];
    this.whitePoint = whitePoint;

    var XB = blackPoint[0];
    var YB = blackPoint[1];
    var ZB = blackPoint[2];
    this.blackPoint = blackPoint;

    this.GR = gamma[0];
    this.GG = gamma[1];
    this.GB = gamma[2];

    this.MXA = matrix[0];
    this.MYA = matrix[1];
    this.MZA = matrix[2];
    this.MXB = matrix[3];
    this.MYB = matrix[4];
    this.MZB = matrix[5];
    this.MXC = matrix[6];
    this.MYC = matrix[7];
    this.MZC = matrix[8];

    // Validate variables as per spec.
    if (XW < 0 || ZW < 0 || YW !== 1) {
      error('Invalid WhitePoint components for ' + this.name +
            ', no fallback available');
    }

    if (XB < 0 || YB < 0 || ZB < 0) {
      info('Invalid BlackPoint for ' + this.name + ' [' + XB + ', ' + YB +
           ', ' + ZB + '], falling back to default');
      this.blackPoint = new Float32Array(3);
    }

    if (this.GR < 0 || this.GG < 0 || this.GB < 0) {
      info('Invalid Gamma [' + this.GR + ', ' + this.GG + ', ' + this.GB +
           '] for ' + this.name + ', falling back to default');
      this.GR = this.GG = this.GB = 1;
    }

    if (this.MXA < 0 || this.MYA < 0 || this.MZA < 0 ||
        this.MXB < 0 || this.MYB < 0 || this.MZB < 0 ||
        this.MXC < 0 || this.MYC < 0 || this.MZC < 0) {
      info('Invalid Matrix for ' + this.name + ' [' +
           this.MXA + ', ' + this.MYA + ', ' + this.MZA +
           this.MXB + ', ' + this.MYB + ', ' + this.MZB +
           this.MXC + ', ' + this.MYC + ', ' + this.MZC +
           '], falling back to default');
      this.MXA = this.MYB = this.MZC = 1;
      this.MXB = this.MYA = this.MZA = this.MXC = this.MYC = this.MZB = 0;
    }
  }

  function matrixProduct(a, b, result) {
      result[0] = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
      result[1] = a[3] * b[0] + a[4] * b[1] + a[5] * b[2];
      result[2] = a[6] * b[0] + a[7] * b[1] + a[8] * b[2];
  }

  function convertToFlat(sourceWhitePoint, LMS, result) {
      result[0] = LMS[0] * 1 / sourceWhitePoint[0];
      result[1] = LMS[1] * 1 / sourceWhitePoint[1];
      result[2] = LMS[2] * 1 / sourceWhitePoint[2];
  }

  function convertToD65(sourceWhitePoint, LMS, result) {
    var D65X = 0.95047;
    var D65Y = 1;
    var D65Z = 1.08883;

    result[0] = LMS[0] * D65X / sourceWhitePoint[0];
    result[1] = LMS[1] * D65Y / sourceWhitePoint[1];
    result[2] = LMS[2] * D65Z / sourceWhitePoint[2];
  }

  function sRGBTransferFunction(color) {
    // See http://en.wikipedia.org/wiki/SRGB.
    if (color <= 0.0031308){
      return adjustToRange(0, 1, 12.92 * color);
    }

    return adjustToRange(0, 1, (1 + 0.055) * Math.pow(color, 1 / 2.4) - 0.055);
  }

  function adjustToRange(min, max, value) {
    return Math.max(min, Math.min(max, value));
  }

  function decodeL(L) {
    if (L < 0) {
      return -decodeL(-L);
    }

    if (L > 8.0) {
      return Math.pow(((L + 16) / 116), 3);
    }

    return L * DECODE_L_CONSTANT;
  }

  function compensateBlackPoint(sourceBlackPoint, XYZ_Flat, result) {

    // In case the blackPoint is already the default blackPoint then there is
    // no need to do compensation.
    if (sourceBlackPoint[0] === 0 &&
        sourceBlackPoint[1] === 0 &&
        sourceBlackPoint[2] === 0) {
      result[0] = XYZ_Flat[0];
      result[1] = XYZ_Flat[1];
      result[2] = XYZ_Flat[2];
      return;
    }

    // For the blackPoint calculation details, please see
    // http://www.adobe.com/content/dam/Adobe/en/devnet/photoshop/sdk/
    // AdobeBPC.pdf.
    // The destination blackPoint is the default blackPoint [0, 0, 0].
    var zeroDecodeL = decodeL(0);

    var X_DST = zeroDecodeL;
    var X_SRC = decodeL(sourceBlackPoint[0]);

    var Y_DST = zeroDecodeL;
    var Y_SRC = decodeL(sourceBlackPoint[1]);

    var Z_DST = zeroDecodeL;
    var Z_SRC = decodeL(sourceBlackPoint[2]);

    var X_Scale = (1 - X_DST) / (1 - X_SRC);
    var X_Offset = 1 - X_Scale;

    var Y_Scale = (1 - Y_DST) / (1 - Y_SRC);
    var Y_Offset = 1 - Y_Scale;

    var Z_Scale = (1 - Z_DST) / (1 - Z_SRC);
    var Z_Offset = 1 - Z_Scale;

    result[0] = XYZ_Flat[0] * X_Scale + X_Offset;
    result[1] = XYZ_Flat[1] * Y_Scale + Y_Offset;
    result[2] = XYZ_Flat[2] * Z_Scale + Z_Offset;
  }

  function normalizeWhitePointToFlat(sourceWhitePoint, XYZ_In, result) {

    // In case the whitePoint is already flat then there is no need to do
    // normalization.
    if (sourceWhitePoint[0] === 1 && sourceWhitePoint[2] === 1) {
      result[0] = XYZ_In[0];
      result[1] = XYZ_In[1];
      result[2] = XYZ_In[2];
      return;
    }

    var LMS = result;
    matrixProduct(BRADFORD_SCALE_MATRIX, XYZ_In, LMS);

    var LMS_Flat = tempNormalizeMatrix;
    convertToFlat(sourceWhitePoint, LMS, LMS_Flat);

    matrixProduct(BRADFORD_SCALE_INVERSE_MATRIX, LMS_Flat, result);
  }

  function normalizeWhitePointToD65(sourceWhitePoint, XYZ_In, result) {

    var LMS = result;
    matrixProduct(BRADFORD_SCALE_MATRIX, XYZ_In, LMS);

    var LMS_D65 = tempNormalizeMatrix;
    convertToD65(sourceWhitePoint, LMS, LMS_D65);

    matrixProduct(BRADFORD_SCALE_INVERSE_MATRIX, LMS_D65, result);
  }

  function convertToRgb(cs, src, srcOffset, dest, destOffset, scale) {
    // A, B and C represent a red, green and blue components of a calibrated
    // rgb space.
    var A = adjustToRange(0, 1, src[srcOffset] * scale);
    var B = adjustToRange(0, 1, src[srcOffset + 1] * scale);
    var C = adjustToRange(0, 1, src[srcOffset + 2] * scale);

    // A <---> AGR in the spec
    // B <---> BGG in the spec
    // C <---> CGB in the spec
    var AGR = Math.pow(A, cs.GR);
    var BGG = Math.pow(B, cs.GG);
    var CGB = Math.pow(C, cs.GB);

    // Computes intermediate variables L, M, N as per spec.
    // To decode X, Y, Z values map L, M, N directly to them.
    var X = cs.MXA * AGR + cs.MXB * BGG + cs.MXC * CGB;
    var Y = cs.MYA * AGR + cs.MYB * BGG + cs.MYC * CGB;
    var Z = cs.MZA * AGR + cs.MZB * BGG + cs.MZC * CGB;

    // The following calculations are based on this document:
    // http://www.adobe.com/content/dam/Adobe/en/devnet/photoshop/sdk/
    // AdobeBPC.pdf.
    var XYZ = tempConvertMatrix1;
    XYZ[0] = X;
    XYZ[1] = Y;
    XYZ[2] = Z;
    var XYZ_Flat = tempConvertMatrix2;

    normalizeWhitePointToFlat(cs.whitePoint, XYZ, XYZ_Flat);

    var XYZ_Black = tempConvertMatrix1;
    compensateBlackPoint(cs.blackPoint, XYZ_Flat, XYZ_Black);

    var XYZ_D65 = tempConvertMatrix2;
    normalizeWhitePointToD65(FLAT_WHITEPOINT_MATRIX, XYZ_Black, XYZ_D65);

    var SRGB = tempConvertMatrix1;
    matrixProduct(SRGB_D65_XYZ_TO_RGB_MATRIX, XYZ_D65, SRGB);

    var sR = sRGBTransferFunction(SRGB[0]);
    var sG = sRGBTransferFunction(SRGB[1]);
    var sB = sRGBTransferFunction(SRGB[2]);

    // Convert the values to rgb range [0, 255].
    dest[destOffset] = Math.round(sR * 255);
    dest[destOffset + 1] = Math.round(sG * 255);
    dest[destOffset + 2] = Math.round(sB * 255);
  }

  CalRGBCS.prototype = {
    getRgb: function CalRGBCS_getRgb(src, srcOffset) {
      var rgb = new Uint8Array(3);
      this.getRgbItem(src, srcOffset, rgb, 0);
      return rgb;
    },
    getRgbItem: function CalRGBCS_getRgbItem(src, srcOffset,
                                             dest, destOffset) {
      convertToRgb(this, src, srcOffset, dest, destOffset, 1);
    },
    getRgbBuffer: function CalRGBCS_getRgbBuffer(src, srcOffset, count,
                                                 dest, destOffset, bits,
                                                 alpha01) {
      var scale = 1 / ((1 << bits) - 1);

      for (var i = 0; i < count; ++i) {
        convertToRgb(this, src, srcOffset, dest, destOffset, scale);
        srcOffset += 3;
        destOffset += 3 + alpha01;
      }
    },
    getOutputLength: function CalRGBCS_getOutputLength(inputLength, alpha01) {
      return (inputLength * (3 + alpha01) / 3) | 0;
    },
    isPassthrough: ColorSpace.prototype.isPassthrough,
    fillRgb: ColorSpace.prototype.fillRgb,
    isDefaultDecode: function CalRGBCS_isDefaultDecode(decodeMap) {
      return ColorSpace.isDefaultDecode(decodeMap, this.numComps);
    },
    usesZeroToOneRange: true
  };
  return CalRGBCS;
})();

//
// LabCS: Based on "PDF Reference, Sixth Ed", p.250
//
var LabCS = (function LabCSClosure() {
  function LabCS(whitePoint, blackPoint, range) {
    this.name = 'Lab';
    this.numComps = 3;
    this.defaultColor = new Float32Array([0, 0, 0]);

    if (!whitePoint) {
      error('WhitePoint missing - required for color space Lab');
    }
    blackPoint = blackPoint || [0, 0, 0];
    range = range || [-100, 100, -100, 100];

    // Translate args to spec variables
    this.XW = whitePoint[0];
    this.YW = whitePoint[1];
    this.ZW = whitePoint[2];
    this.amin = range[0];
    this.amax = range[1];
    this.bmin = range[2];
    this.bmax = range[3];

    // These are here just for completeness - the spec doesn't offer any
    // formulas that use BlackPoint in Lab
    this.XB = blackPoint[0];
    this.YB = blackPoint[1];
    this.ZB = blackPoint[2];

    // Validate vars as per spec
    if (this.XW < 0 || this.ZW < 0 || this.YW !== 1) {
      error('Invalid WhitePoint components, no fallback available');
    }

    if (this.XB < 0 || this.YB < 0 || this.ZB < 0) {
      info('Invalid BlackPoint, falling back to default');
      this.XB = this.YB = this.ZB = 0;
    }

    if (this.amin > this.amax || this.bmin > this.bmax) {
      info('Invalid Range, falling back to defaults');
      this.amin = -100;
      this.amax = 100;
      this.bmin = -100;
      this.bmax = 100;
    }
  }

  // Function g(x) from spec
  function fn_g(x) {
    if (x >= 6 / 29) {
      return x * x * x;
    } else {
      return (108 / 841) * (x - 4 / 29);
    }
  }

  function decode(value, high1, low2, high2) {
    return low2 + (value) * (high2 - low2) / (high1);
  }

  // If decoding is needed maxVal should be 2^bits per component - 1.
  function convertToRgb(cs, src, srcOffset, maxVal, dest, destOffset) {
    // XXX: Lab input is in the range of [0, 100], [amin, amax], [bmin, bmax]
    // not the usual [0, 1]. If a command like setFillColor is used the src
    // values will already be within the correct range. However, if we are
    // converting an image we have to map the values to the correct range given
    // above.
    // Ls,as,bs <---> L*,a*,b* in the spec
    var Ls = src[srcOffset];
    var as = src[srcOffset + 1];
    var bs = src[srcOffset + 2];
    if (maxVal !== false) {
      Ls = decode(Ls, maxVal, 0, 100);
      as = decode(as, maxVal, cs.amin, cs.amax);
      bs = decode(bs, maxVal, cs.bmin, cs.bmax);
    }

    // Adjust limits of 'as' and 'bs'
    as = as > cs.amax ? cs.amax : as < cs.amin ? cs.amin : as;
    bs = bs > cs.bmax ? cs.bmax : bs < cs.bmin ? cs.bmin : bs;

    // Computes intermediate variables X,Y,Z as per spec
    var M = (Ls + 16) / 116;
    var L = M + (as / 500);
    var N = M - (bs / 200);

    var X = cs.XW * fn_g(L);
    var Y = cs.YW * fn_g(M);
    var Z = cs.ZW * fn_g(N);

    var r, g, b;
    // Using different conversions for D50 and D65 white points,
    // per http://www.color.org/srgb.pdf
    if (cs.ZW < 1) {
      // Assuming D50 (X=0.9642, Y=1.00, Z=0.8249)
      r = X * 3.1339 + Y * -1.6170 + Z * -0.4906;
      g = X * -0.9785 + Y * 1.9160 + Z * 0.0333;
      b = X * 0.0720 + Y * -0.2290 + Z * 1.4057;
    } else {
      // Assuming D65 (X=0.9505, Y=1.00, Z=1.0888)
      r = X * 3.2406 + Y * -1.5372 + Z * -0.4986;
      g = X * -0.9689 + Y * 1.8758 + Z * 0.0415;
      b = X * 0.0557 + Y * -0.2040 + Z * 1.0570;
    }
    // clamp color values to [0,1] range then convert to [0,255] range.
    dest[destOffset] = r <= 0 ? 0 : r >= 1 ? 255 : Math.sqrt(r) * 255 | 0;
    dest[destOffset + 1] = g <= 0 ? 0 : g >= 1 ? 255 : Math.sqrt(g) * 255 | 0;
    dest[destOffset + 2] = b <= 0 ? 0 : b >= 1 ? 255 : Math.sqrt(b) * 255 | 0;
  }

  LabCS.prototype = {
    getRgb: ColorSpace.prototype.getRgb,
    getRgbItem: function LabCS_getRgbItem(src, srcOffset, dest, destOffset) {
      convertToRgb(this, src, srcOffset, false, dest, destOffset);
    },
    getRgbBuffer: function LabCS_getRgbBuffer(src, srcOffset, count,
                                              dest, destOffset, bits,
                                              alpha01) {
      var maxVal = (1 << bits) - 1;
      for (var i = 0; i < count; i++) {
        convertToRgb(this, src, srcOffset, maxVal, dest, destOffset);
        srcOffset += 3;
        destOffset += 3 + alpha01;
      }
    },
    getOutputLength: function LabCS_getOutputLength(inputLength, alpha01) {
      return (inputLength * (3 + alpha01) / 3) | 0;
    },
    isPassthrough: ColorSpace.prototype.isPassthrough,
    fillRgb: ColorSpace.prototype.fillRgb,
    isDefaultDecode: function LabCS_isDefaultDecode(decodeMap) {
      // XXX: Decoding is handled with the lab conversion because of the strange
      // ranges that are used.
      return true;
    },
    usesZeroToOneRange: false
  };
  return LabCS;
})();


var ARCFourCipher = (function ARCFourCipherClosure() {
  function ARCFourCipher(key) {
    this.a = 0;
    this.b = 0;
    var s = new Uint8Array(256);
    var i, j = 0, tmp, keyLength = key.length;
    for (i = 0; i < 256; ++i) {
      s[i] = i;
    }
    for (i = 0; i < 256; ++i) {
      tmp = s[i];
      j = (j + tmp + key[i % keyLength]) & 0xFF;
      s[i] = s[j];
      s[j] = tmp;
    }
    this.s = s;
  }

  ARCFourCipher.prototype = {
    encryptBlock: function ARCFourCipher_encryptBlock(data) {
      var i, n = data.length, tmp, tmp2;
      var a = this.a, b = this.b, s = this.s;
      var output = new Uint8Array(n);
      for (i = 0; i < n; ++i) {
        a = (a + 1) & 0xFF;
        tmp = s[a];
        b = (b + tmp) & 0xFF;
        tmp2 = s[b];
        s[a] = tmp2;
        s[b] = tmp;
        output[i] = data[i] ^ s[(tmp + tmp2) & 0xFF];
      }
      this.a = a;
      this.b = b;
      return output;
    }
  };
  ARCFourCipher.prototype.decryptBlock = ARCFourCipher.prototype.encryptBlock;

  return ARCFourCipher;
})();

var calculateMD5 = (function calculateMD5Closure() {
  var r = new Uint8Array([
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21]);

  var k = new Int32Array([
    -680876936, -389564586, 606105819, -1044525330, -176418897, 1200080426,
    -1473231341, -45705983, 1770035416, -1958414417, -42063, -1990404162,
    1804603682, -40341101, -1502002290, 1236535329, -165796510, -1069501632,
    643717713, -373897302, -701558691, 38016083, -660478335, -405537848,
    568446438, -1019803690, -187363961, 1163531501, -1444681467, -51403784,
    1735328473, -1926607734, -378558, -2022574463, 1839030562, -35309556,
    -1530992060, 1272893353, -155497632, -1094730640, 681279174, -358537222,
    -722521979, 76029189, -640364487, -421815835, 530742520, -995338651,
    -198630844, 1126891415, -1416354905, -57434055, 1700485571, -1894986606,
    -1051523, -2054922799, 1873313359, -30611744, -1560198380, 1309151649,
    -145523070, -1120210379, 718787259, -343485551]);

  function hash(data, offset, length) {
    var h0 = 1732584193, h1 = -271733879, h2 = -1732584194, h3 = 271733878;
    // pre-processing
    var paddedLength = (length + 72) & ~63; // data + 9 extra bytes
    var padded = new Uint8Array(paddedLength);
    var i, j, n;
    for (i = 0; i < length; ++i) {
      padded[i] = data[offset++];
    }
    padded[i++] = 0x80;
    n = paddedLength - 8;
    while (i < n) {
      padded[i++] = 0;
    }
    padded[i++] = (length << 3) & 0xFF;
    padded[i++] = (length >> 5) & 0xFF;
    padded[i++] = (length >> 13) & 0xFF;
    padded[i++] = (length >> 21) & 0xFF;
    padded[i++] = (length >>> 29) & 0xFF;
    padded[i++] = 0;
    padded[i++] = 0;
    padded[i++] = 0;
    var w = new Int32Array(16);
    for (i = 0; i < paddedLength;) {
      for (j = 0; j < 16; ++j, i += 4) {
        w[j] = (padded[i] | (padded[i + 1] << 8) |
               (padded[i + 2] << 16) | (padded[i + 3] << 24));
      }
      var a = h0, b = h1, c = h2, d = h3, f, g;
      for (j = 0; j < 64; ++j) {
        if (j < 16) {
          f = (b & c) | ((~b) & d);
          g = j;
        } else if (j < 32) {
          f = (d & b) | ((~d) & c);
          g = (5 * j + 1) & 15;
        } else if (j < 48) {
          f = b ^ c ^ d;
          g = (3 * j + 5) & 15;
        } else {
          f = c ^ (b | (~d));
          g = (7 * j) & 15;
        }
        var tmp = d, rotateArg = (a + f + k[j] + w[g]) | 0, rotate = r[j];
        d = c;
        c = b;
        b = (b + ((rotateArg << rotate) | (rotateArg >>> (32 - rotate)))) | 0;
        a = tmp;
      }
      h0 = (h0 + a) | 0;
      h1 = (h1 + b) | 0;
      h2 = (h2 + c) | 0;
      h3 = (h3 + d) | 0;
    }
    return new Uint8Array([
      h0 & 0xFF, (h0 >> 8) & 0xFF, (h0 >> 16) & 0xFF, (h0 >>> 24) & 0xFF,
      h1 & 0xFF, (h1 >> 8) & 0xFF, (h1 >> 16) & 0xFF, (h1 >>> 24) & 0xFF,
      h2 & 0xFF, (h2 >> 8) & 0xFF, (h2 >> 16) & 0xFF, (h2 >>> 24) & 0xFF,
      h3 & 0xFF, (h3 >> 8) & 0xFF, (h3 >> 16) & 0xFF, (h3 >>> 24) & 0xFF
    ]);
  }

  return hash;
})();
var Word64 = (function Word64Closure() {
  function Word64(highInteger, lowInteger) {
    this.high = highInteger | 0;
    this.low = lowInteger | 0;
  }
  Word64.prototype = {
    and: function Word64_and(word) {
      this.high &= word.high;
      this.low &= word.low;
    },
    xor: function Word64_xor(word) {
     this.high ^= word.high;
     this.low ^= word.low;
    },

    or: function Word64_or(word) {
      this.high |= word.high;
      this.low |= word.low;
    },

    shiftRight: function Word64_shiftRight(places) {
      if (places >= 32) {
        this.low = (this.high >>> (places - 32)) | 0;
        this.high = 0;
      } else {
        this.low = (this.low >>> places) | (this.high << (32 - places));
        this.high = (this.high >>> places) | 0;
      }
    },

    shiftLeft: function Word64_shiftLeft(places) {
      if (places >= 32) {
        this.high = this.low << (places - 32);
        this.low = 0;
      } else {
        this.high = (this.high << places) | (this.low >>> (32 - places));
        this.low = this.low << places;
      }
    },

    rotateRight: function Word64_rotateRight(places) {
      var low, high;
      if (places & 32) {
        high = this.low;
        low = this.high;
      } else {
        low = this.low;
        high = this.high;
      }
      places &= 31;
      this.low = (low >>> places) | (high << (32 - places));
      this.high = (high >>> places) | (low << (32 - places));
    },

    not: function Word64_not() {
      this.high = ~this.high;
      this.low = ~this.low;
    },

    add: function Word64_add(word) {
      var lowAdd = (this.low >>> 0) + (word.low >>> 0);
      var highAdd = (this.high >>> 0) + (word.high >>> 0);
      if (lowAdd > 0xFFFFFFFF) {
        highAdd += 1;
      }
      this.low = lowAdd | 0;
      this.high = highAdd | 0;
    },

    copyTo: function Word64_copyTo(bytes, offset) {
      bytes[offset] = (this.high >>> 24) & 0xFF;
      bytes[offset + 1] = (this.high >> 16) & 0xFF;
      bytes[offset + 2] = (this.high >> 8) & 0xFF;
      bytes[offset + 3] = this.high & 0xFF;
      bytes[offset + 4] = (this.low >>> 24) & 0xFF;
      bytes[offset + 5] = (this.low >> 16) & 0xFF;
      bytes[offset + 6] = (this.low >> 8) & 0xFF;
      bytes[offset + 7] = this.low & 0xFF;
    },

    assign: function Word64_assign(word) {
      this.high = word.high;
      this.low = word.low;
    }
  };
  return Word64;
})();

var calculateSHA256 = (function calculateSHA256Closure() {
  function rotr(x, n) {
    return (x >>> n) | (x << 32 - n);
  }

  function ch(x, y, z) {
    return (x & y) ^ (~x & z);
  }

  function maj(x, y, z) {
    return (x & y) ^ (x & z) ^ (y & z);
  }

  function sigma(x) {
    return rotr(x, 2) ^ rotr(x, 13) ^ rotr(x, 22);
  }

  function sigmaPrime(x) {
    return rotr(x, 6) ^ rotr(x, 11) ^ rotr(x, 25);
  }

  function littleSigma(x) {
    return rotr(x, 7) ^ rotr(x, 18) ^ x >>> 3;
  }

  function littleSigmaPrime(x) {
    return rotr(x, 17) ^ rotr(x, 19) ^ x >>> 10;
  }

  var k = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
           0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
           0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
           0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
           0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
           0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
           0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
           0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
           0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
           0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
           0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
           0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
           0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
           0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
           0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
           0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];

  function hash(data, offset, length) {
    // initial hash values
    var h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372,
        h3 = 0xa54ff53a, h4 = 0x510e527f, h5 = 0x9b05688c,
        h6 = 0x1f83d9ab, h7 = 0x5be0cd19;
    // pre-processing
    var paddedLength = Math.ceil((length + 9) / 64) * 64;
    var padded = new Uint8Array(paddedLength);
    var i, j, n;
    for (i = 0; i < length; ++i) {
      padded[i] = data[offset++];
    }
    padded[i++] = 0x80;
    n = paddedLength - 8;
    while (i < n) {
      padded[i++] = 0;
    }
    padded[i++] = 0;
    padded[i++] = 0;
    padded[i++] = 0;
    padded[i++] = (length >>> 29) & 0xFF;
    padded[i++] = (length >> 21) & 0xFF;
    padded[i++] = (length >> 13) & 0xFF;
    padded[i++] = (length >> 5) & 0xFF;
    padded[i++] = (length << 3) & 0xFF;
    var w = new Uint32Array(64);
    // for each 512 bit block
    for (i = 0; i < paddedLength;) {
      for (j = 0; j < 16; ++j) {
        w[j] = (padded[i] << 24 | (padded[i + 1] << 16) |
               (padded[i + 2] << 8) | (padded[i + 3]));
        i += 4;
      }

      for (j = 16; j < 64; ++j) {
        w[j] = littleSigmaPrime(w[j - 2]) + w[j - 7] +
               littleSigma(w[j - 15]) + w[j - 16] | 0;
      }
      var a = h0, b = h1, c = h2, d = h3, e = h4,
          f = h5, g = h6, h = h7, t1, t2;
      for (j = 0; j < 64; ++j) {
        t1 = h + sigmaPrime(e) + ch(e, f, g) + k[j] + w[j];
        t2 = sigma(a) + maj(a, b, c);
        h = g;
        g = f;
        f = e;
        e = (d + t1) | 0;
        d = c;
        c = b;
        b = a;
        a = (t1 + t2) | 0;
      }
      h0 = (h0 + a) | 0;
      h1 = (h1 + b) | 0;
      h2 = (h2 + c) | 0;
      h3 = (h3 + d) | 0;
      h4 = (h4 + e) | 0;
      h5 = (h5 + f) | 0;
      h6 = (h6 + g) | 0;
      h7 = (h7 + h) | 0;
    }
    return new Uint8Array([
      (h0 >> 24) & 0xFF, (h0 >> 16) & 0xFF, (h0 >> 8) & 0xFF, (h0) & 0xFF,
      (h1 >> 24) & 0xFF, (h1 >> 16) & 0xFF, (h1 >> 8) & 0xFF, (h1) & 0xFF,
      (h2 >> 24) & 0xFF, (h2 >> 16) & 0xFF, (h2 >> 8) & 0xFF, (h2) & 0xFF,
      (h3 >> 24) & 0xFF, (h3 >> 16) & 0xFF, (h3 >> 8) & 0xFF, (h3) & 0xFF,
      (h4 >> 24) & 0xFF, (h4 >> 16) & 0xFF, (h4 >> 8) & 0xFF, (h4) & 0xFF,
      (h5 >> 24) & 0xFF, (h5 >> 16) & 0xFF, (h5 >> 8) & 0xFF, (h5) & 0xFF,
      (h6 >> 24) & 0xFF, (h6 >> 16) & 0xFF, (h6 >> 8) & 0xFF, (h6) & 0xFF,
      (h7 >> 24) & 0xFF, (h7 >> 16) & 0xFF, (h7 >> 8) & 0xFF, (h7) & 0xFF
    ]);
  }

  return hash;
})();

var calculateSHA512 = (function calculateSHA512Closure() {
  function ch(result, x, y, z, tmp) {
    result.assign(x);
    result.and(y);
    tmp.assign(x);
    tmp.not();
    tmp.and(z);
    result.xor(tmp);
  }

  function maj(result, x, y, z, tmp) {
    result.assign(x);
    result.and(y);
    tmp.assign(x);
    tmp.and(z);
    result.xor(tmp);
    tmp.assign(y);
    tmp.and(z);
    result.xor(tmp);
  }

  function sigma(result, x, tmp) {
    result.assign(x);
    result.rotateRight(28);
    tmp.assign(x);
    tmp.rotateRight(34);
    result.xor(tmp);
    tmp.assign(x);
    tmp.rotateRight(39);
    result.xor(tmp);
  }

  function sigmaPrime(result, x, tmp) {
    result.assign(x);
    result.rotateRight(14);
    tmp.assign(x);
    tmp.rotateRight(18);
    result.xor(tmp);
    tmp.assign(x);
    tmp.rotateRight(41);
    result.xor(tmp);
  }

  function littleSigma(result, x, tmp) {
    result.assign(x);
    result.rotateRight(1);
    tmp.assign(x);
    tmp.rotateRight(8);
    result.xor(tmp);
    tmp.assign(x);
    tmp.shiftRight(7);
    result.xor(tmp);
  }

  function littleSigmaPrime(result, x, tmp) {
    result.assign(x);
    result.rotateRight(19);
    tmp.assign(x);
    tmp.rotateRight(61);
    result.xor(tmp);
    tmp.assign(x);
    tmp.shiftRight(6);
    result.xor(tmp);
  }

  var k = [
    new Word64(0x428a2f98, 0xd728ae22), new Word64(0x71374491, 0x23ef65cd),
    new Word64(0xb5c0fbcf, 0xec4d3b2f), new Word64(0xe9b5dba5, 0x8189dbbc),
    new Word64(0x3956c25b, 0xf348b538), new Word64(0x59f111f1, 0xb605d019),
    new Word64(0x923f82a4, 0xaf194f9b), new Word64(0xab1c5ed5, 0xda6d8118),
    new Word64(0xd807aa98, 0xa3030242), new Word64(0x12835b01, 0x45706fbe),
    new Word64(0x243185be, 0x4ee4b28c), new Word64(0x550c7dc3, 0xd5ffb4e2),
    new Word64(0x72be5d74, 0xf27b896f), new Word64(0x80deb1fe, 0x3b1696b1),
    new Word64(0x9bdc06a7, 0x25c71235), new Word64(0xc19bf174, 0xcf692694),
    new Word64(0xe49b69c1, 0x9ef14ad2), new Word64(0xefbe4786, 0x384f25e3),
    new Word64(0x0fc19dc6, 0x8b8cd5b5), new Word64(0x240ca1cc, 0x77ac9c65),
    new Word64(0x2de92c6f, 0x592b0275), new Word64(0x4a7484aa, 0x6ea6e483),
    new Word64(0x5cb0a9dc, 0xbd41fbd4), new Word64(0x76f988da, 0x831153b5),
    new Word64(0x983e5152, 0xee66dfab), new Word64(0xa831c66d, 0x2db43210),
    new Word64(0xb00327c8, 0x98fb213f), new Word64(0xbf597fc7, 0xbeef0ee4),
    new Word64(0xc6e00bf3, 0x3da88fc2), new Word64(0xd5a79147, 0x930aa725),
    new Word64(0x06ca6351, 0xe003826f), new Word64(0x14292967, 0x0a0e6e70),
    new Word64(0x27b70a85, 0x46d22ffc), new Word64(0x2e1b2138, 0x5c26c926),
    new Word64(0x4d2c6dfc, 0x5ac42aed), new Word64(0x53380d13, 0x9d95b3df),
    new Word64(0x650a7354, 0x8baf63de), new Word64(0x766a0abb, 0x3c77b2a8),
    new Word64(0x81c2c92e, 0x47edaee6), new Word64(0x92722c85, 0x1482353b),
    new Word64(0xa2bfe8a1, 0x4cf10364), new Word64(0xa81a664b, 0xbc423001),
    new Word64(0xc24b8b70, 0xd0f89791), new Word64(0xc76c51a3, 0x0654be30),
    new Word64(0xd192e819, 0xd6ef5218), new Word64(0xd6990624, 0x5565a910),
    new Word64(0xf40e3585, 0x5771202a), new Word64(0x106aa070, 0x32bbd1b8),
    new Word64(0x19a4c116, 0xb8d2d0c8), new Word64(0x1e376c08, 0x5141ab53),
    new Word64(0x2748774c, 0xdf8eeb99), new Word64(0x34b0bcb5, 0xe19b48a8),
    new Word64(0x391c0cb3, 0xc5c95a63), new Word64(0x4ed8aa4a, 0xe3418acb),
    new Word64(0x5b9cca4f, 0x7763e373), new Word64(0x682e6ff3, 0xd6b2b8a3),
    new Word64(0x748f82ee, 0x5defb2fc), new Word64(0x78a5636f, 0x43172f60),
    new Word64(0x84c87814, 0xa1f0ab72), new Word64(0x8cc70208, 0x1a6439ec),
    new Word64(0x90befffa, 0x23631e28), new Word64(0xa4506ceb, 0xde82bde9),
    new Word64(0xbef9a3f7, 0xb2c67915), new Word64(0xc67178f2, 0xe372532b),
    new Word64(0xca273ece, 0xea26619c), new Word64(0xd186b8c7, 0x21c0c207),
    new Word64(0xeada7dd6, 0xcde0eb1e), new Word64(0xf57d4f7f, 0xee6ed178),
    new Word64(0x06f067aa, 0x72176fba), new Word64(0x0a637dc5, 0xa2c898a6),
    new Word64(0x113f9804, 0xbef90dae), new Word64(0x1b710b35, 0x131c471b),
    new Word64(0x28db77f5, 0x23047d84), new Word64(0x32caab7b, 0x40c72493),
    new Word64(0x3c9ebe0a, 0x15c9bebc), new Word64(0x431d67c4, 0x9c100d4c),
    new Word64(0x4cc5d4be, 0xcb3e42b6), new Word64(0x597f299c, 0xfc657e2a),
    new Word64(0x5fcb6fab, 0x3ad6faec), new Word64(0x6c44198c, 0x4a475817)];

  function hash(data, offset, length, mode384) {
    mode384 = !!mode384;
    // initial hash values
    var h0, h1, h2, h3, h4, h5, h6, h7;
    if (!mode384) {
      h0 = new Word64(0x6a09e667, 0xf3bcc908);
      h1 = new Word64(0xbb67ae85, 0x84caa73b);
      h2 = new Word64(0x3c6ef372, 0xfe94f82b);
      h3 = new Word64(0xa54ff53a, 0x5f1d36f1);
      h4 = new Word64(0x510e527f, 0xade682d1);
      h5 = new Word64(0x9b05688c, 0x2b3e6c1f);
      h6 = new Word64(0x1f83d9ab, 0xfb41bd6b);
      h7 = new Word64(0x5be0cd19, 0x137e2179);
    }
    else {
      // SHA384 is exactly the same
      // except with different starting values and a trimmed result
      h0 = new Word64(0xcbbb9d5d, 0xc1059ed8);
      h1 = new Word64(0x629a292a, 0x367cd507);
      h2 = new Word64(0x9159015a, 0x3070dd17);
      h3 = new Word64(0x152fecd8, 0xf70e5939);
      h4 = new Word64(0x67332667, 0xffc00b31);
      h5 = new Word64(0x8eb44a87, 0x68581511);
      h6 = new Word64(0xdb0c2e0d, 0x64f98fa7);
      h7 = new Word64(0x47b5481d, 0xbefa4fa4);
    }

    // pre-processing
    var paddedLength = Math.ceil((length + 17) / 128) * 128;
    var padded = new Uint8Array(paddedLength);
    var i, j, n;
    for (i = 0; i < length; ++i) {
      padded[i] = data[offset++];
    }
    padded[i++] = 0x80;
    n = paddedLength - 16;
    while (i < n) {
      padded[i++] = 0;
    }
    padded[i++] = 0;
    padded[i++] = 0;
    padded[i++] = 0;
    padded[i++] = 0;
    padded[i++] = 0;
    padded[i++] = 0;
    padded[i++] = 0;
    padded[i++] = 0;
    padded[i++] = 0;
    padded[i++] = 0;
    padded[i++] = 0;
    padded[i++] = (length >>> 29) & 0xFF;
    padded[i++] = (length >> 21) & 0xFF;
    padded[i++] = (length >> 13) & 0xFF;
    padded[i++] = (length >> 5) & 0xFF;
    padded[i++] = (length << 3) & 0xFF;

    var w = new Array(80);
    for (i = 0; i < 80; i++) {
      w[i] = new Word64(0, 0);
    }
    var a = new Word64(0, 0), b = new Word64(0, 0), c = new Word64(0, 0);
    var d = new Word64(0, 0), e = new Word64(0, 0), f = new Word64(0, 0);
    var g = new Word64(0, 0), h = new Word64(0, 0);
    var t1 = new Word64(0, 0), t2 = new Word64(0, 0);
    var tmp1 = new Word64(0, 0), tmp2 = new Word64(0, 0), tmp3;

    // for each 1024 bit block
    for (i = 0; i < paddedLength;) {
      for (j = 0; j < 16; ++j) {
        w[j].high = (padded[i] << 24) | (padded[i + 1] << 16) |
                    (padded[i + 2] << 8) | (padded[i + 3]);
        w[j].low = (padded[i + 4]) << 24 | (padded[i + 5]) << 16 |
                   (padded[i + 6]) << 8 | (padded[i + 7]);
        i += 8;
      }
      for (j = 16; j < 80; ++j) {
        tmp3 = w[j];
        littleSigmaPrime(tmp3, w[j - 2], tmp2);
        tmp3.add(w[j - 7]);
        littleSigma(tmp1, w[j - 15], tmp2);
        tmp3.add(tmp1);
        tmp3.add(w[j - 16]);
      }

      a.assign(h0); b.assign(h1); c.assign(h2); d.assign(h3);
      e.assign(h4); f.assign(h5); g.assign(h6); h.assign(h7);
      for (j = 0; j < 80; ++j) {
        t1.assign(h);
        sigmaPrime(tmp1, e, tmp2);
        t1.add(tmp1);
        ch(tmp1, e, f, g, tmp2);
        t1.add(tmp1);
        t1.add(k[j]);
        t1.add(w[j]);

        sigma(t2, a, tmp2);
        maj(tmp1, a, b, c, tmp2);
        t2.add(tmp1);

        tmp3 = h;
        h = g;
        g = f;
        f = e;
        d.add(t1);
        e = d;
        d = c;
        c = b;
        b = a;
        tmp3.assign(t1);
        tmp3.add(t2);
        a = tmp3;
      }
      h0.add(a);
      h1.add(b);
      h2.add(c);
      h3.add(d);
      h4.add(e);
      h5.add(f);
      h6.add(g);
      h7.add(h);
    }

    var result;
    if (!mode384) {
      result = new Uint8Array(64);
      h0.copyTo(result,0);
      h1.copyTo(result,8);
      h2.copyTo(result,16);
      h3.copyTo(result,24);
      h4.copyTo(result,32);
      h5.copyTo(result,40);
      h6.copyTo(result,48);
      h7.copyTo(result,56);
    }
    else {
      result = new Uint8Array(48);
      h0.copyTo(result,0);
      h1.copyTo(result,8);
      h2.copyTo(result,16);
      h3.copyTo(result,24);
      h4.copyTo(result,32);
      h5.copyTo(result,40);
    }
    return result;
  }

  return hash;
})();
var calculateSHA384 = (function calculateSHA384Closure() {
  function hash(data, offset, length) {
    return calculateSHA512(data, offset, length, true);
  }

  return hash;
})();
var NullCipher = (function NullCipherClosure() {
  function NullCipher() {
  }

  NullCipher.prototype = {
    decryptBlock: function NullCipher_decryptBlock(data) {
      return data;
    }
  };

  return NullCipher;
})();

var AES128Cipher = (function AES128CipherClosure() {
  var rcon = new Uint8Array([
    0x8d, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c,
    0xd8, 0xab, 0x4d, 0x9a, 0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a,
    0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91, 0x39, 0x72, 0xe4, 0xd3, 0xbd,
    0x61, 0xc2, 0x9f, 0x25, 0x4a, 0x94, 0x33, 0x66, 0xcc, 0x83, 0x1d, 0x3a,
    0x74, 0xe8, 0xcb, 0x8d, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80,
    0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d, 0x9a, 0x2f, 0x5e, 0xbc, 0x63, 0xc6,
    0x97, 0x35, 0x6a, 0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91, 0x39, 0x72,
    0xe4, 0xd3, 0xbd, 0x61, 0xc2, 0x9f, 0x25, 0x4a, 0x94, 0x33, 0x66, 0xcc,
    0x83, 0x1d, 0x3a, 0x74, 0xe8, 0xcb, 0x8d, 0x01, 0x02, 0x04, 0x08, 0x10,
    0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d, 0x9a, 0x2f, 0x5e,
    0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a, 0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5,
    0x91, 0x39, 0x72, 0xe4, 0xd3, 0xbd, 0x61, 0xc2, 0x9f, 0x25, 0x4a, 0x94,
    0x33, 0x66, 0xcc, 0x83, 0x1d, 0x3a, 0x74, 0xe8, 0xcb, 0x8d, 0x01, 0x02,
    0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d,
    0x9a, 0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a, 0xd4, 0xb3, 0x7d,
    0xfa, 0xef, 0xc5, 0x91, 0x39, 0x72, 0xe4, 0xd3, 0xbd, 0x61, 0xc2, 0x9f,
    0x25, 0x4a, 0x94, 0x33, 0x66, 0xcc, 0x83, 0x1d, 0x3a, 0x74, 0xe8, 0xcb,
    0x8d, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c,
    0xd8, 0xab, 0x4d, 0x9a, 0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a,
    0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91, 0x39, 0x72, 0xe4, 0xd3, 0xbd,
    0x61, 0xc2, 0x9f, 0x25, 0x4a, 0x94, 0x33, 0x66, 0xcc, 0x83, 0x1d, 0x3a,
    0x74, 0xe8, 0xcb, 0x8d]);

  var s = new Uint8Array([
    0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b,
    0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0,
    0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26,
    0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
    0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2,
    0xeb, 0x27, 0xb2, 0x75, 0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0,
    0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed,
    0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
    0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f,
    0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5,
    0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0x0c, 0x13, 0xec,
    0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
    0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14,
    0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c,
    0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d,
    0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
    0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f,
    0x4b, 0xbd, 0x8b, 0x8a, 0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e,
    0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11,
    0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
    0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f,
    0xb0, 0x54, 0xbb, 0x16]);

  var inv_s = new Uint8Array([
    0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e,
    0x81, 0xf3, 0xd7, 0xfb, 0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87,
    0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb, 0x54, 0x7b, 0x94, 0x32,
    0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
    0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49,
    0x6d, 0x8b, 0xd1, 0x25, 0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16,
    0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92, 0x6c, 0x70, 0x48, 0x50,
    0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
    0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05,
    0xb8, 0xb3, 0x45, 0x06, 0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02,
    0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b, 0x3a, 0x91, 0x11, 0x41,
    0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
    0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8,
    0x1c, 0x75, 0xdf, 0x6e, 0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89,
    0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b, 0xfc, 0x56, 0x3e, 0x4b,
    0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
    0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59,
    0x27, 0x80, 0xec, 0x5f, 0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d,
    0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef, 0xa0, 0xe0, 0x3b, 0x4d,
    0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
    0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63,
    0x55, 0x21, 0x0c, 0x7d]);
  var mixCol = new Uint8Array(256);
  for (var i = 0; i < 256; i++) {
    if (i < 128) {
      mixCol[i] = i << 1;
    } else {
      mixCol[i] = (i << 1) ^ 0x1b;
    }
  }
  var mix = new Uint32Array([
    0x00000000, 0x0e090d0b, 0x1c121a16, 0x121b171d, 0x3824342c, 0x362d3927,
    0x24362e3a, 0x2a3f2331, 0x70486858, 0x7e416553, 0x6c5a724e, 0x62537f45,
    0x486c5c74, 0x4665517f, 0x547e4662, 0x5a774b69, 0xe090d0b0, 0xee99ddbb,
    0xfc82caa6, 0xf28bc7ad, 0xd8b4e49c, 0xd6bde997, 0xc4a6fe8a, 0xcaaff381,
    0x90d8b8e8, 0x9ed1b5e3, 0x8ccaa2fe, 0x82c3aff5, 0xa8fc8cc4, 0xa6f581cf,
    0xb4ee96d2, 0xbae79bd9, 0xdb3bbb7b, 0xd532b670, 0xc729a16d, 0xc920ac66,
    0xe31f8f57, 0xed16825c, 0xff0d9541, 0xf104984a, 0xab73d323, 0xa57ade28,
    0xb761c935, 0xb968c43e, 0x9357e70f, 0x9d5eea04, 0x8f45fd19, 0x814cf012,
    0x3bab6bcb, 0x35a266c0, 0x27b971dd, 0x29b07cd6, 0x038f5fe7, 0x0d8652ec,
    0x1f9d45f1, 0x119448fa, 0x4be30393, 0x45ea0e98, 0x57f11985, 0x59f8148e,
    0x73c737bf, 0x7dce3ab4, 0x6fd52da9, 0x61dc20a2, 0xad766df6, 0xa37f60fd,
    0xb16477e0, 0xbf6d7aeb, 0x955259da, 0x9b5b54d1, 0x894043cc, 0x87494ec7,
    0xdd3e05ae, 0xd33708a5, 0xc12c1fb8, 0xcf2512b3, 0xe51a3182, 0xeb133c89,
    0xf9082b94, 0xf701269f, 0x4de6bd46, 0x43efb04d, 0x51f4a750, 0x5ffdaa5b,
    0x75c2896a, 0x7bcb8461, 0x69d0937c, 0x67d99e77, 0x3daed51e, 0x33a7d815,
    0x21bccf08, 0x2fb5c203, 0x058ae132, 0x0b83ec39, 0x1998fb24, 0x1791f62f,
    0x764dd68d, 0x7844db86, 0x6a5fcc9b, 0x6456c190, 0x4e69e2a1, 0x4060efaa,
    0x527bf8b7, 0x5c72f5bc, 0x0605bed5, 0x080cb3de, 0x1a17a4c3, 0x141ea9c8,
    0x3e218af9, 0x302887f2, 0x223390ef, 0x2c3a9de4, 0x96dd063d, 0x98d40b36,
    0x8acf1c2b, 0x84c61120, 0xaef93211, 0xa0f03f1a, 0xb2eb2807, 0xbce2250c,
    0xe6956e65, 0xe89c636e, 0xfa877473, 0xf48e7978, 0xdeb15a49, 0xd0b85742,
    0xc2a3405f, 0xccaa4d54, 0x41ecdaf7, 0x4fe5d7fc, 0x5dfec0e1, 0x53f7cdea,
    0x79c8eedb, 0x77c1e3d0, 0x65daf4cd, 0x6bd3f9c6, 0x31a4b2af, 0x3fadbfa4,
    0x2db6a8b9, 0x23bfa5b2, 0x09808683, 0x07898b88, 0x15929c95, 0x1b9b919e,
    0xa17c0a47, 0xaf75074c, 0xbd6e1051, 0xb3671d5a, 0x99583e6b, 0x97513360,
    0x854a247d, 0x8b432976, 0xd134621f, 0xdf3d6f14, 0xcd267809, 0xc32f7502,
    0xe9105633, 0xe7195b38, 0xf5024c25, 0xfb0b412e, 0x9ad7618c, 0x94de6c87,
    0x86c57b9a, 0x88cc7691, 0xa2f355a0, 0xacfa58ab, 0xbee14fb6, 0xb0e842bd,
    0xea9f09d4, 0xe49604df, 0xf68d13c2, 0xf8841ec9, 0xd2bb3df8, 0xdcb230f3,
    0xcea927ee, 0xc0a02ae5, 0x7a47b13c, 0x744ebc37, 0x6655ab2a, 0x685ca621,
    0x42638510, 0x4c6a881b, 0x5e719f06, 0x5078920d, 0x0a0fd964, 0x0406d46f,
    0x161dc372, 0x1814ce79, 0x322bed48, 0x3c22e043, 0x2e39f75e, 0x2030fa55,
    0xec9ab701, 0xe293ba0a, 0xf088ad17, 0xfe81a01c, 0xd4be832d, 0xdab78e26,
    0xc8ac993b, 0xc6a59430, 0x9cd2df59, 0x92dbd252, 0x80c0c54f, 0x8ec9c844,
    0xa4f6eb75, 0xaaffe67e, 0xb8e4f163, 0xb6edfc68, 0x0c0a67b1, 0x02036aba,
    0x10187da7, 0x1e1170ac, 0x342e539d, 0x3a275e96, 0x283c498b, 0x26354480,
    0x7c420fe9, 0x724b02e2, 0x605015ff, 0x6e5918f4, 0x44663bc5, 0x4a6f36ce,
    0x587421d3, 0x567d2cd8, 0x37a10c7a, 0x39a80171, 0x2bb3166c, 0x25ba1b67,
    0x0f853856, 0x018c355d, 0x13972240, 0x1d9e2f4b, 0x47e96422, 0x49e06929,
    0x5bfb7e34, 0x55f2733f, 0x7fcd500e, 0x71c45d05, 0x63df4a18, 0x6dd64713,
    0xd731dcca, 0xd938d1c1, 0xcb23c6dc, 0xc52acbd7, 0xef15e8e6, 0xe11ce5ed,
    0xf307f2f0, 0xfd0efffb, 0xa779b492, 0xa970b999, 0xbb6bae84, 0xb562a38f,
    0x9f5d80be, 0x91548db5, 0x834f9aa8, 0x8d4697a3]);

  function expandKey128(cipherKey) {
    var b = 176, result = new Uint8Array(b);
    result.set(cipherKey);
    for (var j = 16, i = 1; j < b; ++i) {
      // RotWord
      var t1 = result[j - 3], t2 = result[j - 2],
          t3 = result[j - 1], t4 = result[j - 4];
      // SubWord
      t1 = s[t1];
      t2 = s[t2];
      t3 = s[t3];
      t4 = s[t4];
      // Rcon
      t1 = t1 ^ rcon[i];
      for (var n = 0; n < 4; ++n) {
        result[j] = (t1 ^= result[j - 16]);
        j++;
        result[j] = (t2 ^= result[j - 16]);
        j++;
        result[j] = (t3 ^= result[j - 16]);
        j++;
        result[j] = (t4 ^= result[j - 16]);
        j++;
      }
    }
    return result;
  }

  function decrypt128(input, key) {
    var state = new Uint8Array(16);
    state.set(input);
    var i, j, k;
    var t, u, v;
    // AddRoundKey
    for (j = 0, k = 160; j < 16; ++j, ++k) {
      state[j] ^= key[k];
    }
    for (i = 9; i >= 1; --i) {
      // InvShiftRows
      t = state[13];
      state[13] = state[9];
      state[9] = state[5];
      state[5] = state[1];
      state[1] = t;
      t = state[14];
      u = state[10];
      state[14] = state[6];
      state[10] = state[2];
      state[6] = t;
      state[2] = u;
      t = state[15];
      u = state[11];
      v = state[7];
      state[15] = state[3];
      state[11] = t;
      state[7] = u;
      state[3] = v;
      // InvSubBytes
      for (j = 0; j < 16; ++j) {
        state[j] = inv_s[state[j]];
      }
      // AddRoundKey
      for (j = 0, k = i * 16; j < 16; ++j, ++k) {
        state[j] ^= key[k];
      }
      // InvMixColumns
      for (j = 0; j < 16; j += 4) {
        var s0 = mix[state[j]], s1 = mix[state[j + 1]],
          s2 = mix[state[j + 2]], s3 = mix[state[j + 3]];
        t = (s0 ^ (s1 >>> 8) ^ (s1 << 24) ^ (s2 >>> 16) ^ (s2 << 16) ^
          (s3 >>> 24) ^ (s3 << 8));
        state[j] = (t >>> 24) & 0xFF;
        state[j + 1] = (t >> 16) & 0xFF;
        state[j + 2] = (t >> 8) & 0xFF;
        state[j + 3] = t & 0xFF;
      }
    }
    // InvShiftRows
    t = state[13];
    state[13] = state[9];
    state[9] = state[5];
    state[5] = state[1];
    state[1] = t;
    t = state[14];
    u = state[10];
    state[14] = state[6];
    state[10] = state[2];
    state[6] = t;
    state[2] = u;
    t = state[15];
    u = state[11];
    v = state[7];
    state[15] = state[3];
    state[11] = t;
    state[7] = u;
    state[3] = v;
    for (j = 0; j < 16; ++j) {
      // InvSubBytes
      state[j] = inv_s[state[j]];
      // AddRoundKey
      state[j] ^= key[j];
    }
    return state;
  }

  function encrypt128(input, key) {
    var t, u, v, k;
    var state = new Uint8Array(16);
    state.set(input);
    for (j = 0; j < 16; ++j) {
      // AddRoundKey
      state[j] ^= key[j];
    }

    for (i = 1; i < 10; i++) {
      //SubBytes
      for (j = 0; j < 16; ++j) {
        state[j] = s[state[j]];
      }
      //ShiftRows
      v = state[1];
      state[1] = state[5];
      state[5] = state[9];
      state[9] = state[13];
      state[13] = v;
      v = state[2];
      u = state[6];
      state[2] = state[10];
      state[6] = state[14];
      state[10] = v;
      state[14] = u;
      v = state[3];
      u = state[7];
      t = state[11];
      state[3] = state[15];
      state[7] = v;
      state[11] = u;
      state[15] = t;
      //MixColumns
      for (var j = 0; j < 16; j += 4) {
        var s0 = state[j + 0], s1 = state[j + 1];
        var s2 = state[j + 2], s3 = state[j + 3];
        t = s0 ^ s1 ^ s2 ^ s3;
        state[j + 0] ^= t ^ mixCol[s0 ^ s1];
        state[j + 1] ^= t ^ mixCol[s1 ^ s2];
        state[j + 2] ^= t ^ mixCol[s2 ^ s3];
        state[j + 3] ^= t ^ mixCol[s3 ^ s0];
      }
      //AddRoundKey
      for (j = 0, k = i * 16; j < 16; ++j, ++k) {
        state[j] ^= key[k];
      }
    }

    //SubBytes
    for (j = 0; j < 16; ++j) {
      state[j] = s[state[j]];
    }
    //ShiftRows
    v = state[1];
    state[1] = state[5];
    state[5] = state[9];
    state[9] = state[13];
    state[13] = v;
    v = state[2];
    u = state[6];
    state[2] = state[10];
    state[6] = state[14];
    state[10] = v;
    state[14] = u;
    v = state[3];
    u = state[7];
    t = state[11];
    state[3] = state[15];
    state[7] = v;
    state[11] = u;
    state[15] = t;
    //AddRoundKey
    for (j = 0, k = 160; j < 16; ++j, ++k) {
      state[j] ^= key[k];
    }
    return state;
  }

  function AES128Cipher(key) {
    this.key = expandKey128(key);
    this.buffer = new Uint8Array(16);
    this.bufferPosition = 0;
  }

  function decryptBlock2(data, finalize) {
    var i, j, ii, sourceLength = data.length,
        buffer = this.buffer, bufferLength = this.bufferPosition,
        result = [], iv = this.iv;
    for (i = 0; i < sourceLength; ++i) {
      buffer[bufferLength] = data[i];
      ++bufferLength;
      if (bufferLength < 16) {
        continue;
      }
      // buffer is full, decrypting
      var plain = decrypt128(buffer, this.key);
      // xor-ing the IV vector to get plain text
      for (j = 0; j < 16; ++j) {
        plain[j] ^= iv[j];
      }
      iv = buffer;
      result.push(plain);
      buffer = new Uint8Array(16);
      bufferLength = 0;
    }
    // saving incomplete buffer
    this.buffer = buffer;
    this.bufferLength = bufferLength;
    this.iv = iv;
    if (result.length === 0) {
      return new Uint8Array([]);
    }
    // combining plain text blocks into one
    var outputLength = 16 * result.length;
    if (finalize) {
      // undo a padding that is described in RFC 2898
      var lastBlock = result[result.length - 1];
      var psLen = lastBlock[15];
      if (psLen <= 16) {
        for (i = 15, ii = 16 - psLen; i >= ii; --i) {
          if (lastBlock[i] !== psLen) {
            // Invalid padding, assume that the block has no padding.
            psLen = 0;
            break;
          }
        }
        outputLength -= psLen;
        result[result.length - 1] = lastBlock.subarray(0, 16 - psLen);
      }
    }
    var output = new Uint8Array(outputLength);
    for (i = 0, j = 0, ii = result.length; i < ii; ++i, j += 16) {
      output.set(result[i], j);
    }
    return output;
  }

  AES128Cipher.prototype = {
    decryptBlock: function AES128Cipher_decryptBlock(data, finalize) {
      var i, sourceLength = data.length;
      var buffer = this.buffer, bufferLength = this.bufferPosition;
      // waiting for IV values -- they are at the start of the stream
      for (i = 0; bufferLength < 16 && i < sourceLength; ++i, ++bufferLength) {
        buffer[bufferLength] = data[i];
      }
      if (bufferLength < 16) {
        // need more data
        this.bufferLength = bufferLength;
        return new Uint8Array([]);
      }
      this.iv = buffer;
      this.buffer = new Uint8Array(16);
      this.bufferLength = 0;
      // starting decryption
      this.decryptBlock = decryptBlock2;
      return this.decryptBlock(data.subarray(16), finalize);
    },
    encrypt: function AES128Cipher_encrypt(data, iv) {
      var i, j, ii, sourceLength = data.length,
          buffer = this.buffer, bufferLength = this.bufferPosition,
          result = [];
      if (!iv) {
        iv = new Uint8Array(16);
      }
      for (i = 0; i < sourceLength; ++i) {
        buffer[bufferLength] = data[i];
        ++bufferLength;
        if (bufferLength < 16) {
          continue;
        }
        for (j = 0; j < 16; ++j) {
          buffer[j] ^= iv[j];
        }

        // buffer is full, encrypting
        var cipher = encrypt128(buffer, this.key);
        iv = cipher;
        result.push(cipher);
        buffer = new Uint8Array(16);
        bufferLength = 0;
      }
      // saving incomplete buffer
      this.buffer = buffer;
      this.bufferLength = bufferLength;
      this.iv = iv;
      if (result.length === 0) {
        return new Uint8Array([]);
      }
      // combining plain text blocks into one
      var outputLength = 16 * result.length;
      var output = new Uint8Array(outputLength);
      for (i = 0, j = 0, ii = result.length; i < ii; ++i, j += 16) {
        output.set(result[i], j);
      }
      return output;
    }
  };

  return AES128Cipher;
})();

var AES256Cipher = (function AES256CipherClosure() {
  var rcon = new Uint8Array([
    0x8d, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c,
    0xd8, 0xab, 0x4d, 0x9a, 0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a,
    0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91, 0x39, 0x72, 0xe4, 0xd3, 0xbd,
    0x61, 0xc2, 0x9f, 0x25, 0x4a, 0x94, 0x33, 0x66, 0xcc, 0x83, 0x1d, 0x3a,
    0x74, 0xe8, 0xcb, 0x8d, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80,
    0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d, 0x9a, 0x2f, 0x5e, 0xbc, 0x63, 0xc6,
    0x97, 0x35, 0x6a, 0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91, 0x39, 0x72,
    0xe4, 0xd3, 0xbd, 0x61, 0xc2, 0x9f, 0x25, 0x4a, 0x94, 0x33, 0x66, 0xcc,
    0x83, 0x1d, 0x3a, 0x74, 0xe8, 0xcb, 0x8d, 0x01, 0x02, 0x04, 0x08, 0x10,
    0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d, 0x9a, 0x2f, 0x5e,
    0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a, 0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5,
    0x91, 0x39, 0x72, 0xe4, 0xd3, 0xbd, 0x61, 0xc2, 0x9f, 0x25, 0x4a, 0x94,
    0x33, 0x66, 0xcc, 0x83, 0x1d, 0x3a, 0x74, 0xe8, 0xcb, 0x8d, 0x01, 0x02,
    0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d,
    0x9a, 0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a, 0xd4, 0xb3, 0x7d,
    0xfa, 0xef, 0xc5, 0x91, 0x39, 0x72, 0xe4, 0xd3, 0xbd, 0x61, 0xc2, 0x9f,
    0x25, 0x4a, 0x94, 0x33, 0x66, 0xcc, 0x83, 0x1d, 0x3a, 0x74, 0xe8, 0xcb,
    0x8d, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c,
    0xd8, 0xab, 0x4d, 0x9a, 0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a,
    0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91, 0x39, 0x72, 0xe4, 0xd3, 0xbd,
    0x61, 0xc2, 0x9f, 0x25, 0x4a, 0x94, 0x33, 0x66, 0xcc, 0x83, 0x1d, 0x3a,
    0x74, 0xe8, 0xcb, 0x8d]);

  var s = new Uint8Array([
    0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b,
    0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0,
    0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26,
    0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
    0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2,
    0xeb, 0x27, 0xb2, 0x75, 0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0,
    0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed,
    0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
    0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f,
    0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5,
    0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0x0c, 0x13, 0xec,
    0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
    0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14,
    0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c,
    0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d,
    0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
    0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f,
    0x4b, 0xbd, 0x8b, 0x8a, 0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e,
    0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11,
    0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
    0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f,
    0xb0, 0x54, 0xbb, 0x16]);

  var inv_s = new Uint8Array([
    0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e,
    0x81, 0xf3, 0xd7, 0xfb, 0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87,
    0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb, 0x54, 0x7b, 0x94, 0x32,
    0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
    0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49,
    0x6d, 0x8b, 0xd1, 0x25, 0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16,
    0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92, 0x6c, 0x70, 0x48, 0x50,
    0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
    0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05,
    0xb8, 0xb3, 0x45, 0x06, 0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02,
    0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b, 0x3a, 0x91, 0x11, 0x41,
    0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
    0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8,
    0x1c, 0x75, 0xdf, 0x6e, 0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89,
    0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b, 0xfc, 0x56, 0x3e, 0x4b,
    0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
    0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59,
    0x27, 0x80, 0xec, 0x5f, 0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d,
    0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef, 0xa0, 0xe0, 0x3b, 0x4d,
    0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
    0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63,
    0x55, 0x21, 0x0c, 0x7d]);

  var mixCol = new Uint8Array(256);
  for (var i = 0; i < 256; i++) {
    if (i < 128) {
      mixCol[i] = i << 1;
    } else {
      mixCol[i] = (i << 1) ^ 0x1b;
    }
  }
  var mix = new Uint32Array([
    0x00000000, 0x0e090d0b, 0x1c121a16, 0x121b171d, 0x3824342c, 0x362d3927,
    0x24362e3a, 0x2a3f2331, 0x70486858, 0x7e416553, 0x6c5a724e, 0x62537f45,
    0x486c5c74, 0x4665517f, 0x547e4662, 0x5a774b69, 0xe090d0b0, 0xee99ddbb,
    0xfc82caa6, 0xf28bc7ad, 0xd8b4e49c, 0xd6bde997, 0xc4a6fe8a, 0xcaaff381,
    0x90d8b8e8, 0x9ed1b5e3, 0x8ccaa2fe, 0x82c3aff5, 0xa8fc8cc4, 0xa6f581cf,
    0xb4ee96d2, 0xbae79bd9, 0xdb3bbb7b, 0xd532b670, 0xc729a16d, 0xc920ac66,
    0xe31f8f57, 0xed16825c, 0xff0d9541, 0xf104984a, 0xab73d323, 0xa57ade28,
    0xb761c935, 0xb968c43e, 0x9357e70f, 0x9d5eea04, 0x8f45fd19, 0x814cf012,
    0x3bab6bcb, 0x35a266c0, 0x27b971dd, 0x29b07cd6, 0x038f5fe7, 0x0d8652ec,
    0x1f9d45f1, 0x119448fa, 0x4be30393, 0x45ea0e98, 0x57f11985, 0x59f8148e,
    0x73c737bf, 0x7dce3ab4, 0x6fd52da9, 0x61dc20a2, 0xad766df6, 0xa37f60fd,
    0xb16477e0, 0xbf6d7aeb, 0x955259da, 0x9b5b54d1, 0x894043cc, 0x87494ec7,
    0xdd3e05ae, 0xd33708a5, 0xc12c1fb8, 0xcf2512b3, 0xe51a3182, 0xeb133c89,
    0xf9082b94, 0xf701269f, 0x4de6bd46, 0x43efb04d, 0x51f4a750, 0x5ffdaa5b,
    0x75c2896a, 0x7bcb8461, 0x69d0937c, 0x67d99e77, 0x3daed51e, 0x33a7d815,
    0x21bccf08, 0x2fb5c203, 0x058ae132, 0x0b83ec39, 0x1998fb24, 0x1791f62f,
    0x764dd68d, 0x7844db86, 0x6a5fcc9b, 0x6456c190, 0x4e69e2a1, 0x4060efaa,
    0x527bf8b7, 0x5c72f5bc, 0x0605bed5, 0x080cb3de, 0x1a17a4c3, 0x141ea9c8,
    0x3e218af9, 0x302887f2, 0x223390ef, 0x2c3a9de4, 0x96dd063d, 0x98d40b36,
    0x8acf1c2b, 0x84c61120, 0xaef93211, 0xa0f03f1a, 0xb2eb2807, 0xbce2250c,
    0xe6956e65, 0xe89c636e, 0xfa877473, 0xf48e7978, 0xdeb15a49, 0xd0b85742,
    0xc2a3405f, 0xccaa4d54, 0x41ecdaf7, 0x4fe5d7fc, 0x5dfec0e1, 0x53f7cdea,
    0x79c8eedb, 0x77c1e3d0, 0x65daf4cd, 0x6bd3f9c6, 0x31a4b2af, 0x3fadbfa4,
    0x2db6a8b9, 0x23bfa5b2, 0x09808683, 0x07898b88, 0x15929c95, 0x1b9b919e,
    0xa17c0a47, 0xaf75074c, 0xbd6e1051, 0xb3671d5a, 0x99583e6b, 0x97513360,
    0x854a247d, 0x8b432976, 0xd134621f, 0xdf3d6f14, 0xcd267809, 0xc32f7502,
    0xe9105633, 0xe7195b38, 0xf5024c25, 0xfb0b412e, 0x9ad7618c, 0x94de6c87,
    0x86c57b9a, 0x88cc7691, 0xa2f355a0, 0xacfa58ab, 0xbee14fb6, 0xb0e842bd,
    0xea9f09d4, 0xe49604df, 0xf68d13c2, 0xf8841ec9, 0xd2bb3df8, 0xdcb230f3,
    0xcea927ee, 0xc0a02ae5, 0x7a47b13c, 0x744ebc37, 0x6655ab2a, 0x685ca621,
    0x42638510, 0x4c6a881b, 0x5e719f06, 0x5078920d, 0x0a0fd964, 0x0406d46f,
    0x161dc372, 0x1814ce79, 0x322bed48, 0x3c22e043, 0x2e39f75e, 0x2030fa55,
    0xec9ab701, 0xe293ba0a, 0xf088ad17, 0xfe81a01c, 0xd4be832d, 0xdab78e26,
    0xc8ac993b, 0xc6a59430, 0x9cd2df59, 0x92dbd252, 0x80c0c54f, 0x8ec9c844,
    0xa4f6eb75, 0xaaffe67e, 0xb8e4f163, 0xb6edfc68, 0x0c0a67b1, 0x02036aba,
    0x10187da7, 0x1e1170ac, 0x342e539d, 0x3a275e96, 0x283c498b, 0x26354480,
    0x7c420fe9, 0x724b02e2, 0x605015ff, 0x6e5918f4, 0x44663bc5, 0x4a6f36ce,
    0x587421d3, 0x567d2cd8, 0x37a10c7a, 0x39a80171, 0x2bb3166c, 0x25ba1b67,
    0x0f853856, 0x018c355d, 0x13972240, 0x1d9e2f4b, 0x47e96422, 0x49e06929,
    0x5bfb7e34, 0x55f2733f, 0x7fcd500e, 0x71c45d05, 0x63df4a18, 0x6dd64713,
    0xd731dcca, 0xd938d1c1, 0xcb23c6dc, 0xc52acbd7, 0xef15e8e6, 0xe11ce5ed,
    0xf307f2f0, 0xfd0efffb, 0xa779b492, 0xa970b999, 0xbb6bae84, 0xb562a38f,
    0x9f5d80be, 0x91548db5, 0x834f9aa8, 0x8d4697a3]);

  function expandKey256(cipherKey) {
    var b = 240, result = new Uint8Array(b);
    var r = 1;

    result.set(cipherKey);
    for (var j = 32, i = 1; j < b; ++i) {
      if (j % 32 === 16) {
        t1 = s[t1];
        t2 = s[t2];
        t3 = s[t3];
        t4 = s[t4];
      } else if (j % 32 === 0) {
        // RotWord
        var t1 = result[j - 3], t2 = result[j - 2],
          t3 = result[j - 1], t4 = result[j - 4];
        // SubWord
        t1 = s[t1];
        t2 = s[t2];
        t3 = s[t3];
        t4 = s[t4];
        // Rcon
        t1 = t1 ^ r;
        if ((r <<= 1) >= 256) {
          r = (r ^ 0x1b) & 0xFF;
        }
      }

      for (var n = 0; n < 4; ++n) {
        result[j] = (t1 ^= result[j - 32]);
        j++;
        result[j] = (t2 ^= result[j - 32]);
        j++;
        result[j] = (t3 ^= result[j - 32]);
        j++;
        result[j] = (t4 ^= result[j - 32]);
        j++;
      }
    }
    return result;
  }

  function decrypt256(input, key) {
    var state = new Uint8Array(16);
    state.set(input);
    var i, j, k;
    var t, u, v;
    // AddRoundKey
    for (j = 0, k = 224; j < 16; ++j, ++k) {
      state[j] ^= key[k];
    }
    for (i = 13; i >= 1; --i) {
      // InvShiftRows
      t = state[13];
      state[13] = state[9];
      state[9] = state[5];
      state[5] = state[1];
      state[1] = t;
      t = state[14];
      u = state[10];
      state[14] = state[6];
      state[10] = state[2];
      state[6] = t;
      state[2] = u;
      t = state[15];
      u = state[11];
      v = state[7];
      state[15] = state[3];
      state[11] = t;
      state[7] = u;
      state[3] = v;
      // InvSubBytes
      for (j = 0; j < 16; ++j) {
        state[j] = inv_s[state[j]];
      }
      // AddRoundKey
      for (j = 0, k = i * 16; j < 16; ++j, ++k) {
        state[j] ^= key[k];
      }
      // InvMixColumns
      for (j = 0; j < 16; j += 4) {
        var s0 = mix[state[j]], s1 = mix[state[j + 1]],
            s2 = mix[state[j + 2]], s3 = mix[state[j + 3]];
        t = (s0 ^ (s1 >>> 8) ^ (s1 << 24) ^ (s2 >>> 16) ^ (s2 << 16) ^
            (s3 >>> 24) ^ (s3 << 8));
        state[j] = (t >>> 24) & 0xFF;
        state[j + 1] = (t >> 16) & 0xFF;
        state[j + 2] = (t >> 8) & 0xFF;
        state[j + 3] = t & 0xFF;
      }
    }
    // InvShiftRows
    t = state[13];
    state[13] = state[9];
    state[9] = state[5];
    state[5] = state[1];
    state[1] = t;
    t = state[14];
    u = state[10];
    state[14] = state[6];
    state[10] = state[2];
    state[6] = t;
    state[2] = u;
    t = state[15];
    u = state[11];
    v = state[7];
    state[15] = state[3];
    state[11] = t;
    state[7] = u;
    state[3] = v;
    for (j = 0; j < 16; ++j) {
      // InvSubBytes
      state[j] = inv_s[state[j]];
      // AddRoundKey
      state[j] ^= key[j];
    }
    return state;
  }

  function encrypt256(input, key) {
    var t, u, v, k;
    var state = new Uint8Array(16);
    state.set(input);
    for (j = 0; j < 16; ++j) {
      // AddRoundKey
      state[j] ^= key[j];
    }

    for (i = 1; i < 14; i++) {
      //SubBytes
      for (j = 0; j < 16; ++j) {
        state[j] = s[state[j]];
      }
      //ShiftRows
      v = state[1];
      state[1] = state[5];
      state[5] = state[9];
      state[9] = state[13];
      state[13] = v;
      v = state[2];
      u = state[6];
      state[2] = state[10];
      state[6] = state[14];
      state[10] = v;
      state[14] = u;
      v = state[3];
      u = state[7];
      t = state[11];
      state[3] = state[15];
      state[7] = v;
      state[11] = u;
      state[15] = t;
      //MixColumns
      for (var j = 0; j < 16; j += 4) {
        var s0 = state[j + 0], s1 = state[j + 1];
        var s2 = state[j + 2], s3 = state[j + 3];
        t = s0 ^ s1 ^ s2 ^ s3;
        state[j + 0] ^= t ^ mixCol[s0 ^ s1];
        state[j + 1] ^= t ^ mixCol[s1 ^ s2];
        state[j + 2] ^= t ^ mixCol[s2 ^ s3];
        state[j + 3] ^= t ^ mixCol[s3 ^ s0];
      }
      //AddRoundKey
      for (j = 0, k = i * 16; j < 16; ++j, ++k) {
        state[j] ^= key[k];
      }
    }

    //SubBytes
    for (j = 0; j < 16; ++j) {
      state[j] = s[state[j]];
    }
    //ShiftRows
    v = state[1];
    state[1] = state[5];
    state[5] = state[9];
    state[9] = state[13];
    state[13] = v;
    v = state[2];
    u = state[6];
    state[2] = state[10];
    state[6] = state[14];
    state[10] = v;
    state[14] = u;
    v = state[3];
    u = state[7];
    t = state[11];
    state[3] = state[15];
    state[7] = v;
    state[11] = u;
    state[15] = t;
    //AddRoundKey
    for (j = 0, k = 224; j < 16; ++j, ++k) {
      state[j] ^= key[k];
    }

    return state;

  }

  function AES256Cipher(key) {
    this.key = expandKey256(key);
    this.buffer = new Uint8Array(16);
    this.bufferPosition = 0;
  }

  function decryptBlock2(data, finalize) {
    var i, j, ii, sourceLength = data.length,
        buffer = this.buffer, bufferLength = this.bufferPosition,
        result = [], iv = this.iv;

    for (i = 0; i < sourceLength; ++i) {
      buffer[bufferLength] = data[i];
      ++bufferLength;
      if (bufferLength < 16) {
        continue;
      }
      // buffer is full, decrypting
      var plain = decrypt256(buffer, this.key);
      // xor-ing the IV vector to get plain text
      for (j = 0; j < 16; ++j) {
        plain[j] ^= iv[j];
      }
      iv = buffer;
      result.push(plain);
      buffer = new Uint8Array(16);
      bufferLength = 0;
    }
    // saving incomplete buffer
    this.buffer = buffer;
    this.bufferLength = bufferLength;
    this.iv = iv;
    if (result.length === 0) {
      return new Uint8Array([]);
    }
    // combining plain text blocks into one
    var outputLength = 16 * result.length;
    if (finalize) {
      // undo a padding that is described in RFC 2898
      var lastBlock = result[result.length - 1];
      var psLen = lastBlock[15];
      if (psLen <= 16) {
        for (i = 15, ii = 16 - psLen; i >= ii; --i) {
          if (lastBlock[i] !== psLen) {
            // Invalid padding, assume that the block has no padding.
            psLen = 0;
            break;
          }
        }
        outputLength -= psLen;
        result[result.length - 1] = lastBlock.subarray(0, 16 - psLen);
      }
    }
    var output = new Uint8Array(outputLength);
    for (i = 0, j = 0, ii = result.length; i < ii; ++i, j += 16) {
      output.set(result[i], j);
    }
    return output;

  }

  AES256Cipher.prototype = {
    decryptBlock: function AES256Cipher_decryptBlock(data, finalize, iv) {
      var i, sourceLength = data.length;
      var buffer = this.buffer, bufferLength = this.bufferPosition;
      // if not supplied an IV wait for IV values
      // they are at the start of the stream
      if (iv) {
        this.iv = iv;
      } else {
        for (i = 0; bufferLength < 16 &&
             i < sourceLength; ++i, ++bufferLength) {
          buffer[bufferLength] = data[i];
        }
        if (bufferLength < 16) {
          //need more data
          this.bufferLength = bufferLength;
          return new Uint8Array([]);
        }
        this.iv = buffer;
        data = data.subarray(16);
      }
      this.buffer = new Uint8Array(16);
      this.bufferLength = 0;
      // starting decryption
      this.decryptBlock = decryptBlock2;
      return this.decryptBlock(data, finalize);
    },
    encrypt: function AES256Cipher_encrypt(data, iv) {
      var i, j, ii, sourceLength = data.length,
          buffer = this.buffer, bufferLength = this.bufferPosition,
          result = [];
      if (!iv) {
        iv = new Uint8Array(16);
      }
      for (i = 0; i < sourceLength; ++i) {
        buffer[bufferLength] = data[i];
        ++bufferLength;
        if (bufferLength < 16) {
          continue;
        }
        for (j = 0; j < 16; ++j) {
          buffer[j] ^= iv[j];
        }

        // buffer is full, encrypting
        var cipher = encrypt256(buffer, this.key);
        this.iv = cipher;
        result.push(cipher);
        buffer = new Uint8Array(16);
        bufferLength = 0;
      }
      // saving incomplete buffer
      this.buffer = buffer;
      this.bufferLength = bufferLength;
      this.iv = iv;
      if (result.length === 0) {
        return new Uint8Array([]);
      }
      // combining plain text blocks into one
      var outputLength = 16 * result.length;
      var output = new Uint8Array(outputLength);
      for (i = 0, j = 0, ii = result.length; i < ii; ++i, j += 16) {
        output.set(result[i], j);
      }
      return output;
    }
  };

  return AES256Cipher;
})();

var PDF17 = (function PDF17Closure() {

  function compareByteArrays(array1, array2) {
    if (array1.length !== array2.length) {
      return false;
    }
    for (var i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        return false;
      }
    }
    return true;
  }

  function PDF17() {
  }

  PDF17.prototype = {
    checkOwnerPassword: function PDF17_checkOwnerPassword(password,
                                                          ownerValidationSalt,
                                                          userBytes,
                                                          ownerPassword) {
      var hashData = new Uint8Array(password.length + 56);
      hashData.set(password, 0);
      hashData.set(ownerValidationSalt, password.length);
      hashData.set(userBytes, password.length + ownerValidationSalt.length);
      var result = calculateSHA256(hashData, 0, hashData.length);
      return compareByteArrays(result, ownerPassword);
    },
    checkUserPassword: function PDF17_checkUserPassword(password,
                                                        userValidationSalt,
                                                        userPassword) {
      var hashData = new Uint8Array(password.length + 8);
      hashData.set(password, 0);
      hashData.set(userValidationSalt, password.length);
      var result = calculateSHA256(hashData, 0, hashData.length);
      return compareByteArrays(result, userPassword);
    },
    getOwnerKey: function PDF17_getOwnerKey(password, ownerKeySalt, userBytes,
                                            ownerEncryption) {
      var hashData = new Uint8Array(password.length + 56);
      hashData.set(password, 0);
      hashData.set(ownerKeySalt, password.length);
      hashData.set(userBytes, password.length + ownerKeySalt.length);
      var key = calculateSHA256(hashData, 0, hashData.length);
      var cipher = new AES256Cipher(key);
      return cipher.decryptBlock(ownerEncryption,
                                 false,
                                 new Uint8Array(16));

    },
    getUserKey: function PDF17_getUserKey(password, userKeySalt,
                                          userEncryption) {
      var hashData = new Uint8Array(password.length + 8);
      hashData.set(password, 0);
      hashData.set(userKeySalt, password.length);
      //key is the decryption key for the UE string
      var key = calculateSHA256(hashData, 0, hashData.length);
      var cipher = new AES256Cipher(key);
      return cipher.decryptBlock(userEncryption,
                                 false,
                                 new Uint8Array(16));
    }
  };
  return PDF17;
})();

var PDF20 = (function PDF20Closure() {

  function concatArrays(array1, array2) {
    var t = new Uint8Array(array1.length + array2.length);
    t.set(array1, 0);
    t.set(array2, array1.length);
    return t;
  }

  function calculatePDF20Hash(password, input, userBytes) {
    //This refers to Algorithm 2.B as defined in ISO 32000-2
    var k = calculateSHA256(input, 0, input.length).subarray(0, 32);
    var e = [0];
    var i = 0;
    while (i < 64 || e[e.length - 1] > i - 32) {
      var arrayLength = password.length + k.length + userBytes.length;

      var k1 = new Uint8Array(arrayLength * 64);
      var array = concatArrays(password, k);
      array = concatArrays(array, userBytes);
      for (var j = 0, pos = 0; j < 64; j++, pos += arrayLength) {
        k1.set(array, pos);
      }
      //AES128 CBC NO PADDING with
      //first 16 bytes of k as the key and the second 16 as the iv.
      var cipher = new AES128Cipher(k.subarray(0, 16));
      e = cipher.encrypt(k1, k.subarray(16, 32));
      //Now we have to take the first 16 bytes of an unsigned
      //big endian integer... and compute the remainder
      //modulo 3.... That is a fairly large number and
      //JavaScript isn't going to handle that well...
      //So we're using a trick that allows us to perform
      //modulo math byte by byte
      var remainder = 0;
      for (var z = 0; z < 16; z++) {
        remainder *= (256 % 3);
        remainder %= 3;
        remainder += ((e[z] >>> 0) % 3);
        remainder %= 3;
      }
      if (remainder === 0) {
        k = calculateSHA256(e, 0, e.length);
      }
      else if (remainder === 1) {
        k = calculateSHA384(e, 0, e.length);
      }
      else if (remainder === 2) {
        k = calculateSHA512(e, 0, e.length);
      }
      i++;
    }
    return k.subarray(0, 32);
  }

  function PDF20() {
  }

  function compareByteArrays(array1, array2) {
    if (array1.length !== array2.length) {
      return false;
    }
    for (var i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        return false;
      }
    }
    return true;
  }

  PDF20.prototype = {
    hash: function PDF20_hash(password, concatBytes, userBytes) {
      return calculatePDF20Hash(password, concatBytes, userBytes);
    },
    checkOwnerPassword: function PDF20_checkOwnerPassword(password,
                                                          ownerValidationSalt,
                                                          userBytes,
                                                          ownerPassword) {
      var hashData = new Uint8Array(password.length + 56);
      hashData.set(password, 0);
      hashData.set(ownerValidationSalt, password.length);
      hashData.set(userBytes, password.length + ownerValidationSalt.length);
      var result = calculatePDF20Hash(password, hashData, userBytes);
      return compareByteArrays(result, ownerPassword);
    },
    checkUserPassword: function PDF20_checkUserPassword(password,
                                                        userValidationSalt,
                                                        userPassword) {
      var hashData = new Uint8Array(password.length + 8);
      hashData.set(password, 0);
      hashData.set(userValidationSalt, password.length);
      var result = calculatePDF20Hash(password, hashData, []);
      return compareByteArrays(result, userPassword);
    },
    getOwnerKey: function PDF20_getOwnerKey(password, ownerKeySalt, userBytes,
                                            ownerEncryption) {
      var hashData = new Uint8Array(password.length + 56);
      hashData.set(password, 0);
      hashData.set(ownerKeySalt, password.length);
      hashData.set(userBytes, password.length + ownerKeySalt.length);
      var key = calculatePDF20Hash(password, hashData, userBytes);
      var cipher = new AES256Cipher(key);
      return cipher.decryptBlock(ownerEncryption,
                                 false,
                                 new Uint8Array(16));

    },
    getUserKey: function PDF20_getUserKey(password, userKeySalt,
                                          userEncryption) {
      var hashData = new Uint8Array(password.length + 8);
      hashData.set(password, 0);
      hashData.set(userKeySalt, password.length);
      //key is the decryption key for the UE string
      var key = calculatePDF20Hash(password, hashData, []);
      var cipher = new AES256Cipher(key);
      return cipher.decryptBlock(userEncryption,
                                 false,
                                 new Uint8Array(16));
    }
  };
  return PDF20;
})();

var CipherTransform = (function CipherTransformClosure() {
  function CipherTransform(stringCipherConstructor, streamCipherConstructor) {
    this.stringCipherConstructor = stringCipherConstructor;
    this.streamCipherConstructor = streamCipherConstructor;
  }

  CipherTransform.prototype = {
    createStream: function CipherTransform_createStream(stream, length) {
      var cipher = new this.streamCipherConstructor();
      return new DecryptStream(stream, length,
        function cipherTransformDecryptStream(data, finalize) {
          return cipher.decryptBlock(data, finalize);
        }
      );
    },
    decryptString: function CipherTransform_decryptString(s) {
      var cipher = new this.stringCipherConstructor();
      var data = stringToBytes(s);
      data = cipher.decryptBlock(data, true);
      return bytesToString(data);
    }
  };
  return CipherTransform;
})();

var CipherTransformFactory = (function CipherTransformFactoryClosure() {
  var defaultPasswordBytes = new Uint8Array([
    0x28, 0xBF, 0x4E, 0x5E, 0x4E, 0x75, 0x8A, 0x41,
    0x64, 0x00, 0x4E, 0x56, 0xFF, 0xFA, 0x01, 0x08,
    0x2E, 0x2E, 0x00, 0xB6, 0xD0, 0x68, 0x3E, 0x80,
    0x2F, 0x0C, 0xA9, 0xFE, 0x64, 0x53, 0x69, 0x7A]);

  function createEncryptionKey20(revision, password, ownerPassword,
                                 ownerValidationSalt, ownerKeySalt, uBytes,
                                 userPassword, userValidationSalt, userKeySalt,
                                 ownerEncryption, userEncryption, perms) {
    if (password) {
      var passwordLength = Math.min(127, password.length);
      password = password.subarray(0, passwordLength);
    } else {
      password = [];
    }
    var pdfAlgorithm;
    if (revision === 6) {
      pdfAlgorithm = new PDF20();
    } else {
      pdfAlgorithm = new PDF17();
    }

    if (pdfAlgorithm) {
      if (pdfAlgorithm.checkUserPassword(password, userValidationSalt,
                                         userPassword)) {
        return pdfAlgorithm.getUserKey(password, userKeySalt, userEncryption);
      } else if (pdfAlgorithm.checkOwnerPassword(password, ownerValidationSalt,
                                                 uBytes,
                                                 ownerPassword)) {
        return pdfAlgorithm.getOwnerKey(password, ownerKeySalt, uBytes,
                                        ownerEncryption);
      }
    }

    return null;
  }

  function prepareKeyData(fileId, password, ownerPassword, userPassword,
                          flags, revision, keyLength, encryptMetadata) {
    var hashDataSize = 40 + ownerPassword.length + fileId.length;
    var hashData = new Uint8Array(hashDataSize), i = 0, j, n;
    if (password) {
      n = Math.min(32, password.length);
      for (; i < n; ++i) {
        hashData[i] = password[i];
      }
    }
    j = 0;
    while (i < 32) {
      hashData[i++] = defaultPasswordBytes[j++];
    }
    // as now the padded password in the hashData[0..i]
    for (j = 0, n = ownerPassword.length; j < n; ++j) {
      hashData[i++] = ownerPassword[j];
    }
    hashData[i++] = flags & 0xFF;
    hashData[i++] = (flags >> 8) & 0xFF;
    hashData[i++] = (flags >> 16) & 0xFF;
    hashData[i++] = (flags >>> 24) & 0xFF;
    for (j = 0, n = fileId.length; j < n; ++j) {
      hashData[i++] = fileId[j];
    }
    if (revision >= 4 && !encryptMetadata) {
      hashData[i++] = 0xFF;
      hashData[i++] = 0xFF;
      hashData[i++] = 0xFF;
      hashData[i++] = 0xFF;
    }
    var hash = calculateMD5(hashData, 0, i);
    var keyLengthInBytes = keyLength >> 3;
    if (revision >= 3) {
      for (j = 0; j < 50; ++j) {
        hash = calculateMD5(hash, 0, keyLengthInBytes);
      }
    }
    var encryptionKey = hash.subarray(0, keyLengthInBytes);
    var cipher, checkData;

    if (revision >= 3) {
      for (i = 0; i < 32; ++i) {
        hashData[i] = defaultPasswordBytes[i];
      }
      for (j = 0, n = fileId.length; j < n; ++j) {
        hashData[i++] = fileId[j];
      }
      cipher = new ARCFourCipher(encryptionKey);
      checkData = cipher.encryptBlock(calculateMD5(hashData, 0, i));
      n = encryptionKey.length;
      var derivedKey = new Uint8Array(n), k;
      for (j = 1; j <= 19; ++j) {
        for (k = 0; k < n; ++k) {
          derivedKey[k] = encryptionKey[k] ^ j;
        }
        cipher = new ARCFourCipher(derivedKey);
        checkData = cipher.encryptBlock(checkData);
      }
      for (j = 0, n = checkData.length; j < n; ++j) {
        if (userPassword[j] !== checkData[j]) {
          return null;
        }
      }
    } else {
      cipher = new ARCFourCipher(encryptionKey);
      checkData = cipher.encryptBlock(defaultPasswordBytes);
      for (j = 0, n = checkData.length; j < n; ++j) {
        if (userPassword[j] !== checkData[j]) {
          return null;
        }
      }
    }
    return encryptionKey;
  }

  function decodeUserPassword(password, ownerPassword, revision, keyLength) {
    var hashData = new Uint8Array(32), i = 0, j, n;
    n = Math.min(32, password.length);
    for (; i < n; ++i) {
      hashData[i] = password[i];
    }
    j = 0;
    while (i < 32) {
      hashData[i++] = defaultPasswordBytes[j++];
    }
    var hash = calculateMD5(hashData, 0, i);
    var keyLengthInBytes = keyLength >> 3;
    if (revision >= 3) {
      for (j = 0; j < 50; ++j) {
        hash = calculateMD5(hash, 0, hash.length);
      }
    }

    var cipher, userPassword;
    if (revision >= 3) {
      userPassword = ownerPassword;
      var derivedKey = new Uint8Array(keyLengthInBytes), k;
      for (j = 19; j >= 0; j--) {
        for (k = 0; k < keyLengthInBytes; ++k) {
          derivedKey[k] = hash[k] ^ j;
        }
        cipher = new ARCFourCipher(derivedKey);
        userPassword = cipher.encryptBlock(userPassword);
      }
    } else {
      cipher = new ARCFourCipher(hash.subarray(0, keyLengthInBytes));
      userPassword = cipher.encryptBlock(ownerPassword);
    }
    return userPassword;
  }

  var identityName = Name.get('Identity');

  function CipherTransformFactory(dict, fileId, password) {
    var filter = dict.get('Filter');
    if (!isName(filter) || filter.name !== 'Standard') {
      error('unknown encryption method');
    }
    this.dict = dict;
    var algorithm = dict.get('V');
    if (!isInt(algorithm) ||
        (algorithm !== 1 && algorithm !== 2 && algorithm !== 4 &&
        algorithm !== 5)) {
      error('unsupported encryption algorithm');
    }
    this.algorithm = algorithm;
    var keyLength = dict.get('Length') || 40;
    if (!isInt(keyLength) ||
        keyLength < 40 || (keyLength % 8) !== 0) {
      error('invalid key length');
    }

    // prepare keys
    var ownerPassword = stringToBytes(dict.get('O')).subarray(0, 32);
    var userPassword = stringToBytes(dict.get('U')).subarray(0, 32);
    var flags = dict.get('P');
    var revision = dict.get('R');
    // meaningful when V is 4 or 5
    var encryptMetadata = ((algorithm === 4 || algorithm === 5) &&
                           dict.get('EncryptMetadata') !== false);
    this.encryptMetadata = encryptMetadata;

    var fileIdBytes = stringToBytes(fileId);
    var passwordBytes;
    if (password) {
      passwordBytes = stringToBytes(password);
    }

    var encryptionKey;
    if (algorithm !== 5) {
      encryptionKey = prepareKeyData(fileIdBytes, passwordBytes,
                                     ownerPassword, userPassword, flags,
                                     revision, keyLength, encryptMetadata);
    }
    else {
      var ownerValidationSalt = stringToBytes(dict.get('O')).subarray(32, 40);
      var ownerKeySalt = stringToBytes(dict.get('O')).subarray(40, 48);
      var uBytes = stringToBytes(dict.get('U')).subarray(0, 48);
      var userValidationSalt = stringToBytes(dict.get('U')).subarray(32, 40);
      var userKeySalt = stringToBytes(dict.get('U')).subarray(40, 48);
      var ownerEncryption = stringToBytes(dict.get('OE'));
      var userEncryption = stringToBytes(dict.get('UE'));
      var perms = stringToBytes(dict.get('Perms'));
      encryptionKey =
        createEncryptionKey20(revision, passwordBytes,
          ownerPassword, ownerValidationSalt,
          ownerKeySalt, uBytes,
          userPassword, userValidationSalt,
          userKeySalt, ownerEncryption,
          userEncryption, perms);
    }
    if (!encryptionKey && !password) {
      throw new PasswordException('No password given',
                                  PasswordResponses.NEED_PASSWORD);
    } else if (!encryptionKey && password) {
      // Attempting use the password as an owner password
      var decodedPassword = decodeUserPassword(passwordBytes, ownerPassword,
                                               revision, keyLength);
      encryptionKey = prepareKeyData(fileIdBytes, decodedPassword,
                                     ownerPassword, userPassword, flags,
                                     revision, keyLength, encryptMetadata);
    }

    if (!encryptionKey) {
      throw new PasswordException('Incorrect Password',
                                  PasswordResponses.INCORRECT_PASSWORD);
    }

    this.encryptionKey = encryptionKey;

    if (algorithm >= 4) {
      this.cf = dict.get('CF');
      this.stmf = dict.get('StmF') || identityName;
      this.strf = dict.get('StrF') || identityName;
      this.eff = dict.get('EFF') || this.stmf;
    }
  }

  function buildObjectKey(num, gen, encryptionKey, isAes) {
    var key = new Uint8Array(encryptionKey.length + 9), i, n;
    for (i = 0, n = encryptionKey.length; i < n; ++i) {
      key[i] = encryptionKey[i];
    }
    key[i++] = num & 0xFF;
    key[i++] = (num >> 8) & 0xFF;
    key[i++] = (num >> 16) & 0xFF;
    key[i++] = gen & 0xFF;
    key[i++] = (gen >> 8) & 0xFF;
    if (isAes) {
      key[i++] = 0x73;
      key[i++] = 0x41;
      key[i++] = 0x6C;
      key[i++] = 0x54;
    }
    var hash = calculateMD5(key, 0, i);
    return hash.subarray(0, Math.min(encryptionKey.length + 5, 16));
  }

  function buildCipherConstructor(cf, name, num, gen, key) {
    var cryptFilter = cf.get(name.name);
    var cfm;
    if (cryptFilter !== null && cryptFilter !== undefined) {
      cfm = cryptFilter.get('CFM');
    }
    if (!cfm || cfm.name === 'None') {
      return function cipherTransformFactoryBuildCipherConstructorNone() {
        return new NullCipher();
      };
    }
    if ('V2' === cfm.name) {
      return function cipherTransformFactoryBuildCipherConstructorV2() {
        return new ARCFourCipher(buildObjectKey(num, gen, key, false));
      };
    }
    if ('AESV2' === cfm.name) {
      return function cipherTransformFactoryBuildCipherConstructorAESV2() {
        return new AES128Cipher(buildObjectKey(num, gen, key, true));
      };
    }
    if ('AESV3' === cfm.name) {
      return function cipherTransformFactoryBuildCipherConstructorAESV3() {
        return new AES256Cipher(key);
      };
    }
    error('Unknown crypto method');
  }

  CipherTransformFactory.prototype = {
    createCipherTransform:
      function CipherTransformFactory_createCipherTransform(num, gen) {
      if (this.algorithm === 4 || this.algorithm === 5) {
        return new CipherTransform(
          buildCipherConstructor(this.cf, this.stmf,
                                 num, gen, this.encryptionKey),
          buildCipherConstructor(this.cf, this.strf,
                                 num, gen, this.encryptionKey));
      }
      // algorithms 1 and 2
      var key = buildObjectKey(num, gen, this.encryptionKey, false);
      var cipherConstructor = function buildCipherCipherConstructor() {
        return new ARCFourCipher(key);
      };
      return new CipherTransform(cipherConstructor, cipherConstructor);
    }
  };

  return CipherTransformFactory;
})();


var PatternType = {
  FUNCTION_BASED: 1,
  AXIAL: 2,
  RADIAL: 3,
  FREE_FORM_MESH: 4,
  LATTICE_FORM_MESH: 5,
  COONS_PATCH_MESH: 6,
  TENSOR_PATCH_MESH: 7
};

var Pattern = (function PatternClosure() {
  // Constructor should define this.getPattern
  function Pattern() {
    error('should not call Pattern constructor');
  }

  Pattern.prototype = {
    // Input: current Canvas context
    // Output: the appropriate fillStyle or strokeStyle
    getPattern: function Pattern_getPattern(ctx) {
      error('Should not call Pattern.getStyle: ' + ctx);
    }
  };

  Pattern.parseShading = function Pattern_parseShading(shading, matrix, xref,
                                                       res) {

    var dict = isStream(shading) ? shading.dict : shading;
    var type = dict.get('ShadingType');

    try {
      switch (type) {
        case PatternType.AXIAL:
        case PatternType.RADIAL:
          // Both radial and axial shadings are handled by RadialAxial shading.
          return new Shadings.RadialAxial(dict, matrix, xref, res);
        case PatternType.FREE_FORM_MESH:
        case PatternType.LATTICE_FORM_MESH:
        case PatternType.COONS_PATCH_MESH:
        case PatternType.TENSOR_PATCH_MESH:
          return new Shadings.Mesh(shading, matrix, xref, res);
        default:
          throw new Error('Unknown PatternType: ' + type);
      }
    } catch (ex) {
      if (ex instanceof MissingDataException) {
        throw ex;
      }
      UnsupportedManager.notify(UNSUPPORTED_FEATURES.shadingPattern);
      warn(ex);
      return new Shadings.Dummy();
    }
  };
  return Pattern;
})();

var Shadings = {};

// A small number to offset the first/last color stops so we can insert ones to
// support extend.  Number.MIN_VALUE appears to be too small and breaks the
// extend. 1e-7 works in FF but chrome seems to use an even smaller sized number
// internally so we have to go bigger.
Shadings.SMALL_NUMBER = 1e-2;

// Radial and axial shading have very similar implementations
// If needed, the implementations can be broken into two classes
Shadings.RadialAxial = (function RadialAxialClosure() {
  function RadialAxial(dict, matrix, xref, res) {
    this.matrix = matrix;
    this.coordsArr = dict.get('Coords');
    this.shadingType = dict.get('ShadingType');
    this.type = 'Pattern';
    var cs = dict.get('ColorSpace', 'CS');
    cs = ColorSpace.parse(cs, xref, res);
    this.cs = cs;

    var t0 = 0.0, t1 = 1.0;
    if (dict.has('Domain')) {
      var domainArr = dict.get('Domain');
      t0 = domainArr[0];
      t1 = domainArr[1];
    }

    var extendStart = false, extendEnd = false;
    if (dict.has('Extend')) {
      var extendArr = dict.get('Extend');
      extendStart = extendArr[0];
      extendEnd = extendArr[1];
    }

    if (this.shadingType === PatternType.RADIAL &&
       (!extendStart || !extendEnd)) {
      // Radial gradient only currently works if either circle is fully within
      // the other circle.
      var x1 = this.coordsArr[0];
      var y1 = this.coordsArr[1];
      var r1 = this.coordsArr[2];
      var x2 = this.coordsArr[3];
      var y2 = this.coordsArr[4];
      var r2 = this.coordsArr[5];
      var distance = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
      if (r1 <= r2 + distance &&
          r2 <= r1 + distance) {
        warn('Unsupported radial gradient.');
      }
    }

    this.extendStart = extendStart;
    this.extendEnd = extendEnd;

    var fnObj = dict.get('Function');
    var fn = PDFFunction.parseArray(xref, fnObj);

    // 10 samples seems good enough for now, but probably won't work
    // if there are sharp color changes. Ideally, we would implement
    // the spec faithfully and add lossless optimizations.
    var diff = t1 - t0;
    var step = diff / 10;

    var colorStops = this.colorStops = [];

    // Protect against bad domains so we don't end up in an infinte loop below.
    if (t0 >= t1 || step <= 0) {
      // Acrobat doesn't seem to handle these cases so we'll ignore for
      // now.
      info('Bad shading domain.');
      return;
    }

    var color = new Float32Array(cs.numComps), ratio = new Float32Array(1);
    var rgbColor;
    for (var i = t0; i <= t1; i += step) {
      ratio[0] = i;
      fn(ratio, 0, color, 0);
      rgbColor = cs.getRgb(color, 0);
      var cssColor = Util.makeCssRgb(rgbColor[0], rgbColor[1], rgbColor[2]);
      colorStops.push([(i - t0) / diff, cssColor]);
    }

    var background = 'transparent';
    if (dict.has('Background')) {
      rgbColor = cs.getRgb(dict.get('Background'), 0);
      background = Util.makeCssRgb(rgbColor[0], rgbColor[1], rgbColor[2]);
    }

    if (!extendStart) {
      // Insert a color stop at the front and offset the first real color stop
      // so it doesn't conflict with the one we insert.
      colorStops.unshift([0, background]);
      colorStops[1][0] += Shadings.SMALL_NUMBER;
    }
    if (!extendEnd) {
      // Same idea as above in extendStart but for the end.
      colorStops[colorStops.length - 1][0] -= Shadings.SMALL_NUMBER;
      colorStops.push([1, background]);
    }

    this.colorStops = colorStops;
  }

  RadialAxial.prototype = {
    getIR: function RadialAxial_getIR() {
      var coordsArr = this.coordsArr;
      var shadingType = this.shadingType;
      var type, p0, p1, r0, r1;
      if (shadingType === PatternType.AXIAL) {
        p0 = [coordsArr[0], coordsArr[1]];
        p1 = [coordsArr[2], coordsArr[3]];
        r0 = null;
        r1 = null;
        type = 'axial';
      } else if (shadingType === PatternType.RADIAL) {
        p0 = [coordsArr[0], coordsArr[1]];
        p1 = [coordsArr[3], coordsArr[4]];
        r0 = coordsArr[2];
        r1 = coordsArr[5];
        type = 'radial';
      } else {
        error('getPattern type unknown: ' + shadingType);
      }

      var matrix = this.matrix;
      if (matrix) {
        p0 = Util.applyTransform(p0, matrix);
        p1 = Util.applyTransform(p1, matrix);
      }

      return ['RadialAxial', type, this.colorStops, p0, p1, r0, r1];
    }
  };

  return RadialAxial;
})();

// All mesh shading. For now, they will be presented as set of the triangles
// to be drawn on the canvas and rgb color for each vertex.
Shadings.Mesh = (function MeshClosure() {
  function MeshStreamReader(stream, context) {
    this.stream = stream;
    this.context = context;
    this.buffer = 0;
    this.bufferLength = 0;

    var numComps = context.numComps;
    this.tmpCompsBuf = new Float32Array(numComps);
    var csNumComps = context.colorSpace;
    this.tmpCsCompsBuf = context.colorFn ? new Float32Array(csNumComps) :
                                           this.tmpCompsBuf;
  }
  MeshStreamReader.prototype = {
    get hasData() {
      if (this.stream.end) {
        return this.stream.pos < this.stream.end;
      }
      if (this.bufferLength > 0) {
        return true;
      }
      var nextByte = this.stream.getByte();
      if (nextByte < 0) {
        return false;
      }
      this.buffer = nextByte;
      this.bufferLength = 8;
      return true;
    },
    readBits: function MeshStreamReader_readBits(n) {
      var buffer = this.buffer;
      var bufferLength = this.bufferLength;
      if (n === 32) {
        if (bufferLength === 0) {
          return ((this.stream.getByte() << 24) |
            (this.stream.getByte() << 16) | (this.stream.getByte() << 8) |
            this.stream.getByte()) >>> 0;
        }
        buffer = (buffer << 24) | (this.stream.getByte() << 16) |
          (this.stream.getByte() << 8) | this.stream.getByte();
        var nextByte = this.stream.getByte();
        this.buffer = nextByte & ((1 << bufferLength) - 1);
        return ((buffer << (8 - bufferLength)) |
          ((nextByte & 0xFF) >> bufferLength)) >>> 0;
      }
      if (n === 8 && bufferLength === 0) {
        return this.stream.getByte();
      }
      while (bufferLength < n) {
        buffer = (buffer << 8) | this.stream.getByte();
        bufferLength += 8;
      }
      bufferLength -= n;
      this.bufferLength = bufferLength;
      this.buffer = buffer & ((1 << bufferLength) - 1);
      return buffer >> bufferLength;
    },
    align: function MeshStreamReader_align() {
      this.buffer = 0;
      this.bufferLength = 0;
    },
    readFlag: function MeshStreamReader_readFlag() {
      return this.readBits(this.context.bitsPerFlag);
    },
    readCoordinate: function MeshStreamReader_readCoordinate() {
      var bitsPerCoordinate = this.context.bitsPerCoordinate;
      var xi = this.readBits(bitsPerCoordinate);
      var yi = this.readBits(bitsPerCoordinate);
      var decode = this.context.decode;
      var scale = bitsPerCoordinate < 32 ? 1 / ((1 << bitsPerCoordinate) - 1) :
        2.3283064365386963e-10; // 2 ^ -32
      return [
        xi * scale * (decode[1] - decode[0]) + decode[0],
        yi * scale * (decode[3] - decode[2]) + decode[2]
      ];
    },
    readComponents: function MeshStreamReader_readComponents() {
      var numComps = this.context.numComps;
      var bitsPerComponent = this.context.bitsPerComponent;
      var scale = bitsPerComponent < 32 ? 1 / ((1 << bitsPerComponent) - 1) :
        2.3283064365386963e-10; // 2 ^ -32
      var decode = this.context.decode;
      var components = this.tmpCompsBuf;
      for (var i = 0, j = 4; i < numComps; i++, j += 2) {
        var ci = this.readBits(bitsPerComponent);
        components[i] = ci * scale * (decode[j + 1] - decode[j]) + decode[j];
      }
      var color = this.tmpCsCompsBuf;
      if (this.context.colorFn) {
        this.context.colorFn(components, 0, color, 0);
      }
      return this.context.colorSpace.getRgb(color, 0);
    }
  };

  function decodeType4Shading(mesh, reader) {
    var coords = mesh.coords;
    var colors = mesh.colors;
    var operators = [];
    var ps = []; // not maintaining cs since that will match ps
    var verticesLeft = 0; // assuming we have all data to start a new triangle
    while (reader.hasData) {
      var f = reader.readFlag();
      var coord = reader.readCoordinate();
      var color = reader.readComponents();
      if (verticesLeft === 0) { // ignoring flags if we started a triangle
        assert(0 <= f && f <= 2, 'Unknown type4 flag');
        switch (f) {
          case 0:
            verticesLeft = 3;
            break;
          case 1:
            ps.push(ps[ps.length - 2], ps[ps.length - 1]);
            verticesLeft = 1;
            break;
          case 2:
            ps.push(ps[ps.length - 3], ps[ps.length - 1]);
            verticesLeft = 1;
            break;
        }
        operators.push(f);
      }
      ps.push(coords.length);
      coords.push(coord);
      colors.push(color);
      verticesLeft--;

      reader.align();
    }

    var psPacked = new Int32Array(ps);

    mesh.figures.push({
      type: 'triangles',
      coords: psPacked,
      colors: psPacked
    });
  }

  function decodeType5Shading(mesh, reader, verticesPerRow) {
    var coords = mesh.coords;
    var colors = mesh.colors;
    var ps = []; // not maintaining cs since that will match ps
    while (reader.hasData) {
      var coord = reader.readCoordinate();
      var color = reader.readComponents();
      ps.push(coords.length);
      coords.push(coord);
      colors.push(color);
    }

    var psPacked = new Int32Array(ps);

    mesh.figures.push({
      type: 'lattice',
      coords: psPacked,
      colors: psPacked,
      verticesPerRow: verticesPerRow
    });
  }

  var MIN_SPLIT_PATCH_CHUNKS_AMOUNT = 3;
  var MAX_SPLIT_PATCH_CHUNKS_AMOUNT = 20;

  var TRIANGLE_DENSITY = 20; // count of triangles per entire mesh bounds

  var getB = (function getBClosure() {
    function buildB(count) {
      var lut = [];
      for (var i = 0; i <= count; i++) {
        var t = i / count, t_ = 1 - t;
        lut.push(new Float32Array([t_ * t_ * t_, 3 * t * t_ * t_,
          3 * t * t * t_, t * t * t]));
      }
      return lut;
    }
    var cache = [];
    return function getB(count) {
      if (!cache[count]) {
        cache[count] = buildB(count);
      }
      return cache[count];
    };
  })();

  function buildFigureFromPatch(mesh, index) {
    var figure = mesh.figures[index];
    assert(figure.type === 'patch', 'Unexpected patch mesh figure');

    var coords = mesh.coords, colors = mesh.colors;
    var pi = figure.coords;
    var ci = figure.colors;

    var figureMinX = Math.min(coords[pi[0]][0], coords[pi[3]][0],
                              coords[pi[12]][0], coords[pi[15]][0]);
    var figureMinY = Math.min(coords[pi[0]][1], coords[pi[3]][1],
                              coords[pi[12]][1], coords[pi[15]][1]);
    var figureMaxX = Math.max(coords[pi[0]][0], coords[pi[3]][0],
                              coords[pi[12]][0], coords[pi[15]][0]);
    var figureMaxY = Math.max(coords[pi[0]][1], coords[pi[3]][1],
                              coords[pi[12]][1], coords[pi[15]][1]);
    var splitXBy = Math.ceil((figureMaxX - figureMinX) * TRIANGLE_DENSITY /
                             (mesh.bounds[2] - mesh.bounds[0]));
    splitXBy = Math.max(MIN_SPLIT_PATCH_CHUNKS_AMOUNT,
               Math.min(MAX_SPLIT_PATCH_CHUNKS_AMOUNT, splitXBy));
    var splitYBy = Math.ceil((figureMaxY - figureMinY) * TRIANGLE_DENSITY /
                             (mesh.bounds[3] - mesh.bounds[1]));
    splitYBy = Math.max(MIN_SPLIT_PATCH_CHUNKS_AMOUNT,
               Math.min(MAX_SPLIT_PATCH_CHUNKS_AMOUNT, splitYBy));

    var verticesPerRow = splitXBy + 1;
    var figureCoords = new Int32Array((splitYBy + 1) * verticesPerRow);
    var figureColors = new Int32Array((splitYBy + 1) * verticesPerRow);
    var k = 0;
    var cl = new Uint8Array(3), cr = new Uint8Array(3);
    var c0 = colors[ci[0]], c1 = colors[ci[1]],
      c2 = colors[ci[2]], c3 = colors[ci[3]];
    var bRow = getB(splitYBy), bCol = getB(splitXBy);
    for (var row = 0; row <= splitYBy; row++) {
      cl[0] = ((c0[0] * (splitYBy - row) + c2[0] * row) / splitYBy) | 0;
      cl[1] = ((c0[1] * (splitYBy - row) + c2[1] * row) / splitYBy) | 0;
      cl[2] = ((c0[2] * (splitYBy - row) + c2[2] * row) / splitYBy) | 0;

      cr[0] = ((c1[0] * (splitYBy - row) + c3[0] * row) / splitYBy) | 0;
      cr[1] = ((c1[1] * (splitYBy - row) + c3[1] * row) / splitYBy) | 0;
      cr[2] = ((c1[2] * (splitYBy - row) + c3[2] * row) / splitYBy) | 0;

      for (var col = 0; col <= splitXBy; col++, k++) {
        if ((row === 0 || row === splitYBy) &&
            (col === 0 || col === splitXBy)) {
          continue;
        }
        var x = 0, y = 0;
        var q = 0;
        for (var i = 0; i <= 3; i++) {
          for (var j = 0; j <= 3; j++, q++) {
            var m = bRow[row][i] * bCol[col][j];
            x += coords[pi[q]][0] * m;
            y += coords[pi[q]][1] * m;
          }
        }
        figureCoords[k] = coords.length;
        coords.push([x, y]);
        figureColors[k] = colors.length;
        var newColor = new Uint8Array(3);
        newColor[0] = ((cl[0] * (splitXBy - col) + cr[0] * col) / splitXBy) | 0;
        newColor[1] = ((cl[1] * (splitXBy - col) + cr[1] * col) / splitXBy) | 0;
        newColor[2] = ((cl[2] * (splitXBy - col) + cr[2] * col) / splitXBy) | 0;
        colors.push(newColor);
      }
    }
    figureCoords[0] = pi[0];
    figureColors[0] = ci[0];
    figureCoords[splitXBy] = pi[3];
    figureColors[splitXBy] = ci[1];
    figureCoords[verticesPerRow * splitYBy] = pi[12];
    figureColors[verticesPerRow * splitYBy] = ci[2];
    figureCoords[verticesPerRow * splitYBy + splitXBy] = pi[15];
    figureColors[verticesPerRow * splitYBy + splitXBy] = ci[3];

    mesh.figures[index] = {
      type: 'lattice',
      coords: figureCoords,
      colors: figureColors,
      verticesPerRow: verticesPerRow
    };
  }

  function decodeType6Shading(mesh, reader) {
    // A special case of Type 7. The p11, p12, p21, p22 automatically filled
    var coords = mesh.coords;
    var colors = mesh.colors;
    var ps = new Int32Array(16); // p00, p10, ..., p30, p01, ..., p33
    var cs = new Int32Array(4); // c00, c30, c03, c33
    while (reader.hasData) {
      var f = reader.readFlag();
      assert(0 <= f && f <= 3, 'Unknown type6 flag');
      var i, ii;
      var pi = coords.length;
      for (i = 0, ii = (f !== 0 ? 8 : 12); i < ii; i++) {
        coords.push(reader.readCoordinate());
      }
      var ci = colors.length;
      for (i = 0, ii = (f !== 0 ? 2 : 4); i < ii; i++) {
        colors.push(reader.readComponents());
      }
      var tmp1, tmp2, tmp3, tmp4;
      switch (f) {
        case 0:
          ps[12] = pi + 3; ps[13] = pi + 4;  ps[14] = pi + 5;  ps[15] = pi + 6;
          ps[ 8] = pi + 2; /* values for 5, 6, 9, 10 are    */ ps[11] = pi + 7;
          ps[ 4] = pi + 1; /* calculated below              */ ps[ 7] = pi + 8;
          ps[ 0] = pi;     ps[ 1] = pi + 11; ps[ 2] = pi + 10; ps[ 3] = pi + 9;
          cs[2] = ci + 1; cs[3] = ci + 2;
          cs[0] = ci;     cs[1] = ci + 3;
          break;
        case 1:
          tmp1 = ps[12]; tmp2 = ps[13]; tmp3 = ps[14]; tmp4 = ps[15];
          ps[12] = pi + 5; ps[13] = pi + 4;  ps[14] = pi + 3;  ps[15] = pi + 2;
          ps[ 8] = pi + 6; /* values for 5, 6, 9, 10 are    */ ps[11] = pi + 1;
          ps[ 4] = pi + 7; /* calculated below              */ ps[ 7] = pi;
          ps[ 0] = tmp1;   ps[ 1] = tmp2;    ps[ 2] = tmp3;    ps[ 3] = tmp4;
          tmp1 = cs[2]; tmp2 = cs[3];
          cs[2] = ci + 1; cs[3] = ci;
          cs[0] = tmp1;   cs[1] = tmp2;
          break;
        case 2:
          ps[12] = ps[15]; ps[13] = pi + 7; ps[14] = pi + 6;   ps[15] = pi + 5;
          ps[ 8] = ps[11]; /* values for 5, 6, 9, 10 are    */ ps[11] = pi + 4;
          ps[ 4] = ps[7];  /* calculated below              */ ps[ 7] = pi + 3;
          ps[ 0] = ps[3];  ps[ 1] = pi;     ps[ 2] = pi + 1;   ps[ 3] = pi + 2;
          cs[2] = cs[3]; cs[3] = ci + 1;
          cs[0] = cs[1]; cs[1] = ci;
          break;
        case 3:
          ps[12] = ps[0];  ps[13] = ps[1];   ps[14] = ps[2];   ps[15] = ps[3];
          ps[ 8] = pi;     /* values for 5, 6, 9, 10 are    */ ps[11] = pi + 7;
          ps[ 4] = pi + 1; /* calculated below              */ ps[ 7] = pi + 6;
          ps[ 0] = pi + 2; ps[ 1] = pi + 3;  ps[ 2] = pi + 4;  ps[ 3] = pi + 5;
          cs[2] = cs[0]; cs[3] = cs[1];
          cs[0] = ci;    cs[1] = ci + 1;
          break;
      }
      // set p11, p12, p21, p22
      ps[5] = coords.length;
      coords.push([
        (-4 * coords[ps[0]][0] - coords[ps[15]][0] +
          6 * (coords[ps[4]][0] + coords[ps[1]][0]) -
          2 * (coords[ps[12]][0] + coords[ps[3]][0]) +
          3 * (coords[ps[13]][0] + coords[ps[7]][0])) / 9,
        (-4 * coords[ps[0]][1] - coords[ps[15]][1] +
          6 * (coords[ps[4]][1] + coords[ps[1]][1]) -
          2 * (coords[ps[12]][1] + coords[ps[3]][1]) +
          3 * (coords[ps[13]][1] + coords[ps[7]][1])) / 9
      ]);
      ps[6] = coords.length;
      coords.push([
        (-4 * coords[ps[3]][0] - coords[ps[12]][0] +
          6 * (coords[ps[2]][0] + coords[ps[7]][0]) -
          2 * (coords[ps[0]][0] + coords[ps[15]][0]) +
          3 * (coords[ps[4]][0] + coords[ps[14]][0])) / 9,
        (-4 * coords[ps[3]][1] - coords[ps[12]][1] +
          6 * (coords[ps[2]][1] + coords[ps[7]][1]) -
          2 * (coords[ps[0]][1] + coords[ps[15]][1]) +
          3 * (coords[ps[4]][1] + coords[ps[14]][1])) / 9
      ]);
      ps[9] = coords.length;
      coords.push([
        (-4 * coords[ps[12]][0] - coords[ps[3]][0] +
          6 * (coords[ps[8]][0] + coords[ps[13]][0]) -
          2 * (coords[ps[0]][0] + coords[ps[15]][0]) +
          3 * (coords[ps[11]][0] + coords[ps[1]][0])) / 9,
        (-4 * coords[ps[12]][1] - coords[ps[3]][1] +
          6 * (coords[ps[8]][1] + coords[ps[13]][1]) -
          2 * (coords[ps[0]][1] + coords[ps[15]][1]) +
          3 * (coords[ps[11]][1] + coords[ps[1]][1])) / 9
      ]);
      ps[10] = coords.length;
      coords.push([
        (-4 * coords[ps[15]][0] - coords[ps[0]][0] +
          6 * (coords[ps[11]][0] + coords[ps[14]][0]) -
          2 * (coords[ps[12]][0] + coords[ps[3]][0]) +
          3 * (coords[ps[2]][0] + coords[ps[8]][0])) / 9,
        (-4 * coords[ps[15]][1] - coords[ps[0]][1] +
          6 * (coords[ps[11]][1] + coords[ps[14]][1]) -
          2 * (coords[ps[12]][1] + coords[ps[3]][1]) +
          3 * (coords[ps[2]][1] + coords[ps[8]][1])) / 9
      ]);
      mesh.figures.push({
        type: 'patch',
        coords: new Int32Array(ps), // making copies of ps and cs
        colors: new Int32Array(cs)
      });
    }
  }

  function decodeType7Shading(mesh, reader) {
    var coords = mesh.coords;
    var colors = mesh.colors;
    var ps = new Int32Array(16); // p00, p10, ..., p30, p01, ..., p33
    var cs = new Int32Array(4); // c00, c30, c03, c33
    while (reader.hasData) {
      var f = reader.readFlag();
      assert(0 <= f && f <= 3, 'Unknown type7 flag');
      var i, ii;
      var pi = coords.length;
      for (i = 0, ii = (f !== 0 ? 12 : 16); i < ii; i++) {
        coords.push(reader.readCoordinate());
      }
      var ci = colors.length;
      for (i = 0, ii = (f !== 0 ? 2 : 4); i < ii; i++) {
        colors.push(reader.readComponents());
      }
      var tmp1, tmp2, tmp3, tmp4;
      switch (f) {
        case 0:
          ps[12] = pi + 3; ps[13] = pi + 4;  ps[14] = pi + 5;  ps[15] = pi + 6;
          ps[ 8] = pi + 2; ps[ 9] = pi + 13; ps[10] = pi + 14; ps[11] = pi + 7;
          ps[ 4] = pi + 1; ps[ 5] = pi + 12; ps[ 6] = pi + 15; ps[ 7] = pi + 8;
          ps[ 0] = pi;     ps[ 1] = pi + 11; ps[ 2] = pi + 10; ps[ 3] = pi + 9;
          cs[2] = ci + 1; cs[3] = ci + 2;
          cs[0] = ci;     cs[1] = ci + 3;
          break;
        case 1:
          tmp1 = ps[12]; tmp2 = ps[13]; tmp3 = ps[14]; tmp4 = ps[15];
          ps[12] = pi + 5; ps[13] = pi + 4;  ps[14] = pi + 3;  ps[15] = pi + 2;
          ps[ 8] = pi + 6; ps[ 9] = pi + 11; ps[10] = pi + 10; ps[11] = pi + 1;
          ps[ 4] = pi + 7; ps[ 5] = pi + 8;  ps[ 6] = pi + 9;  ps[ 7] = pi;
          ps[ 0] = tmp1;   ps[ 1] = tmp2;    ps[ 2] = tmp3;    ps[ 3] = tmp4;
          tmp1 = cs[2]; tmp2 = cs[3];
          cs[2] = ci + 1; cs[3] = ci;
          cs[0] = tmp1;   cs[1] = tmp2;
          break;
        case 2:
          ps[12] = ps[15]; ps[13] = pi + 7; ps[14] = pi + 6;  ps[15] = pi + 5;
          ps[ 8] = ps[11]; ps[ 9] = pi + 8; ps[10] = pi + 11; ps[11] = pi + 4;
          ps[ 4] = ps[7];  ps[ 5] = pi + 9; ps[ 6] = pi + 10; ps[ 7] = pi + 3;
          ps[ 0] = ps[3];  ps[ 1] = pi;     ps[ 2] = pi + 1;  ps[ 3] = pi + 2;
          cs[2] = cs[3]; cs[3] = ci + 1;
          cs[0] = cs[1]; cs[1] = ci;
          break;
        case 3:
          ps[12] = ps[0];  ps[13] = ps[1];   ps[14] = ps[2];   ps[15] = ps[3];
          ps[ 8] = pi;     ps[ 9] = pi + 9;  ps[10] = pi + 8;  ps[11] = pi + 7;
          ps[ 4] = pi + 1; ps[ 5] = pi + 10; ps[ 6] = pi + 11; ps[ 7] = pi + 6;
          ps[ 0] = pi + 2; ps[ 1] = pi + 3;  ps[ 2] = pi + 4;  ps[ 3] = pi + 5;
          cs[2] = cs[0]; cs[3] = cs[1];
          cs[0] = ci;    cs[1] = ci + 1;
          break;
      }
      mesh.figures.push({
        type: 'patch',
        coords: new Int32Array(ps), // making copies of ps and cs
        colors: new Int32Array(cs)
      });
    }
  }

  function updateBounds(mesh) {
    var minX = mesh.coords[0][0], minY = mesh.coords[0][1],
      maxX = minX, maxY = minY;
    for (var i = 1, ii = mesh.coords.length; i < ii; i++) {
      var x = mesh.coords[i][0], y = mesh.coords[i][1];
      minX = minX > x ? x : minX;
      minY = minY > y ? y : minY;
      maxX = maxX < x ? x : maxX;
      maxY = maxY < y ? y : maxY;
    }
    mesh.bounds = [minX, minY, maxX, maxY];
  }

  function packData(mesh) {
    var i, ii, j, jj;

    var coords = mesh.coords;
    var coordsPacked = new Float32Array(coords.length * 2);
    for (i = 0, j = 0, ii = coords.length; i < ii; i++) {
      var xy = coords[i];
      coordsPacked[j++] = xy[0];
      coordsPacked[j++] = xy[1];
    }
    mesh.coords = coordsPacked;

    var colors = mesh.colors;
    var colorsPacked = new Uint8Array(colors.length * 3);
    for (i = 0, j = 0, ii = colors.length; i < ii; i++) {
      var c = colors[i];
      colorsPacked[j++] = c[0];
      colorsPacked[j++] = c[1];
      colorsPacked[j++] = c[2];
    }
    mesh.colors = colorsPacked;

    var figures = mesh.figures;
    for (i = 0, ii = figures.length; i < ii; i++) {
      var figure = figures[i], ps = figure.coords, cs = figure.colors;
      for (j = 0, jj = ps.length; j < jj; j++) {
        ps[j] *= 2;
        cs[j] *= 3;
      }
    }
  }

  function Mesh(stream, matrix, xref, res) {
    assert(isStream(stream), 'Mesh data is not a stream');
    var dict = stream.dict;
    this.matrix = matrix;
    this.shadingType = dict.get('ShadingType');
    this.type = 'Pattern';
    this.bbox = dict.get('BBox');
    var cs = dict.get('ColorSpace', 'CS');
    cs = ColorSpace.parse(cs, xref, res);
    this.cs = cs;
    this.background = dict.has('Background') ?
      cs.getRgb(dict.get('Background'), 0) : null;

    var fnObj = dict.get('Function');
    var fn = fnObj ? PDFFunction.parseArray(xref, fnObj) : null;

    this.coords = [];
    this.colors = [];
    this.figures = [];

    var decodeContext = {
      bitsPerCoordinate: dict.get('BitsPerCoordinate'),
      bitsPerComponent: dict.get('BitsPerComponent'),
      bitsPerFlag: dict.get('BitsPerFlag'),
      decode: dict.get('Decode'),
      colorFn: fn,
      colorSpace: cs,
      numComps: fn ? 1 : cs.numComps
    };
    var reader = new MeshStreamReader(stream, decodeContext);

    var patchMesh = false;
    switch (this.shadingType) {
      case PatternType.FREE_FORM_MESH:
        decodeType4Shading(this, reader);
        break;
      case PatternType.LATTICE_FORM_MESH:
        var verticesPerRow = dict.get('VerticesPerRow') | 0;
        assert(verticesPerRow >= 2, 'Invalid VerticesPerRow');
        decodeType5Shading(this, reader, verticesPerRow);
        break;
      case PatternType.COONS_PATCH_MESH:
        decodeType6Shading(this, reader);
        patchMesh = true;
        break;
      case PatternType.TENSOR_PATCH_MESH:
        decodeType7Shading(this, reader);
        patchMesh = true;
        break;
      default:
        error('Unsupported mesh type.');
        break;
    }

    if (patchMesh) {
      // dirty bounds calculation for determining, how dense shall be triangles
      updateBounds(this);
      for (var i = 0, ii = this.figures.length; i < ii; i++) {
        buildFigureFromPatch(this, i);
      }
    }
    // calculate bounds
    updateBounds(this);

    packData(this);
  }

  Mesh.prototype = {
    getIR: function Mesh_getIR() {
      return ['Mesh', this.shadingType, this.coords, this.colors, this.figures,
        this.bounds, this.matrix, this.bbox, this.background];
    }
  };

  return Mesh;
})();

Shadings.Dummy = (function DummyClosure() {
  function Dummy() {
    this.type = 'Pattern';
  }

  Dummy.prototype = {
    getIR: function Dummy_getIR() {
      return ['Dummy'];
    }
  };
  return Dummy;
})();

function getTilingPatternIR(operatorList, dict, args) {
  var matrix = dict.get('Matrix');
  var bbox = dict.get('BBox');
  var xstep = dict.get('XStep');
  var ystep = dict.get('YStep');
  var paintType = dict.get('PaintType');
  var tilingType = dict.get('TilingType');

  return [
    'TilingPattern', args, operatorList, matrix, bbox, xstep, ystep,
    paintType, tilingType
  ];
}


var PartialEvaluator = (function PartialEvaluatorClosure() {
  function PartialEvaluator(pdfManager, xref, handler, pageIndex,
                            uniquePrefix, idCounters, fontCache) {
    this.pdfManager = pdfManager;
    this.xref = xref;
    this.handler = handler;
    this.pageIndex = pageIndex;
    this.uniquePrefix = uniquePrefix;
    this.idCounters = idCounters;
    this.fontCache = fontCache;
  }

  // Trying to minimize Date.now() usage and check every 100 time
  var TIME_SLOT_DURATION_MS = 20;
  var CHECK_TIME_EVERY = 100;
  function TimeSlotManager() {
    this.reset();
  }
  TimeSlotManager.prototype = {
    check: function TimeSlotManager_check() {
      if (++this.checked < CHECK_TIME_EVERY) {
        return false;
      }
      this.checked = 0;
      return this.endTime <= Date.now();
    },
    reset: function TimeSlotManager_reset() {
      this.endTime = Date.now() + TIME_SLOT_DURATION_MS;
      this.checked = 0;
    }
  };

  var deferred = Promise.resolve();

  var TILING_PATTERN = 1, SHADING_PATTERN = 2;

  PartialEvaluator.prototype = {
    hasBlendModes: function PartialEvaluator_hasBlendModes(resources) {
      if (!isDict(resources)) {
        return false;
      }

      var processed = Object.create(null);
      if (resources.objId) {
        processed[resources.objId] = true;
      }

      var nodes = [resources];
      while (nodes.length) {
        var key;
        var node = nodes.shift();
        // First check the current resources for blend modes.
        var graphicStates = node.get('ExtGState');
        if (isDict(graphicStates)) {
          graphicStates = graphicStates.getAll();
          for (key in graphicStates) {
            var graphicState = graphicStates[key];
            var bm = graphicState['BM'];
            if (isName(bm) && bm.name !== 'Normal') {
              return true;
            }
          }
        }
        // Descend into the XObjects to look for more resources and blend modes.
        var xObjects = node.get('XObject');
        if (!isDict(xObjects)) {
          continue;
        }
        xObjects = xObjects.getAll();
        for (key in xObjects) {
          var xObject = xObjects[key];
          if (!isStream(xObject)) {
            continue;
          }
          if (xObject.dict.objId) {
            if (processed[xObject.dict.objId]) {
              // stream has objId and is processed already
              continue;
            }
            processed[xObject.dict.objId] = true;
          }
          var xResources = xObject.dict.get('Resources');
          // Checking objId to detect an infinite loop.
          if (isDict(xResources) &&
              (!xResources.objId || !processed[xResources.objId])) {
            nodes.push(xResources);
            if (xResources.objId) {
              processed[xResources.objId] = true;
            }
          }
        }
      }
      return false;
    },

    buildFormXObject: function PartialEvaluator_buildFormXObject(resources,
                                                                 xobj, smask,
                                                                 operatorList,
                                                                 initialState) {
      var matrix = xobj.dict.get('Matrix');
      var bbox = xobj.dict.get('BBox');
      var group = xobj.dict.get('Group');
      if (group) {
        var groupOptions = {
          matrix: matrix,
          bbox: bbox,
          smask: smask,
          isolated: false,
          knockout: false
        };

        var groupSubtype = group.get('S');
        var colorSpace;
        if (isName(groupSubtype) && groupSubtype.name === 'Transparency') {
          groupOptions.isolated = (group.get('I') || false);
          groupOptions.knockout = (group.get('K') || false);
          colorSpace = (group.has('CS') ?
            ColorSpace.parse(group.get('CS'), this.xref, resources) : null);
        }

        if (smask && smask.backdrop) {
          colorSpace = colorSpace || ColorSpace.singletons.rgb;
          smask.backdrop = colorSpace.getRgb(smask.backdrop, 0);
        }

        operatorList.addOp(OPS.beginGroup, [groupOptions]);
      }

      operatorList.addOp(OPS.paintFormXObjectBegin, [matrix, bbox]);

      return this.getOperatorList(xobj,
        (xobj.dict.get('Resources') || resources), operatorList, initialState).
        then(function () {
          operatorList.addOp(OPS.paintFormXObjectEnd, []);

          if (group) {
            operatorList.addOp(OPS.endGroup, [groupOptions]);
          }
        });
    },

    buildPaintImageXObject:
        function PartialEvaluator_buildPaintImageXObject(resources, image,
                                                         inline, operatorList,
                                                         cacheKey, imageCache) {
      var self = this;
      var dict = image.dict;
      var w = dict.get('Width', 'W');
      var h = dict.get('Height', 'H');

      if (!(w && isNum(w)) || !(h && isNum(h))) {
        warn('Image dimensions are missing, or not numbers.');
        return;
      }
      if (PDFJS.maxImageSize !== -1 && w * h > PDFJS.maxImageSize) {
        warn('Image exceeded maximum allowed size and was removed.');
        return;
      }

      var imageMask = (dict.get('ImageMask', 'IM') || false);
      var imgData, args;
      if (imageMask) {
        // This depends on a tmpCanvas being filled with the
        // current fillStyle, such that processing the pixel
        // data can't be done here. Instead of creating a
        // complete PDFImage, only read the information needed
        // for later.

        var width = dict.get('Width', 'W');
        var height = dict.get('Height', 'H');
        var bitStrideLength = (width + 7) >> 3;
        var imgArray = image.getBytes(bitStrideLength * height);
        var decode = dict.get('Decode', 'D');
        var inverseDecode = (!!decode && decode[0] > 0);

        imgData = PDFImage.createMask(imgArray, width, height,
                                      image instanceof DecodeStream,
                                      inverseDecode);
        imgData.cached = true;
        args = [imgData];
        operatorList.addOp(OPS.paintImageMaskXObject, args);
        if (cacheKey) {
          imageCache[cacheKey] = {
            fn: OPS.paintImageMaskXObject,
            args: args
          };
        }
        return;
      }

      var softMask = (dict.get('SMask', 'SM') || false);
      var mask = (dict.get('Mask') || false);

      var SMALL_IMAGE_DIMENSIONS = 200;
      // Inlining small images into the queue as RGB data
      if (inline && !softMask && !mask && !(image instanceof JpegStream) &&
          (w + h) < SMALL_IMAGE_DIMENSIONS) {
        var imageObj = new PDFImage(this.xref, resources, image,
                                    inline, null, null);
        // We force the use of RGBA_32BPP images here, because we can't handle
        // any other kind.
        imgData = imageObj.createImageData(/* forceRGBA = */ true);
        operatorList.addOp(OPS.paintInlineImageXObject, [imgData]);
        return;
      }

      // If there is no imageMask, create the PDFImage and a lot
      // of image processing can be done here.
      var uniquePrefix = (this.uniquePrefix || '');
      var objId = 'img_' + uniquePrefix + (++this.idCounters.obj);
      operatorList.addDependency(objId);
      args = [objId, w, h];

      if (!softMask && !mask && image instanceof JpegStream &&
          image.isNativelySupported(this.xref, resources)) {
        // These JPEGs don't need any more processing so we can just send it.
        operatorList.addOp(OPS.paintJpegXObject, args);
        this.handler.send('obj',
          [objId, this.pageIndex, 'JpegStream', image.getIR()]);
        return;
      }

      PDFImage.buildImage(self.handler, self.xref, resources, image, inline).
        then(function(imageObj) {
          var imgData = imageObj.createImageData(/* forceRGBA = */ false);
          self.handler.send('obj', [objId, self.pageIndex, 'Image', imgData],
            [imgData.data.buffer]);
        }).then(undefined, function (reason) {
          warn('Unable to decode image: ' + reason);
          self.handler.send('obj', [objId, self.pageIndex, 'Image', null]);
        });

      operatorList.addOp(OPS.paintImageXObject, args);
      if (cacheKey) {
        imageCache[cacheKey] = {
          fn: OPS.paintImageXObject,
          args: args
        };
      }
    },

    handleSMask: function PartialEvaluator_handleSmask(smask, resources,
                                                       operatorList,
                                                       stateManager) {
      var smaskContent = smask.get('G');
      var smaskOptions = {
        subtype: smask.get('S').name,
        backdrop: smask.get('BC')
      };
      return this.buildFormXObject(resources, smaskContent, smaskOptions,
                            operatorList, stateManager.state.clone());
    },

    handleTilingType:
        function PartialEvaluator_handleTilingType(fn, args, resources,
                                                   pattern, patternDict,
                                                   operatorList) {
      // Create an IR of the pattern code.
      var tilingOpList = new OperatorList();
      return this.getOperatorList(pattern,
        (patternDict.get('Resources') || resources), tilingOpList).
        then(function () {
          // Add the dependencies to the parent operator list so they are
          // resolved before sub operator list is executed synchronously.
          operatorList.addDependencies(tilingOpList.dependencies);
          operatorList.addOp(fn, getTilingPatternIR({
            fnArray: tilingOpList.fnArray,
            argsArray: tilingOpList.argsArray
          }, patternDict, args));
        });
    },

    handleSetFont:
        function PartialEvaluator_handleSetFont(resources, fontArgs, fontRef,
                                                operatorList, state) {
      // TODO(mack): Not needed?
      var fontName;
      if (fontArgs) {
        fontArgs = fontArgs.slice();
        fontName = fontArgs[0].name;
      }

      var self = this;
      return this.loadFont(fontName, fontRef, this.xref, resources).then(
          function (translated) {
        if (!translated.font.isType3Font) {
          return translated;
        }
        return translated.loadType3Data(self, resources, operatorList).then(
            function () {
          return translated;
        });
      }).then(function (translated) {
        state.font = translated.font;
        translated.send(self.handler);
        return translated.loadedName;
      });
    },

    handleText: function PartialEvaluator_handleText(chars, state) {
      var font = state.font;
      var glyphs = font.charsToGlyphs(chars);
      var isAddToPathSet = !!(state.textRenderingMode &
                              TextRenderingMode.ADD_TO_PATH_FLAG);
      if (font.data && (isAddToPathSet || PDFJS.disableFontFace)) {
        var buildPath = function (fontChar) {
          if (!font.renderer.hasBuiltPath(fontChar)) {
            var path = font.renderer.getPathJs(fontChar);
            this.handler.send('commonobj', [
              font.loadedName + '_path_' + fontChar,
              'FontPath',
              path
            ]);
          }
        }.bind(this);

        for (var i = 0, ii = glyphs.length; i < ii; i++) {
          var glyph = glyphs[i];
          if (glyph === null) {
            continue;
          }
          buildPath(glyph.fontChar);

          // If the glyph has an accent we need to build a path for its
          // fontChar too, otherwise CanvasGraphics_paintChar will fail.
          var accent = glyph.accent;
          if (accent && accent.fontChar) {
            buildPath(accent.fontChar);
          }
        }
      }

      return glyphs;
    },

    setGState: function PartialEvaluator_setGState(resources, gState,
                                                   operatorList, xref,
                                                   stateManager) {
      // This array holds the converted/processed state data.
      var gStateObj = [];
      var gStateMap = gState.map;
      var self = this;
      var promise = Promise.resolve();
      for (var key in gStateMap) {
        var value = gStateMap[key];
        switch (key) {
          case 'Type':
            break;
          case 'LW':
          case 'LC':
          case 'LJ':
          case 'ML':
          case 'D':
          case 'RI':
          case 'FL':
          case 'CA':
          case 'ca':
            gStateObj.push([key, value]);
            break;
          case 'Font':
            promise = promise.then(function () {
              return self.handleSetFont(resources, null, value[0],
                                        operatorList, stateManager.state).
                then(function (loadedName) {
                  operatorList.addDependency(loadedName);
                  gStateObj.push([key, [loadedName, value[1]]]);
                });
            });
            break;
          case 'BM':
            gStateObj.push([key, value]);
            break;
          case 'SMask':
            if (isName(value) && value.name === 'None') {
              gStateObj.push([key, false]);
              break;
            }
            var dict = xref.fetchIfRef(value);
            if (isDict(dict)) {
              promise = promise.then(function () {
                return self.handleSMask(dict, resources, operatorList,
                                        stateManager);
              });
              gStateObj.push([key, true]);
            } else {
              warn('Unsupported SMask type');
            }

            break;
          // Only generate info log messages for the following since
          // they are unlikely to have a big impact on the rendering.
          case 'OP':
          case 'op':
          case 'OPM':
          case 'BG':
          case 'BG2':
          case 'UCR':
          case 'UCR2':
          case 'TR':
          case 'TR2':
          case 'HT':
          case 'SM':
          case 'SA':
          case 'AIS':
          case 'TK':
            // TODO implement these operators.
            info('graphic state operator ' + key);
            break;
          default:
            info('Unknown graphic state operator ' + key);
            break;
        }
      }
      return promise.then(function () {
        if (gStateObj.length >= 0) {
          operatorList.addOp(OPS.setGState, [gStateObj]);
        }
      });
    },

    loadFont: function PartialEvaluator_loadFont(fontName, font, xref,
                                                 resources) {

      function errorFont() {
        return Promise.resolve(new TranslatedFont('g_font_error',
          new ErrorFont('Font ' + fontName + ' is not available'), font));
      }
      var fontRef;
      if (font) { // Loading by ref.
        assert(isRef(font));
        fontRef = font;
      } else { // Loading by name.
        var fontRes = resources.get('Font');
        if (fontRes) {
          fontRef = fontRes.getRaw(fontName);
        } else {
          warn('fontRes not available');
          return errorFont();
        }
      }
      if (!fontRef) {
        warn('fontRef not available');
        return errorFont();
      }

      if (this.fontCache.has(fontRef)) {
        return this.fontCache.get(fontRef);
      }

      font = xref.fetchIfRef(fontRef);
      if (!isDict(font)) {
        return errorFont();
      }

      // We are holding font.translated references just for fontRef that are not
      // dictionaries (Dict). See explanation below.
      if (font.translated) {
        return font.translated;
      }

      var fontCapability = createPromiseCapability();

      var preEvaluatedFont = this.preEvaluateFont(font, xref);
      var descriptor = preEvaluatedFont.descriptor;
      var fontID = fontRef.num + '_' + fontRef.gen;
      if (isDict(descriptor)) {
        if (!descriptor.fontAliases) {
          descriptor.fontAliases = Object.create(null);
        }

        var fontAliases = descriptor.fontAliases;
        var hash = preEvaluatedFont.hash;
        if (fontAliases[hash]) {
          var aliasFontRef = fontAliases[hash].aliasRef;
          if (aliasFontRef && this.fontCache.has(aliasFontRef)) {
            this.fontCache.putAlias(fontRef, aliasFontRef);
            return this.fontCache.get(fontRef);
          }
        }

        if (!fontAliases[hash]) {
          fontAliases[hash] = {
            fontID: Font.getFontID()
          };
        }

        fontAliases[hash].aliasRef = fontRef;
        fontID = fontAliases[hash].fontID;
      }

      // Workaround for bad PDF generators that don't reference fonts
      // properly, i.e. by not using an object identifier.
      // Check if the fontRef is a Dict (as opposed to a standard object),
      // in which case we don't cache the font and instead reference it by
      // fontName in font.loadedName below.
      var fontRefIsDict = isDict(fontRef);
      if (!fontRefIsDict) {
        this.fontCache.put(fontRef, fontCapability.promise);
      }

      // Keep track of each font we translated so the caller can
      // load them asynchronously before calling display on a page.
      font.loadedName = 'g_font_' + (fontRefIsDict ?
        fontName.replace(/\W/g, '') : fontID);

      font.translated = fontCapability.promise;

      // TODO move promises into translate font
      var translatedPromise;
      try {
        translatedPromise = Promise.resolve(
          this.translateFont(preEvaluatedFont, xref));
      } catch (e) {
        translatedPromise = Promise.reject(e);
      }

      translatedPromise.then(function (translatedFont) {
        if (translatedFont.fontType !== undefined) {
          var xrefFontStats = xref.stats.fontTypes;
          xrefFontStats[translatedFont.fontType] = true;
        }

        fontCapability.resolve(new TranslatedFont(font.loadedName,
          translatedFont, font));
      }, function (reason) {
        // TODO fontCapability.reject?
        UnsupportedManager.notify(UNSUPPORTED_FEATURES.font);

        try {
          // error, but it's still nice to have font type reported
          var descriptor = preEvaluatedFont.descriptor;
          var fontFile3 = descriptor && descriptor.get('FontFile3');
          var subtype = fontFile3 && fontFile3.get('Subtype');
          var fontType = getFontType(preEvaluatedFont.type,
                                     subtype && subtype.name);
          var xrefFontStats = xref.stats.fontTypes;
          xrefFontStats[fontType] = true;
        } catch (ex) { }

        fontCapability.resolve(new TranslatedFont(font.loadedName,
          new ErrorFont(reason instanceof Error ? reason.message : reason),
          font));
      });
      return fontCapability.promise;
    },

    buildPath: function PartialEvaluator_buildPath(operatorList, fn, args) {
      var lastIndex = operatorList.length - 1;
      if (!args) {
        args = [];
      }
      if (lastIndex < 0 ||
          operatorList.fnArray[lastIndex] !== OPS.constructPath) {
        operatorList.addOp(OPS.constructPath, [[fn], args]);
      } else {
        var opArgs = operatorList.argsArray[lastIndex];
        opArgs[0].push(fn);
        Array.prototype.push.apply(opArgs[1], args);
      }
    },

    handleColorN: function PartialEvaluator_handleColorN(operatorList, fn, args,
          cs, patterns, resources, xref) {
      // compile tiling patterns
      var patternName = args[args.length - 1];
      // SCN/scn applies patterns along with normal colors
      var pattern;
      if (isName(patternName) &&
          (pattern = patterns.get(patternName.name))) {
        var dict = (isStream(pattern) ? pattern.dict : pattern);
        var typeNum = dict.get('PatternType');

        if (typeNum === TILING_PATTERN) {
          var color = cs.base ? cs.base.getRgb(args, 0) : null;
          return this.handleTilingType(fn, color, resources, pattern,
                                       dict, operatorList);
        } else if (typeNum === SHADING_PATTERN) {
          var shading = dict.get('Shading');
          var matrix = dict.get('Matrix');
          pattern = Pattern.parseShading(shading, matrix, xref, resources);
          operatorList.addOp(fn, pattern.getIR());
          return Promise.resolve();
        } else {
          return Promise.reject('Unknown PatternType: ' + typeNum);
        }
      }
      // TODO shall we fail here?
      operatorList.addOp(fn, args);
      return Promise.resolve();
    },

    getOperatorList: function PartialEvaluator_getOperatorList(stream,
                                                               resources,
                                                               operatorList,
                                                               initialState) {

      var self = this;
      var xref = this.xref;
      var imageCache = {};

      assert(operatorList);

      resources = (resources || Dict.empty);
      var xobjs = (resources.get('XObject') || Dict.empty);
      var patterns = (resources.get('Pattern') || Dict.empty);
      var stateManager = new StateManager(initialState || new EvalState());
      var preprocessor = new EvaluatorPreprocessor(stream, xref, stateManager);
      var timeSlotManager = new TimeSlotManager();

      return new Promise(function next(resolve, reject) {
        timeSlotManager.reset();
        var stop, operation = {}, i, ii, cs;
        while (!(stop = timeSlotManager.check())) {
          // The arguments parsed by read() are used beyond this loop, so we
          // cannot reuse the same array on each iteration. Therefore we pass
          // in |null| as the initial value (see the comment on
          // EvaluatorPreprocessor_read() for why).
          operation.args = null;
          if (!(preprocessor.read(operation))) {
            break;
          }
          var args = operation.args;
          var fn = operation.fn;

          switch (fn | 0) {
            case OPS.paintXObject:
              if (args[0].code) {
                break;
              }
              // eagerly compile XForm objects
              var name = args[0].name;
              if (imageCache[name] !== undefined) {
                operatorList.addOp(imageCache[name].fn, imageCache[name].args);
                args = null;
                continue;
              }

              var xobj = xobjs.get(name);
              if (xobj) {
                assert(isStream(xobj), 'XObject should be a stream');

                var type = xobj.dict.get('Subtype');
                assert(isName(type),
                  'XObject should have a Name subtype');

                if (type.name === 'Form') {
                  stateManager.save();
                  return self.buildFormXObject(resources, xobj, null,
                                               operatorList,
                                               stateManager.state.clone()).
                    then(function () {
                      stateManager.restore();
                      next(resolve, reject);
                    }, reject);
                } else if (type.name === 'Image') {
                  self.buildPaintImageXObject(resources, xobj, false,
                    operatorList, name, imageCache);
                  args = null;
                  continue;
                } else if (type.name === 'PS') {
                  // PostScript XObjects are unused when viewing documents.
                  // See section 4.7.1 of Adobe's PDF reference.
                  info('Ignored XObject subtype PS');
                  continue;
                } else {
                  error('Unhandled XObject subtype ' + type.name);
                }
              }
              break;
            case OPS.setFont:
              var fontSize = args[1];
              // eagerly collect all fonts
              return self.handleSetFont(resources, args, null,
                                        operatorList, stateManager.state).
                then(function (loadedName) {
                  operatorList.addDependency(loadedName);
                  operatorList.addOp(OPS.setFont, [loadedName, fontSize]);
                  next(resolve, reject);
                }, reject);
            case OPS.endInlineImage:
              var cacheKey = args[0].cacheKey;
              if (cacheKey) {
                var cacheEntry = imageCache[cacheKey];
                if (cacheEntry !== undefined) {
                  operatorList.addOp(cacheEntry.fn, cacheEntry.args);
                  args = null;
                  continue;
                }
              }
              self.buildPaintImageXObject(resources, args[0], true,
                operatorList, cacheKey, imageCache);
              args = null;
              continue;
            case OPS.showText:
              args[0] = self.handleText(args[0], stateManager.state);
              break;
            case OPS.showSpacedText:
              var arr = args[0];
              var combinedGlyphs = [];
              var arrLength = arr.length;
              for (i = 0; i < arrLength; ++i) {
                var arrItem = arr[i];
                if (isString(arrItem)) {
                  Array.prototype.push.apply(combinedGlyphs,
                    self.handleText(arrItem, stateManager.state));
                } else if (isNum(arrItem)) {
                  combinedGlyphs.push(arrItem);
                }
              }
              args[0] = combinedGlyphs;
              fn = OPS.showText;
              break;
            case OPS.nextLineShowText:
              operatorList.addOp(OPS.nextLine);
              args[0] = self.handleText(args[0], stateManager.state);
              fn = OPS.showText;
              break;
            case OPS.nextLineSetSpacingShowText:
              operatorList.addOp(OPS.nextLine);
              operatorList.addOp(OPS.setWordSpacing, [args.shift()]);
              operatorList.addOp(OPS.setCharSpacing, [args.shift()]);
              args[0] = self.handleText(args[0], stateManager.state);
              fn = OPS.showText;
              break;
            case OPS.setTextRenderingMode:
              stateManager.state.textRenderingMode = args[0];
              break;

            case OPS.setFillColorSpace:
              stateManager.state.fillColorSpace =
                ColorSpace.parse(args[0], xref, resources);
              continue;
            case OPS.setStrokeColorSpace:
              stateManager.state.strokeColorSpace =
                ColorSpace.parse(args[0], xref, resources);
              continue;
            case OPS.setFillColor:
              cs = stateManager.state.fillColorSpace;
              args = cs.getRgb(args, 0);
              fn = OPS.setFillRGBColor;
              break;
            case OPS.setStrokeColor:
              cs = stateManager.state.strokeColorSpace;
              args = cs.getRgb(args, 0);
              fn = OPS.setStrokeRGBColor;
              break;
            case OPS.setFillGray:
              stateManager.state.fillColorSpace = ColorSpace.singletons.gray;
              args = ColorSpace.singletons.gray.getRgb(args, 0);
              fn = OPS.setFillRGBColor;
              break;
            case OPS.setStrokeGray:
              stateManager.state.strokeColorSpace = ColorSpace.singletons.gray;
              args = ColorSpace.singletons.gray.getRgb(args, 0);
              fn = OPS.setStrokeRGBColor;
              break;
            case OPS.setFillCMYKColor:
              stateManager.state.fillColorSpace = ColorSpace.singletons.cmyk;
              args = ColorSpace.singletons.cmyk.getRgb(args, 0);
              fn = OPS.setFillRGBColor;
              break;
            case OPS.setStrokeCMYKColor:
              stateManager.state.strokeColorSpace = ColorSpace.singletons.cmyk;
              args = ColorSpace.singletons.cmyk.getRgb(args, 0);
              fn = OPS.setStrokeRGBColor;
              break;
            case OPS.setFillRGBColor:
              stateManager.state.fillColorSpace = ColorSpace.singletons.rgb;
              args = ColorSpace.singletons.rgb.getRgb(args, 0);
              break;
            case OPS.setStrokeRGBColor:
              stateManager.state.strokeColorSpace = ColorSpace.singletons.rgb;
              args = ColorSpace.singletons.rgb.getRgb(args, 0);
              break;
            case OPS.setFillColorN:
              cs = stateManager.state.fillColorSpace;
              if (cs.name === 'Pattern') {
                return self.handleColorN(operatorList, OPS.setFillColorN,
                  args, cs, patterns, resources, xref).then(function() {
                    next(resolve, reject);
                  }, reject);
              }
              args = cs.getRgb(args, 0);
              fn = OPS.setFillRGBColor;
              break;
            case OPS.setStrokeColorN:
              cs = stateManager.state.strokeColorSpace;
              if (cs.name === 'Pattern') {
                return self.handleColorN(operatorList, OPS.setStrokeColorN,
                  args, cs, patterns, resources, xref).then(function() {
                    next(resolve, reject);
                  }, reject);
              }
              args = cs.getRgb(args, 0);
              fn = OPS.setStrokeRGBColor;
              break;

            case OPS.shadingFill:
              var shadingRes = resources.get('Shading');
              if (!shadingRes) {
                error('No shading resource found');
              }

              var shading = shadingRes.get(args[0].name);
              if (!shading) {
                error('No shading object found');
              }

              var shadingFill = Pattern.parseShading(shading, null, xref,
                resources);
              var patternIR = shadingFill.getIR();
              args = [patternIR];
              fn = OPS.shadingFill;
              break;
            case OPS.setGState:
              var dictName = args[0];
              var extGState = resources.get('ExtGState');

              if (!isDict(extGState) || !extGState.has(dictName.name)) {
                break;
              }

              var gState = extGState.get(dictName.name);
              return self.setGState(resources, gState, operatorList, xref,
                stateManager).then(function() {
                  next(resolve, reject);
                }, reject);
            case OPS.moveTo:
            case OPS.lineTo:
            case OPS.curveTo:
            case OPS.curveTo2:
            case OPS.curveTo3:
            case OPS.closePath:
              self.buildPath(operatorList, fn, args);
              continue;
            case OPS.rectangle:
              self.buildPath(operatorList, fn, args);
              continue;
          }
          operatorList.addOp(fn, args);
        }
        if (stop) {
          deferred.then(function () {
            next(resolve, reject);
          });
          return;
        }
        // Some PDFs don't close all restores inside object/form.
        // Closing those for them.
        for (i = 0, ii = preprocessor.savedStatesDepth; i < ii; i++) {
          operatorList.addOp(OPS.restore, []);
        }
        resolve();
      });
    },

    getTextContent: function PartialEvaluator_getTextContent(stream, resources,
                                                             stateManager) {

      stateManager = (stateManager || new StateManager(new TextState()));

      var textContent = {
        items: [],
        styles: Object.create(null)
      };
      var bidiTexts = textContent.items;
      var SPACE_FACTOR = 0.3;
      var MULTI_SPACE_FACTOR = 1.5;

      var self = this;
      var xref = this.xref;

      resources = (xref.fetchIfRef(resources) || Dict.empty);

      // The xobj is parsed iff it's needed, e.g. if there is a `DO` cmd.
      var xobjs = null;
      var xobjsCache = {};

      var preprocessor = new EvaluatorPreprocessor(stream, xref, stateManager);

      var textState;

      function newTextChunk() {
        var font = textState.font;
        if (!(font.loadedName in textContent.styles)) {
          textContent.styles[font.loadedName] = {
            fontFamily: font.fallbackName,
            ascent: font.ascent,
            descent: font.descent,
            vertical: font.vertical
          };
        }
        return {
          // |str| is initially an array which we push individual chars to, and
          // then runBidi() overwrites it with the final string.
          str: [],
          dir: null,
          width: 0,
          height: 0,
          transform: null,
          fontName: font.loadedName
        };
      }

      function runBidi(textChunk) {
        var str = textChunk.str.join('');
        var bidiResult = PDFJS.bidi(str, -1, textState.font.vertical);
        textChunk.str = bidiResult.str;
        textChunk.dir = bidiResult.dir;
        return textChunk;
      }

      function handleSetFont(fontName, fontRef) {
        return self.loadFont(fontName, fontRef, xref, resources).
          then(function (translated) {
            textState.font = translated.font;
            textState.fontMatrix = translated.font.fontMatrix ||
              FONT_IDENTITY_MATRIX;
          });
      }

      function buildTextGeometry(chars, textChunk) {
        var font = textState.font;
        textChunk = textChunk || newTextChunk();
        if (!textChunk.transform) {
          // 9.4.4 Text Space Details
          var tsm = [textState.fontSize * textState.textHScale, 0,
                     0, textState.fontSize,
                     0, textState.textRise];
          var trm = textChunk.transform = Util.transform(textState.ctm,
                                    Util.transform(textState.textMatrix, tsm));
          if (!font.vertical) {
            textChunk.height = Math.sqrt(trm[2] * trm[2] + trm[3] * trm[3]);
          } else {
            textChunk.width = Math.sqrt(trm[0] * trm[0] + trm[1] * trm[1]);
          }
        }
        var width = 0;
        var height = 0;
        var glyphs = font.charsToGlyphs(chars);
        var defaultVMetrics = font.defaultVMetrics;
        for (var i = 0; i < glyphs.length; i++) {
          var glyph = glyphs[i];
          if (!glyph) { // Previous glyph was a space.
            width += textState.wordSpacing * textState.textHScale;
            continue;
          }
          var vMetricX = null;
          var vMetricY = null;
          var glyphWidth = null;
          if (font.vertical) {
            if (glyph.vmetric) {
              glyphWidth = glyph.vmetric[0];
              vMetricX = glyph.vmetric[1];
              vMetricY = glyph.vmetric[2];
            } else {
              glyphWidth = glyph.width;
              vMetricX = glyph.width * 0.5;
              vMetricY = defaultVMetrics[2];
            }
          } else {
            glyphWidth = glyph.width;
          }

          var glyphUnicode = glyph.unicode;
          if (NormalizedUnicodes[glyphUnicode] !== undefined) {
            glyphUnicode = NormalizedUnicodes[glyphUnicode];
          }
          glyphUnicode = reverseIfRtl(glyphUnicode);

          // The following will calculate the x and y of the individual glyphs.
          // if (font.vertical) {
          //   tsm[4] -= vMetricX * Math.abs(textState.fontSize) *
          //             textState.fontMatrix[0];
          //   tsm[5] -= vMetricY * textState.fontSize *
          //             textState.fontMatrix[0];
          // }
          // var trm = Util.transform(textState.textMatrix, tsm);
          // var pt = Util.applyTransform([trm[4], trm[5]], textState.ctm);
          // var x = pt[0];
          // var y = pt[1];

          var tx = 0;
          var ty = 0;
          if (!font.vertical) {
            var w0 = glyphWidth * textState.fontMatrix[0];
            tx = (w0 * textState.fontSize + textState.charSpacing) *
                 textState.textHScale;
            width += tx;
          } else {
            var w1 = glyphWidth * textState.fontMatrix[0];
            ty = w1 * textState.fontSize + textState.charSpacing;
            height += ty;
          }
          textState.translateTextMatrix(tx, ty);

          textChunk.str.push(glyphUnicode);
        }

        var a = textState.textLineMatrix[0];
        var b = textState.textLineMatrix[1];
        var scaleLineX = Math.sqrt(a * a + b * b);
        a = textState.ctm[0];
        b = textState.ctm[1];
        var scaleCtmX = Math.sqrt(a * a + b * b);
        if (!font.vertical) {
          textChunk.width += width * scaleCtmX * scaleLineX;
        } else {
          textChunk.height += Math.abs(height * scaleCtmX * scaleLineX);
        }
        return textChunk;
      }

      var timeSlotManager = new TimeSlotManager();

      return new Promise(function next(resolve, reject) {
        timeSlotManager.reset();
        var stop, operation = {}, args = [];
        while (!(stop = timeSlotManager.check())) {
          // The arguments parsed by read() are not used beyond this loop, so
          // we can reuse the same array on every iteration, thus avoiding
          // unnecessary allocations.
          args.length = 0;
          operation.args = args;
          if (!(preprocessor.read(operation))) {
            break;
          }
          textState = stateManager.state;
          var fn = operation.fn;
          args = operation.args;

          switch (fn | 0) {
            case OPS.setFont:
              textState.fontSize = args[1];
              return handleSetFont(args[0].name).then(function() {
                next(resolve, reject);
              }, reject);
            case OPS.setTextRise:
              textState.textRise = args[0];
              break;
            case OPS.setHScale:
              textState.textHScale = args[0] / 100;
              break;
            case OPS.setLeading:
              textState.leading = args[0];
              break;
            case OPS.moveText:
              textState.translateTextLineMatrix(args[0], args[1]);
              textState.textMatrix = textState.textLineMatrix.slice();
              break;
            case OPS.setLeadingMoveText:
              textState.leading = -args[1];
              textState.translateTextLineMatrix(args[0], args[1]);
              textState.textMatrix = textState.textLineMatrix.slice();
              break;
            case OPS.nextLine:
              textState.carriageReturn();
              break;
            case OPS.setTextMatrix:
              textState.setTextMatrix(args[0], args[1], args[2], args[3],
                args[4], args[5]);
              textState.setTextLineMatrix(args[0], args[1], args[2], args[3],
                args[4], args[5]);
              break;
            case OPS.setCharSpacing:
              textState.charSpacing = args[0];
              break;
            case OPS.setWordSpacing:
              textState.wordSpacing = args[0];
              break;
            case OPS.beginText:
              textState.textMatrix = IDENTITY_MATRIX.slice();
              textState.textLineMatrix = IDENTITY_MATRIX.slice();
              break;
            case OPS.showSpacedText:
              var items = args[0];
              var textChunk = newTextChunk();
              var offset;
              for (var j = 0, jj = items.length; j < jj; j++) {
                if (typeof items[j] === 'string') {
                  buildTextGeometry(items[j], textChunk);
                } else {
                  var val = items[j] / 1000;
                  if (!textState.font.vertical) {
                    offset = -val * textState.fontSize * textState.textHScale *
                      textState.textMatrix[0];
                    textState.translateTextMatrix(offset, 0);
                    textChunk.width += offset;
                  } else {
                    offset = -val * textState.fontSize *
                      textState.textMatrix[3];
                    textState.translateTextMatrix(0, offset);
                    textChunk.height += offset;
                  }
                  if (items[j] < 0 && textState.font.spaceWidth > 0) {
                    var fakeSpaces = -items[j] / textState.font.spaceWidth;
                    if (fakeSpaces > MULTI_SPACE_FACTOR) {
                      fakeSpaces = Math.round(fakeSpaces);
                      while (fakeSpaces--) {
                        textChunk.str.push(' ');
                      }
                    } else if (fakeSpaces > SPACE_FACTOR) {
                      textChunk.str.push(' ');
                    }
                  }
                }
              }
              bidiTexts.push(runBidi(textChunk));
              break;
            case OPS.showText:
              bidiTexts.push(runBidi(buildTextGeometry(args[0])));
              break;
            case OPS.nextLineShowText:
              textState.carriageReturn();
              bidiTexts.push(runBidi(buildTextGeometry(args[0])));
              break;
            case OPS.nextLineSetSpacingShowText:
              textState.wordSpacing = args[0];
              textState.charSpacing = args[1];
              textState.carriageReturn();
              bidiTexts.push(runBidi(buildTextGeometry(args[2])));
              break;
            case OPS.paintXObject:
              if (args[0].code) {
                break;
              }

              if (!xobjs) {
                xobjs = (resources.get('XObject') || Dict.empty);
              }

              var name = args[0].name;
              if (xobjsCache.key === name) {
                if (xobjsCache.texts) {
                  Util.appendToArray(bidiTexts, xobjsCache.texts.items);
                  Util.extendObj(textContent.styles, xobjsCache.texts.styles);
                }
                break;
              }

              var xobj = xobjs.get(name);
              if (!xobj) {
                break;
              }
              assert(isStream(xobj), 'XObject should be a stream');

              var type = xobj.dict.get('Subtype');
              assert(isName(type),
                'XObject should have a Name subtype');

              if ('Form' !== type.name) {
                xobjsCache.key = name;
                xobjsCache.texts = null;
                break;
              }

              stateManager.save();
              var matrix = xobj.dict.get('Matrix');
              if (isArray(matrix) && matrix.length === 6) {
                stateManager.transform(matrix);
              }

              return self.getTextContent(xobj,
                xobj.dict.get('Resources') || resources, stateManager).
                then(function (formTextContent) {
                  Util.appendToArray(bidiTexts, formTextContent.items);
                  Util.extendObj(textContent.styles, formTextContent.styles);
                  stateManager.restore();

                  xobjsCache.key = name;
                  xobjsCache.texts = formTextContent;

                  next(resolve, reject);
                }, reject);
            case OPS.setGState:
              var dictName = args[0];
              var extGState = resources.get('ExtGState');

              if (!isDict(extGState) || !extGState.has(dictName.name)) {
                break;
              }

              var gsStateMap = extGState.get(dictName.name);
              var gsStateFont = null;
              for (var key in gsStateMap) {
                if (key === 'Font') {
                  assert(!gsStateFont);
                  gsStateFont = gsStateMap[key];
                }
              }
              if (gsStateFont) {
                textState.fontSize = gsStateFont[1];
                return handleSetFont(gsStateFont[0]).then(function() {
                  next(resolve, reject);
                }, reject);
              }
              break;
          } // switch
        } // while
        if (stop) {
          deferred.then(function () {
            next(resolve, reject);
          });
          return;
        }
        resolve(textContent);
      });
    },

    extractDataStructures: function
      partialEvaluatorExtractDataStructures(dict, baseDict,
                                            xref, properties) {
      // 9.10.2
      var toUnicode = (dict.get('ToUnicode') || baseDict.get('ToUnicode'));
      if (toUnicode) {
        properties.toUnicode = this.readToUnicode(toUnicode);
      }
      if (properties.composite) {
        // CIDSystemInfo helps to match CID to glyphs
        var cidSystemInfo = dict.get('CIDSystemInfo');
        if (isDict(cidSystemInfo)) {
          properties.cidSystemInfo = {
            registry: cidSystemInfo.get('Registry'),
            ordering: cidSystemInfo.get('Ordering'),
            supplement: cidSystemInfo.get('Supplement')
          };
        }

        var cidToGidMap = dict.get('CIDToGIDMap');
        if (isStream(cidToGidMap)) {
          properties.cidToGidMap = this.readCidToGidMap(cidToGidMap);
        }
      }

      // Based on 9.6.6 of the spec the encoding can come from multiple places
      // and depends on the font type. The base encoding and differences are
      // read here, but the encoding that is actually used is chosen during
      // glyph mapping in the font.
      // TODO: Loading the built in encoding in the font would allow the
      // differences to be merged in here not require us to hold on to it.
      var differences = [];
      var baseEncodingName = null;
      var encoding;
      if (dict.has('Encoding')) {
        encoding = dict.get('Encoding');
        if (isDict(encoding)) {
          baseEncodingName = encoding.get('BaseEncoding');
          baseEncodingName = (isName(baseEncodingName) ?
                              baseEncodingName.name : null);
          // Load the differences between the base and original
          if (encoding.has('Differences')) {
            var diffEncoding = encoding.get('Differences');
            var index = 0;
            for (var j = 0, jj = diffEncoding.length; j < jj; j++) {
              var data = diffEncoding[j];
              if (isNum(data)) {
                index = data;
              } else {
                differences[index++] = data.name;
              }
            }
          }
        } else if (isName(encoding)) {
          baseEncodingName = encoding.name;
        } else {
          error('Encoding is not a Name nor a Dict');
        }
        // According to table 114 if the encoding is a named encoding it must be
        // one of these predefined encodings.
        if ((baseEncodingName !== 'MacRomanEncoding' &&
             baseEncodingName !== 'MacExpertEncoding' &&
             baseEncodingName !== 'WinAnsiEncoding')) {
          baseEncodingName = null;
        }
      }

      if (baseEncodingName) {
        properties.defaultEncoding = Encodings[baseEncodingName].slice();
      } else {
        encoding = (properties.type === 'TrueType' ?
                    Encodings.WinAnsiEncoding : Encodings.StandardEncoding);
        // The Symbolic attribute can be misused for regular fonts
        // Heuristic: we have to check if the font is a standard one also
        if (!!(properties.flags & FontFlags.Symbolic)) {
          encoding = Encodings.MacRomanEncoding;
          if (!properties.file) {
            if (/Symbol/i.test(properties.name)) {
              encoding = Encodings.SymbolSetEncoding;
            } else if (/Dingbats/i.test(properties.name)) {
              encoding = Encodings.ZapfDingbatsEncoding;
            }
          }
        }
        properties.defaultEncoding = encoding;
      }

      properties.differences = differences;
      properties.baseEncodingName = baseEncodingName;
      properties.dict = dict;
    },

    readToUnicode: function PartialEvaluator_readToUnicode(toUnicode) {
      var cmap, cmapObj = toUnicode;
      if (isName(cmapObj)) {
        cmap = CMapFactory.create(cmapObj,
          { url: PDFJS.cMapUrl, packed: PDFJS.cMapPacked }, null);
        if (cmap instanceof IdentityCMap) {
          return new IdentityToUnicodeMap(0, 0xFFFF);
        }
        return new ToUnicodeMap(cmap.getMap());
      } else if (isStream(cmapObj)) {
        cmap = CMapFactory.create(cmapObj,
          { url: PDFJS.cMapUrl, packed: PDFJS.cMapPacked }, null);
        if (cmap instanceof IdentityCMap) {
          return new IdentityToUnicodeMap(0, 0xFFFF);
        }
        cmap = cmap.getMap();
        // Convert UTF-16BE
        // NOTE: cmap can be a sparse array, so use forEach instead of for(;;)
        // to iterate over all keys.
        cmap.forEach(function(token, i) {
          var str = [];
          for (var k = 0; k < token.length; k += 2) {
            var w1 = (token.charCodeAt(k) << 8) | token.charCodeAt(k + 1);
            if ((w1 & 0xF800) !== 0xD800) { // w1 < 0xD800 || w1 > 0xDFFF
              str.push(w1);
              continue;
            }
            k += 2;
            var w2 = (token.charCodeAt(k) << 8) | token.charCodeAt(k + 1);
            str.push(((w1 & 0x3ff) << 10) + (w2 & 0x3ff) + 0x10000);
          }
          cmap[i] = String.fromCharCode.apply(String, str);
        });
        return new ToUnicodeMap(cmap);
      }
      return null;
    },

    readCidToGidMap: function PartialEvaluator_readCidToGidMap(cidToGidStream) {
      // Extract the encoding from the CIDToGIDMap
      var glyphsData = cidToGidStream.getBytes();

      // Set encoding 0 to later verify the font has an encoding
      var result = [];
      for (var j = 0, jj = glyphsData.length; j < jj; j++) {
        var glyphID = (glyphsData[j++] << 8) | glyphsData[j];
        if (glyphID === 0) {
          continue;
        }
        var code = j >> 1;
        result[code] = glyphID;
      }
      return result;
    },

    extractWidths: function PartialEvaluator_extractWidths(dict, xref,
                                                           descriptor,
                                                           properties) {
      var glyphsWidths = [];
      var defaultWidth = 0;
      var glyphsVMetrics = [];
      var defaultVMetrics;
      var i, ii, j, jj, start, code, widths;
      if (properties.composite) {
        defaultWidth = dict.get('DW') || 1000;

        widths = dict.get('W');
        if (widths) {
          for (i = 0, ii = widths.length; i < ii; i++) {
            start = widths[i++];
            code = xref.fetchIfRef(widths[i]);
            if (isArray(code)) {
              for (j = 0, jj = code.length; j < jj; j++) {
                glyphsWidths[start++] = code[j];
              }
            } else {
              var width = widths[++i];
              for (j = start; j <= code; j++) {
                glyphsWidths[j] = width;
              }
            }
          }
        }

        if (properties.vertical) {
          var vmetrics = (dict.get('DW2') || [880, -1000]);
          defaultVMetrics = [vmetrics[1], defaultWidth * 0.5, vmetrics[0]];
          vmetrics = dict.get('W2');
          if (vmetrics) {
            for (i = 0, ii = vmetrics.length; i < ii; i++) {
              start = vmetrics[i++];
              code = xref.fetchIfRef(vmetrics[i]);
              if (isArray(code)) {
                for (j = 0, jj = code.length; j < jj; j++) {
                  glyphsVMetrics[start++] = [code[j++], code[j++], code[j]];
                }
              } else {
                var vmetric = [vmetrics[++i], vmetrics[++i], vmetrics[++i]];
                for (j = start; j <= code; j++) {
                  glyphsVMetrics[j] = vmetric;
                }
              }
            }
          }
        }
      } else {
        var firstChar = properties.firstChar;
        widths = dict.get('Widths');
        if (widths) {
          j = firstChar;
          for (i = 0, ii = widths.length; i < ii; i++) {
            glyphsWidths[j++] = widths[i];
          }
          defaultWidth = (parseFloat(descriptor.get('MissingWidth')) || 0);
        } else {
          // Trying get the BaseFont metrics (see comment above).
          var baseFontName = dict.get('BaseFont');
          if (isName(baseFontName)) {
            var metrics = this.getBaseFontMetrics(baseFontName.name);

            glyphsWidths = this.buildCharCodeToWidth(metrics.widths,
                                                     properties);
            defaultWidth = metrics.defaultWidth;
          }
        }
      }

      // Heuristic: detection of monospace font by checking all non-zero widths
      var isMonospace = true;
      var firstWidth = defaultWidth;
      for (var glyph in glyphsWidths) {
        var glyphWidth = glyphsWidths[glyph];
        if (!glyphWidth) {
          continue;
        }
        if (!firstWidth) {
          firstWidth = glyphWidth;
          continue;
        }
        if (firstWidth !== glyphWidth) {
          isMonospace = false;
          break;
        }
      }
      if (isMonospace) {
        properties.flags |= FontFlags.FixedPitch;
      }

      properties.defaultWidth = defaultWidth;
      properties.widths = glyphsWidths;
      properties.defaultVMetrics = defaultVMetrics;
      properties.vmetrics = glyphsVMetrics;
    },

    isSerifFont: function PartialEvaluator_isSerifFont(baseFontName) {
      // Simulating descriptor flags attribute
      var fontNameWoStyle = baseFontName.split('-')[0];
      return (fontNameWoStyle in serifFonts) ||
              (fontNameWoStyle.search(/serif/gi) !== -1);
    },

    getBaseFontMetrics: function PartialEvaluator_getBaseFontMetrics(name) {
      var defaultWidth = 0;
      var widths = [];
      var monospace = false;
      var lookupName = (stdFontMap[name] || name);

      if (!(lookupName in Metrics)) {
        // Use default fonts for looking up font metrics if the passed
        // font is not a base font
        if (this.isSerifFont(name)) {
          lookupName = 'Times-Roman';
        } else {
          lookupName = 'Helvetica';
        }
      }
      var glyphWidths = Metrics[lookupName];

      if (isNum(glyphWidths)) {
        defaultWidth = glyphWidths;
        monospace = true;
      } else {
        widths = glyphWidths;
      }

      return {
        defaultWidth: defaultWidth,
        monospace: monospace,
        widths: widths
      };
    },

    buildCharCodeToWidth:
        function PartialEvaluator_bulildCharCodeToWidth(widthsByGlyphName,
                                                        properties) {
      var widths = Object.create(null);
      var differences = properties.differences;
      var encoding = properties.defaultEncoding;
      for (var charCode = 0; charCode < 256; charCode++) {
        if (charCode in differences &&
            widthsByGlyphName[differences[charCode]]) {
          widths[charCode] = widthsByGlyphName[differences[charCode]];
          continue;
        }
        if (charCode in encoding && widthsByGlyphName[encoding[charCode]]) {
          widths[charCode] = widthsByGlyphName[encoding[charCode]];
          continue;
        }
      }
      return widths;
    },

    preEvaluateFont: function PartialEvaluator_preEvaluateFont(dict, xref) {
      var baseDict = dict;
      var type = dict.get('Subtype');
      assert(isName(type), 'invalid font Subtype');

      var composite = false;
      var uint8array;
      if (type.name === 'Type0') {
        // If font is a composite
        //  - get the descendant font
        //  - set the type according to the descendant font
        //  - get the FontDescriptor from the descendant font
        var df = dict.get('DescendantFonts');
        if (!df) {
          error('Descendant fonts are not specified');
        }
        dict = (isArray(df) ? xref.fetchIfRef(df[0]) : df);

        type = dict.get('Subtype');
        assert(isName(type), 'invalid font Subtype');
        composite = true;
      }

      var descriptor = dict.get('FontDescriptor');
      if (descriptor) {
        var hash = new MurmurHash3_64();
        var encoding = baseDict.getRaw('Encoding');
        if (isName(encoding)) {
          hash.update(encoding.name);
        } else if (isRef(encoding)) {
          hash.update(encoding.num + '_' + encoding.gen);
        } else if (isDict(encoding)) {
          var keys = encoding.getKeys();
          for (var i = 0, ii = keys.length; i < ii; i++) {
            var entry = encoding.getRaw(keys[i]);
            if (isName(entry)) {
              hash.update(entry.name);
            } else if (isRef(entry)) {
              hash.update(entry.num + '_' + entry.gen);
            } else if (isArray(entry)) { // 'Differences' entry.
              // Ideally we should check the contents of the array, but to avoid
              // parsing it here and then again in |extractDataStructures|,
              // we only use the array length for now (fixes bug1157493.pdf).
              hash.update(entry.length.toString());
            }
          }
        }

        var toUnicode = dict.get('ToUnicode') || baseDict.get('ToUnicode');
        if (isStream(toUnicode)) {
          var stream = toUnicode.str || toUnicode;
          uint8array = stream.buffer ?
            new Uint8Array(stream.buffer.buffer, 0, stream.bufferLength) :
            new Uint8Array(stream.bytes.buffer,
                           stream.start, stream.end - stream.start);
          hash.update(uint8array);

        } else if (isName(toUnicode)) {
          hash.update(toUnicode.name);
        }

        var widths = dict.get('Widths') || baseDict.get('Widths');
        if (widths) {
          uint8array = new Uint8Array(new Uint32Array(widths).buffer);
          hash.update(uint8array);
        }
      }

      return {
        descriptor: descriptor,
        dict: dict,
        baseDict: baseDict,
        composite: composite,
        type: type.name,
        hash: hash ? hash.hexdigest() : ''
      };
    },

    translateFont: function PartialEvaluator_translateFont(preEvaluatedFont,
                                                           xref) {
      var baseDict = preEvaluatedFont.baseDict;
      var dict = preEvaluatedFont.dict;
      var composite = preEvaluatedFont.composite;
      var descriptor = preEvaluatedFont.descriptor;
      var type = preEvaluatedFont.type;
      var maxCharIndex = (composite ? 0xFFFF : 0xFF);
      var properties;

      if (!descriptor) {
        if (type === 'Type3') {
          // FontDescriptor is only required for Type3 fonts when the document
          // is a tagged pdf. Create a barbebones one to get by.
          descriptor = new Dict(null);
          descriptor.set('FontName', Name.get(type));
        } else {
          // Before PDF 1.5 if the font was one of the base 14 fonts, having a
          // FontDescriptor was not required.
          // This case is here for compatibility.
          var baseFontName = dict.get('BaseFont');
          if (!isName(baseFontName)) {
            error('Base font is not specified');
          }

          // Using base font name as a font name.
          baseFontName = baseFontName.name.replace(/[,_]/g, '-');
          var metrics = this.getBaseFontMetrics(baseFontName);

          // Simulating descriptor flags attribute
          var fontNameWoStyle = baseFontName.split('-')[0];
          var flags =
            (this.isSerifFont(fontNameWoStyle) ? FontFlags.Serif : 0) |
            (metrics.monospace ? FontFlags.FixedPitch : 0) |
            (symbolsFonts[fontNameWoStyle] ? FontFlags.Symbolic :
                                             FontFlags.Nonsymbolic);

          properties = {
            type: type,
            name: baseFontName,
            widths: metrics.widths,
            defaultWidth: metrics.defaultWidth,
            flags: flags,
            firstChar: 0,
            lastChar: maxCharIndex
          };
          this.extractDataStructures(dict, dict, xref, properties);
          properties.widths = this.buildCharCodeToWidth(metrics.widths,
                                                        properties);
          return new Font(baseFontName, null, properties);
        }
      }

      // According to the spec if 'FontDescriptor' is declared, 'FirstChar',
      // 'LastChar' and 'Widths' should exist too, but some PDF encoders seem
      // to ignore this rule when a variant of a standart font is used.
      // TODO Fill the width array depending on which of the base font this is
      // a variant.
      var firstChar = (dict.get('FirstChar') || 0);
      var lastChar = (dict.get('LastChar') || maxCharIndex);

      var fontName = descriptor.get('FontName');
      var baseFont = dict.get('BaseFont');
      // Some bad PDFs have a string as the font name.
      if (isString(fontName)) {
        fontName = Name.get(fontName);
      }
      if (isString(baseFont)) {
        baseFont = Name.get(baseFont);
      }

      if (type !== 'Type3') {
        var fontNameStr = fontName && fontName.name;
        var baseFontStr = baseFont && baseFont.name;
        if (fontNameStr !== baseFontStr) {
          info('The FontDescriptor\'s FontName is "' + fontNameStr +
               '" but should be the same as the Font\'s BaseFont "' +
               baseFontStr + '"');
          // Workaround for cases where e.g. fontNameStr = 'Arial' and
          // baseFontStr = 'Arial,Bold' (needed when no font file is embedded).
          if (fontNameStr && baseFontStr &&
              baseFontStr.indexOf(fontNameStr) === 0) {
            fontName = baseFont;
          }
        }
      }
      fontName = (fontName || baseFont);

      assert(isName(fontName), 'invalid font name');

      var fontFile = descriptor.get('FontFile', 'FontFile2', 'FontFile3');
      if (fontFile) {
        if (fontFile.dict) {
          var subtype = fontFile.dict.get('Subtype');
          if (subtype) {
            subtype = subtype.name;
          }
          var length1 = fontFile.dict.get('Length1');
          var length2 = fontFile.dict.get('Length2');
        }
      }

      properties = {
        type: type,
        name: fontName.name,
        subtype: subtype,
        file: fontFile,
        length1: length1,
        length2: length2,
        loadedName: baseDict.loadedName,
        composite: composite,
        wideChars: composite,
        fixedPitch: false,
        fontMatrix: (dict.get('FontMatrix') || FONT_IDENTITY_MATRIX),
        firstChar: firstChar || 0,
        lastChar: (lastChar || maxCharIndex),
        bbox: descriptor.get('FontBBox'),
        ascent: descriptor.get('Ascent'),
        descent: descriptor.get('Descent'),
        xHeight: descriptor.get('XHeight'),
        capHeight: descriptor.get('CapHeight'),
        flags: descriptor.get('Flags'),
        italicAngle: descriptor.get('ItalicAngle'),
        coded: false
      };

      if (composite) {
        var cidEncoding = baseDict.get('Encoding');
        if (isName(cidEncoding)) {
          properties.cidEncoding = cidEncoding.name;
        }
        properties.cMap = CMapFactory.create(cidEncoding,
          { url: PDFJS.cMapUrl, packed: PDFJS.cMapPacked }, null);
        properties.vertical = properties.cMap.vertical;
      }
      this.extractDataStructures(dict, baseDict, xref, properties);
      this.extractWidths(dict, xref, descriptor, properties);

      if (type === 'Type3') {
        properties.isType3Font = true;
      }

      return new Font(fontName.name, fontFile, properties);
    }
  };

  return PartialEvaluator;
})();

var TranslatedFont = (function TranslatedFontClosure() {
  function TranslatedFont(loadedName, font, dict) {
    this.loadedName = loadedName;
    this.font = font;
    this.dict = dict;
    this.type3Loaded = null;
    this.sent = false;
  }
  TranslatedFont.prototype = {
    send: function (handler) {
      if (this.sent) {
        return;
      }
      var fontData = this.font.exportData();
      handler.send('commonobj', [
        this.loadedName,
        'Font',
        fontData
      ]);
      this.sent = true;
    },
    loadType3Data: function (evaluator, resources, parentOperatorList) {
      assert(this.font.isType3Font);

      if (this.type3Loaded) {
        return this.type3Loaded;
      }

      var translatedFont = this.font;
      var loadCharProcsPromise = Promise.resolve();
      var charProcs = this.dict.get('CharProcs').getAll();
      var fontResources = this.dict.get('Resources') || resources;
      var charProcKeys = Object.keys(charProcs);
      var charProcOperatorList = {};
      for (var i = 0, n = charProcKeys.length; i < n; ++i) {
        loadCharProcsPromise = loadCharProcsPromise.then(function (key) {
          var glyphStream = charProcs[key];
          var operatorList = new OperatorList();
          return evaluator.getOperatorList(glyphStream, fontResources,
                                           operatorList).then(function () {
            charProcOperatorList[key] = operatorList.getIR();

            // Add the dependencies to the parent operator list so they are
            // resolved before sub operator list is executed synchronously.
            parentOperatorList.addDependencies(operatorList.dependencies);
          }, function (reason) {
            warn('Type3 font resource \"' + key + '\" is not available');
            var operatorList = new OperatorList();
            charProcOperatorList[key] = operatorList.getIR();
          });
        }.bind(this, charProcKeys[i]));
      }
      this.type3Loaded = loadCharProcsPromise.then(function () {
        translatedFont.charProcOperatorList = charProcOperatorList;
      });
      return this.type3Loaded;
    }
  };
  return TranslatedFont;
})();

var OperatorList = (function OperatorListClosure() {
  var CHUNK_SIZE = 1000;
  var CHUNK_SIZE_ABOUT = CHUNK_SIZE - 5; // close to chunk size

  function getTransfers(queue) {
    var transfers = [];
    var fnArray = queue.fnArray, argsArray = queue.argsArray;
    for (var i = 0, ii = queue.length; i < ii; i++) {
      switch (fnArray[i]) {
        case OPS.paintInlineImageXObject:
        case OPS.paintInlineImageXObjectGroup:
        case OPS.paintImageMaskXObject:
          var arg = argsArray[i][0]; // first param in imgData
          if (!arg.cached) {
            transfers.push(arg.data.buffer);
          }
          break;
      }
    }
    return transfers;
  }

  function OperatorList(intent, messageHandler, pageIndex) {
    this.messageHandler = messageHandler;
    this.fnArray = [];
    this.argsArray = [];
    this.dependencies = {};
    this.pageIndex = pageIndex;
    this.intent = intent;
  }

  OperatorList.prototype = {
    get length() {
      return this.argsArray.length;
    },

    addOp: function(fn, args) {
      this.fnArray.push(fn);
      this.argsArray.push(args);
      if (this.messageHandler) {
        if (this.fnArray.length >= CHUNK_SIZE) {
          this.flush();
        } else if (this.fnArray.length >= CHUNK_SIZE_ABOUT &&
                   (fn === OPS.restore || fn === OPS.endText)) {
          // heuristic to flush on boundary of restore or endText
          this.flush();
        }
      }
    },

    addDependency: function(dependency) {
      if (dependency in this.dependencies) {
        return;
      }
      this.dependencies[dependency] = true;
      this.addOp(OPS.dependency, [dependency]);
    },

    addDependencies: function(dependencies) {
      for (var key in dependencies) {
        this.addDependency(key);
      }
    },

    addOpList: function(opList) {
      Util.extendObj(this.dependencies, opList.dependencies);
      for (var i = 0, ii = opList.length; i < ii; i++) {
        this.addOp(opList.fnArray[i], opList.argsArray[i]);
      }
    },

    getIR: function() {
      return {
        fnArray: this.fnArray,
        argsArray: this.argsArray,
        length: this.length
      };
    },

    flush: function(lastChunk) {
      if (this.intent !== 'oplist') {
        new QueueOptimizer().optimize(this);
      }
      var transfers = getTransfers(this);
      this.messageHandler.send('RenderPageChunk', {
        operatorList: {
          fnArray: this.fnArray,
          argsArray: this.argsArray,
          lastChunk: lastChunk,
          length: this.length
        },
        pageIndex: this.pageIndex,
        intent: this.intent
      }, transfers);
      this.dependencies = {};
      this.fnArray.length = 0;
      this.argsArray.length = 0;
    }
  };

  return OperatorList;
})();

var StateManager = (function StateManagerClosure() {
  function StateManager(initialState) {
    this.state = initialState;
    this.stateStack = [];
  }
  StateManager.prototype = {
    save: function () {
      var old = this.state;
      this.stateStack.push(this.state);
      this.state = old.clone();
    },
    restore: function () {
      var prev = this.stateStack.pop();
      if (prev) {
        this.state = prev;
      }
    },
    transform: function (args) {
      this.state.ctm = Util.transform(this.state.ctm, args);
    }
  };
  return StateManager;
})();

var TextState = (function TextStateClosure() {
  function TextState() {
    this.ctm = new Float32Array(IDENTITY_MATRIX);
    this.fontSize = 0;
    this.font = null;
    this.fontMatrix = FONT_IDENTITY_MATRIX;
    this.textMatrix = IDENTITY_MATRIX.slice();
    this.textLineMatrix = IDENTITY_MATRIX.slice();
    this.charSpacing = 0;
    this.wordSpacing = 0;
    this.leading = 0;
    this.textHScale = 1;
    this.textRise = 0;
  }

  TextState.prototype = {
    setTextMatrix: function TextState_setTextMatrix(a, b, c, d, e, f) {
      var m = this.textMatrix;
      m[0] = a; m[1] = b; m[2] = c; m[3] = d; m[4] = e; m[5] = f;
    },
    setTextLineMatrix: function TextState_setTextMatrix(a, b, c, d, e, f) {
      var m = this.textLineMatrix;
      m[0] = a; m[1] = b; m[2] = c; m[3] = d; m[4] = e; m[5] = f;
    },
    translateTextMatrix: function TextState_translateTextMatrix(x, y) {
      var m = this.textMatrix;
      m[4] = m[0] * x + m[2] * y + m[4];
      m[5] = m[1] * x + m[3] * y + m[5];
    },
    translateTextLineMatrix: function TextState_translateTextMatrix(x, y) {
      var m = this.textLineMatrix;
      m[4] = m[0] * x + m[2] * y + m[4];
      m[5] = m[1] * x + m[3] * y + m[5];
    },
    calcRenderMatrix: function TextState_calcRendeMatrix(ctm) {
      // 9.4.4 Text Space Details
      var tsm = [this.fontSize * this.textHScale, 0,
                0, this.fontSize,
                0, this.textRise];
      return Util.transform(ctm, Util.transform(this.textMatrix, tsm));
    },
    carriageReturn: function TextState_carriageReturn() {
      this.translateTextLineMatrix(0, -this.leading);
      this.textMatrix = this.textLineMatrix.slice();
    },
    clone: function TextState_clone() {
      var clone = Object.create(this);
      clone.textMatrix = this.textMatrix.slice();
      clone.textLineMatrix = this.textLineMatrix.slice();
      clone.fontMatrix = this.fontMatrix.slice();
      return clone;
    }
  };
  return TextState;
})();

var EvalState = (function EvalStateClosure() {
  function EvalState() {
    this.ctm = new Float32Array(IDENTITY_MATRIX);
    this.font = null;
    this.textRenderingMode = TextRenderingMode.FILL;
    this.fillColorSpace = ColorSpace.singletons.gray;
    this.strokeColorSpace = ColorSpace.singletons.gray;
  }
  EvalState.prototype = {
    clone: function CanvasExtraState_clone() {
      return Object.create(this);
    },
  };
  return EvalState;
})();

var EvaluatorPreprocessor = (function EvaluatorPreprocessorClosure() {
  // Specifies properties for each command
  //
  // If variableArgs === true: [0, `numArgs`] expected
  // If variableArgs === false: exactly `numArgs` expected
  var OP_MAP = {
    // Graphic state
    w: { id: OPS.setLineWidth, numArgs: 1, variableArgs: false },
    J: { id: OPS.setLineCap, numArgs: 1, variableArgs: false },
    j: { id: OPS.setLineJoin, numArgs: 1, variableArgs: false },
    M: { id: OPS.setMiterLimit, numArgs: 1, variableArgs: false },
    d: { id: OPS.setDash, numArgs: 2, variableArgs: false },
    ri: { id: OPS.setRenderingIntent, numArgs: 1, variableArgs: false },
    i: { id: OPS.setFlatness, numArgs: 1, variableArgs: false },
    gs: { id: OPS.setGState, numArgs: 1, variableArgs: false },
    q: { id: OPS.save, numArgs: 0, variableArgs: false },
    Q: { id: OPS.restore, numArgs: 0, variableArgs: false },
    cm: { id: OPS.transform, numArgs: 6, variableArgs: false },

    // Path
    m: { id: OPS.moveTo, numArgs: 2, variableArgs: false },
    l: { id: OPS.lineTo, numArgs: 2, variableArgs: false },
    c: { id: OPS.curveTo, numArgs: 6, variableArgs: false },
    v: { id: OPS.curveTo2, numArgs: 4, variableArgs: false },
    y: { id: OPS.curveTo3, numArgs: 4, variableArgs: false },
    h: { id: OPS.closePath, numArgs: 0, variableArgs: false },
    re: { id: OPS.rectangle, numArgs: 4, variableArgs: false },
    S: { id: OPS.stroke, numArgs: 0, variableArgs: false },
    s: { id: OPS.closeStroke, numArgs: 0, variableArgs: false },
    f: { id: OPS.fill, numArgs: 0, variableArgs: false },
    F: { id: OPS.fill, numArgs: 0, variableArgs: false },
    'f*': { id: OPS.eoFill, numArgs: 0, variableArgs: false },
    B: { id: OPS.fillStroke, numArgs: 0, variableArgs: false },
    'B*': { id: OPS.eoFillStroke, numArgs: 0, variableArgs: false },
    b: { id: OPS.closeFillStroke, numArgs: 0, variableArgs: false },
    'b*': { id: OPS.closeEOFillStroke, numArgs: 0, variableArgs: false },
    n: { id: OPS.endPath, numArgs: 0, variableArgs: false },

    // Clipping
    W: { id: OPS.clip, numArgs: 0, variableArgs: false },
    'W*': { id: OPS.eoClip, numArgs: 0, variableArgs: false },

    // Text
    BT: { id: OPS.beginText, numArgs: 0, variableArgs: false },
    ET: { id: OPS.endText, numArgs: 0, variableArgs: false },
    Tc: { id: OPS.setCharSpacing, numArgs: 1, variableArgs: false },
    Tw: { id: OPS.setWordSpacing, numArgs: 1, variableArgs: false },
    Tz: { id: OPS.setHScale, numArgs: 1, variableArgs: false },
    TL: { id: OPS.setLeading, numArgs: 1, variableArgs: false },
    Tf: { id: OPS.setFont, numArgs: 2, variableArgs: false },
    Tr: { id: OPS.setTextRenderingMode, numArgs: 1, variableArgs: false },
    Ts: { id: OPS.setTextRise, numArgs: 1, variableArgs: false },
    Td: { id: OPS.moveText, numArgs: 2, variableArgs: false },
    TD: { id: OPS.setLeadingMoveText, numArgs: 2, variableArgs: false },
    Tm: { id: OPS.setTextMatrix, numArgs: 6, variableArgs: false },
    'T*': { id: OPS.nextLine, numArgs: 0, variableArgs: false },
    Tj: { id: OPS.showText, numArgs: 1, variableArgs: false },
    TJ: { id: OPS.showSpacedText, numArgs: 1, variableArgs: false },
    '\'': { id: OPS.nextLineShowText, numArgs: 1, variableArgs: false },
    '"': { id: OPS.nextLineSetSpacingShowText, numArgs: 3,
           variableArgs: false },

    // Type3 fonts
    d0: { id: OPS.setCharWidth, numArgs: 2, variableArgs: false },
    d1: { id: OPS.setCharWidthAndBounds, numArgs: 6, variableArgs: false },

    // Color
    CS: { id: OPS.setStrokeColorSpace, numArgs: 1, variableArgs: false },
    cs: { id: OPS.setFillColorSpace, numArgs: 1, variableArgs: false },
    SC: { id: OPS.setStrokeColor, numArgs: 4, variableArgs: true },
    SCN: { id: OPS.setStrokeColorN, numArgs: 33, variableArgs: true },
    sc: { id: OPS.setFillColor, numArgs: 4, variableArgs: true },
    scn: { id: OPS.setFillColorN, numArgs: 33, variableArgs: true },
    G: { id: OPS.setStrokeGray, numArgs: 1, variableArgs: false },
    g: { id: OPS.setFillGray, numArgs: 1, variableArgs: false },
    RG: { id: OPS.setStrokeRGBColor, numArgs: 3, variableArgs: false },
    rg: { id: OPS.setFillRGBColor, numArgs: 3, variableArgs: false },
    K: { id: OPS.setStrokeCMYKColor, numArgs: 4, variableArgs: false },
    k: { id: OPS.setFillCMYKColor, numArgs: 4, variableArgs: false },

    // Shading
    sh: { id: OPS.shadingFill, numArgs: 1, variableArgs: false },

    // Images
    BI: { id: OPS.beginInlineImage, numArgs: 0, variableArgs: false },
    ID: { id: OPS.beginImageData, numArgs: 0, variableArgs: false },
    EI: { id: OPS.endInlineImage, numArgs: 1, variableArgs: false },

    // XObjects
    Do: { id: OPS.paintXObject, numArgs: 1, variableArgs: false },
    MP: { id: OPS.markPoint, numArgs: 1, variableArgs: false },
    DP: { id: OPS.markPointProps, numArgs: 2, variableArgs: false },
    BMC: { id: OPS.beginMarkedContent, numArgs: 1, variableArgs: false },
    BDC: { id: OPS.beginMarkedContentProps, numArgs: 2,
           variableArgs: false },
    EMC: { id: OPS.endMarkedContent, numArgs: 0, variableArgs: false },

    // Compatibility
    BX: { id: OPS.beginCompat, numArgs: 0, variableArgs: false },
    EX: { id: OPS.endCompat, numArgs: 0, variableArgs: false },

    // (reserved partial commands for the lexer)
    BM: null,
    BD: null,
    'true': null,
    fa: null,
    fal: null,
    fals: null,
    'false': null,
    nu: null,
    nul: null,
    'null': null
  };

  function EvaluatorPreprocessor(stream, xref, stateManager) {
    // TODO(mduan): pass array of knownCommands rather than OP_MAP
    // dictionary
    this.parser = new Parser(new Lexer(stream, OP_MAP), false, xref);
    this.stateManager = stateManager;
    this.nonProcessedArgs = [];
  }

  EvaluatorPreprocessor.prototype = {
    get savedStatesDepth() {
      return this.stateManager.stateStack.length;
    },

    // |operation| is an object with two fields:
    //
    // - |fn| is an out param.
    //
    // - |args| is an inout param. On entry, it should have one of two values.
    //
    //   - An empty array. This indicates that the caller is providing the
    //     array in which the args will be stored in. The caller should use
    //     this value if it can reuse a single array for each call to read().
    //
    //   - |null|. This indicates that the caller needs this function to create
    //     the array in which any args are stored in. If there are zero args,
    //     this function will leave |operation.args| as |null| (thus avoiding
    //     allocations that would occur if we used an empty array to represent
    //     zero arguments). Otherwise, it will replace |null| with a new array
    //     containing the arguments. The caller should use this value if it
    //     cannot reuse an array for each call to read().
    //
    // These two modes are present because this function is very hot and so
    // avoiding allocations where possible is worthwhile.
    //
    read: function EvaluatorPreprocessor_read(operation) {
      var args = operation.args;
      while (true) {
        var obj = this.parser.getObj();
        if (isCmd(obj)) {
          var cmd = obj.cmd;
          // Check that the command is valid
          var opSpec = OP_MAP[cmd];
          if (!opSpec) {
            warn('Unknown command "' + cmd + '"');
            continue;
          }

          var fn = opSpec.id;
          var numArgs = opSpec.numArgs;
          var argsLength = args !== null ? args.length : 0;

          if (!opSpec.variableArgs) {
            // Postscript commands can be nested, e.g. /F2 /GS2 gs 5.711 Tf
            if (argsLength !== numArgs) {
              var nonProcessedArgs = this.nonProcessedArgs;
              while (argsLength > numArgs) {
                nonProcessedArgs.push(args.shift());
                argsLength--;
              }
              while (argsLength < numArgs && nonProcessedArgs.length !== 0) {
                if (!args) {
                  args = [];
                }
                args.unshift(nonProcessedArgs.pop());
                argsLength++;
              }
            }

            if (argsLength < numArgs) {
              // If we receive too few args, it's not possible to possible
              // to execute the command, so skip the command
              info('Command ' + fn + ': because expected ' +
                   numArgs + ' args, but received ' + argsLength +
                   ' args; skipping');
              args = null;
              continue;
            }
          } else if (argsLength > numArgs) {
            info('Command ' + fn + ': expected [0,' + numArgs +
                 '] args, but received ' + argsLength + ' args');
          }

          // TODO figure out how to type-check vararg functions
          this.preprocessCommand(fn, args);

          operation.fn = fn;
          operation.args = args;
          return true;
        } else {
          if (isEOF(obj)) {
            return false; // no more commands
          }
          // argument
          if (obj !== null) {
            if (!args) {
              args = [];
            }
            args.push((obj instanceof Dict ? obj.getAll() : obj));
            assert(args.length <= 33, 'Too many arguments');
          }
        }
      }
    },

    preprocessCommand:
        function EvaluatorPreprocessor_preprocessCommand(fn, args) {
      switch (fn | 0) {
        case OPS.save:
          this.stateManager.save();
          break;
        case OPS.restore:
          this.stateManager.restore();
          break;
        case OPS.transform:
          this.stateManager.transform(args);
          break;
      }
    }
  };
  return EvaluatorPreprocessor;
})();

var QueueOptimizer = (function QueueOptimizerClosure() {
  function addState(parentState, pattern, fn) {
    var state = parentState;
    for (var i = 0, ii = pattern.length - 1; i < ii; i++) {
      var item = pattern[i];
      state = (state[item] || (state[item] = []));
    }
    state[pattern[pattern.length - 1]] = fn;
  }

  function handlePaintSolidColorImageMask(iFirstSave, count, fnArray,
                                          argsArray) {
    // Handles special case of mainly LaTeX documents which use image masks to
    // draw lines with the current fill style.
    // 'count' groups of (save, transform, paintImageMaskXObject, restore)+
    // have been found at iFirstSave.
    var iFirstPIMXO = iFirstSave + 2;
    for (var i = 0; i < count; i++) {
      var arg = argsArray[iFirstPIMXO + 4 * i];
      var imageMask = arg.length === 1 && arg[0];
      if (imageMask && imageMask.width === 1 && imageMask.height === 1 &&
          (!imageMask.data.length ||
           (imageMask.data.length === 1 && imageMask.data[0] === 0))) {
        fnArray[iFirstPIMXO + 4 * i] = OPS.paintSolidColorImageMask;
        continue;
      }
      break;
    }
    return count - i;
  }

  var InitialState = [];

  // This replaces (save, transform, paintInlineImageXObject, restore)+
  // sequences with one |paintInlineImageXObjectGroup| operation.
  addState(InitialState,
    [OPS.save, OPS.transform, OPS.paintInlineImageXObject, OPS.restore],
    function foundInlineImageGroup(context) {
      var MIN_IMAGES_IN_INLINE_IMAGES_BLOCK = 10;
      var MAX_IMAGES_IN_INLINE_IMAGES_BLOCK = 200;
      var MAX_WIDTH = 1000;
      var IMAGE_PADDING = 1;

      var fnArray = context.fnArray, argsArray = context.argsArray;
      var curr = context.iCurr;
      var iFirstSave = curr - 3;
      var iFirstTransform = curr - 2;
      var iFirstPIIXO = curr - 1;

      // Look for the quartets.
      var i = iFirstSave + 4;
      var ii = fnArray.length;
      while (i + 3 < ii) {
        if (fnArray[i] !== OPS.save ||
            fnArray[i + 1] !== OPS.transform ||
            fnArray[i + 2] !== OPS.paintInlineImageXObject ||
            fnArray[i + 3] !== OPS.restore) {
          break;    // ops don't match
        }
        i += 4;
      }

      // At this point, i is the index of the first op past the last valid
      // quartet.
      var count = Math.min((i - iFirstSave) / 4,
                           MAX_IMAGES_IN_INLINE_IMAGES_BLOCK);
      if (count < MIN_IMAGES_IN_INLINE_IMAGES_BLOCK) {
        return i;
      }

      // assuming that heights of those image is too small (~1 pixel)
      // packing as much as possible by lines
      var maxX = 0;
      var map = [], maxLineHeight = 0;
      var currentX = IMAGE_PADDING, currentY = IMAGE_PADDING;
      var q;
      for (q = 0; q < count; q++) {
        var transform = argsArray[iFirstTransform + (q << 2)];
        var img = argsArray[iFirstPIIXO + (q << 2)][0];
        if (currentX + img.width > MAX_WIDTH) {
          // starting new line
          maxX = Math.max(maxX, currentX);
          currentY += maxLineHeight + 2 * IMAGE_PADDING;
          currentX = 0;
          maxLineHeight = 0;
        }
        map.push({
          transform: transform,
          x: currentX, y: currentY,
          w: img.width, h: img.height
        });
        currentX += img.width + 2 * IMAGE_PADDING;
        maxLineHeight = Math.max(maxLineHeight, img.height);
      }
      var imgWidth = Math.max(maxX, currentX) + IMAGE_PADDING;
      var imgHeight = currentY + maxLineHeight + IMAGE_PADDING;
      var imgData = new Uint8Array(imgWidth * imgHeight * 4);
      var imgRowSize = imgWidth << 2;
      for (q = 0; q < count; q++) {
        var data = argsArray[iFirstPIIXO + (q << 2)][0].data;
        // Copy image by lines and extends pixels into padding.
        var rowSize = map[q].w << 2;
        var dataOffset = 0;
        var offset = (map[q].x + map[q].y * imgWidth) << 2;
        imgData.set(data.subarray(0, rowSize), offset - imgRowSize);
        for (var k = 0, kk = map[q].h; k < kk; k++) {
          imgData.set(data.subarray(dataOffset, dataOffset + rowSize), offset);
          dataOffset += rowSize;
          offset += imgRowSize;
        }
        imgData.set(data.subarray(dataOffset - rowSize, dataOffset), offset);
        while (offset >= 0) {
          data[offset - 4] = data[offset];
          data[offset - 3] = data[offset + 1];
          data[offset - 2] = data[offset + 2];
          data[offset - 1] = data[offset + 3];
          data[offset + rowSize] = data[offset + rowSize - 4];
          data[offset + rowSize + 1] = data[offset + rowSize - 3];
          data[offset + rowSize + 2] = data[offset + rowSize - 2];
          data[offset + rowSize + 3] = data[offset + rowSize - 1];
          offset -= imgRowSize;
        }
      }

      // Replace queue items.
      fnArray.splice(iFirstSave, count * 4, OPS.paintInlineImageXObjectGroup);
      argsArray.splice(iFirstSave, count * 4,
        [{ width: imgWidth, height: imgHeight, kind: ImageKind.RGBA_32BPP,
           data: imgData }, map]);

      return iFirstSave + 1;
    });

  // This replaces (save, transform, paintImageMaskXObject, restore)+
  // sequences with one |paintImageMaskXObjectGroup| or one
  // |paintImageMaskXObjectRepeat| operation.
  addState(InitialState,
    [OPS.save, OPS.transform, OPS.paintImageMaskXObject, OPS.restore],
    function foundImageMaskGroup(context) {
      var MIN_IMAGES_IN_MASKS_BLOCK = 10;
      var MAX_IMAGES_IN_MASKS_BLOCK = 100;
      var MAX_SAME_IMAGES_IN_MASKS_BLOCK = 1000;

      var fnArray = context.fnArray, argsArray = context.argsArray;
      var curr = context.iCurr;
      var iFirstSave = curr - 3;
      var iFirstTransform = curr - 2;
      var iFirstPIMXO = curr - 1;

      // Look for the quartets.
      var i = iFirstSave + 4;
      var ii = fnArray.length;
      while (i + 3 < ii) {
        if (fnArray[i] !== OPS.save ||
            fnArray[i + 1] !== OPS.transform ||
            fnArray[i + 2] !== OPS.paintImageMaskXObject ||
            fnArray[i + 3] !== OPS.restore) {
          break;    // ops don't match
        }
        i += 4;
      }

      // At this point, i is the index of the first op past the last valid
      // quartet.
      var count = (i - iFirstSave) / 4;
      count = handlePaintSolidColorImageMask(iFirstSave, count, fnArray,
                                             argsArray);
      if (count < MIN_IMAGES_IN_MASKS_BLOCK) {
        return i;
      }

      var q;
      var isSameImage = false;
      var iTransform, transformArgs;
      var firstPIMXOArg0 = argsArray[iFirstPIMXO][0];
      if (argsArray[iFirstTransform][1] === 0 &&
          argsArray[iFirstTransform][2] === 0) {
        isSameImage = true;
        var firstTransformArg0 = argsArray[iFirstTransform][0];
        var firstTransformArg3 = argsArray[iFirstTransform][3];
        iTransform = iFirstTransform + 4;
        var iPIMXO = iFirstPIMXO + 4;
        for (q = 1; q < count; q++, iTransform += 4, iPIMXO += 4) {
          transformArgs = argsArray[iTransform];
          if (argsArray[iPIMXO][0] !== firstPIMXOArg0 ||
              transformArgs[0] !== firstTransformArg0 ||
              transformArgs[1] !== 0 ||
              transformArgs[2] !== 0 ||
              transformArgs[3] !== firstTransformArg3) {
            if (q < MIN_IMAGES_IN_MASKS_BLOCK) {
              isSameImage = false;
            } else {
              count = q;
            }
            break; // different image or transform
          }
        }
      }

      if (isSameImage) {
        count = Math.min(count, MAX_SAME_IMAGES_IN_MASKS_BLOCK);
        var positions = new Float32Array(count * 2);
        iTransform = iFirstTransform;
        for (q = 0; q < count; q++, iTransform += 4) {
          transformArgs = argsArray[iTransform];
          positions[(q << 1)] = transformArgs[4];
          positions[(q << 1) + 1] = transformArgs[5];
        }

        // Replace queue items.
        fnArray.splice(iFirstSave, count * 4, OPS.paintImageMaskXObjectRepeat);
        argsArray.splice(iFirstSave, count * 4,
          [firstPIMXOArg0, firstTransformArg0, firstTransformArg3, positions]);
      } else {
        count = Math.min(count, MAX_IMAGES_IN_MASKS_BLOCK);
        var images = [];
        for (q = 0; q < count; q++) {
          transformArgs = argsArray[iFirstTransform + (q << 2)];
          var maskParams = argsArray[iFirstPIMXO + (q << 2)][0];
          images.push({ data: maskParams.data, width: maskParams.width,
                        height: maskParams.height,
                        transform: transformArgs });
        }

        // Replace queue items.
        fnArray.splice(iFirstSave, count * 4, OPS.paintImageMaskXObjectGroup);
        argsArray.splice(iFirstSave, count * 4, [images]);
      }

      return iFirstSave + 1;
    });

  // This replaces (save, transform, paintImageXObject, restore)+ sequences
  // with one paintImageXObjectRepeat operation, if the |transform| and
  // |paintImageXObjectRepeat| ops are appropriate.
  addState(InitialState,
    [OPS.save, OPS.transform, OPS.paintImageXObject, OPS.restore],
    function (context) {
      var MIN_IMAGES_IN_BLOCK = 3;
      var MAX_IMAGES_IN_BLOCK = 1000;

      var fnArray = context.fnArray, argsArray = context.argsArray;
      var curr = context.iCurr;
      var iFirstSave = curr - 3;
      var iFirstTransform = curr - 2;
      var iFirstPIXO = curr - 1;
      var iFirstRestore = curr;

      if (argsArray[iFirstTransform][1] !== 0 ||
          argsArray[iFirstTransform][2] !== 0) {
        return iFirstRestore + 1;   // transform has the wrong form
      }

      // Look for the quartets.
      var firstPIXOArg0 = argsArray[iFirstPIXO][0];
      var firstTransformArg0 = argsArray[iFirstTransform][0];
      var firstTransformArg3 = argsArray[iFirstTransform][3];
      var i = iFirstSave + 4;
      var ii = fnArray.length;
      while (i + 3 < ii) {
        if (fnArray[i] !== OPS.save ||
            fnArray[i + 1] !== OPS.transform ||
            fnArray[i + 2] !== OPS.paintImageXObject ||
            fnArray[i + 3] !== OPS.restore) {
          break;    // ops don't match
        }
        if (argsArray[i + 1][0] !== firstTransformArg0 ||
            argsArray[i + 1][1] !== 0 ||
            argsArray[i + 1][2] !== 0 ||
            argsArray[i + 1][3] !== firstTransformArg3) {
          break;    // transforms don't match
        }
        if (argsArray[i + 2][0] !== firstPIXOArg0) {
          break;    // images don't match
        }
        i += 4;
      }

      // At this point, i is the index of the first op past the last valid
      // quartet.
      var count = Math.min((i - iFirstSave) / 4, MAX_IMAGES_IN_BLOCK);
      if (count < MIN_IMAGES_IN_BLOCK) {
        return i;
      }

      // Extract the (x,y) positions from all of the matching transforms.
      var positions = new Float32Array(count * 2);
      var iTransform = iFirstTransform;
      for (var q = 0; q < count; q++, iTransform += 4) {
        var transformArgs = argsArray[iTransform];
        positions[(q << 1)] = transformArgs[4];
        positions[(q << 1) + 1] = transformArgs[5];
      }

      // Replace queue items.
      var args = [firstPIXOArg0, firstTransformArg0, firstTransformArg3,
                  positions];
      fnArray.splice(iFirstSave, count * 4, OPS.paintImageXObjectRepeat);
      argsArray.splice(iFirstSave, count * 4, args);

      return iFirstSave + 1;
    });

  // This replaces (beginText, setFont, setTextMatrix, showText, endText)+
  // sequences with (beginText, setFont, (setTextMatrix, showText)+, endText)+
  // sequences, if the font for each one is the same.
  addState(InitialState,
    [OPS.beginText, OPS.setFont, OPS.setTextMatrix, OPS.showText, OPS.endText],
    function (context) {
      var MIN_CHARS_IN_BLOCK = 3;
      var MAX_CHARS_IN_BLOCK = 1000;

      var fnArray = context.fnArray, argsArray = context.argsArray;
      var curr = context.iCurr;
      var iFirstBeginText = curr - 4;
      var iFirstSetFont = curr - 3;
      var iFirstSetTextMatrix = curr - 2;
      var iFirstShowText = curr - 1;
      var iFirstEndText = curr;

      // Look for the quintets.
      var firstSetFontArg0 = argsArray[iFirstSetFont][0];
      var firstSetFontArg1 = argsArray[iFirstSetFont][1];
      var i = iFirstBeginText + 5;
      var ii = fnArray.length;
      while (i + 4 < ii) {
        if (fnArray[i] !== OPS.beginText ||
            fnArray[i + 1] !== OPS.setFont ||
            fnArray[i + 2] !== OPS.setTextMatrix ||
            fnArray[i + 3] !== OPS.showText ||
            fnArray[i + 4] !== OPS.endText) {
          break;    // ops don't match
        }
        if (argsArray[i + 1][0] !== firstSetFontArg0 ||
            argsArray[i + 1][1] !== firstSetFontArg1) {
          break;    // fonts don't match
        }
        i += 5;
      }

      // At this point, i is the index of the first op past the last valid
      // quintet.
      var count = Math.min(((i - iFirstBeginText) / 5), MAX_CHARS_IN_BLOCK);
      if (count < MIN_CHARS_IN_BLOCK) {
        return i;
      }

      // If the preceding quintet is (<something>, setFont, setTextMatrix,
      // showText, endText), include that as well. (E.g. <something> might be
      // |dependency|.)
      var iFirst = iFirstBeginText;
      if (iFirstBeginText >= 4 &&
          fnArray[iFirstBeginText - 4] === fnArray[iFirstSetFont] &&
          fnArray[iFirstBeginText - 3] === fnArray[iFirstSetTextMatrix] &&
          fnArray[iFirstBeginText - 2] === fnArray[iFirstShowText] &&
          fnArray[iFirstBeginText - 1] === fnArray[iFirstEndText] &&
          argsArray[iFirstBeginText - 4][0] === firstSetFontArg0 &&
          argsArray[iFirstBeginText - 4][1] === firstSetFontArg1) {
        count++;
        iFirst -= 5;
      }

      // Remove (endText, beginText, setFont) trios.
      var iEndText = iFirst + 4;
      for (var q = 1; q < count; q++) {
        fnArray.splice(iEndText, 3);
        argsArray.splice(iEndText, 3);
        iEndText += 2;
      }

      return iEndText + 1;
    });

  function QueueOptimizer() {}

  QueueOptimizer.prototype = {
    optimize: function QueueOptimizer_optimize(queue) {
      var fnArray = queue.fnArray, argsArray = queue.argsArray;
      var context = {
        iCurr: 0,
        fnArray: fnArray,
        argsArray: argsArray
      };
      var state;
      var i = 0, ii = fnArray.length;
      while (i < ii) {
        state = (state || InitialState)[fnArray[i]];
        if (typeof state === 'function') { // we found some handler
          context.iCurr = i;
          // state() returns the index of the first non-matching op (if we
          // didn't match) or the first op past the modified ops (if we did
          // match and replace).
          i = state(context);
          state = undefined;    // reset the state machine
          ii = context.fnArray.length;
        } else {
          i++;
        }
      }
    }
  };
  return QueueOptimizer;
})();


var BUILT_IN_CMAPS = [
// << Start unicode maps.
'Adobe-GB1-UCS2',
'Adobe-CNS1-UCS2',
'Adobe-Japan1-UCS2',
'Adobe-Korea1-UCS2',
// >> End unicode maps.
'78-EUC-H',
'78-EUC-V',
'78-H',
'78-RKSJ-H',
'78-RKSJ-V',
'78-V',
'78ms-RKSJ-H',
'78ms-RKSJ-V',
'83pv-RKSJ-H',
'90ms-RKSJ-H',
'90ms-RKSJ-V',
'90msp-RKSJ-H',
'90msp-RKSJ-V',
'90pv-RKSJ-H',
'90pv-RKSJ-V',
'Add-H',
'Add-RKSJ-H',
'Add-RKSJ-V',
'Add-V',
'Adobe-CNS1-0',
'Adobe-CNS1-1',
'Adobe-CNS1-2',
'Adobe-CNS1-3',
'Adobe-CNS1-4',
'Adobe-CNS1-5',
'Adobe-CNS1-6',
'Adobe-GB1-0',
'Adobe-GB1-1',
'Adobe-GB1-2',
'Adobe-GB1-3',
'Adobe-GB1-4',
'Adobe-GB1-5',
'Adobe-Japan1-0',
'Adobe-Japan1-1',
'Adobe-Japan1-2',
'Adobe-Japan1-3',
'Adobe-Japan1-4',
'Adobe-Japan1-5',
'Adobe-Japan1-6',
'Adobe-Korea1-0',
'Adobe-Korea1-1',
'Adobe-Korea1-2',
'B5-H',
'B5-V',
'B5pc-H',
'B5pc-V',
'CNS-EUC-H',
'CNS-EUC-V',
'CNS1-H',
'CNS1-V',
'CNS2-H',
'CNS2-V',
'ETHK-B5-H',
'ETHK-B5-V',
'ETen-B5-H',
'ETen-B5-V',
'ETenms-B5-H',
'ETenms-B5-V',
'EUC-H',
'EUC-V',
'Ext-H',
'Ext-RKSJ-H',
'Ext-RKSJ-V',
'Ext-V',
'GB-EUC-H',
'GB-EUC-V',
'GB-H',
'GB-V',
'GBK-EUC-H',
'GBK-EUC-V',
'GBK2K-H',
'GBK2K-V',
'GBKp-EUC-H',
'GBKp-EUC-V',
'GBT-EUC-H',
'GBT-EUC-V',
'GBT-H',
'GBT-V',
'GBTpc-EUC-H',
'GBTpc-EUC-V',
'GBpc-EUC-H',
'GBpc-EUC-V',
'H',
'HKdla-B5-H',
'HKdla-B5-V',
'HKdlb-B5-H',
'HKdlb-B5-V',
'HKgccs-B5-H',
'HKgccs-B5-V',
'HKm314-B5-H',
'HKm314-B5-V',
'HKm471-B5-H',
'HKm471-B5-V',
'HKscs-B5-H',
'HKscs-B5-V',
'Hankaku',
'Hiragana',
'KSC-EUC-H',
'KSC-EUC-V',
'KSC-H',
'KSC-Johab-H',
'KSC-Johab-V',
'KSC-V',
'KSCms-UHC-H',
'KSCms-UHC-HW-H',
'KSCms-UHC-HW-V',
'KSCms-UHC-V',
'KSCpc-EUC-H',
'KSCpc-EUC-V',
'Katakana',
'NWP-H',
'NWP-V',
'RKSJ-H',
'RKSJ-V',
'Roman',
'UniCNS-UCS2-H',
'UniCNS-UCS2-V',
'UniCNS-UTF16-H',
'UniCNS-UTF16-V',
'UniCNS-UTF32-H',
'UniCNS-UTF32-V',
'UniCNS-UTF8-H',
'UniCNS-UTF8-V',
'UniGB-UCS2-H',
'UniGB-UCS2-V',
'UniGB-UTF16-H',
'UniGB-UTF16-V',
'UniGB-UTF32-H',
'UniGB-UTF32-V',
'UniGB-UTF8-H',
'UniGB-UTF8-V',
'UniJIS-UCS2-H',
'UniJIS-UCS2-HW-H',
'UniJIS-UCS2-HW-V',
'UniJIS-UCS2-V',
'UniJIS-UTF16-H',
'UniJIS-UTF16-V',
'UniJIS-UTF32-H',
'UniJIS-UTF32-V',
'UniJIS-UTF8-H',
'UniJIS-UTF8-V',
'UniJIS2004-UTF16-H',
'UniJIS2004-UTF16-V',
'UniJIS2004-UTF32-H',
'UniJIS2004-UTF32-V',
'UniJIS2004-UTF8-H',
'UniJIS2004-UTF8-V',
'UniJISPro-UCS2-HW-V',
'UniJISPro-UCS2-V',
'UniJISPro-UTF8-V',
'UniJISX0213-UTF32-H',
'UniJISX0213-UTF32-V',
'UniJISX02132004-UTF32-H',
'UniJISX02132004-UTF32-V',
'UniKS-UCS2-H',
'UniKS-UCS2-V',
'UniKS-UTF16-H',
'UniKS-UTF16-V',
'UniKS-UTF32-H',
'UniKS-UTF32-V',
'UniKS-UTF8-H',
'UniKS-UTF8-V',
'V',
'WP-Symbol'];

// CMap, not to be confused with TrueType's cmap.
var CMap = (function CMapClosure() {
  function CMap(builtInCMap) {
    // Codespace ranges are stored as follows:
    // [[1BytePairs], [2BytePairs], [3BytePairs], [4BytePairs]]
    // where nBytePairs are ranges e.g. [low1, high1, low2, high2, ...]
    this.codespaceRanges = [[], [], [], []];
    this.numCodespaceRanges = 0;
    // Map entries have one of two forms.
    // - cid chars are 16-bit unsigned integers, stored as integers.
    // - bf chars are variable-length byte sequences, stored as strings, with
    //   one byte per character.
    this._map = [];
    this.name = '';
    this.vertical = false;
    this.useCMap = null;
    this.builtInCMap = builtInCMap;
  }
  CMap.prototype = {
    addCodespaceRange: function(n, low, high) {
      this.codespaceRanges[n - 1].push(low, high);
      this.numCodespaceRanges++;
    },

    mapCidRange: function(low, high, dstLow) {
      while (low <= high) {
        this._map[low++] = dstLow++;
      }
    },

    mapBfRange: function(low, high, dstLow) {
      var lastByte = dstLow.length - 1;
      while (low <= high) {
        this._map[low++] = dstLow;
        // Only the last byte has to be incremented.
        dstLow = dstLow.substr(0, lastByte) +
                 String.fromCharCode(dstLow.charCodeAt(lastByte) + 1);
      }
    },

    mapBfRangeToArray: function(low, high, array) {
      var i = 0, ii = array.length;
      while (low <= high && i < ii) {
        this._map[low] = array[i++];
        ++low;
      }
    },

    // This is used for both bf and cid chars.
    mapOne: function(src, dst) {
      this._map[src] = dst;
    },

    lookup: function(code) {
      return this._map[code];
    },

    contains: function(code) {
      return this._map[code] !== undefined;
    },

    forEach: function(callback) {
      // Most maps have fewer than 65536 entries, and for those we use normal
      // array iteration. But really sparse tables are possible -- e.g. with
      // indices in the *billions*. For such tables we use for..in, which isn't
      // ideal because it stringifies the indices for all present elements, but
      // it does avoid iterating over every undefined entry.
      var map = this._map;
      var length = map.length;
      var i;
      if (length <= 0x10000) {
        for (i = 0; i < length; i++) {
          if (map[i] !== undefined) {
            callback(i, map[i]);
          }
        }
      } else {
        for (i in this._map) {
          callback(i, map[i]);
        }
      }
    },

    charCodeOf: function(value) {
      return this._map.indexOf(value);
    },

    getMap: function() {
      return this._map;
    },

    readCharCode: function(str, offset, out) {
      var c = 0;
      var codespaceRanges = this.codespaceRanges;
      var codespaceRangesLen = this.codespaceRanges.length;
      // 9.7.6.2 CMap Mapping
      // The code length is at most 4.
      for (var n = 0; n < codespaceRangesLen; n++) {
        c = ((c << 8) | str.charCodeAt(offset + n)) >>> 0;
        // Check each codespace range to see if it falls within.
        var codespaceRange = codespaceRanges[n];
        for (var k = 0, kk = codespaceRange.length; k < kk;) {
          var low = codespaceRange[k++];
          var high = codespaceRange[k++];
          if (c >= low && c <= high) {
            out.charcode = c;
            out.length = n + 1;
            return;
          }
        }
      }
      out.charcode = 0;
      out.length = 1;
    },

    get isIdentityCMap() {
      if (!(this.name === 'Identity-H' || this.name === 'Identity-V')) {
        return false;
      }
      if (this._map.length !== 0x10000) {
        return false;
      }
      for (var i = 0; i < 0x10000; i++) {
        if (this._map[i] !== i) {
          return false;
        }
      }
      return true;
    }
  };
  return CMap;
})();

// A special case of CMap, where the _map array implicitly has a length of
// 65536 and each element is equal to its index.
var IdentityCMap = (function IdentityCMapClosure() {
  function IdentityCMap(vertical, n) {
    CMap.call(this);
    this.vertical = vertical;
    this.addCodespaceRange(n, 0, 0xffff);
  }
  Util.inherit(IdentityCMap, CMap, {});

  IdentityCMap.prototype = {
    addCodespaceRange: CMap.prototype.addCodespaceRange,

    mapCidRange: function(low, high, dstLow) {
      error('should not call mapCidRange');
    },

    mapBfRange: function(low, high, dstLow) {
      error('should not call mapBfRange');
    },

    mapBfRangeToArray: function(low, high, array) {
      error('should not call mapBfRangeToArray');
    },

    mapOne: function(src, dst) {
      error('should not call mapCidOne');
    },

    lookup: function(code) {
      return (isInt(code) && code <= 0xffff) ? code : undefined;
    },

    contains: function(code) {
      return isInt(code) && code <= 0xffff;
    },

    forEach: function(callback) {
      for (var i = 0; i <= 0xffff; i++) {
        callback(i, i);
      }
    },

    charCodeOf: function(value) {
      return (isInt(value) && value <= 0xffff) ? value : -1;
    },

    getMap: function() {
      // Sometimes identity maps must be instantiated, but it's rare.
      var map = new Array(0x10000);
      for (var i = 0; i <= 0xffff; i++) {
        map[i] = i;
      }
      return map;
    },

    readCharCode: CMap.prototype.readCharCode,

    get isIdentityCMap() {
      error('should not access .isIdentityCMap');
    }
  };

  return IdentityCMap;
})();

var BinaryCMapReader = (function BinaryCMapReaderClosure() {
  function fetchBinaryData(url) {
    var nonBinaryRequest = PDFJS.disableWorker;
    var request = new XMLHttpRequest();
    request.open('GET', url, false);
    if (!nonBinaryRequest) {
      try {
        request.responseType = 'arraybuffer';
        nonBinaryRequest = request.responseType !== 'arraybuffer';
      } catch (e) {
        nonBinaryRequest = true;
      }
    }
    if (nonBinaryRequest && request.overrideMimeType) {
      request.overrideMimeType('text/plain; charset=x-user-defined');
    }
    request.send(null);
    if (nonBinaryRequest ? !request.responseText : !request.response) {
      error('Unable to get binary cMap at: ' + url);
    }
    if (nonBinaryRequest) {
      var data = Array.prototype.map.call(request.responseText, function (ch) {
        return ch.charCodeAt(0) & 255;
      });
      return new Uint8Array(data);
    }
    return new Uint8Array(request.response);
  }

  function hexToInt(a, size) {
    var n = 0;
    for (var i = 0; i <= size; i++) {
      n = (n << 8) | a[i];
    }
    return n >>> 0;
  }

  function hexToStr(a, size) {
    // This code is hot. Special-case some common values to avoid creating an
    // object with subarray().
    if (size === 1) {
      return String.fromCharCode(a[0], a[1]);
    }
    if (size === 3) {
      return String.fromCharCode(a[0], a[1], a[2], a[3]);
    }
    return String.fromCharCode.apply(null, a.subarray(0, size + 1));
  }

  function addHex(a, b, size) {
    var c = 0;
    for (var i = size; i >= 0; i--) {
      c += a[i] + b[i];
      a[i] = c & 255;
      c >>= 8;
    }
  }

  function incHex(a, size) {
    var c = 1;
    for (var i = size; i >= 0 && c > 0; i--) {
      c += a[i];
      a[i] = c & 255;
      c >>= 8;
    }
  }

  var MAX_NUM_SIZE = 16;
  var MAX_ENCODED_NUM_SIZE = 19; // ceil(MAX_NUM_SIZE * 7 / 8)

  function BinaryCMapStream(data) {
    this.buffer = data;
    this.pos = 0;
    this.end = data.length;
    this.tmpBuf = new Uint8Array(MAX_ENCODED_NUM_SIZE);
  }

  BinaryCMapStream.prototype = {
    readByte: function () {
      if (this.pos >= this.end) {
        return -1;
      }
      return this.buffer[this.pos++];
    },
    readNumber: function () {
      var n = 0;
      var last;
      do {
        var b = this.readByte();
        if (b < 0) {
          error('unexpected EOF in bcmap');
        }
        last = !(b & 0x80);
        n = (n << 7) | (b & 0x7F);
      } while (!last);
      return n;
    },
    readSigned: function () {
      var n = this.readNumber();
      return (n & 1) ? ~(n >>> 1) : n >>> 1;
    },
    readHex: function (num, size) {
      num.set(this.buffer.subarray(this.pos,
        this.pos + size + 1));
      this.pos += size + 1;
    },
    readHexNumber: function (num, size) {
      var last;
      var stack = this.tmpBuf, sp = 0;
      do {
        var b = this.readByte();
        if (b < 0) {
          error('unexpected EOF in bcmap');
        }
        last = !(b & 0x80);
        stack[sp++] = b & 0x7F;
      } while (!last);
      var i = size, buffer = 0, bufferSize = 0;
      while (i >= 0) {
        while (bufferSize < 8 && stack.length > 0) {
          buffer = (stack[--sp] << bufferSize) | buffer;
          bufferSize += 7;
        }
        num[i] = buffer & 255;
        i--;
        buffer >>= 8;
        bufferSize -= 8;
      }
    },
    readHexSigned: function (num, size) {
      this.readHexNumber(num, size);
      var sign = num[size] & 1 ? 255 : 0;
      var c = 0;
      for (var i = 0; i <= size; i++) {
        c = ((c & 1) << 8) | num[i];
        num[i] = (c >> 1) ^ sign;
      }
    },
    readString: function () {
      var len = this.readNumber();
      var s = '';
      for (var i = 0; i < len; i++) {
        s += String.fromCharCode(this.readNumber());
      }
      return s;
    }
  };

  function processBinaryCMap(url, cMap, extend) {
    var data = fetchBinaryData(url);
    var stream = new BinaryCMapStream(data);

    var header = stream.readByte();
    cMap.vertical = !!(header & 1);

    var useCMap = null;
    var start = new Uint8Array(MAX_NUM_SIZE);
    var end = new Uint8Array(MAX_NUM_SIZE);
    var char = new Uint8Array(MAX_NUM_SIZE);
    var charCode = new Uint8Array(MAX_NUM_SIZE);
    var tmp = new Uint8Array(MAX_NUM_SIZE);
    var code;

    var b;
    while ((b = stream.readByte()) >= 0) {
      var type = b >> 5;
      if (type === 7) { // metadata, e.g. comment or usecmap
        switch (b & 0x1F) {
          case 0:
            stream.readString(); // skipping comment
            break;
          case 1:
            useCMap = stream.readString();
            break;
        }
        continue;
      }
      var sequence = !!(b & 0x10);
      var dataSize = b & 15;

      assert(dataSize + 1 <= MAX_NUM_SIZE);

      var ucs2DataSize = 1;
      var subitemsCount = stream.readNumber();
      var i;
      switch (type) {
        case 0: // codespacerange
          stream.readHex(start, dataSize);
          stream.readHexNumber(end, dataSize);
          addHex(end, start, dataSize);
          cMap.addCodespaceRange(dataSize + 1, hexToInt(start, dataSize),
                                 hexToInt(end, dataSize));
          for (i = 1; i < subitemsCount; i++) {
            incHex(end, dataSize);
            stream.readHexNumber(start, dataSize);
            addHex(start, end, dataSize);
            stream.readHexNumber(end, dataSize);
            addHex(end, start, dataSize);
            cMap.addCodespaceRange(dataSize + 1, hexToInt(start, dataSize),
                                   hexToInt(end, dataSize));
          }
          break;
        case 1: // notdefrange
          stream.readHex(start, dataSize);
          stream.readHexNumber(end, dataSize);
          addHex(end, start, dataSize);
          code = stream.readNumber();
          // undefined range, skipping
          for (i = 1; i < subitemsCount; i++) {
            incHex(end, dataSize);
            stream.readHexNumber(start, dataSize);
            addHex(start, end, dataSize);
            stream.readHexNumber(end, dataSize);
            addHex(end, start, dataSize);
            code = stream.readNumber();
            // nop
          }
          break;
        case 2: // cidchar
          stream.readHex(char, dataSize);
          code = stream.readNumber();
          cMap.mapOne(hexToInt(char, dataSize), code);
          for (i = 1; i < subitemsCount; i++) {
            incHex(char, dataSize);
            if (!sequence) {
              stream.readHexNumber(tmp, dataSize);
              addHex(char, tmp, dataSize);
            }
            code = stream.readSigned() + (code + 1);
            cMap.mapOne(hexToInt(char, dataSize), code);
          }
          break;
        case 3: // cidrange
          stream.readHex(start, dataSize);
          stream.readHexNumber(end, dataSize);
          addHex(end, start, dataSize);
          code = stream.readNumber();
          cMap.mapCidRange(hexToInt(start, dataSize), hexToInt(end, dataSize),
                           code);
          for (i = 1; i < subitemsCount; i++) {
            incHex(end, dataSize);
            if (!sequence) {
              stream.readHexNumber(start, dataSize);
              addHex(start, end, dataSize);
            } else {
              start.set(end);
            }
            stream.readHexNumber(end, dataSize);
            addHex(end, start, dataSize);
            code = stream.readNumber();
            cMap.mapCidRange(hexToInt(start, dataSize), hexToInt(end, dataSize),
                             code);
          }
          break;
        case 4: // bfchar
          stream.readHex(char, ucs2DataSize);
          stream.readHex(charCode, dataSize);
          cMap.mapOne(hexToInt(char, ucs2DataSize),
                      hexToStr(charCode, dataSize));
          for (i = 1; i < subitemsCount; i++) {
            incHex(char, ucs2DataSize);
            if (!sequence) {
              stream.readHexNumber(tmp, ucs2DataSize);
              addHex(char, tmp, ucs2DataSize);
            }
            incHex(charCode, dataSize);
            stream.readHexSigned(tmp, dataSize);
            addHex(charCode, tmp, dataSize);
            cMap.mapOne(hexToInt(char, ucs2DataSize),
                        hexToStr(charCode, dataSize));
          }
          break;
        case 5: // bfrange
          stream.readHex(start, ucs2DataSize);
          stream.readHexNumber(end, ucs2DataSize);
          addHex(end, start, ucs2DataSize);
          stream.readHex(charCode, dataSize);
          cMap.mapBfRange(hexToInt(start, ucs2DataSize),
                          hexToInt(end, ucs2DataSize),
                          hexToStr(charCode, dataSize));
          for (i = 1; i < subitemsCount; i++) {
            incHex(end, ucs2DataSize);
            if (!sequence) {
              stream.readHexNumber(start, ucs2DataSize);
              addHex(start, end, ucs2DataSize);
            } else {
              start.set(end);
            }
            stream.readHexNumber(end, ucs2DataSize);
            addHex(end, start, ucs2DataSize);
            stream.readHex(charCode, dataSize);
            cMap.mapBfRange(hexToInt(start, ucs2DataSize),
                            hexToInt(end, ucs2DataSize),
                            hexToStr(charCode, dataSize));
          }
          break;
        default:
          error('Unknown type: ' + type);
          break;
      }
    }

    if (useCMap) {
      extend(useCMap);
    }
    return cMap;
  }

  function BinaryCMapReader() {}

  BinaryCMapReader.prototype = {
    read: processBinaryCMap
  };

  return BinaryCMapReader;
})();

var CMapFactory = (function CMapFactoryClosure() {
  function strToInt(str) {
    var a = 0;
    for (var i = 0; i < str.length; i++) {
      a = (a << 8) | str.charCodeAt(i);
    }
    return a >>> 0;
  }

  function expectString(obj) {
    if (!isString(obj)) {
      error('Malformed CMap: expected string.');
    }
  }

  function expectInt(obj) {
    if (!isInt(obj)) {
      error('Malformed CMap: expected int.');
    }
  }

  function parseBfChar(cMap, lexer) {
    while (true) {
      var obj = lexer.getObj();
      if (isEOF(obj)) {
        break;
      }
      if (isCmd(obj, 'endbfchar')) {
        return;
      }
      expectString(obj);
      var src = strToInt(obj);
      obj = lexer.getObj();
      // TODO are /dstName used?
      expectString(obj);
      var dst = obj;
      cMap.mapOne(src, dst);
    }
  }

  function parseBfRange(cMap, lexer) {
    while (true) {
      var obj = lexer.getObj();
      if (isEOF(obj)) {
        break;
      }
      if (isCmd(obj, 'endbfrange')) {
        return;
      }
      expectString(obj);
      var low = strToInt(obj);
      obj = lexer.getObj();
      expectString(obj);
      var high = strToInt(obj);
      obj = lexer.getObj();
      if (isInt(obj) || isString(obj)) {
        var dstLow = isInt(obj) ? String.fromCharCode(obj) : obj;
        cMap.mapBfRange(low, high, dstLow);
      } else if (isCmd(obj, '[')) {
        obj = lexer.getObj();
        var array = [];
        while (!isCmd(obj, ']') && !isEOF(obj)) {
          array.push(obj);
          obj = lexer.getObj();
        }
        cMap.mapBfRangeToArray(low, high, array);
      } else {
        break;
      }
    }
    error('Invalid bf range.');
  }

  function parseCidChar(cMap, lexer) {
    while (true) {
      var obj = lexer.getObj();
      if (isEOF(obj)) {
        break;
      }
      if (isCmd(obj, 'endcidchar')) {
        return;
      }
      expectString(obj);
      var src = strToInt(obj);
      obj = lexer.getObj();
      expectInt(obj);
      var dst = obj;
      cMap.mapOne(src, dst);
    }
  }

  function parseCidRange(cMap, lexer) {
    while (true) {
      var obj = lexer.getObj();
      if (isEOF(obj)) {
        break;
      }
      if (isCmd(obj, 'endcidrange')) {
        return;
      }
      expectString(obj);
      var low = strToInt(obj);
      obj = lexer.getObj();
      expectString(obj);
      var high = strToInt(obj);
      obj = lexer.getObj();
      expectInt(obj);
      var dstLow = obj;
      cMap.mapCidRange(low, high, dstLow);
    }
  }

  function parseCodespaceRange(cMap, lexer) {
    while (true) {
      var obj = lexer.getObj();
      if (isEOF(obj)) {
        break;
      }
      if (isCmd(obj, 'endcodespacerange')) {
        return;
      }
      if (!isString(obj)) {
        break;
      }
      var low = strToInt(obj);
      obj = lexer.getObj();
      if (!isString(obj)) {
        break;
      }
      var high = strToInt(obj);
      cMap.addCodespaceRange(obj.length, low, high);
    }
    error('Invalid codespace range.');
  }

  function parseWMode(cMap, lexer) {
    var obj = lexer.getObj();
    if (isInt(obj)) {
      cMap.vertical = !!obj;
    }
  }

  function parseCMapName(cMap, lexer) {
    var obj = lexer.getObj();
    if (isName(obj) && isString(obj.name)) {
      cMap.name = obj.name;
    }
  }

  function parseCMap(cMap, lexer, builtInCMapParams, useCMap) {
    var previous;
    var embededUseCMap;
    objLoop: while (true) {
      var obj = lexer.getObj();
      if (isEOF(obj)) {
        break;
      } else if (isName(obj)) {
        if (obj.name === 'WMode') {
          parseWMode(cMap, lexer);
        } else if (obj.name === 'CMapName') {
          parseCMapName(cMap, lexer);
        }
        previous = obj;
      } else if (isCmd(obj)) {
        switch (obj.cmd) {
          case 'endcmap':
            break objLoop;
          case 'usecmap':
            if (isName(previous)) {
              embededUseCMap = previous.name;
            }
            break;
          case 'begincodespacerange':
            parseCodespaceRange(cMap, lexer);
            break;
          case 'beginbfchar':
            parseBfChar(cMap, lexer);
            break;
          case 'begincidchar':
            parseCidChar(cMap, lexer);
            break;
          case 'beginbfrange':
            parseBfRange(cMap, lexer);
            break;
          case 'begincidrange':
            parseCidRange(cMap, lexer);
            break;
        }
      }
    }

    if (!useCMap && embededUseCMap) {
      // Load the usecmap definition from the file only if there wasn't one
      // specified.
      useCMap = embededUseCMap;
    }
    if (useCMap) {
      extendCMap(cMap, builtInCMapParams, useCMap);
    }
  }

  function extendCMap(cMap, builtInCMapParams, useCMap) {
    cMap.useCMap = createBuiltInCMap(useCMap, builtInCMapParams);
    // If there aren't any code space ranges defined clone all the parent ones
    // into this cMap.
    if (cMap.numCodespaceRanges === 0) {
      var useCodespaceRanges = cMap.useCMap.codespaceRanges;
      for (var i = 0; i < useCodespaceRanges.length; i++) {
        cMap.codespaceRanges[i] = useCodespaceRanges[i].slice();
      }
      cMap.numCodespaceRanges = cMap.useCMap.numCodespaceRanges;
    }
    // Merge the map into the current one, making sure not to override
    // any previously defined entries.
    cMap.useCMap.forEach(function(key, value) {
      if (!cMap.contains(key)) {
        cMap.mapOne(key, cMap.useCMap.lookup(key));
      }
    });
  }

  function parseBinaryCMap(name, builtInCMapParams) {
    var url = builtInCMapParams.url + name + '.bcmap';
    var cMap = new CMap(true);
    new BinaryCMapReader().read(url, cMap, function (useCMap) {
      extendCMap(cMap, builtInCMapParams, useCMap);
    });
    return cMap;
  }

  function createBuiltInCMap(name, builtInCMapParams) {
    if (name === 'Identity-H') {
      return new IdentityCMap(false, 2);
    } else if (name === 'Identity-V') {
      return new IdentityCMap(true, 2);
    }
    if (BUILT_IN_CMAPS.indexOf(name) === -1) {
      error('Unknown cMap name: ' + name);
    }
    assert(builtInCMapParams, 'built-in cMap parameters are not provided');

    if (builtInCMapParams.packed) {
      return parseBinaryCMap(name, builtInCMapParams);
    }

    var request = new XMLHttpRequest();
    var url = builtInCMapParams.url + name;
    request.open('GET', url, false);
    request.send(null);
    if (!request.responseText) {
      error('Unable to get cMap at: ' + url);
    }
    var cMap = new CMap(true);
    var lexer = new Lexer(new StringStream(request.responseText));
    parseCMap(cMap, lexer, builtInCMapParams, null);
    return cMap;
  }

  return {
    create: function (encoding, builtInCMapParams, useCMap) {
      if (isName(encoding)) {
        return createBuiltInCMap(encoding.name, builtInCMapParams);
      } else if (isStream(encoding)) {
        var cMap = new CMap();
        var lexer = new Lexer(encoding);
        try {
          parseCMap(cMap, lexer, builtInCMapParams, useCMap);
        } catch (e) {
          warn('Invalid CMap data. ' + e);
        }
        if (cMap.isIdentityCMap) {
          return createBuiltInCMap(cMap.name, builtInCMapParams);
        }
        return cMap;
      }
      error('Encoding required.');
    }
  };
})();


// Unicode Private Use Area
var PRIVATE_USE_OFFSET_START = 0xE000;
var PRIVATE_USE_OFFSET_END = 0xF8FF;
var SKIP_PRIVATE_USE_RANGE_F000_TO_F01F = false;

// PDF Glyph Space Units are one Thousandth of a TextSpace Unit
// except for Type 3 fonts
var PDF_GLYPH_SPACE_UNITS = 1000;

// Hinting is currently disabled due to unknown problems on windows
// in tracemonkey and various other pdfs with type1 fonts.
var HINTING_ENABLED = false;

// Accented charactars are not displayed properly on windows, using this flag
// to control analysis of seac charstrings.
var SEAC_ANALYSIS_ENABLED = false;

var FontFlags = {
  FixedPitch: 1,
  Serif: 2,
  Symbolic: 4,
  Script: 8,
  Nonsymbolic: 32,
  Italic: 64,
  AllCap: 65536,
  SmallCap: 131072,
  ForceBold: 262144
};

var Encodings = {
  ExpertEncoding: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    'space', 'exclamsmall', 'Hungarumlautsmall', '', 'dollaroldstyle',
    'dollarsuperior', 'ampersandsmall', 'Acutesmall', 'parenleftsuperior',
    'parenrightsuperior', 'twodotenleader', 'onedotenleader', 'comma',
    'hyphen', 'period', 'fraction', 'zerooldstyle', 'oneoldstyle',
    'twooldstyle', 'threeoldstyle', 'fouroldstyle', 'fiveoldstyle',
    'sixoldstyle', 'sevenoldstyle', 'eightoldstyle', 'nineoldstyle', 'colon',
    'semicolon', 'commasuperior', 'threequartersemdash', 'periodsuperior',
    'questionsmall', '', 'asuperior', 'bsuperior', 'centsuperior', 'dsuperior',
    'esuperior', '', '', 'isuperior', '', '', 'lsuperior', 'msuperior',
    'nsuperior', 'osuperior', '', '', 'rsuperior', 'ssuperior', 'tsuperior',
    '', 'ff', 'fi', 'fl', 'ffi', 'ffl', 'parenleftinferior', '',
    'parenrightinferior', 'Circumflexsmall', 'hyphensuperior', 'Gravesmall',
    'Asmall', 'Bsmall', 'Csmall', 'Dsmall', 'Esmall', 'Fsmall', 'Gsmall',
    'Hsmall', 'Ismall', 'Jsmall', 'Ksmall', 'Lsmall', 'Msmall', 'Nsmall',
    'Osmall', 'Psmall', 'Qsmall', 'Rsmall', 'Ssmall', 'Tsmall', 'Usmall',
    'Vsmall', 'Wsmall', 'Xsmall', 'Ysmall', 'Zsmall', 'colonmonetary',
    'onefitted', 'rupiah', 'Tildesmall', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', 'exclamdownsmall', 'centoldstyle', 'Lslashsmall',
    '', '', 'Scaronsmall', 'Zcaronsmall', 'Dieresissmall', 'Brevesmall',
    'Caronsmall', '', 'Dotaccentsmall', '', '', 'Macronsmall', '', '',
    'figuredash', 'hypheninferior', '', '', 'Ogoneksmall', 'Ringsmall',
    'Cedillasmall', '', '', '', 'onequarter', 'onehalf', 'threequarters',
    'questiondownsmall', 'oneeighth', 'threeeighths', 'fiveeighths',
    'seveneighths', 'onethird', 'twothirds', '', '', 'zerosuperior',
    'onesuperior', 'twosuperior', 'threesuperior', 'foursuperior',
    'fivesuperior', 'sixsuperior', 'sevensuperior', 'eightsuperior',
    'ninesuperior', 'zeroinferior', 'oneinferior', 'twoinferior',
    'threeinferior', 'fourinferior', 'fiveinferior', 'sixinferior',
    'seveninferior', 'eightinferior', 'nineinferior', 'centinferior',
    'dollarinferior', 'periodinferior', 'commainferior', 'Agravesmall',
    'Aacutesmall', 'Acircumflexsmall', 'Atildesmall', 'Adieresissmall',
    'Aringsmall', 'AEsmall', 'Ccedillasmall', 'Egravesmall', 'Eacutesmall',
    'Ecircumflexsmall', 'Edieresissmall', 'Igravesmall', 'Iacutesmall',
    'Icircumflexsmall', 'Idieresissmall', 'Ethsmall', 'Ntildesmall',
    'Ogravesmall', 'Oacutesmall', 'Ocircumflexsmall', 'Otildesmall',
    'Odieresissmall', 'OEsmall', 'Oslashsmall', 'Ugravesmall', 'Uacutesmall',
    'Ucircumflexsmall', 'Udieresissmall', 'Yacutesmall', 'Thornsmall',
    'Ydieresissmall'],
  MacExpertEncoding: ['', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    'space', 'exclamsmall', 'Hungarumlautsmall', 'centoldstyle',
    'dollaroldstyle', 'dollarsuperior', 'ampersandsmall', 'Acutesmall',
    'parenleftsuperior', 'parenrightsuperior', 'twodotenleader',
    'onedotenleader', 'comma', 'hyphen', 'period', 'fraction', 'zerooldstyle',
    'oneoldstyle', 'twooldstyle', 'threeoldstyle', 'fouroldstyle',
    'fiveoldstyle', 'sixoldstyle', 'sevenoldstyle', 'eightoldstyle',
    'nineoldstyle', 'colon', 'semicolon', '', 'threequartersemdash', '',
    'questionsmall', '', '', '', '', 'Ethsmall', '', '', 'onequarter',
    'onehalf', 'threequarters', 'oneeighth', 'threeeighths', 'fiveeighths',
    'seveneighths', 'onethird', 'twothirds', '', '', '', '', '', '', 'ff',
    'fi', 'fl', 'ffi', 'ffl', 'parenleftinferior', '', 'parenrightinferior',
    'Circumflexsmall', 'hypheninferior', 'Gravesmall', 'Asmall', 'Bsmall',
    'Csmall', 'Dsmall', 'Esmall', 'Fsmall', 'Gsmall', 'Hsmall', 'Ismall',
    'Jsmall', 'Ksmall', 'Lsmall', 'Msmall', 'Nsmall', 'Osmall', 'Psmall',
    'Qsmall', 'Rsmall', 'Ssmall', 'Tsmall', 'Usmall', 'Vsmall', 'Wsmall',
    'Xsmall', 'Ysmall', 'Zsmall', 'colonmonetary', 'onefitted', 'rupiah',
    'Tildesmall', '', '', 'asuperior', 'centsuperior', '', '', '', '',
    'Aacutesmall', 'Agravesmall', 'Acircumflexsmall', 'Adieresissmall',
    'Atildesmall', 'Aringsmall', 'Ccedillasmall', 'Eacutesmall', 'Egravesmall',
    'Ecircumflexsmall', 'Edieresissmall', 'Iacutesmall', 'Igravesmall',
    'Icircumflexsmall', 'Idieresissmall', 'Ntildesmall', 'Oacutesmall',
    'Ogravesmall', 'Ocircumflexsmall', 'Odieresissmall', 'Otildesmall',
    'Uacutesmall', 'Ugravesmall', 'Ucircumflexsmall', 'Udieresissmall', '',
    'eightsuperior', 'fourinferior', 'threeinferior', 'sixinferior',
    'eightinferior', 'seveninferior', 'Scaronsmall', '', 'centinferior',
    'twoinferior', '', 'Dieresissmall', '', 'Caronsmall', 'osuperior',
    'fiveinferior', '', 'commainferior', 'periodinferior', 'Yacutesmall', '',
    'dollarinferior', '', 'Thornsmall', '', 'nineinferior', 'zeroinferior',
    'Zcaronsmall', 'AEsmall', 'Oslashsmall', 'questiondownsmall',
    'oneinferior', 'Lslashsmall', '', '', '', '', '', '', 'Cedillasmall', '',
    '', '', '', '', 'OEsmall', 'figuredash', 'hyphensuperior', '', '', '', '',
    'exclamdownsmall', '', 'Ydieresissmall', '', 'onesuperior', 'twosuperior',
    'threesuperior', 'foursuperior', 'fivesuperior', 'sixsuperior',
    'sevensuperior', 'ninesuperior', 'zerosuperior', '', 'esuperior',
    'rsuperior', 'tsuperior', '', '', 'isuperior', 'ssuperior', 'dsuperior',
    '', '', '', '', '', 'lsuperior', 'Ogoneksmall', 'Brevesmall',
    'Macronsmall', 'bsuperior', 'nsuperior', 'msuperior', 'commasuperior',
    'periodsuperior', 'Dotaccentsmall', 'Ringsmall'],
  MacRomanEncoding: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    'space', 'exclam', 'quotedbl', 'numbersign', 'dollar', 'percent',
    'ampersand', 'quotesingle', 'parenleft', 'parenright', 'asterisk', 'plus',
    'comma', 'hyphen', 'period', 'slash', 'zero', 'one', 'two', 'three',
    'four', 'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon',
    'less', 'equal', 'greater', 'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F',
    'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U',
    'V', 'W', 'X', 'Y', 'Z', 'bracketleft', 'backslash', 'bracketright',
    'asciicircum', 'underscore', 'grave', 'a', 'b', 'c', 'd', 'e', 'f', 'g',
    'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
    'w', 'x', 'y', 'z', 'braceleft', 'bar', 'braceright', 'asciitilde', '',
    'Adieresis', 'Aring', 'Ccedilla', 'Eacute', 'Ntilde', 'Odieresis',
    'Udieresis', 'aacute', 'agrave', 'acircumflex', 'adieresis', 'atilde',
    'aring', 'ccedilla', 'eacute', 'egrave', 'ecircumflex', 'edieresis',
    'iacute', 'igrave', 'icircumflex', 'idieresis', 'ntilde', 'oacute',
    'ograve', 'ocircumflex', 'odieresis', 'otilde', 'uacute', 'ugrave',
    'ucircumflex', 'udieresis', 'dagger', 'degree', 'cent', 'sterling',
    'section', 'bullet', 'paragraph', 'germandbls', 'registered', 'copyright',
    'trademark', 'acute', 'dieresis', 'notequal', 'AE', 'Oslash', 'infinity',
    'plusminus', 'lessequal', 'greaterequal', 'yen', 'mu', 'partialdiff',
    'summation', 'product', 'pi', 'integral', 'ordfeminine', 'ordmasculine',
    'Omega', 'ae', 'oslash', 'questiondown', 'exclamdown', 'logicalnot',
    'radical', 'florin', 'approxequal', 'Delta', 'guillemotleft',
    'guillemotright', 'ellipsis', 'space', 'Agrave', 'Atilde', 'Otilde', 'OE',
    'oe', 'endash', 'emdash', 'quotedblleft', 'quotedblright', 'quoteleft',
    'quoteright', 'divide', 'lozenge', 'ydieresis', 'Ydieresis', 'fraction',
    'currency', 'guilsinglleft', 'guilsinglright', 'fi', 'fl', 'daggerdbl',
    'periodcentered', 'quotesinglbase', 'quotedblbase', 'perthousand',
    'Acircumflex', 'Ecircumflex', 'Aacute', 'Edieresis', 'Egrave', 'Iacute',
    'Icircumflex', 'Idieresis', 'Igrave', 'Oacute', 'Ocircumflex', 'apple',
    'Ograve', 'Uacute', 'Ucircumflex', 'Ugrave', 'dotlessi', 'circumflex',
    'tilde', 'macron', 'breve', 'dotaccent', 'ring', 'cedilla', 'hungarumlaut',
    'ogonek', 'caron'],
  StandardEncoding: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    'space', 'exclam', 'quotedbl', 'numbersign', 'dollar', 'percent',
    'ampersand', 'quoteright', 'parenleft', 'parenright', 'asterisk', 'plus',
    'comma', 'hyphen', 'period', 'slash', 'zero', 'one', 'two', 'three',
    'four', 'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon',
    'less', 'equal', 'greater', 'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F',
    'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U',
    'V', 'W', 'X', 'Y', 'Z', 'bracketleft', 'backslash', 'bracketright',
    'asciicircum', 'underscore', 'quoteleft', 'a', 'b', 'c', 'd', 'e', 'f',
    'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u',
    'v', 'w', 'x', 'y', 'z', 'braceleft', 'bar', 'braceright', 'asciitilde',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'exclamdown',
    'cent', 'sterling', 'fraction', 'yen', 'florin', 'section', 'currency',
    'quotesingle', 'quotedblleft', 'guillemotleft', 'guilsinglleft',
    'guilsinglright', 'fi', 'fl', '', 'endash', 'dagger', 'daggerdbl',
    'periodcentered', '', 'paragraph', 'bullet', 'quotesinglbase',
    'quotedblbase', 'quotedblright', 'guillemotright', 'ellipsis',
    'perthousand', '', 'questiondown', '', 'grave', 'acute', 'circumflex',
    'tilde', 'macron', 'breve', 'dotaccent', 'dieresis', '', 'ring', 'cedilla',
    '', 'hungarumlaut', 'ogonek', 'caron', 'emdash', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', 'AE', '', 'ordfeminine', '', '',
    '', '', 'Lslash', 'Oslash', 'OE', 'ordmasculine', '', '', '', '', '', 'ae',
    '', '', '', 'dotlessi', '', '', 'lslash', 'oslash', 'oe', 'germandbls'],
  WinAnsiEncoding: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    'space', 'exclam', 'quotedbl', 'numbersign', 'dollar', 'percent',
    'ampersand', 'quotesingle', 'parenleft', 'parenright', 'asterisk', 'plus',
    'comma', 'hyphen', 'period', 'slash', 'zero', 'one', 'two', 'three',
    'four', 'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon',
    'less', 'equal', 'greater', 'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F',
    'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U',
    'V', 'W', 'X', 'Y', 'Z', 'bracketleft', 'backslash', 'bracketright',
    'asciicircum', 'underscore', 'grave', 'a', 'b', 'c', 'd', 'e', 'f', 'g',
    'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
    'w', 'x', 'y', 'z', 'braceleft', 'bar', 'braceright', 'asciitilde',
    'bullet', 'Euro', 'bullet', 'quotesinglbase', 'florin', 'quotedblbase',
    'ellipsis', 'dagger', 'daggerdbl', 'circumflex', 'perthousand', 'Scaron',
    'guilsinglleft', 'OE', 'bullet', 'Zcaron', 'bullet', 'bullet', 'quoteleft',
    'quoteright', 'quotedblleft', 'quotedblright', 'bullet', 'endash',
    'emdash', 'tilde', 'trademark', 'scaron', 'guilsinglright', 'oe', 'bullet',
    'zcaron', 'Ydieresis', 'space', 'exclamdown', 'cent', 'sterling',
    'currency', 'yen', 'brokenbar', 'section', 'dieresis', 'copyright',
    'ordfeminine', 'guillemotleft', 'logicalnot', 'hyphen', 'registered',
    'macron', 'degree', 'plusminus', 'twosuperior', 'threesuperior', 'acute',
    'mu', 'paragraph', 'periodcentered', 'cedilla', 'onesuperior',
    'ordmasculine', 'guillemotright', 'onequarter', 'onehalf', 'threequarters',
    'questiondown', 'Agrave', 'Aacute', 'Acircumflex', 'Atilde', 'Adieresis',
    'Aring', 'AE', 'Ccedilla', 'Egrave', 'Eacute', 'Ecircumflex', 'Edieresis',
    'Igrave', 'Iacute', 'Icircumflex', 'Idieresis', 'Eth', 'Ntilde', 'Ograve',
    'Oacute', 'Ocircumflex', 'Otilde', 'Odieresis', 'multiply', 'Oslash',
    'Ugrave', 'Uacute', 'Ucircumflex', 'Udieresis', 'Yacute', 'Thorn',
    'germandbls', 'agrave', 'aacute', 'acircumflex', 'atilde', 'adieresis',
    'aring', 'ae', 'ccedilla', 'egrave', 'eacute', 'ecircumflex', 'edieresis',
    'igrave', 'iacute', 'icircumflex', 'idieresis', 'eth', 'ntilde', 'ograve',
    'oacute', 'ocircumflex', 'otilde', 'odieresis', 'divide', 'oslash',
    'ugrave', 'uacute', 'ucircumflex', 'udieresis', 'yacute', 'thorn',
    'ydieresis'],
  SymbolSetEncoding: ['', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    'space', 'exclam', 'universal', 'numbersign', 'existential', 'percent',
    'ampersand', 'suchthat', 'parenleft', 'parenright', 'asteriskmath', 'plus',
    'comma', 'minus', 'period', 'slash', 'zero', 'one', 'two', 'three', 'four',
    'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon', 'less',
    'equal', 'greater', 'question', 'congruent', 'Alpha', 'Beta', 'Chi',
    'Delta', 'Epsilon', 'Phi', 'Gamma', 'Eta', 'Iota', 'theta1', 'Kappa',
    'Lambda', 'Mu', 'Nu', 'Omicron', 'Pi', 'Theta', 'Rho', 'Sigma', 'Tau',
    'Upsilon', 'sigma1', 'Omega', 'Xi', 'Psi', 'Zeta', 'bracketleft',
    'therefore', 'bracketright', 'perpendicular', 'underscore', 'radicalex',
    'alpha', 'beta', 'chi', 'delta', 'epsilon', 'phi', 'gamma', 'eta', 'iota',
    'phi1', 'kappa', 'lambda', 'mu', 'nu', 'omicron', 'pi', 'theta', 'rho',
    'sigma', 'tau', 'upsilon', 'omega1', 'omega', 'xi', 'psi', 'zeta',
    'braceleft', 'bar', 'braceright', 'similar', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', 'Euro', 'Upsilon1', 'minute', 'lessequal',
    'fraction', 'infinity', 'florin', 'club', 'diamond', 'heart', 'spade',
    'arrowboth', 'arrowleft', 'arrowup', 'arrowright', 'arrowdown', 'degree',
    'plusminus', 'second', 'greaterequal', 'multiply', 'proportional',
    'partialdiff', 'bullet', 'divide', 'notequal', 'equivalence',
    'approxequal', 'ellipsis', 'arrowvertex', 'arrowhorizex', 'carriagereturn',
    'aleph', 'Ifraktur', 'Rfraktur', 'weierstrass', 'circlemultiply',
    'circleplus', 'emptyset', 'intersection', 'union', 'propersuperset',
    'reflexsuperset', 'notsubset', 'propersubset', 'reflexsubset', 'element',
    'notelement', 'angle', 'gradient', 'registerserif', 'copyrightserif',
    'trademarkserif', 'product', 'radical', 'dotmath', 'logicalnot',
    'logicaland', 'logicalor', 'arrowdblboth', 'arrowdblleft', 'arrowdblup',
    'arrowdblright', 'arrowdbldown', 'lozenge', 'angleleft', 'registersans',
    'copyrightsans', 'trademarksans', 'summation', 'parenlefttp',
    'parenleftex', 'parenleftbt', 'bracketlefttp', 'bracketleftex',
    'bracketleftbt', 'bracelefttp', 'braceleftmid', 'braceleftbt', 'braceex',
    '', 'angleright', 'integral', 'integraltp', 'integralex', 'integralbt',
    'parenrighttp', 'parenrightex', 'parenrightbt', 'bracketrighttp',
    'bracketrightex', 'bracketrightbt', 'bracerighttp', 'bracerightmid',
    'bracerightbt'],
  ZapfDingbatsEncoding: ['', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    'space', 'a1', 'a2', 'a202', 'a3', 'a4', 'a5', 'a119', 'a118', 'a117',
    'a11', 'a12', 'a13', 'a14', 'a15', 'a16', 'a105', 'a17', 'a18', 'a19',
    'a20', 'a21', 'a22', 'a23', 'a24', 'a25', 'a26', 'a27', 'a28', 'a6', 'a7',
    'a8', 'a9', 'a10', 'a29', 'a30', 'a31', 'a32', 'a33', 'a34', 'a35', 'a36',
    'a37', 'a38', 'a39', 'a40', 'a41', 'a42', 'a43', 'a44', 'a45', 'a46',
    'a47', 'a48', 'a49', 'a50', 'a51', 'a52', 'a53', 'a54', 'a55', 'a56',
    'a57', 'a58', 'a59', 'a60', 'a61', 'a62', 'a63', 'a64', 'a65', 'a66',
    'a67', 'a68', 'a69', 'a70', 'a71', 'a72', 'a73', 'a74', 'a203', 'a75',
    'a204', 'a76', 'a77', 'a78', 'a79', 'a81', 'a82', 'a83', 'a84', 'a97',
    'a98', 'a99', 'a100', '', 'a89', 'a90', 'a93', 'a94', 'a91', 'a92', 'a205',
    'a85', 'a206', 'a86', 'a87', 'a88', 'a95', 'a96', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', 'a101', 'a102', 'a103',
    'a104', 'a106', 'a107', 'a108', 'a112', 'a111', 'a110', 'a109', 'a120',
    'a121', 'a122', 'a123', 'a124', 'a125', 'a126', 'a127', 'a128', 'a129',
    'a130', 'a131', 'a132', 'a133', 'a134', 'a135', 'a136', 'a137', 'a138',
    'a139', 'a140', 'a141', 'a142', 'a143', 'a144', 'a145', 'a146', 'a147',
    'a148', 'a149', 'a150', 'a151', 'a152', 'a153', 'a154', 'a155', 'a156',
    'a157', 'a158', 'a159', 'a160', 'a161', 'a163', 'a164', 'a196', 'a165',
    'a192', 'a166', 'a167', 'a168', 'a169', 'a170', 'a171', 'a172', 'a173',
    'a162', 'a174', 'a175', 'a176', 'a177', 'a178', 'a179', 'a193', 'a180',
    'a199', 'a181', 'a200', 'a182', '', 'a201', 'a183', 'a184', 'a197', 'a185',
    'a194', 'a198', 'a186', 'a195', 'a187', 'a188', 'a189', 'a190', 'a191']
};

/**
 * Hold a map of decoded fonts and of the standard fourteen Type1
 * fonts and their acronyms.
 */
var stdFontMap = {
  'ArialNarrow': 'Helvetica',
  'ArialNarrow-Bold': 'Helvetica-Bold',
  'ArialNarrow-BoldItalic': 'Helvetica-BoldOblique',
  'ArialNarrow-Italic': 'Helvetica-Oblique',
  'ArialBlack': 'Helvetica',
  'ArialBlack-Bold': 'Helvetica-Bold',
  'ArialBlack-BoldItalic': 'Helvetica-BoldOblique',
  'ArialBlack-Italic': 'Helvetica-Oblique',
  'Arial': 'Helvetica',
  'Arial-Bold': 'Helvetica-Bold',
  'Arial-BoldItalic': 'Helvetica-BoldOblique',
  'Arial-Italic': 'Helvetica-Oblique',
  'Arial-BoldItalicMT': 'Helvetica-BoldOblique',
  'Arial-BoldMT': 'Helvetica-Bold',
  'Arial-ItalicMT': 'Helvetica-Oblique',
  'ArialMT': 'Helvetica',
  'Courier-Bold': 'Courier-Bold',
  'Courier-BoldItalic': 'Courier-BoldOblique',
  'Courier-Italic': 'Courier-Oblique',
  'CourierNew': 'Courier',
  'CourierNew-Bold': 'Courier-Bold',
  'CourierNew-BoldItalic': 'Courier-BoldOblique',
  'CourierNew-Italic': 'Courier-Oblique',
  'CourierNewPS-BoldItalicMT': 'Courier-BoldOblique',
  'CourierNewPS-BoldMT': 'Courier-Bold',
  'CourierNewPS-ItalicMT': 'Courier-Oblique',
  'CourierNewPSMT': 'Courier',
  'Helvetica': 'Helvetica',
  'Helvetica-Bold': 'Helvetica-Bold',
  'Helvetica-BoldItalic': 'Helvetica-BoldOblique',
  'Helvetica-BoldOblique': 'Helvetica-BoldOblique',
  'Helvetica-Italic': 'Helvetica-Oblique',
  'Helvetica-Oblique':'Helvetica-Oblique',
  'Symbol-Bold': 'Symbol',
  'Symbol-BoldItalic': 'Symbol',
  'Symbol-Italic': 'Symbol',
  'TimesNewRoman': 'Times-Roman',
  'TimesNewRoman-Bold': 'Times-Bold',
  'TimesNewRoman-BoldItalic': 'Times-BoldItalic',
  'TimesNewRoman-Italic': 'Times-Italic',
  'TimesNewRomanPS': 'Times-Roman',
  'TimesNewRomanPS-Bold': 'Times-Bold',
  'TimesNewRomanPS-BoldItalic': 'Times-BoldItalic',
  'TimesNewRomanPS-BoldItalicMT': 'Times-BoldItalic',
  'TimesNewRomanPS-BoldMT': 'Times-Bold',
  'TimesNewRomanPS-Italic': 'Times-Italic',
  'TimesNewRomanPS-ItalicMT': 'Times-Italic',
  'TimesNewRomanPSMT': 'Times-Roman',
  'TimesNewRomanPSMT-Bold': 'Times-Bold',
  'TimesNewRomanPSMT-BoldItalic': 'Times-BoldItalic',
  'TimesNewRomanPSMT-Italic': 'Times-Italic'
};

/**
 * Holds the map of the non-standard fonts that might be included as a standard
 * fonts without glyph data.
 */
var nonStdFontMap = {
  'CenturyGothic': 'Helvetica',
  'CenturyGothic-Bold': 'Helvetica-Bold',
  'CenturyGothic-BoldItalic': 'Helvetica-BoldOblique',
  'CenturyGothic-Italic': 'Helvetica-Oblique',
  'ComicSansMS': 'Comic Sans MS',
  'ComicSansMS-Bold': 'Comic Sans MS-Bold',
  'ComicSansMS-BoldItalic': 'Comic Sans MS-BoldItalic',
  'ComicSansMS-Italic': 'Comic Sans MS-Italic',
  'LucidaConsole': 'Courier',
  'LucidaConsole-Bold': 'Courier-Bold',
  'LucidaConsole-BoldItalic': 'Courier-BoldOblique',
  'LucidaConsole-Italic': 'Courier-Oblique',
  'MS-Gothic': 'MS Gothic',
  'MS-Gothic-Bold': 'MS Gothic-Bold',
  'MS-Gothic-BoldItalic': 'MS Gothic-BoldItalic',
  'MS-Gothic-Italic': 'MS Gothic-Italic',
  'MS-Mincho': 'MS Mincho',
  'MS-Mincho-Bold': 'MS Mincho-Bold',
  'MS-Mincho-BoldItalic': 'MS Mincho-BoldItalic',
  'MS-Mincho-Italic': 'MS Mincho-Italic',
  'MS-PGothic': 'MS PGothic',
  'MS-PGothic-Bold': 'MS PGothic-Bold',
  'MS-PGothic-BoldItalic': 'MS PGothic-BoldItalic',
  'MS-PGothic-Italic': 'MS PGothic-Italic',
  'MS-PMincho': 'MS PMincho',
  'MS-PMincho-Bold': 'MS PMincho-Bold',
  'MS-PMincho-BoldItalic': 'MS PMincho-BoldItalic',
  'MS-PMincho-Italic': 'MS PMincho-Italic',
  'Wingdings': 'ZapfDingbats'
};

var serifFonts = {
  'Adobe Jenson': true, 'Adobe Text': true, 'Albertus': true,
  'Aldus': true, 'Alexandria': true, 'Algerian': true,
  'American Typewriter': true, 'Antiqua': true, 'Apex': true,
  'Arno': true, 'Aster': true, 'Aurora': true,
  'Baskerville': true, 'Bell': true, 'Bembo': true,
  'Bembo Schoolbook': true, 'Benguiat': true, 'Berkeley Old Style': true,
  'Bernhard Modern': true, 'Berthold City': true, 'Bodoni': true,
  'Bauer Bodoni': true, 'Book Antiqua': true, 'Bookman': true,
  'Bordeaux Roman': true, 'Californian FB': true, 'Calisto': true,
  'Calvert': true, 'Capitals': true, 'Cambria': true,
  'Cartier': true, 'Caslon': true, 'Catull': true,
  'Centaur': true, 'Century Old Style': true, 'Century Schoolbook': true,
  'Chaparral': true, 'Charis SIL': true, 'Cheltenham': true,
  'Cholla Slab': true, 'Clarendon': true, 'Clearface': true,
  'Cochin': true, 'Colonna': true, 'Computer Modern': true,
  'Concrete Roman': true, 'Constantia': true, 'Cooper Black': true,
  'Corona': true, 'Ecotype': true, 'Egyptienne': true,
  'Elephant': true, 'Excelsior': true, 'Fairfield': true,
  'FF Scala': true, 'Folkard': true, 'Footlight': true,
  'FreeSerif': true, 'Friz Quadrata': true, 'Garamond': true,
  'Gentium': true, 'Georgia': true, 'Gloucester': true,
  'Goudy Old Style': true, 'Goudy Schoolbook': true, 'Goudy Pro Font': true,
  'Granjon': true, 'Guardian Egyptian': true, 'Heather': true,
  'Hercules': true, 'High Tower Text': true, 'Hiroshige': true,
  'Hoefler Text': true, 'Humana Serif': true, 'Imprint': true,
  'Ionic No. 5': true, 'Janson': true, 'Joanna': true,
  'Korinna': true, 'Lexicon': true, 'Liberation Serif': true,
  'Linux Libertine': true, 'Literaturnaya': true, 'Lucida': true,
  'Lucida Bright': true, 'Melior': true, 'Memphis': true,
  'Miller': true, 'Minion': true, 'Modern': true,
  'Mona Lisa': true, 'Mrs Eaves': true, 'MS Serif': true,
  'Museo Slab': true, 'New York': true, 'Nimbus Roman': true,
  'NPS Rawlinson Roadway': true, 'Palatino': true, 'Perpetua': true,
  'Plantin': true, 'Plantin Schoolbook': true, 'Playbill': true,
  'Poor Richard': true, 'Rawlinson Roadway': true, 'Renault': true,
  'Requiem': true, 'Rockwell': true, 'Roman': true,
  'Rotis Serif': true, 'Sabon': true, 'Scala': true,
  'Seagull': true, 'Sistina': true, 'Souvenir': true,
  'STIX': true, 'Stone Informal': true, 'Stone Serif': true,
  'Sylfaen': true, 'Times': true, 'Trajan': true,
  'TrinitÃ©': true, 'Trump Mediaeval': true, 'Utopia': true,
  'Vale Type': true, 'Bitstream Vera': true, 'Vera Serif': true,
  'Versailles': true, 'Wanted': true, 'Weiss': true,
  'Wide Latin': true, 'Windsor': true, 'XITS': true
};

var symbolsFonts = {
  'Dingbats': true, 'Symbol': true, 'ZapfDingbats': true
};

// Glyph map for well-known standard fonts. Sometimes Ghostscript uses CID fonts
// but does not embed the CID to GID mapping. The mapping is incomplete for all
// glyphs, but common for some set of the standard fonts.
var GlyphMapForStandardFonts = {
  '2': 10, '3': 32, '4': 33, '5': 34, '6': 35, '7': 36, '8': 37, '9': 38,
  '10': 39, '11': 40, '12': 41, '13': 42, '14': 43, '15': 44, '16': 45,
  '17': 46, '18': 47, '19': 48, '20': 49, '21': 50, '22': 51, '23': 52,
  '24': 53, '25': 54, '26': 55, '27': 56, '28': 57, '29': 58, '30': 894,
  '31': 60, '32': 61, '33': 62, '34': 63, '35': 64, '36': 65, '37': 66,
  '38': 67, '39': 68, '40': 69, '41': 70, '42': 71, '43': 72, '44': 73,
  '45': 74, '46': 75, '47': 76, '48': 77, '49': 78, '50': 79, '51': 80,
  '52': 81, '53': 82, '54': 83, '55': 84, '56': 85, '57': 86, '58': 87,
  '59': 88, '60': 89, '61': 90, '62': 91, '63': 92, '64': 93, '65': 94,
  '66': 95, '67': 96, '68': 97, '69': 98, '70': 99, '71': 100, '72': 101,
  '73': 102, '74': 103, '75': 104, '76': 105, '77': 106, '78': 107, '79': 108,
  '80': 109, '81': 110, '82': 111, '83': 112, '84': 113, '85': 114, '86': 115,
  '87': 116, '88': 117, '89': 118, '90': 119, '91': 120, '92': 121, '93': 122,
  '94': 123, '95': 124, '96': 125, '97': 126, '98': 196, '99': 197, '100': 199,
  '101': 201, '102': 209, '103': 214, '104': 220, '105': 225, '106': 224,
  '107': 226, '108': 228, '109': 227, '110': 229, '111': 231, '112': 233,
  '113': 232, '114': 234, '115': 235, '116': 237, '117': 236, '118': 238,
  '119': 239, '120': 241, '121': 243, '122': 242, '123': 244, '124': 246,
  '125': 245, '126': 250, '127': 249, '128': 251, '129': 252, '130': 8224,
  '131': 176, '132': 162, '133': 163, '134': 167, '135': 8226, '136': 182,
  '137': 223, '138': 174, '139': 169, '140': 8482, '141': 180, '142': 168,
  '143': 8800, '144': 198, '145': 216, '146': 8734, '147': 177, '148': 8804,
  '149': 8805, '150': 165, '151': 181, '152': 8706, '153': 8721, '154': 8719,
  '156': 8747, '157': 170, '158': 186, '159': 8486, '160': 230, '161': 248,
  '162': 191, '163': 161, '164': 172, '165': 8730, '166': 402, '167': 8776,
  '168': 8710, '169': 171, '170': 187, '171': 8230, '210': 218, '223': 711,
  '224': 321, '225': 322, '227': 353, '229': 382, '234': 253, '252': 263,
  '253': 268, '254': 269, '258': 258, '260': 260, '261': 261, '265': 280,
  '266': 281, '268': 283, '269': 313, '275': 323, '276': 324, '278': 328,
  '284': 345, '285': 346, '286': 347, '292': 367, '295': 377, '296': 378,
  '298': 380, '305': 963,
  '306': 964, '307': 966, '308': 8215, '309': 8252, '310': 8319, '311': 8359,
  '312': 8592, '313': 8593, '337': 9552, '493': 1039, '494': 1040, '705': 1524,
  '706': 8362, '710': 64288, '711': 64298, '759': 1617, '761': 1776,
  '763': 1778, '775': 1652, '777': 1764, '778': 1780, '779': 1781, '780': 1782,
  '782': 771, '783': 64726, '786': 8363, '788': 8532, '790': 768, '791': 769,
  '792': 768, '795': 803, '797': 64336, '798': 64337, '799': 64342,
  '800': 64343, '801': 64344, '802': 64345, '803': 64362, '804': 64363,
  '805': 64364, '2424': 7821, '2425': 7822, '2426': 7823, '2427': 7824,
  '2428': 7825, '2429': 7826, '2430': 7827, '2433': 7682, '2678': 8045,
  '2679': 8046, '2830': 1552, '2838': 686, '2840': 751, '2842': 753,
  '2843': 754, '2844': 755, '2846': 757, '2856': 767, '2857': 848, '2858': 849,
  '2862': 853, '2863': 854, '2864': 855, '2865': 861, '2866': 862, '2906': 7460,
  '2908': 7462, '2909': 7463, '2910': 7464, '2912': 7466, '2913': 7467,
  '2914': 7468, '2916': 7470, '2917': 7471, '2918': 7472, '2920': 7474,
  '2921': 7475, '2922': 7476, '2924': 7478, '2925': 7479, '2926': 7480,
  '2928': 7482, '2929': 7483, '2930': 7484, '2932': 7486, '2933': 7487,
  '2934': 7488, '2936': 7490, '2937': 7491, '2938': 7492, '2940': 7494,
  '2941': 7495, '2942': 7496, '2944': 7498, '2946': 7500, '2948': 7502,
  '2950': 7504, '2951': 7505, '2952': 7506, '2954': 7508, '2955': 7509,
  '2956': 7510, '2958': 7512, '2959': 7513, '2960': 7514, '2962': 7516,
  '2963': 7517, '2964': 7518, '2966': 7520, '2967': 7521, '2968': 7522,
  '2970': 7524, '2971': 7525, '2972': 7526, '2974': 7528, '2975': 7529,
  '2976': 7530, '2978': 1537, '2979': 1538, '2980': 1539, '2982': 1549,
  '2983': 1551, '2984': 1552, '2986': 1554, '2987': 1555, '2988': 1556,
  '2990': 1623, '2991': 1624, '2995': 1775, '2999': 1791, '3002': 64290,
  '3003': 64291, '3004': 64292, '3006': 64294, '3007': 64295, '3008': 64296,
  '3011': 1900, '3014': 8223, '3015': 8244, '3017': 7532, '3018': 7533,
  '3019': 7534, '3075': 7590, '3076': 7591, '3079': 7594, '3080': 7595,
  '3083': 7598, '3084': 7599, '3087': 7602, '3088': 7603, '3091': 7606,
  '3092': 7607, '3095': 7610, '3096': 7611, '3099': 7614, '3100': 7615,
  '3103': 7618, '3104': 7619, '3107': 8337, '3108': 8338, '3116': 1884,
  '3119': 1885, '3120': 1885, '3123': 1886, '3124': 1886, '3127': 1887,
  '3128': 1887, '3131': 1888, '3132': 1888, '3135': 1889, '3136': 1889,
  '3139': 1890, '3140': 1890, '3143': 1891, '3144': 1891, '3147': 1892,
  '3148': 1892, '3153': 580, '3154': 581, '3157': 584, '3158': 585, '3161': 588,
  '3162': 589, '3165': 891, '3166': 892, '3169': 1274, '3170': 1275,
  '3173': 1278, '3174': 1279, '3181': 7622, '3182': 7623, '3282': 11799,
  '3316': 578, '3379': 42785, '3393': 1159, '3416': 8377
};

// Some characters, e.g. copyrightserif, are mapped to the private use area and
// might not be displayed using standard fonts. Mapping/hacking well-known chars
// to the similar equivalents in the normal characters range.
var SpecialPUASymbols = {
  '63721': 0x00A9, // copyrightsans (0xF8E9) => copyright
  '63193': 0x00A9, // copyrightserif (0xF6D9) => copyright
  '63720': 0x00AE, // registersans (0xF8E8) => registered
  '63194': 0x00AE, // registerserif (0xF6DA) => registered
  '63722': 0x2122, // trademarksans (0xF8EA) => trademark
  '63195': 0x2122, // trademarkserif (0xF6DB) => trademark
  '63729': 0x23A7, // bracelefttp (0xF8F1)
  '63730': 0x23A8, // braceleftmid (0xF8F2)
  '63731': 0x23A9, // braceleftbt (0xF8F3)
  '63740': 0x23AB, // bracerighttp (0xF8FC)
  '63741': 0x23AC, // bracerightmid (0xF8FD)
  '63742': 0x23AD, // bracerightbt (0xF8FE)
  '63726': 0x23A1, // bracketlefttp (0xF8EE)
  '63727': 0x23A2, // bracketleftex (0xF8EF)
  '63728': 0x23A3, // bracketleftbt (0xF8F0)
  '63737': 0x23A4, // bracketrighttp (0xF8F9)
  '63738': 0x23A5, // bracketrightex (0xF8FA)
  '63739': 0x23A6, // bracketrightbt (0xF8FB)
  '63723': 0x239B, // parenlefttp (0xF8EB)
  '63724': 0x239C, // parenleftex (0xF8EC)
  '63725': 0x239D, // parenleftbt (0xF8ED)
  '63734': 0x239E, // parenrighttp (0xF8F6)
  '63735': 0x239F, // parenrightex (0xF8F7)
  '63736': 0x23A0, // parenrightbt (0xF8F8)
};
function mapSpecialUnicodeValues(code) {
  if (code >= 0xFFF0 && code <= 0xFFFF) { // Specials unicode block.
    return 0;
  } else if (code >= 0xF600 && code <= 0xF8FF) {
    return (SpecialPUASymbols[code] || code);
  }
  return code;
}

var UnicodeRanges = [
  { 'begin': 0x0000, 'end': 0x007F }, // Basic Latin
  { 'begin': 0x0080, 'end': 0x00FF }, // Latin-1 Supplement
  { 'begin': 0x0100, 'end': 0x017F }, // Latin Extended-A
  { 'begin': 0x0180, 'end': 0x024F }, // Latin Extended-B
  { 'begin': 0x0250, 'end': 0x02AF }, // IPA Extensions
  { 'begin': 0x02B0, 'end': 0x02FF }, // Spacing Modifier Letters
  { 'begin': 0x0300, 'end': 0x036F }, // Combining Diacritical Marks
  { 'begin': 0x0370, 'end': 0x03FF }, // Greek and Coptic
  { 'begin': 0x2C80, 'end': 0x2CFF }, // Coptic
  { 'begin': 0x0400, 'end': 0x04FF }, // Cyrillic
  { 'begin': 0x0530, 'end': 0x058F }, // Armenian
  { 'begin': 0x0590, 'end': 0x05FF }, // Hebrew
  { 'begin': 0xA500, 'end': 0xA63F }, // Vai
  { 'begin': 0x0600, 'end': 0x06FF }, // Arabic
  { 'begin': 0x07C0, 'end': 0x07FF }, // NKo
  { 'begin': 0x0900, 'end': 0x097F }, // Devanagari
  { 'begin': 0x0980, 'end': 0x09FF }, // Bengali
  { 'begin': 0x0A00, 'end': 0x0A7F }, // Gurmukhi
  { 'begin': 0x0A80, 'end': 0x0AFF }, // Gujarati
  { 'begin': 0x0B00, 'end': 0x0B7F }, // Oriya
  { 'begin': 0x0B80, 'end': 0x0BFF }, // Tamil
  { 'begin': 0x0C00, 'end': 0x0C7F }, // Telugu
  { 'begin': 0x0C80, 'end': 0x0CFF }, // Kannada
  { 'begin': 0x0D00, 'end': 0x0D7F }, // Malayalam
  { 'begin': 0x0E00, 'end': 0x0E7F }, // Thai
  { 'begin': 0x0E80, 'end': 0x0EFF }, // Lao
  { 'begin': 0x10A0, 'end': 0x10FF }, // Georgian
  { 'begin': 0x1B00, 'end': 0x1B7F }, // Balinese
  { 'begin': 0x1100, 'end': 0x11FF }, // Hangul Jamo
  { 'begin': 0x1E00, 'end': 0x1EFF }, // Latin Extended Additional
  { 'begin': 0x1F00, 'end': 0x1FFF }, // Greek Extended
  { 'begin': 0x2000, 'end': 0x206F }, // General Punctuation
  { 'begin': 0x2070, 'end': 0x209F }, // Superscripts And Subscripts
  { 'begin': 0x20A0, 'end': 0x20CF }, // Currency Symbol
  { 'begin': 0x20D0, 'end': 0x20FF }, // Combining Diacritical Marks For Symbols
  { 'begin': 0x2100, 'end': 0x214F }, // Letterlike Symbols
  { 'begin': 0x2150, 'end': 0x218F }, // Number Forms
  { 'begin': 0x2190, 'end': 0x21FF }, // Arrows
  { 'begin': 0x2200, 'end': 0x22FF }, // Mathematical Operators
  { 'begin': 0x2300, 'end': 0x23FF }, // Miscellaneous Technical
  { 'begin': 0x2400, 'end': 0x243F }, // Control Pictures
  { 'begin': 0x2440, 'end': 0x245F }, // Optical Character Recognition
  { 'begin': 0x2460, 'end': 0x24FF }, // Enclosed Alphanumerics
  { 'begin': 0x2500, 'end': 0x257F }, // Box Drawing
  { 'begin': 0x2580, 'end': 0x259F }, // Block Elements
  { 'begin': 0x25A0, 'end': 0x25FF }, // Geometric Shapes
  { 'begin': 0x2600, 'end': 0x26FF }, // Miscellaneous Symbols
  { 'begin': 0x2700, 'end': 0x27BF }, // Dingbats
  { 'begin': 0x3000, 'end': 0x303F }, // CJK Symbols And Punctuation
  { 'begin': 0x3040, 'end': 0x309F }, // Hiragana
  { 'begin': 0x30A0, 'end': 0x30FF }, // Katakana
  { 'begin': 0x3100, 'end': 0x312F }, // Bopomofo
  { 'begin': 0x3130, 'end': 0x318F }, // Hangul Compatibility Jamo
  { 'begin': 0xA840, 'end': 0xA87F }, // Phags-pa
  { 'begin': 0x3200, 'end': 0x32FF }, // Enclosed CJK Letters And Months
  { 'begin': 0x3300, 'end': 0x33FF }, // CJK Compatibility
  { 'begin': 0xAC00, 'end': 0xD7AF }, // Hangul Syllables
  { 'begin': 0xD800, 'end': 0xDFFF }, // Non-Plane 0 *
  { 'begin': 0x10900, 'end': 0x1091F }, // Phoenicia
  { 'begin': 0x4E00, 'end': 0x9FFF }, // CJK Unified Ideographs
  { 'begin': 0xE000, 'end': 0xF8FF }, // Private Use Area (plane 0)
  { 'begin': 0x31C0, 'end': 0x31EF }, // CJK Strokes
  { 'begin': 0xFB00, 'end': 0xFB4F }, // Alphabetic Presentation Forms
  { 'begin': 0xFB50, 'end': 0xFDFF }, // Arabic Presentation Forms-A
  { 'begin': 0xFE20, 'end': 0xFE2F }, // Combining Half Marks
  { 'begin': 0xFE10, 'end': 0xFE1F }, // Vertical Forms
  { 'begin': 0xFE50, 'end': 0xFE6F }, // Small Form Variants
  { 'begin': 0xFE70, 'end': 0xFEFF }, // Arabic Presentation Forms-B
  { 'begin': 0xFF00, 'end': 0xFFEF }, // Halfwidth And Fullwidth Forms
  { 'begin': 0xFFF0, 'end': 0xFFFF }, // Specials
  { 'begin': 0x0F00, 'end': 0x0FFF }, // Tibetan
  { 'begin': 0x0700, 'end': 0x074F }, // Syriac
  { 'begin': 0x0780, 'end': 0x07BF }, // Thaana
  { 'begin': 0x0D80, 'end': 0x0DFF }, // Sinhala
  { 'begin': 0x1000, 'end': 0x109F }, // Myanmar
  { 'begin': 0x1200, 'end': 0x137F }, // Ethiopic
  { 'begin': 0x13A0, 'end': 0x13FF }, // Cherokee
  { 'begin': 0x1400, 'end': 0x167F }, // Unified Canadian Aboriginal Syllabics
  { 'begin': 0x1680, 'end': 0x169F }, // Ogham
  { 'begin': 0x16A0, 'end': 0x16FF }, // Runic
  { 'begin': 0x1780, 'end': 0x17FF }, // Khmer
  { 'begin': 0x1800, 'end': 0x18AF }, // Mongolian
  { 'begin': 0x2800, 'end': 0x28FF }, // Braille Patterns
  { 'begin': 0xA000, 'end': 0xA48F }, // Yi Syllables
  { 'begin': 0x1700, 'end': 0x171F }, // Tagalog
  { 'begin': 0x10300, 'end': 0x1032F }, // Old Italic
  { 'begin': 0x10330, 'end': 0x1034F }, // Gothic
  { 'begin': 0x10400, 'end': 0x1044F }, // Deseret
  { 'begin': 0x1D000, 'end': 0x1D0FF }, // Byzantine Musical Symbols
  { 'begin': 0x1D400, 'end': 0x1D7FF }, // Mathematical Alphanumeric Symbols
  { 'begin': 0xFF000, 'end': 0xFFFFD }, // Private Use (plane 15)
  { 'begin': 0xFE00, 'end': 0xFE0F }, // Variation Selectors
  { 'begin': 0xE0000, 'end': 0xE007F }, // Tags
  { 'begin': 0x1900, 'end': 0x194F }, // Limbu
  { 'begin': 0x1950, 'end': 0x197F }, // Tai Le
  { 'begin': 0x1980, 'end': 0x19DF }, // New Tai Lue
  { 'begin': 0x1A00, 'end': 0x1A1F }, // Buginese
  { 'begin': 0x2C00, 'end': 0x2C5F }, // Glagolitic
  { 'begin': 0x2D30, 'end': 0x2D7F }, // Tifinagh
  { 'begin': 0x4DC0, 'end': 0x4DFF }, // Yijing Hexagram Symbols
  { 'begin': 0xA800, 'end': 0xA82F }, // Syloti Nagri
  { 'begin': 0x10000, 'end': 0x1007F }, // Linear B Syllabary
  { 'begin': 0x10140, 'end': 0x1018F }, // Ancient Greek Numbers
  { 'begin': 0x10380, 'end': 0x1039F }, // Ugaritic
  { 'begin': 0x103A0, 'end': 0x103DF }, // Old Persian
  { 'begin': 0x10450, 'end': 0x1047F }, // Shavian
  { 'begin': 0x10480, 'end': 0x104AF }, // Osmanya
  { 'begin': 0x10800, 'end': 0x1083F }, // Cypriot Syllabary
  { 'begin': 0x10A00, 'end': 0x10A5F }, // Kharoshthi
  { 'begin': 0x1D300, 'end': 0x1D35F }, // Tai Xuan Jing Symbols
  { 'begin': 0x12000, 'end': 0x123FF }, // Cuneiform
  { 'begin': 0x1D360, 'end': 0x1D37F }, // Counting Rod Numerals
  { 'begin': 0x1B80, 'end': 0x1BBF }, // Sundanese
  { 'begin': 0x1C00, 'end': 0x1C4F }, // Lepcha
  { 'begin': 0x1C50, 'end': 0x1C7F }, // Ol Chiki
  { 'begin': 0xA880, 'end': 0xA8DF }, // Saurashtra
  { 'begin': 0xA900, 'end': 0xA92F }, // Kayah Li
  { 'begin': 0xA930, 'end': 0xA95F }, // Rejang
  { 'begin': 0xAA00, 'end': 0xAA5F }, // Cham
  { 'begin': 0x10190, 'end': 0x101CF }, // Ancient Symbols
  { 'begin': 0x101D0, 'end': 0x101FF }, // Phaistos Disc
  { 'begin': 0x102A0, 'end': 0x102DF }, // Carian
  { 'begin': 0x1F030, 'end': 0x1F09F }  // Domino Tiles
];

var MacStandardGlyphOrdering = [
  '.notdef', '.null', 'nonmarkingreturn', 'space', 'exclam', 'quotedbl',
  'numbersign', 'dollar', 'percent', 'ampersand', 'quotesingle', 'parenleft',
  'parenright', 'asterisk', 'plus', 'comma', 'hyphen', 'period', 'slash',
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight',
  'nine', 'colon', 'semicolon', 'less', 'equal', 'greater', 'question', 'at',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
  'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'bracketleft',
  'backslash', 'bracketright', 'asciicircum', 'underscore', 'grave', 'a', 'b',
  'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q',
  'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'braceleft', 'bar', 'braceright',
  'asciitilde', 'Adieresis', 'Aring', 'Ccedilla', 'Eacute', 'Ntilde',
  'Odieresis', 'Udieresis', 'aacute', 'agrave', 'acircumflex', 'adieresis',
  'atilde', 'aring', 'ccedilla', 'eacute', 'egrave', 'ecircumflex', 'edieresis',
  'iacute', 'igrave', 'icircumflex', 'idieresis', 'ntilde', 'oacute', 'ograve',
  'ocircumflex', 'odieresis', 'otilde', 'uacute', 'ugrave', 'ucircumflex',
  'udieresis', 'dagger', 'degree', 'cent', 'sterling', 'section', 'bullet',
  'paragraph', 'germandbls', 'registered', 'copyright', 'trademark', 'acute',
  'dieresis', 'notequal', 'AE', 'Oslash', 'infinity', 'plusminus', 'lessequal',
  'greaterequal', 'yen', 'mu', 'partialdiff', 'summation', 'product', 'pi',
  'integral', 'ordfeminine', 'ordmasculine', 'Omega', 'ae', 'oslash',
  'questiondown', 'exclamdown', 'logicalnot', 'radical', 'florin',
  'approxequal', 'Delta', 'guillemotleft', 'guillemotright', 'ellipsis',
  'nonbreakingspace', 'Agrave', 'Atilde', 'Otilde', 'OE', 'oe', 'endash',
  'emdash', 'quotedblleft', 'quotedblright', 'quoteleft', 'quoteright',
  'divide', 'lozenge', 'ydieresis', 'Ydieresis', 'fraction', 'currency',
  'guilsinglleft', 'guilsinglright', 'fi', 'fl', 'daggerdbl', 'periodcentered',
  'quotesinglbase', 'quotedblbase', 'perthousand', 'Acircumflex',
  'Ecircumflex', 'Aacute', 'Edieresis', 'Egrave', 'Iacute', 'Icircumflex',
  'Idieresis', 'Igrave', 'Oacute', 'Ocircumflex', 'apple', 'Ograve', 'Uacute',
  'Ucircumflex', 'Ugrave', 'dotlessi', 'circumflex', 'tilde', 'macron',
  'breve', 'dotaccent', 'ring', 'cedilla', 'hungarumlaut', 'ogonek', 'caron',
  'Lslash', 'lslash', 'Scaron', 'scaron', 'Zcaron', 'zcaron', 'brokenbar',
  'Eth', 'eth', 'Yacute', 'yacute', 'Thorn', 'thorn', 'minus', 'multiply',
  'onesuperior', 'twosuperior', 'threesuperior', 'onehalf', 'onequarter',
  'threequarters', 'franc', 'Gbreve', 'gbreve', 'Idotaccent', 'Scedilla',
  'scedilla', 'Cacute', 'cacute', 'Ccaron', 'ccaron', 'dcroat'];

function getUnicodeRangeFor(value) {
  for (var i = 0, ii = UnicodeRanges.length; i < ii; i++) {
    var range = UnicodeRanges[i];
    if (value >= range.begin && value < range.end) {
      return i;
    }
  }
  return -1;
}

function isRTLRangeFor(value) {
  var range = UnicodeRanges[13];
  if (value >= range.begin && value < range.end) {
    return true;
  }
  range = UnicodeRanges[11];
  if (value >= range.begin && value < range.end) {
    return true;
  }
  return false;
}

// The normalization table is obtained by filtering the Unicode characters
// database with <compat> entries.
var NormalizedUnicodes = {
  '\u00A8': '\u0020\u0308',
  '\u00AF': '\u0020\u0304',
  '\u00B4': '\u0020\u0301',
  '\u00B5': '\u03BC',
  '\u00B8': '\u0020\u0327',
  '\u0132': '\u0049\u004A',
  '\u0133': '\u0069\u006A',
  '\u013F': '\u004C\u00B7',
  '\u0140': '\u006C\u00B7',
  '\u0149': '\u02BC\u006E',
  '\u017F': '\u0073',
  '\u01C4': '\u0044\u017D',
  '\u01C5': '\u0044\u017E',
  '\u01C6': '\u0064\u017E',
  '\u01C7': '\u004C\u004A',
  '\u01C8': '\u004C\u006A',
  '\u01C9': '\u006C\u006A',
  '\u01CA': '\u004E\u004A',
  '\u01CB': '\u004E\u006A',
  '\u01CC': '\u006E\u006A',
  '\u01F1': '\u0044\u005A',
  '\u01F2': '\u0044\u007A',
  '\u01F3': '\u0064\u007A',
  '\u02D8': '\u0020\u0306',
  '\u02D9': '\u0020\u0307',
  '\u02DA': '\u0020\u030A',
  '\u02DB': '\u0020\u0328',
  '\u02DC': '\u0020\u0303',
  '\u02DD': '\u0020\u030B',
  '\u037A': '\u0020\u0345',
  '\u0384': '\u0020\u0301',
  '\u03D0': '\u03B2',
  '\u03D1': '\u03B8',
  '\u03D2': '\u03A5',
  '\u03D5': '\u03C6',
  '\u03D6': '\u03C0',
  '\u03F0': '\u03BA',
  '\u03F1': '\u03C1',
  '\u03F2': '\u03C2',
  '\u03F4': '\u0398',
  '\u03F5': '\u03B5',
  '\u03F9': '\u03A3',
  '\u0587': '\u0565\u0582',
  '\u0675': '\u0627\u0674',
  '\u0676': '\u0648\u0674',
  '\u0677': '\u06C7\u0674',
  '\u0678': '\u064A\u0674',
  '\u0E33': '\u0E4D\u0E32',
  '\u0EB3': '\u0ECD\u0EB2',
  '\u0EDC': '\u0EAB\u0E99',
  '\u0EDD': '\u0EAB\u0EA1',
  '\u0F77': '\u0FB2\u0F81',
  '\u0F79': '\u0FB3\u0F81',
  '\u1E9A': '\u0061\u02BE',
  '\u1FBD': '\u0020\u0313',
  '\u1FBF': '\u0020\u0313',
  '\u1FC0': '\u0020\u0342',
  '\u1FFE': '\u0020\u0314',
  '\u2002': '\u0020',
  '\u2003': '\u0020',
  '\u2004': '\u0020',
  '\u2005': '\u0020',
  '\u2006': '\u0020',
  '\u2008': '\u0020',
  '\u2009': '\u0020',
  '\u200A': '\u0020',
  '\u2017': '\u0020\u0333',
  '\u2024': '\u002E',
  '\u2025': '\u002E\u002E',
  '\u2026': '\u002E\u002E\u002E',
  '\u2033': '\u2032\u2032',
  '\u2034': '\u2032\u2032\u2032',
  '\u2036': '\u2035\u2035',
  '\u2037': '\u2035\u2035\u2035',
  '\u203C': '\u0021\u0021',
  '\u203E': '\u0020\u0305',
  '\u2047': '\u003F\u003F',
  '\u2048': '\u003F\u0021',
  '\u2049': '\u0021\u003F',
  '\u2057': '\u2032\u2032\u2032\u2032',
  '\u205F': '\u0020',
  '\u20A8': '\u0052\u0073',
  '\u2100': '\u0061\u002F\u0063',
  '\u2101': '\u0061\u002F\u0073',
  '\u2103': '\u00B0\u0043',
  '\u2105': '\u0063\u002F\u006F',
  '\u2106': '\u0063\u002F\u0075',
  '\u2107': '\u0190',
  '\u2109': '\u00B0\u0046',
  '\u2116': '\u004E\u006F',
  '\u2121': '\u0054\u0045\u004C',
  '\u2135': '\u05D0',
  '\u2136': '\u05D1',
  '\u2137': '\u05D2',
  '\u2138': '\u05D3',
  '\u213B': '\u0046\u0041\u0058',
  '\u2160': '\u0049',
  '\u2161': '\u0049\u0049',
  '\u2162': '\u0049\u0049\u0049',
  '\u2163': '\u0049\u0056',
  '\u2164': '\u0056',
  '\u2165': '\u0056\u0049',
  '\u2166': '\u0056\u0049\u0049',
  '\u2167': '\u0056\u0049\u0049\u0049',
  '\u2168': '\u0049\u0058',
  '\u2169': '\u0058',
  '\u216A': '\u0058\u0049',
  '\u216B': '\u0058\u0049\u0049',
  '\u216C': '\u004C',
  '\u216D': '\u0043',
  '\u216E': '\u0044',
  '\u216F': '\u004D',
  '\u2170': '\u0069',
  '\u2171': '\u0069\u0069',
  '\u2172': '\u0069\u0069\u0069',
  '\u2173': '\u0069\u0076',
  '\u2174': '\u0076',
  '\u2175': '\u0076\u0069',
  '\u2176': '\u0076\u0069\u0069',
  '\u2177': '\u0076\u0069\u0069\u0069',
  '\u2178': '\u0069\u0078',
  '\u2179': '\u0078',
  '\u217A': '\u0078\u0069',
  '\u217B': '\u0078\u0069\u0069',
  '\u217C': '\u006C',
  '\u217D': '\u0063',
  '\u217E': '\u0064',
  '\u217F': '\u006D',
  '\u222C': '\u222B\u222B',
  '\u222D': '\u222B\u222B\u222B',
  '\u222F': '\u222E\u222E',
  '\u2230': '\u222E\u222E\u222E',
  '\u2474': '\u0028\u0031\u0029',
  '\u2475': '\u0028\u0032\u0029',
  '\u2476': '\u0028\u0033\u0029',
  '\u2477': '\u0028\u0034\u0029',
  '\u2478': '\u0028\u0035\u0029',
  '\u2479': '\u0028\u0036\u0029',
  '\u247A': '\u0028\u0037\u0029',
  '\u247B': '\u0028\u0038\u0029',
  '\u247C': '\u0028\u0039\u0029',
  '\u247D': '\u0028\u0031\u0030\u0029',
  '\u247E': '\u0028\u0031\u0031\u0029',
  '\u247F': '\u0028\u0031\u0032\u0029',
  '\u2480': '\u0028\u0031\u0033\u0029',
  '\u2481': '\u0028\u0031\u0034\u0029',
  '\u2482': '\u0028\u0031\u0035\u0029',
  '\u2483': '\u0028\u0031\u0036\u0029',
  '\u2484': '\u0028\u0031\u0037\u0029',
  '\u2485': '\u0028\u0031\u0038\u0029',
  '\u2486': '\u0028\u0031\u0039\u0029',
  '\u2487': '\u0028\u0032\u0030\u0029',
  '\u2488': '\u0031\u002E',
  '\u2489': '\u0032\u002E',
  '\u248A': '\u0033\u002E',
  '\u248B': '\u0034\u002E',
  '\u248C': '\u0035\u002E',
  '\u248D': '\u0036\u002E',
  '\u248E': '\u0037\u002E',
  '\u248F': '\u0038\u002E',
  '\u2490': '\u0039\u002E',
  '\u2491': '\u0031\u0030\u002E',
  '\u2492': '\u0031\u0031\u002E',
  '\u2493': '\u0031\u0032\u002E',
  '\u2494': '\u0031\u0033\u002E',
  '\u2495': '\u0031\u0034\u002E',
  '\u2496': '\u0031\u0035\u002E',
  '\u2497': '\u0031\u0036\u002E',
  '\u2498': '\u0031\u0037\u002E',
  '\u2499': '\u0031\u0038\u002E',
  '\u249A': '\u0031\u0039\u002E',
  '\u249B': '\u0032\u0030\u002E',
  '\u249C': '\u0028\u0061\u0029',
  '\u249D': '\u0028\u0062\u0029',
  '\u249E': '\u0028\u0063\u0029',
  '\u249F': '\u0028\u0064\u0029',
  '\u24A0': '\u0028\u0065\u0029',
  '\u24A1': '\u0028\u0066\u0029',
  '\u24A2': '\u0028\u0067\u0029',
  '\u24A3': '\u0028\u0068\u0029',
  '\u24A4': '\u0028\u0069\u0029',
  '\u24A5': '\u0028\u006A\u0029',
  '\u24A6': '\u0028\u006B\u0029',
  '\u24A7': '\u0028\u006C\u0029',
  '\u24A8': '\u0028\u006D\u0029',
  '\u24A9': '\u0028\u006E\u0029',
  '\u24AA': '\u0028\u006F\u0029',
  '\u24AB': '\u0028\u0070\u0029',
  '\u24AC': '\u0028\u0071\u0029',
  '\u24AD': '\u0028\u0072\u0029',
  '\u24AE': '\u0028\u0073\u0029',
  '\u24AF': '\u0028\u0074\u0029',
  '\u24B0': '\u0028\u0075\u0029',
  '\u24B1': '\u0028\u0076\u0029',
  '\u24B2': '\u0028\u0077\u0029',
  '\u24B3': '\u0028\u0078\u0029',
  '\u24B4': '\u0028\u0079\u0029',
  '\u24B5': '\u0028\u007A\u0029',
  '\u2A0C': '\u222B\u222B\u222B\u222B',
  '\u2A74': '\u003A\u003A\u003D',
  '\u2A75': '\u003D\u003D',
  '\u2A76': '\u003D\u003D\u003D',
  '\u2E9F': '\u6BCD',
  '\u2EF3': '\u9F9F',
  '\u2F00': '\u4E00',
  '\u2F01': '\u4E28',
  '\u2F02': '\u4E36',
  '\u2F03': '\u4E3F',
  '\u2F04': '\u4E59',
  '\u2F05': '\u4E85',
  '\u2F06': '\u4E8C',
  '\u2F07': '\u4EA0',
  '\u2F08': '\u4EBA',
  '\u2F09': '\u513F',
  '\u2F0A': '\u5165',
  '\u2F0B': '\u516B',
  '\u2F0C': '\u5182',
  '\u2F0D': '\u5196',
  '\u2F0E': '\u51AB',
  '\u2F0F': '\u51E0',
  '\u2F10': '\u51F5',
  '\u2F11': '\u5200',
  '\u2F12': '\u529B',
  '\u2F13': '\u52F9',
  '\u2F14': '\u5315',
  '\u2F15': '\u531A',
  '\u2F16': '\u5338',
  '\u2F17': '\u5341',
  '\u2F18': '\u535C',
  '\u2F19': '\u5369',
  '\u2F1A': '\u5382',
  '\u2F1B': '\u53B6',
  '\u2F1C': '\u53C8',
  '\u2F1D': '\u53E3',
  '\u2F1E': '\u56D7',
  '\u2F1F': '\u571F',
  '\u2F20': '\u58EB',
  '\u2F21': '\u5902',
  '\u2F22': '\u590A',
  '\u2F23': '\u5915',
  '\u2F24': '\u5927',
  '\u2F25': '\u5973',
  '\u2F26': '\u5B50',
  '\u2F27': '\u5B80',
  '\u2F28': '\u5BF8',
  '\u2F29': '\u5C0F',
  '\u2F2A': '\u5C22',
  '\u2F2B': '\u5C38',
  '\u2F2C': '\u5C6E',
  '\u2F2D': '\u5C71',
  '\u2F2E': '\u5DDB',
  '\u2F2F': '\u5DE5',
  '\u2F30': '\u5DF1',
  '\u2F31': '\u5DFE',
  '\u2F32': '\u5E72',
  '\u2F33': '\u5E7A',
  '\u2F34': '\u5E7F',
  '\u2F35': '\u5EF4',
  '\u2F36': '\u5EFE',
  '\u2F37': '\u5F0B',
  '\u2F38': '\u5F13',
  '\u2F39': '\u5F50',
  '\u2F3A': '\u5F61',
  '\u2F3B': '\u5F73',
  '\u2F3C': '\u5FC3',
  '\u2F3D': '\u6208',
  '\u2F3E': '\u6236',
  '\u2F3F': '\u624B',
  '\u2F40': '\u652F',
  '\u2F41': '\u6534',
  '\u2F42': '\u6587',
  '\u2F43': '\u6597',
  '\u2F44': '\u65A4',
  '\u2F45': '\u65B9',
  '\u2F46': '\u65E0',
  '\u2F47': '\u65E5',
  '\u2F48': '\u66F0',
  '\u2F49': '\u6708',
  '\u2F4A': '\u6728',
  '\u2F4B': '\u6B20',
  '\u2F4C': '\u6B62',
  '\u2F4D': '\u6B79',
  '\u2F4E': '\u6BB3',
  '\u2F4F': '\u6BCB',
  '\u2F50': '\u6BD4',
  '\u2F51': '\u6BDB',
  '\u2F52': '\u6C0F',
  '\u2F53': '\u6C14',
  '\u2F54': '\u6C34',
  '\u2F55': '\u706B',
  '\u2F56': '\u722A',
  '\u2F57': '\u7236',
  '\u2F58': '\u723B',
  '\u2F59': '\u723F',
  '\u2F5A': '\u7247',
  '\u2F5B': '\u7259',
  '\u2F5C': '\u725B',
  '\u2F5D': '\u72AC',
  '\u2F5E': '\u7384',
  '\u2F5F': '\u7389',
  '\u2F60': '\u74DC',
  '\u2F61': '\u74E6',
  '\u2F62': '\u7518',
  '\u2F63': '\u751F',
  '\u2F64': '\u7528',
  '\u2F65': '\u7530',
  '\u2F66': '\u758B',
  '\u2F67': '\u7592',
  '\u2F68': '\u7676',
  '\u2F69': '\u767D',
  '\u2F6A': '\u76AE',
  '\u2F6B': '\u76BF',
  '\u2F6C': '\u76EE',
  '\u2F6D': '\u77DB',
  '\u2F6E': '\u77E2',
  '\u2F6F': '\u77F3',
  '\u2F70': '\u793A',
  '\u2F71': '\u79B8',
  '\u2F72': '\u79BE',
  '\u2F73': '\u7A74',
  '\u2F74': '\u7ACB',
  '\u2F75': '\u7AF9',
  '\u2F76': '\u7C73',
  '\u2F77': '\u7CF8',
  '\u2F78': '\u7F36',
  '\u2F79': '\u7F51',
  '\u2F7A': '\u7F8A',
  '\u2F7B': '\u7FBD',
  '\u2F7C': '\u8001',
  '\u2F7D': '\u800C',
  '\u2F7E': '\u8012',
  '\u2F7F': '\u8033',
  '\u2F80': '\u807F',
  '\u2F81': '\u8089',
  '\u2F82': '\u81E3',
  '\u2F83': '\u81EA',
  '\u2F84': '\u81F3',
  '\u2F85': '\u81FC',
  '\u2F86': '\u820C',
  '\u2F87': '\u821B',
  '\u2F88': '\u821F',
  '\u2F89': '\u826E',
  '\u2F8A': '\u8272',
  '\u2F8B': '\u8278',
  '\u2F8C': '\u864D',
  '\u2F8D': '\u866B',
  '\u2F8E': '\u8840',
  '\u2F8F': '\u884C',
  '\u2F90': '\u8863',
  '\u2F91': '\u897E',
  '\u2F92': '\u898B',
  '\u2F93': '\u89D2',
  '\u2F94': '\u8A00',
  '\u2F95': '\u8C37',
  '\u2F96': '\u8C46',
  '\u2F97': '\u8C55',
  '\u2F98': '\u8C78',
  '\u2F99': '\u8C9D',
  '\u2F9A': '\u8D64',
  '\u2F9B': '\u8D70',
  '\u2F9C': '\u8DB3',
  '\u2F9D': '\u8EAB',
  '\u2F9E': '\u8ECA',
  '\u2F9F': '\u8F9B',
  '\u2FA0': '\u8FB0',
  '\u2FA1': '\u8FB5',
  '\u2FA2': '\u9091',
  '\u2FA3': '\u9149',
  '\u2FA4': '\u91C6',
  '\u2FA5': '\u91CC',
  '\u2FA6': '\u91D1',
  '\u2FA7': '\u9577',
  '\u2FA8': '\u9580',
  '\u2FA9': '\u961C',
  '\u2FAA': '\u96B6',
  '\u2FAB': '\u96B9',
  '\u2FAC': '\u96E8',
  '\u2FAD': '\u9751',
  '\u2FAE': '\u975E',
  '\u2FAF': '\u9762',
  '\u2FB0': '\u9769',
  '\u2FB1': '\u97CB',
  '\u2FB2': '\u97ED',
  '\u2FB3': '\u97F3',
  '\u2FB4': '\u9801',
  '\u2FB5': '\u98A8',
  '\u2FB6': '\u98DB',
  '\u2FB7': '\u98DF',
  '\u2FB8': '\u9996',
  '\u2FB9': '\u9999',
  '\u2FBA': '\u99AC',
  '\u2FBB': '\u9AA8',
  '\u2FBC': '\u9AD8',
  '\u2FBD': '\u9ADF',
  '\u2FBE': '\u9B25',
  '\u2FBF': '\u9B2F',
  '\u2FC0': '\u9B32',
  '\u2FC1': '\u9B3C',
  '\u2FC2': '\u9B5A',
  '\u2FC3': '\u9CE5',
  '\u2FC4': '\u9E75',
  '\u2FC5': '\u9E7F',
  '\u2FC6': '\u9EA5',
  '\u2FC7': '\u9EBB',
  '\u2FC8': '\u9EC3',
  '\u2FC9': '\u9ECD',
  '\u2FCA': '\u9ED1',
  '\u2FCB': '\u9EF9',
  '\u2FCC': '\u9EFD',
  '\u2FCD': '\u9F0E',
  '\u2FCE': '\u9F13',
  '\u2FCF': '\u9F20',
  '\u2FD0': '\u9F3B',
  '\u2FD1': '\u9F4A',
  '\u2FD2': '\u9F52',
  '\u2FD3': '\u9F8D',
  '\u2FD4': '\u9F9C',
  '\u2FD5': '\u9FA0',
  '\u3036': '\u3012',
  '\u3038': '\u5341',
  '\u3039': '\u5344',
  '\u303A': '\u5345',
  '\u309B': '\u0020\u3099',
  '\u309C': '\u0020\u309A',
  '\u3131': '\u1100',
  '\u3132': '\u1101',
  '\u3133': '\u11AA',
  '\u3134': '\u1102',
  '\u3135': '\u11AC',
  '\u3136': '\u11AD',
  '\u3137': '\u1103',
  '\u3138': '\u1104',
  '\u3139': '\u1105',
  '\u313A': '\u11B0',
  '\u313B': '\u11B1',
  '\u313C': '\u11B2',
  '\u313D': '\u11B3',
  '\u313E': '\u11B4',
  '\u313F': '\u11B5',
  '\u3140': '\u111A',
  '\u3141': '\u1106',
  '\u3142': '\u1107',
  '\u3143': '\u1108',
  '\u3144': '\u1121',
  '\u3145': '\u1109',
  '\u3146': '\u110A',
  '\u3147': '\u110B',
  '\u3148': '\u110C',
  '\u3149': '\u110D',
  '\u314A': '\u110E',
  '\u314B': '\u110F',
  '\u314C': '\u1110',
  '\u314D': '\u1111',
  '\u314E': '\u1112',
  '\u314F': '\u1161',
  '\u3150': '\u1162',
  '\u3151': '\u1163',
  '\u3152': '\u1164',
  '\u3153': '\u1165',
  '\u3154': '\u1166',
  '\u3155': '\u1167',
  '\u3156': '\u1168',
  '\u3157': '\u1169',
  '\u3158': '\u116A',
  '\u3159': '\u116B',
  '\u315A': '\u116C',
  '\u315B': '\u116D',
  '\u315C': '\u116E',
  '\u315D': '\u116F',
  '\u315E': '\u1170',
  '\u315F': '\u1171',
  '\u3160': '\u1172',
  '\u3161': '\u1173',
  '\u3162': '\u1174',
  '\u3163': '\u1175',
  '\u3164': '\u1160',
  '\u3165': '\u1114',
  '\u3166': '\u1115',
  '\u3167': '\u11C7',
  '\u3168': '\u11C8',
  '\u3169': '\u11CC',
  '\u316A': '\u11CE',
  '\u316B': '\u11D3',
  '\u316C': '\u11D7',
  '\u316D': '\u11D9',
  '\u316E': '\u111C',
  '\u316F': '\u11DD',
  '\u3170': '\u11DF',
  '\u3171': '\u111D',
  '\u3172': '\u111E',
  '\u3173': '\u1120',
  '\u3174': '\u1122',
  '\u3175': '\u1123',
  '\u3176': '\u1127',
  '\u3177': '\u1129',
  '\u3178': '\u112B',
  '\u3179': '\u112C',
  '\u317A': '\u112D',
  '\u317B': '\u112E',
  '\u317C': '\u112F',
  '\u317D': '\u1132',
  '\u317E': '\u1136',
  '\u317F': '\u1140',
  '\u3180': '\u1147',
  '\u3181': '\u114C',
  '\u3182': '\u11F1',
  '\u3183': '\u11F2',
  '\u3184': '\u1157',
  '\u3185': '\u1158',
  '\u3186': '\u1159',
  '\u3187': '\u1184',
  '\u3188': '\u1185',
  '\u3189': '\u1188',
  '\u318A': '\u1191',
  '\u318B': '\u1192',
  '\u318C': '\u1194',
  '\u318D': '\u119E',
  '\u318E': '\u11A1',
  '\u3200': '\u0028\u1100\u0029',
  '\u3201': '\u0028\u1102\u0029',
  '\u3202': '\u0028\u1103\u0029',
  '\u3203': '\u0028\u1105\u0029',
  '\u3204': '\u0028\u1106\u0029',
  '\u3205': '\u0028\u1107\u0029',
  '\u3206': '\u0028\u1109\u0029',
  '\u3207': '\u0028\u110B\u0029',
  '\u3208': '\u0028\u110C\u0029',
  '\u3209': '\u0028\u110E\u0029',
  '\u320A': '\u0028\u110F\u0029',
  '\u320B': '\u0028\u1110\u0029',
  '\u320C': '\u0028\u1111\u0029',
  '\u320D': '\u0028\u1112\u0029',
  '\u320E': '\u0028\u1100\u1161\u0029',
  '\u320F': '\u0028\u1102\u1161\u0029',
  '\u3210': '\u0028\u1103\u1161\u0029',
  '\u3211': '\u0028\u1105\u1161\u0029',
  '\u3212': '\u0028\u1106\u1161\u0029',
  '\u3213': '\u0028\u1107\u1161\u0029',
  '\u3214': '\u0028\u1109\u1161\u0029',
  '\u3215': '\u0028\u110B\u1161\u0029',
  '\u3216': '\u0028\u110C\u1161\u0029',
  '\u3217': '\u0028\u110E\u1161\u0029',
  '\u3218': '\u0028\u110F\u1161\u0029',
  '\u3219': '\u0028\u1110\u1161\u0029',
  '\u321A': '\u0028\u1111\u1161\u0029',
  '\u321B': '\u0028\u1112\u1161\u0029',
  '\u321C': '\u0028\u110C\u116E\u0029',
  '\u321D': '\u0028\u110B\u1169\u110C\u1165\u11AB\u0029',
  '\u321E': '\u0028\u110B\u1169\u1112\u116E\u0029',
  '\u3220': '\u0028\u4E00\u0029',
  '\u3221': '\u0028\u4E8C\u0029',
  '\u3222': '\u0028\u4E09\u0029',
  '\u3223': '\u0028\u56DB\u0029',
  '\u3224': '\u0028\u4E94\u0029',
  '\u3225': '\u0028\u516D\u0029',
  '\u3226': '\u0028\u4E03\u0029',
  '\u3227': '\u0028\u516B\u0029',
  '\u3228': '\u0028\u4E5D\u0029',
  '\u3229': '\u0028\u5341\u0029',
  '\u322A': '\u0028\u6708\u0029',
  '\u322B': '\u0028\u706B\u0029',
  '\u322C': '\u0028\u6C34\u0029',
  '\u322D': '\u0028\u6728\u0029',
  '\u322E': '\u0028\u91D1\u0029',
  '\u322F': '\u0028\u571F\u0029',
  '\u3230': '\u0028\u65E5\u0029',
  '\u3231': '\u0028\u682A\u0029',
  '\u3232': '\u0028\u6709\u0029',
  '\u3233': '\u0028\u793E\u0029',
  '\u3234': '\u0028\u540D\u0029',
  '\u3235': '\u0028\u7279\u0029',
  '\u3236': '\u0028\u8CA1\u0029',
  '\u3237': '\u0028\u795D\u0029',
  '\u3238': '\u0028\u52B4\u0029',
  '\u3239': '\u0028\u4EE3\u0029',
  '\u323A': '\u0028\u547C\u0029',
  '\u323B': '\u0028\u5B66\u0029',
  '\u323C': '\u0028\u76E3\u0029',
  '\u323D': '\u0028\u4F01\u0029',
  '\u323E': '\u0028\u8CC7\u0029',
  '\u323F': '\u0028\u5354\u0029',
  '\u3240': '\u0028\u796D\u0029',
  '\u3241': '\u0028\u4F11\u0029',
  '\u3242': '\u0028\u81EA\u0029',
  '\u3243': '\u0028\u81F3\u0029',
  '\u32C0': '\u0031\u6708',
  '\u32C1': '\u0032\u6708',
  '\u32C2': '\u0033\u6708',
  '\u32C3': '\u0034\u6708',
  '\u32C4': '\u0035\u6708',
  '\u32C5': '\u0036\u6708',
  '\u32C6': '\u0037\u6708',
  '\u32C7': '\u0038\u6708',
  '\u32C8': '\u0039\u6708',
  '\u32C9': '\u0031\u0030\u6708',
  '\u32CA': '\u0031\u0031\u6708',
  '\u32CB': '\u0031\u0032\u6708',
  '\u3358': '\u0030\u70B9',
  '\u3359': '\u0031\u70B9',
  '\u335A': '\u0032\u70B9',
  '\u335B': '\u0033\u70B9',
  '\u335C': '\u0034\u70B9',
  '\u335D': '\u0035\u70B9',
  '\u335E': '\u0036\u70B9',
  '\u335F': '\u0037\u70B9',
  '\u3360': '\u0038\u70B9',
  '\u3361': '\u0039\u70B9',
  '\u3362': '\u0031\u0030\u70B9',
  '\u3363': '\u0031\u0031\u70B9',
  '\u3364': '\u0031\u0032\u70B9',
  '\u3365': '\u0031\u0033\u70B9',
  '\u3366': '\u0031\u0034\u70B9',
  '\u3367': '\u0031\u0035\u70B9',
  '\u3368': '\u0031\u0036\u70B9',
  '\u3369': '\u0031\u0037\u70B9',
  '\u336A': '\u0031\u0038\u70B9',
  '\u336B': '\u0031\u0039\u70B9',
  '\u336C': '\u0032\u0030\u70B9',
  '\u336D': '\u0032\u0031\u70B9',
  '\u336E': '\u0032\u0032\u70B9',
  '\u336F': '\u0032\u0033\u70B9',
  '\u3370': '\u0032\u0034\u70B9',
  '\u33E0': '\u0031\u65E5',
  '\u33E1': '\u0032\u65E5',
  '\u33E2': '\u0033\u65E5',
  '\u33E3': '\u0034\u65E5',
  '\u33E4': '\u0035\u65E5',
  '\u33E5': '\u0036\u65E5',
  '\u33E6': '\u0037\u65E5',
  '\u33E7': '\u0038\u65E5',
  '\u33E8': '\u0039\u65E5',
  '\u33E9': '\u0031\u0030\u65E5',
  '\u33EA': '\u0031\u0031\u65E5',
  '\u33EB': '\u0031\u0032\u65E5',
  '\u33EC': '\u0031\u0033\u65E5',
  '\u33ED': '\u0031\u0034\u65E5',
  '\u33EE': '\u0031\u0035\u65E5',
  '\u33EF': '\u0031\u0036\u65E5',
  '\u33F0': '\u0031\u0037\u65E5',
  '\u33F1': '\u0031\u0038\u65E5',
  '\u33F2': '\u0031\u0039\u65E5',
  '\u33F3': '\u0032\u0030\u65E5',
  '\u33F4': '\u0032\u0031\u65E5',
  '\u33F5': '\u0032\u0032\u65E5',
  '\u33F6': '\u0032\u0033\u65E5',
  '\u33F7': '\u0032\u0034\u65E5',
  '\u33F8': '\u0032\u0035\u65E5',
  '\u33F9': '\u0032\u0036\u65E5',
  '\u33FA': '\u0032\u0037\u65E5',
  '\u33FB': '\u0032\u0038\u65E5',
  '\u33FC': '\u0032\u0039\u65E5',
  '\u33FD': '\u0033\u0030\u65E5',
  '\u33FE': '\u0033\u0031\u65E5',
  '\uFB00': '\u0066\u0066',
  '\uFB01': '\u0066\u0069',
  '\uFB02': '\u0066\u006C',
  '\uFB03': '\u0066\u0066\u0069',
  '\uFB04': '\u0066\u0066\u006C',
  '\uFB05': '\u017F\u0074',
  '\uFB06': '\u0073\u0074',
  '\uFB13': '\u0574\u0576',
  '\uFB14': '\u0574\u0565',
  '\uFB15': '\u0574\u056B',
  '\uFB16': '\u057E\u0576',
  '\uFB17': '\u0574\u056D',
  '\uFB4F': '\u05D0\u05DC',
  '\uFB50': '\u0671',
  '\uFB51': '\u0671',
  '\uFB52': '\u067B',
  '\uFB53': '\u067B',
  '\uFB54': '\u067B',
  '\uFB55': '\u067B',
  '\uFB56': '\u067E',
  '\uFB57': '\u067E',
  '\uFB58': '\u067E',
  '\uFB59': '\u067E',
  '\uFB5A': '\u0680',
  '\uFB5B': '\u0680',
  '\uFB5C': '\u0680',
  '\uFB5D': '\u0680',
  '\uFB5E': '\u067A',
  '\uFB5F': '\u067A',
  '\uFB60': '\u067A',
  '\uFB61': '\u067A',
  '\uFB62': '\u067F',
  '\uFB63': '\u067F',
  '\uFB64': '\u067F',
  '\uFB65': '\u067F',
  '\uFB66': '\u0679',
  '\uFB67': '\u0679',
  '\uFB68': '\u0679',
  '\uFB69': '\u0679',
  '\uFB6A': '\u06A4',
  '\uFB6B': '\u06A4',
  '\uFB6C': '\u06A4',
  '\uFB6D': '\u06A4',
  '\uFB6E': '\u06A6',
  '\uFB6F': '\u06A6',
  '\uFB70': '\u06A6',
  '\uFB71': '\u06A6',
  '\uFB72': '\u0684',
  '\uFB73': '\u0684',
  '\uFB74': '\u0684',
  '\uFB75': '\u0684',
  '\uFB76': '\u0683',
  '\uFB77': '\u0683',
  '\uFB78': '\u0683',
  '\uFB79': '\u0683',
  '\uFB7A': '\u0686',
  '\uFB7B': '\u0686',
  '\uFB7C': '\u0686',
  '\uFB7D': '\u0686',
  '\uFB7E': '\u0687',
  '\uFB7F': '\u0687',
  '\uFB80': '\u0687',
  '\uFB81': '\u0687',
  '\uFB82': '\u068D',
  '\uFB83': '\u068D',
  '\uFB84': '\u068C',
  '\uFB85': '\u068C',
  '\uFB86': '\u068E',
  '\uFB87': '\u068E',
  '\uFB88': '\u0688',
  '\uFB89': '\u0688',
  '\uFB8A': '\u0698',
  '\uFB8B': '\u0698',
  '\uFB8C': '\u0691',
  '\uFB8D': '\u0691',
  '\uFB8E': '\u06A9',
  '\uFB8F': '\u06A9',
  '\uFB90': '\u06A9',
  '\uFB91': '\u06A9',
  '\uFB92': '\u06AF',
  '\uFB93': '\u06AF',
  '\uFB94': '\u06AF',
  '\uFB95': '\u06AF',
  '\uFB96': '\u06B3',
  '\uFB97': '\u06B3',
  '\uFB98': '\u06B3',
  '\uFB99': '\u06B3',
  '\uFB9A': '\u06B1',
  '\uFB9B': '\u06B1',
  '\uFB9C': '\u06B1',
  '\uFB9D': '\u06B1',
  '\uFB9E': '\u06BA',
  '\uFB9F': '\u06BA',
  '\uFBA0': '\u06BB',
  '\uFBA1': '\u06BB',
  '\uFBA2': '\u06BB',
  '\uFBA3': '\u06BB',
  '\uFBA4': '\u06C0',
  '\uFBA5': '\u06C0',
  '\uFBA6': '\u06C1',
  '\uFBA7': '\u06C1',
  '\uFBA8': '\u06C1',
  '\uFBA9': '\u06C1',
  '\uFBAA': '\u06BE',
  '\uFBAB': '\u06BE',
  '\uFBAC': '\u06BE',
  '\uFBAD': '\u06BE',
  '\uFBAE': '\u06D2',
  '\uFBAF': '\u06D2',
  '\uFBB0': '\u06D3',
  '\uFBB1': '\u06D3',
  '\uFBD3': '\u06AD',
  '\uFBD4': '\u06AD',
  '\uFBD5': '\u06AD',
  '\uFBD6': '\u06AD',
  '\uFBD7': '\u06C7',
  '\uFBD8': '\u06C7',
  '\uFBD9': '\u06C6',
  '\uFBDA': '\u06C6',
  '\uFBDB': '\u06C8',
  '\uFBDC': '\u06C8',
  '\uFBDD': '\u0677',
  '\uFBDE': '\u06CB',
  '\uFBDF': '\u06CB',
  '\uFBE0': '\u06C5',
  '\uFBE1': '\u06C5',
  '\uFBE2': '\u06C9',
  '\uFBE3': '\u06C9',
  '\uFBE4': '\u06D0',
  '\uFBE5': '\u06D0',
  '\uFBE6': '\u06D0',
  '\uFBE7': '\u06D0',
  '\uFBE8': '\u0649',
  '\uFBE9': '\u0649',
  '\uFBEA': '\u0626\u0627',
  '\uFBEB': '\u0626\u0627',
  '\uFBEC': '\u0626\u06D5',
  '\uFBED': '\u0626\u06D5',
  '\uFBEE': '\u0626\u0648',
  '\uFBEF': '\u0626\u0648',
  '\uFBF0': '\u0626\u06C7',
  '\uFBF1': '\u0626\u06C7',
  '\uFBF2': '\u0626\u06C6',
  '\uFBF3': '\u0626\u06C6',
  '\uFBF4': '\u0626\u06C8',
  '\uFBF5': '\u0626\u06C8',
  '\uFBF6': '\u0626\u06D0',
  '\uFBF7': '\u0626\u06D0',
  '\uFBF8': '\u0626\u06D0',
  '\uFBF9': '\u0626\u0649',
  '\uFBFA': '\u0626\u0649',
  '\uFBFB': '\u0626\u0649',
  '\uFBFC': '\u06CC',
  '\uFBFD': '\u06CC',
  '\uFBFE': '\u06CC',
  '\uFBFF': '\u06CC',
  '\uFC00': '\u0626\u062C',
  '\uFC01': '\u0626\u062D',
  '\uFC02': '\u0626\u0645',
  '\uFC03': '\u0626\u0649',
  '\uFC04': '\u0626\u064A',
  '\uFC05': '\u0628\u062C',
  '\uFC06': '\u0628\u062D',
  '\uFC07': '\u0628\u062E',
  '\uFC08': '\u0628\u0645',
  '\uFC09': '\u0628\u0649',
  '\uFC0A': '\u0628\u064A',
  '\uFC0B': '\u062A\u062C',
  '\uFC0C': '\u062A\u062D',
  '\uFC0D': '\u062A\u062E',
  '\uFC0E': '\u062A\u0645',
  '\uFC0F': '\u062A\u0649',
  '\uFC10': '\u062A\u064A',
  '\uFC11': '\u062B\u062C',
  '\uFC12': '\u062B\u0645',
  '\uFC13': '\u062B\u0649',
  '\uFC14': '\u062B\u064A',
  '\uFC15': '\u062C\u062D',
  '\uFC16': '\u062C\u0645',
  '\uFC17': '\u062D\u062C',
  '\uFC18': '\u062D\u0645',
  '\uFC19': '\u062E\u062C',
  '\uFC1A': '\u062E\u062D',
  '\uFC1B': '\u062E\u0645',
  '\uFC1C': '\u0633\u062C',
  '\uFC1D': '\u0633\u062D',
  '\uFC1E': '\u0633\u062E',
  '\uFC1F': '\u0633\u0645',
  '\uFC20': '\u0635\u062D',
  '\uFC21': '\u0635\u0645',
  '\uFC22': '\u0636\u062C',
  '\uFC23': '\u0636\u062D',
  '\uFC24': '\u0636\u062E',
  '\uFC25': '\u0636\u0645',
  '\uFC26': '\u0637\u062D',
  '\uFC27': '\u0637\u0645',
  '\uFC28': '\u0638\u0645',
  '\uFC29': '\u0639\u062C',
  '\uFC2A': '\u0639\u0645',
  '\uFC2B': '\u063A\u062C',
  '\uFC2C': '\u063A\u0645',
  '\uFC2D': '\u0641\u062C',
  '\uFC2E': '\u0641\u062D',
  '\uFC2F': '\u0641\u062E',
  '\uFC30': '\u0641\u0645',
  '\uFC31': '\u0641\u0649',
  '\uFC32': '\u0641\u064A',
  '\uFC33': '\u0642\u062D',
  '\uFC34': '\u0642\u0645',
  '\uFC35': '\u0642\u0649',
  '\uFC36': '\u0642\u064A',
  '\uFC37': '\u0643\u0627',
  '\uFC38': '\u0643\u062C',
  '\uFC39': '\u0643\u062D',
  '\uFC3A': '\u0643\u062E',
  '\uFC3B': '\u0643\u0644',
  '\uFC3C': '\u0643\u0645',
  '\uFC3D': '\u0643\u0649',
  '\uFC3E': '\u0643\u064A',
  '\uFC3F': '\u0644\u062C',
  '\uFC40': '\u0644\u062D',
  '\uFC41': '\u0644\u062E',
  '\uFC42': '\u0644\u0645',
  '\uFC43': '\u0644\u0649',
  '\uFC44': '\u0644\u064A',
  '\uFC45': '\u0645\u062C',
  '\uFC46': '\u0645\u062D',
  '\uFC47': '\u0645\u062E',
  '\uFC48': '\u0645\u0645',
  '\uFC49': '\u0645\u0649',
  '\uFC4A': '\u0645\u064A',
  '\uFC4B': '\u0646\u062C',
  '\uFC4C': '\u0646\u062D',
  '\uFC4D': '\u0646\u062E',
  '\uFC4E': '\u0646\u0645',
  '\uFC4F': '\u0646\u0649',
  '\uFC50': '\u0646\u064A',
  '\uFC51': '\u0647\u062C',
  '\uFC52': '\u0647\u0645',
  '\uFC53': '\u0647\u0649',
  '\uFC54': '\u0647\u064A',
  '\uFC55': '\u064A\u062C',
  '\uFC56': '\u064A\u062D',
  '\uFC57': '\u064A\u062E',
  '\uFC58': '\u064A\u0645',
  '\uFC59': '\u064A\u0649',
  '\uFC5A': '\u064A\u064A',
  '\uFC5B': '\u0630\u0670',
  '\uFC5C': '\u0631\u0670',
  '\uFC5D': '\u0649\u0670',
  '\uFC5E': '\u0020\u064C\u0651',
  '\uFC5F': '\u0020\u064D\u0651',
  '\uFC60': '\u0020\u064E\u0651',
  '\uFC61': '\u0020\u064F\u0651',
  '\uFC62': '\u0020\u0650\u0651',
  '\uFC63': '\u0020\u0651\u0670',
  '\uFC64': '\u0626\u0631',
  '\uFC65': '\u0626\u0632',
  '\uFC66': '\u0626\u0645',
  '\uFC67': '\u0626\u0646',
  '\uFC68': '\u0626\u0649',
  '\uFC69': '\u0626\u064A',
  '\uFC6A': '\u0628\u0631',
  '\uFC6B': '\u0628\u0632',
  '\uFC6C': '\u0628\u0645',
  '\uFC6D': '\u0628\u0646',
  '\uFC6E': '\u0628\u0649',
  '\uFC6F': '\u0628\u064A',
  '\uFC70': '\u062A\u0631',
  '\uFC71': '\u062A\u0632',
  '\uFC72': '\u062A\u0645',
  '\uFC73': '\u062A\u0646',
  '\uFC74': '\u062A\u0649',
  '\uFC75': '\u062A\u064A',
  '\uFC76': '\u062B\u0631',
  '\uFC77': '\u062B\u0632',
  '\uFC78': '\u062B\u0645',
  '\uFC79': '\u062B\u0646',
  '\uFC7A': '\u062B\u0649',
  '\uFC7B': '\u062B\u064A',
  '\uFC7C': '\u0641\u0649',
  '\uFC7D': '\u0641\u064A',
  '\uFC7E': '\u0642\u0649',
  '\uFC7F': '\u0642\u064A',
  '\uFC80': '\u0643\u0627',
  '\uFC81': '\u0643\u0644',
  '\uFC82': '\u0643\u0645',
  '\uFC83': '\u0643\u0649',
  '\uFC84': '\u0643\u064A',
  '\uFC85': '\u0644\u0645',
  '\uFC86': '\u0644\u0649',
  '\uFC87': '\u0644\u064A',
  '\uFC88': '\u0645\u0627',
  '\uFC89': '\u0645\u0645',
  '\uFC8A': '\u0646\u0631',
  '\uFC8B': '\u0646\u0632',
  '\uFC8C': '\u0646\u0645',
  '\uFC8D': '\u0646\u0646',
  '\uFC8E': '\u0646\u0649',
  '\uFC8F': '\u0646\u064A',
  '\uFC90': '\u0649\u0670',
  '\uFC91': '\u064A\u0631',
  '\uFC92': '\u064A\u0632',
  '\uFC93': '\u064A\u0645',
  '\uFC94': '\u064A\u0646',
  '\uFC95': '\u064A\u0649',
  '\uFC96': '\u064A\u064A',
  '\uFC97': '\u0626\u062C',
  '\uFC98': '\u0626\u062D',
  '\uFC99': '\u0626\u062E',
  '\uFC9A': '\u0626\u0645',
  '\uFC9B': '\u0626\u0647',
  '\uFC9C': '\u0628\u062C',
  '\uFC9D': '\u0628\u062D',
  '\uFC9E': '\u0628\u062E',
  '\uFC9F': '\u0628\u0645',
  '\uFCA0': '\u0628\u0647',
  '\uFCA1': '\u062A\u062C',
  '\uFCA2': '\u062A\u062D',
  '\uFCA3': '\u062A\u062E',
  '\uFCA4': '\u062A\u0645',
  '\uFCA5': '\u062A\u0647',
  '\uFCA6': '\u062B\u0645',
  '\uFCA7': '\u062C\u062D',
  '\uFCA8': '\u062C\u0645',
  '\uFCA9': '\u062D\u062C',
  '\uFCAA': '\u062D\u0645',
  '\uFCAB': '\u062E\u062C',
  '\uFCAC': '\u062E\u0645',
  '\uFCAD': '\u0633\u062C',
  '\uFCAE': '\u0633\u062D',
  '\uFCAF': '\u0633\u062E',
  '\uFCB0': '\u0633\u0645',
  '\uFCB1': '\u0635\u062D',
  '\uFCB2': '\u0635\u062E',
  '\uFCB3': '\u0635\u0645',
  '\uFCB4': '\u0636\u062C',
  '\uFCB5': '\u0636\u062D',
  '\uFCB6': '\u0636\u062E',
  '\uFCB7': '\u0636\u0645',
  '\uFCB8': '\u0637\u062D',
  '\uFCB9': '\u0638\u0645',
  '\uFCBA': '\u0639\u062C',
  '\uFCBB': '\u0639\u0645',
  '\uFCBC': '\u063A\u062C',
  '\uFCBD': '\u063A\u0645',
  '\uFCBE': '\u0641\u062C',
  '\uFCBF': '\u0641\u062D',
  '\uFCC0': '\u0641\u062E',
  '\uFCC1': '\u0641\u0645',
  '\uFCC2': '\u0642\u062D',
  '\uFCC3': '\u0642\u0645',
  '\uFCC4': '\u0643\u062C',
  '\uFCC5': '\u0643\u062D',
  '\uFCC6': '\u0643\u062E',
  '\uFCC7': '\u0643\u0644',
  '\uFCC8': '\u0643\u0645',
  '\uFCC9': '\u0644\u062C',
  '\uFCCA': '\u0644\u062D',
  '\uFCCB': '\u0644\u062E',
  '\uFCCC': '\u0644\u0645',
  '\uFCCD': '\u0644\u0647',
  '\uFCCE': '\u0645\u062C',
  '\uFCCF': '\u0645\u062D',
  '\uFCD0': '\u0645\u062E',
  '\uFCD1': '\u0645\u0645',
  '\uFCD2': '\u0646\u062C',
  '\uFCD3': '\u0646\u062D',
  '\uFCD4': '\u0646\u062E',
  '\uFCD5': '\u0646\u0645',
  '\uFCD6': '\u0646\u0647',
  '\uFCD7': '\u0647\u062C',
  '\uFCD8': '\u0647\u0645',
  '\uFCD9': '\u0647\u0670',
  '\uFCDA': '\u064A\u062C',
  '\uFCDB': '\u064A\u062D',
  '\uFCDC': '\u064A\u062E',
  '\uFCDD': '\u064A\u0645',
  '\uFCDE': '\u064A\u0647',
  '\uFCDF': '\u0626\u0645',
  '\uFCE0': '\u0626\u0647',
  '\uFCE1': '\u0628\u0645',
  '\uFCE2': '\u0628\u0647',
  '\uFCE3': '\u062A\u0645',
  '\uFCE4': '\u062A\u0647',
  '\uFCE5': '\u062B\u0645',
  '\uFCE6': '\u062B\u0647',
  '\uFCE7': '\u0633\u0645',
  '\uFCE8': '\u0633\u0647',
  '\uFCE9': '\u0634\u0645',
  '\uFCEA': '\u0634\u0647',
  '\uFCEB': '\u0643\u0644',
  '\uFCEC': '\u0643\u0645',
  '\uFCED': '\u0644\u0645',
  '\uFCEE': '\u0646\u0645',
  '\uFCEF': '\u0646\u0647',
  '\uFCF0': '\u064A\u0645',
  '\uFCF1': '\u064A\u0647',
  '\uFCF2': '\u0640\u064E\u0651',
  '\uFCF3': '\u0640\u064F\u0651',
  '\uFCF4': '\u0640\u0650\u0651',
  '\uFCF5': '\u0637\u0649',
  '\uFCF6': '\u0637\u064A',
  '\uFCF7': '\u0639\u0649',
  '\uFCF8': '\u0639\u064A',
  '\uFCF9': '\u063A\u0649',
  '\uFCFA': '\u063A\u064A',
  '\uFCFB': '\u0633\u0649',
  '\uFCFC': '\u0633\u064A',
  '\uFCFD': '\u0634\u0649',
  '\uFCFE': '\u0634\u064A',
  '\uFCFF': '\u062D\u0649',
  '\uFD00': '\u062D\u064A',
  '\uFD01': '\u062C\u0649',
  '\uFD02': '\u062C\u064A',
  '\uFD03': '\u062E\u0649',
  '\uFD04': '\u062E\u064A',
  '\uFD05': '\u0635\u0649',
  '\uFD06': '\u0635\u064A',
  '\uFD07': '\u0636\u0649',
  '\uFD08': '\u0636\u064A',
  '\uFD09': '\u0634\u062C',
  '\uFD0A': '\u0634\u062D',
  '\uFD0B': '\u0634\u062E',
  '\uFD0C': '\u0634\u0645',
  '\uFD0D': '\u0634\u0631',
  '\uFD0E': '\u0633\u0631',
  '\uFD0F': '\u0635\u0631',
  '\uFD10': '\u0636\u0631',
  '\uFD11': '\u0637\u0649',
  '\uFD12': '\u0637\u064A',
  '\uFD13': '\u0639\u0649',
  '\uFD14': '\u0639\u064A',
  '\uFD15': '\u063A\u0649',
  '\uFD16': '\u063A\u064A',
  '\uFD17': '\u0633\u0649',
  '\uFD18': '\u0633\u064A',
  '\uFD19': '\u0634\u0649',
  '\uFD1A': '\u0634\u064A',
  '\uFD1B': '\u062D\u0649',
  '\uFD1C': '\u062D\u064A',
  '\uFD1D': '\u062C\u0649',
  '\uFD1E': '\u062C\u064A',
  '\uFD1F': '\u062E\u0649',
  '\uFD20': '\u062E\u064A',
  '\uFD21': '\u0635\u0649',
  '\uFD22': '\u0635\u064A',
  '\uFD23': '\u0636\u0649',
  '\uFD24': '\u0636\u064A',
  '\uFD25': '\u0634\u062C',
  '\uFD26': '\u0634\u062D',
  '\uFD27': '\u0634\u062E',
  '\uFD28': '\u0634\u0645',
  '\uFD29': '\u0634\u0631',
  '\uFD2A': '\u0633\u0631',
  '\uFD2B': '\u0635\u0631',
  '\uFD2C': '\u0636\u0631',
  '\uFD2D': '\u0634\u062C',
  '\uFD2E': '\u0634\u062D',
  '\uFD2F': '\u0634\u062E',
  '\uFD30': '\u0634\u0645',
  '\uFD31': '\u0633\u0647',
  '\uFD32': '\u0634\u0647',
  '\uFD33': '\u0637\u0645',
  '\uFD34': '\u0633\u062C',
  '\uFD35': '\u0633\u062D',
  '\uFD36': '\u0633\u062E',
  '\uFD37': '\u0634\u062C',
  '\uFD38': '\u0634\u062D',
  '\uFD39': '\u0634\u062E',
  '\uFD3A': '\u0637\u0645',
  '\uFD3B': '\u0638\u0645',
  '\uFD3C': '\u0627\u064B',
  '\uFD3D': '\u0627\u064B',
  '\uFD50': '\u062A\u062C\u0645',
  '\uFD51': '\u062A\u062D\u062C',
  '\uFD52': '\u062A\u062D\u062C',
  '\uFD53': '\u062A\u062D\u0645',
  '\uFD54': '\u062A\u062E\u0645',
  '\uFD55': '\u062A\u0645\u062C',
  '\uFD56': '\u062A\u0645\u062D',
  '\uFD57': '\u062A\u0645\u062E',
  '\uFD58': '\u062C\u0645\u062D',
  '\uFD59': '\u062C\u0645\u062D',
  '\uFD5A': '\u062D\u0645\u064A',
  '\uFD5B': '\u062D\u0645\u0649',
  '\uFD5C': '\u0633\u062D\u062C',
  '\uFD5D': '\u0633\u062C\u062D',
  '\uFD5E': '\u0633\u062C\u0649',
  '\uFD5F': '\u0633\u0645\u062D',
  '\uFD60': '\u0633\u0645\u062D',
  '\uFD61': '\u0633\u0645\u062C',
  '\uFD62': '\u0633\u0645\u0645',
  '\uFD63': '\u0633\u0645\u0645',
  '\uFD64': '\u0635\u062D\u062D',
  '\uFD65': '\u0635\u062D\u062D',
  '\uFD66': '\u0635\u0645\u0645',
  '\uFD67': '\u0634\u062D\u0645',
  '\uFD68': '\u0634\u062D\u0645',
  '\uFD69': '\u0634\u062C\u064A',
  '\uFD6A': '\u0634\u0645\u062E',
  '\uFD6B': '\u0634\u0645\u062E',
  '\uFD6C': '\u0634\u0645\u0645',
  '\uFD6D': '\u0634\u0645\u0645',
  '\uFD6E': '\u0636\u062D\u0649',
  '\uFD6F': '\u0636\u062E\u0645',
  '\uFD70': '\u0636\u062E\u0645',
  '\uFD71': '\u0637\u0645\u062D',
  '\uFD72': '\u0637\u0645\u062D',
  '\uFD73': '\u0637\u0645\u0645',
  '\uFD74': '\u0637\u0645\u064A',
  '\uFD75': '\u0639\u062C\u0645',
  '\uFD76': '\u0639\u0645\u0645',
  '\uFD77': '\u0639\u0645\u0645',
  '\uFD78': '\u0639\u0645\u0649',
  '\uFD79': '\u063A\u0645\u0645',
  '\uFD7A': '\u063A\u0645\u064A',
  '\uFD7B': '\u063A\u0645\u0649',
  '\uFD7C': '\u0641\u062E\u0645',
  '\uFD7D': '\u0641\u062E\u0645',
  '\uFD7E': '\u0642\u0645\u062D',
  '\uFD7F': '\u0642\u0645\u0645',
  '\uFD80': '\u0644\u062D\u0645',
  '\uFD81': '\u0644\u062D\u064A',
  '\uFD82': '\u0644\u062D\u0649',
  '\uFD83': '\u0644\u062C\u062C',
  '\uFD84': '\u0644\u062C\u062C',
  '\uFD85': '\u0644\u062E\u0645',
  '\uFD86': '\u0644\u062E\u0645',
  '\uFD87': '\u0644\u0645\u062D',
  '\uFD88': '\u0644\u0645\u062D',
  '\uFD89': '\u0645\u062D\u062C',
  '\uFD8A': '\u0645\u062D\u0645',
  '\uFD8B': '\u0645\u062D\u064A',
  '\uFD8C': '\u0645\u062C\u062D',
  '\uFD8D': '\u0645\u062C\u0645',
  '\uFD8E': '\u0645\u062E\u062C',
  '\uFD8F': '\u0645\u062E\u0645',
  '\uFD92': '\u0645\u062C\u062E',
  '\uFD93': '\u0647\u0645\u062C',
  '\uFD94': '\u0647\u0645\u0645',
  '\uFD95': '\u0646\u062D\u0645',
  '\uFD96': '\u0646\u062D\u0649',
  '\uFD97': '\u0646\u062C\u0645',
  '\uFD98': '\u0646\u062C\u0645',
  '\uFD99': '\u0646\u062C\u0649',
  '\uFD9A': '\u0646\u0645\u064A',
  '\uFD9B': '\u0646\u0645\u0649',
  '\uFD9C': '\u064A\u0645\u0645',
  '\uFD9D': '\u064A\u0645\u0645',
  '\uFD9E': '\u0628\u062E\u064A',
  '\uFD9F': '\u062A\u062C\u064A',
  '\uFDA0': '\u062A\u062C\u0649',
  '\uFDA1': '\u062A\u062E\u064A',
  '\uFDA2': '\u062A\u062E\u0649',
  '\uFDA3': '\u062A\u0645\u064A',
  '\uFDA4': '\u062A\u0645\u0649',
  '\uFDA5': '\u062C\u0645\u064A',
  '\uFDA6': '\u062C\u062D\u0649',
  '\uFDA7': '\u062C\u0645\u0649',
  '\uFDA8': '\u0633\u062E\u0649',
  '\uFDA9': '\u0635\u062D\u064A',
  '\uFDAA': '\u0634\u062D\u064A',
  '\uFDAB': '\u0636\u062D\u064A',
  '\uFDAC': '\u0644\u062C\u064A',
  '\uFDAD': '\u0644\u0645\u064A',
  '\uFDAE': '\u064A\u062D\u064A',
  '\uFDAF': '\u064A\u062C\u064A',
  '\uFDB0': '\u064A\u0645\u064A',
  '\uFDB1': '\u0645\u0645\u064A',
  '\uFDB2': '\u0642\u0645\u064A',
  '\uFDB3': '\u0646\u062D\u064A',
  '\uFDB4': '\u0642\u0645\u062D',
  '\uFDB5': '\u0644\u062D\u0645',
  '\uFDB6': '\u0639\u0645\u064A',
  '\uFDB7': '\u0643\u0645\u064A',
  '\uFDB8': '\u0646\u062C\u062D',
  '\uFDB9': '\u0645\u062E\u064A',
  '\uFDBA': '\u0644\u062C\u0645',
  '\uFDBB': '\u0643\u0645\u0645',
  '\uFDBC': '\u0644\u062C\u0645',
  '\uFDBD': '\u0646\u062C\u062D',
  '\uFDBE': '\u062C\u062D\u064A',
  '\uFDBF': '\u062D\u062C\u064A',
  '\uFDC0': '\u0645\u062C\u064A',
  '\uFDC1': '\u0641\u0645\u064A',
  '\uFDC2': '\u0628\u062D\u064A',
  '\uFDC3': '\u0643\u0645\u0645',
  '\uFDC4': '\u0639\u062C\u0645',
  '\uFDC5': '\u0635\u0645\u0645',
  '\uFDC6': '\u0633\u062E\u064A',
  '\uFDC7': '\u0646\u062C\u064A',
  '\uFE49': '\u203E',
  '\uFE4A': '\u203E',
  '\uFE4B': '\u203E',
  '\uFE4C': '\u203E',
  '\uFE4D': '\u005F',
  '\uFE4E': '\u005F',
  '\uFE4F': '\u005F',
  '\uFE80': '\u0621',
  '\uFE81': '\u0622',
  '\uFE82': '\u0622',
  '\uFE83': '\u0623',
  '\uFE84': '\u0623',
  '\uFE85': '\u0624',
  '\uFE86': '\u0624',
  '\uFE87': '\u0625',
  '\uFE88': '\u0625',
  '\uFE89': '\u0626',
  '\uFE8A': '\u0626',
  '\uFE8B': '\u0626',
  '\uFE8C': '\u0626',
  '\uFE8D': '\u0627',
  '\uFE8E': '\u0627',
  '\uFE8F': '\u0628',
  '\uFE90': '\u0628',
  '\uFE91': '\u0628',
  '\uFE92': '\u0628',
  '\uFE93': '\u0629',
  '\uFE94': '\u0629',
  '\uFE95': '\u062A',
  '\uFE96': '\u062A',
  '\uFE97': '\u062A',
  '\uFE98': '\u062A',
  '\uFE99': '\u062B',
  '\uFE9A': '\u062B',
  '\uFE9B': '\u062B',
  '\uFE9C': '\u062B',
  '\uFE9D': '\u062C',
  '\uFE9E': '\u062C',
  '\uFE9F': '\u062C',
  '\uFEA0': '\u062C',
  '\uFEA1': '\u062D',
  '\uFEA2': '\u062D',
  '\uFEA3': '\u062D',
  '\uFEA4': '\u062D',
  '\uFEA5': '\u062E',
  '\uFEA6': '\u062E',
  '\uFEA7': '\u062E',
  '\uFEA8': '\u062E',
  '\uFEA9': '\u062F',
  '\uFEAA': '\u062F',
  '\uFEAB': '\u0630',
  '\uFEAC': '\u0630',
  '\uFEAD': '\u0631',
  '\uFEAE': '\u0631',
  '\uFEAF': '\u0632',
  '\uFEB0': '\u0632',
  '\uFEB1': '\u0633',
  '\uFEB2': '\u0633',
  '\uFEB3': '\u0633',
  '\uFEB4': '\u0633',
  '\uFEB5': '\u0634',
  '\uFEB6': '\u0634',
  '\uFEB7': '\u0634',
  '\uFEB8': '\u0634',
  '\uFEB9': '\u0635',
  '\uFEBA': '\u0635',
  '\uFEBB': '\u0635',
  '\uFEBC': '\u0635',
  '\uFEBD': '\u0636',
  '\uFEBE': '\u0636',
  '\uFEBF': '\u0636',
  '\uFEC0': '\u0636',
  '\uFEC1': '\u0637',
  '\uFEC2': '\u0637',
  '\uFEC3': '\u0637',
  '\uFEC4': '\u0637',
  '\uFEC5': '\u0638',
  '\uFEC6': '\u0638',
  '\uFEC7': '\u0638',
  '\uFEC8': '\u0638',
  '\uFEC9': '\u0639',
  '\uFECA': '\u0639',
  '\uFECB': '\u0639',
  '\uFECC': '\u0639',
  '\uFECD': '\u063A',
  '\uFECE': '\u063A',
  '\uFECF': '\u063A',
  '\uFED0': '\u063A',
  '\uFED1': '\u0641',
  '\uFED2': '\u0641',
  '\uFED3': '\u0641',
  '\uFED4': '\u0641',
  '\uFED5': '\u0642',
  '\uFED6': '\u0642',
  '\uFED7': '\u0642',
  '\uFED8': '\u0642',
  '\uFED9': '\u0643',
  '\uFEDA': '\u0643',
  '\uFEDB': '\u0643',
  '\uFEDC': '\u0643',
  '\uFEDD': '\u0644',
  '\uFEDE': '\u0644',
  '\uFEDF': '\u0644',
  '\uFEE0': '\u0644',
  '\uFEE1': '\u0645',
  '\uFEE2': '\u0645',
  '\uFEE3': '\u0645',
  '\uFEE4': '\u0645',
  '\uFEE5': '\u0646',
  '\uFEE6': '\u0646',
  '\uFEE7': '\u0646',
  '\uFEE8': '\u0646',
  '\uFEE9': '\u0647',
  '\uFEEA': '\u0647',
  '\uFEEB': '\u0647',
  '\uFEEC': '\u0647',
  '\uFEED': '\u0648',
  '\uFEEE': '\u0648',
  '\uFEEF': '\u0649',
  '\uFEF0': '\u0649',
  '\uFEF1': '\u064A',
  '\uFEF2': '\u064A',
  '\uFEF3': '\u064A',
  '\uFEF4': '\u064A',
  '\uFEF5': '\u0644\u0622',
  '\uFEF6': '\u0644\u0622',
  '\uFEF7': '\u0644\u0623',
  '\uFEF8': '\u0644\u0623',
  '\uFEF9': '\u0644\u0625',
  '\uFEFA': '\u0644\u0625',
  '\uFEFB': '\u0644\u0627',
  '\uFEFC': '\u0644\u0627'
};

function reverseIfRtl(chars) {
  var charsLength = chars.length;
  //reverse an arabic ligature
  if (charsLength <= 1 || !isRTLRangeFor(chars.charCodeAt(0))) {
    return chars;
  }
  var s = '';
  for (var ii = charsLength - 1; ii >= 0; ii--) {
    s += chars[ii];
  }
  return s;
}

function adjustWidths(properties) {
  if (properties.fontMatrix[0] === FONT_IDENTITY_MATRIX[0]) {
    return;
  }
  // adjusting width to fontMatrix scale
  var scale = 0.001 / properties.fontMatrix[0];
  var glyphsWidths = properties.widths;
  for (var glyph in glyphsWidths) {
    glyphsWidths[glyph] *= scale;
  }
  properties.defaultWidth *= scale;
}

function getFontType(type, subtype) {
  switch (type) {
    case 'Type1':
      return subtype === 'Type1C' ? FontType.TYPE1C : FontType.TYPE1;
    case 'CIDFontType0':
      return subtype === 'CIDFontType0C' ? FontType.CIDFONTTYPE0C :
        FontType.CIDFONTTYPE0;
    case 'OpenType':
      return FontType.OPENTYPE;
    case 'TrueType':
      return FontType.TRUETYPE;
    case 'CIDFontType2':
      return FontType.CIDFONTTYPE2;
    case 'MMType1':
      return FontType.MMTYPE1;
    case 'Type0':
      return FontType.TYPE0;
    default:
      return FontType.UNKNOWN;
  }
}

var Glyph = (function GlyphClosure() {
  function Glyph(fontChar, unicode, accent, width, vmetric, operatorListId) {
    this.fontChar = fontChar;
    this.unicode = unicode;
    this.accent = accent;
    this.width = width;
    this.vmetric = vmetric;
    this.operatorListId = operatorListId;
  }

  Glyph.prototype.matchesForCache =
      function(fontChar, unicode, accent, width, vmetric, operatorListId) {
    return this.fontChar === fontChar &&
           this.unicode === unicode &&
           this.accent === accent &&
           this.width === width &&
           this.vmetric === vmetric &&
           this.operatorListId === operatorListId;
  };

  return Glyph;
})();

var ToUnicodeMap = (function ToUnicodeMapClosure() {
  function ToUnicodeMap(cmap) {
    // The elements of this._map can be integers or strings, depending on how
    // |cmap| was created.
    this._map = cmap;
  }

  ToUnicodeMap.prototype = {
    get length() {
      return this._map.length;
    },

    forEach: function(callback) {
      for (var charCode in this._map) {
        callback(charCode, this._map[charCode].charCodeAt(0));
      }
    },

    has: function(i) {
      return this._map[i] !== undefined;
    },

    get: function(i) {
      return this._map[i];
    },

    charCodeOf: function(v) {
      return this._map.indexOf(v);
    }
  };

  return ToUnicodeMap;
})();

var IdentityToUnicodeMap = (function IdentityToUnicodeMapClosure() {
  function IdentityToUnicodeMap(firstChar, lastChar) {
    this.firstChar = firstChar;
    this.lastChar = lastChar;
  }

  IdentityToUnicodeMap.prototype = {
    get length() {
      return (this.lastChar + 1) - this.firstChar;
    },

    forEach: function (callback) {
      for (var i = this.firstChar, ii = this.lastChar; i <= ii; i++) {
        callback(i, i);
      }
    },

    has: function (i) {
      return this.firstChar <= i && i <= this.lastChar;
    },

    get: function (i) {
      if (this.firstChar <= i && i <= this.lastChar) {
        return String.fromCharCode(i);
      }
      return undefined;
    },

    charCodeOf: function (v) {
      error('should not call .charCodeOf');
    }
  };

  return IdentityToUnicodeMap;
})();

var OpenTypeFileBuilder = (function OpenTypeFileBuilderClosure() {
  function writeInt16(dest, offset, num) {
    dest[offset] = (num >> 8) & 0xFF;
    dest[offset + 1] = num & 0xFF;
  }

  function writeInt32(dest, offset, num) {
    dest[offset] = (num >> 24) & 0xFF;
    dest[offset + 1] = (num >> 16) & 0xFF;
    dest[offset + 2] = (num >> 8) & 0xFF;
    dest[offset + 3] = num & 0xFF;
  }

  function writeData(dest, offset, data) {
    var i, ii;
    if (data instanceof Uint8Array) {
      dest.set(data, offset);
    } else if (typeof data === 'string') {
      for (i = 0, ii = data.length; i < ii; i++) {
        dest[offset++] = data.charCodeAt(i) & 0xFF;
      }
    } else {
      // treating everything else as array
      for (i = 0, ii = data.length; i < ii; i++) {
        dest[offset++] = data[i] & 0xFF;
      }
    }
  }

  function OpenTypeFileBuilder(sfnt) {
    this.sfnt = sfnt;
    this.tables = Object.create(null);
  }

  OpenTypeFileBuilder.getSearchParams =
      function OpenTypeFileBuilder_getSearchParams(entriesCount, entrySize) {
    var maxPower2 = 1, log2 = 0;
    while ((maxPower2 ^ entriesCount) > maxPower2) {
      maxPower2 <<= 1;
      log2++;
    }
    var searchRange = maxPower2 * entrySize;
    return {
      range: searchRange,
      entry: log2,
      rangeShift: entrySize * entriesCount - searchRange
    };
  };

  var OTF_HEADER_SIZE = 12;
  var OTF_TABLE_ENTRY_SIZE = 16;

  OpenTypeFileBuilder.prototype = {
    toArray: function OpenTypeFileBuilder_toArray() {
      var sfnt = this.sfnt;

      // Tables needs to be written by ascendant alphabetic order
      var tables = this.tables;
      var tablesNames = Object.keys(tables);
      tablesNames.sort();
      var numTables = tablesNames.length;

      var i, j, jj, table, tableName;
      // layout the tables data
      var offset = OTF_HEADER_SIZE + numTables * OTF_TABLE_ENTRY_SIZE;
      var tableOffsets = [offset];
      for (i = 0; i < numTables; i++) {
        table = tables[tablesNames[i]];
        var paddedLength = ((table.length + 3) & ~3) >>> 0;
        offset += paddedLength;
        tableOffsets.push(offset);
      }

      var file = new Uint8Array(offset);
      // write the table data first (mostly for checksum)
      for (i = 0; i < numTables; i++) {
        table = tables[tablesNames[i]];
        writeData(file, tableOffsets[i], table);
      }

      // sfnt version (4 bytes)
      if (sfnt === 'true') {
        // Windows hates the Mac TrueType sfnt version number
        sfnt = string32(0x00010000);
      }
      file[0] = sfnt.charCodeAt(0) & 0xFF;
      file[1] = sfnt.charCodeAt(1) & 0xFF;
      file[2] = sfnt.charCodeAt(2) & 0xFF;
      file[3] = sfnt.charCodeAt(3) & 0xFF;

      // numTables (2 bytes)
      writeInt16(file, 4, numTables);

      var searchParams = OpenTypeFileBuilder.getSearchParams(numTables, 16);

      // searchRange (2 bytes)
      writeInt16(file, 6, searchParams.range);
      // entrySelector (2 bytes)
      writeInt16(file, 8, searchParams.entry);
      // rangeShift (2 bytes)
      writeInt16(file, 10, searchParams.rangeShift);

      offset = OTF_HEADER_SIZE;
      // writing table entries
      for (i = 0; i < numTables; i++) {
        tableName = tablesNames[i];
        file[offset] = tableName.charCodeAt(0) & 0xFF;
        file[offset + 1] = tableName.charCodeAt(1) & 0xFF;
        file[offset + 2] = tableName.charCodeAt(2) & 0xFF;
        file[offset + 3] = tableName.charCodeAt(3) & 0xFF;

        // checksum
        var checksum = 0;
        for (j = tableOffsets[i], jj = tableOffsets[i + 1]; j < jj; j += 4) {
          var quad = (file[j] << 24) + (file[j + 1] << 16) +
                     (file[j + 2] << 8) + file[j + 3];
          checksum = (checksum + quad) | 0;
        }
        writeInt32(file, offset + 4, checksum);

        // offset
        writeInt32(file, offset + 8, tableOffsets[i]);
        // length
        writeInt32(file, offset + 12, tables[tableName].length);

        offset += OTF_TABLE_ENTRY_SIZE;
      }
      return file;
    },

    addTable: function OpenTypeFileBuilder_addTable(tag, data) {
      if (tag in this.tables) {
        throw new Error('Table ' + tag + ' already exists');
      }
      this.tables[tag] = data;
    }
  };

  return OpenTypeFileBuilder;
})();

/**
 * 'Font' is the class the outside world should use, it encapsulate all the font
 * decoding logics whatever type it is (assuming the font type is supported).
 *
 * For example to read a Type1 font and to attach it to the document:
 *   var type1Font = new Font("MyFontName", binaryFile, propertiesObject);
 *   type1Font.bind();
 */
var Font = (function FontClosure() {
  function Font(name, file, properties) {
    var charCode, glyphName, fontChar;

    this.name = name;
    this.loadedName = properties.loadedName;
    this.isType3Font = properties.isType3Font;
    this.sizes = [];

    this.glyphCache = {};

    var names = name.split('+');
    names = names.length > 1 ? names[1] : names[0];
    names = names.split(/[-,_]/g)[0];
    this.isSerifFont = !!(properties.flags & FontFlags.Serif);
    this.isSymbolicFont = !!(properties.flags & FontFlags.Symbolic);
    this.isMonospace = !!(properties.flags & FontFlags.FixedPitch);

    var type = properties.type;
    var subtype = properties.subtype;
    this.type = type;

    this.fallbackName = (this.isMonospace ? 'monospace' :
                         (this.isSerifFont ? 'serif' : 'sans-serif'));

    this.differences = properties.differences;
    this.widths = properties.widths;
    this.defaultWidth = properties.defaultWidth;
    this.composite = properties.composite;
    this.wideChars = properties.wideChars;
    this.cMap = properties.cMap;
    this.ascent = properties.ascent / PDF_GLYPH_SPACE_UNITS;
    this.descent = properties.descent / PDF_GLYPH_SPACE_UNITS;
    this.fontMatrix = properties.fontMatrix;

    this.toUnicode = properties.toUnicode = this.buildToUnicode(properties);

    this.toFontChar = [];

    if (properties.type === 'Type3') {
      for (charCode = 0; charCode < 256; charCode++) {
        this.toFontChar[charCode] = (this.differences[charCode] ||
                                     properties.defaultEncoding[charCode]);
      }
      this.fontType = FontType.TYPE3;
      return;
    }

    this.cidEncoding = properties.cidEncoding;
    this.vertical = properties.vertical;
    if (this.vertical) {
      this.vmetrics = properties.vmetrics;
      this.defaultVMetrics = properties.defaultVMetrics;
    }

    if (!file || file.isEmpty) {
      if (file) {
        // Some bad PDF generators will include empty font files,
        // attempting to recover by assuming that no file exists.
        warn('Font file is empty in "' + name + '" (' + this.loadedName + ')');
      }

      this.missingFile = true;
      // The file data is not specified. Trying to fix the font name
      // to be used with the canvas.font.
      var fontName = name.replace(/[,_]/g, '-');
      var isStandardFont = !!stdFontMap[fontName] ||
        !!(nonStdFontMap[fontName] && stdFontMap[nonStdFontMap[fontName]]);
      fontName = stdFontMap[fontName] || nonStdFontMap[fontName] || fontName;

      this.bold = (fontName.search(/bold/gi) !== -1);
      this.italic = ((fontName.search(/oblique/gi) !== -1) ||
                     (fontName.search(/italic/gi) !== -1));

      // Use 'name' instead of 'fontName' here because the original
      // name ArialBlack for example will be replaced by Helvetica.
      this.black = (name.search(/Black/g) !== -1);

      // if at least one width is present, remeasure all chars when exists
      this.remeasure = Object.keys(this.widths).length > 0;
      if (isStandardFont && type === 'CIDFontType2' &&
          properties.cidEncoding.indexOf('Identity-') === 0) {
        // Standard fonts might be embedded as CID font without glyph mapping.
        // Building one based on GlyphMapForStandardFonts.
        var map = [];
        for (var code in GlyphMapForStandardFonts) {
          map[+code] = GlyphMapForStandardFonts[code];
        }
        var isIdentityUnicode = this.toUnicode instanceof IdentityToUnicodeMap;
        if (!isIdentityUnicode) {
          this.toUnicode.forEach(function(charCode, unicodeCharCode) {
            map[+charCode] = unicodeCharCode;
          });
        }
        this.toFontChar = map;
        this.toUnicode = new ToUnicodeMap(map);
      } else if (/Symbol/i.test(fontName)) {
        var symbols = Encodings.SymbolSetEncoding;
        for (charCode in symbols) {
          fontChar = GlyphsUnicode[symbols[charCode]];
          if (!fontChar) {
            continue;
          }
          this.toFontChar[charCode] = fontChar;
        }
        for (charCode in properties.differences) {
          fontChar = GlyphsUnicode[properties.differences[charCode]];
          if (!fontChar) {
            continue;
          }
          this.toFontChar[charCode] = fontChar;
        }
      } else if (/Dingbats/i.test(fontName)) {
        if (/Wingdings/i.test(name)) {
          warn('Wingdings font without embedded font file, ' +
               'falling back to the ZapfDingbats encoding.');
        }
        var dingbats = Encodings.ZapfDingbatsEncoding;
        for (charCode in dingbats) {
          fontChar = DingbatsGlyphsUnicode[dingbats[charCode]];
          if (!fontChar) {
            continue;
          }
          this.toFontChar[charCode] = fontChar;
        }
        for (charCode in properties.differences) {
          fontChar = DingbatsGlyphsUnicode[properties.differences[charCode]];
          if (!fontChar) {
            continue;
          }
          this.toFontChar[charCode] = fontChar;
        }
      } else if (isStandardFont) {
        this.toFontChar = [];
        for (charCode in properties.defaultEncoding) {
          glyphName = (properties.differences[charCode] ||
                       properties.defaultEncoding[charCode]);
          this.toFontChar[charCode] = GlyphsUnicode[glyphName];
        }
      } else {
        var unicodeCharCode, notCidFont = (type.indexOf('CIDFontType') === -1);
        this.toUnicode.forEach(function(charCode, unicodeCharCode) {
          if (notCidFont) {
            glyphName = (properties.differences[charCode] ||
                         properties.defaultEncoding[charCode]);
            unicodeCharCode = (GlyphsUnicode[glyphName] || unicodeCharCode);
          }
          this.toFontChar[charCode] = unicodeCharCode;
        }.bind(this));
      }
      this.loadedName = fontName.split('-')[0];
      this.loading = false;
      this.fontType = getFontType(type, subtype);
      return;
    }

    // Some fonts might use wrong font types for Type1C or CIDFontType0C
    if (subtype === 'Type1C' && (type !== 'Type1' && type !== 'MMType1')) {
      // Some TrueType fonts by mistake claim Type1C
      if (isTrueTypeFile(file)) {
        subtype = 'TrueType';
      } else {
        type = 'Type1';
      }
    }
    if (subtype === 'CIDFontType0C' && type !== 'CIDFontType0') {
      type = 'CIDFontType0';
    }
    if (subtype === 'OpenType') {
      type = 'OpenType';
    }
    // Some CIDFontType0C fonts by mistake claim CIDFontType0.
    if (type === 'CIDFontType0') {
      subtype = isType1File(file) ? 'CIDFontType0' : 'CIDFontType0C';
    }

    var data;
    switch (type) {
      case 'MMType1':
        info('MMType1 font (' + name + '), falling back to Type1.');
        /* falls through */
      case 'Type1':
      case 'CIDFontType0':
        this.mimetype = 'font/opentype';

        var cff = (subtype === 'Type1C' || subtype === 'CIDFontType0C') ?
          new CFFFont(file, properties) : new Type1Font(name, file, properties);

        adjustWidths(properties);

        // Wrap the CFF data inside an OTF font file
        data = this.convert(name, cff, properties);
        break;

      case 'OpenType':
      case 'TrueType':
      case 'CIDFontType2':
        this.mimetype = 'font/opentype';

        // Repair the TrueType file. It is can be damaged in the point of
        // view of the sanitizer
        data = this.checkAndRepair(name, file, properties);
        if (this.isOpenType) {
          type = 'OpenType';
        }
        break;

      default:
        error('Font ' + type + ' is not supported');
        break;
    }

    this.data = data;
    this.fontType = getFontType(type, subtype);

    // Transfer some properties again that could change during font conversion
    this.fontMatrix = properties.fontMatrix;
    this.widths = properties.widths;
    this.defaultWidth = properties.defaultWidth;
    this.encoding = properties.baseEncoding;
    this.seacMap = properties.seacMap;

    this.loading = true;
  }

  Font.getFontID = (function () {
    var ID = 1;
    return function Font_getFontID() {
      return String(ID++);
    };
  })();

  function int16(b0, b1) {
    return (b0 << 8) + b1;
  }

  function int32(b0, b1, b2, b3) {
    return (b0 << 24) + (b1 << 16) + (b2 << 8) + b3;
  }

  function string16(value) {
    return String.fromCharCode((value >> 8) & 0xff, value & 0xff);
  }

  function safeString16(value) {
    // clamp value to the 16-bit int range
    value = (value > 0x7FFF ? 0x7FFF : (value < -0x8000 ? -0x8000 : value));
    return String.fromCharCode((value >> 8) & 0xff, value & 0xff);
  }

  function isTrueTypeFile(file) {
    var header = file.peekBytes(4);
    return readUint32(header, 0) === 0x00010000;
  }

  function isType1File(file) {
    var header = file.peekBytes(2);
    // All Type1 font programs must begin with the comment '%!' (0x25 + 0x21).
    if (header[0] === 0x25 && header[1] === 0x21) {
      return true;
    }
    // ... obviously some fonts violate that part of the specification,
    // please refer to the comment in |Type1Font| below.
    if (header[0] === 0x80 && header[1] === 0x01) { // pfb file header.
      return true;
    }
    return false;
  }

  /**
   * Helper function for |adjustMapping|.
   * @return {boolean}
   */
  function isProblematicUnicodeLocation(code) {
    if (code <= 0x1F) { // Control chars
      return true;
    }
    if (code >= 0x80 && code <= 0x9F) { // Control chars
      return true;
    }
    if ((code >= 0x2000 && code <= 0x200F) || // General punctuation chars
        (code >= 0x2028 && code <= 0x202F) ||
        (code >= 0x2060 && code <= 0x206F)) {
      return true;
    }
    if (code >= 0xFFF0 && code <= 0xFFFF) { // Specials Unicode block
      return true;
    }
    switch (code) {
      case 0x7F: // Control char
      case 0xA0: // Non breaking space
      case 0xAD: // Soft hyphen
      case 0x0E33: // Thai character SARA AM
      case 0x2011: // Non breaking hyphen
      case 0x205F: // Medium mathematical space
      case 0x25CC: // Dotted circle (combining mark)
        return true;
    }
    return false;
  }

  /**
   * Rebuilds the char code to glyph ID map by trying to replace the char codes
   * with their unicode value. It also moves char codes that are in known
   * problematic locations.
   * @return {Object} Two properties:
   * 'toFontChar' - maps original char codes(the value that will be read
   * from commands such as show text) to the char codes that will be used in the
   * font that we build
   * 'charCodeToGlyphId' - maps the new font char codes to glyph ids
   */
  function adjustMapping(charCodeToGlyphId, properties) {
    var toUnicode = properties.toUnicode;
    var isSymbolic = !!(properties.flags & FontFlags.Symbolic);
    var isIdentityUnicode =
      properties.toUnicode instanceof IdentityToUnicodeMap;
    var newMap = Object.create(null);
    var toFontChar = [];
    var usedFontCharCodes = [];
    var nextAvailableFontCharCode = PRIVATE_USE_OFFSET_START;
    for (var originalCharCode in charCodeToGlyphId) {
      originalCharCode |= 0;
      var glyphId = charCodeToGlyphId[originalCharCode];
      var fontCharCode = originalCharCode;
      // First try to map the value to a unicode position if a non identity map
      // was created.
      if (!isIdentityUnicode && toUnicode.has(originalCharCode)) {
        var unicode = toUnicode.get(fontCharCode);
        // TODO: Try to map ligatures to the correct spot.
        if (unicode.length === 1) {
          fontCharCode = unicode.charCodeAt(0);
        }
      }
      // Try to move control characters, special characters and already mapped
      // characters to the private use area since they will not be drawn by
      // canvas if left in their current position. Also, move characters if the
      // font was symbolic and there is only an identity unicode map since the
      // characters probably aren't in the correct position (fixes an issue
      // with firefox and thuluthfont).
      if ((usedFontCharCodes[fontCharCode] !== undefined ||
           isProblematicUnicodeLocation(fontCharCode) ||
           (isSymbolic && isIdentityUnicode)) &&
          nextAvailableFontCharCode <= PRIVATE_USE_OFFSET_END) { // Room left.
        // Loop to try and find a free spot in the private use area.
        do {
          fontCharCode = nextAvailableFontCharCode++;

          if (SKIP_PRIVATE_USE_RANGE_F000_TO_F01F && fontCharCode === 0xF000) {
            fontCharCode = 0xF020;
            nextAvailableFontCharCode = fontCharCode + 1;
          }

        } while (usedFontCharCodes[fontCharCode] !== undefined &&
                 nextAvailableFontCharCode <= PRIVATE_USE_OFFSET_END);
      }

      newMap[fontCharCode] = glyphId;
      toFontChar[originalCharCode] = fontCharCode;
      usedFontCharCodes[fontCharCode] = true;
    }
    return {
      toFontChar: toFontChar,
      charCodeToGlyphId: newMap,
      nextAvailableFontCharCode: nextAvailableFontCharCode
    };
  }

  function getRanges(glyphs) {
    // Array.sort() sorts by characters, not numerically, so convert to an
    // array of characters.
    var codes = [];
    for (var charCode in glyphs) {
      codes.push({ fontCharCode: charCode | 0, glyphId: glyphs[charCode] });
    }
    codes.sort(function fontGetRangesSort(a, b) {
      return a.fontCharCode - b.fontCharCode;
    });

    // Split the sorted codes into ranges.
    var ranges = [];
    var length = codes.length;
    for (var n = 0; n < length; ) {
      var start = codes[n].fontCharCode;
      var codeIndices = [codes[n].glyphId];
      ++n;
      var end = start;
      while (n < length && end + 1 === codes[n].fontCharCode) {
        codeIndices.push(codes[n].glyphId);
        ++end;
        ++n;
        if (end === 0xFFFF) {
          break;
        }
      }
      ranges.push([start, end, codeIndices]);
    }

    return ranges;
  }

  function createCmapTable(glyphs) {
    var ranges = getRanges(glyphs);
    var numTables = ranges[ranges.length - 1][1] > 0xFFFF ? 2 : 1;
    var cmap = '\x00\x00' + // version
               string16(numTables) +  // numTables
               '\x00\x03' + // platformID
               '\x00\x01' + // encodingID
               string32(4 + numTables * 8); // start of the table record

    var i, ii, j, jj;
    for (i = ranges.length - 1; i >= 0; --i) {
      if (ranges[i][0] <= 0xFFFF) { break; }
    }
    var bmpLength = i + 1;

    if (ranges[i][0] < 0xFFFF && ranges[i][1] === 0xFFFF) {
      ranges[i][1] = 0xFFFE;
    }
    var trailingRangesCount = ranges[i][1] < 0xFFFF ? 1 : 0;
    var segCount = bmpLength + trailingRangesCount;
    var searchParams = OpenTypeFileBuilder.getSearchParams(segCount, 2);

    // Fill up the 4 parallel arrays describing the segments.
    var startCount = '';
    var endCount = '';
    var idDeltas = '';
    var idRangeOffsets = '';
    var glyphsIds = '';
    var bias = 0;

    var range, start, end, codes;
    for (i = 0, ii = bmpLength; i < ii; i++) {
      range = ranges[i];
      start = range[0];
      end = range[1];
      startCount += string16(start);
      endCount += string16(end);
      codes = range[2];
      var contiguous = true;
      for (j = 1, jj = codes.length; j < jj; ++j) {
        if (codes[j] !== codes[j - 1] + 1) {
          contiguous = false;
          break;
        }
      }
      if (!contiguous) {
        var offset = (segCount - i) * 2 + bias * 2;
        bias += (end - start + 1);

        idDeltas += string16(0);
        idRangeOffsets += string16(offset);

        for (j = 0, jj = codes.length; j < jj; ++j) {
          glyphsIds += string16(codes[j]);
        }
      } else {
        var startCode = codes[0];

        idDeltas += string16((startCode - start) & 0xFFFF);
        idRangeOffsets += string16(0);
      }
    }

    if (trailingRangesCount > 0) {
      endCount += '\xFF\xFF';
      startCount += '\xFF\xFF';
      idDeltas += '\x00\x01';
      idRangeOffsets += '\x00\x00';
    }

    var format314 = '\x00\x00' + // language
                    string16(2 * segCount) +
                    string16(searchParams.range) +
                    string16(searchParams.entry) +
                    string16(searchParams.rangeShift) +
                    endCount + '\x00\x00' + startCount +
                    idDeltas + idRangeOffsets + glyphsIds;

    var format31012 = '';
    var header31012 = '';
    if (numTables > 1) {
      cmap += '\x00\x03' + // platformID
              '\x00\x0A' + // encodingID
              string32(4 + numTables * 8 +
                       4 + format314.length); // start of the table record
      format31012 = '';
      for (i = 0, ii = ranges.length; i < ii; i++) {
        range = ranges[i];
        start = range[0];
        codes = range[2];
        var code = codes[0];
        for (j = 1, jj = codes.length; j < jj; ++j) {
          if (codes[j] !== codes[j - 1] + 1) {
            end = range[0] + j - 1;
            format31012 += string32(start) + // startCharCode
                           string32(end) + // endCharCode
                           string32(code); // startGlyphID
            start = end + 1;
            code = codes[j];
          }
        }
        format31012 += string32(start) + // startCharCode
                       string32(range[1]) + // endCharCode
                       string32(code); // startGlyphID
      }
      header31012 = '\x00\x0C' + // format
                    '\x00\x00' + // reserved
                    string32(format31012.length + 16) + // length
                    '\x00\x00\x00\x00' + // language
                    string32(format31012.length / 12); // nGroups
    }

    return cmap + '\x00\x04' + // format
                  string16(format314.length + 4) + // length
                  format314 + header31012 + format31012;
  }

  function validateOS2Table(os2) {
    var stream = new Stream(os2.data);
    var version = stream.getUint16();
    // TODO verify all OS/2 tables fields, but currently we validate only those
    // that give us issues
    stream.getBytes(60); // skipping type, misc sizes, panose, unicode ranges
    var selection = stream.getUint16();
    if (version < 4 && (selection & 0x0300)) {
      return false;
    }
    var firstChar = stream.getUint16();
    var lastChar = stream.getUint16();
    if (firstChar > lastChar) {
      return false;
    }
    stream.getBytes(6); // skipping sTypoAscender/Descender/LineGap
    var usWinAscent = stream.getUint16();
    if (usWinAscent === 0) { // makes font unreadable by windows
      return false;
    }

    // OS/2 appears to be valid, resetting some fields
    os2.data[8] = os2.data[9] = 0; // IE rejects fonts if fsType != 0
    return true;
  }

  function createOS2Table(properties, charstrings, override) {
    override = override || {
      unitsPerEm: 0,
      yMax: 0,
      yMin: 0,
      ascent: 0,
      descent: 0
    };

    var ulUnicodeRange1 = 0;
    var ulUnicodeRange2 = 0;
    var ulUnicodeRange3 = 0;
    var ulUnicodeRange4 = 0;

    var firstCharIndex = null;
    var lastCharIndex = 0;

    if (charstrings) {
      for (var code in charstrings) {
        code |= 0;
        if (firstCharIndex > code || !firstCharIndex) {
          firstCharIndex = code;
        }
        if (lastCharIndex < code) {
          lastCharIndex = code;
        }

        var position = getUnicodeRangeFor(code);
        if (position < 32) {
          ulUnicodeRange1 |= 1 << position;
        } else if (position < 64) {
          ulUnicodeRange2 |= 1 << position - 32;
        } else if (position < 96) {
          ulUnicodeRange3 |= 1 << position - 64;
        } else if (position < 123) {
          ulUnicodeRange4 |= 1 << position - 96;
        } else {
          error('Unicode ranges Bits > 123 are reserved for internal usage');
        }
      }
    } else {
      // TODO
      firstCharIndex = 0;
      lastCharIndex = 255;
    }

    var bbox = properties.bbox || [0, 0, 0, 0];
    var unitsPerEm = (override.unitsPerEm ||
                      1 / (properties.fontMatrix || FONT_IDENTITY_MATRIX)[0]);

    // if the font units differ to the PDF glyph space units
    // then scale up the values
    var scale = (properties.ascentScaled ? 1.0 :
                 unitsPerEm / PDF_GLYPH_SPACE_UNITS);

    var typoAscent = (override.ascent ||
                      Math.round(scale * (properties.ascent || bbox[3])));
    var typoDescent = (override.descent ||
                       Math.round(scale * (properties.descent || bbox[1])));
    if (typoDescent > 0 && properties.descent > 0 && bbox[1] < 0) {
      typoDescent = -typoDescent; // fixing incorrect descent
    }
    var winAscent = override.yMax || typoAscent;
    var winDescent = -override.yMin || -typoDescent;

    return '\x00\x03' + // version
           '\x02\x24' + // xAvgCharWidth
           '\x01\xF4' + // usWeightClass
           '\x00\x05' + // usWidthClass
           '\x00\x00' + // fstype (0 to let the font loads via font-face on IE)
           '\x02\x8A' + // ySubscriptXSize
           '\x02\xBB' + // ySubscriptYSize
           '\x00\x00' + // ySubscriptXOffset
           '\x00\x8C' + // ySubscriptYOffset
           '\x02\x8A' + // ySuperScriptXSize
           '\x02\xBB' + // ySuperScriptYSize
           '\x00\x00' + // ySuperScriptXOffset
           '\x01\xDF' + // ySuperScriptYOffset
           '\x00\x31' + // yStrikeOutSize
           '\x01\x02' + // yStrikeOutPosition
           '\x00\x00' + // sFamilyClass
           '\x00\x00\x06' +
           String.fromCharCode(properties.fixedPitch ? 0x09 : 0x00) +
           '\x00\x00\x00\x00\x00\x00' + // Panose
           string32(ulUnicodeRange1) + // ulUnicodeRange1 (Bits 0-31)
           string32(ulUnicodeRange2) + // ulUnicodeRange2 (Bits 32-63)
           string32(ulUnicodeRange3) + // ulUnicodeRange3 (Bits 64-95)
           string32(ulUnicodeRange4) + // ulUnicodeRange4 (Bits 96-127)
           '\x2A\x32\x31\x2A' + // achVendID
           string16(properties.italicAngle ? 1 : 0) + // fsSelection
           string16(firstCharIndex ||
                    properties.firstChar) + // usFirstCharIndex
           string16(lastCharIndex || properties.lastChar) +  // usLastCharIndex
           string16(typoAscent) + // sTypoAscender
           string16(typoDescent) + // sTypoDescender
           '\x00\x64' + // sTypoLineGap (7%-10% of the unitsPerEM value)
           string16(winAscent) + // usWinAscent
           string16(winDescent) + // usWinDescent
           '\x00\x00\x00\x00' + // ulCodePageRange1 (Bits 0-31)
           '\x00\x00\x00\x00' + // ulCodePageRange2 (Bits 32-63)
           string16(properties.xHeight) + // sxHeight
           string16(properties.capHeight) + // sCapHeight
           string16(0) + // usDefaultChar
           string16(firstCharIndex || properties.firstChar) + // usBreakChar
           '\x00\x03';  // usMaxContext
  }

  function createPostTable(properties) {
    var angle = Math.floor(properties.italicAngle * (Math.pow(2, 16)));
    return ('\x00\x03\x00\x00' + // Version number
            string32(angle) + // italicAngle
            '\x00\x00' + // underlinePosition
            '\x00\x00' + // underlineThickness
            string32(properties.fixedPitch) + // isFixedPitch
            '\x00\x00\x00\x00' + // minMemType42
            '\x00\x00\x00\x00' + // maxMemType42
            '\x00\x00\x00\x00' + // minMemType1
            '\x00\x00\x00\x00');  // maxMemType1
  }

  function createNameTable(name, proto) {
    if (!proto) {
      proto = [[], []]; // no strings and unicode strings
    }

    var strings = [
      proto[0][0] || 'Original licence',  // 0.Copyright
      proto[0][1] || name,                // 1.Font family
      proto[0][2] || 'Unknown',           // 2.Font subfamily (font weight)
      proto[0][3] || 'uniqueID',          // 3.Unique ID
      proto[0][4] || name,                // 4.Full font name
      proto[0][5] || 'Version 0.11',      // 5.Version
      proto[0][6] || '',                  // 6.Postscript name
      proto[0][7] || 'Unknown',           // 7.Trademark
      proto[0][8] || 'Unknown',           // 8.Manufacturer
      proto[0][9] || 'Unknown'            // 9.Designer
    ];

    // Mac want 1-byte per character strings while Windows want
    // 2-bytes per character, so duplicate the names table
    var stringsUnicode = [];
    var i, ii, j, jj, str;
    for (i = 0, ii = strings.length; i < ii; i++) {
      str = proto[1][i] || strings[i];

      var strBufUnicode = [];
      for (j = 0, jj = str.length; j < jj; j++) {
        strBufUnicode.push(string16(str.charCodeAt(j)));
      }
      stringsUnicode.push(strBufUnicode.join(''));
    }

    var names = [strings, stringsUnicode];
    var platforms = ['\x00\x01', '\x00\x03'];
    var encodings = ['\x00\x00', '\x00\x01'];
    var languages = ['\x00\x00', '\x04\x09'];

    var namesRecordCount = strings.length * platforms.length;
    var nameTable =
      '\x00\x00' +                           // format
      string16(namesRecordCount) +           // Number of names Record
      string16(namesRecordCount * 12 + 6);   // Storage

    // Build the name records field
    var strOffset = 0;
    for (i = 0, ii = platforms.length; i < ii; i++) {
      var strs = names[i];
      for (j = 0, jj = strs.length; j < jj; j++) {
        str = strs[j];
        var nameRecord =
          platforms[i] + // platform ID
          encodings[i] + // encoding ID
          languages[i] + // language ID
          string16(j) + // name ID
          string16(str.length) +
          string16(strOffset);
        nameTable += nameRecord;
        strOffset += str.length;
      }
    }

    nameTable += strings.join('') + stringsUnicode.join('');
    return nameTable;
  }

  Font.prototype = {
    name: null,
    font: null,
    mimetype: null,
    encoding: null,
    get renderer() {
      var renderer = FontRendererFactory.create(this);
      return shadow(this, 'renderer', renderer);
    },

    exportData: function Font_exportData() {
      var data = {};
      for (var i in this) {
        if (this.hasOwnProperty(i)) {
          data[i] = this[i];
        }
      }
      return data;
    },

    checkAndRepair: function Font_checkAndRepair(name, font, properties) {
      function readTableEntry(file) {
        var tag = bytesToString(file.getBytes(4));

        var checksum = file.getInt32();
        var offset = file.getInt32() >>> 0;
        var length = file.getInt32() >>> 0;

        // Read the table associated data
        var previousPosition = file.pos;
        file.pos = file.start ? file.start : 0;
        file.skip(offset);
        var data = file.getBytes(length);
        file.pos = previousPosition;

        if (tag === 'head') {
          // clearing checksum adjustment
          data[8] = data[9] = data[10] = data[11] = 0;
          data[17] |= 0x20; //Set font optimized for cleartype flag
        }

        return {
          tag: tag,
          checksum: checksum,
          length: length,
          offset: offset,
          data: data
        };
      }

      function readOpenTypeHeader(ttf) {
        return {
          version: bytesToString(ttf.getBytes(4)),
          numTables: ttf.getUint16(),
          searchRange: ttf.getUint16(),
          entrySelector: ttf.getUint16(),
          rangeShift: ttf.getUint16()
        };
      }

      /**
       * Read the appropriate subtable from the cmap according to 9.6.6.4 from
       * PDF spec
       */
      function readCmapTable(cmap, font, isSymbolicFont) {
        var segment;
        var start = (font.start ? font.start : 0) + cmap.offset;
        font.pos = start;

        var version = font.getUint16();
        var numTables = font.getUint16();

        var potentialTable;
        var canBreak = false;
        // There's an order of preference in terms of which cmap subtable to
        // use:
        // - non-symbolic fonts the preference is a 3,1 table then a 1,0 table
        // - symbolic fonts the preference is a 3,0 table then a 1,0 table
        // The following takes advantage of the fact that the tables are sorted
        // to work.
        for (var i = 0; i < numTables; i++) {
          var platformId = font.getUint16();
          var encodingId = font.getUint16();
          var offset = font.getInt32() >>> 0;
          var useTable = false;

          if (platformId === 0 && encodingId === 0) {
            useTable = true;
            // Continue the loop since there still may be a higher priority
            // table.
          } else if (platformId === 1 && encodingId === 0) {
            useTable = true;
            // Continue the loop since there still may be a higher priority
            // table.
          } else if (platformId === 3 && encodingId === 1 &&
                     (!isSymbolicFont || !potentialTable)) {
            useTable = true;
            if (!isSymbolicFont) {
              canBreak = true;
            }
          } else if (isSymbolicFont && platformId === 3 && encodingId === 0) {
            useTable = true;
            canBreak = true;
          }

          if (useTable) {
            potentialTable = {
              platformId: platformId,
              encodingId: encodingId,
              offset: offset
            };
          }
          if (canBreak) {
            break;
          }
        }

        if (!potentialTable) {
          warn('Could not find a preferred cmap table.');
          return {
            platformId: -1,
            encodingId: -1,
            mappings: [],
            hasShortCmap: false
          };
        }

        font.pos = start + potentialTable.offset;
        var format = font.getUint16();
        var length = font.getUint16();
        var language = font.getUint16();

        var hasShortCmap = false;
        var mappings = [];
        var j, glyphId;

        // TODO(mack): refactor this cmap subtable reading logic out
        if (format === 0) {
          for (j = 0; j < 256; j++) {
            var index = font.getByte();
            if (!index) {
              continue;
            }
            mappings.push({
              charCode: j,
              glyphId: index
            });
          }
          hasShortCmap = true;
        } else if (format === 4) {
          // re-creating the table in format 4 since the encoding
          // might be changed
          var segCount = (font.getUint16() >> 1);
          font.getBytes(6); // skipping range fields
          var segIndex, segments = [];
          for (segIndex = 0; segIndex < segCount; segIndex++) {
            segments.push({ end: font.getUint16() });
          }
          font.getUint16();
          for (segIndex = 0; segIndex < segCount; segIndex++) {
            segments[segIndex].start = font.getUint16();
          }

          for (segIndex = 0; segIndex < segCount; segIndex++) {
            segments[segIndex].delta = font.getUint16();
          }

          var offsetsCount = 0;
          for (segIndex = 0; segIndex < segCount; segIndex++) {
            segment = segments[segIndex];
            var rangeOffset = font.getUint16();
            if (!rangeOffset) {
              segment.offsetIndex = -1;
              continue;
            }

            var offsetIndex = (rangeOffset >> 1) - (segCount - segIndex);
            segment.offsetIndex = offsetIndex;
            offsetsCount = Math.max(offsetsCount, offsetIndex +
                                    segment.end - segment.start + 1);
          }

          var offsets = [];
          for (j = 0; j < offsetsCount; j++) {
            offsets.push(font.getUint16());
          }

          for (segIndex = 0; segIndex < segCount; segIndex++) {
            segment = segments[segIndex];
            start = segment.start;
            var end = segment.end;
            var delta = segment.delta;
            offsetIndex = segment.offsetIndex;

            for (j = start; j <= end; j++) {
              if (j === 0xFFFF) {
                continue;
              }

              glyphId = (offsetIndex < 0 ?
                         j : offsets[offsetIndex + j - start]);
              glyphId = (glyphId + delta) & 0xFFFF;
              if (glyphId === 0) {
                continue;
              }
              mappings.push({
                charCode: j,
                glyphId: glyphId
              });
            }
          }
        } else if (format === 6) {
          // Format 6 is a 2-bytes dense mapping, which means the font data
          // lives glue together even if they are pretty far in the unicode
          // table. (This looks weird, so I can have missed something), this
          // works on Linux but seems to fails on Mac so let's rewrite the
          // cmap table to a 3-1-4 style
          var firstCode = font.getUint16();
          var entryCount = font.getUint16();

          for (j = 0; j < entryCount; j++) {
            glyphId = font.getUint16();
            var charCode = firstCode + j;

            mappings.push({
              charCode: charCode,
              glyphId: glyphId
            });
          }
        } else {
          error('cmap table has unsupported format: ' + format);
        }

        // removing duplicate entries
        mappings.sort(function (a, b) {
          return a.charCode - b.charCode;
        });
        for (i = 1; i < mappings.length; i++) {
          if (mappings[i - 1].charCode === mappings[i].charCode) {
            mappings.splice(i, 1);
            i--;
          }
        }

        return {
          platformId: potentialTable.platformId,
          encodingId: potentialTable.encodingId,
          mappings: mappings,
          hasShortCmap: hasShortCmap
        };
      }

      function sanitizeMetrics(font, header, metrics, numGlyphs) {
        if (!header) {
          if (metrics) {
            metrics.data = null;
          }
          return;
        }

        font.pos = (font.start ? font.start : 0) + header.offset;
        font.pos += header.length - 2;
        var numOfMetrics = font.getUint16();

        if (numOfMetrics > numGlyphs) {
          info('The numOfMetrics (' + numOfMetrics + ') should not be ' +
               'greater than the numGlyphs (' + numGlyphs + ')');
          // Reduce numOfMetrics if it is greater than numGlyphs
          numOfMetrics = numGlyphs;
          header.data[34] = (numOfMetrics & 0xff00) >> 8;
          header.data[35] = numOfMetrics & 0x00ff;
        }

        var numOfSidebearings = numGlyphs - numOfMetrics;
        var numMissing = numOfSidebearings -
          ((metrics.length - numOfMetrics * 4) >> 1);

        if (numMissing > 0) {
          // For each missing glyph, we set both the width and lsb to 0 (zero).
          // Since we need to add two properties for each glyph, this explains
          // the use of |numMissing * 2| when initializing the typed array.
          var entries = new Uint8Array(metrics.length + numMissing * 2);
          entries.set(metrics.data);
          metrics.data = entries;
        }
      }

      function sanitizeGlyph(source, sourceStart, sourceEnd, dest, destStart,
                             hintsValid) {
        if (sourceEnd - sourceStart <= 12) {
          // glyph with data less than 12 is invalid one
          return 0;
        }
        var glyf = source.subarray(sourceStart, sourceEnd);
        var contoursCount = (glyf[0] << 8) | glyf[1];
        if (contoursCount & 0x8000) {
          // complex glyph, writing as is
          dest.set(glyf, destStart);
          return glyf.length;
        }

        var i, j = 10, flagsCount = 0;
        for (i = 0; i < contoursCount; i++) {
          var endPoint = (glyf[j] << 8) | glyf[j + 1];
          flagsCount = endPoint + 1;
          j += 2;
        }
        // skipping instructions
        var instructionsStart = j;
        var instructionsLength = (glyf[j] << 8) | glyf[j + 1];
        j += 2 + instructionsLength;
        var instructionsEnd = j;
        // validating flags
        var coordinatesLength = 0;
        for (i = 0; i < flagsCount; i++) {
          var flag = glyf[j++];
          if (flag & 0xC0) {
            // reserved flags must be zero, cleaning up
            glyf[j - 1] = flag & 0x3F;
          }
          var xyLength = ((flag & 2) ? 1 : (flag & 16) ? 0 : 2) +
                         ((flag & 4) ? 1 : (flag & 32) ? 0 : 2);
          coordinatesLength += xyLength;
          if (flag & 8) {
            var repeat = glyf[j++];
            i += repeat;
            coordinatesLength += repeat * xyLength;
          }
        }
        // glyph without coordinates will be rejected
        if (coordinatesLength === 0) {
          return 0;
        }
        var glyphDataLength = j + coordinatesLength;
        if (glyphDataLength > glyf.length) {
          // not enough data for coordinates
          return 0;
        }
        if (!hintsValid && instructionsLength > 0) {
          dest.set(glyf.subarray(0, instructionsStart), destStart);
          dest.set([0, 0], destStart + instructionsStart);
          dest.set(glyf.subarray(instructionsEnd, glyphDataLength),
                   destStart + instructionsStart + 2);
          glyphDataLength -= instructionsLength;
          if (glyf.length - glyphDataLength > 3) {
            glyphDataLength = (glyphDataLength + 3) & ~3;
          }
          return glyphDataLength;
        }
        if (glyf.length - glyphDataLength > 3) {
          // truncating and aligning to 4 bytes the long glyph data
          glyphDataLength = (glyphDataLength + 3) & ~3;
          dest.set(glyf.subarray(0, glyphDataLength), destStart);
          return glyphDataLength;
        }
        // glyph data is fine
        dest.set(glyf, destStart);
        return glyf.length;
      }

      function sanitizeHead(head, numGlyphs, locaLength) {
        var data = head.data;

        // Validate version:
        // Should always be 0x00010000
        var version = int32(data[0], data[1], data[2], data[3]);
        if (version >> 16 !== 1) {
          info('Attempting to fix invalid version in head table: ' + version);
          data[0] = 0;
          data[1] = 1;
          data[2] = 0;
          data[3] = 0;
        }

        var indexToLocFormat = int16(data[50], data[51]);
        if (indexToLocFormat < 0 || indexToLocFormat > 1) {
          info('Attempting to fix invalid indexToLocFormat in head table: ' +
               indexToLocFormat);

          // The value of indexToLocFormat should be 0 if the loca table
          // consists of short offsets, and should be 1 if the loca table
          // consists of long offsets.
          //
          // The number of entries in the loca table should be numGlyphs + 1.
          //
          // Using this information, we can work backwards to deduce if the
          // size of each offset in the loca table, and thus figure out the
          // appropriate value for indexToLocFormat.

          var numGlyphsPlusOne = numGlyphs + 1;
          if (locaLength === numGlyphsPlusOne << 1) {
            // 0x0000 indicates the loca table consists of short offsets
            data[50] = 0;
            data[51] = 0;
          } else if (locaLength === numGlyphsPlusOne << 2) {
            // 0x0001 indicates the loca table consists of long offsets
            data[50] = 0;
            data[51] = 1;
          } else {
            warn('Could not fix indexToLocFormat: ' + indexToLocFormat);
          }
        }
      }

      function sanitizeGlyphLocations(loca, glyf, numGlyphs,
                                      isGlyphLocationsLong, hintsValid,
                                      dupFirstEntry) {
        var itemSize, itemDecode, itemEncode;
        if (isGlyphLocationsLong) {
          itemSize = 4;
          itemDecode = function fontItemDecodeLong(data, offset) {
            return (data[offset] << 24) | (data[offset + 1] << 16) |
                   (data[offset + 2] << 8) | data[offset + 3];
          };
          itemEncode = function fontItemEncodeLong(data, offset, value) {
            data[offset] = (value >>> 24) & 0xFF;
            data[offset + 1] = (value >> 16) & 0xFF;
            data[offset + 2] = (value >> 8) & 0xFF;
            data[offset + 3] = value & 0xFF;
          };
        } else {
          itemSize = 2;
          itemDecode = function fontItemDecode(data, offset) {
            return (data[offset] << 9) | (data[offset + 1] << 1);
          };
          itemEncode = function fontItemEncode(data, offset, value) {
            data[offset] = (value >> 9) & 0xFF;
            data[offset + 1] = (value >> 1) & 0xFF;
          };
        }
        var locaData = loca.data;
        var locaDataSize = itemSize * (1 + numGlyphs);
        // is loca.data too short or long?
        if (locaData.length !== locaDataSize) {
          locaData = new Uint8Array(locaDataSize);
          locaData.set(loca.data.subarray(0, locaDataSize));
          loca.data = locaData;
        }
        // removing the invalid glyphs
        var oldGlyfData = glyf.data;
        var oldGlyfDataLength = oldGlyfData.length;
        var newGlyfData = new Uint8Array(oldGlyfDataLength);
        var startOffset = itemDecode(locaData, 0);
        var writeOffset = 0;
        var missingGlyphData = {};
        itemEncode(locaData, 0, writeOffset);
        var i, j;
        for (i = 0, j = itemSize; i < numGlyphs; i++, j += itemSize) {
          var endOffset = itemDecode(locaData, j);
          if (endOffset > oldGlyfDataLength &&
              ((oldGlyfDataLength + 3) & ~3) === endOffset) {
            // Aspose breaks fonts by aligning the glyphs to the qword, but not
            // the glyf table size, which makes last glyph out of range.
            endOffset = oldGlyfDataLength;
          }
          if (endOffset > oldGlyfDataLength) {
            // glyph end offset points outside glyf data, rejecting the glyph
            itemEncode(locaData, j, writeOffset);
            startOffset = endOffset;
            continue;
          }

          if (startOffset === endOffset) {
            missingGlyphData[i] = true;
          }

          var newLength = sanitizeGlyph(oldGlyfData, startOffset, endOffset,
                                        newGlyfData, writeOffset, hintsValid);
          writeOffset += newLength;
          itemEncode(locaData, j, writeOffset);
          startOffset = endOffset;
        }

        if (writeOffset === 0) {
          // glyf table cannot be empty -- redoing the glyf and loca tables
          // to have single glyph with one point
          var simpleGlyph = new Uint8Array(
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 49, 0]);
          for (i = 0, j = itemSize; i < numGlyphs; i++, j += itemSize) {
            itemEncode(locaData, j, simpleGlyph.length);
          }
          glyf.data = simpleGlyph;
          return missingGlyphData;
        }

        if (dupFirstEntry) {
          var firstEntryLength = itemDecode(locaData, itemSize);
          if (newGlyfData.length > firstEntryLength + writeOffset) {
            glyf.data = newGlyfData.subarray(0, firstEntryLength + writeOffset);
          } else {
            glyf.data = new Uint8Array(firstEntryLength + writeOffset);
            glyf.data.set(newGlyfData.subarray(0, writeOffset));
          }
          glyf.data.set(newGlyfData.subarray(0, firstEntryLength), writeOffset);
          itemEncode(loca.data, locaData.length - itemSize,
                     writeOffset + firstEntryLength);
        } else {
          glyf.data = newGlyfData.subarray(0, writeOffset);
        }
        return missingGlyphData;
      }

      function readPostScriptTable(post, properties, maxpNumGlyphs) {
        var start = (font.start ? font.start : 0) + post.offset;
        font.pos = start;

        var length = post.length, end = start + length;
        var version = font.getInt32();
        // skip rest to the tables
        font.getBytes(28);

        var glyphNames;
        var valid = true;
        var i;

        switch (version) {
          case 0x00010000:
            glyphNames = MacStandardGlyphOrdering;
            break;
          case 0x00020000:
            var numGlyphs = font.getUint16();
            if (numGlyphs !== maxpNumGlyphs) {
              valid = false;
              break;
            }
            var glyphNameIndexes = [];
            for (i = 0; i < numGlyphs; ++i) {
              var index = font.getUint16();
              if (index >= 32768) {
                valid = false;
                break;
              }
              glyphNameIndexes.push(index);
            }
            if (!valid) {
              break;
            }
            var customNames = [];
            var strBuf = [];
            while (font.pos < end) {
              var stringLength = font.getByte();
              strBuf.length = stringLength;
              for (i = 0; i < stringLength; ++i) {
                strBuf[i] = String.fromCharCode(font.getByte());
              }
              customNames.push(strBuf.join(''));
            }
            glyphNames = [];
            for (i = 0; i < numGlyphs; ++i) {
              var j = glyphNameIndexes[i];
              if (j < 258) {
                glyphNames.push(MacStandardGlyphOrdering[j]);
                continue;
              }
              glyphNames.push(customNames[j - 258]);
            }
            break;
          case 0x00030000:
            break;
          default:
            warn('Unknown/unsupported post table version ' + version);
            valid = false;
            break;
        }
        properties.glyphNames = glyphNames;
        return valid;
      }

      function readNameTable(nameTable) {
        var start = (font.start ? font.start : 0) + nameTable.offset;
        font.pos = start;

        var names = [[], []];
        var length = nameTable.length, end = start + length;
        var format = font.getUint16();
        var FORMAT_0_HEADER_LENGTH = 6;
        if (format !== 0 || length < FORMAT_0_HEADER_LENGTH) {
          // unsupported name table format or table "too" small
          return names;
        }
        var numRecords = font.getUint16();
        var stringsStart = font.getUint16();
        var records = [];
        var NAME_RECORD_LENGTH = 12;
        var i, ii;

        for (i = 0; i < numRecords &&
                        font.pos + NAME_RECORD_LENGTH <= end; i++) {
          var r = {
            platform: font.getUint16(),
            encoding: font.getUint16(),
            language: font.getUint16(),
            name: font.getUint16(),
            length: font.getUint16(),
            offset: font.getUint16()
          };
          // using only Macintosh and Windows platform/encoding names
          if ((r.platform === 1 && r.encoding === 0 && r.language === 0) ||
              (r.platform === 3 && r.encoding === 1 && r.language === 0x409)) {
            records.push(r);
          }
        }
        for (i = 0, ii = records.length; i < ii; i++) {
          var record = records[i];
          var pos = start + stringsStart + record.offset;
          if (pos + record.length > end) {
            continue; // outside of name table, ignoring
          }
          font.pos = pos;
          var nameIndex = record.name;
          if (record.encoding) {
            // unicode
            var str = '';
            for (var j = 0, jj = record.length; j < jj; j += 2) {
              str += String.fromCharCode(font.getUint16());
            }
            names[1][nameIndex] = str;
          } else {
            names[0][nameIndex] = bytesToString(font.getBytes(record.length));
          }
        }
        return names;
      }

      var TTOpsStackDeltas = [
        0, 0, 0, 0, 0, 0, 0, 0, -2, -2, -2, -2, 0, 0, -2, -5,
        -1, -1, -1, -1, -1, -1, -1, -1, 0, 0, -1, 0, -1, -1, -1, -1,
        1, -1, -999, 0, 1, 0, -1, -2, 0, -1, -2, -1, -1, 0, -1, -1,
        0, 0, -999, -999, -1, -1, -1, -1, -2, -999, -2, -2, -999, 0, -2, -2,
        0, 0, -2, 0, -2, 0, 0, 0, -2, -1, -1, 1, 1, 0, 0, -1,
        -1, -1, -1, -1, -1, -1, 0, 0, -1, 0, -1, -1, 0, -999, -1, -1,
        -1, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        -2, -999, -999, -999, -999, -999, -1, -1, -2, -2, 0, 0, 0, 0, -1, -1,
        -999, -2, -2, 0, 0, -1, -2, -2, 0, 0, 0, -1, -1, -1, -2];
        // 0xC0-DF == -1 and 0xE0-FF == -2

      function sanitizeTTProgram(table, ttContext) {
        var data = table.data;
        var i = 0, j, n, b, funcId, pc, lastEndf = 0, lastDeff = 0;
        var stack = [];
        var callstack = [];
        var functionsCalled = [];
        var tooComplexToFollowFunctions =
          ttContext.tooComplexToFollowFunctions;
        var inFDEF = false, ifLevel = 0, inELSE = 0;
        for (var ii = data.length; i < ii;) {
          var op = data[i++];
          // The TrueType instruction set docs can be found at
          // https://developer.apple.com/fonts/TTRefMan/RM05/Chap5.html
          if (op === 0x40) { // NPUSHB - pushes n bytes
            n = data[i++];
            if (inFDEF || inELSE) {
              i += n;
            } else {
              for (j = 0; j < n; j++) {
                stack.push(data[i++]);
              }
            }
          } else if (op === 0x41) { // NPUSHW - pushes n words
            n = data[i++];
            if (inFDEF || inELSE) {
              i += n * 2;
            } else {
              for (j = 0; j < n; j++) {
                b = data[i++];
                stack.push((b << 8) | data[i++]);
              }
            }
          } else if ((op & 0xF8) === 0xB0) { // PUSHB - pushes bytes
            n = op - 0xB0 + 1;
            if (inFDEF || inELSE) {
              i += n;
            } else {
              for (j = 0; j < n; j++) {
                stack.push(data[i++]);
              }
            }
          } else if ((op & 0xF8) === 0xB8) { // PUSHW - pushes words
            n = op - 0xB8 + 1;
            if (inFDEF || inELSE) {
              i += n * 2;
            } else {
              for (j = 0; j < n; j++) {
                b = data[i++];
                stack.push((b << 8) | data[i++]);
              }
            }
          } else if (op === 0x2B && !tooComplexToFollowFunctions) { // CALL
            if (!inFDEF && !inELSE) {
              // collecting inforamtion about which functions are used
              funcId = stack[stack.length - 1];
              ttContext.functionsUsed[funcId] = true;
              if (funcId in ttContext.functionsStackDeltas) {
                stack.length += ttContext.functionsStackDeltas[funcId];
              } else if (funcId in ttContext.functionsDefined &&
                         functionsCalled.indexOf(funcId) < 0) {
                callstack.push({data: data, i: i, stackTop: stack.length - 1});
                functionsCalled.push(funcId);
                pc = ttContext.functionsDefined[funcId];
                if (!pc) {
                  warn('TT: CALL non-existent function');
                  ttContext.hintsValid = false;
                  return;
                }
                data = pc.data;
                i = pc.i;
              }
            }
          } else if (op === 0x2C && !tooComplexToFollowFunctions) { // FDEF
            if (inFDEF || inELSE) {
              warn('TT: nested FDEFs not allowed');
              tooComplexToFollowFunctions = true;
            }
            inFDEF = true;
            // collecting inforamtion about which functions are defined
            lastDeff = i;
            funcId = stack.pop();
            ttContext.functionsDefined[funcId] = {data: data, i: i};
          } else if (op === 0x2D) { // ENDF - end of function
            if (inFDEF) {
              inFDEF = false;
              lastEndf = i;
            } else {
              pc = callstack.pop();
              if (!pc) {
                warn('TT: ENDF bad stack');
                ttContext.hintsValid = false;
                return;
              }
              funcId = functionsCalled.pop();
              data = pc.data;
              i = pc.i;
              ttContext.functionsStackDeltas[funcId] =
                stack.length - pc.stackTop;
            }
          } else if (op === 0x89) { // IDEF - instruction definition
            if (inFDEF || inELSE) {
              warn('TT: nested IDEFs not allowed');
              tooComplexToFollowFunctions = true;
            }
            inFDEF = true;
            // recording it as a function to track ENDF
            lastDeff = i;
          } else if (op === 0x58) { // IF
            ++ifLevel;
          } else if (op === 0x1B) { // ELSE
            inELSE = ifLevel;
          } else if (op === 0x59) { // EIF
            if (inELSE === ifLevel) {
              inELSE = 0;
            }
            --ifLevel;
          } else if (op === 0x1C) { // JMPR
            if (!inFDEF && !inELSE) {
              var offset = stack[stack.length - 1];
              // only jumping forward to prevent infinite loop
              if (offset > 0) {
                i += offset - 1;
              }
            }
          }
          // Adjusting stack not extactly, but just enough to get function id
          if (!inFDEF && !inELSE) {
            var stackDelta = op <= 0x8E ? TTOpsStackDeltas[op] :
              op >= 0xC0 && op <= 0xDF ? -1 : op >= 0xE0 ? -2 : 0;
            if (op >= 0x71 && op <= 0x75) {
              n = stack.pop();
              if (n === n) {
                stackDelta = -n * 2;
              }
            }
            while (stackDelta < 0 && stack.length > 0) {
              stack.pop();
              stackDelta++;
            }
            while (stackDelta > 0) {
              stack.push(NaN); // pushing any number into stack
              stackDelta--;
            }
          }
        }
        ttContext.tooComplexToFollowFunctions = tooComplexToFollowFunctions;
        var content = [data];
        if (i > data.length) {
          content.push(new Uint8Array(i - data.length));
        }
        if (lastDeff > lastEndf) {
          warn('TT: complementing a missing function tail');
          // new function definition started, but not finished
          // complete function by [CLEAR, ENDF]
          content.push(new Uint8Array([0x22, 0x2D]));
        }
        foldTTTable(table, content);
      }

      function checkInvalidFunctions(ttContext, maxFunctionDefs) {
        if (ttContext.tooComplexToFollowFunctions) {
          return;
        }
        if (ttContext.functionsDefined.length > maxFunctionDefs) {
          warn('TT: more functions defined than expected');
          ttContext.hintsValid = false;
          return;
        }
        for (var j = 0, jj = ttContext.functionsUsed.length; j < jj; j++) {
          if (j > maxFunctionDefs) {
            warn('TT: invalid function id: ' + j);
            ttContext.hintsValid = false;
            return;
          }
          if (ttContext.functionsUsed[j] && !ttContext.functionsDefined[j]) {
            warn('TT: undefined function: ' + j);
            ttContext.hintsValid = false;
            return;
          }
        }
      }

      function foldTTTable(table, content) {
        if (content.length > 1) {
          // concatenating the content items
          var newLength = 0;
          var j, jj;
          for (j = 0, jj = content.length; j < jj; j++) {
            newLength += content[j].length;
          }
          newLength = (newLength + 3) & ~3;
          var result = new Uint8Array(newLength);
          var pos = 0;
          for (j = 0, jj = content.length; j < jj; j++) {
            result.set(content[j], pos);
            pos += content[j].length;
          }
          table.data = result;
          table.length = newLength;
        }
      }

      function sanitizeTTPrograms(fpgm, prep, cvt) {
        var ttContext = {
          functionsDefined: [],
          functionsUsed: [],
          functionsStackDeltas: [],
          tooComplexToFollowFunctions: false,
          hintsValid: true
        };
        if (fpgm) {
          sanitizeTTProgram(fpgm, ttContext);
        }
        if (prep) {
          sanitizeTTProgram(prep, ttContext);
        }
        if (fpgm) {
          checkInvalidFunctions(ttContext, maxFunctionDefs);
        }
        if (cvt && (cvt.length & 1)) {
          var cvtData = new Uint8Array(cvt.length + 1);
          cvtData.set(cvt.data);
          cvt.data = cvtData;
        }
        return ttContext.hintsValid;
      }

      // The following steps modify the original font data, making copy
      font = new Stream(new Uint8Array(font.getBytes()));

      var VALID_TABLES = ['OS/2', 'cmap', 'head', 'hhea', 'hmtx', 'maxp',
        'name', 'post', 'loca', 'glyf', 'fpgm', 'prep', 'cvt ', 'CFF '];

      var header = readOpenTypeHeader(font);
      var numTables = header.numTables;
      var cff, cffFile;

      var tables = { 'OS/2': null, cmap: null, head: null, hhea: null,
                     hmtx: null, maxp: null, name: null, post: null };
      var table;
      for (var i = 0; i < numTables; i++) {
        table = readTableEntry(font);
        if (VALID_TABLES.indexOf(table.tag) < 0) {
          continue; // skipping table if it's not a required or optional table
        }
        if (table.length === 0) {
          continue; // skipping empty tables
        }
        tables[table.tag] = table;
      }

      var isTrueType = !tables['CFF '];
      if (!isTrueType) {
        // OpenType font
        if (header.version === 'OTTO' ||
            !tables.head || !tables.hhea || !tables.maxp || !tables.post) {
          // no major tables: throwing everything at CFFFont
          cffFile = new Stream(tables['CFF '].data);
          cff = new CFFFont(cffFile, properties);

          return this.convert(name, cff, properties);
        }

        delete tables.glyf;
        delete tables.loca;
        delete tables.fpgm;
        delete tables.prep;
        delete tables['cvt '];
        this.isOpenType = true;
      } else {
        if (!tables.glyf || !tables.loca) {
          error('Required "glyf" or "loca" tables are not found');
        }
        this.isOpenType = false;
      }

      if (!tables.maxp) {
        error('Required "maxp" table is not found');
      }

      font.pos = (font.start || 0) + tables.maxp.offset;
      var version = font.getInt32();
      var numGlyphs = font.getUint16();
      var maxFunctionDefs = 0;
      if (version >= 0x00010000 && tables.maxp.length >= 22) {
        // maxZones can be invalid
        font.pos += 8;
        var maxZones = font.getUint16();
        if (maxZones > 2) { // reset to 2 if font has invalid maxZones
          tables.maxp.data[14] = 0;
          tables.maxp.data[15] = 2;
        }
        font.pos += 4;
        maxFunctionDefs = font.getUint16();
      }

      var dupFirstEntry = false;
      if (properties.type === 'CIDFontType2' && properties.toUnicode &&
          properties.toUnicode.get(0) > '\u0000') {
        // oracle's defect (see 3427), duplicating first entry
        dupFirstEntry = true;
        numGlyphs++;
        tables.maxp.data[4] = numGlyphs >> 8;
        tables.maxp.data[5] = numGlyphs & 255;
      }

      var hintsValid = sanitizeTTPrograms(tables.fpgm, tables.prep,
                                          tables['cvt '], maxFunctionDefs);
      if (!hintsValid) {
        delete tables.fpgm;
        delete tables.prep;
        delete tables['cvt '];
      }

      // Ensure the hmtx table contains the advance width and
      // sidebearings information for numGlyphs in the maxp table
      sanitizeMetrics(font, tables.hhea, tables.hmtx, numGlyphs);

      if (!tables.head) {
        error('Required "head" table is not found');
      }

      sanitizeHead(tables.head, numGlyphs, isTrueType ? tables.loca.length : 0);

      var missingGlyphs = {};
      if (isTrueType) {
        var isGlyphLocationsLong = int16(tables.head.data[50],
                                         tables.head.data[51]);
        missingGlyphs = sanitizeGlyphLocations(tables.loca, tables.glyf,
                                               numGlyphs, isGlyphLocationsLong,
                                               hintsValid, dupFirstEntry);
      }

      if (!tables.hhea) {
        error('Required "hhea" table is not found');
      }

      // Sanitizer reduces the glyph advanceWidth to the maxAdvanceWidth
      // Sometimes it's 0. That needs to be fixed
      if (tables.hhea.data[10] === 0 && tables.hhea.data[11] === 0) {
        tables.hhea.data[10] = 0xFF;
        tables.hhea.data[11] = 0xFF;
      }

      // The 'post' table has glyphs names.
      if (tables.post) {
        var valid = readPostScriptTable(tables.post, properties, numGlyphs);
        if (!valid) {
          tables.post = null;
        }
      }

      var charCodeToGlyphId = [], charCode, toUnicode = properties.toUnicode;

      function hasGlyph(glyphId, charCode) {
        if (!missingGlyphs[glyphId]) {
          return true;
        }
        if (charCode >= 0 && toUnicode.has(charCode)) {
          return true;
        }
        return false;
      }

      if (properties.type === 'CIDFontType2') {
        var cidToGidMap = properties.cidToGidMap || [];
        var isCidToGidMapEmpty = cidToGidMap.length === 0;

        properties.cMap.forEach(function(charCode, cid) {
          assert(cid <= 0xffff, 'Max size of CID is 65,535');
          var glyphId = -1;
          if (isCidToGidMapEmpty) {
            glyphId = charCode;
          } else if (cidToGidMap[cid] !== undefined) {
            glyphId = cidToGidMap[cid];
          }

          if (glyphId >= 0 && glyphId < numGlyphs &&
              hasGlyph(glyphId, charCode)) {
            charCodeToGlyphId[charCode] = glyphId;
          }
        });
        if (dupFirstEntry) {
          charCodeToGlyphId[0] = numGlyphs - 1;
        }
      } else {
        // Most of the following logic in this code branch is based on the
        // 9.6.6.4 of the PDF spec.
        var cmapTable = readCmapTable(tables.cmap, font, this.isSymbolicFont);
        var cmapPlatformId = cmapTable.platformId;
        var cmapEncodingId = cmapTable.encodingId;
        var cmapMappings = cmapTable.mappings;
        var cmapMappingsLength = cmapMappings.length;
        var hasEncoding = properties.differences.length ||
                          !!properties.baseEncodingName;

        // The spec seems to imply that if the font is symbolic the encoding
        // should be ignored, this doesn't appear to work for 'preistabelle.pdf'
        // where the the font is symbolic and it has an encoding.
        if (hasEncoding &&
            (cmapPlatformId === 3 && cmapEncodingId === 1 ||
             cmapPlatformId === 1 && cmapEncodingId === 0) ||
            (cmapPlatformId === -1 && cmapEncodingId === -1 && // Temporary hack
             !!Encodings[properties.baseEncodingName])) {      // Temporary hack
          // When no preferred cmap table was found and |baseEncodingName| is
          // one of the predefined encodings, we seem to obtain a better
          // |charCodeToGlyphId| map from the code below (fixes bug 1057544).
          // TODO: Note that this is a hack which should be removed as soon as
          //       we have proper support for more exotic cmap tables.

          var baseEncoding = [];
          if (properties.baseEncodingName === 'MacRomanEncoding' ||
              properties.baseEncodingName === 'WinAnsiEncoding') {
            baseEncoding = Encodings[properties.baseEncodingName];
          }
          for (charCode = 0; charCode < 256; charCode++) {
            var glyphName;
            if (this.differences && charCode in this.differences) {
              glyphName = this.differences[charCode];
            } else if (charCode in baseEncoding &&
                       baseEncoding[charCode] !== '') {
              glyphName = baseEncoding[charCode];
            } else {
              glyphName = Encodings.StandardEncoding[charCode];
            }
            if (!glyphName) {
              continue;
            }
            var unicodeOrCharCode;
            if (cmapPlatformId === 3 && cmapEncodingId === 1) {
              unicodeOrCharCode = GlyphsUnicode[glyphName];
            } else if (cmapPlatformId === 1 && cmapEncodingId === 0) {
              // TODO: the encoding needs to be updated with mac os table.
              unicodeOrCharCode = Encodings.MacRomanEncoding.indexOf(glyphName);
            }

            var found = false;
            for (i = 0; i < cmapMappingsLength; ++i) {
              if (cmapMappings[i].charCode === unicodeOrCharCode &&
                  hasGlyph(cmapMappings[i].glyphId, unicodeOrCharCode)) {
                charCodeToGlyphId[charCode] = cmapMappings[i].glyphId;
                found = true;
                break;
              }
            }
            if (!found && properties.glyphNames) {
              // Try to map using the post table. There are currently no known
              // pdfs that this fixes.
              var glyphId = properties.glyphNames.indexOf(glyphName);
              if (glyphId > 0 && hasGlyph(glyphId, -1)) {
                charCodeToGlyphId[charCode] = glyphId;
              }
            }
          }
        } else if (cmapPlatformId === 0 && cmapEncodingId === 0) {
          // Default Unicode semantics, use the charcodes as is.
          for (i = 0; i < cmapMappingsLength; ++i) {
            charCodeToGlyphId[cmapMappings[i].charCode] =
              cmapMappings[i].glyphId;
          }
        } else {
          // For (3, 0) cmap tables:
          // The charcode key being stored in charCodeToGlyphId is the lower
          // byte of the two-byte charcodes of the cmap table since according to
          // the spec: 'each byte from the string shall be prepended with the
          // high byte of the range [of charcodes in the cmap table], to form
          // a two-byte character, which shall be used to select the
          // associated glyph description from the subtable'.
          //
          // For (1, 0) cmap tables:
          // 'single bytes from the string shall be used to look up the
          // associated glyph descriptions from the subtable'. This means
          // charcodes in the cmap will be single bytes, so no-op since
          // glyph.charCode & 0xFF === glyph.charCode
          for (i = 0; i < cmapMappingsLength; ++i) {
            charCode = cmapMappings[i].charCode & 0xFF;
            charCodeToGlyphId[charCode] = cmapMappings[i].glyphId;
          }
        }
      }

      if (charCodeToGlyphId.length === 0) {
        // defines at least one glyph
        charCodeToGlyphId[0] = 0;
      }

      // Converting glyphs and ids into font's cmap table
      var newMapping = adjustMapping(charCodeToGlyphId, properties);
      this.toFontChar = newMapping.toFontChar;
      tables.cmap = {
        tag: 'cmap',
        data: createCmapTable(newMapping.charCodeToGlyphId)
      };

      if (!tables['OS/2'] || !validateOS2Table(tables['OS/2'])) {
        // extract some more font properties from the OpenType head and
        // hhea tables; yMin and descent value are always negative
        var override = {
          unitsPerEm: int16(tables.head.data[18], tables.head.data[19]),
          yMax: int16(tables.head.data[42], tables.head.data[43]),
          yMin: int16(tables.head.data[38], tables.head.data[39]) - 0x10000,
          ascent: int16(tables.hhea.data[4], tables.hhea.data[5]),
          descent: int16(tables.hhea.data[6], tables.hhea.data[7]) - 0x10000
        };

        tables['OS/2'] = {
          tag: 'OS/2',
          data: createOS2Table(properties, newMapping.charCodeToGlyphId,
                               override)
        };
      }

      // Rewrite the 'post' table if needed
      if (!tables.post) {
        tables.post = {
          tag: 'post',
          data: createPostTable(properties)
        };
      }

      if (!isTrueType) {
        try {
          // Trying to repair CFF file
          cffFile = new Stream(tables['CFF '].data);
          var parser = new CFFParser(cffFile, properties);
          cff = parser.parse();
          var compiler = new CFFCompiler(cff);
          tables['CFF '].data = compiler.compile();
        } catch (e) {
          warn('Failed to compile font ' + properties.loadedName);
        }
      }

      // Re-creating 'name' table
      if (!tables.name) {
        tables.name = {
          tag: 'name',
          data: createNameTable(this.name)
        };
      } else {
        // ... using existing 'name' table as prototype
        var namePrototype = readNameTable(tables.name);
        tables.name.data = createNameTable(name, namePrototype);
      }

      var builder = new OpenTypeFileBuilder(header.version);
      for (var tableTag in tables) {
        builder.addTable(tableTag, tables[tableTag].data);
      }
      return builder.toArray();
    },

    convert: function Font_convert(fontName, font, properties) {
      // TODO: Check the charstring widths to determine this.
      properties.fixedPitch = false;

      var mapping = font.getGlyphMapping(properties);
      var newMapping = adjustMapping(mapping, properties);
      this.toFontChar = newMapping.toFontChar;
      var numGlyphs = font.numGlyphs;

      function getCharCodes(charCodeToGlyphId, glyphId) {
        var charCodes = null;
        for (var charCode in charCodeToGlyphId) {
          if (glyphId === charCodeToGlyphId[charCode]) {
            if (!charCodes) {
              charCodes = [];
            }
            charCodes.push(charCode | 0);
          }
        }
        return charCodes;
      }

      function createCharCode(charCodeToGlyphId, glyphId) {
        for (var charCode in charCodeToGlyphId) {
          if (glyphId === charCodeToGlyphId[charCode]) {
            return charCode | 0;
          }
        }
        newMapping.charCodeToGlyphId[newMapping.nextAvailableFontCharCode] =
            glyphId;
        return newMapping.nextAvailableFontCharCode++;
      }

      var seacs = font.seacs;
      if (SEAC_ANALYSIS_ENABLED && seacs && seacs.length) {
        var matrix = properties.fontMatrix || FONT_IDENTITY_MATRIX;
        var charset = font.getCharset();
        var seacMap = Object.create(null);
        for (var glyphId in seacs) {
          glyphId |= 0;
          var seac = seacs[glyphId];
          var baseGlyphName = Encodings.StandardEncoding[seac[2]];
          var accentGlyphName = Encodings.StandardEncoding[seac[3]];
          var baseGlyphId = charset.indexOf(baseGlyphName);
          var accentGlyphId = charset.indexOf(accentGlyphName);
          if (baseGlyphId < 0 || accentGlyphId < 0) {
            continue;
          }
          var accentOffset = {
            x: seac[0] * matrix[0] + seac[1] * matrix[2] + matrix[4],
            y: seac[0] * matrix[1] + seac[1] * matrix[3] + matrix[5]
          };

          var charCodes = getCharCodes(mapping, glyphId);
          if (!charCodes) {
            // There's no point in mapping it if the char code was never mapped
            // to begin with.
            continue;
          }
          for (var i = 0, ii = charCodes.length; i < ii; i++) {
            var charCode = charCodes[i];
            // Find a fontCharCode that maps to the base and accent glyphs.
            // If one doesn't exists, create it.
            var charCodeToGlyphId = newMapping.charCodeToGlyphId;
            var baseFontCharCode = createCharCode(charCodeToGlyphId,
                                                  baseGlyphId);
            var accentFontCharCode = createCharCode(charCodeToGlyphId,
                                                    accentGlyphId);
            seacMap[charCode] = {
              baseFontCharCode: baseFontCharCode,
              accentFontCharCode: accentFontCharCode,
              accentOffset: accentOffset
            };
          }
        }
        properties.seacMap = seacMap;
      }

      var unitsPerEm = 1 / (properties.fontMatrix || FONT_IDENTITY_MATRIX)[0];

      var builder = new OpenTypeFileBuilder('\x4F\x54\x54\x4F');
      // PostScript Font Program
      builder.addTable('CFF ', font.data);
      // OS/2 and Windows Specific metrics
      builder.addTable('OS/2', createOS2Table(properties,
                                              newMapping.charCodeToGlyphId));
      // Character to glyphs mapping
      builder.addTable('cmap', createCmapTable(newMapping.charCodeToGlyphId));
      // Font header
      builder.addTable('head',
            '\x00\x01\x00\x00' + // Version number
            '\x00\x00\x10\x00' + // fontRevision
            '\x00\x00\x00\x00' + // checksumAdjustement
            '\x5F\x0F\x3C\xF5' + // magicNumber
            '\x00\x00' + // Flags
            safeString16(unitsPerEm) + // unitsPerEM
            '\x00\x00\x00\x00\x9e\x0b\x7e\x27' + // creation date
            '\x00\x00\x00\x00\x9e\x0b\x7e\x27' + // modifification date
            '\x00\x00' + // xMin
            safeString16(properties.descent) + // yMin
            '\x0F\xFF' + // xMax
            safeString16(properties.ascent) + // yMax
            string16(properties.italicAngle ? 2 : 0) + // macStyle
            '\x00\x11' + // lowestRecPPEM
            '\x00\x00' + // fontDirectionHint
            '\x00\x00' + // indexToLocFormat
            '\x00\x00');  // glyphDataFormat

      // Horizontal header
      builder.addTable('hhea',
            '\x00\x01\x00\x00' + // Version number
            safeString16(properties.ascent) + // Typographic Ascent
            safeString16(properties.descent) + // Typographic Descent
            '\x00\x00' + // Line Gap
            '\xFF\xFF' + // advanceWidthMax
            '\x00\x00' + // minLeftSidebearing
            '\x00\x00' + // minRightSidebearing
            '\x00\x00' + // xMaxExtent
            safeString16(properties.capHeight) + // caretSlopeRise
            safeString16(Math.tan(properties.italicAngle) *
                         properties.xHeight) + // caretSlopeRun
            '\x00\x00' + // caretOffset
            '\x00\x00' + // -reserved-
            '\x00\x00' + // -reserved-
            '\x00\x00' + // -reserved-
            '\x00\x00' + // -reserved-
            '\x00\x00' + // metricDataFormat
            string16(numGlyphs)); // Number of HMetrics

      // Horizontal metrics
      builder.addTable('hmtx', (function fontFieldsHmtx() {
          var charstrings = font.charstrings;
          var cffWidths = font.cff ? font.cff.widths : null;
          var hmtx = '\x00\x00\x00\x00'; // Fake .notdef
          for (var i = 1, ii = numGlyphs; i < ii; i++) {
            var width = 0;
            if (charstrings) {
              var charstring = charstrings[i - 1];
              width = 'width' in charstring ? charstring.width : 0;
            } else if (cffWidths) {
              width = Math.ceil(cffWidths[i] || 0);
            }
            hmtx += string16(width) + string16(0);
          }
          return hmtx;
        })());

      // Maximum profile
      builder.addTable('maxp',
            '\x00\x00\x50\x00' + // Version number
            string16(numGlyphs)); // Num of glyphs

      // Naming tables
      builder.addTable('name', createNameTable(fontName));

      // PostScript informations
      builder.addTable('post', createPostTable(properties));

      return builder.toArray();
    },

    /**
     * Builds a char code to unicode map based on section 9.10 of the spec.
     * @param {Object} properties Font properties object.
     * @return {Object} A ToUnicodeMap object.
     */
    buildToUnicode: function Font_buildToUnicode(properties) {
      // Section 9.10.2 Mapping Character Codes to Unicode Values
      if (properties.toUnicode && properties.toUnicode.length !== 0) {
        return properties.toUnicode;
      }
      // According to the spec if the font is a simple font we should only map
      // to unicode if the base encoding is MacRoman, MacExpert, or WinAnsi or
      // the differences array only contains adobe standard or symbol set names,
      // in pratice it seems better to always try to create a toUnicode
      // map based of the default encoding.
      var toUnicode, charcode;
      if (!properties.composite /* is simple font */) {
        toUnicode = [];
        var encoding = properties.defaultEncoding.slice();
        var baseEncodingName = properties.baseEncodingName;
        // Merge in the differences array.
        var differences = properties.differences;
        for (charcode in differences) {
          encoding[charcode] = differences[charcode];
        }
        for (charcode in encoding) {
          // a) Map the character code to a character name.
          var glyphName = encoding[charcode];
          // b) Look up the character name in the Adobe Glyph List (see the
          //    Bibliography) to obtain the corresponding Unicode value.
          if (glyphName === '') {
            continue;
          } else if (GlyphsUnicode[glyphName] === undefined) {
            // (undocumented) c) Few heuristics to recognize unknown glyphs
            // NOTE: Adobe Reader does not do this step, but OSX Preview does
            var code = 0;
            switch (glyphName[0]) {
              case 'G': // Gxx glyph
                if (glyphName.length === 3) {
                  code = parseInt(glyphName.substr(1), 16);
                }
                break;
              case 'g': // g00xx glyph
                if (glyphName.length === 5) {
                  code = parseInt(glyphName.substr(1), 16);
                }
                break;
              case 'C': // Cddd glyph
              case 'c': // cddd glyph
                if (glyphName.length >= 3) {
                  code = +glyphName.substr(1);
                }
                break;
            }
            if (code) {
              // If |baseEncodingName| is one the predefined encodings,
              // and |code| equals |charcode|, using the glyph defined in the
              // baseEncoding seems to yield a better |toUnicode| mapping
              // (fixes issue 5070).
              if (baseEncodingName && code === +charcode) {
                var baseEncoding = Encodings[baseEncodingName];
                if (baseEncoding && (glyphName = baseEncoding[charcode])) {
                  toUnicode[charcode] =
                    String.fromCharCode(GlyphsUnicode[glyphName]);
                  continue;
                }
              }
              toUnicode[charcode] = String.fromCharCode(code);
            }
            continue;
          }
          toUnicode[charcode] = String.fromCharCode(GlyphsUnicode[glyphName]);
        }
        return new ToUnicodeMap(toUnicode);
      }
      // If the font is a composite font that uses one of the predefined CMaps
      // listed in Table 118 (except Identityâ€“H and Identityâ€“V) or whose
      // descendant CIDFont uses the Adobe-GB1, Adobe-CNS1, Adobe-Japan1, or
      // Adobe-Korea1 character collection:
      if (properties.composite && (
           (properties.cMap.builtInCMap &&
            !(properties.cMap instanceof IdentityCMap)) ||
           (properties.cidSystemInfo.registry === 'Adobe' &&
             (properties.cidSystemInfo.ordering === 'GB1' ||
              properties.cidSystemInfo.ordering === 'CNS1' ||
              properties.cidSystemInfo.ordering === 'Japan1' ||
              properties.cidSystemInfo.ordering === 'Korea1')))) {
        // Then:
        // a) Map the character code to a character identifier (CID) according
        // to the fontâ€™s CMap.
        // b) Obtain the registry and ordering of the character collection used
        // by the fontâ€™s CMap (for example, Adobe and Japan1) from its
        // CIDSystemInfo dictionary.
        var registry = properties.cidSystemInfo.registry;
        var ordering = properties.cidSystemInfo.ordering;
        // c) Construct a second CMap name by concatenating the registry and
        // ordering obtained in step (b) in the format registryâ€“orderingâ€“UCS2
        // (for example, Adobeâ€“Japan1â€“UCS2).
        var ucs2CMapName = new Name(registry + '-' + ordering + '-UCS2');
        // d) Obtain the CMap with the name constructed in step (c) (available
        // from the ASN Web site; see the Bibliography).
        var ucs2CMap = CMapFactory.create(ucs2CMapName,
          { url: PDFJS.cMapUrl, packed: PDFJS.cMapPacked }, null);
        var cMap = properties.cMap;
        toUnicode = [];
        cMap.forEach(function(charcode, cid) {
          assert(cid <= 0xffff, 'Max size of CID is 65,535');
          // e) Map the CID obtained in step (a) according to the CMap obtained
          // in step (d), producing a Unicode value.
          var ucs2 = ucs2CMap.lookup(cid);
          if (ucs2) {
            toUnicode[charcode] =
              String.fromCharCode((ucs2.charCodeAt(0) << 8) +
                                  ucs2.charCodeAt(1));
          }
        });
        return new ToUnicodeMap(toUnicode);
      }

      // The viewer's choice, just use an identity map.
      return new IdentityToUnicodeMap(properties.firstChar,
                                      properties.lastChar);
    },

    get spaceWidth() {
      if ('_shadowWidth' in this) {
        return this._shadowWidth;
      }

      // trying to estimate space character width
      var possibleSpaceReplacements = ['space', 'minus', 'one', 'i'];
      var width;
      for (var i = 0, ii = possibleSpaceReplacements.length; i < ii; i++) {
        var glyphName = possibleSpaceReplacements[i];
        // if possible, getting width by glyph name
        if (glyphName in this.widths) {
          width = this.widths[glyphName];
          break;
        }
        var glyphUnicode = GlyphsUnicode[glyphName];
        // finding the charcode via unicodeToCID map
        var charcode = 0;
        if (this.composite) {
          if (this.cMap.contains(glyphUnicode)) {
            charcode = this.cMap.lookup(glyphUnicode);
          }
        }
        // ... via toUnicode map
        if (!charcode && 'toUnicode' in this) {
          charcode = this.toUnicode.charCodeOf(glyphUnicode);
        }
        // setting it to unicode if negative or undefined
        if (charcode <= 0) {
          charcode = glyphUnicode;
        }
        // trying to get width via charcode
        width = this.widths[charcode];
        if (width) {
          break; // the non-zero width found
        }
      }
      width = width || this.defaultWidth;
      // Do not shadow the property here. See discussion:
      // https://github.com/mozilla/pdf.js/pull/2127#discussion_r1662280
      this._shadowWidth = width;
      return width;
    },

    charToGlyph: function Font_charToGlyph(charcode) {
      var fontCharCode, width, operatorListId;

      var widthCode = charcode;
      if (this.cMap && this.cMap.contains(charcode)) {
        widthCode = this.cMap.lookup(charcode);
      }
      width = this.widths[widthCode];
      width = isNum(width) ? width : this.defaultWidth;
      var vmetric = this.vmetrics && this.vmetrics[widthCode];

      var unicode = this.toUnicode.get(charcode) || charcode;
      if (typeof unicode === 'number') {
        unicode = String.fromCharCode(unicode);
      }

      // First try the toFontChar map, if it's not there then try falling
      // back to the char code.
      fontCharCode = this.toFontChar[charcode] || charcode;
      if (this.missingFile) {
        fontCharCode = mapSpecialUnicodeValues(fontCharCode);
      }

      if (this.isType3Font) {
        // Font char code in this case is actually a glyph name.
        operatorListId = fontCharCode;
      }

      var accent = null;
      if (this.seacMap && this.seacMap[charcode]) {
        var seac = this.seacMap[charcode];
        fontCharCode = seac.baseFontCharCode;
        accent = {
          fontChar: String.fromCharCode(seac.accentFontCharCode),
          offset: seac.accentOffset
        };
      }

      var fontChar = String.fromCharCode(fontCharCode);

      var glyph = this.glyphCache[charcode];
      if (!glyph ||
          !glyph.matchesForCache(fontChar, unicode, accent, width, vmetric,
                                 operatorListId)) {
        glyph = new Glyph(fontChar, unicode, accent, width, vmetric,
                          operatorListId);
        this.glyphCache[charcode] = glyph;
      }
      return glyph;
    },

    charsToGlyphs: function Font_charsToGlyphs(chars) {
      var charsCache = this.charsCache;
      var glyphs, glyph, charcode;

      // if we translated this string before, just grab it from the cache
      if (charsCache) {
        glyphs = charsCache[chars];
        if (glyphs) {
          return glyphs;
        }
      }

      // lazily create the translation cache
      if (!charsCache) {
        charsCache = this.charsCache = Object.create(null);
      }

      glyphs = [];
      var charsCacheKey = chars;
      var i = 0, ii;

      if (this.cMap) {
        // composite fonts have multi-byte strings convert the string from
        // single-byte to multi-byte
        var c = {};
        while (i < chars.length) {
          this.cMap.readCharCode(chars, i, c);
          charcode = c.charcode;
          var length = c.length;
          i += length;
          glyph = this.charToGlyph(charcode);
          glyphs.push(glyph);
          // placing null after each word break charcode (ASCII SPACE)
          // Ignore occurences of 0x20 in multiple-byte codes.
          if (length === 1 && chars.charCodeAt(i - 1) === 0x20) {
            glyphs.push(null);
          }
        }
      } else {
        for (i = 0, ii = chars.length; i < ii; ++i) {
          charcode = chars.charCodeAt(i);
          glyph = this.charToGlyph(charcode);
          glyphs.push(glyph);
          if (charcode === 0x20) {
            glyphs.push(null);
          }
        }
      }

      // Enter the translated string into the cache
      return (charsCache[charsCacheKey] = glyphs);
    }
  };

  return Font;
})();

var ErrorFont = (function ErrorFontClosure() {
  function ErrorFont(error) {
    this.error = error;
    this.loadedName = 'g_font_error';
    this.loading = false;
  }

  ErrorFont.prototype = {
    charsToGlyphs: function ErrorFont_charsToGlyphs() {
      return [];
    },
    exportData: function ErrorFont_exportData() {
      return {error: this.error};
    }
  };

  return ErrorFont;
})();

/**
 * Shared logic for building a char code to glyph id mapping for Type1 and
 * simple CFF fonts. See section 9.6.6.2 of the spec.
 * @param {Object} properties Font properties object.
 * @param {Object} builtInEncoding The encoding contained within the actual font
 * data.
 * @param {Array} Array of glyph names where the index is the glyph ID.
 * @returns {Object} A char code to glyph ID map.
 */
function type1FontGlyphMapping(properties, builtInEncoding, glyphNames) {
  var charCodeToGlyphId = Object.create(null);
  var glyphId, charCode, baseEncoding;

  if (properties.baseEncodingName) {
    // If a valid base encoding name was used, the mapping is initialized with
    // that.
    baseEncoding = Encodings[properties.baseEncodingName];
    for (charCode = 0; charCode < baseEncoding.length; charCode++) {
      glyphId = glyphNames.indexOf(baseEncoding[charCode]);
      if (glyphId >= 0) {
        charCodeToGlyphId[charCode] = glyphId;
      } else {
        charCodeToGlyphId[charCode] = 0; // notdef
      }
    }
  } else if (!!(properties.flags & FontFlags.Symbolic)) {
    // For a symbolic font the encoding should be the fonts built-in
    // encoding.
    for (charCode in builtInEncoding) {
      charCodeToGlyphId[charCode] = builtInEncoding[charCode];
    }
  } else {
    // For non-symbolic fonts that don't have a base encoding the standard
    // encoding should be used.
    baseEncoding = Encodings.StandardEncoding;
    for (charCode = 0; charCode < baseEncoding.length; charCode++) {
      glyphId = glyphNames.indexOf(baseEncoding[charCode]);
      if (glyphId >= 0) {
        charCodeToGlyphId[charCode] = glyphId;
      } else {
        charCodeToGlyphId[charCode] = 0; // notdef
      }
    }
  }

  // Lastly, merge in the differences.
  var differences = properties.differences;
  if (differences) {
    for (charCode in differences) {
      var glyphName = differences[charCode];
      glyphId = glyphNames.indexOf(glyphName);
      if (glyphId >= 0) {
        charCodeToGlyphId[charCode] = glyphId;
      } else {
        charCodeToGlyphId[charCode] = 0; // notdef
      }
    }
  }
  return charCodeToGlyphId;
}

/*
 * CharStrings are encoded following the the CharString Encoding sequence
 * describe in Chapter 6 of the "Adobe Type1 Font Format" specification.
 * The value in a byte indicates a command, a number, or subsequent bytes
 * that are to be interpreted in a special way.
 *
 * CharString Number Encoding:
 *  A CharString byte containing the values from 32 through 255 inclusive
 *  indicate an integer. These values are decoded in four ranges.
 *
 * 1. A CharString byte containing a value, v, between 32 and 246 inclusive,
 * indicate the integer v - 139. Thus, the integer values from -107 through
 * 107 inclusive may be encoded in single byte.
 *
 * 2. A CharString byte containing a value, v, between 247 and 250 inclusive,
 * indicates an integer involving the next byte, w, according to the formula:
 * [(v - 247) x 256] + w + 108
 *
 * 3. A CharString byte containing a value, v, between 251 and 254 inclusive,
 * indicates an integer involving the next byte, w, according to the formula:
 * -[(v - 251) * 256] - w - 108
 *
 * 4. A CharString containing the value 255 indicates that the next 4 bytes
 * are a two complement signed integer. The first of these bytes contains the
 * highest order bits, the second byte contains the next higher order bits
 * and the fourth byte contain the lowest order bits.
 *
 *
 * CharString Command Encoding:
 *  CharStrings commands are encoded in 1 or 2 bytes.
 *
 *  Single byte commands are encoded in 1 byte that contains a value between
 *  0 and 31 inclusive.
 *  If a command byte contains the value 12, then the value in the next byte
 *  indicates a command. This "escape" mechanism allows many extra commands
 * to be encoded and this encoding technique helps to minimize the length of
 * the charStrings.
 */
var Type1CharString = (function Type1CharStringClosure() {
  var COMMAND_MAP = {
    'hstem': [1],
    'vstem': [3],
    'vmoveto': [4],
    'rlineto': [5],
    'hlineto': [6],
    'vlineto': [7],
    'rrcurveto': [8],
    'callsubr': [10],
    'flex': [12, 35],
    'drop' : [12, 18],
    'endchar': [14],
    'rmoveto': [21],
    'hmoveto': [22],
    'vhcurveto': [30],
    'hvcurveto': [31]
  };

  function Type1CharString() {
    this.width = 0;
    this.lsb = 0;
    this.flexing = false;
    this.output = [];
    this.stack = [];
  }

  Type1CharString.prototype = {
    convert: function Type1CharString_convert(encoded, subrs) {
      var count = encoded.length;
      var error = false;
      var wx, sbx, subrNumber;
      for (var i = 0; i < count; i++) {
        var value = encoded[i];
        if (value < 32) {
          if (value === 12) {
            value = (value << 8) + encoded[++i];
          }
          switch (value) {
            case 1: // hstem
              if (!HINTING_ENABLED) {
                this.stack = [];
                break;
              }
              error = this.executeCommand(2, COMMAND_MAP.hstem);
              break;
            case 3: // vstem
              if (!HINTING_ENABLED) {
                this.stack = [];
                break;
              }
              error = this.executeCommand(2, COMMAND_MAP.vstem);
              break;
            case 4: // vmoveto
              if (this.flexing) {
                if (this.stack.length < 1) {
                  error = true;
                  break;
                }
                // Add the dx for flex and but also swap the values so they are
                // the right order.
                var dy = this.stack.pop();
                this.stack.push(0, dy);
                break;
              }
              error = this.executeCommand(1, COMMAND_MAP.vmoveto);
              break;
            case 5: // rlineto
              error = this.executeCommand(2, COMMAND_MAP.rlineto);
              break;
            case 6: // hlineto
              error = this.executeCommand(1, COMMAND_MAP.hlineto);
              break;
            case 7: // vlineto
              error = this.executeCommand(1, COMMAND_MAP.vlineto);
              break;
            case 8: // rrcurveto
              error = this.executeCommand(6, COMMAND_MAP.rrcurveto);
              break;
            case 9: // closepath
              // closepath is a Type1 command that does not take argument and is
              // useless in Type2 and it can simply be ignored.
              this.stack = [];
              break;
            case 10: // callsubr
              if (this.stack.length < 1) {
                error = true;
                break;
              }
              subrNumber = this.stack.pop();
              error = this.convert(subrs[subrNumber], subrs);
              break;
            case 11: // return
              return error;
            case 13: // hsbw
              if (this.stack.length < 2) {
                error = true;
                break;
              }
              // To convert to type2 we have to move the width value to the
              // first part of the charstring and then use hmoveto with lsb.
              wx = this.stack.pop();
              sbx = this.stack.pop();
              this.lsb = sbx;
              this.width = wx;
              this.stack.push(wx, sbx);
              error = this.executeCommand(2, COMMAND_MAP.hmoveto);
              break;
            case 14: // endchar
              this.output.push(COMMAND_MAP.endchar[0]);
              break;
            case 21: // rmoveto
              if (this.flexing) {
                break;
              }
              error = this.executeCommand(2, COMMAND_MAP.rmoveto);
              break;
            case 22: // hmoveto
              if (this.flexing) {
                // Add the dy for flex.
                this.stack.push(0);
                break;
              }
              error = this.executeCommand(1, COMMAND_MAP.hmoveto);
              break;
            case 30: // vhcurveto
              error = this.executeCommand(4, COMMAND_MAP.vhcurveto);
              break;
            case 31: // hvcurveto
              error = this.executeCommand(4, COMMAND_MAP.hvcurveto);
              break;
            case (12 << 8) + 0: // dotsection
              // dotsection is a Type1 command to specify some hinting feature
              // for dots that do not take a parameter and it can safely be
              // ignored for Type2.
              this.stack = [];
              break;
            case (12 << 8) + 1: // vstem3
              if (!HINTING_ENABLED) {
                this.stack = [];
                break;
              }
              // [vh]stem3 are Type1 only and Type2 supports [vh]stem with
              // multiple parameters, so instead of returning [vh]stem3 take a
              // shortcut and return [vhstem] instead.
              error = this.executeCommand(2, COMMAND_MAP.vstem);
              break;
            case (12 << 8) + 2: // hstem3
              if (!HINTING_ENABLED) {
                 this.stack = [];
                break;
              }
              // See vstem3.
              error = this.executeCommand(2, COMMAND_MAP.hstem);
              break;
            case (12 << 8) + 6: // seac
              // seac is like type 2's special endchar but it doesn't use the
              // first argument asb, so remove it.
              if (SEAC_ANALYSIS_ENABLED) {
                this.seac = this.stack.splice(-4, 4);
                error = this.executeCommand(0, COMMAND_MAP.endchar);
              } else {
                error = this.executeCommand(4, COMMAND_MAP.endchar);
              }
              break;
            case (12 << 8) + 7: // sbw
              if (this.stack.length < 4) {
                error = true;
                break;
              }
              // To convert to type2 we have to move the width value to the
              // first part of the charstring and then use rmoveto with
              // (dx, dy). The height argument will not be used for vmtx and
              // vhea tables reconstruction -- ignoring it.
              var wy = this.stack.pop();
              wx = this.stack.pop();
              var sby = this.stack.pop();
              sbx = this.stack.pop();
              this.lsb = sbx;
              this.width = wx;
              this.stack.push(wx, sbx, sby);
              error = this.executeCommand(3, COMMAND_MAP.rmoveto);
              break;
            case (12 << 8) + 12: // div
              if (this.stack.length < 2) {
                error = true;
                break;
              }
              var num2 = this.stack.pop();
              var num1 = this.stack.pop();
              this.stack.push(num1 / num2);
              break;
            case (12 << 8) + 16: // callothersubr
              if (this.stack.length < 2) {
                error = true;
                break;
              }
              subrNumber = this.stack.pop();
              var numArgs = this.stack.pop();
              if (subrNumber === 0 && numArgs === 3) {
                var flexArgs = this.stack.splice(this.stack.length - 17, 17);
                this.stack.push(
                  flexArgs[2] + flexArgs[0], // bcp1x + rpx
                  flexArgs[3] + flexArgs[1], // bcp1y + rpy
                  flexArgs[4], // bcp2x
                  flexArgs[5], // bcp2y
                  flexArgs[6], // p2x
                  flexArgs[7], // p2y
                  flexArgs[8], // bcp3x
                  flexArgs[9], // bcp3y
                  flexArgs[10], // bcp4x
                  flexArgs[11], // bcp4y
                  flexArgs[12], // p3x
                  flexArgs[13], // p3y
                  flexArgs[14] // flexDepth
                  // 15 = finalx unused by flex
                  // 16 = finaly unused by flex
                );
                error = this.executeCommand(13, COMMAND_MAP.flex, true);
                this.flexing = false;
                this.stack.push(flexArgs[15], flexArgs[16]);
              } else if (subrNumber === 1 && numArgs === 0) {
                this.flexing = true;
              }
              break;
            case (12 << 8) + 17: // pop
              // Ignore this since it is only used with othersubr.
              break;
            case (12 << 8) + 33: // setcurrentpoint
              // Ignore for now.
              this.stack = [];
              break;
            default:
              warn('Unknown type 1 charstring command of "' + value + '"');
              break;
          }
          if (error) {
            break;
          }
          continue;
        } else if (value <= 246) {
          value = value - 139;
        } else if (value <= 250) {
          value = ((value - 247) * 256) + encoded[++i] + 108;
        } else if (value <= 254) {
          value = -((value - 251) * 256) - encoded[++i] - 108;
        } else {
          value = (encoded[++i] & 0xff) << 24 | (encoded[++i] & 0xff) << 16 |
                  (encoded[++i] & 0xff) << 8 | (encoded[++i] & 0xff) << 0;
        }
        this.stack.push(value);
      }
      return error;
    },

    executeCommand: function(howManyArgs, command, keepStack) {
      var stackLength = this.stack.length;
      if (howManyArgs > stackLength) {
        return true;
      }
      var start = stackLength - howManyArgs;
      for (var i = start; i < stackLength; i++) {
        var value = this.stack[i];
        if (value === (value | 0)) { // int
          this.output.push(28, (value >> 8) & 0xff, value & 0xff);
        } else { // fixed point
          value = (65536 * value) | 0;
          this.output.push(255,
                           (value >> 24) & 0xFF,
                           (value >> 16) & 0xFF,
                           (value >> 8) & 0xFF,
                           value & 0xFF);
        }
      }
      this.output.push.apply(this.output, command);
      if (keepStack) {
        this.stack.splice(start, howManyArgs);
      } else {
        this.stack.length = 0;
      }
      return false;
    }
  };

  return Type1CharString;
})();

/*
 * Type1Parser encapsulate the needed code for parsing a Type1 font
 * program. Some of its logic depends on the Type2 charstrings
 * structure.
 * Note: this doesn't really parse the font since that would require evaluation
 * of PostScript, but it is possible in most cases to extract what we need
 * without a full parse.
 */
var Type1Parser = (function Type1ParserClosure() {
  /*
   * Decrypt a Sequence of Ciphertext Bytes to Produce the Original Sequence
   * of Plaintext Bytes. The function took a key as a parameter which can be
   * for decrypting the eexec block of for decoding charStrings.
   */
  var EEXEC_ENCRYPT_KEY = 55665;
  var CHAR_STRS_ENCRYPT_KEY = 4330;

  function isHexDigit(code) {
    return code >= 48 && code <= 57 || // '0'-'9'
           code >= 65 && code <= 70 || // 'A'-'F'
           code >= 97 && code <= 102;  // 'a'-'f'
  }

  function decrypt(data, key, discardNumber) {
    var r = key | 0, c1 = 52845, c2 = 22719;
    var count = data.length;
    var decrypted = new Uint8Array(count);
    for (var i = 0; i < count; i++) {
      var value = data[i];
      decrypted[i] = value ^ (r >> 8);
      r = ((value + r) * c1 + c2) & ((1 << 16) - 1);
    }
    return Array.prototype.slice.call(decrypted, discardNumber);
  }

  function decryptAscii(data, key, discardNumber) {
    var r = key | 0, c1 = 52845, c2 = 22719;
    var count = data.length, maybeLength = count >>> 1;
    var decrypted = new Uint8Array(maybeLength);
    var i, j;
    for (i = 0, j = 0; i < count; i++) {
      var digit1 = data[i];
      if (!isHexDigit(digit1)) {
        continue;
      }
      i++;
      var digit2;
      while (i < count && !isHexDigit(digit2 = data[i])) {
        i++;
      }
      if (i < count) {
        var value = parseInt(String.fromCharCode(digit1, digit2), 16);
        decrypted[j++] = value ^ (r >> 8);
        r = ((value + r) * c1 + c2) & ((1 << 16) - 1);
      }
    }
    return Array.prototype.slice.call(decrypted, discardNumber, j);
  }

  function isSpecial(c) {
    return c === 0x2F || // '/'
           c === 0x5B || c === 0x5D || // '[', ']'
           c === 0x7B || c === 0x7D || // '{', '}'
           c === 0x28 || c === 0x29; // '(', ')'
  }

  function Type1Parser(stream, encrypted) {
    if (encrypted) {
      var data = stream.getBytes();
      var isBinary = !(isHexDigit(data[0]) && isHexDigit(data[1]) &&
                       isHexDigit(data[2]) && isHexDigit(data[3]));
      stream = new Stream(isBinary ? decrypt(data, EEXEC_ENCRYPT_KEY, 4) :
                          decryptAscii(data, EEXEC_ENCRYPT_KEY, 4));
    }
    this.stream = stream;
    this.nextChar();
  }

  Type1Parser.prototype = {
    readNumberArray: function Type1Parser_readNumberArray() {
      this.getToken(); // read '[' or '{' (arrays can start with either)
      var array = [];
      while (true) {
        var token = this.getToken();
        if (token === null || token === ']' || token === '}') {
          break;
        }
        array.push(parseFloat(token || 0));
      }
      return array;
    },

    readNumber: function Type1Parser_readNumber() {
      var token = this.getToken();
      return parseFloat(token || 0);
    },

    readInt: function Type1Parser_readInt() {
      // Use '| 0' to prevent setting a double into length such as the double
      // does not flow into the loop variable.
      var token = this.getToken();
      return parseInt(token || 0, 10) | 0;
    },

    readBoolean: function Type1Parser_readBoolean() {
      var token = this.getToken();

      // Use 1 and 0 since that's what type2 charstrings use.
      return token === 'true' ? 1 : 0;
    },

    nextChar : function Type1_nextChar() {
      return (this.currentChar = this.stream.getByte());
    },

    getToken: function Type1Parser_getToken() {
      // Eat whitespace and comments.
      var comment = false;
      var ch = this.currentChar;
      while (true) {
        if (ch === -1) {
          return null;
        }

        if (comment) {
          if (ch === 0x0A || ch === 0x0D) {
            comment = false;
          }
        } else if (ch === 0x25) { // '%'
          comment = true;
        } else if (!Lexer.isSpace(ch)) {
          break;
        }
        ch = this.nextChar();
      }
      if (isSpecial(ch)) {
        this.nextChar();
        return String.fromCharCode(ch);
      }
      var token = '';
      do {
        token += String.fromCharCode(ch);
        ch = this.nextChar();
      } while (ch >= 0 && !Lexer.isSpace(ch) && !isSpecial(ch));
      return token;
    },

    /*
     * Returns an object containing a Subrs array and a CharStrings
     * array extracted from and eexec encrypted block of data
     */
    extractFontProgram: function Type1Parser_extractFontProgram() {
      var stream = this.stream;

      var subrs = [], charstrings = [];
      var program = {
        subrs: [],
        charstrings: [],
        properties: {
          'privateData': {
            'lenIV': 4
          }
        }
      };
      var token, length, data, lenIV, encoded;
      while ((token = this.getToken()) !== null) {
        if (token !== '/') {
          continue;
        }
        token = this.getToken();
        switch (token) {
          case 'CharStrings':
            // The number immediately following CharStrings must be greater or
            // equal to the number of CharStrings.
            this.getToken();
            this.getToken(); // read in 'dict'
            this.getToken(); // read in 'dup'
            this.getToken(); // read in 'begin'
            while(true) {
              token = this.getToken();
              if (token === null || token === 'end') {
                break;
              }

              if (token !== '/') {
                continue;
              }
              var glyph = this.getToken();
              length = this.readInt();
              this.getToken(); // read in 'RD' or '-|'
              data = stream.makeSubStream(stream.pos, length);
              lenIV = program.properties.privateData['lenIV'];
              encoded = decrypt(data.getBytes(), CHAR_STRS_ENCRYPT_KEY, lenIV);
              // Skip past the required space and binary data.
              stream.skip(length);
              this.nextChar();
              token = this.getToken(); // read in 'ND' or '|-'
              if (token === 'noaccess') {
                this.getToken(); // read in 'def'
              }
              charstrings.push({
                glyph: glyph,
                encoded: encoded
              });
            }
            break;
          case 'Subrs':
            var num = this.readInt();
            this.getToken(); // read in 'array'
            while ((token = this.getToken()) === 'dup') {
              var index = this.readInt();
              length = this.readInt();
              this.getToken(); // read in 'RD' or '-|'
              data = stream.makeSubStream(stream.pos, length);
              lenIV = program.properties.privateData['lenIV'];
              encoded = decrypt(data.getBytes(), CHAR_STRS_ENCRYPT_KEY, lenIV);
              // Skip past the required space and binary data.
              stream.skip(length);
              this.nextChar();
              token = this.getToken(); // read in 'NP' or '|'
              if (token === 'noaccess') {
                this.getToken(); // read in 'put'
              }
              subrs[index] = encoded;
            }
            break;
          case 'BlueValues':
          case 'OtherBlues':
          case 'FamilyBlues':
          case 'FamilyOtherBlues':
            var blueArray = this.readNumberArray();
            // *Blue* values may contain invalid data: disables reading of
            // those values when hinting is disabled.
            if (blueArray.length > 0 && (blueArray.length % 2) === 0 &&
                HINTING_ENABLED) {
              program.properties.privateData[token] = blueArray;
            }
            break;
          case 'StemSnapH':
          case 'StemSnapV':
            program.properties.privateData[token] = this.readNumberArray();
            break;
          case 'StdHW':
          case 'StdVW':
            program.properties.privateData[token] =
              this.readNumberArray()[0];
            break;
          case 'BlueShift':
          case 'lenIV':
          case 'BlueFuzz':
          case 'BlueScale':
          case 'LanguageGroup':
          case 'ExpansionFactor':
            program.properties.privateData[token] = this.readNumber();
            break;
          case 'ForceBold':
            program.properties.privateData[token] = this.readBoolean();
            break;
        }
      }

      for (var i = 0; i < charstrings.length; i++) {
        glyph = charstrings[i].glyph;
        encoded = charstrings[i].encoded;
        var charString = new Type1CharString();
        var error = charString.convert(encoded, subrs);
        var output = charString.output;
        if (error) {
          // It seems when FreeType encounters an error while evaluating a glyph
          // that it completely ignores the glyph so we'll mimic that behaviour
          // here and put an endchar to make the validator happy.
          output = [14];
        }
        program.charstrings.push({
          glyphName: glyph,
          charstring: output,
          width: charString.width,
          lsb: charString.lsb,
          seac: charString.seac
        });
      }

      return program;
    },

    extractFontHeader: function Type1Parser_extractFontHeader(properties) {
      var token;
      while ((token = this.getToken()) !== null) {
        if (token !== '/') {
          continue;
        }
        token = this.getToken();
        switch (token) {
          case 'FontMatrix':
            var matrix = this.readNumberArray();
            properties.fontMatrix = matrix;
            break;
          case 'Encoding':
            var encodingArg = this.getToken();
            var encoding;
            if (!/^\d+$/.test(encodingArg)) {
              // encoding name is specified
              encoding = Encodings[encodingArg];
            } else {
              encoding = [];
              var size = parseInt(encodingArg, 10) | 0;
              this.getToken(); // read in 'array'

              for (var j = 0; j < size; j++) {
                token = this.getToken();
                // skipping till first dup or def (e.g. ignoring for statement)
                while (token !== 'dup' && token !== 'def') {
                  token = this.getToken();
                  if (token === null) {
                    return; // invalid header
                  }
                }
                if (token === 'def') {
                  break; // read all array data
                }
                var index = this.readInt();
                this.getToken(); // read in '/'
                var glyph = this.getToken();
                encoding[index] = glyph;
                this.getToken(); // read the in 'put'
              }
            }
            properties.builtInEncoding = encoding;
            break;
          case 'FontBBox':
            var fontBBox = this.readNumberArray();
            // adjusting ascent/descent
            properties.ascent = fontBBox[3];
            properties.descent = fontBBox[1];
            properties.ascentScaled = true;
            break;
        }
      }
    }
  };

  return Type1Parser;
})();

/**
 * The CFF class takes a Type1 file and wrap it into a
 * 'Compact Font Format' which itself embed Type2 charstrings.
 */
var CFFStandardStrings = [
  '.notdef', 'space', 'exclam', 'quotedbl', 'numbersign', 'dollar', 'percent',
  'ampersand', 'quoteright', 'parenleft', 'parenright', 'asterisk', 'plus',
  'comma', 'hyphen', 'period', 'slash', 'zero', 'one', 'two', 'three', 'four',
  'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon', 'less',
  'equal', 'greater', 'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
  'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W',
  'X', 'Y', 'Z', 'bracketleft', 'backslash', 'bracketright', 'asciicircum',
  'underscore', 'quoteleft', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
  'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y',
  'z', 'braceleft', 'bar', 'braceright', 'asciitilde', 'exclamdown', 'cent',
  'sterling', 'fraction', 'yen', 'florin', 'section', 'currency',
  'quotesingle', 'quotedblleft', 'guillemotleft', 'guilsinglleft',
  'guilsinglright', 'fi', 'fl', 'endash', 'dagger', 'daggerdbl',
  'periodcentered', 'paragraph', 'bullet', 'quotesinglbase', 'quotedblbase',
  'quotedblright', 'guillemotright', 'ellipsis', 'perthousand', 'questiondown',
  'grave', 'acute', 'circumflex', 'tilde', 'macron', 'breve', 'dotaccent',
  'dieresis', 'ring', 'cedilla', 'hungarumlaut', 'ogonek', 'caron', 'emdash',
  'AE', 'ordfeminine', 'Lslash', 'Oslash', 'OE', 'ordmasculine', 'ae',
  'dotlessi', 'lslash', 'oslash', 'oe', 'germandbls', 'onesuperior',
  'logicalnot', 'mu', 'trademark', 'Eth', 'onehalf', 'plusminus', 'Thorn',
  'onequarter', 'divide', 'brokenbar', 'degree', 'thorn', 'threequarters',
  'twosuperior', 'registered', 'minus', 'eth', 'multiply', 'threesuperior',
  'copyright', 'Aacute', 'Acircumflex', 'Adieresis', 'Agrave', 'Aring',
  'Atilde', 'Ccedilla', 'Eacute', 'Ecircumflex', 'Edieresis', 'Egrave',
  'Iacute', 'Icircumflex', 'Idieresis', 'Igrave', 'Ntilde', 'Oacute',
  'Ocircumflex', 'Odieresis', 'Ograve', 'Otilde', 'Scaron', 'Uacute',
  'Ucircumflex', 'Udieresis', 'Ugrave', 'Yacute', 'Ydieresis', 'Zcaron',
  'aacute', 'acircumflex', 'adieresis', 'agrave', 'aring', 'atilde',
  'ccedilla', 'eacute', 'ecircumflex', 'edieresis', 'egrave', 'iacute',
  'icircumflex', 'idieresis', 'igrave', 'ntilde', 'oacute', 'ocircumflex',
  'odieresis', 'ograve', 'otilde', 'scaron', 'uacute', 'ucircumflex',
  'udieresis', 'ugrave', 'yacute', 'ydieresis', 'zcaron', 'exclamsmall',
  'Hungarumlautsmall', 'dollaroldstyle', 'dollarsuperior', 'ampersandsmall',
  'Acutesmall', 'parenleftsuperior', 'parenrightsuperior', 'twodotenleader',
  'onedotenleader', 'zerooldstyle', 'oneoldstyle', 'twooldstyle',
  'threeoldstyle', 'fouroldstyle', 'fiveoldstyle', 'sixoldstyle',
  'sevenoldstyle', 'eightoldstyle', 'nineoldstyle', 'commasuperior',
  'threequartersemdash', 'periodsuperior', 'questionsmall', 'asuperior',
  'bsuperior', 'centsuperior', 'dsuperior', 'esuperior', 'isuperior',
  'lsuperior', 'msuperior', 'nsuperior', 'osuperior', 'rsuperior', 'ssuperior',
  'tsuperior', 'ff', 'ffi', 'ffl', 'parenleftinferior', 'parenrightinferior',
  'Circumflexsmall', 'hyphensuperior', 'Gravesmall', 'Asmall', 'Bsmall',
  'Csmall', 'Dsmall', 'Esmall', 'Fsmall', 'Gsmall', 'Hsmall', 'Ismall',
  'Jsmall', 'Ksmall', 'Lsmall', 'Msmall', 'Nsmall', 'Osmall', 'Psmall',
  'Qsmall', 'Rsmall', 'Ssmall', 'Tsmall', 'Usmall', 'Vsmall', 'Wsmall',
  'Xsmall', 'Ysmall', 'Zsmall', 'colonmonetary', 'onefitted', 'rupiah',
  'Tildesmall', 'exclamdownsmall', 'centoldstyle', 'Lslashsmall',
  'Scaronsmall', 'Zcaronsmall', 'Dieresissmall', 'Brevesmall', 'Caronsmall',
  'Dotaccentsmall', 'Macronsmall', 'figuredash', 'hypheninferior',
  'Ogoneksmall', 'Ringsmall', 'Cedillasmall', 'questiondownsmall', 'oneeighth',
  'threeeighths', 'fiveeighths', 'seveneighths', 'onethird', 'twothirds',
  'zerosuperior', 'foursuperior', 'fivesuperior', 'sixsuperior',
  'sevensuperior', 'eightsuperior', 'ninesuperior', 'zeroinferior',
  'oneinferior', 'twoinferior', 'threeinferior', 'fourinferior',
  'fiveinferior', 'sixinferior', 'seveninferior', 'eightinferior',
  'nineinferior', 'centinferior', 'dollarinferior', 'periodinferior',
  'commainferior', 'Agravesmall', 'Aacutesmall', 'Acircumflexsmall',
  'Atildesmall', 'Adieresissmall', 'Aringsmall', 'AEsmall', 'Ccedillasmall',
  'Egravesmall', 'Eacutesmall', 'Ecircumflexsmall', 'Edieresissmall',
  'Igravesmall', 'Iacutesmall', 'Icircumflexsmall', 'Idieresissmall',
  'Ethsmall', 'Ntildesmall', 'Ogravesmall', 'Oacutesmall', 'Ocircumflexsmall',
  'Otildesmall', 'Odieresissmall', 'OEsmall', 'Oslashsmall', 'Ugravesmall',
  'Uacutesmall', 'Ucircumflexsmall', 'Udieresissmall', 'Yacutesmall',
  'Thornsmall', 'Ydieresissmall', '001.000', '001.001', '001.002', '001.003',
  'Black', 'Bold', 'Book', 'Light', 'Medium', 'Regular', 'Roman', 'Semibold'
];

// Type1Font is also a CIDFontType0.
var Type1Font = function Type1Font(name, file, properties) {
  // Some bad generators embed pfb file as is, we have to strip 6-byte headers.
  // Also, length1 and length2 might be off by 6 bytes as well.
  // http://www.math.ubc.ca/~cass/piscript/type1.pdf
  var PFB_HEADER_SIZE = 6;
  var headerBlockLength = properties.length1;
  var eexecBlockLength = properties.length2;
  var pfbHeader = file.peekBytes(PFB_HEADER_SIZE);
  var pfbHeaderPresent = pfbHeader[0] === 0x80 && pfbHeader[1] === 0x01;
  if (pfbHeaderPresent) {
    file.skip(PFB_HEADER_SIZE);
    headerBlockLength = (pfbHeader[5] << 24) | (pfbHeader[4] << 16) |
                        (pfbHeader[3] << 8) | pfbHeader[2];
  }

  // Get the data block containing glyphs and subrs informations
  var headerBlock = new Stream(file.getBytes(headerBlockLength));
  var headerBlockParser = new Type1Parser(headerBlock);
  headerBlockParser.extractFontHeader(properties);

  if (pfbHeaderPresent) {
    pfbHeader = file.getBytes(PFB_HEADER_SIZE);
    eexecBlockLength = (pfbHeader[5] << 24) | (pfbHeader[4] << 16) |
                       (pfbHeader[3] << 8) | pfbHeader[2];
  }

  // Decrypt the data blocks and retrieve it's content
  var eexecBlock = new Stream(file.getBytes(eexecBlockLength));
  var eexecBlockParser = new Type1Parser(eexecBlock, true);
  var data = eexecBlockParser.extractFontProgram();
  for (var info in data.properties) {
    properties[info] = data.properties[info];
  }

  var charstrings = data.charstrings;
  var type2Charstrings = this.getType2Charstrings(charstrings);
  var subrs = this.getType2Subrs(data.subrs);

  this.charstrings = charstrings;
  this.data = this.wrap(name, type2Charstrings, this.charstrings,
                        subrs, properties);
  this.seacs = this.getSeacs(data.charstrings);
};

Type1Font.prototype = {
  get numGlyphs() {
    return this.charstrings.length + 1;
  },

  getCharset: function Type1Font_getCharset() {
    var charset = ['.notdef'];
    var charstrings = this.charstrings;
    for (var glyphId = 0; glyphId < charstrings.length; glyphId++) {
      charset.push(charstrings[glyphId].glyphName);
    }
    return charset;
  },

  getGlyphMapping: function Type1Font_getGlyphMapping(properties) {
    var charstrings = this.charstrings;
    var glyphNames = ['.notdef'], glyphId;
    for (glyphId = 0; glyphId < charstrings.length; glyphId++) {
      glyphNames.push(charstrings[glyphId].glyphName);
    }
    var encoding = properties.builtInEncoding;
    if (encoding) {
      var builtInEncoding = {};
      for (var charCode in encoding) {
        glyphId = glyphNames.indexOf(encoding[charCode]);
        if (glyphId >= 0) {
          builtInEncoding[charCode] = glyphId;
        }
      }
    }

    return type1FontGlyphMapping(properties, builtInEncoding, glyphNames);
  },

  getSeacs: function Type1Font_getSeacs(charstrings) {
    var i, ii;
    var seacMap = [];
    for (i = 0, ii = charstrings.length; i < ii; i++) {
      var charstring = charstrings[i];
      if (charstring.seac) {
        // Offset by 1 for .notdef
        seacMap[i + 1] = charstring.seac;
      }
    }
    return seacMap;
  },

  getType2Charstrings: function Type1Font_getType2Charstrings(
                                  type1Charstrings) {
    var type2Charstrings = [];
    for (var i = 0, ii = type1Charstrings.length; i < ii; i++) {
      type2Charstrings.push(type1Charstrings[i].charstring);
    }
    return type2Charstrings;
  },

  getType2Subrs: function Type1Font_getType2Subrs(type1Subrs) {
    var bias = 0;
    var count = type1Subrs.length;
    if (count < 1133) {
      bias = 107;
    } else if (count < 33769) {
      bias = 1131;
    } else {
      bias = 32768;
    }

    // Add a bunch of empty subrs to deal with the Type2 bias
    var type2Subrs = [];
    var i;
    for (i = 0; i < bias; i++) {
      type2Subrs.push([0x0B]);
    }

    for (i = 0; i < count; i++) {
      type2Subrs.push(type1Subrs[i]);
    }

    return type2Subrs;
  },

  wrap: function Type1Font_wrap(name, glyphs, charstrings, subrs, properties) {
    var cff = new CFF();
    cff.header = new CFFHeader(1, 0, 4, 4);

    cff.names = [name];

    var topDict = new CFFTopDict();
    // CFF strings IDs 0...390 are predefined names, so refering
    // to entries in our own String INDEX starts at SID 391.
    topDict.setByName('version', 391);
    topDict.setByName('Notice', 392);
    topDict.setByName('FullName', 393);
    topDict.setByName('FamilyName', 394);
    topDict.setByName('Weight', 395);
    topDict.setByName('Encoding', null); // placeholder
    topDict.setByName('FontMatrix', properties.fontMatrix);
    topDict.setByName('FontBBox', properties.bbox);
    topDict.setByName('charset', null); // placeholder
    topDict.setByName('CharStrings', null); // placeholder
    topDict.setByName('Private', null); // placeholder
    cff.topDict = topDict;

    var strings = new CFFStrings();
    strings.add('Version 0.11'); // Version
    strings.add('See original notice'); // Notice
    strings.add(name); // FullName
    strings.add(name); // FamilyName
    strings.add('Medium'); // Weight
    cff.strings = strings;

    cff.globalSubrIndex = new CFFIndex();

    var count = glyphs.length;
    var charsetArray = [0];
    var i, ii;
    for (i = 0; i < count; i++) {
      var index = CFFStandardStrings.indexOf(charstrings[i].glyphName);
      // TODO: Insert the string and correctly map it.  Previously it was
      // thought mapping names that aren't in the standard strings to .notdef
      // was fine, however in issue818 when mapping them all to .notdef the
      // adieresis glyph no longer worked.
      if (index === -1) {
        index = 0;
      }
      charsetArray.push((index >> 8) & 0xff, index & 0xff);
    }
    cff.charset = new CFFCharset(false, 0, [], charsetArray);

    var charStringsIndex = new CFFIndex();
    charStringsIndex.add([0x8B, 0x0E]); // .notdef
    for (i = 0; i < count; i++) {
      charStringsIndex.add(glyphs[i]);
    }
    cff.charStrings = charStringsIndex;

    var privateDict = new CFFPrivateDict();
    privateDict.setByName('Subrs', null); // placeholder
    var fields = [
      'BlueValues',
      'OtherBlues',
      'FamilyBlues',
      'FamilyOtherBlues',
      'StemSnapH',
      'StemSnapV',
      'BlueShift',
      'BlueFuzz',
      'BlueScale',
      'LanguageGroup',
      'ExpansionFactor',
      'ForceBold',
      'StdHW',
      'StdVW'
    ];
    for (i = 0, ii = fields.length; i < ii; i++) {
      var field = fields[i];
      if (!properties.privateData.hasOwnProperty(field)) {
        continue;
      }
      var value = properties.privateData[field];
      if (isArray(value)) {
        // All of the private dictionary array data in CFF must be stored as
        // "delta-encoded" numbers.
        for (var j = value.length - 1; j > 0; j--) {
          value[j] -= value[j - 1]; // ... difference from previous value
        }
      }
      privateDict.setByName(field, value);
    }
    cff.topDict.privateDict = privateDict;

    var subrIndex = new CFFIndex();
    for (i = 0, ii = subrs.length; i < ii; i++) {
      subrIndex.add(subrs[i]);
    }
    privateDict.subrsIndex = subrIndex;

    var compiler = new CFFCompiler(cff);
    return compiler.compile();
  }
};

var CFFFont = (function CFFFontClosure() {
  function CFFFont(file, properties) {
    this.properties = properties;

    var parser = new CFFParser(file, properties);
    this.cff = parser.parse();
    var compiler = new CFFCompiler(this.cff);
    this.seacs = this.cff.seacs;
    try {
      this.data = compiler.compile();
    } catch (e) {
      warn('Failed to compile font ' + properties.loadedName);
      // There may have just been an issue with the compiler, set the data
      // anyway and hope the font loaded.
      this.data = file;
    }
  }

  CFFFont.prototype = {
    get numGlyphs() {
      return this.cff.charStrings.count;
    },
    getCharset: function CFFFont_getCharset() {
      return this.cff.charset.charset;
    },
    getGlyphMapping: function CFFFont_getGlyphMapping() {
      var cff = this.cff;
      var properties = this.properties;
      var charsets = cff.charset.charset;
      var charCodeToGlyphId;
      var glyphId;

      if (properties.composite) {
        charCodeToGlyphId = Object.create(null);
        if (cff.isCIDFont) {
          // If the font is actually a CID font then we should use the charset
          // to map CIDs to GIDs.
          for (glyphId = 0; glyphId < charsets.length; glyphId++) {
            var cid = charsets[glyphId];
            var charCode = properties.cMap.charCodeOf(cid);
            charCodeToGlyphId[charCode] = glyphId;
          }
        } else {
          // If it is NOT actually a CID font then CIDs should be mapped
          // directly to GIDs.
          for (glyphId = 0; glyphId < cff.charStrings.count; glyphId++) {
            charCodeToGlyphId[glyphId] = glyphId;
          }
        }
        return charCodeToGlyphId;
      }

      var encoding = cff.encoding ? cff.encoding.encoding : null;
      charCodeToGlyphId = type1FontGlyphMapping(properties, encoding, charsets);
      return charCodeToGlyphId;
    }
  };

  return CFFFont;
})();

var CFFParser = (function CFFParserClosure() {
  var CharstringValidationData = [
    null,
    { id: 'hstem', min: 2, stackClearing: true, stem: true },
    null,
    { id: 'vstem', min: 2, stackClearing: true, stem: true },
    { id: 'vmoveto', min: 1, stackClearing: true },
    { id: 'rlineto', min: 2, resetStack: true },
    { id: 'hlineto', min: 1, resetStack: true },
    { id: 'vlineto', min: 1, resetStack: true },
    { id: 'rrcurveto', min: 6, resetStack: true },
    null,
    { id: 'callsubr', min: 1, undefStack: true },
    { id: 'return', min: 0, undefStack: true },
    null, // 12
    null,
    { id: 'endchar', min: 0, stackClearing: true },
    null,
    null,
    null,
    { id: 'hstemhm', min: 2, stackClearing: true, stem: true },
    { id: 'hintmask', min: 0, stackClearing: true },
    { id: 'cntrmask', min: 0, stackClearing: true },
    { id: 'rmoveto', min: 2, stackClearing: true },
    { id: 'hmoveto', min: 1, stackClearing: true },
    { id: 'vstemhm', min: 2, stackClearing: true, stem: true },
    { id: 'rcurveline', min: 8, resetStack: true },
    { id: 'rlinecurve', min: 8, resetStack: true },
    { id: 'vvcurveto', min: 4, resetStack: true },
    { id: 'hhcurveto', min: 4, resetStack: true },
    null, // shortint
    { id: 'callgsubr', min: 1, undefStack: true },
    { id: 'vhcurveto', min: 4, resetStack: true },
    { id: 'hvcurveto', min: 4, resetStack: true }
  ];
  var CharstringValidationData12 = [
    null,
    null,
    null,
    { id: 'and', min: 2, stackDelta: -1 },
    { id: 'or', min: 2, stackDelta: -1 },
    { id: 'not', min: 1, stackDelta: 0 },
    null,
    null,
    null,
    { id: 'abs', min: 1, stackDelta: 0 },
    { id: 'add', min: 2, stackDelta: -1,
      stackFn: function stack_div(stack, index) {
        stack[index - 2] = stack[index - 2] + stack[index - 1];
      }
    },
    { id: 'sub', min: 2, stackDelta: -1,
      stackFn: function stack_div(stack, index) {
        stack[index - 2] = stack[index - 2] - stack[index - 1];
      }
    },
    { id: 'div', min: 2, stackDelta: -1,
      stackFn: function stack_div(stack, index) {
        stack[index - 2] = stack[index - 2] / stack[index - 1];
      }
    },
    null,
    { id: 'neg', min: 1, stackDelta: 0,
      stackFn: function stack_div(stack, index) {
        stack[index - 1] = -stack[index - 1];
      }
    },
    { id: 'eq', min: 2, stackDelta: -1 },
    null,
    null,
    { id: 'drop', min: 1, stackDelta: -1 },
    null,
    { id: 'put', min: 2, stackDelta: -2 },
    { id: 'get', min: 1, stackDelta: 0 },
    { id: 'ifelse', min: 4, stackDelta: -3 },
    { id: 'random', min: 0, stackDelta: 1 },
    { id: 'mul', min: 2, stackDelta: -1,
      stackFn: function stack_div(stack, index) {
        stack[index - 2] = stack[index - 2] * stack[index - 1];
      }
    },
    null,
    { id: 'sqrt', min: 1, stackDelta: 0 },
    { id: 'dup', min: 1, stackDelta: 1 },
    { id: 'exch', min: 2, stackDelta: 0 },
    { id: 'index', min: 2, stackDelta: 0 },
    { id: 'roll', min: 3, stackDelta: -2 },
    null,
    null,
    null,
    { id: 'hflex', min: 7, resetStack: true },
    { id: 'flex', min: 13, resetStack: true },
    { id: 'hflex1', min: 9, resetStack: true },
    { id: 'flex1', min: 11, resetStack: true }
  ];

  function CFFParser(file, properties) {
    this.bytes = file.getBytes();
    this.properties = properties;
  }
  CFFParser.prototype = {
    parse: function CFFParser_parse() {
      var properties = this.properties;
      var cff = new CFF();
      this.cff = cff;

      // The first five sections must be in order, all the others are reached
      // via offsets contained in one of the below.
      var header = this.parseHeader();
      var nameIndex = this.parseIndex(header.endPos);
      var topDictIndex = this.parseIndex(nameIndex.endPos);
      var stringIndex = this.parseIndex(topDictIndex.endPos);
      var globalSubrIndex = this.parseIndex(stringIndex.endPos);

      var topDictParsed = this.parseDict(topDictIndex.obj.get(0));
      var topDict = this.createDict(CFFTopDict, topDictParsed, cff.strings);

      cff.header = header.obj;
      cff.names = this.parseNameIndex(nameIndex.obj);
      cff.strings = this.parseStringIndex(stringIndex.obj);
      cff.topDict = topDict;
      cff.globalSubrIndex = globalSubrIndex.obj;

      this.parsePrivateDict(cff.topDict);

      cff.isCIDFont = topDict.hasName('ROS');

      var charStringOffset = topDict.getByName('CharStrings');
      var charStringsAndSeacs = this.parseCharStrings(charStringOffset);
      cff.charStrings = charStringsAndSeacs.charStrings;
      cff.seacs = charStringsAndSeacs.seacs;
      cff.widths = charStringsAndSeacs.widths;

      var fontMatrix = topDict.getByName('FontMatrix');
      if (fontMatrix) {
        properties.fontMatrix = fontMatrix;
      }

      var fontBBox = topDict.getByName('FontBBox');
      if (fontBBox) {
        // adjusting ascent/descent
        properties.ascent = fontBBox[3];
        properties.descent = fontBBox[1];
        properties.ascentScaled = true;
      }

      var charset, encoding;
      if (cff.isCIDFont) {
        var fdArrayIndex = this.parseIndex(topDict.getByName('FDArray')).obj;
        for (var i = 0, ii = fdArrayIndex.count; i < ii; ++i) {
          var dictRaw = fdArrayIndex.get(i);
          var fontDict = this.createDict(CFFTopDict, this.parseDict(dictRaw),
                                         cff.strings);
          this.parsePrivateDict(fontDict);
          cff.fdArray.push(fontDict);
        }
        // cid fonts don't have an encoding
        encoding = null;
        charset = this.parseCharsets(topDict.getByName('charset'),
                                     cff.charStrings.count, cff.strings, true);
        cff.fdSelect = this.parseFDSelect(topDict.getByName('FDSelect'),
                                             cff.charStrings.count);
      } else {
        charset = this.parseCharsets(topDict.getByName('charset'),
                                     cff.charStrings.count, cff.strings, false);
        encoding = this.parseEncoding(topDict.getByName('Encoding'),
                                      properties,
                                      cff.strings, charset.charset);
      }
      cff.charset = charset;
      cff.encoding = encoding;

      return cff;
    },
    parseHeader: function CFFParser_parseHeader() {
      var bytes = this.bytes;
      var bytesLength = bytes.length;
      var offset = 0;

      // Prevent an infinite loop, by checking that the offset is within the
      // bounds of the bytes array. Necessary in empty, or invalid, font files.
      while (offset < bytesLength && bytes[offset] !== 1) {
        ++offset;
      }
      if (offset >= bytesLength) {
        error('Invalid CFF header');
      } else if (offset !== 0) {
        info('cff data is shifted');
        bytes = bytes.subarray(offset);
        this.bytes = bytes;
      }
      var major = bytes[0];
      var minor = bytes[1];
      var hdrSize = bytes[2];
      var offSize = bytes[3];
      var header = new CFFHeader(major, minor, hdrSize, offSize);
      return { obj: header, endPos: hdrSize };
    },
    parseDict: function CFFParser_parseDict(dict) {
      var pos = 0;

      function parseOperand() {
        var value = dict[pos++];
        if (value === 30) {
          return parseFloatOperand(pos);
        } else if (value === 28) {
          value = dict[pos++];
          value = ((value << 24) | (dict[pos++] << 16)) >> 16;
          return value;
        } else if (value === 29) {
          value = dict[pos++];
          value = (value << 8) | dict[pos++];
          value = (value << 8) | dict[pos++];
          value = (value << 8) | dict[pos++];
          return value;
        } else if (value >= 32 && value <= 246) {
          return value - 139;
        } else if (value >= 247 && value <= 250) {
          return ((value - 247) * 256) + dict[pos++] + 108;
        } else if (value >= 251 && value <= 254) {
          return -((value - 251) * 256) - dict[pos++] - 108;
        } else {
          error('255 is not a valid DICT command');
        }
        return -1;
      }

      function parseFloatOperand() {
        var str = '';
        var eof = 15;
        var lookup = ['0', '1', '2', '3', '4', '5', '6', '7', '8',
            '9', '.', 'E', 'E-', null, '-'];
        var length = dict.length;
        while (pos < length) {
          var b = dict[pos++];
          var b1 = b >> 4;
          var b2 = b & 15;

          if (b1 === eof) {
            break;
          }
          str += lookup[b1];

          if (b2 === eof) {
            break;
          }
          str += lookup[b2];
        }
        return parseFloat(str);
      }

      var operands = [];
      var entries = [];

      pos = 0;
      var end = dict.length;
      while (pos < end) {
        var b = dict[pos];
        if (b <= 21) {
          if (b === 12) {
            b = (b << 8) | dict[++pos];
          }
          entries.push([b, operands]);
          operands = [];
          ++pos;
        } else {
          operands.push(parseOperand());
        }
      }
      return entries;
    },
    parseIndex: function CFFParser_parseIndex(pos) {
      var cffIndex = new CFFIndex();
      var bytes = this.bytes;
      var count = (bytes[pos++] << 8) | bytes[pos++];
      var offsets = [];
      var end = pos;
      var i, ii;

      if (count !== 0) {
        var offsetSize = bytes[pos++];
        // add 1 for offset to determine size of last object
        var startPos = pos + ((count + 1) * offsetSize) - 1;

        for (i = 0, ii = count + 1; i < ii; ++i) {
          var offset = 0;
          for (var j = 0; j < offsetSize; ++j) {
            offset <<= 8;
            offset += bytes[pos++];
          }
          offsets.push(startPos + offset);
        }
        end = offsets[count];
      }
      for (i = 0, ii = offsets.length - 1; i < ii; ++i) {
        var offsetStart = offsets[i];
        var offsetEnd = offsets[i + 1];
        cffIndex.add(bytes.subarray(offsetStart, offsetEnd));
      }
      return {obj: cffIndex, endPos: end};
    },
    parseNameIndex: function CFFParser_parseNameIndex(index) {
      var names = [];
      for (var i = 0, ii = index.count; i < ii; ++i) {
        var name = index.get(i);
        // OTS doesn't allow names to be over 127 characters.
        var length = Math.min(name.length, 127);
        var data = [];
        // OTS also only permits certain characters in the name.
        for (var j = 0; j < length; ++j) {
          var c = name[j];
          if (j === 0 && c === 0) {
            data[j] = c;
            continue;
          }
          if ((c < 33 || c > 126) || c === 91 /* [ */ || c === 93 /* ] */ ||
              c === 40 /* ( */ || c === 41 /* ) */ || c === 123 /* { */ ||
              c === 125 /* } */ || c === 60 /* < */ || c === 62 /* > */ ||
              c === 47 /* / */ || c === 37 /* % */ || c === 35 /* # */) {
            data[j] = 95;
            continue;
          }
          data[j] = c;
        }
        names.push(bytesToString(data));
      }
      return names;
    },
    parseStringIndex: function CFFParser_parseStringIndex(index) {
      var strings = new CFFStrings();
      for (var i = 0, ii = index.count; i < ii; ++i) {
        var data = index.get(i);
        strings.add(bytesToString(data));
      }
      return strings;
    },
    createDict: function CFFParser_createDict(Type, dict, strings) {
      var cffDict = new Type(strings);
      for (var i = 0, ii = dict.length; i < ii; ++i) {
        var pair = dict[i];
        var key = pair[0];
        var value = pair[1];
        cffDict.setByKey(key, value);
      }
      return cffDict;
    },
    parseCharStrings: function CFFParser_parseCharStrings(charStringOffset) {
      var charStrings = this.parseIndex(charStringOffset).obj;
      var seacs = [];
      var widths = [];
      var count = charStrings.count;
      for (var i = 0; i < count; i++) {
        var charstring = charStrings.get(i);

        var stackSize = 0;
        var stack = [];
        var undefStack = true;
        var hints = 0;
        var valid = true;
        var data = charstring;
        var length = data.length;
        var firstStackClearing = true;
        for (var j = 0; j < length;) {
          var value = data[j++];
          var validationCommand = null;
          if (value === 12) {
            var q = data[j++];
            if (q === 0) {
              // The CFF specification state that the 'dotsection' command
              // (12, 0) is deprecated and treated as a no-op, but all Type2
              // charstrings processors should support them. Unfortunately
              // the font sanitizer don't. As a workaround the sequence (12, 0)
              // is replaced by a useless (0, hmoveto).
              data[j - 2] = 139;
              data[j - 1] = 22;
              stackSize = 0;
            } else {
              validationCommand = CharstringValidationData12[q];
            }
          } else if (value === 28) { // number (16 bit)
            stack[stackSize] = ((data[j] << 24) | (data[j + 1] << 16)) >> 16;
            j += 2;
            stackSize++;
          } else if (value === 14) {
            if (stackSize >= 4) {
              stackSize -= 4;
              if (SEAC_ANALYSIS_ENABLED) {
                seacs[i] = stack.slice(stackSize, stackSize + 4);
                valid = false;
              }
            }
            validationCommand = CharstringValidationData[value];
          } else if (value >= 32 && value <= 246) {  // number
            stack[stackSize] = value - 139;
            stackSize++;
          } else if (value >= 247 && value <= 254) {  // number (+1 bytes)
            stack[stackSize] = (value < 251 ?
                                ((value - 247) << 8) + data[j] + 108 :
                                -((value - 251) << 8) - data[j] - 108);
            j++;
            stackSize++;
          } else if (value === 255) {  // number (32 bit)
            stack[stackSize] = ((data[j] << 24) | (data[j + 1] << 16) |
                                (data[j + 2] << 8) | data[j + 3]) / 65536;
            j += 4;
            stackSize++;
          } else if (value === 19 || value === 20) {
            hints += stackSize >> 1;
            j += (hints + 7) >> 3; // skipping right amount of hints flag data
            stackSize %= 2;
            validationCommand = CharstringValidationData[value];
          } else {
            validationCommand = CharstringValidationData[value];
          }
          if (validationCommand) {
            if (validationCommand.stem) {
              hints += stackSize >> 1;
            }
            if ('min' in validationCommand) {
              if (!undefStack && stackSize < validationCommand.min) {
                warn('Not enough parameters for ' + validationCommand.id +
                     '; actual: ' + stackSize +
                     ', expected: ' + validationCommand.min);
                valid = false;
                break;
              }
            }
            if (firstStackClearing && validationCommand.stackClearing) {
              firstStackClearing = false;
              // the optional character width can be found before the first
              // stack-clearing command arguments
              stackSize -= validationCommand.min;
              if (stackSize >= 2 && validationCommand.stem) {
                // there are even amount of arguments for stem commands
                stackSize %= 2;
              } else if (stackSize > 1) {
                warn('Found too many parameters for stack-clearing command');
              }
              if (stackSize > 0 && stack[stackSize - 1] >= 0) {
                widths[i] = stack[stackSize - 1];
              }
            }
            if ('stackDelta' in validationCommand) {
              if ('stackFn' in validationCommand) {
                validationCommand.stackFn(stack, stackSize);
              }
              stackSize += validationCommand.stackDelta;
            } else if (validationCommand.stackClearing) {
              stackSize = 0;
            } else if (validationCommand.resetStack) {
              stackSize = 0;
              undefStack = false;
            } else if (validationCommand.undefStack) {
              stackSize = 0;
              undefStack = true;
              firstStackClearing = false;
            }
          }
        }
        if (!valid) {
          // resetting invalid charstring to single 'endchar'
          charStrings.set(i, new Uint8Array([14]));
        }
      }
      return { charStrings: charStrings, seacs: seacs, widths: widths };
    },
    emptyPrivateDictionary:
      function CFFParser_emptyPrivateDictionary(parentDict) {
      var privateDict = this.createDict(CFFPrivateDict, [],
                                        parentDict.strings);
      parentDict.setByKey(18, [0, 0]);
      parentDict.privateDict = privateDict;
    },
    parsePrivateDict: function CFFParser_parsePrivateDict(parentDict) {
      // no private dict, do nothing
      if (!parentDict.hasName('Private')) {
        this.emptyPrivateDictionary(parentDict);
        return;
      }
      var privateOffset = parentDict.getByName('Private');
      // make sure the params are formatted correctly
      if (!isArray(privateOffset) || privateOffset.length !== 2) {
        parentDict.removeByName('Private');
        return;
      }
      var size = privateOffset[0];
      var offset = privateOffset[1];
      // remove empty dicts or ones that refer to invalid location
      if (size === 0 || offset >= this.bytes.length) {
        this.emptyPrivateDictionary(parentDict);
        return;
      }

      var privateDictEnd = offset + size;
      var dictData = this.bytes.subarray(offset, privateDictEnd);
      var dict = this.parseDict(dictData);
      var privateDict = this.createDict(CFFPrivateDict, dict,
                                        parentDict.strings);
      parentDict.privateDict = privateDict;

      // Parse the Subrs index also since it's relative to the private dict.
      if (!privateDict.getByName('Subrs')) {
        return;
      }
      var subrsOffset = privateDict.getByName('Subrs');
      var relativeOffset = offset + subrsOffset;
      // Validate the offset.
      if (subrsOffset === 0 || relativeOffset >= this.bytes.length) {
        this.emptyPrivateDictionary(parentDict);
        return;
      }
      var subrsIndex = this.parseIndex(relativeOffset);
      privateDict.subrsIndex = subrsIndex.obj;
    },
    parseCharsets: function CFFParser_parseCharsets(pos, length, strings, cid) {
      if (pos === 0) {
        return new CFFCharset(true, CFFCharsetPredefinedTypes.ISO_ADOBE,
                              ISOAdobeCharset);
      } else if (pos === 1) {
        return new CFFCharset(true, CFFCharsetPredefinedTypes.EXPERT,
                              ExpertCharset);
      } else if (pos === 2) {
        return new CFFCharset(true, CFFCharsetPredefinedTypes.EXPERT_SUBSET,
                              ExpertSubsetCharset);
      }

      var bytes = this.bytes;
      var start = pos;
      var format = bytes[pos++];
      var charset = ['.notdef'];
      var id, count, i;

      // subtract 1 for the .notdef glyph
      length -= 1;

      switch (format) {
        case 0:
          for (i = 0; i < length; i++) {
            id = (bytes[pos++] << 8) | bytes[pos++];
            charset.push(cid ? id : strings.get(id));
          }
          break;
        case 1:
          while (charset.length <= length) {
            id = (bytes[pos++] << 8) | bytes[pos++];
            count = bytes[pos++];
            for (i = 0; i <= count; i++) {
              charset.push(cid ? id++ : strings.get(id++));
            }
          }
          break;
        case 2:
          while (charset.length <= length) {
            id = (bytes[pos++] << 8) | bytes[pos++];
            count = (bytes[pos++] << 8) | bytes[pos++];
            for (i = 0; i <= count; i++) {
              charset.push(cid ? id++ : strings.get(id++));
            }
          }
          break;
        default:
          error('Unknown charset format');
      }
      // Raw won't be needed if we actually compile the charset.
      var end = pos;
      var raw = bytes.subarray(start, end);

      return new CFFCharset(false, format, charset, raw);
    },
    parseEncoding: function CFFParser_parseEncoding(pos,
                                                    properties,
                                                    strings,
                                                    charset) {
      var encoding = {};
      var bytes = this.bytes;
      var predefined = false;
      var hasSupplement = false;
      var format, i, ii;
      var raw = null;

      function readSupplement() {
        var supplementsCount = bytes[pos++];
        for (i = 0; i < supplementsCount; i++) {
          var code = bytes[pos++];
          var sid = (bytes[pos++] << 8) + (bytes[pos++] & 0xff);
          encoding[code] = charset.indexOf(strings.get(sid));
        }
      }

      if (pos === 0 || pos === 1) {
        predefined = true;
        format = pos;
        var baseEncoding = pos ? Encodings.ExpertEncoding :
                                 Encodings.StandardEncoding;
        for (i = 0, ii = charset.length; i < ii; i++) {
          var index = baseEncoding.indexOf(charset[i]);
          if (index !== -1) {
            encoding[index] = i;
          }
        }
      } else {
        var dataStart = pos;
        format = bytes[pos++];
        switch (format & 0x7f) {
          case 0:
            var glyphsCount = bytes[pos++];
            for (i = 1; i <= glyphsCount; i++) {
              encoding[bytes[pos++]] = i;
            }
            break;

          case 1:
            var rangesCount = bytes[pos++];
            var gid = 1;
            for (i = 0; i < rangesCount; i++) {
              var start = bytes[pos++];
              var left = bytes[pos++];
              for (var j = start; j <= start + left; j++) {
                encoding[j] = gid++;
              }
            }
            break;

          default:
            error('Unknow encoding format: ' + format + ' in CFF');
            break;
        }
        var dataEnd = pos;
        if (format & 0x80) {
          // The font sanitizer does not support CFF encoding with a
          // supplement, since the encoding is not really used to map
          // between gid to glyph, let's overwrite what is declared in
          // the top dictionary to let the sanitizer think the font use
          // StandardEncoding, that's a lie but that's ok.
          bytes[dataStart] &= 0x7f;
          readSupplement();
          hasSupplement = true;
        }
        raw = bytes.subarray(dataStart, dataEnd);
      }
      format = format & 0x7f;
      return new CFFEncoding(predefined, format, encoding, raw);
    },
    parseFDSelect: function CFFParser_parseFDSelect(pos, length) {
      var start = pos;
      var bytes = this.bytes;
      var format = bytes[pos++];
      var fdSelect = [];
      var i;

      switch (format) {
        case 0:
          for (i = 0; i < length; ++i) {
            var id = bytes[pos++];
            fdSelect.push(id);
          }
          break;
        case 3:
          var rangesCount = (bytes[pos++] << 8) | bytes[pos++];
          for (i = 0; i < rangesCount; ++i) {
            var first = (bytes[pos++] << 8) | bytes[pos++];
            var fdIndex = bytes[pos++];
            var next = (bytes[pos] << 8) | bytes[pos + 1];
            for (var j = first; j < next; ++j) {
              fdSelect.push(fdIndex);
            }
          }
          // Advance past the sentinel(next).
          pos += 2;
          break;
        default:
          error('Unknown fdselect format ' + format);
          break;
      }
      var end = pos;
      return new CFFFDSelect(fdSelect, bytes.subarray(start, end));
    }
  };
  return CFFParser;
})();

// Compact Font Format
var CFF = (function CFFClosure() {
  function CFF() {
    this.header = null;
    this.names = [];
    this.topDict = null;
    this.strings = new CFFStrings();
    this.globalSubrIndex = null;

    // The following could really be per font, but since we only have one font
    // store them here.
    this.encoding = null;
    this.charset = null;
    this.charStrings = null;
    this.fdArray = [];
    this.fdSelect = null;

    this.isCIDFont = false;
  }
  return CFF;
})();

var CFFHeader = (function CFFHeaderClosure() {
  function CFFHeader(major, minor, hdrSize, offSize) {
    this.major = major;
    this.minor = minor;
    this.hdrSize = hdrSize;
    this.offSize = offSize;
  }
  return CFFHeader;
})();

var CFFStrings = (function CFFStringsClosure() {
  function CFFStrings() {
    this.strings = [];
  }
  CFFStrings.prototype = {
    get: function CFFStrings_get(index) {
      if (index >= 0 && index <= 390) {
        return CFFStandardStrings[index];
      }
      if (index - 391 <= this.strings.length) {
        return this.strings[index - 391];
      }
      return CFFStandardStrings[0];
    },
    add: function CFFStrings_add(value) {
      this.strings.push(value);
    },
    get count() {
      return this.strings.length;
    }
  };
  return CFFStrings;
})();

var CFFIndex = (function CFFIndexClosure() {
  function CFFIndex() {
    this.objects = [];
    this.length = 0;
  }
  CFFIndex.prototype = {
    add: function CFFIndex_add(data) {
      this.length += data.length;
      this.objects.push(data);
    },
    set: function CFFIndex_set(index, data) {
      this.length += data.length - this.objects[index].length;
      this.objects[index] = data;
    },
    get: function CFFIndex_get(index) {
      return this.objects[index];
    },
    get count() {
      return this.objects.length;
    }
  };
  return CFFIndex;
})();

var CFFDict = (function CFFDictClosure() {
  function CFFDict(tables, strings) {
    this.keyToNameMap = tables.keyToNameMap;
    this.nameToKeyMap = tables.nameToKeyMap;
    this.defaults = tables.defaults;
    this.types = tables.types;
    this.opcodes = tables.opcodes;
    this.order = tables.order;
    this.strings = strings;
    this.values = {};
  }
  CFFDict.prototype = {
    // value should always be an array
    setByKey: function CFFDict_setByKey(key, value) {
      if (!(key in this.keyToNameMap)) {
        return false;
      }
      // ignore empty values
      if (value.length === 0) {
        return true;
      }
      var type = this.types[key];
      // remove the array wrapping these types of values
      if (type === 'num' || type === 'sid' || type === 'offset') {
        value = value[0];
      }
      this.values[key] = value;
      return true;
    },
    setByName: function CFFDict_setByName(name, value) {
      if (!(name in this.nameToKeyMap)) {
        error('Invalid dictionary name "' + name + '"');
      }
      this.values[this.nameToKeyMap[name]] = value;
    },
    hasName: function CFFDict_hasName(name) {
      return this.nameToKeyMap[name] in this.values;
    },
    getByName: function CFFDict_getByName(name) {
      if (!(name in this.nameToKeyMap)) {
        error('Invalid dictionary name "' + name + '"');
      }
      var key = this.nameToKeyMap[name];
      if (!(key in this.values)) {
        return this.defaults[key];
      }
      return this.values[key];
    },
    removeByName: function CFFDict_removeByName(name) {
      delete this.values[this.nameToKeyMap[name]];
    }
  };
  CFFDict.createTables = function CFFDict_createTables(layout) {
    var tables = {
      keyToNameMap: {},
      nameToKeyMap: {},
      defaults: {},
      types: {},
      opcodes: {},
      order: []
    };
    for (var i = 0, ii = layout.length; i < ii; ++i) {
      var entry = layout[i];
      var key = isArray(entry[0]) ? (entry[0][0] << 8) + entry[0][1] : entry[0];
      tables.keyToNameMap[key] = entry[1];
      tables.nameToKeyMap[entry[1]] = key;
      tables.types[key] = entry[2];
      tables.defaults[key] = entry[3];
      tables.opcodes[key] = isArray(entry[0]) ? entry[0] : [entry[0]];
      tables.order.push(key);
    }
    return tables;
  };
  return CFFDict;
})();

var CFFTopDict = (function CFFTopDictClosure() {
  var layout = [
    [[12, 30], 'ROS', ['sid', 'sid', 'num'], null],
    [[12, 20], 'SyntheticBase', 'num', null],
    [0, 'version', 'sid', null],
    [1, 'Notice', 'sid', null],
    [[12, 0], 'Copyright', 'sid', null],
    [2, 'FullName', 'sid', null],
    [3, 'FamilyName', 'sid', null],
    [4, 'Weight', 'sid', null],
    [[12, 1], 'isFixedPitch', 'num', 0],
    [[12, 2], 'ItalicAngle', 'num', 0],
    [[12, 3], 'UnderlinePosition', 'num', -100],
    [[12, 4], 'UnderlineThickness', 'num', 50],
    [[12, 5], 'PaintType', 'num', 0],
    [[12, 6], 'CharstringType', 'num', 2],
    [[12, 7], 'FontMatrix', ['num', 'num', 'num', 'num', 'num', 'num'],
                            [0.001, 0, 0, 0.001, 0, 0]],
    [13, 'UniqueID', 'num', null],
    [5, 'FontBBox', ['num', 'num', 'num', 'num'], [0, 0, 0, 0]],
    [[12, 8], 'StrokeWidth', 'num', 0],
    [14, 'XUID', 'array', null],
    [15, 'charset', 'offset', 0],
    [16, 'Encoding', 'offset', 0],
    [17, 'CharStrings', 'offset', 0],
    [18, 'Private', ['offset', 'offset'], null],
    [[12, 21], 'PostScript', 'sid', null],
    [[12, 22], 'BaseFontName', 'sid', null],
    [[12, 23], 'BaseFontBlend', 'delta', null],
    [[12, 31], 'CIDFontVersion', 'num', 0],
    [[12, 32], 'CIDFontRevision', 'num', 0],
    [[12, 33], 'CIDFontType', 'num', 0],
    [[12, 34], 'CIDCount', 'num', 8720],
    [[12, 35], 'UIDBase', 'num', null],
    // XXX: CID Fonts on DirectWrite 6.1 only seem to work if FDSelect comes
    // before FDArray.
    [[12, 37], 'FDSelect', 'offset', null],
    [[12, 36], 'FDArray', 'offset', null],
    [[12, 38], 'FontName', 'sid', null]
  ];
  var tables = null;
  function CFFTopDict(strings) {
    if (tables === null) {
      tables = CFFDict.createTables(layout);
    }
    CFFDict.call(this, tables, strings);
    this.privateDict = null;
  }
  CFFTopDict.prototype = Object.create(CFFDict.prototype);
  return CFFTopDict;
})();

var CFFPrivateDict = (function CFFPrivateDictClosure() {
  var layout = [
    [6, 'BlueValues', 'delta', null],
    [7, 'OtherBlues', 'delta', null],
    [8, 'FamilyBlues', 'delta', null],
    [9, 'FamilyOtherBlues', 'delta', null],
    [[12, 9], 'BlueScale', 'num', 0.039625],
    [[12, 10], 'BlueShift', 'num', 7],
    [[12, 11], 'BlueFuzz', 'num', 1],
    [10, 'StdHW', 'num', null],
    [11, 'StdVW', 'num', null],
    [[12, 12], 'StemSnapH', 'delta', null],
    [[12, 13], 'StemSnapV', 'delta', null],
    [[12, 14], 'ForceBold', 'num', 0],
    [[12, 17], 'LanguageGroup', 'num', 0],
    [[12, 18], 'ExpansionFactor', 'num', 0.06],
    [[12, 19], 'initialRandomSeed', 'num', 0],
    [20, 'defaultWidthX', 'num', 0],
    [21, 'nominalWidthX', 'num', 0],
    [19, 'Subrs', 'offset', null]
  ];
  var tables = null;
  function CFFPrivateDict(strings) {
    if (tables === null) {
      tables = CFFDict.createTables(layout);
    }
    CFFDict.call(this, tables, strings);
    this.subrsIndex = null;
  }
  CFFPrivateDict.prototype = Object.create(CFFDict.prototype);
  return CFFPrivateDict;
})();

var CFFCharsetPredefinedTypes = {
  ISO_ADOBE: 0,
  EXPERT: 1,
  EXPERT_SUBSET: 2
};
var CFFCharset = (function CFFCharsetClosure() {
  function CFFCharset(predefined, format, charset, raw) {
    this.predefined = predefined;
    this.format = format;
    this.charset = charset;
    this.raw = raw;
  }
  return CFFCharset;
})();

var CFFEncoding = (function CFFEncodingClosure() {
  function CFFEncoding(predefined, format, encoding, raw) {
    this.predefined = predefined;
    this.format = format;
    this.encoding = encoding;
    this.raw = raw;
  }
  return CFFEncoding;
})();

var CFFFDSelect = (function CFFFDSelectClosure() {
  function CFFFDSelect(fdSelect, raw) {
    this.fdSelect = fdSelect;
    this.raw = raw;
  }
  return CFFFDSelect;
})();

// Helper class to keep track of where an offset is within the data and helps
// filling in that offset once it's known.
var CFFOffsetTracker = (function CFFOffsetTrackerClosure() {
  function CFFOffsetTracker() {
    this.offsets = {};
  }
  CFFOffsetTracker.prototype = {
    isTracking: function CFFOffsetTracker_isTracking(key) {
      return key in this.offsets;
    },
    track: function CFFOffsetTracker_track(key, location) {
      if (key in this.offsets) {
        error('Already tracking location of ' + key);
      }
      this.offsets[key] = location;
    },
    offset: function CFFOffsetTracker_offset(value) {
      for (var key in this.offsets) {
        this.offsets[key] += value;
      }
    },
    setEntryLocation: function CFFOffsetTracker_setEntryLocation(key,
                                                                 values,
                                                                 output) {
      if (!(key in this.offsets)) {
        error('Not tracking location of ' + key);
      }
      var data = output.data;
      var dataOffset = this.offsets[key];
      var size = 5;
      for (var i = 0, ii = values.length; i < ii; ++i) {
        var offset0 = i * size + dataOffset;
        var offset1 = offset0 + 1;
        var offset2 = offset0 + 2;
        var offset3 = offset0 + 3;
        var offset4 = offset0 + 4;
        // It's easy to screw up offsets so perform this sanity check.
        if (data[offset0] !== 0x1d || data[offset1] !== 0 ||
            data[offset2] !== 0 || data[offset3] !== 0 || data[offset4] !== 0) {
          error('writing to an offset that is not empty');
        }
        var value = values[i];
        data[offset0] = 0x1d;
        data[offset1] = (value >> 24) & 0xFF;
        data[offset2] = (value >> 16) & 0xFF;
        data[offset3] = (value >> 8) & 0xFF;
        data[offset4] = value & 0xFF;
      }
    }
  };
  return CFFOffsetTracker;
})();

// Takes a CFF and converts it to the binary representation.
var CFFCompiler = (function CFFCompilerClosure() {
  function CFFCompiler(cff) {
    this.cff = cff;
  }
  CFFCompiler.prototype = {
    compile: function CFFCompiler_compile() {
      var cff = this.cff;
      var output = {
        data: [],
        length: 0,
        add: function CFFCompiler_add(data) {
          this.data = this.data.concat(data);
          this.length = this.data.length;
        }
      };

      // Compile the five entries that must be in order.
      var header = this.compileHeader(cff.header);
      output.add(header);

      var nameIndex = this.compileNameIndex(cff.names);
      output.add(nameIndex);

      if (cff.isCIDFont) {
        // The spec is unclear on how font matrices should relate to each other
        // when there is one in the main top dict and the sub top dicts.
        // Windows handles this differently than linux and osx so we have to
        // normalize to work on all.
        // Rules based off of some mailing list discussions:
        // - If main font has a matrix and subfont doesn't, use the main matrix.
        // - If no main font matrix and there is a subfont matrix, use the
        //   subfont matrix.
        // - If both have matrices, concat together.
        // - If neither have matrices, use default.
        // To make this work on all platforms we move the top matrix into each
        // sub top dict and concat if necessary.
        if (cff.topDict.hasName('FontMatrix')) {
          var base = cff.topDict.getByName('FontMatrix');
          cff.topDict.removeByName('FontMatrix');
          for (var i = 0, ii = cff.fdArray.length; i < ii; i++) {
            var subDict = cff.fdArray[i];
            var matrix = base.slice(0);
            if (subDict.hasName('FontMatrix')) {
              matrix = Util.transform(matrix, subDict.getByName('FontMatrix'));
            }
            subDict.setByName('FontMatrix', matrix);
          }
        }
      }

      var compiled = this.compileTopDicts([cff.topDict],
                                          output.length,
                                          cff.isCIDFont);
      output.add(compiled.output);
      var topDictTracker = compiled.trackers[0];

      var stringIndex = this.compileStringIndex(cff.strings.strings);
      output.add(stringIndex);

      var globalSubrIndex = this.compileIndex(cff.globalSubrIndex);
      output.add(globalSubrIndex);

      // Now start on the other entries that have no specfic order.
      if (cff.encoding && cff.topDict.hasName('Encoding')) {
        if (cff.encoding.predefined) {
          topDictTracker.setEntryLocation('Encoding', [cff.encoding.format],
                                          output);
        } else {
          var encoding = this.compileEncoding(cff.encoding);
          topDictTracker.setEntryLocation('Encoding', [output.length], output);
          output.add(encoding);
        }
      }

      if (cff.charset && cff.topDict.hasName('charset')) {
        if (cff.charset.predefined) {
          topDictTracker.setEntryLocation('charset', [cff.charset.format],
                                          output);
        } else {
          var charset = this.compileCharset(cff.charset);
          topDictTracker.setEntryLocation('charset', [output.length], output);
          output.add(charset);
        }
      }

      var charStrings = this.compileCharStrings(cff.charStrings);
      topDictTracker.setEntryLocation('CharStrings', [output.length], output);
      output.add(charStrings);

      if (cff.isCIDFont) {
        // For some reason FDSelect must be in front of FDArray on windows. OSX
        // and linux don't seem to care.
        topDictTracker.setEntryLocation('FDSelect', [output.length], output);
        var fdSelect = this.compileFDSelect(cff.fdSelect.raw);
        output.add(fdSelect);
        // It is unclear if the sub font dictionary can have CID related
        // dictionary keys, but the sanitizer doesn't like them so remove them.
        compiled = this.compileTopDicts(cff.fdArray, output.length, true);
        topDictTracker.setEntryLocation('FDArray', [output.length], output);
        output.add(compiled.output);
        var fontDictTrackers = compiled.trackers;

        this.compilePrivateDicts(cff.fdArray, fontDictTrackers, output);
      }

      this.compilePrivateDicts([cff.topDict], [topDictTracker], output);

      // If the font data ends with INDEX whose object data is zero-length,
      // the sanitizer will bail out. Add a dummy byte to avoid that.
      output.add([0]);

      return output.data;
    },
    encodeNumber: function CFFCompiler_encodeNumber(value) {
      if (parseFloat(value) === parseInt(value, 10) && !isNaN(value)) { // isInt
        return this.encodeInteger(value);
      } else {
        return this.encodeFloat(value);
      }
    },
    encodeFloat: function CFFCompiler_encodeFloat(num) {
      var value = num.toString();

      // rounding inaccurate doubles
      var m = /\.(\d*?)(?:9{5,20}|0{5,20})\d{0,2}(?:e(.+)|$)/.exec(value);
      if (m) {
        var epsilon = parseFloat('1e' + ((m[2] ? +m[2] : 0) + m[1].length));
        value = (Math.round(num * epsilon) / epsilon).toString();
      }

      var nibbles = '';
      var i, ii;
      for (i = 0, ii = value.length; i < ii; ++i) {
        var a = value[i];
        if (a === 'e') {
          nibbles += value[++i] === '-' ? 'c' : 'b';
        } else if (a === '.') {
          nibbles += 'a';
        } else if (a === '-') {
          nibbles += 'e';
        } else {
          nibbles += a;
        }
      }
      nibbles += (nibbles.length & 1) ? 'f' : 'ff';
      var out = [30];
      for (i = 0, ii = nibbles.length; i < ii; i += 2) {
        out.push(parseInt(nibbles.substr(i, 2), 16));
      }
      return out;
    },
    encodeInteger: function CFFCompiler_encodeInteger(value) {
      var code;
      if (value >= -107 && value <= 107) {
        code = [value + 139];
      } else if (value >= 108 && value <= 1131) {
        value = [value - 108];
        code = [(value >> 8) + 247, value & 0xFF];
      } else if (value >= -1131 && value <= -108) {
        value = -value - 108;
        code = [(value >> 8) + 251, value & 0xFF];
      } else if (value >= -32768 && value <= 32767) {
        code = [0x1c, (value >> 8) & 0xFF, value & 0xFF];
      } else {
        code = [0x1d,
                (value >> 24) & 0xFF,
                (value >> 16) & 0xFF,
                (value >> 8) & 0xFF,
                 value & 0xFF];
      }
      return code;
    },
    compileHeader: function CFFCompiler_compileHeader(header) {
      return [
        header.major,
        header.minor,
        header.hdrSize,
        header.offSize
      ];
    },
    compileNameIndex: function CFFCompiler_compileNameIndex(names) {
      var nameIndex = new CFFIndex();
      for (var i = 0, ii = names.length; i < ii; ++i) {
        nameIndex.add(stringToBytes(names[i]));
      }
      return this.compileIndex(nameIndex);
    },
    compileTopDicts: function CFFCompiler_compileTopDicts(dicts,
                                                          length,
                                                          removeCidKeys) {
      var fontDictTrackers = [];
      var fdArrayIndex = new CFFIndex();
      for (var i = 0, ii = dicts.length; i < ii; ++i) {
        var fontDict = dicts[i];
        if (removeCidKeys) {
          fontDict.removeByName('CIDFontVersion');
          fontDict.removeByName('CIDFontRevision');
          fontDict.removeByName('CIDFontType');
          fontDict.removeByName('CIDCount');
          fontDict.removeByName('UIDBase');
        }
        var fontDictTracker = new CFFOffsetTracker();
        var fontDictData = this.compileDict(fontDict, fontDictTracker);
        fontDictTrackers.push(fontDictTracker);
        fdArrayIndex.add(fontDictData);
        fontDictTracker.offset(length);
      }
      fdArrayIndex = this.compileIndex(fdArrayIndex, fontDictTrackers);
      return {
        trackers: fontDictTrackers,
        output: fdArrayIndex
      };
    },
    compilePrivateDicts: function CFFCompiler_compilePrivateDicts(dicts,
                                                                  trackers,
                                                                  output) {
      for (var i = 0, ii = dicts.length; i < ii; ++i) {
        var fontDict = dicts[i];
        assert(fontDict.privateDict && fontDict.hasName('Private'),
               'There must be an private dictionary.');
        var privateDict = fontDict.privateDict;
        var privateDictTracker = new CFFOffsetTracker();
        var privateDictData = this.compileDict(privateDict, privateDictTracker);

        var outputLength = output.length;
        privateDictTracker.offset(outputLength);
        if (!privateDictData.length) {
          // The private dictionary was empty, set the output length to zero to
          // ensure the offset length isn't out of bounds in the eyes of the
          // sanitizer.
          outputLength = 0;
        }

        trackers[i].setEntryLocation('Private',
                                     [privateDictData.length, outputLength],
                                     output);
        output.add(privateDictData);

        if (privateDict.subrsIndex && privateDict.hasName('Subrs')) {
          var subrs = this.compileIndex(privateDict.subrsIndex);
          privateDictTracker.setEntryLocation('Subrs', [privateDictData.length],
                                              output);
          output.add(subrs);
        }
      }
    },
    compileDict: function CFFCompiler_compileDict(dict, offsetTracker) {
      var out = [];
      // The dictionary keys must be in a certain order.
      var order = dict.order;
      for (var i = 0; i < order.length; ++i) {
        var key = order[i];
        if (!(key in dict.values)) {
          continue;
        }
        var values = dict.values[key];
        var types = dict.types[key];
        if (!isArray(types)) {
          types = [types];
        }
        if (!isArray(values)) {
          values = [values];
        }

        // Remove any empty dict values.
        if (values.length === 0) {
          continue;
        }

        for (var j = 0, jj = types.length; j < jj; ++j) {
          var type = types[j];
          var value = values[j];
          switch (type) {
            case 'num':
            case 'sid':
              out = out.concat(this.encodeNumber(value));
              break;
            case 'offset':
              // For offsets we just insert a 32bit integer so we don't have to
              // deal with figuring out the length of the offset when it gets
              // replaced later on by the compiler.
              var name = dict.keyToNameMap[key];
              // Some offsets have the offset and the length, so just record the
              // position of the first one.
              if (!offsetTracker.isTracking(name)) {
                offsetTracker.track(name, out.length);
              }
              out = out.concat([0x1d, 0, 0, 0, 0]);
              break;
            case 'array':
            case 'delta':
              out = out.concat(this.encodeNumber(value));
              for (var k = 1, kk = values.length; k < kk; ++k) {
                out = out.concat(this.encodeNumber(values[k]));
              }
              break;
            default:
              error('Unknown data type of ' + type);
              break;
          }
        }
        out = out.concat(dict.opcodes[key]);
      }
      return out;
    },
    compileStringIndex: function CFFCompiler_compileStringIndex(strings) {
      var stringIndex = new CFFIndex();
      for (var i = 0, ii = strings.length; i < ii; ++i) {
        stringIndex.add(stringToBytes(strings[i]));
      }
      return this.compileIndex(stringIndex);
    },
    compileGlobalSubrIndex: function CFFCompiler_compileGlobalSubrIndex() {
      var globalSubrIndex = this.cff.globalSubrIndex;
      this.out.writeByteArray(this.compileIndex(globalSubrIndex));
    },
    compileCharStrings: function CFFCompiler_compileCharStrings(charStrings) {
      return this.compileIndex(charStrings);
    },
    compileCharset: function CFFCompiler_compileCharset(charset) {
      return this.compileTypedArray(charset.raw);
    },
    compileEncoding: function CFFCompiler_compileEncoding(encoding) {
      return this.compileTypedArray(encoding.raw);
    },
    compileFDSelect: function CFFCompiler_compileFDSelect(fdSelect) {
      return this.compileTypedArray(fdSelect);
    },
    compileTypedArray: function CFFCompiler_compileTypedArray(data) {
      var out = [];
      for (var i = 0, ii = data.length; i < ii; ++i) {
        out[i] = data[i];
      }
      return out;
    },
    compileIndex: function CFFCompiler_compileIndex(index, trackers) {
      trackers = trackers || [];
      var objects = index.objects;
      // First 2 bytes contains the number of objects contained into this index
      var count = objects.length;

      // If there is no object, just create an index. This technically
      // should just be [0, 0] but OTS has an issue with that.
      if (count === 0) {
        return [0, 0, 0];
      }

      var data = [(count >> 8) & 0xFF, count & 0xff];

      var lastOffset = 1, i;
      for (i = 0; i < count; ++i) {
        lastOffset += objects[i].length;
      }

      var offsetSize;
      if (lastOffset < 0x100) {
        offsetSize = 1;
      } else if (lastOffset < 0x10000) {
        offsetSize = 2;
      } else if (lastOffset < 0x1000000) {
        offsetSize = 3;
      } else {
        offsetSize = 4;
      }

      // Next byte contains the offset size use to reference object in the file
      data.push(offsetSize);

      // Add another offset after this one because we need a new offset
      var relativeOffset = 1;
      for (i = 0; i < count + 1; i++) {
        if (offsetSize === 1) {
          data.push(relativeOffset & 0xFF);
        } else if (offsetSize === 2) {
          data.push((relativeOffset >> 8) & 0xFF,
                     relativeOffset & 0xFF);
        } else if (offsetSize === 3) {
          data.push((relativeOffset >> 16) & 0xFF,
                    (relativeOffset >> 8) & 0xFF,
                     relativeOffset & 0xFF);
        } else {
          data.push((relativeOffset >>> 24) & 0xFF,
                    (relativeOffset >> 16) & 0xFF,
                    (relativeOffset >> 8) & 0xFF,
                     relativeOffset & 0xFF);
        }

        if (objects[i]) {
          relativeOffset += objects[i].length;
        }
      }

      for (i = 0; i < count; i++) {
        // Notify the tracker where the object will be offset in the data.
        if (trackers[i]) {
          trackers[i].offset(data.length);
        }
        for (var j = 0, jj = objects[i].length; j < jj; j++) {
          data.push(objects[i][j]);
        }
      }
      return data;
    }
  };
  return CFFCompiler;
})();

// Workaround for seac on Windows.
(function checkSeacSupport() {
  if (/Windows/.test(navigator.userAgent)) {
    SEAC_ANALYSIS_ENABLED = true;
  }
})();

// Workaround for Private Use Area characters in Chrome on Windows
// http://code.google.com/p/chromium/issues/detail?id=122465
// https://github.com/mozilla/pdf.js/issues/1689
(function checkChromeWindows() {
  if (/Windows.*Chrome/.test(navigator.userAgent)) {
    SKIP_PRIVATE_USE_RANGE_F000_TO_F01F = true;
  }
})();


var FontRendererFactory = (function FontRendererFactoryClosure() {
  function getLong(data, offset) {
    return (data[offset] << 24) | (data[offset + 1] << 16) |
           (data[offset + 2] << 8) | data[offset + 3];
  }

  function getUshort(data, offset) {
    return (data[offset] << 8) | data[offset + 1];
  }

  function parseCmap(data, start, end) {
    var offset = (getUshort(data, start + 2) === 1 ?
                  getLong(data, start + 8) : getLong(data, start + 16));
    var format = getUshort(data, start + offset);
    var length, ranges, p, i;
    if (format === 4) {
      length = getUshort(data, start + offset + 2);
      var segCount = getUshort(data, start + offset + 6) >> 1;
      p = start + offset + 14;
      ranges = [];
      for (i = 0; i < segCount; i++, p += 2) {
        ranges[i] = {end: getUshort(data, p)};
      }
      p += 2;
      for (i = 0; i < segCount; i++, p += 2) {
        ranges[i].start = getUshort(data, p);
      }
      for (i = 0; i < segCount; i++, p += 2) {
        ranges[i].idDelta = getUshort(data, p);
      }
      for (i = 0; i < segCount; i++, p += 2) {
        var idOffset = getUshort(data, p);
        if (idOffset === 0) {
          continue;
        }
        ranges[i].ids = [];
        for (var j = 0, jj = ranges[i].end - ranges[i].start + 1; j < jj; j++) {
          ranges[i].ids[j] = getUshort(data, p + idOffset);
          idOffset += 2;
        }
      }
      return ranges;
    } else if (format === 12) {
      length = getLong(data, start + offset + 4);
      var groups = getLong(data, start + offset + 12);
      p = start + offset + 16;
      ranges = [];
      for (i = 0; i < groups; i++) {
        ranges.push({
          start: getLong(data, p),
          end: getLong(data, p + 4),
          idDelta: getLong(data, p + 8) - getLong(data, p)
        });
        p += 12;
      }
      return ranges;
    }
    error('not supported cmap: ' + format);
  }

  function parseCff(data, start, end) {
    var properties = {};
    var parser = new CFFParser(new Stream(data, start, end - start),
                               properties);
    var cff = parser.parse();
    return {
      glyphs: cff.charStrings.objects,
      subrs: (cff.topDict.privateDict && cff.topDict.privateDict.subrsIndex &&
              cff.topDict.privateDict.subrsIndex.objects),
      gsubrs: cff.globalSubrIndex && cff.globalSubrIndex.objects
    };
  }

  function parseGlyfTable(glyf, loca, isGlyphLocationsLong) {
    var itemSize, itemDecode;
    if (isGlyphLocationsLong) {
      itemSize = 4;
      itemDecode = function fontItemDecodeLong(data, offset) {
        return (data[offset] << 24) | (data[offset + 1] << 16) |
               (data[offset + 2] << 8) | data[offset + 3];
      };
    } else {
      itemSize = 2;
      itemDecode = function fontItemDecode(data, offset) {
        return (data[offset] << 9) | (data[offset + 1] << 1);
      };
    }
    var glyphs = [];
    var startOffset = itemDecode(loca, 0);
    for (var j = itemSize; j < loca.length; j += itemSize) {
      var endOffset = itemDecode(loca, j);
      glyphs.push(glyf.subarray(startOffset, endOffset));
      startOffset = endOffset;
    }
    return glyphs;
  }

  function lookupCmap(ranges, unicode) {
    var code = unicode.charCodeAt(0);
    var l = 0, r = ranges.length - 1;
    while (l < r) {
      var c = (l + r + 1) >> 1;
      if (code < ranges[c].start) {
        r = c - 1;
      } else {
        l = c;
      }
    }
    if (ranges[l].start <= code && code <= ranges[l].end) {
      return (ranges[l].idDelta + (ranges[l].ids ?
        ranges[l].ids[code - ranges[l].start] : code)) & 0xFFFF;
    }
    return 0;
  }

  function compileGlyf(code, js, font) {
    function moveTo(x, y) {
      js.push('c.moveTo(' + x + ',' + y + ');');
    }
    function lineTo(x, y) {
      js.push('c.lineTo(' + x + ',' + y + ');');
    }
    function quadraticCurveTo(xa, ya, x, y) {
      js.push('c.quadraticCurveTo(' + xa + ',' + ya + ',' +
                                   x + ',' + y + ');');
    }

    var i = 0;
    var numberOfContours = ((code[i] << 24) | (code[i + 1] << 16)) >> 16;
    var flags;
    var x = 0, y = 0;
    i += 10;
    if (numberOfContours < 0) {
      // composite glyph
      do {
        flags = (code[i] << 8) | code[i + 1];
        var glyphIndex = (code[i + 2] << 8) | code[i + 3];
        i += 4;
        var arg1, arg2;
        if ((flags & 0x01)) {
          arg1 = ((code[i] << 24) | (code[i + 1] << 16)) >> 16;
          arg2 = ((code[i + 2] << 24) | (code[i + 3] << 16)) >> 16;
          i += 4;
        } else {
          arg1 = code[i++]; arg2 = code[i++];
        }
        if ((flags & 0x02)) {
           x = arg1;
           y = arg2;
        } else {
           x = 0; y = 0; // TODO "they are points" ?
        }
        var scaleX = 1, scaleY = 1, scale01 = 0, scale10 = 0;
        if ((flags & 0x08)) {
          scaleX =
          scaleY = ((code[i] << 24) | (code[i + 1] << 16)) / 1073741824;
          i += 2;
        } else if ((flags & 0x40)) {
          scaleX = ((code[i] << 24) | (code[i + 1] << 16)) / 1073741824;
          scaleY = ((code[i + 2] << 24) | (code[i + 3] << 16)) / 1073741824;
          i += 4;
        } else if ((flags & 0x80)) {
          scaleX = ((code[i] << 24) | (code[i + 1] << 16)) / 1073741824;
          scale01 = ((code[i + 2] << 24) | (code[i + 3] << 16)) / 1073741824;
          scale10 = ((code[i + 4] << 24) | (code[i + 5] << 16)) / 1073741824;
          scaleY = ((code[i + 6] << 24) | (code[i + 7] << 16)) / 1073741824;
          i += 8;
        }
        var subglyph = font.glyphs[glyphIndex];
        if (subglyph) {
          js.push('c.save();');
          js.push('c.transform(' + scaleX + ',' + scale01 + ',' +
                  scale10 + ',' + scaleY + ',' + x + ',' + y + ');');
          compileGlyf(subglyph, js, font);
          js.push('c.restore();');
        }
      } while ((flags & 0x20));
    } else {
      // simple glyph
      var endPtsOfContours = [];
      var j, jj;
      for (j = 0; j < numberOfContours; j++) {
        endPtsOfContours.push((code[i] << 8) | code[i + 1]);
        i += 2;
      }
      var instructionLength = (code[i] << 8) | code[i + 1];
      i += 2 + instructionLength; // skipping the instructions
      var numberOfPoints = endPtsOfContours[endPtsOfContours.length - 1] + 1;
      var points = [];
      while (points.length < numberOfPoints) {
        flags = code[i++];
        var repeat = 1;
        if ((flags & 0x08)) {
          repeat += code[i++];
        }
        while (repeat-- > 0) {
          points.push({flags: flags});
        }
      }
      for (j = 0; j < numberOfPoints; j++) {
        switch (points[j].flags & 0x12) {
          case 0x00:
            x += ((code[i] << 24) | (code[i + 1] << 16)) >> 16;
            i += 2;
            break;
          case 0x02:
            x -= code[i++];
            break;
          case 0x12:
            x += code[i++];
            break;
        }
        points[j].x = x;
      }
      for (j = 0; j < numberOfPoints; j++) {
        switch (points[j].flags & 0x24) {
          case 0x00:
            y += ((code[i] << 24) | (code[i + 1] << 16)) >> 16;
            i += 2;
            break;
          case 0x04:
            y -= code[i++];
            break;
          case 0x24:
            y += code[i++];
            break;
        }
        points[j].y = y;
      }

      var startPoint = 0;
      for (i = 0; i < numberOfContours; i++) {
        var endPoint = endPtsOfContours[i];
        // contours might have implicit points, which is located in the middle
        // between two neighboring off-curve points
        var contour = points.slice(startPoint, endPoint + 1);
        if ((contour[0].flags & 1)) {
          contour.push(contour[0]); // using start point at the contour end
        } else if ((contour[contour.length - 1].flags & 1)) {
          // first is off-curve point, trying to use one from the end
          contour.unshift(contour[contour.length - 1]);
        } else {
          // start and end are off-curve points, creating implicit one
          var p = {
            flags: 1,
            x: (contour[0].x + contour[contour.length - 1].x) / 2,
            y: (contour[0].y + contour[contour.length - 1].y) / 2
          };
          contour.unshift(p);
          contour.push(p);
        }
        moveTo(contour[0].x, contour[0].y);
        for (j = 1, jj = contour.length; j < jj; j++) {
          if ((contour[j].flags & 1)) {
            lineTo(contour[j].x, contour[j].y);
          } else if ((contour[j + 1].flags & 1)){
            quadraticCurveTo(contour[j].x, contour[j].y,
                             contour[j + 1].x, contour[j + 1].y);
            j++;
          } else {
            quadraticCurveTo(contour[j].x, contour[j].y,
              (contour[j].x + contour[j + 1].x) / 2,
              (contour[j].y + contour[j + 1].y) / 2);
          }
        }
        startPoint = endPoint + 1;
      }
    }
  }

  function compileCharString(code, js, font) {
    var stack = [];
    var x = 0, y = 0;
    var stems = 0;

    function moveTo(x, y) {
      js.push('c.moveTo(' + x + ',' + y + ');');
    }
    function lineTo(x, y) {
      js.push('c.lineTo(' + x + ',' + y + ');');
    }
    function bezierCurveTo(x1, y1, x2, y2, x, y) {
      js.push('c.bezierCurveTo(' + x1 + ',' + y1 + ',' + x2 + ',' + y2 + ',' +
                                   x + ',' + y + ');');
    }

    function parse(code) {
      var i = 0;
      while (i < code.length) {
        var stackClean = false;
        var v = code[i++];
        var xa, xb, ya, yb, y1, y2, y3, n, subrCode;
        switch (v) {
          case 1: // hstem
            stems += stack.length >> 1;
            stackClean = true;
            break;
          case 3: // vstem
            stems += stack.length >> 1;
            stackClean = true;
            break;
          case 4: // vmoveto
            y += stack.pop();
            moveTo(x, y);
            stackClean = true;
            break;
          case 5: // rlineto
            while (stack.length > 0) {
              x += stack.shift();
              y += stack.shift();
              lineTo(x, y);
            }
            break;
          case 6: // hlineto
            while (stack.length > 0) {
              x += stack.shift();
              lineTo(x, y);
              if (stack.length === 0) {
                break;
              }
              y += stack.shift();
              lineTo(x, y);
            }
            break;
          case 7: // vlineto
            while (stack.length > 0) {
              y += stack.shift();
              lineTo(x, y);
              if (stack.length === 0) {
                break;
              }
              x += stack.shift();
              lineTo(x, y);
            }
            break;
          case 8: // rrcurveto
            while (stack.length > 0) {
              xa = x + stack.shift(); ya = y + stack.shift();
              xb = xa + stack.shift(); yb = ya + stack.shift();
              x = xb + stack.shift(); y = yb + stack.shift();
              bezierCurveTo(xa, ya, xb, yb, x, y);
            }
            break;
          case 10: // callsubr
            n = stack.pop() + font.subrsBias;
            subrCode = font.subrs[n];
            if (subrCode) {
              parse(subrCode);
            }
            break;
          case 11: // return
            return;
          case 12:
            v = code[i++];
            switch (v) {
              case 34: // flex
                xa = x + stack.shift();
                xb = xa + stack.shift(); y1 = y + stack.shift();
                x = xb + stack.shift();
                bezierCurveTo(xa, y, xb, y1, x, y1);
                xa = x + stack.shift();
                xb = xa + stack.shift();
                x = xb + stack.shift();
                bezierCurveTo(xa, y1, xb, y, x, y);
                break;
              case 35: // flex
                xa = x + stack.shift(); ya = y + stack.shift();
                xb = xa + stack.shift(); yb = ya + stack.shift();
                x = xb + stack.shift(); y = yb + stack.shift();
                bezierCurveTo(xa, ya, xb, yb, x, y);
                xa = x + stack.shift(); ya = y + stack.shift();
                xb = xa + stack.shift(); yb = ya + stack.shift();
                x = xb + stack.shift(); y = yb + stack.shift();
                bezierCurveTo(xa, ya, xb, yb, x, y);
                stack.pop(); // fd
                break;
              case 36: // hflex1
                xa = x + stack.shift(); y1 = y + stack.shift();
                xb = xa + stack.shift(); y2 = y1 + stack.shift();
                x = xb + stack.shift();
                bezierCurveTo(xa, y1, xb, y2, x, y2);
                xa = x + stack.shift();
                xb = xa + stack.shift(); y3 = y2 + stack.shift();
                x = xb + stack.shift();
                bezierCurveTo(xa, y2, xb, y3, x, y);
                break;
              case 37: // flex1
                var x0 = x, y0 = y;
                xa = x + stack.shift(); ya = y + stack.shift();
                xb = xa + stack.shift(); yb = ya + stack.shift();
                x = xb + stack.shift(); y = yb + stack.shift();
                bezierCurveTo(xa, ya, xb, yb, x, y);
                xa = x + stack.shift(); ya = y + stack.shift();
                xb = xa + stack.shift(); yb = ya + stack.shift();
                x = xb; y = yb;
                if (Math.abs(x - x0) > Math.abs(y - y0)) {
                  x += stack.shift();
                } else  {
                  y += stack.shift();
                }
                bezierCurveTo(xa, ya, xb, yb, x, y);
                break;
              default:
                error('unknown operator: 12 ' + v);
            }
            break;
          case 14: // endchar
            if (stack.length >= 4) {
              var achar = stack.pop();
              var bchar = stack.pop();
              y = stack.pop();
              x = stack.pop();
              js.push('c.save();');
              js.push('c.translate('+ x + ',' + y + ');');
              var gid = lookupCmap(font.cmap, String.fromCharCode(
                font.glyphNameMap[Encodings.StandardEncoding[achar]]));
              compileCharString(font.glyphs[gid], js, font);
              js.push('c.restore();');

              gid = lookupCmap(font.cmap, String.fromCharCode(
                font.glyphNameMap[Encodings.StandardEncoding[bchar]]));
              compileCharString(font.glyphs[gid], js, font);
            }
            return;
          case 18: // hstemhm
            stems += stack.length >> 1;
            stackClean = true;
            break;
          case 19: // hintmask
            stems += stack.length >> 1;
            i += (stems + 7) >> 3;
            stackClean = true;
            break;
          case 20: // cntrmask
            stems += stack.length >> 1;
            i += (stems + 7) >> 3;
            stackClean = true;
            break;
          case 21: // rmoveto
            y += stack.pop();
            x += stack.pop();
            moveTo(x, y);
            stackClean = true;
            break;
          case 22: // hmoveto
            x += stack.pop();
            moveTo(x, y);
            stackClean = true;
            break;
          case 23: // vstemhm
            stems += stack.length >> 1;
            stackClean = true;
            break;
          case 24: // rcurveline
            while (stack.length > 2) {
              xa = x + stack.shift(); ya = y + stack.shift();
              xb = xa + stack.shift(); yb = ya + stack.shift();
              x = xb + stack.shift(); y = yb + stack.shift();
              bezierCurveTo(xa, ya, xb, yb, x, y);
            }
            x += stack.shift();
            y += stack.shift();
            lineTo(x, y);
            break;
          case 25: // rlinecurve
            while (stack.length > 6) {
              x += stack.shift();
              y += stack.shift();
              lineTo(x, y);
            }
            xa = x + stack.shift(); ya = y + stack.shift();
            xb = xa + stack.shift(); yb = ya + stack.shift();
            x = xb + stack.shift(); y = yb + stack.shift();
            bezierCurveTo(xa, ya, xb, yb, x, y);
            break;
          case 26: // vvcurveto
            if (stack.length % 2) {
              x += stack.shift();
            }
            while (stack.length > 0) {
              xa = x; ya = y + stack.shift();
              xb = xa + stack.shift(); yb = ya + stack.shift();
              x = xb; y = yb + stack.shift();
              bezierCurveTo(xa, ya, xb, yb, x, y);
            }
            break;
          case 27: // hhcurveto
            if (stack.length % 2) {
              y += stack.shift();
            }
            while (stack.length > 0) {
              xa = x + stack.shift(); ya = y;
              xb = xa + stack.shift(); yb = ya + stack.shift();
              x = xb + stack.shift(); y = yb;
              bezierCurveTo(xa, ya, xb, yb, x, y);
            }
            break;
          case 28:
            stack.push(((code[i] << 24) | (code[i + 1] << 16)) >> 16);
            i += 2;
            break;
          case 29: // callgsubr
            n = stack.pop() + font.gsubrsBias;
            subrCode = font.gsubrs[n];
            if (subrCode) {
              parse(subrCode);
            }
            break;
          case 30: // vhcurveto
            while (stack.length > 0) {
              xa = x; ya = y + stack.shift();
              xb = xa + stack.shift(); yb = ya + stack.shift();
              x = xb + stack.shift();
              y = yb + (stack.length === 1 ? stack.shift() : 0);
              bezierCurveTo(xa, ya, xb, yb, x, y);
              if (stack.length === 0) {
                break;
              }

              xa = x + stack.shift(); ya = y;
              xb = xa + stack.shift(); yb = ya + stack.shift();
              y = yb + stack.shift();
              x = xb + (stack.length === 1 ? stack.shift() : 0);
              bezierCurveTo(xa, ya, xb, yb, x, y);
            }
            break;
          case 31: // hvcurveto
            while (stack.length > 0) {
              xa = x + stack.shift(); ya = y;
              xb = xa + stack.shift(); yb = ya + stack.shift();
              y = yb + stack.shift();
              x = xb + (stack.length === 1 ? stack.shift() : 0);
              bezierCurveTo(xa, ya, xb, yb, x, y);
              if (stack.length === 0) {
                break;
              }

              xa = x; ya = y + stack.shift();
              xb = xa + stack.shift(); yb = ya + stack.shift();
              x = xb + stack.shift();
              y = yb + (stack.length === 1 ? stack.shift() : 0);
              bezierCurveTo(xa, ya, xb, yb, x, y);
            }
            break;
          default:
            if (v < 32) {
              error('unknown operator: ' + v);
            }
            if (v < 247) {
              stack.push(v - 139);
            } else if (v < 251) {
              stack.push((v - 247) * 256 + code[i++] + 108);
            } else if (v < 255) {
              stack.push(-(v - 251) * 256 - code[i++] - 108);
            } else {
              stack.push(((code[i] << 24) | (code[i + 1] << 16) |
                         (code[i + 2] << 8) | code[i + 3]) / 65536);
              i += 4;
            }
            break;
        }
        if (stackClean) {
          stack.length = 0;
        }
      }
    }
    parse(code);
  }

  var noop = '';

  function CompiledFont(fontMatrix) {
    this.compiledGlyphs = {};
    this.fontMatrix = fontMatrix;
  }
  CompiledFont.prototype = {
    getPathJs: function (unicode) {
      var gid = lookupCmap(this.cmap, unicode);
      var fn = this.compiledGlyphs[gid];
      if (!fn) {
        this.compiledGlyphs[gid] = fn = this.compileGlyph(this.glyphs[gid]);
      }
      return fn;
    },

    compileGlyph: function (code) {
      if (!code || code.length === 0 || code[0] === 14) {
        return noop;
      }

      var js = [];
      js.push('c.save();');
      js.push('c.transform(' + this.fontMatrix.join(',') + ');');
      js.push('c.scale(size, -size);');

      this.compileGlyphImpl(code, js);

      js.push('c.restore();');

      return js.join('\n');
    },

    compileGlyphImpl: function () {
      error('Children classes should implement this.');
    },

    hasBuiltPath: function (unicode) {
      var gid = lookupCmap(this.cmap, unicode);
      return gid in this.compiledGlyphs;
    }
  };

  function TrueTypeCompiled(glyphs, cmap, fontMatrix) {
    fontMatrix = fontMatrix || [0.000488, 0, 0, 0.000488, 0, 0];
    CompiledFont.call(this, fontMatrix);

    this.glyphs = glyphs;
    this.cmap = cmap;

    this.compiledGlyphs = [];
  }

  Util.inherit(TrueTypeCompiled, CompiledFont, {
    compileGlyphImpl: function (code, js) {
      compileGlyf(code, js, this);
    }
  });

  function Type2Compiled(cffInfo, cmap, fontMatrix, glyphNameMap) {
    fontMatrix = fontMatrix || [0.001, 0, 0, 0.001, 0, 0];
    CompiledFont.call(this, fontMatrix);
    this.glyphs = cffInfo.glyphs;
    this.gsubrs = cffInfo.gsubrs || [];
    this.subrs = cffInfo.subrs || [];
    this.cmap = cmap;
    this.glyphNameMap = glyphNameMap || GlyphsUnicode;

    this.compiledGlyphs = [];
    this.gsubrsBias = (this.gsubrs.length < 1240 ?
                       107 : (this.gsubrs.length < 33900 ? 1131 : 32768));
    this.subrsBias = (this.subrs.length < 1240 ?
                      107 : (this.subrs.length < 33900 ? 1131 : 32768));
  }

  Util.inherit(Type2Compiled, CompiledFont, {
    compileGlyphImpl: function (code, js) {
      compileCharString(code, js, this);
    }
  });


  return {
    create: function FontRendererFactory_create(font) {
      var data = new Uint8Array(font.data);
      var cmap, glyf, loca, cff, indexToLocFormat, unitsPerEm;
      var numTables = getUshort(data, 4);
      for (var i = 0, p = 12; i < numTables; i++, p += 16) {
        var tag = bytesToString(data.subarray(p, p + 4));
        var offset = getLong(data, p + 8);
        var length = getLong(data, p + 12);
        switch (tag) {
          case 'cmap':
            cmap = parseCmap(data, offset, offset + length);
            break;
          case 'glyf':
            glyf = data.subarray(offset, offset + length);
            break;
          case 'loca':
            loca = data.subarray(offset, offset + length);
            break;
          case 'head':
            unitsPerEm = getUshort(data, offset + 18);
            indexToLocFormat = getUshort(data, offset + 50);
            break;
          case 'CFF ':
            cff = parseCff(data, offset, offset + length);
            break;
        }
      }

      if (glyf) {
        var fontMatrix = (!unitsPerEm ? font.fontMatrix :
                          [1 / unitsPerEm, 0, 0, 1 / unitsPerEm, 0, 0]);
        return new TrueTypeCompiled(
          parseGlyfTable(glyf, loca, indexToLocFormat), cmap, fontMatrix);
      } else {
        return new Type2Compiled(cff, cmap, font.fontMatrix, font.glyphNameMap);
      }
    }
  };
})();


var GlyphsUnicode = {
  A: 0x0041,
  AE: 0x00C6,
  AEacute: 0x01FC,
  AEmacron: 0x01E2,
  AEsmall: 0xF7E6,
  Aacute: 0x00C1,
  Aacutesmall: 0xF7E1,
  Abreve: 0x0102,
  Abreveacute: 0x1EAE,
  Abrevecyrillic: 0x04D0,
  Abrevedotbelow: 0x1EB6,
  Abrevegrave: 0x1EB0,
  Abrevehookabove: 0x1EB2,
  Abrevetilde: 0x1EB4,
  Acaron: 0x01CD,
  Acircle: 0x24B6,
  Acircumflex: 0x00C2,
  Acircumflexacute: 0x1EA4,
  Acircumflexdotbelow: 0x1EAC,
  Acircumflexgrave: 0x1EA6,
  Acircumflexhookabove: 0x1EA8,
  Acircumflexsmall: 0xF7E2,
  Acircumflextilde: 0x1EAA,
  Acute: 0xF6C9,
  Acutesmall: 0xF7B4,
  Acyrillic: 0x0410,
  Adblgrave: 0x0200,
  Adieresis: 0x00C4,
  Adieresiscyrillic: 0x04D2,
  Adieresismacron: 0x01DE,
  Adieresissmall: 0xF7E4,
  Adotbelow: 0x1EA0,
  Adotmacron: 0x01E0,
  Agrave: 0x00C0,
  Agravesmall: 0xF7E0,
  Ahookabove: 0x1EA2,
  Aiecyrillic: 0x04D4,
  Ainvertedbreve: 0x0202,
  Alpha: 0x0391,
  Alphatonos: 0x0386,
  Amacron: 0x0100,
  Amonospace: 0xFF21,
  Aogonek: 0x0104,
  Aring: 0x00C5,
  Aringacute: 0x01FA,
  Aringbelow: 0x1E00,
  Aringsmall: 0xF7E5,
  Asmall: 0xF761,
  Atilde: 0x00C3,
  Atildesmall: 0xF7E3,
  Aybarmenian: 0x0531,
  B: 0x0042,
  Bcircle: 0x24B7,
  Bdotaccent: 0x1E02,
  Bdotbelow: 0x1E04,
  Becyrillic: 0x0411,
  Benarmenian: 0x0532,
  Beta: 0x0392,
  Bhook: 0x0181,
  Blinebelow: 0x1E06,
  Bmonospace: 0xFF22,
  Brevesmall: 0xF6F4,
  Bsmall: 0xF762,
  Btopbar: 0x0182,
  C: 0x0043,
  Caarmenian: 0x053E,
  Cacute: 0x0106,
  Caron: 0xF6CA,
  Caronsmall: 0xF6F5,
  Ccaron: 0x010C,
  Ccedilla: 0x00C7,
  Ccedillaacute: 0x1E08,
  Ccedillasmall: 0xF7E7,
  Ccircle: 0x24B8,
  Ccircumflex: 0x0108,
  Cdot: 0x010A,
  Cdotaccent: 0x010A,
  Cedillasmall: 0xF7B8,
  Chaarmenian: 0x0549,
  Cheabkhasiancyrillic: 0x04BC,
  Checyrillic: 0x0427,
  Chedescenderabkhasiancyrillic: 0x04BE,
  Chedescendercyrillic: 0x04B6,
  Chedieresiscyrillic: 0x04F4,
  Cheharmenian: 0x0543,
  Chekhakassiancyrillic: 0x04CB,
  Cheverticalstrokecyrillic: 0x04B8,
  Chi: 0x03A7,
  Chook: 0x0187,
  Circumflexsmall: 0xF6F6,
  Cmonospace: 0xFF23,
  Coarmenian: 0x0551,
  Csmall: 0xF763,
  D: 0x0044,
  DZ: 0x01F1,
  DZcaron: 0x01C4,
  Daarmenian: 0x0534,
  Dafrican: 0x0189,
  Dcaron: 0x010E,
  Dcedilla: 0x1E10,
  Dcircle: 0x24B9,
  Dcircumflexbelow: 0x1E12,
  Dcroat: 0x0110,
  Ddotaccent: 0x1E0A,
  Ddotbelow: 0x1E0C,
  Decyrillic: 0x0414,
  Deicoptic: 0x03EE,
  Delta: 0x2206,
  Deltagreek: 0x0394,
  Dhook: 0x018A,
  Dieresis: 0xF6CB,
  DieresisAcute: 0xF6CC,
  DieresisGrave: 0xF6CD,
  Dieresissmall: 0xF7A8,
  Digammagreek: 0x03DC,
  Djecyrillic: 0x0402,
  Dlinebelow: 0x1E0E,
  Dmonospace: 0xFF24,
  Dotaccentsmall: 0xF6F7,
  Dslash: 0x0110,
  Dsmall: 0xF764,
  Dtopbar: 0x018B,
  Dz: 0x01F2,
  Dzcaron: 0x01C5,
  Dzeabkhasiancyrillic: 0x04E0,
  Dzecyrillic: 0x0405,
  Dzhecyrillic: 0x040F,
  E: 0x0045,
  Eacute: 0x00C9,
  Eacutesmall: 0xF7E9,
  Ebreve: 0x0114,
  Ecaron: 0x011A,
  Ecedillabreve: 0x1E1C,
  Echarmenian: 0x0535,
  Ecircle: 0x24BA,
  Ecircumflex: 0x00CA,
  Ecircumflexacute: 0x1EBE,
  Ecircumflexbelow: 0x1E18,
  Ecircumflexdotbelow: 0x1EC6,
  Ecircumflexgrave: 0x1EC0,
  Ecircumflexhookabove: 0x1EC2,
  Ecircumflexsmall: 0xF7EA,
  Ecircumflextilde: 0x1EC4,
  Ecyrillic: 0x0404,
  Edblgrave: 0x0204,
  Edieresis: 0x00CB,
  Edieresissmall: 0xF7EB,
  Edot: 0x0116,
  Edotaccent: 0x0116,
  Edotbelow: 0x1EB8,
  Efcyrillic: 0x0424,
  Egrave: 0x00C8,
  Egravesmall: 0xF7E8,
  Eharmenian: 0x0537,
  Ehookabove: 0x1EBA,
  Eightroman: 0x2167,
  Einvertedbreve: 0x0206,
  Eiotifiedcyrillic: 0x0464,
  Elcyrillic: 0x041B,
  Elevenroman: 0x216A,
  Emacron: 0x0112,
  Emacronacute: 0x1E16,
  Emacrongrave: 0x1E14,
  Emcyrillic: 0x041C,
  Emonospace: 0xFF25,
  Encyrillic: 0x041D,
  Endescendercyrillic: 0x04A2,
  Eng: 0x014A,
  Enghecyrillic: 0x04A4,
  Enhookcyrillic: 0x04C7,
  Eogonek: 0x0118,
  Eopen: 0x0190,
  Epsilon: 0x0395,
  Epsilontonos: 0x0388,
  Ercyrillic: 0x0420,
  Ereversed: 0x018E,
  Ereversedcyrillic: 0x042D,
  Escyrillic: 0x0421,
  Esdescendercyrillic: 0x04AA,
  Esh: 0x01A9,
  Esmall: 0xF765,
  Eta: 0x0397,
  Etarmenian: 0x0538,
  Etatonos: 0x0389,
  Eth: 0x00D0,
  Ethsmall: 0xF7F0,
  Etilde: 0x1EBC,
  Etildebelow: 0x1E1A,
  Euro: 0x20AC,
  Ezh: 0x01B7,
  Ezhcaron: 0x01EE,
  Ezhreversed: 0x01B8,
  F: 0x0046,
  Fcircle: 0x24BB,
  Fdotaccent: 0x1E1E,
  Feharmenian: 0x0556,
  Feicoptic: 0x03E4,
  Fhook: 0x0191,
  Fitacyrillic: 0x0472,
  Fiveroman: 0x2164,
  Fmonospace: 0xFF26,
  Fourroman: 0x2163,
  Fsmall: 0xF766,
  G: 0x0047,
  GBsquare: 0x3387,
  Gacute: 0x01F4,
  Gamma: 0x0393,
  Gammaafrican: 0x0194,
  Gangiacoptic: 0x03EA,
  Gbreve: 0x011E,
  Gcaron: 0x01E6,
  Gcedilla: 0x0122,
  Gcircle: 0x24BC,
  Gcircumflex: 0x011C,
  Gcommaaccent: 0x0122,
  Gdot: 0x0120,
  Gdotaccent: 0x0120,
  Gecyrillic: 0x0413,
  Ghadarmenian: 0x0542,
  Ghemiddlehookcyrillic: 0x0494,
  Ghestrokecyrillic: 0x0492,
  Gheupturncyrillic: 0x0490,
  Ghook: 0x0193,
  Gimarmenian: 0x0533,
  Gjecyrillic: 0x0403,
  Gmacron: 0x1E20,
  Gmonospace: 0xFF27,
  Grave: 0xF6CE,
  Gravesmall: 0xF760,
  Gsmall: 0xF767,
  Gsmallhook: 0x029B,
  Gstroke: 0x01E4,
  H: 0x0048,
  H18533: 0x25CF,
  H18543: 0x25AA,
  H18551: 0x25AB,
  H22073: 0x25A1,
  HPsquare: 0x33CB,
  Haabkhasiancyrillic: 0x04A8,
  Hadescendercyrillic: 0x04B2,
  Hardsigncyrillic: 0x042A,
  Hbar: 0x0126,
  Hbrevebelow: 0x1E2A,
  Hcedilla: 0x1E28,
  Hcircle: 0x24BD,
  Hcircumflex: 0x0124,
  Hdieresis: 0x1E26,
  Hdotaccent: 0x1E22,
  Hdotbelow: 0x1E24,
  Hmonospace: 0xFF28,
  Hoarmenian: 0x0540,
  Horicoptic: 0x03E8,
  Hsmall: 0xF768,
  Hungarumlaut: 0xF6CF,
  Hungarumlautsmall: 0xF6F8,
  Hzsquare: 0x3390,
  I: 0x0049,
  IAcyrillic: 0x042F,
  IJ: 0x0132,
  IUcyrillic: 0x042E,
  Iacute: 0x00CD,
  Iacutesmall: 0xF7ED,
  Ibreve: 0x012C,
  Icaron: 0x01CF,
  Icircle: 0x24BE,
  Icircumflex: 0x00CE,
  Icircumflexsmall: 0xF7EE,
  Icyrillic: 0x0406,
  Idblgrave: 0x0208,
  Idieresis: 0x00CF,
  Idieresisacute: 0x1E2E,
  Idieresiscyrillic: 0x04E4,
  Idieresissmall: 0xF7EF,
  Idot: 0x0130,
  Idotaccent: 0x0130,
  Idotbelow: 0x1ECA,
  Iebrevecyrillic: 0x04D6,
  Iecyrillic: 0x0415,
  Ifraktur: 0x2111,
  Igrave: 0x00CC,
  Igravesmall: 0xF7EC,
  Ihookabove: 0x1EC8,
  Iicyrillic: 0x0418,
  Iinvertedbreve: 0x020A,
  Iishortcyrillic: 0x0419,
  Imacron: 0x012A,
  Imacroncyrillic: 0x04E2,
  Imonospace: 0xFF29,
  Iniarmenian: 0x053B,
  Iocyrillic: 0x0401,
  Iogonek: 0x012E,
  Iota: 0x0399,
  Iotaafrican: 0x0196,
  Iotadieresis: 0x03AA,
  Iotatonos: 0x038A,
  Ismall: 0xF769,
  Istroke: 0x0197,
  Itilde: 0x0128,
  Itildebelow: 0x1E2C,
  Izhitsacyrillic: 0x0474,
  Izhitsadblgravecyrillic: 0x0476,
  J: 0x004A,
  Jaarmenian: 0x0541,
  Jcircle: 0x24BF,
  Jcircumflex: 0x0134,
  Jecyrillic: 0x0408,
  Jheharmenian: 0x054B,
  Jmonospace: 0xFF2A,
  Jsmall: 0xF76A,
  K: 0x004B,
  KBsquare: 0x3385,
  KKsquare: 0x33CD,
  Kabashkircyrillic: 0x04A0,
  Kacute: 0x1E30,
  Kacyrillic: 0x041A,
  Kadescendercyrillic: 0x049A,
  Kahookcyrillic: 0x04C3,
  Kappa: 0x039A,
  Kastrokecyrillic: 0x049E,
  Kaverticalstrokecyrillic: 0x049C,
  Kcaron: 0x01E8,
  Kcedilla: 0x0136,
  Kcircle: 0x24C0,
  Kcommaaccent: 0x0136,
  Kdotbelow: 0x1E32,
  Keharmenian: 0x0554,
  Kenarmenian: 0x053F,
  Khacyrillic: 0x0425,
  Kheicoptic: 0x03E6,
  Khook: 0x0198,
  Kjecyrillic: 0x040C,
  Klinebelow: 0x1E34,
  Kmonospace: 0xFF2B,
  Koppacyrillic: 0x0480,
  Koppagreek: 0x03DE,
  Ksicyrillic: 0x046E,
  Ksmall: 0xF76B,
  L: 0x004C,
  LJ: 0x01C7,
  LL: 0xF6BF,
  Lacute: 0x0139,
  Lambda: 0x039B,
  Lcaron: 0x013D,
  Lcedilla: 0x013B,
  Lcircle: 0x24C1,
  Lcircumflexbelow: 0x1E3C,
  Lcommaaccent: 0x013B,
  Ldot: 0x013F,
  Ldotaccent: 0x013F,
  Ldotbelow: 0x1E36,
  Ldotbelowmacron: 0x1E38,
  Liwnarmenian: 0x053C,
  Lj: 0x01C8,
  Ljecyrillic: 0x0409,
  Llinebelow: 0x1E3A,
  Lmonospace: 0xFF2C,
  Lslash: 0x0141,
  Lslashsmall: 0xF6F9,
  Lsmall: 0xF76C,
  M: 0x004D,
  MBsquare: 0x3386,
  Macron: 0xF6D0,
  Macronsmall: 0xF7AF,
  Macute: 0x1E3E,
  Mcircle: 0x24C2,
  Mdotaccent: 0x1E40,
  Mdotbelow: 0x1E42,
  Menarmenian: 0x0544,
  Mmonospace: 0xFF2D,
  Msmall: 0xF76D,
  Mturned: 0x019C,
  Mu: 0x039C,
  N: 0x004E,
  NJ: 0x01CA,
  Nacute: 0x0143,
  Ncaron: 0x0147,
  Ncedilla: 0x0145,
  Ncircle: 0x24C3,
  Ncircumflexbelow: 0x1E4A,
  Ncommaaccent: 0x0145,
  Ndotaccent: 0x1E44,
  Ndotbelow: 0x1E46,
  Nhookleft: 0x019D,
  Nineroman: 0x2168,
  Nj: 0x01CB,
  Njecyrillic: 0x040A,
  Nlinebelow: 0x1E48,
  Nmonospace: 0xFF2E,
  Nowarmenian: 0x0546,
  Nsmall: 0xF76E,
  Ntilde: 0x00D1,
  Ntildesmall: 0xF7F1,
  Nu: 0x039D,
  O: 0x004F,
  OE: 0x0152,
  OEsmall: 0xF6FA,
  Oacute: 0x00D3,
  Oacutesmall: 0xF7F3,
  Obarredcyrillic: 0x04E8,
  Obarreddieresiscyrillic: 0x04EA,
  Obreve: 0x014E,
  Ocaron: 0x01D1,
  Ocenteredtilde: 0x019F,
  Ocircle: 0x24C4,
  Ocircumflex: 0x00D4,
  Ocircumflexacute: 0x1ED0,
  Ocircumflexdotbelow: 0x1ED8,
  Ocircumflexgrave: 0x1ED2,
  Ocircumflexhookabove: 0x1ED4,
  Ocircumflexsmall: 0xF7F4,
  Ocircumflextilde: 0x1ED6,
  Ocyrillic: 0x041E,
  Odblacute: 0x0150,
  Odblgrave: 0x020C,
  Odieresis: 0x00D6,
  Odieresiscyrillic: 0x04E6,
  Odieresissmall: 0xF7F6,
  Odotbelow: 0x1ECC,
  Ogoneksmall: 0xF6FB,
  Ograve: 0x00D2,
  Ogravesmall: 0xF7F2,
  Oharmenian: 0x0555,
  Ohm: 0x2126,
  Ohookabove: 0x1ECE,
  Ohorn: 0x01A0,
  Ohornacute: 0x1EDA,
  Ohorndotbelow: 0x1EE2,
  Ohorngrave: 0x1EDC,
  Ohornhookabove: 0x1EDE,
  Ohorntilde: 0x1EE0,
  Ohungarumlaut: 0x0150,
  Oi: 0x01A2,
  Oinvertedbreve: 0x020E,
  Omacron: 0x014C,
  Omacronacute: 0x1E52,
  Omacrongrave: 0x1E50,
  Omega: 0x2126,
  Omegacyrillic: 0x0460,
  Omegagreek: 0x03A9,
  Omegaroundcyrillic: 0x047A,
  Omegatitlocyrillic: 0x047C,
  Omegatonos: 0x038F,
  Omicron: 0x039F,
  Omicrontonos: 0x038C,
  Omonospace: 0xFF2F,
  Oneroman: 0x2160,
  Oogonek: 0x01EA,
  Oogonekmacron: 0x01EC,
  Oopen: 0x0186,
  Oslash: 0x00D8,
  Oslashacute: 0x01FE,
  Oslashsmall: 0xF7F8,
  Osmall: 0xF76F,
  Ostrokeacute: 0x01FE,
  Otcyrillic: 0x047E,
  Otilde: 0x00D5,
  Otildeacute: 0x1E4C,
  Otildedieresis: 0x1E4E,
  Otildesmall: 0xF7F5,
  P: 0x0050,
  Pacute: 0x1E54,
  Pcircle: 0x24C5,
  Pdotaccent: 0x1E56,
  Pecyrillic: 0x041F,
  Peharmenian: 0x054A,
  Pemiddlehookcyrillic: 0x04A6,
  Phi: 0x03A6,
  Phook: 0x01A4,
  Pi: 0x03A0,
  Piwrarmenian: 0x0553,
  Pmonospace: 0xFF30,
  Psi: 0x03A8,
  Psicyrillic: 0x0470,
  Psmall: 0xF770,
  Q: 0x0051,
  Qcircle: 0x24C6,
  Qmonospace: 0xFF31,
  Qsmall: 0xF771,
  R: 0x0052,
  Raarmenian: 0x054C,
  Racute: 0x0154,
  Rcaron: 0x0158,
  Rcedilla: 0x0156,
  Rcircle: 0x24C7,
  Rcommaaccent: 0x0156,
  Rdblgrave: 0x0210,
  Rdotaccent: 0x1E58,
  Rdotbelow: 0x1E5A,
  Rdotbelowmacron: 0x1E5C,
  Reharmenian: 0x0550,
  Rfraktur: 0x211C,
  Rho: 0x03A1,
  Ringsmall: 0xF6FC,
  Rinvertedbreve: 0x0212,
  Rlinebelow: 0x1E5E,
  Rmonospace: 0xFF32,
  Rsmall: 0xF772,
  Rsmallinverted: 0x0281,
  Rsmallinvertedsuperior: 0x02B6,
  S: 0x0053,
  SF010000: 0x250C,
  SF020000: 0x2514,
  SF030000: 0x2510,
  SF040000: 0x2518,
  SF050000: 0x253C,
  SF060000: 0x252C,
  SF070000: 0x2534,
  SF080000: 0x251C,
  SF090000: 0x2524,
  SF100000: 0x2500,
  SF110000: 0x2502,
  SF190000: 0x2561,
  SF200000: 0x2562,
  SF210000: 0x2556,
  SF220000: 0x2555,
  SF230000: 0x2563,
  SF240000: 0x2551,
  SF250000: 0x2557,
  SF260000: 0x255D,
  SF270000: 0x255C,
  SF280000: 0x255B,
  SF360000: 0x255E,
  SF370000: 0x255F,
  SF380000: 0x255A,
  SF390000: 0x2554,
  SF400000: 0x2569,
  SF410000: 0x2566,
  SF420000: 0x2560,
  SF430000: 0x2550,
  SF440000: 0x256C,
  SF450000: 0x2567,
  SF460000: 0x2568,
  SF470000: 0x2564,
  SF480000: 0x2565,
  SF490000: 0x2559,
  SF500000: 0x2558,
  SF510000: 0x2552,
  SF520000: 0x2553,
  SF530000: 0x256B,
  SF540000: 0x256A,
  Sacute: 0x015A,
  Sacutedotaccent: 0x1E64,
  Sampigreek: 0x03E0,
  Scaron: 0x0160,
  Scarondotaccent: 0x1E66,
  Scaronsmall: 0xF6FD,
  Scedilla: 0x015E,
  Schwa: 0x018F,
  Schwacyrillic: 0x04D8,
  Schwadieresiscyrillic: 0x04DA,
  Scircle: 0x24C8,
  Scircumflex: 0x015C,
  Scommaaccent: 0x0218,
  Sdotaccent: 0x1E60,
  Sdotbelow: 0x1E62,
  Sdotbelowdotaccent: 0x1E68,
  Seharmenian: 0x054D,
  Sevenroman: 0x2166,
  Shaarmenian: 0x0547,
  Shacyrillic: 0x0428,
  Shchacyrillic: 0x0429,
  Sheicoptic: 0x03E2,
  Shhacyrillic: 0x04BA,
  Shimacoptic: 0x03EC,
  Sigma: 0x03A3,
  Sixroman: 0x2165,
  Smonospace: 0xFF33,
  Softsigncyrillic: 0x042C,
  Ssmall: 0xF773,
  Stigmagreek: 0x03DA,
  T: 0x0054,
  Tau: 0x03A4,
  Tbar: 0x0166,
  Tcaron: 0x0164,
  Tcedilla: 0x0162,
  Tcircle: 0x24C9,
  Tcircumflexbelow: 0x1E70,
  Tcommaaccent: 0x0162,
  Tdotaccent: 0x1E6A,
  Tdotbelow: 0x1E6C,
  Tecyrillic: 0x0422,
  Tedescendercyrillic: 0x04AC,
  Tenroman: 0x2169,
  Tetsecyrillic: 0x04B4,
  Theta: 0x0398,
  Thook: 0x01AC,
  Thorn: 0x00DE,
  Thornsmall: 0xF7FE,
  Threeroman: 0x2162,
  Tildesmall: 0xF6FE,
  Tiwnarmenian: 0x054F,
  Tlinebelow: 0x1E6E,
  Tmonospace: 0xFF34,
  Toarmenian: 0x0539,
  Tonefive: 0x01BC,
  Tonesix: 0x0184,
  Tonetwo: 0x01A7,
  Tretroflexhook: 0x01AE,
  Tsecyrillic: 0x0426,
  Tshecyrillic: 0x040B,
  Tsmall: 0xF774,
  Twelveroman: 0x216B,
  Tworoman: 0x2161,
  U: 0x0055,
  Uacute: 0x00DA,
  Uacutesmall: 0xF7FA,
  Ubreve: 0x016C,
  Ucaron: 0x01D3,
  Ucircle: 0x24CA,
  Ucircumflex: 0x00DB,
  Ucircumflexbelow: 0x1E76,
  Ucircumflexsmall: 0xF7FB,
  Ucyrillic: 0x0423,
  Udblacute: 0x0170,
  Udblgrave: 0x0214,
  Udieresis: 0x00DC,
  Udieresisacute: 0x01D7,
  Udieresisbelow: 0x1E72,
  Udieresiscaron: 0x01D9,
  Udieresiscyrillic: 0x04F0,
  Udieresisgrave: 0x01DB,
  Udieresismacron: 0x01D5,
  Udieresissmall: 0xF7FC,
  Udotbelow: 0x1EE4,
  Ugrave: 0x00D9,
  Ugravesmall: 0xF7F9,
  Uhookabove: 0x1EE6,
  Uhorn: 0x01AF,
  Uhornacute: 0x1EE8,
  Uhorndotbelow: 0x1EF0,
  Uhorngrave: 0x1EEA,
  Uhornhookabove: 0x1EEC,
  Uhorntilde: 0x1EEE,
  Uhungarumlaut: 0x0170,
  Uhungarumlautcyrillic: 0x04F2,
  Uinvertedbreve: 0x0216,
  Ukcyrillic: 0x0478,
  Umacron: 0x016A,
  Umacroncyrillic: 0x04EE,
  Umacrondieresis: 0x1E7A,
  Umonospace: 0xFF35,
  Uogonek: 0x0172,
  Upsilon: 0x03A5,
  Upsilon1: 0x03D2,
  Upsilonacutehooksymbolgreek: 0x03D3,
  Upsilonafrican: 0x01B1,
  Upsilondieresis: 0x03AB,
  Upsilondieresishooksymbolgreek: 0x03D4,
  Upsilonhooksymbol: 0x03D2,
  Upsilontonos: 0x038E,
  Uring: 0x016E,
  Ushortcyrillic: 0x040E,
  Usmall: 0xF775,
  Ustraightcyrillic: 0x04AE,
  Ustraightstrokecyrillic: 0x04B0,
  Utilde: 0x0168,
  Utildeacute: 0x1E78,
  Utildebelow: 0x1E74,
  V: 0x0056,
  Vcircle: 0x24CB,
  Vdotbelow: 0x1E7E,
  Vecyrillic: 0x0412,
  Vewarmenian: 0x054E,
  Vhook: 0x01B2,
  Vmonospace: 0xFF36,
  Voarmenian: 0x0548,
  Vsmall: 0xF776,
  Vtilde: 0x1E7C,
  W: 0x0057,
  Wacute: 0x1E82,
  Wcircle: 0x24CC,
  Wcircumflex: 0x0174,
  Wdieresis: 0x1E84,
  Wdotaccent: 0x1E86,
  Wdotbelow: 0x1E88,
  Wgrave: 0x1E80,
  Wmonospace: 0xFF37,
  Wsmall: 0xF777,
  X: 0x0058,
  Xcircle: 0x24CD,
  Xdieresis: 0x1E8C,
  Xdotaccent: 0x1E8A,
  Xeharmenian: 0x053D,
  Xi: 0x039E,
  Xmonospace: 0xFF38,
  Xsmall: 0xF778,
  Y: 0x0059,
  Yacute: 0x00DD,
  Yacutesmall: 0xF7FD,
  Yatcyrillic: 0x0462,
  Ycircle: 0x24CE,
  Ycircumflex: 0x0176,
  Ydieresis: 0x0178,
  Ydieresissmall: 0xF7FF,
  Ydotaccent: 0x1E8E,
  Ydotbelow: 0x1EF4,
  Yericyrillic: 0x042B,
  Yerudieresiscyrillic: 0x04F8,
  Ygrave: 0x1EF2,
  Yhook: 0x01B3,
  Yhookabove: 0x1EF6,
  Yiarmenian: 0x0545,
  Yicyrillic: 0x0407,
  Yiwnarmenian: 0x0552,
  Ymonospace: 0xFF39,
  Ysmall: 0xF779,
  Ytilde: 0x1EF8,
  Yusbigcyrillic: 0x046A,
  Yusbigiotifiedcyrillic: 0x046C,
  Yuslittlecyrillic: 0x0466,
  Yuslittleiotifiedcyrillic: 0x0468,
  Z: 0x005A,
  Zaarmenian: 0x0536,
  Zacute: 0x0179,
  Zcaron: 0x017D,
  Zcaronsmall: 0xF6FF,
  Zcircle: 0x24CF,
  Zcircumflex: 0x1E90,
  Zdot: 0x017B,
  Zdotaccent: 0x017B,
  Zdotbelow: 0x1E92,
  Zecyrillic: 0x0417,
  Zedescendercyrillic: 0x0498,
  Zedieresiscyrillic: 0x04DE,
  Zeta: 0x0396,
  Zhearmenian: 0x053A,
  Zhebrevecyrillic: 0x04C1,
  Zhecyrillic: 0x0416,
  Zhedescendercyrillic: 0x0496,
  Zhedieresiscyrillic: 0x04DC,
  Zlinebelow: 0x1E94,
  Zmonospace: 0xFF3A,
  Zsmall: 0xF77A,
  Zstroke: 0x01B5,
  a: 0x0061,
  aabengali: 0x0986,
  aacute: 0x00E1,
  aadeva: 0x0906,
  aagujarati: 0x0A86,
  aagurmukhi: 0x0A06,
  aamatragurmukhi: 0x0A3E,
  aarusquare: 0x3303,
  aavowelsignbengali: 0x09BE,
  aavowelsigndeva: 0x093E,
  aavowelsigngujarati: 0x0ABE,
  abbreviationmarkarmenian: 0x055F,
  abbreviationsigndeva: 0x0970,
  abengali: 0x0985,
  abopomofo: 0x311A,
  abreve: 0x0103,
  abreveacute: 0x1EAF,
  abrevecyrillic: 0x04D1,
  abrevedotbelow: 0x1EB7,
  abrevegrave: 0x1EB1,
  abrevehookabove: 0x1EB3,
  abrevetilde: 0x1EB5,
  acaron: 0x01CE,
  acircle: 0x24D0,
  acircumflex: 0x00E2,
  acircumflexacute: 0x1EA5,
  acircumflexdotbelow: 0x1EAD,
  acircumflexgrave: 0x1EA7,
  acircumflexhookabove: 0x1EA9,
  acircumflextilde: 0x1EAB,
  acute: 0x00B4,
  acutebelowcmb: 0x0317,
  acutecmb: 0x0301,
  acutecomb: 0x0301,
  acutedeva: 0x0954,
  acutelowmod: 0x02CF,
  acutetonecmb: 0x0341,
  acyrillic: 0x0430,
  adblgrave: 0x0201,
  addakgurmukhi: 0x0A71,
  adeva: 0x0905,
  adieresis: 0x00E4,
  adieresiscyrillic: 0x04D3,
  adieresismacron: 0x01DF,
  adotbelow: 0x1EA1,
  adotmacron: 0x01E1,
  ae: 0x00E6,
  aeacute: 0x01FD,
  aekorean: 0x3150,
  aemacron: 0x01E3,
  afii00208: 0x2015,
  afii08941: 0x20A4,
  afii10017: 0x0410,
  afii10018: 0x0411,
  afii10019: 0x0412,
  afii10020: 0x0413,
  afii10021: 0x0414,
  afii10022: 0x0415,
  afii10023: 0x0401,
  afii10024: 0x0416,
  afii10025: 0x0417,
  afii10026: 0x0418,
  afii10027: 0x0419,
  afii10028: 0x041A,
  afii10029: 0x041B,
  afii10030: 0x041C,
  afii10031: 0x041D,
  afii10032: 0x041E,
  afii10033: 0x041F,
  afii10034: 0x0420,
  afii10035: 0x0421,
  afii10036: 0x0422,
  afii10037: 0x0423,
  afii10038: 0x0424,
  afii10039: 0x0425,
  afii10040: 0x0426,
  afii10041: 0x0427,
  afii10042: 0x0428,
  afii10043: 0x0429,
  afii10044: 0x042A,
  afii10045: 0x042B,
  afii10046: 0x042C,
  afii10047: 0x042D,
  afii10048: 0x042E,
  afii10049: 0x042F,
  afii10050: 0x0490,
  afii10051: 0x0402,
  afii10052: 0x0403,
  afii10053: 0x0404,
  afii10054: 0x0405,
  afii10055: 0x0406,
  afii10056: 0x0407,
  afii10057: 0x0408,
  afii10058: 0x0409,
  afii10059: 0x040A,
  afii10060: 0x040B,
  afii10061: 0x040C,
  afii10062: 0x040E,
  afii10063: 0xF6C4,
  afii10064: 0xF6C5,
  afii10065: 0x0430,
  afii10066: 0x0431,
  afii10067: 0x0432,
  afii10068: 0x0433,
  afii10069: 0x0434,
  afii10070: 0x0435,
  afii10071: 0x0451,
  afii10072: 0x0436,
  afii10073: 0x0437,
  afii10074: 0x0438,
  afii10075: 0x0439,
  afii10076: 0x043A,
  afii10077: 0x043B,
  afii10078: 0x043C,
  afii10079: 0x043D,
  afii10080: 0x043E,
  afii10081: 0x043F,
  afii10082: 0x0440,
  afii10083: 0x0441,
  afii10084: 0x0442,
  afii10085: 0x0443,
  afii10086: 0x0444,
  afii10087: 0x0445,
  afii10088: 0x0446,
  afii10089: 0x0447,
  afii10090: 0x0448,
  afii10091: 0x0449,
  afii10092: 0x044A,
  afii10093: 0x044B,
  afii10094: 0x044C,
  afii10095: 0x044D,
  afii10096: 0x044E,
  afii10097: 0x044F,
  afii10098: 0x0491,
  afii10099: 0x0452,
  afii10100: 0x0453,
  afii10101: 0x0454,
  afii10102: 0x0455,
  afii10103: 0x0456,
  afii10104: 0x0457,
  afii10105: 0x0458,
  afii10106: 0x0459,
  afii10107: 0x045A,
  afii10108: 0x045B,
  afii10109: 0x045C,
  afii10110: 0x045E,
  afii10145: 0x040F,
  afii10146: 0x0462,
  afii10147: 0x0472,
  afii10148: 0x0474,
  afii10192: 0xF6C6,
  afii10193: 0x045F,
  afii10194: 0x0463,
  afii10195: 0x0473,
  afii10196: 0x0475,
  afii10831: 0xF6C7,
  afii10832: 0xF6C8,
  afii10846: 0x04D9,
  afii299: 0x200E,
  afii300: 0x200F,
  afii301: 0x200D,
  afii57381: 0x066A,
  afii57388: 0x060C,
  afii57392: 0x0660,
  afii57393: 0x0661,
  afii57394: 0x0662,
  afii57395: 0x0663,
  afii57396: 0x0664,
  afii57397: 0x0665,
  afii57398: 0x0666,
  afii57399: 0x0667,
  afii57400: 0x0668,
  afii57401: 0x0669,
  afii57403: 0x061B,
  afii57407: 0x061F,
  afii57409: 0x0621,
  afii57410: 0x0622,
  afii57411: 0x0623,
  afii57412: 0x0624,
  afii57413: 0x0625,
  afii57414: 0x0626,
  afii57415: 0x0627,
  afii57416: 0x0628,
  afii57417: 0x0629,
  afii57418: 0x062A,
  afii57419: 0x062B,
  afii57420: 0x062C,
  afii57421: 0x062D,
  afii57422: 0x062E,
  afii57423: 0x062F,
  afii57424: 0x0630,
  afii57425: 0x0631,
  afii57426: 0x0632,
  afii57427: 0x0633,
  afii57428: 0x0634,
  afii57429: 0x0635,
  afii57430: 0x0636,
  afii57431: 0x0637,
  afii57432: 0x0638,
  afii57433: 0x0639,
  afii57434: 0x063A,
  afii57440: 0x0640,
  afii57441: 0x0641,
  afii57442: 0x0642,
  afii57443: 0x0643,
  afii57444: 0x0644,
  afii57445: 0x0645,
  afii57446: 0x0646,
  afii57448: 0x0648,
  afii57449: 0x0649,
  afii57450: 0x064A,
  afii57451: 0x064B,
  afii57452: 0x064C,
  afii57453: 0x064D,
  afii57454: 0x064E,
  afii57455: 0x064F,
  afii57456: 0x0650,
  afii57457: 0x0651,
  afii57458: 0x0652,
  afii57470: 0x0647,
  afii57505: 0x06A4,
  afii57506: 0x067E,
  afii57507: 0x0686,
  afii57508: 0x0698,
  afii57509: 0x06AF,
  afii57511: 0x0679,
  afii57512: 0x0688,
  afii57513: 0x0691,
  afii57514: 0x06BA,
  afii57519: 0x06D2,
  afii57534: 0x06D5,
  afii57636: 0x20AA,
  afii57645: 0x05BE,
  afii57658: 0x05C3,
  afii57664: 0x05D0,
  afii57665: 0x05D1,
  afii57666: 0x05D2,
  afii57667: 0x05D3,
  afii57668: 0x05D4,
  afii57669: 0x05D5,
  afii57670: 0x05D6,
  afii57671: 0x05D7,
  afii57672: 0x05D8,
  afii57673: 0x05D9,
  afii57674: 0x05DA,
  afii57675: 0x05DB,
  afii57676: 0x05DC,
  afii57677: 0x05DD,
  afii57678: 0x05DE,
  afii57679: 0x05DF,
  afii57680: 0x05E0,
  afii57681: 0x05E1,
  afii57682: 0x05E2,
  afii57683: 0x05E3,
  afii57684: 0x05E4,
  afii57685: 0x05E5,
  afii57686: 0x05E6,
  afii57687: 0x05E7,
  afii57688: 0x05E8,
  afii57689: 0x05E9,
  afii57690: 0x05EA,
  afii57694: 0xFB2A,
  afii57695: 0xFB2B,
  afii57700: 0xFB4B,
  afii57705: 0xFB1F,
  afii57716: 0x05F0,
  afii57717: 0x05F1,
  afii57718: 0x05F2,
  afii57723: 0xFB35,
  afii57793: 0x05B4,
  afii57794: 0x05B5,
  afii57795: 0x05B6,
  afii57796: 0x05BB,
  afii57797: 0x05B8,
  afii57798: 0x05B7,
  afii57799: 0x05B0,
  afii57800: 0x05B2,
  afii57801: 0x05B1,
  afii57802: 0x05B3,
  afii57803: 0x05C2,
  afii57804: 0x05C1,
  afii57806: 0x05B9,
  afii57807: 0x05BC,
  afii57839: 0x05BD,
  afii57841: 0x05BF,
  afii57842: 0x05C0,
  afii57929: 0x02BC,
  afii61248: 0x2105,
  afii61289: 0x2113,
  afii61352: 0x2116,
  afii61573: 0x202C,
  afii61574: 0x202D,
  afii61575: 0x202E,
  afii61664: 0x200C,
  afii63167: 0x066D,
  afii64937: 0x02BD,
  agrave: 0x00E0,
  agujarati: 0x0A85,
  agurmukhi: 0x0A05,
  ahiragana: 0x3042,
  ahookabove: 0x1EA3,
  aibengali: 0x0990,
  aibopomofo: 0x311E,
  aideva: 0x0910,
  aiecyrillic: 0x04D5,
  aigujarati: 0x0A90,
  aigurmukhi: 0x0A10,
  aimatragurmukhi: 0x0A48,
  ainarabic: 0x0639,
  ainfinalarabic: 0xFECA,
  aininitialarabic: 0xFECB,
  ainmedialarabic: 0xFECC,
  ainvertedbreve: 0x0203,
  aivowelsignbengali: 0x09C8,
  aivowelsigndeva: 0x0948,
  aivowelsigngujarati: 0x0AC8,
  akatakana: 0x30A2,
  akatakanahalfwidth: 0xFF71,
  akorean: 0x314F,
  alef: 0x05D0,
  alefarabic: 0x0627,
  alefdageshhebrew: 0xFB30,
  aleffinalarabic: 0xFE8E,
  alefhamzaabovearabic: 0x0623,
  alefhamzaabovefinalarabic: 0xFE84,
  alefhamzabelowarabic: 0x0625,
  alefhamzabelowfinalarabic: 0xFE88,
  alefhebrew: 0x05D0,
  aleflamedhebrew: 0xFB4F,
  alefmaddaabovearabic: 0x0622,
  alefmaddaabovefinalarabic: 0xFE82,
  alefmaksuraarabic: 0x0649,
  alefmaksurafinalarabic: 0xFEF0,
  alefmaksurainitialarabic: 0xFEF3,
  alefmaksuramedialarabic: 0xFEF4,
  alefpatahhebrew: 0xFB2E,
  alefqamatshebrew: 0xFB2F,
  aleph: 0x2135,
  allequal: 0x224C,
  alpha: 0x03B1,
  alphatonos: 0x03AC,
  amacron: 0x0101,
  amonospace: 0xFF41,
  ampersand: 0x0026,
  ampersandmonospace: 0xFF06,
  ampersandsmall: 0xF726,
  amsquare: 0x33C2,
  anbopomofo: 0x3122,
  angbopomofo: 0x3124,
  angbracketleft: 0x3008, // This glyph is missing from Adobe's original list.
  angbracketright: 0x3009, // This glyph is missing from Adobe's original list.
  angkhankhuthai: 0x0E5A,
  angle: 0x2220,
  anglebracketleft: 0x3008,
  anglebracketleftvertical: 0xFE3F,
  anglebracketright: 0x3009,
  anglebracketrightvertical: 0xFE40,
  angleleft: 0x2329,
  angleright: 0x232A,
  angstrom: 0x212B,
  anoteleia: 0x0387,
  anudattadeva: 0x0952,
  anusvarabengali: 0x0982,
  anusvaradeva: 0x0902,
  anusvaragujarati: 0x0A82,
  aogonek: 0x0105,
  apaatosquare: 0x3300,
  aparen: 0x249C,
  apostrophearmenian: 0x055A,
  apostrophemod: 0x02BC,
  apple: 0xF8FF,
  approaches: 0x2250,
  approxequal: 0x2248,
  approxequalorimage: 0x2252,
  approximatelyequal: 0x2245,
  araeaekorean: 0x318E,
  araeakorean: 0x318D,
  arc: 0x2312,
  arighthalfring: 0x1E9A,
  aring: 0x00E5,
  aringacute: 0x01FB,
  aringbelow: 0x1E01,
  arrowboth: 0x2194,
  arrowdashdown: 0x21E3,
  arrowdashleft: 0x21E0,
  arrowdashright: 0x21E2,
  arrowdashup: 0x21E1,
  arrowdblboth: 0x21D4,
  arrowdbldown: 0x21D3,
  arrowdblleft: 0x21D0,
  arrowdblright: 0x21D2,
  arrowdblup: 0x21D1,
  arrowdown: 0x2193,
  arrowdownleft: 0x2199,
  arrowdownright: 0x2198,
  arrowdownwhite: 0x21E9,
  arrowheaddownmod: 0x02C5,
  arrowheadleftmod: 0x02C2,
  arrowheadrightmod: 0x02C3,
  arrowheadupmod: 0x02C4,
  arrowhorizex: 0xF8E7,
  arrowleft: 0x2190,
  arrowleftdbl: 0x21D0,
  arrowleftdblstroke: 0x21CD,
  arrowleftoverright: 0x21C6,
  arrowleftwhite: 0x21E6,
  arrowright: 0x2192,
  arrowrightdblstroke: 0x21CF,
  arrowrightheavy: 0x279E,
  arrowrightoverleft: 0x21C4,
  arrowrightwhite: 0x21E8,
  arrowtableft: 0x21E4,
  arrowtabright: 0x21E5,
  arrowup: 0x2191,
  arrowupdn: 0x2195,
  arrowupdnbse: 0x21A8,
  arrowupdownbase: 0x21A8,
  arrowupleft: 0x2196,
  arrowupleftofdown: 0x21C5,
  arrowupright: 0x2197,
  arrowupwhite: 0x21E7,
  arrowvertex: 0xF8E6,
  asciicircum: 0x005E,
  asciicircummonospace: 0xFF3E,
  asciitilde: 0x007E,
  asciitildemonospace: 0xFF5E,
  ascript: 0x0251,
  ascriptturned: 0x0252,
  asmallhiragana: 0x3041,
  asmallkatakana: 0x30A1,
  asmallkatakanahalfwidth: 0xFF67,
  asterisk: 0x002A,
  asteriskaltonearabic: 0x066D,
  asteriskarabic: 0x066D,
  asteriskmath: 0x2217,
  asteriskmonospace: 0xFF0A,
  asterisksmall: 0xFE61,
  asterism: 0x2042,
  asuperior: 0xF6E9,
  asymptoticallyequal: 0x2243,
  at: 0x0040,
  atilde: 0x00E3,
  atmonospace: 0xFF20,
  atsmall: 0xFE6B,
  aturned: 0x0250,
  aubengali: 0x0994,
  aubopomofo: 0x3120,
  audeva: 0x0914,
  augujarati: 0x0A94,
  augurmukhi: 0x0A14,
  aulengthmarkbengali: 0x09D7,
  aumatragurmukhi: 0x0A4C,
  auvowelsignbengali: 0x09CC,
  auvowelsigndeva: 0x094C,
  auvowelsigngujarati: 0x0ACC,
  avagrahadeva: 0x093D,
  aybarmenian: 0x0561,
  ayin: 0x05E2,
  ayinaltonehebrew: 0xFB20,
  ayinhebrew: 0x05E2,
  b: 0x0062,
  babengali: 0x09AC,
  backslash: 0x005C,
  backslashmonospace: 0xFF3C,
  badeva: 0x092C,
  bagujarati: 0x0AAC,
  bagurmukhi: 0x0A2C,
  bahiragana: 0x3070,
  bahtthai: 0x0E3F,
  bakatakana: 0x30D0,
  bar: 0x007C,
  barmonospace: 0xFF5C,
  bbopomofo: 0x3105,
  bcircle: 0x24D1,
  bdotaccent: 0x1E03,
  bdotbelow: 0x1E05,
  beamedsixteenthnotes: 0x266C,
  because: 0x2235,
  becyrillic: 0x0431,
  beharabic: 0x0628,
  behfinalarabic: 0xFE90,
  behinitialarabic: 0xFE91,
  behiragana: 0x3079,
  behmedialarabic: 0xFE92,
  behmeeminitialarabic: 0xFC9F,
  behmeemisolatedarabic: 0xFC08,
  behnoonfinalarabic: 0xFC6D,
  bekatakana: 0x30D9,
  benarmenian: 0x0562,
  bet: 0x05D1,
  beta: 0x03B2,
  betasymbolgreek: 0x03D0,
  betdagesh: 0xFB31,
  betdageshhebrew: 0xFB31,
  bethebrew: 0x05D1,
  betrafehebrew: 0xFB4C,
  bhabengali: 0x09AD,
  bhadeva: 0x092D,
  bhagujarati: 0x0AAD,
  bhagurmukhi: 0x0A2D,
  bhook: 0x0253,
  bihiragana: 0x3073,
  bikatakana: 0x30D3,
  bilabialclick: 0x0298,
  bindigurmukhi: 0x0A02,
  birusquare: 0x3331,
  blackcircle: 0x25CF,
  blackdiamond: 0x25C6,
  blackdownpointingtriangle: 0x25BC,
  blackleftpointingpointer: 0x25C4,
  blackleftpointingtriangle: 0x25C0,
  blacklenticularbracketleft: 0x3010,
  blacklenticularbracketleftvertical: 0xFE3B,
  blacklenticularbracketright: 0x3011,
  blacklenticularbracketrightvertical: 0xFE3C,
  blacklowerlefttriangle: 0x25E3,
  blacklowerrighttriangle: 0x25E2,
  blackrectangle: 0x25AC,
  blackrightpointingpointer: 0x25BA,
  blackrightpointingtriangle: 0x25B6,
  blacksmallsquare: 0x25AA,
  blacksmilingface: 0x263B,
  blacksquare: 0x25A0,
  blackstar: 0x2605,
  blackupperlefttriangle: 0x25E4,
  blackupperrighttriangle: 0x25E5,
  blackuppointingsmalltriangle: 0x25B4,
  blackuppointingtriangle: 0x25B2,
  blank: 0x2423,
  blinebelow: 0x1E07,
  block: 0x2588,
  bmonospace: 0xFF42,
  bobaimaithai: 0x0E1A,
  bohiragana: 0x307C,
  bokatakana: 0x30DC,
  bparen: 0x249D,
  bqsquare: 0x33C3,
  braceex: 0xF8F4,
  braceleft: 0x007B,
  braceleftbt: 0xF8F3,
  braceleftmid: 0xF8F2,
  braceleftmonospace: 0xFF5B,
  braceleftsmall: 0xFE5B,
  bracelefttp: 0xF8F1,
  braceleftvertical: 0xFE37,
  braceright: 0x007D,
  bracerightbt: 0xF8FE,
  bracerightmid: 0xF8FD,
  bracerightmonospace: 0xFF5D,
  bracerightsmall: 0xFE5C,
  bracerighttp: 0xF8FC,
  bracerightvertical: 0xFE38,
  bracketleft: 0x005B,
  bracketleftbt: 0xF8F0,
  bracketleftex: 0xF8EF,
  bracketleftmonospace: 0xFF3B,
  bracketlefttp: 0xF8EE,
  bracketright: 0x005D,
  bracketrightbt: 0xF8FB,
  bracketrightex: 0xF8FA,
  bracketrightmonospace: 0xFF3D,
  bracketrighttp: 0xF8F9,
  breve: 0x02D8,
  brevebelowcmb: 0x032E,
  brevecmb: 0x0306,
  breveinvertedbelowcmb: 0x032F,
  breveinvertedcmb: 0x0311,
  breveinverteddoublecmb: 0x0361,
  bridgebelowcmb: 0x032A,
  bridgeinvertedbelowcmb: 0x033A,
  brokenbar: 0x00A6,
  bstroke: 0x0180,
  bsuperior: 0xF6EA,
  btopbar: 0x0183,
  buhiragana: 0x3076,
  bukatakana: 0x30D6,
  bullet: 0x2022,
  bulletinverse: 0x25D8,
  bulletoperator: 0x2219,
  bullseye: 0x25CE,
  c: 0x0063,
  caarmenian: 0x056E,
  cabengali: 0x099A,
  cacute: 0x0107,
  cadeva: 0x091A,
  cagujarati: 0x0A9A,
  cagurmukhi: 0x0A1A,
  calsquare: 0x3388,
  candrabindubengali: 0x0981,
  candrabinducmb: 0x0310,
  candrabindudeva: 0x0901,
  candrabindugujarati: 0x0A81,
  capslock: 0x21EA,
  careof: 0x2105,
  caron: 0x02C7,
  caronbelowcmb: 0x032C,
  caroncmb: 0x030C,
  carriagereturn: 0x21B5,
  cbopomofo: 0x3118,
  ccaron: 0x010D,
  ccedilla: 0x00E7,
  ccedillaacute: 0x1E09,
  ccircle: 0x24D2,
  ccircumflex: 0x0109,
  ccurl: 0x0255,
  cdot: 0x010B,
  cdotaccent: 0x010B,
  cdsquare: 0x33C5,
  cedilla: 0x00B8,
  cedillacmb: 0x0327,
  cent: 0x00A2,
  centigrade: 0x2103,
  centinferior: 0xF6DF,
  centmonospace: 0xFFE0,
  centoldstyle: 0xF7A2,
  centsuperior: 0xF6E0,
  chaarmenian: 0x0579,
  chabengali: 0x099B,
  chadeva: 0x091B,
  chagujarati: 0x0A9B,
  chagurmukhi: 0x0A1B,
  chbopomofo: 0x3114,
  cheabkhasiancyrillic: 0x04BD,
  checkmark: 0x2713,
  checyrillic: 0x0447,
  chedescenderabkhasiancyrillic: 0x04BF,
  chedescendercyrillic: 0x04B7,
  chedieresiscyrillic: 0x04F5,
  cheharmenian: 0x0573,
  chekhakassiancyrillic: 0x04CC,
  cheverticalstrokecyrillic: 0x04B9,
  chi: 0x03C7,
  chieuchacirclekorean: 0x3277,
  chieuchaparenkorean: 0x3217,
  chieuchcirclekorean: 0x3269,
  chieuchkorean: 0x314A,
  chieuchparenkorean: 0x3209,
  chochangthai: 0x0E0A,
  chochanthai: 0x0E08,
  chochingthai: 0x0E09,
  chochoethai: 0x0E0C,
  chook: 0x0188,
  cieucacirclekorean: 0x3276,
  cieucaparenkorean: 0x3216,
  cieuccirclekorean: 0x3268,
  cieuckorean: 0x3148,
  cieucparenkorean: 0x3208,
  cieucuparenkorean: 0x321C,
  circle: 0x25CB,
  circlecopyrt: 0x00A9, // This glyph is missing from Adobe's original list.
  circlemultiply: 0x2297,
  circleot: 0x2299,
  circleplus: 0x2295,
  circlepostalmark: 0x3036,
  circlewithlefthalfblack: 0x25D0,
  circlewithrighthalfblack: 0x25D1,
  circumflex: 0x02C6,
  circumflexbelowcmb: 0x032D,
  circumflexcmb: 0x0302,
  clear: 0x2327,
  clickalveolar: 0x01C2,
  clickdental: 0x01C0,
  clicklateral: 0x01C1,
  clickretroflex: 0x01C3,
  club: 0x2663,
  clubsuitblack: 0x2663,
  clubsuitwhite: 0x2667,
  cmcubedsquare: 0x33A4,
  cmonospace: 0xFF43,
  cmsquaredsquare: 0x33A0,
  coarmenian: 0x0581,
  colon: 0x003A,
  colonmonetary: 0x20A1,
  colonmonospace: 0xFF1A,
  colonsign: 0x20A1,
  colonsmall: 0xFE55,
  colontriangularhalfmod: 0x02D1,
  colontriangularmod: 0x02D0,
  comma: 0x002C,
  commaabovecmb: 0x0313,
  commaaboverightcmb: 0x0315,
  commaaccent: 0xF6C3,
  commaarabic: 0x060C,
  commaarmenian: 0x055D,
  commainferior: 0xF6E1,
  commamonospace: 0xFF0C,
  commareversedabovecmb: 0x0314,
  commareversedmod: 0x02BD,
  commasmall: 0xFE50,
  commasuperior: 0xF6E2,
  commaturnedabovecmb: 0x0312,
  commaturnedmod: 0x02BB,
  compass: 0x263C,
  congruent: 0x2245,
  contourintegral: 0x222E,
  control: 0x2303,
  controlACK: 0x0006,
  controlBEL: 0x0007,
  controlBS: 0x0008,
  controlCAN: 0x0018,
  controlCR: 0x000D,
  controlDC1: 0x0011,
  controlDC2: 0x0012,
  controlDC3: 0x0013,
  controlDC4: 0x0014,
  controlDEL: 0x007F,
  controlDLE: 0x0010,
  controlEM: 0x0019,
  controlENQ: 0x0005,
  controlEOT: 0x0004,
  controlESC: 0x001B,
  controlETB: 0x0017,
  controlETX: 0x0003,
  controlFF: 0x000C,
  controlFS: 0x001C,
  controlGS: 0x001D,
  controlHT: 0x0009,
  controlLF: 0x000A,
  controlNAK: 0x0015,
  controlRS: 0x001E,
  controlSI: 0x000F,
  controlSO: 0x000E,
  controlSOT: 0x0002,
  controlSTX: 0x0001,
  controlSUB: 0x001A,
  controlSYN: 0x0016,
  controlUS: 0x001F,
  controlVT: 0x000B,
  copyright: 0x00A9,
  copyrightsans: 0xF8E9,
  copyrightserif: 0xF6D9,
  cornerbracketleft: 0x300C,
  cornerbracketlefthalfwidth: 0xFF62,
  cornerbracketleftvertical: 0xFE41,
  cornerbracketright: 0x300D,
  cornerbracketrighthalfwidth: 0xFF63,
  cornerbracketrightvertical: 0xFE42,
  corporationsquare: 0x337F,
  cosquare: 0x33C7,
  coverkgsquare: 0x33C6,
  cparen: 0x249E,
  cruzeiro: 0x20A2,
  cstretched: 0x0297,
  curlyand: 0x22CF,
  curlyor: 0x22CE,
  currency: 0x00A4,
  cyrBreve: 0xF6D1,
  cyrFlex: 0xF6D2,
  cyrbreve: 0xF6D4,
  cyrflex: 0xF6D5,
  d: 0x0064,
  daarmenian: 0x0564,
  dabengali: 0x09A6,
  dadarabic: 0x0636,
  dadeva: 0x0926,
  dadfinalarabic: 0xFEBE,
  dadinitialarabic: 0xFEBF,
  dadmedialarabic: 0xFEC0,
  dagesh: 0x05BC,
  dageshhebrew: 0x05BC,
  dagger: 0x2020,
  daggerdbl: 0x2021,
  dagujarati: 0x0AA6,
  dagurmukhi: 0x0A26,
  dahiragana: 0x3060,
  dakatakana: 0x30C0,
  dalarabic: 0x062F,
  dalet: 0x05D3,
  daletdagesh: 0xFB33,
  daletdageshhebrew: 0xFB33,
  dalethebrew: 0x05D3,
  dalfinalarabic: 0xFEAA,
  dammaarabic: 0x064F,
  dammalowarabic: 0x064F,
  dammatanaltonearabic: 0x064C,
  dammatanarabic: 0x064C,
  danda: 0x0964,
  dargahebrew: 0x05A7,
  dargalefthebrew: 0x05A7,
  dasiapneumatacyrilliccmb: 0x0485,
  dblGrave: 0xF6D3,
  dblanglebracketleft: 0x300A,
  dblanglebracketleftvertical: 0xFE3D,
  dblanglebracketright: 0x300B,
  dblanglebracketrightvertical: 0xFE3E,
  dblarchinvertedbelowcmb: 0x032B,
  dblarrowleft: 0x21D4,
  dblarrowright: 0x21D2,
  dbldanda: 0x0965,
  dblgrave: 0xF6D6,
  dblgravecmb: 0x030F,
  dblintegral: 0x222C,
  dbllowline: 0x2017,
  dbllowlinecmb: 0x0333,
  dbloverlinecmb: 0x033F,
  dblprimemod: 0x02BA,
  dblverticalbar: 0x2016,
  dblverticallineabovecmb: 0x030E,
  dbopomofo: 0x3109,
  dbsquare: 0x33C8,
  dcaron: 0x010F,
  dcedilla: 0x1E11,
  dcircle: 0x24D3,
  dcircumflexbelow: 0x1E13,
  dcroat: 0x0111,
  ddabengali: 0x09A1,
  ddadeva: 0x0921,
  ddagujarati: 0x0AA1,
  ddagurmukhi: 0x0A21,
  ddalarabic: 0x0688,
  ddalfinalarabic: 0xFB89,
  dddhadeva: 0x095C,
  ddhabengali: 0x09A2,
  ddhadeva: 0x0922,
  ddhagujarati: 0x0AA2,
  ddhagurmukhi: 0x0A22,
  ddotaccent: 0x1E0B,
  ddotbelow: 0x1E0D,
  decimalseparatorarabic: 0x066B,
  decimalseparatorpersian: 0x066B,
  decyrillic: 0x0434,
  degree: 0x00B0,
  dehihebrew: 0x05AD,
  dehiragana: 0x3067,
  deicoptic: 0x03EF,
  dekatakana: 0x30C7,
  deleteleft: 0x232B,
  deleteright: 0x2326,
  delta: 0x03B4,
  deltaturned: 0x018D,
  denominatorminusonenumeratorbengali: 0x09F8,
  dezh: 0x02A4,
  dhabengali: 0x09A7,
  dhadeva: 0x0927,
  dhagujarati: 0x0AA7,
  dhagurmukhi: 0x0A27,
  dhook: 0x0257,
  dialytikatonos: 0x0385,
  dialytikatonoscmb: 0x0344,
  diamond: 0x2666,
  diamondsuitwhite: 0x2662,
  dieresis: 0x00A8,
  dieresisacute: 0xF6D7,
  dieresisbelowcmb: 0x0324,
  dieresiscmb: 0x0308,
  dieresisgrave: 0xF6D8,
  dieresistonos: 0x0385,
  dihiragana: 0x3062,
  dikatakana: 0x30C2,
  dittomark: 0x3003,
  divide: 0x00F7,
  divides: 0x2223,
  divisionslash: 0x2215,
  djecyrillic: 0x0452,
  dkshade: 0x2593,
  dlinebelow: 0x1E0F,
  dlsquare: 0x3397,
  dmacron: 0x0111,
  dmonospace: 0xFF44,
  dnblock: 0x2584,
  dochadathai: 0x0E0E,
  dodekthai: 0x0E14,
  dohiragana: 0x3069,
  dokatakana: 0x30C9,
  dollar: 0x0024,
  dollarinferior: 0xF6E3,
  dollarmonospace: 0xFF04,
  dollaroldstyle: 0xF724,
  dollarsmall: 0xFE69,
  dollarsuperior: 0xF6E4,
  dong: 0x20AB,
  dorusquare: 0x3326,
  dotaccent: 0x02D9,
  dotaccentcmb: 0x0307,
  dotbelowcmb: 0x0323,
  dotbelowcomb: 0x0323,
  dotkatakana: 0x30FB,
  dotlessi: 0x0131,
  dotlessj: 0xF6BE,
  dotlessjstrokehook: 0x0284,
  dotmath: 0x22C5,
  dottedcircle: 0x25CC,
  doubleyodpatah: 0xFB1F,
  doubleyodpatahhebrew: 0xFB1F,
  downtackbelowcmb: 0x031E,
  downtackmod: 0x02D5,
  dparen: 0x249F,
  dsuperior: 0xF6EB,
  dtail: 0x0256,
  dtopbar: 0x018C,
  duhiragana: 0x3065,
  dukatakana: 0x30C5,
  dz: 0x01F3,
  dzaltone: 0x02A3,
  dzcaron: 0x01C6,
  dzcurl: 0x02A5,
  dzeabkhasiancyrillic: 0x04E1,
  dzecyrillic: 0x0455,
  dzhecyrillic: 0x045F,
  e: 0x0065,
  eacute: 0x00E9,
  earth: 0x2641,
  ebengali: 0x098F,
  ebopomofo: 0x311C,
  ebreve: 0x0115,
  ecandradeva: 0x090D,
  ecandragujarati: 0x0A8D,
  ecandravowelsigndeva: 0x0945,
  ecandravowelsigngujarati: 0x0AC5,
  ecaron: 0x011B,
  ecedillabreve: 0x1E1D,
  echarmenian: 0x0565,
  echyiwnarmenian: 0x0587,
  ecircle: 0x24D4,
  ecircumflex: 0x00EA,
  ecircumflexacute: 0x1EBF,
  ecircumflexbelow: 0x1E19,
  ecircumflexdotbelow: 0x1EC7,
  ecircumflexgrave: 0x1EC1,
  ecircumflexhookabove: 0x1EC3,
  ecircumflextilde: 0x1EC5,
  ecyrillic: 0x0454,
  edblgrave: 0x0205,
  edeva: 0x090F,
  edieresis: 0x00EB,
  edot: 0x0117,
  edotaccent: 0x0117,
  edotbelow: 0x1EB9,
  eegurmukhi: 0x0A0F,
  eematragurmukhi: 0x0A47,
  efcyrillic: 0x0444,
  egrave: 0x00E8,
  egujarati: 0x0A8F,
  eharmenian: 0x0567,
  ehbopomofo: 0x311D,
  ehiragana: 0x3048,
  ehookabove: 0x1EBB,
  eibopomofo: 0x311F,
  eight: 0x0038,
  eightarabic: 0x0668,
  eightbengali: 0x09EE,
  eightcircle: 0x2467,
  eightcircleinversesansserif: 0x2791,
  eightdeva: 0x096E,
  eighteencircle: 0x2471,
  eighteenparen: 0x2485,
  eighteenperiod: 0x2499,
  eightgujarati: 0x0AEE,
  eightgurmukhi: 0x0A6E,
  eighthackarabic: 0x0668,
  eighthangzhou: 0x3028,
  eighthnotebeamed: 0x266B,
  eightideographicparen: 0x3227,
  eightinferior: 0x2088,
  eightmonospace: 0xFF18,
  eightoldstyle: 0xF738,
  eightparen: 0x247B,
  eightperiod: 0x248F,
  eightpersian: 0x06F8,
  eightroman: 0x2177,
  eightsuperior: 0x2078,
  eightthai: 0x0E58,
  einvertedbreve: 0x0207,
  eiotifiedcyrillic: 0x0465,
  ekatakana: 0x30A8,
  ekatakanahalfwidth: 0xFF74,
  ekonkargurmukhi: 0x0A74,
  ekorean: 0x3154,
  elcyrillic: 0x043B,
  element: 0x2208,
  elevencircle: 0x246A,
  elevenparen: 0x247E,
  elevenperiod: 0x2492,
  elevenroman: 0x217A,
  ellipsis: 0x2026,
  ellipsisvertical: 0x22EE,
  emacron: 0x0113,
  emacronacute: 0x1E17,
  emacrongrave: 0x1E15,
  emcyrillic: 0x043C,
  emdash: 0x2014,
  emdashvertical: 0xFE31,
  emonospace: 0xFF45,
  emphasismarkarmenian: 0x055B,
  emptyset: 0x2205,
  enbopomofo: 0x3123,
  encyrillic: 0x043D,
  endash: 0x2013,
  endashvertical: 0xFE32,
  endescendercyrillic: 0x04A3,
  eng: 0x014B,
  engbopomofo: 0x3125,
  enghecyrillic: 0x04A5,
  enhookcyrillic: 0x04C8,
  enspace: 0x2002,
  eogonek: 0x0119,
  eokorean: 0x3153,
  eopen: 0x025B,
  eopenclosed: 0x029A,
  eopenreversed: 0x025C,
  eopenreversedclosed: 0x025E,
  eopenreversedhook: 0x025D,
  eparen: 0x24A0,
  epsilon: 0x03B5,
  epsilontonos: 0x03AD,
  equal: 0x003D,
  equalmonospace: 0xFF1D,
  equalsmall: 0xFE66,
  equalsuperior: 0x207C,
  equivalence: 0x2261,
  erbopomofo: 0x3126,
  ercyrillic: 0x0440,
  ereversed: 0x0258,
  ereversedcyrillic: 0x044D,
  escyrillic: 0x0441,
  esdescendercyrillic: 0x04AB,
  esh: 0x0283,
  eshcurl: 0x0286,
  eshortdeva: 0x090E,
  eshortvowelsigndeva: 0x0946,
  eshreversedloop: 0x01AA,
  eshsquatreversed: 0x0285,
  esmallhiragana: 0x3047,
  esmallkatakana: 0x30A7,
  esmallkatakanahalfwidth: 0xFF6A,
  estimated: 0x212E,
  esuperior: 0xF6EC,
  eta: 0x03B7,
  etarmenian: 0x0568,
  etatonos: 0x03AE,
  eth: 0x00F0,
  etilde: 0x1EBD,
  etildebelow: 0x1E1B,
  etnahtafoukhhebrew: 0x0591,
  etnahtafoukhlefthebrew: 0x0591,
  etnahtahebrew: 0x0591,
  etnahtalefthebrew: 0x0591,
  eturned: 0x01DD,
  eukorean: 0x3161,
  euro: 0x20AC,
  evowelsignbengali: 0x09C7,
  evowelsigndeva: 0x0947,
  evowelsigngujarati: 0x0AC7,
  exclam: 0x0021,
  exclamarmenian: 0x055C,
  exclamdbl: 0x203C,
  exclamdown: 0x00A1,
  exclamdownsmall: 0xF7A1,
  exclammonospace: 0xFF01,
  exclamsmall: 0xF721,
  existential: 0x2203,
  ezh: 0x0292,
  ezhcaron: 0x01EF,
  ezhcurl: 0x0293,
  ezhreversed: 0x01B9,
  ezhtail: 0x01BA,
  f: 0x0066,
  fadeva: 0x095E,
  fagurmukhi: 0x0A5E,
  fahrenheit: 0x2109,
  fathaarabic: 0x064E,
  fathalowarabic: 0x064E,
  fathatanarabic: 0x064B,
  fbopomofo: 0x3108,
  fcircle: 0x24D5,
  fdotaccent: 0x1E1F,
  feharabic: 0x0641,
  feharmenian: 0x0586,
  fehfinalarabic: 0xFED2,
  fehinitialarabic: 0xFED3,
  fehmedialarabic: 0xFED4,
  feicoptic: 0x03E5,
  female: 0x2640,
  ff: 0xFB00,
  ffi: 0xFB03,
  ffl: 0xFB04,
  fi: 0xFB01,
  fifteencircle: 0x246E,
  fifteenparen: 0x2482,
  fifteenperiod: 0x2496,
  figuredash: 0x2012,
  filledbox: 0x25A0,
  filledrect: 0x25AC,
  finalkaf: 0x05DA,
  finalkafdagesh: 0xFB3A,
  finalkafdageshhebrew: 0xFB3A,
  finalkafhebrew: 0x05DA,
  finalmem: 0x05DD,
  finalmemhebrew: 0x05DD,
  finalnun: 0x05DF,
  finalnunhebrew: 0x05DF,
  finalpe: 0x05E3,
  finalpehebrew: 0x05E3,
  finaltsadi: 0x05E5,
  finaltsadihebrew: 0x05E5,
  firsttonechinese: 0x02C9,
  fisheye: 0x25C9,
  fitacyrillic: 0x0473,
  five: 0x0035,
  fivearabic: 0x0665,
  fivebengali: 0x09EB,
  fivecircle: 0x2464,
  fivecircleinversesansserif: 0x278E,
  fivedeva: 0x096B,
  fiveeighths: 0x215D,
  fivegujarati: 0x0AEB,
  fivegurmukhi: 0x0A6B,
  fivehackarabic: 0x0665,
  fivehangzhou: 0x3025,
  fiveideographicparen: 0x3224,
  fiveinferior: 0x2085,
  fivemonospace: 0xFF15,
  fiveoldstyle: 0xF735,
  fiveparen: 0x2478,
  fiveperiod: 0x248C,
  fivepersian: 0x06F5,
  fiveroman: 0x2174,
  fivesuperior: 0x2075,
  fivethai: 0x0E55,
  fl: 0xFB02,
  florin: 0x0192,
  fmonospace: 0xFF46,
  fmsquare: 0x3399,
  fofanthai: 0x0E1F,
  fofathai: 0x0E1D,
  fongmanthai: 0x0E4F,
  forall: 0x2200,
  four: 0x0034,
  fourarabic: 0x0664,
  fourbengali: 0x09EA,
  fourcircle: 0x2463,
  fourcircleinversesansserif: 0x278D,
  fourdeva: 0x096A,
  fourgujarati: 0x0AEA,
  fourgurmukhi: 0x0A6A,
  fourhackarabic: 0x0664,
  fourhangzhou: 0x3024,
  fourideographicparen: 0x3223,
  fourinferior: 0x2084,
  fourmonospace: 0xFF14,
  fournumeratorbengali: 0x09F7,
  fouroldstyle: 0xF734,
  fourparen: 0x2477,
  fourperiod: 0x248B,
  fourpersian: 0x06F4,
  fourroman: 0x2173,
  foursuperior: 0x2074,
  fourteencircle: 0x246D,
  fourteenparen: 0x2481,
  fourteenperiod: 0x2495,
  fourthai: 0x0E54,
  fourthtonechinese: 0x02CB,
  fparen: 0x24A1,
  fraction: 0x2044,
  franc: 0x20A3,
  g: 0x0067,
  gabengali: 0x0997,
  gacute: 0x01F5,
  gadeva: 0x0917,
  gafarabic: 0x06AF,
  gaffinalarabic: 0xFB93,
  gafinitialarabic: 0xFB94,
  gafmedialarabic: 0xFB95,
  gagujarati: 0x0A97,
  gagurmukhi: 0x0A17,
  gahiragana: 0x304C,
  gakatakana: 0x30AC,
  gamma: 0x03B3,
  gammalatinsmall: 0x0263,
  gammasuperior: 0x02E0,
  gangiacoptic: 0x03EB,
  gbopomofo: 0x310D,
  gbreve: 0x011F,
  gcaron: 0x01E7,
  gcedilla: 0x0123,
  gcircle: 0x24D6,
  gcircumflex: 0x011D,
  gcommaaccent: 0x0123,
  gdot: 0x0121,
  gdotaccent: 0x0121,
  gecyrillic: 0x0433,
  gehiragana: 0x3052,
  gekatakana: 0x30B2,
  geometricallyequal: 0x2251,
  gereshaccenthebrew: 0x059C,
  gereshhebrew: 0x05F3,
  gereshmuqdamhebrew: 0x059D,
  germandbls: 0x00DF,
  gershayimaccenthebrew: 0x059E,
  gershayimhebrew: 0x05F4,
  getamark: 0x3013,
  ghabengali: 0x0998,
  ghadarmenian: 0x0572,
  ghadeva: 0x0918,
  ghagujarati: 0x0A98,
  ghagurmukhi: 0x0A18,
  ghainarabic: 0x063A,
  ghainfinalarabic: 0xFECE,
  ghaininitialarabic: 0xFECF,
  ghainmedialarabic: 0xFED0,
  ghemiddlehookcyrillic: 0x0495,
  ghestrokecyrillic: 0x0493,
  gheupturncyrillic: 0x0491,
  ghhadeva: 0x095A,
  ghhagurmukhi: 0x0A5A,
  ghook: 0x0260,
  ghzsquare: 0x3393,
  gihiragana: 0x304E,
  gikatakana: 0x30AE,
  gimarmenian: 0x0563,
  gimel: 0x05D2,
  gimeldagesh: 0xFB32,
  gimeldageshhebrew: 0xFB32,
  gimelhebrew: 0x05D2,
  gjecyrillic: 0x0453,
  glottalinvertedstroke: 0x01BE,
  glottalstop: 0x0294,
  glottalstopinverted: 0x0296,
  glottalstopmod: 0x02C0,
  glottalstopreversed: 0x0295,
  glottalstopreversedmod: 0x02C1,
  glottalstopreversedsuperior: 0x02E4,
  glottalstopstroke: 0x02A1,
  glottalstopstrokereversed: 0x02A2,
  gmacron: 0x1E21,
  gmonospace: 0xFF47,
  gohiragana: 0x3054,
  gokatakana: 0x30B4,
  gparen: 0x24A2,
  gpasquare: 0x33AC,
  gradient: 0x2207,
  grave: 0x0060,
  gravebelowcmb: 0x0316,
  gravecmb: 0x0300,
  gravecomb: 0x0300,
  gravedeva: 0x0953,
  gravelowmod: 0x02CE,
  gravemonospace: 0xFF40,
  gravetonecmb: 0x0340,
  greater: 0x003E,
  greaterequal: 0x2265,
  greaterequalorless: 0x22DB,
  greatermonospace: 0xFF1E,
  greaterorequivalent: 0x2273,
  greaterorless: 0x2277,
  greateroverequal: 0x2267,
  greatersmall: 0xFE65,
  gscript: 0x0261,
  gstroke: 0x01E5,
  guhiragana: 0x3050,
  guillemotleft: 0x00AB,
  guillemotright: 0x00BB,
  guilsinglleft: 0x2039,
  guilsinglright: 0x203A,
  gukatakana: 0x30B0,
  guramusquare: 0x3318,
  gysquare: 0x33C9,
  h: 0x0068,
  haabkhasiancyrillic: 0x04A9,
  haaltonearabic: 0x06C1,
  habengali: 0x09B9,
  hadescendercyrillic: 0x04B3,
  hadeva: 0x0939,
  hagujarati: 0x0AB9,
  hagurmukhi: 0x0A39,
  haharabic: 0x062D,
  hahfinalarabic: 0xFEA2,
  hahinitialarabic: 0xFEA3,
  hahiragana: 0x306F,
  hahmedialarabic: 0xFEA4,
  haitusquare: 0x332A,
  hakatakana: 0x30CF,
  hakatakanahalfwidth: 0xFF8A,
  halantgurmukhi: 0x0A4D,
  hamzaarabic: 0x0621,
  hamzalowarabic: 0x0621,
  hangulfiller: 0x3164,
  hardsigncyrillic: 0x044A,
  harpoonleftbarbup: 0x21BC,
  harpoonrightbarbup: 0x21C0,
  hasquare: 0x33CA,
  hatafpatah: 0x05B2,
  hatafpatah16: 0x05B2,
  hatafpatah23: 0x05B2,
  hatafpatah2f: 0x05B2,
  hatafpatahhebrew: 0x05B2,
  hatafpatahnarrowhebrew: 0x05B2,
  hatafpatahquarterhebrew: 0x05B2,
  hatafpatahwidehebrew: 0x05B2,
  hatafqamats: 0x05B3,
  hatafqamats1b: 0x05B3,
  hatafqamats28: 0x05B3,
  hatafqamats34: 0x05B3,
  hatafqamatshebrew: 0x05B3,
  hatafqamatsnarrowhebrew: 0x05B3,
  hatafqamatsquarterhebrew: 0x05B3,
  hatafqamatswidehebrew: 0x05B3,
  hatafsegol: 0x05B1,
  hatafsegol17: 0x05B1,
  hatafsegol24: 0x05B1,
  hatafsegol30: 0x05B1,
  hatafsegolhebrew: 0x05B1,
  hatafsegolnarrowhebrew: 0x05B1,
  hatafsegolquarterhebrew: 0x05B1,
  hatafsegolwidehebrew: 0x05B1,
  hbar: 0x0127,
  hbopomofo: 0x310F,
  hbrevebelow: 0x1E2B,
  hcedilla: 0x1E29,
  hcircle: 0x24D7,
  hcircumflex: 0x0125,
  hdieresis: 0x1E27,
  hdotaccent: 0x1E23,
  hdotbelow: 0x1E25,
  he: 0x05D4,
  heart: 0x2665,
  heartsuitblack: 0x2665,
  heartsuitwhite: 0x2661,
  hedagesh: 0xFB34,
  hedageshhebrew: 0xFB34,
  hehaltonearabic: 0x06C1,
  heharabic: 0x0647,
  hehebrew: 0x05D4,
  hehfinalaltonearabic: 0xFBA7,
  hehfinalalttwoarabic: 0xFEEA,
  hehfinalarabic: 0xFEEA,
  hehhamzaabovefinalarabic: 0xFBA5,
  hehhamzaaboveisolatedarabic: 0xFBA4,
  hehinitialaltonearabic: 0xFBA8,
  hehinitialarabic: 0xFEEB,
  hehiragana: 0x3078,
  hehmedialaltonearabic: 0xFBA9,
  hehmedialarabic: 0xFEEC,
  heiseierasquare: 0x337B,
  hekatakana: 0x30D8,
  hekatakanahalfwidth: 0xFF8D,
  hekutaarusquare: 0x3336,
  henghook: 0x0267,
  herutusquare: 0x3339,
  het: 0x05D7,
  hethebrew: 0x05D7,
  hhook: 0x0266,
  hhooksuperior: 0x02B1,
  hieuhacirclekorean: 0x327B,
  hieuhaparenkorean: 0x321B,
  hieuhcirclekorean: 0x326D,
  hieuhkorean: 0x314E,
  hieuhparenkorean: 0x320D,
  hihiragana: 0x3072,
  hikatakana: 0x30D2,
  hikatakanahalfwidth: 0xFF8B,
  hiriq: 0x05B4,
  hiriq14: 0x05B4,
  hiriq21: 0x05B4,
  hiriq2d: 0x05B4,
  hiriqhebrew: 0x05B4,
  hiriqnarrowhebrew: 0x05B4,
  hiriqquarterhebrew: 0x05B4,
  hiriqwidehebrew: 0x05B4,
  hlinebelow: 0x1E96,
  hmonospace: 0xFF48,
  hoarmenian: 0x0570,
  hohipthai: 0x0E2B,
  hohiragana: 0x307B,
  hokatakana: 0x30DB,
  hokatakanahalfwidth: 0xFF8E,
  holam: 0x05B9,
  holam19: 0x05B9,
  holam26: 0x05B9,
  holam32: 0x05B9,
  holamhebrew: 0x05B9,
  holamnarrowhebrew: 0x05B9,
  holamquarterhebrew: 0x05B9,
  holamwidehebrew: 0x05B9,
  honokhukthai: 0x0E2E,
  hookabovecomb: 0x0309,
  hookcmb: 0x0309,
  hookpalatalizedbelowcmb: 0x0321,
  hookretroflexbelowcmb: 0x0322,
  hoonsquare: 0x3342,
  horicoptic: 0x03E9,
  horizontalbar: 0x2015,
  horncmb: 0x031B,
  hotsprings: 0x2668,
  house: 0x2302,
  hparen: 0x24A3,
  hsuperior: 0x02B0,
  hturned: 0x0265,
  huhiragana: 0x3075,
  huiitosquare: 0x3333,
  hukatakana: 0x30D5,
  hukatakanahalfwidth: 0xFF8C,
  hungarumlaut: 0x02DD,
  hungarumlautcmb: 0x030B,
  hv: 0x0195,
  hyphen: 0x002D,
  hypheninferior: 0xF6E5,
  hyphenmonospace: 0xFF0D,
  hyphensmall: 0xFE63,
  hyphensuperior: 0xF6E6,
  hyphentwo: 0x2010,
  i: 0x0069,
  iacute: 0x00ED,
  iacyrillic: 0x044F,
  ibengali: 0x0987,
  ibopomofo: 0x3127,
  ibreve: 0x012D,
  icaron: 0x01D0,
  icircle: 0x24D8,
  icircumflex: 0x00EE,
  icyrillic: 0x0456,
  idblgrave: 0x0209,
  ideographearthcircle: 0x328F,
  ideographfirecircle: 0x328B,
  ideographicallianceparen: 0x323F,
  ideographiccallparen: 0x323A,
  ideographiccentrecircle: 0x32A5,
  ideographicclose: 0x3006,
  ideographiccomma: 0x3001,
  ideographiccommaleft: 0xFF64,
  ideographiccongratulationparen: 0x3237,
  ideographiccorrectcircle: 0x32A3,
  ideographicearthparen: 0x322F,
  ideographicenterpriseparen: 0x323D,
  ideographicexcellentcircle: 0x329D,
  ideographicfestivalparen: 0x3240,
  ideographicfinancialcircle: 0x3296,
  ideographicfinancialparen: 0x3236,
  ideographicfireparen: 0x322B,
  ideographichaveparen: 0x3232,
  ideographichighcircle: 0x32A4,
  ideographiciterationmark: 0x3005,
  ideographiclaborcircle: 0x3298,
  ideographiclaborparen: 0x3238,
  ideographicleftcircle: 0x32A7,
  ideographiclowcircle: 0x32A6,
  ideographicmedicinecircle: 0x32A9,
  ideographicmetalparen: 0x322E,
  ideographicmoonparen: 0x322A,
  ideographicnameparen: 0x3234,
  ideographicperiod: 0x3002,
  ideographicprintcircle: 0x329E,
  ideographicreachparen: 0x3243,
  ideographicrepresentparen: 0x3239,
  ideographicresourceparen: 0x323E,
  ideographicrightcircle: 0x32A8,
  ideographicsecretcircle: 0x3299,
  ideographicselfparen: 0x3242,
  ideographicsocietyparen: 0x3233,
  ideographicspace: 0x3000,
  ideographicspecialparen: 0x3235,
  ideographicstockparen: 0x3231,
  ideographicstudyparen: 0x323B,
  ideographicsunparen: 0x3230,
  ideographicsuperviseparen: 0x323C,
  ideographicwaterparen: 0x322C,
  ideographicwoodparen: 0x322D,
  ideographiczero: 0x3007,
  ideographmetalcircle: 0x328E,
  ideographmooncircle: 0x328A,
  ideographnamecircle: 0x3294,
  ideographsuncircle: 0x3290,
  ideographwatercircle: 0x328C,
  ideographwoodcircle: 0x328D,
  ideva: 0x0907,
  idieresis: 0x00EF,
  idieresisacute: 0x1E2F,
  idieresiscyrillic: 0x04E5,
  idotbelow: 0x1ECB,
  iebrevecyrillic: 0x04D7,
  iecyrillic: 0x0435,
  ieungacirclekorean: 0x3275,
  ieungaparenkorean: 0x3215,
  ieungcirclekorean: 0x3267,
  ieungkorean: 0x3147,
  ieungparenkorean: 0x3207,
  igrave: 0x00EC,
  igujarati: 0x0A87,
  igurmukhi: 0x0A07,
  ihiragana: 0x3044,
  ihookabove: 0x1EC9,
  iibengali: 0x0988,
  iicyrillic: 0x0438,
  iideva: 0x0908,
  iigujarati: 0x0A88,
  iigurmukhi: 0x0A08,
  iimatragurmukhi: 0x0A40,
  iinvertedbreve: 0x020B,
  iishortcyrillic: 0x0439,
  iivowelsignbengali: 0x09C0,
  iivowelsigndeva: 0x0940,
  iivowelsigngujarati: 0x0AC0,
  ij: 0x0133,
  ikatakana: 0x30A4,
  ikatakanahalfwidth: 0xFF72,
  ikorean: 0x3163,
  ilde: 0x02DC,
  iluyhebrew: 0x05AC,
  imacron: 0x012B,
  imacroncyrillic: 0x04E3,
  imageorapproximatelyequal: 0x2253,
  imatragurmukhi: 0x0A3F,
  imonospace: 0xFF49,
  increment: 0x2206,
  infinity: 0x221E,
  iniarmenian: 0x056B,
  integral: 0x222B,
  integralbottom: 0x2321,
  integralbt: 0x2321,
  integralex: 0xF8F5,
  integraltop: 0x2320,
  integraltp: 0x2320,
  intersection: 0x2229,
  intisquare: 0x3305,
  invbullet: 0x25D8,
  invcircle: 0x25D9,
  invsmileface: 0x263B,
  iocyrillic: 0x0451,
  iogonek: 0x012F,
  iota: 0x03B9,
  iotadieresis: 0x03CA,
  iotadieresistonos: 0x0390,
  iotalatin: 0x0269,
  iotatonos: 0x03AF,
  iparen: 0x24A4,
  irigurmukhi: 0x0A72,
  ismallhiragana: 0x3043,
  ismallkatakana: 0x30A3,
  ismallkatakanahalfwidth: 0xFF68,
  issharbengali: 0x09FA,
  istroke: 0x0268,
  isuperior: 0xF6ED,
  iterationhiragana: 0x309D,
  iterationkatakana: 0x30FD,
  itilde: 0x0129,
  itildebelow: 0x1E2D,
  iubopomofo: 0x3129,
  iucyrillic: 0x044E,
  ivowelsignbengali: 0x09BF,
  ivowelsigndeva: 0x093F,
  ivowelsigngujarati: 0x0ABF,
  izhitsacyrillic: 0x0475,
  izhitsadblgravecyrillic: 0x0477,
  j: 0x006A,
  jaarmenian: 0x0571,
  jabengali: 0x099C,
  jadeva: 0x091C,
  jagujarati: 0x0A9C,
  jagurmukhi: 0x0A1C,
  jbopomofo: 0x3110,
  jcaron: 0x01F0,
  jcircle: 0x24D9,
  jcircumflex: 0x0135,
  jcrossedtail: 0x029D,
  jdotlessstroke: 0x025F,
  jecyrillic: 0x0458,
  jeemarabic: 0x062C,
  jeemfinalarabic: 0xFE9E,
  jeeminitialarabic: 0xFE9F,
  jeemmedialarabic: 0xFEA0,
  jeharabic: 0x0698,
  jehfinalarabic: 0xFB8B,
  jhabengali: 0x099D,
  jhadeva: 0x091D,
  jhagujarati: 0x0A9D,
  jhagurmukhi: 0x0A1D,
  jheharmenian: 0x057B,
  jis: 0x3004,
  jmonospace: 0xFF4A,
  jparen: 0x24A5,
  jsuperior: 0x02B2,
  k: 0x006B,
  kabashkircyrillic: 0x04A1,
  kabengali: 0x0995,
  kacute: 0x1E31,
  kacyrillic: 0x043A,
  kadescendercyrillic: 0x049B,
  kadeva: 0x0915,
  kaf: 0x05DB,
  kafarabic: 0x0643,
  kafdagesh: 0xFB3B,
  kafdageshhebrew: 0xFB3B,
  kaffinalarabic: 0xFEDA,
  kafhebrew: 0x05DB,
  kafinitialarabic: 0xFEDB,
  kafmedialarabic: 0xFEDC,
  kafrafehebrew: 0xFB4D,
  kagujarati: 0x0A95,
  kagurmukhi: 0x0A15,
  kahiragana: 0x304B,
  kahookcyrillic: 0x04C4,
  kakatakana: 0x30AB,
  kakatakanahalfwidth: 0xFF76,
  kappa: 0x03BA,
  kappasymbolgreek: 0x03F0,
  kapyeounmieumkorean: 0x3171,
  kapyeounphieuphkorean: 0x3184,
  kapyeounpieupkorean: 0x3178,
  kapyeounssangpieupkorean: 0x3179,
  karoriisquare: 0x330D,
  kashidaautoarabic: 0x0640,
  kashidaautonosidebearingarabic: 0x0640,
  kasmallkatakana: 0x30F5,
  kasquare: 0x3384,
  kasraarabic: 0x0650,
  kasratanarabic: 0x064D,
  kastrokecyrillic: 0x049F,
  katahiraprolongmarkhalfwidth: 0xFF70,
  kaverticalstrokecyrillic: 0x049D,
  kbopomofo: 0x310E,
  kcalsquare: 0x3389,
  kcaron: 0x01E9,
  kcedilla: 0x0137,
  kcircle: 0x24DA,
  kcommaaccent: 0x0137,
  kdotbelow: 0x1E33,
  keharmenian: 0x0584,
  kehiragana: 0x3051,
  kekatakana: 0x30B1,
  kekatakanahalfwidth: 0xFF79,
  kenarmenian: 0x056F,
  kesmallkatakana: 0x30F6,
  kgreenlandic: 0x0138,
  khabengali: 0x0996,
  khacyrillic: 0x0445,
  khadeva: 0x0916,
  khagujarati: 0x0A96,
  khagurmukhi: 0x0A16,
  khaharabic: 0x062E,
  khahfinalarabic: 0xFEA6,
  khahinitialarabic: 0xFEA7,
  khahmedialarabic: 0xFEA8,
  kheicoptic: 0x03E7,
  khhadeva: 0x0959,
  khhagurmukhi: 0x0A59,
  khieukhacirclekorean: 0x3278,
  khieukhaparenkorean: 0x3218,
  khieukhcirclekorean: 0x326A,
  khieukhkorean: 0x314B,
  khieukhparenkorean: 0x320A,
  khokhaithai: 0x0E02,
  khokhonthai: 0x0E05,
  khokhuatthai: 0x0E03,
  khokhwaithai: 0x0E04,
  khomutthai: 0x0E5B,
  khook: 0x0199,
  khorakhangthai: 0x0E06,
  khzsquare: 0x3391,
  kihiragana: 0x304D,
  kikatakana: 0x30AD,
  kikatakanahalfwidth: 0xFF77,
  kiroguramusquare: 0x3315,
  kiromeetorusquare: 0x3316,
  kirosquare: 0x3314,
  kiyeokacirclekorean: 0x326E,
  kiyeokaparenkorean: 0x320E,
  kiyeokcirclekorean: 0x3260,
  kiyeokkorean: 0x3131,
  kiyeokparenkorean: 0x3200,
  kiyeoksioskorean: 0x3133,
  kjecyrillic: 0x045C,
  klinebelow: 0x1E35,
  klsquare: 0x3398,
  kmcubedsquare: 0x33A6,
  kmonospace: 0xFF4B,
  kmsquaredsquare: 0x33A2,
  kohiragana: 0x3053,
  kohmsquare: 0x33C0,
  kokaithai: 0x0E01,
  kokatakana: 0x30B3,
  kokatakanahalfwidth: 0xFF7A,
  kooposquare: 0x331E,
  koppacyrillic: 0x0481,
  koreanstandardsymbol: 0x327F,
  koroniscmb: 0x0343,
  kparen: 0x24A6,
  kpasquare: 0x33AA,
  ksicyrillic: 0x046F,
  ktsquare: 0x33CF,
  kturned: 0x029E,
  kuhiragana: 0x304F,
  kukatakana: 0x30AF,
  kukatakanahalfwidth: 0xFF78,
  kvsquare: 0x33B8,
  kwsquare: 0x33BE,
  l: 0x006C,
  labengali: 0x09B2,
  lacute: 0x013A,
  ladeva: 0x0932,
  lagujarati: 0x0AB2,
  lagurmukhi: 0x0A32,
  lakkhangyaothai: 0x0E45,
  lamaleffinalarabic: 0xFEFC,
  lamalefhamzaabovefinalarabic: 0xFEF8,
  lamalefhamzaaboveisolatedarabic: 0xFEF7,
  lamalefhamzabelowfinalarabic: 0xFEFA,
  lamalefhamzabelowisolatedarabic: 0xFEF9,
  lamalefisolatedarabic: 0xFEFB,
  lamalefmaddaabovefinalarabic: 0xFEF6,
  lamalefmaddaaboveisolatedarabic: 0xFEF5,
  lamarabic: 0x0644,
  lambda: 0x03BB,
  lambdastroke: 0x019B,
  lamed: 0x05DC,
  lameddagesh: 0xFB3C,
  lameddageshhebrew: 0xFB3C,
  lamedhebrew: 0x05DC,
  lamfinalarabic: 0xFEDE,
  lamhahinitialarabic: 0xFCCA,
  laminitialarabic: 0xFEDF,
  lamjeeminitialarabic: 0xFCC9,
  lamkhahinitialarabic: 0xFCCB,
  lamlamhehisolatedarabic: 0xFDF2,
  lammedialarabic: 0xFEE0,
  lammeemhahinitialarabic: 0xFD88,
  lammeeminitialarabic: 0xFCCC,
  largecircle: 0x25EF,
  lbar: 0x019A,
  lbelt: 0x026C,
  lbopomofo: 0x310C,
  lcaron: 0x013E,
  lcedilla: 0x013C,
  lcircle: 0x24DB,
  lcircumflexbelow: 0x1E3D,
  lcommaaccent: 0x013C,
  ldot: 0x0140,
  ldotaccent: 0x0140,
  ldotbelow: 0x1E37,
  ldotbelowmacron: 0x1E39,
  leftangleabovecmb: 0x031A,
  lefttackbelowcmb: 0x0318,
  less: 0x003C,
  lessequal: 0x2264,
  lessequalorgreater: 0x22DA,
  lessmonospace: 0xFF1C,
  lessorequivalent: 0x2272,
  lessorgreater: 0x2276,
  lessoverequal: 0x2266,
  lesssmall: 0xFE64,
  lezh: 0x026E,
  lfblock: 0x258C,
  lhookretroflex: 0x026D,
  lira: 0x20A4,
  liwnarmenian: 0x056C,
  lj: 0x01C9,
  ljecyrillic: 0x0459,
  ll: 0xF6C0,
  lladeva: 0x0933,
  llagujarati: 0x0AB3,
  llinebelow: 0x1E3B,
  llladeva: 0x0934,
  llvocalicbengali: 0x09E1,
  llvocalicdeva: 0x0961,
  llvocalicvowelsignbengali: 0x09E3,
  llvocalicvowelsigndeva: 0x0963,
  lmiddletilde: 0x026B,
  lmonospace: 0xFF4C,
  lmsquare: 0x33D0,
  lochulathai: 0x0E2C,
  logicaland: 0x2227,
  logicalnot: 0x00AC,
  logicalnotreversed: 0x2310,
  logicalor: 0x2228,
  lolingthai: 0x0E25,
  longs: 0x017F,
  lowlinecenterline: 0xFE4E,
  lowlinecmb: 0x0332,
  lowlinedashed: 0xFE4D,
  lozenge: 0x25CA,
  lparen: 0x24A7,
  lslash: 0x0142,
  lsquare: 0x2113,
  lsuperior: 0xF6EE,
  ltshade: 0x2591,
  luthai: 0x0E26,
  lvocalicbengali: 0x098C,
  lvocalicdeva: 0x090C,
  lvocalicvowelsignbengali: 0x09E2,
  lvocalicvowelsigndeva: 0x0962,
  lxsquare: 0x33D3,
  m: 0x006D,
  mabengali: 0x09AE,
  macron: 0x00AF,
  macronbelowcmb: 0x0331,
  macroncmb: 0x0304,
  macronlowmod: 0x02CD,
  macronmonospace: 0xFFE3,
  macute: 0x1E3F,
  madeva: 0x092E,
  magujarati: 0x0AAE,
  magurmukhi: 0x0A2E,
  mahapakhhebrew: 0x05A4,
  mahapakhlefthebrew: 0x05A4,
  mahiragana: 0x307E,
  maichattawalowleftthai: 0xF895,
  maichattawalowrightthai: 0xF894,
  maichattawathai: 0x0E4B,
  maichattawaupperleftthai: 0xF893,
  maieklowleftthai: 0xF88C,
  maieklowrightthai: 0xF88B,
  maiekthai: 0x0E48,
  maiekupperleftthai: 0xF88A,
  maihanakatleftthai: 0xF884,
  maihanakatthai: 0x0E31,
  maitaikhuleftthai: 0xF889,
  maitaikhuthai: 0x0E47,
  maitholowleftthai: 0xF88F,
  maitholowrightthai: 0xF88E,
  maithothai: 0x0E49,
  maithoupperleftthai: 0xF88D,
  maitrilowleftthai: 0xF892,
  maitrilowrightthai: 0xF891,
  maitrithai: 0x0E4A,
  maitriupperleftthai: 0xF890,
  maiyamokthai: 0x0E46,
  makatakana: 0x30DE,
  makatakanahalfwidth: 0xFF8F,
  male: 0x2642,
  mansyonsquare: 0x3347,
  maqafhebrew: 0x05BE,
  mars: 0x2642,
  masoracirclehebrew: 0x05AF,
  masquare: 0x3383,
  mbopomofo: 0x3107,
  mbsquare: 0x33D4,
  mcircle: 0x24DC,
  mcubedsquare: 0x33A5,
  mdotaccent: 0x1E41,
  mdotbelow: 0x1E43,
  meemarabic: 0x0645,
  meemfinalarabic: 0xFEE2,
  meeminitialarabic: 0xFEE3,
  meemmedialarabic: 0xFEE4,
  meemmeeminitialarabic: 0xFCD1,
  meemmeemisolatedarabic: 0xFC48,
  meetorusquare: 0x334D,
  mehiragana: 0x3081,
  meizierasquare: 0x337E,
  mekatakana: 0x30E1,
  mekatakanahalfwidth: 0xFF92,
  mem: 0x05DE,
  memdagesh: 0xFB3E,
  memdageshhebrew: 0xFB3E,
  memhebrew: 0x05DE,
  menarmenian: 0x0574,
  merkhahebrew: 0x05A5,
  merkhakefulahebrew: 0x05A6,
  merkhakefulalefthebrew: 0x05A6,
  merkhalefthebrew: 0x05A5,
  mhook: 0x0271,
  mhzsquare: 0x3392,
  middledotkatakanahalfwidth: 0xFF65,
  middot: 0x00B7,
  mieumacirclekorean: 0x3272,
  mieumaparenkorean: 0x3212,
  mieumcirclekorean: 0x3264,
  mieumkorean: 0x3141,
  mieumpansioskorean: 0x3170,
  mieumparenkorean: 0x3204,
  mieumpieupkorean: 0x316E,
  mieumsioskorean: 0x316F,
  mihiragana: 0x307F,
  mikatakana: 0x30DF,
  mikatakanahalfwidth: 0xFF90,
  minus: 0x2212,
  minusbelowcmb: 0x0320,
  minuscircle: 0x2296,
  minusmod: 0x02D7,
  minusplus: 0x2213,
  minute: 0x2032,
  miribaarusquare: 0x334A,
  mirisquare: 0x3349,
  mlonglegturned: 0x0270,
  mlsquare: 0x3396,
  mmcubedsquare: 0x33A3,
  mmonospace: 0xFF4D,
  mmsquaredsquare: 0x339F,
  mohiragana: 0x3082,
  mohmsquare: 0x33C1,
  mokatakana: 0x30E2,
  mokatakanahalfwidth: 0xFF93,
  molsquare: 0x33D6,
  momathai: 0x0E21,
  moverssquare: 0x33A7,
  moverssquaredsquare: 0x33A8,
  mparen: 0x24A8,
  mpasquare: 0x33AB,
  mssquare: 0x33B3,
  msuperior: 0xF6EF,
  mturned: 0x026F,
  mu: 0x00B5,
  mu1: 0x00B5,
  muasquare: 0x3382,
  muchgreater: 0x226B,
  muchless: 0x226A,
  mufsquare: 0x338C,
  mugreek: 0x03BC,
  mugsquare: 0x338D,
  muhiragana: 0x3080,
  mukatakana: 0x30E0,
  mukatakanahalfwidth: 0xFF91,
  mulsquare: 0x3395,
  multiply: 0x00D7,
  mumsquare: 0x339B,
  munahhebrew: 0x05A3,
  munahlefthebrew: 0x05A3,
  musicalnote: 0x266A,
  musicalnotedbl: 0x266B,
  musicflatsign: 0x266D,
  musicsharpsign: 0x266F,
  mussquare: 0x33B2,
  muvsquare: 0x33B6,
  muwsquare: 0x33BC,
  mvmegasquare: 0x33B9,
  mvsquare: 0x33B7,
  mwmegasquare: 0x33BF,
  mwsquare: 0x33BD,
  n: 0x006E,
  nabengali: 0x09A8,
  nabla: 0x2207,
  nacute: 0x0144,
  nadeva: 0x0928,
  nagujarati: 0x0AA8,
  nagurmukhi: 0x0A28,
  nahiragana: 0x306A,
  nakatakana: 0x30CA,
  nakatakanahalfwidth: 0xFF85,
  napostrophe: 0x0149,
  nasquare: 0x3381,
  nbopomofo: 0x310B,
  nbspace: 0x00A0,
  ncaron: 0x0148,
  ncedilla: 0x0146,
  ncircle: 0x24DD,
  ncircumflexbelow: 0x1E4B,
  ncommaaccent: 0x0146,
  ndotaccent: 0x1E45,
  ndotbelow: 0x1E47,
  nehiragana: 0x306D,
  nekatakana: 0x30CD,
  nekatakanahalfwidth: 0xFF88,
  newsheqelsign: 0x20AA,
  nfsquare: 0x338B,
  ngabengali: 0x0999,
  ngadeva: 0x0919,
  ngagujarati: 0x0A99,
  ngagurmukhi: 0x0A19,
  ngonguthai: 0x0E07,
  nhiragana: 0x3093,
  nhookleft: 0x0272,
  nhookretroflex: 0x0273,
  nieunacirclekorean: 0x326F,
  nieunaparenkorean: 0x320F,
  nieuncieuckorean: 0x3135,
  nieuncirclekorean: 0x3261,
  nieunhieuhkorean: 0x3136,
  nieunkorean: 0x3134,
  nieunpansioskorean: 0x3168,
  nieunparenkorean: 0x3201,
  nieunsioskorean: 0x3167,
  nieuntikeutkorean: 0x3166,
  nihiragana: 0x306B,
  nikatakana: 0x30CB,
  nikatakanahalfwidth: 0xFF86,
  nikhahitleftthai: 0xF899,
  nikhahitthai: 0x0E4D,
  nine: 0x0039,
  ninearabic: 0x0669,
  ninebengali: 0x09EF,
  ninecircle: 0x2468,
  ninecircleinversesansserif: 0x2792,
  ninedeva: 0x096F,
  ninegujarati: 0x0AEF,
  ninegurmukhi: 0x0A6F,
  ninehackarabic: 0x0669,
  ninehangzhou: 0x3029,
  nineideographicparen: 0x3228,
  nineinferior: 0x2089,
  ninemonospace: 0xFF19,
  nineoldstyle: 0xF739,
  nineparen: 0x247C,
  nineperiod: 0x2490,
  ninepersian: 0x06F9,
  nineroman: 0x2178,
  ninesuperior: 0x2079,
  nineteencircle: 0x2472,
  nineteenparen: 0x2486,
  nineteenperiod: 0x249A,
  ninethai: 0x0E59,
  nj: 0x01CC,
  njecyrillic: 0x045A,
  nkatakana: 0x30F3,
  nkatakanahalfwidth: 0xFF9D,
  nlegrightlong: 0x019E,
  nlinebelow: 0x1E49,
  nmonospace: 0xFF4E,
  nmsquare: 0x339A,
  nnabengali: 0x09A3,
  nnadeva: 0x0923,
  nnagujarati: 0x0AA3,
  nnagurmukhi: 0x0A23,
  nnnadeva: 0x0929,
  nohiragana: 0x306E,
  nokatakana: 0x30CE,
  nokatakanahalfwidth: 0xFF89,
  nonbreakingspace: 0x00A0,
  nonenthai: 0x0E13,
  nonuthai: 0x0E19,
  noonarabic: 0x0646,
  noonfinalarabic: 0xFEE6,
  noonghunnaarabic: 0x06BA,
  noonghunnafinalarabic: 0xFB9F,
  nooninitialarabic: 0xFEE7,
  noonjeeminitialarabic: 0xFCD2,
  noonjeemisolatedarabic: 0xFC4B,
  noonmedialarabic: 0xFEE8,
  noonmeeminitialarabic: 0xFCD5,
  noonmeemisolatedarabic: 0xFC4E,
  noonnoonfinalarabic: 0xFC8D,
  notcontains: 0x220C,
  notelement: 0x2209,
  notelementof: 0x2209,
  notequal: 0x2260,
  notgreater: 0x226F,
  notgreaternorequal: 0x2271,
  notgreaternorless: 0x2279,
  notidentical: 0x2262,
  notless: 0x226E,
  notlessnorequal: 0x2270,
  notparallel: 0x2226,
  notprecedes: 0x2280,
  notsubset: 0x2284,
  notsucceeds: 0x2281,
  notsuperset: 0x2285,
  nowarmenian: 0x0576,
  nparen: 0x24A9,
  nssquare: 0x33B1,
  nsuperior: 0x207F,
  ntilde: 0x00F1,
  nu: 0x03BD,
  nuhiragana: 0x306C,
  nukatakana: 0x30CC,
  nukatakanahalfwidth: 0xFF87,
  nuktabengali: 0x09BC,
  nuktadeva: 0x093C,
  nuktagujarati: 0x0ABC,
  nuktagurmukhi: 0x0A3C,
  numbersign: 0x0023,
  numbersignmonospace: 0xFF03,
  numbersignsmall: 0xFE5F,
  numeralsigngreek: 0x0374,
  numeralsignlowergreek: 0x0375,
  numero: 0x2116,
  nun: 0x05E0,
  nundagesh: 0xFB40,
  nundageshhebrew: 0xFB40,
  nunhebrew: 0x05E0,
  nvsquare: 0x33B5,
  nwsquare: 0x33BB,
  nyabengali: 0x099E,
  nyadeva: 0x091E,
  nyagujarati: 0x0A9E,
  nyagurmukhi: 0x0A1E,
  o: 0x006F,
  oacute: 0x00F3,
  oangthai: 0x0E2D,
  obarred: 0x0275,
  obarredcyrillic: 0x04E9,
  obarreddieresiscyrillic: 0x04EB,
  obengali: 0x0993,
  obopomofo: 0x311B,
  obreve: 0x014F,
  ocandradeva: 0x0911,
  ocandragujarati: 0x0A91,
  ocandravowelsigndeva: 0x0949,
  ocandravowelsigngujarati: 0x0AC9,
  ocaron: 0x01D2,
  ocircle: 0x24DE,
  ocircumflex: 0x00F4,
  ocircumflexacute: 0x1ED1,
  ocircumflexdotbelow: 0x1ED9,
  ocircumflexgrave: 0x1ED3,
  ocircumflexhookabove: 0x1ED5,
  ocircumflextilde: 0x1ED7,
  ocyrillic: 0x043E,
  odblacute: 0x0151,
  odblgrave: 0x020D,
  odeva: 0x0913,
  odieresis: 0x00F6,
  odieresiscyrillic: 0x04E7,
  odotbelow: 0x1ECD,
  oe: 0x0153,
  oekorean: 0x315A,
  ogonek: 0x02DB,
  ogonekcmb: 0x0328,
  ograve: 0x00F2,
  ogujarati: 0x0A93,
  oharmenian: 0x0585,
  ohiragana: 0x304A,
  ohookabove: 0x1ECF,
  ohorn: 0x01A1,
  ohornacute: 0x1EDB,
  ohorndotbelow: 0x1EE3,
  ohorngrave: 0x1EDD,
  ohornhookabove: 0x1EDF,
  ohorntilde: 0x1EE1,
  ohungarumlaut: 0x0151,
  oi: 0x01A3,
  oinvertedbreve: 0x020F,
  okatakana: 0x30AA,
  okatakanahalfwidth: 0xFF75,
  okorean: 0x3157,
  olehebrew: 0x05AB,
  omacron: 0x014D,
  omacronacute: 0x1E53,
  omacrongrave: 0x1E51,
  omdeva: 0x0950,
  omega: 0x03C9,
  omega1: 0x03D6,
  omegacyrillic: 0x0461,
  omegalatinclosed: 0x0277,
  omegaroundcyrillic: 0x047B,
  omegatitlocyrillic: 0x047D,
  omegatonos: 0x03CE,
  omgujarati: 0x0AD0,
  omicron: 0x03BF,
  omicrontonos: 0x03CC,
  omonospace: 0xFF4F,
  one: 0x0031,
  onearabic: 0x0661,
  onebengali: 0x09E7,
  onecircle: 0x2460,
  onecircleinversesansserif: 0x278A,
  onedeva: 0x0967,
  onedotenleader: 0x2024,
  oneeighth: 0x215B,
  onefitted: 0xF6DC,
  onegujarati: 0x0AE7,
  onegurmukhi: 0x0A67,
  onehackarabic: 0x0661,
  onehalf: 0x00BD,
  onehangzhou: 0x3021,
  oneideographicparen: 0x3220,
  oneinferior: 0x2081,
  onemonospace: 0xFF11,
  onenumeratorbengali: 0x09F4,
  oneoldstyle: 0xF731,
  oneparen: 0x2474,
  oneperiod: 0x2488,
  onepersian: 0x06F1,
  onequarter: 0x00BC,
  oneroman: 0x2170,
  onesuperior: 0x00B9,
  onethai: 0x0E51,
  onethird: 0x2153,
  oogonek: 0x01EB,
  oogonekmacron: 0x01ED,
  oogurmukhi: 0x0A13,
  oomatragurmukhi: 0x0A4B,
  oopen: 0x0254,
  oparen: 0x24AA,
  openbullet: 0x25E6,
  option: 0x2325,
  ordfeminine: 0x00AA,
  ordmasculine: 0x00BA,
  orthogonal: 0x221F,
  oshortdeva: 0x0912,
  oshortvowelsigndeva: 0x094A,
  oslash: 0x00F8,
  oslashacute: 0x01FF,
  osmallhiragana: 0x3049,
  osmallkatakana: 0x30A9,
  osmallkatakanahalfwidth: 0xFF6B,
  ostrokeacute: 0x01FF,
  osuperior: 0xF6F0,
  otcyrillic: 0x047F,
  otilde: 0x00F5,
  otildeacute: 0x1E4D,
  otildedieresis: 0x1E4F,
  oubopomofo: 0x3121,
  overline: 0x203E,
  overlinecenterline: 0xFE4A,
  overlinecmb: 0x0305,
  overlinedashed: 0xFE49,
  overlinedblwavy: 0xFE4C,
  overlinewavy: 0xFE4B,
  overscore: 0x00AF,
  ovowelsignbengali: 0x09CB,
  ovowelsigndeva: 0x094B,
  ovowelsigngujarati: 0x0ACB,
  p: 0x0070,
  paampssquare: 0x3380,
  paasentosquare: 0x332B,
  pabengali: 0x09AA,
  pacute: 0x1E55,
  padeva: 0x092A,
  pagedown: 0x21DF,
  pageup: 0x21DE,
  pagujarati: 0x0AAA,
  pagurmukhi: 0x0A2A,
  pahiragana: 0x3071,
  paiyannoithai: 0x0E2F,
  pakatakana: 0x30D1,
  palatalizationcyrilliccmb: 0x0484,
  palochkacyrillic: 0x04C0,
  pansioskorean: 0x317F,
  paragraph: 0x00B6,
  parallel: 0x2225,
  parenleft: 0x0028,
  parenleftaltonearabic: 0xFD3E,
  parenleftbt: 0xF8ED,
  parenleftex: 0xF8EC,
  parenleftinferior: 0x208D,
  parenleftmonospace: 0xFF08,
  parenleftsmall: 0xFE59,
  parenleftsuperior: 0x207D,
  parenlefttp: 0xF8EB,
  parenleftvertical: 0xFE35,
  parenright: 0x0029,
  parenrightaltonearabic: 0xFD3F,
  parenrightbt: 0xF8F8,
  parenrightex: 0xF8F7,
  parenrightinferior: 0x208E,
  parenrightmonospace: 0xFF09,
  parenrightsmall: 0xFE5A,
  parenrightsuperior: 0x207E,
  parenrighttp: 0xF8F6,
  parenrightvertical: 0xFE36,
  partialdiff: 0x2202,
  paseqhebrew: 0x05C0,
  pashtahebrew: 0x0599,
  pasquare: 0x33A9,
  patah: 0x05B7,
  patah11: 0x05B7,
  patah1d: 0x05B7,
  patah2a: 0x05B7,
  patahhebrew: 0x05B7,
  patahnarrowhebrew: 0x05B7,
  patahquarterhebrew: 0x05B7,
  patahwidehebrew: 0x05B7,
  pazerhebrew: 0x05A1,
  pbopomofo: 0x3106,
  pcircle: 0x24DF,
  pdotaccent: 0x1E57,
  pe: 0x05E4,
  pecyrillic: 0x043F,
  pedagesh: 0xFB44,
  pedageshhebrew: 0xFB44,
  peezisquare: 0x333B,
  pefinaldageshhebrew: 0xFB43,
  peharabic: 0x067E,
  peharmenian: 0x057A,
  pehebrew: 0x05E4,
  pehfinalarabic: 0xFB57,
  pehinitialarabic: 0xFB58,
  pehiragana: 0x307A,
  pehmedialarabic: 0xFB59,
  pekatakana: 0x30DA,
  pemiddlehookcyrillic: 0x04A7,
  perafehebrew: 0xFB4E,
  percent: 0x0025,
  percentarabic: 0x066A,
  percentmonospace: 0xFF05,
  percentsmall: 0xFE6A,
  period: 0x002E,
  periodarmenian: 0x0589,
  periodcentered: 0x00B7,
  periodhalfwidth: 0xFF61,
  periodinferior: 0xF6E7,
  periodmonospace: 0xFF0E,
  periodsmall: 0xFE52,
  periodsuperior: 0xF6E8,
  perispomenigreekcmb: 0x0342,
  perpendicular: 0x22A5,
  perthousand: 0x2030,
  peseta: 0x20A7,
  pfsquare: 0x338A,
  phabengali: 0x09AB,
  phadeva: 0x092B,
  phagujarati: 0x0AAB,
  phagurmukhi: 0x0A2B,
  phi: 0x03C6,
  phi1: 0x03D5,
  phieuphacirclekorean: 0x327A,
  phieuphaparenkorean: 0x321A,
  phieuphcirclekorean: 0x326C,
  phieuphkorean: 0x314D,
  phieuphparenkorean: 0x320C,
  philatin: 0x0278,
  phinthuthai: 0x0E3A,
  phisymbolgreek: 0x03D5,
  phook: 0x01A5,
  phophanthai: 0x0E1E,
  phophungthai: 0x0E1C,
  phosamphaothai: 0x0E20,
  pi: 0x03C0,
  pieupacirclekorean: 0x3273,
  pieupaparenkorean: 0x3213,
  pieupcieuckorean: 0x3176,
  pieupcirclekorean: 0x3265,
  pieupkiyeokkorean: 0x3172,
  pieupkorean: 0x3142,
  pieupparenkorean: 0x3205,
  pieupsioskiyeokkorean: 0x3174,
  pieupsioskorean: 0x3144,
  pieupsiostikeutkorean: 0x3175,
  pieupthieuthkorean: 0x3177,
  pieuptikeutkorean: 0x3173,
  pihiragana: 0x3074,
  pikatakana: 0x30D4,
  pisymbolgreek: 0x03D6,
  piwrarmenian: 0x0583,
  plus: 0x002B,
  plusbelowcmb: 0x031F,
  pluscircle: 0x2295,
  plusminus: 0x00B1,
  plusmod: 0x02D6,
  plusmonospace: 0xFF0B,
  plussmall: 0xFE62,
  plussuperior: 0x207A,
  pmonospace: 0xFF50,
  pmsquare: 0x33D8,
  pohiragana: 0x307D,
  pointingindexdownwhite: 0x261F,
  pointingindexleftwhite: 0x261C,
  pointingindexrightwhite: 0x261E,
  pointingindexupwhite: 0x261D,
  pokatakana: 0x30DD,
  poplathai: 0x0E1B,
  postalmark: 0x3012,
  postalmarkface: 0x3020,
  pparen: 0x24AB,
  precedes: 0x227A,
  prescription: 0x211E,
  primemod: 0x02B9,
  primereversed: 0x2035,
  product: 0x220F,
  projective: 0x2305,
  prolongedkana: 0x30FC,
  propellor: 0x2318,
  propersubset: 0x2282,
  propersuperset: 0x2283,
  proportion: 0x2237,
  proportional: 0x221D,
  psi: 0x03C8,
  psicyrillic: 0x0471,
  psilipneumatacyrilliccmb: 0x0486,
  pssquare: 0x33B0,
  puhiragana: 0x3077,
  pukatakana: 0x30D7,
  pvsquare: 0x33B4,
  pwsquare: 0x33BA,
  q: 0x0071,
  qadeva: 0x0958,
  qadmahebrew: 0x05A8,
  qafarabic: 0x0642,
  qaffinalarabic: 0xFED6,
  qafinitialarabic: 0xFED7,
  qafmedialarabic: 0xFED8,
  qamats: 0x05B8,
  qamats10: 0x05B8,
  qamats1a: 0x05B8,
  qamats1c: 0x05B8,
  qamats27: 0x05B8,
  qamats29: 0x05B8,
  qamats33: 0x05B8,
  qamatsde: 0x05B8,
  qamatshebrew: 0x05B8,
  qamatsnarrowhebrew: 0x05B8,
  qamatsqatanhebrew: 0x05B8,
  qamatsqatannarrowhebrew: 0x05B8,
  qamatsqatanquarterhebrew: 0x05B8,
  qamatsqatanwidehebrew: 0x05B8,
  qamatsquarterhebrew: 0x05B8,
  qamatswidehebrew: 0x05B8,
  qarneyparahebrew: 0x059F,
  qbopomofo: 0x3111,
  qcircle: 0x24E0,
  qhook: 0x02A0,
  qmonospace: 0xFF51,
  qof: 0x05E7,
  qofdagesh: 0xFB47,
  qofdageshhebrew: 0xFB47,
  qofhebrew: 0x05E7,
  qparen: 0x24AC,
  quarternote: 0x2669,
  qubuts: 0x05BB,
  qubuts18: 0x05BB,
  qubuts25: 0x05BB,
  qubuts31: 0x05BB,
  qubutshebrew: 0x05BB,
  qubutsnarrowhebrew: 0x05BB,
  qubutsquarterhebrew: 0x05BB,
  qubutswidehebrew: 0x05BB,
  question: 0x003F,
  questionarabic: 0x061F,
  questionarmenian: 0x055E,
  questiondown: 0x00BF,
  questiondownsmall: 0xF7BF,
  questiongreek: 0x037E,
  questionmonospace: 0xFF1F,
  questionsmall: 0xF73F,
  quotedbl: 0x0022,
  quotedblbase: 0x201E,
  quotedblleft: 0x201C,
  quotedblmonospace: 0xFF02,
  quotedblprime: 0x301E,
  quotedblprimereversed: 0x301D,
  quotedblright: 0x201D,
  quoteleft: 0x2018,
  quoteleftreversed: 0x201B,
  quotereversed: 0x201B,
  quoteright: 0x2019,
  quoterightn: 0x0149,
  quotesinglbase: 0x201A,
  quotesingle: 0x0027,
  quotesinglemonospace: 0xFF07,
  r: 0x0072,
  raarmenian: 0x057C,
  rabengali: 0x09B0,
  racute: 0x0155,
  radeva: 0x0930,
  radical: 0x221A,
  radicalex: 0xF8E5,
  radoverssquare: 0x33AE,
  radoverssquaredsquare: 0x33AF,
  radsquare: 0x33AD,
  rafe: 0x05BF,
  rafehebrew: 0x05BF,
  ragujarati: 0x0AB0,
  ragurmukhi: 0x0A30,
  rahiragana: 0x3089,
  rakatakana: 0x30E9,
  rakatakanahalfwidth: 0xFF97,
  ralowerdiagonalbengali: 0x09F1,
  ramiddlediagonalbengali: 0x09F0,
  ramshorn: 0x0264,
  ratio: 0x2236,
  rbopomofo: 0x3116,
  rcaron: 0x0159,
  rcedilla: 0x0157,
  rcircle: 0x24E1,
  rcommaaccent: 0x0157,
  rdblgrave: 0x0211,
  rdotaccent: 0x1E59,
  rdotbelow: 0x1E5B,
  rdotbelowmacron: 0x1E5D,
  referencemark: 0x203B,
  reflexsubset: 0x2286,
  reflexsuperset: 0x2287,
  registered: 0x00AE,
  registersans: 0xF8E8,
  registerserif: 0xF6DA,
  reharabic: 0x0631,
  reharmenian: 0x0580,
  rehfinalarabic: 0xFEAE,
  rehiragana: 0x308C,
  rekatakana: 0x30EC,
  rekatakanahalfwidth: 0xFF9A,
  resh: 0x05E8,
  reshdageshhebrew: 0xFB48,
  reshhebrew: 0x05E8,
  reversedtilde: 0x223D,
  reviahebrew: 0x0597,
  reviamugrashhebrew: 0x0597,
  revlogicalnot: 0x2310,
  rfishhook: 0x027E,
  rfishhookreversed: 0x027F,
  rhabengali: 0x09DD,
  rhadeva: 0x095D,
  rho: 0x03C1,
  rhook: 0x027D,
  rhookturned: 0x027B,
  rhookturnedsuperior: 0x02B5,
  rhosymbolgreek: 0x03F1,
  rhotichookmod: 0x02DE,
  rieulacirclekorean: 0x3271,
  rieulaparenkorean: 0x3211,
  rieulcirclekorean: 0x3263,
  rieulhieuhkorean: 0x3140,
  rieulkiyeokkorean: 0x313A,
  rieulkiyeoksioskorean: 0x3169,
  rieulkorean: 0x3139,
  rieulmieumkorean: 0x313B,
  rieulpansioskorean: 0x316C,
  rieulparenkorean: 0x3203,
  rieulphieuphkorean: 0x313F,
  rieulpieupkorean: 0x313C,
  rieulpieupsioskorean: 0x316B,
  rieulsioskorean: 0x313D,
  rieulthieuthkorean: 0x313E,
  rieultikeutkorean: 0x316A,
  rieulyeorinhieuhkorean: 0x316D,
  rightangle: 0x221F,
  righttackbelowcmb: 0x0319,
  righttriangle: 0x22BF,
  rihiragana: 0x308A,
  rikatakana: 0x30EA,
  rikatakanahalfwidth: 0xFF98,
  ring: 0x02DA,
  ringbelowcmb: 0x0325,
  ringcmb: 0x030A,
  ringhalfleft: 0x02BF,
  ringhalfleftarmenian: 0x0559,
  ringhalfleftbelowcmb: 0x031C,
  ringhalfleftcentered: 0x02D3,
  ringhalfright: 0x02BE,
  ringhalfrightbelowcmb: 0x0339,
  ringhalfrightcentered: 0x02D2,
  rinvertedbreve: 0x0213,
  rittorusquare: 0x3351,
  rlinebelow: 0x1E5F,
  rlongleg: 0x027C,
  rlonglegturned: 0x027A,
  rmonospace: 0xFF52,
  rohiragana: 0x308D,
  rokatakana: 0x30ED,
  rokatakanahalfwidth: 0xFF9B,
  roruathai: 0x0E23,
  rparen: 0x24AD,
  rrabengali: 0x09DC,
  rradeva: 0x0931,
  rragurmukhi: 0x0A5C,
  rreharabic: 0x0691,
  rrehfinalarabic: 0xFB8D,
  rrvocalicbengali: 0x09E0,
  rrvocalicdeva: 0x0960,
  rrvocalicgujarati: 0x0AE0,
  rrvocalicvowelsignbengali: 0x09C4,
  rrvocalicvowelsigndeva: 0x0944,
  rrvocalicvowelsigngujarati: 0x0AC4,
  rsuperior: 0xF6F1,
  rtblock: 0x2590,
  rturned: 0x0279,
  rturnedsuperior: 0x02B4,
  ruhiragana: 0x308B,
  rukatakana: 0x30EB,
  rukatakanahalfwidth: 0xFF99,
  rupeemarkbengali: 0x09F2,
  rupeesignbengali: 0x09F3,
  rupiah: 0xF6DD,
  ruthai: 0x0E24,
  rvocalicbengali: 0x098B,
  rvocalicdeva: 0x090B,
  rvocalicgujarati: 0x0A8B,
  rvocalicvowelsignbengali: 0x09C3,
  rvocalicvowelsigndeva: 0x0943,
  rvocalicvowelsigngujarati: 0x0AC3,
  s: 0x0073,
  sabengali: 0x09B8,
  sacute: 0x015B,
  sacutedotaccent: 0x1E65,
  sadarabic: 0x0635,
  sadeva: 0x0938,
  sadfinalarabic: 0xFEBA,
  sadinitialarabic: 0xFEBB,
  sadmedialarabic: 0xFEBC,
  sagujarati: 0x0AB8,
  sagurmukhi: 0x0A38,
  sahiragana: 0x3055,
  sakatakana: 0x30B5,
  sakatakanahalfwidth: 0xFF7B,
  sallallahoualayhewasallamarabic: 0xFDFA,
  samekh: 0x05E1,
  samekhdagesh: 0xFB41,
  samekhdageshhebrew: 0xFB41,
  samekhhebrew: 0x05E1,
  saraaathai: 0x0E32,
  saraaethai: 0x0E41,
  saraaimaimalaithai: 0x0E44,
  saraaimaimuanthai: 0x0E43,
  saraamthai: 0x0E33,
  saraathai: 0x0E30,
  saraethai: 0x0E40,
  saraiileftthai: 0xF886,
  saraiithai: 0x0E35,
  saraileftthai: 0xF885,
  saraithai: 0x0E34,
  saraothai: 0x0E42,
  saraueeleftthai: 0xF888,
  saraueethai: 0x0E37,
  saraueleftthai: 0xF887,
  sarauethai: 0x0E36,
  sarauthai: 0x0E38,
  sarauuthai: 0x0E39,
  sbopomofo: 0x3119,
  scaron: 0x0161,
  scarondotaccent: 0x1E67,
  scedilla: 0x015F,
  schwa: 0x0259,
  schwacyrillic: 0x04D9,
  schwadieresiscyrillic: 0x04DB,
  schwahook: 0x025A,
  scircle: 0x24E2,
  scircumflex: 0x015D,
  scommaaccent: 0x0219,
  sdotaccent: 0x1E61,
  sdotbelow: 0x1E63,
  sdotbelowdotaccent: 0x1E69,
  seagullbelowcmb: 0x033C,
  second: 0x2033,
  secondtonechinese: 0x02CA,
  section: 0x00A7,
  seenarabic: 0x0633,
  seenfinalarabic: 0xFEB2,
  seeninitialarabic: 0xFEB3,
  seenmedialarabic: 0xFEB4,
  segol: 0x05B6,
  segol13: 0x05B6,
  segol1f: 0x05B6,
  segol2c: 0x05B6,
  segolhebrew: 0x05B6,
  segolnarrowhebrew: 0x05B6,
  segolquarterhebrew: 0x05B6,
  segoltahebrew: 0x0592,
  segolwidehebrew: 0x05B6,
  seharmenian: 0x057D,
  sehiragana: 0x305B,
  sekatakana: 0x30BB,
  sekatakanahalfwidth: 0xFF7E,
  semicolon: 0x003B,
  semicolonarabic: 0x061B,
  semicolonmonospace: 0xFF1B,
  semicolonsmall: 0xFE54,
  semivoicedmarkkana: 0x309C,
  semivoicedmarkkanahalfwidth: 0xFF9F,
  sentisquare: 0x3322,
  sentosquare: 0x3323,
  seven: 0x0037,
  sevenarabic: 0x0667,
  sevenbengali: 0x09ED,
  sevencircle: 0x2466,
  sevencircleinversesansserif: 0x2790,
  sevendeva: 0x096D,
  seveneighths: 0x215E,
  sevengujarati: 0x0AED,
  sevengurmukhi: 0x0A6D,
  sevenhackarabic: 0x0667,
  sevenhangzhou: 0x3027,
  sevenideographicparen: 0x3226,
  seveninferior: 0x2087,
  sevenmonospace: 0xFF17,
  sevenoldstyle: 0xF737,
  sevenparen: 0x247A,
  sevenperiod: 0x248E,
  sevenpersian: 0x06F7,
  sevenroman: 0x2176,
  sevensuperior: 0x2077,
  seventeencircle: 0x2470,
  seventeenparen: 0x2484,
  seventeenperiod: 0x2498,
  seventhai: 0x0E57,
  sfthyphen: 0x00AD,
  shaarmenian: 0x0577,
  shabengali: 0x09B6,
  shacyrillic: 0x0448,
  shaddaarabic: 0x0651,
  shaddadammaarabic: 0xFC61,
  shaddadammatanarabic: 0xFC5E,
  shaddafathaarabic: 0xFC60,
  shaddakasraarabic: 0xFC62,
  shaddakasratanarabic: 0xFC5F,
  shade: 0x2592,
  shadedark: 0x2593,
  shadelight: 0x2591,
  shademedium: 0x2592,
  shadeva: 0x0936,
  shagujarati: 0x0AB6,
  shagurmukhi: 0x0A36,
  shalshelethebrew: 0x0593,
  shbopomofo: 0x3115,
  shchacyrillic: 0x0449,
  sheenarabic: 0x0634,
  sheenfinalarabic: 0xFEB6,
  sheeninitialarabic: 0xFEB7,
  sheenmedialarabic: 0xFEB8,
  sheicoptic: 0x03E3,
  sheqel: 0x20AA,
  sheqelhebrew: 0x20AA,
  sheva: 0x05B0,
  sheva115: 0x05B0,
  sheva15: 0x05B0,
  sheva22: 0x05B0,
  sheva2e: 0x05B0,
  shevahebrew: 0x05B0,
  shevanarrowhebrew: 0x05B0,
  shevaquarterhebrew: 0x05B0,
  shevawidehebrew: 0x05B0,
  shhacyrillic: 0x04BB,
  shimacoptic: 0x03ED,
  shin: 0x05E9,
  shindagesh: 0xFB49,
  shindageshhebrew: 0xFB49,
  shindageshshindot: 0xFB2C,
  shindageshshindothebrew: 0xFB2C,
  shindageshsindot: 0xFB2D,
  shindageshsindothebrew: 0xFB2D,
  shindothebrew: 0x05C1,
  shinhebrew: 0x05E9,
  shinshindot: 0xFB2A,
  shinshindothebrew: 0xFB2A,
  shinsindot: 0xFB2B,
  shinsindothebrew: 0xFB2B,
  shook: 0x0282,
  sigma: 0x03C3,
  sigma1: 0x03C2,
  sigmafinal: 0x03C2,
  sigmalunatesymbolgreek: 0x03F2,
  sihiragana: 0x3057,
  sikatakana: 0x30B7,
  sikatakanahalfwidth: 0xFF7C,
  siluqhebrew: 0x05BD,
  siluqlefthebrew: 0x05BD,
  similar: 0x223C,
  sindothebrew: 0x05C2,
  siosacirclekorean: 0x3274,
  siosaparenkorean: 0x3214,
  sioscieuckorean: 0x317E,
  sioscirclekorean: 0x3266,
  sioskiyeokkorean: 0x317A,
  sioskorean: 0x3145,
  siosnieunkorean: 0x317B,
  siosparenkorean: 0x3206,
  siospieupkorean: 0x317D,
  siostikeutkorean: 0x317C,
  six: 0x0036,
  sixarabic: 0x0666,
  sixbengali: 0x09EC,
  sixcircle: 0x2465,
  sixcircleinversesansserif: 0x278F,
  sixdeva: 0x096C,
  sixgujarati: 0x0AEC,
  sixgurmukhi: 0x0A6C,
  sixhackarabic: 0x0666,
  sixhangzhou: 0x3026,
  sixideographicparen: 0x3225,
  sixinferior: 0x2086,
  sixmonospace: 0xFF16,
  sixoldstyle: 0xF736,
  sixparen: 0x2479,
  sixperiod: 0x248D,
  sixpersian: 0x06F6,
  sixroman: 0x2175,
  sixsuperior: 0x2076,
  sixteencircle: 0x246F,
  sixteencurrencydenominatorbengali: 0x09F9,
  sixteenparen: 0x2483,
  sixteenperiod: 0x2497,
  sixthai: 0x0E56,
  slash: 0x002F,
  slashmonospace: 0xFF0F,
  slong: 0x017F,
  slongdotaccent: 0x1E9B,
  smileface: 0x263A,
  smonospace: 0xFF53,
  sofpasuqhebrew: 0x05C3,
  softhyphen: 0x00AD,
  softsigncyrillic: 0x044C,
  sohiragana: 0x305D,
  sokatakana: 0x30BD,
  sokatakanahalfwidth: 0xFF7F,
  soliduslongoverlaycmb: 0x0338,
  solidusshortoverlaycmb: 0x0337,
  sorusithai: 0x0E29,
  sosalathai: 0x0E28,
  sosothai: 0x0E0B,
  sosuathai: 0x0E2A,
  space: 0x0020,
  spacehackarabic: 0x0020,
  spade: 0x2660,
  spadesuitblack: 0x2660,
  spadesuitwhite: 0x2664,
  sparen: 0x24AE,
  squarebelowcmb: 0x033B,
  squarecc: 0x33C4,
  squarecm: 0x339D,
  squarediagonalcrosshatchfill: 0x25A9,
  squarehorizontalfill: 0x25A4,
  squarekg: 0x338F,
  squarekm: 0x339E,
  squarekmcapital: 0x33CE,
  squareln: 0x33D1,
  squarelog: 0x33D2,
  squaremg: 0x338E,
  squaremil: 0x33D5,
  squaremm: 0x339C,
  squaremsquared: 0x33A1,
  squareorthogonalcrosshatchfill: 0x25A6,
  squareupperlefttolowerrightfill: 0x25A7,
  squareupperrighttolowerleftfill: 0x25A8,
  squareverticalfill: 0x25A5,
  squarewhitewithsmallblack: 0x25A3,
  srsquare: 0x33DB,
  ssabengali: 0x09B7,
  ssadeva: 0x0937,
  ssagujarati: 0x0AB7,
  ssangcieuckorean: 0x3149,
  ssanghieuhkorean: 0x3185,
  ssangieungkorean: 0x3180,
  ssangkiyeokkorean: 0x3132,
  ssangnieunkorean: 0x3165,
  ssangpieupkorean: 0x3143,
  ssangsioskorean: 0x3146,
  ssangtikeutkorean: 0x3138,
  ssuperior: 0xF6F2,
  sterling: 0x00A3,
  sterlingmonospace: 0xFFE1,
  strokelongoverlaycmb: 0x0336,
  strokeshortoverlaycmb: 0x0335,
  subset: 0x2282,
  subsetnotequal: 0x228A,
  subsetorequal: 0x2286,
  succeeds: 0x227B,
  suchthat: 0x220B,
  suhiragana: 0x3059,
  sukatakana: 0x30B9,
  sukatakanahalfwidth: 0xFF7D,
  sukunarabic: 0x0652,
  summation: 0x2211,
  sun: 0x263C,
  superset: 0x2283,
  supersetnotequal: 0x228B,
  supersetorequal: 0x2287,
  svsquare: 0x33DC,
  syouwaerasquare: 0x337C,
  t: 0x0074,
  tabengali: 0x09A4,
  tackdown: 0x22A4,
  tackleft: 0x22A3,
  tadeva: 0x0924,
  tagujarati: 0x0AA4,
  tagurmukhi: 0x0A24,
  taharabic: 0x0637,
  tahfinalarabic: 0xFEC2,
  tahinitialarabic: 0xFEC3,
  tahiragana: 0x305F,
  tahmedialarabic: 0xFEC4,
  taisyouerasquare: 0x337D,
  takatakana: 0x30BF,
  takatakanahalfwidth: 0xFF80,
  tatweelarabic: 0x0640,
  tau: 0x03C4,
  tav: 0x05EA,
  tavdages: 0xFB4A,
  tavdagesh: 0xFB4A,
  tavdageshhebrew: 0xFB4A,
  tavhebrew: 0x05EA,
  tbar: 0x0167,
  tbopomofo: 0x310A,
  tcaron: 0x0165,
  tccurl: 0x02A8,
  tcedilla: 0x0163,
  tcheharabic: 0x0686,
  tchehfinalarabic: 0xFB7B,
  tchehinitialarabic: 0xFB7C,
  tchehmedialarabic: 0xFB7D,
  tcircle: 0x24E3,
  tcircumflexbelow: 0x1E71,
  tcommaaccent: 0x0163,
  tdieresis: 0x1E97,
  tdotaccent: 0x1E6B,
  tdotbelow: 0x1E6D,
  tecyrillic: 0x0442,
  tedescendercyrillic: 0x04AD,
  teharabic: 0x062A,
  tehfinalarabic: 0xFE96,
  tehhahinitialarabic: 0xFCA2,
  tehhahisolatedarabic: 0xFC0C,
  tehinitialarabic: 0xFE97,
  tehiragana: 0x3066,
  tehjeeminitialarabic: 0xFCA1,
  tehjeemisolatedarabic: 0xFC0B,
  tehmarbutaarabic: 0x0629,
  tehmarbutafinalarabic: 0xFE94,
  tehmedialarabic: 0xFE98,
  tehmeeminitialarabic: 0xFCA4,
  tehmeemisolatedarabic: 0xFC0E,
  tehnoonfinalarabic: 0xFC73,
  tekatakana: 0x30C6,
  tekatakanahalfwidth: 0xFF83,
  telephone: 0x2121,
  telephoneblack: 0x260E,
  telishagedolahebrew: 0x05A0,
  telishaqetanahebrew: 0x05A9,
  tencircle: 0x2469,
  tenideographicparen: 0x3229,
  tenparen: 0x247D,
  tenperiod: 0x2491,
  tenroman: 0x2179,
  tesh: 0x02A7,
  tet: 0x05D8,
  tetdagesh: 0xFB38,
  tetdageshhebrew: 0xFB38,
  tethebrew: 0x05D8,
  tetsecyrillic: 0x04B5,
  tevirhebrew: 0x059B,
  tevirlefthebrew: 0x059B,
  thabengali: 0x09A5,
  thadeva: 0x0925,
  thagujarati: 0x0AA5,
  thagurmukhi: 0x0A25,
  thalarabic: 0x0630,
  thalfinalarabic: 0xFEAC,
  thanthakhatlowleftthai: 0xF898,
  thanthakhatlowrightthai: 0xF897,
  thanthakhatthai: 0x0E4C,
  thanthakhatupperleftthai: 0xF896,
  theharabic: 0x062B,
  thehfinalarabic: 0xFE9A,
  thehinitialarabic: 0xFE9B,
  thehmedialarabic: 0xFE9C,
  thereexists: 0x2203,
  therefore: 0x2234,
  theta: 0x03B8,
  theta1: 0x03D1,
  thetasymbolgreek: 0x03D1,
  thieuthacirclekorean: 0x3279,
  thieuthaparenkorean: 0x3219,
  thieuthcirclekorean: 0x326B,
  thieuthkorean: 0x314C,
  thieuthparenkorean: 0x320B,
  thirteencircle: 0x246C,
  thirteenparen: 0x2480,
  thirteenperiod: 0x2494,
  thonangmonthothai: 0x0E11,
  thook: 0x01AD,
  thophuthaothai: 0x0E12,
  thorn: 0x00FE,
  thothahanthai: 0x0E17,
  thothanthai: 0x0E10,
  thothongthai: 0x0E18,
  thothungthai: 0x0E16,
  thousandcyrillic: 0x0482,
  thousandsseparatorarabic: 0x066C,
  thousandsseparatorpersian: 0x066C,
  three: 0x0033,
  threearabic: 0x0663,
  threebengali: 0x09E9,
  threecircle: 0x2462,
  threecircleinversesansserif: 0x278C,
  threedeva: 0x0969,
  threeeighths: 0x215C,
  threegujarati: 0x0AE9,
  threegurmukhi: 0x0A69,
  threehackarabic: 0x0663,
  threehangzhou: 0x3023,
  threeideographicparen: 0x3222,
  threeinferior: 0x2083,
  threemonospace: 0xFF13,
  threenumeratorbengali: 0x09F6,
  threeoldstyle: 0xF733,
  threeparen: 0x2476,
  threeperiod: 0x248A,
  threepersian: 0x06F3,
  threequarters: 0x00BE,
  threequartersemdash: 0xF6DE,
  threeroman: 0x2172,
  threesuperior: 0x00B3,
  threethai: 0x0E53,
  thzsquare: 0x3394,
  tihiragana: 0x3061,
  tikatakana: 0x30C1,
  tikatakanahalfwidth: 0xFF81,
  tikeutacirclekorean: 0x3270,
  tikeutaparenkorean: 0x3210,
  tikeutcirclekorean: 0x3262,
  tikeutkorean: 0x3137,
  tikeutparenkorean: 0x3202,
  tilde: 0x02DC,
  tildebelowcmb: 0x0330,
  tildecmb: 0x0303,
  tildecomb: 0x0303,
  tildedoublecmb: 0x0360,
  tildeoperator: 0x223C,
  tildeoverlaycmb: 0x0334,
  tildeverticalcmb: 0x033E,
  timescircle: 0x2297,
  tipehahebrew: 0x0596,
  tipehalefthebrew: 0x0596,
  tippigurmukhi: 0x0A70,
  titlocyrilliccmb: 0x0483,
  tiwnarmenian: 0x057F,
  tlinebelow: 0x1E6F,
  tmonospace: 0xFF54,
  toarmenian: 0x0569,
  tohiragana: 0x3068,
  tokatakana: 0x30C8,
  tokatakanahalfwidth: 0xFF84,
  tonebarextrahighmod: 0x02E5,
  tonebarextralowmod: 0x02E9,
  tonebarhighmod: 0x02E6,
  tonebarlowmod: 0x02E8,
  tonebarmidmod: 0x02E7,
  tonefive: 0x01BD,
  tonesix: 0x0185,
  tonetwo: 0x01A8,
  tonos: 0x0384,
  tonsquare: 0x3327,
  topatakthai: 0x0E0F,
  tortoiseshellbracketleft: 0x3014,
  tortoiseshellbracketleftsmall: 0xFE5D,
  tortoiseshellbracketleftvertical: 0xFE39,
  tortoiseshellbracketright: 0x3015,
  tortoiseshellbracketrightsmall: 0xFE5E,
  tortoiseshellbracketrightvertical: 0xFE3A,
  totaothai: 0x0E15,
  tpalatalhook: 0x01AB,
  tparen: 0x24AF,
  trademark: 0x2122,
  trademarksans: 0xF8EA,
  trademarkserif: 0xF6DB,
  tretroflexhook: 0x0288,
  triagdn: 0x25BC,
  triaglf: 0x25C4,
  triagrt: 0x25BA,
  triagup: 0x25B2,
  ts: 0x02A6,
  tsadi: 0x05E6,
  tsadidagesh: 0xFB46,
  tsadidageshhebrew: 0xFB46,
  tsadihebrew: 0x05E6,
  tsecyrillic: 0x0446,
  tsere: 0x05B5,
  tsere12: 0x05B5,
  tsere1e: 0x05B5,
  tsere2b: 0x05B5,
  tserehebrew: 0x05B5,
  tserenarrowhebrew: 0x05B5,
  tserequarterhebrew: 0x05B5,
  tserewidehebrew: 0x05B5,
  tshecyrillic: 0x045B,
  tsuperior: 0xF6F3,
  ttabengali: 0x099F,
  ttadeva: 0x091F,
  ttagujarati: 0x0A9F,
  ttagurmukhi: 0x0A1F,
  tteharabic: 0x0679,
  ttehfinalarabic: 0xFB67,
  ttehinitialarabic: 0xFB68,
  ttehmedialarabic: 0xFB69,
  tthabengali: 0x09A0,
  tthadeva: 0x0920,
  tthagujarati: 0x0AA0,
  tthagurmukhi: 0x0A20,
  tturned: 0x0287,
  tuhiragana: 0x3064,
  tukatakana: 0x30C4,
  tukatakanahalfwidth: 0xFF82,
  tusmallhiragana: 0x3063,
  tusmallkatakana: 0x30C3,
  tusmallkatakanahalfwidth: 0xFF6F,
  twelvecircle: 0x246B,
  twelveparen: 0x247F,
  twelveperiod: 0x2493,
  twelveroman: 0x217B,
  twentycircle: 0x2473,
  twentyhangzhou: 0x5344,
  twentyparen: 0x2487,
  twentyperiod: 0x249B,
  two: 0x0032,
  twoarabic: 0x0662,
  twobengali: 0x09E8,
  twocircle: 0x2461,
  twocircleinversesansserif: 0x278B,
  twodeva: 0x0968,
  twodotenleader: 0x2025,
  twodotleader: 0x2025,
  twodotleadervertical: 0xFE30,
  twogujarati: 0x0AE8,
  twogurmukhi: 0x0A68,
  twohackarabic: 0x0662,
  twohangzhou: 0x3022,
  twoideographicparen: 0x3221,
  twoinferior: 0x2082,
  twomonospace: 0xFF12,
  twonumeratorbengali: 0x09F5,
  twooldstyle: 0xF732,
  twoparen: 0x2475,
  twoperiod: 0x2489,
  twopersian: 0x06F2,
  tworoman: 0x2171,
  twostroke: 0x01BB,
  twosuperior: 0x00B2,
  twothai: 0x0E52,
  twothirds: 0x2154,
  u: 0x0075,
  uacute: 0x00FA,
  ubar: 0x0289,
  ubengali: 0x0989,
  ubopomofo: 0x3128,
  ubreve: 0x016D,
  ucaron: 0x01D4,
  ucircle: 0x24E4,
  ucircumflex: 0x00FB,
  ucircumflexbelow: 0x1E77,
  ucyrillic: 0x0443,
  udattadeva: 0x0951,
  udblacute: 0x0171,
  udblgrave: 0x0215,
  udeva: 0x0909,
  udieresis: 0x00FC,
  udieresisacute: 0x01D8,
  udieresisbelow: 0x1E73,
  udieresiscaron: 0x01DA,
  udieresiscyrillic: 0x04F1,
  udieresisgrave: 0x01DC,
  udieresismacron: 0x01D6,
  udotbelow: 0x1EE5,
  ugrave: 0x00F9,
  ugujarati: 0x0A89,
  ugurmukhi: 0x0A09,
  uhiragana: 0x3046,
  uhookabove: 0x1EE7,
  uhorn: 0x01B0,
  uhornacute: 0x1EE9,
  uhorndotbelow: 0x1EF1,
  uhorngrave: 0x1EEB,
  uhornhookabove: 0x1EED,
  uhorntilde: 0x1EEF,
  uhungarumlaut: 0x0171,
  uhungarumlautcyrillic: 0x04F3,
  uinvertedbreve: 0x0217,
  ukatakana: 0x30A6,
  ukatakanahalfwidth: 0xFF73,
  ukcyrillic: 0x0479,
  ukorean: 0x315C,
  umacron: 0x016B,
  umacroncyrillic: 0x04EF,
  umacrondieresis: 0x1E7B,
  umatragurmukhi: 0x0A41,
  umonospace: 0xFF55,
  underscore: 0x005F,
  underscoredbl: 0x2017,
  underscoremonospace: 0xFF3F,
  underscorevertical: 0xFE33,
  underscorewavy: 0xFE4F,
  union: 0x222A,
  universal: 0x2200,
  uogonek: 0x0173,
  uparen: 0x24B0,
  upblock: 0x2580,
  upperdothebrew: 0x05C4,
  upsilon: 0x03C5,
  upsilondieresis: 0x03CB,
  upsilondieresistonos: 0x03B0,
  upsilonlatin: 0x028A,
  upsilontonos: 0x03CD,
  uptackbelowcmb: 0x031D,
  uptackmod: 0x02D4,
  uragurmukhi: 0x0A73,
  uring: 0x016F,
  ushortcyrillic: 0x045E,
  usmallhiragana: 0x3045,
  usmallkatakana: 0x30A5,
  usmallkatakanahalfwidth: 0xFF69,
  ustraightcyrillic: 0x04AF,
  ustraightstrokecyrillic: 0x04B1,
  utilde: 0x0169,
  utildeacute: 0x1E79,
  utildebelow: 0x1E75,
  uubengali: 0x098A,
  uudeva: 0x090A,
  uugujarati: 0x0A8A,
  uugurmukhi: 0x0A0A,
  uumatragurmukhi: 0x0A42,
  uuvowelsignbengali: 0x09C2,
  uuvowelsigndeva: 0x0942,
  uuvowelsigngujarati: 0x0AC2,
  uvowelsignbengali: 0x09C1,
  uvowelsigndeva: 0x0941,
  uvowelsigngujarati: 0x0AC1,
  v: 0x0076,
  vadeva: 0x0935,
  vagujarati: 0x0AB5,
  vagurmukhi: 0x0A35,
  vakatakana: 0x30F7,
  vav: 0x05D5,
  vavdagesh: 0xFB35,
  vavdagesh65: 0xFB35,
  vavdageshhebrew: 0xFB35,
  vavhebrew: 0x05D5,
  vavholam: 0xFB4B,
  vavholamhebrew: 0xFB4B,
  vavvavhebrew: 0x05F0,
  vavyodhebrew: 0x05F1,
  vcircle: 0x24E5,
  vdotbelow: 0x1E7F,
  vecyrillic: 0x0432,
  veharabic: 0x06A4,
  vehfinalarabic: 0xFB6B,
  vehinitialarabic: 0xFB6C,
  vehmedialarabic: 0xFB6D,
  vekatakana: 0x30F9,
  venus: 0x2640,
  verticalbar: 0x007C,
  verticallineabovecmb: 0x030D,
  verticallinebelowcmb: 0x0329,
  verticallinelowmod: 0x02CC,
  verticallinemod: 0x02C8,
  vewarmenian: 0x057E,
  vhook: 0x028B,
  vikatakana: 0x30F8,
  viramabengali: 0x09CD,
  viramadeva: 0x094D,
  viramagujarati: 0x0ACD,
  visargabengali: 0x0983,
  visargadeva: 0x0903,
  visargagujarati: 0x0A83,
  vmonospace: 0xFF56,
  voarmenian: 0x0578,
  voicediterationhiragana: 0x309E,
  voicediterationkatakana: 0x30FE,
  voicedmarkkana: 0x309B,
  voicedmarkkanahalfwidth: 0xFF9E,
  vokatakana: 0x30FA,
  vparen: 0x24B1,
  vtilde: 0x1E7D,
  vturned: 0x028C,
  vuhiragana: 0x3094,
  vukatakana: 0x30F4,
  w: 0x0077,
  wacute: 0x1E83,
  waekorean: 0x3159,
  wahiragana: 0x308F,
  wakatakana: 0x30EF,
  wakatakanahalfwidth: 0xFF9C,
  wakorean: 0x3158,
  wasmallhiragana: 0x308E,
  wasmallkatakana: 0x30EE,
  wattosquare: 0x3357,
  wavedash: 0x301C,
  wavyunderscorevertical: 0xFE34,
  wawarabic: 0x0648,
  wawfinalarabic: 0xFEEE,
  wawhamzaabovearabic: 0x0624,
  wawhamzaabovefinalarabic: 0xFE86,
  wbsquare: 0x33DD,
  wcircle: 0x24E6,
  wcircumflex: 0x0175,
  wdieresis: 0x1E85,
  wdotaccent: 0x1E87,
  wdotbelow: 0x1E89,
  wehiragana: 0x3091,
  weierstrass: 0x2118,
  wekatakana: 0x30F1,
  wekorean: 0x315E,
  weokorean: 0x315D,
  wgrave: 0x1E81,
  whitebullet: 0x25E6,
  whitecircle: 0x25CB,
  whitecircleinverse: 0x25D9,
  whitecornerbracketleft: 0x300E,
  whitecornerbracketleftvertical: 0xFE43,
  whitecornerbracketright: 0x300F,
  whitecornerbracketrightvertical: 0xFE44,
  whitediamond: 0x25C7,
  whitediamondcontainingblacksmalldiamond: 0x25C8,
  whitedownpointingsmalltriangle: 0x25BF,
  whitedownpointingtriangle: 0x25BD,
  whiteleftpointingsmalltriangle: 0x25C3,
  whiteleftpointingtriangle: 0x25C1,
  whitelenticularbracketleft: 0x3016,
  whitelenticularbracketright: 0x3017,
  whiterightpointingsmalltriangle: 0x25B9,
  whiterightpointingtriangle: 0x25B7,
  whitesmallsquare: 0x25AB,
  whitesmilingface: 0x263A,
  whitesquare: 0x25A1,
  whitestar: 0x2606,
  whitetelephone: 0x260F,
  whitetortoiseshellbracketleft: 0x3018,
  whitetortoiseshellbracketright: 0x3019,
  whiteuppointingsmalltriangle: 0x25B5,
  whiteuppointingtriangle: 0x25B3,
  wihiragana: 0x3090,
  wikatakana: 0x30F0,
  wikorean: 0x315F,
  wmonospace: 0xFF57,
  wohiragana: 0x3092,
  wokatakana: 0x30F2,
  wokatakanahalfwidth: 0xFF66,
  won: 0x20A9,
  wonmonospace: 0xFFE6,
  wowaenthai: 0x0E27,
  wparen: 0x24B2,
  wring: 0x1E98,
  wsuperior: 0x02B7,
  wturned: 0x028D,
  wynn: 0x01BF,
  x: 0x0078,
  xabovecmb: 0x033D,
  xbopomofo: 0x3112,
  xcircle: 0x24E7,
  xdieresis: 0x1E8D,
  xdotaccent: 0x1E8B,
  xeharmenian: 0x056D,
  xi: 0x03BE,
  xmonospace: 0xFF58,
  xparen: 0x24B3,
  xsuperior: 0x02E3,
  y: 0x0079,
  yaadosquare: 0x334E,
  yabengali: 0x09AF,
  yacute: 0x00FD,
  yadeva: 0x092F,
  yaekorean: 0x3152,
  yagujarati: 0x0AAF,
  yagurmukhi: 0x0A2F,
  yahiragana: 0x3084,
  yakatakana: 0x30E4,
  yakatakanahalfwidth: 0xFF94,
  yakorean: 0x3151,
  yamakkanthai: 0x0E4E,
  yasmallhiragana: 0x3083,
  yasmallkatakana: 0x30E3,
  yasmallkatakanahalfwidth: 0xFF6C,
  yatcyrillic: 0x0463,
  ycircle: 0x24E8,
  ycircumflex: 0x0177,
  ydieresis: 0x00FF,
  ydotaccent: 0x1E8F,
  ydotbelow: 0x1EF5,
  yeharabic: 0x064A,
  yehbarreearabic: 0x06D2,
  yehbarreefinalarabic: 0xFBAF,
  yehfinalarabic: 0xFEF2,
  yehhamzaabovearabic: 0x0626,
  yehhamzaabovefinalarabic: 0xFE8A,
  yehhamzaaboveinitialarabic: 0xFE8B,
  yehhamzaabovemedialarabic: 0xFE8C,
  yehinitialarabic: 0xFEF3,
  yehmedialarabic: 0xFEF4,
  yehmeeminitialarabic: 0xFCDD,
  yehmeemisolatedarabic: 0xFC58,
  yehnoonfinalarabic: 0xFC94,
  yehthreedotsbelowarabic: 0x06D1,
  yekorean: 0x3156,
  yen: 0x00A5,
  yenmonospace: 0xFFE5,
  yeokorean: 0x3155,
  yeorinhieuhkorean: 0x3186,
  yerahbenyomohebrew: 0x05AA,
  yerahbenyomolefthebrew: 0x05AA,
  yericyrillic: 0x044B,
  yerudieresiscyrillic: 0x04F9,
  yesieungkorean: 0x3181,
  yesieungpansioskorean: 0x3183,
  yesieungsioskorean: 0x3182,
  yetivhebrew: 0x059A,
  ygrave: 0x1EF3,
  yhook: 0x01B4,
  yhookabove: 0x1EF7,
  yiarmenian: 0x0575,
  yicyrillic: 0x0457,
  yikorean: 0x3162,
  yinyang: 0x262F,
  yiwnarmenian: 0x0582,
  ymonospace: 0xFF59,
  yod: 0x05D9,
  yoddagesh: 0xFB39,
  yoddageshhebrew: 0xFB39,
  yodhebrew: 0x05D9,
  yodyodhebrew: 0x05F2,
  yodyodpatahhebrew: 0xFB1F,
  yohiragana: 0x3088,
  yoikorean: 0x3189,
  yokatakana: 0x30E8,
  yokatakanahalfwidth: 0xFF96,
  yokorean: 0x315B,
  yosmallhiragana: 0x3087,
  yosmallkatakana: 0x30E7,
  yosmallkatakanahalfwidth: 0xFF6E,
  yotgreek: 0x03F3,
  yoyaekorean: 0x3188,
  yoyakorean: 0x3187,
  yoyakthai: 0x0E22,
  yoyingthai: 0x0E0D,
  yparen: 0x24B4,
  ypogegrammeni: 0x037A,
  ypogegrammenigreekcmb: 0x0345,
  yr: 0x01A6,
  yring: 0x1E99,
  ysuperior: 0x02B8,
  ytilde: 0x1EF9,
  yturned: 0x028E,
  yuhiragana: 0x3086,
  yuikorean: 0x318C,
  yukatakana: 0x30E6,
  yukatakanahalfwidth: 0xFF95,
  yukorean: 0x3160,
  yusbigcyrillic: 0x046B,
  yusbigiotifiedcyrillic: 0x046D,
  yuslittlecyrillic: 0x0467,
  yuslittleiotifiedcyrillic: 0x0469,
  yusmallhiragana: 0x3085,
  yusmallkatakana: 0x30E5,
  yusmallkatakanahalfwidth: 0xFF6D,
  yuyekorean: 0x318B,
  yuyeokorean: 0x318A,
  yyabengali: 0x09DF,
  yyadeva: 0x095F,
  z: 0x007A,
  zaarmenian: 0x0566,
  zacute: 0x017A,
  zadeva: 0x095B,
  zagurmukhi: 0x0A5B,
  zaharabic: 0x0638,
  zahfinalarabic: 0xFEC6,
  zahinitialarabic: 0xFEC7,
  zahiragana: 0x3056,
  zahmedialarabic: 0xFEC8,
  zainarabic: 0x0632,
  zainfinalarabic: 0xFEB0,
  zakatakana: 0x30B6,
  zaqefgadolhebrew: 0x0595,
  zaqefqatanhebrew: 0x0594,
  zarqahebrew: 0x0598,
  zayin: 0x05D6,
  zayindagesh: 0xFB36,
  zayindageshhebrew: 0xFB36,
  zayinhebrew: 0x05D6,
  zbopomofo: 0x3117,
  zcaron: 0x017E,
  zcircle: 0x24E9,
  zcircumflex: 0x1E91,
  zcurl: 0x0291,
  zdot: 0x017C,
  zdotaccent: 0x017C,
  zdotbelow: 0x1E93,
  zecyrillic: 0x0437,
  zedescendercyrillic: 0x0499,
  zedieresiscyrillic: 0x04DF,
  zehiragana: 0x305C,
  zekatakana: 0x30BC,
  zero: 0x0030,
  zeroarabic: 0x0660,
  zerobengali: 0x09E6,
  zerodeva: 0x0966,
  zerogujarati: 0x0AE6,
  zerogurmukhi: 0x0A66,
  zerohackarabic: 0x0660,
  zeroinferior: 0x2080,
  zeromonospace: 0xFF10,
  zerooldstyle: 0xF730,
  zeropersian: 0x06F0,
  zerosuperior: 0x2070,
  zerothai: 0x0E50,
  zerowidthjoiner: 0xFEFF,
  zerowidthnonjoiner: 0x200C,
  zerowidthspace: 0x200B,
  zeta: 0x03B6,
  zhbopomofo: 0x3113,
  zhearmenian: 0x056A,
  zhebrevecyrillic: 0x04C2,
  zhecyrillic: 0x0436,
  zhedescendercyrillic: 0x0497,
  zhedieresiscyrillic: 0x04DD,
  zihiragana: 0x3058,
  zikatakana: 0x30B8,
  zinorhebrew: 0x05AE,
  zlinebelow: 0x1E95,
  zmonospace: 0xFF5A,
  zohiragana: 0x305E,
  zokatakana: 0x30BE,
  zparen: 0x24B5,
  zretroflexhook: 0x0290,
  zstroke: 0x01B6,
  zuhiragana: 0x305A,
  zukatakana: 0x30BA,
  '.notdef': 0x0000
};

var DingbatsGlyphsUnicode = {
  space: 0x0020,
  a1: 0x2701,
  a2: 0x2702,
  a202: 0x2703,
  a3: 0x2704,
  a4: 0x260E,
  a5: 0x2706,
  a119: 0x2707,
  a118: 0x2708,
  a117: 0x2709,
  a11: 0x261B,
  a12: 0x261E,
  a13: 0x270C,
  a14: 0x270D,
  a15: 0x270E,
  a16: 0x270F,
  a105: 0x2710,
  a17: 0x2711,
  a18: 0x2712,
  a19: 0x2713,
  a20: 0x2714,
  a21: 0x2715,
  a22: 0x2716,
  a23: 0x2717,
  a24: 0x2718,
  a25: 0x2719,
  a26: 0x271A,
  a27: 0x271B,
  a28: 0x271C,
  a6: 0x271D,
  a7: 0x271E,
  a8: 0x271F,
  a9: 0x2720,
  a10: 0x2721,
  a29: 0x2722,
  a30: 0x2723,
  a31: 0x2724,
  a32: 0x2725,
  a33: 0x2726,
  a34: 0x2727,
  a35: 0x2605,
  a36: 0x2729,
  a37: 0x272A,
  a38: 0x272B,
  a39: 0x272C,
  a40: 0x272D,
  a41: 0x272E,
  a42: 0x272F,
  a43: 0x2730,
  a44: 0x2731,
  a45: 0x2732,
  a46: 0x2733,
  a47: 0x2734,
  a48: 0x2735,
  a49: 0x2736,
  a50: 0x2737,
  a51: 0x2738,
  a52: 0x2739,
  a53: 0x273A,
  a54: 0x273B,
  a55: 0x273C,
  a56: 0x273D,
  a57: 0x273E,
  a58: 0x273F,
  a59: 0x2740,
  a60: 0x2741,
  a61: 0x2742,
  a62: 0x2743,
  a63: 0x2744,
  a64: 0x2745,
  a65: 0x2746,
  a66: 0x2747,
  a67: 0x2748,
  a68: 0x2749,
  a69: 0x274A,
  a70: 0x274B,
  a71: 0x25CF,
  a72: 0x274D,
  a73: 0x25A0,
  a74: 0x274F,
  a203: 0x2750,
  a75: 0x2751,
  a204: 0x2752,
  a76: 0x25B2,
  a77: 0x25BC,
  a78: 0x25C6,
  a79: 0x2756,
  a81: 0x25D7,
  a82: 0x2758,
  a83: 0x2759,
  a84: 0x275A,
  a97: 0x275B,
  a98: 0x275C,
  a99: 0x275D,
  a100: 0x275E,
  a101: 0x2761,
  a102: 0x2762,
  a103: 0x2763,
  a104: 0x2764,
  a106: 0x2765,
  a107: 0x2766,
  a108: 0x2767,
  a112: 0x2663,
  a111: 0x2666,
  a110: 0x2665,
  a109: 0x2660,
  a120: 0x2460,
  a121: 0x2461,
  a122: 0x2462,
  a123: 0x2463,
  a124: 0x2464,
  a125: 0x2465,
  a126: 0x2466,
  a127: 0x2467,
  a128: 0x2468,
  a129: 0x2469,
  a130: 0x2776,
  a131: 0x2777,
  a132: 0x2778,
  a133: 0x2779,
  a134: 0x277A,
  a135: 0x277B,
  a136: 0x277C,
  a137: 0x277D,
  a138: 0x277E,
  a139: 0x277F,
  a140: 0x2780,
  a141: 0x2781,
  a142: 0x2782,
  a143: 0x2783,
  a144: 0x2784,
  a145: 0x2785,
  a146: 0x2786,
  a147: 0x2787,
  a148: 0x2788,
  a149: 0x2789,
  a150: 0x278A,
  a151: 0x278B,
  a152: 0x278C,
  a153: 0x278D,
  a154: 0x278E,
  a155: 0x278F,
  a156: 0x2790,
  a157: 0x2791,
  a158: 0x2792,
  a159: 0x2793,
  a160: 0x2794,
  a161: 0x2192,
  a163: 0x2194,
  a164: 0x2195,
  a196: 0x2798,
  a165: 0x2799,
  a192: 0x279A,
  a166: 0x279B,
  a167: 0x279C,
  a168: 0x279D,
  a169: 0x279E,
  a170: 0x279F,
  a171: 0x27A0,
  a172: 0x27A1,
  a173: 0x27A2,
  a162: 0x27A3,
  a174: 0x27A4,
  a175: 0x27A5,
  a176: 0x27A6,
  a177: 0x27A7,
  a178: 0x27A8,
  a179: 0x27A9,
  a193: 0x27AA,
  a180: 0x27AB,
  a199: 0x27AC,
  a181: 0x27AD,
  a200: 0x27AE,
  a182: 0x27AF,
  a201: 0x27B1,
  a183: 0x27B2,
  a184: 0x27B3,
  a197: 0x27B4,
  a185: 0x27B5,
  a194: 0x27B6,
  a198: 0x27B7,
  a186: 0x27B8,
  a195: 0x27B9,
  a187: 0x27BA,
  a188: 0x27BB,
  a189: 0x27BC,
  a190: 0x27BD,
  a191: 0x27BE,
  a89: 0x2768, // 0xF8D7
  a90: 0x2769, // 0xF8D8
  a93: 0x276A, // 0xF8D9
  a94: 0x276B, // 0xF8DA
  a91: 0x276C, // 0xF8DB
  a92: 0x276D, // 0xF8DC
  a205: 0x276E, // 0xF8DD
  a85: 0x276F, // 0xF8DE
  a206: 0x2770, // 0xF8DF
  a86: 0x2771, // 0xF8E0
  a87: 0x2772, // 0xF8E1
  a88: 0x2773, // 0xF8E2
  a95: 0x2774, // 0xF8E3
  a96: 0x2775, // 0xF8E4
  '.notdef': 0x0000
};


var PDFImage = (function PDFImageClosure() {
  /**
   * Decode the image in the main thread if it supported. Resovles the promise
   * when the image data is ready.
   */
  function handleImageData(handler, xref, res, image) {
    if (image instanceof JpegStream && image.isNativelyDecodable(xref, res)) {
      // For natively supported jpegs send them to the main thread for decoding.
      var dict = image.dict;
      var colorSpace = dict.get('ColorSpace', 'CS');
      colorSpace = ColorSpace.parse(colorSpace, xref, res);
      var numComps = colorSpace.numComps;
      var decodePromise = handler.sendWithPromise('JpegDecode',
                                                  [image.getIR(), numComps]);
      return decodePromise.then(function (message) {
        var data = message.data;
        return new Stream(data, 0, data.length, image.dict);
      });
    } else {
      return Promise.resolve(image);
    }
  }

  /**
   * Decode and clamp a value. The formula is different from the spec because we
   * don't decode to float range [0,1], we decode it in the [0,max] range.
   */
  function decodeAndClamp(value, addend, coefficient, max) {
    value = addend + value * coefficient;
    // Clamp the value to the range
    return (value < 0 ? 0 : (value > max ? max : value));
  }

  function PDFImage(xref, res, image, inline, smask, mask, isMask) {
    this.image = image;
    var dict = image.dict;
    if (dict.has('Filter')) {
      var filter = dict.get('Filter').name;
      if (filter === 'JPXDecode') {
        var jpxImage = new JpxImage();
        jpxImage.parseImageProperties(image.stream);
        image.stream.reset();
        image.bitsPerComponent = jpxImage.bitsPerComponent;
        image.numComps = jpxImage.componentsCount;
      } else if (filter === 'JBIG2Decode') {
        image.bitsPerComponent = 1;
        image.numComps = 1;
      }
    }
    // TODO cache rendered images?

    this.width = dict.get('Width', 'W');
    this.height = dict.get('Height', 'H');

    if (this.width < 1 || this.height < 1) {
      error('Invalid image width: ' + this.width + ' or height: ' +
            this.height);
    }

    this.interpolate = dict.get('Interpolate', 'I') || false;
    this.imageMask = dict.get('ImageMask', 'IM') || false;
    this.matte = dict.get('Matte') || false;

    var bitsPerComponent = image.bitsPerComponent;
    if (!bitsPerComponent) {
      bitsPerComponent = dict.get('BitsPerComponent', 'BPC');
      if (!bitsPerComponent) {
        if (this.imageMask) {
          bitsPerComponent = 1;
        } else {
          error('Bits per component missing in image: ' + this.imageMask);
        }
      }
    }
    this.bpc = bitsPerComponent;

    if (!this.imageMask) {
      var colorSpace = dict.get('ColorSpace', 'CS');
      if (!colorSpace) {
        info('JPX images (which do not require color spaces)');
        switch (image.numComps) {
          case 1:
            colorSpace = Name.get('DeviceGray');
            break;
          case 3:
            colorSpace = Name.get('DeviceRGB');
            break;
          case 4:
            colorSpace = Name.get('DeviceCMYK');
            break;
          default:
            error('JPX images with ' + this.numComps +
                  ' color components not supported.');
        }
      }
      this.colorSpace = ColorSpace.parse(colorSpace, xref, res);
      this.numComps = this.colorSpace.numComps;
    }

    this.decode = dict.get('Decode', 'D');
    this.needsDecode = false;
    if (this.decode &&
        ((this.colorSpace && !this.colorSpace.isDefaultDecode(this.decode)) ||
         (isMask && !ColorSpace.isDefaultDecode(this.decode, 1)))) {
      this.needsDecode = true;
      // Do some preprocessing to avoid more math.
      var max = (1 << bitsPerComponent) - 1;
      this.decodeCoefficients = [];
      this.decodeAddends = [];
      for (var i = 0, j = 0; i < this.decode.length; i += 2, ++j) {
        var dmin = this.decode[i];
        var dmax = this.decode[i + 1];
        this.decodeCoefficients[j] = dmax - dmin;
        this.decodeAddends[j] = max * dmin;
      }
    }

    if (smask) {
      this.smask = new PDFImage(xref, res, smask, false);
    } else if (mask) {
      if (isStream(mask)) {
        this.mask = new PDFImage(xref, res, mask, false, null, null, true);
      } else {
        // Color key mask (just an array).
        this.mask = mask;
      }
    }
  }
  /**
   * Handles processing of image data and returns the Promise that is resolved
   * with a PDFImage when the image is ready to be used.
   */
  PDFImage.buildImage = function PDFImage_buildImage(handler, xref,
                                                     res, image, inline) {
    var imagePromise = handleImageData(handler, xref, res, image);
    var smaskPromise;
    var maskPromise;

    var smask = image.dict.get('SMask');
    var mask = image.dict.get('Mask');

    if (smask) {
      smaskPromise = handleImageData(handler, xref, res, smask);
      maskPromise = Promise.resolve(null);
    } else {
      smaskPromise = Promise.resolve(null);
      if (mask) {
        if (isStream(mask)) {
          maskPromise = handleImageData(handler, xref, res, mask);
        } else if (isArray(mask)) {
          maskPromise = Promise.resolve(mask);
        } else {
          warn('Unsupported mask format.');
          maskPromise = Promise.resolve(null);
        }
      } else {
        maskPromise = Promise.resolve(null);
      }
    }
    return Promise.all([imagePromise, smaskPromise, maskPromise]).then(
      function(results) {
        var imageData = results[0];
        var smaskData = results[1];
        var maskData = results[2];
        return new PDFImage(xref, res, imageData, inline, smaskData, maskData);
      });
  };

  /**
   * Resize an image using the nearest neighbor algorithm. Currently only
   * supports one and three component images.
   * @param {TypedArray} pixels The original image with one component.
   * @param {Number} bpc Number of bits per component.
   * @param {Number} components Number of color components, 1 or 3 is supported.
   * @param {Number} w1 Original width.
   * @param {Number} h1 Original height.
   * @param {Number} w2 New width.
   * @param {Number} h2 New height.
   * @param {TypedArray} dest (Optional) The destination buffer.
   * @param {Number} alpha01 (Optional) Size reserved for the alpha channel.
   * @return {TypedArray} Resized image data.
   */
  PDFImage.resize = function PDFImage_resize(pixels, bpc, components,
                                             w1, h1, w2, h2, dest, alpha01) {

    if (components !== 1 && components !== 3) {
      error('Unsupported component count for resizing.');
    }

    var length = w2 * h2 * components;
    var temp = dest ? dest : (bpc <= 8 ? new Uint8Array(length) :
        (bpc <= 16 ? new Uint16Array(length) : new Uint32Array(length)));
    var xRatio = w1 / w2;
    var yRatio = h1 / h2;
    var i, j, py, newIndex = 0, oldIndex;
    var xScaled = new Uint16Array(w2);
    var w1Scanline = w1 * components;
    if (alpha01 !== 1) {
      alpha01 = 0;
    }

    for (j = 0; j < w2; j++) {
      xScaled[j] = Math.floor(j * xRatio) * components;
    }

    if (components === 1) {
      for (i = 0; i < h2; i++) {
        py = Math.floor(i * yRatio) * w1Scanline;
        for (j = 0; j < w2; j++) {
          oldIndex = py + xScaled[j];
          temp[newIndex++] = pixels[oldIndex];
        }
      }
    } else if (components === 3) {
      for (i = 0; i < h2; i++) {
        py = Math.floor(i * yRatio) * w1Scanline;
        for (j = 0; j < w2; j++) {
          oldIndex = py + xScaled[j];
          temp[newIndex++] = pixels[oldIndex++];
          temp[newIndex++] = pixels[oldIndex++];
          temp[newIndex++] = pixels[oldIndex++];
          newIndex += alpha01;
        }
      }
    }
    return temp;
  };

  PDFImage.createMask =
      function PDFImage_createMask(imgArray, width, height,
                                   imageIsFromDecodeStream, inverseDecode) {

    // |imgArray| might not contain full data for every pixel of the mask, so
    // we need to distinguish between |computedLength| and |actualLength|.
    // In particular, if inverseDecode is true, then the array we return must
    // have a length of |computedLength|.

    var computedLength = ((width + 7) >> 3) * height;
    var actualLength = imgArray.byteLength;
    var haveFullData = computedLength === actualLength;
    var data, i;

    if (imageIsFromDecodeStream && (!inverseDecode || haveFullData)) {
      // imgArray came from a DecodeStream and its data is in an appropriate
      // form, so we can just transfer it.
      data = imgArray;
    } else if (!inverseDecode) {
      data = new Uint8Array(actualLength);
      data.set(imgArray);
    } else {
      data = new Uint8Array(computedLength);
      data.set(imgArray);
      for (i = actualLength; i < computedLength; i++) {
        data[i] = 0xff;
      }
    }

    // If necessary, invert the original mask data (but not any extra we might
    // have added above). It's safe to modify the array -- whether it's the
    // original or a copy, we're about to transfer it anyway, so nothing else
    // in this thread can be relying on its contents.
    if (inverseDecode) {
      for (i = 0; i < actualLength; i++) {
        data[i] = ~data[i];
      }
    }

    return {data: data, width: width, height: height};
  };

  PDFImage.prototype = {
    get drawWidth() {
      return Math.max(this.width,
                      this.smask && this.smask.width || 0,
                      this.mask && this.mask.width || 0);
    },

    get drawHeight() {
      return Math.max(this.height,
                      this.smask && this.smask.height || 0,
                      this.mask && this.mask.height || 0);
    },

    decodeBuffer: function PDFImage_decodeBuffer(buffer) {
      var bpc = this.bpc;
      var numComps = this.numComps;

      var decodeAddends = this.decodeAddends;
      var decodeCoefficients = this.decodeCoefficients;
      var max = (1 << bpc) - 1;
      var i, ii;

      if (bpc === 1) {
        // If the buffer needed decode that means it just needs to be inverted.
        for (i = 0, ii = buffer.length; i < ii; i++) {
          buffer[i] = +!(buffer[i]);
        }
        return;
      }
      var index = 0;
      for (i = 0, ii = this.width * this.height; i < ii; i++) {
        for (var j = 0; j < numComps; j++) {
          buffer[index] = decodeAndClamp(buffer[index], decodeAddends[j],
                                         decodeCoefficients[j], max);
          index++;
        }
      }
    },

    getComponents: function PDFImage_getComponents(buffer) {
      var bpc = this.bpc;

      // This image doesn't require any extra work.
      if (bpc === 8) {
        return buffer;
      }

      var width = this.width;
      var height = this.height;
      var numComps = this.numComps;

      var length = width * height * numComps;
      var bufferPos = 0;
      var output = (bpc <= 8 ? new Uint8Array(length) :
        (bpc <= 16 ? new Uint16Array(length) : new Uint32Array(length)));
      var rowComps = width * numComps;

      var max = (1 << bpc) - 1;
      var i = 0, ii, buf;

      if (bpc === 1) {
        // Optimization for reading 1 bpc images.
        var mask, loop1End, loop2End;
        for (var j = 0; j < height; j++) {
          loop1End = i + (rowComps & ~7);
          loop2End = i + rowComps;

          // unroll loop for all full bytes
          while (i < loop1End) {
            buf = buffer[bufferPos++];
            output[i] = (buf >> 7) & 1;
            output[i + 1] = (buf >> 6) & 1;
            output[i + 2] = (buf >> 5) & 1;
            output[i + 3] = (buf >> 4) & 1;
            output[i + 4] = (buf >> 3) & 1;
            output[i + 5] = (buf >> 2) & 1;
            output[i + 6] = (buf >> 1) & 1;
            output[i + 7] = buf & 1;
            i += 8;
          }

          // handle remaing bits
          if (i < loop2End) {
            buf = buffer[bufferPos++];
            mask = 128;
            while (i < loop2End) {
              output[i++] = +!!(buf & mask);
              mask >>= 1;
            }
          }
        }
      } else {
        // The general case that handles all other bpc values.
        var bits = 0;
        buf = 0;
        for (i = 0, ii = length; i < ii; ++i) {
          if (i % rowComps === 0) {
            buf = 0;
            bits = 0;
          }

          while (bits < bpc) {
            buf = (buf << 8) | buffer[bufferPos++];
            bits += 8;
          }

          var remainingBits = bits - bpc;
          var value = buf >> remainingBits;
          output[i] = (value < 0 ? 0 : (value > max ? max : value));
          buf = buf & ((1 << remainingBits) - 1);
          bits = remainingBits;
        }
      }
      return output;
    },

    fillOpacity: function PDFImage_fillOpacity(rgbaBuf, width, height,
                                               actualHeight, image) {
      var smask = this.smask;
      var mask = this.mask;
      var alphaBuf, sw, sh, i, ii, j;

      if (smask) {
        sw = smask.width;
        sh = smask.height;
        alphaBuf = new Uint8Array(sw * sh);
        smask.fillGrayBuffer(alphaBuf);
        if (sw !== width || sh !== height) {
          alphaBuf = PDFImage.resize(alphaBuf, smask.bpc, 1, sw, sh, width,
                                     height);
        }
      } else if (mask) {
        if (mask instanceof PDFImage) {
          sw = mask.width;
          sh = mask.height;
          alphaBuf = new Uint8Array(sw * sh);
          mask.numComps = 1;
          mask.fillGrayBuffer(alphaBuf);

          // Need to invert values in rgbaBuf
          for (i = 0, ii = sw * sh; i < ii; ++i) {
            alphaBuf[i] = 255 - alphaBuf[i];
          }

          if (sw !== width || sh !== height) {
            alphaBuf = PDFImage.resize(alphaBuf, mask.bpc, 1, sw, sh, width,
                                       height);
          }
        } else if (isArray(mask)) {
          // Color key mask: if any of the compontents are outside the range
          // then they should be painted.
          alphaBuf = new Uint8Array(width * height);
          var numComps = this.numComps;
          for (i = 0, ii = width * height; i < ii; ++i) {
            var opacity = 0;
            var imageOffset = i * numComps;
            for (j = 0; j < numComps; ++j) {
              var color = image[imageOffset + j];
              var maskOffset = j * 2;
              if (color < mask[maskOffset] || color > mask[maskOffset + 1]) {
                opacity = 255;
                break;
              }
            }
            alphaBuf[i] = opacity;
          }
        } else {
          error('Unknown mask format.');
        }
      }

      if (alphaBuf) {
        for (i = 0, j = 3, ii = width * actualHeight; i < ii; ++i, j += 4) {
          rgbaBuf[j] = alphaBuf[i];
        }
      } else {
        // No mask.
        for (i = 0, j = 3, ii = width * actualHeight; i < ii; ++i, j += 4) {
          rgbaBuf[j] = 255;
        }
      }
    },

    undoPreblend: function PDFImage_undoPreblend(buffer, width, height) {
      var matte = this.smask && this.smask.matte;
      if (!matte) {
        return;
      }
      var matteRgb = this.colorSpace.getRgb(matte, 0);
      var matteR = matteRgb[0];
      var matteG = matteRgb[1];
      var matteB = matteRgb[2];
      var length = width * height * 4;
      var r, g, b;
      for (var i = 0; i < length; i += 4) {
        var alpha = buffer[i + 3];
        if (alpha === 0) {
          // according formula we have to get Infinity in all components
          // making it white (typical paper color) should be okay
          buffer[i] = 255;
          buffer[i + 1] = 255;
          buffer[i + 2] = 255;
          continue;
        }
        var k = 255 / alpha;
        r = (buffer[i] - matteR) * k + matteR;
        g = (buffer[i + 1] - matteG) * k + matteG;
        b = (buffer[i + 2] - matteB) * k + matteB;
        buffer[i] = r <= 0 ? 0 : r >= 255 ? 255 : r | 0;
        buffer[i + 1] = g <= 0 ? 0 : g >= 255 ? 255 : g | 0;
        buffer[i + 2] = b <= 0 ? 0 : b >= 255 ? 255 : b | 0;
      }
    },

    createImageData: function PDFImage_createImageData(forceRGBA) {
      var drawWidth = this.drawWidth;
      var drawHeight = this.drawHeight;
      var imgData = { // other fields are filled in below
        width: drawWidth,
        height: drawHeight
      };

      var numComps = this.numComps;
      var originalWidth = this.width;
      var originalHeight = this.height;
      var bpc = this.bpc;

      // Rows start at byte boundary.
      var rowBytes = (originalWidth * numComps * bpc + 7) >> 3;
      var imgArray;

      if (!forceRGBA) {
        // If it is a 1-bit-per-pixel grayscale (i.e. black-and-white) image
        // without any complications, we pass a same-sized copy to the main
        // thread rather than expanding by 32x to RGBA form. This saves *lots*
        // of memory for many scanned documents. It's also much faster.
        //
        // Similarly, if it is a 24-bit-per pixel RGB image without any
        // complications, we avoid expanding by 1.333x to RGBA form.
        var kind;
        if (this.colorSpace.name === 'DeviceGray' && bpc === 1) {
          kind = ImageKind.GRAYSCALE_1BPP;
        } else if (this.colorSpace.name === 'DeviceRGB' && bpc === 8 &&
                   !this.needsDecode) {
          kind = ImageKind.RGB_24BPP;
        }
        if (kind && !this.smask && !this.mask &&
            drawWidth === originalWidth && drawHeight === originalHeight) {
          imgData.kind = kind;

          imgArray = this.getImageBytes(originalHeight * rowBytes);
          // If imgArray came from a DecodeStream, we're safe to transfer it
          // (and thus neuter it) because it will constitute the entire
          // DecodeStream's data.  But if it came from a Stream, we need to
          // copy it because it'll only be a portion of the Stream's data, and
          // the rest will be read later on.
          if (this.image instanceof DecodeStream) {
            imgData.data = imgArray;
          } else {
            var newArray = new Uint8Array(imgArray.length);
            newArray.set(imgArray);
            imgData.data = newArray;
          }
          if (this.needsDecode) {
            // Invert the buffer (which must be grayscale if we reached here).
            assert(kind === ImageKind.GRAYSCALE_1BPP);
            var buffer = imgData.data;
            for (var i = 0, ii = buffer.length; i < ii; i++) {
              buffer[i] ^= 0xff;
            }
          }
          return imgData;
        }
        if (this.image instanceof JpegStream && !this.smask && !this.mask) {
          imgData.kind = ImageKind.RGB_24BPP;
          imgData.data = this.getImageBytes(originalHeight * rowBytes,
                                            drawWidth, drawHeight, true);
          return imgData;
        }
      }

      imgArray = this.getImageBytes(originalHeight * rowBytes);
      // imgArray can be incomplete (e.g. after CCITT fax encoding).
      var actualHeight = 0 | (imgArray.length / rowBytes *
                         drawHeight / originalHeight);

      var comps = this.getComponents(imgArray);

      // If opacity data is present, use RGBA_32BPP form. Otherwise, use the
      // more compact RGB_24BPP form if allowable.
      var alpha01, maybeUndoPreblend;
      if (!forceRGBA && !this.smask && !this.mask) {
        imgData.kind = ImageKind.RGB_24BPP;
        imgData.data = new Uint8Array(drawWidth * drawHeight * 3);
        alpha01 = 0;
        maybeUndoPreblend = false;
      } else {
        imgData.kind = ImageKind.RGBA_32BPP;
        imgData.data = new Uint8Array(drawWidth * drawHeight * 4);
        alpha01 = 1;
        maybeUndoPreblend = true;

        // Color key masking (opacity) must be performed before decoding.
        this.fillOpacity(imgData.data, drawWidth, drawHeight, actualHeight,
                         comps);
      }

      if (this.needsDecode) {
        this.decodeBuffer(comps);
      }
      this.colorSpace.fillRgb(imgData.data, originalWidth, originalHeight,
                              drawWidth, drawHeight, actualHeight, bpc, comps,
                              alpha01);
      if (maybeUndoPreblend) {
        this.undoPreblend(imgData.data, drawWidth, actualHeight);
      }

      return imgData;
    },

    fillGrayBuffer: function PDFImage_fillGrayBuffer(buffer) {
      var numComps = this.numComps;
      if (numComps !== 1) {
        error('Reading gray scale from a color image: ' + numComps);
      }

      var width = this.width;
      var height = this.height;
      var bpc = this.bpc;

      // rows start at byte boundary
      var rowBytes = (width * numComps * bpc + 7) >> 3;
      var imgArray = this.getImageBytes(height * rowBytes);

      var comps = this.getComponents(imgArray);
      var i, length;

      if (bpc === 1) {
        // inline decoding (= inversion) for 1 bpc images
        length = width * height;
        if (this.needsDecode) {
          // invert and scale to {0, 255}
          for (i = 0; i < length; ++i) {
            buffer[i] = (comps[i] - 1) & 255;
          }
        } else {
          // scale to {0, 255}
          for (i = 0; i < length; ++i) {
            buffer[i] = (-comps[i]) & 255;
          }
        }
        return;
      }

      if (this.needsDecode) {
        this.decodeBuffer(comps);
      }
      length = width * height;
      // we aren't using a colorspace so we need to scale the value
      var scale = 255 / ((1 << bpc) - 1);
      for (i = 0; i < length; ++i) {
        buffer[i] = (scale * comps[i]) | 0;
      }
    },

    getImageBytes: function PDFImage_getImageBytes(length,
                                                   drawWidth, drawHeight,
                                                   forceRGB) {
      this.image.reset();
      this.image.drawWidth = drawWidth || this.width;
      this.image.drawHeight = drawHeight || this.height;
      this.image.forceRGB = !!forceRGB;
      return this.image.getBytes(length);
    }
  };
  return PDFImage;
})();


// The Metrics object contains glyph widths (in glyph space units).
// As per PDF spec, for most fonts (Type 3 being an exception) a glyph
// space unit corresponds to 1/1000th of text space unit.
var Metrics = {
  'Courier': 600,
  'Courier-Bold': 600,
  'Courier-BoldOblique': 600,
  'Courier-Oblique': 600,
  'Helvetica' : {
    'space': 278,
    'exclam': 278,
    'quotedbl': 355,
    'numbersign': 556,
    'dollar': 556,
    'percent': 889,
    'ampersand': 667,
    'quoteright': 222,
    'parenleft': 333,
    'parenright': 333,
    'asterisk': 389,
    'plus': 584,
    'comma': 278,
    'hyphen': 333,
    'period': 278,
    'slash': 278,
    'zero': 556,
    'one': 556,
    'two': 556,
    'three': 556,
    'four': 556,
    'five': 556,
    'six': 556,
    'seven': 556,
    'eight': 556,
    'nine': 556,
    'colon': 278,
    'semicolon': 278,
    'less': 584,
    'equal': 584,
    'greater': 584,
    'question': 556,
    'at': 1015,
    'A': 667,
    'B': 667,
    'C': 722,
    'D': 722,
    'E': 667,
    'F': 611,
    'G': 778,
    'H': 722,
    'I': 278,
    'J': 500,
    'K': 667,
    'L': 556,
    'M': 833,
    'N': 722,
    'O': 778,
    'P': 667,
    'Q': 778,
    'R': 722,
    'S': 667,
    'T': 611,
    'U': 722,
    'V': 667,
    'W': 944,
    'X': 667,
    'Y': 667,
    'Z': 611,
    'bracketleft': 278,
    'backslash': 278,
    'bracketright': 278,
    'asciicircum': 469,
    'underscore': 556,
    'quoteleft': 222,
    'a': 556,
    'b': 556,
    'c': 500,
    'd': 556,
    'e': 556,
    'f': 278,
    'g': 556,
    'h': 556,
    'i': 222,
    'j': 222,
    'k': 500,
    'l': 222,
    'm': 833,
    'n': 556,
    'o': 556,
    'p': 556,
    'q': 556,
    'r': 333,
    's': 500,
    't': 278,
    'u': 556,
    'v': 500,
    'w': 722,
    'x': 500,
    'y': 500,
    'z': 500,
    'braceleft': 334,
    'bar': 260,
    'braceright': 334,
    'asciitilde': 584,
    'exclamdown': 333,
    'cent': 556,
    'sterling': 556,
    'fraction': 167,
    'yen': 556,
    'florin': 556,
    'section': 556,
    'currency': 556,
    'quotesingle': 191,
    'quotedblleft': 333,
    'guillemotleft': 556,
    'guilsinglleft': 333,
    'guilsinglright': 333,
    'fi': 500,
    'fl': 500,
    'endash': 556,
    'dagger': 556,
    'daggerdbl': 556,
    'periodcentered': 278,
    'paragraph': 537,
    'bullet': 350,
    'quotesinglbase': 222,
    'quotedblbase': 333,
    'quotedblright': 333,
    'guillemotright': 556,
    'ellipsis': 1000,
    'perthousand': 1000,
    'questiondown': 611,
    'grave': 333,
    'acute': 333,
    'circumflex': 333,
    'tilde': 333,
    'macron': 333,
    'breve': 333,
    'dotaccent': 333,
    'dieresis': 333,
    'ring': 333,
    'cedilla': 333,
    'hungarumlaut': 333,
    'ogonek': 333,
    'caron': 333,
    'emdash': 1000,
    'AE': 1000,
    'ordfeminine': 370,
    'Lslash': 556,
    'Oslash': 778,
    'OE': 1000,
    'ordmasculine': 365,
    'ae': 889,
    'dotlessi': 278,
    'lslash': 222,
    'oslash': 611,
    'oe': 944,
    'germandbls': 611,
    'Idieresis': 278,
    'eacute': 556,
    'abreve': 556,
    'uhungarumlaut': 556,
    'ecaron': 556,
    'Ydieresis': 667,
    'divide': 584,
    'Yacute': 667,
    'Acircumflex': 667,
    'aacute': 556,
    'Ucircumflex': 722,
    'yacute': 500,
    'scommaaccent': 500,
    'ecircumflex': 556,
    'Uring': 722,
    'Udieresis': 722,
    'aogonek': 556,
    'Uacute': 722,
    'uogonek': 556,
    'Edieresis': 667,
    'Dcroat': 722,
    'commaaccent': 250,
    'copyright': 737,
    'Emacron': 667,
    'ccaron': 500,
    'aring': 556,
    'Ncommaaccent': 722,
    'lacute': 222,
    'agrave': 556,
    'Tcommaaccent': 611,
    'Cacute': 722,
    'atilde': 556,
    'Edotaccent': 667,
    'scaron': 500,
    'scedilla': 500,
    'iacute': 278,
    'lozenge': 471,
    'Rcaron': 722,
    'Gcommaaccent': 778,
    'ucircumflex': 556,
    'acircumflex': 556,
    'Amacron': 667,
    'rcaron': 333,
    'ccedilla': 500,
    'Zdotaccent': 611,
    'Thorn': 667,
    'Omacron': 778,
    'Racute': 722,
    'Sacute': 667,
    'dcaron': 643,
    'Umacron': 722,
    'uring': 556,
    'threesuperior': 333,
    'Ograve': 778,
    'Agrave': 667,
    'Abreve': 667,
    'multiply': 584,
    'uacute': 556,
    'Tcaron': 611,
    'partialdiff': 476,
    'ydieresis': 500,
    'Nacute': 722,
    'icircumflex': 278,
    'Ecircumflex': 667,
    'adieresis': 556,
    'edieresis': 556,
    'cacute': 500,
    'nacute': 556,
    'umacron': 556,
    'Ncaron': 722,
    'Iacute': 278,
    'plusminus': 584,
    'brokenbar': 260,
    'registered': 737,
    'Gbreve': 778,
    'Idotaccent': 278,
    'summation': 600,
    'Egrave': 667,
    'racute': 333,
    'omacron': 556,
    'Zacute': 611,
    'Zcaron': 611,
    'greaterequal': 549,
    'Eth': 722,
    'Ccedilla': 722,
    'lcommaaccent': 222,
    'tcaron': 317,
    'eogonek': 556,
    'Uogonek': 722,
    'Aacute': 667,
    'Adieresis': 667,
    'egrave': 556,
    'zacute': 500,
    'iogonek': 222,
    'Oacute': 778,
    'oacute': 556,
    'amacron': 556,
    'sacute': 500,
    'idieresis': 278,
    'Ocircumflex': 778,
    'Ugrave': 722,
    'Delta': 612,
    'thorn': 556,
    'twosuperior': 333,
    'Odieresis': 778,
    'mu': 556,
    'igrave': 278,
    'ohungarumlaut': 556,
    'Eogonek': 667,
    'dcroat': 556,
    'threequarters': 834,
    'Scedilla': 667,
    'lcaron': 299,
    'Kcommaaccent': 667,
    'Lacute': 556,
    'trademark': 1000,
    'edotaccent': 556,
    'Igrave': 278,
    'Imacron': 278,
    'Lcaron': 556,
    'onehalf': 834,
    'lessequal': 549,
    'ocircumflex': 556,
    'ntilde': 556,
    'Uhungarumlaut': 722,
    'Eacute': 667,
    'emacron': 556,
    'gbreve': 556,
    'onequarter': 834,
    'Scaron': 667,
    'Scommaaccent': 667,
    'Ohungarumlaut': 778,
    'degree': 400,
    'ograve': 556,
    'Ccaron': 722,
    'ugrave': 556,
    'radical': 453,
    'Dcaron': 722,
    'rcommaaccent': 333,
    'Ntilde': 722,
    'otilde': 556,
    'Rcommaaccent': 722,
    'Lcommaaccent': 556,
    'Atilde': 667,
    'Aogonek': 667,
    'Aring': 667,
    'Otilde': 778,
    'zdotaccent': 500,
    'Ecaron': 667,
    'Iogonek': 278,
    'kcommaaccent': 500,
    'minus': 584,
    'Icircumflex': 278,
    'ncaron': 556,
    'tcommaaccent': 278,
    'logicalnot': 584,
    'odieresis': 556,
    'udieresis': 556,
    'notequal': 549,
    'gcommaaccent': 556,
    'eth': 556,
    'zcaron': 500,
    'ncommaaccent': 556,
    'onesuperior': 333,
    'imacron': 278,
    'Euro': 556
  },
  'Helvetica-Bold': {
    'space': 278,
    'exclam': 333,
    'quotedbl': 474,
    'numbersign': 556,
    'dollar': 556,
    'percent': 889,
    'ampersand': 722,
    'quoteright': 278,
    'parenleft': 333,
    'parenright': 333,
    'asterisk': 389,
    'plus': 584,
    'comma': 278,
    'hyphen': 333,
    'period': 278,
    'slash': 278,
    'zero': 556,
    'one': 556,
    'two': 556,
    'three': 556,
    'four': 556,
    'five': 556,
    'six': 556,
    'seven': 556,
    'eight': 556,
    'nine': 556,
    'colon': 333,
    'semicolon': 333,
    'less': 584,
    'equal': 584,
    'greater': 584,
    'question': 611,
    'at': 975,
    'A': 722,
    'B': 722,
    'C': 722,
    'D': 722,
    'E': 667,
    'F': 611,
    'G': 778,
    'H': 722,
    'I': 278,
    'J': 556,
    'K': 722,
    'L': 611,
    'M': 833,
    'N': 722,
    'O': 778,
    'P': 667,
    'Q': 778,
    'R': 722,
    'S': 667,
    'T': 611,
    'U': 722,
    'V': 667,
    'W': 944,
    'X': 667,
    'Y': 667,
    'Z': 611,
    'bracketleft': 333,
    'backslash': 278,
    'bracketright': 333,
    'asciicircum': 584,
    'underscore': 556,
    'quoteleft': 278,
    'a': 556,
    'b': 611,
    'c': 556,
    'd': 611,
    'e': 556,
    'f': 333,
    'g': 611,
    'h': 611,
    'i': 278,
    'j': 278,
    'k': 556,
    'l': 278,
    'm': 889,
    'n': 611,
    'o': 611,
    'p': 611,
    'q': 611,
    'r': 389,
    's': 556,
    't': 333,
    'u': 611,
    'v': 556,
    'w': 778,
    'x': 556,
    'y': 556,
    'z': 500,
    'braceleft': 389,
    'bar': 280,
    'braceright': 389,
    'asciitilde': 584,
    'exclamdown': 333,
    'cent': 556,
    'sterling': 556,
    'fraction': 167,
    'yen': 556,
    'florin': 556,
    'section': 556,
    'currency': 556,
    'quotesingle': 238,
    'quotedblleft': 500,
    'guillemotleft': 556,
    'guilsinglleft': 333,
    'guilsinglright': 333,
    'fi': 611,
    'fl': 611,
    'endash': 556,
    'dagger': 556,
    'daggerdbl': 556,
    'periodcentered': 278,
    'paragraph': 556,
    'bullet': 350,
    'quotesinglbase': 278,
    'quotedblbase': 500,
    'quotedblright': 500,
    'guillemotright': 556,
    'ellipsis': 1000,
    'perthousand': 1000,
    'questiondown': 611,
    'grave': 333,
    'acute': 333,
    'circumflex': 333,
    'tilde': 333,
    'macron': 333,
    'breve': 333,
    'dotaccent': 333,
    'dieresis': 333,
    'ring': 333,
    'cedilla': 333,
    'hungarumlaut': 333,
    'ogonek': 333,
    'caron': 333,
    'emdash': 1000,
    'AE': 1000,
    'ordfeminine': 370,
    'Lslash': 611,
    'Oslash': 778,
    'OE': 1000,
    'ordmasculine': 365,
    'ae': 889,
    'dotlessi': 278,
    'lslash': 278,
    'oslash': 611,
    'oe': 944,
    'germandbls': 611,
    'Idieresis': 278,
    'eacute': 556,
    'abreve': 556,
    'uhungarumlaut': 611,
    'ecaron': 556,
    'Ydieresis': 667,
    'divide': 584,
    'Yacute': 667,
    'Acircumflex': 722,
    'aacute': 556,
    'Ucircumflex': 722,
    'yacute': 556,
    'scommaaccent': 556,
    'ecircumflex': 556,
    'Uring': 722,
    'Udieresis': 722,
    'aogonek': 556,
    'Uacute': 722,
    'uogonek': 611,
    'Edieresis': 667,
    'Dcroat': 722,
    'commaaccent': 250,
    'copyright': 737,
    'Emacron': 667,
    'ccaron': 556,
    'aring': 556,
    'Ncommaaccent': 722,
    'lacute': 278,
    'agrave': 556,
    'Tcommaaccent': 611,
    'Cacute': 722,
    'atilde': 556,
    'Edotaccent': 667,
    'scaron': 556,
    'scedilla': 556,
    'iacute': 278,
    'lozenge': 494,
    'Rcaron': 722,
    'Gcommaaccent': 778,
    'ucircumflex': 611,
    'acircumflex': 556,
    'Amacron': 722,
    'rcaron': 389,
    'ccedilla': 556,
    'Zdotaccent': 611,
    'Thorn': 667,
    'Omacron': 778,
    'Racute': 722,
    'Sacute': 667,
    'dcaron': 743,
    'Umacron': 722,
    'uring': 611,
    'threesuperior': 333,
    'Ograve': 778,
    'Agrave': 722,
    'Abreve': 722,
    'multiply': 584,
    'uacute': 611,
    'Tcaron': 611,
    'partialdiff': 494,
    'ydieresis': 556,
    'Nacute': 722,
    'icircumflex': 278,
    'Ecircumflex': 667,
    'adieresis': 556,
    'edieresis': 556,
    'cacute': 556,
    'nacute': 611,
    'umacron': 611,
    'Ncaron': 722,
    'Iacute': 278,
    'plusminus': 584,
    'brokenbar': 280,
    'registered': 737,
    'Gbreve': 778,
    'Idotaccent': 278,
    'summation': 600,
    'Egrave': 667,
    'racute': 389,
    'omacron': 611,
    'Zacute': 611,
    'Zcaron': 611,
    'greaterequal': 549,
    'Eth': 722,
    'Ccedilla': 722,
    'lcommaaccent': 278,
    'tcaron': 389,
    'eogonek': 556,
    'Uogonek': 722,
    'Aacute': 722,
    'Adieresis': 722,
    'egrave': 556,
    'zacute': 500,
    'iogonek': 278,
    'Oacute': 778,
    'oacute': 611,
    'amacron': 556,
    'sacute': 556,
    'idieresis': 278,
    'Ocircumflex': 778,
    'Ugrave': 722,
    'Delta': 612,
    'thorn': 611,
    'twosuperior': 333,
    'Odieresis': 778,
    'mu': 611,
    'igrave': 278,
    'ohungarumlaut': 611,
    'Eogonek': 667,
    'dcroat': 611,
    'threequarters': 834,
    'Scedilla': 667,
    'lcaron': 400,
    'Kcommaaccent': 722,
    'Lacute': 611,
    'trademark': 1000,
    'edotaccent': 556,
    'Igrave': 278,
    'Imacron': 278,
    'Lcaron': 611,
    'onehalf': 834,
    'lessequal': 549,
    'ocircumflex': 611,
    'ntilde': 611,
    'Uhungarumlaut': 722,
    'Eacute': 667,
    'emacron': 556,
    'gbreve': 611,
    'onequarter': 834,
    'Scaron': 667,
    'Scommaaccent': 667,
    'Ohungarumlaut': 778,
    'degree': 400,
    'ograve': 611,
    'Ccaron': 722,
    'ugrave': 611,
    'radical': 549,
    'Dcaron': 722,
    'rcommaaccent': 389,
    'Ntilde': 722,
    'otilde': 611,
    'Rcommaaccent': 722,
    'Lcommaaccent': 611,
    'Atilde': 722,
    'Aogonek': 722,
    'Aring': 722,
    'Otilde': 778,
    'zdotaccent': 500,
    'Ecaron': 667,
    'Iogonek': 278,
    'kcommaaccent': 556,
    'minus': 584,
    'Icircumflex': 278,
    'ncaron': 611,
    'tcommaaccent': 333,
    'logicalnot': 584,
    'odieresis': 611,
    'udieresis': 611,
    'notequal': 549,
    'gcommaaccent': 611,
    'eth': 611,
    'zcaron': 500,
    'ncommaaccent': 611,
    'onesuperior': 333,
    'imacron': 278,
    'Euro': 556
  },
  'Helvetica-BoldOblique': {
    'space': 278,
    'exclam': 333,
    'quotedbl': 474,
    'numbersign': 556,
    'dollar': 556,
    'percent': 889,
    'ampersand': 722,
    'quoteright': 278,
    'parenleft': 333,
    'parenright': 333,
    'asterisk': 389,
    'plus': 584,
    'comma': 278,
    'hyphen': 333,
    'period': 278,
    'slash': 278,
    'zero': 556,
    'one': 556,
    'two': 556,
    'three': 556,
    'four': 556,
    'five': 556,
    'six': 556,
    'seven': 556,
    'eight': 556,
    'nine': 556,
    'colon': 333,
    'semicolon': 333,
    'less': 584,
    'equal': 584,
    'greater': 584,
    'question': 611,
    'at': 975,
    'A': 722,
    'B': 722,
    'C': 722,
    'D': 722,
    'E': 667,
    'F': 611,
    'G': 778,
    'H': 722,
    'I': 278,
    'J': 556,
    'K': 722,
    'L': 611,
    'M': 833,
    'N': 722,
    'O': 778,
    'P': 667,
    'Q': 778,
    'R': 722,
    'S': 667,
    'T': 611,
    'U': 722,
    'V': 667,
    'W': 944,
    'X': 667,
    'Y': 667,
    'Z': 611,
    'bracketleft': 333,
    'backslash': 278,
    'bracketright': 333,
    'asciicircum': 584,
    'underscore': 556,
    'quoteleft': 278,
    'a': 556,
    'b': 611,
    'c': 556,
    'd': 611,
    'e': 556,
    'f': 333,
    'g': 611,
    'h': 611,
    'i': 278,
    'j': 278,
    'k': 556,
    'l': 278,
    'm': 889,
    'n': 611,
    'o': 611,
    'p': 611,
    'q': 611,
    'r': 389,
    's': 556,
    't': 333,
    'u': 611,
    'v': 556,
    'w': 778,
    'x': 556,
    'y': 556,
    'z': 500,
    'braceleft': 389,
    'bar': 280,
    'braceright': 389,
    'asciitilde': 584,
    'exclamdown': 333,
    'cent': 556,
    'sterling': 556,
    'fraction': 167,
    'yen': 556,
    'florin': 556,
    'section': 556,
    'currency': 556,
    'quotesingle': 238,
    'quotedblleft': 500,
    'guillemotleft': 556,
    'guilsinglleft': 333,
    'guilsinglright': 333,
    'fi': 611,
    'fl': 611,
    'endash': 556,
    'dagger': 556,
    'daggerdbl': 556,
    'periodcentered': 278,
    'paragraph': 556,
    'bullet': 350,
    'quotesinglbase': 278,
    'quotedblbase': 500,
    'quotedblright': 500,
    'guillemotright': 556,
    'ellipsis': 1000,
    'perthousand': 1000,
    'questiondown': 611,
    'grave': 333,
    'acute': 333,
    'circumflex': 333,
    'tilde': 333,
    'macron': 333,
    'breve': 333,
    'dotaccent': 333,
    'dieresis': 333,
    'ring': 333,
    'cedilla': 333,
    'hungarumlaut': 333,
    'ogonek': 333,
    'caron': 333,
    'emdash': 1000,
    'AE': 1000,
    'ordfeminine': 370,
    'Lslash': 611,
    'Oslash': 778,
    'OE': 1000,
    'ordmasculine': 365,
    'ae': 889,
    'dotlessi': 278,
    'lslash': 278,
    'oslash': 611,
    'oe': 944,
    'germandbls': 611,
    'Idieresis': 278,
    'eacute': 556,
    'abreve': 556,
    'uhungarumlaut': 611,
    'ecaron': 556,
    'Ydieresis': 667,
    'divide': 584,
    'Yacute': 667,
    'Acircumflex': 722,
    'aacute': 556,
    'Ucircumflex': 722,
    'yacute': 556,
    'scommaaccent': 556,
    'ecircumflex': 556,
    'Uring': 722,
    'Udieresis': 722,
    'aogonek': 556,
    'Uacute': 722,
    'uogonek': 611,
    'Edieresis': 667,
    'Dcroat': 722,
    'commaaccent': 250,
    'copyright': 737,
    'Emacron': 667,
    'ccaron': 556,
    'aring': 556,
    'Ncommaaccent': 722,
    'lacute': 278,
    'agrave': 556,
    'Tcommaaccent': 611,
    'Cacute': 722,
    'atilde': 556,
    'Edotaccent': 667,
    'scaron': 556,
    'scedilla': 556,
    'iacute': 278,
    'lozenge': 494,
    'Rcaron': 722,
    'Gcommaaccent': 778,
    'ucircumflex': 611,
    'acircumflex': 556,
    'Amacron': 722,
    'rcaron': 389,
    'ccedilla': 556,
    'Zdotaccent': 611,
    'Thorn': 667,
    'Omacron': 778,
    'Racute': 722,
    'Sacute': 667,
    'dcaron': 743,
    'Umacron': 722,
    'uring': 611,
    'threesuperior': 333,
    'Ograve': 778,
    'Agrave': 722,
    'Abreve': 722,
    'multiply': 584,
    'uacute': 611,
    'Tcaron': 611,
    'partialdiff': 494,
    'ydieresis': 556,
    'Nacute': 722,
    'icircumflex': 278,
    'Ecircumflex': 667,
    'adieresis': 556,
    'edieresis': 556,
    'cacute': 556,
    'nacute': 611,
    'umacron': 611,
    'Ncaron': 722,
    'Iacute': 278,
    'plusminus': 584,
    'brokenbar': 280,
    'registered': 737,
    'Gbreve': 778,
    'Idotaccent': 278,
    'summation': 600,
    'Egrave': 667,
    'racute': 389,
    'omacron': 611,
    'Zacute': 611,
    'Zcaron': 611,
    'greaterequal': 549,
    'Eth': 722,
    'Ccedilla': 722,
    'lcommaaccent': 278,
    'tcaron': 389,
    'eogonek': 556,
    'Uogonek': 722,
    'Aacute': 722,
    'Adieresis': 722,
    'egrave': 556,
    'zacute': 500,
    'iogonek': 278,
    'Oacute': 778,
    'oacute': 611,
    'amacron': 556,
    'sacute': 556,
    'idieresis': 278,
    'Ocircumflex': 778,
    'Ugrave': 722,
    'Delta': 612,
    'thorn': 611,
    'twosuperior': 333,
    'Odieresis': 778,
    'mu': 611,
    'igrave': 278,
    'ohungarumlaut': 611,
    'Eogonek': 667,
    'dcroat': 611,
    'threequarters': 834,
    'Scedilla': 667,
    'lcaron': 400,
    'Kcommaaccent': 722,
    'Lacute': 611,
    'trademark': 1000,
    'edotaccent': 556,
    'Igrave': 278,
    'Imacron': 278,
    'Lcaron': 611,
    'onehalf': 834,
    'lessequal': 549,
    'ocircumflex': 611,
    'ntilde': 611,
    'Uhungarumlaut': 722,
    'Eacute': 667,
    'emacron': 556,
    'gbreve': 611,
    'onequarter': 834,
    'Scaron': 667,
    'Scommaaccent': 667,
    'Ohungarumlaut': 778,
    'degree': 400,
    'ograve': 611,
    'Ccaron': 722,
    'ugrave': 611,
    'radical': 549,
    'Dcaron': 722,
    'rcommaaccent': 389,
    'Ntilde': 722,
    'otilde': 611,
    'Rcommaaccent': 722,
    'Lcommaaccent': 611,
    'Atilde': 722,
    'Aogonek': 722,
    'Aring': 722,
    'Otilde': 778,
    'zdotaccent': 500,
    'Ecaron': 667,
    'Iogonek': 278,
    'kcommaaccent': 556,
    'minus': 584,
    'Icircumflex': 278,
    'ncaron': 611,
    'tcommaaccent': 333,
    'logicalnot': 584,
    'odieresis': 611,
    'udieresis': 611,
    'notequal': 549,
    'gcommaaccent': 611,
    'eth': 611,
    'zcaron': 500,
    'ncommaaccent': 611,
    'onesuperior': 333,
    'imacron': 278,
    'Euro': 556
  },
  'Helvetica-Oblique' : {
    'space': 278,
    'exclam': 278,
    'quotedbl': 355,
    'numbersign':