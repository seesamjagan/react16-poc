import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import * as core from '../../core';

const deps = [core.actionAMDPayload, core.modelAMDPayload, core.componentsAMDPayload];

const getPath = view => '/provisioning/'+view;

const ROUTES = {
    ACUITY: 'acuity',
    HCI: 'hci',
    N5: 'n5',
    CLOUD: 'cloud',
};
const routeConfig = [
    {path: getPath(ROUTES.ACUITY), component: ()=><div className="p3-show-me">Acuity View</div>},
    {path: getPath(ROUTES.HCI), component: ()=><div className="p3-show-me">HCI View</div>},
    {path: getPath(ROUTES.N5), component: ()=><div className="p3-show-me">N5 View</div>},
    {path: getPath(ROUTES.CLOUD), component: ()=><div className="p3-show-me">Cloud View</div>},
];

export default class ProvisioningModule extends core.P3ModuleBase {
    constructor(props, context) {
        super(props, context, deps.concat(new core.BundleVo('p3-provisioning', 'en_US')));
        this.state = Object.assign(this.state, {
            navItems: []
        });
    }

    onAMDLoadComplete() {
        const getNavItem = this.amd.components.getNavItem;
        this.setState({
            navItems: [
                getNavItem(getPath(ROUTES.ACUITY), this.lang('nav.acuity')),
                getNavItem(getPath(ROUTES.HCI), this.lang('nav.hci')),
                getNavItem(getPath(ROUTES.N5), this.lang('nav.n5')),
                getNavItem(getPath(ROUTES.CLOUD), this.lang('nav.cloud')),
            ]
        });
    }


    lang(key, params, bundle='p3-provisioning') {
        return super.lang(key, params, bundle);
    }

    isValidRoute(route) {
        return Object.keys(ROUTES).map(key=>ROUTES[key]).indexOf(route) >= 0;
    }

    renderUI() {

        const { match, location } = this.props;
        const { storageType } = match.params;

        if(!storageType || !this.isValidRoute(storageType)) {

            console.log('Redirecting Provisioning UI to Default route %s', ROUTES.ACUITY);

            let to = {
                pathname: getPath(ROUTES.ACUITY),
                state: {from: location }
            };
            return <Redirect to={to} />
        }

        console.log('Provisioning UI Rendered', this.props.match);
        
        const { navItems } = this.state;
        return <div className="p3-module p3-provisioning">
            <header>
                <this.amd.components.P3NavBar items={navItems} />
            </header>
            <section>
                <Switch>
                    {routeConfig.map(route=><Route {...route} key={route.path}/>)}
                </Switch>
            </section>
        </div>
    }
}