import axios from "axios";

const PATH = "http://localhost:8080/chat-user";

class ChatService {

    saveChatUser(chat, user) {
        return axios.post(PATH, {
            userId: user,
            chatId: chat
        });
    }

    getByChatAndUser(chat, user) {
        return axios.get(`${PATH}/byChatAndUser?chat=${chat}&user=${user}`);
    }

}

export default new ChatService();