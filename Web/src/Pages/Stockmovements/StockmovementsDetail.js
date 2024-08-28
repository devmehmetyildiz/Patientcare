import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import { Chrono } from "react-chrono";

export default class StockmovementsDetail extends Component {

    PAGE_NAME = "StockmovementsDetail"

    constructor(props) {
        super(props)
        this.state = {
            isDatafetched: false,
        }
    }


    componentDidMount() {
        const { GetStockmovement, GetStocks, GetStockdefines, match, history, StockmovementID } = this.props
        let Id = StockmovementID || match.params.StockmovementID
        if (validator.isUUID(Id)) {
            GetStockmovement(Id)
            GetStocks()
            GetStockdefines()
        } else {
            history.push("/Stockmovements")
        }
    }

    componentDidUpdate() {
        const { Stocks, Stockmovements, Stockdefines } = this.props
        const { selected_record, isLoading } = Stockmovements
        if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0
            && !Stockdefines.isLoading && !Stocks.isLoading
            && !isLoading && !this.state.isDatafetched) {
            this.setState({
                isDatafetched: true
            })
            this.context.setForm(this.PAGE_NAME, selected_record)
        }
    }

    render() {
        const { Stockmovements, Stocks, Profile, Stockdefines, history } = this.props

        const stockmovement = (Stockmovements.list || []).filter(u => u.Isactive)

        const items = [
            {
                title: "May 1946",
                cardTitle: "Dunkirk",
                cardSubtitle: "Men of the British Expeditionary Force (BEF) wade out to..",
            },
        ];

        return (
            Stocks.isLoading || Stockmovements.isLoading ? <LoadingPage /> :
                <Pagewrapper>
                    <Headerwrapper>
                        <Headerbredcrump>
                            <Link to={"/Stockmovements"}>
                                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                            </Link>
                            <Breadcrumb.Divider icon='right chevron' />
                            <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
                        </Headerbredcrump>
                    </Headerwrapper>
                    <Pagedivider />
                    <Contentwrapper>
                        <div style={{ width: "100%", height: "100%" }}>
                            <Chrono
                                mode={"VERTICAL_ALTERNATING"}
                                borderLessCards
                                disableToolbar
                                disableNavOnKey
                                items={items} />
                        </div>
                    </Contentwrapper>
                </Pagewrapper >
        )
    }

}
StockmovementsDetail.contextType = FormContext