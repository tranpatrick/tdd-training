import React from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Route, Switch} from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from "../pages/LoginPage";
import UserSignupPage from '../pages/UserSignupPage';
import UserPage from "../pages/UserPage";
import TopBar from "../component/TopBar";

function App() {
    return (
        <div className="container">
            <TopBar/>
            <Switch>
                <Route exact path="/" component={HomePage}/>
                <Route path="/login" component={LoginPage}/>
                <Route path="/signup" component={UserSignupPage}/>
                <Route path="/:username" component={UserPage}/>
            </Switch>
        </div>
    );
}

export default App;
