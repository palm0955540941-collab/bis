;(function(){
  'use strict'

  const isMobile = window.matchMedia('(pointer:coarse)').matches || innerWidth < 768
  const prefersReduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches

  /* ═══════════════ Custom Cursor (desktop only) ═══════════════ */
  let cursorEls = null

  function initCursor() {
    if (isMobile || prefersReduced) return
    const dot = document.createElement('div')
    const ring = document.createElement('div')
    dot.className = 'cursor-dot'
    ring.className = 'cursor-ring'
    document.body.appendChild(dot)
    document.body.appendChild(ring)
    cursorEls = { dot, ring }

    let mx = 0, my = 0
    let ringX = 0, ringY = 0

    document.addEventListener('mousemove', e => {
      mx = e.clientX
      my = e.clientY
      dot.style.left = mx + 'px'
      dot.style.top = my + 'px'
    })

    function lerpRing() {
      ringX += (mx - ringX) * 0.12
      ringY += (my - ringY) * 0.12
      ring.style.left = ringX + 'px'
      ring.style.top = ringY + 'px'
      if (cursorEls) requestAnimationFrame(lerpRing)
    }
    lerpRing()

    document.querySelectorAll('a, button, .category-card, .hw-subj-btn, .ctrl-btn, .gpa-btn, .add-btn, .schedule-note, .game-tab')
      .forEach(el => {
        el.addEventListener('mouseenter', () => { dot.classList.add('hover'); ring.classList.add('hover') })
        el.addEventListener('mouseleave', () => { dot.classList.remove('hover'); ring.classList.remove('hover') })
      })
  }

  function destroyCursor() {
    if (cursorEls) {
      cursorEls.dot.remove()
      cursorEls.ring.remove()
      cursorEls = null
    }
  }

  /* ═══════════════ Ripple Effect ═══════════════ */
  let rippleStyleInjected = false

  function injectRippleStyle() {
    if (rippleStyleInjected) return
    rippleStyleInjected = true
    const style = document.createElement('style')
    style.textContent = '.ripple-effect{position:fixed;border-radius:50%;pointer-events:none;z-index:9999;background:radial-gradient(circle,rgba(255,215,0,0.35)0%,transparent 70%);animation:rippleAnim 0.65s ease-out forwards}@keyframes rippleAnim{0%{transform:scale(0);opacity:0.5}100%{transform:scale(1);opacity:0}}'
    document.head.appendChild(style)
  }

  function initRipple() {
    if (prefersReduced) return
    injectRippleStyle()
    document.addEventListener('click', function(e) {
      const size = 80
      const r = document.createElement('span')
      r.className = 'ripple-effect'
      r.style.width = r.style.height = size + 'px'
      r.style.left = (e.clientX - size/2) + 'px'
      r.style.top = (e.clientY - size/2) + 'px'
      document.body.appendChild(r)
      setTimeout(() => r.remove(), 700)
    })
  }

  /* ═══════════════ Page Transition ═══════════════ */
  function initTransition() {
    document.body.classList.add('page-enter')
    setTimeout(() => document.body.classList.remove('page-enter'), 500)
  }

  /* ═══════════════ Confetti ═══════════════ */
  let confettiCanvas = null, confettiCtx = null, confettiParticles = [], confettiRunning = false

  function createConfettiCanvas() {
    if (confettiCanvas) return
    confettiCanvas = document.createElement('canvas')
    confettiCanvas.id = 'confettiCanvas'
    confettiCanvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999'
    document.body.appendChild(confettiCanvas)
    confettiCtx = confettiCanvas.getContext('2d')
    resizeConfetti()
    window.addEventListener('resize', resizeConfetti)
  }

  function resizeConfetti() {
    if (!confettiCanvas) return
    confettiCanvas.width = window.innerWidth * (window.devicePixelRatio || 1)
    confettiCanvas.height = window.innerHeight * (window.devicePixelRatio || 1)
    confettiCanvas.style.width = window.innerWidth + 'px'
    confettiCanvas.style.height = window.innerHeight + 'px'
    if (confettiCtx) confettiCtx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1)
  }

  window.showConfetti = function() {
    if (prefersReduced) return
    createConfettiCanvas()
    const count = isMobile ? 40 : 100
    const colors = ['#ffd700','#ffaa00','#ff6b6b','#6bcb77','#4d96ff','#c084fc','#fb923c','#f472b6']
    confettiParticles = []
    for (let i = 0; i < count; i++) {
      confettiParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight - window.innerHeight,
        w: 6 + Math.random() * 6,
        h: 4 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: 2 + Math.random() * 3,
        rot: Math.random() * 360,
        rotV: (Math.random() - 0.5) * 6,
        opacity: 0.8 + Math.random() * 0.2
      })
    }
    if (!confettiRunning) {
      confettiRunning = true
      animateConfetti()
    }
    setTimeout(() => { confettiRunning = false; if (confettiCtx) confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight) }, 4000)
  }

  function animateConfetti() {
    if (!confettiRunning || !confettiCtx) return
    const w = window.innerWidth, h = window.innerHeight
    confettiCtx.clearRect(0, 0, w, h)
    let alive = false
    for (const p of confettiParticles) {
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.04
      p.rot += p.rotV
      if (p.y < h + 20) {
        alive = true
        confettiCtx.save()
        confettiCtx.translate(p.x, p.y)
        confettiCtx.rotate(p.rot * Math.PI / 180)
        confettiCtx.globalAlpha = p.opacity
        confettiCtx.fillStyle = p.color
        confettiCtx.fillRect(-p.w/2, -p.h/2, p.w, p.h)
        confettiCtx.restore()
      }
    }
    if (alive) requestAnimationFrame(animateConfetti)
    else { confettiRunning = false; confettiCtx.clearRect(0, 0, w, h) }
  }

  /* ═══════════════ Scroll Reveal ═══════════════ */
  function initScrollReveal() {
    if (prefersReduced) return
    const els = document.querySelectorAll('.reveal')
    if (!els.length) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          obs.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })
    els.forEach(el => obs.observe(el))
  }

  /* ═══════════════ Particles (homepage hero) ═══════════════ */
  let particleCanvas = null, particleCtx = null, particles = [], particleRAF = null

  window.initParticles = function() {
    if (isMobile || prefersReduced) {
      const c = document.getElementById('particleCanvas')
      if (c) c.style.display = 'none'
      return
    }
    particleCanvas = document.getElementById('particleCanvas')
    if (!particleCanvas) return
    particleCtx = particleCanvas.getContext('2d')
    resizeParticles()
    window.addEventListener('resize', resizeParticles)

    const count = isMobile ? 25 : 70
    particles = []
    for (let i = 0; i < count; i++) {
      particles.push(createParticle())
    }
    animateParticles()
  }

  function createParticle() {
    const w = particleCanvas.width, h = particleCanvas.height
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: 1 + Math.random() * 2.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(0.2 + Math.random() * 0.5),
      opacity: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2
    }
  }

  function resizeParticles() {
    if (!particleCanvas) return
    const rect = particleCanvas.parentElement.getBoundingClientRect()
    particleCanvas.width = rect.width * (window.devicePixelRatio || 1)
    particleCanvas.height = rect.height * (window.devicePixelRatio || 1)
    particleCanvas.style.width = rect.width + 'px'
    particleCanvas.style.height = rect.height + 'px'
    if (particleCtx) particleCtx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1)
  }

  function animateParticles() {
    if (!particleCtx || !particleCanvas) return
    const w = particleCanvas.width / (window.devicePixelRatio || 1)
    const h = particleCanvas.height / (window.devicePixelRatio || 1)
    particleCtx.clearRect(0, 0, w, h)

    for (const p of particles) {
      p.x += p.vx + Math.sin(Date.now() / 3000 + p.phase) * 0.1
      p.y += p.vy
      p.vy *= 0.999
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w }
      if (p.x < -10) p.x = w + 10
      if (p.x > w + 10) p.x = -10

      const alpha = p.opacity * (0.6 + 0.4 * Math.sin(Date.now() / 2000 + p.phase))
      particleCtx.beginPath()
      particleCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      particleCtx.fillStyle = `rgba(255, 215, 0, ${alpha})`
      particleCtx.fill()
    }

    particleRAF = requestAnimationFrame(animateParticles)
  }

  function destroyParticles() {
    if (particleRAF) { cancelAnimationFrame(particleRAF); particleRAF = null }
    particles = []
    particleCtx = null
    particleCanvas = null
  }

  /* ═══════════════ 3D Tilt Cards (desktop only) ═══════════════ */
  function initTilt() {
    if (isMobile || prefersReduced) return
  }

  /* ═══════════════ Splash Screen ═══════════════ */
  function initSplash() {
    const splash = document.getElementById('splash')
    if (!splash) return
    setTimeout(() => {
      splash.classList.add('splash-hide')
      setTimeout(() => { if (splash.parentNode) splash.parentNode.removeChild(splash) }, 600)
    }, 1500)
  }

  /* ═══════════════ Init ═══════════════ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run)
  } else {
    run()
  }

  function run() {
    initCursor()
    initRipple()
    initTransition()
    initScrollReveal()
    initSplash()
    initTilt()
  }

  window.__HOKKADEE_CLEANUP = function() {
    destroyCursor()
    destroyParticles()
    if (confettiCanvas) { confettiCanvas.remove(); confettiCanvas = null; confettiCtx = null }
  }
})()
