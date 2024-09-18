import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import { CLAIMPAYMENT_TYPE_BHKS, CLAIMPAYMENT_TYPE_KYS, CLAIMPAYMENT_TYPE_PATIENT } from '../../Utils/Constants'

export default class ClaimpaymentparametersDelete extends Component {
  render() {
    const { Profile, Claimpaymentparameters, DeleteClaimpaymentparameters, handleDeletemodal, handleSelectedClaimpaymentparameter } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Claimpaymentparameters

    const Claimpaymenttypes = [
      { key: 1, text: t('Common.Claimpayments.Type.Patient'), value: CLAIMPAYMENT_TYPE_PATIENT },
      { key: 2, text: t('Common.Claimpayments.Type.Bhks'), value: CLAIMPAYMENT_TYPE_BHKS },
      { key: 3, text: t('Common.Claimpayments.Type.Kys'), value: CLAIMPAYMENT_TYPE_KYS },
    ]

    const type = Claimpaymenttypes.find(u => u.value === selected_record?.Type)?.text || t('Common.NoDataFound')

    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Claimpaymentparameters.Page.Header')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{type} </span>
              {t('Pages.Claimpaymentparameters.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedClaimpaymentparameter({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteClaimpaymentparameters(selected_record)
              handleDeletemodal(false)
              handleSelectedClaimpaymentparameter({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
