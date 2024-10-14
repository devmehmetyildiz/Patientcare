import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'

export default class WarehousesCreate extends Component {

  PAGE_NAME = "WarehousesCreate"

  render() {

    const { Warehouses, Profile, history, closeModal } = this.props

    const t = Profile?.i18n?.t

    const { isLoading } = Warehouses

    return (
      isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Warehouses"}>
                <Breadcrumb.Section >{t('Pages.Warehouses.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Warehouses.Page.CreateHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Warehouses.Column.Name')} name="Name" />
              </Form.Group>
              <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Warehouses.Column.Info')} name="Info" />
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Warehouses"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={isLoading}
              buttonText={t('Common.Button.Create')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { AddWarehouses, history, fillWarehousenotification, Profile, closeModal } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)
    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Warehouses.Page.Header'), description: t('Pages.Warehouses.Messages.NameRequired') })
    }

    if (errors.length > 0) {
      errors.forEach(error => {
        fillWarehousenotification(error)
      })
    } else {
      AddWarehouses({ data, history, closeModal })
    }
  }
}
WarehousesCreate.contextType = FormContext