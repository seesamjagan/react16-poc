import React from 'react';
import * as core from '../../../core';

const deps = [core.actionAMDPayload, core.modelAMDPayload, core.componentsAMDPayload];

const TODO_STATUS = {
    ALL: -1,
    OPEN: 0,
    INPROGRESS: 1,
    DONE: 2,
    HOLD: 3,
    CANCELLED: 4
}

const TODO_STATUS_ICON = {
    0: "⏲",
    1: "🔥", // ⏳
    2: "✅",
    3: "⏸",
    4: "❌",
}

const TODO_TYPE_ICON = {
    0: "🔖",
    1: "🐞"
}

const TODO_PRIORITY = {
    BLOCKER: 0,
    CRITICAL: 1,
    HIGH: 2,
    NORMAL: 3,
    LOW: 4
}

export class TodoForm extends core.P3ComponentBase {

    constructor(props, context) {
        super(props, context, [...deps]);

        this.state = Object.assign(this.state, {
            actions: this.getActions(),
            todos: [],
            filterStatus: TODO_STATUS.INPROGRESS,
            showError: false,
            errorMessage: '',
            errorTitle: '',
        });

        this.newTodoInput = React.createRef();
    }

    getActions = () => [{ label: 'Add', enabled: true }, { label: 'Export' }, { label: 'Reset', enabled: true }];

    onAMDLoadComplete() {
        // All Dependencise loaded.
        // Best place to start the business logic.
        this.loadTODO();
    }

    onNewTodoItemChange = event => {
        let newTodoItem = event.target.value;
        this.setState({ newTodoItem });
    }

    onAddTodoFormAction = action => {
        switch (action.label) {
            case 'Add':
                this.addNewTodo();
                break;
            case 'Reset':
                this.resetForm();
                break;
            case 'Export':
                this.exportTodos(this.state.todos);
                break;
            default:
            // Do nothing!
        }
    }

    addNewTodo = () => {
        if (this.state.newTodoItem.trim().length > 0) {
            this.addNewTodoInDB(this.state.newTodoItem);
            this.resetForm();
        } else {

        }
    }

    onNewTodoKeyUp = event => {
        if (event.key === 'Enter') {
            this.addNewTodo();
        }
    }

    resetForm = () => {
        this.setState({ newTodoItem: '' });
        this.newTodoInput.current.value = '';
        this.newTodoInput.current.focus();
    }

    exportTodos = (todos) => {
        if (todos.length > 0) {
            let encoding = 'data:text/json;charset=utf-8,';
            let dataURL = encodeURI(encoding + JSON.stringify(todos, null, "\t"));
            let link = document.createElement("a");
            link.setAttribute("href", dataURL);
            link.setAttribute("download", "my_todos.json");
            link.innerHTML = ".";
            document.body.appendChild(link); // Required for FF

            link.click();

            setTimeout(() => {
                document.body.removeChild(link);
            });
        }
    }

    loadTODO = () => {
        core.Fetch.post('/todo')
            //.then(res => res.json())
            .then(response => {
                let message = response.status ? null : response.message;
                let todos = response.status ? response.data : [];
                this.setState({
                    todos,
                    message
                });
            });
    }

    onAIChange = (todo) => {
        core.Fetch.post('/todo/update', { ...todo })
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
        core.Fetch.post('/todo/add', { title: newTodoItem, status: TODO_STATUS.OPEN })
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
        let status = e.target.value;
        this.setState({
            filterStatus: +status,
        });
    }

