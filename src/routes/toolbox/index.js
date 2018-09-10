import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import * as core from '../../core';

const deps = [core.actionAMDPayload, core.modelAMDPayload, core.componentsAMDPayload];

const getPath = view => '/toolbox/'+view;

const ROUTES = {
    PERFORMANCE_MONITOR: 'performance-monitor',
    PERFORMANCE_DIAGNOSIS: 'performance-diagnostics',
    CONNECTION_MAP: 'connection-map'
};
const routeConfig = [
    {path: getPath(ROUTES.PERFORMANCE_MONITOR), component: ()=><div>Performance Monitor View</div>},
    {path: getPath(ROUTES.PERFORMANCE_DIAGNOSIS), component: ()=><div>Performance Diagnostics View</div>},
    {path: getPath(ROUTES.CONNECTION_MAP), component: ()=><div>Connection Map View</div>}
];

export default class ToolboxModule extends core.P3ComponentBase {
    constructor(props, context) {
        super(props, context, [new core.BundleVo('p3-toolbox', 'en_US'), ...deps]);
        this.state = Object.assign(this.state, {
            navItems: []
        });
    }

    onAMDLoadComplete() {
        const getNavItem = this.amd.components.getNavItem;
        this.setState({
            navItems: [
                getNavItem(getPath(ROUTES.PERFORMANCE_MONITOR), this.lang('nav.monitor', null, 'p3-toolbox')),
                getNavItem(getPath(ROUTES.PERFORMANCE_DIAGNOSIS), this.lang('nav.diagnostics', null, 'p3-toolbox')),
                getNavItem(getPath(ROUTES.CONNECTION_MAP), this.lang('nav.map', null, 'p3-toolbox'))
            ]
        });
    }

    isValidRoute(route) {
        return Object.keys(ROUTES).map(key=>ROUTES[key]).indexOf(route) >= 0;
    }

    renderUI() {

        const { match, location } = this.props;
        const { toolType } = match.params;

        if(!toolType || !this.isValidRoute(toolType)) {

            console.log('Redirecting Toolbox UI to Default route %s', ROUTES.PERFORMANCE_MONITOR);

            let to = {
                pathname: getPath(ROUTES.PERFORMANCE_MONITOR),
                state: {from: location }
            };
            return <Redirect to={to} />
        }

        console.log('Toolbox UI Rendered', this.props.match);
        
        const { navItems } = this.state;
        return <div className="p3-module p3-toolbox">
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