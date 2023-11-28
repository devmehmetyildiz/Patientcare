import React, { useEffect } from 'react'
import { useMemo } from 'react'
import { useColumnOrder, useExpanded, useFilters, useGroupBy, usePagination, useRowSelect, useSortBy, useTable } from "react-table"
import { Icon, Pagination, Select, Popup, } from 'semantic-ui-react'
import "../Common/Table.css"

function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
}) {
    const count = preFilteredRows.length

    return (
        <Popup
            trigger={<Icon name='filter' className={filterValue !== undefined ? 'text-info' : null} />}
            on='click'
            basic
            position='bottom center'
            style={{ height: 'auto', width: 'auto' }
            } >
            <div>
                <strong>Filtreler</strong>
                <input
                    value={filterValue || ''}
                    autoFocus
                    className='form-control'
                    onChange={e => { setFilter(e.target.value || undefined) }}
                    placeholder={`Search ${count} records...`}
                />
            </div>
        </Popup>
    )
}


export const DataTable = ({ Columns, Data, Config, renderRowSubComponent }) => {
    const columns = useMemo(() => {
        const data = (Columns || [])
            .map(u => {
                return (Object.keys(u).find(u => u === 'visible')) ? (u.visible ? u : null) : u
            })
            .filter(u => u)
        return data
    }, [Columns])

    const data = useMemo(() => Data, [Data])

    const pageSizes = [
        { key: '15', value: 15, text: '15' },
        { key: '20', value: 20, text: '20' },
        { key: '30', value: 30, text: '30' },
        { key: '45', value: 45, text: '45' },
    ]

    const defaultColumn = React.useMemo(
        () => ({
            Filter: DefaultColumnFilter,
        }),
        []
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        visibleColumns,
        setPageSize,
        setAllFilters,
        setHiddenColumns,
        setColumnOrder,
        state: {
            pageIndex,
            pageSize,
            filters,
            hiddenColumns: tableHiddenColumns,
            columnOrder: tableOrderColumns,
        },
    } = useTable(
        {
            columns,
            data,
            initialState: { ...Config, pageSize: 15 },
            defaultColumn,
        },
        useFilters,
        useColumnOrder,
        useGroupBy,
        useSortBy,
        useExpanded,
        usePagination,
        useRowSelect
    )


    useEffect(() => {
        if (Config?.hiddenColumns) {
            let isEqual = true
            if (tableHiddenColumns?.length > 0 && Config?.hiddenColumns?.length > 0) {
                for (let index = 0; index < tableHiddenColumns.length - 1; index++) {
                    if (tableHiddenColumns[index] !== Config.hiddenColumns[index]) {
                        isEqual = false
                    }
                }
                if (!isEqual) {
                    setHiddenColumns(Config.hiddenColumns)
                }
            }
        }
    }, [Config?.hiddenColumns])

    useEffect(() => {
        if (Config?.columnOrder) {
            let isEqual = true
            if (tableOrderColumns?.length > 0 && Config?.columnOrder?.length > 0) {
                for (let index = 0; index < tableOrderColumns.length - 1; index++) {
                    if (tableOrderColumns[index] !== Config.columnOrder[index]) {
                        isEqual = false
                    }
                }
                if (!isEqual) {
                    setColumnOrder(Config.columnOrder)
                }
            }
        }
    }, [Config?.columnOrder])

    return (
        <div className='react-table-container'>
            <div className='react-table-box max-h[calc(100vh-13.4rem)]'>
                {
                    filters.length > 0 ?
                        <div className='react-table-filter'>
                            <span className='header'><Icon name='filter' /> Filters</span>
                            <React.Fragment>
                                {filters.filter(filter => ((Array.isArray(filter.value) && filter.value.length > 0) || filter.value)).map(filter => (
                                    Array.isArray(filter.value) && filter.value.length > 0 ?
                                        filter.value.map((subItem, index) => (
                                            <span key={`${filter.id}-${index}`} className='item'>
                                                <span>{columns.find(column => column.accessor === filter.id) ? columns.find(column => column.accessor === filter.id).Header : filter.id}:</span>
                                                {subItem}
                                                <Icon name='times circle'
                                                    onClick={() => {
                                                        let decoratedFilters = Object.assign([], filters)
                                                        let findFilter = decoratedFilters.find(innerFilter => innerFilter.id === filter.id)
                                                        if (findFilter) {
                                                            findFilter.value = findFilter.value.filter(innerFilter => innerFilter !== subItem)
                                                            decoratedFilters = findFilter.value.length > 0 ? decoratedFilters : decoratedFilters.filter(innerFilter => innerFilter.id !== filter.id)
                                                            setAllFilters(decoratedFilters)
                                                        }
                                                    }} className='remove-item' />
                                            </span>))
                                        :
                                        <span key={filter.id} className='item'>
                                            <span>{columns.find(column => column.accessor === filter.id) ? columns.find(column => column.accessor === filter.id).Header : filter.id}:</span>
                                            {filter.value}
                                            <Icon name='times circle'
                                                onClick={() => { setAllFilters(filters.filter(innerFilter => innerFilter.id !== filter.id)) }} className='remove-item' />
                                        </span>
                                ))}
                                <span onClick={() => setAllFilters([])} className='clear-all-filters'>Temizle</span>
                            </React.Fragment>
                        </div>
                        : null
                }
                <div className='react-table-inner'>
                    <table className='react-table' {...getTableProps()}>
                        <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => {
                                        const foundedColumn = columns.find(u => u.accessor === column.id);
                                        return <th {...column.getHeaderProps()} style={column.newWidht && { width: column.newWidht }}>
                                            <div className='react-table-header-column'>
                                                {
                                                    foundedColumn?.sortable ?
                                                        <div className='react-table-header-sort' {...column.getSortByToggleProps()} title={column.isSorted ? column.isSortedDesc ? "Azalan" : "Artan" : "Sırala"}>
                                                            {column.render('Header')}
                                                            {column.isSorted
                                                                ? column.isSortedDesc
                                                                    ? <Icon name='sort down' />
                                                                    : <Icon name='sort up' />
                                                                : <Icon name='sort' />}
                                                        </div>
                                                        : column.render('Header')
                                                }
                                                {foundedColumn?.canGroupBy ? <div className='react-table-header-group-by'>
                                                    <span {...column.getGroupByToggleProps()}>
                                                        {column.isGrouped ? <Icon name='thumbtack' className='active' /> : <Icon name='thumbtack' />}
                                                    </span>
                                                </div> : null}
                                                {!column.filterDisable ? (foundedColumn?.canFilter) ? <div className='react-table-header-filter'>{column.render('Filter')}</div> : null : null}
                                            </div>
                                        </th>
                                    }
                                    )}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {page.map(row => {
                                prepareRow(row)
                                return (
                                    <React.Fragment key={`rw-${row.id}`}>
                                        <tr {...row.getRowProps()} style={{ backgroundColor: row.original?.Case ? row.original.Case?.Casecolor : null }} >
                                            {row.cells.map(cell => {
                                                return (
                                                    <td  {...cell.getCellProps({ className: cell.column.className })}>
                                                        {cell.isGrouped ? (
                                                            // If it's a grouped cell, add an expander and row count
                                                            <React.Fragment>
                                                                <span {...row.getToggleRowExpandedProps()}>
                                                                    {row.isExpanded ? <Icon className='text-info' name='minus' /> : <Icon className='text-info' name='plus' />}
                                                                </span>{' '}
                                                                {cell.render('Cell', { editable: false })} (
                                                                {row.subRows.length})
                                                            </React.Fragment>
                                                        ) : cell.isAggregated ? (
                                                            // If the cell is aggregated, use the Aggregated
                                                            // renderer for cell
                                                            cell.render('Aggregated')
                                                        ) : cell.isPlaceholder ? null : ( // For cells with repeated values, render null
                                                            // Otherwise, just render the regular cell
                                                            cell.render('Cell', { editable: true })
                                                        )}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                        {row.isExpanded && renderRowSubComponent ? (
                                            <tr>
                                                <td colSpan={visibleColumns.length}>
                                                    {/*
                          Inside it, call our renderRowSubComponent function. In reality,
                          you could pass whatever you want as props to
                          a component like this, including the entire
                          table instance. But for this example, we'll just
                          pass the row
                        */}
                                                    {renderRowSubComponent({ row })}
                                                </td>
                                            </tr>
                                        ) : null}
                                    </React.Fragment>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            {
                pageOptions.length > 1 ?
                    <div className='flex flex-row justify-between items-center w-full p-2'>
                        <Select className='ml-2' placeholder='Set Page Size' value={pageSize} onChange={(e, data) => { setPageSize(data.value) }} options={pageSizes} />
                        <div className="pagination">
                            <Pagination
                                className='row-pagination'
                                activePage={pageIndex + 1}
                                boundaryRange={2}
                                onPageChange={(e, { activePage }) => { gotoPage(activePage - 1) }}
                                siblingRange={2}
                                totalPages={pageCount}
                                ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
                                firstItem={canPreviousPage ? { content: <Icon name='angle double left' />, icon: true } : null}
                                lastItem={canNextPage ? { content: <Icon name='angle double right' />, icon: true } : null}
                                prevItem={canPreviousPage ? { content: <Icon name='angle left' />, icon: true } : null}
                                nextItem={canNextPage ? { content: <Icon name='angle right' />, icon: true } : null}
                                size='small'
                                pointing
                                secondary
                            />
                        </div>
                        <div className='mr-2'>
                            <p>Page {pageIndex + 1} of {pageOptions.length}</p>
                        </div>
                    </div>
                    : null
            }
        </div >
    )
}
export default DataTable