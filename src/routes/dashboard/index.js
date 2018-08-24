import React from 'react';
import * as core from '../../core';

const deps = [core.actionAMDPayload, core.modelAMDPayload, core.componentsAMDPayload];

export default class DashboardModule extends core.P3ModuleBase {
    constructor(props, context) {
        super(props, context, deps.concat(new core.BundleVo('p3-dashboard', 'en_US')));
        this.state = Object.assign(this.state, {
            
        });
    }

    lang(key, params, bundle='p3-dashboard') {
        return super.lang(key, params, bundle);
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

                <P3MessageBox title="Error Message Panel Title" message="Error Message Panel Message para" more="Error Message Panel Stack Para" type={P3MessageBox.ERROR} />

                <P3MessageBox title="Warning Message Panel Title" message="Warning Message Panel Message para" more="Warning Message Panel Stack Para" type={P3MessageBox.WARN} />

                <P3MessageBox title="Info Message Panel Title" message="Info Message Panel Message para" more="Info Message Panel Stack Para" type={P3MessageBox.INFO} />

                <P3MessageBox title="Info Message Panel Title" message="Info Message Panel Message para" type={P3MessageBox.INFO} />
                
                <p>kshdkjh kjashdkjash   kdsfmdnbffkds sklfsldkfsd skdjhsjdhgfksdgjsdgsdmnv,s ksjhseljfsljd skglsdkjgl slsjdlkjsdl sdkj slsjgsld sdjglksj sdjkg jsdlg sljglsdj sdjgl sdjgs dljksgls d;gsdjg ;sjd;gsjd;g j;sg;sjd; gs;jg;sdjg;sdjg;s ;sdj;g s;djg;lsdg;sdj;gj;sdj g;sgj;sjg;s ;gjs;gj ;sdj;g;sdjg;sjg;sjd;gjs;dgj; ;sljdg; j;sd jh;sj /sdm.b,bkaskfgfskfgfaljsgfhkgflash fl alfla hfash ;fhalskfh ;ashflk ahfhalh</p>
                
            </section>
        </div>
    }
}