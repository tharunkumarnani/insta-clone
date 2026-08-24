import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'
import Loader from 'react-loader-spinner'

import './index.css'
import Header from '../Header'

class MyProfileRoute extends Component {
  state = {
    userProfileData: {},
    stories: [],
    posts: [],
    isLoading: true,
    isFailure: false,
  }

  componentDidMount() {
    this.getMyProfileData()
  }

  getMyProfileData = async () => {
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

    const userProfileUrl = 'https://apis.ccbp.in/insta-share/my-profile'

    try {
      const response = await fetch(userProfileUrl, options)

      if (response.ok) {
        const data = await response.json()

        const {profile} = data

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
        onClick={this.getMyProfileData}
      >
        Try again
      </button>
    </div>
  )

  renderProfileData = () => {
    const {userProfileData, stories, posts} = this.state

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
      <>
        <div className="user-profile-card">
          <div className="profile-card">
            <img alt="my profile" src={profilePic} className="user-profile" />

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
                <img className="story" src={eachStory.image} alt="my story" />
              </li>
            ))}
          </ul>

          <div className="posts-card">
            <BsGrid3X3 className="post-icon" />
            <h1>Posts</h1>
          </div>

          {posts.length > 0 ? (
            <ul className="posts-cont">
              {posts.map(eachPost => (
                <li className="post-item" key={eachPost.id}>
                  <img className="post" src={eachPost.image} alt="my post" />
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-posts-container">
              <BiCamera className="camera-icon" />
              <h1>No Posts</h1>
            </div>
          )}
        </div>
      </>
    )
  }

  render() {
    const {isLoading, isFailure} = this.state

    return (
      <div className="user-profile-route">
        <Header />

        {isLoading && this.renderLoader()}

        {!isLoading && isFailure && this.renderFailureView()}

        {!isLoading && !isFailure && this.renderProfileData()}
      </div>
    )
  }
}

export default MyProfileRoute
