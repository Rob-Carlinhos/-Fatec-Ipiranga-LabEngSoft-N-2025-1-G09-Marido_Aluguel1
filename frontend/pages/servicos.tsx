
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ServicosPage() {
  return (
    <div>
      <Header />
      <main className="mt-20 px-4 py-10 text-center">
        <h2 className="text-3xl font-bold mb-4">Nossos Serviços</h2>
        <p className="text-lg max-w-2xl mx-auto">
          Prestamos serviços de encanamento, elétrica, montagem de móveis, pequenas reformas, instalações, pintura e muito mais.
        </p>
      </main>
      <Footer />
    </div>
  );
}
