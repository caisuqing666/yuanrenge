'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="bg-cyber min-h-screen">
      {/* 第一屏：这是什么 */}
      <section className="screen">
        <div className="text-center max-w-2xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-light mb-6 tracking-wide">
            <span className="text-gradient">临在之锚</span>
          </h1>
          <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-4 leading-relaxed">
            在此刻，站稳一下。
          </p>
          <p className="text-xs text-[var(--text-muted)] mb-12 opacity-70">
            看见你当下的反应模式
          </p>
          <Link href="#entry" className="btn-cyber inline-block relative z-10">
            看看我现在处在哪种状态
          </Link>

          {/* 临在之锚入口 - 与元人格同级，视觉更克制 */}
          <Link href="/anchor" className="anchor-entry">
            <p className="anchor-entry-text">
              如果你只是想先停一下
            </p>
            <span className="anchor-entry-btn">
              进入临在之锚
            </span>
          </Link>
        </div>
      </section>

      {/* 第二屏：入口选择 */}
      <section id="entry" className="screen-half">
        <div className="max-w-3xl mx-auto w-full px-4">
          <p className="text-center text-[var(--text-muted)] text-sm mb-12 animate-fade-in">
            选择一个更接近你此刻的入口
          </p>

          <div className="entry-cards-container grid md:grid-cols-3 gap-6 mb-16">
            <Link href="/explore/hesitation" className="entry-card group animate-fade-in">
              <div className="relative z-10">
                <h3 className="text-xl font-medium mb-2 text-[var(--text-primary)] transition-colors">
                  犹豫
                </h3>
                <p className="text-sm text-[var(--text-muted)]">
                  卡在选择里
                </p>
              </div>
            </Link>

            <Link href="/explore/emotional" className="entry-card group animate-fade-in-delay">
              <div className="relative z-10">
                <h3 className="text-xl font-medium mb-2 text-[var(--text-primary)] transition-colors">
                  情绪乱
                </h3>
                <p className="text-sm text-[var(--text-muted)]">
                  有点接不住
                </p>
              </div>
            </Link>

            <Link href="/explore/shutdown" className="entry-card group animate-fade-in-delay-2">
              <div className="relative z-10">
                <h3 className="text-xl font-medium mb-2 text-[var(--text-primary)] transition-colors">
                  什么都不想
                </h3>
                <p className="text-sm text-[var(--text-muted)]">
                  系统低电量
                </p>
              </div>
            </Link>
          </div>

          {/* 解释性文案 */}
          <p className="text-center text-[var(--text-muted)] text-sm leading-relaxed">
            卡住，并不一定是能力问题，
            <br />
            而是在不同状态下，你会启动不同的反应模式。
          </p>
        </div>
      </section>

      {/* 第三屏：你会得到什么 */}
      <section className="screen-half">
        <div className="max-w-xl mx-auto text-center px-4">
          <h2 className="text-lg text-[var(--text-muted)] mb-8">你会得到什么</h2>
          <div className="space-y-4 text-[var(--text-secondary)]">
            <p className="flex items-center justify-center gap-3">
              <span className="text-[var(--text-primary)]">看见</span>
              <span className="text-[var(--text-muted)]">—</span>
              <span>你为什么会这样</span>
            </p>
            <p className="flex items-center justify-center gap-3">
              <span className="text-[var(--text-primary)]">松绑</span>
              <span className="text-[var(--text-muted)]">—</span>
              <span>一句不逼你的话</span>
            </p>
            <p className="flex items-center justify-center gap-3">
              <span className="text-[var(--text-primary)]">微动</span>
              <span className="text-[var(--text-muted)]">—</span>
              <span>一个5分钟内能做的小事</span>
            </p>
          </div>
        </div>
      </section>

      {/* 第四屏：合规说明 */}
      <section className="py-20">
        <div className="max-w-xl mx-auto text-center px-4">
          <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-12">
            这是一次短暂的状态推演，不是建议，也不是判断。
            <br />
            <br />
            临在之锚用于自我探索与反思，
            <br />
            不构成心理、医疗或其他专业建议。
          </p>
          
          {/* 页脚：内核标识 */}
          <footer className="pt-8 border-t border-[var(--border-subtle)]">
            <p className="text-xs text-[var(--text-muted)] opacity-50">
              元人格 · 反应模式
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}
