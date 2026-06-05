/** 本地验证用 — 运行: npx tsx src/lib/resume-extract.test-sample.ts */
import { parseResumeContent } from './resume-extract';

const SAMPLE = `
张三
13812345678 | zhang@example.com

教育背景
2020.09 - 2024.06  清华大学  计算机科学与技术  本科

实习经历
2023.06 - 2023.09  腾讯科技  产品策划实习生
● 负责 XX 功能需求分析与原型设计
● 通过 A/B 测试提升转化率 12%

项目经历
2023.03 - 2023.06  智能推荐系统
● 基于 Python 搭建推荐算法，服务 10万+ 用户

荣获奖项
2022.10  国家励志奖学金
2023.05  全国大学生数学建模竞赛  国家一等奖
● 团队队长，负责模型设计与论文撰写

校园经历
2021.09 - 2022.06  校学生会  宣传部部长
● 策划校园文化节，覆盖 3000+ 师生
2022.03 - 2023.03  XX计算机协会  社长

专业技能
Python、SQL、数据分析、产品设计
`;

const result = parseResumeContent(SAMPLE);
console.log('识别经历数:', result.experiences.length);
for (const e of result.experiences) {
  console.log(`- [${e.category}] ${e.title} (${e.dateRange})`);
}

const hasAward = result.experiences.some((e) => /奖学金|一等奖/.test(e.title + e.description));
const hasCampus = result.experiences.some((e) => /学生会|协会|部长|社长/.test(e.title));
console.log('奖项识别:', hasAward ? 'OK' : 'FAIL');
console.log('校园任职识别:', hasCampus ? 'OK' : 'FAIL');
