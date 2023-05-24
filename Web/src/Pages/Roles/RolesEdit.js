import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Checkbox, Divider, Form, Header } from 'semantic-ui-react'
import Popup from '../../Utils/Popup'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'

export class RolesEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedauths: [],
            isDatafetched: false
        }
    }

    componentDidMount() {
        const { GetRole, GetAuthories, GetAuthorygroups, match, history } = this.props
        if (match.params.RoleID) {
            GetRole(match.params.RoleID)
            GetAuthories()
            GetAuthorygroups()
        } else {
            history.push("/Roles")
        }
    }

    componentDidUpdate() {
        const { Roles } = this.props
        const { authories, selected_record, authorygroups, isLoading } = Roles
        if (selected_record && Object.keys(selected_record).length > 0 && selected_record.id !== 0 && authories.length > 0 && authorygroups.length > 0 && !isLoading && !this.state.isDatafetched) {
            this.setState({ selectedauths: selected_record.authories, isDatafetched: true })
        }
    }

    render() {

        const { Roles, removeRolenotification } = this.props
        const { notifications, authories, selected_record, authorygroups, isLoading, isDispatching } = Roles
        if (notifications && notifications.length > 0) {
            let msg = notifications[0]
            Popup(msg.type, msg.code, msg.description)
            removeRolenotification()
        }

        return (
            isLoading || isDispatching ? <LoadingPage /> :
                <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
                    <div className='w-full mx-auto align-middle'>
                        <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
                            <Breadcrumb size='big'>
                                <Link to={"/Roles"}>
                                    <Breadcrumb.Section>Roller</Breadcrumb.Section>
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
                                <Form.Input placeholder="Rol Adı" name="name" fluid defaultValue={selected_record.name} />
                            </Form.Field>
                            <div className='mb-4 outline outline-[1px] rounded-md outline-gray-200 p-4 overflow-y-auto max-h-[calc(100vh-26.2rem)]'>
                                {authorygroups.map(authorygroup => {
                                    return <div key={authorygroup} className="mb-8">
                                        <div className='flex flex-row justify-start items-center'>
                                            <label className='text-[#000000de] font-bold'>{authorygroup}</label>
                                            <Checkbox toggle className='ml-4'
                                                onClick={(e) => { this.handleAddgroup(e) }}
                                                id={authorygroup}
                                                checked={this.Checkauthorygroup(authorygroup) ? true : false}
                                            />
                                        </div>
                                        <Divider className='w-full  h-[1px]' />
                                        <div className='grid grid-cols-3 gap-2'>
                                            {authories.filter(u => u.group === authorygroup).map((authory, index) => {
                                                return <Checkbox toggle className='m-2'
                                                    checked={(this.state.selectedauths.length > 0 ? this.state.selectedauths : []).find(u => u.concurrencyStamp === authory.concurrencyStamp) ? true : false}
                                                    onClick={(e) => { this.handleClickauthory(e) }}
                                                    id={authory.name}
                                                    key={index}
                                                    label={authory.name} />
                                            })}
                                        </div>
                                    </div>
                                })}
                            </div>
                            <div className='flex flex-row w-full justify-between py-4  items-center'>
                                <Link to="/Roles">
                                    <Button floated="left" color='grey'>Geri Dön</Button>
                                </Link>
                                <Button floated="right" type='submit' color='blue'>Güncelle</Button>
                            </div>
                        </Form>
                    </div>
                </div>
        )
    }


    Checkauthorygroup = (group) => {
        const isComplated = false
        const selectedlist = (this.state.selectedauths || []).filter(u => u.group === group)
        const list = (this.props.Roles.authories || []).filter(u => u.group === group)
        if (list.length === selectedlist.length) {
            return true
        } else {
            return false
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()

        const { EditRoles, history, fillRolenotification, Roles } = this.props
        const data = formToObject(e.target)
        let errors = []
        if (!data.name || data.name === '') {
            errors.push({ type: 'Error', code: 'Roller', description: 'İsim Boş Olamaz' })
        }
        if (!this.state.selectedauths || this.state.selectedauths.length <= 0) {
            errors.push({ type: 'Error', code: 'Roller', description: 'Hiç Bir Yetki seçili değil' })
        }
        if (errors.length > 0) {
            errors.forEach(error => {
                fillRolenotification(error)
            })
        } else {
            EditRoles({ ...Roles.selected_record, ...data }, history)
        }

    }

    handleAddgroup = (e) => {
        e.target.checked
            ? this.setState({ selectedauths: this.state.selectedauths.filter(function (el) { return el.group !== e.target.id; }).concat(this.props.Roles.authories.filter(u => u.group === e.target.id) || []) })
            : this.setState({ selectedauths: this.state.selectedauths.filter(function (el) { return el.group !== e.target.id; }) })
    }

    handleClickauthory = (e) => {
        e.target.checked
            ? this.setState({ selectedauths: [...this.state.selectedauths, (this.props.Roles.authories.length > 0 ? this.props.Roles.authories : []).find(u => u.name === e.target.id)] })
            : this.setState({ selectedauths: this.state.selectedauths.filter(function (el) { return el.name !== e.target.id; }) })
    }
}
export default RolesEdit
