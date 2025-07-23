import { addChannels } from "@/api/channels";
import supabase from "@/utils/supabase";
import { useEffect, useId, useState } from "react";
import S from './Channel.module.css';
import { getGenres } from "@/api/genres";


type GenreType = {
  code:number;
  name:string;
}


function ChannelCreateForm() {
  //상태 선언
  const [name,setName] = useState('');
  const [description,setDescription] = useState('');
  const [genre,setGenre] = useState('');
  const [genres, setGenres] = useState<GenreType[]>([]);
  //id
  const nameId = useId();
  const descriptionId = useId();
  const genre_codeId = useId();

  useEffect(()=>{
    const fetchGenres = async () => {
      const data = await getGenres();
      if(data)
        setGenres(data);
    }
    fetchGenres();
  },[]);



  const handleSubmit = async (e:React.FormEvent) => { 
    e.preventDefault();

    const user = await supabase.auth.getUser();
    const owner_id = user.data.user?.id;

    const data = await addChannels({
      name,
      description,
      genre_code: Number(genre),
      owner_id : owner_id!,
    })

    if (!data) {
    console.error('채널 생성 실패!')
  } else {
    console.log('채널 생성 성공!', data)
  }
   }

  return (
    <form onSubmit={handleSubmit} className={S.formContainer}>
      <label htmlFor={nameId}>채널명
        <input 
          id={nameId}
          value={name}
          type="text" 
          onChange={e => setName(e.target.value)}
        />
      </label>

       <label htmlFor={descriptionId}>채널 설명
        <textarea
          id={descriptionId}
          className={S.description}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </label>
      
       <label htmlFor={genre_codeId}>장르 코드
        <select 
          id={genre_codeId}
          className={S.genre_code}
          value={genre}
          onChange={e => setGenre(e.target.value)}
          >
          <option value="">장르를 선택하세요.</option>
          {genres.map((genres)=>(
            <option key={genres.code} value={genres.code}>{genres.name}</option>
          ))}
        </select>
      </label>
      
      <button 
        type="submit"
        className={S.createButton}
        >채널 생성</button>
    </form>
  )
}
export default ChannelCreateForm

