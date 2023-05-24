import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Checkbox, Divider, Form } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import Popup from '../../Utils/Popup'
import LoadingPage from '../../Utils/LoadingPage'

export class RolesCreate extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selectedauths:[]
        }
    }


    componentDidMount() {
        const { GetAuthories, GetAuthorygroups } = this.props
        GetAuthories()
        GetAuthorygroups()
    }

    render() {
        const { Roles, removeRolenotification } = this.props
        const { notifications, authories, authorygroups, isLoading, isDispatching } = Roles

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
                                <Form.Input placeholder="Rol Adı" name="name" fluid />
                            </Form.Field>
                            <div className='mb-4 outline outline-[1px] rounded-md outline-gray-200 p-4 overflow-y-auto max-h-[calc(100vh-26.2rem)]'>
                                {authorygroups.map(authorygroup => {
                                    return <div key={authorygroup} className="mb-8">
                                        <div className='flex flex-row justify-start items-center'>
                                            <label className='text-[#000000de] font-bold'>{authorygroup}</label>
                                            <Checkbox toggle className='ml-4'
                                                onClick={(e) => { this.handleAddgroup(e) }}
                                                id={authorygroup}
                                            />
                                        </div>
                                        <Divider className='w-full  h-[1px]' />
                                        <div className='grid grid-cols-3 gap-2'>
                                            {authories.filter(u => u.group === authorygroup).map((authory, index) => {
                                                return <Checkbox toggle className='m-2'
                                                    checked={this.state.selectedauths.find(u => u.concurrencyStamp === authory.concurrencyStamp) ? true : false}
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
        data.authories = this.state.selectedauths
        data.authoriestxt = null
        data.id = 0
        data.concurrencyStamp = null
        data.createdUser = null
        data.updatedUser = null
        data.deleteUser = null
        data.createTime = null
        data.updateTime = null
        data.deleteTime = null
        data.isActive = true

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
            AddRoles(data, history)
        }
    }

    handleAddgroup = (e) => {
        e.target.checked
            ? this.setState({ selectedauths: this.state.selectedauths.filter(function (el) { return el.group !== e.target.id; }).concat(this.props.Roles.authories.filter(u => u.group === e.target.id) || []) })
            : this.setState({ selectedauths: this.state.selectedauths.filter(function (el) { return el.group !== e.target.id; }) })
    }

    handleClickauthory = (e) => {
        e.target.checked
            ? this.setState({ selectedauths: [...this.state.selectedauths, this.props.Roles.authories.find(u => u.name === e.target.id)] })
            : this.setState({ selectedauths: this.state.selectedauths.filter(function (el) { return el.name !== e.target.id; }) })
    }
}
export default RolesCreate