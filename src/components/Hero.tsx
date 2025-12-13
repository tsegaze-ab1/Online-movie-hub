import React from 'react';

// helper: shorten title and add ellipsis
const shortTitle = (title?: string, max = 30) =>
  title ? (title.length > max ? `${title.slice(0, max).trim()}…` : title) : '';

const Hero = ({ item }: { item: any }) => {
  // Keep background image only, remove title/description/buttons
  const bgUrl = item?.backdrop_path || item?.poster_path || '';
  return (
    <section className="hero" aria-hidden>
      <div
        className="hero__bg"
        style={{
          backgroundImage: `url(${bgUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
          height: '100%',
        }}
      />
      <h1 className="hero__title">
        {shortTitle(item?.title || item?.name || item?.original_name, 30)}
      </h1>

      {/* remove or delete the Play / More Info buttons markup here */}
      {/* Example: comment out or remove:
      <div className="hero__actions">
        <button className="btn play">Play</button>
        <button className="btn info">More Info</button>
      </div>
      */}
    </section>
  );
};

export default Hero;