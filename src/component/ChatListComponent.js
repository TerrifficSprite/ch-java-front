import React, {useEffect, useState} from "react";
import {Card, CardImg, Dropdown, DropdownButton, Image} from "react-bootstrap";
import {Link, useNavigate, useParams} from "react-router-dom";
import UserService from "../service/UserService";
import addUser from "../img/addUser.png";
import info from "../img/info.png";
import CreateChatModal from "./modal/CreateChatModal";
import MessageComponent from "./MessageComponent";
import ChatInfoModal from "./modal/ChatInfoModal";
import ChatService from "../service/ChatService";

const ChatListComponent = () => {

    const { urlcode } = useParams();
    let navigate = useNavigate();

    const [chats, setChats] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [title, setTitle] = useState("Users");
    const [showCreateChat, setShowCreateChat] = useState(false);
    const [showChatInfo, setShowChatInfo] = useState(false);
    const [code, setCode] = useState("");
    const [usersInChat, setUsersInChat] = useState([]);
    const [chatForDisplay, setChatForDisplay] = useState({});

    if(code !== urlcode)
        setCode(urlcode);

    useEffect(() => {
        return () => {
            UserService.getUsers().then(response => {
                try {
                    // setAllUsers(response.data);
                } catch (e) {

                }
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
        if (id === null)
            setChats([]);
        else {
            UserService.getChatsByUser(id).then(response => {
                setChats(response.data);
            });
        }
    }

    function change(e) {
        localStorage.setItem("id", e.id);
        localStorage.setItem("username", e.username);
        localStorage.setItem("imgurl", e.imgurl);
        setCurrentUser(e);
        setTitle(e.username);
        getChats();
        navigate("/");
    }

    function active(e) {
        if(urlcode !== undefined){
            if (e.code === code) {
                return " active";
            }
        }
        return "";
    }

    function showModal(){
        setShowCreateChat(true);
    }

    const getFromModal = (show) => {
        setShowChatInfo(show);
        setShowCreateChat(show);
    }

    function mouseEnter(e, chat) {
        let img = document.getElementById(chat.id);
        img.style.visibility = "visible";
        img.style.display = "block";
        img.style.opacity = "1";
    }

    function mouseLeft(e, chat) {
        let img = document.getElementById(chat.id);
        img.style.visibility = "hidden";
        img.style.display = "none";
        img.style.opacity = "0";
    }

    function chatInfo(e, chat) {
        e.preventDefault();
        setChatForDisplay(chat);
        ChatService.getUsersByChat(chat.code).then(r => {
            setUsersInChat(r.data);
            setShowChatInfo(true);
        });
    }

    return (
        <>
        <div className="chats">
            <div className="dropdown">
                <DropdownButton variant={"primary"} title={title}>
                    {users.map(user => (
                        <Dropdown.Item eventKey={user} key={user.id}
                                       onClick={() => change(user)}>{user.username}</Dropdown.Item>
                    ))}
                </DropdownButton>
                <div style={{width: "15%"}}>
                    <Image src={addUser} onClick={showModal} className={"imgAddUser"}/>
                </div>
                {showCreateChat && (
                    <CreateChatModal users={users} show={showCreateChat} getFromModal={getFromModal}
                    getChats={getChats}/>
                )}
            </div>

            <div className="chatList">
                {chats.map(chat => (
                    <div className={"one"} key={chat.id}>
                        <Link to={`/chat/${chat.code}`}>
                            <Card bg={"dark"} key={chat.id} onMouseEnter={(e) => mouseEnter(e, chat)}
                            onMouseLeave={(e) => mouseLeft(e, chat)}>
                                <span className={"oneCard" + active(chat)}>
                                <Card.Img variant={"top"} src={currentUser.imgurl} className={"cardImg"}/>
                                <Card.Body>
                                    <Card.Title>{chat.title}</Card.Title>
                                    <Card.Text>{chat.code}</Card.Text>
                                </Card.Body>
                                <Card.Img variant={"top"} src={info} className={"infoImg"} id={chat.id}
                                          onClick={(e) => chatInfo(e, chat)}/>
                                </span>
                            </Card>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
        {code !== undefined && (
            <MessageComponent firstCode={code} allUsers={users}/>
        )}
        {showChatInfo && (<ChatInfoModal chat={chatForDisplay} getFromModal={getFromModal}
                                         showOnce={showChatInfo} users={usersInChat}/>)}
        </>
    );
}

export default ChatListComponent;