import React from 'react';
import * as core from './../../../core';

const deps = [core.actionAMDPayload, core.modelAMDPayload, core.componentsAMDPayload];

export class Users extends core.P3ComponentBase {


    constructor(props, context) {
        super(props, context, deps.concat(core.componentsAMDPayload));
        this.state = Object.assign(this.state, {
            list: [],
            columns: this.getCols(),
            message: null,
        });
    }

    getCols = () => {
        return [
            {
                title: 'Picture',
                dataField: 'picture',
                allowSort: false,
                allowFilter: false,
                labelRenderer: ({ data, column, dataProvider }) => <img alt={data.name.first} src={data.picture + '&image=' + dataProvider.indexOf(data)} />,
                titleRenderer: ({ column, dataProvider }) => <img alt='avatar' src="http://placehold.it/32x32" />,
                width: "34px"
            },
            { title: 'E-Mail', dataField: 'email', footer: 'E-mail' },
            { title: 'Age', dataField: 'age', width: "64px" },
            {
                title: 'Gender',
                dataField: 'gender',
                labelFunction: ({ gender }, col, dp) => (gender === 'm' ? '👨' : gender === 'f' ? '👩' : '👯'),
                titleFunction: (col, dp) => "♀️",
                footerFunction: (col, dp) => {
                    let m = 0, f = 0, t = 0;
                    dp.forEach(({ gender }) => {
                        if (gender === 'm') {
                            m++;
                        } else if (gender === 'f') {
                            f++;
                        } else {
                            t++;
                        }
                    });
                    return [m, f, t].join('/');
                },
                width: "80px"
            },
            { title: 'Company Company Company Company Company Company Company Company Company Company Company Company Company Company Company ', dataField: 'company' },
            {
                title: 'isActive',
                dataField: 'isActive',
                labelRenderer: ({ data, column, dataProvider }) => data.isActive ? '✔' : '✘',
                footerRenderer: ({ column, dataProvider }) => {
                    let a = dataProvider.reduce((preVal, current) => preVal + (current.isActive ? 1 : 0), 0);
                    return [a, dataProvider.length - a].join(' / ');
                },
                width: '96px',
            },
            { title: 'Phone', dataField: 'phone' },
            {
                title: 'Name',
                dataField: 'name',
                labelFunction: ({ name }, col, dp) => name.first + ' ' + name.last + ' ' + name.first + ' ' + name.last + ' ' + name.first + ' ' + name.last
            }

        ];
    }

    onAMDLoadComplete() {
        this.loadUsers();
    }

    loadUsers() {
        this.setState({ message: 'Loading...' });

        core.Fetch.post('/users').then(response => {
            let message = null;
            let list = [];
            if (response.status) {
                list = response.data;
                message = list.length > 0 ? null : 'No data found!';
            } else {
                message = response.message;
            }
            this.setState({
                list,
                message
            });
        });
    }

    renderUI() {
        const { P3DataGrid } = this.amd.components;
        const { list, columns, message } = this.state;
        return (
            <div className="users">
                <hr />
                <h4>Fixed Hight Table with footer</h4>
                <hr />
                <P3DataGrid dataProvider={list} columns={columns} height="350px" showFooter placeholder={message} />
            </div>
        );
    }
}

export default Users;