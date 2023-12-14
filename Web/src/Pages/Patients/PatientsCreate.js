import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Dropdown, Form, Icon, Label, Tab, Table } from 'semantic-ui-react'
import Literals from './Literals'
import { useDropzone } from 'react-dropzone';
import validator from '../../Utils/Validator'
import config from '../../Config'
import { ROUTES } from '../../Utils/Constants'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, AddModal, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import CostumertypesCreate from '../../Containers/Costumertypes/CostumertypesCreate'
import PatienttypesCreate from '../../Containers/Patienttypes/PatienttypesCreate'
import DepartmentsCreate from '../../Containers/Departments/DepartmentsCreate'
import PatientdefinesCreate from '../../Containers/Patientdefines/PatientdefinesCreate'
import StockdefinesCreate from '../../Containers/Stockdefines/StockdefinesCreate'

export default function PatientsCreate(props) {

  const PAGE_NAME = 'PatientsCreate'

  const context = useContext(FormContext)
  const [newRegister, setnewRegister] = useState(true)
  const [selectedFiles, setselectedFiles] = useState([])
  const [selectedStocks, setselectedStocks] = useState([])

  const { Patientdefines, Patients, Departments, Cases, Profile, history, closeModal,
    Costumertypes, Patienttypes, Stockdefines, fillPatientnotification, Floors, Rooms, Beds, Warehouses, AddPatientReturnPatient } = props
  const { isLoading } = Patients

  useEffect(() => {
    const { GetPatientdefines, GetDepartments, GetCases,
      GetCostumertypes, GetPatienttypes, GetStockdefines, GetFloors, GetBeds, GetRooms, GetWarehouses } = props
    GetPatientdefines()
    GetDepartments()
    GetCases()
    GetCostumertypes()
    GetPatienttypes()
    GetStockdefines()
    GetFloors()
    GetBeds()
    GetRooms()
    GetWarehouses()
  }, [])


  const validateTcNumber = (tcNumber) => {
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

  const handleRegistertype = () => {
    setnewRegister(!newRegister)
    context.setFormstates({
      ...context.formstates,
      [`${PAGE_NAME}/PatientdefineID`]: null,
      [`${PAGE_NAME}/Firstname`]: null,
      [`${PAGE_NAME}/Lastname`]: null,
      [`${PAGE_NAME}/Fathername`]: null,
      [`${PAGE_NAME}/Mothername`]: null,
      [`${PAGE_NAME}/CountryID`]: null,
      [`${PAGE_NAME}/Dateofbirth`]: null,
      [`${PAGE_NAME}/Placeofbirth`]: null,
      [`${PAGE_NAME}/Gender`]: null,
    })
  }


  const Warehouseoptions = (Warehouses.list || []).filter(u => u.Isactive).map(warehouse => {
    return { key: warehouse.Uuid, text: warehouse.Name, value: warehouse.Uuid }
  })

  const Flooroptions = (Floors.list || []).filter(u => u.Isactive).map(floor => {
    return { key: floor.Uuid, text: floor.Name, value: floor.Uuid }
  })

  const Roomoptions = (Rooms.list || []).filter(u => u.Isactive && u.FloorID === context.formstates[`${PAGE_NAME}/FloorID`]).map(room => {
    return { key: room.Uuid, text: room.Name, value: room.Uuid }
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

  const Casesoptions = (Cases.list || []).filter(u => u.Isactive).filter(u => u.CaseStatus !== -1).map(cases => {
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

  const Stockdefinesoption = (Stockdefines.list || []).filter(u => !u.Ismedicine && u.Isactive).map(stockdefine => {
    return { key: stockdefine.Uuid, text: stockdefine.Name, value: stockdefine.Uuid }
  })

  const Medicinedefinesoption = (Stockdefines.list || []).filter(u => u.Ismedicine && u.Isactive).map(stockdefine => {
    return { key: stockdefine.Uuid, text: stockdefine.Name, value: stockdefine.Uuid }
  })

  const Patientdepartmentsoption = (Departments.list || []).filter(u => u.Isactive && u.Ishavepatients).map(department => {
    return { key: department.Uuid, text: department.Name, value: department.Uuid }
  })

  const Bedoptions = (
    validator.isUUID(context.formstates[`${PAGE_NAME}/FloorID`]) &&
    validator.isUUID(context.formstates[`${PAGE_NAME}/RoomID`])) ?
    (Beds.list || []).filter(u => u.Isactive && u.Isoccupied === 0 && u.RoomID === context.formstates[`${PAGE_NAME}/RoomID`]).map(bed => {
      return { key: bed.Uuid, text: bed.Name, value: bed.Uuid }
    }) : []

  const usagetypes = [
    { key: Literals.Create.Options.usageType0[Profile.Language], text: Literals.Create.Options.usageType0[Profile.Language], value: Literals.Create.Options.usageType0[Profile.Language] },
    { key: Literals.Create.Options.usageType1[Profile.Language], text: Literals.Create.Options.usageType1[Profile.Language], value: Literals.Create.Options.usageType1[Profile.Language] },
    { key: Literals.Create.Options.usageType2[Profile.Language], text: Literals.Create.Options.usageType2[Profile.Language], value: "PP" },
    { key: Literals.Create.Options.usageType3[Profile.Language], text: Literals.Create.Options.usageType3[Profile.Language], value: Literals.Create.Options.usageType3[Profile.Language] },
    { key: Literals.Create.Options.usageType4[Profile.Language], text: Literals.Create.Options.usageType4[Profile.Language], value: Literals.Create.Options.usageType4[Profile.Language] },
    { key: Literals.Create.Options.usageType5[Profile.Language], text: Literals.Create.Options.usageType5[Profile.Language], value: Literals.Create.Options.usageType5[Profile.Language] },
    { key: Literals.Create.Options.usageType6[Profile.Language], text: Literals.Create.Options.usageType6[Profile.Language], value: Literals.Create.Options.usageType6[Profile.Language] },
    { key: Literals.Create.Options.usageType7[Profile.Language], text: Literals.Create.Options.usageType7[Profile.Language], value: Literals.Create.Options.usageType7[Profile.Language] },
    { key: Literals.Create.Options.usageType8[Profile.Language], text: Literals.Create.Options.usageType8[Profile.Language], value: Literals.Create.Options.usageType8[Profile.Language] },
  ]

  const AddNewFile = () => {
    setselectedFiles(oldfiles => [...oldfiles, {
      Name: '',
      ParentID: '',
      Filename: '',
      Filefolder: '',
      Filepath: '',
      Filetype: '',
      Usagetype: '',
      Canteditfile: false,
      File: {},
      key: Math.random(),
      WillDelete: false,
      fileChanged: true,
      Order: selectedFiles.length,
    }])
  }

  const AddNewProduct = (Ismedicine, Issupply) => {
    setselectedStocks(oldstocks => [...oldstocks,
    {
      PatientID: '',
      StockdefineID: '',
      DepartmentID: '',
      Skt: '',
      Barcodeno: '',
      Amount: 0,
      Info: '',
      Status: 0,
      Isredprescription: false,
      Ismedicine: Ismedicine,
      Issupply: Issupply,
      Isapproved: false,
      key: Math.random(),
      Order: selectedStocks.filter(u => u.Issupply === Issupply && u.Ismedicine === Ismedicine).length,
    }
    ])
  }

  const removeProduct = (key, order) => {
    let stocks = selectedStocks.filter(productionRoute => productionRoute.key !== key)
    stocks.filter(stock => stock.Order > order).forEach(stock => stock.Order--)
    setselectedStocks([...stocks])
  }

  const selectedProductChangeHandler = (key, property, value) => {

    let selectedProduct = selectedStocks.find(u => u.key === key);
    let productionRoutes = selectedStocks
    const index = productionRoutes.findIndex(productionRoute => productionRoute.key === key)
    if (property === 'Order') {
      productionRoutes.filter(item => item.Order === value && item.Issupply === selectedProduct?.Issupply && item.Ismedicine === selectedProduct?.Ismedicine)
        .forEach((item) => item.Order = productionRoutes[index].Order > value ? item.Order + 1 : item.Order - 1)
    }
    productionRoutes[index][property] = value
    productionRoutes[index].Isredprescription = (Stockdefines.list || []).find(u => u.Uuid === productionRoutes[index].StockefineID)?.Isredprescription || false
    setselectedStocks([...productionRoutes])
  }

  const removeFile = (key, order) => {
    const index = selectedFiles.findIndex(file => file.key === key)
    let selectedfiles = selectedFiles

    if (selectedfiles[index].Uuid) {
      selectedfiles[index].WillDelete = !(selectedfiles[index].WillDelete)
      setselectedFiles([...selectedfiles])
    } else {
      let files = selectedfiles.filter(file => file.key !== key)
      files.filter(file => file.Order > order).forEach(file => file.Order--)
      setselectedFiles([...files])
    }
  }

  const handleFilechange = (key) => {
    const index = selectedFiles.findIndex(file => file.key === key)
    let selectedfiles = selectedFiles
    if (selectedfiles[index].WillDelete) {
      return
    }
    if (selectedfiles[index].fileChanged) {
      return
    }
    selectedfiles[index].fileChanged = !(selectedfiles[index].fileChanged)
    selectedfiles[index].File = {}
    setselectedFiles([...selectedfiles])
  }

  const selectedFilesChangeHandler = (key, property, value) => {
    let selectedfiles = selectedFiles
    const index = selectedfiles.findIndex(file => file.key === key)
    if (property === 'Order') {
      selectedfiles.filter(file => file.Order === value)
        .forEach((file) => file.Order = selectedfiles[index].Order > value ? file.Order + 1 : file.Order - 1)
    }
    if (property === 'File') {
      if (value.target.files && value.target.files.length > 0) {
        selectedfiles[index][property] = value.target.files[0]
        selectedfiles[index].Filename = selectedfiles[index].File?.name
        selectedfiles[index].Name = selectedfiles[index].File?.name
        selectedfiles[index].fileChanged = false
      }
    } else {
      selectedfiles[index][property] = value
    }
    setselectedFiles([...selectedfiles])
  }

  const DataCleaner = (data) => {
    if (data.Id !== undefined) {
      delete data.Id;
    }
    if (data.Createduser !== undefined) {
      delete data.Createduser;
    }
    if (data.Createtime !== undefined) {
      delete data.Createtime;
    }
    if (data.Updateduser !== undefined) {
      delete data.Updateduser;
    }
    if (data.Updatetime !== undefined) {
      delete data.Updatetime;
    }
    if (data.Deleteduser !== undefined) {
      delete data.Deleteduser;
    }
    if (data.Deletetime !== undefined) {
      delete data.Deletetime;
    }
    return data
  }

  const onDrop = useCallback((acceptedFiles) => {
    let files = []
    for (const file of acceptedFiles) {
      files.push({
        Name: file?.name,
        ParentID: '',
        Filename: file?.name,
        Filefolder: '',
        Filepath: '',
        Filetype: '',
        Usagetype: '',
        Canteditfile: false,
        File: file,
        key: Math.random(),
        WillDelete: false,
        fileChanged: false,
        Order: selectedFiles.length,
      })
    }
    setselectedFiles(oldfiles => [...oldfiles, ...files])
  }, []);

  const handleSubmit = () => {
    const data = context.getForm(PAGE_NAME)
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
    defaultDepartment ? (data.DepartmentID = defaultDepartment?.Uuid) : data.DepartmentID = context.formstates[`${PAGE_NAME}/DepartmentID`]

    data.Iswilltransfer = context.formstates[`${PAGE_NAME}/Iswilltransfer`] || false
    data.WarehouseID = data.Iswilltransfer && context.formstates[`${PAGE_NAME}/WarehouseID`]

    const response = {
      Stocks: [],
      Patientdefine: {},
      Patientstatus: 0,
      Files: [],
      Releasedate: null,
      RoomID: data.RoomID,
      FloorID: data.FloorID,
      BedID: data.BedID,
      Iswaitingactivation: false,
      ImageID: "",
      PatientdefineID: "",
      Approvaldate: data.Approvaldate,
      Registerdate: data.Registerdate,
      Happensdate: data.Happensdate,
      DepartmentID: data.DepartmentID,
      CheckperiodID: "",
      TodogroupdefineID: "",
      CaseID: data.CaseID,
      Iswilltransfer: data.Iswilltransfer,
      WarehouseID: data.WarehouseID,
    }
    if (newRegister) {
      response.Patientdefine = {
        CountryID: data.CountryID,
        Dateofbirth: data.Dateofbirth,
        Fathername: data.Fathername,
        Firstname: data.Firstname,
        Lastname: data.Lastname,
        Medicalboardreport: data.Medicalboardreport,
        Mothername: data.Mothername,
        Placeofbirth: data.Placeofbirth,
        Gender: data.Gender,
        CostumertypeID: data.CostumertypeID,
        PatienttypeID: data.PatienttypeID,
      }
    } else {
      response.Patientdefine = (Patientdefines.list || []).find(u => u.Uuid === data.PatientdefineID)
      response.PatientdefineID = response.Patientdefine?.Uuid
    }



    selectedFiles.forEach(data => {
      if (!data.Name || data.Name === '') {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Create.Errors.Filenamerequired[Profile.Language] })
      }
    });

    const uncleanfiles = [...selectedFiles]
    const stocks = Array.from(selectedStocks)
    let errors = []

    stocks.forEach(data => {
      data.Skt === '' && (data.Skt = null)
      data.Amount && (data.Amount = parseFloat(data.Amount))
      if (!validator.isUUID(data.StockdefineID)) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Create.Errors.Stockdefinedefinerequired[Profile.Language] })
      }
      if (!validator.isUUID(data.DepartmentID)) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Create.Errors.Departmentrequired[Profile.Language] })
      }
      if (data.Ismedicine && !validator.isISODate(data.Skt)) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Create.Errors.Sktdefinerequired[Profile.Language] })
      }
      if (data.Ismedicine && !validator.isString(data.Barcodeno)) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Create.Errors.Barcodenorequired[Profile.Language] })
      }
      if (!validator.isUUID(data?.Uuid) && !validator.isNumber(data.Amount)) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Create.Errors.Amountrequired[Profile.Language] })
      }
    });



    if (!validator.isUUID(response.DepartmentID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Create.Errors.Departmentrequired[Profile.Language] })
    }
    if (!validator.isUUID(response.CaseID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Create.Errors.Caserequired[Profile.Language] })
    }
    if (!validator.isISODate(response.Registerdate)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Create.Errors.Registerdaterequired[Profile.Language] })
    }
    if (newRegister ? !validator.isString(response.Patientdefine?.CountryID) : !validator.isUUID(response.PatientdefineID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Create.Errors.Patientdefinerequired[Profile.Language] })
    }

    if (data.Iswilltransfer === true && !validator.isUUID(data.WarehouseID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Create.Errors.Warehouserequired[Profile.Language] })
    }
    if (!validator.isUUID(data.FloorID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Create.Errors.Floorrequired[Profile.Language] })
    }
    if (!validator.isUUID(data.RoomID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Create.Errors.Roomrequired[Profile.Language] })
    }
    if (!validator.isUUID(data.BedID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Create.Errors.Bedrequired[Profile.Language] })
    }
    if (!validator.isISODate(data.Approvaldate)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Create.Errors.Approvaldaterequired[Profile.Language] })
    }
    if (!validator.isUUID(data.CaseID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Create.Errors.Caserequired[Profile.Language] })
    }

    const filesthatwillcheck = [
      Literals.Create.Options.usageType3[Profile.Language],
      Literals.Create.Options.usageType4[Profile.Language],
      Literals.Create.Options.usageType5[Profile.Language],
      Literals.Create.Options.usageType6[Profile.Language],
      Literals.Create.Options.usageType7[Profile.Language],
      Literals.Create.Options.usageType8[Profile.Language],
    ]

    filesthatwillcheck.forEach(usagetype => {
      const foundedfile = selectedFiles.find(u => u.Usagetype === usagetype)
      if (!foundedfile) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: `${usagetype} ${Literals.Create.Errors.filerequired[Profile.Language]}` })
      }
    });

    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatientnotification(error)
      })
    } else {

      const files = uncleanfiles.map(data => {
        return DataCleaner(data)
      });


      AddPatientReturnPatient({ Patientdata: response, files: files, stocks: stocks, history: props.history, redirectUrl: '/Patients' })
    }
  }

  const defaultDepartment = (Departments.list || []).filter(u => u.Isactive).find(u => u.Isdefaultpatientdepartment)
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true, noClick: true });

  return (
    isLoading ? <LoadingPage /> :
      <Pagewrapper>
        <Headerwrapper>
          <Headerbredcrump>
            <Link to={"/Patients"}>
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
            <Label className='cursor-pointer' onClick={() => { handleRegistertype() }}>{!newRegister ? Literals.Create.Columns.Registered[Profile.Language] : Literals.Create.Columns.Newregister[Profile.Language]}</Label>
            {!newRegister
              ? <FormInput page={PAGE_NAME} placeholder={Literals.Create.Columns.Patientdefine[Profile.Language]} name="PatientdefineID" options={Patientdefineoptions} formtype="dropdown" required modal={PatientdefinesCreate} />
              : <React.Fragment>
                <Form.Group widths={'equal'}>
                  <FormInput page={PAGE_NAME} placeholder={Literals.Create.Columns.Firstname[Profile.Language]} name="Firstname" />
                  <FormInput page={PAGE_NAME} placeholder={Literals.Create.Columns.Lastname[Profile.Language]} name="Lastname" />
                  <FormInput page={PAGE_NAME} placeholder={Literals.Create.Columns.CountryID[Profile.Language]} name="CountryID" required maxLength={11} validationfunc={validateTcNumber} validationmessage={"Geçerli Bir Tc Giriniz!"} />
                  <FormInput page={PAGE_NAME} placeholder={Literals.Create.Columns.Costumertype[Profile.Language]} name="CostumertypeID" options={Costumertypeoptions} formtype="dropdown" modal={CostumertypesCreate} />
                </Form.Group>
                <Form.Group widths={'equal'}>
                  <FormInput page={PAGE_NAME} placeholder={Literals.Create.Columns.Patienttype[Profile.Language]} name="PatienttypeID" options={Patienttypeoptions} formtype="dropdown" modal={PatienttypesCreate} />
                  <FormInput page={PAGE_NAME} placeholder={Literals.Create.Columns.Medicalboardreport[Profile.Language]} name="Medicalboardreport" options={Medicalboardreportoptions} formtype='dropdown' />
                  <FormInput page={PAGE_NAME} placeholder={Literals.Create.Columns.Dateofbirth[Profile.Language]} name="Dateofbirth" type="date" />
                  <FormInput page={PAGE_NAME} placeholder={Literals.Create.Columns.Gender[Profile.Language]} name="Gender" options={Genderoptions} formtype="dropdown" />
                </Form.Group>
              </React.Fragment>
            }
            <Form.Group widths={'equal'}>
              <FormInput page={PAGE_NAME} placeholder={Literals.Create.Columns.Registerdate[Profile.Language]} name="Registerdate" type='date' required />
              <FormInput page={PAGE_NAME} placeholder={Literals.Create.Columns.Happensdate[Profile.Language]} name="Happensdate" type='date' />
            </Form.Group>
            <Form.Group widths={'equal'}>
              {!defaultDepartment ? <FormInput page={PAGE_NAME} placeholder={Literals.Create.Columns.Deparment[Profile.Language]} name="DepartmentID" options={Departmentoptions} formtype="dropdown" required modal={DepartmentsCreate} /> : null}
            </Form.Group>
          </Form>
        </Contentwrapper>
        <Pagedivider />
        <Contentwrapper>
          <Form>
            <div {...getRootProps()} className={isDragActive ? `opacity-50 shadow-blue-700 shadow-lg transition-all ease-in-out duration-300` : null}>
              <input {...getInputProps()} />
              <Table celled  >
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell width={1}>{Literals.Create.Options.TableColumnsOrder[Profile.Language]}</Table.HeaderCell>
                    <Table.HeaderCell width={3}>{Literals.Create.Options.TableColumnsFileName[Profile.Language]}</Table.HeaderCell>
                    <Table.HeaderCell width={3}>{Literals.Create.Options.TableColumnsUploadStatus[Profile.Language]}</Table.HeaderCell>
                    <Table.HeaderCell width={9}>{Literals.Create.Options.TableColumnsFile[Profile.Language]}</Table.HeaderCell>
                    <Table.HeaderCell width={9}>{Literals.Create.Options.TableColumnsUploadStatus[Profile.Language]}</Table.HeaderCell>
                    <Table.HeaderCell width={1}>{Literals.Create.Options.TableColumnsDelete[Profile.Language]}</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {selectedFiles.sort((a, b) => a.Order - b.Order).map((file, index) => {
                    return <Table.Row key={file.key}>
                      <Table.Cell>
                        <Button.Group basic size='small'>
                          <Button type='button' disabled={index === 0} icon='angle up' onClick={() => { selectedFilesChangeHandler(file.key, 'Order', file.Order - 1) }} />
                          <Button type='button' disabled={index + 1 === selectedFiles.length} icon='angle down' onClick={() => { selectedFilesChangeHandler(file.key, 'Order', file.Order + 1) }} />
                        </Button.Group>
                      </Table.Cell>
                      <Table.Cell>
                        <Form.Input disabled={file.WillDelete} value={file.Name} placeholder={Literals.Create.Options.TableColumnsFileName[Profile.Language]} name="Name" fluid onChange={(e) => { selectedFilesChangeHandler(file.key, 'Name', e.target.value) }} />
                      </Table.Cell>
                      <Table.Cell>
                        <Dropdown disabled={file.WillDelete} value={file.Usagetype} placeholder={Literals.Create.Options.TableColumnsUsagetype[Profile.Language]} name="Usagetype" clearable selection search fluid options={usagetypes} onChange={(e, data) => { selectedFilesChangeHandler(file.key, 'Usagetype', data.value) }} />
                      </Table.Cell>
                      <Table.Cell>
                        {file.fileChanged
                          ? <Form.Input disabled={file.WillDelete} className='w-full flex justify-center items-center' type='File' name="File" fluid onChange={(e) => { selectedFilesChangeHandler(file.key, 'File', e) }} />
                          : <>
                            <Label color='blue'>{file.Filename}</Label>
                            {validator.isUUID(file.Uuid) &&
                              <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href={`${config.services.File}${ROUTES.FILE}/Downloadfile/${file.Uuid}`}
                              >
                                <Icon name='download' />
                              </a>}
                          </>}
                      </Table.Cell>
                      <Table.Cell>
                        {file.fileChanged
                          ? <Icon disabled={!file.WillDelete} onClick={() => { handleFilechange(file.key, file.fileChanged) }} className='cursor-pointer' color='red' name='times circle' />
                          : <Icon onClick={() => { handleFilechange(file.key, file.fileChanged) }} className='cursor-pointer' color='green' name='checkmark' />
                        }
                      </Table.Cell>
                      <Table.Cell className='table-last-section'>
                        <Icon className='type-conversion-remove-icon' link color={file.WillDelete ? 'green' : 'red'} name={`${file.WillDelete ? 'checkmark' : 'minus circle'}`}
                          onClick={() => { removeFile(file.key, file.Order) }} />
                      </Table.Cell>
                    </Table.Row>
                  })}
                </Table.Body>
                <Table.Footer>
                  <Table.Row>
                    <Table.HeaderCell colSpan='7'>
                      <Button type="button" color='green' className='addMoreButton' size='mini' onClick={() => { AddNewFile() }}>{Literals.Button.Addnewfile[Profile.Language]}</Button>
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Footer>
              </Table>
            </div>
          </Form>
        </Contentwrapper>
        <Pagedivider />
        <Contentwrapper>
          <Form>
            <Tab
              panes={[
                {
                  menuItem: Literals.Create.Columns.Medicines[Profile.Language],
                  pane: {
                    key: 'medicines',
                    content: <Table celled className='overflow-x-auto' key='medicineTable' >
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell width={1}>{Literals.Create.Options.TableColumnsOrder[Profile.Language]}</Table.HeaderCell>
                          <Table.HeaderCell width={2}>{Literals.Create.Options.TableColumnsStockdefine[Profile.Language]}{<AddModal Content={StockdefinesCreate} />}</Table.HeaderCell>
                          <Table.HeaderCell width={2}>{Literals.Create.Options.TableColumnsDepartment[Profile.Language]}{<AddModal Content={DepartmentsCreate} />}</Table.HeaderCell>
                          <Table.HeaderCell width={2}>{Literals.Create.Options.TableColumnsBarcode[Profile.Language]}</Table.HeaderCell>
                          <Table.HeaderCell width={2}>{Literals.Create.Options.TableColumnsSkt[Profile.Language]}</Table.HeaderCell>
                          <Table.HeaderCell width={2}>{Literals.Create.Options.TableColumnsAmount[Profile.Language]}</Table.HeaderCell>
                          <Table.HeaderCell width={6}>{Literals.Create.Options.TableColumnsInfo[Profile.Language]}</Table.HeaderCell>
                          <Table.HeaderCell width={1}>{Literals.Create.Options.TableColumnsDelete[Profile.Language]}</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {selectedStocks.filter(u => u.Ismedicine && !u.Issupply).sort((a, b) => a.Order - b.Order).map((stock, index) => {
                          return <Table.Row key={stock.key}>
                            <Table.Cell>
                              <Button.Group basic size='small'>
                                <Button type='button' disabled={index === 0} icon='angle up' onClick={() => { selectedProductChangeHandler(stock.key, 'Order', stock.Order - 1) }} />
                                <Button type='button' disabled={index + 1 === selectedStocks.length} icon='angle down' onClick={() => { selectedProductChangeHandler(stock.key, 'Order', stock.Order + 1) }} />
                              </Button.Group>
                            </Table.Cell>
                            <Table.Cell>
                              <Form.Field>
                                <Dropdown value={stock.StockdefineID} placeholder={Literals.Create.Options.TableColumnsStockdefine[Profile.Language]} name="StockdefineID" clearable search fluid selection options={Medicinedefinesoption
                                } onChange={(e, data) => { selectedProductChangeHandler(stock.key, 'StockdefineID', data.value) }} />
                              </Form.Field>
                            </Table.Cell>
                            <Table.Cell>
                              <Form.Field>
                                <Dropdown value={stock.DepartmentID} placeholder={Literals.Create.Options.TableColumnsDepartment[Profile.Language]} name="DepartmentID" clearable search fluid selection options={Patientdepartmentsoption} onChange={(e, data) => { selectedProductChangeHandler(stock.key, 'DepartmentID', data.value) }} />
                              </Form.Field>
                            </Table.Cell>
                            <Table.Cell>
                              <Form.Input value={stock.Barcodeno} placeholder={Literals.Create.Options.TableColumnsBarcode[Profile.Language]} name="Barcodeno" fluid onChange={(e) => { selectedProductChangeHandler(stock.key, 'Barcodeno', e.target.value) }} />
                            </Table.Cell>
                            <Table.Cell>
                              <Form.Input value={stock.Skt && stock.Skt.split('T')[0]} placeholder={Literals.Create.Options.TableColumnsSkt[Profile.Language]} name="Skt" type='date' fluid onChange={(e) => { selectedProductChangeHandler(stock.key, 'Skt', e.target.value) }} />
                            </Table.Cell>
                            <Table.Cell>
                              <Form.Input disabled={stock.Uuid ? true : false} value={stock.Amount} placeholder={Literals.Create.Options.TableColumnsAmount[Profile.Language]} name="Amount" type="number" fluid onChange={(e) => { selectedProductChangeHandler(stock.key, 'Amount', e.target.value) }} />
                            </Table.Cell>
                            <Table.Cell>
                              <Form.Input value={stock.Info} placeholder={Literals.Create.Options.TableColumnsInfo[Profile.Language]} name="Info" fluid onChange={(e) => { selectedProductChangeHandler(stock.key, 'Info', e.target.value) }} />
                            </Table.Cell>
                            <Table.Cell className='table-last-section'>
                              {!stock.Uuid && <Icon className='type-conversion-remove-icon' link color='red' name='minus circle'
                                onClick={() => { removeProduct(stock.key, stock.Order) }} />}
                            </Table.Cell>
                          </Table.Row>
                        })}
                      </Table.Body>
                      <Table.Footer>
                        <Table.Row>
                          <Table.HeaderCell colSpan='8'>
                            <Button type="button" color='green' className='addMoreButton' size='mini' onClick={() => { AddNewProduct(true, false) }}>{Literals.Button.AddnewMedicine[Profile.Language]}</Button>
                          </Table.HeaderCell>
                        </Table.Row>
                      </Table.Footer>
                    </Table>
                  }
                },
                {
                  menuItem: Literals.Create.Columns.Supplies[Profile.Language],
                  pane: {
                    key: 'supplies',
                    content: <Table celled className='overflow-x-auto' key='supplyTable' >
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell width={1}>{Literals.Create.Options.TableColumnsOrder[Profile.Language]}</Table.HeaderCell>
                          <Table.HeaderCell width={2}>{Literals.Create.Options.TableColumnsStockdefine[Profile.Language]}{<AddModal Content={StockdefinesCreate} />}</Table.HeaderCell>
                          <Table.HeaderCell width={2}>{Literals.Create.Options.TableColumnsDepartment[Profile.Language]}{<AddModal Content={DepartmentsCreate} />}</Table.HeaderCell>
                          <Table.HeaderCell width={2}>{Literals.Create.Options.TableColumnsBarcode[Profile.Language]}</Table.HeaderCell>
                          <Table.HeaderCell width={2}>{Literals.Create.Options.TableColumnsSkt[Profile.Language]}</Table.HeaderCell>
                          <Table.HeaderCell width={2}>{Literals.Create.Options.TableColumnsAmount[Profile.Language]}</Table.HeaderCell>
                          <Table.HeaderCell width={6}>{Literals.Create.Options.TableColumnsInfo[Profile.Language]}</Table.HeaderCell>
                          <Table.HeaderCell width={1}>{Literals.Create.Options.TableColumnsDelete[Profile.Language]}</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {selectedStocks.filter(u => !u.Ismedicine && u.Issupply).sort((a, b) => a.Order - b.Order).map((stock, index) => {
                          return <Table.Row key={stock.key}>
                            <Table.Cell>
                              <Button.Group basic size='small'>
                                <Button type='button' disabled={index === 0} icon='angle up' onClick={() => { selectedProductChangeHandler(stock.key, 'Order', stock.Order - 1) }} />
                                <Button type='button' disabled={index + 1 === selectedStocks.length} icon='angle down' onClick={() => { selectedProductChangeHandler(stock.key, 'Order', stock.Order + 1) }} />
                              </Button.Group>
                            </Table.Cell>
                            <Table.Cell>
                              <Form.Field>
                                <Dropdown value={stock.StockdefineID} placeholder={Literals.Create.Options.TableColumnsStockdefine[Profile.Language]} name="StockdefineID" clearable search fluid selection options={Stockdefinesoption
                                } onChange={(e, data) => { selectedProductChangeHandler(stock.key, 'StockdefineID', data.value) }} />
                              </Form.Field>
                            </Table.Cell>
                            <Table.Cell>
                              <Form.Field>
                                <Dropdown value={stock.DepartmentID} placeholder={Literals.Create.Options.TableColumnsDepartment[Profile.Language]} name="DepartmentID" clearable search fluid selection options={Departmentoptions} onChange={(e, data) => { selectedProductChangeHandler(stock.key, 'DepartmentID', data.value) }} />
                              </Form.Field>
                            </Table.Cell>
                            <Table.Cell>
                              <Form.Input value={stock.Barcodeno} placeholder={Literals.Create.Options.TableColumnsBarcode[Profile.Language]} name="Barcodeno" fluid onChange={(e) => { selectedProductChangeHandler(stock.key, 'Barcodeno', e.target.value) }} />
                            </Table.Cell>
                            <Table.Cell>
                              <Form.Input value={stock.Skt && stock.Skt.split('T')[0]} placeholder={Literals.Create.Options.TableColumnsSkt[Profile.Language]} name="Skt" type='date' fluid onChange={(e) => { selectedProductChangeHandler(stock.key, 'Skt', e.target.value) }} />
                            </Table.Cell>
                            <Table.Cell>
                              <Form.Input disabled={stock.Uuid ? true : false} value={stock.Amount} placeholder={Literals.Create.Options.TableColumnsAmount[Profile.Language]} name="Amount" type="number" fluid onChange={(e) => { selectedProductChangeHandler(stock.key, 'Amount', e.target.value) }} />
                            </Table.Cell>
                            <Table.Cell>
                              <Form.Input value={stock.Info} placeholder={Literals.Create.Options.TableColumnsInfo[Profile.Language]} name="Info" fluid onChange={(e) => { selectedProductChangeHandler(stock.key, 'Info', e.target.value) }} />
                            </Table.Cell>
                            <Table.Cell className='table-last-section'>
                              {!stock.Uuid && <Icon className='type-conversion-remove-icon' link color='red' name='minus circle'
                                onClick={() => { removeProduct(stock.key, stock.Order) }} />}
                            </Table.Cell>
                          </Table.Row>
                        })}
                      </Table.Body>
                      <Table.Footer>
                        <Table.Row>
                          <Table.Cell colSpan='8'>
                            <Button type="button" color='green' className='addMoreButton' size='mini' onClick={() => { AddNewProduct(false, true) }}>{Literals.Button.AddnewSupplies[Profile.Language]}</Button>
                          </Table.Cell>
                        </Table.Row>
                      </Table.Footer>
                    </Table>
                  }
                },
                {
                  menuItem: Literals.Create.Columns.Stocks[Profile.Language],
                  pane: {
                    key: 'stocks',
                    content: <Table celled className='overflow-x-auto' key='stockTable' >
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell width={1}>{Literals.Create.Options.TableColumnsOrder[Profile.Language]}</Table.HeaderCell>
                          <Table.HeaderCell width={2}>{Literals.Create.Options.TableColumnsStockdefine[Profile.Language]}{<AddModal Content={StockdefinesCreate} />}</Table.HeaderCell>
                          <Table.HeaderCell width={2}>{Literals.Create.Options.TableColumnsDepartment[Profile.Language]}{<AddModal Content={DepartmentsCreate} />}</Table.HeaderCell>
                          <Table.HeaderCell width={2}>{Literals.Create.Options.TableColumnsAmount[Profile.Language]}</Table.HeaderCell>
                          <Table.HeaderCell width={6}>{Literals.Create.Options.TableColumnsInfo[Profile.Language]}</Table.HeaderCell>
                          <Table.HeaderCell width={1}>{Literals.Create.Options.TableColumnsDelete[Profile.Language]}</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {selectedStocks.filter(u => !u.Ismedicine && !u.Issupply).sort((a, b) => a.Order - b.Order).map((stock, index) => {
                          return <Table.Row key={stock.key}>
                            <Table.Cell>
                              <Button.Group basic size='small'>
                                <Button type='button' disabled={index === 0} icon='angle up' onClick={() => { selectedProductChangeHandler(stock.key, 'Order', stock.Order - 1) }} />
                                <Button type='button' disabled={index + 1 === selectedStocks.length} icon='angle down' onClick={() => { selectedProductChangeHandler(stock.key, 'Order', stock.Order + 1) }} />
                              </Button.Group>
                            </Table.Cell>
                            <Table.Cell>
                              <Form.Field>
                                <Dropdown value={stock.StockdefineID} placeholder={Literals.Create.Options.TableColumnsStockdefine[Profile.Language]} name="StockdefineID" clearable search fluid selection options={Stockdefinesoption} onChange={(e, data) => { selectedProductChangeHandler(stock.key, 'StockdefineID', data.value) }} />
                              </Form.Field>
                            </Table.Cell>
                            <Table.Cell>
                              <Form.Field>
                                <Dropdown value={stock.DepartmentID} placeholder={Literals.Create.Options.TableColumnsDepartment[Profile.Language]} name="DepartmentID" clearable search fluid selection options={Departmentoptions} onChange={(e, data) => { selectedProductChangeHandler(stock.key, 'DepartmentID', data.value) }} />
                              </Form.Field>
                            </Table.Cell>
                            <Table.Cell>
                              <Form.Input disabled={stock.Uuid ? true : false} value={stock.Amount} placeholder={Literals.Create.Options.TableColumnsAmount[Profile.Language]} name="Amount" type="number" fluid onChange={(e) => { selectedProductChangeHandler(stock.key, 'Amount', e.target.value) }} />
                            </Table.Cell>
                            <Table.Cell>
                              <Form.Input value={stock.Info} placeholder={Literals.Create.Options.TableColumnsInfo[Profile.Language]} name="Info" fluid onChange={(e) => { selectedProductChangeHandler(stock.key, 'Info', e.target.value) }} />
                            </Table.Cell>
                            <Table.Cell className='table-last-section'>
                              {!stock.Uuid && <Icon className='type-conversion-remove-icon' link color='red' name='minus circle'
                                onClick={() => { removeProduct(stock.key, stock.Order) }} />}
                            </Table.Cell>
                          </Table.Row>
                        })}
                      </Table.Body>
                      <Table.Footer>
                        <Table.Row>
                          <Table.Cell colSpan='6'>
                            <Button type="button" color='green' className='addMoreButton' size='mini' onClick={() => { AddNewProduct(false, false) }}>{Literals.Button.AddnewStock[Profile.Language]}</Button>
                          </Table.Cell>
                        </Table.Row>
                      </Table.Footer>
                    </Table>
                  }
                }
              ]}
              renderActiveOnly={false} />
          </Form>
        </Contentwrapper>
        <Pagedivider />
        <Contentwrapper>
          <Form className='w-full'>
            <Form.Group widths={'equal'}>
              <FormInput page={PAGE_NAME} required placeholder={Literals.Create.Columns.Iswilltransfer[Profile.Language]} name="Iswilltransfer" formtype="checkbox" />
              {context.formstates[`${PAGE_NAME}/Iswilltransfer`] &&
                <FormInput page={PAGE_NAME} required placeholder={Literals.Create.Columns.Warehouse[Profile.Language]} name="WarehouseID" options={Warehouseoptions} formtype="dropdown" />
              }
            </Form.Group>
            <Form.Group widths={'equal'}>
              <FormInput page={PAGE_NAME} placeholder={Literals.Create.Columns.Approvaldate[Profile.Language]} name="Approvaldate" type='date' required />
              <FormInput page={PAGE_NAME} required placeholder={Literals.Create.Columns.Case[Profile.Language]} name="CaseID" options={Casesoptions} formtype="dropdown" />
            </Form.Group>
            <Form.Group widths={'equal'}>
              <FormInput page={PAGE_NAME} required placeholder={Literals.Create.Columns.Floor[Profile.Language]} name="FloorID" options={Flooroptions} formtype="dropdown" />
              {validator.isUUID(context.formstates[`${PAGE_NAME}/FloorID`]) && <FormInput page={PAGE_NAME} required placeholder={Literals.Create.Columns.Room[Profile.Language]} name="RoomID" options={Roomoptions} formtype="dropdown" />}
              {validator.isUUID(context.formstates[`${PAGE_NAME}/FloorID`]) && validator.isUUID(context.formstates[`${PAGE_NAME}/RoomID`]) && <FormInput page={PAGE_NAME} required placeholder={Literals.Create.Columns.Bed[Profile.Language]} name="BedID" options={Bedoptions} formtype="dropdown" />}
            </Form.Group>
          </Form>
        </Contentwrapper>
        <Footerwrapper>
          <Gobackbutton
            history={history}
            redirectUrl={"/Patients"}
            buttonText={Literals.Button.Goback[Profile.Language]}
          />
          <Submitbutton
            isLoading={isLoading}
            buttonText={Literals.Create.Columns.enter[Profile.Language]}
            submitFunction={() => { handleSubmit() }}
          />
        </Footerwrapper>
      </Pagewrapper >
  )
}