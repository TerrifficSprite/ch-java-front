import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './style.css';
import ChatListComponent from "./component/ChatListComponent";

const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
    <React.StrictMode>
        <div style={{display: "flex", width: "100%"}}>
            {/*<ChatListComponent/>*/}
                <BrowserRouter>
                    <Routes>
                        <Route path={"/*"} element={<ChatListComponent/>}/>
                        <Route path={"/chat/:urlcode"} element={<ChatListComponent/>}/>
                    </Routes>
                </BrowserRouter>
        </div>

    </React.StrictMode>
);
