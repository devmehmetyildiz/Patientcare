import React, { useEffect, useState } from 'react'
import { Button, Confirm, Icon, Input, Modal, Tab, Table } from 'semantic-ui-react'
import Formatdate from '../../../Utils/Formatdate'
import validator from '../../../Utils/Validator'

export default function PatientsDetailStocks(props) {

    const { Stocks, Stockdefines, Units, Stockmovements, Stocktypegroups, Stocktypes, patient, Profile, AddStockmovements, GetPatient, fillPatientnotification } = props

    const t = Profile?.i18n?.t

    const PatientStocks = (Stocks.list || []).filter(u => u.WarehouseID === patient?.Uuid)

    const List = (PatientStocks || []).map(item => {

        const stocktype = (Stocktypes.list || []).find(u => u.Uuid === item?.StocktypeID)
        const stocktypegroup = (Stocktypegroups.list || []).find(u => u.Uuid === item?.StockgrouptypeID)
        const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === item?.StockdefineID)
        const unit = (Units.list || []).find(u => u.Uuid === stockdefine?.UnitID)
        let amount = 0.0;
        let fullamount = 0.0;
        let movements = (Stockmovements.list || []).filter(u => u.StockID === item?.Uuid && u.Isactive)
        movements.forEach(movement => {
            if (movement?.Isapproved) {
                amount += (movement.Amount * movement.Movementtype);
            }
            fullamount += (movement.Amount * movement.Movementtype);
        });

        return {
            Uuid: item?.Uuid,
            stockdefine: stockdefine,
            stocktype: stocktype,
            stocktypegroup: stocktypegroup,
            amount: `${amount} ${unit?.Name || 'tanımsız birim'} ${amount !== fullamount ? `( Toplam ${fullamount} ${unit?.Name || 'tanımsız birim'})` : ''}`,
            skt: item?.Skt || null,
            unit: unit
        }
    })

    const stocktypegroups = [...new Set(List.map(u => u.stocktypegroup?.Uuid))].map(typegroup => {
        return (Stocktypegroups.list || []).find(u => u.Uuid === typegroup)
    })

    return (
        <div className='w-full px-4 mt-4'>
            <div className='py-4 px-4 bg-white shadow-lg w-full font-poppins rounded-lg flex flex-col gap-4 justify-center items-center   min-w-[250px]'>
                <div className='w-full flex justify-start items-start'>
                    <div className='font-bold text-xl font-poppins'> {t('Pages.Patients.PatientsDetail.PatientDetailStocks.Header')}</div>
                </div>
                <div className='w-full flex justify-cente items-center flex-col'>
                    {(List || []).length > 0
                        ? <div className='w-full'>
                            <Tab
                                className="w-full !bg-transparent"
                                panes={
                                    stocktypegroups.map((typegroup, index) => {
                                        const filteredList = (List.filter(item => item?.stocktypegroup?.Uuid === typegroup?.Uuid) || [])
                                        let isHaveskt = false
                                        filteredList.forEach(item => {
                                            if (!isHaveskt && item?.stocktype?.Issktneed === true || 1) {
                                                isHaveskt = true
                                            }
                                        });

                                        return {
                                            menuItem: `${typegroup?.Name} (${filteredList.length})`,
                                            pane: {
                                                key: index,
                                                content: <Table key={index}>
                                                    <Table.Header>
                                                        <Table.Row>
                                                            <Table.HeaderCell>{t('Pages.Patients.PatientsDetail.PatientDetailStocks.Label.Name')}</Table.HeaderCell>
                                                            {isHaveskt ? <Table.HeaderCell>{t('Pages.Patients.PatientsDetail.PatientDetailStocks.Label.Skt')}</Table.HeaderCell> : null}
                                                            <Table.HeaderCell>{t('Pages.Patients.PatientsDetail.PatientDetailStocks.Label.Stocktype')}</Table.HeaderCell>
                                                            <Table.HeaderCell>{t('Pages.Patients.PatientsDetail.PatientDetailStocks.Label.Amount')}</Table.HeaderCell>
                                                            <Table.HeaderCell>{t('Pages.Patients.PatientsDetail.PatientDetailStocks.Label.Use')}</Table.HeaderCell>
                                                        </Table.Row>
                                                    </Table.Header>
                                                    <Table.Body>
                                                        {(filteredList || []).length > 0
                                                            ? filteredList.map((stock, i) => {
                                                                const { stockdefine, stocktype, unit } = stock
                                                                const name = stockdefine?.Name || t('Common.NoDataFound')
                                                                return <Table.Row key={i}>
                                                                    <Table.Cell>
                                                                        {`${name}${stocktype?.Isbarcodeneed ? ` (${stockdefine?.Barcode})` : ''}`}
                                                                    </Table.Cell>
                                                                    {isHaveskt
                                                                        ? <Table.Cell>
                                                                            {stock?.skt ? Formatdate(stock?.skt, true) : '-'}
                                                                        </Table.Cell>
                                                                        : null}
                                                                    <Table.Cell>
                                                                        {stocktype?.Name || t('Common.NoDataFound')}
                                                                    </Table.Cell>
                                                                    <Table.Cell>
                                                                        {`${stock?.amount}`}
                                                                    </Table.Cell>
                                                                    <Table.Cell>
                                                                        <PatientsDetailStocksReduceModal
                                                                            Profile={Profile}
                                                                            AddStockmovements={AddStockmovements}
                                                                            Stockmovements={Stockmovements}
                                                                            stock={stock}
                                                                            GetPatient={GetPatient}
                                                                            patient={patient}
                                                                            fillPatientnotification={fillPatientnotification}
                                                                        />
                                                                    </Table.Cell>
                                                                </Table.Row>
                                                            })
                                                            : <Table.Row>
                                                                <Table.Cell>
                                                                    <div className='font-bold font-poppins'>{t('Common.NoDataFound')}</div>
                                                                </Table.Cell>
                                                            </Table.Row>}
                                                    </Table.Body>
                                                </Table>
                                            }
                                        }
                                    })
                                }
                                renderActiveOnly={false}
                            />
                        </div>
                        : <div className='font-bold font-poppins'>{t('Common.NoDataFound')}</div>}
                </div>
            </div>
        </div>
    )
}



