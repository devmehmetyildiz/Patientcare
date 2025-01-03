import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default function StockmovementsApprove(props) {

  const { Profile, Stockmovements, ApproveStockmovements, Stockdefines, Stocks, open, setOpen, record, setRecord } = props

  const t = Profile?.i18n?.t

  const stock = (Stocks.list || []).find(u => u.Uuid === record?.StockID)
  const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <Modal.Header>{t('Pages.Stockmovements.Page.ApproveHeader')}</Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          <p>
            <span className='font-bold'>{stockdefine?.Name} </span>
            {t('Pages.Stockmovements.Approve.Label.Check')}
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
          loading={Stockmovements.isLoading}
          content={t('Common.Button.Approve')}
          labelPosition='right'
          icon='checkmark'
          onClick={() => {
            ApproveStockmovements(record)
            setOpen(false)
            setRecord(null)
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}