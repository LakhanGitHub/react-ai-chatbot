import './App.css'
import { useState, useEffect, useRef } from 'react'
//import { URL, API_KEY } from './constants';

import RecentSearch from './components/RecentSearch';
import QuestionAnswer from './components/QuestionAnswer';

function App() {  
  const URL = import.meta.env.VITE_URL;
  const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
  const MODEL = import.meta.env.VITE_MODEL;
 const [question, setQuestion] = useState('');
 const [result, setResult] = useState([]);
 const [recentHistory, setRecentHistory] = useState(() => {
   // Safe initialization for localStorage
   const saved = localStorage.getItem('history');
   return saved ? JSON.parse(saved) : [];
 });
 const [selectedHistory, setSelectedHistory] = useState('');
 const scrollToAns=useRef();
 const [loader, setLoader] = useState(false);

 const askQuestion = async (forcedPayload) => {
  // Use either the passed history string or the current state text
  const payloadData = forcedPayload || question;

  if (!payloadData.trim()) {
    return false;
  }

  // Update history only if it came from a newly typed question
  if (question) {
    let currentHistory = JSON.parse(localStorage.getItem('history')) || [];
    currentHistory = [question, ...currentHistory];
    localStorage.setItem('history', JSON.stringify(currentHistory));
    setRecentHistory(currentHistory);
  }

  try {
    setLoader(true);
    const res = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: payloadData }]
      })
    });

    // FIX 1: Declared a separate variable 'data' instead of re-assigning 'response'
    const data = await res.json();
    
    let dataString = data.choices[0].message.content;
    dataString = dataString.split('* ').map((item) => item.trim());

    setResult((prevResult) => [
      ...prevResult, 
      { type: 'q', text: payloadData },
      { type: 'a', text: dataString }
    ]);
    
    // Clear the input field
    setQuestion('');
    //Scroll the text to the top if ans is logger than the container
    setTimeout(() => {  
      scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight;
    }, 500);

    setLoader(false);

  } catch (error) {
    console.error("API Error:", error);
  }
 }


 const isEnter = (event) => {
  if (event.key === 'Enter') {
    askQuestion();
  }
 }

 // FIX 2: Clear selected history right after calling the function to break loop tendencies
 useEffect(() => {
  if (selectedHistory !== '') {
    askQuestion(selectedHistory);
    setSelectedHistory(''); // Reset tracker
  }
 }, [selectedHistory]);

 // dark mode functionality
 const [darkMode, setDarkMode] = useState('dark');
 useEffect(() => {
console.log(darkMode);
if(darkMode === 'dark'){
  document.documentElement.classList.add('dark');
  //document.documentElement.classList.remove('light');
}else{
  //document.documentElement.classList.add('light');
  document.documentElement.classList.remove('dark');
}
 },[darkMode])

 return (
  <div className={darkMode === 'dark' ? 'dark' : 'light'}>
   <div className='grid grid-cols-5 h-screen text-center'>
    <select onChange={(event)=>setDarkMode(event.target.value)} className='fixed text-white bottom-0 p-2 bg-zinc-800 border border-zink-700'>
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select>
     <RecentSearch recentHistory={recentHistory} setRecentHistory={setRecentHistory} setSelectedHistory={setSelectedHistory} />

     <div className='col-span-4 p-10 flex flex-col justify-between'>
      <h1 className='text-4xl bg-clip-text text-transparent bg-gradient-to-r from-pink-700 to-violet-700 text-bold'>
        Hello User, Ask me anything...
      </h1>
      {
      loader?
      <div role="status">
    <svg aria-hidden="true" className="inline w-8 h-8 text-neutral-tertiary animate-spin fill-purple" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
    </div>:null
      }
      
       <div ref={scrollToAns} className='container h-120 overflow-y-auto no-scrollbar' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
         <div className='dark:text-white text-zinc-800 text-left'>
           <ul>
             {
              result?.map((item, index) => (
                <QuestionAnswer key={index} item={item} index={index} />
              ))
             }
           </ul>
         </div>
       </div>

       <div className='dark:bg-zinc-800 bg-red-100 w-1/2 p-1 pr-5 dark:text-white text-zinc-800 m-auto rounded-4xl border border-zinc-700 flex h-16 items-center'>
         <input 
           type="text" 
           value={question}
           onKeyDown={isEnter}
           onChange={(event) => setQuestion(event.target.value)} 
           className='w-full h-full p-3 bg-transparent outline-none border-none dark:text-white text-zinc-800' 
           placeholder='How can I help you today?'
         />
         <button onClick={() => askQuestion()} className='dark:bg-zinc-700 px-4 py-2 rounded-2xl hover:dark:bg-zinc-600'>ask</button>
       </div>
     </div>   
   </div>
   </div>
 )
}

export default App;