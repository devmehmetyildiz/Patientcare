import React from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default function PurchaseordersDelete(props) {

  const { Profile, Purchaseorders, DeletePurchaseorders, open, setOpen, record, setRecord } = props

  const t = Profile?.i18n?.t

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <Modal.Header>{t('Pages.Purchaseorder.Page.DeleteHeader')}</Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          <p>
            <span className='font-bold'>{record?.Purchaseno} </span>
            {t('Pages.Purchaseorder.Messages.Deletecheck')}
          </p>
        </Modal.Description>
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
          content={t('Common.Button.Delete')}
          labelPosition='right'
          icon='checkmark'
          className=' !bg-[#2355a0] !text-white'
          onClick={() => {
            DeletePurchaseorders(record)
            setOpen(false)
            setRecord(null)
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}