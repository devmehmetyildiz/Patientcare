import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { } from 'semantic-ui-react'
import { Breadcrumb, Form } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'

export default class PatienthealthcasedefinesEdit extends Component {

  PAGE_NAME = "PatienthealthcasedefinesEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
    }
  }

  componentDidMount() {
    const { PatienthealthcasedefineID, GetPatienthealthcasedefine, match, history } = this.props
    let Id = match?.params?.PatienthealthcasedefineID || PatienthealthcasedefineID
    if (validator.isUUID(Id)) {
      GetPatienthealthcasedefine(Id)
    } else {
      history.push("/Patienthealthcasedefines")
    }
  }

  componentDidUpdate() {
    const { Patienthealthcasedefines, } = this.props
    const { selected_record, isLoading } = Patienthealthcasedefines
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0
      && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {
    const { Patienthealthcasedefines, Profile, history } = this.props
    const t = Profile?.i18n?.t

    return (
        <Pagewrapper isLoading={Patienthealthcasedefines.isLoading} dimmer>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Patienthealthcasedefines"}>
                <Breadcrumb.Section >{t('Pages.Patienthealthcasedefines.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Patienthealthcasedefines.Page.EditHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patienthealthcasedefines.Label.Name')} name="Name" />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Patienthealthcasedefines"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Patienthealthcasedefines.isLoading}
              buttonText={t('Common.Button.Update')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { EditPatienthealthcasedefines, history, fillPatienthealthcasedefinenotification, Profile, Patienthealthcasedefines } = this.props
    const t = Profile?.i18n?.t
    const data = this.context.getForm(this.PAGE_NAME)
    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Patienthealthcasedefines.Page.Header'), description: t('Pages.Patienthealthcasedefines.Messages.NameRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatienthealthcasedefinenotification(error)
      })
    } else {
      EditPatienthealthcasedefines({ data: { ...Patienthealthcasedefines.selected_record, ...data }, history })
    }
  }
}
PatienthealthcasedefinesEdit.contextType = FormContext