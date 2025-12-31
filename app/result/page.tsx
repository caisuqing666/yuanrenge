'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { archetypes } from '@/content/archetypes';

function ResultContent() {
  const searchParams = useSearchParams();
  const archetypeId = searchParams.get('archetype') || 'carrier';

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
      {/* 中央柔光 - 像深夜有人把台灯调亮了一档 */}
      <div className="result-glow"></div>
      <div className="result-text-glow"></div>

      <div className="screen relative z-10">
        <div className="max-w-2xl mx-auto w-full px-4 text-center">
          {/* 识别句 - 主文本（被看见） */}
          <div className="animate-fade-in mb-16">
            <p className="result-statement">
              {archetype.identifyStatement}
            </p>
          </div>

          {/* 标签 - 紫色高潮 */}
          <div className="animate-fade-in-delay mb-12">
            <span className="result-label">
              {archetype.label}
            </span>
          </div>

          {/* 收尾句 - 小号，留白多 */}
          <div className="animate-fade-in-delay-2 mb-20">
            <p className="result-allow">
              {archetype.allowStatement}
            </p>
          </div>

          {/* 返回首页 */}
          <div className="animate-fade-in-delay-2 pt-8">
            <Link href="/" className="result-back text-sm">
              返回首页
            </Link>
          </div>
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
          <p className="text-[var(--text-muted)]">加载中...</p>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
