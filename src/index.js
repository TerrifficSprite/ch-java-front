import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './style.css';
import ChatListComponent from "./component/ChatListComponent";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <div className={"container"}>
          <BrowserRouter>
              <Routes>
                  <Route path={"/"} element={<ChatListComponent/>}/>
                  {/*<Route path={"chat"} element={<ChatListComponent/>}/>*/}
              </Routes>
          </BrowserRouter>
      </div>
  </React.StrictMode>
);
