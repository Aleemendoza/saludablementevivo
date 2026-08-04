import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { getServerEnv } from "@/lib/env";

export function createPreferencesClient() {
  const { MERCADOPAGO_ACCESS_TOKEN } = getServerEnv();
  const client = new MercadoPagoConfig({ accessToken: MERCADOPAGO_ACCESS_TOKEN });

  return new Preference(client);
}

export function createPaymentsClient() {
  const { MERCADOPAGO_ACCESS_TOKEN } = getServerEnv();
  return new Payment(new MercadoPagoConfig({ accessToken: MERCADOPAGO_ACCESS_TOKEN }));
}
