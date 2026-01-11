import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { SERVER_CATEGORIES } from '@/types'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/register')({
  component: ServerRegistration,
})

type Step = 'basic' | 'details' | 'tools' | 'review'

const steps: { id: Step; label: string }[] = [
  { id: 'basic', label: '기본 정보' },
  { id: 'details', label: '상세 설정' },
  { id: 'tools', label: '도구 정의' },
  { id: 'review', label: '검토 및 제출' },
]

function ServerRegistration() {
  const [currentStep, setCurrentStep] = useState<Step>('basic')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    endpoint: '',
    authMethod: 'none',
    license: '',
    githubUrl: '',
    docsUrl: '',
  })

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id)
    }
  }

  const handlePrev = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id)
    }
  }

  const handleSubmit = () => {
    console.log('Submitting:', formData)
    // Handle submission
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">MCP 서버 등록</h1>
          <p className="text-muted-foreground">
            새로운 MCP 서버를 등록하고 전 세계 개발자들과 공유하세요
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-12">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors',
                  index < currentStepIndex
                    ? 'bg-primary text-primary-foreground'
                    : index === currentStepIndex
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-input text-muted-foreground'
                )}
              >
                {index < currentStepIndex ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  'ml-2 text-sm font-medium hidden sm:block',
                  index <= currentStepIndex
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-12 sm:w-24 h-0.5 mx-4',
                    index < currentStepIndex ? 'bg-primary' : 'bg-border'
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <Card>
          {currentStep === 'basic' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">기본 정보</h2>
              <div>
                <label className="block text-sm font-medium mb-2">
                  서버 이름 *
                </label>
                <Input
                  placeholder="예: My Awesome MCP Server"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">설명 *</label>
                <Textarea
                  placeholder="서버가 어떤 기능을 제공하는지 설명해주세요..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  카테고리 *
                </label>
                <Select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value="">카테고리 선택...</option>
                  {SERVER_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          )}

          {currentStep === 'details' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">상세 설정</h2>
              <div>
                <label className="block text-sm font-medium mb-2">
                  엔드포인트 URL *
                </label>
                <Input
                  placeholder="https://api.example.com/mcp"
                  value={formData.endpoint}
                  onChange={(e) =>
                    setFormData({ ...formData, endpoint: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  인증 방식 *
                </label>
                <Select
                  value={formData.authMethod}
                  onChange={(e) =>
                    setFormData({ ...formData, authMethod: e.target.value })
                  }
                >
                  <option value="none">인증 없음</option>
                  <option value="apikey">API Key</option>
                  <option value="oauth">OAuth</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">라이선스</label>
                <Input
                  placeholder="예: MIT, Apache 2.0"
                  value={formData.license}
                  onChange={(e) =>
                    setFormData({ ...formData, license: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  GitHub URL
                </label>
                <Input
                  placeholder="https://github.com/..."
                  value={formData.githubUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, githubUrl: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {currentStep === 'tools' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">도구 정의</h2>
              <p className="text-muted-foreground">
                서버가 제공하는 도구들을 정의해주세요. 자동으로 엔드포인트에서
                가져올 수도 있습니다.
              </p>
              <div className="p-8 border-2 border-dashed border-border rounded-lg text-center">
                <p className="text-muted-foreground mb-4">
                  엔드포인트에서 도구 정보를 자동으로 가져옵니다
                </p>
                <Button variant="secondary">도구 정보 가져오기</Button>
              </div>
            </div>
          )}

          {currentStep === 'review' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">검토 및 제출</h2>
              <div className="space-y-4">
                <div className="p-4 bg-input rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">
                    서버 이름
                  </div>
                  <div className="font-medium">
                    {formData.name || '(입력되지 않음)'}
                  </div>
                </div>
                <div className="p-4 bg-input rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">설명</div>
                  <div>{formData.description || '(입력되지 않음)'}</div>
                </div>
                <div className="p-4 bg-input rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">
                    카테고리
                  </div>
                  <div>{formData.category || '(선택되지 않음)'}</div>
                </div>
                <div className="p-4 bg-input rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">
                    엔드포인트
                  </div>
                  <div className="font-mono text-sm">
                    {formData.endpoint || '(입력되지 않음)'}
                  </div>
                </div>
              </div>
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-sm">
                  제출 후 관리자 검토를 거쳐 승인됩니다. 검토에는 보통 1-2일이
                  소요됩니다.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="secondary"
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              이전
            </Button>
            {currentStep === 'review' ? (
              <Button onClick={handleSubmit}>
                서버 등록하기
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleNext}>
                다음
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
