import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default function StockmovementsDelete(props) {

  const { Profile, Stockmovements, Stocks, Stockdefines, DeleteStockmovements, open, setOpen, record, setRecord } = props

  const t = Profile?.i18n?.t

  const stock = (Stocks.list || []).find(u => u.Uuid === record?.StockID)
  const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <Modal.Header>{t('Pages.Stockmovements.Page.DeleteHeader')}</Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          <p>
            <span className='font-bold'>{stockdefine?.Name} </span>
            {t('Pages.Stockmovements.Delete.Label.Check')}
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
          content={t('Common.Button.Delete')}
          labelPosition='right'
          icon='checkmark'
          onClick={() => {
            DeleteStockmovements(record)
            setOpen(false)
            setRecord(null)
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}