function PatientsDetailStocksReduceModal(props) {

    const {
        Profile,
        stock,
        Stockmovements,
        AddStockmovements,
        GetPatient,
        patient,
        fillPatientnotification
    } = props

    const t = Profile?.i18n?.t
    const [open, setOpen] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [requestamount, setRequestamount] = useState(1)

    useEffect(() => {
        if (open) {
            setRequestamount(0)
        }
    }, [open])


    const stockdefine = stock?.stockdefine

    let amount = 0.0;
    let fullamount = 0.0;
    let movements = (Stockmovements.list || []).filter(u => u.StockID === stock?.Uuid && u.Isactive)
    movements.forEach(movement => {
        if (movement?.Isapproved) {
            amount += (movement.Amount * movement.Movementtype);
        }
        fullamount += (movement.Amount * movement.Movementtype);
    });

    return (<React.Fragment>
        <div
            className='cursor-pointer'
            onClick={() => { setOpen(true) }}
        >
            <Icon className='text-[#2355a0]' name='object ungroup' />
        </div>
        <Modal
            onClose={() => {
                setOpen(false)
            }}
            onOpen={() => {
                setOpen(true)
            }}
            open={open}
        >
            <Modal.Header>{`${t('Pages.Patients.PatientsDetail.PatientDetailStocks.ReduceHeader')}`}</Modal.Header>
            <Modal.Content>
                {`${stockdefine?.Name} ${t('Pages.Patients.PatientsDetail.PatientDetailStocks.Label.Stockprefix')}`}
            </Modal.Content>
            <Modal.Content>
                <Input
                    label={t('Pages.Patients.PatientsDetail.PatientDetailStocks.Label.Amount')}
                    fluid
                    min={0}
                    max={amount}
                    value={requestamount}
                    onChange={(e) => { setRequestamount(Number(e?.target?.value)) }}
                    type='number'
                />
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={() => {
                    setOpen(false)
                }}>
                    {t('Common.Button.Goback')}
                </Button>
                <Button
                    content={t('Common.Button.Update')}
                    labelPosition='right'
                    className='!bg-[#2355a0] !text-white'
                    icon='checkmark'
                    onClick={() => {
                        if (!validator.isNumber(requestamount) && requestamount > 0) {
                            fillPatientnotification(
                                { type: 'Error', code: t('Pages.Patients.PatientsDetail.PatientDetailStocks.ReduceHeader'), description: t('Pages.Patients.PatientsDetail.PatientDetailStocks.Messages.AmountRequired') }
                            )
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
            content={`${requestamount} ${t('Pages.Patients.PatientsDetail.PatientDetailStocks.Messages.ReduceConfirm')}`}
            open={confirm}
            onCancel={() => { setConfirm(false) }}
            onConfirm={() => {
                let body = {
                    data: {
                        StockID: stock?.Uuid,
                        Movementtype: -1,
                        Amount: requestamount,
                        Movementdate: new Date(),
                    },
                    onSuccess: () => {
                        GetPatient(patient?.Uuid)
                        setOpen(false)
                    }
                }
                AddStockmovements(body)
            }}
        />
    </React.Fragment>
    )
}
