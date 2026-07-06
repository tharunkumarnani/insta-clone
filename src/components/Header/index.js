import {useState} from 'react'
import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {FaSearch} from 'react-icons/fa'
import './index.css'
import Context from '../../context/Context'

const Header = props => {
  const [userSearch, setUserSearch] = useState('')
  const updateUserSearch = e => {
    setUserSearch(e.target.value)
  }

  const requestLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    const {replace} = history
    replace('/login')
  }

  return (
    <Context.Consumer>
      {value => {
        const {updateSearch} = value
        const triggerUpdateBtn = () => {
          updateSearch(userSearch)
        }

        return (
          <nav className="nav-bar">
            <div className="navbar-card">
              <div className="logo-name">
                <Link to="/">
                  <img
                    alt="website logo"
                    className="nav-logo"
                    src="https://res.cloudinary.com/dcbox8yto/image/upload/v1766593471/instaShare/logo_aixmqo.png"
                  />
                </Link>
                <h3>Insta Share</h3>
              </div>
              <ul className="nav-options-card">
                <li className="search-card">
                  <input
                    value={userSearch}
                    onChange={updateUserSearch}
                    className="search"
                    type="search"
                    placeholder="Search Caption"
                  />
                  <button
                    onClick={triggerUpdateBtn}
                    className="search-btn"
                    type="button"
                  >
                    <Link
                      to={`/posts?search=${userSearch}`}
                      keySearch={userSearch}
                    >
                      <button type="button" testid="searchIcon">
                        <FaSearch className="search-icon" />
                      </button>
                    </Link>
                  </button>
                </li>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/my-profile">Profile</Link>
                </li>
                <li>
                  <button
                    onClick={requestLogout}
                    type="button"
                    className="logout-btn"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        )
      }}
    </Context.Consumer>
  )
}

export default withRouter(Header)
