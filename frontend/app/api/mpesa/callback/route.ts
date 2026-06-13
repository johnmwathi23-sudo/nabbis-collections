import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createServerClient();

    const stkCallback = body?.Body?.stkCallback;
    if (!stkCallback) {
      return NextResponse.json({ error: "Invalid callback" }, { status: 400 });
    }

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
    } = stkCallback;

    const callbackMetadata = stkCallback?.CallbackMetadata?.Item || [];
    const getItem = (name: string) =>
      callbackMetadata.find((i: { Name: string; Value?: unknown }) => i.Name === name)?.Value;

    const amount = getItem("Amount");
    const mpesaReceipt = getItem("MpesaReceiptNumber") as string | undefined;
    const phoneNumber = getItem("PhoneNumber") as string | undefined;
    const transactionDate = getItem("TransactionDate") as string | undefined;

    const status = ResultCode === 0 ? "completed" : "failed";
    const paymentStatus = ResultCode === 0 ? "paid" : "failed";

    await supabase
      .from("mpesa_transactions")
      .update({
        result_code: ResultCode,
        result_description: ResultDesc,
        mpesa_receipt_number: mpesaReceipt || null,
        transaction_date: transactionDate ? new Date(transactionDate).toISOString() : null,
        phone_number: phoneNumber ? String(phoneNumber) : null,
        amount: amount ? Number(amount) : null,
        status,
        raw_callback: body,
      })
      .eq("merchant_request_id", MerchantRequestID)
      .eq("checkout_request_id", CheckoutRequestID);

    if (ResultCode === 0 && mpesaReceipt) {
      const { data: txn } = await supabase
        .from("mpesa_transactions")
        .select("order_id")
        .eq("merchant_request_id", MerchantRequestID)
        .single();

      if (txn?.order_id) {
        await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            mpesa_receipt: mpesaReceipt,
            status: "processing",
          })
          .eq("id", txn.order_id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("M-Pesa callback error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
