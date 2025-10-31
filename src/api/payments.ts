// Payment Gateway API
// Para producción, integra con Mercado Pago, Stripe, PayU, etc.

interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'pse' | 'cash' | 'transfer';
  icon: string;
}

interface PaymentData {
  amount: number;
  currency: string;
  method: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    document: string;
  };
  billing?: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  cardData?: {
    number: string;
    holderName: string;
    expiryDate: string;
    cvv: string;
  };
}

interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  paymentUrl?: string;
  error?: string;
}

// Métodos de pago disponibles
export const paymentMethods: PaymentMethod[] = [
  {
    id: 'credit_card',
    name: 'Tarjeta de Crédito',
    type: 'card',
    icon: '💳'
  },
  {
    id: 'debit_card',
    name: 'Tarjeta Débito',
    type: 'card',
    icon: '💳'
  },
  {
    id: 'pse',
    name: 'PSE',
    type: 'pse',
    icon: '🏦'
  },
  {
    id: 'efecty',
    name: 'Efecty',
    type: 'cash',
    icon: '💵'
  },
  {
    id: 'baloto',
    name: 'Baloto',
    type: 'cash',
    icon: '🎫'
  },
  {
    id: 'transfer',
    name: 'Transferencia Bancaria',
    type: 'transfer',
    icon: '🏦'
  }
];

// Validar número de tarjeta (Algoritmo de Luhn)
function validateCardNumber(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\s/g, '');

  if (!/^\d{13,19}$/.test(digits)) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

// Validar CVV
function validateCVV(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv);
}

// Validar fecha de expiración
function validateExpiryDate(expiryDate: string): boolean {
  const [month, year] = expiryDate.split('/');
  if (!month || !year) return false;

  const monthNum = parseInt(month);
  const yearNum = parseInt('20' + year);

  if (monthNum < 1 || monthNum > 12) return false;

  const now = new Date();
  const expiry = new Date(yearNum, monthNum - 1);

  return expiry > now;
}

// Procesar pago con tarjeta
export async function processCardPayment(paymentData: PaymentData): Promise<PaymentResponse> {
  // Validaciones
  if (paymentData.cardData) {
    if (!validateCardNumber(paymentData.cardData.number)) {
      return {
        success: false,
        message: 'Número de tarjeta inválido',
        error: 'INVALID_CARD_NUMBER'
      };
    }

    if (!validateCVV(paymentData.cardData.cvv)) {
      return {
        success: false,
        message: 'CVV inválido',
        error: 'INVALID_CVV'
      };
    }

    if (!validateExpiryDate(paymentData.cardData.expiryDate)) {
      return {
        success: false,
        message: 'Fecha de expiración inválida o tarjeta vencida',
        error: 'INVALID_EXPIRY'
      };
    }
  }

  // Simular procesamiento de pago
  await new Promise(resolve => setTimeout(resolve, 2000));

  // En producción, aquí harías la llamada a tu pasarela de pago:
  /*
  // Ejemplo con Mercado Pago:
  const response = await fetch('https://api.mercadopago.com/v1/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
    },
    body: JSON.stringify({
      transaction_amount: paymentData.amount,
      token: cardToken,
      description: 'Compra en Speed Logic',
      installments: 1,
      payment_method_id: 'visa',
      payer: {
        email: paymentData.customer.email,
        identification: {
          type: 'CC',
          number: paymentData.customer.document
        }
      }
    })
  });

  // Ejemplo con Stripe:
  const response = await fetch('https://api.stripe.com/v1/payment_intents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer YOUR_SECRET_KEY'
    },
    body: new URLSearchParams({
      amount: (paymentData.amount * 100).toString(),
      currency: 'cop',
      'payment_method_types[]': 'card'
    })
  });
  */

  // Simulación: 90% de éxito
  const success = Math.random() > 0.1;

  if (success) {
    return {
      success: true,
      transactionId: 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      message: '¡Pago procesado exitosamente! Recibirás un correo de confirmación.'
    };
  } else {
    return {
      success: false,
      message: 'El pago fue rechazado. Por favor verifica tus datos o intenta con otro método de pago.',
      error: 'PAYMENT_DECLINED'
    };
  }
}

// Procesar pago con PSE
export async function processPSEPayment(paymentData: PaymentData): Promise<PaymentResponse> {
  await new Promise(resolve => setTimeout(resolve, 1500));

  // En producción, generar URL de pago PSE
  /*
  const response = await fetch('YOUR_PSE_GATEWAY/create-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: paymentData.amount,
      customer: paymentData.customer,
      returnUrl: window.location.origin + '/payment-success',
      cancelUrl: window.location.origin + '/payment-cancel'
    })
  });
  */

  return {
    success: true,
    transactionId: 'PSE-' + Date.now(),
    message: 'Serás redirigido a tu banco para completar el pago',
    paymentUrl: '#pse-payment' // En producción, URL real del banco
  };
}

// Procesar pago en efectivo
export async function processCashPayment(paymentData: PaymentData): Promise<PaymentResponse> {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const reference = 'REF-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();

  return {
    success: true,
    transactionId: reference,
    message: `Pago registrado. Código de referencia: ${reference}. Realiza el pago en puntos ${paymentData.method === 'efecty' ? 'Efecty' : 'Baloto'} con este código.`
  };
}

// Función principal para procesar pagos
export async function processPayment(paymentData: PaymentData): Promise<PaymentResponse> {
  try {
    switch (paymentData.method) {
      case 'credit_card':
      case 'debit_card':
        return await processCardPayment(paymentData);

      case 'pse':
        return await processPSEPayment(paymentData);

      case 'efecty':
      case 'baloto':
        return await processCashPayment(paymentData);

      case 'transfer':
        return {
          success: true,
          transactionId: 'TRANSFER-' + Date.now(),
          message: 'Recibirás por correo los datos bancarios para realizar la transferencia.'
        };

      default:
        return {
          success: false,
          message: 'Método de pago no válido',
          error: 'INVALID_PAYMENT_METHOD'
        };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error al procesar el pago. Por favor intenta nuevamente.',
      error: 'PROCESSING_ERROR'
    };
  }
}

// Exportar tipos
export type { PaymentMethod, PaymentData, PaymentResponse };