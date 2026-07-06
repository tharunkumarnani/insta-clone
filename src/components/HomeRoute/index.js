import {Component} from 'react'
import {Link, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './index.css'
import {BsHeart} from 'react-icons/bs'
import {FcLike} from 'react-icons/fc'

import {FaRegComment} from 'react-icons/fa'
import {MdShare} from 'react-icons/md'

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 8,
  slidesToScroll: 1,
}

const UserPostRender = props => {
  const {postDetails, updateLikeStatus} = props
  const {
    likesCount,
    createdAt,
    profileUrl,
    postImageUrl,
    postCaption,
    userName,
    comments,
    userId,
    postId,
    likeStatus,
  } = postDetails
  const onClickLike = () => {
    console.log('inner', postId)
    updateLikeStatus(postId)
  }
  const likeReactionButton = likeStatus ? (
    <button className="likeStatusBtn" type="button" onClick={onClickLike}>
      <FcLike className="likeStyleIcon" />
    </button>
  ) : (
    <button className="likeStatusBtn" type="button" onClick={onClickLike}>
      <BsHeart className="likeStyleIcon" />
    </button>
  )
  return (
    <li className="user-post-item">
      <Link className="user-pic-name" to={`/user-profile/${userId}`}>
        <img src={profileUrl} alt="profile" className="profile" />
        <p className="username-post">{userName}</p>
      </Link>
      <img alt="post pic" src={postImageUrl} className="user-post-img" />
      <div className="post-info">
        <div className="user-reactions">
          {likeReactionButton}

          <FaRegComment />
          <MdShare />
        </div>
        <p>{likesCount} Likes</p>
        <p className="caption">{postCaption}</p>
        <div className="comments-cont">
          {comments.map(each => (
            <p className="user-comment">
              {each.user_name} <span className="comment">{each.comment}</span>
            </p>
          ))}
        </div>
        <p className="posted-time">{createdAt}</p>
      </div>
    </li>
  )
}

class HomeRoute extends Component {
  state = {posts: [], stories: []}

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
    const storiesUrl = 'https://apis.ccbp.in/insta-share/stories'
    const res1 = await fetch(storiesUrl, options)
    const data1 = await res1.json()
    const updateStoriesDetails = data1.users_stories.map(each => ({
      storyUrl: each.story_url,
      userId: each.user_id,
      userName: each.user_name,
    }))
    const postsUrl = 'https://apis.ccbp.in/insta-share/posts'
    const res = await fetch(postsUrl, options)
    const data = await res.json()

    console.log('posts', data.posts)
    const updatedData = data.posts.map(each => ({
      comments: each.comments,
      createdAt: each.created_at,
      likesCount: each.likes_count,
      postCaption: each.post_details.caption,
      postImageUrl: each.post_details.image_url,
      profileUrl: each.profile_pic,
      userName: each.user_name,
      userId: each.user_id,
      postId: each.post_id,
      likeStatus: false,
    }))
    this.setState({posts: updatedData, stories: updateStoriesDetails})
  }

  renderSlider = () => {
    const {stories} = this.state
    if (stories.length === 0) {
      return (
        <div className="stories-loader">
          <Loader type="ThreeDots" color="#262626" height={30} width={30} />
        </div>
      )
    }

    return (
      <Slider {...settings}>
        {stories.map(eachStory => {
          const {userName, userId, storyUrl} = eachStory
          return (
            <div className="slick-item" key={userId}>
              <Link to={`/user-profile/${userId}`} className="link-style">
                <img className="story-image" src={storyUrl} alt="profile_pic" />
                <p className="story-username">{userName}</p>
              </Link>
            </div>
          )
        })}
      </Slider>
    )
  }

  updateLikeStatus = async id => {
    console.log('main ', id)
    const {posts} = this.state

    const jwtToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwicm9sZSI6IlBSSU1FX1VTRVIiLCJpYXQiOjE2MjMwNjU1MzJ9.D13s5wN3Oh59aa_qtXMo3Ec4wojOx0EZh8Xr5C5sRkU'
    const filteredPost = posts.filter(each => each.postId === id)
    console.log('main', filteredPost)
    const {likeStatus} = filteredPost

    const bodyData = {like_status: !likeStatus}
    const options = {
      method: 'post',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'Application/Json',
      },
      body: JSON.stringify(bodyData),
    }
    const likeStatusUrl = `https://apis.ccbp.in/insta-share/posts/${id}/like`
    const res3 = await fetch(likeStatusUrl, options)
    if (res3.ok) {
      const updateLikeStatusPosts = posts.map(each => {
        if (each.postId === id) {
          return {...each, likeStatus: !each.likeStatus}
        }
        return each
      })
      this.setState({posts: updateLikeStatusPosts})
    }
  }

  render() {
    const {posts} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/" />
    }
    if (posts.length === 0) {
      return (
        <div className="stories-loader">
          <Loader type="ThreeDots" color="#262626" height={30} width={30} />
        </div>
      )
    }
    return (
      <div className="home-cont">
        <div className="stories-container">
          <div className="slick-container">{this.renderSlider()}</div>
        </div>
        {posts && (
          <ul className="user-post-container-home">
            {posts.map(each => (
              <UserPostRender
                postDetails={each}
                updateLikeStatus={this.updateLikeStatus}
                key={each.postId}
              />
            ))}
          </ul>
        )}
      </div>
    )
  }
}

export default HomeRoute
