(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.trusona = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./lib/webauthn/preflight/preflight-checks"), exports);
__exportStar(require("./lib/webauthn/core/webauthn.options"), exports);
__exportStar(require("./lib/webauthn/core/authentication"), exports);
__exportStar(require("./lib/webauthn/core/configuration"), exports);
__exportStar(require("./lib/webauthn/core/enrollment"), exports);
__exportStar(require("./lib/webauthn/utils/strings"), exports);
__exportStar(require("./lib/webauthn/utils/errors"), exports);

},{"./lib/webauthn/core/authentication":2,"./lib/webauthn/core/configuration":3,"./lib/webauthn/core/enrollment":4,"./lib/webauthn/core/webauthn.options":5,"./lib/webauthn/preflight/preflight-checks":6,"./lib/webauthn/utils/errors":7,"./lib/webauthn/utils/strings":8}],2:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebAuthnAuthentication = exports.AuthenticationStatus = void 0;
var preflight_checks_1 = require("../preflight/preflight-checks");
var configuration_1 = require("./configuration");
var webauthn_options_1 = require("./webauthn.options");
var errors_1 = require("../utils/errors");
var strings_1 = require("../utils/strings");
var AuthenticationStatus;
(function (AuthenticationStatus) {
    AuthenticationStatus["SUCCESS"] = "SUCCESS";
    AuthenticationStatus["FAILED"] = "FAILED";
})(AuthenticationStatus = exports.AuthenticationStatus || (exports.AuthenticationStatus = {}));
var WebAuthnAuthentication = (function () {
    function WebAuthnAuthentication(preflightChecks, webAuthnOptions) {
        if (preflightChecks === void 0) { preflightChecks = new preflight_checks_1.DefaultPreflightChecks(); }
        if (webAuthnOptions === void 0) { webAuthnOptions = new webauthn_options_1.WebAuthnOptions(); }
        this.preflightChecks = preflightChecks;
        this.webAuthnOptions = webAuthnOptions;
    }
    WebAuthnAuthentication.prototype.authenticate = function (abortSignal, userIdentifier) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var challenge, blank, credential, credentialUserIdentifier, login, response, map, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!(((_a = configuration_1.Initializer.configuration) === null || _a === void 0 ? void 0 : _a.clientId) === undefined)) return [3, 2];
                        return [4, Promise.reject(new errors_1.SdkInitializationError())];
                    case 1: return [2, _d.sent()];
                    case 2: return [4, this.preflightChecks.isSupported()];
                    case 3:
                        if (!!(_d.sent())) return [3, 5];
                        return [4, Promise.reject(new errors_1.UnsupportedBrowserError())];
                    case 4: return [2, _d.sent()];
                    case 5: return [4, this.challenge()];
                    case 6:
                        challenge = _d.sent();
                        if (!(challenge === undefined)) return [3, 8];
                        return [4, Promise.reject(new Error('Failed to obtain challenge'))];
                    case 7: return [2, _d.sent()];
                    case 8:
                        blank = strings_1.Strings.blank(userIdentifier !== null && userIdentifier !== void 0 ? userIdentifier : '');
                        return [4, this.webAuthnOptions.getCredential(abortSignal, blank ? undefined : userIdentifier === null || userIdentifier === void 0 ? void 0 : userIdentifier.trim())];
                    case 9:
                        credential = _d.sent();
                        credentialUserIdentifier = window.atob((_b = credential === null || credential === void 0 ? void 0 : credential.response.userHandle) !== null && _b !== void 0 ? _b : '');
                        login = {
                            method: 'PUBLIC_KEY_CREDENTIAL',
                            nextStep: 'VERIFY_PUBLIC_KEY_CREDENTIAL',
                            challenge: challenge,
                            userIdentifier: credentialUserIdentifier,
                            displayName: credentialUserIdentifier,
                            response: credential
                        };
                        return [4, fetch(configuration_1.Initializer.loginsEndpoint, {
                                method: 'POST',
                                credentials: 'include',
                                body: JSON.stringify(login),
                                headers: { 'Content-Type': 'application/json' }
                            })];
                    case 10:
                        response = _d.sent();
                        if (!response.ok) return [3, 12];
                        return [4, response.json()];
                    case 11:
                        _c = _d.sent();
                        return [3, 13];
                    case 12:
                        _c = undefined;
                        _d.label = 13;
                    case 13:
                        map = _c;
                        return [4, Promise.resolve({
                                status: (map === null || map === void 0 ? void 0 : map.token) !== undefined ? AuthenticationStatus.SUCCESS : AuthenticationStatus.FAILED,
                                token: map === null || map === void 0 ? void 0 : map.token
                            })];
                    case 14: return [2, _d.sent()];
                }
            });
        });
    };
    WebAuthnAuthentication.prototype.challenge = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var url, response, map;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        url = "".concat((_b = (_a = configuration_1.Initializer.configuration) === null || _a === void 0 ? void 0 : _a.tenantUrl) !== null && _b !== void 0 ? _b : '', "/api/login_challenges");
                        return [4, fetch(url, { method: 'POST', body: '{}', headers: { 'Content-Type': 'application/json' } })];
                    case 1:
                        response = _c.sent();
                        return [4, response.json()];
                    case 2:
                        map = _c.sent();
                        return [4, Promise.resolve(map === null || map === void 0 ? void 0 : map.login_challenge)];
                    case 3: return [2, _c.sent()];
                }
            });
        });
    };
    return WebAuthnAuthentication;
}());
exports.WebAuthnAuthentication = WebAuthnAuthentication;

},{"../preflight/preflight-checks":6,"../utils/errors":7,"../utils/strings":8,"./configuration":3,"./webauthn.options":5}],3:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Initializer = void 0;
exports.Initializer = {
    config: {},
    initialize: function (tenantUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        return [4, this.loadConfiguration(tenantUrl)];
                    case 1:
                        _a.config = _c.sent();
                        if (!(this.configuration !== undefined)) return [3, 3];
                        return [4, Promise.resolve()];
                    case 2:
                        _b = _c.sent();
                        return [3, 5];
                    case 3: return [4, Promise.reject(new Error('Configuration was not loaded'))];
                    case 4:
                        _b = _c.sent();
                        _c.label = 5;
                    case 5: return [2, _b];
                }
            });
        });
    },
    get configuration() {
        return this.config;
    },
    loadConfiguration: function (tenantUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var response, map;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, fetch("".concat(tenantUrl, "/configuration"))];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) return [3, 4];
                        return [4, response.json()];
                    case 2:
                        map = _a.sent();
                        return [4, Promise.resolve({
                                clientId: map.clientId,
                                tenantUrl: tenantUrl
                            })];
                    case 3: return [2, _a.sent()];
                    case 4: return [4, Promise.resolve(undefined)];
                    case 5: return [2, _a.sent()];
                }
            });
        });
    },
    get loginsEndpoint() {
        var _a, _b;
        return "".concat((_b = (_a = this.configuration) === null || _a === void 0 ? void 0 : _a.tenantUrl) !== null && _b !== void 0 ? _b : '', "/api/logins");
    },
    get attestationOptionsEndpoint() {
        var _a, _b;
        return "".concat((_b = (_a = this.configuration) === null || _a === void 0 ? void 0 : _a.tenantUrl) !== null && _b !== void 0 ? _b : '', "/fido2/attestation/options");
    },
    get assertionOptionsEndpoint() {
        var _a, _b;
        return "".concat((_b = (_a = this.configuration) === null || _a === void 0 ? void 0 : _a.tenantUrl) !== null && _b !== void 0 ? _b : '', "/fido2/assertion/options");
    },
    get credentialsEndpoint() {
        var _a, _b;
        return "".concat((_b = (_a = this.configuration) === null || _a === void 0 ? void 0 : _a.tenantUrl) !== null && _b !== void 0 ? _b : '', "/api/credentials");
    },
    get enrollmentsEndpoint() {
        var _a, _b;
        return "".concat((_b = (_a = this.configuration) === null || _a === void 0 ? void 0 : _a.tenantUrl) !== null && _b !== void 0 ? _b : '', "/api/enrollments");
    }
};

},{}],4:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebAuthnEnrollment = exports.EnrollmentStatus = void 0;
var preflight_checks_1 = require("../preflight/preflight-checks");
var strings_1 = require("../utils/strings");
var errors_1 = require("../utils/errors");
var configuration_1 = require("./configuration");
var webauthn_options_1 = require("./webauthn.options");
var EnrollmentStatus;
(function (EnrollmentStatus) {
    EnrollmentStatus[EnrollmentStatus["SUCCESS"] = 0] = "SUCCESS";
    EnrollmentStatus[EnrollmentStatus["CANCELLED"] = 1] = "CANCELLED";
    EnrollmentStatus[EnrollmentStatus["FAILED"] = 2] = "FAILED";
    EnrollmentStatus[EnrollmentStatus["INVALID_TOKEN"] = 3] = "INVALID_TOKEN";
    EnrollmentStatus[EnrollmentStatus["SDK_NOT_INITIALIZED"] = 4] = "SDK_NOT_INITIALIZED";
    EnrollmentStatus[EnrollmentStatus["UNSUPPORTED_BROWSER"] = 5] = "UNSUPPORTED_BROWSER";
})(EnrollmentStatus = exports.EnrollmentStatus || (exports.EnrollmentStatus = {}));
var WebAuthnEnrollment = (function () {
    function WebAuthnEnrollment(preflightChecks, webAuthnOptions) {
        if (preflightChecks === void 0) { preflightChecks = new preflight_checks_1.DefaultPreflightChecks(); }
        if (webAuthnOptions === void 0) { webAuthnOptions = new webauthn_options_1.WebAuthnOptions(); }
        this.preflightChecks = preflightChecks;
        this.webAuthnOptions = webAuthnOptions;
    }
    WebAuthnEnrollment.prototype.enroll = function (token, abortSignal) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var response, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(((_a = configuration_1.Initializer.configuration) === null || _a === void 0 ? void 0 : _a.clientId) === undefined)) return [3, 2];
                        return [4, Promise.reject(new errors_1.SdkInitializationError())];
                    case 1: return [2, _c.sent()];
                    case 2: return [4, this.preflightChecks.isSupported()];
                    case 3:
                        if (!!(_c.sent())) return [3, 5];
                        return [4, Promise.reject(new errors_1.UnsupportedBrowserError())];
                    case 4: return [2, _c.sent()];
                    case 5:
                        if (!strings_1.Strings.blank(token)) return [3, 7];
                        return [4, Promise.reject(new Error('Blank token was provided'))];
                    case 6: return [2, _c.sent()];
                    case 7: return [4, fetch(configuration_1.Initializer.enrollmentsEndpoint, { method: 'POST', body: JSON.stringify({ token: token }), credentials: 'include', headers: { 'Content-Type': 'application/json' } })];
                    case 8:
                        response = _c.sent();
                        if (!response.ok) return [3, 10];
                        return [4, this.finalizeEnrollment(abortSignal)];
                    case 9:
                        _b = _c.sent();
                        return [3, 12];
                    case 10: return [4, Promise.resolve({ status: EnrollmentStatus.INVALID_TOKEN })];
                    case 11:
                        _b = _c.sent();
                        _c.label = 12;
                    case 12: return [2, _b];
                }
            });
        });
    };
    WebAuthnEnrollment.prototype.finalizeEnrollment = function (abortSignal) {
        return __awaiter(this, void 0, void 0, function () {
            var credential, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.webAuthnOptions.createCredential(abortSignal)];
                    case 1:
                        credential = _a.sent();
                        if (!(credential === undefined || abortSignal.aborted)) return [3, 3];
                        return [4, Promise.resolve({ status: EnrollmentStatus.CANCELLED })];
                    case 2: return [2, _a.sent()];
                    case 3: return [4, fetch(configuration_1.Initializer.credentialsEndpoint, { method: 'POST', body: JSON.stringify(credential), credentials: 'include', headers: { 'Content-Type': 'application/json' } })];
                    case 4:
                        response = _a.sent();
                        return [4, Promise.resolve({ status: response.ok ? EnrollmentStatus.SUCCESS : EnrollmentStatus.FAILED })];
                    case 5: return [2, _a.sent()];
                }
            });
        });
    };
    return WebAuthnEnrollment;
}());
exports.WebAuthnEnrollment = WebAuthnEnrollment;

},{"../preflight/preflight-checks":6,"../utils/errors":7,"../utils/strings":8,"./configuration":3,"./webauthn.options":5}],5:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebAuthnOptions = void 0;
var configuration_1 = require("./configuration");
var WebAuthn = __importStar(require("@github/webauthn-json"));
var WebAuthnOptions = (function () {
    function WebAuthnOptions() {
    }
    WebAuthnOptions.prototype.getCredential = function (abortSignal, userIdentifier) {
        return __awaiter(this, void 0, void 0, function () {
            var requestOptions, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, this.requestOptions(userIdentifier)];
                    case 1:
                        requestOptions = _b.sent();
                        requestOptions.rpId = window.location.hostname;
                        if (!(requestOptions !== undefined)) return [3, 3];
                        return [4, WebAuthn.get({ publicKey: requestOptions, signal: abortSignal })];
                    case 2:
                        _a = _b.sent();
                        return [3, 5];
                    case 3: return [4, Promise.resolve(undefined)];
                    case 4:
                        _a = _b.sent();
                        _b.label = 5;
                    case 5: return [2, _a];
                }
            });
        });
    };
    WebAuthnOptions.prototype.createCredential = function (abortSignal) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.attestationOptions()
                            .then(function (options) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        options.rp.name = window.location.hostname;
                                        options.rp.id = undefined;
                                        return [4, WebAuthn.create({ publicKey: options, signal: abortSignal })];
                                    case 1: return [2, _a.sent()];
                                }
                            });
                        }); })
                            .then(function (c) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, Promise.resolve(c)];
                                case 1: return [2, _a.sent()];
                            }
                        }); }); })];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    WebAuthnOptions.prototype.attestationOptions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, fetch(configuration_1.Initializer.attestationOptionsEndpoint, { credentials: 'include' })];
                    case 1:
                        response = _b.sent();
                        if (!response.ok) return [3, 3];
                        return [4, response.json()];
                    case 2:
                        _a = _b.sent();
                        return [3, 5];
                    case 3: return [4, Promise.reject(new Error('Failed to obtain attestation options.'))];
                    case 4:
                        _a = _b.sent();
                        _b.label = 5;
                    case 5: return [2, _a];
                }
            });
        });
    };
    WebAuthnOptions.prototype.requestOptions = function (userIdentifier) {
        return __awaiter(this, void 0, void 0, function () {
            var url, response, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        url = "".concat(configuration_1.Initializer.assertionOptionsEndpoint, "?userIdentifier=").concat(userIdentifier !== null && userIdentifier !== void 0 ? userIdentifier : '');
                        return [4, fetch(url, { credentials: 'include' })];
                    case 1:
                        response = _b.sent();
                        if (!response.ok) return [3, 3];
                        return [4, response.json()];
                    case 2:
                        _a = _b.sent();
                        return [3, 5];
                    case 3: return [4, Promise.reject(new Error('Failed to get assertion options.'))];
                    case 4:
                        _a = _b.sent();
                        _b.label = 5;
                    case 5: return [2, _a];
                }
            });
        });
    };
    return WebAuthnOptions;
}());
exports.WebAuthnOptions = WebAuthnOptions;

},{"./configuration":3,"@github/webauthn-json":9}],6:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultPreflightChecks = void 0;
var DefaultPreflightChecks = (function () {
    function DefaultPreflightChecks() {
    }
    DefaultPreflightChecks.prototype.isSupported = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var value, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _d = typeof window.PublicKeyCredential !== 'undefined';
                        if (!_d) return [3, 2];
                        return [4, this.isUserVerifyingPlatformAuthenticatorAvailable()];
                    case 1:
                        _d = ((_a = (_e.sent())) === null || _a === void 0 ? void 0 : _a.valueOf());
                        _e.label = 2;
                    case 2:
                        _c = _d;
                        if (!_c) return [3, 4];
                        return [4, this.isConditionalMediationAvailable()];
                    case 3:
                        _c = ((_b = (_e.sent())) === null || _b === void 0 ? void 0 : _b.valueOf());
                        _e.label = 4;
                    case 4:
                        value = _c;
                        return [4, Promise.resolve(value)];
                    case 5: return [2, _e.sent()];
                }
            });
        });
    };
    DefaultPreflightChecks.prototype.isConditionalMediationAvailable = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, ((_b = (_a = window.PublicKeyCredential) === null || _a === void 0 ? void 0 : _a.isConditionalMediationAvailable) === null || _b === void 0 ? void 0 : _b.call(_a))];
                    case 1: return [2, _c.sent()];
                }
            });
        });
    };
    DefaultPreflightChecks.prototype.isUserVerifyingPlatformAuthenticatorAvailable = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, ((_b = (_a = window.PublicKeyCredential) === null || _a === void 0 ? void 0 : _a.isUserVerifyingPlatformAuthenticatorAvailable) === null || _b === void 0 ? void 0 : _b.call(_a))];
                    case 1: return [2, _c.sent()];
                }
            });
        });
    };
    return DefaultPreflightChecks;
}());
exports.DefaultPreflightChecks = DefaultPreflightChecks;

},{}],7:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SdkInitializationError = exports.UnsupportedBrowserError = void 0;
var UnsupportedBrowserError = (function (_super) {
    __extends(UnsupportedBrowserError, _super);
    function UnsupportedBrowserError() {
        return _super.call(this, 'This browser is not supported') || this;
    }
    return UnsupportedBrowserError;
}(Error));
exports.UnsupportedBrowserError = UnsupportedBrowserError;
var SdkInitializationError = (function (_super) {
    __extends(SdkInitializationError, _super);
    function SdkInitializationError() {
        return _super.call(this, 'The SDK is not yet initialized') || this;
    }
    return SdkInitializationError;
}(Error));
exports.SdkInitializationError = SdkInitializationError;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Strings = void 0;
exports.Strings = {
    blank: function (value) {
        return !((value === null || value === void 0 ? void 0 : value.trim().length) > 0);
    }
};

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;
exports.get = get;
exports.schema = void 0;
exports.supported = supported;
// src/webauthn-json/base64url.ts
function base64urlToBuffer(baseurl64String) {
  const padding = "==".slice(0, (4 - baseurl64String.length % 4) % 4);
  const base64String = baseurl64String.replace(/-/g, "+").replace(/_/g, "/") + padding;
  const str = atob(base64String);
  const buffer = new ArrayBuffer(str.length);
  const byteView = new Uint8Array(buffer);
  for (let i = 0; i < str.length; i++) {
    byteView[i] = str.charCodeAt(i);
  }
  return buffer;
}
function bufferToBase64url(buffer) {
  const byteView = new Uint8Array(buffer);
  let str = "";
  for (const charCode of byteView) {
    str += String.fromCharCode(charCode);
  }
  const base64String = btoa(str);
  const base64urlString = base64String.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  return base64urlString;
}

