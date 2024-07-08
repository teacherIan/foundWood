import './mission.css';

export default function Mission({ showMission }) {
  return (
    <div
      className="missionContainer"
      style={
        showMission
          ? { filter: 'blur(0px)', zIndex: 10000 }
          : { filter: 'blur(1000px)', zIndex: 0 }
      }
    >
      <div className="missionHeader">
        Original handcrafted work that blurs the line between function and the
        natural art of the forest
      </div>
      <div className="missionText">
        All Doug's Found Wood products are unique, handmade, works of art from
        extremely skilled artisans passionate about wood and woodworking. Each
        piece that comes out of Doug's workshop is 100% unique. From the
        smallest plant stand to the largest building, every piece of wood is
        recovered from sustainable woodlots. Each piece is studied to discover
        the untapped form or function hidden inside, then works to set that
        potential free. Whether it's an Adirondack chair, a door latch, a lamp,
        a deck, or a boathouse, every element of every product is
        handmade—hand-split shingles for sheds and playhouses. Whittled down
        birch branches to make latch springs. carved tree-spirit faces for
        coatracks.
      </div>
    </div>
  );
}
