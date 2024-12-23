import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
  Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'
export default class PatienthealthcasedefinesCreate extends Component {

  PAGE_NAME = "PatienthealthcasedefinesCreate"

  render() {
    const { Patienthealthcasedefines, Profile, history, closeModal } = this.props

    const t = Profile?.i18n?.t

    return (
      Patienthealthcasedefines.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Patienthealthcasedefines"}>
                <Breadcrumb.Section >{t('Pages.Patienthealthcasedefines.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Patienthealthcasedefines.Page.CreateHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Patienthealthcasedefines.Label.Name')} name="Name" />
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
              buttonText={t('Common.Button.Create')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { AddPatienthealthcasedefines, history, fillPatienthealthcasedefinenotification, Profile, closeModal } = this.props
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
      AddPatienthealthcasedefines({ data, history, closeModal })
    }
  }
}
PatienthealthcasedefinesCreate.contextType = FormContext