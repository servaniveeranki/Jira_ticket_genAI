import { useState } from 'react'
import { Upload, FileText, Image, CheckCircle, AlertCircle, Loader2, ChevronDown, ChevronRight, Layers, Target, CheckSquare, Sparkles, BarChart3, Filter } from 'lucide-react'
import axios from 'axios'

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [customPrompt, setCustomPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [expandedEpics, setExpandedEpics] = useState({})
  const [expandedStories, setExpandedStories] = useState({})
  const [categoryFilter, setCategoryFilter] = useState('ALL')

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files)
    setUploadedFiles(files)
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (uploadedFiles.length === 0) {
      setError('Please upload at least one file (text or images)')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      
      // Add all files
      uploadedFiles.forEach((file) => {
        formData.append('files', file)
      })

      // Add custom prompt if provided
      if (customPrompt.trim()) {
        formData.append('customPrompt', customPrompt.trim())
      }

      const response = await axios.post('http://localhost:8000/api/generate-tickets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setResult(response.data)
    } catch (err) {
      console.error('Error:', err)
      setError(err.response?.data?.detail || 'Failed to generate tickets. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setUploadedFiles([])
    setCustomPrompt('')
    setResult(null)
    setError(null)
    setExpandedEpics({})
    setExpandedStories({})
    setCategoryFilter('ALL')
  }

  const toggleEpic = (epicIdx) => {
    setExpandedEpics(prev => ({ ...prev, [epicIdx]: !prev[epicIdx] }))
  }

  const toggleStory = (key) => {
    setExpandedStories(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleAllEpics = () => {
    if (Object.keys(expandedEpics).length > 0) {
      setExpandedEpics({})
      setExpandedStories({})
    } else {
      const allExpanded = {}
      result?.aiOutput?.epics?.forEach((_, idx) => {
        allExpanded[idx] = true
      })
      setExpandedEpics(allExpanded)
    }
  }

  const getFilteredEpics = () => {
    if (!result?.aiOutput?.epics) return []
    if (categoryFilter === 'ALL') return result.aiOutput.epics
    return result.aiOutput.epics.filter(epic => epic.category === categoryFilter)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation Bar */}
      <nav className="bg-slate-950/50 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  JIRA Ticket Generator
                </span>
                <p className="text-xs text-slate-400">AI-Powered Agile Planning</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <span className="text-xs text-slate-400">Powered by</span>
                <span className="text-sm font-semibold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text ml-2">Gemini AI</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            Transform Requirements into{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Actionable Tickets
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Upload requirements and diagrams. AI extracts comprehensive Epics, Stories, and Subtasks.
          </p>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/30">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">AI Analysis</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/30">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">Custom Prompts</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/30">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">Multi-file Support</span>
            </div>
          </div>
        </div>

        {/* Upload Form */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 px-8 py-5">
              <h2 className="text-2xl font-bold text-white">Configure Analysis</h2>
              <p className="text-cyan-100 mt-1">Customize AI prompt and upload files</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Custom Prompt Input */}
            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
              <label className="flex items-center gap-2 text-base font-bold text-white mb-4">
                <span className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-lg">
                  1
                </span>
                Custom AI Prompt (Optional)
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Enter custom instructions... (Leave empty for default)&#10;&#10;Example: 'Focus on security stories. Include acceptance criteria and story points.'"
                className="w-full h-32 px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none resize-none text-sm text-slate-200 placeholder-slate-500 transition-all"
              />
              <p className="text-xs text-slate-400 mt-3 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>Be specific: mention acceptance criteria, story points, or technical requirements.</span>
              </p>
            </div>

            {/* Combined File Upload */}
            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
              <label className="flex items-center gap-2 text-base font-bold text-white mb-4">
                <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-lg">
                  2
                </span>
                Upload Files
              </label>
              <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 hover:border-cyan-500 hover:bg-slate-900/30 transition-all cursor-pointer bg-slate-950/30">
                <input
                  type="file"
                  accept=".txt,image/*"
                  multiple
                  onChange={handleFilesChange}
                  className="hidden"
                  id="files-upload"
                />
                <label
                  htmlFor="files-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <div className="flex gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30 transform hover:scale-110 transition-transform">
                      <FileText className="w-7 h-7 text-white" />
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 transform hover:scale-110 transition-transform">
                      <Image className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <span className="text-base font-semibold text-slate-200 text-center mb-1">
                    {uploadedFiles.length > 0
                      ? `${uploadedFiles.length} file(s) selected`
                      : 'Click or drag files here'}
                  </span>
                  <span className="text-sm text-slate-400 text-center">
                    .txt files and images (PNG, JPG)
                  </span>
                </label>
              </div>
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-semibold text-slate-300 mb-3">Selected Files:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {uploadedFiles.map((file, idx) => (
                      <div
                        key={idx} 
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border ${
                          file.name.endsWith('.txt') 
                            ? 'bg-cyan-500/10 border-cyan-500/30' 
                            : 'bg-purple-500/10 border-purple-500/30'
                        }`}
                      >
                        <span className="text-xl">
                          {file.name.endsWith('.txt') ? '📄' : '🖼️'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
                          <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || uploadedFiles.length === 0}
                className="flex-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/50 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed transition-all shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6" />
                    Generate JIRA Tickets
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-8 py-4 border-2 border-slate-600 rounded-xl font-semibold text-slate-300 hover:bg-slate-800/50 hover:border-slate-500 transition-all"
              >
                Reset
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="m-8 bg-red-500/10 border-2 border-red-500/30 rounded-xl p-5 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-base font-bold text-red-300">Error</p>
                <p className="text-sm text-red-400 mt-1">{error}</p>
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Results Display */}
        {result && (
          <div className="max-w-7xl mx-auto mt-12">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
              {/* Success Header */}
              <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">
                        Tickets Generated Successfully!
                      </h2>
                      <p className="text-emerald-50 mt-1 text-base">
                        {result.stats.epics} Epic(s) • {result.stats.imagesProcessed} Image(s) Processed
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleAllEpics}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold text-sm transition-all flex items-center gap-2"
                  >
                    {Object.keys(expandedEpics).length > 0 ? 'Collapse All' : 'Expand All'}
                    <Layers className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stats and Filters */}
              <div className="px-8 pt-6 pb-4 bg-slate-900/30">
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setCategoryFilter('ALL')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      categoryFilter === 'ALL'
                        ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/50'
                        : 'bg-slate-900/30 border-slate-700/50 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {result.aiOutput.epics?.length || 0}
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-cyan-400 uppercase">All Epics</p>
                        <p className="text-sm text-slate-400">Complete overview</p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setCategoryFilter('FUNCTIONAL')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      categoryFilter === 'FUNCTIONAL'
                        ? 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-blue-500/50'
                        : 'bg-slate-900/30 border-slate-700/50 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {result.aiOutput.epics?.filter(e => e.category === 'FUNCTIONAL').length || 0}
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-blue-400 uppercase">Functional</p>
                        <p className="text-sm text-slate-400">Feature-focused</p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setCategoryFilter('NON-FUNCTIONAL')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      categoryFilter === 'NON-FUNCTIONAL'
                        ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/50'
                        : 'bg-slate-900/30 border-slate-700/50 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {result.aiOutput.epics?.filter(e => e.category === 'NON-FUNCTIONAL').length || 0}
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-purple-400 uppercase">Non-Functional</p>
                        <p className="text-sm text-slate-400">Quality & perf.</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Epics Display */}
              <div className="p-8 space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                {getFilteredEpics().map((epic, epicIdx) => {
                  const actualIdx = result.aiOutput.epics.indexOf(epic);
                  const isExpanded = expandedEpics[actualIdx];
                  const isFunctional = epic.category === 'FUNCTIONAL';
                  const categoryColor = isFunctional 
                    ? { bg: 'from-blue-900/30 to-indigo-900/30', border: 'border-blue-500/30', header: 'from-blue-600 to-indigo-600', badge: 'bg-blue-500', glow: 'shadow-blue-500/20' }
                    : { bg: 'from-purple-900/30 to-pink-900/30', border: 'border-purple-500/30', header: 'from-purple-600 to-pink-600', badge: 'bg-purple-500', glow: 'shadow-purple-500/20' };
                  
                  return (
                    <div key={actualIdx} className={`bg-gradient-to-br ${categoryColor.bg} rounded-xl border ${categoryColor.border} overflow-hidden shadow-lg ${categoryColor.glow} hover:shadow-xl transition-all`}>
                      <button
                        onClick={() => toggleEpic(actualIdx)}
                        className={`w-full bg-gradient-to-r ${categoryColor.header} px-6 py-4 text-left hover:opacity-90 transition-opacity`}
                      >
                        <div className="flex items-center gap-3 flex-wrap">
                          {isExpanded ? <ChevronDown className="w-5 h-5 text-white" /> : <ChevronRight className="w-5 h-5 text-white" />}
                          <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-lg backdrop-blur-sm">
                            EPIC {epic.epicNumber || actualIdx + 1}
                          </span>
                          <span className={`px-3 py-1 ${categoryColor.badge} text-white text-xs font-bold rounded-lg`}>
                            {epic.category || 'FUNCTIONAL'}
                          </span>
                          <h3 className="text-xl font-bold text-white flex-1">
                            {epic.summary}
                          </h3>
                          <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg">
                            <Target className="w-4 h-4 text-white/80" />
                            <span className="text-xs text-white/90 font-semibold">{epic.stories?.length || 0} Stories</span>
                          </div>
                        </div>
                        {isExpanded && (
                          <p className="text-white/90 mt-3 text-sm leading-relaxed">
                            {epic.description}
                          </p>
                        )}
                      </button>

                      {/* Stories */}
                      {isExpanded && (
                        <div className="p-6 space-y-3 bg-slate-900/20">
                          {epic.stories?.map((story, storyIdx) => {
                            const storyKey = `${actualIdx}-${storyIdx}`;
                            const isStoryExpanded = expandedStories[storyKey];
                            const priorityColors = {
                              'High': 'bg-red-500/20 text-red-300 border-red-500/40',
                              'Medium': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
                              'Low': 'bg-green-500/20 text-green-300 border-green-500/40'
                            };
                            const priorityColor = priorityColors[story.priority] || 'bg-slate-500/20 text-slate-300 border-slate-500/40';
                            
                            return (
                              <div key={storyIdx} className="bg-slate-800/50 rounded-lg border border-slate-700/50 shadow-md hover:shadow-lg transition-all overflow-hidden">
                                <button
                                  onClick={() => toggleStory(storyKey)}
                                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-3 text-left hover:opacity-90 transition-opacity"
                                >
                                  <div className="flex items-center gap-2 flex-wrap">
                                    {isStoryExpanded ? <ChevronDown className="w-4 h-4 text-white" /> : <ChevronRight className="w-4 h-4 text-white" />}
                                    <span className="px-2 py-1 bg-white/20 text-white text-xs font-bold rounded backdrop-blur-sm">
                                      STORY {story.storyNumber || `${epic.epicNumber || actualIdx + 1}.${storyIdx + 1}`}
                                    </span>
                                    {story.priority && (
                                      <span className={`px-2 py-1 text-xs font-bold rounded border ${priorityColor}`}>
                                        {story.priority}
                                      </span>
                                    )}
                                    <h4 className="text-base font-bold text-white flex-1">
                                      {story.summary}
                                    </h4>
                                    <div className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded">
                                      <CheckSquare className="w-3 h-3 text-white/80" />
                                      <span className="text-xs text-white/90 font-semibold">{story.subtasks?.length || 0}</span>
                                    </div>
                                  </div>
                                </button>
                                {isStoryExpanded && (
                                  <div className="p-5">
                                    <p className="text-sm text-slate-300 leading-relaxed mb-4">
                                      {story.description}
                                    </p>

                                    {/* Subtasks */}
                                    {story.subtasks && story.subtasks.length > 0 && (
                                      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                                          <span className="w-5 h-5 bg-emerald-500 rounded flex items-center justify-center text-white text-xs">
                                            {story.subtasks.length}
                                          </span>
                                          Subtasks
                                        </p>
                                        <div className="space-y-2">
                                          {story.subtasks.map((subtask, subIdx) => (
                                            <div key={subIdx} className="flex items-start gap-3 bg-slate-800/50 rounded-lg px-4 py-2.5 border border-slate-700/50 hover:border-emerald-500/50 transition-colors">
                                              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                                              <div className="flex-1">
                                                <span className="text-xs text-slate-500 font-semibold">
                                                  {subtask.subtaskNumber || `${story.storyNumber || `${epic.epicNumber || actualIdx + 1}.${storyIdx + 1}`}.${subIdx + 1}`}
                                                </span>
                                                <p className="text-sm text-slate-300 mt-0.5">
                                                  {subtask.summary}
                                                </p>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Download JSON */}
              <div className="p-8 pt-4 bg-slate-900/30 border-t border-slate-700/50">
                <button
                  onClick={() => {
                    const dataStr = JSON.stringify(result.aiOutput, null, 2)
                    const dataBlob = new Blob([dataStr], { type: 'application/json' })
                    const url = URL.createObjectURL(dataBlob)
                    const link = document.createElement('a')
                    link.href = url
                    link.download = 'jira-tickets.json'
                    link.click()
                  }}
                  className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-700 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  <BarChart3 className="w-6 h-6" />
                  Download JSON for JIRA
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
