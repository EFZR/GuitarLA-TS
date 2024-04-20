import useCart from "./hooks/useCart";
import Header from "./components/Header";
import Guitar from "./components/Guitar";
import Footer from "./components/Footer";

function App() {
  const { guitarras } = useCart();

  return (
    <>
      <Header />

      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {guitarras.map((guitarra) => (
            <Guitar key={guitarra.id} guitarra={guitarra} />
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default App;
