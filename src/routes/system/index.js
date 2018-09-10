import React from 'react';
import * as core from '../../core';
import './system.css';

const deps = [core.actionAMDPayload, core.modelAMDPayload];

export default class SystemModule extends core.P3ComponentBase {
    constructor(props, context) {
        super(props, context, deps.concat(new core.BundleVo('p3-system')));
        this.state = Object.assign(this.state, {

        });
    }
    lang(key, params, bundle = 'p3-system') {
        return super.lang(key, params, bundle);
    }

    renderUI() {
        console.log('System UI Rendered');
        return <div className="p3-module p3-system">
            <header>
                <h2>{this.lang('dummy.info')}</h2>
            </header>
            <section>
                <small>This is a response to CSS-Tricks' <a href="https://css-tricks.com/what-you-should-know-about-collapsing-margins/">What you should know about collapsing margins</a>.</small>
                <h1>Collapsing child margins</h1>

                <p>Six div elements. Each has <code>margin: 1em 0</code>. Margins are collapsed.</p>

                <div className="red">
                    <div className="orange">
                        <div className="yellow">
                            <div className="green">
                                <div className="blue">
                                    <div className="purple">Collapsed</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <p>We want no collapsing and also want to keep the exact sizes so using <code>padding</code> or <code>border</code> is a no go.</p>

                <hr />

                <h2>Fighting against collapsing #1</h2>

                <p>Use <code>inline-block</code> in 100% width. Leave the root element alone to avoid double margins.</p>

                <div className="red">
                    <div className="orange each-with-inline-block">
                        <div className="yellow">
                            <div className="green">
                                <div className="blue">
                                    <div className="purple">Not Collapsed</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <p>Inline blocks are probably the most solid way to do this (least disadvantages).</p>

                <hr />

                <h2>Fighting against collapsing #2</h2>

                <p>Use floats in 100% width. Can't as easily avoid double margins. (There is extra space after this paragraph.)</p>

                <div className="red each-with-float">
                    <div className="orange">
                        <div className="yellow">
                            <div className="green">
                                <div className="blue">
                                    <div className="purple">Not Collapsed</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <p>Floats require much more CSS if you want to achieve the same result as with inline blocks:</p>

                <div className="red clearfix">
                    <div className="orange each-with-float">
                        <div className="yellow">
                            <div className="green">
                                <div className="blue">
                                    <div className="purple">Not Collapsed</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <p>But it's only clearfix that is needed, which you probably already have in your project.</p>

                <hr />

                <h2>Fighting against collapsing #3</h2>

                <p>Use <code>overflow: hidden</code>. Disadvantage is that you can't position stuff outside their parent. Dirty, but easy single line solution.</p>

                <div className="red each-with-overflow-hidden">
                    <div className="orange">
                        <div className="yellow">
                            <div className="green">
                                <div className="blue">
                                    <div className="purple">Not Collapsed</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    }
}