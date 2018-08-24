
export class BundleVo {
    constructor(bundleName, locale='en_US') {
        this.bundleName = bundleName;
        this.locale = locale;
    }
}

export class ModuleVo {
    constructor(module, loader) {
        this.module = module;
        this.loader = loader;
    }
}

export const actionAMDPayload = new ModuleVo('actions', () => import('./../actions'));

export const modelAMDPayload = new ModuleVo('model', () => import('./../model'));

export const componentsAMDPayload = new ModuleVo('components', () => import('./../components'));