import React, { useContext, useEffect } from 'react'
import { Breadcrumb, Button, Form, Grid, GridColumn, Icon, Transition } from 'semantic-ui-react'
import { Contentwrapper, FormInput, Headerwrapper, Pagedivider } from '../../Components'
import { Link } from 'react-router-dom'
import { DELIVERY_TYPES, DELIVERY_TYPE_PATIENT, DELIVERY_TYPE_WAREHOUSE } from '../../Utils/Constants'
import { FormContext } from '../../Provider/FormProvider'

export default function PurchaseorderPrepareStepOne({ Preparestatus, setCompletedSteps, goNext, stepKey, PAGE_NAME, Profile, GetUsers, GetWarehouses, GetPatients, GetCases, GetPatientdefines, GetDepartments, Warehouses, Departments, Patients, Patientdefines, Users, Cases }) {

    const context = useContext(FormContext)

    const t = Profile?.i18n?.t

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
                                        <Breadcrumb.Section>{t('Pages.Purchaseorder.Page.InfoHeader')}</Breadcrumb.Section>
                                    </Link>
                                </Breadcrumb>
                            </GridColumn>
                        </Grid>
                    </Headerwrapper>
                    <Form>
                        <Form.Group widths={'equal'}>
                            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Purchaseorder.Label.Company')} name="Company" />
                            <FormInput page={PAGE_NAME} placeholder={t('Pages.Purchaseorder.Label.Info')} name="Info" />
                        </Form.Group>
                        <Form.Group widths={'equal'}>
                            <FormInput page={PAGE_NAME} placeholder={t('Pages.Purchaseorder.Label.Delivereruser')} name="Delivereruser" />
                            <FormInput page={PAGE_NAME} placeholder={t('Pages.Purchaseorder.Label.Receiveruser')} name="ReceiveruserID" options={Useroptions} formtype='dropdown' loading={Users.isLoading} />
                        </Form.Group>
                        <Pagedivider />
                        <Form.Group widths={'equal'}>
                            <FormInput page={PAGE_NAME} placeholder={t('Pages.Purchaseorder.Label.Deliverytype')} name="Deliverytype" options={Delivertypeoptions} formtype='dropdown' />
                            {selectedDeliverytype === DELIVERY_TYPE_WAREHOUSE
                                ? <FormInput page={PAGE_NAME} placeholder={t('Pages.Purchaseorder.Label.Deliverywarehouse')} name="DeliverywarehouseID" options={Warehouseoptions} formtype='dropdown' loading={Warehouses.isLoading} />
                                : null
                            }
                            {selectedDeliverytype === DELIVERY_TYPE_PATIENT
                                ? <FormInput page={PAGE_NAME} placeholder={t('Pages.Purchaseorder.Label.Deliverypatient')} name="DeliverypatientID" options={Patientoptions} formtype='dropdown' loading={Patients.isLoading} />
                                : null
                            }
                        </Form.Group>
                        <Pagedivider />
                        <Form.Group widths={'equal'}>
                            <FormInput required page={PAGE_NAME} placeholder={t('Pages.Purchaseorder.Label.Case')} name="CaseID" options={Caseoption} formtype='dropdown' loading={Cases.isLoading} />
                            <FormInput page={PAGE_NAME} placeholder={t('Pages.Purchaseorder.Label.Price')} name="Price" type='number' min={0} max={99999999} step={"0.01"}/>
                        </Form.Group>
                        <Form.Group widths={'equal'}>
                            <FormInput page={PAGE_NAME} placeholder={t('Pages.Purchaseorder.Label.Billno')} name="Billno" />
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
