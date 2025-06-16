import './mission.css';

export default function Mission({ showMission }) {
  return (
    <section
      className="missionContainer"
      role="main"
      aria-labelledby="mission-heading"
      style={
        showMission
          ? { zIndex: 10000, left: '0', opacity: 1 }
          : { zIndex: 0, left: '-100vw', opacity: 0 }
      }
    >
      <header className="missionHeader">
        <h1 id="mission-heading">
          Original handcrafted work that blurs the line between function and the
          natural art of the forest
        </h1>
      </header>
      <article className="missionText">
        <p>
          All Doug's Found Wood products are unique, handmade, works of art from
          extremely skilled artisans passionate about wood and woodworking. Each
          piece that comes out of Doug's workshop is 100% unique.
        </p>
        <p>
          From the smallest plant stand to the largest building, every piece of
          wood is recovered from sustainable woodlots. Each piece is studied to
          discover the untapped form or function hidden inside, then works to
          set that potential free.
        </p>
        <p>
          Whether it's an Adirondack chair, a door latch, a lamp, a deck, or a
          boathouse, every element of every product is handmade—hand-split
          shingles for sheds and playhouses. Whittled down birch branches to
          make latch springs. Carved tree-spirit faces for coatracks.
        </p>
      </article>
    </section>
  );
}
