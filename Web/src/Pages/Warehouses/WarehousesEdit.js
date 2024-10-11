import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
export default class WarehousesEdit extends Component {

  PAGE_NAME = "WarehousesEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false
    }
  }

  componentDidMount() {
    const { WarehouseID, GetWarehouse, match, history } = this.props
    let Id = WarehouseID || match?.params?.WarehouseID
    if (validator.isUUID(Id)) {
      GetWarehouse(Id)
    } else {
      history.push("/Warehouses")
    }
  }

  componentDidUpdate() {
    const { Warehouses } = this.props
    const { selected_record, isLoading } = Warehouses
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {

    const { Warehouses, Profile, history } = this.props
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
              <Breadcrumb.Section>{t('Pages.Warehouses.Page.EditHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Warehouses.Columns.Name')} name="Name" />
              </Form.Group>
              <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Warehouses.Columns.Info')} name="Info" />
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
              buttonText={t('Common.Button.Update')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { EditWarehouses, history, fillWarehousenotification, Warehouses, Profile } = this.props
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
      EditWarehouses({ data: { ...Warehouses.selected_record, ...data }, history })
    }
  }
}
WarehousesEdit.contextType = FormContext
