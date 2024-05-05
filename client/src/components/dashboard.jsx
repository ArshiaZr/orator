import Charts from "./charts"
import Bento from "./cards"
const Dashboard = () => {
  return (
    <div className="w-screen min-h-screen h-full bg-[#1A1A1A]">
        <Bento />
        <div className="flex flex-row w-screen">
        <Charts />
        <div className="w-3/5 h-[unset] mt-10 bg-[#2A2A2A] rounded-3xl">
  
        </div>
        </div>
    </div>
  )
}

export default Dashboard