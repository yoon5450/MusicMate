import { addChannels } from "@/api/channels";
import supabase from "@/utils/supabase";
import { useEffect, useId, useState } from "react";
import S from './channel.module.css';
import { getGenres } from "@/api/genres";


type GenreType = {
  code:number;
  name:string;
}

type CreatedChannelType = {
  onSuccess ?: () => void;
}

function ChannelCreateForm({onSuccess}:CreatedChannelType) {
  
  const [name,setName] = useState('');
  const [description,setDescription] = useState('');
  const [genre,setGenre] = useState('');
  const [genres, setGenres] = useState<GenreType[]>([]);
  const [isLoading, setIsLoading] = useState(false);  
  
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

    if(!name.trim()|| !description.trim() || !genre){
      alert("채널 이름, 설명, 장르를 모두 입력해주세요.");
      return;
    }
    setIsLoading(true);

    const user = await supabase.auth.getUser();
    const owner_id = user.data.user?.id;
    
    try{
    const data = await addChannels({
      name,
      description,
      genre_code: Number(genre),
      owner_id : owner_id!,
    })
    if (!data) {
      console.error('채널 생성 실패!')
    } else {
      console.log('채널 생성 성공!', data);
      onSuccess?.();
    }
    }
    catch(error){
      console.error('채널 생성 중 오류 발생 : ',error);
      alert('채널 생성 중 오류가 발생했습니다.');
    }
    finally{
      setIsLoading(false);
    }
   };

  return (
    <form onSubmit={handleSubmit} className={S.formContainer}>
      <div className={S.formGroup}>
        <label htmlFor={nameId}>채널 이름</label>
        <input 
          id={nameId}
          className={S.input}
          value={name}
          type="text" 
          onChange={e => setName(e.target.value)}
          required
        />
      </div>

      <div className={S.formGroup}>
        <label htmlFor={descriptionId}>채널 설명</label>
        <textarea
          id={descriptionId}
          className={S.description}
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
      </div>
      
      <div className={S.formGroup}>
        <label htmlFor={genre_codeId}>장르 코드 </label>
        <select 
          id={genre_codeId}
          className={S.genre_code}
          value={genre}
          onChange={e => setGenre(e.target.value)}
          required
          >
          <option value="" disabled>장르를 선택하세요.</option>
          {genres.map((genres)=>(
            <option key={genres.code} value={genres.code}>{genres.name}</option>
          ))}
        </select>
      </div>
       
      
      <button 
        type="submit"
        className={S.createButton}
        disabled={isLoading}
        >
          {isLoading ? "채널 생성 중..." : "채널 생성"}
        </button>
    </form>
  )
}
export default ChannelCreateForm

