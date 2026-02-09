/** Flow Editor：區塊式對話腳本視覺化編輯器，依賴 CDN React / Lucide，無 ESM 打包 */
const { useState, useMemo, useEffect } = window.React || {};
const getIcon = (name) => {
  try { return window.lucideReact?.[name] || (() => <span className="w-4 h-4 inline-block" />); } catch (e) { return () => <span className="w-4 h-4 inline-block" />; }
};
const User = getIcon('User');
const Plus = getIcon('Plus');
const Trash2 = getIcon('Trash2');
const GitBranch = getIcon('GitBranch');
const MessageSquare = getIcon('MessageSquare');
const Copy = getIcon('Copy');
const Layers = getIcon('Layers');
const ChevronRight = getIcon('ChevronRight');
const Terminal = getIcon('Terminal');
const Settings = getIcon('Settings');
const Type = getIcon('Type');
const ExternalLink = getIcon('ExternalLink');

const App = () => {
  if (!window.React) return <div className="p-10 text-red-400">React 尚未載入，請檢查 CDN。</div>;
  // --- 初始狀態 ---
  const [sceneInfo, setSceneInfo] = useState({
    characters: {
      "Elder": { name: "神秘老者", avatar: "bg-emerald-900", color: "text-emerald-400" },
      "Hero": { name: "冒險者", avatar: "bg-blue-900", color: "text-blue-400" }
    }
  });

  const [sceneFlows, setSceneFlows] = useState({
    "Introduction": [
      { type: "text", id: "Intro_01" },
      { type: "choice", id: "Choice_Branch", options: [
        { labelId: "Opt_A", nextIndex: 2 },
        { labelId: "Opt_B", nextBlock: "Forest" }
      ]},
      { type: "text", id: "Intro_End" }
    ],
    "Forest": [
      { type: "text", id: "Forest_Start" },
      { type: "jump", nextBlock: "Introduction" }
    ]
  });

  const [dialogueContent, setDialogueContent] = useState({
    "Intro_01": { charId: "Elder", text: ["遠道而來的客人，歡迎。", "這裡的一切都由腳本驅動。"] },
    "Choice_Branch": { charId: "Elder", text: ["你打算往哪裡走？"] },
    "Intro_End": { charId: "Elder", text: ["看來你選擇了留在這。"] },
    "Forest_Start": { charId: "Hero", text: ["這片森林看起來很陰暗。"] },
    "Opt_A": { text: "留在原地" },
    "Opt_B": { text: "前往森林" }
  });

  const [activeTab, setActiveTab] = useState('flows'); 
  const [selectedScene, setSelectedScene] = useState('Introduction');
  const [copyStatus, setCopyStatus] = useState(false);

  // --- 計算生成的代碼 ---
  const generatedCode = useMemo(() => {
    return `const SCENE_INFO = ${JSON.stringify(sceneInfo, null, 2)};\n\nconst SCENE_FLOWS = ${JSON.stringify(sceneFlows, null, 2)};\n\nconst DIALOGUE_CONTENT = ${JSON.stringify(dialogueContent, null, 2)};`;
  }, [sceneInfo, sceneFlows, dialogueContent]);

  // --- 操作邏輯 ---
  const copyCode = () => {
    const el = document.createElement('textarea');
    el.value = generatedCode;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  const updateCharacter = (id, field, value) => {
    setSceneInfo(prev => ({
      ...prev,
      characters: { ...prev.characters, [id]: { ...prev.characters[id], [field]: value } }
    }));
  };

  const addScene = () => {
    const name = prompt("請輸入新場景名稱:");
    if (name && !sceneFlows[name]) {
      setSceneFlows({ ...sceneFlows, [name]: [] });
      setSelectedScene(name);
    }
  };

  const addStep = () => {
    const newId = `Node_${Date.now().toString().slice(-4)}`;
    const newStep = { type: 'text', id: newId };
    setSceneFlows({ ...sceneFlows, [selectedScene]: [...sceneFlows[selectedScene], newStep] });
    // 自動初始化對話內容
    setDialogueContent({ ...dialogueContent, [newId]: { charId: Object.keys(sceneInfo.characters)[0], text: ["新對話內容"] } });
  };

  const deleteStep = (index) => {
    const block = sceneFlows[selectedScene];
    const step = block?.[index];
    const updated = [...block];
    updated.splice(index, 1);
    setSceneFlows({ ...sceneFlows, [selectedScene]: updated });
    // 同步移除對話庫中該節點與選項 label 的內容，避免孤立的 key
    const nextContent = { ...dialogueContent };
    if (step?.id) delete nextContent[step.id];
    if (step?.type === 'choice' && step.options) step.options.forEach(o => { if (o.labelId) delete nextContent[o.labelId]; });
    setDialogueContent(nextContent);
  };

  const addCharacter = () => {
    const id = prompt('請輸入角色 ID（英文，例如 Hero2）:');
    if (!id || sceneInfo.characters[id]) return;
    setSceneInfo(prev => ({
      ...prev,
      characters: { ...prev.characters, [id]: { name: '新角色', avatar: 'bg-zinc-700', color: 'text-zinc-400' } }
    }));
  };

  const deleteCharacter = (id) => {
    const keys = Object.keys(sceneInfo.characters);
    if (keys.length <= 1) return;
    const next = { ...sceneInfo.characters };
    delete next[id];
    setSceneInfo(prev => ({ ...prev, characters: next }));
  };

  const addOption = (stepIdx) => {
    const newLabelId = `Opt_${Date.now().toString().slice(-4)}`;
    const updated = [...sceneFlows[selectedScene]];
    if (!updated[stepIdx].options) updated[stepIdx].options = [];
    updated[stepIdx].options.push({ labelId: newLabelId, nextIndex: 0 });
    setSceneFlows({ ...sceneFlows, [selectedScene]: updated });
    setDialogueContent({ ...dialogueContent, [newLabelId]: { text: '新選項' } });
  };

  const updateChoiceOption = (stepIdx, optIdx, field, value) => {
    const updated = [...sceneFlows[selectedScene]];
    const opt = { ...updated[stepIdx].options[optIdx] };
    if (field === 'labelId') {
      const oldId = opt.labelId;
      if (oldId && dialogueContent[oldId]) {
        const nextContent = { ...dialogueContent };
        nextContent[value] = dialogueContent[oldId];
        delete nextContent[oldId];
        setDialogueContent(nextContent);
      } else if (value) setDialogueContent({ ...dialogueContent, [value]: { text: '' } });
      opt.labelId = value;
    } else if (field === 'nextBlock') {
      delete opt.nextIndex;
      opt.nextBlock = value;
    } else if (field === 'nextIndex') {
      delete opt.nextBlock;
      opt.nextIndex = value === '' ? 0 : parseInt(value, 10);
    }
    const newOptions = [...updated[stepIdx].options];
    newOptions[optIdx] = opt;
    updated[stepIdx] = { ...updated[stepIdx], options: newOptions };
    setSceneFlows({ ...sceneFlows, [selectedScene]: updated });
  };

  const deleteDialogueLine = (contentId, lineIdx) => {
    const data = dialogueContent[contentId];
    if (!Array.isArray(data?.text) || data.text.length <= 1) return;
    const newTexts = data.text.filter((_, i) => i !== lineIdx);
    setDialogueContent({ ...dialogueContent, [contentId]: { ...data, text: newTexts } });
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-300 overflow-hidden font-sans">
      {/* 側邊導航 */}
      <div className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Layers size={18} className="text-white" />
          </div>
          <span className="font-bold text-white tracking-tight">Flow Editor</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <button onClick={() => setActiveTab('characters')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'characters' ? 'bg-indigo-500/10 text-indigo-400' : 'hover:bg-zinc-800'}`}>
            <User size={18} /> <span className="text-sm font-medium">角色資產</span>
          </button>
          <button onClick={() => setActiveTab('flows')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'flows' ? 'bg-indigo-500/10 text-indigo-400' : 'hover:bg-zinc-800'}`}>
            <GitBranch size={18} /> <span className="text-sm font-medium">場景流程</span>
          </button>
          <button onClick={() => setActiveTab('content')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'content' ? 'bg-indigo-500/10 text-indigo-400' : 'hover:bg-zinc-800'}`}>
            <MessageSquare size={18} /> <span className="text-sm font-medium">對話庫</span>
          </button>
        </nav>

        <div className="p-4 border-t border-zinc-800">
           <button onClick={copyCode} className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all shadow-lg ${copyStatus ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}>
             {copyStatus ? '已複製!' : <><Copy size={16} /> 複製代碼</>}
           </button>
        </div>
      </div>

      {/* 主編輯區 */}
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-950">
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-900/30">
          <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <Settings size={14} /> Editor / {activeTab}
          </h2>
          <div className="flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-mono text-zinc-600 tracking-tighter uppercase">Live Sync Active</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 scrollbar-hide">
          
          {/* 角色編輯面板 */}
          {activeTab === 'characters' && (
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(sceneInfo.characters).map(([id, char]) => (
                <div key={id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
                   <div className="flex justify-between items-center">
                     <span className="text-[10px] font-mono text-indigo-400 px-2 py-1 bg-indigo-400/10 rounded">{id}</span>
                     <button type="button" onClick={() => deleteCharacter(id)} className="text-zinc-600 hover:text-red-400 transition-colors" title="刪除角色"><Trash2 size={14} /></button>
                   </div>
                   <div className="space-y-3">
                      <div>
                        <label className="text-[10px] text-zinc-500 uppercase font-bold ml-1">顯示名稱</label>
                        <input type="text" value={char.name} onChange={(e)=>updateCharacter(id, 'name', e.target.value)} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl p-3 text-sm focus:border-indigo-500 outline-none transition-all mt-1" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                         <div>
                           <label className="text-[10px] text-zinc-500 uppercase font-bold ml-1">Avatar Class</label>
                           <input type="text" value={char.avatar} onChange={(e)=>updateCharacter(id, 'avatar', e.target.value)} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl p-3 text-xs focus:border-indigo-500 outline-none mt-1" />
                         </div>
                         <div>
                           <label className="text-[10px] text-zinc-500 uppercase font-bold ml-1">Color Class</label>
                           <input type="text" value={char.color} onChange={(e)=>updateCharacter(id, 'color', e.target.value)} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl p-3 text-xs focus:border-indigo-500 outline-none mt-1" />
                         </div>
                      </div>
                   </div>
                </div>
              ))}
              <button onClick={addCharacter} className="h-full min-h-[150px] border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center gap-2 text-zinc-600 hover:border-indigo-500/50 hover:text-indigo-400 hover:bg-indigo-500/5 transition-all">
                <Plus size={24} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Add Character</span>
              </button>
            </div>
          )}

          {/* 場景流程面板 */}
          {activeTab === 'flows' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
                {Object.keys(sceneFlows).map(sceneId => (
                  <button 
                    key={sceneId} 
                    onClick={()=>setSelectedScene(sceneId)}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${selectedScene === sceneId ? 'bg-indigo-600 text-white shadow-lg' : 'bg-zinc-900 text-zinc-500 hover:bg-zinc-800'}`}
                  >
                    {sceneId}
                  </button>
                ))}
                <button onClick={addScene} className="w-9 h-9 flex-shrink-0 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:bg-indigo-600 hover:text-white transition-all">
                  <Plus size={16} />
                </button>
              </div>

              <div className="space-y-4">
                {sceneFlows[selectedScene]?.map((step, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="flex flex-col items-center gap-2 mt-2">
                       <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-mono text-zinc-500">
                         {idx}
                       </div>
                       <div className="w-px flex-1 bg-zinc-800 group-last:hidden"></div>
                    </div>
                    
                    <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 transition-all hover:border-zinc-700">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center bg-zinc-800 rounded-lg border border-zinc-700 p-1">
                          <button onClick={()=>{
                            const updated = [...sceneFlows[selectedScene]];
                            updated[idx].type = 'text';
                            setSceneFlows({...sceneFlows, [selectedScene]: updated});
                          }} className={`px-3 py-1 text-[10px] font-bold rounded ${step.type === 'text' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}>TEXT</button>
                          <button onClick={()=>{
                            const updated = [...sceneFlows[selectedScene]];
                            updated[idx].type = 'choice';
                            updated[idx].options = updated[idx].options || [{labelId: 'NewOpt', nextIndex: 0}];
                            setSceneFlows({...sceneFlows, [selectedScene]: updated});
                          }} className={`px-3 py-1 text-[10px] font-bold rounded ${step.type === 'choice' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}>CHOICE</button>
                          <button onClick={()=>{
                            const updated = [...sceneFlows[selectedScene]];
                            updated[idx].type = 'jump';
                            updated[idx].nextBlock = selectedScene;
                            setSceneFlows({...sceneFlows, [selectedScene]: updated});
                          }} className={`px-3 py-1 text-[10px] font-bold rounded ${step.type === 'jump' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}>JUMP</button>
                        </div>
                        
                        <input 
                          type="text" 
                          value={step.id || ''} 
                          placeholder="Node ID"
                          onChange={(e)=>{
                            const updated = [...sceneFlows[selectedScene]];
                            updated[idx].id = e.target.value;
                            setSceneFlows({...sceneFlows, [selectedScene]: updated});
                          }}
                          className="bg-transparent border-b border-zinc-800 focus:border-indigo-500 text-sm font-mono text-indigo-400 outline-none px-2 py-1 flex-1"
                        />
                        
                        <button onClick={()=>deleteStep(idx)} className="text-zinc-700 hover:text-red-400 p-2"><Trash2 size={16}/></button>
                      </div>

                      {step.type === 'choice' && (
                        <div className="mt-4 pl-4 border-l-2 border-indigo-500/30 space-y-3">
                          {step.options?.map((opt, oIdx) => (
                            <div key={oIdx} className="flex items-center gap-3">
                              <Type size={12} className="text-zinc-600" />
                              <input 
                                type="text" 
                                value={opt.labelId || ''}
                                placeholder="Label ID"
                                onChange={(e) => updateChoiceOption(idx, oIdx, 'labelId', e.target.value)}
                                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs flex-1 outline-none focus:border-indigo-500"
                              />
                              <div className="flex items-center bg-zinc-800 rounded-lg p-1 border border-zinc-700">
                                <span className="px-2 text-[10px] font-bold text-zinc-500 uppercase">Target</span>
                                {opt.nextBlock !== undefined ? (
                                  <input type="text" value={opt.nextBlock || ''} onChange={(e) => updateChoiceOption(idx, oIdx, 'nextBlock', e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-[10px] w-20 text-emerald-400 outline-none" />
                                ) : (
                                  <input type="number" value={opt.nextIndex ?? ''} onChange={(e) => updateChoiceOption(idx, oIdx, 'nextIndex', e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-[10px] w-12 text-sky-400 outline-none" />
                                )}
                              </div>
                            </div>
                          ))}
                          <button onClick={() => addOption(idx)} className="flex items-center gap-2 text-[10px] font-black tracking-widest text-indigo-500 hover:text-indigo-400 transition-colors uppercase mt-2">
                             <Plus size={12} /> Add Option
                          </button>
                        </div>
                      )}

                      {step.type === 'jump' && (
                        <div className="mt-4 flex items-center gap-3 bg-indigo-500/5 p-4 rounded-2xl border border-indigo-500/10">
                          <ExternalLink size={14} className="text-indigo-500" />
                          <span className="text-xs font-bold text-indigo-300">Jump to Block:</span>
                          <input 
                            type="text" 
                            value={step.nextBlock} 
                            onChange={(e)=>{
                               const updated = [...sceneFlows[selectedScene]];
                               updated[idx].nextBlock = e.target.value;
                               setSceneFlows({...sceneFlows, [selectedScene]: updated});
                            }}
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1 text-xs text-white outline-none focus:border-indigo-500" 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={addStep}
                  className="w-full py-6 border-2 border-dashed border-zinc-900 rounded-3xl flex flex-col items-center justify-center gap-2 text-zinc-700 hover:border-indigo-500/30 hover:text-indigo-500 hover:bg-indigo-500/5 transition-all mt-4"
                >
                  <Plus size={24} />
                  <span className="text-[10px] font-bold uppercase tracking-widest tracking-widest">Append Next Step</span>
                </button>
              </div>
            </div>
          )}

          {/* 對話內容面板 */}
          {activeTab === 'content' && (
            <div className="max-w-4xl mx-auto space-y-4">
              {Object.entries(dialogueContent).map(([id, data]) => (
                <div key={id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-zinc-700 transition-all group">
                  <div className="flex items-center justify-between mb-6">
                     <div className="flex items-center gap-3">
                       <span className="text-sm font-mono text-indigo-400 font-bold">{id}</span>
                       <div className="px-2 py-0.5 bg-zinc-800 rounded text-[10px] text-zinc-500 font-mono">
                         {Array.isArray(data.text) ? 'ARRAY_STR' : 'SINGLE_STR'}
                       </div>
                     </div>
                     {data.charId && (
                       <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded-full">
                         <span className="text-[10px] font-bold text-zinc-500 uppercase">Speaker</span>
                         <select 
                           value={data.charId}
                           onChange={(e)=>{
                             setDialogueContent({...dialogueContent, [id]: {...data, charId: e.target.value}});
                           }}
                           className="bg-transparent text-xs font-bold text-indigo-400 outline-none"
                         >
                           {Object.keys(sceneInfo.characters).map(c => <option key={c} value={c}>{c}</option>)}
                         </select>
                       </div>
                     )}
                  </div>

                  {Array.isArray(data.text) ? (
                    <div className="space-y-3">
                       {data.text.map((line, lIdx) => (
                         <div key={lIdx} className="flex gap-4">
                           <div className="pt-3 text-[10px] font-mono text-zinc-700">{lIdx + 1}</div>
                           <textarea 
                             value={line}
                             onChange={(e)=>{
                               const newTexts = [...data.text];
                               newTexts[lIdx] = e.target.value;
                               setDialogueContent({...dialogueContent, [id]: {...data, text: newTexts}});
                             }}
                             className="flex-1 bg-zinc-800/50 border border-zinc-700 rounded-2xl p-4 text-sm focus:border-indigo-500 outline-none min-h-[80px] transition-all"
                           />
                           <button type="button" onClick={() => deleteDialogueLine(id, lIdx)} className="h-fit p-2 text-zinc-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14}/></button>
                         </div>
                       ))}
                       <button 
                        onClick={()=>{
                          setDialogueContent({...dialogueContent, [id]: {...data, text: [...data.text, "新台詞"]}});
                        }}
                        className="ml-8 text-[10px] font-black tracking-widest text-zinc-600 hover:text-indigo-400 transition-colors uppercase flex items-center gap-2"
                       >
                         <Plus size={12} /> Add Line to Array
                       </button>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                       <textarea 
                         value={data.text}
                         onChange={(e)=>setDialogueContent({...dialogueContent, [id]: {...data, text: e.target.value}})}
                         className="flex-1 bg-zinc-800/50 border border-zinc-700 rounded-2xl p-4 text-sm focus:border-indigo-500 outline-none transition-all"
                       />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* 代碼輸出的右側抽屜 */}
      <div className="w-[400px] bg-zinc-900 border-l border-zinc-800 flex flex-col">
        <div className="h-16 border-b border-zinc-800 flex items-center px-6 gap-3">
          <Terminal size={14} className="text-indigo-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Code Output</span>
        </div>
        <div className="flex-1 p-6 flex flex-col min-h-0">
          <div className="flex-1 bg-black/50 border border-zinc-800 rounded-3xl p-6 overflow-auto scrollbar-hide">
             <pre className="text-[11px] font-mono text-indigo-300/80 leading-relaxed whitespace-pre-wrap">
               {generatedCode}
             </pre>
          </div>
          <div className="mt-4 p-4 bg-zinc-800/50 rounded-2xl border border-zinc-800">
            <p className="text-[10px] leading-relaxed text-zinc-500 italic">
              此輸出包含全域常數定義。您可以直接複製並替換對話播放器中的數據部分。
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@300;400;600;800&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
};

if (window.React && window.ReactDOM) {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);
} else {
  document.getElementById('root').innerHTML = '<div class="p-10 text-red-400">React 尚未載入，請檢查 CDN 或網路。</div>';
}