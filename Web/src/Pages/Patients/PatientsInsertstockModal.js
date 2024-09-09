import React, { useEffect, useState } from 'react'
import { Button, Confirm, Icon, Input, Label, List, Modal, Step, Table, Transition } from 'semantic-ui-react'
import { STOCK_TYPE_PATIENT, STOCK_TYPE_WAREHOUSE } from '../../Utils/Constants'
import validator from '../../Utils/Validator'
import Formatdate from '../../Utils/Formatdate'

export default function PatientsInsertstockModal(props) {
    const {
        isPatientspage,
        isPatientdetailpage,
        open,
        setOpen,
        record,
        setRecord,
        Profile,
        fillPatientnotification,
        Patientdefines,
        Stocks,
        Stockmovements,
        Stocktypes,
        Stockdefines,
        Stocktypegroups,
        Warehouses,
        Units,
        GetPatientdefines,
        GetPatients,
        GetPatient,
        GetUnits,
        GetStocks,
        GetStockmovements,
        GetStocktypes,
        GetStockdefines,
        GetStocktypegroups,
        GetWarehouses,
        CreateStockFromStock
    } = props

    const t = Profile?.i18n?.t || null
    const [active, setActive] = useState(null)
    const [selectedStocks, setselectedStocks] = useState([])
    const [confirm, setConfirm] = useState(false)

    useEffect(() => {
        if (open) {
            GetPatientdefines()
            GetStocks()
            GetUnits()
            GetStockmovements()
            GetStocktypes()
            GetStocktypegroups()
            GetWarehouses()
            GetStockdefines()
            setActive(null)
            setselectedStocks([])
            setConfirm(false)
        }
    }, [open])

    const patient = record
    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)

    const Stocktypegroupoption = (Stocktypegroups.list || []).filter(u => u.Isactive).map(group => {
        const stocktypes = (group.Stocktypes || '').split(',').filter(u => validator.isUUID(u)).map(u => (Stocktypes.list || []).find(type => type.Uuid === u)?.Name).join(',')
        const stocktypeids = (group.Stocktypes || '').split(',').filter(u => validator.isUUID(u)).map(u => (Stocktypes.list || []).find(type => type.Uuid === u)?.Uuid)
        return {
            key: group?.Uuid,
            title: group?.Name,
            description: stocktypes,
            stocktypeids: stocktypeids
        }
    })

    const Decoratedstocks = (Stocks.list || []).filter(u => u.Isactive && u.Isapproved && u.Type === STOCK_TYPE_WAREHOUSE).map(stock => {
        const warehouse = (Warehouses.list || []).find(u => u.Uuid === stock?.WarehouseID)
        const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
        const stocktype = (Stocktypes.list || []).find(u => u.Uuid === stockdefine?.StocktypeID)
        const unit = (Units.list || []).find(u => u.Uuid === stockdefine?.UnitID)
        let amount = 0.0;
        let fullamount = 0.0;
        let movements = (Stockmovements.list || []).filter(u => u.StockID === stock?.Uuid && u.Isactive)
        movements.forEach(movement => {
            if (movement?.Isapproved) {
                amount += (movement.Amount * movement.Movementtype);
            }
            fullamount += (movement.Amount * movement.Movementtype);
        });

        const isHaveskt = stocktype?.Issktneed
        const isBarcodeneed = stocktype?.Isbarcodeneed

        const Name = [
            `${stockdefine?.Name || t('Common.NoDataFound')}`,
            `${isBarcodeneed ? `(${stockdefine?.Barcode})` : ''}`,
            `${isHaveskt ? ` - Skt : ${Formatdate(stock?.Skt, true)}` : ''}`,
        ]

        const Amounttxt = `${amount}${amount !== fullamount ? `( ${t('Pages.Patients.PatientsInsertstockModal.Label.Full')} ${fullamount})` : ''} ${unit?.Name}`

        return {
            Name: Name.join(''),
            Uuid: stock?.Uuid,
            Warehousename: warehouse?.Name,
            Stocktypename: stocktype?.Name,
            StockdefineID: stockdefine?.Uuid,
            StocktypeID: stocktype?.Uuid,
            WarehouseID: warehouse?.Uuid,
            Unit: unit?.Uuid,
            Amount: amount,
            Amounttxt: Amounttxt,
            Fullamount: fullamount,
        }
    }).sort((a, b) => {
        return (a.StocktypeID || '').localeCompare((b.StocktypeID || ''), undefined, {
            numeric: true,
            sensitivity: 'base'
        })
    })

    return open
        ? <React.Fragment>
            <Modal
                centered={false}
                size='large'
                onClose={() => {
                    setOpen(false)
                    setRecord(null)
                }}
                onOpen={() => {
                    setOpen(true)
                }}
                open={open}
            >
                <Modal.Header>{`${t('Pages.Patients.PatientsInsertstockModal.Page.Header')} - ${patientdefine?.Firstname} ${patientdefine?.Lastname} (${patientdefine?.CountryID})`}</Modal.Header>
                <Step.Group widths={1} vertical>
                    {Stocktypegroupoption.map(group => {
                        const groupstocks = selectedStocks.filter(u => u.StockgrouptypeID === group?.key)
                        return <div key={group.key} className='w-full p-2 shadow-2 shadow-[#c9c9c9dd]'>
                            <Step onClick={() => setActive(active === group.key ? null : group.key)} active={active === group.key} link >
                                <Icon name='sitemap' />
                                <Step.Content>
                                    <Step.Title>{`${group.title} ${(groupstocks || []).length > 0 ? `(${groupstocks.length})` : ''}`}</Step.Title>
                                    <Step.Description >{group.description}</Step.Description>
                                </Step.Content>
                            </Step>
                            {active === group.key ?
                                <Transition transitionOnMount
                                    animation='fade down' duration={500}>
                                    <div className='w-full p-4'>
                                        <Table color='blue' celled className='overflow-x-auto'  >
                                            <Table.Header >
                                                <Table.Row>
                                                    <Table.HeaderCell width={2}>{t('Pages.Patients.PatientsInsertstockModal.Label.Warehouse')}</Table.HeaderCell>
                                                    <Table.HeaderCell width={3}>{t('Pages.Patients.PatientsInsertstockModal.Label.Stocktype')}</Table.HeaderCell>
                                                    <Table.HeaderCell>{t('Pages.Patients.PatientsInsertstockModal.Label.Stockname')}</Table.HeaderCell>
                                                    <Table.HeaderCell width={2}>{t('Pages.Patients.PatientsInsertstockModal.Label.Amount')}</Table.HeaderCell>
                                                    <Table.HeaderCell width={2}>{t('Pages.Patients.PatientsInsertstockModal.Label.Requestamount')}</Table.HeaderCell>
                                                </Table.Row>
                                            </Table.Header>
                                            <Table.Body>
                                                {(Decoratedstocks || []).filter(u => (group?.stocktypeids || []).includes(u.StocktypeID)).map((stock, index) => {
                                                    return <Table.Row key={index}>
                                                        <Table.Cell>
                                                            <Label>
                                                                {stock?.Warehousename}
                                                            </Label>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <Label>
                                                                {stock?.Stocktypename}
                                                            </Label>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {stock?.Name}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {stock?.Amounttxt}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <Input
                                                                fluid
                                                                type='number'
                                                                min={0}
                                                                max={stock?.Amount || 0}
                                                                value={selectedStocks.find(u => u.Uuid === stock?.Uuid)?.Value || 0}
                                                                onChange={(e) => {
                                                                    setselectedStocks(prev => [
                                                                        ...prev.filter(u => u.Uuid !== stock?.Uuid),
                                                                        { Uuid: stock?.Uuid, Value: e?.target?.value || 0 }
                                                                    ])
                                                                }}
                                                            />
                                                        </Table.Cell>
                                                    </Table.Row>
                                                })}
                                            </Table.Body>
                                        </Table >
                                    </div>
                                </Transition> : null}
                        </div>
                    })}
                </Step.Group>

                <Modal.Actions>
                    <Button color='black' onClick={() => {
                        setOpen(false)
                        setRecord(null)
                    }}>
                        {t('Common.Button.Goback')}
                    </Button>
                    <Button
                        content={t('Common.Button.Update')}
                        labelPosition='right'
                        className='!bg-[#2355a0] !text-white'
                        icon='checkmark'
                        onClick={() => {
                            let errors = []
                            if (selectedStocks.filter(u => u.Value > 0).length <= 0) {
                                errors.push({ type: 'Error', code: t('Pages.Patients.PatientsInsertstockModal.Page.Header'), description: t('Pages.Patients.PatientsInsertstockModal.Messages.StocksRequired') })
                            }

                            if (errors.length > 0) {
                                errors.forEach(error => {
                                    fillPatientnotification(error)
                                })
                            } else {
                                setConfirm(true)
                            }
                        }}
                        positive
                    />
                </Modal.Actions>
            </Modal>
            <Confirm
                cancelButton={t('Common.Button.Giveup')}
                confirmButton={t('Common.Button.Update')}
                content={<div className='m-4 flex flex-col justify-start items-center gap-4'>
                    <div>{t('Pages.Patients.PatientsInsertstockModal.Messages.Confirm')}</div>
                    <List>
                        {selectedStocks.filter(u => u.Value > 0).map((selectedstock, index) => {
                            const stock = (Stocks.list || []).find(u => u.Uuid == selectedstock?.Uuid)
                            const stockdefine = (Stockdefines.list || []).find(u => u.Uuid == stock?.StockdefineID)
                            const unit = (Units.list || []).find(u => u.Uuid == stockdefine?.UnitID)
                            return <List.Item key={index}>
                                <List.Icon name='chevron circle right' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>{`${stockdefine?.Name} ${selectedstock?.Value} ${unit?.Name}`}</List.Header>
                                </List.Content>
                            </List.Item>
                        })}
                    </List>
                </div>}
                open={confirm}
                onCancel={() => { setConfirm(false) }}
                onConfirm={() => {
                    let body = {
                        data: {
                            ParentID: patient?.Uuid,
                            Stocks: selectedStocks.filter(u => u.Value > 0),
                            Type: STOCK_TYPE_PATIENT
                        },
                        onSuccess: () => {
                            if (isPatientspage) {
                                GetPatients()
                            }
                            if (isPatientdetailpage) {
                                GetPatient(patient?.Uuid)
                            }
                            setOpen(false)
                            setRecord(null)
                        }
                    }
                    CreateStockFromStock(body)
                }}
            />
        </React.Fragment>
        : null
}
