/**
 * 智能匹配 — 大厂/科技公司岗位库
 * 覆盖技术、产品、研发、策划、设计、运营等多方向
 */

export interface JobPositionSeed {
  id: string;
  title: string;
  company: string;
  department: string;
  industry: string;
  job_level: string;
  location: string;
  salary_range: string;
  jd_text: string;
  requirements: Record<string, unknown>;
  keywords: string[];
}

export const JOB_POSITIONS_SEED: JobPositionSeed[] = [
  {
    id: 'job-tencent-fe',
    title: '前端开发工程师（T12-T14）',
    company: '腾讯',
    department: '微信事业群 / 基础产品部',
    industry: '互联网',
    job_level: '中级-高级',
    location: '深圳 / 广州',
    salary_range: '25k-45k · 16薪',
    jd_text: `【岗位职责】
1. 负责微信生态核心产品（小程序、公众号、企业微信等）的前端架构设计与开发，保障亿级用户场景下的性能与稳定性；
2. 基于 React / TypeScript / 自研框架构建高性能 Web 与跨端应用，推动组件化、工程化与微前端落地；
3. 参与需求评审与技术方案设计，与产品、设计、后端紧密协作，推动功能高质量交付；
4. 持续优化首屏加载、交互体验与无障碍访问，建立前端监控与质量度量体系；
5. 关注 AI 辅助编程、低代码等前沿技术在业务中的落地探索。

【任职要求】
1. 本科及以上学历，计算机相关专业，3年以上大型互联网前端开发经验；
2. 精通 JavaScript/TypeScript，深入理解 React 生态及现代前端工程化（Webpack/Vite、CI/CD）；
3. 熟悉浏览器原理、性能优化、网络协议，有复杂 SPA 或跨端项目经验者优先；
4. 具备良好的代码规范、单元测试习惯与跨团队沟通能力；
5. 有开源贡献、技术博客或微信/QQ 生态开发经验者优先。`,
    requirements: { skills: ['React', 'TypeScript', '性能优化', '工程化'], education: '本科', experience: 3 },
    keywords: ['React', 'TypeScript', '前端架构', '性能优化', '微信生态', '跨端', '工程化', 'CI/CD'],
  },
  {
    id: 'job-tencent-pm',
    title: '高级产品经理（社交方向）',
    company: '腾讯',
    department: '社交平台产品部',
    industry: '互联网',
    job_level: '高级',
    location: '深圳',
    salary_range: '30k-50k · 16薪',
    jd_text: `【岗位职责】
1. 负责社交类核心功能的产品规划与全生命周期管理，制定产品路线图并推动落地；
2. 深入理解用户社交行为与增长逻辑，通过数据分析、用户研究验证产品假设；
3. 撰写高质量 PRD，协调设计、研发、运营、法务等多方资源，把控版本节奏与质量；
4. 跟踪竞品动态与行业趋势（AIGC 社交、年轻用户偏好等），提出创新产品方案；
5. 建立核心指标监控体系（DAU、留存、互动率），驱动产品持续迭代优化。

【任职要求】
1. 5年以上互联网产品经验，有社交/内容/社区类产品从 0 到 1 或规模化经验者优先；
2. 具备优秀的逻辑思维、数据分析能力（SQL/漏斗分析/A-B Test）与用户同理心；
3. 熟悉敏捷开发流程，能在复杂组织架构中推动跨部门协作；
4. 对 AI 产品化、UGC 生态有洞察者优先；
5. 本科及以上，有腾讯/字节/网易等大厂产品背景者优先。`,
    requirements: { skills: ['产品规划', '数据分析', '用户研究', 'PRD', 'A/B测试'], education: '本科', experience: 5 },
    keywords: ['产品经理', '社交产品', '用户增长', '数据分析', 'PRD', 'A/B测试', '竞品分析'],
  },
  {
    id: 'job-netease-game-design',
    title: '游戏系统策划',
    company: '网易',
    department: '雷火事业群 / 逆水寒手游',
    industry: '游戏',
    job_level: '中级',
    location: '杭州',
    salary_range: '18k-35k · 15薪',
    jd_text: `【岗位职责】
1. 负责 MMORPG 核心系统（战斗、经济、社交、成长线）的策划设计与文档输出；
2. 搭建数值模型，平衡游戏经济、战斗强度与玩家体验，配合程序实现并迭代调优；
3. 跟踪玩家行为数据，分析系统健康度，提出优化方案并推动版本更新；
4. 参与新玩法原型设计，与美术、程序、运营协作完成从概念到上线的全流程；
5. 关注行业优秀案例（开放世界、赛季制、UGC 等），持续学习并引入创新设计。

【任职要求】
1. 2年以上游戏策划经验，有 RPG/MMO 系统策划经验者优先；
2. 精通 Excel，具备数值建模能力，对游戏平衡性有深刻理解；
3. 良好的文档能力、沟通协调能力与玩家视角；
4. 热爱游戏，深度体验过多款主流网游/手游；
5. 计算机、数学、经济相关专业背景者优先。`,
    requirements: { skills: ['系统策划', '数值设计', 'Excel', '文档撰写'], education: '本科', experience: 2 },
    keywords: ['游戏策划', '系统策划', '数值平衡', 'MMORPG', '玩法设计', '数据分析'],
  },
  {
    id: 'job-netease-client',
    title: '游戏客户端开发工程师',
    company: '网易',
    department: '互动娱乐事业群',
    industry: '游戏',
    job_level: '中级-高级',
    location: '杭州 / 上海',
    salary_range: '22k-40k · 15薪',
    jd_text: `【岗位职责】
1. 负责 Unreal Engine / Unity 游戏客户端核心模块开发与性能优化；
2. 实现战斗、UI、网络同步、资源管理等系统，保障多端流畅运行；
3. 与策划、美术协作，建立高效的内容生产管线与工具链；
4. 参与引擎定制、Shader 优化、内存与帧率调优；
5. 跟进图形学、AI NPC 等新技术在游戏中的应用探索。

【任职要求】
1. 3年以上 C++/C# 游戏客户端开发经验，熟悉 UE4/UE5 或 Unity；
2. 深入理解游戏引擎架构、渲染管线、网络同步机制；
3. 有上线项目经验，具备性能 profiling 与问题定位能力；
4. 良好的团队协作与代码规范意识；
5. 有 3A 或大型 MMO 项目经验者优先。`,
    requirements: { skills: ['C++', 'Unreal Engine', 'Unity', '性能优化'], education: '本科', experience: 3 },
    keywords: ['C++', 'Unreal', 'Unity', '游戏客户端', '渲染优化', '网络同步'],
  },
  {
    id: 'job-bytedance-algo',
    title: '推荐算法工程师',
    company: '字节跳动',
    department: '抖音 / 推荐架构',
    industry: '互联网',
    job_level: '高级',
    location: '北京 / 上海',
    salary_range: '35k-65k · 15薪',
    jd_text: `【岗位职责】
1. 负责短视频/直播推荐系统的召回、排序、重排模型设计与迭代；
2. 基于大规模用户行为数据，构建多目标优化框架（时长、互动、留存、商业化）；
3. 探索 LLM、多模态、强化学习在推荐场景中的应用；
4. 与工程团队协作，推动模型在线 serving、A/B 实验与效果评估；
5. 跟踪 RecSys 顶会论文与工业界最佳实践，持续提升推荐效果。

【任职要求】
1. 硕士及以上，计算机/统计/数学相关专业，3年以上推荐/搜索/广告算法经验；
2. 精通 Python，熟悉 PyTorch/TensorFlow，掌握 LR/GBDT/DeepFM/DIN/Transformer 等模型；
3. 熟悉 Spark/Hive/Flink 等大数据工具，有亿级流量系统经验者优先；
4. 具备扎实的机器学习理论基础与实验设计能力；
5. 有 Kaggle 竞赛、顶会论文或开源项目者优先。`,
    requirements: { skills: ['Python', 'PyTorch', '推荐系统', '机器学习', 'Spark'], education: '硕士', experience: 3 },
    keywords: ['推荐算法', '深度学习', 'PyTorch', 'A/B测试', '多目标优化', 'LLM'],
  },
  {
    id: 'job-alibaba-backend',
    title: 'Java 后端开发工程师（云计算）',
    company: '阿里巴巴',
    department: '阿里云 / 弹性计算',
    industry: '云计算',
    job_level: '中级-高级',
    location: '杭州',
    salary_range: '28k-50k · 16薪',
    jd_text: `【岗位职责】
1. 负责阿里云 ECS/容器服务等核心产品的后端架构设计与开发；
2. 构建高可用、高并发的分布式系统，保障 SLA 99.95%+；
3. 参与微服务治理、Service Mesh、Serverless 等云原生技术落地；
4. 优化系统性能、成本与可观测性（Metrics/Tracing/Logging）；
5. 参与技术评审、Code Review，培养 junior 工程师。

【任职要求】
1. 3年以上 Java 后端开发经验，熟悉 Spring Boot/Spring Cloud 生态；
2. 深入理解分布式系统原理（CAP、一致性、限流熔断、消息队列）；
3. 熟悉 MySQL/Redis/Kafka/K8s/Docker 等中间件与基础设施；
4. 有大型互联网或云计算平台开发经验者优先；
5. 良好的系统设计能力与故障排查能力。`,
    requirements: { skills: ['Java', 'Spring Cloud', 'Kubernetes', '分布式系统'], education: '本科', experience: 3 },
    keywords: ['Java', '微服务', 'Kubernetes', '分布式', '高并发', '云原生'],
  },
  {
    id: 'job-apple-ios',
    title: 'Software Engineer, iOS',
    company: 'Apple',
    department: 'Software Engineering',
    industry: '消费电子',
    job_level: 'Senior',
    location: '上海 / 库比蒂诺（可选）',
    salary_range: '40k-80k · 股票期权',
    jd_text: `【About the Role】
Join Apple's world-class software engineering team to build innovative features for iOS, iPadOS, and visionOS. You will design and implement user-facing applications and frameworks that reach billions of users worldwide.

【Key Responsibilities】
• Design and develop high-quality, performant iOS applications using Swift and SwiftUI/UIKit;
• Collaborate with designers, PMs, and cross-functional teams to deliver seamless user experiences;
• Optimize app performance, memory usage, and battery efficiency;
• Write unit tests and participate in code reviews to maintain Apple's quality standards;
• Stay current with Apple platform technologies (WidgetKit, App Intents, Core ML).

【Qualifications】
• BS/MS in CS or equivalent experience; 3+ years iOS development;
• Expert in Swift, Objective-C, iOS SDK, Auto Layout, and concurrency;
• Strong understanding of MVC/MVVM/VIPER architectures;
• Experience with Instruments, CI/CD (Xcode Cloud), and App Store submission;
• Passion for craftsmanship, accessibility, and privacy-by-design.`,
    requirements: { skills: ['Swift', 'iOS', 'SwiftUI', 'Objective-C'], education: '本科', experience: 3 },
    keywords: ['Swift', 'iOS', 'SwiftUI', '移动开发', '性能优化', 'Apple生态'],
  },
  {
    id: 'job-apple-product-design',
    title: 'Product Design Engineer',
    company: 'Apple',
    department: 'Hardware Engineering',
    industry: '消费电子',
    job_level: 'Senior',
    location: '上海',
    salary_range: '45k-90k · 股票期权',
    jd_text: `【About the Role】
Apple's Product Design Engineering team creates the next generation of hardware products. You will work at the intersection of design, engineering, and manufacturing to bring iconic products from concept to mass production.

【Key Responsibilities】
• Lead mechanical design of complex product assemblies (iPhone, Mac, AirPods, etc.);
• Collaborate with Industrial Design to translate concepts into manufacturable solutions;
• Perform tolerance analysis, FEA simulation, and DFM/DFA optimization;
• Work with suppliers in Asia on prototyping, tooling, and production ramp;
• Drive design validation testing (DVT/PVT) and failure analysis.

【Qualifications】
• BS/MS in Mechanical Engineering; 5+ years consumer electronics experience;
• Expert in CAD (Creo/NX), GD&T, materials (aluminum, glass, polymers);
• Experience with injection molding, CNC, die casting, and assembly processes;
• Strong problem-solving skills and attention to detail;
• Excellent communication in English and Mandarin preferred.`,
    requirements: { skills: ['机械设计', 'CAD', 'DFM', '结构设计'], education: '本科', experience: 5 },
    keywords: ['产品设计', '机械工程', 'CAD', 'DFM', '消费电子', '原型验证'],
  },
  {
    id: 'job-tesla-autopilot',
    title: 'Machine Learning Engineer, Autopilot',
    company: 'Tesla',
    department: 'AI / Autopilot',
    industry: '智能汽车',
    job_level: 'Senior',
    location: '上海 / 美国德州',
    salary_range: '50k-100k · RSU',
    jd_text: `【About the Role】
Tesla's Autopilot team is pushing the boundaries of real-world AI. You will develop and deploy neural networks that power Full Self-Driving (FSD) capabilities on millions of vehicles worldwide.

【Key Responsibilities】
• Design and train deep learning models for perception (vision, radar, ultrasonic fusion);
• Build data pipelines processing petabytes of fleet driving data;
• Optimize models for Tesla's custom FSD chip (inference latency, power efficiency);
• Deploy models via OTA updates and monitor real-world performance;
• Collaborate with simulation, labeling, and hardware teams.

【Qualifications】
• MS/PhD in CS/EE/Robotics; 3+ years ML/CV experience in production;
• Expert in PyTorch, CUDA, computer vision (detection, segmentation, tracking);
• Experience with 3D perception, BEV, occupancy networks, or end-to-end driving;
• Strong C++ and Python skills; experience with large-scale training infrastructure;
• Passion for solving hard real-world AI problems at scale.`,
    requirements: { skills: ['PyTorch', '计算机视觉', 'C++', '自动驾驶'], education: '硕士', experience: 3 },
    keywords: ['机器学习', '自动驾驶', '计算机视觉', 'PyTorch', 'FSD', '感知算法'],
  },
  {
    id: 'job-tesla-manufacturing',
    title: 'Manufacturing Engineer',
    company: 'Tesla',
    department: 'Gigafactory Shanghai',
    industry: '智能制造',
    job_level: '中级',
    location: '上海临港',
    salary_range: '20k-35k · 13薪',
    jd_text: `【岗位职责 / Responsibilities】
1. 负责上海超级工厂生产线工艺优化、设备导入与量产爬坡；
2. 分析生产数据（OEE、FPY、Cycle Time），推动良率与产能提升；
3. 主导 PFMEA、Control Plan 等质量工具应用，降低制造成本；
4. 与研发、供应链协作，完成新车型/新产线的 NPI 项目；
5. 推动自动化、数字化制造（MES/SCADA）在产线的落地。

【任职要求 / Qualifications】
1. 本科及以上，机械/工业工程/自动化相关专业，2年以上制造业经验；
2. 熟悉汽车或消费电子制造工艺（冲压、焊装、涂装、总装）者优先；
3. 熟练使用 CAD、Minitab、Excel 数据分析；
4. 英语读写能力良好，适应快节奏高强度工作环境；
5. 有 Lean/Six Sigma 绿带/黑带者优先。`,
    requirements: { skills: ['制造工艺', '精益生产', 'PFMEA', '数据分析'], education: '本科', experience: 2 },
    keywords: ['制造工程', '精益生产', 'NPI', '良率', '自动化', 'Supercharger'],
  },
  {
    id: 'job-adidas-digital-pm',
    title: 'Digital Product Manager',
    company: '阿迪达斯 Adidas',
    department: 'Digital Commerce / Apps',
    industry: '零售消费',
    job_level: '高级',
    location: '上海',
    salary_range: '25k-45k · 14薪',
    jd_text: `【岗位职责】
1. 负责 adidas 中国官方 App / 小程序 / CRM 数字化产品的规划与迭代；
2. 设计会员体系、个性化推荐、O2O 全渠道购物体验，提升 DTC 转化率；
3. 基于用户行为数据与 A/B 测试驱动产品决策，对接全球 Digital HQ 需求；
4. 协调内部团队与外部 agency，管理产品 Roadmap 与 Sprint 交付；
5. 关注运动科技、可持续时尚、AR 试穿等创新数字化体验。

【任职要求】
1. 5年以上互联网/零售数字化产品经验，有电商/App 产品背景；
2. 熟悉用户旅程设计、数据分析（GA4/神策等）、敏捷开发；
3. 中英文流利，有跨国团队协作经验者优先；
4. 对运动品牌、潮流文化有热情与洞察；
5. 有 Nike/李宁/安踏等竞品研究经验者优先。`,
    requirements: { skills: ['数字化产品', 'CRM', '电商', '数据分析'], education: '本科', experience: 5 },
    keywords: ['产品经理', '数字化', 'DTC', '会员体系', '全渠道', '运动品牌'],
  },
  {
    id: 'job-adidas-brand',
    title: 'Brand Marketing Manager（品牌策划）',
    company: '阿迪达斯 Adidas',
    department: 'Brand Marketing',
    industry: '零售消费',
    job_level: '中级-高级',
    location: '上海',
    salary_range: '22k-40k · 14薪',
    jd_text: `【岗位职责】
1. 负责 adidas 核心品类（跑步/篮球/Originals）在中国市场的品牌传播与 Campaign 策划；
2. 制定年度/季度营销日历，整合 KOL、社交媒体、线下活动、联名合作等资源；
3. 与创意 agency 协作，输出 Brief 并把控创意质量与品牌调性一致性；
4. 追踪 Campaign ROI、品牌健康度指标（认知度、偏好度、购买意向）；
5. 洞察 Z 世代运动消费趋势，探索本土化创新营销玩法。

【任职要求】
1. 3年以上快消/运动/时尚品牌营销策划经验；
2. 优秀的创意审美、文案能力与项目管理能力；
3. 熟悉微博、小红书、抖音、B站等平台玩法与达人生态；
4. 中英文流利，有 4A 或 in-house 品牌团队经验者优先；
5. 热爱运动，对 adidas 品牌历史与 Three Stripes 文化有理解者优先。`,
    requirements: { skills: ['品牌策划', 'Campaign', '社交媒体', 'KOL营销'], education: '本科', experience: 3 },
    keywords: ['品牌营销', 'Campaign', 'KOL', '社交媒体', '运动品牌', '创意策划'],
  },
  {
    id: 'job-huawei-os',
    title: '鸿蒙 OS 系统开发工程师',
    company: '华为',
    department: '终端软件部 / HarmonyOS',
    industry: '操作系统',
    job_level: '高级',
    location: '深圳 / 南京 / 西安',
    salary_range: '30k-55k · 16薪',
    jd_text: `【岗位职责】
1. 负责 HarmonyOS 内核、框架层或系统服务的开发与优化；
2. 参与分布式软总线、跨设备协同、原子化服务等核心能力构建；
3. 优化系统性能、功耗、内存占用，保障多设备一致体验；
4. 与芯片、硬件、应用生态团队协同，推动 OS 能力开放与开发者支持；
5. 参与 OS 安全、隐私保护机制的设计与实现。

【任职要求】
1. 3年以上 C/C++ 系统软件开发经验，熟悉 Linux/Android 内核者优先；
2. 深入理解操作系统原理（进程调度、内存管理、文件系统、IPC）；
3. 有嵌入式、IoT 或多设备协同项目经验者优先；
4. 良好的代码质量意识与问题定位能力；
5. 计算机相关专业本科及以上。`,
    requirements: { skills: ['C++', '操作系统', 'HarmonyOS', '内核开发'], education: '本科', experience: 3 },
    keywords: ['HarmonyOS', 'C++', '操作系统', '分布式', '嵌入式', '系统开发'],
  },
  {
    id: 'job-meituan-data-pm',
    title: '数据产品经理',
    company: '美团',
    department: '到店事业群 / 数据平台',
    industry: '本地生活',
    job_level: '中级-高级',
    location: '北京',
    salary_range: '28k-48k · 15薪',
    jd_text: `【岗位职责】
1. 负责商家端/运营端数据产品（BI 看板、经营分析、智能诊断）的规划与设计；
2. 将业务需求转化为数据指标体系和产品功能，推动数据驱动决策落地；
3. 与数据工程师协作，设计数据采集、ETL、数据仓库模型；
4. 建立产品使用分析，持续优化数据产品的易用性与价值感知；
5. 探索 AI+BI（自然语言查数、智能归因）在商家场景的应用。

【任职要求】
1. 3年以上数据产品或 B 端产品经验，有本地生活/电商/ SaaS 背景者优先；
2. 熟悉 SQL，理解数据仓库、指标体系、漏斗分析等方法论；
3. 具备优秀的逻辑思维和跨团队沟通能力；
4. 有 Tableau/QuickBI/自研 BI 工具经验者优先；
5. 本科及以上，统计/计算机/商科背景均可。`,
    requirements: { skills: ['数据产品', 'SQL', 'BI', '指标体系'], education: '本科', experience: 3 },
    keywords: ['数据产品', 'BI', 'SQL', '指标体系', 'B端', '数据分析'],
  },
  {
    id: 'job-mihoyo-client',
    title: 'Unity 客户端开发（原神项目组）',
    company: '米哈游',
    department: '原神 / 客户端组',
    industry: '游戏',
    job_level: '中级-高级',
    location: '上海',
    salary_range: '25k-50k · 16薪',
    jd_text: `【岗位职责】
1. 负责开放世界游戏客户端核心系统开发（角色、战斗、任务、开放世界流式加载）；
2. 基于 Unity 引擎进行性能优化（Draw Call、内存、加载时间）；
3. 开发编辑器工具，提升策划/美术/content 生产效率；
4. 参与跨平台（PC/移动端/主机）适配与渲染特性开发；
5. 跟进图形学新技术（GPU Driven、Nanite 思路、全局光照）在游戏中的应用。

【任职要求】
1. 3年以上 Unity/C# 游戏开发经验，有开放世界或 AAA 项目经验者优先；
2. 熟悉 Unity 渲染管线、AssetBundle、热更新方案；
3. 良好的 C# 功底，了解设计模式与代码架构；
4. 热爱游戏，深度体验原神或其他开放世界作品；
5. 计算机相关专业本科及以上。`,
    requirements: { skills: ['Unity', 'C#', '游戏客户端', '性能优化'], education: '本科', experience: 3 },
    keywords: ['Unity', 'C#', '开放世界', '游戏开发', '渲染优化', '米哈游'],
  },
  {
    id: 'job-jd-supply-chain',
    title: '供应链产品专家',
    company: '京东',
    department: '京东物流 / 供应链科技',
    industry: '电商物流',
    job_level: '高级',
    location: '北京',
    salary_range: '30k-55k · 16薪',
    jd_text: `【岗位职责】
1. 负责京东物流 WMS/TMS/OMS 等供应链系统的产品规划与迭代；
2. 深入理解仓储、运输、配送全链路业务，设计智能化调度与库存优化方案；
3. 推动 AI 预测（销量预测、路径规划、智能分仓）在供应链中的落地；
4. 与业务方、技术团队协作，管理大型 B 端产品项目交付；
5. 建立供应链 SaaS 产品能力，服务外部商家与合作伙伴。

【任职要求】
1. 5年以上供应链/B 端/SaaS 产品经验，有物流、零售、制造业背景者优先；
2. 熟悉 WMS、ERP、供应链核心业务流程与 KPI 体系；
3. 具备复杂系统设计能力与项目管理经验；
4. 数据驱动思维，熟悉 SQL 与基础数据分析；
5. 本科及以上，有京东/顺丰/菜鸟经验者优先。`,
    requirements: { skills: ['供应链', 'B端产品', 'WMS', '物流'], education: '本科', experience: 5 },
    keywords: ['供应链', '物流', 'WMS', 'B端产品', '智能调度', 'SaaS'],
  },
  {
    id: 'job-xhs-content',
    title: '内容策略产品经理',
    company: '小红书',
    department: '社区产品部',
    industry: '内容社区',
    job_level: '中级',
    location: '上海',
    salary_range: '25k-45k · 15薪',
    jd_text: `【岗位职责】
1. 负责小红书社区内容生态策略（推荐分发、冷启动、创作者激励）的产品设计；
2. 分析内容消费数据，优化 Feed 流体验与创作者成长路径；
3. 设计社区治理、反作弊、内容质量评估机制；
4. 与算法、运营、商业化团队协作，平衡用户体验与商业目标；
5. 跟踪内容社区行业趋势（AIGC 创作、视频化、搜索等）。

【任职要求】
1. 3年以上内容/社区/推荐相关产品经验；
2. 对 UGC/PGC 生态有深刻理解，熟悉内容平台运营逻辑；
3. 数据敏感，具备 SQL 能力与 A/B 实验设计经验；
4. 小红书重度用户，对生活方式、美妆、旅行等垂类有洞察；
5. 本科及以上，有字节/快手/B站经验者优先。`,
    requirements: { skills: ['内容产品', '社区运营', '推荐策略', '数据分析'], education: '本科', experience: 3 },
    keywords: ['内容策略', '社区产品', 'UGC', '推荐', '创作者', '小红书'],
  },
  {
    id: 'job-sensetime-cv',
    title: '计算机视觉算法研究员',
    company: '商汤科技',
    department: '研究院 / 感知智能',
    industry: '人工智能',
    job_level: '高级',
    location: '上海 / 北京 / 深圳',
    salary_range: '35k-70k · 15薪',
    jd_text: `【岗位职责】
1. 负责计算机视觉前沿算法研发（检测、分割、OCR、多模态理解、AIGC）；
2. 将算法成果转化为可落地的产品能力，服务智慧城市、自动驾驶、金融等场景；
3. 跟踪 CVPR/ICCV/NeurIPS 等顶会进展，推动论文成果转化；
4. 参与大规模数据集构建、模型训练与部署优化；
5. 指导 junior 研究员，参与技术专利与论文发表。

【任职要求】
1. 硕士/博士，计算机/AI 相关专业，2年以上 CV 算法研发经验；
2. 精通 Python/PyTorch，在检测/分割/识别等方向有深入积累；
3. 顶会论文（CVPR/ICCV/ECCV/NeurIPS）或高质量开源项目者优先；
4. 有大规模训练、模型压缩、TensorRT 部署经验者优先；
5. 良好的英文读写能力与学术沟通能力。`,
    requirements: { skills: ['计算机视觉', 'PyTorch', '深度学习', '论文发表'], education: '硕士', experience: 2 },
    keywords: ['计算机视觉', '深度学习', 'PyTorch', 'AIGC', '目标检测', '算法研究'],
  },
  {
    id: 'job-dji-embedded',
    title: '嵌入式软件工程师（飞控系统）',
    company: '大疆 DJI',
    department: 'Flight Systems',
    industry: '智能硬件',
    job_level: '中级-高级',
    location: '深圳',
    salary_range: '22k-45k · 15薪',
    jd_text: `【岗位职责】
1. 负责无人机飞控系统嵌入式软件开发（姿态控制、导航、避障）；
2. 基于 RTOS/Linux 进行底层驱动、传感器融合、实时控制算法实现；
3. 参与硬件 bring-up、系统集成与飞行测试；
4. 优化代码性能、内存占用与功耗，保障飞行安全与稳定性；
5. 编写技术文档，参与代码审查与团队技术分享。

【任职要求】
1. 3年以上嵌入式 C/C++ 开发经验，熟悉 ARM/MIPS 架构；
2. 熟悉 RTOS（FreeRTOS/ThreadX）、I2C/SPI/UART 等通信协议；
3. 有 IMU/GPS/视觉传感器融合或 PID/卡尔曼滤波经验者优先；
4. 有无人机、机器人或自动驾驶项目经验者优先；
5. 电子/自动化/计算机相关专业本科及以上。`,
    requirements: { skills: ['嵌入式', 'C/C++', 'RTOS', '飞控'], education: '本科', experience: 3 },
    keywords: ['嵌入式', 'C++', 'RTOS', '飞控', '传感器融合', '无人机'],
  },
  {
    id: 'job-uiux-design',
    title: 'UI/UX 设计师',
    company: '网易',
    department: '网易有道 / 设计中心',
    industry: '互联网',
    job_level: '中级',
    location: '北京 / 杭州',
    salary_range: '18k-32k · 15薪',
    jd_text: `【岗位职责】
1. 负责教育/工具类 App 的 UI/UX 全流程设计，输出高保真原型与设计规范；
2. 参与用户研究、可用性测试，基于数据与反馈迭代设计方案；
3. 建立并维护 Design System，推动设计组件化与研发协作效率；
4. 与产品、研发紧密配合，保障设计还原度与体验一致性；
5. 关注 AI 辅助设计、无障碍设计等前沿实践。

【任职要求】
1. 3年以上 UI/UX 设计经验，有完整项目从 0 到 1 作品集；
2. 精通 Figma/Sketch，熟悉 iOS/Android 设计规范；
3. 具备用户同理心、信息架构与交互设计能力；
4. 有 Design System 建设或 B 端/教育产品设计经验者优先；
5. 设计、交互、视觉相关专业本科及以上。`,
    requirements: { skills: ['Figma', 'UI设计', 'UX设计', 'Design System'], education: '本科', experience: 3 },
    keywords: ['UI设计', 'UX', 'Figma', '交互设计', 'Design System', '用户研究'],
  },
  {
    id: 'job-qa-engineer',
    title: '测试开发工程师（SDET）',
    company: '腾讯',
    department: 'IEG / 质量保障部',
    industry: '互联网',
    job_level: '中级',
    location: '深圳 / 成都',
    salary_range: '20k-38k · 16薪',
    jd_text: `【岗位职责】
1. 负责游戏/平台产品的质量保障，设计测试策略与自动化测试框架；
2. 开发接口自动化、UI 自动化、性能/安全测试工具与平台；
3. 参与 CI/CD 流水线建设，推动测试左移与持续质量改进；
4. 分析线上故障与质量数据，建立质量度量与预警机制；
5. 与开发团队协作，推动代码质量与可测试性设计。

【任职要求】
1. 2年以上测试开发经验，计算机相关专业本科及以上；
2. 精通 Python/Java，熟悉 pytest/JUnit 等测试框架；
3. 熟悉 HTTP/TCP 协议，有接口测试、性能测试（JMeter/Locust）经验；
4. 了解 Docker/K8s，有 CI/CD（Jenkins/GitLab CI）实践经验；
5. 有游戏或大型互联网项目 QA 经验者优先。`,
    requirements: { skills: ['Python', '自动化测试', 'CI/CD', '性能测试'], education: '本科', experience: 2 },
    keywords: ['测试开发', 'SDET', '自动化测试', 'Python', 'CI/CD', '质量保障'],
  },
];

export const JOB_INDUSTRIES = [
  '全部',
  '互联网',
  '游戏',
  '云计算',
  '人工智能',
  '消费电子',
  '智能汽车',
  '零售消费',
  '操作系统',
  '本地生活',
  '电商物流',
  '内容社区',
  '智能硬件',
] as const;

export function getPositionById(id: string): JobPositionSeed | undefined {
  return JOB_POSITIONS_SEED.find((p) => p.id === id);
}
