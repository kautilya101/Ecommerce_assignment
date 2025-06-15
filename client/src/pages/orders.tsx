import React from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { HeartCrack } from 'lucide-react'

const Orders = () => {
  const [searchParams] = useSearchParams()
  const success = searchParams.get('success')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        {success === 'true' ? (
          <div className="space-y-6">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h1 className="text-2xl font-bold text-gray-800">Transaction Successful!</h1>
            <p className="text-gray-600">Thank you for your purchase. It was a pleasure doing business with you!</p>
            <Link 
              to="/"
              className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <HeartCrack className="mx-auto w-12 h-12 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-800">Transaction Failed</h1>
            <p className="text-gray-600">We're sorry, but your transaction could not be completed.</p>
            <div className="space-y-3">
              <Link 
                to="/"
                className="inline-block w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Return to Home
              </Link>
              <Link 
                to="/products"
                className="inline-block w-full px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Explore Products
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
