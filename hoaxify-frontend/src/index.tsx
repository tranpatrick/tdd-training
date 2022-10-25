import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import UserSignupPage from "./pages/UserSignupPage";
import * as apiCalls from './api/apiCalls'

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const actions = {
    postSignup: apiCalls.signup
}

root.render(
    <React.StrictMode>
        <UserSignupPage actions={actions}/>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
