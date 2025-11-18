export default function Navbar() {
  return (
    <nav className="w-full p-2 bg-base-300 flex justify-between items-center">
      {/* title */}
      <h1 className="text-xl font-bold">Kruskal Algorithm Simulator</h1>

      {/* right action */}
      <div className="ml-auto h-full">
        <button className="btn btn-primary">
          Import Graph
        </button>
      </div>
    </nav>
  )
}