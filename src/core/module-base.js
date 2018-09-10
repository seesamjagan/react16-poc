import React, { Component } from 'react';
import { LocaleManager } from './locale-manager';
import { BundleVo, ModuleVo } from './module-payload';
import { ErrorBoundary } from './error-boundry';

const localeManager = LocaleManager.getInstance();

var moduleLoaderInstance;

class ReactModuleLoader {

    constructor() {
        if(moduleLoaderInstance) {
            return moduleLoaderInstance;
        }
        moduleLoaderInstance = this;
    }

    static get instanse() {
        return moduleLoaderInstance || new ReactModuleLoader();
    }

    load = ({ module, loader, callback }) => {
        return loader().then(moduleDef => {
            return (this[module] = moduleDef);
        }).catch(reason => {
            console.error(reason);
            return (this[module] = reason);
        }).then(moduleDefOrError => {
            callback && callback(module, moduleDefOrError);
            return moduleDefOrError;
        });
    }
}

const __loader__ = Symbol('__loader__');

export class ReactModuleBase extends Component {

    constructor(props, context = null, depends = null) {
        super(props, context);
        let state = {
            hasUIError: false,
            uiErrorInfo: null,
            isAMDReady: true,
            isAMDError: false,
            isInjectingAMD: false,
            amd: null,
        };
        depends = depends || props.depends;
        if (depends && depends.length) {
            this.depends = depends;
            state.isAMDReady = false;
        }
        this.state = state;
        this[__loader__] = ReactModuleLoader.instanse;
    }

    load = (depends) => {
        const amd = this.amd;
        return Promise.all(depends.map(payload => {
            if (payload instanceof BundleVo) {
                // if the dependency is a locale bundle
                return localeManager.load(payload.bundleName, payload.callback, payload.locale);
            } else if (payload instanceof ModuleVo) {
                // if the dependency is an amd
                return amd.load(payload);
            } else {
                throw new Error('dependency payload should be either BundleVo or ModuleVo');
            }
        })).then(defs => {
            return defs;
        }).catch(errors => {
            console.log('Error Loading AMD, %O', errors);
            return errors;
        });
    }

    preLoadAMD = (depends = []) => {
        return this.load(depends)
            .then(results => {
                let errors = results.filter(result => result instanceof Error);
                let isAMDError = errors.length > 0;
                let isAMDReady = !isAMDError;
                if (errors.length > 0) {
                    console.error(...errors);
                } else {
                    this.onAMDLoadComplete();
                }
                this.setState({ isAMDError, isAMDReady });
                return results;
            });
    }

    injectAMD = (depends, onAMDInjected = null) => {
        if (depends) {
            depends = Array.isArray(depends) ? depends : [depends];
        } else {
            // TODO :: check this use-case
            return  Promise.resolve([new Error('missing dependency details')]);
        }
        this.setState({
            isInjectingAMD: true,
        });
        return this.load(depends)
            .then(results => {
                let errors = results.filter(result => result instanceof Error);
                let isAMDInjectionError = errors.length > 0;
                let isAMDInjected = !isAMDInjectionError;
                if (errors.length > 0) {
                    console.error(...errors);
                } else {
                    onAMDInjected && onAMDInjected();
                    this.onAMDInjected();
                }
                this.setState({ isAMDInjectionError, isAMDInjected, isInjectingAMD: false });

                return results;
            });
    }

    /**
     * override this method in the sub class to initiate actions once all
     * the AMD are loaded successfully.
     */
    onAMDLoadComplete() {
        // override this method in the sub class
    }

    /**
    * override this method in the sub class to initiate actions once all
    * the AMD are injected successfully.
    */
    onAMDInjected() {
        // override this method in the sub class
    }

    /**
     * asynchronous module definition
     */
    get amd() {
        return this[__loader__] || null;
    }

    get isAMDError() {
        return this.state.isAMDError;
    }

    get isAMDReady() {
        return this.state.isAMDReady;
    }

    /**
     * override this method to provide a custom AMD Error UI
     */
    getAMDErrorUI() {
        let dependencyError = `Failed to load dependent module(s) for ${this.NAME}.`;
        let reload = 'Reload';
        let additionalInfo = 'Check the console error(s) for more info.';

        return (<div className='react-module'>
            <span>{dependencyError}</span>
            <button onClick={() => this.preLoadAMD(this.depends)}>{reload}</button>
            <span>{additionalInfo}</span>
        </div>);
    }

    get NAME() { return this.name || this.constructor.name; }

    /**
     * override this method to provide a custom AMD loading UI.
     */
    getAMDLoadingUI() {
        return (
            <div className='react-module'>
                Loading dependent module definitions for {this.NAME}.
            </div>
        );
    }

    getUIErrorFallbackUI(error, info) {
        console.log('error: %O, info: %O', error, info);
        return (<div className='p3-message-panel error'>Something went wrong with the message: "{error.message}"!</div>);
    }

    /**
     * override this method to render the component's UI.
     * this method will get called inside the render() method to render UI,
     * once all the AMD dependency's are loaded.
     */
    renderUI() {
        return null;
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasUIError: true, uiErrorInfo: { error, info } });

        // You can also log the error to an error reporting service
        //logErrorToMyService(error, info);
    }

    componentDidMount() {
        if(this.depends && this.depends.length > 0) {
            this.preLoadAMD(this.depends);
        }
    }

    render() {

        const { hasUIError, isAMDReady, isAMDError, uiErrorInfo } = this.state;

        if (isAMDError) {
            return this.getAMDErrorUI();
        }
        if (!isAMDReady) {
            return this.getAMDLoadingUI();
        }
        if (hasUIError) {
            return this.getUIErrorFallbackUI(uiErrorInfo.error, uiErrorInfo.info);
        }
        return <ErrorBoundary>{this.renderUI()}</ErrorBoundary>
    }
}

const P3_STRINGS = 'p3-strings';

export class P3ModuleBase extends ReactModuleBase {
    constructor(props, context = null, depends = null) {
        super(props, context, depends);
    }

    lang(key, params = null, bundle = null) {
        return localeManager.getString(bundle || P3_STRINGS, key, params);
    }

    $lang(key, params = null) {
        return localeManager.getString(P3_STRINGS, key, params);
    }

    /**
     * override this method to provide a custom AMD Error UI
     */
    getAMDErrorUI() {
        const hasBundle = localeManager.hasBundle(P3_STRINGS, 'en_US');

        let dependencyError = '';
        let reload = '';
        let additionalInfo = '';

        if (hasBundle) {
            dependencyError = this.$lang('dependency.error', [this.NAME]);
            reload = this.$lang('label.reload');
            additionalInfo = this.$lang('see.console.error');
        } else {
            dependencyError = `Failed to load dependent module(s) for ${this.NAME}.`;
            reload = 'Reload';
            additionalInfo = 'Check the console error(s) for more info.';
        }

        return (<div className='p3-module'>
            <span>{dependencyError}</span>
            <button onClick={() => this.preLoadAMD(this.depends)}>{reload}</button>
            <span>{additionalInfo}</span>
        </div>);
    }

    /**
     * override this method to provide a custom AMD loading UI.
     */
    getAMDLoadingUI() {
        return (
            <div className='p3-module'>
                {localeManager.hasBundle(P3_STRINGS, 'en_US') ? this.$lang('dependency.loading', [this.NAME]) : `Loading dependent module definitions for ${this.NAME}.`}
            </div>
        );
    }
}

export default P3ModuleBase;