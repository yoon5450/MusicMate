import { RouterContext } from "@/router/RouterProvider";
import { useContext } from "react";
import S from './Layout/Header.module.css'

interface Props {
  to:string;
  children:React.ReactNode,
  activeClassName?: string;
  className?:string;
}
function NavLink({to, children, activeClassName = S.active, className}: Props) {

  const {currentPath, setHistoryRoute} = useContext(RouterContext)!;

  
  const isActive = currentPath === to;


  const classNames = `${isActive ? activeClassName : ''} ${className}`.trim();

  const handleLink = (e:React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setHistoryRoute(to);
    history.pushState(null,'',to)
  }
  
  return (
    <a href={to} className={classNames} onClick={handleLink}>{children}</a>
  )
}
export default NavLink