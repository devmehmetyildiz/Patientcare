import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Divider, Form, Grid, GridColumn, Header, Icon, Label, Loader } from 'semantic-ui-react'
import Notification from '../../Utils/Notification'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import { FormContext } from '../../Provider/FormProvider'
import Literals from './Literals'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import FormInput from '../../Utils/FormInput'
import validator from '../../Utils/Validator'
import Submitbutton from '../../Common/Submitbutton'
import Gobackbutton from '../../Common/Gobackbutton'
import { getInitialconfig } from '../../Utils/Constants'
import DataTable from '../../Utils/DataTable'

export default class PersonelshiftsDetail extends Component {

  PAGE_NAME = "PersonelshiftsDetail"

  componentDidMount() {
    const { GetPersonelshifts, match, history, ShiftID, GetFloors, GetShifts, GetPersonels, GetShiftrequest } = this.props
    let Id = ShiftID || match?.params?.ShiftID
    if (validator.isUUID(Id)) {
      GetPersonelshifts(Id)
      GetShiftrequest(Id)
      GetFloors()
      GetShifts()
      GetPersonels()
    } else {
      history.push("/Personelshifts")
    }
  }

  render() {

    const { Shifts, Profile, Floors } = this.props
    const { isLoading, isDispatching, selected_shiftrequest } = Shifts

    const startdatestr = selected_shiftrequest?.Startdate || null
    const enddatestr = selected_shiftrequest?.Enddate || null

    let days = []
    let startdate = new Date(startdatestr)
    let enddate = new Date(enddatestr)
    
    for (let index = startdate.getDate(); index < enddate.getDate(); index++) {
      days.push(index)
    }

    const list = (Shifts.Personelshifts || [])
    const personellist = [...new Set(list.map(u => {
      return u.PersonelID
    }))]

    const fulllist = personellist.map(personelID => {

      let personeldays = []
      days.forEach(day => {
        let isHave = list.find(u => u.PersonelID === personelID && u.Occuredday === String(day))
        if (isHave) {
          personeldays.push({ [`Occuredday${day}`]: "true" })
        } else {
          personeldays.push({ [`Occuredday${day}`]: "false" })
        }
      });

      const res = {
        PersonelID: personelID,
        FloorID: list.find(u => u.PersonelID === personelID)?.FloorID
      }

      personeldays.forEach(keyvalue => {
        Object.keys(keyvalue).forEach(keyvalueofobject => {
          res[keyvalueofobject] = keyvalue[keyvalueofobject]
        })
      })

      return res
    })

    let Columns = [
      { Header: Literals.Columns.Name[Profile.Language], accessor: 'PersonelID', Cell: col => this.personelCellhandler(col) }
    ].concat(
      days.map(u => {
        return { Header: u, accessor: 'Occuredday' + u, Cell: col => this.boolCellhandler(col) }
      }))

    const floors = (Floors.list || []).filter(u => u.Isactive)

    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <React.Fragment>
          <Pagewrapper>
            <Headerwrapper>
              <Grid columns='2' >
                <GridColumn width={8}>
                  <Breadcrumb size='big'>
                    <Link to={"/Personelshifts"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                      <Breadcrumb.Divider icon='right chevron' />
                      <Breadcrumb.Section>{`${this.datehandler(startdatestr)}-${this.datehandler(enddatestr)}`}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
              </Grid>
            </Headerwrapper>
            <Pagedivider />
            {floors.map(floor => {
              return <div key={Math.random()} className='w-full flex flex-col justify-center items-center px-4'>
                <div className='w-full flex justify-start items-center my-2'>
                  <Label size='large' color={floor.Gender === "0" ? 'blue' : 'red'}>{`${floor?.Name}`}</Label>
                </div>
                <DataTable Columns={Columns} Data={fulllist.filter(u => u.FloorID === floor.Uuid)} />
              </div>
            })}
          </Pagewrapper>
        </React.Fragment>
    )
  }

  datehandler = (value) => {
    const date = new Date(value)
    if (value && validator.isISODate(date)) {

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${day}.${month}.${year}`;

      return formattedDate
    } else {
      return value
    }
  }

  personelCellhandler = (col) => {
    const { Personels } = this.props
    if (Personels.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const personel = (Personels.list || []).find(u => u.Uuid === col.value)
      return personel ? `${personel?.Name} ${personel?.Surname}` : 'Tanımsız'
    }
  }

  boolCellhandler = (col) => {
    return validator.isString(col.value)
      ? col.value === 'true'
        ? <div className='w-full flex justify-center items-center'><Icon className='cursor-pointer' color='green' name='checkmark' /></div>
        : <div className='w-full flex justify-center items-center'><Icon className='cursor-pointer' color='red' name='times circle' /></div>
      : 'Tanımsız'
  }
}