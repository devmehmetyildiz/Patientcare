import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import { GENDER_OPTION_MEN, GENDER_OPTION_WOMEN } from '../../Utils/Constants'
export default class FloorsCreate extends Component {

  PAGE_NAME = "FloorsCreate"

  render() {
    const { Floors, Profile, history, closeModal } = this.props

    const t = Profile?.i18n?.t

    const Genderoptions = [
      { key: 0, text: t('Option.Genderoption.Men'), value: GENDER_OPTION_MEN },
      { key: 1, text: t('Option.Genderoption.Women'), value: GENDER_OPTION_WOMEN }
    ]

    return (
      <Pagewrapper isLoading={Floors.isLoading} dimmer>
        <Headerwrapper>
          <Headerbredcrump>
            <Link to={"/Floors"}>
              <Breadcrumb.Section >{t('Pages.Floors.Page.Header')}</Breadcrumb.Section>
            </Link>
            <Breadcrumb.Divider icon='right chevron' />
            <Breadcrumb.Section>{t('Pages.Floors.Page.CreateHeader')}</Breadcrumb.Section>
          </Headerbredcrump>
          {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
        </Headerwrapper>
        <Pagedivider />
        <Contentwrapper>
          <Form>
            <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Floors.Column.Name')} name="Name" />
            <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Floors.Column.Gender')} name="Gender" options={Genderoptions} formtype='dropdown' />
          </Form>
        </Contentwrapper>
        <Footerwrapper>
          <Gobackbutton
            history={history}
            redirectUrl={"/Floors"}
            buttonText={t('Common.Button.Goback')}
          />
          <Submitbutton
            isLoading={Floors.isLoading}
            buttonText={t('Common.Button.Create')}
            submitFunction={this.handleSubmit}
          />
        </Footerwrapper>
      </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { AddFloors, history, fillFloornotification, Profile, closeModal } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Floors.Page.Header'), description: t('Pages.Floors.Messages.NameRequired') })
    }
    if (!validator.isString(data.Gender)) {
      errors.push({ type: 'Error', code: t('Pages.Floors.Page.Header'), description: t('Pages.Floors.Messages.GenderRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillFloornotification(error)
      })
    } else {
      AddFloors({ data, history, closeModal })
    }
  }
}
FloorsCreate.contextType = FormContext