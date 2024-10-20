import BackgroundTop from "../assets/gradient-background-top.webp";
function Background() {
  return (
    <div className="absolute top-0">
      <img
        alt=""
        role="presentation"
        width="1512"
        height="550"
        decoding="async"
        data-nimg="1"
        src={BackgroundTop}
      ></img>
    </div>
  );
}

export default Background;
