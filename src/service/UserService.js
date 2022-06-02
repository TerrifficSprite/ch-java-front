import axios from "axios";

const PATH = "http://localhost:8080/user";

class UserService {

    getUsers(){
        return axios.get(PATH);
    }

    getChatsByUser(id){
        return axios.get(PATH + "/" + id + "/chats");
    }
}

export default new UserService();