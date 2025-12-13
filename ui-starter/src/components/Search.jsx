import React from "react";
import Skeletonloading from "./ui/Skeletonloading";

function Search({ isLoading, searchResults, handleClick, search }) {
  console.log({searchResults})
  return (
    <div className={search ? "" : "hidden"}>
      {isLoading ? (
        <Skeletonloading height={55} count={3} />
      ) : (
        searchResults?.map((e) => (
          <div key={e._id} className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              <img className="w-[40px]  h-[40px] rounded-full" src={e?.profilePic} alt={e?.name} />

              <div className="flex flex-col gap-y-[1px]">
                <h5 className="text-[15px]" >{e.name}</h5>
                <h5 className="text-[12px]">{e.email}</h5>
              </div>
            </div>
            <button className="cursor-pointer" onClick={() => handleClick(e)} >Add</button>
          </div>
        ))
      )}
    </div>
  );
}

export default Search;

