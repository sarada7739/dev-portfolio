import { z } from "zod";

// クライアント・サーバー共通のお問い合わせフォーム検証スキーマ
export const contactSchema = z.object({
  name: z
    .string()
    .min(1, "お名前を入力してください")
    .max(100, "お名前は100文字以内で入力してください"),
  email: z.email("メールアドレスの形式が正しくありません"),
  message: z
    .string()
    .min(1, "本文を入力してください")
    .max(2000, "本文は2000文字以内で入力してください"),
  turnstileToken: z.string().min(1, "認証を完了してください"),
});

export type ContactInput = z.infer<typeof contactSchema>;
