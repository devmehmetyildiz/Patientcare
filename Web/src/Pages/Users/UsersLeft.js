import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'semantic-ui-react'

import validator from '../../Utils/Validator'
import { Pagedivider } from '../../Components'

export default function UsersLeft(props) {

  const { open, setOpen, record, setRecord, RemoveUsers, fillUsernotification, Users, Profile } = props
  const [workendtime, setWorkendtime] = useState(null)
  const [leftinfo, setLeftinfo] = useState(null)

  const t = Profile?.i18n?.t

  const onClose = () => {
    setOpen(false)
    setRecord(null)
    setWorkendtime(null)
    setLeftinfo(null)
  }

  useEffect(() => {
    if (open) {
      setWorkendtime(null)
      setLeftinfo(null)
    }
  }, [open])

  return (
    <Modal
      onClose={() => onClose()}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <Modal.Header>{t('Pages.Users.Page.RemoveHeader')}</Modal.Header>
      <Modal.Content >
        <Modal.Description>
          <p>
            <span className='font-bold'>{record?.Username} </span>
            {t('Pages.Users.Delete.Label.RemoveCheck')}
          </p>
          <Pagedivider />
          <Form>
            <Form.Group widths={'equal'}>
              <Form.Field>
                <Form.Input
                  label={t('Pages.Users.Columns.Workendtime')}
                  type='datetime-local'
                  value={workendtime}
                  onChange={(e) => setWorkendtime(e.target.value)}
                />
              </Form.Field>
              <Form.Field>
                <Form.Input
                  label={t('Pages.Users.Columns.Leftinfo')}
                  value={leftinfo}
                  onChange={(e) => setLeftinfo(e.target.value)}
                />
              </Form.Field>
            </Form.Group>
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => {
          onClose()
        }}>
          {t('Common.Button.Giveup')}
        </Button>
        <Button
          loading={Users.isLoading}
          content={t('Common.Button.RemoveWork')}
          labelPosition='right'
          icon='checkmark'
          onClick={() => {
            let errors = []
            console.log('record: ', record);

            if (!validator.isISODate(workendtime)) {
              errors.push({ type: 'Error', code: t('Pages.Users.Page.Header'), description: t('Pages.Users.Messages.WorkstartendRequired') })
            }
            if (!validator.isUUID(record?.Uuid)) {
              errors.push({ type: 'Error', code: t('Pages.Users.Page.Header'), description: t('Pages.Users.Detail.Messages.UnsupportedUserID') })
            }

            if (errors.length > 0) {
              errors.forEach(error => {
                fillUsernotification(error)
              })
            } else {
              RemoveUsers({
                data: {
                  Uuid: record.Uuid,
                  Workendtime: workendtime,
                  Leftinfo: leftinfo
                },
                onSuccess: () => {
                  onClose()
                }
              })
            }

          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}