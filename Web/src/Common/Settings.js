import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Grid, GridColumn, Icon, Modal } from 'semantic-ui-react'
import ColumnChooser from '../Containers/Utils/ColumnChooser'
import ExcelImport from '../Containers/Utils/ExcelImport'
import ExcelExport from '../Containers/Utils/ExcelExport'
import Pagedivider from './Styled/Pagedivider'

export default function Settings(props) {

    const [modalOpen, setmodalOpen] = useState(false)

    const {
        Profile,
        Pagecreateheader,
        Pagecreatelink,
        Columns,
        list,
        initialConfig,
        metaKey,
        AddRecord,
        Showcolumnchooser,
        Showexcelexport,
        Showexcelimport,
        Showcreatebutton,
    } = props

    const options = {
        en: 'Options',
        tr: 'Seçenekler'
    }

    const closebutton = {
        en: 'Close',
        tr: 'Kapat'
    }

    return (
        Profile.Ismobile ?
            <Modal open={modalOpen}
                onClose={() => { setmodalOpen(false) }}
                onOpen={() => { setmodalOpen(true) }}
                basic
                size='tiny'
                trigger={<div className='flex justify-center items-center'><Button className='h-fit' color='violet' floated='right'>{options[Profile.Language]}</Button></div>} >
                <Modal.Content>
                    <div className='m-4 flex flex-col justify-center items-center w-full '>
                        <Grid stackable columns={1}>
                            <GridColumn stretched={Profile.Ismobile} width={8} >
                                {Showcreatebutton && <>
                                    <Link className="pr-1" to={Pagecreatelink}>
                                        <Button fluid={Profile.Ismobile} color='blue' floated={`${Profile.Ismobile ? 'left' : 'right'}`} className='list-right-green-button'>
                                            {Pagecreateheader}
                                        </Button>
                                    </Link>
                                </>
                                }
                                {Showcolumnchooser && <>
                                    <Pagedivider />
                                    <ColumnChooser meta={Profile.tablemeta} columns={Columns} metaKey={metaKey} />
                                </>

                                }
                                {Showexcelimport && <>
                                    <Pagedivider />
                                    <ExcelImport columns={Columns} addData={AddRecord} />
                                </>
                                }
                                {Showexcelexport && <>
                                    <Pagedivider />
                                    <ExcelExport columns={Columns} data={list} name={metaKey} Config={initialConfig} />
                                </>
                                }
                                <Pagedivider />
                                <Button basic color='red' inverted onClick={() => { setmodalOpen(false) }}>
                                    <Icon name='remove' /> {closebutton[Profile.Language]}
                                </Button>
                            </GridColumn>
                        </Grid>
                    </div>
                </Modal.Content>
            </Modal>
            : <GridColumn stretched={Profile.Ismobile} width={8} >
                {Showcreatebutton && <Link className="pr-1" to={Pagecreatelink}>
                    <Button fluid={Profile.Ismobile} color='blue' floated={`${Profile.Ismobile ? '' : 'right'}`} className='list-right-green-button'>
                        {Pagecreateheader}
                    </Button>
                </Link>}
                {Showcolumnchooser && <ColumnChooser meta={Profile.tablemeta} columns={Columns} metaKey={metaKey} />}
                {Showexcelimport && <ExcelImport columns={Columns} addData={AddRecord} />}
                {Showexcelexport && <ExcelExport columns={Columns} data={list} name={metaKey} Config={initialConfig} />}
            </GridColumn>
    )
}
