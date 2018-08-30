import React from 'react';
import * as core from './../core';

export const P3BaseComponent = (props) => {
    return <core.ErrorBoundary>{props.children}</core.ErrorBoundary>
}
export default P3BaseComponent;