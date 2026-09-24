import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Formato de e-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string().min(6, "Confirmação de senha é obrigatória"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(1, "Informe a sua senha"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Informe um e-mail válido"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(10, "Token inválido"),
  password: z.string().min(6, "A nova senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string().min(6, "Confirmação de senha obrigatória"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export const verifyEmailSchema = z.object({
  token: z.string().min(10, "Token inválido"),
});

export const productSchema = z.object({
  gameId: z.string().min(1, "Jogo obrigatório"),
  name: z.string().min(3, "Nome do produto é obrigatório"),
  slug: z.string().min(3, "Slug é obrigatório"),
  edition: z.string().default("Standard Edition"),
  description: z.string().min(10, "Descrição detalhada é obrigatória"),
  price: z.coerce.number().positive("O preço deve ser maior que zero"),
  originalPrice: z.coerce.number().positive().optional().nullable(),
  platform: z.string().default("Steam"),
  active: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  image: z.string().url().optional().nullable().or(z.literal("")),
});

export const gameSchema = z.object({
  name: z.string().min(2, "Nome do jogo é obrigatório"),
  slug: z.string().min(2, "Slug do jogo é obrigatório"),
  theme: z.enum(["persona3", "persona4", "persona5"]),
  description: z.string().min(10, "Descrição é obrigatória"),
  story: z.string().min(20, "História é obrigatória"),
  genre: z.string().default("JRPG"),
  developer: z.string().default("ATLUS"),
  releaseDate: z.string().min(4, "Data de lançamento obrigatória"),
  image: z.string().min(1, "Imagem principal é obrigatória"),
  bannerImage: z.string().optional().nullable(),
});

export const characterSchema = z.object({
  gameId: z.string().min(1, "ID do jogo é obrigatório"),
  name: z.string().min(2, "Nome do personagem é obrigatório"),
  roleTag: z.string().default("Protagonist"),
  personaName: z.string().optional().nullable(),
  arcana: z.string().optional().nullable(),
  description: z.string().min(10, "Descrição é obrigatória"),
  image: z.string().min(1, "Imagem do personagem é obrigatória"),
});

export const digitalKeyBatchSchema = z.object({
  productId: z.string().min(1, "ID do produto é obrigatório"),
  keys: z.array(z.string().min(5, "Chave inválida")).min(1, "Informe ao menos uma chave"),
});

export const cartItemSchema = z.object({
  productId: z.string().min(1, "ID do produto obrigatório"),
  quantity: z.number().int().min(1, "Quantidade mínima é 1").default(1),
});

export const checkoutSchema = z.object({
  paymentMethod: z.enum(["PIX", "CREDIT_CARD", "MOCK"]).default("PIX"),
  cardNumber: z.string().optional(),
  cardHolder: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
  customerNotes: z.string().optional(),
});

export const externalOfferSchema = z.object({
  storeId: z.string().min(1, "Loja obrigatória"),
  gameId: z.string().min(1, "Jogo obrigatório"),
  productId: z.string().optional().nullable(),
  price: z.coerce.number().positive("Preço deve ser positivo"),
  originalPrice: z.coerce.number().positive().optional().nullable(),
  url: z.string().url("URL da oferta inválida"),
  platform: z.string().default("Steam"),
  active: z.boolean().default(true),
});

export const externalStoreSchema = z.object({
  name: z.string().min(2, "Nome da loja é obrigatório"),
  website: z.string().url("Website da loja inválido"),
  logoUrl: z.string().url().optional().nullable().or(z.literal("")),
  reliabilityStatus: z.string().default("VERIFIED"),
  active: z.boolean().default(true),
});
