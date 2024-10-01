import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Table, Button, Modal, Dropdown, Icon, Label } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import TododefinesCreate from '../../Containers/Tododefines/TododefinesCreate'
import SupportplansCreate from '../../Containers/Supportplans/SupportplansCreate'

export default class PatientsEditsupportplan extends Component {

    PAGE_NAME = 'PatientsEditsupportplan'

    constructor(props) {
        super(props)
        this.state = {
            isDatafetched: false,
            modelOpened: false,
            createmodelOpened: false,
            selectedSupportplanlistID: '',
            newGroupname: '',
            newDepartmentID: ''
        }
    }

    componentDidMount() {
        const {
            GetPatient, match, history, PatientID, GetDepartments,
            GetPatientdefines, GetSupportplanlists, GetSupportplans
        } = this.props
        let Id = PatientID || match?.params?.PatientID
        if (validator.isUUID(Id)) {
            GetPatient(Id)
            GetPatientdefines()
            GetPatientdefines()
            GetSupportplanlists()
            GetSupportplans()
            GetDepartments()
        } else {
            history.length > 1 ? history.goBack() : history.push(Id ? `/Patients/${Id}` : `/Patients`)
        }
    }

    componentDidUpdate() {
        const { Patients, Patientdefines, Supportplanlists, Supportplans, Departments } = this.props
        const { selected_record } = Patients

        const isLoadingstatus =
            Patients.isLoading ||
            Patientdefines.isLoading ||
            Supportplanlists.isLoading ||
            Departments.isLoading ||
            Supportplans.isLoading

        if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoadingstatus && !this.state.isDatafetched) {
            this.setState({ isDatafetched: true })
            this.context.setForm(this.PAGE_NAME, { ...selected_record, Supportplans: selected_record.Supportplanuuids.map(u => { return u.PlanID }) })
        }
    }

    Cellwrapper = (children, columnname) => {
        const { Profile } = this.props

        return Profile.Ismobile ?
            <div className='w-full flex justify-between items-center'>
                <Label>{columnname}</Label>
                {children}
            </div> :
            children
    }

    render() {

        const {
            Patients, Patientdefines, Supportplanlists, Profile, history, match, PatientID, Supportplans, AddSupportplanlists, Departments, fillPatientnotification
        } = this.props

        const Id = match?.params?.PatientID || PatientID

        const { selected_record } = Patients

        const isLoadingstatus =
            Patients.isLoading ||
            Patientdefines.isLoading ||
            Supportplanlists.isLoading ||
            Departments.isLoading ||
            Supportplans.isLoading

        const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === selected_record?.PatientdefineID)

        const Supportplanoption = (Supportplans.list || []).filter(u => u.Isactive).map(plan => {
            return { key: plan.Uuid, text: plan.Shortname, value: plan.Uuid }
        })

        const Departmentoption = (Departments.list || []).filter(u => u.Isactive && u.Ishavepatients).map(department => {
            return { key: department.Uuid, text: department.Name, value: department.Uuid }
        })

        const Supportplanlistoption = (Supportplanlists.list || []).filter(u => u.Isactive).map(planlist => {
            return { key: planlist.Uuid, text: planlist.Name, value: planlist.Uuid }
        })

        const selectedSupportplanlist = (Supportplanlists.list || []).filter(u => u.Isactive).find(u => u.Uuid === this.state.selectedSupportplanlistID);
        const selectedSupportplans = (selectedSupportplanlist?.Supportplanuuids || []).map(u => {
            const suppportplan = (Supportplans.list || []).filter(u => u.Isactive).find(plan => plan.Uuid === u.PlanID)
            return suppportplan
        }).filter(u => u)

        return (
            isLoadingstatus ? <LoadingPage /> :
                <Pagewrapper >
                    <Headerwrapper>
                        <Headerbredcrump>
                            <Link to={"/Patients"}>
                                <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                            </Link>
                            <Breadcrumb.Divider icon='right chevron' />
                            <Link to={"/Patients/" + Id}>
                                <Breadcrumb.Section>{`${patientdefine?.Firstname} ${patientdefine?.Lastname}`}</Breadcrumb.Section>
                            </Link>
                            <Breadcrumb.Divider icon='right chevron' />
                            <Breadcrumb.Section>{Literals.Page.Pageeditsupportplanheader[Profile.Language]}</Breadcrumb.Section>
                        </Headerbredcrump>
                    </Headerwrapper>
                    <Pagedivider />
                    <Contentwrapper>
                        <div className='w-full flex flex-col justify-center items-center'>
                            <div className='w-full flex flex-row justify-end items-center'>
                                <Button color='violet' floated='right' onClick={() => { this.setState({ createmodelOpened: true }) }} >{Literals.Button.Saveplan[Profile.Language]}</Button>
                                <Button color='violet' floated='right' onClick={() => { this.setState({ modelOpened: true }) }} >{Literals.Button.Selectplan[Profile.Language]}</Button>
                            </div>
                            <Form className='w-full'>
                                <Form.Group widths='equal'>
                                    <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Supportplans[Profile.Language]} name="Supportplans" multiple options={Supportplanoption} formtype='dropdown' modal={SupportplansCreate} />
                                </Form.Group>
                                <Pagedivider />
                                <Table celled className='list-table ' key='product-create-type-conversion-table ' >
                                    {!Profile.Ismobile &&
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell width={7}>{Literals.Editsupportplancolumns.Name[Profile.Language]}</Table.HeaderCell>
                                                <Table.HeaderCell width={1}>{Literals.Editsupportplancolumns.IsRequired[Profile.Language]}</Table.HeaderCell>
                                                <Table.HeaderCell width={1}>{Literals.Editsupportplancolumns.Info[Profile.Language]}</Table.HeaderCell>
                                                <Table.HeaderCell width={1}>{Literals.Editsupportplancolumns.Remove[Profile.Language]}</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>}
                                    <Table.Body>
                                        {(this.context.formstates[`${this.PAGE_NAME}/Supportplans`] || []).map(planID => {
                                            const supportplan = (Supportplans.list || []).filter(u => u.Isactive).find(u => u.Uuid === planID)
                                            return <Table.Row key={Math.random()}>
                                                <Table.Cell className='table-last-section'>
                                                    {this.Cellwrapper(<Label>{`${supportplan?.Name}`}</Label>, Literals.Editsupportplancolumns.Name[Profile.Language])}
                                                </Table.Cell>
                                                <Table.Cell className='table-last-section'>
                                                    {this.Cellwrapper(<Label>{`${supportplan?.Shortname || ''}`}</Label>, Literals.Editsupportplancolumns.Shortname[Profile.Language])}
                                                </Table.Cell>
                                                <Table.Cell className='table-last-section'>
                                                    {this.Cellwrapper(<Label>{`${supportplan?.Info || ''}`}</Label>, Literals.Editsupportplancolumns.Info[Profile.Language])}
                                                </Table.Cell>
                                                <Table.Cell >
                                                    {this.Cellwrapper(
                                                        <Icon className='type-conversion-remove-icon' link color={'red'} name={'minus circle'}
                                                            onClick={() => {
                                                                this.context.setFormstates({
                                                                    ...this.context.formstates,
                                                                    [`${this.PAGE_NAME}/Supportplans`]: (this.context.formstates[`${this.PAGE_NAME}/Supportplans`] || []).filter(u => u !== supportplan?.Uuid)
                                                                })
                                                            }} />
                                                        , Literals.Editsupportplancolumns.Remove[Profile.Language])}
                                                </Table.Cell>
                                            </Table.Row>
                                        })}
                                    </Table.Body>
                                </Table>
                            </Form>
                        </div>
                    </Contentwrapper>
                    <Footerwrapper>
                        <Gobackbutton
                            history={history}
                            redirectUrl={Id ? `/Patients/${Id}` : `/Patients`}
                            buttonText={Literals.Button.Goback[Profile.Language]}
                        />
                        <Submitbutton
                            isLoading={isLoadingstatus}
                            buttonText={Literals.Button.Update[Profile.Language]}
                            submitFunction={this.handleSubmit}
                        />
                    </Footerwrapper>
                    <Modal
                        onClose={() => { this.setState({ selectedSupportplanlistID: '', modelOpened: false }) }}
                        onOpen={() => { this.setState({ selectedSupportplanlistID: '', modelOpened: true }) }}
                        open={this.state.modelOpened}
                    >
                        <Modal.Header>{Literals.Editsupportplancolumns.ReadySupportplanLists[Profile.Language]}</Modal.Header>
                        <Modal.Content image className='!block'>
                            <Modal.Description>
                                <Contentwrapper>
                                    <Form className='w-full'>
                                        <Form.Group widths='equal'>
                                            <Form.Field>
                                                <label>{Literals.Editsupportplancolumns.ReadySupportplanLists[Profile.Language]}</label>
                                                <Dropdown
                                                    clearable
                                                    search
                                                    fluid
                                                    selection
                                                    onChange={(e, data) => { this.setState({ selectedSupportplanlistID: data.value }) }}
                                                    options={Supportplanlistoption}
                                                />
                                            </Form.Field>
                                        </Form.Group>
                                    </Form>
                                    {(selectedSupportplans || []).length > 0 ?
                                        <Contentwrapper>
                                            <Table celled>
                                                {!Profile.Ismobile &&
                                                    <Table.Header>
                                                        <Table.Row>
                                                            <Table.HeaderCell width={6}>{Literals.Editsupportplancolumns.Name[Profile.Language]}</Table.HeaderCell>
                                                            <Table.HeaderCell width={1}>{Literals.Editsupportplancolumns.Shortname[Profile.Language]}</Table.HeaderCell>
                                                            <Table.HeaderCell width={1}>{Literals.Editsupportplancolumns.Info[Profile.Language]}</Table.HeaderCell>
                                                        </Table.Row>
                                                    </Table.Header>}
                                                <Table.Body>
                                                    {selectedSupportplans.map(supportplan => {
                                                        return <Table.Row key={Math.random()}>
                                                            <Table.Cell >
                                                                {this.Cellwrapper(<Label>{`${supportplan?.Name}`}</Label>, Literals.Editsupportplancolumns.Name[Profile.Language])}
                                                            </Table.Cell>
                                                            <Table.Cell >
                                                                {this.Cellwrapper(<Label>{`${supportplan?.Shortname || ''}`}</Label>, Literals.Editsupportplancolumns.Shortname[Profile.Language])}
                                                            </Table.Cell>
                                                            <Table.Cell >
                                                                {this.Cellwrapper(<Label>{`${supportplan?.Info || ''}`}</Label>, Literals.Editsupportplancolumns.Info[Profile.Language])}
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    })}
                                                </Table.Body>
                                            </Table>
                                        </Contentwrapper>
                                        : null}
                                </Contentwrapper>
                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color='black' onClick={() => { this.setState({ modelOpened: false, selectedSupportplanlistID: '' }) }}>
                                {Literals.Button.Close[Profile.Language]}
                            </Button>
                            <Button
                                content={"Ekle"}
                                labelPosition='right'
                                icon='checkmark'
                                onClick={() => {
                                    this.context.setFormstates({
                                        ...this.context.formstates,
                                        [`${this.PAGE_NAME}/Supportplans`]: (selectedSupportplans || []).map(u => { return u?.Uuid })
                                    })
                                    this.setState({ modelOpened: false, selectedSupportplanlistID: '' })
                                }}
                                positive
                            />
                        </Modal.Actions>
                    </Modal>
                    <Modal
                        onClose={() => { this.setState({ newGroupname: '', newDepartmentID: '', createmodelOpened: false }) }}
                        onOpen={() => { this.setState({ newGroupname: '', newDepartmentID: '', createmodelOpened: true }) }}
                        open={this.state.createmodelOpened}
                    >
                        <Modal.Header> {Literals.Editsupportplancolumns.SaveSupportplanList[Profile.Language]}</Modal.Header>
                        <Modal.Content image className='!block'>
                            <Modal.Description>
                                <Contentwrapper>
                                    <Form className='w-full'>
                                        <Form.Group widths='equal'>
                                            <Form.Field>
                                                <Form.Input
                                                    placeholder={Literals.Editsupportplancolumns.Supportplanlistname[Profile.Language]}
                                                    label={Literals.Editsupportplancolumns.Supportplanlistname[Profile.Language]}
                                                    fluid
                                                    onChange={(e) => { this.setState({ newGroupname: e.target.value }) }}
                                                />
                                            </Form.Field>
                                            <Form.Field>
                                                <label>{Literals.Editsupportplancolumns.Department[Profile.Language]}</label>
                                                <Dropdown
                                                    clearable
                                                    search
                                                    fluid
                                                    selection
                                                    onChange={(e, data) => { this.setState({ newDepartmentID: data.value }) }}
                                                    options={Departmentoption}
                                                />
                                            </Form.Field>
                                        </Form.Group>
                                    </Form>
                                </Contentwrapper>
                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color='black' onClick={() => { this.setState({ newGroupname: '', newDepartmentID: '', createmodelOpened: false }) }}>
                                {Literals.Button.Close[Profile.Language]}
                            </Button>
                            <Button
                                content={Literals.Button.Add[Profile.Language]}
                                labelPosition='right'
                                icon='checkmark'
                                onClick={() => {
                                    const plans = (this.context.formstates[`${this.PAGE_NAME}/Supportplans`] || []).map(u => {
                                        return (Supportplans.list || []).filter(plan => plan.Isactive).find(plan => plan.Uuid === u)
                                    }).filter(u => u)
                                    const DepartmentID = this.state.newDepartmentID;
                                    const Name = this.state.newGroupname;

                                    let errors = []
                                    if (!validator.isString(Name)) {
                                        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.NameRequired[Profile.Language] })
                                    }
                                    if (!validator.isArray(plans)) {
                                        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.SupportplansRequired[Profile.Language] })
                                    }
                                    if (!validator.isUUID(DepartmentID)) {
                                        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.DepartmentRequired[Profile.Language] })
                                    }
                                    if (errors.length > 0) {
                                        errors.forEach(error => {
                                            fillPatientnotification(error)
                                        })
                                    } else {
                                        AddSupportplanlists({
                                            data: {
                                                Name,
                                                Supportplans: plans,
                                                DepartmentID
                                            }
                                        })
                                        this.setState({ newGroupname: '', newDepartmentID: '', createmodelOpened: false })
                                    }
                                }}
                                positive
                            />
                        </Modal.Actions>
                    </Modal>
                </Pagewrapper >
        )
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { history, Profile, fillPatientnotification, UpdatePatientsupportplans, match, PatientID, Supportplans } = this.props
        let Id = PatientID || match?.params?.PatientID
        const data = this.context.getForm(this.PAGE_NAME)
        data.Supportplans = data.Supportplans.map(u => {
            return (Supportplans.list || []).filter(plan => plan.Isactive).find(plan => plan.Uuid === u)
        }).filter(u => u)
        let errors = []
        if (!validator.isArray(data.Supportplans)) {
            errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.SupportplansRequired[Profile.Language] })
        }

        if (errors.length > 0) {
            errors.forEach(error => {
                fillPatientnotification(error)
            })
        } else {
            UpdatePatientsupportplans({
                data: {
                    PatientID: Id,
                    Supportplans: data.Supportplans
                }, history, redirectID: Id
            })
        }
    }
}
PatientsEditsupportplan.contextType = FormContext
