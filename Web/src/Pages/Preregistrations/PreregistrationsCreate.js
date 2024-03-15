import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form, Label } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import PatientdefinesCreate from '../../Containers/Patientdefines/PatientdefinesCreate'
import DepartmentsCreate from '../../Containers/Departments/DepartmentsCreate'
import CasesCreate from '../../Containers/Cases/CasesCreate'
import CostumertypesCreate from '../../Containers/Costumertypes/CostumertypesCreate'
import PatienttypesCreate from '../../Containers/Patienttypes/PatienttypesCreate'
export default class PreregistrationsCreate extends Component {

  PAGE_NAME = 'PreregistrationsCreate'

  constructor(props) {
    super(props)
    this.state = {
      newRegister: true,
      Isdatafetched: false,
    }
  }


  componentDidMount() {
    const { GetPatientdefines, GetDepartments, GetCases, GetCostumertypes, GetPatienttypes } = this.props
    GetPatientdefines()
    GetDepartments()
    GetCases()
    GetCostumertypes()
    GetPatienttypes()
  }

  componentDidUpdate() {
    const { Patientdefines, Patients, Departments, Cases } = this.props

    const loadingstatus = Patients.isLoading && Departments.isLoading && Cases.isLoading && Patientdefines.isLoading
    if (!loadingstatus && !this.state.Isdatafetched) {
      setTimeout(() => {
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        this.context.setForm(this.PAGE_NAME, {
          [`Registerdate`]: formattedDate
        })
        this.setState({ Isdatafetched: true })
      }, 500);
    }
  }

