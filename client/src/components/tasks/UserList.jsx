import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState, useRef } from "react";
import { BsChevronExpand } from "react-icons/bs";
import { MdCheck } from "react-icons/md";
import { useGetTeamListQuery } from "../../redux/slices/api/userApiSlice.js";
import { getInitials } from "../../utils/index.js";
import { useSelector } from "react-redux";

export default function UserList({ team, setTeam }) {
  const { data, isLoading, isError } = useGetTeamListQuery({ search: "" });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { user: currentUser } = useSelector(state => state.auth);
  const isInitialMount = useRef(true);
  
  const fallbackUser = currentUser ? [
    {
      _id: currentUser._id,
      name: currentUser.name,
      email: currentUser.email,
      title: currentUser.title || 'User'
    }
  ] : [];
  
  const availableUsers = (data && data.length > 0) ? data : fallbackUser;

  const handleChange = (el) => {
    setSelectedUsers(el);
    setTeam(el.map((u) => u._id));
  };

  useEffect(() => {
    if (isInitialMount.current && availableUsers.length > 0) {
      isInitialMount.current = false;
      
      if (!team || team.length === 0) {
        setSelectedUsers([availableUsers[0]]);
        setTeam([availableUsers[0]._id]);
      } 
      else if (Array.isArray(team) && team.length > 0 && typeof team[0] === 'string') {
        const userObjects = availableUsers.filter(user => team.includes(user._id));
        if (userObjects.length > 0) {
          setSelectedUsers(userObjects);
        }
      }
    }
  }, [availableUsers.length]);

  useEffect(() => {
    if (!isInitialMount.current && availableUsers.length > 0 && team) {
      if (Array.isArray(team)) {
        if (team.length > 0) {
          if (typeof team[0] === 'string') {
            const userObjects = availableUsers.filter(user => team.includes(user._id));
            if (userObjects.length > 0 && 
                JSON.stringify(userObjects.map(u => u._id).sort()) !== 
                JSON.stringify(selectedUsers.map(u => u._id).sort())) {
              setSelectedUsers(userObjects);
            }
          } else if (team[0]._id && 
                    JSON.stringify(team.map(u => u._id).sort()) !== 
                    JSON.stringify(selectedUsers.map(u => u._id).sort())) {
            setSelectedUsers(team);
          }
        } else if (selectedUsers.length > 0) {
          setSelectedUsers([]);
        }
      }
    }
  }, [team, availableUsers.length]);

  if (isLoading) return <p>Loading team members...</p>;

  if (isError) {
    console.warn("Error loading team members, using fallback");
  }

  return (
    <div className="w-full">
      <p className="text-slate-900 dark:text-gray-500">Assign Task To:</p>
      <Listbox
        value={selectedUsers}
        onChange={handleChange}
        multiple
      >
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded bg-white dark:bg-slate-800 pl-3 pr-10 text-left px-3 py-2.5 2xl:py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white sm:text-sm">
            <span className="block truncate">
              {selectedUsers?.map((user) => user.name).join(", ")}
            </span>

            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <BsChevronExpand
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-slate-800 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {availableUsers.map((user, userIdx) => (
                <Listbox.Option
                  key={userIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active 
                        ? "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-100" 
                        : "text-gray-900 dark:text-gray-200"
                    }`
                  }
                  value={user}
                >
                  {({ selected }) => (
                    <>
                      <div
                        className={`flex items-center gap-2 truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        <div
                          className={
                            "w-6 h-6 rounded-full text-white flex items-center justify-center bg-blue-600"
                          }
                        >
                          <span className="text-center text-[10px]">
                            {getInitials(user.name)}
                          </span>
                        </div>
                        <span>{user.name}</span>
                      </div>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <MdCheck className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}