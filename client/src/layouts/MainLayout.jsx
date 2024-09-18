import { NavLink, Outlet } from "react-router-dom"


const MainLayout = () => {
  return (
    <>
      <div className=" fixed w-full h-[10vh] px-16 py-3 flex flex-row justify-between text-slate-300 bg-slate-900">
          <h1 className=" text-2xl font-bold">Image Manager</h1>
          <nav className=" list-none py-2 flex flex-row gap-6 text-base font-semibold">
              <NavLink to={'/'}>Home</NavLink>
              <NavLink to={'/form'}>Form</NavLink>
          </nav>
      </div>
      <div className=" pt-[10vh] w-full">
          <Outlet />
      </div>
    </>
  )
}

export default MainLayout