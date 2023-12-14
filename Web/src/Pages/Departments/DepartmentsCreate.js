import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form } from 'semantic-ui-react'
import Literals from './Literals'
import validator from "../../Utils/Validator"
import { FormContext } from '../../Provider/FormProvider'
import StationsCreate from '../../Containers/Stations/StationsCreate'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
  Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'

export default function DepartmentsCreate(props) {

  const { GetStations, Departments, AddDepartments, history, fillDepartmentnotification, Stations, Profile, closeModal } = props

  const PAGE_NAME = "DepartmentsCreate"
  const context = useContext(FormContext)
  const [stationoptions, setStationoptions] = useState([])

  useEffect(() => {
    GetStations()
  }, [])


  useEffect(() => {
    const Stationoptions = (Stations.list || []).filter(u => u.Isactive).map(station => {
      return { key: station.Uuid, text: station.Name, value: station.Uuid }
    })
    setStationoptions(Stationoptions)
  }, [Stations])


  const handleSubmit = (e) => {
    e.preventDefault()

    const data = context.getForm(PAGE_NAME)
    data.Isdefaultpatientdepartment = data.Ishavepatients ? true : false
    data.Stations = (data.Stations || []).map(id => {
      return (Stations.list || []).find(u => u.Uuid === id)
    }) || []

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Namerequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillDepartmentnotification(error)
      })
    } else {
      AddDepartments({ data, history, closeModal })
    }
  }

  return (
    Departments.isLoading ? <LoadingPage /> :
      <Pagewrapper>
        <Headerwrapper>
          <Headerbredcrump>
            <Link to={"/Departments"}>
              <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
            </Link>
            <Breadcrumb.Divider icon='right chevron' />
            <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
          </Headerbredcrump>
          {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
        </Headerwrapper>
        <Pagedivider />
        <Contentwrapper>
          <Form>
            <FormInput page={PAGE_NAME} required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
            <FormInput page={PAGE_NAME} placeholder={Literals.Columns.stationstxt[Profile.Language]} name="Stations" multiple options={stationoptions} formtype="dropdown" modal={StationsCreate} />
            <FormInput page={PAGE_NAME} placeholder={Literals.Columns.Ishavepatients[Profile.Language]} name="Ishavepatients" formtype="checkbox" />
            {context.formstates[`${PAGE_NAME}/Ishavepatients`] ?
              <FormInput page={PAGE_NAME} placeholder={Literals.Columns.Isdefaultpatientdepartment[Profile.Language]} name="Isdefaultpatientdepartment" formtype="checkbox" /> : null}
          </Form>
        </Contentwrapper>
        <Footerwrapper>
          <Gobackbutton
            history={history}
            redirectUrl={"/Departments"}
            buttonText={Literals.Button.Goback[Profile.Language]}
          />
          <Submitbutton
            isLoading={Departments.isLoading}
            buttonText={Literals.Button.Create[Profile.Language]}
            submitFunction={handleSubmit}
          />
        </Footerwrapper>
      </Pagewrapper >
  )
}
