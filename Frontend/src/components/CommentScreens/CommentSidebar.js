import { useState, useEffect, useRef, useCallback } from 'react';
import StoryComments from './StoryComments';
import axios from 'axios';
import AddComment from './AddComment';

const CommentSidebar = ({ slug, sidebarShowStatus, setSidebarShowStatus, activeUser }) => {

  const [count, setCount] = useState(0)
  const [commentlist, setCommentList] = useState([])

  const sidebarRef = useRef(null);

const getStoryComments = useCallback(async () => {
  try {
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/comment/${slug}/getAllComment`)
    setCommentList(data.data)
    setCount(data.count)
  }
  catch (error) {
    console.log(error.response?.data?.error);
  }
}, [slug]);

useEffect(() => {
  getStoryComments()
}, [getStoryComments]);


  useEffect(() => {
    const checkIfClickedOutside = e => {

      if (sidebarShowStatus && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarShowStatus(false)
      }
    }
    document.addEventListener("mousedown", checkIfClickedOutside)
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside)
    }
  }, [sidebarShowStatus, setSidebarShowStatus])



  return (

    <div ref={sidebarRef} className={sidebarShowStatus ? "Inclusive-comment-sidebar visible" : "Inclusive-comment-sidebar hidden "}  >

      <div className='sidebar-wrapper'>

        <AddComment setSidebarShowStatus={setSidebarShowStatus} slug={slug} getStoryComments={getStoryComments} activeUser={activeUser} count={count} />

        <StoryComments commentlist={commentlist} activeUser={activeUser} count={count} />
      </div>

    </div>

  )
}

export default CommentSidebar;
