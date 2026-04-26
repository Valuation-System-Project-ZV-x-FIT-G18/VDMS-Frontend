interface Props {
  lat?: number | string | null;
  lng?: number | string | null;
}

const MapSection = ({ lat, lng }: Props) => {
  const a = Number(lat);
  const b = Number(lng);
  const ok = Number.isFinite(a) && Number.isFinite(b);
  if (!ok) return <section className="rv-card"><h3>Map</h3><p className="rv-empty">No location</p></section>;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${b - 0.01}%2C${a - 0.01}%2C${b + 0.01}%2C${a + 0.01}&layer=mapnik&marker=${a}%2C${b}`;
  return (
    <section className="rv-card">
      <h3>Map</h3>
      <iframe title="property-map" className="rv-map" src={src} loading="lazy" />
    </section>
  );
};

export default MapSection;
