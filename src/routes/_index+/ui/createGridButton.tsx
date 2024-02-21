import { FileIcon, PlusIcon } from "@radix-ui/react-icons"
import { ValidatedForm } from "remix-validated-form"
import { formSchema } from "~/routes/_index+/_index.tsx"
import { ButtonWithIcon } from "~/ui/buttonWithIcon.tsx"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/ui/primitives/dialog.tsx"
import { ValidatedButton } from "~/ui/validated/validatedButton.tsx"
import { ValidatedInput } from "~/ui/validated/validatedInput.tsx"

export function CreateGridButton() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <ButtonWithIcon
                    variant="outline"
                    className="bg-card [&>span]:hidden md:[&>span]:block"
                    icon={PlusIcon}
                >
                    create grid
                </ButtonWithIcon>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>create a grid</DialogTitle>
                    <DialogDescription>
                        please provide a unique name and a summary.
                    </DialogDescription>
                </DialogHeader>
                <ValidatedForm
                    validator={formSchema}
                    method="POST"
                    autoComplete="off"
                    className="h-full"
                >
                    <div className="flex flex-col gap-2">
                        <ValidatedInput id="name" label="name" noAutocomplete />
                        <ValidatedInput
                            id="summary"
                            label="summary"
                            noAutocomplete
                        />
                    </div>
                    <DialogFooter>
                        <ValidatedButton
                            type="submit"
                            variant="outline"
                            icon={FileIcon}
                            className="mt-4 w-1/3"
                        >
                            create grid
                        </ValidatedButton>
                    </DialogFooter>
                </ValidatedForm>
            </DialogContent>
        </Dialog>
    )
}
