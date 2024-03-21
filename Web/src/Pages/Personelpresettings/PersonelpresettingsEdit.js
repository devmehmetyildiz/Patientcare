import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { } from 'semantic-ui-react'
import { Breadcrumb, Form } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import RoomsCreate from '../../Containers/Rooms/RoomsCreate'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import Formatdate, { Getdateoptions } from '../../Utils/Formatdate'

export default class PersonelpresettingsEdit extends Component {

  PAGE_NAME = "PersonelpresettingsEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
    }
  }

  componentDidMount() {
    const { PersonelpresettingID, GetPersonelpresetting, GetFloors, GetShiftdefines, GetUsers, match, history } = this.props
    let Id = PersonelpresettingID || match?.params?.PersonelpresettingID
    if (validator.isUUID(Id)) {
      GetPersonelpresetting(Id)
      GetFloors()
      GetShiftdefines()
      GetUsers()
    } else {
      history.push("/Personelpresettings")
    }
  }

  componentDidUpdate() {
    const { Personelpresettings, Floors, Users, Shiftdefines } = this.props
    const { selected_record, isLoading } = Personelpresettings
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0
      && !Floors.isLoading && !Users.isLoading && !Shiftdefines.isLoading
      && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, { ...selected_record, Startdate: new Date(selected_record?.Startdate).toDateString() })
    }

    const Isinfinite = this.context.formstates[`${this.PAGE_NAME}/Isinfinite`]
    const Startdate = this.context.formstates[`${this.PAGE_NAME}/Startdate`]
    const Enddate = this.context.formstates[`${this.PAGE_NAME}/Enddate`]
    if (Isinfinite && (Startdate !== null || Enddate !== null)) {
      this.context.setFormstates({
        ...this.context.formstates,
        [`${this.PAGE_NAME}/Startdate`]: null,
        [`${this.PAGE_NAME}/Enddate`]: null,
      })
    }
  }

  render() {
    const { Personelpresettings, Floors, Shiftdefines, Users, Profile, history } = this.props

    const Flooroptions = (Floors.list || []).filter(u => u.Isactive).map(floor => {
      return { key: floor.Uuid, text: floor.Name, value: floor.Uuid }
    })

    const Shiftdefineoptions = (Shiftdefines.list || []).filter(u => u.Isactive).map(shiftdefine => {
      return { key: shiftdefine.Uuid, text: shiftdefine.Name, value: shiftdefine.Uuid }
    })

    const Useroptions = (Users.list || []).filter(u => u.Isactive).map(user => {
      return { key: user.Uuid, text: `${user?.Name} ${user?.Surname}`, value: user.Uuid }
    })

    const Dateoptions = Getdateoptions()

    const Isinfinite = this.context.formstates[`${this.PAGE_NAME}/Isinfinite`]

    const isLoadingstatus =
      Personelpresettings.isLoading ||
      Floors.isLoading ||
      Shiftdefines.isLoading ||
      Users.isLoading

    return (
      isLoadingstatus ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Personelpresettings"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Isinfinite[Profile.Language]} name="Isinfinite" formtype="checkbox" />
              {!Isinfinite && <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Startdate[Profile.Language]} name="Startdate" options={Dateoptions} formtype="dropdown" />}
              <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Personel[Profile.Language]} name="PersonelID" formtype="dropdown" options={Useroptions} />
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Floor[Profile.Language]} name="FloorID" formtype="dropdown" options={Flooroptions} />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Shiftdefine[Profile.Language]} name="ShiftdefineID" formtype="dropdown" options={Shiftdefineoptions} />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Personelpresettings"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={isLoadingstatus}
              buttonText={Literals.Button.Update[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { EditPersonelpresettings, Personelpresettings, history, fillPersonelpresettingnotification, Profile } = this.props
    const data = this.context.getForm(this.PAGE_NAME)

    !validator.isBoolean(data?.Isinfinite) && (data.Isinfinite = false)
    !validator.isBoolean(data?.Isapproved) && (data.Isapproved = false)
    !validator.isBoolean(data?.Iscompleted) && (data.Iscompleted = false)
    !validator.isBoolean(data?.Isdeactive) && (data.Isdeactive = false)

    let errors = []

    if (!data.Isinfinite) {
      if (!validator.isISODate(data.Startdate)) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Daterequired[Profile.Language] })
      }
    }
    if (!validator.isUUID(data.PersonelID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Personelrequired[Profile.Language] })
    }
    if (!validator.isUUID(data.ShiftdefineID) && !validator.isUUID(data.FloorID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Floororshiftrequired[Profile.Language] })
    }

    if (errors.length > 0) {
      errors.forEach(error => {
        fillPersonelpresettingnotification(error)
      })
    } else {
      EditPersonelpresettings({ data: { ...Personelpresettings.selected_record, ...data }, history })
    }
  }
}
PersonelpresettingsEdit.contextType = FormContext