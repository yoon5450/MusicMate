import supabase from "@/utils/supabase";
import { useState } from "react";





function ChannelCreateForm() {
  const [name,setName] = useState('');
  const [description,setDescription] = useState('');
  const [genre,setGenre] = useState('');


  const handleSubmit = async (e:React.FormEvent) => { 
    e.preventDefault();

    const user = await supabase.auth.getUser();
    const owner_id = user.data.user.id;

    const { data, error } = await supabase.from('channels').insert([
    {
      name,
      description,
      genre_code: genre,
      owner_id,
      created_at: new Date().toISOString()
    }
  ])

    if (error) {
    console.error('채널 생성 실패:', error.message)
  } else {
    console.log('채널 생성 성공!', data)
  }


   }

  return (
    <form onSubmit={handleSubmit}>
      <h2>채널 생성하기</h2>
      <h3>채널 이름</h3>
      <input 
      value={name}
      type="text"
      onChange={e => setName(e.target.value)} />
      <h3>채널 설명</h3>
      <textarea
      value={description}
      onChange={e => setDescription(e.target.value)} />
      <h3>장르</h3>
      <input 
      value={genre}
      type="text"
      onChange={e => setGenre(e.target.value)} />
      <button type="submit">채널 생성</button>
    </form>
  )
}
export default ChannelCreateForm