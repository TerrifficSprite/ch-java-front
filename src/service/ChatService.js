import axios from "axios";

const PATH = "http://localhost:8080/chat";

class ChatService {

    getChats() {
        return axios.get(PATH);
    }

    saveChat(title, members) {
        return axios.post(PATH, {
            title: title,
            members: members
        });
    }

    updateChat(chat) {
        return axios.put(PATH, {
            id: chat.id,
            title: chat.title,
            code: chat.code,
            members: chat.members
        })
    }

    getMessagesByChat(code) {
        return axios.get(`${PATH}/${code}/messages`);
    }

    getUsersByChat(code){
        return axios.get(`${PATH}/${code}/users`);
    }


}

export default new ChatService();