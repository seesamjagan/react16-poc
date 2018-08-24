import React from 'react';
import { LocaleManager } from './locale-manager';

const lm = LocaleManager.getInstance();

const BUNDLE_NAME = "p3-strings";

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true, error, info });
    }

    onReport = event => {
        const {error, info } = this.state;

        console.debug('Error: %O, info: %O', error, info);

        // TODO :: make a ui error report service request.
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p3-message-panel error">
                    <h2 className="title">{lm.getString(BUNDLE_NAME, 'error.message', [this.state.error.message])}</h2>
                    <hr/>
                    <div className="message">
                        <p>{lm.getString(BUNDLE_NAME, 'error.reportTo')}<button onClick={this.onReport}>{lm.getString(BUNDLE_NAME, 'label.report')}</button></p>
                        
                    </div>
                    <p className="more">{this.state.info.componentStack }</p>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;