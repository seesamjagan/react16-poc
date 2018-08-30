import React from 'react';
import * as core from './../../core';
import * as popupAMD from './../../popups';
import './configure.css';

const deps = [core.actionAMDPayload, core.modelAMDPayload, core.componentsAMDPayload, popupAMD.deleteVolumePopupAMDPayload];

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

    onDeleteVolumeClick = e => {
        this.setState({
            showDeleteVolumePopup: true,
        })
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

        const { showDeleteVolumePopup, showAlert, alertMessage, alertTitle, alertType } = this.state;

        const { P3DeleteVolumePopup } = this.amd.deleteVolumePopup;
        const { P3PopUp } = this.amd.components;

        return <div className="p3-module p3-configure">
            <header>
                <div>{this.lang('dummy.info')} - Colors</div>
            </header>
            <section>
                <button onClick={this.onDeleteVolumeClick}>Delete Volume</button>

                {showAlert && <P3PopUp width="250px" height="100px" type={alertType} title={alertTitle} actions={['ok']} onAction={this.onAlertAction}>
                    {alertMessage}
                </P3PopUp>}

            </section>
            {showDeleteVolumePopup && <P3DeleteVolumePopup onClose={this.onDeleteVolumePopupClose} />}
        </div>
    }
}