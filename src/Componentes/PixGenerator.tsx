import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, QrCode, Clock } from 'lucide-react';
import { CartItem } from './Cart';

interface CustomerData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

interface PixGeneratorProps {
  customerData: CustomerData;
  items: CartItem[];
  total: number;
  onBack: () => void;
}

export const PixGenerator: React.FC<PixGeneratorProps> = ({ customerData, items, total, onBack }) => {
  const [pixCode, setPixCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutos

  useEffect(() => {
    // Gerar código PIX simulado
    const generatePixCode = () => {
      const timestamp = new Date().getTime();
      const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
      const amount = total.toFixed(2).replace('.', '');
      
      // Código PIX simulado (em produção seria gerado por uma API de pagamento)
      const code = `00020126580014BR.GOV.BCB.PIX0136${orderId}${timestamp}520400005303986540${amount.padStart(8, '0')}5802BR5915TECHSTORE LTDA6009SAO PAULO61080540900062070503***6304`;
      
      return code + Math.random().toString(36).substr(2, 4).toUpperCase();
    };

    setPixCode(generatePixCode());
  }, [total]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Voltar aos dados
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-800">Pagamento via PIX</h3>
              <div className="flex items-center text-orange-600">
                <Clock className="h-4 w-4 mr-1" />
                <span className="font-mono text-sm">{formatTime(timeLeft)}</span>
              </div>
            </div>
            
            <div className="text-2xl font-bold text-green-700 mb-2">
              {formatPrice(total)}
            </div>
            
            <p className="text-green-600 text-sm">
              Código expira em {formatTime(timeLeft)}. Após o pagamento, sua compra será processada automaticamente.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <QrCode className="h-5 w-5 mr-2 text-blue-600" />
              Código PIX Cópia e Cola
            </h4>
            
            <div className="bg-gray-50 p-3 rounded-lg mb-3">
              <div className="text-xs font-mono text-gray-700 break-all leading-relaxed">
                {pixCode}
              </div>
            </div>
            
            <button
              onClick={copyToClipboard}
              className={`w-full flex items-center justify-center space-x-2 py-3 rounded-lg font-semibold transition-all duration-200 ${
                copied
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-5 w-5" />
                  <span>Código Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5" />
                  <span>Copiar Código PIX</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Como pagar com PIX:</h4>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Abra o app do seu banco</li>
              <li>2. Escolha a opção PIX</li>
              <li>3. Selecione "Colar código" ou "PIX Copia e Cola"</li>
              <li>4. Cole o código copiado acima</li>
              <li>5. Confirme o pagamento</li>
            </ol>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-3">Dados do Pedido</h4>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Nome:</span> {customerData.name}</div>
              <div><span className="font-medium">Email:</span> {customerData.email}</div>
              <div><span className="font-medium">Telefone:</span> {customerData.phone}</div>
              <div><span className="font-medium">Endereço:</span> {customerData.address}</div>
              <div><span className="font-medium">Cidade:</span> {customerData.city}</div>
              <div><span className="font-medium">CEP:</span> {customerData.zipCode}</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold mb-3">Itens do Pedido</h4>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">Qtd: {item.quantity}</div>
                  </div>
                  <div className="text-sm font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
              
              <div className="border-t pt-3 flex justify-between font-bold">
                <span>Total:</span>
                <span className="text-blue-600">{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Importante:</h4>
            <p className="text-sm text-yellow-700">
              Após realizar o pagamento, você receberá um email de confirmação. 
              Seus produtos serão enviados em até 2 dias úteis após a confirmação do pagamento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};