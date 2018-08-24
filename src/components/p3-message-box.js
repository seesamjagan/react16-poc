import React from 'react';

import './p3-message-box.css';

export const P3MessageBox = ({ title, message, more=null, type = "info" }, context) => {

    return (
        <div data-auto-id={title} className={"p3-message-panel " + type}>
            <h2 className="title">{title}</h2>
            <hr />
            <div className="message">
                <p>{message}</p>
            </div>
            {more && <p className="more">{more}</p> }
        </div>
    );
}

P3MessageBox.INFO = 'info';
P3MessageBox.WARN = 'warn';
P3MessageBox.ERROR = 'error';
P3MessageBox.SUCCESS = 'success';

export default P3MessageBox;