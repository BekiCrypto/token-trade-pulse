import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentRequest {
  planId: string
  currency: string
  userId: string
}

interface NOWPaymentsResponse {
  payment_id: string
  payment_status: string
  pay_address: string
  price_amount: number
  price_currency: string
  pay_amount: number
  pay_currency: string
  order_id: string
  order_description: string
  purchase_id: string
  outcome_amount: number
  outcome_currency: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (req.method === 'POST') {
      const { planId, currency, userId }: PaymentRequest = await req.json()

      // Get plan details
      const { data: plan, error: planError } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', planId)
        .single()

      if (planError || !plan) {
        return new Response(
          JSON.stringify({ error: 'Plan not found' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Create payment with NOWPayments (mock implementation)
      const nowPaymentsApiKey = Deno.env.get('NOWPAYMENTS_API_KEY')
      
      if (!nowPaymentsApiKey) {
        console.error('NOWPayments API key not configured')
        return new Response(
          JSON.stringify({ error: 'Payment service not configured' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Mock NOWPayments integration - in production, use real API
      const mockPaymentResponse: NOWPaymentsResponse = {
        payment_id: `np_${Date.now()}`,
        payment_status: 'waiting',
        pay_address: currency === 'BTC' ? '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' : '0x742d35cc6644c4532b7b8b52b1b0b8b5d4e4e4e4',
        price_amount: plan.price_usd,
        price_currency: 'USD',
        pay_amount: currency === 'BTC' ? 0.00087 : 0.0234,
        pay_currency: currency,
        order_id: `order_${Date.now()}`,
        order_description: `${plan.name} Plan Subscription`,
        purchase_id: `purchase_${Date.now()}`,
        outcome_amount: plan.price_usd,
        outcome_currency: 'USD'
      }

      // Store pending subscription
      const expirationDate = new Date()
      expirationDate.setMonth(expirationDate.getMonth() + 1)

      const { error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          plan_id: planId,
          status: 'pending',
          expires_at: expirationDate.toISOString(),
          payment_method: currency,
          crypto_transaction_id: mockPaymentResponse.payment_id
        })

      if (subscriptionError) {
        console.error('Error creating subscription:', subscriptionError)
        return new Response(
          JSON.stringify({ error: 'Failed to create subscription' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({
          success: true,
          payment: mockPaymentResponse
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Handle payment status webhook
    if (req.method === 'PUT') {
      const { payment_id, payment_status } = await req.json()

      // Update subscription status based on payment
      if (payment_status === 'finished') {
        const { error } = await supabase
          .from('user_subscriptions')
          .update({ status: 'active' })
          .eq('crypto_transaction_id', payment_id)

        if (error) {
          console.error('Error updating subscription:', error)
        }
      } else if (payment_status === 'failed') {
        const { error } = await supabase
          .from('user_subscriptions')
          .update({ status: 'expired' })
          .eq('crypto_transaction_id', payment_id)

        if (error) {
          console.error('Error updating subscription:', error)
        }
      }

      return new Response(
        JSON.stringify({ success: true }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Payment function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})