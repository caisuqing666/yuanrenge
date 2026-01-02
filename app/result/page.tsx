'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { archetypes } from '@/content/archetypes';

function ResultContent() {
  const searchParams = useSearchParams();
  const archetypeId = searchParams.get('archetype') || 'overload';

  const archetype = archetypes[archetypeId];

  if (!archetype) {
    return (
      <div className="bg-cyber min-h-screen flex items-center justify-center">
        <p className="text-[var(--text-muted)]">未找到结果</p>
      </div>
    );
  }

  return (
    <main className="result-page min-h-screen relative overflow-hidden">
      {/* 雾状光域 - 低亮度安全区 */}
      <div className="result-glow"></div>
      <div className="result-text-glow"></div>

      <div className="screen relative z-10">
        <div className="max-w-2xl mx-auto w-full px-4 text-center">
          {/* 元人格句 - 核心层（只出现一次，停住的那一刻） */}
          <div className="animate-fade-in mb-20">
            <p className="result-core">
              {archetype.core.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i === 0 && <br />}
                </span>
              ))}
            </p>
          </div>

          {/* 允许句 - 给身体发通行证 */}
          <div className="animate-fade-in-delay mb-16">
            <p className="result-allow">
              {archetype.allowStatement}
            </p>
          </div>

          {/* 返回首页 */}
          <div className="animate-fade-in-delay-2 pt-8 mb-12">
            <Link href="/" className="result-back text-sm">
              返回首页
            </Link>
          </div>
          
          {/* 页脚：内核标识 */}
          <footer className="pt-8 border-t border-[var(--border-subtle)] opacity-30">
            <p className="text-xs text-[var(--text-muted)]">
              元人格 · 反应模式
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-cyber min-h-screen flex items-center justify-center">
          <p className="text-[var(--text-muted)]">...</p>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
