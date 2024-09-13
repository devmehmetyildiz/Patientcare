import React from 'react'
import { Form } from 'semantic-ui-react'
import RolesCreate from '../../../Containers/Roles/RolesCreate'
import { getSidebarroutes } from '../../../Components/Sidebar'
import { FormInput } from '../../../Components'

export default function UsersPrepareApp(props) {

  const { PAGE_NAME, Profile, Roles } = props

  const t = Profile?.i18n?.t

  const Roleoptions = (Roles.list || []).filter(u => u.Isactive).map(roles => {
    return { key: roles.Uuid, text: roles.Name, value: roles.Uuid }
  })

  const Sidebaroption = (getSidebarroutes(Profile) || []).flatMap(section => {
    return section.items.filter(u => u.permission)
  }).map(item => {
    return { text: item.subtitle, value: item.url, key: item.subtitle }
  })

  const Languageoptions = [
    { key: 1, text: 'EN', value: 'en' },
    { key: 2, text: 'TR', value: 'tr' },
  ]

  return (
    <React.Fragment>
      <Form.Group widths={'equal'}>
        <FormInput page={PAGE_NAME} required placeholder={t('Pages.Users.Prepare.Label.Roles')} name="Roles" multiple options={Roleoptions} formtype='dropdown' modal={RolesCreate} />
        <FormInput page={PAGE_NAME} required placeholder={t('Pages.Users.Prepare.Label.Language')} name="Language" options={Languageoptions} formtype='dropdown' />
      </Form.Group>
      <Form.Group widths={'equal'}>
        <FormInput page={PAGE_NAME} placeholder={t('Pages.Users.Prepare.Label.Defaultpage')} name="Defaultpage" options={Sidebaroption} formtype='dropdown' />
        <FormInput page={PAGE_NAME} placeholder={t('Pages.Users.Prepare.Label.Isworker')} name="Isworker" formtype='checkbox' />
      </Form.Group>
    </React.Fragment>
  )
}
