import React, { useState } from "react"
import { Button, Modal, Table } from "semantic-ui-react"

export default function PersonelshiftsPersonelpresettings(props) {

    const { selectedPersonelpresettings, Profile } = props

    const [open, setOpen] = useState(false)

    const t = Profile?.i18n?.t

    return (
        <div >
            {selectedPersonelpresettings.length > 0 && (
                <React.Fragment>
                    <Button className='!bg-[#2355a0] !text-white' floated='right' onClick={() => { setOpen(prev => !prev) }} >
                        {`${selectedPersonelpresettings.length} ${t('Pages.Personelshifts.Column.Amount')} ${t('Pages.Personelshifts.Messages.Foundedpersonelpresetting')} `}
                    </Button>
                    <Modal
                        onClose={() => setOpen(false)}
                        onOpen={() => setOpen(true)}
                        open={open}
                    >
                        <Modal.Header>{t('Pages.Personelshifts.Page.PersonelPreSettingHeader')}</Modal.Header>
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
                                    {selectedPersonelpresettings.length > 0 && selectedPersonelpresettings.map(column => {
                                        return <Table.Row key={Math.random()}>
                                            <Table.Cell className='table-last-section'>
                                            </Table.Cell>
                                            <Table.Cell>
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