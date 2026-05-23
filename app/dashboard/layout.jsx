import Header from "./_components/Header";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      <div className="p-10">
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;