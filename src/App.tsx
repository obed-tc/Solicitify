import Background from "./components/Background";
import Content from "./components/Content";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="bg-[#0a0909] min-h-screen text-white  ">
      <div className="relative z-10 min-h-screen flex flex-col ">
        <Header />
        <div className="flex flex-1 ">
          <Sidebar />
          <Content />
        </div>
        <Footer />
      </div>

      <Background></Background>
    </div>
  );
}

export default App;
