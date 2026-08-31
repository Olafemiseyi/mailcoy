import { createFileRoute } from '@tanstack/react-router'
import { AboutPage } from '@/components/marketing/AboutPage'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: "About Us — Mailcoy" },
      { name: "description", content: "Learn about the mission and history of Mailcoy and LightOrb Innovations." },
    ],
  }),
  component: AboutPage,
})
