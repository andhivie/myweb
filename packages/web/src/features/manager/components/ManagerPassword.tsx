import { EVENTS } from "@andhivie/common/constants"
import Button from "@andhivie/web/components/ui/Button"
import Card from "@andhivie/web/components/ui/Card"
import Input from "@andhivie/web/components/ui/Input"
import { useEvent } from "@andhivie/web/features/session/contexts/socket-context"
import { type KeyboardEvent, useState } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

interface Props {
  onSubmit: (_password: string) => void
}

const ManagerPassword = ({ onSubmit }: Props) => {
  const [password, setPassword] = useState("")
  const { t } = useTranslation()

  const handleSubmit = () => {
    onSubmit(password)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSubmit()
    }
  }

  useEvent(EVENTS.MANAGER.ERROR_MESSAGE, (message) => {
    toast.error(t(message))
  })

  return (
    <Card>
      <Input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t("manager:passwordPlaceholder")}
      />
      <Button className="mt-4" onClick={handleSubmit}>
        {t("common:submit")}
      </Button>
    </Card>
  )
}

export default ManagerPassword
