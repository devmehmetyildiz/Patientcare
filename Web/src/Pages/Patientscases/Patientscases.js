import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button, Label, Dropdown, Tab, Grid, Table } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'

export default class Patientscases extends Component {

    PAGE_NAME = "Patientscases"

    constructor(props) {
        super(props)
        this.state = {
            list: [],
            isDatafetched: false
        }
    }

    componentDidMount() {
        const { GetPatients, GetCases, GetPatientdefines, GetDepartments, GetPatienttypes } = this.props
        GetPatients()
        GetCases()
        GetPatientdefines()
        GetDepartments()
        GetPatienttypes()
    }

    componentDidUpdate() {
        const { Patients, Patientdefines, Cases, Departments, Patienttypes } = this.props

        const isLoading = !Patients.isLoading && !Departments.isLoading && !Patienttypes.isLoading && !Patientdefines.isLoading && !Cases.isLoading && !this.state.isDatafetched;

        if (isLoading && (Patients.list || []).length > 0) {
            const disbandCases = (Cases.list || []).filter(u => u.Patientstatus === 4 || u.Patientstatus === 6).map(u => u.Uuid);
            const list = (Patients.list || []).filter(u => u.Isactive && !u.Iswaitingactivation).filter(u => !(disbandCases || []).includes(u.CaseID)).map(patient => {
                const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID);
                return {
                    Patient: `${patientdefine?.Firstname} ${patientdefine?.Lastname} - (${patientdefine?.CountryID})`,
                    PatientID: patient?.Uuid,
                    CaseID: patient?.CaseID,
                    PatienttypeID: patientdefine?.PatienttypeID,
                }
            })
            this.setState({
                isDatafetched: true,
                list: list
            })
        }
    }

    render() {
        const { Patients, Patientdefines, Departments, Profile, history, closeModal, Cases, Patienttypes } = this.props

        const isLoading = Patients.isLoading || Patientdefines.isLoading || Cases.isLoading || Departments.isLoading || Patienttypes.isLoading

        const Casesoptions = (Cases.list || []).filter(u => u.Patientstatus !== 4 && u.Patientstatus !== 6).filter(u => u.Isactive).map(cases => {
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

        const patienttypes = (Patienttypes.list || []).filter(u => u.Isactive)

        return (
            isLoading ? <LoadingPage /> :
                <Pagewrapper>
                    <Headerwrapper>
                        <Headerbredcrump>
                            <Link to={"/Patientscases"}>
                                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                            </Link>
                            <Breadcrumb.Divider icon='right chevron' />
                            <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
                        </Headerbredcrump>
                        {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
                    </Headerwrapper>
                    <Pagedivider />
                    <Contentwrapper>
                        <Form>
                            <Tab
                                className="w-full bg-white"
                                panes={patienttypes.map(patienttype => {
                                    return {
                                        menuItem: patienttype?.Name,
                                        pane: {
                                            key: patienttype?.Uuid,
                                            content:
                                                <Table celled className='list-table ' key='product-create-type-conversion-table '>
                                                    <Table.Header>
                                                        <Table.Row>
                                                            <Table.HeaderCell width={1}>{Literals.Columns.name[Profile.Language]}</Table.HeaderCell>
                                                            <Table.HeaderCell width={3}>{Literals.Columns.case[Profile.Language]}</Table.HeaderCell>
                                                        </Table.Row>
                                                    </Table.Header>
                                                    <Table.Body>
                                                        {(this.state.list || []).filter(u => u.PatienttypeID === patienttype?.Uuid).map(patient => {
                                                            return <Table.Row>
                                                                <Table.Cell>
                                                                    <Link to={`Patients/${patient?.PatientID}`}>
                                                                        <Label size='large' as='a' className='!bg-[#2355a0] !text-white !w-full' >
                                                                            {patient?.Patient}
                                                                        </Label>
                                                                    </Link>
                                                                </Table.Cell>
                                                                <Table.Cell>
                                                                    <Dropdown
                                                                        value={patient?.CaseID}
                                                                        clearable
                                                                        search
                                                                        fluid
                                                                        selection
                                                                        options={Casesoptions}
                                                                        onChange={(e, data) => {
                                                                            this.handleChange(data.value, patient?.PatientID)
                                                                        }} />
                                                                </Table.Cell>
                                                            </Table.Row>
                                                        })}
                                                    </Table.Body>
                                                </Table>
                                        }
                                    }
                                })}
                                renderActiveOnly={false} />

                        </Form>
                    </Contentwrapper>
                    <Footerwrapper>
                        <Gobackbutton
                            history={history}
                            redirectUrl={"/Patientscases"}
                            buttonText={Literals.Button.Goback[Profile.Language]}
                        />
                        <Submitbutton
                            isLoading={Patients.isLoading}
                            buttonText={Literals.Button.Update[Profile.Language]}
                            submitFunction={this.handleSubmit}
                        />
                    </Footerwrapper>
                </Pagewrapper >
        )
    }


    handleChange = (data, key) => {
        let patientlist = this.state.list
        let row = patientlist.find(u => u.PatientID === key)
        row.CaseID = data
        this.setState({ list: patientlist })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { Editpatientscase, history, Profile, closeModal } = this.props
        const data = this.state.list
        Editpatientscase({ data, history, closeModal })
    }
}
Patientscases.contextType = FormContext