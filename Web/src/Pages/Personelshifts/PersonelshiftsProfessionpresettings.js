

import React, { useState } from "react"
import { Button, Modal, Table } from "semantic-ui-react"

export default function PersonelshiftsProfessionpresettings(props) {

    const { selectedProfessionpresettings, Floors, Shiftdefines, Profile } = props

    const [open, setOpen] = useState(false)

    const t = Profile?.i18n?.t

    return (
        <div>
            {selectedProfessionpresettings.length > 0 && (
                <React.Fragment>
                    <Button className='!bg-[#2355a0] !text-white' floated='right' onClick={() => { setOpen(prev => !prev) }} >
                        {`${selectedProfessionpresettings.length} ${t('Pages.Personelshifts.Column.Amount')} ${t('Pages.Personelshifts.Messages.Foundedprofessionpresetting')} `}
                    </Button>
                    <Modal
                        onClose={() => setOpen(false)}
                        onOpen={() => setOpen(true)}
                        open={open}
                    >
                        <Modal.Header>{t('Pages.Personelshifts.Page.ProfessionPreSettingHeader')}</Modal.Header>
                        <Modal.Content image>
                            <Table celled className='list-table ' key='product-create-type-conversion-table ' >
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell width={1}>{t('Pages.Personelshifts.Column.Floor')}</Table.HeaderCell>
                                        <Table.HeaderCell width={1}>{t('Pages.Personelshifts.Column.Shiftdefine')}</Table.HeaderCell>
                                        <Table.HeaderCell width={2}>{t('Pages.Personelshifts.Column.Ispersonelstay')}</Table.HeaderCell>
                                        <Table.HeaderCell width={1}>{t('Pages.Personelshifts.Column.Minpersonelcount')}</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {selectedProfessionpresettings.length > 0 && selectedProfessionpresettings.map(column => {
                                        return <Table.Row key={Math.random()}>
                                            <Table.Cell className='table-last-section'>
                                                {`${(Floors.list || []).find(u => u.Uuid === column?.FloorID)?.Name || ''}`}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {`${(Shiftdefines.list || []).find(u => u.Uuid === column?.ShiftdefineID)?.Name || ''}`}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {`${column.Ispersonelstay ? t('Common.Yes') : t('Common.No')}`}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {`${column.Minpersonelcount}`}
                                            </Table.Cell>
                                        </Table.Row>
                                    })}
                                </Table.Body>
                            </Table>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color='black' onClick={() => {
                                setOpen(false)
                            }}>
                                {t('Common.Button.Close')}
                            </Button>
                        </Modal.Actions>
                    </Modal>
                </React.Fragment>
            )}
        </div>
    )
}