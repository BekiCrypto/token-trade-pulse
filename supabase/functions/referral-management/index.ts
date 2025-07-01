import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ReferralRequest {
  action: 'create_code' | 'apply_code' | 'calculate_commissions'
  userId: string
  referralCode?: string
  subscriptionAmount?: number
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
      const { action, userId, referralCode, subscriptionAmount }: ReferralRequest = await req.json()

      switch (action) {
        case 'create_code': {
          // Generate unique referral code
          const { data: code } = await supabase.rpc('generate_referral_code')
          
          const { error } = await supabase
            .from('referral_codes')
            .insert({
              user_id: userId,
              code: code,
              is_active: true
            })

          if (error) {
            return new Response(
              JSON.stringify({ error: 'Failed to create referral code' }),
              { 
                status: 500, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            )
          }

          return new Response(
            JSON.stringify({ success: true, code }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        case 'apply_code': {
          if (!referralCode) {
            return new Response(
              JSON.stringify({ error: 'Referral code required' }),
              { 
                status: 400, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            )
          }

          // Find referral code
          const { data: codeData, error: codeError } = await supabase
            .from('referral_codes')
            .select('user_id')
            .eq('code', referralCode)
            .eq('is_active', true)
            .single()

          if (codeError || !codeData) {
            return new Response(
              JSON.stringify({ error: 'Invalid referral code' }),
              { 
                status: 404, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            )
          }

          // Create referral relationship
          const { error: referralError } = await supabase
            .from('user_referrals')
            .insert({
              referrer_id: codeData.user_id,
              referred_id: userId,
              level: 1,
              commission_rate: 0.0500 // 5% for level 1
            })

          if (referralError) {
            return new Response(
              JSON.stringify({ error: 'Failed to apply referral code' }),
              { 
                status: 500, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            )
          }

          // Update code usage count
          await supabase
            .from('referral_codes')
            .update({ uses_count: supabase.sql`uses_count + 1` })
            .eq('code', referralCode)

          return new Response(
            JSON.stringify({ success: true }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        case 'calculate_commissions': {
          if (!subscriptionAmount) {
            return new Response(
              JSON.stringify({ error: 'Subscription amount required' }),
              { 
                status: 400, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            )
          }

          // Find all referrers up to 10 levels deep
          const { data: referrals, error: referralError } = await supabase
            .from('user_referrals')
            .select('*')
            .eq('referred_id', userId)

          if (referralError) {
            return new Response(
              JSON.stringify({ error: 'Failed to fetch referrals' }),
              { 
                status: 500, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            )
          }

          // Calculate and store commissions for each level
          for (const referral of referrals || []) {
            const { data: commissionRate } = await supabase
              .rpc('get_commission_rate', { level: referral.level })

            const commissionAmount = subscriptionAmount * commissionRate

            // Store commission transaction
            await supabase
              .from('commission_transactions')
              .insert({
                user_id: referral.referrer_id,
                referral_id: referral.id,
                transaction_type: 'subscription_commission',
                amount: commissionAmount,
                level: referral.level,
                source_user_id: userId,
                payment_status: 'pending'
              })

            // Update total commission
            await supabase
              .from('user_referrals')
              .update({ 
                total_commission: supabase.sql`total_commission + ${commissionAmount}` 
              })
              .eq('id', referral.id)
          }

          return new Response(
            JSON.stringify({ success: true, commissionsCalculated: referrals?.length || 0 }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        default:
          return new Response(
            JSON.stringify({ error: 'Invalid action' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
      }
    }

    // GET request for referral stats
    if (req.method === 'GET') {
      const url = new URL(req.url)
      const userId = url.searchParams.get('userId')

      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'User ID required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Get referral statistics
      const { data: referrals } = await supabase
        .from('user_referrals')
        .select('level, total_commission')
        .eq('referrer_id', userId)

      const { data: commissions } = await supabase
        .from('commission_transactions')
        .select('amount, level')
        .eq('user_id', userId)
        .eq('payment_status', 'paid')

      const totalReferrals = referrals?.length || 0
      const totalCommissions = commissions?.reduce((sum, c) => sum + parseFloat(c.amount), 0) || 0

      // Group by level
      const levelBreakdown = Array.from({ length: 10 }, (_, i) => {
        const level = i + 1
        const levelReferrals = referrals?.filter(r => r.level === level) || []
        const levelCommissions = commissions?.filter(c => c.level === level) || []
        
        return {
          level,
          count: levelReferrals.length,
          commission: levelCommissions.reduce((sum, c) => sum + parseFloat(c.amount), 0)
        }
      }).filter(l => l.count > 0)

      return new Response(
        JSON.stringify({
          totalReferrals,
          totalCommissions,
          levelBreakdown
        }),
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
    console.error('Referral function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})