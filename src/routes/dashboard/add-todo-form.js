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
            filterStatus: -1,
            showError: false,
            errorMessage: '',
            errorTitle: '',
        });

        this.newTodoInput = React.createRef();
    }

    onAMDLoadComplete() {
        // All Dependencise loaded.
        // Best place to start the business logic.
        this.loadTODO();
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

    onAIStatusChange = (e, todo) => {
        core.Fetch.post('/todo/update', { ...todo, status: +e.target.value })
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
        let status = e.target.value;
        this.setState({
            filterStatus: +status,
        });
    }

    renderUI() {

        const { actions, message, todos, showError, errorTitle, errorMessage, filterStatus } = this.state;
        const visibleAI = todos.filter(ai=>filterStatus===-1 || ai.status===filterStatus);
        const options = Object.keys(TODO_STATUS_ICON).map(key=>({value: +key}));
        
        options.forEach(option=>{
            option.label = `${TODO_STATUS_ICON[option.value]} (${todos.filter(ai=>ai.status===option.value).length}) `;
        });

        options.unshift({value: -1, label: 'All('+todos.length+')'});

        return (
            <div>
                <this.amd.components.P3MessageBox title="Add Todo" message="Add a new Todo Action Item." actions={actions} onAction={this.onAddTodoFormAction}>
                    <div>
                        <fieldset>
                            <FilterForm options={options} onChange={this.onFilterChange} count={visibleAI.length} total={todos.length} />
                        </fieldset>
                        <fieldset style={{ maxHeight: '200px', overflow: "auto" }}>
                            <div>
                                {message && <div>{message}</div>}
                                {visibleAI.map((todo) => <TodoItem key={todo.id} todo={todo} onChange={(e) => this.onAIStatusChange(e, todo)} />)}
                                {visibleAI.length === 0 && <div>Nothing to show!</div>}
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


const FilterForm = ({ options, onChange, count, total }) => {
    return <div className='todo-item'>
        <span>Show </span>
        <select defaultValue='-1' onChange={onChange}>
            { options.map((opt, key) => <option key={key} value={opt.value}>{opt.label}</option>) }
            {/*Object.keys(TODO_STATUS_ICON).map(key => <option key={key} value={key}>{TODO_STATUS_ICON[key]}</option>)*/}
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