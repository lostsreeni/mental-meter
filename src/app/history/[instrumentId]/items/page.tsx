import { instruments } from '@/lib/instruments'
import ItemsClient from './ItemsClient'

export function generateStaticParams() {
  return Object.keys(instruments).map((instrumentId) => ({ instrumentId }))
}

export default function Page() {
  return <ItemsClient />
}
