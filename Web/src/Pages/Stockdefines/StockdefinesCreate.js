import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form } from 'semantic-ui-react'
import LoadingPage from '../../Utils/LoadingPage'
import Literals from './Literals'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import validator from '../../Utils/Validator'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import FormInput from '../../Utils/FormInput'
import { FormContext } from '../../Provider/FormProvider'
import DepartmentsCreate from '../../Containers/Departments/DepartmentsCreate'
import UnitsCreate from '../../Containers/Units/UnitsCreate'
import Submitbutton from '../../Common/Submitbutton'
import Gobackbutton from '../../Common/Gobackbutton'
export default class StockdefinesCreate extends Component {

  PAGE_NAME = "StockdefinesCreate"

  constructor(props) {
    super(props)
    this.state = {
      modelOpened: false
    }
  }

  componentDidMount() {
    const { GetDepartments, GetUnits } = this.props
    GetDepartments()
    GetUnits()
  }

  render() {
    const { Departments, Units, Stockdefines, history, Profile, closeModal } = this.props

    const Departmentoption = (Departments.list || []).filter(u => u.Isactive).map(station => {
      return { key: station.Uuid, text: station.Name, value: station.Uuid }
    })
    const Unitoption = (Units.list || []).filter(u => u.Isactive).map(station => {
      return { key: station.Uuid, text: station.Name, value: station.Uuid }
    })



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
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Description[Profile.Language]} name="Description" />
              </Form.Group>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Department[Profile.Language]} options={Departmentoption} name="DepartmentID" formtype='dropdown' modal={DepartmentsCreate} />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Unit[Profile.Language]} options={Unitoption} name="UnitID" formtype='dropdown' modal={UnitsCreate} />
              </Form.Group>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Ismedicine[Profile.Language]} name="Ismedicine" formtype='checkbox' />
                {this.context.formstates[`${this.PAGE_NAME}/Ismedicine`] ?
                  <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Isredprescription[Profile.Language]} name="Isredprescription" formtype='checkbox' /> : null}
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Issupply[Profile.Language]} name="Issupply" formtype='checkbox' />
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

    const { AddStockdefines, history, fillStockdefinenotification, Profile, closeModal } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
    data.Isredprescription = data.Isredprescription ? data.Isredprescription || false : false
    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.NameRequired[Profile.Language] })
    }
    if (!validator.isUUID(data.DepartmentID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.DepartmentsRequired[Profile.Language] })
    }
    if (!validator.isUUID(data.UnitID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.UnitsRequired[Profile.Language] })
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