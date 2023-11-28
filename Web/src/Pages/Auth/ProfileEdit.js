import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Divider, Dropdown, Form, Header, Image } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import img from '../../Assets/img'
import { ROUTES } from '../../Utils/Constants'
import config from '../../Config'
import validator from '../../Utils/Validator'

export default class ProfileEdit extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selectedimage: {},
            showImg: false,
            file: {},
            isDatafetched: false,
            imgChanged: false,
            fetchedFromapi: false,
            selectedLanguage: '',
            userConfig: null
        }
    }

    componentDidMount() {
        const { Profile } = this.props
        const { meta } = Profile
        if (meta && meta.Id !== 0 && Object.keys(meta).length > 0) {
            this.setState({ selectedLanguage: meta.Language })
        }
    }

    componentDidUpdate() {
        const { Profile } = this.props
        const { meta } = Profile
        if (meta && meta.Id !== 0 && Object.keys(meta).length > 0 && !this.state.isDatafetched) {
            if (meta.Files && Array.isArray(meta.Files)) {
                let pp = meta.Files.find(u => u.Usagetype === "PP")
                const userconfig = validator.isString(meta?.Config) ? JSON.parse(meta?.Config) : null
                this.setState({ file: pp ? pp : {}, isDatafetched: true, fetchedFromapi: true, showImg: pp ? true : false, userConfig: userconfig })
            }
        }

    }

    render() {

        const { Profile } = this.props
        const { meta, username, isLogging, isDispatching } = Profile

        const Languageoptions = [
            { key: 1, text: 'EN', value: 'en' },
            { key: 2, text: 'TR', value: 'tr' },
        ]

        const Notificaitonoptions = [
            { key: 1, text: 'Sol', value: 'left' },
            { key: 2, text: 'Orta', value: 'center' },
            { key: 3, text: 'Sağ', value: 'right' },
        ]

        const userConfig = this.state.userConfig || {}

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
                                        this.state.fetchedFromapi ? `${config.services.File}${ROUTES.FILE}/Downloadfile/${this.state.file?.Uuid}` : URL.createObjectURL(this.state.selectedimage)
                                        : img.avatar} circular size='medium' />
                                    {!this.state.showImg && <Form.Input type='file' onChange={this.imageChange} ></Form.Input>}
                                </Form.Field>
                                <Form.Field >
                                    <Form.Group widths={'equal'}>
                                        <Form.Input label="İsim" placeholder="İsim" name="Name" fluid defaultValue={meta.Name} />
                                        <Form.Input label="Soyisim" placeholder="Soyisim" name="Surname" fluid defaultValue={meta.Surname} />
                                    </Form.Group>
                                    <Form.Group widths={'equal'}>
                                        <Form.Input label="Kayıtlı Şehir" placeholder="Kayıtlı Şehir" name="City" fluid defaultValue={meta.City} />
                                        <Form.Input label="Kayıtlı İlçe" placeholder="Kayıtlı İlçe" name="Town" fluid defaultValue={meta.Town} />
                                    </Form.Group>
                                    <Form.Group widths={'equal'}>
                                        <Form.Input label="Adres" placeholder="Adres" name="Address" fluid defaultValue={meta.Address} />
                                    </Form.Group>
                                    <Form.Group widths={'equal'}>
                                        <Form.Field>
                                            <label className='text-[#000000de]'>Dil</label>
                                            <Dropdown value={this.state.selectedLanguage} clearable selection fluid options={Languageoptions} onChange={(e, { value }) => { this.setState({ selectedLanguage: value }) }} />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group widths={'equal'}>
                                        <Form.Field>
                                            <Form.Input
                                                defaultValue={userConfig['autoClose']}
                                                label="Bildirim Görünür Kalma Süresi (ms)"
                                                placeholder="Görünür Kalma Süresi"
                                                fluid
                                                onChange={(e) => { this.setState({ userConfig: { ...userConfig, 'autoClose': e.target.value } }) }}
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            <label className='text-[#000000de]'>Bildirim Pozisyonu</label>
                                            <Dropdown
                                                value={userConfig['position']}
                                                clearable
                                                selection
                                                fluid
                                                onChange={(e, { value }) => { this.setState({ userConfig: { ...userConfig, 'position': value } }) }}
                                                options={Notificaitonoptions}
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                </Form.Field>
                            </Form.Group>
                            <div className='flex flex-row w-full justify-between py-4  items-center'>
                                <div onClick={(e) => {
                                    e.preventDefault()
                                    this.props.history.goBack()
                                }}>
                                    <Button floated="left" color='grey'>Geri Dön</Button>
                                </div>
                                <Button floated="right" type='submit' color='blue'>Güncelle</Button>
                            </div>
                        </Form>
                    </div>
                </div >
        )
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { EditUsers, history, Profile } = this.props
        const data = formToObject(e.target)
        data.Language = this.state.selectedLanguage
        data.Config = this.state.userConfig ? JSON.stringify(this.state.userConfig) : ''
        this.handleFile()
        EditUsers({ data: { ...Profile.meta, ...data }, history, redirectUrl: "/" })
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
        const { EditFiles, Profile } = this.props
        const { imgChanged, selectedimage, file } = this.state

        if (imgChanged) {
            if (!selectedimage && Object.keys(file).length > 0) {
                let filecontent = { ...file }
                filecontent.WillDelete = true
                delete filecontent.Updatetime
                delete filecontent.Deletetime
                let files = [{
                    ...filecontent, File: selectedimage
                }]
                const formData = new FormData();
                files.forEach((data, index) => {
                    Object.keys(data).forEach(element => {
                        formData.append(`list[${index}].${element}`, data[element])
                    });
                })
                EditFiles({ data: formData })
            }
            if (selectedimage && Object.keys(file).length > 0) {

                let filecontent = { ...file }
                delete filecontent.Updatetime
                delete filecontent.Deletetime
                let files = [{
                    ...filecontent, File: selectedimage
                }]
                const formData = new FormData();
                files.forEach((data, index) => {
                    Object.keys(data).forEach(element => {
                        formData.append(`list[${index}].${element}`, data[element])
                    });
                })
                EditFiles({ data: formData })

            }
            if (selectedimage && Object.keys(file).length === 0) {
                let files = [{
                    Id: 0,
                    Name: 'PP',
                    ParentID: Profile.meta?.Uuid,
                    Filename: 'PP',
                    Filefolder: '',
                    Filepath: '',
                    Filetype: '',
                    Usagetype: 'PP',
                    Canteditfile: false,
                    File: selectedimage,
                    Willdelete: false,
                    FileChanged: true,
                    order: Profile.meta.Files.length,
                }]

                const formData = new FormData();
                files.forEach((data, index) => {
                    Object.keys(data).forEach(element => {
                        formData.append(`list[${index}].${element}`, data[element])
                    });
                })
                EditFiles({ data: formData })
            }
        }
    }

}
