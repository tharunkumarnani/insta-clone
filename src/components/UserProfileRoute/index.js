import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'
import Loader from 'react-loader-spinner'

import './index.css'
import Header from '../Header'

class UserProfileRoute extends Component {
  state = {
    userProfileData: {},
    stories: [],
    posts: [],
    isLoading: true,
    isFailure: false,
  }

  componentDidMount() {
    this.getUserProfileData()
  }

  getUserProfileData = async () => {
    this.setState({
      isLoading: true,
      isFailure: false,
    })

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    }

    const {match} = this.props
    const {id} = match.params

    const userProfileUrl = `https://apis.ccbp.in/insta-share/users/${id}`

    try {
      const response = await fetch(userProfileUrl, options)

      if (response.ok) {
        const data = await response.json()

        const profile = data.user_details

        const updatedData = {
          id: profile.id,
          followersCount: profile.followers_count,
          followingCount: profile.following_count,
          userBio: profile.user_bio,
          userId: profile.user_id,
          userName: profile.user_name,
          profilePic: profile.profile_pic,
          postsCount: profile.posts_count,
        }

        this.setState({
          userProfileData: updatedData,
          stories: profile.stories,
          posts: profile.posts,
          isLoading: false,
          isFailure: false,
        })
      } else {
        this.setState({
          isLoading: false,
          isFailure: true,
        })
      }
    } catch (error) {
      this.setState({
        isLoading: false,
        isFailure: true,
      })
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/insta-share/failure-view.png"
        alt="failure view"
        className="failure-image"
      />

      <p className="failure-description">
        Something went wrong. Please try again
      </p>

      <button
        type="button"
        className="try-again-button"
        onClick={this.getUserProfileData}
      >
        Try again
      </button>
    </div>
  )

  renderUserPosts = () => {
    const {posts} = this.state

    if (posts.length === 0) {
      return (
        <li className="no-user-posts">
          <div className="cam-cont">
            <BiCamera className="camera-icon" />
          </div>
          <h1 className="no-posts">No Posts</h1>
        </li>
      )
    }

    return posts.map(eachPost => (
      <li className="post-item" key={eachPost.id}>
        <img className="post" alt="user post" src={eachPost.image} />
      </li>
    ))
  }

  renderUserProfile = () => {
    const {userProfileData, stories} = this.state

    const {
      profilePic,
      userName,
      followersCount,
      followingCount,
      userId,
      postsCount,
      userBio,
    } = userProfileData

    return (
      <div className="user-profile-card">
        <div className="profile-card">
          <img alt="user profile" src={profilePic} className="user-profile" />

          <div className="profile-info-card">
            <h1 className="username">{userName}</h1>

            <div className="posts-followers">
              <p>
                {postsCount} <span>posts</span>
              </p>

              <p>
                {followersCount} <span>followers</span>
              </p>

              <p>
                {followingCount} <span>following</span>
              </p>
            </div>

            <p className="user-id">{userId}</p>

            <p className="user-bio">{userBio}</p>
          </div>
        </div>

        <ul className="stories-cont">
          {stories.map(eachStory => (
            <li className="story-item" key={eachStory.id}>
              <img className="story" alt="user story" src={eachStory.image} />
            </li>
          ))}
        </ul>

        <div className="posts-card">
          <BsGrid3X3 className="post-icon" />
          <h1>Posts</h1>
        </div>

        <ul className="posts-cont">{this.renderUserPosts()}</ul>
      </div>
    )
  }

  render() {
    const {isLoading, isFailure} = this.state

    return (
      <div className="user-profile-route">
        <Header />

        {isLoading && this.renderLoader()}

        {!isLoading && isFailure && this.renderFailureView()}

        {!isLoading && !isFailure && this.renderUserProfile()}
      </div>
    )
  }
}

export default UserProfileRoute
