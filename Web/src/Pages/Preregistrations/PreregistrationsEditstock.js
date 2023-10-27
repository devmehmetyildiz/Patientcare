import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Divider, Dropdown, Form, Header, Icon, Modal, Tab, Table } from 'semantic-ui-react'
import { ROUTES } from '../../Utils/Constants'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'
import StockdefinesCreate from "../../Containers/Stockdefines/StockdefinesCreate"
import config from '../../Config'
import Literals from './Literals'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import validator from '../../Utils/Validator'
import DepartmentsCreate from '../../Containers/Departments/DepartmentsCreate'
export default class PreregistrationsEditstock extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
      selectedStocks: [],
      open: false,
      modelOpened: false
    }
  }

  componentDidMount() {
    const { GetPatient, match, history,
      GetStockdefines,
      GetDepartments,
      GetFiles,
      GetPatientdefines,
      GetPatientstocks,
      GetPatientstockmovements
    } = this.props
    if (match.params.PatientID) {
      GetPatient(match.params.PatientID)
      GetStockdefines()
      GetDepartments()
      GetFiles()
      GetPatientdefines()
      GetPatientstocks()
      GetPatientstockmovements()
    } else {
      history.push("/Preregistrations")
    }
  }

  componentDidUpdate() {
    const {
      Patients, removePatientnotification,
      Departments, removeDepartmentnotification,
      Stockdefines, removeStockdefinenotification,
      Files, removeFilenotification,
      Patientdefines, removePatientdefinenotification,
      Patientstocks, removePatientstocknotification,
      Patientstockmovements, removePatientstockmovementnotification
    } = this.props
    const { selected_record, isLoading } = Patients
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoading
      && !Departments.isLoading &&
      !Stockdefines.isLoading &&
      !Patientdefines.isLoading &&
      !Patientstocks.isLoading &&
      !Patientstockmovements.isLoading &&
      !Files.isLoading &&
      !this.state.isDatafetched) {
      var response = (Patientstocks.list || []).
        filter(u => u.PatientID === selected_record.Uuid).map(u => { return { ...u, key: Math.random() } })
      this.setState({
        selectedStocks: response, isDatafetched: true
      })
    }
    Notification(Patients.notifications, removePatientnotification)
    Notification(Stockdefines.notifications, removeStockdefinenotification)
    Notification(Departments.notifications, removeDepartmentnotification)
    Notification(Files.notifications, removeFilenotification)
    Notification(Patientdefines.notifications, removePatientdefinenotification)
    Notification(Patientstocks.notifications, removePatientstocknotification)
    Notification(Patientstockmovements.notifications, removePatientstockmovementnotification)
  }

  render() {
    const { Patients, Stockdefines, Departments, Files, Patientdefines, Profile, history } = this.props
    const { selected_record, isLoading, isDispatching } = Patients

    const Stockdefinesoption = Stockdefines.list.filter(u => !u.Ismedicine).map(stockdefine => {
      return { key: stockdefine.Uuid, text: stockdefine.Name, value: stockdefine.Uuid }
    })

    const Medicinedefinesoption = Stockdefines.list.filter(u => u.Ismedicine).map(stockdefine => {
      return { key: stockdefine.Uuid, text: stockdefine.Name, value: stockdefine.Uuid }
    })

    const Departmentsoption = Departments.list.map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })

    const addModal = (content) => {
      return <Modal
        onClose={() => { this.setState({ modelOpened: false }) }}
        onOpen={() => { this.setState({ modelOpened: true }) }}
        trigger={<Icon link name='plus' />}
        content={content}
      />
    }

    return (

      isLoading || isDispatching ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Preregistrations"}>
                <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pageeditstockheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Header as='h2' icon textAlign='center'>
              {(Files.list || []).filter(u => u.Usagetype === 'PP' && u.ParentID === selected_record.Uuid).length > 0 ? <img alt='pp' src={`${config.services.File}${ROUTES.FILE}/Downloadfile/${(Files.list || []).filter(u => u.ParentID === selected_record.Uuid).find(u => u.Usagetype === 'PP')?.Uuid}`} className="rounded-full" style={{ width: '100px', height: '100px' }} />
                : <Icon name='users' circular />}
              <Header.Content>{`${(Patientdefines.list || []).find(u => u.Uuid === selected_record.PatientdefineID)?.Firstname} 
                            ${(Patientdefines.list || []).find(u => u.Uuid === selected_record.PatientdefineID)?.Lastname} - ${(Patientdefines.list || []).find(u => u.Uuid === selected_record.PatientdefineID)?.CountryID}`}</Header.Content>
            </Header>
            <Form onSubmit={this.handleSubmit}>
              <Tab className='station-tab'
                panes={[
                  {
                    menuItem: Literals.Columns.Medicines[Profile.Language],
                    pane: {
                      key: 'medicines',
                      content: <Table celled className='list-table ' key='product-create-type-conversion-table ' >
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell width={1}>{Literals.Options.TableColumnsOrder[Profile.Language]}</Table.HeaderCell>
                            <Table.HeaderCell width={2}>{Literals.Options.TableColumnsStockdefine[Profile.Language]}{addModal(<StockdefinesCreate />)}</Table.HeaderCell>
                            <Table.HeaderCell width={2}>{Literals.Options.TableColumnsDepartment[Profile.Language]}{addModal(<DepartmentsCreate />)}</Table.HeaderCell>
                            <Table.HeaderCell width={2}>{Literals.Options.TableColumnsBarcode[Profile.Language]}</Table.HeaderCell>
                            <Table.HeaderCell width={2}>{Literals.Options.TableColumnsSkt[Profile.Language]}</Table.HeaderCell>
                            <Table.HeaderCell width={2}>{Literals.Options.TableColumnsAmount[Profile.Language]}</Table.HeaderCell>
                            <Table.HeaderCell width={6}>{Literals.Options.TableColumnsInfo[Profile.Language]}</Table.HeaderCell>
                            <Table.HeaderCell width={1}>{Literals.Options.TableColumnsDelete[Profile.Language]}</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {this.state.selectedStocks.filter(u => u.Ismedicine).sort((a, b) => a.Order - b.Order).map((stock, index) => {
                            return <Table.Row key={stock.key}>
                              <Table.Cell>
                                <Button.Group basic size='small'>
                                  <Button type='button' disabled={index === 0} icon='angle up' onClick={() => { this.selectedProductChangeHandler(stock.key, 'Order', stock.Order - 1) }} />
                                  <Button type='button' disabled={index + 1 === this.state.selectedStocks.length} icon='angle down' onClick={() => { this.selectedProductChangeHandler(stock.key, 'Order', stock.Order + 1) }} />
                                </Button.Group>
                              </Table.Cell>
                              <Table.Cell>
                                <Form.Field>
                                  <Dropdown value={stock.StockdefineID} placeholder={Literals.Options.TableColumnsStockdefine[Profile.Language]} name="StockdefineID" clearable search fluid selection options={Medicinedefinesoption
                                  } onChange={(e, data) => { this.selectedProductChangeHandler(stock.key, 'StockdefineID', data.value) }} />
                                </Form.Field>
                              </Table.Cell>
                              <Table.Cell>
                                <Form.Field>
                                  <Dropdown value={stock.DepartmentID} placeholder={Literals.Options.TableColumnsDepartment[Profile.Language]} name="DepartmentID" clearable search fluid selection options={Departmentsoption} onChange={(e, data) => { this.selectedProductChangeHandler(stock.key, 'DepartmentID', data.value) }} />
                                </Form.Field>
                              </Table.Cell>
                              <Table.Cell>
                                <Form.Input value={stock.Barcodeno} placeholder={Literals.Options.TableColumnsBarcode[Profile.Language]} name="Barcodeno" fluid onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Barcodeno', e.target.value) }} />
                              </Table.Cell>
                              <Table.Cell>
                                <Form.Input value={stock.Skt && stock.Skt.split('T')[0]} placeholder={Literals.Options.TableColumnsSkt[Profile.Language]} name="Skt" type='date' fluid onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Skt', e.target.value) }} />
                              </Table.Cell>
                              <Table.Cell>
                                <Form.Input disabled={stock.Uuid} value={stock.Amount} placeholder={Literals.Options.TableColumnsAmount[Profile.Language]} name="Amount" type="number" fluid onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Amount', e.target.value) }} />
                              </Table.Cell>
                              <Table.Cell>
                                <Form.Input value={stock.Info} placeholder={Literals.Options.TableColumnsInfo[Profile.Language]} name="Info" fluid onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Info', e.target.value) }} />
                              </Table.Cell>
                              <Table.Cell className='table-last-section'>
                                {!stock.Uuid && <Icon className='type-conversion-remove-icon' link color='red' name='minus circle'
                                  onClick={() => { this.removeProduct(stock.key, stock.Order) }} />}
                              </Table.Cell>
                            </Table.Row>
                          })}
                        </Table.Body>
                        <Table.Footer>
                          <Table.Row>
                            <Table.HeaderCell colSpan='8'>
                              <Button type="button" color='green' className='addMoreButton' size='mini' onClick={() => { this.AddNewProduct(true) }}>{Literals.Button.AddnewMedicine[Profile.Language]}</Button>
                            </Table.HeaderCell>
                          </Table.Row>
                        </Table.Footer>
                      </Table>
                    }
                  },
                  {
                    menuItem: Literals.Columns.Stocks[Profile.Language],
                    pane: {
                      key: 'stocks',
                      content: <Table celled className='list-table ' key='product-create-type-conversion-table ' >
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell width={1}>{Literals.Options.TableColumnsOrder[Profile.Language]}</Table.HeaderCell>
                            <Table.HeaderCell width={2}>{Literals.Options.TableColumnsStockdefine[Profile.Language]}{addModal(<StockdefinesCreate />)}</Table.HeaderCell>
                            <Table.HeaderCell width={2}>{Literals.Options.TableColumnsDepartment[Profile.Language]}{addModal(<DepartmentsCreate />)}</Table.HeaderCell>
                            <Table.HeaderCell width={2}>{Literals.Options.TableColumnsAmount[Profile.Language]}</Table.HeaderCell>
                            <Table.HeaderCell width={6}>{Literals.Options.TableColumnsInfo[Profile.Language]}</Table.HeaderCell>
                            <Table.HeaderCell width={1}>{Literals.Options.TableColumnsDelete[Profile.Language]}</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {this.state.selectedStocks.filter(u => !u.Ismedicine).sort((a, b) => a.Order - b.Order).map((stock, index) => {
                            return <Table.Row key={stock.key}>
                              <Table.Cell>
                                <Button.Group basic size='small'>
                                  <Button type='button' disabled={index === 0} icon='angle up' onClick={() => { this.selectedProductChangeHandler(stock.key, 'Order', stock.Order - 1) }} />
                                  <Button type='button' disabled={index + 1 === this.state.selectedStocks.length} icon='angle down' onClick={() => { this.selectedProductChangeHandler(stock.key, 'Order', stock.Order + 1) }} />
                                </Button.Group>
                              </Table.Cell>
                              <Table.Cell>
                                <Form.Field>
                                  <Dropdown value={stock.StockdefineID} placeholder={Literals.Options.TableColumnsStockdefine[Profile.Language]} name="StockdefineID" clearable search fluid selection options={Stockdefinesoption} onChange={(e, data) => { this.selectedProductChangeHandler(stock.key, 'StockdefineID', data.value) }} />
                                </Form.Field>
                              </Table.Cell>
                              <Table.Cell>
                                <Form.Field>
                                  <Dropdown value={stock.DepartmentID} placeholder={Literals.Options.TableColumnsDepartment[Profile.Language]} name="DepartmentID" clearable search fluid selection options={Departmentsoption} onChange={(e, data) => { this.selectedProductChangeHandler(stock.key, 'DepartmentID', data.value) }} />
                                </Form.Field>
                              </Table.Cell>
                              <Table.Cell>
                                <Form.Input disabled={stock.Uuid} value={stock.Amount} placeholder={Literals.Options.TableColumnsAmount[Profile.Language]} name="Amount" type="number" fluid onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Amount', e.target.value) }} />
                              </Table.Cell>
                              <Table.Cell>
                                <Form.Input value={stock.Info} placeholder={Literals.Options.TableColumnsInfo[Profile.Language]} name="Info" fluid onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Info', e.target.value) }} />
                              </Table.Cell>
                              <Table.Cell className='table-last-section'>
                                {!stock.Uuid && <Icon className='type-conversion-remove-icon' link color='red' name='minus circle'
                                  onClick={() => { this.removeProduct(stock.key, stock.Order) }} />}
                              </Table.Cell>
                            </Table.Row>
                          })}
                        </Table.Body>
                        <Table.Footer>
                          <Table.Row>
                            <Table.HeaderCell colSpan='6'>
                              <Button type="button" color='green' className='addMoreButton' size='mini' onClick={() => { this.AddNewProduct(false) }}>{Literals.Button.AddnewStock[Profile.Language]}</Button>
                            </Table.HeaderCell>
                          </Table.Row>
                        </Table.Footer>
                      </Table>
                    }
                  }
                ]}
                renderActiveOnly={false} />
              <Footerwrapper>
                {history && <Link to="/Preregistrations">
                  <Button floated="left" color='grey'>{Literals.Button.Goback[Profile.Language]}</Button>
                </Link>}
                <Button floated="right" type='submit' color='blue'>{Literals.Button.Update[Profile.Language]}</Button>
              </Footerwrapper>
            </Form>
          </Contentwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    if (this.state.open) {
      return
    }
    const { EditPatientstocks, history, fillPatientnotification, Profile } = this.props
    const stocks = this.state.selectedStocks

    stocks.forEach(data => {
      delete data.key
      data.Amount && (data.Amount = parseInt(data.Amount))
    });


    let errors = []
    stocks.forEach(data => {
      if (!validator.isUUID(data.StockdefineID)) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Stockdefinedefinerequired[Profile.Language] })
      }
      if (!validator.isUUID(data.DepartmentID)) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Departmentrequired[Profile.Language] })
      }
      if (data.Ismedicine && !validator.isISODate(data.Skt)) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Sktdefinerequired[Profile.Language] })
      }
      if (data.Ismedicine && !validator.isString(data.Barcodeno)) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Barcodenorequired[Profile.Language] })
      }
      if (!validator.isNumber(data.Amount)) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Amountrequired[Profile.Language] })
      }
    });

    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatientnotification(error)
      })
    } else {
      EditPatientstocks({ data: stocks, history, url: "/Preregistrations" })
    }
  }

  AddNewProduct = (Ismedicine) => {
    const { Patients } = this.props
    this.setState({
      selectedStocks: [...this.state.selectedStocks,
      {
        Patient: {},
        PatientID: Patients.selected_record.Uuid,
        StockdefineID: '',
        Stockdefine: {},
        DepartmentID: '',
        Department: {},
        Skt: null,
        Barcodeno: '',
        Amount: 0,
        Info: '',
        Status: 0,
        Ismedicine: Ismedicine,
        Isapproved: false,
        key: Math.random(),
        Order: this.state.selectedStocks.length,
      }]
    })
  }

  removeProduct = (key, order) => {
    let stocks = this.state.selectedStocks.filter(productionRoute => productionRoute.key !== key)
    stocks.filter(stock => stock.Order > order).forEach(stock => stock.Order--)
    this.setState({ selectedStocks: stocks })
  }

  selectedProductChangeHandler = (key, property, value) => {
    let productionRoutes = this.state.selectedStocks
    const index = productionRoutes.findIndex(productionRoute => productionRoute.key === key)
    if (property === 'Order') {
      productionRoutes.filter(productionRoute => productionRoute.Order === value)
        .forEach((productionRoute) => productionRoute.Order = productionRoutes[index].Order > value ? productionRoute.Order + 1 : productionRoute.Order - 1)
    }
    productionRoutes[index][property] = value
    this.setState({ selectedStocks: productionRoutes })
  }

}
