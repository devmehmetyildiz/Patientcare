import React, { Component } from 'react'
import "./Spinner.css"
export class Spinner extends Component {
    render() {
        return (
            <div>
                <div className="spinner-wrapper">
                    <div className="donut"></div>
                </div>
            </div>
        )
    }
}

export default Spinner