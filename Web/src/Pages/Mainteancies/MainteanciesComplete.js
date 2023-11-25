import React, { useState } from 'react'
import { Button, Form, Modal } from 'semantic-ui-react'
import Literals from './Literals'


export default function MainteanciesComplete(props) {
  const [closeInfo, setcloseInfo] = useState('')

  const { Profile, Mainteancies, CompleteMainteancies, handleCompletemodal, handleSelectedMainteance } = props
  const { isCompletemodalopen, selected_record } = Mainteancies


  return (
    <Modal
      onClose={() => {
        handleCompletemodal(false)
        setcloseInfo('')
      }}
      onOpen={() => {
        handleCompletemodal(true)
        setcloseInfo('')
      }}
      open={isCompletemodalopen}
    >
      <Modal.Header>{Literals.Page.Pagecompleteheader[Profile.Language]}</Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          <p>
            {Literals.Messages.Completecheck[Profile.Language]}
          </p>
          <Form>
            <Form.Input
              fluid
              label={Literals.Columns.Closeinfo[Profile.Language]}
              placeholder={Literals.Columns.Closeinfo[Profile.Language]}
              value={closeInfo}
              onChange={(e) => { setcloseInfo(e.target.value) }}
            />
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => {
          handleCompletemodal(false)
          handleSelectedMainteance({})
          setcloseInfo('')
        }}>
          {Literals.Button.Giveup[Profile.Language]}
        </Button>
        <Button
          content={Literals.Button.Complete[Profile.Language]}
          labelPosition='right'
          icon='checkmark'
          onClick={() => {
            CompleteMainteancies({ Uuid: selected_record?.Uuid, Closeinfo: closeInfo })
            handleCompletemodal(false)
            setcloseInfo('')
            handleSelectedMainteance({})
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}
