import { Popover, Transition } from "@headlessui/react";
import moment from "moment";
import { Fragment, useState } from "react";
import { BiSolidMessageRounded } from "react-icons/bi";
import { HiBellAlert } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
} from "../redux/slices/api/userApiSlice";
import ViewNotification from "./ViewNotification";

const Icons = {
  alert: (
    <HiBellAlert className='h-5 w-5 text-gray-600 group-hover:text-indigo-600' />
  ),
  message: (
    <BiSolidMessageRounded className='h-5 w-5 text-gray-600 group-hover:text-indigo-600' />
  ),
};

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const { data: notificationData, isLoading, error, refetch } =
    useGetNotificationsQuery();
  const [markAsRead, { isLoading: isMarking }] = useMarkNotificationAsReadMutation();

  const notifications = Array.isArray(notificationData) ? notificationData : [];

  const viewHandler = (el) => {
    if (!el || !el._id) {
      console.error("Invalid notification clicked:", el);
      return;
    }

    setSelected(el);
    readHandler("one", el._id);
    setOpen(true);
  };

  const readHandler = async (isReadType, id) => {
    if (isMarking) return;

    try {
      const readType = isReadType || "all";
      const notificationId = id || "";

      console.log(
        `Attempting to mark notification(s) as read: type=${readType}, id=${notificationId}`
      );

      let retries = 0;
      let success = false;
      let lastError = null;

      while (retries < 2 && !success) {
        try {
          await markAsRead({
            isReadType: readType,
            id: notificationId,
          }).unwrap();
          success = true;
        } catch (err) {
          console.log(`Attempt ${retries + 1} failed, trying again...`);
          lastError = err;
          retries++;

          if (retries < 2) {
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        }
      }

      if (!success) {
        throw lastError;
      }

      if (readType === "all") {
        toast.success("All notifications marked as read");
      } else {
        toast.success("Notification marked as read");
      }

      refetch();
    } catch (error) {
      console.error("Error marking notifications as read:", error);

      if (error?.status === 404) {
        toast.error("Endpoint not found. Please contact support.");
        console.error("API endpoint not found. Check the route configuration.");
      } else {
        const errorMessage =
          error?.data?.message ||
          error?.error ||
          "Failed to mark notifications as read";
        toast.error(errorMessage);
      }
    }
  };

  const callsToAction = [
    { name: "Cancel", href: "#", icon: "" },
    {
      name: "Mark all as Read",
      href: "#",
      icon: "",
      onClick: () => readHandler("all", ""),
      disabled: notifications.length === 0 || isMarking,
    },
  ];

  return (
    <>
      <Popover className='relative'>
        {({ open: popoverOpen }) => (
          <>
            <Popover.Button
              className='inline-flex items-center outline-none'
              disabled={isLoading}
              aria-label='Notifications'
            >
              <div className='w-8 h-8 flex items-center justify-center text-gray-800 dark:text-white relative'>
                <IoIosNotificationsOutline className='text-2xl' />
                {notifications.length > 0 && (
                  <span className='absolute text-center top-0 right-1 text-sm text-white font-semibold w-4 h-4 rounded-full bg-red-600'>
                    {notifications.length > 99 ? "99+" : notifications.length}
                  </span>
                )}
              </div>
            </Popover.Button>

            <Transition
              as={Fragment}
              enter='transition ease-out duration-200'
              enterFrom='opacity-0 translate-y-1'
              enterTo='opacity-100 translate-y-0'
              leave='transition ease-in duration-150'
              leaveFrom='opacity-100 translate-y-0'
              leaveTo='opacity-0 translate-y-1'
            >
              <Popover.Panel className='absolute -right-16 md:-right-2 z-10 mt-5 flex w-screen max-w-max px-4'>
                {({ close }) => (
                  <div className='w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white dark:bg-[#1f1f1f] text-sm leading-6 shadow-lg ring-1 ring-gray-900/5'>
                    {isLoading ? (
                      <div className='p-8 text-center'>
                        <div className='animate-pulse flex justify-center'>
                          <div className='h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded-full'></div>
                        </div>
                        <p className='mt-2 text-gray-500 dark:text-gray-400'>
                          Loading notifications...
                        </p>
                      </div>
                    ) : error ? (
                      <div className='p-8 text-center'>
                        <p className='text-red-500 dark:text-red-400'>
                          Failed to load notifications.
                        </p>
                        <button
                          onClick={() => refetch()}
                          className='mt-2 text-blue-600 hover:underline'
                        >
                          Try again.
                        </button>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className='p-8 text-center'>
                        <p className='text-gray-500 dark:text-gray-400'>
                          No new notifications.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className='p-4'>
                          {notifications.slice(0, 5).map((item, index) => (
                            <div
                              key={item?._id || index}
                              className='group relative flex gap-x-4 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-[#1c1c1c] cursor-pointer'
                              onClick={() => viewHandler(item)}
                            >
                              <div className='mt-1 h-8 w-8 flex items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-800 group-hover:bg-white dark:group-hover:bg-gray-700'>
                                {item?.notiType && Icons[item.notiType]
                                  ? Icons[item.notiType]
                                  : (
                                    <span className='text-gray-500 dark:text-gray-400'>
                                      !
                                    </span>
                                  )}
                              </div>

                              <div>
                                <div className='flex items-center gap-3 font-semibold text-gray-900 capitalize dark:text-gray-200'>
                                  <p>{item?.notiType || "Notification"}</p>
                                  <span className='text-xs font-normal lowercase'>
                                    {item?.createdAt
                                      ? moment(item.createdAt).fromNow()
                                      : "Just now"}
                                  </span>
                                </div>
                                <p className='line-clamp-1 mt-1 text-gray-600 dark:text-gray-500'>
                                  {item?.text || "No details available"}
                                </p>
                              </div>
                            </div>
                          ))}

                          {notifications.length > 5 && (
                            <div className='text-center mt-2 text-sm'>
                              <p className='text-gray-500 dark:text-gray-400'>
                                +{notifications.length - 5} more notifications
                              </p>
                            </div>
                          )}
                        </div>

                        <div className='grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50 dark:bg-[#1f1f1f]'>
                          {callsToAction.map((item) => (
                            <Link
                              key={item.name}
                              onClick={(e) => {
                                e.preventDefault();
                                if (item.onClick && !item.disabled) {
                                  item.onClick();
                                } else if (!item.onClick) {
                                  close();
                                }
                              }}
                              className={`flex items-center justify-center gap-x-2.5 p-3 font-semibold ${
                                item.disabled
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "text-blue-600 hover:bg-gray-100 dark:hover:bg-[#1c1c1c] cursor-pointer"
                              }`}
                            >
                              {item.name}
                              {isMarking && item.name === "Mark all as Read" && (
                                <span className='inline-block h-3 w-3 rounded-full border-2 border-blue-600 border-t-transparent animate-spin ml-1'></span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>

      <ViewNotification
        open={open}
        setOpen={setOpen}
        el={selected}
      />
    </>
  );
}
