import React, { Component } from 'react'
import { Link, } from 'react-router-dom'
import { Divider, Form } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import FormInput from '../../Utils/FormInput'
import Navbar from '../../Common/Navbar'

export default class PasswordReset extends Component {

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

    componentDidUpdate() {
        const { removenotification, Profile } = this.props
        Notification(Profile.notifications, removenotification)
    }

    render() {

        const { Profile } = this.props
        const { isLoading, isDispatching } = Profile

        return (
            isLoading || isDispatching ? <LoadingPage /> :
                <div className='bg-white dark:bg-Contentbg ' >
                    <Navbar Profile={Profile} withoutControl={true} />
                    <div className='flex flex-row justify-start items-start '>
                        <div className={`mt-[58.61px] p-4 w-full min-w-[0px] contentWrapper`}>
                            <div className='w-full '>
                                <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
                                    <div className='w-full mx-auto align-middle'>
                                        <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
                                            <Breadcrumb size='big'>
                                                <Link to={"/Login"}>
                                                    <Breadcrumb.Section>{Literals.Page.Pageheaderreset[Profile.Language]}</Breadcrumb.Section>
                                                </Link>
                                                <Breadcrumb.Divider icon='right chevron' />
                                                <Breadcrumb.Section>{Profile?.resetrequestuser?.Username}</Breadcrumb.Section>
                                                <Breadcrumb.Divider icon='right chevron' />
                                            </Breadcrumb>
                                        </Header>
                                    </div>
                                    <Divider className='w-full  h-[1px]' />
                                    <div className='w-full bg-white p-4 rounded-lg shadow-md outline outline-[1px] outline-gray-200 '>
                                        <Form onSubmit={this.handleSubmit}>
                                            <Form.Group widths={"equal"}>
                                                <FormInput page={this.PAGE_NAME} type='password' placeholder={Literals.Columns.Newpassword[Profile.Language]} name="Newpassword" />
                                                <FormInput page={this.PAGE_NAME} type='password' placeholder={Literals.Columns.Newpasswordre[Profile.Language]} name="Newpasswordre" />
                                            </Form.Group>
                                            <div className='flex flex-row w-full justify-between py-4  items-center'>
                                                <div onClick={(e) => {
                                                    e.preventDefault()
                                                    this.props.history.goBack()
                                                }}>
                                                    <Button floated="left" color='grey'>{Literals.Button.Goback[Profile.Language]}</Button>
                                                </div>
                                                <Button floated="right" type='submit' color='blue'>{Literals.Button.Update[Profile.Language]}</Button>
                                            </div>
                                        </Form>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>


        )
    }

    handleSubmit = (e) => {
        e.preventDefault()

        const { history, fillnotification, Profile, Resetpassword, match, RequestID } = this.props
        let Id = RequestID || match?.params?.RequestID
        const data = formToObject(e.target)

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
