import HomePage from '@/components/pages/Home/Home'
import axios from 'axios'

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = (await searchParams).page || 1

  const limit = 2

  const res = await axios.get(
    `http://localhost:3000/api/v1/comments`,
    {
      params: { page, limit }, headers: {
        'Cache-Control': 'no-store',
      },
    },


  )

  return <HomePage data={res.data.data} />
}