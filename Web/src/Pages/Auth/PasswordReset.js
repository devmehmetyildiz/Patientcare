import React, { Component, useEffect, useState } from 'react'
import { Link, } from 'react-router-dom'
import { Breadcrumb, Form, Icon, Label, Step } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
  Headerwrapper, LoadingPage, Navbar, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'


export default function Passwordforget() {

  const [power, setPower] = useState(0)
  const [calculated, setCalculated] = useState([])
  const getRandomDecimal = (min, max) => (Math.random() * (max - min) + min).toFixed(2);
  const getRandomDecimalone = (min, max) => (Math.random() * (max - min) + min).toFixed(0);

  const stationName = [
    {
      name: "A SAHASI",
      desc: "KAHRAMANMARAŞ 1",
      value: "1",
      active: true
    },
    {
      name: "EMPTY FIELD",
      desc: "",
      value: "2",
      active: false
    },
    {
      name: "EMPTY FIELD",
      desc: "",
      value: "3",
      active: false
    },
    {
      name: "EMPTY FIELD",
      desc: "",
      value: "4",
      active: false
    },
    {
      name: "EMPTY FIELD",
      desc: "",
      value: "5",
      active: false
    },
  ]

  const items = [
    {
      parentValue: "1",
      name: "A1",
      voltage: 24.15,
      ampere: 6.22,
      kw: "350kW",
      ongrid: true,
      status: true,
    },
    {
      parentValue: "1",
      name: "A2",
      voltage: 24.15,
      ampere: 6.22,
      kw: "350kW",
      ongrid: false,
      status: false,
    },
    {
      parentValue: "1",
      name: "A3",
      voltage: 24.15,
      ampere: 6.22,
      kw: "350kW",
      ongrid: false,
      status: false,
    },
    {
      parentValue: "1",
      name: "A4",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: false,
      status: true,
    },
    {
      parentValue: "1",
      name: "A5",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: false,
      status: true,
    },
    {
      parentValue: "1",
      name: "A6",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: true,
    },
    {
      parentValue: "1",
      name: "A7",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: false,
    },
    {
      parentValue: "1",
      name: "A8",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: true,
    },
    {
      parentValue: "1",
      name: "A9",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: true,
    },
    {
      parentValue: "1",
      name: "A10",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: false,
      status: true,
    },
    {
      parentValue: "1",
      name: "A11",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: false,
      status: false,
    },
    {
      parentValue: "1",
      name: "B1",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: false,
    },
    {
      parentValue: "1",
      name: "B2",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: true,
    },
    {
      parentValue: "1",
      name: "B3",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: true,
    },
    {
      parentValue: "1",
      name: "B4",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: true,
    },
    {
      parentValue: "1",
      name: "B5",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: true,
    },
    {
      parentValue: "1",
      name: "B6",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: true,
    },
    {
      parentValue: "1",
      name: "B7",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: true,
    },
    {
      parentValue: "1",
      name: "B8",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: true,
    },
    {
      parentValue: "1",
      name: "B9",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: true,
    },
    {
      parentValue: "1",
      name: "B10",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: true,
    },
    {
      parentValue: "1",
      name: "B11",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: true,
    },
    {
      parentValue: "1",
      name: "C1",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: true,
    },
    {
      parentValue: "1",
      name: "C2",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: true,
    },
    {
      parentValue: "1",
      name: "C3",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: true,
    },
    {
      parentValue: "1",
      name: "C4",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: false,
      status: false,
    },
    {
      parentValue: "1",
      name: "C5",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: false,
      status: true,
    },
    {
      parentValue: "1",
      name: "C6",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: false,
      status: true,
    },
    {
      parentValue: "1",
      name: "C7",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: true,
    },
    {
      parentValue: "1",
      name: "C8",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: true,
    },
    {
      parentValue: "1",
      name: "C9",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: true,
    },
    {
      parentValue: "1",
      name: "C10",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: true,
    },
    {
      parentValue: "1",
      name: "C11",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: true,
    },
    {
      parentValue: "1",
      name: "D1",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: true,
    },
    {
      parentValue: "1",
      name: "D2",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: true,
    },
    {
      parentValue: "1",
      name: "D3",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: true,
    },
    {
      parentValue: "1",
      name: "D4",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: true,
    },
    {
      parentValue: "1",
      name: "D5",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: true,
    },
    {
      parentValue: "1",
      name: "D6",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: true,
    },
    {
      parentValue: "1",
      name: "D7",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: true,
    },
    {
      parentValue: "1",
      name: "D8",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: true,
    },
    {
      parentValue: "1",
      name: "D9",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: true,
    },
    {
      parentValue: "1",
      name: "D10",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: true,
    },
    {
      parentValue: "1",
      name: "D11",
      voltage: "230V",
      kw: "350kW",
      ampere: "22A",
      ongrid: true,
      status: true,
    },

  ]


  let totalpower = 0
  calculated.forEach(item => {
    totalpower = Number(item.value) + totalpower
  });

  let closedTags = []
  for (let index = 0; index < 10; index++) {
    closedTags.push(getRandomDecimalone(1, 44))
  }

  console.log('closedTags: ', closedTags);
  return (
    <div className='w-full h-[100vh] flex flex-col justify-start items-start contentWrapper gap-10 p-8'>
      <div className='w-full justify-center items-center flex-wrap p-2'>
        <Step.Group ordered>
          {(stationName.map(item => {
            return <Step
              onClick={() => { }}
              link
              active={item.active}
            >
              <Step.Content>
                <Step.Title>{item.name}</Step.Title>
                <Step.Description>{item.desc}</Step.Description>
                {item.active ? <Step.Content><div className='font-bold my-2 font-poppins text-lg'>
                  {`Toplam Güç : ${totalpower.toFixed(2)}kW`}
                </div></Step.Content> : null}
              </Step.Content>
            </Step>
          }))}
        </Step.Group>
      </div>
      <div className='w-full flex flex-row justify-start items-start !font-bold p-2'>
        <Label size='big' className='!font-bold'><Icon name='refresh' />Son güncelleme Tarihi : 15.06.2024 13:12</Label>
      </div>
      <div className='font-bold font-poppins flex flex-row justify-start items-start rounded-lg  flex-wrap w-full '>
        {(items || []).map((item, index) => {
          const isOpen = !closedTags.includes(String(index))
          let voltage = getRandomDecimal(12.5, 24.5)
          let amper = getRandomDecimal(5.5, 8.5)
          let kilowatt = ((voltage * amper).toFixed(2) / 1000).toFixed(2)
          let celcius = getRandomDecimal(70, 90)
          const randomID = getRandomDecimalone(1, 30)
          if (calculated.filter(u => u.index === index).length === 0) {
            setCalculated(prev => [...prev, { index: index, value: kilowatt }])
          }

          return <div
            key={index}
            style={{}}
            className=' relative border-2 p-2 bg-white text-black rounded-lg m-2  w-[150px] h-[150px]  flex flex-col justify-center items-center'>
            <div className='absolute left-1 top-1'>
              <div className={`w-6 h-6 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}>

              </div>
            </div>
            <div className={`absolute right-1 top-1 text-sm font-bold  ${(celcius > 85) ? 'text-red-500' : (celcius > 75.1 && celcius < 85) ? 'text-orange-500' : (celcius > 70 && celcius < 75) ? 'text-yellow-500' : 'text-[#39c539dd]'}`}>
              {`${celcius} °C`}
            </div>
            <div className=' flex flex-col w-full justify-between gap-2 items-center relative'>
              <div className='font-extrabold text-xl'>
                {item.name}
              </div>
              <div className='text-lg text-[#757575dd] flex flex-row gap-4'>
                <div>
                  {`${voltage} V`}
                </div>
                <div>
                  {`${amper} A`}
                </div>
              </div>
              <div className='text-lg text-[#757575dd] flex flex-row gap-4'>
                {`${kilowatt} kW`}
              </div>
            </div>
            <div className={`text-lg font-bold absolute bottom-0  ${isOpen ? 'text-green-500' : 'text-red-500'}`}>
              {isOpen ? "ON GRID" : "OFF GRID"}
            </div>
          </div>
        })}
      </div>
    </div >

  )
}
