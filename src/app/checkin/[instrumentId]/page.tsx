import { notFound } from 'next/navigation'
import { instruments } from '@/lib/instruments'
import type { InstrumentId } from '@/lib/instruments'
import CheckinFlow from './CheckinFlow'

type Props = {
  params: Promise<{ instrumentId: string }>
}

export function generateStaticParams() {
  return Object.keys(instruments).map((id) => ({ instrumentId: id }))
}

export default async function CheckinPage({ params }: Props) {
  const { instrumentId } = await params
  if (!(instrumentId in instruments)) {
    notFound()
  }
  return <CheckinFlow instrumentId={instrumentId as InstrumentId} />
}
