import CountdownPage from './CountdownPage'
import WorkingOn from './WorkingOn'

function App() {
  return (
    <div className="container-fluid px-0">
      <div className="row g-0">
        <div className="col-12 col-lg-7">
          <CountdownPage />
        </div>
        <div className="col-12 col-lg-5 d-flex align-items-center justify-content-center p-3 p-md-4">
          <WorkingOn />
        </div>
      </div>
    </div>
  )
}

export default App
