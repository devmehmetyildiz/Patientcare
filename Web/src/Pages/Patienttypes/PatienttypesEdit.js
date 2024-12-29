import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'

export default class PatienttypesEdit extends Component {

  PAGE_NAME = "PatienttypesEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false
    }
  }

  componentDidMount() {
    const { GetPatienttype, match, history, PatienttypeID } = this.props
    let Id = PatienttypeID || match?.params?.PatienttypeID
    if (validator.isUUID(Id)) {
      GetPatienttype(Id)
    } else {
      history.push("/Patienttypes")
    }
  }

  componentDidUpdate() {
    const { Patienttypes } = this.props
    const { selected_record, isLoading } = Patienttypes
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {

    const { Patienttypes, Profile, history } = this.props

    const t = Profile?.i18n?.t

    const { isLoading } = Patienttypes

    return (
      isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Patienttypes"}>
                <Breadcrumb.Section >{t('Pages.Patienttypes.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Patienttypes.Page.EditHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Patienttypes.Column.Name')} name="Name" />
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Patienttypes"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Patienttypes.isLoading}
              buttonText={t('Common.Button.Create')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { EditPatienttypes, history, fillPatienttypenotification, Patienttypes, Profile } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)
    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Patienttypes.Page.Header'), description: t('Pages.Patienttypes.Messages.NameRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatienttypenotification(error)
      })
    } else {
      EditPatienttypes({ data: { ...Patienttypes.selected_record, ...data }, history })
    }

  }
}
PatienttypesEdit.contextType = FormContext