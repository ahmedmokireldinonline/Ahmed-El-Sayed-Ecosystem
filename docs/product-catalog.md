# Product catalog

The products section is built from the supplied Drive visuals. Each product card uses one image, one factual description, a price or transparent pricing model, and two actions: order the product or ask for details. Both actions open the existing lead form with the selected product prefilled, so the request is stored with `product` in the raw submission payload.

The only numeric price currently shown is **$249 USD** for the WPFunnels lifetime license because that amount is visible in the supplied product artwork. Other products use transparent request-based labels such as `حسب الباقة`, `حسب النطاق`, or `اطلب عرض سعر` because no verified numeric price was supplied in the source material. These should be replaced with confirmed prices before running paid checkout.

The current flow is an order-request flow, not an automatic payment flow. It does not claim that a purchase has been completed. A real payment button can be added after the preferred payment provider, currency, refund terms, and fulfillment process are confirmed.
