import React, { Component, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import UsersPrepare from './UsersPrepare'
import { EMAIL_REGEX, PASSWORD_REGEX, USERNAME_REGEX } from '../../Utils/Constants'

export default function UsersCreate(props) {
  const PAGE_NAME = "UsersCreate"

  const { GetRoles, GetProfessions, GetUsagetypes } = props
  const { Users, Roles, Usagetypes, fillUsernotification, Professions, } = props
  const { history, Profile, AddUsers, closeModal } = props

  const [selectedFiles, setSelectedFiles] = useState([])
  const context = useContext(FormContext)

  const t = Profile?.i18n?.t

  const isLoadingstatus =
    Users.isLoading ||
    Roles.isLoading ||
    Usagetypes.isLoading ||
    Professions.isLoading

  const setselectedFiles = (prev) => {
    setSelectedFiles([...prev])
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const t = Profile?.i18n?.t

    const data = context.getForm(PAGE_NAME)
    data.Config = {
      autoClose: data.Duration || 0,
      position: data.Position || 'right',
    }

    data.Config = data.Config ? JSON.stringify(data.Config) : ''
    data.Roles = (data?.Roles || []).map(id => {
      return (Roles.list || []).find(u => u.Uuid === id)
    })
    data.Includeshift = validator.isUUID(data.ProfessionID) ? validator.isBoolean(data?.Includeshift) ? data?.Includeshift : false : false
    if (!validator.isISODate(data.Workstarttime)) {
      data.Workstarttime = null
    }
    if (!validator.isISODate(data.Workendtime)) {
      data.Workendtime = null
    }
    let errors = []
    
    if (!USERNAME_REGEX.test(data.Username)) {
      errors.push({ type: 'Error', code: t('Pages.Users.Page.Header'), description: t('Pages.Users.Messages.UsernameHint') })
    }
    if (!PASSWORD_REGEX.test(data.Password)) {
      errors.push({ type: 'Error', code: t('Pages.Users.Page.Header'), description: t('Pages.Users.Messages.PasswordHint') })
    }
    if (!EMAIL_REGEX.test(data.Email)) {
      errors.push({ type: 'Error', code: t('Pages.Users.Page.Header'), description: t('Pages.Users.Messages.EmailHint') })
    }
    if (data.Password !== data.PasswordRe) {
      errors.push({ type: 'Error', code: t('Pages.Users.Page.Header'), description: t('Pages.Users.Messages.PasswordSameHint') })
    }
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Users.Page.Header'), description: t('Pages.Users.Messages.NameRequired') })
    }
    if (!validator.isString(data.Surname)) {
      errors.push({ type: 'Error', code: t('Pages.Users.Page.Header'), description: t('Pages.Users.Messages.SurnameRequired') })
    }
    if (!validator.isString(data.Password)) {
      errors.push({ type: 'Error', code: t('Pages.Users.Page.Header'), description: t('Pages.Users.Messages.PasswordRequired') })
    }
    if (!validator.isString(data.Username)) {
      errors.push({ type: 'Error', code: t('Pages.Users.Page.Header'), description: t('Pages.Users.Messages.UsernameRequired') })
    }
    if (!validator.isString(data.Email)) {
      errors.push({ type: 'Error', code: t('Pages.Users.Page.Header'), description: t('Pages.Users.Messages.EmailRequired') })
    }
    if (!validator.isArray(data.Roles)) {
      errors.push({ type: 'Error', code: t('Pages.Users.Page.Header'), description: t('Pages.Users.Messages.RolesRequired') })
    }
    if (!validator.isString(data.Language)) {
      errors.push({ type: 'Error', code: t('Pages.Users.Page.Header'), description: t('Pages.Users.Messages.LanguageRequired') })
    }
    if (data.Isworker) {
      if (!validator.isISODate(data.Workstarttime)) {
        errors.push({ type: 'Error', code: t('Pages.Users.Page.Header'), description: t('Pages.Users.Messages.WorkstarttimeRequired') })
      }
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillUsernotification(error)
      })
    } else {
      AddUsers({ data, history, closeModal, files: selectedFiles })
    }
  }

  useEffect(() => {
    GetRoles()
    GetProfessions()
    GetUsagetypes()
  }, [])

  return (
    <Pagewrapper dimmer isLoading={isLoadingstatus}>
      <Headerwrapper>
        <Headerbredcrump>
          <Link to={"/Users"}>
            <Breadcrumb.Section >{t('Pages.Users.Page.Header')}</Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section>{t('Pages.Users.Page.CreateHeader')}</Breadcrumb.Section>
        </Headerbredcrump>
        {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
      </Headerwrapper>
      <Pagedivider />
      <Contentwrapper>
        <UsersPrepare
          selectedFiles={selectedFiles}
          setselectedFiles={setselectedFiles}
          fillnotification={fillUsernotification}
          Usagetypes={Usagetypes}
          Roles={Roles}
          Professions={Professions}
          PAGE_NAME={PAGE_NAME}
          Profile={Profile}
        />
      </Contentwrapper>
      <Footerwrapper>
        <Gobackbutton
          history={history}
          redirectUrl={"/Users"}
          buttonText={t('Common.Button.Goback')}
        />
        <Submitbutton
          isLoading={Users.isLoading}
          buttonText={t('Common.Button.Create')}
          submitFunction={handleSubmit}
        />
      </Footerwrapper>
    </Pagewrapper >
  )
}