
import Answer from './answers';
const QuestionAnswer = ({item, index}) => {
  return (
    //fragment to avoid unnecessary divs in the DOM
    <>
      <div
        key={index}
        className={item.type === "q" ? "flex justify-end my-2" : "my-2"}
      >
        {item.type === "q" ? (
          <li className="text-right p-2 dark:text-white text-zinc-800 dark:bg-zinc-700 bg-red-100 rounded-tl-3xl rounded-br-3xl rounded-bl-3xl w-fit list-none">
            {item.text}
          </li>
        ) : (
          item.text.map((ansItem, ansIndex) => (
            <li
              key={ansIndex}
              className="text-left p-1 whitespace-pre-line leading-loose list-none"
            >
              <Answer
                ans={ansItem}
                totalResult={item.text.length}
                index={index}
              />
            </li>
          ))
        )}
      </div>
    </>
  );
};

export default QuestionAnswer;
