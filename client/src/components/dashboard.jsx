import Charts from "./charts";
import Bento from "./cards";
import { ExportNavbar } from "./navbar";
const Dashboard = () => {
  return (
    <div
      className="w-screen min-h-screen h-full bg-[#1A1A1A] p-10 pt-28"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ExportNavbar />
      <Bento />
      <div className="flex flex-row " style={{ width: "30rem" }}>
        <Charts />
        {/* <div className="w-3/5 h-[unset] mt-10 bg-[#2A2A2A] rounded-3xl"></div> */}
      </div>
    </div>
  );
};

export default Dashboard;
