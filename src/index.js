import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './style.css';
import ChatListComponent from "./component/ChatListComponent";
import MessageComponent from "./component/MessageComponent";

const root = ReactDOM.createRoot(document.getElementById('root'));



root.render(
  <React.StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path={""} element={<ChatListComponent/>}/>
              <Route path={"/chat/:code"} element={<MessageComponent/>}/>
          </Routes>
      </BrowserRouter>
  </React.StrictMode>
);
