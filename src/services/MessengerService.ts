import { Messenger, Image } from "fbmessenger";
const messenger = new Messenger({
  pageAccessToken: process.env.PAGE_ACCESS_TOKEN
});

export default class MessengerService {
  static sendMessageText(text, fb_id) {
    return messenger
      .send({ text }, fb_id)
      .then(() => true)
      .catch(err => false);
  }

  static sendMessageWithAttachment(url, fb_id) {
    return messenger
      .send(
        new Image({
          url
        }),
        fb_id
      )
      .then(() => true)
      .catch(err => false);
  }
}
