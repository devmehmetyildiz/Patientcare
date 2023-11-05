import React, { Component } from 'react'

export default class UnapprovedMovements extends Component {

  componentDidMount() {
    const {
      GetStockdefines,
      GetPurchaseorderstocks,
      GetPurchaseorderstockmovements,
      GetStocks, GetStockmovements,
      GetPatientstockmovements,
      GetPatientstocks
    } = this.props
    GetStockdefines()
    GetPurchaseorderstocks()
    GetPurchaseorderstockmovements()
    GetStocks()
    GetStockmovements()
    GetPatientstockmovements()
    GetPatientstocks()
  }

  componentDidUpdate() {

  }

  render() {
    return (
      <div>UnapprovedMovements</div>
    )
  }
}
