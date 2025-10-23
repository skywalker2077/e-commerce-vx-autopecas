import React from 'react'
import { ShoppingCart, User, Search, Settings } from 'lucide-react'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-dark-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex justify-between items-center py-2 text-sm border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <span>📞 (11) 9999-9999</span>
            <span>📧 contato@vxautopecas.com.br</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="flex items-center space-x-1 hover:text-primary-500">
              <Settings size={16} />
              <span>Admin</span>
            </Link>
            <Link href="/conta" className="flex items-center space-x-1 hover:text-primary-500">
              <User size={16} />
              <span>Minha Conta</span>
            </Link>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 12L16 6L26 12V24C26 24.5304 25.7893 25.0391 25.4142 25.4142C25.0391 25.7893 24.5304 26 24 26H8C7.46957 26 6.96086 25.7893 6.58579 25.4142C6.21071 25.0391 6 24.5304 6 24V12Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 26V16H20V26"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="16" cy="8" r="2" fill="white"/>
                <text x="4" y="30" fontSize="6" fill="white" fontWeight="bold">VX</text>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-500">VX Autopeças</h1>
              <p className="text-xs text-gray-300">Qualidade e Confiança</p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar peças por modelo, marca ou código..."
                className="w-full py-3 px-4 pr-12 rounded-lg bg-white text-black border-2 border-transparent focus:border-primary-500 focus:outline-none"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700">
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Cart */}
          <Link href="/carrinho" className="flex items-center space-x-2 bg-primary-600 px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
            <ShoppingCart size={20} />
            <span className="hidden md:block">Carrinho</span>
            <span className="bg-white text-primary-600 px-2 py-1 rounded-full text-xs font-bold">0</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="py-3 border-t border-gray-700">
          <ul className="flex space-x-8">
            <li><Link href="/" className="hover:text-primary-500 transition-colors">Home</Link></li>
            <li><Link href="/produtos" className="hover:text-primary-500 transition-colors">Produtos</Link></li>
            <li><Link href="/categorias" className="hover:text-primary-500 transition-colors">Categorias</Link></li>
            <li><Link href="/promocoes" className="hover:text-primary-500 transition-colors">Promoções</Link></li>
            <li><Link href="/sobre" className="hover:text-primary-500 transition-colors">Sobre</Link></li>
            <li><Link href="/contato" className="hover:text-primary-500 transition-colors">Contato</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}