'use client';

import { useEffect, useState } from 'react';
import { getSettings } from '@/lib/storage';
import { getCurrentPhase, PHASE_INFO } from '@/lib/data';
import { AppSettings, ConditionId, Phase } from '@/types';

type TapingInfo = {
  title: string;
  blurb: string;
  // A YouTube search URL is used when a specific, verified video ID is not
  // available. Opens search results so the user can pick a trusted source.
  searchUrl: string;
};

const TAPING_GUIDES: Record<ConditionId, TapingInfo> = {
  general: {
    title: 'General knee taping',
    blurb: 'Basic kinesiology tape pattern for general knee support and proprioception.',
    searchUrl:
      'https://www.youtube.com/results?search_query=how+to+tape+knee+general+kinesiology+physio',
  },
  acl: {
    title: 'ACL support taping',
    blurb: 'Tape pattern to support the ACL during activity. Not a substitute for rehab.',
    searchUrl: 'https://www.youtube.com/results?search_query=how+to+tape+knee+ACL+injury+physio',
  },
  mcl: {
    title: 'MCL support taping',
    blurb: 'Medial support pattern to offload the MCL while walking and during activity.',
    searchUrl: 'https://www.youtube.com/results?search_query=how+to+tape+knee+MCL+physio',
  },
  pcl: {
    title: 'PCL support taping',
    blurb: 'Posterior support pattern used to limit PCL stress during activity.',
    searchUrl: 'https://www.youtube.com/results?search_query=how+to+tape+knee+PCL+physio',
  },
  meniscus: {
    title: 'Meniscus support taping',
    blurb: 'Decompression-style taping to offload the meniscus during loading.',
    searchUrl: 'https://www.youtube.com/results?search_query=how+to+tape+knee+meniscus+physio',
  },
  patellar: {
    title: "Patellar / Runner's knee taping",
    blurb: 'McConnell-style patellar tracking tape for anterior knee pain and runner’s knee.',
    searchUrl:
      'https://www.youtube.com/results?search_query=how+to+tape+patellar+tendon+runners+knee',
  },
  'post-surgical': {
    title: 'Post-surgical knee taping',
    blurb: 'Gentle support patterns appropriate after knee surgery. Clear with your surgeon first.',
    searchUrl:
      'https://www.youtube.com/results?search_query=how+to+tape+knee+post+surgery+physio',
  },
};

type EquipmentCard = {
  id: 'bands' | 'sleeve' | 'ice';
  icon: string;
  name: string;
  purpose: string;
  phases: Record<Phase, { when: string; how: string }>;
  cautions: string;
};

const EQUIPMENT: EquipmentCard[] = [
  {
    id: 'ice',
    icon: '\u{1F9CA}', // ice cube
    name: 'Ice pack',
    purpose: 'Calms swelling and pain flares.',
    phases: {
      1: {
        when: '3 to 4 times per day, always after exercise or when swelling spikes.',
        how: '15 to 20 minutes on, never directly on skin. Use a thin cloth as a barrier.',
      },
      2: {
        when: 'After every session, and when pain flares.',
        how: '15 to 20 minutes. Elevate the leg while icing for bonus decongestion.',
      },
      3: {
        when: 'Mainly after loading work or when soreness is unusual.',
        how: '15 minutes, elevated. Skip it if the knee feels calm.',
      },
      4: {
        when: 'Only for flares after running or lateral work.',
        how: '15 minutes post-activity. Not needed on quiet days.',
      },
    },
    cautions: 'Never directly on skin. Stop if skin goes numb or burns.',
  },
  {
    id: 'sleeve',
    icon: '\u{1F9B5}', // leg emoji, close enough
    name: 'Knee sleeve',
    purpose: 'Warmth, proprioception, mild compression during activity.',
    phases: {
      1: {
        when: 'While walking around or doing light chores.',
        how: 'Slide on before activity. Remove when resting or sleeping.',
      },
      2: {
        when: 'During walks and strength sessions.',
        how: 'On during activity, off at night. Keep it clean and dry.',
      },
      3: {
        when: 'Optional during loaded work or long walks.',
        how: 'Use for comfort, not as a crutch. Progress should come from strength.',
      },
      4: {
        when: 'Optional, mainly for return-to-sport confidence.',
        how: 'Use sparingly during runs or sport. Aim to wean off.',
      },
    },
    cautions: 'Do not rely on it as a substitute for strengthening. Remove at night.',
  },
  {
    id: 'bands',
    icon: '\u{27B0}', // curly loop
    name: 'Resistance bands',
    purpose: 'Adds load to strengthening exercises without hammering the joint.',
    phases: {
      1: {
        when: 'Not yet. Focus on reactivation and pain control.',
        how: 'Skip this phase. Wait until cleared in Phase 2.',
      },
      2: {
        when: 'Light band for side leg raises, clamshells, and TKEs when prescribed.',
        how: 'Anchor securely. Slow and controlled reps, no bouncing.',
      },
      3: {
        when: 'Regular part of strengthening on session days.',
        how: 'Progress tension gradually. Keep form clean before adding more.',
      },
      4: {
        when: 'Warm-ups and accessory work alongside sport-specific drills.',
        how: 'Use for activation. Main load shifts to bodyweight and gym work.',
      },
    },
    cautions: 'Only use as prescribed by your exercise list. Stop if pinching starts.',
  },
];

