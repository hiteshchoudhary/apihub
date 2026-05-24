import PostForm from "@/components/forms/PostForm"
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();
  return (
    <div className="common-container p-3">
      <div className="max-w-5xl flex-start gap-3 justify-start w-full">
        <button onClick={() => navigate(-1)}>
          <img
            width={30}
            src="/assets/icons/arrow.svg"
            alt="back-btn"
          />
        </button>
        <h1 className="h3-bold md:h2-bold text-left w-full">
          Create new post
        </h1>
      </div>
      <PostForm
        action='Create'
      />
    </div>
  )
}

export default CreatePost