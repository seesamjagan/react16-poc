import React from 'react';
import PropTypes from 'prop-types';

import './p3-message-box.css';

export const P3MessageBox = ({ title, message, more=null, type = "info", children }, context) => {

    return (
        <div data-auto-id={title} className={"p3-message-panel " + type}>
            <h2 className="title">{title}</h2>
            <div className="message">
                <p>{message}</p>
            </div>
            {children && <div className="children">{children}</div> }
            {more && <div className="more"><p>{more}</p></div> }
        </div>
    );
}

P3MessageBox.INFO = 'info';
P3MessageBox.WARN = 'warn';
P3MessageBox.ERROR = 'error';
P3MessageBox.SUCCESS = 'success';
P3MessageBox.QUESTION = 'question';

P3MessageBox.propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(Object.keys(P3MessageBox).map(key=>P3MessageBox[key])).isRequired
}

P3MessageBox.defaultProps = {
    type: P3MessageBox.INFO
}

export default P3MessageBox;