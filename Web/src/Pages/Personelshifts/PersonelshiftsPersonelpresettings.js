import React, { useState } from "react"
import { Button, Label, Modal, Table } from "semantic-ui-react"
import Literals from "./Literals"

export default function PersonelshiftsPersonelpresettings({ selectedPersonelpresettings, Profile }) {

    const [open, setOpen] = useState(false)

    return (
        <div >
            {selectedPersonelpresettings.length > 0 && (
                <React.Fragment>
                    <Button className='!bg-[#2355a0] !text-white' floated='right' onClick={() => { setOpen(prev => !prev) }} >
                        {`${selectedPersonelpresettings.length} ${Literals.Columns.Amount[Profile.Language]} ${Literals.Messages.Foundedpersonelpresetting[Profile.Language]} `}
                    </Button>
                    <Modal
                        onClose={() => setOpen(false)}
                        onOpen={() => setOpen(true)}
                        open={open}
                    >
                        <Modal.Header>{Literals.Page.Pagepersoneloverviewheader[Profile.Language]}</Modal.Header>
                        <Modal.Content image>
                            <Table celled className='list-table ' key='product-create-type-conversion-table ' >
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell width={1}>{Literals.Columns.Floor[Profile.Language]}</Table.HeaderCell>
                                        <Table.HeaderCell width={1}>{Literals.Columns.Shiftdefine[Profile.Language]}</Table.HeaderCell>
                                        <Table.HeaderCell width={2}>{Literals.Columns.Ispersonelstay[Profile.Language]}</Table.HeaderCell>
                                        <Table.HeaderCell width={1}>{Literals.Columns.Minpersonelcount[Profile.Language]}</Table.HeaderCell>
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
                                                {`${column.Ispersonelstay ? Literals.Messages.Yes[Profile.Language] : Literals.Messages.No[Profile.Language]}`}
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
                                {Literals.Button.Close[Profile.Language]}
                            </Button>
                        </Modal.Actions>
                    </Modal>
                </React.Fragment>
            )}
        </div>
    )
}