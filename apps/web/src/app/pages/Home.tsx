import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CheckCircle,
  BarChart3,
  UtensilsCrossed,
  ChefHat,
  Package,
  Users,
  Brain,
  ArrowRight,
  Clock,
  TrendingUp,
  DollarSign,
} from 'lucide-react'

import { Button, Badge, Card } from '../../components/ui'
import { BrandLogo, BrandMark } from '../../components/brand/BrandLogo'
import { GradientBG } from '../../components/primitives/GradientBG'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const Home: React.FC = () => {
  return (
    <div className="bg-bg-soft min-h-screen">
      {/* Hero Section */}
      <GradientBG className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <motion.div
            className="mx-auto max-w-4xl text-center"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            <motion.div className="mb-6" variants={fadeInUp}>
              <Badge variant="outline" className="mb-8">
                Built for modern hospitality
              </Badge>
            </motion.div>

            <motion.h1
              className="font-display text-ink mb-6 text-5xl font-bold tracking-tight lg:text-7xl"
              variants={fadeInUp}
            >
              Operate smarter with <span className="text-brand">ObservAI</span>
            </motion.h1>

            <motion.p
              className="text-ink/70 mx-auto mb-8 max-w-2xl text-xl leading-relaxed"
              variants={fadeInUp}
            >
              Unify POS, menu, kitchen, inventory and AI insights in one place.
            </motion.p>

            <motion.div
              className="mb-16 flex flex-col justify-center gap-4 sm:flex-row"
              variants={fadeInUp}
            >
              <Button size="lg" variant="accent" className="px-8 py-4 text-lg">
                Request a demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="px-8 py-4 text-lg"
                asChild
              >
                <Link to="/login">Sign in</Link>
              </Button>
            </motion.div>

            {/* App Mock */}
            <motion.div
              className="relative mx-auto max-w-5xl"
              variants={fadeInUp}
            >
              <div className="border-border rounded-3xl border bg-white p-8 shadow-2xl">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {/* Dashboard mockup cards */}
                  <Card className="p-4">
                    <div className="mb-4 flex items-center gap-3">
                      <BarChart3 className="text-brand h-5 w-5" />
                      <span className="text-ink font-semibold">Analytics</span>
                    </div>
                    <div className="from-brand/20 to-accent/20 h-20 rounded-xl bg-gradient-to-br"></div>
                  </Card>

                  <Card className="p-4">
                    <div className="mb-4 flex items-center gap-3">
                      <UtensilsCrossed className="text-brand h-5 w-5" />
                      <span className="text-ink font-semibold">Orders</span>
                    </div>
                    <div className="from-accent/20 to-brand/20 h-20 rounded-xl bg-gradient-to-br"></div>
                  </Card>

                  <Card className="p-4">
                    <div className="mb-4 flex items-center gap-3">
                      <Brain className="text-brand h-5 w-5" />
                      <span className="text-ink font-semibold">
                        AI Insights
                      </span>
                    </div>
                    <div className="from-brand/20 to-accent/20 h-20 rounded-xl bg-gradient-to-br"></div>
                  </Card>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </GradientBG>

      {/* Logo Strip */}
      <section className="border-border border-y bg-white py-16">
        <div className="container mx-auto px-4">
          <p className="text-ink/60 mb-8 text-center font-medium">
            Trusted by restaurants worldwide
          </p>
          <div className="flex items-center justify-center gap-12 opacity-40">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-ink/10 flex h-12 w-24 items-center justify-center rounded-lg"
              >
                <span className="text-ink/40 font-semibold">Logo {i}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Stats */}
      <section className="bg-bg-soft py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp}>
              <Card className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-display text-ink mb-2 text-2xl font-bold">
                  30%
                </h3>
                <p className="text-ink/70">Reduce ops cost</p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-display text-ink mb-2 text-2xl font-bold">
                  25%
                </h3>
                <p className="text-ink/70">Increase AOV</p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100">
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-display text-ink mb-2 text-2xl font-bold">
                  Real-time
                </h3>
                <p className="text-ink/70">See peak hours</p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="font-display text-ink mb-4 text-4xl font-bold">
              Everything you need to run your restaurant
            </h2>
            <p className="text-ink/70 mx-auto max-w-2xl text-xl">
              From orders to insights, manage every aspect of your business with
              one platform
            </p>
          </div>

          <motion.div
            className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: BarChart3,
                title: 'Smart POS',
                description: 'Lightning-fast checkout with built-in analytics',
              },
              {
                icon: UtensilsCrossed,
                title: 'Dynamic Menu',
                description: 'Real-time menu updates and pricing optimization',
              },
              {
                icon: ChefHat,
                title: 'Kitchen Display',
                description: 'Streamlined order management for your kitchen',
              },
              {
                icon: Package,
                title: 'Inventory Alerts',
                description: 'Never run out with smart inventory tracking',
              },
              {
                icon: Users,
                title: 'Staff & Tips',
                description:
                  'Team management and tip distribution (coming soon)',
                badge: 'Soon',
              },
              {
                icon: Brain,
                title: 'AI Insights',
                description: 'Predictive analytics and business intelligence',
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full p-6 transition-shadow hover:shadow-lg">
                  <div className="bg-brand/10 mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                    <feature.icon className="text-brand h-6 w-6" />
                  </div>
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="font-display text-ink text-lg font-semibold">
                      {feature.title}
                    </h3>
                    {feature.badge && (
                      <Badge variant="outline" size="sm">
                        {feature.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-ink/70">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Integrations */}
      <section className="bg-bg-soft py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="font-display text-ink mb-4 text-3xl font-bold">
              Connects with your favorite tools
            </h2>
          </div>

          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-4">
            {['Yemeksepeti', 'Getir', 'Trendyol', 'Open API'].map(
              (integration, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="px-4 py-2 text-sm"
                >
                  {integration}
                </Badge>
              )
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-border border-t bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <BrandLogo size="md" />

            <div className="mt-8 flex items-center gap-8 md:mt-0">
              <Link
                to="/docs"
                className="text-ink/70 hover:text-ink transition-colors"
              >
                Docs
              </Link>
              <Link
                to="/changelog"
                className="text-ink/70 hover:text-ink transition-colors"
              >
                Changelog
              </Link>
              <Link
                to="/contact"
                className="text-ink/70 hover:text-ink transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="border-border text-ink/60 mt-8 border-t pt-8 text-center">
            <p>&copy; 2024 ObservAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
