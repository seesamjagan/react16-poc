// list of FSA compilance props.
const FSA_PROPS = ['type', 'payload', 'error', 'meta'];

export class FSA {
    constructor(type, payload = null, meta = null, error = false) {
        this.type = type;
        this.payload = payload;
        this.error = error;
        this.meta = meta;
    }

    isFSA() {
        return (
            this.isPlainObject(this) &&
            this.isString(this.type) &&
            Object.keys(this).every(this.isValidKey)
        );
    }

    isError() {
        return this.isFSA() && this.error === true;
    }

    isPlainObject(action) {
        // TODO :: 
        return true;
    }

    isString(value) {
        return typeof value === 'string';
    }

    isValidKey(key) {
        return FSA_PROPS.indexOf(key) > -1;
    }

    mixin(value) {

        FSA_PROPS.forEach(prop => {
            if (value.hasOwnProperty(prop)) {
                this[prop] = value[prop];
            }
        });
    }


}

export const AppActions = {
    get LOGIN() { return 'p3-login' },
    get LOGOUT() { return 'p3-logout' },
    get NAVIGATE() { return 'p3-navigate' }
};

export const login = credentials => new FSA(AppActions.LOGIN, credentials);

export const logout = () => new FSA(AppActions.LOGOUT);

export const navigate = (viewPath, viewModel=null) => new FSA(AppActions.NAVIGATE, viewPath, viewModel);

export default FSA;