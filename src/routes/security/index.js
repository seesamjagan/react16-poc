import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import * as core from '../../core';

const deps = [core.actionAMDPayload, core.modelAMDPayload, core.componentsAMDPayload];

const getPath = view => '/data-services/security-qos/'+view;

const ROUTES = {
    ENCRYPTION_SERVER: 'encryption-server',
    ENCRYPTION_MANAGEMENT: 'encryption-management'
};

const BUNDLE_NAME = 'p3-security-qos';

const routeConfig = [
    {path: getPath(ROUTES.ENCRYPTION_SERVER), component: ()=><div>Encryption Server View</div>},
    {path: getPath(ROUTES.ENCRYPTION_MANAGEMENT), component: ()=>{
        return <div>Encryption Management View</div>}
    },
];

export default class SecurityQoSModule extends core.P3ModuleBase {
    constructor(props, context) {
        super(props, context, [new core.BundleVo(BUNDLE_NAME, 'en_US'), ...deps]);
        this.state = Object.assign(this.state, {
            navItems: []
        });
    }

    onAMDLoadComplete() {
        const getNavItem = this.amd.components.getNavItem;
        this.setState({
            navItems: [
                getNavItem(getPath(ROUTES.ENCRYPTION_SERVER), this.lang('nav.encryptionServer')),
                getNavItem(getPath(ROUTES.ENCRYPTION_MANAGEMENT), this.lang('nav.encryptionManagement')),
            ]
        });
    }

    lang(key, param) {
        return super.lang(key, param, BUNDLE_NAME);
    }

    isValidRoute(route) {
        return Object.keys(ROUTES).map(key=>ROUTES[key]).indexOf(route) >= 0;
    }

    renderUI() {

        const { match, location } = this.props;
        const { service } = match.params;

        if(!service || !this.isValidRoute(service)) {

            console.log('Redirecting Security QoS UI to Default route %s', ROUTES.ENCRYPTION_SERVER);

            let to = {
                pathname: getPath(ROUTES.ENCRYPTION_SERVER),
                state: {from: location }
            };
            return <Redirect to={to} />
        }

        console.log('Security QoS UI Rendered', this.props.match);
        
        const { navItems } = this.state;
        return <div className="p3-module p3-security-qos">
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