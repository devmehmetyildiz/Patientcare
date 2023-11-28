import React, { Component } from 'react'
import { Link, } from 'react-router-dom'
import { Form } from 'semantic-ui-react'
import { Breadcrumb } from 'semantic-ui-react'
import LoadingPage from '../../Utils/LoadingPage'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import FormInput from '../../Utils/FormInput'
import Navbar from '../../Common/Navbar'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import { Footerwrapper } from '../../Common/Wrappers/Footerwrapper'
import Gobackbutton from '../../Common/Gobackbutton'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import { Pagewrapper } from '../../Common/Wrappers/Pagewrapper'
import Submitbutton from '../../Common/Submitbutton'
import { FormContext } from '../../Provider/FormProvider'

export default class PasswordReset extends Component {

    PAGE_NAME = "PasswordReset"

    componentDidMount() {
        const { match, history, GetPasswordresetuser, RequestID, fillnotification, Profile } = this.props

        let Id = RequestID || match?.params?.RequestID
        if (validator.isUUID(Id)) {
            GetPasswordresetuser(Id)
        } else {
            fillnotification({ type: 'Error', code: Literals.Page.Pageheaderreset[Profile.Language], description: Literals.Messages.RequestIDrequired[Profile.Language] })
            history && history.push("/Login")
        }
    }

    render() {

        const { Profile } = this.props
        const { isLoading, isDispatching, history } = Profile

        return (
            isLoading || isDispatching ? <LoadingPage /> :
                <div className='bg-white dark:bg-Contentbg ' >
                    <Navbar Profile={Profile} withoutControl={true} />
                    <div className='flex flex-row justify-start items-start '>
                        <div className={`mt-[58.61px] p-4 w-full min-w-[0px] contentWrapper`}>
                            <Pagewrapper>
                                <Headerwrapper>
                                    <Headerbredcrump >
                                        <Link to={"/Login"}>
                                            <Breadcrumb.Section>{Literals.Page.Pageheaderreset[Profile.Language]}</Breadcrumb.Section>
                                        </Link>
                                        <Breadcrumb.Divider icon='right chevron' />
                                        <Breadcrumb.Section>{Profile?.resetrequestuser?.Username}</Breadcrumb.Section>
                                    </Headerbredcrump >
                                </Headerwrapper>
                                <Pagedivider />
                                <Contentwrapper>
                                    <Form onSubmit={this.handleSubmit}>
                                        <Form.Group widths={"equal"}>
                                            <FormInput page={this.PAGE_NAME} type='password' placeholder={Literals.Columns.Newpassword[Profile.Language]} name="Newpassword" />
                                            <FormInput page={this.PAGE_NAME} type='password' placeholder={Literals.Columns.Newpasswordre[Profile.Language]} name="Newpasswordre" />
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
                                        isLoading={isLoading}
                                        buttonText={Literals.Button.Create[Profile.Language]}
                                        submitFunction={this.handleSubmit}
                                    />
                                </Footerwrapper>
                            </Pagewrapper>
                        </div>
                    </div>
                </div >


        )
    }

    handleSubmit = (e) => {
        e.preventDefault()

        const { history, fillnotification, Profile, Resetpassword, match, RequestID } = this.props
        let Id = RequestID || match?.params?.RequestID

        const data = this.context.getForm(this.PAGE_NAME)

        let errors = []
        if (!validator.isString(data.Newpassword)) {
            errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Newpasswordrequired[Profile.Language] })
        }
        if (!validator.isString(data.Newpasswordre)) {
            errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Newpasswordrerequired[Profile.Language] })
        }
        if (data.Newpassword && data.Newpasswordre) {
            if (data.Newpassword !== data.Newpasswordre) {
                errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Passworddidntmatch[Profile.Language] })
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
}
PasswordReset.contextType = FormContext