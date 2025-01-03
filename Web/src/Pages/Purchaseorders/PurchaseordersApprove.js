import React, { useEffect, useState } from 'react'
import { Formatdate } from '..//../Utils/Formatdate'
import validator from '../../Utils/Validator'
import { Button, Card, Dropdown, Form, Label, Modal } from 'semantic-ui-react'
import { DELIVERY_TYPE_PATIENT, DELIVERY_TYPE_WAREHOUSE, } from '../../Utils/Constants'
import { Contentwrapper, PurchaseorderDetailCard } from '../../Components'

export default function PurchaseordersApprove(props) {

  const {
    Profile,
    Purchaseorders,
    ApprovePurchaseorders,
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
    Departments,
    open,
    setOpen,
    record,
    setRecord
  } = props

  const [selectedcase, setSelectedcase] = useState(null)
  const [selectedinfo, setSelectedinfo] = useState(null)

  const t = Profile?.i18n?.t

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
    Uuid,
    Company,
    Delivereruser,
    ReceiveruserID,
    Deliverytype,
    DeliverypatientID,
    DeliverywarehouseID,
    Price,
    CaseID,
  } = record || {}

  useEffect(() => {
    if (open && !Users.isLoading) {
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
  }, [open])

  const stocks = (Stocks.list || []).filter(u => u.WarehouseID === record?.Uuid && u.Isactive).map(element => {
    return {
      ...element,
      key: Math.random(),
      Skt: validator.isISODate(element.Skt) ? Formatdate(element.Skt) : element.Skt
    }
  });

  const files = (Files.list || []).filter(u => u.Isactive && u.ParentID === Uuid).map(element => {
    return {
      ...element,
      key: Math.random(),
      Usagetype: ((element?.Usagetype || '').split(',') || []).map(u => {
        return (Usagetypes.list || []).find(type => type.Uuid === u)?.Name
      })
    }
  });

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

  const checkIsvalid = () => {
    let errors = []

    if (!validator.isString(Company)) {
      errors.push(t('Pages.Purchaseorder.Messages.CompanyRequired'))
    }
    if (!validator.isArray(stocks)) {
      errors.push(t('Pages.Purchaseorder.Messages.StocksRequired'))
    }
    if (!validator.isArray(files)) {
      errors.push(t('Pages.Purchaseorder.Messages.FilesRequired'))
    }
    if (!validator.isUUID(CaseID)) {
      errors.push(t('Pages.Purchaseorder.Messages.CaseRequired'))
    }
    if (!validator.isUUID(ReceiveruserID)) {
      errors.push(t('Pages.Purchaseorder.Messages.RecieveruserRequired'))
    }
    if (!validator.isString(Delivereruser)) {
      errors.push(t('Pages.Purchaseorder.Messages.DeliveryuserRequired'))
    }
    if (!validator.isNumber(Price) || Price === 0) {
      errors.push(t('Pages.Purchaseorder.Messages.PriceRequired'))
    }
    if (!validator.isNumber(Deliverytype)) {
      errors.push(t('Pages.Purchaseorder.Messages.DeliverytypeRequired'))
    } else {
      if (Deliverytype === DELIVERY_TYPE_PATIENT) {
        if (!validator.isUUID(DeliverypatientID)) {
          errors.push(t('Pages.Purchaseorder.Messages.DeliverytypeRequired'))
        }
      }
      if (Deliverytype === DELIVERY_TYPE_WAREHOUSE) {
        if (!validator.isUUID(DeliverywarehouseID)) {
          errors.push(t('Pages.Purchaseorder.Messages.WarehouseidRequired'))
        }
      }
    }

    return errors
  }

  return (
    <Modal
      onClose={() => {
        setSelectedcase(null)
        setSelectedinfo(null)
        setOpen(false)
        setRecord(null)
      }}
      onOpen={() => {
        setSelectedcase(null)
        setSelectedinfo(null)
        setOpen(true)
      }}
      open={open}
    >
      <Modal.Header> {t('Pages.Purchaseorder.Page.ApproveHeaderModal')}</Modal.Header>
      <PurchaseorderDetailCard
        record={record}
        Purchaseorders={Purchaseorders}
        Users={Users}
        Files={Files}
        Stocks={Stocks}
        Usagetypes={Usagetypes}
        Stockdefines={Stockdefines}
        Units={Units}
        Warehouses={Warehouses}
        Patients={Patients}
        Patientdefines={Patientdefines}
        Cases={Cases}
        Departments={Departments}
        fillnotification={fillPurchaseordernotification}
        files={files}
        stocks={stocks}
        Profile={Profile}
      />
      {checkIsvalid().length > 0 ?
        <Card.Content>
          <Card.Description>
            <Label className='w-full' basic color='red'>
              {checkIsvalid().join(',')}
            </Label>
          </Card.Description>
        </Card.Content>
        : <Modal.Content>
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                <Form.Field>
                  <label
                    className='text-[#000000de]'>
                    {t('Pages.Purchaseorder.Label.Case')}
                  </label>
                  <Dropdown
                    value={selectedcase}
                    clearable
                    search
                    fluid
                    selection
                    options={CaseOption}
                    onChange={(e, data) => { setSelectedcase(data.value) }}
                  />
                </Form.Field>
                <Form.Input
                  label={t('Pages.Purchaseorder.Label.Info')}
                  value={selectedinfo || ''}
                  onChange={(e) => { setSelectedinfo(e.target.value) }}
                  fluid
                />
              </Form.Group>
            </Form>
          </Contentwrapper>
        </Modal.Content>}
      <Modal.Actions>
        <Button color='black' onClick={() => {
          setOpen(false)
          setRecord(null)
        }}>
          {t('Common.Button.Giveup')}
        </Button>
        {checkIsvalid().length === 0 && !isLoadingstatus ?
          <Button
            loading={Purchaseorders.isLoading}
            content={t('Common.Button.Approve')}
            labelPosition='right'
            icon='checkmark'
            className=' !bg-[#2355a0] !text-white'
            onClick={() => {
              let errors = []
              if (!validator.isUUID(selectedcase)) {
                errors.push({ type: 'Error', code: t('Pages.Purchaseorder.Page.Header'), description: t('Pages.Purchaseorder.Messages.CaseRequired') })
              }
              if (errors.length > 0) {
                errors.forEach(error => {
                  fillPurchaseordernotification(error)
                })
              } else {
                
                const {
                  Uuid,
                  Purchaseno
                } = record || {}

                ApprovePurchaseorders({
                  Uuid,
                  Purchaseno,
                  CaseID: selectedcase,
                  Approveinfo: selectedinfo
                })
                setOpen(false)
                setRecord(null)
              }
            }}
            positive
          /> : null}
      </Modal.Actions>
    </Modal>
  )
}
