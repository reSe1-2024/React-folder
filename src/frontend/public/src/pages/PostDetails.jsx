import { useNavigate, useParams } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import Comment from "../components/Comment"
import {BiEdit} from 'react-icons/bi'
import {MdDelete} from 'react-icons/md'
import LikeButton from "../components/Likes"
import wallpaper from "../../public/wallpaperflare.com_wallpaper.jpg"
import Header from "../components/Header"

import { UserContext } from "../context/UserContext"
import axios from "axios"
import { URL } from "../../url"

const PostDetails = () => {

  const postId=useParams().id
  const [post,setPost]=useState({})
  const {user}=useContext(UserContext)
  const [comments,setComments]=useState([])
  const [comment,setComment]=useState("")
  const navigate=useNavigate()
  

  const fetchPost=async()=>{
    try{
      const res= await axios.get(URL+"/api/posts/"+postId)
      
      setPost(res.data)
    }
    catch(err){
      console.log(err)
    }
    
  }

  const handleDeletePost=async ()=>{

    try{
      const res=await axios.delete(URL+"/api/posts/"+postId,{withCredentials:true})
      console.log(res.data)
      navigate("/")

    }
    catch(err){
      console.log(err)
    }

  }

  useEffect(()=>{
    fetchPost()

  },[postId])

  const fetchPostComments=async()=>{
   
    try{
      const res=await axios.get(URL+"/api/comments/post/"+postId)
      setComments(res.data)
     

    }
    catch(err){
     
      console.log(err)
    }
  }

  useEffect(()=>{
    fetchPostComments()

  },[postId])

  const postComment=async(e)=>{
    e.preventDefault()
    try{
      const res=await axios.post(URL+"/api/comments/create",
      {comment:comment,author:user.username,postId:postId,userId:user._id},
      {withCredentials:true})
      
      // fetchPostComments()
      // setComment("")
      window.location.reload(true)

    }
    catch(err){
         console.log(err)
    }

  }

  
  return (
    <div>
      <Header/>
        
      <div className="px-8 md:px-[200px] mt-8">
        <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-black md:text-3xl">{post.title}</h1>
         <div className="flex items-center justify-center space-x-2">
            <p className="cursor-pointer" onClick={()=>navigate("/edit/"+postId)} ><BiEdit/></p>
            <p className="cursor-pointer" onClick={handleDeletePost}><MdDelete/></p>
         </div>
        </div>
        <div className="flex items-center justify-between mt-2 md:mt-4">
        <p>@{post.username}</p>       
        </div>
        <img src={post.photo} className="w-full  mx-auto mt-8" alt=""/>
         <p className="mx-auto mt-8">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eius delectus, atque accusamus itaque cupiditate non esse ex rerum illum impedit optio quo, qui voluptates ullam nesciunt, consequatur amet error. Delectus.</p>
         <div className="flex items-center mt-8">
          <LikeButton />
        </div>
        
         <div className="flex items-center mt-8 space-x-4 font-semibold">
          <p>Categories:</p>
          <div className="flex justify-center items-center space-x-2">          
          {post.categories?.map((c,i)=>(
            <>
            <div key={i} className="bg-gray-300 rounded-lg px-3 py-1">{c}</div>
            </>
            
          ))}
          </div>
         </div>
         <div className="flex flex-col mt-4">
         <h3 className="mt-6 mb-4 font-semibold">Comments:</h3>
         {comments?.map((c)=>(
          <Comment key={c._id} c={c} post={post} />
         ))}
           
         </div>
         {/* write a comment */}
         <div className="w-full flex flex-col mt-4 md:flex-row">
          <input onChange={(e)=>setComment(e.target.value)} type="text" placeholder="Write a comment" className="md:w-[80%] outline-none py-2 px-4 mt-4 md:mt-0"/>
          <button onClick={postComment} className="bg-black text-sm text-white px-2 py-2 md:w-[20%] mt-4 md:mt-0">Add Comment</button>
         </div>              
        </div>
        
    </div>
  )
}

export default PostDetails