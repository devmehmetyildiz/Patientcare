import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { } from 'semantic-ui-react'
import { Breadcrumb, Form } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'

export default class PatienteventdefinesEdit extends Component {

  PAGE_NAME = "PatienteventdefinesEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
    }
  }

  componentDidMount() {
    const { PatienteventdefineID, GetPatienteventdefine, match, history } = this.props
    let Id = match?.params?.PatienteventdefineID || PatienteventdefineID
    if (validator.isUUID(Id)) {
      GetPatienteventdefine(Id)
    } else {
      history.push("/Patienteventdefines")
    }
  }

  componentDidUpdate() {
    const { Patienteventdefines, } = this.props
    const { selected_record, isLoading } = Patienteventdefines
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0
      && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {
    const { Patienteventdefines, Profile, history } = this.props
    const t = Profile?.i18n?.t

    return (
        <Pagewrapper dimmer isLoading={Patienteventdefines.isLoading}>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Patienteventdefines"}>
                <Breadcrumb.Section >{t('Pages.Patienteventdefines.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Patienteventdefines.Page.EditHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patienteventdefines.Label.Eventname')} name="Eventname" />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Patienteventdefines"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Patienteventdefines.isLoading}
              buttonText={t('Common.Button.Update')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { EditPatienteventdefines, history, fillPatienteventdefinenotification, Profile, Patienteventdefines } = this.props
    const t = Profile?.i18n?.t
    const data = this.context.getForm(this.PAGE_NAME)
    let errors = []
    if (!validator.isString(data.Eventname)) {
      errors.push({ type: 'Error', code: t('Pages.Patienteventdefines.Page.Header'), description: t('Pages.Patienteventdefines.Messages.EventnameRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatienteventdefinenotification(error)
      })
    } else {
      EditPatienteventdefines({ data: { ...Patienteventdefines.selected_record, ...data }, history })
    }
  }
}
PatienteventdefinesEdit.contextType = FormContext