export default function ResourcesPage() {
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setSettings(getSettings());
  }, []);

  if (!mounted || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  const phase = getCurrentPhase(settings.startDate);
  const phaseInfo = PHASE_INFO[phase];
  const taping = TAPING_GUIDES[settings.condition] ?? TAPING_GUIDES.general;

  return (
    <div className="max-w-lg mx-auto px-5 pt-10 pb-6">
      <header className="mb-6">
        <div className="font-mono text-[10px] tracking-[0.18em] uppercase mb-1" style={{ color: 'var(--muted)' }}>
          Guides
        </div>
        <h1 className="font-serif text-4xl leading-none" style={{ color: 'var(--ink)' }}>
          Resources
        </h1>
      </header>

      {/* Taping Guide */}
      <section className="mb-8">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: 'var(--muted)' }}>
            Taping Guide
          </h2>
          <span className="font-mono text-[10px] tracking-[0.14em] uppercase" style={{ color: 'var(--muted)' }}>
            Condition: {settings.condition}
          </span>
        </div>

        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'var(--surface)', border: '1px solid var(--hairline-2)' }}
        >
          <div className="px-5 pt-5 pb-3">
            <div className="font-serif text-2xl leading-tight" style={{ color: 'var(--ink)' }}>
              {taping.title}
            </div>
            <p className="mt-2 font-serif text-sm leading-relaxed" style={{ color: 'var(--ink-2)' }}>
              {taping.blurb}
            </p>
          </div>

          <a
            href={taping.searchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-5 mb-5 flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl transition-all active:scale-[0.98]"
            style={{ background: 'var(--ink)', color: '#fff' }}
          >
            <span className="flex items-center gap-2">
              <span aria-hidden>{'▶'}</span>
              <span className="font-semibold text-sm">Watch taping videos</span>
            </span>
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase opacity-70">YouTube</span>
          </a>

          <div className="px-5 pb-4 pt-3 border-t" style={{ borderColor: 'var(--hairline)' }}>
            <p className="font-mono text-[10px] leading-snug tracking-wide" style={{ color: 'var(--muted)' }}>
              Opens a YouTube search. Prefer reputable physio channels
              {' '}(Bob &amp; Brad, Tone and Tighten, Squat University, licensed PTs).
              Change the condition in Settings to swap guides.
            </p>
          </div>
        </div>
      </section>

      {/* Equipment Guide */}
      <section>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: 'var(--muted)' }}>
            Equipment Usage
          </h2>
          <span
            className="font-mono text-[10px] tracking-[0.14em] uppercase px-2 py-0.5 rounded-md"
            style={{ background: `${phaseInfo.color}18`, color: phaseInfo.color }}
          >
            Phase {phase}
          </span>
        </div>

        <div className="space-y-2">
          {EQUIPMENT.map((item) => {
            const phaseDetail = item.phases[phase];
            const isOpen = expanded === item.id;
            return (
              <div
                key={item.id}
                className="rounded-2xl overflow-hidden"
                style={{ background: 'var(--surface)', border: '1px solid var(--hairline-2)' }}
              >
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : item.id)}
                  className="w-full flex items-start gap-3 px-4 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-2xl leading-none flex-shrink-0">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-base" style={{ color: 'var(--ink)' }}>
                      {item.name}
                    </div>
                    <div className="font-mono text-[11px] mt-0.5" style={{ color: 'var(--muted)' }}>
                      {item.purpose}
                    </div>
                  </div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="transition-transform duration-200 flex-shrink-0 mt-1"
                    style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', color: 'var(--muted)' }}
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 pt-2 border-t" style={{ borderColor: 'var(--hairline)' }}>
                    <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2">
                      <div className="font-mono text-[10px] tracking-[0.14em] uppercase pt-0.5" style={{ color: 'var(--muted)' }}>
                        When
                      </div>
                      <div className="font-serif text-sm leading-snug" style={{ color: 'var(--ink)' }}>
                        {phaseDetail.when}
                      </div>

                      <div className="font-mono text-[10px] tracking-[0.14em] uppercase pt-0.5" style={{ color: 'var(--muted)' }}>
                        How
                      </div>
                      <div className="font-serif text-sm leading-snug" style={{ color: 'var(--ink)' }}>
                        {phaseDetail.how}
                      </div>
                    </div>

                    <div
                      className="mt-4 flex items-start gap-2 px-3 py-3 rounded-xl text-sm"
                      style={{ background: 'var(--warn-soft)' }}
                    >
                      <span aria-hidden className="flex-shrink-0 mt-0.5">{'⚠️'}</span>
                      <span className="font-medium" style={{ color: 'var(--warn)' }}>
                        {item.cautions}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
