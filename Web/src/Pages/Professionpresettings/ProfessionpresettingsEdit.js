import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { } from 'semantic-ui-react'
import { Breadcrumb, Form } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import Formatdate, { Getdateoptions } from '../../Utils/Formatdate'

export default class ProfessionpresettingsEdit extends Component {

  PAGE_NAME = "ProfessionpresettingsEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
    }
  }

  componentDidMount() {
    const { ProfessionpresettingID, GetProfessionpresetting, GetFloors, GetShifts, GetProfessions, match, history } = this.props
    let Id = ProfessionpresettingID || match?.params?.ProfessionpresettingID
    if (validator.isUUID(Id)) {
      GetProfessionpresetting(Id)
      GetFloors()
      GetShifts()
      GetProfessions()
    } else {
      history.push("/Professionpresetting")
    }
  }

  componentDidUpdate() {
    const { Professionpresettings, Floors, Professions, Shifts } = this.props
    const { selected_record, isLoading } = Professionpresettings
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0
      && !Floors.isLoading && !Professions.isLoading && !Shifts.isLoading
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
    const { Professionpresettings, Floors, Shifts, Professions, Profile, history } = this.props

    const Flooroptions = (Floors.list || []).filter(u => u.Isactive).map(floor => {
      return { key: floor.Uuid, text: floor.Name, value: floor.Uuid }
    })

    const Shiftoptions = (Shifts.list || []).filter(u => u.Isactive).map(shift => {
      return { key: shift.Uuid, text: shift.Name, value: shift.Uuid }
    })

    const Professionoptions = (Professions.list || []).filter(u => u.Isactive).map(profession => {
      return { key: profession.Uuid, text: profession.Name, value: profession.Uuid }
    })

    const Dateoptions = Getdateoptions()

    const Isinfinite = this.context.formstates[`${this.PAGE_NAME}/Isinfinite`]

    const isLoadingstatus =
      Professionpresettings.isLoading ||
      Floors.isLoading ||
      Shifts.isLoading ||
      Professions.isLoading

    return (
      isLoadingstatus ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Professionpresettings"}>
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
              <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Profession[Profile.Language]} name="ProfessionID" formtype="dropdown" options={Professionoptions} />
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Floor[Profile.Language]} name="FloorID" formtype="dropdown" options={Flooroptions} />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Shift[Profile.Language]} name="ShiftID" formtype="dropdown" options={Shiftoptions} />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Ispersonelstay[Profile.Language]} name="Ispersonelstay" formtype="checkbox" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Minpersonelcount[Profile.Language]} name="Minpersonelcount" type="number" />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Professionpresettings"}
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
    const { EditProfessionpresettings, Professionpresettings, history, fillProfessionpresettingnotification, Profile } = this.props
    const data = this.context.getForm(this.PAGE_NAME)

    !validator.isBoolean(data?.Isinfinite) && (data.Isinfinite = false)
    !validator.isBoolean(data?.Isapproved) && (data.Isapproved = false)
    !validator.isBoolean(data?.Iscompleted) && (data.Iscompleted = false)
    !validator.isBoolean(data?.Isdeactive) && (data.Isdeactive = false)
    !validator.isBoolean(data?.Ispersonelstay) && (data.Ispersonelstay = false)

    let errors = []

    if (!data.Isinfinite) {
      if (!validator.isISODate(data.Startdate)) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Daterequired[Profile.Language] })
      }
    }
    if (!validator.isUUID(data.ProfessionID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Professionrequired[Profile.Language] })
    }
    if (!validator.isUUID(data.ShiftID) && !validator.isUUID(data.FloorID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Floororshiftrequired[Profile.Language] })
    }

    if (errors.length > 0) {
      errors.forEach(error => {
        fillProfessionpresettingnotification(error)
      })
    } else {
      EditProfessionpresettings({ data: { ...Professionpresettings.selected_record, ...data }, history })
    }
  }
}
ProfessionpresettingsEdit.contextType = FormContext