import React, {useState, useEffect} from "react";
import {Dropdown, DropdownButton} from "react-bootstrap";
import UserService from "../service/UserService";
const UserComponent = () => {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        return () => {
            UserService.getUsers().then(response => {
                setUsers(response.data);
            });
        };
    }, []);


    console.log(users);
    return (
        <div>
            <DropdownButton id="dropdown-basic-button" title="users">
                {users.map(user => (
                        <Dropdown.Item href="#/action">{user.username}</Dropdown.Item>
                    ))}
            </DropdownButton>
        </div>
    );
}

export default UserComponent;