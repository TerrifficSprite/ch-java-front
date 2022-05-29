import React, {useState, useEffect} from "react";
import UserService from "../service/UserService";

const ChatComponent = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        return () => {
            UserService.getUsers().then(response => {
                setUsers(response.data)
            });
        };
    }, []);




}

export default ChatComponent;