import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { 
  LayoutDashboard, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Database, 
  Sparkles, 
  RefreshCcw, 
  Download,
  Users,
  Star,
  MapPin,
  MessageSquare,
  Search,
  Filter,
  Zap,
  Activity,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { generateSyntheticData, processPollData, PollResponse } from './lib/poll-utils';
import { generatePollInsights } from './services/geminiService';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4'];
const TOOLS = ["Python", "JavaScript", "TypeScript", "React", "Rust", "Go"];

export default function App() {
  const [allData, setAllData] = useState<PollResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  
  // Filters
  const [filterTool, setFilterTool] = useState<string>('all');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const liveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setAllData(generateSyntheticData(200));
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Live Simulation
  useEffect(() => {
    if (isLive) {
      liveIntervalRef.current = setInterval(() => {
        const newData = generateSyntheticData(1)[0];
        setAllData(prev => [newData, ...prev].slice(0, 500)); // Limit to 500
        toast.info(`New response from ${newData.region} recorded: ${newData.preferredTool}`, {
          icon: <Activity className="w-4 h-4 text-indigo-500" />,
          duration: 2000
        });
      }, 3000);
    } else if (liveIntervalRef.current) {
      clearInterval(liveIntervalRef.current);
    }
    return () => {
      if (liveIntervalRef.current) clearInterval(liveIntervalRef.current);
    };
  }, [isLive]);

  const filteredData = useMemo(() => {
    return allData.filter(d => {
      const matchTool = filterTool === 'all' || d.preferredTool === filterTool;
      const matchRegion = filterRegion === 'all' || d.region === filterRegion;
      const matchSearch = d.feedback.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTool && matchRegion && matchSearch;
    });
  }, [allData, filterTool, filterRegion, searchQuery]);

  const processedData = useMemo(() => processPollData(filteredData), [filteredData]);

  const handleRefresh = () => {
    setLoading(true);
    setAiInsights(null);
    setTimeout(() => {
      setAllData(generateSyntheticData(200));
      setLoading(false);
      toast.success("Poll database re-indexed successfully");
    }, 800);
  };

  const getAIInsights = async () => {
    setGeneratingAI(true);
    try {
      const summary = `
        Filtered Context: ${filterTool !== 'all' ? `Tool: ${filterTool}` : 'All Tools'}, ${filterRegion !== 'all' ? `Region: ${filterRegion}` : 'All Regions'}
        Dataset Size: ${processedData.totalResponses}
        Average Satisfaction: ${processedData.avgSatisfaction}
        Preferred Tools Dist: ${JSON.stringify(processedData.toolChartData)}
        Sample Sentiments: ${filteredData.slice(0, 5).map(d => d.feedback).join(". ")}
      `;
      const insights = await generatePollInsights(summary);
      setAiInsights(insights);
      toast.success("Deep Narrative Insights Synced");
    } catch (err) {
      setAiInsights("Simulation: Major trends indicate a shift towards TypeScript in Northern regions due to stricter enterprise safety requirements. Rust remains a high-satisfaction but low-adoption tool in this quadrant.");
    } finally {
      setGeneratingAI(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0c]">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="mb-6 relative"
          >
            <Activity className="w-16 h-16 text-indigo-500 mx-auto" />
            <Sparkles className="absolute top-0 right-1/4 w-4 h-4 text-emerald-400 animate-pulse" />
          </motion.div>
          <div className="space-y-1">
            <h3 className="text-white text-lg font-bold">Neural Engine Core</h3>
            <p className="text-slate-500 text-sm font-mono tracking-tighter uppercase">Initializing Multi-Modal Analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0a0c] text-slate-900 font-sans antialiased">
      <Toaster position="bottom-right" />
      
      {/* Dynamic Command Header */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-indigo-600 p-2.5 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)]"
          >
            <LayoutDashboard className="text-white w-6 h-6" />
          </motion.div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
              QUANTUM POLL
              <Badge variant="outline" className="text-[10px] py-0 border-indigo-500/30 text-indigo-600 font-mono">v3.0 ENTERPRISE</Badge>
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
              {isLive ? 'SYSTEM LIVE' : 'COLD ARCHIVE'}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center bg-slate-100 dark:bg-white/5 rounded-full px-4 py-1.5 border border-slate-200 dark:border-white/10">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Query node ID or text..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-sm focus:outline-none w-48 text-slate-700 dark:text-slate-300"
            />
          </div>
          
          <Button 
            variant={isLive ? "destructive" : "outline"} 
            size="sm" 
            onClick={() => setIsLive(!isLive)}
            className="rounded-full gap-2 transition-all"
          >
            <Zap className={`w-4 h-4 ${isLive ? 'fill-white animate-pulse' : ''}`} />
            {isLive ? 'Stop Simulation' : 'Go Live'}
          </Button>
          
          <Button variant="outline" size="icon" onClick={handleRefresh} className="rounded-full">
            <RefreshCcw className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 space-y-8">
        
        {/* Advanced Filters Panel */}
        <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
          <div className="space-y-1.5 lg:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <Filter className="w-3 h-3" /> System Filters
            </label>
            <div className="flex gap-2">
              <Select value={filterTool} onValueChange={setFilterTool}>
                <SelectTrigger className="bg-white dark:bg-black/20 border-slate-200 dark:border-white/10 rounded-xl shadow-sm">
                  <SelectValue placeholder="All Ecosystems" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ecosystems</SelectItem>
                  {TOOLS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterRegion} onValueChange={setFilterRegion}>
                <SelectTrigger className="bg-white dark:bg-black/20 border-slate-200 dark:border-white/10 rounded-xl shadow-sm">
                  <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  <SelectItem value="North">North Cluster</SelectItem>
                  <SelectItem value="South">South Cluster</SelectItem>
                  <SelectItem value="East">East Cluster</SelectItem>
                  <SelectItem value="West">West Cluster</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
             <MetricBox label="Inertia" value={processedData.avgSatisfaction} sub="Avg Rating" icon={<Star className="w-3 h-3" />} />
             <MetricBox label="Flux" value={filteredData.length.toString()} sub="Active Nodes" icon={<Activity className="w-3 h-3" />} />
             <MetricBox label="Sentiment" value="Positive" sub="Data Tone" icon={<MessageSquare className="w-3 h-3" />} />
          </div>
        </section>

        {/* Multi-Panel Dashboard */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Main Visual Panels */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stacked Analysis: Age vs Tool */}
              <Card className="border-slate-200 dark:border-white/10 dark:bg-black/20 shadow-none overflow-hidden hover:border-indigo-500/30 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold flex items-center justify-between">
                    Demographic Market Share
                    <BarChart3 className="w-4 h-4 text-indigo-500" />
                  </CardTitle>
                  <CardDescription>Tool preference distribution across age tiers</CardDescription>
                </CardHeader>
                <CardContent className="h-[280px] pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={processedData.ageGroupToolData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.3} />
                      <XAxis dataKey="age" fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis fontSize={10} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.8)' }} />
                      {TOOLS.map((tool, index) => (
                        <Bar key={tool} dataKey={tool} stackId="a" fill={COLORS[index % COLORS.length]} radius={index === TOOLS.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Spider Radar: Satisfaction Benchmarking */}
              <Card className="border-slate-200 dark:border-white/10 dark:bg-black/20 shadow-none overflow-hidden hover:border-indigo-500/30 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold flex items-center justify-between">
                    Ecosystem Capability Matrix
                    <PieChartIcon className="w-4 h-4 text-emerald-500" />
                  </CardTitle>
                  <CardDescription>Multi-dimensional analysis of tool sentiment</CardDescription>
                </CardHeader>
                <CardContent className="h-[280px] pt-4 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={processedData.radarData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" fontSize={10} />
                      <Radar name="Satisfaction Score" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Velocity Area Chart */}
            <Card className="border-slate-200 dark:border-white/10 dark:bg-black/20 shadow-none hover:border-indigo-500/30 transition-colors">
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-500" />
                    Ingestion Velocity
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={processedData.trendChartData}>
                      <defs>
                        <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.3} />
                      <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis fontSize={10} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="count" stroke="#6366f1" fillOpacity={1} fill="url(#velocityGrad)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
            </Card>
          </div>

          {/* Side Feed & AI Panels */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            
            {/* Live Feed Component */}
            <Card className="border-slate-200 dark:border-white/10 dark:bg-black/20 shadow-none h-[420px] flex flex-col">
              <CardHeader className="flex-none bg-slate-50/50 dark:bg-white/5 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Node Activity Feed</CardTitle>
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-none animate-pulse">Live</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-0 scrollbar-hide">
                <div className="divide-y divide-slate-100 dark:divide-white/5">
                  {allData.slice(0, 10).map((item, idx) => (
                    <motion.div 
                      key={item.id}
                      initial={{ backgroundColor: 'transparent' }}
                      animate={idx === 0 && isLive ? { backgroundColor: ['rgba(99,102,241,0.1)', 'transparent'] } : {}}
                      className="px-4 py-3 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center flex-none">
                        <Users className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono font-bold text-indigo-600 truncate">{item.id}</span>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">Just now</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                          Voted <span className="text-slate-900 dark:text-white font-bold">{item.preferredTool}</span> from {item.region}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Insights Engine */}
            <Card className="border-none bg-indigo-900/10 dark:bg-indigo-950/20 backdrop-blur-2xl border-t-4 border-indigo-600 overflow-hidden">
               <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="bg-indigo-600 p-2 rounded-lg">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <Badge variant="outline" className="border-indigo-500/50 text-indigo-500 font-mono text-[10px]">GEMINI-3 PRO</Badge>
                  </div>
                  <div>
                    <CardTitle className="text-indigo-900 dark:text-indigo-300">Cognitive Synthesis</CardTitle>
                    <CardDescription className="text-indigo-700/60 dark:text-indigo-400/60">AI analysis of current data slice</CardDescription>
                  </div>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="bg-white/40 dark:bg-black/40 rounded-xl p-4 min-h-[160px] text-sm leading-relaxed text-indigo-950 dark:text-indigo-200">
                    <AnimatePresence mode="wait">
                      {generatingAI ? (
                        <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                          <div className="h-2.5 bg-indigo-200 dark:bg-indigo-800 rounded-full w-full animate-pulse" />
                          <div className="h-2.5 bg-indigo-200 dark:bg-indigo-800 rounded-full w-3/4 animate-pulse" />
                          <div className="h-2.5 bg-indigo-200 dark:bg-indigo-800 rounded-full w-5/6 animate-pulse" />
                        </motion.div>
                      ) : aiInsights ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="italic font-serif">
                          "{aiInsights}"
                        </motion.div>
                      ) : (
                        <div className="text-center py-8 opacity-40">
                          Waiting for query...
                        </div>
                      )}
                    </AnimatePresence>
                 </div>
                 <Button 
                   onClick={getAIInsights} 
                   disabled={generatingAI}
                   className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30"
                 >
                   {generatingAI ? 'Processing...' : 'Generate New Insights'}
                 </Button>
               </CardContent>
            </Card>
          </div>
        </div>

        {/* Technical Data Table */}
        <Card className="border-slate-200 dark:border-white/10 dark:bg-black/20 shadow-none overflow-hidden hover:border-indigo-500/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 dark:bg-white/2 pb-4">
            <div>
              <CardTitle className="text-sm font-bold">Node Grid Exploration</CardTitle>
              <CardDescription>Direct database access for granular verification</CardDescription>
            </div>
            <div className="flex items-center gap-2">
               <Badge variant="secondary" className="bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400 font-mono">
                {filteredData.length}/{allData.length} NODES
               </Badge>
               <Button variant="outline" size="sm" className="h-8 gap-2">
                  <Download className="w-3.5 h-3.5" />
                  JSON
               </Button>
            </div>
          </CardHeader>
          <div className="max-h-[400px] overflow-auto border-t border-slate-200 dark:border-white/10">
            <Table>
              <TableHeader className="bg-slate-50/80 dark:bg-black/40 backdrop-blur sticky top-0 z-10">
                <TableRow className="hover:bg-transparent border-slate-200 dark:border-white/10">
                  <TableHead className="w-[120px] font-bold text-[10px] uppercase tracking-wider">Node Address</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-wider">Demographic</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-wider">Origin</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-wider">Protocol</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-wider">Fidelity</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-wider">Payload</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.slice(0, 20).map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5 border-slate-100 dark:border-white/5">
                    <TableCell className="font-mono text-xs text-indigo-600 font-bold">{item.id}</TableCell>
                    <TableCell className="text-xs">{item.ageGroup}</TableCell>
                    <TableCell className="text-xs">{item.region}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-bold border-indigo-200 bg-indigo-50/50 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-800">
                        {item.preferredTool}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < item.satisfaction ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-white/10'}`} />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500 italic text-[11px] truncate max-w-[250px]">
                      {item.feedback}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredData.length === 0 && (
              <div className="p-12 text-center text-slate-400">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-sm">Zero matching nodes found in the current cluster.</p>
              </div>
            )}
          </div>
        </Card>
      </main>

      <footer className="mt-20 border-t border-slate-200 dark:border-white/10 py-12 px-6 bg-white dark:bg-black/40 text-center">
         <div className="max-w-2xl mx-auto space-y-4">
            <LayoutDashboard className="w-8 h-8 text-indigo-500 mx-auto opacity-50" />
            <h4 className="font-bold text-slate-800 dark:text-white uppercase tracking-tighter">Nexus Intelligence Analytics</h4>
            <p className="text-slate-500 text-xs leading-relaxed max-w-md mx-auto">
              This interface is an advanced data-science prototype for polling aggregation. 
              Built with React 19, TypeScript, and Generative Intelligence.
            </p>
         </div>
      </footer>
    </div>
  );
}

function MetricBox({ label, value, sub, icon }: { label: string, value: string, sub: string, icon?: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 p-4 rounded-2xl space-y-1 hover:border-indigo-500/30 transition-all hover:shadow-lg group">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
        <div className="opacity-30 group-hover:opacity-100 group-hover:text-indigo-500 transition-all">{icon || <Activity className="w-3 h-3" />}</div>
      </div>
      <div className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">{value}</div>
      <div className="text-[10px] text-slate-500 font-medium uppercase font-mono">{sub}</div>
    </div>
  );
}

