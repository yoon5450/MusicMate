import { useParams } from "@/router/RouterProvider"

function Channel() {
  const {id} = useParams()
  console.log(id)

  return (
    <div>{`${id} 채널입니다.`}</div>
  )
}

export default Channel