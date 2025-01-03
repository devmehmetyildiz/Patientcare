import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Table, Button, Modal, Dropdown, Icon, Label } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import TododefinesCreate from '../../Containers/Tododefines/TododefinesCreate'

export default class PatientsEditroutine extends Component {

    PAGE_NAME = 'PatientsEditroutine'

    constructor(props) {
        super(props)
        this.state = {
            isDatafetched: false,
            modelOpened: false,
            createmodelOpened: false,
            selectedTodogroupdefineID: '',
            newGroupname: '',
            newDepartmentID: ''
        }
    }

    componentDidMount() {
        const {
            GetPatient, match, history, PatientID, GetDepartments,
            GetPatientdefines, GetTodogroupdefines, GetPeriods, GetTododefines
        } = this.props
        let Id = PatientID || match?.params?.PatientID
        if (validator.isUUID(Id)) {
            GetPatient(Id)
            GetPatientdefines()
            GetTodogroupdefines()
            GetPeriods()
            GetTododefines()
            GetDepartments()
        } else {
            history.length > 1 ? history.goBack() : history.push(Id ? `/Patients/${Id}` : `/Patients`)
        }
    }

    componentDidUpdate() {
        const { Patients, Patientdefines, Todogroupdefines, Periods, Tododefines, Departments } = this.props
        const { selected_record } = Patients

        const isLoadingstatus =
            Patients.isLoading ||
            Patientdefines.isLoading ||
            Tododefines.isLoading ||
            Departments.isLoading ||
            Periods.isLoading ||
            Todogroupdefines.isLoading;

        if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoadingstatus && !this.state.isDatafetched) {
            this.setState({ isDatafetched: true })
            this.context.setForm(this.PAGE_NAME, { ...selected_record, Tododefines: selected_record.Tododefineuuids.map(u => { return u.TododefineID }) })
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
            Patients, Patientdefines, Todogroupdefines, Profile, history, match, PatientID, Periods, Tododefines, AddTodogroupdefines, Departments, fillPatientnotification
        } = this.props

        const t = Profile?.i18n?.t

        const Id = match?.params?.PatientID || PatientID

        const { selected_record } = Patients

        const isLoadingstatus =
            Patients.isLoading ||
            Patientdefines.isLoading ||
            Tododefines.isLoading ||
            Departments.isLoading ||
            Periods.isLoading ||
            Todogroupdefines.isLoading;

