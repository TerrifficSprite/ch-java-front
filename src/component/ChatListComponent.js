import React, {useState, useEffect} from "react";
import {Button, Card, Dropdown, DropdownButton, FormControl, FormLabel, Image, Modal, Form} from "react-bootstrap";
import {Link} from "react-router-dom";
import UserService from "../service/UserService";
import ChatService from "../service/ChatService";
import ChatUserService from "../service/ChatUserService";
import avatar from "../img/avatar.webp";
import addUser from "../img/addUser.png";

const ChatListComponent = () => {

    const [show, setShow] = useState(false);
    const [chats, setChats] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [title, setTitle] = useState("Users");
    const [inviteTitle, setInviteTitle] = useState("Users");
    const [chatTitle, setChatTitle] = useState("");

    const showModal = () => setShow(true);

    useEffect(() => {
        return () => {
            UserService.getUsers().then(response => {
                setUsers(response.data);
                getChats();
                setTitle(localStorage.getItem("username"));
                let user = response.data.find(u => u.id === localStorage.getItem("id"));
                setCurrentUser(user);
                localStorage.setItem("imgurl", user.imgurl);
            });
        };
    }, []);

    function getChats() {
        let id = localStorage.getItem("id");
        if(id === null)
            setChats([]);
        else {
            UserService.getChatsByUser(id).then(response => {
                setChats(response.data);
            });
        }
    }

    function changeChatName(e){
        try {
            setChatTitle(e.target.value);
        } catch (TypeError) {
            setChatTitle(e);
        }
    }


    function change(e) {
        localStorage.setItem("id", e.id);
        localStorage.setItem("username", e.username);
        localStorage.setItem("imgurl", e.imgurl);
        setCurrentUser(e);
        setTitle(e.username);
        document.location = "http://localhost:3000/";
        getChats();
    }

    const filteredUsers =  users.filter((user) => user.id !== localStorage.getItem("id"));

    function createChat(e){
        if(inviteTitle === "Users")
            e.preventDefault();
        else if (chatTitle.length !== 0) {
            ChatService.saveChat(chatTitle).then(response => {
                let chat = response.data;
                console.log(chatTitle, chat);
                ChatUserService.saveChatUser(chat.id, localStorage.getItem("id"));
                let inviteUser = users.filter(x => x.username === inviteTitle);
                ChatUserService.saveChatUser(chat.id, inviteUser[0].id).then(() => {
                    hideModal();
                    getChats();
                });
            });
            e.preventDefault();
        }
        e.preventDefault();
    }

    function hideModal(){
        setInviteTitle("Users");
        setShow(false);
        changeChatName("");
    }

    return (
        <div className="chats">
            <div className="dropdown">
                <DropdownButton variant={"success"} title={title}>
                    {users.map(user => (
                        <Dropdown.Item eventKey={user} key={user.id}
                                       onClick={() => change(user)}>{user.username}</Dropdown.Item>
                    ))}
                </DropdownButton>
                <div style={{width: "15%"}}>
                    <Image src={addUser} onClick={showModal} className={"imgAddUser"}/>
                </div>

                <div>
                    <Modal show={show} onHide={hideModal} backdrop={"static"} className={"modal"}>
                        <Form>
                            <Modal.Header closeButton>
                                <Modal.Title>Create chat</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <FormControl required placeholder={"Chat title"} className={"mb-2"}
                                onChange={changeChatName}/>
                                <FormLabel>Who you want to invite</FormLabel>
                                <DropdownButton title={inviteTitle}
                                                style={{width: "100%"}}>
                                    {filteredUsers.map(user => (
                                        <Dropdown.Item onClick={() => setInviteTitle(user.username)}
                                                       key={user.id}>{user.username}</Dropdown.Item>
                                    ))}
                                </DropdownButton>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="danger" onClick={hideModal}>
                                    Close
                                </Button>
                                <Button variant="success" onClick={createChat} type={"submit"}>
                                    Create chat
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal>
                </div>
            </div>

            <div className="chatList">
                {chats.map(chat => (
                    <div className={"one"}>
                        <a href={`/chat/${chat.code}`}>
                            <Card bg={"dark"} key={chat.id}
                                  style={{display: "flex", flexDirection: "row"}}>
                                <Card.Img variant={"top"} src={currentUser.imgurl} className={"cardImg"}/>
                                <Card.Body>
                                    <Card.Title>{chat.title}</Card.Title>
                                    <Card.Text>{chat.code}</Card.Text>
                                </Card.Body>
                            </Card>
                        </a>
                    </div>

                ))}
            </div>
            {getChats}
        </div>

    );
}

export default ChatListComponent;