import React, { Component } from 'react'
import { Search } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { GetPatientforsearch } from '../../Redux/PatientSlice'
import { GetPatientdefines } from '../../Redux/PatientdefineSlice'
import { getSidebarroutes } from '../Sidebar'

export class index extends Component {

    constructor(props) {
        super(props)
        this.state = { searchWord: '' }
    }

    componentDidMount() {
        const { GetPatientforsearch, GetPatientdefines } = this.props
        GetPatientforsearch()
        GetPatientdefines()
    }

    render() {
        const { Profile, history, Patients, Patientdefines } = this.props

        const patients = (Patients.listsearch || []).filter(u => u.Isactive).map(patient => {
            const patientdefine = (Patientdefines.list || []).find(define => define?.Uuid === patient?.PatientdefineID)
            const patientdefinetxt = `${patientdefine?.Firstname || ''} ${patientdefine?.Lastname || ''} - ${patientdefine?.CountryID || ''}`
            return { title: patientdefinetxt, url: `/Patients/${patient?.Uuid}`, key: Math.random() }
        }).filter(u => (u.title || '').toLowerCase().includes(this.state.searchWord.toLowerCase()))

        const sidebarRoutes = (getSidebarroutes(Profile) || []).flatMap(section => {
            return section.items.filter(u => u.permission)
        })

        const searchdata = sidebarRoutes.filter(u => (u.subtitle || '').toLowerCase().includes(this.state.searchWord.toLowerCase())).map(u => {
            return { title: u.subtitle, url: u.url, key: Math.random() }
        }).concat(patients)

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
    Patients: state.Patients
})

const mapDispatchToProps = {
    GetPatientforsearch,
    GetPatientdefines
}

export default connect(mapStateToProps, mapDispatchToProps)(index)