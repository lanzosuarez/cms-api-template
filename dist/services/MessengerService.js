"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fbmessenger_1 = require("fbmessenger");
const messenger = new fbmessenger_1.Messenger({
    pageAccessToken: process.env.PAGE_ACCESS_TOKEN
});
class MessengerService {
    static sendMessageText(text, fb_id) {
        return messenger
            .send({ text }, fb_id)
            .then(() => true)
            .catch(err => false);
    }
    static sendMessageWithAttachment(url, fb_id) {
        return messenger
            .send(new fbmessenger_1.Image({
            url
        }), fb_id)
            .then(() => true)
            .catch(err => false);
    }
}
exports.default = MessengerService;
//# sourceMappingURL=MessengerService.js.map