import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsGrid3X3} from 'react-icons/bs'
import './index.css'

class MyProfileRoute extends Component {
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
    const userProfileUrl = `https://apis.ccbp.in/insta-share/my-profile`
    const res = await fetch(userProfileUrl, options)
    const data = await res.json()
    console.log(data)
    const updatedData = {
      id: data.profile.id,
      followersCount: data.profile.followers_count,
      followingCount: data.profile.following_count,
      userBio: data.profile.user_bio,
      userId: data.profile.user_id,
      userName: data.profile.user_name,
      profilePic: data.profile.profile_pic,
      postsCount: data.profile.posts_count,
    }
    console.log(updatedData)
    this.setState({
      userProfileData: updatedData,
      stories: data.profile.stories,
      posts: data.profile.posts,
    })
  }

  render() {
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
    console.log(stories, 's')
    console.log('p', posts)
    return (
      <div className="user-profile-route">
        <div className="user-profile-card">
          <div className="profile-card">
            <img alt="my profile" src={profilePic} className="user-profile" />
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
                <img className="story" alt="my story" src={each.image} />
              </li>
            ))}
          </ul>

          <div className="posts-card">
            <BsGrid3X3 className="post-icon" />
            <p>Posts</p>
          </div>
          <ul className="posts-cont">
            {posts.map(each => (
              <li className="post-item" key={each.id}>
                <img className="post" alt="my post" src={each.image} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default MyProfileRoute
