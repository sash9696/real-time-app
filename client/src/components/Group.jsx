import React, { useState, useEffect } from 'react';
import { BsPlusLg } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { Modal, Box } from "@mui/material";
import { searchUsers } from '../apis/auth';
import { createGroup } from '../apis/chat';
import { fetchChats, addChat } from '../redux/chatsSlice';
import { useDispatch } from 'react-redux';

// Dummy Search component
const Search = ({ isLoading, handleClick, search, searchResults }) => {
  console.log({searchResults})
  return (
    <div className="flex flex-col gap-y-2">
      {isLoading ? (
        <p className='text-sm text-gray-400'>Loading...</p>
      ) : (
        searchResults?.map((user) => (
          <div
            key={user._id}
            onClick={() => handleClick(user)}
            className="cursor-pointer px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
          >
            {user.name}
          </div>
        ))
      )}
    </div>
  );
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
};

function Group() {
  const [open, setOpen] = useState(false);
  const [chatName, setChatName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUsers] = useState([]);
  const dispatch = useDispatch();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSearch("");
    setSelectedUsers([]);
  };

  const handleFormSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleClick = (user) => {
    if (selectedUser.find((u) => u._id === user._id)) return;
    setSelectedUsers([...selectedUser, user]);
  };

  const deleteSelected = (user) => {
    setSelectedUsers(selectedUser.filter((u) => u._id !== user._id));
  };

  const handleSubmit = async () => {
    if (selectedUser.length >= 2) {
      const newGroup = await createGroup({
        chatName,
        users: JSON.stringify(selectedUser.map((e) => e._id))
      });

      dispatch(addChat(newGroup));
      dispatch(fetchChats());

      handleClose();
    } else {
      alert("Please select at least 2 users");
    }
  };

  useEffect(() => {
    const searchChange = async () => {
      setIsLoading(true);
      const data = await searchUsers(search)
      setSearchResults(data?.users || []);
      setIsLoading(false);
    };

    if (search.trim()) {
      searchChange();
    } else {
      setSearchResults([]);
    }
  }, [search]);

  return (
    <>
      <button className='mt-1 transition duration-150 ease-in-out' onClick={handleOpen}>
        <div className='flex justify-start border-r-2'>
          <button className='text-[11px] font-normal tracking-wide flex items-center gap-x-1 bg-[#f6f6f6] text-[#1f2228] py-1 -mb-7 mt-2 px-2'>
            New Group <BsPlusLg />
          </button>
        </div>
      </button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h5 className='text-[18px] text-[#111b21] font-medium text-center'>Create A Group</h5>

          <form onSubmit={(e) => e.preventDefault()} className='flex flex-col gap-y-3 mt-3'>
            <input
              onChange={(e) => setChatName(e.target.value)}
              className="border-[#c4ccd5] border-[1px] text-[13.5px] py-[4px] px-2 w-[100%]"
              type="text"
              name="chatName"
              placeholder="Group Name"
              required
            />

            <input
              onChange={handleFormSearch}
              className="border-[#c4ccd5] border-[1px] text-[13.5px] py-[4px] px-2 w-[100%]"
              type="text"
              name="users"
              placeholder="Add users"
            />

            <div className='flex flex-wrap gap-2'>
              {selectedUser.map((user) => (
                <button
                  key={user._id}
                  onClick={() => deleteSelected(user)}
                  className='flex items-center gap-x-1 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded border border-green-400'
                >
                  <span>{user.name}</span>
                  <RxCross2 />
                </button>
              ))}
            </div>

            <Search
              isLoading={isLoading}
              handleClick={handleClick}
              search={search}
              searchResults={searchResults}
            />

            <div className='flex justify-end mt-3'>
              <button
                onClick={handleSubmit}
                className='bg-[#0086ea] text-[#fff] text-[15px] font-medium px-2 py-1 tracking-wide'
                type='submit'
              >
                Create
              </button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
}

export default Group;

