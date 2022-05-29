import axios from "axios";

const PATH = "http://localhost:8080/user";

class UserService {

    getUsers(){
        return axios.get(PATH);
    }
}

export default new UserService();