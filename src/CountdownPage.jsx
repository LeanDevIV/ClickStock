import { useEffect, useMemo, useState } from 'react'
import { FiClock, FiCalendar } from 'react-icons/fi'

function getTargetDate() {
  const now = new Date()
  const currentYear = now.getFullYear()
  const targetThisYear = new Date(currentYear, 11, 1, 19, 0, 0, 0) // Dec index=11
  return now <= targetThisYear
    ? targetThisYear
    : new Date(currentYear + 1, 11, 1, 19, 0, 0, 0)
}

function formatTime(msRemaining) {
  const totalSeconds = Math.max(0, Math.floor(msRemaining / 1000))
  const days = Math.floor(totalSeconds / (24 * 3600))
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return { days, hours, minutes, seconds }
}

export default function CountdownPage() {
  const targetDate = useMemo(() => getTargetDate(), [])
  const [remainingMs, setRemainingMs] = useState(() => targetDate - new Date())

  useEffect(() => {
    const id = setInterval(() => {
      setRemainingMs(targetDate - new Date())
    }, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  const { days, hours, minutes, seconds } = formatTime(remainingMs)
  const isOver = remainingMs <= 0
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  const hoursPct = Math.round((hours / 24) * 100)
  const minutesPct = Math.round((minutes / 60) * 100)
  const secondsPct = Math.round((seconds / 60) * 100)

  const niceTarget = targetDate.toLocaleString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{
      background: 'linear-gradient(135deg, #f0f4ff 0%, #ffffff 50%, #f8f9ff 100%)'
    }}>
      <div className="container py-5 px-3">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8 col-xxl-7">
            <div className="card border-0 shadow" style={{
              borderRadius: '20px',
              backdropFilter: 'blur(6px)'
            }}>
              <div className="card-body p-4 p-md-5 text-center">
                <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill bg-light-subtle text-secondary mb-3">
                  <FiClock />
                  <span className="small">Cuenta atrás</span>
                </div>
                <h1 className="display-5 fw-semibold mb-2">Lanzamiento</h1>
                <p className="text-secondary mb-4 d-flex align-items-center justify-content-center gap-2">
                  <FiCalendar /> <span className="text-capitalize">{niceTarget}</span>
                </p>
                {isOver ? (
                  <div className="display-6 fw-bold text-success">¡Ya comenzó!</div>
                ) : (
                  <>
                    <div className="d-flex flex-wrap align-items-center justify-content-center gap-3 gap-md-4 mb-4">
                      <TimeBox label="Días" value={days} subtle />
                      <span className="fs-3 text-secondary">:</span>
                      <TimeBox label="Horas" value={hours} progress={hoursPct} />
                      <span className="fs-3 text-secondary">:</span>
                      <TimeBox label="Min" value={minutes} progress={minutesPct} />
                      <span className="fs-3 text-secondary">:</span>
                      <TimeBox label="Seg" value={seconds} progress={secondsPct} highlight />
                    </div>
                    <div className="text-secondary small">Zona horaria: {timezone}</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TimeBox({ label, value, progress, highlight, subtle }) {
  const padded = String(value).padStart(2, '0')
  const ringClass = highlight ? 'text-primary' : 'text-body'
  const boxClass = subtle ? 'bg-white border' : 'bg-primary-subtle border-0'
  return (
    <div className={`d-grid justify-items-center text-center rounded-4 ${boxClass}`} style={{ minWidth: 110, padding: '14px 16px' }}>
      <div className={`fw-bold ${ringClass}`} style={{ fontSize: 44, lineHeight: 1 }}>{padded}</div>
      <span className="text-secondary small fw-normal mb-1">{label}</span>
      {typeof progress === 'number' && (
        <div className="progress w-100" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress} style={{ height: 6 }}>
          <div className="progress-bar bg-primary" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  )
}


