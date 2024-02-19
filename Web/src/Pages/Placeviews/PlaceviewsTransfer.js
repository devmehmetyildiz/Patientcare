import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form } from 'semantic-ui-react'
import Literals from './Literals'
import validator from "../../Utils/Validator"
import { FormContext } from '../../Provider/FormProvider'
import { PATIENTMOVEMENTTYPE } from '../../Utils/Constants'
import DepartmentsCreate from '../../Containers/Departments/DepartmentsCreate'
import {
    Contentwrapper, Footerwrapper, FormInput, Gobackbutton,
    Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'

export default class PlaceviewsTransfer extends Component {

    PAGE_NAME = 'PlaceviewsTransfer'

    componentDidMount() {
        const { GetCases, GetPatientdefines, GetPatients, GetFloors, GetRooms, GetBeds } = this.props
        GetCases()
        GetPatientdefines()
        GetPatients()
        GetFloors()
        GetRooms()
        GetBeds()
    }

    render() {
        const { Cases, Patientdefines, Patients, Floors, Rooms, Beds, Profile, history, closeModal } = this.props

        const Patientoptions = (Patients.list || []).filter(u => u.Isactive).map(patient => {
            const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient.PatientdefineID)
            const bed = (Beds.list || []).find(bed => bed?.Uuid === patient?.BedID)
            const room = (Rooms.list || []).find(room => room?.Uuid === patient?.RoomID)
            const floor = (Floors.list || []).find(floor => floor?.Uuid === patient?.FloorID)
            return {
                key: patient.Uuid,
                value: patient.Uuid,
                text: validator.isUUID(bed?.Uuid)
                    ? `${patientdefine?.Firstname} ${patientdefine?.Lastname} - ${patientdefine?.CountryID} (${floor?.Name} - ${room?.Name} - ${bed?.Name})`
                    : `${patientdefine?.Firstname} ${patientdefine?.Lastname} - ${patientdefine?.CountryID}`
            }
        })

        const selectedPatient = (Patients.list || []).find(u => u.Uuid === (this.context.formstates[`${this.PAGE_NAME}/PatientID`] || ''))

        const Bedoption = (Beds.list || []).filter(u => u.Uuid !== selectedPatient?.BedID).map(bed => {
            const room = (Rooms.list || []).find(room => room?.Uuid === bed?.RoomID)
            const floor = (Floors.list || []).find(floor => floor?.Uuid === room?.FloorID)
            const patient = (Patients.list || []).find(patient => patient?.BedID === bed?.Uuid && patient?.RoomID === room?.Uuid && patient?.FloorID === floor?.Uuid)
            const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
            return {
                key: bed?.Uuid,
                value: bed?.Uuid,
                text: patientdefine
                    ? `${floor?.Name} - ${room?.Name} - ${bed?.Name} - (${patientdefine?.Firstname} - ${patientdefine?.Lastname})`
                    : `${floor?.Name} - ${room?.Name} - ${bed?.Name}`
            }
        })

        return (
            Patients.isLoading || Patients.isDispatching ? <LoadingPage /> :
                <Pagewrapper>
                    <Headerwrapper>
                        <Headerbredcrump>
                            <Link to={"/Placeviews"}>
                                <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                            </Link>
                            <Breadcrumb.Divider icon='right chevron' />
                            <Breadcrumb.Section>{Literals.Page.Pagetransferheader[Profile.Language]}</Breadcrumb.Section>
                        </Headerbredcrump>
                        {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
                    </Headerwrapper>
                    <Pagedivider />
                    <Contentwrapper>
                        <Form>
                            <Form.Group widths='equal'>
                                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.PatientID[Profile.Language]} name="PatientID" formtype='dropdown' options={Patientoptions} />
                                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Bed[Profile.Language]} name="BedID" formtype='dropdown' options={Bedoption} />
                            </Form.Group>
                        </Form>
                    </Contentwrapper>
                    <Footerwrapper>
                        <Gobackbutton
                            history={history}
                            redirectUrl={"/Cases"}
                            buttonText={Literals.Button.Goback[Profile.Language]}
                        />
                        <Submitbutton
                            isLoading={Cases.isLoading}
                            buttonText={Literals.Button.Update[Profile.Language]}
                            submitFunction={this.handleSubmit}
                        />
                    </Footerwrapper>
                </Pagewrapper >
        )
    }


    handleSubmit = (e) => {
        e.preventDefault()
        const { Transferpatientplace, history, Profile, closeModal, Patients, Beds, Rooms, Floors, fillPatientnotification } = this.props
        const data = this.context.getForm(this.PAGE_NAME)

        let errors = []
        if (!validator.isUUID(data.PatientID)) {
            errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Patientrequired[Profile.Language] })
        }

        const reqbody = {
            PatientID: data.PatientID
        }

        if (validator.isUUID(data.BedID)) {

            const bed = (Beds.list || []).find(u => u.Uuid === data?.BedID)
            const room = (Rooms.list || []).find(u => u.Uuid === bed?.RoomID)
            const floor = (Floors.list || []).find(u => u.Uuid === room?.FloorID)
            reqbody.FloorID = floor?.Uuid
            reqbody.RoomID = room?.Uuid
            reqbody.BedID = bed?.Uuid
            const otherpatient = (Patients.list || []).find(u => u.BedID === bed?.Uuid && u.RoomID === room?.Uuid && u.FloorID === floor?.Uuid)
            const patient = (Patients.list || []).find(u => u.Uuid === data.PatientID)
            if (validator.isUUID(otherpatient?.Uuid)) {
                reqbody.OtherPatientID = otherpatient?.Uuid
                reqbody.OtherFloorID = patient?.FloorID
                reqbody.OtherRoomID = patient?.RoomID
                reqbody.OtherBedID = patient?.BedID
            }
        }
        if (errors.length > 0) {
            errors.forEach(error => {
                fillPatientnotification(error)
            })
        } else {
            Transferpatientplace({ data: reqbody, history, closeModal, redirectUrl: '/Placeviews' })
        }
    }
}
PlaceviewsTransfer.contextType = FormContext