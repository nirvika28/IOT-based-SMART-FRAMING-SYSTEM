import { FirebaseTest } from "@/components/debug/firebase-test"

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Firebase Debug Page</h1>
        <FirebaseTest />
      </div>
    </div>
  )
}
