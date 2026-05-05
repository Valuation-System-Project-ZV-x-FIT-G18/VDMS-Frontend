import { useEffect, useState, useCallback } from 'react';

const SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=90&auto=format&fit=crop',
    caption: 'Residential Property Valuation',
    sub: 'Accurate market assessments for homes & apartments',
  },
  {
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=90&auto=format&fit=crop',
    caption: 'Commercial Real Estate Assessment',
    sub: 'Office buildings, retail spaces and industrial sites',
  },
  {
    url: 'https://images.unsplash.com/photo-1524813686514-a57563d77965?w=1600&q=90&auto=format&fit=crop',
    caption: 'Land Survey & Site Inspection',
    sub: 'Boundary verification and topographic surveys',
  },
  {
    url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=90&auto=format&fit=crop',
    caption: 'Urban Development Projects',
    sub: 'Infrastructure and city planning valuations',
  },
  {
    url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&q=90&auto=format&fit=crop',
    caption: 'Legal Documentation & Review',
    sub: 'Deed verification, title checks and compliance',
  },
];

const DashboardSlideshow = () => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent(p => (p + 1) % SLIDES.length), []);
  const prev = useCallback(() => setCurrent(p => (p - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [paused, next]);

  return (
    <section
      className="cd-slideshow"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="cd-slideshow__track">
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`cd-slideshow__slide${i === current ? ' cd-slideshow__slide--active' : ''}`}
            aria-hidden={i !== current}
          >
            <img src={slide.url} alt={slide.caption} loading={i === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}
      </div>

      {/* Dark gradient + caption overlay */}
      <div className="cd-slideshow__overlay">
        <div className="cd-slideshow__caption-wrap">
          <span className="cd-slideshow__tag">Property Valuation</span>
          <h2 className="cd-slideshow__title">{SLIDES[current].caption}</h2>
          <p className="cd-slideshow__sub">{SLIDES[current].sub}</p>
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button className="cd-slideshow__arrow cd-slideshow__arrow--prev" onClick={prev} aria-label="Previous slide">
        &#8249;
      </button>
      <button className="cd-slideshow__arrow cd-slideshow__arrow--next" onClick={next} aria-label="Next slide">
        &#8250;
      </button>

      {/* Dot indicators + counter */}
      <div className="cd-slideshow__footer">
        <div className="cd-slideshow__dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`cd-slideshow__dot${i === current ? ' cd-slideshow__dot--active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <span className="cd-slideshow__counter">{current + 1} / {SLIDES.length}</span>
      </div>
    </section>
  );
};

export default DashboardSlideshow;
