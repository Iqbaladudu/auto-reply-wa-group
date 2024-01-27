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
var baileys_1 = require("@whiskeysockets/baileys");
var fs = require("fs");
var NodeCache = require("node-cache");
var custom_data1 = fs.readFileSync("./data/random_satu.txt", "utf-8");
var custom_data2 = fs.readFileSync("./data/random_dua.txt", "utf-8");
var custom_data3 = fs.readFileSync("./data/random_tiga.txt", "utf-8");
var custom_data4 = fs.readFileSync("./data/random_empat.txt", "utf-8");
var msgRetryCounterCache = new NodeCache();
var groupLinks = [
    "https://chat.whatsapp.com/F1dfrdCuOsQ5GpOM4mnR6w",
    "https://chat.whatsapp.com/DnIHDrnkBmoLcBQBcmjGM6",
    "https://chat.whatsapp.com/D2U2vYJYCUh9JHDTGVySZz",
    "https://chat.whatsapp.com/GhGR1A7wOyf8629IuSvXde",
    "https://chat.whatsapp.com/FsysgKav8qgAVycjPqjbaB",
    "https://chat.whatsapp.com/GtakGyCk4AUAjEfMlXunT7",
    "https://chat.whatsapp.com/EJFnrxLw8RfHCg05NuADHW",
    "https://chat.whatsapp.com/BsgnDOcMV0hIZ6K1IGWF40",
    "https://chat.whatsapp.com/JEi88DTFYDqG3pC9kps7jM",
    "https://chat.whatsapp.com/IusqZSd9pHDHv0olwtZFLD",
    "https://chat.whatsapp.com/LnhfFxye4ihC85HUNOwgXV",
    "https://chat.whatsapp.com/ClELspXzkfv4KYYrCgEGY4",
    "https://chat.whatsapp.com/9B1TOTE4PYm7QikwMsDG8c",
    "https://chat.whatsapp.com/6XOp7a5ADFh90ZB1r37UpV",
    "https://chat.whatsapp.com/GlrJGng8RzRCsaY8e2FSF2",
    "https://chat.whatsapp.com/ANK6S1lWvCfA8Ybe20dnKN",
    "https://chat.whatsapp.com/DUS9oGXBcF056R91ouGVh2",
    "https://chat.whatsapp.com/JiVOwbTqFQ5EycXxHIGX3Z",
    "https://chat.whatsapp.com/ApBOWzpu9pq3LsIC5g74az",
    "https://chat.whatsapp.com/ApeqNMWwAC1Gfd5m3AkJtQ",
    "https://chat.whatsapp.com/KT0VQpYJmMN6MMgcoOMZvt",
    "https://chat.whatsapp.com/FyC7hTuhF194enOBvwo3zM",
    "https://chat.whatsapp.com/G1rb3sPc4tQ9XVbmvHo186",
    "https://chat.whatsapp.com/FBiJfDmCfyjEJHyR2o8XBw",
    "https://chat.whatsapp.com/LKVGWz89M8604pNbqKitua",
    "https://chat.whatsapp.com/DXlhK6lY3vhL4xYXu7S2at",
    "https://chat.whatsapp.com/LgCbNrZ23bWHV36jJiyhAn",
    "https://chat.whatsapp.com/IUdjpLWd4fvAWEfTkw6hB6",
    "https://chat.whatsapp.com/CJ6D3O2hIQU0WRzhmO1IXR",
    "https://chat.whatsapp.com/JoH2ff9WrasJigpoDfKoEf",
    "https://chat.whatsapp.com/GQxqJwLTp4y6e4Ks2YwU4q",
    "https://chat.whatsapp.com/C9LKlF3fF3IEeKwk1m9dTL",
    "https://chat.whatsapp.com/Fg7DleEVQ7wLeAvwfe69AR",
    "https://chat.whatsapp.com/L40E4zqDtPJESUkdTEjsho",
    "https://chat.whatsapp.com/DBCUbyyDBEfCLVj3xmsaQp",
    "https://chat.whatsapp.com/F63EFRg1FoOC3qJjfjthGs",
    "https://chat.whatsapp.com/FXZbDtnQA6j1I9osZfZnIA",
    "https://chat.whatsapp.com/Hmw4z4LvctJ1B5DbHHfEwg",
    "https://chat.whatsapp.com/Bgb9KKSdP0nIVGdZLAf0mV",
    "https://chat.whatsapp.com/CkfOpQmtiokBQff3yyEOJF",
    "https://chat.whatsapp.com/I3T3nFckNDNEgFpqKszhxd",
    "https://chat.whatsapp.com/K9p7aPQu2yP8qTORTtIihh",
    "https://chat.whatsapp.com/BOMQUy7mMcBFzhr4xhWXmn",
    "https://chat.whatsapp.com/Bk69SfZZNxK0t0EoFk87wH",
    "https://chat.whatsapp.com/Fy0ne0pUkkT92sz6KCZxPR",
    "https://chat.whatsapp.com/4VurZQlDXWPHKlCntFY7vF",
    "https://chat.whatsapp.com/J1cDJC20Det48R5SWki0fb",
    "https://chat.whatsapp.com/BxDuLKsVOLr7NQXWzXkaNi",
    "https://chat.whatsapp.com/Jn0ly4NGI9HCrOhShXXSQX",
    "https://chat.whatsapp.com/Hmw4z4LvctJ1B5DbHHfEwg",
    "https://chat.whatsapp.com/LtAn7fgjSpz5IcnLxv85jO",
    "https://chat.whatsapp.com/K5z2jrL8TAWKdLnzvn0mRd",
    "https://chat.whatsapp.com/G09GJWvIDCjCC1GFNGXZ9n",
    "https://chat.whatsapp.com/Fb4JZXQ0KS9EPzT2TFCpu6",
    "https://chat.whatsapp.com/HG51dXWaTKYK4mgUOOPRGE",
    "https://chat.whatsapp.com/CevUlaL79XVC04Zn7lhg0F",
    "https://chat.whatsapp.com/Ihxvw8RaVF2Jo8MdGZ4Hpg",
    "https://chat.whatsapp.com/KgZmOFYrEUb6XHoDGrfqEg",
    "https://chat.whatsapp.com/H0og7Q1URjsL6mS8BhfTWy",
    "https://chat.whatsapp.com/6pmEETLJRvP7Bxnd2zJKeG",
    "https://chat.whatsapp.com/BkRQteu78nnLqjuZVRenoV",
    "https://chat.whatsapp.com/HbTOMm819F56FE03L2WVup",
    "https://chat.whatsapp.com/BWUutwTLdDjCvsc7rvHmEs",
    "https://chat.whatsapp.com/9IXH5NFSTOS2QaMqf7fFaf",
    "https://chat.whatsapp.com/E4gg2aWiBfxIAc9sVwVWc6",
    "https://chat.whatsapp.com/Ee55SlxbjsnFEMEOCVv3xM",
    "https://chat.whatsapp.com/AEaT5eeL6eq7omqZd3hSQh",
    "https://chat.whatsapp.com/KVRD1cLoZr6ADMG26YbgHH",
    "https://chat.whatsapp.com/3myKdQaBKRz9sIXRzetYla",
    "https://chat.whatsapp.com/2zgZqdgDfsC9NZFtubix0B",
    "https://chat.whatsapp.com/FUBKvoCRyXl5XZHjPkNGV8",
    "https://chat.whatsapp.com/G1601fzk0tmB9ci5cFcntF",
    "https://chat.whatsapp.com/3RjjnRsBr77GWIubbX01Zo",
    "https://chat.whatsapp.com/KC6Hr4nTFI7G4t99otGzWn",
    "https://chat.whatsapp.com/1xp1tkHwcpI2S6fr9MwNvT",
    "https://chat.whatsapp.com/L5whFw391GVDix7Dx24QyF",
    "https://chat.whatsapp.com/3GfCry7p0JL2g4RS3rzNFC",
    "https://chat.whatsapp.com/LO8sfD3LGhX5UZY6UNs67N",
    "https://chat.whatsapp.com/CE4UxOrMGwfLhVy3B6AHK7",
    "https://chat.whatsapp.com/BklJpXPs4vdBqtobPcnEEd",
    "https://chat.whatsapp.com/EufnxrIkxUb8gTUyRU2I6U",
    "https://chat.whatsapp.com/CUDfbKXNF4KHdqrxdHcmIa",
    "https://chat.whatsapp.com/CV0Tj6sEujS9uKkEOuKb5K",
    "https://chat.whatsapp.com/CzLnZZKRHhO5BXOjtK31Za",
    "https://chat.whatsapp.com/GUHzkekMHPCLtB4J3CPg1K",
    "https://chat.whatsapp.com/GzVDVzmOwLfK9wyC2ULHi5",
    "https://chat.whatsapp.com/JGaVbo4ANu1EDyhdtQKgfK",
    "https://chat.whatsapp.com/BUfu0eSytm69hVl80kiiBj",
    "https://chat.whatsapp.com/FzmXENKu0w96N1Xmj4uut8",
    "https://chat.whatsapp.com/BKm137Me1ZNBal66Iw5ZiU",
    "https://chat.whatsapp.com/CR7u7ZqQerG7xs40bRiVSA",
    "https://chat.whatsapp.com/ILAeOnENiCRDPXWe3WvSA6",
    "https://chat.whatsapp.com/Df264yHQcJkFFevijcC8wc",
    "https://chat.whatsapp.com/CGJrAA8ok7ZFACf0oa7VDa",
    "https://chat.whatsapp.com/EWtMh3NqH8T12353fFNFIm",
    "https://chat.whatsapp.com/DzHi992BbUe9fW6j1VRCoA",
    "https://chat.whatsapp.com/IvScjQc8L6tEpyepGwW3je",
    "https://chat.whatsapp.com/FxYqxdCq6zjHi0oJmWHPO8",
    "https://chat.whatsapp.com/7KdpK8sxLG82pxM5rIkkL9",
    "https://chat.whatsapp.com/DBLoGRk4xprL1nIdmFZ5Ai",
    "https://chat.whatsapp.com/1IX8ZI4V2Of5hK4vLO0i2o",
    "https://chat.whatsapp.com/GWooa3JmhOVGqRsMM64m40",
    "https://chat.whatsapp.com/AuhnSAwKpBe3rIgTzwfRIf",
    "https://chat.whatsapp.com/JbSV1hhaof69aBRIkAkTt7",
    "https://chat.whatsapp.com/HA5hJesCykH1tuWoZ3udof",
    "https://chat.whatsapp.com/IqlUkYbim7E2RkkP9XPLLV",
    "https://chat.whatsapp.com/KmxsYQhkNdGEPdZNLVIGZv",
    "https://chat.whatsapp.com/GIcKYGpknPt8tuFT2ZKhDE",
    "https://chat.whatsapp.com/EQjvxXC7s8S5eS0GcfvSUg",
    "https://chat.whatsapp.com/D2CccJ5DFs83RSSTHhGeg4",
    "https://chat.whatsapp.com/FouMJXnswnZB1DwLV7IWaE",
    "https://chat.whatsapp.com/BjW0gWcbrlc6kJqO1PyQMB",
    "https://chat.whatsapp.com/J40XcncoejT3b81Vm3LTBr",
    "https://chat.whatsapp.com/Jkbt9wo6pzK8Hxg9mibkav",
    "https://chat.whatsapp.com/BIn451qkeNLCmVz3CuRQzK",
    "https://chat.whatsapp.com/DybYetfbydYGBoOQmnngQe",
    "https://chat.whatsapp.com/Hw9M4qmes6bIww0svhNQl2",
    "https://chat.whatsapp.com/Dt14KQJuYAQLErpzPphKdgj",
    "https://chat.whatsapp.com/GFWgrczjzE877HXORHHIBo",
    "https://chat.whatsapp.com/CwmQ56IyYiT7l59mOfbEga",
    "https://chat.whatsapp.com/BB2sZsmxSryJmjPSVi93kP",
    "https://chat.whatsapp.com/Eeqg1kiO4hLL9DqMylDeLg",
    "https://chat.whatsapp.com/J9d5Y8IFZfkFI3SPIwAhXy",
    "https://chat.whatsapp.com/CpAAJlCS96A4K4djXL3edA",
    "https://chat.whatsapp.com/LdIq68ZLLI6JphJdFi5VNU",
    "https://chat.whatsapp.com/IagoyxPGJjo0ELAHCrfgMj",
    "https://chat.whatsapp.com/Dxp8KBmABxDKVUho7YENnL",
    "https://chat.whatsapp.com/F4NC4cdSZsQ5dKLNPwI5pl",
    "https://chat.whatsapp.com/IXzJv1tUwtXK8tzaxmL3dS",
    "https://chat.whatsapp.com/20Mn4rrPHrbD5R746zWCbt",
    "https://chat.whatsapp.com/ItHp7RH05okJsvz4j8sFpO",
    "https://chat.whatsapp.com/JqwD6euzSi45UL5kGH9Egr",
    "https://chat.whatsapp.com/KfdNLYDjQKy55MQIfP5XKe",
    "https://chat.whatsapp.com/Gdd91z26AnGLnqmC4thaoV",
    "https://chat.whatsapp.com/KLLlB5Tdpm9Ie0TmHrcVuj",
    "https://chat.whatsapp.com/J3BA9WkEOMm7PbsdLTHJrU",
    "https://chat.whatsapp.com/LW6k3Z9blHxJ8EdjmoAQVf",
    "https://chat.whatsapp.com/CkCWjUnYuq233aqjyjkInt",
    "https://chat.whatsapp.com/GeQd5AAG5Rz14TcvSnUlte",
    "https://chat.whatsapp.com/F5FiOqTxhtw4ZBdgpN7y0g",
    "https://chat.whatsapp.com/Fpvv3pz6ugWKfNaOpG2SH3",
    "https://chat.whatsapp.com/JxvgUS03kTZ0Ypy1Z2dM4u",
    "https://chat.whatsapp.com/IMQWkU5EbGU3ouK2aMbTYS",
    "https://chat.whatsapp.com/LMkiRFm9Wnt3B2m3zryk2h",
    "https://chat.whatsapp.com/Lms6IMjne2kAoJwCUVXmGR",
    "https://chat.whatsapp.com/DZgVL7YdgP63HNmF9a7awg",
    "https://chat.whatsapp.com/LtFC4shHTItLTcyew71wxH",
    "https://chat.whatsapp.com/C13mu47Xuug9bn2QTIIujH",
    "https://chat.whatsapp.com/LQD0Khw4h2zAMm4Ynlt59j",
    "https://chat.whatsapp.com/EdYt9l9CddNLxqZeI9wkzk",
    "https://chat.whatsapp.com/BHxfL9S75ie9iFjdQ2RSpO",
    "https://chat.whatsapp.com/B7NBiVJupz13ln0zdmByXu",
    "https://chat.whatsapp.com/FptReHDMdmCG7hjoPKQus9",
    "https://chat.whatsapp.com/CGgl6501XNHGIX6XQZq3ub",
    "https://chat.whatsapp.com/DIqVO4URhDS2kwOQjN7DzK",
    "https://chat.whatsapp.com/LLWAHbpGWE6HW2CL371BGb",
    "https://chat.whatsapp.com/GgKYcjfFHSBDlUKZxDmUUC",
    "https://chat.whatsapp.com/J2IaDaW7IQf9kOcYh8w51w",
    "https://chat.whatsapp.com/C2idIkIHOCiD8NweVZxRr1",
    "https://chat.whatsapp.com/KeRInv7D94040DlHIN3b6b",
    "https://chat.whatsapp.com/CJwB7rIg9rX8qBxoC62hjV",
    "https://chat.whatsapp.com/KqbVFoHXWnCIVMIxyFYPBm",
    "https://chat.whatsapp.com/EObRCEc0qcyATAkbhzwR3n",
    "https://chat.whatsapp.com/LU1Mmdn7FKuFdCbuc9RQka",
    "https://chat.whatsapp.com/KT91ksXnKUB401ce46taDM",
    "https://chat.whatsapp.com/KXONULcEb1yLPOStk7UKG6",
    "https://chat.whatsapp.com/FvbYNBOSRPf4iiAphlmrJf",
    "https://chat.whatsapp.com/C7YyGWyXNOiKG1KgNYW48M",
    "https://chat.whatsapp.com/D8aiy8xOdIl32qF9RXIh7b",
    "https://chat.whatsapp.com/BQmzuXwXGPO8SdAvE6HuH5",
    "https://chat.whatsapp.com/EYJJK2970cdCAsm8fQICGn",
    "https://chat.whatsapp.com/HWHnDbfbWXyGuUaUHmUqwF",
    "https://chat.whatsapp.com/FFMRhsZZJoFHoIty7IZHlA",
    "https://chat.whatsapp.com/LbAaexkmr0dFGkMhlw2222",
    "https://chat.whatsapp.com/KSGuV2SUs0V8VgvAKJq0ce",
    "https://chat.whatsapp.com/9VXtNSkOzzfF4LpVfi0uL2",
    "https://chat.whatsapp.com/GTZgoy7Yxm82gfnSUJUj3l",
    "https://chat.whatsapp.com/LgZm3tTmToTK33Bu8MqLAj",
    "https://chat.whatsapp.com/GAIZoer4X0A6zj0SJaobUa",
];
function connectToWhatsApp() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, state, saveCreds, sock;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, baileys_1.useMultiFileAuthState)("auth_info_baileys")];
                case 1:
                    _a = _b.sent(), state = _a.state, saveCreds = _a.saveCreds;
                    sock = (0, baileys_1.default)({
                        // can provide additional config here
                        printQRInTerminal: true,
                        auth: state,
                        generateHighQualityLinkPreview: true,
                        msgRetryCounterCache: msgRetryCounterCache,
                        defaultQueryTimeoutMs: undefined,
                    });
                    sock.ev.process(function (events) { return __awaiter(_this, void 0, void 0, function () {
                        var update, connection, lastDisconnect, shouldReconnect, upsert, _i, _a, msg, custom_data5;
                        var _b, _c, _d, _e, _f, _g, _h, _j;
                        return __generator(this, function (_k) {
                            switch (_k.label) {
                                case 0:
                                    if (events["connection.update"]) {
                                        update = events["connection.update"];
                                        connection = update.connection, lastDisconnect = update.lastDisconnect;
                                        if (connection === "close") {
                                            shouldReconnect = ((_c = (_b = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _b === void 0 ? void 0 : _b.output) === null || _c === void 0 ? void 0 : _c.statusCode) !==
                                                baileys_1.DisconnectReason.loggedOut;
                                            console.log("connection closed due to ", lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error, ", reconnecting ", shouldReconnect);
                                            // reconnect if not logged out
                                            if (shouldReconnect ||
                                                ((_e = (_d = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _d === void 0 ? void 0 : _d.output) === null || _e === void 0 ? void 0 : _e.statusCode) ===
                                                    baileys_1.DisconnectReason.timedOut) {
                                                connectToWhatsApp();
                                            }
                                            else if (((_g = (_f = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _f === void 0 ? void 0 : _f.output) === null || _g === void 0 ? void 0 : _g.statusCode) ===
                                                baileys_1.DisconnectReason.loggedOut) {
                                                fs.rmSync("./auth_info_baileys", { recursive: true });
                                                // this.connectToWhatsApp()
                                                // this.sock.printQRIfNecessaryListener()
                                            }
                                        }
                                        else if (connection === "open") {
                                            fs.writeFile("./qrdata.txt", "", function (err) {
                                                if (err) {
                                                    console.error("An error occurred while creating the file:", err);
                                                    return;
                                                }
                                                console.log("File created successfully!");
                                            });
                                        }
                                    }
                                    if (!events["connection.update"]) return [3 /*break*/, 2];
                                    return [4 /*yield*/, saveCreds()];
                                case 1:
                                    _k.sent();
                                    _k.label = 2;
                                case 2:
                                    if (!events["messages.upsert"]) return [3 /*break*/, 7];
                                    upsert = events["messages.upsert"];
                                    console.log("recv messages ", upsert.messages[0]);
                                    if (!(upsert.type === "notify")) return [3 /*break*/, 7];
                                    _i = 0, _a = upsert.messages;
                                    _k.label = 3;
                                case 3:
                                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                                    msg = _a[_i];
                                    if (!(!msg.key.fromMe && ((_h = msg.key.remoteJid) === null || _h === void 0 ? void 0 : _h.endsWith("g.us")))) return [3 /*break*/, 6];
                                    console.log(msg.key.remoteJid, (_j = events["labels.association"]) === null || _j === void 0 ? void 0 : _j.association.chatId);
                                    custom_data5 = fs.readFileSync("./data/random_lima.txt", "utf-8");
                                    console.log("replying to", msg.key.remoteJid);
                                    return [4 /*yield*/, sock.readMessages([msg.key])];
                                case 4:
                                    _k.sent();
                                    // await sock!.sendMessage(msg.key.remoteJid!, {text: `${custom_data1}`})
                                    // await sock!.sendMessage(msg.key.remoteJid!, {text: `${custom_data5}`})
                                    return [4 /*yield*/, sock.sendMessage(msg.key.remoteJid, {
                                            text: "".concat(custom_data4),
                                        })];
                                case 5:
                                    // await sock!.sendMessage(msg.key.remoteJid!, {text: `${custom_data1}`})
                                    // await sock!.sendMessage(msg.key.remoteJid!, {text: `${custom_data5}`})
                                    _k.sent();
                                    _k.label = 6;
                                case 6:
                                    _i++;
                                    return [3 /*break*/, 3];
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); });
                    // sock.ev.on('messages.upsert', async m => {
                    //     console.log("Sending Message")
                    //     await sock.sendMessage(m.messages[0].key.remoteJid!, { text: `${data_services}`,})
                    // })
                    // sock.ev.on('messages.upsert', m => {
                    //     console.log(m.messages[0].message?.senderKeyDistributionMessage?.groupId)
                    // console.log("Pesan dikirim")
                    // sock.sendMessage(m.messages[0].key.remoteJid!, { image: { url: "./data/tour.png"}, caption: `${data_tour}`})
                    // sock.sendMessage(m.messages[0].key.remoteJid!, { image: { url: "./data/services.png"}, caption: `${data_services}`})
                    // sock.sendMessage(m.messages[0].key.remoteJid!, { text: `${data_tour}`, });
                    // sock.sendMessage(m.messages[0].key.remoteJid!, { text: `${data_services}`, });
                    // console.log(m.messages[0])
                    // sock.sendMessage(m.messages[0].key.remoteJid!, buttonMessage)
                    // })
                    // sock.ev.on('chats.upsert', c => {
                    //     console.log(c[0])
                    // })
                    // sock.ev.on("labels.association", async l => {
                    //     await sock.sendMessage(l.association.chatId, { text: `${data_tour}`, });
                    // })
                    // sock.ev.on("groups.update", g => {
                    //     console.log(g[0])
                    // })
                    // sock.ev.on("groups.upsert", g => {
                    //     console.log(g[0])
                    // })
                    return [2 /*return*/, sock];
            }
        });
    });
}
// run in main file
connectToWhatsApp();
