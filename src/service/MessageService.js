import axios from "axios";

const PATH = "http://localhost:8080/message";

class MessageService {


    save(text, dateTime, chatUser) {
        return axios.post(PATH, {
            text: text,
            dateTime: dateTime,
            chatUserId: chatUser.id
        });
    }

    loadMore(code, present) {
        return axios.get(PATH + `/${code}/${present}`);
    }

    count(code) {
        return axios.get(PATH + `/${code}/count`);
    }
}

export default new MessageService();