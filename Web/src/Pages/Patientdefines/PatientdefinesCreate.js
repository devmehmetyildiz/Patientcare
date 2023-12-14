import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button,Accordion,Icon } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import CostumertypesCreate from '../../Containers/Costumertypes/CostumertypesCreate'
import PatienttypesCreate from '../../Containers/Patienttypes/PatienttypesCreate'
export default class PatientdefinesCreate extends Component {

  PAGE_NAME = "PatientdefinesCreate"

  constructor(props) {
    super(props)
    this.state = {
      isAccordionopen: false
    }
  }

  componentDidMount() {
    const { GetCostumertypes, GetPatienttypes, GetDepartments } = this.props
    GetCostumertypes()
    GetPatienttypes()
    GetDepartments()
  }

  render() {
    const { Costumertypes, Departments, Patienttypes, Patientdefines, Profile, history, closeModal } = this.props

    const Costumertypeoptions = (Costumertypes.list || []).filter(u => u.Isactive).map(costumertype => {
      let departments = (costumertype.Departmentuuids || [])
        .map(u => {
          const department = (Departments.list || []).find(department => department.Uuid === u.DepartmentID)
          if (department) {
            return department
          } else {
            return null
          }
        })
        .filter(u => u !== null);
      let ishavepatients = false;
      (departments || []).forEach(department => {
        if (department?.Ishavepatients) {
          ishavepatients = true
        }
      });

      if (ishavepatients) {
        return { key: costumertype.Uuid, text: costumertype.Name, value: costumertype.Uuid }
      } else {
        return null
      }
    }).filter(u => u !== null);

    const Patienttypeoptions = (Patienttypes.list || []).filter(u => u.Isactive).map(patienttype => {
      return { key: patienttype.Uuid, text: patienttype.Name, value: patienttype.Uuid }
    })

    const Liveoptions = [
      { key: 0, text: Literals.Options.Liveoptions.value0[Profile.Language], value: false },
      { key: 1, text: Literals.Options.Liveoptions.value1[Profile.Language], value: true }
    ]
    const Genderoptions = [
      { key: 0, text: Literals.Options.Genderoptions.value0[Profile.Language], value: "0" },
      { key: 1, text: Literals.Options.Genderoptions.value1[Profile.Language], value: "1" }
    ]
    const Affinityoptions = [
      { key: 0, text: Literals.Options.Affinityoptions.value0[Profile.Language], value: "0" },
      { key: 1, text: Literals.Options.Affinityoptions.value1[Profile.Language], value: "1" }
    ]

    const Medicalboardreportoptions = [
      { key: 0, text: "Ruhsal", value: "Ruhsal" },
      { key: 1, text: "Bedensel", value: "Bedensel" },
      { key: 2, text: "Zihinsel", value: "Zihinsel" }
    ]

    return (
      Patientdefines.isLoading || Patientdefines.isDispatching ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Patientdefines"}>
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
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Firstname[Profile.Language]} name="Firstname" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Lastname[Profile.Language]} name="Lastname" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Fathername[Profile.Language]} name="Fathername" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Mothername[Profile.Language]} name="Mothername" />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.CountryID[Profile.Language]} name="CountryID" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.CostumertypeName[Profile.Language]} name="CostumertypeID" options={Costumertypeoptions} formtype="dropdown" modal={CostumertypesCreate} />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.PatienttypeName[Profile.Language]} name="PatienttypeID" options={Patienttypeoptions} formtype="dropdown" modal={PatienttypesCreate} />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Medicalboardreport[Profile.Language]} name="Medicalboardreport" options={Medicalboardreportoptions} formtype="dropdown" />
              </Form.Group>
              <div className='my-4 h-[1px] w-full' />
              <Accordion>
                <Accordion.Title
                  active={this.state.isAccordionopen}
                  onClick={() => { this.setState({ isAccordionopen: !this.state.isAccordionopen }) }}
                >
                  <Icon name='dropdown' />
                  Ek Bilgiler
                </Accordion.Title>
                <Accordion.Content active={this.state.isAccordionopen}>
                  <Form.Group widths='equal'>
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Motherbiologicalaffinity[Profile.Language]} name="Motherbiologicalaffinity" options={Affinityoptions} formtype="dropdown" />
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Fatherbiologicalaffinity[Profile.Language]} name="Fatherbiologicalaffinity" options={Affinityoptions} formtype="dropdown" />
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Ismotheralive[Profile.Language]} name="Ismotheralive" options={Liveoptions} formtype="dropdown" />
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Isfatheralive[Profile.Language]} name="Isfatheralive" options={Liveoptions} formtype="dropdown" />
                  </Form.Group>
                  <Form.Group widths='equal'>
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Dateofbirth[Profile.Language]} name="Dateofbirth" type='date' />
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Placeofbirth[Profile.Language]} name="Placeofbirth" />
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Dateofdeath[Profile.Language]} name="Dateofdeath" type='date' />
                  </Form.Group>
                  <Form.Group widths='equal'>
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Placeofbirth[Profile.Language]} name="Placeofdeath" />
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Deathinfo[Profile.Language]} name="Deathinfo" />
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Gender[Profile.Language]} name="Gender" options={Genderoptions} formtype="dropdown" />
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Marialstatus[Profile.Language]} name="Marialstatus" />
                  </Form.Group>
                  <Form.Group widths='equal'>
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Childnumber[Profile.Language]} name="Childnumber" type='number' />
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Disabledchildnumber[Profile.Language]} name="Disabledchildnumber" type='number' />
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Siblingstatus[Profile.Language]} name="Siblingstatus" />
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Sgkstatus[Profile.Language]} name="Sgkstatus" />
                  </Form.Group>
                  <Form.Group widths='equal'>
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Budgetstatus[Profile.Language]} name="Budgetstatus" />
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.City[Profile.Language]} name="City" />
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Town[Profile.Language]} name="Town" />
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Address1[Profile.Language]} name="Address1" />
                  </Form.Group>
                  <Form.Group widths='equal'>
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Address2[Profile.Language]} name="Address2" />
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Country[Profile.Language]} name="Country" />
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Contactnumber1[Profile.Language]} name="Contactnumber1" />
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Contactnumber2[Profile.Language]} name="Contactnumber2" />
                  </Form.Group>
                  <Form.Group widths='equal'>
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Contactname1[Profile.Language]} name="Contactname1" />
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Contactname2[Profile.Language]} name="Contactname2" />
                  </Form.Group>
                </Accordion.Content>
              </Accordion>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Patientdefines"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Patientdefines.isLoading}
              buttonText={Literals.Button.Create[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { AddPatientdefines, history, fillPatientdefinenotification, Profile, closeModal } = this.props
    const data = this.context.getForm(this.PAGE_NAME)

    if (!data.Dateofbirth || data.Dateofbirth === '') {
      data.Dateofbirth = null
    }
    if (!data.Dateofdeath || data.Dateofdeath === '') {
      data.Dateofdeath = null
    }
    if (!data.Childnumber || data.Childnumber === '') {
      data.Childnumber = 0
    }
    if (!data.Disabledchildnumber || data.Disabledchildnumber === '') {
      data.Disabledchildnumber = 0
    }
    data.Childnumber && (data.Childnumber = parseInt(data.Childnumber))
    data.Disabledchildnumber && (data.Disabledchildnumber = parseInt(data.Disabledchildnumber))
    data.Childnumber && (data.Childnumber = parseInt(data.Childnumber))

    let errors = []

    if (!validator.isString(data.CountryID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.CountryIDrequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatientdefinenotification(error)
      })
    } else {
      AddPatientdefines({ data, history, closeModal })
    }
  }
}
PatientdefinesCreate.contextType = FormContext