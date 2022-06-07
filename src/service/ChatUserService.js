import axios from "axios";

const PATH = "http://localhost:8080/chat-user";

class ChatService {

    saveChatUser(chat, user) {
        return axios.post(PATH, {
            userId: user,
            chatId: chat
        });
    }


}

export default new ChatService();