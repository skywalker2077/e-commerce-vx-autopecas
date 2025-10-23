'use client'

import { useState } from 'react'
import { ShoppingCart, Minus, Plus, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react'
import { useParams } from 'next/navigation'

export default function ProductDetailPage() {
  const params = useParams()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  // Simulando dados do produto
  const product = {
    id: 1,
    name: 'Pastilha de Freio Dianteira Premium',
    brand: 'Honda',
    model: 'Civic 2012-2016',
    partNumber: 'HB001',
    price: 89.90,
    originalPrice: 120.00,
    stock: 25,
    rating: 4.8,
    reviews: 15,
    category: 'Freios',
    description: 'Pastilha de freio premium desenvolvida especificamente para veículos Honda Civic dos anos 2012 a 2016. Oferece excelente performance de frenagem, baixo ruído e longa durabilidade.',
    features: [
      'Material cerâmico de alta qualidade',
      'Baixo nível de ruído',
      'Excelente dissipação de calor',
      'Livre de amianto',
      'Compatível com discos ventilados',
      'Garantia de 1 ano'
    ],
    specifications: {
      'Código Original': 'HB001',
      'Material': 'Cerâmico',
      'Posição': 'Dianteira',
      'Lado': 'Ambos',
      'Garantia': '12 meses',
      'Peso': '1.2 kg'
    },
    compatibility: [
      'Honda Civic Sedan 1.8 16V (2012-2016)',
      'Honda Civic LX 1.8 16V (2012-2016)',
      'Honda Civic EX 1.8 16V (2012-2016)',
      'Honda Civic EXR 2.0 16V (2012-2016)'
    ],
    images: [
      '/placeholder-product-1.jpg',
      '/placeholder-product-2.jpg',
      '/placeholder-product-3.jpg'
    ]
  }

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex text-sm text-gray-600 mb-8">
        <a href="/" className="hover:text-primary-600">Home</a>
        <span className="mx-2">/</span>
        <a href="/produtos" className="hover:text-primary-600">Produtos</a>
        <span className="mx-2">/</span>
        <a href={`/categoria/${product.category.toLowerCase()}`} className="hover:text-primary-600">{product.category}</a>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Galeria de Imagens */}
        <div>
          <div className="mb-4">
            <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-6xl text-gray-400">🔧</div>
            </div>
          </div>
          <div className="flex space-x-2">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center ${
                  selectedImage === index ? 'ring-2 ring-primary-600' : ''
                }`}
              >
                <div className="text-2xl text-gray-400">🔧</div>
              </button>
            ))}
          </div>
        </div>

        {/* Informações do Produto */}
        <div>
          <div className="mb-4">
            <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-primary-100 text-primary-800">
              {product.category}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {product.rating} ({product.reviews} avaliações)
              </span>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 mb-2">
              <strong>Marca:</strong> {product.brand} | <strong>Modelo:</strong> {product.model}
            </p>
            <p className="text-gray-600">
              <strong>Código:</strong> {product.partNumber}
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline space-x-3">
              {product.originalPrice > product.price && (
                <span className="text-lg text-gray-500 line-through">
                  R$ {product.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-3xl font-bold text-primary-600">
                R$ {product.price.toFixed(2)}
              </span>
              {product.originalPrice > product.price && (
                <span className="bg-red-100 text-red-800 px-2 py-1 text-sm font-semibold rounded">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              )}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-700">{product.description}</p>
          </div>

          {/* Estoque */}
          <div className="mb-6">
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${
                product.stock > 10 ? 'bg-green-500' : 
                product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
              }`}></span>
              <span className="text-sm text-gray-600">
                {product.stock > 0 ? `${product.stock} unidades em estoque` : 'Sem estoque'}
              </span>
            </div>
          </div>

          {/* Quantidade e Adicionar ao Carrinho */}
          {product.stock > 0 && (
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-sm font-medium text-gray-700">Quantidade:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 hover:bg-gray-100"
                    disabled={quantity >= product.stock}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2">
                  <ShoppingCart size={20} />
                  <span>Adicionar ao Carrinho</span>
                </button>
                <button className="border-2 border-gray-300 text-gray-600 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart size={20} />
                </button>
                <button className="border-2 border-gray-300 text-gray-600 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Benefícios */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Truck className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Frete Grátis</div>
              <div className="text-xs text-gray-600">Acima de R$ 150</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Shield className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Garantia</div>
              <div className="text-xs text-gray-600">12 meses</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <RotateCcw className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Troca</div>
              <div className="text-xs text-gray-600">7 dias</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detalhes Adicionais */}
      <div className="mt-16">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button className="border-b-2 border-primary-600 text-primary-600 py-4 px-1 text-sm font-medium">
              Características
            </button>
            <button className="border-transparent text-gray-500 hover:text-gray-700 py-4 px-1 text-sm font-medium">
              Especificações
            </button>
            <button className="border-transparent text-gray-500 hover:text-gray-700 py-4 px-1 text-sm font-medium">
              Compatibilidade
            </button>
            <button className="border-transparent text-gray-500 hover:text-gray-700 py-4 px-1 text-sm font-medium">
              Avaliações
            </button>
          </nav>
        </div>

        <div className="py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Características Principais</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Especificações Técnicas</h3>
              <dl className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex">
                    <dt className="w-1/2 text-sm font-medium text-gray-600">{key}:</dt>
                    <dd className="w-1/2 text-sm text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}