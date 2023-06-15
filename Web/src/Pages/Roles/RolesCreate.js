import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Checkbox, Divider, Form } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import Notification from '../../Utils/Notification'
import LoadingPage from '../../Utils/LoadingPage'

export class RolesCreate extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selectedPrivileges:[]
        }
    }


    componentDidMount() {
        const { GetPrivileges, GetPrivilegegroups } = this.props
        GetPrivileges()
        GetPrivilegegroups()
    }

    componentDidUpdate() {
        const { Roles, removeRolenotification } = this.props
        Notification(Roles.notifications, removeRolenotification)
      }
    

    render() {
        const { Roles } = this.props
        const {  privileges, privilegegroups, isLoading, isDispatching } = Roles

        return (
            isLoading || isDispatching ? <LoadingPage /> :
                <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
                    <div className='w-full mx-auto align-middle'>
                        <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
                            <Breadcrumb size='big'>
                                <Link to={"/Roles"}>
                                    <Breadcrumb.Section >Roller</Breadcrumb.Section>
                                </Link>
                                <Breadcrumb.Divider icon='right chevron' />
                                <Breadcrumb.Section>Oluştur</Breadcrumb.Section>
                            </Breadcrumb>
                        </Header>
                    </div>
                    <Divider className='w-full  h-[1px]' />
                    <div className='w-full bg-white p-4 rounded-lg shadow-md outline outline-[1px] outline-gray-200 '>
                        <Form className='' onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <label className='text-[#000000de]'>Rol Adı</label>
                                <Form.Input placeholder="Rol Adı" name="Name" fluid />
                            </Form.Field>
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
                                                    checked={this.state.selectedPrivileges.find(u => u.code === privilege.code) ? true : false}
                                                    onClick={(e) => { this.handleClickprivilege(e) }}
                                                    id={privilege.code}
                                                    key={index}
                                                    label={privilege.text} />
                                            })}
                                        </div>
                                    </div>
                                })}
                            </div>
                            <div className='flex flex-row w-full justify-between py-4  items-center'>
                                <Link to="/Roles">
                                    <Button floated="left" color='grey'>Geri Dön</Button>
                                </Link>
                                <Button floated="right" type='submit' color='blue'>Oluştur</Button>
                            </div>
                        </Form>
                    </div>

                </div>
        )
    }


    handleSubmit = (e) => {
        e.preventDefault()

        const { AddRoles, history, fillRolenotification } = this.props

        const data = formToObject(e.target)
        data.Privileges = this.state.selectedPrivileges.map(u => { return u.code })

        let errors = []
        if (!data.Name || data.Name === '') {
            errors.push({ type: 'Error', code: 'Roller', description: 'İsim Boş Olamaz' })
        }
        if (!this.state.selectedPrivileges || this.state.selectedPrivileges.length <= 0) {
            errors.push({ type: 'Error', code: 'Roller', description: 'Hiç Bir Yetki seçili değil' })
        }
        if (errors.length > 0) {
            errors.forEach(error => {
                fillRolenotification(error)
            })
        } else {
            AddRoles(data, history)
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
export default RolesCreate