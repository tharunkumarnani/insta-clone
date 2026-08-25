import {Component} from 'react'
import {Link, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Slider from 'react-slick'
import {BsHeart} from 'react-icons/bs'
import {FcLike} from 'react-icons/fc'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'

import './index.css'
import Header from '../Header'

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 8,
  slidesToScroll: 1,
}

const FailureView = props => {
  const {onRetry} = props

  return (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/insta-share/failure-view.png"
        alt="failure view"
        className="failure-image"
      />

      <p>Something went wrong. Please try again</p>

      <button type="button" onClick={onRetry} className="try-again-button">
        Try again
      </button>
    </div>
  )
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
    updateLikeStatus(postId)
  }

  const likeReactionButton = likeStatus ? (
    <button
      className="likeStatusBtn"
      type="button"
      onClick={onClickLike}
      testid="unLikeIcon"
    >
      <FcLike className="likeStyleIcon" />
    </button>
  ) : (
    <button
      className="likeStatusBtn"
      type="button"
      onClick={onClickLike}
      testid="likeIcon"
    >
      <BsHeart className="likeStyleIcon" />
    </button>
  )

  return (
    <li className="user-post-item">
      <div className="user-pic-name">
        <img src={profileUrl} alt="post author profile" className="profile" />

        <Link to={`/users/${userId}`}>
          <p className="username-post">{userName}</p>
        </Link>
      </div>

      <img alt="post" src={postImageUrl} className="user-post-img" />

      <div className="post-info">
        <div className="user-reactions">
          {likeReactionButton}

          <FaRegComment />

          <BiShareAlt />
        </div>

        <p>{likesCount} Likes</p>

        <p className="caption">{postCaption}</p>

        <div className="comments-cont">
          {comments.map(eachComment => (
            <div key={`${eachComment.user_name}-${eachComment.comment}`}>
              <span className="comment-user-name">{eachComment.user_name}</span>

              <p className="user-comment">{eachComment.comment}</p>
            </div>
          ))}
        </div>

        <p className="posted-time">{createdAt}</p>
      </div>
    </li>
  )
}

class HomeRoute extends Component {
  state = {
    posts: [],
    stories: [],
    userStoriesApiStatus: 'initial',
    postsApiStatus: 'initial',
  }

  componentDidMount() {
    this.getUserStories()
    this.getPosts()
  }

  getApiOptions = () => {
    const jwtToken = Cookies.get('jwt_token')

    return {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    }
  }

  getUserStories = async () => {
    this.setState({
      userStoriesApiStatus: 'loading',
    })

    const storiesUrl = 'https://apis.ccbp.in/insta-share/stories'

    try {
      const response = await fetch(storiesUrl, this.getApiOptions())

      if (!response.ok) {
        throw new Error('Stories API failed')
      }

      const data = await response.json()

      const updatedStories = data.users_stories.map(eachStory => ({
        storyUrl: eachStory.story_url,
        userId: eachStory.user_id,
        userName: eachStory.user_name,
      }))

      this.setState({
        stories: updatedStories,
        userStoriesApiStatus: 'success',
      })
    } catch (error) {
      this.setState({
        userStoriesApiStatus: 'failure',
      })
    }
  }

  getPosts = async () => {
    this.setState({
      postsApiStatus: 'loading',
    })

    const postsUrl = 'https://apis.ccbp.in/insta-share/posts'

    try {
      const response = await fetch(postsUrl, this.getApiOptions())

      if (!response.ok) {
        throw new Error('Posts API failed')
      }

      const data = await response.json()

      const updatedPosts = data.posts.map(eachPost => ({
        comments: eachPost.comments,
        createdAt: eachPost.created_at,
        likesCount: eachPost.likes_count,
        postCaption: eachPost.post_details.caption,
        postImageUrl: eachPost.post_details.image_url,
        profileUrl: eachPost.profile_pic,
        userName: eachPost.user_name,
        userId: eachPost.user_id,
        postId: eachPost.post_id,
        likeStatus: eachPost.like_status,
      }))

      this.setState({
        posts: updatedPosts,
        postsApiStatus: 'success',
      })
    } catch (error) {
      this.setState({
        postsApiStatus: 'failure',
      })
    }
  }

  renderStories = () => {
    const {stories, userStoriesApiStatus} = this.state

    if (
      userStoriesApiStatus === 'initial' ||
      userStoriesApiStatus === 'loading'
    ) {
      return (
        <div className="stories-loader" testid="loader">
          <Loader type="ThreeDots" color="#262626" height={30} width={30} />
        </div>
      )
    }

    if (userStoriesApiStatus === 'failure') {
      return <FailureView onRetry={this.getUserStories} />
    }

    return (
      <ul className="stories-list">
        <Slider {...settings}>
          {stories.map(eachStory => (
            <li className="slick-item" key={eachStory.userId}>
              <Link to={`/users/${eachStory.userId}`} className="link-style">
                <img
                  className="story-image"
                  src={eachStory.storyUrl}
                  alt="user story"
                />

                <p className="story-username">{eachStory.userName}</p>
              </Link>
            </li>
          ))}
        </Slider>
      </ul>
    )
  }

  renderPosts = () => {
    const {posts, postsApiStatus} = this.state

    if (postsApiStatus === 'initial' || postsApiStatus === 'loading') {
      return (
        <div className="stories-loader" testid="loader">
          <Loader type="ThreeDots" color="#262626" height={30} width={30} />
        </div>
      )
    }

    if (postsApiStatus === 'failure') {
      return <FailureView onRetry={this.getPosts} />
    }

    return (
      <>
        <ul className="user-post-container-home">
          {posts.map(eachPost => (
            <UserPostRender
              key={eachPost.postId}
              postDetails={eachPost}
              updateLikeStatus={this.updateLikeStatus}
            />
          ))}
        </ul>
      </>
    )
  }

  updateLikeStatus = async postId => {
    const {posts} = this.state

    const selectedPost = posts.find(eachPost => eachPost.postId === postId)

    if (selectedPost === undefined) {
      return
    }

    const newLikeStatus = !selectedPost.likeStatus

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        like_status: newLikeStatus,
      }),
    }

    const likeStatusUrl = `https://apis.ccbp.in/insta-share/posts/${postId}/like`

    try {
      const response = await fetch(likeStatusUrl, options)

      if (!response.ok) {
        return
      }

      const updatedPosts = posts.map(eachPost => {
        if (eachPost.postId === postId) {
          return {
            ...eachPost,
            likeStatus: newLikeStatus,
            likesCount: newLikeStatus
              ? eachPost.likesCount + 1
              : eachPost.likesCount - 1,
          }
        }

        return eachPost
      })

      this.setState({
        posts: updatedPosts,
      })
    } catch (error) {
      // Keep existing UI state when request fails
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }

    return (
      <div className="home-cont">
        <Header />

        <div className="stories-container">
          <div className="slick-container">{this.renderStories()}</div>
        </div>

        <div>{this.renderPosts()}</div>
      </div>
    )
  }
}

export default HomeRoute
