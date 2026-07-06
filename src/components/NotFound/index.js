import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
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
      <Link to="/">
        <button onClick={returnHomePage} className="home-page" type="button">
          Home Page
        </button>
      </Link>
    </div>
  </div>
)

export default NotFound
