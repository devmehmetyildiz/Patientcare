import React, { useEffect, useState } from 'react'
import { Button, Grid, Icon, Modal } from 'semantic-ui-react'

export default function MobileTable(props) {

    const { Columns, Data, Config, Profile } = props

    const [modalOpen, setmodalOpen] = useState(false)


    useEffect(() => {

    }, [])

    const closebutton = {
        en: 'Close',
        tr: 'Kapat'
    }

    return (
        <React.Fragment>
            <div className='flex flex-col justify-center items-center w-full'>
                {(Data || []).map((rowData, index) => {

                    let headertext = (Columns || []).find(u => u.Firstheader)?.accessor
                    let subheadertext = (Columns || []).find(u => u.Subheader)?.accessor
                    let finaltext = (Columns || []).find(u => u.Finalheader)?.accessor

                    let headerData = ((Columns || []).find(u => u.Firstheader && !u.dontuseCell)?.Cell) ? (Columns || []).find(u => u.Firstheader)?.Cell({ value: rowData[headertext] }) : rowData[headertext]
                    let subheaderData = ((Columns || []).find(u => u.Subheader && !u.dontuseCell)?.Cell) ? (Columns || []).find(u => u.Subheader)?.Cell({ value: rowData[subheadertext] }) : rowData[subheadertext]
                    let finalheaderData = ((Columns || []).find(u => u.Finalheader && !u.dontuseCell)?.Cell) ? (Columns || []).find(u => u.Finalheader)?.Cell({ value: rowData[finaltext] }) : rowData[finaltext]

                    let columns = [];
                    (Columns || []).forEach(u => {
                        if (!(Config.hiddenColumns || []).includes(u.accessor)) {
                            columns.push(u)
                        }
                    })
                    return <Modal
                        onClose={() => { setmodalOpen({ ...modalOpen, [index]: false }) }}
                        onOpen={() => { setmodalOpen({ ...modalOpen, [index]: true }) }}
                        open={modalOpen[index]}
                        key={index}
                        size='large'
                        trigger={
                            <div key={index} className='hover:shadow-gray-700 transition-all ease-in-out duration-200 cursor-pointer flex flex-row justify-center items-center rounded-xl  m-2 px-4 py-2 shadow-xl shadow-gray-500 w-full bg-white'>
                                <div>{rowData.Id}</div>
                                <div className='flex flex-col justify-center items-center w-full'>
                                    <div className='font-bold'>{headertext && headerData}</div>
                                    <div>{subheadertext && subheaderData}</div>
                                </div>
                                <div>{finaltext && finalheaderData}</div>
                            </div>
                        }
                    >
                        <div className='m-4 overflow-y-auto overflow-x-hidden max-h-[80vh]'>
                            <Grid columns={2} className='p-4' divided>
                                {(columns || []).map(u => {
                                    return <Grid.Row key={Math.random()} divided>
                                        <Grid.Column>
                                            {u.Header}
                                        </Grid.Column>
                                        <Grid.Column>
                                            {(u.Cell && !u.dontuseCell) ? u.Cell({ value: rowData[u.accessor] }) : rowData[u.accessor]}
                                        </Grid.Column>
                                    </Grid.Row>
                                })}
                                <Grid.Row divided className='w-full'>
                                    <Grid.Column></Grid.Column>
                                    <Grid.Column>
                                        <Button color='red' floated='right' onClick={() => { setmodalOpen({ ...modalOpen, [index]: false }) }}>
                                            <Icon name='remove' /> {closebutton[Profile.Language]}
                                        </Button>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </div>
                    </Modal>
                })}
            </div>
        </React.Fragment >
    )
}
