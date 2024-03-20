import { DashCircle } from "../../../assets/icons/DashCircle";
import "./style.scss";

const Loader = () => {
  return (
    <div className="loader">
      <div className="loader__icon">
        <DashCircle stroke="#ffffff" />
      </div>
    </div>
  );
};

export default Loader;
