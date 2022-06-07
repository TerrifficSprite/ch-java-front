import React, {useState, useEffect} from "react";
import {Button, Card, Dropdown, DropdownButton, FormControl, FormLabel, Image, Modal, Form} from "react-bootstrap";
import UserService from "../service/UserService";
import ChatService from "../service/ChatService";
import ChatUserService from "../service/ChatUserService";
import avatar from "../img/avatar.webp";
import addUser from "../img/addUser.png";

const ChatListComponent = () => {

    const [show, setShow] = useState(false);
    const [chats, setChats] = useState([]);
    const [users, setUsers] = useState([]);
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
        setChatTitle(e.target.value);
    }


    function change(e) {
        localStorage.setItem("id", e.id);
        localStorage.setItem("username", e.username);
        setTitle(e.username);
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
                ChatUserService.saveChatUser(chat.id, inviteUser[0].id).then(response => {
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
                <Image src={addUser} onClick={showModal}/>
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
            {getChats}
        </div>

    );
}

export default ChatListComponent;