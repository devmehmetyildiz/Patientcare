import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import StocktypegroupsCreate from '../../Containers/Stocktypegroups/StocktypegroupsCreate'
export default class WarehousesEdit extends Component {

  PAGE_NAME = "WarehousesEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false
    }
  }

  componentDidMount() {
    const { WarehouseID, GetWarehouse, match, history, GetStocktypegroups } = this.props
    let Id = WarehouseID || match?.params?.WarehouseID
    if (validator.isUUID(Id)) {
      GetWarehouse(Id)
      GetStocktypegroups()
    } else {
      history.push("/Warehouses")
    }
  }

  componentDidUpdate() {
    const { Warehouses, Stocktypegroups } = this.props
    const { selected_record, isLoading } = Warehouses
    if (selected_record && Object.keys(selected_record).length > 0 && !Stocktypegroups.isLoading && selected_record.Id !== 0 && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, { ...selected_record, Stocktypegroups: (selected_record?.Stocktypegroups || '').split(',').filter(u => validator.isUUID(u)) })
    }
  }

  render() {

    const { Warehouses, Profile, history, Stocktypegroups } = this.props

    const Stocktypegroupsoption = (Stocktypegroups.list || []).filter(u => u.Isactive).map(type => {
      return { key: type.Uuid, text: type.Name, value: type.Uuid }
    })

    const { isLoading } = Warehouses

    return (
      isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Warehouses"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
              </Form.Group>
              <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Info[Profile.Language]} name="Info" />
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Warehouses"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={isLoading}
              buttonText={Literals.Button.Update[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { EditWarehouses, history, fillWarehousenotification, Warehouses, Profile } = this.props

    const data = this.context.getForm(this.PAGE_NAME)
    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.NameRequired[Profile.Language] })
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
