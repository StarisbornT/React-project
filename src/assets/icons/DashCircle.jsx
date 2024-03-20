export const DashCircle = ({ className, stroke }) => (
  <svg
    width="200px"
    height="200px"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
  >
    <circle cx="75" cy="50" fill={stroke} r="6.39718">
      <animate
        attributeName="r"
        values="4.8;4.8;8;4.8;4.8"
        dur="1s"
        repeatCount="indefinite"
        begin="-0.875s"
      ></animate>
    </circle>
    <circle cx="67.678" cy="67.678" fill={stroke} r="4.8">
      <animate
        attributeName="r"
        values="4.8;4.8;8;4.8;4.8"
        dur="1s"
        repeatCount="indefinite"
        begin="-0.75s"
      ></animate>
    </circle>
    <circle cx="50" cy="75" fill={stroke} r="4.8">
      <animate
        attributeName="r"
        values="4.8;4.8;8;4.8;4.8"
        dur="1s"
        repeatCount="indefinite"
        begin="-0.625s"
      ></animate>
    </circle>
    <circle cx="32.322" cy="67.678" fill={stroke} r="4.8">
      <animate
        attributeName="r"
        values="4.8;4.8;8;4.8;4.8"
        dur="1s"
        repeatCount="indefinite"
        begin="-0.5s"
      ></animate>
    </circle>
    <circle cx="25" cy="50" fill={stroke} r="4.8">
      <animate
        attributeName="r"
        values="4.8;4.8;8;4.8;4.8"
        dur="1s"
        repeatCount="indefinite"
        begin="-0.375s"
      ></animate>
    </circle>
    <circle cx="32.322" cy="32.322" fill={stroke} r="4.80282">
      <animate
        attributeName="r"
        values="4.8;4.8;8;4.8;4.8"
        dur="1s"
        repeatCount="indefinite"
        begin="-0.25s"
      ></animate>
    </circle>
    <circle cx="50" cy="25" fill={stroke} r="6.40282">
      <animate
        attributeName="r"
        values="4.8;4.8;8;4.8;4.8"
        dur="1s"
        repeatCount="indefinite"
        begin="-0.125s"
      ></animate>
    </circle>
    <circle cx="67.678" cy="32.322" fill={stroke} r="7.99718">
      <animate
        attributeName="r"
        values="4.8;4.8;8;4.8;4.8"
        dur="1s"
        repeatCount="indefinite"
        begin="0s"
      ></animate>
    </circle>
  </svg>
);
