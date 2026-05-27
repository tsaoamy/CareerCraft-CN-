"use client";

import { useState, useMemo } from "react";
import { FileEdit, Download, RefreshCw, Star, Sparkles, MessageCircle, Eye, Layout, Plus, Trash2, Wand2, Copy, Check, GraduationCap, Briefcase, Code2, User, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMaterials } from "@/lib/material-context";
import { AICopilotWidget } from "@/components/ai-copilot/copilot-widget";

const TEMPLATES = [
  { id: "modern", name: "现代简约", color: "from-[#0071e3] to-[#5ac8fa]", icon: "📄" },
  { id: "classic", name: "经典专业", color: "from-[#5856d6] to-[#8944ab]", icon: "📋" },
  { id: "tech", name: "科技极客", color: "from-[#34c759] to-[#30d158]", icon: "⚡" },
];

const SAMPLE_SECTIONS = [
  { id: "summary", label: "个人简介", icon: User, placeholder: "3-5年产品经验，擅长数据驱动决策..." },
  { id: "skills", label: "专业技能", icon: Code2, placeholder: "Python, SQL, 数据分析, 产品设计..." },
  { id: "education", label: "教育背景", icon: GraduationCap, placeholder: "XX大学 · 计算机科学 · 本科 · 2020-2024" },
  { id: "experience", label: "工作经历", icon: Briefcase },
  { id: "projects", label: "项目经验", icon: Layout },
  { id: "awards", label: "荣誉奖项", icon: Award, placeholder: "全国大学生数学建模竞赛一等奖 · 2023" },
];

const ATS_TIPS = [
  { icon: "📊", text: "为每个项目添加可量化的数据成果（提升了 X%、服务了 Y 用户）" },
  { icon: "🎯", text: "使用 STAR 法则重组项目描述，突出你的个人贡献" },
  { icon: "🔍", text: "检查关键词覆盖：确保简历中包含目标 JD 的核心技能词汇" },
  { icon: "👁️", text: "优化排版：在每段经历的标题中突出角色和核心成果" },
  { icon: "✂️", text: "控制简历在1-2页，优先展示与目标岗位最相关的经历" },
  { icon: "🔤", text: "使用行业通用的专业术语，方便 ATS 系统识别关键能力" },
];

const AI_ENHANCE_TIPS = [
  "突出我在项目中「主导」和「从0到1构建」的关键角色",
  "为每个项目补充量化成果（百分比、用户数、营收影响）",
  "用行业关键词替换笼统表述（如用「用户增长」替换「用户变多」）",
  "按照「挑战→行动→成果」的逻辑重组每段经历",
  "将技术栈和工具链单独列出，方便面试官快速识别",
];

interface ResumeSection {
  id: string;
  label: string;
  content: string;
}

