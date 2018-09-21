import React, { PureComponent, Component } from 'react';
import memoize from 'memoize-one';

import './p3-data-grid.css';

/**
 * Inbuild Pagination
 * Manual Pagination
 * Custom Pagination Component
 * 
 * Custom Scroll bar
 * 
 * Lazy Loading
 * 
 * Custom Sorting
 * 
 * Custom Filter
 * Inbuilt Filter
 * 
 * Inbuilt Cell Editor
 * Custom Cell Editor
 * Header Col Span
 * Cell Col Span
 * !!!-- Recycle Rows to improve performance and smooth user experience --!!!
 * !!!-- Special Cols for 'Radio, checkbox, more, expand' kind of features --!!!
 * Disabled Row
 * Selectable Row
 * 
 * Inbuilt Sorting --
 * Inbuilt Header --
 * Custom Header --
 * Inbuilt Cell Renderer -- 
 * Custom Cell Renderer --
 * Inbuilt Footer --
 * Custom Footer --
 * Fixed Width Col --
 * Auto Width Col --
 * Fixed Height Table --
 * Placeholder message with overlay
 */

const SORT = {
    ASC: 1,
    DESC: -1,
    NONE: 0
}

const SORT_ICON = {
    [SORT.ASC]: '↑',//"⬆",
    [SORT.DESC]: '↓',//"⬇",
    [SORT.NONE]: ""
}

export class P3DataGrid extends Component {

    static scrollbarWidth = null;


    componentDidMount() {

        if (!P3DataGrid.scrollbarWidth) {
            // Create the measurement node
            var scrollDiv = document.createElement("div");
            scrollDiv.className = "scrollbar-measure";
            document.body.appendChild(scrollDiv);

            // Get the scrollbar width
            P3DataGrid.scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
            //console.warn(this.scrollbarWidth); // Mac:  15, Win: 17

            // Delete the DIV 
            document.body.removeChild(scrollDiv);
        }
    }

    onColumnHeaderClick = (column, columns, dp) => {
        let sortOrder = 0;

        // In single column sorting, reset sortOrder on other columns
        columns.forEach(col => {
            if (col !== column) {
                col.sortOrder = SORT.NONE;
            }
        });

        // Apply/Flip sorting
        if (!('sortOrder' in column) || column.sortOrder === SORT.NONE) {
            sortOrder = SORT.ASC;
        } else {
            sortOrder = column.sortOrder * -1;
        }
        column.sortOrder = sortOrder;

        // force to update the sorting
        this.setState({}, () => {
            this.props.onSortChange && this.props.onSortChange(sortOrder);
        });
    }

    // using memoize for performance improvement.
    // CAUTION: atlease one of the param should be different to recompute. 
    sortDataProvider = memoize(
        (dataProvider, column, sortOrder) => {
            const sortFunction = column.sortFunction || ((a, b, { sortOrder, dataField, labelFunction = null }) => {

                let a1 = a && a.hasOwnProperty(dataField) && a[dataField] !== null ? a[dataField] : '';
                let b1 = b && b.hasOwnProperty(dataField) && b[dataField] !== null ? b[dataField] : '';

                if (typeof labelFunction === "function") {
                    // a is not null AND labelFunction DOES NOT return ReactComponent (which is an object)
                    if (a) {
                        let label = labelFunction(a, column, dataProvider);
                        if (typeof label !== 'object') {
                            a1 = label;
                        }
                    }
                    if (b) {
                        let label = labelFunction(b, column, dataProvider);
                        if (typeof label !== 'object') {
                            b1 = label;
                        }
                    }
                }
                let isNumeric = (!isNaN(a1) && !isNaN(b1));
                if (isNumeric) {
                    return (a1 - b1) * sortOrder;
                }
                return a1.toString().localeCompare(b1.toString()) * sortOrder;
            });

            return dataProvider.sort((a, b) => sortFunction(a, b, column, dataProvider));
        }
    );

