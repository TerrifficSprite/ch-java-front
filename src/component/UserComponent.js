import React, {useState, useEffect} from "react";
import {Dropdown, DropdownButton} from "react-bootstrap";
import UserService from "../service/UserService";
import {Routes, Route, Link} from "react-router-dom";
const UserComponent = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        return () => {
            UserService.getUsers().then(response => {
                setUsers(response.data);
            });
        };
    }, []);


    try {
        console.log(users);
    } catch (e){

    }
    return (
        <div className={"dropdown"}>
            <Link to={"/chat"}>1</Link>
            <DropdownButton id="dropdown-success-button" title="Users">
                {users.map(user => (
                    <Dropdown.Item href="#/action">{user.username}</Dropdown.Item>
                ))}
            </DropdownButton>

        </div>
    );
}

export default UserComponent;