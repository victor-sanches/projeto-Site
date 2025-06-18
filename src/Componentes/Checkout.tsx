import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin, CreditCard } from 'lucide-react';
import { CartItem } from './Cart';
import { PixGenerator } from './PixGenerator';

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
}

interface CustomerData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

export const Checkout: React.FC<CheckoutProps> = ({ isOpen, onClose, items, total }) => {
  const [step, setStep] = useState<'form' | 'payment'>('form');
  const [pixFechado, setPixFechado] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });

  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleInputChange = (field: keyof CustomerData, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/api/pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: customerData.name,
          email: customerData.email,
          telefone: customerData.phone,
          endereco: customerData.address,
          cidade: customerData.city,
          cep: customerData.zipCode,
          total,
          items,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Erro ao salvar pedido');
      }
  
      setStep('payment');
    } catch (error) {
      alert('Não foi possível salvar seu pedido. Tente novamente.');
    }
  };

  const isFormValid = Object.values(customerData).every(value => value.trim() !== '');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
          {step === 'form'
          ? 'Dados para Entrega'
          : pixFechado
          ? 'Pagamento Pendente'
          : 'Pagamento via PIX'}

          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSubmitForm} className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Dados Pessoais
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={customerData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={customerData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Telefone
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  Endereço de Entrega
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Endereço Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={customerData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    required
                    value={customerData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CEP
                  </label>
                  <input
                    type="text"
                    required
                    value={customerData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Resumo do Pedido</h4>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full mt-6 py-3 rounded-lg font-semibold transition-colors ${
                isFormValid
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continuar para Pagamento
            </button>
          </form>
        ) : (
          <div className="p-6 space-y-4">
          {/* Alerta de status */}
          <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg border border-yellow-300 flex items-center gap-2">
            <p className="font-medium">Status: <strong>Aguardando pagamento</strong></p>
          </div>
      
          {/* PIX visível se ainda não foi fechado */}
          {!pixFechado && (
            <PixGenerator
              customerData={customerData}
              items={items}
              total={total}
              onBack={() => setPixFechado(true)}
            />
          )}
      
          {/* Se o usuário fechou o PIX */}
          {pixFechado && (
            <div className="p-4 bg-gray-100 rounded-lg space-y-3">
              <p className="text-gray-800">
                O pagamento ainda não foi confirmado. Deseja tentar novamente ou cancelar a compra?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setPixFechado(false)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Reabrir pagamento
                </button>
                <button
                  onClick={() => {
                    setStep('form');
                    setPixFechado(false);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Cancelar compra
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
};