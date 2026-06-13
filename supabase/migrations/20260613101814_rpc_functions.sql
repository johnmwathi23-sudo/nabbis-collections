-- Increment/Decrement loyalty points
CREATE OR REPLACE FUNCTION increment_loyalty_points(
  p_customer_id UUID,
  p_points INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET loyalty_points = GREATEST(0, loyalty_points + p_points)
  WHERE id = p_customer_id;
END;
$$;

-- Get or create a cart session ID for guest users
CREATE OR REPLACE FUNCTION get_or_create_session_id()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '');
$$;

-- Calculate cart total with delivery
CREATE OR REPLACE FUNCTION calculate_cart_total(
  p_session_id TEXT DEFAULT NULL,
  p_customer_id UUID DEFAULT NULL
)
RETURNS TABLE(
  subtotal DECIMAL,
  item_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(ci.quantity * p.price), 0)::DECIMAL AS subtotal,
    COUNT(*)::BIGINT AS item_count
  FROM cart_items ci
  JOIN products p ON p.id = ci.product_id
  WHERE (p_session_id IS NOT NULL AND ci.session_id = p_session_id)
     OR (p_customer_id IS NOT NULL AND ci.customer_id = p_customer_id);
END;
$$;
