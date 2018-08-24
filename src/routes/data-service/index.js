import React from 'react';
import Loadable from 'react-loadable';
import { Redirect, Route, Switch } from 'react-router-dom';
import * as core from '../../core';
import { ModuleLoadingUI } from '../../core';

const deps = [core.actionAMDPayload, core.modelAMDPayload, core.componentsAMDPayload];

const BUNDLE_NAME = 'p3-data-services';

const getPath = view => '/data-services/' + view;

const ROUTES = {
    PERFORMANCE_QOS: 'performance-qos',
    PROTECTION_QOS: 'protection-qos',
    PROTECTED_HOST: 'protected-host',
    REPLICATION_TARGET: 'replication-target',
    HOST_ACCESS_GROUP: 'host-access-group',
    SECURITY_KEY_SERVER: 'security-qos',
    SCHEDULER_EVENTS: 'scheduler-events',
}

export const AsyncSecurityQoSModule = Loadable({ loader: () => import('./../security'), loading: (props) => <ModuleLoadingUI name="Security QoS Module!" {...props} /> });

const routeConfig = [
    { path: getPath(ROUTES.PERFORMANCE_QOS), component: () => <div>Performance QoS</div> },
    { path: getPath(ROUTES.PROTECTION_QOS), component: () => <div>Protection QoS</div> },
    { path: getPath(ROUTES.PROTECTED_HOST), component: () => <div>Protected Host</div> },
    { path: getPath(ROUTES.REPLICATION_TARGET), component: () => <div>Replication Target</div> },
    { path: getPath(ROUTES.HOST_ACCESS_GROUP), component: () => <div>Host Access Group</div> },
    { path: getPath(ROUTES.SECURITY_KEY_SERVER+"/:service"), component: AsyncSecurityQoSModule },
    { path: getPath(ROUTES.SECURITY_KEY_SERVER), component: AsyncSecurityQoSModule },
    { path: getPath(ROUTES.SCHEDULER_EVENTS), component: () => <div>Scheduler Events</div> }
];

const getDefaultRouteTo = location => ({
    pathname: getPath(ROUTES.PERFORMANCE_QOS),
    state: { from: location }
});

export default class DataServiceModule extends core.P3ModuleBase {
    constructor(props, context) {
        super(props, context, deps.concat(new core.BundleVo(BUNDLE_NAME, 'en_US')));
        this.name = this.$lang('amd.dataServices');
        this.state = Object.assign(this.state, {
            navItems: []
        });
    }

    onAMDLoadComplete() {
        this.setState({
            navItems: this.getNavItems()
        });
    }

    getNavItems() {
        const getNavItem = this.amd.components.getNavItem;
        return [
            getNavItem(getPath(ROUTES.PERFORMANCE_QOS), this.lang('nav.performance')),
            getNavItem(getPath(ROUTES.PROTECTION_QOS), this.lang('nav.protection')),
            getNavItem(getPath(ROUTES.PROTECTED_HOST), this.lang('nav.protectedHost')),
            getNavItem(getPath(ROUTES.REPLICATION_TARGET), this.lang('nav.replicationTarget')),
            getNavItem(getPath(ROUTES.HOST_ACCESS_GROUP), this.lang('nav.hostAccessGroup')),
            getNavItem(getPath(ROUTES.SECURITY_KEY_SERVER), this.lang('nav.securityKeyServer')),
            getNavItem(getPath(ROUTES.SCHEDULER_EVENTS), this.lang('nav.schedulerEvents'))
        ];
    }

    lang(key, params, bundle = null) {
        return super.lang(key, params, bundle || BUNDLE_NAME);
    }

    isValidRoute(route) {
        return Object.keys(ROUTES).map(key => ROUTES[key]).indexOf(route) >= 0;
    }

    renderUI() {
        const { match, location } = this.props;
        const { serviceType } = match.params;

        if (!serviceType || !this.isValidRoute(serviceType)) {

            console.log('Redirecting Data Service UI to Default route %s', ROUTES.PERFORMANCE_QOS);
            return <Redirect to={getDefaultRouteTo(location)} />
        }

        console.log('Data Service UI Rendered', match);

        const { navItems } = this.state;
        return <div className="p3-module p3-data-service">
            <header>
                <this.amd.components.P3NavBar items={navItems} />
            </header>
            <section>
                <Switch>
                    {routeConfig.map(route => <Route {...route} key={route.path} />)}
                </Switch>
            </section>
        </div>
    }
}