  render() {

    const { Patientdefines, Patients, Departments, Cases, Profile, history, closeModal, Costumertypes, Patienttypes } = this.props
    const { isLoading } = Patients

    const Patientdefineoptions = (Patientdefines.list || []).filter(u => u.Isactive).map(define => {
      return { key: define.Uuid, text: `${define.Firstname} ${define.Lastname}-${define.CountryID}`, value: define.Uuid }
    })

    const Departmentoptions = (Departments.list || []).filter(u => u.Isactive && u.Ishavepatients).map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })

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

    const Casesoptions = (Cases.list || []).filter(u => u.Isactive).filter(u => u.CaseStatus === 2).map(cases => {
      let departments = (cases.Departmentuuids || [])
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
        return { key: cases.Uuid, text: cases.Name, value: cases.Uuid }
      } else {
        return null
      }
    }).filter(u => u !== null);

    const Genderoptions = [
      { key: 0, text: 'ERKEK', value: "ERKEK" },
      { key: 1, text: 'KADIN', value: "KADIN" }
    ]

    const Medicalboardreportoptions = [
      { key: 0, text: "Ruhsal", value: "Ruhsal" },
      { key: 1, text: "Bedensel", value: "Bedensel" },
      { key: 2, text: "Zihinsel", value: "Zihinsel" }
    ]

    const defaultDepartment = (Departments.list || []).filter(u => u.Isactive).find(u => u.Isdefaultpatientdepartment)

    return (
      isLoading  ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Preregistrations"}>
                <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Label className='cursor-pointer' onClick={() => { this.handleRegistertype() }}>{!this.state.newRegister ? Literals.Columns.Registered[Profile.Language] : Literals.Columns.Newregister[Profile.Language]}</Label>
              {!this.state.newRegister
                ? <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Patientdefine[Profile.Language]} name="PatientdefineID" options={Patientdefineoptions} formtype="dropdown" required modal={PatientdefinesCreate} />
                : <React.Fragment>
                  <Form.Group widths={'equal'}>
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Firstname[Profile.Language]} name="Firstname" />
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Lastname[Profile.Language]} name="Lastname" />
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.CountryID[Profile.Language]} name="CountryID" required maxLength={11} validationfunc={this.validateTcNumber} validationmessage={"Geçerli Bir Tc Giriniz!"} />
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Costumertype[Profile.Language]} name="CostumertypeID" options={Costumertypeoptions} formtype="dropdown" modal={CostumertypesCreate} />
                  </Form.Group>
                  <Form.Group widths={'equal'}>
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Patienttype[Profile.Language]} name="PatienttypeID" options={Patienttypeoptions} formtype="dropdown" modal={PatienttypesCreate} />
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Medicalboardreport[Profile.Language]} name="Medicalboardreport" options={Medicalboardreportoptions} formtype='dropdown' />
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Dateofbirth[Profile.Language]} name="Dateofbirth" type="date" />
                    <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Gender[Profile.Language]} name="Gender" options={Genderoptions} formtype="dropdown" />
                  </Form.Group>
                </React.Fragment>
              }
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Registerdate[Profile.Language]} name="Registerdate" type='date' required />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Happensdate[Profile.Language]} name="Happensdate" type='date' />
              </Form.Group>
              <Form.Group widths={'equal'}>
                {!defaultDepartment ? <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Deparment[Profile.Language]} name="DepartmentID" options={Departmentoptions} formtype="dropdown" required modal={DepartmentsCreate} /> : null}
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Case[Profile.Language]} name="CaseID" options={Casesoptions} formtype="dropdown" required modal={CasesCreate} />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Preregistrations"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={isLoading}
              buttonText={Literals.Button.Create[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { Patientdefines, fillPatientnotification, AddPatients, history, Profile, closeModal, Departments } = this.props

    const defaultDepartment = (Departments.list || []).filter(u => u.Isactive).find(u => u.Isdefaultpatientdepartment)

    const data = this.context.getForm(this.PAGE_NAME)
    if (!validator.isISODate(data.Registerdate)) {
      data.Registerdate = null
    }
    if (!validator.isISODate(data.Approvaldate)) {
      data.Approvaldate = null
    }
    if (!validator.isISODate(data.Happensdate)) {
      data.Happensdate = null
    }
    if (!validator.isISODate(data.Dateofbirth)) {
      data.Dateofbirth = null
    }
    defaultDepartment ? (data.DepartmentID = defaultDepartment?.Uuid) : data.DepartmentID = this.context.formstates[`${this.PAGE_NAME}/DepartmentID`]

    const response = {
      Stocks: [],
      Patientstatus: 0,
      Files: [],
      Releasedate: null,
      RoomID: "",
      FloorID: "",
      BedID: "",
      Iswaitingactivation: true,
      ImageID: "",
      PatientdefineID: "",
      Patientdefine: {},
      Approvaldate: data.Approvaldate,
      Registerdate: data.Registerdate,
      Happensdate: data.Happensdate,
      DepartmentID: data.DepartmentID,
      CheckperiodID: "",
      TodogroupdefineID: "",
      CaseID: this.context.formstates[`${this.PAGE_NAME}/CaseID`]
    }

    if (this.state.newRegister) {
      response.Patientdefine = {
        CountryID: data.CountryID,
        Dateofbirth: data.Dateofbirth,
        Fathername: data.Fathername,
        Firstname: data.Firstname,
        Lastname: data.Lastname,
        Medicalboardreport: data.Medicalboardreport,
        Mothername: data.Mothername,
        Placeofbirth: data.Placeofbirth,
        Gender: this.context.formstates[`${this.PAGE_NAME}/Gender`],
        CostumertypeID: data.CostumertypeID,
        PatienttypeID: data.PatienttypeID,
      }
    } else {
      response.Patientdefine = (Patientdefines.list || []).find(u => u.Uuid === this.context.formstates[`${this.PAGE_NAME}/PatientdefineID`])
      response.PatientdefineID = response.Patientdefine?.Uuid
    }

    let errors = []
    if (!validator.isUUID(response.DepartmentID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Departmentrequired[Profile.Language] })
    }
    if (!validator.isUUID(response.CaseID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.CaseID[Profile.Language] })
    }
    if (!validator.isISODate(response.Registerdate)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Registerdaterequired[Profile.Language] })
    }
    if (this.state.newRegister ? !validator.isString(response.Patientdefine?.CountryID) : !validator.isUUID(response.PatientdefineID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Patientdefinerequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatientnotification(error)
      })
    } else {
      AddPatients({ data: response, history, redirectUrl: "/Preregistrations", closeModal })
    }
  }

  validateTcNumber = (tcNumber) => {
    if (/^[1-9][0-9]{10}$/.test(tcNumber)) {
      const numberArray = tcNumber.split('').map(Number);
      const lastDigit = numberArray.pop();
      const sum = numberArray.reduce((acc, current, index) => acc + current, 0);
      const tenthDigit = sum % 10;

      if ((tenthDigit === lastDigit && numberArray[0] !== 0) || (sum % 10 === 0 && lastDigit === 0)) {
        return true;
      }
    }
    return false;
  };

  handleRegistertype = () => {
    this.setState({ newRegister: !this.state.newRegister })
    this.context.setFormstates({
      ...this.context.formstates,
      [`${this.PAGE_NAME}/PatientdefineID`]: null,
      [`${this.PAGE_NAME}/Firstname`]: null,
      [`${this.PAGE_NAME}/Lastname`]: null,
      [`${this.PAGE_NAME}/Fathername`]: null,
      [`${this.PAGE_NAME}/Mothername`]: null,
      [`${this.PAGE_NAME}/CountryID`]: null,
      [`${this.PAGE_NAME}/Dateofbirth`]: null,
      [`${this.PAGE_NAME}/Placeofbirth`]: null,
      [`${this.PAGE_NAME}/Gender`]: null,
    })
  }
}
PreregistrationsCreate.contextType = FormContext