import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux";
import { MobileCodes } from "../../../redux/features/menu-slice";
import { AiOutlineMobile } from "react-icons/ai";

import './ChoosePlayer.css'
interface ChoosePlayerProps {
  playerNum: 1 | 2;
}
const ChoosePlayer = ({ playerNum }: ChoosePlayerProps) => {
  const { sessionId, socket, player, mobileCode, local } = useSelector(
    ({
      menu: { sessionId, player, mobileCode, local },
      socket: { socket },
    }: RootState) => ({
      sessionId,
      socket,
      player,
      mobileCode,
      local,
    })
  );

  const [deviceSelected, setDeviceSelected] = useState<MobileCodes>({
    player1: "",
    player2: "",
  });
  const devices = { mobile: "mobile", keys: "keyboard" };
  const accessDeviceSelected = () => deviceSelected[`player${playerNum}`];

  const connectKeys = () => {
    if (playerNum === parseInt(player[6]) || local) {
      !local && socket.emit("CONNECT_PLAYER", sessionId, player, devices.keys);
      setDeviceSelected((old) => ({ ...old, [`player${playerNum}`]: devices.keys }));
    }
  };

  useEffect(() => {
    socket.on("PLAYER_CONNECTED", (playerConnected, device) => {
      console.log(playerConnected, "connected", device);

      setDeviceSelected((old) => ({ ...old, [playerConnected]: device }));
    });
    socket.on("MOBILE_DISCONNECT", (player1Device, player2Device) => {
      if (deviceSelected.player1 !== player1Device) {
        setDeviceSelected((old) => ({ ...old, player1: player1Device }));
      }
      if (deviceSelected.player2 !== player2Device) {
        setDeviceSelected((old) => ({ ...old, player2: player2Device }));
      }
    });
  }, [socket]);
  const active = (device: string) => accessDeviceSelected() === device && 'active'
  ;
  return (
    <div>
      <h3>{`Player ${playerNum}`}</h3>
      <p>
        {playerNum === 1 ? "Left" : "Right"} Paddle{" "}
        {accessDeviceSelected() && `Selected`}
      </p>
      <button
       
        onClick={() => connectKeys()}
      >
        Keyboard
      </button>
      <div  className={`mobileIndicator neonBorder ${active(devices.mobile)}`} ><span id="mobileText">{mobileCode[`player${playerNum}`]}</span></div>
      <p>Enter code in Join Session </p>
    </div>
  );
};
export default ChoosePlayer;
