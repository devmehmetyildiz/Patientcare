import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'

export default class RequiredperiodsCreate extends Component {

  PAGE_NAME = "RequiredperiodsCreate"

  render() {
    const { Requiredperiods, history, Profile, closeModal } = this.props

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
              <Breadcrumb.Section>{t('Pages.Requiredperiods.Page.CreateHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
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
              buttonText={t('Common.Button.Create')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { AddRequiredperiods, history, fillRequiredperiodnotification, Profile, closeModal } = this.props

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
      AddRequiredperiods({ data, history, closeModal })
    }
  }
}
RequiredperiodsCreate.contextType = FormContext