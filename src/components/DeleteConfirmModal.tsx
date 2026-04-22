import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Client } from '@/types'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  client: Client | null
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  client,
}: DeleteConfirmModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[380px] w-[90%] rounded-3xl p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">Remover Cliente</AlertDialogTitle>
          <AlertDialogDescription className="text-base text-gray-500 mt-2">
            Tem certeza que deseja remover <strong>{client?.name}</strong>? Esta ação não pode ser
            desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 flex flex-col gap-3 sm:flex-row sm:space-x-0">
          <AlertDialogCancel className="mt-0 sm:mt-0 h-12 rounded-xl flex-1">
            Voltar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="mt-0 sm:mt-0 h-12 rounded-xl flex-1 bg-red-500 hover:bg-red-600 text-white"
          >
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
