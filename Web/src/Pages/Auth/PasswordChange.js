import React, { useContext, useEffect, useState } from 'react'
import { Link, } from 'react-router-dom'
import { Breadcrumb, Form } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
  Headerwrapper, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'
import { PASSWORD_REGEX } from '../../Utils/Constants'

export default function PasswordChange(props) {
  const PAGE_NAME = "PasswordChange"

  const { Profile, history, fillnotification, Changepassword } = props

  const { isLoading, username } = Profile

  const t = Profile?.i18n?.t

  const [passwordSame, setPasswordSame] = useState(false)
  const context = useContext(FormContext)

  const { getRecord, record } = context

  useEffect(() => {
    const password = getRecord(PAGE_NAME, 'Newpassword')
    const passwordRe = getRecord(PAGE_NAME, 'Newpasswordre')
    setPasswordSame(password !== passwordRe)
  }, [record])

  const handleSubmit = (e) => {
    e.preventDefault()

    const data = context.getForm(PAGE_NAME)

    let errors = []
    if (!validator.isString(data.Oldpassword)) {
      errors.push({ type: 'Error', code: t('Pages.Passwordchange.Page.Header'), description: t('Pages.Passwordchange.Messages.OldpasswordReqired') })
    }
    if (!validator.isString(data.Newpassword)) {
      errors.push({ type: 'Error', code: t('Pages.Passwordchange.Page.Header'), description: t('Pages.Passwordchange.Messages.NewpasswordReqired') })
    }
    if (!PASSWORD_REGEX.test(data.Newpassword)) {
      errors.push({ type: 'Error', code: t('Pages.Passwordchange.Page.Header'), description: t('Pages.Passwordchange.Messages.PasswordHint') })
    }
    if (!validator.isString(data.Newpasswordre)) {
      errors.push({ type: 'Error', code: t('Pages.Passwordchange.Page.Header'), description: t('Pages.Passwordchange.Messages.NewpasswordConfirmReqired') })
    }
    if (data.Newpassword && data.Newpasswordre) {
      if (data.Newpassword !== data.Newpasswordre) {
        errors.push({ type: 'Error', code: t('Pages.Passwordchange.Page.Header'), description: t('Pages.Passwordchange.Messages.NewPasswordsarenotsame') })
      }
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillnotification(error)
      })
    } else {
      Changepassword({ data, history })
    }
  }

  return (
    <Pagewrapper dimmer isLoading={isLoading}>
      <Headerwrapper>
        <Headerbredcrump>
          <Link to={"/"}>
            <Breadcrumb.Section>{t('Pages.Passwordchange.Page.Header')}</Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section>{username}</Breadcrumb.Section>
          <Breadcrumb.Divider icon='right chevron' />
        </Headerbredcrump>
      </Headerwrapper>
      <Pagedivider />
      <Contentwrapper>
        <Form>
          <FormInput page={PAGE_NAME} type='password'  required placeholder={t('Pages.Passwordchange.Columns.Currentpassword')} name="Oldpassword" />
          <Form.Group widths={"equal"}>
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Passwordchange.Columns.Newpassword')} name="Newpassword" type='password' validationfunc={(e) => PASSWORD_REGEX.test(e)} validationmessage={t('Pages.Passwordchange.Messages.PasswordHint')} attention={t('Pages.Users.Messages.PasswordHint')} />
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Passwordchange.Columns.NewpasswordRe')} name="Newpasswordre" type='password' nonValid={passwordSame} nonValidMessage={t('Pages.Passwordchange.Messages.PasswordSameHint')} />
          </Form.Group>
        </Form>
      </Contentwrapper>
      <Footerwrapper>
        <Gobackbutton
          history={history}
          redirectUrl={"/"}
          buttonText={t('Common.Button.Goback')}
        />
        <Submitbutton
          isLoading={isLoading}
          buttonText={t('Common.Button.Update')}
          submitFunction={handleSubmit}
        />
      </Footerwrapper>
    </Pagewrapper>
  )
}