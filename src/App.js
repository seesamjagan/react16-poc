import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import * as core from './core';

const APP_NAME = 'Pivot3 Management Application v11.0';

const Logo = (props) => ( <a href="//pivot3.com" target="Pivot3.inc" className="p3-logo" title={APP_NAME}>Pivot3</a>);

const AppHeader = ({ navItems, navBar:P3NavBar }, context) => (
  <header className="p3-app-header">
    <P3NavBar items={navItems} logo={Logo} />
  </header>
);

class App extends core.P3ModuleBase {

  constructor(props, context) {
    super(props, context, [new core.BundleVo('p3-strings', 'en_US'), core.componentsAMDPayload]);
    this.name = APP_NAME;
    this.state = Object.assign(this.state, {
      navItems: []
    });
  }

  onAMDLoadComplete() {
    const getNavItem = this.amd.components.getNavItem;
    this.setState({
      navItems: [
        getNavItem('/dashboard', this.lang('nav.dashboard')),
        getNavItem('/system', this.lang('nav.system')),
        getNavItem('/provisioning', this.lang('nav.provisioning')),
        getNavItem('/data-services', this.lang('nav.dataServices')),
        getNavItem('/configure', this.lang('nav.configure')),
        getNavItem('/toolbox', this.lang('nav.toolbox'))
      ]
    })
  }

  renderHeaderUI(props) {
    if (props.location.pathname.indexOf('/login') >= 0) {
      return null;
    }
    return <AppHeader navItems={this.state.navItems} {...props} navBar={this.amd.components.P3NavBar} />
  }

  renderUI() {
    console.log('App UI Rendered', this.props);
    return (
      <Router>
        <div className="p3-app">
          <Route path="/" render={props => this.renderHeaderUI(props)} />
          <Switch>
            {core.appRouteConfig.map(route => <Route {...route} key={route.path} />)}
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
