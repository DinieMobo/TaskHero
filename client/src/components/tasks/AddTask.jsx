import React, { useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import SelectList from "../SelectList";
import { BiImages } from "react-icons/bi";
import Button from "../Button";
import {
  useCreateTaskMutation
} from "../../redux/slices/api/taskApiSlice";
import { toast } from "sonner";
import { uploadFile } from "../../utils/cloudinary";
import UserList from "./UserList";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORITY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const AddTask = ({ open, setOpen, task, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: task?.title || "",
      date:
        task?.date && !isNaN(new Date(task.date))
          ? new Date(task.date).toISOString().substr(0, 10)
          : new Date().toISOString().substr(0, 10),
      description: task?.description || "",
    },
  });

  const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0]);
  const [priority, setPriority] = useState(
    task?.priority?.toUpperCase() || PRIORITY[2]
  );
  const [team, setTeam] = useState(task?.team || []);
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [createTask, { isLoading }] = useCreateTaskMutation();

  const submitHandler = async (data) => {
    setUploading(true);
    try {
      const uploadedUrls =
        assets.length > 0
          ? await Promise.all(Array.from(assets).map((file) => uploadFile(file)))
          : [];

      const newData = {
        ...data,
        assets: [...(task?.assets || []), ...uploadedUrls],
        team,
        stage,
        priority,
        _id: task?._id,
      };

      const res = await createTask(newData).unwrap();
      toast.success(res.message);

      // Call onSuccess callback if provided
      if (typeof onSuccess === "function") {
        onSuccess();
      }

      setTimeout(() => {
        setOpen(false);
      }, 500);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.error);
    } finally {
      setUploading(false);
    }
  };

  const handleSelect = (e) => {
    setAssets(e.target.files);
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Dialog.Title
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 mb-4'
          >
            {task ? "UPDATE TASK" : "ADD TASK"}
          </Dialog.Title>

          <div className='mt-2 flex flex-col gap-6'>
            <Textbox
              placeholder='Task Title'
              type='text'
              name='title'
              label='Task Title'
              className='w-full rounded'
              register={register("title", { required: "Title is required" })}
              error={errors.title ? errors.title.message : ""}
            />
            
            <UserList team={team} setTeam={setTeam} />
            
            <div className='flex gap-4'>
              <SelectList
                label='Task Stage'
                lists={LISTS}
                selected={stage}
                setSelected={setStage}
              />

              <div className='w-full'>
                <Textbox
                  placeholder='Date'
                  type='date'
                  name='date'
                  label='Task Date'
                  className='w-full rounded'
                  register={register("date", {
                    required: "Date is required!",
                  })}
                  error={errors.date ? errors.date.message : ""}
                />
              </div>
            </div>

            <div className='flex gap-4'>
              <SelectList
                label='Priority Level'
                lists={PRIORITY}
                selected={priority}
                setSelected={setPriority}
              />

              <div className='w-full flex items-center justify-center mt-4'>
                <label
                  className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
                  htmlFor='imgUpload'
                >
                  <input
                    type='file'
                    className='hidden'
                    id='imgUpload'
                    onChange={handleSelect}
                    accept='.jpg, .png, .jpeg'
                    multiple={true}
                  />
                  <BiImages />
                  <span>Add Assets</span>
                </label>
              </div>
            </div>
            
            <Textbox
              placeholder='Task Description'
              type='textarea'
              name='description'
              label='Description'
              rows={4}
              className='w-full rounded'
              register={register("description")}
            />

            <div className='bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4'>
              {uploading ? (
                <span className='text-sm py-2 text-red-500'>
                  Uploading assets...
                </span>
              ) : (
                <Button
                  label='Submit'
                  type='submit'
                  className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-green-700 sm:text-base'
                  disabled={isLoading}
                />
              )}

              <Button
                type='button'
                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
                onClick={() => setOpen(false)}
                label='Cancel'
              />
            </div>
          </div>
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddTask;