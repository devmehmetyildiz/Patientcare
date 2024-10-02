import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'

export default class RequiredperiodsEdit extends Component {

  PAGE_NAME = "RequiredperiodsEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false
    }
  }


  componentDidMount() {
    const { GetRequiredperiod, match, history, RequiredperiodID } = this.props
    let Id = RequiredperiodID || match.params.RequiredperiodID
    if (validator.isUUID(Id)) {
      GetRequiredperiod(Id)
    } else {
      history.push("/Requiredperiods")
    }
  }

  componentDidUpdate() {
    const { Requiredperiods, } = this.props
    const { selected_record, isLoading } = Requiredperiods
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {

    const { Requiredperiods, Profile, history } = this.props

    const t = Profile?.i18n?.t

    return (
      Requiredperiods.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Requiredperiods"}>
                <Breadcrumb.Section >{t('Pages.Requiredperiods.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Requiredperiods.Page.EditHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Requiredperiods.Column.Name')} name="Name" />
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Requiredperiods"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Requiredperiods.isLoading}
              buttonText={t('Common.Button.Update')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { EditRequiredperiods, history, fillRequiredperiodnotification, Requiredperiods, Profile } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)
    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Requiredperiods.Page.Header'), description: t('Pages.Requiredperiods.Messages.NameRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillRequiredperiodnotification(error)
      })
    } else {
      EditRequiredperiods({ data: { ...Requiredperiods.selected_record, ...data }, history })
    }
  }
}
RequiredperiodsEdit.contextType = FormContext