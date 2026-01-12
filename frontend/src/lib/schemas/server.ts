import { z } from 'zod'
import { SERVER_CATEGORIES } from '@/types'

export const serverBasicSchema = z.object({
  name: z
    .string()
    .min(1, '서버 이름을 입력해주세요')
    .min(2, '서버 이름은 2자 이상이어야 합니다')
    .max(50, '서버 이름은 50자 이하여야 합니다'),
  description: z
    .string()
    .min(1, '설명을 입력해주세요')
    .min(10, '설명은 10자 이상이어야 합니다')
    .max(500, '설명은 500자 이하여야 합니다'),
  category: z
    .string()
    .min(1, '카테고리를 선택해주세요')
    .refine((val) => SERVER_CATEGORIES.includes(val as typeof SERVER_CATEGORIES[number]), {
      message: '유효한 카테고리를 선택해주세요',
    }),
})

export const serverDetailsSchema = z.object({
  endpoint: z
    .string()
    .min(1, '엔드포인트 URL을 입력해주세요')
    .url('올바른 URL 형식이 아닙니다'),
  authMethod: z.enum(['none', 'apikey', 'oauth']),
  license: z.string().optional(),
  githubUrl: z
    .string()
    .url('올바른 URL 형식이 아닙니다')
    .optional()
    .or(z.literal('')),
  docsUrl: z
    .string()
    .url('올바른 URL 형식이 아닙니다')
    .optional()
    .or(z.literal('')),
})

export const serverToolSchema = z.object({
  name: z.string().min(1, '도구 이름을 입력해주세요'),
  description: z.string().min(1, '도구 설명을 입력해주세요'),
  parameters: z.string().optional(),
})

export const serverRegistrationSchema = serverBasicSchema.merge(serverDetailsSchema)

export type ServerBasicInput = z.infer<typeof serverBasicSchema>
export type ServerDetailsInput = z.infer<typeof serverDetailsSchema>
export type ServerToolInput = z.infer<typeof serverToolSchema>
export type ServerRegistrationInput = z.infer<typeof serverRegistrationSchema>
