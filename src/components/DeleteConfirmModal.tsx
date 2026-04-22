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
  onConfirm: () => Promise<void>
  client: Client | null
  isDeleting?: boolean
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  client,
  isDeleting = false,
}: DeleteConfirmModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[380px] w-[90%] rounded-3xl p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">Remover Cliente</AlertDialogTitle>
          <AlertDialogDescription className="text-base text-gray-500 mt-2">
            Tem certeza que deseja remover <strong>{client?.nome}</strong>? Esta ação não pode ser
            desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 flex flex-col gap-3 sm:flex-row sm:space-x-0">
          <AlertDialogCancel className="mt-0 sm:mt-0 h-12 rounded-xl flex-1" disabled={isDeleting}>
            Voltar
          </AlertDialogCancel>
          <ButtonAction onClick={onConfirm} isDeleting={isDeleting} />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function ButtonAction({ onClick, isDeleting }: { onClick: () => void; isDeleting: boolean }) {
  return (
    <AlertDialogAction
      onClick={(e) => {
        e.preventDefault()
        onClick()
      }}
      className="mt-0 sm:mt-0 h-12 rounded-xl flex-1 bg-red-500 hover:bg-red-600 text-white"
      disabled={isDeleting}
    >
      {isDeleting ? 'Removendo...' : 'Confirmar'}
    </AlertDialogAction>
  )
}
