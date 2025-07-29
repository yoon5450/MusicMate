import S from './UserList.module.css';

const dummyUsers = Array.from({ length: 30 }).map((_, i) => ({
  id: i,
  name: `유저${i + 1}`,
  avatar: '/music_mate_symbol_fixed.svg',
}));

export const UserList = () => {
  return (
    <div className={S.container}>
      <div className={S.searchBar}>
        <input type="text" placeholder="검색하기" />
      </div>
      <div className={S.listWrapper}>
        <ul className={S.userList}>
          {dummyUsers.map((user) => (
            <li key={user.id} className={S.userItem}>
              <img className={S.avatar} src={user.avatar} alt="avatar" />
              <span className={S.username}>{user.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};