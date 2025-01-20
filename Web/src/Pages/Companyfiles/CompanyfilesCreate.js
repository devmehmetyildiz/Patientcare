import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button } from 'semantic-ui-react'
import {
    Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump,
    Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'
import Fileupload, { FileuploadPrepare } from '../../Components/Fileupload'

export default function CompanyfilesCreate(props) {

    const { GetUsagetypes, EditFiles, Usagetypes, Files, } = props
    const { history, fillFilenotification, Profile, closeModal } = props

    const t = Profile?.i18n?.t

    const [selectedFiles, setSelectedFiles] = useState([])

    const setselectedFiles = (files) => {
        setSelectedFiles([...files])
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const reqFiles = FileuploadPrepare(selectedFiles.map(u => ({ ...u, ParentID: 'OrganizationArchive' })), fillFilenotification, null, Profile)
        EditFiles({ data: reqFiles, history, url: "/Companyfiles" })
    }

    const isLoadingstatus =
        Usagetypes.isLoading ||
        Files.isLoading

    useEffect(() => {
        GetUsagetypes()
    }, [])

    return (
        isLoadingstatus ? <LoadingPage /> :
            <Pagewrapper>
                <Headerwrapper>
                    <Headerbredcrump>
                        <Link to={"/Companyfiles"}>
                            <Breadcrumb.Section >{t('Pages.Companyfiles.Page.Header')}</Breadcrumb.Section>
                        </Link>
                        <Breadcrumb.Divider icon='right chevron' />
                        <Breadcrumb.Section>{t('Pages.Companyfiles.Page.CreateHeader')}</Breadcrumb.Section>
                    </Headerbredcrump>
                    {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
                </Headerwrapper>
                <Pagedivider />
                <Contentwrapper>
                    <Fileupload
                        fillnotification={fillFilenotification}
                        Usagetypes={Usagetypes}
                        selectedFiles={selectedFiles}
                        setselectedFiles={setselectedFiles}
                        Profile={Profile}
                    />
                </Contentwrapper>
                <Footerwrapper>
                    <Gobackbutton
                        history={history}
                        redirectUrl={"/Companyfiles"}
                        buttonText={t('Common.Button.Goback')}
                    />
                    <Submitbutton
                        isLoading={Files.isLoading}
                        buttonText={t('Common.Button.Create')}
                        submitFunction={handleSubmit}
                    />
                </Footerwrapper>
            </Pagewrapper >
    )
}