// src/webauthn-json/convert.ts
var copyValue = "copy";
var convertValue = "convert";
function convert(conversionFn, schema2, input) {
  if (schema2 === copyValue) {
    return input;
  }
  if (schema2 === convertValue) {
    return conversionFn(input);
  }
  if (schema2 instanceof Array) {
    return input.map(v => convert(conversionFn, schema2[0], v));
  }
  if (schema2 instanceof Object) {
    const output = {};
    for (const [key, schemaField] of Object.entries(schema2)) {
      if (schemaField.derive) {
        const v = schemaField.derive(input);
        if (v !== void 0) {
          input[key] = v;
        }
      }
      if (!(key in input)) {
        if (schemaField.required) {
          throw new Error(`Missing key: ${key}`);
        }
        continue;
      }
      if (input[key] == null) {
        output[key] = null;
        continue;
      }
      output[key] = convert(conversionFn, schemaField.schema, input[key]);
    }
    return output;
  }
}
function derived(schema2, derive) {
  return {
    required: true,
    schema: schema2,
    derive
  };
}
function required(schema2) {
  return {
    required: true,
    schema: schema2
  };
}
function optional(schema2) {
  return {
    required: false,
    schema: schema2
  };
}

// src/webauthn-json/basic/schema.ts
var publicKeyCredentialDescriptorSchema = {
  type: required(copyValue),
  id: required(convertValue),
  transports: optional(copyValue)
};
var simplifiedExtensionsSchema = {
  appid: optional(copyValue),
  appidExclude: optional(copyValue),
  credProps: optional(copyValue)
};
var simplifiedClientExtensionResultsSchema = {
  appid: optional(copyValue),
  appidExclude: optional(copyValue),
  credProps: optional(copyValue)
};
var credentialCreationOptions = {
  publicKey: required({
    rp: required(copyValue),
    user: required({
      id: required(convertValue),
      name: required(copyValue),
      displayName: required(copyValue)
    }),
    challenge: required(convertValue),
    pubKeyCredParams: required(copyValue),
    timeout: optional(copyValue),
    excludeCredentials: optional([publicKeyCredentialDescriptorSchema]),
    authenticatorSelection: optional(copyValue),
    attestation: optional(copyValue),
    extensions: optional(simplifiedExtensionsSchema)
  }),
  signal: optional(copyValue)
};
var publicKeyCredentialWithAttestation = {
  type: required(copyValue),
  id: required(copyValue),
  rawId: required(convertValue),
  authenticatorAttachment: optional(copyValue),
  response: required({
    clientDataJSON: required(convertValue),
    attestationObject: required(convertValue),
    transports: derived(copyValue, response => {
      var _a;
      return ((_a = response.getTransports) == null ? void 0 : _a.call(response)) || [];
    })
  }),
  clientExtensionResults: derived(simplifiedClientExtensionResultsSchema, pkc => pkc.getClientExtensionResults())
};
var credentialRequestOptions = {
  mediation: optional(copyValue),
  publicKey: required({
    challenge: required(convertValue),
    timeout: optional(copyValue),
    rpId: optional(copyValue),
    allowCredentials: optional([publicKeyCredentialDescriptorSchema]),
    userVerification: optional(copyValue),
    extensions: optional(simplifiedExtensionsSchema)
  }),
  signal: optional(copyValue)
};
var publicKeyCredentialWithAssertion = {
  type: required(copyValue),
  id: required(copyValue),
  rawId: required(convertValue),
  authenticatorAttachment: optional(copyValue),
  response: required({
    clientDataJSON: required(convertValue),
    authenticatorData: required(convertValue),
    signature: required(convertValue),
    userHandle: required(convertValue)
  }),
  clientExtensionResults: derived(simplifiedClientExtensionResultsSchema, pkc => pkc.getClientExtensionResults())
};
var schema = {
  credentialCreationOptions,
  publicKeyCredentialWithAttestation,
  credentialRequestOptions,
  publicKeyCredentialWithAssertion
};

// src/webauthn-json/basic/api.ts
exports.schema = schema;
function createRequestFromJSON(requestJSON) {
  return convert(base64urlToBuffer, credentialCreationOptions, requestJSON);
}
function createResponseToJSON(credential) {
  return convert(bufferToBase64url, publicKeyCredentialWithAttestation, credential);
}
async function create(requestJSON) {
  const credential = await navigator.credentials.create(createRequestFromJSON(requestJSON));
  return createResponseToJSON(credential);
}
function getRequestFromJSON(requestJSON) {
  return convert(base64urlToBuffer, credentialRequestOptions, requestJSON);
}
function getResponseToJSON(credential) {
  return convert(bufferToBase64url, publicKeyCredentialWithAssertion, credential);
}
async function get(requestJSON) {
  const credential = await navigator.credentials.get(getRequestFromJSON(requestJSON));
  return getResponseToJSON(credential);
}

// src/webauthn-json/basic/supported.ts
function supported() {
  return !!(navigator.credentials && navigator.credentials.create && navigator.credentials.get && window.PublicKeyCredential);
}

},{}]},{},[1])(1)
});