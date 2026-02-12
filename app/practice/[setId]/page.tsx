'use client';

import { useEffect, useMemo, useState } from 'react';

interface Question {
  id: string;
  question: string;
  choices: string[];
  correct_index: number;
  rationale: string;
  distractor_rationales: string[];
  evidence: Array<{ page: number; quote: string }>;
}

export default function PracticeSetPage({ params }: { params: { setId: string } }) {
  const [data, setData] = useState<{ mode: 'study' | 'exam'; questions: Question[]; rejections: Array<{ reason: string }> }>({ mode: 'study', questions: [], rejections: [] });
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confidence, setConfidence] = useState('medium');
  const [review, setReview] = useState(false);

  useEffect(() => {
    fetch(`/api/practice/${params.setId}`)
      .then((res) => res.json())
      .then((payload) => setData({ mode: payload.set.mode, questions: payload.set.questions, rejections: payload.set.rejections }));
  }, [params.setId]);

  const question = data.questions[index];
  const answered = selected !== null;
  const correct = selected === question?.correct_index;

  const progress = useMemo(() => ((index + 1) / Math.max(1, data.questions.length)) * 100, [index, data.questions.length]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">Generated {data.questions.length} questions. {data.rejections.length} rejected due to insufficient evidence or QC failure.</p>
      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <section className="card space-y-4">
          <div className="h-2 rounded-full bg-slate-200"><div className="h-2 rounded-full bg-indigo-600" style={{ width: `${progress}%` }} /></div>
          <p className="text-sm text-slate-500">Question {index + 1} of {data.questions.length}</p>
          <h2 className="text-lg font-semibold">{question?.question ?? 'No questions available'}</h2>
          <div className="space-y-2">
            {question?.choices.map((choice, choiceIndex) => (
              <button key={choiceIndex} onClick={() => setSelected(choiceIndex)} className="block w-full rounded border p-3 text-left">{String.fromCharCode(65 + choiceIndex)}. {choice}</button>
            ))}
          </div>
          <button className="btn-secondary" disabled={index >= data.questions.length - 1} onClick={() => { setIndex((x) => x + 1); setSelected(null); }}>Continue</button>
        </section>

        <aside className="card space-y-3">
          <p className="font-semibold">Review</p>
          <select className="w-full rounded border p-2" value={confidence} onChange={(e) => setConfidence(e.target.value)}>
            <option value="low">Low confidence</option><option value="medium">Medium confidence</option><option value="high">High confidence</option>
          </select>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={review} onChange={(e) => setReview(e.target.checked)} /> Review Answer</label>
          {answered ? <p className={correct ? 'text-emerald-600' : 'text-rose-600'}>{correct ? 'Correct' : 'Incorrect'}</p> : <p className="text-sm text-slate-500">Pick an answer to continue.</p>}
          {(review && answered) || (data.mode === 'study' && answered) ? (
            <div className="space-y-2 text-sm">
              <details open><summary className="cursor-pointer font-medium">Explanation</summary><p>{question?.rationale}</p></details>
              <details><summary className="cursor-pointer font-medium">Evidence</summary>{question?.evidence.map((ev, i) => <p key={i}>p.{ev.page}: “{ev.quote}” <button className="underline">View in context</button></p>)}</details>
              <details><summary className="cursor-pointer font-medium">Why others are wrong</summary>{question?.distractor_rationales.map((r, i) => <p key={i}>{String.fromCharCode(65 + i)}: {r}</p>)}</details>
            </div>
          ) : null}
          <button className="text-left text-xs text-slate-500 underline">Report issue: Not in PDF / Ambiguous / Wrong answer / Other</button>
        </aside>
      </div>
    </div>
  );
}
