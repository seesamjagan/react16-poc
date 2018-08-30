
export class BundleVo {

    /**
     * 
     * @param {string} bundleName name of the resource bundle
     * @param {string} locale locale of the bundle
     */
    constructor(bundleName, locale='en_US') {
        this.bundleName = bundleName;
        this.locale = locale;
    }
}

export class ModuleVo {
    /**
     * say the module name and module loader function.
     * 
     * @param {string} module the name being reffered in the "amd" object
     * @param {func} loader loader function with import statement.
     */
    constructor(module, loader) {
        this.module = module;
        this.loader = loader;
    }
}

export const actionAMDPayload = new ModuleVo('actions', () => import('./../actions'));

export const modelAMDPayload = new ModuleVo('model', () => import('./../model'));

export const componentsAMDPayload = new ModuleVo('components', () => import('./../components'));