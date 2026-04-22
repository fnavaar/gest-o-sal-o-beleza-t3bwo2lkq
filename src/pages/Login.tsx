import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Sparkles } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { extractFieldErrors } from '@/lib/pocketbase/errors'

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'A senha é obrigatória'),
})

const signupSchema = z
  .object({
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'As senhas não coincidem',
    path: ['passwordConfirm'],
  })

export default function Login() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isSigningUp, setIsSigningUp] = useState(false)

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '', passwordConfirm: '' },
  })

  const onLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoggingIn(true)
    const { error } = await signIn(values.email, values.password)
    setIsLoggingIn(false)
    if (error) {
      toast.error('Email ou senha incorretos')
    } else {
      navigate('/', { replace: true })
    }
  }

  const onSignup = async (values: z.infer<typeof signupSchema>) => {
    setIsSigningUp(true)
    const { error } = await signUp(values.email, values.password)
    setIsSigningUp(false)

    if (error) {
      const fieldErrors = extractFieldErrors(error)
      if (Object.keys(fieldErrors).length > 0) {
        Object.entries(fieldErrors).forEach(([field, msg]) => {
          if (field === 'email' || field === 'password') {
            signupForm.setError(field as any, { message: msg })
          } else {
            toast.error(msg)
          }
        })
      } else {
        toast.error('Erro ao criar conta. Tente novamente.')
      }
    } else {
      toast.success('Conta criada com sucesso!')
      setIsSignupOpen(false)
      navigate('/', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Gestão Salão</h1>
          <p className="text-gray-500 mt-2">Acesse para gerenciar suas clientes</p>
        </div>

        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-5">
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-gray-500">
                    E-mail
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="seu@email.com"
                      type="email"
                      className="h-12 rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-gray-500">Senha</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="••••••••"
                      type="password"
                      className="h-12 rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </Form>

        <div className="mt-8 text-center">
          <span className="text-gray-500 text-sm">Ainda não tem uma conta? </span>
          <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
            <DialogTrigger asChild>
              <button
                className="text-primary font-bold text-sm hover:underline"
                onClick={() => signupForm.reset()}
              >
                Criar conta
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] w-[95%] rounded-3xl p-6">
              <DialogHeader className="mb-4">
                <DialogTitle className="text-2xl font-bold">Nova Conta</DialogTitle>
              </DialogHeader>
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-5">
                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase text-xs font-bold text-gray-500">
                          E-mail
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="seu@email.com"
                            type="email"
                            className="h-12 rounded-xl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase text-xs font-bold text-gray-500">
                          Senha
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Mínimo 6 caracteres"
                            type="password"
                            className="h-12 rounded-xl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="passwordConfirm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase text-xs font-bold text-gray-500">
                          Confirmar Senha
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite a senha novamente"
                            type="password"
                            className="h-12 rounded-xl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsSignupOpen(false)}
                      className="h-12 rounded-xl flex-1 sm:flex-none"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="h-12 rounded-xl flex-1 sm:flex-none bg-primary text-white hover:bg-primary/90"
                      disabled={isSigningUp}
                    >
                      {isSigningUp ? 'Criando...' : 'Criar conta'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
