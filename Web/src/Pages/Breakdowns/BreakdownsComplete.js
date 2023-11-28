import React, { useState } from 'react'
import { Button, Form, Modal } from 'semantic-ui-react'
import Literals from './Literals'


export default function BreakdownsComplete(props) {
  const [closeInfo, setcloseInfo] = useState('')

  const { Profile, Breakdowns, CompleteBreakdowns, handleCompletemodal, handleSelectedBreakdown } = props
  const { isCompletemodalopen, selected_record } = Breakdowns


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
          handleSelectedBreakdown({})
          setcloseInfo('')
        }}>
          {Literals.Button.Giveup[Profile.Language]}
        </Button>
        <Button
          content={Literals.Button.Complete[Profile.Language]}
          labelPosition='right'
          icon='checkmark'
          onClick={() => {
            CompleteBreakdowns({ Uuid: selected_record?.Uuid, Closeinfo: closeInfo })
            handleCompletemodal(false)
            setcloseInfo('')
            handleSelectedBreakdown({})
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}