        const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === selected_record?.PatientdefineID)

        const Tododefinessoption = (Tododefines.list || []).filter(u => u.Isactive).map(tododefine => {
            return { key: tododefine.Uuid, text: tododefine.Name, value: tododefine.Uuid }
        })

        const Departmentoption = (Departments.list || []).filter(u => u.Isactive && u.Ishavepatients).map(department => {
            return { key: department.Uuid, text: department.Name, value: department.Uuid }
        })

        const Todogroupdefinessoption = (Todogroupdefines.list || []).filter(u => u.Isactive).map(todogroupdefine => {
            return { key: todogroupdefine.Uuid, text: todogroupdefine.Name, value: todogroupdefine.Uuid }
        })

        const selectedTodogroupdefine = (Todogroupdefines.list || []).filter(u => u.Isactive).find(u => u.Uuid === this.state.selectedTodogroupdefineID);
        const selectedTododefines = (selectedTodogroupdefine?.Tododefineuuids || []).map(u => {
            const tododefine = (Tododefines.list || []).filter(u => u.Isactive).find(tododefine => tododefine.Uuid === u.TodoID)
            return tododefine
        }).filter(u => u)

        return (
            isLoadingstatus ? <LoadingPage /> :
                <Pagewrapper >
                    <Headerwrapper>
                        <Headerbredcrump>
                            <Link to={"/Patients"}>
                                <Breadcrumb.Section>{t('Pages.Patients.Patients.Page.Header')}</Breadcrumb.Section>
                            </Link>
                            <Breadcrumb.Divider icon='right chevron' />
                            <Link to={"/Patients/" + Id}>
                                <Breadcrumb.Section>{`${patientdefine?.Firstname} ${patientdefine?.Lastname}`}</Breadcrumb.Section>
                            </Link>
                            <Breadcrumb.Divider icon='right chevron' />
                            <Breadcrumb.Section>{t('Pages.Patients.PatientsEditroutine.Page.Header')}</Breadcrumb.Section>
                        </Headerbredcrump>
                    </Headerwrapper>
                    <Pagedivider />
                    <Contentwrapper>
                        <div className='w-full flex flex-col justify-center items-center'>
                            <div className='w-full flex flex-row justify-end items-center'>
                                <Button color='violet' floated='right' onClick={() => { this.setState({ createmodelOpened: true }) }} >{t('Pages.Patients.PatientsEditroutine.Buttons.Saveroutine')}</Button>
                                <Button color='violet' floated='right' onClick={() => { this.setState({ modelOpened: true }) }} >{t('Pages.Patients.PatientsEditroutine.Buttons.Selectroutine')}</Button>
                            </div>
                            <Form className='w-full'>
                                <Form.Group widths='equal'>
                                    <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Patients.PatientsEditroutine.Column.Tododefines')} name="Tododefines" multiple options={Tododefinessoption} formtype='dropdown' modal={TododefinesCreate} />
                                </Form.Group>
                                <Pagedivider />
                                <Table celled className='list-table ' key='product-create-type-conversion-table ' >
                                    {!Profile.Ismobile &&
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell width={1}>{t('Pages.Patients.PatientsEditroutine.Column.Name')}</Table.HeaderCell>
                                                <Table.HeaderCell width={1}>{t('Pages.Patients.PatientsEditroutine.Column.IsRequired')}</Table.HeaderCell>
                                                <Table.HeaderCell width={1}>{t('Pages.Patients.PatientsEditroutine.Column.IsNeedactivation')}</Table.HeaderCell>
                                                <Table.HeaderCell width={1}>{t('Pages.Patients.PatientsEditroutine.Column.Dayperiod')}</Table.HeaderCell>
                                                <Table.HeaderCell width={7}>{t('Pages.Patients.PatientsEditroutine.Column.Periods')}</Table.HeaderCell>
                                                <Table.HeaderCell width={1}>{t('Pages.Patients.PatientsEditroutine.Column.Remove')}</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>}
                                    <Table.Body>
                                        {(this.context.formstates[`${this.PAGE_NAME}/Tododefines`] || []).map(tododefineID => {
                                            const tododefine = (Tododefines.list || []).filter(u => u.Isactive).find(u => u.Uuid === tododefineID)
                                            return <Table.Row key={Math.random()}>
                                                <Table.Cell className='table-last-section'>
                                                    {this.Cellwrapper(<Label>{`${tododefine?.Name}`}</Label>, t('Pages.Patients.PatientsEditroutine.Column.Name'))}
                                                </Table.Cell>
                                                <Table.Cell className='table-last-section'>
                                                    {this.Cellwrapper(
                                                        tododefine?.IsRequired
                                                            ? <Icon className='cursor-pointer' color='green' name='checkmark' />
                                                            : <Icon className='cursor-pointer' color='red' name='times circle' />, t('Pages.Patients.PatientsEditroutine.Column.IsRequired'))}
                                                </Table.Cell>
                                                <Table.Cell className='table-last-section'>
                                                    {this.Cellwrapper(
                                                        tododefine?.IsNeedactivation
                                                            ? <Icon className='cursor-pointer' color='green' name='checkmark' />
                                                            : <Icon className='cursor-pointer' color='red' name='times circle' />, t('Pages.Patients.PatientsEditroutine.Column.IsNeedactivation'))}
                                                </Table.Cell>
                                                <Table.Cell className='table-last-section'>
                                                    {this.Cellwrapper(<Label>{`${tododefine?.Dayperiod}`}</Label>, t('Pages.Patients.PatientsEditroutine.Column.Dayperiod'))}
                                                </Table.Cell>
                                                <Table.Cell className='table-last-section'>
                                                    {this.Cellwrapper(
                                                        <div className='flex flex-row justify-start items-center gap-1'>
                                                            {(tododefine?.Perioduuids || []).map(periodID => {
                                                                const period = (Periods.list || []).find(u => u.Uuid === periodID?.PeriodID)
                                                                return <Label key={Math.random()}>{`${period?.Name}`}</Label>
                                                            })}
                                                        </div>, t('Pages.Patients.PatientsEditroutine.Column.Periods'))}
                                                </Table.Cell>
                                                <Table.Cell >
                                                    {this.Cellwrapper(
                                                        <Icon className='type-conversion-remove-icon' link color={'red'} name={'minus circle'}
                                                            onClick={() => {
                                                                this.context.setFormstates({
                                                                    ...this.context.formstates,
                                                                    [`${this.PAGE_NAME}/Tododefines`]: (this.context.formstates[`${this.PAGE_NAME}/Tododefines`] || []).filter(u => u !== tododefine?.Uuid)
                                                                })
                                                            }} />
                                                        , t('Pages.Patients.PatientsEditroutine.Column.Remove'))}
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
                            buttonText={t('Common.Button.Goback')}
                        />
                        <Submitbutton
                            isLoading={isLoadingstatus}
                            buttonText={t('Common.Button.Update')}
                            submitFunction={this.handleSubmit}
                        />
                    </Footerwrapper>
                    <Modal
                        onClose={() => { this.setState({ selectedTodogroupdefineID: '', modelOpened: false }) }}
                        onOpen={() => { this.setState({ selectedTodogroupdefineID: '', modelOpened: true }) }}
                        open={this.state.modelOpened}
                    >
                        <Modal.Header>{t('Pages.Patients.PatientsEditroutine.Page.ReadyList')}</Modal.Header>
                        <Modal.Content image className='!block'>
                            <Modal.Description>
                                <Contentwrapper>
                                    <Form className='w-full'>
                                        <Form.Group widths='equal'>
                                            <Form.Field>
                                                <label>{t('Pages.Patients.PatientsEditroutine.Page.ReadyList')}</label>
                                                <Dropdown
                                                    clearable
                                                    search
                                                    fluid
                                                    selection
                                                    onChange={(e, data) => { this.setState({ selectedTodogroupdefineID: data.value }) }}
                                                    options={Todogroupdefinessoption}
                                                />
                                            </Form.Field>
                                        </Form.Group>
                                    </Form>
                                    {(selectedTododefines || []).length > 0 ?
                                        <Contentwrapper>
                                            <Table celled>
                                                {!Profile.Ismobile &&
                                                    <Table.Header>
                                                        <Table.Row>
                                                            <Table.HeaderCell width={1}>{t('Pages.Patients.PatientsEditroutine.Column.Name')}</Table.HeaderCell>
                                                            <Table.HeaderCell width={1}>{t('Pages.Patients.PatientsEditroutine.Column.IsRequired')}</Table.HeaderCell>
                                                            <Table.HeaderCell width={1}>{t('Pages.Patients.PatientsEditroutine.Column.IsNeedactivation')}</Table.HeaderCell>
                                                            <Table.HeaderCell width={1}>{t('Pages.Patients.PatientsEditroutine.Column.Dayperiod')}</Table.HeaderCell>
                                                            <Table.HeaderCell width={6}>{t('Pages.Patients.PatientsEditroutine.Column.Periods')}</Table.HeaderCell>
                                                        </Table.Row>
                                                    </Table.Header>}
                                                <Table.Body>
                                                    {selectedTododefines.map(tododefine => {
                                                        return <Table.Row key={Math.random()}>
                                                            <Table.Cell >
                                                                {this.Cellwrapper(<Label>{`${tododefine?.Name}`}</Label>, t('Pages.Patients.PatientsEditroutine.Column.Name'))}
                                                            </Table.Cell>
                                                            <Table.Cell >
                                                                {this.Cellwrapper(
                                                                    tododefine?.IsRequired
                                                                        ? <Icon className='cursor-pointer' color='green' name='checkmark' />
                                                                        : <Icon className='cursor-pointer' color='red' name='times circle' />, t('Pages.Patients.PatientsEditroutine.Column.IsRequired'))}
                                                            </Table.Cell>
                                                            <Table.Cell >
                                                                {this.Cellwrapper(
                                                                    tododefine?.IsNeedactivation
                                                                        ? <Icon className='cursor-pointer' color='green' name='checkmark' />
                                                                        : <Icon className='cursor-pointer' color='red' name='times circle' />, t('Pages.Patients.PatientsEditroutine.Column.IsNeedactivation'))}
                                                            </Table.Cell>
                                                            <Table.Cell >
                                                                {this.Cellwrapper(<Label>{`${tododefine?.Dayperiod}`}</Label>, t('Pages.Patients.PatientsEditroutine.Column.Dayperiod'))}
                                                            </Table.Cell>
                                                            <Table.Cell >
                                                                {this.Cellwrapper(
                                                                    <div className='flex flex-row justify-start items-center gap-1'>
                                                                        {(tododefine?.Perioduuids || []).map(periodID => {
                                                                            const period = (Periods.list || []).find(u => u.Uuid === periodID?.PeriodID)
                                                                            return <Label key={Math.random()}>{`${period?.Name}`}</Label>
                                                                        })}
                                                                    </div>, t('Pages.Patients.PatientsEditroutine.Column.Periods'))}
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
                            <Button color='black' onClick={() => { this.setState({ modelOpened: false, selectedTodogroupdefineID: '' }) }}>
                                {t('Common.Button.Close')}
                            </Button>
                            <Button
                                content={"Ekle"}
                                labelPosition='right'
                                icon='checkmark'
                                onClick={() => {
                                    this.context.setFormstates({
                                        ...this.context.formstates,
                                        [`${this.PAGE_NAME}/Tododefines`]: (selectedTododefines || []).map(u => { return u?.Uuid })
                                    })
                                    this.setState({ modelOpened: false, selectedTodogroupdefineID: '' })
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
                        <Modal.Header> {t('Pages.Patients.PatientsEditroutine.Page.Save')}</Modal.Header>
                        <Modal.Content image className='!block'>
                            <Modal.Description>
                                <Contentwrapper>
                                    <Form className='w-full'>
                                        <Form.Group widths='equal'>
                                            <Form.Field>
                                                <Form.Input
                                                    placeholder={t('Pages.Patients.PatientsEditroutine.Column.ListName')}
                                                    label={t('Pages.Patients.PatientsEditroutine.Column.ListName')}
                                                    fluid
                                                    onChange={(e) => { this.setState({ newGroupname: e.target.value }) }}
                                                />
                                            </Form.Field>
                                            <Form.Field>
                                                <label>{t('Pages.Patients.PatientsEditroutine.Column.Department')}</label>
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
                                {t('Common.Button.Close')}
                            </Button>
                            <Button
                                content={t('Common.Button.Add')}
                                labelPosition='right'
                                icon='checkmark'
                                onClick={() => {
                                    const defines = (this.context.formstates[`${this.PAGE_NAME}/Tododefines`] || []).map(u => {
                                        return (Tododefines.list || []).filter(define => define.Isactive).find(define => define.Uuid === u)
                                    }).filter(u => u)
                                    const DepartmentID = this.state.newDepartmentID;
                                    const Name = this.state.newGroupname;

                                    let errors = []
                                    if (!validator.isString(Name)) {
                                        errors.push({ type: 'Error', code: t('Pages.Patients.PatientsEditroutine.Page.Header'), description: t('Pages.Patients.PatientsEditroutine.Messages.NameRequired') })
                                    }
                                    if (!validator.isArray(defines)) {
                                        errors.push({ type: 'Error', code: t('Pages.Patients.PatientsEditroutine.Page.Header'), description: t('Pages.Patients.PatientsEditroutine.Messages.RoutinesRequired') })
                                    }
                                    if (!validator.isUUID(DepartmentID)) {
                                        errors.push({ type: 'Error', code: t('Pages.Patients.PatientsEditroutine.Page.Header'), description: t('Pages.Patients.PatientsEditroutine.Messages.DepartmentRequired') })
                                    }
                                    if (errors.length > 0) {
                                        errors.forEach(error => {
                                            fillPatientnotification(error)
                                        })
                                    } else {
                                        AddTodogroupdefines({
                                            data: {
                                                Name,
                                                Tododefines: defines,
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
        const { history, Profile, fillPatientnotification, UpdatePatienttododefines, match, PatientID, Tododefines } = this.props
        const t = Profile?.i18n?.t

        let Id = PatientID || match?.params?.PatientID
        const data = this.context.getForm(this.PAGE_NAME)
        data.Tododefines = data.Tododefines.map(u => {
            return (Tododefines.list || []).filter(define => define.Isactive).find(define => define.Uuid === u)
        }).filter(u => u)
        let errors = []
        if (!validator.isArray(data.Tododefines)) {
            errors.push({ type: 'Error', code: t('Pages.Patients.PatientsEditroutine.Page.Header'), description: t('Pages.Patients.PatientsEditroutine.Messages.RoutinesRequired') })
        }

        if (errors.length > 0) {
            errors.forEach(error => {
                fillPatientnotification(error)
            })
        } else {
            UpdatePatienttododefines({
                data: {
                    PatientID: Id,
                    Tododefines: data.Tododefines
                }, history, redirectID: Id
            })
        }
    }
}
PatientsEditroutine.contextType = FormContext
