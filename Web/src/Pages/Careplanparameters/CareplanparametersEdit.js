import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import { CAREPLANPARAMETER_TYPE_CURRENTSITUATIONRATİNG, CAREPLANPARAMETER_TYPE_HELPSTATU, CAREPLANPARAMETER_TYPE_PLANNEDSITUATIONRATİNG, CAREPLANPARAMETER_TYPE_PRESENTATIONMAKINGTYPE, CAREPLANPARAMETER_TYPE_PRESENTATIONPERIOD, CAREPLANPARAMETER_TYPE_PURPOSETARGET, CAREPLANPARAMETER_TYPE_PURPOSETARGETWORKS, CAREPLANPARAMETER_TYPE_RATING } from '../../Utils/Constants'

export default class CareplanparametersEdit extends Component {

  PAGE_NAME = "CareplanparametersEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false
    }
  }

  componentDidMount() {
    const { GetCareplanparameter, match, history, CareplanparameterID } = this.props
    let Id = CareplanparameterID || match.params.CareplanparameterID
    if (validator.isUUID(Id)) {
      GetCareplanparameter(Id)
    } else {
      history.push("/Careplanparameters")
    }
  }

  componentDidUpdate() {
    const { Careplanparameters, } = this.props
    const { selected_record, isLoading } = Careplanparameters
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {

    const { Careplanparameters, Profile, history } = this.props

    const t = Profile?.i18n?.t

    const Parametertypes = [
      { key: 1, text: t('Common.Careplanparameters.Type.Helpstatus'), value: CAREPLANPARAMETER_TYPE_HELPSTATU },
      { key: 2, text: t('Common.Careplanparameters.Type.Presentationperiod'), value: CAREPLANPARAMETER_TYPE_PRESENTATIONPERIOD },
      { key: 3, text: t('Common.Careplanparameters.Type.Presentationmakingtype'), value: CAREPLANPARAMETER_TYPE_PRESENTATIONMAKINGTYPE },
      { key: 4, text: t('Common.Careplanparameters.Type.Rating'), value: CAREPLANPARAMETER_TYPE_RATING },
      { key: 5, text: t('Common.Careplanparameters.Type.Currentsituationrati̇ng'), value: CAREPLANPARAMETER_TYPE_CURRENTSITUATIONRATİNG },
      { key: 6, text: t('Common.Careplanparameters.Type.Plannedsituationrati̇ng'), value: CAREPLANPARAMETER_TYPE_PLANNEDSITUATIONRATİNG },
      { key: 7, text: t('Common.Careplanparameters.Type.Purposetarget'), value: CAREPLANPARAMETER_TYPE_PURPOSETARGET },
      { key: 8, text: t('Common.Careplanparameters.Type.Purposetargetworks'), value: CAREPLANPARAMETER_TYPE_PURPOSETARGETWORKS },
    ]

    return (
      Careplanparameters.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Careplanparameters"}>
                <Breadcrumb.Section >{t('Pages.Careplanparameters.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Careplanparameters.Page.EditHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Careplanparameters.Column.Type')} name="Type" formtype='dropdown' options={Parametertypes} />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Careplanparameters.Column.Name')} name="Name" />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Careplanparameters"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Careplanparameters.isLoading}
              buttonText={t('Common.Button.Update')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { EditCareplanparameters, history, fillCareplanparameternotification, Careplanparameters, Profile } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)
    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Careplanparameters.Page.Header'), description: t('Pages.Careplanparameters.Messages.NameRequired') })
    }
    if (!validator.isNumber(data.Type)) {
      errors.push({ type: 'Error', code: t('Pages.Careplanparameters.Page.Header'), description: t('Pages.Careplanparameters.Messages.TypeRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillCareplanparameternotification(error)
      })
    } else {
      EditCareplanparameters({ data: { ...Careplanparameters.selected_record, ...data }, history })
    }
  }
}
CareplanparametersEdit.contextType = FormContext