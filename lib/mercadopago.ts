import { MercadoPagoConfig, Preference } from "mercadopago";
import { getServerEnv } from "@/lib/env";

export function createPreferencesClient() {
  const { MERCADOPAGO_ACCESS_TOKEN } = getServerEnv();
  const client = new MercadoPagoConfig({ accessToken: MERCADOPAGO_ACCESS_TOKEN });

  return new Preference(client);
}
