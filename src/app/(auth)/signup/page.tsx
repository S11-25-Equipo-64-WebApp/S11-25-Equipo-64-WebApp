import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (
    <section className="flex w-full flex-col gap-8 rounded-[2rem] border border-border bg-background/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
      <header className="flex flex-col gap-2 text-center">
        <p className="text-xs uppercase tracking-[0.6em] text-muted-foreground">
          Testimonial CMS
        </p>
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
          Crea tu prueba gratuita
        </h1>
        <p className="text-sm text-muted-foreground">
          Únete a tu equipo para recopilar, moderar y publicar testimonios de forma segura.
        </p>
      </header>
      <SignupForm />
    </section>
  )
}
