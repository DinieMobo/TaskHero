import React from "react";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Button from "./Button";

const ViewNotification = ({ open, setOpen, el }) => {
  // Early return if notification is null/undefined
  if (!open) return null;

  // Get safe values with fallbacks
  const title = el?.task?.title || "Notification";
  const text = el?.text || "No details available";

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <div className='py-4 w-full flex flex-col gap-4 items-center justify-center'>
        <Dialog.Title as='h3' className='font-semibold text-lg'>
          {title}
        </Dialog.Title>

        <p className='text-start text-gray-500'>{text}</p>

        <Button
          type='button'
          className='bg-white px-8 mt-3 text-sm font-semibold text-gray-900 sm:w-auto border border-gray-300 hover:bg-gray-50'
          onClick={() => setOpen(false)}
          label='Ok'
        />
      </div>
    </ModalWrapper>
  );
};

export default ViewNotification;
