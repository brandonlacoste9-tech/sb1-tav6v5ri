import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import Stripe from 'npm:stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const signature = req.headers.get('stripe-signature')
    const body = await req.text()
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

    if (!signature || !webhookSecret) {
      throw new Error('Missing signature or webhook secret')
    }

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    console.log('Received webhook event:', event.type, event.id)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId

        console.log('Processing checkout completion for user:', userId)

        if (userId && session.subscription) {
          // Get subscription details
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
          const priceId = subscription.items.data[0]?.price.id

          // Determine plan type based on price ID
          let planType = 'free'
          if (priceId === 'price_1QdVJhP8mnDdBQuYhvQBQtY1') planType = 'pro'
          if (priceId === 'price_1QdVJhP8mnDdBQuYhvQBQtY2') planType = 'enterprise'

          console.log('Updating subscription for user:', userId, 'to plan:', planType)

          // Update user subscription in database
          const { error } = await supabase
            .from('profiles')
            .update({
              subscription_status: 'active',
              subscription_id: subscription.id,
              plan_type: planType,
              subscription_created_at: new Date().toISOString(),
              subscription_updated_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId)

          if (error) {
            console.error('Error updating user subscription:', error)
            throw error
          } else {
            console.log('Successfully updated user subscription for:', userId)
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        console.log('Processing subscription update for user:', userId)

        if (userId) {
          const status = subscription.status === 'active' ? 'active' : 
                       subscription.status === 'past_due' ? 'past_due' : 'cancelled'
          
          const { error } = await supabase
            .from('profiles')
            .update({
              subscription_status: status,
              subscription_updated_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('subscription_id', subscription.id)

          if (error) {
            console.error('Error updating subscription status:', error)
            throw error
          } else {
            console.log('Successfully updated subscription status for:', userId)
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        console.log('Processing subscription deletion for user:', userId)

        if (userId) {
          const { error } = await supabase
            .from('profiles')
            .update({
              subscription_status: 'cancelled',
              plan_type: 'free',
              subscription_updated_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('subscription_id', subscription.id)

          if (error) {
            console.error('Error updating subscription deletion:', error)
            throw error
          } else {
            console.log('Successfully processed subscription deletion for:', userId)
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string

        console.log('Processing payment failure for subscription:', subscriptionId)

        if (subscriptionId) {
          const { error } = await supabase
            .from('profiles')
            .update({
              subscription_status: 'past_due',
              subscription_updated_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('subscription_id', subscriptionId)

          if (error) {
            console.error('Error updating payment failed status:', error)
            throw error
          } else {
            console.log('Successfully updated payment failed status for subscription:', subscriptionId)
          }
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string

        console.log('Processing successful payment for subscription:', subscriptionId)

        if (subscriptionId) {
          const { error } = await supabase
            .from('profiles')
            .update({
              subscription_status: 'active',
              subscription_updated_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('subscription_id', subscriptionId)

          if (error) {
            console.error('Error updating payment success status:', error)
          } else {
            console.log('Successfully updated payment success status for subscription:', subscriptionId)
          }
        }
        break
      }

      default:
        console.log('Unhandled event type:', event.type)
    }

    return new Response(
      JSON.stringify({ 
        received: true, 
        eventType: event.type,
        eventId: event.id 
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})