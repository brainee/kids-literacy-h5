import { Link } from 'react-router-dom'
import { Shell } from '../ui/Shell'

const SUBJECTS = [
  { id: 'chinese', emoji: '📘', name: '语文', hint: '识字 · 表达' },
  { id: 'math', emoji: '🔢', name: '数学', hint: '即将开放 · 数感' },
  { id: 'english', emoji: '🔤', name: '英语', hint: '即将开放 · 听辨' },
  { id: 'thinking', emoji: '🧠', name: '思维', hint: '观察 · 分类 · 规律' },
]

export function SubjectsPage() {
  return (
    <Shell title="科目">
      <div className="grid-2">
        {SUBJECTS.map((s) => (
          <Link
            key={s.id}
            to={s.id === 'math' || s.id === 'english' ? '#' : `/today`}
            className="card"
            style={{ textDecoration: 'none', color: 'inherit', opacity: s.id === 'math' || s.id === 'english' ? 0.65 : 1 }}
            onClick={(e) => {
              if (s.id === 'math' || s.id === 'english') e.preventDefault()
            }}
          >
            <div style={{ fontSize: 36 }}>{s.emoji}</div>
            <strong>{s.name}</strong>
            <div className="muted">{s.hint}</div>
          </Link>
        ))}
      </div>
    </Shell>
  )
}