export default function ResumeBuilderPage() {
  const { materials } = useMaterials();
  const [activeTemplate, setActiveTemplate] = useState("modern");
  const [jobTitle, setJobTitle] = useState("");
  const [showAITips, setShowAITips] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sections, setSections] = useState<ResumeSection[]>([
    { id: "summary", label: "个人简介", content: "具备3年互联网产品经验，擅长数据驱动的产品设计与用户增长。" },
    { id: "skills", label: "专业技能", content: "产品设计、用户研究、数据分析、SQL、PRD撰写、A/B测试、项目管理、Axure、Figma" },
    { id: "education", label: "教育背景", content: "XX大学 · 计算机科学与技术 · 本科 · 2020-2024" },
    { id: "experience", label: "工作经历", content: "" },
    { id: "projects", label: "项目经验", content: "" },
    { id: "awards", label: "荣誉奖项", content: "全国大学生创新创业大赛金奖 · 2022" },
  ]);

  const [aiEnhancing, setAiEnhancing] = useState<string | null>(null);

  const handleAIAction = (sectionId: string, tip: string) => {
    setAiEnhancing(sectionId);
    setTimeout(() => {
      setSections(prev => prev.map(s => {
        if (s.id !== sectionId) return s;
        if (sectionId === "summary") return { ...s, content: s.content + "\n\n✨ AI增强：拥有从0到1完整产品经验，曾主导某SaaS产品DAU从5K增长至50K（+900%），擅长通过用户分群和A/B实验驱动数据决策。" };
        if (sectionId === "skills") return { ...s, content: s.content + "\n\n✨ AI建议补充：用户增长、竞品分析、Scrum敏捷管理、Google Analytics" };
        return { ...s, content: s.content + "\n\n✨ AI优化：" + tip };
      }));
      setAiEnhancing(null);
    }, 1500);
  };

  const handleAddSection = () => {
    const newSection: ResumeSection = {
      id: `custom_${Date.now()}`,
      label: "自定义板块",
      content: "",
    };
    setSections(prev => [...prev, newSection]);
  };

  const handleRemoveSection = (id: string) => {
    setSections(prev => prev.filter(s => s.id !== id));
  };

  const handleCopyAll = () => {
    const fullText = sections
      .filter(s => s.content.trim())
      .map(s => `## ${s.label}\n${s.content}`)
      .join("\n\n");
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const materialCount = materials.length;
  const materialSections = useMemo(() => {
    if (materials.length === 0) return [];
    return materials.slice(0, 5).map(m => ({
      id: m.id,
      title: m.title,
      company: m.star.situation.slice(0, 40),
      highlights: m.highlights.slice(0, 2),
      skills: m.skills.slice(0, 5),
    }));
  }, [materials]);

  const versions = [
    { role: "腾讯 AI 产品经理版", score: 83, status: "已生成", time: "2 小时前", skills: ["产品设计", "数据分析", "AI平台"], template: "modern" },
    { role: "阿里数据分析师版", score: 78, status: "已生成", time: "5 小时前", skills: ["SQL", "Python", "Tableau"], template: "classic" },
    { role: "字节跳动运营版", score: 81, status: "已生成", time: "昨天", skills: ["用户增长", "内容运营", "数据分析"], template: "tech" },
    { role: "美团产品经理版", score: 76, status: "已生成", time: "昨天", skills: ["PRD", "竞品分析", "项目管理"], template: "modern" },
  ];

  const atsScores = [
    { item: "关键词匹配", score: 90, tip: "与目标JD关键词高度一致" },
    { item: "技能覆盖", score: 82, tip: "覆盖80%以上岗位要求技能" },
    { item: "结构规范", score: 95, tip: "ATS友好格式，分节清晰" },
    { item: "可读性", score: 87, tip: "排版简洁，重点突出" },
    { item: "量化成果", score: 78, tip: "建议增加更多数据支撑" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-5 py-10 md:py-14 animate-fade-in-up">
      {/* AI 导师横幅 */}
      {/* AI Mentor Banner — Starry Sky */}
      <div className="relative mb-8 overflow-hidden rounded-3xl nebula-hero border border-white/10 p-6">
        <div className="shooting-star" /><div className="shooting-star" />
        <div className="constellation-dot" style={{top:'8%',left:'10%'}} />
        <div className="constellation-dot" style={{top:'18%',left:'40%'}} />
        <div className="constellation-dot" style={{top:'10%',left:'70%'}} />
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-[19px] font-semibold text-white mb-1">
              AI 简历导师已就绪
            </h2>
            <p className="text-[14px] text-blue-100/70 mb-3">
              不是"AI 替你写"，而是"AI 陪你写"。输入目标岗位，AI 自动从素材库生成针对性简历。点击右下角 <MessageCircle className="w-4 h-4 inline text-blue-300" /> 随时提问！
            </p>
            <div className="flex flex-wrap gap-2">
              {["如何写项目经历？", "STAR法则是什么？", "帮我评测简历", "面试官会问什么？"].map((tip) => (
                <span
                  key={tip}
                  className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-[13px] text-blue-100 cursor-pointer hover:bg-white/20 transition-colors"
                >
                  {tip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="mb-10">
        <h1 className="text-[32px] md:text-[40px] font-bold tracking-tight text-apple-text dark:text-white">
          AI 简历定制
        </h1>
        <p className="text-[15px] text-apple-text-secondary mt-1.5">
          一个职业档案，多岗位智能适配
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        {/* Left: Template + Job Input */}
        <div className="space-y-5">
          {/* Template Selection */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Layout className="w-[17px] h-[17px] text-apple-blue" />
                <CardTitle className="text-[15px]">简历模板</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTemplate(t.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${
                      activeTemplate === t.id
                        ? "border-apple-blue bg-[#e8f4fd] dark:bg-[#003366]"
                        : "border-[#d2d2d7] dark:border-[#38383a] hover:border-apple-blue/30"
                    }`}
                  >
                    <span className="text-[24px]">{t.icon}</span>
                    <div>
                      <p className="text-[14px] font-semibold text-apple-text dark:text-white">{t.name}</p>
                      <div className={`w-12 h-1 mt-1 rounded-full bg-gradient-to-r ${t.color}`} />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Job Title Input */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Briefcase className="w-[17px] h-[17px] text-apple-purple" />
                <CardTitle className="text-[15px]">目标岗位</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="如：腾讯AI产品经理"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
              <p className="text-[12px] text-apple-text-secondary mt-2">
                AI 将根据目标岗位自动优化简历内容
              </p>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[15px]">📦 素材统计</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <div className="flex-1 p-3 rounded-xl bg-[#e8f4fd] dark:bg-[#003366] text-center">
                  <div className="text-[24px] font-bold text-apple-blue">{materialCount}</div>
                  <div className="text-[11px] text-apple-blue/70">段经历</div>
                </div>
                <div className="flex-1 p-3 rounded-xl bg-[#f4f1fa] dark:bg-[#2d1445] text-center">
                  <div className="text-[24px] font-bold text-apple-purple">{versions.length}</div>
                  <div className="text-[11px] text-apple-purple/70">个版本</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle & Right: Resume Editor */}
        <div className="lg:col-span-2 space-y-5">
          {/* Toolbar */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={editMode ? "default" : "outline"}
                onClick={() => setEditMode(!editMode)}
                className="gap-1.5"
              >
                <FileEdit className="w-3.5 h-3.5" />
                {editMode ? "预览模式" : "编辑模式"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() => setShowAITips(!showAITips)}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" />
                AI 建议
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="gap-1.5" onClick={handleCopyAll}>
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "已复制" : "复制全文"}
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5">
                <Download className="w-3.5 h-3.5" /> 导出 PDF
              </Button>
              <Button size="sm" className="gap-1.5">
                <Eye className="w-3.5 h-3.5" /> 预览
              </Button>
            </div>
          </div>

          {/* AI Tips Panel */}
          {showAITips && (
            <div className="bg-[#0071e3]/5 dark:bg-[#0071e3]/10 rounded-2xl p-5 border border-[#0071e3]/10 animate-fade-in-up">
              <p className="text-[13px] font-medium text-[#0071e3] mb-3">
                💡 AI 简历导师建议你关注以下改进点：
              </p>
              <div className="space-y-2">
                {ATS_TIPS.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-[14px] shrink-0">{tip.icon}</span>
                    <p className="text-[13px] text-[#1d1d1f] dark:text-[#f5f5f7]">{tip.text}</p>
                  </div>
                ))}
              </div>
              <p className="text-[12px] text-[#86868b] mt-3">
                点击右下角 AI 助手获取详细的个性化建议 →
              </p>
            </div>
          )}

          {/* Resume Editor */}
          <div className={`apple-card divide-y divide-[#d2d2d7]/40 dark:divide-[#38383a]/40 ${activeTemplate === "classic" ? "font-serif" : activeTemplate === "tech" ? "font-mono" : ""}`}>
            {/* Header */}
            <div className="p-6 md:p-8 bg-gradient-to-r from-[#0071e3]/5 via-transparent to-transparent">
              <h2 className="text-[28px] font-bold text-apple-text dark:text-white">
                {jobTitle || "你的姓名"}
              </h2>
              <p className="text-[14px] text-apple-text-secondary mt-1">
                📧 your.email@example.com · 📱 138-0000-0000 · 📍 北京市
              </p>
            </div>

            {/* Sections */}
            {sections.map((section) => (
              <div key={section.id} className="p-6 md:p-8 group relative">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[16px] font-semibold text-apple-text dark:text-white flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-apple-blue" />
                    {section.label}
                  </h3>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleAIAction(section.id, AI_ENHANCE_TIPS[Math.floor(Math.random() * AI_ENHANCE_TIPS.length)])}
                      disabled={aiEnhancing === section.id}
                      className="p-1.5 rounded-lg hover:bg-[#e8f4fd] dark:hover:bg-[#003366] text-apple-blue transition-colors"
                      title="AI 增强"
                    >
                      <Wand2 className={`w-3.5 h-3.5 ${aiEnhancing === section.id ? 'animate-spin' : ''}`} />
                    </button>
                    {!["summary", "skills", "education"].includes(section.id) && (
                      <button
                        onClick={() => handleRemoveSection(section.id)}
                        className="p-1.5 rounded-lg hover:bg-[#ffebee] dark:hover:bg-[#3d1111] text-apple-red transition-colors"
                        title="删除板块"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                {editMode ? (
                  <textarea
                    value={section.content}
                    onChange={(e) => setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: e.target.value } : s))}
                    className="w-full min-h-[80px] p-3.5 rounded-xl border border-[#d2d2d7] dark:border-[#48484a] bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[14px] text-apple-text dark:text-white resize-y focus:outline-none focus:ring-2 focus:ring-apple-blue/40 focus:border-apple-blue"
                    placeholder={section.content || "输入内容..."}
                    rows={4}
                  />
                ) : (
                  <p className="text-[14px] text-apple-text dark:text-white leading-relaxed whitespace-pre-line">
                    {section.content || (
                      <span className="text-apple-text-secondary italic">点击「编辑模式」添加内容</span>
                    )}
                  </p>
                )}

                {/* AI Enhance Tips for this section */}
                {editMode && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {AI_ENHANCE_TIPS.slice(0, 3).map((tip, i) => (
                      <button
                        key={i}
                        onClick={() => handleAIAction(section.id, tip)}
                        disabled={aiEnhancing === section.id}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-[#e8f4fd] dark:bg-[#003366] text-apple-blue hover:bg-apple-blue hover:text-white transition-colors"
                      >
                        ✨ {tip.slice(0, 20)}...
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Add Section Button */}
            {editMode && (
              <div className="p-6 md:p-8 flex justify-center">
                <Button variant="ghost" size="sm" onClick={handleAddSection} className="gap-1.5 text-apple-text-secondary">
                  <Plus className="w-4 h-4" /> 添加板块
                </Button>
              </div>
            )}
          </div>

          {/* Material Integration */}
          {materialSections.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-[17px] h-[17px] text-apple-green" />
                  <CardTitle className="text-[15px]">从素材库快速引用</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2.5">
                  {materialSections.map((m) => (
                    <div key={m.id} className="flex items-start gap-3 p-3.5 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] hover:bg-[#e8f4fd] dark:hover:bg-[#003366] transition-colors cursor-pointer group">
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-medium text-apple-text dark:text-white">{m.title}</p>
                        <p className="text-[12px] text-apple-text-secondary mt-0.5">{m.company}...</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {m.skills.map(s => (
                            <span key={s} className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#e8f4fd] dark:bg-[#003366] text-apple-blue">{s}</span>
                          ))}
                        </div>
                      </div>
                      <Plus className="w-4 h-4 text-apple-blue opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Resume Versions */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[19px] font-semibold tracking-tight text-apple-text dark:text-white">
            我的简历版本
          </h2>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setEditMode(true)}>
            <Plus className="w-3.5 h-3.5" /> 新建版本
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {versions.map((v, i) => (
            <div key={i} className="apple-card p-6 group hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-[17px] font-semibold tracking-tight text-apple-text dark:text-white">
                    {v.role}
                  </h3>
                  <p className="text-[12px] text-apple-text-secondary mt-1">{v.time}</p>
                </div>
                <Badge variant={v.score >= 80 ? "success" : "warning"}>{v.score}分</Badge>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {v.skills.map((s) => (
                  <Badge key={s} variant="accent" className="text-[11px]">{s}</Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Download className="w-3.5 h-3.5" /> PDF
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Download className="w-3.5 h-3.5" /> DOCX
                </Button>
                <Button size="sm" variant="ghost" className="gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5" /> 重新生成
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ATS Score */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Star className="w-[18px] h-[18px] text-apple-orange" />
            <CardTitle>ATS 评分系统</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {atsScores.map((item) => (
              <div key={item.item}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-[14px] font-medium text-apple-text dark:text-white">
                      {item.item}
                    </span>
                    <p className="text-[11px] text-apple-text-secondary mt-0.5">{item.tip}</p>
                  </div>
                  <span className="text-[15px] font-semibold text-apple-blue">{item.score}</span>
                </div>
                <div className="h-2 bg-[#f5f5f7] dark:bg-[#2c2c2e] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-apple-blue to-apple-purple transition-all duration-1000"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* New Generate CTA */}
      <div className="mt-10 text-center p-10 apple-card">
        <FileEdit className="w-12 h-12 text-apple-blue mx-auto mb-4" />
        <h3 className="text-[19px] font-semibold tracking-tight text-apple-text dark:text-white mb-2">
          还没有简历？开始你的第一份 AI 简历
        </h3>
        <p className="text-[14px] text-apple-text-secondary mb-5">
          选择目标岗位，AI 自动从你的素材库生成针对性简历
        </p>
        <Button size="lg" className="gap-2" onClick={() => setEditMode(true)}>
          <FileEdit className="w-5 h-5" />
          开始编辑简历
        </Button>
      </div>

      {/* AI 职业顾问悬浮助手 */}
      <AICopilotWidget />
    </div>
  );
}
