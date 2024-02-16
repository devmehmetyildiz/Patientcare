import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Form } from 'semantic-ui-react'
import Literals from './Literals'
import validator from "../../Utils/Validator"
import { FormContext } from '../../Provider/FormProvider'
import DepartmentsCreate from '../../Containers/Departments/DepartmentsCreate'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
  Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'
import { PATIENTMOVEMENTTYPE } from '../../Utils/Constants'
export default class CareplansEdit extends Component {

  PAGE_NAME = 'CareplansEdit'

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
    }
  }

  


  render() {

    

    return (
     <>
     </>
    )
  }


}
CareplansEdit.contextType = FormContext
