import { Icon, Loader } from "semantic-ui-react"

const roomCellhandler = ({ value, props }) => {
    const { Rooms, Floors } = props
    if (Rooms.isLoading) {
        return <Loader size='small' active inline='centered' ></Loader>
    } else {
        const room = (Rooms.list || []).find(u => u.Uuid === value)
        const floor = (Floors.list || []).find(u => u.Uuid === room?.FloorID)
        return `${room?.Name} (${floor?.Name})`
    }
}

const bedPatientCellhandler = ({ value, bedID, props }) => {
    const { Patients, Patientdefines, Beds } = props
    if (Patients.isLoading || Patientdefines.isLoading) {
        return <Loader size='small' active inline='centered' ></Loader>
    } else {
        const bed = (Beds.list || []).find(u => u.Uuid === bedID)
        const patient = (Patients.list || []).find(u => u.Uuid === value)
        const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
        return patientdefine
            ? <div
                className='group cursor-pointer flex flex-row flex-nowrap'
            >
                {`${patientdefine?.Firstname} ${patientdefine?.Lastname} (${patientdefine?.CountryID})`}
                <div
                    onClick={() => {
                        this.setState({
                            bedID: bedID,
                            openConfirm: true
                        })
                    }}
                    className='opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-500'>
                    <Icon color='red' name='delete' />
                </div>
            </div>
            : bed
                ? bed?.Isoccupied ? <div
                    onClick={() => {
                        this.setState({
                            bedID: bedID,
                            openConfirm: true
                        })
                    }}
                    className='cursor-pointer'
                >
                    <Icon color='red' name='delete' />
                </div>
                    : null
                : null
    }
}

const boolCellhandler = ({ value, props }) => {
    const { Profile } = props
    const t = Profile?.i18n?.t
    return value !== null && (value ? t('Pages.Beds.Label.Filled') : t('Pages.Beds.Label.Empty'))
}

export { roomCellhandler, bedPatientCellhandler, boolCellhandler }