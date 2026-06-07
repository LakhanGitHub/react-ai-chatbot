import React from 'react';
function RecentSearch({ recentHistory, setRecentHistory, setSelectedHistory }) {

  const clearHistory = () => {
    localStorage.clear();
    setRecentHistory([]);
  }; // <-- You were missing this closing brace!

  return (
    <>
      <div className="col-span-1 bg-zinc-800">
        <h1 className="text-xl font-bold text-white p-2 pt-5 flex items-center justify-between px-4">
          <span>Recent Search</span>
          <button onClick={clearHistory} className="cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#eeeaea"
            >
              <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
            </svg>
          </button>
        </h1>
        <ul
          className="text-left container h-130 overflow-y-auto no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {recentHistory &&
            recentHistory.map((item, index) => (
              <li
                key={index}
                onClick={() => setSelectedHistory(item)}
                className="px-5 py-2 text-left text-zinc-400 truncate cursor-pointer hover:bg-zinc-700 hover:text-white"
              >
                {item}
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}

export default RecentSearch;