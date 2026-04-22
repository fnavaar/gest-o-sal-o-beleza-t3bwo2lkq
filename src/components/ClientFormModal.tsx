import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useEffect } from 'react'
import { formatPhone } from '@/lib/utils'
import { Client } from '@/types'

const formSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  phone: z.string().min(14, 'Telefone incompleto'),
  isPreference: z.boolean().default(false),
})

interface ClientFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (client: Omit<Client, 'id'>) => void
  client?: Client | null
}

export function ClientFormModal({ isOpen, onClose, onSave, client }: ClientFormModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', phone: '', isPreference: false },
  })

  useEffect(() => {
    if (isOpen) {
      if (client) {
        form.reset({ name: client.name, phone: client.phone, isPreference: client.isPreference })
      } else {
        form.reset({ name: '', phone: '', isPreference: false })
      }
    }
  }, [isOpen, client, form])

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    form.setValue('phone', formatted, { shouldValidate: true })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] w-[95%] rounded-3xl p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold">
            {client ? 'Editar Cliente' : 'Nova Cliente'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-gray-500">
                    Nome da Cliente
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Mariana Silva" className="h-12 rounded-xl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-gray-500">
                    Telefone
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(00) 00000-0000"
                      className="h-12 rounded-xl"
                      {...field}
                      onChange={handlePhoneChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPreference"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-semibold text-gray-800">
                      É preferência?
                    </FormLabel>
                    <div className="text-xs text-gray-500">Destacar na lista de clientes</div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-12 rounded-xl flex-1 sm:flex-none"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="h-12 rounded-xl flex-1 sm:flex-none bg-primary text-white hover:bg-primary/90"
                disabled={!form.formState.isValid}
              >
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
