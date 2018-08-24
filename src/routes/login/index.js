import React from 'react';
import * as core from '../../core';
import { NavLink } from 'react-router-dom';
import './login.css';

const deps = [core.actionAMDPayload, core.modelAMDPayload];

export default class LoginModule extends core.P3ModuleBase {
    constructor(props, context) {
        super(props, context, deps);
        this.state = Object.assign(this.state, {

        });
    }

    renderUI() {
        console.log('Login UI Rendered');
        return <div className="p3-module p3-login">
            <h2>Login Module View</h2>
            <NavLink to="/brokenpage">to broken page</NavLink>
        </div>
    }
}