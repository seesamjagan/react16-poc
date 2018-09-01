import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import * as core from './../core';
import P3MessageBox from './p3-message-box';

import './p3-popup.css';

// const TOASTER_ROOT = 'toaster-root';
const MODEL_ROOT = 'model-root';


export class P3Portal extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        portalRoot: PropTypes.string.isRequired
    };

    static defaultProps = {
        className: '',
        portalRoot: MODEL_ROOT,
    };

    constructor(props) {
        super(props);
        let childrenHolder = this.childrenHolder = document.createElement('div');
        childrenHolder.className = props.className;
    }

    componentDidMount() {
        const portalRoot = document.getElementById(this.props.portalRoot);
        // The portal element is inserted in the DOM tree after
        // the Modal's children are mounted, meaning that children
        // will be mounted on a detached DOM node. If a child
        // component requires to be attached to the DOM tree
        // immediately when mounted, for example to measure a
        // DOM node, or uses 'autoFocus' in a descendant, add
        // state to Modal and only render the children when Modal
        // is inserted in the DOM tree.
        portalRoot.appendChild(this.childrenHolder);
    }

    componentWillUnmount() {
        const portalRoot = document.getElementById(this.props.portalRoot);
        portalRoot.removeChild(this.childrenHolder);
    }

    render() {

        return ReactDOM.createPortal(
            <core.ErrorBoundary>{this.props.children}</core.ErrorBoundary>,
            this.childrenHolder,
        );
    }
}

export class P3PopUp extends React.Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        children: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.array]).isRequired,
        width: PropTypes.string,
        height: PropTypes.string,
        popupClassName: PropTypes.string,
        titleIconClassName: PropTypes.string,
    }
    static defaultProps = {
        height: '250px',
        showClose: true
    }

    constructor(props) {

        super(props);

        const { width, height, popupClassName } = props;

        this.state = {
            width, height, popupClassName
        };
    }

    render() {
        const { width, height, popupClassName } = this.state;
        const style = {};
        if (width) {
            style.width = width;
        }
        if (height) {
            style.height = height;
        }

        const POPUP_CLASS = ['p3-popup', (popupClassName || '')].join(' ');

        return (<P3Portal className="p3-model-holder">
            <div className="p3-model">

                <div className={POPUP_CLASS} style={style}>
                    <P3MessageBox {...this.props}>
                        {this.props.children}
                    </P3MessageBox>
                </div>

            </div>
        </P3Portal>);
    }
}
export default P3PopUp;