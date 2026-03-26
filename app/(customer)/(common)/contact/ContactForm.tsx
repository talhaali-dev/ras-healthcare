'use client'

import { useActionState, useState } from 'react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { sendEmail } from '@/actions/mail.actions'

interface ContactFormState {
    success: boolean;
    message: string;
}

export default function ContactForm() {
    const [state, formAction] = useActionState<ContactFormState, FormData>(sendEmail, { success: false, message: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true)
        await formAction(formData)
        setIsSubmitting(false)
    }

    return (
        <form action={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-xl space-y-6">
            <h2 className="text-2xl font-bold text-teal-600 text-center mb-6">Get in Touch</h2>
            <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 text-sm font-medium">Name</Label>
                <Input
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-2 border-gray-300 rounded-md transition duration-200 hover:border-teal-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    placeholder="Your name"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 text-sm font-medium">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-2 border-gray-300 rounded-md transition duration-200 hover:border-teal-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    placeholder="your.email@example.com"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="message" className="text-gray-700 text-sm font-medium">Message</Label>
                <Textarea
                    id="message"
                    name="message"
                    required
                    className="w-full px-4 py-2 min-h-[120px] border-gray-300 rounded-md transition duration-200 hover:border-teal-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    placeholder="Write your message here..."
                />
            </div>
            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-md transition duration-200"
            >
                {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                    </span>
                ) : 'Send Message'}
            </Button>
            {state.message && (
                <p className={`text-center text-sm font-medium ${state.success ? 'text-green-500' : 'text-red-500'} animate-fade-in`}>
                    {state.message}
                </p>
            )}
        </form>
    )
}
