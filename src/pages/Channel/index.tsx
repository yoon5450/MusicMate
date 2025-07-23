import { useParams } from "@/router/RouterProvider"

function Channel() {
  const {id} = useParams()

  return (
    <div>{`${id} 채널입니다.`}</div>
  )
}

export default Channel