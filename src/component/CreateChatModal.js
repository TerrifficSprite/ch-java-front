import {Modal, Button} from "react-bootstrap";
import {useState} from "react";

const CreateChatModal = (users) => {

    const [show, setShow] = useState(true);

    const showModal = () => setShow(true);
    const hideModal = () => setShow(false);

    return (
        <Modal show={show} onHide={hideModal} animation={false}>
            <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={hideModal}>
                    Close
                </Button>
                <Button variant="primary" onClick={hideModal}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateChatModal;