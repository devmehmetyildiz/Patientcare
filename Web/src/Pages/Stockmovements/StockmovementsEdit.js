import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'

export default function StockmovementsEdit(props) {
  const PAGE_NAME = "StockmovementsEdit"
  const { GetStockmovement, GetStocks, GetStockdefines, GetStocktypes, match, history, StockmovementID } = props
  const { EditStockmovements, fillStockmovementnotification, Stockmovements, Stocktypes, Stocks, Stockdefines, Profile } = props

  const Id = StockmovementID || match.params.StockmovementID

  const { selected_record, isLoading } = Stockmovements

  const context = useContext(FormContext)

  const t = Profile?.i18n?.t

  const handleSubmit = (e) => {
    e.preventDefault()

    const t = Profile?.i18n?.t

    const data = context.getForm(PAGE_NAME)
    let errors = []
    if (!validator.isNumber(data.Movementtype)) {
      errors.push({ type: 'Error', code: t('Pages.Stockmovements.Page.Header'), description: t('Pages.Stockmovements.Messages.MovementtypeRequired"') })
    }
    if (!validator.isUUID(data.StockID)) {
      errors.push({ type: 'Error', code: t('Pages.Stockmovements.Page.Header'), description: t('Pages.Stockmovements.Messages.StockRequired"') })
    }
    if (!validator.isNumber(data.Amount)) {
      errors.push({ type: 'Error', code: t('Pages.Stockmovements.Page.Header'), description: t('Pages.Stockmovements.Messages.AmountRequired"') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillStockmovementnotification(error)
      })
    } else {
      EditStockmovements({ data: { ...Stockmovements.selected_record, ...data }, history })
    }
  }

  const Stockoptions = (Stocks.list || []).filter(u => u.Isactive).map(stock => {
    const stockdefine = (Stockdefines.list || []).find(u => u?.Uuid === stock?.StockdefineID)
    const stocktype = (Stocktypes.list || []).find(u => u?.Uuid === stockdefine?.StocktypeID)
    const isHavebarcode = stocktype?.Isbarcodeneed
    return { key: stock.Uuid, text: `${stockdefine?.Name}${isHavebarcode ? ` (${stockdefine.Barcode})` : ''}`, value: stock.Uuid }
  })

  const Movementoptions = [
    { key: -1, text: t('Option.Movementoption.Outcome'), value: -1 },
    { key: 1, text: t('Option.Movementoption.Income'), value: 1 },
  ]

  useEffect(() => {
    if (selected_record && validator.isObject(selected_record)) {
      context.setForm(PAGE_NAME, selected_record)
    }
  }, [selected_record])

  useEffect(() => {
    if (validator.isUUID(Id)) {
      GetStockmovement(Id)
      GetStocks()
      GetStockdefines()
      GetStocktypes()
    } else {
      history.push("/Stockmovements")
    }
  }, [])

  return (
    Stocks.isLoading || isLoading ? <LoadingPage /> :
      <Pagewrapper>
        <Headerwrapper>
          <Headerbredcrump>
            <Link to={"/Stockmovements"}>
              <Breadcrumb.Section >{t('Pages.Stockmovements.Page.Header')}</Breadcrumb.Section>
            </Link>
            <Breadcrumb.Divider icon='right chevron' />
            <Breadcrumb.Section >{t('Pages.Stockmovements.Page.EditHeader')}</Breadcrumb.Section>
          </Headerbredcrump>
        </Headerwrapper>
        <Pagedivider />
        <Contentwrapper>
          <Form>
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Stockmovements.Column.Stockdefine')} options={Stockoptions} name="StockID" formtype='dropdown' />
            <Form.Group widths='equal'>
              <FormInput page={PAGE_NAME} required placeholder={t('Pages.Stockmovements.Column.Amount')} name="Amount" type='number' min={0} max={9999} />
              <FormInput page={PAGE_NAME} required placeholder={t('Pages.Stockmovements.Column.Movementtype')} name="Movementtype" options={Movementoptions} formtype='dropdown' />
            </Form.Group>
          </Form>
        </Contentwrapper>
        <Footerwrapper>
          <Gobackbutton
            history={history}
            redirectUrl={"/Stockmovements"}
            buttonText={t('Common.Button.Goback')}
          />
          <Submitbutton
            isLoading={Stockmovements.isLoading}
            buttonText={t('Common.Button.Update')}
            submitFunction={handleSubmit}
          />
        </Footerwrapper>
      </Pagewrapper >
  )
}