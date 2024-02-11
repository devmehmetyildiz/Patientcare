import React, { useEffect, useState } from 'react'
import { Button, Grid, Icon, Label, LabelDetail, Modal } from 'semantic-ui-react'
import { Pagedivider } from '../../Components'
import validator from '../../Utils/Validator'

export default function MobileTable(props) {

    const { Columns, Data, Config, Profile } = props

    const [modalOpen, setmodalOpen] = useState(false)


    useEffect(() => {

    }, [])

    const closebutton = {
        en: 'Close',
        tr: 'Kapat'
    }

    const getCellvalue = (row, col) => {
        let headerValue = null
        if (typeof col?.accessor === 'function') {
            if (col?.Cell) {
                headerValue = col.Cell(null, row)
            } else {
                headerValue = col.accessor(row)
            }
        }
        else if (typeof col?.accessor === 'string') {
            let isHave = (Columns || []).find(u => u.accessor === col.accessor);
            if (isHave) {
                headerValue = row[col.accessor]
            }
        }
        return headerValue
    }

    const getHeader = (row) => {
        const col = (Columns || []).find(u => u.Title)
        return col?.Withtext ? `${col?.Header} ${getCellvalue(row, col)}` : getCellvalue(row, col)
    }
    const getSubheader = (row) => {
        const col = (Columns || []).find(u => u.Subtitle)
        return col?.Withtext ? `${col?.Header} ${getCellvalue(row, col)}` : getCellvalue(row, col)
    }
    const getFinalheader = (row) => {
        const colcount = (Columns || []).filter(u => u.Lowtitle)
        if (colcount <= 1) {
            const col = (Columns || []).find(u => u.Lowtitle)
            return col?.Withtext ? <Label color='blue' basic image>{col?.Header}<LabelDetail>{getCellvalue(row, col)}</LabelDetail></Label> : <Label>{getCellvalue(row, col)}</Label>
        } else {
            const cols = (Columns || []).filter(u => u.Lowtitle)
            return <>
                {cols.map(col => {
                    return col?.Withtext ? <Label color='blue' basic image>{col?.Header}<LabelDetail>{getCellvalue(row, col)}</LabelDetail></Label> : <Label>{getCellvalue(row, col)}</Label>
                })}
            </>
        }
    }

    const getTrigger = (row, index) => {
        let headerData = getHeader(row)
        let subheaderData = getSubheader(row)
        let finalheaderData = getFinalheader(row)
        return <div
            key={index}
            className='gap-2 hover:shadow-gray-700 transition-all ease-in-out duration-200 cursor-pointer flex flex-col justify-start items-start rounded-xl  m-2 px-4 py-2 shadow-xl shadow-gray-500 w-full bg-white'>
            <div className='flex w-full flex-row justify-between items-center'>
                <div className='font-bold'>{headerData && headerData}</div>
                <div>{subheaderData && subheaderData}</div>
            </div>
            {finalheaderData && finalheaderData}
        </div>
    }

    return (
        <React.Fragment>
            <div className='flex flex-col justify-center items-center w-full'>
                {(Data || []).map((rowData, index) => {
                    let columns = [];
                    (Columns || []).forEach(u => {
                        if (!(Config.hiddenColumns || []).includes(validator.isString(u.accessor) ? u.accessor : u.accessorvalue)) {
                            columns.push(u)
                        }
                    })
                    return <Modal
                        onClose={() => { setmodalOpen({ ...modalOpen, [index]: false }) }}
                        onOpen={() => { setmodalOpen({ ...modalOpen, [index]: true }) }}
                        trigger={getTrigger(rowData, index)}
                        open={modalOpen[index]}
                        key={Math.random}
                        size='large'
                    >
                        <Modal.Header>{getHeader(rowData)}</Modal.Header>
                        <Modal.Content image>
                            <div className='overflow-y-auto overflow-x-hidden max-h-[80vh]'>
                                <div className='p-8 flex flex-col justify-start items-start gap-4'>
                                    {(columns || []).map(u => {
                                        return u?.disableProps
                                            ? <div className='w-full' key={Math.random()}>
                                                <Label className='w-full !flex flex-row justify-between items-center' basic color='blue'>
                                                    <span>{u.Header}:</span>
                                                    <Label.Detail className='!opacity-100'>
                                                        <Button basic color='blue'>{getCellvalue(rowData, u)}</Button>
                                                    </Label.Detail>
                                                </Label>
                                            </div>
                                            : <div className='w-full' key={Math.random()} >
                                                <Label className='w-full !flex flex-row justify-between items-center' basic color='blue'>
                                                    <span>{u.Header}:</span>
                                                    <Label.Detail className='!opacity-100'>
                                                        {getCellvalue(rowData, u)}
                                                    </Label.Detail>
                                                </Label>
                                            </div>
                                    })}
                                </div>
                            </div>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color='black' onClick={() => { setmodalOpen({ ...modalOpen, [index]: false }) }}>
                                {closebutton[Profile.Language]}
                            </Button>
                        </Modal.Actions>
                    </Modal>
                })}
            </div>
        </React.Fragment >
    )
}
