import React, { useContext, useEffect, useState } from 'react'
import { Link, } from 'react-router-dom'
import { Breadcrumb, Form } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import {
    Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
    Headerwrapper, LoadingPage, Navbar, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'
import { PASSWORD_REGEX } from '../../Utils/Constants'


export default function PasswordReset(props) {
    const PAGE_NAME = "PasswordReset"
    const { GetPasswordresetuser, } = props
    const { fillnotification, Profile, Resetpassword, match, RequestID, history } = props

    const { isLoading, isLogging, } = Profile

    const Id = RequestID || match?.params?.RequestID
    const t = Profile?.i18n?.t

    const [passwordSame, setPasswordSame] = useState(false)
    const context = useContext(FormContext)

    const { getRecord, record } = context

    const handleSubmit = (e) => {
        e.preventDefault()

        const data = context.getForm(PAGE_NAME)

        let errors = []
        if (!validator.isString(data.Newpassword)) {
            errors.push({ type: 'Error', code: t('Pages.PasswordReset.Page.Header'), description: t('Pages.PasswordReset.Messages.NewpasswordReqired') })
        }
        if (!PASSWORD_REGEX.test(data.Newpassword)) {
            errors.push({ type: 'Error', code: t('Pages.PasswordReset.Page.Header'), description: t('Pages.PasswordReset.Messages.PasswordHint') })
        }
        if (!validator.isString(data.Newpasswordre)) {
            errors.push({ type: 'Error', code: t('Pages.PasswordReset.Page.Header'), description: t('Pages.PasswordReset.Messages.NewpasswordConfirmReqired') })
        }
        if (data.Newpassword && data.Newpasswordre) {
            if (data.Newpassword !== data.Newpasswordre) {
                errors.push({ type: 'Error', code: t('Pages.PasswordReset.Page.Header'), description: t('Pages.PasswordReset.Messages.NewPasswordsarenotsame') })
            }
        }

        if (errors.length > 0) {
            errors.forEach(error => {
                fillnotification(error)
            })
        } else {
            Resetpassword({
                data: {
                    Password: data.Newpassword,
                    RequestId: Id
                }, history
            })
        }
    }

    useEffect(() => {

        let Id = RequestID || match?.params?.RequestID
        if (validator.isUUID(Id)) {
            GetPasswordresetuser(Id)
        } else {
            fillnotification({ type: 'Error', code: t('Pages.PasswordReset.Page.Header'), description: t('Pages.PasswordReset.Messages.RequestIDRequired') })
            history && history.push("/Login")
        }
    }, [])

    useEffect(() => {
        const password = getRecord(PAGE_NAME, 'Newpassword')
        const passwordRe = getRecord(PAGE_NAME, 'Newpasswordre')
        setPasswordSame(password !== passwordRe)
    }, [record])

    return (
        isLogging ? <LoadingPage /> :
            <div className='bg-white dark:bg-Contentbg contentWrapper h-[100vh] overflow-y-auto md:overflow-y-hidden' >
                <Navbar Profile={Profile} withoutControl={true} onlyTitle />
                <div className={`mt-[55.61px] p-4 w-full min-w-[0px] contentWrapper h-[calc(100vh-25.4px-2rem)]`}>
                    <Headerwrapper>
                        <Headerbredcrump >
                            <Link to={"/Login"}>
                                <Breadcrumb.Section>{t('Pages.PasswordReset.Page.Header')}</Breadcrumb.Section>
                            </Link>
                            <Breadcrumb.Divider icon='right chevron' />
                            <Breadcrumb.Section>{Profile?.resetrequestuser?.Username}</Breadcrumb.Section>
                        </Headerbredcrump >
                    </Headerwrapper>
                    <Pagedivider />
                    <Contentwrapper>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group widths={"equal"}>
                                <FormInput page={PAGE_NAME} required placeholder={t('Pages.PasswordReset.Columns.Newpassword')} name="Newpassword" type='password' validationfunc={(e) => PASSWORD_REGEX.test(e)} validationmessage={t('Pages.Passwordchange.Messages.PasswordHint')} attention={t('Pages.Users.Messages.PasswordHint')} />
                                <FormInput page={PAGE_NAME} required placeholder={t('Pages.PasswordReset.Columns.NewpasswordRe')} name="Newpasswordre" type='password' nonValid={passwordSame} nonValidMessage={t('Pages.Passwordchange.Messages.PasswordSameHint')} />
                            </Form.Group>
                        </Form>
                    </Contentwrapper>
                    <Footerwrapper>
                        <Gobackbutton
                            history={history}
                            redirectUrl={"/Login"}
                            buttonText={t('Common.Button.Goback')}
                        />
                        <Submitbutton
                            isLoading={isLoading}
                            buttonText={t('Common.Button.Update')}
                            submitFunction={handleSubmit}
                        />
                    </Footerwrapper>
                </div>
            </div >


    )
}