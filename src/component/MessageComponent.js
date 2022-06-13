import {useState, useEffect, useRef} from "react";
import {useParams} from "react-router-dom";
import ChatService from "../service/ChatService";
import ChatListComponent from "./ChatListComponent";
import {Form, FormControl, Button, InputGroup} from "react-bootstrap";
import ChatUserService from "../service/ChatUserService";
import MessageService from "../service/MessageService";
import UserService from "../service/UserService";

const MessageComponent = () => {

    const { code } = useParams();
    const [chatWithMessages, setChatWithMessages] = useState({});
    const [message, setMessage] = useState("");
    const [chatUser, setChatUser] = useState({});
    const [currentUser, setCurrentUser] = useState(localStorage.getItem({}));
    const [loading, setLoading] = useState(true);

    const chat = useRef(null);

    useEffect(() => {
        return () => {
            setCurrentUser({
                id: localStorage.getItem("id"),
                username: localStorage.getItem("username"),
                imgurl: localStorage.getItem("imgurl")
            })
            ChatService.getMessagesByChat(code).then(response => {
                setChatWithMessages(response.data);
                setLoading(false);
                setTimeout(function () {
                    scroll();
                }, 100);
            });
            ChatUserService.getByChatAndUser(code, localStorage.getItem("id")).then(r => {
                setChatUser(r.data);
            });
        };
    }, []);

    function changeMessage(e){
        try {
            setMessage(e.target.value);
        } catch (TypeError) {
            setMessage(e);
        }
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
        e.preventDefault();
        return false;
    }

    function scroll(){
        let chat = document.getElementById("center");
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

    function myMessage(message){
        if(message.userDTO.id === currentUser.id){
            return (<div align={"right"} style={{display: "flex", flexDirection: "column"}}>
                    <div className={"messageBox myMessageBox"}>
                        <div className={"message myMessage"}>
                            <div className={"username"} align={"right"}>
                                <strong>{message.userDTO.username}</strong>
                            </div>
                            <div className={"text"}>{message.text}</div>
                        </div>
                        <div className={"photo"}>
                            <img src={message.userDTO.imgurl}/>
                        </div>
                    </div>
                    <div style={{fontSize: "9px", paddingRight: "45px"}}>{message.dateTime}</div>
                    </div>);
        }
        else
            return (<div style={{display: "flex", flexDirection: "column"}}>
                <div className={"messageBox notMyMessageBox"}>
                    <div className={"photo"}>
                        <img src={message.userDTO.imgurl}/>
                    </div>
                    <div className={"message notMyMessage"}>
                        <div className={"username"} align={"right"}>
                            <strong>{message.userDTO.username}</strong>
                        </div>
                        <div className={"text"}>{message.text}</div>
                    </div>

                </div>
                <div style={{fontSize: "9px", paddingLeft: "45px"}}>{message.dateTime}</div>
            </div>);
    }

    if(loading)
        return null;

    return (
    <div style={{display: "flex"}}>
        <ChatListComponent/>
        <div className={"chat"}>
            <div className={"topBar"}>
                <h2 align={"center"} className={"mt-1"}>{chatWithMessages.title}</h2>
                <p align={"center"} className={"mb-2"}>members: {chatWithMessages.members}</p>
            </div>
            <div className={"center"} id={"center"} ref={chat}>
                {chatWithMessages.messages.map(message => (
                    <div>{myMessage(message)}</div>
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
                        <Button variant="secondary" type={"submit"}
                        onClick={(e) => sendMessage(e)} >
                            Send
                        </Button>
                    </InputGroup>
                </Form>
            </div>
        </div>
        {scroll}
    </div>
    );
}

export default MessageComponent;