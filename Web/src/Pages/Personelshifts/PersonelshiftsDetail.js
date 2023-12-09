import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Grid, GridColumn, Icon, Label, Loader } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, DataTable } from '../../Components'

export default class PersonelshiftsDetail extends Component {

  PAGE_NAME = "PersonelshiftsDetail"

  componentDidMount() {
    const { GetPersonelshift, match, history, ShiftID, GetFloors, GetShifts, GetPersonels } = this.props
    let Id = ShiftID || match?.params?.ShiftID
    if (validator.isUUID(Id)) {
      GetPersonelshift(Id)
      GetFloors()
      GetShifts()
      GetPersonels()
    } else {
      history.push("/Personelshifts")
    }
  }

  render() {

    const { Personelshifts, Profile, Floors } = this.props
    const { isLoading, isDispatching, selected_record } = Personelshifts

    const startdatestr = selected_record?.shiftrequests?.Startdate || null
    const enddatestr = selected_record?.shiftrequests?.Enddate || null

    let days = []
    let startdate = new Date(startdatestr)
    let enddate = new Date(enddatestr)

    for (let index = startdate.getDate(); index < enddate.getDate(); index++) {
      days.push(index)
    }

    const list = (selected_record?.personelshifts || [])
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
        ShiftID: list.find(u => u.PersonelID === personelID)?.ShiftID,
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
      { Header: Literals.Columns.Name[Profile.Language], accessor: 'PersonelID', Cell: col => this.personelCellhandler(col) },
      { Header: Literals.Columns.Shift[Profile.Language], accessor: 'ShiftID', Cell: col => this.shiftCellhandler(col) }
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

  shiftCellhandler = (col) => {
    const { Shifts } = this.props
    if (Shifts.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const shift = (Shifts.list || []).find(u => u.Uuid === col.value)
      return `${shift?.Starttime}/${shift?.Endtime}` || 'Tanımsız'
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