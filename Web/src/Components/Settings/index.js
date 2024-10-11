import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Grid, GridColumn, Icon, Modal } from 'semantic-ui-react'
import ColumnChooser from '../../Containers/Utils/ColumnChooser'
import ExcelImport from '../../Containers/Utils/ExcelImport'
import ExcelExport from '../../Containers/Utils/ExcelExport'
import { Pagedivider } from '../../Components'

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
        Additionalfunctiontxt,
        Additionalfunction,
    } = props

    const { roles, i18n } = Profile
    const t = i18n?.t
    const createRole = `${metaKey}add`
    const reportRole = `${metaKey}getreport`
    const manageviewRole = `${metaKey}manageview`

    const willshowcolumncreate = (roles || []).includes(createRole) || (roles || []).includes('admin')
    const willshowreport = (roles || []).includes(reportRole) || (roles || []).includes('admin')
    const willshowmanageview = (roles || []).includes(manageviewRole) || (roles || []).includes('admin')

    return (
        Profile.Ismobile ?
            <Modal open={modalOpen}
                onClose={() => { setmodalOpen(false) }}
                onOpen={() => { setmodalOpen(true) }}
                basic
                size='tiny'
                trigger={<Button className='h-fit !m-auto !bg-[#2355a0] !text-white' floated='right'>{t('Components.Setting.Label.Option')}</Button>} >
                <Modal.Content>
                    <div className='m-4 flex flex-col justify-center items-center w-full '>
                        <Grid stackable columns={1}>
                            <GridColumn stretched={Profile.Ismobile} width={8} >
                                {Showcreatebutton && willshowcolumncreate && <>
                                    <Link className="pr-1" to={Pagecreatelink}>
                                        <Button className='!bg-[#2355a0] !text-white' fluid={Profile.Ismobile} floated={`${Profile.Ismobile ? 'left' : 'right'}`} >
                                            {Pagecreateheader}
                                        </Button>
                                    </Link>
                                </>
                                }
                                {Showcolumnchooser && willshowmanageview && <>
                                    <Pagedivider />
                                    <ColumnChooser meta={Profile.tablemeta} columns={Columns} metaKey={metaKey} />
                                </>

                                }
                                {Showexcelimport && willshowreport && <>
                                    <Pagedivider />
                                    <ExcelImport columns={Columns} addData={AddRecord} />
                                </>
                                }
                                {Showexcelexport && willshowreport && <>
                                    <Pagedivider />
                                    <ExcelExport columns={Columns} data={list} name={metaKey} Config={initialConfig} />
                                </>
                                }
                                <Pagedivider />
                                <Button basic color='red' inverted onClick={() => { setmodalOpen(false) }}>
                                    <Icon name='remove' /> {t('Components.Setting.Label.Close')}
                                </Button>
                            </GridColumn>
                        </Grid>
                    </div>
                </Modal.Content>
            </Modal>
            : <GridColumn stretched={Profile.Ismobile} width={8} >
                {Additionalfunction && <Button className='!bg-[#2355a0] !text-white' floated='right' onClick={Additionalfunction} >{Additionalfunctiontxt}</Button>}
                {Showcreatebutton && willshowcolumncreate && <Link className="pr-1" to={Pagecreatelink}>
                    <Button className='!bg-[#2355a0] !text-white' fluid={Profile.Ismobile} floated={`${Profile.Ismobile ? '' : 'right'}`} >
                        {Pagecreateheader}
                    </Button>
                </Link>}
                {Showcolumnchooser && willshowmanageview && <ColumnChooser meta={Profile.tablemeta} columns={Columns} metaKey={metaKey} />}
                {Showexcelimport && willshowreport && <ExcelImport columns={Columns} addData={AddRecord} />}
                {Showexcelexport && willshowreport && <ExcelExport columns={Columns} data={list} name={metaKey} Config={initialConfig} />}
            </GridColumn>
    )
}
