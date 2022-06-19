import React, {useEffect, useState} from "react";
import ChatService from "../service/ChatService";
import {Button, Form, FormControl, InputGroup} from "react-bootstrap";
import {w3cwebsocket} from "websocket";
import ChatUserService from "../service/ChatUserService";
import MessageService from "../service/MessageService";
import addUser from "../img/addUser.png";
import edit from "../img/edit.png";
import AddUserModal from "./modal/AddUserModal";
import RenameChatModal from "./modal/RenameChatModal";
import SockJS from "sockjs-client";
import {over} from "stompjs";

var stomp;
var t = false;
var messages = [];

const MessageComponent = ({firstCode, allUsers, setNewTitle}) => {

    const [chatWithMessages, setChatWithMessages] = useState({
        id: null,
        title: null,
        code: firstCode,
        members: 0,
        messages: []
    });
    const [message, setMessage] = useState("");
    const [chatUser, setChatUser] = useState({});
    const [currentUser, setCurrentUser] = useState(localStorage.getItem({}));
    const [loading, setLoading] = useState(true);
    const [disable, setDisable] = useState(true);
    const [showAddUser, setShowAddUser] = useState(false);
    const [showEditTitle, setShowEditTitle] = useState(false);
    const [code, setCode] = useState("");
    const [update, setUpdate] = useState(false);

    if (firstCode !== code) {
        getData();
    }

    function messageReceived(payload) {
        let msg = JSON.parse(payload.body);
        if(messages.length < 1)
            messages.push(msg);
        setUpdate(!update);
        t = true;

        setTimeout(function () {
            scroll();
        }, 100);
    }

    if (t) {
        chatWithMessages.messages = chatWithMessages.messages.concat(messages);
        console.log(chatWithMessages);
        messages = [];
        t = false;
        setUpdate(!update);
    }

    const onConnected = () => {
        console.log("nice");
        stomp.subscribe("/currentChat/chats/", messageReceived);
    }

    const onError = (err) => {
        console.log(err);
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

    function getData() {
        setCode(firstCode);
        ChatService.getMessagesByChat(firstCode).then(response => {
            setChatWithMessages(response.data);
            setLoading(false);

            let sock = new SockJS("http:localhost:8080/chats");
            stomp = over(sock);
            stomp.connect({}, onConnected, onError);
            setTimeout(function () {
                scroll();
            }, 100);
        });
        ChatUserService.getByChatAndUser(firstCode, localStorage.getItem("id")).then(r => {
            setChatUser(r.data);
        });
    }

    function changeMessage(e) {
        let m;
        try {
            setMessage(e.target.value);
            m = e.target.value;
        } catch (TypeError) {
            m = e;
            setMessage(e);
        }
        if (m.trim().length > 0)
            setDisable(false);
        else
            setDisable(true);

    }

    function sendMessage(e) {
        if (message.trim().length > 0) {
            e.preventDefault();
            if (stomp) {
                let msg = {
                    text: message.trim(),
                    dateTime: formatDate(new Date()),
                    chatUserId: chatUser.id,
                    userDTO: {
                        id: localStorage.getItem("id"),
                        username: localStorage.getItem("username"),
                        imgurl: localStorage.getItem("imgurl")
                    }
                }
                stomp.send("/app/messages", {}, JSON.stringify(msg));
                changeMessage("");
            }
            e.preventDefault();
            return false;
        }
        setMessage("");
    }

    function scroll() {
        let chat = document.getElementById("center");
        if (chat !== null)
            chat.scrollTo(0, chat.scrollHeight);
    }

    function formatDate(date) {
        function padTo2Digits(number) {
            return number.toString().padStart(2, '0');
        }

        let ms = date.getMilliseconds().toString();
        if (ms.length < 2) {
            ms = ms + "0";
        } else {
            ms = ms.substring(0, 2);
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
                ].join(':') +
                '.' +
                [
                    ms
                ]
            );
    }

    function displayMessage(message) {
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

    function addUserToChat() {
        ChatService.getUsersByChat(code).then(r => {
            chatWithMessages.users = r.data;
            setChatWithMessages(chatWithMessages);
            setShowAddUser(true);
            return <AddUserModal chat={chatWithMessages}/>
        })
    }

    if (loading)
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

    function loadMore() {
        MessageService.loadMore(chatWithMessages.code, chatWithMessages.messages.length).then(r => {
            let tempArr = r.data;
            chatWithMessages.messages = tempArr.concat(chatWithMessages.messages);

            MessageService.count(chatWithMessages.code).then(r => {
                if (chatWithMessages.length === r.data)
                    document.getElementById("loadMore").style.display = "none";
            });

            setUpdate(!update);

        });
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
                        <a href={""} onClick={(e) => openEditModal(e)}><img id={"title"} className={"editImg"}
                                                                            src={edit}/></a>
                    </span>
                        <p align={"center"} style={{marginLeft: "-25px"}}
                           className={"mb-2"}>members: {chatWithMessages.members}</p>
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
                    <div align={"center"} style={{padding: "5px"}}>
                        <Button id={"loadMore"} style={{margin: "auto"}} onClick={loadMore}>Load more</Button>
                    </div>
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
                            <Button variant={disable ? "outline-secondary" : "secondary"} type={"submit"}
                                    disabled={disable}
                                    onClick={(e) => sendMessage(e)}>
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