'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Material, MaterialFormData, MaterialCategory } from '@/types/material';

interface MaterialContextType {
  materials: Material[];
  addMaterial: (data: MaterialFormData) => void;
  updateMaterial: (id: string, data: Partial<MaterialFormData>) => void;
  deleteMaterial: (id: string) => void;
  getMaterialsByCategory: (category: MaterialCategory) => Material[];
  searchMaterials: (query: string) => Material[];
  filterBySkills: (skills: string[]) => Material[];
}

const STORAGE_KEY = 'careercraft-materials';

const MaterialContext = createContext<MaterialContextType | null>(null);

function generateId(): string {
  return `mat_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

const DEMO_MATERIALS: Material[] = [
  {
    id: 'demo_internship_1',
    title: '腾讯 AI Lab 产品实习生',
    category: 'internship',
    rawContent: '在腾讯 AI Lab 担任产品实习生，负责 AI 开放平台的产品设计和用户增长。期间设计了 3 个核心功能模块，通过用户调研和 A/B Test 验证产品方向，推动月活用户增长 40%。',
    star: { situation: 'AI 开放平台面临用户增长瓶颈，开发者反馈平台功能不够直观', task: '设计并上线 3 个核心功能模块，提升平台月活 30%', action: '通过用户访谈收集 50+ 条反馈，设计 PRD 并推动研发落地，设置 A/B Test 验证效果', result: '月活用户增长 40%，开发者满意度从 72% 提升至 89%' },
    tags: ['AI', 'B端产品', '用户增长'],
    skills: ['产品设计', '用户研究', '数据分析', 'PRD'],
    highlights: ['主导 3 个功能模块从 0 到 1', '推动月活增长 40%'],
    createdAt: '2025-12-01T00:00:00.000Z',
    updatedAt: '2025-12-01T00:00:00.000Z',
  },
  {
    id: 'demo_project_1',
    title: '智能驾驶疲劳检测系统',
    category: 'project',
    rawContent: '基于计算机视觉技术，开发了一套驾驶员疲劳状态实时检测系统。使用 YOLOv5 进行面部关键点检测，结合 PERCLOS 算法判断疲劳程度，在自动驾驶模拟环境下准确率达 96.5%。',
    star: { situation: '疲劳驾驶是交通事故的主要原因之一，需要低成本实时检测方案', task: '基于 CV 技术开发一套车载疲劳检测系统，准确率 >95%', action: '选用 YOLOv5 + PERCLOS 组合方案，采集 5000+ 样本训练模型，优化推理速度至 30fps', result: '准确率达 96.5%，推理速度 30fps，在 NVIDIA Jetson 上成功部署演示' },
    tags: ['计算机视觉', '深度学习', '边缘计算'],
    skills: ['Python', 'YOLOv5', 'OpenCV', 'PyTorch'],
    highlights: ['准确率 96.5%', '30fps 实时推理', '边缘端部署'],
    createdAt: '2026-03-01T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 'demo_competition_1',
    title: 'ACM-ICPC 亚洲区域赛金牌',
    category: 'competition',
    rawContent: '参加 ACM-ICPC 亚洲区域赛，在 200+ 支队伍中获得金牌（前 10%）。比赛涉及动态规划、图论、数据结构等算法题的限时解答，团队协作解决 7/12 题。',
    star: { situation: '区域赛竞争激烈，需要在 5 小时内解决尽可能多的算法难题', task: '团队 3 人在 5 小时内合作解题，目标是进入前 15% 获得金牌', action: '分工协作：一人读题分类，两人同步编码，实时讨论优化策略', result: '成功解出 7 题，排名前 10%，获得金牌' },
    tags: ['算法', '数据结构', '团队协作'],
    skills: ['C++', '算法竞赛', '动态规划', '图论'],
    highlights: ['前 10% 金牌', '200+ 队伍参赛'],
    createdAt: '2025-11-01T00:00:00.000Z',
    updatedAt: '2025-11-01T00:00:00.000Z',
  },
  {
    id: 'demo_campus_1',
    title: '学生会技术部部长',
    category: 'campus',
    rawContent: '担任校学生会技术部部长，管理 15 人技术团队，负责校学生会官网和小程序的开发维护。任期内推动上线了活动报名系统和失物招领平台，日活 2000+。',
    star: { situation: '学生会缺少信息化系统，活动报名和失物招领依赖人工处理效率低', task: '组建技术团队，搭建活动报名和失物招领两个核心系统', action: '招募并培训 15 人团队，制定技术方案和排期，使用 Vue + 微信小程序技术栈', result: '两个系统上线 2 个月，日活 2000+，失物找回率提升 60%' },
    tags: ['团队管理', 'Web开发', '小程序'],
    skills: ['Vue.js', '微信小程序', '项目管理', '团队领导'],
    highlights: ['管理 15 人团队', '日活 2000+'],
    createdAt: '2025-09-01T00:00:00.000Z',
    updatedAt: '2025-09-01T00:00:00.000Z',
  },
];

function loadMaterials(): Material[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    // First visit: seed demo data
    saveMaterials(DEMO_MATERIALS);
    return DEMO_MATERIALS;
  } catch {
    return DEMO_MATERIALS;
  }
}

function saveMaterials(materials: Material[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(materials));
  } catch { /* storage full - silently fail */ }
}

export function MaterialProvider({ children }: { children: ReactNode }) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setMaterials(loadMaterials());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveMaterials(materials);
  }, [materials, hydrated]);

  const addMaterial = useCallback((data: MaterialFormData) => {
    const now = new Date().toISOString();
    const material: Material = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setMaterials(prev => [material, ...prev]);
  }, []);

  const updateMaterial = useCallback((id: string, data: Partial<MaterialFormData>) => {
    setMaterials(prev =>
      prev.map(m =>
        m.id === id ? { ...m, ...data, updatedAt: new Date().toISOString() } : m
      )
    );
  }, []);

  const deleteMaterial = useCallback((id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
  }, []);

  const getMaterialsByCategory = useCallback(
    (category: MaterialCategory) => materials.filter(m => m.category === category),
    [materials]
  );

  const searchMaterials = useCallback(
    (query: string) => {
      const q = query.toLowerCase();
      return materials.filter(
        m =>
          m.title.toLowerCase().includes(q) ||
          m.rawContent.toLowerCase().includes(q) ||
          m.tags.some(t => t.toLowerCase().includes(q)) ||
          m.skills.some(s => s.toLowerCase().includes(q))
      );
    },
    [materials]
  );

  const filterBySkills = useCallback(
    (skills: string[]) =>
      materials.filter(m => skills.some(s => m.skills.includes(s))),
    [materials]
  );

  return (
    <MaterialContext.Provider
      value={{
        materials: hydrated ? materials : [],
        addMaterial,
        updateMaterial,
        deleteMaterial,
        getMaterialsByCategory,
        searchMaterials,
        filterBySkills,
      }}
    >
      {children}
    </MaterialContext.Provider>
  );
}

export function useMaterials(): MaterialContextType {
  const ctx = useContext(MaterialContext);
  if (!ctx) throw new Error('useMaterials must be used within MaterialProvider');
  return ctx;
}