    renderUI() {

        const { actions, message, todos, showError, errorTitle, errorMessage, filterStatus } = this.state;
        const visibleAI = todos.filter(ai => filterStatus === -1 || ai.status === filterStatus);
        const options = Object.keys(TODO_STATUS_ICON).map((key) => ({ 
            value: +key,
            label: `${TODO_STATUS_ICON[+key]} (${todos.filter(ai => ai.status === +key).length})`
        }));
        /*
        options.forEach(option => {
            option.label = `${TODO_STATUS_ICON[option.value]} (${todos.filter(ai => ai.status === option.value).length}) `;
        });
        */

        options.unshift({ value: -1, label: 'All(' + todos.length + ')' });

        return (
            <div>
                <this.amd.components.P3MessageBox title="Add Todo" message="Add a new Todo Action Item." actions={actions} onAction={this.onAddTodoFormAction}>
                    <div>
                        <fieldset>
                            <label>Add New Todo Item</label>
                            <input ref={this.newTodoInput}
                                type="text"
                                onChange={this.onNewTodoItemChange}
                                onKeyUp={this.onNewTodoKeyUp} />
                        </fieldset>

                        <fieldset style={{ maxHeight: '200px', overflow: "auto" }}>
                            <div>
                                {message && <div>{message}</div>}
                                <TodoItemList items={visibleAI} onAIChange={this.onAIChange} />
                            </div>
                        </fieldset>

                        <fieldset>
                            <FilterForm options={options} onChange={this.onFilterChange} defaultValue={TODO_STATUS.INPROGRESS} count={visibleAI.length} total={todos.length} />
                        </fieldset>
                    </div>
                </this.amd.components.P3MessageBox>

                {
                    showError && <this.amd.components.P3PopUp
                        title={errorTitle}
                        type={this.amd.components.P3MessageBox.ERROR}>
                        {errorMessage}
                    </this.amd.components.P3PopUp>
                }

            </div>
        );
    }
}

/*
const getVisibleTodos = (todos, statusFilter) => {
    return todos.filter(todo => statusFilter === TODO_STATUS.ALL || todo.status === statusFilter);
}
const mapStateToProps = state=> {
    return {
        todos: getVisibleTodos(state.todos, state.statusFilter)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAIChange: todo => {
            dispatch(updateTodo(todo));
        }
    }
}
const updateTodo = todo => {
    todo;// TODO :: save in db
}
*/

const TodoItemList = ({items=[], onAIChange}) => {
    return <div>
        {items.map((todo) => <TodoItem key={todo.id} todo={todo} onTaskChange={onAIChange} />)}
        {items.length === 0 && <div>Nothing to show!</div>}
    </div>
}

const TodoItem = ({ todo, onClick, onTaskChange }) => {
    const clone = { ...todo };
    const onChange = ({ target }) => {
        clone[target.name] = +target.value;
    }
    const onTitleChange = ({ target }) => {
        clone.title = target.value;
    }

    const onApply = e => {
        onTaskChange(clone);
    }

    return <div className='todo-item' onClick={onClick}>
        <select defaultValue={todo.status} onChange={onChange} name='status'>
            {Object.keys(TODO_STATUS_ICON).map(key => <option key={key} value={key}>{TODO_STATUS_ICON[key]}</option>)}
        </select>
        <select defaultValue={todo.type} onChange={onChange} name='type'>
            {Object.keys(TODO_TYPE_ICON).map(key => <option key={key} value={key}>{TODO_TYPE_ICON[key]}</option>)}
        </select>
        <select defaultValue={todo.priority} onChange={onChange} name='priority'>
            {Object.keys(TODO_PRIORITY).map(key => <option key={key} value={TODO_PRIORITY[key]}>{key}(P{TODO_PRIORITY[key]})</option>)}
        </select>
        <input type="text" defaultValue={todo.title} onChange={onTitleChange} style={{ minWidth: '550px' }} />
        <button onClick={onApply}>Apply</button>
    </div>
}

const FilterForm = ({ options, onChange, count, total, defaultValue = -1 }) => {
    return <div className='todo-item'>
        <span>Show </span>
        <select defaultValue={defaultValue} onChange={onChange}>
            {options.map((opt, key) => <option key={key} value={opt.value}>{opt.label}</option>)}
        </select>
        <span> Showing: </span>
        <span>{count}</span>
        <span> of </span>
        <span>{total}</span>
    </div>
}

export default TodoForm;


/**
 * AVOID using the following methods.
 * 
 * componentWillMount
 * componentWillReceiveProps
 * componentWillUpdate
 */