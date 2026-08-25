import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsHeart} from 'react-icons/bs'
import {BiShareAlt} from 'react-icons/bi'
import {FaRegComment} from 'react-icons/fa'

import Context from '../../context/Context'
import Header from '../Header'
import './index.css'

const processStatus = {
  initial: 'INITIAL',
  processing: 'LOADING',
  onSuccess: 'SUCCESS',
  onFailure: 'FAILURE',
  onEmpty: 'EMPTY',
}

const UserPostRender = props => {
  const {postDetails} = props

  const {
    likesCount,
    createdAt,
    profileUrl,
    postImageUrl,
    postCaption,
    userName,
    comments,
    userId,
  } = postDetails

  return (
    <li className="user-post-item">
      <div className="user-pic-name">
        <div className="user-pic-story">
          <img src={profileUrl} alt="post author profile" className="profile" />
        </div>

        <Link to={`/users/${userId}`}>
          <p className="username">{userName}</p>
        </Link>
      </div>

      <img alt="post" src={postImageUrl} className="user-post-img" />

      <div className="post-info">
        <div className="user-reactions">
          <button type="button" className="search-like-button">
            <BsHeart className="reaction-icon" data-testid="likeIcon" />
          </button>

          <FaRegComment className="reaction-icon" />

          <BiShareAlt className="reaction-icon" />
        </div>

        <p className="like">{likesCount} Likes</p>

        <p className="caption">{postCaption}</p>

        <div className="comments-cont">
          {comments.map(eachComment => (
            <div key={`${eachComment.user_name}-${eachComment.comment}`}>
              <span>{eachComment.user_name}</span>

              <p className="user-comment">{eachComment.comment}</p>
            </div>
          ))}
        </div>

        <p className="posted-time">{createdAt}</p>
      </div>
    </li>
  )
}

class SearchRoute extends Component {
  state = {
    posts: [],
    userSearch: '',
    status: processStatus.initial,
  }

  componentDidMount() {
    this.onRenderPosts()
  }

  getSearchValue = () => {
    const {location} = this.props

    const searchParams = new URLSearchParams(location.search)

    return searchParams.get('search') || ''
  }

  onRenderPosts = async () => {
    this.setState({
      status: processStatus.processing,
    })

    const searched = this.getSearchValue()

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    }

    const postsUrl = `https://apis.ccbp.in/insta-share/posts?search=${searched}`

    try {
      const response = await fetch(postsUrl, options)

      if (!response.ok) {
        this.setState({
          status: processStatus.onFailure,
        })

        return
      }

      const data = await response.json()

      if (data.posts.length === 0) {
        this.setState({
          posts: [],
          userSearch: searched,
          status: processStatus.onEmpty,
        })

        return
      }

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
      }))

      this.setState({
        posts: updatedData,
        userSearch: searched,
        status: processStatus.onSuccess,
      })
    } catch (error) {
      this.setState({
        status: processStatus.onFailure,
      })
    }
  }

  onSuccessView = () => {
    const {posts} = this.state

    return (
      <div>
        <h1 className="search-heading">Search Results</h1>

        <ul className="user-post-container-search">
          {posts.map(each => (
            <UserPostRender postDetails={each} key={each.postId} />
          ))}
        </ul>
      </div>
    )
  }

  onLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#262626" height={50} width={50} />
    </div>
  )

  onEmptyView = () => (
    <div className="empty-search-cont">
      <div className="empty-search-card">
        <img
          className="search-not-found-img"
          alt="search not found"
          src="https://res.cloudinary.com/dcbox8yto/image/upload/v1783339917/Group_vl6led.png"
        />

        <h1 className="search-not-found">Search Not Found</h1>

        <p className="search-not-found-des">
          Try different keyword or search again
        </p>
      </div>
    </div>
  )

  onFailureView = () => (
    <div className="empty-search-cont">
      <div className="empty-search-card">
        <img
          className="search-not-found-img"
          alt="failure view"
          src="https://assets.ccbp.in/frontend/react-js/insta-share/failure-view.png"
        />

        <p className="search-not-found-des">
          Something went wrong. Please try again
        </p>

        <button
          onClick={this.onRenderPosts}
          className="try-again"
          type="button"
        >
          Try again
        </button>
      </div>
    </div>
  )

  renderSearchResult = () => {
    const {status} = this.state

    switch (status) {
      case processStatus.processing:
        return this.onLoadingView()

      case processStatus.onSuccess:
        return this.onSuccessView()

      case processStatus.onFailure:
        return this.onFailureView()

      case processStatus.onEmpty:
        return this.onEmptyView()

      default:
        return null
    }
  }

  render() {
    return (
      <Context.Consumer>
        {value => (
          <div className="page-card">
            <Header />

            <div className="search-results-container">
              {this.renderSearchResult()}
            </div>
          </div>
        )}
      </Context.Consumer>
    )
  }
}

export default withRouter(SearchRoute)
