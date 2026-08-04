import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { getMercadoPagoEnv } from "@/lib/env";

export function createPreferencesClient() {
  const { MERCADOPAGO_ACCESS_TOKEN } = getMercadoPagoEnv();
  const client = new MercadoPagoConfig({ accessToken: MERCADOPAGO_ACCESS_TOKEN });

  return new Preference(client);
}

export function createPaymentsClient() {
  const { MERCADOPAGO_ACCESS_TOKEN } = getMercadoPagoEnv();
  return new Payment(new MercadoPagoConfig({ accessToken: MERCADOPAGO_ACCESS_TOKEN }));
}
