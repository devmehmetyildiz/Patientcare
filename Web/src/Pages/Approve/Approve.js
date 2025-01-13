import React, { useEffect, useState } from 'react'
import { DataTable, Headerwrapper, MobileTable, NoDataScreen, Pagedivider, Pagewrapper } from '../../Components'
import { Breadcrumb, Grid, GridColumn, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import validator from '../../Utils/Validator'
import Formatdate, { Formatfulldate } from '../../Utils/Formatdate'
import { CLAIMPAYMENT_TYPE_BHKS, CLAIMPAYMENT_TYPE_KYS, CLAIMPAYMENT_TYPE_PATIENT, CLAIMPAYMENT_TYPE_PERSONEL, COL_PROPS, STOCK_TYPE_PATIENT, STOCK_TYPE_PURCHASEORDER } from '../../Utils/Constants'
import StockmovementsApprove from '../../Containers/Stockmovements/StockmovementsApprove'
import PatientvisitsApprove from '../../Containers/Patientvisits/PatientvisitsApprove'
import PatientactivitiesApprove from '../../Containers/Patientactivities/PatientactivitiesApprove'
import UserincidentsApprove from '../../Containers/Userincidents/UserincidentsApprove'
import SurveysApprove from '../../Containers/Surveys/SurveysApprove'
import TrainingsApprove from '../../Containers/Trainings/TrainingsApprove'
import MainteanceplansApprove from '../../Containers/Mainteanceplans/MainteanceplansApprove'
import CareplansApprove from '../../Containers/Careplans/CareplansApprove'
import PurchaseordersApprove from '../../Containers/Purchaseorders/PurchaseordersApprove'
import PreregistrationsApprove from '../../Containers/Preregistrations/PreregistrationsApprove'
import ClaimpaymentsApprove from '../../Containers/Claimpayments/ClaimpaymentsApprove'
import ClaimpaymentparametersApprove from '../../Containers/Claimpaymentparameters/ClaimpaymentparametersApprove'
import PersonelshiftsApprove from '../../Containers/Personelshifts/PersonelshiftsApprove'
import PersonelshiftsPersonelpresettings from '../../Containers/Personelshifts/PersonelshiftsPersonelpresettings'
import ProfessionpresettingsApprove from '../../Containers/Professionpresettings/ProfessionpresettingsApprove'

export default function Approve(props) {

    const { GetStocks, GetUsers, GetStockmovements, GetPurchaseorders, GetWarehouses, GetPatients, GetStockdefines, GetPatientvisits, GetPatientactivities, GetUserincidents,
        GetStocktypes, GetUnits, GetPatientdefines, GetClaimpayments, GetClaimpaymentparameters, GetCostumertypes, GetSurveys, GetTrainings, GetMainteanceplans, GetCareplans,
        GetEquipments, GetPersonelpresettings, GetPersonelshifts, GetProfessionpresettings, GetProfessions } = props

    const { Stocks, Stockmovements, Warehouses, Purchaseorders, Stockdefines, Stocktypes, Patientvisits, Surveys, Mainteanceplans,
        Units, Users, Patients, Patientdefines, Claimpayments, Claimpaymentparameters, Patientactivities, Trainings, Equipments,
        Costumertypes, Userincidents, Careplans, Personelshifts, Personelpresettings, Professionpresettings, Professions, Profile } = props

    const t = Profile?.i18n?.t

    const [stockmovementOpen, setStockmovementOpen] = useState(false)
    const [stockmovementRecord, setStockmovementRecord] = useState(null)

    const [patientvisitOpen, setPatientvisitOpen] = useState(false)
    const [patientvisitRecord, setPatientvisitRecord] = useState(null)

    const [patientactivityOpen, setPatientactivityOpen] = useState(false)
    const [patientactivityRecord, setPatientactivityRecord] = useState(null)

    const [userincidentOpen, setUserincidentOpen] = useState(false)
    const [userincidentRecord, setUserincidentRecord] = useState(null)

    const [surveyOpen, setSurveyOpen] = useState(false)
    const [surveyRecord, setSurveyRecord] = useState(null)

    const [trainingOpen, setTrainingOpen] = useState(false)
    const [trainingRecord, setTrainingRecord] = useState(null)

    const [mainteanceplanOpen, setMainteanceplanOpen] = useState(false)
    const [mainteanceplanRecord, setMainteanceplanRecord] = useState(null)

    const [careplanOpen, setCareplanOpen] = useState(false)
    const [careplanRecord, setCareplanRecord] = useState(null)

    const [purchaseorderOpen, setPurchaseorderOpen] = useState(false)
    const [purchaseorderRecord, setPurhcaseorderRecord] = useState(null)

    const [preregistrationOpen, setPreregistrationOpen] = useState(false)
    const [preregistrationRecord, setPreregistrationRecord] = useState(null)

    const [personelshiftOpen, setPersonelshiftOpen] = useState(false)
    const [personelshiftRecord, setPersonelshiftRecord] = useState(null)

    const [personelpresettingOpen, setPersonelpresettingOpen] = useState(false)
    const [personelpresettingRecord, setPersonelpresettingRecord] = useState(null)

    const [professionpresettingOpen, setProfessionpresettingOpen] = useState(false)
    const [professionpresettingRecord, setProfessionpresettingRecord] = useState(null)

    const [claimpaymentOpen, setClaimpaymentOpen] = useState(false)
    const [claimpaymentRecord, setClaimpaymentRecord] = useState(null)

    const [claimpaymentparameterOpen, setClaimpaymentparameterOpen] = useState(false)
    const [claimpaymentparameterRecord, setClaimpaymentparameterRecord] = useState(null)

    useEffect(() => {
        GetStocks()
        GetStockmovements()
        GetPatients()
        GetStockdefines()
        GetPurchaseorders()
        GetUsers()
        GetWarehouses()
        GetStocktypes()
        GetUnits()
        GetPatientdefines()
        GetClaimpayments()
        GetClaimpaymentparameters()
        GetCostumertypes()
        GetPatientvisits()
        GetPatientactivities()
        GetUserincidents()
        GetSurveys()
        GetTrainings()
        GetMainteanceplans()
        GetEquipments()
        GetCareplans()
        GetPersonelpresettings()
        GetPersonelshifts()
        GetProfessions()
        GetProfessionpresettings()
    }, [])

    const isLoading =
        Stocks.isLoading ||
        Stockmovements.isLoading ||
        Stockdefines.isLoading ||
        Stocktypes.isLoading ||
        Units.isLoading ||
        Warehouses.isLoading ||
        Purchaseorders.isLoading ||
        Users.isLoading ||
        Patients.isLoading ||
        Patientdefines.isLoading ||
        Claimpayments.isLoading ||
        Claimpaymentparameters.isLoading ||
        Patientvisits.isLoading ||
        Patientactivities.isLoading ||
        Userincidents.isLoading ||
        Surveys.isLoading ||
        Trainings.isLoading ||
        Mainteanceplans.isLoading ||
        Careplans.isLoading ||
        Personelshifts.isLoading ||
        Careplans.isLoading ||
        Personelshifts.isLoading ||
        Personelpresettings.isLoading ||
        Professionpresettings.isLoading ||
        Professions.isLoading ||
        Costumertypes.isLoading

    const createStockmovement = () => {
        return (Stockmovements.list || []).filter(u => u.Isactive && !u.Isapproved).map(stockmovement => {
            const stock = (Stocks.list || []).find(u => u.Uuid === stockmovement?.StockID)
            const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
            const stocktype = (Stocktypes.list || []).find(u => u.Uuid === stockdefine?.StocktypeID)
            const Isbarcodeneed = stocktype?.Isbarcodeneed
            const Issktneed = stocktype?.Issktneed
            const unit = (Units.list || []).find(u => u.Uuid === stockdefine?.UnitID)
            const createduser = (Users.list || []).find(u => u.Uuid === validator.isUUID(stockmovement?.Updateduser) ? stockmovement?.Updateduser : stockmovement?.Createduser)

            const type = stock?.Type
            let parent = null

            switch (type) {
                case STOCK_TYPE_PURCHASEORDER:
                    const purchaseorder = (Purchaseorders.list || []).find(u => u.Uuid === stock?.WarehouseID)
                    if (purchaseorder) {
                        parent = `${t('Pages.Stockmovements.Messages.Purchaseorder')} ${purchaseorder?.Purchaseno}`
                    }
                    break;
                case STOCK_TYPE_PATIENT:
                    const patient = (Patients.list || []).find(u => u.Uuid === stock?.WarehouseID)
                    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
                    if (patientdefine) {
                        parent = `${t('Pages.Stockmovements.Messages.Patient')} ${patientdefine?.Firstname} ${patientdefine?.Lastname} - (${patientdefine?.CountryID})`
                    }
                    break;
                default:
                    const warehouse = (Warehouses.list || []).find(u => u.Uuid === stock?.WarehouseID)
                    if (warehouse) {
                        parent = `${t('Pages.Stockmovements.Messages.Warehouse')} ${warehouse?.Name}`
                    }
                    break;
            }

            const stockName = `${parent ? `${parent} - ` : ''}${stockmovement.Amount} ${unit?.Name} ${stockdefine?.Name}${Isbarcodeneed ? ` (${stockdefine?.Barcode})` : ''} ${Issktneed ? ` - ${validator.isISODate(stock?.Skt) ? `${Formatdate(stock?.Skt, true)} Skt` : ''}` : ''}`

            const createDate = validator.isISODate(stockmovement?.Updatetime)
                ? Formatfulldate(stockmovement?.Updatetime, true)
                : Formatfulldate(stockmovement?.Createtime, true)

            return ({
                Name: stockName,
                Parent: t('Pages.Stockmovements.Page.Header'),
                Createdate: createDate,
                Createuser: createduser?.Username || t('Common.NoDataFound'),
                Approve: <Icon link size='large' color='red' name='hand pointer' onClick={() => {
                    setStockmovementRecord(stockmovement)
                    setStockmovementOpen(true)
                }} />,
                Detail: <Link to={`/Stockmovements`} ><Icon size='large' color='red' className='row-edit' name='address book' /> </Link>,
            })
        });
    }

    const createPatientvisit = () => {
        return (Patientvisits.list || []).filter(u => u.Isactive && !u.Isonpreview && !u.Isapproved).map(patientvisit => {
            const createduser = (Users.list || []).find(u => u.Uuid === validator.isUUID(patientvisit?.Updateduser) ? patientvisit?.Updateduser : patientvisit?.Createduser)

            const patient = (Patients.list || []).find(u => u?.Uuid === patientvisit?.PatientID)
            const patientdefine = (Patientdefines.list || []).find(u => u?.Uuid === patient?.PatientdefineID)

            const createDate = validator.isISODate(patientvisit?.Updatetime)
                ? Formatfulldate(patientvisit?.Updatetime, true)
                : Formatfulldate(patientvisit?.Createtime, true)

            return ({
                Name: `${patientdefine?.Firstname} ${patientdefine?.Lastname}`,
                Parent: t('Pages.Patientvisits.Page.Header'),
                Createdate: createDate,
                Createuser: createduser?.Username || t('Common.NoDataFound'),
                Approve: <Icon link size='large' color='red' name='hand pointer' onClick={() => {
                    setPatientvisitRecord(patientvisit)
                    setPatientvisitOpen(true)
                }} />,
                Detail: <Link to={`/Patientvisits`} ><Icon size='large' color='red' className='row-edit' name='address book' /> </Link>,
            })
        });
    }

    const createPatientactivities = () => {
        return (Patientactivities.list || []).filter(u => u.Isactive && !u.Isonpreview && !u.Isapproved).map(patientactivity => {
            const createduser = (Users.list || []).find(u => u.Uuid === validator.isUUID(patientactivity?.Updateduser) ? patientactivity?.Updateduser : patientactivity?.Createduser)


            const createDate = validator.isISODate(patientactivity?.Updatetime)
                ? Formatfulldate(patientactivity?.Updatetime, true)
                : Formatfulldate(patientactivity?.Createtime, true)

            return ({
                Name: patientactivity?.Name,
                Parent: t('Pages.Patientactivities.Page.Header'),
                Createdate: createDate,
                Createuser: createduser?.Username || t('Common.NoDataFound'),
                Approve: <Icon link size='large' color='red' name='hand pointer' onClick={() => {
                    setPatientactivityRecord(patientactivity)
                    setPatientactivityOpen(true)
                }} />,
                Detail: <Link to={`/Patientactivities`} ><Icon size='large' color='red' className='row-edit' name='address book' /> </Link>,
            })
        });
    }

    const createUserincidents = () => {
        return (Userincidents.list || []).filter(u => u.Isactive && !u.Isonpreview && !u.Isapproved).map(userincident => {
            const createduser = (Users.list || []).find(u => u.Uuid === validator.isUUID(userincident?.Updateduser) ? userincident?.Updateduser : userincident?.Createduser)

            const user = (Users.list || []).find(u => u.Uuid === userincident?.UserID)
            const createDate = validator.isISODate(userincident?.Updatetime)
                ? Formatfulldate(userincident?.Updatetime, true)
                : Formatfulldate(userincident?.Createtime, true)

            return ({
                Name: `${user?.Name} ${user?.Surname}`,
                Parent: t('Pages.Userincidents.Page.Header'),
                Createdate: createDate,
                Createuser: createduser?.Username || t('Common.NoDataFound'),
                Approve: <Icon link size='large' color='red' name='hand pointer' onClick={() => {
                    setUserincidentRecord(userincident)
                    setUserincidentOpen(true)
                }} />,
                Detail: <Link to={`/Userincidents`} ><Icon size='large' color='red' className='row-edit' name='address book' /> </Link>,
            })
        });
    }

    const createSurveys = () => {
        return (Surveys.list || []).filter(u => u.Isactive && !u.Isonpreview && !u.Isapproved).map(survey => {
            const createduser = (Users.list || []).find(u => u.Uuid === validator.isUUID(survey?.Updateduser) ? survey?.Updateduser : survey?.Createduser)

            const createDate = validator.isISODate(survey?.Updatetime)
                ? Formatfulldate(survey?.Updatetime, true)
                : Formatfulldate(survey?.Createtime, true)

            return ({
                Name: `${survey?.Name}`,
                Parent: t('Pages.Surveys.Page.Header'),
                Createdate: createDate,
                Createuser: createduser?.Username || t('Common.NoDataFound'),
                Approve: <Icon link size='large' color='red' name='hand pointer' onClick={() => {
                    setSurveyRecord(survey)
                    setSurveyOpen(true)
                }} />,
                Detail: <Link to={`/Surveys`} ><Icon size='large' color='red' className='row-edit' name='address book' /> </Link>,
            })
        });
    }

    const createCareplan = () => {
        return (Careplans.list || []).filter(u => u.Isactive && !u.Isonpreview && !u.Isapproved).map(careplan => {
            const createduser = (Users.list || []).find(u => u.Uuid === validator.isUUID(careplan?.Updateduser) ? careplan?.Updateduser : careplan?.Createduser)

            const createDate = validator.isISODate(careplan?.Updatetime)
                ? Formatfulldate(careplan?.Updatetime, true)
                : Formatfulldate(careplan?.Createtime, true)

            const patient = (Patients.list || []).find(u => u.Uuid === careplan?.PatientID)
            const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)

            return ({
                Name: `${patientdefine?.Firstname} ${patientdefine?.Lastname}`,
                Parent: t('Pages.Careplans.Page.Header'),
                Createdate: createDate,
                Createuser: createduser?.Username || t('Common.NoDataFound'),
                Approve: <Icon link size='large' color='red' name='hand pointer' onClick={() => {
                    setCareplanRecord(careplan)
                    setCareplanOpen(true)
                }} />,
                Detail: <Link to={`/Careplans`} ><Icon size='large' color='red' className='row-edit' name='address book' /> </Link>,
            })
        });
    }

    const createMainteanceplans = () => {
        return (Mainteanceplans.list || []).filter(u => u.Isactive && !u.Isonpreview && !u.Isapproved).map(mainteanceplan => {
            const createduser = (Users.list || []).find(u => u.Uuid === validator.isUUID(mainteanceplan?.Updateduser) ? mainteanceplan?.Updateduser : mainteanceplan?.Createduser)

            const createDate = validator.isISODate(mainteanceplan?.Updatetime)
                ? Formatfulldate(mainteanceplan?.Updatetime, true)
                : Formatfulldate(mainteanceplan?.Createtime, true)

            const equipment = (Equipments.list || []).find(u => u.Uuid === mainteanceplan?.EquipmentID)

            return ({
                Name: `${equipment?.Name}`,
                Parent: t('Pages.Mainteanceplans.Page.Header'),
                Createdate: createDate,
                Createuser: createduser?.Username || t('Common.NoDataFound'),
                Approve: <Icon link size='large' color='red' name='hand pointer' onClick={() => {
                    setMainteanceplanRecord(mainteanceplan)
                    setMainteanceplanOpen(true)
                }} />,
                Detail: <Link to={`/Mainteanceplans`} ><Icon size='large' color='red' className='row-edit' name='address book' /> </Link>,
            })
        });
    }

    const createTrainings = () => {
        return (Trainings.list || []).filter(u => u.Isactive && !u.Isonpreview && !u.Isapproved).map(training => {
            const createduser = (Users.list || []).find(u => u.Uuid === validator.isUUID(training?.Updateduser) ? training?.Updateduser : training?.Createduser)

            const createDate = validator.isISODate(training?.Updatetime)
                ? Formatfulldate(training?.Updatetime, true)
                : Formatfulldate(training?.Createtime, true)

            return ({
                Name: `${training?.Name}`,
                Parent: t('Pages.Trainings.Page.Header'),
                Createdate: createDate,
                Createuser: createduser?.Username || t('Common.NoDataFound'),
                Approve: <Icon link size='large' color='red' name='hand pointer' onClick={() => {
                    setTrainingRecord(training)
                    setTrainingOpen(true)
                }} />,
                Detail: <Link to={`/Trainings`} ><Icon size='large' color='red' className='row-edit' name='address book' /> </Link>,
            })
        });
    }

    const createPurchaseorder = () => {
        return (Purchaseorders.list || []).filter(u => u.Isactive && u.Isopened && u.Ischecked && !u.Isapproved).map(order => {
            const createduser = (Users.list || []).find(u => u.Uuid === validator.isUUID(order?.Updateduser) ? order?.Updateduser : order?.Createduser)

            const createDate = validator.isISODate(order?.Updatetime)
                ? Formatfulldate(order?.Updatetime, true)
                : Formatfulldate(order?.Createtime, true)

            const name = order?.Purchaseno

            return ({
                Name: `${name}`,
                Parent: t('Pages.Purchaseorder.Page.Header'),
                Createdate: createDate,
                Createuser: createduser?.Username || t('Common.NoDataFound'),
                Approve: <Icon link size='large' color='red' name='hand pointer' onClick={() => {
                    setPurhcaseorderRecord(order)
                    setPurchaseorderOpen(true)
                }} />,
                Detail: <Link to={`/Purchaseorders`} ><Icon size='large' color='red' className='row-edit' name='address book' /> </Link>,
            })
        });
    }

    const createPreregistrationlist = () => {
        return (Patients.list || []).filter(u => u.Isactive && u.Ischecked && !u.Isapproved && u.Ispreregistration).map(patient => {

            const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
            const patientName = `${patientdefine?.Firstname} ${patientdefine?.Lastname} - (${patientdefine?.CountryID})`
            const createduser = (Users.list || []).find(u => u.Uuid === validator.isUUID(patient?.Updateduser) ? patient?.Updateduser : patient?.Createduser)
            const createDate = validator.isISODate(patient?.Updatetime)
                ? Formatfulldate(patient?.Updatetime, true)
                : Formatfulldate(patient?.Createtime, true)

            return ({
                Name: patientdefine ? patientName : '',
                Parent: t('Pages.Preregistrations.Page.Header'),
                Createdate: createDate,
                Createuser: createduser?.Username || t('Common.NoDataFound'),
                Approve: <Icon link size='large' color='red' name='hand pointer' onClick={() => {
                    setPreregistrationRecord(patient)
                    setPreregistrationOpen(true)
                }} />,
                Detail: <Link to={`/Preregistrations`} ><Icon size='large' color='red' className='row-edit' name='address book' /> </Link>,
            })
        })
    }

    const createClaimpaymentparameterlist = () => {
        return (Claimpaymentparameters.list || []).filter(u => u.Isactive && !u.Isonpreview && !u.Isapproved).map(paymentparameter => {

            const {
                Type,
                CostumertypeID,
            } = paymentparameter

            const createduser = (Users.list || []).find(u => u.Uuid === validator.isUUID(paymentparameter?.Updateduser) ? paymentparameter?.Updateduser : paymentparameter?.Createduser)
            const createDate = validator.isISODate(paymentparameter?.Updatetime)
                ? Formatfulldate(paymentparameter?.Updatetime, true)
                : Formatfulldate(paymentparameter?.Createtime, true)

            const Claimpaymenttypes = [
                { key: 1, text: t('Common.Claimpayments.Type.Patient'), value: CLAIMPAYMENT_TYPE_PATIENT },
                { key: 2, text: t('Common.Claimpayments.Type.Bhks'), value: CLAIMPAYMENT_TYPE_BHKS },
                { key: 3, text: t('Common.Claimpayments.Type.Kys'), value: CLAIMPAYMENT_TYPE_KYS },
                { key: 4, text: t('Common.Claimpayments.Type.Personel'), value: CLAIMPAYMENT_TYPE_PERSONEL },
            ]

            const typename = Claimpaymenttypes.find(u => u.value === Type)?.text || t('Common.NoDataFound')
            const costumertypename = (Costumertypes.list || []).find(u => u.Uuid === CostumertypeID)?.Name || t('Common.NoDataFound')

            const name = `${typename} - ${costumertypename}`

            return ({
                Name: Type ? name : t('Common.NoDataFound'),
                Parent: t('Pages.Claimpaymentparameters.Page.Header'),
                Createdate: createDate,
                Createuser: createduser?.Username || t('Common.NoDataFound'),
                Approve: <Icon link size='large' color='red' name='hand pointer' onClick={() => {
                    setClaimpaymentparameterOpen(true)
                    setClaimpaymentparameterRecord(paymentparameter)
                }} />,
                Detail: <Link to={`/Claimpaymentparameters`} ><Icon size='large' color='red' className='row-edit' name='address book' /> </Link>,
            })
        })
    }

    const createClaimpaymentlist = () => {
        return (Claimpayments.list || []).filter(u => u.Isactive && !u.Isonpreview && !u.Isapproved).map(payment => {

            const {
                Name,
                Starttime,
                Endtime
            } = payment

            const createduser = (Users.list || []).find(u => u.Uuid === validator.isUUID(payment?.Updateduser) ? payment?.Updateduser : payment?.Createduser)
            const createDate = validator.isISODate(payment?.Updatetime)
                ? Formatfulldate(payment?.Updatetime, true)
                : Formatfulldate(payment?.Createtime, true)

            const name = `${Name}  ${Formatfulldate(Starttime, true)} - ${Formatfulldate(Endtime, true)}`

            return ({
                Name: Name ? name : t('Common.NoDataFound'),
                Parent: t('Pages.Claimpayments.Page.Header'),
                Createdate: createDate,
                Createuser: createduser?.Username || t('Common.NoDataFound'),
                Approve: <Icon link size='large' color='red' name='hand pointer' onClick={() => {
                    setClaimpaymentOpen(true)
                    setClaimpaymentRecord(payment)
                }} />,
                Detail: <Link to={`/Claimpayments`} ><Icon size='large' color='red' className='row-edit' name='address book' /> </Link>,
            })
        })
    }

    const createPersonelshiftlist = () => {
        return (Personelshifts.list || []).filter(u => u.Isactive && !u.Isonpreview && !u.Isapproved).map(shift => {

            const createduser = (Users.list || []).find(u => u.Uuid === validator.isUUID(shift?.Updateduser) ? shift?.Updateduser : shift?.Createduser)
            const createDate = validator.isISODate(shift?.Updatetime)
                ? Formatfulldate(shift?.Updatetime, true)
                : Formatfulldate(shift?.Createtime, true)

            const dates = Getdateoptions()
            const date = `${dates.find(u => Formatdate(u.value) === Formatdate(shift?.Startdate))?.text}`

            const professionName = (Professions.list || []).find(u => u.Uuid === shift?.ProfessionID)
            const name = `${professionName} - ${date}`

            return ({
                Name: name ? name : t('Common.NoDataFound'),
                Parent: t('Pages.Personelshifts.Page.Header'),
                Createdate: createDate,
                Createuser: createduser?.Username || t('Common.NoDataFound'),
                Approve: <Icon link size='large' color='red' name='hand pointer' onClick={() => {
                    setPersonelshiftOpen(true)
                    setPersonelshiftRecord(shift)
                }} />,
                Detail: <Link to={`/Personelshifts`} ><Icon size='large' color='red' className='row-edit' name='address book' /> </Link>,
            })
        })
    }

    const createPersonelpresettinglist = () => {
        return (Personelpresettings.list || []).filter(u => u.Isactive && !u.Isonpreview && !u.Isapproved).map(presetting => {

            const createduser = (Users.list || []).find(u => u.Uuid === validator.isUUID(presetting?.Updateduser) ? presetting?.Updateduser : presetting?.Createduser)
            const createDate = validator.isISODate(presetting?.Updatetime)
                ? Formatfulldate(presetting?.Updatetime, true)
                : Formatfulldate(presetting?.Createtime, true)

            const dates = Getdateoptions()
            const date = `${dates.find(u => Formatdate(u.value) === Formatdate(presetting?.Startdate))?.text}`

            const name = `${presetting?.Isinfinite ? 'Sınırsız Kural' : `${date}`} - ${date}`

            return ({
                Name: name ? name : t('Common.NoDataFound'),
                Parent: t('Pages.Personelpresettings.Page.Header'),
                Createdate: createDate,
                Createuser: createduser?.Username || t('Common.NoDataFound'),
                Approve: <Icon link size='large' color='red' name='hand pointer' onClick={() => {
                    setPersonelpresettingOpen(true)
                    setPersonelpresettingRecord(presetting)
                }} />,
                Detail: <Link to={`/Personelpresettings`} ><Icon size='large' color='red' className='row-edit' name='address book' /> </Link>,
            })
        })
    }

    const createProfessionpresettinglist = () => {
        return (Professionpresettings.list || []).filter(u => u.Isactive && !u.Isonpreview && !u.Isapproved).map(presetting => {

            const createduser = (Users.list || []).find(u => u.Uuid === validator.isUUID(presetting?.Updateduser) ? presetting?.Updateduser : presetting?.Createduser)
            const createDate = validator.isISODate(presetting?.Updatetime)
                ? Formatfulldate(presetting?.Updatetime, true)
                : Formatfulldate(presetting?.Createtime, true)

            const dates = Getdateoptions()
            const date = `${dates.find(u => Formatdate(u.value) === Formatdate(presetting?.Startdate))?.text}`

            const name = `${presetting?.Isinfinite ? 'Sınırsız Kural' : `${date}`} - ${date}`

            return ({
                Name: name ? name : t('Common.NoDataFound'),
                Parent: t('Pages.Professionpresettings.Page.Header'),
                Createdate: createDate,
                Createuser: createduser?.Username || t('Common.NoDataFound'),
                Approve: <Icon link size='large' color='red' name='hand pointer' onClick={() => {
                    setProfessionpresettingOpen(true)
                    setProfessionpresettingRecord(presetting)
                }} />,
                Detail: <Link to={`/Professionpresettings`} ><Icon size='large' color='red' className='row-edit' name='address book' /> </Link>,
            })
        })
    }

    const createList = () => {
        let list = [];
        list = list.concat(createStockmovement())
        list = list.concat(createPreregistrationlist())
        list = list.concat(createClaimpaymentlist())
        list = list.concat(createClaimpaymentparameterlist())
        list = list.concat(createPatientvisit())
        list = list.concat(createPatientactivities())
        list = list.concat(createUserincidents())
        list = list.concat(createSurveys())
        list = list.concat(createTrainings())
        list = list.concat(createMainteanceplans())
        list = list.concat(createCareplan())
        list = list.concat(createPurchaseorder())
        list = list.concat(createPersonelshiftlist())
        list = list.concat(createPersonelpresettinglist())
        list = list.concat(createProfessionpresettinglist())
        return list.sort((a, b) => new Date(b?.Createdate).getTime() - new Date(a?.Createdate).getTime())
    }

    const metaKey = "approve"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const Columns = [
        { Header: t('Pages.Approve.Column.Parent'), accessor: 'Parent', Title: true },
        { Header: t('Pages.Approve.Column.Name'), accessor: 'Name' },
        { Header: t('Pages.Approve.Column.Createdate'), accessor: 'Createdate' },
        { Header: t('Pages.Approve.Column.Createuser'), accessor: 'Createuser' },
        { Header: t('Pages.Approve.Column.Detail'), accessor: 'Detail', disableProps: true },
        { Header: t('Pages.Approve.Column.Approve'), accessor: 'Approve', disableProps: true },
    ].map(u => { return u.disableProps ? u : { ...u, ...COL_PROPS } })

    const list = createList()

    return (
        <React.Fragment>
            <Pagewrapper dimmer isLoading={isLoading}>
                <Headerwrapper>
                    <Grid columns='2' >
                        <GridColumn width={8}>
                            <Breadcrumb size='big'>
                                <Link to={"/Approve"}>
                                    <Breadcrumb.Section>{t('Pages.Approve.Page.Header')}</Breadcrumb.Section>
                                </Link>
                            </Breadcrumb>
                        </GridColumn>
                    </Grid>
                </Headerwrapper>
                <Pagedivider />
                {list.length > 0 ?
                    <div className='w-full mx-auto '>
                        {Profile.Ismobile ?
                            <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
                            <DataTable Columns={Columns} Data={list} Config={initialConfig} />}
                    </div> : <NoDataScreen message={t('Common.NoDataFound')} />
                }
                <StockmovementsApprove
                    open={stockmovementOpen}
                    setOpen={setStockmovementOpen}
                    record={stockmovementRecord}
                    setRecord={setStockmovementRecord}
                />
                <PatientvisitsApprove
                    open={patientvisitOpen}
                    setOpen={setPatientvisitOpen}
                    record={patientvisitRecord}
                    setRecord={setPatientvisitRecord}
                />
                <PatientactivitiesApprove
                    open={patientactivityOpen}
                    setOpen={setPatientactivityOpen}
                    record={patientactivityRecord}
                    setRecord={setPatientactivityRecord}
                />
                <UserincidentsApprove
                    open={userincidentOpen}
                    setOpen={setUserincidentOpen}
                    record={userincidentRecord}
                    setRecord={setUserincidentRecord}
                />
                <SurveysApprove
                    open={surveyOpen}
                    setOpen={setSurveyOpen}
                    record={surveyRecord}
                    setRecord={setSurveyRecord}
                />
                <TrainingsApprove
                    open={trainingOpen}
                    setOpen={setTrainingOpen}
                    record={trainingRecord}
                    setRecord={setTrainingRecord}
                />
                <MainteanceplansApprove
                    open={mainteanceplanOpen}
                    setOpen={setMainteanceplanOpen}
                    record={mainteanceplanRecord}
                    setRecord={setMainteanceplanRecord}
                />
                <CareplansApprove
                    open={careplanOpen}
                    setOpen={setCareplanOpen}
                    record={careplanRecord}
                    setRecord={setCareplanRecord}
                />
                <PurchaseordersApprove
                    open={purchaseorderOpen}
                    setOpen={setPurchaseorderOpen}
                    record={purchaseorderRecord}
                    setRecord={setPurhcaseorderRecord}
                />
                <PreregistrationsApprove
                    open={preregistrationOpen}
                    setOpen={setPreregistrationOpen}
                    record={preregistrationRecord}
                    setRecord={setPreregistrationRecord}
                />
                <ClaimpaymentsApprove
                    open={claimpaymentOpen}
                    setOpen={setClaimpaymentOpen}
                    record={claimpaymentRecord}
                    setRecord={setClaimpaymentRecord}
                />
                <ClaimpaymentparametersApprove
                    open={claimpaymentparameterOpen}
                    setOpen={setClaimpaymentparameterOpen}
                    record={claimpaymentparameterRecord}
                    setRecord={setClaimpaymentparameterRecord}
                />
                <PersonelshiftsApprove
                    open={personelshiftOpen}
                    setOpen={setPersonelshiftOpen}
                    record={personelshiftRecord}
                    setRecord={setPersonelshiftRecord}
                />
                <PersonelshiftsPersonelpresettings
                    open={personelpresettingOpen}
                    setOpen={setPersonelpresettingOpen}
                    record={personelpresettingRecord}
                    setRecord={setPersonelpresettingRecord}
                />
                <ProfessionpresettingsApprove
                    open={professionpresettingOpen}
                    setOpen={setProfessionpresettingOpen}
                    record={professionpresettingRecord}
                    setRecord={setProfessionpresettingRecord}
                />
            </Pagewrapper>
        </React.Fragment>
    )
}
