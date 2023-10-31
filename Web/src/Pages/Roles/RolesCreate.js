import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Checkbox, Divider, Form, Search } from 'semantic-ui-react'
import { Breadcrumb, Button } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import Notification from '../../Utils/Notification'
import LoadingPage from '../../Utils/LoadingPage'
import Literals from './Literals'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import validator from '../../Utils/Validator'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import FormInput from '../../Utils/FormInput'
import { FormContext } from '../../Provider/FormProvider'
export default class RolesCreate extends Component {

    PAGE_NAME = 'RolesCreate'

    constructor(props) {
        super(props)
        this.state = {
            selectedPrivileges: [],
            searchParam: ''
        }
    }

    componentDidMount() {
        const { GetPrivileges, GetPrivilegegroups } = this.props
        GetPrivileges()
        GetPrivilegegroups()
    }

    componentDidUpdate() {
        const { Roles, removeRolenotification } = this.props
        Notification(Roles.notifications, removeRolenotification, this.context.clearForm)
    }


    render() {
        const { Roles, Profile, history } = this.props
        const { privileges, privilegegroups, isLoading, isDispatching } = Roles

        const decoratedgroups = privilegegroups.map(group => {
            const foundedPrivileges = privileges.filter(u => u.group.includes(group) && (u.text.toLowerCase()).includes(this.state.searchParam.toLowerCase()))
            return foundedPrivileges.length > 0 ? { name: group, privileges: foundedPrivileges } : null
        }).filter(u => u)

        return (
            isLoading || isDispatching ? <LoadingPage /> :
                <Pagewrapper>
                    <Headerwrapper>
                        <Headerbredcrump>
                            <Link to={"/Roles"}>
                                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                            </Link>
                            <Breadcrumb.Divider icon='right chevron' />
                            <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
                        </Headerbredcrump>
                    </Headerwrapper>
                    <Pagedivider />
                    <Contentwrapper>

                        <Form onSubmit={this.handleSubmit}>
                            <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
                            <div className='w-full py-2'>
                                <Search
                                    placeholder='Search...'
                                    onSearchChange={(e) => { this.setState({ searchParam: e.target.value }) }}
                                    showNoResults={false}
                                />
                            </div>
                            <div className='mb-4 outline outline-[1px] rounded-md outline-gray-200 p-4 overflow-y-auto max-h-[calc(100vh-30.2rem)]'>
                                {(decoratedgroups || []).map(privilegegroup => {
                                    return <div key={privilegegroup?.name} className="mb-8">
                                        <div className='flex flex-row justify-start items-center'>
                                            <label className='text-[#000000de] font-bold'>{privilegegroup?.name}</label>
                                            <Checkbox toggle className='ml-4'
                                                onClick={(e) => { this.handleAddgroup(e) }}
                                                id={privilegegroup?.name}
                                                checked={this.Checkprivilegesgroup(privilegegroup?.name) ? true : false}
                                            />
                                        </div>
                                        <Divider className='w-full  h-[1px]' />
                                        <div className='grid grid-cols-3 gap-2'>
                                            {(privilegegroup?.privileges || []).map((privilege, index) => {
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
                                    <Button floated="right" type="button" color='grey' onClick={(e) => { this.context.clearForm(this.PAGE_NAME) }}>{Literals.Button.Clear[Profile.Language]}</Button>
                                </Form.Group>
                                <Button floated="right" type='submit' color='blue'>{Literals.Button.Create[Profile.Language]}</Button>
                            </Footerwrapper>
                        </Form>
                    </Contentwrapper>
                </Pagewrapper >
        )
    }


    handleSubmit = (e) => {
        e.preventDefault()

        const { AddRoles, history, fillRolenotification, Profile, closeModal } = this.props

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
            AddRoles({ data, history, closeModal })
        }
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
RolesCreate.contextType = FormContext