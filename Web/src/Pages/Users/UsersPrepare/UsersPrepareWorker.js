import React, { useContext } from 'react'
import { FormContext } from '../../../Provider/FormProvider'
import validator from '../../../Utils/Validator'
import { Form } from 'semantic-ui-react'
import { FormInput } from '../../../Components'

export default function UsersPrepareWorker(props) {
  const { PAGE_NAME, Professions, Profile } = props

  const t = Profile?.i18n?.t
  const context = useContext(FormContext)

  const Professionoptions = (Professions.list || []).filter(u => u.Isactive).map(profession => {
    return { key: profession.Uuid, text: profession.Name, value: profession.Uuid }
  })

  const Includeshift = validator.isUUID(context.formstates[`${PAGE_NAME}/ProfessionID`])
  const Isworker = context.formstates[`${PAGE_NAME}/Isworker`] ? true : false

  return (
    <React.Fragment>
      <Form.Group widths={'equal'}>
        <FormInput page={PAGE_NAME} placeholder={t('Pages.Users.Prepare.Label.Profession')} name="ProfessionID" options={Professionoptions} formtype='dropdown' />
        {Includeshift
          ? <FormInput page={PAGE_NAME} placeholder={t('Pages.Users.Prepare.Label.Includeshift')} name="Includeshift" formtype='checkbox' />
          : null
        }
      </Form.Group>
      <Form.Group widths={'equal'}>
        <FormInput page={PAGE_NAME} required={Isworker ? true : false} placeholder={t('Pages.Users.Prepare.Label.Workstarttime')} name="Workstarttime" type='date' />
      </Form.Group>
    </React.Fragment>

  )
}
