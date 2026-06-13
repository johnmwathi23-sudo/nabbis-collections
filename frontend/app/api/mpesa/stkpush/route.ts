import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

function formatPhone(phone: string): string {
  const cleaned = phone.replace(/[^0-9]/g, "");
  if (cleaned.startsWith("0")) return "254" + cleaned.slice(1);
  if (cleaned.startsWith("+")) return cleaned.slice(1);
  if (cleaned.startsWith("254")) return cleaned;
  return "254" + cleaned;
}

async function getMpesaToken(): Promise<string> {
  const consumerKey = process.env.MPESA_CONSUMER_KEY!;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET!;
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  const env = process.env.MPESA_ENVIRONMENT || "sandbox";
  const url = env === "production"
    ? "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    : "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

  const res = await fetch(url, {
    headers: { Authorization: `Basic ${auth}` },
  });

  const data = await res.json();
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const { orderId, amount, phone } = await req.json();
    const token = await getMpesaToken();

    const shortCode = process.env.MPESA_SHORTCODE || "174379";
    const passkey = process.env.MPESA_PASSKEY || "";
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString("base64");
    const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/mpesa/callback`;

    const env = process.env.MPESA_ENVIRONMENT || "sandbox";
    const url = env === "production"
      ? "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
      : "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

    const stkResponse = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(amount),
        PartyA: formatPhone(phone),
        PartyB: shortCode,
        PhoneNumber: formatPhone(phone),
        CallBackURL: callbackUrl,
        AccountReference: `NABBIS-${orderId.slice(0, 8)}`,
        TransactionDesc: "Nabbis Collections Payment",
      }),
    });

    const result = await stkResponse.json();

    const supabase = createServerClient();
    await supabase.from("mpesa_transactions").insert({
      order_id: orderId,
      request_id: result.MerchantRequestID,
      merchant_request_id: result.MerchantRequestID,
      checkout_request_id: result.CheckoutRequestID,
      response_code: result.ResponseCode,
      response_description: result.ResponseDescription,
      customer_message: result.CustomerMessage,
      amount,
      phone_number: formatPhone(phone),
      status: result.ResponseCode === "0" ? "pending" : "failed",
      raw_request: { orderId, amount, phone },
    });

    if (result.ResponseCode !== "0") {
      return NextResponse.json({ error: result.ResponseDescription || "M-Pesa request failed" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      merchantRequestId: result.MerchantRequestID,
      checkoutRequestId: result.CheckoutRequestID,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "M-Pesa error" },
      { status: 500 }
    );
  }
}
