import axios from "axios";

const PATH = "http://localhost:8080/chat";

class ChatService {

    getChats() {
        return axios.get(PATH);
    }

    saveChat(title) {
        return axios.post(PATH, {
            title: title
        });
    }

    getMessagesByChat(code) {
        return axios.get(`${PATH}/${code}/messages`);
    }


}

export default new ChatService();