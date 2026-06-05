/**
 * 混合题型题库 — AI 应用 / 单选 / 多选 / 代码题
 */

import type { InterviewQuestion } from '@/types/interview';

let _mid = 2000;

function mq(partial: Omit<InterviewQuestion, 'id'>): InterviewQuestion {
  return { id: `q${++_mid}`, format: 'essay', ...partial };
}

export const mixedQuestionBank: InterviewQuestion[] = [
  // ── AI 应用 · 简答 ──
  mq({
    question: '作为 AI 产品经理，你如何评估一个 RAG 系统上线后的效果？请列出核心指标。',
    category: 'AI 应用',
    jobs: ['产品经理', '算法工程师'],
    difficulty: 4,
    focusPoints: ['指标设计', 'RAG 理解', '业务价值'],
    referencePoints: ['召回率/准确率', 'Faithfulness、Answer Relevance', '用户满意度与任务完成率', '延迟与成本'],
    suggestedDuration: 180,
    sampleAnswer:
      '我会从离线+在线两层评估：离线看 Recall@K、MRR 和生成 Faithfulness；在线看用户采纳率、任务完成率、CSAT；同时监控 P95 延迟和单次调用成本，按场景设护栏指标。',
    explanation:
      'RAG 评估需兼顾检索质量与生成质量。离线指标快速迭代，在线指标验证真实价值。AI PM 需能解释每个指标对应的业务含义与 trade-off。',
  }),
  mq({
    question: 'Explain the difference between fine-tuning and RAG for enterprise LLM applications. When would you choose each?',
    category: 'AI 应用',
    jobs: ['产品经理', '算法工程师'],
    difficulty: 4,
    focusPoints: ['LLM architecture', 'trade-offs', 'English expression'],
    referencePoints: ['Fine-tuning: behavior/style, needs data & retrain', 'RAG: dynamic knowledge, lower cost to update', 'Hybrid approaches', 'Compliance and freshness'],
    suggestedDuration: 150,
    language: 'en',
    sampleAnswer:
      'Fine-tuning adapts model behavior with task-specific data but is costly to update. RAG injects fresh knowledge at inference with lower update cost. I choose RAG when knowledge changes frequently; fine-tuning when we need consistent tone or specialized reasoning patterns.',
    explanation:
      'Fine-tuning changes model weights; RAG augments context at query time. Enterprise apps often combine both: RAG for knowledge, fine-tuning/lightweight adapters for format and safety.',
  }),
  mq({
    question: '设计一款面向客服场景的 AI Agent，你会如何划分模块并处理幻觉问题？',
    category: 'AI 应用',
    jobs: ['产品经理', '后端开发', '算法工程师'],
    difficulty: 5,
    focusPoints: ['Agent 架构', '幻觉治理', '产品设计'],
    referencePoints: ['意图识别 → 工具调用 → 回复生成', '知识库 grounding + 引用溯源', '拒答/转人工策略', '人工反馈闭环'],
    suggestedDuration: 180,
    explanation:
      'Agent = Planner + Tools + Memory + Guardrails。幻觉治理核心：强制 citation、低置信度拒答、关键操作人工确认、持续 eval 与 red teaming。',
  }),

  // ── AI 应用 · 单选 ──
  mq({
    format: 'single_choice',
    question: '在 Prompt Engineering 中，Few-shot prompting 的主要作用是什么？',
    category: 'AI 应用',
    jobs: ['产品经理', '算法工程师'],
    difficulty: 2,
    focusPoints: ['Prompt 技巧', 'LLM 基础'],
    referencePoints: ['通过示例引导输出格式与推理模式'],
    suggestedDuration: 60,
    options: [
      { id: 'a', label: '减少模型参数量' },
      { id: 'b', label: '通过示例引导模型输出格式与推理模式' },
      { id: 'c', label: '替代微调的所有场景' },
      { id: 'd', label: '提高 GPU 利用率' },
    ],
    correctOptionIds: ['b'],
    explanation:
      'Few-shot 在 prompt 中提供若干输入-输出示例，让模型模仿格式与推理链。它不改变参数，也不能完全替代微调，但在快速验证场景非常有效。',
  }),
  mq({
    format: 'single_choice',
    question: 'Which metric best measures retrieval quality in a RAG pipeline?',
    category: 'AI 应用',
    jobs: ['算法工程师', '产品经理'],
    difficulty: 3,
    focusPoints: ['RAG metrics'],
    referencePoints: ['Recall@K, MRR'],
    suggestedDuration: 60,
    language: 'en',
    options: [
      { id: 'a', label: 'Perplexity' },
      { id: 'b', label: 'Recall@K / MRR' },
      { id: 'c', label: 'GPU utilization' },
      { id: 'd', label: 'Token price' },
    ],
    correctOptionIds: ['b'],
    explanation: 'Recall@K and MRR measure whether relevant documents are retrieved. Perplexity measures language modeling, not retrieval.',
  }),
  mq({
    format: 'single_choice',
    question: 'Transformer 中 Self-Attention 的时间复杂度（序列长度 n）约为？',
    category: '技术面试',
    jobs: ['算法工程师', '后端开发'],
    difficulty: 3,
    focusPoints: ['Transformer', '复杂度'],
    referencePoints: ['O(n²·d)'],
    suggestedDuration: 90,
    options: [
      { id: 'a', label: 'O(n)' },
      { id: 'b', label: 'O(n log n)' },
      { id: 'c', label: 'O(n²)' },
      { id: 'd', label: 'O(2ⁿ)' },
    ],
    correctOptionIds: ['c'],
    explanation: 'Standard self-attention computes an n×n attention matrix, hence O(n²) in sequence length (times head dimension).',
  }),

  // ── 多选 ──
  mq({
    format: 'multi_choice',
    question: '以下哪些属于 LLM 应用层常见的幻觉（Hallucination）治理手段？（多选）',
    category: 'AI 应用',
    jobs: ['产品经理', '算法工程师'],
    difficulty: 3,
    focusPoints: ['幻觉治理', '工程实践'],
    referencePoints: ['RAG grounding', 'Citation', 'Confidence threshold'],
    suggestedDuration: 90,
    options: [
      { id: 'a', label: 'RAG 检索增强 + 强制引用来源' },
      { id: 'b', label: '提高 learning rate' },
      { id: 'c', label: '低置信度拒答 / 转人工' },
      { id: 'd', label: '输出 JSON Schema 约束' },
      { id: 'e', label: '删除所有 system prompt' },
    ],
    correctOptionIds: ['a', 'c', 'd'],
    explanation:
      '幻觉治理常见手段：RAG+引用、拒答策略、结构化输出约束、fact-check 链路。提高 learning rate 与删除 system prompt 不能系统性降低幻觉。',
  }),
  mq({
    format: 'multi_choice',
    question: 'React 性能优化常用手段包括哪些？（多选）',
    category: '技术面试',
    jobs: ['前端开发'],
    difficulty: 3,
    focusPoints: ['React', '性能优化'],
    referencePoints: ['memo', 'virtualization', 'code splitting'],
    suggestedDuration: 90,
    options: [
      { id: 'a', label: 'React.memo / useMemo 避免无效重渲染' },
      { id: 'b', label: '在 render 中创建新对象作为 props' },
      { id: 'c', label: '路由级 Code Splitting' },
      { id: 'd', label: '虚拟列表处理长列表' },
      { id: 'e', label: '把所有 state 放在一个巨型对象' },
    ],
    correctOptionIds: ['a', 'c', 'd'],
    explanation: 'memo、code splitting、virtualization 是经典优化。render 中新建对象会导致子组件无效重渲染；巨型 state 反而增加更新开销。',
  }),

  // ── 代码题 ──
  mq({
    format: 'code',
    question: '实现函数 twoSum(nums, target)：返回和为 target 的两个元素下标（假设唯一解）。',
    category: '技术面试',
    jobs: ['前端开发', '后端开发', '算法工程师'],
    difficulty: 3,
    focusPoints: ['哈希表', '算法基础'],
    referencePoints: ['O(n) 时间', '一次遍历 + Map'],
    suggestedDuration: 600,
    codeConfig: {
      language: 'javascript',
      starterCode: `function twoSum(nums, target) {
  // 在此编写代码，返回 [i, j]
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (map.has(need)) return [map.get(need), i];
    map.set(nums[i], i);
  }
  return [];
}`,
      hint: '使用 Map 存储值→下标，遍历时查找 target - nums[i]',
      testCases: [
        { invoke: 'twoSum([2,7,11,15], 9)', expected: '[0,1]', description: '基础用例' },
        { invoke: 'twoSum([3,2,4], 6)', expected: '[1,2]', description: '非相邻元素' },
        { invoke: 'twoSum([3,3], 6)', expected: '[0,1]', description: '相同元素' },
      ],
    },
    explanation:
      '最优解：哈希表一次遍历 O(n)。key 存数值，value 存下标；每次检查 target - nums[i] 是否已存在。注意返回下标顺序。',
    sampleAnswer: '见标准 twoSum 哈希表解法，时间 O(n)，空间 O(n)。',
  }),
  mq({
    format: 'code',
    question: 'Implement function reverseString(s) that reverses a string.',
    category: '技术面试',
    jobs: ['前端开发', '后端开发'],
    difficulty: 2,
    focusPoints: ['字符串', '基础语法'],
    referencePoints: ['双指针或 split/reverse/join'],
    suggestedDuration: 300,
    language: 'en',
    codeConfig: {
      language: 'javascript',
      starterCode: `function reverseString(s) {
  return s.split('').reverse().join('');
}`,
      testCases: [
        { invoke: 'reverseString("hello")', expected: '"olleh"', description: 'basic' },
        { invoke: 'reverseString("AI")', expected: '"IA"', description: 'short string' },
      ],
    },
    explanation: 'Can use split/reverse/join O(n) or two-pointer swap. For interviews, mention time/space complexity.',
  }),
  mq({
    format: 'code',
    question: '编写函数 fib(n)，返回斐波那契数列第 n 项（n≥0，n=0 返回 0，n=1 返回 1）。',
    category: '技术面试',
    jobs: ['前端开发', '后端开发', '算法工程师'],
    difficulty: 3,
    focusPoints: ['动态规划', '递归'],
    referencePoints: ['O(n) 迭代', '避免指数递归'],
    suggestedDuration: 480,
    codeConfig: {
      language: 'javascript',
      starterCode: `function fib(n) {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const c = a + b;
    a = b;
    b = c;
  }
  return b;
}`,
      testCases: [
        { invoke: 'fib(0)', expected: '0', description: '边界 n=0' },
        { invoke: 'fib(1)', expected: '1', description: '边界 n=1' },
        { invoke: 'fib(10)', expected: '55', description: 'n=10' },
      ],
    },
    explanation: '面试中应优先给出 O(n) 迭代 DP，避免 naive 递归 O(2ⁿ)。可延伸矩阵快速幂 O(log n)。',
  }),

  // ── AI 产品 · 情景单选 ──
  mq({
    format: 'single_choice',
    question: 'AI 功能上线后用户反馈「回答经常过时」，作为 AI 产品经理你的首要动作是？',
    category: '情景问答',
    jobs: ['产品经理'],
    difficulty: 3,
    focusPoints: ['问题诊断', 'AI PM'],
    referencePoints: ['确认知识库时效性', 'RAG 链路排查'],
    suggestedDuration: 90,
    options: [
      { id: 'a', label: '立即全面微调基座模型' },
      { id: 'b', label: '排查知识库更新频率与 RAG 检索链路' },
      { id: 'c', label: '降低 temperature 至 0' },
      { id: 'd', label: '增加 max tokens' },
    ],
    correctOptionIds: ['b'],
    explanation: '「过时」通常是知识源或检索问题，应先排查 KB 更新、chunk、召回与 rerank，而非盲目微调或调参。',
  }),
];
