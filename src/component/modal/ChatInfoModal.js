import {Button, Modal} from "react-bootstrap";
import React, {useState} from "react";


const AddUserModal = ({chat, getFromModal, users}, showOnce) => {

    const [show, setShow] = useState(showOnce);

    function hideModal() {
        getFromModal(false);
        setShow(false);
    }

    return (
        <Modal show={show} onHide={hideModal} className={"modal"}>
            <span style={{width: "100%", height: "100%", backgroundColor: "#282C34", color: "#fff"}}>
                <Modal.Header>
                    <Modal.Title><strong style={{fontSize: "30px"}}>{chat.title}</strong></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Members: {chat.members}
                    <ul>
                        {users.map(user => (
                            <li key={user.id}>{user.username}</li>
                        ))}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={hideModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </span>
        </Modal>
    );
    return (<></>)
}

export default AddUserModal;