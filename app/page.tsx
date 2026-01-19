// import HomePage from '@/components/pages/Home/Home'
// import axios from 'axios'

// export default async function Page({
//   searchParams,
// }: {
//   searchParams: { page?: string }
// }) {
//   const page = (await searchParams).page || 1

//   const limit = 2

//   const res = await axios.get(
//     `${process.env.NEXT_PUBLIC_BASE_API}/comments`,
//     {
//       params: { page, limit }, headers: {
//         'Cache-Control': 'no-store',
//       },
//     },


//   )

//   return <HomePage data={res.data.data} />
// }

// page.tsx
import HomePage from '@/components/pages/Home/Home'
import { axiosSequre } from '@/utils/axiosSequre';


export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string; sort?: string }
}) {
  const params = await searchParams
  const page = params.page || 1
  const sort = params.sort || 'newest'
  const limit = 5
console.log(sort);
  const res = await axiosSequre.get(
    `/comments`,
    {
      params: { page, limit, sort },
  
    }
  )
console.log(res);
  return <HomePage data={res?.data} />
}