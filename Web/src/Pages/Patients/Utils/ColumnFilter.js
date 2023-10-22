import React from "react";

export const ColumnFilter = ({ column }) => {
    const { fşkterValue, setFilter } = column
    return (
        <span>
            Search : {''}
            <input vlaue={filter || ''} onChange={(e) => { Setfilter(e.target.value) }} />
        </span>
    )
}