import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'


export default class PatientcashregistersCreate extends Component {

  PAGE_NAME = "PatientcashregistersCreate"

  render() {

    const { Patientcashregisters, Profile, history, closeModal } = this.props

    const t = Profile?.i18n?.t

    const { isLoading } = Patientcashregisters

    return (
      isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Patientcashregisters"}>
                <Breadcrumb.Section >{t('Pages.Patientcashregisters.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section >{t('Pages.Patientcashregisters.Page.CreateHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Patientcashregisters.Column.Name')} name="Name" />
              <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Patientcashregisters.Column.Iseffectcompany')} name="Iseffectcompany" formtype='checkbox' />
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Patientcashregisters"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Patientcashregisters.isLoading}
              buttonText={t('Common.Button.Create')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { AddPatientcashregisters, history, fillPatientcashregisternotification, Profile, closeModal } = this.props

    const data = this.context.getForm(this.PAGE_NAME)

    const t = Profile?.i18n?.t

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Patientcashregisters.Page.Header'), description: t('Pages.Patientcashregisters.Messages.NameRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatientcashregisternotification(error)
      })
    } else {
      AddPatientcashregisters({ data, history, closeModal })
    }
  }
}
PatientcashregistersCreate.contextType = FormContext
