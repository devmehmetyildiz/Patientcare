import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { } from 'semantic-ui-react'
import { Breadcrumb, Form } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import { CLAIMPAYMENT_TYPE_BHKS, CLAIMPAYMENT_TYPE_KYS, CLAIMPAYMENT_TYPE_PATIENT } from '../../Utils/Constants'

export default class ClaimpaymentparametersEdit extends Component {

  PAGE_NAME = "ClaimpaymentparametersEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
    }
  }

  componentDidMount() {
    const { ClaimpaymentparameterID, GetClaimpaymentparameter, GetCostumertypes, match, history } = this.props
    let Id = ClaimpaymentparameterID || match?.params?.ClaimpaymentparameterID
    if (validator.isUUID(Id)) {
      GetClaimpaymentparameter(Id)
      GetCostumertypes()
    } else {
      history.push("/Claimpaymentparameters")
    }
  }

  componentDidUpdate() {
    const { Claimpaymentparameters, Costumertypes } = this.props
    const { selected_record, isLoading } = Claimpaymentparameters
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0
      && !Costumertypes.isLoading
      && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {
    const { Claimpaymentparameters, Costumertypes, Profile, history } = this.props
    const t = Profile?.i18n?.t

    const Costumertypesoptions = (Costumertypes.list || []).filter(u => u.Isactive).map(type => {
      return { key: type.Uuid, text: type.Name, value: type.Uuid }
    })

    const Claimpaymenttypes = [
      { key: 1, text: t('Common.Claimpayments.Type.Patient'), value: CLAIMPAYMENT_TYPE_PATIENT },
      { key: 2, text: t('Common.Claimpayments.Type.Bhks'), value: CLAIMPAYMENT_TYPE_BHKS },
      { key: 3, text: t('Common.Claimpayments.Type.Kys'), value: CLAIMPAYMENT_TYPE_KYS },
    ]

    const selectedtype = this.context.formstates[`${this.PAGE_NAME}/Type`]
    const isSelectedtype = validator.isNumber(selectedtype)

    return (
      Claimpaymentparameters.isLoading || Costumertypes.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Claimpaymentparameters"}>
                <Breadcrumb.Section >{t('Pages.Claimpaymentparameters.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Claimpaymentparameters.Page.EditHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Claimpaymentparameters.Label.Type')} name="Type" options={Claimpaymenttypes} formtype='dropdown' />
              </Form.Group>
              {isSelectedtype
                ? <React.Fragment>
                  <Form.Group widths={'equal'}>
                    <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Claimpaymentparameters.Label.Costumertype')} name="CostumertypeID" options={Costumertypesoptions} formtype='dropdown' />
                    <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Claimpaymentparameters.Label.Patientclaimpaymentperpayment')} name="Patientclaimpaymentperpayment" type='number' min={0} max={999999} step="0.01" />
                  </Form.Group>
                </React.Fragment>
                : null}
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Claimpaymentparameters"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Claimpaymentparameters.isLoading}
              buttonText={t('Common.Button.Update')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { EditClaimpaymentparameters, history, fillClaimpaymentparameternotification, Profile, Claimpaymentparameters } = this.props
    const t = Profile?.i18n?.t
    const data = this.context.getForm(this.PAGE_NAME)
    let errors = []
    if (!validator.isNumber(data.Type)) {
      errors.push({ type: 'Error', code: t('Pages.Claimpaymentparameters.Page.Header'), description: t('Pages.Claimpaymentparameters.Messages.TypeRequired') })
    }
    if (!validator.isUUID(data.CostumertypeID)) {
      errors.push({ type: 'Error', code: t('Pages.Claimpaymentparameters.Page.Header'), description: t('Pages.Claimpaymentparameters.Messages.CostumertypeRequired') })
    }
    if (!validator.isNumber(data.Patientclaimpaymentperpayment)) {
      errors.push({ type: 'Error', code: t('Pages.Claimpaymentparameters.Page.Header'), description: t('Pages.Claimpaymentparameters.Messages.PerpaymentRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillClaimpaymentparameternotification(error)
      })
    } else {
      EditClaimpaymentparameters({ data: { ...Claimpaymentparameters.selected_record, ...data }, history })
    }
  }
}
ClaimpaymentparametersEdit.contextType = FormContext