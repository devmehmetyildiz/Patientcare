import React, { useEffect, useState } from 'react'
import { Button, Dropdown, Form, Modal } from 'semantic-ui-react'
import { Contentwrapper } from '../../Components'
import validator from '../../Utils/Validator'

export default function PurchaseordersCancelCheck(props) {

  const { Profile, Purchaseorders, CancelApprovePurchaseorders, fillPurchaseordernotification, open, setOpen, record, setRecord } = props
  const { GetDepartments, GetCases, Departments, Cases } = props

  const [selectedcase, setSelectedcase] = useState(null)
  const [selectedinfo, setSelectedinfo] = useState(null)

  const t = Profile?.i18n?.t

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

  useEffect(() => {
    if (open) {
      GetCases()
      GetDepartments()
    }
  }, [open])

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <Modal.Header>{t('Pages.Purchaseorder.Page.CancelApproveHeaderModal')}</Modal.Header>
      <Modal.Content>
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
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => {
          setOpen(false)
          setRecord(null)
        }}>
          {t('Common.Button.Giveup')}
        </Button>
        <Button
          loading={Purchaseorders.isLoading}
          content={t('Common.Button.CancelApprove')}
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
              CancelApprovePurchaseorders({
                Uuid,
                Purchaseno,
                Cancelapproveinfo: selectedinfo,
                CaseID: selectedcase
              })
              setOpen(false)
              setRecord(null)
            }
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}