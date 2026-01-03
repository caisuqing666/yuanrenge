'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="bg-cyber min-h-screen">
      <div className="screen">
        <div className="max-w-2xl mx-auto w-full px-4">
          {/* 返回首页 - 非常克制 */}
          <div className="mb-16">
            <Link href="/" className="text-xs text-[var(--text-muted)] opacity-50 hover:opacity-70 transition-opacity">
              ← 返回
            </Link>
          </div>

          {/* 主内容 */}
          <div className="space-y-8 text-[var(--text-secondary)] leading-relaxed">
            <p>
              这个空间不是为了让你更频繁地使用，
              <br />
              也不是为了让你依赖它来安抚情绪。
            </p>

            <p>
              临在之锚存在的目的很简单：
              <br />
              在一些不需要被分析、也不需要被推动的时刻，
              <br />
              给你一个可以短暂停留、重新站稳的地方。
            </p>

            <p>
              这里的核心体验会长期保持免费。
              <br />
              未来可能会出现一些付费模块，
              <br />
              它们不是升级版，也不是"更好的你"，
              <br />
              只是为少数希望进一步理解自身反应模式的人，
              <br />
              提供更清晰、但同样克制的观察视角。
            </p>

            <p>
              你不需要为了支持它而改变使用方式，
              <br />
              也不需要因为付费与否而获得不同对待。
            </p>

            <p className="text-[var(--text-primary)]">
              如果这个空间对你有过片刻帮助，
              <br />
              那已经足够。
            </p>
          </div>

          {/* 页脚：内核标识 */}
          <footer className="mt-20 pt-8 border-t border-[var(--border-subtle)]">
            <p className="text-xs text-[var(--text-muted)] opacity-50 text-center">
              元人格 · 反应模式
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}

