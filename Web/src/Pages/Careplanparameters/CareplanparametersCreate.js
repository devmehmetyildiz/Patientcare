import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import { CAREPLANPARAMETER_TYPE_CURRENTSITUATIONRATİNG, CAREPLANPARAMETER_TYPE_HELPSTATU, CAREPLANPARAMETER_TYPE_PLANNEDSITUATIONRATİNG, CAREPLANPARAMETER_TYPE_PRESENTATIONMAKINGTYPE, CAREPLANPARAMETER_TYPE_PRESENTATIONPERIOD, CAREPLANPARAMETER_TYPE_PURPOSETARGET, CAREPLANPARAMETER_TYPE_PURPOSETARGETWORKS, CAREPLANPARAMETER_TYPE_RATING } from '../../Utils/Constants'

export default class CareplanparametersCreate extends Component {

  PAGE_NAME = "CareplanparametersCreate"

  render() {
    const { Careplanparameters, history, Profile, closeModal } = this.props

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
              <Breadcrumb.Section>{t('Pages.Careplanparameters.Page.CreateHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
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
              buttonText={t('Common.Button.Create')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { AddCareplanparameters, history, fillCareplanparameternotification, Profile, closeModal } = this.props

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
      AddCareplanparameters({ data, history, closeModal })
    }
  }
}
CareplanparametersCreate.contextType = FormContext