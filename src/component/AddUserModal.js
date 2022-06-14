import {Button, Dropdown, DropdownButton, Form, FormControl, FormLabel, Modal} from "react-bootstrap";
import React, {useState} from "react";
import ChatService from "../service/ChatService";
import ChatUserService from "../service/ChatUserService";
import chatService from "../service/ChatService";


const AddUserModal = ({chat, getFromModal, allUsers}, showOnce) => {

    const [show, setShow] = useState(showOnce);
    const [inviteTitle, setInviteTitle] = useState("Users");
    const [filteredUsers, setFilteredUsers] = useState([]);
    let users = chat.users;


    function hideModal() {
        getFromModal(false);
        setShow(false);
        setInviteTitle("Users");
    }

    function onShowModal() {
        setFilteredUsers(allUsers.filter(user => !users.includes(user)));
    }

    function addUser(e){
        if (inviteTitle === "Users")
            e.preventDefault();
        else {
            chat.members += 1;
            chatService.updateChat(chat);
            let inviteUser = allUsers.filter(x => x.username === inviteTitle);
            ChatUserService.saveChatUser(chat.id, inviteUser[0].id);
        }
        hideModal();
        e.preventDefault();
        return false;
    }

    return (
        <Modal show={show} onHide={hideModal} onShow={onShowModal} backdrop={"static"} className={"modal"}>
            <span style={{width: "100%", height: "100%", backgroundColor: "#282C34", color: "#fff"}}>
            <Form>
                <Modal.Header>
                    <Modal.Title>Add user to chat <strong>{chat.title}</strong></Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                    <Button variant="success" onClick={addUser}>
                        Add User
                    </Button>
                </Modal.Footer>
            </Form>
            </span>
        </Modal>
    );
    return (<></>)
}

export default AddUserModal;