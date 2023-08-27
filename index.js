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
function connectToWhatsApp() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, state, saveCreds, sock;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, baileys_1.useMultiFileAuthState)('auth_info_baileys')];
                case 1:
                    _a = _b.sent(), state = _a.state, saveCreds = _a.saveCreds;
                    sock = (0, baileys_1.default)({
                        // can provide additional config here
                        printQRInTerminal: true,
                        auth: state,
                        generateHighQualityLinkPreview: true,
                        msgRetryCounterCache: msgRetryCounterCache,
                    });
                    sock.ev.process(function (events) { return __awaiter(_this, void 0, void 0, function () {
                        var update, connection, lastDisconnect, shouldReconnect, upsert, _i, _a, msg;
                        var _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    if (events["connection.update"]) {
                                        update = events["connection.update"];
                                        connection = update.connection, lastDisconnect = update.lastDisconnect;
                                        if (connection === 'close') {
                                            shouldReconnect = ((_c = (_b = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _b === void 0 ? void 0 : _b.output) === null || _c === void 0 ? void 0 : _c.statusCode) !== baileys_1.DisconnectReason.loggedOut;
                                            console.log('connection closed due to ', lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error, ', reconnecting ', shouldReconnect);
                                            // reconnect if not logged out
                                            if (shouldReconnect) {
                                                connectToWhatsApp();
                                            }
                                        }
                                        else if (connection === 'open') {
                                            console.log('opened connection');
                                            update.receivedPendingNotifications = false;
                                        }
                                    }
                                    if (!events["connection.update"]) return [3 /*break*/, 2];
                                    return [4 /*yield*/, saveCreds()];
                                case 1:
                                    _d.sent();
                                    _d.label = 2;
                                case 2:
                                    if (events["labels.association"]) {
                                        console.log(events["labels.association"]);
                                    }
                                    if (!events['messages.upsert']) return [3 /*break*/, 8];
                                    upsert = events['messages.upsert'];
                                    console.log('recv messages ', upsert);
                                    if (!(upsert.type === 'notify')) return [3 /*break*/, 8];
                                    _i = 0, _a = upsert.messages;
                                    _d.label = 3;
                                case 3:
                                    if (!(_i < _a.length)) return [3 /*break*/, 8];
                                    msg = _a[_i];
                                    if (!!msg.key.fromMe) return [3 /*break*/, 7];
                                    console.log('replying to', msg.key.remoteJid);
                                    return [4 /*yield*/, sock.readMessages([msg.key])];
                                case 4:
                                    _d.sent();
                                    return [4 /*yield*/, sock.sendMessage(msg.key.remoteJid, { text: "".concat(custom_data1) })];
                                case 5:
                                    _d.sent();
                                    return [4 /*yield*/, sock.sendMessage(msg.key.remoteJid, { text: "".concat(custom_data4) })
                                        // await sock!.sendMessage(msg.key.remoteJid!, {text: `${data_tour}`})
                                        // await sock!.sendMessage(msg.key.remoteJid!, {text: `${data_services}`})
                                    ];
                                case 6:
                                    _d.sent();
                                    _d.label = 7;
                                case 7:
                                    _i++;
                                    return [3 /*break*/, 3];
                                case 8: return [2 /*return*/];
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
