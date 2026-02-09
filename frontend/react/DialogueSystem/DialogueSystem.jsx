/**
 * [區塊與群組優化版]
 * SCENE_FLOWS: 區塊式管理邏輯。支援 options 同時處理區塊跳轉 (nextBlock) 與 索引跳轉 (nextIndex)。
 * DIALOGUE_CONTENT: 陣列群組管理台詞。
 */

const { useState, useEffect, useMemo, useRef, useCallback } = window.React || {};

const getLucideIcon = (iconName) => {
  try {
    return window.lucideReact[iconName];
  } catch (e) {
    return () => <span className="w-4 h-4 inline-block" />;
  }
};

const User = getLucideIcon('User');
const ChevronRight = getLucideIcon('ChevronRight');
const Terminal = getLucideIcon('Terminal');
const Layers = getLucideIcon('Layers');

// 1. 視覺定義層 (場景資訊)
const SCENE_INFO = {
  characters: {
    "Elder": { name: "神秘老者", avatar: "bg-emerald-900", color: "text-emerald-400" },
    "System": { name: "系統", avatar: "bg-slate-700", color: "text-slate-300" }
  }
};

// 2. 流程控制層 (區塊式管理)
const SCENE_FLOWS = {
  "Introduction": [
    { type: "text", id: "Intro_Cluster_01" },
    { type: "choice", id: "Choice_01", options: [
      { labelId: "Opt_Internal", nextIndex: 2 }, // 同一區塊內跳轉到索引 2 (Skip)
      { labelId: "Opt_Learn", nextBlock: "Main_Course" }, // 切換區塊跳轉
      { labelId: "Opt_Exit", nextBlock: "Final_Section" }
    ]},
    { type: "text", id: "Skip_Test_Node" }, // 索引為 2 的節點
    { type: "jump", nextBlock: "Main_Course" }
  ],
  "Main_Course": [
    { type: "text", id: "Tutorial_Cluster_01" },
    { type: "jump", nextBlock: "Final_Section" }
  ],
  "Final_Section": [
    { type: "text", id: "End_Cluster_01" }
  ]
};

// 3. 內容數據層 (陣列群組管理台詞)
const DIALOGUE_CONTENT = {
  "Intro_Cluster_01": { 
    charId: "Elder", 
    text: [
      "歡迎來到區塊化管理系統。", 
      "目前的結構中，每一組 ID 都包含一個台詞陣列。",
      "你可以點擊畫面前進到下一句台詞。"
    ] 
  },
  "Choice_01": { 
    charId: "Elder", 
    text: ["現在，請選擇你想要探索的方向。您可以選擇跳轉區塊，或在區塊內移動。"] 
  },
  "Skip_Test_Node": {
    charId: "Elder",
    text: ["你選擇了同一區塊內的索引跳轉，現在我們來到了 Introduction 的後續節點。"]
  },
  "Tutorial_Cluster_01": { 
    charId: "Elder", 
    text: [
      "這是 Main_Course 區塊。", 
      "當區塊內的所有步驟執行完畢，系統會執行 jump 指令。"
    ] 
  },
  "End_Cluster_01": { 
    charId: "System", 
    text: ["流程已結束。這證明了陣列群組管理、區塊跳轉與內部跳轉的穩定性。"] 
  },
  // 選項文字
  "Opt_Internal": { text: "區塊內索引跳轉 (nextIndex)" },
  "Opt_Learn": { text: "切換區塊跳轉 (nextBlock)" },
  "Opt_Exit": { text: "直接跳轉至結尾" }
};

