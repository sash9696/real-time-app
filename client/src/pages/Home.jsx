import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchUsers, validUser } from '../apis/auth.js';
import { accessCreate } from "../apis/chat.js";
import { setActiveUser } from '../redux/activeUserSlice.js';
import { fetchChats, setNotifications, setActiveChat } from '../redux/chatsSlice.js';
import { getSender } from '../utils/index.js';
import Chat from './Chat.jsx';


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
  const {notifications, activeChat} = useSelector((state) => state.chats);
  const activeUser = useSelector((state) => state.activeUser);

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
    // Listen for storage changes (shouldn't happen in incognito, but check anyway)
    const handleStorageChange = (e) => {
      if (e.key === 'userToken') {
        console.warn('Home - Storage event detected! Token changed from another window/tab:', {
          oldValue: e.oldValue?.substring(0, 50),
          newValue: e.newValue?.substring(0, 50),
          url: e.url
        });
        // This shouldn't happen in incognito mode, but if it does, reload
        if (e.newValue !== e.oldValue) {
          console.warn('Home - Token changed via storage event - reloading to sync');
          window.location.reload();
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    let isMounted = true;
    let isRunning = false;
    
    const isValid = async () => {
      // Prevent multiple simultaneous calls
      if (isRunning) {
        return;
      }
      isRunning = true;
      
      try {
        // Get window ID and token at the start - this is window-specific in incognito
        const windowId = localStorage.getItem('windowId');
        const currentToken = localStorage.getItem('userToken');
        
        console.log('Home - Window ID:', windowId);
        console.log('Home - Token exists:', !!currentToken);
        console.log('Home - Token (first 50 chars):', currentToken?.substring(0, 50));
        
        if (!currentToken) {
          // No token, clear user state
          if (isMounted) {
            dispatch(setActiveUser({
              id: '',
              email: '',
              profilePic: '',
              bio: '',
              name: ''
            }));
          }
          return;
        }

        // Call validUser with the current token
        const result = await validUser();
        
        // Check if component is still mounted and token hasn't changed
        if (!isMounted) {
          return;
        }
        
        const tokenAfter = localStorage.getItem('userToken');
        const windowIdAfter = localStorage.getItem('windowId');
        
        if (currentToken !== tokenAfter) {
          console.warn('Home - Token changed during validation!', {
            before: currentToken?.substring(0, 50),
            after: tokenAfter?.substring(0, 50)
          });
          return;
        }
        
        if (windowId && windowId !== windowIdAfter) {
          console.warn('Home - Window ID changed during validation!', {
            before: windowId,
            after: windowIdAfter
          });
          return;
        }
        
        console.log('Home - validUser result:', {
          hasUser: !!result?.user,
          userEmail: result?.user?.email,
          userName: result?.user?.name
        });
        
        if (result?.user) {
          dispatch(setActiveUser({
            id: result.user._id,
            email: result.user.email,
            profilePic: result.user.profilePic,
            bio: result.user.bio,
            name: result.user.name
          }));
        } else {
          // No user returned, clear state
          dispatch(setActiveUser({
            id: '',
            email: '',
            profilePic: '',
            bio: '',
            name: ''
          }));
        }
      } catch (error) {
        console.error("User validation failed:", error);
        if (isMounted) {
          dispatch(setActiveUser({
            id: '',
            email: '',
            profilePic: '',
            bio: '',
            name: ''
          }));
        }
      } finally {
        isRunning = false;
      }
    };

    isValid();
    
    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageChange);
    };
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
                  {console.log('Home - Notifications:', notifications, 'Length:', notifications.length)}
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

