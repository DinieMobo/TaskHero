import { Dialog } from "@headlessui/react";
import clsx from "clsx";
import { FaQuestion } from "react-icons/fa";
import { Button, ModalWrapper } from "./";

export default function ConfirmatioDialog({
  open,
  setOpen,
  msg,
  onClick = () => {},
  type = "delete",
  setMsg = () => {},
  setType = () => {},
}) {
  const closeDialog = () => {
    setType("delete");
    setMsg(null);
    setOpen(false);
  };

  // Determine the appropriate message if none is provided
  const dialogMessage =
    msg ??
    (type === "duplicate"
      ? "Are you sure you want to duplicate this task?"
      : type === "restore" || type === "restoreAll"
      ? "Are you sure you want to restore this item?"
      : "Are you sure you want to delete the selected record?");

  // Determine the appropriate action button label
  const actionLabel =
    type === "duplicate"
      ? "Duplicate"
      : type === "restore" || type === "restoreAll"
      ? "Restore"
      : "Delete";

  // Determine the appropriate button color
  const buttonColorClass =
    type === "duplicate"
      ? "bg-blue-600 hover:bg-blue-500"
      : type === "restore" || type === "restoreAll"
      ? "bg-yellow-600 hover:bg-yellow-500"
      : "bg-red-600 hover:bg-red-500";

  // Determine the appropriate icon color
  const iconColorClass =
    type === "duplicate"
      ? "text-blue-600 bg-blue-100"
      : type === "restore" || type === "restoreAll"
      ? "text-yellow-600 bg-yellow-100"
      : "text-red-600 bg-red-200";

  return (
    <>
      <ModalWrapper open={open} setOpen={closeDialog}>
        <div className="py-4 w-full flex flex-col gap-4 items-center justify-center">
          <Dialog.Title as="h3" className="">
            <p className={clsx("p-3 rounded-full", iconColorClass)}>
              <FaQuestion size={60} />
            </p>
          </Dialog.Title>

          <p className="text-center text-gray-500">{dialogMessage}</p>

          <div className="bg-gray-50 py-3 sm:flex sm:flex-row-reverse gap-4">
            <Button
              type="button"
              className={clsx(
                "px-8 text-sm font-semibold text-white sm:w-auto",
                buttonColorClass
              )}
              onClick={onClick}
              label={actionLabel}
            />

            <Button
              type="button"
              className="bg-white px-8 text-sm font-semibold text-gray-900 sm:w-auto border"
              onClick={() => closeDialog()}
              label="Cancel"
            />
          </div>
        </div>
      </ModalWrapper>
    </>
  );
}

export function UserAction({ open, setOpen, onClick = () => {} }) {
  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={closeDialog}>
        <div className="py-4 w-full flex flex-col gap-4 items-center justify-center">
          <Dialog.Title as="h3" className="">
            <p className={clsx("p-3 rounded-full ", "text-red-600 bg-red-200")}>
              <FaQuestion size={60} />
            </p>
          </Dialog.Title>

          <p className="text-center text-gray-500">
            {"Are you sure you want to activate or deactive this account?"}
          </p>

          <div className="bg-gray-50 py-3 sm:flex sm:flex-row-reverse gap-4">
            <Button
              type="button"
              className={clsx(
                " px-8 text-sm font-semibold text-white sm:w-auto",
                "bg-red-600 hover:bg-red-500"
              )}
              onClick={onClick}
              label={"Yes"}
            />

            <Button
              type="button"
              className="bg-white px-8 text-sm font-semibold text-gray-900 sm:w-auto border"
              onClick={() => closeDialog()}
              label="No"
            />
          </div>
        </div>
      </ModalWrapper>
    </>
  );
}
