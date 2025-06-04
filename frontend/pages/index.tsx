
import Header from '../components/Header';
import Footer from '../components/Footer';
import Carousel from '../components/Carousel';

export default function HomePage() {
  return (
    <div>
      <Header />
      <main className="text-center py-10 px-4 mt-20">
        <h2 className="text-3xl font-bold mb-4">Bem-vindo ao Marido de Aluguel</h2>
        <p className="text-lg mb-6">Conectamos você aos melhores prestadores de serviço. Rápido, fácil e seguro.</p>
        <Carousel />
      </main>
      <Footer />
    </div>
  );
}
