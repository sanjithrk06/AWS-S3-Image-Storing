import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Home from "./components/Home"
import Form from "./components/Form"

function App() {

  const routes = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />} >
        <Route path="" element={<Home />} />
        <Route path="form" element={<Form />} />
      </Route>
    )
  )

  return (
    <div className="bg-slate-300 min-h-screen">
      <RouterProvider router={routes} />
    </div>
  )
}

export default App
