import React from 'react';
import * as core from '../../core';
import './configure.css';

const deps = [core.actionAMDPayload, core.modelAMDPayload];

export default class ConfiguredModule extends core.P3ModuleBase {
    constructor(props, context) {
        super(props, context, deps.concat(new core.BundleVo('p3-configure', 'en_US')));
        this.name = "Configure UI";
        this.state = Object.assign(this.state, {
            codes: []
        });
    }

    createColorCodes = () => {
        let MAX = 256;
        let hex = Array.apply(null, { length: MAX }).map((val, index) => {
            let h = index.toString(16);
            if (h.length === 1) {
                h = '0' + h;
            }
            return h;
        });

        console.log(hex);
        setTimeout(() => {
            let c = [];
            let i = 32;
            for (let r = 0; r < MAX; r += i) {
                for (let g = 0; g < MAX; g += i) {
                    for (let b = 0; b < MAX; b += i) {
                        c.push('#' + hex[r] + hex[g] + hex[b]);
                    }
                }
            }
            console.log(c);
            this.setState({
                codes: c
            });
        }, 0);
    }

    lang(key, params, bundle = 'p3-configure') {
        return super.lang(key, params, bundle);
    }

    onAMDLoadComplete() {
        this.createColorCodes();
    }

    renderUI() {
        console.log('Configure UI Rendered');
        console.log(new this.amd.actions.FSA('configure action'));
        console.log(new this.amd.model.BaseVo());
        return <div className="p3-module p3-configure">
            <header>
                <div>{this.lang('dummy.info')} - Colors</div>
            </header>
            <section>
                {this.state.codes.map(backgroundColor => <div className='pallet' style={{ backgroundColor }}></div>)}
            </section>
        </div>
    }
}