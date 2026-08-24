import './index.css'

const NotFound = props => {
  const homeRouteRequest = () => {
    const {history} = props
    history.push('/')
  }

  return (
    <div className="not-found-cont">
      <div className="not-found-card">
        <img
          className="not-found-img"
          alt="page not found"
          src="https://res.cloudinary.com/dcbox8yto/image/upload/v1783339917/erroring_1_hg4wlv.png"
        />
        <h1 className="not-found-heading">PAGE NOT FOUND</h1>
        <p className="not-found-des">
          we are sorry, the page you requested could not be found
        </p>
        <button onClick={homeRouteRequest} className="home-page" type="button">
          Home Page
        </button>
      </div>
    </div>
  )
}

export default NotFound
