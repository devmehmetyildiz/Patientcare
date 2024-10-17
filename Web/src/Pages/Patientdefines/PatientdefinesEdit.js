import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Accordion, Icon } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import CostumertypesCreate from '../../Containers/Costumertypes/CostumertypesCreate'
import PatienttypesCreate from '../../Containers/Patienttypes/PatienttypesCreate'
import Formatdate from '../../Utils/Formatdate'
import { AFFINITY_OPTION_OWN, AFFINITY_OPTION_STEP, DEPENDENCY_OPTION_FULLY, DEPENDENCY_OPTION_NON, DEPENDENCY_OPTION_PARTIAL, GENDER_OPTION_MEN, GENDER_OPTION_WOMEN, LIVE_OPTION_LIVING, LIVE_OPTION_NOT_LIVING, MEDICALBOARDREPORT_OPTION_MENTAL, MEDICALBOARDREPORT_OPTION_PHYSICAL, MEDICALBOARDREPORT_OPTION_SPIRITUAL } from '../../Utils/Constants'
export default class PatientdefinesEdit extends Component {

  PAGE_NAME = "PatientdefinesEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
      isAccordionopen: false
    }
  }

  componentDidMount() {
    const { GetPatientdefine, GetDepartments, match, history, GetCostumertypes, GetPatienttypes, PatientdefineID } = this.props
    let Id = PatientdefineID || match?.params?.PatientdefineID
    if (validator.isUUID(Id)) {
      GetPatientdefine(Id)
      GetCostumertypes()
      GetPatienttypes()
      GetDepartments()
    } else {
      history.push("/Patientdefines")
    }
  }

  componentDidUpdate() {
    const { Patientdefines, Costumertypes, Departments, Patienttypes } = this.props
    const { selected_record, isLoading } = Patientdefines
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 &&
      !Costumertypes.isLoading &&
      !Patienttypes.isLoading &&
      !Departments.isLoading &&
      !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, {
        ...selected_record,
        Dateofbirth: Formatdate(selected_record?.Dateofbirth),
        Dateofdeath: Formatdate(selected_record?.Dateofdeath),
      })
    }
  }

  render() {
    const { Costumertypes, Departments, Patienttypes, Patientdefines, Profile, history } = this.props

    const t = Profile?.i18n?.t

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
      { key: 0, text: t('Option.Liveoption.Notliving'), value: LIVE_OPTION_NOT_LIVING },
      { key: 1, text: t('Option.Liveoption.Living'), value: LIVE_OPTION_LIVING }
    ]

    const Genderoptions = [
      { key: 0, text: t('Option.Genderoption.Men'), value: GENDER_OPTION_MEN },
      { key: 1, text: t('Option.Genderoption.Women'), value: GENDER_OPTION_WOMEN }
    ]

    const Affinityoptions = [
      { key: 0, text: t('Option.Affinityoption.Own'), value: AFFINITY_OPTION_OWN },
      { key: 1, text: t('Option.Affinityoption.Step'), value: AFFINITY_OPTION_STEP }
    ]

    const Medicalboardreportoptions = [
      { key: 0, text: t('Option.Medicalboardreportoption.Spiritual'), value: MEDICALBOARDREPORT_OPTION_SPIRITUAL },
      { key: 1, text: t('Option.Medicalboardreportoption.Physical'), value: MEDICALBOARDREPORT_OPTION_PHYSICAL },
      { key: 2, text: t('Option.Medicalboardreportoption.Mental'), value: MEDICALBOARDREPORT_OPTION_MENTAL }
    ]

    const Dependencyoptions = [
      { key: 0, text: t('Option.Dependencyoption.Fully'), value: DEPENDENCY_OPTION_FULLY },
      { key: 1, text: t('Option.Dependencyoption.Partial'), value: DEPENDENCY_OPTION_PARTIAL },
      { key: 2, text: t('Option.Dependencyoption.Non'), value: DEPENDENCY_OPTION_NON }
    ]

    return (
      Patientdefines.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Patientdefines"}>
                <Breadcrumb.Section >{t('Pages.Patientdefines.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Patientdefines.Page.EditHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patientdefines.Column.Firstname')} name="Firstname" />
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patientdefines.Column.Lastname')} name="Lastname" />
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patientdefines.Column.Fathername')} name="Fathername" />
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patientdefines.Column.Mothername')} name="Mothername" />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Patientdefines.Column.CountryID')} name="CountryID" validationfunc={validator.isCountryID} validationmessage={"Geçerli Bir Tc Giriniz!"} />
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patientdefines.Column.Costumertype')} name="CostumertypeID" options={Costumertypeoptions} formtype="dropdown" modal={CostumertypesCreate} />
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patientdefines.Column.Patienttype')} name="PatienttypeID" options={Patienttypeoptions} formtype="dropdown" modal={PatienttypesCreate} />
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patientdefines.Column.Medicalboardreport')} name="Medicalboardreport" options={Medicalboardreportoptions} formtype="dropdown" />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patientdefines.Column.Dependency')} name="Dependency" options={Dependencyoptions} formtype="dropdown" />
              </Form.Group>
              <div className='my-4 h-[1px] w-full' />
              <Accordion>
                <Accordion.Title
                  active={this.state.isAccordionopen}
                  onClick={() => { this.setState({ isAccordionopen: !this.state.isAccordionopen }) }}
                >
                  <Icon name='dropdown' />
                  {t('Pages.Patientdefines.Column.Additinal')}
                </Accordion.Title>
                <Accordion.Content active={this.state.isAccordionopen}>
                  <Form.Group widths='equal'>
                    <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patientdefines.Column.Motherbiologicalaffinity')} name="Motherbiologicalaffinity" options={Affinityoptions} formtype="dropdown" />
                    <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patientdefines.Column.Fatherbiologicalaffinity')} name="Fatherbiologicalaffinity" options={Affinityoptions} formtype="dropdown" />
                    <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patientdefines.Column.Ismotheralive')} name="Ismotheralive" options={Liveoptions} formtype="dropdown" />
                    <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patientdefines.Column.Isfatheralive')} name="Isfatheralive" options={Liveoptions} formtype="dropdown" />
                  </Form.Group>
                  <Form.Group widths='equal'>
                    <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patientdefines.Column.Dateofbirth')} name="Dateofbirth" type='date' />
                    <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patientdefines.Column.Placeofbirth')} name="Placeofbirth" />
                    <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patientdefines.Column.Gender')} name="Gender" options={Genderoptions} formtype="dropdown" />
                    <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patientdefines.Column.Marialstatus')} name="Marialstatus" />
                  </Form.Group>
                  <Form.Group widths='equal'>
                    <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patientdefines.Column.Childnumber')} name="Childnumber" type='number' min={0} max={99} />
                    <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patientdefines.Column.Disabledchildnumber')} name="Disabledchildnumber" type='number' min={0} max={99} />
                    <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patientdefines.Column.Siblingstatus')} name="Siblingstatus" type='number' min={0} max={99} />
                    <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patientdefines.Column.Sgkstatus')} name="Sgkstatus" />
                  </Form.Group>
                  <Form.Group widths='equal'>
                    <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patientdefines.Column.Budgetstatus')} name="Budgetstatus" />
                    <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patientdefines.Column.City')} name="City" />
                    <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patientdefines.Column.Town')} name="Town" />
                    <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patientdefines.Column.Country')} name="Country" />
                  </Form.Group>
                  <Form.Group widths='equal'>
                    <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patientdefines.Column.Address1')} name="Address1" />
                    <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patientdefines.Column.Address2')} name="Address2" />
                  </Form.Group>
                  <Form.Group widths='equal'>
                    <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patientdefines.Column.Contactname1')} name="Contactname1" />
                    <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patientdefines.Column.Contactnumber1')} name="Contactnumber1" />
                  </Form.Group>
                  <Form.Group widths='equal'>
                    <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patientdefines.Column.Contactname2')} name="Contactname2" />
                    <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patientdefines.Column.Contactnumber2')} name="Contactnumber2" />
                  </Form.Group>
                </Accordion.Content>
              </Accordion>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Patientdefines"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Patientdefines.isLoading}
              buttonText={t('Common.Button.Update')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { EditPatientdefines, history, fillPatientdefinenotification, Patientdefines, Profile } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)

    if (!data.Dateofbirth || data.Dateofbirth === '') {
      data.Dateofbirth = null
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

    if (!validator.isString(data.CountryID) || !validator.isCountryID(data.CountryID)) {
      errors.push({ type: 'Error', code: t('Pages.Patientdefines.Page.Header'), description: t('Pages.Patientdefines.Messages.CountryIDRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatientdefinenotification(error)
      })
    } else {
      EditPatientdefines({ data: { ...Patientdefines.selected_record, ...data }, history, redirectUrl: (history?.location?.state?.redirectUrl || '/Patientdefines') })
    }
  }
}
PatientdefinesEdit.contextType = FormContext