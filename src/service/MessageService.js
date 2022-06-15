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
}

export default new MessageService();