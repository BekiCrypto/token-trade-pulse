-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price_usd DECIMAL(10,2) NOT NULL,
  features JSONB NOT NULL DEFAULT '[]',
  max_strategies INTEGER NOT NULL DEFAULT 1,
  max_exchanges INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default plans
INSERT INTO public.subscription_plans (name, price_usd, features, max_strategies, max_exchanges) VALUES
('Basic', 25.00, '["Basic trading strategies", "1 exchange connection", "Email support"]', 1, 1),
('Pro', 50.00, '["Advanced strategies", "2 exchange connections", "Priority support", "Risk management tools"]', 3, 2),
('Elite', 100.00, '["All strategies", "Unlimited exchanges", "24/7 support", "Custom indicators", "Revenue sharing"]', 999, 999);

-- Create user subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  payment_method TEXT,
  crypto_transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create referral system table
CREATE TABLE public.user_referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL,
  referred_id UUID NOT NULL,
  level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1 AND level <= 10),
  commission_rate DECIMAL(5,4) NOT NULL,
  total_commission DECIMAL(15,8) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(referrer_id, referred_id)
);

-- Create referral codes table
CREATE TABLE public.referral_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  code TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  uses_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create commission transactions table
CREATE TABLE public.commission_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  referral_id UUID NOT NULL REFERENCES public.user_referrals(id),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('subscription_commission', 'profit_share')),
  amount DECIMAL(15,8) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  level INTEGER NOT NULL,
  source_user_id UUID NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create revenue sharing table
CREATE TABLE public.revenue_sharing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  trading_profit DECIMAL(15,8) NOT NULL,
  revenue_share_amount DECIMAL(15,8) NOT NULL,
  distribution_level INTEGER NOT NULL CHECK (distribution_level >= 1 AND distribution_level <= 10),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'distributed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_sharing ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_plans (readable by all authenticated users)
CREATE POLICY "Subscription plans are viewable by authenticated users" 
ON public.subscription_plans 
FOR SELECT 
TO authenticated 
USING (true);

-- RLS Policies for user_subscriptions
CREATE POLICY "Users can view their own subscriptions" 
ON public.user_subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" 
ON public.user_subscriptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" 
ON public.user_subscriptions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for user_referrals
CREATE POLICY "Users can view referrals they made or received" 
ON public.user_referrals 
FOR SELECT 
USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Users can create referrals" 
ON public.user_referrals 
FOR INSERT 
WITH CHECK (auth.uid() = referrer_id);

-- RLS Policies for referral_codes
CREATE POLICY "Users can view their own referral codes" 
ON public.referral_codes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own referral codes" 
ON public.referral_codes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own referral codes" 
ON public.referral_codes 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for commission_transactions
CREATE POLICY "Users can view their own commission transactions" 
ON public.commission_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

-- RLS Policies for revenue_sharing
CREATE POLICY "Users can view their own revenue sharing" 
ON public.revenue_sharing 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create function to calculate referral commission rates (decreasing from level 1-10)
CREATE OR REPLACE FUNCTION public.get_commission_rate(level INTEGER)
RETURNS DECIMAL(5,4)
LANGUAGE plpgsql
AS $$
BEGIN
  -- Total 20% commission shared across 10 levels in decreasing order
  CASE level
    WHEN 1 THEN RETURN 0.0500; -- 5%
    WHEN 2 THEN RETURN 0.0350; -- 3.5%
    WHEN 3 THEN RETURN 0.0250; -- 2.5%
    WHEN 4 THEN RETURN 0.0200; -- 2%
    WHEN 5 THEN RETURN 0.0175; -- 1.75%
    WHEN 6 THEN RETURN 0.0150; -- 1.5%
    WHEN 7 THEN RETURN 0.0125; -- 1.25%
    WHEN 8 THEN RETURN 0.0100; -- 1%
    WHEN 9 THEN RETURN 0.0075; -- 0.75%
    WHEN 10 THEN RETURN 0.0050; -- 0.5%
    ELSE RETURN 0.0000;
  END CASE;
END;
$$;

-- Create function to generate referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    code := upper(substring(replace(gen_random_uuid()::text, '-', '') from 1 for 8));
    SELECT EXISTS(SELECT 1 FROM public.referral_codes WHERE referral_codes.code = code) INTO exists;
    IF NOT exists THEN
      EXIT;
    END IF;
  END LOOP;
  RETURN code;
END;
$$;

-- Create triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_subscriptions_updated_at
BEFORE UPDATE ON public.user_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();