    render() {
        const {
            dataProvider = [],
            columns = [],
            rowHeight = null,
            height = "auto",
            headerHeight = "auto",
            footerHeight = "auto",
            showFooter = false,
            placeholder = null,
        } = this.props;

        const headAndFootStyle = {
            gridTemplateColumns: `1fr ${P3DataGrid.scrollbarWidth || 17}px`,
        }

        const gridTemplateRows = [headerHeight, '1fr'];
        if (showFooter) {
            gridTemplateRows.push(footerHeight);
        }

        let list = dataProvider;
        // for single column sort
        // TODO :: multi column sort
        let sortedCol = columns.find(col => col.sortOrder && col.sortOrder !== SORT.NONE); // !!! - find() will not work in IE, so use polyfill.
        if (sortedCol) {
            list = this.sortDataProvider(dataProvider, sortedCol, sortedCol.sortOrder);
        }

        return (
            <div className="p3-data-grid" style={{ gridTemplateRows: gridTemplateRows.join(' '), height }}>

                <div className="p3-data-grid-header" style={headAndFootStyle}>
                    <P3Row
                        columns={columns}
                        dataProvider={dataProvider}
                        cell={P3HeadCell}
                        onCellClick={this.onColumnHeaderClick}
                        height={headerHeight} />
                </div>

                <div className="p3-data-grid-body">
                    {
                        list.map((data, key) =>
                            <P3Row
                                columns={columns}
                                data={data}
                                key={key}
                                dataProvider={dataProvider}
                                height={rowHeight}
                            />)
                    }
                </div>

                {
                    placeholder && <div className="p3-placeholder-overlay">
                        <div>{placeholder}</div>
                    </div>
                }

                {
                    showFooter && <div className='p3-data-grid-footer' style={headAndFootStyle}>
                        <P3Row
                            columns={columns}
                            dataProvider={dataProvider}
                            cell={P3FootCell}
                            height={headerHeight} />
                    </div>
                }
            </div>
        );
    }
}

class P3Row extends Component {

    render() {
        const {
            data,
            columns,
            dataProvider,
            cell: Cell = P3DataCell,
            height,
            onCellClick = null,
            className = null,
        } = this.props;
        const gridTemplateColumns = columns.map(col => col.width || '1fr').join(' ');

        const classNames = ["p3-row"];
        if (className) {
            classNames.push(className);
        }
        const rowStyle = { gridTemplateColumns };
        if (height) {
            rowStyle.gridAutoRows = height;
        }

        return (<div className={classNames.join(' ')} style={rowStyle}>
            {
                columns.map((col, i) => <Cell key={i} column={col} columns={columns} data={data} dataProvider={dataProvider} onClick={onCellClick} />)
            }
        </div>)
    }
}

const toCellValue = (value) => {

    const type = typeof value;
    let cellValue = null;
    switch (type) {
        case 'string':
        case 'number':
        case 'boolean':
            cellValue = value.toString();
            break;
        case 'object':
            cellValue = JSON.stringify(value);
            break;
        default:
        // we dont know how to render this 'value'. so, dont render it!
    }
    return cellValue;
}

class P3HeadCell extends Component {

    onClick = e => {
        const { column, columns, dataProvider, onClick } = this.props;
        onClick && onClick(column, columns, dataProvider);
    }

    render() {
        const { column, dataProvider } = this.props;
        const {
            titleRenderer: Renderer,
            title, titleFunction,
            allowSort = true,
            sortOrder = 0,
            allowFilter = true,
        } = column;

        let cell = null;
        if (Renderer) {
            cell = <Renderer column={column} dataProvider={dataProvider} />;
        } else if (titleFunction) {
            cell = titleFunction(column, dataProvider);
        } else {
            cell = toCellValue(title);
        }
        const hasControls = allowFilter || (allowSort && sortOrder);
        return (
            <div className="p3-cell p3-head-cell" onClick={this.onClick}>
                <div className="p3-head-title">
                    {cell}
                </div>
                {hasControls && (<div className="p3-head-cell-controls">
                    {sortOrder ? <span className="p3-sort-icon">{SORT_ICON[sortOrder]}</span> : null}
                    {allowFilter ? <span className="p3-search-icon" role="img" aria-label="search">🔍</span> : null}
                </div>)}
            </div>
        );
    }
}

class P3DataCell extends PureComponent {

    onClick = e => {
        this.props.onClick && this.props.onClick(this.props.data, this.props.column, this.props.dataProvider);
    }

    render() {
        const { data, column, dataProvider } = this.props;
        const { labelRenderer: Renderer, dataField, labelFunction } = column;

        let cell = null;
        if (Renderer) {
            cell = <Renderer data={data} column={column} dataProvider={dataProvider} />;
        } else if (labelFunction) {
            cell = labelFunction(data, column, dataProvider);
        } else {
            cell = toCellValue(data[dataField]);
        }
        return <div className='p3-cell p3-data-cell' onClick={this.onClick}>{cell}</div>;
    }
}

class P3FootCell extends PureComponent {

    render() {
        const { column, dataProvider } = this.props;
        const { footerRenderer: Renderer, footer, footerFunction } = column;

        let cell = null;
        if (Renderer) {
            cell = <Renderer column={column} dataProvider={dataProvider} />;
        } else if (footerFunction) {
            cell = footerFunction(column, dataProvider);
        } else {
            cell = toCellValue(footer);
        }
        return <div className="p3-cell p3-foot-cell">{cell}</div>;
    }
}
export default P3DataGrid;