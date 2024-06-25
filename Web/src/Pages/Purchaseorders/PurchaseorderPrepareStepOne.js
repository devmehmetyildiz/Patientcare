import React, { useContext, useEffect } from 'react'
import { Breadcrumb, Button, Form, Grid, GridColumn, Icon, Transition } from 'semantic-ui-react'
import { Contentwrapper, FormInput, Headerwrapper, Pagedivider } from '../../Components'
import Literals from './Literals'
import { Link } from 'react-router-dom'
import { DELIVERY_TYPES, DELIVERY_TYPE_PATIENT, DELIVERY_TYPE_WAREHOUSE } from '../../Utils/Constants'
import { FormContext } from '../../Provider/FormProvider'

export default function PurchaseorderPrepareStepOne({ Preparestatus, setCompletedSteps, goNext, stepKey, PAGE_NAME, Profile, GetUsers, GetWarehouses, GetPatients, GetCases, GetPatientdefines, GetDepartments, Warehouses, Departments, Patients, Patientdefines, Users, Cases }) {

    const context = useContext(FormContext)

    useEffect(() => {
        GetUsers()
        GetWarehouses()
        GetPatients()
        GetPatientdefines()
        GetCases()
        GetDepartments()
    }, [])


    const Useroptions = (Users.list || []).filter(u => u.Isactive).map(personel => {
        return { key: personel.Uuid, text: `${personel?.Name} ${personel?.Surname}`, value: personel.Uuid }
    })

    const Warehouseoptions = (Warehouses.list || []).filter(u => u.Isactive).map(warehouse => {
        return { key: warehouse.Uuid, text: warehouse?.Name, value: warehouse.Uuid }
    })

    const Patientoptions = (Patients.list || []).filter(u => u.Isactive).map(patient => {
        const patientdefine = (Patientdefines.list || []).find(patientdefine => patientdefine?.Uuid === patient?.PatientdefineID)
        return { key: patient.Uuid, text: `${patientdefine?.Firstname} ${patientdefine?.Lastname} (${patientdefine?.CountryID})`, value: patient.Uuid }
    })

    const Caseoption = (Cases.list || []).filter(u => u.Isactive).map(casedata => {
        const departmentuuids = (casedata?.Departmentuuids || []).map(u => u.DepartmentID);
        let isHavepatients = false
        departmentuuids.forEach(departmentuuid => {
            const department = (Departments.list || []).find(u => u.Uuid === departmentuuid)
            if (department?.Ishavepatients === true || department?.Ishavepatients === 1) {
                isHavepatients = true
            }
        });
        return isHavepatients === false && casedata?.CaseStatus === Preparestatus ? { key: casedata.Uuid, text: casedata.Name, value: casedata.Uuid } : false
    }).filter(u => u)

    const Delivertypeoptions = (DELIVERY_TYPES || []).map(type => {
        return { key: type.key, text: type.Name[Profile.Language], value: type.value }
    })

    const selectedDeliverytype = context.formstates[`${PAGE_NAME}/Deliverytype`]

    return (
        <Transition transitionOnMount animation='fade right' duration={500}>
            <div className='w-full'>
                <Contentwrapper>
                    <Headerwrapper>
                        <Grid columns='2' >
                            <GridColumn width={8}>
                                <Breadcrumb size='big'>
                                    <Link to={"/Purchaseorders"}>
                                        <Breadcrumb.Section>{Literals.Page.Pageinfoheader[Profile.Language]}</Breadcrumb.Section>
                                    </Link>
                                </Breadcrumb>
                            </GridColumn>
                        </Grid>
                    </Headerwrapper>
                    <Form>
                        <Form.Group widths={'equal'}>
                            <FormInput page={PAGE_NAME} required placeholder={Literals.Columns.Company[Profile.Language]} name="Company" />
                            <FormInput page={PAGE_NAME} placeholder={Literals.Columns.Info[Profile.Language]} name="Info" />
                        </Form.Group>
                        <Form.Group widths={'equal'}>
                            <FormInput page={PAGE_NAME} placeholder={Literals.Columns.Delivereruser[Profile.Language]} name="Delivereruser" />
                            <FormInput page={PAGE_NAME} placeholder={Literals.Columns.Receiveruser[Profile.Language]} name="ReceiveruserID" options={Useroptions} formtype='dropdown' loading={Users.isLoading} />
                        </Form.Group>
                        <Pagedivider />
                        <Form.Group widths={'equal'}>
                            <FormInput page={PAGE_NAME} placeholder={Literals.Columns.Deliverytype[Profile.Language]} name="Deliverytype" options={Delivertypeoptions} formtype='dropdown' />
                            {selectedDeliverytype === DELIVERY_TYPE_WAREHOUSE
                                ? <FormInput page={PAGE_NAME} placeholder={Literals.Columns.Deliverywarehouse[Profile.Language]} name="DeliverywarehouseID" options={Warehouseoptions} formtype='dropdown' loading={Warehouses.isLoading} />
                                : null
                            }
                            {selectedDeliverytype === DELIVERY_TYPE_PATIENT
                                ? <FormInput page={PAGE_NAME} placeholder={Literals.Columns.Deliverypatient[Profile.Language]} name="DeliverypatientID" options={Patientoptions} formtype='dropdown' loading={Patients.isLoading} />
                                : null
                            }
                        </Form.Group>
                        <Pagedivider />
                        <Form.Group widths={'equal'}>
                            <FormInput required page={PAGE_NAME} placeholder={Literals.Columns.Case[Profile.Language]} name="CaseID" options={Caseoption} formtype='dropdown' loading={Cases.isLoading} />
                            <FormInput page={PAGE_NAME} placeholder={Literals.Columns.Price[Profile.Language]} name="Price" />
                        </Form.Group>
                        <Form.Group widths={'equal'}>
                            <FormInput page={PAGE_NAME} placeholder={Literals.Columns.Billno[Profile.Language]} name="Billno" />
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
                                {Literals.Button.GoNext[Profile.Language]}
                                <Icon name='right arrow' />
                            </Button>
                        </div>
                    </Form>
                </Contentwrapper>
            </div>
        </Transition>
    )
}
