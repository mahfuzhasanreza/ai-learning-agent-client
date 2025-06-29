import { createContext, useState } from "react";
import runChat from "../config/chatResponse";
import Markdown from "react-markdown";
// import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [newChatPrompts, setNewChatPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [conversation, setConversation] = useState([]);
    const [activeChat, setActiveChat] = useState("");
    const [courseData, setCourseData] = useState("");

    // const delayPara = (index, nextWord) => {
    //     setTimeout(function () {
    //         setResultData(prev => prev + nextWord);
    //     }, 40 * index)
    // }

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setActiveChat("");
    }

    const onSent = async (prompt) => {
        setCourseData("");
        setResultData("");
        setLoading(true);
        setShowResult(true);

        let data;
        let response;
        if (prompt !== undefined) {
            setInput(prompt);

            data = await runChat(prompt);
            response = data.response;
            setCourseData(data.course);
            
            setRecentPrompt(prompt);

            if (!loading && !showResult) {
                setNewChatPrompts(prev => 
                    prev.includes(prompt) ? prev : [...prev, prompt]
                );
                setActiveChat(prompt);
                
                setConversation(prev => [...prev, { chat: prompt, input: prompt, response: newResponse4 }]);
            } else {
                setConversation((prev) => [...prev, { chat: activeChat, input: prompt, response: newResponse4 }]);
            }
        } else {
            response = await runChat(input);
            setRecentPrompt(input);

            if (!loading && !showResult) {
                setNewChatPrompts(prev => [...prev, input]);
                setActiveChat(input);

                setConversation(prev => [...prev, { chat: input, input: input, response: newResponse4 }]);
            } else {
                setConversation((prev) => [...prev, { chat: activeChat, input: input, response: newResponse4 }]);
            }

        }

        // manually add formatting for bold and new line
        // let responseArray = response.split("**");
        // let newResponse;
        // for (let i = 0; i < responseArray.length; i++) {
        //     if (i === 0 || i % 2 !== 1) {
        //         newResponse += responseArray[i];
        //     } else {
        //         newResponse += "<b>" + responseArray[i] + "</b>";
        //     }
        // }
        // let newResponse2 = newResponse.split("*").join("<br/>");
        // let newResponse3 = <Markdown remarkPlugins={[remarkGfm]}>{response}</Markdown>;

        let newResponse4 = <Markdown
            children={response}
            components={{
                code(props) {
                    const { children, className, node, ...rest } = props
                    const match = /language-(\w+)/.exec(className || '')
                    return match ? (
                        <SyntaxHighlighter
                            {...rest}
                            PreTag="div"
                            children={String(children).replace(/\n$/, '')}
                            language={match[1]}
                            style={dark}
                        />
                    ) : (
                        <code {...rest} className={className}>
                            {children}
                        </code>
                    )
                }
            }}
        />;
        setResultData(newResponse4);

        // create typing effect
        // let newResponseArray = newResponse4.split(" ");
        // for (let i = 0; i < newResponseArray.length; i++) {
        //     delayPara(i, newResponseArray[i] + " ");
        // }

        setLoading(false);
        setInput("");
    }

    const contextValue = {
        newChatPrompts,
        setNewChatPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
        conversation,
        activeChat,
        setActiveChat,
        courseData,
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;