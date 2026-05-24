'use client';

export function ContactForm() {
  return (
    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label className="block text-[13px] font-medium text-apple-text dark:text-white mb-2">
          您的邮箱
        </label>
        <input
          type="email"
          placeholder="your@email.com"
          className="w-full px-4 py-3 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[15px] text-apple-text dark:text-white placeholder:text-apple-text-secondary/50 border border-transparent focus:border-apple-blue focus:outline-none transition-colors"
        />
      </div>
      <div>
        <label className="block text-[13px] font-medium text-apple-text dark:text-white mb-2">
          咨询类型
        </label>
        <select className="w-full px-4 py-3 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[15px] text-apple-text dark:text-white border border-transparent focus:border-apple-blue focus:outline-none transition-colors appearance-none cursor-pointer">
          <option>功能建议</option>
          <option>Bug 报告</option>
          <option>账户问题</option>
          <option>付费咨询</option>
          <option>商务合作</option>
          <option>其他</option>
        </select>
      </div>
      <div>
        <label className="block text-[13px] font-medium text-apple-text dark:text-white mb-2">
          留言内容
        </label>
        <textarea
          rows={4}
          placeholder="请详细描述您的问题或建议……"
          className="w-full px-4 py-3 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[15px] text-apple-text dark:text-white placeholder:text-apple-text-secondary/50 border border-transparent focus:border-apple-blue focus:outline-none transition-colors resize-none"
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-apple-blue text-white text-[15px] font-semibold hover:opacity-90 transition-opacity"
      >
        发送留言
      </button>
      <p className="text-[12px] text-apple-text-secondary text-center">
        或者直接发送邮件至 1759486723@qq.com
      </p>
    </form>
  );
}
