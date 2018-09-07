import React from 'react';

import * as core from '../../core';
import { AddTodoForm } from './add-todo-form';

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

    onAction = action => console.log('You clicked %O', action);

    renderUI() {
        console.log('Dashboard UI Rendered');
        console.log(new this.amd.actions.FSA('dashboard action'));
        console.log(new this.amd.model.BaseVo());

        const P3MessageBox = this.amd.components.P3MessageBox;
        const P3PopUp = this.amd.components.P3PopUp;

        return <div className="p3-module p3-dashboard">
            <header>
                <h2>{this.lang('dummy.info')}</h2>
            </header>
            <section>

                <AddTodoForm />

                <P3MessageBox title="Take Action!" message="array of object actions" actions={[{ label: 'Ok', className: 'ok' }, { label: 'cancel', className: 'cancel' }, { label: 'don\'t do', className: 'cancel', enabled: false }]} onAction={this.onAction} />
                <P3MessageBox title="Take Action!" actions={['Yes', 'No']} onAction={this.onAction} showHelp showClose>
                    <p>Love to do something? Try Help ? array of string action</p>
                </P3MessageBox>

                <P3MessageBox title="Success Message Panel Title" message="Success Message Panel Message para" more="Success Message Panel Stack Para" type={P3MessageBox.SUCCESS} />

                <P3MessageBox title="Error Message Panel Title" message="Error Message Panel Message para" more="Error Message Panel Stack Para" type={P3MessageBox.ERROR} showHelp actions={['report']}>
                    <p style={{ textAlign: "center" }}>
                        <button onClick={this.onLanchPopUp}>wanna retry. Lanch Fixed Width Popup?</button>
                        <button onClick={this.onLanchNoWidthPopUp}>wanna retry. Lanch No Width Popup?</button>
                        <button onClick={this.onLanchFixedHeightWidthPopUp}>wanna retry. Lanch fixed Height Width Popup?</button>
                    </p>
                </P3MessageBox>

                <P3MessageBox title="Warning Message Panel Title" message="Warning Message Panel Message para" more="Warning Message Panel Stack Para" type={P3MessageBox.WARN} />

                <P3MessageBox title="Info Message Panel Title" message="Info Message Panel Message para" more="Info Message Panel Stack Para" type={P3MessageBox.INFO} />

                <P3MessageBox title="Question Message Panel Title" message="Something happened. do you want to react?" type={P3MessageBox.QUESTION} showHelp actions={['report']}>
                    <p style={{ textAlign: "center" }}>
                        <button>Yes</button>
                        <button>No</button>
                    </p>
                </P3MessageBox>
            </section>

            {
                this.state.showModel &&
                <P3PopUp width="400px" onClose={() => { this.setState({ showModel: false }) }}
                    title="I show the info message box" showClose
                    actions={['close me']} onAction={() => { this.setState({ showModel: false }) }}>
                    <p>I live in a portal world!. i take only 400px width since it is assigned to me</p>
                    {Array.apply(null, { length: 10 }).map((item, index) => <p key={index}>Paragraph #{index + 1}</p>)}
                </P3PopUp>
            }

            {
                this.state.lanchNoWidthPopUp &&
                <P3PopUp title="No Width Popup" message='I live in a portal world! i take the whole width since no width is specified' onClose={() => { this.setState({ lanchNoWidthPopUp: false }) }}>
                    <button onClick={() => { this.setState({ lanchNoWidthPopUp: false }) }}>Close Me</button>
                </P3PopUp>
            }

            {
                this.state.lanchFixedHeightWidthPopUp &&
                <P3PopUp width="450px" height="350px" title="Fixed Width & Hight Popup" onClose={() => { this.setState({ lanchFixedHeightWidthPopUp: false }) }}>
                    <button onClick={() => { this.setState({ lanchFixedHeightWidthPopUp: false }) }}>Close Me</button>
                    <button onClick={this.onLanchPopUp}>wanna retry. Lanch Fixed Width Popup?</button>
                    {Array.apply(null, { length: 10 }).map((item, index) => <p key={index}>Paragraph #{index + 1}</p>)}
                </P3PopUp>
            }
        </div>
    }
}