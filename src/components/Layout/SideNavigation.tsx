import { routes } from "@/router/router"
import S from "./SideNavigation.module.css";
import NavLink from "../NavLink";
function SideNavigation() {

  return (
    <section className={S.component}>
      <h1>학습 주제 </h1>
      <nav>
        <h2 className="a11y-hidden">메인 메뉴</h2>
        <ul>
          {
            routes.map(({path,title})=>(
              <li key={path}>
                <NavLink to={path}>{title}</NavLink>
              </li>
            ))
          }
        </ul>
      </nav>
    </section>
  )
}
export default SideNavigation