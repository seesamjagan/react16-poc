import React from 'react';
import { LocaleManager } from './locale-manager';

const P3_STRINGS = 'p3-strings';

export const ModuleLoadingUI = (props) => {

    const lm = LocaleManager.getInstance();

    if (props.error) {
        console.error('ModuleLoadingUI error props', props);
        return (
            <div>
                <span>{lm.getString(P3_STRINGS, 'amd.error', [props.name])}</span>
                <button onClick={props.retry}>{lm.getString(P3_STRINGS, 'label.reload')}</button>
                <span>{lm.getString(P3_STRINGS, 'see.console.error')}</span>
            </div>
        );
    } else if (props.timedOut) {
        return (
            <div>
                <span>{lm.getString(P3_STRINGS, 'amd.loading.slow', [props.name])}</span>
                <button onClick={props.retry}>{lm.getString(P3_STRINGS, 'label.reload')}</button>
            </div>
        );
    } else if (props.pastDelay) {
        return (
            <div>
                <span>{lm.getString(P3_STRINGS, 'amd.loading', [props.name])} </span>
            </div>
        );
    } else {
        return null;
    }
}

export default ModuleLoadingUI;