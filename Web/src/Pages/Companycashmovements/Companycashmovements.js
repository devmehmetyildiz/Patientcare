import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Loader, Breadcrumb, Grid, GridColumn, Label } from 'semantic-ui-react'
import Literals from './Literals'
import CompanycashmovementsDelete from '../../Containers/Companycashmovements/CompanycashmovementsDelete'
import { CASHYPES, getInitialconfig } from '../../Utils/Constants'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'

export default class Companycashmovements extends Component {

  componentDidMount() {
    const { GetCompanycashmovements } = this.props
    GetCompanycashmovements()
  }


  render() {
    const { Companycashmovements, Profile, handleDeletemodal, handleSelectedCompanycashmovement } = this.props
    const { isLoading } = Companycashmovements

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid' },
      { Header: Literals.Columns.Movementtype[Profile.Language], accessor: row => this.typeCellhandler(row?.Movementtype), Lowtitle: true, Withtext: true },
      { Header: Literals.Columns.Movementvalue[Profile.Language], accessor: row => this.cashCellhandler(row?.Movementvalue), Lowtitle: true, Withtext: true },
      { Header: Literals.Columns.Report[Profile.Language], accessor: 'ReportID', Lowtitle: true, Withtext: true },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser' },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', disableProps: true },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "companycashmovement"
    let initialConfig = getInitialconfig(Profile, metaKey)

    const list = (Companycashmovements.list || []).map(item => {
      return {
        ...item,
        edit: <Link to={`/Companycashmovements/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedCompanycashmovement(item)
          handleDeletemodal(true)
        }} />
      }
    })

    let companyCash = 0.0;
    (Companycashmovements.list || []).filter(u => u.Isactive).forEach(cash => {
      companyCash += cash.Movementtype * cash.Movementvalue
    })
    const [integerPart, decimalPart] = companyCash.toFixed(2).split('.')

    return (
      isLoading ? <LoadingPage /> :
        <React.Fragment>
          <Pagewrapper>
            <Headerwrapper>
              <Grid columns='2' >
                <GridColumn width={8}>
                  <Breadcrumb size='big'>
                    <Link to={"/Companycashmovements"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Companycashmovements/Create"}
                  Columns={Columns}
                  list={list}
                  initialConfig={initialConfig}
                  metaKey={metaKey}
                  Showcreatebutton
                  Showcolumnchooser
                  Showexcelexport
                />
              </Grid>
            </Headerwrapper>
            <Pagedivider />
            <div className='w-full flex justify-start items-center'>
              <Label className='!bg-[#2355a0] !text-white' size='big'>Cüzdan : {integerPart}.{decimalPart}₺</Label>
            </div>
            <Pagedivider />
            {list.length > 0 ?
              <div className='w-full mx-auto '>
                {Profile.Ismobile ?
                  <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
                  <DataTable Columns={Columns} Data={list} Config={initialConfig} />}
              </div> : <NoDataScreen message={Literals.Messages.Nodatafind[Profile.Language]} />
            }
          </Pagewrapper>
          <CompanycashmovementsDelete />
        </React.Fragment>
    )
  }

  typeCellhandler = (value) => {
    return CASHYPES.find(u => u.value === value) ? CASHYPES.find(u => u.value === value).Name : value
  }

  cashCellhandler = (value) => {
    return value + ' TL'
  }

}