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
            srcTodos: [],
            showError: false,
            errorMessage: '',
            errorTitle: '',
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
        this.addNewTodoInDB(this.state.newTodoItem);
        this.resetForm();
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
        this.loadTODO();
    }

    loadTODO = () => {
        core.Fetch.post('/todo')
            //.then(res => res.json())
            .then(response => {
                let message = response.status ? null : response.message;
                let todos = response.status ? response.data : [];
                this.setState({ todos, message, srcTodos: [...todos] });
            });
    }

    onChange = (e, todo) => {
        core.Fetch.post('/todo/update', { ...todo, status: e.target.value })
            .then(result => {
                if (result.status) {
                    this.loadTODO();
                } else {
                    this.setState({
                        showError: true, errorMessage: result.message, errorTitle: 'Update Task'
                    });
                }
            });
    }

    addNewTodoInDB = (newTodoItem) => {
        core.Fetch.post('/todo/add', { label: newTodoItem, status: TODO_STATUS.OPEN })
        .then(result => {
            if (result.status) {
                this.loadTODO();
            } else {
                this.setState({
                    showError: true, errorMessage: result.message, errorTitle: 'Add New'
                });
            }
        });
    }

    onFilterChange = e => {
        let status = +e.target.value;
        this.setState({
            todos: this.state.srcTodos.filter(todo => {
                return status === -1 || (+todo.status === status);
            })
        })
    }

    renderUI() {
        return (
            <div>
                <this.amd.components.P3MessageBox title="Add Todo" message="Add a new Todo Action Item." actions={this.state.actions} onAction={this.onAddTodoFormAction}>
                    <div>
                        <fieldset>
                            <FilterForm onChange={this.onFilterChange} count={this.state.todos.length} total={this.state.srcTodos.length} />
                        </fieldset>
                        <fieldset style={{ maxHeight: '200px', overflow: "auto" }}>
                            <div>
                                {this.state.message && <div>{this.state.message}</div>}
                                {this.state.todos.map((todo) => <TodoItem key={todo.id} todo={todo} onChange={(e) => this.onChange(e, todo)} />)}
                                {this.state.todos.length === 0 && <div>Nothing to show!</div>}
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

                {
                    this.state.showError && <this.amd.components.P3PopUp
                        title={this.state.errorTitle}
                        type={this.amd.components.P3MessageBox.ERROR}>
                        {this.state.errorMessage}
                    </this.amd.components.P3PopUp>
                }

            </div>
        );
    }
}


const FilterForm = ({ onChange, count, total }) => {
    return <div className='todo-item'>
        <span>Show </span>
        <select defaultValue='-1' onChange={onChange}>
            <option value="-1">All</option>
            {Object.keys(TODO_STATUS_ICON).map(key => <option key={key} value={key}>{TODO_STATUS_ICON[key]}</option>)}
        </select>
        <spn> Showing: </spn>
        <span>{count}</span>
        <span> of </span>
        <span>{total}</span>
    </div>
}

const TodoItem = ({ todo, onClick, onChange }) => {
    return <div className='todo-item' onClick={onClick}>
        <select defaultValue={todo.status} onChange={onChange}>
            {Object.keys(TODO_STATUS_ICON).map(key => <option key={key} value={key}>{TODO_STATUS_ICON[key]}</option>)}
        </select> 
         {todo.label} -Created On {new Date(+todo.ts).toDateString()}
    </div>
}

export default AddTodoForm;