import { useState } from 'react'
import { IoArrowBack } from "react-icons/io5"
import { useDispatch, useSelector } from 'react-redux'
import { IoMdLogOut } from "react-icons/io"
import InputEdit from './profile/InputEdit'
import { updateUser, logoutUser as logoutUserAPI } from '../apis/auth'
import { toast } from 'react-toastify'
import { setUserNameAndBio } from '../redux/activeUserSlice'
import PropTypes from 'prop-types'
import { setShowProfile } from '../redux/profileSlice'

function Profile(props) {
  const dispatch = useDispatch()
  const {showProfile} = useSelector((state) => state.profile)
  const activeUser = useSelector((state) => state.activeUser)
  const [formData, setFormData] = useState({
    name: activeUser.name || "",
    bio: activeUser.bio || ""
  })
  const logoutUser = async () => {
    try {
      await logoutUserAPI()
      toast.success("Logout Successful!")
    } catch (error) {
      console.log("Logout error:", error)
      toast.error("Logout failed, but you've been logged out locally")
    }
  }
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  const submit = async () => {

    dispatch(setUserNameAndBio(formData))
    toast.success("Updated!")
    await updateUser(activeUser.id, formData)

  }

  return (

    <div style={{transition: showProfile ? '0.3s ease-in-out' : ""}}  className={props.className}>
      <div className='absolute  w-[100%]'>
        <div className='bg-[#166e48] pt-12 pb-3'>
          <button className='flex items-center'>
            <IoArrowBack style={{ color: "#fff", width: "30px", height: "20px" }} onClick={() => dispatch(setShowProfile(false))} />
            <h6 className='text-[16px] text-[#fff] font-semibold'>Profile</h6>
          </button>
        </div>
        <div className=' pt-5'>
          <div className='flex items-center flex-col'>
            <img className='w-[150px] h-[150px] rounded-[100%] -ml-5' src={activeUser?.profilePic} alt="" />
          </div>
          <InputEdit heading="Name" type="name" handleChange={handleChange} input={formData.name} handleSubmit={submit} />

          <div>

            <div className='py-5 px-4'>
              <p className='text-[10px] tracking-wide text-[#3b4a54] '>
                This is not your username or pin. This name will be visible to your contacts
              </p>
            </div>

          </div>
          <InputEdit heading="Bio" type="bio" handleChange={handleChange} input={formData.bio} handleSubmit={submit} />
        </div>

        <div onClick={logoutUser} className='flex items-center justify-center mt-5 cursor-pointer shadow-2xl'>
          <IoMdLogOut className='text-[#e44d4d] w-[27px] h-[23px]' />
          <h6 className='text-[17px] text-[#e44d4d] font-semibold'>Logout</h6>
        </div>
      </div>
    </div>
  )
}

Profile.propTypes = {
  className: PropTypes.string,
}

export default Profile

