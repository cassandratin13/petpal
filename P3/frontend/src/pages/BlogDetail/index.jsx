import React, {useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./style.css";
import Animals from "../../assets/images/sign-up-animals.jpg";

function format_date(dateString) {
    const dateObject = new Date(dateString);

    const options = { month: 'short', day: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric' };
    const formattedDate = dateObject.toLocaleString('en-US', options);

    return formattedDate;
};

const add_breaks = (text) => {
  if (typeof text !== 'string') {
    return;
  }
  return text.split('\n').map((line, index) => {
      return (
          <React.Fragment key={index}>
              {line}
              <br />
          </React.Fragment>
      )
      
  })
};

const BlogDetail = () => {
  const {blogId} = useParams();
  const [blog, setBlog] = useState({});
  const [author, setAuthor] = useState('');
  const [like, setLike] = useState(false);
  const userType = localStorage.getItem('user_type');
  let navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const fetchBlog = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/blogs/${blogId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          navigate("/404");
          window.history.replaceState(
            null,
            null,
            `/blog-view/${blogId}`
          );
          return;
        }

        const data = await response.json();
        setBlog(data);
        
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchBlog();
  }, [blogId]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const fetchLikes = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/blogs/likes/${blogId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          navigate("/404");
          window.history.replaceState(
            null,
            null,
            `/blog-view/${blogId}`
          );
          return;
        }

        const data = await response.json();
        setLike(data.exists);
        
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchLikes();
  }, [blogId]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!blog.author) {
      return;
    }
    const fetchBlog = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/accounts/profile/${blog.author}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          console.log("RESPONSE", response);
          navigate("/404");
          window.history.replaceState(
            null,
            null,
            `/blog-view/${blogId}`
          );
          return;
        }

        const data = await response.json();
        setAuthor(data.name);
        
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchBlog();
  }, [blog]);

  const handleViewShelter = () => {
    navigate(`/shelter/${blog.author}/${author}`);
  };

  const handleSeeMore = () => {
    navigate(`/blogs/`);
  };

  // const handleLike = () => {
  //   if (like) {

  //   } else {

  //   }
  // }

  console.log(blog);

    return (
      <div id="blog-page">
        <h1 id="blog-title">{blog.title}</h1>
        <img id="blog-image" src={blog.banner_image} />
        <h2 id="blog-author">Author: {author}</h2>
        <h3 id="blog-last-updated">Last updated: {format_date(blog.updated_at)}</h3>
        <p id="blog-content">{add_breaks(blog.content)}</p>
        <div className="blog-btn-container">
          <button className="blog-button" onClick={handleViewShelter}>View shelter</button>
          <button className="blog-button" onClick={handleSeeMore}>See more blogs</button>
        </div>
        
      </div>
    )
  };
  
  export default BlogDetail;