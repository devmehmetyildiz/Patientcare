import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import Literals from './Literals'
import { FormContext } from '../../Provider/FormProvider'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import config from '../../Config'
import { Headerwrapper, LoadingPage, Pagedivider, Pagewrapper } from '../../Components'

export default class Appreports extends Component {

    componentDidMount() {
        const { GetLogs, GetUsers } = this.props
        GetLogs()
        GetUsers()
    }

    render() {

        const { Profile, Reports, Users } = this.props

        const { logs } = Reports

        const services = Object.keys(config.services)
        const servicesUsage = (services.map(service => {
            const usage = (logs.filter(u => new Date(u.Createtime).getMonth() === new Date().getMonth() &&
                new Date(u.Createtime).getFullYear() === new Date().getFullYear() && u.Servername === service) || []).length
            if (usage > 0)
                return {
                    name: service,
                    y: usage
                }
            else {
                return null
            }
        })).filter(u => u !== null)

        const pieoptions = {
            chart: {
                type: 'pie',
            },
            title: {
                text: 'Aylık Servis Kullanımı',
            },
            series: {
                name: 'Servisler',
                data: servicesUsage
            }
        };

        const userLog = [...new Set(logs.map(u => { return u.RequestuserID }) || [])]
        const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        const lineoptions = {
            chart: {
                type: 'line',
                zoomType: 'x'
            },
            title: {
                text: 'Uygulama Girişleri',
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            },
            yAxis: {
                title: {
                    text: 'Giriş Sayısı',
                },
            },
            series: (userLog || []).map(user => {
                return {
                    name: Users.list.find(u => u.Uuid === user)?.Username,
                    data: months.map(month => {
                        return ((logs.filter(u => u.RequestuserID === user &&
                            new Date(u.Createtime).getMonth() === month &&
                            new Date(u.Createtime).getFullYear() === new Date().getFullYear() &&
                            u.Targeturl === "/Oauth/Login")) || []).length
                    })
                }
            })
        };


        return (
            false ? <LoadingPage /> :
                <React.Fragment>
                    <Pagewrapper>
                        <Headerwrapper>
                            <Grid stackable columns='2' >
                                <GridColumn width={8}>
                                    <Breadcrumb size='big'>
                                        <Link to={"/Appreports"} >
                                            <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                                        </Link>
                                    </Breadcrumb>
                                </GridColumn>
                            </Grid>
                        </Headerwrapper>
                        <Pagedivider />
                        <div className='w-full mt-8'>
                            <Grid columns='2' divided stackable>
                                <GridColumn width={8}>
                                    <HighchartsReact highcharts={Highcharts} options={pieoptions} />
                                </GridColumn>
                                <GridColumn width={8}>
                                    <HighchartsReact highcharts={Highcharts} options={lineoptions} />
                                </GridColumn>
                            </Grid>
                        </div>
                    </Pagewrapper >
                </React.Fragment >
        )
    }

}
Appreports.contextType = FormContext