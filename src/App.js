import {Switch, Route, Redirect} from 'react-router-dom'
import {Component} from 'react'
import './App.css'
import LoginRoute from './components/LoginRoute'
import HomeRoute from './components/HomeRoute'
import UserProfileRoute from './components/UserProfileRoute'
import SearchRoute from './components/SearchRoute'
import MyProfileRoute from './components/MyProfileRoute'
import Context from './context/Context'
import Header from './components/Header'
import NotFound from './components/NotFound'

class App extends Component {
  state = {search: ''}

  onUpdateSearch = key => {
    this.setState({search: key})
  }

  render() {
    const {search} = this.state
    return (
      <Context.Provider value={{search, updateSearch: this.onUpdateSearch}}>
        <>
          <Header />
          <Switch>
            <Route exact path="/" component={HomeRoute} />
            <Route path="/login" component={LoginRoute} />
            <Route path="/posts" component={SearchRoute} searchKey={search} />
            <Route path="/users/:id" component={UserProfileRoute} />
            <Route path="/my-profile" component={MyProfileRoute} />
            <Route path="/not-found" component={NotFound} />
            <Redirect to="/not-found" />
          </Switch>
        </>
      </Context.Provider>
    )
  }
}

export default App
