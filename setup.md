# Setup

pnpm create next-app@latest venora --typescript --tailwind --app
cd venora
pnpm dlx shadcn@latest init # choose: new-york preset, neutral base color
pnpm dlx shadcn@latest add button card input textarea select calendar dialog sheet badge table tabs form sonner skeleton
pnpm add convex @convex-dev/auth zustand react-hook-form @hookform/resolvers zod date-fns nanoid geist
pnpm add resend react-email @react-email/components
pnpm add -D vitest @vitest/ui @playwright/test

# Convex

pnpm dlx convex dev

# Set Resend key in Convex env (not Vercel — emails send from Convex actions)

pnpm dlx convex env set RESEND_API_KEY re_xxx
pnpm dlx convex env set RESEND_FROM_EMAIL onboarding@resend.dev
pnpm dlx convex env set ADMIN_NOTIFICATION_EMAIL admin@demo.com

# Seed

pnpm dlx convex run seed:default

# Dev

pnpm dev
