import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class DepartmentsDelete extends Component {
  render() {
    const { Profile, Departments, DeleteDepartments, handleDeletemodal, handleSelectedDepartment } = this.props
    const t = Profile?.i18n?.t
    const { isDeletemodalopen, selected_record } = Departments
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Departments.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Departments.Delete.Label.DeleteCheck')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedDepartment({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteDepartments(selected_record)
              handleDeletemodal(false)
              handleSelectedDepartment({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
