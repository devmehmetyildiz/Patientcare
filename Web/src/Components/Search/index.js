import React, { Component } from 'react'
import { Search } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { GetPatientforsearch } from '../../Redux/PatientSlice'
import { GetPatientdefines } from '../../Redux/PatientdefineSlice'
import { getSidebarroutes } from '../Sidebar'
import { GetUsersforsearch } from '../../Redux/UserSlice'
export class index extends Component {

    constructor(props) {
        super(props)
        this.state = { searchWord: '' }
    }

    componentDidMount() {
        const { GetPatientforsearch, GetPatientdefines, GetUsersforsearch } = this.props
        GetPatientforsearch()
        GetPatientdefines()
        GetUsersforsearch()
    }

    render() {
        const { Profile, history, Patients, Patientdefines, Users } = this.props

        const patients = (Patients.listsearch || []).filter(u => u.Isactive).map(patient => {
            const patientdefine = (Patientdefines.list || []).find(define => define?.Uuid === patient?.PatientdefineID)
            const patientdefinetxt = `${patientdefine?.Firstname || ''} ${patientdefine?.Lastname || ''} - ${patientdefine?.CountryID || ''}`
            return { title: patientdefinetxt, url: `/Patients/${patient?.Uuid}`, key: Math.random() }
        }).filter(u => (u.title || '').toLocaleLowerCase('tr').includes(this.state.searchWord.toLocaleLowerCase('tr')))

        const users = (Users.listsearch || []).filter(u => u.Isactive).map(user => {
            const usernametxt = `${user?.Name || ''} ${user?.Surname || ''}${user?.CountryID ? ` - ${user?.CountryID}` : ''}`
            return { title: usernametxt, url: `/Users/${user?.Uuid}`, key: Math.random() }
        }).filter(u => (u.title || '').toLocaleLowerCase('tr').includes(this.state.searchWord.toLocaleLowerCase('tr')))

        const sidebarRoutes = (getSidebarroutes(Profile) || []).flatMap(section => {
            return section.items.filter(u => u.permission)
        })

        const searchdata = sidebarRoutes.filter(u => (u.subtitle || '').toLocaleLowerCase('tr').includes(this.state.searchWord.toLocaleLowerCase('tr'))).map(u => {
            return { title: u.subtitle, url: u.url, key: Math.random() }
        }).concat(patients).concat(users)

        return (!Profile.Ismobile && <Search
            input={{ icon: 'search', iconPosition: 'left' }}
            placeholder='Sayfa Arama'
            className='menusearch'
            noResultsMessage='Sonuç Bulunmadı'
            onResultSelect={(e, data) => {
                this.setState({ searchWord: '' })
                history.push(data.result.url)
            }}
            onSearchChange={(e, data) => {
                this.setState({ searchWord: data.value })
            }}
            results={searchdata}
            value={this.state.searchWord}
        />
        )
    }
}


const mapStateToProps = (state) => ({
    Profile: state.Profile,
    Patientdefines: state.Patientdefines,
    Patients: state.Patients,
    Users: state.Users
})

const mapDispatchToProps = {
    GetPatientforsearch,
    GetPatientdefines,
    GetUsersforsearch
}

export default connect(mapStateToProps, mapDispatchToProps)(index)