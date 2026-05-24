import EditProfileForm from "@/components/forms/EditProfileForm";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <button onClick={() => navigate(-1)}>
            <img
              width={30}
              src="/assets/icons/arrow.svg"
              alt="back-btn"
            />
          </button>
          <h1 className="h3-bold md:h2-bold text-left w-full">
            Update Your profile
          </h1>
        </div>
        <EditProfileForm />
      </div>
    </div>
  )
}

export default UpdateProfile