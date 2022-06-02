import React, {useState, useEffect} from "react";
import {Card, Dropdown, DropdownButton, Image} from "react-bootstrap";
import UserService from "../service/UserService";
import CreateChatModal from "src/component/modal/CreateChatModal";
import avatar from "../img/avatar.webp";
import addUser from "../img/addUser.png";
import {Modal} from "bootstrap";

const ChatListComponent = () => {
    const [chats, setChats] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        return () => {
            UserService.getUsers().then(response => {
                setUsers(response.data);
            });

            getChats();

        };
    }, []);

    try {
        console.log(chats[0].id);
    } catch (e) {

    }

    function getChats() {
        let id = localStorage.getItem("id");
        UserService.getChatsByUser(id === null ? users[0].id : id).then(response => {
            setChats(response.data);
        });
    }

    function change(e) {
        console.log(e);
        localStorage.setItem("id", e);
        getChats();
    }

    return (
        <div className="chats"
             style={{
                 width: "25%", height: "100%",
                 display: "flex", alignItems: "center"
             }}>

            <div className="dropdown">
                <DropdownButton variant={"success"} title="Users" onSelect={change}>
                    {users.map(user => (
                        <Dropdown.Item eventKey={user.id} key={user.id}>{user.username}</Dropdown.Item>
                    ))}
                </DropdownButton>
                <div style={{textAlign: "right", width: "100%"}}>
                    <Image src={addUser} style={{width: "20px", height: "20px"}} onClick={createChat}/>
                </div>
            </div>

            <div className="chatList">
                {chats.map(chat => (
                    <Card bg={"dark"} key={chat.id}
                          style={{display: "flex", flexDirection: "row"}}>
                        <Card.Img variant={"top"} src={avatar} style={{
                            width: "70px", height: "70px",
                            margin: "auto 5px"
                        }}/>
                        <Card.Body>
                            <Card.Title>{chat.title}</Card.Title>
                            <Card.Text>{chat.code}</Card.Text>
                        </Card.Body>
                    </Card>
                ))}
            </div>

        </div>

    );
}

export default ChatListComponent;