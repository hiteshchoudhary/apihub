import PostForm from "@/components/forms/PostForm"
import Loader from "@/components/shared/Loader";
import { useGetPostById } from "@/lib/react-query/queriesAndMutation";
import { Link, useParams } from "react-router-dom"

const UpdatePost = () => {
  const { id } = useParams();
  const { data: post, isPending: isLoading } = useGetPostById(id || '');

  if (isLoading) return (
    <div className="flex flex-1 justify-center items-center w-full h-full">
      <Loader />
    </div>
  )

  return (
    <div className="flex flex-1">
      <div className="common-container ">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <Link to={'/'}>
            <img
              width={30}
              src="/assets/icons/arrow.svg"
              alt="back-btn" />
          </Link>
          <h1 className="h3-bold md:h2-bold text-left w-full">
            Edit Post
          </h1>
        </div>

        {isLoading ? <Loader /> : <PostForm action="Update" post={post} />}
      </div>
    </div>
  )
}

export default UpdatePost