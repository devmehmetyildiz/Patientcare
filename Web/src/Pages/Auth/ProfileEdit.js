import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Divider, Form, Header, Image } from 'semantic-ui-react'
import Notification from '../../Utils/Notification'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import img from '../../Assets/img'
import { ROUTES } from '../../Utils/Constants'

export default class ProfileEdit extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selectedimage: {},
            showImg: false,
            file: {},
            isDatafetched: false,
            imgChanged: false,
            fetchedFromapi: false
        }
    }

    componentDidMount() {
        const { GetUserMeta } = this.props
        GetUserMeta()
    }

    componentDidUpdate() {
        const { Profile, removenotification, Files, removeFilenotification } = this.props
        const { notifications, meta } = Profile
        if (meta && meta.id !== 0 && Object.keys(meta).length > 0 && !this.state.isDatafetched) {
            if (meta.files && Array.isArray(meta.files)) {
                let pp = meta.files.find(u => u.usagetype === "PP")
                this.setState({ file: pp ? pp : {}, isDatafetched: true, fetchedFromapi: true, showImg: true }, () => {
                    console.log('file: ', this.state);

                })
            }
        }
        Notification(notifications, removenotification)
        Notification(Files.notifications, removeFilenotification)
    }

    render() {

        const { Profile } = this.props
        const { meta, username, isLogging, isDispatching } = Profile

        return (
            isLogging || isDispatching ? < LoadingPage /> :
                <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
                    <div className='w-full mx-auto align-middle'>
                        <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
                            <Breadcrumb size='big'>
                                <Link to={"/Home"}>
                                    <Breadcrumb.Section>Profil</Breadcrumb.Section>
                                </Link>
                                <Breadcrumb.Divider icon='right chevron' />
                                <Breadcrumb.Section>{username}</Breadcrumb.Section>
                                <Breadcrumb.Divider icon='right chevron' />
                                <Breadcrumb.Section>Düzenle</Breadcrumb.Section>
                            </Breadcrumb>
                        </Header>
                    </div>
                    <Divider className='w-full  h-[1px]' />
                    <div className='w-full bg-white p-4 rounded-lg shadow-md outline outline-[1px] outline-gray-200 '>
                        <Form className='' onSubmit={this.handleSubmit}>
                            <Form.Group widths={'equal'}>
                                <Form.Field className='flex flex-col justify-between items-center h-[100%]  relative'>
                                    {this.state.showImg && <Button onClick={(e) => { this.deleteImage(e) }} color='red' className='cursor-pointer absolute right-5 z-50 top-5 rounded-full' size='large' icon='close' />}
                                    <Image className='mb-4' src={this.state.showImg ?
                                        this.state.fetchedFromapi ? `${process.env.REACT_APP_BACKEND_URL}/${ROUTES.FILE}/GetImage?guid=${Profile?.meta?.concurrencyStamp}` : URL.createObjectURL(this.state.selectedimage)
                                        : img.avatar} circular size='medium' />
                                    {!this.state.showImg && <Form.Input type='file' onChange={this.imageChange} ></Form.Input>}
                                </Form.Field>
                                <Form.Field >
                                    <Form.Group widths={'equal'}>
                                        <Form.Input label="İsim" placeholder="İsim" name="name" fluid defaultValue={meta.name} />
                                        <Form.Input label="Soyisim" placeholder="Soyisim" name="surname" fluid defaultValue={meta.surname} />
                                    </Form.Group>
                                    <Form.Group widths={'equal'}>
                                        <Form.Input label="Kayıtlı Şehir" placeholder="Kayıtlı Şehir" name="city" fluid defaultValue={meta.city} />
                                        <Form.Input label="Kayıtlı İlçe" placeholder="Kayıtlı İlçe" name="town" fluid defaultValue={meta.town} />
                                    </Form.Group>
                                    <Form.Group widths={'equal'}>
                                        <Form.Input label="Adres" placeholder="Adres" name="address" fluid defaultValue={meta.address} />
                                    </Form.Group>
                                </Form.Field>
                            </Form.Group>
                            <div className='flex flex-row w-full justify-between py-4  items-center'>
                                <Link to="/Users">
                                    <Button floated="left" color='grey'>Geri Dön</Button>
                                </Link>
                                <Button floated="right" type='submit' color='blue'>Güncelle</Button>
                            </div>
                        </Form>
                    </div>
                </div >
        )
    }
    handleSubmit = (e) => {
        e.preventDefault()
        const { EditUsers, history, fillnotification, Profile } = this.props
        const data = formToObject(e.target)
        let errors = []
        if (!data.name || data.name === '') {
            errors.push({ type: 'Error', code: 'Kullanıcılar', description: 'İsim boş olamaz' })
        }
        if (!data.surname || data.surname === '') {
            errors.push({ type: 'Error', code: 'Kullanıcılar', description: 'Soy isim boş olamaz' })
        }
        if (errors.length > 0) {
            errors.forEach(error => {
                fillnotification(error)
            })
        } else {
            this.handleFile()
            EditUsers({ ...Profile.meta, ...data }, history, "/Home")
        }
    }

    deleteImage = (e) => {
        e.preventDefault()
        this.setState({ selectedimage: {}, showImg: false, imgChanged: true, fetchedFromapi: false });
    }

    imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            this.setState({ selectedimage: e.target.files[0], showImg: true, imgChanged: true, fetchedFromapi: false });
        }
    }

    handleFile = () => {
        console.log("geldim")
        const { EditFiles,  Profile } = this.props
        const { imgChanged, selectedimage, file } = this.state
        console.log('this.state: ', this.state);

        if (imgChanged) {
            if (!selectedimage && Object.keys(file).length > 0) {
                alert("silicem")
                let filecontent = { ...file }
                filecontent.willDelete = true
                delete filecontent.updateTime
                delete filecontent.deleteTime
                let files = [{
                    ...filecontent, file: selectedimage
                }]
                const formData = new FormData();
                files.forEach((data, index) => {
                    Object.keys(data).forEach(element => {
                        formData.append(`list[${index}].${element}`, data[element])
                    });
                })
                EditFiles(formData)
            }
            if (selectedimage && Object.keys(file).length > 0) {

                let filecontent = { ...file }
                delete filecontent.updateTime
                delete filecontent.deleteTime
                let files = [{
                    ...filecontent, file: selectedimage
                }]
                const formData = new FormData();
                files.forEach((data, index) => {
                    Object.keys(data).forEach(element => {
                        formData.append(`list[${index}].${element}`, data[element])
                    });
                })
                EditFiles(formData)

            }
            if (selectedimage && Object.keys(file).length === 0) {
                let files = [{
                    id: 0,
                    name: 'PP',
                    parentid: Profile.meta.concurrencyStamp,
                    filename: 'PP',
                    filefolder: '',
                    filepath: '',
                    filetype: '',
                    usagetype: 'PP',
                    canteditfile: false,
                    file: selectedimage,
                    concurrencyStamp: '',
                    createdUser: '',
                    updatedUser: '',
                    deleteUser: '',
                    willDelete: false,
                    fileChanged: true,
                    isActive: true,
                    order: Profile.meta.files.length,
                }]

                const formData = new FormData();
                files.forEach((data, index) => {
                    Object.keys(data).forEach(element => {
                        formData.append(`list[${index}].${element}`, data[element])
                    });
                })

                EditFiles(formData)

            }
        }
    }

}
