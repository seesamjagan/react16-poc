import React from 'react';
import * as core from '../../core';

const deps = [core.actionAMDPayload, core.modelAMDPayload, core.componentsAMDPayload];

const TODO_STATUS = {
    OPEN: 0, // ⏲
    INPROGRESS: 1, // 🔥 ⏳
    DONE: 2, // ✅
    HOLD: 3, // ⏸
    CANCELLED: 4 // ❌
}

const TODO_STATUS_ICON = {
    0: "⏲",
    1: "🔥", // ⏳
    2: "✅",
    3: "⏸",
    4: "❌",
}

export class AddTodoForm extends core.P3ModuleBase {

    constructor(props, context) {
        super(props, context, [...deps]);

        this.state = Object.assign(this.state, {
            actions: [{ label: 'Add', enabled: false }, { label: 'Reset', enabled: true }],
            todos: [],
        });

        this.newTodoInput = React.createRef();
    }

    onAMDLoadComplete() {
        // All Dependencise loaded.
        // Best place to start the business logic.
    }

    onNewTodoItemChange = event => {
        let newTodoItem = event.target.value;
        let actions = [{ label: 'Add', enabled: newTodoItem.trim().length > 0 }, { label: 'Reset', enabled: true }]
        this.setState({ newTodoItem, actions });
    }

    onAddTodoFormAction = action => {
        switch (action.label) {
            case 'Add':
                this.addNewTodo();
                break;
            case 'Reset':
                this.resetForm();
                break;
            default:
                // Do nothing!
        }
    }

    addNewTodo = () => {
        this.setState(({ todos, newTodoItem }, props) => {
            todos = [...todos, { label: newTodoItem }];

            // TODO :: push it in DB

            return { todos };
        }, this.resetForm);
    }

    onNewTodoKeyUp = event => {
        if (event.key === 'Enter') {
            this.addNewTodo();
        }
    }

    resetForm = () => {
        this.setState({ newTodoItem: '', actions: [{ label: 'Add', enabled: false }, { label: 'Reset', enabled: true }] });
        this.newTodoInput.current.value = '';
        this.newTodoInput.current.focus();
    }

    componentDidMount() {
        //fetch('/todo')
        core.Fetch.post('/todo')
            //.then(res => res.json())
            .then(response => this.setState({ todos: response.status ? response.data : [] }));
    }

    renderUI() {
        return (
            <div>
                <this.amd.components.P3MessageBox title="Add Todo" message="Add a new Todo Action Item." actions={this.state.actions} onAction={this.onAddTodoFormAction}>
                    <div>
                        <fieldset style={{ maxHeight: '200px', overflow: "auto" }}>
                            <div>
                                {this.state.todos.map((todo, key) => <TodoItem key={key} todo={todo} />)}
                            </div>
                        </fieldset>
                        <fieldset>
                            <label>Todo Item</label>
                            <input ref={this.newTodoInput}
                                type="text"
                                onChange={this.onNewTodoItemChange}
                                onKeyUp={this.onNewTodoKeyUp} />
                        </fieldset>
                    </div>
                </this.amd.components.P3MessageBox>
            </div>
        );
    }
}

const TodoItem = ({ todo }) => <div className='todo-item'>{TODO_STATUS_ICON[todo.status]} - {todo.label}</div>

export default AddTodoForm;