const App = () => {
  if (!window.React) return <div className="text-white">React 載入失敗</div>;

  const [activeBlock, setActiveBlock] = useState('Introduction');
  const [flowIndex, setFlowIndex] = useState(0); // 區塊內的步驟索引
  const [subIndex, setSubIndex] = useState(0);   // 台詞陣列內的索引
  
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const timerRef = useRef(null);

  // 當前步驟邏輯
  const currentStep = useMemo(() => SCENE_FLOWS[activeBlock]?.[flowIndex], [activeBlock, flowIndex]);
  const content = useMemo(() => DIALOGUE_CONTENT[currentStep?.id], [currentStep]);
  const char = useMemo(() => SCENE_INFO.characters[content?.charId], [content]);
  const currentSentence = useMemo(() => content?.text[subIndex] || "", [content, subIndex]);

  // 打字機效果
  useEffect(() => {
    if (!currentSentence) return;
    setDisplayText('');
    setIsTyping(true);
    let idx = 0;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (idx < currentSentence.length) {
        setDisplayText(prev => prev + currentSentence.charAt(idx));
        idx++;
      } else {
        clearInterval(timerRef.current);
        setIsTyping(false);
      }
    }, 30);
    return () => clearInterval(timerRef.current);
  }, [currentSentence]);

  /**
   * 處理選項跳轉邏輯
   * 優先檢查 nextBlock，若無則檢查 nextIndex
   */
  const handleOptionClick = (opt) => {
    if (opt.nextBlock) {
      setActiveBlock(opt.nextBlock);
      setFlowIndex(0);
      setSubIndex(0);
    } else if (typeof opt.nextIndex === 'number') {
      setFlowIndex(opt.nextIndex);
      setSubIndex(0);
    }
  };

  // 流程推進邏輯
  const proceed = useCallback(() => {
    if (isTyping) {
      setDisplayText(currentSentence);
      clearInterval(timerRef.current);
      setIsTyping(false);
      return;
    }

    // 1. 檢查台詞陣列是否還有下一句
    if (content && subIndex + 1 < content.text.length) {
      setSubIndex(subIndex + 1);
      return;
    }

    // 2. 檢查區塊內是否有下一步
    const block = SCENE_FLOWS[activeBlock];
    if (currentStep?.type === 'choice') return; // 選項模式下禁止點擊前進

    if (currentStep?.type === 'jump') {
      setActiveBlock(currentStep.nextBlock);
      setFlowIndex(0);
      setSubIndex(0);
      return;
    }

    if (flowIndex + 1 < block.length) {
      setFlowIndex(flowIndex + 1);
      setSubIndex(0);
    }
  }, [isTyping, currentSentence, content, subIndex, activeBlock, flowIndex, currentStep]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 p-8 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-xl space-y-6">
        
        {/* 主要播放器 */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="h-40 bg-zinc-800/30 flex items-center justify-center relative">
            <div className={`w-24 h-24 rounded-2xl flex items-center justify-center ${char?.avatar || 'bg-zinc-800'} transition-all duration-500 ${isTyping ? 'scale-95' : 'scale-100 shadow-xl'}`}>
               <User size={40} className="text-white/10" />
            </div>
            <div className="absolute top-4 left-6 flex items-center gap-2 px-3 py-1 bg-black/40 rounded-full border border-white/5 text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">
              <Layers size={10} /> {activeBlock} / step_{flowIndex}
            </div>
          </div>

          <div className="p-10 pt-6 min-h-[180px] cursor-pointer" onClick={proceed}>
            {char && <div className={`text-[10px] font-black tracking-widest uppercase mb-3 ${char.color}`}>{char.name}</div>}
            <div className="text-xl font-light leading-relaxed min-h-[60px]">
              {displayText}
              {isTyping && <span className="inline-block w-1.5 h-5 bg-emerald-500 ml-2 animate-bounce align-middle" />}
            </div>
            {!isTyping && currentStep?.type !== 'choice' && (
              <div className="mt-6 flex items-center gap-2 text-zinc-600 text-[10px] font-bold tracking-widest uppercase animate-pulse">
                CONTINUE <ChevronRight size={14} />
              </div>
            )}
          </div>

          {/* 選項渲染 */}
          {!isTyping && subIndex + 1 >= (content?.text.length || 0) && currentStep?.type === 'choice' && (
            <div className="px-10 pb-10 flex flex-col gap-2">
              {currentStep.options.map((opt, i) => (
                <button 
                  key={i} 
                  onClick={() => handleOptionClick(opt)}
                  className="flex items-center justify-between p-4 bg-zinc-800 hover:bg-emerald-900/20 border border-zinc-700 hover:border-emerald-500/50 rounded-2xl transition-all group"
                >
                  <span className="text-sm text-zinc-400 group-hover:text-zinc-100">
                    {DIALOGUE_CONTENT[opt.labelId]?.text}
                  </span>
                  <ChevronRight size={16} className="text-zinc-700 group-hover:text-emerald-500" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 狀態監控 */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 font-mono text-[10px]">
          <div className="flex items-center gap-2 text-zinc-700 mb-4 uppercase tracking-widest">
            <Terminal size={14} /> Cluster_Architecture_Monitor
          </div>
          <div className="grid grid-cols-2 gap-4 text-zinc-500">
            <div>CURRENT_BLOCK: <span className="text-emerald-500">{activeBlock}</span></div>
            <div>FLOW_INDEX: <span className="text-amber-500">{flowIndex}</span></div>
            <div>ARRAY_INDEX: <span className="text-sky-500">{subIndex + 1} / {content?.text.length}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);