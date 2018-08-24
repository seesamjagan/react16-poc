import React from 'react';
import Loadable from 'react-loadable';
import { ModuleLoadingUI } from './module-loading-ui';
import { Redirect } from 'react-router-dom';
import { LocaleManager } from './locale-manager';

const LM = LocaleManager.getInstance();

const TXT = key => LM.getString('p3-strings', key);


export const AsyncLogin = Loadable({ loader: () => import('./../routes/login'), loading: (props)=><ModuleLoadingUI name={TXT('amd.login')} {...props} /> });
export const AsyncDashboard = Loadable({ loader: () => import('./../routes/dashboard'), loading: (props)=><ModuleLoadingUI name={TXT('amd.dashboard')} {...props} /> });
export const AsyncSystem = Loadable({ loader: () => import('./../routes/system'), loading: (props)=><ModuleLoadingUI name={TXT('amd.system')} {...props} /> });
export const AsyncProvisioning = Loadable({ loader: () => import('./../routes/provisioning'), loading: (props)=><ModuleLoadingUI name={TXT('amd.provisioning')} {...props} /> });
export const AsyncDataService = Loadable({ loader: () => import('./../routes/data-service'), loading: (props)=><ModuleLoadingUI name={TXT('amd.dataServices')} {...props} /> });
export const AsyncConfigure = Loadable({ loader: () => import('./../routes/configure'), loading: (props)=><ModuleLoadingUI name={TXT('amd.configure')} {...props} /> });
export const AsyncToolbox = Loadable({ loader: () => import('./../routes/toolbox'), loading: (props)=><ModuleLoadingUI name={TXT('amd.toolbox')} {...props} /> });
export const Async404 = Loadable({ loader: () => import('./../routes/page-404'), loading: (props)=><ModuleLoadingUI name={TXT('amd.404')} {...props} /> });

export const appRouteConfig = [
    { exact: true, path: "/login", component: AsyncLogin },
    { exact: true, path: "/dashboard", component: AsyncDashboard },
    { exact: true, path: "/system", component: AsyncSystem },
    { exact: true, path: "/provisioning/:storageType", component: AsyncProvisioning },
    { exact: true, path: "/provisioning", component: AsyncProvisioning },
    { exact: true, path: "/data-services/:serviceType/:service", component: AsyncDataService },
    { exact: true, path: "/data-services/:serviceType", component: AsyncDataService },
    { exact: true, path: "/data-services", component: AsyncDataService },
    { exact: true, path: "/configure", component: AsyncConfigure },
    { exact: true, path: "/toolbox/:toolType", component: AsyncToolbox },
    { exact: true, path: "/toolbox", component: AsyncToolbox },
    { exact: true, path: "/", render: (props)=><Redirect to={{pathname: "/dashboard"}} /> },
    { path: "*", component: Async404 },
]
export default appRouteConfig; 