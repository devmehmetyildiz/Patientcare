import React, { useContext, useEffect, useState } from 'react'
import { Accordion, Breadcrumb, Button, Card, Divider, Form, Grid, GridColumn, Icon, Transition } from 'semantic-ui-react'
import { Contentwrapper, FormInput, Headerwrapper } from '../../Components'
import { Link } from 'react-router-dom'
import { FormContext } from '../../Provider/FormProvider'
import CostumertypesCreate from '../../Containers/Costumertypes/CostumertypesCreate'
import PatienttypesCreate from '../../Containers/Patienttypes/PatienttypesCreate'
import { AFFINITY_OPTION, GENDER_OPTION, LIVE_OPTION, MEDICALBOARDREPORT_OPTION } from '../../Utils/Constants'
import CasesCreate from '../../Containers/Cases/CasesCreate'
import DepartmentsCreate from '../../Containers/Departments/DepartmentsCreate'
import Formatdate from '../../Utils/Formatdate'
import validator from '../../Utils/Validator'

export default function PreregistrationsPrepareStepOne({
  Preparestatus,
  setCompletedSteps,
  goNext,
  stepKey,
  PAGE_NAME,
  Profile,
  GetPatientdefines,
  GetCostumertypes,
  GetPatienttypes,
  GetDepartments,
  GetCases,
  Patientdefines,
  Costumertypes,
  Patienttypes,
  Departments,
  Cases
}) {

  const t = Profile?.i18n?.t
  const context = useContext(FormContext)
  const [detailopen, setDetailopen] = useState(false)
  const [newpatient, setNewpatient] = useState(true)
  const [departmentFetched, setDepartmentFetched] = useState(false)
  const PatientdefinePagename = `${PAGE_NAME}-Patientdefine`

  useEffect(() => {
    GetPatientdefines()
    GetCostumertypes()
    GetPatienttypes()
    GetDepartments()
    GetCases()
    context.setFormstates(prev => ({
      ...prev,
      [`${PAGE_NAME}/Registerdate`]: Formatdate(new Date()),
    }))
  }, [])

  useEffect(() => {
    if (!Departments.isLoading && !departmentFetched) {
      const defaultDepartment = (Departments.list || []).filter(u => u.Isactive).find(u => u.Isdefaultpatientdepartment)
      if (defaultDepartment) {
        context.setFormstates(prev => ({
          ...prev,
          [`${PAGE_NAME}/DepartmentID`]: defaultDepartment?.Uuid,
        }))
        setDepartmentFetched(true)
      }
    }
  })

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


  const handleResetpatientknowledge = () => {
    context.setFormstates(prev => ({
      ...prev,
      [`${PAGE_NAME}/PatientdefineID`]: null,
      [`${PatientdefinePagename}/Firstname`]: null,
      [`${PatientdefinePagename}/Lastname`]: null,
      [`${PatientdefinePagename}/Fathername`]: null,
      [`${PatientdefinePagename}/Mothername`]: null,
      [`${PatientdefinePagename}/CountryID`]: null,
      [`${PatientdefinePagename}/Dateofbirth`]: null,
      [`${PatientdefinePagename}/Placeofbirth`]: null,
      [`${PatientdefinePagename}/Gender`]: null,
    }))
  }

  return (
    <Transition transitionOnMount animation='fade right' duration={500}>
      <div className='w-full'>
        <Contentwrapper>
          <Headerwrapper>
            <Grid columns='2' >
              <GridColumn width={8}>
                <Breadcrumb size='big'>
                  <Link to={"/Purchaseorders"}>
                    <Breadcrumb.Section>
                      {newpatient
                        ? t('Pages.Preregistrations.PrepareStepOne.Label.Newregister')
                        : t('Pages.Preregistrations.PrepareStepOne.Label.Registered')
                      }
                    </Breadcrumb.Section>
                  </Link>
                </Breadcrumb>
              </GridColumn>
              {Preparestatus !== 'edit' ?
                <GridColumn>
                  <div className='w-full flex justify-end items-center'>
                    <Button
                      className='mt-8 !bg-[#2355a0] !text-white whitespace-nowrap'
                      onClick={(e) => {
                        e.preventDefault()
                        setNewpatient(prev => !prev)
                        handleResetpatientknowledge()
                      }}
                    >
                      {t('Pages.Preregistrations.PrepareStepOne.Label.Changeregister')}
                    </Button>
                  </div>
                </GridColumn> : null}
            </Grid>
          </Headerwrapper>
          <Form>
            {newpatient && Preparestatus !== 'edit'
              ? <Card fluid>
                <Card.Content>
                  <React.Fragment>
                    <Form.Group widths='equal'>
                      <FormInput page={PatientdefinePagename} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Firstname')} name="Firstname" />
                      <FormInput page={PatientdefinePagename} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Lastname')} name="Lastname" />
                      <FormInput page={PatientdefinePagename} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Fathername')} name="Fathername" />
                      <FormInput page={PatientdefinePagename} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Mothername')} name="Mothername" />
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                      <FormInput page={PatientdefinePagename} required placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.CountryID')} name="CountryID" validationfunc={validator.isCountryID} validationmessage={"Geçerli Bir Tc Giriniz!"} />
                      <FormInput page={PatientdefinePagename} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Costumertype')} name="CostumertypeID" options={Costumertypeoptions} formtype="dropdown" modal={CostumertypesCreate} />
                      <FormInput page={PatientdefinePagename} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Patienttype')} name="PatienttypeID" options={Patienttypeoptions} formtype="dropdown" modal={PatienttypesCreate} />
                      <FormInput page={PatientdefinePagename} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Medicalboardreport')} name="Medicalboardreport" options={MEDICALBOARDREPORT_OPTION.map(u => ({ ...u, text: u.text[Profile.Language] }))} formtype="dropdown" />
                    </Form.Group>
                    <div className='my-4 h-[1px] w-full' />
                    <Accordion>
                      <Accordion.Title
                        active={detailopen}
                        onClick={() => { setDetailopen(prev => !prev) }}
                      >
                        <Divider horizontal>
                          Ek Bilgiler
                          <Icon name='dropdown' />
                        </Divider>
                      </Accordion.Title>
                    </Accordion>
                    <Transition visible={detailopen} animation='slide down' duration={500}>
                      <div>
                        <Form.Group widths='equal'>
                          <FormInput page={PatientdefinePagename} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Motherbiologicalaffinity')} name="Motherbiologicalaffinity" options={AFFINITY_OPTION.map(u => ({ ...u, text: u.text[Profile.Language] }))} formtype="dropdown" />
                          <FormInput page={PatientdefinePagename} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Fatherbiologicalaffinity')} name="Fatherbiologicalaffinity" options={AFFINITY_OPTION.map(u => ({ ...u, text: u.text[Profile.Language] }))} formtype="dropdown" />
                          <FormInput page={PatientdefinePagename} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Ismotheralive')} name="Ismotheralive" options={LIVE_OPTION.map(u => ({ ...u, text: u.text[Profile.Language] }))} formtype="dropdown" />
                          <FormInput page={PatientdefinePagename} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Isfatheralive')} name="Isfatheralive" options={LIVE_OPTION.map(u => ({ ...u, text: u.text[Profile.Language] }))} formtype="dropdown" />
                        </Form.Group>
                        <Form.Group widths='equal'>
                          <FormInput page={PatientdefinePagename} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Dateofbirth')} name="Dateofbirth" type='date' />
                          <FormInput page={PatientdefinePagename} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Placeofbirth')} name="Placeofbirth" />
                          <FormInput page={PatientdefinePagename} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Gender')} name="Gender" options={GENDER_OPTION.map(u => ({ ...u, text: u.text[Profile.Language] }))} formtype="dropdown" />
                          <FormInput page={PatientdefinePagename} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Marialstatus')} name="Marialstatus" />
                        </Form.Group>
                        <Form.Group widths='equal'>
                          <FormInput page={PatientdefinePagename} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Childnumber')} name="Childnumber" type='number' />
                          <FormInput page={PatientdefinePagename} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Disabledchildnumber')} name="Disabledchildnumber" type='number' />
                          <FormInput page={PatientdefinePagename} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Siblingstatus')} name="Siblingstatus" />
                          <FormInput page={PatientdefinePagename} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Sgkstatus')} name="Sgkstatus" />
                        </Form.Group>
                        <Form.Group widths='equal'>
                          <FormInput page={PatientdefinePagename} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Budgetstatus')} name="Budgetstatus" />
                          <FormInput page={PatientdefinePagename} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.City')} name="City" />
                          <FormInput page={PatientdefinePagename} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Town')} name="Town" />
                          <FormInput page={PatientdefinePagename} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Country')} name="Country" />
                        </Form.Group>
                        <Form.Group widths='equal'>
                          <FormInput page={PatientdefinePagename} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Address1')} name="Address1" />
                          <FormInput page={PatientdefinePagename} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Address2')} name="Address2" />
                        </Form.Group>
                        <Form.Group widths='equal'>
                          <FormInput page={PatientdefinePagename} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Contactname1')} name="Contactname1" />
                          <FormInput page={PatientdefinePagename} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Contactnumber1')} name="Contactnumber1" />
                        </Form.Group>
                        <Form.Group widths={'equal'}>
                          <FormInput page={PatientdefinePagename} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Contactname2')} name="Contactname2" />
                          <FormInput page={PatientdefinePagename} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Contactnumber2')} name="Contactnumber2" />
                        </Form.Group>
                      </div>
                    </Transition>
                  </React.Fragment>
                </Card.Content>
              </Card>
              : <FormInput disabled={Preparestatus === 'edit'} page={PAGE_NAME} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Patientdefine')} name="PatientdefineID" formtype="dropdown" required options={Patientdefineoptions} />
            }
            <Form.Group widths={'equal'}>
              <FormInput page={PAGE_NAME} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Approvaldate')} name="Approvaldate" type='date' required />
              <FormInput page={PAGE_NAME} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Happensdate')} name="Happensdate" type='date' />
            </Form.Group>
            <Form.Group widths={'equal'}>
              <FormInput page={PAGE_NAME} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Registerdate')} name="Registerdate" type='date' />
              <FormInput page={PAGE_NAME} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Case')} name="CaseID" formtype='dropdown' required options={Casesoptions} modal={CasesCreate} />
            </Form.Group>
            <Form.Group widths={'equal'}>
              <FormInput page={PAGE_NAME} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Info')} name="Info" />
              <FormInput page={PAGE_NAME} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Guardiannote')} name="Guardiannote" />
            </Form.Group>
            <Form.Group widths={'equal'}>
              <FormInput page={PAGE_NAME} placeholder={t('Pages.Preregistrations.PrepareStepOne.Label.Deparment')} name="DepartmentID" formtype='dropdown' required options={Departmentoptions} modal={DepartmentsCreate} />
            </Form.Group>
            <div className='w-full flex justify-center items-center'>
              <Button
                className='mt-8 !bg-[#2355a0] !text-white whitespace-nowrap'
                size='medium'
                onClick={(e) => {
                  e.preventDefault()
                  setCompletedSteps(prev => [...prev, stepKey])
                  goNext()
                }}
              >
                {t('Common.Button.GoNext')}
                <Icon name='right arrow' />
              </Button>
            </div>
          </Form>
        </Contentwrapper>
      </div>
    </Transition>
  )
}
