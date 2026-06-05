import { LegalHero } from "@/components/legal/legal-hero";
import { OFFICIAL_EMAIL } from "@/lib/site-config";

export const metadata = {
  title: "服务条款 — CareerCraft",
  description: "CareerCraft 服务条款，了解使用规则与双方权责。",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] dark:bg-black">
      <LegalHero
        title="服务条款"
        subtitle="最后更新于 2026 年 5 月 20 日"
      />
      <section className="max-w-4xl mx-auto px-5 py-16">
        <div className="bg-white dark:bg-[#1c1c1e] rounded-[24px] p-8 md:p-12 shadow-sm space-y-10 text-[15px] leading-relaxed text-apple-text-secondary dark:text-[#98989d]">

          <div>
            <h2 className="text-[19px] font-semibold text-apple-text dark:text-white mb-4">1. 服务概述</h2>
            <p className="mb-3">
              CareerCraft（以下简称「本服务」）是一款 AI 驱动的职业档案管理与简历智能适配平台。通过本服务，您可以录入个人经历与技能信息，由 AI 自动分析并为不同岗位生成专属优化的简历内容。
            </p>
            <p>
              使用本服务即表示您同意本条款。如您不同意，请停止使用。
            </p>
          </div>

          <div>
            <h2 className="text-[19px] font-semibold text-apple-text dark:text-white mb-4">2. 用户注册与账户安全</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>您须提供真实、准确的注册信息，并有义务及时更新。</li>
              <li>账户仅限本人使用，不得出借、转让或共享给他人。</li>
              <li>您对账户下的所有活动负责，请妥善保管密码。如发现异常登录，请立即联系我们。</li>
              <li>我们保留对长期未激活或存在异常行为的账户进行暂停或终止的权利。</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[19px] font-semibold text-apple-text dark:text-white mb-4">3. 服务使用规范</h2>
            <p className="mb-3">您同意不将本服务用于以下行为：</p>
            <ul className="list-disc list-inside space-y-2">
              <li>上传或生成包含违法、侵权、诽谤、骚扰、色情或其他不当内容的简历。</li>
              <li>利用自动化工具（爬虫、脚本等）大规模抓取、复制或滥用平台内容。</li>
              <li>干扰或破坏本服务的正常运行，或试图绕过安全机制。</li>
              <li>冒用他人身份或伪造个人信息进行注册或使用。</li>
              <li>将本服务生成的简历用于欺诈、虚假求职等不正当目的。</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[19px] font-semibold text-apple-text dark:text-white mb-4">4. AI 生成内容声明</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>本服务生成的简历内容由 AI 模型基于您提供的素材自动生成，仅供参考和辅助使用。</li>
              <li>AI 生成内容可能存在不准确或不完整的情况，建议您在使用前仔细审阅并修改。</li>
              <li>对于因 AI 生成内容导致的求职结果（包括但不限于未通过筛选、面试失败等），我们不承担任何责任。</li>
              <li>您应对最终提交给招聘方的简历内容承担全部责任。</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[19px] font-semibold text-apple-text dark:text-white mb-4">5. 知识产权</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>CareerCraft 的名称、Logo、界面设计、代码及算法模型的知识产权归本公司所有。</li>
              <li>您上传的原始素材和您最终编辑定稿的简历内容，其知识产权归您所有。</li>
              <li>您授予我们在服务运营和改进过程中对匿名化、聚合化的数据进行分析使用的权利。</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[19px] font-semibold text-apple-text dark:text-white mb-4">6. 付费服务</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>本服务提供免费版和付费版两种方案，具体功能差异以产品内说明为准。</li>
              <li>付费服务按订阅周期自动续费，您可随时在设置中取消，取消后当前周期结束后生效。</li>
              <li>已支付的费用原则上不予退还，特殊情况请通过客服渠道联系处理。</li>
              <li>价格如有调整，我们将提前通知，并在新的计费周期生效。</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[19px] font-semibold text-apple-text dark:text-white mb-4">7. 责任限制</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>本服务按「现状」提供，我们不对服务的可用性、准确性、及时性做出绝对保证。</li>
              <li>我们不对因使用本服务导致的间接损失（包括但不限于机会损失、数据丢失等）承担责任。</li>
              <li>因不可抗力（如自然灾害、网络攻击、第三方服务故障等）导致的服务中断，我们不承担责任。</li>
              <li>在任何情况下，我们的赔偿总额不超过您在过去 12 个月内为使用本服务支付的费用。</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[19px] font-semibold text-apple-text dark:text-white mb-4">8. 服务变更与终止</h2>
            <p className="mb-3">
              我们保留在任何时候修改、暂停或终止本服务（或其任何部分）的权利。重大变更我们将通过站内通知或邮件告知。
            </p>
            <p>如您违反本条款，我们有权终止您的账户并停止提供服务，且不退还已支付的费用。</p>
          </div>

          <div>
            <h2 className="text-[19px] font-semibold text-apple-text dark:text-white mb-4">9. 条款修改</h2>
            <p>
              我们可能不时更新本服务条款。更新后将在页面顶部标明更新日期。继续使用本服务即表示您同意修订后的条款。如对重大变更不同意，您应停止使用本服务。
            </p>
          </div>

          <div>
            <h2 className="text-[19px] font-semibold text-apple-text dark:text-white mb-4">10. 法律适用与争议解决</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>本条款适用中华人民共和国法律。</li>
              <li>因本条款产生的争议，双方应友好协商解决；协商不成的，提交本公司所在地有管辖权的人民法院裁决。</li>
            </ul>
          </div>

          <div className="pt-6 border-t border-[#d2d2d7]/40 dark:border-[#38383a]/40">
            <p className="text-[14px]">
              如有疑问，请通过以下方式联系我们：<br />
              <a href="/contact" className="text-apple-blue hover:underline">联系我们</a> &nbsp;或 &nbsp;
              <span className="text-apple-text dark:text-white">{OFFICIAL_EMAIL}</span>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
