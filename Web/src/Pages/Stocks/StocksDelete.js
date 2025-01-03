import React from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default function StocksDelete(props) {
  const { Profile, Stocks, DeleteStocks, Stockdefines, open, setOpen, record, setRecord } = props

  const t = Profile?.i18n?.t

  const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === record?.StockdefineID)

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <Modal.Header>{t('Pages.Stocks.Page.DeleteHeader')}</Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          <p>
            <span className='font-bold'>{stockdefine?.Name} </span>
            {t('Pages.Stocks.Delete.Label.Check')}
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
          loading={Stocks.isLoading}
          content={t('Common.Button.Delete')}
          labelPosition='right'
          icon='checkmark'
          onClick={() => {
            DeleteStocks(record)
            setOpen(false)
            setRecord(null)
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}


