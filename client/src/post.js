import {Link} from "react-router-dom";
import {format} from "date-fns";

export default function Post({_id, title, summary, cover, content, createdAt, author}){
    
    return(
        <div className="post">
        <div class="image">
            <Link to={`/post/${_id}`}>
            <img src={'http://localhost:4000/'+cover} alt="" />
            </Link>
        </div>
        <div className="text">
        <Link to={`/post/${_id}`}>
        <h2>{title}</h2>
        </Link>
        <p class="info">
          <a class="author">{author.username}</a>
          <time>{format(new Date(createdAt), 'd MMM, yyyy HH:mm')}</time>
        </p>
        <p className="summary">{summary}</p>
        </div>
      </div>
    );
}