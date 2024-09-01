import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import UnitsCreate from '../../Containers/Units/UnitsCreate'
import StocktypesCreate from '../../Containers/Stocktypes/StocktypesCreate'
export default class StockdefinesCreate extends Component {

  PAGE_NAME = "StockdefinesCreate"

  constructor(props) {
    super(props)
    this.state = {
      modelOpened: false
    }
  }

  componentDidMount() {
    const { GetUnits, GetStocktypes } = this.props
    GetUnits()
    GetStocktypes()
  }

  render() {
    const { Stocktypes, Units, Stockdefines, history, Profile, closeModal } = this.props

    const Stocktypesoption = (Stocktypes.list || []).filter(u => u.Isactive).map(item => {
      return { key: item.Uuid, text: item.Name, value: item.Uuid }
    })

    const Unitoption = (Units.list || []).filter(u => u.Isactive).map(item => {
      return { key: item.Uuid, text: item.Name, value: item.Uuid }
    })

    const selectedstocktypeId = this.context.formstates[`${this.PAGE_NAME}/StocktypeID`]
    const Isbarcodeneed = (Stocktypes.list || []).find(item => item.Uuid === selectedstocktypeId)?.Isbarcodeneed

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
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
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
              buttonText={Literals.Button.Create[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { AddStockdefines, history, fillStockdefinenotification, Profile, closeModal, Stocktypes } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
    const Isbarcodeneed = (Stocktypes.list || []).find(item => item.Uuid === data?.StocktypeID?.Uuid)?.Isbarcodeneed

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
      AddStockdefines({ data, history, closeModal })
    }
  }
}
StockdefinesCreate.contextType = FormContext