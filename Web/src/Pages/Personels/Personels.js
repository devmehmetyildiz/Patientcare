import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn, Tab, Label } from 'semantic-ui-react'
import Literals from './Literals'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable, Contentwrapper } from '../../Components'
import PersonelsDelete from '../../Containers/Personels/PersonelsDelete'
import { getInitialconfig } from '../../Utils/Constants'
export default class Periods extends Component {


  componentDidMount() {
    const { GetPersonels, GetShifts, GetFloors } = this.props
    GetPersonels()
    GetShifts()
    GetFloors()
  }

  render() {

    const { Personels, Profile, handleDeletemodal, handleSelectedPersonel, AddRecordPersonels, Shifts, Floors } = this.props
    const { isLoading, isDispatching } = Personels

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id' },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid' },
      { Header: Literals.Columns.Name[Profile.Language], accessor: 'Name', Title: true },
      { Header: Literals.Columns.Surname[Profile.Language], accessor: 'Surname', Subtitle: true },
      { Header: Literals.Columns.CountryID[Profile.Language], accessor: 'CountryID' },
      { Header: Literals.Columns.Professions[Profile.Language], accessor: row => this.professionCellhandler(row?.Professions), Lowtitle: true, Withtext: true },
      { Header: Literals.Columns.Workstarttime[Profile.Language], accessor: row => this.dateCellhandler(row?.Workstarttime) },
      { Header: Literals.Columns.Gender[Profile.Language], accessor: row => this.genderCellhandler(row?.Gender) },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', disableProps: true },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "Personels"
    let initialConfig = getInitialconfig(Profile, metaKey)

    const list = (Personels.list || []).map(item => {
      return {
        ...item,
        edit: <Link to={`/Personels/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedPersonel(item)
          handleDeletemodal(true)
        }} />
      }
    })

    const activeShift = (Shifts.list || []).find(u => this.isTimeInRange(u.Starttime, u.Endtime))

    const panes = [
      {
        menuItem: Literals.Columns.Activeshift[Profile.Language], render: () => <Tab.Pane>
          {(Floors.list || []).map(floor => {

            const personels = (Personels.list || []).filter(u => u.ShiftID === activeShift?.Uuid && u.FloorID === floor?.Uuid)

            return <div key={Math.random()} className='w-full flex flex-col justify-center items-center px-4'>
              <div className='w-full flex justify-start items-center my-2'>
                <Label size='large' className={`${floor.Gender === "0" ? '!bg-[#2355a0] !text-white' : '!bg-red-400 !text-white'}`} >{`${floor?.Name}`}</Label>
              </div>
              <div className='w-full flex  justify-start items-center gap-4'>
                {(personels || []).map(personel => {
                  return <div className='cursor-pointer font-bold'>{`${personel?.Name} ${personel?.Surname}`}</div>
                })}
              </div>
              <Pagedivider />
            </div>
          })}
        </Tab.Pane>
      },
      {
        menuItem: Literals.Columns.Personels[Profile.Language], render: () => <Tab.Pane>
          {list.length > 0 ?
            <div className='w-full mx-auto '>
              {Profile.Ismobile ?
                <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
                <DataTable Columns={Columns} Data={list} Config={initialConfig} />}
            </div> : <NoDataScreen message={Literals.Messages.Nodatafind[Profile.Language]} />
          }
        </Tab.Pane>
      },
    ]


    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <React.Fragment>
          <Pagewrapper>
            <Headerwrapper>
              <Grid columns='2' >
                <GridColumn width={8}>
                  <Breadcrumb size='big'>
                    <Link to={"/Personels"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Personels/Create"}
                  Columns={Columns}
                  list={list}
                  initialConfig={initialConfig}
                  metaKey={metaKey}
                  AddRecord={AddRecordPersonels}
                  Showcreatebutton
                  Showcolumnchooser
                  Showexcelexport
                  Showexcelimport
                />
              </Grid>
            </Headerwrapper>
            <Pagedivider />
            <Contentwrapper additionalStyle={'max-h-[90vh]'}>
              <Tab panes={panes} />
            </Contentwrapper>
          </Pagewrapper>
          <PersonelsDelete />
        </React.Fragment>
    )
  }

  dateCellhandler = (value) => {
    if (value) {
      return value.split('T').length > 0 ? value.split('T')[0] : value
    }
    return null
  }

  genderCellhandler = (value) => {
    const { Profile } = this.props
    const Genderoptions = [
      { key: 0, text: Literals.Options.Genderoptions.value0[Profile.Language], value: "0" },
      { key: 1, text: Literals.Options.Genderoptions.value1[Profile.Language], value: "1" }
    ]
    return Genderoptions.find(u => u.value === value)?.text
  }

  professionCellhandler = (value) => {
    const { Profile } = this.props
    const Professionoptions = [
      { key: 0, text: Literals.Options.Professionoptions.value0[Profile.Language], value: "0" },
      { key: 1, text: Literals.Options.Professionoptions.value1[Profile.Language], value: "1" },
      { key: 2, text: Literals.Options.Professionoptions.value2[Profile.Language], value: "2" },
      { key: 3, text: Literals.Options.Professionoptions.value3[Profile.Language], value: "3" },
      { key: 4, text: Literals.Options.Professionoptions.value4[Profile.Language], value: "4" },
    ]
    return Professionoptions.find(u => u.value === value)?.text
  }

  isTimeInRange = (startTime, endTime) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    const [startHour, startMinutes] = startTime.split(':').map(Number);
    const [endHour, endMinutes] = endTime.split(':').map(Number);

    // Convert time to minutes for easier comparison
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;
    const startTimeInMinutes = startHour * 60 + startMinutes;
    const endTimeInMinutes = endHour * 60 + endMinutes;

    // Check if current time falls within the range
    if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes) {
      return true;
    } else {
      return false;
    }
  }
}
