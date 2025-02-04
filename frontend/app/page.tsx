"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Baseline as Baseball, Search, TrendingUp, User, History, Italic as Crystal, ChevronRight } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ProcessedPlayerStats } from "@/lib/types";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [players, setPlayers] = useState<ProcessedPlayerStats[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<ProcessedPlayerStats | null>(null);
  const [confidenceLevel, setConfidenceLevel] = useState([85]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("current");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/players');
        const data = await response.json();
        setPlayers(data);
        if (data.length > 0) {
          setSelectedPlayer(data[0]);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading player data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedPlayer) {
      if (activeTab === "historical") {
        setChartData(selectedPlayer.historicalData);
      } else if (activeTab === "predicted") {
        setChartData(selectedPlayer.predictedData);
      }
    }
  }, [selectedPlayer, activeTab]);

  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!selectedPlayer) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-background to-background dark:from-blue-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4"
        >
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.3 }}
              className="bg-primary rounded-xl p-2"
            >
              <Baseball className="h-8 w-8 text-primary-foreground" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600">
                MLB Stats Hub
              </h1>
              <p className="text-muted-foreground">Advanced Baseball Analytics & Predictions</p>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative w-full md:w-64"
          >
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search players..."
              className="pl-8 bg-white/50 backdrop-blur-sm dark:bg-white/10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Players List */}
          <Card className="md:col-span-1 bg-white/50 backdrop-blur-sm border-0 shadow-lg dark:bg-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <User className="h-5 w-5" />
                Players
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                <motion.div className="space-y-3">
                  {filteredPlayers.map((player) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <div
                            className={`p-4 rounded-xl cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                              selectedPlayer.id === player.id
                                ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]"
                                : "hover:bg-secondary"
                            }`}
                            onClick={() => setSelectedPlayer(player)}
                          >
                            <motion.img
                              whileHover={{ scale: 1.1 }}
                              src={player.image}
                              alt={player.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                            />
                            <div className="flex-1">
                              <div className="font-semibold">{player.name}</div>
                              <div className="text-sm opacity-90">
                                {player.team} • {player.position}
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 opacity-50" />
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">{player.name}</h4>
                            <p className="text-sm text-muted-foreground">{player.bio}</p>
                            <div className="pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => setSelectedPlayer(player)}
                              >
                                View Full Stats
                              </Button>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Stats Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-2 space-y-6"
          >
            <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-lg dark:bg-white/10">
              <CardHeader className="border-b border-border/50">
                <CardTitle className="flex items-center justify-between text-xl">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    {selectedPlayer.name} - Stats Overview
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue="current" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="current">Current Stats</TabsTrigger>
                    <TabsTrigger value="historical">Historical</TabsTrigger>
                    <TabsTrigger value="predicted">Predictions</TabsTrigger>
                  </TabsList>
                  
                  <AnimatePresence mode="wait">
                    <TabsContent value="current">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                      >
                        <StatCard title="AVG" value={selectedPlayer.currentStats.avg} />
                        <StatCard title="HR" value={selectedPlayer.currentStats.hr} />
                        <StatCard title="RBI" value={selectedPlayer.currentStats.rbi} />
                        <StatCard title="OPS" value={selectedPlayer.currentStats.ops} />
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="historical">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center gap-2">
                          <History className="h-5 w-5 text-muted-foreground" />
                          <h3 className="text-lg font-semibold">Historical Performance</h3>
                        </div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                          className="h-[300px] bg-white/30 p-4 rounded-xl backdrop-blur-sm dark:bg-white/5"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                              <XAxis dataKey="year" stroke="currentColor" />
                              <YAxis yAxisId="left" domain={[0, 1]} stroke="currentColor" />
                              <YAxis yAxisId="right" orientation="right" domain={[0, 120]} stroke="currentColor" />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                                  borderRadius: "8px",
                                  border: "none",
                                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                }}
                              />
                              <Legend />
                              <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="avg"
                                name="Batting Average"
                                stroke="hsl(var(--primary))"
                                strokeWidth={3}
                                dot={{ strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                              />
                              <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="hr"
                                name="Home Runs"
                                stroke="hsl(var(--destructive))"
                                strokeWidth={3}
                                dot={{ strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </motion.div>
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="predicted">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Crystal className="h-5 w-5 text-muted-foreground" />
                            <h3 className="text-lg font-semibold">Predicted Performance</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Confidence Level:</span>
                            <div className="w-32">
                              <Slider
                                value={confidenceLevel}
                                onValueChange={setConfidenceLevel}
                                max={100}
                                step={1}
                              />
                            </div>
                            <span className="text-sm font-medium">{confidenceLevel}%</span>
                          </div>
                        </div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                          className="h-[300px] bg-white/30 p-4 rounded-xl backdrop-blur-sm dark:bg-white/5"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                              <XAxis dataKey="year" stroke="currentColor" />
                              <YAxis yAxisId="left" domain={[0, 1]} stroke="currentColor" />
                              <YAxis yAxisId="right" orientation="right" domain={[0, 120]} stroke="currentColor" />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                                  borderRadius: "8px",
                                  border: "none",
                                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                }}
                              />
                              <Legend />
                              <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="avg"
                                name="Predicted AVG"
                                stroke="hsl(var(--chart-1))"
                                strokeWidth={3}
                                strokeDasharray="5 5"
                                dot={{ strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                              />
                              <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="hr"
                                name="Predicted HR"
                                stroke="hsl(var(--chart-2))"
                                strokeWidth={3}
                                strokeDasharray="5 5"
                                dot={{ strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                              />
                              <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="rbi"
                                name="Predicted RBI"
                                stroke="hsl(var(--chart-3))"
                                strokeWidth={3}
                                strokeDasharray="5 5"
                                dot={{ strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                          className="grid grid-cols-3 gap-4 mt-6"
                        >
                          {selectedPlayer.predictedData.map((prediction, index) => (
                            <motion.div
                              key={prediction.year}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <Card className="bg-white/30 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-shadow dark:bg-white/5">
                                <CardHeader className="py-3 border-b border-border/50">
                                  <CardTitle className="text-sm">{prediction.year} Projection</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                  <div className="space-y-2">
                                    <div className="text-sm flex justify-between items-center">
                                      <span className="text-muted-foreground">AVG</span>
                                      <span className="font-semibold">{prediction.avg.toFixed(3)}</span>
                                    </div>
                                    <div className="text-sm flex justify-between items-center">
                                      <span className="text-muted-foreground">HR</span>
                                      <span className="font-semibold">{prediction.hr}</span>
                                    </div>
                                    <div className="text-sm flex justify-between items-center">
                                      <span className="text-muted-foreground">RBI</span>
                                      <span className="font-semibold">{prediction.rbi}</span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.div>
                    </TabsContent>
                  </AnimatePresence>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-white/30 backdrop-blur-sm p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow dark:bg-white/5"
    >
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </motion.div>
  );
}