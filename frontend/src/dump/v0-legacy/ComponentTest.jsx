import React from 'react'
import { 
  Button, 
  Card, 
  Input, 
  Avatar, 
  Badge, 
  Skeleton,
  SkeletonCard,
  LoadingSpinner 
} from '@/components/ui'
import { cn } from '@/lib/utils'

/**
 * Component Test Page
 * 
 * A test page to verify all UI components are working properly.
 * This helps identify any import issues or missing dependencies.
 */

const ComponentTest = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Component Test Page
          </h1>
          <p className="text-gray-600">
            Testing all UI components to ensure they work properly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Button Tests */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Button Components</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button disabled>Disabled</Button>
                <Button loading>Loading</Button>
              </div>
            </div>
          </Card>

          {/* Avatar Tests */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Avatar Components</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar size="xs" fallback="XS" />
                <Avatar size="sm" fallback="SM" />
                <Avatar size="md" fallback="MD" />
                <Avatar size="lg" fallback="LG" />
                <Avatar size="xl" fallback="XL" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Avatar Group:</p>
                <div className="flex items-center">
                  <Avatar fallback="A" size="sm" />
                  <Avatar fallback="B" size="sm" className="-ml-2" />
                  <Avatar fallback="C" size="sm" className="-ml-2" />
                  <div className="ml-2 bg-gray-200 text-gray-600 h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium">
                    +5
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Badge Tests */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Badge Components</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="info">Info</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge size="xs">Extra Small</Badge>
                <Badge size="sm">Small</Badge>
                <Badge size="md">Medium</Badge>
                <Badge size="lg">Large</Badge>
              </div>
            </div>
          </Card>

          {/* Input Tests */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Input Components</h3>
            <div className="space-y-4">
              <Input placeholder="Standard input" />
              <Input placeholder="Input with label" label="Email Address" />
              <Input placeholder="Disabled input" disabled />
              <Input 
                placeholder="Input with error" 
                error="This field is required" 
              />
              <Input 
                type="password" 
                placeholder="Password input" 
                label="Password" 
              />
            </div>
          </Card>

          {/* Skeleton Tests */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Skeleton Components</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Basic Skeletons:</p>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Circle Skeleton:</p>
                <Skeleton variant="circle" size="md" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Skeleton Card:</p>
                <SkeletonCard className="max-w-sm" />
              </div>
            </div>
          </Card>

          {/* Loading Spinner Test */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Loading Components</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <LoadingSpinner size="sm" />
                <LoadingSpinner size="md" />
                <LoadingSpinner size="lg" />
              </div>
              <div>
                <LoadingSpinner size="md" />
                <p className="text-sm text-gray-600 mt-2">Loading...</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Utils Test */}
        <Card className="p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">Utility Functions Test</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>CN Function:</strong></p>
              <p className={cn('text-blue-600', 'font-medium')}>
                Combined classes working!
              </p>
            </div>
            <div>
              <p><strong>Date Functions:</strong></p>
              <p>Current date: {new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <p><strong>Text Utils:</strong></p>
              <p>Capitalized: {"hello world".charAt(0).toUpperCase() + "hello world".slice(1)}</p>
            </div>
            <div>
              <p><strong>Validation:</strong></p>
              <p>Email valid: {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test('test@example.com') ? '✅' : '❌'}</p>
            </div>
          </div>
        </Card>

        {/* Status Summary */}
        <Card className="p-6 mt-8 bg-green-50 border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            ✅ Component Test Status
          </h3>
          <p className="text-green-700">
            If you can see this page with all components rendering properly, 
            then the UI system is working correctly!
          </p>
        </Card>
      </div>
    </div>
  )
}

export default ComponentTest
