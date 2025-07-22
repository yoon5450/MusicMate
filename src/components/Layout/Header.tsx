import S from './Header.module.css';


function Header() {
  return (
    <header className={S.topHeader}>
      <img src='music_mate_symbol_fixed.svg' className={S.logo}/>
    </header>
  )
}

export default Header