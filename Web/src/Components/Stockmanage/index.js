import React, { useState } from 'react'
import { Button, Dropdown, Form, Icon, Popup, Table } from 'semantic-ui-react'
import Literals from './literals'
import validator from '../../Utils/Validator'
import StocktypesCreate from '../../Containers/Stocktypes/StocktypesCreate'
import AddModal from '../AddModal'
import StockdefinesCreate from '../../Containers/Stockdefines/StockdefinesCreate'
import Formatdate from '../../Utils/Formatdate'

export default function Stockmanage(props) {

    const {
        selectedStocks, setselectedStocks, Profile, Type, WarehouseID, StockgrouptypeID,
        Stocktypes, Stocks, Stockdefines, Units, Stocktypegroups } = props

    const changeHandler = (key, property, value) => {
        let allstocks = selectedStocks
        const index = allstocks.findIndex(stock => stock.key === key)
        if (property === 'Order') {
            allstocks.filter(item => item.Order === value)
                .forEach((item) => item.Order = allstocks[index].Order > value ? item.Order + 1 : item.Order - 1)
        }
        allstocks[index][property] = value
        setselectedStocks(allstocks)
    }

    const remove = (key, order) => {
        let stocks = selectedStocks.filter(stock => stock.key !== key)
        stocks.filter(stock => stock.Order > order).forEach(stock => stock.Order--)
        setselectedStocks([...stocks])
    }

    const Add = () => {
        const newStocks = {
            WarehouseID: WarehouseID,
            Type: Type,
            StockdefineID: '',
            StocktypeID: '',
            Amount: 0,
            Isapproved: false,
            Isdeactivated: false,
            Deactivateinfo: "",
            Skt: null,
            StockgrouptypeID,
            Info: "",
            Iscompleted: false,
            key: Math.random(),
            Order: selectedStocks.filter(u => u.StockgrouptypeID === StockgrouptypeID).length,
        }
        setselectedStocks([...selectedStocks, newStocks])
    }

    const selectablestocktypes = ((Stocktypegroups.list || []).find(u => u.Uuid === StockgrouptypeID)?.Stocktypes || '').split(',').filter(u => validator.isUUID(u))

    const Stocktypeopton = (Stocktypes.list || []).filter(u => u.Isactive).map(type => {
        if ((selectablestocktypes || []).includes(type?.Uuid) && validator.isUUID(StockgrouptypeID)) {
            return { key: type?.Uuid, text: type?.Name, value: type?.Uuid }
        }
    }).filter(u => u)

    const Stockdefineoption = (Stockdefines.list || []).filter(u => u.Isactive).map(define => {
        const stocktype = (Stocktypes.list || []).find(u => u.Uuid === define?.StocktypeID)
        const ishavebarcode = stocktype?.Isbarcodeneed
        const unit = (Units.list || []).find(u => u.Uuid === define?.UnitID)
        return { key: define?.Uuid, text: `${ishavebarcode ? define?.Barcode : ''} ${define?.Name} (${unit?.Name})`, value: define?.Uuid, type: stocktype?.Uuid, unit: unit?.Uuid }
    })

    return <Table color='blue' celled className='overflow-x-auto'  >
        <Table.Header >
            <Table.Row>
                <Table.HeaderCell width={1}>{Literals.Order[Profile.Language]}</Table.HeaderCell>
                <Table.HeaderCell width={3}>{Literals.Stocktype[Profile.Language]}{<AddModal Content={StocktypesCreate} />}</Table.HeaderCell>
                <Table.HeaderCell>{Literals.Stock[Profile.Language]}{<AddModal Content={StockdefinesCreate} />}</Table.HeaderCell>
                <Table.HeaderCell width={2}>{Literals.Amount[Profile.Language]}</Table.HeaderCell>
                <Table.HeaderCell width={1}>{Literals.Delete[Profile.Language]}</Table.HeaderCell>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {selectedStocks.filter(u => u.StockgrouptypeID === StockgrouptypeID).sort((a, b) => a.Order - b.Order).map((stock, index) => {

                const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock.StockdefineID)
                const stocktype = (Stocktypes.list || []).find(u => u.Uuid === stockdefine?.StocktypeID)
                const isHaveskt = stocktype?.Issktneed

                return <Table.Row key={stock.key}>
                    <Table.Cell>
                        <Button.Group basic size='small'>
                            <Button type='button' disabled={index === 0} icon='angle up' onClick={() => { changeHandler(stock.key, 'Order', stock.Order - 1) }} />
                            <Button type='button' disabled={index + 1 === selectedStocks.length} icon='angle down' onClick={() => { changeHandler(stock.key, 'Order', stock.Order + 1) }} />
                        </Button.Group>
                    </Table.Cell>
                    <Table.Cell>
                        <Dropdown
                            disabled={Stocktypes.isLoading}
                            value={stock.StocktypeID}
                            placeholder={Literals.Stocktype[Profile.Language]}
                            clearable
                            selection
                            search
                            fluid
                            options={Stocktypeopton}
                            onChange={(e, data) => { changeHandler(stock.key, 'StocktypeID', data.value) }}
                        />
                    </Table.Cell>
                    <Table.Cell>
                        {isHaveskt
                            ? <div className='w-full flex flex-row gap-2 -mt-2 justify-center items-center'>
                                <Form.Field className='w-full'>
                                    <label className='text-[#000000de]'>{Literals.Stocktype[Profile.Language]}</label>
                                    <Dropdown
                                        disabled={Stockdefines.isLoading}
                                        value={stock.StockdefineID}
                                        placeholder={Literals.Stock[Profile.Language]}
                                        clearable
                                        selection
                                        search
                                        fluid
                                        options={Stockdefineoption.filter(u => u.type === stock.StocktypeID)}
                                        onChange={(e, data) => { changeHandler(stock.key, 'StockdefineID', data.value) }}
                                    />
                                </Form.Field>
                                <Form.Input
                                    className='w-full'
                                    label={Literals.Skt[Profile.Language]}
                                    value={Formatdate(stock.Skt)}
                                    placeholder={Literals.Skt[Profile.Language]}
                                    fluid
                                    type='date'
                                    onChange={(e) => { changeHandler(stock.key, 'Skt', e.target.value) }}
                                />
                            </div>
                            : <Dropdown
                                disabled={Stockdefines.isLoading}
                                value={stock.StockdefineID}
                                placeholder={Literals.Stock[Profile.Language]}
                                clearable
                                selection
                                search
                                fluid
                                options={Stockdefineoption.filter(u => u.type === stock.StocktypeID)}
                                onChange={(e, data) => { changeHandler(stock.key, 'StockdefineID', data.value) }}
                            />
                        }
                    </Table.Cell>
                    <Table.Cell>
                        <Form.Input
                            value={stock.Amount}
                            placeholder={Literals.Amount[Profile.Language]}
                            fluid
                            type='number'
                            min={0}
                            max={9999}
                            onChange={(e) => { changeHandler(stock.key, 'Amount', e.target.value) }}
                        />
                    </Table.Cell>
                    <Table.Cell className='table-last-section'>
                        <Icon
                            className='type-conversion-remove-icon'
                            link
                            color='red'
                            name='minus circle'
                            onClick={() => { remove(stock.key, stock.Order) }}
                        />
                    </Table.Cell>
                </Table.Row>
            })}
        </Table.Body>
        <Table.Footer>
            <Table.Row>
                <Table.HeaderCell colSpan='8'>
                    <Button type="button" className='!bg-[#2355a0] !text-white' size='mini' onClick={() => { Add() }}>{Literals.Addnew[Profile.Language]}</Button>
                </Table.HeaderCell>
            </Table.Row>
        </Table.Footer>
    </Table >
}