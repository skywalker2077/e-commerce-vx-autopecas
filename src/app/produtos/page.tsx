'use client'

import { useState, useEffect } from 'react'
import { Car, Filter, ShoppingCart, Star } from 'lucide-react'
import Link from 'next/link'

interface Product {
  id: number
  name: string
  price: number
  brand: string
  model: string
  category_name: string
  description: string
  stock: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })

  // Simulando dados até conectar com o backend
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'Pastilha de Freio Dianteira',
        price: 89.90,
        brand: 'Honda',
        model: 'Civic',
        category_name: 'Freios',
        description: 'Pastilha de freio premium para veículos Honda Civic 2012-2016',
        stock: 25
      },
      {
        id: 2,
        name: 'Filtro de Óleo',
        price: 35.50,
        brand: 'Toyota',
        model: 'Corolla',
        category_name: 'Filtros',
        description: 'Filtro de óleo de alta qualidade para motores 1.6',
        stock: 50
      },
      {
        id: 3,
        name: 'Vela de Ignição',
        price: 45.00,
        brand: 'Universal',
        model: 'Diversos',
        category_name: 'Motor',
        description: 'Vela de ignição iridium para melhor performance',
        stock: 100
      },
      {
        id: 4,
        name: 'Disco de Freio Ventilado',
        price: 150.00,
        brand: 'Ford',
        model: 'Focus',
        category_name: 'Freios',
        description: 'Disco de freio ventilado para melhor dissipação de calor',
        stock: 15
      },
      {
        id: 5,
        name: 'Amortecedor Dianteiro',
        price: 220.00,
        brand: 'Chevrolet',
        model: 'Onix',
        category_name: 'Suspensão',
        description: 'Amortecedor dianteiro original para Chevrolet Onix',
        stock: 8
      },
      {
        id: 6,
        name: 'Bateria 60Ah',
        price: 380.00,
        brand: 'Universal',
        model: 'Diversos',
        category_name: 'Elétrica',
        description: 'Bateria automotiva 60Ah livre de manutenção',
        stock: 12
      }
    ]

    setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 1000)
  }, [])

  const categories = ['Todos', 'Motor', 'Freios', 'Suspensão', 'Elétrica', 'Filtros']

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.model.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === '' || selectedCategory === 'Todos' || 
                           product.category_name === selectedCategory
    
    const matchesPrice = (priceRange.min === '' || product.price >= parseFloat(priceRange.min)) &&
                        (priceRange.max === '' || product.price <= parseFloat(priceRange.max))
    
    return matchesSearch && matchesCategory && matchesPrice
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar de Filtros */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
            <div className="flex items-center mb-6">
              <Filter className="w-5 h-5 text-primary-600 mr-2" />
              <h2 className="text-xl font-semibold">Filtros</h2>
            </div>

            {/* Busca */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar Produto
              </label>
              <input
                type="text"
                placeholder="Nome, marca ou modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Categoria */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category === 'Todos' ? '' : category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Faixa de Preço */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Faixa de Preço
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Limpar Filtros */}
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('')
                setPriceRange({ min: '', max: '' })
              }}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </div>

        {/* Lista de Produtos */}
        <div className="lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Nossos Produtos ({filteredProducts.length})
            </h1>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
              <option>Ordenar por</option>
              <option>Menor preço</option>
              <option>Maior preço</option>
              <option>Nome A-Z</option>
              <option>Nome Z-A</option>
            </select>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-500">
                Tente ajustar os filtros para encontrar o que procura
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <Car className="w-16 h-16 text-gray-400" />
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {product.name}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.stock > 10 ? 'bg-green-100 text-green-800' :
                        product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > 0 ? `${product.stock} un.` : 'Sem estoque'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {product.brand} {product.model}
                    </p>
                    
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center mb-3">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
                        {product.category_name}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-primary-600">
                          R$ {product.price.toFixed(2)}
                        </span>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                          <span className="text-sm text-gray-500 ml-1">(15)</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Link
                          href={`/produto/${product.id}`}
                          className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors text-center text-sm"
                        >
                          Ver Detalhes
                        </Link>
                        {product.stock > 0 && (
                          <button className="border-2 border-primary-600 text-primary-600 px-4 py-2 rounded hover:bg-primary-600 hover:text-white transition-colors text-sm">
                            <ShoppingCart size={16} className="inline mr-1" />
                            Adicionar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Paginação */}
          {filteredProducts.length > 0 && (
            <div className="flex justify-center mt-12">
              <nav className="flex space-x-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                  Anterior
                </button>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg">
                  1
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                  2
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                  3
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                  Próximo
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}