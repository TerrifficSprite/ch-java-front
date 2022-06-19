import {Button, Form, FormControl, Modal} from "react-bootstrap";
import React, {useState} from "react";
import ChatService from "../../service/ChatService";


const RenameChatModal = ({chat, getFromModal, changeTitle}, showOnce) => {

    const [show, setShow] = useState(showOnce);
    const [title, setTitle] = useState(chat.title);
    const [disable, setDisable] = useState(true);

    function hideModal() {
        getFromModal(false);
        setShow(false);
    }

    function onChangeTitle(e) {
        let m;
        try {
            setTitle(e.target.value);
            m = e.target.value;
        } catch (TypeError) {
            m = e;
            setTitle(e);
        }
        document.getElementById("error").style.display = "none";
        if(m.trim().length > 0 && m !== chat.title)
            setDisable(false);
        else {
            setDisable(true);
        }
        if(m.trim().length > 45){
            setDisable(true);
            document.getElementById("error").innerText = "Chat title length can`t be more than 45 symbols";
            document.getElementById("error").style.display = "block";
        }
    }

    function save(){
        let temp = chat.title;
        chat.title = title.trim();
        ChatService.updateChat(chat).then(r => {
            changeTitle(chat.code, title);
            hideModal();
        }).catch(err => {
            changeTitle = temp;
            let r = err.response;
            document.getElementById("error").innerText = r.data.title;
            document.getElementById("error").style.display = "block";
        });

    }

    return (
        <Modal show={show} onHide={hideModal} className={"modal"}>
            <span style={{width: "100%", height: "100%", backgroundColor: "#282C34", color: "#fff"}}>
                <Modal.Header>
                    <Modal.Title style={{fontSize: "30px", wordBreak: "break-word"}}>Rename chat <strong>{chat.title}</strong></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormControl
                        required
                        onChange={onChangeTitle}
                        className={"inputText"}
                        placeholder="Write chat name here ..."
                        value={title} />
                    <p className={"mt-3"} style={{display: "none", color: "#ff4949"}} id={"error"}></p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={hideModal}>
                        Close
                    </Button>
                    <Button variant= {disable ? "outline-success" : "success"} onClick={save} disabled={disable}>
                        Save
                    </Button>
                </Modal.Footer>
            </span>
        </Modal>
    );
}

export default RenameChatModal;