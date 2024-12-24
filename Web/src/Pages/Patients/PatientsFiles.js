import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Header, Icon } from 'semantic-ui-react'
import { Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Profilephoto, Submitbutton } from '../../Components'
import Fileupload, { FileuploadPrepare } from '../../Components/Fileupload'

export default function PatientsFiles(props) {
    const { GetPatient, match, Patientdefines, history, Usagetypes, GetFiles, GetPatientdefines, PatientID, GetUsagetypes, fillFilenotification,
        Files, Patients, EditFiles, Profile, } = props

    const t = Profile?.i18n?.t
    const [patient, setPatient] = useState({})
    const [isDatafetched, setisDatafetched] = useState(false)
    const [selectedFiles, setselectedFiles] = useState([])

    useEffect(() => {
        const Id = match?.params?.PatientID || PatientID
        if (Id) {
            GetPatient(Id)
            GetFiles()
            GetPatientdefines()
            GetUsagetypes()
        } else {
            history.length > 1 ? history.goBack() : history.push(Id ? `/Patients/${Id}` : `/Patients`)
        }
    }, [])

    useEffect(() => {
        const { selected_record, isLoading } = Patients
        if (selected_record && !Patientdefines.isLoading && !Usagetypes.isLoading && !Files.isLoading && Object.keys(selected_record).length > 0 &&
            selected_record.Id !== 0 && !isLoading && !isDatafetched) {
            var response = (Files.list || []).filter(u => u.Isactive && u.ParentID === selected_record?.Uuid).map(element => {
                return {
                    ...element,
                    key: Math.random(),
                    Usagetype: (element.Usagetype.split(',') || []).map(u => {
                        return u
                    })
                }
            });
            setselectedFiles([...response] || [])
            setisDatafetched(true)
            setPatient(selected_record)
        }
    })


    const handleSubmit = (e) => {
        e.preventDefault()

        const Id = match?.params?.PatientID || PatientID
        const reqFiles = FileuploadPrepare(selectedFiles.map(u => ({ ...u, ParentID: Id })), fillFilenotification, null, Profile)

        EditFiles({ data: reqFiles, history, url: Id ? `/Patients/${Id}` : "/Patients" })
    }

    const { isLoading } = Patients
    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
    const usagetypePP = (Usagetypes.list || []).find(u => u.Value === 'PP')?.Uuid || null
    const file = (Files.list || []).find(u => u.ParentID === patient?.Uuid && (((u.Usagetype || '').split(',')) || []).includes(usagetypePP) && u.Isactive)
    const Id = match?.params?.PatientID || PatientID


    return (
        Files.isLoading || isLoading ? <LoadingPage /> :
            <Pagewrapper>
                <Headerwrapper>
                    <Headerbredcrump>
                        <Link to={"/Patients"}>
                            <Breadcrumb.Section>{t('Pages.Patients.Page.Header')}</Breadcrumb.Section>
                        </Link>
                        <Breadcrumb.Divider icon='right chevron' />
                        <Link to={"/Patients/" + Id}>
                            <Breadcrumb.Section>{`${patientdefine?.Firstname} ${patientdefine?.Lastname}`}</Breadcrumb.Section>
                        </Link>
                        <Breadcrumb.Divider icon='right chevron' />
                        <Breadcrumb.Section>{t('Pages.Patients.PatientFiles.Page.Header')}</Breadcrumb.Section>
                    </Headerbredcrump>
                </Headerwrapper>
                <Pagedivider />
                <Contentwrapper>
                    <Header as='h2' icon textAlign='center'>
                        {file
                            ? <Profilephoto
                                fileID={file?.Uuid}
                                fillnotification={fillFilenotification}
                                Profile={Profile}
                            />
                            : <Icon name='users' circular />}
                        <Header.Content>{`${patientdefine?.Firstname} ${patientdefine?.Lastname} - ${patientdefine?.CountryID}`}</Header.Content>
                    </Header>
                </Contentwrapper>
                <Fileupload
                    fillnotification={fillFilenotification}
                    Usagetypes={Usagetypes}
                    selectedFiles={selectedFiles}
                    setselectedFiles={setselectedFiles}
                    Profile={Profile}
                />
                <Footerwrapper>
                    <Gobackbutton
                        history={history}
                        redirectUrl={"/Patients"}
                        buttonText={t('Common.Button.Goback')}
                    />
                    <Submitbutton
                        isLoading={isLoading}
                        buttonText={t('Common.Button.Update')}
                        submitFunction={handleSubmit}
                    />
                </Footerwrapper>
            </Pagewrapper >
    )
}