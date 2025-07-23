import { useParams } from "@/router/RouterProvider"

// 임시로 받아오도록 설계해서 수정해도 됩니다.
function Channel() {
  const channelId = useParams()

  return (
    <div>{`${channelId} 채널입니다.`}</div>
  )
}

export default Channel