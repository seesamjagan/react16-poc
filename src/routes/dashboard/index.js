import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import * as core from '../../core';

const deps = [core.actionAMDPayload, core.modelAMDPayload, core.componentsAMDPayload];

export default class DashboardModule extends core.P3ModuleBase {
    constructor(props, context) {
        super(props, context, deps.concat(new core.BundleVo('p3-dashboard', 'en_US')));
        this.state = Object.assign(this.state, {
            showModel: false,
            lanchNoWidthPopUp: false,
            lanchFixedHeightWidthPopUp: false,
        });
    }

    lang(key, params, bundle = 'p3-dashboard') {
        return super.lang(key, params, bundle);
    }

    onLanchPopUp = event => {
        this.setState({ showModel: true });
    }

    onLanchNoWidthPopUp = event => {
        this.setState({ lanchNoWidthPopUp: true });
    }
    onLanchFixedHeightWidthPopUp = event => {
        this.setState({ lanchFixedHeightWidthPopUp: true });
    }
    

    renderUI() {
        console.log('Dashboard UI Rendered');
        console.log(new this.amd.actions.FSA('dashboard action'));
        console.log(new this.amd.model.BaseVo());

        const P3MessageBox = this.amd.components.P3MessageBox;

        return <div className="p3-module p3-dashboard">
            <header>
                <h2>{this.lang('dummy.info')}</h2>
            </header>
            <section>

                <P3MessageBox title="Success Message Panel Title" message="Success Message Panel Message para" more="Success Message Panel Stack Para" type={P3MessageBox.SUCCESS} />

                <P3MessageBox title="Error Message Panel Title" message="Error Message Panel Message para" more="Error Message Panel Stack Para" type={P3MessageBox.ERROR}>
                    <p style={{ textAlign: "center" }}>
                        <button onClick={this.onLanchPopUp}>wanna retry. Lanch Fixed Width Popup?</button>
                        <button onClick={this.onLanchNoWidthPopUp}>wanna retry. Lanch No Width Popup?</button>
                        <button onClick={this.onLanchFixedHeightWidthPopUp}>wanna retry. Lanch fixed Height Width Popup?</button>
                    </p>
                </P3MessageBox>

                <P3MessageBox title="Warning Message Panel Title" message="Warning Message Panel Message para" more="Warning Message Panel Stack Para" type={P3MessageBox.WARN} />

                <P3MessageBox title="Info Message Panel Title" message="Info Message Panel Message para" more="Info Message Panel Stack Para" type={P3MessageBox.INFO} />

                <P3MessageBox title="Question Message Panel Title" message="Something happened. do you want to react?" type={P3MessageBox.QUESTION}>
                    <p style={{ textAlign: "center" }}>
                        <button>Yes</button>
                        <button>No</button>
                    </p>
                </P3MessageBox>

                <p>kshdkjh kjashdkjash   kdsfmdnbffkds sklfsldkfsd skdjhsjdhgfksdgjsdgsdmnv,s ksjhseljfsljd skglsdkjgl slsjdlkjsdl sdkj slsjgsld sdjglksj sdjkg jsdlg sljglsdj sdjgl sdjgs dljksgls d;gsdjg ;sjd;gsjd;g j;sg;sjd; gs;jg;sdjg;sdjg;s ;sdj;g s;djg;lsdg;sdj;gj;sdj g;sgj;sjg;s ;gjs;gj ;sdj;g;sdjg;sjg;sjd;gjs;dgj; ;sljdg; j;sd jh;sj /sdm.b,bkaskfgfskfgfaljsgfhkgflash fl alfla hfash ;fhalskfh ;ashflk ahfhalh</p>

            </section>

            {
                this.state.showModel &&
                <P3PopUp width="400px" title="I show the info message box"
                    footerChildren={<button onClick={() => { this.setState({ showModel: false }) }}>Close Me</button>}>
                    <P3MessageBox title="Portal Message" message='I live in a portal world!. i take only 400px width since it is assigned to me'>
                        {Array.apply(null, { length: 50 }).map((item, index) => <p key={index}>Paragraph #{index + 1}</p>)}

                    </P3MessageBox>
                </P3PopUp>
            }

            {
                this.state.lanchNoWidthPopUp &&
                <P3PopUp>
                    <P3MessageBox title="No Width Popup" message='I live in a portal world! i take the whole width since no width is specified'>
                        <button onClick={() => { this.setState({ lanchNoWidthPopUp: false }) }}>Close Me</button>
                    </P3MessageBox>
                </P3PopUp>
            }

            {
                this.state.lanchFixedHeightWidthPopUp &&
                <P3PopUp width="450px" height="350px" title="Fixed Width & Hight Popup">
                    <P3MessageBox title="Fixed Width & Hight Popup" message='I live in a portal world! i render with Fixed Width & Hight'>
                        <button onClick={() => { this.setState({ lanchFixedHeightWidthPopUp: false }) }}>Close Me</button>
                        <button onClick={this.onLanchPopUp}>wanna retry. Lanch Fixed Width Popup?</button>
                    </P3MessageBox>
                </P3PopUp>
            }
        </div>
    }
}

const TOASTER_ROOT = 'toaster-root';
const MODEL_ROOT = 'model-root';

class P3Portal extends React.Component {

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
            this.props.children,
            this.childrenHolder,
        );
    }
}

class P3PopUp extends React.Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        children: PropTypes.element.isRequired,
        width: PropTypes.string,
        height: PropTypes.string,
        popupClassName: PropTypes.string,
        titleIconClassName: PropTypes.string,
    }

    constructor(props) {

        super(props);

        const { title, width, height, popupClassName, titleIconClassName } = props;

        this.state = {
            title, width, height, popupClassName, titleIconClassName
        };
    }

    render() {
        const { title, width, height, popupClassName, titleIconClassName } = this.state;
        const style = {};
        if (width) {
            style.width = width;
        }
        if (height) {
            style.height = height;
        }

        const POPUP_CLASS = ['p3-popup', (popupClassName || '')].join(' ');
        const SECTION_CLASS = 'p3-popup-body-section' + (this.props.footerChildren ? ' with-footer' : '');

        return (<P3Portal className="p3-model-holder">
            <div className="p3-model">


                <div className={POPUP_CLASS} style={style}>
                    <header className="p3-popup-title-bar">
                        {titleIconClassName && <span className={"p3-popup-title-icon " + titleIconClassName}></span>}
                        <span className="p3-popup-title-label">{title}</span>
                        <span className="p3-popup-restore-button">-</span>
                        <span className="p3-popup-close-button">x</span>
                    </header>
                    <section className={SECTION_CLASS}>
                        {this.props.children}
                    </section>
                    {this.props.footerChildren &&
                        <footer className="p3-popup-footer-bar">
                            {this.props.footerChildren}
                        </footer>
                    }
                </div>


            </div>
        </P3Portal>);
    }
}