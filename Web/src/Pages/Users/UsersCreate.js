import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import UsersPrepare from './UsersPrepare'


export default class UsersCreate extends Component {
  PAGE_NAME = "UsersCreate"

  constructor(props) {
    super(props)
    this.state = {
      selectedFiles: []
    }
  }

  componentDidMount() {
    const { GetRoles, GetProfessions, GetUsagetypes } = this.props
    GetRoles()
    GetProfessions()
    GetUsagetypes()
  }

  render() {
    const { Users, Roles, Usagetypes, fillUsernotification, Professions, Profile, history, closeModal } = this.props

    const t = Profile?.i18n?.t

    const isLoadingstatus =
      Users.isLoading ||
      Roles.isLoading ||
      Usagetypes.isLoading ||
      Professions.isLoading

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
            buttonText={t('Common.Button.Create')}
            submitFunction={this.handleSubmit}
          />
        </Footerwrapper>
      </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { history, Roles, Profile, AddUsers, fillUsernotification, closeModal } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)
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
      AddUsers({ data, history, closeModal, files: this.state.selectedFiles })
    }
  }

  setselectedFiles = (prev) => {
    this.setState({
      selectedFiles: [...prev]
    })
  }
}
UsersCreate.contextType = FormContext