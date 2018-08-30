import React from 'react';
import PropTypes from 'prop-types';

import './p3-message-box.css';

const P3ActionButton = ({ action, onAction }) => {
    const label = action.label || action;
    const className = action.className || '';
    const enabled = action.hasOwnProperty('enabled') ? action.enabled : true;
    return <li>
        <button disabled={!enabled}
            className={'p3-action-button ' + className}
            data-auto-id={'p3-action-box-' + label}
            onClick={() => onAction && onAction(action)}>
            {label}
        </button>
    </li>
}

export const P3MessageBox = ({ title, message, more, type = "info", children, actions, onAction, showHelp, onHelp, helpTitle, showClose, onClose }) => {

    const showAction = actions.length > 0;
    return (
        <div data-auto-id={title} className={"p3-message-panel " + type}>
            <header>
                <h2 className="title">{title}</h2>
                {showClose && <span className='close-icon' onClick={onClose}></span>}
            </header>
            {message && <div className="message"><p>{message}</p></div>}
            {children && <div className={"children" + (showAction ? '' : ' no-action')}>{children}</div>}
            {more && <div className="more"><p>{more}</p></div>}
            {showAction &&
                <footer className='p3-action-holder'>
                    {showHelp && <a className="p3-help" title={helpTitle} onClick={onHelp}> </a>}
                    <ul className={showHelp ? '' : ' no-help'}>{actions.map((action, index) => <P3ActionButton action={action} onAction={onAction} key={index} />)}</ul>
                </footer>
            }
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
    message: PropTypes.string,
    more: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    type: PropTypes.oneOf(Object.keys(P3MessageBox).map(key => P3MessageBox[key])).isRequired,
    actions: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.shape({
        label: PropTypes.string.isRequired,
        className: PropTypes.string,
        enabled: PropTypes.bool
    })])),
    onAction: PropTypes.func,
    showHelp: PropTypes.bool,
    onHelp: PropTypes.func,
    helpTitle: PropTypes.string,
    showClose: PropTypes.bool,
    onClose: PropTypes.func,
}

P3MessageBox.defaultProps = {
    type: P3MessageBox.INFO,
    more: null,
    actions: [],
    onAction: null,
    showHelp: false,
    onHelp: null,
    helpTitle: null,
    showClose: false,
    onClose: null,
}

export default P3MessageBox;