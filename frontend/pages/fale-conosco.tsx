
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function FaleConoscoPage() {
  return (
    <div>
      <Header />
      <main className="mt-20 px-4 py-10 text-center">
        <h2 className="text-3xl font-bold mb-4">Fale Conosco</h2>
        <p className="text-lg max-w-2xl mx-auto mb-4">
          Entre em contato conosco para dúvidas, sugestões ou parcerias.
        </p>
        <form className="max-w-lg mx-auto space-y-4 text-left">
          <input type="text" placeholder="Nome" className="w-full px-4 py-2 border rounded" required />
          <input type="email" placeholder="E-mail" className="w-full px-4 py-2 border rounded" required />
          <textarea placeholder="Mensagem" rows={5} className="w-full px-4 py-2 border rounded" required />
          <button className="bg-orange-300 hover:bg-orange-400 transition px-6 py-2 rounded text-white font-semibold">
            Enviar
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
