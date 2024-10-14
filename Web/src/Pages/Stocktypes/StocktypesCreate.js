import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'

export default class StocktypesCreate extends Component {

  PAGE_NAME = "StocktypesCreate"

  render() {
    const { Stocktypes, history, Profile, closeModal } = this.props

    const t = Profile?.i18n?.t

    return (
      Stocktypes.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Stocktypes"}>
                <Breadcrumb.Section >{t('Pages.Stocktypes.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Stocktypes.Page.CreateHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Stocktypes.Column.Name')} name="Name" />
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Stocktypes.Column.Info')} name="Info" />
              </Form.Group>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Stocktypes.Column.Issktneed')} name="Issktneed" formtype='checkbox' />
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Stocktypes.Column.Isbarcodeneed')} name="Isbarcodeneed" formtype='checkbox' />
              </Form.Group>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Stocktypes.Column.Isredpill')} name="Isredpill" formtype='checkbox' />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Stocktypes"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Stocktypes.isLoading}
              buttonText={t('Common.Button.Create')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { AddStocktypes, history, fillStocktypenotification, Profile, closeModal } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)
    !validator.isBoolean(data?.Issktneed) && (data.Issktneed = false)
    !validator.isBoolean(data?.Isbarcodeneed) && (data.Isbarcodeneed = false)
    !validator.isBoolean(data?.Isredpill) && (data.Isredpill = false)
    let errors = []

    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Stocktypes.Page.Header'), description: t('Pages.Stocktypes.Messages.NameRequired') })
    }

    if (errors.length > 0) {
      errors.forEach(error => {
        fillStocktypenotification(error)
      })
    } else {
      AddStocktypes({ data, history, closeModal })
    }
  }
}
StocktypesCreate.contextType = FormContext