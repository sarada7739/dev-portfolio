import { z } from "zod";

// クライアント・サーバー共通のお問い合わせフォーム検証スキーマ
export const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.email(),
  message: z.string().min(1).max(2000),
  turnstileToken: z.string().min(1),
});

export type ContactInput = z.infer<typeof contactSchema>;
