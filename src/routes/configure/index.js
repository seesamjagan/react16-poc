import React from 'react';
import * as core from './../../core';
import * as popupAMD from './../../popups';
import './configure.css';

// TODO :: we should add a feature to load the AMD ON-DEMAND when needed like loading popup definitions only when they needed instead of loading at the begining. 
// pro's of this approach is, main view/module loads fast, amd loaded only when needed. if, when one amd failed load, we won't break the main view/module being rendered.
const deps = [core.actionAMDPayload, core.modelAMDPayload, core.componentsAMDPayload];

export default class ConfiguredModule extends core.P3ModuleBase {
    constructor(props, context) {
        super(props, context, deps.concat(new core.BundleVo('p3-configure', 'en_US')));
        this.name = "Configure UI";
        this.state = Object.assign(this.state, {
            showDeleteVolumePopup: false,
            showAlert: false,
            alertType: '',
            alertMessage: '',
            alertTitle: '',
        });
    }

    lang(key, params, bundle = 'p3-configure') {
        return super.lang(key, params, bundle);
    }

    onAMDLoadComplete() {
        
    }

    onAMDInjected() {

    }

    onDeleteVolumeClick = e => {
        
        if(this.amd.deleteVolumePopup) {
            this.showDeleteVolumePopup();
        } else {
            this.injectAMD([popupAMD.deleteVolumePopupAMDPayload], this.showDeleteVolumePopup);
        }
    }

    showDeleteVolumePopup = () => {
        this.setState({
            showDeleteVolumePopup: true,
        });
    }

    onDeleteVolumePopupClose = isActionComplete => {

        const { P3MessageBox } = this.amd.components;

        let alertType = '',
        alertMessage = '',
        alertTitle = 'Delete Volume';

        if(isActionComplete) {
            alertType = P3MessageBox.SUCCESS; 
            alertMessage = 'Volume deleted successfuly!'
        } else {
            alertType = P3MessageBox.ERROR;
            alertMessage = 'Failed to delete the Volume!'
        }

        this.setState({showDeleteVolumePopup: false, alertMessage, alertTitle, alertType, showAlert: true});
    }

    onAlertAction = action => {
        this.setState({showAlert: false});
    }

    renderUI() {
        console.log('Configure UI Rendered');
        console.log(new this.amd.actions.FSA('configure action'));
        console.log(new this.amd.model.BaseVo());

        const { showDeleteVolumePopup, showAlert, alertMessage, alertTitle, alertType, isInjectingAMD, /*isAMDInjected,*/ isAMDInjectionError } = this.state;

        const { P3PopUp, P3MessageBox } = this.amd.components;

        return <div className="p3-module p3-configure">
            <header>
                <div>{this.lang('dummy.info')} - Colors</div>
            </header>
            <section>
                <button onClick={this.onDeleteVolumeClick}>Delete Volume</button>

                {showAlert && <P3PopUp width="250px" height="100px" type={alertType} title={alertTitle} actions={['ok']} onAction={this.onAlertAction}>
                    {alertMessage}
                </P3PopUp>}

                {(isInjectingAMD || isAMDInjectionError) && <P3PopUp width="250px" height="100px" 
                    type={isInjectingAMD ? P3MessageBox.INFO : P3MessageBox.ERROR} 
                    title={'Injecting AMD..'} actions={isInjectingAMD ? [] : ['ok']} onAction={this.onAlertAction}>
                    {isInjectingAMD ? 'Please Wait...' : 'Error Injecting AMD!'}
                </P3PopUp>}

            </section>
            {showDeleteVolumePopup && <this.amd.deleteVolumePopup.P3DeleteVolumePopup onClose={this.onDeleteVolumePopupClose} />}
        </div>
    }
}