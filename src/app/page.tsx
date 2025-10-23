import { Car, ShoppingCart, Star, Truck } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-dark-900 to-primary-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            VX Autopeças
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Encontre as melhores peças para seu veículo com qualidade garantida e preços competitivos
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/produtos" 
              className="bg-primary-600 hover:bg-primary-700 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Ver Produtos
            </Link>
            <Link 
              href="/sobre" 
              className="border-2 border-white hover:bg-white hover:text-dark-900 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Sobre Nós
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Entrega Rápida</h3>
            <p className="text-gray-600">Entregamos em todo o Brasil com agilidade e segurança</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Qualidade Garantida</h3>
            <p className="text-gray-600">Apenas peças originais e de primeira qualidade</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Todas as Marcas</h3>
            <p className="text-gray-600">Peças para todas as marcas e modelos de veículos</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Principais Categorias</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'Motor', image: '🔧', count: '1.250+ peças' },
              { name: 'Freios', image: '🛞', count: '890+ peças' },
              { name: 'Suspensão', image: '⚙️', count: '640+ peças' },
              { name: 'Elétrica', image: '⚡', count: '420+ peças' },
            ].map((category) => (
              <Link
                key={category.name}
                href={`/categoria/${category.name.toLowerCase()}`}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center group"
              >
                <div className="text-4xl mb-4">{category.image}</div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600">
                  {category.name}
                </h3>
                <p className="text-gray-600">{category.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Produtos em Destaque</h2>
          <Link href="/produtos" className="text-primary-600 hover:text-primary-700 font-semibold">
            Ver todos →
          </Link>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <Car className="w-16 h-16 text-gray-400" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">Pastilha de Freio Dianteira</h3>
                <p className="text-gray-600 text-sm mb-3">Para veículos Honda Civic 2012-2016</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-primary-600">R$ 89,90</span>
                  <button className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors">
                    <ShoppingCart size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-dark-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Fique por dentro das novidades</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Receba ofertas exclusivas, lançamentos e dicas sobre manutenção automotiva
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Seu e-mail"
              className="flex-1 px-4 py-3 rounded-l-lg text-black"
            />
            <button className="bg-primary-600 hover:bg-primary-700 px-6 py-3 rounded-r-lg font-semibold transition-colors">
              Inscrever
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}