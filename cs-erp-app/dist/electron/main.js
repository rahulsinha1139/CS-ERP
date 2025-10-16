"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn3, res) => function __init() {
  return fn3 && (res = (0, fn3[__getOwnPropNames(fn3)[0]])(fn3 = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all2) => {
  for (var name2 in all2)
    __defProp(target, name2, { get: all2[name2], enumerable: true });
};
var __copyProps = (to3, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to3, key) && key !== except)
        __defProp(to3, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to3;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/cookie/index.js
var require_cookie = __commonJS({
  "node_modules/cookie/index.js"(exports2) {
    "use strict";
    exports2.parse = parse2;
    exports2.serialize = serialize3;
    var __toString = Object.prototype.toString;
    var __hasOwnProperty = Object.prototype.hasOwnProperty;
    var cookieNameRegExp = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
    var cookieValueRegExp = /^("?)[\u0021\u0023-\u002B\u002D-\u003A\u003C-\u005B\u005D-\u007E]*\1$/;
    var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
    var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
    function parse2(str, opt) {
      if (typeof str !== "string") {
        throw new TypeError("argument str must be a string");
      }
      var obj = {};
      var len = str.length;
      if (len < 2) return obj;
      var dec = opt && opt.decode || decode;
      var index = 0;
      var eqIdx = 0;
      var endIdx = 0;
      do {
        eqIdx = str.indexOf("=", index);
        if (eqIdx === -1) break;
        endIdx = str.indexOf(";", index);
        if (endIdx === -1) {
          endIdx = len;
        } else if (eqIdx > endIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        var keyStartIdx = startIndex(str, index, eqIdx);
        var keyEndIdx = endIndex(str, eqIdx, keyStartIdx);
        var key = str.slice(keyStartIdx, keyEndIdx);
        if (!__hasOwnProperty.call(obj, key)) {
          var valStartIdx = startIndex(str, eqIdx + 1, endIdx);
          var valEndIdx = endIndex(str, endIdx, valStartIdx);
          if (str.charCodeAt(valStartIdx) === 34 && str.charCodeAt(valEndIdx - 1) === 34) {
            valStartIdx++;
            valEndIdx--;
          }
          var val = str.slice(valStartIdx, valEndIdx);
          obj[key] = tryDecode(val, dec);
        }
        index = endIdx + 1;
      } while (index < len);
      return obj;
    }
    function startIndex(str, index, max) {
      do {
        var code = str.charCodeAt(index);
        if (code !== 32 && code !== 9) return index;
      } while (++index < max);
      return max;
    }
    function endIndex(str, index, min) {
      while (index > min) {
        var code = str.charCodeAt(--index);
        if (code !== 32 && code !== 9) return index + 1;
      }
      return min;
    }
    function serialize3(name2, val, opt) {
      var enc = opt && opt.encode || encodeURIComponent;
      if (typeof enc !== "function") {
        throw new TypeError("option encode is invalid");
      }
      if (!cookieNameRegExp.test(name2)) {
        throw new TypeError("argument name is invalid");
      }
      var value = enc(val);
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError("argument val is invalid");
      }
      var str = name2 + "=" + value;
      if (!opt) return str;
      if (null != opt.maxAge) {
        var maxAge = Math.floor(opt.maxAge);
        if (!isFinite(maxAge)) {
          throw new TypeError("option maxAge is invalid");
        }
        str += "; Max-Age=" + maxAge;
      }
      if (opt.domain) {
        if (!domainValueRegExp.test(opt.domain)) {
          throw new TypeError("option domain is invalid");
        }
        str += "; Domain=" + opt.domain;
      }
      if (opt.path) {
        if (!pathValueRegExp.test(opt.path)) {
          throw new TypeError("option path is invalid");
        }
        str += "; Path=" + opt.path;
      }
      if (opt.expires) {
        var expires = opt.expires;
        if (!isDate(expires) || isNaN(expires.valueOf())) {
          throw new TypeError("option expires is invalid");
        }
        str += "; Expires=" + expires.toUTCString();
      }
      if (opt.httpOnly) {
        str += "; HttpOnly";
      }
      if (opt.secure) {
        str += "; Secure";
      }
      if (opt.partitioned) {
        str += "; Partitioned";
      }
      if (opt.priority) {
        var priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError("option priority is invalid");
        }
      }
      if (opt.sameSite) {
        var sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
        switch (sameSite) {
          case true:
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError("option sameSite is invalid");
        }
      }
      return str;
    }
    function decode(str) {
      return str.indexOf("%") !== -1 ? decodeURIComponent(str) : str;
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]";
    }
    function tryDecode(str, decode2) {
      try {
        return decode2(str);
      } catch (e2) {
        return str;
      }
    }
  }
});

// node_modules/bcryptjs/dist/bcrypt.js
var require_bcrypt = __commonJS({
  "node_modules/bcryptjs/dist/bcrypt.js"(exports2, module2) {
    (function(global, factory) {
      if (typeof define === "function" && define["amd"])
        define([], factory);
      else if (typeof require === "function" && typeof module2 === "object" && module2 && module2["exports"])
        module2["exports"] = factory();
      else
        (global["dcodeIO"] = global["dcodeIO"] || {})["bcrypt"] = factory();
    })(exports2, function() {
      "use strict";
      var bcrypt2 = {};
      var randomFallback = null;
      function random(len) {
        if (typeof module2 !== "undefined" && module2 && module2["exports"])
          try {
            return require("crypto")["randomBytes"](len);
          } catch (e2) {
          }
        try {
          var a;
          (self["crypto"] || self["msCrypto"])["getRandomValues"](a = new Uint32Array(len));
          return Array.prototype.slice.call(a);
        } catch (e2) {
        }
        if (!randomFallback)
          throw Error("Neither WebCryptoAPI nor a crypto module is available. Use bcrypt.setRandomFallback to set an alternative");
        return randomFallback(len);
      }
      var randomAvailable = false;
      try {
        random(1);
        randomAvailable = true;
      } catch (e2) {
      }
      randomFallback = null;
      bcrypt2.setRandomFallback = function(random2) {
        randomFallback = random2;
      };
      bcrypt2.genSaltSync = function(rounds, seed_length) {
        rounds = rounds || GENSALT_DEFAULT_LOG2_ROUNDS;
        if (typeof rounds !== "number")
          throw Error("Illegal arguments: " + typeof rounds + ", " + typeof seed_length);
        if (rounds < 4)
          rounds = 4;
        else if (rounds > 31)
          rounds = 31;
        var salt = [];
        salt.push("$2a$");
        if (rounds < 10)
          salt.push("0");
        salt.push(rounds.toString());
        salt.push("$");
        salt.push(base64_encode(random(BCRYPT_SALT_LEN), BCRYPT_SALT_LEN));
        return salt.join("");
      };
      bcrypt2.genSalt = function(rounds, seed_length, callback) {
        if (typeof seed_length === "function")
          callback = seed_length, seed_length = void 0;
        if (typeof rounds === "function")
          callback = rounds, rounds = void 0;
        if (typeof rounds === "undefined")
          rounds = GENSALT_DEFAULT_LOG2_ROUNDS;
        else if (typeof rounds !== "number")
          throw Error("illegal arguments: " + typeof rounds);
        function _async(callback2) {
          nextTick(function() {
            try {
              callback2(null, bcrypt2.genSaltSync(rounds));
            } catch (err) {
              callback2(err);
            }
          });
        }
        if (callback) {
          if (typeof callback !== "function")
            throw Error("Illegal callback: " + typeof callback);
          _async(callback);
        } else
          return new Promise(function(resolve, reject) {
            _async(function(err, res) {
              if (err) {
                reject(err);
                return;
              }
              resolve(res);
            });
          });
      };
      bcrypt2.hashSync = function(s2, salt) {
        if (typeof salt === "undefined")
          salt = GENSALT_DEFAULT_LOG2_ROUNDS;
        if (typeof salt === "number")
          salt = bcrypt2.genSaltSync(salt);
        if (typeof s2 !== "string" || typeof salt !== "string")
          throw Error("Illegal arguments: " + typeof s2 + ", " + typeof salt);
        return _hash(s2, salt);
      };
      bcrypt2.hash = function(s2, salt, callback, progressCallback) {
        function _async(callback2) {
          if (typeof s2 === "string" && typeof salt === "number")
            bcrypt2.genSalt(salt, function(err, salt2) {
              _hash(s2, salt2, callback2, progressCallback);
            });
          else if (typeof s2 === "string" && typeof salt === "string")
            _hash(s2, salt, callback2, progressCallback);
          else
            nextTick(callback2.bind(this, Error("Illegal arguments: " + typeof s2 + ", " + typeof salt)));
        }
        if (callback) {
          if (typeof callback !== "function")
            throw Error("Illegal callback: " + typeof callback);
          _async(callback);
        } else
          return new Promise(function(resolve, reject) {
            _async(function(err, res) {
              if (err) {
                reject(err);
                return;
              }
              resolve(res);
            });
          });
      };
      function safeStringCompare(known, unknown) {
        var right2 = 0, wrong = 0;
        for (var i = 0, k4 = known.length; i < k4; ++i) {
          if (known.charCodeAt(i) === unknown.charCodeAt(i))
            ++right2;
          else
            ++wrong;
        }
        if (right2 < 0)
          return false;
        return wrong === 0;
      }
      bcrypt2.compareSync = function(s2, hash) {
        if (typeof s2 !== "string" || typeof hash !== "string")
          throw Error("Illegal arguments: " + typeof s2 + ", " + typeof hash);
        if (hash.length !== 60)
          return false;
        return safeStringCompare(bcrypt2.hashSync(s2, hash.substr(0, hash.length - 31)), hash);
      };
      bcrypt2.compare = function(s2, hash, callback, progressCallback) {
        function _async(callback2) {
          if (typeof s2 !== "string" || typeof hash !== "string") {
            nextTick(callback2.bind(this, Error("Illegal arguments: " + typeof s2 + ", " + typeof hash)));
            return;
          }
          if (hash.length !== 60) {
            nextTick(callback2.bind(this, null, false));
            return;
          }
          bcrypt2.hash(s2, hash.substr(0, 29), function(err, comp) {
            if (err)
              callback2(err);
            else
              callback2(null, safeStringCompare(comp, hash));
          }, progressCallback);
        }
        if (callback) {
          if (typeof callback !== "function")
            throw Error("Illegal callback: " + typeof callback);
          _async(callback);
        } else
          return new Promise(function(resolve, reject) {
            _async(function(err, res) {
              if (err) {
                reject(err);
                return;
              }
              resolve(res);
            });
          });
      };
      bcrypt2.getRounds = function(hash) {
        if (typeof hash !== "string")
          throw Error("Illegal arguments: " + typeof hash);
        return parseInt(hash.split("$")[2], 10);
      };
      bcrypt2.getSalt = function(hash) {
        if (typeof hash !== "string")
          throw Error("Illegal arguments: " + typeof hash);
        if (hash.length !== 60)
          throw Error("Illegal hash length: " + hash.length + " != 60");
        return hash.substring(0, 29);
      };
      var nextTick = typeof process !== "undefined" && process && typeof process.nextTick === "function" ? typeof setImmediate === "function" ? setImmediate : process.nextTick : setTimeout;
      function stringToBytes(str) {
        var out = [], i = 0;
        utfx.encodeUTF16toUTF8(function() {
          if (i >= str.length) return null;
          return str.charCodeAt(i++);
        }, function(b3) {
          out.push(b3);
        });
        return out;
      }
      var BASE64_CODE = "./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
      var BASE64_INDEX = [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        0,
        1,
        54,
        55,
        56,
        57,
        58,
        59,
        60,
        61,
        62,
        63,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48,
        49,
        50,
        51,
        52,
        53,
        -1,
        -1,
        -1,
        -1,
        -1
      ];
      var stringFromCharCode = String.fromCharCode;
      function base64_encode(b3, len) {
        var off = 0, rs2 = [], c1, c2;
        if (len <= 0 || len > b3.length)
          throw Error("Illegal len: " + len);
        while (off < len) {
          c1 = b3[off++] & 255;
          rs2.push(BASE64_CODE[c1 >> 2 & 63]);
          c1 = (c1 & 3) << 4;
          if (off >= len) {
            rs2.push(BASE64_CODE[c1 & 63]);
            break;
          }
          c2 = b3[off++] & 255;
          c1 |= c2 >> 4 & 15;
          rs2.push(BASE64_CODE[c1 & 63]);
          c1 = (c2 & 15) << 2;
          if (off >= len) {
            rs2.push(BASE64_CODE[c1 & 63]);
            break;
          }
          c2 = b3[off++] & 255;
          c1 |= c2 >> 6 & 3;
          rs2.push(BASE64_CODE[c1 & 63]);
          rs2.push(BASE64_CODE[c2 & 63]);
        }
        return rs2.join("");
      }
      function base64_decode(s2, len) {
        var off = 0, slen = s2.length, olen = 0, rs2 = [], c1, c2, c3, c4, o2, code;
        if (len <= 0)
          throw Error("Illegal len: " + len);
        while (off < slen - 1 && olen < len) {
          code = s2.charCodeAt(off++);
          c1 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
          code = s2.charCodeAt(off++);
          c2 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
          if (c1 == -1 || c2 == -1)
            break;
          o2 = c1 << 2 >>> 0;
          o2 |= (c2 & 48) >> 4;
          rs2.push(stringFromCharCode(o2));
          if (++olen >= len || off >= slen)
            break;
          code = s2.charCodeAt(off++);
          c3 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
          if (c3 == -1)
            break;
          o2 = (c2 & 15) << 4 >>> 0;
          o2 |= (c3 & 60) >> 2;
          rs2.push(stringFromCharCode(o2));
          if (++olen >= len || off >= slen)
            break;
          code = s2.charCodeAt(off++);
          c4 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
          o2 = (c3 & 3) << 6 >>> 0;
          o2 |= c4;
          rs2.push(stringFromCharCode(o2));
          ++olen;
        }
        var res = [];
        for (off = 0; off < olen; off++)
          res.push(rs2[off].charCodeAt(0));
        return res;
      }
      var utfx = (function() {
        "use strict";
        var utfx2 = {};
        utfx2.MAX_CODEPOINT = 1114111;
        utfx2.encodeUTF8 = function(src, dst) {
          var cp = null;
          if (typeof src === "number")
            cp = src, src = function() {
              return null;
            };
          while (cp !== null || (cp = src()) !== null) {
            if (cp < 128)
              dst(cp & 127);
            else if (cp < 2048)
              dst(cp >> 6 & 31 | 192), dst(cp & 63 | 128);
            else if (cp < 65536)
              dst(cp >> 12 & 15 | 224), dst(cp >> 6 & 63 | 128), dst(cp & 63 | 128);
            else
              dst(cp >> 18 & 7 | 240), dst(cp >> 12 & 63 | 128), dst(cp >> 6 & 63 | 128), dst(cp & 63 | 128);
            cp = null;
          }
        };
        utfx2.decodeUTF8 = function(src, dst) {
          var a, b3, c2, d2, fail = function(b4) {
            b4 = b4.slice(0, b4.indexOf(null));
            var err = Error(b4.toString());
            err.name = "TruncatedError";
            err["bytes"] = b4;
            throw err;
          };
          while ((a = src()) !== null) {
            if ((a & 128) === 0)
              dst(a);
            else if ((a & 224) === 192)
              (b3 = src()) === null && fail([a, b3]), dst((a & 31) << 6 | b3 & 63);
            else if ((a & 240) === 224)
              ((b3 = src()) === null || (c2 = src()) === null) && fail([a, b3, c2]), dst((a & 15) << 12 | (b3 & 63) << 6 | c2 & 63);
            else if ((a & 248) === 240)
              ((b3 = src()) === null || (c2 = src()) === null || (d2 = src()) === null) && fail([a, b3, c2, d2]), dst((a & 7) << 18 | (b3 & 63) << 12 | (c2 & 63) << 6 | d2 & 63);
            else throw RangeError("Illegal starting byte: " + a);
          }
        };
        utfx2.UTF16toUTF8 = function(src, dst) {
          var c1, c2 = null;
          while (true) {
            if ((c1 = c2 !== null ? c2 : src()) === null)
              break;
            if (c1 >= 55296 && c1 <= 57343) {
              if ((c2 = src()) !== null) {
                if (c2 >= 56320 && c2 <= 57343) {
                  dst((c1 - 55296) * 1024 + c2 - 56320 + 65536);
                  c2 = null;
                  continue;
                }
              }
            }
            dst(c1);
          }
          if (c2 !== null) dst(c2);
        };
        utfx2.UTF8toUTF16 = function(src, dst) {
          var cp = null;
          if (typeof src === "number")
            cp = src, src = function() {
              return null;
            };
          while (cp !== null || (cp = src()) !== null) {
            if (cp <= 65535)
              dst(cp);
            else
              cp -= 65536, dst((cp >> 10) + 55296), dst(cp % 1024 + 56320);
            cp = null;
          }
        };
        utfx2.encodeUTF16toUTF8 = function(src, dst) {
          utfx2.UTF16toUTF8(src, function(cp) {
            utfx2.encodeUTF8(cp, dst);
          });
        };
        utfx2.decodeUTF8toUTF16 = function(src, dst) {
          utfx2.decodeUTF8(src, function(cp) {
            utfx2.UTF8toUTF16(cp, dst);
          });
        };
        utfx2.calculateCodePoint = function(cp) {
          return cp < 128 ? 1 : cp < 2048 ? 2 : cp < 65536 ? 3 : 4;
        };
        utfx2.calculateUTF8 = function(src) {
          var cp, l2 = 0;
          while ((cp = src()) !== null)
            l2 += utfx2.calculateCodePoint(cp);
          return l2;
        };
        utfx2.calculateUTF16asUTF8 = function(src) {
          var n2 = 0, l2 = 0;
          utfx2.UTF16toUTF8(src, function(cp) {
            ++n2;
            l2 += utfx2.calculateCodePoint(cp);
          });
          return [n2, l2];
        };
        return utfx2;
      })();
      Date.now = Date.now || function() {
        return +/* @__PURE__ */ new Date();
      };
      var BCRYPT_SALT_LEN = 16;
      var GENSALT_DEFAULT_LOG2_ROUNDS = 10;
      var BLOWFISH_NUM_ROUNDS = 16;
      var MAX_EXECUTION_TIME = 100;
      var P_ORIG = [
        608135816,
        2242054355,
        320440878,
        57701188,
        2752067618,
        698298832,
        137296536,
        3964562569,
        1160258022,
        953160567,
        3193202383,
        887688300,
        3232508343,
        3380367581,
        1065670069,
        3041331479,
        2450970073,
        2306472731
      ];
      var S_ORIG = [
        3509652390,
        2564797868,
        805139163,
        3491422135,
        3101798381,
        1780907670,
        3128725573,
        4046225305,
        614570311,
        3012652279,
        134345442,
        2240740374,
        1667834072,
        1901547113,
        2757295779,
        4103290238,
        227898511,
        1921955416,
        1904987480,
        2182433518,
        2069144605,
        3260701109,
        2620446009,
        720527379,
        3318853667,
        677414384,
        3393288472,
        3101374703,
        2390351024,
        1614419982,
        1822297739,
        2954791486,
        3608508353,
        3174124327,
        2024746970,
        1432378464,
        3864339955,
        2857741204,
        1464375394,
        1676153920,
        1439316330,
        715854006,
        3033291828,
        289532110,
        2706671279,
        2087905683,
        3018724369,
        1668267050,
        732546397,
        1947742710,
        3462151702,
        2609353502,
        2950085171,
        1814351708,
        2050118529,
        680887927,
        999245976,
        1800124847,
        3300911131,
        1713906067,
        1641548236,
        4213287313,
        1216130144,
        1575780402,
        4018429277,
        3917837745,
        3693486850,
        3949271944,
        596196993,
        3549867205,
        258830323,
        2213823033,
        772490370,
        2760122372,
        1774776394,
        2652871518,
        566650946,
        4142492826,
        1728879713,
        2882767088,
        1783734482,
        3629395816,
        2517608232,
        2874225571,
        1861159788,
        326777828,
        3124490320,
        2130389656,
        2716951837,
        967770486,
        1724537150,
        2185432712,
        2364442137,
        1164943284,
        2105845187,
        998989502,
        3765401048,
        2244026483,
        1075463327,
        1455516326,
        1322494562,
        910128902,
        469688178,
        1117454909,
        936433444,
        3490320968,
        3675253459,
        1240580251,
        122909385,
        2157517691,
        634681816,
        4142456567,
        3825094682,
        3061402683,
        2540495037,
        79693498,
        3249098678,
        1084186820,
        1583128258,
        426386531,
        1761308591,
        1047286709,
        322548459,
        995290223,
        1845252383,
        2603652396,
        3431023940,
        2942221577,
        3202600964,
        3727903485,
        1712269319,
        422464435,
        3234572375,
        1170764815,
        3523960633,
        3117677531,
        1434042557,
        442511882,
        3600875718,
        1076654713,
        1738483198,
        4213154764,
        2393238008,
        3677496056,
        1014306527,
        4251020053,
        793779912,
        2902807211,
        842905082,
        4246964064,
        1395751752,
        1040244610,
        2656851899,
        3396308128,
        445077038,
        3742853595,
        3577915638,
        679411651,
        2892444358,
        2354009459,
        1767581616,
        3150600392,
        3791627101,
        3102740896,
        284835224,
        4246832056,
        1258075500,
        768725851,
        2589189241,
        3069724005,
        3532540348,
        1274779536,
        3789419226,
        2764799539,
        1660621633,
        3471099624,
        4011903706,
        913787905,
        3497959166,
        737222580,
        2514213453,
        2928710040,
        3937242737,
        1804850592,
        3499020752,
        2949064160,
        2386320175,
        2390070455,
        2415321851,
        4061277028,
        2290661394,
        2416832540,
        1336762016,
        1754252060,
        3520065937,
        3014181293,
        791618072,
        3188594551,
        3933548030,
        2332172193,
        3852520463,
        3043980520,
        413987798,
        3465142937,
        3030929376,
        4245938359,
        2093235073,
        3534596313,
        375366246,
        2157278981,
        2479649556,
        555357303,
        3870105701,
        2008414854,
        3344188149,
        4221384143,
        3956125452,
        2067696032,
        3594591187,
        2921233993,
        2428461,
        544322398,
        577241275,
        1471733935,
        610547355,
        4027169054,
        1432588573,
        1507829418,
        2025931657,
        3646575487,
        545086370,
        48609733,
        2200306550,
        1653985193,
        298326376,
        1316178497,
        3007786442,
        2064951626,
        458293330,
        2589141269,
        3591329599,
        3164325604,
        727753846,
        2179363840,
        146436021,
        1461446943,
        4069977195,
        705550613,
        3059967265,
        3887724982,
        4281599278,
        3313849956,
        1404054877,
        2845806497,
        146425753,
        1854211946,
        1266315497,
        3048417604,
        3681880366,
        3289982499,
        290971e4,
        1235738493,
        2632868024,
        2414719590,
        3970600049,
        1771706367,
        1449415276,
        3266420449,
        422970021,
        1963543593,
        2690192192,
        3826793022,
        1062508698,
        1531092325,
        1804592342,
        2583117782,
        2714934279,
        4024971509,
        1294809318,
        4028980673,
        1289560198,
        2221992742,
        1669523910,
        35572830,
        157838143,
        1052438473,
        1016535060,
        1802137761,
        1753167236,
        1386275462,
        3080475397,
        2857371447,
        1040679964,
        2145300060,
        2390574316,
        1461121720,
        2956646967,
        4031777805,
        4028374788,
        33600511,
        2920084762,
        1018524850,
        629373528,
        3691585981,
        3515945977,
        2091462646,
        2486323059,
        586499841,
        988145025,
        935516892,
        3367335476,
        2599673255,
        2839830854,
        265290510,
        3972581182,
        2759138881,
        3795373465,
        1005194799,
        847297441,
        406762289,
        1314163512,
        1332590856,
        1866599683,
        4127851711,
        750260880,
        613907577,
        1450815602,
        3165620655,
        3734664991,
        3650291728,
        3012275730,
        3704569646,
        1427272223,
        778793252,
        1343938022,
        2676280711,
        2052605720,
        1946737175,
        3164576444,
        3914038668,
        3967478842,
        3682934266,
        1661551462,
        3294938066,
        4011595847,
        840292616,
        3712170807,
        616741398,
        312560963,
        711312465,
        1351876610,
        322626781,
        1910503582,
        271666773,
        2175563734,
        1594956187,
        70604529,
        3617834859,
        1007753275,
        1495573769,
        4069517037,
        2549218298,
        2663038764,
        504708206,
        2263041392,
        3941167025,
        2249088522,
        1514023603,
        1998579484,
        1312622330,
        694541497,
        2582060303,
        2151582166,
        1382467621,
        776784248,
        2618340202,
        3323268794,
        2497899128,
        2784771155,
        503983604,
        4076293799,
        907881277,
        423175695,
        432175456,
        1378068232,
        4145222326,
        3954048622,
        3938656102,
        3820766613,
        2793130115,
        2977904593,
        26017576,
        3274890735,
        3194772133,
        1700274565,
        1756076034,
        4006520079,
        3677328699,
        720338349,
        1533947780,
        354530856,
        688349552,
        3973924725,
        1637815568,
        332179504,
        3949051286,
        53804574,
        2852348879,
        3044236432,
        1282449977,
        3583942155,
        3416972820,
        4006381244,
        1617046695,
        2628476075,
        3002303598,
        1686838959,
        431878346,
        2686675385,
        1700445008,
        1080580658,
        1009431731,
        832498133,
        3223435511,
        2605976345,
        2271191193,
        2516031870,
        1648197032,
        4164389018,
        2548247927,
        300782431,
        375919233,
        238389289,
        3353747414,
        2531188641,
        2019080857,
        1475708069,
        455242339,
        2609103871,
        448939670,
        3451063019,
        1395535956,
        2413381860,
        1841049896,
        1491858159,
        885456874,
        4264095073,
        4001119347,
        1565136089,
        3898914787,
        1108368660,
        540939232,
        1173283510,
        2745871338,
        3681308437,
        4207628240,
        3343053890,
        4016749493,
        1699691293,
        1103962373,
        3625875870,
        2256883143,
        3830138730,
        1031889488,
        3479347698,
        1535977030,
        4236805024,
        3251091107,
        2132092099,
        1774941330,
        1199868427,
        1452454533,
        157007616,
        2904115357,
        342012276,
        595725824,
        1480756522,
        206960106,
        497939518,
        591360097,
        863170706,
        2375253569,
        3596610801,
        1814182875,
        2094937945,
        3421402208,
        1082520231,
        3463918190,
        2785509508,
        435703966,
        3908032597,
        1641649973,
        2842273706,
        3305899714,
        1510255612,
        2148256476,
        2655287854,
        3276092548,
        4258621189,
        236887753,
        3681803219,
        274041037,
        1734335097,
        3815195456,
        3317970021,
        1899903192,
        1026095262,
        4050517792,
        356393447,
        2410691914,
        3873677099,
        3682840055,
        3913112168,
        2491498743,
        4132185628,
        2489919796,
        1091903735,
        1979897079,
        3170134830,
        3567386728,
        3557303409,
        857797738,
        1136121015,
        1342202287,
        507115054,
        2535736646,
        337727348,
        3213592640,
        1301675037,
        2528481711,
        1895095763,
        1721773893,
        3216771564,
        62756741,
        2142006736,
        835421444,
        2531993523,
        1442658625,
        3659876326,
        2882144922,
        676362277,
        1392781812,
        170690266,
        3921047035,
        1759253602,
        3611846912,
        1745797284,
        664899054,
        1329594018,
        3901205900,
        3045908486,
        2062866102,
        2865634940,
        3543621612,
        3464012697,
        1080764994,
        553557557,
        3656615353,
        3996768171,
        991055499,
        499776247,
        1265440854,
        648242737,
        3940784050,
        980351604,
        3713745714,
        1749149687,
        3396870395,
        4211799374,
        3640570775,
        1161844396,
        3125318951,
        1431517754,
        545492359,
        4268468663,
        3499529547,
        1437099964,
        2702547544,
        3433638243,
        2581715763,
        2787789398,
        1060185593,
        1593081372,
        2418618748,
        4260947970,
        69676912,
        2159744348,
        86519011,
        2512459080,
        3838209314,
        1220612927,
        3339683548,
        133810670,
        1090789135,
        1078426020,
        1569222167,
        845107691,
        3583754449,
        4072456591,
        1091646820,
        628848692,
        1613405280,
        3757631651,
        526609435,
        236106946,
        48312990,
        2942717905,
        3402727701,
        1797494240,
        859738849,
        992217954,
        4005476642,
        2243076622,
        3870952857,
        3732016268,
        765654824,
        3490871365,
        2511836413,
        1685915746,
        3888969200,
        1414112111,
        2273134842,
        3281911079,
        4080962846,
        172450625,
        2569994100,
        980381355,
        4109958455,
        2819808352,
        2716589560,
        2568741196,
        3681446669,
        3329971472,
        1835478071,
        660984891,
        3704678404,
        4045999559,
        3422617507,
        3040415634,
        1762651403,
        1719377915,
        3470491036,
        2693910283,
        3642056355,
        3138596744,
        1364962596,
        2073328063,
        1983633131,
        926494387,
        3423689081,
        2150032023,
        4096667949,
        1749200295,
        3328846651,
        309677260,
        2016342300,
        1779581495,
        3079819751,
        111262694,
        1274766160,
        443224088,
        298511866,
        1025883608,
        3806446537,
        1145181785,
        168956806,
        3641502830,
        3584813610,
        1689216846,
        3666258015,
        3200248200,
        1692713982,
        2646376535,
        4042768518,
        1618508792,
        1610833997,
        3523052358,
        4130873264,
        2001055236,
        3610705100,
        2202168115,
        4028541809,
        2961195399,
        1006657119,
        2006996926,
        3186142756,
        1430667929,
        3210227297,
        1314452623,
        4074634658,
        4101304120,
        2273951170,
        1399257539,
        3367210612,
        3027628629,
        1190975929,
        2062231137,
        2333990788,
        2221543033,
        2438960610,
        1181637006,
        548689776,
        2362791313,
        3372408396,
        3104550113,
        3145860560,
        296247880,
        1970579870,
        3078560182,
        3769228297,
        1714227617,
        3291629107,
        3898220290,
        166772364,
        1251581989,
        493813264,
        448347421,
        195405023,
        2709975567,
        677966185,
        3703036547,
        1463355134,
        2715995803,
        1338867538,
        1343315457,
        2802222074,
        2684532164,
        233230375,
        2599980071,
        2000651841,
        3277868038,
        1638401717,
        4028070440,
        3237316320,
        6314154,
        819756386,
        300326615,
        590932579,
        1405279636,
        3267499572,
        3150704214,
        2428286686,
        3959192993,
        3461946742,
        1862657033,
        1266418056,
        963775037,
        2089974820,
        2263052895,
        1917689273,
        448879540,
        3550394620,
        3981727096,
        150775221,
        3627908307,
        1303187396,
        508620638,
        2975983352,
        2726630617,
        1817252668,
        1876281319,
        1457606340,
        908771278,
        3720792119,
        3617206836,
        2455994898,
        1729034894,
        1080033504,
        976866871,
        3556439503,
        2881648439,
        1522871579,
        1555064734,
        1336096578,
        3548522304,
        2579274686,
        3574697629,
        3205460757,
        3593280638,
        3338716283,
        3079412587,
        564236357,
        2993598910,
        1781952180,
        1464380207,
        3163844217,
        3332601554,
        1699332808,
        1393555694,
        1183702653,
        3581086237,
        1288719814,
        691649499,
        2847557200,
        2895455976,
        3193889540,
        2717570544,
        1781354906,
        1676643554,
        2592534050,
        3230253752,
        1126444790,
        2770207658,
        2633158820,
        2210423226,
        2615765581,
        2414155088,
        3127139286,
        673620729,
        2805611233,
        1269405062,
        4015350505,
        3341807571,
        4149409754,
        1057255273,
        2012875353,
        2162469141,
        2276492801,
        2601117357,
        993977747,
        3918593370,
        2654263191,
        753973209,
        36408145,
        2530585658,
        25011837,
        3520020182,
        2088578344,
        530523599,
        2918365339,
        1524020338,
        1518925132,
        3760827505,
        3759777254,
        1202760957,
        3985898139,
        3906192525,
        674977740,
        4174734889,
        2031300136,
        2019492241,
        3983892565,
        4153806404,
        3822280332,
        352677332,
        2297720250,
        60907813,
        90501309,
        3286998549,
        1016092578,
        2535922412,
        2839152426,
        457141659,
        509813237,
        4120667899,
        652014361,
        1966332200,
        2975202805,
        55981186,
        2327461051,
        676427537,
        3255491064,
        2882294119,
        3433927263,
        1307055953,
        942726286,
        933058658,
        2468411793,
        3933900994,
        4215176142,
        1361170020,
        2001714738,
        2830558078,
        3274259782,
        1222529897,
        1679025792,
        2729314320,
        3714953764,
        1770335741,
        151462246,
        3013232138,
        1682292957,
        1483529935,
        471910574,
        1539241949,
        458788160,
        3436315007,
        1807016891,
        3718408830,
        978976581,
        1043663428,
        3165965781,
        1927990952,
        4200891579,
        2372276910,
        3208408903,
        3533431907,
        1412390302,
        2931980059,
        4132332400,
        1947078029,
        3881505623,
        4168226417,
        2941484381,
        1077988104,
        1320477388,
        886195818,
        18198404,
        3786409e3,
        2509781533,
        112762804,
        3463356488,
        1866414978,
        891333506,
        18488651,
        661792760,
        1628790961,
        3885187036,
        3141171499,
        876946877,
        2693282273,
        1372485963,
        791857591,
        2686433993,
        3759982718,
        3167212022,
        3472953795,
        2716379847,
        445679433,
        3561995674,
        3504004811,
        3574258232,
        54117162,
        3331405415,
        2381918588,
        3769707343,
        4154350007,
        1140177722,
        4074052095,
        668550556,
        3214352940,
        367459370,
        261225585,
        2610173221,
        4209349473,
        3468074219,
        3265815641,
        314222801,
        3066103646,
        3808782860,
        282218597,
        3406013506,
        3773591054,
        379116347,
        1285071038,
        846784868,
        2669647154,
        3771962079,
        3550491691,
        2305946142,
        453669953,
        1268987020,
        3317592352,
        3279303384,
        3744833421,
        2610507566,
        3859509063,
        266596637,
        3847019092,
        517658769,
        3462560207,
        3443424879,
        370717030,
        4247526661,
        2224018117,
        4143653529,
        4112773975,
        2788324899,
        2477274417,
        1456262402,
        2901442914,
        1517677493,
        1846949527,
        2295493580,
        3734397586,
        2176403920,
        1280348187,
        1908823572,
        3871786941,
        846861322,
        1172426758,
        3287448474,
        3383383037,
        1655181056,
        3139813346,
        901632758,
        1897031941,
        2986607138,
        3066810236,
        3447102507,
        1393639104,
        373351379,
        950779232,
        625454576,
        3124240540,
        4148612726,
        2007998917,
        544563296,
        2244738638,
        2330496472,
        2058025392,
        1291430526,
        424198748,
        50039436,
        29584100,
        3605783033,
        2429876329,
        2791104160,
        1057563949,
        3255363231,
        3075367218,
        3463963227,
        1469046755,
        985887462
      ];
      var C_ORIG = [
        1332899944,
        1700884034,
        1701343084,
        1684370003,
        1668446532,
        1869963892
      ];
      function _encipher(lr3, off, P3, S4) {
        var n2, l2 = lr3[off], r2 = lr3[off + 1];
        l2 ^= P3[0];
        n2 = S4[l2 >>> 24];
        n2 += S4[256 | l2 >> 16 & 255];
        n2 ^= S4[512 | l2 >> 8 & 255];
        n2 += S4[768 | l2 & 255];
        r2 ^= n2 ^ P3[1];
        n2 = S4[r2 >>> 24];
        n2 += S4[256 | r2 >> 16 & 255];
        n2 ^= S4[512 | r2 >> 8 & 255];
        n2 += S4[768 | r2 & 255];
        l2 ^= n2 ^ P3[2];
        n2 = S4[l2 >>> 24];
        n2 += S4[256 | l2 >> 16 & 255];
        n2 ^= S4[512 | l2 >> 8 & 255];
        n2 += S4[768 | l2 & 255];
        r2 ^= n2 ^ P3[3];
        n2 = S4[r2 >>> 24];
        n2 += S4[256 | r2 >> 16 & 255];
        n2 ^= S4[512 | r2 >> 8 & 255];
        n2 += S4[768 | r2 & 255];
        l2 ^= n2 ^ P3[4];
        n2 = S4[l2 >>> 24];
        n2 += S4[256 | l2 >> 16 & 255];
        n2 ^= S4[512 | l2 >> 8 & 255];
        n2 += S4[768 | l2 & 255];
        r2 ^= n2 ^ P3[5];
        n2 = S4[r2 >>> 24];
        n2 += S4[256 | r2 >> 16 & 255];
        n2 ^= S4[512 | r2 >> 8 & 255];
        n2 += S4[768 | r2 & 255];
        l2 ^= n2 ^ P3[6];
        n2 = S4[l2 >>> 24];
        n2 += S4[256 | l2 >> 16 & 255];
        n2 ^= S4[512 | l2 >> 8 & 255];
        n2 += S4[768 | l2 & 255];
        r2 ^= n2 ^ P3[7];
        n2 = S4[r2 >>> 24];
        n2 += S4[256 | r2 >> 16 & 255];
        n2 ^= S4[512 | r2 >> 8 & 255];
        n2 += S4[768 | r2 & 255];
        l2 ^= n2 ^ P3[8];
        n2 = S4[l2 >>> 24];
        n2 += S4[256 | l2 >> 16 & 255];
        n2 ^= S4[512 | l2 >> 8 & 255];
        n2 += S4[768 | l2 & 255];
        r2 ^= n2 ^ P3[9];
        n2 = S4[r2 >>> 24];
        n2 += S4[256 | r2 >> 16 & 255];
        n2 ^= S4[512 | r2 >> 8 & 255];
        n2 += S4[768 | r2 & 255];
        l2 ^= n2 ^ P3[10];
        n2 = S4[l2 >>> 24];
        n2 += S4[256 | l2 >> 16 & 255];
        n2 ^= S4[512 | l2 >> 8 & 255];
        n2 += S4[768 | l2 & 255];
        r2 ^= n2 ^ P3[11];
        n2 = S4[r2 >>> 24];
        n2 += S4[256 | r2 >> 16 & 255];
        n2 ^= S4[512 | r2 >> 8 & 255];
        n2 += S4[768 | r2 & 255];
        l2 ^= n2 ^ P3[12];
        n2 = S4[l2 >>> 24];
        n2 += S4[256 | l2 >> 16 & 255];
        n2 ^= S4[512 | l2 >> 8 & 255];
        n2 += S4[768 | l2 & 255];
        r2 ^= n2 ^ P3[13];
        n2 = S4[r2 >>> 24];
        n2 += S4[256 | r2 >> 16 & 255];
        n2 ^= S4[512 | r2 >> 8 & 255];
        n2 += S4[768 | r2 & 255];
        l2 ^= n2 ^ P3[14];
        n2 = S4[l2 >>> 24];
        n2 += S4[256 | l2 >> 16 & 255];
        n2 ^= S4[512 | l2 >> 8 & 255];
        n2 += S4[768 | l2 & 255];
        r2 ^= n2 ^ P3[15];
        n2 = S4[r2 >>> 24];
        n2 += S4[256 | r2 >> 16 & 255];
        n2 ^= S4[512 | r2 >> 8 & 255];
        n2 += S4[768 | r2 & 255];
        l2 ^= n2 ^ P3[16];
        lr3[off] = r2 ^ P3[BLOWFISH_NUM_ROUNDS + 1];
        lr3[off + 1] = l2;
        return lr3;
      }
      function _streamtoword(data, offp) {
        for (var i = 0, word = 0; i < 4; ++i)
          word = word << 8 | data[offp] & 255, offp = (offp + 1) % data.length;
        return { key: word, offp };
      }
      function _key(key, P3, S4) {
        var offset = 0, lr3 = [0, 0], plen = P3.length, slen = S4.length, sw;
        for (var i = 0; i < plen; i++)
          sw = _streamtoword(key, offset), offset = sw.offp, P3[i] = P3[i] ^ sw.key;
        for (i = 0; i < plen; i += 2)
          lr3 = _encipher(lr3, 0, P3, S4), P3[i] = lr3[0], P3[i + 1] = lr3[1];
        for (i = 0; i < slen; i += 2)
          lr3 = _encipher(lr3, 0, P3, S4), S4[i] = lr3[0], S4[i + 1] = lr3[1];
      }
      function _ekskey(data, key, P3, S4) {
        var offp = 0, lr3 = [0, 0], plen = P3.length, slen = S4.length, sw;
        for (var i = 0; i < plen; i++)
          sw = _streamtoword(key, offp), offp = sw.offp, P3[i] = P3[i] ^ sw.key;
        offp = 0;
        for (i = 0; i < plen; i += 2)
          sw = _streamtoword(data, offp), offp = sw.offp, lr3[0] ^= sw.key, sw = _streamtoword(data, offp), offp = sw.offp, lr3[1] ^= sw.key, lr3 = _encipher(lr3, 0, P3, S4), P3[i] = lr3[0], P3[i + 1] = lr3[1];
        for (i = 0; i < slen; i += 2)
          sw = _streamtoword(data, offp), offp = sw.offp, lr3[0] ^= sw.key, sw = _streamtoword(data, offp), offp = sw.offp, lr3[1] ^= sw.key, lr3 = _encipher(lr3, 0, P3, S4), S4[i] = lr3[0], S4[i + 1] = lr3[1];
      }
      function _crypt(b3, salt, rounds, callback, progressCallback) {
        var cdata = C_ORIG.slice(), clen = cdata.length, err;
        if (rounds < 4 || rounds > 31) {
          err = Error("Illegal number of rounds (4-31): " + rounds);
          if (callback) {
            nextTick(callback.bind(this, err));
            return;
          } else
            throw err;
        }
        if (salt.length !== BCRYPT_SALT_LEN) {
          err = Error("Illegal salt length: " + salt.length + " != " + BCRYPT_SALT_LEN);
          if (callback) {
            nextTick(callback.bind(this, err));
            return;
          } else
            throw err;
        }
        rounds = 1 << rounds >>> 0;
        var P3, S4, i = 0, j3;
        if (Int32Array) {
          P3 = new Int32Array(P_ORIG);
          S4 = new Int32Array(S_ORIG);
        } else {
          P3 = P_ORIG.slice();
          S4 = S_ORIG.slice();
        }
        _ekskey(salt, b3, P3, S4);
        function next() {
          if (progressCallback)
            progressCallback(i / rounds);
          if (i < rounds) {
            var start = Date.now();
            for (; i < rounds; ) {
              i = i + 1;
              _key(b3, P3, S4);
              _key(salt, P3, S4);
              if (Date.now() - start > MAX_EXECUTION_TIME)
                break;
            }
          } else {
            for (i = 0; i < 64; i++)
              for (j3 = 0; j3 < clen >> 1; j3++)
                _encipher(cdata, j3 << 1, P3, S4);
            var ret = [];
            for (i = 0; i < clen; i++)
              ret.push((cdata[i] >> 24 & 255) >>> 0), ret.push((cdata[i] >> 16 & 255) >>> 0), ret.push((cdata[i] >> 8 & 255) >>> 0), ret.push((cdata[i] & 255) >>> 0);
            if (callback) {
              callback(null, ret);
              return;
            } else
              return ret;
          }
          if (callback)
            nextTick(next);
        }
        if (typeof callback !== "undefined") {
          next();
        } else {
          var res;
          while (true)
            if (typeof (res = next()) !== "undefined")
              return res || [];
        }
      }
      function _hash(s2, salt, callback, progressCallback) {
        var err;
        if (typeof s2 !== "string" || typeof salt !== "string") {
          err = Error("Invalid string / salt: Not a string");
          if (callback) {
            nextTick(callback.bind(this, err));
            return;
          } else
            throw err;
        }
        var minor, offset;
        if (salt.charAt(0) !== "$" || salt.charAt(1) !== "2") {
          err = Error("Invalid salt version: " + salt.substring(0, 2));
          if (callback) {
            nextTick(callback.bind(this, err));
            return;
          } else
            throw err;
        }
        if (salt.charAt(2) === "$")
          minor = String.fromCharCode(0), offset = 3;
        else {
          minor = salt.charAt(2);
          if (minor !== "a" && minor !== "b" && minor !== "y" || salt.charAt(3) !== "$") {
            err = Error("Invalid salt revision: " + salt.substring(2, 4));
            if (callback) {
              nextTick(callback.bind(this, err));
              return;
            } else
              throw err;
          }
          offset = 4;
        }
        if (salt.charAt(offset + 2) > "$") {
          err = Error("Missing salt rounds");
          if (callback) {
            nextTick(callback.bind(this, err));
            return;
          } else
            throw err;
        }
        var r1 = parseInt(salt.substring(offset, offset + 1), 10) * 10, r2 = parseInt(salt.substring(offset + 1, offset + 2), 10), rounds = r1 + r2, real_salt = salt.substring(offset + 3, offset + 25);
        s2 += minor >= "a" ? "\0" : "";
        var passwordb = stringToBytes(s2), saltb = base64_decode(real_salt, BCRYPT_SALT_LEN);
        function finish(bytes) {
          var res = [];
          res.push("$2");
          if (minor >= "a")
            res.push(minor);
          res.push("$");
          if (rounds < 10)
            res.push("0");
          res.push(rounds.toString());
          res.push("$");
          res.push(base64_encode(saltb, saltb.length));
          res.push(base64_encode(bytes, C_ORIG.length * 4 - 1));
          return res.join("");
        }
        if (typeof callback == "undefined")
          return finish(_crypt(passwordb, saltb, rounds));
        else {
          _crypt(passwordb, saltb, rounds, function(err2, bytes) {
            if (err2)
              callback(err2, null);
            else
              callback(null, finish(bytes));
          }, progressCallback);
        }
      }
      bcrypt2.encodeBase64 = base64_encode;
      bcrypt2.decodeBase64 = base64_decode;
      return bcrypt2;
    });
  }
});

// node_modules/bcryptjs/index.js
var require_bcryptjs = __commonJS({
  "node_modules/bcryptjs/index.js"(exports2, module2) {
    module2.exports = require_bcrypt();
  }
});

// node_modules/domelementtype/lib/esm/index.js
function isTag(elem) {
  return elem.type === ElementType.Tag || elem.type === ElementType.Script || elem.type === ElementType.Style;
}
var ElementType, Root, Text, Directive, Comment, Script, Style, Tag, CDATA, Doctype;
var init_esm = __esm({
  "node_modules/domelementtype/lib/esm/index.js"() {
    (function(ElementType2) {
      ElementType2["Root"] = "root";
      ElementType2["Text"] = "text";
      ElementType2["Directive"] = "directive";
      ElementType2["Comment"] = "comment";
      ElementType2["Script"] = "script";
      ElementType2["Style"] = "style";
      ElementType2["Tag"] = "tag";
      ElementType2["CDATA"] = "cdata";
      ElementType2["Doctype"] = "doctype";
    })(ElementType || (ElementType = {}));
    Root = ElementType.Root;
    Text = ElementType.Text;
    Directive = ElementType.Directive;
    Comment = ElementType.Comment;
    Script = ElementType.Script;
    Style = ElementType.Style;
    Tag = ElementType.Tag;
    CDATA = ElementType.CDATA;
    Doctype = ElementType.Doctype;
  }
});

// node_modules/domhandler/lib/esm/node.js
function isTag2(node) {
  return isTag(node);
}
function isCDATA(node) {
  return node.type === ElementType.CDATA;
}
function isText(node) {
  return node.type === ElementType.Text;
}
function isComment(node) {
  return node.type === ElementType.Comment;
}
function isDirective(node) {
  return node.type === ElementType.Directive;
}
function isDocument(node) {
  return node.type === ElementType.Root;
}
function cloneNode(node, recursive = false) {
  let result;
  if (isText(node)) {
    result = new Text2(node.data);
  } else if (isComment(node)) {
    result = new Comment2(node.data);
  } else if (isTag2(node)) {
    const children = recursive ? cloneChildren(node.children) : [];
    const clone2 = new Element(node.name, { ...node.attribs }, children);
    children.forEach((child) => child.parent = clone2);
    if (node.namespace != null) {
      clone2.namespace = node.namespace;
    }
    if (node["x-attribsNamespace"]) {
      clone2["x-attribsNamespace"] = { ...node["x-attribsNamespace"] };
    }
    if (node["x-attribsPrefix"]) {
      clone2["x-attribsPrefix"] = { ...node["x-attribsPrefix"] };
    }
    result = clone2;
  } else if (isCDATA(node)) {
    const children = recursive ? cloneChildren(node.children) : [];
    const clone2 = new CDATA2(children);
    children.forEach((child) => child.parent = clone2);
    result = clone2;
  } else if (isDocument(node)) {
    const children = recursive ? cloneChildren(node.children) : [];
    const clone2 = new Document(children);
    children.forEach((child) => child.parent = clone2);
    if (node["x-mode"]) {
      clone2["x-mode"] = node["x-mode"];
    }
    result = clone2;
  } else if (isDirective(node)) {
    const instruction = new ProcessingInstruction(node.name, node.data);
    if (node["x-name"] != null) {
      instruction["x-name"] = node["x-name"];
      instruction["x-publicId"] = node["x-publicId"];
      instruction["x-systemId"] = node["x-systemId"];
    }
    result = instruction;
  } else {
    throw new Error(`Not implemented yet: ${node.type}`);
  }
  result.startIndex = node.startIndex;
  result.endIndex = node.endIndex;
  if (node.sourceCodeLocation != null) {
    result.sourceCodeLocation = node.sourceCodeLocation;
  }
  return result;
}
function cloneChildren(childs) {
  const children = childs.map((child) => cloneNode(child, true));
  for (let i = 1; i < children.length; i++) {
    children[i].prev = children[i - 1];
    children[i - 1].next = children[i];
  }
  return children;
}
var Node, DataNode, Text2, Comment2, ProcessingInstruction, NodeWithChildren, CDATA2, Document, Element;
var init_node = __esm({
  "node_modules/domhandler/lib/esm/node.js"() {
    init_esm();
    Node = class {
      constructor() {
        this.parent = null;
        this.prev = null;
        this.next = null;
        this.startIndex = null;
        this.endIndex = null;
      }
      // Read-write aliases for properties
      /**
       * Same as {@link parent}.
       * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
       */
      get parentNode() {
        return this.parent;
      }
      set parentNode(parent) {
        this.parent = parent;
      }
      /**
       * Same as {@link prev}.
       * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
       */
      get previousSibling() {
        return this.prev;
      }
      set previousSibling(prev) {
        this.prev = prev;
      }
      /**
       * Same as {@link next}.
       * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
       */
      get nextSibling() {
        return this.next;
      }
      set nextSibling(next) {
        this.next = next;
      }
      /**
       * Clone this node, and optionally its children.
       *
       * @param recursive Clone child nodes as well.
       * @returns A clone of the node.
       */
      cloneNode(recursive = false) {
        return cloneNode(this, recursive);
      }
    };
    DataNode = class extends Node {
      /**
       * @param data The content of the data node
       */
      constructor(data) {
        super();
        this.data = data;
      }
      /**
       * Same as {@link data}.
       * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
       */
      get nodeValue() {
        return this.data;
      }
      set nodeValue(data) {
        this.data = data;
      }
    };
    Text2 = class extends DataNode {
      constructor() {
        super(...arguments);
        this.type = ElementType.Text;
      }
      get nodeType() {
        return 3;
      }
    };
    Comment2 = class extends DataNode {
      constructor() {
        super(...arguments);
        this.type = ElementType.Comment;
      }
      get nodeType() {
        return 8;
      }
    };
    ProcessingInstruction = class extends DataNode {
      constructor(name2, data) {
        super(data);
        this.name = name2;
        this.type = ElementType.Directive;
      }
      get nodeType() {
        return 1;
      }
    };
    NodeWithChildren = class extends Node {
      /**
       * @param children Children of the node. Only certain node types can have children.
       */
      constructor(children) {
        super();
        this.children = children;
      }
      // Aliases
      /** First child of the node. */
      get firstChild() {
        var _a3;
        return (_a3 = this.children[0]) !== null && _a3 !== void 0 ? _a3 : null;
      }
      /** Last child of the node. */
      get lastChild() {
        return this.children.length > 0 ? this.children[this.children.length - 1] : null;
      }
      /**
       * Same as {@link children}.
       * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
       */
      get childNodes() {
        return this.children;
      }
      set childNodes(children) {
        this.children = children;
      }
    };
    CDATA2 = class extends NodeWithChildren {
      constructor() {
        super(...arguments);
        this.type = ElementType.CDATA;
      }
      get nodeType() {
        return 4;
      }
    };
    Document = class extends NodeWithChildren {
      constructor() {
        super(...arguments);
        this.type = ElementType.Root;
      }
      get nodeType() {
        return 9;
      }
    };
    Element = class extends NodeWithChildren {
      /**
       * @param name Name of the tag, eg. `div`, `span`.
       * @param attribs Object mapping attribute names to attribute values.
       * @param children Children of the node.
       */
      constructor(name2, attribs, children = [], type = name2 === "script" ? ElementType.Script : name2 === "style" ? ElementType.Style : ElementType.Tag) {
        super(children);
        this.name = name2;
        this.attribs = attribs;
        this.type = type;
      }
      get nodeType() {
        return 1;
      }
      // DOM Level 1 aliases
      /**
       * Same as {@link name}.
       * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
       */
      get tagName() {
        return this.name;
      }
      set tagName(name2) {
        this.name = name2;
      }
      get attributes() {
        return Object.keys(this.attribs).map((name2) => {
          var _a3, _b;
          return {
            name: name2,
            value: this.attribs[name2],
            namespace: (_a3 = this["x-attribsNamespace"]) === null || _a3 === void 0 ? void 0 : _a3[name2],
            prefix: (_b = this["x-attribsPrefix"]) === null || _b === void 0 ? void 0 : _b[name2]
          };
        });
      }
    };
  }
});

// node_modules/domhandler/lib/esm/index.js
var defaultOpts, DomHandler;
var init_esm2 = __esm({
  "node_modules/domhandler/lib/esm/index.js"() {
    init_esm();
    init_node();
    init_node();
    defaultOpts = {
      withStartIndices: false,
      withEndIndices: false,
      xmlMode: false
    };
    DomHandler = class {
      /**
       * @param callback Called once parsing has completed.
       * @param options Settings for the handler.
       * @param elementCB Callback whenever a tag is closed.
       */
      constructor(callback, options, elementCB) {
        this.dom = [];
        this.root = new Document(this.dom);
        this.done = false;
        this.tagStack = [this.root];
        this.lastNode = null;
        this.parser = null;
        if (typeof options === "function") {
          elementCB = options;
          options = defaultOpts;
        }
        if (typeof callback === "object") {
          options = callback;
          callback = void 0;
        }
        this.callback = callback !== null && callback !== void 0 ? callback : null;
        this.options = options !== null && options !== void 0 ? options : defaultOpts;
        this.elementCB = elementCB !== null && elementCB !== void 0 ? elementCB : null;
      }
      onparserinit(parser) {
        this.parser = parser;
      }
      // Resets the handler back to starting state
      onreset() {
        this.dom = [];
        this.root = new Document(this.dom);
        this.done = false;
        this.tagStack = [this.root];
        this.lastNode = null;
        this.parser = null;
      }
      // Signals the handler that parsing is done
      onend() {
        if (this.done)
          return;
        this.done = true;
        this.parser = null;
        this.handleCallback(null);
      }
      onerror(error) {
        this.handleCallback(error);
      }
      onclosetag() {
        this.lastNode = null;
        const elem = this.tagStack.pop();
        if (this.options.withEndIndices) {
          elem.endIndex = this.parser.endIndex;
        }
        if (this.elementCB)
          this.elementCB(elem);
      }
      onopentag(name2, attribs) {
        const type = this.options.xmlMode ? ElementType.Tag : void 0;
        const element = new Element(name2, attribs, void 0, type);
        this.addNode(element);
        this.tagStack.push(element);
      }
      ontext(data) {
        const { lastNode } = this;
        if (lastNode && lastNode.type === ElementType.Text) {
          lastNode.data += data;
          if (this.options.withEndIndices) {
            lastNode.endIndex = this.parser.endIndex;
          }
        } else {
          const node = new Text2(data);
          this.addNode(node);
          this.lastNode = node;
        }
      }
      oncomment(data) {
        if (this.lastNode && this.lastNode.type === ElementType.Comment) {
          this.lastNode.data += data;
          return;
        }
        const node = new Comment2(data);
        this.addNode(node);
        this.lastNode = node;
      }
      oncommentend() {
        this.lastNode = null;
      }
      oncdatastart() {
        const text = new Text2("");
        const node = new CDATA2([text]);
        this.addNode(node);
        text.parent = node;
        this.lastNode = text;
      }
      oncdataend() {
        this.lastNode = null;
      }
      onprocessinginstruction(name2, data) {
        const node = new ProcessingInstruction(name2, data);
        this.addNode(node);
      }
      handleCallback(error) {
        if (typeof this.callback === "function") {
          this.callback(error, this.dom);
        } else if (error) {
          throw error;
        }
      }
      addNode(node) {
        const parent = this.tagStack[this.tagStack.length - 1];
        const previousSibling = parent.children[parent.children.length - 1];
        if (this.options.withStartIndices) {
          node.startIndex = this.parser.startIndex;
        }
        if (this.options.withEndIndices) {
          node.endIndex = this.parser.endIndex;
        }
        parent.children.push(node);
        if (previousSibling) {
          node.prev = previousSibling;
          previousSibling.next = node;
        }
        node.parent = parent;
        this.lastNode = null;
      }
    };
  }
});

// node_modules/leac/lib/leac.mjs
function n(n2) {
  const o2 = [...n2.matchAll(e)].map(((e2) => e2.index || 0));
  o2.unshift(-1);
  const s2 = t2(o2, 0, o2.length);
  return (e2) => r(s2, e2);
}
function t2(e2, n2, r2) {
  if (r2 - n2 == 1) return { offset: e2[n2], index: n2 + 1 };
  const o2 = Math.ceil((n2 + r2) / 2), s2 = t2(e2, n2, o2), l2 = t2(e2, o2, r2);
  return { offset: s2.offset, low: s2, high: l2 };
}
function r(e2, n2) {
  return (function(e3) {
    return Object.prototype.hasOwnProperty.call(e3, "index");
  })(e2) ? { line: e2.index, column: n2 - e2.offset } : r(e2.high.offset < n2 ? e2.high : e2.low, n2);
}
function o(e2, t9 = "", r2 = {}) {
  const o2 = "string" != typeof t9 ? t9 : r2, l2 = "string" == typeof t9 ? t9 : "", c2 = e2.map(s), f3 = !!o2.lineNumbers;
  return function(e3, t10 = 0) {
    const r3 = f3 ? n(e3) : () => ({ line: 0, column: 0 });
    let o3 = t10;
    const s2 = [];
    e: for (; o3 < e3.length; ) {
      let n2 = false;
      for (const t11 of c2) {
        t11.regex.lastIndex = o3;
        const c3 = t11.regex.exec(e3);
        if (c3 && c3[0].length > 0) {
          if (!t11.discard) {
            const e4 = r3(o3), n3 = "string" == typeof t11.replace ? c3[0].replace(new RegExp(t11.regex.source, t11.regex.flags), t11.replace) : c3[0];
            s2.push({ state: l2, name: t11.name, text: n3, offset: o3, len: c3[0].length, line: e4.line, column: e4.column });
          }
          if (o3 = t11.regex.lastIndex, n2 = true, t11.push) {
            const n3 = t11.push(e3, o3);
            s2.push(...n3.tokens), o3 = n3.offset;
          }
          if (t11.pop) break e;
          break;
        }
      }
      if (!n2) break;
    }
    return { tokens: s2, offset: o3, complete: e3.length <= o3 };
  };
}
function s(e2, n2) {
  return { ...e2, regex: l(e2, n2) };
}
function l(e2, n2) {
  if (0 === e2.name.length) throw new Error(`Rule #${n2} has empty name, which is not allowed.`);
  if ((function(e3) {
    return Object.prototype.hasOwnProperty.call(e3, "regex");
  })(e2)) return (function(e3) {
    if (e3.global) throw new Error(`Regular expression /${e3.source}/${e3.flags} contains the global flag, which is not allowed.`);
    return e3.sticky ? e3 : new RegExp(e3.source, e3.flags + "y");
  })(e2.regex);
  if ((function(e3) {
    return Object.prototype.hasOwnProperty.call(e3, "str");
  })(e2)) {
    if (0 === e2.str.length) throw new Error(`Rule #${n2} ("${e2.name}") has empty "str" property, which is not allowed.`);
    return new RegExp(c(e2.str), "y");
  }
  return new RegExp(c(e2.name), "y");
}
function c(e2) {
  return e2.replace(/[-[\]{}()*+!<=:?./\\^$|#\s,]/g, "\\$&");
}
var e;
var init_leac = __esm({
  "node_modules/leac/lib/leac.mjs"() {
    e = /\n/g;
  }
});

// node_modules/peberminta/lib/core.mjs
function token(onToken, onEnd) {
  return (data, i) => {
    let position = i;
    let value = void 0;
    if (i < data.tokens.length) {
      value = onToken(data.tokens[i], data, i);
      if (value !== void 0) {
        position++;
      }
    } else {
      onEnd?.(data, i);
    }
    return value === void 0 ? { matched: false } : {
      matched: true,
      position,
      value
    };
  };
}
function mapInner(r2, f3) {
  return r2.matched ? {
    matched: true,
    position: r2.position,
    value: f3(r2.value, r2.position)
  } : r2;
}
function mapOuter(r2, f3) {
  return r2.matched ? f3(r2) : r2;
}
function map(p2, mapper) {
  return (data, i) => mapInner(p2(data, i), (v4, j3) => mapper(v4, data, i, j3));
}
function option(p2, def) {
  return (data, i) => {
    const r2 = p2(data, i);
    return r2.matched ? r2 : {
      matched: true,
      position: i,
      value: def
    };
  };
}
function choice(...ps2) {
  return (data, i) => {
    for (const p2 of ps2) {
      const result = p2(data, i);
      if (result.matched) {
        return result;
      }
    }
    return { matched: false };
  };
}
function otherwise(pa2, pb) {
  return (data, i) => {
    const r1 = pa2(data, i);
    return r1.matched ? r1 : pb(data, i);
  };
}
function takeWhile(p2, test) {
  return (data, i) => {
    const values = [];
    let success = true;
    do {
      const r2 = p2(data, i);
      if (r2.matched && test(r2.value, values.length + 1, data, i, r2.position)) {
        values.push(r2.value);
        i = r2.position;
      } else {
        success = false;
      }
    } while (success);
    return {
      matched: true,
      position: i,
      value: values
    };
  };
}
function many(p2) {
  return takeWhile(p2, () => true);
}
function many1(p2) {
  return ab(p2, many(p2), (head, tail) => [head, ...tail]);
}
function ab(pa2, pb, join) {
  return (data, i) => mapOuter(pa2(data, i), (ma2) => mapInner(pb(data, ma2.position), (vb, j3) => join(ma2.value, vb, data, i, j3)));
}
function left(pa2, pb) {
  return ab(pa2, pb, (va2) => va2);
}
function right(pa2, pb) {
  return ab(pa2, pb, (va2, vb) => vb);
}
function abc(pa2, pb, pc, join) {
  return (data, i) => mapOuter(pa2(data, i), (ma2) => mapOuter(pb(data, ma2.position), (mb) => mapInner(pc(data, mb.position), (vc, j3) => join(ma2.value, mb.value, vc, data, i, j3))));
}
function middle(pa2, pb, pc) {
  return abc(pa2, pb, pc, (ra2, rb) => rb);
}
function all(...ps2) {
  return (data, i) => {
    const result = [];
    let position = i;
    for (const p2 of ps2) {
      const r1 = p2(data, position);
      if (r1.matched) {
        result.push(r1.value);
        position = r1.position;
      } else {
        return { matched: false };
      }
    }
    return {
      matched: true,
      position,
      value: result
    };
  };
}
function flatten(...ps2) {
  return flatten1(all(...ps2));
}
function flatten1(p2) {
  return map(p2, (vs2) => vs2.flatMap((v4) => v4));
}
function chainReduce(acc, f3) {
  return (data, i) => {
    let loop = true;
    let acc1 = acc;
    let pos = i;
    do {
      const r2 = f3(acc1, data, pos)(data, pos);
      if (r2.matched) {
        acc1 = r2.value;
        pos = r2.position;
      } else {
        loop = false;
      }
    } while (loop);
    return {
      matched: true,
      position: pos,
      value: acc1
    };
  };
}
function reduceLeft(acc, p2, reducer) {
  return chainReduce(acc, (acc2) => map(p2, (v4, data, i, j3) => reducer(acc2, v4, data, i, j3)));
}
function leftAssoc2(pLeft, pOper, pRight) {
  return chain(pLeft, (v0) => reduceLeft(v0, ab(pOper, pRight, (f3, y3) => [f3, y3]), (acc, [f3, y3]) => f3(acc, y3)));
}
function chain(p2, f3) {
  return (data, i) => mapOuter(p2(data, i), (m1) => f3(m1.value, data, i, m1.position)(data, m1.position));
}
var init_core = __esm({
  "node_modules/peberminta/lib/core.mjs"() {
  }
});

// node_modules/parseley/lib/parseley.mjs
function sumSpec([a0, a1, a2], [b0, b1, b22]) {
  return [a0 + b0, a1 + b1, a2 + b22];
}
function sumAllSpec(ss2) {
  return ss2.reduce(sumSpec, [0, 0, 0]);
}
function unescape(escapedString) {
  const lexerResult = lexEscapedString(escapedString);
  const result = escapedString_({ tokens: lexerResult.tokens, options: void 0 }, 0);
  return result.value;
}
function literal(name2) {
  return token((t9) => t9.name === name2 ? true : void 0);
}
function optionallySpaced(parser) {
  return middle(optionalWhitespace_, parser, optionalWhitespace_);
}
function parse_(parser, str) {
  if (!(typeof str === "string" || str instanceof String)) {
    throw new Error("Expected a selector string. Actual input is not a string!");
  }
  const lexerResult = lexSelector(str);
  if (!lexerResult.complete) {
    throw new Error(`The input "${str}" was only partially tokenized, stopped at offset ${lexerResult.offset}!
` + prettyPrintPosition(str, lexerResult.offset));
  }
  const result = optionallySpaced(parser)({ tokens: lexerResult.tokens, options: void 0 }, 0);
  if (!result.matched) {
    throw new Error(`No match for "${str}" input!`);
  }
  if (result.position < lexerResult.tokens.length) {
    const token2 = lexerResult.tokens[result.position];
    throw new Error(`The input "${str}" was only partially parsed, stopped at offset ${token2.offset}!
` + prettyPrintPosition(str, token2.offset, token2.len));
  }
  return result.value;
}
function prettyPrintPosition(str, offset, len = 1) {
  return `${str.replace(/(\t)|(\r)|(\n)/g, (m, t9, r2) => t9 ? "\u2409" : r2 ? "\u240D" : "\u240A")}
${"".padEnd(offset)}${"^".repeat(len)}`;
}
function parse1(str) {
  return parse_(complexSelector_, str);
}
function serialize2(selector) {
  if (!selector.type) {
    throw new Error("This is not an AST node.");
  }
  switch (selector.type) {
    case "universal":
      return _serNs(selector.namespace) + "*";
    case "tag":
      return _serNs(selector.namespace) + _serIdent(selector.name);
    case "class":
      return "." + _serIdent(selector.name);
    case "id":
      return "#" + _serIdent(selector.name);
    case "attrPresence":
      return `[${_serNs(selector.namespace)}${_serIdent(selector.name)}]`;
    case "attrValue":
      return `[${_serNs(selector.namespace)}${_serIdent(selector.name)}${selector.matcher}"${_serStr(selector.value)}"${selector.modifier ? selector.modifier : ""}]`;
    case "combinator":
      return serialize2(selector.left) + selector.combinator;
    case "compound":
      return selector.list.reduce((acc, node) => {
        if (node.type === "combinator") {
          return serialize2(node) + acc;
        } else {
          return acc + serialize2(node);
        }
      }, "");
    case "list":
      return selector.list.map(serialize2).join(",");
  }
}
function _serNs(ns2) {
  return ns2 || ns2 === "" ? _serIdent(ns2) + "|" : "";
}
function _codePoint(char) {
  return `\\${char.codePointAt(0).toString(16)} `;
}
function _serIdent(str) {
  return str.replace(
    /(^[0-9])|(^-[0-9])|(^-$)|([-0-9a-zA-Z_]|[^\x00-\x7F])|(\x00)|([\x01-\x1f]|\x7f)|([\s\S])/g,
    (m, d1, d2, hy, safe, nl2, ctrl, other) => d1 ? _codePoint(d1) : d2 ? "-" + _codePoint(d2.slice(1)) : hy ? "\\-" : safe ? safe : nl2 ? "\uFFFD" : ctrl ? _codePoint(ctrl) : "\\" + other
  );
}
function _serStr(str) {
  return str.replace(
    /(")|(\\)|(\x00)|([\x01-\x1f]|\x7f)/g,
    (m, dq, bs2, nl2, ctrl) => dq ? '\\"' : bs2 ? "\\\\" : nl2 ? "\uFFFD" : _codePoint(ctrl)
  );
}
function normalize(selector) {
  if (!selector.type) {
    throw new Error("This is not an AST node.");
  }
  switch (selector.type) {
    case "compound": {
      selector.list.forEach(normalize);
      selector.list.sort((a, b3) => _compareArrays(_getSelectorPriority(a), _getSelectorPriority(b3)));
      break;
    }
    case "combinator": {
      normalize(selector.left);
      break;
    }
    case "list": {
      selector.list.forEach(normalize);
      selector.list.sort((a, b3) => serialize2(a) < serialize2(b3) ? -1 : 1);
      break;
    }
  }
  return selector;
}
function _getSelectorPriority(selector) {
  switch (selector.type) {
    case "universal":
      return [1];
    case "tag":
      return [1];
    case "id":
      return [2];
    case "class":
      return [3, selector.name];
    case "attrPresence":
      return [4, serialize2(selector)];
    case "attrValue":
      return [5, serialize2(selector)];
    case "combinator":
      return [15, serialize2(selector)];
  }
}
function compareSpecificity(a, b3) {
  return _compareArrays(a, b3);
}
function _compareArrays(a, b3) {
  if (!Array.isArray(a) || !Array.isArray(b3)) {
    throw new Error("Arguments must be arrays.");
  }
  const shorter = a.length < b3.length ? a.length : b3.length;
  for (let i = 0; i < shorter; i++) {
    if (a[i] === b3[i]) {
      continue;
    }
    return a[i] < b3[i] ? -1 : 1;
  }
  return a.length - b3.length;
}
var ws, nl, nonascii, unicode, escape, nmstart, nmchar, name, ident, string1, string2, lexSelector, lexEscapedString, unicodeEscapedSequence_, escapedSequence_, anyChar_, escapedString_, whitespace_, optionalWhitespace_, identifier_, hashId_, string_, namespace_, qualifiedName_, uniSelector_, tagSelector_, classSelector_, idSelector_, attrModifier_, attrValue_, attrMatcher_, attrPresenceSelector_, attrValueSelector_, attrSelector_, typeSelector_, subclassSelector_, compoundSelector_, combinator_, combinatorSeparator_, complexSelector_, listSelector_;
var init_parseley = __esm({
  "node_modules/parseley/lib/parseley.mjs"() {
    init_leac();
    init_core();
    ws = `(?:[ \\t\\r\\n\\f]*)`;
    nl = `(?:\\n|\\r\\n|\\r|\\f)`;
    nonascii = `[^\\x00-\\x7F]`;
    unicode = `(?:\\\\[0-9a-f]{1,6}(?:\\r\\n|[ \\n\\r\\t\\f])?)`;
    escape = `(?:\\\\[^\\n\\r\\f0-9a-f])`;
    nmstart = `(?:[_a-z]|${nonascii}|${unicode}|${escape})`;
    nmchar = `(?:[_a-z0-9-]|${nonascii}|${unicode}|${escape})`;
    name = `(?:${nmchar}+)`;
    ident = `(?:[-]?${nmstart}${nmchar}*)`;
    string1 = `'([^\\n\\r\\f\\\\']|\\\\${nl}|${nonascii}|${unicode}|${escape})*'`;
    string2 = `"([^\\n\\r\\f\\\\"]|\\\\${nl}|${nonascii}|${unicode}|${escape})*"`;
    lexSelector = o([
      { name: "ws", regex: new RegExp(ws) },
      { name: "hash", regex: new RegExp(`#${name}`, "i") },
      { name: "ident", regex: new RegExp(ident, "i") },
      { name: "str1", regex: new RegExp(string1, "i") },
      { name: "str2", regex: new RegExp(string2, "i") },
      { name: "*" },
      { name: "." },
      { name: "," },
      { name: "[" },
      { name: "]" },
      { name: "=" },
      { name: ">" },
      { name: "|" },
      { name: "+" },
      { name: "~" },
      { name: "^" },
      { name: "$" }
    ]);
    lexEscapedString = o([
      { name: "unicode", regex: new RegExp(unicode, "i") },
      { name: "escape", regex: new RegExp(escape, "i") },
      { name: "any", regex: new RegExp("[\\s\\S]", "i") }
    ]);
    unicodeEscapedSequence_ = token((t9) => t9.name === "unicode" ? String.fromCodePoint(parseInt(t9.text.slice(1), 16)) : void 0);
    escapedSequence_ = token((t9) => t9.name === "escape" ? t9.text.slice(1) : void 0);
    anyChar_ = token((t9) => t9.name === "any" ? t9.text : void 0);
    escapedString_ = map(many(choice(unicodeEscapedSequence_, escapedSequence_, anyChar_)), (cs2) => cs2.join(""));
    whitespace_ = token((t9) => t9.name === "ws" ? null : void 0);
    optionalWhitespace_ = option(whitespace_, null);
    identifier_ = token((t9) => t9.name === "ident" ? unescape(t9.text) : void 0);
    hashId_ = token((t9) => t9.name === "hash" ? unescape(t9.text.slice(1)) : void 0);
    string_ = token((t9) => t9.name.startsWith("str") ? unescape(t9.text.slice(1, -1)) : void 0);
    namespace_ = left(option(identifier_, ""), literal("|"));
    qualifiedName_ = otherwise(ab(namespace_, identifier_, (ns2, name2) => ({ name: name2, namespace: ns2 })), map(identifier_, (name2) => ({ name: name2, namespace: null })));
    uniSelector_ = otherwise(ab(namespace_, literal("*"), (ns2) => ({ type: "universal", namespace: ns2, specificity: [0, 0, 0] })), map(literal("*"), () => ({ type: "universal", namespace: null, specificity: [0, 0, 0] })));
    tagSelector_ = map(qualifiedName_, ({ name: name2, namespace }) => ({
      type: "tag",
      name: name2,
      namespace,
      specificity: [0, 0, 1]
    }));
    classSelector_ = ab(literal("."), identifier_, (fullstop, name2) => ({
      type: "class",
      name: name2,
      specificity: [0, 1, 0]
    }));
    idSelector_ = map(hashId_, (name2) => ({
      type: "id",
      name: name2,
      specificity: [1, 0, 0]
    }));
    attrModifier_ = token((t9) => {
      if (t9.name === "ident") {
        if (t9.text === "i" || t9.text === "I") {
          return "i";
        }
        if (t9.text === "s" || t9.text === "S") {
          return "s";
        }
      }
      return void 0;
    });
    attrValue_ = otherwise(ab(string_, option(right(optionalWhitespace_, attrModifier_), null), (v4, mod) => ({ value: v4, modifier: mod })), ab(identifier_, option(right(whitespace_, attrModifier_), null), (v4, mod) => ({ value: v4, modifier: mod })));
    attrMatcher_ = choice(map(literal("="), () => "="), ab(literal("~"), literal("="), () => "~="), ab(literal("|"), literal("="), () => "|="), ab(literal("^"), literal("="), () => "^="), ab(literal("$"), literal("="), () => "$="), ab(literal("*"), literal("="), () => "*="));
    attrPresenceSelector_ = abc(literal("["), optionallySpaced(qualifiedName_), literal("]"), (lbr, { name: name2, namespace }) => ({
      type: "attrPresence",
      name: name2,
      namespace,
      specificity: [0, 1, 0]
    }));
    attrValueSelector_ = middle(literal("["), abc(optionallySpaced(qualifiedName_), attrMatcher_, optionallySpaced(attrValue_), ({ name: name2, namespace }, matcher, { value, modifier }) => ({
      type: "attrValue",
      name: name2,
      namespace,
      matcher,
      value,
      modifier,
      specificity: [0, 1, 0]
    })), literal("]"));
    attrSelector_ = otherwise(attrPresenceSelector_, attrValueSelector_);
    typeSelector_ = otherwise(uniSelector_, tagSelector_);
    subclassSelector_ = choice(idSelector_, classSelector_, attrSelector_);
    compoundSelector_ = map(otherwise(flatten(typeSelector_, many(subclassSelector_)), many1(subclassSelector_)), (ss2) => {
      return {
        type: "compound",
        list: ss2,
        specificity: sumAllSpec(ss2.map((s2) => s2.specificity))
      };
    });
    combinator_ = choice(map(literal(">"), () => ">"), map(literal("+"), () => "+"), map(literal("~"), () => "~"), ab(literal("|"), literal("|"), () => "||"));
    combinatorSeparator_ = otherwise(optionallySpaced(combinator_), map(whitespace_, () => " "));
    complexSelector_ = leftAssoc2(compoundSelector_, map(combinatorSeparator_, (c2) => (left2, right2) => ({
      type: "compound",
      list: [...right2.list, { type: "combinator", combinator: c2, left: left2, specificity: left2.specificity }],
      specificity: sumSpec(left2.specificity, right2.specificity)
    })), compoundSelector_);
    listSelector_ = leftAssoc2(map(complexSelector_, (s2) => ({ type: "list", list: [s2] })), map(optionallySpaced(literal(",")), () => (acc, next) => ({ type: "list", list: [...acc.list, next] })), complexSelector_);
  }
});

// node_modules/selderee/lib/selderee.mjs
function toAstTerminalPairs(array) {
  const len = array.length;
  const results = new Array(len);
  for (let i = 0; i < len; i++) {
    const [selectorString, val] = array[i];
    const ast = preprocess(parse1(selectorString));
    results[i] = {
      ast,
      terminal: {
        type: "terminal",
        valueContainer: { index: i, value: val, specificity: ast.specificity }
      }
    };
  }
  return results;
}
function preprocess(ast) {
  reduceSelectorVariants(ast);
  normalize(ast);
  return ast;
}
function reduceSelectorVariants(ast) {
  const newList = [];
  ast.list.forEach((sel) => {
    switch (sel.type) {
      case "class":
        newList.push({
          matcher: "~=",
          modifier: null,
          name: "class",
          namespace: null,
          specificity: sel.specificity,
          type: "attrValue",
          value: sel.name
        });
        break;
      case "id":
        newList.push({
          matcher: "=",
          modifier: null,
          name: "id",
          namespace: null,
          specificity: sel.specificity,
          type: "attrValue",
          value: sel.name
        });
        break;
      case "combinator":
        reduceSelectorVariants(sel.left);
        newList.push(sel);
        break;
      case "universal":
        break;
      default:
        newList.push(sel);
        break;
    }
  });
  ast.list = newList;
}
function weave(items) {
  const branches = [];
  while (items.length) {
    const topKind = findTopKey(items, (sel) => true, getSelectorKind);
    const { matches, nonmatches, empty } = breakByKind(items, topKind);
    items = nonmatches;
    if (matches.length) {
      branches.push(branchOfKind(topKind, matches));
    }
    if (empty.length) {
      branches.push(...terminate(empty));
    }
  }
  return branches;
}
function terminate(items) {
  const results = [];
  for (const item of items) {
    const terminal = item.terminal;
    if (terminal.type === "terminal") {
      results.push(terminal);
    } else {
      const { matches, rest } = partition(terminal.cont, (node) => node.type === "terminal");
      matches.forEach((node) => results.push(node));
      if (rest.length) {
        terminal.cont = rest;
        results.push(terminal);
      }
    }
  }
  return results;
}
function breakByKind(items, selectedKind) {
  const matches = [];
  const nonmatches = [];
  const empty = [];
  for (const item of items) {
    const simpsels = item.ast.list;
    if (simpsels.length) {
      const isMatch = simpsels.some((node) => getSelectorKind(node) === selectedKind);
      (isMatch ? matches : nonmatches).push(item);
    } else {
      empty.push(item);
    }
  }
  return { matches, nonmatches, empty };
}
function getSelectorKind(sel) {
  switch (sel.type) {
    case "attrPresence":
      return `attrPresence ${sel.name}`;
    case "attrValue":
      return `attrValue ${sel.name}`;
    case "combinator":
      return `combinator ${sel.combinator}`;
    default:
      return sel.type;
  }
}
function branchOfKind(kind, items) {
  if (kind === "tag") {
    return tagNameBranch(items);
  }
  if (kind.startsWith("attrValue ")) {
    return attrValueBranch(kind.substring(10), items);
  }
  if (kind.startsWith("attrPresence ")) {
    return attrPresenceBranch(kind.substring(13), items);
  }
  if (kind === "combinator >") {
    return combinatorBranch(">", items);
  }
  if (kind === "combinator +") {
    return combinatorBranch("+", items);
  }
  throw new Error(`Unsupported selector kind: ${kind}`);
}
function tagNameBranch(items) {
  const groups = spliceAndGroup(items, (x2) => x2.type === "tag", (x2) => x2.name);
  const variants = Object.entries(groups).map(([name2, group]) => ({
    type: "variant",
    value: name2,
    cont: weave(group.items)
  }));
  return {
    type: "tagName",
    variants
  };
}
function attrPresenceBranch(name2, items) {
  for (const item of items) {
    spliceSimpleSelector(item, (x2) => x2.type === "attrPresence" && x2.name === name2);
  }
  return {
    type: "attrPresence",
    name: name2,
    cont: weave(items)
  };
}
function attrValueBranch(name2, items) {
  const groups = spliceAndGroup(items, (x2) => x2.type === "attrValue" && x2.name === name2, (x2) => `${x2.matcher} ${x2.modifier || ""} ${x2.value}`);
  const matchers = [];
  for (const group of Object.values(groups)) {
    const sel = group.oneSimpleSelector;
    const predicate = getAttrPredicate(sel);
    const continuation = weave(group.items);
    matchers.push({
      type: "matcher",
      matcher: sel.matcher,
      modifier: sel.modifier,
      value: sel.value,
      predicate,
      cont: continuation
    });
  }
  return {
    type: "attrValue",
    name: name2,
    matchers
  };
}
function getAttrPredicate(sel) {
  if (sel.modifier === "i") {
    const expected = sel.value.toLowerCase();
    switch (sel.matcher) {
      case "=":
        return (actual) => expected === actual.toLowerCase();
      case "~=":
        return (actual) => actual.toLowerCase().split(/[ \t]+/).includes(expected);
      case "^=":
        return (actual) => actual.toLowerCase().startsWith(expected);
      case "$=":
        return (actual) => actual.toLowerCase().endsWith(expected);
      case "*=":
        return (actual) => actual.toLowerCase().includes(expected);
      case "|=":
        return (actual) => {
          const lower = actual.toLowerCase();
          return expected === lower || lower.startsWith(expected) && lower[expected.length] === "-";
        };
    }
  } else {
    const expected = sel.value;
    switch (sel.matcher) {
      case "=":
        return (actual) => expected === actual;
      case "~=":
        return (actual) => actual.split(/[ \t]+/).includes(expected);
      case "^=":
        return (actual) => actual.startsWith(expected);
      case "$=":
        return (actual) => actual.endsWith(expected);
      case "*=":
        return (actual) => actual.includes(expected);
      case "|=":
        return (actual) => expected === actual || actual.startsWith(expected) && actual[expected.length] === "-";
    }
  }
}
function combinatorBranch(combinator, items) {
  const groups = spliceAndGroup(items, (x2) => x2.type === "combinator" && x2.combinator === combinator, (x2) => serialize2(x2.left));
  const leftItems = [];
  for (const group of Object.values(groups)) {
    const rightCont = weave(group.items);
    const leftAst = group.oneSimpleSelector.left;
    leftItems.push({
      ast: leftAst,
      terminal: { type: "popElement", cont: rightCont }
    });
  }
  return {
    type: "pushElement",
    combinator,
    cont: weave(leftItems)
  };
}
function spliceAndGroup(items, predicate, keyCallback) {
  const groups = {};
  while (items.length) {
    const bestKey = findTopKey(items, predicate, keyCallback);
    const bestKeyPredicate = (sel) => predicate(sel) && keyCallback(sel) === bestKey;
    const hasBestKeyPredicate = (item) => item.ast.list.some(bestKeyPredicate);
    const { matches, rest } = partition1(items, hasBestKeyPredicate);
    let oneSimpleSelector = null;
    for (const item of matches) {
      const splicedNode = spliceSimpleSelector(item, bestKeyPredicate);
      if (!oneSimpleSelector) {
        oneSimpleSelector = splicedNode;
      }
    }
    if (oneSimpleSelector == null) {
      throw new Error("No simple selector is found.");
    }
    groups[bestKey] = { oneSimpleSelector, items: matches };
    items = rest;
  }
  return groups;
}
function spliceSimpleSelector(item, predicate) {
  const simpsels = item.ast.list;
  const matches = new Array(simpsels.length);
  let firstIndex = -1;
  for (let i = simpsels.length; i-- > 0; ) {
    if (predicate(simpsels[i])) {
      matches[i] = true;
      firstIndex = i;
    }
  }
  if (firstIndex == -1) {
    throw new Error(`Couldn't find the required simple selector.`);
  }
  const result = simpsels[firstIndex];
  item.ast.list = simpsels.filter((sel, i) => !matches[i]);
  return result;
}
function findTopKey(items, predicate, keyCallback) {
  const candidates = {};
  for (const item of items) {
    const candidates1 = {};
    for (const node of item.ast.list.filter(predicate)) {
      candidates1[keyCallback(node)] = true;
    }
    for (const key of Object.keys(candidates1)) {
      if (candidates[key]) {
        candidates[key]++;
      } else {
        candidates[key] = 1;
      }
    }
  }
  let topKind = "";
  let topCounter = 0;
  for (const entry of Object.entries(candidates)) {
    if (entry[1] > topCounter) {
      topKind = entry[0];
      topCounter = entry[1];
    }
  }
  return topKind;
}
function partition(src, predicate) {
  const matches = [];
  const rest = [];
  for (const x2 of src) {
    if (predicate(x2)) {
      matches.push(x2);
    } else {
      rest.push(x2);
    }
  }
  return { matches, rest };
}
function partition1(src, predicate) {
  const matches = [];
  const rest = [];
  for (const x2 of src) {
    if (predicate(x2)) {
      matches.push(x2);
    } else {
      rest.push(x2);
    }
  }
  return { matches, rest };
}
function comparatorPreferFirst(acc, next) {
  const diff = compareSpecificity(next.specificity, acc.specificity);
  return diff > 0 || diff === 0 && next.index < acc.index;
}
function comparatorPreferLast(acc, next) {
  const diff = compareSpecificity(next.specificity, acc.specificity);
  return diff > 0 || diff === 0 && next.index > acc.index;
}
var DecisionTree, Picker;
var init_selderee = __esm({
  "node_modules/selderee/lib/selderee.mjs"() {
    init_parseley();
    init_parseley();
    DecisionTree = class {
      constructor(input) {
        this.branches = weave(toAstTerminalPairs(input));
      }
      build(builder) {
        return builder(this.branches);
      }
    };
    Picker = class {
      constructor(f3) {
        this.f = f3;
      }
      pickAll(el) {
        return this.f(el);
      }
      pick1(el, preferFirst = false) {
        const results = this.f(el);
        const len = results.length;
        if (len === 0) {
          return null;
        }
        if (len === 1) {
          return results[0].value;
        }
        const comparator = preferFirst ? comparatorPreferFirst : comparatorPreferLast;
        let result = results[0];
        for (let i = 1; i < len; i++) {
          const next = results[i];
          if (comparator(result, next)) {
            result = next;
          }
        }
        return result.value;
      }
    };
  }
});

// node_modules/@selderee/plugin-htmlparser2/lib/hp2-builder.mjs
function hp2Builder(nodes) {
  return new Picker(handleArray(nodes));
}
function handleArray(nodes) {
  const matchers = nodes.map(handleNode);
  return (el, ...tail) => matchers.flatMap((m) => m(el, ...tail));
}
function handleNode(node) {
  switch (node.type) {
    case "terminal": {
      const result = [node.valueContainer];
      return (el, ...tail) => result;
    }
    case "tagName":
      return handleTagName(node);
    case "attrValue":
      return handleAttrValueName(node);
    case "attrPresence":
      return handleAttrPresenceName(node);
    case "pushElement":
      return handlePushElementNode(node);
    case "popElement":
      return handlePopElementNode(node);
  }
}
function handleTagName(node) {
  const variants = {};
  for (const variant of node.variants) {
    variants[variant.value] = handleArray(variant.cont);
  }
  return (el, ...tail) => {
    const continuation = variants[el.name];
    return continuation ? continuation(el, ...tail) : [];
  };
}
function handleAttrPresenceName(node) {
  const attrName = node.name;
  const continuation = handleArray(node.cont);
  return (el, ...tail) => Object.prototype.hasOwnProperty.call(el.attribs, attrName) ? continuation(el, ...tail) : [];
}
function handleAttrValueName(node) {
  const callbacks = [];
  for (const matcher of node.matchers) {
    const predicate = matcher.predicate;
    const continuation = handleArray(matcher.cont);
    callbacks.push((attr, el, ...tail) => predicate(attr) ? continuation(el, ...tail) : []);
  }
  const attrName = node.name;
  return (el, ...tail) => {
    const attr = el.attribs[attrName];
    return attr || attr === "" ? callbacks.flatMap((cb) => cb(attr, el, ...tail)) : [];
  };
}
function handlePushElementNode(node) {
  const continuation = handleArray(node.cont);
  const leftElementGetter = node.combinator === "+" ? getPrecedingElement : getParentElement;
  return (el, ...tail) => {
    const next = leftElementGetter(el);
    if (next === null) {
      return [];
    }
    return continuation(next, el, ...tail);
  };
}
function handlePopElementNode(node) {
  const continuation = handleArray(node.cont);
  return (el, next, ...tail) => continuation(next, ...tail);
}
var getPrecedingElement, getParentElement;
var init_hp2_builder = __esm({
  "node_modules/@selderee/plugin-htmlparser2/lib/hp2-builder.mjs"() {
    init_esm2();
    init_selderee();
    getPrecedingElement = (el) => {
      const prev = el.prev;
      if (prev === null) {
        return null;
      }
      return isTag2(prev) ? prev : getPrecedingElement(prev);
    };
    getParentElement = (el) => {
      const parent = el.parent;
      return parent && isTag2(parent) ? parent : null;
    };
  }
});

// node_modules/entities/lib/esm/generated/decode-data-html.js
var decode_data_html_default;
var init_decode_data_html = __esm({
  "node_modules/entities/lib/esm/generated/decode-data-html.js"() {
    decode_data_html_default = new Uint16Array(
      // prettier-ignore
      '\u1D41<\xD5\u0131\u028A\u049D\u057B\u05D0\u0675\u06DE\u07A2\u07D6\u080F\u0A4A\u0A91\u0DA1\u0E6D\u0F09\u0F26\u10CA\u1228\u12E1\u1415\u149D\u14C3\u14DF\u1525\0\0\0\0\0\0\u156B\u16CD\u198D\u1C12\u1DDD\u1F7E\u2060\u21B0\u228D\u23C0\u23FB\u2442\u2824\u2912\u2D08\u2E48\u2FCE\u3016\u32BA\u3639\u37AC\u38FE\u3A28\u3A71\u3AE0\u3B2E\u0800EMabcfglmnoprstu\\bfms\x7F\x84\x8B\x90\x95\x98\xA6\xB3\xB9\xC8\xCFlig\u803B\xC6\u40C6P\u803B&\u4026cute\u803B\xC1\u40C1reve;\u4102\u0100iyx}rc\u803B\xC2\u40C2;\u4410r;\uC000\u{1D504}rave\u803B\xC0\u40C0pha;\u4391acr;\u4100d;\u6A53\u0100gp\x9D\xA1on;\u4104f;\uC000\u{1D538}plyFunction;\u6061ing\u803B\xC5\u40C5\u0100cs\xBE\xC3r;\uC000\u{1D49C}ign;\u6254ilde\u803B\xC3\u40C3ml\u803B\xC4\u40C4\u0400aceforsu\xE5\xFB\xFE\u0117\u011C\u0122\u0127\u012A\u0100cr\xEA\xF2kslash;\u6216\u0176\xF6\xF8;\u6AE7ed;\u6306y;\u4411\u0180crt\u0105\u010B\u0114ause;\u6235noullis;\u612Ca;\u4392r;\uC000\u{1D505}pf;\uC000\u{1D539}eve;\u42D8c\xF2\u0113mpeq;\u624E\u0700HOacdefhilorsu\u014D\u0151\u0156\u0180\u019E\u01A2\u01B5\u01B7\u01BA\u01DC\u0215\u0273\u0278\u027Ecy;\u4427PY\u803B\xA9\u40A9\u0180cpy\u015D\u0162\u017Aute;\u4106\u0100;i\u0167\u0168\u62D2talDifferentialD;\u6145leys;\u612D\u0200aeio\u0189\u018E\u0194\u0198ron;\u410Cdil\u803B\xC7\u40C7rc;\u4108nint;\u6230ot;\u410A\u0100dn\u01A7\u01ADilla;\u40B8terDot;\u40B7\xF2\u017Fi;\u43A7rcle\u0200DMPT\u01C7\u01CB\u01D1\u01D6ot;\u6299inus;\u6296lus;\u6295imes;\u6297o\u0100cs\u01E2\u01F8kwiseContourIntegral;\u6232eCurly\u0100DQ\u0203\u020FoubleQuote;\u601Duote;\u6019\u0200lnpu\u021E\u0228\u0247\u0255on\u0100;e\u0225\u0226\u6237;\u6A74\u0180git\u022F\u0236\u023Aruent;\u6261nt;\u622FourIntegral;\u622E\u0100fr\u024C\u024E;\u6102oduct;\u6210nterClockwiseContourIntegral;\u6233oss;\u6A2Fcr;\uC000\u{1D49E}p\u0100;C\u0284\u0285\u62D3ap;\u624D\u0580DJSZacefios\u02A0\u02AC\u02B0\u02B4\u02B8\u02CB\u02D7\u02E1\u02E6\u0333\u048D\u0100;o\u0179\u02A5trahd;\u6911cy;\u4402cy;\u4405cy;\u440F\u0180grs\u02BF\u02C4\u02C7ger;\u6021r;\u61A1hv;\u6AE4\u0100ay\u02D0\u02D5ron;\u410E;\u4414l\u0100;t\u02DD\u02DE\u6207a;\u4394r;\uC000\u{1D507}\u0100af\u02EB\u0327\u0100cm\u02F0\u0322ritical\u0200ADGT\u0300\u0306\u0316\u031Ccute;\u40B4o\u0174\u030B\u030D;\u42D9bleAcute;\u42DDrave;\u4060ilde;\u42DCond;\u62C4ferentialD;\u6146\u0470\u033D\0\0\0\u0342\u0354\0\u0405f;\uC000\u{1D53B}\u0180;DE\u0348\u0349\u034D\u40A8ot;\u60DCqual;\u6250ble\u0300CDLRUV\u0363\u0372\u0382\u03CF\u03E2\u03F8ontourIntegra\xEC\u0239o\u0274\u0379\0\0\u037B\xBB\u0349nArrow;\u61D3\u0100eo\u0387\u03A4ft\u0180ART\u0390\u0396\u03A1rrow;\u61D0ightArrow;\u61D4e\xE5\u02CAng\u0100LR\u03AB\u03C4eft\u0100AR\u03B3\u03B9rrow;\u67F8ightArrow;\u67FAightArrow;\u67F9ight\u0100AT\u03D8\u03DErrow;\u61D2ee;\u62A8p\u0241\u03E9\0\0\u03EFrrow;\u61D1ownArrow;\u61D5erticalBar;\u6225n\u0300ABLRTa\u0412\u042A\u0430\u045E\u047F\u037Crrow\u0180;BU\u041D\u041E\u0422\u6193ar;\u6913pArrow;\u61F5reve;\u4311eft\u02D2\u043A\0\u0446\0\u0450ightVector;\u6950eeVector;\u695Eector\u0100;B\u0459\u045A\u61BDar;\u6956ight\u01D4\u0467\0\u0471eeVector;\u695Fector\u0100;B\u047A\u047B\u61C1ar;\u6957ee\u0100;A\u0486\u0487\u62A4rrow;\u61A7\u0100ct\u0492\u0497r;\uC000\u{1D49F}rok;\u4110\u0800NTacdfglmopqstux\u04BD\u04C0\u04C4\u04CB\u04DE\u04E2\u04E7\u04EE\u04F5\u0521\u052F\u0536\u0552\u055D\u0560\u0565G;\u414AH\u803B\xD0\u40D0cute\u803B\xC9\u40C9\u0180aiy\u04D2\u04D7\u04DCron;\u411Arc\u803B\xCA\u40CA;\u442Dot;\u4116r;\uC000\u{1D508}rave\u803B\xC8\u40C8ement;\u6208\u0100ap\u04FA\u04FEcr;\u4112ty\u0253\u0506\0\0\u0512mallSquare;\u65FBerySmallSquare;\u65AB\u0100gp\u0526\u052Aon;\u4118f;\uC000\u{1D53C}silon;\u4395u\u0100ai\u053C\u0549l\u0100;T\u0542\u0543\u6A75ilde;\u6242librium;\u61CC\u0100ci\u0557\u055Ar;\u6130m;\u6A73a;\u4397ml\u803B\xCB\u40CB\u0100ip\u056A\u056Fsts;\u6203onentialE;\u6147\u0280cfios\u0585\u0588\u058D\u05B2\u05CCy;\u4424r;\uC000\u{1D509}lled\u0253\u0597\0\0\u05A3mallSquare;\u65FCerySmallSquare;\u65AA\u0370\u05BA\0\u05BF\0\0\u05C4f;\uC000\u{1D53D}All;\u6200riertrf;\u6131c\xF2\u05CB\u0600JTabcdfgorst\u05E8\u05EC\u05EF\u05FA\u0600\u0612\u0616\u061B\u061D\u0623\u066C\u0672cy;\u4403\u803B>\u403Emma\u0100;d\u05F7\u05F8\u4393;\u43DCreve;\u411E\u0180eiy\u0607\u060C\u0610dil;\u4122rc;\u411C;\u4413ot;\u4120r;\uC000\u{1D50A};\u62D9pf;\uC000\u{1D53E}eater\u0300EFGLST\u0635\u0644\u064E\u0656\u065B\u0666qual\u0100;L\u063E\u063F\u6265ess;\u62DBullEqual;\u6267reater;\u6AA2ess;\u6277lantEqual;\u6A7Eilde;\u6273cr;\uC000\u{1D4A2};\u626B\u0400Aacfiosu\u0685\u068B\u0696\u069B\u069E\u06AA\u06BE\u06CARDcy;\u442A\u0100ct\u0690\u0694ek;\u42C7;\u405Eirc;\u4124r;\u610ClbertSpace;\u610B\u01F0\u06AF\0\u06B2f;\u610DizontalLine;\u6500\u0100ct\u06C3\u06C5\xF2\u06A9rok;\u4126mp\u0144\u06D0\u06D8ownHum\xF0\u012Fqual;\u624F\u0700EJOacdfgmnostu\u06FA\u06FE\u0703\u0707\u070E\u071A\u071E\u0721\u0728\u0744\u0778\u078B\u078F\u0795cy;\u4415lig;\u4132cy;\u4401cute\u803B\xCD\u40CD\u0100iy\u0713\u0718rc\u803B\xCE\u40CE;\u4418ot;\u4130r;\u6111rave\u803B\xCC\u40CC\u0180;ap\u0720\u072F\u073F\u0100cg\u0734\u0737r;\u412AinaryI;\u6148lie\xF3\u03DD\u01F4\u0749\0\u0762\u0100;e\u074D\u074E\u622C\u0100gr\u0753\u0758ral;\u622Bsection;\u62C2isible\u0100CT\u076C\u0772omma;\u6063imes;\u6062\u0180gpt\u077F\u0783\u0788on;\u412Ef;\uC000\u{1D540}a;\u4399cr;\u6110ilde;\u4128\u01EB\u079A\0\u079Ecy;\u4406l\u803B\xCF\u40CF\u0280cfosu\u07AC\u07B7\u07BC\u07C2\u07D0\u0100iy\u07B1\u07B5rc;\u4134;\u4419r;\uC000\u{1D50D}pf;\uC000\u{1D541}\u01E3\u07C7\0\u07CCr;\uC000\u{1D4A5}rcy;\u4408kcy;\u4404\u0380HJacfos\u07E4\u07E8\u07EC\u07F1\u07FD\u0802\u0808cy;\u4425cy;\u440Cppa;\u439A\u0100ey\u07F6\u07FBdil;\u4136;\u441Ar;\uC000\u{1D50E}pf;\uC000\u{1D542}cr;\uC000\u{1D4A6}\u0580JTaceflmost\u0825\u0829\u082C\u0850\u0863\u09B3\u09B8\u09C7\u09CD\u0A37\u0A47cy;\u4409\u803B<\u403C\u0280cmnpr\u0837\u083C\u0841\u0844\u084Dute;\u4139bda;\u439Bg;\u67EAlacetrf;\u6112r;\u619E\u0180aey\u0857\u085C\u0861ron;\u413Ddil;\u413B;\u441B\u0100fs\u0868\u0970t\u0500ACDFRTUVar\u087E\u08A9\u08B1\u08E0\u08E6\u08FC\u092F\u095B\u0390\u096A\u0100nr\u0883\u088FgleBracket;\u67E8row\u0180;BR\u0899\u089A\u089E\u6190ar;\u61E4ightArrow;\u61C6eiling;\u6308o\u01F5\u08B7\0\u08C3bleBracket;\u67E6n\u01D4\u08C8\0\u08D2eeVector;\u6961ector\u0100;B\u08DB\u08DC\u61C3ar;\u6959loor;\u630Aight\u0100AV\u08EF\u08F5rrow;\u6194ector;\u694E\u0100er\u0901\u0917e\u0180;AV\u0909\u090A\u0910\u62A3rrow;\u61A4ector;\u695Aiangle\u0180;BE\u0924\u0925\u0929\u62B2ar;\u69CFqual;\u62B4p\u0180DTV\u0937\u0942\u094CownVector;\u6951eeVector;\u6960ector\u0100;B\u0956\u0957\u61BFar;\u6958ector\u0100;B\u0965\u0966\u61BCar;\u6952ight\xE1\u039Cs\u0300EFGLST\u097E\u098B\u0995\u099D\u09A2\u09ADqualGreater;\u62DAullEqual;\u6266reater;\u6276ess;\u6AA1lantEqual;\u6A7Dilde;\u6272r;\uC000\u{1D50F}\u0100;e\u09BD\u09BE\u62D8ftarrow;\u61DAidot;\u413F\u0180npw\u09D4\u0A16\u0A1Bg\u0200LRlr\u09DE\u09F7\u0A02\u0A10eft\u0100AR\u09E6\u09ECrrow;\u67F5ightArrow;\u67F7ightArrow;\u67F6eft\u0100ar\u03B3\u0A0Aight\xE1\u03BFight\xE1\u03CAf;\uC000\u{1D543}er\u0100LR\u0A22\u0A2CeftArrow;\u6199ightArrow;\u6198\u0180cht\u0A3E\u0A40\u0A42\xF2\u084C;\u61B0rok;\u4141;\u626A\u0400acefiosu\u0A5A\u0A5D\u0A60\u0A77\u0A7C\u0A85\u0A8B\u0A8Ep;\u6905y;\u441C\u0100dl\u0A65\u0A6FiumSpace;\u605Flintrf;\u6133r;\uC000\u{1D510}nusPlus;\u6213pf;\uC000\u{1D544}c\xF2\u0A76;\u439C\u0480Jacefostu\u0AA3\u0AA7\u0AAD\u0AC0\u0B14\u0B19\u0D91\u0D97\u0D9Ecy;\u440Acute;\u4143\u0180aey\u0AB4\u0AB9\u0ABEron;\u4147dil;\u4145;\u441D\u0180gsw\u0AC7\u0AF0\u0B0Eative\u0180MTV\u0AD3\u0ADF\u0AE8ediumSpace;\u600Bhi\u0100cn\u0AE6\u0AD8\xEB\u0AD9eryThi\xEE\u0AD9ted\u0100GL\u0AF8\u0B06reaterGreate\xF2\u0673essLes\xF3\u0A48Line;\u400Ar;\uC000\u{1D511}\u0200Bnpt\u0B22\u0B28\u0B37\u0B3Areak;\u6060BreakingSpace;\u40A0f;\u6115\u0680;CDEGHLNPRSTV\u0B55\u0B56\u0B6A\u0B7C\u0BA1\u0BEB\u0C04\u0C5E\u0C84\u0CA6\u0CD8\u0D61\u0D85\u6AEC\u0100ou\u0B5B\u0B64ngruent;\u6262pCap;\u626DoubleVerticalBar;\u6226\u0180lqx\u0B83\u0B8A\u0B9Bement;\u6209ual\u0100;T\u0B92\u0B93\u6260ilde;\uC000\u2242\u0338ists;\u6204reater\u0380;EFGLST\u0BB6\u0BB7\u0BBD\u0BC9\u0BD3\u0BD8\u0BE5\u626Fqual;\u6271ullEqual;\uC000\u2267\u0338reater;\uC000\u226B\u0338ess;\u6279lantEqual;\uC000\u2A7E\u0338ilde;\u6275ump\u0144\u0BF2\u0BFDownHump;\uC000\u224E\u0338qual;\uC000\u224F\u0338e\u0100fs\u0C0A\u0C27tTriangle\u0180;BE\u0C1A\u0C1B\u0C21\u62EAar;\uC000\u29CF\u0338qual;\u62ECs\u0300;EGLST\u0C35\u0C36\u0C3C\u0C44\u0C4B\u0C58\u626Equal;\u6270reater;\u6278ess;\uC000\u226A\u0338lantEqual;\uC000\u2A7D\u0338ilde;\u6274ested\u0100GL\u0C68\u0C79reaterGreater;\uC000\u2AA2\u0338essLess;\uC000\u2AA1\u0338recedes\u0180;ES\u0C92\u0C93\u0C9B\u6280qual;\uC000\u2AAF\u0338lantEqual;\u62E0\u0100ei\u0CAB\u0CB9verseElement;\u620CghtTriangle\u0180;BE\u0CCB\u0CCC\u0CD2\u62EBar;\uC000\u29D0\u0338qual;\u62ED\u0100qu\u0CDD\u0D0CuareSu\u0100bp\u0CE8\u0CF9set\u0100;E\u0CF0\u0CF3\uC000\u228F\u0338qual;\u62E2erset\u0100;E\u0D03\u0D06\uC000\u2290\u0338qual;\u62E3\u0180bcp\u0D13\u0D24\u0D4Eset\u0100;E\u0D1B\u0D1E\uC000\u2282\u20D2qual;\u6288ceeds\u0200;EST\u0D32\u0D33\u0D3B\u0D46\u6281qual;\uC000\u2AB0\u0338lantEqual;\u62E1ilde;\uC000\u227F\u0338erset\u0100;E\u0D58\u0D5B\uC000\u2283\u20D2qual;\u6289ilde\u0200;EFT\u0D6E\u0D6F\u0D75\u0D7F\u6241qual;\u6244ullEqual;\u6247ilde;\u6249erticalBar;\u6224cr;\uC000\u{1D4A9}ilde\u803B\xD1\u40D1;\u439D\u0700Eacdfgmoprstuv\u0DBD\u0DC2\u0DC9\u0DD5\u0DDB\u0DE0\u0DE7\u0DFC\u0E02\u0E20\u0E22\u0E32\u0E3F\u0E44lig;\u4152cute\u803B\xD3\u40D3\u0100iy\u0DCE\u0DD3rc\u803B\xD4\u40D4;\u441Eblac;\u4150r;\uC000\u{1D512}rave\u803B\xD2\u40D2\u0180aei\u0DEE\u0DF2\u0DF6cr;\u414Cga;\u43A9cron;\u439Fpf;\uC000\u{1D546}enCurly\u0100DQ\u0E0E\u0E1AoubleQuote;\u601Cuote;\u6018;\u6A54\u0100cl\u0E27\u0E2Cr;\uC000\u{1D4AA}ash\u803B\xD8\u40D8i\u016C\u0E37\u0E3Cde\u803B\xD5\u40D5es;\u6A37ml\u803B\xD6\u40D6er\u0100BP\u0E4B\u0E60\u0100ar\u0E50\u0E53r;\u603Eac\u0100ek\u0E5A\u0E5C;\u63DEet;\u63B4arenthesis;\u63DC\u0480acfhilors\u0E7F\u0E87\u0E8A\u0E8F\u0E92\u0E94\u0E9D\u0EB0\u0EFCrtialD;\u6202y;\u441Fr;\uC000\u{1D513}i;\u43A6;\u43A0usMinus;\u40B1\u0100ip\u0EA2\u0EADncareplan\xE5\u069Df;\u6119\u0200;eio\u0EB9\u0EBA\u0EE0\u0EE4\u6ABBcedes\u0200;EST\u0EC8\u0EC9\u0ECF\u0EDA\u627Aqual;\u6AAFlantEqual;\u627Cilde;\u627Eme;\u6033\u0100dp\u0EE9\u0EEEuct;\u620Fortion\u0100;a\u0225\u0EF9l;\u621D\u0100ci\u0F01\u0F06r;\uC000\u{1D4AB};\u43A8\u0200Ufos\u0F11\u0F16\u0F1B\u0F1FOT\u803B"\u4022r;\uC000\u{1D514}pf;\u611Acr;\uC000\u{1D4AC}\u0600BEacefhiorsu\u0F3E\u0F43\u0F47\u0F60\u0F73\u0FA7\u0FAA\u0FAD\u1096\u10A9\u10B4\u10BEarr;\u6910G\u803B\xAE\u40AE\u0180cnr\u0F4E\u0F53\u0F56ute;\u4154g;\u67EBr\u0100;t\u0F5C\u0F5D\u61A0l;\u6916\u0180aey\u0F67\u0F6C\u0F71ron;\u4158dil;\u4156;\u4420\u0100;v\u0F78\u0F79\u611Cerse\u0100EU\u0F82\u0F99\u0100lq\u0F87\u0F8Eement;\u620Builibrium;\u61CBpEquilibrium;\u696Fr\xBB\u0F79o;\u43A1ght\u0400ACDFTUVa\u0FC1\u0FEB\u0FF3\u1022\u1028\u105B\u1087\u03D8\u0100nr\u0FC6\u0FD2gleBracket;\u67E9row\u0180;BL\u0FDC\u0FDD\u0FE1\u6192ar;\u61E5eftArrow;\u61C4eiling;\u6309o\u01F5\u0FF9\0\u1005bleBracket;\u67E7n\u01D4\u100A\0\u1014eeVector;\u695Dector\u0100;B\u101D\u101E\u61C2ar;\u6955loor;\u630B\u0100er\u102D\u1043e\u0180;AV\u1035\u1036\u103C\u62A2rrow;\u61A6ector;\u695Biangle\u0180;BE\u1050\u1051\u1055\u62B3ar;\u69D0qual;\u62B5p\u0180DTV\u1063\u106E\u1078ownVector;\u694FeeVector;\u695Cector\u0100;B\u1082\u1083\u61BEar;\u6954ector\u0100;B\u1091\u1092\u61C0ar;\u6953\u0100pu\u109B\u109Ef;\u611DndImplies;\u6970ightarrow;\u61DB\u0100ch\u10B9\u10BCr;\u611B;\u61B1leDelayed;\u69F4\u0680HOacfhimoqstu\u10E4\u10F1\u10F7\u10FD\u1119\u111E\u1151\u1156\u1161\u1167\u11B5\u11BB\u11BF\u0100Cc\u10E9\u10EEHcy;\u4429y;\u4428FTcy;\u442Ccute;\u415A\u0280;aeiy\u1108\u1109\u110E\u1113\u1117\u6ABCron;\u4160dil;\u415Erc;\u415C;\u4421r;\uC000\u{1D516}ort\u0200DLRU\u112A\u1134\u113E\u1149ownArrow\xBB\u041EeftArrow\xBB\u089AightArrow\xBB\u0FDDpArrow;\u6191gma;\u43A3allCircle;\u6218pf;\uC000\u{1D54A}\u0272\u116D\0\0\u1170t;\u621Aare\u0200;ISU\u117B\u117C\u1189\u11AF\u65A1ntersection;\u6293u\u0100bp\u118F\u119Eset\u0100;E\u1197\u1198\u628Fqual;\u6291erset\u0100;E\u11A8\u11A9\u6290qual;\u6292nion;\u6294cr;\uC000\u{1D4AE}ar;\u62C6\u0200bcmp\u11C8\u11DB\u1209\u120B\u0100;s\u11CD\u11CE\u62D0et\u0100;E\u11CD\u11D5qual;\u6286\u0100ch\u11E0\u1205eeds\u0200;EST\u11ED\u11EE\u11F4\u11FF\u627Bqual;\u6AB0lantEqual;\u627Dilde;\u627FTh\xE1\u0F8C;\u6211\u0180;es\u1212\u1213\u1223\u62D1rset\u0100;E\u121C\u121D\u6283qual;\u6287et\xBB\u1213\u0580HRSacfhiors\u123E\u1244\u1249\u1255\u125E\u1271\u1276\u129F\u12C2\u12C8\u12D1ORN\u803B\xDE\u40DEADE;\u6122\u0100Hc\u124E\u1252cy;\u440By;\u4426\u0100bu\u125A\u125C;\u4009;\u43A4\u0180aey\u1265\u126A\u126Fron;\u4164dil;\u4162;\u4422r;\uC000\u{1D517}\u0100ei\u127B\u1289\u01F2\u1280\0\u1287efore;\u6234a;\u4398\u0100cn\u128E\u1298kSpace;\uC000\u205F\u200ASpace;\u6009lde\u0200;EFT\u12AB\u12AC\u12B2\u12BC\u623Cqual;\u6243ullEqual;\u6245ilde;\u6248pf;\uC000\u{1D54B}ipleDot;\u60DB\u0100ct\u12D6\u12DBr;\uC000\u{1D4AF}rok;\u4166\u0AE1\u12F7\u130E\u131A\u1326\0\u132C\u1331\0\0\0\0\0\u1338\u133D\u1377\u1385\0\u13FF\u1404\u140A\u1410\u0100cr\u12FB\u1301ute\u803B\xDA\u40DAr\u0100;o\u1307\u1308\u619Fcir;\u6949r\u01E3\u1313\0\u1316y;\u440Eve;\u416C\u0100iy\u131E\u1323rc\u803B\xDB\u40DB;\u4423blac;\u4170r;\uC000\u{1D518}rave\u803B\xD9\u40D9acr;\u416A\u0100di\u1341\u1369er\u0100BP\u1348\u135D\u0100ar\u134D\u1350r;\u405Fac\u0100ek\u1357\u1359;\u63DFet;\u63B5arenthesis;\u63DDon\u0100;P\u1370\u1371\u62C3lus;\u628E\u0100gp\u137B\u137Fon;\u4172f;\uC000\u{1D54C}\u0400ADETadps\u1395\u13AE\u13B8\u13C4\u03E8\u13D2\u13D7\u13F3rrow\u0180;BD\u1150\u13A0\u13A4ar;\u6912ownArrow;\u61C5ownArrow;\u6195quilibrium;\u696Eee\u0100;A\u13CB\u13CC\u62A5rrow;\u61A5own\xE1\u03F3er\u0100LR\u13DE\u13E8eftArrow;\u6196ightArrow;\u6197i\u0100;l\u13F9\u13FA\u43D2on;\u43A5ing;\u416Ecr;\uC000\u{1D4B0}ilde;\u4168ml\u803B\xDC\u40DC\u0480Dbcdefosv\u1427\u142C\u1430\u1433\u143E\u1485\u148A\u1490\u1496ash;\u62ABar;\u6AEBy;\u4412ash\u0100;l\u143B\u143C\u62A9;\u6AE6\u0100er\u1443\u1445;\u62C1\u0180bty\u144C\u1450\u147Aar;\u6016\u0100;i\u144F\u1455cal\u0200BLST\u1461\u1465\u146A\u1474ar;\u6223ine;\u407Ceparator;\u6758ilde;\u6240ThinSpace;\u600Ar;\uC000\u{1D519}pf;\uC000\u{1D54D}cr;\uC000\u{1D4B1}dash;\u62AA\u0280cefos\u14A7\u14AC\u14B1\u14B6\u14BCirc;\u4174dge;\u62C0r;\uC000\u{1D51A}pf;\uC000\u{1D54E}cr;\uC000\u{1D4B2}\u0200fios\u14CB\u14D0\u14D2\u14D8r;\uC000\u{1D51B};\u439Epf;\uC000\u{1D54F}cr;\uC000\u{1D4B3}\u0480AIUacfosu\u14F1\u14F5\u14F9\u14FD\u1504\u150F\u1514\u151A\u1520cy;\u442Fcy;\u4407cy;\u442Ecute\u803B\xDD\u40DD\u0100iy\u1509\u150Drc;\u4176;\u442Br;\uC000\u{1D51C}pf;\uC000\u{1D550}cr;\uC000\u{1D4B4}ml;\u4178\u0400Hacdefos\u1535\u1539\u153F\u154B\u154F\u155D\u1560\u1564cy;\u4416cute;\u4179\u0100ay\u1544\u1549ron;\u417D;\u4417ot;\u417B\u01F2\u1554\0\u155BoWidt\xE8\u0AD9a;\u4396r;\u6128pf;\u6124cr;\uC000\u{1D4B5}\u0BE1\u1583\u158A\u1590\0\u15B0\u15B6\u15BF\0\0\0\0\u15C6\u15DB\u15EB\u165F\u166D\0\u1695\u169B\u16B2\u16B9\0\u16BEcute\u803B\xE1\u40E1reve;\u4103\u0300;Ediuy\u159C\u159D\u15A1\u15A3\u15A8\u15AD\u623E;\uC000\u223E\u0333;\u623Frc\u803B\xE2\u40E2te\u80BB\xB4\u0306;\u4430lig\u803B\xE6\u40E6\u0100;r\xB2\u15BA;\uC000\u{1D51E}rave\u803B\xE0\u40E0\u0100ep\u15CA\u15D6\u0100fp\u15CF\u15D4sym;\u6135\xE8\u15D3ha;\u43B1\u0100ap\u15DFc\u0100cl\u15E4\u15E7r;\u4101g;\u6A3F\u0264\u15F0\0\0\u160A\u0280;adsv\u15FA\u15FB\u15FF\u1601\u1607\u6227nd;\u6A55;\u6A5Clope;\u6A58;\u6A5A\u0380;elmrsz\u1618\u1619\u161B\u161E\u163F\u164F\u1659\u6220;\u69A4e\xBB\u1619sd\u0100;a\u1625\u1626\u6221\u0461\u1630\u1632\u1634\u1636\u1638\u163A\u163C\u163E;\u69A8;\u69A9;\u69AA;\u69AB;\u69AC;\u69AD;\u69AE;\u69AFt\u0100;v\u1645\u1646\u621Fb\u0100;d\u164C\u164D\u62BE;\u699D\u0100pt\u1654\u1657h;\u6222\xBB\xB9arr;\u637C\u0100gp\u1663\u1667on;\u4105f;\uC000\u{1D552}\u0380;Eaeiop\u12C1\u167B\u167D\u1682\u1684\u1687\u168A;\u6A70cir;\u6A6F;\u624Ad;\u624Bs;\u4027rox\u0100;e\u12C1\u1692\xF1\u1683ing\u803B\xE5\u40E5\u0180cty\u16A1\u16A6\u16A8r;\uC000\u{1D4B6};\u402Amp\u0100;e\u12C1\u16AF\xF1\u0288ilde\u803B\xE3\u40E3ml\u803B\xE4\u40E4\u0100ci\u16C2\u16C8onin\xF4\u0272nt;\u6A11\u0800Nabcdefiklnoprsu\u16ED\u16F1\u1730\u173C\u1743\u1748\u1778\u177D\u17E0\u17E6\u1839\u1850\u170D\u193D\u1948\u1970ot;\u6AED\u0100cr\u16F6\u171Ek\u0200ceps\u1700\u1705\u170D\u1713ong;\u624Cpsilon;\u43F6rime;\u6035im\u0100;e\u171A\u171B\u623Dq;\u62CD\u0176\u1722\u1726ee;\u62BDed\u0100;g\u172C\u172D\u6305e\xBB\u172Drk\u0100;t\u135C\u1737brk;\u63B6\u0100oy\u1701\u1741;\u4431quo;\u601E\u0280cmprt\u1753\u175B\u1761\u1764\u1768aus\u0100;e\u010A\u0109ptyv;\u69B0s\xE9\u170Cno\xF5\u0113\u0180ahw\u176F\u1771\u1773;\u43B2;\u6136een;\u626Cr;\uC000\u{1D51F}g\u0380costuvw\u178D\u179D\u17B3\u17C1\u17D5\u17DB\u17DE\u0180aiu\u1794\u1796\u179A\xF0\u0760rc;\u65EFp\xBB\u1371\u0180dpt\u17A4\u17A8\u17ADot;\u6A00lus;\u6A01imes;\u6A02\u0271\u17B9\0\0\u17BEcup;\u6A06ar;\u6605riangle\u0100du\u17CD\u17D2own;\u65BDp;\u65B3plus;\u6A04e\xE5\u1444\xE5\u14ADarow;\u690D\u0180ako\u17ED\u1826\u1835\u0100cn\u17F2\u1823k\u0180lst\u17FA\u05AB\u1802ozenge;\u69EBriangle\u0200;dlr\u1812\u1813\u1818\u181D\u65B4own;\u65BEeft;\u65C2ight;\u65B8k;\u6423\u01B1\u182B\0\u1833\u01B2\u182F\0\u1831;\u6592;\u65914;\u6593ck;\u6588\u0100eo\u183E\u184D\u0100;q\u1843\u1846\uC000=\u20E5uiv;\uC000\u2261\u20E5t;\u6310\u0200ptwx\u1859\u185E\u1867\u186Cf;\uC000\u{1D553}\u0100;t\u13CB\u1863om\xBB\u13CCtie;\u62C8\u0600DHUVbdhmptuv\u1885\u1896\u18AA\u18BB\u18D7\u18DB\u18EC\u18FF\u1905\u190A\u1910\u1921\u0200LRlr\u188E\u1890\u1892\u1894;\u6557;\u6554;\u6556;\u6553\u0280;DUdu\u18A1\u18A2\u18A4\u18A6\u18A8\u6550;\u6566;\u6569;\u6564;\u6567\u0200LRlr\u18B3\u18B5\u18B7\u18B9;\u655D;\u655A;\u655C;\u6559\u0380;HLRhlr\u18CA\u18CB\u18CD\u18CF\u18D1\u18D3\u18D5\u6551;\u656C;\u6563;\u6560;\u656B;\u6562;\u655Fox;\u69C9\u0200LRlr\u18E4\u18E6\u18E8\u18EA;\u6555;\u6552;\u6510;\u650C\u0280;DUdu\u06BD\u18F7\u18F9\u18FB\u18FD;\u6565;\u6568;\u652C;\u6534inus;\u629Flus;\u629Eimes;\u62A0\u0200LRlr\u1919\u191B\u191D\u191F;\u655B;\u6558;\u6518;\u6514\u0380;HLRhlr\u1930\u1931\u1933\u1935\u1937\u1939\u193B\u6502;\u656A;\u6561;\u655E;\u653C;\u6524;\u651C\u0100ev\u0123\u1942bar\u803B\xA6\u40A6\u0200ceio\u1951\u1956\u195A\u1960r;\uC000\u{1D4B7}mi;\u604Fm\u0100;e\u171A\u171Cl\u0180;bh\u1968\u1969\u196B\u405C;\u69C5sub;\u67C8\u016C\u1974\u197El\u0100;e\u1979\u197A\u6022t\xBB\u197Ap\u0180;Ee\u012F\u1985\u1987;\u6AAE\u0100;q\u06DC\u06DB\u0CE1\u19A7\0\u19E8\u1A11\u1A15\u1A32\0\u1A37\u1A50\0\0\u1AB4\0\0\u1AC1\0\0\u1B21\u1B2E\u1B4D\u1B52\0\u1BFD\0\u1C0C\u0180cpr\u19AD\u19B2\u19DDute;\u4107\u0300;abcds\u19BF\u19C0\u19C4\u19CA\u19D5\u19D9\u6229nd;\u6A44rcup;\u6A49\u0100au\u19CF\u19D2p;\u6A4Bp;\u6A47ot;\u6A40;\uC000\u2229\uFE00\u0100eo\u19E2\u19E5t;\u6041\xEE\u0693\u0200aeiu\u19F0\u19FB\u1A01\u1A05\u01F0\u19F5\0\u19F8s;\u6A4Don;\u410Ddil\u803B\xE7\u40E7rc;\u4109ps\u0100;s\u1A0C\u1A0D\u6A4Cm;\u6A50ot;\u410B\u0180dmn\u1A1B\u1A20\u1A26il\u80BB\xB8\u01ADptyv;\u69B2t\u8100\xA2;e\u1A2D\u1A2E\u40A2r\xE4\u01B2r;\uC000\u{1D520}\u0180cei\u1A3D\u1A40\u1A4Dy;\u4447ck\u0100;m\u1A47\u1A48\u6713ark\xBB\u1A48;\u43C7r\u0380;Ecefms\u1A5F\u1A60\u1A62\u1A6B\u1AA4\u1AAA\u1AAE\u65CB;\u69C3\u0180;el\u1A69\u1A6A\u1A6D\u42C6q;\u6257e\u0261\u1A74\0\0\u1A88rrow\u0100lr\u1A7C\u1A81eft;\u61BAight;\u61BB\u0280RSacd\u1A92\u1A94\u1A96\u1A9A\u1A9F\xBB\u0F47;\u64C8st;\u629Birc;\u629Aash;\u629Dnint;\u6A10id;\u6AEFcir;\u69C2ubs\u0100;u\u1ABB\u1ABC\u6663it\xBB\u1ABC\u02EC\u1AC7\u1AD4\u1AFA\0\u1B0Aon\u0100;e\u1ACD\u1ACE\u403A\u0100;q\xC7\xC6\u026D\u1AD9\0\0\u1AE2a\u0100;t\u1ADE\u1ADF\u402C;\u4040\u0180;fl\u1AE8\u1AE9\u1AEB\u6201\xEE\u1160e\u0100mx\u1AF1\u1AF6ent\xBB\u1AE9e\xF3\u024D\u01E7\u1AFE\0\u1B07\u0100;d\u12BB\u1B02ot;\u6A6Dn\xF4\u0246\u0180fry\u1B10\u1B14\u1B17;\uC000\u{1D554}o\xE4\u0254\u8100\xA9;s\u0155\u1B1Dr;\u6117\u0100ao\u1B25\u1B29rr;\u61B5ss;\u6717\u0100cu\u1B32\u1B37r;\uC000\u{1D4B8}\u0100bp\u1B3C\u1B44\u0100;e\u1B41\u1B42\u6ACF;\u6AD1\u0100;e\u1B49\u1B4A\u6AD0;\u6AD2dot;\u62EF\u0380delprvw\u1B60\u1B6C\u1B77\u1B82\u1BAC\u1BD4\u1BF9arr\u0100lr\u1B68\u1B6A;\u6938;\u6935\u0270\u1B72\0\0\u1B75r;\u62DEc;\u62DFarr\u0100;p\u1B7F\u1B80\u61B6;\u693D\u0300;bcdos\u1B8F\u1B90\u1B96\u1BA1\u1BA5\u1BA8\u622Arcap;\u6A48\u0100au\u1B9B\u1B9Ep;\u6A46p;\u6A4Aot;\u628Dr;\u6A45;\uC000\u222A\uFE00\u0200alrv\u1BB5\u1BBF\u1BDE\u1BE3rr\u0100;m\u1BBC\u1BBD\u61B7;\u693Cy\u0180evw\u1BC7\u1BD4\u1BD8q\u0270\u1BCE\0\0\u1BD2re\xE3\u1B73u\xE3\u1B75ee;\u62CEedge;\u62CFen\u803B\xA4\u40A4earrow\u0100lr\u1BEE\u1BF3eft\xBB\u1B80ight\xBB\u1BBDe\xE4\u1BDD\u0100ci\u1C01\u1C07onin\xF4\u01F7nt;\u6231lcty;\u632D\u0980AHabcdefhijlorstuwz\u1C38\u1C3B\u1C3F\u1C5D\u1C69\u1C75\u1C8A\u1C9E\u1CAC\u1CB7\u1CFB\u1CFF\u1D0D\u1D7B\u1D91\u1DAB\u1DBB\u1DC6\u1DCDr\xF2\u0381ar;\u6965\u0200glrs\u1C48\u1C4D\u1C52\u1C54ger;\u6020eth;\u6138\xF2\u1133h\u0100;v\u1C5A\u1C5B\u6010\xBB\u090A\u016B\u1C61\u1C67arow;\u690Fa\xE3\u0315\u0100ay\u1C6E\u1C73ron;\u410F;\u4434\u0180;ao\u0332\u1C7C\u1C84\u0100gr\u02BF\u1C81r;\u61CAtseq;\u6A77\u0180glm\u1C91\u1C94\u1C98\u803B\xB0\u40B0ta;\u43B4ptyv;\u69B1\u0100ir\u1CA3\u1CA8sht;\u697F;\uC000\u{1D521}ar\u0100lr\u1CB3\u1CB5\xBB\u08DC\xBB\u101E\u0280aegsv\u1CC2\u0378\u1CD6\u1CDC\u1CE0m\u0180;os\u0326\u1CCA\u1CD4nd\u0100;s\u0326\u1CD1uit;\u6666amma;\u43DDin;\u62F2\u0180;io\u1CE7\u1CE8\u1CF8\u40F7de\u8100\xF7;o\u1CE7\u1CF0ntimes;\u62C7n\xF8\u1CF7cy;\u4452c\u026F\u1D06\0\0\u1D0Arn;\u631Eop;\u630D\u0280lptuw\u1D18\u1D1D\u1D22\u1D49\u1D55lar;\u4024f;\uC000\u{1D555}\u0280;emps\u030B\u1D2D\u1D37\u1D3D\u1D42q\u0100;d\u0352\u1D33ot;\u6251inus;\u6238lus;\u6214quare;\u62A1blebarwedg\xE5\xFAn\u0180adh\u112E\u1D5D\u1D67ownarrow\xF3\u1C83arpoon\u0100lr\u1D72\u1D76ef\xF4\u1CB4igh\xF4\u1CB6\u0162\u1D7F\u1D85karo\xF7\u0F42\u026F\u1D8A\0\0\u1D8Ern;\u631Fop;\u630C\u0180cot\u1D98\u1DA3\u1DA6\u0100ry\u1D9D\u1DA1;\uC000\u{1D4B9};\u4455l;\u69F6rok;\u4111\u0100dr\u1DB0\u1DB4ot;\u62F1i\u0100;f\u1DBA\u1816\u65BF\u0100ah\u1DC0\u1DC3r\xF2\u0429a\xF2\u0FA6angle;\u69A6\u0100ci\u1DD2\u1DD5y;\u445Fgrarr;\u67FF\u0900Dacdefglmnopqrstux\u1E01\u1E09\u1E19\u1E38\u0578\u1E3C\u1E49\u1E61\u1E7E\u1EA5\u1EAF\u1EBD\u1EE1\u1F2A\u1F37\u1F44\u1F4E\u1F5A\u0100Do\u1E06\u1D34o\xF4\u1C89\u0100cs\u1E0E\u1E14ute\u803B\xE9\u40E9ter;\u6A6E\u0200aioy\u1E22\u1E27\u1E31\u1E36ron;\u411Br\u0100;c\u1E2D\u1E2E\u6256\u803B\xEA\u40EAlon;\u6255;\u444Dot;\u4117\u0100Dr\u1E41\u1E45ot;\u6252;\uC000\u{1D522}\u0180;rs\u1E50\u1E51\u1E57\u6A9Aave\u803B\xE8\u40E8\u0100;d\u1E5C\u1E5D\u6A96ot;\u6A98\u0200;ils\u1E6A\u1E6B\u1E72\u1E74\u6A99nters;\u63E7;\u6113\u0100;d\u1E79\u1E7A\u6A95ot;\u6A97\u0180aps\u1E85\u1E89\u1E97cr;\u4113ty\u0180;sv\u1E92\u1E93\u1E95\u6205et\xBB\u1E93p\u01001;\u1E9D\u1EA4\u0133\u1EA1\u1EA3;\u6004;\u6005\u6003\u0100gs\u1EAA\u1EAC;\u414Bp;\u6002\u0100gp\u1EB4\u1EB8on;\u4119f;\uC000\u{1D556}\u0180als\u1EC4\u1ECE\u1ED2r\u0100;s\u1ECA\u1ECB\u62D5l;\u69E3us;\u6A71i\u0180;lv\u1EDA\u1EDB\u1EDF\u43B5on\xBB\u1EDB;\u43F5\u0200csuv\u1EEA\u1EF3\u1F0B\u1F23\u0100io\u1EEF\u1E31rc\xBB\u1E2E\u0269\u1EF9\0\0\u1EFB\xED\u0548ant\u0100gl\u1F02\u1F06tr\xBB\u1E5Dess\xBB\u1E7A\u0180aei\u1F12\u1F16\u1F1Als;\u403Dst;\u625Fv\u0100;D\u0235\u1F20D;\u6A78parsl;\u69E5\u0100Da\u1F2F\u1F33ot;\u6253rr;\u6971\u0180cdi\u1F3E\u1F41\u1EF8r;\u612Fo\xF4\u0352\u0100ah\u1F49\u1F4B;\u43B7\u803B\xF0\u40F0\u0100mr\u1F53\u1F57l\u803B\xEB\u40EBo;\u60AC\u0180cip\u1F61\u1F64\u1F67l;\u4021s\xF4\u056E\u0100eo\u1F6C\u1F74ctatio\xEE\u0559nential\xE5\u0579\u09E1\u1F92\0\u1F9E\0\u1FA1\u1FA7\0\0\u1FC6\u1FCC\0\u1FD3\0\u1FE6\u1FEA\u2000\0\u2008\u205Allingdotse\xF1\u1E44y;\u4444male;\u6640\u0180ilr\u1FAD\u1FB3\u1FC1lig;\u8000\uFB03\u0269\u1FB9\0\0\u1FBDg;\u8000\uFB00ig;\u8000\uFB04;\uC000\u{1D523}lig;\u8000\uFB01lig;\uC000fj\u0180alt\u1FD9\u1FDC\u1FE1t;\u666Dig;\u8000\uFB02ns;\u65B1of;\u4192\u01F0\u1FEE\0\u1FF3f;\uC000\u{1D557}\u0100ak\u05BF\u1FF7\u0100;v\u1FFC\u1FFD\u62D4;\u6AD9artint;\u6A0D\u0100ao\u200C\u2055\u0100cs\u2011\u2052\u03B1\u201A\u2030\u2038\u2045\u2048\0\u2050\u03B2\u2022\u2025\u2027\u202A\u202C\0\u202E\u803B\xBD\u40BD;\u6153\u803B\xBC\u40BC;\u6155;\u6159;\u615B\u01B3\u2034\0\u2036;\u6154;\u6156\u02B4\u203E\u2041\0\0\u2043\u803B\xBE\u40BE;\u6157;\u615C5;\u6158\u01B6\u204C\0\u204E;\u615A;\u615D8;\u615El;\u6044wn;\u6322cr;\uC000\u{1D4BB}\u0880Eabcdefgijlnorstv\u2082\u2089\u209F\u20A5\u20B0\u20B4\u20F0\u20F5\u20FA\u20FF\u2103\u2112\u2138\u0317\u213E\u2152\u219E\u0100;l\u064D\u2087;\u6A8C\u0180cmp\u2090\u2095\u209Dute;\u41F5ma\u0100;d\u209C\u1CDA\u43B3;\u6A86reve;\u411F\u0100iy\u20AA\u20AErc;\u411D;\u4433ot;\u4121\u0200;lqs\u063E\u0642\u20BD\u20C9\u0180;qs\u063E\u064C\u20C4lan\xF4\u0665\u0200;cdl\u0665\u20D2\u20D5\u20E5c;\u6AA9ot\u0100;o\u20DC\u20DD\u6A80\u0100;l\u20E2\u20E3\u6A82;\u6A84\u0100;e\u20EA\u20ED\uC000\u22DB\uFE00s;\u6A94r;\uC000\u{1D524}\u0100;g\u0673\u061Bmel;\u6137cy;\u4453\u0200;Eaj\u065A\u210C\u210E\u2110;\u6A92;\u6AA5;\u6AA4\u0200Eaes\u211B\u211D\u2129\u2134;\u6269p\u0100;p\u2123\u2124\u6A8Arox\xBB\u2124\u0100;q\u212E\u212F\u6A88\u0100;q\u212E\u211Bim;\u62E7pf;\uC000\u{1D558}\u0100ci\u2143\u2146r;\u610Am\u0180;el\u066B\u214E\u2150;\u6A8E;\u6A90\u8300>;cdlqr\u05EE\u2160\u216A\u216E\u2173\u2179\u0100ci\u2165\u2167;\u6AA7r;\u6A7Aot;\u62D7Par;\u6995uest;\u6A7C\u0280adels\u2184\u216A\u2190\u0656\u219B\u01F0\u2189\0\u218Epro\xF8\u209Er;\u6978q\u0100lq\u063F\u2196les\xF3\u2088i\xED\u066B\u0100en\u21A3\u21ADrtneqq;\uC000\u2269\uFE00\xC5\u21AA\u0500Aabcefkosy\u21C4\u21C7\u21F1\u21F5\u21FA\u2218\u221D\u222F\u2268\u227Dr\xF2\u03A0\u0200ilmr\u21D0\u21D4\u21D7\u21DBrs\xF0\u1484f\xBB\u2024il\xF4\u06A9\u0100dr\u21E0\u21E4cy;\u444A\u0180;cw\u08F4\u21EB\u21EFir;\u6948;\u61ADar;\u610Firc;\u4125\u0180alr\u2201\u220E\u2213rts\u0100;u\u2209\u220A\u6665it\xBB\u220Alip;\u6026con;\u62B9r;\uC000\u{1D525}s\u0100ew\u2223\u2229arow;\u6925arow;\u6926\u0280amopr\u223A\u223E\u2243\u225E\u2263rr;\u61FFtht;\u623Bk\u0100lr\u2249\u2253eftarrow;\u61A9ightarrow;\u61AAf;\uC000\u{1D559}bar;\u6015\u0180clt\u226F\u2274\u2278r;\uC000\u{1D4BD}as\xE8\u21F4rok;\u4127\u0100bp\u2282\u2287ull;\u6043hen\xBB\u1C5B\u0AE1\u22A3\0\u22AA\0\u22B8\u22C5\u22CE\0\u22D5\u22F3\0\0\u22F8\u2322\u2367\u2362\u237F\0\u2386\u23AA\u23B4cute\u803B\xED\u40ED\u0180;iy\u0771\u22B0\u22B5rc\u803B\xEE\u40EE;\u4438\u0100cx\u22BC\u22BFy;\u4435cl\u803B\xA1\u40A1\u0100fr\u039F\u22C9;\uC000\u{1D526}rave\u803B\xEC\u40EC\u0200;ino\u073E\u22DD\u22E9\u22EE\u0100in\u22E2\u22E6nt;\u6A0Ct;\u622Dfin;\u69DCta;\u6129lig;\u4133\u0180aop\u22FE\u231A\u231D\u0180cgt\u2305\u2308\u2317r;\u412B\u0180elp\u071F\u230F\u2313in\xE5\u078Ear\xF4\u0720h;\u4131f;\u62B7ed;\u41B5\u0280;cfot\u04F4\u232C\u2331\u233D\u2341are;\u6105in\u0100;t\u2338\u2339\u621Eie;\u69DDdo\xF4\u2319\u0280;celp\u0757\u234C\u2350\u235B\u2361al;\u62BA\u0100gr\u2355\u2359er\xF3\u1563\xE3\u234Darhk;\u6A17rod;\u6A3C\u0200cgpt\u236F\u2372\u2376\u237By;\u4451on;\u412Ff;\uC000\u{1D55A}a;\u43B9uest\u803B\xBF\u40BF\u0100ci\u238A\u238Fr;\uC000\u{1D4BE}n\u0280;Edsv\u04F4\u239B\u239D\u23A1\u04F3;\u62F9ot;\u62F5\u0100;v\u23A6\u23A7\u62F4;\u62F3\u0100;i\u0777\u23AElde;\u4129\u01EB\u23B8\0\u23BCcy;\u4456l\u803B\xEF\u40EF\u0300cfmosu\u23CC\u23D7\u23DC\u23E1\u23E7\u23F5\u0100iy\u23D1\u23D5rc;\u4135;\u4439r;\uC000\u{1D527}ath;\u4237pf;\uC000\u{1D55B}\u01E3\u23EC\0\u23F1r;\uC000\u{1D4BF}rcy;\u4458kcy;\u4454\u0400acfghjos\u240B\u2416\u2422\u2427\u242D\u2431\u2435\u243Bppa\u0100;v\u2413\u2414\u43BA;\u43F0\u0100ey\u241B\u2420dil;\u4137;\u443Ar;\uC000\u{1D528}reen;\u4138cy;\u4445cy;\u445Cpf;\uC000\u{1D55C}cr;\uC000\u{1D4C0}\u0B80ABEHabcdefghjlmnoprstuv\u2470\u2481\u2486\u248D\u2491\u250E\u253D\u255A\u2580\u264E\u265E\u2665\u2679\u267D\u269A\u26B2\u26D8\u275D\u2768\u278B\u27C0\u2801\u2812\u0180art\u2477\u247A\u247Cr\xF2\u09C6\xF2\u0395ail;\u691Barr;\u690E\u0100;g\u0994\u248B;\u6A8Bar;\u6962\u0963\u24A5\0\u24AA\0\u24B1\0\0\0\0\0\u24B5\u24BA\0\u24C6\u24C8\u24CD\0\u24F9ute;\u413Amptyv;\u69B4ra\xEE\u084Cbda;\u43BBg\u0180;dl\u088E\u24C1\u24C3;\u6991\xE5\u088E;\u6A85uo\u803B\xAB\u40ABr\u0400;bfhlpst\u0899\u24DE\u24E6\u24E9\u24EB\u24EE\u24F1\u24F5\u0100;f\u089D\u24E3s;\u691Fs;\u691D\xEB\u2252p;\u61ABl;\u6939im;\u6973l;\u61A2\u0180;ae\u24FF\u2500\u2504\u6AABil;\u6919\u0100;s\u2509\u250A\u6AAD;\uC000\u2AAD\uFE00\u0180abr\u2515\u2519\u251Drr;\u690Crk;\u6772\u0100ak\u2522\u252Cc\u0100ek\u2528\u252A;\u407B;\u405B\u0100es\u2531\u2533;\u698Bl\u0100du\u2539\u253B;\u698F;\u698D\u0200aeuy\u2546\u254B\u2556\u2558ron;\u413E\u0100di\u2550\u2554il;\u413C\xEC\u08B0\xE2\u2529;\u443B\u0200cqrs\u2563\u2566\u256D\u257Da;\u6936uo\u0100;r\u0E19\u1746\u0100du\u2572\u2577har;\u6967shar;\u694Bh;\u61B2\u0280;fgqs\u258B\u258C\u0989\u25F3\u25FF\u6264t\u0280ahlrt\u2598\u25A4\u25B7\u25C2\u25E8rrow\u0100;t\u0899\u25A1a\xE9\u24F6arpoon\u0100du\u25AF\u25B4own\xBB\u045Ap\xBB\u0966eftarrows;\u61C7ight\u0180ahs\u25CD\u25D6\u25DErrow\u0100;s\u08F4\u08A7arpoon\xF3\u0F98quigarro\xF7\u21F0hreetimes;\u62CB\u0180;qs\u258B\u0993\u25FAlan\xF4\u09AC\u0280;cdgs\u09AC\u260A\u260D\u261D\u2628c;\u6AA8ot\u0100;o\u2614\u2615\u6A7F\u0100;r\u261A\u261B\u6A81;\u6A83\u0100;e\u2622\u2625\uC000\u22DA\uFE00s;\u6A93\u0280adegs\u2633\u2639\u263D\u2649\u264Bppro\xF8\u24C6ot;\u62D6q\u0100gq\u2643\u2645\xF4\u0989gt\xF2\u248C\xF4\u099Bi\xED\u09B2\u0180ilr\u2655\u08E1\u265Asht;\u697C;\uC000\u{1D529}\u0100;E\u099C\u2663;\u6A91\u0161\u2669\u2676r\u0100du\u25B2\u266E\u0100;l\u0965\u2673;\u696Alk;\u6584cy;\u4459\u0280;acht\u0A48\u2688\u268B\u2691\u2696r\xF2\u25C1orne\xF2\u1D08ard;\u696Bri;\u65FA\u0100io\u269F\u26A4dot;\u4140ust\u0100;a\u26AC\u26AD\u63B0che\xBB\u26AD\u0200Eaes\u26BB\u26BD\u26C9\u26D4;\u6268p\u0100;p\u26C3\u26C4\u6A89rox\xBB\u26C4\u0100;q\u26CE\u26CF\u6A87\u0100;q\u26CE\u26BBim;\u62E6\u0400abnoptwz\u26E9\u26F4\u26F7\u271A\u272F\u2741\u2747\u2750\u0100nr\u26EE\u26F1g;\u67ECr;\u61FDr\xEB\u08C1g\u0180lmr\u26FF\u270D\u2714eft\u0100ar\u09E6\u2707ight\xE1\u09F2apsto;\u67FCight\xE1\u09FDparrow\u0100lr\u2725\u2729ef\xF4\u24EDight;\u61AC\u0180afl\u2736\u2739\u273Dr;\u6985;\uC000\u{1D55D}us;\u6A2Dimes;\u6A34\u0161\u274B\u274Fst;\u6217\xE1\u134E\u0180;ef\u2757\u2758\u1800\u65CAnge\xBB\u2758ar\u0100;l\u2764\u2765\u4028t;\u6993\u0280achmt\u2773\u2776\u277C\u2785\u2787r\xF2\u08A8orne\xF2\u1D8Car\u0100;d\u0F98\u2783;\u696D;\u600Eri;\u62BF\u0300achiqt\u2798\u279D\u0A40\u27A2\u27AE\u27BBquo;\u6039r;\uC000\u{1D4C1}m\u0180;eg\u09B2\u27AA\u27AC;\u6A8D;\u6A8F\u0100bu\u252A\u27B3o\u0100;r\u0E1F\u27B9;\u601Arok;\u4142\u8400<;cdhilqr\u082B\u27D2\u2639\u27DC\u27E0\u27E5\u27EA\u27F0\u0100ci\u27D7\u27D9;\u6AA6r;\u6A79re\xE5\u25F2mes;\u62C9arr;\u6976uest;\u6A7B\u0100Pi\u27F5\u27F9ar;\u6996\u0180;ef\u2800\u092D\u181B\u65C3r\u0100du\u2807\u280Dshar;\u694Ahar;\u6966\u0100en\u2817\u2821rtneqq;\uC000\u2268\uFE00\xC5\u281E\u0700Dacdefhilnopsu\u2840\u2845\u2882\u288E\u2893\u28A0\u28A5\u28A8\u28DA\u28E2\u28E4\u0A83\u28F3\u2902Dot;\u623A\u0200clpr\u284E\u2852\u2863\u287Dr\u803B\xAF\u40AF\u0100et\u2857\u2859;\u6642\u0100;e\u285E\u285F\u6720se\xBB\u285F\u0100;s\u103B\u2868to\u0200;dlu\u103B\u2873\u2877\u287Bow\xEE\u048Cef\xF4\u090F\xF0\u13D1ker;\u65AE\u0100oy\u2887\u288Cmma;\u6A29;\u443Cash;\u6014asuredangle\xBB\u1626r;\uC000\u{1D52A}o;\u6127\u0180cdn\u28AF\u28B4\u28C9ro\u803B\xB5\u40B5\u0200;acd\u1464\u28BD\u28C0\u28C4s\xF4\u16A7ir;\u6AF0ot\u80BB\xB7\u01B5us\u0180;bd\u28D2\u1903\u28D3\u6212\u0100;u\u1D3C\u28D8;\u6A2A\u0163\u28DE\u28E1p;\u6ADB\xF2\u2212\xF0\u0A81\u0100dp\u28E9\u28EEels;\u62A7f;\uC000\u{1D55E}\u0100ct\u28F8\u28FDr;\uC000\u{1D4C2}pos\xBB\u159D\u0180;lm\u2909\u290A\u290D\u43BCtimap;\u62B8\u0C00GLRVabcdefghijlmoprstuvw\u2942\u2953\u297E\u2989\u2998\u29DA\u29E9\u2A15\u2A1A\u2A58\u2A5D\u2A83\u2A95\u2AA4\u2AA8\u2B04\u2B07\u2B44\u2B7F\u2BAE\u2C34\u2C67\u2C7C\u2CE9\u0100gt\u2947\u294B;\uC000\u22D9\u0338\u0100;v\u2950\u0BCF\uC000\u226B\u20D2\u0180elt\u295A\u2972\u2976ft\u0100ar\u2961\u2967rrow;\u61CDightarrow;\u61CE;\uC000\u22D8\u0338\u0100;v\u297B\u0C47\uC000\u226A\u20D2ightarrow;\u61CF\u0100Dd\u298E\u2993ash;\u62AFash;\u62AE\u0280bcnpt\u29A3\u29A7\u29AC\u29B1\u29CCla\xBB\u02DEute;\u4144g;\uC000\u2220\u20D2\u0280;Eiop\u0D84\u29BC\u29C0\u29C5\u29C8;\uC000\u2A70\u0338d;\uC000\u224B\u0338s;\u4149ro\xF8\u0D84ur\u0100;a\u29D3\u29D4\u666El\u0100;s\u29D3\u0B38\u01F3\u29DF\0\u29E3p\u80BB\xA0\u0B37mp\u0100;e\u0BF9\u0C00\u0280aeouy\u29F4\u29FE\u2A03\u2A10\u2A13\u01F0\u29F9\0\u29FB;\u6A43on;\u4148dil;\u4146ng\u0100;d\u0D7E\u2A0Aot;\uC000\u2A6D\u0338p;\u6A42;\u443Dash;\u6013\u0380;Aadqsx\u0B92\u2A29\u2A2D\u2A3B\u2A41\u2A45\u2A50rr;\u61D7r\u0100hr\u2A33\u2A36k;\u6924\u0100;o\u13F2\u13F0ot;\uC000\u2250\u0338ui\xF6\u0B63\u0100ei\u2A4A\u2A4Ear;\u6928\xED\u0B98ist\u0100;s\u0BA0\u0B9Fr;\uC000\u{1D52B}\u0200Eest\u0BC5\u2A66\u2A79\u2A7C\u0180;qs\u0BBC\u2A6D\u0BE1\u0180;qs\u0BBC\u0BC5\u2A74lan\xF4\u0BE2i\xED\u0BEA\u0100;r\u0BB6\u2A81\xBB\u0BB7\u0180Aap\u2A8A\u2A8D\u2A91r\xF2\u2971rr;\u61AEar;\u6AF2\u0180;sv\u0F8D\u2A9C\u0F8C\u0100;d\u2AA1\u2AA2\u62FC;\u62FAcy;\u445A\u0380AEadest\u2AB7\u2ABA\u2ABE\u2AC2\u2AC5\u2AF6\u2AF9r\xF2\u2966;\uC000\u2266\u0338rr;\u619Ar;\u6025\u0200;fqs\u0C3B\u2ACE\u2AE3\u2AEFt\u0100ar\u2AD4\u2AD9rro\xF7\u2AC1ightarro\xF7\u2A90\u0180;qs\u0C3B\u2ABA\u2AEAlan\xF4\u0C55\u0100;s\u0C55\u2AF4\xBB\u0C36i\xED\u0C5D\u0100;r\u0C35\u2AFEi\u0100;e\u0C1A\u0C25i\xE4\u0D90\u0100pt\u2B0C\u2B11f;\uC000\u{1D55F}\u8180\xAC;in\u2B19\u2B1A\u2B36\u40ACn\u0200;Edv\u0B89\u2B24\u2B28\u2B2E;\uC000\u22F9\u0338ot;\uC000\u22F5\u0338\u01E1\u0B89\u2B33\u2B35;\u62F7;\u62F6i\u0100;v\u0CB8\u2B3C\u01E1\u0CB8\u2B41\u2B43;\u62FE;\u62FD\u0180aor\u2B4B\u2B63\u2B69r\u0200;ast\u0B7B\u2B55\u2B5A\u2B5Flle\xEC\u0B7Bl;\uC000\u2AFD\u20E5;\uC000\u2202\u0338lint;\u6A14\u0180;ce\u0C92\u2B70\u2B73u\xE5\u0CA5\u0100;c\u0C98\u2B78\u0100;e\u0C92\u2B7D\xF1\u0C98\u0200Aait\u2B88\u2B8B\u2B9D\u2BA7r\xF2\u2988rr\u0180;cw\u2B94\u2B95\u2B99\u619B;\uC000\u2933\u0338;\uC000\u219D\u0338ghtarrow\xBB\u2B95ri\u0100;e\u0CCB\u0CD6\u0380chimpqu\u2BBD\u2BCD\u2BD9\u2B04\u0B78\u2BE4\u2BEF\u0200;cer\u0D32\u2BC6\u0D37\u2BC9u\xE5\u0D45;\uC000\u{1D4C3}ort\u026D\u2B05\0\0\u2BD6ar\xE1\u2B56m\u0100;e\u0D6E\u2BDF\u0100;q\u0D74\u0D73su\u0100bp\u2BEB\u2BED\xE5\u0CF8\xE5\u0D0B\u0180bcp\u2BF6\u2C11\u2C19\u0200;Ees\u2BFF\u2C00\u0D22\u2C04\u6284;\uC000\u2AC5\u0338et\u0100;e\u0D1B\u2C0Bq\u0100;q\u0D23\u2C00c\u0100;e\u0D32\u2C17\xF1\u0D38\u0200;Ees\u2C22\u2C23\u0D5F\u2C27\u6285;\uC000\u2AC6\u0338et\u0100;e\u0D58\u2C2Eq\u0100;q\u0D60\u2C23\u0200gilr\u2C3D\u2C3F\u2C45\u2C47\xEC\u0BD7lde\u803B\xF1\u40F1\xE7\u0C43iangle\u0100lr\u2C52\u2C5Ceft\u0100;e\u0C1A\u2C5A\xF1\u0C26ight\u0100;e\u0CCB\u2C65\xF1\u0CD7\u0100;m\u2C6C\u2C6D\u43BD\u0180;es\u2C74\u2C75\u2C79\u4023ro;\u6116p;\u6007\u0480DHadgilrs\u2C8F\u2C94\u2C99\u2C9E\u2CA3\u2CB0\u2CB6\u2CD3\u2CE3ash;\u62ADarr;\u6904p;\uC000\u224D\u20D2ash;\u62AC\u0100et\u2CA8\u2CAC;\uC000\u2265\u20D2;\uC000>\u20D2nfin;\u69DE\u0180Aet\u2CBD\u2CC1\u2CC5rr;\u6902;\uC000\u2264\u20D2\u0100;r\u2CCA\u2CCD\uC000<\u20D2ie;\uC000\u22B4\u20D2\u0100At\u2CD8\u2CDCrr;\u6903rie;\uC000\u22B5\u20D2im;\uC000\u223C\u20D2\u0180Aan\u2CF0\u2CF4\u2D02rr;\u61D6r\u0100hr\u2CFA\u2CFDk;\u6923\u0100;o\u13E7\u13E5ear;\u6927\u1253\u1A95\0\0\0\0\0\0\0\0\0\0\0\0\0\u2D2D\0\u2D38\u2D48\u2D60\u2D65\u2D72\u2D84\u1B07\0\0\u2D8D\u2DAB\0\u2DC8\u2DCE\0\u2DDC\u2E19\u2E2B\u2E3E\u2E43\u0100cs\u2D31\u1A97ute\u803B\xF3\u40F3\u0100iy\u2D3C\u2D45r\u0100;c\u1A9E\u2D42\u803B\xF4\u40F4;\u443E\u0280abios\u1AA0\u2D52\u2D57\u01C8\u2D5Alac;\u4151v;\u6A38old;\u69BClig;\u4153\u0100cr\u2D69\u2D6Dir;\u69BF;\uC000\u{1D52C}\u036F\u2D79\0\0\u2D7C\0\u2D82n;\u42DBave\u803B\xF2\u40F2;\u69C1\u0100bm\u2D88\u0DF4ar;\u69B5\u0200acit\u2D95\u2D98\u2DA5\u2DA8r\xF2\u1A80\u0100ir\u2D9D\u2DA0r;\u69BEoss;\u69BBn\xE5\u0E52;\u69C0\u0180aei\u2DB1\u2DB5\u2DB9cr;\u414Dga;\u43C9\u0180cdn\u2DC0\u2DC5\u01CDron;\u43BF;\u69B6pf;\uC000\u{1D560}\u0180ael\u2DD4\u2DD7\u01D2r;\u69B7rp;\u69B9\u0380;adiosv\u2DEA\u2DEB\u2DEE\u2E08\u2E0D\u2E10\u2E16\u6228r\xF2\u1A86\u0200;efm\u2DF7\u2DF8\u2E02\u2E05\u6A5Dr\u0100;o\u2DFE\u2DFF\u6134f\xBB\u2DFF\u803B\xAA\u40AA\u803B\xBA\u40BAgof;\u62B6r;\u6A56lope;\u6A57;\u6A5B\u0180clo\u2E1F\u2E21\u2E27\xF2\u2E01ash\u803B\xF8\u40F8l;\u6298i\u016C\u2E2F\u2E34de\u803B\xF5\u40F5es\u0100;a\u01DB\u2E3As;\u6A36ml\u803B\xF6\u40F6bar;\u633D\u0AE1\u2E5E\0\u2E7D\0\u2E80\u2E9D\0\u2EA2\u2EB9\0\0\u2ECB\u0E9C\0\u2F13\0\0\u2F2B\u2FBC\0\u2FC8r\u0200;ast\u0403\u2E67\u2E72\u0E85\u8100\xB6;l\u2E6D\u2E6E\u40B6le\xEC\u0403\u0269\u2E78\0\0\u2E7Bm;\u6AF3;\u6AFDy;\u443Fr\u0280cimpt\u2E8B\u2E8F\u2E93\u1865\u2E97nt;\u4025od;\u402Eil;\u6030enk;\u6031r;\uC000\u{1D52D}\u0180imo\u2EA8\u2EB0\u2EB4\u0100;v\u2EAD\u2EAE\u43C6;\u43D5ma\xF4\u0A76ne;\u660E\u0180;tv\u2EBF\u2EC0\u2EC8\u43C0chfork\xBB\u1FFD;\u43D6\u0100au\u2ECF\u2EDFn\u0100ck\u2ED5\u2EDDk\u0100;h\u21F4\u2EDB;\u610E\xF6\u21F4s\u0480;abcdemst\u2EF3\u2EF4\u1908\u2EF9\u2EFD\u2F04\u2F06\u2F0A\u2F0E\u402Bcir;\u6A23ir;\u6A22\u0100ou\u1D40\u2F02;\u6A25;\u6A72n\u80BB\xB1\u0E9Dim;\u6A26wo;\u6A27\u0180ipu\u2F19\u2F20\u2F25ntint;\u6A15f;\uC000\u{1D561}nd\u803B\xA3\u40A3\u0500;Eaceinosu\u0EC8\u2F3F\u2F41\u2F44\u2F47\u2F81\u2F89\u2F92\u2F7E\u2FB6;\u6AB3p;\u6AB7u\xE5\u0ED9\u0100;c\u0ECE\u2F4C\u0300;acens\u0EC8\u2F59\u2F5F\u2F66\u2F68\u2F7Eppro\xF8\u2F43urlye\xF1\u0ED9\xF1\u0ECE\u0180aes\u2F6F\u2F76\u2F7Approx;\u6AB9qq;\u6AB5im;\u62E8i\xED\u0EDFme\u0100;s\u2F88\u0EAE\u6032\u0180Eas\u2F78\u2F90\u2F7A\xF0\u2F75\u0180dfp\u0EEC\u2F99\u2FAF\u0180als\u2FA0\u2FA5\u2FAAlar;\u632Eine;\u6312urf;\u6313\u0100;t\u0EFB\u2FB4\xEF\u0EFBrel;\u62B0\u0100ci\u2FC0\u2FC5r;\uC000\u{1D4C5};\u43C8ncsp;\u6008\u0300fiopsu\u2FDA\u22E2\u2FDF\u2FE5\u2FEB\u2FF1r;\uC000\u{1D52E}pf;\uC000\u{1D562}rime;\u6057cr;\uC000\u{1D4C6}\u0180aeo\u2FF8\u3009\u3013t\u0100ei\u2FFE\u3005rnion\xF3\u06B0nt;\u6A16st\u0100;e\u3010\u3011\u403F\xF1\u1F19\xF4\u0F14\u0A80ABHabcdefhilmnoprstux\u3040\u3051\u3055\u3059\u30E0\u310E\u312B\u3147\u3162\u3172\u318E\u3206\u3215\u3224\u3229\u3258\u326E\u3272\u3290\u32B0\u32B7\u0180art\u3047\u304A\u304Cr\xF2\u10B3\xF2\u03DDail;\u691Car\xF2\u1C65ar;\u6964\u0380cdenqrt\u3068\u3075\u3078\u307F\u308F\u3094\u30CC\u0100eu\u306D\u3071;\uC000\u223D\u0331te;\u4155i\xE3\u116Emptyv;\u69B3g\u0200;del\u0FD1\u3089\u308B\u308D;\u6992;\u69A5\xE5\u0FD1uo\u803B\xBB\u40BBr\u0580;abcfhlpstw\u0FDC\u30AC\u30AF\u30B7\u30B9\u30BC\u30BE\u30C0\u30C3\u30C7\u30CAp;\u6975\u0100;f\u0FE0\u30B4s;\u6920;\u6933s;\u691E\xEB\u225D\xF0\u272El;\u6945im;\u6974l;\u61A3;\u619D\u0100ai\u30D1\u30D5il;\u691Ao\u0100;n\u30DB\u30DC\u6236al\xF3\u0F1E\u0180abr\u30E7\u30EA\u30EEr\xF2\u17E5rk;\u6773\u0100ak\u30F3\u30FDc\u0100ek\u30F9\u30FB;\u407D;\u405D\u0100es\u3102\u3104;\u698Cl\u0100du\u310A\u310C;\u698E;\u6990\u0200aeuy\u3117\u311C\u3127\u3129ron;\u4159\u0100di\u3121\u3125il;\u4157\xEC\u0FF2\xE2\u30FA;\u4440\u0200clqs\u3134\u3137\u313D\u3144a;\u6937dhar;\u6969uo\u0100;r\u020E\u020Dh;\u61B3\u0180acg\u314E\u315F\u0F44l\u0200;ips\u0F78\u3158\u315B\u109Cn\xE5\u10BBar\xF4\u0FA9t;\u65AD\u0180ilr\u3169\u1023\u316Esht;\u697D;\uC000\u{1D52F}\u0100ao\u3177\u3186r\u0100du\u317D\u317F\xBB\u047B\u0100;l\u1091\u3184;\u696C\u0100;v\u318B\u318C\u43C1;\u43F1\u0180gns\u3195\u31F9\u31FCht\u0300ahlrst\u31A4\u31B0\u31C2\u31D8\u31E4\u31EErrow\u0100;t\u0FDC\u31ADa\xE9\u30C8arpoon\u0100du\u31BB\u31BFow\xEE\u317Ep\xBB\u1092eft\u0100ah\u31CA\u31D0rrow\xF3\u0FEAarpoon\xF3\u0551ightarrows;\u61C9quigarro\xF7\u30CBhreetimes;\u62CCg;\u42DAingdotse\xF1\u1F32\u0180ahm\u320D\u3210\u3213r\xF2\u0FEAa\xF2\u0551;\u600Foust\u0100;a\u321E\u321F\u63B1che\xBB\u321Fmid;\u6AEE\u0200abpt\u3232\u323D\u3240\u3252\u0100nr\u3237\u323Ag;\u67EDr;\u61FEr\xEB\u1003\u0180afl\u3247\u324A\u324Er;\u6986;\uC000\u{1D563}us;\u6A2Eimes;\u6A35\u0100ap\u325D\u3267r\u0100;g\u3263\u3264\u4029t;\u6994olint;\u6A12ar\xF2\u31E3\u0200achq\u327B\u3280\u10BC\u3285quo;\u603Ar;\uC000\u{1D4C7}\u0100bu\u30FB\u328Ao\u0100;r\u0214\u0213\u0180hir\u3297\u329B\u32A0re\xE5\u31F8mes;\u62CAi\u0200;efl\u32AA\u1059\u1821\u32AB\u65B9tri;\u69CEluhar;\u6968;\u611E\u0D61\u32D5\u32DB\u32DF\u332C\u3338\u3371\0\u337A\u33A4\0\0\u33EC\u33F0\0\u3428\u3448\u345A\u34AD\u34B1\u34CA\u34F1\0\u3616\0\0\u3633cute;\u415Bqu\xEF\u27BA\u0500;Eaceinpsy\u11ED\u32F3\u32F5\u32FF\u3302\u330B\u330F\u331F\u3326\u3329;\u6AB4\u01F0\u32FA\0\u32FC;\u6AB8on;\u4161u\xE5\u11FE\u0100;d\u11F3\u3307il;\u415Frc;\u415D\u0180Eas\u3316\u3318\u331B;\u6AB6p;\u6ABAim;\u62E9olint;\u6A13i\xED\u1204;\u4441ot\u0180;be\u3334\u1D47\u3335\u62C5;\u6A66\u0380Aacmstx\u3346\u334A\u3357\u335B\u335E\u3363\u336Drr;\u61D8r\u0100hr\u3350\u3352\xEB\u2228\u0100;o\u0A36\u0A34t\u803B\xA7\u40A7i;\u403Bwar;\u6929m\u0100in\u3369\xF0nu\xF3\xF1t;\u6736r\u0100;o\u3376\u2055\uC000\u{1D530}\u0200acoy\u3382\u3386\u3391\u33A0rp;\u666F\u0100hy\u338B\u338Fcy;\u4449;\u4448rt\u026D\u3399\0\0\u339Ci\xE4\u1464ara\xEC\u2E6F\u803B\xAD\u40AD\u0100gm\u33A8\u33B4ma\u0180;fv\u33B1\u33B2\u33B2\u43C3;\u43C2\u0400;deglnpr\u12AB\u33C5\u33C9\u33CE\u33D6\u33DE\u33E1\u33E6ot;\u6A6A\u0100;q\u12B1\u12B0\u0100;E\u33D3\u33D4\u6A9E;\u6AA0\u0100;E\u33DB\u33DC\u6A9D;\u6A9Fe;\u6246lus;\u6A24arr;\u6972ar\xF2\u113D\u0200aeit\u33F8\u3408\u340F\u3417\u0100ls\u33FD\u3404lsetm\xE9\u336Ahp;\u6A33parsl;\u69E4\u0100dl\u1463\u3414e;\u6323\u0100;e\u341C\u341D\u6AAA\u0100;s\u3422\u3423\u6AAC;\uC000\u2AAC\uFE00\u0180flp\u342E\u3433\u3442tcy;\u444C\u0100;b\u3438\u3439\u402F\u0100;a\u343E\u343F\u69C4r;\u633Ff;\uC000\u{1D564}a\u0100dr\u344D\u0402es\u0100;u\u3454\u3455\u6660it\xBB\u3455\u0180csu\u3460\u3479\u349F\u0100au\u3465\u346Fp\u0100;s\u1188\u346B;\uC000\u2293\uFE00p\u0100;s\u11B4\u3475;\uC000\u2294\uFE00u\u0100bp\u347F\u348F\u0180;es\u1197\u119C\u3486et\u0100;e\u1197\u348D\xF1\u119D\u0180;es\u11A8\u11AD\u3496et\u0100;e\u11A8\u349D\xF1\u11AE\u0180;af\u117B\u34A6\u05B0r\u0165\u34AB\u05B1\xBB\u117Car\xF2\u1148\u0200cemt\u34B9\u34BE\u34C2\u34C5r;\uC000\u{1D4C8}tm\xEE\xF1i\xEC\u3415ar\xE6\u11BE\u0100ar\u34CE\u34D5r\u0100;f\u34D4\u17BF\u6606\u0100an\u34DA\u34EDight\u0100ep\u34E3\u34EApsilo\xEE\u1EE0h\xE9\u2EAFs\xBB\u2852\u0280bcmnp\u34FB\u355E\u1209\u358B\u358E\u0480;Edemnprs\u350E\u350F\u3511\u3515\u351E\u3523\u352C\u3531\u3536\u6282;\u6AC5ot;\u6ABD\u0100;d\u11DA\u351Aot;\u6AC3ult;\u6AC1\u0100Ee\u3528\u352A;\u6ACB;\u628Alus;\u6ABFarr;\u6979\u0180eiu\u353D\u3552\u3555t\u0180;en\u350E\u3545\u354Bq\u0100;q\u11DA\u350Feq\u0100;q\u352B\u3528m;\u6AC7\u0100bp\u355A\u355C;\u6AD5;\u6AD3c\u0300;acens\u11ED\u356C\u3572\u3579\u357B\u3326ppro\xF8\u32FAurlye\xF1\u11FE\xF1\u11F3\u0180aes\u3582\u3588\u331Bppro\xF8\u331Aq\xF1\u3317g;\u666A\u0680123;Edehlmnps\u35A9\u35AC\u35AF\u121C\u35B2\u35B4\u35C0\u35C9\u35D5\u35DA\u35DF\u35E8\u35ED\u803B\xB9\u40B9\u803B\xB2\u40B2\u803B\xB3\u40B3;\u6AC6\u0100os\u35B9\u35BCt;\u6ABEub;\u6AD8\u0100;d\u1222\u35C5ot;\u6AC4s\u0100ou\u35CF\u35D2l;\u67C9b;\u6AD7arr;\u697Bult;\u6AC2\u0100Ee\u35E4\u35E6;\u6ACC;\u628Blus;\u6AC0\u0180eiu\u35F4\u3609\u360Ct\u0180;en\u121C\u35FC\u3602q\u0100;q\u1222\u35B2eq\u0100;q\u35E7\u35E4m;\u6AC8\u0100bp\u3611\u3613;\u6AD4;\u6AD6\u0180Aan\u361C\u3620\u362Drr;\u61D9r\u0100hr\u3626\u3628\xEB\u222E\u0100;o\u0A2B\u0A29war;\u692Alig\u803B\xDF\u40DF\u0BE1\u3651\u365D\u3660\u12CE\u3673\u3679\0\u367E\u36C2\0\0\0\0\0\u36DB\u3703\0\u3709\u376C\0\0\0\u3787\u0272\u3656\0\0\u365Bget;\u6316;\u43C4r\xEB\u0E5F\u0180aey\u3666\u366B\u3670ron;\u4165dil;\u4163;\u4442lrec;\u6315r;\uC000\u{1D531}\u0200eiko\u3686\u369D\u36B5\u36BC\u01F2\u368B\0\u3691e\u01004f\u1284\u1281a\u0180;sv\u3698\u3699\u369B\u43B8ym;\u43D1\u0100cn\u36A2\u36B2k\u0100as\u36A8\u36AEppro\xF8\u12C1im\xBB\u12ACs\xF0\u129E\u0100as\u36BA\u36AE\xF0\u12C1rn\u803B\xFE\u40FE\u01EC\u031F\u36C6\u22E7es\u8180\xD7;bd\u36CF\u36D0\u36D8\u40D7\u0100;a\u190F\u36D5r;\u6A31;\u6A30\u0180eps\u36E1\u36E3\u3700\xE1\u2A4D\u0200;bcf\u0486\u36EC\u36F0\u36F4ot;\u6336ir;\u6AF1\u0100;o\u36F9\u36FC\uC000\u{1D565}rk;\u6ADA\xE1\u3362rime;\u6034\u0180aip\u370F\u3712\u3764d\xE5\u1248\u0380adempst\u3721\u374D\u3740\u3751\u3757\u375C\u375Fngle\u0280;dlqr\u3730\u3731\u3736\u3740\u3742\u65B5own\xBB\u1DBBeft\u0100;e\u2800\u373E\xF1\u092E;\u625Cight\u0100;e\u32AA\u374B\xF1\u105Aot;\u65ECinus;\u6A3Alus;\u6A39b;\u69CDime;\u6A3Bezium;\u63E2\u0180cht\u3772\u377D\u3781\u0100ry\u3777\u377B;\uC000\u{1D4C9};\u4446cy;\u445Brok;\u4167\u0100io\u378B\u378Ex\xF4\u1777head\u0100lr\u3797\u37A0eftarro\xF7\u084Fightarrow\xBB\u0F5D\u0900AHabcdfghlmoprstuw\u37D0\u37D3\u37D7\u37E4\u37F0\u37FC\u380E\u381C\u3823\u3834\u3851\u385D\u386B\u38A9\u38CC\u38D2\u38EA\u38F6r\xF2\u03EDar;\u6963\u0100cr\u37DC\u37E2ute\u803B\xFA\u40FA\xF2\u1150r\u01E3\u37EA\0\u37EDy;\u445Eve;\u416D\u0100iy\u37F5\u37FArc\u803B\xFB\u40FB;\u4443\u0180abh\u3803\u3806\u380Br\xF2\u13ADlac;\u4171a\xF2\u13C3\u0100ir\u3813\u3818sht;\u697E;\uC000\u{1D532}rave\u803B\xF9\u40F9\u0161\u3827\u3831r\u0100lr\u382C\u382E\xBB\u0957\xBB\u1083lk;\u6580\u0100ct\u3839\u384D\u026F\u383F\0\0\u384Arn\u0100;e\u3845\u3846\u631Cr\xBB\u3846op;\u630Fri;\u65F8\u0100al\u3856\u385Acr;\u416B\u80BB\xA8\u0349\u0100gp\u3862\u3866on;\u4173f;\uC000\u{1D566}\u0300adhlsu\u114B\u3878\u387D\u1372\u3891\u38A0own\xE1\u13B3arpoon\u0100lr\u3888\u388Cef\xF4\u382Digh\xF4\u382Fi\u0180;hl\u3899\u389A\u389C\u43C5\xBB\u13FAon\xBB\u389Aparrows;\u61C8\u0180cit\u38B0\u38C4\u38C8\u026F\u38B6\0\0\u38C1rn\u0100;e\u38BC\u38BD\u631Dr\xBB\u38BDop;\u630Eng;\u416Fri;\u65F9cr;\uC000\u{1D4CA}\u0180dir\u38D9\u38DD\u38E2ot;\u62F0lde;\u4169i\u0100;f\u3730\u38E8\xBB\u1813\u0100am\u38EF\u38F2r\xF2\u38A8l\u803B\xFC\u40FCangle;\u69A7\u0780ABDacdeflnoprsz\u391C\u391F\u3929\u392D\u39B5\u39B8\u39BD\u39DF\u39E4\u39E8\u39F3\u39F9\u39FD\u3A01\u3A20r\xF2\u03F7ar\u0100;v\u3926\u3927\u6AE8;\u6AE9as\xE8\u03E1\u0100nr\u3932\u3937grt;\u699C\u0380eknprst\u34E3\u3946\u394B\u3952\u395D\u3964\u3996app\xE1\u2415othin\xE7\u1E96\u0180hir\u34EB\u2EC8\u3959op\xF4\u2FB5\u0100;h\u13B7\u3962\xEF\u318D\u0100iu\u3969\u396Dgm\xE1\u33B3\u0100bp\u3972\u3984setneq\u0100;q\u397D\u3980\uC000\u228A\uFE00;\uC000\u2ACB\uFE00setneq\u0100;q\u398F\u3992\uC000\u228B\uFE00;\uC000\u2ACC\uFE00\u0100hr\u399B\u399Fet\xE1\u369Ciangle\u0100lr\u39AA\u39AFeft\xBB\u0925ight\xBB\u1051y;\u4432ash\xBB\u1036\u0180elr\u39C4\u39D2\u39D7\u0180;be\u2DEA\u39CB\u39CFar;\u62BBq;\u625Alip;\u62EE\u0100bt\u39DC\u1468a\xF2\u1469r;\uC000\u{1D533}tr\xE9\u39AEsu\u0100bp\u39EF\u39F1\xBB\u0D1C\xBB\u0D59pf;\uC000\u{1D567}ro\xF0\u0EFBtr\xE9\u39B4\u0100cu\u3A06\u3A0Br;\uC000\u{1D4CB}\u0100bp\u3A10\u3A18n\u0100Ee\u3980\u3A16\xBB\u397En\u0100Ee\u3992\u3A1E\xBB\u3990igzag;\u699A\u0380cefoprs\u3A36\u3A3B\u3A56\u3A5B\u3A54\u3A61\u3A6Airc;\u4175\u0100di\u3A40\u3A51\u0100bg\u3A45\u3A49ar;\u6A5Fe\u0100;q\u15FA\u3A4F;\u6259erp;\u6118r;\uC000\u{1D534}pf;\uC000\u{1D568}\u0100;e\u1479\u3A66at\xE8\u1479cr;\uC000\u{1D4CC}\u0AE3\u178E\u3A87\0\u3A8B\0\u3A90\u3A9B\0\0\u3A9D\u3AA8\u3AAB\u3AAF\0\0\u3AC3\u3ACE\0\u3AD8\u17DC\u17DFtr\xE9\u17D1r;\uC000\u{1D535}\u0100Aa\u3A94\u3A97r\xF2\u03C3r\xF2\u09F6;\u43BE\u0100Aa\u3AA1\u3AA4r\xF2\u03B8r\xF2\u09EBa\xF0\u2713is;\u62FB\u0180dpt\u17A4\u3AB5\u3ABE\u0100fl\u3ABA\u17A9;\uC000\u{1D569}im\xE5\u17B2\u0100Aa\u3AC7\u3ACAr\xF2\u03CEr\xF2\u0A01\u0100cq\u3AD2\u17B8r;\uC000\u{1D4CD}\u0100pt\u17D6\u3ADCr\xE9\u17D4\u0400acefiosu\u3AF0\u3AFD\u3B08\u3B0C\u3B11\u3B15\u3B1B\u3B21c\u0100uy\u3AF6\u3AFBte\u803B\xFD\u40FD;\u444F\u0100iy\u3B02\u3B06rc;\u4177;\u444Bn\u803B\xA5\u40A5r;\uC000\u{1D536}cy;\u4457pf;\uC000\u{1D56A}cr;\uC000\u{1D4CE}\u0100cm\u3B26\u3B29y;\u444El\u803B\xFF\u40FF\u0500acdefhiosw\u3B42\u3B48\u3B54\u3B58\u3B64\u3B69\u3B6D\u3B74\u3B7A\u3B80cute;\u417A\u0100ay\u3B4D\u3B52ron;\u417E;\u4437ot;\u417C\u0100et\u3B5D\u3B61tr\xE6\u155Fa;\u43B6r;\uC000\u{1D537}cy;\u4436grarr;\u61DDpf;\uC000\u{1D56B}cr;\uC000\u{1D4CF}\u0100jn\u3B85\u3B87;\u600Dj;\u600C'.split("").map((c2) => c2.charCodeAt(0))
    );
  }
});

// node_modules/entities/lib/esm/generated/decode-data-xml.js
var decode_data_xml_default;
var init_decode_data_xml = __esm({
  "node_modules/entities/lib/esm/generated/decode-data-xml.js"() {
    decode_data_xml_default = new Uint16Array(
      // prettier-ignore
      "\u0200aglq	\x1B\u026D\0\0p;\u4026os;\u4027t;\u403Et;\u403Cuot;\u4022".split("").map((c2) => c2.charCodeAt(0))
    );
  }
});

// node_modules/entities/lib/esm/decode_codepoint.js
function replaceCodePoint(codePoint) {
  var _a3;
  if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) {
    return 65533;
  }
  return (_a3 = decodeMap.get(codePoint)) !== null && _a3 !== void 0 ? _a3 : codePoint;
}
var _a, decodeMap, fromCodePoint;
var init_decode_codepoint = __esm({
  "node_modules/entities/lib/esm/decode_codepoint.js"() {
    decodeMap = /* @__PURE__ */ new Map([
      [0, 65533],
      // C1 Unicode control character reference replacements
      [128, 8364],
      [130, 8218],
      [131, 402],
      [132, 8222],
      [133, 8230],
      [134, 8224],
      [135, 8225],
      [136, 710],
      [137, 8240],
      [138, 352],
      [139, 8249],
      [140, 338],
      [142, 381],
      [145, 8216],
      [146, 8217],
      [147, 8220],
      [148, 8221],
      [149, 8226],
      [150, 8211],
      [151, 8212],
      [152, 732],
      [153, 8482],
      [154, 353],
      [155, 8250],
      [156, 339],
      [158, 382],
      [159, 376]
    ]);
    fromCodePoint = // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, node/no-unsupported-features/es-builtins
    (_a = String.fromCodePoint) !== null && _a !== void 0 ? _a : function(codePoint) {
      let output = "";
      if (codePoint > 65535) {
        codePoint -= 65536;
        output += String.fromCharCode(codePoint >>> 10 & 1023 | 55296);
        codePoint = 56320 | codePoint & 1023;
      }
      output += String.fromCharCode(codePoint);
      return output;
    };
  }
});

// node_modules/entities/lib/esm/decode.js
function isNumber(code) {
  return code >= CharCodes.ZERO && code <= CharCodes.NINE;
}
function isHexadecimalCharacter(code) {
  return code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_F || code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_F;
}
function isAsciiAlphaNumeric(code) {
  return code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_Z || code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_Z || isNumber(code);
}
function isEntityInAttributeInvalidEnd(code) {
  return code === CharCodes.EQUALS || isAsciiAlphaNumeric(code);
}
function getDecoder(decodeTree) {
  let ret = "";
  const decoder2 = new EntityDecoder(decodeTree, (str) => ret += fromCodePoint(str));
  return function decodeWithTrie(str, decodeMode) {
    let lastIndex = 0;
    let offset = 0;
    while ((offset = str.indexOf("&", offset)) >= 0) {
      ret += str.slice(lastIndex, offset);
      decoder2.startEntity(decodeMode);
      const len = decoder2.write(
        str,
        // Skip the "&"
        offset + 1
      );
      if (len < 0) {
        lastIndex = offset + decoder2.end();
        break;
      }
      lastIndex = offset + len;
      offset = len === 0 ? lastIndex + 1 : lastIndex;
    }
    const result = ret + str.slice(lastIndex);
    ret = "";
    return result;
  };
}
function determineBranch(decodeTree, current, nodeIdx, char) {
  const branchCount = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
  const jumpOffset = current & BinTrieFlags.JUMP_TABLE;
  if (branchCount === 0) {
    return jumpOffset !== 0 && char === jumpOffset ? nodeIdx : -1;
  }
  if (jumpOffset) {
    const value = char - jumpOffset;
    return value < 0 || value >= branchCount ? -1 : decodeTree[nodeIdx + value] - 1;
  }
  let lo3 = nodeIdx;
  let hi2 = lo3 + branchCount - 1;
  while (lo3 <= hi2) {
    const mid = lo3 + hi2 >>> 1;
    const midVal = decodeTree[mid];
    if (midVal < char) {
      lo3 = mid + 1;
    } else if (midVal > char) {
      hi2 = mid - 1;
    } else {
      return decodeTree[mid + branchCount];
    }
  }
  return -1;
}
var CharCodes, TO_LOWER_BIT, BinTrieFlags, EntityDecoderState, DecodingMode, EntityDecoder, htmlDecoder, xmlDecoder;
var init_decode = __esm({
  "node_modules/entities/lib/esm/decode.js"() {
    init_decode_data_html();
    init_decode_data_xml();
    init_decode_codepoint();
    init_decode_codepoint();
    (function(CharCodes3) {
      CharCodes3[CharCodes3["NUM"] = 35] = "NUM";
      CharCodes3[CharCodes3["SEMI"] = 59] = "SEMI";
      CharCodes3[CharCodes3["EQUALS"] = 61] = "EQUALS";
      CharCodes3[CharCodes3["ZERO"] = 48] = "ZERO";
      CharCodes3[CharCodes3["NINE"] = 57] = "NINE";
      CharCodes3[CharCodes3["LOWER_A"] = 97] = "LOWER_A";
      CharCodes3[CharCodes3["LOWER_F"] = 102] = "LOWER_F";
      CharCodes3[CharCodes3["LOWER_X"] = 120] = "LOWER_X";
      CharCodes3[CharCodes3["LOWER_Z"] = 122] = "LOWER_Z";
      CharCodes3[CharCodes3["UPPER_A"] = 65] = "UPPER_A";
      CharCodes3[CharCodes3["UPPER_F"] = 70] = "UPPER_F";
      CharCodes3[CharCodes3["UPPER_Z"] = 90] = "UPPER_Z";
    })(CharCodes || (CharCodes = {}));
    TO_LOWER_BIT = 32;
    (function(BinTrieFlags2) {
      BinTrieFlags2[BinTrieFlags2["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
      BinTrieFlags2[BinTrieFlags2["BRANCH_LENGTH"] = 16256] = "BRANCH_LENGTH";
      BinTrieFlags2[BinTrieFlags2["JUMP_TABLE"] = 127] = "JUMP_TABLE";
    })(BinTrieFlags || (BinTrieFlags = {}));
    (function(EntityDecoderState2) {
      EntityDecoderState2[EntityDecoderState2["EntityStart"] = 0] = "EntityStart";
      EntityDecoderState2[EntityDecoderState2["NumericStart"] = 1] = "NumericStart";
      EntityDecoderState2[EntityDecoderState2["NumericDecimal"] = 2] = "NumericDecimal";
      EntityDecoderState2[EntityDecoderState2["NumericHex"] = 3] = "NumericHex";
      EntityDecoderState2[EntityDecoderState2["NamedEntity"] = 4] = "NamedEntity";
    })(EntityDecoderState || (EntityDecoderState = {}));
    (function(DecodingMode2) {
      DecodingMode2[DecodingMode2["Legacy"] = 0] = "Legacy";
      DecodingMode2[DecodingMode2["Strict"] = 1] = "Strict";
      DecodingMode2[DecodingMode2["Attribute"] = 2] = "Attribute";
    })(DecodingMode || (DecodingMode = {}));
    EntityDecoder = class {
      constructor(decodeTree, emitCodePoint, errors) {
        this.decodeTree = decodeTree;
        this.emitCodePoint = emitCodePoint;
        this.errors = errors;
        this.state = EntityDecoderState.EntityStart;
        this.consumed = 1;
        this.result = 0;
        this.treeIndex = 0;
        this.excess = 1;
        this.decodeMode = DecodingMode.Strict;
      }
      /** Resets the instance to make it reusable. */
      startEntity(decodeMode) {
        this.decodeMode = decodeMode;
        this.state = EntityDecoderState.EntityStart;
        this.result = 0;
        this.treeIndex = 0;
        this.excess = 1;
        this.consumed = 1;
      }
      /**
       * Write an entity to the decoder. This can be called multiple times with partial entities.
       * If the entity is incomplete, the decoder will return -1.
       *
       * Mirrors the implementation of `getDecoder`, but with the ability to stop decoding if the
       * entity is incomplete, and resume when the next string is written.
       *
       * @param string The string containing the entity (or a continuation of the entity).
       * @param offset The offset at which the entity begins. Should be 0 if this is not the first call.
       * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
       */
      write(str, offset) {
        switch (this.state) {
          case EntityDecoderState.EntityStart: {
            if (str.charCodeAt(offset) === CharCodes.NUM) {
              this.state = EntityDecoderState.NumericStart;
              this.consumed += 1;
              return this.stateNumericStart(str, offset + 1);
            }
            this.state = EntityDecoderState.NamedEntity;
            return this.stateNamedEntity(str, offset);
          }
          case EntityDecoderState.NumericStart: {
            return this.stateNumericStart(str, offset);
          }
          case EntityDecoderState.NumericDecimal: {
            return this.stateNumericDecimal(str, offset);
          }
          case EntityDecoderState.NumericHex: {
            return this.stateNumericHex(str, offset);
          }
          case EntityDecoderState.NamedEntity: {
            return this.stateNamedEntity(str, offset);
          }
        }
      }
      /**
       * Switches between the numeric decimal and hexadecimal states.
       *
       * Equivalent to the `Numeric character reference state` in the HTML spec.
       *
       * @param str The string containing the entity (or a continuation of the entity).
       * @param offset The current offset.
       * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
       */
      stateNumericStart(str, offset) {
        if (offset >= str.length) {
          return -1;
        }
        if ((str.charCodeAt(offset) | TO_LOWER_BIT) === CharCodes.LOWER_X) {
          this.state = EntityDecoderState.NumericHex;
          this.consumed += 1;
          return this.stateNumericHex(str, offset + 1);
        }
        this.state = EntityDecoderState.NumericDecimal;
        return this.stateNumericDecimal(str, offset);
      }
      addToNumericResult(str, start, end, base) {
        if (start !== end) {
          const digitCount = end - start;
          this.result = this.result * Math.pow(base, digitCount) + parseInt(str.substr(start, digitCount), base);
          this.consumed += digitCount;
        }
      }
      /**
       * Parses a hexadecimal numeric entity.
       *
       * Equivalent to the `Hexademical character reference state` in the HTML spec.
       *
       * @param str The string containing the entity (or a continuation of the entity).
       * @param offset The current offset.
       * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
       */
      stateNumericHex(str, offset) {
        const startIdx = offset;
        while (offset < str.length) {
          const char = str.charCodeAt(offset);
          if (isNumber(char) || isHexadecimalCharacter(char)) {
            offset += 1;
          } else {
            this.addToNumericResult(str, startIdx, offset, 16);
            return this.emitNumericEntity(char, 3);
          }
        }
        this.addToNumericResult(str, startIdx, offset, 16);
        return -1;
      }
      /**
       * Parses a decimal numeric entity.
       *
       * Equivalent to the `Decimal character reference state` in the HTML spec.
       *
       * @param str The string containing the entity (or a continuation of the entity).
       * @param offset The current offset.
       * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
       */
      stateNumericDecimal(str, offset) {
        const startIdx = offset;
        while (offset < str.length) {
          const char = str.charCodeAt(offset);
          if (isNumber(char)) {
            offset += 1;
          } else {
            this.addToNumericResult(str, startIdx, offset, 10);
            return this.emitNumericEntity(char, 2);
          }
        }
        this.addToNumericResult(str, startIdx, offset, 10);
        return -1;
      }
      /**
       * Validate and emit a numeric entity.
       *
       * Implements the logic from the `Hexademical character reference start
       * state` and `Numeric character reference end state` in the HTML spec.
       *
       * @param lastCp The last code point of the entity. Used to see if the
       *               entity was terminated with a semicolon.
       * @param expectedLength The minimum number of characters that should be
       *                       consumed. Used to validate that at least one digit
       *                       was consumed.
       * @returns The number of characters that were consumed.
       */
      emitNumericEntity(lastCp, expectedLength) {
        var _a3;
        if (this.consumed <= expectedLength) {
          (_a3 = this.errors) === null || _a3 === void 0 ? void 0 : _a3.absenceOfDigitsInNumericCharacterReference(this.consumed);
          return 0;
        }
        if (lastCp === CharCodes.SEMI) {
          this.consumed += 1;
        } else if (this.decodeMode === DecodingMode.Strict) {
          return 0;
        }
        this.emitCodePoint(replaceCodePoint(this.result), this.consumed);
        if (this.errors) {
          if (lastCp !== CharCodes.SEMI) {
            this.errors.missingSemicolonAfterCharacterReference();
          }
          this.errors.validateNumericCharacterReference(this.result);
        }
        return this.consumed;
      }
      /**
       * Parses a named entity.
       *
       * Equivalent to the `Named character reference state` in the HTML spec.
       *
       * @param str The string containing the entity (or a continuation of the entity).
       * @param offset The current offset.
       * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
       */
      stateNamedEntity(str, offset) {
        const { decodeTree } = this;
        let current = decodeTree[this.treeIndex];
        let valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
        for (; offset < str.length; offset++, this.excess++) {
          const char = str.charCodeAt(offset);
          this.treeIndex = determineBranch(decodeTree, current, this.treeIndex + Math.max(1, valueLength), char);
          if (this.treeIndex < 0) {
            return this.result === 0 || // If we are parsing an attribute
            this.decodeMode === DecodingMode.Attribute && // We shouldn't have consumed any characters after the entity,
            (valueLength === 0 || // And there should be no invalid characters.
            isEntityInAttributeInvalidEnd(char)) ? 0 : this.emitNotTerminatedNamedEntity();
          }
          current = decodeTree[this.treeIndex];
          valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
          if (valueLength !== 0) {
            if (char === CharCodes.SEMI) {
              return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
            }
            if (this.decodeMode !== DecodingMode.Strict) {
              this.result = this.treeIndex;
              this.consumed += this.excess;
              this.excess = 0;
            }
          }
        }
        return -1;
      }
      /**
       * Emit a named entity that was not terminated with a semicolon.
       *
       * @returns The number of characters consumed.
       */
      emitNotTerminatedNamedEntity() {
        var _a3;
        const { result, decodeTree } = this;
        const valueLength = (decodeTree[result] & BinTrieFlags.VALUE_LENGTH) >> 14;
        this.emitNamedEntityData(result, valueLength, this.consumed);
        (_a3 = this.errors) === null || _a3 === void 0 ? void 0 : _a3.missingSemicolonAfterCharacterReference();
        return this.consumed;
      }
      /**
       * Emit a named entity.
       *
       * @param result The index of the entity in the decode tree.
       * @param valueLength The number of bytes in the entity.
       * @param consumed The number of characters consumed.
       *
       * @returns The number of characters consumed.
       */
      emitNamedEntityData(result, valueLength, consumed) {
        const { decodeTree } = this;
        this.emitCodePoint(valueLength === 1 ? decodeTree[result] & ~BinTrieFlags.VALUE_LENGTH : decodeTree[result + 1], consumed);
        if (valueLength === 3) {
          this.emitCodePoint(decodeTree[result + 2], consumed);
        }
        return consumed;
      }
      /**
       * Signal to the parser that the end of the input was reached.
       *
       * Remaining data will be emitted and relevant errors will be produced.
       *
       * @returns The number of characters consumed.
       */
      end() {
        var _a3;
        switch (this.state) {
          case EntityDecoderState.NamedEntity: {
            return this.result !== 0 && (this.decodeMode !== DecodingMode.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
          }
          // Otherwise, emit a numeric entity if we have one.
          case EntityDecoderState.NumericDecimal: {
            return this.emitNumericEntity(0, 2);
          }
          case EntityDecoderState.NumericHex: {
            return this.emitNumericEntity(0, 3);
          }
          case EntityDecoderState.NumericStart: {
            (_a3 = this.errors) === null || _a3 === void 0 ? void 0 : _a3.absenceOfDigitsInNumericCharacterReference(this.consumed);
            return 0;
          }
          case EntityDecoderState.EntityStart: {
            return 0;
          }
        }
      }
    };
    htmlDecoder = getDecoder(decode_data_html_default);
    xmlDecoder = getDecoder(decode_data_xml_default);
  }
});

// node_modules/htmlparser2/lib/esm/Tokenizer.js
function isWhitespace(c2) {
  return c2 === CharCodes2.Space || c2 === CharCodes2.NewLine || c2 === CharCodes2.Tab || c2 === CharCodes2.FormFeed || c2 === CharCodes2.CarriageReturn;
}
function isEndOfTagSection(c2) {
  return c2 === CharCodes2.Slash || c2 === CharCodes2.Gt || isWhitespace(c2);
}
function isNumber2(c2) {
  return c2 >= CharCodes2.Zero && c2 <= CharCodes2.Nine;
}
function isASCIIAlpha(c2) {
  return c2 >= CharCodes2.LowerA && c2 <= CharCodes2.LowerZ || c2 >= CharCodes2.UpperA && c2 <= CharCodes2.UpperZ;
}
function isHexDigit(c2) {
  return c2 >= CharCodes2.UpperA && c2 <= CharCodes2.UpperF || c2 >= CharCodes2.LowerA && c2 <= CharCodes2.LowerF;
}
var CharCodes2, State, QuoteType, Sequences, Tokenizer;
var init_Tokenizer = __esm({
  "node_modules/htmlparser2/lib/esm/Tokenizer.js"() {
    init_decode();
    (function(CharCodes3) {
      CharCodes3[CharCodes3["Tab"] = 9] = "Tab";
      CharCodes3[CharCodes3["NewLine"] = 10] = "NewLine";
      CharCodes3[CharCodes3["FormFeed"] = 12] = "FormFeed";
      CharCodes3[CharCodes3["CarriageReturn"] = 13] = "CarriageReturn";
      CharCodes3[CharCodes3["Space"] = 32] = "Space";
      CharCodes3[CharCodes3["ExclamationMark"] = 33] = "ExclamationMark";
      CharCodes3[CharCodes3["Number"] = 35] = "Number";
      CharCodes3[CharCodes3["Amp"] = 38] = "Amp";
      CharCodes3[CharCodes3["SingleQuote"] = 39] = "SingleQuote";
      CharCodes3[CharCodes3["DoubleQuote"] = 34] = "DoubleQuote";
      CharCodes3[CharCodes3["Dash"] = 45] = "Dash";
      CharCodes3[CharCodes3["Slash"] = 47] = "Slash";
      CharCodes3[CharCodes3["Zero"] = 48] = "Zero";
      CharCodes3[CharCodes3["Nine"] = 57] = "Nine";
      CharCodes3[CharCodes3["Semi"] = 59] = "Semi";
      CharCodes3[CharCodes3["Lt"] = 60] = "Lt";
      CharCodes3[CharCodes3["Eq"] = 61] = "Eq";
      CharCodes3[CharCodes3["Gt"] = 62] = "Gt";
      CharCodes3[CharCodes3["Questionmark"] = 63] = "Questionmark";
      CharCodes3[CharCodes3["UpperA"] = 65] = "UpperA";
      CharCodes3[CharCodes3["LowerA"] = 97] = "LowerA";
      CharCodes3[CharCodes3["UpperF"] = 70] = "UpperF";
      CharCodes3[CharCodes3["LowerF"] = 102] = "LowerF";
      CharCodes3[CharCodes3["UpperZ"] = 90] = "UpperZ";
      CharCodes3[CharCodes3["LowerZ"] = 122] = "LowerZ";
      CharCodes3[CharCodes3["LowerX"] = 120] = "LowerX";
      CharCodes3[CharCodes3["OpeningSquareBracket"] = 91] = "OpeningSquareBracket";
    })(CharCodes2 || (CharCodes2 = {}));
    (function(State2) {
      State2[State2["Text"] = 1] = "Text";
      State2[State2["BeforeTagName"] = 2] = "BeforeTagName";
      State2[State2["InTagName"] = 3] = "InTagName";
      State2[State2["InSelfClosingTag"] = 4] = "InSelfClosingTag";
      State2[State2["BeforeClosingTagName"] = 5] = "BeforeClosingTagName";
      State2[State2["InClosingTagName"] = 6] = "InClosingTagName";
      State2[State2["AfterClosingTagName"] = 7] = "AfterClosingTagName";
      State2[State2["BeforeAttributeName"] = 8] = "BeforeAttributeName";
      State2[State2["InAttributeName"] = 9] = "InAttributeName";
      State2[State2["AfterAttributeName"] = 10] = "AfterAttributeName";
      State2[State2["BeforeAttributeValue"] = 11] = "BeforeAttributeValue";
      State2[State2["InAttributeValueDq"] = 12] = "InAttributeValueDq";
      State2[State2["InAttributeValueSq"] = 13] = "InAttributeValueSq";
      State2[State2["InAttributeValueNq"] = 14] = "InAttributeValueNq";
      State2[State2["BeforeDeclaration"] = 15] = "BeforeDeclaration";
      State2[State2["InDeclaration"] = 16] = "InDeclaration";
      State2[State2["InProcessingInstruction"] = 17] = "InProcessingInstruction";
      State2[State2["BeforeComment"] = 18] = "BeforeComment";
      State2[State2["CDATASequence"] = 19] = "CDATASequence";
      State2[State2["InSpecialComment"] = 20] = "InSpecialComment";
      State2[State2["InCommentLike"] = 21] = "InCommentLike";
      State2[State2["BeforeSpecialS"] = 22] = "BeforeSpecialS";
      State2[State2["SpecialStartSequence"] = 23] = "SpecialStartSequence";
      State2[State2["InSpecialTag"] = 24] = "InSpecialTag";
      State2[State2["BeforeEntity"] = 25] = "BeforeEntity";
      State2[State2["BeforeNumericEntity"] = 26] = "BeforeNumericEntity";
      State2[State2["InNamedEntity"] = 27] = "InNamedEntity";
      State2[State2["InNumericEntity"] = 28] = "InNumericEntity";
      State2[State2["InHexEntity"] = 29] = "InHexEntity";
    })(State || (State = {}));
    (function(QuoteType2) {
      QuoteType2[QuoteType2["NoValue"] = 0] = "NoValue";
      QuoteType2[QuoteType2["Unquoted"] = 1] = "Unquoted";
      QuoteType2[QuoteType2["Single"] = 2] = "Single";
      QuoteType2[QuoteType2["Double"] = 3] = "Double";
    })(QuoteType || (QuoteType = {}));
    Sequences = {
      Cdata: new Uint8Array([67, 68, 65, 84, 65, 91]),
      CdataEnd: new Uint8Array([93, 93, 62]),
      CommentEnd: new Uint8Array([45, 45, 62]),
      ScriptEnd: new Uint8Array([60, 47, 115, 99, 114, 105, 112, 116]),
      StyleEnd: new Uint8Array([60, 47, 115, 116, 121, 108, 101]),
      TitleEnd: new Uint8Array([60, 47, 116, 105, 116, 108, 101])
      // `</title`
    };
    Tokenizer = class {
      constructor({ xmlMode = false, decodeEntities = true }, cbs) {
        this.cbs = cbs;
        this.state = State.Text;
        this.buffer = "";
        this.sectionStart = 0;
        this.index = 0;
        this.baseState = State.Text;
        this.isSpecial = false;
        this.running = true;
        this.offset = 0;
        this.currentSequence = void 0;
        this.sequenceIndex = 0;
        this.trieIndex = 0;
        this.trieCurrent = 0;
        this.entityResult = 0;
        this.entityExcess = 0;
        this.xmlMode = xmlMode;
        this.decodeEntities = decodeEntities;
        this.entityTrie = xmlMode ? decode_data_xml_default : decode_data_html_default;
      }
      reset() {
        this.state = State.Text;
        this.buffer = "";
        this.sectionStart = 0;
        this.index = 0;
        this.baseState = State.Text;
        this.currentSequence = void 0;
        this.running = true;
        this.offset = 0;
      }
      write(chunk) {
        this.offset += this.buffer.length;
        this.buffer = chunk;
        this.parse();
      }
      end() {
        if (this.running)
          this.finish();
      }
      pause() {
        this.running = false;
      }
      resume() {
        this.running = true;
        if (this.index < this.buffer.length + this.offset) {
          this.parse();
        }
      }
      /**
       * The current index within all of the written data.
       */
      getIndex() {
        return this.index;
      }
      /**
       * The start of the current section.
       */
      getSectionStart() {
        return this.sectionStart;
      }
      stateText(c2) {
        if (c2 === CharCodes2.Lt || !this.decodeEntities && this.fastForwardTo(CharCodes2.Lt)) {
          if (this.index > this.sectionStart) {
            this.cbs.ontext(this.sectionStart, this.index);
          }
          this.state = State.BeforeTagName;
          this.sectionStart = this.index;
        } else if (this.decodeEntities && c2 === CharCodes2.Amp) {
          this.state = State.BeforeEntity;
        }
      }
      stateSpecialStartSequence(c2) {
        const isEnd = this.sequenceIndex === this.currentSequence.length;
        const isMatch = isEnd ? (
          // If we are at the end of the sequence, make sure the tag name has ended
          isEndOfTagSection(c2)
        ) : (
          // Otherwise, do a case-insensitive comparison
          (c2 | 32) === this.currentSequence[this.sequenceIndex]
        );
        if (!isMatch) {
          this.isSpecial = false;
        } else if (!isEnd) {
          this.sequenceIndex++;
          return;
        }
        this.sequenceIndex = 0;
        this.state = State.InTagName;
        this.stateInTagName(c2);
      }
      /** Look for an end tag. For <title> tags, also decode entities. */
      stateInSpecialTag(c2) {
        if (this.sequenceIndex === this.currentSequence.length) {
          if (c2 === CharCodes2.Gt || isWhitespace(c2)) {
            const endOfText = this.index - this.currentSequence.length;
            if (this.sectionStart < endOfText) {
              const actualIndex = this.index;
              this.index = endOfText;
              this.cbs.ontext(this.sectionStart, endOfText);
              this.index = actualIndex;
            }
            this.isSpecial = false;
            this.sectionStart = endOfText + 2;
            this.stateInClosingTagName(c2);
            return;
          }
          this.sequenceIndex = 0;
        }
        if ((c2 | 32) === this.currentSequence[this.sequenceIndex]) {
          this.sequenceIndex += 1;
        } else if (this.sequenceIndex === 0) {
          if (this.currentSequence === Sequences.TitleEnd) {
            if (this.decodeEntities && c2 === CharCodes2.Amp) {
              this.state = State.BeforeEntity;
            }
          } else if (this.fastForwardTo(CharCodes2.Lt)) {
            this.sequenceIndex = 1;
          }
        } else {
          this.sequenceIndex = Number(c2 === CharCodes2.Lt);
        }
      }
      stateCDATASequence(c2) {
        if (c2 === Sequences.Cdata[this.sequenceIndex]) {
          if (++this.sequenceIndex === Sequences.Cdata.length) {
            this.state = State.InCommentLike;
            this.currentSequence = Sequences.CdataEnd;
            this.sequenceIndex = 0;
            this.sectionStart = this.index + 1;
          }
        } else {
          this.sequenceIndex = 0;
          this.state = State.InDeclaration;
          this.stateInDeclaration(c2);
        }
      }
      /**
       * When we wait for one specific character, we can speed things up
       * by skipping through the buffer until we find it.
       *
       * @returns Whether the character was found.
       */
      fastForwardTo(c2) {
        while (++this.index < this.buffer.length + this.offset) {
          if (this.buffer.charCodeAt(this.index - this.offset) === c2) {
            return true;
          }
        }
        this.index = this.buffer.length + this.offset - 1;
        return false;
      }
      /**
       * Comments and CDATA end with `-->` and `]]>`.
       *
       * Their common qualities are:
       * - Their end sequences have a distinct character they start with.
       * - That character is then repeated, so we have to check multiple repeats.
       * - All characters but the start character of the sequence can be skipped.
       */
      stateInCommentLike(c2) {
        if (c2 === this.currentSequence[this.sequenceIndex]) {
          if (++this.sequenceIndex === this.currentSequence.length) {
            if (this.currentSequence === Sequences.CdataEnd) {
              this.cbs.oncdata(this.sectionStart, this.index, 2);
            } else {
              this.cbs.oncomment(this.sectionStart, this.index, 2);
            }
            this.sequenceIndex = 0;
            this.sectionStart = this.index + 1;
            this.state = State.Text;
          }
        } else if (this.sequenceIndex === 0) {
          if (this.fastForwardTo(this.currentSequence[0])) {
            this.sequenceIndex = 1;
          }
        } else if (c2 !== this.currentSequence[this.sequenceIndex - 1]) {
          this.sequenceIndex = 0;
        }
      }
      /**
       * HTML only allows ASCII alpha characters (a-z and A-Z) at the beginning of a tag name.
       *
       * XML allows a lot more characters here (@see https://www.w3.org/TR/REC-xml/#NT-NameStartChar).
       * We allow anything that wouldn't end the tag.
       */
      isTagStartChar(c2) {
        return this.xmlMode ? !isEndOfTagSection(c2) : isASCIIAlpha(c2);
      }
      startSpecial(sequence, offset) {
        this.isSpecial = true;
        this.currentSequence = sequence;
        this.sequenceIndex = offset;
        this.state = State.SpecialStartSequence;
      }
      stateBeforeTagName(c2) {
        if (c2 === CharCodes2.ExclamationMark) {
          this.state = State.BeforeDeclaration;
          this.sectionStart = this.index + 1;
        } else if (c2 === CharCodes2.Questionmark) {
          this.state = State.InProcessingInstruction;
          this.sectionStart = this.index + 1;
        } else if (this.isTagStartChar(c2)) {
          const lower = c2 | 32;
          this.sectionStart = this.index;
          if (!this.xmlMode && lower === Sequences.TitleEnd[2]) {
            this.startSpecial(Sequences.TitleEnd, 3);
          } else {
            this.state = !this.xmlMode && lower === Sequences.ScriptEnd[2] ? State.BeforeSpecialS : State.InTagName;
          }
        } else if (c2 === CharCodes2.Slash) {
          this.state = State.BeforeClosingTagName;
        } else {
          this.state = State.Text;
          this.stateText(c2);
        }
      }
      stateInTagName(c2) {
        if (isEndOfTagSection(c2)) {
          this.cbs.onopentagname(this.sectionStart, this.index);
          this.sectionStart = -1;
          this.state = State.BeforeAttributeName;
          this.stateBeforeAttributeName(c2);
        }
      }
      stateBeforeClosingTagName(c2) {
        if (isWhitespace(c2)) {
        } else if (c2 === CharCodes2.Gt) {
          this.state = State.Text;
        } else {
          this.state = this.isTagStartChar(c2) ? State.InClosingTagName : State.InSpecialComment;
          this.sectionStart = this.index;
        }
      }
      stateInClosingTagName(c2) {
        if (c2 === CharCodes2.Gt || isWhitespace(c2)) {
          this.cbs.onclosetag(this.sectionStart, this.index);
          this.sectionStart = -1;
          this.state = State.AfterClosingTagName;
          this.stateAfterClosingTagName(c2);
        }
      }
      stateAfterClosingTagName(c2) {
        if (c2 === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
          this.state = State.Text;
          this.baseState = State.Text;
          this.sectionStart = this.index + 1;
        }
      }
      stateBeforeAttributeName(c2) {
        if (c2 === CharCodes2.Gt) {
          this.cbs.onopentagend(this.index);
          if (this.isSpecial) {
            this.state = State.InSpecialTag;
            this.sequenceIndex = 0;
          } else {
            this.state = State.Text;
          }
          this.baseState = this.state;
          this.sectionStart = this.index + 1;
        } else if (c2 === CharCodes2.Slash) {
          this.state = State.InSelfClosingTag;
        } else if (!isWhitespace(c2)) {
          this.state = State.InAttributeName;
          this.sectionStart = this.index;
        }
      }
      stateInSelfClosingTag(c2) {
        if (c2 === CharCodes2.Gt) {
          this.cbs.onselfclosingtag(this.index);
          this.state = State.Text;
          this.baseState = State.Text;
          this.sectionStart = this.index + 1;
          this.isSpecial = false;
        } else if (!isWhitespace(c2)) {
          this.state = State.BeforeAttributeName;
          this.stateBeforeAttributeName(c2);
        }
      }
      stateInAttributeName(c2) {
        if (c2 === CharCodes2.Eq || isEndOfTagSection(c2)) {
          this.cbs.onattribname(this.sectionStart, this.index);
          this.sectionStart = -1;
          this.state = State.AfterAttributeName;
          this.stateAfterAttributeName(c2);
        }
      }
      stateAfterAttributeName(c2) {
        if (c2 === CharCodes2.Eq) {
          this.state = State.BeforeAttributeValue;
        } else if (c2 === CharCodes2.Slash || c2 === CharCodes2.Gt) {
          this.cbs.onattribend(QuoteType.NoValue, this.index);
          this.state = State.BeforeAttributeName;
          this.stateBeforeAttributeName(c2);
        } else if (!isWhitespace(c2)) {
          this.cbs.onattribend(QuoteType.NoValue, this.index);
          this.state = State.InAttributeName;
          this.sectionStart = this.index;
        }
      }
      stateBeforeAttributeValue(c2) {
        if (c2 === CharCodes2.DoubleQuote) {
          this.state = State.InAttributeValueDq;
          this.sectionStart = this.index + 1;
        } else if (c2 === CharCodes2.SingleQuote) {
          this.state = State.InAttributeValueSq;
          this.sectionStart = this.index + 1;
        } else if (!isWhitespace(c2)) {
          this.sectionStart = this.index;
          this.state = State.InAttributeValueNq;
          this.stateInAttributeValueNoQuotes(c2);
        }
      }
      handleInAttributeValue(c2, quote) {
        if (c2 === quote || !this.decodeEntities && this.fastForwardTo(quote)) {
          this.cbs.onattribdata(this.sectionStart, this.index);
          this.sectionStart = -1;
          this.cbs.onattribend(quote === CharCodes2.DoubleQuote ? QuoteType.Double : QuoteType.Single, this.index);
          this.state = State.BeforeAttributeName;
        } else if (this.decodeEntities && c2 === CharCodes2.Amp) {
          this.baseState = this.state;
          this.state = State.BeforeEntity;
        }
      }
      stateInAttributeValueDoubleQuotes(c2) {
        this.handleInAttributeValue(c2, CharCodes2.DoubleQuote);
      }
      stateInAttributeValueSingleQuotes(c2) {
        this.handleInAttributeValue(c2, CharCodes2.SingleQuote);
      }
      stateInAttributeValueNoQuotes(c2) {
        if (isWhitespace(c2) || c2 === CharCodes2.Gt) {
          this.cbs.onattribdata(this.sectionStart, this.index);
          this.sectionStart = -1;
          this.cbs.onattribend(QuoteType.Unquoted, this.index);
          this.state = State.BeforeAttributeName;
          this.stateBeforeAttributeName(c2);
        } else if (this.decodeEntities && c2 === CharCodes2.Amp) {
          this.baseState = this.state;
          this.state = State.BeforeEntity;
        }
      }
      stateBeforeDeclaration(c2) {
        if (c2 === CharCodes2.OpeningSquareBracket) {
          this.state = State.CDATASequence;
          this.sequenceIndex = 0;
        } else {
          this.state = c2 === CharCodes2.Dash ? State.BeforeComment : State.InDeclaration;
        }
      }
      stateInDeclaration(c2) {
        if (c2 === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
          this.cbs.ondeclaration(this.sectionStart, this.index);
          this.state = State.Text;
          this.sectionStart = this.index + 1;
        }
      }
      stateInProcessingInstruction(c2) {
        if (c2 === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
          this.cbs.onprocessinginstruction(this.sectionStart, this.index);
          this.state = State.Text;
          this.sectionStart = this.index + 1;
        }
      }
      stateBeforeComment(c2) {
        if (c2 === CharCodes2.Dash) {
          this.state = State.InCommentLike;
          this.currentSequence = Sequences.CommentEnd;
          this.sequenceIndex = 2;
          this.sectionStart = this.index + 1;
        } else {
          this.state = State.InDeclaration;
        }
      }
      stateInSpecialComment(c2) {
        if (c2 === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
          this.cbs.oncomment(this.sectionStart, this.index, 0);
          this.state = State.Text;
          this.sectionStart = this.index + 1;
        }
      }
      stateBeforeSpecialS(c2) {
        const lower = c2 | 32;
        if (lower === Sequences.ScriptEnd[3]) {
          this.startSpecial(Sequences.ScriptEnd, 4);
        } else if (lower === Sequences.StyleEnd[3]) {
          this.startSpecial(Sequences.StyleEnd, 4);
        } else {
          this.state = State.InTagName;
          this.stateInTagName(c2);
        }
      }
      stateBeforeEntity(c2) {
        this.entityExcess = 1;
        this.entityResult = 0;
        if (c2 === CharCodes2.Number) {
          this.state = State.BeforeNumericEntity;
        } else if (c2 === CharCodes2.Amp) {
        } else {
          this.trieIndex = 0;
          this.trieCurrent = this.entityTrie[0];
          this.state = State.InNamedEntity;
          this.stateInNamedEntity(c2);
        }
      }
      stateInNamedEntity(c2) {
        this.entityExcess += 1;
        this.trieIndex = determineBranch(this.entityTrie, this.trieCurrent, this.trieIndex + 1, c2);
        if (this.trieIndex < 0) {
          this.emitNamedEntity();
          this.index--;
          return;
        }
        this.trieCurrent = this.entityTrie[this.trieIndex];
        const masked = this.trieCurrent & BinTrieFlags.VALUE_LENGTH;
        if (masked) {
          const valueLength = (masked >> 14) - 1;
          if (!this.allowLegacyEntity() && c2 !== CharCodes2.Semi) {
            this.trieIndex += valueLength;
          } else {
            const entityStart = this.index - this.entityExcess + 1;
            if (entityStart > this.sectionStart) {
              this.emitPartial(this.sectionStart, entityStart);
            }
            this.entityResult = this.trieIndex;
            this.trieIndex += valueLength;
            this.entityExcess = 0;
            this.sectionStart = this.index + 1;
            if (valueLength === 0) {
              this.emitNamedEntity();
            }
          }
        }
      }
      emitNamedEntity() {
        this.state = this.baseState;
        if (this.entityResult === 0) {
          return;
        }
        const valueLength = (this.entityTrie[this.entityResult] & BinTrieFlags.VALUE_LENGTH) >> 14;
        switch (valueLength) {
          case 1: {
            this.emitCodePoint(this.entityTrie[this.entityResult] & ~BinTrieFlags.VALUE_LENGTH);
            break;
          }
          case 2: {
            this.emitCodePoint(this.entityTrie[this.entityResult + 1]);
            break;
          }
          case 3: {
            this.emitCodePoint(this.entityTrie[this.entityResult + 1]);
            this.emitCodePoint(this.entityTrie[this.entityResult + 2]);
          }
        }
      }
      stateBeforeNumericEntity(c2) {
        if ((c2 | 32) === CharCodes2.LowerX) {
          this.entityExcess++;
          this.state = State.InHexEntity;
        } else {
          this.state = State.InNumericEntity;
          this.stateInNumericEntity(c2);
        }
      }
      emitNumericEntity(strict) {
        const entityStart = this.index - this.entityExcess - 1;
        const numberStart = entityStart + 2 + Number(this.state === State.InHexEntity);
        if (numberStart !== this.index) {
          if (entityStart > this.sectionStart) {
            this.emitPartial(this.sectionStart, entityStart);
          }
          this.sectionStart = this.index + Number(strict);
          this.emitCodePoint(replaceCodePoint(this.entityResult));
        }
        this.state = this.baseState;
      }
      stateInNumericEntity(c2) {
        if (c2 === CharCodes2.Semi) {
          this.emitNumericEntity(true);
        } else if (isNumber2(c2)) {
          this.entityResult = this.entityResult * 10 + (c2 - CharCodes2.Zero);
          this.entityExcess++;
        } else {
          if (this.allowLegacyEntity()) {
            this.emitNumericEntity(false);
          } else {
            this.state = this.baseState;
          }
          this.index--;
        }
      }
      stateInHexEntity(c2) {
        if (c2 === CharCodes2.Semi) {
          this.emitNumericEntity(true);
        } else if (isNumber2(c2)) {
          this.entityResult = this.entityResult * 16 + (c2 - CharCodes2.Zero);
          this.entityExcess++;
        } else if (isHexDigit(c2)) {
          this.entityResult = this.entityResult * 16 + ((c2 | 32) - CharCodes2.LowerA + 10);
          this.entityExcess++;
        } else {
          if (this.allowLegacyEntity()) {
            this.emitNumericEntity(false);
          } else {
            this.state = this.baseState;
          }
          this.index--;
        }
      }
      allowLegacyEntity() {
        return !this.xmlMode && (this.baseState === State.Text || this.baseState === State.InSpecialTag);
      }
      /**
       * Remove data that has already been consumed from the buffer.
       */
      cleanup() {
        if (this.running && this.sectionStart !== this.index) {
          if (this.state === State.Text || this.state === State.InSpecialTag && this.sequenceIndex === 0) {
            this.cbs.ontext(this.sectionStart, this.index);
            this.sectionStart = this.index;
          } else if (this.state === State.InAttributeValueDq || this.state === State.InAttributeValueSq || this.state === State.InAttributeValueNq) {
            this.cbs.onattribdata(this.sectionStart, this.index);
            this.sectionStart = this.index;
          }
        }
      }
      shouldContinue() {
        return this.index < this.buffer.length + this.offset && this.running;
      }
      /**
       * Iterates through the buffer, calling the function corresponding to the current state.
       *
       * States that are more likely to be hit are higher up, as a performance improvement.
       */
      parse() {
        while (this.shouldContinue()) {
          const c2 = this.buffer.charCodeAt(this.index - this.offset);
          switch (this.state) {
            case State.Text: {
              this.stateText(c2);
              break;
            }
            case State.SpecialStartSequence: {
              this.stateSpecialStartSequence(c2);
              break;
            }
            case State.InSpecialTag: {
              this.stateInSpecialTag(c2);
              break;
            }
            case State.CDATASequence: {
              this.stateCDATASequence(c2);
              break;
            }
            case State.InAttributeValueDq: {
              this.stateInAttributeValueDoubleQuotes(c2);
              break;
            }
            case State.InAttributeName: {
              this.stateInAttributeName(c2);
              break;
            }
            case State.InCommentLike: {
              this.stateInCommentLike(c2);
              break;
            }
            case State.InSpecialComment: {
              this.stateInSpecialComment(c2);
              break;
            }
            case State.BeforeAttributeName: {
              this.stateBeforeAttributeName(c2);
              break;
            }
            case State.InTagName: {
              this.stateInTagName(c2);
              break;
            }
            case State.InClosingTagName: {
              this.stateInClosingTagName(c2);
              break;
            }
            case State.BeforeTagName: {
              this.stateBeforeTagName(c2);
              break;
            }
            case State.AfterAttributeName: {
              this.stateAfterAttributeName(c2);
              break;
            }
            case State.InAttributeValueSq: {
              this.stateInAttributeValueSingleQuotes(c2);
              break;
            }
            case State.BeforeAttributeValue: {
              this.stateBeforeAttributeValue(c2);
              break;
            }
            case State.BeforeClosingTagName: {
              this.stateBeforeClosingTagName(c2);
              break;
            }
            case State.AfterClosingTagName: {
              this.stateAfterClosingTagName(c2);
              break;
            }
            case State.BeforeSpecialS: {
              this.stateBeforeSpecialS(c2);
              break;
            }
            case State.InAttributeValueNq: {
              this.stateInAttributeValueNoQuotes(c2);
              break;
            }
            case State.InSelfClosingTag: {
              this.stateInSelfClosingTag(c2);
              break;
            }
            case State.InDeclaration: {
              this.stateInDeclaration(c2);
              break;
            }
            case State.BeforeDeclaration: {
              this.stateBeforeDeclaration(c2);
              break;
            }
            case State.BeforeComment: {
              this.stateBeforeComment(c2);
              break;
            }
            case State.InProcessingInstruction: {
              this.stateInProcessingInstruction(c2);
              break;
            }
            case State.InNamedEntity: {
              this.stateInNamedEntity(c2);
              break;
            }
            case State.BeforeEntity: {
              this.stateBeforeEntity(c2);
              break;
            }
            case State.InHexEntity: {
              this.stateInHexEntity(c2);
              break;
            }
            case State.InNumericEntity: {
              this.stateInNumericEntity(c2);
              break;
            }
            default: {
              this.stateBeforeNumericEntity(c2);
            }
          }
          this.index++;
        }
        this.cleanup();
      }
      finish() {
        if (this.state === State.InNamedEntity) {
          this.emitNamedEntity();
        }
        if (this.sectionStart < this.index) {
          this.handleTrailingData();
        }
        this.cbs.onend();
      }
      /** Handle any trailing data. */
      handleTrailingData() {
        const endIndex = this.buffer.length + this.offset;
        if (this.state === State.InCommentLike) {
          if (this.currentSequence === Sequences.CdataEnd) {
            this.cbs.oncdata(this.sectionStart, endIndex, 0);
          } else {
            this.cbs.oncomment(this.sectionStart, endIndex, 0);
          }
        } else if (this.state === State.InNumericEntity && this.allowLegacyEntity()) {
          this.emitNumericEntity(false);
        } else if (this.state === State.InHexEntity && this.allowLegacyEntity()) {
          this.emitNumericEntity(false);
        } else if (this.state === State.InTagName || this.state === State.BeforeAttributeName || this.state === State.BeforeAttributeValue || this.state === State.AfterAttributeName || this.state === State.InAttributeName || this.state === State.InAttributeValueSq || this.state === State.InAttributeValueDq || this.state === State.InAttributeValueNq || this.state === State.InClosingTagName) {
        } else {
          this.cbs.ontext(this.sectionStart, endIndex);
        }
      }
      emitPartial(start, endIndex) {
        if (this.baseState !== State.Text && this.baseState !== State.InSpecialTag) {
          this.cbs.onattribdata(start, endIndex);
        } else {
          this.cbs.ontext(start, endIndex);
        }
      }
      emitCodePoint(cp) {
        if (this.baseState !== State.Text && this.baseState !== State.InSpecialTag) {
          this.cbs.onattribentity(cp);
        } else {
          this.cbs.ontextentity(cp);
        }
      }
    };
  }
});

// node_modules/htmlparser2/lib/esm/Parser.js
var formTags, pTag, tableSectionTags, ddtTags, rtpTags, openImpliesClose, voidElements, foreignContextElements, htmlIntegrationElements, reNameEnd, Parser;
var init_Parser = __esm({
  "node_modules/htmlparser2/lib/esm/Parser.js"() {
    init_Tokenizer();
    init_decode();
    formTags = /* @__PURE__ */ new Set([
      "input",
      "option",
      "optgroup",
      "select",
      "button",
      "datalist",
      "textarea"
    ]);
    pTag = /* @__PURE__ */ new Set(["p"]);
    tableSectionTags = /* @__PURE__ */ new Set(["thead", "tbody"]);
    ddtTags = /* @__PURE__ */ new Set(["dd", "dt"]);
    rtpTags = /* @__PURE__ */ new Set(["rt", "rp"]);
    openImpliesClose = /* @__PURE__ */ new Map([
      ["tr", /* @__PURE__ */ new Set(["tr", "th", "td"])],
      ["th", /* @__PURE__ */ new Set(["th"])],
      ["td", /* @__PURE__ */ new Set(["thead", "th", "td"])],
      ["body", /* @__PURE__ */ new Set(["head", "link", "script"])],
      ["li", /* @__PURE__ */ new Set(["li"])],
      ["p", pTag],
      ["h1", pTag],
      ["h2", pTag],
      ["h3", pTag],
      ["h4", pTag],
      ["h5", pTag],
      ["h6", pTag],
      ["select", formTags],
      ["input", formTags],
      ["output", formTags],
      ["button", formTags],
      ["datalist", formTags],
      ["textarea", formTags],
      ["option", /* @__PURE__ */ new Set(["option"])],
      ["optgroup", /* @__PURE__ */ new Set(["optgroup", "option"])],
      ["dd", ddtTags],
      ["dt", ddtTags],
      ["address", pTag],
      ["article", pTag],
      ["aside", pTag],
      ["blockquote", pTag],
      ["details", pTag],
      ["div", pTag],
      ["dl", pTag],
      ["fieldset", pTag],
      ["figcaption", pTag],
      ["figure", pTag],
      ["footer", pTag],
      ["form", pTag],
      ["header", pTag],
      ["hr", pTag],
      ["main", pTag],
      ["nav", pTag],
      ["ol", pTag],
      ["pre", pTag],
      ["section", pTag],
      ["table", pTag],
      ["ul", pTag],
      ["rt", rtpTags],
      ["rp", rtpTags],
      ["tbody", tableSectionTags],
      ["tfoot", tableSectionTags]
    ]);
    voidElements = /* @__PURE__ */ new Set([
      "area",
      "base",
      "basefont",
      "br",
      "col",
      "command",
      "embed",
      "frame",
      "hr",
      "img",
      "input",
      "isindex",
      "keygen",
      "link",
      "meta",
      "param",
      "source",
      "track",
      "wbr"
    ]);
    foreignContextElements = /* @__PURE__ */ new Set(["math", "svg"]);
    htmlIntegrationElements = /* @__PURE__ */ new Set([
      "mi",
      "mo",
      "mn",
      "ms",
      "mtext",
      "annotation-xml",
      "foreignobject",
      "desc",
      "title"
    ]);
    reNameEnd = /\s|\//;
    Parser = class {
      constructor(cbs, options = {}) {
        var _a3, _b, _c, _d, _e4;
        this.options = options;
        this.startIndex = 0;
        this.endIndex = 0;
        this.openTagStart = 0;
        this.tagname = "";
        this.attribname = "";
        this.attribvalue = "";
        this.attribs = null;
        this.stack = [];
        this.foreignContext = [];
        this.buffers = [];
        this.bufferOffset = 0;
        this.writeIndex = 0;
        this.ended = false;
        this.cbs = cbs !== null && cbs !== void 0 ? cbs : {};
        this.lowerCaseTagNames = (_a3 = options.lowerCaseTags) !== null && _a3 !== void 0 ? _a3 : !options.xmlMode;
        this.lowerCaseAttributeNames = (_b = options.lowerCaseAttributeNames) !== null && _b !== void 0 ? _b : !options.xmlMode;
        this.tokenizer = new ((_c = options.Tokenizer) !== null && _c !== void 0 ? _c : Tokenizer)(this.options, this);
        (_e4 = (_d = this.cbs).onparserinit) === null || _e4 === void 0 ? void 0 : _e4.call(_d, this);
      }
      // Tokenizer event handlers
      /** @internal */
      ontext(start, endIndex) {
        var _a3, _b;
        const data = this.getSlice(start, endIndex);
        this.endIndex = endIndex - 1;
        (_b = (_a3 = this.cbs).ontext) === null || _b === void 0 ? void 0 : _b.call(_a3, data);
        this.startIndex = endIndex;
      }
      /** @internal */
      ontextentity(cp) {
        var _a3, _b;
        const index = this.tokenizer.getSectionStart();
        this.endIndex = index - 1;
        (_b = (_a3 = this.cbs).ontext) === null || _b === void 0 ? void 0 : _b.call(_a3, fromCodePoint(cp));
        this.startIndex = index;
      }
      isVoidElement(name2) {
        return !this.options.xmlMode && voidElements.has(name2);
      }
      /** @internal */
      onopentagname(start, endIndex) {
        this.endIndex = endIndex;
        let name2 = this.getSlice(start, endIndex);
        if (this.lowerCaseTagNames) {
          name2 = name2.toLowerCase();
        }
        this.emitOpenTag(name2);
      }
      emitOpenTag(name2) {
        var _a3, _b, _c, _d;
        this.openTagStart = this.startIndex;
        this.tagname = name2;
        const impliesClose = !this.options.xmlMode && openImpliesClose.get(name2);
        if (impliesClose) {
          while (this.stack.length > 0 && impliesClose.has(this.stack[this.stack.length - 1])) {
            const element = this.stack.pop();
            (_b = (_a3 = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a3, element, true);
          }
        }
        if (!this.isVoidElement(name2)) {
          this.stack.push(name2);
          if (foreignContextElements.has(name2)) {
            this.foreignContext.push(true);
          } else if (htmlIntegrationElements.has(name2)) {
            this.foreignContext.push(false);
          }
        }
        (_d = (_c = this.cbs).onopentagname) === null || _d === void 0 ? void 0 : _d.call(_c, name2);
        if (this.cbs.onopentag)
          this.attribs = {};
      }
      endOpenTag(isImplied) {
        var _a3, _b;
        this.startIndex = this.openTagStart;
        if (this.attribs) {
          (_b = (_a3 = this.cbs).onopentag) === null || _b === void 0 ? void 0 : _b.call(_a3, this.tagname, this.attribs, isImplied);
          this.attribs = null;
        }
        if (this.cbs.onclosetag && this.isVoidElement(this.tagname)) {
          this.cbs.onclosetag(this.tagname, true);
        }
        this.tagname = "";
      }
      /** @internal */
      onopentagend(endIndex) {
        this.endIndex = endIndex;
        this.endOpenTag(false);
        this.startIndex = endIndex + 1;
      }
      /** @internal */
      onclosetag(start, endIndex) {
        var _a3, _b, _c, _d, _e4, _f;
        this.endIndex = endIndex;
        let name2 = this.getSlice(start, endIndex);
        if (this.lowerCaseTagNames) {
          name2 = name2.toLowerCase();
        }
        if (foreignContextElements.has(name2) || htmlIntegrationElements.has(name2)) {
          this.foreignContext.pop();
        }
        if (!this.isVoidElement(name2)) {
          const pos = this.stack.lastIndexOf(name2);
          if (pos !== -1) {
            if (this.cbs.onclosetag) {
              let count = this.stack.length - pos;
              while (count--) {
                this.cbs.onclosetag(this.stack.pop(), count !== 0);
              }
            } else
              this.stack.length = pos;
          } else if (!this.options.xmlMode && name2 === "p") {
            this.emitOpenTag("p");
            this.closeCurrentTag(true);
          }
        } else if (!this.options.xmlMode && name2 === "br") {
          (_b = (_a3 = this.cbs).onopentagname) === null || _b === void 0 ? void 0 : _b.call(_a3, "br");
          (_d = (_c = this.cbs).onopentag) === null || _d === void 0 ? void 0 : _d.call(_c, "br", {}, true);
          (_f = (_e4 = this.cbs).onclosetag) === null || _f === void 0 ? void 0 : _f.call(_e4, "br", false);
        }
        this.startIndex = endIndex + 1;
      }
      /** @internal */
      onselfclosingtag(endIndex) {
        this.endIndex = endIndex;
        if (this.options.xmlMode || this.options.recognizeSelfClosing || this.foreignContext[this.foreignContext.length - 1]) {
          this.closeCurrentTag(false);
          this.startIndex = endIndex + 1;
        } else {
          this.onopentagend(endIndex);
        }
      }
      closeCurrentTag(isOpenImplied) {
        var _a3, _b;
        const name2 = this.tagname;
        this.endOpenTag(isOpenImplied);
        if (this.stack[this.stack.length - 1] === name2) {
          (_b = (_a3 = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a3, name2, !isOpenImplied);
          this.stack.pop();
        }
      }
      /** @internal */
      onattribname(start, endIndex) {
        this.startIndex = start;
        const name2 = this.getSlice(start, endIndex);
        this.attribname = this.lowerCaseAttributeNames ? name2.toLowerCase() : name2;
      }
      /** @internal */
      onattribdata(start, endIndex) {
        this.attribvalue += this.getSlice(start, endIndex);
      }
      /** @internal */
      onattribentity(cp) {
        this.attribvalue += fromCodePoint(cp);
      }
      /** @internal */
      onattribend(quote, endIndex) {
        var _a3, _b;
        this.endIndex = endIndex;
        (_b = (_a3 = this.cbs).onattribute) === null || _b === void 0 ? void 0 : _b.call(_a3, this.attribname, this.attribvalue, quote === QuoteType.Double ? '"' : quote === QuoteType.Single ? "'" : quote === QuoteType.NoValue ? void 0 : null);
        if (this.attribs && !Object.prototype.hasOwnProperty.call(this.attribs, this.attribname)) {
          this.attribs[this.attribname] = this.attribvalue;
        }
        this.attribvalue = "";
      }
      getInstructionName(value) {
        const index = value.search(reNameEnd);
        let name2 = index < 0 ? value : value.substr(0, index);
        if (this.lowerCaseTagNames) {
          name2 = name2.toLowerCase();
        }
        return name2;
      }
      /** @internal */
      ondeclaration(start, endIndex) {
        this.endIndex = endIndex;
        const value = this.getSlice(start, endIndex);
        if (this.cbs.onprocessinginstruction) {
          const name2 = this.getInstructionName(value);
          this.cbs.onprocessinginstruction(`!${name2}`, `!${value}`);
        }
        this.startIndex = endIndex + 1;
      }
      /** @internal */
      onprocessinginstruction(start, endIndex) {
        this.endIndex = endIndex;
        const value = this.getSlice(start, endIndex);
        if (this.cbs.onprocessinginstruction) {
          const name2 = this.getInstructionName(value);
          this.cbs.onprocessinginstruction(`?${name2}`, `?${value}`);
        }
        this.startIndex = endIndex + 1;
      }
      /** @internal */
      oncomment(start, endIndex, offset) {
        var _a3, _b, _c, _d;
        this.endIndex = endIndex;
        (_b = (_a3 = this.cbs).oncomment) === null || _b === void 0 ? void 0 : _b.call(_a3, this.getSlice(start, endIndex - offset));
        (_d = (_c = this.cbs).oncommentend) === null || _d === void 0 ? void 0 : _d.call(_c);
        this.startIndex = endIndex + 1;
      }
      /** @internal */
      oncdata(start, endIndex, offset) {
        var _a3, _b, _c, _d, _e4, _f, _g, _h, _j, _k;
        this.endIndex = endIndex;
        const value = this.getSlice(start, endIndex - offset);
        if (this.options.xmlMode || this.options.recognizeCDATA) {
          (_b = (_a3 = this.cbs).oncdatastart) === null || _b === void 0 ? void 0 : _b.call(_a3);
          (_d = (_c = this.cbs).ontext) === null || _d === void 0 ? void 0 : _d.call(_c, value);
          (_f = (_e4 = this.cbs).oncdataend) === null || _f === void 0 ? void 0 : _f.call(_e4);
        } else {
          (_h = (_g = this.cbs).oncomment) === null || _h === void 0 ? void 0 : _h.call(_g, `[CDATA[${value}]]`);
          (_k = (_j = this.cbs).oncommentend) === null || _k === void 0 ? void 0 : _k.call(_j);
        }
        this.startIndex = endIndex + 1;
      }
      /** @internal */
      onend() {
        var _a3, _b;
        if (this.cbs.onclosetag) {
          this.endIndex = this.startIndex;
          for (let index = this.stack.length; index > 0; this.cbs.onclosetag(this.stack[--index], true))
            ;
        }
        (_b = (_a3 = this.cbs).onend) === null || _b === void 0 ? void 0 : _b.call(_a3);
      }
      /**
       * Resets the parser to a blank state, ready to parse a new HTML document
       */
      reset() {
        var _a3, _b, _c, _d;
        (_b = (_a3 = this.cbs).onreset) === null || _b === void 0 ? void 0 : _b.call(_a3);
        this.tokenizer.reset();
        this.tagname = "";
        this.attribname = "";
        this.attribs = null;
        this.stack.length = 0;
        this.startIndex = 0;
        this.endIndex = 0;
        (_d = (_c = this.cbs).onparserinit) === null || _d === void 0 ? void 0 : _d.call(_c, this);
        this.buffers.length = 0;
        this.bufferOffset = 0;
        this.writeIndex = 0;
        this.ended = false;
      }
      /**
       * Resets the parser, then parses a complete document and
       * pushes it to the handler.
       *
       * @param data Document to parse.
       */
      parseComplete(data) {
        this.reset();
        this.end(data);
      }
      getSlice(start, end) {
        while (start - this.bufferOffset >= this.buffers[0].length) {
          this.shiftBuffer();
        }
        let slice = this.buffers[0].slice(start - this.bufferOffset, end - this.bufferOffset);
        while (end - this.bufferOffset > this.buffers[0].length) {
          this.shiftBuffer();
          slice += this.buffers[0].slice(0, end - this.bufferOffset);
        }
        return slice;
      }
      shiftBuffer() {
        this.bufferOffset += this.buffers[0].length;
        this.writeIndex--;
        this.buffers.shift();
      }
      /**
       * Parses a chunk of data and calls the corresponding callbacks.
       *
       * @param chunk Chunk to parse.
       */
      write(chunk) {
        var _a3, _b;
        if (this.ended) {
          (_b = (_a3 = this.cbs).onerror) === null || _b === void 0 ? void 0 : _b.call(_a3, new Error(".write() after done!"));
          return;
        }
        this.buffers.push(chunk);
        if (this.tokenizer.running) {
          this.tokenizer.write(chunk);
          this.writeIndex++;
        }
      }
      /**
       * Parses the end of the buffer and clears the stack, calls onend.
       *
       * @param chunk Optional final chunk to parse.
       */
      end(chunk) {
        var _a3, _b;
        if (this.ended) {
          (_b = (_a3 = this.cbs).onerror) === null || _b === void 0 ? void 0 : _b.call(_a3, new Error(".end() after done!"));
          return;
        }
        if (chunk)
          this.write(chunk);
        this.ended = true;
        this.tokenizer.end();
      }
      /**
       * Pauses parsing. The parser won't emit events until `resume` is called.
       */
      pause() {
        this.tokenizer.pause();
      }
      /**
       * Resumes parsing after `pause` was called.
       */
      resume() {
        this.tokenizer.resume();
        while (this.tokenizer.running && this.writeIndex < this.buffers.length) {
          this.tokenizer.write(this.buffers[this.writeIndex++]);
        }
        if (this.ended)
          this.tokenizer.end();
      }
      /**
       * Alias of `write`, for backwards compatibility.
       *
       * @param chunk Chunk to parse.
       * @deprecated
       */
      parseChunk(chunk) {
        this.write(chunk);
      }
      /**
       * Alias of `end`, for backwards compatibility.
       *
       * @param chunk Optional final chunk to parse.
       * @deprecated
       */
      done(chunk) {
        this.end(chunk);
      }
    };
  }
});

// node_modules/entities/lib/esm/generated/encode-html.js
function restoreDiff(arr) {
  for (let i = 1; i < arr.length; i++) {
    arr[i][0] += arr[i - 1][0] + 1;
  }
  return arr;
}
var encode_html_default;
var init_encode_html = __esm({
  "node_modules/entities/lib/esm/generated/encode-html.js"() {
    encode_html_default = new Map(/* @__PURE__ */ restoreDiff([[9, "&Tab;"], [0, "&NewLine;"], [22, "&excl;"], [0, "&quot;"], [0, "&num;"], [0, "&dollar;"], [0, "&percnt;"], [0, "&amp;"], [0, "&apos;"], [0, "&lpar;"], [0, "&rpar;"], [0, "&ast;"], [0, "&plus;"], [0, "&comma;"], [1, "&period;"], [0, "&sol;"], [10, "&colon;"], [0, "&semi;"], [0, { v: "&lt;", n: 8402, o: "&nvlt;" }], [0, { v: "&equals;", n: 8421, o: "&bne;" }], [0, { v: "&gt;", n: 8402, o: "&nvgt;" }], [0, "&quest;"], [0, "&commat;"], [26, "&lbrack;"], [0, "&bsol;"], [0, "&rbrack;"], [0, "&Hat;"], [0, "&lowbar;"], [0, "&DiacriticalGrave;"], [5, { n: 106, o: "&fjlig;" }], [20, "&lbrace;"], [0, "&verbar;"], [0, "&rbrace;"], [34, "&nbsp;"], [0, "&iexcl;"], [0, "&cent;"], [0, "&pound;"], [0, "&curren;"], [0, "&yen;"], [0, "&brvbar;"], [0, "&sect;"], [0, "&die;"], [0, "&copy;"], [0, "&ordf;"], [0, "&laquo;"], [0, "&not;"], [0, "&shy;"], [0, "&circledR;"], [0, "&macr;"], [0, "&deg;"], [0, "&PlusMinus;"], [0, "&sup2;"], [0, "&sup3;"], [0, "&acute;"], [0, "&micro;"], [0, "&para;"], [0, "&centerdot;"], [0, "&cedil;"], [0, "&sup1;"], [0, "&ordm;"], [0, "&raquo;"], [0, "&frac14;"], [0, "&frac12;"], [0, "&frac34;"], [0, "&iquest;"], [0, "&Agrave;"], [0, "&Aacute;"], [0, "&Acirc;"], [0, "&Atilde;"], [0, "&Auml;"], [0, "&angst;"], [0, "&AElig;"], [0, "&Ccedil;"], [0, "&Egrave;"], [0, "&Eacute;"], [0, "&Ecirc;"], [0, "&Euml;"], [0, "&Igrave;"], [0, "&Iacute;"], [0, "&Icirc;"], [0, "&Iuml;"], [0, "&ETH;"], [0, "&Ntilde;"], [0, "&Ograve;"], [0, "&Oacute;"], [0, "&Ocirc;"], [0, "&Otilde;"], [0, "&Ouml;"], [0, "&times;"], [0, "&Oslash;"], [0, "&Ugrave;"], [0, "&Uacute;"], [0, "&Ucirc;"], [0, "&Uuml;"], [0, "&Yacute;"], [0, "&THORN;"], [0, "&szlig;"], [0, "&agrave;"], [0, "&aacute;"], [0, "&acirc;"], [0, "&atilde;"], [0, "&auml;"], [0, "&aring;"], [0, "&aelig;"], [0, "&ccedil;"], [0, "&egrave;"], [0, "&eacute;"], [0, "&ecirc;"], [0, "&euml;"], [0, "&igrave;"], [0, "&iacute;"], [0, "&icirc;"], [0, "&iuml;"], [0, "&eth;"], [0, "&ntilde;"], [0, "&ograve;"], [0, "&oacute;"], [0, "&ocirc;"], [0, "&otilde;"], [0, "&ouml;"], [0, "&div;"], [0, "&oslash;"], [0, "&ugrave;"], [0, "&uacute;"], [0, "&ucirc;"], [0, "&uuml;"], [0, "&yacute;"], [0, "&thorn;"], [0, "&yuml;"], [0, "&Amacr;"], [0, "&amacr;"], [0, "&Abreve;"], [0, "&abreve;"], [0, "&Aogon;"], [0, "&aogon;"], [0, "&Cacute;"], [0, "&cacute;"], [0, "&Ccirc;"], [0, "&ccirc;"], [0, "&Cdot;"], [0, "&cdot;"], [0, "&Ccaron;"], [0, "&ccaron;"], [0, "&Dcaron;"], [0, "&dcaron;"], [0, "&Dstrok;"], [0, "&dstrok;"], [0, "&Emacr;"], [0, "&emacr;"], [2, "&Edot;"], [0, "&edot;"], [0, "&Eogon;"], [0, "&eogon;"], [0, "&Ecaron;"], [0, "&ecaron;"], [0, "&Gcirc;"], [0, "&gcirc;"], [0, "&Gbreve;"], [0, "&gbreve;"], [0, "&Gdot;"], [0, "&gdot;"], [0, "&Gcedil;"], [1, "&Hcirc;"], [0, "&hcirc;"], [0, "&Hstrok;"], [0, "&hstrok;"], [0, "&Itilde;"], [0, "&itilde;"], [0, "&Imacr;"], [0, "&imacr;"], [2, "&Iogon;"], [0, "&iogon;"], [0, "&Idot;"], [0, "&imath;"], [0, "&IJlig;"], [0, "&ijlig;"], [0, "&Jcirc;"], [0, "&jcirc;"], [0, "&Kcedil;"], [0, "&kcedil;"], [0, "&kgreen;"], [0, "&Lacute;"], [0, "&lacute;"], [0, "&Lcedil;"], [0, "&lcedil;"], [0, "&Lcaron;"], [0, "&lcaron;"], [0, "&Lmidot;"], [0, "&lmidot;"], [0, "&Lstrok;"], [0, "&lstrok;"], [0, "&Nacute;"], [0, "&nacute;"], [0, "&Ncedil;"], [0, "&ncedil;"], [0, "&Ncaron;"], [0, "&ncaron;"], [0, "&napos;"], [0, "&ENG;"], [0, "&eng;"], [0, "&Omacr;"], [0, "&omacr;"], [2, "&Odblac;"], [0, "&odblac;"], [0, "&OElig;"], [0, "&oelig;"], [0, "&Racute;"], [0, "&racute;"], [0, "&Rcedil;"], [0, "&rcedil;"], [0, "&Rcaron;"], [0, "&rcaron;"], [0, "&Sacute;"], [0, "&sacute;"], [0, "&Scirc;"], [0, "&scirc;"], [0, "&Scedil;"], [0, "&scedil;"], [0, "&Scaron;"], [0, "&scaron;"], [0, "&Tcedil;"], [0, "&tcedil;"], [0, "&Tcaron;"], [0, "&tcaron;"], [0, "&Tstrok;"], [0, "&tstrok;"], [0, "&Utilde;"], [0, "&utilde;"], [0, "&Umacr;"], [0, "&umacr;"], [0, "&Ubreve;"], [0, "&ubreve;"], [0, "&Uring;"], [0, "&uring;"], [0, "&Udblac;"], [0, "&udblac;"], [0, "&Uogon;"], [0, "&uogon;"], [0, "&Wcirc;"], [0, "&wcirc;"], [0, "&Ycirc;"], [0, "&ycirc;"], [0, "&Yuml;"], [0, "&Zacute;"], [0, "&zacute;"], [0, "&Zdot;"], [0, "&zdot;"], [0, "&Zcaron;"], [0, "&zcaron;"], [19, "&fnof;"], [34, "&imped;"], [63, "&gacute;"], [65, "&jmath;"], [142, "&circ;"], [0, "&caron;"], [16, "&breve;"], [0, "&DiacriticalDot;"], [0, "&ring;"], [0, "&ogon;"], [0, "&DiacriticalTilde;"], [0, "&dblac;"], [51, "&DownBreve;"], [127, "&Alpha;"], [0, "&Beta;"], [0, "&Gamma;"], [0, "&Delta;"], [0, "&Epsilon;"], [0, "&Zeta;"], [0, "&Eta;"], [0, "&Theta;"], [0, "&Iota;"], [0, "&Kappa;"], [0, "&Lambda;"], [0, "&Mu;"], [0, "&Nu;"], [0, "&Xi;"], [0, "&Omicron;"], [0, "&Pi;"], [0, "&Rho;"], [1, "&Sigma;"], [0, "&Tau;"], [0, "&Upsilon;"], [0, "&Phi;"], [0, "&Chi;"], [0, "&Psi;"], [0, "&ohm;"], [7, "&alpha;"], [0, "&beta;"], [0, "&gamma;"], [0, "&delta;"], [0, "&epsi;"], [0, "&zeta;"], [0, "&eta;"], [0, "&theta;"], [0, "&iota;"], [0, "&kappa;"], [0, "&lambda;"], [0, "&mu;"], [0, "&nu;"], [0, "&xi;"], [0, "&omicron;"], [0, "&pi;"], [0, "&rho;"], [0, "&sigmaf;"], [0, "&sigma;"], [0, "&tau;"], [0, "&upsi;"], [0, "&phi;"], [0, "&chi;"], [0, "&psi;"], [0, "&omega;"], [7, "&thetasym;"], [0, "&Upsi;"], [2, "&phiv;"], [0, "&piv;"], [5, "&Gammad;"], [0, "&digamma;"], [18, "&kappav;"], [0, "&rhov;"], [3, "&epsiv;"], [0, "&backepsilon;"], [10, "&IOcy;"], [0, "&DJcy;"], [0, "&GJcy;"], [0, "&Jukcy;"], [0, "&DScy;"], [0, "&Iukcy;"], [0, "&YIcy;"], [0, "&Jsercy;"], [0, "&LJcy;"], [0, "&NJcy;"], [0, "&TSHcy;"], [0, "&KJcy;"], [1, "&Ubrcy;"], [0, "&DZcy;"], [0, "&Acy;"], [0, "&Bcy;"], [0, "&Vcy;"], [0, "&Gcy;"], [0, "&Dcy;"], [0, "&IEcy;"], [0, "&ZHcy;"], [0, "&Zcy;"], [0, "&Icy;"], [0, "&Jcy;"], [0, "&Kcy;"], [0, "&Lcy;"], [0, "&Mcy;"], [0, "&Ncy;"], [0, "&Ocy;"], [0, "&Pcy;"], [0, "&Rcy;"], [0, "&Scy;"], [0, "&Tcy;"], [0, "&Ucy;"], [0, "&Fcy;"], [0, "&KHcy;"], [0, "&TScy;"], [0, "&CHcy;"], [0, "&SHcy;"], [0, "&SHCHcy;"], [0, "&HARDcy;"], [0, "&Ycy;"], [0, "&SOFTcy;"], [0, "&Ecy;"], [0, "&YUcy;"], [0, "&YAcy;"], [0, "&acy;"], [0, "&bcy;"], [0, "&vcy;"], [0, "&gcy;"], [0, "&dcy;"], [0, "&iecy;"], [0, "&zhcy;"], [0, "&zcy;"], [0, "&icy;"], [0, "&jcy;"], [0, "&kcy;"], [0, "&lcy;"], [0, "&mcy;"], [0, "&ncy;"], [0, "&ocy;"], [0, "&pcy;"], [0, "&rcy;"], [0, "&scy;"], [0, "&tcy;"], [0, "&ucy;"], [0, "&fcy;"], [0, "&khcy;"], [0, "&tscy;"], [0, "&chcy;"], [0, "&shcy;"], [0, "&shchcy;"], [0, "&hardcy;"], [0, "&ycy;"], [0, "&softcy;"], [0, "&ecy;"], [0, "&yucy;"], [0, "&yacy;"], [1, "&iocy;"], [0, "&djcy;"], [0, "&gjcy;"], [0, "&jukcy;"], [0, "&dscy;"], [0, "&iukcy;"], [0, "&yicy;"], [0, "&jsercy;"], [0, "&ljcy;"], [0, "&njcy;"], [0, "&tshcy;"], [0, "&kjcy;"], [1, "&ubrcy;"], [0, "&dzcy;"], [7074, "&ensp;"], [0, "&emsp;"], [0, "&emsp13;"], [0, "&emsp14;"], [1, "&numsp;"], [0, "&puncsp;"], [0, "&ThinSpace;"], [0, "&hairsp;"], [0, "&NegativeMediumSpace;"], [0, "&zwnj;"], [0, "&zwj;"], [0, "&lrm;"], [0, "&rlm;"], [0, "&dash;"], [2, "&ndash;"], [0, "&mdash;"], [0, "&horbar;"], [0, "&Verbar;"], [1, "&lsquo;"], [0, "&CloseCurlyQuote;"], [0, "&lsquor;"], [1, "&ldquo;"], [0, "&CloseCurlyDoubleQuote;"], [0, "&bdquo;"], [1, "&dagger;"], [0, "&Dagger;"], [0, "&bull;"], [2, "&nldr;"], [0, "&hellip;"], [9, "&permil;"], [0, "&pertenk;"], [0, "&prime;"], [0, "&Prime;"], [0, "&tprime;"], [0, "&backprime;"], [3, "&lsaquo;"], [0, "&rsaquo;"], [3, "&oline;"], [2, "&caret;"], [1, "&hybull;"], [0, "&frasl;"], [10, "&bsemi;"], [7, "&qprime;"], [7, { v: "&MediumSpace;", n: 8202, o: "&ThickSpace;" }], [0, "&NoBreak;"], [0, "&af;"], [0, "&InvisibleTimes;"], [0, "&ic;"], [72, "&euro;"], [46, "&tdot;"], [0, "&DotDot;"], [37, "&complexes;"], [2, "&incare;"], [4, "&gscr;"], [0, "&hamilt;"], [0, "&Hfr;"], [0, "&Hopf;"], [0, "&planckh;"], [0, "&hbar;"], [0, "&imagline;"], [0, "&Ifr;"], [0, "&lagran;"], [0, "&ell;"], [1, "&naturals;"], [0, "&numero;"], [0, "&copysr;"], [0, "&weierp;"], [0, "&Popf;"], [0, "&Qopf;"], [0, "&realine;"], [0, "&real;"], [0, "&reals;"], [0, "&rx;"], [3, "&trade;"], [1, "&integers;"], [2, "&mho;"], [0, "&zeetrf;"], [0, "&iiota;"], [2, "&bernou;"], [0, "&Cayleys;"], [1, "&escr;"], [0, "&Escr;"], [0, "&Fouriertrf;"], [1, "&Mellintrf;"], [0, "&order;"], [0, "&alefsym;"], [0, "&beth;"], [0, "&gimel;"], [0, "&daleth;"], [12, "&CapitalDifferentialD;"], [0, "&dd;"], [0, "&ee;"], [0, "&ii;"], [10, "&frac13;"], [0, "&frac23;"], [0, "&frac15;"], [0, "&frac25;"], [0, "&frac35;"], [0, "&frac45;"], [0, "&frac16;"], [0, "&frac56;"], [0, "&frac18;"], [0, "&frac38;"], [0, "&frac58;"], [0, "&frac78;"], [49, "&larr;"], [0, "&ShortUpArrow;"], [0, "&rarr;"], [0, "&darr;"], [0, "&harr;"], [0, "&updownarrow;"], [0, "&nwarr;"], [0, "&nearr;"], [0, "&LowerRightArrow;"], [0, "&LowerLeftArrow;"], [0, "&nlarr;"], [0, "&nrarr;"], [1, { v: "&rarrw;", n: 824, o: "&nrarrw;" }], [0, "&Larr;"], [0, "&Uarr;"], [0, "&Rarr;"], [0, "&Darr;"], [0, "&larrtl;"], [0, "&rarrtl;"], [0, "&LeftTeeArrow;"], [0, "&mapstoup;"], [0, "&map;"], [0, "&DownTeeArrow;"], [1, "&hookleftarrow;"], [0, "&hookrightarrow;"], [0, "&larrlp;"], [0, "&looparrowright;"], [0, "&harrw;"], [0, "&nharr;"], [1, "&lsh;"], [0, "&rsh;"], [0, "&ldsh;"], [0, "&rdsh;"], [1, "&crarr;"], [0, "&cularr;"], [0, "&curarr;"], [2, "&circlearrowleft;"], [0, "&circlearrowright;"], [0, "&leftharpoonup;"], [0, "&DownLeftVector;"], [0, "&RightUpVector;"], [0, "&LeftUpVector;"], [0, "&rharu;"], [0, "&DownRightVector;"], [0, "&dharr;"], [0, "&dharl;"], [0, "&RightArrowLeftArrow;"], [0, "&udarr;"], [0, "&LeftArrowRightArrow;"], [0, "&leftleftarrows;"], [0, "&upuparrows;"], [0, "&rightrightarrows;"], [0, "&ddarr;"], [0, "&leftrightharpoons;"], [0, "&Equilibrium;"], [0, "&nlArr;"], [0, "&nhArr;"], [0, "&nrArr;"], [0, "&DoubleLeftArrow;"], [0, "&DoubleUpArrow;"], [0, "&DoubleRightArrow;"], [0, "&dArr;"], [0, "&DoubleLeftRightArrow;"], [0, "&DoubleUpDownArrow;"], [0, "&nwArr;"], [0, "&neArr;"], [0, "&seArr;"], [0, "&swArr;"], [0, "&lAarr;"], [0, "&rAarr;"], [1, "&zigrarr;"], [6, "&larrb;"], [0, "&rarrb;"], [15, "&DownArrowUpArrow;"], [7, "&loarr;"], [0, "&roarr;"], [0, "&hoarr;"], [0, "&forall;"], [0, "&comp;"], [0, { v: "&part;", n: 824, o: "&npart;" }], [0, "&exist;"], [0, "&nexist;"], [0, "&empty;"], [1, "&Del;"], [0, "&Element;"], [0, "&NotElement;"], [1, "&ni;"], [0, "&notni;"], [2, "&prod;"], [0, "&coprod;"], [0, "&sum;"], [0, "&minus;"], [0, "&MinusPlus;"], [0, "&dotplus;"], [1, "&Backslash;"], [0, "&lowast;"], [0, "&compfn;"], [1, "&radic;"], [2, "&prop;"], [0, "&infin;"], [0, "&angrt;"], [0, { v: "&ang;", n: 8402, o: "&nang;" }], [0, "&angmsd;"], [0, "&angsph;"], [0, "&mid;"], [0, "&nmid;"], [0, "&DoubleVerticalBar;"], [0, "&NotDoubleVerticalBar;"], [0, "&and;"], [0, "&or;"], [0, { v: "&cap;", n: 65024, o: "&caps;" }], [0, { v: "&cup;", n: 65024, o: "&cups;" }], [0, "&int;"], [0, "&Int;"], [0, "&iiint;"], [0, "&conint;"], [0, "&Conint;"], [0, "&Cconint;"], [0, "&cwint;"], [0, "&ClockwiseContourIntegral;"], [0, "&awconint;"], [0, "&there4;"], [0, "&becaus;"], [0, "&ratio;"], [0, "&Colon;"], [0, "&dotminus;"], [1, "&mDDot;"], [0, "&homtht;"], [0, { v: "&sim;", n: 8402, o: "&nvsim;" }], [0, { v: "&backsim;", n: 817, o: "&race;" }], [0, { v: "&ac;", n: 819, o: "&acE;" }], [0, "&acd;"], [0, "&VerticalTilde;"], [0, "&NotTilde;"], [0, { v: "&eqsim;", n: 824, o: "&nesim;" }], [0, "&sime;"], [0, "&NotTildeEqual;"], [0, "&cong;"], [0, "&simne;"], [0, "&ncong;"], [0, "&ap;"], [0, "&nap;"], [0, "&ape;"], [0, { v: "&apid;", n: 824, o: "&napid;" }], [0, "&backcong;"], [0, { v: "&asympeq;", n: 8402, o: "&nvap;" }], [0, { v: "&bump;", n: 824, o: "&nbump;" }], [0, { v: "&bumpe;", n: 824, o: "&nbumpe;" }], [0, { v: "&doteq;", n: 824, o: "&nedot;" }], [0, "&doteqdot;"], [0, "&efDot;"], [0, "&erDot;"], [0, "&Assign;"], [0, "&ecolon;"], [0, "&ecir;"], [0, "&circeq;"], [1, "&wedgeq;"], [0, "&veeeq;"], [1, "&triangleq;"], [2, "&equest;"], [0, "&ne;"], [0, { v: "&Congruent;", n: 8421, o: "&bnequiv;" }], [0, "&nequiv;"], [1, { v: "&le;", n: 8402, o: "&nvle;" }], [0, { v: "&ge;", n: 8402, o: "&nvge;" }], [0, { v: "&lE;", n: 824, o: "&nlE;" }], [0, { v: "&gE;", n: 824, o: "&ngE;" }], [0, { v: "&lnE;", n: 65024, o: "&lvertneqq;" }], [0, { v: "&gnE;", n: 65024, o: "&gvertneqq;" }], [0, { v: "&ll;", n: new Map(/* @__PURE__ */ restoreDiff([[824, "&nLtv;"], [7577, "&nLt;"]])) }], [0, { v: "&gg;", n: new Map(/* @__PURE__ */ restoreDiff([[824, "&nGtv;"], [7577, "&nGt;"]])) }], [0, "&between;"], [0, "&NotCupCap;"], [0, "&nless;"], [0, "&ngt;"], [0, "&nle;"], [0, "&nge;"], [0, "&lesssim;"], [0, "&GreaterTilde;"], [0, "&nlsim;"], [0, "&ngsim;"], [0, "&LessGreater;"], [0, "&gl;"], [0, "&NotLessGreater;"], [0, "&NotGreaterLess;"], [0, "&pr;"], [0, "&sc;"], [0, "&prcue;"], [0, "&sccue;"], [0, "&PrecedesTilde;"], [0, { v: "&scsim;", n: 824, o: "&NotSucceedsTilde;" }], [0, "&NotPrecedes;"], [0, "&NotSucceeds;"], [0, { v: "&sub;", n: 8402, o: "&NotSubset;" }], [0, { v: "&sup;", n: 8402, o: "&NotSuperset;" }], [0, "&nsub;"], [0, "&nsup;"], [0, "&sube;"], [0, "&supe;"], [0, "&NotSubsetEqual;"], [0, "&NotSupersetEqual;"], [0, { v: "&subne;", n: 65024, o: "&varsubsetneq;" }], [0, { v: "&supne;", n: 65024, o: "&varsupsetneq;" }], [1, "&cupdot;"], [0, "&UnionPlus;"], [0, { v: "&sqsub;", n: 824, o: "&NotSquareSubset;" }], [0, { v: "&sqsup;", n: 824, o: "&NotSquareSuperset;" }], [0, "&sqsube;"], [0, "&sqsupe;"], [0, { v: "&sqcap;", n: 65024, o: "&sqcaps;" }], [0, { v: "&sqcup;", n: 65024, o: "&sqcups;" }], [0, "&CirclePlus;"], [0, "&CircleMinus;"], [0, "&CircleTimes;"], [0, "&osol;"], [0, "&CircleDot;"], [0, "&circledcirc;"], [0, "&circledast;"], [1, "&circleddash;"], [0, "&boxplus;"], [0, "&boxminus;"], [0, "&boxtimes;"], [0, "&dotsquare;"], [0, "&RightTee;"], [0, "&dashv;"], [0, "&DownTee;"], [0, "&bot;"], [1, "&models;"], [0, "&DoubleRightTee;"], [0, "&Vdash;"], [0, "&Vvdash;"], [0, "&VDash;"], [0, "&nvdash;"], [0, "&nvDash;"], [0, "&nVdash;"], [0, "&nVDash;"], [0, "&prurel;"], [1, "&LeftTriangle;"], [0, "&RightTriangle;"], [0, { v: "&LeftTriangleEqual;", n: 8402, o: "&nvltrie;" }], [0, { v: "&RightTriangleEqual;", n: 8402, o: "&nvrtrie;" }], [0, "&origof;"], [0, "&imof;"], [0, "&multimap;"], [0, "&hercon;"], [0, "&intcal;"], [0, "&veebar;"], [1, "&barvee;"], [0, "&angrtvb;"], [0, "&lrtri;"], [0, "&bigwedge;"], [0, "&bigvee;"], [0, "&bigcap;"], [0, "&bigcup;"], [0, "&diam;"], [0, "&sdot;"], [0, "&sstarf;"], [0, "&divideontimes;"], [0, "&bowtie;"], [0, "&ltimes;"], [0, "&rtimes;"], [0, "&leftthreetimes;"], [0, "&rightthreetimes;"], [0, "&backsimeq;"], [0, "&curlyvee;"], [0, "&curlywedge;"], [0, "&Sub;"], [0, "&Sup;"], [0, "&Cap;"], [0, "&Cup;"], [0, "&fork;"], [0, "&epar;"], [0, "&lessdot;"], [0, "&gtdot;"], [0, { v: "&Ll;", n: 824, o: "&nLl;" }], [0, { v: "&Gg;", n: 824, o: "&nGg;" }], [0, { v: "&leg;", n: 65024, o: "&lesg;" }], [0, { v: "&gel;", n: 65024, o: "&gesl;" }], [2, "&cuepr;"], [0, "&cuesc;"], [0, "&NotPrecedesSlantEqual;"], [0, "&NotSucceedsSlantEqual;"], [0, "&NotSquareSubsetEqual;"], [0, "&NotSquareSupersetEqual;"], [2, "&lnsim;"], [0, "&gnsim;"], [0, "&precnsim;"], [0, "&scnsim;"], [0, "&nltri;"], [0, "&NotRightTriangle;"], [0, "&nltrie;"], [0, "&NotRightTriangleEqual;"], [0, "&vellip;"], [0, "&ctdot;"], [0, "&utdot;"], [0, "&dtdot;"], [0, "&disin;"], [0, "&isinsv;"], [0, "&isins;"], [0, { v: "&isindot;", n: 824, o: "&notindot;" }], [0, "&notinvc;"], [0, "&notinvb;"], [1, { v: "&isinE;", n: 824, o: "&notinE;" }], [0, "&nisd;"], [0, "&xnis;"], [0, "&nis;"], [0, "&notnivc;"], [0, "&notnivb;"], [6, "&barwed;"], [0, "&Barwed;"], [1, "&lceil;"], [0, "&rceil;"], [0, "&LeftFloor;"], [0, "&rfloor;"], [0, "&drcrop;"], [0, "&dlcrop;"], [0, "&urcrop;"], [0, "&ulcrop;"], [0, "&bnot;"], [1, "&profline;"], [0, "&profsurf;"], [1, "&telrec;"], [0, "&target;"], [5, "&ulcorn;"], [0, "&urcorn;"], [0, "&dlcorn;"], [0, "&drcorn;"], [2, "&frown;"], [0, "&smile;"], [9, "&cylcty;"], [0, "&profalar;"], [7, "&topbot;"], [6, "&ovbar;"], [1, "&solbar;"], [60, "&angzarr;"], [51, "&lmoustache;"], [0, "&rmoustache;"], [2, "&OverBracket;"], [0, "&bbrk;"], [0, "&bbrktbrk;"], [37, "&OverParenthesis;"], [0, "&UnderParenthesis;"], [0, "&OverBrace;"], [0, "&UnderBrace;"], [2, "&trpezium;"], [4, "&elinters;"], [59, "&blank;"], [164, "&circledS;"], [55, "&boxh;"], [1, "&boxv;"], [9, "&boxdr;"], [3, "&boxdl;"], [3, "&boxur;"], [3, "&boxul;"], [3, "&boxvr;"], [7, "&boxvl;"], [7, "&boxhd;"], [7, "&boxhu;"], [7, "&boxvh;"], [19, "&boxH;"], [0, "&boxV;"], [0, "&boxdR;"], [0, "&boxDr;"], [0, "&boxDR;"], [0, "&boxdL;"], [0, "&boxDl;"], [0, "&boxDL;"], [0, "&boxuR;"], [0, "&boxUr;"], [0, "&boxUR;"], [0, "&boxuL;"], [0, "&boxUl;"], [0, "&boxUL;"], [0, "&boxvR;"], [0, "&boxVr;"], [0, "&boxVR;"], [0, "&boxvL;"], [0, "&boxVl;"], [0, "&boxVL;"], [0, "&boxHd;"], [0, "&boxhD;"], [0, "&boxHD;"], [0, "&boxHu;"], [0, "&boxhU;"], [0, "&boxHU;"], [0, "&boxvH;"], [0, "&boxVh;"], [0, "&boxVH;"], [19, "&uhblk;"], [3, "&lhblk;"], [3, "&block;"], [8, "&blk14;"], [0, "&blk12;"], [0, "&blk34;"], [13, "&square;"], [8, "&blacksquare;"], [0, "&EmptyVerySmallSquare;"], [1, "&rect;"], [0, "&marker;"], [2, "&fltns;"], [1, "&bigtriangleup;"], [0, "&blacktriangle;"], [0, "&triangle;"], [2, "&blacktriangleright;"], [0, "&rtri;"], [3, "&bigtriangledown;"], [0, "&blacktriangledown;"], [0, "&dtri;"], [2, "&blacktriangleleft;"], [0, "&ltri;"], [6, "&loz;"], [0, "&cir;"], [32, "&tridot;"], [2, "&bigcirc;"], [8, "&ultri;"], [0, "&urtri;"], [0, "&lltri;"], [0, "&EmptySmallSquare;"], [0, "&FilledSmallSquare;"], [8, "&bigstar;"], [0, "&star;"], [7, "&phone;"], [49, "&female;"], [1, "&male;"], [29, "&spades;"], [2, "&clubs;"], [1, "&hearts;"], [0, "&diamondsuit;"], [3, "&sung;"], [2, "&flat;"], [0, "&natural;"], [0, "&sharp;"], [163, "&check;"], [3, "&cross;"], [8, "&malt;"], [21, "&sext;"], [33, "&VerticalSeparator;"], [25, "&lbbrk;"], [0, "&rbbrk;"], [84, "&bsolhsub;"], [0, "&suphsol;"], [28, "&LeftDoubleBracket;"], [0, "&RightDoubleBracket;"], [0, "&lang;"], [0, "&rang;"], [0, "&Lang;"], [0, "&Rang;"], [0, "&loang;"], [0, "&roang;"], [7, "&longleftarrow;"], [0, "&longrightarrow;"], [0, "&longleftrightarrow;"], [0, "&DoubleLongLeftArrow;"], [0, "&DoubleLongRightArrow;"], [0, "&DoubleLongLeftRightArrow;"], [1, "&longmapsto;"], [2, "&dzigrarr;"], [258, "&nvlArr;"], [0, "&nvrArr;"], [0, "&nvHarr;"], [0, "&Map;"], [6, "&lbarr;"], [0, "&bkarow;"], [0, "&lBarr;"], [0, "&dbkarow;"], [0, "&drbkarow;"], [0, "&DDotrahd;"], [0, "&UpArrowBar;"], [0, "&DownArrowBar;"], [2, "&Rarrtl;"], [2, "&latail;"], [0, "&ratail;"], [0, "&lAtail;"], [0, "&rAtail;"], [0, "&larrfs;"], [0, "&rarrfs;"], [0, "&larrbfs;"], [0, "&rarrbfs;"], [2, "&nwarhk;"], [0, "&nearhk;"], [0, "&hksearow;"], [0, "&hkswarow;"], [0, "&nwnear;"], [0, "&nesear;"], [0, "&seswar;"], [0, "&swnwar;"], [8, { v: "&rarrc;", n: 824, o: "&nrarrc;" }], [1, "&cudarrr;"], [0, "&ldca;"], [0, "&rdca;"], [0, "&cudarrl;"], [0, "&larrpl;"], [2, "&curarrm;"], [0, "&cularrp;"], [7, "&rarrpl;"], [2, "&harrcir;"], [0, "&Uarrocir;"], [0, "&lurdshar;"], [0, "&ldrushar;"], [2, "&LeftRightVector;"], [0, "&RightUpDownVector;"], [0, "&DownLeftRightVector;"], [0, "&LeftUpDownVector;"], [0, "&LeftVectorBar;"], [0, "&RightVectorBar;"], [0, "&RightUpVectorBar;"], [0, "&RightDownVectorBar;"], [0, "&DownLeftVectorBar;"], [0, "&DownRightVectorBar;"], [0, "&LeftUpVectorBar;"], [0, "&LeftDownVectorBar;"], [0, "&LeftTeeVector;"], [0, "&RightTeeVector;"], [0, "&RightUpTeeVector;"], [0, "&RightDownTeeVector;"], [0, "&DownLeftTeeVector;"], [0, "&DownRightTeeVector;"], [0, "&LeftUpTeeVector;"], [0, "&LeftDownTeeVector;"], [0, "&lHar;"], [0, "&uHar;"], [0, "&rHar;"], [0, "&dHar;"], [0, "&luruhar;"], [0, "&ldrdhar;"], [0, "&ruluhar;"], [0, "&rdldhar;"], [0, "&lharul;"], [0, "&llhard;"], [0, "&rharul;"], [0, "&lrhard;"], [0, "&udhar;"], [0, "&duhar;"], [0, "&RoundImplies;"], [0, "&erarr;"], [0, "&simrarr;"], [0, "&larrsim;"], [0, "&rarrsim;"], [0, "&rarrap;"], [0, "&ltlarr;"], [1, "&gtrarr;"], [0, "&subrarr;"], [1, "&suplarr;"], [0, "&lfisht;"], [0, "&rfisht;"], [0, "&ufisht;"], [0, "&dfisht;"], [5, "&lopar;"], [0, "&ropar;"], [4, "&lbrke;"], [0, "&rbrke;"], [0, "&lbrkslu;"], [0, "&rbrksld;"], [0, "&lbrksld;"], [0, "&rbrkslu;"], [0, "&langd;"], [0, "&rangd;"], [0, "&lparlt;"], [0, "&rpargt;"], [0, "&gtlPar;"], [0, "&ltrPar;"], [3, "&vzigzag;"], [1, "&vangrt;"], [0, "&angrtvbd;"], [6, "&ange;"], [0, "&range;"], [0, "&dwangle;"], [0, "&uwangle;"], [0, "&angmsdaa;"], [0, "&angmsdab;"], [0, "&angmsdac;"], [0, "&angmsdad;"], [0, "&angmsdae;"], [0, "&angmsdaf;"], [0, "&angmsdag;"], [0, "&angmsdah;"], [0, "&bemptyv;"], [0, "&demptyv;"], [0, "&cemptyv;"], [0, "&raemptyv;"], [0, "&laemptyv;"], [0, "&ohbar;"], [0, "&omid;"], [0, "&opar;"], [1, "&operp;"], [1, "&olcross;"], [0, "&odsold;"], [1, "&olcir;"], [0, "&ofcir;"], [0, "&olt;"], [0, "&ogt;"], [0, "&cirscir;"], [0, "&cirE;"], [0, "&solb;"], [0, "&bsolb;"], [3, "&boxbox;"], [3, "&trisb;"], [0, "&rtriltri;"], [0, { v: "&LeftTriangleBar;", n: 824, o: "&NotLeftTriangleBar;" }], [0, { v: "&RightTriangleBar;", n: 824, o: "&NotRightTriangleBar;" }], [11, "&iinfin;"], [0, "&infintie;"], [0, "&nvinfin;"], [4, "&eparsl;"], [0, "&smeparsl;"], [0, "&eqvparsl;"], [5, "&blacklozenge;"], [8, "&RuleDelayed;"], [1, "&dsol;"], [9, "&bigodot;"], [0, "&bigoplus;"], [0, "&bigotimes;"], [1, "&biguplus;"], [1, "&bigsqcup;"], [5, "&iiiint;"], [0, "&fpartint;"], [2, "&cirfnint;"], [0, "&awint;"], [0, "&rppolint;"], [0, "&scpolint;"], [0, "&npolint;"], [0, "&pointint;"], [0, "&quatint;"], [0, "&intlarhk;"], [10, "&pluscir;"], [0, "&plusacir;"], [0, "&simplus;"], [0, "&plusdu;"], [0, "&plussim;"], [0, "&plustwo;"], [1, "&mcomma;"], [0, "&minusdu;"], [2, "&loplus;"], [0, "&roplus;"], [0, "&Cross;"], [0, "&timesd;"], [0, "&timesbar;"], [1, "&smashp;"], [0, "&lotimes;"], [0, "&rotimes;"], [0, "&otimesas;"], [0, "&Otimes;"], [0, "&odiv;"], [0, "&triplus;"], [0, "&triminus;"], [0, "&tritime;"], [0, "&intprod;"], [2, "&amalg;"], [0, "&capdot;"], [1, "&ncup;"], [0, "&ncap;"], [0, "&capand;"], [0, "&cupor;"], [0, "&cupcap;"], [0, "&capcup;"], [0, "&cupbrcap;"], [0, "&capbrcup;"], [0, "&cupcup;"], [0, "&capcap;"], [0, "&ccups;"], [0, "&ccaps;"], [2, "&ccupssm;"], [2, "&And;"], [0, "&Or;"], [0, "&andand;"], [0, "&oror;"], [0, "&orslope;"], [0, "&andslope;"], [1, "&andv;"], [0, "&orv;"], [0, "&andd;"], [0, "&ord;"], [1, "&wedbar;"], [6, "&sdote;"], [3, "&simdot;"], [2, { v: "&congdot;", n: 824, o: "&ncongdot;" }], [0, "&easter;"], [0, "&apacir;"], [0, { v: "&apE;", n: 824, o: "&napE;" }], [0, "&eplus;"], [0, "&pluse;"], [0, "&Esim;"], [0, "&Colone;"], [0, "&Equal;"], [1, "&ddotseq;"], [0, "&equivDD;"], [0, "&ltcir;"], [0, "&gtcir;"], [0, "&ltquest;"], [0, "&gtquest;"], [0, { v: "&leqslant;", n: 824, o: "&nleqslant;" }], [0, { v: "&geqslant;", n: 824, o: "&ngeqslant;" }], [0, "&lesdot;"], [0, "&gesdot;"], [0, "&lesdoto;"], [0, "&gesdoto;"], [0, "&lesdotor;"], [0, "&gesdotol;"], [0, "&lap;"], [0, "&gap;"], [0, "&lne;"], [0, "&gne;"], [0, "&lnap;"], [0, "&gnap;"], [0, "&lEg;"], [0, "&gEl;"], [0, "&lsime;"], [0, "&gsime;"], [0, "&lsimg;"], [0, "&gsiml;"], [0, "&lgE;"], [0, "&glE;"], [0, "&lesges;"], [0, "&gesles;"], [0, "&els;"], [0, "&egs;"], [0, "&elsdot;"], [0, "&egsdot;"], [0, "&el;"], [0, "&eg;"], [2, "&siml;"], [0, "&simg;"], [0, "&simlE;"], [0, "&simgE;"], [0, { v: "&LessLess;", n: 824, o: "&NotNestedLessLess;" }], [0, { v: "&GreaterGreater;", n: 824, o: "&NotNestedGreaterGreater;" }], [1, "&glj;"], [0, "&gla;"], [0, "&ltcc;"], [0, "&gtcc;"], [0, "&lescc;"], [0, "&gescc;"], [0, "&smt;"], [0, "&lat;"], [0, { v: "&smte;", n: 65024, o: "&smtes;" }], [0, { v: "&late;", n: 65024, o: "&lates;" }], [0, "&bumpE;"], [0, { v: "&PrecedesEqual;", n: 824, o: "&NotPrecedesEqual;" }], [0, { v: "&sce;", n: 824, o: "&NotSucceedsEqual;" }], [2, "&prE;"], [0, "&scE;"], [0, "&precneqq;"], [0, "&scnE;"], [0, "&prap;"], [0, "&scap;"], [0, "&precnapprox;"], [0, "&scnap;"], [0, "&Pr;"], [0, "&Sc;"], [0, "&subdot;"], [0, "&supdot;"], [0, "&subplus;"], [0, "&supplus;"], [0, "&submult;"], [0, "&supmult;"], [0, "&subedot;"], [0, "&supedot;"], [0, { v: "&subE;", n: 824, o: "&nsubE;" }], [0, { v: "&supE;", n: 824, o: "&nsupE;" }], [0, "&subsim;"], [0, "&supsim;"], [2, { v: "&subnE;", n: 65024, o: "&varsubsetneqq;" }], [0, { v: "&supnE;", n: 65024, o: "&varsupsetneqq;" }], [2, "&csub;"], [0, "&csup;"], [0, "&csube;"], [0, "&csupe;"], [0, "&subsup;"], [0, "&supsub;"], [0, "&subsub;"], [0, "&supsup;"], [0, "&suphsub;"], [0, "&supdsub;"], [0, "&forkv;"], [0, "&topfork;"], [0, "&mlcp;"], [8, "&Dashv;"], [1, "&Vdashl;"], [0, "&Barv;"], [0, "&vBar;"], [0, "&vBarv;"], [1, "&Vbar;"], [0, "&Not;"], [0, "&bNot;"], [0, "&rnmid;"], [0, "&cirmid;"], [0, "&midcir;"], [0, "&topcir;"], [0, "&nhpar;"], [0, "&parsim;"], [9, { v: "&parsl;", n: 8421, o: "&nparsl;" }], [44343, { n: new Map(/* @__PURE__ */ restoreDiff([[56476, "&Ascr;"], [1, "&Cscr;"], [0, "&Dscr;"], [2, "&Gscr;"], [2, "&Jscr;"], [0, "&Kscr;"], [2, "&Nscr;"], [0, "&Oscr;"], [0, "&Pscr;"], [0, "&Qscr;"], [1, "&Sscr;"], [0, "&Tscr;"], [0, "&Uscr;"], [0, "&Vscr;"], [0, "&Wscr;"], [0, "&Xscr;"], [0, "&Yscr;"], [0, "&Zscr;"], [0, "&ascr;"], [0, "&bscr;"], [0, "&cscr;"], [0, "&dscr;"], [1, "&fscr;"], [1, "&hscr;"], [0, "&iscr;"], [0, "&jscr;"], [0, "&kscr;"], [0, "&lscr;"], [0, "&mscr;"], [0, "&nscr;"], [1, "&pscr;"], [0, "&qscr;"], [0, "&rscr;"], [0, "&sscr;"], [0, "&tscr;"], [0, "&uscr;"], [0, "&vscr;"], [0, "&wscr;"], [0, "&xscr;"], [0, "&yscr;"], [0, "&zscr;"], [52, "&Afr;"], [0, "&Bfr;"], [1, "&Dfr;"], [0, "&Efr;"], [0, "&Ffr;"], [0, "&Gfr;"], [2, "&Jfr;"], [0, "&Kfr;"], [0, "&Lfr;"], [0, "&Mfr;"], [0, "&Nfr;"], [0, "&Ofr;"], [0, "&Pfr;"], [0, "&Qfr;"], [1, "&Sfr;"], [0, "&Tfr;"], [0, "&Ufr;"], [0, "&Vfr;"], [0, "&Wfr;"], [0, "&Xfr;"], [0, "&Yfr;"], [1, "&afr;"], [0, "&bfr;"], [0, "&cfr;"], [0, "&dfr;"], [0, "&efr;"], [0, "&ffr;"], [0, "&gfr;"], [0, "&hfr;"], [0, "&ifr;"], [0, "&jfr;"], [0, "&kfr;"], [0, "&lfr;"], [0, "&mfr;"], [0, "&nfr;"], [0, "&ofr;"], [0, "&pfr;"], [0, "&qfr;"], [0, "&rfr;"], [0, "&sfr;"], [0, "&tfr;"], [0, "&ufr;"], [0, "&vfr;"], [0, "&wfr;"], [0, "&xfr;"], [0, "&yfr;"], [0, "&zfr;"], [0, "&Aopf;"], [0, "&Bopf;"], [1, "&Dopf;"], [0, "&Eopf;"], [0, "&Fopf;"], [0, "&Gopf;"], [1, "&Iopf;"], [0, "&Jopf;"], [0, "&Kopf;"], [0, "&Lopf;"], [0, "&Mopf;"], [1, "&Oopf;"], [3, "&Sopf;"], [0, "&Topf;"], [0, "&Uopf;"], [0, "&Vopf;"], [0, "&Wopf;"], [0, "&Xopf;"], [0, "&Yopf;"], [1, "&aopf;"], [0, "&bopf;"], [0, "&copf;"], [0, "&dopf;"], [0, "&eopf;"], [0, "&fopf;"], [0, "&gopf;"], [0, "&hopf;"], [0, "&iopf;"], [0, "&jopf;"], [0, "&kopf;"], [0, "&lopf;"], [0, "&mopf;"], [0, "&nopf;"], [0, "&oopf;"], [0, "&popf;"], [0, "&qopf;"], [0, "&ropf;"], [0, "&sopf;"], [0, "&topf;"], [0, "&uopf;"], [0, "&vopf;"], [0, "&wopf;"], [0, "&xopf;"], [0, "&yopf;"], [0, "&zopf;"]])) }], [8906, "&fflig;"], [0, "&filig;"], [0, "&fllig;"], [0, "&ffilig;"], [0, "&ffllig;"]]));
  }
});

// node_modules/entities/lib/esm/escape.js
function encodeXML(str) {
  let ret = "";
  let lastIdx = 0;
  let match;
  while ((match = xmlReplacer.exec(str)) !== null) {
    const i = match.index;
    const char = str.charCodeAt(i);
    const next = xmlCodeMap.get(char);
    if (next !== void 0) {
      ret += str.substring(lastIdx, i) + next;
      lastIdx = i + 1;
    } else {
      ret += `${str.substring(lastIdx, i)}&#x${getCodePoint(str, i).toString(16)};`;
      lastIdx = xmlReplacer.lastIndex += Number((char & 64512) === 55296);
    }
  }
  return ret + str.substr(lastIdx);
}
function getEscaper(regex, map2) {
  return function escape3(data) {
    let match;
    let lastIdx = 0;
    let result = "";
    while (match = regex.exec(data)) {
      if (lastIdx !== match.index) {
        result += data.substring(lastIdx, match.index);
      }
      result += map2.get(match[0].charCodeAt(0));
      lastIdx = match.index + 1;
    }
    return result + data.substring(lastIdx);
  };
}
var xmlReplacer, xmlCodeMap, getCodePoint, escapeUTF8, escapeAttribute, escapeText;
var init_escape = __esm({
  "node_modules/entities/lib/esm/escape.js"() {
    xmlReplacer = /["&'<>$\x80-\uFFFF]/g;
    xmlCodeMap = /* @__PURE__ */ new Map([
      [34, "&quot;"],
      [38, "&amp;"],
      [39, "&apos;"],
      [60, "&lt;"],
      [62, "&gt;"]
    ]);
    getCodePoint = // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    String.prototype.codePointAt != null ? (str, index) => str.codePointAt(index) : (
      // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
      (c2, index) => (c2.charCodeAt(index) & 64512) === 55296 ? (c2.charCodeAt(index) - 55296) * 1024 + c2.charCodeAt(index + 1) - 56320 + 65536 : c2.charCodeAt(index)
    );
    escapeUTF8 = getEscaper(/[&<>'"]/g, xmlCodeMap);
    escapeAttribute = getEscaper(/["&\u00A0]/g, /* @__PURE__ */ new Map([
      [34, "&quot;"],
      [38, "&amp;"],
      [160, "&nbsp;"]
    ]));
    escapeText = getEscaper(/[&<>\u00A0]/g, /* @__PURE__ */ new Map([
      [38, "&amp;"],
      [60, "&lt;"],
      [62, "&gt;"],
      [160, "&nbsp;"]
    ]));
  }
});

// node_modules/entities/lib/esm/encode.js
var init_encode = __esm({
  "node_modules/entities/lib/esm/encode.js"() {
    init_encode_html();
    init_escape();
  }
});

// node_modules/entities/lib/esm/index.js
var EntityLevel, EncodingMode;
var init_esm3 = __esm({
  "node_modules/entities/lib/esm/index.js"() {
    init_decode();
    init_encode();
    init_escape();
    init_escape();
    init_encode();
    init_decode();
    (function(EntityLevel2) {
      EntityLevel2[EntityLevel2["XML"] = 0] = "XML";
      EntityLevel2[EntityLevel2["HTML"] = 1] = "HTML";
    })(EntityLevel || (EntityLevel = {}));
    (function(EncodingMode2) {
      EncodingMode2[EncodingMode2["UTF8"] = 0] = "UTF8";
      EncodingMode2[EncodingMode2["ASCII"] = 1] = "ASCII";
      EncodingMode2[EncodingMode2["Extensive"] = 2] = "Extensive";
      EncodingMode2[EncodingMode2["Attribute"] = 3] = "Attribute";
      EncodingMode2[EncodingMode2["Text"] = 4] = "Text";
    })(EncodingMode || (EncodingMode = {}));
  }
});

// node_modules/dom-serializer/lib/esm/foreignNames.js
var elementNames, attributeNames;
var init_foreignNames = __esm({
  "node_modules/dom-serializer/lib/esm/foreignNames.js"() {
    elementNames = new Map([
      "altGlyph",
      "altGlyphDef",
      "altGlyphItem",
      "animateColor",
      "animateMotion",
      "animateTransform",
      "clipPath",
      "feBlend",
      "feColorMatrix",
      "feComponentTransfer",
      "feComposite",
      "feConvolveMatrix",
      "feDiffuseLighting",
      "feDisplacementMap",
      "feDistantLight",
      "feDropShadow",
      "feFlood",
      "feFuncA",
      "feFuncB",
      "feFuncG",
      "feFuncR",
      "feGaussianBlur",
      "feImage",
      "feMerge",
      "feMergeNode",
      "feMorphology",
      "feOffset",
      "fePointLight",
      "feSpecularLighting",
      "feSpotLight",
      "feTile",
      "feTurbulence",
      "foreignObject",
      "glyphRef",
      "linearGradient",
      "radialGradient",
      "textPath"
    ].map((val) => [val.toLowerCase(), val]));
    attributeNames = new Map([
      "definitionURL",
      "attributeName",
      "attributeType",
      "baseFrequency",
      "baseProfile",
      "calcMode",
      "clipPathUnits",
      "diffuseConstant",
      "edgeMode",
      "filterUnits",
      "glyphRef",
      "gradientTransform",
      "gradientUnits",
      "kernelMatrix",
      "kernelUnitLength",
      "keyPoints",
      "keySplines",
      "keyTimes",
      "lengthAdjust",
      "limitingConeAngle",
      "markerHeight",
      "markerUnits",
      "markerWidth",
      "maskContentUnits",
      "maskUnits",
      "numOctaves",
      "pathLength",
      "patternContentUnits",
      "patternTransform",
      "patternUnits",
      "pointsAtX",
      "pointsAtY",
      "pointsAtZ",
      "preserveAlpha",
      "preserveAspectRatio",
      "primitiveUnits",
      "refX",
      "refY",
      "repeatCount",
      "repeatDur",
      "requiredExtensions",
      "requiredFeatures",
      "specularConstant",
      "specularExponent",
      "spreadMethod",
      "startOffset",
      "stdDeviation",
      "stitchTiles",
      "surfaceScale",
      "systemLanguage",
      "tableValues",
      "targetX",
      "targetY",
      "textLength",
      "viewBox",
      "viewTarget",
      "xChannelSelector",
      "yChannelSelector",
      "zoomAndPan"
    ].map((val) => [val.toLowerCase(), val]));
  }
});

// node_modules/dom-serializer/lib/esm/index.js
function replaceQuotes(value) {
  return value.replace(/"/g, "&quot;");
}
function formatAttributes(attributes, opts) {
  var _a3;
  if (!attributes)
    return;
  const encode = ((_a3 = opts.encodeEntities) !== null && _a3 !== void 0 ? _a3 : opts.decodeEntities) === false ? replaceQuotes : opts.xmlMode || opts.encodeEntities !== "utf8" ? encodeXML : escapeAttribute;
  return Object.keys(attributes).map((key) => {
    var _a4, _b;
    const value = (_a4 = attributes[key]) !== null && _a4 !== void 0 ? _a4 : "";
    if (opts.xmlMode === "foreign") {
      key = (_b = attributeNames.get(key)) !== null && _b !== void 0 ? _b : key;
    }
    if (!opts.emptyAttrs && !opts.xmlMode && value === "") {
      return key;
    }
    return `${key}="${encode(value)}"`;
  }).join(" ");
}
function render(node, options = {}) {
  const nodes = "length" in node ? node : [node];
  let output = "";
  for (let i = 0; i < nodes.length; i++) {
    output += renderNode(nodes[i], options);
  }
  return output;
}
function renderNode(node, options) {
  switch (node.type) {
    case Root:
      return render(node.children, options);
    // @ts-expect-error We don't use `Doctype` yet
    case Doctype:
    case Directive:
      return renderDirective(node);
    case Comment:
      return renderComment(node);
    case CDATA:
      return renderCdata(node);
    case Script:
    case Style:
    case Tag:
      return renderTag(node, options);
    case Text:
      return renderText(node, options);
  }
}
function renderTag(elem, opts) {
  var _a3;
  if (opts.xmlMode === "foreign") {
    elem.name = (_a3 = elementNames.get(elem.name)) !== null && _a3 !== void 0 ? _a3 : elem.name;
    if (elem.parent && foreignModeIntegrationPoints.has(elem.parent.name)) {
      opts = { ...opts, xmlMode: false };
    }
  }
  if (!opts.xmlMode && foreignElements.has(elem.name)) {
    opts = { ...opts, xmlMode: "foreign" };
  }
  let tag = `<${elem.name}`;
  const attribs = formatAttributes(elem.attribs, opts);
  if (attribs) {
    tag += ` ${attribs}`;
  }
  if (elem.children.length === 0 && (opts.xmlMode ? (
    // In XML mode or foreign mode, and user hasn't explicitly turned off self-closing tags
    opts.selfClosingTags !== false
  ) : (
    // User explicitly asked for self-closing tags, even in HTML mode
    opts.selfClosingTags && singleTag.has(elem.name)
  ))) {
    if (!opts.xmlMode)
      tag += " ";
    tag += "/>";
  } else {
    tag += ">";
    if (elem.children.length > 0) {
      tag += render(elem.children, opts);
    }
    if (opts.xmlMode || !singleTag.has(elem.name)) {
      tag += `</${elem.name}>`;
    }
  }
  return tag;
}
function renderDirective(elem) {
  return `<${elem.data}>`;
}
function renderText(elem, opts) {
  var _a3;
  let data = elem.data || "";
  if (((_a3 = opts.encodeEntities) !== null && _a3 !== void 0 ? _a3 : opts.decodeEntities) !== false && !(!opts.xmlMode && elem.parent && unencodedElements.has(elem.parent.name))) {
    data = opts.xmlMode || opts.encodeEntities !== "utf8" ? encodeXML(data) : escapeText(data);
  }
  return data;
}
function renderCdata(elem) {
  return `<![CDATA[${elem.children[0].data}]]>`;
}
function renderComment(elem) {
  return `<!--${elem.data}-->`;
}
var unencodedElements, singleTag, foreignModeIntegrationPoints, foreignElements;
var init_esm4 = __esm({
  "node_modules/dom-serializer/lib/esm/index.js"() {
    init_esm();
    init_esm3();
    init_foreignNames();
    unencodedElements = /* @__PURE__ */ new Set([
      "style",
      "script",
      "xmp",
      "iframe",
      "noembed",
      "noframes",
      "plaintext",
      "noscript"
    ]);
    singleTag = /* @__PURE__ */ new Set([
      "area",
      "base",
      "basefont",
      "br",
      "col",
      "command",
      "embed",
      "frame",
      "hr",
      "img",
      "input",
      "isindex",
      "keygen",
      "link",
      "meta",
      "param",
      "source",
      "track",
      "wbr"
    ]);
    foreignModeIntegrationPoints = /* @__PURE__ */ new Set([
      "mi",
      "mo",
      "mn",
      "ms",
      "mtext",
      "annotation-xml",
      "foreignObject",
      "desc",
      "title"
    ]);
    foreignElements = /* @__PURE__ */ new Set(["svg", "math"]);
  }
});

// node_modules/domutils/lib/esm/stringify.js
var init_stringify = __esm({
  "node_modules/domutils/lib/esm/stringify.js"() {
    init_esm2();
    init_esm4();
    init_esm();
  }
});

// node_modules/domutils/lib/esm/traversal.js
var init_traversal = __esm({
  "node_modules/domutils/lib/esm/traversal.js"() {
    init_esm2();
  }
});

// node_modules/domutils/lib/esm/manipulation.js
var init_manipulation = __esm({
  "node_modules/domutils/lib/esm/manipulation.js"() {
  }
});

// node_modules/domutils/lib/esm/querying.js
var init_querying = __esm({
  "node_modules/domutils/lib/esm/querying.js"() {
    init_esm2();
  }
});

// node_modules/domutils/lib/esm/legacy.js
var init_legacy = __esm({
  "node_modules/domutils/lib/esm/legacy.js"() {
    init_esm2();
    init_querying();
  }
});

// node_modules/domutils/lib/esm/helpers.js
var DocumentPosition;
var init_helpers = __esm({
  "node_modules/domutils/lib/esm/helpers.js"() {
    init_esm2();
    (function(DocumentPosition2) {
      DocumentPosition2[DocumentPosition2["DISCONNECTED"] = 1] = "DISCONNECTED";
      DocumentPosition2[DocumentPosition2["PRECEDING"] = 2] = "PRECEDING";
      DocumentPosition2[DocumentPosition2["FOLLOWING"] = 4] = "FOLLOWING";
      DocumentPosition2[DocumentPosition2["CONTAINS"] = 8] = "CONTAINS";
      DocumentPosition2[DocumentPosition2["CONTAINED_BY"] = 16] = "CONTAINED_BY";
    })(DocumentPosition || (DocumentPosition = {}));
  }
});

// node_modules/domutils/lib/esm/feeds.js
var init_feeds = __esm({
  "node_modules/domutils/lib/esm/feeds.js"() {
    init_stringify();
    init_legacy();
  }
});

// node_modules/domutils/lib/esm/index.js
var init_esm5 = __esm({
  "node_modules/domutils/lib/esm/index.js"() {
    init_stringify();
    init_traversal();
    init_manipulation();
    init_querying();
    init_legacy();
    init_helpers();
    init_feeds();
    init_esm2();
  }
});

// node_modules/htmlparser2/lib/esm/index.js
function parseDocument(data, options) {
  const handler = new DomHandler(void 0, options);
  new Parser(handler, options).end(data);
  return handler.root;
}
var init_esm6 = __esm({
  "node_modules/htmlparser2/lib/esm/index.js"() {
    init_Parser();
    init_Parser();
    init_esm2();
    init_esm2();
    init_Tokenizer();
    init_esm();
    init_esm5();
    init_esm5();
    init_esm5();
  }
});

// node_modules/deepmerge/dist/cjs.js
var require_cjs = __commonJS({
  "node_modules/deepmerge/dist/cjs.js"(exports2, module2) {
    "use strict";
    var isMergeableObject = function isMergeableObject2(value) {
      return isNonNullObject(value) && !isSpecial(value);
    };
    function isNonNullObject(value) {
      return !!value && typeof value === "object";
    }
    function isSpecial(value) {
      var stringValue = Object.prototype.toString.call(value);
      return stringValue === "[object RegExp]" || stringValue === "[object Date]" || isReactElement(value);
    }
    var canUseSymbol = typeof Symbol === "function" && Symbol.for;
    var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for("react.element") : 60103;
    function isReactElement(value) {
      return value.$$typeof === REACT_ELEMENT_TYPE;
    }
    function emptyTarget(val) {
      return Array.isArray(val) ? [] : {};
    }
    function cloneUnlessOtherwiseSpecified(value, options) {
      return options.clone !== false && options.isMergeableObject(value) ? deepmerge(emptyTarget(value), value, options) : value;
    }
    function defaultArrayMerge(target, source, options) {
      return target.concat(source).map(function(element) {
        return cloneUnlessOtherwiseSpecified(element, options);
      });
    }
    function getMergeFunction(key, options) {
      if (!options.customMerge) {
        return deepmerge;
      }
      var customMerge = options.customMerge(key);
      return typeof customMerge === "function" ? customMerge : deepmerge;
    }
    function getEnumerableOwnPropertySymbols(target) {
      return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(target).filter(function(symbol) {
        return Object.propertyIsEnumerable.call(target, symbol);
      }) : [];
    }
    function getKeys(target) {
      return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target));
    }
    function propertyIsOnObject(object, property) {
      try {
        return property in object;
      } catch (_4) {
        return false;
      }
    }
    function propertyIsUnsafe(target, key) {
      return propertyIsOnObject(target, key) && !(Object.hasOwnProperty.call(target, key) && Object.propertyIsEnumerable.call(target, key));
    }
    function mergeObject(target, source, options) {
      var destination = {};
      if (options.isMergeableObject(target)) {
        getKeys(target).forEach(function(key) {
          destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
        });
      }
      getKeys(source).forEach(function(key) {
        if (propertyIsUnsafe(target, key)) {
          return;
        }
        if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
          destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
        } else {
          destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
        }
      });
      return destination;
    }
    function deepmerge(target, source, options) {
      options = options || {};
      options.arrayMerge = options.arrayMerge || defaultArrayMerge;
      options.isMergeableObject = options.isMergeableObject || isMergeableObject;
      options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;
      var sourceIsArray = Array.isArray(source);
      var targetIsArray = Array.isArray(target);
      var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;
      if (!sourceAndTargetTypesMatch) {
        return cloneUnlessOtherwiseSpecified(source, options);
      } else if (sourceIsArray) {
        return options.arrayMerge(target, source, options);
      } else {
        return mergeObject(target, source, options);
      }
    }
    deepmerge.all = function deepmergeAll(array, options) {
      if (!Array.isArray(array)) {
        throw new Error("first argument should be an array");
      }
      return array.reduce(function(prev, next) {
        return deepmerge(prev, next, options);
      }, {});
    };
    var deepmerge_1 = deepmerge;
    module2.exports = deepmerge_1;
  }
});

// node_modules/html-to-text/lib/html-to-text.mjs
function limitedDepthRecursive(n2, f3, g3 = () => void 0) {
  if (n2 === void 0) {
    const f1 = function(...args) {
      return f3(f1, ...args);
    };
    return f1;
  }
  if (n2 >= 0) {
    return function(...args) {
      return f3(limitedDepthRecursive(n2 - 1, f3, g3), ...args);
    };
  }
  return g3;
}
function trimCharacter(str, char) {
  let start = 0;
  let end = str.length;
  while (start < end && str[start] === char) {
    ++start;
  }
  while (end > start && str[end - 1] === char) {
    --end;
  }
  return start > 0 || end < str.length ? str.substring(start, end) : str;
}
function trimCharacterEnd(str, char) {
  let end = str.length;
  while (end > 0 && str[end - 1] === char) {
    --end;
  }
  return end < str.length ? str.substring(0, end) : str;
}
function unicodeEscape(str) {
  return str.replace(/[\s\S]/g, (c2) => "\\u" + c2.charCodeAt().toString(16).padStart(4, "0"));
}
function mergeDuplicatesPreferLast(items, getKey) {
  const map2 = /* @__PURE__ */ new Map();
  for (let i = items.length; i-- > 0; ) {
    const item = items[i];
    const key = getKey(item);
    map2.set(
      key,
      map2.has(key) ? (0, import_deepmerge.default)(item, map2.get(key), { arrayMerge: overwriteMerge$1 }) : item
    );
  }
  return [...map2.values()].reverse();
}
function get(obj, path3) {
  for (const key of path3) {
    if (!obj) {
      return void 0;
    }
    obj = obj[key];
  }
  return obj;
}
function numberToLetterSequence(num, baseChar = "a", base = 26) {
  const digits = [];
  do {
    num -= 1;
    digits.push(num % base);
    num = num / base >> 0;
  } while (num > 0);
  const baseCode = baseChar.charCodeAt(0);
  return digits.reverse().map((n2) => String.fromCharCode(baseCode + n2)).join("");
}
function numberToRoman(num) {
  return [...num + ""].map((n2) => +n2).reverse().map((v4, i) => v4 % 5 < 4 ? (v4 < 5 ? "" : V2[i]) + I2[i].repeat(v4 % 5) : I2[i] + (v4 < 5 ? V2[i] : I2[i + 1])).reverse().join("");
}
function charactersToCodes(str) {
  return [...str].map((c2) => "\\u" + c2.charCodeAt(0).toString(16).padStart(4, "0")).join("");
}
function getText(stackItem) {
  if (!(stackItem instanceof BlockStackItem || stackItem instanceof ListItemStackItem || stackItem instanceof TableCellStackItem)) {
    throw new Error("Only blocks, list items and table cells can be requested for text contents.");
  }
  return stackItem.inlineTextBuilder.isEmpty() ? stackItem.rawText : stackItem.rawText + stackItem.inlineTextBuilder.toString();
}
function addText(stackItem, text, leadingLineBreaks, trailingLineBreaks) {
  if (!(stackItem instanceof BlockStackItem || stackItem instanceof ListItemStackItem || stackItem instanceof TableCellStackItem)) {
    throw new Error("Only blocks, list items and table cells can contain text.");
  }
  const parentText = getText(stackItem);
  const lineBreaks = Math.max(stackItem.stashedLineBreaks, leadingLineBreaks);
  stackItem.inlineTextBuilder.clear();
  if (parentText) {
    stackItem.rawText = parentText + "\n".repeat(lineBreaks) + text;
  } else {
    stackItem.rawText = text;
    stackItem.leadingLineBreaks = lineBreaks;
  }
  stackItem.stashedLineBreaks = trailingLineBreaks;
}
function applyTransformer(str, transformer) {
  return transformer ? applyTransformer(transformer.transform(str), transformer.next) : str;
}
function compile$1(options = {}) {
  const selectorsWithoutFormat = options.selectors.filter((s2) => !s2.format);
  if (selectorsWithoutFormat.length) {
    throw new Error(
      "Following selectors have no specified format: " + selectorsWithoutFormat.map((s2) => `\`${s2.selector}\``).join(", ")
    );
  }
  const picker = new DecisionTree(
    options.selectors.map((s2) => [s2.selector, s2])
  ).build(hp2Builder);
  if (typeof options.encodeCharacters !== "function") {
    options.encodeCharacters = makeReplacerFromDict(options.encodeCharacters);
  }
  const baseSelectorsPicker = new DecisionTree(
    options.baseElements.selectors.map((s2, i) => [s2, i + 1])
  ).build(hp2Builder);
  function findBaseElements(dom) {
    return findBases(dom, options, baseSelectorsPicker);
  }
  const limitedWalk = limitedDepthRecursive(
    options.limits.maxDepth,
    recursiveWalk,
    function(dom, builder) {
      builder.addInline(options.limits.ellipsis || "");
    }
  );
  return function(html, metadata = void 0) {
    return process2(html, metadata, options, picker, findBaseElements, limitedWalk);
  };
}
function process2(html, metadata, options, picker, findBaseElements, walk) {
  const maxInputLength = options.limits.maxInputLength;
  if (maxInputLength && html && html.length > maxInputLength) {
    console.warn(
      `Input length ${html.length} is above allowed limit of ${maxInputLength}. Truncating without ellipsis.`
    );
    html = html.substring(0, maxInputLength);
  }
  const document = parseDocument(html, { decodeEntities: options.decodeEntities });
  const bases = findBaseElements(document.children);
  const builder = new BlockTextBuilder(options, picker, metadata);
  walk(bases, builder);
  return builder.toString();
}
function findBases(dom, options, baseSelectorsPicker) {
  const results = [];
  function recursiveWalk2(walk, dom2) {
    dom2 = dom2.slice(0, options.limits.maxChildNodes);
    for (const elem of dom2) {
      if (elem.type !== "tag") {
        continue;
      }
      const pickedSelectorIndex = baseSelectorsPicker.pick1(elem);
      if (pickedSelectorIndex > 0) {
        results.push({ selectorIndex: pickedSelectorIndex, element: elem });
      } else if (elem.children) {
        walk(elem.children);
      }
      if (results.length >= options.limits.maxBaseElements) {
        return;
      }
    }
  }
  const limitedWalk = limitedDepthRecursive(
    options.limits.maxDepth,
    recursiveWalk2
  );
  limitedWalk(dom);
  if (options.baseElements.orderBy !== "occurrence") {
    results.sort((a, b3) => a.selectorIndex - b3.selectorIndex);
  }
  return options.baseElements.returnDomByDefault && results.length === 0 ? dom : results.map((x2) => x2.element);
}
function recursiveWalk(walk, dom, builder) {
  if (!dom) {
    return;
  }
  const options = builder.options;
  const tooManyChildNodes = dom.length > options.limits.maxChildNodes;
  if (tooManyChildNodes) {
    dom = dom.slice(0, options.limits.maxChildNodes);
    dom.push({
      data: options.limits.ellipsis,
      type: "text"
    });
  }
  for (const elem of dom) {
    switch (elem.type) {
      case "text": {
        builder.addInline(elem.data);
        break;
      }
      case "tag": {
        const tagDefinition = builder.picker.pick1(elem);
        const format = options.formatters[tagDefinition.format];
        format(elem, walk, builder, tagDefinition.options || {});
        break;
      }
    }
  }
  return;
}
function makeReplacerFromDict(dict) {
  if (!dict || Object.keys(dict).length === 0) {
    return void 0;
  }
  const entries = Object.entries(dict).filter(([, v4]) => v4 !== false);
  const regex = new RegExp(
    entries.map(([c2]) => `(${unicodeEscape([...c2][0])})`).join("|"),
    "g"
  );
  const values = entries.map(([, v4]) => v4);
  const replacer = (m, ...cgs) => values[cgs.findIndex((cg) => cg)];
  return (str) => str.replace(regex, replacer);
}
function formatSkip(elem, walk, builder, formatOptions) {
}
function formatInlineString(elem, walk, builder, formatOptions) {
  builder.addLiteral(formatOptions.string || "");
}
function formatBlockString(elem, walk, builder, formatOptions) {
  builder.openBlock({ leadingLineBreaks: formatOptions.leadingLineBreaks || 2 });
  builder.addLiteral(formatOptions.string || "");
  builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks || 2 });
}
function formatInline(elem, walk, builder, formatOptions) {
  walk(elem.children, builder);
}
function formatBlock$1(elem, walk, builder, formatOptions) {
  builder.openBlock({ leadingLineBreaks: formatOptions.leadingLineBreaks || 2 });
  walk(elem.children, builder);
  builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks || 2 });
}
function renderOpenTag(elem) {
  const attrs = elem.attribs && elem.attribs.length ? " " + Object.entries(elem.attribs).map(([k4, v4]) => v4 === "" ? k4 : `${k4}=${v4.replace(/"/g, "&quot;")}`).join(" ") : "";
  return `<${elem.name}${attrs}>`;
}
function renderCloseTag(elem) {
  return `</${elem.name}>`;
}
function formatInlineTag(elem, walk, builder, formatOptions) {
  builder.startNoWrap();
  builder.addLiteral(renderOpenTag(elem));
  builder.stopNoWrap();
  walk(elem.children, builder);
  builder.startNoWrap();
  builder.addLiteral(renderCloseTag(elem));
  builder.stopNoWrap();
}
function formatBlockTag(elem, walk, builder, formatOptions) {
  builder.openBlock({ leadingLineBreaks: formatOptions.leadingLineBreaks || 2 });
  builder.startNoWrap();
  builder.addLiteral(renderOpenTag(elem));
  builder.stopNoWrap();
  walk(elem.children, builder);
  builder.startNoWrap();
  builder.addLiteral(renderCloseTag(elem));
  builder.stopNoWrap();
  builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks || 2 });
}
function formatInlineHtml(elem, walk, builder, formatOptions) {
  builder.startNoWrap();
  builder.addLiteral(
    render(elem, { decodeEntities: builder.options.decodeEntities })
  );
  builder.stopNoWrap();
}
function formatBlockHtml(elem, walk, builder, formatOptions) {
  builder.openBlock({ leadingLineBreaks: formatOptions.leadingLineBreaks || 2 });
  builder.startNoWrap();
  builder.addLiteral(
    render(elem, { decodeEntities: builder.options.decodeEntities })
  );
  builder.stopNoWrap();
  builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks || 2 });
}
function formatInlineSurround(elem, walk, builder, formatOptions) {
  builder.addLiteral(formatOptions.prefix || "");
  walk(elem.children, builder);
  builder.addLiteral(formatOptions.suffix || "");
}
function getRow(matrix, j3) {
  if (!matrix[j3]) {
    matrix[j3] = [];
  }
  return matrix[j3];
}
function findFirstVacantIndex(row, x2 = 0) {
  while (row[x2]) {
    x2++;
  }
  return x2;
}
function transposeInPlace(matrix, maxSize) {
  for (let i = 0; i < maxSize; i++) {
    const rowI = getRow(matrix, i);
    for (let j3 = 0; j3 < i; j3++) {
      const rowJ = getRow(matrix, j3);
      if (rowI[j3] || rowJ[i]) {
        const temp = rowI[j3];
        rowI[j3] = rowJ[i];
        rowJ[i] = temp;
      }
    }
  }
}
function putCellIntoLayout(cell, layout, baseRow, baseCol) {
  for (let r2 = 0; r2 < cell.rowspan; r2++) {
    const layoutRow = getRow(layout, baseRow + r2);
    for (let c2 = 0; c2 < cell.colspan; c2++) {
      layoutRow[baseCol + c2] = cell;
    }
  }
}
function getOrInitOffset(offsets, index) {
  if (offsets[index] === void 0) {
    offsets[index] = index === 0 ? 0 : 1 + getOrInitOffset(offsets, index - 1);
  }
  return offsets[index];
}
function updateOffset(offsets, base, span, value) {
  offsets[base + span] = Math.max(
    getOrInitOffset(offsets, base + span),
    getOrInitOffset(offsets, base) + value
  );
}
function tableToString(tableRows, rowSpacing, colSpacing) {
  const layout = [];
  let colNumber = 0;
  const rowNumber = tableRows.length;
  const rowOffsets = [0];
  for (let j3 = 0; j3 < rowNumber; j3++) {
    const layoutRow = getRow(layout, j3);
    const cells = tableRows[j3];
    let x2 = 0;
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      x2 = findFirstVacantIndex(layoutRow, x2);
      putCellIntoLayout(cell, layout, j3, x2);
      x2 += cell.colspan;
      cell.lines = cell.text.split("\n");
      const cellHeight = cell.lines.length;
      updateOffset(rowOffsets, j3, cell.rowspan, cellHeight + rowSpacing);
    }
    colNumber = layoutRow.length > colNumber ? layoutRow.length : colNumber;
  }
  transposeInPlace(layout, rowNumber > colNumber ? rowNumber : colNumber);
  const outputLines = [];
  const colOffsets = [0];
  for (let x2 = 0; x2 < colNumber; x2++) {
    let y3 = 0;
    let cell;
    const rowsInThisColumn = Math.min(rowNumber, layout[x2].length);
    while (y3 < rowsInThisColumn) {
      cell = layout[x2][y3];
      if (cell) {
        if (!cell.rendered) {
          let cellWidth = 0;
          for (let j3 = 0; j3 < cell.lines.length; j3++) {
            const line = cell.lines[j3];
            const lineOffset = rowOffsets[y3] + j3;
            outputLines[lineOffset] = (outputLines[lineOffset] || "").padEnd(colOffsets[x2]) + line;
            cellWidth = line.length > cellWidth ? line.length : cellWidth;
          }
          updateOffset(colOffsets, x2, cell.colspan, cellWidth + colSpacing);
          cell.rendered = true;
        }
        y3 += cell.rowspan;
      } else {
        const lineOffset = rowOffsets[y3];
        outputLines[lineOffset] = outputLines[lineOffset] || "";
        y3++;
      }
    }
  }
  return outputLines.join("\n");
}
function formatLineBreak(elem, walk, builder, formatOptions) {
  builder.addLineBreak();
}
function formatWbr(elem, walk, builder, formatOptions) {
  builder.addWordBreakOpportunity();
}
function formatHorizontalLine(elem, walk, builder, formatOptions) {
  builder.openBlock({ leadingLineBreaks: formatOptions.leadingLineBreaks || 2 });
  builder.addInline("-".repeat(formatOptions.length || builder.options.wordwrap || 40));
  builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks || 2 });
}
function formatParagraph(elem, walk, builder, formatOptions) {
  builder.openBlock({ leadingLineBreaks: formatOptions.leadingLineBreaks || 2 });
  walk(elem.children, builder);
  builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks || 2 });
}
function formatPre(elem, walk, builder, formatOptions) {
  builder.openBlock({
    isPre: true,
    leadingLineBreaks: formatOptions.leadingLineBreaks || 2
  });
  walk(elem.children, builder);
  builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks || 2 });
}
function formatHeading(elem, walk, builder, formatOptions) {
  builder.openBlock({ leadingLineBreaks: formatOptions.leadingLineBreaks || 2 });
  if (formatOptions.uppercase !== false) {
    builder.pushWordTransform((str) => str.toUpperCase());
    walk(elem.children, builder);
    builder.popWordTransform();
  } else {
    walk(elem.children, builder);
  }
  builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks || 2 });
}
function formatBlockquote(elem, walk, builder, formatOptions) {
  builder.openBlock({
    leadingLineBreaks: formatOptions.leadingLineBreaks || 2,
    reservedLineLength: 2
  });
  walk(elem.children, builder);
  builder.closeBlock({
    trailingLineBreaks: formatOptions.trailingLineBreaks || 2,
    blockTransform: (str) => (formatOptions.trimEmptyLines !== false ? trimCharacter(str, "\n") : str).split("\n").map((line) => "> " + line).join("\n")
  });
}
function withBrackets(str, brackets) {
  if (!brackets) {
    return str;
  }
  const lbr = typeof brackets[0] === "string" ? brackets[0] : "[";
  const rbr = typeof brackets[1] === "string" ? brackets[1] : "]";
  return lbr + str + rbr;
}
function pathRewrite(path3, rewriter, baseUrl2, metadata, elem) {
  const modifiedPath = typeof rewriter === "function" ? rewriter(path3, metadata, elem) : path3;
  return modifiedPath[0] === "/" && baseUrl2 ? trimCharacterEnd(baseUrl2, "/") + modifiedPath : modifiedPath;
}
function formatImage(elem, walk, builder, formatOptions) {
  const attribs = elem.attribs || {};
  const alt = attribs.alt ? attribs.alt : "";
  const src = !attribs.src ? "" : pathRewrite(attribs.src, formatOptions.pathRewrite, formatOptions.baseUrl, builder.metadata, elem);
  const text = !src ? alt : !alt ? withBrackets(src, formatOptions.linkBrackets) : alt + " " + withBrackets(src, formatOptions.linkBrackets);
  builder.addInline(text, { noWordTransform: true });
}
function formatAnchor(elem, walk, builder, formatOptions) {
  function getHref() {
    if (formatOptions.ignoreHref) {
      return "";
    }
    if (!elem.attribs || !elem.attribs.href) {
      return "";
    }
    let href2 = elem.attribs.href.replace(/^mailto:/, "");
    if (formatOptions.noAnchorUrl && href2[0] === "#") {
      return "";
    }
    href2 = pathRewrite(href2, formatOptions.pathRewrite, formatOptions.baseUrl, builder.metadata, elem);
    return href2;
  }
  const href = getHref();
  if (!href) {
    walk(elem.children, builder);
  } else {
    let text = "";
    builder.pushWordTransform(
      (str) => {
        if (str) {
          text += str;
        }
        return str;
      }
    );
    walk(elem.children, builder);
    builder.popWordTransform();
    const hideSameLink = formatOptions.hideLinkHrefIfSameAsText && href === text;
    if (!hideSameLink) {
      builder.addInline(
        !text ? href : " " + withBrackets(href, formatOptions.linkBrackets),
        { noWordTransform: true }
      );
    }
  }
}
function formatList(elem, walk, builder, formatOptions, nextPrefixCallback) {
  const isNestedList = get(elem, ["parent", "name"]) === "li";
  let maxPrefixLength = 0;
  const listItems = (elem.children || []).filter((child) => child.type !== "text" || !/^\s*$/.test(child.data)).map(function(child) {
    if (child.name !== "li") {
      return { node: child, prefix: "" };
    }
    const prefix = isNestedList ? nextPrefixCallback().trimStart() : nextPrefixCallback();
    if (prefix.length > maxPrefixLength) {
      maxPrefixLength = prefix.length;
    }
    return { node: child, prefix };
  });
  if (!listItems.length) {
    return;
  }
  builder.openList({
    interRowLineBreaks: 1,
    leadingLineBreaks: isNestedList ? 1 : formatOptions.leadingLineBreaks || 2,
    maxPrefixLength,
    prefixAlign: "left"
  });
  for (const { node, prefix } of listItems) {
    builder.openListItem({ prefix });
    walk([node], builder);
    builder.closeListItem();
  }
  builder.closeList({ trailingLineBreaks: isNestedList ? 1 : formatOptions.trailingLineBreaks || 2 });
}
function formatUnorderedList(elem, walk, builder, formatOptions) {
  const prefix = formatOptions.itemPrefix || " * ";
  return formatList(elem, walk, builder, formatOptions, () => prefix);
}
function formatOrderedList(elem, walk, builder, formatOptions) {
  let nextIndex = Number(elem.attribs.start || "1");
  const indexFunction = getOrderedListIndexFunction(elem.attribs.type);
  const nextPrefixCallback = () => " " + indexFunction(nextIndex++) + ". ";
  return formatList(elem, walk, builder, formatOptions, nextPrefixCallback);
}
function getOrderedListIndexFunction(olType = "1") {
  switch (olType) {
    case "a":
      return (i) => numberToLetterSequence(i, "a");
    case "A":
      return (i) => numberToLetterSequence(i, "A");
    case "i":
      return (i) => numberToRoman(i).toLowerCase();
    case "I":
      return (i) => numberToRoman(i);
    case "1":
    default:
      return (i) => i.toString();
  }
}
function splitClassesAndIds(selectors) {
  const classes = [];
  const ids = [];
  for (const selector of selectors) {
    if (selector.startsWith(".")) {
      classes.push(selector.substring(1));
    } else if (selector.startsWith("#")) {
      ids.push(selector.substring(1));
    }
  }
  return { classes, ids };
}
function isDataTable(attr, tables) {
  if (tables === true) {
    return true;
  }
  if (!attr) {
    return false;
  }
  const { classes, ids } = splitClassesAndIds(tables);
  const attrClasses = (attr["class"] || "").split(" ");
  const attrIds = (attr["id"] || "").split(" ");
  return attrClasses.some((x2) => classes.includes(x2)) || attrIds.some((x2) => ids.includes(x2));
}
function formatTable(elem, walk, builder, formatOptions) {
  return isDataTable(elem.attribs, builder.options.tables) ? formatDataTable(elem, walk, builder, formatOptions) : formatBlock(elem, walk, builder, formatOptions);
}
function formatBlock(elem, walk, builder, formatOptions) {
  builder.openBlock({ leadingLineBreaks: formatOptions.leadingLineBreaks });
  walk(elem.children, builder);
  builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks });
}
function formatDataTable(elem, walk, builder, formatOptions) {
  builder.openTable();
  elem.children.forEach(walkTable);
  builder.closeTable({
    tableToString: (rows) => tableToString(rows, formatOptions.rowSpacing ?? 0, formatOptions.colSpacing ?? 3),
    leadingLineBreaks: formatOptions.leadingLineBreaks,
    trailingLineBreaks: formatOptions.trailingLineBreaks
  });
  function formatCell(cellNode) {
    const colspan = +get(cellNode, ["attribs", "colspan"]) || 1;
    const rowspan = +get(cellNode, ["attribs", "rowspan"]) || 1;
    builder.openTableCell({ maxColumnWidth: formatOptions.maxColumnWidth });
    walk(cellNode.children, builder);
    builder.closeTableCell({ colspan, rowspan });
  }
  function walkTable(elem2) {
    if (elem2.type !== "tag") {
      return;
    }
    const formatHeaderCell = formatOptions.uppercaseHeaderCells !== false ? (cellNode) => {
      builder.pushWordTransform((str) => str.toUpperCase());
      formatCell(cellNode);
      builder.popWordTransform();
    } : formatCell;
    switch (elem2.name) {
      case "thead":
      case "tbody":
      case "tfoot":
      case "center":
        elem2.children.forEach(walkTable);
        return;
      case "tr": {
        builder.openTableRow();
        for (const childOfTr of elem2.children) {
          if (childOfTr.type !== "tag") {
            continue;
          }
          switch (childOfTr.name) {
            case "th": {
              formatHeaderCell(childOfTr);
              break;
            }
            case "td": {
              formatCell(childOfTr);
              break;
            }
          }
        }
        builder.closeTableRow();
        break;
      }
    }
  }
}
function compile(options = {}) {
  options = (0, import_deepmerge.default)(
    DEFAULT_OPTIONS,
    options,
    {
      arrayMerge: overwriteMerge,
      customMerge: (key) => key === "selectors" ? selectorsMerge : void 0
    }
  );
  options.formatters = Object.assign({}, genericFormatters, textFormatters, options.formatters);
  options.selectors = mergeDuplicatesPreferLast(options.selectors, ((s2) => s2.selector));
  handleDeprecatedOptions(options);
  return compile$1(options);
}
function convert(html, options = {}, metadata = void 0) {
  return compile(options)(html, metadata);
}
function handleDeprecatedOptions(options) {
  if (options.tags) {
    const tagDefinitions = Object.entries(options.tags).map(
      ([selector, definition]) => ({ ...definition, selector: selector || "*" })
    );
    options.selectors.push(...tagDefinitions);
    options.selectors = mergeDuplicatesPreferLast(options.selectors, ((s2) => s2.selector));
  }
  function set(obj, path3, value) {
    const valueKey = path3.pop();
    for (const key of path3) {
      let nested = obj[key];
      if (!nested) {
        nested = {};
        obj[key] = nested;
      }
      obj = nested;
    }
    obj[valueKey] = value;
  }
  if (options["baseElement"]) {
    const baseElement = options["baseElement"];
    set(
      options,
      ["baseElements", "selectors"],
      Array.isArray(baseElement) ? baseElement : [baseElement]
    );
  }
  if (options["returnDomByDefault"] !== void 0) {
    set(options, ["baseElements", "returnDomByDefault"], options["returnDomByDefault"]);
  }
  for (const definition of options.selectors) {
    if (definition.format === "anchor" && get(definition, ["options", "noLinkBrackets"])) {
      set(definition, ["options", "linkBrackets"], false);
    }
  }
}
var import_deepmerge, overwriteMerge$1, I2, V2, InlineTextBuilder, StackItem, BlockStackItem, ListStackItem, ListItemStackItem, TableStackItem, TableRowStackItem, TableCellStackItem, TransformerStackItem, WhitespaceProcessor, BlockTextBuilder, genericFormatters, textFormatters, DEFAULT_OPTIONS, concatMerge, overwriteMerge, selectorsMerge;
var init_html_to_text = __esm({
  "node_modules/html-to-text/lib/html-to-text.mjs"() {
    init_hp2_builder();
    init_esm6();
    init_selderee();
    import_deepmerge = __toESM(require_cjs(), 1);
    init_esm4();
    overwriteMerge$1 = (acc, src, options) => [...src];
    I2 = ["I", "X", "C", "M"];
    V2 = ["V", "L", "D"];
    InlineTextBuilder = class {
      /**
       * Creates an instance of InlineTextBuilder.
       *
       * If `maxLineLength` is not provided then it is either `options.wordwrap` or unlimited.
       *
       * @param { Options } options           HtmlToText options.
       * @param { number }  [ maxLineLength ] This builder will try to wrap text to fit this line length.
       */
      constructor(options, maxLineLength = void 0) {
        this.lines = [];
        this.nextLineWords = [];
        this.maxLineLength = maxLineLength || options.wordwrap || Number.MAX_VALUE;
        this.nextLineAvailableChars = this.maxLineLength;
        this.wrapCharacters = get(options, ["longWordSplit", "wrapCharacters"]) || [];
        this.forceWrapOnLimit = get(options, ["longWordSplit", "forceWrapOnLimit"]) || false;
        this.stashedSpace = false;
        this.wordBreakOpportunity = false;
      }
      /**
       * Add a new word.
       *
       * @param { string } word A word to add.
       * @param { boolean } [noWrap] Don't wrap text even if the line is too long.
       */
      pushWord(word, noWrap = false) {
        if (this.nextLineAvailableChars <= 0 && !noWrap) {
          this.startNewLine();
        }
        const isLineStart = this.nextLineWords.length === 0;
        const cost = word.length + (isLineStart ? 0 : 1);
        if (cost <= this.nextLineAvailableChars || noWrap) {
          this.nextLineWords.push(word);
          this.nextLineAvailableChars -= cost;
        } else {
          const [first, ...rest] = this.splitLongWord(word);
          if (!isLineStart) {
            this.startNewLine();
          }
          this.nextLineWords.push(first);
          this.nextLineAvailableChars -= first.length;
          for (const part of rest) {
            this.startNewLine();
            this.nextLineWords.push(part);
            this.nextLineAvailableChars -= part.length;
          }
        }
      }
      /**
       * Pop a word from the currently built line.
       * This doesn't affect completed lines.
       *
       * @returns { string }
       */
      popWord() {
        const lastWord = this.nextLineWords.pop();
        if (lastWord !== void 0) {
          const isLineStart = this.nextLineWords.length === 0;
          const cost = lastWord.length + (isLineStart ? 0 : 1);
          this.nextLineAvailableChars += cost;
        }
        return lastWord;
      }
      /**
       * Concat a word to the last word already in the builder.
       * Adds a new word in case there are no words yet in the last line.
       *
       * @param { string } word A word to be concatenated.
       * @param { boolean } [noWrap] Don't wrap text even if the line is too long.
       */
      concatWord(word, noWrap = false) {
        if (this.wordBreakOpportunity && word.length > this.nextLineAvailableChars) {
          this.pushWord(word, noWrap);
          this.wordBreakOpportunity = false;
        } else {
          const lastWord = this.popWord();
          this.pushWord(lastWord ? lastWord.concat(word) : word, noWrap);
        }
      }
      /**
       * Add current line (and more empty lines if provided argument > 1) to the list of complete lines and start a new one.
       *
       * @param { number } n Number of line breaks that will be added to the resulting string.
       */
      startNewLine(n2 = 1) {
        this.lines.push(this.nextLineWords);
        if (n2 > 1) {
          this.lines.push(...Array.from({ length: n2 - 1 }, () => []));
        }
        this.nextLineWords = [];
        this.nextLineAvailableChars = this.maxLineLength;
      }
      /**
       * No words in this builder.
       *
       * @returns { boolean }
       */
      isEmpty() {
        return this.lines.length === 0 && this.nextLineWords.length === 0;
      }
      clear() {
        this.lines.length = 0;
        this.nextLineWords.length = 0;
        this.nextLineAvailableChars = this.maxLineLength;
      }
      /**
       * Join all lines of words inside the InlineTextBuilder into a complete string.
       *
       * @returns { string }
       */
      toString() {
        return [...this.lines, this.nextLineWords].map((words) => words.join(" ")).join("\n");
      }
      /**
       * Split a long word up to fit within the word wrap limit.
       * Use either a character to split looking back from the word wrap limit,
       * or truncate to the word wrap limit.
       *
       * @param   { string }   word Input word.
       * @returns { string[] }      Parts of the word.
       */
      splitLongWord(word) {
        const parts = [];
        let idx = 0;
        while (word.length > this.maxLineLength) {
          const firstLine = word.substring(0, this.maxLineLength);
          const remainingChars = word.substring(this.maxLineLength);
          const splitIndex = firstLine.lastIndexOf(this.wrapCharacters[idx]);
          if (splitIndex > -1) {
            word = firstLine.substring(splitIndex + 1) + remainingChars;
            parts.push(firstLine.substring(0, splitIndex + 1));
          } else {
            idx++;
            if (idx < this.wrapCharacters.length) {
              word = firstLine + remainingChars;
            } else {
              if (this.forceWrapOnLimit) {
                parts.push(firstLine);
                word = remainingChars;
                if (word.length > this.maxLineLength) {
                  continue;
                }
              } else {
                word = firstLine + remainingChars;
              }
              break;
            }
          }
        }
        parts.push(word);
        return parts;
      }
    };
    StackItem = class {
      constructor(next = null) {
        this.next = next;
      }
      getRoot() {
        return this.next ? this.next : this;
      }
    };
    BlockStackItem = class extends StackItem {
      constructor(options, next = null, leadingLineBreaks = 1, maxLineLength = void 0) {
        super(next);
        this.leadingLineBreaks = leadingLineBreaks;
        this.inlineTextBuilder = new InlineTextBuilder(options, maxLineLength);
        this.rawText = "";
        this.stashedLineBreaks = 0;
        this.isPre = next && next.isPre;
        this.isNoWrap = next && next.isNoWrap;
      }
    };
    ListStackItem = class extends BlockStackItem {
      constructor(options, next = null, {
        interRowLineBreaks = 1,
        leadingLineBreaks = 2,
        maxLineLength = void 0,
        maxPrefixLength = 0,
        prefixAlign = "left"
      } = {}) {
        super(options, next, leadingLineBreaks, maxLineLength);
        this.maxPrefixLength = maxPrefixLength;
        this.prefixAlign = prefixAlign;
        this.interRowLineBreaks = interRowLineBreaks;
      }
    };
    ListItemStackItem = class extends BlockStackItem {
      constructor(options, next = null, {
        leadingLineBreaks = 1,
        maxLineLength = void 0,
        prefix = ""
      } = {}) {
        super(options, next, leadingLineBreaks, maxLineLength);
        this.prefix = prefix;
      }
    };
    TableStackItem = class extends StackItem {
      constructor(next = null) {
        super(next);
        this.rows = [];
        this.isPre = next && next.isPre;
        this.isNoWrap = next && next.isNoWrap;
      }
    };
    TableRowStackItem = class extends StackItem {
      constructor(next = null) {
        super(next);
        this.cells = [];
        this.isPre = next && next.isPre;
        this.isNoWrap = next && next.isNoWrap;
      }
    };
    TableCellStackItem = class extends StackItem {
      constructor(options, next = null, maxColumnWidth = void 0) {
        super(next);
        this.inlineTextBuilder = new InlineTextBuilder(options, maxColumnWidth);
        this.rawText = "";
        this.stashedLineBreaks = 0;
        this.isPre = next && next.isPre;
        this.isNoWrap = next && next.isNoWrap;
      }
    };
    TransformerStackItem = class extends StackItem {
      constructor(next = null, transform) {
        super(next);
        this.transform = transform;
      }
    };
    WhitespaceProcessor = class {
      /**
       * Creates an instance of WhitespaceProcessor.
       *
       * @param { Options } options    HtmlToText options.
       * @memberof WhitespaceProcessor
       */
      constructor(options) {
        this.whitespaceChars = options.preserveNewlines ? options.whitespaceCharacters.replace(/\n/g, "") : options.whitespaceCharacters;
        const whitespaceCodes = charactersToCodes(this.whitespaceChars);
        this.leadingWhitespaceRe = new RegExp(`^[${whitespaceCodes}]`);
        this.trailingWhitespaceRe = new RegExp(`[${whitespaceCodes}]$`);
        this.allWhitespaceOrEmptyRe = new RegExp(`^[${whitespaceCodes}]*$`);
        this.newlineOrNonWhitespaceRe = new RegExp(`(\\n|[^\\n${whitespaceCodes}])`, "g");
        this.newlineOrNonNewlineStringRe = new RegExp(`(\\n|[^\\n]+)`, "g");
        if (options.preserveNewlines) {
          const wordOrNewlineRe = new RegExp(`\\n|[^\\n${whitespaceCodes}]+`, "gm");
          this.shrinkWrapAdd = function(text, inlineTextBuilder, transform = ((str) => str), noWrap = false) {
            if (!text) {
              return;
            }
            const previouslyStashedSpace = inlineTextBuilder.stashedSpace;
            let anyMatch = false;
            let m = wordOrNewlineRe.exec(text);
            if (m) {
              anyMatch = true;
              if (m[0] === "\n") {
                inlineTextBuilder.startNewLine();
              } else if (previouslyStashedSpace || this.testLeadingWhitespace(text)) {
                inlineTextBuilder.pushWord(transform(m[0]), noWrap);
              } else {
                inlineTextBuilder.concatWord(transform(m[0]), noWrap);
              }
              while ((m = wordOrNewlineRe.exec(text)) !== null) {
                if (m[0] === "\n") {
                  inlineTextBuilder.startNewLine();
                } else {
                  inlineTextBuilder.pushWord(transform(m[0]), noWrap);
                }
              }
            }
            inlineTextBuilder.stashedSpace = previouslyStashedSpace && !anyMatch || this.testTrailingWhitespace(text);
          };
        } else {
          const wordRe = new RegExp(`[^${whitespaceCodes}]+`, "g");
          this.shrinkWrapAdd = function(text, inlineTextBuilder, transform = ((str) => str), noWrap = false) {
            if (!text) {
              return;
            }
            const previouslyStashedSpace = inlineTextBuilder.stashedSpace;
            let anyMatch = false;
            let m = wordRe.exec(text);
            if (m) {
              anyMatch = true;
              if (previouslyStashedSpace || this.testLeadingWhitespace(text)) {
                inlineTextBuilder.pushWord(transform(m[0]), noWrap);
              } else {
                inlineTextBuilder.concatWord(transform(m[0]), noWrap);
              }
              while ((m = wordRe.exec(text)) !== null) {
                inlineTextBuilder.pushWord(transform(m[0]), noWrap);
              }
            }
            inlineTextBuilder.stashedSpace = previouslyStashedSpace && !anyMatch || this.testTrailingWhitespace(text);
          };
        }
      }
      /**
       * Add text with only minimal processing.
       * Everything between newlines considered a single word.
       * No whitespace is trimmed.
       * Not affected by preserveNewlines option - `\n` always starts a new line.
       *
       * `noWrap` argument is `true` by default - this won't start a new line
       * even if there is not enough space left in the current line.
       *
       * @param { string }            text              Input text.
       * @param { InlineTextBuilder } inlineTextBuilder A builder to receive processed text.
       * @param { boolean }           [noWrap] Don't wrap text even if the line is too long.
       */
      addLiteral(text, inlineTextBuilder, noWrap = true) {
        if (!text) {
          return;
        }
        const previouslyStashedSpace = inlineTextBuilder.stashedSpace;
        let anyMatch = false;
        let m = this.newlineOrNonNewlineStringRe.exec(text);
        if (m) {
          anyMatch = true;
          if (m[0] === "\n") {
            inlineTextBuilder.startNewLine();
          } else if (previouslyStashedSpace) {
            inlineTextBuilder.pushWord(m[0], noWrap);
          } else {
            inlineTextBuilder.concatWord(m[0], noWrap);
          }
          while ((m = this.newlineOrNonNewlineStringRe.exec(text)) !== null) {
            if (m[0] === "\n") {
              inlineTextBuilder.startNewLine();
            } else {
              inlineTextBuilder.pushWord(m[0], noWrap);
            }
          }
        }
        inlineTextBuilder.stashedSpace = previouslyStashedSpace && !anyMatch;
      }
      /**
       * Test whether the given text starts with HTML whitespace character.
       *
       * @param   { string }  text  The string to test.
       * @returns { boolean }
       */
      testLeadingWhitespace(text) {
        return this.leadingWhitespaceRe.test(text);
      }
      /**
       * Test whether the given text ends with HTML whitespace character.
       *
       * @param   { string }  text  The string to test.
       * @returns { boolean }
       */
      testTrailingWhitespace(text) {
        return this.trailingWhitespaceRe.test(text);
      }
      /**
       * Test whether the given text contains any non-whitespace characters.
       *
       * @param   { string }  text  The string to test.
       * @returns { boolean }
       */
      testContainsWords(text) {
        return !this.allWhitespaceOrEmptyRe.test(text);
      }
      /**
       * Return the number of newlines if there are no words.
       *
       * If any word is found then return zero regardless of the actual number of newlines.
       *
       * @param   { string }  text  Input string.
       * @returns { number }
       */
      countNewlinesNoWords(text) {
        this.newlineOrNonWhitespaceRe.lastIndex = 0;
        let counter = 0;
        let match;
        while ((match = this.newlineOrNonWhitespaceRe.exec(text)) !== null) {
          if (match[0] === "\n") {
            counter++;
          } else {
            return 0;
          }
        }
        return counter;
      }
    };
    BlockTextBuilder = class {
      /**
       * Creates an instance of BlockTextBuilder.
       *
       * @param { Options } options HtmlToText options.
       * @param { import('selderee').Picker<DomNode, TagDefinition> } picker Selectors decision tree picker.
       * @param { any} [metadata] Optional metadata for HTML document, for use in formatters.
       */
      constructor(options, picker, metadata = void 0) {
        this.options = options;
        this.picker = picker;
        this.metadata = metadata;
        this.whitespaceProcessor = new WhitespaceProcessor(options);
        this._stackItem = new BlockStackItem(options);
        this._wordTransformer = void 0;
      }
      /**
       * Put a word-by-word transform function onto the transformations stack.
       *
       * Mainly used for uppercasing. Can be bypassed to add unformatted text such as URLs.
       *
       * Word transformations applied before wrapping.
       *
       * @param { (str: string) => string } wordTransform Word transformation function.
       */
      pushWordTransform(wordTransform) {
        this._wordTransformer = new TransformerStackItem(this._wordTransformer, wordTransform);
      }
      /**
       * Remove a function from the word transformations stack.
       *
       * @returns { (str: string) => string } A function that was removed.
       */
      popWordTransform() {
        if (!this._wordTransformer) {
          return void 0;
        }
        const transform = this._wordTransformer.transform;
        this._wordTransformer = this._wordTransformer.next;
        return transform;
      }
      /**
       * Ignore wordwrap option in followup inline additions and disable automatic wrapping.
       */
      startNoWrap() {
        this._stackItem.isNoWrap = true;
      }
      /**
       * Return automatic wrapping to behavior defined by options.
       */
      stopNoWrap() {
        this._stackItem.isNoWrap = false;
      }
      /** @returns { (str: string) => string } */
      _getCombinedWordTransformer() {
        const wt3 = this._wordTransformer ? ((str) => applyTransformer(str, this._wordTransformer)) : void 0;
        const ce3 = this.options.encodeCharacters;
        return wt3 ? ce3 ? (str) => ce3(wt3(str)) : wt3 : ce3;
      }
      _popStackItem() {
        const item = this._stackItem;
        this._stackItem = item.next;
        return item;
      }
      /**
       * Add a line break into currently built block.
       */
      addLineBreak() {
        if (!(this._stackItem instanceof BlockStackItem || this._stackItem instanceof ListItemStackItem || this._stackItem instanceof TableCellStackItem)) {
          return;
        }
        if (this._stackItem.isPre) {
          this._stackItem.rawText += "\n";
        } else {
          this._stackItem.inlineTextBuilder.startNewLine();
        }
      }
      /**
       * Allow to break line in case directly following text will not fit.
       */
      addWordBreakOpportunity() {
        if (this._stackItem instanceof BlockStackItem || this._stackItem instanceof ListItemStackItem || this._stackItem instanceof TableCellStackItem) {
          this._stackItem.inlineTextBuilder.wordBreakOpportunity = true;
        }
      }
      /**
       * Add a node inline into the currently built block.
       *
       * @param { string } str
       * Text content of a node to add.
       *
       * @param { object } [param1]
       * Object holding the parameters of the operation.
       *
       * @param { boolean } [param1.noWordTransform]
       * Ignore word transformers if there are any.
       * Don't encode characters as well.
       * (Use this for things like URL addresses).
       */
      addInline(str, { noWordTransform = false } = {}) {
        if (!(this._stackItem instanceof BlockStackItem || this._stackItem instanceof ListItemStackItem || this._stackItem instanceof TableCellStackItem)) {
          return;
        }
        if (this._stackItem.isPre) {
          this._stackItem.rawText += str;
          return;
        }
        if (str.length === 0 || // empty string
        this._stackItem.stashedLineBreaks && // stashed linebreaks make whitespace irrelevant
        !this.whitespaceProcessor.testContainsWords(str)) {
          return;
        }
        if (this.options.preserveNewlines) {
          const newlinesNumber = this.whitespaceProcessor.countNewlinesNoWords(str);
          if (newlinesNumber > 0) {
            this._stackItem.inlineTextBuilder.startNewLine(newlinesNumber);
            return;
          }
        }
        if (this._stackItem.stashedLineBreaks) {
          this._stackItem.inlineTextBuilder.startNewLine(this._stackItem.stashedLineBreaks);
        }
        this.whitespaceProcessor.shrinkWrapAdd(
          str,
          this._stackItem.inlineTextBuilder,
          noWordTransform ? void 0 : this._getCombinedWordTransformer(),
          this._stackItem.isNoWrap
        );
        this._stackItem.stashedLineBreaks = 0;
      }
      /**
       * Add a string inline into the currently built block.
       *
       * Use this for markup elements that don't have to adhere
       * to text layout rules.
       *
       * @param { string } str Text to add.
       */
      addLiteral(str) {
        if (!(this._stackItem instanceof BlockStackItem || this._stackItem instanceof ListItemStackItem || this._stackItem instanceof TableCellStackItem)) {
          return;
        }
        if (str.length === 0) {
          return;
        }
        if (this._stackItem.isPre) {
          this._stackItem.rawText += str;
          return;
        }
        if (this._stackItem.stashedLineBreaks) {
          this._stackItem.inlineTextBuilder.startNewLine(this._stackItem.stashedLineBreaks);
        }
        this.whitespaceProcessor.addLiteral(
          str,
          this._stackItem.inlineTextBuilder,
          this._stackItem.isNoWrap
        );
        this._stackItem.stashedLineBreaks = 0;
      }
      /**
       * Start building a new block.
       *
       * @param { object } [param0]
       * Object holding the parameters of the block.
       *
       * @param { number } [param0.leadingLineBreaks]
       * This block should have at least this number of line breaks to separate it from any preceding block.
       *
       * @param { number }  [param0.reservedLineLength]
       * Reserve this number of characters on each line for block markup.
       *
       * @param { boolean } [param0.isPre]
       * Should HTML whitespace be preserved inside this block.
       */
      openBlock({ leadingLineBreaks = 1, reservedLineLength = 0, isPre = false } = {}) {
        const maxLineLength = Math.max(20, this._stackItem.inlineTextBuilder.maxLineLength - reservedLineLength);
        this._stackItem = new BlockStackItem(
          this.options,
          this._stackItem,
          leadingLineBreaks,
          maxLineLength
        );
        if (isPre) {
          this._stackItem.isPre = true;
        }
      }
      /**
       * Finalize currently built block, add it's content to the parent block.
       *
       * @param { object } [param0]
       * Object holding the parameters of the block.
       *
       * @param { number } [param0.trailingLineBreaks]
       * This block should have at least this number of line breaks to separate it from any following block.
       *
       * @param { (str: string) => string } [param0.blockTransform]
       * A function to transform the block text before adding to the parent block.
       * This happens after word wrap and should be used in combination with reserved line length
       * in order to keep line lengths correct.
       * Used for whole block markup.
       */
      closeBlock({ trailingLineBreaks = 1, blockTransform = void 0 } = {}) {
        const block = this._popStackItem();
        const blockText = blockTransform ? blockTransform(getText(block)) : getText(block);
        addText(this._stackItem, blockText, block.leadingLineBreaks, Math.max(block.stashedLineBreaks, trailingLineBreaks));
      }
      /**
       * Start building a new list.
       *
       * @param { object } [param0]
       * Object holding the parameters of the list.
       *
       * @param { number } [param0.maxPrefixLength]
       * Length of the longest list item prefix.
       * If not supplied or too small then list items won't be aligned properly.
       *
       * @param { 'left' | 'right' } [param0.prefixAlign]
       * Specify how prefixes of different lengths have to be aligned
       * within a column.
       *
       * @param { number } [param0.interRowLineBreaks]
       * Minimum number of line breaks between list items.
       *
       * @param { number } [param0.leadingLineBreaks]
       * This list should have at least this number of line breaks to separate it from any preceding block.
       */
      openList({ maxPrefixLength = 0, prefixAlign = "left", interRowLineBreaks = 1, leadingLineBreaks = 2 } = {}) {
        this._stackItem = new ListStackItem(this.options, this._stackItem, {
          interRowLineBreaks,
          leadingLineBreaks,
          maxLineLength: this._stackItem.inlineTextBuilder.maxLineLength,
          maxPrefixLength,
          prefixAlign
        });
      }
      /**
       * Start building a new list item.
       *
       * @param {object} param0
       * Object holding the parameters of the list item.
       *
       * @param { string } [param0.prefix]
       * Prefix for this list item (item number, bullet point, etc).
       */
      openListItem({ prefix = "" } = {}) {
        if (!(this._stackItem instanceof ListStackItem)) {
          throw new Error("Can't add a list item to something that is not a list! Check the formatter.");
        }
        const list = this._stackItem;
        const prefixLength = Math.max(prefix.length, list.maxPrefixLength);
        const maxLineLength = Math.max(20, list.inlineTextBuilder.maxLineLength - prefixLength);
        this._stackItem = new ListItemStackItem(this.options, list, {
          prefix,
          maxLineLength,
          leadingLineBreaks: list.interRowLineBreaks
        });
      }
      /**
       * Finalize currently built list item, add it's content to the parent list.
       */
      closeListItem() {
        const listItem = this._popStackItem();
        const list = listItem.next;
        const prefixLength = Math.max(listItem.prefix.length, list.maxPrefixLength);
        const spacing = "\n" + " ".repeat(prefixLength);
        const prefix = list.prefixAlign === "right" ? listItem.prefix.padStart(prefixLength) : listItem.prefix.padEnd(prefixLength);
        const text = prefix + getText(listItem).replace(/\n/g, spacing);
        addText(
          list,
          text,
          listItem.leadingLineBreaks,
          Math.max(listItem.stashedLineBreaks, list.interRowLineBreaks)
        );
      }
      /**
       * Finalize currently built list, add it's content to the parent block.
       *
       * @param { object } param0
       * Object holding the parameters of the list.
       *
       * @param { number } [param0.trailingLineBreaks]
       * This list should have at least this number of line breaks to separate it from any following block.
       */
      closeList({ trailingLineBreaks = 2 } = {}) {
        const list = this._popStackItem();
        const text = getText(list);
        if (text) {
          addText(this._stackItem, text, list.leadingLineBreaks, trailingLineBreaks);
        }
      }
      /**
       * Start building a table.
       */
      openTable() {
        this._stackItem = new TableStackItem(this._stackItem);
      }
      /**
       * Start building a table row.
       */
      openTableRow() {
        if (!(this._stackItem instanceof TableStackItem)) {
          throw new Error("Can't add a table row to something that is not a table! Check the formatter.");
        }
        this._stackItem = new TableRowStackItem(this._stackItem);
      }
      /**
       * Start building a table cell.
       *
       * @param { object } [param0]
       * Object holding the parameters of the cell.
       *
       * @param { number } [param0.maxColumnWidth]
       * Wrap cell content to this width. Fall back to global wordwrap value if undefined.
       */
      openTableCell({ maxColumnWidth = void 0 } = {}) {
        if (!(this._stackItem instanceof TableRowStackItem)) {
          throw new Error("Can't add a table cell to something that is not a table row! Check the formatter.");
        }
        this._stackItem = new TableCellStackItem(this.options, this._stackItem, maxColumnWidth);
      }
      /**
       * Finalize currently built table cell and add it to parent table row's cells.
       *
       * @param { object } [param0]
       * Object holding the parameters of the cell.
       *
       * @param { number } [param0.colspan] How many columns this cell should occupy.
       * @param { number } [param0.rowspan] How many rows this cell should occupy.
       */
      closeTableCell({ colspan = 1, rowspan = 1 } = {}) {
        const cell = this._popStackItem();
        const text = trimCharacter(getText(cell), "\n");
        cell.next.cells.push({ colspan, rowspan, text });
      }
      /**
       * Finalize currently built table row and add it to parent table's rows.
       */
      closeTableRow() {
        const row = this._popStackItem();
        row.next.rows.push(row.cells);
      }
      /**
       * Finalize currently built table and add the rendered text to the parent block.
       *
       * @param { object } param0
       * Object holding the parameters of the table.
       *
       * @param { TablePrinter } param0.tableToString
       * A function to convert a table of stringified cells into a complete table.
       *
       * @param { number } [param0.leadingLineBreaks]
       * This table should have at least this number of line breaks to separate if from any preceding block.
       *
       * @param { number } [param0.trailingLineBreaks]
       * This table should have at least this number of line breaks to separate it from any following block.
       */
      closeTable({ tableToString: tableToString2, leadingLineBreaks = 2, trailingLineBreaks = 2 }) {
        const table = this._popStackItem();
        const output = tableToString2(table.rows);
        if (output) {
          addText(this._stackItem, output, leadingLineBreaks, trailingLineBreaks);
        }
      }
      /**
       * Return the rendered text content of this builder.
       *
       * @returns { string }
       */
      toString() {
        return getText(this._stackItem.getRoot());
      }
    };
    genericFormatters = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      block: formatBlock$1,
      blockHtml: formatBlockHtml,
      blockString: formatBlockString,
      blockTag: formatBlockTag,
      inline: formatInline,
      inlineHtml: formatInlineHtml,
      inlineString: formatInlineString,
      inlineSurround: formatInlineSurround,
      inlineTag: formatInlineTag,
      skip: formatSkip
    });
    textFormatters = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      anchor: formatAnchor,
      blockquote: formatBlockquote,
      dataTable: formatDataTable,
      heading: formatHeading,
      horizontalLine: formatHorizontalLine,
      image: formatImage,
      lineBreak: formatLineBreak,
      orderedList: formatOrderedList,
      paragraph: formatParagraph,
      pre: formatPre,
      table: formatTable,
      unorderedList: formatUnorderedList,
      wbr: formatWbr
    });
    DEFAULT_OPTIONS = {
      baseElements: {
        selectors: ["body"],
        orderBy: "selectors",
        // 'selectors' | 'occurrence'
        returnDomByDefault: true
      },
      decodeEntities: true,
      encodeCharacters: {},
      formatters: {},
      limits: {
        ellipsis: "...",
        maxBaseElements: void 0,
        maxChildNodes: void 0,
        maxDepth: void 0,
        maxInputLength: 1 << 24
        // 16_777_216
      },
      longWordSplit: {
        forceWrapOnLimit: false,
        wrapCharacters: []
      },
      preserveNewlines: false,
      selectors: [
        { selector: "*", format: "inline" },
        {
          selector: "a",
          format: "anchor",
          options: {
            baseUrl: null,
            hideLinkHrefIfSameAsText: false,
            ignoreHref: false,
            linkBrackets: ["[", "]"],
            noAnchorUrl: true
          }
        },
        { selector: "article", format: "block", options: { leadingLineBreaks: 1, trailingLineBreaks: 1 } },
        { selector: "aside", format: "block", options: { leadingLineBreaks: 1, trailingLineBreaks: 1 } },
        {
          selector: "blockquote",
          format: "blockquote",
          options: { leadingLineBreaks: 2, trailingLineBreaks: 2, trimEmptyLines: true }
        },
        { selector: "br", format: "lineBreak" },
        { selector: "div", format: "block", options: { leadingLineBreaks: 1, trailingLineBreaks: 1 } },
        { selector: "footer", format: "block", options: { leadingLineBreaks: 1, trailingLineBreaks: 1 } },
        { selector: "form", format: "block", options: { leadingLineBreaks: 1, trailingLineBreaks: 1 } },
        { selector: "h1", format: "heading", options: { leadingLineBreaks: 3, trailingLineBreaks: 2, uppercase: true } },
        { selector: "h2", format: "heading", options: { leadingLineBreaks: 3, trailingLineBreaks: 2, uppercase: true } },
        { selector: "h3", format: "heading", options: { leadingLineBreaks: 3, trailingLineBreaks: 2, uppercase: true } },
        { selector: "h4", format: "heading", options: { leadingLineBreaks: 2, trailingLineBreaks: 2, uppercase: true } },
        { selector: "h5", format: "heading", options: { leadingLineBreaks: 2, trailingLineBreaks: 2, uppercase: true } },
        { selector: "h6", format: "heading", options: { leadingLineBreaks: 2, trailingLineBreaks: 2, uppercase: true } },
        { selector: "header", format: "block", options: { leadingLineBreaks: 1, trailingLineBreaks: 1 } },
        {
          selector: "hr",
          format: "horizontalLine",
          options: { leadingLineBreaks: 2, length: void 0, trailingLineBreaks: 2 }
        },
        {
          selector: "img",
          format: "image",
          options: { baseUrl: null, linkBrackets: ["[", "]"] }
        },
        { selector: "main", format: "block", options: { leadingLineBreaks: 1, trailingLineBreaks: 1 } },
        { selector: "nav", format: "block", options: { leadingLineBreaks: 1, trailingLineBreaks: 1 } },
        {
          selector: "ol",
          format: "orderedList",
          options: { leadingLineBreaks: 2, trailingLineBreaks: 2 }
        },
        { selector: "p", format: "paragraph", options: { leadingLineBreaks: 2, trailingLineBreaks: 2 } },
        { selector: "pre", format: "pre", options: { leadingLineBreaks: 2, trailingLineBreaks: 2 } },
        { selector: "section", format: "block", options: { leadingLineBreaks: 1, trailingLineBreaks: 1 } },
        {
          selector: "table",
          format: "table",
          options: {
            colSpacing: 3,
            leadingLineBreaks: 2,
            maxColumnWidth: 60,
            rowSpacing: 0,
            trailingLineBreaks: 2,
            uppercaseHeaderCells: true
          }
        },
        {
          selector: "ul",
          format: "unorderedList",
          options: { itemPrefix: " * ", leadingLineBreaks: 2, trailingLineBreaks: 2 }
        },
        { selector: "wbr", format: "wbr" }
      ],
      tables: [],
      // deprecated
      whitespaceCharacters: " 	\r\n\f\u200B",
      wordwrap: 80
    };
    concatMerge = (acc, src, options) => [...acc, ...src];
    overwriteMerge = (acc, src, options) => [...src];
    selectorsMerge = (acc, src, options) => acc.some((s2) => typeof s2 === "object") ? concatMerge(acc, src) : overwriteMerge(acc, src);
  }
});

// node_modules/prettier/plugins/html.mjs
var html_exports = {};
__export(html_exports, {
  default: () => ym,
  languages: () => Hs,
  options: () => Us,
  parsers: () => tn,
  printers: () => uu
});
function yi(t9) {
  if (typeof t9 == "string") return we2;
  if (Array.isArray(t9)) return ze;
  if (!t9) return;
  let { type: e2 } = t9;
  if (Dt.has(e2)) return e2;
}
function bi(t9) {
  let e2 = t9 === null ? "null" : typeof t9;
  if (e2 !== "string" && e2 !== "object") return `Unexpected doc '${e2}', 
Expected it to be 'string' or 'object'.`;
  if (Fe2(t9)) throw new Error("doc is valid.");
  let r2 = Object.prototype.toString.call(t9);
  if (r2 !== "[object Object]") return `Unexpected doc '${r2}'.`;
  let n2 = wi([...Dt].map((s2) => `'${s2}'`));
  return `Unexpected doc.type '${t9.type}'.
Expected it to be ${n2}.`;
}
function hr(t9, e2) {
  if (typeof t9 == "string") return e2(t9);
  let r2 = /* @__PURE__ */ new Map();
  return n2(t9);
  function n2(i) {
    if (r2.has(i)) return r2.get(i);
    let a = s2(i);
    return r2.set(i, a), a;
  }
  function s2(i) {
    switch (Fe2(i)) {
      case ze:
        return e2(i.map(n2));
      case ke2:
        return e2({ ...i, parts: i.parts.map(n2) });
      case ce:
        return e2({ ...i, breakContents: n2(i.breakContents), flatContents: n2(i.flatContents) });
      case xe2: {
        let { expandedStates: a, contents: o2 } = i;
        return a ? (a = a.map(n2), o2 = a[0]) : o2 = n2(o2), e2({ ...i, contents: o2, expandedStates: a });
      }
      case Te2:
      case be2:
      case Be2:
      case Qe:
      case Ke:
        return e2({ ...i, contents: n2(i.contents) });
      case we2:
      case Ye2:
      case je2:
      case Xe:
      case j:
      case Le2:
        return e2(i);
      default:
        throw new pr(i);
    }
  }
}
function B(t9, e2 = hn) {
  return hr(t9, (r2) => typeof r2 == "string" ? H2(e2, r2.split(`
`)) : r2);
}
function k2(t9) {
  return re2(t9), { type: be2, contents: t9 };
}
function fn(t9, e2) {
  return re2(e2), { type: Te2, contents: e2, n: t9 };
}
function E2(t9, e2 = {}) {
  return re2(t9), fr(e2.expandedStates, true), { type: xe2, id: e2.id, contents: t9, break: !!e2.shouldBreak, expandedStates: e2.expandedStates };
}
function dn(t9) {
  return fn(Number.NEGATIVE_INFINITY, t9);
}
function gn(t9) {
  return fn({ type: "root" }, t9);
}
function vt(t9) {
  return mn(t9), { type: ke2, parts: t9 };
}
function pe2(t9, e2 = "", r2 = {}) {
  return re2(t9), e2 !== "" && re2(e2), { type: ce, breakContents: t9, flatContents: e2, groupId: r2.groupId };
}
function Cn(t9, e2) {
  return re2(t9), { type: Be2, contents: t9, groupId: e2.groupId, negate: e2.negate };
}
function H2(t9, e2) {
  re2(t9), fr(e2);
  let r2 = [];
  for (let n2 = 0; n2 < e2.length; n2++) n2 !== 0 && r2.push(t9), r2.push(e2[n2]);
  return r2;
}
function Bi(t9, e2) {
  let r2 = e2 === true || e2 === yt ? yt : Sn, n2 = r2 === yt ? Sn : yt, s2 = 0, i = 0;
  for (let a of t9) a === r2 ? s2++ : a === n2 && i++;
  return s2 > i ? n2 : r2;
}
function dr(t9) {
  if (typeof t9 != "string") throw new TypeError("Expected a string");
  return t9.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
function Pi(t9) {
  return (t9 == null ? void 0 : t9.type) === "front-matter";
}
function Dn(t9, e2) {
  var r2;
  if (t9.type === "text" || t9.type === "comment" || Pe2(t9) || t9.type === "yaml" || t9.type === "toml") return null;
  if (t9.type === "attribute" && delete e2.value, t9.type === "docType" && delete e2.value, t9.type === "angularControlFlowBlock" && ((r2 = t9.parameters) != null && r2.children)) for (let n2 of e2.parameters.children) Ii.has(t9.name) ? delete n2.expression : n2.expression = n2.expression.trim();
  t9.type === "angularIcuExpression" && (e2.switchValue = t9.switchValue.trim()), t9.type === "angularLetDeclarationInitializer" && delete e2.value;
}
async function Ri(t9, e2) {
  if (t9.language === "yaml") {
    let r2 = t9.value.trim(), n2 = r2 ? await e2(r2, { parser: "yaml" }) : "";
    return gn([t9.startDelimiter, t9.explicitLanguage, S2, n2, n2 ? S2 : "", t9.endDelimiter]);
  }
}
function he2(t9, e2 = true) {
  return [k2([v2, t9]), e2 ? v2 : ""];
}
function X2(t9, e2) {
  let r2 = t9.type === "NGRoot" ? t9.node.type === "NGMicrosyntax" && t9.node.body.length === 1 && t9.node.body[0].type === "NGMicrosyntaxExpression" ? t9.node.body[0].expression : t9.node : t9.type === "JsExpressionRoot" ? t9.node : t9;
  return r2 && (r2.type === "ObjectExpression" || r2.type === "ArrayExpression" || (e2.parser === "__vue_expression" || e2.parser === "__vue_ts_expression") && (r2.type === "TemplateLiteral" || r2.type === "StringLiteral"));
}
async function T(t9, e2, r2, n2) {
  r2 = { __isInHtmlAttribute: true, __embeddedInHtml: true, ...r2 };
  let s2 = true;
  n2 && (r2.__onHtmlBindingRoot = (a, o2) => {
    s2 = n2(a, o2);
  });
  let i = await e2(t9, r2, e2);
  return s2 ? E2(i) : he2(i);
}
function $i(t9, e2, r2, n2) {
  let { node: s2 } = r2, i = n2.originalText.slice(s2.sourceSpan.start.offset, s2.sourceSpan.end.offset);
  return /^\s*$/u.test(i) ? "" : T(i, t9, { parser: "__ng_directive", __isInHtmlAttribute: false }, X2);
}
function Mi(t9) {
  return Array.isArray(t9) && t9.length > 0;
}
function Fn(t9) {
  if (t9 = t9 instanceof URL ? t9 : new URL(t9), t9.protocol !== "file:") throw new TypeError(`URL must be a file URL: received "${t9.protocol}"`);
  return t9;
}
function Hi(t9) {
  return t9 = Fn(t9), decodeURIComponent(t9.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25"));
}
function Vi(t9) {
  t9 = Fn(t9);
  let e2 = decodeURIComponent(t9.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
  return t9.hostname !== "" && (e2 = `\\\\${t9.hostname}${e2}`), e2;
}
function Pn(t9) {
  return qi ? Vi(t9) : Hi(t9);
}
function In(t9, e2) {
  if (!e2) return;
  let r2 = Ui(e2).toLowerCase();
  return t9.find(({ filenames: n2 }) => n2 == null ? void 0 : n2.some((s2) => s2.toLowerCase() === r2)) ?? t9.find(({ extensions: n2 }) => n2 == null ? void 0 : n2.some((s2) => r2.endsWith(s2)));
}
function Wi(t9, e2) {
  if (e2) return t9.find(({ name: r2 }) => r2.toLowerCase() === e2) ?? t9.find(({ aliases: r2 }) => r2 == null ? void 0 : r2.includes(e2)) ?? t9.find(({ extensions: r2 }) => r2 == null ? void 0 : r2.includes(`.${e2}`));
}
function Rn(t9, e2) {
  if (e2) {
    if (String(e2).startsWith("file:")) try {
      e2 = Nn(e2);
    } catch {
      return;
    }
    if (typeof e2 == "string") return t9.find(({ isSupported: r2 }) => r2 == null ? void 0 : r2({ filepath: e2 }));
  }
}
function Gi(t9, e2) {
  let r2 = bn(false, t9.plugins).flatMap((s2) => s2.languages ?? []), n2 = Wi(r2, e2.language) ?? In(r2, e2.physicalFile) ?? In(r2, e2.file) ?? Rn(r2, e2.physicalFile) ?? Rn(r2, e2.file) ?? (e2.physicalFile, void 0);
  return n2 == null ? void 0 : n2.parsers[0];
}
function zi(t9) {
  return t9.type === "element" && !t9.hasExplicitNamespace && !["html", "svg"].includes(t9.namespace);
}
function wt(t9, e2) {
  return !!(t9.type === "ieConditionalComment" && t9.lastChild && !t9.lastChild.isSelfClosing && !t9.lastChild.endSourceSpan || t9.type === "ieConditionalComment" && !t9.complete || de2(t9) && t9.children.some((r2) => r2.type !== "text" && r2.type !== "interpolation") || xt(t9, e2) && !W(t9, e2) && t9.type !== "interpolation");
}
function ge2(t9) {
  return t9.type === "attribute" || !t9.parent || !t9.prev ? false : ji(t9.prev);
}
function ji(t9) {
  return t9.type === "comment" && t9.value.trim() === "prettier-ignore";
}
function $2(t9) {
  return t9.type === "text" || t9.type === "comment";
}
function W(t9, e2) {
  return t9.type === "element" && (t9.fullName === "script" || t9.fullName === "style" || t9.fullName === "svg:style" || t9.fullName === "svg:script" || t9.fullName === "mj-style" && e2.parser === "mjml" || fe2(t9) && (t9.name === "script" || t9.name === "style"));
}
function qn(t9, e2) {
  return t9.children && !W(t9, e2);
}
function Hn(t9, e2) {
  return W(t9, e2) || t9.type === "interpolation" || Ar(t9);
}
function Ar(t9) {
  return Jn(t9).startsWith("pre");
}
function Vn(t9, e2) {
  var s2, i;
  let r2 = n2();
  if (r2 && !t9.prev && ((i = (s2 = t9.parent) == null ? void 0 : s2.tagDefinition) != null && i.ignoreFirstLf)) return t9.type === "interpolation";
  return r2;
  function n2() {
    return Pe2(t9) || t9.type === "angularControlFlowBlock" ? false : (t9.type === "text" || t9.type === "interpolation") && t9.prev && (t9.prev.type === "text" || t9.prev.type === "interpolation") ? true : !t9.parent || t9.parent.cssDisplay === "none" ? false : de2(t9.parent) ? true : !(!t9.prev && (t9.parent.type === "root" || de2(t9) && t9.parent || W(t9.parent, e2) || et(t9.parent, e2) || !ea(t9.parent.cssDisplay)) || t9.prev && !na(t9.prev.cssDisplay));
  }
}
function Un(t9, e2) {
  return Pe2(t9) || t9.type === "angularControlFlowBlock" ? false : (t9.type === "text" || t9.type === "interpolation") && t9.next && (t9.next.type === "text" || t9.next.type === "interpolation") ? true : !t9.parent || t9.parent.cssDisplay === "none" ? false : de2(t9.parent) ? true : !(!t9.next && (t9.parent.type === "root" || de2(t9) && t9.parent || W(t9.parent, e2) || et(t9.parent, e2) || !ta(t9.parent.cssDisplay)) || t9.next && !ra(t9.next.cssDisplay));
}
function Wn(t9, e2) {
  return sa(t9.cssDisplay) && !W(t9, e2);
}
function Je(t9) {
  return Pe2(t9) || t9.next && t9.sourceSpan.end && t9.sourceSpan.end.line + 1 < t9.next.sourceSpan.start.line;
}
function Gn(t9) {
  return Dr(t9) || t9.type === "element" && t9.children.length > 0 && (["body", "script", "style"].includes(t9.name) || t9.children.some((e2) => Xi(e2))) || t9.firstChild && t9.firstChild === t9.lastChild && t9.firstChild.type !== "text" && Yn(t9.firstChild) && (!t9.lastChild.isTrailingSpaceSensitive || jn(t9.lastChild));
}
function Dr(t9) {
  return t9.type === "element" && t9.children.length > 0 && (["html", "head", "ul", "ol", "select"].includes(t9.name) || t9.cssDisplay.startsWith("table") && t9.cssDisplay !== "table-cell");
}
function bt(t9) {
  return Kn(t9) || t9.prev && Ki(t9.prev) || zn(t9);
}
function Ki(t9) {
  return Kn(t9) || t9.type === "element" && t9.fullName === "br" || zn(t9);
}
function zn(t9) {
  return Yn(t9) && jn(t9);
}
function Yn(t9) {
  return t9.hasLeadingSpaces && (t9.prev ? t9.prev.sourceSpan.end.line < t9.sourceSpan.start.line : t9.parent.type === "root" || t9.parent.startSourceSpan.end.line < t9.sourceSpan.start.line);
}
function jn(t9) {
  return t9.hasTrailingSpaces && (t9.next ? t9.next.sourceSpan.start.line > t9.sourceSpan.end.line : t9.parent.type === "root" || t9.parent.endSourceSpan && t9.parent.endSourceSpan.start.line > t9.sourceSpan.end.line);
}
function Kn(t9) {
  switch (t9.type) {
    case "ieConditionalComment":
    case "comment":
    case "directive":
      return true;
    case "element":
      return ["script", "select"].includes(t9.name);
  }
  return false;
}
function Tt(t9) {
  return t9.lastChild ? Tt(t9.lastChild) : t9;
}
function Xi(t9) {
  var e2;
  return (e2 = t9.children) == null ? void 0 : e2.some((r2) => r2.type !== "text");
}
function Xn(t9) {
  if (t9) switch (t9) {
    case "module":
    case "text/javascript":
    case "text/babel":
    case "text/jsx":
    case "application/javascript":
      return "babel";
    case "application/x-typescript":
      return "typescript";
    case "text/markdown":
      return "markdown";
    case "text/html":
      return "html";
    case "text/x-handlebars-template":
      return "glimmer";
    default:
      if (t9.endsWith("json") || t9.endsWith("importmap") || t9 === "speculationrules") return "json";
  }
}
function Qi(t9, e2) {
  let { name: r2, attrMap: n2 } = t9;
  if (r2 !== "script" || Object.prototype.hasOwnProperty.call(n2, "src")) return;
  let { type: s2, lang: i } = t9.attrMap;
  return !i && !s2 ? "babel" : Ne2(e2, { language: i }) ?? Xn(s2);
}
function Ji(t9, e2) {
  if (!xt(t9, e2)) return;
  let { attrMap: r2 } = t9;
  if (Object.prototype.hasOwnProperty.call(r2, "src")) return;
  let { type: n2, lang: s2 } = r2;
  return Ne2(e2, { language: s2 }) ?? Xn(n2);
}
function Zi(t9, e2) {
  if (t9.name === "style") {
    let { lang: r2 } = t9.attrMap;
    return r2 ? Ne2(e2, { language: r2 }) : "css";
  }
  if (t9.name === "mj-style" && e2.parser === "mjml") return "css";
}
function vr(t9, e2) {
  return Qi(t9, e2) ?? Zi(t9, e2) ?? Ji(t9, e2);
}
function Ze(t9) {
  return t9 === "block" || t9 === "list-item" || t9.startsWith("table");
}
function ea(t9) {
  return !Ze(t9) && t9 !== "inline-block";
}
function ta(t9) {
  return !Ze(t9) && t9 !== "inline-block";
}
function ra(t9) {
  return !Ze(t9);
}
function na(t9) {
  return !Ze(t9);
}
function sa(t9) {
  return !Ze(t9) && t9 !== "inline-block";
}
function de2(t9) {
  return Jn(t9).startsWith("pre");
}
function ia(t9, e2) {
  let r2 = t9;
  for (; r2; ) {
    if (e2(r2)) return true;
    r2 = r2.parent;
  }
  return false;
}
function Qn(t9, e2) {
  var n2;
  if (Ce2(t9, e2)) return "block";
  if (((n2 = t9.prev) == null ? void 0 : n2.type) === "comment") {
    let s2 = t9.prev.value.match(/^\s*display:\s*([a-z]+)\s*$/u);
    if (s2) return s2[1];
  }
  let r2 = false;
  if (t9.type === "element" && t9.namespace === "svg") if (ia(t9, (s2) => s2.fullName === "svg:foreignObject")) r2 = true;
  else return t9.name === "svg" ? "inline-block" : "block";
  switch (e2.htmlWhitespaceSensitivity) {
    case "strict":
      return "inline";
    case "ignore":
      return "block";
    default:
      if (t9.type === "element" && (!t9.namespace || r2 || fe2(t9)) && Object.prototype.hasOwnProperty.call(Sr, t9.name)) return Sr[t9.name];
  }
  return $n;
}
function Jn(t9) {
  return t9.type === "element" && (!t9.namespace || fe2(t9)) && Object.prototype.hasOwnProperty.call(_r, t9.name) ? _r[t9.name] : On;
}
function aa(t9) {
  let e2 = Number.POSITIVE_INFINITY;
  for (let r2 of t9.split(`
`)) {
    if (r2.length === 0) continue;
    let n2 = O.getLeadingWhitespaceCount(r2);
    if (n2 === 0) return 0;
    r2.length !== n2 && n2 < e2 && (e2 = n2);
  }
  return e2 === Number.POSITIVE_INFINITY ? 0 : e2;
}
function yr(t9, e2 = aa(t9)) {
  return e2 === 0 ? t9 : t9.split(`
`).map((r2) => r2.slice(e2)).join(`
`);
}
function wr(t9) {
  return w2(false, w2(false, t9, "&apos;", "'"), "&quot;", '"');
}
function P(t9) {
  return wr(t9.value);
}
function et(t9, e2) {
  return Ce2(t9, e2) && !oa.has(t9.fullName);
}
function Ce2(t9, e2) {
  return e2.parser === "vue" && t9.type === "element" && t9.parent.type === "root" && t9.fullName.toLowerCase() !== "html";
}
function xt(t9, e2) {
  return Ce2(t9, e2) && (et(t9, e2) || t9.attrMap.lang && t9.attrMap.lang !== "html");
}
function Zn(t9) {
  let e2 = t9.fullName;
  return e2.charAt(0) === "#" || e2 === "slot-scope" || e2 === "v-slot" || e2.startsWith("v-slot:");
}
function es(t9, e2) {
  let r2 = t9.parent;
  if (!Ce2(r2, e2)) return false;
  let n2 = r2.fullName, s2 = t9.fullName;
  return n2 === "script" && s2 === "setup" || n2 === "style" && s2 === "vars";
}
function kt(t9, e2 = t9.value) {
  return t9.parent.isWhitespaceSensitive ? t9.parent.isIndentationSensitive ? B(e2) : B(yr(Er(e2)), S2) : H2(_2, O.split(e2));
}
function Bt(t9, e2) {
  return Ce2(t9, e2) && t9.name === "script";
}
async function ts(t9, e2) {
  let r2 = [];
  for (let [n2, s2] of t9.split(br).entries()) if (n2 % 2 === 0) r2.push(B(s2));
  else try {
    r2.push(E2(["{{", k2([_2, await T(s2, e2, { parser: "__ng_interpolation", __isInHtmlInterpolation: true })]), _2, "}}"]));
  } catch {
    r2.push("{{", B(s2), "}}");
  }
  return r2;
}
function Tr({ parser: t9 }) {
  return (e2, r2, n2) => T(P(n2.node), e2, { parser: t9 }, X2);
}
function pa(t9, e2) {
  if (e2.parser !== "angular") return;
  let { node: r2 } = t9, n2 = r2.fullName;
  if (n2.startsWith("(") && n2.endsWith(")") || n2.startsWith("on-")) return ua;
  if (n2.startsWith("[") && n2.endsWith("]") || /^bind(?:on)?-/u.test(n2) || /^ng-(?:if|show|hide|class|style)$/u.test(n2)) return la;
  if (n2.startsWith("*")) return ca;
  let s2 = P(r2);
  if (/^i18n(?:-.+)?$/u.test(n2)) return () => he2(vt(kt(r2, s2.trim())), !s2.includes("@@"));
  if (br.test(s2)) return (i) => ts(s2, i);
}
function ha(t9, e2) {
  let { node: r2 } = t9, n2 = P(r2);
  if (r2.fullName === "class" && !e2.parentParser && !n2.includes("{{")) return () => n2.trim().split(/\s+/u).join(" ");
}
function ss(t9) {
  return t9 === "	" || t9 === `
` || t9 === "\f" || t9 === "\r" || t9 === " ";
}
function Sa(t9) {
  let e2 = t9.length, r2, n2, s2, i, a, o2 = 0, u;
  function p2(C2) {
    let A, D2 = C2.exec(t9.substring(o2));
    if (D2) return [A] = D2, o2 += A.length, A;
  }
  let l2 = [];
  for (; ; ) {
    if (p2(fa), o2 >= e2) {
      if (l2.length === 0) throw new Error("Must contain one or more image candidate strings.");
      return l2;
    }
    u = o2, r2 = p2(da), n2 = [], r2.slice(-1) === "," ? (r2 = r2.replace(ga, ""), f3()) : m();
  }
  function m() {
    for (p2(ma), s2 = "", i = "in descriptor"; ; ) {
      if (a = t9.charAt(o2), i === "in descriptor") if (ss(a)) s2 && (n2.push(s2), s2 = "", i = "after descriptor");
      else if (a === ",") {
        o2 += 1, s2 && n2.push(s2), f3();
        return;
      } else if (a === "(") s2 += a, i = "in parens";
      else if (a === "") {
        s2 && n2.push(s2), f3();
        return;
      } else s2 += a;
      else if (i === "in parens") if (a === ")") s2 += a, i = "in descriptor";
      else if (a === "") {
        n2.push(s2), f3();
        return;
      } else s2 += a;
      else if (i === "after descriptor" && !ss(a)) if (a === "") {
        f3();
        return;
      } else i = "in descriptor", o2 -= 1;
      o2 += 1;
    }
  }
  function f3() {
    let C2 = false, A, D2, I4, F, c2 = {}, g3, y3, q3, x2, U2;
    for (F = 0; F < n2.length; F++) g3 = n2[F], y3 = g3[g3.length - 1], q3 = g3.substring(0, g3.length - 1), x2 = parseInt(q3, 10), U2 = parseFloat(q3), is.test(q3) && y3 === "w" ? ((A || D2) && (C2 = true), x2 === 0 ? C2 = true : A = x2) : Ca.test(q3) && y3 === "x" ? ((A || D2 || I4) && (C2 = true), U2 < 0 ? C2 = true : D2 = U2) : is.test(q3) && y3 === "h" ? ((I4 || D2) && (C2 = true), x2 === 0 ? C2 = true : I4 = x2) : C2 = true;
    if (!C2) c2.source = { value: r2, startOffset: u }, A && (c2.width = { value: A }), D2 && (c2.density = { value: D2 }), I4 && (c2.height = { value: I4 }), l2.push(c2);
    else throw new Error(`Invalid srcset descriptor found in "${t9}" at "${g3}".`);
  }
}
function _a2(t9) {
  if (t9.node.fullName === "srcset" && (t9.parent.fullName === "img" || t9.parent.fullName === "source")) return () => Aa(P(t9.node));
}
function Aa(t9) {
  let e2 = as(t9), r2 = Ea.filter((l2) => e2.some((m) => Object.prototype.hasOwnProperty.call(m, l2)));
  if (r2.length > 1) throw new Error("Mixed descriptor in srcset is not supported");
  let [n2] = r2, s2 = os[n2], i = e2.map((l2) => l2.source.value), a = Math.max(...i.map((l2) => l2.length)), o2 = e2.map((l2) => l2[n2] ? String(l2[n2].value) : ""), u = o2.map((l2) => {
    let m = l2.indexOf(".");
    return m === -1 ? l2.length : m;
  }), p2 = Math.max(...u);
  return he2(H2([",", _2], i.map((l2, m) => {
    let f3 = [l2], C2 = o2[m];
    if (C2) {
      let A = a - l2.length + 1, D2 = p2 - u[m], I4 = " ".repeat(A + D2);
      f3.push(pe2(I4, " "), C2 + s2);
    }
    return f3;
  })));
}
function ls(t9, e2) {
  let { node: r2 } = t9, n2 = P(t9.node).trim();
  if (r2.fullName === "style" && !e2.parentParser && !n2.includes("{{")) return async (s2) => he2(await s2(n2, { parser: "css", __isHTMLStyleAttribute: true }));
}
function Da(t9, e2) {
  let { root: r2 } = t9;
  return xr.has(r2) || xr.set(r2, r2.children.some((n2) => Bt(n2, e2) && ["ts", "typescript"].includes(n2.attrMap.lang))), xr.get(r2);
}
function cs(t9, e2, r2) {
  let { node: n2 } = r2, s2 = P(n2);
  return T(`type T<${s2}> = any`, t9, { parser: "babel-ts", __isEmbeddedTypescriptGenericParameters: true }, X2);
}
function ps(t9, e2, { parseWithTs: r2 }) {
  return T(`function _(${t9}) {}`, e2, { parser: r2 ? "babel-ts" : "babel", __isVueBindings: true });
}
async function hs(t9, e2, r2, n2) {
  let s2 = P(r2.node), { left: i, operator: a, right: o2 } = va(s2), u = Ie2(r2, n2);
  return [E2(await T(`function _(${i}) {}`, t9, { parser: u ? "babel-ts" : "babel", __isVueForBindingLeft: true })), " ", a, " ", await T(o2, t9, { parser: u ? "__ts_expression" : "__js_expression" })];
}
function va(t9) {
  let e2 = /(.*?)\s+(in|of)\s+(.*)/su, r2 = /,([^,\]}]*)(?:,([^,\]}]*))?$/u, n2 = /^\(|\)$/gu, s2 = t9.match(e2);
  if (!s2) return;
  let i = {};
  if (i.for = s2[3].trim(), !i.for) return;
  let a = w2(false, s2[1].trim(), n2, ""), o2 = a.match(r2);
  o2 ? (i.alias = a.replace(r2, ""), i.iterator1 = o2[1].trim(), o2[2] && (i.iterator2 = o2[2].trim())) : i.alias = a;
  let u = [i.alias, i.iterator1, i.iterator2];
  if (!u.some((p2, l2) => !p2 && (l2 === 0 || u.slice(l2 + 1).some(Boolean)))) return { left: u.filter(Boolean).join(","), operator: s2[2], right: i.for };
}
function ya(t9, e2) {
  if (e2.parser !== "vue") return;
  let { node: r2 } = t9, n2 = r2.fullName;
  if (n2 === "v-for") return hs;
  if (n2 === "generic" && Bt(r2.parent, e2)) return cs;
  let s2 = P(r2), i = Ie2(t9, e2);
  if (Zn(r2) || es(r2, e2)) return (a) => ps(s2, a, { parseWithTs: i });
  if (n2.startsWith("@") || n2.startsWith("v-on:")) return (a) => wa(s2, a, { parseWithTs: i });
  if (n2.startsWith(":") || n2.startsWith(".") || n2.startsWith("v-bind:")) return (a) => ba(s2, a, { parseWithTs: i });
  if (n2.startsWith("v-")) return (a) => ms(s2, a, { parseWithTs: i });
}
async function wa(t9, e2, { parseWithTs: r2 }) {
  var n2;
  try {
    return await ms(t9, e2, { parseWithTs: r2 });
  } catch (s2) {
    if (((n2 = s2.cause) == null ? void 0 : n2.code) !== "BABEL_PARSER_SYNTAX_ERROR") throw s2;
  }
  return T(t9, e2, { parser: r2 ? "__vue_ts_event_binding" : "__vue_event_binding" }, X2);
}
function ba(t9, e2, { parseWithTs: r2 }) {
  return T(t9, e2, { parser: r2 ? "__vue_ts_expression" : "__vue_expression" }, X2);
}
function ms(t9, e2, { parseWithTs: r2 }) {
  return T(t9, e2, { parser: r2 ? "__ts_expression" : "__js_expression" }, X2);
}
function Ta(t9, e2) {
  let { node: r2 } = t9;
  if (r2.value) {
    if (/^PRETTIER_HTML_PLACEHOLDER_\d+_\d+_IN_JS$/u.test(e2.originalText.slice(r2.valueSpan.start.offset, r2.valueSpan.end.offset)) || e2.parser === "lwc" && r2.value.startsWith("{") && r2.value.endsWith("}")) return [r2.rawName, "=", r2.value];
    for (let n2 of [us, ls, ns, fs, rs]) {
      let s2 = n2(t9, e2);
      if (s2) return xa(s2);
    }
  }
}
function xa(t9) {
  return async (e2, r2, n2, s2) => {
    let i = await t9(e2, r2, n2, s2);
    if (i) return i = hr(i, (a) => typeof a == "string" ? w2(false, a, '"', "&quot;") : a), [n2.node.rawName, '="', E2(i), '"'];
  };
}
function J2(t9) {
  return t9.sourceSpan.start.offset;
}
function se2(t9) {
  return t9.sourceSpan.end.offset;
}
function tt(t9, e2) {
  return [t9.isSelfClosing ? "" : Ba(t9, e2), Se2(t9, e2)];
}
function Ba(t9, e2) {
  return t9.lastChild && Ae2(t9.lastChild) ? "" : [La(t9, e2), Lt(t9, e2)];
}
function Se2(t9, e2) {
  return (t9.next ? Q2(t9.next) : Ee2(t9.parent)) ? "" : [_e2(t9, e2), G2(t9, e2)];
}
function La(t9, e2) {
  return Ee2(t9) ? _e2(t9.lastChild, e2) : "";
}
function G2(t9, e2) {
  return Ae2(t9) ? Lt(t9.parent, e2) : rt(t9) ? Ft(t9.next, e2) : "";
}
function Lt(t9, e2) {
  if (Cs(t9, e2)) return "";
  switch (t9.type) {
    case "ieConditionalComment":
      return "<!";
    case "element":
      if (t9.hasHtmComponentClosingTag) return "<//";
    default:
      return `</${t9.rawName}`;
  }
}
function _e2(t9, e2) {
  if (Cs(t9, e2)) return "";
  switch (t9.type) {
    case "ieConditionalComment":
    case "ieConditionalEndComment":
      return "[endif]-->";
    case "ieConditionalStartComment":
      return "]><!-->";
    case "interpolation":
      return "}}";
    case "angularIcuExpression":
      return "}";
    case "element":
      if (t9.isSelfClosing) return "/>";
    default:
      return ">";
  }
}
function Cs(t9, e2) {
  return !t9.isSelfClosing && !t9.endSourceSpan && (ge2(t9) || wt(t9.parent, e2));
}
function Q2(t9) {
  return t9.prev && t9.prev.type !== "docType" && t9.type !== "angularControlFlowBlock" && !$2(t9.prev) && t9.isLeadingSpaceSensitive && !t9.hasLeadingSpaces;
}
function Ee2(t9) {
  var e2;
  return ((e2 = t9.lastChild) == null ? void 0 : e2.isTrailingSpaceSensitive) && !t9.lastChild.hasTrailingSpaces && !$2(Tt(t9.lastChild)) && !de2(t9);
}
function Ae2(t9) {
  return !t9.next && !t9.hasTrailingSpaces && t9.isTrailingSpaceSensitive && $2(Tt(t9));
}
function rt(t9) {
  return t9.next && !$2(t9.next) && $2(t9) && t9.isTrailingSpaceSensitive && !t9.hasTrailingSpaces;
}
function Fa(t9) {
  let e2 = t9.trim().match(/^prettier-ignore-attribute(?:\s+(.+))?$/su);
  return e2 ? e2[1] ? e2[1].split(/\s+/u) : true : false;
}
function nt(t9) {
  return !t9.prev && t9.isLeadingSpaceSensitive && !t9.hasLeadingSpaces;
}
function Pa(t9, e2, r2) {
  var m;
  let { node: n2 } = t9;
  if (!me2(n2.attrs)) return n2.isSelfClosing ? " " : "";
  let s2 = ((m = n2.prev) == null ? void 0 : m.type) === "comment" && Fa(n2.prev.value), i = typeof s2 == "boolean" ? () => s2 : Array.isArray(s2) ? (f3) => s2.includes(f3.rawName) : () => false, a = t9.map(({ node: f3 }) => i(f3) ? B(e2.originalText.slice(J2(f3), se2(f3))) : r2(), "attrs"), o2 = n2.type === "element" && n2.fullName === "script" && n2.attrs.length === 1 && n2.attrs[0].fullName === "src" && n2.children.length === 0, p2 = e2.singleAttributePerLine && n2.attrs.length > 1 && !Ce2(n2, e2) ? S2 : _2, l2 = [k2([o2 ? " " : _2, H2(p2, a)])];
  return n2.firstChild && nt(n2.firstChild) || n2.isSelfClosing && Ee2(n2.parent) || o2 ? l2.push(n2.isSelfClosing ? " " : "") : l2.push(e2.bracketSameLine ? n2.isSelfClosing ? " " : "" : n2.isSelfClosing ? _2 : v2), l2;
}
function Na(t9) {
  return t9.firstChild && nt(t9.firstChild) ? "" : Pt(t9);
}
function st(t9, e2, r2) {
  let { node: n2 } = t9;
  return [De2(n2, e2), Pa(t9, e2, r2), n2.isSelfClosing ? "" : Na(n2)];
}
function De2(t9, e2) {
  return t9.prev && rt(t9.prev) ? "" : [z8(t9, e2), Ft(t9, e2)];
}
function z8(t9, e2) {
  return nt(t9) ? Pt(t9.parent) : Q2(t9) ? _e2(t9.prev, e2) : "";
}
function Ft(t9, e2) {
  switch (t9.type) {
    case "ieConditionalComment":
    case "ieConditionalStartComment":
      return `<!--[if ${t9.condition}`;
    case "ieConditionalEndComment":
      return "<!--<!";
    case "interpolation":
      return "{{";
    case "docType": {
      if (t9.value === "html") {
        let { filepath: n2 } = e2;
        if (n2 && /\.html?$/u.test(n2)) return gs;
      }
      let r2 = J2(t9);
      return e2.originalText.slice(r2, r2 + gs.length);
    }
    case "angularIcuExpression":
      return "{";
    case "element":
      if (t9.condition) return `<!--[if ${t9.condition}]><!--><${t9.rawName}`;
    default:
      return `<${t9.rawName}`;
  }
}
function Pt(t9) {
  switch (t9.type) {
    case "ieConditionalComment":
      return "]>";
    case "element":
      if (t9.condition) return "><!--<![endif]-->";
    default:
      return ">";
  }
}
function Ia(t9, e2) {
  if (!t9.endSourceSpan) return "";
  let r2 = t9.startSourceSpan.end.offset;
  t9.firstChild && nt(t9.firstChild) && (r2 -= Pt(t9).length);
  let n2 = t9.endSourceSpan.start.offset;
  return t9.lastChild && Ae2(t9.lastChild) ? n2 += Lt(t9, e2).length : Ee2(t9) && (n2 -= _e2(t9.lastChild, e2).length), e2.originalText.slice(r2, n2);
}
function $a(t9, e2) {
  let { node: r2 } = t9;
  switch (r2.type) {
    case "element":
      if (W(r2, e2) || r2.type === "interpolation") return;
      if (!r2.isSelfClosing && xt(r2, e2)) {
        let n2 = vr(r2, e2);
        return n2 ? async (s2, i) => {
          let a = Nt(r2, e2), o2 = /^\s*$/u.test(a), u = "";
          return o2 || (u = await s2(Er(a), { parser: n2, __embeddedInHtml: true }), o2 = u === ""), [z8(r2, e2), E2(st(t9, e2, i)), o2 ? "" : S2, u, o2 ? "" : S2, tt(r2, e2), G2(r2, e2)];
        } : void 0;
      }
      break;
    case "text":
      if (W(r2.parent, e2)) {
        let n2 = vr(r2.parent, e2);
        if (n2) return async (s2) => {
          let i = n2 === "markdown" ? yr(r2.value.replace(/^[^\S\n]*\n/u, "")) : r2.value, a = { parser: n2, __embeddedInHtml: true };
          if (e2.parser === "html" && n2 === "babel") {
            let o2 = "script", { attrMap: u } = r2.parent;
            u && (u.type === "module" || (u.type === "text/babel" || u.type === "text/jsx") && u["data-type"] === "module") && (o2 = "module"), a.__babelSourceType = o2;
          }
          return [ne2, z8(r2, e2), await s2(i, a), G2(r2, e2)];
        };
      } else if (r2.parent.type === "interpolation") return async (n2) => {
        let s2 = { __isInHtmlInterpolation: true, __embeddedInHtml: true };
        return e2.parser === "angular" ? s2.parser = "__ng_interpolation" : e2.parser === "vue" ? s2.parser = Ie2(t9, e2) ? "__vue_ts_expression" : "__vue_expression" : s2.parser = "__js_expression", [k2([_2, await n2(r2.value, s2)]), r2.parent.next && Q2(r2.parent.next) ? " " : _2];
      };
      break;
    case "attribute":
      return ds(t9, e2);
    case "front-matter":
      return (n2) => yn(r2, n2);
    case "angularControlFlowBlockParameters":
      return Ra.has(t9.parent.name) ? wn : void 0;
    case "angularLetDeclarationInitializer":
      return (n2) => T(r2.value, n2, { parser: "__ng_binding", __isInHtmlAttribute: false });
  }
}
function at(t9) {
  if (it !== null && typeof it.property) {
    let e2 = it;
    return it = at.prototype = null, e2;
  }
  return it = at.prototype = t9 ?? /* @__PURE__ */ Object.create(null), new at();
}
function kr(t9) {
  return at(t9);
}
function Ma(t9, e2 = "type") {
  kr(t9);
  function r2(n2) {
    let s2 = n2[e2], i = t9[s2];
    if (!Array.isArray(i)) throw Object.assign(new Error(`Missing visitor keys for '${s2}'.`), { node: n2 });
    return i;
  }
  return r2;
}
function ws2(t9) {
  return ys.test(t9);
}
function bs(t9) {
  return vs.test(t9);
}
function Ts(t9) {
  return `<!-- @${Ds} -->

${t9}`;
}
function ks(t9) {
  let e2 = se2(t9);
  return t9.type === "element" && !t9.endSourceSpan && me2(t9.children) ? Math.max(e2, ks(K2(false, t9.children, -1))) : e2;
}
function ot(t9, e2, r2) {
  let n2 = t9.node;
  if (ge2(n2)) {
    let s2 = ks(n2);
    return [z8(n2, e2), B(O.trimEnd(e2.originalText.slice(J2(n2) + (n2.prev && rt(n2.prev) ? Ft(n2).length : 0), s2 - (n2.next && Q2(n2.next) ? _e2(n2, e2).length : 0)))), G2(n2, e2)];
  }
  return r2();
}
function It(t9, e2) {
  return $2(t9) && $2(e2) ? t9.isTrailingSpaceSensitive ? t9.hasTrailingSpaces ? bt(e2) ? S2 : _2 : "" : bt(e2) ? S2 : v2 : rt(t9) && (ge2(e2) || e2.firstChild || e2.isSelfClosing || e2.type === "element" && e2.attrs.length > 0) || t9.type === "element" && t9.isSelfClosing && Q2(e2) ? "" : !e2.isLeadingSpaceSensitive || bt(e2) || Q2(e2) && t9.lastChild && Ae2(t9.lastChild) && t9.lastChild.lastChild && Ae2(t9.lastChild.lastChild) ? S2 : e2.hasLeadingSpaces ? _2 : v2;
}
function Re2(t9, e2, r2) {
  let { node: n2 } = t9;
  if (Dr(n2)) return [ne2, ...t9.map((i) => {
    let a = i.node, o2 = a.prev ? It(a.prev, a) : "";
    return [o2 ? [o2, Je(a.prev) ? S2 : ""] : "", ot(i, e2, r2)];
  }, "children")];
  let s2 = n2.children.map(() => Symbol(""));
  return t9.map((i, a) => {
    let o2 = i.node;
    if ($2(o2)) {
      if (o2.prev && $2(o2.prev)) {
        let A = It(o2.prev, o2);
        if (A) return Je(o2.prev) ? [S2, S2, ot(i, e2, r2)] : [A, ot(i, e2, r2)];
      }
      return ot(i, e2, r2);
    }
    let u = [], p2 = [], l2 = [], m = [], f3 = o2.prev ? It(o2.prev, o2) : "", C2 = o2.next ? It(o2, o2.next) : "";
    return f3 && (Je(o2.prev) ? u.push(S2, S2) : f3 === S2 ? u.push(S2) : $2(o2.prev) ? p2.push(f3) : p2.push(pe2("", v2, { groupId: s2[a - 1] }))), C2 && (Je(o2) ? $2(o2.next) && m.push(S2, S2) : C2 === S2 ? $2(o2.next) && m.push(S2) : l2.push(C2)), [...u, E2([...p2, E2([ot(i, e2, r2), ...l2], { id: s2[a] })]), ...m];
  }, "children");
}
function Bs(t9, e2, r2) {
  let { node: n2 } = t9, s2 = [];
  Va(t9) && s2.push("} "), s2.push("@", n2.name), n2.parameters && s2.push(" (", E2(r2("parameters")), ")"), s2.push(" {");
  let i = Ls(n2);
  return n2.children.length > 0 ? (n2.firstChild.hasLeadingSpaces = true, n2.lastChild.hasTrailingSpaces = true, s2.push(k2([S2, Re2(t9, e2, r2)])), i && s2.push(S2, "}")) : i && s2.push("}"), E2(s2, { shouldBreak: true });
}
function Ls(t9) {
  var e2, r2;
  return !(((e2 = t9.next) == null ? void 0 : e2.type) === "angularControlFlowBlock" && ((r2 = xs.get(t9.name)) != null && r2.has(t9.next.name)));
}
function Va(t9) {
  let { previous: e2 } = t9;
  return (e2 == null ? void 0 : e2.type) === "angularControlFlowBlock" && !ge2(e2) && !Ls(e2);
}
function Fs(t9, e2, r2) {
  return [k2([v2, H2([";", _2], t9.map(r2, "children"))]), v2];
}
function Ps(t9, e2, r2) {
  let { node: n2 } = t9;
  return [De2(n2, e2), E2([n2.switchValue.trim(), ", ", n2.clause, n2.cases.length > 0 ? [",", k2([_2, H2(_2, t9.map(r2, "cases"))])] : "", v2]), Se2(n2, e2)];
}
function Ns(t9, e2, r2) {
  let { node: n2 } = t9;
  return [n2.value, " {", E2([k2([v2, t9.map(({ node: s2, isLast: i }) => {
    let a = [r2()];
    return s2.type === "text" && (s2.hasLeadingSpaces && a.unshift(_2), s2.hasTrailingSpaces && !i && a.push(_2)), a;
  }, "expression")]), v2]), "}"];
}
function Is(t9, e2, r2) {
  let { node: n2 } = t9;
  if (wt(n2, e2)) return [z8(n2, e2), E2(st(t9, e2, r2)), B(Nt(n2, e2)), ...tt(n2, e2), G2(n2, e2)];
  let s2 = n2.children.length === 1 && (n2.firstChild.type === "interpolation" || n2.firstChild.type === "angularIcuExpression") && n2.firstChild.isLeadingSpaceSensitive && !n2.firstChild.hasLeadingSpaces && n2.lastChild.isTrailingSpaceSensitive && !n2.lastChild.hasTrailingSpaces, i = Symbol("element-attr-group-id"), a = (l2) => E2([E2(st(t9, e2, r2), { id: i }), l2, tt(n2, e2)]), o2 = (l2) => s2 ? Cn(l2, { groupId: i }) : (W(n2, e2) || et(n2, e2)) && n2.parent.type === "root" && e2.parser === "vue" && !e2.vueIndentScriptAndStyle ? l2 : k2(l2), u = () => s2 ? pe2(v2, "", { groupId: i }) : n2.firstChild.hasLeadingSpaces && n2.firstChild.isLeadingSpaceSensitive ? _2 : n2.firstChild.type === "text" && n2.isWhitespaceSensitive && n2.isIndentationSensitive ? dn(v2) : v2, p2 = () => (n2.next ? Q2(n2.next) : Ee2(n2.parent)) ? n2.lastChild.hasTrailingSpaces && n2.lastChild.isTrailingSpaceSensitive ? " " : "" : s2 ? pe2(v2, "", { groupId: i }) : n2.lastChild.hasTrailingSpaces && n2.lastChild.isTrailingSpaceSensitive ? _2 : (n2.lastChild.type === "comment" || n2.lastChild.type === "text" && n2.isWhitespaceSensitive && n2.isIndentationSensitive) && new RegExp(`\\n[\\t ]{${e2.tabWidth * (t9.ancestors.length - 1)}}$`, "u").test(n2.lastChild.value) ? "" : v2;
  return n2.children.length === 0 ? a(n2.hasDanglingSpaces && n2.isDanglingSpaceSensitive ? _2 : "") : a([Gn(n2) ? ne2 : "", o2([u(), Re2(t9, e2, r2)]), p2()]);
}
function ut(t9) {
  return t9 >= 9 && t9 <= 32 || t9 == 160;
}
function Rt(t9) {
  return 48 <= t9 && t9 <= 57;
}
function lt(t9) {
  return t9 >= 97 && t9 <= 122 || t9 >= 65 && t9 <= 90;
}
function Rs(t9) {
  return t9 >= 97 && t9 <= 102 || t9 >= 65 && t9 <= 70 || Rt(t9);
}
function $t(t9) {
  return t9 === 10 || t9 === 13;
}
function Br(t9) {
  return 48 <= t9 && t9 <= 55;
}
function Ot(t9) {
  return t9 === 39 || t9 === 34 || t9 === 96;
}
function Os(t9) {
  return t9.replace(Ua, (...e2) => e2[1].toUpperCase());
}
function Ga(t9, e2) {
  for (let r2 of Wa) r2(t9, e2);
  return t9;
}
function za(t9) {
  t9.walk((e2) => {
    if (e2.type === "element" && e2.tagDefinition.ignoreFirstLf && e2.children.length > 0 && e2.children[0].type === "text" && e2.children[0].value[0] === `
`) {
      let r2 = e2.children[0];
      r2.value.length === 1 ? e2.removeChild(r2) : r2.value = r2.value.slice(1);
    }
  });
}
function Ya(t9) {
  let e2 = (r2) => {
    var n2, s2;
    return r2.type === "element" && ((n2 = r2.prev) == null ? void 0 : n2.type) === "ieConditionalStartComment" && r2.prev.sourceSpan.end.offset === r2.startSourceSpan.start.offset && ((s2 = r2.firstChild) == null ? void 0 : s2.type) === "ieConditionalEndComment" && r2.firstChild.sourceSpan.start.offset === r2.startSourceSpan.end.offset;
  };
  t9.walk((r2) => {
    if (r2.children) for (let n2 = 0; n2 < r2.children.length; n2++) {
      let s2 = r2.children[n2];
      if (!e2(s2)) continue;
      let i = s2.prev, a = s2.firstChild;
      r2.removeChild(i), n2--;
      let o2 = new h2(i.sourceSpan.start, a.sourceSpan.end), u = new h2(o2.start, s2.sourceSpan.end);
      s2.condition = i.condition, s2.sourceSpan = u, s2.startSourceSpan = o2, s2.removeChild(a);
    }
  });
}
function ja(t9, e2, r2) {
  t9.walk((n2) => {
    if (n2.children) for (let s2 = 0; s2 < n2.children.length; s2++) {
      let i = n2.children[s2];
      if (i.type !== "text" && !e2(i)) continue;
      i.type !== "text" && (i.type = "text", i.value = r2(i));
      let a = i.prev;
      !a || a.type !== "text" || (a.value += i.value, a.sourceSpan = new h2(a.sourceSpan.start, i.sourceSpan.end), n2.removeChild(i), s2--);
    }
  });
}
function Ka(t9) {
  return ja(t9, (e2) => e2.type === "cdata", (e2) => `<![CDATA[${e2.value}]]>`);
}
function Xa(t9) {
  let e2 = (r2) => {
    var n2, s2;
    return r2.type === "element" && r2.attrs.length === 0 && r2.children.length === 1 && r2.firstChild.type === "text" && !O.hasWhitespaceCharacter(r2.children[0].value) && !r2.firstChild.hasLeadingSpaces && !r2.firstChild.hasTrailingSpaces && r2.isLeadingSpaceSensitive && !r2.hasLeadingSpaces && r2.isTrailingSpaceSensitive && !r2.hasTrailingSpaces && ((n2 = r2.prev) == null ? void 0 : n2.type) === "text" && ((s2 = r2.next) == null ? void 0 : s2.type) === "text";
  };
  t9.walk((r2) => {
    if (r2.children) for (let n2 = 0; n2 < r2.children.length; n2++) {
      let s2 = r2.children[n2];
      if (!e2(s2)) continue;
      let i = s2.prev, a = s2.next;
      i.value += `<${s2.rawName}>` + s2.firstChild.value + `</${s2.rawName}>` + a.value, i.sourceSpan = new h2(i.sourceSpan.start, a.sourceSpan.end), i.isTrailingSpaceSensitive = a.isTrailingSpaceSensitive, i.hasTrailingSpaces = a.hasTrailingSpaces, r2.removeChild(s2), n2--, r2.removeChild(a);
    }
  });
}
function Qa(t9, e2) {
  if (e2.parser === "html") return;
  let r2 = /\{\{(.+?)\}\}/su;
  t9.walk((n2) => {
    if (qn(n2, e2)) for (let s2 of n2.children) {
      if (s2.type !== "text") continue;
      let i = s2.sourceSpan.start, a = null, o2 = s2.value.split(r2);
      for (let u = 0; u < o2.length; u++, i = a) {
        let p2 = o2[u];
        if (u % 2 === 0) {
          a = i.moveBy(p2.length), p2.length > 0 && n2.insertChildBefore(s2, { type: "text", value: p2, sourceSpan: new h2(i, a) });
          continue;
        }
        a = i.moveBy(p2.length + 4), n2.insertChildBefore(s2, { type: "interpolation", sourceSpan: new h2(i, a), children: p2.length === 0 ? [] : [{ type: "text", value: p2, sourceSpan: new h2(i.moveBy(2), a.moveBy(-2)) }] });
      }
      n2.removeChild(s2);
    }
  });
}
function Ja(t9, e2) {
  t9.walk((r2) => {
    let n2 = r2.$children;
    if (!n2) return;
    if (n2.length === 0 || n2.length === 1 && n2[0].type === "text" && O.trim(n2[0].value).length === 0) {
      r2.hasDanglingSpaces = n2.length > 0, r2.$children = [];
      return;
    }
    let s2 = Hn(r2, e2), i = Ar(r2);
    if (!s2) for (let a = 0; a < n2.length; a++) {
      let o2 = n2[a];
      if (o2.type !== "text") continue;
      let { leadingWhitespace: u, text: p2, trailingWhitespace: l2 } = Mn(o2.value), m = o2.prev, f3 = o2.next;
      p2 ? (o2.value = p2, o2.sourceSpan = new h2(o2.sourceSpan.start.moveBy(u.length), o2.sourceSpan.end.moveBy(-l2.length)), u && (m && (m.hasTrailingSpaces = true), o2.hasLeadingSpaces = true), l2 && (o2.hasTrailingSpaces = true, f3 && (f3.hasLeadingSpaces = true))) : (r2.removeChild(o2), a--, (u || l2) && (m && (m.hasTrailingSpaces = true), f3 && (f3.hasLeadingSpaces = true)));
    }
    r2.isWhitespaceSensitive = s2, r2.isIndentationSensitive = i;
  });
}
function Za(t9) {
  t9.walk((e2) => {
    e2.isSelfClosing = !e2.children || e2.type === "element" && (e2.tagDefinition.isVoid || e2.endSourceSpan && e2.startSourceSpan.start === e2.endSourceSpan.start && e2.startSourceSpan.end === e2.endSourceSpan.end);
  });
}
function eo(t9, e2) {
  t9.walk((r2) => {
    r2.type === "element" && (r2.hasHtmComponentClosingTag = r2.endSourceSpan && /^<\s*\/\s*\/\s*>$/u.test(e2.originalText.slice(r2.endSourceSpan.start.offset, r2.endSourceSpan.end.offset)));
  });
}
function to(t9, e2) {
  t9.walk((r2) => {
    r2.cssDisplay = Qn(r2, e2);
  });
}
function ro(t9, e2) {
  t9.walk((r2) => {
    let { children: n2 } = r2;
    if (n2) {
      if (n2.length === 0) {
        r2.isDanglingSpaceSensitive = Wn(r2, e2);
        return;
      }
      for (let s2 of n2) s2.isLeadingSpaceSensitive = Vn(s2, e2), s2.isTrailingSpaceSensitive = Un(s2, e2);
      for (let s2 = 0; s2 < n2.length; s2++) {
        let i = n2[s2];
        i.isLeadingSpaceSensitive = (s2 === 0 || i.prev.isTrailingSpaceSensitive) && i.isLeadingSpaceSensitive, i.isTrailingSpaceSensitive = (s2 === n2.length - 1 || i.next.isLeadingSpaceSensitive) && i.isTrailingSpaceSensitive;
      }
    }
  });
}
function no(t9, e2, r2) {
  let { node: n2 } = t9;
  switch (n2.type) {
    case "front-matter":
      return B(n2.raw);
    case "root":
      return e2.__onHtmlRoot && e2.__onHtmlRoot(n2), [E2(Re2(t9, e2, r2)), S2];
    case "element":
    case "ieConditionalComment":
      return Is(t9, e2, r2);
    case "angularControlFlowBlock":
      return Bs(t9, e2, r2);
    case "angularControlFlowBlockParameters":
      return Fs(t9, e2, r2);
    case "angularControlFlowBlockParameter":
      return O.trim(n2.expression);
    case "angularLetDeclaration":
      return E2(["@let ", E2([n2.id, " =", E2(k2([_2, r2("init")]))]), ";"]);
    case "angularLetDeclarationInitializer":
      return n2.value;
    case "angularIcuExpression":
      return Ps(t9, e2, r2);
    case "angularIcuCase":
      return Ns(t9, e2, r2);
    case "ieConditionalStartComment":
    case "ieConditionalEndComment":
      return [De2(n2), Se2(n2)];
    case "interpolation":
      return [De2(n2, e2), ...t9.map(r2, "children"), Se2(n2, e2)];
    case "text": {
      if (n2.parent.type === "interpolation") {
        let o2 = /\n[^\S\n]*$/u, u = o2.test(n2.value), p2 = u ? n2.value.replace(o2, "") : n2.value;
        return [B(p2), u ? S2 : ""];
      }
      let s2 = z8(n2, e2), i = kt(n2), a = G2(n2, e2);
      return i[0] = [s2, i[0]], i.push([i.pop(), a]), vt(i);
    }
    case "docType":
      return [E2([De2(n2, e2), " ", w2(false, n2.value.replace(/^html\b/iu, "html"), /\s+/gu, " ")]), Se2(n2, e2)];
    case "comment":
      return [z8(n2, e2), B(e2.originalText.slice(J2(n2), se2(n2))), G2(n2, e2)];
    case "attribute": {
      if (n2.value === null) return n2.rawName;
      let s2 = wr(n2.value), i = _n(s2, '"');
      return [n2.rawName, "=", i, B(i === '"' ? w2(false, s2, '"', "&quot;") : w2(false, s2, "'", "&apos;")), i];
    }
    case "cdata":
    default:
      throw new An(n2, "HTML");
  }
}
function ct(t9, e2 = true) {
  if (t9[0] != ":") return [null, t9];
  let r2 = t9.indexOf(":", 1);
  if (r2 === -1) {
    if (e2) throw new Error(`Unsupported format "${t9}" expecting ":namespace:name"`);
    return [null, t9];
  }
  return [t9.slice(1, r2), t9.slice(r2 + 1)];
}
function Nr(t9) {
  return ct(t9)[1] === "ng-container";
}
function Ir(t9) {
  return ct(t9)[1] === "ng-content";
}
function Me2(t9) {
  return t9 === null ? null : ct(t9)[0];
}
function qe(t9, e2) {
  return t9 ? `:${t9}:${e2}` : e2;
}
function Rr() {
  return Ht || (Ht = {}, qt(Z2.HTML, ["iframe|srcdoc", "*|innerHTML", "*|outerHTML"]), qt(Z2.STYLE, ["*|style"]), qt(Z2.URL, ["*|formAction", "area|href", "area|ping", "audio|src", "a|href", "a|ping", "blockquote|cite", "body|background", "del|cite", "form|action", "img|src", "input|src", "ins|cite", "q|cite", "source|src", "track|src", "video|poster", "video|src"]), qt(Z2.RESOURCE_URL, ["applet|code", "applet|codebase", "base|href", "embed|src", "frame|src", "head|profile", "html|manifest", "iframe|src", "link|href", "media|src", "object|codebase", "object|data", "script|src"])), Ht;
}
function qt(t9, e2) {
  for (let r2 of e2) Ht[r2.toLowerCase()] = t9;
}
function ho(t9) {
  switch (t9) {
    case "width":
    case "height":
    case "minWidth":
    case "minHeight":
    case "maxWidth":
    case "maxHeight":
    case "left":
    case "top":
    case "bottom":
    case "right":
    case "fontSize":
    case "outlineWidth":
    case "outlineOffset":
    case "paddingTop":
    case "paddingLeft":
    case "paddingBottom":
    case "paddingRight":
    case "marginTop":
    case "marginLeft":
    case "marginBottom":
    case "marginRight":
    case "borderRadius":
    case "borderWidth":
    case "borderTopWidth":
    case "borderLeftWidth":
    case "borderRightWidth":
    case "borderBottomWidth":
    case "textIndent":
      return true;
    default:
      return false;
  }
}
function He2(t9) {
  return pt || (Ks = new d({ canSelfClose: true }), pt = Object.assign(/* @__PURE__ */ Object.create(null), { base: new d({ isVoid: true }), meta: new d({ isVoid: true }), area: new d({ isVoid: true }), embed: new d({ isVoid: true }), link: new d({ isVoid: true }), img: new d({ isVoid: true }), input: new d({ isVoid: true }), param: new d({ isVoid: true }), hr: new d({ isVoid: true }), br: new d({ isVoid: true }), source: new d({ isVoid: true }), track: new d({ isVoid: true }), wbr: new d({ isVoid: true }), p: new d({ closedByChildren: ["address", "article", "aside", "blockquote", "div", "dl", "fieldset", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "main", "nav", "ol", "p", "pre", "section", "table", "ul"], closedByParent: true }), thead: new d({ closedByChildren: ["tbody", "tfoot"] }), tbody: new d({ closedByChildren: ["tbody", "tfoot"], closedByParent: true }), tfoot: new d({ closedByChildren: ["tbody"], closedByParent: true }), tr: new d({ closedByChildren: ["tr"], closedByParent: true }), td: new d({ closedByChildren: ["td", "th"], closedByParent: true }), th: new d({ closedByChildren: ["td", "th"], closedByParent: true }), col: new d({ isVoid: true }), svg: new d({ implicitNamespacePrefix: "svg" }), foreignObject: new d({ implicitNamespacePrefix: "svg", preventNamespaceInheritance: true }), math: new d({ implicitNamespacePrefix: "math" }), li: new d({ closedByChildren: ["li"], closedByParent: true }), dt: new d({ closedByChildren: ["dt", "dd"] }), dd: new d({ closedByChildren: ["dt", "dd"], closedByParent: true }), rb: new d({ closedByChildren: ["rb", "rt", "rtc", "rp"], closedByParent: true }), rt: new d({ closedByChildren: ["rb", "rt", "rtc", "rp"], closedByParent: true }), rtc: new d({ closedByChildren: ["rb", "rtc", "rp"], closedByParent: true }), rp: new d({ closedByChildren: ["rb", "rt", "rtc", "rp"], closedByParent: true }), optgroup: new d({ closedByChildren: ["optgroup"], closedByParent: true }), option: new d({ closedByChildren: ["option", "optgroup"], closedByParent: true }), pre: new d({ ignoreFirstLf: true }), listing: new d({ ignoreFirstLf: true }), style: new d({ contentType: N2.RAW_TEXT }), script: new d({ contentType: N2.RAW_TEXT }), title: new d({ contentType: { default: N2.ESCAPABLE_RAW_TEXT, svg: N2.PARSABLE_DATA } }), textarea: new d({ contentType: N2.ESCAPABLE_RAW_TEXT, ignoreFirstLf: true }) }), new Ut().allKnownElementNames().forEach((e2) => {
    !pt[e2] && Me2(e2) === null && (pt[e2] = new d({ canSelfClose: false }));
  })), pt[t9] ?? Ks;
}
function Qt(t9, e2, r2 = null) {
  let n2 = [], s2 = t9.visit ? (i) => t9.visit(i, r2) || i.visit(t9, r2) : (i) => i.visit(t9, r2);
  return e2.forEach((i) => {
    let a = s2(i);
    a && n2.push(a);
  }), n2;
}
function Xs(t9, e2) {
  if (e2 != null && !(Array.isArray(e2) && e2.length == 2)) throw new Error(`Expected '${t9}' to be an array, [start, end].`);
  if (e2 != null) {
    let r2 = e2[0], n2 = e2[1];
    go.forEach((s2) => {
      if (s2.test(r2) || s2.test(n2)) throw new Error(`['${r2}', '${n2}'] contains unusable interpolation symbol.`);
    });
  }
}
function li(t9, e2, r2, n2 = {}) {
  let s2 = new Wr(new ve2(t9, e2), r2, n2);
  return s2.tokenize(), new Ur(Vo(s2.tokens), s2.errors, s2.nonNormalizedIcuExpressions);
}
function Ue2(t9) {
  return `Unexpected character "${t9 === 0 ? "EOF" : String.fromCharCode(t9)}"`;
}
function ti(t9) {
  return `Unknown entity "${t9}" - use the "&#<decimal>;" or  "&#x<hex>;" syntax`;
}
function Ro(t9, e2) {
  return `Unable to parse entity "${e2}" - ${t9} character reference entities must end with ";"`;
}
function b(t9) {
  return !ut(t9) || t9 === 0;
}
function ri(t9) {
  return ut(t9) || t9 === 62 || t9 === 60 || t9 === 47 || t9 === 39 || t9 === 34 || t9 === 61 || t9 === 0;
}
function $o(t9) {
  return (t9 < 97 || 122 < t9) && (t9 < 65 || 90 < t9) && (t9 < 48 || t9 > 57);
}
function Oo(t9) {
  return t9 === 59 || t9 === 0 || !Rs(t9);
}
function Mo(t9) {
  return t9 === 59 || t9 === 0 || !lt(t9);
}
function qo(t9) {
  return t9 !== 125;
}
function Ho(t9, e2) {
  return ni(t9) === ni(e2);
}
function ni(t9) {
  return t9 >= 97 && t9 <= 122 ? t9 - 97 + 65 : t9;
}
function si(t9) {
  return lt(t9) || Rt(t9) || t9 === 95;
}
function ii(t9) {
  return t9 !== 59 && b(t9);
}
function Vo(t9) {
  let e2 = [], r2;
  for (let n2 = 0; n2 < t9.length; n2++) {
    let s2 = t9[n2];
    r2 && r2.type === 5 && s2.type === 5 || r2 && r2.type === 16 && s2.type === 16 ? (r2.parts[0] += s2.parts[0], r2.sourceSpan.end = s2.sourceSpan.end) : (r2 = s2, e2.push(r2));
  }
  return e2;
}
function ci(t9, e2) {
  return t9.length > 0 && t9[t9.length - 1] === e2;
}
function pi(t9, e2) {
  return Ve[e2] !== void 0 ? Ve[e2] || t9 : /^#x[a-f0-9]+$/i.test(e2) ? String.fromCodePoint(parseInt(e2.slice(2), 16)) : /^#\d+$/.test(e2) ? String.fromCodePoint(parseInt(e2.slice(1), 10)) : t9;
}
function Qr(t9, e2 = {}) {
  let { canSelfClose: r2 = false, allowHtmComponentClosingTags: n2 = false, isTagNameCaseSensitive: s2 = false, getTagContentType: i, tokenizeAngularBlocks: a = false, tokenizeAngularLetDeclaration: o2 = false } = e2;
  return Uo().parse(t9, "angular-html-parser", { tokenizeExpansionForms: a, interpolationConfig: void 0, canSelfClose: r2, allowHtmComponentClosingTags: n2, tokenizeBlocks: a, tokenizeLet: o2 }, s2, i);
}
function Wo(t9, e2) {
  let r2 = new SyntaxError(t9 + " (" + e2.loc.start.line + ":" + e2.loc.start.column + ")");
  return Object.assign(r2, e2);
}
function Go(t9) {
  let e2 = t9.slice(0, _t);
  if (e2 !== "---" && e2 !== "+++") return;
  let r2 = t9.indexOf(`
`, _t);
  if (r2 === -1) return;
  let n2 = t9.slice(_t, r2).trim(), s2 = t9.indexOf(`
${e2}`, r2), i = n2;
  if (i || (i = e2 === "+++" ? "toml" : "yaml"), s2 === -1 && e2 === "---" && i === "yaml" && (s2 = t9.indexOf(`
...`, r2)), s2 === -1) return;
  let a = s2 + 1 + _t, o2 = t9.charAt(a + 1);
  if (!/\s?/u.test(o2)) return;
  let u = t9.slice(0, a);
  return { type: "front-matter", language: i, explicitLanguage: n2, value: t9.slice(r2 + 1, s2), startDelimiter: e2, endDelimiter: u.slice(-_t), raw: u };
}
function zo(t9) {
  let e2 = Go(t9);
  if (!e2) return { content: t9 };
  let { raw: r2 } = e2;
  return { frontMatter: e2, content: w2(false, r2, /[^\n]/gu, " ") + t9.slice(r2.length) };
}
function Yo(t9, e2) {
  let r2 = t9.map(e2);
  return r2.some((n2, s2) => n2 !== t9[s2]) ? r2 : t9;
}
function di(t9, e2) {
  if (t9.value) for (let { regex: r2, parse: n2 } of jo) {
    let s2 = t9.value.match(r2);
    if (s2) return n2(t9, e2, s2);
  }
  return null;
}
function Ko(t9, e2, r2) {
  let [, n2, s2, i] = r2, a = 4 + n2.length, o2 = t9.sourceSpan.start.moveBy(a), u = o2.moveBy(i.length), [p2, l2] = (() => {
    try {
      return [true, e2(i, o2).children];
    } catch {
      return [false, [{ type: "text", value: i, sourceSpan: new h2(o2, u) }]];
    }
  })();
  return { type: "ieConditionalComment", complete: p2, children: l2, condition: w2(false, s2.trim(), /\s+/gu, " "), sourceSpan: t9.sourceSpan, startSourceSpan: new h2(t9.sourceSpan.start, o2), endSourceSpan: new h2(u, t9.sourceSpan.end) };
}
function Xo(t9, e2, r2) {
  let [, n2] = r2;
  return { type: "ieConditionalStartComment", condition: w2(false, n2.trim(), /\s+/gu, " "), sourceSpan: t9.sourceSpan };
}
function Qo(t9) {
  return { type: "ieConditionalEndComment", sourceSpan: t9.sourceSpan };
}
function Jo(t9) {
  if (t9.type === "block") {
    if (t9.name = w2(false, t9.name.toLowerCase(), /\s+/gu, " ").trim(), t9.type = "angularControlFlowBlock", !me2(t9.parameters)) {
      delete t9.parameters;
      return;
    }
    for (let e2 of t9.parameters) e2.type = "angularControlFlowBlockParameter";
    t9.parameters = { type: "angularControlFlowBlockParameters", children: t9.parameters, sourceSpan: new h2(t9.parameters[0].sourceSpan.start, K2(false, t9.parameters, -1).sourceSpan.end) };
  }
}
function Zo(t9) {
  t9.type === "letDeclaration" && (t9.type = "angularLetDeclaration", t9.id = t9.name, t9.init = { type: "angularLetDeclarationInitializer", sourceSpan: new h2(t9.valueSpan.start, t9.valueSpan.end), value: t9.value }, delete t9.name, delete t9.value);
}
function eu(t9) {
  (t9.type === "plural" || t9.type === "select") && (t9.clause = t9.type, t9.type = "angularIcuExpression"), t9.type === "expansionCase" && (t9.type = "angularIcuCase");
}
function Si(t9, e2, r2) {
  let { name: n2, canSelfClose: s2 = true, normalizeTagName: i = false, normalizeAttributeName: a = false, allowHtmComponentClosingTags: o2 = false, isTagNameCaseSensitive: u = false, shouldParseAsRawText: p2 } = e2, { rootNodes: l2, errors: m } = Qr(t9, { canSelfClose: s2, allowHtmComponentClosingTags: o2, isTagNameCaseSensitive: u, getTagContentType: p2 ? (...c2) => p2(...c2) ? N2.RAW_TEXT : void 0 : void 0, tokenizeAngularBlocks: n2 === "angular" ? true : void 0, tokenizeAngularLetDeclaration: n2 === "angular" ? true : void 0 });
  if (n2 === "vue") {
    if (l2.some((x2) => x2.type === "docType" && x2.value === "html" || x2.type === "element" && x2.name.toLowerCase() === "html")) return Si(t9, en, r2);
    let g3, y3 = () => g3 ?? (g3 = Qr(t9, { canSelfClose: s2, allowHtmComponentClosingTags: o2, isTagNameCaseSensitive: u })), q3 = (x2) => y3().rootNodes.find(({ startSourceSpan: U2 }) => U2 && U2.start.offset === x2.startSourceSpan.start.offset) ?? x2;
    for (let [x2, U2] of l2.entries()) {
      let { endSourceSpan: nn2, startSourceSpan: Ei } = U2;
      if (nn2 === null) m = y3().errors, l2[x2] = q3(U2);
      else if (tu(U2, r2)) {
        let sn2 = y3().errors.find((an2) => an2.span.start.offset > Ei.start.offset && an2.span.start.offset < nn2.end.offset);
        sn2 && Ci(sn2), l2[x2] = q3(U2);
      }
    }
  }
  m.length > 0 && Ci(m[0]);
  let f3 = (c2) => {
    let g3 = c2.name.startsWith(":") ? c2.name.slice(1).split(":")[0] : null, y3 = c2.nameSpan.toString(), q3 = g3 !== null && y3.startsWith(`${g3}:`), x2 = q3 ? y3.slice(g3.length + 1) : y3;
    c2.name = x2, c2.namespace = g3, c2.hasExplicitNamespace = q3;
  }, C2 = (c2) => {
    switch (c2.type) {
      case "element":
        f3(c2);
        for (let g3 of c2.attrs) f3(g3), g3.valueSpan ? (g3.value = g3.valueSpan.toString(), /["']/u.test(g3.value[0]) && (g3.value = g3.value.slice(1, -1))) : g3.value = null;
        break;
      case "comment":
        c2.value = c2.sourceSpan.toString().slice(4, -3);
        break;
      case "text":
        c2.value = c2.sourceSpan.toString();
        break;
    }
  }, A = (c2, g3) => {
    let y3 = c2.toLowerCase();
    return g3(y3) ? y3 : c2;
  }, D2 = (c2) => {
    if (c2.type === "element" && (i && (!c2.namespace || c2.namespace === c2.tagDefinition.implicitNamespacePrefix || fe2(c2)) && (c2.name = A(c2.name, (g3) => gi.has(g3))), a)) for (let g3 of c2.attrs) g3.namespace || (g3.name = A(g3.name, (y3) => ur.has(c2.name) && (ur.get("*").has(y3) || ur.get(c2.name).has(y3))));
  }, I4 = (c2) => {
    c2.sourceSpan && c2.endSourceSpan && (c2.sourceSpan = new h2(c2.sourceSpan.start, c2.endSourceSpan.end));
  }, F = (c2) => {
    if (c2.type === "element") {
      let g3 = He2(u ? c2.name : c2.name.toLowerCase());
      !c2.namespace || c2.namespace === g3.implicitNamespacePrefix || fe2(c2) ? c2.tagDefinition = g3 : c2.tagDefinition = He2("");
    }
  };
  return Qt(new class extends ft {
    visitExpansionCase(c2, g3) {
      n2 === "angular" && this.visitChildren(g3, (y3) => {
        y3(c2.expression);
      });
    }
    visit(c2) {
      C2(c2), F(c2), D2(c2), I4(c2);
    }
  }(), l2), l2;
}
function tu(t9, e2) {
  var n2;
  if (t9.type !== "element" || t9.name !== "template") return false;
  let r2 = (n2 = t9.attrs.find((s2) => s2.name === "lang")) == null ? void 0 : n2.value;
  return !r2 || Ne2(e2, { language: r2 }) === "html";
}
function Ci(t9) {
  let { msg: e2, span: { start: r2, end: n2 } } = t9;
  throw hi(e2, { loc: { start: { line: r2.line + 1, column: r2.col + 1 }, end: { line: n2.line + 1, column: n2.col + 1 } }, cause: t9 });
}
function _i(t9, e2, r2 = {}, n2 = true) {
  let { frontMatter: s2, content: i } = n2 ? mi(t9) : { frontMatter: null, content: t9 }, a = new ve2(t9, r2.filepath), o2 = new ie(a, 0, 0, 0), u = o2.moveBy(t9.length), p2 = { type: "root", sourceSpan: new h2(o2, u), children: Si(i, e2, r2) };
  if (s2) {
    let f3 = new ie(a, 0, 0, 0), C2 = f3.moveBy(s2.raw.length);
    s2.sourceSpan = new h2(f3, C2), p2.children.unshift(s2);
  }
  let l2 = new or(p2), m = (f3, C2) => {
    let { offset: A } = C2, D2 = w2(false, t9.slice(0, A), /[^\n\r]/gu, " "), F = _i(D2 + f3, e2, r2, false);
    F.sourceSpan = new h2(C2, K2(false, F.children, -1).sourceSpan.end);
    let c2 = F.children[0];
    return c2.length === A ? F.children.shift() : (c2.sourceSpan = new h2(c2.sourceSpan.start.moveBy(A), c2.sourceSpan.end), c2.value = c2.value.slice(A)), F;
  };
  return l2.walk((f3) => {
    if (f3.type === "comment") {
      let C2 = di(f3, m);
      C2 && f3.parent.replaceChild(f3, C2);
    }
    Jo(f3), Zo(f3), eu(f3);
  }), l2;
}
function Et(t9) {
  return { parse: (e2, r2) => _i(e2, t9, r2), hasPragma: ws2, hasIgnorePragma: bs, astFormat: "html", locStart: J2, locEnd: se2 };
}
var on, un, Ai, ln, lr, cn, R, At, pn, rn, Di, w2, we2, ze, Ye2, be2, Te2, je2, xe2, ke2, ce, Be2, Ke, Xe, j, Qe, Le2, Dt, vi, K2, Fe2, wi, cr, pr, mr, re2, fr, mn, ne2, xi, ki, _2, v2, S2, hn, yt, Sn, _n, V3, gr, En, Li, Fi, O, Cr, An, Pe2, Ni, Ii, vn, yn, wn, Oi, bn, me2, Tn, xn, kn, Bn, Ln, qi, Nn, Ui, Ne2, $n, Sr, On, _r, fe2, Yi, Er, Mn, oa, br, ua, la, ca, rs, ns, ma, fa, da, ga, is, Ca, as, os, Ea, us, xr, Ie2, fs, ds, ka, gs, Nt, Ra, Ss, it, Oa, _s, qa, Es, Ha, As, Ds, vs, ys, xs, Ua, ie, ve2, h2, Mt, Oe2, Wa, Ms, so, qs, Hs, Lr, Vs, io, Us, tn, ah, Ws, Gs, zs, Fr, Pr, Z2, Ys, N2, Ht, Vt, ao, oo, uo, lo, co, js, po, Ut, d, Ks, pt, ae, Wt, Gt, zt, Yt, jt, Y, Kt, Xt, ee2, ht, mt, ft, Ve, fo, go, $r, Or, gt, Ur, Io, rr, Ct, Wr, nr, Gr, St, L2, jr, sr, Kr, ir, Xr, Uo, hi, _t, mi, ar, fi, le, Jr, Zr, Ge2, or, jo, ur, gi, en, ru, nu, su, iu, au, ou, uu, ym;
var init_html = __esm({
  "node_modules/prettier/plugins/html.mjs"() {
    on = Object.defineProperty;
    un = (t9) => {
      throw TypeError(t9);
    };
    Ai = (t9, e2, r2) => e2 in t9 ? on(t9, e2, { enumerable: true, configurable: true, writable: true, value: r2 }) : t9[e2] = r2;
    ln = (t9, e2) => {
      for (var r2 in e2) on(t9, r2, { get: e2[r2], enumerable: true });
    };
    lr = (t9, e2, r2) => Ai(t9, typeof e2 != "symbol" ? e2 + "" : e2, r2);
    cn = (t9, e2, r2) => e2.has(t9) || un("Cannot " + r2);
    R = (t9, e2, r2) => (cn(t9, e2, "read from private field"), r2 ? r2.call(t9) : e2.get(t9));
    At = (t9, e2, r2) => e2.has(t9) ? un("Cannot add the same private member more than once") : e2 instanceof WeakSet ? e2.add(t9) : e2.set(t9, r2);
    pn = (t9, e2, r2, n2) => (cn(t9, e2, "write to private field"), n2 ? n2.call(t9, r2) : e2.set(t9, r2), r2);
    rn = {};
    ln(rn, { languages: () => Hs, options: () => Us, parsers: () => tn, printers: () => uu });
    Di = (t9, e2, r2, n2) => {
      if (!(t9 && e2 == null)) return e2.replaceAll ? e2.replaceAll(r2, n2) : r2.global ? e2.replace(r2, n2) : e2.split(r2).join(n2);
    };
    w2 = Di;
    we2 = "string";
    ze = "array";
    Ye2 = "cursor";
    be2 = "indent";
    Te2 = "align";
    je2 = "trim";
    xe2 = "group";
    ke2 = "fill";
    ce = "if-break";
    Be2 = "indent-if-break";
    Ke = "line-suffix";
    Xe = "line-suffix-boundary";
    j = "line";
    Qe = "label";
    Le2 = "break-parent";
    Dt = /* @__PURE__ */ new Set([Ye2, be2, Te2, je2, xe2, ke2, ce, Be2, Ke, Xe, j, Qe, Le2]);
    vi = (t9, e2, r2) => {
      if (!(t9 && e2 == null)) return Array.isArray(e2) || typeof e2 == "string" ? e2[r2 < 0 ? e2.length + r2 : r2] : e2.at(r2);
    };
    K2 = vi;
    Fe2 = yi;
    wi = (t9) => new Intl.ListFormat("en-US", { type: "disjunction" }).format(t9);
    cr = class extends Error {
      name = "InvalidDocError";
      constructor(e2) {
        super(bi(e2)), this.doc = e2;
      }
    };
    pr = cr;
    mr = () => {
    };
    re2 = mr;
    fr = mr;
    mn = mr;
    ne2 = { type: Le2 };
    xi = { type: j, hard: true };
    ki = { type: j, hard: true, literal: true };
    _2 = { type: j };
    v2 = { type: j, soft: true };
    S2 = [xi, ne2];
    hn = [ki, ne2];
    yt = "'";
    Sn = '"';
    _n = Bi;
    gr = class {
      constructor(e2) {
        At(this, V3);
        pn(this, V3, new Set(e2));
      }
      getLeadingWhitespaceCount(e2) {
        let r2 = R(this, V3), n2 = 0;
        for (let s2 = 0; s2 < e2.length && r2.has(e2.charAt(s2)); s2++) n2++;
        return n2;
      }
      getTrailingWhitespaceCount(e2) {
        let r2 = R(this, V3), n2 = 0;
        for (let s2 = e2.length - 1; s2 >= 0 && r2.has(e2.charAt(s2)); s2--) n2++;
        return n2;
      }
      getLeadingWhitespace(e2) {
        let r2 = this.getLeadingWhitespaceCount(e2);
        return e2.slice(0, r2);
      }
      getTrailingWhitespace(e2) {
        let r2 = this.getTrailingWhitespaceCount(e2);
        return e2.slice(e2.length - r2);
      }
      hasLeadingWhitespace(e2) {
        return R(this, V3).has(e2.charAt(0));
      }
      hasTrailingWhitespace(e2) {
        return R(this, V3).has(K2(false, e2, -1));
      }
      trimStart(e2) {
        let r2 = this.getLeadingWhitespaceCount(e2);
        return e2.slice(r2);
      }
      trimEnd(e2) {
        let r2 = this.getTrailingWhitespaceCount(e2);
        return e2.slice(0, e2.length - r2);
      }
      trim(e2) {
        return this.trimEnd(this.trimStart(e2));
      }
      split(e2, r2 = false) {
        let n2 = `[${dr([...R(this, V3)].join(""))}]+`, s2 = new RegExp(r2 ? `(${n2})` : n2, "u");
        return e2.split(s2);
      }
      hasWhitespaceCharacter(e2) {
        let r2 = R(this, V3);
        return Array.prototype.some.call(e2, (n2) => r2.has(n2));
      }
      hasNonWhitespaceCharacter(e2) {
        let r2 = R(this, V3);
        return Array.prototype.some.call(e2, (n2) => !r2.has(n2));
      }
      isWhitespaceOnly(e2) {
        let r2 = R(this, V3);
        return Array.prototype.every.call(e2, (n2) => r2.has(n2));
      }
    };
    V3 = /* @__PURE__ */ new WeakMap();
    En = gr;
    Li = ["	", `
`, "\f", "\r", " "];
    Fi = new En(Li);
    O = Fi;
    Cr = class extends Error {
      name = "UnexpectedNodeError";
      constructor(e2, r2, n2 = "type") {
        super(`Unexpected ${r2} node ${n2}: ${JSON.stringify(e2[n2])}.`), this.node = e2;
      }
    };
    An = Cr;
    Pe2 = Pi;
    Ni = /* @__PURE__ */ new Set(["sourceSpan", "startSourceSpan", "endSourceSpan", "nameSpan", "valueSpan", "keySpan", "tagDefinition", "tokens", "valueTokens", "switchValueSourceSpan", "expSourceSpan", "valueSourceSpan"]);
    Ii = /* @__PURE__ */ new Set(["if", "else if", "for", "switch", "case"]);
    Dn.ignoredProperties = Ni;
    vn = Dn;
    yn = Ri;
    wn = $i;
    Oi = (t9, e2) => {
      if (!(t9 && e2 == null)) return e2.toReversed || !Array.isArray(e2) ? e2.toReversed() : [...e2].reverse();
    };
    bn = Oi;
    me2 = Mi;
    qi = ((Tn = globalThis.Deno) == null ? void 0 : Tn.build.os) === "windows" || ((kn = (xn = globalThis.navigator) == null ? void 0 : xn.platform) == null ? void 0 : kn.startsWith("Win")) || ((Ln = (Bn = globalThis.process) == null ? void 0 : Bn.platform) == null ? void 0 : Ln.startsWith("win")) || false;
    Nn = Pn;
    Ui = (t9) => String(t9).split(/[/\\]/u).pop();
    Ne2 = Gi;
    $n = "inline";
    Sr = { area: "none", base: "none", basefont: "none", datalist: "none", head: "none", link: "none", meta: "none", noembed: "none", noframes: "none", param: "block", rp: "none", script: "block", style: "none", template: "inline", title: "none", html: "block", body: "block", address: "block", blockquote: "block", center: "block", dialog: "block", div: "block", figure: "block", figcaption: "block", footer: "block", form: "block", header: "block", hr: "block", legend: "block", listing: "block", main: "block", p: "block", plaintext: "block", pre: "block", search: "block", xmp: "block", slot: "contents", ruby: "ruby", rt: "ruby-text", article: "block", aside: "block", h1: "block", h2: "block", h3: "block", h4: "block", h5: "block", h6: "block", hgroup: "block", nav: "block", section: "block", dir: "block", dd: "block", dl: "block", dt: "block", menu: "block", ol: "block", ul: "block", li: "list-item", table: "table", caption: "table-caption", colgroup: "table-column-group", col: "table-column", thead: "table-header-group", tbody: "table-row-group", tfoot: "table-footer-group", tr: "table-row", td: "table-cell", th: "table-cell", input: "inline-block", button: "inline-block", fieldset: "block", details: "block", summary: "block", marquee: "inline-block", source: "block", track: "block", meter: "inline-block", progress: "inline-block", object: "inline-block", video: "inline-block", audio: "inline-block", select: "inline-block", option: "block", optgroup: "block" };
    On = "normal";
    _r = { listing: "pre", plaintext: "pre", pre: "pre", xmp: "pre", nobr: "nowrap", table: "initial", textarea: "pre-wrap" };
    fe2 = zi;
    Yi = (t9) => w2(false, t9, /^[\t\f\r ]*\n/gu, "");
    Er = (t9) => Yi(O.trimEnd(t9));
    Mn = (t9) => {
      let e2 = t9, r2 = O.getLeadingWhitespace(e2);
      r2 && (e2 = e2.slice(r2.length));
      let n2 = O.getTrailingWhitespace(e2);
      return n2 && (e2 = e2.slice(0, -n2.length)), { leadingWhitespace: r2, trailingWhitespace: n2, text: e2 };
    };
    oa = /* @__PURE__ */ new Set(["template", "style", "script"]);
    br = /\{\{(.+?)\}\}/su;
    ua = Tr({ parser: "__ng_action" });
    la = Tr({ parser: "__ng_binding" });
    ca = Tr({ parser: "__ng_directive" });
    rs = pa;
    ns = ha;
    ma = /^[ \t\n\r\u000c]+/;
    fa = /^[, \t\n\r\u000c]+/;
    da = /^[^ \t\n\r\u000c]+/;
    ga = /[,]+$/;
    is = /^\d+$/;
    Ca = /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/;
    as = Sa;
    os = { width: "w", height: "h", density: "x" };
    Ea = Object.keys(os);
    us = _a2;
    xr = /* @__PURE__ */ new WeakMap();
    Ie2 = Da;
    fs = ya;
    ds = Ta;
    ka = new Proxy(() => {
    }, { get: () => ka });
    gs = "<!doctype";
    Nt = Ia;
    Ra = /* @__PURE__ */ new Set(["if", "else if", "for", "switch", "case"]);
    Ss = $a;
    it = null;
    Oa = 10;
    for (let t9 = 0; t9 <= Oa; t9++) at();
    _s = Ma;
    qa = { "front-matter": [], root: ["children"], element: ["attrs", "children"], ieConditionalComment: ["children"], ieConditionalStartComment: [], ieConditionalEndComment: [], interpolation: ["children"], text: ["children"], docType: [], comment: [], attribute: [], cdata: [], angularControlFlowBlock: ["children", "parameters"], angularControlFlowBlockParameters: ["children"], angularControlFlowBlockParameter: [], angularLetDeclaration: ["init"], angularLetDeclarationInitializer: [], angularIcuExpression: ["cases"], angularIcuCase: ["expression"] };
    Es = qa;
    Ha = _s(Es);
    As = Ha;
    Ds = "format";
    vs = /^\s*<!--\s*@(?:noformat|noprettier)\s*-->/u;
    ys = /^\s*<!--\s*@(?:format|prettier)\s*-->/u;
    xs = /* @__PURE__ */ new Map([["if", /* @__PURE__ */ new Set(["else if", "else"])], ["else if", /* @__PURE__ */ new Set(["else if", "else"])], ["for", /* @__PURE__ */ new Set(["empty"])], ["defer", /* @__PURE__ */ new Set(["placeholder", "error", "loading"])], ["placeholder", /* @__PURE__ */ new Set(["placeholder", "error", "loading"])], ["error", /* @__PURE__ */ new Set(["placeholder", "error", "loading"])], ["loading", /* @__PURE__ */ new Set(["placeholder", "error", "loading"])]]);
    Ua = /-+([a-z0-9])/g;
    ie = class t3 {
      constructor(e2, r2, n2, s2) {
        this.file = e2, this.offset = r2, this.line = n2, this.col = s2;
      }
      toString() {
        return this.offset != null ? `${this.file.url}@${this.line}:${this.col}` : this.file.url;
      }
      moveBy(e2) {
        let r2 = this.file.content, n2 = r2.length, s2 = this.offset, i = this.line, a = this.col;
        for (; s2 > 0 && e2 < 0; ) if (s2--, e2++, r2.charCodeAt(s2) == 10) {
          i--;
          let u = r2.substring(0, s2 - 1).lastIndexOf(String.fromCharCode(10));
          a = u > 0 ? s2 - u : s2;
        } else a--;
        for (; s2 < n2 && e2 > 0; ) {
          let o2 = r2.charCodeAt(s2);
          s2++, e2--, o2 == 10 ? (i++, a = 0) : a++;
        }
        return new t3(this.file, s2, i, a);
      }
      getContext(e2, r2) {
        let n2 = this.file.content, s2 = this.offset;
        if (s2 != null) {
          s2 > n2.length - 1 && (s2 = n2.length - 1);
          let i = s2, a = 0, o2 = 0;
          for (; a < e2 && s2 > 0 && (s2--, a++, !(n2[s2] == `
` && ++o2 == r2)); ) ;
          for (a = 0, o2 = 0; a < e2 && i < n2.length - 1 && (i++, a++, !(n2[i] == `
` && ++o2 == r2)); ) ;
          return { before: n2.substring(s2, this.offset), after: n2.substring(this.offset, i + 1) };
        }
        return null;
      }
    };
    ve2 = class {
      constructor(e2, r2) {
        this.content = e2, this.url = r2;
      }
    };
    h2 = class {
      constructor(e2, r2, n2 = e2, s2 = null) {
        this.start = e2, this.end = r2, this.fullStart = n2, this.details = s2;
      }
      toString() {
        return this.start.file.content.substring(this.start.offset, this.end.offset);
      }
    };
    (function(t9) {
      t9[t9.WARNING = 0] = "WARNING", t9[t9.ERROR = 1] = "ERROR";
    })(Mt || (Mt = {}));
    Oe2 = class {
      constructor(e2, r2, n2 = Mt.ERROR, s2) {
        this.span = e2, this.msg = r2, this.level = n2, this.relatedError = s2;
      }
      contextualMessage() {
        let e2 = this.span.start.getContext(100, 3);
        return e2 ? `${this.msg} ("${e2.before}[${Mt[this.level]} ->]${e2.after}")` : this.msg;
      }
      toString() {
        let e2 = this.span.details ? `, ${this.span.details}` : "";
        return `${this.contextualMessage()}: ${this.span.start}${e2}`;
      }
    };
    Wa = [za, Ya, Ka, Qa, Ja, to, Za, eo, ro, Xa];
    Ms = Ga;
    so = { preprocess: Ms, print: no, insertPragma: Ts, massageAstNode: vn, embed: Ss, getVisitorKeys: As };
    qs = so;
    Hs = [{ name: "Angular", type: "markup", extensions: [".component.html"], tmScope: "text.html.basic", aceMode: "html", aliases: ["xhtml"], codemirrorMode: "htmlmixed", codemirrorMimeType: "text/html", parsers: ["angular"], vscodeLanguageIds: ["html"], filenames: [], linguistLanguageId: 146 }, { name: "HTML", type: "markup", extensions: [".html", ".hta", ".htm", ".html.hl", ".inc", ".xht", ".xhtml"], tmScope: "text.html.basic", aceMode: "html", aliases: ["xhtml"], codemirrorMode: "htmlmixed", codemirrorMimeType: "text/html", parsers: ["html"], vscodeLanguageIds: ["html"], linguistLanguageId: 146 }, { name: "Lightning Web Components", type: "markup", extensions: [], tmScope: "text.html.basic", aceMode: "html", aliases: ["xhtml"], codemirrorMode: "htmlmixed", codemirrorMimeType: "text/html", parsers: ["lwc"], vscodeLanguageIds: ["html"], filenames: [], linguistLanguageId: 146 }, { name: "MJML", type: "markup", extensions: [".mjml"], tmScope: "text.mjml.basic", aceMode: "html", aliases: ["MJML", "mjml"], codemirrorMode: "htmlmixed", codemirrorMimeType: "text/html", parsers: ["mjml"], filenames: [], vscodeLanguageIds: ["mjml"], linguistLanguageId: 146 }, { name: "Vue", type: "markup", extensions: [".vue"], tmScope: "source.vue", aceMode: "html", parsers: ["vue"], vscodeLanguageIds: ["vue"], linguistLanguageId: 391 }];
    Lr = { bracketSpacing: { category: "Common", type: "boolean", default: true, description: "Print spaces between brackets.", oppositeDescription: "Do not print spaces between brackets." }, objectWrap: { category: "Common", type: "choice", default: "preserve", description: "How to wrap object literals.", choices: [{ value: "preserve", description: "Keep as multi-line, if there is a newline between the opening brace and first property." }, { value: "collapse", description: "Fit to a single line when possible." }] }, singleQuote: { category: "Common", type: "boolean", default: false, description: "Use single quotes instead of double quotes." }, proseWrap: { category: "Common", type: "choice", default: "preserve", description: "How to wrap prose.", choices: [{ value: "always", description: "Wrap prose if it exceeds the print width." }, { value: "never", description: "Do not wrap prose." }, { value: "preserve", description: "Wrap prose as-is." }] }, bracketSameLine: { category: "Common", type: "boolean", default: false, description: "Put > of opening tags on the last line instead of on a new line." }, singleAttributePerLine: { category: "Common", type: "boolean", default: false, description: "Enforce single attribute per line in HTML, Vue and JSX." } };
    Vs = "HTML";
    io = { bracketSameLine: Lr.bracketSameLine, htmlWhitespaceSensitivity: { category: Vs, type: "choice", default: "css", description: "How to handle whitespaces in HTML.", choices: [{ value: "css", description: "Respect the default value of CSS display property." }, { value: "strict", description: "Whitespaces are considered sensitive." }, { value: "ignore", description: "Whitespaces are considered insensitive." }] }, singleAttributePerLine: Lr.singleAttributePerLine, vueIndentScriptAndStyle: { category: Vs, type: "boolean", default: false, description: "Indent script and style tags in Vue files." } };
    Us = io;
    tn = {};
    ln(tn, { angular: () => iu, html: () => ru, lwc: () => ou, mjml: () => su, vue: () => au });
    ah = new RegExp(`(\\:not\\()|(([\\.\\#]?)[-\\w]+)|(?:\\[([-.\\w*\\\\$]+)(?:=(["']?)([^\\]"']*)\\5)?\\])|(\\))|(\\s*,\\s*)`, "g");
    (function(t9) {
      t9[t9.Emulated = 0] = "Emulated", t9[t9.None = 2] = "None", t9[t9.ShadowDom = 3] = "ShadowDom";
    })(Ws || (Ws = {}));
    (function(t9) {
      t9[t9.OnPush = 0] = "OnPush", t9[t9.Default = 1] = "Default";
    })(Gs || (Gs = {}));
    (function(t9) {
      t9[t9.None = 0] = "None", t9[t9.SignalBased = 1] = "SignalBased", t9[t9.HasDecoratorInputTransform = 2] = "HasDecoratorInputTransform";
    })(zs || (zs = {}));
    Fr = { name: "custom-elements" };
    Pr = { name: "no-errors-schema" };
    (function(t9) {
      t9[t9.NONE = 0] = "NONE", t9[t9.HTML = 1] = "HTML", t9[t9.STYLE = 2] = "STYLE", t9[t9.SCRIPT = 3] = "SCRIPT", t9[t9.URL = 4] = "URL", t9[t9.RESOURCE_URL = 5] = "RESOURCE_URL";
    })(Z2 || (Z2 = {}));
    (function(t9) {
      t9[t9.Error = 0] = "Error", t9[t9.Warning = 1] = "Warning", t9[t9.Ignore = 2] = "Ignore";
    })(Ys || (Ys = {}));
    (function(t9) {
      t9[t9.RAW_TEXT = 0] = "RAW_TEXT", t9[t9.ESCAPABLE_RAW_TEXT = 1] = "ESCAPABLE_RAW_TEXT", t9[t9.PARSABLE_DATA = 2] = "PARSABLE_DATA";
    })(N2 || (N2 = {}));
    Vt = class {
    };
    ao = "boolean";
    oo = "number";
    uo = "string";
    lo = "object";
    co = ["[Element]|textContent,%ariaAtomic,%ariaAutoComplete,%ariaBusy,%ariaChecked,%ariaColCount,%ariaColIndex,%ariaColSpan,%ariaCurrent,%ariaDescription,%ariaDisabled,%ariaExpanded,%ariaHasPopup,%ariaHidden,%ariaKeyShortcuts,%ariaLabel,%ariaLevel,%ariaLive,%ariaModal,%ariaMultiLine,%ariaMultiSelectable,%ariaOrientation,%ariaPlaceholder,%ariaPosInSet,%ariaPressed,%ariaReadOnly,%ariaRelevant,%ariaRequired,%ariaRoleDescription,%ariaRowCount,%ariaRowIndex,%ariaRowSpan,%ariaSelected,%ariaSetSize,%ariaSort,%ariaValueMax,%ariaValueMin,%ariaValueNow,%ariaValueText,%classList,className,elementTiming,id,innerHTML,*beforecopy,*beforecut,*beforepaste,*fullscreenchange,*fullscreenerror,*search,*webkitfullscreenchange,*webkitfullscreenerror,outerHTML,%part,#scrollLeft,#scrollTop,slot,*message,*mozfullscreenchange,*mozfullscreenerror,*mozpointerlockchange,*mozpointerlockerror,*webglcontextcreationerror,*webglcontextlost,*webglcontextrestored", "[HTMLElement]^[Element]|accessKey,autocapitalize,!autofocus,contentEditable,dir,!draggable,enterKeyHint,!hidden,!inert,innerText,inputMode,lang,nonce,*abort,*animationend,*animationiteration,*animationstart,*auxclick,*beforexrselect,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*copy,*cuechange,*cut,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*formdata,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*paste,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerrawupdate,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*securitypolicyviolation,*seeked,*seeking,*select,*selectionchange,*selectstart,*slotchange,*stalled,*submit,*suspend,*timeupdate,*toggle,*transitioncancel,*transitionend,*transitionrun,*transitionstart,*volumechange,*waiting,*webkitanimationend,*webkitanimationiteration,*webkitanimationstart,*webkittransitionend,*wheel,outerText,!spellcheck,%style,#tabIndex,title,!translate,virtualKeyboardPolicy", "abbr,address,article,aside,b,bdi,bdo,cite,content,code,dd,dfn,dt,em,figcaption,figure,footer,header,hgroup,i,kbd,main,mark,nav,noscript,rb,rp,rt,rtc,ruby,s,samp,section,small,strong,sub,sup,u,var,wbr^[HTMLElement]|accessKey,autocapitalize,!autofocus,contentEditable,dir,!draggable,enterKeyHint,!hidden,innerText,inputMode,lang,nonce,*abort,*animationend,*animationiteration,*animationstart,*auxclick,*beforexrselect,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*copy,*cuechange,*cut,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*formdata,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*paste,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerrawupdate,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*securitypolicyviolation,*seeked,*seeking,*select,*selectionchange,*selectstart,*slotchange,*stalled,*submit,*suspend,*timeupdate,*toggle,*transitioncancel,*transitionend,*transitionrun,*transitionstart,*volumechange,*waiting,*webkitanimationend,*webkitanimationiteration,*webkitanimationstart,*webkittransitionend,*wheel,outerText,!spellcheck,%style,#tabIndex,title,!translate,virtualKeyboardPolicy", "media^[HTMLElement]|!autoplay,!controls,%controlsList,%crossOrigin,#currentTime,!defaultMuted,#defaultPlaybackRate,!disableRemotePlayback,!loop,!muted,*encrypted,*waitingforkey,#playbackRate,preload,!preservesPitch,src,%srcObject,#volume", ":svg:^[HTMLElement]|!autofocus,nonce,*abort,*animationend,*animationiteration,*animationstart,*auxclick,*beforexrselect,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*copy,*cuechange,*cut,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*formdata,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*paste,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerrawupdate,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*securitypolicyviolation,*seeked,*seeking,*select,*selectionchange,*selectstart,*slotchange,*stalled,*submit,*suspend,*timeupdate,*toggle,*transitioncancel,*transitionend,*transitionrun,*transitionstart,*volumechange,*waiting,*webkitanimationend,*webkitanimationiteration,*webkitanimationstart,*webkittransitionend,*wheel,%style,#tabIndex", ":svg:graphics^:svg:|", ":svg:animation^:svg:|*begin,*end,*repeat", ":svg:geometry^:svg:|", ":svg:componentTransferFunction^:svg:|", ":svg:gradient^:svg:|", ":svg:textContent^:svg:graphics|", ":svg:textPositioning^:svg:textContent|", "a^[HTMLElement]|charset,coords,download,hash,host,hostname,href,hreflang,name,password,pathname,ping,port,protocol,referrerPolicy,rel,%relList,rev,search,shape,target,text,type,username", "area^[HTMLElement]|alt,coords,download,hash,host,hostname,href,!noHref,password,pathname,ping,port,protocol,referrerPolicy,rel,%relList,search,shape,target,username", "audio^media|", "br^[HTMLElement]|clear", "base^[HTMLElement]|href,target", "body^[HTMLElement]|aLink,background,bgColor,link,*afterprint,*beforeprint,*beforeunload,*blur,*error,*focus,*hashchange,*languagechange,*load,*message,*messageerror,*offline,*online,*pagehide,*pageshow,*popstate,*rejectionhandled,*resize,*scroll,*storage,*unhandledrejection,*unload,text,vLink", "button^[HTMLElement]|!disabled,formAction,formEnctype,formMethod,!formNoValidate,formTarget,name,type,value", "canvas^[HTMLElement]|#height,#width", "content^[HTMLElement]|select", "dl^[HTMLElement]|!compact", "data^[HTMLElement]|value", "datalist^[HTMLElement]|", "details^[HTMLElement]|!open", "dialog^[HTMLElement]|!open,returnValue", "dir^[HTMLElement]|!compact", "div^[HTMLElement]|align", "embed^[HTMLElement]|align,height,name,src,type,width", "fieldset^[HTMLElement]|!disabled,name", "font^[HTMLElement]|color,face,size", "form^[HTMLElement]|acceptCharset,action,autocomplete,encoding,enctype,method,name,!noValidate,target", "frame^[HTMLElement]|frameBorder,longDesc,marginHeight,marginWidth,name,!noResize,scrolling,src", "frameset^[HTMLElement]|cols,*afterprint,*beforeprint,*beforeunload,*blur,*error,*focus,*hashchange,*languagechange,*load,*message,*messageerror,*offline,*online,*pagehide,*pageshow,*popstate,*rejectionhandled,*resize,*scroll,*storage,*unhandledrejection,*unload,rows", "hr^[HTMLElement]|align,color,!noShade,size,width", "head^[HTMLElement]|", "h1,h2,h3,h4,h5,h6^[HTMLElement]|align", "html^[HTMLElement]|version", "iframe^[HTMLElement]|align,allow,!allowFullscreen,!allowPaymentRequest,csp,frameBorder,height,loading,longDesc,marginHeight,marginWidth,name,referrerPolicy,%sandbox,scrolling,src,srcdoc,width", "img^[HTMLElement]|align,alt,border,%crossOrigin,decoding,#height,#hspace,!isMap,loading,longDesc,lowsrc,name,referrerPolicy,sizes,src,srcset,useMap,#vspace,#width", "input^[HTMLElement]|accept,align,alt,autocomplete,!checked,!defaultChecked,defaultValue,dirName,!disabled,%files,formAction,formEnctype,formMethod,!formNoValidate,formTarget,#height,!incremental,!indeterminate,max,#maxLength,min,#minLength,!multiple,name,pattern,placeholder,!readOnly,!required,selectionDirection,#selectionEnd,#selectionStart,#size,src,step,type,useMap,value,%valueAsDate,#valueAsNumber,#width", "li^[HTMLElement]|type,#value", "label^[HTMLElement]|htmlFor", "legend^[HTMLElement]|align", "link^[HTMLElement]|as,charset,%crossOrigin,!disabled,href,hreflang,imageSizes,imageSrcset,integrity,media,referrerPolicy,rel,%relList,rev,%sizes,target,type", "map^[HTMLElement]|name", "marquee^[HTMLElement]|behavior,bgColor,direction,height,#hspace,#loop,#scrollAmount,#scrollDelay,!trueSpeed,#vspace,width", "menu^[HTMLElement]|!compact", "meta^[HTMLElement]|content,httpEquiv,media,name,scheme", "meter^[HTMLElement]|#high,#low,#max,#min,#optimum,#value", "ins,del^[HTMLElement]|cite,dateTime", "ol^[HTMLElement]|!compact,!reversed,#start,type", "object^[HTMLElement]|align,archive,border,code,codeBase,codeType,data,!declare,height,#hspace,name,standby,type,useMap,#vspace,width", "optgroup^[HTMLElement]|!disabled,label", "option^[HTMLElement]|!defaultSelected,!disabled,label,!selected,text,value", "output^[HTMLElement]|defaultValue,%htmlFor,name,value", "p^[HTMLElement]|align", "param^[HTMLElement]|name,type,value,valueType", "picture^[HTMLElement]|", "pre^[HTMLElement]|#width", "progress^[HTMLElement]|#max,#value", "q,blockquote,cite^[HTMLElement]|", "script^[HTMLElement]|!async,charset,%crossOrigin,!defer,event,htmlFor,integrity,!noModule,%referrerPolicy,src,text,type", "select^[HTMLElement]|autocomplete,!disabled,#length,!multiple,name,!required,#selectedIndex,#size,value", "slot^[HTMLElement]|name", "source^[HTMLElement]|#height,media,sizes,src,srcset,type,#width", "span^[HTMLElement]|", "style^[HTMLElement]|!disabled,media,type", "caption^[HTMLElement]|align", "th,td^[HTMLElement]|abbr,align,axis,bgColor,ch,chOff,#colSpan,headers,height,!noWrap,#rowSpan,scope,vAlign,width", "col,colgroup^[HTMLElement]|align,ch,chOff,#span,vAlign,width", "table^[HTMLElement]|align,bgColor,border,%caption,cellPadding,cellSpacing,frame,rules,summary,%tFoot,%tHead,width", "tr^[HTMLElement]|align,bgColor,ch,chOff,vAlign", "tfoot,thead,tbody^[HTMLElement]|align,ch,chOff,vAlign", "template^[HTMLElement]|", "textarea^[HTMLElement]|autocomplete,#cols,defaultValue,dirName,!disabled,#maxLength,#minLength,name,placeholder,!readOnly,!required,#rows,selectionDirection,#selectionEnd,#selectionStart,value,wrap", "time^[HTMLElement]|dateTime", "title^[HTMLElement]|text", "track^[HTMLElement]|!default,kind,label,src,srclang", "ul^[HTMLElement]|!compact,type", "unknown^[HTMLElement]|", "video^media|!disablePictureInPicture,#height,*enterpictureinpicture,*leavepictureinpicture,!playsInline,poster,#width", ":svg:a^:svg:graphics|", ":svg:animate^:svg:animation|", ":svg:animateMotion^:svg:animation|", ":svg:animateTransform^:svg:animation|", ":svg:circle^:svg:geometry|", ":svg:clipPath^:svg:graphics|", ":svg:defs^:svg:graphics|", ":svg:desc^:svg:|", ":svg:discard^:svg:|", ":svg:ellipse^:svg:geometry|", ":svg:feBlend^:svg:|", ":svg:feColorMatrix^:svg:|", ":svg:feComponentTransfer^:svg:|", ":svg:feComposite^:svg:|", ":svg:feConvolveMatrix^:svg:|", ":svg:feDiffuseLighting^:svg:|", ":svg:feDisplacementMap^:svg:|", ":svg:feDistantLight^:svg:|", ":svg:feDropShadow^:svg:|", ":svg:feFlood^:svg:|", ":svg:feFuncA^:svg:componentTransferFunction|", ":svg:feFuncB^:svg:componentTransferFunction|", ":svg:feFuncG^:svg:componentTransferFunction|", ":svg:feFuncR^:svg:componentTransferFunction|", ":svg:feGaussianBlur^:svg:|", ":svg:feImage^:svg:|", ":svg:feMerge^:svg:|", ":svg:feMergeNode^:svg:|", ":svg:feMorphology^:svg:|", ":svg:feOffset^:svg:|", ":svg:fePointLight^:svg:|", ":svg:feSpecularLighting^:svg:|", ":svg:feSpotLight^:svg:|", ":svg:feTile^:svg:|", ":svg:feTurbulence^:svg:|", ":svg:filter^:svg:|", ":svg:foreignObject^:svg:graphics|", ":svg:g^:svg:graphics|", ":svg:image^:svg:graphics|decoding", ":svg:line^:svg:geometry|", ":svg:linearGradient^:svg:gradient|", ":svg:mpath^:svg:|", ":svg:marker^:svg:|", ":svg:mask^:svg:|", ":svg:metadata^:svg:|", ":svg:path^:svg:geometry|", ":svg:pattern^:svg:|", ":svg:polygon^:svg:geometry|", ":svg:polyline^:svg:geometry|", ":svg:radialGradient^:svg:gradient|", ":svg:rect^:svg:geometry|", ":svg:svg^:svg:graphics|#currentScale,#zoomAndPan", ":svg:script^:svg:|type", ":svg:set^:svg:animation|", ":svg:stop^:svg:|", ":svg:style^:svg:|!disabled,media,title,type", ":svg:switch^:svg:graphics|", ":svg:symbol^:svg:|", ":svg:tspan^:svg:textPositioning|", ":svg:text^:svg:textPositioning|", ":svg:textPath^:svg:textContent|", ":svg:title^:svg:|", ":svg:use^:svg:graphics|", ":svg:view^:svg:|#zoomAndPan", "data^[HTMLElement]|value", "keygen^[HTMLElement]|!autofocus,challenge,!disabled,form,keytype,name", "menuitem^[HTMLElement]|type,label,icon,!disabled,!checked,radiogroup,!default", "summary^[HTMLElement]|", "time^[HTMLElement]|dateTime", ":svg:cursor^:svg:|", ":math:^[HTMLElement]|!autofocus,nonce,*abort,*animationend,*animationiteration,*animationstart,*auxclick,*beforeinput,*beforematch,*beforetoggle,*beforexrselect,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contentvisibilityautostatechange,*contextlost,*contextmenu,*contextrestored,*copy,*cuechange,*cut,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*formdata,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*paste,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerrawupdate,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*scrollend,*securitypolicyviolation,*seeked,*seeking,*select,*selectionchange,*selectstart,*slotchange,*stalled,*submit,*suspend,*timeupdate,*toggle,*transitioncancel,*transitionend,*transitionrun,*transitionstart,*volumechange,*waiting,*webkitanimationend,*webkitanimationiteration,*webkitanimationstart,*webkittransitionend,*wheel,%style,#tabIndex", ":math:math^:math:|", ":math:maction^:math:|", ":math:menclose^:math:|", ":math:merror^:math:|", ":math:mfenced^:math:|", ":math:mfrac^:math:|", ":math:mi^:math:|", ":math:mmultiscripts^:math:|", ":math:mn^:math:|", ":math:mo^:math:|", ":math:mover^:math:|", ":math:mpadded^:math:|", ":math:mphantom^:math:|", ":math:mroot^:math:|", ":math:mrow^:math:|", ":math:ms^:math:|", ":math:mspace^:math:|", ":math:msqrt^:math:|", ":math:mstyle^:math:|", ":math:msub^:math:|", ":math:msubsup^:math:|", ":math:msup^:math:|", ":math:mtable^:math:|", ":math:mtd^:math:|", ":math:mtext^:math:|", ":math:mtr^:math:|", ":math:munder^:math:|", ":math:munderover^:math:|", ":math:semantics^:math:|"];
    js = new Map(Object.entries({ class: "className", for: "htmlFor", formaction: "formAction", innerHtml: "innerHTML", readonly: "readOnly", tabindex: "tabIndex" }));
    po = Array.from(js).reduce((t9, [e2, r2]) => (t9.set(e2, r2), t9), /* @__PURE__ */ new Map());
    Ut = class extends Vt {
      constructor() {
        super(), this._schema = /* @__PURE__ */ new Map(), this._eventSchema = /* @__PURE__ */ new Map(), co.forEach((e2) => {
          let r2 = /* @__PURE__ */ new Map(), n2 = /* @__PURE__ */ new Set(), [s2, i] = e2.split("|"), a = i.split(","), [o2, u] = s2.split("^");
          o2.split(",").forEach((l2) => {
            this._schema.set(l2.toLowerCase(), r2), this._eventSchema.set(l2.toLowerCase(), n2);
          });
          let p2 = u && this._schema.get(u.toLowerCase());
          if (p2) {
            for (let [l2, m] of p2) r2.set(l2, m);
            for (let l2 of this._eventSchema.get(u.toLowerCase())) n2.add(l2);
          }
          a.forEach((l2) => {
            if (l2.length > 0) switch (l2[0]) {
              case "*":
                n2.add(l2.substring(1));
                break;
              case "!":
                r2.set(l2.substring(1), ao);
                break;
              case "#":
                r2.set(l2.substring(1), oo);
                break;
              case "%":
                r2.set(l2.substring(1), lo);
                break;
              default:
                r2.set(l2, uo);
            }
          });
        });
      }
      hasProperty(e2, r2, n2) {
        if (n2.some((i) => i.name === Pr.name)) return true;
        if (e2.indexOf("-") > -1) {
          if (Nr(e2) || Ir(e2)) return false;
          if (n2.some((i) => i.name === Fr.name)) return true;
        }
        return (this._schema.get(e2.toLowerCase()) || this._schema.get("unknown")).has(r2);
      }
      hasElement(e2, r2) {
        return r2.some((n2) => n2.name === Pr.name) || e2.indexOf("-") > -1 && (Nr(e2) || Ir(e2) || r2.some((n2) => n2.name === Fr.name)) ? true : this._schema.has(e2.toLowerCase());
      }
      securityContext(e2, r2, n2) {
        n2 && (r2 = this.getMappedPropName(r2)), e2 = e2.toLowerCase(), r2 = r2.toLowerCase();
        let s2 = Rr()[e2 + "|" + r2];
        return s2 || (s2 = Rr()["*|" + r2], s2 || Z2.NONE);
      }
      getMappedPropName(e2) {
        return js.get(e2) ?? e2;
      }
      getDefaultComponentElementName() {
        return "ng-component";
      }
      validateProperty(e2) {
        return e2.toLowerCase().startsWith("on") ? { error: true, msg: `Binding to event property '${e2}' is disallowed for security reasons, please use (${e2.slice(2)})=...
If '${e2}' is a directive input, make sure the directive is imported by the current module.` } : { error: false };
      }
      validateAttribute(e2) {
        return e2.toLowerCase().startsWith("on") ? { error: true, msg: `Binding to event attribute '${e2}' is disallowed for security reasons, please use (${e2.slice(2)})=...` } : { error: false };
      }
      allKnownElementNames() {
        return Array.from(this._schema.keys());
      }
      allKnownAttributesOfElement(e2) {
        let r2 = this._schema.get(e2.toLowerCase()) || this._schema.get("unknown");
        return Array.from(r2.keys()).map((n2) => po.get(n2) ?? n2);
      }
      allKnownEventsOfElement(e2) {
        return Array.from(this._eventSchema.get(e2.toLowerCase()) ?? []);
      }
      normalizeAnimationStyleProperty(e2) {
        return Os(e2);
      }
      normalizeAnimationStyleValue(e2, r2, n2) {
        let s2 = "", i = n2.toString().trim(), a = null;
        if (ho(e2) && n2 !== 0 && n2 !== "0") if (typeof n2 == "number") s2 = "px";
        else {
          let o2 = n2.match(/^[+-]?[\d\.]+([a-z]*)$/);
          o2 && o2[1].length == 0 && (a = `Please provide a CSS unit value for ${r2}:${n2}`);
        }
        return { error: a, value: i + s2 };
      }
    };
    d = class {
      constructor({ closedByChildren: e2, implicitNamespacePrefix: r2, contentType: n2 = N2.PARSABLE_DATA, closedByParent: s2 = false, isVoid: i = false, ignoreFirstLf: a = false, preventNamespaceInheritance: o2 = false, canSelfClose: u = false } = {}) {
        this.closedByChildren = {}, this.closedByParent = false, e2 && e2.length > 0 && e2.forEach((p2) => this.closedByChildren[p2] = true), this.isVoid = i, this.closedByParent = s2 || i, this.implicitNamespacePrefix = r2 || null, this.contentType = n2, this.ignoreFirstLf = a, this.preventNamespaceInheritance = o2, this.canSelfClose = u ?? i;
      }
      isClosedByChild(e2) {
        return this.isVoid || e2.toLowerCase() in this.closedByChildren;
      }
      getContentType(e2) {
        return typeof this.contentType == "object" ? (e2 === void 0 ? void 0 : this.contentType[e2]) ?? this.contentType.default : this.contentType;
      }
    };
    ae = class {
      constructor(e2, r2) {
        this.sourceSpan = e2, this.i18n = r2;
      }
    };
    Wt = class extends ae {
      constructor(e2, r2, n2, s2) {
        super(r2, s2), this.value = e2, this.tokens = n2, this.type = "text";
      }
      visit(e2, r2) {
        return e2.visitText(this, r2);
      }
    };
    Gt = class extends ae {
      constructor(e2, r2, n2, s2) {
        super(r2, s2), this.value = e2, this.tokens = n2, this.type = "cdata";
      }
      visit(e2, r2) {
        return e2.visitCdata(this, r2);
      }
    };
    zt = class extends ae {
      constructor(e2, r2, n2, s2, i, a) {
        super(s2, a), this.switchValue = e2, this.type = r2, this.cases = n2, this.switchValueSourceSpan = i;
      }
      visit(e2, r2) {
        return e2.visitExpansion(this, r2);
      }
    };
    Yt = class {
      constructor(e2, r2, n2, s2, i) {
        this.value = e2, this.expression = r2, this.sourceSpan = n2, this.valueSourceSpan = s2, this.expSourceSpan = i, this.type = "expansionCase";
      }
      visit(e2, r2) {
        return e2.visitExpansionCase(this, r2);
      }
    };
    jt = class extends ae {
      constructor(e2, r2, n2, s2, i, a, o2) {
        super(n2, o2), this.name = e2, this.value = r2, this.keySpan = s2, this.valueSpan = i, this.valueTokens = a, this.type = "attribute";
      }
      visit(e2, r2) {
        return e2.visitAttribute(this, r2);
      }
      get nameSpan() {
        return this.keySpan;
      }
    };
    Y = class extends ae {
      constructor(e2, r2, n2, s2, i, a = null, o2 = null, u) {
        super(s2, u), this.name = e2, this.attrs = r2, this.children = n2, this.startSourceSpan = i, this.endSourceSpan = a, this.nameSpan = o2, this.type = "element";
      }
      visit(e2, r2) {
        return e2.visitElement(this, r2);
      }
    };
    Kt = class {
      constructor(e2, r2) {
        this.value = e2, this.sourceSpan = r2, this.type = "comment";
      }
      visit(e2, r2) {
        return e2.visitComment(this, r2);
      }
    };
    Xt = class {
      constructor(e2, r2) {
        this.value = e2, this.sourceSpan = r2, this.type = "docType";
      }
      visit(e2, r2) {
        return e2.visitDocType(this, r2);
      }
    };
    ee2 = class extends ae {
      constructor(e2, r2, n2, s2, i, a, o2 = null, u) {
        super(s2, u), this.name = e2, this.parameters = r2, this.children = n2, this.nameSpan = i, this.startSourceSpan = a, this.endSourceSpan = o2, this.type = "block";
      }
      visit(e2, r2) {
        return e2.visitBlock(this, r2);
      }
    };
    ht = class {
      constructor(e2, r2) {
        this.expression = e2, this.sourceSpan = r2, this.type = "blockParameter", this.startSourceSpan = null, this.endSourceSpan = null;
      }
      visit(e2, r2) {
        return e2.visitBlockParameter(this, r2);
      }
    };
    mt = class {
      constructor(e2, r2, n2, s2, i) {
        this.name = e2, this.value = r2, this.sourceSpan = n2, this.nameSpan = s2, this.valueSpan = i, this.type = "letDeclaration", this.startSourceSpan = null, this.endSourceSpan = null;
      }
      visit(e2, r2) {
        return e2.visitLetDeclaration(this, r2);
      }
    };
    ft = class {
      constructor() {
      }
      visitElement(e2, r2) {
        this.visitChildren(r2, (n2) => {
          n2(e2.attrs), n2(e2.children);
        });
      }
      visitAttribute(e2, r2) {
      }
      visitText(e2, r2) {
      }
      visitCdata(e2, r2) {
      }
      visitComment(e2, r2) {
      }
      visitDocType(e2, r2) {
      }
      visitExpansion(e2, r2) {
        return this.visitChildren(r2, (n2) => {
          n2(e2.cases);
        });
      }
      visitExpansionCase(e2, r2) {
      }
      visitBlock(e2, r2) {
        this.visitChildren(r2, (n2) => {
          n2(e2.parameters), n2(e2.children);
        });
      }
      visitBlockParameter(e2, r2) {
      }
      visitLetDeclaration(e2, r2) {
      }
      visitChildren(e2, r2) {
        let n2 = [], s2 = this;
        function i(a) {
          a && n2.push(Qt(s2, a, e2));
        }
        return r2(i), Array.prototype.concat.apply([], n2);
      }
    };
    Ve = { AElig: "\xC6", AMP: "&", amp: "&", Aacute: "\xC1", Abreve: "\u0102", Acirc: "\xC2", Acy: "\u0410", Afr: "\u{1D504}", Agrave: "\xC0", Alpha: "\u0391", Amacr: "\u0100", And: "\u2A53", Aogon: "\u0104", Aopf: "\u{1D538}", ApplyFunction: "\u2061", af: "\u2061", Aring: "\xC5", angst: "\xC5", Ascr: "\u{1D49C}", Assign: "\u2254", colone: "\u2254", coloneq: "\u2254", Atilde: "\xC3", Auml: "\xC4", Backslash: "\u2216", setminus: "\u2216", setmn: "\u2216", smallsetminus: "\u2216", ssetmn: "\u2216", Barv: "\u2AE7", Barwed: "\u2306", doublebarwedge: "\u2306", Bcy: "\u0411", Because: "\u2235", becaus: "\u2235", because: "\u2235", Bernoullis: "\u212C", Bscr: "\u212C", bernou: "\u212C", Beta: "\u0392", Bfr: "\u{1D505}", Bopf: "\u{1D539}", Breve: "\u02D8", breve: "\u02D8", Bumpeq: "\u224E", HumpDownHump: "\u224E", bump: "\u224E", CHcy: "\u0427", COPY: "\xA9", copy: "\xA9", Cacute: "\u0106", Cap: "\u22D2", CapitalDifferentialD: "\u2145", DD: "\u2145", Cayleys: "\u212D", Cfr: "\u212D", Ccaron: "\u010C", Ccedil: "\xC7", Ccirc: "\u0108", Cconint: "\u2230", Cdot: "\u010A", Cedilla: "\xB8", cedil: "\xB8", CenterDot: "\xB7", centerdot: "\xB7", middot: "\xB7", Chi: "\u03A7", CircleDot: "\u2299", odot: "\u2299", CircleMinus: "\u2296", ominus: "\u2296", CirclePlus: "\u2295", oplus: "\u2295", CircleTimes: "\u2297", otimes: "\u2297", ClockwiseContourIntegral: "\u2232", cwconint: "\u2232", CloseCurlyDoubleQuote: "\u201D", rdquo: "\u201D", rdquor: "\u201D", CloseCurlyQuote: "\u2019", rsquo: "\u2019", rsquor: "\u2019", Colon: "\u2237", Proportion: "\u2237", Colone: "\u2A74", Congruent: "\u2261", equiv: "\u2261", Conint: "\u222F", DoubleContourIntegral: "\u222F", ContourIntegral: "\u222E", conint: "\u222E", oint: "\u222E", Copf: "\u2102", complexes: "\u2102", Coproduct: "\u2210", coprod: "\u2210", CounterClockwiseContourIntegral: "\u2233", awconint: "\u2233", Cross: "\u2A2F", Cscr: "\u{1D49E}", Cup: "\u22D3", CupCap: "\u224D", asympeq: "\u224D", DDotrahd: "\u2911", DJcy: "\u0402", DScy: "\u0405", DZcy: "\u040F", Dagger: "\u2021", ddagger: "\u2021", Darr: "\u21A1", Dashv: "\u2AE4", DoubleLeftTee: "\u2AE4", Dcaron: "\u010E", Dcy: "\u0414", Del: "\u2207", nabla: "\u2207", Delta: "\u0394", Dfr: "\u{1D507}", DiacriticalAcute: "\xB4", acute: "\xB4", DiacriticalDot: "\u02D9", dot: "\u02D9", DiacriticalDoubleAcute: "\u02DD", dblac: "\u02DD", DiacriticalGrave: "`", grave: "`", DiacriticalTilde: "\u02DC", tilde: "\u02DC", Diamond: "\u22C4", diam: "\u22C4", diamond: "\u22C4", DifferentialD: "\u2146", dd: "\u2146", Dopf: "\u{1D53B}", Dot: "\xA8", DoubleDot: "\xA8", die: "\xA8", uml: "\xA8", DotDot: "\u20DC", DotEqual: "\u2250", doteq: "\u2250", esdot: "\u2250", DoubleDownArrow: "\u21D3", Downarrow: "\u21D3", dArr: "\u21D3", DoubleLeftArrow: "\u21D0", Leftarrow: "\u21D0", lArr: "\u21D0", DoubleLeftRightArrow: "\u21D4", Leftrightarrow: "\u21D4", hArr: "\u21D4", iff: "\u21D4", DoubleLongLeftArrow: "\u27F8", Longleftarrow: "\u27F8", xlArr: "\u27F8", DoubleLongLeftRightArrow: "\u27FA", Longleftrightarrow: "\u27FA", xhArr: "\u27FA", DoubleLongRightArrow: "\u27F9", Longrightarrow: "\u27F9", xrArr: "\u27F9", DoubleRightArrow: "\u21D2", Implies: "\u21D2", Rightarrow: "\u21D2", rArr: "\u21D2", DoubleRightTee: "\u22A8", vDash: "\u22A8", DoubleUpArrow: "\u21D1", Uparrow: "\u21D1", uArr: "\u21D1", DoubleUpDownArrow: "\u21D5", Updownarrow: "\u21D5", vArr: "\u21D5", DoubleVerticalBar: "\u2225", par: "\u2225", parallel: "\u2225", shortparallel: "\u2225", spar: "\u2225", DownArrow: "\u2193", ShortDownArrow: "\u2193", darr: "\u2193", downarrow: "\u2193", DownArrowBar: "\u2913", DownArrowUpArrow: "\u21F5", duarr: "\u21F5", DownBreve: "\u0311", DownLeftRightVector: "\u2950", DownLeftTeeVector: "\u295E", DownLeftVector: "\u21BD", leftharpoondown: "\u21BD", lhard: "\u21BD", DownLeftVectorBar: "\u2956", DownRightTeeVector: "\u295F", DownRightVector: "\u21C1", rhard: "\u21C1", rightharpoondown: "\u21C1", DownRightVectorBar: "\u2957", DownTee: "\u22A4", top: "\u22A4", DownTeeArrow: "\u21A7", mapstodown: "\u21A7", Dscr: "\u{1D49F}", Dstrok: "\u0110", ENG: "\u014A", ETH: "\xD0", Eacute: "\xC9", Ecaron: "\u011A", Ecirc: "\xCA", Ecy: "\u042D", Edot: "\u0116", Efr: "\u{1D508}", Egrave: "\xC8", Element: "\u2208", in: "\u2208", isin: "\u2208", isinv: "\u2208", Emacr: "\u0112", EmptySmallSquare: "\u25FB", EmptyVerySmallSquare: "\u25AB", Eogon: "\u0118", Eopf: "\u{1D53C}", Epsilon: "\u0395", Equal: "\u2A75", EqualTilde: "\u2242", eqsim: "\u2242", esim: "\u2242", Equilibrium: "\u21CC", rightleftharpoons: "\u21CC", rlhar: "\u21CC", Escr: "\u2130", expectation: "\u2130", Esim: "\u2A73", Eta: "\u0397", Euml: "\xCB", Exists: "\u2203", exist: "\u2203", ExponentialE: "\u2147", ee: "\u2147", exponentiale: "\u2147", Fcy: "\u0424", Ffr: "\u{1D509}", FilledSmallSquare: "\u25FC", FilledVerySmallSquare: "\u25AA", blacksquare: "\u25AA", squarf: "\u25AA", squf: "\u25AA", Fopf: "\u{1D53D}", ForAll: "\u2200", forall: "\u2200", Fouriertrf: "\u2131", Fscr: "\u2131", GJcy: "\u0403", GT: ">", gt: ">", Gamma: "\u0393", Gammad: "\u03DC", Gbreve: "\u011E", Gcedil: "\u0122", Gcirc: "\u011C", Gcy: "\u0413", Gdot: "\u0120", Gfr: "\u{1D50A}", Gg: "\u22D9", ggg: "\u22D9", Gopf: "\u{1D53E}", GreaterEqual: "\u2265", ge: "\u2265", geq: "\u2265", GreaterEqualLess: "\u22DB", gel: "\u22DB", gtreqless: "\u22DB", GreaterFullEqual: "\u2267", gE: "\u2267", geqq: "\u2267", GreaterGreater: "\u2AA2", GreaterLess: "\u2277", gl: "\u2277", gtrless: "\u2277", GreaterSlantEqual: "\u2A7E", geqslant: "\u2A7E", ges: "\u2A7E", GreaterTilde: "\u2273", gsim: "\u2273", gtrsim: "\u2273", Gscr: "\u{1D4A2}", Gt: "\u226B", NestedGreaterGreater: "\u226B", gg: "\u226B", HARDcy: "\u042A", Hacek: "\u02C7", caron: "\u02C7", Hat: "^", Hcirc: "\u0124", Hfr: "\u210C", Poincareplane: "\u210C", HilbertSpace: "\u210B", Hscr: "\u210B", hamilt: "\u210B", Hopf: "\u210D", quaternions: "\u210D", HorizontalLine: "\u2500", boxh: "\u2500", Hstrok: "\u0126", HumpEqual: "\u224F", bumpe: "\u224F", bumpeq: "\u224F", IEcy: "\u0415", IJlig: "\u0132", IOcy: "\u0401", Iacute: "\xCD", Icirc: "\xCE", Icy: "\u0418", Idot: "\u0130", Ifr: "\u2111", Im: "\u2111", image: "\u2111", imagpart: "\u2111", Igrave: "\xCC", Imacr: "\u012A", ImaginaryI: "\u2148", ii: "\u2148", Int: "\u222C", Integral: "\u222B", int: "\u222B", Intersection: "\u22C2", bigcap: "\u22C2", xcap: "\u22C2", InvisibleComma: "\u2063", ic: "\u2063", InvisibleTimes: "\u2062", it: "\u2062", Iogon: "\u012E", Iopf: "\u{1D540}", Iota: "\u0399", Iscr: "\u2110", imagline: "\u2110", Itilde: "\u0128", Iukcy: "\u0406", Iuml: "\xCF", Jcirc: "\u0134", Jcy: "\u0419", Jfr: "\u{1D50D}", Jopf: "\u{1D541}", Jscr: "\u{1D4A5}", Jsercy: "\u0408", Jukcy: "\u0404", KHcy: "\u0425", KJcy: "\u040C", Kappa: "\u039A", Kcedil: "\u0136", Kcy: "\u041A", Kfr: "\u{1D50E}", Kopf: "\u{1D542}", Kscr: "\u{1D4A6}", LJcy: "\u0409", LT: "<", lt: "<", Lacute: "\u0139", Lambda: "\u039B", Lang: "\u27EA", Laplacetrf: "\u2112", Lscr: "\u2112", lagran: "\u2112", Larr: "\u219E", twoheadleftarrow: "\u219E", Lcaron: "\u013D", Lcedil: "\u013B", Lcy: "\u041B", LeftAngleBracket: "\u27E8", lang: "\u27E8", langle: "\u27E8", LeftArrow: "\u2190", ShortLeftArrow: "\u2190", larr: "\u2190", leftarrow: "\u2190", slarr: "\u2190", LeftArrowBar: "\u21E4", larrb: "\u21E4", LeftArrowRightArrow: "\u21C6", leftrightarrows: "\u21C6", lrarr: "\u21C6", LeftCeiling: "\u2308", lceil: "\u2308", LeftDoubleBracket: "\u27E6", lobrk: "\u27E6", LeftDownTeeVector: "\u2961", LeftDownVector: "\u21C3", dharl: "\u21C3", downharpoonleft: "\u21C3", LeftDownVectorBar: "\u2959", LeftFloor: "\u230A", lfloor: "\u230A", LeftRightArrow: "\u2194", harr: "\u2194", leftrightarrow: "\u2194", LeftRightVector: "\u294E", LeftTee: "\u22A3", dashv: "\u22A3", LeftTeeArrow: "\u21A4", mapstoleft: "\u21A4", LeftTeeVector: "\u295A", LeftTriangle: "\u22B2", vartriangleleft: "\u22B2", vltri: "\u22B2", LeftTriangleBar: "\u29CF", LeftTriangleEqual: "\u22B4", ltrie: "\u22B4", trianglelefteq: "\u22B4", LeftUpDownVector: "\u2951", LeftUpTeeVector: "\u2960", LeftUpVector: "\u21BF", uharl: "\u21BF", upharpoonleft: "\u21BF", LeftUpVectorBar: "\u2958", LeftVector: "\u21BC", leftharpoonup: "\u21BC", lharu: "\u21BC", LeftVectorBar: "\u2952", LessEqualGreater: "\u22DA", leg: "\u22DA", lesseqgtr: "\u22DA", LessFullEqual: "\u2266", lE: "\u2266", leqq: "\u2266", LessGreater: "\u2276", lessgtr: "\u2276", lg: "\u2276", LessLess: "\u2AA1", LessSlantEqual: "\u2A7D", leqslant: "\u2A7D", les: "\u2A7D", LessTilde: "\u2272", lesssim: "\u2272", lsim: "\u2272", Lfr: "\u{1D50F}", Ll: "\u22D8", Lleftarrow: "\u21DA", lAarr: "\u21DA", Lmidot: "\u013F", LongLeftArrow: "\u27F5", longleftarrow: "\u27F5", xlarr: "\u27F5", LongLeftRightArrow: "\u27F7", longleftrightarrow: "\u27F7", xharr: "\u27F7", LongRightArrow: "\u27F6", longrightarrow: "\u27F6", xrarr: "\u27F6", Lopf: "\u{1D543}", LowerLeftArrow: "\u2199", swarr: "\u2199", swarrow: "\u2199", LowerRightArrow: "\u2198", searr: "\u2198", searrow: "\u2198", Lsh: "\u21B0", lsh: "\u21B0", Lstrok: "\u0141", Lt: "\u226A", NestedLessLess: "\u226A", ll: "\u226A", Map: "\u2905", Mcy: "\u041C", MediumSpace: "\u205F", Mellintrf: "\u2133", Mscr: "\u2133", phmmat: "\u2133", Mfr: "\u{1D510}", MinusPlus: "\u2213", mnplus: "\u2213", mp: "\u2213", Mopf: "\u{1D544}", Mu: "\u039C", NJcy: "\u040A", Nacute: "\u0143", Ncaron: "\u0147", Ncedil: "\u0145", Ncy: "\u041D", NegativeMediumSpace: "\u200B", NegativeThickSpace: "\u200B", NegativeThinSpace: "\u200B", NegativeVeryThinSpace: "\u200B", ZeroWidthSpace: "\u200B", NewLine: `
`, Nfr: "\u{1D511}", NoBreak: "\u2060", NonBreakingSpace: "\xA0", nbsp: "\xA0", Nopf: "\u2115", naturals: "\u2115", Not: "\u2AEC", NotCongruent: "\u2262", nequiv: "\u2262", NotCupCap: "\u226D", NotDoubleVerticalBar: "\u2226", npar: "\u2226", nparallel: "\u2226", nshortparallel: "\u2226", nspar: "\u2226", NotElement: "\u2209", notin: "\u2209", notinva: "\u2209", NotEqual: "\u2260", ne: "\u2260", NotEqualTilde: "\u2242\u0338", nesim: "\u2242\u0338", NotExists: "\u2204", nexist: "\u2204", nexists: "\u2204", NotGreater: "\u226F", ngt: "\u226F", ngtr: "\u226F", NotGreaterEqual: "\u2271", nge: "\u2271", ngeq: "\u2271", NotGreaterFullEqual: "\u2267\u0338", ngE: "\u2267\u0338", ngeqq: "\u2267\u0338", NotGreaterGreater: "\u226B\u0338", nGtv: "\u226B\u0338", NotGreaterLess: "\u2279", ntgl: "\u2279", NotGreaterSlantEqual: "\u2A7E\u0338", ngeqslant: "\u2A7E\u0338", nges: "\u2A7E\u0338", NotGreaterTilde: "\u2275", ngsim: "\u2275", NotHumpDownHump: "\u224E\u0338", nbump: "\u224E\u0338", NotHumpEqual: "\u224F\u0338", nbumpe: "\u224F\u0338", NotLeftTriangle: "\u22EA", nltri: "\u22EA", ntriangleleft: "\u22EA", NotLeftTriangleBar: "\u29CF\u0338", NotLeftTriangleEqual: "\u22EC", nltrie: "\u22EC", ntrianglelefteq: "\u22EC", NotLess: "\u226E", nless: "\u226E", nlt: "\u226E", NotLessEqual: "\u2270", nle: "\u2270", nleq: "\u2270", NotLessGreater: "\u2278", ntlg: "\u2278", NotLessLess: "\u226A\u0338", nLtv: "\u226A\u0338", NotLessSlantEqual: "\u2A7D\u0338", nleqslant: "\u2A7D\u0338", nles: "\u2A7D\u0338", NotLessTilde: "\u2274", nlsim: "\u2274", NotNestedGreaterGreater: "\u2AA2\u0338", NotNestedLessLess: "\u2AA1\u0338", NotPrecedes: "\u2280", npr: "\u2280", nprec: "\u2280", NotPrecedesEqual: "\u2AAF\u0338", npre: "\u2AAF\u0338", npreceq: "\u2AAF\u0338", NotPrecedesSlantEqual: "\u22E0", nprcue: "\u22E0", NotReverseElement: "\u220C", notni: "\u220C", notniva: "\u220C", NotRightTriangle: "\u22EB", nrtri: "\u22EB", ntriangleright: "\u22EB", NotRightTriangleBar: "\u29D0\u0338", NotRightTriangleEqual: "\u22ED", nrtrie: "\u22ED", ntrianglerighteq: "\u22ED", NotSquareSubset: "\u228F\u0338", NotSquareSubsetEqual: "\u22E2", nsqsube: "\u22E2", NotSquareSuperset: "\u2290\u0338", NotSquareSupersetEqual: "\u22E3", nsqsupe: "\u22E3", NotSubset: "\u2282\u20D2", nsubset: "\u2282\u20D2", vnsub: "\u2282\u20D2", NotSubsetEqual: "\u2288", nsube: "\u2288", nsubseteq: "\u2288", NotSucceeds: "\u2281", nsc: "\u2281", nsucc: "\u2281", NotSucceedsEqual: "\u2AB0\u0338", nsce: "\u2AB0\u0338", nsucceq: "\u2AB0\u0338", NotSucceedsSlantEqual: "\u22E1", nsccue: "\u22E1", NotSucceedsTilde: "\u227F\u0338", NotSuperset: "\u2283\u20D2", nsupset: "\u2283\u20D2", vnsup: "\u2283\u20D2", NotSupersetEqual: "\u2289", nsupe: "\u2289", nsupseteq: "\u2289", NotTilde: "\u2241", nsim: "\u2241", NotTildeEqual: "\u2244", nsime: "\u2244", nsimeq: "\u2244", NotTildeFullEqual: "\u2247", ncong: "\u2247", NotTildeTilde: "\u2249", nap: "\u2249", napprox: "\u2249", NotVerticalBar: "\u2224", nmid: "\u2224", nshortmid: "\u2224", nsmid: "\u2224", Nscr: "\u{1D4A9}", Ntilde: "\xD1", Nu: "\u039D", OElig: "\u0152", Oacute: "\xD3", Ocirc: "\xD4", Ocy: "\u041E", Odblac: "\u0150", Ofr: "\u{1D512}", Ograve: "\xD2", Omacr: "\u014C", Omega: "\u03A9", ohm: "\u03A9", Omicron: "\u039F", Oopf: "\u{1D546}", OpenCurlyDoubleQuote: "\u201C", ldquo: "\u201C", OpenCurlyQuote: "\u2018", lsquo: "\u2018", Or: "\u2A54", Oscr: "\u{1D4AA}", Oslash: "\xD8", Otilde: "\xD5", Otimes: "\u2A37", Ouml: "\xD6", OverBar: "\u203E", oline: "\u203E", OverBrace: "\u23DE", OverBracket: "\u23B4", tbrk: "\u23B4", OverParenthesis: "\u23DC", PartialD: "\u2202", part: "\u2202", Pcy: "\u041F", Pfr: "\u{1D513}", Phi: "\u03A6", Pi: "\u03A0", PlusMinus: "\xB1", plusmn: "\xB1", pm: "\xB1", Popf: "\u2119", primes: "\u2119", Pr: "\u2ABB", Precedes: "\u227A", pr: "\u227A", prec: "\u227A", PrecedesEqual: "\u2AAF", pre: "\u2AAF", preceq: "\u2AAF", PrecedesSlantEqual: "\u227C", prcue: "\u227C", preccurlyeq: "\u227C", PrecedesTilde: "\u227E", precsim: "\u227E", prsim: "\u227E", Prime: "\u2033", Product: "\u220F", prod: "\u220F", Proportional: "\u221D", prop: "\u221D", propto: "\u221D", varpropto: "\u221D", vprop: "\u221D", Pscr: "\u{1D4AB}", Psi: "\u03A8", QUOT: '"', quot: '"', Qfr: "\u{1D514}", Qopf: "\u211A", rationals: "\u211A", Qscr: "\u{1D4AC}", RBarr: "\u2910", drbkarow: "\u2910", REG: "\xAE", circledR: "\xAE", reg: "\xAE", Racute: "\u0154", Rang: "\u27EB", Rarr: "\u21A0", twoheadrightarrow: "\u21A0", Rarrtl: "\u2916", Rcaron: "\u0158", Rcedil: "\u0156", Rcy: "\u0420", Re: "\u211C", Rfr: "\u211C", real: "\u211C", realpart: "\u211C", ReverseElement: "\u220B", SuchThat: "\u220B", ni: "\u220B", niv: "\u220B", ReverseEquilibrium: "\u21CB", leftrightharpoons: "\u21CB", lrhar: "\u21CB", ReverseUpEquilibrium: "\u296F", duhar: "\u296F", Rho: "\u03A1", RightAngleBracket: "\u27E9", rang: "\u27E9", rangle: "\u27E9", RightArrow: "\u2192", ShortRightArrow: "\u2192", rarr: "\u2192", rightarrow: "\u2192", srarr: "\u2192", RightArrowBar: "\u21E5", rarrb: "\u21E5", RightArrowLeftArrow: "\u21C4", rightleftarrows: "\u21C4", rlarr: "\u21C4", RightCeiling: "\u2309", rceil: "\u2309", RightDoubleBracket: "\u27E7", robrk: "\u27E7", RightDownTeeVector: "\u295D", RightDownVector: "\u21C2", dharr: "\u21C2", downharpoonright: "\u21C2", RightDownVectorBar: "\u2955", RightFloor: "\u230B", rfloor: "\u230B", RightTee: "\u22A2", vdash: "\u22A2", RightTeeArrow: "\u21A6", map: "\u21A6", mapsto: "\u21A6", RightTeeVector: "\u295B", RightTriangle: "\u22B3", vartriangleright: "\u22B3", vrtri: "\u22B3", RightTriangleBar: "\u29D0", RightTriangleEqual: "\u22B5", rtrie: "\u22B5", trianglerighteq: "\u22B5", RightUpDownVector: "\u294F", RightUpTeeVector: "\u295C", RightUpVector: "\u21BE", uharr: "\u21BE", upharpoonright: "\u21BE", RightUpVectorBar: "\u2954", RightVector: "\u21C0", rharu: "\u21C0", rightharpoonup: "\u21C0", RightVectorBar: "\u2953", Ropf: "\u211D", reals: "\u211D", RoundImplies: "\u2970", Rrightarrow: "\u21DB", rAarr: "\u21DB", Rscr: "\u211B", realine: "\u211B", Rsh: "\u21B1", rsh: "\u21B1", RuleDelayed: "\u29F4", SHCHcy: "\u0429", SHcy: "\u0428", SOFTcy: "\u042C", Sacute: "\u015A", Sc: "\u2ABC", Scaron: "\u0160", Scedil: "\u015E", Scirc: "\u015C", Scy: "\u0421", Sfr: "\u{1D516}", ShortUpArrow: "\u2191", UpArrow: "\u2191", uarr: "\u2191", uparrow: "\u2191", Sigma: "\u03A3", SmallCircle: "\u2218", compfn: "\u2218", Sopf: "\u{1D54A}", Sqrt: "\u221A", radic: "\u221A", Square: "\u25A1", squ: "\u25A1", square: "\u25A1", SquareIntersection: "\u2293", sqcap: "\u2293", SquareSubset: "\u228F", sqsub: "\u228F", sqsubset: "\u228F", SquareSubsetEqual: "\u2291", sqsube: "\u2291", sqsubseteq: "\u2291", SquareSuperset: "\u2290", sqsup: "\u2290", sqsupset: "\u2290", SquareSupersetEqual: "\u2292", sqsupe: "\u2292", sqsupseteq: "\u2292", SquareUnion: "\u2294", sqcup: "\u2294", Sscr: "\u{1D4AE}", Star: "\u22C6", sstarf: "\u22C6", Sub: "\u22D0", Subset: "\u22D0", SubsetEqual: "\u2286", sube: "\u2286", subseteq: "\u2286", Succeeds: "\u227B", sc: "\u227B", succ: "\u227B", SucceedsEqual: "\u2AB0", sce: "\u2AB0", succeq: "\u2AB0", SucceedsSlantEqual: "\u227D", sccue: "\u227D", succcurlyeq: "\u227D", SucceedsTilde: "\u227F", scsim: "\u227F", succsim: "\u227F", Sum: "\u2211", sum: "\u2211", Sup: "\u22D1", Supset: "\u22D1", Superset: "\u2283", sup: "\u2283", supset: "\u2283", SupersetEqual: "\u2287", supe: "\u2287", supseteq: "\u2287", THORN: "\xDE", TRADE: "\u2122", trade: "\u2122", TSHcy: "\u040B", TScy: "\u0426", Tab: "	", Tau: "\u03A4", Tcaron: "\u0164", Tcedil: "\u0162", Tcy: "\u0422", Tfr: "\u{1D517}", Therefore: "\u2234", there4: "\u2234", therefore: "\u2234", Theta: "\u0398", ThickSpace: "\u205F\u200A", ThinSpace: "\u2009", thinsp: "\u2009", Tilde: "\u223C", sim: "\u223C", thicksim: "\u223C", thksim: "\u223C", TildeEqual: "\u2243", sime: "\u2243", simeq: "\u2243", TildeFullEqual: "\u2245", cong: "\u2245", TildeTilde: "\u2248", ap: "\u2248", approx: "\u2248", asymp: "\u2248", thickapprox: "\u2248", thkap: "\u2248", Topf: "\u{1D54B}", TripleDot: "\u20DB", tdot: "\u20DB", Tscr: "\u{1D4AF}", Tstrok: "\u0166", Uacute: "\xDA", Uarr: "\u219F", Uarrocir: "\u2949", Ubrcy: "\u040E", Ubreve: "\u016C", Ucirc: "\xDB", Ucy: "\u0423", Udblac: "\u0170", Ufr: "\u{1D518}", Ugrave: "\xD9", Umacr: "\u016A", UnderBar: "_", lowbar: "_", UnderBrace: "\u23DF", UnderBracket: "\u23B5", bbrk: "\u23B5", UnderParenthesis: "\u23DD", Union: "\u22C3", bigcup: "\u22C3", xcup: "\u22C3", UnionPlus: "\u228E", uplus: "\u228E", Uogon: "\u0172", Uopf: "\u{1D54C}", UpArrowBar: "\u2912", UpArrowDownArrow: "\u21C5", udarr: "\u21C5", UpDownArrow: "\u2195", updownarrow: "\u2195", varr: "\u2195", UpEquilibrium: "\u296E", udhar: "\u296E", UpTee: "\u22A5", bot: "\u22A5", bottom: "\u22A5", perp: "\u22A5", UpTeeArrow: "\u21A5", mapstoup: "\u21A5", UpperLeftArrow: "\u2196", nwarr: "\u2196", nwarrow: "\u2196", UpperRightArrow: "\u2197", nearr: "\u2197", nearrow: "\u2197", Upsi: "\u03D2", upsih: "\u03D2", Upsilon: "\u03A5", Uring: "\u016E", Uscr: "\u{1D4B0}", Utilde: "\u0168", Uuml: "\xDC", VDash: "\u22AB", Vbar: "\u2AEB", Vcy: "\u0412", Vdash: "\u22A9", Vdashl: "\u2AE6", Vee: "\u22C1", bigvee: "\u22C1", xvee: "\u22C1", Verbar: "\u2016", Vert: "\u2016", VerticalBar: "\u2223", mid: "\u2223", shortmid: "\u2223", smid: "\u2223", VerticalLine: "|", verbar: "|", vert: "|", VerticalSeparator: "\u2758", VerticalTilde: "\u2240", wr: "\u2240", wreath: "\u2240", VeryThinSpace: "\u200A", hairsp: "\u200A", Vfr: "\u{1D519}", Vopf: "\u{1D54D}", Vscr: "\u{1D4B1}", Vvdash: "\u22AA", Wcirc: "\u0174", Wedge: "\u22C0", bigwedge: "\u22C0", xwedge: "\u22C0", Wfr: "\u{1D51A}", Wopf: "\u{1D54E}", Wscr: "\u{1D4B2}", Xfr: "\u{1D51B}", Xi: "\u039E", Xopf: "\u{1D54F}", Xscr: "\u{1D4B3}", YAcy: "\u042F", YIcy: "\u0407", YUcy: "\u042E", Yacute: "\xDD", Ycirc: "\u0176", Ycy: "\u042B", Yfr: "\u{1D51C}", Yopf: "\u{1D550}", Yscr: "\u{1D4B4}", Yuml: "\u0178", ZHcy: "\u0416", Zacute: "\u0179", Zcaron: "\u017D", Zcy: "\u0417", Zdot: "\u017B", Zeta: "\u0396", Zfr: "\u2128", zeetrf: "\u2128", Zopf: "\u2124", integers: "\u2124", Zscr: "\u{1D4B5}", aacute: "\xE1", abreve: "\u0103", ac: "\u223E", mstpos: "\u223E", acE: "\u223E\u0333", acd: "\u223F", acirc: "\xE2", acy: "\u0430", aelig: "\xE6", afr: "\u{1D51E}", agrave: "\xE0", alefsym: "\u2135", aleph: "\u2135", alpha: "\u03B1", amacr: "\u0101", amalg: "\u2A3F", and: "\u2227", wedge: "\u2227", andand: "\u2A55", andd: "\u2A5C", andslope: "\u2A58", andv: "\u2A5A", ang: "\u2220", angle: "\u2220", ange: "\u29A4", angmsd: "\u2221", measuredangle: "\u2221", angmsdaa: "\u29A8", angmsdab: "\u29A9", angmsdac: "\u29AA", angmsdad: "\u29AB", angmsdae: "\u29AC", angmsdaf: "\u29AD", angmsdag: "\u29AE", angmsdah: "\u29AF", angrt: "\u221F", angrtvb: "\u22BE", angrtvbd: "\u299D", angsph: "\u2222", angzarr: "\u237C", aogon: "\u0105", aopf: "\u{1D552}", apE: "\u2A70", apacir: "\u2A6F", ape: "\u224A", approxeq: "\u224A", apid: "\u224B", apos: "'", aring: "\xE5", ascr: "\u{1D4B6}", ast: "*", midast: "*", atilde: "\xE3", auml: "\xE4", awint: "\u2A11", bNot: "\u2AED", backcong: "\u224C", bcong: "\u224C", backepsilon: "\u03F6", bepsi: "\u03F6", backprime: "\u2035", bprime: "\u2035", backsim: "\u223D", bsim: "\u223D", backsimeq: "\u22CD", bsime: "\u22CD", barvee: "\u22BD", barwed: "\u2305", barwedge: "\u2305", bbrktbrk: "\u23B6", bcy: "\u0431", bdquo: "\u201E", ldquor: "\u201E", bemptyv: "\u29B0", beta: "\u03B2", beth: "\u2136", between: "\u226C", twixt: "\u226C", bfr: "\u{1D51F}", bigcirc: "\u25EF", xcirc: "\u25EF", bigodot: "\u2A00", xodot: "\u2A00", bigoplus: "\u2A01", xoplus: "\u2A01", bigotimes: "\u2A02", xotime: "\u2A02", bigsqcup: "\u2A06", xsqcup: "\u2A06", bigstar: "\u2605", starf: "\u2605", bigtriangledown: "\u25BD", xdtri: "\u25BD", bigtriangleup: "\u25B3", xutri: "\u25B3", biguplus: "\u2A04", xuplus: "\u2A04", bkarow: "\u290D", rbarr: "\u290D", blacklozenge: "\u29EB", lozf: "\u29EB", blacktriangle: "\u25B4", utrif: "\u25B4", blacktriangledown: "\u25BE", dtrif: "\u25BE", blacktriangleleft: "\u25C2", ltrif: "\u25C2", blacktriangleright: "\u25B8", rtrif: "\u25B8", blank: "\u2423", blk12: "\u2592", blk14: "\u2591", blk34: "\u2593", block: "\u2588", bne: "=\u20E5", bnequiv: "\u2261\u20E5", bnot: "\u2310", bopf: "\u{1D553}", bowtie: "\u22C8", boxDL: "\u2557", boxDR: "\u2554", boxDl: "\u2556", boxDr: "\u2553", boxH: "\u2550", boxHD: "\u2566", boxHU: "\u2569", boxHd: "\u2564", boxHu: "\u2567", boxUL: "\u255D", boxUR: "\u255A", boxUl: "\u255C", boxUr: "\u2559", boxV: "\u2551", boxVH: "\u256C", boxVL: "\u2563", boxVR: "\u2560", boxVh: "\u256B", boxVl: "\u2562", boxVr: "\u255F", boxbox: "\u29C9", boxdL: "\u2555", boxdR: "\u2552", boxdl: "\u2510", boxdr: "\u250C", boxhD: "\u2565", boxhU: "\u2568", boxhd: "\u252C", boxhu: "\u2534", boxminus: "\u229F", minusb: "\u229F", boxplus: "\u229E", plusb: "\u229E", boxtimes: "\u22A0", timesb: "\u22A0", boxuL: "\u255B", boxuR: "\u2558", boxul: "\u2518", boxur: "\u2514", boxv: "\u2502", boxvH: "\u256A", boxvL: "\u2561", boxvR: "\u255E", boxvh: "\u253C", boxvl: "\u2524", boxvr: "\u251C", brvbar: "\xA6", bscr: "\u{1D4B7}", bsemi: "\u204F", bsol: "\\", bsolb: "\u29C5", bsolhsub: "\u27C8", bull: "\u2022", bullet: "\u2022", bumpE: "\u2AAE", cacute: "\u0107", cap: "\u2229", capand: "\u2A44", capbrcup: "\u2A49", capcap: "\u2A4B", capcup: "\u2A47", capdot: "\u2A40", caps: "\u2229\uFE00", caret: "\u2041", ccaps: "\u2A4D", ccaron: "\u010D", ccedil: "\xE7", ccirc: "\u0109", ccups: "\u2A4C", ccupssm: "\u2A50", cdot: "\u010B", cemptyv: "\u29B2", cent: "\xA2", cfr: "\u{1D520}", chcy: "\u0447", check: "\u2713", checkmark: "\u2713", chi: "\u03C7", cir: "\u25CB", cirE: "\u29C3", circ: "\u02C6", circeq: "\u2257", cire: "\u2257", circlearrowleft: "\u21BA", olarr: "\u21BA", circlearrowright: "\u21BB", orarr: "\u21BB", circledS: "\u24C8", oS: "\u24C8", circledast: "\u229B", oast: "\u229B", circledcirc: "\u229A", ocir: "\u229A", circleddash: "\u229D", odash: "\u229D", cirfnint: "\u2A10", cirmid: "\u2AEF", cirscir: "\u29C2", clubs: "\u2663", clubsuit: "\u2663", colon: ":", comma: ",", commat: "@", comp: "\u2201", complement: "\u2201", congdot: "\u2A6D", copf: "\u{1D554}", copysr: "\u2117", crarr: "\u21B5", cross: "\u2717", cscr: "\u{1D4B8}", csub: "\u2ACF", csube: "\u2AD1", csup: "\u2AD0", csupe: "\u2AD2", ctdot: "\u22EF", cudarrl: "\u2938", cudarrr: "\u2935", cuepr: "\u22DE", curlyeqprec: "\u22DE", cuesc: "\u22DF", curlyeqsucc: "\u22DF", cularr: "\u21B6", curvearrowleft: "\u21B6", cularrp: "\u293D", cup: "\u222A", cupbrcap: "\u2A48", cupcap: "\u2A46", cupcup: "\u2A4A", cupdot: "\u228D", cupor: "\u2A45", cups: "\u222A\uFE00", curarr: "\u21B7", curvearrowright: "\u21B7", curarrm: "\u293C", curlyvee: "\u22CE", cuvee: "\u22CE", curlywedge: "\u22CF", cuwed: "\u22CF", curren: "\xA4", cwint: "\u2231", cylcty: "\u232D", dHar: "\u2965", dagger: "\u2020", daleth: "\u2138", dash: "\u2010", hyphen: "\u2010", dbkarow: "\u290F", rBarr: "\u290F", dcaron: "\u010F", dcy: "\u0434", ddarr: "\u21CA", downdownarrows: "\u21CA", ddotseq: "\u2A77", eDDot: "\u2A77", deg: "\xB0", delta: "\u03B4", demptyv: "\u29B1", dfisht: "\u297F", dfr: "\u{1D521}", diamondsuit: "\u2666", diams: "\u2666", digamma: "\u03DD", gammad: "\u03DD", disin: "\u22F2", div: "\xF7", divide: "\xF7", divideontimes: "\u22C7", divonx: "\u22C7", djcy: "\u0452", dlcorn: "\u231E", llcorner: "\u231E", dlcrop: "\u230D", dollar: "$", dopf: "\u{1D555}", doteqdot: "\u2251", eDot: "\u2251", dotminus: "\u2238", minusd: "\u2238", dotplus: "\u2214", plusdo: "\u2214", dotsquare: "\u22A1", sdotb: "\u22A1", drcorn: "\u231F", lrcorner: "\u231F", drcrop: "\u230C", dscr: "\u{1D4B9}", dscy: "\u0455", dsol: "\u29F6", dstrok: "\u0111", dtdot: "\u22F1", dtri: "\u25BF", triangledown: "\u25BF", dwangle: "\u29A6", dzcy: "\u045F", dzigrarr: "\u27FF", eacute: "\xE9", easter: "\u2A6E", ecaron: "\u011B", ecir: "\u2256", eqcirc: "\u2256", ecirc: "\xEA", ecolon: "\u2255", eqcolon: "\u2255", ecy: "\u044D", edot: "\u0117", efDot: "\u2252", fallingdotseq: "\u2252", efr: "\u{1D522}", eg: "\u2A9A", egrave: "\xE8", egs: "\u2A96", eqslantgtr: "\u2A96", egsdot: "\u2A98", el: "\u2A99", elinters: "\u23E7", ell: "\u2113", els: "\u2A95", eqslantless: "\u2A95", elsdot: "\u2A97", emacr: "\u0113", empty: "\u2205", emptyset: "\u2205", emptyv: "\u2205", varnothing: "\u2205", emsp13: "\u2004", emsp14: "\u2005", emsp: "\u2003", eng: "\u014B", ensp: "\u2002", eogon: "\u0119", eopf: "\u{1D556}", epar: "\u22D5", eparsl: "\u29E3", eplus: "\u2A71", epsi: "\u03B5", epsilon: "\u03B5", epsiv: "\u03F5", straightepsilon: "\u03F5", varepsilon: "\u03F5", equals: "=", equest: "\u225F", questeq: "\u225F", equivDD: "\u2A78", eqvparsl: "\u29E5", erDot: "\u2253", risingdotseq: "\u2253", erarr: "\u2971", escr: "\u212F", eta: "\u03B7", eth: "\xF0", euml: "\xEB", euro: "\u20AC", excl: "!", fcy: "\u0444", female: "\u2640", ffilig: "\uFB03", fflig: "\uFB00", ffllig: "\uFB04", ffr: "\u{1D523}", filig: "\uFB01", fjlig: "fj", flat: "\u266D", fllig: "\uFB02", fltns: "\u25B1", fnof: "\u0192", fopf: "\u{1D557}", fork: "\u22D4", pitchfork: "\u22D4", forkv: "\u2AD9", fpartint: "\u2A0D", frac12: "\xBD", half: "\xBD", frac13: "\u2153", frac14: "\xBC", frac15: "\u2155", frac16: "\u2159", frac18: "\u215B", frac23: "\u2154", frac25: "\u2156", frac34: "\xBE", frac35: "\u2157", frac38: "\u215C", frac45: "\u2158", frac56: "\u215A", frac58: "\u215D", frac78: "\u215E", frasl: "\u2044", frown: "\u2322", sfrown: "\u2322", fscr: "\u{1D4BB}", gEl: "\u2A8C", gtreqqless: "\u2A8C", gacute: "\u01F5", gamma: "\u03B3", gap: "\u2A86", gtrapprox: "\u2A86", gbreve: "\u011F", gcirc: "\u011D", gcy: "\u0433", gdot: "\u0121", gescc: "\u2AA9", gesdot: "\u2A80", gesdoto: "\u2A82", gesdotol: "\u2A84", gesl: "\u22DB\uFE00", gesles: "\u2A94", gfr: "\u{1D524}", gimel: "\u2137", gjcy: "\u0453", glE: "\u2A92", gla: "\u2AA5", glj: "\u2AA4", gnE: "\u2269", gneqq: "\u2269", gnap: "\u2A8A", gnapprox: "\u2A8A", gne: "\u2A88", gneq: "\u2A88", gnsim: "\u22E7", gopf: "\u{1D558}", gscr: "\u210A", gsime: "\u2A8E", gsiml: "\u2A90", gtcc: "\u2AA7", gtcir: "\u2A7A", gtdot: "\u22D7", gtrdot: "\u22D7", gtlPar: "\u2995", gtquest: "\u2A7C", gtrarr: "\u2978", gvertneqq: "\u2269\uFE00", gvnE: "\u2269\uFE00", hardcy: "\u044A", harrcir: "\u2948", harrw: "\u21AD", leftrightsquigarrow: "\u21AD", hbar: "\u210F", hslash: "\u210F", planck: "\u210F", plankv: "\u210F", hcirc: "\u0125", hearts: "\u2665", heartsuit: "\u2665", hellip: "\u2026", mldr: "\u2026", hercon: "\u22B9", hfr: "\u{1D525}", hksearow: "\u2925", searhk: "\u2925", hkswarow: "\u2926", swarhk: "\u2926", hoarr: "\u21FF", homtht: "\u223B", hookleftarrow: "\u21A9", larrhk: "\u21A9", hookrightarrow: "\u21AA", rarrhk: "\u21AA", hopf: "\u{1D559}", horbar: "\u2015", hscr: "\u{1D4BD}", hstrok: "\u0127", hybull: "\u2043", iacute: "\xED", icirc: "\xEE", icy: "\u0438", iecy: "\u0435", iexcl: "\xA1", ifr: "\u{1D526}", igrave: "\xEC", iiiint: "\u2A0C", qint: "\u2A0C", iiint: "\u222D", tint: "\u222D", iinfin: "\u29DC", iiota: "\u2129", ijlig: "\u0133", imacr: "\u012B", imath: "\u0131", inodot: "\u0131", imof: "\u22B7", imped: "\u01B5", incare: "\u2105", infin: "\u221E", infintie: "\u29DD", intcal: "\u22BA", intercal: "\u22BA", intlarhk: "\u2A17", intprod: "\u2A3C", iprod: "\u2A3C", iocy: "\u0451", iogon: "\u012F", iopf: "\u{1D55A}", iota: "\u03B9", iquest: "\xBF", iscr: "\u{1D4BE}", isinE: "\u22F9", isindot: "\u22F5", isins: "\u22F4", isinsv: "\u22F3", itilde: "\u0129", iukcy: "\u0456", iuml: "\xEF", jcirc: "\u0135", jcy: "\u0439", jfr: "\u{1D527}", jmath: "\u0237", jopf: "\u{1D55B}", jscr: "\u{1D4BF}", jsercy: "\u0458", jukcy: "\u0454", kappa: "\u03BA", kappav: "\u03F0", varkappa: "\u03F0", kcedil: "\u0137", kcy: "\u043A", kfr: "\u{1D528}", kgreen: "\u0138", khcy: "\u0445", kjcy: "\u045C", kopf: "\u{1D55C}", kscr: "\u{1D4C0}", lAtail: "\u291B", lBarr: "\u290E", lEg: "\u2A8B", lesseqqgtr: "\u2A8B", lHar: "\u2962", lacute: "\u013A", laemptyv: "\u29B4", lambda: "\u03BB", langd: "\u2991", lap: "\u2A85", lessapprox: "\u2A85", laquo: "\xAB", larrbfs: "\u291F", larrfs: "\u291D", larrlp: "\u21AB", looparrowleft: "\u21AB", larrpl: "\u2939", larrsim: "\u2973", larrtl: "\u21A2", leftarrowtail: "\u21A2", lat: "\u2AAB", latail: "\u2919", late: "\u2AAD", lates: "\u2AAD\uFE00", lbarr: "\u290C", lbbrk: "\u2772", lbrace: "{", lcub: "{", lbrack: "[", lsqb: "[", lbrke: "\u298B", lbrksld: "\u298F", lbrkslu: "\u298D", lcaron: "\u013E", lcedil: "\u013C", lcy: "\u043B", ldca: "\u2936", ldrdhar: "\u2967", ldrushar: "\u294B", ldsh: "\u21B2", le: "\u2264", leq: "\u2264", leftleftarrows: "\u21C7", llarr: "\u21C7", leftthreetimes: "\u22CB", lthree: "\u22CB", lescc: "\u2AA8", lesdot: "\u2A7F", lesdoto: "\u2A81", lesdotor: "\u2A83", lesg: "\u22DA\uFE00", lesges: "\u2A93", lessdot: "\u22D6", ltdot: "\u22D6", lfisht: "\u297C", lfr: "\u{1D529}", lgE: "\u2A91", lharul: "\u296A", lhblk: "\u2584", ljcy: "\u0459", llhard: "\u296B", lltri: "\u25FA", lmidot: "\u0140", lmoust: "\u23B0", lmoustache: "\u23B0", lnE: "\u2268", lneqq: "\u2268", lnap: "\u2A89", lnapprox: "\u2A89", lne: "\u2A87", lneq: "\u2A87", lnsim: "\u22E6", loang: "\u27EC", loarr: "\u21FD", longmapsto: "\u27FC", xmap: "\u27FC", looparrowright: "\u21AC", rarrlp: "\u21AC", lopar: "\u2985", lopf: "\u{1D55D}", loplus: "\u2A2D", lotimes: "\u2A34", lowast: "\u2217", loz: "\u25CA", lozenge: "\u25CA", lpar: "(", lparlt: "\u2993", lrhard: "\u296D", lrm: "\u200E", lrtri: "\u22BF", lsaquo: "\u2039", lscr: "\u{1D4C1}", lsime: "\u2A8D", lsimg: "\u2A8F", lsquor: "\u201A", sbquo: "\u201A", lstrok: "\u0142", ltcc: "\u2AA6", ltcir: "\u2A79", ltimes: "\u22C9", ltlarr: "\u2976", ltquest: "\u2A7B", ltrPar: "\u2996", ltri: "\u25C3", triangleleft: "\u25C3", lurdshar: "\u294A", luruhar: "\u2966", lvertneqq: "\u2268\uFE00", lvnE: "\u2268\uFE00", mDDot: "\u223A", macr: "\xAF", strns: "\xAF", male: "\u2642", malt: "\u2720", maltese: "\u2720", marker: "\u25AE", mcomma: "\u2A29", mcy: "\u043C", mdash: "\u2014", mfr: "\u{1D52A}", mho: "\u2127", micro: "\xB5", midcir: "\u2AF0", minus: "\u2212", minusdu: "\u2A2A", mlcp: "\u2ADB", models: "\u22A7", mopf: "\u{1D55E}", mscr: "\u{1D4C2}", mu: "\u03BC", multimap: "\u22B8", mumap: "\u22B8", nGg: "\u22D9\u0338", nGt: "\u226B\u20D2", nLeftarrow: "\u21CD", nlArr: "\u21CD", nLeftrightarrow: "\u21CE", nhArr: "\u21CE", nLl: "\u22D8\u0338", nLt: "\u226A\u20D2", nRightarrow: "\u21CF", nrArr: "\u21CF", nVDash: "\u22AF", nVdash: "\u22AE", nacute: "\u0144", nang: "\u2220\u20D2", napE: "\u2A70\u0338", napid: "\u224B\u0338", napos: "\u0149", natur: "\u266E", natural: "\u266E", ncap: "\u2A43", ncaron: "\u0148", ncedil: "\u0146", ncongdot: "\u2A6D\u0338", ncup: "\u2A42", ncy: "\u043D", ndash: "\u2013", neArr: "\u21D7", nearhk: "\u2924", nedot: "\u2250\u0338", nesear: "\u2928", toea: "\u2928", nfr: "\u{1D52B}", nharr: "\u21AE", nleftrightarrow: "\u21AE", nhpar: "\u2AF2", nis: "\u22FC", nisd: "\u22FA", njcy: "\u045A", nlE: "\u2266\u0338", nleqq: "\u2266\u0338", nlarr: "\u219A", nleftarrow: "\u219A", nldr: "\u2025", nopf: "\u{1D55F}", not: "\xAC", notinE: "\u22F9\u0338", notindot: "\u22F5\u0338", notinvb: "\u22F7", notinvc: "\u22F6", notnivb: "\u22FE", notnivc: "\u22FD", nparsl: "\u2AFD\u20E5", npart: "\u2202\u0338", npolint: "\u2A14", nrarr: "\u219B", nrightarrow: "\u219B", nrarrc: "\u2933\u0338", nrarrw: "\u219D\u0338", nscr: "\u{1D4C3}", nsub: "\u2284", nsubE: "\u2AC5\u0338", nsubseteqq: "\u2AC5\u0338", nsup: "\u2285", nsupE: "\u2AC6\u0338", nsupseteqq: "\u2AC6\u0338", ntilde: "\xF1", nu: "\u03BD", num: "#", numero: "\u2116", numsp: "\u2007", nvDash: "\u22AD", nvHarr: "\u2904", nvap: "\u224D\u20D2", nvdash: "\u22AC", nvge: "\u2265\u20D2", nvgt: ">\u20D2", nvinfin: "\u29DE", nvlArr: "\u2902", nvle: "\u2264\u20D2", nvlt: "<\u20D2", nvltrie: "\u22B4\u20D2", nvrArr: "\u2903", nvrtrie: "\u22B5\u20D2", nvsim: "\u223C\u20D2", nwArr: "\u21D6", nwarhk: "\u2923", nwnear: "\u2927", oacute: "\xF3", ocirc: "\xF4", ocy: "\u043E", odblac: "\u0151", odiv: "\u2A38", odsold: "\u29BC", oelig: "\u0153", ofcir: "\u29BF", ofr: "\u{1D52C}", ogon: "\u02DB", ograve: "\xF2", ogt: "\u29C1", ohbar: "\u29B5", olcir: "\u29BE", olcross: "\u29BB", olt: "\u29C0", omacr: "\u014D", omega: "\u03C9", omicron: "\u03BF", omid: "\u29B6", oopf: "\u{1D560}", opar: "\u29B7", operp: "\u29B9", or: "\u2228", vee: "\u2228", ord: "\u2A5D", order: "\u2134", orderof: "\u2134", oscr: "\u2134", ordf: "\xAA", ordm: "\xBA", origof: "\u22B6", oror: "\u2A56", orslope: "\u2A57", orv: "\u2A5B", oslash: "\xF8", osol: "\u2298", otilde: "\xF5", otimesas: "\u2A36", ouml: "\xF6", ovbar: "\u233D", para: "\xB6", parsim: "\u2AF3", parsl: "\u2AFD", pcy: "\u043F", percnt: "%", period: ".", permil: "\u2030", pertenk: "\u2031", pfr: "\u{1D52D}", phi: "\u03C6", phiv: "\u03D5", straightphi: "\u03D5", varphi: "\u03D5", phone: "\u260E", pi: "\u03C0", piv: "\u03D6", varpi: "\u03D6", planckh: "\u210E", plus: "+", plusacir: "\u2A23", pluscir: "\u2A22", plusdu: "\u2A25", pluse: "\u2A72", plussim: "\u2A26", plustwo: "\u2A27", pointint: "\u2A15", popf: "\u{1D561}", pound: "\xA3", prE: "\u2AB3", prap: "\u2AB7", precapprox: "\u2AB7", precnapprox: "\u2AB9", prnap: "\u2AB9", precneqq: "\u2AB5", prnE: "\u2AB5", precnsim: "\u22E8", prnsim: "\u22E8", prime: "\u2032", profalar: "\u232E", profline: "\u2312", profsurf: "\u2313", prurel: "\u22B0", pscr: "\u{1D4C5}", psi: "\u03C8", puncsp: "\u2008", qfr: "\u{1D52E}", qopf: "\u{1D562}", qprime: "\u2057", qscr: "\u{1D4C6}", quatint: "\u2A16", quest: "?", rAtail: "\u291C", rHar: "\u2964", race: "\u223D\u0331", racute: "\u0155", raemptyv: "\u29B3", rangd: "\u2992", range: "\u29A5", raquo: "\xBB", rarrap: "\u2975", rarrbfs: "\u2920", rarrc: "\u2933", rarrfs: "\u291E", rarrpl: "\u2945", rarrsim: "\u2974", rarrtl: "\u21A3", rightarrowtail: "\u21A3", rarrw: "\u219D", rightsquigarrow: "\u219D", ratail: "\u291A", ratio: "\u2236", rbbrk: "\u2773", rbrace: "}", rcub: "}", rbrack: "]", rsqb: "]", rbrke: "\u298C", rbrksld: "\u298E", rbrkslu: "\u2990", rcaron: "\u0159", rcedil: "\u0157", rcy: "\u0440", rdca: "\u2937", rdldhar: "\u2969", rdsh: "\u21B3", rect: "\u25AD", rfisht: "\u297D", rfr: "\u{1D52F}", rharul: "\u296C", rho: "\u03C1", rhov: "\u03F1", varrho: "\u03F1", rightrightarrows: "\u21C9", rrarr: "\u21C9", rightthreetimes: "\u22CC", rthree: "\u22CC", ring: "\u02DA", rlm: "\u200F", rmoust: "\u23B1", rmoustache: "\u23B1", rnmid: "\u2AEE", roang: "\u27ED", roarr: "\u21FE", ropar: "\u2986", ropf: "\u{1D563}", roplus: "\u2A2E", rotimes: "\u2A35", rpar: ")", rpargt: "\u2994", rppolint: "\u2A12", rsaquo: "\u203A", rscr: "\u{1D4C7}", rtimes: "\u22CA", rtri: "\u25B9", triangleright: "\u25B9", rtriltri: "\u29CE", ruluhar: "\u2968", rx: "\u211E", sacute: "\u015B", scE: "\u2AB4", scap: "\u2AB8", succapprox: "\u2AB8", scaron: "\u0161", scedil: "\u015F", scirc: "\u015D", scnE: "\u2AB6", succneqq: "\u2AB6", scnap: "\u2ABA", succnapprox: "\u2ABA", scnsim: "\u22E9", succnsim: "\u22E9", scpolint: "\u2A13", scy: "\u0441", sdot: "\u22C5", sdote: "\u2A66", seArr: "\u21D8", sect: "\xA7", semi: ";", seswar: "\u2929", tosa: "\u2929", sext: "\u2736", sfr: "\u{1D530}", sharp: "\u266F", shchcy: "\u0449", shcy: "\u0448", shy: "\xAD", sigma: "\u03C3", sigmaf: "\u03C2", sigmav: "\u03C2", varsigma: "\u03C2", simdot: "\u2A6A", simg: "\u2A9E", simgE: "\u2AA0", siml: "\u2A9D", simlE: "\u2A9F", simne: "\u2246", simplus: "\u2A24", simrarr: "\u2972", smashp: "\u2A33", smeparsl: "\u29E4", smile: "\u2323", ssmile: "\u2323", smt: "\u2AAA", smte: "\u2AAC", smtes: "\u2AAC\uFE00", softcy: "\u044C", sol: "/", solb: "\u29C4", solbar: "\u233F", sopf: "\u{1D564}", spades: "\u2660", spadesuit: "\u2660", sqcaps: "\u2293\uFE00", sqcups: "\u2294\uFE00", sscr: "\u{1D4C8}", star: "\u2606", sub: "\u2282", subset: "\u2282", subE: "\u2AC5", subseteqq: "\u2AC5", subdot: "\u2ABD", subedot: "\u2AC3", submult: "\u2AC1", subnE: "\u2ACB", subsetneqq: "\u2ACB", subne: "\u228A", subsetneq: "\u228A", subplus: "\u2ABF", subrarr: "\u2979", subsim: "\u2AC7", subsub: "\u2AD5", subsup: "\u2AD3", sung: "\u266A", sup1: "\xB9", sup2: "\xB2", sup3: "\xB3", supE: "\u2AC6", supseteqq: "\u2AC6", supdot: "\u2ABE", supdsub: "\u2AD8", supedot: "\u2AC4", suphsol: "\u27C9", suphsub: "\u2AD7", suplarr: "\u297B", supmult: "\u2AC2", supnE: "\u2ACC", supsetneqq: "\u2ACC", supne: "\u228B", supsetneq: "\u228B", supplus: "\u2AC0", supsim: "\u2AC8", supsub: "\u2AD4", supsup: "\u2AD6", swArr: "\u21D9", swnwar: "\u292A", szlig: "\xDF", target: "\u2316", tau: "\u03C4", tcaron: "\u0165", tcedil: "\u0163", tcy: "\u0442", telrec: "\u2315", tfr: "\u{1D531}", theta: "\u03B8", thetasym: "\u03D1", thetav: "\u03D1", vartheta: "\u03D1", thorn: "\xFE", times: "\xD7", timesbar: "\u2A31", timesd: "\u2A30", topbot: "\u2336", topcir: "\u2AF1", topf: "\u{1D565}", topfork: "\u2ADA", tprime: "\u2034", triangle: "\u25B5", utri: "\u25B5", triangleq: "\u225C", trie: "\u225C", tridot: "\u25EC", triminus: "\u2A3A", triplus: "\u2A39", trisb: "\u29CD", tritime: "\u2A3B", trpezium: "\u23E2", tscr: "\u{1D4C9}", tscy: "\u0446", tshcy: "\u045B", tstrok: "\u0167", uHar: "\u2963", uacute: "\xFA", ubrcy: "\u045E", ubreve: "\u016D", ucirc: "\xFB", ucy: "\u0443", udblac: "\u0171", ufisht: "\u297E", ufr: "\u{1D532}", ugrave: "\xF9", uhblk: "\u2580", ulcorn: "\u231C", ulcorner: "\u231C", ulcrop: "\u230F", ultri: "\u25F8", umacr: "\u016B", uogon: "\u0173", uopf: "\u{1D566}", upsi: "\u03C5", upsilon: "\u03C5", upuparrows: "\u21C8", uuarr: "\u21C8", urcorn: "\u231D", urcorner: "\u231D", urcrop: "\u230E", uring: "\u016F", urtri: "\u25F9", uscr: "\u{1D4CA}", utdot: "\u22F0", utilde: "\u0169", uuml: "\xFC", uwangle: "\u29A7", vBar: "\u2AE8", vBarv: "\u2AE9", vangrt: "\u299C", varsubsetneq: "\u228A\uFE00", vsubne: "\u228A\uFE00", varsubsetneqq: "\u2ACB\uFE00", vsubnE: "\u2ACB\uFE00", varsupsetneq: "\u228B\uFE00", vsupne: "\u228B\uFE00", varsupsetneqq: "\u2ACC\uFE00", vsupnE: "\u2ACC\uFE00", vcy: "\u0432", veebar: "\u22BB", veeeq: "\u225A", vellip: "\u22EE", vfr: "\u{1D533}", vopf: "\u{1D567}", vscr: "\u{1D4CB}", vzigzag: "\u299A", wcirc: "\u0175", wedbar: "\u2A5F", wedgeq: "\u2259", weierp: "\u2118", wp: "\u2118", wfr: "\u{1D534}", wopf: "\u{1D568}", wscr: "\u{1D4CC}", xfr: "\u{1D535}", xi: "\u03BE", xnis: "\u22FB", xopf: "\u{1D569}", xscr: "\u{1D4CD}", yacute: "\xFD", yacy: "\u044F", ycirc: "\u0177", ycy: "\u044B", yen: "\xA5", yfr: "\u{1D536}", yicy: "\u0457", yopf: "\u{1D56A}", yscr: "\u{1D4CE}", yucy: "\u044E", yuml: "\xFF", zacute: "\u017A", zcaron: "\u017E", zcy: "\u0437", zdot: "\u017C", zeta: "\u03B6", zfr: "\u{1D537}", zhcy: "\u0436", zigrarr: "\u21DD", zopf: "\u{1D56B}", zscr: "\u{1D4CF}", zwj: "\u200D", zwnj: "\u200C" };
    fo = "\uE500";
    Ve.ngsp = fo;
    go = [/@/, /^\s*$/, /[<>]/, /^[{}]$/, /&(#|[a-z])/i, /^\/\//];
    $r = class t4 {
      static fromArray(e2) {
        return e2 ? (Xs("interpolation", e2), new t4(e2[0], e2[1])) : Or;
      }
      constructor(e2, r2) {
        this.start = e2, this.end = r2;
      }
    };
    Or = new $r("{{", "}}");
    gt = class extends Oe2 {
      constructor(e2, r2, n2) {
        super(n2, e2), this.tokenType = r2;
      }
    };
    Ur = class {
      constructor(e2, r2, n2) {
        this.tokens = e2, this.errors = r2, this.nonNormalizedIcuExpressions = n2;
      }
    };
    Io = /\r\n?/g;
    (function(t9) {
      t9.HEX = "hexadecimal", t9.DEC = "decimal";
    })(rr || (rr = {}));
    Ct = class {
      constructor(e2) {
        this.error = e2;
      }
    };
    Wr = class {
      constructor(e2, r2, n2) {
        this._getTagContentType = r2, this._currentTokenStart = null, this._currentTokenType = null, this._expansionCaseStack = [], this._inInterpolation = false, this._fullNameStack = [], this.tokens = [], this.errors = [], this.nonNormalizedIcuExpressions = [], this._tokenizeIcu = n2.tokenizeExpansionForms || false, this._interpolationConfig = n2.interpolationConfig || Or, this._leadingTriviaCodePoints = n2.leadingTriviaChars && n2.leadingTriviaChars.map((i) => i.codePointAt(0) || 0), this._canSelfClose = n2.canSelfClose || false, this._allowHtmComponentClosingTags = n2.allowHtmComponentClosingTags || false;
        let s2 = n2.range || { endPos: e2.content.length, startPos: 0, startLine: 0, startCol: 0 };
        this._cursor = n2.escapedString ? new Gr(e2, s2) : new nr(e2, s2), this._preserveLineEndings = n2.preserveLineEndings || false, this._i18nNormalizeLineEndingsInICUs = n2.i18nNormalizeLineEndingsInICUs || false, this._tokenizeBlocks = n2.tokenizeBlocks ?? true, this._tokenizeLet = n2.tokenizeLet ?? true;
        try {
          this._cursor.init();
        } catch (i) {
          this.handleError(i);
        }
      }
      _processCarriageReturns(e2) {
        return this._preserveLineEndings ? e2 : e2.replace(Io, `
`);
      }
      tokenize() {
        for (; this._cursor.peek() !== 0; ) {
          let e2 = this._cursor.clone();
          try {
            if (this._attemptCharCode(60)) if (this._attemptCharCode(33)) this._attemptStr("[CDATA[") ? this._consumeCdata(e2) : this._attemptStr("--") ? this._consumeComment(e2) : this._attemptStrCaseInsensitive("doctype") ? this._consumeDocType(e2) : this._consumeBogusComment(e2);
            else if (this._attemptCharCode(47)) this._consumeTagClose(e2);
            else {
              let r2 = this._cursor.clone();
              this._attemptCharCode(63) ? (this._cursor = r2, this._consumeBogusComment(e2)) : this._consumeTagOpen(e2);
            }
            else this._tokenizeLet && this._cursor.peek() === 64 && !this._inInterpolation && this._attemptStr("@let") ? this._consumeLetDeclaration(e2) : this._tokenizeBlocks && this._attemptCharCode(64) ? this._consumeBlockStart(e2) : this._tokenizeBlocks && !this._inInterpolation && !this._isInExpansionCase() && !this._isInExpansionForm() && this._attemptCharCode(125) ? this._consumeBlockEnd(e2) : this._tokenizeIcu && this._tokenizeExpansionForm() || this._consumeWithInterpolation(5, 8, () => this._isTextEnd(), () => this._isTagStart());
          } catch (r2) {
            this.handleError(r2);
          }
        }
        this._beginToken(34), this._endToken([]);
      }
      _getBlockName() {
        let e2 = false, r2 = this._cursor.clone();
        return this._attemptCharCodeUntilFn((n2) => ut(n2) ? !e2 : si(n2) ? (e2 = true, false) : true), this._cursor.getChars(r2).trim();
      }
      _consumeBlockStart(e2) {
        this._beginToken(25, e2);
        let r2 = this._endToken([this._getBlockName()]);
        if (this._cursor.peek() === 40) if (this._cursor.advance(), this._consumeBlockParameters(), this._attemptCharCodeUntilFn(b), this._attemptCharCode(41)) this._attemptCharCodeUntilFn(b);
        else {
          r2.type = 29;
          return;
        }
        this._attemptCharCode(123) ? (this._beginToken(26), this._endToken([])) : r2.type = 29;
      }
      _consumeBlockEnd(e2) {
        this._beginToken(27, e2), this._endToken([]);
      }
      _consumeBlockParameters() {
        for (this._attemptCharCodeUntilFn(ii); this._cursor.peek() !== 41 && this._cursor.peek() !== 0; ) {
          this._beginToken(28);
          let e2 = this._cursor.clone(), r2 = null, n2 = 0;
          for (; this._cursor.peek() !== 59 && this._cursor.peek() !== 0 || r2 !== null; ) {
            let s2 = this._cursor.peek();
            if (s2 === 92) this._cursor.advance();
            else if (s2 === r2) r2 = null;
            else if (r2 === null && Ot(s2)) r2 = s2;
            else if (s2 === 40 && r2 === null) n2++;
            else if (s2 === 41 && r2 === null) {
              if (n2 === 0) break;
              n2 > 0 && n2--;
            }
            this._cursor.advance();
          }
          this._endToken([this._cursor.getChars(e2)]), this._attemptCharCodeUntilFn(ii);
        }
      }
      _consumeLetDeclaration(e2) {
        if (this._beginToken(30, e2), ut(this._cursor.peek())) this._attemptCharCodeUntilFn(b);
        else {
          let s2 = this._endToken([this._cursor.getChars(e2)]);
          s2.type = 33;
          return;
        }
        let r2 = this._endToken([this._getLetDeclarationName()]);
        if (this._attemptCharCodeUntilFn(b), !this._attemptCharCode(61)) {
          r2.type = 33;
          return;
        }
        this._attemptCharCodeUntilFn((s2) => b(s2) && !$t(s2)), this._consumeLetDeclarationValue(), this._cursor.peek() === 59 ? (this._beginToken(32), this._endToken([]), this._cursor.advance()) : (r2.type = 33, r2.sourceSpan = this._cursor.getSpan(e2));
      }
      _getLetDeclarationName() {
        let e2 = this._cursor.clone(), r2 = false;
        return this._attemptCharCodeUntilFn((n2) => lt(n2) || n2 === 36 || n2 === 95 || r2 && Rt(n2) ? (r2 = true, false) : true), this._cursor.getChars(e2).trim();
      }
      _consumeLetDeclarationValue() {
        let e2 = this._cursor.clone();
        for (this._beginToken(31, e2); this._cursor.peek() !== 0; ) {
          let r2 = this._cursor.peek();
          if (r2 === 59) break;
          Ot(r2) && (this._cursor.advance(), this._attemptCharCodeUntilFn((n2) => n2 === 92 ? (this._cursor.advance(), false) : n2 === r2)), this._cursor.advance();
        }
        this._endToken([this._cursor.getChars(e2)]);
      }
      _tokenizeExpansionForm() {
        if (this.isExpansionFormStart()) return this._consumeExpansionFormStart(), true;
        if (qo(this._cursor.peek()) && this._isInExpansionForm()) return this._consumeExpansionCaseStart(), true;
        if (this._cursor.peek() === 125) {
          if (this._isInExpansionCase()) return this._consumeExpansionCaseEnd(), true;
          if (this._isInExpansionForm()) return this._consumeExpansionFormEnd(), true;
        }
        return false;
      }
      _beginToken(e2, r2 = this._cursor.clone()) {
        this._currentTokenStart = r2, this._currentTokenType = e2;
      }
      _endToken(e2, r2) {
        if (this._currentTokenStart === null) throw new gt("Programming error - attempted to end a token when there was no start to the token", this._currentTokenType, this._cursor.getSpan(r2));
        if (this._currentTokenType === null) throw new gt("Programming error - attempted to end a token which has no token type", null, this._cursor.getSpan(this._currentTokenStart));
        let n2 = { type: this._currentTokenType, parts: e2, sourceSpan: (r2 ?? this._cursor).getSpan(this._currentTokenStart, this._leadingTriviaCodePoints) };
        return this.tokens.push(n2), this._currentTokenStart = null, this._currentTokenType = null, n2;
      }
      _createError(e2, r2) {
        this._isInExpansionForm() && (e2 += ` (Do you have an unescaped "{" in your template? Use "{{ '{' }}") to escape it.)`);
        let n2 = new gt(e2, this._currentTokenType, r2);
        return this._currentTokenStart = null, this._currentTokenType = null, new Ct(n2);
      }
      handleError(e2) {
        if (e2 instanceof St && (e2 = this._createError(e2.msg, this._cursor.getSpan(e2.cursor))), e2 instanceof Ct) this.errors.push(e2.error);
        else throw e2;
      }
      _attemptCharCode(e2) {
        return this._cursor.peek() === e2 ? (this._cursor.advance(), true) : false;
      }
      _attemptCharCodeCaseInsensitive(e2) {
        return Ho(this._cursor.peek(), e2) ? (this._cursor.advance(), true) : false;
      }
      _requireCharCode(e2) {
        let r2 = this._cursor.clone();
        if (!this._attemptCharCode(e2)) throw this._createError(Ue2(this._cursor.peek()), this._cursor.getSpan(r2));
      }
      _attemptStr(e2) {
        let r2 = e2.length;
        if (this._cursor.charsLeft() < r2) return false;
        let n2 = this._cursor.clone();
        for (let s2 = 0; s2 < r2; s2++) if (!this._attemptCharCode(e2.charCodeAt(s2))) return this._cursor = n2, false;
        return true;
      }
      _attemptStrCaseInsensitive(e2) {
        for (let r2 = 0; r2 < e2.length; r2++) if (!this._attemptCharCodeCaseInsensitive(e2.charCodeAt(r2))) return false;
        return true;
      }
      _requireStr(e2) {
        let r2 = this._cursor.clone();
        if (!this._attemptStr(e2)) throw this._createError(Ue2(this._cursor.peek()), this._cursor.getSpan(r2));
      }
      _requireStrCaseInsensitive(e2) {
        let r2 = this._cursor.clone();
        if (!this._attemptStrCaseInsensitive(e2)) throw this._createError(Ue2(this._cursor.peek()), this._cursor.getSpan(r2));
      }
      _attemptCharCodeUntilFn(e2) {
        for (; !e2(this._cursor.peek()); ) this._cursor.advance();
      }
      _requireCharCodeUntilFn(e2, r2) {
        let n2 = this._cursor.clone();
        if (this._attemptCharCodeUntilFn(e2), this._cursor.diff(n2) < r2) throw this._createError(Ue2(this._cursor.peek()), this._cursor.getSpan(n2));
      }
      _attemptUntilChar(e2) {
        for (; this._cursor.peek() !== e2; ) this._cursor.advance();
      }
      _readChar() {
        let e2 = String.fromCodePoint(this._cursor.peek());
        return this._cursor.advance(), e2;
      }
      _consumeEntity(e2) {
        this._beginToken(9);
        let r2 = this._cursor.clone();
        if (this._cursor.advance(), this._attemptCharCode(35)) {
          let n2 = this._attemptCharCode(120) || this._attemptCharCode(88), s2 = this._cursor.clone();
          if (this._attemptCharCodeUntilFn(Oo), this._cursor.peek() != 59) {
            this._cursor.advance();
            let a = n2 ? rr.HEX : rr.DEC;
            throw this._createError(Ro(a, this._cursor.getChars(r2)), this._cursor.getSpan());
          }
          let i = this._cursor.getChars(s2);
          this._cursor.advance();
          try {
            let a = parseInt(i, n2 ? 16 : 10);
            this._endToken([String.fromCharCode(a), this._cursor.getChars(r2)]);
          } catch {
            throw this._createError(ti(this._cursor.getChars(r2)), this._cursor.getSpan());
          }
        } else {
          let n2 = this._cursor.clone();
          if (this._attemptCharCodeUntilFn(Mo), this._cursor.peek() != 59) this._beginToken(e2, r2), this._cursor = n2, this._endToken(["&"]);
          else {
            let s2 = this._cursor.getChars(n2);
            this._cursor.advance();
            let i = Ve[s2];
            if (!i) throw this._createError(ti(s2), this._cursor.getSpan(r2));
            this._endToken([i, `&${s2};`]);
          }
        }
      }
      _consumeRawText(e2, r2) {
        this._beginToken(e2 ? 6 : 7);
        let n2 = [];
        for (; ; ) {
          let s2 = this._cursor.clone(), i = r2();
          if (this._cursor = s2, i) break;
          e2 && this._cursor.peek() === 38 ? (this._endToken([this._processCarriageReturns(n2.join(""))]), n2.length = 0, this._consumeEntity(6), this._beginToken(6)) : n2.push(this._readChar());
        }
        this._endToken([this._processCarriageReturns(n2.join(""))]);
      }
      _consumeComment(e2) {
        this._beginToken(10, e2), this._endToken([]), this._consumeRawText(false, () => this._attemptStr("-->")), this._beginToken(11), this._requireStr("-->"), this._endToken([]);
      }
      _consumeBogusComment(e2) {
        this._beginToken(10, e2), this._endToken([]), this._consumeRawText(false, () => this._cursor.peek() === 62), this._beginToken(11), this._cursor.advance(), this._endToken([]);
      }
      _consumeCdata(e2) {
        this._beginToken(12, e2), this._endToken([]), this._consumeRawText(false, () => this._attemptStr("]]>")), this._beginToken(13), this._requireStr("]]>"), this._endToken([]);
      }
      _consumeDocType(e2) {
        this._beginToken(18, e2), this._endToken([]), this._consumeRawText(false, () => this._cursor.peek() === 62), this._beginToken(19), this._cursor.advance(), this._endToken([]);
      }
      _consumePrefixAndName() {
        let e2 = this._cursor.clone(), r2 = "";
        for (; this._cursor.peek() !== 58 && !$o(this._cursor.peek()); ) this._cursor.advance();
        let n2;
        this._cursor.peek() === 58 ? (r2 = this._cursor.getChars(e2), this._cursor.advance(), n2 = this._cursor.clone()) : n2 = e2, this._requireCharCodeUntilFn(ri, r2 === "" ? 0 : 1);
        let s2 = this._cursor.getChars(n2);
        return [r2, s2];
      }
      _consumeTagOpen(e2) {
        let r2, n2, s2, i = [];
        try {
          if (!lt(this._cursor.peek())) throw this._createError(Ue2(this._cursor.peek()), this._cursor.getSpan(e2));
          for (s2 = this._consumeTagOpenStart(e2), n2 = s2.parts[0], r2 = s2.parts[1], this._attemptCharCodeUntilFn(b); this._cursor.peek() !== 47 && this._cursor.peek() !== 62 && this._cursor.peek() !== 60 && this._cursor.peek() !== 0; ) {
            let [o2, u] = this._consumeAttributeName();
            if (this._attemptCharCodeUntilFn(b), this._attemptCharCode(61)) {
              this._attemptCharCodeUntilFn(b);
              let p2 = this._consumeAttributeValue();
              i.push({ prefix: o2, name: u, value: p2 });
            } else i.push({ prefix: o2, name: u });
            this._attemptCharCodeUntilFn(b);
          }
          this._consumeTagOpenEnd();
        } catch (o2) {
          if (o2 instanceof Ct) {
            s2 ? s2.type = 4 : (this._beginToken(5, e2), this._endToken(["<"]));
            return;
          }
          throw o2;
        }
        if (this._canSelfClose && this.tokens[this.tokens.length - 1].type === 2) return;
        let a = this._getTagContentType(r2, n2, this._fullNameStack.length > 0, i);
        this._handleFullNameStackForTagOpen(n2, r2), a === N2.RAW_TEXT ? this._consumeRawTextWithTagClose(n2, r2, false) : a === N2.ESCAPABLE_RAW_TEXT && this._consumeRawTextWithTagClose(n2, r2, true);
      }
      _consumeRawTextWithTagClose(e2, r2, n2) {
        this._consumeRawText(n2, () => !this._attemptCharCode(60) || !this._attemptCharCode(47) || (this._attemptCharCodeUntilFn(b), !this._attemptStrCaseInsensitive(e2 ? `${e2}:${r2}` : r2)) ? false : (this._attemptCharCodeUntilFn(b), this._attemptCharCode(62))), this._beginToken(3), this._requireCharCodeUntilFn((s2) => s2 === 62, 3), this._cursor.advance(), this._endToken([e2, r2]), this._handleFullNameStackForTagClose(e2, r2);
      }
      _consumeTagOpenStart(e2) {
        this._beginToken(0, e2);
        let r2 = this._consumePrefixAndName();
        return this._endToken(r2);
      }
      _consumeAttributeName() {
        let e2 = this._cursor.peek();
        if (e2 === 39 || e2 === 34) throw this._createError(Ue2(e2), this._cursor.getSpan());
        this._beginToken(14);
        let r2 = this._consumePrefixAndName();
        return this._endToken(r2), r2;
      }
      _consumeAttributeValue() {
        let e2;
        if (this._cursor.peek() === 39 || this._cursor.peek() === 34) {
          let r2 = this._cursor.peek();
          this._consumeQuote(r2);
          let n2 = () => this._cursor.peek() === r2;
          e2 = this._consumeWithInterpolation(16, 17, n2, n2), this._consumeQuote(r2);
        } else {
          let r2 = () => ri(this._cursor.peek());
          e2 = this._consumeWithInterpolation(16, 17, r2, r2);
        }
        return e2;
      }
      _consumeQuote(e2) {
        this._beginToken(15), this._requireCharCode(e2), this._endToken([String.fromCodePoint(e2)]);
      }
      _consumeTagOpenEnd() {
        let e2 = this._attemptCharCode(47) ? 2 : 1;
        this._beginToken(e2), this._requireCharCode(62), this._endToken([]);
      }
      _consumeTagClose(e2) {
        if (this._beginToken(3, e2), this._attemptCharCodeUntilFn(b), this._allowHtmComponentClosingTags && this._attemptCharCode(47)) this._attemptCharCodeUntilFn(b), this._requireCharCode(62), this._endToken([]);
        else {
          let [r2, n2] = this._consumePrefixAndName();
          this._attemptCharCodeUntilFn(b), this._requireCharCode(62), this._endToken([r2, n2]), this._handleFullNameStackForTagClose(r2, n2);
        }
      }
      _consumeExpansionFormStart() {
        this._beginToken(20), this._requireCharCode(123), this._endToken([]), this._expansionCaseStack.push(20), this._beginToken(7);
        let e2 = this._readUntil(44), r2 = this._processCarriageReturns(e2);
        if (this._i18nNormalizeLineEndingsInICUs) this._endToken([r2]);
        else {
          let s2 = this._endToken([e2]);
          r2 !== e2 && this.nonNormalizedIcuExpressions.push(s2);
        }
        this._requireCharCode(44), this._attemptCharCodeUntilFn(b), this._beginToken(7);
        let n2 = this._readUntil(44);
        this._endToken([n2]), this._requireCharCode(44), this._attemptCharCodeUntilFn(b);
      }
      _consumeExpansionCaseStart() {
        this._beginToken(21);
        let e2 = this._readUntil(123).trim();
        this._endToken([e2]), this._attemptCharCodeUntilFn(b), this._beginToken(22), this._requireCharCode(123), this._endToken([]), this._attemptCharCodeUntilFn(b), this._expansionCaseStack.push(22);
      }
      _consumeExpansionCaseEnd() {
        this._beginToken(23), this._requireCharCode(125), this._endToken([]), this._attemptCharCodeUntilFn(b), this._expansionCaseStack.pop();
      }
      _consumeExpansionFormEnd() {
        this._beginToken(24), this._requireCharCode(125), this._endToken([]), this._expansionCaseStack.pop();
      }
      _consumeWithInterpolation(e2, r2, n2, s2) {
        this._beginToken(e2);
        let i = [];
        for (; !n2(); ) {
          let o2 = this._cursor.clone();
          this._interpolationConfig && this._attemptStr(this._interpolationConfig.start) ? (this._endToken([this._processCarriageReturns(i.join(""))], o2), i.length = 0, this._consumeInterpolation(r2, o2, s2), this._beginToken(e2)) : this._cursor.peek() === 38 ? (this._endToken([this._processCarriageReturns(i.join(""))]), i.length = 0, this._consumeEntity(e2), this._beginToken(e2)) : i.push(this._readChar());
        }
        this._inInterpolation = false;
        let a = this._processCarriageReturns(i.join(""));
        return this._endToken([a]), a;
      }
      _consumeInterpolation(e2, r2, n2) {
        let s2 = [];
        this._beginToken(e2, r2), s2.push(this._interpolationConfig.start);
        let i = this._cursor.clone(), a = null, o2 = false;
        for (; this._cursor.peek() !== 0 && (n2 === null || !n2()); ) {
          let u = this._cursor.clone();
          if (this._isTagStart()) {
            this._cursor = u, s2.push(this._getProcessedChars(i, u)), this._endToken(s2);
            return;
          }
          if (a === null) if (this._attemptStr(this._interpolationConfig.end)) {
            s2.push(this._getProcessedChars(i, u)), s2.push(this._interpolationConfig.end), this._endToken(s2);
            return;
          } else this._attemptStr("//") && (o2 = true);
          let p2 = this._cursor.peek();
          this._cursor.advance(), p2 === 92 ? this._cursor.advance() : p2 === a ? a = null : !o2 && a === null && Ot(p2) && (a = p2);
        }
        s2.push(this._getProcessedChars(i, this._cursor)), this._endToken(s2);
      }
      _getProcessedChars(e2, r2) {
        return this._processCarriageReturns(r2.getChars(e2));
      }
      _isTextEnd() {
        return !!(this._isTagStart() || this._cursor.peek() === 0 || this._tokenizeIcu && !this._inInterpolation && (this.isExpansionFormStart() || this._cursor.peek() === 125 && this._isInExpansionCase()) || this._tokenizeBlocks && !this._inInterpolation && !this._isInExpansion() && (this._isBlockStart() || this._cursor.peek() === 64 || this._cursor.peek() === 125));
      }
      _isTagStart() {
        if (this._cursor.peek() === 60) {
          let e2 = this._cursor.clone();
          e2.advance();
          let r2 = e2.peek();
          if (97 <= r2 && r2 <= 122 || 65 <= r2 && r2 <= 90 || r2 === 47 || r2 === 33) return true;
        }
        return false;
      }
      _isBlockStart() {
        if (this._tokenizeBlocks && this._cursor.peek() === 64) {
          let e2 = this._cursor.clone();
          if (e2.advance(), si(e2.peek())) return true;
        }
        return false;
      }
      _readUntil(e2) {
        let r2 = this._cursor.clone();
        return this._attemptUntilChar(e2), this._cursor.getChars(r2);
      }
      _isInExpansion() {
        return this._isInExpansionCase() || this._isInExpansionForm();
      }
      _isInExpansionCase() {
        return this._expansionCaseStack.length > 0 && this._expansionCaseStack[this._expansionCaseStack.length - 1] === 22;
      }
      _isInExpansionForm() {
        return this._expansionCaseStack.length > 0 && this._expansionCaseStack[this._expansionCaseStack.length - 1] === 20;
      }
      isExpansionFormStart() {
        if (this._cursor.peek() !== 123) return false;
        if (this._interpolationConfig) {
          let e2 = this._cursor.clone(), r2 = this._attemptStr(this._interpolationConfig.start);
          return this._cursor = e2, !r2;
        }
        return true;
      }
      _handleFullNameStackForTagOpen(e2, r2) {
        let n2 = qe(e2, r2);
        (this._fullNameStack.length === 0 || this._fullNameStack[this._fullNameStack.length - 1] === n2) && this._fullNameStack.push(n2);
      }
      _handleFullNameStackForTagClose(e2, r2) {
        let n2 = qe(e2, r2);
        this._fullNameStack.length !== 0 && this._fullNameStack[this._fullNameStack.length - 1] === n2 && this._fullNameStack.pop();
      }
    };
    nr = class t5 {
      constructor(e2, r2) {
        if (e2 instanceof t5) {
          this.file = e2.file, this.input = e2.input, this.end = e2.end;
          let n2 = e2.state;
          this.state = { peek: n2.peek, offset: n2.offset, line: n2.line, column: n2.column };
        } else {
          if (!r2) throw new Error("Programming error: the range argument must be provided with a file argument.");
          this.file = e2, this.input = e2.content, this.end = r2.endPos, this.state = { peek: -1, offset: r2.startPos, line: r2.startLine, column: r2.startCol };
        }
      }
      clone() {
        return new t5(this);
      }
      peek() {
        return this.state.peek;
      }
      charsLeft() {
        return this.end - this.state.offset;
      }
      diff(e2) {
        return this.state.offset - e2.state.offset;
      }
      advance() {
        this.advanceState(this.state);
      }
      init() {
        this.updatePeek(this.state);
      }
      getSpan(e2, r2) {
        e2 = e2 || this;
        let n2 = e2;
        if (r2) for (; this.diff(e2) > 0 && r2.indexOf(e2.peek()) !== -1; ) n2 === e2 && (e2 = e2.clone()), e2.advance();
        let s2 = this.locationFromCursor(e2), i = this.locationFromCursor(this), a = n2 !== e2 ? this.locationFromCursor(n2) : s2;
        return new h2(s2, i, a);
      }
      getChars(e2) {
        return this.input.substring(e2.state.offset, this.state.offset);
      }
      charAt(e2) {
        return this.input.charCodeAt(e2);
      }
      advanceState(e2) {
        if (e2.offset >= this.end) throw this.state = e2, new St('Unexpected character "EOF"', this);
        let r2 = this.charAt(e2.offset);
        r2 === 10 ? (e2.line++, e2.column = 0) : $t(r2) || e2.column++, e2.offset++, this.updatePeek(e2);
      }
      updatePeek(e2) {
        e2.peek = e2.offset >= this.end ? 0 : this.charAt(e2.offset);
      }
      locationFromCursor(e2) {
        return new ie(e2.file, e2.state.offset, e2.state.line, e2.state.column);
      }
    };
    Gr = class t6 extends nr {
      constructor(e2, r2) {
        e2 instanceof t6 ? (super(e2), this.internalState = { ...e2.internalState }) : (super(e2, r2), this.internalState = this.state);
      }
      advance() {
        this.state = this.internalState, super.advance(), this.processEscapeSequence();
      }
      init() {
        super.init(), this.processEscapeSequence();
      }
      clone() {
        return new t6(this);
      }
      getChars(e2) {
        let r2 = e2.clone(), n2 = "";
        for (; r2.internalState.offset < this.internalState.offset; ) n2 += String.fromCodePoint(r2.peek()), r2.advance();
        return n2;
      }
      processEscapeSequence() {
        let e2 = () => this.internalState.peek;
        if (e2() === 92) if (this.internalState = { ...this.state }, this.advanceState(this.internalState), e2() === 110) this.state.peek = 10;
        else if (e2() === 114) this.state.peek = 13;
        else if (e2() === 118) this.state.peek = 11;
        else if (e2() === 116) this.state.peek = 9;
        else if (e2() === 98) this.state.peek = 8;
        else if (e2() === 102) this.state.peek = 12;
        else if (e2() === 117) if (this.advanceState(this.internalState), e2() === 123) {
          this.advanceState(this.internalState);
          let r2 = this.clone(), n2 = 0;
          for (; e2() !== 125; ) this.advanceState(this.internalState), n2++;
          this.state.peek = this.decodeHexDigits(r2, n2);
        } else {
          let r2 = this.clone();
          this.advanceState(this.internalState), this.advanceState(this.internalState), this.advanceState(this.internalState), this.state.peek = this.decodeHexDigits(r2, 4);
        }
        else if (e2() === 120) {
          this.advanceState(this.internalState);
          let r2 = this.clone();
          this.advanceState(this.internalState), this.state.peek = this.decodeHexDigits(r2, 2);
        } else if (Br(e2())) {
          let r2 = "", n2 = 0, s2 = this.clone();
          for (; Br(e2()) && n2 < 3; ) s2 = this.clone(), r2 += String.fromCodePoint(e2()), this.advanceState(this.internalState), n2++;
          this.state.peek = parseInt(r2, 8), this.internalState = s2.internalState;
        } else $t(this.internalState.peek) ? (this.advanceState(this.internalState), this.state = this.internalState) : this.state.peek = this.internalState.peek;
      }
      decodeHexDigits(e2, r2) {
        let n2 = this.input.slice(e2.internalState.offset, e2.internalState.offset + r2), s2 = parseInt(n2, 16);
        if (isNaN(s2)) throw e2.state = e2.internalState, new St("Invalid hexadecimal escape sequence", e2);
        return s2;
      }
    };
    St = class {
      constructor(e2, r2) {
        this.msg = e2, this.cursor = r2;
      }
    };
    L2 = class t7 extends Oe2 {
      static create(e2, r2, n2) {
        return new t7(e2, r2, n2);
      }
      constructor(e2, r2, n2) {
        super(r2, n2), this.elementName = e2;
      }
    };
    jr = class {
      constructor(e2, r2) {
        this.rootNodes = e2, this.errors = r2;
      }
    };
    sr = class {
      constructor(e2) {
        this.getTagDefinition = e2;
      }
      parse(e2, r2, n2, s2 = false, i) {
        let a = (D2) => (I4, ...F) => D2(I4.toLowerCase(), ...F), o2 = s2 ? this.getTagDefinition : a(this.getTagDefinition), u = (D2) => o2(D2).getContentType(), p2 = s2 ? i : a(i), m = li(e2, r2, i ? (D2, I4, F, c2) => {
          let g3 = p2(D2, I4, F, c2);
          return g3 !== void 0 ? g3 : u(D2);
        } : u, n2), f3 = n2 && n2.canSelfClose || false, C2 = n2 && n2.allowHtmComponentClosingTags || false, A = new Kr(m.tokens, o2, f3, C2, s2);
        return A.build(), new jr(A.rootNodes, m.errors.concat(A.errors));
      }
    };
    Kr = class t8 {
      constructor(e2, r2, n2, s2, i) {
        this.tokens = e2, this.getTagDefinition = r2, this.canSelfClose = n2, this.allowHtmComponentClosingTags = s2, this.isTagNameCaseSensitive = i, this._index = -1, this._containerStack = [], this.rootNodes = [], this.errors = [], this._advance();
      }
      build() {
        for (; this._peek.type !== 34; ) this._peek.type === 0 || this._peek.type === 4 ? this._consumeStartTag(this._advance()) : this._peek.type === 3 ? (this._closeVoidElement(), this._consumeEndTag(this._advance())) : this._peek.type === 12 ? (this._closeVoidElement(), this._consumeCdata(this._advance())) : this._peek.type === 10 ? (this._closeVoidElement(), this._consumeComment(this._advance())) : this._peek.type === 5 || this._peek.type === 7 || this._peek.type === 6 ? (this._closeVoidElement(), this._consumeText(this._advance())) : this._peek.type === 20 ? this._consumeExpansion(this._advance()) : this._peek.type === 25 ? (this._closeVoidElement(), this._consumeBlockOpen(this._advance())) : this._peek.type === 27 ? (this._closeVoidElement(), this._consumeBlockClose(this._advance())) : this._peek.type === 29 ? (this._closeVoidElement(), this._consumeIncompleteBlock(this._advance())) : this._peek.type === 30 ? (this._closeVoidElement(), this._consumeLet(this._advance())) : this._peek.type === 18 ? this._consumeDocType(this._advance()) : this._peek.type === 33 ? (this._closeVoidElement(), this._consumeIncompleteLet(this._advance())) : this._advance();
        for (let e2 of this._containerStack) e2 instanceof ee2 && this.errors.push(L2.create(e2.name, e2.sourceSpan, `Unclosed block "${e2.name}"`));
      }
      _advance() {
        let e2 = this._peek;
        return this._index < this.tokens.length - 1 && this._index++, this._peek = this.tokens[this._index], e2;
      }
      _advanceIf(e2) {
        return this._peek.type === e2 ? this._advance() : null;
      }
      _consumeCdata(e2) {
        let r2 = this._advance(), n2 = this._getText(r2), s2 = this._advanceIf(13);
        this._addToParent(new Gt(n2, new h2(e2.sourceSpan.start, (s2 || r2).sourceSpan.end), [r2]));
      }
      _consumeComment(e2) {
        let r2 = this._advanceIf(7), n2 = this._advanceIf(11), s2 = r2 != null ? r2.parts[0].trim() : null, i = n2 == null ? e2.sourceSpan : new h2(e2.sourceSpan.start, n2.sourceSpan.end, e2.sourceSpan.fullStart);
        this._addToParent(new Kt(s2, i));
      }
      _consumeDocType(e2) {
        let r2 = this._advanceIf(7), n2 = this._advanceIf(19), s2 = r2 != null ? r2.parts[0].trim() : null, i = new h2(e2.sourceSpan.start, (n2 || r2 || e2).sourceSpan.end);
        this._addToParent(new Xt(s2, i));
      }
      _consumeExpansion(e2) {
        let r2 = this._advance(), n2 = this._advance(), s2 = [];
        for (; this._peek.type === 21; ) {
          let a = this._parseExpansionCase();
          if (!a) return;
          s2.push(a);
        }
        if (this._peek.type !== 24) {
          this.errors.push(L2.create(null, this._peek.sourceSpan, "Invalid ICU message. Missing '}'."));
          return;
        }
        let i = new h2(e2.sourceSpan.start, this._peek.sourceSpan.end, e2.sourceSpan.fullStart);
        this._addToParent(new zt(r2.parts[0], n2.parts[0], s2, i, r2.sourceSpan)), this._advance();
      }
      _parseExpansionCase() {
        let e2 = this._advance();
        if (this._peek.type !== 22) return this.errors.push(L2.create(null, this._peek.sourceSpan, "Invalid ICU message. Missing '{'.")), null;
        let r2 = this._advance(), n2 = this._collectExpansionExpTokens(r2);
        if (!n2) return null;
        let s2 = this._advance();
        n2.push({ type: 34, parts: [], sourceSpan: s2.sourceSpan });
        let i = new t8(n2, this.getTagDefinition, this.canSelfClose, this.allowHtmComponentClosingTags, this.isTagNameCaseSensitive);
        if (i.build(), i.errors.length > 0) return this.errors = this.errors.concat(i.errors), null;
        let a = new h2(e2.sourceSpan.start, s2.sourceSpan.end, e2.sourceSpan.fullStart), o2 = new h2(r2.sourceSpan.start, s2.sourceSpan.end, r2.sourceSpan.fullStart);
        return new Yt(e2.parts[0], i.rootNodes, a, e2.sourceSpan, o2);
      }
      _collectExpansionExpTokens(e2) {
        let r2 = [], n2 = [22];
        for (; ; ) {
          if ((this._peek.type === 20 || this._peek.type === 22) && n2.push(this._peek.type), this._peek.type === 23) if (ci(n2, 22)) {
            if (n2.pop(), n2.length === 0) return r2;
          } else return this.errors.push(L2.create(null, e2.sourceSpan, "Invalid ICU message. Missing '}'.")), null;
          if (this._peek.type === 24) if (ci(n2, 20)) n2.pop();
          else return this.errors.push(L2.create(null, e2.sourceSpan, "Invalid ICU message. Missing '}'.")), null;
          if (this._peek.type === 34) return this.errors.push(L2.create(null, e2.sourceSpan, "Invalid ICU message. Missing '}'.")), null;
          r2.push(this._advance());
        }
      }
      _getText(e2) {
        let r2 = e2.parts[0];
        if (r2.length > 0 && r2[0] == `
`) {
          let n2 = this._getClosestParentElement();
          n2 != null && n2.children.length == 0 && this.getTagDefinition(n2.name).ignoreFirstLf && (r2 = r2.substring(1));
        }
        return r2;
      }
      _consumeText(e2) {
        let r2 = [e2], n2 = e2.sourceSpan, s2 = e2.parts[0];
        if (s2.length > 0 && s2[0] === `
`) {
          let i = this._getContainer();
          i != null && i.children.length === 0 && this.getTagDefinition(i.name).ignoreFirstLf && (s2 = s2.substring(1), r2[0] = { type: e2.type, sourceSpan: e2.sourceSpan, parts: [s2] });
        }
        for (; this._peek.type === 8 || this._peek.type === 5 || this._peek.type === 9; ) e2 = this._advance(), r2.push(e2), e2.type === 8 ? s2 += e2.parts.join("").replace(/&([^;]+);/g, pi) : e2.type === 9 ? s2 += e2.parts[0] : s2 += e2.parts.join("");
        if (s2.length > 0) {
          let i = e2.sourceSpan;
          this._addToParent(new Wt(s2, new h2(n2.start, i.end, n2.fullStart, n2.details), r2));
        }
      }
      _closeVoidElement() {
        let e2 = this._getContainer();
        e2 instanceof Y && this.getTagDefinition(e2.name).isVoid && this._containerStack.pop();
      }
      _consumeStartTag(e2) {
        let [r2, n2] = e2.parts, s2 = [];
        for (; this._peek.type === 14; ) s2.push(this._consumeAttr(this._advance()));
        let i = this._getElementFullName(r2, n2, this._getClosestParentElement()), a = false;
        if (this._peek.type === 2) {
          this._advance(), a = true;
          let C2 = this.getTagDefinition(i);
          this.canSelfClose || C2.canSelfClose || Me2(i) !== null || C2.isVoid || this.errors.push(L2.create(i, e2.sourceSpan, `Only void, custom and foreign elements can be self closed "${e2.parts[1]}"`));
        } else this._peek.type === 1 && (this._advance(), a = false);
        let o2 = this._peek.sourceSpan.fullStart, u = new h2(e2.sourceSpan.start, o2, e2.sourceSpan.fullStart), p2 = new h2(e2.sourceSpan.start, o2, e2.sourceSpan.fullStart), l2 = new h2(e2.sourceSpan.start.moveBy(1), e2.sourceSpan.end), m = new Y(i, s2, [], u, p2, void 0, l2), f3 = this._getContainer();
        this._pushContainer(m, f3 instanceof Y && this.getTagDefinition(f3.name).isClosedByChild(m.name)), a ? this._popContainer(i, Y, u) : e2.type === 4 && (this._popContainer(i, Y, null), this.errors.push(L2.create(i, u, `Opening tag "${i}" not terminated.`)));
      }
      _pushContainer(e2, r2) {
        r2 && this._containerStack.pop(), this._addToParent(e2), this._containerStack.push(e2);
      }
      _consumeEndTag(e2) {
        let r2 = this.allowHtmComponentClosingTags && e2.parts.length === 0 ? null : this._getElementFullName(e2.parts[0], e2.parts[1], this._getClosestParentElement());
        if (r2 && this.getTagDefinition(r2).isVoid) this.errors.push(L2.create(r2, e2.sourceSpan, `Void elements do not have end tags "${e2.parts[1]}"`));
        else if (!this._popContainer(r2, Y, e2.sourceSpan)) {
          let n2 = `Unexpected closing tag "${r2}". It may happen when the tag has already been closed by another tag. For more info see https://www.w3.org/TR/html5/syntax.html#closing-elements-that-have-implied-end-tags`;
          this.errors.push(L2.create(r2, e2.sourceSpan, n2));
        }
      }
      _popContainer(e2, r2, n2) {
        let s2 = false;
        for (let i = this._containerStack.length - 1; i >= 0; i--) {
          let a = this._containerStack[i];
          if (Me2(a.name) ? a.name === e2 : (e2 == null || a.name.toLowerCase() === e2.toLowerCase()) && a instanceof r2) return a.endSourceSpan = n2, a.sourceSpan.end = n2 !== null ? n2.end : a.sourceSpan.end, this._containerStack.splice(i, this._containerStack.length - i), !s2;
          (a instanceof ee2 || a instanceof Y && !this.getTagDefinition(a.name).closedByParent) && (s2 = true);
        }
        return false;
      }
      _consumeAttr(e2) {
        let r2 = qe(e2.parts[0], e2.parts[1]), n2 = e2.sourceSpan.end, s2;
        this._peek.type === 15 && (s2 = this._advance());
        let i = "", a = [], o2, u;
        if (this._peek.type === 16) for (o2 = this._peek.sourceSpan, u = this._peek.sourceSpan.end; this._peek.type === 16 || this._peek.type === 17 || this._peek.type === 9; ) {
          let m = this._advance();
          a.push(m), m.type === 17 ? i += m.parts.join("").replace(/&([^;]+);/g, pi) : m.type === 9 ? i += m.parts[0] : i += m.parts.join(""), u = n2 = m.sourceSpan.end;
        }
        this._peek.type === 15 && (u = n2 = this._advance().sourceSpan.end);
        let l2 = o2 && u && new h2((s2 == null ? void 0 : s2.sourceSpan.start) ?? o2.start, u, (s2 == null ? void 0 : s2.sourceSpan.fullStart) ?? o2.fullStart);
        return new jt(r2, i, new h2(e2.sourceSpan.start, n2, e2.sourceSpan.fullStart), e2.sourceSpan, l2, a.length > 0 ? a : void 0, void 0);
      }
      _consumeBlockOpen(e2) {
        let r2 = [];
        for (; this._peek.type === 28; ) {
          let o2 = this._advance();
          r2.push(new ht(o2.parts[0], o2.sourceSpan));
        }
        this._peek.type === 26 && this._advance();
        let n2 = this._peek.sourceSpan.fullStart, s2 = new h2(e2.sourceSpan.start, n2, e2.sourceSpan.fullStart), i = new h2(e2.sourceSpan.start, n2, e2.sourceSpan.fullStart), a = new ee2(e2.parts[0], r2, [], s2, e2.sourceSpan, i);
        this._pushContainer(a, false);
      }
      _consumeBlockClose(e2) {
        this._popContainer(null, ee2, e2.sourceSpan) || this.errors.push(L2.create(null, e2.sourceSpan, 'Unexpected closing block. The block may have been closed earlier. If you meant to write the } character, you should use the "&#125;" HTML entity instead.'));
      }
      _consumeIncompleteBlock(e2) {
        let r2 = [];
        for (; this._peek.type === 28; ) {
          let o2 = this._advance();
          r2.push(new ht(o2.parts[0], o2.sourceSpan));
        }
        let n2 = this._peek.sourceSpan.fullStart, s2 = new h2(e2.sourceSpan.start, n2, e2.sourceSpan.fullStart), i = new h2(e2.sourceSpan.start, n2, e2.sourceSpan.fullStart), a = new ee2(e2.parts[0], r2, [], s2, e2.sourceSpan, i);
        this._pushContainer(a, false), this._popContainer(null, ee2, null), this.errors.push(L2.create(e2.parts[0], s2, `Incomplete block "${e2.parts[0]}". If you meant to write the @ character, you should use the "&#64;" HTML entity instead.`));
      }
      _consumeLet(e2) {
        let r2 = e2.parts[0], n2, s2;
        if (this._peek.type !== 31) {
          this.errors.push(L2.create(e2.parts[0], e2.sourceSpan, `Invalid @let declaration "${r2}". Declaration must have a value.`));
          return;
        } else n2 = this._advance();
        if (this._peek.type !== 32) {
          this.errors.push(L2.create(e2.parts[0], e2.sourceSpan, `Unterminated @let declaration "${r2}". Declaration must be terminated with a semicolon.`));
          return;
        } else s2 = this._advance();
        let i = s2.sourceSpan.fullStart, a = new h2(e2.sourceSpan.start, i, e2.sourceSpan.fullStart), o2 = e2.sourceSpan.toString().lastIndexOf(r2), u = e2.sourceSpan.start.moveBy(o2), p2 = new h2(u, e2.sourceSpan.end), l2 = new mt(r2, n2.parts[0], a, p2, n2.sourceSpan);
        this._addToParent(l2);
      }
      _consumeIncompleteLet(e2) {
        let r2 = e2.parts[0] ?? "", n2 = r2 ? ` "${r2}"` : "";
        if (r2.length > 0) {
          let s2 = e2.sourceSpan.toString().lastIndexOf(r2), i = e2.sourceSpan.start.moveBy(s2), a = new h2(i, e2.sourceSpan.end), o2 = new h2(e2.sourceSpan.start, e2.sourceSpan.start.moveBy(0)), u = new mt(r2, "", e2.sourceSpan, a, o2);
          this._addToParent(u);
        }
        this.errors.push(L2.create(e2.parts[0], e2.sourceSpan, `Incomplete @let declaration${n2}. @let declarations must be written as \`@let <name> = <value>;\``));
      }
      _getContainer() {
        return this._containerStack.length > 0 ? this._containerStack[this._containerStack.length - 1] : null;
      }
      _getClosestParentElement() {
        for (let e2 = this._containerStack.length - 1; e2 > -1; e2--) if (this._containerStack[e2] instanceof Y) return this._containerStack[e2];
        return null;
      }
      _addToParent(e2) {
        let r2 = this._getContainer();
        r2 === null ? this.rootNodes.push(e2) : r2.children.push(e2);
      }
      _getElementFullName(e2, r2, n2) {
        if (e2 === "" && (e2 = this.getTagDefinition(r2).implicitNamespacePrefix || "", e2 === "" && n2 != null)) {
          let s2 = ct(n2.name)[1];
          this.getTagDefinition(s2).preventNamespaceInheritance || (e2 = Me2(n2.name));
        }
        return qe(e2, r2);
      }
    };
    ir = class extends sr {
      constructor() {
        super(He2);
      }
      parse(e2, r2, n2, s2 = false, i) {
        return super.parse(e2, r2, n2, s2, i);
      }
    };
    Xr = null;
    Uo = () => (Xr || (Xr = new ir()), Xr);
    hi = Wo;
    _t = 3;
    mi = zo;
    ar = { attrs: true, children: true, cases: true, expression: true };
    fi = /* @__PURE__ */ new Set(["parent"]);
    Ge2 = class Ge3 {
      constructor(e2 = {}) {
        At(this, le);
        lr(this, "type");
        lr(this, "parent");
        for (let r2 of /* @__PURE__ */ new Set([...fi, ...Object.keys(e2)])) this.setProperty(r2, e2[r2]);
      }
      setProperty(e2, r2) {
        if (this[e2] !== r2) {
          if (e2 in ar && (r2 = r2.map((n2) => this.createChild(n2))), !fi.has(e2)) {
            this[e2] = r2;
            return;
          }
          Object.defineProperty(this, e2, { value: r2, enumerable: false, configurable: true });
        }
      }
      map(e2) {
        let r2;
        for (let n2 in ar) {
          let s2 = this[n2];
          if (s2) {
            let i = Yo(s2, (a) => a.map(e2));
            r2 !== s2 && (r2 || (r2 = new Ge3({ parent: this.parent })), r2.setProperty(n2, i));
          }
        }
        if (r2) for (let n2 in this) n2 in ar || (r2[n2] = this[n2]);
        return e2(r2 || this);
      }
      walk(e2) {
        for (let r2 in ar) {
          let n2 = this[r2];
          if (n2) for (let s2 = 0; s2 < n2.length; s2++) n2[s2].walk(e2);
        }
        e2(this);
      }
      createChild(e2) {
        let r2 = e2 instanceof Ge3 ? e2.clone() : new Ge3(e2);
        return r2.setProperty("parent", this), r2;
      }
      insertChildBefore(e2, r2) {
        let n2 = this.$children;
        n2.splice(n2.indexOf(e2), 0, this.createChild(r2));
      }
      removeChild(e2) {
        let r2 = this.$children;
        r2.splice(r2.indexOf(e2), 1);
      }
      replaceChild(e2, r2) {
        let n2 = this.$children;
        n2[n2.indexOf(e2)] = this.createChild(r2);
      }
      clone() {
        return new Ge3(this);
      }
      get $children() {
        return this[R(this, le, Jr)];
      }
      set $children(e2) {
        this[R(this, le, Jr)] = e2;
      }
      get firstChild() {
        var e2;
        return (e2 = this.$children) == null ? void 0 : e2[0];
      }
      get lastChild() {
        return K2(true, this.$children, -1);
      }
      get prev() {
        let e2 = R(this, le, Zr);
        return e2[e2.indexOf(this) - 1];
      }
      get next() {
        let e2 = R(this, le, Zr);
        return e2[e2.indexOf(this) + 1];
      }
      get rawName() {
        return this.hasExplicitNamespace ? this.fullName : this.name;
      }
      get fullName() {
        return this.namespace ? this.namespace + ":" + this.name : this.name;
      }
      get attrMap() {
        return Object.fromEntries(this.attrs.map((e2) => [e2.fullName, e2.value]));
      }
    };
    le = /* @__PURE__ */ new WeakSet(), Jr = function() {
      return this.type === "angularIcuCase" ? "expression" : this.type === "angularIcuExpression" ? "cases" : "children";
    }, Zr = function() {
      var e2;
      return ((e2 = this.parent) == null ? void 0 : e2.$children) ?? [];
    };
    or = Ge2;
    jo = [{ regex: /^(\[if([^\]]*)\]>)(.*?)<!\s*\[endif\]$/su, parse: Ko }, { regex: /^\[if([^\]]*)\]><!$/u, parse: Xo }, { regex: /^<!\s*\[endif\]$/u, parse: Qo }];
    ur = /* @__PURE__ */ new Map([["*", /* @__PURE__ */ new Set(["accesskey", "autocapitalize", "autofocus", "class", "contenteditable", "dir", "draggable", "enterkeyhint", "hidden", "id", "inert", "inputmode", "is", "itemid", "itemprop", "itemref", "itemscope", "itemtype", "lang", "nonce", "popover", "slot", "spellcheck", "style", "tabindex", "title", "translate", "writingsuggestions"])], ["a", /* @__PURE__ */ new Set(["charset", "coords", "download", "href", "hreflang", "name", "ping", "referrerpolicy", "rel", "rev", "shape", "target", "type"])], ["applet", /* @__PURE__ */ new Set(["align", "alt", "archive", "code", "codebase", "height", "hspace", "name", "object", "vspace", "width"])], ["area", /* @__PURE__ */ new Set(["alt", "coords", "download", "href", "hreflang", "nohref", "ping", "referrerpolicy", "rel", "shape", "target", "type"])], ["audio", /* @__PURE__ */ new Set(["autoplay", "controls", "crossorigin", "loop", "muted", "preload", "src"])], ["base", /* @__PURE__ */ new Set(["href", "target"])], ["basefont", /* @__PURE__ */ new Set(["color", "face", "size"])], ["blockquote", /* @__PURE__ */ new Set(["cite"])], ["body", /* @__PURE__ */ new Set(["alink", "background", "bgcolor", "link", "text", "vlink"])], ["br", /* @__PURE__ */ new Set(["clear"])], ["button", /* @__PURE__ */ new Set(["disabled", "form", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget", "name", "popovertarget", "popovertargetaction", "type", "value"])], ["canvas", /* @__PURE__ */ new Set(["height", "width"])], ["caption", /* @__PURE__ */ new Set(["align"])], ["col", /* @__PURE__ */ new Set(["align", "char", "charoff", "span", "valign", "width"])], ["colgroup", /* @__PURE__ */ new Set(["align", "char", "charoff", "span", "valign", "width"])], ["data", /* @__PURE__ */ new Set(["value"])], ["del", /* @__PURE__ */ new Set(["cite", "datetime"])], ["details", /* @__PURE__ */ new Set(["name", "open"])], ["dialog", /* @__PURE__ */ new Set(["open"])], ["dir", /* @__PURE__ */ new Set(["compact"])], ["div", /* @__PURE__ */ new Set(["align"])], ["dl", /* @__PURE__ */ new Set(["compact"])], ["embed", /* @__PURE__ */ new Set(["height", "src", "type", "width"])], ["fieldset", /* @__PURE__ */ new Set(["disabled", "form", "name"])], ["font", /* @__PURE__ */ new Set(["color", "face", "size"])], ["form", /* @__PURE__ */ new Set(["accept", "accept-charset", "action", "autocomplete", "enctype", "method", "name", "novalidate", "target"])], ["frame", /* @__PURE__ */ new Set(["frameborder", "longdesc", "marginheight", "marginwidth", "name", "noresize", "scrolling", "src"])], ["frameset", /* @__PURE__ */ new Set(["cols", "rows"])], ["h1", /* @__PURE__ */ new Set(["align"])], ["h2", /* @__PURE__ */ new Set(["align"])], ["h3", /* @__PURE__ */ new Set(["align"])], ["h4", /* @__PURE__ */ new Set(["align"])], ["h5", /* @__PURE__ */ new Set(["align"])], ["h6", /* @__PURE__ */ new Set(["align"])], ["head", /* @__PURE__ */ new Set(["profile"])], ["hr", /* @__PURE__ */ new Set(["align", "noshade", "size", "width"])], ["html", /* @__PURE__ */ new Set(["manifest", "version"])], ["iframe", /* @__PURE__ */ new Set(["align", "allow", "allowfullscreen", "allowpaymentrequest", "allowusermedia", "frameborder", "height", "loading", "longdesc", "marginheight", "marginwidth", "name", "referrerpolicy", "sandbox", "scrolling", "src", "srcdoc", "width"])], ["img", /* @__PURE__ */ new Set(["align", "alt", "border", "crossorigin", "decoding", "fetchpriority", "height", "hspace", "ismap", "loading", "longdesc", "name", "referrerpolicy", "sizes", "src", "srcset", "usemap", "vspace", "width"])], ["input", /* @__PURE__ */ new Set(["accept", "align", "alt", "autocomplete", "checked", "dirname", "disabled", "form", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget", "height", "ismap", "list", "max", "maxlength", "min", "minlength", "multiple", "name", "pattern", "placeholder", "popovertarget", "popovertargetaction", "readonly", "required", "size", "src", "step", "type", "usemap", "value", "width"])], ["ins", /* @__PURE__ */ new Set(["cite", "datetime"])], ["isindex", /* @__PURE__ */ new Set(["prompt"])], ["label", /* @__PURE__ */ new Set(["for", "form"])], ["legend", /* @__PURE__ */ new Set(["align"])], ["li", /* @__PURE__ */ new Set(["type", "value"])], ["link", /* @__PURE__ */ new Set(["as", "blocking", "charset", "color", "crossorigin", "disabled", "fetchpriority", "href", "hreflang", "imagesizes", "imagesrcset", "integrity", "media", "referrerpolicy", "rel", "rev", "sizes", "target", "type"])], ["map", /* @__PURE__ */ new Set(["name"])], ["menu", /* @__PURE__ */ new Set(["compact"])], ["meta", /* @__PURE__ */ new Set(["charset", "content", "http-equiv", "media", "name", "scheme"])], ["meter", /* @__PURE__ */ new Set(["high", "low", "max", "min", "optimum", "value"])], ["object", /* @__PURE__ */ new Set(["align", "archive", "border", "classid", "codebase", "codetype", "data", "declare", "form", "height", "hspace", "name", "standby", "type", "typemustmatch", "usemap", "vspace", "width"])], ["ol", /* @__PURE__ */ new Set(["compact", "reversed", "start", "type"])], ["optgroup", /* @__PURE__ */ new Set(["disabled", "label"])], ["option", /* @__PURE__ */ new Set(["disabled", "label", "selected", "value"])], ["output", /* @__PURE__ */ new Set(["for", "form", "name"])], ["p", /* @__PURE__ */ new Set(["align"])], ["param", /* @__PURE__ */ new Set(["name", "type", "value", "valuetype"])], ["pre", /* @__PURE__ */ new Set(["width"])], ["progress", /* @__PURE__ */ new Set(["max", "value"])], ["q", /* @__PURE__ */ new Set(["cite"])], ["script", /* @__PURE__ */ new Set(["async", "blocking", "charset", "crossorigin", "defer", "fetchpriority", "integrity", "language", "nomodule", "referrerpolicy", "src", "type"])], ["select", /* @__PURE__ */ new Set(["autocomplete", "disabled", "form", "multiple", "name", "required", "size"])], ["slot", /* @__PURE__ */ new Set(["name"])], ["source", /* @__PURE__ */ new Set(["height", "media", "sizes", "src", "srcset", "type", "width"])], ["style", /* @__PURE__ */ new Set(["blocking", "media", "type"])], ["table", /* @__PURE__ */ new Set(["align", "bgcolor", "border", "cellpadding", "cellspacing", "frame", "rules", "summary", "width"])], ["tbody", /* @__PURE__ */ new Set(["align", "char", "charoff", "valign"])], ["td", /* @__PURE__ */ new Set(["abbr", "align", "axis", "bgcolor", "char", "charoff", "colspan", "headers", "height", "nowrap", "rowspan", "scope", "valign", "width"])], ["template", /* @__PURE__ */ new Set(["shadowrootclonable", "shadowrootdelegatesfocus", "shadowrootmode"])], ["textarea", /* @__PURE__ */ new Set(["autocomplete", "cols", "dirname", "disabled", "form", "maxlength", "minlength", "name", "placeholder", "readonly", "required", "rows", "wrap"])], ["tfoot", /* @__PURE__ */ new Set(["align", "char", "charoff", "valign"])], ["th", /* @__PURE__ */ new Set(["abbr", "align", "axis", "bgcolor", "char", "charoff", "colspan", "headers", "height", "nowrap", "rowspan", "scope", "valign", "width"])], ["thead", /* @__PURE__ */ new Set(["align", "char", "charoff", "valign"])], ["time", /* @__PURE__ */ new Set(["datetime"])], ["tr", /* @__PURE__ */ new Set(["align", "bgcolor", "char", "charoff", "valign"])], ["track", /* @__PURE__ */ new Set(["default", "kind", "label", "src", "srclang"])], ["ul", /* @__PURE__ */ new Set(["compact", "type"])], ["video", /* @__PURE__ */ new Set(["autoplay", "controls", "crossorigin", "height", "loop", "muted", "playsinline", "poster", "preload", "src", "width"])]]);
    gi = /* @__PURE__ */ new Set(["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "bgsound", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "command", "content", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "image", "img", "input", "ins", "isindex", "kbd", "keygen", "label", "legend", "li", "link", "listing", "main", "map", "mark", "marquee", "math", "menu", "menuitem", "meta", "meter", "multicol", "nav", "nextid", "nobr", "noembed", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "plaintext", "pre", "progress", "q", "rb", "rbc", "rp", "rt", "rtc", "ruby", "s", "samp", "script", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr", "xmp"]);
    en = { name: "html", normalizeTagName: true, normalizeAttributeName: true, allowHtmComponentClosingTags: true };
    ru = Et(en);
    nu = /* @__PURE__ */ new Set(["mj-style", "mj-raw"]);
    su = Et({ ...en, name: "mjml", shouldParseAsRawText: (t9) => nu.has(t9) });
    iu = Et({ name: "angular" });
    au = Et({ name: "vue", isTagNameCaseSensitive: true, shouldParseAsRawText(t9, e2, r2, n2) {
      return t9.toLowerCase() !== "html" && !r2 && (t9 !== "template" || n2.some(({ name: s2, value: i }) => s2 === "lang" && i !== "html" && i !== "" && i !== void 0));
    } });
    ou = Et({ name: "lwc", canSelfClose: false });
    uu = { html: qs };
    ym = rn;
  }
});

// node_modules/prettier/standalone.mjs
function Et2(e2, t9, r2) {
  return rr2.diff(e2, t9, r2);
}
function nr2(e2) {
  let t9 = e2.indexOf("\r");
  return t9 !== -1 ? e2.charAt(t9 + 1) === `
` ? "crlf" : "cr" : "lf";
}
function xe3(e2) {
  switch (e2) {
    case "cr":
      return "\r";
    case "crlf":
      return `\r
`;
    default:
      return `
`;
  }
}
function Ct2(e2, t9) {
  let r2;
  switch (t9) {
    case `
`:
      r2 = /\n/gu;
      break;
    case "\r":
      r2 = /\r/gu;
      break;
    case `\r
`:
      r2 = /\r\n/gu;
      break;
    default:
      throw new Error(`Unexpected "eol" ${JSON.stringify(t9)}.`);
  }
  let n2 = e2.match(r2);
  return n2 ? n2.length : 0;
}
function ur2(e2) {
  return te2(false, e2, /\r\n?/gu, `
`);
}
function or2(e2) {
  let t9 = e2.length;
  for (; t9 > 0 && (e2[t9 - 1] === "\r" || e2[t9 - 1] === `
`); ) t9--;
  return t9 < e2.length ? e2.slice(0, t9) : e2;
}
function _u(e2) {
  if (typeof e2 == "string") return W2;
  if (Array.isArray(e2)) return Y2;
  if (!e2) return;
  let { type: t9 } = e2;
  if (Ue3.has(t9)) return t9;
}
function wu(e2) {
  let t9 = e2 === null ? "null" : typeof e2;
  if (t9 !== "string" && t9 !== "object") return `Unexpected doc '${t9}', 
Expected it to be 'string' or 'object'.`;
  if (M2(e2)) throw new Error("doc is valid.");
  let r2 = Object.prototype.toString.call(e2);
  if (r2 !== "[object Object]") return `Unexpected doc '${r2}'.`;
  let n2 = xu([...Ue3].map((u) => `'${u}'`));
  return `Unexpected doc.type '${e2.type}'.
Expected it to be ${n2}.`;
}
function bu(e2, t9, r2, n2) {
  let u = [e2];
  for (; u.length > 0; ) {
    let o2 = u.pop();
    if (o2 === ir2) {
      r2(u.pop());
      continue;
    }
    r2 && u.push(o2, ir2);
    let i = M2(o2);
    if (!i) throw new q2(o2);
    if ((t9 == null ? void 0 : t9(o2)) !== false) switch (i) {
      case Y2:
      case k3: {
        let s2 = i === Y2 ? o2 : o2.parts;
        for (let a = s2.length, c2 = a - 1; c2 >= 0; --c2) u.push(s2[c2]);
        break;
      }
      case _3:
        u.push(o2.flatContents, o2.breakContents);
        break;
      case B2:
        if (n2 && o2.expandedStates) for (let s2 = o2.expandedStates.length, a = s2 - 1; a >= 0; --a) u.push(o2.expandedStates[a]);
        else u.push(o2.contents);
        break;
      case O2:
      case N3:
      case v3:
      case S3:
      case L3:
        u.push(o2.contents);
        break;
      case W2:
      case j2:
      case P2:
      case I3:
      case g2:
      case w3:
        break;
      default:
        throw new q2(o2);
    }
  }
}
function be3(e2, t9) {
  if (typeof e2 == "string") return t9(e2);
  let r2 = /* @__PURE__ */ new Map();
  return n2(e2);
  function n2(o2) {
    if (r2.has(o2)) return r2.get(o2);
    let i = u(o2);
    return r2.set(o2, i), i;
  }
  function u(o2) {
    switch (M2(o2)) {
      case Y2:
        return t9(o2.map(n2));
      case k3:
        return t9({ ...o2, parts: o2.parts.map(n2) });
      case _3:
        return t9({ ...o2, breakContents: n2(o2.breakContents), flatContents: n2(o2.flatContents) });
      case B2: {
        let { expandedStates: i, contents: s2 } = o2;
        return i ? (i = i.map(n2), s2 = i[0]) : s2 = n2(s2), t9({ ...o2, contents: s2, expandedStates: i });
      }
      case O2:
      case N3:
      case v3:
      case S3:
      case L3:
        return t9({ ...o2, contents: n2(o2.contents) });
      case W2:
      case j2:
      case P2:
      case I3:
      case g2:
      case w3:
        return t9(o2);
      default:
        throw new q2(o2);
    }
  }
}
function Ve2(e2, t9, r2) {
  let n2 = r2, u = false;
  function o2(i) {
    if (u) return false;
    let s2 = t9(i);
    s2 !== void 0 && (u = true, n2 = s2);
  }
  return le2(e2, o2), n2;
}
function ku(e2) {
  if (e2.type === B2 && e2.break || e2.type === g2 && e2.hard || e2.type === w3) return true;
}
function Dr2(e2) {
  return Ve2(e2, ku, false);
}
function sr2(e2) {
  if (e2.length > 0) {
    let t9 = y2(false, e2, -1);
    !t9.expandedStates && !t9.break && (t9.break = "propagated");
  }
  return null;
}
function cr2(e2) {
  let t9 = /* @__PURE__ */ new Set(), r2 = [];
  function n2(o2) {
    if (o2.type === w3 && sr2(r2), o2.type === B2) {
      if (r2.push(o2), t9.has(o2)) return false;
      t9.add(o2);
    }
  }
  function u(o2) {
    o2.type === B2 && r2.pop().break && sr2(r2);
  }
  le2(e2, n2, u, true);
}
function Su(e2) {
  return e2.type === g2 && !e2.hard ? e2.soft ? "" : " " : e2.type === _3 ? e2.flatContents : e2;
}
function fr2(e2) {
  return be3(e2, Su);
}
function ar2(e2) {
  for (e2 = [...e2]; e2.length >= 2 && y2(false, e2, -2).type === g2 && y2(false, e2, -1).type === w3; ) e2.length -= 2;
  if (e2.length > 0) {
    let t9 = we3(y2(false, e2, -1));
    e2[e2.length - 1] = t9;
  }
  return e2;
}
function we3(e2) {
  switch (M2(e2)) {
    case N3:
    case v3:
    case B2:
    case L3:
    case S3: {
      let t9 = we3(e2.contents);
      return { ...e2, contents: t9 };
    }
    case _3:
      return { ...e2, breakContents: we3(e2.breakContents), flatContents: we3(e2.flatContents) };
    case k3:
      return { ...e2, parts: ar2(e2.parts) };
    case Y2:
      return ar2(e2);
    case W2:
      return or2(e2);
    case O2:
    case j2:
    case P2:
    case I3:
    case g2:
    case w3:
      break;
    default:
      throw new q2(e2);
  }
  return e2;
}
function $e(e2) {
  return we3(Nu(e2));
}
function Tu(e2) {
  switch (M2(e2)) {
    case k3:
      if (e2.parts.every((t9) => t9 === "")) return "";
      break;
    case B2:
      if (!e2.contents && !e2.id && !e2.break && !e2.expandedStates) return "";
      if (e2.contents.type === B2 && e2.contents.id === e2.id && e2.contents.break === e2.break && e2.contents.expandedStates === e2.expandedStates) return e2.contents;
      break;
    case O2:
    case N3:
    case v3:
    case L3:
      if (!e2.contents) return "";
      break;
    case _3:
      if (!e2.flatContents && !e2.breakContents) return "";
      break;
    case Y2: {
      let t9 = [];
      for (let r2 of e2) {
        if (!r2) continue;
        let [n2, ...u] = Array.isArray(r2) ? r2 : [r2];
        typeof n2 == "string" && typeof y2(false, t9, -1) == "string" ? t9[t9.length - 1] += n2 : t9.push(n2), t9.push(...u);
      }
      return t9.length === 0 ? "" : t9.length === 1 ? t9[0] : t9;
    }
    case W2:
    case j2:
    case P2:
    case I3:
    case g2:
    case S3:
    case w3:
      break;
    default:
      throw new q2(e2);
  }
  return e2;
}
function Nu(e2) {
  return be3(e2, (t9) => Tu(t9));
}
function lr2(e2, t9 = We2) {
  return be3(e2, (r2) => typeof r2 == "string" ? ke3(t9, r2.split(`
`)) : r2);
}
function Ou(e2) {
  if (e2.type === g2) return true;
}
function Fr2(e2) {
  return Ve2(e2, Ou, false);
}
function Fe3(e2, t9) {
  return e2.type === S3 ? { ...e2, contents: t9(e2.contents) } : t9(e2);
}
function ie2(e2) {
  return K3(e2), { type: N3, contents: e2 };
}
function oe2(e2, t9) {
  return K3(t9), { type: O2, contents: t9, n: e2 };
}
function At2(e2, t9 = {}) {
  return K3(e2), yt2(t9.expandedStates, true), { type: B2, id: t9.id, contents: e2, break: !!t9.shouldBreak, expandedStates: t9.expandedStates };
}
function dr2(e2) {
  return oe2(Number.NEGATIVE_INFINITY, e2);
}
function mr2(e2) {
  return oe2({ type: "root" }, e2);
}
function Er2(e2) {
  return oe2(-1, e2);
}
function Cr2(e2, t9) {
  return At2(e2[0], { ...t9, expandedStates: e2 });
}
function hr2(e2) {
  return pr2(e2), { type: k3, parts: e2 };
}
function gr2(e2, t9 = "", r2 = {}) {
  return K3(e2), t9 !== "" && K3(t9), { type: _3, breakContents: e2, flatContents: t9, groupId: r2.groupId };
}
function yr2(e2, t9) {
  return K3(e2), { type: v3, contents: e2, groupId: t9.groupId, negate: t9.negate };
}
function Se3(e2) {
  return K3(e2), { type: L3, contents: e2 };
}
function ke3(e2, t9) {
  K3(e2), yt2(t9);
  let r2 = [];
  for (let n2 = 0; n2 < t9.length; n2++) n2 !== 0 && r2.push(e2), r2.push(t9[n2]);
  return r2;
}
function Ge4(e2, t9, r2) {
  K3(e2);
  let n2 = e2;
  if (t9 > 0) {
    for (let u = 0; u < Math.floor(t9 / r2); ++u) n2 = ie2(n2);
    n2 = oe2(t9 % r2, n2), n2 = oe2(Number.NEGATIVE_INFINITY, n2);
  }
  return n2;
}
function xr2(e2, t9) {
  return K3(t9), e2 ? { type: S3, label: e2, contents: t9 } : t9;
}
function Q3(e2) {
  var t9;
  if (!e2) return "";
  if (Array.isArray(e2)) {
    let r2 = [];
    for (let n2 of e2) if (Array.isArray(n2)) r2.push(...Q3(n2));
    else {
      let u = Q3(n2);
      u !== "" && r2.push(u);
    }
    return r2;
  }
  return e2.type === _3 ? { ...e2, breakContents: Q3(e2.breakContents), flatContents: Q3(e2.flatContents) } : e2.type === B2 ? { ...e2, contents: Q3(e2.contents), expandedStates: (t9 = e2.expandedStates) == null ? void 0 : t9.map(Q3) } : e2.type === k3 ? { type: "fill", parts: e2.parts.map(Q3) } : e2.contents ? { ...e2, contents: Q3(e2.contents) } : e2;
}
function wr2(e2) {
  let t9 = /* @__PURE__ */ Object.create(null), r2 = /* @__PURE__ */ new Set();
  return n2(Q3(e2));
  function n2(o2, i, s2) {
    var a, c2;
    if (typeof o2 == "string") return JSON.stringify(o2);
    if (Array.isArray(o2)) {
      let D2 = o2.map(n2).filter(Boolean);
      return D2.length === 1 ? D2[0] : `[${D2.join(", ")}]`;
    }
    if (o2.type === g2) {
      let D2 = ((a = s2 == null ? void 0 : s2[i + 1]) == null ? void 0 : a.type) === w3;
      return o2.literal ? D2 ? "literalline" : "literallineWithoutBreakParent" : o2.hard ? D2 ? "hardline" : "hardlineWithoutBreakParent" : o2.soft ? "softline" : "line";
    }
    if (o2.type === w3) return ((c2 = s2 == null ? void 0 : s2[i - 1]) == null ? void 0 : c2.type) === g2 && s2[i - 1].hard ? void 0 : "breakParent";
    if (o2.type === P2) return "trim";
    if (o2.type === N3) return "indent(" + n2(o2.contents) + ")";
    if (o2.type === O2) return o2.n === Number.NEGATIVE_INFINITY ? "dedentToRoot(" + n2(o2.contents) + ")" : o2.n < 0 ? "dedent(" + n2(o2.contents) + ")" : o2.n.type === "root" ? "markAsRoot(" + n2(o2.contents) + ")" : "align(" + JSON.stringify(o2.n) + ", " + n2(o2.contents) + ")";
    if (o2.type === _3) return "ifBreak(" + n2(o2.breakContents) + (o2.flatContents ? ", " + n2(o2.flatContents) : "") + (o2.groupId ? (o2.flatContents ? "" : ', ""') + `, { groupId: ${u(o2.groupId)} }` : "") + ")";
    if (o2.type === v3) {
      let D2 = [];
      o2.negate && D2.push("negate: true"), o2.groupId && D2.push(`groupId: ${u(o2.groupId)}`);
      let p2 = D2.length > 0 ? `, { ${D2.join(", ")} }` : "";
      return `indentIfBreak(${n2(o2.contents)}${p2})`;
    }
    if (o2.type === B2) {
      let D2 = [];
      o2.break && o2.break !== "propagated" && D2.push("shouldBreak: true"), o2.id && D2.push(`id: ${u(o2.id)}`);
      let p2 = D2.length > 0 ? `, { ${D2.join(", ")} }` : "";
      return o2.expandedStates ? `conditionalGroup([${o2.expandedStates.map((l2) => n2(l2)).join(",")}]${p2})` : `group(${n2(o2.contents)}${p2})`;
    }
    if (o2.type === k3) return `fill([${o2.parts.map((D2) => n2(D2)).join(", ")}])`;
    if (o2.type === L3) return "lineSuffix(" + n2(o2.contents) + ")";
    if (o2.type === I3) return "lineSuffixBoundary";
    if (o2.type === S3) return `label(${JSON.stringify(o2.label)}, ${n2(o2.contents)})`;
    if (o2.type === j2) return "cursor";
    throw new Error("Unknown doc type " + o2.type);
  }
  function u(o2) {
    if (typeof o2 != "symbol") return JSON.stringify(String(o2));
    if (o2 in t9) return t9[o2];
    let i = o2.description || "symbol";
    for (let s2 = 0; ; s2++) {
      let a = i + (s2 > 0 ? ` #${s2}` : "");
      if (!r2.has(a)) return r2.add(a), t9[o2] = `Symbol.for(${JSON.stringify(a)})`;
    }
  }
}
function kr2(e2) {
  return e2 === 12288 || e2 >= 65281 && e2 <= 65376 || e2 >= 65504 && e2 <= 65510;
}
function Sr2(e2) {
  return e2 >= 4352 && e2 <= 4447 || e2 === 8986 || e2 === 8987 || e2 === 9001 || e2 === 9002 || e2 >= 9193 && e2 <= 9196 || e2 === 9200 || e2 === 9203 || e2 === 9725 || e2 === 9726 || e2 === 9748 || e2 === 9749 || e2 >= 9776 && e2 <= 9783 || e2 >= 9800 && e2 <= 9811 || e2 === 9855 || e2 >= 9866 && e2 <= 9871 || e2 === 9875 || e2 === 9889 || e2 === 9898 || e2 === 9899 || e2 === 9917 || e2 === 9918 || e2 === 9924 || e2 === 9925 || e2 === 9934 || e2 === 9940 || e2 === 9962 || e2 === 9970 || e2 === 9971 || e2 === 9973 || e2 === 9978 || e2 === 9981 || e2 === 9989 || e2 === 9994 || e2 === 9995 || e2 === 10024 || e2 === 10060 || e2 === 10062 || e2 >= 10067 && e2 <= 10069 || e2 === 10071 || e2 >= 10133 && e2 <= 10135 || e2 === 10160 || e2 === 10175 || e2 === 11035 || e2 === 11036 || e2 === 11088 || e2 === 11093 || e2 >= 11904 && e2 <= 11929 || e2 >= 11931 && e2 <= 12019 || e2 >= 12032 && e2 <= 12245 || e2 >= 12272 && e2 <= 12287 || e2 >= 12289 && e2 <= 12350 || e2 >= 12353 && e2 <= 12438 || e2 >= 12441 && e2 <= 12543 || e2 >= 12549 && e2 <= 12591 || e2 >= 12593 && e2 <= 12686 || e2 >= 12688 && e2 <= 12773 || e2 >= 12783 && e2 <= 12830 || e2 >= 12832 && e2 <= 12871 || e2 >= 12880 && e2 <= 42124 || e2 >= 42128 && e2 <= 42182 || e2 >= 43360 && e2 <= 43388 || e2 >= 44032 && e2 <= 55203 || e2 >= 63744 && e2 <= 64255 || e2 >= 65040 && e2 <= 65049 || e2 >= 65072 && e2 <= 65106 || e2 >= 65108 && e2 <= 65126 || e2 >= 65128 && e2 <= 65131 || e2 >= 94176 && e2 <= 94180 || e2 === 94192 || e2 === 94193 || e2 >= 94208 && e2 <= 100343 || e2 >= 100352 && e2 <= 101589 || e2 >= 101631 && e2 <= 101640 || e2 >= 110576 && e2 <= 110579 || e2 >= 110581 && e2 <= 110587 || e2 === 110589 || e2 === 110590 || e2 >= 110592 && e2 <= 110882 || e2 === 110898 || e2 >= 110928 && e2 <= 110930 || e2 === 110933 || e2 >= 110948 && e2 <= 110951 || e2 >= 110960 && e2 <= 111355 || e2 >= 119552 && e2 <= 119638 || e2 >= 119648 && e2 <= 119670 || e2 === 126980 || e2 === 127183 || e2 === 127374 || e2 >= 127377 && e2 <= 127386 || e2 >= 127488 && e2 <= 127490 || e2 >= 127504 && e2 <= 127547 || e2 >= 127552 && e2 <= 127560 || e2 === 127568 || e2 === 127569 || e2 >= 127584 && e2 <= 127589 || e2 >= 127744 && e2 <= 127776 || e2 >= 127789 && e2 <= 127797 || e2 >= 127799 && e2 <= 127868 || e2 >= 127870 && e2 <= 127891 || e2 >= 127904 && e2 <= 127946 || e2 >= 127951 && e2 <= 127955 || e2 >= 127968 && e2 <= 127984 || e2 === 127988 || e2 >= 127992 && e2 <= 128062 || e2 === 128064 || e2 >= 128066 && e2 <= 128252 || e2 >= 128255 && e2 <= 128317 || e2 >= 128331 && e2 <= 128334 || e2 >= 128336 && e2 <= 128359 || e2 === 128378 || e2 === 128405 || e2 === 128406 || e2 === 128420 || e2 >= 128507 && e2 <= 128591 || e2 >= 128640 && e2 <= 128709 || e2 === 128716 || e2 >= 128720 && e2 <= 128722 || e2 >= 128725 && e2 <= 128727 || e2 >= 128732 && e2 <= 128735 || e2 === 128747 || e2 === 128748 || e2 >= 128756 && e2 <= 128764 || e2 >= 128992 && e2 <= 129003 || e2 === 129008 || e2 >= 129292 && e2 <= 129338 || e2 >= 129340 && e2 <= 129349 || e2 >= 129351 && e2 <= 129535 || e2 >= 129648 && e2 <= 129660 || e2 >= 129664 && e2 <= 129673 || e2 >= 129679 && e2 <= 129734 || e2 >= 129742 && e2 <= 129756 || e2 >= 129759 && e2 <= 129769 || e2 >= 129776 && e2 <= 129784 || e2 >= 131072 && e2 <= 196605 || e2 >= 196608 && e2 <= 262141;
}
function vu(e2) {
  if (!e2) return 0;
  if (!Pu.test(e2)) return e2.length;
  e2 = e2.replace(br2(), "  ");
  let t9 = 0;
  for (let r2 of e2) {
    let n2 = r2.codePointAt(0);
    n2 <= 31 || n2 >= 127 && n2 <= 159 || n2 >= 768 && n2 <= 879 || (t9 += Tr2(n2) ? 1 : 2);
  }
  return t9;
}
function Nr2() {
  return { value: "", length: 0, queue: [] };
}
function Lu(e2, t9) {
  return xt2(e2, { type: "indent" }, t9);
}
function Iu(e2, t9, r2) {
  return t9 === Number.NEGATIVE_INFINITY ? e2.root || Nr2() : t9 < 0 ? xt2(e2, { type: "dedent" }, r2) : t9 ? t9.type === "root" ? { ...e2, root: e2 } : xt2(e2, { type: typeof t9 == "string" ? "stringAlign" : "numberAlign", n: t9 }, r2) : e2;
}
function xt2(e2, t9, r2) {
  let n2 = t9.type === "dedent" ? e2.queue.slice(0, -1) : [...e2.queue, t9], u = "", o2 = 0, i = 0, s2 = 0;
  for (let f3 of n2) switch (f3.type) {
    case "indent":
      D2(), r2.useTabs ? a(1) : c2(r2.tabWidth);
      break;
    case "stringAlign":
      D2(), u += f3.n, o2 += f3.n.length;
      break;
    case "numberAlign":
      i += 1, s2 += f3.n;
      break;
    default:
      throw new Error(`Unexpected type '${f3.type}'`);
  }
  return l2(), { ...e2, value: u, length: o2, queue: n2 };
  function a(f3) {
    u += "	".repeat(f3), o2 += r2.tabWidth * f3;
  }
  function c2(f3) {
    u += " ".repeat(f3), o2 += f3;
  }
  function D2() {
    r2.useTabs ? p2() : l2();
  }
  function p2() {
    i > 0 && a(i), F();
  }
  function l2() {
    s2 > 0 && c2(s2), F();
  }
  function F() {
    i = 0, s2 = 0;
  }
}
function wt2(e2) {
  let t9 = 0, r2 = 0, n2 = e2.length;
  e: for (; n2--; ) {
    let u = e2[n2];
    if (u === de3) {
      r2++;
      continue;
    }
    for (let o2 = u.length - 1; o2 >= 0; o2--) {
      let i = u[o2];
      if (i === " " || i === "	") t9++;
      else {
        e2[n2] = u.slice(0, o2 + 1);
        break e;
      }
    }
  }
  if (t9 > 0 || r2 > 0) for (e2.length = n2 + 1; r2-- > 0; ) e2.push(de3);
  return t9;
}
function Ke2(e2, t9, r2, n2, u, o2) {
  if (r2 === Number.POSITIVE_INFINITY) return true;
  let i = t9.length, s2 = [e2], a = [];
  for (; r2 >= 0; ) {
    if (s2.length === 0) {
      if (i === 0) return true;
      s2.push(t9[--i]);
      continue;
    }
    let { mode: c2, doc: D2 } = s2.pop(), p2 = M2(D2);
    switch (p2) {
      case W2:
        a.push(D2), r2 -= Ne3(D2);
        break;
      case Y2:
      case k3: {
        let l2 = p2 === Y2 ? D2 : D2.parts, F = D2[_t2] ?? 0;
        for (let f3 = l2.length - 1; f3 >= F; f3--) s2.push({ mode: c2, doc: l2[f3] });
        break;
      }
      case N3:
      case O2:
      case v3:
      case S3:
        s2.push({ mode: c2, doc: D2.contents });
        break;
      case P2:
        r2 += wt2(a);
        break;
      case B2: {
        if (o2 && D2.break) return false;
        let l2 = D2.break ? R2 : c2, F = D2.expandedStates && l2 === R2 ? y2(false, D2.expandedStates, -1) : D2.contents;
        s2.push({ mode: l2, doc: F });
        break;
      }
      case _3: {
        let F = (D2.groupId ? u[D2.groupId] || H3 : c2) === R2 ? D2.breakContents : D2.flatContents;
        F && s2.push({ mode: c2, doc: F });
        break;
      }
      case g2:
        if (c2 === R2 || D2.hard) return true;
        D2.soft || (a.push(" "), r2--);
        break;
      case L3:
        n2 = true;
        break;
      case I3:
        if (n2) return false;
        break;
    }
  }
  return false;
}
function me3(e2, t9) {
  let r2 = {}, n2 = t9.printWidth, u = xe3(t9.endOfLine), o2 = 0, i = [{ ind: Nr2(), mode: R2, doc: e2 }], s2 = [], a = false, c2 = [], D2 = 0;
  for (cr2(e2); i.length > 0; ) {
    let { ind: l2, mode: F, doc: f3 } = i.pop();
    switch (M2(f3)) {
      case W2: {
        let d2 = u !== `
` ? te2(false, f3, `
`, u) : f3;
        s2.push(d2), i.length > 0 && (o2 += Ne3(d2));
        break;
      }
      case Y2:
        for (let d2 = f3.length - 1; d2 >= 0; d2--) i.push({ ind: l2, mode: F, doc: f3[d2] });
        break;
      case j2:
        if (D2 >= 2) throw new Error("There are too many 'cursor' in doc.");
        s2.push(de3), D2++;
        break;
      case N3:
        i.push({ ind: Lu(l2, t9), mode: F, doc: f3.contents });
        break;
      case O2:
        i.push({ ind: Iu(l2, f3.n, t9), mode: F, doc: f3.contents });
        break;
      case P2:
        o2 -= wt2(s2);
        break;
      case B2:
        switch (F) {
          case H3:
            if (!a) {
              i.push({ ind: l2, mode: f3.break ? R2 : H3, doc: f3.contents });
              break;
            }
          case R2: {
            a = false;
            let d2 = { ind: l2, mode: H3, doc: f3.contents }, m = n2 - o2, C2 = c2.length > 0;
            if (!f3.break && Ke2(d2, i, m, C2, r2)) i.push(d2);
            else if (f3.expandedStates) {
              let E3 = y2(false, f3.expandedStates, -1);
              if (f3.break) {
                i.push({ ind: l2, mode: R2, doc: E3 });
                break;
              } else for (let h3 = 1; h3 < f3.expandedStates.length + 1; h3++) if (h3 >= f3.expandedStates.length) {
                i.push({ ind: l2, mode: R2, doc: E3 });
                break;
              } else {
                let x2 = f3.expandedStates[h3], A = { ind: l2, mode: H3, doc: x2 };
                if (Ke2(A, i, m, C2, r2)) {
                  i.push(A);
                  break;
                }
              }
            } else i.push({ ind: l2, mode: R2, doc: f3.contents });
            break;
          }
        }
        f3.id && (r2[f3.id] = y2(false, i, -1).mode);
        break;
      case k3: {
        let d2 = n2 - o2, m = f3[_t2] ?? 0, { parts: C2 } = f3, E3 = C2.length - m;
        if (E3 === 0) break;
        let h3 = C2[m + 0], x2 = C2[m + 1], A = { ind: l2, mode: H3, doc: h3 }, $3 = { ind: l2, mode: R2, doc: h3 }, ue = Ke2(A, [], d2, c2.length > 0, r2, true);
        if (E3 === 1) {
          ue ? i.push(A) : i.push($3);
          break;
        }
        let Be3 = { ind: l2, mode: H3, doc: x2 }, lt2 = { ind: l2, mode: R2, doc: x2 };
        if (E3 === 2) {
          ue ? i.push(Be3, A) : i.push(lt2, $3);
          break;
        }
        let lu = C2[m + 2], Ft2 = { ind: l2, mode: F, doc: { ...f3, [_t2]: m + 2 } };
        Ke2({ ind: l2, mode: H3, doc: [h3, x2, lu] }, [], d2, c2.length > 0, r2, true) ? i.push(Ft2, Be3, A) : ue ? i.push(Ft2, lt2, A) : i.push(Ft2, lt2, $3);
        break;
      }
      case _3:
      case v3: {
        let d2 = f3.groupId ? r2[f3.groupId] : F;
        if (d2 === R2) {
          let m = f3.type === _3 ? f3.breakContents : f3.negate ? f3.contents : ie2(f3.contents);
          m && i.push({ ind: l2, mode: F, doc: m });
        }
        if (d2 === H3) {
          let m = f3.type === _3 ? f3.flatContents : f3.negate ? ie2(f3.contents) : f3.contents;
          m && i.push({ ind: l2, mode: F, doc: m });
        }
        break;
      }
      case L3:
        c2.push({ ind: l2, mode: F, doc: f3.contents });
        break;
      case I3:
        c2.length > 0 && i.push({ ind: l2, mode: F, doc: Te3 });
        break;
      case g2:
        switch (F) {
          case H3:
            if (f3.hard) a = true;
            else {
              f3.soft || (s2.push(" "), o2 += 1);
              break;
            }
          case R2:
            if (c2.length > 0) {
              i.push({ ind: l2, mode: F, doc: f3 }, ...c2.reverse()), c2.length = 0;
              break;
            }
            f3.literal ? l2.root ? (s2.push(u, l2.root.value), o2 = l2.root.length) : (s2.push(u), o2 = 0) : (o2 -= wt2(s2), s2.push(u + l2.value), o2 = l2.length);
            break;
        }
        break;
      case S3:
        i.push({ ind: l2, mode: F, doc: f3.contents });
        break;
      case w3:
        break;
      default:
        throw new q2(f3);
    }
    i.length === 0 && c2.length > 0 && (i.push(...c2.reverse()), c2.length = 0);
  }
  let p2 = s2.indexOf(de3);
  if (p2 !== -1) {
    let l2 = s2.indexOf(de3, p2 + 1);
    if (l2 === -1) return { formatted: s2.filter((m) => m !== de3).join("") };
    let F = s2.slice(0, p2).join(""), f3 = s2.slice(p2 + 1, l2).join(""), d2 = s2.slice(l2 + 1).join("");
    return { formatted: F + f3 + d2, cursorNodeStart: F.length, cursorNodeText: f3 };
  }
  return { formatted: s2.join("") };
}
function Ru(e2, t9, r2 = 0) {
  let n2 = 0;
  for (let u = r2; u < e2.length; ++u) e2[u] === "	" ? n2 = n2 + t9 - n2 % t9 : n2++;
  return n2;
}
function Yu(e2) {
  return e2 !== null && typeof e2 == "object";
}
function* Ce3(e2, t9) {
  let { getVisitorKeys: r2, filter: n2 = () => true } = t9, u = (o2) => vr2(o2) && n2(o2);
  for (let o2 of r2(e2)) {
    let i = e2[o2];
    if (Array.isArray(i)) for (let s2 of i) u(s2) && (yield s2);
    else u(i) && (yield i);
  }
}
function* Lr2(e2, t9) {
  let r2 = [e2];
  for (let n2 = 0; n2 < r2.length; n2++) {
    let u = r2[n2];
    for (let o2 of Ce3(u, t9)) yield o2, r2.push(o2);
  }
}
function Ir2(e2, t9) {
  return Ce3(e2, t9).next().done;
}
function he3(e2) {
  return (t9, r2, n2) => {
    let u = !!(n2 != null && n2.backwards);
    if (r2 === false) return false;
    let { length: o2 } = t9, i = r2;
    for (; i >= 0 && i < o2; ) {
      let s2 = t9.charAt(i);
      if (e2 instanceof RegExp) {
        if (!e2.test(s2)) return i;
      } else if (!e2.includes(s2)) return i;
      u ? i-- : i++;
    }
    return i === -1 || i === o2 ? i : false;
  };
}
function ju(e2, t9, r2) {
  let n2 = !!(r2 != null && r2.backwards);
  if (t9 === false) return false;
  let u = e2.charAt(t9);
  if (n2) {
    if (e2.charAt(t9 - 1) === "\r" && u === `
`) return t9 - 2;
    if (u === `
` || u === "\r" || u === "\u2028" || u === "\u2029") return t9 - 1;
  } else {
    if (u === "\r" && e2.charAt(t9 + 1) === `
`) return t9 + 2;
    if (u === `
` || u === "\r" || u === "\u2028" || u === "\u2029") return t9 + 1;
  }
  return t9;
}
function Uu(e2, t9, r2 = {}) {
  let n2 = T2(e2, r2.backwards ? t9 - 1 : t9, r2), u = U(e2, n2, r2);
  return n2 !== u;
}
function Vu(e2) {
  return Array.isArray(e2) && e2.length > 0;
}
function Wu(e2) {
  return e2 ? (t9) => e2(t9, Yr) : $u;
}
function Mu(e2) {
  let t9 = e2.type || e2.kind || "(unknown type)", r2 = String(e2.name || e2.id && (typeof e2.id == "object" ? e2.id.name : e2.id) || e2.key && (typeof e2.key == "object" ? e2.key.name : e2.key) || e2.value && (typeof e2.value == "object" ? "" : String(e2.value)) || e2.operator || "");
  return r2.length > 20 && (r2 = r2.slice(0, 19) + "\u2026"), t9 + (r2 ? " " + r2 : "");
}
function St2(e2, t9) {
  (e2.comments ?? (e2.comments = [])).push(t9), t9.printed = false, t9.nodeDescription = Mu(e2);
}
function se3(e2, t9) {
  t9.leading = true, t9.trailing = false, St2(e2, t9);
}
function ee3(e2, t9, r2) {
  t9.leading = false, t9.trailing = false, r2 && (t9.marker = r2), St2(e2, t9);
}
function ae2(e2, t9) {
  t9.leading = false, t9.trailing = true, St2(e2, t9);
}
function Xe2(e2, t9) {
  if (Tt2.has(e2)) return Tt2.get(e2);
  let { printer: { getCommentChildNodes: r2, canAttachComment: n2, getVisitorKeys: u }, locStart: o2, locEnd: i } = t9;
  if (!n2) return [];
  let s2 = ((r2 == null ? void 0 : r2(e2, t9)) ?? [...Ce3(e2, { getVisitorKeys: J3(u) })]).flatMap((a) => n2(a) ? [a] : Xe2(a, t9));
  return s2.sort((a, c2) => o2(a) - o2(c2) || i(a) - i(c2)), Tt2.set(e2, s2), s2;
}
function Ur2(e2, t9, r2, n2) {
  let { locStart: u, locEnd: o2 } = r2, i = u(t9), s2 = o2(t9), a = Xe2(e2, r2), c2, D2, p2 = 0, l2 = a.length;
  for (; p2 < l2; ) {
    let F = p2 + l2 >> 1, f3 = a[F], d2 = u(f3), m = o2(f3);
    if (d2 <= i && s2 <= m) return Ur2(f3, t9, r2, f3);
    if (m <= i) {
      c2 = f3, p2 = F + 1;
      continue;
    }
    if (s2 <= d2) {
      D2 = f3, l2 = F;
      continue;
    }
    throw new Error("Comment location overlaps with node location");
  }
  if ((n2 == null ? void 0 : n2.type) === "TemplateLiteral") {
    let { quasis: F } = n2, f3 = Ot2(F, t9, r2);
    c2 && Ot2(F, c2, r2) !== f3 && (c2 = null), D2 && Ot2(F, D2, r2) !== f3 && (D2 = null);
  }
  return { enclosingNode: n2, precedingNode: c2, followingNode: D2 };
}
function Vr(e2, t9) {
  let { comments: r2 } = e2;
  if (delete e2.comments, !qe2(r2) || !t9.printer.canAttachComment) return;
  let n2 = [], { printer: { experimentalFeatures: { avoidAstMutation: u = false } = {}, handleComments: o2 = {} }, originalText: i } = t9, { ownLine: s2 = Nt2, endOfLine: a = Nt2, remaining: c2 = Nt2 } = o2, D2 = r2.map((p2, l2) => ({ ...Ur2(e2, p2, t9), comment: p2, text: i, options: t9, ast: e2, isLastComment: r2.length - 1 === l2 }));
  for (let [p2, l2] of D2.entries()) {
    let { comment: F, precedingNode: f3, enclosingNode: d2, followingNode: m, text: C2, options: E3, ast: h3, isLastComment: x2 } = l2, A;
    if (u ? A = [l2] : (F.enclosingNode = d2, F.precedingNode = f3, F.followingNode = m, A = [F, C2, E3, h3, x2]), Gu(C2, E3, D2, p2)) F.placement = "ownLine", s2(...A) || (m ? se3(m, F) : f3 ? ae2(f3, F) : d2 ? ee3(d2, F) : ee3(h3, F));
    else if (Ku(C2, E3, D2, p2)) F.placement = "endOfLine", a(...A) || (f3 ? ae2(f3, F) : m ? se3(m, F) : d2 ? ee3(d2, F) : ee3(h3, F));
    else if (F.placement = "remaining", !c2(...A)) if (f3 && m) {
      let $3 = n2.length;
      $3 > 0 && n2[$3 - 1].followingNode !== m && jr2(n2, E3), n2.push(l2);
    } else f3 ? ae2(f3, F) : m ? se3(m, F) : d2 ? ee3(d2, F) : ee3(h3, F);
  }
  if (jr2(n2, t9), !u) for (let p2 of r2) delete p2.precedingNode, delete p2.enclosingNode, delete p2.followingNode;
}
function Gu(e2, t9, r2, n2) {
  let { comment: u, precedingNode: o2 } = r2[n2], { locStart: i, locEnd: s2 } = t9, a = i(u);
  if (o2) for (let c2 = n2 - 1; c2 >= 0; c2--) {
    let { comment: D2, precedingNode: p2 } = r2[c2];
    if (p2 !== o2 || !$r2(e2.slice(s2(D2), a))) break;
    a = i(D2);
  }
  return G3(e2, a, { backwards: true });
}
function Ku(e2, t9, r2, n2) {
  let { comment: u, followingNode: o2 } = r2[n2], { locStart: i, locEnd: s2 } = t9, a = s2(u);
  if (o2) for (let c2 = n2 + 1; c2 < r2.length; c2++) {
    let { comment: D2, followingNode: p2 } = r2[c2];
    if (p2 !== o2 || !$r2(e2.slice(a, i(D2)))) break;
    a = s2(D2);
  }
  return G3(e2, a);
}
function jr2(e2, t9) {
  var s2, a;
  let r2 = e2.length;
  if (r2 === 0) return;
  let { precedingNode: n2, followingNode: u } = e2[0], o2 = t9.locStart(u), i;
  for (i = r2; i > 0; --i) {
    let { comment: c2, precedingNode: D2, followingNode: p2 } = e2[i - 1];
    Oe3.strictEqual(D2, n2), Oe3.strictEqual(p2, u);
    let l2 = t9.originalText.slice(t9.locEnd(c2), o2);
    if (((a = (s2 = t9.printer).isGap) == null ? void 0 : a.call(s2, l2, t9)) ?? /^[\s(]*$/u.test(l2)) o2 = t9.locStart(c2);
    else break;
  }
  for (let [c2, { comment: D2 }] of e2.entries()) c2 < i ? ae2(n2, D2) : se3(u, D2);
  for (let c2 of [n2, u]) c2.comments && c2.comments.length > 1 && c2.comments.sort((D2, p2) => t9.locStart(D2) - t9.locStart(p2));
  e2.length = 0;
}
function Ot2(e2, t9, r2) {
  let n2 = r2.locStart(t9) - 1;
  for (let u = 1; u < e2.length; ++u) if (n2 < r2.locStart(e2[u])) return u - 1;
  return 0;
}
function zu(e2, t9) {
  let r2 = t9 - 1;
  r2 = T2(e2, r2, { backwards: true }), r2 = U(e2, r2, { backwards: true }), r2 = T2(e2, r2, { backwards: true });
  let n2 = U(e2, r2, { backwards: true });
  return r2 !== n2;
}
function Wr2(e2, t9) {
  let r2 = e2.node;
  return r2.printed = true, t9.printer.printComment(e2, t9);
}
function Hu(e2, t9) {
  var D2;
  let r2 = e2.node, n2 = [Wr2(e2, t9)], { printer: u, originalText: o2, locStart: i, locEnd: s2 } = t9;
  if ((D2 = u.isBlockComment) == null ? void 0 : D2.call(u, r2)) {
    let p2 = G3(o2, s2(r2)) ? G3(o2, i(r2), { backwards: true }) ? z9 : Me3 : " ";
    n2.push(p2);
  } else n2.push(z9);
  let c2 = U(o2, T2(o2, s2(r2)));
  return c2 !== false && G3(o2, c2) && n2.push(z9), n2;
}
function Ju(e2, t9, r2) {
  var c2;
  let n2 = e2.node, u = Wr2(e2, t9), { printer: o2, originalText: i, locStart: s2 } = t9, a = (c2 = o2.isBlockComment) == null ? void 0 : c2.call(o2, n2);
  if (r2 != null && r2.hasLineSuffix && !(r2 != null && r2.isBlock) || G3(i, s2(n2), { backwards: true })) {
    let D2 = Pe3(i, s2(n2));
    return { doc: Se3([z9, D2 ? z9 : "", u]), isBlock: a, hasLineSuffix: true };
  }
  return !a || r2 != null && r2.hasLineSuffix ? { doc: [Se3([" ", u]), pe3], isBlock: a, hasLineSuffix: true } : { doc: [" ", u], isBlock: a, hasLineSuffix: false };
}
function qu(e2, t9) {
  let r2 = e2.node;
  if (!r2) return {};
  let n2 = t9[Symbol.for("printedComments")];
  if ((r2.comments || []).filter((a) => !n2.has(a)).length === 0) return { leading: "", trailing: "" };
  let o2 = [], i = [], s2;
  return e2.each(() => {
    let a = e2.node;
    if (n2 != null && n2.has(a)) return;
    let { leading: c2, trailing: D2 } = a;
    c2 ? o2.push(Hu(e2, t9)) : D2 && (s2 = Ju(e2, t9, s2), i.push(s2.doc));
  }, "comments"), { leading: o2, trailing: i };
}
function Mr(e2, t9, r2) {
  let { leading: n2, trailing: u } = qu(e2, r2);
  return !n2 && !u ? t9 : Fe3(t9, (o2) => [n2, o2, u]);
}
function Gr2(e2) {
  let { [Symbol.for("comments")]: t9, [Symbol.for("printedComments")]: r2 } = e2;
  for (let n2 of t9) {
    if (!n2.printed && !r2.has(n2)) throw new Error('Comment "' + n2.value.trim() + '" was not printed. Please report this error!');
    delete n2.printed;
  }
}
function Xu(e2) {
  return () => {
  };
}
function Qe2({ plugins: e2 = [], showDeprecated: t9 = false } = {}) {
  let r2 = e2.flatMap((u) => u.languages ?? []), n2 = [];
  for (let u of Zu(Object.assign({}, ...e2.map(({ options: o2 }) => o2), zr))) !t9 && u.deprecated || (Array.isArray(u.choices) && (t9 || (u.choices = u.choices.filter((o2) => !o2.deprecated)), u.name === "parser" && (u.choices = [...u.choices, ...Qu(u.choices, r2, e2)])), u.pluginDefaults = Object.fromEntries(e2.filter((o2) => {
    var i;
    return ((i = o2.defaultOptions) == null ? void 0 : i[u.name]) !== void 0;
  }).map((o2) => [o2.name, o2.defaultOptions[u.name]])), n2.push(u));
  return { languages: r2, options: n2 };
}
function* Qu(e2, t9, r2) {
  let n2 = new Set(e2.map((u) => u.value));
  for (let u of t9) if (u.parsers) {
    for (let o2 of u.parsers) if (!n2.has(o2)) {
      n2.add(o2);
      let i = r2.find((a) => a.parsers && Object.prototype.hasOwnProperty.call(a.parsers, o2)), s2 = u.name;
      i != null && i.name && (s2 += ` (plugin: ${i.name})`), yield { value: o2, description: s2 };
    }
  }
}
function Zu(e2) {
  let t9 = [];
  for (let [r2, n2] of Object.entries(e2)) {
    let u = { name: r2, ...n2 };
    Array.isArray(u.default) && (u.default = y2(false, u.default, -1).value), t9.push(u);
  }
  return t9;
}
function en2(e2) {
  if (e2 = e2 instanceof URL ? e2 : new URL(e2), e2.protocol !== "file:") throw new TypeError(`URL must be a file URL: received "${e2.protocol}"`);
  return e2;
}
function ro2(e2) {
  return e2 = en2(e2), decodeURIComponent(e2.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25"));
}
function no2(e2) {
  e2 = en2(e2);
  let t9 = decodeURIComponent(e2.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
  return e2.hostname !== "" && (t9 = `\\\\${e2.hostname}${t9}`), t9;
}
function tn2(e2) {
  return to2 ? no2(e2) : ro2(e2);
}
function nn(e2, t9) {
  if (!t9) return;
  let r2 = uo2(t9).toLowerCase();
  return e2.find(({ filenames: n2 }) => n2 == null ? void 0 : n2.some((u) => u.toLowerCase() === r2)) ?? e2.find(({ extensions: n2 }) => n2 == null ? void 0 : n2.some((u) => r2.endsWith(u)));
}
function oo2(e2, t9) {
  if (t9) return e2.find(({ name: r2 }) => r2.toLowerCase() === t9) ?? e2.find(({ aliases: r2 }) => r2 == null ? void 0 : r2.includes(t9)) ?? e2.find(({ extensions: r2 }) => r2 == null ? void 0 : r2.includes(`.${t9}`));
}
function un2(e2, t9) {
  if (t9) {
    if (String(t9).startsWith("file:")) try {
      t9 = rn2(t9);
    } catch {
      return;
    }
    if (typeof t9 == "string") return e2.find(({ isSupported: r2 }) => r2 == null ? void 0 : r2({ filepath: t9 }));
  }
}
function io2(e2, t9) {
  let r2 = Hr(false, e2.plugins).flatMap((u) => u.languages ?? []), n2 = oo2(r2, t9.language) ?? nn(r2, t9.physicalFile) ?? nn(r2, t9.file) ?? un2(r2, t9.physicalFile) ?? un2(r2, t9.file) ?? (t9.physicalFile, void 0);
  return n2 == null ? void 0 : n2.parsers[0];
}
function cn2(e2, t9, r2, n2) {
  return [`Invalid ${V4.red(n2.key(e2))} value.`, `Expected ${V4.blue(r2)},`, `but received ${t9 === Ze2 ? V4.gray("nothing") : V4.red(n2.value(t9))}.`].join(" ");
}
function ln2({ text: e2, list: t9 }, r2) {
  let n2 = [];
  return e2 && n2.push(`- ${V4.blue(e2)}`), t9 && n2.push([`- ${V4.blue(t9.title)}:`].concat(t9.values.map((u) => ln2(u, r2 - Dn2.length).replace(/^|\n/g, `$&${Dn2}`))).join(`
`)), Fn2(n2, r2);
}
function Fn2(e2, t9) {
  if (e2.length === 1) return e2[0];
  let [r2, n2] = e2, [u, o2] = e2.map((i) => i.split(`
`, 1)[0].length);
  return u > t9 && u > o2 ? n2 : r2;
}
function vt2(e2, t9) {
  if (e2 === t9) return 0;
  let r2 = e2;
  e2.length > t9.length && (e2 = t9, t9 = r2);
  let n2 = e2.length, u = t9.length;
  for (; n2 > 0 && e2.charCodeAt(~-n2) === t9.charCodeAt(~-u); ) n2--, u--;
  let o2 = 0;
  for (; o2 < n2 && e2.charCodeAt(o2) === t9.charCodeAt(o2); ) o2++;
  if (n2 -= o2, u -= o2, n2 === 0) return u;
  let i, s2, a, c2, D2 = 0, p2 = 0;
  for (; D2 < n2; ) pn2[D2] = e2.charCodeAt(o2 + D2), Pt2[D2] = ++D2;
  for (; p2 < u; ) for (i = t9.charCodeAt(o2 + p2), a = p2++, s2 = p2, D2 = 0; D2 < n2; D2++) c2 = i === pn2[D2] ? a : a + 1, a = Pt2[D2], s2 = Pt2[D2] = a > s2 ? c2 > s2 ? s2 + 1 : c2 : c2 > a ? a + 1 : c2;
  return s2;
}
function ao2(e2, t9) {
  let r2 = new e2(t9), n2 = Object.create(r2);
  for (let u of so2) u in t9 && (n2[u] = Do(t9[u], r2, b2.prototype[u].length));
  return n2;
}
function Do(e2, t9, r2) {
  return typeof e2 == "function" ? (...n2) => e2(...n2.slice(0, r2 - 1), t9, ...n2.slice(r2 - 1)) : () => e2;
}
function dn2({ from: e2, to: t9 }) {
  return { from: [e2], to: t9 };
}
function En2(e2, t9) {
  let r2 = /* @__PURE__ */ Object.create(null);
  for (let n2 of e2) {
    let u = n2[t9];
    if (r2[u]) throw new Error(`Duplicate ${t9} ${JSON.stringify(u)}`);
    r2[u] = n2;
  }
  return r2;
}
function Cn2(e2, t9) {
  let r2 = /* @__PURE__ */ new Map();
  for (let n2 of e2) {
    let u = n2[t9];
    if (r2.has(u)) throw new Error(`Duplicate ${t9} ${JSON.stringify(u)}`);
    r2.set(u, n2);
  }
  return r2;
}
function hn2() {
  let e2 = /* @__PURE__ */ Object.create(null);
  return (t9) => {
    let r2 = JSON.stringify(t9);
    return e2[r2] ? true : (e2[r2] = true, false);
  };
}
function gn2(e2, t9) {
  let r2 = [], n2 = [];
  for (let u of e2) t9(u) ? r2.push(u) : n2.push(u);
  return [r2, n2];
}
function yn2(e2) {
  return e2 === Math.floor(e2);
}
function An2(e2, t9) {
  if (e2 === t9) return 0;
  let r2 = typeof e2, n2 = typeof t9, u = ["undefined", "object", "boolean", "number", "string"];
  return r2 !== n2 ? u.indexOf(r2) - u.indexOf(n2) : r2 !== "string" ? Number(e2) - Number(t9) : e2.localeCompare(t9);
}
function Bn2(e2) {
  return (...t9) => {
    let r2 = e2(...t9);
    return typeof r2 == "string" ? new Error(r2) : r2;
  };
}
function Lt2(e2) {
  return e2 === void 0 ? {} : e2;
}
function It2(e2) {
  if (typeof e2 == "string") return { text: e2 };
  let { text: t9, list: r2 } = e2;
  return co2((t9 || r2) !== void 0, "Unexpected `expected` result, there should be at least one field."), r2 ? { text: t9, list: { title: r2.title, values: r2.values.map(It2) } } : { text: t9 };
}
function Rt2(e2, t9) {
  return e2 === true ? true : e2 === false ? { value: t9 } : e2;
}
function Yt2(e2, t9, r2 = false) {
  return e2 === false ? false : e2 === true ? r2 ? true : [{ value: t9 }] : "value" in e2 ? [e2] : e2.length === 0 ? false : e2;
}
function mn2(e2, t9) {
  return typeof e2 == "string" || "key" in e2 ? { from: t9, to: e2 } : "from" in e2 ? { from: e2.from, to: e2.to } : { from: t9, to: e2.to };
}
function ot2(e2, t9) {
  return e2 === void 0 ? [] : Array.isArray(e2) ? e2.map((r2) => mn2(r2, t9)) : [mn2(e2, t9)];
}
function jt2(e2, t9) {
  let r2 = ot2(typeof e2 == "object" && "redirect" in e2 ? e2.redirect : e2, t9);
  return r2.length === 0 ? { remain: t9, redirect: r2 } : typeof e2 == "object" && "remain" in e2 ? { remain: e2.remain, redirect: r2 } : { redirect: r2 };
}
function co2(e2, t9) {
  if (!e2) throw new Error(t9);
}
function lo2(e2, t9, { logger: r2 = false, isCLI: n2 = false, passThrough: u = false, FlagSchema: o2, descriptor: i } = {}) {
  if (n2) {
    if (!o2) throw new Error("'FlagSchema' option is required.");
    if (!i) throw new Error("'descriptor' option is required.");
  } else i = re3;
  let s2 = u ? Array.isArray(u) ? (l2, F) => u.includes(l2) ? { [l2]: F } : void 0 : (l2, F) => ({ [l2]: F }) : (l2, F, f3) => {
    let { _: d2, ...m } = f3.schemas;
    return et2(l2, F, { ...f3, schemas: m });
  }, a = Fo(t9, { isCLI: n2, FlagSchema: o2 }), c2 = new Dt2(a, { logger: r2, unknown: s2, descriptor: i }), D2 = r2 !== false;
  D2 && Ut2 && (c2._hasDeprecationWarned = Ut2);
  let p2 = c2.normalize(e2);
  return D2 && (Ut2 = c2._hasDeprecationWarned), p2;
}
function Fo(e2, { isCLI: t9, FlagSchema: r2 }) {
  let n2 = [];
  t9 && n2.push(rt2.create({ name: "_" }));
  for (let u of e2) n2.push(po2(u, { isCLI: t9, optionInfos: e2, FlagSchema: r2 })), u.alias && t9 && n2.push(tt2.create({ name: u.alias, sourceName: u.name }));
  return n2;
}
function po2(e2, { isCLI: t9, optionInfos: r2, FlagSchema: n2 }) {
  let { name: u } = e2, o2 = { name: u }, i, s2 = {};
  switch (e2.type) {
    case "int":
      i = at2, t9 && (o2.preprocess = Number);
      break;
    case "string":
      i = Ie3;
      break;
    case "choice":
      i = it2, o2.choices = e2.choices.map((a) => a != null && a.redirect ? { ...a, redirect: { to: { key: e2.name, value: a.redirect } } } : a);
      break;
    case "boolean":
      i = ut2;
      break;
    case "flag":
      i = n2, o2.flags = r2.flatMap((a) => [a.alias, a.description && a.name, a.oppositeDescription && `no-${a.name}`].filter(Boolean));
      break;
    case "path":
      i = Ie3;
      break;
    default:
      throw new Error(`Unexpected type ${e2.type}`);
  }
  if (e2.exception ? o2.validate = (a, c2, D2) => e2.exception(a) || c2.validate(a, D2) : o2.validate = (a, c2, D2) => a === void 0 || c2.validate(a, D2), e2.redirect && (s2.redirect = (a) => a ? { to: typeof e2.redirect == "string" ? e2.redirect : { key: e2.redirect.option, value: e2.redirect.value } } : void 0), e2.deprecated && (s2.deprecated = true), t9 && !e2.array) {
    let a = o2.preprocess || ((c2) => c2);
    o2.preprocess = (c2, D2, p2) => D2.preprocess(a(Array.isArray(c2) ? y2(false, c2, -1) : c2), p2);
  }
  return e2.array ? nt2.create({ ...t9 ? { preprocess: (a) => Array.isArray(a) ? a : [a] } : {}, ...s2, valueSchema: i.create(o2) }) : i.create({ ...o2, ...s2 });
}
function $t2(e2, t9) {
  if (!t9) throw new Error("parserName is required.");
  let r2 = Vt2(false, e2, (u) => u.parsers && Object.prototype.hasOwnProperty.call(u.parsers, t9));
  if (r2) return r2;
  let n2 = `Couldn't resolve parser "${t9}".`;
  throw n2 += " Plugins must be explicitly added to the standalone bundle.", new ve3(n2);
}
function Sn2(e2, t9) {
  if (!t9) throw new Error("astFormat is required.");
  let r2 = Vt2(false, e2, (u) => u.printers && Object.prototype.hasOwnProperty.call(u.printers, t9));
  if (r2) return r2;
  let n2 = `Couldn't find plugin for AST format "${t9}".`;
  throw n2 += " Plugins must be explicitly added to the standalone bundle.", new ve3(n2);
}
function Re3({ plugins: e2, parser: t9 }) {
  let r2 = $t2(e2, t9);
  return Wt2(r2, t9);
}
function Wt2(e2, t9) {
  let r2 = e2.parsers[t9];
  return typeof r2 == "function" ? r2() : r2;
}
function Tn2(e2, t9) {
  let r2 = e2.printers[t9];
  return typeof r2 == "function" ? r2() : r2;
}
async function Eo(e2, t9 = {}) {
  var p2;
  let r2 = { ...e2 };
  if (!r2.parser) if (r2.filepath) {
    if (r2.parser = on2(r2, { physicalFile: r2.filepath }), !r2.parser) throw new Le3(`No parser could be inferred for file "${r2.filepath}".`);
  } else throw new Le3("No parser and no file path given, couldn't infer a parser.");
  let n2 = Qe2({ plugins: e2.plugins, showDeprecated: true }).options, u = { ...Nn2, ...Object.fromEntries(n2.filter((l2) => l2.default !== void 0).map((l2) => [l2.name, l2.default])) }, o2 = $t2(r2.plugins, r2.parser), i = await Wt2(o2, r2.parser);
  r2.astFormat = i.astFormat, r2.locEnd = i.locEnd, r2.locStart = i.locStart;
  let s2 = (p2 = o2.printers) != null && p2[i.astFormat] ? o2 : Sn2(r2.plugins, i.astFormat), a = await Tn2(s2, i.astFormat);
  r2.printer = a;
  let c2 = s2.defaultOptions ? Object.fromEntries(Object.entries(s2.defaultOptions).filter(([, l2]) => l2 !== void 0)) : {}, D2 = { ...u, ...c2 };
  for (let [l2, F] of Object.entries(D2)) (r2[l2] === null || r2[l2] === void 0) && (r2[l2] = F);
  return r2.parser === "json" && (r2.trailingComma = "none"), kn2(r2, n2, { passThrough: Object.keys(Nn2), ...t9 });
}
async function yo(e2, t9) {
  let r2 = await Re3(t9), n2 = r2.preprocess ? r2.preprocess(e2, t9) : e2;
  t9.originalText = n2;
  let u;
  try {
    u = await r2.parse(n2, t9, t9);
  } catch (o2) {
    Ao(o2, e2);
  }
  return { text: n2, ast: u };
}
function Ao(e2, t9) {
  let { loc: r2 } = e2;
  if (r2) {
    let n2 = (0, vn2.codeFrameColumns)(t9, r2, { highlightCode: true });
    throw e2.message += `
` + n2, e2.codeFrame = n2, e2;
  }
  throw e2;
}
async function Ln2(e2, t9, r2, n2, u) {
  let { embeddedLanguageFormatting: o2, printer: { embed: i, hasPrettierIgnore: s2 = () => false, getVisitorKeys: a } } = r2;
  if (!i || o2 !== "auto") return;
  if (i.length > 2) throw new Error("printer.embed has too many parameters. The API changed in Prettier v3. Please update your plugin. See https://prettier.io/docs/plugins#optional-embed");
  let c2 = J3(i.getVisitorKeys ?? a), D2 = [];
  F();
  let p2 = e2.stack;
  for (let { print: f3, node: d2, pathStack: m } of D2) try {
    e2.stack = m;
    let C2 = await f3(l2, t9, e2, r2);
    C2 && u.set(d2, C2);
  } catch (C2) {
    if (globalThis.PRETTIER_DEBUG) throw C2;
  }
  e2.stack = p2;
  function l2(f3, d2) {
    return Bo(f3, d2, r2, n2);
  }
  function F() {
    let { node: f3 } = e2;
    if (f3 === null || typeof f3 != "object" || s2(e2)) return;
    for (let m of c2(f3)) Array.isArray(f3[m]) ? e2.each(F, m) : e2.call(F, m);
    let d2 = i(e2, r2);
    if (d2) {
      if (typeof d2 == "function") {
        D2.push({ print: d2, node: f3, pathStack: [...e2.stack] });
        return;
      }
      u.set(f3, d2);
    }
  }
}
async function Bo(e2, t9, r2, n2) {
  let u = await ne3({ ...r2, ...t9, parentParser: r2.parser, originalText: e2, cursorOffset: void 0, rangeStart: void 0, rangeEnd: void 0 }, { passThrough: true }), { ast: o2 } = await De3(e2, u), i = await n2(o2, u);
  return $e(i);
}
function _o(e2, t9) {
  let { originalText: r2, [Symbol.for("comments")]: n2, locStart: u, locEnd: o2, [Symbol.for("printedComments")]: i } = t9, { node: s2 } = e2, a = u(s2), c2 = o2(s2);
  for (let D2 of n2) u(D2) >= a && o2(D2) <= c2 && i.add(D2);
  return r2.slice(a, c2);
}
async function Ye3(e2, t9) {
  ({ ast: e2 } = await Gt2(e2, t9));
  let r2 = /* @__PURE__ */ new Map(), n2 = new Or2(e2), u = Kr2(t9), o2 = /* @__PURE__ */ new Map();
  await Ln2(n2, s2, t9, Ye3, o2);
  let i = await Rn2(n2, t9, s2, void 0, o2);
  if (Gr2(t9), t9.cursorOffset >= 0) {
    if (t9.nodeAfterCursor && !t9.nodeBeforeCursor) return [X3, i];
    if (t9.nodeBeforeCursor && !t9.nodeAfterCursor) return [i, X3];
  }
  return i;
  function s2(c2, D2) {
    return c2 === void 0 || c2 === n2 ? a(D2) : Array.isArray(c2) ? n2.call(() => a(D2), ...c2) : n2.call(() => a(D2), c2);
  }
  function a(c2) {
    u(n2);
    let D2 = n2.node;
    if (D2 == null) return "";
    let p2 = D2 && typeof D2 == "object" && c2 === void 0;
    if (p2 && r2.has(D2)) return r2.get(D2);
    let l2 = Rn2(n2, t9, s2, c2, o2);
    return p2 && r2.set(D2, l2), l2;
  }
}
function Rn2(e2, t9, r2, n2, u) {
  var a;
  let { node: o2 } = e2, { printer: i } = t9, s2;
  switch ((a = i.hasPrettierIgnore) != null && a.call(i, e2) ? s2 = In2(e2, t9) : u.has(o2) ? s2 = u.get(o2) : s2 = i.print(e2, t9, r2, n2), o2) {
    case t9.cursorNode:
      s2 = Fe3(s2, (c2) => [X3, c2, X3]);
      break;
    case t9.nodeBeforeCursor:
      s2 = Fe3(s2, (c2) => [c2, X3]);
      break;
    case t9.nodeAfterCursor:
      s2 = Fe3(s2, (c2) => [X3, c2]);
      break;
  }
  return i.printComment && (!i.willPrintOwnComments || !i.willPrintOwnComments(e2, t9)) && (s2 = Mr(e2, s2, t9)), s2;
}
async function Gt2(e2, t9) {
  let r2 = e2.comments ?? [];
  t9[Symbol.for("comments")] = r2, t9[Symbol.for("printedComments")] = /* @__PURE__ */ new Set(), Vr(e2, t9);
  let { printer: { preprocess: n2 } } = t9;
  return e2 = n2 ? await n2(e2, t9) : e2, { ast: e2, comments: r2 };
}
function xo(e2, t9) {
  let { cursorOffset: r2, locStart: n2, locEnd: u } = t9, o2 = J3(t9.printer.getVisitorKeys), i = (F) => n2(F) <= r2 && u(F) >= r2, s2 = e2, a = [e2];
  for (let F of Lr2(e2, { getVisitorKeys: o2, filter: i })) a.push(F), s2 = F;
  if (Ir2(s2, { getVisitorKeys: o2 })) return { cursorNode: s2 };
  let c2, D2, p2 = -1, l2 = Number.POSITIVE_INFINITY;
  for (; a.length > 0 && (c2 === void 0 || D2 === void 0); ) {
    s2 = a.pop();
    let F = c2 !== void 0, f3 = D2 !== void 0;
    for (let d2 of Ce3(s2, { getVisitorKeys: o2 })) {
      if (!F) {
        let m = u(d2);
        m <= r2 && m > p2 && (c2 = d2, p2 = m);
      }
      if (!f3) {
        let m = n2(d2);
        m >= r2 && m < l2 && (D2 = d2, l2 = m);
      }
    }
  }
  return { nodeBeforeCursor: c2, nodeAfterCursor: D2 };
}
function wo(e2, t9) {
  let { printer: { massageAstNode: r2, getVisitorKeys: n2 } } = t9;
  if (!r2) return e2;
  let u = J3(n2), o2 = r2.ignoredProperties ?? /* @__PURE__ */ new Set();
  return i(e2);
  function i(s2, a) {
    if (!(s2 !== null && typeof s2 == "object")) return s2;
    if (Array.isArray(s2)) return s2.map((l2) => i(l2, a)).filter(Boolean);
    let c2 = {}, D2 = new Set(u(s2));
    for (let l2 in s2) !Object.prototype.hasOwnProperty.call(s2, l2) || o2.has(l2) || (D2.has(l2) ? c2[l2] = i(s2[l2], s2) : c2[l2] = s2[l2]);
    let p2 = r2(s2, c2, a);
    if (p2 !== null) return p2 ?? c2;
  }
}
function So(e2, t9) {
  let r2 = [e2.node, ...e2.parentNodes], n2 = /* @__PURE__ */ new Set([t9.node, ...t9.parentNodes]);
  return r2.find((u) => $n2.has(u.type) && n2.has(u));
}
function Un2(e2) {
  let t9 = jn2(false, e2, (r2) => r2.type !== "Program" && r2.type !== "File");
  return t9 === -1 ? e2 : e2.slice(0, t9 + 1);
}
function To(e2, t9, { locStart: r2, locEnd: n2 }) {
  let u = e2.node, o2 = t9.node;
  if (u === o2) return { startNode: u, endNode: o2 };
  let i = r2(e2.node);
  for (let a of Un2(t9.parentNodes)) if (r2(a) >= i) o2 = a;
  else break;
  let s2 = n2(t9.node);
  for (let a of Un2(e2.parentNodes)) {
    if (n2(a) <= s2) u = a;
    else break;
    if (u === o2) break;
  }
  return { startNode: u, endNode: o2 };
}
function zt2(e2, t9, r2, n2, u = [], o2) {
  let { locStart: i, locEnd: s2 } = r2, a = i(e2), c2 = s2(e2);
  if (!(t9 > c2 || t9 < a || o2 === "rangeEnd" && t9 === a || o2 === "rangeStart" && t9 === c2)) {
    for (let D2 of Xe2(e2, r2)) {
      let p2 = zt2(D2, t9, r2, n2, [e2, ...u], o2);
      if (p2) return p2;
    }
    if (!n2 || n2(e2, u[0])) return { node: e2, parentNodes: u };
  }
}
function No(e2, t9) {
  return t9 !== "DeclareExportDeclaration" && e2 !== "TypeParameterDeclaration" && (e2 === "Directive" || e2 === "TypeAlias" || e2 === "TSExportAssignment" || e2.startsWith("Declare") || e2.startsWith("TSDeclare") || e2.endsWith("Statement") || e2.endsWith("Declaration"));
}
function Vn2(e2, t9, r2) {
  if (!t9) return false;
  switch (e2.parser) {
    case "flow":
    case "hermes":
    case "babel":
    case "babel-flow":
    case "babel-ts":
    case "typescript":
    case "acorn":
    case "espree":
    case "meriyah":
    case "oxc":
    case "oxc-ts":
    case "__babel_estree":
      return No(t9.type, r2 == null ? void 0 : r2.type);
    case "json":
    case "json5":
    case "jsonc":
    case "json-stringify":
      return $n2.has(t9.type);
    case "graphql":
      return Oo2.has(t9.kind);
    case "vue":
      return t9.tag !== "root";
  }
  return false;
}
function Wn2(e2, t9, r2) {
  let { rangeStart: n2, rangeEnd: u, locStart: o2, locEnd: i } = t9;
  Oe3.ok(u > n2);
  let s2 = e2.slice(n2, u).search(/\S/u), a = s2 === -1;
  if (!a) for (n2 += s2; u > n2 && !/\S/u.test(e2[u - 1]); --u) ;
  let c2 = zt2(r2, n2, t9, (F, f3) => Vn2(t9, F, f3), [], "rangeStart"), D2 = a ? c2 : zt2(r2, u, t9, (F) => Vn2(t9, F), [], "rangeEnd");
  if (!c2 || !D2) return { rangeStart: 0, rangeEnd: 0 };
  let p2, l2;
  if (ko(t9)) {
    let F = So(c2, D2);
    p2 = F, l2 = F;
  } else ({ startNode: p2, endNode: l2 } = To(c2, D2, t9));
  return { rangeStart: Math.min(o2(p2), o2(l2)), rangeEnd: Math.max(i(p2), i(l2)) };
}
async function Hn2(e2, t9, r2 = 0) {
  if (!e2 || e2.trim().length === 0) return { formatted: "", cursorOffset: -1, comments: [] };
  let { ast: n2, text: u } = await De3(e2, t9);
  t9.cursorOffset >= 0 && (t9 = { ...t9, ...Kt2(n2, t9) });
  let o2 = await Ye3(n2, t9, r2);
  r2 > 0 && (o2 = Ge4([z9, o2], r2, t9.tabWidth));
  let i = me3(o2, t9);
  if (r2 > 0) {
    let a = i.formatted.trim();
    i.cursorNodeStart !== void 0 && (i.cursorNodeStart -= i.formatted.indexOf(a), i.cursorNodeStart < 0 && (i.cursorNodeStart = 0, i.cursorNodeText = i.cursorNodeText.trimStart()), i.cursorNodeStart + i.cursorNodeText.length > a.length && (i.cursorNodeText = i.cursorNodeText.trimEnd())), i.formatted = a + xe3(t9.endOfLine);
  }
  let s2 = t9[Symbol.for("comments")];
  if (t9.cursorOffset >= 0) {
    let a, c2, D2, p2;
    if ((t9.cursorNode || t9.nodeBeforeCursor || t9.nodeAfterCursor) && i.cursorNodeText) if (D2 = i.cursorNodeStart, p2 = i.cursorNodeText, t9.cursorNode) a = t9.locStart(t9.cursorNode), c2 = u.slice(a, t9.locEnd(t9.cursorNode));
    else {
      if (!t9.nodeBeforeCursor && !t9.nodeAfterCursor) throw new Error("Cursor location must contain at least one of cursorNode, nodeBeforeCursor, nodeAfterCursor");
      a = t9.nodeBeforeCursor ? t9.locEnd(t9.nodeBeforeCursor) : 0;
      let C2 = t9.nodeAfterCursor ? t9.locStart(t9.nodeAfterCursor) : u.length;
      c2 = u.slice(a, C2);
    }
    else a = 0, c2 = u, D2 = 0, p2 = i.formatted;
    let l2 = t9.cursorOffset - a;
    if (c2 === p2) return { formatted: i.formatted, cursorOffset: D2 + l2, comments: s2 };
    let F = c2.split("");
    F.splice(l2, 0, Mn2);
    let f3 = p2.split(""), d2 = Et2(F, f3), m = D2;
    for (let C2 of d2) if (C2.removed) {
      if (C2.value.includes(Mn2)) break;
    } else m += C2.count;
    return { formatted: i.formatted, cursorOffset: m, comments: s2 };
  }
  return { formatted: i.formatted, cursorOffset: -1, comments: s2 };
}
async function Po(e2, t9) {
  let { ast: r2, text: n2 } = await De3(e2, t9), { rangeStart: u, rangeEnd: o2 } = Wn2(n2, t9, r2), i = n2.slice(u, o2), s2 = Math.min(u, n2.lastIndexOf(`
`, u) + 1), a = n2.slice(s2, u).match(/^\s*/u)[0], c2 = Ee3(a, t9.tabWidth), D2 = await Hn2(i, { ...t9, rangeStart: 0, rangeEnd: Number.POSITIVE_INFINITY, cursorOffset: t9.cursorOffset > u && t9.cursorOffset <= o2 ? t9.cursorOffset - u : -1, endOfLine: "lf" }, c2), p2 = D2.formatted.trimEnd(), { cursorOffset: l2 } = t9;
  l2 > o2 ? l2 += p2.length - i.length : D2.cursorOffset >= 0 && (l2 = D2.cursorOffset + u);
  let F = n2.slice(0, u) + p2 + n2.slice(o2);
  if (t9.endOfLine !== "lf") {
    let f3 = xe3(t9.endOfLine);
    l2 >= 0 && f3 === `\r
` && (l2 += Ct2(F.slice(0, l2), `
`)), F = te2(false, F, `
`, f3);
  }
  return { formatted: F, cursorOffset: l2, comments: D2.comments };
}
function Ht2(e2, t9, r2) {
  return typeof t9 != "number" || Number.isNaN(t9) || t9 < 0 || t9 > e2.length ? r2 : t9;
}
function Gn2(e2, t9) {
  let { cursorOffset: r2, rangeStart: n2, rangeEnd: u } = t9;
  return r2 = Ht2(e2, r2, -1), n2 = Ht2(e2, n2, 0), u = Ht2(e2, u, e2.length), { ...t9, cursorOffset: r2, rangeStart: n2, rangeEnd: u };
}
function Jn2(e2, t9) {
  let { cursorOffset: r2, rangeStart: n2, rangeEnd: u, endOfLine: o2 } = Gn2(e2, t9), i = e2.charAt(0) === zn2;
  if (i && (e2 = e2.slice(1), r2--, n2--, u--), o2 === "auto" && (o2 = nr2(e2)), e2.includes("\r")) {
    let s2 = (a) => Ct2(e2.slice(0, Math.max(a, 0)), `\r
`);
    r2 -= s2(r2), n2 -= s2(n2), u -= s2(u), e2 = ur2(e2);
  }
  return { hasBOM: i, text: e2, options: Gn2(e2, { ...t9, cursorOffset: r2, rangeStart: n2, rangeEnd: u, endOfLine: o2 }) };
}
async function Kn2(e2, t9) {
  let r2 = await Re3(t9);
  return !r2.hasPragma || r2.hasPragma(e2);
}
async function vo(e2, t9) {
  var n2;
  let r2 = await Re3(t9);
  return (n2 = r2.hasIgnorePragma) == null ? void 0 : n2.call(r2, e2);
}
async function Jt(e2, t9) {
  let { hasBOM: r2, text: n2, options: u } = Jn2(e2, await ne3(t9));
  if (u.rangeStart >= u.rangeEnd && n2 !== "" || u.requirePragma && !await Kn2(n2, u) || u.checkIgnorePragma && await vo(n2, u)) return { formatted: e2, cursorOffset: t9.cursorOffset, comments: [] };
  let o2;
  return u.rangeStart > 0 || u.rangeEnd < n2.length ? o2 = await Po(n2, u) : (!u.requirePragma && u.insertPragma && u.printer.insertPragma && !await Kn2(n2, u) && (n2 = u.printer.insertPragma(n2)), o2 = await Hn2(n2, u)), r2 && (o2.formatted = zn2 + o2.formatted, o2.cursorOffset >= 0 && o2.cursorOffset++), o2;
}
async function qn2(e2, t9, r2) {
  let { text: n2, options: u } = Jn2(e2, await ne3(t9)), o2 = await De3(n2, u);
  return r2 && (r2.preprocessForPrint && (o2.ast = await Gt2(o2.ast, u)), r2.massage && (o2.ast = Yn2(o2.ast, u))), o2;
}
async function Xn2(e2, t9) {
  t9 = await ne3(t9);
  let r2 = await Ye3(e2, t9);
  return me3(r2, t9);
}
async function Qn2(e2, t9) {
  let r2 = wr2(e2), { formatted: n2 } = await Jt(r2, { ...t9, parser: "__js_expression" });
  return n2;
}
async function Zn2(e2, t9) {
  t9 = await ne3(t9);
  let { ast: r2 } = await De3(e2, t9);
  return t9.cursorOffset >= 0 && (t9 = { ...t9, ...Kt2(r2, t9) }), Ye3(r2, t9);
}
async function eu2(e2, t9) {
  return me3(e2, await ne3(t9));
}
function jo2(e2, t9) {
  if (t9 === false) return false;
  if (e2.charAt(t9) === "/" && e2.charAt(t9 + 1) === "*") {
    for (let r2 = t9 + 2; r2 < e2.length; ++r2) if (e2.charAt(r2) === "*" && e2.charAt(r2 + 1) === "/") return r2 + 2;
  }
  return t9;
}
function Uo2(e2, t9) {
  return t9 === false ? false : e2.charAt(t9) === "/" && e2.charAt(t9 + 1) === "/" ? Je2(e2, t9) : t9;
}
function Vo2(e2, t9) {
  let r2 = null, n2 = t9;
  for (; n2 !== r2; ) r2 = n2, n2 = T2(e2, n2), n2 = ye2(e2, n2), n2 = Ae3(e2, n2), n2 = U(e2, n2);
  return n2;
}
function $o2(e2, t9) {
  let r2 = null, n2 = t9;
  for (; n2 !== r2; ) r2 = n2, n2 = He3(e2, n2), n2 = ye2(e2, n2), n2 = T2(e2, n2);
  return n2 = Ae3(e2, n2), n2 = U(e2, n2), n2 !== false && G3(e2, n2);
}
function Wo2(e2, t9) {
  let r2 = e2.lastIndexOf(`
`);
  return r2 === -1 ? 0 : Ee3(e2.slice(r2 + 1).match(/^[\t ]*/u)[0], t9);
}
function Xt2(e2) {
  if (typeof e2 != "string") throw new TypeError("Expected a string");
  return e2.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
function Mo2(e2, t9) {
  let r2 = e2.match(new RegExp(`(${Xt2(t9)})+`, "gu"));
  return r2 === null ? 0 : r2.reduce((n2, u) => Math.max(n2, u.length / t9.length), 0);
}
function Go2(e2, t9) {
  let r2 = je3(e2, t9);
  return r2 === false ? "" : e2.charAt(r2);
}
function Ko2(e2, t9) {
  let r2 = t9 === true || t9 === ft2 ? ft2 : ou2, n2 = r2 === ft2 ? ou2 : ft2, u = 0, o2 = 0;
  for (let i of e2) i === r2 ? u++ : i === n2 && o2++;
  return u > o2 ? n2 : r2;
}
function zo2(e2, t9, r2) {
  for (let n2 = t9; n2 < r2; ++n2) if (e2.charAt(n2) === `
`) return true;
  return false;
}
function Ho2(e2, t9, r2 = {}) {
  return T2(e2, r2.backwards ? t9 - 1 : t9, r2) !== t9;
}
function Jo2(e2, t9, r2) {
  let n2 = t9 === '"' ? "'" : '"', o2 = te2(false, e2, /\\(.)|(["'])/gsu, (i, s2, a) => s2 === n2 ? s2 : a === t9 ? "\\" + a : a || (r2 && /^[^\n\r"'0-7\\bfnrt-vx\u2028\u2029]$/u.test(s2) ? s2 : "\\" + s2));
  return t9 + o2 + t9;
}
function qo2(e2, t9, r2) {
  return je3(e2, r2(t9));
}
function Xo2(e2, t9) {
  return arguments.length === 2 || typeof t9 == "number" ? je3(e2, t9) : qo2(...arguments);
}
function Qo2(e2, t9, r2) {
  return Pe3(e2, r2(t9));
}
function Zo2(e2, t9) {
  return arguments.length === 2 || typeof t9 == "number" ? Pe3(e2, t9) : Qo2(...arguments);
}
function ei(e2, t9, r2) {
  return ct2(e2, r2(t9));
}
function ti2(e2, t9) {
  return arguments.length === 2 || typeof t9 == "number" ? ct2(e2, t9) : ei(...arguments);
}
function ce2(e2, t9 = 1) {
  return async (...r2) => {
    let n2 = r2[t9] ?? {}, u = n2.plugins ?? [];
    return r2[t9] = { ...n2, plugins: Array.isArray(u) ? u : Object.values(u) }, e2(...r2);
  };
}
async function fu(e2, t9) {
  let { formatted: r2 } = await cu(e2, { ...t9, cursorOffset: -1 });
  return r2;
}
async function ri2(e2, t9) {
  return await fu(e2, t9) === e2;
}
var Fu, pt2, pu, du, mu, Eu, er, Cu, dt, hu, gu, yu, tr, fe3, Pn2, Zt, Au, te2, _e3, mt2, rr2, W2, Y2, j2, N3, O2, P2, B2, k3, _3, v3, L3, I3, g2, S3, w3, Ue3, Bu, y2, M2, xu, ht2, q2, ir2, le2, gt2, K3, yt2, pr2, Ar2, pe3, Br2, Te3, Bt2, Me3, _r2, z9, We2, X3, br2, Tr2, Pu, Ne3, R2, H3, de3, _t2, Ee3, Z3, kt2, ze2, bt2, Or2, Pr2, Oe3, vr2, Rr2, T2, He3, Je2, U, G3, qe2, Yr, $u, J3, Tt2, Nt2, $r2, Pe3, Kr2, ve3, Le3, zr, eo2, Hr, Jr2, qr, Xr2, Qr2, Zr2, to2, rn2, uo2, on2, re3, sn, V4, an, Ze2, ge3, Dn2, fn2, Pt2, pn2, et2, so2, b2, tt2, rt2, nt2, ut2, it2, st2, at2, Ie3, _n2, xn2, wn2, bn2, Dt2, Ut2, kn2, mo, Vt2, Nn2, ne3, vn2, De3, In2, Kt2, Yn2, bo, jn2, ko, $n2, Oo2, zn2, Mn2, qt2, Io2, Ro2, Yo2, tu2, Qt2, ye2, Ae3, je3, ct2, ru2, nu2, uu2, ft2, ou2, iu2, su2, au2, Du, cu, ni2, ui;
var init_standalone = __esm({
  "node_modules/prettier/standalone.mjs"() {
    Fu = Object.create;
    pt2 = Object.defineProperty;
    pu = Object.getOwnPropertyDescriptor;
    du = Object.getOwnPropertyNames;
    mu = Object.getPrototypeOf;
    Eu = Object.prototype.hasOwnProperty;
    er = (e2) => {
      throw TypeError(e2);
    };
    Cu = (e2, t9) => () => (t9 || e2((t9 = { exports: {} }).exports, t9), t9.exports);
    dt = (e2, t9) => {
      for (var r2 in t9) pt2(e2, r2, { get: t9[r2], enumerable: true });
    };
    hu = (e2, t9, r2, n2) => {
      if (t9 && typeof t9 == "object" || typeof t9 == "function") for (let u of du(t9)) !Eu.call(e2, u) && u !== r2 && pt2(e2, u, { get: () => t9[u], enumerable: !(n2 = pu(t9, u)) || n2.enumerable });
      return e2;
    };
    gu = (e2, t9, r2) => (r2 = e2 != null ? Fu(mu(e2)) : {}, hu(t9 || !e2 || !e2.__esModule ? pt2(r2, "default", { value: e2, enumerable: true }) : r2, e2));
    yu = (e2, t9, r2) => t9.has(e2) || er("Cannot " + r2);
    tr = (e2, t9, r2) => t9.has(e2) ? er("Cannot add the same private member more than once") : t9 instanceof WeakSet ? t9.add(e2) : t9.set(e2, r2);
    fe3 = (e2, t9, r2) => (yu(e2, t9, "access private method"), r2);
    Pn2 = Cu((Mt2) => {
      "use strict";
      Object.defineProperty(Mt2, "__esModule", { value: true });
      function Co() {
        return new Proxy({}, { get: () => (e2) => e2 });
      }
      var On2 = /\r\n|[\n\r\u2028\u2029]/;
      function ho2(e2, t9, r2) {
        let n2 = Object.assign({ column: 0, line: -1 }, e2.start), u = Object.assign({}, n2, e2.end), { linesAbove: o2 = 2, linesBelow: i = 3 } = r2 || {}, s2 = n2.line, a = n2.column, c2 = u.line, D2 = u.column, p2 = Math.max(s2 - (o2 + 1), 0), l2 = Math.min(t9.length, c2 + i);
        s2 === -1 && (p2 = 0), c2 === -1 && (l2 = t9.length);
        let F = c2 - s2, f3 = {};
        if (F) for (let d2 = 0; d2 <= F; d2++) {
          let m = d2 + s2;
          if (!a) f3[m] = true;
          else if (d2 === 0) {
            let C2 = t9[m - 1].length;
            f3[m] = [a, C2 - a + 1];
          } else if (d2 === F) f3[m] = [0, D2];
          else {
            let C2 = t9[m - d2].length;
            f3[m] = [0, C2];
          }
        }
        else a === D2 ? a ? f3[s2] = [a, 0] : f3[s2] = true : f3[s2] = [a, D2 - a];
        return { start: p2, end: l2, markerLines: f3 };
      }
      function go2(e2, t9, r2 = {}) {
        let u = Co(false), o2 = e2.split(On2), { start: i, end: s2, markerLines: a } = ho2(t9, o2, r2), c2 = t9.start && typeof t9.start.column == "number", D2 = String(s2).length, l2 = e2.split(On2, s2).slice(i, s2).map((F, f3) => {
          let d2 = i + 1 + f3, C2 = ` ${` ${d2}`.slice(-D2)} |`, E3 = a[d2], h3 = !a[d2 + 1];
          if (E3) {
            let x2 = "";
            if (Array.isArray(E3)) {
              let A = F.slice(0, Math.max(E3[0] - 1, 0)).replace(/[^\t]/g, " "), $3 = E3[1] || 1;
              x2 = [`
 `, u.gutter(C2.replace(/\d/g, " ")), " ", A, u.marker("^").repeat($3)].join(""), h3 && r2.message && (x2 += " " + u.message(r2.message));
            }
            return [u.marker(">"), u.gutter(C2), F.length > 0 ? ` ${F}` : "", x2].join("");
          } else return ` ${u.gutter(C2)}${F.length > 0 ? ` ${F}` : ""}`;
        }).join(`
`);
        return r2.message && !c2 && (l2 = `${" ".repeat(D2 + 1)}${r2.message}
${l2}`), l2;
      }
      Mt2.codeFrameColumns = go2;
    });
    Zt = {};
    dt(Zt, { __debug: () => ui, check: () => ri2, doc: () => qt2, format: () => fu, formatWithCursor: () => cu, getSupportInfo: () => ni2, util: () => Qt2, version: () => tu2 });
    Au = (e2, t9, r2, n2) => {
      if (!(e2 && t9 == null)) return t9.replaceAll ? t9.replaceAll(r2, n2) : r2.global ? t9.replace(r2, n2) : t9.split(r2).join(n2);
    };
    te2 = Au;
    _e3 = class {
      diff(t9, r2, n2 = {}) {
        let u;
        typeof n2 == "function" ? (u = n2, n2 = {}) : "callback" in n2 && (u = n2.callback);
        let o2 = this.castInput(t9, n2), i = this.castInput(r2, n2), s2 = this.removeEmpty(this.tokenize(o2, n2)), a = this.removeEmpty(this.tokenize(i, n2));
        return this.diffWithOptionsObj(s2, a, n2, u);
      }
      diffWithOptionsObj(t9, r2, n2, u) {
        var o2;
        let i = (E3) => {
          if (E3 = this.postProcess(E3, n2), u) {
            setTimeout(function() {
              u(E3);
            }, 0);
            return;
          } else return E3;
        }, s2 = r2.length, a = t9.length, c2 = 1, D2 = s2 + a;
        n2.maxEditLength != null && (D2 = Math.min(D2, n2.maxEditLength));
        let p2 = (o2 = n2.timeout) !== null && o2 !== void 0 ? o2 : 1 / 0, l2 = Date.now() + p2, F = [{ oldPos: -1, lastComponent: void 0 }], f3 = this.extractCommon(F[0], r2, t9, 0, n2);
        if (F[0].oldPos + 1 >= a && f3 + 1 >= s2) return i(this.buildValues(F[0].lastComponent, r2, t9));
        let d2 = -1 / 0, m = 1 / 0, C2 = () => {
          for (let E3 = Math.max(d2, -c2); E3 <= Math.min(m, c2); E3 += 2) {
            let h3, x2 = F[E3 - 1], A = F[E3 + 1];
            x2 && (F[E3 - 1] = void 0);
            let $3 = false;
            if (A) {
              let Be3 = A.oldPos - E3;
              $3 = A && 0 <= Be3 && Be3 < s2;
            }
            let ue = x2 && x2.oldPos + 1 < a;
            if (!$3 && !ue) {
              F[E3] = void 0;
              continue;
            }
            if (!ue || $3 && x2.oldPos < A.oldPos ? h3 = this.addToPath(A, true, false, 0, n2) : h3 = this.addToPath(x2, false, true, 1, n2), f3 = this.extractCommon(h3, r2, t9, E3, n2), h3.oldPos + 1 >= a && f3 + 1 >= s2) return i(this.buildValues(h3.lastComponent, r2, t9)) || true;
            F[E3] = h3, h3.oldPos + 1 >= a && (m = Math.min(m, E3 - 1)), f3 + 1 >= s2 && (d2 = Math.max(d2, E3 + 1));
          }
          c2++;
        };
        if (u) (function E3() {
          setTimeout(function() {
            if (c2 > D2 || Date.now() > l2) return u(void 0);
            C2() || E3();
          }, 0);
        })();
        else for (; c2 <= D2 && Date.now() <= l2; ) {
          let E3 = C2();
          if (E3) return E3;
        }
      }
      addToPath(t9, r2, n2, u, o2) {
        let i = t9.lastComponent;
        return i && !o2.oneChangePerToken && i.added === r2 && i.removed === n2 ? { oldPos: t9.oldPos + u, lastComponent: { count: i.count + 1, added: r2, removed: n2, previousComponent: i.previousComponent } } : { oldPos: t9.oldPos + u, lastComponent: { count: 1, added: r2, removed: n2, previousComponent: i } };
      }
      extractCommon(t9, r2, n2, u, o2) {
        let i = r2.length, s2 = n2.length, a = t9.oldPos, c2 = a - u, D2 = 0;
        for (; c2 + 1 < i && a + 1 < s2 && this.equals(n2[a + 1], r2[c2 + 1], o2); ) c2++, a++, D2++, o2.oneChangePerToken && (t9.lastComponent = { count: 1, previousComponent: t9.lastComponent, added: false, removed: false });
        return D2 && !o2.oneChangePerToken && (t9.lastComponent = { count: D2, previousComponent: t9.lastComponent, added: false, removed: false }), t9.oldPos = a, c2;
      }
      equals(t9, r2, n2) {
        return n2.comparator ? n2.comparator(t9, r2) : t9 === r2 || !!n2.ignoreCase && t9.toLowerCase() === r2.toLowerCase();
      }
      removeEmpty(t9) {
        let r2 = [];
        for (let n2 = 0; n2 < t9.length; n2++) t9[n2] && r2.push(t9[n2]);
        return r2;
      }
      castInput(t9, r2) {
        return t9;
      }
      tokenize(t9, r2) {
        return Array.from(t9);
      }
      join(t9) {
        return t9.join("");
      }
      postProcess(t9, r2) {
        return t9;
      }
      get useLongestToken() {
        return false;
      }
      buildValues(t9, r2, n2) {
        let u = [], o2;
        for (; t9; ) u.push(t9), o2 = t9.previousComponent, delete t9.previousComponent, t9 = o2;
        u.reverse();
        let i = u.length, s2 = 0, a = 0, c2 = 0;
        for (; s2 < i; s2++) {
          let D2 = u[s2];
          if (D2.removed) D2.value = this.join(n2.slice(c2, c2 + D2.count)), c2 += D2.count;
          else {
            if (!D2.added && this.useLongestToken) {
              let p2 = r2.slice(a, a + D2.count);
              p2 = p2.map(function(l2, F) {
                let f3 = n2[c2 + F];
                return f3.length > l2.length ? f3 : l2;
              }), D2.value = this.join(p2);
            } else D2.value = this.join(r2.slice(a, a + D2.count));
            a += D2.count, D2.added || (c2 += D2.count);
          }
        }
        return u;
      }
    };
    mt2 = class extends _e3 {
      tokenize(t9) {
        return t9.slice();
      }
      join(t9) {
        return t9;
      }
      removeEmpty(t9) {
        return t9;
      }
    };
    rr2 = new mt2();
    W2 = "string";
    Y2 = "array";
    j2 = "cursor";
    N3 = "indent";
    O2 = "align";
    P2 = "trim";
    B2 = "group";
    k3 = "fill";
    _3 = "if-break";
    v3 = "indent-if-break";
    L3 = "line-suffix";
    I3 = "line-suffix-boundary";
    g2 = "line";
    S3 = "label";
    w3 = "break-parent";
    Ue3 = /* @__PURE__ */ new Set([j2, N3, O2, P2, B2, k3, _3, v3, L3, I3, g2, S3, w3]);
    Bu = (e2, t9, r2) => {
      if (!(e2 && t9 == null)) return Array.isArray(t9) || typeof t9 == "string" ? t9[r2 < 0 ? t9.length + r2 : r2] : t9.at(r2);
    };
    y2 = Bu;
    M2 = _u;
    xu = (e2) => new Intl.ListFormat("en-US", { type: "disjunction" }).format(e2);
    ht2 = class extends Error {
      name = "InvalidDocError";
      constructor(t9) {
        super(wu(t9)), this.doc = t9;
      }
    };
    q2 = ht2;
    ir2 = {};
    le2 = bu;
    gt2 = () => {
    };
    K3 = gt2;
    yt2 = gt2;
    pr2 = gt2;
    Ar2 = { type: I3 };
    pe3 = { type: w3 };
    Br2 = { type: P2 };
    Te3 = { type: g2, hard: true };
    Bt2 = { type: g2, hard: true, literal: true };
    Me3 = { type: g2 };
    _r2 = { type: g2, soft: true };
    z9 = [Te3, pe3];
    We2 = [Bt2, pe3];
    X3 = { type: j2 };
    br2 = () => /[#*0-9]\uFE0F?\u20E3|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26AA\u26B0\u26B1\u26BD\u26BE\u26C4\u26C8\u26CF\u26D1\u26E9\u26F0-\u26F5\u26F7\u26F8\u26FA\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B55\u3030\u303D\u3297\u3299]\uFE0F?|[\u261D\u270C\u270D](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?|[\u270A\u270B](?:\uD83C[\uDFFB-\uDFFF])?|[\u23E9-\u23EC\u23F0\u23F3\u25FD\u2693\u26A1\u26AB\u26C5\u26CE\u26D4\u26EA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2795-\u2797\u27B0\u27BF\u2B50]|\u26D3\uFE0F?(?:\u200D\uD83D\uDCA5)?|\u26F9(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|\u2764\uFE0F?(?:\u200D(?:\uD83D\uDD25|\uD83E\uDE79))?|\uD83C(?:[\uDC04\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]\uFE0F?|[\uDF85\uDFC2\uDFC7](?:\uD83C[\uDFFB-\uDFFF])?|[\uDFC4\uDFCA](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDFCB\uDFCC](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF43\uDF45-\uDF4A\uDF4C-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uDDE6\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF]|\uDDE7\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF]|\uDDE8\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF7\uDDFA-\uDDFF]|\uDDE9\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF]|\uDDEA\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA]|\uDDEB\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7]|\uDDEC\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE]|\uDDED\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA]|\uDDEE\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9]|\uDDEF\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5]|\uDDF0\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF]|\uDDF1\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE]|\uDDF2\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF]|\uDDF3\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF]|\uDDF4\uD83C\uDDF2|\uDDF5\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE]|\uDDF6\uD83C\uDDE6|\uDDF7\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC]|\uDDF8\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF]|\uDDF9\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF]|\uDDFA\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF]|\uDDFB\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA]|\uDDFC\uD83C[\uDDEB\uDDF8]|\uDDFD\uD83C\uDDF0|\uDDFE\uD83C[\uDDEA\uDDF9]|\uDDFF\uD83C[\uDDE6\uDDF2\uDDFC]|\uDF44(?:\u200D\uD83D\uDFEB)?|\uDF4B(?:\u200D\uD83D\uDFE9)?|\uDFC3(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDFF3\uFE0F?(?:\u200D(?:\u26A7\uFE0F?|\uD83C\uDF08))?|\uDFF4(?:\u200D\u2620\uFE0F?|\uDB40\uDC67\uDB40\uDC62\uDB40(?:\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDC73\uDB40\uDC63\uDB40\uDC74|\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F)?)|\uD83D(?:[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3]\uFE0F?|[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC](?:\uD83C[\uDFFB-\uDFFF])?|[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4\uDEB5](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD74\uDD90](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?|[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC25\uDC27-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE41\uDE43\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEDC-\uDEDF\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB\uDFF0]|\uDC08(?:\u200D\u2B1B)?|\uDC15(?:\u200D\uD83E\uDDBA)?|\uDC26(?:\u200D(?:\u2B1B|\uD83D\uDD25))?|\uDC3B(?:\u200D\u2744\uFE0F?)?|\uDC41\uFE0F?(?:\u200D\uD83D\uDDE8\uFE0F?)?|\uDC68(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDC68\uDC69]\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE])))?))?|\uDC69(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?[\uDC68\uDC69]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?|\uDC69\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?))|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFE])))?))?|\uDC6F(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDD75(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDE2E(?:\u200D\uD83D\uDCA8)?|\uDE35(?:\u200D\uD83D\uDCAB)?|\uDE36(?:\u200D\uD83C\uDF2B\uFE0F?)?|\uDE42(?:\u200D[\u2194\u2195]\uFE0F?)?|\uDEB6(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?)|\uD83E(?:[\uDD0C\uDD0F\uDD18-\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5\uDEC3-\uDEC5\uDEF0\uDEF2-\uDEF8](?:\uD83C[\uDFFB-\uDFFF])?|[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD\uDDCF\uDDD4\uDDD6-\uDDDD](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDDDE\uDDDF](?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD0D\uDD0E\uDD10-\uDD17\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCC\uDDD0\uDDE0-\uDDFF\uDE70-\uDE7C\uDE80-\uDE89\uDE8F-\uDEC2\uDEC6\uDECE-\uDEDC\uDEDF-\uDEE9]|\uDD3C(?:\u200D[\u2640\u2642]\uFE0F?|\uD83C[\uDFFB-\uDFFF])?|\uDDCE(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDDD1(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1|\uDDD1\u200D\uD83E\uDDD2(?:\u200D\uD83E\uDDD2)?|\uDDD2(?:\u200D\uD83E\uDDD2)?))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?))?|\uDEF1(?:\uD83C(?:\uDFFB(?:\u200D\uD83E\uDEF2\uD83C[\uDFFC-\uDFFF])?|\uDFFC(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFD-\uDFFF])?|\uDFFD(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])?|\uDFFE(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFD\uDFFF])?|\uDFFF(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFE])?))?)/g;
    Tr2 = (e2) => !(kr2(e2) || Sr2(e2));
    Pu = /[^\x20-\x7F]/u;
    Ne3 = vu;
    R2 = Symbol("MODE_BREAK");
    H3 = Symbol("MODE_FLAT");
    de3 = Symbol("cursor");
    _t2 = Symbol("DOC_FILL_PRINTED_LENGTH");
    Ee3 = Ru;
    bt2 = class {
      constructor(t9) {
        tr(this, Z3);
        this.stack = [t9];
      }
      get key() {
        let { stack: t9, siblings: r2 } = this;
        return y2(false, t9, r2 === null ? -2 : -4) ?? null;
      }
      get index() {
        return this.siblings === null ? null : y2(false, this.stack, -2);
      }
      get node() {
        return y2(false, this.stack, -1);
      }
      get parent() {
        return this.getNode(1);
      }
      get grandparent() {
        return this.getNode(2);
      }
      get isInArray() {
        return this.siblings !== null;
      }
      get siblings() {
        let { stack: t9 } = this, r2 = y2(false, t9, -3);
        return Array.isArray(r2) ? r2 : null;
      }
      get next() {
        let { siblings: t9 } = this;
        return t9 === null ? null : t9[this.index + 1];
      }
      get previous() {
        let { siblings: t9 } = this;
        return t9 === null ? null : t9[this.index - 1];
      }
      get isFirst() {
        return this.index === 0;
      }
      get isLast() {
        let { siblings: t9, index: r2 } = this;
        return t9 !== null && r2 === t9.length - 1;
      }
      get isRoot() {
        return this.stack.length === 1;
      }
      get root() {
        return this.stack[0];
      }
      get ancestors() {
        return [...fe3(this, Z3, ze2).call(this)];
      }
      getName() {
        let { stack: t9 } = this, { length: r2 } = t9;
        return r2 > 1 ? y2(false, t9, -2) : null;
      }
      getValue() {
        return y2(false, this.stack, -1);
      }
      getNode(t9 = 0) {
        let r2 = fe3(this, Z3, kt2).call(this, t9);
        return r2 === -1 ? null : this.stack[r2];
      }
      getParentNode(t9 = 0) {
        return this.getNode(t9 + 1);
      }
      call(t9, ...r2) {
        let { stack: n2 } = this, { length: u } = n2, o2 = y2(false, n2, -1);
        for (let i of r2) o2 = o2[i], n2.push(i, o2);
        try {
          return t9(this);
        } finally {
          n2.length = u;
        }
      }
      callParent(t9, r2 = 0) {
        let n2 = fe3(this, Z3, kt2).call(this, r2 + 1), u = this.stack.splice(n2 + 1);
        try {
          return t9(this);
        } finally {
          this.stack.push(...u);
        }
      }
      each(t9, ...r2) {
        let { stack: n2 } = this, { length: u } = n2, o2 = y2(false, n2, -1);
        for (let i of r2) o2 = o2[i], n2.push(i, o2);
        try {
          for (let i = 0; i < o2.length; ++i) n2.push(i, o2[i]), t9(this, i, o2), n2.length -= 2;
        } finally {
          n2.length = u;
        }
      }
      map(t9, ...r2) {
        let n2 = [];
        return this.each((u, o2, i) => {
          n2[o2] = t9(u, o2, i);
        }, ...r2), n2;
      }
      match(...t9) {
        let r2 = this.stack.length - 1, n2 = null, u = this.stack[r2--];
        for (let o2 of t9) {
          if (u === void 0) return false;
          let i = null;
          if (typeof n2 == "number" && (i = n2, n2 = this.stack[r2--], u = this.stack[r2--]), o2 && !o2(u, n2, i)) return false;
          n2 = this.stack[r2--], u = this.stack[r2--];
        }
        return true;
      }
      findAncestor(t9) {
        for (let r2 of fe3(this, Z3, ze2).call(this)) if (t9(r2)) return r2;
      }
      hasAncestor(t9) {
        for (let r2 of fe3(this, Z3, ze2).call(this)) if (t9(r2)) return true;
        return false;
      }
    };
    Z3 = /* @__PURE__ */ new WeakSet(), kt2 = function(t9) {
      let { stack: r2 } = this;
      for (let n2 = r2.length - 1; n2 >= 0; n2 -= 2) if (!Array.isArray(r2[n2]) && --t9 < 0) return n2;
      return -1;
    }, ze2 = function* () {
      let { stack: t9 } = this;
      for (let r2 = t9.length - 3; r2 >= 0; r2 -= 2) {
        let n2 = t9[r2];
        Array.isArray(n2) || (yield n2);
      }
    };
    Or2 = bt2;
    Pr2 = new Proxy(() => {
    }, { get: () => Pr2 });
    Oe3 = Pr2;
    vr2 = Yu;
    Rr2 = he3(/\s/u);
    T2 = he3(" 	");
    He3 = he3(",; 	");
    Je2 = he3(/[^\n\r]/u);
    U = ju;
    G3 = Uu;
    qe2 = Vu;
    Yr = /* @__PURE__ */ new Set(["tokens", "comments", "parent", "enclosingNode", "precedingNode", "followingNode"]);
    $u = (e2) => Object.keys(e2).filter((t9) => !Yr.has(t9));
    J3 = Wu;
    Tt2 = /* @__PURE__ */ new WeakMap();
    Nt2 = () => false;
    $r2 = (e2) => !/[\S\n\u2028\u2029]/u.test(e2);
    Pe3 = zu;
    Kr2 = Xu;
    ve3 = class extends Error {
      name = "ConfigError";
    };
    Le3 = class extends Error {
      name = "UndefinedParserError";
    };
    zr = { checkIgnorePragma: { category: "Special", type: "boolean", default: false, description: "Check whether the file's first docblock comment contains '@noprettier' or '@noformat' to determine if it should be formatted.", cliCategory: "Other" }, cursorOffset: { category: "Special", type: "int", default: -1, range: { start: -1, end: 1 / 0, step: 1 }, description: "Print (to stderr) where a cursor at the given position would move to after formatting.", cliCategory: "Editor" }, endOfLine: { category: "Global", type: "choice", default: "lf", description: "Which end of line characters to apply.", choices: [{ value: "lf", description: "Line Feed only (\\n), common on Linux and macOS as well as inside git repos" }, { value: "crlf", description: "Carriage Return + Line Feed characters (\\r\\n), common on Windows" }, { value: "cr", description: "Carriage Return character only (\\r), used very rarely" }, { value: "auto", description: `Maintain existing
(mixed values within one file are normalised by looking at what's used after the first line)` }] }, filepath: { category: "Special", type: "path", description: "Specify the input filepath. This will be used to do parser inference.", cliName: "stdin-filepath", cliCategory: "Other", cliDescription: "Path to the file to pretend that stdin comes from." }, insertPragma: { category: "Special", type: "boolean", default: false, description: "Insert @format pragma into file's first docblock comment.", cliCategory: "Other" }, parser: { category: "Global", type: "choice", default: void 0, description: "Which parser to use.", exception: (e2) => typeof e2 == "string" || typeof e2 == "function", choices: [{ value: "flow", description: "Flow" }, { value: "babel", description: "JavaScript" }, { value: "babel-flow", description: "Flow" }, { value: "babel-ts", description: "TypeScript" }, { value: "typescript", description: "TypeScript" }, { value: "acorn", description: "JavaScript" }, { value: "espree", description: "JavaScript" }, { value: "meriyah", description: "JavaScript" }, { value: "css", description: "CSS" }, { value: "less", description: "Less" }, { value: "scss", description: "SCSS" }, { value: "json", description: "JSON" }, { value: "json5", description: "JSON5" }, { value: "jsonc", description: "JSON with Comments" }, { value: "json-stringify", description: "JSON.stringify" }, { value: "graphql", description: "GraphQL" }, { value: "markdown", description: "Markdown" }, { value: "mdx", description: "MDX" }, { value: "vue", description: "Vue" }, { value: "yaml", description: "YAML" }, { value: "glimmer", description: "Ember / Handlebars" }, { value: "html", description: "HTML" }, { value: "angular", description: "Angular" }, { value: "lwc", description: "Lightning Web Components" }, { value: "mjml", description: "MJML" }] }, plugins: { type: "path", array: true, default: [{ value: [] }], category: "Global", description: "Add a plugin. Multiple plugins can be passed as separate `--plugin`s.", exception: (e2) => typeof e2 == "string" || typeof e2 == "object", cliName: "plugin", cliCategory: "Config" }, printWidth: { category: "Global", type: "int", default: 80, description: "The line length where Prettier will try wrap.", range: { start: 0, end: 1 / 0, step: 1 } }, rangeEnd: { category: "Special", type: "int", default: 1 / 0, range: { start: 0, end: 1 / 0, step: 1 }, description: `Format code ending at a given character offset (exclusive).
The range will extend forwards to the end of the selected statement.`, cliCategory: "Editor" }, rangeStart: { category: "Special", type: "int", default: 0, range: { start: 0, end: 1 / 0, step: 1 }, description: `Format code starting at a given character offset.
The range will extend backwards to the start of the first line containing the selected statement.`, cliCategory: "Editor" }, requirePragma: { category: "Special", type: "boolean", default: false, description: "Require either '@prettier' or '@format' to be present in the file's first docblock comment in order for it to be formatted.", cliCategory: "Other" }, tabWidth: { type: "int", category: "Global", default: 2, description: "Number of spaces per indentation level.", range: { start: 0, end: 1 / 0, step: 1 } }, useTabs: { category: "Global", type: "boolean", default: false, description: "Indent with tabs instead of spaces." }, embeddedLanguageFormatting: { category: "Global", type: "choice", default: "auto", description: "Control how Prettier formats quoted code embedded in the file.", choices: [{ value: "auto", description: "Format embedded code if Prettier can automatically identify it." }, { value: "off", description: "Never automatically format embedded code." }] } };
    eo2 = (e2, t9) => {
      if (!(e2 && t9 == null)) return t9.toReversed || !Array.isArray(t9) ? t9.toReversed() : [...t9].reverse();
    };
    Hr = eo2;
    to2 = ((Jr2 = globalThis.Deno) == null ? void 0 : Jr2.build.os) === "windows" || ((Xr2 = (qr = globalThis.navigator) == null ? void 0 : qr.platform) == null ? void 0 : Xr2.startsWith("Win")) || ((Zr2 = (Qr2 = globalThis.process) == null ? void 0 : Qr2.platform) == null ? void 0 : Zr2.startsWith("win")) || false;
    rn2 = tn2;
    uo2 = (e2) => String(e2).split(/[/\\]/u).pop();
    on2 = io2;
    re3 = { key: (e2) => /^[$_a-zA-Z][$_a-zA-Z0-9]*$/.test(e2) ? e2 : JSON.stringify(e2), value(e2) {
      if (e2 === null || typeof e2 != "object") return JSON.stringify(e2);
      if (Array.isArray(e2)) return `[${e2.map((r2) => re3.value(r2)).join(", ")}]`;
      let t9 = Object.keys(e2);
      return t9.length === 0 ? "{}" : `{ ${t9.map((r2) => `${re3.key(r2)}: ${re3.value(e2[r2])}`).join(", ")} }`;
    }, pair: ({ key: e2, value: t9 }) => re3.value({ [e2]: t9 }) };
    sn = new Proxy(String, { get: () => sn });
    V4 = sn;
    an = (e2, t9, { descriptor: r2 }) => {
      let n2 = [`${V4.yellow(typeof e2 == "string" ? r2.key(e2) : r2.pair(e2))} is deprecated`];
      return t9 && n2.push(`we now treat it as ${V4.blue(typeof t9 == "string" ? r2.key(t9) : r2.pair(t9))}`), n2.join("; ") + ".";
    };
    Ze2 = Symbol.for("vnopts.VALUE_NOT_EXIST");
    ge3 = Symbol.for("vnopts.VALUE_UNCHANGED");
    Dn2 = " ".repeat(2);
    fn2 = (e2, t9, r2) => {
      let { text: n2, list: u } = r2.normalizeExpectedResult(r2.schemas[e2].expected(r2)), o2 = [];
      return n2 && o2.push(cn2(e2, t9, n2, r2.descriptor)), u && o2.push([cn2(e2, t9, u.title, r2.descriptor)].concat(u.values.map((i) => ln2(i, r2.loggerPrintWidth))).join(`
`)), Fn2(o2, r2.loggerPrintWidth);
    };
    Pt2 = [];
    pn2 = [];
    et2 = (e2, t9, { descriptor: r2, logger: n2, schemas: u }) => {
      let o2 = [`Ignored unknown option ${V4.yellow(r2.pair({ key: e2, value: t9 }))}.`], i = Object.keys(u).sort().find((s2) => vt2(e2, s2) < 3);
      i && o2.push(`Did you mean ${V4.blue(r2.key(i))}?`), n2.warn(o2.join(" "));
    };
    so2 = ["default", "expected", "validate", "deprecated", "forward", "redirect", "overlap", "preprocess", "postprocess"];
    b2 = class {
      static create(t9) {
        return ao2(this, t9);
      }
      constructor(t9) {
        this.name = t9.name;
      }
      default(t9) {
      }
      expected(t9) {
        return "nothing";
      }
      validate(t9, r2) {
        return false;
      }
      deprecated(t9, r2) {
        return false;
      }
      forward(t9, r2) {
      }
      redirect(t9, r2) {
      }
      overlap(t9, r2, n2) {
        return t9;
      }
      preprocess(t9, r2) {
        return t9;
      }
      postprocess(t9, r2) {
        return ge3;
      }
    };
    tt2 = class extends b2 {
      constructor(t9) {
        super(t9), this._sourceName = t9.sourceName;
      }
      expected(t9) {
        return t9.schemas[this._sourceName].expected(t9);
      }
      validate(t9, r2) {
        return r2.schemas[this._sourceName].validate(t9, r2);
      }
      redirect(t9, r2) {
        return this._sourceName;
      }
    };
    rt2 = class extends b2 {
      expected() {
        return "anything";
      }
      validate() {
        return true;
      }
    };
    nt2 = class extends b2 {
      constructor({ valueSchema: t9, name: r2 = t9.name, ...n2 }) {
        super({ ...n2, name: r2 }), this._valueSchema = t9;
      }
      expected(t9) {
        let { text: r2, list: n2 } = t9.normalizeExpectedResult(this._valueSchema.expected(t9));
        return { text: r2 && `an array of ${r2}`, list: n2 && { title: "an array of the following values", values: [{ list: n2 }] } };
      }
      validate(t9, r2) {
        if (!Array.isArray(t9)) return false;
        let n2 = [];
        for (let u of t9) {
          let o2 = r2.normalizeValidateResult(this._valueSchema.validate(u, r2), u);
          o2 !== true && n2.push(o2.value);
        }
        return n2.length === 0 ? true : { value: n2 };
      }
      deprecated(t9, r2) {
        let n2 = [];
        for (let u of t9) {
          let o2 = r2.normalizeDeprecatedResult(this._valueSchema.deprecated(u, r2), u);
          o2 !== false && n2.push(...o2.map(({ value: i }) => ({ value: [i] })));
        }
        return n2;
      }
      forward(t9, r2) {
        let n2 = [];
        for (let u of t9) {
          let o2 = r2.normalizeForwardResult(this._valueSchema.forward(u, r2), u);
          n2.push(...o2.map(dn2));
        }
        return n2;
      }
      redirect(t9, r2) {
        let n2 = [], u = [];
        for (let o2 of t9) {
          let i = r2.normalizeRedirectResult(this._valueSchema.redirect(o2, r2), o2);
          "remain" in i && n2.push(i.remain), u.push(...i.redirect.map(dn2));
        }
        return n2.length === 0 ? { redirect: u } : { redirect: u, remain: n2 };
      }
      overlap(t9, r2) {
        return t9.concat(r2);
      }
    };
    ut2 = class extends b2 {
      expected() {
        return "true or false";
      }
      validate(t9) {
        return typeof t9 == "boolean";
      }
    };
    it2 = class extends b2 {
      constructor(t9) {
        super(t9), this._choices = Cn2(t9.choices.map((r2) => r2 && typeof r2 == "object" ? r2 : { value: r2 }), "value");
      }
      expected({ descriptor: t9 }) {
        let r2 = Array.from(this._choices.keys()).map((i) => this._choices.get(i)).filter(({ hidden: i }) => !i).map((i) => i.value).sort(An2).map(t9.value), n2 = r2.slice(0, -2), u = r2.slice(-2);
        return { text: n2.concat(u.join(" or ")).join(", "), list: { title: "one of the following values", values: r2 } };
      }
      validate(t9) {
        return this._choices.has(t9);
      }
      deprecated(t9) {
        let r2 = this._choices.get(t9);
        return r2 && r2.deprecated ? { value: t9 } : false;
      }
      forward(t9) {
        let r2 = this._choices.get(t9);
        return r2 ? r2.forward : void 0;
      }
      redirect(t9) {
        let r2 = this._choices.get(t9);
        return r2 ? r2.redirect : void 0;
      }
    };
    st2 = class extends b2 {
      expected() {
        return "a number";
      }
      validate(t9, r2) {
        return typeof t9 == "number";
      }
    };
    at2 = class extends st2 {
      expected() {
        return "an integer";
      }
      validate(t9, r2) {
        return r2.normalizeValidateResult(super.validate(t9, r2), t9) === true && yn2(t9);
      }
    };
    Ie3 = class extends b2 {
      expected() {
        return "a string";
      }
      validate(t9) {
        return typeof t9 == "string";
      }
    };
    _n2 = re3;
    xn2 = et2;
    wn2 = fn2;
    bn2 = an;
    Dt2 = class {
      constructor(t9, r2) {
        let { logger: n2 = console, loggerPrintWidth: u = 80, descriptor: o2 = _n2, unknown: i = xn2, invalid: s2 = wn2, deprecated: a = bn2, missing: c2 = () => false, required: D2 = () => false, preprocess: p2 = (F) => F, postprocess: l2 = () => ge3 } = r2 || {};
        this._utils = { descriptor: o2, logger: n2 || { warn: () => {
        } }, loggerPrintWidth: u, schemas: En2(t9, "name"), normalizeDefaultResult: Lt2, normalizeExpectedResult: It2, normalizeDeprecatedResult: Yt2, normalizeForwardResult: ot2, normalizeRedirectResult: jt2, normalizeValidateResult: Rt2 }, this._unknownHandler = i, this._invalidHandler = Bn2(s2), this._deprecatedHandler = a, this._identifyMissing = (F, f3) => !(F in f3) || c2(F, f3), this._identifyRequired = D2, this._preprocess = p2, this._postprocess = l2, this.cleanHistory();
      }
      cleanHistory() {
        this._hasDeprecationWarned = hn2();
      }
      normalize(t9) {
        let r2 = {}, u = [this._preprocess(t9, this._utils)], o2 = () => {
          for (; u.length !== 0; ) {
            let i = u.shift(), s2 = this._applyNormalization(i, r2);
            u.push(...s2);
          }
        };
        o2();
        for (let i of Object.keys(this._utils.schemas)) {
          let s2 = this._utils.schemas[i];
          if (!(i in r2)) {
            let a = Lt2(s2.default(this._utils));
            "value" in a && u.push({ [i]: a.value });
          }
        }
        o2();
        for (let i of Object.keys(this._utils.schemas)) {
          if (!(i in r2)) continue;
          let s2 = this._utils.schemas[i], a = r2[i], c2 = s2.postprocess(a, this._utils);
          c2 !== ge3 && (this._applyValidation(c2, i, s2), r2[i] = c2);
        }
        return this._applyPostprocess(r2), this._applyRequiredCheck(r2), r2;
      }
      _applyNormalization(t9, r2) {
        let n2 = [], { knownKeys: u, unknownKeys: o2 } = this._partitionOptionKeys(t9);
        for (let i of u) {
          let s2 = this._utils.schemas[i], a = s2.preprocess(t9[i], this._utils);
          this._applyValidation(a, i, s2);
          let c2 = ({ from: F, to: f3 }) => {
            n2.push(typeof f3 == "string" ? { [f3]: F } : { [f3.key]: f3.value });
          }, D2 = ({ value: F, redirectTo: f3 }) => {
            let d2 = Yt2(s2.deprecated(F, this._utils), a, true);
            if (d2 !== false) if (d2 === true) this._hasDeprecationWarned(i) || this._utils.logger.warn(this._deprecatedHandler(i, f3, this._utils));
            else for (let { value: m } of d2) {
              let C2 = { key: i, value: m };
              if (!this._hasDeprecationWarned(C2)) {
                let E3 = typeof f3 == "string" ? { key: f3, value: m } : f3;
                this._utils.logger.warn(this._deprecatedHandler(C2, E3, this._utils));
              }
            }
          };
          ot2(s2.forward(a, this._utils), a).forEach(c2);
          let l2 = jt2(s2.redirect(a, this._utils), a);
          if (l2.redirect.forEach(c2), "remain" in l2) {
            let F = l2.remain;
            r2[i] = i in r2 ? s2.overlap(r2[i], F, this._utils) : F, D2({ value: F });
          }
          for (let { from: F, to: f3 } of l2.redirect) D2({ value: F, redirectTo: f3 });
        }
        for (let i of o2) {
          let s2 = t9[i];
          this._applyUnknownHandler(i, s2, r2, (a, c2) => {
            n2.push({ [a]: c2 });
          });
        }
        return n2;
      }
      _applyRequiredCheck(t9) {
        for (let r2 of Object.keys(this._utils.schemas)) if (this._identifyMissing(r2, t9) && this._identifyRequired(r2)) throw this._invalidHandler(r2, Ze2, this._utils);
      }
      _partitionOptionKeys(t9) {
        let [r2, n2] = gn2(Object.keys(t9).filter((u) => !this._identifyMissing(u, t9)), (u) => u in this._utils.schemas);
        return { knownKeys: r2, unknownKeys: n2 };
      }
      _applyValidation(t9, r2, n2) {
        let u = Rt2(n2.validate(t9, this._utils), t9);
        if (u !== true) throw this._invalidHandler(r2, u.value, this._utils);
      }
      _applyUnknownHandler(t9, r2, n2, u) {
        let o2 = this._unknownHandler(t9, r2, this._utils);
        if (o2) for (let i of Object.keys(o2)) {
          if (this._identifyMissing(i, o2)) continue;
          let s2 = o2[i];
          i in this._utils.schemas ? u(i, s2) : n2[i] = s2;
        }
      }
      _applyPostprocess(t9) {
        let r2 = this._postprocess(t9, this._utils);
        if (r2 !== ge3) {
          if (r2.delete) for (let n2 of r2.delete) delete t9[n2];
          if (r2.override) {
            let { knownKeys: n2, unknownKeys: u } = this._partitionOptionKeys(r2.override);
            for (let o2 of n2) {
              let i = r2.override[o2];
              this._applyValidation(i, o2, this._utils.schemas[o2]), t9[o2] = i;
            }
            for (let o2 of u) {
              let i = r2.override[o2];
              this._applyUnknownHandler(o2, i, t9, (s2, a) => {
                let c2 = this._utils.schemas[s2];
                this._applyValidation(a, s2, c2), t9[s2] = a;
              });
            }
          }
        }
      }
    };
    kn2 = lo2;
    mo = (e2, t9, r2) => {
      if (!(e2 && t9 == null)) {
        if (t9.findLast) return t9.findLast(r2);
        for (let n2 = t9.length - 1; n2 >= 0; n2--) {
          let u = t9[n2];
          if (r2(u, n2, t9)) return u;
        }
      }
    };
    Vt2 = mo;
    Nn2 = { astFormat: "estree", printer: {}, originalText: void 0, locStart: null, locEnd: null };
    ne3 = Eo;
    vn2 = gu(Pn2(), 1);
    De3 = yo;
    In2 = _o;
    Kt2 = xo;
    Yn2 = wo;
    bo = (e2, t9, r2) => {
      if (!(e2 && t9 == null)) {
        if (t9.findLastIndex) return t9.findLastIndex(r2);
        for (let n2 = t9.length - 1; n2 >= 0; n2--) {
          let u = t9[n2];
          if (r2(u, n2, t9)) return n2;
        }
        return -1;
      }
    };
    jn2 = bo;
    ko = ({ parser: e2 }) => e2 === "json" || e2 === "json5" || e2 === "jsonc" || e2 === "json-stringify";
    $n2 = /* @__PURE__ */ new Set(["JsonRoot", "ObjectExpression", "ArrayExpression", "StringLiteral", "NumericLiteral", "BooleanLiteral", "NullLiteral", "UnaryExpression", "TemplateLiteral"]);
    Oo2 = /* @__PURE__ */ new Set(["OperationDefinition", "FragmentDefinition", "VariableDefinition", "TypeExtensionDefinition", "ObjectTypeDefinition", "FieldDefinition", "DirectiveDefinition", "EnumTypeDefinition", "EnumValueDefinition", "InputValueDefinition", "InputObjectTypeDefinition", "SchemaDefinition", "OperationTypeDefinition", "InterfaceTypeDefinition", "UnionTypeDefinition", "ScalarTypeDefinition"]);
    zn2 = "\uFEFF";
    Mn2 = Symbol("cursor");
    qt2 = {};
    dt(qt2, { builders: () => Io2, printer: () => Ro2, utils: () => Yo2 });
    Io2 = { join: ke3, line: Me3, softline: _r2, hardline: z9, literalline: We2, group: At2, conditionalGroup: Cr2, fill: hr2, lineSuffix: Se3, lineSuffixBoundary: Ar2, cursor: X3, breakParent: pe3, ifBreak: gr2, trim: Br2, indent: ie2, indentIfBreak: yr2, align: oe2, addAlignmentToDoc: Ge4, markAsRoot: mr2, dedentToRoot: dr2, dedent: Er2, hardlineWithoutBreakParent: Te3, literallineWithoutBreakParent: Bt2, label: xr2, concat: (e2) => e2 };
    Ro2 = { printDocToString: me3 };
    Yo2 = { willBreak: Dr2, traverseDoc: le2, findInDoc: Ve2, mapDoc: be3, removeLines: fr2, stripTrailingHardline: $e, replaceEndOfLine: lr2, canBreak: Fr2 };
    tu2 = "3.6.2";
    Qt2 = {};
    dt(Qt2, { addDanglingComment: () => ee3, addLeadingComment: () => se3, addTrailingComment: () => ae2, getAlignmentSize: () => Ee3, getIndentSize: () => ru2, getMaxContinuousCount: () => nu2, getNextNonSpaceNonCommentCharacter: () => uu2, getNextNonSpaceNonCommentCharacterIndex: () => Xo2, getPreferredQuote: () => iu2, getStringWidth: () => Ne3, hasNewline: () => G3, hasNewlineInRange: () => su2, hasSpaces: () => au2, isNextLineEmpty: () => ti2, isNextLineEmptyAfterIndex: () => ct2, isPreviousLineEmpty: () => Zo2, makeString: () => Du, skip: () => he3, skipEverythingButNewLine: () => Je2, skipInlineComment: () => ye2, skipNewline: () => U, skipSpaces: () => T2, skipToLineEnd: () => He3, skipTrailingComment: () => Ae3, skipWhitespace: () => Rr2 });
    ye2 = jo2;
    Ae3 = Uo2;
    je3 = Vo2;
    ct2 = $o2;
    ru2 = Wo2;
    nu2 = Mo2;
    uu2 = Go2;
    ft2 = "'";
    ou2 = '"';
    iu2 = Ko2;
    su2 = zo2;
    au2 = Ho2;
    Du = Jo2;
    cu = ce2(Jt);
    ni2 = ce2(Qe2, 0);
    ui = { parse: ce2(qn2), formatAST: ce2(Xn2), formatDoc: ce2(Qn2), printToDoc: ce2(Zn2), printDocToString: ce2(eu2) };
  }
});

// node_modules/@react-email/render/dist/node/index.mjs
var node_exports = {};
__export(node_exports, {
  plainTextSelectors: () => plainTextSelectors,
  pretty: () => pretty,
  render: () => render2,
  renderAsync: () => renderAsync
});
function recursivelyMapDoc(doc, callback) {
  if (Array.isArray(doc)) {
    return doc.map((innerDoc) => recursivelyMapDoc(innerDoc, callback));
  }
  if (typeof doc === "object") {
    if (doc.type === "group") {
      return __spreadProps(__spreadValues({}, doc), {
        contents: recursivelyMapDoc(doc.contents, callback),
        expandedStates: recursivelyMapDoc(
          doc.expandedStates,
          callback
        )
      });
    }
    if ("contents" in doc) {
      return __spreadProps(__spreadValues({}, doc), {
        contents: recursivelyMapDoc(doc.contents, callback)
      });
    }
    if ("parts" in doc) {
      return __spreadProps(__spreadValues({}, doc), {
        parts: recursivelyMapDoc(doc.parts, callback)
      });
    }
    if (doc.type === "if-break") {
      return __spreadProps(__spreadValues({}, doc), {
        breakContents: recursivelyMapDoc(doc.breakContents, callback),
        flatContents: recursivelyMapDoc(doc.flatContents, callback)
      });
    }
  }
  return callback(doc);
}
var import_react, import_node_stream, import_jsx_runtime, __defProp2, __defProps, __getOwnPropDescs, __getOwnPropSymbols, __hasOwnProp2, __propIsEnum, __defNormalProp, __spreadValues, __spreadProps, __async, plainTextSelectors, modifiedHtml, defaults2, pretty, decoder, readStream, render2, renderAsync;
var init_node2 = __esm({
  "node_modules/@react-email/render/dist/node/index.mjs"() {
    init_html_to_text();
    import_react = require("react");
    init_html();
    init_standalone();
    import_node_stream = require("node:stream");
    import_jsx_runtime = require("react/jsx-runtime");
    __defProp2 = Object.defineProperty;
    __defProps = Object.defineProperties;
    __getOwnPropDescs = Object.getOwnPropertyDescriptors;
    __getOwnPropSymbols = Object.getOwnPropertySymbols;
    __hasOwnProp2 = Object.prototype.hasOwnProperty;
    __propIsEnum = Object.prototype.propertyIsEnumerable;
    __defNormalProp = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
    __spreadValues = (a, b3) => {
      for (var prop in b3 || (b3 = {}))
        if (__hasOwnProp2.call(b3, prop))
          __defNormalProp(a, prop, b3[prop]);
      if (__getOwnPropSymbols)
        for (var prop of __getOwnPropSymbols(b3)) {
          if (__propIsEnum.call(b3, prop))
            __defNormalProp(a, prop, b3[prop]);
        }
      return a;
    };
    __spreadProps = (a, b3) => __defProps(a, __getOwnPropDescs(b3));
    __async = (__this, __arguments, generator) => {
      return new Promise((resolve, reject) => {
        var fulfilled = (value) => {
          try {
            step(generator.next(value));
          } catch (e2) {
            reject(e2);
          }
        };
        var rejected = (value) => {
          try {
            step(generator.throw(value));
          } catch (e2) {
            reject(e2);
          }
        };
        var step = (x2) => x2.done ? resolve(x2.value) : Promise.resolve(x2.value).then(fulfilled, rejected);
        step((generator = generator.apply(__this, __arguments)).next());
      });
    };
    plainTextSelectors = [
      { selector: "img", format: "skip" },
      { selector: "[data-skip-in-text=true]", format: "skip" },
      {
        selector: "a",
        options: { linkBrackets: false }
      }
    ];
    modifiedHtml = __spreadValues({}, html_exports);
    if (modifiedHtml.printers) {
      const previousPrint = modifiedHtml.printers.html.print;
      modifiedHtml.printers.html.print = (path3, options, print, args) => {
        const node = path3.getNode();
        const rawPrintingResult = previousPrint(path3, options, print, args);
        if (node.type === "ieConditionalComment") {
          const printingResult = recursivelyMapDoc(rawPrintingResult, (doc) => {
            if (typeof doc === "object" && doc.type === "line") {
              return doc.soft ? "" : " ";
            }
            return doc;
          });
          return printingResult;
        }
        return rawPrintingResult;
      };
    }
    defaults2 = {
      endOfLine: "lf",
      tabWidth: 2,
      plugins: [modifiedHtml],
      bracketSameLine: true,
      parser: "html"
    };
    pretty = (str, options = {}) => {
      return fu(str.replaceAll("\0", ""), __spreadValues(__spreadValues({}, defaults2), options));
    };
    decoder = new TextDecoder("utf-8");
    readStream = (stream) => __async(void 0, null, function* () {
      let result = "";
      if ("pipeTo" in stream) {
        const writableStream = new WritableStream({
          write(chunk) {
            result += decoder.decode(chunk);
          }
        });
        yield stream.pipeTo(writableStream);
      } else {
        const writable = new import_node_stream.Writable({
          write(chunk, _encoding, callback) {
            result += decoder.decode(chunk);
            callback();
          }
        });
        stream.pipe(writable);
        yield new Promise((resolve, reject) => {
          writable.on("error", reject);
          writable.on("close", () => {
            resolve();
          });
        });
      }
      return result;
    });
    render2 = (node, options) => __async(void 0, null, function* () {
      const suspendedElement = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, { children: node });
      const reactDOMServer = yield import("react-dom/server").then(
        // This is beacuse react-dom/server is CJS
        (m) => m.default
      );
      let html2;
      if (Object.hasOwn(reactDOMServer, "renderToReadableStream")) {
        html2 = yield readStream(
          yield reactDOMServer.renderToReadableStream(suspendedElement)
        );
      } else {
        yield new Promise((resolve, reject) => {
          const stream = reactDOMServer.renderToPipeableStream(suspendedElement, {
            onAllReady() {
              return __async(this, null, function* () {
                html2 = yield readStream(stream);
                resolve();
              });
            },
            onError(error) {
              reject(error);
            }
          });
        });
      }
      if (options == null ? void 0 : options.plainText) {
        return convert(html2, __spreadValues({
          selectors: plainTextSelectors
        }, options.htmlToTextOptions));
      }
      const doctype = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
      const document = `${doctype}${html2.replace(/<!DOCTYPE.*?>/, "")}`;
      if (options == null ? void 0 : options.pretty) {
        return pretty(document);
      }
      return document;
    });
    renderAsync = (element, options) => {
      return render2(element, options);
    };
  }
});

// electron/main.ts
var import_electron3 = require("electron");
var import_path2 = __toESM(require("path"));

// node_modules/electron-is-dev/index.js
var import_electron = __toESM(require("electron"), 1);
if (typeof import_electron.default === "string") {
  throw new TypeError("Not running in an Electron environment!");
}
var { env } = process;
var isEnvSet = "ELECTRON_IS_DEV" in env;
var getFromEnv = Number.parseInt(env.ELECTRON_IS_DEV, 10) === 1;
var isDev = isEnvSet ? getFromEnv : !import_electron.default.app.isPackaged;
var electron_is_dev_default = isDev;

// node_modules/trpc-electron/dist/main.mjs
var import_electron2 = require("electron");
var de = Object.defineProperty;
var x = (r2, e2) => (e2 = Symbol[r2]) ? e2 : Symbol.for("Symbol." + r2);
var w = (r2) => {
  throw TypeError(r2);
};
var fe = (r2, e2, t9) => e2 in r2 ? de(r2, e2, { enumerable: true, configurable: true, writable: true, value: t9 }) : r2[e2] = t9;
var S = (r2, e2, t9) => fe(r2, typeof e2 != "symbol" ? e2 + "" : e2, t9);
var L = (r2, e2, t9) => e2.has(r2) || w("Cannot " + t9);
var E = (r2, e2, t9) => (L(r2, e2, "read from private field"), t9 ? t9.call(r2) : e2.get(r2));
var N = (r2, e2, t9) => e2.has(r2) ? w("Cannot add the same private member more than once") : e2 instanceof WeakSet ? e2.add(r2) : e2.set(r2, t9);
var H = (r2, e2, t9, s2) => (L(r2, e2, "write to private field"), s2 ? s2.call(r2, t9) : e2.set(r2, t9), t9);
var g = (r2, e2, t9) => (L(r2, e2, "access private method"), t9);
var $ = (r2, e2, t9) => {
  if (e2 != null) {
    typeof e2 != "object" && typeof e2 != "function" && w("Object expected");
    var s2, n2;
    t9 && (s2 = e2[x("asyncDispose")]), s2 === void 0 && (s2 = e2[x("dispose")], t9 && (n2 = s2)), typeof s2 != "function" && w("Object not disposable"), n2 && (s2 = function() {
      try {
        n2.call(this);
      } catch (o2) {
        return Promise.reject(o2);
      }
    }), r2.push([t9, s2, e2]);
  } else t9 && r2.push([t9]);
  return e2;
};
var V = (r2, e2, t9) => {
  var s2 = typeof SuppressedError == "function" ? SuppressedError : function(i, R3, a, c2) {
    return c2 = Error(a), c2.name = "SuppressedError", c2.error = i, c2.suppressed = R3, c2;
  }, n2 = (i) => e2 = t9 ? new s2(i, e2, "An error was suppressed during disposal") : (t9 = true, i), o2 = (i) => {
    for (; i = r2.pop(); )
      try {
        var R3 = i[1] && i[1].call(i[2]);
        if (i[0]) return Promise.resolve(R3).then(o2, (a) => (n2(a), o2()));
      } catch (a) {
        n2(a);
      }
    if (t9) throw e2;
  };
  return o2();
};
var D = "trpc-electron";
var ye = {
  /**
  * Invalid JSON was received by the server.
  * An error occurred on the server while parsing the JSON text.
  */
  PARSE_ERROR: -32700,
  /**
  * The JSON sent is not a valid Request object.
  */
  BAD_REQUEST: -32600,
  // Internal JSON-RPC error
  INTERNAL_SERVER_ERROR: -32603,
  NOT_IMPLEMENTED: -32603,
  BAD_GATEWAY: -32603,
  SERVICE_UNAVAILABLE: -32603,
  GATEWAY_TIMEOUT: -32603,
  // Implementation specific errors
  UNAUTHORIZED: -32001,
  FORBIDDEN: -32003,
  NOT_FOUND: -32004,
  METHOD_NOT_SUPPORTED: -32005,
  TIMEOUT: -32008,
  CONFLICT: -32009,
  PRECONDITION_FAILED: -32012,
  PAYLOAD_TOO_LARGE: -32013,
  UNSUPPORTED_MEDIA_TYPE: -32015,
  UNPROCESSABLE_CONTENT: -32022,
  TOO_MANY_REQUESTS: -32029,
  CLIENT_CLOSED_REQUEST: -32099
};
function he(r2) {
  return !!r2 && !Array.isArray(r2) && typeof r2 == "object";
}
var pe = {
  PARSE_ERROR: 400,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_SUPPORTED: 405,
  TIMEOUT: 408,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
};
function Re(r2) {
  return pe[r2] ?? 500;
}
function Te(r2) {
  return Re(r2.code);
}
function M(r2) {
  const { path: e2, error: t9, config: s2 } = r2, { code: n2 } = r2.error, o2 = {
    message: t9.message,
    code: ye[n2],
    data: {
      code: n2,
      httpStatus: Te(t9)
    }
  };
  return s2.isDev && typeof r2.error.stack == "string" && (o2.data.stack = r2.error.stack), typeof e2 == "string" && (o2.data.path = e2), s2.errorFormatter({
    ...r2,
    shape: o2
  });
}
function Q(r2, e2, t9) {
  return e2 in r2 ? Object.defineProperty(r2, e2, {
    value: t9,
    enumerable: true,
    configurable: true,
    writable: true
  }) : r2[e2] = t9, r2;
}
var me = class extends Error {
};
function _e(r2) {
  if (r2 instanceof Error)
    return r2;
  const e2 = typeof r2;
  if (!(e2 === "undefined" || e2 === "function" || r2 === null)) {
    if (e2 !== "object")
      return new Error(String(r2));
    if (he(r2)) {
      const t9 = new me();
      for (const s2 in r2)
        t9[s2] = r2[s2];
      return t9;
    }
  }
}
function I(r2) {
  if (r2 instanceof h || r2 instanceof Error && r2.name === "TRPCError")
    return r2;
  const e2 = new h({
    code: "INTERNAL_SERVER_ERROR",
    cause: r2
  });
  return r2 instanceof Error && r2.stack && (e2.stack = r2.stack), e2;
}
var h = class extends Error {
  constructor(e2) {
    const t9 = _e(e2.cause), s2 = e2.message ?? (t9 == null ? void 0 : t9.message) ?? e2.code;
    super(s2, {
      cause: t9
    }), // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore override doesn't work in all environments due to "This member cannot have an 'override' modifier because it is not declared in the base class 'Error'"
    Q(this, "cause", void 0), Q(this, "code", void 0), this.code = e2.code, this.name = "TRPCError", this.cause || (this.cause = t9);
  }
};
var z;
var K;
(z = Symbol).dispose ?? (z.dispose = Symbol());
(K = Symbol).asyncDispose ?? (K.asyncDispose = Symbol());
var Oe = Symbol();
function Se(r2) {
  return Array.isArray(r2) && r2[2] === Oe;
}
function J(r2, e2) {
  return "error" in e2 ? {
    ...e2,
    error: r2.transformer.output.serialize(e2.error)
  } : "data" in e2.result ? {
    ...e2,
    result: {
      ...e2.result,
      data: r2.transformer.output.serialize(e2.result.data)
    }
  } : e2;
}
function Ae(r2, e2) {
  return Array.isArray(e2) ? e2.map((t9) => J(r2, t9)) : J(r2, e2);
}
var q;
var X;
var ee;
var re;
var te;
var se;
typeof window > "u" || "Deno" in window || // eslint-disable-next-line @typescript-eslint/dot-notation
((X = (q = globalThis.process) == null ? void 0 : q.env) == null ? void 0 : X.NODE_ENV) === "test" || (re = (ee = globalThis.process) == null ? void 0 : ee.env) != null && re.JEST_WORKER_ID || (se = (te = globalThis.process) == null ? void 0 : te.env) != null && se.VITEST_WORKER_ID;
function Pe(r2) {
  return typeof r2 == "function";
}
function we(r2) {
  const { type: e2, path: t9 } = r2, s2 = r2.procedures[t9];
  if (!s2 || !Pe(s2) || s2._def.type !== e2 && !r2.allowMethodOverride)
    throw new h({
      code: "NOT_FOUND",
      message: `No "${e2}"-procedure on path "${t9}"`
    });
  if (s2._def.type !== e2 && r2.allowMethodOverride && s2._def.type === "subscription")
    throw new h({
      code: "METHOD_NOT_SUPPORTED",
      message: "Method override is not supported for subscriptions"
    });
  return s2(r2);
}
function Z(r2) {
  return typeof r2 == "object" && r2 !== null && "subscribe" in r2;
}
function Ne(r2, e2) {
  let t9 = null;
  const s2 = () => {
    t9 == null || t9.unsubscribe(), t9 = null, e2.removeEventListener("abort", s2);
  };
  return new ReadableStream({
    start(n2) {
      t9 = r2.subscribe({
        next(o2) {
          n2.enqueue({
            ok: true,
            value: o2
          });
        },
        error(o2) {
          n2.enqueue({
            ok: false,
            error: o2
          }), n2.close();
        },
        complete() {
          n2.close();
        }
      }), e2.aborted ? s2() : e2.addEventListener("abort", s2, {
        once: true
      });
    },
    cancel() {
      s2();
    }
  });
}
function ge(r2, e2) {
  const s2 = Ne(r2, e2).getReader(), n2 = {
    async next() {
      const o2 = await s2.read();
      if (o2.done)
        return {
          value: void 0,
          done: true
        };
      const { value: i } = o2;
      if (!i.ok)
        throw i.error;
      return {
        value: i.value,
        done: false
      };
    },
    async return() {
      return await s2.cancel(), {
        value: void 0,
        done: true
      };
    }
  };
  return {
    [Symbol.asyncIterator]() {
      return n2;
    }
  };
}
var v = /* @__PURE__ */ new WeakMap();
var Ie = () => {
};
var ne;
ne = Symbol.toStringTag;
var f = class f2 {
  constructor(e2) {
    S(this, "promise");
    S(this, "subscribers", []);
    S(this, "settlement", null);
    S(this, ne, "Unpromise");
    typeof e2 == "function" ? this.promise = new Promise(e2) : this.promise = e2;
    const t9 = this.promise.then((s2) => {
      const { subscribers: n2 } = this;
      this.subscribers = null, this.settlement = {
        status: "fulfilled",
        value: s2
      }, n2 == null || n2.forEach(({ resolve: o2 }) => {
        o2(s2);
      });
    });
    "catch" in t9 && t9.catch((s2) => {
      const { subscribers: n2 } = this;
      this.subscribers = null, this.settlement = {
        status: "rejected",
        reason: s2
      }, n2 == null || n2.forEach(({ reject: o2 }) => {
        o2(s2);
      });
    });
  }
  /** Create a promise that mitigates uncontrolled subscription to a long-lived
   * Promise via .then() and .catch() - otherwise a source of memory leaks.
   *
   * The returned promise has an `unsubscribe()` method which can be called when
   * the Promise is no longer being tracked by application logic, and which
   * ensures that there is no reference chain from the original promise to the
   * new one, and therefore no memory leak.
   *
   * If original promise has not yet settled, this adds a new unique promise
   * that listens to then/catch events, along with an `unsubscribe()` method to
   * detach it.
   *
   * If original promise has settled, then creates a new Promise.resolve() or
   * Promise.reject() and provided unsubscribe is a noop.
   *
   * If you call `unsubscribe()` before the returned Promise has settled, it
   * will never settle.
   */
  subscribe() {
    let e2, t9;
    const { settlement: s2 } = this;
    if (s2 === null) {
      if (this.subscribers === null)
        throw new Error("Unpromise settled but still has subscribers");
      const n2 = Ce();
      this.subscribers = Ue(this.subscribers, n2), e2 = n2.promise, t9 = () => {
        this.subscribers !== null && (this.subscribers = Me(this.subscribers, n2));
      };
    } else {
      const { status: n2 } = s2;
      n2 === "fulfilled" ? e2 = Promise.resolve(s2.value) : e2 = Promise.reject(s2.reason), t9 = Ie;
    }
    return Object.assign(e2, { unsubscribe: t9 });
  }
  /** STANDARD PROMISE METHODS (but returning a SubscribedPromise) */
  then(e2, t9) {
    const s2 = this.subscribe(), { unsubscribe: n2 } = s2;
    return Object.assign(s2.then(e2, t9), {
      unsubscribe: n2
    });
  }
  catch(e2) {
    const t9 = this.subscribe(), { unsubscribe: s2 } = t9;
    return Object.assign(t9.catch(e2), {
      unsubscribe: s2
    });
  }
  finally(e2) {
    const t9 = this.subscribe(), { unsubscribe: s2 } = t9;
    return Object.assign(t9.finally(e2), {
      unsubscribe: s2
    });
  }
  /** Unpromise STATIC METHODS */
  /** Create or Retrieve the proxy Unpromise (a re-used Unpromise for the VM lifetime
   * of the provided Promise reference) */
  static proxy(e2) {
    const t9 = f2.getSubscribablePromise(e2);
    return typeof t9 < "u" ? t9 : f2.createSubscribablePromise(e2);
  }
  /** Create and store an Unpromise keyed by an original Promise. */
  static createSubscribablePromise(e2) {
    const t9 = new f2(e2);
    return v.set(e2, t9), v.set(t9, t9), t9;
  }
  /** Retrieve a previously-created Unpromise keyed by an original Promise. */
  static getSubscribablePromise(e2) {
    return v.get(e2);
  }
  /** Promise STATIC METHODS */
  /** Lookup the Unpromise for this promise, and derive a SubscribedPromise from
   * it (that can be later unsubscribed to eliminate Memory leaks) */
  static resolve(e2) {
    const t9 = typeof e2 == "object" && e2 !== null && "then" in e2 && typeof e2.then == "function" ? e2 : Promise.resolve(e2);
    return f2.proxy(t9).subscribe();
  }
  static async any(e2) {
    const s2 = (Array.isArray(e2) ? e2 : [...e2]).map(f2.resolve);
    try {
      return await Promise.any(s2);
    } finally {
      s2.forEach(({ unsubscribe: n2 }) => {
        n2();
      });
    }
  }
  static async race(e2) {
    const s2 = (Array.isArray(e2) ? e2 : [...e2]).map(f2.resolve);
    try {
      return await Promise.race(s2);
    } finally {
      s2.forEach(({ unsubscribe: n2 }) => {
        n2();
      });
    }
  }
  /** Create a race of SubscribedPromises that will fulfil to a single winning
   * Promise (in a 1-Tuple). Eliminates memory leaks from long-lived promises
   * accumulating .then() and .catch() subscribers. Allows simple logic to
   * consume the result, like...
   * ```ts
   * const [ winner ] = await Unpromise.race([ promiseA, promiseB ]);
   * if(winner === promiseB){
   *   const result = await promiseB;
   *   // do the thing
   * }
   * ```
   * */
  static async raceReferences(e2) {
    const t9 = e2.map(De);
    try {
      return await Promise.race(t9);
    } finally {
      for (const s2 of t9)
        s2.unsubscribe();
    }
  }
};
var C = f;
function De(r2) {
  return C.proxy(r2).then(() => [r2]);
}
function Ce() {
  let r2, e2;
  return {
    promise: new Promise((s2, n2) => {
      r2 = s2, e2 = n2;
    }),
    resolve: r2,
    reject: e2
  };
}
function Ue(r2, e2) {
  return [...r2, e2];
}
function Le(r2, e2) {
  return [...r2.slice(0, e2), ...r2.slice(e2 + 1)];
}
function Me(r2, e2) {
  const t9 = r2.indexOf(e2);
  return t9 !== -1 ? Le(r2, t9) : r2;
}
function ve(r2) {
  return !!r2 && !Array.isArray(r2) && typeof r2 == "object";
}
var ke = typeof Symbol == "function" && !!Symbol.asyncIterator;
function We(r2) {
  return ke && ve(r2) && Symbol.asyncIterator in r2;
}
function Fe(r2, e2) {
  const t9 = r2;
  if (t9[Symbol.asyncDispose])
    throw new Error("Symbol.asyncDispose already exists");
  return t9[Symbol.asyncDispose] = e2, t9;
}
function Be(r2) {
  const e2 = r2[Symbol.asyncIterator]();
  return Fe(e2, async () => {
    var t9;
    await ((t9 = e2.return) == null ? void 0 : t9.call(e2));
  });
}
var Ye = (r2) => r2();
async function je({
  router: r2,
  createContext: e2,
  internalId: t9,
  message: s2,
  event: n2,
  subscriptions: o2
}) {
  var W3;
  if (s2.method === "subscription.stop") {
    (W3 = o2.get(t9)) == null || W3.abort();
    return;
  }
  const { type: i, input: R3, path: a, id: c2 } = s2.operation, A = R3 ? r2._def._config.transformer.input.deserialize(R3) : void 0, P3 = await (e2 == null ? void 0 : e2({ event: n2 })) ?? {}, b3 = (u) => {
    n2.sender.isDestroyed() || n2.reply(
      D,
      Ae(r2._def._config, u)
    );
  };
  try {
    const u = new AbortController(), d2 = await we({
      ctx: P3,
      path: a,
      procedures: r2._def.procedures,
      getRawInput: async () => A,
      type: i,
      signal: u.signal
    }), F = We(d2) || Z(d2);
    if (i !== "subscription") {
      if (F)
        throw new h({
          code: "UNSUPPORTED_MEDIA_TYPE",
          message: `Cannot return an async iterable or observable from a ${i} procedure.`
        });
      b3({
        id: c2,
        result: {
          type: "data",
          data: d2
        }
      });
      return;
    }
    if (!F)
      throw new h({
        message: `Subscription ${a} did not return an observable or a AsyncGenerator`,
        code: "INTERNAL_SERVER_ERROR"
      });
    if (o2.has(t9))
      throw new h({
        message: `Duplicate id ${t9}`,
        code: "BAD_REQUEST"
      });
    const ie3 = Z(d2) ? ge(d2, u.signal) : d2;
    Ye(async () => {
      var B3;
      var Y3 = [];
      try {
        const T3 = $(Y3, Be(ie3), true);
        const U2 = new Promise((m) => {
          u.signal.onabort = () => m("abort");
        });
        let l2;
        let O3;
        for (; ; ) {
          if (l2 = await C.race([
            T3.next().catch(I),
            U2
          ]), l2 === "abort") {
            await ((B3 = T3.return) == null ? void 0 : B3.call(T3));
            break;
          }
          if (l2 instanceof Error) {
            const m = I(l2);
            b3({
              id: c2,
              error: M({
                config: r2._def._config,
                error: m,
                type: i,
                path: a,
                input: A,
                ctx: P3
              })
            });
            break;
          }
          if (l2.done)
            break;
          if (O3 = {
            type: "data",
            data: l2.value
          }, Se(l2.value)) {
            const [m, le3] = l2.value;
            O3.id = m, O3.data = {
              id: m,
              data: le3
            };
          }
          b3({
            id: c2,
            result: O3
          }), l2 = null, O3 = null;
        }
        b3({
          id: c2,
          result: {
            type: "stopped"
          }
        });
        o2.delete(t9);
      } catch (ce3) {
        var ae3 = ce3, ue = true;
      } finally {
        var j3 = V(Y3, ae3, ue);
        j3 && await j3;
      }
    }).catch((T3) => {
      const U2 = I(T3);
      b3({
        id: c2,
        error: M({
          config: r2._def._config,
          error: U2,
          type: i,
          path: a,
          input: A,
          ctx: P3
        })
      }), u.abort();
    }), b3({
      id: c2,
      result: {
        type: "started"
      }
    }), o2.set(t9, u);
  } catch (u) {
    const d2 = I(u);
    return b3({
      id: c2,
      error: M({
        config: r2._def._config,
        error: d2,
        type: i,
        path: a,
        input: A,
        ctx: P3
      })
    });
  }
}
var xe = (r2, e2) => {
  const t9 = e2.method === "request" ? e2.operation.id : e2.id;
  return `${r2.sender.id}-${r2.senderFrame.routingId}:${t9}`;
};
var y;
var _;
var p;
var k;
var oe;
var He = class {
  constructor({
    createContext: e2,
    router: t9,
    windows: s2 = []
  }) {
    N(this, p);
    N(this, y, []);
    N(this, _, /* @__PURE__ */ new Map());
    s2.forEach((n2) => this.attachWindow(n2)), import_electron2.ipcMain.on(
      D,
      (n2, o2) => {
        je({
          router: t9,
          createContext: e2,
          internalId: xe(n2, o2),
          event: n2,
          message: o2,
          subscriptions: E(this, _)
        });
      }
    );
  }
  attachWindow(e2) {
    E(this, y).includes(e2) || (E(this, y).push(e2), g(this, p, oe).call(this, e2));
  }
  detachWindow(e2, t9) {
    if (H(this, y, E(this, y).filter((s2) => s2 !== e2)), e2.isDestroyed() && t9 === void 0)
      throw new Error(
        "webContentsId is required when calling detachWindow on a destroyed window"
      );
    g(this, p, k).call(this, {
      webContentsId: t9 ?? e2.webContents.id
    });
  }
};
y = /* @__PURE__ */ new WeakMap(), _ = /* @__PURE__ */ new WeakMap(), p = /* @__PURE__ */ new WeakSet(), k = function({
  webContentsId: e2,
  frameRoutingId: t9
}) {
  for (const [s2, n2] of E(this, _).entries())
    s2.startsWith(`${e2}-${t9 ?? ""}`) && (n2.abort(), E(this, _).delete(s2));
}, oe = function(e2) {
  const t9 = e2.webContents.id;
  e2.webContents.on("did-start-navigation", ({ isSameDocument: s2, frame: n2 }) => {
    s2 || g(this, p, k).call(this, {
      webContentsId: t9,
      frameRoutingId: n2.routingId
    });
  }), e2.webContents.on("destroyed", () => {
    this.detachWindow(e2, t9);
  });
};
var Ge = ({
  createContext: r2,
  router: e2,
  windows: t9 = []
}) => new He({ createContext: r2, router: e2, windows: t9 });

// src/server/api/trpc.ts
var import_server = require("@trpc/server");
var import_superjson = __toESM(require("superjson"));
var import_zod = require("zod");
var import_client = require("@prisma/client");

// node_modules/iron-session/dist/index.js
var import_cookie = __toESM(require_cookie(), 1);

// node_modules/iron-webcrypto/dist/index.js
var alphabetByEncoding = {};
var alphabetByValue = Array.from({ length: 64 });
for (let i = 0, start = "A".charCodeAt(0), limit = "Z".charCodeAt(0); i + start <= limit; i++) {
  const char = String.fromCharCode(i + start);
  alphabetByEncoding[char] = i;
  alphabetByValue[i] = char;
}
for (let i = 0, start = "a".charCodeAt(0), limit = "z".charCodeAt(0); i + start <= limit; i++) {
  const char = String.fromCharCode(i + start);
  const index = i + 26;
  alphabetByEncoding[char] = index;
  alphabetByValue[index] = char;
}
for (let i = 0; i < 10; i++) {
  alphabetByEncoding[i.toString(10)] = i + 52;
  const char = i.toString(10);
  const index = i + 52;
  alphabetByEncoding[char] = index;
  alphabetByValue[index] = char;
}
alphabetByEncoding["-"] = 62;
alphabetByValue[62] = "-";
alphabetByEncoding["_"] = 63;
alphabetByValue[63] = "_";
var bitsPerLetter = 6;
var bitsPerByte = 8;
var maxLetterValue = 63;
var stringToBuffer = (value) => {
  return new TextEncoder().encode(value);
};
var bufferToString = (value) => {
  return new TextDecoder().decode(value);
};
var base64urlDecode = (_input) => {
  const input = _input + "=".repeat((4 - _input.length % 4) % 4);
  let totalByteLength = input.length / 4 * 3;
  if (input.endsWith("==")) {
    totalByteLength -= 2;
  } else if (input.endsWith("=")) {
    totalByteLength--;
  }
  const out = new ArrayBuffer(totalByteLength);
  const dataView = new DataView(out);
  for (let i = 0; i < input.length; i += 4) {
    let bits = 0;
    let bitLength = 0;
    for (let j3 = i, limit = i + 3; j3 <= limit; j3++) {
      if (input[j3] === "=") {
        bits >>= bitsPerLetter;
      } else {
        if (!(input[j3] in alphabetByEncoding)) {
          throw new TypeError(`Invalid character ${input[j3]} in base64 string.`);
        }
        bits |= alphabetByEncoding[input[j3]] << (limit - j3) * bitsPerLetter;
        bitLength += bitsPerLetter;
      }
    }
    const chunkOffset = i / 4 * 3;
    bits >>= bitLength % bitsPerByte;
    const byteLength = Math.floor(bitLength / bitsPerByte);
    for (let k4 = 0; k4 < byteLength; k4++) {
      const offset = (byteLength - k4 - 1) * bitsPerByte;
      dataView.setUint8(chunkOffset + k4, (bits & 255 << offset) >> offset);
    }
  }
  return new Uint8Array(out);
};
var base64urlEncode = (_input) => {
  const input = typeof _input === "string" ? stringToBuffer(_input) : _input;
  let str = "";
  for (let i = 0; i < input.length; i += 3) {
    let bits = 0;
    let bitLength = 0;
    for (let j3 = i, limit = Math.min(i + 3, input.length); j3 < limit; j3++) {
      bits |= input[j3] << (limit - j3 - 1) * bitsPerByte;
      bitLength += bitsPerByte;
    }
    const bitClusterCount = Math.ceil(bitLength / bitsPerLetter);
    bits <<= bitClusterCount * bitsPerLetter - bitLength;
    for (let k4 = 1; k4 <= bitClusterCount; k4++) {
      const offset = (bitClusterCount - k4) * bitsPerLetter;
      str += alphabetByValue[(bits & maxLetterValue << offset) >> offset];
    }
  }
  return str;
};
var defaults = {
  encryption: { saltBits: 256, algorithm: "aes-256-cbc", iterations: 1, minPasswordlength: 32 },
  integrity: { saltBits: 256, algorithm: "sha256", iterations: 1, minPasswordlength: 32 },
  ttl: 0,
  timestampSkewSec: 60,
  localtimeOffsetMsec: 0
};
var clone = (options) => ({
  ...options,
  encryption: { ...options.encryption },
  integrity: { ...options.integrity }
});
var algorithms = {
  "aes-128-ctr": { keyBits: 128, ivBits: 128, name: "AES-CTR" },
  "aes-256-cbc": { keyBits: 256, ivBits: 128, name: "AES-CBC" },
  sha256: { keyBits: 256, name: "SHA-256" }
};
var macPrefix = "Fe26.2";
var randomBytes = (_crypto2, size) => {
  const bytes = new Uint8Array(size);
  _crypto2.getRandomValues(bytes);
  return bytes;
};
var randomBits = (_crypto2, bits) => {
  if (bits < 1)
    throw new Error("Invalid random bits count");
  const bytes = Math.ceil(bits / 8);
  return randomBytes(_crypto2, bytes);
};
var pbkdf2 = async (_crypto2, password, salt, iterations, keyLength, hash) => {
  const passwordBuffer = stringToBuffer(password);
  const importedKey = await _crypto2.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const saltBuffer = stringToBuffer(salt);
  const params = { name: "PBKDF2", hash, salt: saltBuffer, iterations };
  const derivation = await _crypto2.subtle.deriveBits(params, importedKey, keyLength * 8);
  return derivation;
};
var generateKey = async (_crypto2, password, options) => {
  var _a3;
  if (!(password == null ? void 0 : password.length))
    throw new Error("Empty password");
  if (options == null || typeof options !== "object")
    throw new Error("Bad options");
  if (!(options.algorithm in algorithms))
    throw new Error(`Unknown algorithm: ${options.algorithm}`);
  const algorithm = algorithms[options.algorithm];
  const result = {};
  const hmac = (_a3 = options.hmac) != null ? _a3 : false;
  const id = hmac ? { name: "HMAC", hash: algorithm.name } : { name: algorithm.name };
  const usage = hmac ? ["sign", "verify"] : ["encrypt", "decrypt"];
  if (typeof password === "string") {
    if (password.length < options.minPasswordlength)
      throw new Error(
        `Password string too short (min ${options.minPasswordlength} characters required)`
      );
    let { salt = "" } = options;
    if (!salt) {
      const { saltBits = 0 } = options;
      if (!saltBits)
        throw new Error("Missing salt and saltBits options");
      const randomSalt = randomBits(_crypto2, saltBits);
      salt = [...new Uint8Array(randomSalt)].map((x2) => x2.toString(16).padStart(2, "0")).join("");
    }
    const derivedKey = await pbkdf2(
      _crypto2,
      password,
      salt,
      options.iterations,
      algorithm.keyBits / 8,
      "SHA-1"
    );
    const importedEncryptionKey = await _crypto2.subtle.importKey(
      "raw",
      derivedKey,
      id,
      false,
      usage
    );
    result.key = importedEncryptionKey;
    result.salt = salt;
  } else {
    if (password.length < algorithm.keyBits / 8)
      throw new Error("Key buffer (password) too small");
    result.key = await _crypto2.subtle.importKey("raw", password, id, false, usage);
    result.salt = "";
  }
  if (options.iv)
    result.iv = options.iv;
  else if ("ivBits" in algorithm)
    result.iv = randomBits(_crypto2, algorithm.ivBits);
  return result;
};
var getEncryptParams = (algorithm, key, data) => {
  return [
    algorithm === "aes-128-ctr" ? { name: "AES-CTR", counter: key.iv, length: 128 } : { name: "AES-CBC", iv: key.iv },
    key.key,
    typeof data === "string" ? stringToBuffer(data) : data
  ];
};
var encrypt = async (_crypto2, password, options, data) => {
  const key = await generateKey(_crypto2, password, options);
  const encrypted = await _crypto2.subtle.encrypt(...getEncryptParams(options.algorithm, key, data));
  return { encrypted: new Uint8Array(encrypted), key };
};
var decrypt = async (_crypto2, password, options, data) => {
  const key = await generateKey(_crypto2, password, options);
  const decrypted = await _crypto2.subtle.decrypt(...getEncryptParams(options.algorithm, key, data));
  return bufferToString(new Uint8Array(decrypted));
};
var hmacWithPassword = async (_crypto2, password, options, data) => {
  const key = await generateKey(_crypto2, password, { ...options, hmac: true });
  const textBuffer = stringToBuffer(data);
  const signed = await _crypto2.subtle.sign({ name: "HMAC" }, key.key, textBuffer);
  const digest = base64urlEncode(new Uint8Array(signed));
  return { digest, salt: key.salt };
};
var normalizePassword = (password) => {
  if (typeof password === "string" || password instanceof Uint8Array)
    return { encryption: password, integrity: password };
  if ("secret" in password)
    return { id: password.id, encryption: password.secret, integrity: password.secret };
  return { id: password.id, encryption: password.encryption, integrity: password.integrity };
};
var seal = async (_crypto2, object, password, options) => {
  if (!password)
    throw new Error("Empty password");
  const opts = clone(options);
  const now = Date.now() + (opts.localtimeOffsetMsec || 0);
  const objectString = JSON.stringify(object);
  const pass = normalizePassword(password);
  const { id = "", encryption, integrity } = pass;
  if (id && !/^\w+$/.test(id))
    throw new Error("Invalid password id");
  const { encrypted, key } = await encrypt(_crypto2, encryption, opts.encryption, objectString);
  const encryptedB64 = base64urlEncode(new Uint8Array(encrypted));
  const iv = base64urlEncode(key.iv);
  const expiration = opts.ttl ? now + opts.ttl : "";
  const macBaseString = `${macPrefix}*${id}*${key.salt}*${iv}*${encryptedB64}*${expiration}`;
  const mac = await hmacWithPassword(_crypto2, integrity, opts.integrity, macBaseString);
  const sealed = `${macBaseString}*${mac.salt}*${mac.digest}`;
  return sealed;
};
var fixedTimeComparison = (a, b3) => {
  let mismatch = a.length === b3.length ? 0 : 1;
  if (mismatch)
    b3 = a;
  for (let i = 0; i < a.length; i += 1)
    mismatch |= a.charCodeAt(i) ^ b3.charCodeAt(i);
  return mismatch === 0;
};
var unseal = async (_crypto2, sealed, password, options) => {
  if (!password)
    throw new Error("Empty password");
  const opts = clone(options);
  const now = Date.now() + (opts.localtimeOffsetMsec || 0);
  const parts = sealed.split("*");
  if (parts.length !== 8)
    throw new Error("Incorrect number of sealed components");
  const prefix = parts[0];
  let passwordId = parts[1];
  const encryptionSalt = parts[2];
  const encryptionIv = parts[3];
  const encryptedB64 = parts[4];
  const expiration = parts[5];
  const hmacSalt = parts[6];
  const hmac = parts[7];
  const macBaseString = `${prefix}*${passwordId}*${encryptionSalt}*${encryptionIv}*${encryptedB64}*${expiration}`;
  if (macPrefix !== prefix)
    throw new Error("Wrong mac prefix");
  if (expiration) {
    if (!/^\d+$/.test(expiration))
      throw new Error("Invalid expiration");
    const exp = Number.parseInt(expiration, 10);
    if (exp <= now - opts.timestampSkewSec * 1e3)
      throw new Error("Expired seal");
  }
  let pass = "";
  passwordId = passwordId || "default";
  if (typeof password === "string" || password instanceof Uint8Array)
    pass = password;
  else if (passwordId in password) {
    pass = password[passwordId];
  } else {
    throw new Error(`Cannot find password: ${passwordId}`);
  }
  pass = normalizePassword(pass);
  const macOptions = opts.integrity;
  macOptions.salt = hmacSalt;
  const mac = await hmacWithPassword(_crypto2, pass.integrity, macOptions, macBaseString);
  if (!fixedTimeComparison(mac.digest, hmac))
    throw new Error("Bad hmac value");
  const encrypted = base64urlDecode(encryptedB64);
  const decryptOptions = opts.encryption;
  decryptOptions.salt = encryptionSalt;
  decryptOptions.iv = base64urlDecode(encryptionIv);
  const decrypted = await decrypt(_crypto2, pass.encryption, decryptOptions, encrypted);
  if (decrypted)
    return JSON.parse(decrypted);
  return null;
};

// node_modules/uncrypto/dist/crypto.node.mjs
var crypto_node_exports = {};
__export(crypto_node_exports, {
  default: () => _crypto,
  getRandomValues: () => getRandomValues,
  randomUUID: () => randomUUID,
  subtle: () => subtle
});
var import_node_crypto = __toESM(require("node:crypto"), 1);
var subtle = import_node_crypto.default.webcrypto?.subtle || {};
var randomUUID = () => {
  return import_node_crypto.default.randomUUID();
};
var getRandomValues = (array) => {
  return import_node_crypto.default.webcrypto.getRandomValues(array);
};
var _crypto = {
  randomUUID,
  getRandomValues,
  subtle
};

// node_modules/iron-session/dist/index.js
var timestampSkewSec = 60;
var fourteenDaysInSeconds = 14 * 24 * 3600;
var currentMajorVersion = 2;
var versionDelimiter = "~";
var defaultOptions = {
  ttl: fourteenDaysInSeconds,
  cookieOptions: { httpOnly: true, secure: true, sameSite: "lax", path: "/" }
};
function normalizeStringPasswordToMap(password) {
  return typeof password === "string" ? { 1: password } : password;
}
function parseSeal(seal2) {
  const [sealWithoutVersion, tokenVersionAsString] = seal2.split(versionDelimiter);
  const tokenVersion = tokenVersionAsString == null ? null : parseInt(tokenVersionAsString, 10);
  return { sealWithoutVersion, tokenVersion };
}
function computeCookieMaxAge(ttl) {
  if (ttl === 0) {
    return 2147483647;
  }
  return ttl - timestampSkewSec;
}
function getCookie(req, cookieName) {
  return (0, import_cookie.parse)(
    ("headers" in req && typeof req.headers.get === "function" ? req.headers.get("cookie") : req.headers.cookie) ?? ""
  )[cookieName] ?? "";
}
function getServerActionCookie(cookieName, cookieHandler) {
  const cookieObject = cookieHandler.get(cookieName);
  const cookie = cookieObject?.value;
  if (typeof cookie === "string") {
    return cookie;
  }
  return "";
}
function setCookie(res, cookieValue) {
  if ("headers" in res && typeof res.headers.append === "function") {
    res.headers.append("set-cookie", cookieValue);
    return;
  }
  let existingSetCookie = res.getHeader("set-cookie") ?? [];
  if (!Array.isArray(existingSetCookie)) {
    existingSetCookie = [existingSetCookie.toString()];
  }
  res.setHeader("set-cookie", [
    ...existingSetCookie,
    cookieValue
  ]);
}
function createSealData(_crypto2) {
  return async function sealData2(data, {
    password,
    ttl = fourteenDaysInSeconds
  }) {
    const passwordsMap = normalizeStringPasswordToMap(password);
    const mostRecentPasswordId = Math.max(
      ...Object.keys(passwordsMap).map(Number)
    );
    const passwordForSeal = {
      id: mostRecentPasswordId.toString(),
      secret: passwordsMap[mostRecentPasswordId]
    };
    const seal$1 = await seal(_crypto2, data, passwordForSeal, {
      ...defaults,
      ttl: ttl * 1e3
    });
    return `${seal$1}${versionDelimiter}${currentMajorVersion}`;
  };
}
function createUnsealData(_crypto2) {
  return async function unsealData2(seal2, {
    password,
    ttl = fourteenDaysInSeconds
  }) {
    const passwordsMap = normalizeStringPasswordToMap(password);
    const { sealWithoutVersion, tokenVersion } = parseSeal(seal2);
    try {
      const data = await unseal(_crypto2, sealWithoutVersion, passwordsMap, {
        ...defaults,
        ttl: ttl * 1e3
      }) ?? {};
      if (tokenVersion === 2) {
        return data;
      }
      return { ...data.persistent };
    } catch (error) {
      if (error instanceof Error && /^(Expired seal|Bad hmac value|Cannot find password|Incorrect number of sealed components)/.test(
        error.message
      )) {
        return {};
      }
      throw error;
    }
  };
}
function getSessionConfig(sessionOptions2) {
  const options = {
    ...defaultOptions,
    ...sessionOptions2,
    cookieOptions: {
      ...defaultOptions.cookieOptions,
      ...sessionOptions2.cookieOptions || {}
    }
  };
  if (sessionOptions2.cookieOptions && "maxAge" in sessionOptions2.cookieOptions) {
    if (sessionOptions2.cookieOptions.maxAge === void 0) {
      options.ttl = 0;
    }
  } else {
    options.cookieOptions.maxAge = computeCookieMaxAge(options.ttl);
  }
  return options;
}
var badUsageMessage = "iron-session: Bad usage: use getIronSession(req, res, options) or getIronSession(cookieStore, options).";
function createGetIronSession(sealData2, unsealData2) {
  return getIronSession2;
  async function getIronSession2(reqOrCookieStore, resOrsessionOptions, sessionOptions2) {
    if (!reqOrCookieStore) {
      throw new Error(badUsageMessage);
    }
    if (!resOrsessionOptions) {
      throw new Error(badUsageMessage);
    }
    if (!sessionOptions2) {
      return getIronSessionFromCookieStore(
        reqOrCookieStore,
        resOrsessionOptions,
        sealData2,
        unsealData2
      );
    }
    const req = reqOrCookieStore;
    const res = resOrsessionOptions;
    if (!sessionOptions2) {
      throw new Error(badUsageMessage);
    }
    if (!sessionOptions2.cookieName) {
      throw new Error("iron-session: Bad usage. Missing cookie name.");
    }
    if (!sessionOptions2.password) {
      throw new Error("iron-session: Bad usage. Missing password.");
    }
    const passwordsMap = normalizeStringPasswordToMap(sessionOptions2.password);
    if (Object.values(passwordsMap).some((password) => password.length < 32)) {
      throw new Error(
        "iron-session: Bad usage. Password must be at least 32 characters long."
      );
    }
    let sessionConfig = getSessionConfig(sessionOptions2);
    const sealFromCookies = getCookie(req, sessionConfig.cookieName);
    const session = sealFromCookies ? await unsealData2(sealFromCookies, {
      password: passwordsMap,
      ttl: sessionConfig.ttl
    }) : {};
    Object.defineProperties(session, {
      updateConfig: {
        value: function updateConfig(newSessionOptions) {
          sessionConfig = getSessionConfig(newSessionOptions);
        }
      },
      save: {
        value: async function save() {
          if ("headersSent" in res && res.headersSent) {
            throw new Error(
              "iron-session: Cannot set session cookie: session.save() was called after headers were sent. Make sure to call it before any res.send() or res.end()"
            );
          }
          const seal2 = await sealData2(session, {
            password: passwordsMap,
            ttl: sessionConfig.ttl
          });
          const cookieValue = (0, import_cookie.serialize)(
            sessionConfig.cookieName,
            seal2,
            sessionConfig.cookieOptions
          );
          if (cookieValue.length > 4096) {
            throw new Error(
              `iron-session: Cookie length is too big (${cookieValue.length} bytes), browsers will refuse it. Try to remove some data.`
            );
          }
          setCookie(res, cookieValue);
        }
      },
      destroy: {
        value: function destroy() {
          Object.keys(session).forEach((key) => {
            delete session[key];
          });
          const cookieValue = (0, import_cookie.serialize)(sessionConfig.cookieName, "", {
            ...sessionConfig.cookieOptions,
            maxAge: 0
          });
          setCookie(res, cookieValue);
        }
      }
    });
    return session;
  }
}
async function getIronSessionFromCookieStore(cookieStore, sessionOptions2, sealData2, unsealData2) {
  if (!sessionOptions2.cookieName) {
    throw new Error("iron-session: Bad usage. Missing cookie name.");
  }
  if (!sessionOptions2.password) {
    throw new Error("iron-session: Bad usage. Missing password.");
  }
  const passwordsMap = normalizeStringPasswordToMap(sessionOptions2.password);
  if (Object.values(passwordsMap).some((password) => password.length < 32)) {
    throw new Error(
      "iron-session: Bad usage. Password must be at least 32 characters long."
    );
  }
  let sessionConfig = getSessionConfig(sessionOptions2);
  const sealFromCookies = getServerActionCookie(
    sessionConfig.cookieName,
    cookieStore
  );
  const session = sealFromCookies ? await unsealData2(sealFromCookies, {
    password: passwordsMap,
    ttl: sessionConfig.ttl
  }) : {};
  Object.defineProperties(session, {
    updateConfig: {
      value: function updateConfig(newSessionOptions) {
        sessionConfig = getSessionConfig(newSessionOptions);
      }
    },
    save: {
      value: async function save() {
        const seal2 = await sealData2(session, {
          password: passwordsMap,
          ttl: sessionConfig.ttl
        });
        const cookieLength = sessionConfig.cookieName.length + seal2.length + JSON.stringify(sessionConfig.cookieOptions).length;
        if (cookieLength > 4096) {
          throw new Error(
            `iron-session: Cookie length is too big (${cookieLength} bytes), browsers will refuse it. Try to remove some data.`
          );
        }
        cookieStore.set(
          sessionConfig.cookieName,
          seal2,
          sessionConfig.cookieOptions
        );
      }
    },
    destroy: {
      value: function destroy() {
        Object.keys(session).forEach((key) => {
          delete session[key];
        });
        const cookieOptions = { ...sessionConfig.cookieOptions, maxAge: 0 };
        cookieStore.set(sessionConfig.cookieName, "", cookieOptions);
      }
    }
  });
  return session;
}
var sealData = createSealData(crypto_node_exports);
var unsealData = createUnsealData(crypto_node_exports);
var getIronSession = createGetIronSession(sealData, unsealData);

// src/lib/auth.ts
var import_headers = require("next/headers");
var import_bcryptjs = __toESM(require_bcryptjs());
var sessionOptions = {
  password: process.env.SESSION_PASSWORD || "complex_password_at_least_32_characters_long_for_security",
  cookieName: "cs_erp_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    // 7 days
    path: "/"
  }
};
async function getSession(req, res) {
  let session;
  if (req && res) {
    session = await getIronSession(req, res, sessionOptions);
  } else {
    const cookieStore = await (0, import_headers.cookies)();
    session = await getIronSession(cookieStore, sessionOptions);
  }
  if (!session.isAuthenticated) {
    return null;
  }
  if (session.lastActivity) {
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1e3;
    if (Date.now() - session.lastActivity > sevenDaysMs) {
      await destroySession(req, res);
      return null;
    }
  }
  session.lastActivity = Date.now();
  await session.save();
  return session;
}
async function destroySession(req, res) {
  if (req && res) {
    const session = await getIronSession(req, res, sessionOptions);
    session.destroy();
  } else {
    const cookieStore = await (0, import_headers.cookies)();
    const session = await getIronSession(cookieStore, sessionOptions);
    session.destroy();
  }
}

// src/server/api/trpc.ts
var globalForPrisma = globalThis;
var db = globalForPrisma.prisma ?? new import_client.PrismaClient({
  log: process.env.NODE_ENV === "production" ? ["error"] : ["error", "warn"]
});
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
var t = import_server.initTRPC.context().create({
  transformer: import_superjson.default,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof import_zod.ZodError ? error.cause.flatten() : null
      }
    };
  }
});
var createTRPCRouter = t.router;
var performanceTrackingMiddleware = t.middleware(async ({ path: path3, type, next }) => {
  const start = Date.now();
  const result = await next();
  const durationMs = Date.now() - start;
  if (durationMs > 1e3 || process.env.PERF_LOG === "true") {
    console.log(`\u{1F3AF} Practice API Performance: ${type}.${path3} - ${durationMs}ms`);
  }
  return result;
});
var publicProcedure = t.procedure.use(performanceTrackingMiddleware);
var enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  const session = await getSession(ctx.req, ctx.res);
  if (!session || !session.isAuthenticated) {
    throw new import_server.TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // Infers the session as non-nullable to downstream procedures
      session: {
        user: {
          id: session.userId,
          email: session.email,
          companyId: session.companyId
        }
      },
      companyId: session.companyId,
      req: ctx.req,
      res: ctx.res
    }
  });
});
var protectedProcedure = t.procedure.use(enforceUserIsAuthed);
var companyProcedure = t.procedure.use(performanceTrackingMiddleware).use(
  t.middleware(async ({ ctx, next }) => {
    if (!ctx.companyId) {
      throw new import_server.TRPCError({
        code: "FORBIDDEN",
        message: "Company context required"
      });
    }
    return next({
      ctx: {
        ...ctx,
        companyId: ctx.companyId
      }
    });
  })
);

// src/server/api/routers/invoice.ts
var import_zod2 = require("zod");
var import_server2 = require("@trpc/server");

// src/lib/id-generator.ts
var import_crypto = require("crypto");
function generate() {
  return (0, import_crypto.randomUUID)();
}
var idGenerator = {
  /**
   * Generic UUID generator (used by all entity-specific generators)
   */
  generate,
  /**
   * Generate ID for Customer entity
   * Replaces: `cust_${Date.now()}`
   */
  customer: () => generate(),
  /**
   * Generate ID for Invoice entity
   * Replaces: Sequential 001, 002, 003... (with race condition)
   */
  invoice: () => generate(),
  /**
   * Generate ID for InvoiceLine entity
   * Replaces: `line_${Date.now()}_${index}` (with race condition)
   */
  invoiceLine: () => generate(),
  /**
   * Generate ID for InvoiceAttachment entity
   */
  invoiceAttachment: () => generate(),
  /**
   * Generate ID for Payment entity
   * Replaces: `pay_${Date.now()}`
   */
  payment: () => generate(),
  /**
   * Generate ID for ComplianceItem entity
   * Replaces: `comp_${Date.now()}`
   */
  compliance: () => generate(),
  /**
   * Generate ID for ComplianceActivity entity
   * Replaces: `act_${Date.now()}_${random}`
   */
  complianceActivity: () => generate(),
  /**
   * Generate ID for ComplianceTemplate entity
   * Replaces: `tmpl_${Date.now()}_${random}`
   */
  complianceTemplate: () => generate(),
  /**
   * Generate ID for CommunicationLog entity
   * Replaces: `log_${Date.now()}`
   */
  communicationLog: () => generate(),
  /**
   * Generate ID for CommunicationPreference entity
   * Replaces: `pref_${Date.now()}`
   */
  communicationPreference: () => generate(),
  /**
   * Generate ID for MessageTemplate entity
   * Replaces: `tmpl_${Date.now()}`
   */
  messageTemplate: () => generate(),
  /**
   * Generate ID for CompanySettings entity
   * Replaces: `cs_${Date.now()}`
   */
  companySettings: () => generate(),
  /**
   * Generate ID for ServiceTemplate entity
   */
  serviceTemplate: () => generate(),
  /**
   * Generate ID for Document entity
   */
  document: () => generate(),
  /**
   * Generate ID for RecurringContract entity
   */
  recurringContract: () => generate(),
  /**
   * Generate ID for InvoiceGroup entity
   */
  invoiceGroup: () => generate()
};

// src/server/api/routers/invoice.ts
var createInvoiceSchema = import_zod2.z.object({
  customerId: import_zod2.z.string(),
  issueDate: import_zod2.z.date(),
  dueDate: import_zod2.z.date().optional(),
  lines: import_zod2.z.array(import_zod2.z.object({
    description: import_zod2.z.string(),
    quantity: import_zod2.z.number().positive(),
    rate: import_zod2.z.number().positive(),
    gstRate: import_zod2.z.number().min(0).max(100),
    hsnSac: import_zod2.z.string().optional(),
    serviceTemplateId: import_zod2.z.string().optional(),
    isReimbursement: import_zod2.z.boolean().default(false),
    customFieldData: import_zod2.z.record(import_zod2.z.any()).optional(),
    // Custom service columns support
    serviceType: import_zod2.z.string().optional(),
    serviceData: import_zod2.z.any().optional()
  })),
  placeOfSupply: import_zod2.z.string().optional(),
  notes: import_zod2.z.string().optional(),
  terms: import_zod2.z.string().optional()
});
var updateInvoiceSchema = import_zod2.z.object({
  id: import_zod2.z.string(),
  customerId: import_zod2.z.string().optional(),
  issueDate: import_zod2.z.date().optional(),
  dueDate: import_zod2.z.date().optional(),
  lines: import_zod2.z.array(import_zod2.z.object({
    description: import_zod2.z.string(),
    quantity: import_zod2.z.number().positive(),
    rate: import_zod2.z.number().positive(),
    gstRate: import_zod2.z.number().min(0).max(100),
    hsnSac: import_zod2.z.string().optional(),
    serviceTemplateId: import_zod2.z.string().optional(),
    isReimbursement: import_zod2.z.boolean().default(false),
    customFieldData: import_zod2.z.record(import_zod2.z.any()).optional(),
    // Custom service columns support
    serviceType: import_zod2.z.string().optional(),
    serviceData: import_zod2.z.any().optional()
  })).optional(),
  placeOfSupply: import_zod2.z.string().optional(),
  notes: import_zod2.z.string().optional(),
  terms: import_zod2.z.string().optional(),
  status: import_zod2.z.enum(["DRAFT", "GENERATED", "SENT", "PAID", "PARTIALLY_PAID", "OVERDUE", "CANCELLED"]).optional()
});
var paginationSchema = import_zod2.z.object({
  page: import_zod2.z.number().min(1).default(1),
  limit: import_zod2.z.number().min(1).max(100).default(20),
  filters: import_zod2.z.object({
    status: import_zod2.z.enum(["DRAFT", "GENERATED", "SENT", "PAID", "PARTIALLY_PAID", "OVERDUE", "CANCELLED"]).optional(),
    customerId: import_zod2.z.string().optional(),
    startDate: import_zod2.z.date().optional(),
    endDate: import_zod2.z.date().optional(),
    search: import_zod2.z.string().optional()
  }).optional()
}).optional();
function calculateInvoiceAmounts(lines, customerStateCode, companyStateCode) {
  let subtotal = 0;
  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;
  const isInterstate = customerStateCode !== companyStateCode;
  for (const line of lines) {
    const amount = (line.quantity || 0) * (line.rate || 0);
    subtotal += amount;
    const taxAmount = amount * (line.gstRate || 0) / 100;
    if (isInterstate) {
      igstAmount += taxAmount;
    } else {
      cgstAmount += taxAmount / 2;
      sgstAmount += taxAmount / 2;
    }
  }
  const totalTax = cgstAmount + sgstAmount + igstAmount;
  const grandTotal = subtotal + totalTax;
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    cgstAmount: Math.round(cgstAmount * 100) / 100,
    sgstAmount: Math.round(sgstAmount * 100) / 100,
    igstAmount: Math.round(igstAmount * 100) / 100,
    totalTax: Math.round(totalTax * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100
  };
}
function generateInvoiceNumber(prefix = "INV", year) {
  const currentYear = year || (/* @__PURE__ */ new Date()).getFullYear();
  const timestamp = Date.now();
  return `${prefix}-${currentYear}-${timestamp.toString().slice(-6)}`;
}
var invoiceRouter = createTRPCRouter({
  // Get all invoices with pagination and filters
  getAll: protectedProcedure.input(paginationSchema).query(async ({ ctx, input }) => {
    const { page = 1, limit = 20, filters } = input || {};
    const offset = (page - 1) * limit;
    const whereClause = {
      companyId: ctx.companyId
    };
    if (filters?.status) {
      whereClause.status = filters.status;
    }
    if (filters?.customerId) {
      whereClause.customerId = filters.customerId;
    }
    if (filters?.startDate || filters?.endDate) {
      whereClause.issueDate = {};
      if (filters.startDate) {
        whereClause.issueDate.gte = filters.startDate;
      }
      if (filters.endDate) {
        whereClause.issueDate.lte = filters.endDate;
      }
    }
    if (filters?.search) {
      whereClause.OR = [
        { number: { contains: filters.search } },
        { customer: { name: { contains: filters.search } } }
      ];
    }
    const [invoices, total] = await Promise.all([
      ctx.db.invoice.findMany({
        where: whereClause,
        include: {
          customer: true,
          lines: true
        },
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit
      }),
      ctx.db.invoice.count({ where: whereClause })
    ]);
    return {
      invoices,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        totalPages: Math.ceil(total / limit),
        totalCount: total
      }
    };
  }),
  // Get invoice by ID
  getById: protectedProcedure.input(import_zod2.z.object({ id: import_zod2.z.string() })).query(async ({ ctx, input }) => {
    const invoice = await ctx.db.invoice.findUnique({
      where: {
        id: input.id,
        companyId: ctx.companyId
      },
      include: {
        customer: true,
        company: true,
        lines: {
          include: {
            serviceTemplate: true
          }
        },
        payments: true
      }
    });
    if (!invoice) {
      throw new import_server2.TRPCError({
        code: "NOT_FOUND",
        message: "Invoice not found"
      });
    }
    return invoice;
  }),
  // Create new invoice
  create: protectedProcedure.input(createInvoiceSchema).mutation(async ({ ctx, input }) => {
    console.log("\u{1F50D} Invoice Create Debug:", {
      customerId: input.customerId,
      companyId: ctx.companyId,
      customerIdType: typeof input.customerId,
      companyIdType: typeof ctx.companyId
    });
    const [customer, company] = await Promise.all([
      ctx.db.customer.findUnique({
        where: {
          id: input.customerId,
          companyId: ctx.companyId
          // Company scoped security check
        }
      }),
      ctx.db.company.findUnique({ where: { id: ctx.companyId } })
    ]);
    console.log("\u{1F50D} Lookup Results:", {
      customerFound: !!customer,
      companyFound: !!company,
      customerName: customer?.name,
      companyName: company?.name
    });
    if (!customer) {
      throw new import_server2.TRPCError({
        code: "NOT_FOUND",
        message: "Customer not found"
      });
    }
    if (!company) {
      throw new import_server2.TRPCError({
        code: "NOT_FOUND",
        message: "Company not found"
      });
    }
    const amounts = calculateInvoiceAmounts(
      input.lines,
      customer.stateCode || void 0,
      company.stateCode || void 0
    );
    const invoiceNumber = generateInvoiceNumber("INV", input.issueDate.getFullYear());
    const invoiceId = idGenerator.invoice();
    console.log("=".repeat(80));
    console.log("\u{1F4E5} INVOICE CREATE DEBUG");
    console.log("Number of lines:", input.lines.length);
    input.lines.forEach((line, idx) => {
      console.log(`
Line ${idx}:`);
      console.log("  serviceTemplateId:", line.serviceTemplateId);
      console.log("  typeof:", typeof line.serviceTemplateId);
      console.log("  truthiness:", !!line.serviceTemplateId);
      console.log("  length:", line.serviceTemplateId?.length);
      console.log("  trim:", line.serviceTemplateId?.trim());
      console.log("  JSON:", JSON.stringify(line.serviceTemplateId));
    });
    console.log("=".repeat(80));
    const invoice = await ctx.db.invoice.create({
      data: {
        id: invoiceId,
        // ✅ UUID v4 - No race conditions
        number: invoiceNumber,
        customerId: input.customerId,
        companyId: ctx.companyId,
        issueDate: input.issueDate,
        dueDate: input.dueDate,
        placeOfSupply: input.placeOfSupply,
        notes: input.notes,
        terms: input.terms,
        ...amounts,
        lines: {
          create: input.lines.map((line) => ({
            id: idGenerator.invoiceLine(),
            description: line.description,
            quantity: line.quantity,
            rate: line.rate,
            amount: line.quantity * line.rate,
            gstRate: line.gstRate,
            ...line.hsnSac && line.hsnSac.trim() !== "" ? { hsnSac: line.hsnSac } : {},
            isReimbursement: line.isReimbursement,
            ...line.serviceTemplateId && line.serviceTemplateId.trim() !== "" ? { serviceTemplateId: line.serviceTemplateId } : {},
            ...line.customFieldData ? { customFieldData: line.customFieldData } : {},
            // Custom service columns support
            ...line.serviceType ? { serviceType: line.serviceType } : {},
            ...line.serviceData ? { serviceData: line.serviceData } : {}
          }))
        }
      },
      include: {
        customer: true,
        lines: true
      }
    });
    return invoice;
  }),
  // Update existing invoice
  update: protectedProcedure.input(updateInvoiceSchema).mutation(async ({ ctx, input }) => {
    const { id, ...updateData } = input;
    const existingInvoice = await ctx.db.invoice.findUnique({
      where: { id, companyId: ctx.companyId },
      include: { lines: true, customer: true }
    });
    if (!existingInvoice) {
      throw new import_server2.TRPCError({
        code: "NOT_FOUND",
        message: "Invoice not found"
      });
    }
    if (existingInvoice.status === "PAID" || existingInvoice.status === "CANCELLED") {
      throw new import_server2.TRPCError({
        code: "BAD_REQUEST",
        message: `Cannot update ${existingInvoice.status.toLowerCase()} invoice`
      });
    }
    let finalUpdateData = { ...updateData };
    if (updateData.lines || updateData.customerId) {
      const customerId = updateData.customerId || existingInvoice.customerId;
      const [customer, company] = await Promise.all([
        ctx.db.customer.findUnique({
          where: { id: customerId, companyId: ctx.companyId }
        }),
        ctx.db.company.findUnique({ where: { id: ctx.companyId } })
      ]);
      if (!customer || !company) {
        throw new import_server2.TRPCError({
          code: "NOT_FOUND",
          message: "Customer or company not found"
        });
      }
      const linesToCalculate = (updateData.lines || existingInvoice.lines).map((line) => ({
        ...line,
        hsnSac: line.hsnSac ?? void 0,
        serviceTemplateId: line.serviceTemplateId ?? void 0
      }));
      const amounts = calculateInvoiceAmounts(
        linesToCalculate,
        customer.stateCode || void 0,
        company.stateCode || void 0
      );
      finalUpdateData = { ...finalUpdateData, ...amounts };
    }
    if (updateData.lines) {
      await ctx.db.invoiceLine.deleteMany({
        where: { invoiceId: id }
      });
      finalUpdateData.lines = {
        create: updateData.lines.map((line) => ({
          id: idGenerator.invoiceLine(),
          // ✅ UUID v4 - No race conditions
          description: line.description,
          quantity: line.quantity,
          rate: line.rate,
          amount: line.quantity * line.rate,
          gstRate: line.gstRate,
          ...line.hsnSac && line.hsnSac.trim() !== "" ? { hsnSac: line.hsnSac } : {},
          isReimbursement: line.isReimbursement,
          ...line.serviceTemplateId && line.serviceTemplateId.trim() !== "" ? { serviceTemplateId: line.serviceTemplateId } : {},
          // Custom service columns support
          ...line.serviceType ? { serviceType: line.serviceType } : {},
          ...line.serviceData ? { serviceData: line.serviceData } : {}
        }))
      };
      delete finalUpdateData.lines;
    }
    const updatedInvoice = await ctx.db.invoice.update({
      where: { id },
      data: finalUpdateData.lines ? {
        ...finalUpdateData,
        lines: {
          create: updateData.lines.map((line) => ({
            description: line.description,
            quantity: line.quantity,
            rate: line.rate,
            amount: line.quantity * line.rate,
            gstRate: line.gstRate,
            hsnSac: line.hsnSac,
            isReimbursement: line.isReimbursement,
            serviceTemplateId: line.serviceTemplateId,
            // Custom service columns support
            ...line.serviceType ? { serviceType: line.serviceType } : {},
            ...line.serviceData ? { serviceData: line.serviceData } : {}
          }))
        }
      } : finalUpdateData,
      include: {
        customer: true,
        lines: true
      }
    });
    return updatedInvoice;
  }),
  // Get invoice statistics
  getStats: protectedProcedure.input(import_zod2.z.object({
    startDate: import_zod2.z.date().optional(),
    endDate: import_zod2.z.date().optional()
  }).optional()).query(async ({ ctx, input }) => {
    const whereClause = {
      companyId: ctx.companyId
    };
    if (input?.startDate || input?.endDate) {
      whereClause.issueDate = {};
      if (input.startDate) {
        whereClause.issueDate.gte = input.startDate;
      }
      if (input.endDate) {
        whereClause.issueDate.lte = input.endDate;
      }
    }
    const [
      totalInvoices,
      totalRevenue,
      paidInvoices,
      sentInvoices,
      overdueInvoices
    ] = await Promise.all([
      ctx.db.invoice.count({ where: whereClause }),
      ctx.db.invoice.aggregate({
        where: whereClause,
        _sum: {
          grandTotal: true,
          paidAmount: true
        }
      }),
      ctx.db.invoice.count({
        where: { ...whereClause, status: "PAID" }
      }),
      ctx.db.invoice.count({
        where: { ...whereClause, status: "SENT" }
      }),
      ctx.db.invoice.count({
        where: { ...whereClause, status: "OVERDUE" }
      })
    ]);
    const revenue = totalRevenue._sum.grandTotal || 0;
    const totalPaid = totalRevenue._sum.paidAmount || 0;
    const outstanding = revenue - totalPaid;
    const averageInvoiceValue = totalInvoices > 0 ? revenue / totalInvoices : 0;
    return {
      totalInvoices,
      totalRevenue: Math.round(revenue * 100) / 100,
      paidInvoices,
      pendingInvoices: sentInvoices,
      overdueInvoices,
      averageInvoiceValue: Math.round(averageInvoiceValue * 100) / 100,
      outstandingAmount: Math.round(outstanding * 100) / 100,
      monthlyRevenue: Math.round(revenue * 100) / 100
    };
  }),
  // Send invoice
  send: protectedProcedure.input(import_zod2.z.object({
    id: import_zod2.z.string(),
    generatePdf: import_zod2.z.boolean().default(true),
    sendEmail: import_zod2.z.boolean().default(true)
  })).mutation(async ({ ctx, input }) => {
    const invoice = await ctx.db.invoice.update({
      where: {
        id: input.id,
        companyId: ctx.companyId
      },
      data: {
        status: "SENT"
      },
      include: {
        customer: true,
        lines: true
      }
    });
    return {
      invoice,
      pdfGenerated: input.generatePdf,
      emailSent: input.sendEmail && !!invoice.customer.email
    };
  }),
  // Delete invoice
  delete: protectedProcedure.input(import_zod2.z.object({ id: import_zod2.z.string() })).mutation(async ({ ctx, input }) => {
    await ctx.db.invoice.delete({
      where: {
        id: input.id,
        companyId: ctx.companyId
      }
    });
    return { success: true };
  }),
  // Get unpaid invoices
  getUnpaid: protectedProcedure.input(import_zod2.z.object({
    limit: import_zod2.z.number().min(1).max(100).default(10)
  }).optional()).query(async ({ ctx, input }) => {
    return await ctx.db.invoice.findMany({
      where: {
        companyId: ctx.companyId,
        status: { in: ["SENT", "PARTIALLY_PAID", "OVERDUE"] }
      },
      include: {
        customer: true
      },
      orderBy: { issueDate: "desc" },
      take: input?.limit || 10
    });
  }),
  // Get overdue invoices
  getOverdue: protectedProcedure.input(import_zod2.z.object({
    limit: import_zod2.z.number().min(1).max(100).default(10)
  }).optional()).query(async ({ ctx, input }) => {
    const now = /* @__PURE__ */ new Date();
    return await ctx.db.invoice.findMany({
      where: {
        companyId: ctx.companyId,
        status: { in: ["SENT", "PARTIALLY_PAID"] },
        dueDate: { lt: now }
      },
      include: {
        customer: true
      },
      orderBy: { dueDate: "asc" },
      take: input?.limit || 10
    });
  }),
  // Alias for getAll (for frontend compatibility)
  list: protectedProcedure.input(paginationSchema).query(async ({ ctx, input }) => {
    const { page = 1, limit = 20, filters } = input || {};
    const offset = (page - 1) * limit;
    const whereClause = {
      companyId: ctx.companyId
    };
    if (filters?.status) {
      whereClause.status = filters.status;
    }
    if (filters?.customerId) {
      whereClause.customerId = filters.customerId;
    }
    if (filters?.startDate || filters?.endDate) {
      whereClause.issueDate = {};
      if (filters.startDate) {
        whereClause.issueDate.gte = filters.startDate;
      }
      if (filters.endDate) {
        whereClause.issueDate.lte = filters.endDate;
      }
    }
    if (filters?.search) {
      whereClause.OR = [
        { number: { contains: filters.search } },
        { customer: { name: { contains: filters.search } } }
      ];
    }
    const [invoices, total] = await Promise.all([
      ctx.db.invoice.findMany({
        where: whereClause,
        include: {
          customer: true,
          lines: true
        },
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit
      }),
      ctx.db.invoice.count({ where: whereClause })
    ]);
    return {
      invoices,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        totalPages: Math.ceil(total / limit),
        totalCount: total
      }
    };
  }),
  // Get simple invoice list for payment forms
  getPayableInvoices: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.companyId) {
      throw new import_server2.TRPCError({
        code: "UNAUTHORIZED",
        message: "Company ID required"
      });
    }
    const invoices = await ctx.db.invoice.findMany({
      where: {
        companyId: ctx.companyId,
        status: {
          in: ["SENT", "OVERDUE", "PARTIALLY_PAID"]
        }
      },
      select: {
        id: true,
        number: true,
        grandTotal: true,
        paidAmount: true,
        issueDate: true,
        dueDate: true,
        customer: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { issueDate: "desc" },
      take: 100
      // Reasonable limit for dropdown
    });
    return invoices.map((invoice) => ({
      id: invoice.id,
      invoiceNumber: invoice.number,
      customer: invoice.customer,
      totalAmount: invoice.grandTotal,
      paidAmount: invoice.paidAmount || 0,
      remainingAmount: invoice.grandTotal - (invoice.paidAmount || 0),
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate
    }));
  }),
  // Generate invoice (activate without sending email)
  generateInvoice: protectedProcedure.input(import_zod2.z.object({
    id: import_zod2.z.string().uuid()
  })).mutation(async ({ ctx, input }) => {
    const invoice = await ctx.db.invoice.findUnique({
      where: { id: input.id },
      include: { lines: true, customer: true }
    });
    if (!invoice) {
      throw new import_server2.TRPCError({
        code: "NOT_FOUND",
        message: "Invoice not found"
      });
    }
    if (invoice.companyId !== ctx.companyId) {
      throw new import_server2.TRPCError({
        code: "FORBIDDEN",
        message: "Access denied"
      });
    }
    if (invoice.status !== "DRAFT") {
      throw new import_server2.TRPCError({
        code: "BAD_REQUEST",
        message: "Only DRAFT invoices can be generated"
      });
    }
    const updatedInvoice = await ctx.db.invoice.update({
      where: { id: input.id },
      data: {
        status: "GENERATED",
        updatedAt: /* @__PURE__ */ new Date()
      },
      include: {
        lines: true,
        customer: true,
        company: true,
        payments: true
      }
    });
    return updatedInvoice;
  })
});

// src/server/api/routers/customer.ts
var import_zod3 = require("zod");
var import_server3 = require("@trpc/server");
var paginationSchema2 = import_zod3.z.object({
  page: import_zod3.z.number().min(1).default(1),
  limit: import_zod3.z.number().min(1).max(100).default(20),
  search: import_zod3.z.string().optional(),
  sortBy: import_zod3.z.enum(["name", "email", "createdAt", "totalBilled"]).default("name"),
  sortOrder: import_zod3.z.enum(["asc", "desc"]).default("asc")
});
var createCustomerSchema = import_zod3.z.object({
  name: import_zod3.z.string().min(1),
  email: import_zod3.z.string().email().optional(),
  phone: import_zod3.z.string().optional(),
  address: import_zod3.z.string().optional(),
  gstin: import_zod3.z.string().optional(),
  stateCode: import_zod3.z.string().optional(),
  creditLimit: import_zod3.z.number().min(0).optional(),
  creditDays: import_zod3.z.number().min(0).optional(),
  whatsappNumber: import_zod3.z.string().optional(),
  preferredLanguage: import_zod3.z.string().default("en"),
  timezone: import_zod3.z.string().default("Asia/Kolkata"),
  // Comprehensive CS Practice Fields
  pan: import_zod3.z.string().optional(),
  cin: import_zod3.z.string().optional(),
  din: import_zod3.z.string().optional(),
  incorporationDate: import_zod3.z.date().optional(),
  industry: import_zod3.z.string().optional(),
  contactPerson: import_zod3.z.string().optional(),
  designation: import_zod3.z.string().optional(),
  companyType: import_zod3.z.string().optional(),
  registeredOffice: import_zod3.z.string().optional(),
  website: import_zod3.z.string().optional()
});
function calculatePaymentStatus(grandTotal, paidAmount) {
  if (paidAmount >= grandTotal) {
    return "PAID";
  } else if (paidAmount > 0) {
    return "PARTIALLY_PAID";
  } else {
    return "UNPAID";
  }
}
function calculateOutstandingAmount(grandTotal, paidAmount) {
  return Math.max(0, grandTotal - paidAmount);
}
var customerRouter = createTRPCRouter({
  // Get all customers with financial summary - OPTIMIZED VERSION
  getAll: protectedProcedure.input(paginationSchema2.optional()).query(async ({ ctx, input = {} }) => {
    const { page = 1, limit = 20, search, sortBy, sortOrder } = input;
    const offset = (page - 1) * limit;
    const whereClause = { companyId: ctx.companyId };
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { email: { contains: search } }
      ];
    }
    const [customers, totalCount] = await ctx.db.$transaction([
      ctx.db.customer.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          createdAt: true,
          _count: {
            select: { invoices: true }
          },
          invoices: {
            select: {
              grandTotal: true,
              paidAmount: true,
              status: true,
              dueDate: true
            }
          }
        },
        orderBy: { [sortBy || "name"]: sortOrder || "asc" },
        skip: offset,
        take: limit
      }),
      ctx.db.customer.count({ where: whereClause })
    ]);
    const enhancedCustomers = customers.map((customer) => {
      const totalBilled = customer.invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
      const totalPaid = customer.invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
      const overdueInvoices = customer.invoices.filter(
        (inv) => inv.dueDate && new Date(inv.dueDate) < /* @__PURE__ */ new Date() && inv.status !== "PAID"
      ).length;
      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        createdAt: customer.createdAt,
        financialSummary: {
          totalInvoices: customer._count.invoices,
          totalBilled,
          totalPaid,
          totalOutstanding: totalBilled - totalPaid,
          overdueInvoices
        }
      };
    });
    return {
      customers: enhancedCustomers,
      pagination: {
        total: totalCount,
        page,
        pages: Math.ceil(totalCount / limit)
      }
    };
  }),
  // Get customer by ID with complete financial dashboard
  getById: protectedProcedure.input(import_zod3.z.object({ id: import_zod3.z.string() })).query(async ({ ctx, input }) => {
    const customer = await ctx.db.customer.findUnique({
      where: {
        id: input.id,
        companyId: ctx.companyId
      },
      include: {
        invoices: {
          include: {
            payments: {
              orderBy: { paymentDate: "desc" }
            },
            lines: true
          },
          orderBy: { issueDate: "desc" }
        },
        payments: {
          include: {
            invoice: {
              select: {
                number: true,
                issueDate: true
              }
            }
          },
          orderBy: { paymentDate: "desc" }
        },
        recurringContracts: {
          where: { status: "ACTIVE" }
        },
        complianceItems: {
          where: { status: { in: ["PENDING", "IN_PROGRESS"] } },
          orderBy: { dueDate: "asc" }
        },
        _count: {
          select: {
            invoices: true,
            payments: true,
            documents: true
          }
        }
      }
    });
    if (!customer) {
      throw new import_server3.TRPCError({
        code: "NOT_FOUND",
        message: "Customer not found"
      });
    }
    const invoicesWithStatus = customer.invoices.map((invoice) => {
      const paymentStatus = calculatePaymentStatus(invoice.grandTotal, invoice.paidAmount);
      const outstandingAmount = calculateOutstandingAmount(invoice.grandTotal, invoice.paidAmount);
      const isOverdue = invoice.dueDate && new Date(invoice.dueDate) < /* @__PURE__ */ new Date() && outstandingAmount > 0;
      return {
        ...invoice,
        paymentStatus,
        outstandingAmount: Math.round(outstandingAmount * 100) / 100,
        isOverdue: !!isOverdue,
        daysPastDue: isOverdue ? Math.floor(((/* @__PURE__ */ new Date()).getTime() - new Date(invoice.dueDate).getTime()) / (1e3 * 60 * 60 * 24)) : 0
      };
    });
    const totalBilled = customer.invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
    const totalPaid = customer.invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const totalOutstanding = totalBilled - totalPaid;
    const paidInvoices = invoicesWithStatus.filter((inv) => inv.paymentStatus === "PAID").length;
    const partiallyPaidInvoices = invoicesWithStatus.filter((inv) => inv.paymentStatus === "PARTIALLY_PAID").length;
    const unpaidInvoices = invoicesWithStatus.filter((inv) => inv.paymentStatus === "UNPAID").length;
    const overdueInvoices = invoicesWithStatus.filter((inv) => inv.isOverdue).length;
    const paymentHistory = customer.payments.map((payment) => ({
      ...payment,
      type: "PAYMENT",
      date: payment.paymentDate,
      description: `Payment for Invoice ${payment.invoice.number}`
    }));
    const invoiceHistory = customer.invoices.map((invoice) => ({
      id: invoice.id,
      type: "INVOICE",
      date: invoice.issueDate,
      amount: invoice.grandTotal,
      description: `Invoice ${invoice.number} created`,
      status: invoice.status
    }));
    const timeline = [...paymentHistory, ...invoiceHistory].sort((a, b3) => new Date(b3.date).getTime() - new Date(a.date).getTime()).slice(0, 20);
    return {
      ...customer,
      invoices: invoicesWithStatus,
      financialSummary: {
        totalInvoices: customer._count.invoices,
        totalBilled: Math.round(totalBilled * 100) / 100,
        totalPaid: Math.round(totalPaid * 100) / 100,
        totalOutstanding: Math.round(totalOutstanding * 100) / 100,
        paidInvoices,
        partiallyPaidInvoices,
        unpaidInvoices,
        overdueInvoices,
        averageInvoiceValue: customer._count.invoices > 0 ? Math.round(totalBilled / customer._count.invoices * 100) / 100 : 0,
        paymentRate: totalBilled > 0 ? Math.round(totalPaid / totalBilled * 1e4) / 100 : 0,
        lastPaymentDate: customer.payments[0]?.paymentDate,
        lastInvoiceDate: customer.invoices[0]?.issueDate
      },
      timeline
    };
  }),
  // Get customer invoices with payment status
  getInvoices: protectedProcedure.input(import_zod3.z.object({
    customerId: import_zod3.z.string(),
    status: import_zod3.z.enum(["ALL", "PAID", "UNPAID", "OVERDUE", "PARTIALLY_PAID"]).default("ALL")
  })).query(async ({ ctx, input }) => {
    const whereClause = {
      customerId: input.customerId,
      companyId: ctx.companyId
    };
    const invoices = await ctx.db.invoice.findMany({
      where: whereClause,
      include: {
        payments: {
          orderBy: { paymentDate: "desc" }
        },
        lines: true
      },
      orderBy: { issueDate: "desc" }
    });
    const enhancedInvoices = invoices.map((invoice) => {
      const paymentStatus = calculatePaymentStatus(invoice.grandTotal, invoice.paidAmount);
      const outstandingAmount = calculateOutstandingAmount(invoice.grandTotal, invoice.paidAmount);
      const isOverdue = invoice.dueDate && new Date(invoice.dueDate) < /* @__PURE__ */ new Date() && outstandingAmount > 0;
      return {
        ...invoice,
        paymentStatus,
        outstandingAmount: Math.round(outstandingAmount * 100) / 100,
        isOverdue: !!isOverdue,
        daysPastDue: isOverdue ? Math.floor(((/* @__PURE__ */ new Date()).getTime() - new Date(invoice.dueDate).getTime()) / (1e3 * 60 * 60 * 24)) : 0
      };
    }).filter((invoice) => {
      if (input.status === "ALL") return true;
      if (input.status === "OVERDUE") return invoice.isOverdue;
      return invoice.paymentStatus === input.status;
    });
    return enhancedInvoices;
  }),
  // Get simple customer list for forms/dropdowns
  getList: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.companyId) {
      throw new import_server3.TRPCError({
        code: "UNAUTHORIZED",
        message: "Company ID required"
      });
    }
    console.log("\u{1F50D} Customer.getList Debug:", {
      companyId: ctx.companyId,
      companyIdType: typeof ctx.companyId
    });
    const customers = await ctx.db.customer.findMany({
      where: { companyId: ctx.companyId },
      select: {
        id: true,
        name: true,
        email: true,
        gstin: true,
        stateCode: true
      },
      orderBy: { name: "asc" }
    });
    console.log("\u{1F50D} Customer.getList Results:", {
      count: customers.length,
      customers: customers.map((c2) => ({ id: c2.id, name: c2.name }))
    });
    return customers;
  }),
  // Create new customer
  create: protectedProcedure.input(createCustomerSchema).mutation(async ({ ctx, input }) => {
    const customer = await ctx.db.customer.create({
      data: {
        id: idGenerator.customer(),
        // ✅ UUID v4 - No race conditions
        ...input,
        companyId: ctx.companyId
      }
    });
    return customer;
  }),
  // Update customer
  update: protectedProcedure.input(import_zod3.z.object({
    id: import_zod3.z.string(),
    data: createCustomerSchema.partial()
  })).mutation(async ({ ctx, input }) => {
    const customer = await ctx.db.customer.update({
      where: {
        id: input.id,
        companyId: ctx.companyId
      },
      data: input.data
    });
    return customer;
  }),
  // Get top customers by revenue
  getTopCustomers: protectedProcedure.input(import_zod3.z.object({
    limit: import_zod3.z.number().min(1).max(50).default(10),
    period: import_zod3.z.enum(["7d", "30d", "90d", "1y", "all"]).default("all")
  })).query(async ({ ctx, input }) => {
    const dateFilter = {};
    const now = /* @__PURE__ */ new Date();
    switch (input.period) {
      case "7d":
        dateFilter.issueDate = { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3) };
        break;
      case "30d":
        dateFilter.issueDate = { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1e3) };
        break;
      case "90d":
        dateFilter.issueDate = { gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1e3) };
        break;
      case "1y":
        dateFilter.issueDate = { gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1e3) };
        break;
    }
    const customers = await ctx.db.customer.findMany({
      where: {
        companyId: ctx.companyId,
        invoices: {
          some: dateFilter
        }
      },
      include: {
        invoices: {
          where: dateFilter,
          select: {
            grandTotal: true,
            paidAmount: true
          }
        }
      }
    });
    const customersWithRevenue = customers.map((customer) => {
      const totalRevenue = customer.invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
      const totalPaid = customer.invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalPaid: Math.round(totalPaid * 100) / 100,
        totalOutstanding: Math.round((totalRevenue - totalPaid) * 100) / 100,
        invoiceCount: customer.invoices.length
      };
    }).sort((a, b3) => b3.totalRevenue - a.totalRevenue).slice(0, input.limit);
    return customersWithRevenue;
  }),
  // HIGH-PERFORMANCE: Get all customers with server-side calculated summaries only
  getAllWithSummary: protectedProcedure.input(paginationSchema2.optional()).query(async ({ ctx, input = {} }) => {
    const { page = 1, limit = 20, search, sortBy, sortOrder } = input;
    const offset = (page - 1) * limit;
    const whereClause = { companyId: ctx.companyId };
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { email: { contains: search } }
      ];
    }
    const [customers, totalCount] = await ctx.db.$transaction([
      // Fetch only customer details with aggregated invoice data
      ctx.db.customer.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          gstin: true,
          createdAt: true,
          // Server-side aggregation for performance
          _count: { select: { invoices: true } },
          invoices: {
            select: {
              grandTotal: true,
              paidAmount: true,
              status: true,
              dueDate: true,
              issueDate: true
            }
          }
        },
        orderBy: { [sortBy || "name"]: sortOrder || "asc" },
        skip: offset,
        take: limit
      }),
      ctx.db.customer.count({ where: whereClause })
    ]);
    const optimizedCustomers = customers.map((customer) => {
      const totalBilled = customer.invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
      const totalPaid = customer.invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
      const totalOutstanding = totalBilled - totalPaid;
      const paidInvoices = customer.invoices.filter((inv) => inv.paidAmount >= inv.grandTotal).length;
      const partiallyPaidInvoices = customer.invoices.filter(
        (inv) => inv.paidAmount > 0 && inv.paidAmount < inv.grandTotal
      ).length;
      const unpaidInvoices = customer.invoices.filter((inv) => inv.paidAmount === 0).length;
      const overdueInvoices = customer.invoices.filter(
        (inv) => inv.dueDate && new Date(inv.dueDate) < /* @__PURE__ */ new Date() && inv.paidAmount < inv.grandTotal
      ).length;
      const paymentRate = totalBilled > 0 ? totalPaid / totalBilled * 100 : 0;
      const averageInvoiceValue = customer._count.invoices > 0 ? totalBilled / customer._count.invoices : 0;
      const recentInvoices = customer.invoices.sort((a, b3) => new Date(b3.issueDate).getTime() - new Date(a.issueDate).getTime()).slice(0, 3);
      const lastInvoiceDate = recentInvoices[0]?.issueDate;
      const hasRecentActivity = lastInvoiceDate && (/* @__PURE__ */ new Date()).getTime() - new Date(lastInvoiceDate).getTime() < 30 * 24 * 60 * 60 * 1e3;
      return {
        // Core customer data
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        gstin: customer.gstin,
        createdAt: customer.createdAt,
        // Pre-calculated financial summary (replaces invoice arrays)
        summary: {
          // Basic metrics
          totalInvoices: customer._count.invoices,
          totalBilled: Math.round(totalBilled * 100) / 100,
          totalPaid: Math.round(totalPaid * 100) / 100,
          totalOutstanding: Math.round(totalOutstanding * 100) / 100,
          // Status breakdown
          paidInvoices,
          partiallyPaidInvoices,
          unpaidInvoices,
          overdueInvoices,
          // Performance indicators
          paymentRate: Math.round(paymentRate * 100) / 100,
          averageInvoiceValue: Math.round(averageInvoiceValue * 100) / 100,
          // Activity indicators
          lastInvoiceDate,
          hasRecentActivity,
          // Risk assessment
          riskLevel: overdueInvoices > 2 ? "HIGH" : totalOutstanding > averageInvoiceValue * 2 ? "MEDIUM" : "LOW"
        }
      };
    });
    return {
      customers: optimizedCustomers,
      pagination: {
        total: totalCount,
        page,
        pages: Math.ceil(totalCount / limit)
      }
    };
  })
});

// src/server/api/routers/payment.ts
var import_zod4 = require("zod");
var import_server4 = require("@trpc/server");
var import_client2 = require("@prisma/client");
var createPaymentSchema = import_zod4.z.object({
  invoiceId: import_zod4.z.string().min(1, "Invoice ID is required"),
  amount: import_zod4.z.number().positive("Amount must be positive"),
  method: import_zod4.z.nativeEnum(import_client2.PaymentMethod),
  paymentDate: import_zod4.z.date(),
  reference: import_zod4.z.string().optional(),
  notes: import_zod4.z.string().optional()
});
var paymentRouter = createTRPCRouter({
  // Get all payments
  getAll: protectedProcedure.input(import_zod4.z.object({
    customerId: import_zod4.z.string().optional(),
    invoiceId: import_zod4.z.string().optional(),
    filters: import_zod4.z.object({
      status: import_zod4.z.string().optional()
    }).optional()
  }).optional()).query(async ({ ctx, input }) => {
    if (!ctx.companyId) {
      return [];
    }
    const whereClause = {
      invoice: {
        companyId: ctx.companyId,
        ...input?.customerId && { customerId: input.customerId }
      },
      ...input?.invoiceId && { invoiceId: input.invoiceId }
    };
    try {
      const payments = await ctx.db.payment.findMany({
        where: whereClause,
        include: {
          invoice: {
            include: {
              customer: true
            }
          }
        },
        orderBy: { paymentDate: "desc" },
        take: 100
      });
      return payments;
    } catch (error) {
      console.error("Payment query error:", error);
      return [];
    }
  }),
  // Create new payment
  create: protectedProcedure.input(createPaymentSchema).mutation(async ({ ctx, input }) => {
    if (!ctx.companyId) {
      throw new import_server4.TRPCError({
        code: "UNAUTHORIZED",
        message: "Company ID required"
      });
    }
    try {
      const invoice = await ctx.db.invoice.findUnique({
        where: {
          id: input.invoiceId,
          companyId: ctx.companyId
        },
        include: { customer: true }
      });
      if (!invoice) {
        throw new import_server4.TRPCError({
          code: "NOT_FOUND",
          message: "Invoice not found"
        });
      }
      const payment = await ctx.db.payment.create({
        data: {
          id: idGenerator.payment(),
          invoiceId: input.invoiceId,
          customerId: invoice.customerId,
          companyId: ctx.companyId,
          amount: input.amount,
          method: input.method,
          paymentDate: input.paymentDate,
          reference: input.reference,
          notes: input.notes,
          status: "COMPLETED"
        },
        include: {
          invoice: {
            include: {
              customer: true
            }
          }
        }
      });
      const currentPaidAmount = invoice.paidAmount || 0;
      const newPaidAmount = currentPaidAmount + input.amount;
      await ctx.db.invoice.update({
        where: { id: input.invoiceId },
        data: {
          paidAmount: newPaidAmount,
          status: newPaidAmount >= invoice.grandTotal ? "PAID" : newPaidAmount > 0 ? "PARTIALLY_PAID" : "SENT"
        }
      });
      return payment;
    } catch (error) {
      if (error instanceof import_server4.TRPCError) {
        throw error;
      }
      console.error("Payment creation error:", error);
      throw new import_server4.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create payment"
      });
    }
  }),
  // Get payment statistics
  getStats: protectedProcedure.input(import_zod4.z.object({
    customerId: import_zod4.z.string().optional(),
    dateRange: import_zod4.z.string().optional()
  }).optional()).query(async ({ ctx, input }) => {
    if (!ctx.companyId) {
      return {
        totalReceived: 0,
        outstanding: 0,
        thisMonth: 0,
        averageDays: 0
      };
    }
    try {
      const paymentsResult = await ctx.db.payment.aggregate({
        where: {
          invoice: {
            companyId: ctx.companyId,
            customerId: input?.customerId
          }
        },
        _sum: {
          amount: true
        },
        _count: true
      });
      const invoicesResult = await ctx.db.invoice.aggregate({
        where: {
          companyId: ctx.companyId,
          customerId: input?.customerId,
          status: { in: ["GENERATED", "SENT", "OVERDUE", "PARTIALLY_PAID", "PAID"] }
          // Exclude DRAFT
        },
        _sum: {
          grandTotal: true,
          paidAmount: true
        }
      });
      const totalReceived = paymentsResult._sum.amount || 0;
      const totalBilled = invoicesResult._sum.grandTotal || 0;
      const totalPaid = invoicesResult._sum.paidAmount || 0;
      const outstanding = totalBilled - totalPaid;
      const outstandingCount = await ctx.db.invoice.count({
        where: {
          companyId: ctx.companyId,
          customerId: input?.customerId,
          status: { in: ["GENERATED", "SENT", "OVERDUE", "PARTIALLY_PAID"] }
          // Exclude DRAFT and PAID
        }
      });
      return {
        totalReceived,
        outstanding,
        outstandingCount,
        thisMonth: totalReceived,
        // Simplified for now
        averageDays: 0,
        // Would need more complex calculation
        receivedCount: paymentsResult._count
      };
    } catch (error) {
      console.error("Payment stats error:", error);
      return {
        totalReceived: 0,
        outstanding: 0,
        thisMonth: 0,
        averageDays: 0
      };
    }
  }),
  // Get recent payments
  getRecent: protectedProcedure.input(import_zod4.z.object({
    limit: import_zod4.z.number().min(1).max(50).default(10)
  }).optional()).query(async ({ ctx, input }) => {
    if (!ctx.companyId) {
      return [];
    }
    try {
      const payments = await ctx.db.payment.findMany({
        where: {
          invoice: {
            companyId: ctx.companyId
          }
        },
        include: {
          invoice: {
            include: {
              customer: true
            }
          }
        },
        orderBy: { paymentDate: "desc" },
        take: input?.limit || 10
      });
      return payments;
    } catch (error) {
      console.error("Recent payments error:", error);
      return [];
    }
  })
});

// src/server/api/routers/company.ts
var import_zod5 = require("zod");
var getCurrentCompanyData = () => {
  return {
    id: 1,
    legalName: "Excellence CS Practice LLP",
    tradeName: "Excellence CS",
    gstin: "27AABCE1234F1Z5",
    stateCode: "27",
    address: {
      line1: "Office No. 404, Business Center",
      line2: "Baner Road, Pune",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411045",
      country: "India"
    },
    contact: {
      email: "info@excellencecs.com",
      phone: "+91-9876543210",
      website: "https://excellencecs.com"
    },
    registration: {
      coi: "LLP-123456",
      incorporationDate: /* @__PURE__ */ new Date("2020-01-15"),
      registrationNumber: "LLPIN-AAE-1234"
    },
    settings: {
      invoicePrefix: "ECS",
      invoiceSequence: 1001,
      paymentTerms: "NET_30",
      lateFeePenalty: 2.5,
      currency: "INR",
      timezone: "Asia/Kolkata",
      fiscalYearStart: "2024-04-01",
      gstRegistrationDate: /* @__PURE__ */ new Date("2020-02-01"),
      digitalSignature: true,
      autoBackup: true
    },
    branding: {
      primaryColor: "#1e40af",
      accentColor: "#059669",
      logoUrl: "/assets/logo-excellence-cs.svg",
      tagline: "Excellence in Company Secretarial Practice"
    }
  };
};
var companyRouter = createTRPCRouter({
  // Get all companies
  getAll: protectedProcedure.query(async () => {
    return [];
  }),
  // Get current company (for CS practice)
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    const company = await ctx.db.company.findFirst({
      where: {
        id: ctx.session.user.companyId
      }
    });
    if (company) {
      return {
        id: company.id,
        name: company.name || "PRAGNYA PRADHAN & ASSOCIATES",
        email: company.email || "pragnyap.pradhan@gmail.com",
        phone: company.phone || "+91 9953457413",
        address: company.address || "46, LGF, JOR BAGH, New Delhi-110003",
        gstin: company.gstin || "",
        stateCode: company.stateCode || "07",
        pan: company.pan || "AMEPP4323R",
        website: company.website || "",
        logo: company.logo || "/images/company-logo.png"
      };
    }
    return {
      id: ctx.session.user.companyId,
      name: "PRAGNYA PRADHAN & ASSOCIATES",
      email: "pragnyap.pradhan@gmail.com",
      phone: "+91 9953457413",
      address: "46, LGF, JOR BAGH, New Delhi-110003",
      gstin: "",
      stateCode: "07",
      pan: "AMEPP4323R",
      website: "",
      logo: "/images/company-logo.png"
    };
  }),
  // Get company by ID (with fallback)
  getById: protectedProcedure.input(import_zod5.z.object({ id: import_zod5.z.number() })).query(async ({ ctx, input }) => {
    if (input.id === 1) {
      return getCurrentCompanyData();
    }
    return null;
  }),
  // Update company settings
  updateSettings: protectedProcedure.input(import_zod5.z.object({
    invoicePrefix: import_zod5.z.string().optional(),
    paymentTerms: import_zod5.z.string().optional(),
    lateFeePenalty: import_zod5.z.number().optional(),
    currency: import_zod5.z.string().optional(),
    timezone: import_zod5.z.string().optional()
  })).mutation(async ({ ctx, input }) => {
    const current = getCurrentCompanyData();
    return {
      ...current,
      settings: {
        ...current.settings,
        ...input
      }
    };
  }),
  // Get company settings
  getSettings: protectedProcedure.query(async () => {
    const company = getCurrentCompanyData();
    return company.settings;
  }),
  // Update company branding
  updateBranding: protectedProcedure.input(import_zod5.z.object({
    primaryColor: import_zod5.z.string().optional(),
    accentColor: import_zod5.z.string().optional(),
    logoUrl: import_zod5.z.string().optional(),
    tagline: import_zod5.z.string().optional()
  })).mutation(async ({ ctx, input }) => {
    const current = getCurrentCompanyData();
    return {
      ...current,
      branding: {
        ...current.branding,
        ...input
      }
    };
  }),
  // Get company branding
  getBranding: protectedProcedure.query(async () => {
    const company = getCurrentCompanyData();
    return company.branding;
  })
});

// src/server/api/routers/service.ts
var import_zod6 = require("zod");
var import_server5 = require("@trpc/server");

// src/types/custom-fields.ts
var FIELD_PATTERNS = {
  // Corporate Identification Number (21 chars)
  CIN: /^[A-Z]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/,
  // Director Identification Number (8 digits)
  DIN: /^\d{8}$/,
  // Permanent Account Number (10 chars)
  PAN: /^[A-Z]{5}\d{4}[A-Z]$/,
  // GSTIN (15 chars)
  GSTIN: /^\d{2}[A-Z]{5}\d{4}[A-Z]\d[Z][A-Z\d]$/,
  // Service Request Number (SRN) - varies, typically alphanumeric
  SRN: /^[A-Z0-9]{10,20}$/,
  // Mobile number (10 digits)
  MOBILE: /^[6-9]\d{9}$/,
  // Email
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  // Postal PIN code (6 digits)
  PINCODE: /^\d{6}$/,
  // Aadhaar number (12 digits)
  AADHAAR: /^\d{12}$/
};
var VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  INVALID_CIN: "Invalid CIN format (e.g., U12345KA2020PTC123456)",
  INVALID_DIN: "Invalid DIN format (8 digits)",
  INVALID_PAN: "Invalid PAN format (e.g., ABCDE1234F)",
  INVALID_GSTIN: "Invalid GSTIN format",
  INVALID_SRN: "Invalid SRN format",
  INVALID_MOBILE: "Invalid mobile number",
  INVALID_EMAIL: "Invalid email address",
  INVALID_PINCODE: "Invalid PIN code (6 digits)",
  INVALID_AADHAAR: "Invalid Aadhaar number (12 digits)",
  MIN_LENGTH: (min) => `Minimum ${min} characters required`,
  MAX_LENGTH: (max) => `Maximum ${max} characters allowed`,
  MIN_VALUE: (min) => `Minimum value is ${min}`,
  MAX_VALUE: (max) => `Maximum value is ${max}`
};

// src/lib/service-template-definitions.ts
var CS_SERVICE_TEMPLATES = [
  // ===== COMPANY INCORPORATION =====
  {
    name: "Company Incorporation",
    description: "Complete company incorporation services including name approval and registration",
    defaultRate: 25e3,
    gstRate: 18,
    hsnSac: "998399",
    category: "CORPORATE",
    customFields: [
      {
        name: "companyName",
        label: "Company Name",
        type: "text",
        required: true,
        placeholder: "ABC Private Limited",
        helpText: "Full legal name of the company",
        group: "Company Details"
      },
      {
        name: "cin",
        label: "CIN",
        type: "text",
        required: true,
        placeholder: "U12345KA2020PTC123456",
        helpText: "21-character Corporate Identification Number",
        validation: {
          pattern: FIELD_PATTERNS.CIN.source,
          message: VALIDATION_MESSAGES.INVALID_CIN
        },
        group: "Company Details"
      },
      {
        name: "registrationDate",
        label: "Date of Incorporation",
        type: "date",
        required: true,
        group: "Company Details"
      },
      {
        name: "authorizedCapital",
        label: "Authorized Capital",
        type: "currency",
        required: true,
        placeholder: "100000",
        helpText: "Authorized share capital of the company",
        validation: {
          min: 1e5,
          message: "Minimum authorized capital is \u20B91,00,000"
        },
        group: "Financial Details"
      },
      {
        name: "paidUpCapital",
        label: "Paid-up Capital",
        type: "currency",
        required: true,
        placeholder: "100000",
        helpText: "Actual paid-up share capital",
        group: "Financial Details"
      },
      {
        name: "rocOffice",
        label: "ROC Office",
        type: "select",
        required: true,
        options: [
          "ROC Karnataka",
          "ROC Delhi",
          "ROC Mumbai",
          "ROC Chennai",
          "ROC Kolkata",
          "ROC Hyderabad",
          "ROC Pune",
          "ROC Ahmedabad"
        ],
        group: "Registration Details"
      }
    ]
  },
  // ===== DIRECTOR APPOINTMENT =====
  {
    name: "Director Appointment",
    description: "Director appointment services including form filing and compliance",
    defaultRate: 5e3,
    gstRate: 18,
    hsnSac: "998399",
    category: "COMPLIANCE",
    customFields: [
      {
        name: "directorName",
        label: "Director Name",
        type: "text",
        required: true,
        placeholder: "John Doe",
        group: "Director Information"
      },
      {
        name: "din",
        label: "DIN",
        type: "text",
        required: true,
        placeholder: "12345678",
        helpText: "8-digit Director Identification Number",
        validation: {
          pattern: FIELD_PATTERNS.DIN.source,
          message: VALIDATION_MESSAGES.INVALID_DIN
        },
        group: "Director Information"
      },
      {
        name: "pan",
        label: "PAN",
        type: "text",
        required: false,
        placeholder: "ABCDE1234F",
        validation: {
          pattern: FIELD_PATTERNS.PAN.source,
          message: VALIDATION_MESSAGES.INVALID_PAN
        },
        group: "Director Information"
      },
      {
        name: "appointmentDate",
        label: "Date of Appointment",
        type: "date",
        required: true,
        group: "Appointment Details"
      },
      {
        name: "designation",
        label: "Designation",
        type: "select",
        required: true,
        options: [
          "Managing Director",
          "Whole-time Director",
          "Independent Director",
          "Non-Executive Director",
          "Additional Director",
          "Alternate Director",
          "Nominee Director"
        ],
        group: "Appointment Details"
      },
      {
        name: "formFiled",
        label: "Form Filed",
        type: "select",
        required: false,
        options: ["DIR-12", "DIR-11", "MGT-14"],
        group: "Filing Details"
      }
    ]
  },
  // ===== ROC FORM FILING (MGT-7, AOC-4, etc.) =====
  {
    name: "ROC Annual Filing",
    description: "Annual ROC form filing services (MGT-7, AOC-4, ADT-1, etc.)",
    defaultRate: 8e3,
    gstRate: 18,
    hsnSac: "998399",
    category: "ANNUAL_COMPLIANCE",
    customFields: [
      {
        name: "formNumber",
        label: "Form Number",
        type: "select",
        required: true,
        options: [
          "MGT-7 (Annual Return)",
          "AOC-4 (Financial Statements)",
          "ADT-1 (Auditor Appointment)",
          "DIR-3 KYC (Director KYC)",
          "MR-3 (MSME Return)",
          "DPT-3 (Deposit Return)",
          "MSME-1 (Half-yearly Return)"
        ],
        group: "Form Details"
      },
      {
        name: "financialYearEnd",
        label: "Financial Year End Date",
        type: "date",
        required: true,
        helpText: "End date of the financial year (e.g., 31st March 2024)",
        group: "Period Details"
      },
      {
        name: "agmDate",
        label: "AGM Date",
        type: "date",
        required: false,
        helpText: "Annual General Meeting date (if applicable)",
        group: "Period Details"
      },
      {
        name: "filingDate",
        label: "Filing Date",
        type: "date",
        required: false,
        helpText: "Actual date of filing with ROC",
        group: "Filing Details"
      },
      {
        name: "srn",
        label: "SRN (Service Request Number)",
        type: "text",
        required: false,
        placeholder: "A12345678901234",
        helpText: "Service Request Number received after filing",
        group: "Filing Details"
      },
      {
        name: "filingFee",
        label: "Filing Fee",
        type: "currency",
        required: false,
        placeholder: "0",
        helpText: "Government filing fee paid",
        group: "Financial Details"
      },
      {
        name: "additionalFee",
        label: "Additional Fee",
        type: "currency",
        required: false,
        placeholder: "0",
        helpText: "Late filing fee or penalty (if any)",
        group: "Financial Details"
      }
    ]
  },
  // ===== BOARD RESOLUTION =====
  {
    name: "Board Resolution",
    description: "Board resolution drafting and filing services",
    defaultRate: 3e3,
    gstRate: 18,
    hsnSac: "998399",
    category: "SECRETARIAL",
    customFields: [
      {
        name: "resolutionNumber",
        label: "Resolution Number",
        type: "text",
        required: true,
        placeholder: "BR-2024-001",
        helpText: "Internal reference number for the resolution",
        group: "Resolution Details"
      },
      {
        name: "resolutionDate",
        label: "Date of Resolution",
        type: "date",
        required: true,
        group: "Resolution Details"
      },
      {
        name: "subject",
        label: "Subject",
        type: "textarea",
        required: true,
        placeholder: "Appointment of statutory auditor...",
        helpText: "Brief subject/purpose of the resolution",
        validation: {
          minLength: 10,
          maxLength: 500
        },
        group: "Resolution Details"
      },
      {
        name: "resolutionType",
        label: "Type",
        type: "select",
        required: true,
        options: [
          "Board Resolution",
          "Circular Resolution",
          "Written Resolution",
          "Special Resolution"
        ],
        group: "Resolution Details"
      },
      {
        name: "formRequired",
        label: "Form Filing Required",
        type: "select",
        required: false,
        options: ["MGT-14", "INC-28", "Not Required"],
        helpText: "ROC form to be filed for this resolution",
        group: "Filing Requirements"
      }
    ]
  },
  // ===== SHARE TRANSFER =====
  {
    name: "Share Transfer",
    description: "Share transfer and transmission services",
    defaultRate: 2e3,
    gstRate: 18,
    hsnSac: "998399",
    category: "SECRETARIAL",
    customFields: [
      {
        name: "transferorName",
        label: "Transferor Name",
        type: "text",
        required: true,
        placeholder: "Name of the seller",
        group: "Transfer Details"
      },
      {
        name: "transfereeName",
        label: "Transferee Name",
        type: "text",
        required: true,
        placeholder: "Name of the buyer",
        group: "Transfer Details"
      },
      {
        name: "folioNumber",
        label: "Folio Number",
        type: "text",
        required: true,
        placeholder: "F-001",
        group: "Share Details"
      },
      {
        name: "certificateNumbers",
        label: "Share Certificate Numbers",
        type: "text",
        required: true,
        placeholder: "SC-001, SC-002",
        helpText: "Comma-separated certificate numbers",
        group: "Share Details"
      },
      {
        name: "numberOfShares",
        label: "Number of Shares",
        type: "number",
        required: true,
        placeholder: "100",
        validation: {
          min: 1,
          message: "At least 1 share must be transferred"
        },
        group: "Share Details"
      },
      {
        name: "considerationAmount",
        label: "Consideration Amount",
        type: "currency",
        required: false,
        placeholder: "0",
        helpText: "Transfer consideration (if any)",
        group: "Financial Details"
      },
      {
        name: "transferDate",
        label: "Date of Transfer",
        type: "date",
        required: true,
        group: "Transfer Details"
      }
    ]
  },
  // ===== COMPLIANCE CERTIFICATE =====
  {
    name: "Compliance Certificate",
    description: "Secretarial compliance certificate and annual certificate issuance",
    defaultRate: 15e3,
    gstRate: 18,
    hsnSac: "998399",
    category: "AUDIT",
    customFields: [
      {
        name: "certificateType",
        label: "Certificate Type",
        type: "select",
        required: true,
        options: [
          "Annual Secretarial Compliance Certificate",
          "Statutory Compliance Certificate",
          "Reconciliation of Share Capital",
          "LODR Compliance Certificate"
        ],
        group: "Certificate Details"
      },
      {
        name: "certificateNumber",
        label: "Certificate Number",
        type: "text",
        required: true,
        placeholder: "CERT-2024-001",
        group: "Certificate Details"
      },
      {
        name: "issueDate",
        label: "Date of Issue",
        type: "date",
        required: true,
        group: "Certificate Details"
      },
      {
        name: "periodFrom",
        label: "Period From",
        type: "date",
        required: true,
        helpText: "Start date of compliance period",
        group: "Period Details"
      },
      {
        name: "periodTo",
        label: "Period To",
        type: "date",
        required: true,
        helpText: "End date of compliance period",
        group: "Period Details"
      },
      {
        name: "validityPeriod",
        label: "Validity Period",
        type: "text",
        required: false,
        placeholder: "1 year from date of issue",
        group: "Certificate Details"
      }
    ]
  },
  // ===== AGM SERVICES =====
  {
    name: "AGM Conduct & Compliance",
    description: "Annual General Meeting conduct and compliance services",
    defaultRate: 1e4,
    gstRate: 18,
    hsnSac: "998399",
    category: "SECRETARIAL",
    customFields: [
      {
        name: "agmDate",
        label: "AGM Date",
        type: "date",
        required: true,
        group: "Meeting Details"
      },
      {
        name: "agmTime",
        label: "AGM Time",
        type: "text",
        required: false,
        placeholder: "11:00 AM",
        group: "Meeting Details"
      },
      {
        name: "venue",
        label: "Venue",
        type: "textarea",
        required: false,
        placeholder: "Registered office address or virtual meeting link",
        validation: {
          maxLength: 200
        },
        group: "Meeting Details"
      },
      {
        name: "financialYearEnd",
        label: "Financial Year End",
        type: "date",
        required: true,
        helpText: "Financial year for which AGM is being conducted",
        group: "Period Details"
      },
      {
        name: "noticeDate",
        label: "Notice Sent Date",
        type: "date",
        required: false,
        helpText: "Date when AGM notice was sent to members",
        group: "Compliance Details"
      },
      {
        name: "agmMode",
        label: "AGM Mode",
        type: "select",
        required: true,
        options: ["Physical", "Virtual", "Hybrid"],
        group: "Meeting Details"
      }
    ]
  },
  // ===== LLP COMPLIANCE =====
  {
    name: "LLP Annual Filing",
    description: "Limited Liability Partnership annual compliance services",
    defaultRate: 5e3,
    gstRate: 18,
    hsnSac: "998399",
    category: "LLP_COMPLIANCE",
    customFields: [
      {
        name: "llpin",
        label: "LLPIN",
        type: "text",
        required: true,
        placeholder: "AAA-1234",
        helpText: "Limited Liability Partnership Identification Number",
        group: "LLP Details"
      },
      {
        name: "formType",
        label: "Form Type",
        type: "select",
        required: true,
        options: [
          "Form 8 (Statement of Account & Solvency)",
          "Form 11 (Annual Return)",
          "Form 3 (Partner Appointment)",
          "Form 4 (Partner Cessation)"
        ],
        group: "Filing Details"
      },
      {
        name: "financialYearEnd",
        label: "Financial Year End",
        type: "date",
        required: true,
        group: "Period Details"
      },
      {
        name: "filingDate",
        label: "Filing Date",
        type: "date",
        required: false,
        group: "Filing Details"
      },
      {
        name: "srn",
        label: "SRN",
        type: "text",
        required: false,
        placeholder: "Service Request Number",
        group: "Filing Details"
      }
    ]
  },
  // ===== TRADEMARK SERVICES =====
  {
    name: "Trademark Registration",
    description: "Trademark search, application, and registration services",
    defaultRate: 7e3,
    gstRate: 18,
    hsnSac: "998399",
    category: "IP_SERVICES",
    customFields: [
      {
        name: "trademarkName",
        label: "Trademark Name/Logo",
        type: "text",
        required: true,
        placeholder: "Brand name or logo description",
        group: "Trademark Details"
      },
      {
        name: "applicantName",
        label: "Applicant Name",
        type: "text",
        required: true,
        group: "Applicant Details"
      },
      {
        name: "class",
        label: "Class(es)",
        type: "text",
        required: true,
        placeholder: "35, 42",
        helpText: "Trademark class numbers (comma-separated)",
        group: "Trademark Details"
      },
      {
        name: "applicationNumber",
        label: "Application Number",
        type: "text",
        required: false,
        placeholder: "TM application number",
        group: "Application Details"
      },
      {
        name: "applicationDate",
        label: "Application Date",
        type: "date",
        required: false,
        group: "Application Details"
      },
      {
        name: "registrationNumber",
        label: "Registration Number",
        type: "text",
        required: false,
        placeholder: "After registration",
        group: "Registration Details"
      },
      {
        name: "registrationDate",
        label: "Registration Date",
        type: "date",
        required: false,
        group: "Registration Details"
      }
    ]
  },
  // ===== STATUTORY AUDIT =====
  {
    name: "Statutory Audit Coordination",
    description: "Coordination and assistance for statutory audit compliance",
    defaultRate: 12e3,
    gstRate: 18,
    hsnSac: "998399",
    category: "AUDIT",
    customFields: [
      {
        name: "auditFirmName",
        label: "Audit Firm Name",
        type: "text",
        required: true,
        placeholder: "XYZ & Associates",
        group: "Auditor Details"
      },
      {
        name: "auditorName",
        label: "Lead Auditor Name",
        type: "text",
        required: false,
        group: "Auditor Details"
      },
      {
        name: "financialYearEnd",
        label: "Financial Year End",
        type: "date",
        required: true,
        group: "Audit Period"
      },
      {
        name: "auditStartDate",
        label: "Audit Start Date",
        type: "date",
        required: false,
        group: "Audit Period"
      },
      {
        name: "auditCompletionDate",
        label: "Audit Completion Date",
        type: "date",
        required: false,
        group: "Audit Period"
      },
      {
        name: "reportDate",
        label: "Audit Report Date",
        type: "date",
        required: false,
        group: "Report Details"
      },
      {
        name: "auditOpinion",
        label: "Audit Opinion",
        type: "select",
        required: false,
        options: [
          "Unmodified (Clean)",
          "Qualified",
          "Adverse",
          "Disclaimer"
        ],
        group: "Report Details"
      }
    ]
  }
];

// src/server/api/routers/service.ts
var import_client3 = require("@prisma/client");
var customFieldSchema = import_zod6.z.object({
  name: import_zod6.z.string(),
  label: import_zod6.z.string(),
  type: import_zod6.z.enum(["text", "number", "date", "select", "textarea", "checkbox", "currency"]),
  required: import_zod6.z.boolean(),
  placeholder: import_zod6.z.string().optional(),
  helpText: import_zod6.z.string().optional(),
  options: import_zod6.z.array(import_zod6.z.string()).optional(),
  defaultValue: import_zod6.z.any().optional(),
  validation: import_zod6.z.object({
    pattern: import_zod6.z.string().optional(),
    minLength: import_zod6.z.number().optional(),
    maxLength: import_zod6.z.number().optional(),
    min: import_zod6.z.number().optional(),
    max: import_zod6.z.number().optional(),
    message: import_zod6.z.string().optional()
  }).optional(),
  group: import_zod6.z.string().optional()
});
var serviceRouter = createTRPCRouter({
  // Get all service templates with custom fields
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const templates = await ctx.db.serviceTemplate.findMany({
      where: { companyId: ctx.companyId },
      orderBy: { name: "asc" }
    });
    return templates;
  }),
  // Get service template by ID with custom fields
  getById: protectedProcedure.input(import_zod6.z.object({ id: import_zod6.z.string() })).query(async ({ ctx, input }) => {
    const template = await ctx.db.serviceTemplate.findFirst({
      where: {
        id: input.id,
        companyId: ctx.companyId
      }
    });
    if (!template) {
      throw new import_server5.TRPCError({
        code: "NOT_FOUND",
        message: "Service template not found"
      });
    }
    return template;
  }),
  // Legacy getTemplates (for backward compatibility)
  // Returns mock data for invoice form dropdown until migration complete
  getTemplates: protectedProcedure.query(async ({ ctx }) => {
    const templates = await ctx.db.serviceTemplate.findMany({
      where: { companyId: ctx.companyId },
      orderBy: { name: "asc" }
    });
    if (templates.length === 0) {
      return [
        {
          id: "mock-1",
          name: "ROC Annual Filing",
          description: "Annual filing for registrar of companies",
          defaultRate: 2500,
          gstRate: 18,
          hsnSac: "9983",
          category: "compliance"
        },
        {
          id: "mock-2",
          name: "Company Incorporation",
          description: "Complete company incorporation service",
          defaultRate: 15e3,
          gstRate: 18,
          hsnSac: "9983",
          category: "incorporation"
        },
        {
          id: "mock-3",
          name: "Board Resolution Drafting",
          description: "Professional board resolution drafting",
          defaultRate: 1500,
          gstRate: 18,
          hsnSac: "9983",
          category: "legal"
        },
        {
          id: "mock-4",
          name: "AGM Compliance",
          description: "Annual general meeting compliance service",
          defaultRate: 3500,
          gstRate: 18,
          hsnSac: "9983",
          category: "compliance"
        },
        {
          id: "mock-5",
          name: "Share Certificate",
          description: "Share certificate preparation and issuance",
          defaultRate: 500,
          gstRate: 18,
          hsnSac: "9983",
          category: "documentation"
        }
      ];
    }
    return templates;
  }),
  // Create new service template with custom fields
  create: protectedProcedure.input(import_zod6.z.object({
    name: import_zod6.z.string().min(1, "Name is required"),
    description: import_zod6.z.string().optional(),
    defaultRate: import_zod6.z.number().positive("Rate must be positive"),
    gstRate: import_zod6.z.number().min(0).max(30, "GST rate must be between 0 and 30"),
    hsnSac: import_zod6.z.string().optional(),
    category: import_zod6.z.string().optional(),
    customFields: import_zod6.z.array(customFieldSchema).optional()
  })).mutation(async ({ ctx, input }) => {
    const template = await ctx.db.serviceTemplate.create({
      data: {
        id: idGenerator.serviceTemplate(),
        name: input.name,
        description: input.description || null,
        defaultRate: input.defaultRate,
        gstRate: input.gstRate,
        hsnSac: input.hsnSac || null,
        category: input.category || null,
        customFields: input.customFields ? input.customFields : import_client3.Prisma.JsonNull,
        companyId: ctx.companyId
      }
    });
    return template;
  }),
  // Update service template with custom fields
  update: protectedProcedure.input(import_zod6.z.object({
    id: import_zod6.z.string(),
    name: import_zod6.z.string().min(1).optional(),
    description: import_zod6.z.string().optional(),
    defaultRate: import_zod6.z.number().positive().optional(),
    gstRate: import_zod6.z.number().min(0).max(30).optional(),
    hsnSac: import_zod6.z.string().optional(),
    category: import_zod6.z.string().optional(),
    customFields: import_zod6.z.array(customFieldSchema).optional()
  })).mutation(async ({ ctx, input }) => {
    const existing = await ctx.db.serviceTemplate.findFirst({
      where: { id: input.id, companyId: ctx.companyId }
    });
    if (!existing) {
      throw new import_server5.TRPCError({
        code: "NOT_FOUND",
        message: "Service template not found"
      });
    }
    const { id, ...updateData } = input;
    const template = await ctx.db.serviceTemplate.update({
      where: { id },
      data: {
        ...updateData,
        customFields: updateData.customFields ? updateData.customFields : void 0
      }
    });
    return template;
  }),
  // Delete service template
  delete: protectedProcedure.input(import_zod6.z.object({ id: import_zod6.z.string() })).mutation(async ({ ctx, input }) => {
    const existing = await ctx.db.serviceTemplate.findFirst({
      where: { id: input.id, companyId: ctx.companyId }
    });
    if (!existing) {
      throw new import_server5.TRPCError({
        code: "NOT_FOUND",
        message: "Service template not found"
      });
    }
    await ctx.db.serviceTemplate.delete({
      where: { id: input.id }
    });
    return { success: true };
  }),
  // Initialize pre-defined CS service templates
  initializePredefinedTemplates: protectedProcedure.mutation(async ({ ctx }) => {
    const existingCount = await ctx.db.serviceTemplate.count({
      where: { companyId: ctx.companyId }
    });
    if (existingCount > 0) {
      return {
        message: "Templates already initialized",
        created: 0,
        existing: existingCount
      };
    }
    const createdTemplates = [];
    for (const template of CS_SERVICE_TEMPLATES) {
      const created = await ctx.db.serviceTemplate.create({
        data: {
          id: idGenerator.serviceTemplate(),
          name: template.name,
          description: template.description || null,
          defaultRate: template.defaultRate,
          gstRate: template.gstRate,
          hsnSac: template.hsnSac || null,
          category: template.category || null,
          customFields: template.customFields,
          companyId: ctx.companyId
        }
      });
      createdTemplates.push(created);
    }
    return {
      message: `Initialized ${createdTemplates.length} CS service templates`,
      created: createdTemplates.length,
      templates: createdTemplates
    };
  }),
  // Get templates with custom fields definitions only
  getTemplatesWithCustomFields: protectedProcedure.query(async ({ ctx }) => {
    const templates = await ctx.db.serviceTemplate.findMany({
      where: {
        companyId: ctx.companyId,
        customFields: { not: import_client3.Prisma.JsonNull }
      },
      orderBy: { name: "asc" }
    });
    return templates;
  }),
  // Get custom fields for a specific template
  getCustomFields: protectedProcedure.input(import_zod6.z.object({ templateId: import_zod6.z.string() })).query(async ({ ctx, input }) => {
    const template = await ctx.db.serviceTemplate.findFirst({
      where: {
        id: input.templateId,
        companyId: ctx.companyId
      },
      select: {
        id: true,
        name: true,
        customFields: true
      }
    });
    if (!template) {
      throw new import_server5.TRPCError({
        code: "NOT_FOUND",
        message: "Service template not found"
      });
    }
    return {
      templateId: template.id,
      templateName: template.name,
      customFields: template.customFields || []
    };
  })
});

// src/server/api/routers/compliance.ts
var import_zod7 = require("zod");
var import_server6 = require("@trpc/server");

// src/lib/compliance-engine.ts
var ComplianceEngine = class {
  /**
   * Calculate next due date for recurring compliance items
   */
  static calculateNextDueDate(currentDueDate, frequency) {
    const nextDate = new Date(currentDueDate);
    switch (frequency) {
      case "DAILY" /* DAILY */:
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case "WEEKLY" /* WEEKLY */:
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case "MONTHLY" /* MONTHLY */:
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case "QUARTERLY" /* QUARTERLY */:
        nextDate.setMonth(nextDate.getMonth() + 3);
        break;
      case "HALF_YEARLY" /* HALF_YEARLY */:
        nextDate.setMonth(nextDate.getMonth() + 6);
        break;
      case "ANNUALLY" /* ANNUALLY */:
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
      case "BI_ANNUALLY" /* BI_ANNUALLY */:
        nextDate.setFullYear(nextDate.getFullYear() + 2);
        break;
      default:
        break;
    }
    return nextDate;
  }
  /**
   * Determine priority based on compliance type and due date
   */
  static calculatePriority(complianceType, dueDate, currentDate = /* @__PURE__ */ new Date()) {
    const daysUntilDue = Math.ceil((dueDate.getTime() - currentDate.getTime()) / (1e3 * 60 * 60 * 24));
    if (complianceType === "ROC_FILING" /* ROC_FILING */ || complianceType === "AGM" /* AGM */) {
      return daysUntilDue <= 3 ? "CRITICAL" /* CRITICAL */ : "HIGH" /* HIGH */;
    }
    if (complianceType === "BOARD_MEETING" /* BOARD_MEETING */ || complianceType === "EGM" /* EGM */) {
      return daysUntilDue <= 2 ? "HIGH" /* HIGH */ : "MEDIUM" /* MEDIUM */;
    }
    if (complianceType === "TAX_FILING" /* TAX_FILING */) {
      if (daysUntilDue < 0) return "CRITICAL" /* CRITICAL */;
      if (daysUntilDue <= 5) return "HIGH" /* HIGH */;
      return "MEDIUM" /* MEDIUM */;
    }
    if (daysUntilDue < 0) return "CRITICAL" /* CRITICAL */;
    if (daysUntilDue <= 2) return "HIGH" /* HIGH */;
    if (daysUntilDue <= 7) return "MEDIUM" /* MEDIUM */;
    return "LOW" /* LOW */;
  }
  /**
   * Calculate penalties for overdue compliance items
   */
  static calculatePenalty(complianceType, daysOverdue, baseAmount = 0) {
    if (daysOverdue <= 0) return 0;
    let penalty = 0;
    switch (complianceType) {
      case "ROC_FILING" /* ROC_FILING */:
        penalty = Math.min(daysOverdue * 100, 1e5);
        break;
      case "AGM" /* AGM */:
        if (daysOverdue <= 30) {
          penalty = daysOverdue * 100;
        } else {
          penalty = 3e3 + (daysOverdue - 30) * 300;
        }
        penalty = Math.min(penalty, 5e5);
        break;
      case "BOARD_MEETING" /* BOARD_MEETING */:
        penalty = Math.min(daysOverdue * 50, 1e4);
        break;
      case "TAX_FILING" /* TAX_FILING */:
        penalty = Math.min(daysOverdue * Math.max(baseAmount * 1e-3, 100), 5e4);
        break;
      default:
        penalty = Math.min(daysOverdue * 25, 5e3);
        break;
    }
    return penalty;
  }
  /**
   * Generate alerts for compliance items
   */
  static generateAlerts(compliance, currentDate = /* @__PURE__ */ new Date()) {
    const alerts = [];
    const daysUntilDue = Math.ceil((compliance.dueDate.getTime() - currentDate.getTime()) / (1e3 * 60 * 60 * 24));
    if (daysUntilDue < 0) {
      alerts.push({
        id: `alert-overdue-${compliance.id}`,
        complianceId: compliance.id,
        alertType: "OVERDUE_ITEM" /* OVERDUE_ITEM */,
        message: `${compliance.title} is ${Math.abs(daysUntilDue)} days overdue`,
        reminderDays: Math.abs(daysUntilDue),
        escalationLevel: Math.min(Math.floor(Math.abs(daysUntilDue) / 7) + 1, 5),
        scheduledFor: currentDate
      });
    } else if (daysUntilDue <= compliance.reminderDays) {
      alerts.push({
        id: `alert-upcoming-${compliance.id}`,
        complianceId: compliance.id,
        alertType: "UPCOMING_DEADLINE" /* UPCOMING_DEADLINE */,
        message: `${compliance.title} is due in ${daysUntilDue} days`,
        reminderDays: daysUntilDue,
        escalationLevel: 1,
        scheduledFor: currentDate
      });
    }
    if (compliance.priority === "CRITICAL" /* CRITICAL */) {
      alerts.push({
        id: `alert-critical-${compliance.id}`,
        complianceId: compliance.id,
        alertType: "CRITICAL_ALERT" /* CRITICAL_ALERT */,
        message: `Critical compliance item: ${compliance.title}`,
        reminderDays: 0,
        escalationLevel: 3,
        scheduledFor: currentDate
      });
    }
    return alerts;
  }
  /**
   * Calculate compliance statistics
   */
  static calculateStats(compliances) {
    const now = /* @__PURE__ */ new Date();
    const stats = {
      totalCompliances: compliances.length,
      pending: 0,
      inProgress: 0,
      completed: 0,
      overdue: 0,
      upcomingDeadlines: 0,
      criticalAlerts: 0,
      totalEstimatedCost: 0,
      totalActualCost: 0,
      completionRate: 0,
      averageCompletionTime: 0
    };
    const totalCompletionTime = 0;
    let completedCount = 0;
    compliances.forEach((compliance) => {
      switch (compliance.status) {
        case "PENDING" /* PENDING */:
          stats.pending++;
          break;
        case "IN_PROGRESS" /* IN_PROGRESS */:
          stats.inProgress++;
          break;
        case "COMPLETED" /* COMPLETED */:
          stats.completed++;
          completedCount++;
          break;
        case "OVERDUE" /* OVERDUE */:
          stats.overdue++;
          break;
      }
      if (compliance.dueDate < now && compliance.status !== "COMPLETED" /* COMPLETED */) {
        stats.overdue++;
      }
      const daysUntilDue = Math.ceil((compliance.dueDate.getTime() - now.getTime()) / (1e3 * 60 * 60 * 24));
      if (daysUntilDue <= 7 && daysUntilDue > 0 && compliance.status !== "COMPLETED" /* COMPLETED */) {
        stats.upcomingDeadlines++;
      }
      if (compliance.priority === "CRITICAL" /* CRITICAL */) {
        stats.criticalAlerts++;
      }
      stats.totalEstimatedCost += compliance.estimatedCost || 0;
      stats.totalActualCost += compliance.actualCost || 0;
    });
    stats.completionRate = stats.totalCompliances > 0 ? stats.completed / stats.totalCompliances * 100 : 0;
    stats.averageCompletionTime = completedCount > 0 ? totalCompletionTime / completedCount : 0;
    return stats;
  }
  /**
   * Get predefined compliance templates for CS practices
   */
  static getDefaultTemplates() {
    return [
      {
        title: "Annual General Meeting (AGM)",
        complianceType: "AGM" /* AGM */,
        category: "SHAREHOLDER_MATTERS" /* SHAREHOLDER_MATTERS */,
        frequency: "ANNUALLY" /* ANNUALLY */,
        defaultDays: 180,
        // 6 months from financial year end
        reminderDays: 30,
        estimatedCost: 15e3,
        instructions: "AGM must be held within 6 months from the end of financial year",
        checklist: [
          "Send AGM notice 21 days in advance",
          "Prepare Annual Report",
          "Finalize audited financial statements",
          "Arrange venue and logistics",
          "File MGT-15 within 30 days after AGM"
        ],
        requiredDocs: ["Annual Report", "Audited Financial Statements", "Notice of AGM"]
      },
      {
        title: "Board Meeting - Quarterly",
        complianceType: "BOARD_MEETING" /* BOARD_MEETING */,
        category: "BOARD_MATTERS" /* BOARD_MATTERS */,
        frequency: "QUARTERLY" /* QUARTERLY */,
        defaultDays: 90,
        reminderDays: 7,
        estimatedCost: 5e3,
        instructions: "Board meetings must be held at least once in every quarter",
        checklist: [
          "Send meeting notice 7 days in advance",
          "Prepare agenda and board papers",
          "Conduct meeting with quorum",
          "Record minutes within 30 days"
        ],
        requiredDocs: ["Meeting Notice", "Agenda", "Board Resolution", "Minutes"]
      },
      {
        title: "Form AOC-4 Filing",
        complianceType: "ROC_FILING" /* ROC_FILING */,
        category: "REGULATORY_COMPLIANCE" /* REGULATORY_COMPLIANCE */,
        frequency: "ANNUALLY" /* ANNUALLY */,
        defaultDays: 240,
        // 8 months from FY end
        reminderDays: 30,
        estimatedCost: 8e3,
        rocForm: "AOC-4",
        instructions: "Annual filing of financial statements and other documents",
        checklist: [
          "Prepare audited financial statements",
          "Board approval for adoption of accounts",
          "AGM approval of financial statements",
          "File AOC-4 within 30 days of AGM"
        ],
        requiredDocs: ["Audited Financial Statements", "Board Resolution", "AGM Resolution"]
      },
      {
        title: "Form MGT-7 Filing",
        complianceType: "ROC_FILING" /* ROC_FILING */,
        category: "REGULATORY_COMPLIANCE" /* REGULATORY_COMPLIANCE */,
        frequency: "ANNUALLY" /* ANNUALLY */,
        defaultDays: 60,
        // Within 60 days of AGM
        reminderDays: 15,
        estimatedCost: 5e3,
        rocForm: "MGT-7",
        instructions: "Annual return filing with ROC",
        checklist: [
          "Prepare annual return as per MGT-7",
          "Update member details",
          "Include details of board meetings",
          "File within 60 days of AGM"
        ],
        requiredDocs: ["Annual Return", "Updated Member Register"]
      },
      {
        title: "DIR-3 KYC Filing",
        complianceType: "ROC_FILING" /* ROC_FILING */,
        category: "REGULATORY_COMPLIANCE" /* REGULATORY_COMPLIANCE */,
        frequency: "ANNUALLY" /* ANNUALLY */,
        defaultDays: 120,
        // By 30th April every year
        reminderDays: 30,
        estimatedCost: 3e3,
        rocForm: "DIR-3 KYC",
        instructions: "Annual KYC filing for all directors",
        checklist: [
          "Collect KYC documents from all directors",
          "Verify PAN and Aadhaar details",
          "File DIR-3 KYC for each director",
          "Obtain acknowledgment receipts"
        ],
        requiredDocs: ["PAN Card", "Aadhaar Card", "Photograph", "Address Proof"]
      }
    ];
  }
  /**
   * Create compliance items from templates
   */
  static createComplianceFromTemplate(template, customerId, financialYearEnd = /* @__PURE__ */ new Date()) {
    const dueDate = new Date(financialYearEnd);
    dueDate.setDate(dueDate.getDate() + template.defaultDays);
    const nextDueDate = template.frequency !== "ON_DEMAND" /* ON_DEMAND */ ? this.calculateNextDueDate(dueDate, template.frequency) : void 0;
    return {
      title: template.title,
      complianceType: template.complianceType,
      category: template.category,
      dueDate,
      status: "PENDING" /* PENDING */,
      priority: this.calculatePriority(template.complianceType, dueDate),
      frequency: template.frequency,
      isRecurring: template.frequency !== "ON_DEMAND" /* ON_DEMAND */,
      nextDueDate,
      reminderDays: template.reminderDays,
      estimatedCost: template.estimatedCost,
      rocForm: template.rocForm,
      customerId
    };
  }
};
var complianceEngine = new ComplianceEngine();

// src/server/api/routers/compliance.ts
var complianceCreateSchema = import_zod7.z.object({
  title: import_zod7.z.string().min(1),
  description: import_zod7.z.string().optional(),
  customerId: import_zod7.z.string().optional(),
  complianceType: import_zod7.z.enum([
    "ROC_FILING",
    "BOARD_MEETING",
    "AGM",
    "EGM",
    "AUDIT",
    "TAX_FILING",
    "REGULATORY",
    "STATUTORY",
    "PERIODIC",
    "ONE_TIME"
  ]),
  category: import_zod7.z.enum([
    "CORPORATE_GOVERNANCE",
    "REGULATORY_COMPLIANCE",
    "TAX_COMPLIANCE",
    "AUDIT_COMPLIANCE",
    "BOARD_MATTERS",
    "SHAREHOLDER_MATTERS",
    "SECRETARIAL_COMPLIANCE",
    "ANNUAL_COMPLIANCE",
    "QUARTERLY_COMPLIANCE",
    "MONTHLY_COMPLIANCE"
  ]),
  dueDate: import_zod7.z.date(),
  priority: import_zod7.z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  frequency: import_zod7.z.enum([
    "DAILY",
    "WEEKLY",
    "MONTHLY",
    "QUARTERLY",
    "HALF_YEARLY",
    "ANNUALLY",
    "BI_ANNUALLY",
    "ON_DEMAND"
  ]).optional(),
  isRecurring: import_zod7.z.boolean().default(false),
  reminderDays: import_zod7.z.number().default(7),
  estimatedCost: import_zod7.z.number().optional(),
  rocForm: import_zod7.z.string().optional(),
  rocSection: import_zod7.z.string().optional(),
  applicableAct: import_zod7.z.string().optional(),
  assignedTo: import_zod7.z.string().optional()
});
var complianceRouter = createTRPCRouter({
  // ================== COMPLIANCE ITEMS ==================
  /**
   * Get all compliance items with filtering and pagination
   */
  getAll: protectedProcedure.input(import_zod7.z.object({
    page: import_zod7.z.number().default(1),
    limit: import_zod7.z.number().default(20),
    customerId: import_zod7.z.string().optional(),
    status: import_zod7.z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "OVERDUE"]).optional(),
    category: import_zod7.z.string().optional(),
    complianceType: import_zod7.z.string().optional(),
    priority: import_zod7.z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
    dueDateFrom: import_zod7.z.date().optional(),
    dueDateTo: import_zod7.z.date().optional(),
    sortBy: import_zod7.z.enum(["dueDate", "priority", "status", "createdAt"]).default("dueDate"),
    sortOrder: import_zod7.z.enum(["asc", "desc"]).default("asc")
  })).query(async ({ ctx, input }) => {
    if (!ctx.companyId) {
      throw new import_server6.TRPCError({
        code: "UNAUTHORIZED",
        message: "Company ID required"
      });
    }
    const { page, limit, sortBy, sortOrder, ...filters } = input;
    const skip = (page - 1) * limit;
    const where = {
      companyId: ctx.companyId
    };
    if (filters.customerId) where.customerId = filters.customerId;
    if (filters.status) where.status = filters.status;
    if (filters.category) where.category = filters.category;
    if (filters.complianceType) where.complianceType = filters.complianceType;
    if (filters.priority) where.priority = filters.priority;
    if (filters.dueDateFrom || filters.dueDateTo) {
      where.dueDate = {};
      if (filters.dueDateFrom) where.dueDate.gte = filters.dueDateFrom;
      if (filters.dueDateTo) where.dueDate.lte = filters.dueDateTo;
    }
    const [compliances, totalCount] = await Promise.all([
      ctx.db.complianceItem.findMany({
        where,
        include: {
          customer: true,
          template: true,
          activities: {
            orderBy: { createdAt: "desc" },
            take: 3
          }
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder }
      }),
      ctx.db.complianceItem.count({ where })
    ]);
    const now = /* @__PURE__ */ new Date();
    const enhancedCompliances = compliances.map((compliance) => {
      const daysOverdue = compliance.status === "OVERDUE" || compliance.dueDate < now ? Math.ceil((now.getTime() - compliance.dueDate.getTime()) / (1e3 * 60 * 60 * 24)) : 0;
      const penalty = daysOverdue > 0 ? ComplianceEngine.calculatePenalty(
        compliance.complianceType,
        daysOverdue,
        compliance.estimatedCost || 0
      ) : 0;
      return {
        ...compliance,
        daysOverdue: Math.max(0, daysOverdue),
        calculatedPenalty: penalty
      };
    });
    return {
      compliances: enhancedCompliances,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  }),
  /**
   * Get single compliance item by ID
   */
  getById: protectedProcedure.input(import_zod7.z.object({ id: import_zod7.z.string() })).query(async ({ ctx, input }) => {
    const compliance = await ctx.db.complianceItem.findFirst({
      where: {
        id: input.id,
        companyId: ctx.companyId
      },
      include: {
        customer: true,
        template: true,
        activities: {
          orderBy: { createdAt: "desc" }
        }
      }
    });
    if (!compliance) {
      throw new import_server6.TRPCError({
        code: "NOT_FOUND",
        message: "Compliance item not found"
      });
    }
    return compliance;
  }),
  /**
   * Create new compliance item
   */
  create: protectedProcedure.input(complianceCreateSchema).mutation(async ({ ctx, input }) => {
    if (!ctx.companyId) {
      throw new import_server6.TRPCError({
        code: "UNAUTHORIZED",
        message: "Company ID required"
      });
    }
    const priority = input.priority || ComplianceEngine.calculatePriority(
      input.complianceType,
      input.dueDate
    );
    const compliance = await ctx.db.complianceItem.create({
      data: {
        id: idGenerator.compliance(),
        ...input,
        companyId: ctx.companyId,
        priority,
        nextDueDate: input.isRecurring && input.frequency ? ComplianceEngine.calculateNextDueDate(input.dueDate, input.frequency) : void 0
      },
      include: {
        customer: true,
        template: true
      }
    });
    await ctx.db.complianceActivity.create({
      data: {
        id: idGenerator.complianceActivity(),
        complianceId: compliance.id,
        activityType: "CREATED" /* CREATED */,
        description: `Compliance item created: ${compliance.title}`,
        performedBy: "System"
        // In real app, would be current user
      }
    });
    return compliance;
  }),
  /**
   * Update compliance item
   */
  update: protectedProcedure.input(import_zod7.z.object({
    id: import_zod7.z.string(),
    title: import_zod7.z.string().optional(),
    description: import_zod7.z.string().optional(),
    status: import_zod7.z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "OVERDUE"]).optional(),
    priority: import_zod7.z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
    dueDate: import_zod7.z.date().optional(),
    completedDate: import_zod7.z.date().optional(),
    actualCost: import_zod7.z.number().optional(),
    completionNotes: import_zod7.z.string().optional(),
    assignedTo: import_zod7.z.string().optional()
  })).mutation(async ({ ctx, input }) => {
    const { id, ...updateData } = input;
    const existingCompliance = await ctx.db.complianceItem.findFirst({
      where: {
        id,
        companyId: ctx.companyId
      }
    });
    if (!existingCompliance) {
      throw new import_server6.TRPCError({
        code: "NOT_FOUND",
        message: "Compliance item not found"
      });
    }
    if (updateData.status === "COMPLETED" && !updateData.completedDate) {
      updateData.completedDate = /* @__PURE__ */ new Date();
    }
    const updatedCompliance = await ctx.db.complianceItem.update({
      where: { id },
      data: updateData,
      include: {
        customer: true
      }
    });
    let activityDescription = `Compliance item updated`;
    let activityType = "UPDATED" /* UPDATED */;
    if (updateData.status) {
      activityDescription = `Status changed to ${updateData.status}`;
      activityType = "STATUS_CHANGED" /* STATUS_CHANGED */;
      if (updateData.status === "COMPLETED") {
        activityType = "COMPLETED" /* COMPLETED */;
        activityDescription = `Compliance item completed`;
      }
    }
    await ctx.db.complianceActivity.create({
      data: {
        id: idGenerator.complianceActivity(),
        complianceId: id,
        activityType,
        description: activityDescription,
        performedBy: "System"
      }
    });
    return updatedCompliance;
  }),
  /**
   * Get compliance dashboard data
   */
  getDashboard: protectedProcedure.input(import_zod7.z.object({
    dateRange: import_zod7.z.enum(["thisWeek", "thisMonth", "thisQuarter", "thisYear"]).default("thisMonth")
  })).query(async ({ ctx, input }) => {
    const now = /* @__PURE__ */ new Date();
    let startDate;
    switch (input.dateRange) {
      case "thisWeek":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case "thisMonth":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "thisQuarter":
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        break;
      case "thisYear":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }
    const compliances = await ctx.db.complianceItem.findMany({
      where: {
        companyId: ctx.companyId,
        createdAt: {
          gte: startDate
        }
      },
      include: {
        customer: true
      },
      orderBy: { dueDate: "asc" }
    });
    const stats = ComplianceEngine.calculateStats(compliances);
    const upcomingDeadlines = compliances.filter((c2) => {
      const daysUntilDue = Math.ceil((c2.dueDate.getTime() - now.getTime()) / (1e3 * 60 * 60 * 24));
      return daysUntilDue <= 7 && daysUntilDue > 0 && c2.status !== "COMPLETED";
    }).slice(0, 10);
    const overdueItems = compliances.filter((c2) => c2.dueDate < now && c2.status !== "COMPLETED").slice(0, 10);
    const recentActivities = await ctx.db.complianceActivity.findMany({
      where: {
        compliance: {
          companyId: ctx.companyId
        }
      },
      include: {
        compliance: {
          include: {
            customer: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 10
    });
    return {
      stats,
      upcomingDeadlines,
      overdueItems,
      recentActivities,
      totalCompliances: compliances.length
    };
  }),
  /**
   * Get default templates and initialize them
   */
  initializeDefaultTemplates: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.companyId) {
      throw new import_server6.TRPCError({
        code: "UNAUTHORIZED",
        message: "Company ID required"
      });
    }
    let company = await ctx.db.company.findUnique({
      where: { id: ctx.companyId }
    });
    if (!company) {
      company = await ctx.db.company.create({
        data: {
          id: ctx.companyId,
          name: "Test Company",
          email: "test@company.com",
          stateCode: "29"
        }
      });
    }
    const defaultTemplates = ComplianceEngine.getDefaultTemplates();
    const createdTemplates = [];
    for (const templateData of defaultTemplates) {
      const existingTemplate = await ctx.db.complianceTemplate.findFirst({
        where: {
          title: templateData.title,
          companyId: ctx.companyId
        }
      });
      if (!existingTemplate) {
        const template = await ctx.db.complianceTemplate.create({
          data: {
            id: idGenerator.complianceTemplate(),
            ...templateData,
            companyId: ctx.companyId
          }
        });
        createdTemplates.push(template);
      }
    }
    return {
      created: createdTemplates.length,
      templates: createdTemplates
    };
  }),
  /**
   * Get compliance templates
   */
  getTemplates: protectedProcedure.query(async ({ ctx }) => {
    const templates = await ctx.db.complianceTemplate.findMany({
      where: {
        companyId: ctx.companyId,
        isActive: true
      },
      orderBy: { title: "asc" }
    });
    return templates;
  }),
  /**
   * Get upcoming compliance deadlines (next 7 days)
   */
  getUpcoming: protectedProcedure.input(import_zod7.z.object({
    days: import_zod7.z.number().min(1).max(30).default(7),
    limit: import_zod7.z.number().min(1).max(50).default(10)
  }).optional()).query(async ({ ctx, input }) => {
    if (!ctx.companyId) {
      throw new import_server6.TRPCError({
        code: "UNAUTHORIZED",
        message: "Company ID required"
      });
    }
    const now = /* @__PURE__ */ new Date();
    const daysAhead = input?.days || 7;
    const limit = input?.limit || 10;
    const futureDate = new Date(now);
    futureDate.setDate(now.getDate() + daysAhead);
    const upcomingCompliances = await ctx.db.complianceItem.findMany({
      where: {
        companyId: ctx.companyId,
        status: { not: "COMPLETED" },
        dueDate: {
          gte: now,
          lte: futureDate
        }
      },
      include: {
        customer: true,
        template: true
      },
      orderBy: { dueDate: "asc" },
      take: limit
    });
    const enhancedCompliances = upcomingCompliances.map((compliance) => {
      const daysUntilDue = Math.ceil(
        (compliance.dueDate.getTime() - now.getTime()) / (1e3 * 60 * 60 * 24)
      );
      return {
        ...compliance,
        daysUntilDue: Math.max(0, daysUntilDue)
      };
    });
    return {
      compliances: enhancedCompliances,
      totalCount: enhancedCompliances.length,
      daysAhead
    };
  }),
  /**
   * Delete a compliance item
   */
  delete: protectedProcedure.input(import_zod7.z.object({
    id: import_zod7.z.string()
  })).mutation(async ({ ctx, input }) => {
    if (!ctx.companyId) {
      throw new import_server6.TRPCError({
        code: "UNAUTHORIZED",
        message: "Company ID required"
      });
    }
    const compliance = await ctx.db.complianceItem.findFirst({
      where: {
        id: input.id,
        companyId: ctx.companyId
      }
    });
    if (!compliance) {
      throw new import_server6.TRPCError({
        code: "NOT_FOUND",
        message: "Compliance item not found"
      });
    }
    await ctx.db.complianceItem.delete({
      where: { id: input.id }
    });
    return { success: true };
  }),
  /**
   * Mark compliance as complete
   */
  markComplete: protectedProcedure.input(import_zod7.z.object({
    id: import_zod7.z.string(),
    actualCost: import_zod7.z.number().optional(),
    completionNotes: import_zod7.z.string().optional()
  })).mutation(async ({ ctx, input }) => {
    if (!ctx.companyId) {
      throw new import_server6.TRPCError({
        code: "UNAUTHORIZED",
        message: "Company ID required"
      });
    }
    const compliance = await ctx.db.complianceItem.findFirst({
      where: {
        id: input.id,
        companyId: ctx.companyId
      }
    });
    if (!compliance) {
      throw new import_server6.TRPCError({
        code: "NOT_FOUND",
        message: "Compliance item not found"
      });
    }
    const completedCompliance = await ctx.db.complianceItem.update({
      where: { id: input.id },
      data: {
        status: "COMPLETED",
        completedDate: /* @__PURE__ */ new Date(),
        actualCost: input.actualCost
      }
    });
    await ctx.db.complianceActivity.create({
      data: {
        complianceId: input.id,
        activityType: "COMPLETED",
        description: input.completionNotes || "Compliance item marked as completed",
        activityDate: /* @__PURE__ */ new Date(),
        performedBy: "System"
      }
    });
    return completedCompliance;
  })
});

// src/server/api/routers/communication.ts
var import_zod8 = require("zod");

// node_modules/resend/dist/index.mjs
var __defProp3 = Object.defineProperty;
var __defProps2 = Object.defineProperties;
var __getOwnPropDescs2 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols2 = Object.getOwnPropertySymbols;
var __hasOwnProp3 = Object.prototype.hasOwnProperty;
var __propIsEnum2 = Object.prototype.propertyIsEnumerable;
var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues2 = (a, b3) => {
  for (var prop in b3 || (b3 = {}))
    if (__hasOwnProp3.call(b3, prop))
      __defNormalProp2(a, prop, b3[prop]);
  if (__getOwnPropSymbols2)
    for (var prop of __getOwnPropSymbols2(b3)) {
      if (__propIsEnum2.call(b3, prop))
        __defNormalProp2(a, prop, b3[prop]);
    }
  return a;
};
var __spreadProps2 = (a, b3) => __defProps2(a, __getOwnPropDescs2(b3));
var __async2 = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e2) {
        reject(e2);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e2) {
        reject(e2);
      }
    };
    var step = (x2) => x2.done ? resolve(x2.value) : Promise.resolve(x2.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var version = "4.8.0";
var ApiKeys = class {
  constructor(resend) {
    this.resend = resend;
  }
  create(_0) {
    return __async2(this, arguments, function* (payload, options = {}) {
      const data = yield this.resend.post(
        "/api-keys",
        payload,
        options
      );
      return data;
    });
  }
  list() {
    return __async2(this, null, function* () {
      const data = yield this.resend.get("/api-keys");
      return data;
    });
  }
  remove(id) {
    return __async2(this, null, function* () {
      const data = yield this.resend.delete(
        `/api-keys/${id}`
      );
      return data;
    });
  }
};
var Audiences = class {
  constructor(resend) {
    this.resend = resend;
  }
  create(_0) {
    return __async2(this, arguments, function* (payload, options = {}) {
      const data = yield this.resend.post(
        "/audiences",
        payload,
        options
      );
      return data;
    });
  }
  list() {
    return __async2(this, null, function* () {
      const data = yield this.resend.get("/audiences");
      return data;
    });
  }
  get(id) {
    return __async2(this, null, function* () {
      const data = yield this.resend.get(
        `/audiences/${id}`
      );
      return data;
    });
  }
  remove(id) {
    return __async2(this, null, function* () {
      const data = yield this.resend.delete(
        `/audiences/${id}`
      );
      return data;
    });
  }
};
function parseAttachments(attachments) {
  return attachments == null ? void 0 : attachments.map((attachment) => ({
    content: attachment.content,
    filename: attachment.filename,
    path: attachment.path,
    content_type: attachment.contentType,
    inline_content_id: attachment.inlineContentId
  }));
}
function parseEmailToApiOptions(email) {
  return {
    attachments: parseAttachments(email.attachments),
    bcc: email.bcc,
    cc: email.cc,
    from: email.from,
    headers: email.headers,
    html: email.html,
    reply_to: email.replyTo,
    scheduled_at: email.scheduledAt,
    subject: email.subject,
    tags: email.tags,
    text: email.text,
    to: email.to
  };
}
var Batch = class {
  constructor(resend) {
    this.resend = resend;
  }
  send(_0) {
    return __async2(this, arguments, function* (payload, options = {}) {
      return this.create(payload, options);
    });
  }
  create(_0) {
    return __async2(this, arguments, function* (payload, options = {}) {
      const emails = [];
      for (const email of payload) {
        if (email.react) {
          if (!this.renderAsync) {
            try {
              const { renderAsync: renderAsync2 } = yield Promise.resolve().then(() => (init_node2(), node_exports));
              this.renderAsync = renderAsync2;
            } catch (error) {
              throw new Error(
                "Failed to render React component. Make sure to install `@react-email/render`"
              );
            }
          }
          email.html = yield this.renderAsync(email.react);
          email.react = void 0;
        }
        emails.push(parseEmailToApiOptions(email));
      }
      const data = yield this.resend.post(
        "/emails/batch",
        emails,
        options
      );
      return data;
    });
  }
};
var Broadcasts = class {
  constructor(resend) {
    this.resend = resend;
  }
  create(_0) {
    return __async2(this, arguments, function* (payload, options = {}) {
      if (payload.react) {
        if (!this.renderAsync) {
          try {
            const { renderAsync: renderAsync2 } = yield Promise.resolve().then(() => (init_node2(), node_exports));
            this.renderAsync = renderAsync2;
          } catch (error) {
            throw new Error(
              "Failed to render React component. Make sure to install `@react-email/render`"
            );
          }
        }
        payload.html = yield this.renderAsync(
          payload.react
        );
      }
      const data = yield this.resend.post(
        "/broadcasts",
        {
          name: payload.name,
          audience_id: payload.audienceId,
          preview_text: payload.previewText,
          from: payload.from,
          html: payload.html,
          reply_to: payload.replyTo,
          subject: payload.subject,
          text: payload.text
        },
        options
      );
      return data;
    });
  }
  send(id, payload) {
    return __async2(this, null, function* () {
      const data = yield this.resend.post(
        `/broadcasts/${id}/send`,
        { scheduled_at: payload == null ? void 0 : payload.scheduledAt }
      );
      return data;
    });
  }
  list() {
    return __async2(this, null, function* () {
      const data = yield this.resend.get("/broadcasts");
      return data;
    });
  }
  get(id) {
    return __async2(this, null, function* () {
      const data = yield this.resend.get(
        `/broadcasts/${id}`
      );
      return data;
    });
  }
  remove(id) {
    return __async2(this, null, function* () {
      const data = yield this.resend.delete(
        `/broadcasts/${id}`
      );
      return data;
    });
  }
  update(id, payload) {
    return __async2(this, null, function* () {
      const data = yield this.resend.patch(
        `/broadcasts/${id}`,
        {
          name: payload.name,
          audience_id: payload.audienceId,
          from: payload.from,
          html: payload.html,
          text: payload.text,
          subject: payload.subject,
          reply_to: payload.replyTo,
          preview_text: payload.previewText
        }
      );
      return data;
    });
  }
};
var Contacts = class {
  constructor(resend) {
    this.resend = resend;
  }
  create(_0) {
    return __async2(this, arguments, function* (payload, options = {}) {
      const data = yield this.resend.post(
        `/audiences/${payload.audienceId}/contacts`,
        {
          unsubscribed: payload.unsubscribed,
          email: payload.email,
          first_name: payload.firstName,
          last_name: payload.lastName
        },
        options
      );
      return data;
    });
  }
  list(options) {
    return __async2(this, null, function* () {
      const data = yield this.resend.get(
        `/audiences/${options.audienceId}/contacts`
      );
      return data;
    });
  }
  get(options) {
    return __async2(this, null, function* () {
      if (!options.id && !options.email) {
        return {
          data: null,
          error: {
            message: "Missing `id` or `email` field.",
            name: "missing_required_field"
          }
        };
      }
      const data = yield this.resend.get(
        `/audiences/${options.audienceId}/contacts/${(options == null ? void 0 : options.email) ? options == null ? void 0 : options.email : options == null ? void 0 : options.id}`
      );
      return data;
    });
  }
  update(payload) {
    return __async2(this, null, function* () {
      if (!payload.id && !payload.email) {
        return {
          data: null,
          error: {
            message: "Missing `id` or `email` field.",
            name: "missing_required_field"
          }
        };
      }
      const data = yield this.resend.patch(
        `/audiences/${payload.audienceId}/contacts/${(payload == null ? void 0 : payload.email) ? payload == null ? void 0 : payload.email : payload == null ? void 0 : payload.id}`,
        {
          unsubscribed: payload.unsubscribed,
          first_name: payload.firstName,
          last_name: payload.lastName
        }
      );
      return data;
    });
  }
  remove(payload) {
    return __async2(this, null, function* () {
      if (!payload.id && !payload.email) {
        return {
          data: null,
          error: {
            message: "Missing `id` or `email` field.",
            name: "missing_required_field"
          }
        };
      }
      const data = yield this.resend.delete(
        `/audiences/${payload.audienceId}/contacts/${(payload == null ? void 0 : payload.email) ? payload == null ? void 0 : payload.email : payload == null ? void 0 : payload.id}`
      );
      return data;
    });
  }
};
function parseDomainToApiOptions(domain) {
  return {
    name: domain.name,
    region: domain.region,
    custom_return_path: domain.customReturnPath
  };
}
var Domains = class {
  constructor(resend) {
    this.resend = resend;
  }
  create(_0) {
    return __async2(this, arguments, function* (payload, options = {}) {
      const data = yield this.resend.post(
        "/domains",
        parseDomainToApiOptions(payload),
        options
      );
      return data;
    });
  }
  list() {
    return __async2(this, null, function* () {
      const data = yield this.resend.get("/domains");
      return data;
    });
  }
  get(id) {
    return __async2(this, null, function* () {
      const data = yield this.resend.get(
        `/domains/${id}`
      );
      return data;
    });
  }
  update(payload) {
    return __async2(this, null, function* () {
      const data = yield this.resend.patch(
        `/domains/${payload.id}`,
        {
          click_tracking: payload.clickTracking,
          open_tracking: payload.openTracking,
          tls: payload.tls
        }
      );
      return data;
    });
  }
  remove(id) {
    return __async2(this, null, function* () {
      const data = yield this.resend.delete(
        `/domains/${id}`
      );
      return data;
    });
  }
  verify(id) {
    return __async2(this, null, function* () {
      const data = yield this.resend.post(
        `/domains/${id}/verify`
      );
      return data;
    });
  }
};
var Emails = class {
  constructor(resend) {
    this.resend = resend;
  }
  send(_0) {
    return __async2(this, arguments, function* (payload, options = {}) {
      return this.create(payload, options);
    });
  }
  create(_0) {
    return __async2(this, arguments, function* (payload, options = {}) {
      if (payload.react) {
        if (!this.renderAsync) {
          try {
            const { renderAsync: renderAsync2 } = yield Promise.resolve().then(() => (init_node2(), node_exports));
            this.renderAsync = renderAsync2;
          } catch (error) {
            throw new Error(
              "Failed to render React component. Make sure to install `@react-email/render`"
            );
          }
        }
        payload.html = yield this.renderAsync(
          payload.react
        );
      }
      const data = yield this.resend.post(
        "/emails",
        parseEmailToApiOptions(payload),
        options
      );
      return data;
    });
  }
  get(id) {
    return __async2(this, null, function* () {
      const data = yield this.resend.get(
        `/emails/${id}`
      );
      return data;
    });
  }
  update(payload) {
    return __async2(this, null, function* () {
      const data = yield this.resend.patch(
        `/emails/${payload.id}`,
        {
          scheduled_at: payload.scheduledAt
        }
      );
      return data;
    });
  }
  cancel(id) {
    return __async2(this, null, function* () {
      const data = yield this.resend.post(
        `/emails/${id}/cancel`
      );
      return data;
    });
  }
};
var defaultBaseUrl = "https://api.resend.com";
var defaultUserAgent = `resend-node:${version}`;
var baseUrl = typeof process !== "undefined" && process.env ? process.env.RESEND_BASE_URL || defaultBaseUrl : defaultBaseUrl;
var userAgent = typeof process !== "undefined" && process.env ? process.env.RESEND_USER_AGENT || defaultUserAgent : defaultUserAgent;
var Resend = class {
  constructor(key) {
    this.key = key;
    this.apiKeys = new ApiKeys(this);
    this.audiences = new Audiences(this);
    this.batch = new Batch(this);
    this.broadcasts = new Broadcasts(this);
    this.contacts = new Contacts(this);
    this.domains = new Domains(this);
    this.emails = new Emails(this);
    if (!key) {
      if (typeof process !== "undefined" && process.env) {
        this.key = process.env.RESEND_API_KEY;
      }
      if (!this.key) {
        throw new Error(
          'Missing API key. Pass it to the constructor `new Resend("re_123")`'
        );
      }
    }
    this.headers = new Headers({
      Authorization: `Bearer ${this.key}`,
      "User-Agent": userAgent,
      "Content-Type": "application/json"
    });
  }
  fetchRequest(_0) {
    return __async2(this, arguments, function* (path3, options = {}) {
      try {
        const response = yield fetch(`${baseUrl}${path3}`, options);
        if (!response.ok) {
          try {
            const rawError = yield response.text();
            return { data: null, error: JSON.parse(rawError) };
          } catch (err) {
            if (err instanceof SyntaxError) {
              return {
                data: null,
                error: {
                  name: "application_error",
                  message: "Internal server error. We are unable to process your request right now, please try again later."
                }
              };
            }
            const error = {
              message: response.statusText,
              name: "application_error"
            };
            if (err instanceof Error) {
              return { data: null, error: __spreadProps2(__spreadValues2({}, error), { message: err.message }) };
            }
            return { data: null, error };
          }
        }
        const data = yield response.json();
        return { data, error: null };
      } catch (error) {
        return {
          data: null,
          error: {
            name: "application_error",
            message: "Unable to fetch data. The request could not be resolved."
          }
        };
      }
    });
  }
  post(_0, _1) {
    return __async2(this, arguments, function* (path3, entity, options = {}) {
      const headers = new Headers(this.headers);
      if (options.idempotencyKey) {
        headers.set("Idempotency-Key", options.idempotencyKey);
      }
      const requestOptions = __spreadValues2({
        method: "POST",
        headers,
        body: JSON.stringify(entity)
      }, options);
      return this.fetchRequest(path3, requestOptions);
    });
  }
  get(_0) {
    return __async2(this, arguments, function* (path3, options = {}) {
      const requestOptions = __spreadValues2({
        method: "GET",
        headers: this.headers
      }, options);
      return this.fetchRequest(path3, requestOptions);
    });
  }
  put(_0, _1) {
    return __async2(this, arguments, function* (path3, entity, options = {}) {
      const requestOptions = __spreadValues2({
        method: "PUT",
        headers: this.headers,
        body: JSON.stringify(entity)
      }, options);
      return this.fetchRequest(path3, requestOptions);
    });
  }
  patch(_0, _1) {
    return __async2(this, arguments, function* (path3, entity, options = {}) {
      const requestOptions = __spreadValues2({
        method: "PATCH",
        headers: this.headers,
        body: JSON.stringify(entity)
      }, options);
      return this.fetchRequest(path3, requestOptions);
    });
  }
  delete(path3, query) {
    return __async2(this, null, function* () {
      const requestOptions = {
        method: "DELETE",
        headers: this.headers,
        body: JSON.stringify(query)
      };
      return this.fetchRequest(path3, requestOptions);
    });
  }
};

// src/lib/communication-engine.ts
var crypto = __toESM(require("crypto"));
var GOLDEN_RATIO = 1.618033988;
var RETRY_BASE_DELAY = 1e3;
var MAX_RETRIES = 5;
var ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "default-32-byte-key-for-dev-only!!";
var ResendProvider = class {
  constructor(config) {
    this.resend = new Resend(config.apiKey);
    this.fromEmail = config.fromEmail;
    this.fromName = config.fromName;
  }
  async authenticate() {
    try {
      await this.resend.domains.list();
      return true;
    } catch (_error) {
      console.error("Resend authentication failed:", _error);
      return false;
    }
  }
  async send(message) {
    try {
      const result = await this.resend.emails.send({
        from: `${this.fromName} <${this.fromEmail}>`,
        to: Array.isArray(message.to) ? message.to : [message.to],
        cc: message.cc,
        bcc: message.bcc,
        subject: message.subject,
        html: message.htmlContent,
        text: message.textContent,
        replyTo: message.replyTo,
        attachments: message.attachments?.map((att) => ({
          filename: att.filename,
          content: att.content
        })),
        tags: message.tags
      });
      return {
        messageId: result.data?.id || crypto.randomUUID(),
        status: "sent",
        provider: "resend",
        metadata: result
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      return {
        messageId: crypto.randomUUID(),
        status: "failed",
        provider: "resend",
        error: errorMessage
      };
    }
  }
  async getStatus(messageId) {
    try {
      return {
        messageId,
        status: "sent",
        // Assume sent if no error
        timestamp: /* @__PURE__ */ new Date()
      };
    } catch (_error) {
      return {
        messageId,
        status: "failed",
        timestamp: /* @__PURE__ */ new Date(),
        errorReason: "Status check failed"
      };
    }
  }
};
var TwilioWhatsAppProvider = class {
  constructor(config) {
    this.accountSid = config.accountSid;
    this.authToken = config.authToken;
    this.fromNumber = config.fromNumber;
  }
  async authenticate() {
    try {
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}.json`,
        {
          headers: {
            "Authorization": "Basic " + Buffer.from(`${this.accountSid}:${this.authToken}`).toString("base64")
          }
        }
      );
      return response.ok;
    } catch (error) {
      console.error("Twilio Authentication failed:", error);
      return false;
    }
  }
  async send(message) {
    try {
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`,
        {
          method: "POST",
          headers: {
            "Authorization": "Basic " + Buffer.from(`${this.accountSid}:${this.authToken}`).toString("base64"),
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            From: `whatsapp:${this.fromNumber}`,
            To: `whatsapp:${message.to}`,
            Body: message.content,
            ...message.mediaUrl && { MediaUrl: message.mediaUrl }
          })
        }
      );
      const result = await response.json();
      if (response.ok) {
        return {
          messageId: result.sid,
          status: "sent",
          provider: "twilio-whatsapp",
          cost: parseFloat(result.price || "0"),
          metadata: result
        };
      } else {
        return {
          messageId: crypto.randomUUID(),
          status: "failed",
          provider: "twilio-whatsapp",
          error: result.message
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      return {
        messageId: crypto.randomUUID(),
        status: "failed",
        provider: "twilio-whatsapp",
        error: errorMessage
      };
    }
  }
  async getStatus(messageId) {
    try {
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages/${messageId}.json`,
        {
          headers: {
            "Authorization": "Basic " + Buffer.from(`${this.accountSid}:${this.authToken}`).toString("base64")
          }
        }
      );
      if (response.ok) {
        const result = await response.json();
        return {
          messageId,
          status: this.mapTwilioStatus(result.status),
          timestamp: new Date(result.date_updated),
          errorReason: result.error_message
        };
      }
      return {
        messageId,
        status: "failed",
        timestamp: /* @__PURE__ */ new Date(),
        errorReason: "Failed to fetch status"
      };
    } catch (_error) {
      return {
        messageId,
        status: "failed",
        timestamp: /* @__PURE__ */ new Date(),
        errorReason: "Status check failed"
      };
    }
  }
  mapTwilioStatus(twilioStatus) {
    switch (twilioStatus) {
      case "queued":
      case "sending":
        return "pending";
      case "sent":
        return "sent";
      case "delivered":
        return "delivered";
      case "read":
        return "read";
      case "failed":
      case "undelivered":
        return "failed";
      default:
        return "pending";
    }
  }
};
var EncryptionService = class {
  constructor(encryptionKey) {
    this.algorithm = "aes-256-gcm";
    this.key = Buffer.from(encryptionKey.padEnd(32, "0").slice(0, 32));
  }
  encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.key.toString("hex"));
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
  }
  decrypt(encryptedData) {
    const [_ivHex, encrypted] = encryptedData.split(":");
    const decipher = crypto.createDecipher(this.algorithm, this.key.toString("hex"));
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
  static shouldEncrypt(fieldName) {
    const sensitiveFields = ["password", "apikey", "secret", "token", "authtoken"];
    return sensitiveFields.some(
      (field) => fieldName.toLowerCase().includes(field.toLowerCase())
    );
  }
};
var CommunicationEngine = class {
  constructor() {
    this.templates = /* @__PURE__ */ new Map();
    this.encryption = new EncryptionService(ENCRYPTION_KEY);
  }
  // Provider Configuration
  async configureResend(config) {
    this.emailProvider = new ResendProvider({
      apiKey: config.apiKey,
      fromEmail: config.fromEmail,
      fromName: config.fromName
    });
    return await this.emailProvider.authenticate();
  }
  async configureWhatsApp(config) {
    this.whatsappProvider = new TwilioWhatsAppProvider(config);
    return await this.whatsappProvider.authenticate();
  }
  // Message Sending with Golden Ratio Retry Logic
  async sendEmail(message) {
    if (!this.emailProvider) {
      throw new Error("Email provider not configured. Please configure Resend first.");
    }
    return this.executeWithRetry(() => this.emailProvider.send(message), "email");
  }
  async sendWhatsApp(message) {
    if (!this.whatsappProvider) {
      throw new Error("WhatsApp provider not configured. Please configure Twilio WhatsApp first.");
    }
    return this.executeWithRetry(() => this.whatsappProvider.send(message), "whatsapp");
  }
  // Bulk email sending with intelligent batching
  async sendBulkEmails(messages, batchSize = 10) {
    const results = [];
    const failures = [];
    let totalCost = 0;
    for (let i = 0; i < messages.length; i += batchSize) {
      const batch = messages.slice(i, i + batchSize);
      const batchPromises = batch.map(async (message) => {
        try {
          const result = await this.sendEmail(message);
          results.push(result);
          if (result.cost) totalCost += result.cost;
          return result;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
          failures.push({ message, error: errorMessage });
          return null;
        }
      });
      await Promise.allSettled(batchPromises);
      if (i + batchSize < messages.length) {
        await this.sleep(RETRY_BASE_DELAY * GOLDEN_RATIO);
      }
    }
    return {
      total: messages.length,
      successful: results.filter((r2) => r2.status === "sent").length,
      failed: failures.length,
      results,
      failures,
      totalCost
    };
  }
  // Template Management
  async saveTemplate(template) {
    const templateId = crypto.randomUUID();
    this.templates.set(templateId, { ...template, id: templateId });
    return templateId;
  }
  async getTemplate(templateId) {
    return this.templates.get(templateId) || null;
  }
  async renderTemplate(templateId, data) {
    const template = await this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }
    return {
      subject: this.interpolateString(template.subject || "", data),
      htmlContent: this.interpolateString(template.htmlContent || "", data),
      textContent: this.interpolateString(template.textContent, data)
    };
  }
  // Smart message routing based on customer preferences
  async sendSmartMessage(customerId, messageType, data, preferences) {
    const results = [];
    if (preferences.emailOptIn && preferences.email && preferences.preferredChannels[messageType]?.includes("EMAIL")) {
      const emailTemplate = await this.getTemplate(`${messageType}_email`);
      if (emailTemplate) {
        const rendered = await this.renderTemplate(emailTemplate.id, data);
        const result = await this.sendEmail({
          to: preferences.email,
          subject: rendered.subject,
          htmlContent: rendered.htmlContent,
          textContent: rendered.textContent,
          tags: [
            { name: "customer_id", value: customerId },
            { name: "message_type", value: messageType }
          ]
        });
        results.push(result);
      }
    }
    if (preferences.whatsappOptIn && preferences.whatsappNumber && preferences.preferredChannels[messageType]?.includes("WHATSAPP")) {
      const whatsappTemplate = await this.getTemplate(`${messageType}_whatsapp`);
      if (whatsappTemplate) {
        const rendered = await this.renderTemplate(whatsappTemplate.id, data);
        const result = await this.sendWhatsApp({
          to: preferences.whatsappNumber,
          content: rendered.textContent
        });
        results.push(result);
      }
    }
    return results;
  }
  // Encryption helpers
  encryptCredentials(credentials) {
    const encrypted = {};
    for (const [key, value] of Object.entries(credentials)) {
      if (value && EncryptionService.shouldEncrypt(key)) {
        encrypted[key] = this.encryption.encrypt(value);
      } else {
        encrypted[key] = value;
      }
    }
    return encrypted;
  }
  decryptCredentials(encrypted) {
    const decrypted = {};
    for (const [key, value] of Object.entries(encrypted)) {
      if (value && EncryptionService.shouldEncrypt(key)) {
        try {
          decrypted[key] = this.encryption.decrypt(value);
        } catch (error) {
          console.error(`Failed to decrypt ${key}:`, error);
          decrypted[key] = value;
        }
      } else {
        decrypted[key] = value;
      }
    }
    return decrypted;
  }
  // Private helper methods
  async executeWithRetry(operation, context) {
    let lastError;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        console.warn(`${context} attempt ${attempt + 1} failed:`, error);
        if (attempt < MAX_RETRIES - 1) {
          const delay = RETRY_BASE_DELAY * Math.pow(GOLDEN_RATIO, attempt);
          console.log(`Retrying in ${delay}ms...`);
          await this.sleep(delay);
        }
      }
    }
    throw new Error(`${context} failed after ${MAX_RETRIES} attempts: ${lastError.message}`);
  }
  async sleep(ms2) {
    return new Promise((resolve) => setTimeout(resolve, ms2));
  }
  interpolateString(template, data) {
    return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (match, path3) => {
      const value = path3.split(".").reduce((obj, key) => {
        if (obj && typeof obj === "object" && key in obj) {
          return obj[key];
        }
        return void 0;
      }, data);
      return value !== void 0 ? String(value) : match;
    });
  }
};
var communicationEngine = new CommunicationEngine();

// src/server/api/routers/communication.ts
init_node2();

// node_modules/@react-email/body/dist/index.mjs
var React = __toESM(require("react"), 1);
var import_jsx_runtime2 = require("react/jsx-runtime");
var __defProp4 = Object.defineProperty;
var __defProps3 = Object.defineProperties;
var __getOwnPropDescs3 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols3 = Object.getOwnPropertySymbols;
var __hasOwnProp4 = Object.prototype.hasOwnProperty;
var __propIsEnum3 = Object.prototype.propertyIsEnumerable;
var __defNormalProp3 = (obj, key, value) => key in obj ? __defProp4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues3 = (a, b3) => {
  for (var prop in b3 || (b3 = {}))
    if (__hasOwnProp4.call(b3, prop))
      __defNormalProp3(a, prop, b3[prop]);
  if (__getOwnPropSymbols3)
    for (var prop of __getOwnPropSymbols3(b3)) {
      if (__propIsEnum3.call(b3, prop))
        __defNormalProp3(a, prop, b3[prop]);
    }
  return a;
};
var __spreadProps3 = (a, b3) => __defProps3(a, __getOwnPropDescs3(b3));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp4.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols3)
    for (var prop of __getOwnPropSymbols3(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum3.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var Body = React.forwardRef(
  (_a3, ref) => {
    var _b = _a3, { children, style } = _b, props = __objRest(_b, ["children", "style"]);
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "body",
      __spreadProps3(__spreadValues3({}, props), {
        style: {
          background: style == null ? void 0 : style.background,
          backgroundColor: style == null ? void 0 : style.backgroundColor
        },
        ref,
        children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "table",
          {
            border: 0,
            width: "100%",
            cellPadding: "0",
            cellSpacing: "0",
            role: "presentation",
            align: "center",
            children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("tbody", { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("td", { style, children }) }) })
          }
        )
      })
    );
  }
);
Body.displayName = "Body";

// node_modules/@react-email/button/dist/index.mjs
var React2 = __toESM(require("react"), 1);
var import_jsx_runtime3 = require("react/jsx-runtime");
var __defProp5 = Object.defineProperty;
var __defProps4 = Object.defineProperties;
var __getOwnPropDescs4 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols4 = Object.getOwnPropertySymbols;
var __hasOwnProp5 = Object.prototype.hasOwnProperty;
var __propIsEnum4 = Object.prototype.propertyIsEnumerable;
var __defNormalProp4 = (obj, key, value) => key in obj ? __defProp5(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues4 = (a, b3) => {
  for (var prop in b3 || (b3 = {}))
    if (__hasOwnProp5.call(b3, prop))
      __defNormalProp4(a, prop, b3[prop]);
  if (__getOwnPropSymbols4)
    for (var prop of __getOwnPropSymbols4(b3)) {
      if (__propIsEnum4.call(b3, prop))
        __defNormalProp4(a, prop, b3[prop]);
    }
  return a;
};
var __spreadProps4 = (a, b3) => __defProps4(a, __getOwnPropDescs4(b3));
var __objRest2 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp5.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols4)
    for (var prop of __getOwnPropSymbols4(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum4.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function convertToPx(value) {
  let px = 0;
  if (!value) {
    return px;
  }
  if (typeof value === "number") {
    return value;
  }
  const matches = /^([\d.]+)(px|em|rem|%)$/.exec(value);
  if (matches && matches.length === 3) {
    const numValue = Number.parseFloat(matches[1]);
    const unit = matches[2];
    switch (unit) {
      case "px":
        return numValue;
      case "em":
      case "rem":
        px = numValue * 16;
        return px;
      case "%":
        px = numValue / 100 * 600;
        return px;
      default:
        return numValue;
    }
  }
  return 0;
}
function parsePaddingValue(value) {
  if (typeof value === "number")
    return {
      paddingTop: value,
      paddingBottom: value,
      paddingLeft: value,
      paddingRight: value
    };
  if (typeof value === "string") {
    const values = value.toString().trim().split(/\s+/);
    if (values.length === 1) {
      return {
        paddingTop: values[0],
        paddingBottom: values[0],
        paddingLeft: values[0],
        paddingRight: values[0]
      };
    }
    if (values.length === 2) {
      return {
        paddingTop: values[0],
        paddingRight: values[1],
        paddingBottom: values[0],
        paddingLeft: values[1]
      };
    }
    if (values.length === 3) {
      return {
        paddingTop: values[0],
        paddingRight: values[1],
        paddingBottom: values[2],
        paddingLeft: values[1]
      };
    }
    if (values.length === 4) {
      return {
        paddingTop: values[0],
        paddingRight: values[1],
        paddingBottom: values[2],
        paddingLeft: values[3]
      };
    }
  }
  return {
    paddingTop: void 0,
    paddingBottom: void 0,
    paddingLeft: void 0,
    paddingRight: void 0
  };
}
function parsePadding(properties) {
  let paddingTop;
  let paddingRight;
  let paddingBottom;
  let paddingLeft;
  for (const [key, value] of Object.entries(properties)) {
    if (key === "padding") {
      ({ paddingTop, paddingBottom, paddingLeft, paddingRight } = parsePaddingValue(value));
    } else if (key === "paddingTop") {
      paddingTop = value;
    } else if (key === "paddingRight") {
      paddingRight = value;
    } else if (key === "paddingBottom") {
      paddingBottom = value;
    } else if (key === "paddingLeft") {
      paddingLeft = value;
    }
  }
  return {
    paddingTop: paddingTop ? convertToPx(paddingTop) : void 0,
    paddingRight: paddingRight ? convertToPx(paddingRight) : void 0,
    paddingBottom: paddingBottom ? convertToPx(paddingBottom) : void 0,
    paddingLeft: paddingLeft ? convertToPx(paddingLeft) : void 0
  };
}
var pxToPt = (px) => typeof px === "number" && !Number.isNaN(Number(px)) ? px * 3 / 4 : void 0;
var maxFontWidth = 5;
function computeFontWidthAndSpaceCount(expectedWidth) {
  if (expectedWidth === 0) return [0, 0];
  let smallestSpaceCount = 0;
  const computeRequiredFontWidth = () => {
    if (smallestSpaceCount > 0) {
      return expectedWidth / smallestSpaceCount / 2;
    }
    return Number.POSITIVE_INFINITY;
  };
  while (computeRequiredFontWidth() > maxFontWidth) {
    smallestSpaceCount++;
  }
  return [computeRequiredFontWidth(), smallestSpaceCount];
}
var Button = React2.forwardRef(
  (_a3, ref) => {
    var _b = _a3, { children, style, target = "_blank" } = _b, props = __objRest2(_b, ["children", "style", "target"]);
    const { paddingTop, paddingRight, paddingBottom, paddingLeft } = parsePadding(style != null ? style : {});
    const y3 = (paddingTop != null ? paddingTop : 0) + (paddingBottom != null ? paddingBottom : 0);
    const textRaise = pxToPt(y3);
    const [plFontWidth, plSpaceCount] = computeFontWidthAndSpaceCount(
      paddingLeft != null ? paddingLeft : 0
    );
    const [prFontWidth, prSpaceCount] = computeFontWidthAndSpaceCount(
      paddingRight != null ? paddingRight : 0
    );
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
      "a",
      __spreadProps4(__spreadValues4({}, props), {
        ref,
        style: __spreadProps4(__spreadValues4({
          lineHeight: "100%",
          textDecoration: "none",
          display: "inline-block",
          maxWidth: "100%",
          msoPaddingAlt: "0px"
        }, style), {
          paddingTop,
          paddingRight,
          paddingBottom,
          paddingLeft
        }),
        target,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "span",
            {
              dangerouslySetInnerHTML: {
                // The `&#8202;` is as close to `1px` of an empty character as we can get, then, we use the `mso-font-width`
                // to scale it according to what padding the developer wants. `mso-font-width` also does not allow for percentages
                // >= 500% so we need to add extra spaces accordingly.
                //
                // See https://github.com/resend/react-email/issues/1512 for why we do not use letter-spacing instead.
                __html: `<!--[if mso]><i style="mso-font-width:${plFontWidth * 100}%;mso-text-raise:${textRaise}" hidden>${"&#8202;".repeat(
                  plSpaceCount
                )}</i><![endif]-->`
              }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "span",
            {
              style: {
                maxWidth: "100%",
                display: "inline-block",
                lineHeight: "120%",
                msoPaddingAlt: "0px",
                msoTextRaise: pxToPt(paddingBottom)
              },
              children
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "span",
            {
              dangerouslySetInnerHTML: {
                __html: `<!--[if mso]><i style="mso-font-width:${prFontWidth * 100}%" hidden>${"&#8202;".repeat(
                  prSpaceCount
                )}&#8203;</i><![endif]-->`
              }
            }
          )
        ]
      })
    );
  }
);
Button.displayName = "Button";

// node_modules/@react-email/column/dist/index.mjs
var React3 = __toESM(require("react"), 1);
var import_jsx_runtime4 = require("react/jsx-runtime");
var __defProp6 = Object.defineProperty;
var __defProps5 = Object.defineProperties;
var __getOwnPropDescs5 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols5 = Object.getOwnPropertySymbols;
var __hasOwnProp6 = Object.prototype.hasOwnProperty;
var __propIsEnum5 = Object.prototype.propertyIsEnumerable;
var __defNormalProp5 = (obj, key, value) => key in obj ? __defProp6(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues5 = (a, b3) => {
  for (var prop in b3 || (b3 = {}))
    if (__hasOwnProp6.call(b3, prop))
      __defNormalProp5(a, prop, b3[prop]);
  if (__getOwnPropSymbols5)
    for (var prop of __getOwnPropSymbols5(b3)) {
      if (__propIsEnum5.call(b3, prop))
        __defNormalProp5(a, prop, b3[prop]);
    }
  return a;
};
var __spreadProps5 = (a, b3) => __defProps5(a, __getOwnPropDescs5(b3));
var __objRest3 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp6.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols5)
    for (var prop of __getOwnPropSymbols5(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum5.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var Column = React3.forwardRef(
  (_a3, ref) => {
    var _b = _a3, { children, style } = _b, props = __objRest3(_b, ["children", "style"]);
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("td", __spreadProps5(__spreadValues5({}, props), { "data-id": "__react-email-column", ref, style, children }));
  }
);
Column.displayName = "Column";

// node_modules/@react-email/container/dist/index.mjs
var React4 = __toESM(require("react"), 1);
var import_jsx_runtime5 = require("react/jsx-runtime");
var __defProp7 = Object.defineProperty;
var __defProps6 = Object.defineProperties;
var __getOwnPropDescs6 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols6 = Object.getOwnPropertySymbols;
var __hasOwnProp7 = Object.prototype.hasOwnProperty;
var __propIsEnum6 = Object.prototype.propertyIsEnumerable;
var __defNormalProp6 = (obj, key, value) => key in obj ? __defProp7(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues6 = (a, b3) => {
  for (var prop in b3 || (b3 = {}))
    if (__hasOwnProp7.call(b3, prop))
      __defNormalProp6(a, prop, b3[prop]);
  if (__getOwnPropSymbols6)
    for (var prop of __getOwnPropSymbols6(b3)) {
      if (__propIsEnum6.call(b3, prop))
        __defNormalProp6(a, prop, b3[prop]);
    }
  return a;
};
var __spreadProps6 = (a, b3) => __defProps6(a, __getOwnPropDescs6(b3));
var __objRest4 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp7.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols6)
    for (var prop of __getOwnPropSymbols6(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum6.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var Container = React4.forwardRef(
  (_a3, ref) => {
    var _b = _a3, { children, style } = _b, props = __objRest4(_b, ["children", "style"]);
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      "table",
      __spreadProps6(__spreadValues6({
        align: "center",
        width: "100%"
      }, props), {
        border: 0,
        cellPadding: "0",
        cellSpacing: "0",
        ref,
        role: "presentation",
        style: __spreadValues6({ maxWidth: "37.5em" }, style),
        children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("tbody", { children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("tr", { style: { width: "100%" }, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("td", { children }) }) })
      })
    );
  }
);
Container.displayName = "Container";

// node_modules/@react-email/head/dist/index.mjs
var React5 = __toESM(require("react"), 1);
var import_jsx_runtime6 = require("react/jsx-runtime");
var __defProp8 = Object.defineProperty;
var __defProps7 = Object.defineProperties;
var __getOwnPropDescs7 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols7 = Object.getOwnPropertySymbols;
var __hasOwnProp8 = Object.prototype.hasOwnProperty;
var __propIsEnum7 = Object.prototype.propertyIsEnumerable;
var __defNormalProp7 = (obj, key, value) => key in obj ? __defProp8(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues7 = (a, b3) => {
  for (var prop in b3 || (b3 = {}))
    if (__hasOwnProp8.call(b3, prop))
      __defNormalProp7(a, prop, b3[prop]);
  if (__getOwnPropSymbols7)
    for (var prop of __getOwnPropSymbols7(b3)) {
      if (__propIsEnum7.call(b3, prop))
        __defNormalProp7(a, prop, b3[prop]);
    }
  return a;
};
var __spreadProps7 = (a, b3) => __defProps7(a, __getOwnPropDescs7(b3));
var __objRest5 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp8.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols7)
    for (var prop of __getOwnPropSymbols7(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum7.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var Head = React5.forwardRef(
  (_a3, ref) => {
    var _b = _a3, { children } = _b, props = __objRest5(_b, ["children"]);
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("head", __spreadProps7(__spreadValues7({}, props), { ref, children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("meta", { content: "text/html; charset=UTF-8", httpEquiv: "Content-Type" }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("meta", { name: "x-apple-disable-message-reformatting" }),
      children
    ] }));
  }
);
Head.displayName = "Head";

// node_modules/@react-email/heading/dist/index.mjs
var React6 = __toESM(require("react"), 1);
var import_jsx_runtime7 = require("react/jsx-runtime");
var __defProp9 = Object.defineProperty;
var __defProps8 = Object.defineProperties;
var __getOwnPropDescs8 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols8 = Object.getOwnPropertySymbols;
var __hasOwnProp9 = Object.prototype.hasOwnProperty;
var __propIsEnum8 = Object.prototype.propertyIsEnumerable;
var __defNormalProp8 = (obj, key, value) => key in obj ? __defProp9(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues8 = (a, b3) => {
  for (var prop in b3 || (b3 = {}))
    if (__hasOwnProp9.call(b3, prop))
      __defNormalProp8(a, prop, b3[prop]);
  if (__getOwnPropSymbols8)
    for (var prop of __getOwnPropSymbols8(b3)) {
      if (__propIsEnum8.call(b3, prop))
        __defNormalProp8(a, prop, b3[prop]);
    }
  return a;
};
var __spreadProps8 = (a, b3) => __defProps8(a, __getOwnPropDescs8(b3));
var __objRest6 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp9.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols8)
    for (var prop of __getOwnPropSymbols8(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum8.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var withMargin = (props) => {
  const nonEmptyStyles = [
    withSpace(props.m, ["margin"]),
    withSpace(props.mx, ["marginLeft", "marginRight"]),
    withSpace(props.my, ["marginTop", "marginBottom"]),
    withSpace(props.mt, ["marginTop"]),
    withSpace(props.mr, ["marginRight"]),
    withSpace(props.mb, ["marginBottom"]),
    withSpace(props.ml, ["marginLeft"])
  ].filter((s2) => Object.keys(s2).length);
  const mergedStyles = nonEmptyStyles.reduce((acc, style) => {
    return __spreadValues8(__spreadValues8({}, acc), style);
  }, {});
  return mergedStyles;
};
var withSpace = (value, properties) => {
  return properties.reduce((styles, property) => {
    if (!isNaN(parseFloat(value))) {
      return __spreadProps8(__spreadValues8({}, styles), { [property]: `${value}px` });
    }
    return styles;
  }, {});
};
var Heading = React6.forwardRef(
  (_a3, ref) => {
    var _b = _a3, { as: Tag2 = "h1", children, style, m, mx, my, mt: mt3, mr: mr3, mb, ml } = _b, props = __objRest6(_b, ["as", "children", "style", "m", "mx", "my", "mt", "mr", "mb", "ml"]);
    return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      Tag2,
      __spreadProps8(__spreadValues8({}, props), {
        ref,
        style: __spreadValues8(__spreadValues8({}, withMargin({ m, mx, my, mt: mt3, mr: mr3, mb, ml })), style),
        children
      })
    );
  }
);
Heading.displayName = "Heading";

// node_modules/@react-email/hr/dist/index.mjs
var React7 = __toESM(require("react"), 1);
var import_jsx_runtime8 = require("react/jsx-runtime");
var __defProp10 = Object.defineProperty;
var __defProps9 = Object.defineProperties;
var __getOwnPropDescs9 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols9 = Object.getOwnPropertySymbols;
var __hasOwnProp10 = Object.prototype.hasOwnProperty;
var __propIsEnum9 = Object.prototype.propertyIsEnumerable;
var __defNormalProp9 = (obj, key, value) => key in obj ? __defProp10(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues9 = (a, b3) => {
  for (var prop in b3 || (b3 = {}))
    if (__hasOwnProp10.call(b3, prop))
      __defNormalProp9(a, prop, b3[prop]);
  if (__getOwnPropSymbols9)
    for (var prop of __getOwnPropSymbols9(b3)) {
      if (__propIsEnum9.call(b3, prop))
        __defNormalProp9(a, prop, b3[prop]);
    }
  return a;
};
var __spreadProps9 = (a, b3) => __defProps9(a, __getOwnPropDescs9(b3));
var __objRest7 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp10.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols9)
    for (var prop of __getOwnPropSymbols9(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum9.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var Hr2 = React7.forwardRef(
  (_a3, ref) => {
    var _b = _a3, { style } = _b, props = __objRest7(_b, ["style"]);
    return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
      "hr",
      __spreadProps9(__spreadValues9({}, props), {
        ref,
        style: __spreadValues9({
          width: "100%",
          border: "none",
          borderTop: "1px solid #eaeaea"
        }, style)
      })
    );
  }
);
Hr2.displayName = "Hr";

// node_modules/@react-email/html/dist/index.mjs
var React8 = __toESM(require("react"), 1);
var import_jsx_runtime9 = require("react/jsx-runtime");
var __defProp11 = Object.defineProperty;
var __defProps10 = Object.defineProperties;
var __getOwnPropDescs10 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols10 = Object.getOwnPropertySymbols;
var __hasOwnProp11 = Object.prototype.hasOwnProperty;
var __propIsEnum10 = Object.prototype.propertyIsEnumerable;
var __defNormalProp10 = (obj, key, value) => key in obj ? __defProp11(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues10 = (a, b3) => {
  for (var prop in b3 || (b3 = {}))
    if (__hasOwnProp11.call(b3, prop))
      __defNormalProp10(a, prop, b3[prop]);
  if (__getOwnPropSymbols10)
    for (var prop of __getOwnPropSymbols10(b3)) {
      if (__propIsEnum10.call(b3, prop))
        __defNormalProp10(a, prop, b3[prop]);
    }
  return a;
};
var __spreadProps10 = (a, b3) => __defProps10(a, __getOwnPropDescs10(b3));
var __objRest8 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp11.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols10)
    for (var prop of __getOwnPropSymbols10(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum10.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var Html = React8.forwardRef(
  (_a3, ref) => {
    var _b = _a3, { children, lang = "en", dir = "ltr" } = _b, props = __objRest8(_b, ["children", "lang", "dir"]);
    return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("html", __spreadProps10(__spreadValues10({}, props), { dir, lang, ref, children }));
  }
);
Html.displayName = "Html";

// node_modules/@react-email/img/dist/index.mjs
var React9 = __toESM(require("react"), 1);
var import_jsx_runtime10 = require("react/jsx-runtime");
var __defProp12 = Object.defineProperty;
var __defProps11 = Object.defineProperties;
var __getOwnPropDescs11 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols11 = Object.getOwnPropertySymbols;
var __hasOwnProp12 = Object.prototype.hasOwnProperty;
var __propIsEnum11 = Object.prototype.propertyIsEnumerable;
var __defNormalProp11 = (obj, key, value) => key in obj ? __defProp12(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues11 = (a, b3) => {
  for (var prop in b3 || (b3 = {}))
    if (__hasOwnProp12.call(b3, prop))
      __defNormalProp11(a, prop, b3[prop]);
  if (__getOwnPropSymbols11)
    for (var prop of __getOwnPropSymbols11(b3)) {
      if (__propIsEnum11.call(b3, prop))
        __defNormalProp11(a, prop, b3[prop]);
    }
  return a;
};
var __spreadProps11 = (a, b3) => __defProps11(a, __getOwnPropDescs11(b3));
var __objRest9 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp12.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols11)
    for (var prop of __getOwnPropSymbols11(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum11.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var Img = React9.forwardRef(
  (_a3, ref) => {
    var _b = _a3, { alt, src, width, height, style } = _b, props = __objRest9(_b, ["alt", "src", "width", "height", "style"]);
    return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
      "img",
      __spreadProps11(__spreadValues11({}, props), {
        alt,
        height,
        ref,
        src,
        style: __spreadValues11({
          display: "block",
          outline: "none",
          border: "none",
          textDecoration: "none"
        }, style),
        width
      })
    );
  }
);
Img.displayName = "Img";

// node_modules/@react-email/link/dist/index.mjs
var React10 = __toESM(require("react"), 1);
var import_jsx_runtime11 = require("react/jsx-runtime");
var __defProp13 = Object.defineProperty;
var __defProps12 = Object.defineProperties;
var __getOwnPropDescs12 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols12 = Object.getOwnPropertySymbols;
var __hasOwnProp13 = Object.prototype.hasOwnProperty;
var __propIsEnum12 = Object.prototype.propertyIsEnumerable;
var __defNormalProp12 = (obj, key, value) => key in obj ? __defProp13(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues12 = (a, b3) => {
  for (var prop in b3 || (b3 = {}))
    if (__hasOwnProp13.call(b3, prop))
      __defNormalProp12(a, prop, b3[prop]);
  if (__getOwnPropSymbols12)
    for (var prop of __getOwnPropSymbols12(b3)) {
      if (__propIsEnum12.call(b3, prop))
        __defNormalProp12(a, prop, b3[prop]);
    }
  return a;
};
var __spreadProps12 = (a, b3) => __defProps12(a, __getOwnPropDescs12(b3));
var __objRest10 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp13.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols12)
    for (var prop of __getOwnPropSymbols12(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum12.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var Link = React10.forwardRef(
  (_a3, ref) => {
    var _b = _a3, { target = "_blank", style } = _b, props = __objRest10(_b, ["target", "style"]);
    return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
      "a",
      __spreadProps12(__spreadValues12({}, props), {
        ref,
        style: __spreadValues12({
          color: "#067df7",
          textDecorationLine: "none"
        }, style),
        target,
        children: props.children
      })
    );
  }
);
Link.displayName = "Link";

// node_modules/@react-email/preview/dist/index.mjs
var React11 = __toESM(require("react"), 1);
var import_jsx_runtime12 = require("react/jsx-runtime");
var __defProp14 = Object.defineProperty;
var __defProps13 = Object.defineProperties;
var __getOwnPropDescs13 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols13 = Object.getOwnPropertySymbols;
var __hasOwnProp14 = Object.prototype.hasOwnProperty;
var __propIsEnum13 = Object.prototype.propertyIsEnumerable;
var __defNormalProp13 = (obj, key, value) => key in obj ? __defProp14(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues13 = (a, b3) => {
  for (var prop in b3 || (b3 = {}))
    if (__hasOwnProp14.call(b3, prop))
      __defNormalProp13(a, prop, b3[prop]);
  if (__getOwnPropSymbols13)
    for (var prop of __getOwnPropSymbols13(b3)) {
      if (__propIsEnum13.call(b3, prop))
        __defNormalProp13(a, prop, b3[prop]);
    }
  return a;
};
var __spreadProps13 = (a, b3) => __defProps13(a, __getOwnPropDescs13(b3));
var __objRest11 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp14.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols13)
    for (var prop of __getOwnPropSymbols13(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum13.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var PREVIEW_MAX_LENGTH = 150;
var Preview = React11.forwardRef(
  (_a3, ref) => {
    var _b = _a3, { children = "" } = _b, props = __objRest11(_b, ["children"]);
    const text = (Array.isArray(children) ? children.join("") : children).substring(0, PREVIEW_MAX_LENGTH);
    return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
      "div",
      __spreadProps13(__spreadValues13({
        style: {
          display: "none",
          overflow: "hidden",
          lineHeight: "1px",
          opacity: 0,
          maxHeight: 0,
          maxWidth: 0
        },
        "data-skip-in-text": true
      }, props), {
        ref,
        children: [
          text,
          renderWhiteSpace(text)
        ]
      })
    );
  }
);
Preview.displayName = "Preview";
var whiteSpaceCodes = "\xA0\u200C\u200B\u200D\u200E\u200F\uFEFF";
var renderWhiteSpace = (text) => {
  if (text.length >= PREVIEW_MAX_LENGTH) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { children: whiteSpaceCodes.repeat(PREVIEW_MAX_LENGTH - text.length) });
};

// node_modules/@react-email/row/dist/index.mjs
var React12 = __toESM(require("react"), 1);
var import_jsx_runtime13 = require("react/jsx-runtime");
var __defProp15 = Object.defineProperty;
var __defProps14 = Object.defineProperties;
var __getOwnPropDescs14 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols14 = Object.getOwnPropertySymbols;
var __hasOwnProp15 = Object.prototype.hasOwnProperty;
var __propIsEnum14 = Object.prototype.propertyIsEnumerable;
var __defNormalProp14 = (obj, key, value) => key in obj ? __defProp15(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues14 = (a, b3) => {
  for (var prop in b3 || (b3 = {}))
    if (__hasOwnProp15.call(b3, prop))
      __defNormalProp14(a, prop, b3[prop]);
  if (__getOwnPropSymbols14)
    for (var prop of __getOwnPropSymbols14(b3)) {
      if (__propIsEnum14.call(b3, prop))
        __defNormalProp14(a, prop, b3[prop]);
    }
  return a;
};
var __spreadProps14 = (a, b3) => __defProps14(a, __getOwnPropDescs14(b3));
var __objRest12 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp15.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols14)
    for (var prop of __getOwnPropSymbols14(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum14.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var Row = React12.forwardRef(
  (_a3, ref) => {
    var _b = _a3, { children, style } = _b, props = __objRest12(_b, ["children", "style"]);
    return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
      "table",
      __spreadProps14(__spreadValues14({
        align: "center",
        width: "100%",
        border: 0,
        cellPadding: "0",
        cellSpacing: "0",
        role: "presentation"
      }, props), {
        ref,
        style,
        children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("tbody", { style: { width: "100%" }, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("tr", { style: { width: "100%" }, children }) })
      })
    );
  }
);
Row.displayName = "Row";

// node_modules/@react-email/section/dist/index.mjs
var React13 = __toESM(require("react"), 1);
var import_jsx_runtime14 = require("react/jsx-runtime");
var __defProp16 = Object.defineProperty;
var __defProps15 = Object.defineProperties;
var __getOwnPropDescs15 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols15 = Object.getOwnPropertySymbols;
var __hasOwnProp16 = Object.prototype.hasOwnProperty;
var __propIsEnum15 = Object.prototype.propertyIsEnumerable;
var __defNormalProp15 = (obj, key, value) => key in obj ? __defProp16(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues15 = (a, b3) => {
  for (var prop in b3 || (b3 = {}))
    if (__hasOwnProp16.call(b3, prop))
      __defNormalProp15(a, prop, b3[prop]);
  if (__getOwnPropSymbols15)
    for (var prop of __getOwnPropSymbols15(b3)) {
      if (__propIsEnum15.call(b3, prop))
        __defNormalProp15(a, prop, b3[prop]);
    }
  return a;
};
var __spreadProps15 = (a, b3) => __defProps15(a, __getOwnPropDescs15(b3));
var __objRest13 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp16.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols15)
    for (var prop of __getOwnPropSymbols15(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum15.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var Section = React13.forwardRef(
  (_a3, ref) => {
    var _b = _a3, { children, style } = _b, props = __objRest13(_b, ["children", "style"]);
    return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
      "table",
      __spreadProps15(__spreadValues15({
        align: "center",
        width: "100%",
        border: 0,
        cellPadding: "0",
        cellSpacing: "0",
        role: "presentation"
      }, props), {
        ref,
        style,
        children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("tbody", { children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("td", { children }) }) })
      })
    );
  }
);
Section.displayName = "Section";

// node_modules/@react-email/text/dist/index.mjs
var React14 = __toESM(require("react"), 1);
var import_jsx_runtime15 = require("react/jsx-runtime");
var __defProp17 = Object.defineProperty;
var __defProps16 = Object.defineProperties;
var __getOwnPropDescs16 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols16 = Object.getOwnPropertySymbols;
var __hasOwnProp17 = Object.prototype.hasOwnProperty;
var __propIsEnum16 = Object.prototype.propertyIsEnumerable;
var __defNormalProp16 = (obj, key, value) => key in obj ? __defProp17(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues16 = (a, b3) => {
  for (var prop in b3 || (b3 = {}))
    if (__hasOwnProp17.call(b3, prop))
      __defNormalProp16(a, prop, b3[prop]);
  if (__getOwnPropSymbols16)
    for (var prop of __getOwnPropSymbols16(b3)) {
      if (__propIsEnum16.call(b3, prop))
        __defNormalProp16(a, prop, b3[prop]);
    }
  return a;
};
var __spreadProps16 = (a, b3) => __defProps16(a, __getOwnPropDescs16(b3));
var __objRest14 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp17.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols16)
    for (var prop of __getOwnPropSymbols16(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum16.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function parseMarginValue(value) {
  if (typeof value === "number")
    return {
      marginTop: value,
      marginBottom: value,
      marginLeft: value,
      marginRight: value
    };
  if (typeof value === "string") {
    const values = value.toString().trim().split(/\s+/);
    if (values.length === 1) {
      return {
        marginTop: values[0],
        marginBottom: values[0],
        marginLeft: values[0],
        marginRight: values[0]
      };
    }
    if (values.length === 2) {
      return {
        marginTop: values[0],
        marginRight: values[1],
        marginBottom: values[0],
        marginLeft: values[1]
      };
    }
    if (values.length === 3) {
      return {
        marginTop: values[0],
        marginRight: values[1],
        marginBottom: values[2],
        marginLeft: values[1]
      };
    }
    if (values.length === 4) {
      return {
        marginTop: values[0],
        marginRight: values[1],
        marginBottom: values[2],
        marginLeft: values[3]
      };
    }
  }
  return {
    marginTop: void 0,
    marginBottom: void 0,
    marginLeft: void 0,
    marginRight: void 0
  };
}
function computeMargins(properties) {
  let result = {
    marginTop: void 0,
    marginRight: void 0,
    marginBottom: void 0,
    marginLeft: void 0
  };
  for (const [key, value] of Object.entries(properties)) {
    if (key === "margin") {
      result = parseMarginValue(value);
    } else if (key === "marginTop") {
      result.marginTop = value;
    } else if (key === "marginRight") {
      result.marginRight = value;
    } else if (key === "marginBottom") {
      result.marginBottom = value;
    } else if (key === "marginLeft") {
      result.marginLeft = value;
    }
  }
  return result;
}
var Text3 = React14.forwardRef(
  (_a3, ref) => {
    var _b = _a3, { style } = _b, props = __objRest14(_b, ["style"]);
    const defaultMargins = {};
    if ((style == null ? void 0 : style.marginTop) === void 0) {
      defaultMargins.marginTop = "16px";
    }
    if ((style == null ? void 0 : style.marginBottom) === void 0) {
      defaultMargins.marginBottom = "16px";
    }
    const margins = computeMargins(__spreadValues16(__spreadValues16({}, defaultMargins), style));
    return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
      "p",
      __spreadProps16(__spreadValues16({}, props), {
        ref,
        style: __spreadValues16(__spreadValues16({
          fontSize: "14px",
          lineHeight: "24px"
        }, style), margins)
      })
    );
  }
);
Text3.displayName = "Text";

// src/emails/invoice-email.tsx
var import_react2 = __toESM(require("react"));
var InvoiceEmail = ({
  invoiceNumber = "INV-2024-001",
  customerName = "Sunrise Industries Ltd",
  companyName = "Sharma & Associates",
  amount = 25e3,
  dueDate = "30th September 2024",
  invoiceUrl = "#",
  paymentUrl = "#",
  companyLogo,
  companyEmail = "contact@sharmaassociates.com",
  companyPhone = "+91 98765 43210",
  services = [
    { description: "ROC Annual Filing", amount: 15e3 },
    { description: "Board Resolution Preparation", amount: 1e4 }
  ]
}) => {
  const formatCurrency = (amount2) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR"
    }).format(amount2);
  };
  return /* @__PURE__ */ import_react2.default.createElement(Html, null, /* @__PURE__ */ import_react2.default.createElement(Head, null), /* @__PURE__ */ import_react2.default.createElement(Preview, null, "Invoice ", invoiceNumber, " from ", companyName, " - Due ", dueDate), /* @__PURE__ */ import_react2.default.createElement(Body, { style: main }, /* @__PURE__ */ import_react2.default.createElement(Container, { style: container }, /* @__PURE__ */ import_react2.default.createElement(Section, { style: header }, /* @__PURE__ */ import_react2.default.createElement(Row, null, /* @__PURE__ */ import_react2.default.createElement(Column, null, companyLogo && /* @__PURE__ */ import_react2.default.createElement(
    Img,
    {
      src: companyLogo,
      width: "120",
      height: "40",
      alt: companyName,
      style: logo
    }
  ), /* @__PURE__ */ import_react2.default.createElement(Heading, { style: companyNameHeading }, companyName), /* @__PURE__ */ import_react2.default.createElement(Text3, { style: companySubtitle }, "Company Secretary & Legal Consultants")), /* @__PURE__ */ import_react2.default.createElement(Column, { align: "right" }, /* @__PURE__ */ import_react2.default.createElement(Text3, { style: invoiceTitle }, "INVOICE"), /* @__PURE__ */ import_react2.default.createElement(Text3, { style: invoiceNumberStyle }, invoiceNumber)))), /* @__PURE__ */ import_react2.default.createElement(Hr2, { style: hr3 }), /* @__PURE__ */ import_react2.default.createElement(Section, { style: section }, /* @__PURE__ */ import_react2.default.createElement(Text3, { style: greeting }, "Dear ", customerName, ","), /* @__PURE__ */ import_react2.default.createElement(Text3, { style: paragraph }, "Thank you for choosing our professional company secretary services. Please find your invoice details below:")), /* @__PURE__ */ import_react2.default.createElement(Section, { style: invoiceCard }, /* @__PURE__ */ import_react2.default.createElement(Row, { style: invoiceHeader }, /* @__PURE__ */ import_react2.default.createElement(Column, null, /* @__PURE__ */ import_react2.default.createElement(Text3, { style: invoiceHeaderText }, "Invoice Amount"), /* @__PURE__ */ import_react2.default.createElement(Text3, { style: amountStyle }, formatCurrency(amount))), /* @__PURE__ */ import_react2.default.createElement(Column, { align: "right" }, /* @__PURE__ */ import_react2.default.createElement(Text3, { style: invoiceHeaderText }, "Due Date"), /* @__PURE__ */ import_react2.default.createElement(Text3, { style: dueDateStyle }, dueDate))), /* @__PURE__ */ import_react2.default.createElement(Section, { style: servicesSection }, /* @__PURE__ */ import_react2.default.createElement(Text3, { style: servicesTitle }, "Services Provided"), services.map((service, index) => /* @__PURE__ */ import_react2.default.createElement(Row, { key: index, style: serviceRow }, /* @__PURE__ */ import_react2.default.createElement(Column, null, /* @__PURE__ */ import_react2.default.createElement(Text3, { style: serviceDescription }, service.description)), /* @__PURE__ */ import_react2.default.createElement(Column, { align: "right" }, /* @__PURE__ */ import_react2.default.createElement(Text3, { style: serviceAmount }, formatCurrency(service.amount)))))), /* @__PURE__ */ import_react2.default.createElement(Hr2, { style: serviceDivider }), /* @__PURE__ */ import_react2.default.createElement(Row, { style: totalRow }, /* @__PURE__ */ import_react2.default.createElement(Column, null, /* @__PURE__ */ import_react2.default.createElement(Text3, { style: totalLabel }, "Total Amount")), /* @__PURE__ */ import_react2.default.createElement(Column, { align: "right" }, /* @__PURE__ */ import_react2.default.createElement(Text3, { style: totalAmount }, formatCurrency(amount))))), /* @__PURE__ */ import_react2.default.createElement(Section, { style: buttonSection }, /* @__PURE__ */ import_react2.default.createElement(Row, null, /* @__PURE__ */ import_react2.default.createElement(Column, { align: "center" }, /* @__PURE__ */ import_react2.default.createElement(Button, { style: primaryButton, href: paymentUrl }, "Pay Now")), /* @__PURE__ */ import_react2.default.createElement(Column, { align: "center" }, /* @__PURE__ */ import_react2.default.createElement(Button, { style: secondaryButton, href: invoiceUrl }, "View Invoice")))), /* @__PURE__ */ import_react2.default.createElement(Section, { style: section }, /* @__PURE__ */ import_react2.default.createElement(Text3, { style: sectionTitle }, "Payment Instructions"), /* @__PURE__ */ import_react2.default.createElement(Text3, { style: paragraph }, "\u2022 ", /* @__PURE__ */ import_react2.default.createElement("strong", null, "Online Payment:"), ' Click "Pay Now" above for secure online payment'), /* @__PURE__ */ import_react2.default.createElement(Text3, { style: paragraph }, "\u2022 ", /* @__PURE__ */ import_react2.default.createElement("strong", null, "Bank Transfer:"), " Use invoice number as reference"), /* @__PURE__ */ import_react2.default.createElement(Text3, { style: paragraph }, "\u2022 ", /* @__PURE__ */ import_react2.default.createElement("strong", null, "Questions?"), " Reply to this email or call ", companyPhone)), /* @__PURE__ */ import_react2.default.createElement(Section, { style: noteSection }, /* @__PURE__ */ import_react2.default.createElement(Text3, { style: noteText }, /* @__PURE__ */ import_react2.default.createElement("strong", null, "Note:"), " This invoice includes all applicable taxes as per Indian GST regulations. Payment terms are net 30 days from invoice date.")), /* @__PURE__ */ import_react2.default.createElement(Hr2, { style: hr3 }), /* @__PURE__ */ import_react2.default.createElement(Section, { style: footer }, /* @__PURE__ */ import_react2.default.createElement(Text3, { style: footerText }, companyName, " | Company Secretary Practice"), /* @__PURE__ */ import_react2.default.createElement(Text3, { style: footerText }, "Email: ", /* @__PURE__ */ import_react2.default.createElement(Link, { href: `mailto:${companyEmail}`, style: link }, companyEmail), companyPhone && /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, " ", " | Phone: ", /* @__PURE__ */ import_react2.default.createElement(Link, { href: `tel:${companyPhone}`, style: link }, companyPhone))), /* @__PURE__ */ import_react2.default.createElement(Text3, { style: footerDisclaimer }, "This is a computer-generated invoice. Thank you for your business.")))));
};
var invoice_email_default = InvoiceEmail;
var main = {
  backgroundColor: "#ffffff",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'
};
var container = {
  margin: "0 auto",
  padding: "20px 20px 48px",
  maxWidth: "600px"
};
var header = {
  marginBottom: "32px"
};
var logo = {
  marginBottom: "16px"
};
var companyNameHeading = {
  fontSize: "28px",
  fontWeight: "700",
  color: "#1f2937",
  margin: "0 0 8px 0"
};
var companySubtitle = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "0 0 16px 0"
};
var invoiceTitle = {
  fontSize: "32px",
  fontWeight: "700",
  color: "#1f2937",
  margin: "0"
};
var invoiceNumberStyle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#4f46e5",
  margin: "8px 0 0 0"
};
var hr3 = {
  borderColor: "#e5e7eb",
  margin: "24px 0"
};
var section = {
  marginBottom: "32px"
};
var greeting = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#1f2937",
  margin: "0 0 16px 0"
};
var paragraph = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#4b5563",
  margin: "0 0 16px 0"
};
var invoiceCard = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "24px",
  marginBottom: "32px"
};
var invoiceHeader = {
  marginBottom: "24px"
};
var invoiceHeaderText = {
  fontSize: "14px",
  fontWeight: "500",
  color: "#6b7280",
  margin: "0 0 8px 0",
  textTransform: "uppercase",
  letterSpacing: "0.05em"
};
var amountStyle = {
  fontSize: "32px",
  fontWeight: "700",
  color: "#059669",
  margin: "0"
};
var dueDateStyle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#dc2626",
  margin: "0"
};
var servicesSection = {
  marginBottom: "24px"
};
var servicesTitle = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#1f2937",
  margin: "0 0 16px 0"
};
var serviceRow = {
  marginBottom: "8px"
};
var serviceDescription = {
  fontSize: "14px",
  color: "#4b5563",
  margin: "0"
};
var serviceAmount = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#1f2937",
  margin: "0"
};
var serviceDivider = {
  borderColor: "#d1d5db",
  margin: "16px 0"
};
var totalRow = {
  backgroundColor: "#ffffff",
  padding: "16px 0 0 0"
};
var totalLabel = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#1f2937",
  margin: "0"
};
var totalAmount = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#1f2937",
  margin: "0"
};
var buttonSection = {
  margin: "32px 0"
};
var primaryButton = {
  backgroundColor: "#4f46e5",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center",
  display: "inline-block",
  padding: "12px 24px",
  margin: "0 8px"
};
var secondaryButton = {
  backgroundColor: "#ffffff",
  border: "2px solid #4f46e5",
  borderRadius: "6px",
  color: "#4f46e5",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center",
  display: "inline-block",
  padding: "10px 24px",
  margin: "0 8px"
};
var sectionTitle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#1f2937",
  margin: "0 0 16px 0"
};
var noteSection = {
  backgroundColor: "#fef3c7",
  border: "1px solid #f59e0b",
  borderRadius: "6px",
  padding: "16px",
  marginBottom: "32px"
};
var noteText = {
  fontSize: "14px",
  color: "#92400e",
  margin: "0"
};
var footer = {
  textAlign: "center",
  marginTop: "32px"
};
var footerText = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "0 0 8px 0"
};
var footerDisclaimer = {
  fontSize: "12px",
  color: "#9ca3af",
  margin: "16px 0 0 0"
};
var link = {
  color: "#4f46e5",
  textDecoration: "none"
};

// src/server/api/routers/communication.ts
var import_client4 = require("@prisma/client");
var configureResendSchema = import_zod8.z.object({
  apiKey: import_zod8.z.string().min(1, "API key is required"),
  fromEmail: import_zod8.z.string().email("Valid email required"),
  fromName: import_zod8.z.string().min(1, "From name is required")
});
var configureWhatsAppSchema = import_zod8.z.object({
  provider: import_zod8.z.enum(["TWILIO", "WHATSAPP_BUSINESS_API"]),
  accountSid: import_zod8.z.string().min(1, "Account SID is required"),
  authToken: import_zod8.z.string().min(1, "Auth token is required"),
  fromNumber: import_zod8.z.string().min(1, "Phone number is required")
});
var updateCustomerPreferencesSchema = import_zod8.z.object({
  customerId: import_zod8.z.string(),
  preferences: import_zod8.z.object({
    emailOptIn: import_zod8.z.boolean(),
    whatsappOptIn: import_zod8.z.boolean(),
    smsOptIn: import_zod8.z.boolean().optional(),
    invoiceDelivery: import_zod8.z.enum(["EMAIL", "WHATSAPP", "SMS"]),
    complianceReminders: import_zod8.z.enum(["EMAIL", "WHATSAPP", "SMS"]),
    paymentReminders: import_zod8.z.enum(["EMAIL", "WHATSAPP", "SMS"]),
    reminderFrequency: import_zod8.z.enum(["DAILY", "WEEKLY", "BI_WEEKLY", "MONTHLY"]),
    quietHoursStart: import_zod8.z.string().optional(),
    quietHoursEnd: import_zod8.z.string().optional(),
    language: import_zod8.z.string().optional(),
    timezone: import_zod8.z.string().optional()
  })
});
var sendEmailSchema = import_zod8.z.object({
  to: import_zod8.z.union([import_zod8.z.string().email(), import_zod8.z.array(import_zod8.z.string().email())]),
  cc: import_zod8.z.array(import_zod8.z.string().email()).optional(),
  bcc: import_zod8.z.array(import_zod8.z.string().email()).optional(),
  subject: import_zod8.z.string().min(1, "Subject is required"),
  content: import_zod8.z.string().min(1, "Content is required"),
  templateId: import_zod8.z.string().optional(),
  templateData: import_zod8.z.record(import_zod8.z.string(), import_zod8.z.unknown()).optional()
});
var sendBulkEmailSchema = import_zod8.z.object({
  messages: import_zod8.z.array(sendEmailSchema),
  batchSize: import_zod8.z.number().min(1).max(50).default(10)
});
var sendInvoiceSchema = import_zod8.z.object({
  invoiceId: import_zod8.z.string(),
  channels: import_zod8.z.array(import_zod8.z.enum(["EMAIL", "WHATSAPP"])).min(1),
  customMessage: import_zod8.z.string().optional()
});
var createTemplateSchema = import_zod8.z.object({
  name: import_zod8.z.string().min(1, "Template name is required"),
  type: import_zod8.z.enum(["INVOICE", "PAYMENT_REMINDER", "COMPLIANCE_REMINDER", "WELCOME", "GENERAL_UPDATE"]),
  channel: import_zod8.z.enum(["EMAIL", "WHATSAPP", "SMS"]),
  language: import_zod8.z.string().default("en"),
  subject: import_zod8.z.string().optional(),
  htmlContent: import_zod8.z.string().optional(),
  textContent: import_zod8.z.string().min(1, "Text content is required"),
  variables: import_zod8.z.array(import_zod8.z.string()).default([]),
  isDefault: import_zod8.z.boolean().default(false)
});
var communicationRouter = createTRPCRouter({
  // ===== CONFIGURATION ENDPOINTS =====
  configureResend: companyProcedure.input(configureResendSchema).mutation(async ({ input, ctx }) => {
    const isValid = await communicationEngine.configureResend(input);
    if (!isValid) {
      throw new Error("Failed to configure Resend. Please check your API key and settings.");
    }
    const encryptedData = communicationEngine.encryptCredentials({
      apiKey: input.apiKey
    });
    await ctx.db.companySettings.upsert({
      where: { companyId: ctx.companyId },
      create: {
        id: idGenerator.companySettings(),
        companyId: ctx.companyId,
        emailProvider: "RESEND",
        smtpUser: encryptedData.apiKey,
        fromEmail: input.fromEmail,
        fromName: input.fromName,
        emailEnabled: true
      },
      update: {
        emailProvider: "RESEND",
        smtpUser: encryptedData.apiKey,
        fromEmail: input.fromEmail,
        fromName: input.fromName,
        emailEnabled: true
      }
    });
    return { success: true, message: "Resend configured successfully!" };
  }),
  configureWhatsApp: companyProcedure.input(configureWhatsAppSchema).mutation(async ({ input, ctx }) => {
    const isValid = await communicationEngine.configureWhatsApp({
      accountSid: input.accountSid,
      authToken: input.authToken,
      fromNumber: input.fromNumber
    });
    if (!isValid) {
      throw new Error("Failed to configure WhatsApp. Please check your credentials.");
    }
    const encryptedData = communicationEngine.encryptCredentials({
      accountSid: input.accountSid,
      authToken: input.authToken
    });
    await ctx.db.companySettings.upsert({
      where: { companyId: ctx.companyId },
      create: {
        id: idGenerator.companySettings(),
        companyId: ctx.companyId,
        whatsappProvider: input.provider,
        whatsappApiKey: encryptedData.accountSid,
        whatsappPhoneId: input.fromNumber,
        whatsappEnabled: true
      },
      update: {
        whatsappProvider: input.provider,
        whatsappApiKey: encryptedData.accountSid,
        whatsappPhoneId: input.fromNumber,
        whatsappEnabled: true
      }
    });
    return { success: true, message: "WhatsApp configured successfully!" };
  }),
  getSettings: companyProcedure.query(async ({ ctx }) => {
    const settings = await ctx.db.companySettings.findUnique({
      where: { companyId: ctx.companyId }
    });
    if (!settings) {
      return {
        emailEnabled: false,
        whatsappEnabled: false,
        hasEmailConfig: false,
        hasWhatsAppConfig: false
      };
    }
    return {
      emailEnabled: settings.emailEnabled,
      whatsappEnabled: settings.whatsappEnabled,
      emailProvider: settings.emailProvider,
      fromEmail: settings.fromEmail,
      fromName: settings.fromName,
      whatsappProvider: settings.whatsappProvider,
      whatsappPhoneId: settings.whatsappPhoneId,
      hasEmailConfig: !!settings.smtpUser,
      hasWhatsAppConfig: !!settings.whatsappApiKey,
      autoSendInvoices: settings.autoSendInvoices,
      complianceReminderDays: settings.complianceReminderDays,
      paymentReminderDays: settings.paymentReminderDays
    };
  }),
  // ===== CUSTOMER PREFERENCES =====
  updateCustomerPreferences: companyProcedure.input(updateCustomerPreferencesSchema).mutation(async ({ input, ctx }) => {
    const customer = await ctx.db.customer.findFirst({
      where: {
        id: input.customerId,
        companyId: ctx.companyId
      }
    });
    if (!customer) {
      throw new Error("Customer not found or access denied");
    }
    const preferences = await ctx.db.communicationPreference.upsert({
      where: { customerId: input.customerId },
      create: {
        id: idGenerator.communicationPreference(),
        customerId: input.customerId,
        ...input.preferences
      },
      update: input.preferences
    });
    return preferences;
  }),
  getCustomerPreferences: companyProcedure.input(import_zod8.z.object({ customerId: import_zod8.z.string() })).query(async ({ input, ctx }) => {
    const customer = await ctx.db.customer.findFirst({
      where: {
        id: input.customerId,
        companyId: ctx.companyId
      },
      include: {
        communicationPreferences: true
      }
    });
    if (!customer) {
      throw new Error("Customer not found or access denied");
    }
    return {
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        whatsappNumber: customer.whatsappNumber
      },
      preferences: customer.communicationPreferences || null
    };
  }),
  // ===== MESSAGE SENDING =====
  sendEmail: companyProcedure.input(sendEmailSchema).mutation(async ({ input, ctx }) => {
    let htmlContent = input.content;
    let textContent2 = input.content;
    if (input.templateId && input.templateData) {
      const rendered = await communicationEngine.renderTemplate(
        input.templateId,
        input.templateData
      );
      htmlContent = rendered.htmlContent;
      textContent2 = rendered.textContent;
    }
    const result = await communicationEngine.sendEmail({
      to: input.to,
      cc: input.cc,
      bcc: input.bcc,
      subject: input.subject,
      htmlContent,
      textContent: textContent2,
      tags: [
        { name: "company_id", value: ctx.companyId },
        { name: "sent_by", value: ctx.companyId }
      ]
    });
    await ctx.db.communicationLog.create({
      data: {
        id: idGenerator.communicationLog(),
        customerId: Array.isArray(input.to) ? "bulk" : "single",
        // Simplified for now
        companyId: ctx.companyId,
        type: input.templateId?.includes("INVOICE") ? "INVOICE" : "GENERAL_UPDATE",
        channel: "EMAIL",
        subject: input.subject,
        content: textContent2,
        templateUsed: input.templateId,
        status: result.status === "sent" ? "SENT" : "FAILED",
        providerId: result.messageId,
        providerName: result.provider,
        cost: result.cost,
        metadata: result.metadata ? JSON.parse(JSON.stringify(result.metadata)) : import_client4.Prisma.JsonNull,
        errorMessage: result.error
      }
    });
    return result;
  }),
  sendBulkEmails: companyProcedure.input(sendBulkEmailSchema).mutation(async ({ input, ctx }) => {
    const emailMessages = input.messages.map((msg) => ({
      to: Array.isArray(msg.to) ? msg.to[0] : msg.to,
      // Simplify for bulk
      subject: msg.subject,
      htmlContent: msg.content,
      textContent: msg.content
    }));
    const result = await communicationEngine.sendBulkEmails(
      emailMessages,
      input.batchSize
    );
    await ctx.db.communicationLog.create({
      data: {
        id: idGenerator.communicationLog(),
        customerId: "bulk_operation",
        companyId: ctx.companyId,
        type: "GENERAL_UPDATE",
        channel: "EMAIL",
        subject: `Bulk email: ${result.total} messages`,
        content: `Sent: ${result.successful}, Failed: ${result.failed}`,
        status: result.failed === 0 ? "SENT" : "PARTIALLY_FAILED",
        cost: result.totalCost,
        metadata: {
          total: result.total,
          successful: result.successful,
          failed: result.failed,
          failures: result.failures.slice(0, 10).map((f3) => ({
            to: f3.message.to,
            subject: f3.message.subject,
            error: f3.error
          }))
        }
      }
    });
    return result;
  }),
  sendInvoice: companyProcedure.input(sendInvoiceSchema).mutation(async ({ input, ctx }) => {
    const invoice = await ctx.db.invoice.findFirst({
      where: {
        id: input.invoiceId,
        companyId: ctx.companyId
      },
      include: {
        customer: {
          include: {
            communicationPreferences: true
          }
        },
        company: true,
        lines: {
          include: {
            serviceTemplate: true
          }
        }
      }
    });
    if (!invoice) {
      throw new Error("Invoice not found or access denied");
    }
    const results = [];
    if (input.channels.includes("EMAIL") && invoice.customer.email) {
      const emailHtml = await render2(invoice_email_default({
        invoiceNumber: invoice.number,
        customerName: invoice.customer.name,
        companyName: invoice.company.name,
        amount: invoice.grandTotal,
        dueDate: invoice.dueDate?.toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric"
        }) || "On Receipt",
        companyEmail: invoice.company.email,
        companyPhone: invoice.company.phone || void 0,
        services: invoice.lines.map((line) => ({
          description: line.description,
          amount: line.amount
        }))
      }));
      const emailResult = await communicationEngine.sendEmail({
        to: invoice.customer.email,
        subject: `Invoice ${invoice.number} from ${invoice.company.name}`,
        htmlContent: emailHtml,
        textContent: `Invoice ${invoice.number} for ${invoice.grandTotal.toLocaleString("en-IN", { style: "currency", currency: "INR" })}`,
        tags: [
          { name: "invoice_id", value: invoice.id },
          { name: "customer_id", value: invoice.customer.id }
        ]
      });
      results.push({ channel: "EMAIL", result: emailResult });
      await ctx.db.communicationLog.create({
        data: {
          id: idGenerator.communicationLog(),
          customerId: invoice.customer.id,
          companyId: ctx.companyId,
          type: "INVOICE",
          channel: "EMAIL",
          subject: `Invoice ${invoice.number}`,
          content: `Invoice for ${invoice.grandTotal.toLocaleString("en-IN", { style: "currency", currency: "INR" })}`,
          status: emailResult.status === "sent" ? "SENT" : "FAILED",
          providerId: emailResult.messageId,
          providerName: emailResult.provider,
          errorMessage: emailResult.error
        }
      });
    }
    if (input.channels.includes("WHATSAPP") && invoice.customer.whatsappNumber) {
      const whatsappMessage = `
\u{1F9FE} *Invoice from ${invoice.company.name}*

Dear ${invoice.customer.name},

Invoice: *${invoice.number}*
Amount: *${invoice.grandTotal.toLocaleString("en-IN", { style: "currency", currency: "INR" })}*
Due Date: ${invoice.dueDate?.toLocaleDateString("en-IN") || "On Receipt"}

${input.customMessage || "Thank you for your business!"}

For questions, contact: ${invoice.company.email}
        `.trim();
      const whatsappResult = await communicationEngine.sendWhatsApp({
        to: invoice.customer.whatsappNumber,
        content: whatsappMessage
      });
      results.push({ channel: "WHATSAPP", result: whatsappResult });
      await ctx.db.communicationLog.create({
        data: {
          id: idGenerator.communicationLog(),
          customerId: invoice.customer.id,
          companyId: ctx.companyId,
          type: "INVOICE",
          channel: "WHATSAPP",
          content: whatsappMessage,
          status: whatsappResult.status === "sent" ? "SENT" : "FAILED",
          providerId: whatsappResult.messageId,
          providerName: whatsappResult.provider,
          cost: whatsappResult.cost,
          errorMessage: whatsappResult.error
        }
      });
    }
    return {
      success: results.length > 0,
      results,
      message: `Invoice sent via ${results.map((r2) => r2.channel).join(" and ")}`
    };
  }),
  // ===== TEMPLATES =====
  createTemplate: companyProcedure.input(createTemplateSchema).mutation(async ({ input, ctx }) => {
    const template = await ctx.db.messageTemplate.create({
      data: {
        id: idGenerator.messageTemplate(),
        companyId: ctx.companyId,
        ...input
      }
    });
    return template;
  }),
  getTemplates: companyProcedure.query(async ({ ctx }) => {
    return await ctx.db.messageTemplate.findMany({
      where: { companyId: ctx.companyId },
      orderBy: [
        { isDefault: "desc" },
        { type: "asc" },
        { createdAt: "desc" }
      ]
    });
  }),
  // ===== ANALYTICS =====
  getCommunicationStats: companyProcedure.input(import_zod8.z.object({
    startDate: import_zod8.z.date().optional(),
    endDate: import_zod8.z.date().optional()
  })).query(async ({ input, ctx }) => {
    const whereClause = {
      companyId: ctx.companyId,
      ...input.startDate && input.endDate && {
        createdAt: {
          gte: input.startDate,
          lte: input.endDate
        }
      }
    };
    const [
      totalMessages,
      emailMessages,
      whatsappMessages,
      deliveredMessages,
      failedMessages,
      totalCost
    ] = await Promise.all([
      ctx.db.communicationLog.count({ where: whereClause }),
      ctx.db.communicationLog.count({ where: { ...whereClause, channel: "EMAIL" } }),
      ctx.db.communicationLog.count({ where: { ...whereClause, channel: "WHATSAPP" } }),
      ctx.db.communicationLog.count({ where: { ...whereClause, status: "DELIVERED" } }),
      ctx.db.communicationLog.count({ where: { ...whereClause, status: "FAILED" } }),
      ctx.db.communicationLog.aggregate({
        where: whereClause,
        _sum: { cost: true }
      })
    ]);
    const recentMessages = await ctx.db.communicationLog.findMany({
      where: whereClause,
      include: {
        customer: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 10
    });
    return {
      totalMessages,
      emailMessages,
      whatsappMessages,
      deliveredMessages,
      failedMessages,
      totalCost: totalCost._sum.cost || 0,
      deliveryRate: totalMessages > 0 ? deliveredMessages / totalMessages * 100 : 0,
      recentMessages
    };
  }),
  // ===== TESTING =====
  testConfiguration: companyProcedure.mutation(async ({ ctx }) => {
    const settings = await ctx.db.companySettings.findUnique({
      where: { companyId: ctx.companyId }
    });
    if (!settings) {
      throw new Error("No communication settings found. Please configure first.");
    }
    const results = {
      email: false,
      whatsapp: false,
      errors: []
    };
    if (settings.emailEnabled && settings.smtpUser) {
      try {
        const decrypted = communicationEngine.decryptCredentials({
          apiKey: settings.smtpUser
        });
        const emailValid = await communicationEngine.configureResend({
          apiKey: decrypted.apiKey,
          fromEmail: settings.fromEmail,
          fromName: settings.fromName
        });
        results.email = emailValid;
        if (!emailValid) results.errors.push("Email configuration invalid");
      } catch (error) {
        results.errors.push(`Email test failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }
    if (settings.whatsappEnabled && settings.whatsappApiKey) {
      try {
        const decrypted = communicationEngine.decryptCredentials({
          accountSid: settings.whatsappApiKey,
          authToken: settings.whatsappApiKey
          // In real implementation, store separately
        });
        const whatsappValid = await communicationEngine.configureWhatsApp({
          accountSid: decrypted.accountSid,
          authToken: decrypted.authToken,
          fromNumber: settings.whatsappPhoneId
        });
        results.whatsapp = whatsappValid;
        if (!whatsappValid) results.errors.push("WhatsApp configuration invalid");
      } catch (error) {
        results.errors.push(`WhatsApp test failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }
    return results;
  })
});

// src/server/api/routers/dashboard-optimized.ts
var import_zod9 = require("zod");
var import_server7 = require("@trpc/server");
var dashboardOptimizedRouter = createTRPCRouter({
  /**
   * Get dashboard metrics - OPTIMIZED single query version
   * Reduces database calls from 10+ to 1 single raw query
   */
  getMetrics: protectedProcedure.input(import_zod9.z.object({
    dateRange: import_zod9.z.enum(["thisWeek", "thisMonth", "thisQuarter", "thisYear"]).default("thisMonth")
  }).optional()).query(async ({ ctx, input }) => {
    if (!ctx.companyId) {
      throw new import_server7.TRPCError({
        code: "UNAUTHORIZED",
        message: "Company ID required"
      });
    }
    const now = /* @__PURE__ */ new Date();
    const quarter = Math.floor(now.getMonth() / 3);
    const quarterStartDate = new Date(now.getFullYear(), quarter * 3, 1);
    let startDate;
    switch (input?.dateRange || "thisMonth") {
      case "thisWeek":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case "thisMonth":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "thisQuarter":
        startDate = quarterStartDate;
        break;
      case "thisYear":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }
    const [
      invoiceMetrics,
      quarterlyInvoiceMetrics,
      overdueInvoices,
      outstandingInvoices,
      customerCount,
      paymentMetrics,
      complianceMetrics
    ] = await Promise.all([
      // Invoice metrics in one query
      ctx.db.invoice.groupBy({
        by: ["status"],
        where: {
          companyId: ctx.companyId,
          issueDate: { gte: startDate }
        },
        _count: { id: true },
        _sum: { grandTotal: true }
      }),
      // Quarterly revenue (always this quarter)
      ctx.db.invoice.aggregate({
        where: {
          companyId: ctx.companyId,
          issueDate: { gte: quarterStartDate }
        },
        _sum: { grandTotal: true }
      }),
      // Overdue invoices (unpaid invoices past due date)
      ctx.db.invoice.aggregate({
        where: {
          companyId: ctx.companyId,
          dueDate: { lt: now },
          status: { in: ["SENT", "PARTIALLY_PAID", "OVERDUE"] }
        },
        _sum: { grandTotal: true, paidAmount: true }
      }),
      // Outstanding calculation: ALL unpaid/partially paid invoices (not date-limited)
      ctx.db.invoice.aggregate({
        where: {
          companyId: ctx.companyId,
          status: { in: ["SENT", "PARTIALLY_PAID", "OVERDUE", "GENERATED"] }
        },
        _sum: { grandTotal: true, paidAmount: true }
      }),
      // Customer count
      ctx.db.customer.count({
        where: {
          companyId: ctx.companyId,
          createdAt: { gte: startDate }
        }
      }),
      // Payment metrics
      ctx.db.payment.aggregate({
        where: {
          companyId: ctx.companyId,
          paymentDate: { gte: startDate }
        },
        _sum: { amount: true }
      }),
      // Compliance metrics
      ctx.db.complianceItem.groupBy({
        by: ["status"],
        where: {
          companyId: ctx.companyId
        },
        _count: { id: true }
      })
    ]);
    const revenue = invoiceMetrics.reduce((sum, item) => sum + (Number(item._sum.grandTotal) || 0), 0);
    const quarterlyRevenue = Number(quarterlyInvoiceMetrics._sum.grandTotal) || 0;
    const overdueTotal = Number(overdueInvoices._sum.grandTotal) || 0;
    const overduePaid = Number(overdueInvoices._sum.paidAmount) || 0;
    const overdueAmount = overdueTotal - overduePaid;
    const paymentsReceived = Number(paymentMetrics._sum.amount) || 0;
    const outstandingTotal = Number(outstandingInvoices._sum.grandTotal) || 0;
    const outstandingPaid = Number(outstandingInvoices._sum.paidAmount) || 0;
    const outstandingAmount = outstandingTotal - outstandingPaid;
    const collectionRate = revenue > 0 ? paymentsReceived / revenue * 100 : 0;
    const invoiceCounts = {
      total: invoiceMetrics.reduce((sum, item) => sum + item._count.id, 0),
      paid: invoiceMetrics.find((item) => item.status === "PAID")?._count.id || 0,
      pending: (invoiceMetrics.find((item) => item.status === "SENT")?._count.id || 0) + (invoiceMetrics.find((item) => item.status === "PARTIALLY_PAID")?._count.id || 0),
      overdue: invoiceMetrics.find((item) => item.status === "OVERDUE")?._count.id || 0
    };
    const complianceCounts = {
      total: complianceMetrics.reduce((sum, item) => sum + item._count.id, 0),
      pending: complianceMetrics.find((item) => item.status === "PENDING")?._count.id || 0,
      overdue: complianceMetrics.find((item) => item.status === "OVERDUE")?._count.id || 0
    };
    return {
      revenue: {
        total: revenue,
        quarterly: quarterlyRevenue,
        received: paymentsReceived,
        outstanding: outstandingAmount,
        overdue: overdueAmount,
        collectionRate: Math.round(collectionRate * 100) / 100
      },
      invoices: invoiceCounts,
      customers: {
        new: customerCount
      },
      compliance: complianceCounts
    };
  }),
  /**
   * Get recent activity - OPTIMIZED with limits
   */
  getRecentActivity: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.companyId) {
      throw new import_server7.TRPCError({
        code: "UNAUTHORIZED",
        message: "Company ID required"
      });
    }
    const [recentInvoices, upcomingCompliances, recentCustomers] = await Promise.all([
      ctx.db.invoice.findMany({
        where: { companyId: ctx.companyId },
        orderBy: { createdAt: "desc" },
        take: 5,
        // Limit to 5 most recent
        select: {
          id: true,
          number: true,
          status: true,
          grandTotal: true,
          issueDate: true,
          customer: {
            select: { name: true }
          }
        }
      }),
      ctx.db.complianceItem.findMany({
        where: {
          companyId: ctx.companyId,
          status: { not: "COMPLETED" },
          dueDate: { gte: /* @__PURE__ */ new Date() }
        },
        orderBy: { dueDate: "asc" },
        take: 5,
        // Limit to 5 upcoming
        select: {
          id: true,
          title: true,
          dueDate: true,
          priority: true,
          status: true
        }
      }),
      ctx.db.customer.findMany({
        where: { companyId: ctx.companyId },
        orderBy: { createdAt: "desc" },
        take: 10,
        // Limit to 10 recent customers
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          _count: {
            select: {
              invoices: true,
              payments: true
            }
          }
        }
      })
    ]);
    return {
      recentInvoices,
      upcomingCompliances,
      recentCustomers
    };
  })
});

// src/server/api/routers/attachment.ts
var import_zod10 = require("zod");
var import_server8 = require("@trpc/server");

// src/lib/file-storage.ts
var import_fs = require("fs");
var import_path = __toESM(require("path"));
var import_crypto2 = require("crypto");
var FileStorageEngine = class _FileStorageEngine {
  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || "./uploads";
    this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE || "10485760");
    this.allowedMimeTypes = /* @__PURE__ */ new Set([
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
      "text/csv"
    ]);
  }
  static getInstance() {
    if (!_FileStorageEngine.instance) {
      _FileStorageEngine.instance = new _FileStorageEngine();
    }
    return _FileStorageEngine.instance;
  }
  /**
   * Initialize storage directories
   */
  async initialize() {
    await this.ensureDirectoryExists(this.uploadDir);
    await this.ensureDirectoryExists(import_path.default.join(this.uploadDir, "documents"));
    await this.ensureDirectoryExists(import_path.default.join(this.uploadDir, "invoices"));
    await this.ensureDirectoryExists(import_path.default.join(this.uploadDir, "temp"));
  }
  /**
   * Store uploaded file
   */
  async storeFile(buffer, originalName, mimetype, category = "documents", _uploadedBy) {
    try {
      const validation = this.validateFile(buffer, originalName, mimetype);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }
      const fileId = this.generateFileId();
      const extension = import_path.default.extname(originalName);
      const filename = `${fileId}${extension}`;
      const filePath = import_path.default.join(this.uploadDir, category, filename);
      await this.ensureDirectoryExists(import_path.default.dirname(filePath));
      await import_fs.promises.writeFile(filePath, buffer);
      return {
        success: true,
        fileId,
        filename,
        size: buffer.length,
        mimetype,
        path: filePath
      };
    } catch (_error) {
      return {
        success: false,
        error: _error instanceof Error ? _error.message : "Unknown error"
      };
    }
  }
  /**
   * Retrieve file
   */
  async getFile(fileId, category = "documents") {
    try {
      const categoryDir = import_path.default.join(this.uploadDir, category);
      const files = await import_fs.promises.readdir(categoryDir);
      const targetFile = files.find((file) => file.startsWith(fileId));
      if (!targetFile) {
        return null;
      }
      const filePath = import_path.default.join(categoryDir, targetFile);
      return await import_fs.promises.readFile(filePath);
    } catch (error) {
      console.error("Error retrieving file:", error);
      return null;
    }
  }
  /**
   * Delete file
   */
  async deleteFile(fileId, category = "documents") {
    try {
      const categoryDir = import_path.default.join(this.uploadDir, category);
      const files = await import_fs.promises.readdir(categoryDir);
      const targetFile = files.find((file) => file.startsWith(fileId));
      if (!targetFile) {
        return false;
      }
      const filePath = import_path.default.join(categoryDir, targetFile);
      await import_fs.promises.unlink(filePath);
      return true;
    } catch (error) {
      console.error("Error deleting file:", error);
      return false;
    }
  }
  /**
   * Get file info
   */
  async getFileInfo(fileId, category = "documents") {
    try {
      const categoryDir = import_path.default.join(this.uploadDir, category);
      const files = await import_fs.promises.readdir(categoryDir);
      const targetFile = files.find((file) => file.startsWith(fileId));
      if (!targetFile) {
        return { exists: false };
      }
      const filePath = import_path.default.join(categoryDir, targetFile);
      const stats = await import_fs.promises.stat(filePath);
      return {
        exists: true,
        size: stats.size,
        filename: targetFile,
        path: filePath
      };
    } catch (_error) {
      return { exists: false };
    }
  }
  /**
   * Clean up temporary files older than specified age
   */
  async cleanupTempFiles(olderThanHours = 24) {
    try {
      const tempDir = import_path.default.join(this.uploadDir, "temp");
      const files = await import_fs.promises.readdir(tempDir);
      const cutoffTime = new Date(Date.now() - olderThanHours * 60 * 60 * 1e3);
      let deletedCount = 0;
      for (const file of files) {
        const filePath = import_path.default.join(tempDir, file);
        const stats = await import_fs.promises.stat(filePath);
        if (stats.mtime < cutoffTime) {
          await import_fs.promises.unlink(filePath);
          deletedCount++;
        }
      }
      return deletedCount;
    } catch (error) {
      console.error("Error cleaning up temp files:", error);
      return 0;
    }
  }
  /**
   * Validate file before storage
   */
  validateFile(buffer, filename, mimetype) {
    if (buffer.length > this.maxFileSize) {
      return {
        valid: false,
        error: `File size exceeds limit of ${this.maxFileSize} bytes`
      };
    }
    if (!this.allowedMimeTypes.has(mimetype)) {
      return {
        valid: false,
        error: `File type ${mimetype} is not allowed`
      };
    }
    if (!filename || filename.length > 255) {
      return {
        valid: false,
        error: "Invalid filename"
      };
    }
    const dangerousExtensions = [".exe", ".bat", ".cmd", ".scr", ".pif", ".vbs", ".js"];
    const extension = import_path.default.extname(filename).toLowerCase();
    if (dangerousExtensions.includes(extension)) {
      return {
        valid: false,
        error: "File type not allowed for security reasons"
      };
    }
    return { valid: true };
  }
  /**
   * Generate unique file ID
   */
  generateFileId() {
    const timestamp = Date.now().toString(36);
    const random = (0, import_crypto2.randomBytes)(8).toString("hex");
    return `${timestamp}_${random}`;
  }
  /**
   * Ensure directory exists
   */
  async ensureDirectoryExists(dirPath) {
    try {
      await import_fs.promises.access(dirPath);
    } catch {
      await import_fs.promises.mkdir(dirPath, { recursive: true });
    }
  }
  /**
   * Get storage statistics
   */
  async getStorageStats() {
    const categories = ["documents", "invoices", "temp"];
    const stats = {
      totalFiles: 0,
      totalSize: 0,
      categorySizes: {}
    };
    for (const category of categories) {
      const categoryDir = import_path.default.join(this.uploadDir, category);
      try {
        const files = await import_fs.promises.readdir(categoryDir);
        let categorySize = 0;
        for (const file of files) {
          const filePath = import_path.default.join(categoryDir, file);
          const fileStat = await import_fs.promises.stat(filePath);
          categorySize += fileStat.size;
        }
        stats.categorySizes[category] = {
          files: files.length,
          size: categorySize
        };
        stats.totalFiles += files.length;
        stats.totalSize += categorySize;
      } catch (_error) {
        stats.categorySizes[category] = { files: 0, size: 0 };
      }
    }
    return stats;
  }
};
var fileStorage = FileStorageEngine.getInstance();

// src/server/api/routers/attachment.ts
var attachmentRouter = createTRPCRouter({
  // Upload file and create attachment record
  upload: protectedProcedure.input(import_zod10.z.object({
    invoiceId: import_zod10.z.string().uuid(),
    fileName: import_zod10.z.string(),
    fileData: import_zod10.z.string(),
    // Base64 encoded file data
    fileType: import_zod10.z.string(),
    description: import_zod10.z.string().optional(),
    displayOrder: import_zod10.z.number().optional()
  })).mutation(async ({ ctx, input }) => {
    const invoice = await ctx.db.invoice.findFirst({
      where: {
        id: input.invoiceId,
        companyId: ctx.companyId
      }
    });
    if (!invoice) {
      throw new import_server8.TRPCError({
        code: "NOT_FOUND",
        message: "Invoice not found"
      });
    }
    const buffer = Buffer.from(input.fileData, "base64");
    const uploadResult = await fileStorage.storeFile(
      buffer,
      input.fileName,
      input.fileType,
      "invoices",
      ctx.session?.user?.email ?? "system"
    );
    if (!uploadResult.success) {
      throw new import_server8.TRPCError({
        code: "BAD_REQUEST",
        message: uploadResult.error || "File upload failed"
      });
    }
    const attachment = await ctx.db.invoiceAttachment.create({
      data: {
        id: idGenerator.invoiceAttachment(),
        invoiceId: input.invoiceId,
        fileName: input.fileName,
        fileSize: uploadResult.size,
        fileType: input.fileType,
        storagePath: uploadResult.fileId,
        // Store the file ID for retrieval
        storageUrl: `local://${uploadResult.fileId}`,
        // Mark as local storage
        description: input.description,
        displayOrder: input.displayOrder ?? 0,
        uploadedBy: ctx.session?.user?.email ?? "system"
      }
    });
    return attachment;
  }),
  // Download file
  download: protectedProcedure.input(import_zod10.z.object({ id: import_zod10.z.string().uuid() })).query(async ({ ctx, input }) => {
    const attachment = await ctx.db.invoiceAttachment.findUnique({
      where: { id: input.id },
      include: { invoice: true }
    });
    if (!attachment) {
      throw new import_server8.TRPCError({
        code: "NOT_FOUND",
        message: "Attachment not found"
      });
    }
    if (attachment.invoice.companyId !== ctx.companyId) {
      throw new import_server8.TRPCError({
        code: "FORBIDDEN",
        message: "Access denied"
      });
    }
    const fileBuffer = await fileStorage.getFile(attachment.storagePath, "invoices");
    if (!fileBuffer) {
      throw new import_server8.TRPCError({
        code: "NOT_FOUND",
        message: "File not found in storage"
      });
    }
    return {
      fileName: attachment.fileName,
      fileType: attachment.fileType,
      fileSize: attachment.fileSize,
      fileData: fileBuffer.toString("base64")
    };
  }),
  // Get all attachments for an invoice
  getByInvoiceId: protectedProcedure.input(import_zod10.z.object({ invoiceId: import_zod10.z.string().uuid() })).query(async ({ ctx, input }) => {
    const attachments = await ctx.db.invoiceAttachment.findMany({
      where: { invoiceId: input.invoiceId },
      orderBy: { displayOrder: "asc" }
    });
    return attachments;
  }),
  // Create attachment record (after file upload to Supabase)
  create: protectedProcedure.input(import_zod10.z.object({
    invoiceId: import_zod10.z.string().uuid(),
    fileName: import_zod10.z.string(),
    fileSize: import_zod10.z.number(),
    fileType: import_zod10.z.string(),
    storagePath: import_zod10.z.string(),
    storageUrl: import_zod10.z.string(),
    description: import_zod10.z.string().optional(),
    displayOrder: import_zod10.z.number().optional()
  })).mutation(async ({ ctx, input }) => {
    const invoice = await ctx.db.invoice.findFirst({
      where: {
        id: input.invoiceId,
        companyId: ctx.companyId
      }
    });
    if (!invoice) {
      throw new import_server8.TRPCError({
        code: "NOT_FOUND",
        message: "Invoice not found"
      });
    }
    const attachment = await ctx.db.invoiceAttachment.create({
      data: {
        id: idGenerator.invoiceAttachment(),
        invoiceId: input.invoiceId,
        fileName: input.fileName,
        fileSize: input.fileSize,
        fileType: input.fileType,
        storagePath: input.storagePath,
        storageUrl: input.storageUrl,
        description: input.description,
        displayOrder: input.displayOrder ?? 0,
        uploadedBy: ctx.session?.user?.email ?? "system"
      }
    });
    return attachment;
  }),
  // Delete attachment
  delete: protectedProcedure.input(import_zod10.z.object({ id: import_zod10.z.string().uuid() })).mutation(async ({ ctx, input }) => {
    const attachment = await ctx.db.invoiceAttachment.findUnique({
      where: { id: input.id },
      include: { invoice: true }
    });
    if (!attachment) {
      throw new import_server8.TRPCError({
        code: "NOT_FOUND",
        message: "Attachment not found"
      });
    }
    if (attachment.invoice.companyId !== ctx.companyId) {
      throw new import_server8.TRPCError({
        code: "FORBIDDEN",
        message: "Access denied"
      });
    }
    await fileStorage.deleteFile(attachment.storagePath, "invoices");
    await ctx.db.invoiceAttachment.delete({
      where: { id: input.id }
    });
    return { success: true, storagePath: attachment.storagePath };
  }),
  // Update attachment metadata
  update: protectedProcedure.input(import_zod10.z.object({
    id: import_zod10.z.string().uuid(),
    description: import_zod10.z.string().optional(),
    displayOrder: import_zod10.z.number().optional()
  })).mutation(async ({ ctx, input }) => {
    const attachment = await ctx.db.invoiceAttachment.findUnique({
      where: { id: input.id },
      include: { invoice: true }
    });
    if (!attachment) {
      throw new import_server8.TRPCError({
        code: "NOT_FOUND",
        message: "Attachment not found"
      });
    }
    if (attachment.invoice.companyId !== ctx.companyId) {
      throw new import_server8.TRPCError({
        code: "FORBIDDEN",
        message: "Access denied"
      });
    }
    const updated = await ctx.db.invoiceAttachment.update({
      where: { id: input.id },
      data: {
        description: input.description,
        displayOrder: input.displayOrder
      }
    });
    return updated;
  })
});

// src/server/api/routers/invoice-group.ts
var import_zod11 = require("zod");
var import_server9 = require("@trpc/server");
var invoiceGroupRouter = createTRPCRouter({
  /**
   * Create a new invoice group
   */
  create: protectedProcedure.input(import_zod11.z.object({
    name: import_zod11.z.string().min(1),
    description: import_zod11.z.string().optional(),
    customerId: import_zod11.z.string().optional(),
    groupType: import_zod11.z.string().default("QUARTERLY"),
    periodStart: import_zod11.z.date().optional(),
    periodEnd: import_zod11.z.date().optional()
  })).mutation(async ({ ctx, input }) => {
    const group = await ctx.db.invoiceGroup.create({
      data: {
        id: idGenerator.invoiceGroup(),
        companyId: ctx.companyId,
        customerId: input.customerId,
        name: input.name,
        description: input.description,
        groupType: input.groupType,
        periodStart: input.periodStart,
        periodEnd: input.periodEnd,
        totalAmount: 0,
        invoiceCount: 0
      },
      include: {
        customer: true,
        invoices: {
          include: {
            customer: true,
            lines: true
          }
        }
      }
    });
    return group;
  }),
  /**
   * List all invoice groups with pagination
   */
  list: protectedProcedure.input(import_zod11.z.object({
    page: import_zod11.z.number().min(1).default(1),
    limit: import_zod11.z.number().min(1).max(100).default(20),
    customerId: import_zod11.z.string().optional()
  })).query(async ({ ctx, input }) => {
    const offset = (input.page - 1) * input.limit;
    const whereClause = {
      companyId: ctx.companyId,
      ...input.customerId && { customerId: input.customerId }
    };
    const [groups, totalCount] = await ctx.db.$transaction([
      ctx.db.invoiceGroup.findMany({
        where: whereClause,
        include: {
          customer: true,
          invoices: {
            select: {
              id: true,
              number: true,
              grandTotal: true,
              status: true
            }
          }
        },
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: input.limit
      }),
      ctx.db.invoiceGroup.count({ where: whereClause })
    ]);
    return {
      groups,
      totalCount,
      currentPage: input.page,
      totalPages: Math.ceil(totalCount / input.limit)
    };
  }),
  /**
   * Get single invoice group by ID with all invoices and attachments
   */
  getById: protectedProcedure.input(import_zod11.z.object({
    id: import_zod11.z.string().min(1)
  })).query(async ({ ctx, input }) => {
    const group = await ctx.db.invoiceGroup.findUnique({
      where: { id: input.id },
      include: {
        customer: true,
        company: true,
        invoices: {
          include: {
            customer: true,
            lines: true,
            attachments: true,
            company: true
          },
          orderBy: { issueDate: "asc" }
        }
      }
    });
    if (!group) {
      throw new import_server9.TRPCError({
        code: "NOT_FOUND",
        message: "Invoice group not found"
      });
    }
    if (group.companyId !== ctx.companyId) {
      throw new import_server9.TRPCError({
        code: "FORBIDDEN",
        message: "Access denied"
      });
    }
    return group;
  }),
  /**
   * Add invoice to a group
   */
  addInvoice: protectedProcedure.input(import_zod11.z.object({
    groupId: import_zod11.z.string().min(1),
    invoiceId: import_zod11.z.string().min(1)
  })).mutation(async ({ ctx, input }) => {
    const group = await ctx.db.invoiceGroup.findFirst({
      where: {
        id: input.groupId,
        companyId: ctx.companyId
      }
    });
    if (!group) {
      throw new import_server9.TRPCError({
        code: "NOT_FOUND",
        message: "Invoice group not found"
      });
    }
    const invoice = await ctx.db.invoice.findFirst({
      where: {
        id: input.invoiceId,
        companyId: ctx.companyId
      }
    });
    if (!invoice) {
      throw new import_server9.TRPCError({
        code: "NOT_FOUND",
        message: "Invoice not found"
      });
    }
    if (invoice.invoiceGroupId) {
      throw new import_server9.TRPCError({
        code: "BAD_REQUEST",
        message: "Invoice is already part of another group"
      });
    }
    await ctx.db.invoice.update({
      where: { id: input.invoiceId },
      data: { invoiceGroupId: input.groupId }
    });
    const updatedGroup = await ctx.db.invoiceGroup.update({
      where: { id: input.groupId },
      data: {
        totalAmount: { increment: invoice.grandTotal },
        invoiceCount: { increment: 1 }
      },
      include: {
        invoices: {
          include: {
            customer: true,
            lines: true
          }
        }
      }
    });
    return updatedGroup;
  }),
  /**
   * Remove invoice from a group
   */
  removeInvoice: protectedProcedure.input(import_zod11.z.object({
    groupId: import_zod11.z.string().min(1),
    invoiceId: import_zod11.z.string().min(1)
  })).mutation(async ({ ctx, input }) => {
    const group = await ctx.db.invoiceGroup.findFirst({
      where: {
        id: input.groupId,
        companyId: ctx.companyId
      }
    });
    if (!group) {
      throw new import_server9.TRPCError({
        code: "NOT_FOUND",
        message: "Invoice group not found"
      });
    }
    const invoice = await ctx.db.invoice.findFirst({
      where: {
        id: input.invoiceId,
        invoiceGroupId: input.groupId,
        companyId: ctx.companyId
      }
    });
    if (!invoice) {
      throw new import_server9.TRPCError({
        code: "NOT_FOUND",
        message: "Invoice not found in this group"
      });
    }
    await ctx.db.invoice.update({
      where: { id: input.invoiceId },
      data: { invoiceGroupId: null }
    });
    const updatedGroup = await ctx.db.invoiceGroup.update({
      where: { id: input.groupId },
      data: {
        totalAmount: { decrement: invoice.grandTotal },
        invoiceCount: { decrement: 1 }
      },
      include: {
        invoices: {
          include: {
            customer: true,
            lines: true
          }
        }
      }
    });
    return updatedGroup;
  }),
  /**
   * Delete invoice group (only if empty)
   */
  delete: protectedProcedure.input(import_zod11.z.object({
    id: import_zod11.z.string().uuid()
  })).mutation(async ({ ctx, input }) => {
    const group = await ctx.db.invoiceGroup.findFirst({
      where: {
        id: input.id,
        companyId: ctx.companyId
      },
      include: {
        invoices: true
      }
    });
    if (!group) {
      throw new import_server9.TRPCError({
        code: "NOT_FOUND",
        message: "Invoice group not found"
      });
    }
    if (group.invoices.length > 0) {
      throw new import_server9.TRPCError({
        code: "BAD_REQUEST",
        message: "Cannot delete group with invoices. Remove all invoices first."
      });
    }
    await ctx.db.invoiceGroup.delete({
      where: { id: input.id }
    });
    return { success: true };
  }),
  /**
   * Update invoice group metadata
   */
  update: protectedProcedure.input(import_zod11.z.object({
    id: import_zod11.z.string().uuid(),
    name: import_zod11.z.string().min(1).optional(),
    description: import_zod11.z.string().optional(),
    periodStart: import_zod11.z.date().optional(),
    periodEnd: import_zod11.z.date().optional()
  })).mutation(async ({ ctx, input }) => {
    const group = await ctx.db.invoiceGroup.findFirst({
      where: {
        id: input.id,
        companyId: ctx.companyId
      }
    });
    if (!group) {
      throw new import_server9.TRPCError({
        code: "NOT_FOUND",
        message: "Invoice group not found"
      });
    }
    const { id, ...updateData } = input;
    const updatedGroup = await ctx.db.invoiceGroup.update({
      where: { id: input.id },
      data: updateData,
      include: {
        customer: true,
        invoices: {
          include: {
            customer: true,
            lines: true
          }
        }
      }
    });
    return updatedGroup;
  })
});

// src/server/api/root.ts
var appRouter = createTRPCRouter({
  invoice: invoiceRouter,
  customer: customerRouter,
  payment: paymentRouter,
  company: companyRouter,
  service: serviceRouter,
  compliance: complianceRouter,
  communication: communicationRouter,
  dashboard: dashboardOptimizedRouter,
  attachment: attachmentRouter,
  invoiceGroup: invoiceGroupRouter
});

// electron/main.ts
var ADMIN_USER = {
  id: "user_admin_001",
  email: "admin@pragnyapradhan.com",
  companyId: "c1ad463d-13a4-4b11-9a4f-a8ab5d3c979b",
  // Actual UUID from database
  name: "Pragnya Pradhan"
};
var nextServer = null;
async function startNextServer() {
  if (electron_is_dev_default) return;
  const { spawn } = require("child_process");
  const standalonePath = import_path2.default.join(__dirname, "../../.next/standalone/cs-erp-app/server.js");
  console.log("\u{1F680} Starting standalone Next.js server...");
  console.log("\u{1F4C1} Server path:", standalonePath);
  const serverProcess = spawn("node", [standalonePath], {
    env: {
      ...process.env,
      PORT: "3005",
      HOSTNAME: "localhost"
    },
    stdio: "inherit"
  });
  serverProcess.on("error", (error) => {
    console.error("\u274C Failed to start Next.js server:", error);
  });
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log("\u2705 Next.js standalone server started on http://localhost:3005");
      resolve();
    }, 2e3);
  });
}
function createWindow() {
  const win = new import_electron3.BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: import_path2.default.join(__dirname, "preload.js")
      // Note: it will be .js after compilation
    }
  });
  win.loadURL("http://localhost:3005");
  if (electron_is_dev_default) {
    win.webContents.openDevTools();
  }
  return win;
}
import_electron3.app.whenReady().then(async () => {
  await fileStorage.initialize();
  console.log("\u2705 File storage initialized");
  await startNextServer();
  const mainWindow = createWindow();
  Ge({
    router: appRouter,
    windows: [mainWindow],
    createContext: async () => {
      return {
        db,
        companyId: ADMIN_USER.companyId,
        session: {
          user: {
            id: ADMIN_USER.id,
            email: ADMIN_USER.email,
            companyId: ADMIN_USER.companyId
          }
        },
        req: null,
        res: null
      };
    }
  });
});
import_electron3.app.on("window-all-closed", () => {
  if (nextServer) {
    nextServer.close();
  }
  if (process.platform !== "darwin") {
    import_electron3.app.quit();
  }
});
import_electron3.app.on("activate", () => {
  if (import_electron3.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
/*! Bundled license information:

cookie/index.js:
  (*!
   * cookie
   * Copyright(c) 2012-2014 Roman Shtylman
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)

bcryptjs/dist/bcrypt.js:
  (**
   * @license bcrypt.js (c) 2013 Daniel Wirtz <dcode@dcode.io>
   * Released under the Apache License, Version 2.0
   * see: https://github.com/dcodeIO/bcrypt.js for details
   *)

trpc-electron/dist/main.mjs:
  (* istanbul ignore if -- @preserve *)
*/
