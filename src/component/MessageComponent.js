import React, {useEffect, useState} from "react";
import ChatService from "../service/ChatService";
import {Button, Form, FormControl, InputGroup} from "react-bootstrap";
import ChatUserService from "../service/ChatUserService";
import MessageService from "../service/MessageService";
import addUser from "../img/addUser.png";
import edit from "../img/edit.png";
import AddUserModal from "./modal/AddUserModal";
import RenameChatModal from "./modal/RenameChatModal";
import {useNavigate} from "react-router-dom";

const MessageComponent = ({firstCode, allUsers, setNewTitle}) => {

    const [chatWithMessages, setChatWithMessages] = useState({});
    const [message, setMessage] = useState("");
    const [chatUser, setChatUser] = useState({});
    const [currentUser, setCurrentUser] = useState(localStorage.getItem({}));
    const [loading, setLoading] = useState(true);
    const [disable, setDisable] = useState(true);
    const [showAddUser, setShowAddUser] = useState(false);
    const [showEditTitle, setShowEditTitle] = useState(false);
    const [code, setCode] = useState("");

    if(firstCode !== code){
        getData();
    }

    function getData() {
        setCode(firstCode);
        ChatService.getMessagesByChat(firstCode).then(response => {
            setChatWithMessages(response.data);
            setLoading(false);
            setTimeout(function () {
                scroll();
            }, 100);
        });
        ChatUserService.getByChatAndUser(firstCode, localStorage.getItem("id")).then(r => {
            setChatUser(r.data);
        });
    }

    useEffect(() => {
        return () => {
            setCurrentUser({
                id: localStorage.getItem("id"),
                username: localStorage.getItem("username"),
                imgurl: localStorage.getItem("imgurl")
            })
            getData();
        };
    }, []);

    function changeMessage(e){
        let m;
        try {
            setMessage(e.target.value);
            m = e.target.value;
        } catch (TypeError) {
            m = e;
            setMessage(e);
        }
        if(m.trim().length > 0)
            setDisable(false);
        else
            setDisable(true);
    }

    function sendMessage(e){
        if(message.trim().length > 0){
            e.preventDefault();
            MessageService.save(message, formatDate(new Date()), chatUser).then(r => {
                changeMessage("");
                let msg = r.data;
                msg.userDTO = currentUser;
                chatWithMessages.messages.push(msg);
                setTimeout(function () {
                    scroll();
                }, 100);
            })
            e.preventDefault();
            return false;
        }
        setMessage("");
    }

    function scroll(){
        let chat = document.getElementById("center");
        if(chat !== null)
            chat.scrollTo(0, chat.scrollHeight);
    }

    function formatDate(date) {
        function padTo2Digits(number) {
            return number.toString().padStart(2, '0');
        }

        return (
            [
                date.getFullYear(),
                padTo2Digits(date.getMonth() + 1),
                padTo2Digits(date.getDate()),
            ].join('-') +
            ' ' +
            [
                padTo2Digits(date.getHours()),
                padTo2Digits(date.getMinutes()),
                padTo2Digits(date.getSeconds()),
            ].join(':')
        );
    }

    function displayMessage(message){
        let mine = message.userDTO.id === currentUser.id;
        return (<div style={{display: "flex", flexDirection: "column"}}>
                <div className={mine ? "messageBox myMessageBox" : "messageBox notMyMessageBox"}
                style={{flexDirection: mine ? "row-reverse" : "row"}}>
                    <div className={"photo"}>
                        <img src={message.userDTO.imgurl}/>
                    </div>
                    <div className={mine ? "message myMessage" : "message notMyMessage"}>
                        <div className={"username"} align={mine ? "right" : "left"}>
                            <strong>{message.userDTO.username}</strong>
                        </div>
                        <div className={"text"}>{message.text}</div>
                    </div>

                </div>
                <div style={{fontSize: "9px", paddingRight: "45px", paddingLeft: "45px"}}
                     align={mine ? "right" : "left"}>{message.dateTime}</div>
                </div>);
    }

    const getFromModal = (show) => {
        setShowAddUser(show);
        setShowEditTitle(show);
    }

    function addUserToChat(){
        ChatService.getUsersByChat(code).then(r => {
            chatWithMessages.users = r.data;
            setChatWithMessages(chatWithMessages);
            setShowAddUser(true);
            return <AddUserModal chat={chatWithMessages}/>
        })
    }

    if(loading)
        return null;

    function showEdit() {
        let title = document.getElementById("title");
        title.style.visibility = "visible";
    }

    function hideEdit() {
        let title = document.getElementById("title");
        title.style.visibility = "hidden";
    }

    function openEditModal(e) {
        e.preventDefault();
        setShowEditTitle(true);
    }

    function changeTitle(code, newTitle) {
        chatWithMessages.title = newTitle;
        setChatWithMessages(chatWithMessages);
        setNewTitle(code, newTitle);
    }

    return (
    <div style={{display: "flex", width: "75%"}}>
        <div className={"chat"}>
            <div className={"topBar"}>
                <div></div>
                <div>
                    <span align={"center"} style={{fontSize: "24px"}}
                        onMouseEnter={showEdit} onMouseLeave={hideEdit}>
                        {chatWithMessages.title}&nbsp;&nbsp;
                        <a href={""} onClick={(e) => openEditModal(e)}><img id={"title"} className={"editImg"} src={edit}/></a>
                    </span>
                    <p align={"center"} style={{marginLeft: "-25px"}} className={"mb-2"}>members: {chatWithMessages.members}</p>
                </div>
                <div className={"addUserToChat"}>
                    <img src={addUser} className={"addUserToChatImg"} onClick={addUserToChat}/>
                    {showAddUser && (
                        <AddUserModal chat={chatWithMessages} show={showAddUser} allUsers={allUsers}
                        getFromModal={getFromModal}/>
                    )}
                </div>
            </div>
            <div className={"center"} id={"center"}>
                {chatWithMessages.messages.map(message => (
                    <div key={message.id}>{displayMessage(message)}</div>
                ))}
            </div>
            <div className={"bottomBar"}>
                <Form style={{width: "100%", margin: "auto"}} onSubmit={sendMessage}>
                    <InputGroup className={"inputGroup"}>
                        <FormControl
                            required
                            onChange={changeMessage}
                            className={"inputText"}
                            placeholder="Write message there..."
                            value={message}
                        />
                        <Button variant={disable ? "outline-secondary" : "secondary"} type={"submit"} disabled={disable}

                        onClick={(e) => sendMessage(e)} >
                            Send
                        </Button>
                    </InputGroup>
                </Form>
            </div>
        </div>
        {showEditTitle && (
            <RenameChatModal chat={chatWithMessages} show={showEditTitle}
                             getFromModal={getFromModal} changeTitle={changeTitle}/>
        )}
    </div>

    );
}

export default MessageComponent;