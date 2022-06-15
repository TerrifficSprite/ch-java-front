import {Button, Dropdown, DropdownButton, Form, FormControl, FormLabel, Modal} from "react-bootstrap";
import React, {useState} from "react";
import ChatService from "../../service/ChatService";
import ChatUserService from "../../service/ChatUserService";


const CreateChatModal = ({users, getFromModal, getChats}, showOnce) => {

    const [inviteTitle, setInviteTitle] = useState("Users");
    const [chatTitle, setChatTitle] = useState("");
    const [chats, setChats] = useState([]);
    const [show, setShow] = useState(showOnce);
    const [filteredUsers, setFilteredUsers] = useState([]);


    if(users === undefined)
        users = [];

    function changeChatName(e) {
        try {
            setChatTitle(e.target.value);
        } catch (TypeError) {
            setChatTitle(e);
        }
    }

    function hideModal() {
        getFromModal(false);
        setShow(false);
        setInviteTitle("Users");
        changeChatName("");
    }

    function createChat(e) {
        if (inviteTitle === "Users")
            e.preventDefault();
        else if (chatTitle.length !== 0) {
            ChatService.saveChat(chatTitle, 2).then(response => {
                let chat = response.data;
                ChatUserService.saveChatUser(chat.id, localStorage.getItem("id"));
                let inviteUser = users.filter(x => x.username === inviteTitle);
                ChatUserService.saveChatUser(chat.id, inviteUser[0].id).then(() => {
                    getChats();
                });
            });
            e.preventDefault();
            hideModal();
        }
        e.preventDefault();
    }

    function onShowModal() {
        setFilteredUsers(users.filter((user) => user.id !== localStorage.getItem("id")));
    }

    return (
        <Modal show={show} onHide={hideModal} onShow={onShowModal} backdrop={"static"} className={"modal"}>
            <span style={{width: "100%", height: "100%", backgroundColor: "#282C34", color: "#fff"}}>
            <Form>
                <Modal.Header>
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
            </span>
        </Modal>
    );
}

export default CreateChatModal;