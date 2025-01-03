import React, { useContext, useState } from 'react'
import { Card, Dimmer, Feed, Icon, Label, Loader, Modal, Transition } from 'semantic-ui-react'
import {
    DELIVERY_TYPE_PATIENT, DELIVERY_TYPE_WAREHOUSE, PURCHASEORDER_MOVEMENTTYPES_APPROVE,
    PURCHASEORDER_MOVEMENTTYPES_CANCELAPPROVE, PURCHASEORDER_MOVEMENTTYPES_CANCELCHECK,
    PURCHASEORDER_MOVEMENTTYPES_CHECK, PURCHASEORDER_MOVEMENTTYPES_COMPLETE,
    PURCHASEORDER_MOVEMENTTYPES_CREATE, PURCHASEORDER_MOVEMENTTYPES_UPDATE
} from '../../Utils/Constants'
import Formatdate from '../../Utils/Formatdate'
import { FormContext } from '../../Provider/FormProvider'
import { Link } from 'react-router-dom'
import Filepreview from '../Filepreview'

export default function PurchaseorderDetailCard(props) {

    const {
        usecontext,
        record,
        PAGE_NAME,
        Users,
        Files,
        Stocks,
        Usagetypes,
        Stockdefines,
        Units,
        Warehouses,
        Patients,
        Patientdefines,
        Cases,
        Departments,
        fillnotification,
        files,
        stocks,
        Profile
    } = props

    const t = Profile?.i18n?.t

    const context = useContext(FormContext)

    const selected_record = usecontext ? context.getForm(PAGE_NAME) : record

    const [movementsOpen, setMovementsOpen] = useState(false)
    const [selectedfile, setSelectedfile] = useState(null)

    const isLoadingstatus =
        Users.isLoading ||
        Files.isLoading ||
        Stocks.isLoading ||
        Usagetypes.isLoading ||
        Stockdefines.isLoading ||
        Units.isLoading ||
        Warehouses.isLoading ||
        Patients.isLoading ||
        Patientdefines.isLoading ||
        Cases.isLoading ||
        Departments.isLoading

    const {
        Purchaseno,
        Company,
        Delivereruser,
        ReceiveruserID,
        Deliverytype,
        DeliverypatientID,
        DeliverywarehouseID,
        Price,
        CaseID,
        Movements
    } = selected_record

    const Notfound = t('Common.NoDataFound')

    const patient = (Patients.list || []).find(u => u.Uuid === DeliverypatientID)
    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)

    const revieveruser = (Users.list || []).find(u => u.Uuid === ReceiveruserID)

    const Movementtypes = [
        { name: t('Pages.PurchaseorderDetailCard.Label.Createduser'), value: PURCHASEORDER_MOVEMENTTYPES_CREATE },
        { name: t('Pages.PurchaseorderDetailCard.Label.Updateduser'), value: PURCHASEORDER_MOVEMENTTYPES_UPDATE },
        { name: t('Pages.PurchaseorderDetailCard.Label.Checkeduser'), value: PURCHASEORDER_MOVEMENTTYPES_CHECK },
        { name: t('Pages.PurchaseorderDetailCard.Label.Approveduser'), value: PURCHASEORDER_MOVEMENTTYPES_APPROVE },
        { name: t('Pages.PurchaseorderDetailCard.Label.Completeduser'), value: PURCHASEORDER_MOVEMENTTYPES_COMPLETE },
        { name: t('Pages.PurchaseorderDetailCard.Label.Cancelcheckeduser'), value: PURCHASEORDER_MOVEMENTTYPES_CANCELCHECK },
        { name: t('Pages.PurchaseorderDetailCard.Label.Cancelapproveduser'), value: PURCHASEORDER_MOVEMENTTYPES_CANCELAPPROVE },
    ]

    const DecoratedMovements = ((Movements || []).map(movement => {
        const user = (Users.list || []).find(u => u.Uuid === movement?.UserID)
        const username = `${user?.Name || Notfound} ${user?.Surname || Notfound}`
        const type = Movementtypes.find(u => u.value === movement?.Type)?.name || Notfound

        return {
            label: type,
            user: username,
            value: movement?.Occureddate,
            info: movement?.Info
        }
    }))

    return (
        <Modal.Content image>
            <Filepreview
                fileurl={selectedfile}
                setFileurl={setSelectedfile}
                Profile={Profile}
                fillnotification={fillnotification}
            />
            {isLoadingstatus
                ? <Dimmer active inverted>
                    <Loader inverted />
                </Dimmer>
                : <Card fluid>
                    <Card.Content className='flex w-full justify-between items-center'>
                        <Card.Header>{`${t('Pages.PurchaseorderDetailCard.Label.Purchaseno')} ${Purchaseno}`}</Card.Header>
                        <Card.Header>
                            {`${t('Pages.PurchaseorderDetailCard.Label.Company')}${Company} `}
                        </Card.Header>
                    </Card.Content>
                    <Card.Meta className='mx-2'>
                        {`${t('Pages.PurchaseorderDetailCard.Label.Receiveruser')}:${revieveruser?.Name || Notfound} ${revieveruser?.Surname || Notfound} `}
                        {`${t('Pages.PurchaseorderDetailCard.Label.Delivereruser')}:${Delivereruser || Notfound} `}
                    </Card.Meta>
                    <Card.Content>
                        <Card.Description className='w-full flex flex-row justify-between items-top gap-2'>
                            <div className='w-full'>
                                <Card fluid>
                                    <Card.Content>
                                        <Card.Header>{t('Pages.PurchaseorderDetailCard.Label.Stocks')}</Card.Header>
                                        <Card.Meta>{`${(stocks || []).length} ${t('Pages.PurchaseorderDetailCard.Label.Stocksprefix')}`}</Card.Meta>
                                        <Card.Description>
                                            {stocks.map(stock => {
                                                const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
                                                const unit = (Units.list || []).find(u => u.Uuid === stockdefine?.UnitID)
                                                return `${stock?.Amount || Notfound} ${unit?.Name || Notfound} ${stockdefine?.Name || Notfound}`
                                            }).join(',')}
                                        </Card.Description>
                                    </Card.Content>
                                </Card>
                            </div>
                            <div className='w-full'>
                                <Card fluid>
                                    <Card.Content>
                                        <Card.Header>{t('Pages.PurchaseorderDetailCard.Label.Files')}</Card.Header>
                                        <Card.Meta>{`${(files || []).length} ${t('Pages.PurchaseorderDetailCard.Label.Filesprefix')}`}</Card.Meta>
                                        <Card.Description>
                                            <div className='w-full gap-2 justify-start items-start flex flex-col'>
                                                {files.map((file, index) => {
                                                    return <div key={index} className='cursor-pointer flex flex-row'
                                                        onClick={() => {
                                                            if (!usecontext) {
                                                                setSelectedfile(file?.Uuid)
                                                            }
                                                        }}
                                                    >
                                                        <p>{`${file?.Name || Notfound} (${file?.Usagetype || Notfound})`}</p> {!usecontext ? <Icon color='blue' name='download' /> : null}
                                                    </div>
                                                })}
                                            </div>
                                        </Card.Description>
                                    </Card.Content>
                                </Card>
                            </div>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        {Deliverytype === DELIVERY_TYPE_WAREHOUSE ?
                            <Card.Meta>
                                <Label basic ribbon>
                                    {`${t('Pages.PurchaseorderDetailCard.Label.Deliverywarehouse')} : ${(Warehouses.list || []).find(u => u.Uuid === DeliverywarehouseID)?.Name || Notfound}`}
                                </Label>
                            </Card.Meta>
                            : null}
                        {Deliverytype === DELIVERY_TYPE_PATIENT ?
                            <Card.Meta>
                                <Label basic ribbon>
                                    {`${t('Pages.PurchaseorderDetailCard.Label.Deliverypatient')} : ${patientdefine?.Firstname || Notfound} ${patientdefine?.Lastname || Notfound} (${patientdefine?.CountryID || Notfound})`}
                                </Label>
                            </Card.Meta>
                            : null}
                    </Card.Content>
                    <Card.Content extra>
                        <Label basic ribbon>
                            {`${t('Pages.PurchaseorderDetailCard.Label.Case')} : ${(Cases.list || []).find(u => u.Uuid === CaseID)?.Name || Notfound}`}
                        </Label>
                    </Card.Content>
                    <Card.Content extra>
                        <Label basic ribbon>
                            {`${t('Pages.PurchaseorderDetailCard.Label.Price')} : ${Price || Notfound} TL`}
                        </Label>
                    </Card.Content>
                    <Card fluid >
                        <Card.Content onClick={() => { setMovementsOpen(prev => !prev) }} className='w-full flex flex-row justify-between items-center cursor-pointer'>
                            <Card.Header>{t('Pages.Preregistrations.DetailCard.Label.Movements')}</Card.Header>
                            <Card.Header className='w-full flex justify-end items-end'>
                                <div >
                                    {movementsOpen ? <Icon name='angle up' /> : <Icon name='angle down' />}
                                </div>
                            </Card.Header>
                        </Card.Content>
                        <Transition visible={movementsOpen} animation='slide down' duration={500}>
                            <Card.Content>
                                {DecoratedMovements.map((movement, index) => {
                                    return <Feed key={index}>
                                        <Feed.Event>
                                            <Feed.Label icon="user" />
                                            <Feed.Content>
                                                <Feed.Date content={Formatdate(movement.value)} />
                                                <Feed.Summary>
                                                    {movement.label} - <Link to={`Users/${movement.userID}/edit`}>{movement.user}</Link>-
                                                    {movement.info}
                                                </Feed.Summary>
                                            </Feed.Content>
                                        </Feed.Event>
                                    </Feed>
                                })}
                            </Card.Content>
                        </Transition>
                    </Card>
                </Card>
            }
        </Modal.Content>
    )
}
