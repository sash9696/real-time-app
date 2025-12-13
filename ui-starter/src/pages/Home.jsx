import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchUsers, validUser } from '../apis/auth';
import { accessCreate } from "../apis/chat.js";
import { setActiveUser } from '../redux/activeUserSlice';
import { fetchChats, setNotifications, setActiveChat } from '../redux/chatsSlice';
import { getSender } from '../utils';
import Chat from './Chat';


import { BsSearch } from 'react-icons/bs';
import { RiNotificationBadgeFill } from 'react-icons/ri';
import { BiNotification } from 'react-icons/bi';
import { IoIosArrowDown } from 'react-icons/io';
import NotificationBadge, { Effect } from 'react-notification-badge';

import './Home.css';
import Group from '../components/Group.jsx';
import Contacts from '../components/ui/Contacts.jsx';
import Profile from '../components/Profile.jsx';
import Search from '../components/Search.jsx';
import { setShowNotifications, setShowProfile } from '../redux/profileSlice.js';



//debounce 

//custom hook debounce

function Home() {
  const dispatch = useDispatch();

  const {showProfile, showNotifications} = useSelector((state) => state.profile);
  const {notifications} = useSelector((state) => state.chats);

  const { activeUser } = useSelector((state) => state);

  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");


  const searchChange = async (searchText) => {
    try {
      setIsLoading(true);
      const data  = await searchUsers(searchText);
      console.log({data})
      setSearchResults(data?.users || []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const searchText = e.target.value;
    if (!searchText) return;
    searchChange(searchText);
    setSearch(searchText);
  };


  
  const handleClick = async (user) => {
    try {
      const newChat = await accessCreate({ userId: user._id });
      dispatch(fetchChats());
      if (newChat) {
        dispatch(setActiveChat(newChat));
      }
      setSearch("");
    } catch (error) {
      console.error("Failed to create/access chat:", error);
    }
  };



  useEffect(() => {
    const isValid = async () => {
      try {
        const { user } = await validUser();
        if (user) {
          dispatch(setActiveUser({
            id: user?._id,
            email: user?.email,
            profilePic: user?.profilePic,
            bio: user?.bio,
            name: user?.name
          }));
        }
      } catch (error) {
        console.error("User validation failed:", error);
      }
    };

    isValid();
  }, [dispatch]);

  return (
    <div className="bg-[#282C35!] scrollbar-hide z-10 h-[110vh] lg:w-[90%] lg:mx-auto overflow-y-hidden shadow-2xl">
      <div className='flex'>
        {!showProfile ? (
          <div className="md:flex md:flex-col min-w-[360px] h-[100vh] bg-[#ffff] relative">
            <div className='h-[61px] px-4'>
              <div className='flex'>
                <a className='flex items-center relative -top-4 block h-[90px]' href='/'>
                  <h3 className='text-[20px] text-[#1f2228] font-extrabold tracking-wider'>Messages</h3>
                </a>
              </div>

              <div className='absolute top-4 right-5 flex items-center gap-x-3'>
                <button onClick={() => dispatch(setShowNotifications(!showNotifications))}>
                  <NotificationBadge
                    count={notifications.length}
                    effect={Effect.SCALE}
                    style={{ width: "15px", height: "15px", fontSize: "9px", padding: "4px 2px 2px 2px" }}
                  />
                  {showNotifications
                    ? <RiNotificationBadgeFill className="text-[#319268] w-[25px] h-[25px]" />
                    : <BiNotification className="text-[#319268] w-[25px] h-[25px]" />}
                </button>

                <div className={`${showNotifications ? "overflow-y-scroll scrollbar-hide tracking-wide absolute top-10 -left-32 z-10 w-[240px] bg-[#fafafa] px-4 py-2 shadow-2xl" : "hidden"}`}>
                  <div className='text-[13px]'>
                    {!notifications.length && "No new messages"}
                  </div>
                  {notifications.map((e, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        dispatch(setActiveChat(e.chatId));
                        dispatch(setNotifications(notifications.filter(n => n !== e)));
                      }}
                      className='text-[12.5px] text-black px-2 cursor-pointer'
                    >
                      {e.chatId?.isGroup
                        ? `New Message in ${e.chatId.chatName}`
                        : `New Message from ${getSender(activeUser, e.chatId?.users || [])}`}
                    </div>
                  ))}
                </div>

                <button onClick={() => dispatch(setShowProfile(true))} className='flex items-center gap-x-1 relative'>
                  <img className='w-[28px] h-[28px] rounded-full' src={activeUser?.profilePic} alt="profile" />
                  <IoIosArrowDown className="text-[#616c76] w-[14px] h-[14px]" />
                </button>
              </div>
            </div>

            <div>
              <div className='-mt-6 relative pt-6 px-4'>
                <form onSubmit={(e) => e.preventDefault()}>
                  <input
                    onChange={handleSearch}
                    value={search}
                    className='w-full bg-[#f6f6f6] text-[#111b21] tracking-wider pl-9 py-[8px] rounded-[9px] outline-0'
                    type="text"
                    name="search"
                    placeholder="Search"
                  />
                </form>
                <div className='absolute top-[36px] left-[27px]'>
                  <BsSearch className="text-[#c4c4c5]" />
                </div>

                <Group />

                {search && (
                  <div className='h-[100vh] absolute z-10 w-full left-0 top-[70px] bg-[#fff] flex flex-col gap-y-3 pt-3 px-4'>
                    <Search
                      searchResults={searchResults}
                      isLoading={isLoading}
                      handleClick={handleClick}
                      search={search}
                    />
                  </div>
                )}
              </div>

              <Contacts />
            </div>
          </div>
        ) : (
          <Profile className="min-w-full sm:min-w-[360px] h-[100vh] bg-[#fafafa] shadow-xl relative" />
        )}

        <Chat activeUser={activeUser} className="chat-page relative lg:w-full h-[100vh] bg-[#fafafa]" />
      </div>
    </div>
  );
}

export default Home;

