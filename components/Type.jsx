import './type.css';

export default function Type({ img }) {
  return (
    <div className="typeContainer">
      <div className="typeHeader">HEADER</div>
      <img className="typeImage" src={img}></img>
    </div>
  );
}
