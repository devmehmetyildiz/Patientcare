import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Form, Label, Loader } from 'semantic-ui-react'
import Literals from './Literals'
import validator from "../../Utils/Validator"
import { FormContext } from '../../Provider/FormProvider'
import {
    FormInput, DataTable, NoDataScreen, Contentwrapper, Footerwrapper, Gobackbutton,
    Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'
export default class PatientsRemovestock extends Component {

    PAGE_NAME = 'PatientsRemovestock'

    constructor(props) {
        super(props)
        this.state = {
            isDatafetched: false,
        }
    }

    componentDidMount() {
        const {
            GetPatient, match, history, PatientID,
            GetPatientdefines, GetPatientstocks, GetPatientstockmovements,
            GetWarehouses, GetStocks, GetStockmovements, GetStockdefines, GetDepartments
        } = this.props
        let Id = PatientID || match?.params?.PatientID
        if (validator.isUUID(Id)) {
            GetPatient(Id)
            GetPatientdefines()
            GetPatientstocks()
            GetPatientstockmovements()
            GetWarehouses()
            GetDepartments()
            GetStocks()
            GetStockmovements()
            GetStockdefines()
        } else {
            history.length > 1 ? history.goBack() : history.push(Id ? `/Patients/${Id}` : `/Patients`)
        }
    }

    componentDidUpdate() {
        const {
            Patients, Patientdefines, Patientstocks,
            Patientstockmovements, Warehouses, Departments,
            Stocks, Stockmovements, Stockdefines, } = this.props
        const { selected_record } = Patients

        const isLoadingstatus =
            Patients.isLoading ||
            Patientdefines.isLoading ||
            Patientstocks.isLoading ||
            Patientstockmovements.isLoading ||
            Warehouses.isLoading ||
            Stocks.isLoading||
            Stockmovements.isLoading ||
            Stockdefines.isLoading||
            Departments.isLoading


        if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoadingstatus && !this.state.isDatafetched) {
            this.setState({ isDatafetched: true })
            this.context.setForm(this.PAGE_NAME, selected_record)
        }
    }

    render() {

        const {
            Patients, Patientdefines, Patientstocks, Patientstockmovements, Warehouses, Departments,
            Stocks, Stockmovements, Stockdefines, Profile, history, match, PatientID
        } = this.props


        const Id = match?.params?.PatientID || PatientID

        const { selected_record } = Patients

        const isLoadingstatus =
        Patients.isLoading ||
        Patientdefines.isLoading ||
        Patientstocks.isLoading ||
        Patientstockmovements.isLoading ||
        Warehouses.isLoading ||
        Stocks.isLoading||
        Stockmovements.isLoading ||
        Stockdefines.isLoading||
        Departments.isLoading

        const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === selected_record?.PatientdefineID)

        const Warehouseoptions = (Warehouses.list || []).filter(u => u.Isactive && !u.Ismedicine).map(warehouse => {
            return { key: warehouse.Uuid, text: warehouse.Name, value: warehouse.Uuid }
        })


        const Patientstocklist = (Patientstocks.list || []).filter(u => u.PatientID === Id && u.Isapproved && !u.Ismedicine && u.Isactive)

        const Stockoptions = (Patientstocks.list || []).filter(u =>
            u.Isactive &&
            u.Isapproved &&
            !u.Ismedicine &&
            u.PatientID === selected_record?.Uuid
        ).map(stock => {
            const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
            const department = (Departments.list || []).find(u => u.Uuid === stock?.DepartmentID)
            return { key: stock?.Uuid, text: `${stockdefine?.Name} (${department?.Name})`, value: stock?.Uuid }
        })

        const Columns = [
            { Header: Literals.AddStock.Id[Profile.Language], accessor: 'Id', sortable: true, canGroupBy: true, canFilter: true },
            { Header: Literals.AddStock.Stockname[Profile.Language], accessor: 'StockdefineID', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.stockdefineCellhandler(col) },
            { Header: Literals.AddStock.Department[Profile.Language], accessor: 'DepartmentID', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.departmentCellhandler(col) },
            { Header: Literals.AddStock.Amount[Profile.Language], accessor: 'Amount', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.amountCellhandler(col) },
        ]


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
                            <Breadcrumb.Section>{Literals.Page.Pageremovestockheader[Profile.Language]}</Breadcrumb.Section>
                        </Headerbredcrump>
                    </Headerwrapper>
                    <Pagedivider />
                    <Contentwrapper>
                        <Form>
                            <Label>{Literals.RemoveStock.Availablestocks[Profile.Language]}</Label>
                            <Pagedivider />
                            {Patientstocklist.length > 0 ?
                                <div className='w-full mx-auto '>
                                    <DataTable Columns={Columns} Data={Patientstocklist} />
                                </div> : <NoDataScreen message={Literals.Messages.Nostockfind[Profile.Language]} style={{ height: 'auto' }} />}
                            <Pagedivider />
                            <Form.Group widths='equal'>
                                <FormInput page={this.PAGE_NAME} required placeholder={Literals.RemoveStock.Warehouse[Profile.Language]} name="WarehouseID" options={Warehouseoptions} formtype='dropdown' />
                                <FormInput page={this.PAGE_NAME} required placeholder={Literals.RemoveStock.Stockname[Profile.Language]} name="StockID" options={Stockoptions} formtype='dropdown' />
                                <FormInput page={this.PAGE_NAME} required placeholder={Literals.RemoveStock.Amount[Profile.Language]} name="Amount" type="number" />
                            </Form.Group>
                        </Form>
                    </Contentwrapper>
                    <Footerwrapper>
                        <Gobackbutton
                            history={history}
                            redirectUrl={Id ? `/Patients/${Id}` : `/Patients`}
                            buttonText={Literals.Button.Goback[Profile.Language]}
                        />
                        <Submitbutton
                            isLoading={isLoadingstatus}
                            buttonText={Literals.Button.Remove[Profile.Language]}
                            submitFunction={this.handleSubmit}
                        />
                    </Footerwrapper>
                </Pagewrapper >
        )
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { history, Profile, Patientstockmovements, fillStocknotification, TransferfromPatient, match, PatientID } = this.props
        let Id = PatientID || match?.params?.PatientID
        const data = this.context.getForm(this.PAGE_NAME)
        data.PatientID = Id
        let errors = []
        if (!validator.isUUID(data.WarehouseID)) {
            errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.WarehouseReuired[Profile.Language] })
        }
        if (!validator.isUUID(data.StockID)) {
            errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.StockRequired[Profile.Language] })
        }

        if (validator.isUUID(data.StockID)) {
            let amount = 0.0;
            let movements = (Patientstockmovements.list || []).filter(u => u.StockID === data.StockID && u.Isactive && u.Isapproved)
            movements.forEach(movement => {
                amount += (movement.Amount * movement.Movementtype);
            });
            if (amount < parseInt(data.Amount)) {
                errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Needmoreamount[Profile.Language] })
            }
        }
        if (errors.length > 0) {
            errors.forEach(error => {
                fillStocknotification(error)
            })
        } else {
            TransferfromPatient({ data, history, redirectID: Id })
        }
    }

    stockdefineCellhandler = (col) => {
        const { Stockdefines } = this.props
        if (Stockdefines.isLoading) {
            return <Loader size='small' active inline='centered' ></Loader>
        } else {
            return (Stockdefines.list || []).find(u => u.Uuid === col.value)?.Name
        }
    }

    departmentCellhandler = (col) => {
        const { Departments } = this.props
        if (Departments.isLoading) {
            return <Loader size='small' active inline='centered' ></Loader>
        } else {
            return (Departments.list || []).find(u => u.Uuid === col.value)?.Name
        }
    }

    amountCellhandler = (col) => {
        const { Patientstockmovements, Patientstocks } = this.props
        if (Patientstockmovements.isLoading || Patientstocks.isLoading) {
            return <Loader size='small' active inline='centered' ></Loader>
        } else {
            const selectedStock = (Patientstocks.list || []).find(u => u.Id === col?.row?.original?.Id)
            let amount = 0.0;
            let movements = (Patientstockmovements.list || []).filter(u => u.StockID === selectedStock.Uuid && u.Isactive && u.Isapproved)
            movements.forEach(movement => {
                amount += (movement.Amount * movement.Movementtype);
            });
            return amount
        }
    }
}
PatientsRemovestock.contextType = FormContext
