import React, { useEffect, useState } from 'react'
import { Button, Confirm, Label, Modal } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import BedSelector from '../../Components/BedSelector'

export default function PatientsEditplaceModal(props) {
    const {
        isPatientspage,
        isPatientdetailpage,
        open,
        setOpen,
        record,
        setRecord,
        Patients,
        Patientdefines,
        Floors,
        Rooms,
        Beds,
        Profile,
        Editpatientplace,
        fillPatientnotification,
        GetPatient,
        GetPatients,
        GetPatientdefines,
        GetFloors,
        GetRooms,
        GetBeds,
        canTransfer
    } = props

    const t = Profile?.i18n?.t || null
    const [selectedbed, setSelectedbed] = useState(null)
    const [showconfirm, setShowconfirm] = useState(false)

    useEffect(() => {
        if (open) {
            GetPatientdefines()
            GetFloors()
            GetRooms()
            GetBeds()
            if (isPatientdetailpage) {
                GetPatients()
            }
            setSelectedbed(null)
            setShowconfirm(false)
        }
    }, [open])

    const patient = record
    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)

    const activeBed = (Beds.list || []).find(u => u.Uuid === patient?.BedID)
    const activeRoom = (Rooms.list || []).find(u => u.Uuid === patient?.RoomID)
    const activeFloor = (Floors.list || []).find(u => u.Uuid === patient?.FloorID)

    const newBed = (Beds.list || []).find(u => u.Uuid === selectedbed)
    const newRoom = (Rooms.list || []).find(u => u.Uuid === newBed?.RoomID)
    const newFloor = (Floors.list || []).find(u => u.Uuid === newRoom?.FloorID)

    return open
        ? <React.Fragment>
            <Modal
                onClose={() => {
                    setOpen(false)
                    setRecord(null)
                }}
                onOpen={() => {
                    setOpen(true)
                }}
                open={open}
            >
                <Modal.Header>{`${t('Pages.Patients.PatientsEditplaceModal.Page.Header')} - ${patientdefine?.Firstname} ${patientdefine?.Lastname} (${patientdefine?.CountryID})`}</Modal.Header>
                <Modal.Header>
                    <div className='w-full flex justify-between items-start'>
                        <div className='flex flex-col justify-start items-start gap-4'>
                            <Label className='!bg-[#2355a0] !text-white' size='large'>
                                {t('Pages.Patients.PatientsEditplaceModal.Label.Oldplace')}
                                <Label.Detail>
                                    {`${activeBed?.Name || t('Common.NoDataFound')} ${activeRoom?.Name || t('Common.NoDataFound')} ${activeFloor?.Name || t('Common.NoDataFound')}`}
                                </Label.Detail>
                            </Label>
                            <Label className='!bg-[#2355a0] !text-white' size='large'>
                                {t('Pages.Patients.PatientsEditplaceModal.Label.Newplace')}
                                {validator.isUUID(selectedbed)
                                    ? <Label.Detail>
                                        {`${newBed?.Name || t('Common.NoDataFound')} ${newRoom?.Name || t('Common.NoDataFound')} ${newFloor?.Name || t('Common.NoDataFound')}`}
                                    </Label.Detail>
                                    : null}
                            </Label>
                        </div>
                        <BedSelector
                            Beds={Beds}
                            Floors={Floors}
                            Profile={Profile}
                            Rooms={Rooms}
                            selectedBed={selectedbed}
                            setSelectedBed={setSelectedbed}
                            fillNotification={fillPatientnotification}
                            Patients={Patients}
                            Patientdefines={Patientdefines}
                            canTransfer={canTransfer}
                        />
                    </div>
                </Modal.Header>
                <Modal.Actions>
                    <Button color='black' onClick={() => {
                        setOpen(false)
                        setRecord(null)
                    }}>
                        {t('Common.Button.Goback')}
                    </Button>
                    <Button
                        content={t('Common.Button.Update')}
                        labelPosition='right'
                        className='!bg-[#2355a0] !text-white'
                        icon='checkmark'
                        onClick={() => {
                            let errors = []
                            if (!validator.isUUID(newBed?.Uuid)) {
                                errors.push({ type: 'Error', code: t('Pages.Patients.PatientsEditplaceModal.Page.Header'), description: t('Pages.Patients.PatientsEditplaceModal.Messages.BedRequired') })
                            }
                            if (errors.length > 0) {
                                setShowconfirm(true)
                            } else {
                                if (!validator.isUUID(newRoom?.Uuid)) {
                                    errors.push({ type: 'Error', code: t('Pages.Patients.PatientsEditplaceModal.Page.Header'), description: t('Pages.Patients.PatientsEditplaceModal.Messages.RoomRequired') })
                                }
                                if (!validator.isUUID(newFloor?.Uuid)) {
                                    errors.push({ type: 'Error', code: t('Pages.Patients.PatientsEditplaceModal.Page.Header'), description: t('Pages.Patients.PatientsEditplaceModal.Messages.FloorRequired') })
                                }
                                if (errors.length > 0) {
                                    errors.forEach(error => {
                                        fillPatientnotification(error)
                                    })
                                } else {
                                    let body = {
                                        data: {
                                            PatientID: patient?.Uuid,
                                            FloorID: newFloor?.Uuid,
                                            RoomID: newRoom?.Uuid,
                                            BedID: newBed?.Uuid
                                        },
                                        onSuccess: () => {
                                            if (isPatientspage) {
                                                GetPatients()
                                            }
                                            if (isPatientdetailpage) {
                                                GetPatient(patient?.Uuid)
                                            }
                                            setOpen(false)
                                            setRecord(null)
                                        }
                                    }

                                    Editpatientplace(body)
                                }

                            }
                        }}
                        positive
                    />
                </Modal.Actions>
            </Modal>
            <Confirm
                cancelButton={t('Common.Button.Giveup')}
                confirmButton={t('Common.Button.Update')}
                content={`${t('Pages.Patients.PatientsEditplaceModal.Messages.Emptywarning')}`}
                open={showconfirm}
                onCancel={() => { setShowconfirm(false) }}
                onConfirm={() => {
                    let body = {
                        data: {
                            PatientID: patient?.Uuid,
                            FloorID: newFloor?.Uuid,
                            RoomID: newRoom?.Uuid,
                            BedID: newBed?.Uuid,
                            Willempty: true
                        },
                        onSuccess: () => {
                            if (isPatientspage) {
                                GetPatients()
                            }
                            if (isPatientdetailpage) {
                                GetPatient(patient?.Uuid)
                            }
                            setOpen(false)
                            setRecord(null)
                        }
                    }

                    Editpatientplace(body)
                }}
            />
        </React.Fragment>
        : null
}
