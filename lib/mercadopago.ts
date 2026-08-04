import { MercadoPagoConfig, Preference } from "mercadopago";
import { env } from "@/lib/env";

const client = new MercadoPagoConfig({ accessToken: env.MERCADOPAGO_ACCESS_TOKEN });
export const preferences = new Preference(client);
