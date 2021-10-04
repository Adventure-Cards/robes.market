import { NextApiRequest, NextApiResponse } from 'next'
import pMap from 'p-map'
import { chunk, flatten, orderBy } from 'lodash'
import { utils as etherUtils, BigNumber } from 'ethers'
import type { OpenseaResponse, Asset } from '../../../utils/openseaTypes'
import Rarity from '../../../data/test_json_file.json'

const chunked = chunk(Object.keys(Rarity), 20)
const apiKey = process.env.OPENSEA_API_KEY
const fetchDeckPage = async (ids: string[]) => {

  let url = 'https://api-eta-flame.vercel.app/api/opensea?collection=adventure-cards&'
  url += ids.map((id) => `token_ids=${id}`).join('&')

  const res = await fetch(url)
  const json: OpenseaResponse = await res.json()

  return Promise.all(
    json.assets.map(async (asset) => {
      return {
        ...asset
      }
    }),
  )
}

export interface DeckInfo {
  id: string
  price: Number
  url: string
  svg: string
  rarity: string
  oneofs: string
  tenofs: string
  divines: string
  mythics: string
  wizards: string
  dragons: string
  phoenixs: string
  demons: string
}

export const fetchDecks = async () => {
  const data = await pMap(chunked, fetchDeckPage, { concurrency: 2 })
  const mapped = flatten(data)
    .filter(
      (a: Asset) =>
        a?.sell_orders?.[0]?.payment_token_contract.symbol === 'ETH',
    )
    .map((a: Asset): DeckInfo => {
      return {
        id: a.token_id,
        price: Number(
          etherUtils.formatUnits(
            BigNumber.from(a.sell_orders[0]?.current_price.split('.')[0]),
          ),
        ),
        url: a.permalink + '?ref=0xfb843f8c4992efdb6b42349c35f025ca55742d33',
        svg: a.image_url,
        rarity: Rarity[a.token_id].rarity,
        oneofs: Rarity[a.token_id].oneofone,
        tenofs: Rarity[a.token_id].oneoften,
        divines: Rarity[a.token_id].divines,
        mythics: Rarity[a.token_id].mythics,
        wizards: Rarity[a.token_id].wizards,
        dragons: Rarity[a.token_id].dragons,
        demons: Rarity[a.token_id].demons,
        phoenixs: Rarity[a.token_id].phoenixs,
      }
    })

  return {
    decks: orderBy(mapped, ['rarity'], ['asc']),
    lastUpdate: new Date().toISOString(),
  }
}

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = await fetchDecks()
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default handler
