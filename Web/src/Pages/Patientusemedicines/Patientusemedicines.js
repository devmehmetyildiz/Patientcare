import React, { Component } from 'react'
import { Contentwrapper, DataTable, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import { Breadcrumb, Button, Dropdown, Form, Icon, Label, Loader, Transition } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { Link } from 'react-router-dom'

export default class Patientusemedicines extends Component {

    constructor(props) {
        super(props)
        this.state = {
            patient: '',
            product: '',
            amount: 0,
        }
    }

    componentDidMount() {
        const { GetPatients, GetPatientstocks, GetPatientstockmovements,
            GetPatientdefines, GetStockdefines, GetUnits } = this.props
        GetPatients()
        GetPatientstocks()
        GetPatientstockmovements()
        GetPatientdefines()
        GetStockdefines()
        GetUnits()
    }

    render() {
        const { Patients, Patientstocks, Patientdefines, Stockdefines, Profile, history, closeModal, Patientstockmovements } = this.props

        const Patientoptions = (Patients.list || []).filter(u => u.Isactive).map(patient => {
            const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient.PatientdefineID)
            return { key: patient.Uuid, text: `${patientdefine?.Firstname} ${patientdefine?.Lastname} - ${patientdefine?.CountryID}`, value: patient.Uuid }
        })

        const colProps = {
            sortable: true,
            canGroupBy: true,
            canFilter: true
        }

        const stock = (Patientstocks.list).find(u => u.Uuid === this.state.product)
        const stockdefine = (Stockdefines.list).find(u => u.Uuid === stock?.StockdefineID)

        const patientstockColumns = [
            { Header: Literals.Columns.Stockdefine[Profile.Language], accessor: 'StockdefineID', Cell: col => this.stockdefineCellhandler(col) },
            { Header: Literals.Columns.Amount[Profile.Language], accessor: 'Amount', Cell: col => this.amountCellhandler(col), disableProps: true },
            { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', disableProps: true }
        ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

        const patientstocks = (Patientstocks.list || []).filter(u => u.Isactive && u.PatientID === this.state.patient && !u.Issupply && u.Ismedicine).map(item => {
            const selectedStock = (Patientstocks.list || []).find(u => u.Uuid === item.Uuid)
            let amount = 0.0;
            let movements = (Patientstockmovements.list || []).filter(u => u.StockID === selectedStock?.Uuid && u.Isactive && u.Isapproved)
            movements.forEach(movement => {
                amount += (movement.Amount * movement.Movementtype);
            });
            if (amount > 0) {
                return {
                    ...item,
                    edit: <Icon link size='large' color='red' name='edit' onClick={() => {
                        this.setState({ product: item.Uuid, amount: 0 })
                    }} />,
                }
            } else {
                return null
            }
        }).filter(u => u)




        return (
            Patients.isLoading ? <LoadingPage /> :
                <Pagewrapper>
                    <Headerwrapper>
                        <Headerbredcrump>
                            <Link to={"/Patientusemedicines"}>
                                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                            </Link>
                        </Headerbredcrump>
                        {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
                    </Headerwrapper>
                    <Pagedivider />
                    <Contentwrapper>
                        <Form.Field>
                            <Form>
                                <Form.Field>
                                    <div className='flex flex-row m-2'>
                                        <label className='text-[#000000de]'>{Literals.Columns.Patient[Profile.Language]}</label>
                                    </div>
                                    <Dropdown
                                        options={Patientoptions}
                                        value={this.state.patient}
                                        clearable
                                        search
                                        fluid
                                        selection
                                        onChange={(_, data) => { this.setState({ patient: data.value, amount: 0, product: '' }) }} />
                                </Form.Field>
                            </Form>
                            <Transition visible={validator.isUUID(this.state.patient)}>
                                <Form.Field>
                                    <Pagedivider />
                                    <div className='mb-2'>
                                        <Label color='blue' basic>{Literals.Columns.Stocks[Profile.Language]}</Label>
                                    </div>
                                    <DataTable
                                        Columns={patientstockColumns}
                                        Data={patientstocks}
                                    />
                                </Form.Field>
                            </Transition>
                            <Transition visible={validator.isUUID(this.state.product)}>
                                <React.Fragment>
                                    <Pagedivider />
                                    <Headerbredcrump>
                                        <div className='mb-2'>
                                            <Breadcrumb.Section >{stockdefine?.Name}</Breadcrumb.Section>
                                        </div>
                                    </Headerbredcrump>
                                    <Form.Input
                                        defaultValue={0}
                                        onChange={(e) => {
                                            let entry = e.target.value
                                            const { Patientstocks, Patientstockmovements } = this.props
                                            const product = this.state.product
                                            const stock = (Patientstocks.list || []).find(u => u.Uuid === product)
                                            let amount = 0.0;
                                            let movements = (Patientstockmovements.list || []).filter(u => u.StockID === stock?.Uuid && u.Isactive && u.Isapproved)
                                            movements.forEach(movement => {
                                                amount += (movement.Amount * movement.Movementtype);
                                            });
                                            if (entry > amount) {
                                                entry = amount
                                            }
                                            if (entry < 0) {
                                                entry = 0
                                            }
                                            this.setState({ amount: entry })
                                        }}
                                        fluid
                                        value={this.state.amount}
                                        label={Literals.Columns.Amount[Profile.Language]}
                                        type='number'
                                    />
                                </React.Fragment>
                            </Transition>
                        </Form.Field>
                    </Contentwrapper>
                    <Footerwrapper>
                        <Gobackbutton
                            history={history}
                            redirectUrl={"/Patientusemedicines"}
                            buttonText={Literals.Button.Goback[Profile.Language]}
                        />
                        <Transition visible={validator.isUUID(this.state.product) && this.state.amount > 0} animation='scale'>
                            <Submitbutton
                                isLoading={Patientstocks.isLoading}
                                buttonText={Literals.Button.Approve[Profile.Language]}
                                submitFunction={this.handleSubmit}
                            />
                        </Transition>
                    </Footerwrapper>
                </Pagewrapper >
        )
    }


    handleSubmit = (e) => {
        e.preventDefault()
        const { AddPatientstockmovements, fillPatientstockmovementnotification, history, Profile, closeModal } = this.props
        const { patient, product, amount } = this.state
        let errors = []
        if (!validator.isUUID(patient)) {
            errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Patientrequired[Profile.Language] })
        }
        if (!validator.isNumber(amount) && amount <= 0) {
            errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Amountrequired[Profile.Language] })
        }
        if (!validator.isUUID(product)) {
            errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Productrequired[Profile.Language] })
        }
        if (errors.length > 0) {
            errors.forEach(error => {
                fillPatientstockmovementnotification(error)
            })
        } else {
            let data = {}
            data.StockID = product
            data.Movementdate = new Date()
            data.Newvalue = 0
            data.Prevvalue = 0
            data.Status = 0
            data.Movementtype = -1
            data.Amount = parseFloat(amount)

            AddPatientstockmovements({ data, history, redirectUrl: '/Patientstockmovements', closeModal })
        }
    }

    amountCellhandler = (col) => {
        const { Patientstockmovements, Patientstocks, Stockdefines, Units } = this.props
        if (Patientstockmovements.isLoading || Patientstocks.isLoading) {
            return <Loader size='small' active inline='centered' ></Loader>
        } else {
            const selectedStock = (Patientstocks.list || []).find(u => u.Id === col?.row?.original?.Id)
            const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === selectedStock?.StockdefineID)
            const unit = (Units.list || []).find(u => u.Uuid === stockdefine?.UnitID)
            let amount = 0.0;
            let movements = (Patientstockmovements.list || []).filter(u => u.StockID === selectedStock?.Uuid && u.Isactive && u.Isapproved)
            movements.forEach(movement => {
                amount += (movement.Amount * movement.Movementtype);
            });
            return <div>{amount}{unit?.Name || ''}</div>
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
}
