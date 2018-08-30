import React, { Component } from 'react';
import * as core from './../../core';

const deps = [core.actionAMDPayload, core.modelAMDPayload, core.componentsAMDPayload];

export class P3DeleteVolumePopup extends core.P3ModuleBase {

    constructor(props, context) {
        super(props, context, [new core.BundleVo('p3-delete-volume-popup', 'en_US'), ...deps])
    }

    onAMDLoadComplete() {
        // TODO :: 
    }

    onAction = action => {
        if(action === 'Delete') {
            // todo :: MAKE THE Service call and proceed.
            this.onClose(true);
        } else {
            this.onClose(false);
        }
    }

    onClose = (isActionComplete=false) => {
        this.props.onClose && this.props.onClose(isActionComplete);
    }

    renderUI() {
        const { P3PopUp } = this.amd.components;
        return (
        <P3PopUp title="Delete Volume" height="150px" width="250px" type={this.amd.components.P3MessageBox.QUESTION} actions={['Delete', 'Cancel']} onAction={this.onAction}>
            <div>
                Are you sure to delete the volume?
            </div>
        </P3PopUp>
        );
    }
}

export default P3DeleteVolumePopup;