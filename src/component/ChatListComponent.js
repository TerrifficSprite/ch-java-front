import React, {useEffect, useState} from "react";
import {Card, Dropdown, DropdownButton, Image} from "react-bootstrap";
import {Link, useNavigate, useParams} from "react-router-dom";
import UserService from "../service/UserService";
import addUser from "../img/addUser.png";
import CreateChatModal from "./CreateChatModal";
import MessageComponent from "./MessageComponent";

const ChatListComponent = () => {

    const { urlcode } = useParams();
    let navigate = useNavigate();

    const [chats, setChats] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [title, setTitle] = useState("Users");
    const [show, setShow] = useState(false);
    const [code, setCode] = useState("");

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
        setShow(true);
    }

    const getFromModal = (show) => {
        setShow(show);
    }

    return (
        <>
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
                {show && (
                    <CreateChatModal users={users} show={show} getFromModal={getFromModal}
                    getChats={getChats}/>
                )}
            </div>

            <div className="chatList">
                {chats.map(chat => (
                    <div className={"one"} key={chat.id}>
                        <Link to={`/chat/${chat.code}`}>
                            <Card bg={"dark"} key={chat.id}>
                                <span className={"oneCard" + active(chat)}>
                                <Card.Img variant={"top"} src={currentUser.imgurl} className={"cardImg"}/>
                                <Card.Body>
                                    <Card.Title>{chat.title}</Card.Title>
                                    <Card.Text>{chat.code}</Card.Text>
                                </Card.Body>
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
        </>
    );
}

export default ChatListComponent;