import {Component} from 'react'
import {withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'
import {BsHeart} from 'react-icons/bs'
import {BiShareAlt} from 'react-icons/bi'
import {FaRegComment} from 'react-icons/fa'
import Context from '../../context/Context'

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
  } = postDetails
  return (
    <li className="user-post-item">
      <div className="user-pic-name">
        <div className="user-pic-story">
          <img src={profileUrl} alt="profile" className="profile" />
        </div>
        <p className="username">{userName}</p>
      </div>
      <img alt="post pic" src={postImageUrl} className="user-post-img" />
      <div className="post-info">
        <div className="user-reactions">
          <BsHeart className="reaction-icon" />
          <FaRegComment className="reaction-icon" />
          <BiShareAlt className="reaction-icon" />
        </div>
        <p className="like">{likesCount} Likes</p>
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

class SearchRoute extends Component {
  state = {posts: [], userSearch: '', status: processStatus.initial}

  componentDidMount() {
    this.onRenderPosts()
  }

  onRenderPosts = async () => {
    this.setState({status: processStatus.processing})
    console.log('Search Route')
    console.log('check', this.props)
    const {location} = this.props
    const {search} = location
    const searched = search.split('=')[1]

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'Application/Json',
      },
    }
    const postsUrl = `https://apis.ccbp.in/insta-share/posts?search=${searched}`
    const res = await fetch(postsUrl, options)
    if (res.ok) {
      const data = await res.json()
      console.log(data)
      if (data.posts.length !== 0) {
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
      } else {
        this.setState({status: processStatus.onEmpty})
      }
    } else {
      this.setState({status: processStatus.onFailure})
    }
  }

  onSuccessView = search => {
    const {posts, userSearch} = this.state
    console.log('by provider1', userSearch, 'local', search)
    if (search !== userSearch) {
      this.setState({userSearch: search}, this.onRenderPosts)
      //   this.onRenderPosts()
    }

    return (
      <ul className="user-post-container-search">
        {posts.map(each => (
          <UserPostRender postDetails={each} key={each.postId} />
        ))}
      </ul>
    )
  }

  onEmptyView = () => (
    <div className="empty-search-cont">
      <div className="empty-search-card">
        <img
          className="search-not-found-img"
          alt="empty"
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
          alt="Something went wrong"
          src="https://res.cloudinary.com/dcbox8yto/image/upload/v1783339917/Group_7522_f89f5u.png"
        />
        <h1 className="search-not-found">
          Something went wrong. Please try again
        </h1>
        <button
          onClick={this.onRenderPosts}
          className="try-again"
          type="button"
        >
          Try Again
        </button>
      </div>
    </div>
  )

  render() {
    const renderByStatus = search => {
      const {status} = this.state
      switch (status) {
        case 'LOADING':
          return <p>Loading</p>
        case 'SUCCESS':
          return this.onSuccessView(search)
        case 'FAILURE':
          return this.onFailureView()

        case 'EMPTY':
          return this.onEmptyView()

        default:
          return ''
      }
    }

    return (
      <Context.Consumer>
        {value => {
          const {search} = value

          return (
            <div className="page-card">
              <div>
                {search && <p className="search-heading">Search Results</p>}
                <div>{renderByStatus(search)}</div>
              </div>
            </div>
          )
        }}
      </Context.Consumer>
    )
  }
}

export default withRouter(SearchRoute)
