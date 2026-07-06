import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsGrid3X3} from 'react-icons/bs'
import {FaCamera} from 'react-icons/fa'

import './index.css'

class UserProfileRoute extends Component {
  state = {userProfileData: {}, stories: [], posts: []}

  componentDidMount() {
    this.onRenderPosts()
  }

  onRenderPosts = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'Application/Json',
      },
    }
    const {match} = this.props
    const {id} = match.params
    const userId = id
    const userProfileUrl = `https://apis.ccbp.in/insta-share/users/${userId}`
    const res = await fetch(userProfileUrl, options)
    const data = await res.json()
    const updatedData = {
      id: data.user_details.id,
      followersCount: data.user_details.followers_count,
      followingCount: data.user_details.following_count,
      userBio: data.user_details.user_bio,
      userId: data.user_details.user_id,
      userName: data.user_details.user_name,
      profilePic: data.user_details.profile_pic,

      postsCount: data.user_details.posts_count,
    }
    this.setState({
      userProfileData: updatedData,
      stories: data.user_details.stories,
      posts: data.user_details.posts,
    })
  }

  renderUserPosts = () => {
    const {posts} = this.state

    if (posts.length === 0) {
      return (
        <li className="no-user-posts">
          <div className="cam-cont">
            <FaCamera className="camera-icon" />
          </div>
          <p className="no-posts">No Posts Yet</p>
        </li>
      )
    }
    return (
      <>
        {posts.map(each => (
          <li className="post-item" key={each.id}>
            <img className="post" alt="post" src={each.image} />
          </li>
        ))}
      </>
    )
  }

  render() {
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
      <div className="user-profile-route">
        <div className="user-profile-card">
          <div className="profile-card">
            <img alt="user profile" src={profilePic} className="user-profile" />
            <div className="profile-info-card">
              <p className="username">{userName}</p>
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
            {stories.map(each => (
              <li className="story-item" key={each.id}>
                <img className="story" alt="story" src={each.image} />
              </li>
            ))}
          </ul>

          <div className="posts-card">
            <BsGrid3X3 className="post-icon" />
            <p>Posts</p>
          </div>
          <ul className="posts-cont">{this.renderUserPosts()}</ul>
        </div>
      </div>
    )
  }
}

export default UserProfileRoute
