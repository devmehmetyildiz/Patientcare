import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Form } from 'semantic-ui-react'
import Literals from './Literals'
import validator from "../../Utils/Validator"
import { FormContext } from '../../Provider/FormProvider'
import StationsCreate from '../../Containers/Stations/StationsCreate'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
  Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'

export default function DepartmentsEdit(props) {

  const { GetDepartment, match, history, GetStations, DepartmentID, Departments,
    Profile, EditDepartments, fillDepartmentnotification, handleSelectedDepartment } = props

  const PAGE_NAME = "DepartmentsEdit"
  const [isDatafetched, setisDatafetched] = useState(false)
  const context = useContext(FormContext)


  useEffect(() => {
    let Id = DepartmentID || match?.params?.DepartmentID
    if (validator.isUUID(Id)) {
      GetDepartment(Id)
    } else {
      history.push("/Departments")
    }
  }, [])

  useEffect(() => {
    const { selected_record, isLoading } = Departments
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoading && !isDatafetched) {
      setisDatafetched(true)
      handleSelectedDepartment({})
      context.setForm(PAGE_NAME, selected_record)
    }
  }, [Departments])

  const handleSubmit = (e) => {
    e.preventDefault()

    const data = context.getForm(PAGE_NAME)
    data.Isdefaultpatientdepartment = data.Ishavepatients ? true : false

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Namerequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillDepartmentnotification(error)
      })
    } else {
      EditDepartments({ data: { ...Departments.selected_record, ...data }, history })
    }
  }

  return (
    Departments.isLoading  ? <LoadingPage /> :
      <Pagewrapper>
        <Headerwrapper>
          <Headerbredcrump>
            <Link to={"/Departments"}>
              <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
            </Link>
            <Breadcrumb.Divider icon='right chevron' />
            <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
          </Headerbredcrump>
        </Headerwrapper>
        <Pagedivider />
        <Contentwrapper>
          <Form>
            <FormInput page={PAGE_NAME} required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
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
            buttonText={Literals.Button.Update[Profile.Language]}
            submitFunction={handleSubmit}
          />
        </Footerwrapper>
      </Pagewrapper >
  )
}