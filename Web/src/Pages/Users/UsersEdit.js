import React, { Component, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import Formatdate from '../../Utils/Formatdate'
import UsersPrepare from './UsersPrepare'


export default class UsersEdit extends Component {

  PAGE_NAME = "UsersEdit"
  constructor(props) {
    super(props)
    this.state = { isDatafetched: false, selectedFiles: [] }
  }

  componentDidMount() {
    const { GetUser, GetRoles, GetUsagetypes, GetProfessions, GetFiles, UserID, history, match, } = this.props
    const Id = UserID || match?.params?.UserID

    if (validator.isUUID(Id)) {
      GetUser(Id)
      GetRoles()
      GetProfessions()
      GetUsagetypes()
      GetFiles()
    } else {
      history.push("/Users")
    }
  }

  componentDidUpdate() {
    const { Users, Roles, Usagetypes, Professions, Files } = this.props

    const isLoadingstatus =
      Users.isLoading ||
      Roles.isLoading ||
      Files.isLoading ||
      Usagetypes.isLoading ||
      Professions.isLoading

    const { selected_record } = Users
    if (!isLoadingstatus && !this.state.isDatafetched && validator.isUUID(selected_record?.Uuid)) {
      var response = (Files.list || []).filter(u => u.ParentID === selected_record?.Uuid).map(element => {
        return {
          ...element,
          key: Math.random(),
          Usagetype: (element.Usagetype.split(',') || []).map(u => {
            return u
          })
        }
      });
      this.context.setForm(this.PAGE_NAME,
        {
          ...selected_record,
          Roles: selected_record.Roleuuids.map(u => { return u.RoleID }),
          Dateofbirth: validator.isISODate(selected_record?.Dateofbirth) ? Formatdate(selected_record?.Dateofbirth) : null,
          Workstarttime: validator.isISODate(selected_record?.Workstarttime) ? Formatdate(selected_record?.Workstarttime) : null,
          Workendtime: validator.isISODate(selected_record?.Workendtime) ? Formatdate(selected_record?.Workendtime) : null,
        })
      this.setState({
        isDatafetched: true,
        selectedFiles: [...response] || []
      })
    }
  }

  render() {
    const { history, Users, Roles, Usagetypes, Professions, Files, Profile, fillUsernotification } = this.props
    const t = Profile?.i18n?.t
    const isLoadingstatus =
      Users.isLoading ||
      Roles.isLoading ||
      Files.isLoading ||
      Usagetypes.isLoading ||
      Professions.isLoading

    return isLoadingstatus ? <LoadingPage /> :
      <Pagewrapper>
        <Headerwrapper>
          <Headerbredcrump>
            <Link to={"/Users"}>
              <Breadcrumb.Section >{t('Pages.Users.Page.Header')}</Breadcrumb.Section>
            </Link>
            <Breadcrumb.Divider icon='right chevron' />
            <Breadcrumb.Section>{t('Pages.Users.Page.EditHeader')}</Breadcrumb.Section>
          </Headerbredcrump>
        </Headerwrapper>
        <Pagedivider />
        <Contentwrapper>
          <UsersPrepare
            isEditpage
            selectedFiles={this.state.selectedFiles}
            setselectedFiles={this.setselectedFiles}
            fillnotification={fillUsernotification}
            Usagetypes={Usagetypes}
            Roles={Roles}
            Professions={Professions}
            PAGE_NAME={this.PAGE_NAME}
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
            buttonText={t('Common.Button.Update')}
            submitFunction={this.handleSubmit}
          />
        </Footerwrapper>
      </Pagewrapper >
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { history, Users, Roles, Profile, EditUsers, fillUsernotification, } = this.props
    const t = Profile?.i18n?.t
    const data = this.context.getForm(this.PAGE_NAME)
    data.Roles = (data?.Roles || []).map(id => {
      return (Roles.list || []).filter(u => u.Isactive).find(u => u.Uuid === id)
    }).filter(u => u)
    data.Includeshift = validator.isUUID(data.ProfessionID) ? validator.isBoolean(data?.Includeshift) ? data?.Includeshift : false : false
    if (!validator.isISODate(data.Workstarttime)) {
      data.Workstarttime = null
    }
    if (!validator.isISODate(data.Workendtime)) {
      data.Workendtime = null
    }
    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Users.Page.Header'), description: t('Pages.Users.Messages.NameRequired') })
    }
    if (!validator.isString(data.Surname)) {
      errors.push({ type: 'Error', code: t('Pages.Users.Page.Header'), description: t('Pages.Users.Messages.SurnameRequired') })
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
      EditUsers({ data: { ...Users.selected_record, ...data }, history, files: this.state.selectedFiles })
    }
  }

  setselectedFiles = (prev) => {
    this.setState({
      selectedFiles: [...prev]
    })
  }

}
UsersEdit.contextType = FormContext