import { LegalHero } from "@/components/legal/legal-hero";
import { OFFICIAL_EMAIL } from "@/lib/site-config";

export const metadata = {
  title: "隐私政策 — CareerCraft",
  description: "CareerCraft 隐私政策，了解我们如何收集、使用和保护您的个人信息。",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] dark:bg-black">
      <LegalHero
        title="隐私政策"
        subtitle="最后更新于 2026 年 5 月 20 日"
      />
      <section className="max-w-4xl mx-auto px-5 py-16">
        <div className="bg-white dark:bg-[#1c1c1e] rounded-[24px] p-8 md:p-12 shadow-sm space-y-10 text-[15px] leading-relaxed text-apple-text-secondary dark:text-[#98989d]">

          <div>
            <h2 className="text-[19px] font-semibold text-apple-text dark:text-white mb-4">1. 信息收集</h2>
            <p className="mb-3">我们仅收集为您提供服务所必需的信息：</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-apple-text dark:text-white">账户信息：</strong>注册时提供的姓名、邮箱地址和密码（加密存储）。</li>
              <li><strong className="text-apple-text dark:text-white">职业档案信息：</strong>您主动录入的教育背景、工作经历、项目经验、技能标签等。</li>
              <li><strong className="text-apple-text dark:text-white">简历文件：</strong>您上传的原始简历（PDF、Word 等格式）。</li>
              <li><strong className="text-apple-text dark:text-white">使用数据：</strong>功能使用频率、页面访问记录等匿名化的行为数据，用于改进产品体验。</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[19px] font-semibold text-apple-text dark:text-white mb-4">2. 信息使用</h2>
            <p className="mb-3">您的信息将仅用于以下目的：</p>
            <ul className="list-disc list-inside space-y-2">
              <li>为您提供简历分析、优化和定制等核心服务。</li>
              <li>改进 AI 模型效果与用户体验。</li>
              <li>发送与账户相关的重要通知（如服务变更、安全提醒）。</li>
              <li>匿名化统计分析，用于产品方向决策。</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[19px] font-semibold text-apple-text dark:text-white mb-4">3. 信息共享</h2>
            <p className="mb-3">我们承诺<strong className="text-apple-text dark:text-white">不会出售您的个人信息</strong>。仅在以下情况共享：</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-apple-text dark:text-white">获得您的明确同意：</strong>如您选择将简历分享给特定招聘方。</li>
              <li><strong className="text-apple-text dark:text-white">法律要求：</strong>根据法律法规或行政司法机构的要求披露。</li>
              <li><strong className="text-apple-text dark:text-white">服务提供商：</strong>与受合约约束的第三方（如云服务商、AI 服务商）合作，他们仅可因提供服务而访问必要数据。</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[19px] font-semibold text-apple-text dark:text-white mb-4">4. 数据安全</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>我们采取业界标准的安全措施保护您的数据，包括传输加密（TLS）、存储加密和访问控制。</li>
              <li>定期进行安全审计和漏洞扫描。</li>
              <li>员工访问用户数据须经过严格的权限审批流程。</li>
              <li>尽管我们尽最大努力保护数据，但无法保证网络传输的绝对安全。</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[19px] font-semibold text-apple-text dark:text-white mb-4">5. 数据存储与删除</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>您的数据存储于中国大陆境内的安全服务器。</li>
              <li>您可以随时在账户设置中删除个人数据和简历内容。</li>
              <li>账户注销后，您的个人数据将在 30 天内从我们的系统中彻底删除。</li>
              <li>为履行法律义务或解决争议，部分数据可能依法保留更长时限。</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[19px] font-semibold text-apple-text dark:text-white mb-4">6. Cookie 与追踪技术</h2>
            <p className="mb-3">
              我们使用必要的 Cookie 和本地存储来维持您的登录状态和个性化设置。我们也使用匿名化的分析工具（如访问量统计）来了解服务使用情况。
            </p>
            <p>您可以在浏览器设置中管理或禁用非必要的 Cookie，但这可能影响部分功能的正常使用。</p>
          </div>

          <div>
            <h2 className="text-[19px] font-semibold text-apple-text dark:text-white mb-4">7. AI 数据处理</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>提交给 AI 模型的数据在传输和处理完成后，AI 服务商不会将其用于模型训练。</li>
              <li>我们与 AI 服务商签订了严格的数据处理协议，确保您的数据仅在生成简历时被临时使用。</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[19px] font-semibold text-apple-text dark:text-white mb-4">8. 您的权利</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-apple-text dark:text-white">查阅权：</strong>您可随时查看我们存储的您的个人数据。</li>
              <li><strong className="text-apple-text dark:text-white">更正权：</strong>您可随时修改不准确的个人信息。</li>
              <li><strong className="text-apple-text dark:text-white">删除权：</strong>您可请求删除您的数据。</li>
              <li><strong className="text-apple-text dark:text-white">数据导出权：</strong>您可导出您的职业档案数据。</li>
              <li><strong className="text-apple-text dark:text-white">撤回同意：</strong>您可随时撤回数据处理的同意，不影响此前已处理的合法性。</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[19px] font-semibold text-apple-text dark:text-white mb-4">9. 未成年人保护</h2>
            <p>
              本服务面向具有完全民事行为能力的用户。我们不会故意收集未满 18 周岁未成年人的个人信息。如发现误收集，将立即删除。
            </p>
          </div>

          <div>
            <h2 className="text-[19px] font-semibold text-apple-text dark:text-white mb-4">10. 政策更新与联系方式</h2>
            <p className="mb-3">我们可能不时更新隐私政策。更新后将通过站内通知或邮件告知。继续使用即表示同意更新后的政策。</p>
            <p>
              隐私相关咨询，请联系：<br />
              <a href="/contact" className="text-apple-blue hover:underline">联系我们</a> &nbsp;或 &nbsp;
              <span className="text-apple-text dark:text-white">{OFFICIAL_EMAIL}</span>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
