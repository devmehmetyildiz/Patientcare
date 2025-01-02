import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import { CASH_TYPE_INCOME, CASH_TYPE_OUTCOME } from '../../Utils/Constants'

export default class CompanycashmovementsCreate extends Component {

  PAGE_NAME = "CompanycashmovementsCreate"


  render() {

    const { Companycashmovements, Profile, history, closeModal } = this.props

    const t = Profile?.i18n?.t

    const { isLoading } = Companycashmovements

    const CASH_OPTION = [
      { key: 1, text: t('Option.Cashtypes.Outcome'), value: CASH_TYPE_OUTCOME },
      { key: 2, text: t('Option.Cashtypes.Income'), value: CASH_TYPE_INCOME }
    ]

    return (
      isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Companycashmovements"}>
                <Breadcrumb.Section >{t('Pages.Companycashmovements.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Companycashmovements.Page.CreateHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Companycashmovements.Column.Movementtype')} name="Movementtype" options={CASH_OPTION} formtype='dropdown' />
                <FormInput page={this.PAGE_NAME}  placeholder={t('Pages.Companycashmovements.Column.Movementvalue')} name="Movementvalue" type='number' step='0.01' />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Companycashmovements.Column.Report')} name="ReportID" />
                <FormInput page={this.PAGE_NAME}  placeholder={t('Pages.Companycashmovements.Column.Info')} name="Info" />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Companycashmovements"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Companycashmovements.isLoading}
              buttonText={t('Common.Button.Create')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { AddCompanycashmovements, history, fillCompanycashmovementnotification, Profile, closeModal } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)
    !validator.isNumber(data.Movementvalue) && (data.Movementvalue = 0)
    let errors = []
    if (!validator.isNumber(data.Movementtype)) {
      errors.push({ type: 'Error', code: t('Pages.Companycashmovements.Page.Header'), description: t('Pages.Companycashmovements.Messages.TypeRequired') })
    }
    if (!validator.isString(data.ReportID)) {
      errors.push({ type: 'Error', code: t('Pages.Companycashmovements.Page.Header'), description: t('Pages.Companycashmovements.Messages.ReportRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillCompanycashmovementnotification(error)
      })
    } else {
      AddCompanycashmovements({ data, history, closeModal })
    }
  }
}
CompanycashmovementsCreate.contextType = FormContext
