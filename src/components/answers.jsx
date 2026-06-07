import { useEffect, useState } from 'react'
import { checkHeading, replaceheadingStars } from '../helper';
import SyntaxHighlighter from 'react-syntax-highlighter';
//import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';

const Answer = ({ ans, totalResult, index }) => {
  const [heading, setHeading] = useState(false)
  const [answer, setAnswer] = useState(ans)

  useEffect(() => {
    if(checkHeading(ans)){

      setHeading(true);
      setAnswer(replaceheadingStars(ans))
    }
  }, [])

//syntax hilighter and markdown renderer for code blocks and inline code in the answer text
  const render = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    const langName = match ? match[1] : 'code';
    const codeString = String(children).replace(/\n$/, '');

    // State helper to animate or toggle copy text feedback
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset text after 2 seconds
    };

    return !inline && match ? (
      /* Main Code block container window structure wrapper */
      <div className="my-6 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950 shadow-2xl text-left">
        
        {/* Top Header Control Bar Panel */}
        <div className="flex items-center justify-between bg-zinc-900 px-4 py-2 text-xs font-mono text-zinc-400 select-none border-b border-zinc-800">
          <span className="lowercase font-semibold text-zinc-300">{langName}</span>
          
          <button 
            onClick={handleCopy}
            className="flex items-center gap-1 cursor-pointer rounded px-2 py-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all active:scale-95"
            type="button"
          >
            {copied ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                ✓ Copied!
              </span>
            ) : (
              <span className="flex items-center gap-1">
                {/* Minimalist modern copy svg icon */}
                <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="currentColor">
                  <path d="M360-240q-29.7 0-50.85-21.15Q288-282.3 288-312v-480q0-29.7 21.15-50.85Q330.3-864 360-864h360q29.7 0 50.85 21.15Q792-821.7 792-792v480q0-29.7-21.15 50.85Q749.7-240 720-240H360Zm0-72h360v-480H360v480ZM216-96q-29.7 0-50.85-21.15Q144-138.3 144-168v-456h72v456h456v72H216Zm144-216v-480 480Z"/>
                </svg>
                Copy code
              </span>
            )}
          </button>
        </div>

        {/* Syntax Highlighter Element Block area */}
        <SyntaxHighlighter
          {...props}
          children={codeString}
          language={langName}
          style={vscDarkPlus} 
          preTag="div"
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent', // Inherit native clean background from parent layout
            fontSize: '0.875rem',
            lineHeight: '1.5',
            overflowX: 'auto',
          }}
          codeTagProps={{
            style: {
              fontFamily: 'Fira Code, JetBrains Mono, ui-monospace, monospace',
            }
          }}
        />
      </div>
    ) : (
      /* Inline Code styling for standard embedded text snippets like `const x = 5` */
      <code 
        {...props} 
        className="bg-zinc-800/40 text-zinc-300 dark:bg-zinc-700/30 dark:text-zinc-200 px-1.5 py-0.5 mx-0.5 rounded-md font-mono text-[13px] font-normal border border-zinc-700/30 tracking-wide"
      >
        {children}
      </code>
    );
  }
};

  return (
    <>
    {
      index == 0 && totalResult > 1 ? <span className='pt-2 text-2xl font-bold text-white'>{Answer}</span>:
      heading ? <span className='pt-2 text-lg block text-white'>{answer}</span>
      :<span className='pl-5 '>
        <ReactMarkdown components={render}>{answer}</ReactMarkdown>
      </span>
    }

    </>
  )
}
export default Answer