import React from 'react'
import { SKUSelector } from 'vtex.store-components'
import { useCssHandles } from 'vtex.css-handles'
import type { CssHandlesTypes } from 'vtex.css-handles'
import { ProductSummaryContext } from 'vtex.product-summary-context'
import type { ProductSummaryTypes } from 'vtex.product-summary-context'
import type { ResponsiveValuesTypes } from 'vtex.responsive-values'
import type { ProductTypes } from 'vtex.product-context'

import { getFirstAvailableSeller } from './modules/seller'

const { useProductSummary, useProductSummaryDispatch } = ProductSummaryContext

const CSS_HANDLES = ['SKUSelectorContainer'] as const

interface Props {
  skuItems: ProductTypes.Item[]
  skuSelected: ProductTypes.Item | null
  onSKUSelected?: (skuId: string) => void
  maxItems?: number
  visibility?: string
  seeMoreLabel: string
  hideImpossibleCombinations?: boolean
  showValueNameForImageVariation?: boolean
  showValueForVariation?: 'none' | 'image' | 'all'
  imageHeight?: ResponsiveValuesTypes.ResponsiveValue<number>
  imageWidth?: ResponsiveValuesTypes.ResponsiveValue<number>
  thumbnailImage?: string
  visibleVariations?: string[]
  showVariationsLabels?: boolean
  variationsSpacing?: number
  showVariationsErrorMessage?: boolean
  initialSelection?: 'complete' | 'image' | 'empty'
  displayMode?: ResponsiveValuesTypes.ResponsiveValue<
    'select' | 'default' | 'slider'
  >
  sliderDisplayThreshold?: number
  sliderArrowSize?: number
  sliderItemsPerPage?: ResponsiveValuesTypes.ResponsiveValue<number>
  classes: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>
}

function ProductSummarySKUSelector(props: Props) {
  const { handles } = useCssHandles(CSS_HANDLES, { classes: props.classes })
  const dispatch = useProductSummaryDispatch()
  const { product } = useProductSummary()

  const stopBubblingUp: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleSKUSelected = (skuId: string | null) => {
    if (skuId == null) {
      dispatch({
        type: 'SET_PRODUCT_QUERY',
        args: { query: '' },
      })

      return
    }

    const selectedItem =
      product.items &&
      (product.items.find(
        (item) => item.itemId === skuId
      ) as ProductSummaryTypes.SKU)

    const sku = {
      ...selectedItem,
      image: selectedItem.images[0],
      seller:
        getFirstAvailableSeller(selectedItem.sellers) ??
        selectedItem.sellers[0],
    }

    const newProduct = {
      ...product,
      selectedItem,
      sku,
    }

    dispatch({
      type: 'SET_PRODUCT',
      args: { product: newProduct },
    })

    dispatch({
      type: 'SET_PRODUCT_QUERY',
      args: { query: `skuId=${skuId}` },
    })
  }

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div onClick={stopBubblingUp} className={handles.SKUSelectorContainer}>
      <SKUSelector onSKUSelected={handleSKUSelected} {...props} />
    </div>
  )
}

export default ProductSummarySKUSelector
