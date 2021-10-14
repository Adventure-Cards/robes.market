import { DeckInfo, fetchDecks } from './api/decks'
import { format as ts } from 'timeago.js'
import { debug } from 'console'
import { chunk, flatten, orderBy } from 'lodash'

export async function getStaticProps() {
  const data = await fetchDecks()
  return {
    props: {
      decks: data.decks,
      lastUpdate: data.lastUpdate,
    },
    revalidate: 300,
  }
}

interface Props {
  decks: DeckInfo[]
  lastUpdate: string
}

const Deck = ({ deck }: { deck: DeckInfo }) => {
  return (
    <a href={deck.url} target="_blank">
      <div className="m-auto pb-4 mb-8 flex flex-col justify-center items-center gap-2 p-4 md:m-4 border border-white transform hover:scale-105 transition-all bg-black w-full md:w-96">
        <img src={deck.svg} alt="" width="350" height="350" />
        <div className="text-center">
          <p className="text-lg">Deck# {deck.id}</p>
          <p className="text-lg">Rarity: {deck.rarity}/8000</p>
        </div>
        <div className="text-center">
          <p className="text-lg text-underline"> Why? </p> 
          <p className="text-xs text-yellow-300">{deck.oneofs} 1:1s, {deck.tenofs} 1:10s, {deck.mythics} mythics, {deck.divines} divines, {deck.dragons} dragons, {deck.phoenixs} phoenix, {deck.wizards} wizards, {deck.demons} demons</p>
        </div>
        <div className="text-left pt-3">
          <p>Buy Now: Ξ{deck.price} ETH</p>
        </div>
      </div>
    </a>
  )
}

const IndexPage = ({ decks, lastUpdate }: Props) => {
  return (
    <div className="py-3 md:pb-0 font-mono flex flex-col justify-center items-center gap-4 pt-10 md:w-screen">
      <h1 className="text-lg md:text-3xl"> <a target="_blank" href="https://0xadventures.com/"> 🃏 Deck.Market 🃏</a></h1>
      <div className="text-center max-w-screen-md md:leading-loose">
        <p className="md:text-xl">
          The top {decks.length} of 400 rarest decks for sale, ordered by rarity. 
        </p>
        <p className="md:text-lg pt-2 text-gray-600">
          Site adapted by {' '}
          <a
            target="_blank"
            href="https://twitter.com/cmgs_"
            className="underline text-yellow-300"
          >
          @cmgs_
          </a> 
          . Rarity calc by <a target="_blank" className="underline text-yellow-300" href="https://twitter.com/TimshelXYZ"> Timshel</a>. {' '} Come build on {' '} 
          <a
            target="_blank"
            className="underline text-purple-300"
            href="https://discord.com/invite/VaQGZEhKjB"
          >
          Discord 
          </a>

        </p>
        <p className="text-gray-700 text-sm mv-4 ">Last updated {ts(lastUpdate)}</p>
      </div>
      <div className="grid md:grid-cols-2 pt-5">
        {decks.map((deck) => {
          return <Deck deck={deck} key={deck.id} />
        })}
      </div>
    </div>
  )
}

export default IndexPage
