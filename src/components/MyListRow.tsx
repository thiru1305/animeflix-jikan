
import { useAppSelector } from '@/hooks/useStore'
import Row from './Row'

export default function MyListRow() {
  const itemsObj = useAppSelector((s) => s.myList?.items ?? {})
  const items = Object.values(itemsObj)
  if (!items.length) return null

  return <Row title="My List" items={items as any} />
}
