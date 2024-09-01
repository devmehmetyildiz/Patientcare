import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import UnitsCreate from '../../Containers/Units/UnitsCreate'
import StocktypesCreate from '../../Containers/Stocktypes/StocktypesCreate'

export default class StockdefinesEdit extends Component {

  PAGE_NAME = "StockdefinesEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
    }
  }

  componentDidMount() {
    const { GetStockdefine, match, history, GetStocktypes, GetUnits, StockdefineID } = this.props
    let Id = StockdefineID || match.params.StockdefineID
    if (validator.isUUID(Id)) {
      GetStockdefine(Id)
      GetStocktypes()
      GetUnits()
    } else {
      history.push("/Stockdefines")
    }
  }

  componentDidUpdate() {
    const { Stockdefines, Units, Stocktypes } = this.props
    const { selected_record, isLoading } = Stockdefines
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !Units.isLoading && !Stocktypes.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {

    const { Stocktypes, Stockdefines, Units, Profile, history } = this.props

    const Stocktypesoption = (Stocktypes.list || []).filter(u => u.Isactive).map(item => {
      return { key: item.Uuid, text: item.Name, value: item.Uuid }
    })

    const Unitoption = (Units.list || []).filter(u => u.Isactive).map(item => {
      return { key: item.Uuid, text: item.Name, value: item.Uuid }
    })

    const selectedType = this.context.formstates[`${this.PAGE_NAME}/StocktypeID`]
    const Isbarcodeneed = selectedType?.Isbarcodeneed

    return (
      Stockdefines.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Stockdefines"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Brand[Profile.Language]} name="Brand" />
              </Form.Group>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Stocktype[Profile.Language]} options={Stocktypesoption} name="StocktypeID" formtype='dropdown' modal={StocktypesCreate} />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Unit[Profile.Language]} options={Unitoption} name="UnitID" formtype='dropdown' modal={UnitsCreate} />
              </Form.Group>
              {Isbarcodeneed ?
                <Form.Group widths={"equal"}>
                  <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Barcode[Profile.Language]} name="Barcode" />
                </Form.Group>
                : null
              }
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Info[Profile.Language]} name="Info" />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Stockdefines"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Stockdefines.isLoading}
              buttonText={Literals.Button.Update[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { EditStockdefines, history, fillStockdefinenotification, Stockdefines, Profile } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
    const Isbarcodeneed = data?.StocktypeID?.Isbarcodeneed

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.NameRequired[Profile.Language] })
    }
    if (!validator.isUUID(data.StocktypeID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.StocktypesRequired[Profile.Language] })
    }
    if (!validator.isUUID(data.UnitID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.UnitsRequired[Profile.Language] })
    }
    if (Isbarcodeneed) {
      if (!validator.isString(data.Barcode)) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.BarcodeRequired[Profile.Language] })
      }
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillStockdefinenotification(error)
      })
    } else {
      EditStockdefines({ data: { ...Stockdefines.selected_record, ...data }, history })
    }
  }
}
StockdefinesEdit.contextType = FormContext