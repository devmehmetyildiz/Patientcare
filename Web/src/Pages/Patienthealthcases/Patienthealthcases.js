import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Loader } from 'semantic-ui-react'
import { Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import { DataTable, Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings } from '../../Components'
import PatienthealthcasesDelete from '../../Containers/Patienthealthcases/PatienthealthcasesDelete'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import validator from '../../Utils/Validator'

export default function Patienthealthcases(props) {

  const { Patienthealthcases, Patients, Patientdefines, Patienthealthcasedefines, Profile, match, location } = props
  const { GetPatienthealthcases, GetPatients, GetPatientdefines, GetPatienthealthcasedefines } = props

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [record, setRecord] = useState(null)
  const params = new URLSearchParams(location.search)
  const patientID = params.get('PatientID')
  const patient = (Patients.list || []).find(u => u.Uuid === patientID)
  const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
  const patientname = `${patientdefine?.Firstname} ${patientdefine?.Lastname}`

  const t = Profile?.i18n?.t
  const { isLoading } = Patienthealthcases

  const colProps = {
    sortable: true,
    canGroupBy: true,
    canFilter: true
  }

  const patientCellhandler = (value) => {
    if (Patients.isLoading || Patientdefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const patient = (Patients?.list || []).find(u => u.Uuid === value)
      const patientdefine = (Patientdefines?.list || []).find(u => u.Uuid === patient?.PatientdefineID)
      return `${patientdefine?.Firstname} ${patientdefine?.Lastname}`
    }
  }

  const defineCellhandler = (value) => {
    if (Patienthealthcasedefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const patienthealthcasedefine = (Patienthealthcasedefines?.list || []).find(u => u.Uuid === value)
      return `${patienthealthcasedefine?.Name}`
    }
  }

  const Columns = [
    { Header: t('Common.Column.Id'), accessor: 'Id' },
    { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
    { Header: t('Pages.Patienthealthcases.Column.Patient'), accessor: row => patientCellhandler(row?.PatientID), Title: true },
    { Header: t('Pages.Patienthealthcases.Column.Define'), accessor: row => defineCellhandler(row?.DefineID), Title: true },
    { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
    { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
    { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
    { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
    { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
    { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, }
  ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

  const metaKey = "patienthealthcase"
  let initialConfig = GetInitialconfig(Profile, metaKey)

  const list = (Patienthealthcases.list || []).filter(u => validator.isUUID(patientID) ? u.PatientID === patientID : true).filter(u => u.Isactive).map(item => {
    return {
      ...item,
      edit: <Link to={`/Patienthealthcases/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
      delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
        setRecord(item)
        setDeleteOpen(true)
      }} />
    }
  })

  useEffect(() => {
    GetPatienthealthcases()
    GetPatientdefines()
    GetPatients()
    GetPatienthealthcasedefines()
  }, [])

  return (
    isLoading ? <LoadingPage /> :
      <React.Fragment>
        <Pagewrapper>
          <Headerwrapper>
            <Grid columns='2' >
              <GridColumn width={8}>
                <Breadcrumb size='big'>
                  <Link to={"/Patienthealthcases"}>
                    <Breadcrumb.Section>{t('Pages.Patienthealthcases.Page.Header')}</Breadcrumb.Section>
                  </Link>
                  {validator.isUUID(patientID) ?
                    <React.Fragment>
                      <Breadcrumb.Divider icon='right chevron' />
                      {Patients.isLoading || Patientdefines.isLoading ?
                        <Loader inline size='tiny' active />
                        : <Breadcrumb.Section>{`${patientname}`}</Breadcrumb.Section>}
                    </React.Fragment>
                    : null}
                </Breadcrumb>
              </GridColumn>
              <Settings
                Profile={Profile}
                Pagecreateheader={t('Pages.Patienthealthcases.Page.CreateHeader')}
                Pagecreatelink={"/Patienthealthcases/Create"}
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
          {list.length > 0 ?
            <div className='w-full mx-auto '>
              {Profile.Ismobile ?
                <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
                <DataTable Columns={Columns} Data={list} Config={initialConfig} />}
            </div> : <NoDataScreen message={t('Common.NoDataFound')} />
          }
        </Pagewrapper>
        <PatienthealthcasesDelete
          open={deleteOpen}
          setOpen={setDeleteOpen}
          record={record}
          setRecord={setRecord}
        />
      </React.Fragment>
  )
}
