import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Checkbox, Divider, Form } from 'semantic-ui-react'
import Notification from '../../Utils/Notification'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Literals from './Literals'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import FormInput from '../../Utils/FormInput'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
export default class RolesEdit extends Component {

    PAGE_NAME = 'RolesEdit'

    constructor(props) {
        super(props)
        this.state = {
            selectedPrivileges: [],
            isDatafetched: false
        }
    }

    componentDidMount() {
        const { GetRole, GetPrivileges, GetPrivilegegroups, match, history, RoleID } = this.props
        let Id = RoleID || match.params.RoleID
        if (validator.isUUID(Id)) {
            GetRole(Id)
            GetPrivileges()
            GetPrivilegegroups()
        } else {
            history && history.push("/Roles")
        }
    }

    componentDidUpdate() {
        const { Roles, removeRolenotification } = this.props
        const { privileges, selected_record, privilegegroups, isLoading } = Roles
        if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && privileges.length > 0 && privilegegroups.length > 0 && !isLoading && !this.state.isDatafetched) {
            this.setState({ selectedPrivileges: selected_record.Privileges, isDatafetched: true })
            this.context.setForm(this.PAGE_NAME, selected_record)
        }
        Notification(Roles.notifications, removeRolenotification, this.context.clearForm)
    }

    render() {

        const { Roles, Profile, history } = this.props
        const { privileges, privilegegroups, isLoading, isDispatching } = Roles

        return (
            isLoading || isDispatching ? <LoadingPage /> :
                <Pagewrapper>
                    <Headerwrapper>
                        <Headerbredcrump>
                            <Link to={"/Roles"}>
                                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                            </Link>
                            <Breadcrumb.Divider icon='right chevron' />
                            <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
                        </Headerbredcrump>
                    </Headerwrapper>
                    <Pagedivider />
                    <Contentwrapper>
                        <Form onSubmit={this.handleSubmit}>
                            <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
                            <div className='mb-4 outline outline-[1px] rounded-md outline-gray-200 p-4 overflow-y-auto max-h-[calc(100vh-26.2rem)]'>
                                {privilegegroups.map(privilegegroup => {
                                    return <div key={privilegegroup} className="mb-8">
                                        <div className='flex flex-row justify-start items-center'>
                                            <label className='text-[#000000de] font-bold'>{privilegegroup}</label>
                                            <Checkbox toggle className='ml-4'
                                                onClick={(e) => { this.handleAddgroup(e) }}
                                                id={privilegegroup}
                                                checked={this.Checkprivilegesgroup(privilegegroup) ? true : false}
                                            />
                                        </div>
                                        <Divider className='w-full  h-[1px]' />
                                        <div className='grid grid-cols-3 gap-2'>
                                            {privileges.filter(u => u.group.includes(privilegegroup)).map((privilege, index) => {
                                                return <Checkbox toggle className='m-2'
                                                    checked={(this.state.selectedPrivileges.length > 0 ? this.state.selectedPrivileges : []).find(u => u.code === privilege.code) ? true : false}
                                                    onClick={(e) => { this.handleClickprivilege(e) }}
                                                    id={privilege.code}
                                                    key={index}
                                                    label={privilege.text} />
                                            })}
                                        </div>
                                    </div>
                                })}
                            </div>
                            <Footerwrapper>
                                <Form.Group widths={'equal'}>
                                    {history && <Link to="/Roles">
                                        <Button floated="left" color='grey'>{Literals.Button.Goback[Profile.Language]}</Button>
                                    </Link>}
                                    <Button floated="right" type="button" color='grey' onClick={(e) => { this.context.setForm(this.PAGE_NAME, Roles.selected_record) }}>{Literals.Button.Clear[Profile.Language]}</Button>
                                </Form.Group>
                                <Button floated="right" type='submit' color='blue'>{Literals.Button.Update[Profile.Language]}</Button>
                            </Footerwrapper>
                        </Form>
                    </Contentwrapper>
                </Pagewrapper >
        )
    }


    Checkprivilegesgroup = (group) => {
        const selectedlist = (this.state.selectedPrivileges || []).filter(u => u.group.includes(group))
        const list = (this.props.Roles.privileges || []).filter(u => u.group.includes(group))
        if ((list.length === selectedlist.length) && list.length !== 0 && selectedlist.length !== 0) {
            return true
        } else {
            return false
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()

        const { EditRoles, history, fillRolenotification, Roles, Profile } = this.props
        const data = formToObject(e.target)
        data.Privileges = this.state.selectedPrivileges.map(u => { return u.code })
        let errors = []
        if (!validator.isString(data.Name)) {
            errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.NameRequired[Profile.Language] })
        }
        if (!validator.isArray(data.Privileges)) {
            errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.PrivilegesRequired[Profile.Language] })
        }
        if (errors.length > 0) {
            errors.forEach(error => {
                fillRolenotification(error)
            })
        } else {
            EditRoles({ data: { ...Roles.selected_record, ...data }, history })
        }

    }

    handleAddgroup = (e) => {
        e.target.checked
            ? this.setState({ selectedPrivileges: this.state.selectedPrivileges.filter(function (el) { return !el.group.includes(e.target.id) }).concat(this.props.Roles.privileges.filter(u => u.group.includes(e.target.id)) || []) })
            : this.setState({ selectedPrivileges: this.state.selectedPrivileges.filter(function (el) { return !el.group.includes(e.target.id) }) })
    }

    handleClickprivilege = (e) => {
        e.target.checked
            ? this.setState({ selectedPrivileges: [...this.state.selectedPrivileges, this.props.Roles.privileges.find(u => u.code === e.target.id)] })
            : this.setState({ selectedPrivileges: this.state.selectedPrivileges.filter(function (el) { return el.code !== e.target.id; }) })
    }
}
RolesEdit.contextType = FormContext