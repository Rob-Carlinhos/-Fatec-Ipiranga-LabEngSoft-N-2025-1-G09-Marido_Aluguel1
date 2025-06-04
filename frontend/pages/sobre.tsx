
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SobrePage() {
  return (
    <div>
      <Header />
      <main className="mt-20 px-4 py-10 text-center">
        <h2 className="text-3xl font-bold mb-4">Sobre Nós</h2>
        <p className="text-lg max-w-2xl mx-auto">
          Somos uma plataforma que conecta pessoas que precisam de pequenos reparos em casa com prestadores de serviço de confiança. Nosso objetivo é facilitar a sua vida!
        </p>
      </main>
      <Footer />
    </div>
  );
}
