import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Icon, Modal } from 'semantic-ui-react'
import { Breadcrumb, Button, Grid, GridColumn, Header } from 'semantic-ui-react'
import DataTable from '../../Utils/DataTable'
import LoadingPage from '../../Utils/LoadingPage'
import NoDataScreen from '../../Utils/NoDataScreen'
import Literals from './Literals'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Pagedivider from '../../Common/Styled/Pagedivider'
import MobileTable from '../../Utils/MobileTable'
import Settings from '../../Common/Settings'
import { getInitialconfig } from '../../Utils/Constants'
import validator from '../../Utils/Validator'

export default class Personelshifts extends Component {


  componentDidMount() {
    const { GetShiftrequests } = this.props
    GetShiftrequests()
  }

  render() {

    const { Shifts, Profile } = this.props
    const { isLoading, isDispatching } = Shifts

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id' },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid' },
      { Header: Literals.Columns.Startdate[Profile.Language], accessor: 'Startdate', Cell: col => this.dateCellhandler(col) },
      { Header: Literals.Columns.Enddate[Profile.Language], accessor: 'Enddate', Cell: col => this.dateCellhandler(col) },
      { Header: Literals.Columns.Period[Profile.Language], accessor: 'Period' },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.detail[Profile.Language], accessor: 'detail', disableProps: true },
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "Personelshifts"
    let initialConfig = getInitialconfig(Profile, metaKey)

    const list = (Shifts.Shiftrequests || []).map(item => {
      return {
        ...item,
        detail: <div className='w-full flex justify-center items-center'>
          <Link to={`/Personelshifts/${item.Uuid}`} >
            <Icon size='large' className='row-edit' name='magnify' />
          </Link>
        </div>,
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
        </React.Fragment>
    )
  }

  dateCellhandler = (col) => {
    const date = new Date(col.value)
    if (col.value && validator.isISODate(date)) {

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${day}.${month}.${year}`;

      return formattedDate
    } else {
      return col.value
    }
  }

}
