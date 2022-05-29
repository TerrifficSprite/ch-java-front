import axios from "axios";

const PATH = "http://localhost:8080/chat";

class ChatService {

    getChats(){
        axios.get(PATH);
    }
}

export default new ChatService();