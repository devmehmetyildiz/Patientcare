import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import Literals from './Literals'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import validator from '../../Utils/Validator'
import { getInitialconfig } from '../../Utils/Constants'
import PersonelshiftsDelete from '../../Containers/Personelshifts/PersonelshiftsDelete'

export default class Personelshifts extends Component {

  componentDidMount() {
    const { GetPersonelshifts } = this.props
    GetPersonelshifts()
  }

  render() {

    const { Personelshifts, Profile, handleDeletemodal, handleSelectedPersonelshift } = this.props
    const { isLoading, isDispatching } = Personelshifts

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id' },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid' },
      { Header: Literals.Columns.Startdate[Profile.Language], accessor: row => this.dateCellhandler(row?.Startdate), Lowtitle: true, Withtext: true },
      { Header: Literals.Columns.Enddate[Profile.Language], accessor: row => this.dateCellhandler(row?.Enddate), Lowtitle: true, Withtext: true },
      { Header: Literals.Columns.Period[Profile.Language], accessor: 'Period', Lowtitle: true, Withtext: true },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.detail[Profile.Language], accessor: 'detail', disableProps: true },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "Personelshifts"
    let initialConfig = getInitialconfig(Profile, metaKey)

    const list = (Personelshifts.list || []).map(item => {
      return {
        ...item,
        detail: <div className='w-full flex justify-center items-center'>
          <Link to={`/Personelshifts/${item.Uuid}`} >
            <Icon size='large' className='row-edit' name='magnify' />
          </Link>
        </div>,
        delete: <div className='w-full flex justify-center items-center'>
          <Icon link size='large' color='red' name='alternate trash' onClick={() => {
            handleSelectedPersonelshift(item)
            handleDeletemodal(true)
          }} />
        </div >
      }
    })

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
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Personelshifts/Create"}
                  Columns={Columns}
                  list={list}
                  initialConfig={initialConfig}
                  metaKey={metaKey}
                  Showcreatebutton
                  Showcolumnchooser
                />
              </Grid>
            </Headerwrapper>
            <Pagedivider />
            {list.length > 0 ?
              <div className='w-full mx-auto '>
                {Profile.Ismobile ?
                  <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
                  <DataTable Columns={Columns} Data={list} Config={initialConfig} />}
              </div> : <NoDataScreen message={Literals.Messages.Nodatafind[Profile.Language]} />
            }
          </Pagewrapper>
          <PersonelshiftsDelete />
        </React.Fragment>
    )
  }

  dateCellhandler = (value) => {
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

}
