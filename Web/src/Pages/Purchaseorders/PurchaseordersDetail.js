import React, { useEffect, useState } from 'react'
import Literals from './Literals'
import { Formatdate } from '..//../Utils/Formatdate'
import validator from '../../Utils/Validator'
import { Button, Card, Dimmer, Icon, Label, Loader, Modal } from 'semantic-ui-react'
import { DELIVERY_TYPE_PATIENT, DELIVERY_TYPE_WAREHOUSE, PURCHASEORDER_MOVEMENTTYPES_APPROVE, PURCHASEORDER_MOVEMENTTYPES_CANCELAPPROVE, PURCHASEORDER_MOVEMENTTYPES_CANCELCHECK, PURCHASEORDER_MOVEMENTTYPES_CHECK, PURCHASEORDER_MOVEMENTTYPES_COMPLETE, PURCHASEORDER_MOVEMENTTYPES_CREATE, PURCHASEORDER_MOVEMENTTYPES_DELETE, PURCHASEORDER_MOVEMENTTYPES_UPDATE, ROUTES } from '../../Utils/Constants'
import axios from 'axios'
import config from '../../Config'

export default function PurchaseordersDetail(props) {
  const {
    Profile,
    Purchaseorders,
    handleDetailmodal,
    handleSelectedPurchaseorder,
    fillPurchaseordernotification,
    GetUsers,
    GetFiles,
    GetStocks,
    GetUsagetypes,
    GetStockdefines,
    GetWarehouses,
    GetUnits,
    GetPatientdefines,
    GetPatients,
    GetCases,
    GetDepartments,
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
    Departments
  } = props
  const { isDetailmodalopen, selected_record } = Purchaseorders
  const [fileDownloading, setfileDownloading] = useState(false)

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
    Departments.isLoading ||
    fileDownloading

  const {
    Uuid,
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

  useEffect(() => {
    if (isDetailmodalopen && !Users.isLoading) {
      GetUsers()
      GetFiles()
      GetStocks()
      GetUsagetypes()
      GetUnits()
      GetStockdefines()
      GetWarehouses()
      GetPatientdefines()
      GetPatients()
      GetCases()
      GetDepartments()
    }
  }, [isDetailmodalopen])

  const Notfound = Literals.Messages.Notfound[Profile.Language]

  const stocks = (Stocks.list || []).filter(u => u.WarehouseID === selected_record?.Uuid).map(element => {
    return {
      ...element,
      key: Math.random(),
      Skt: validator.isISODate(element.Skt) ? Formatdate(element.Skt) : element.Skt
    }
  });
  const files = (Files.list || []).filter(u => u.ParentID === Uuid).map(element => {
    return {
      ...element,
      key: Math.random(),
      Usagetype: ((element?.Usagetype || '').split(',') || []).map(u => {
        return (Usagetypes.list || []).find(type => type.Uuid === u)?.Name
      })
    }
  });

  const patient = (Patients.list || []).find(u => u.Uuid === DeliverypatientID)
  const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)

  const revieveruser = (Users.list || []).find(u => u.Uuid === ReceiveruserID)

  const downloadFile = (fileID, fileName, Profile) => {
    setfileDownloading(true)
    axios.get(`${config.services.File}${ROUTES.FILE}/Downloadfile/${fileID}`, {
      responseType: 'blob'
    }).then((res) => {
      setfileDownloading(false)
      const fileType = res.headers['content-type']
      const blob = new Blob([res.data], {
        type: fileType
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      if (fileType.includes('pdf')) {
        window.open(url)
        a.href = null;
        window.URL.revokeObjectURL(url);
      }
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    }).catch((err) => {
      setfileDownloading(false)
      fillPurchaseordernotification([{ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: err.message }])
      console.log(err.message)
    });
  }

  const Movementtypes = [
    { name: Literals.Columns.Createduser[Profile.Language], value: PURCHASEORDER_MOVEMENTTYPES_CREATE },
    { name: Literals.Columns.Updateduser[Profile.Language], value: PURCHASEORDER_MOVEMENTTYPES_UPDATE },
    { name: Literals.Columns.Checkeduser[Profile.Language], value: PURCHASEORDER_MOVEMENTTYPES_CHECK },
    { name: Literals.Columns.Approveduser[Profile.Language], value: PURCHASEORDER_MOVEMENTTYPES_APPROVE },
    { name: Literals.Columns.Completeduser[Profile.Language], value: PURCHASEORDER_MOVEMENTTYPES_COMPLETE },
    { name: Literals.Columns.Cancelcheckeduser[Profile.Language], value: PURCHASEORDER_MOVEMENTTYPES_CANCELCHECK },
    { name: Literals.Columns.Cancelapproveduser[Profile.Language], value: PURCHASEORDER_MOVEMENTTYPES_CANCELAPPROVE },
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

  const CaseOption = (Cases.list || []).filter(u => u.Isactive).map(casedata => {
    const departmentuuids = (casedata?.Departmentuuids || []).map(u => u.DepartmentID);
    let isHavepatients = false
    departmentuuids.forEach(departmentuuid => {
      const department = (Departments.list || []).find(u => u.Uuid === departmentuuid)
      if (department?.Ishavepatients === true || department?.Ishavepatients === 1) {
        isHavepatients = true
      }
    });
    return isHavepatients === false && casedata?.CaseStatus === 0 ? { key: casedata.Uuid, text: casedata.Name, value: casedata.Uuid } : false
  }).filter(u => u)

  return (
    <Modal
      onClose={() => handleDetailmodal(false)}
      onOpen={() => handleDetailmodal(true)}
      open={isDetailmodalopen}
    >
      <Modal.Header>{Literals.Page.Pagedetailheadermodal[Profile.Language]}</Modal.Header>
      <Modal.Content image>
        {isLoadingstatus
          ? <Dimmer active inverted>
            <Loader inverted />
          </Dimmer>
          : <Card fluid>
            <Card.Content className='flex w-full justify-between items-center'>
              <Card.Header>{`${Literals.Columns.Purchaseno[Profile.Language]} ${Purchaseno}`}</Card.Header>
              <Card.Header>
                {`${Literals.Columns.Company[Profile.Language]}${Company} `}
              </Card.Header>
            </Card.Content>
            <Card.Meta className='mx-2'>
              {`${Literals.Columns.Receiveruser[Profile.Language]}:${revieveruser?.Name || Notfound} ${revieveruser?.Surname || Notfound} `}
              {`${Literals.Columns.Delivereruser[Profile.Language]}:${Delivereruser || Notfound} `}
            </Card.Meta>
            <Card.Content>
              <Card.Description className='w-full flex flex-row justify-between items-top gap-2'>
                <div className='w-full'>
                  <Card fluid>
                    <Card.Content>
                      <Card.Header>{Literals.Columns.Stocks[Profile.Language]}</Card.Header>
                      <Card.Meta>{`${(stocks || []).length} ${Literals.Columns.Stocksprefix[Profile.Language]}`}</Card.Meta>
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
                      <Card.Header>{Literals.Columns.Files[Profile.Language]}</Card.Header>
                      <Card.Meta>{`${(files || []).length} ${Literals.Columns.Filesprefix[Profile.Language]}`}</Card.Meta>
                      <Card.Description>
                        <div className='w-full gap-2 justify-start items-start flex flex-col'>
                          {files.map(file => {
                            return <div className='cursor-pointer flex flex-row' onClick={() => { downloadFile(file.Uuid, file.Name, Profile) }}>
                              <p>{`${file?.Name || Notfound} (${file?.Usagetype || Notfound})`}</p> <Icon color='blue' name='download' />
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
                    {`${Literals.Columns.Deliverywarehouse[Profile.Language]} : ${(Warehouses.list || []).find(u => u.Uuid === DeliverywarehouseID)?.Name || Notfound}`}
                  </Label>
                </Card.Meta>
                : null}
              {Deliverytype === DELIVERY_TYPE_PATIENT ?
                <Card.Meta>
                  <Label basic ribbon>
                    {`${Literals.Columns.Deliverypatient[Profile.Language]} : ${patientdefine?.Firstname || Notfound} ${patientdefine?.Lastname || Notfound} (${patientdefine?.CountryID || Notfound})`}
                  </Label>
                </Card.Meta>
                : null}
            </Card.Content>
            <Card.Content extra>
              <Label basic ribbon>
                {`${Literals.Columns.Case[Profile.Language]} : ${(Cases.list || []).find(u => u.Uuid === CaseID)?.Name || Notfound}`}
              </Label>
            </Card.Content>
            <Card.Content extra>
              <Label basic ribbon>
                {`${Literals.Columns.Price[Profile.Language]} : ${Price || Notfound} TL`}
              </Label>
            </Card.Content>
            {DecoratedMovements.map((movement, index) => {
              return <Card.Content key={index} extra>
                <Icon name='user' />
                {` ${movement.label} ${movement.user}`}
                {`- ${Literals.Columns.Date[Profile.Language]} ${Formatdate(movement.value)}`}
                {`- ${movement.info}`}
              </Card.Content>
            })}
          </Card>
        }
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => {
          handleDetailmodal(false)
          handleSelectedPurchaseorder({})
        }}>
          {Literals.Button.Goback[Profile.Language]}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}
