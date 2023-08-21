import { Dialog, Transition } from "@headlessui/react";
import {
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import React, { Fragment, useEffect, useState } from "react";
import {
  addParticipantToGroup,
  deleteGroup,
  getAvailableUsers,
  getGroupInfo,
  removeParticipantFromGroup,
  updateGroupName,
} from "../../api";
import { useAuth } from "../../context/AuthContext";
import { ChatListItemInterface } from "../../interfaces/chat";
import { UserInterface } from "../../interfaces/user";
import { requestHandler } from "../../utils";
import Button from "../Button";
import Input from "../Input";
import Select from "../Select";

const GroupChatDetailsModal: React.FC<{
  open: boolean;
  onClose: () => void;
  chatId: string;
  onGroupDelete: (chatId: string) => void;
}> = ({ open, onClose, chatId, onGroupDelete }) => {
  const { user } = useAuth();
  // State to manage the UI flag for adding a participant
  const [addingParticipant, setAddingParticipant] = useState(false);
  // State to manage the UI flag for renaming a group
  const [renamingGroup, setRenamingGroup] = useState(false);

  // State to capture the ID of the participant to be added
  const [participantToBeAdded, setParticipantToBeAdded] = useState("");
  // State to capture the new name when renaming a group
  const [newGroupName, setNewGroupName] = useState("");

  // State to store the current group details, initially set to null
  const [groupDetails, setGroupDetails] =
    useState<ChatListItemInterface | null>(null);

  // State to manage a list of users, initially set as an empty array
  const [users, setUsers] = useState<UserInterface[]>([]);

  // Function to handle the update of the group name.
  const handleGroupNameUpdate = async () => {
    // Check if the new group name is provided.
    if (!newGroupName) return alert("Group name is required");

    // Request to update the group name.
    requestHandler(
      // Call to update the group name with the provided chatId and newGroupName.
      async () => await updateGroupName(chatId, newGroupName),
      null,
      // On successful update, set the new group details and other related states.
      (res) => {
        const { data } = res;
        setGroupDetails(data); // Set the new group details.
        setNewGroupName(data.name); // Set the new group name state.
        setRenamingGroup(false); // Set the state to not renaming.
        alert("Group name updated to " + data.name); // Alert the user about the update.
      },
      alert // Use default alert for any error messages.
    );
  };

  // Function to retrieve available users.
  const getUsers = async () => {
    requestHandler(
      // Call to get the list of available users.
      async () => await getAvailableUsers(),
      null,
      // On successful retrieval, set the users' state.
      (res) => {
        const { data } = res;
        setUsers(data || []);
      },
      alert // Use default alert for any error messages.
    );
  };

  // Function to delete a group chat.
  const deleteGroupChat = async () => {
    // Check if the user is the admin of the group before deletion.
    if (groupDetails?.admin !== user?._id) {
      return alert("You are not the admin of the group");
    }

    // Request to delete the group chat.
    requestHandler(
      // Call to delete the group using the provided chatId.
      async () => await deleteGroup(chatId),
      null,
      // On successful deletion, trigger onGroupDelete and close any modals/dialogs.
      () => {
        onGroupDelete(chatId);
        handleClose();
      },
      alert // Use default alert for any error messages.
    );
  };

  const removeParticipant = async (participantId: string) => {
    requestHandler(
      // This is the main request function to remove a participant from the group.
      async () => await removeParticipantFromGroup(chatId, participantId),
      // Null represents an optional loading state callback
      null,
      // This is the callback after the request is successful.
      () => {
        // Copy the existing group details.
        const updatedGroupDetails = {
          ...groupDetails,
          // Update the participants list by filtering out the removed participant.
          participants:
            (groupDetails?.participants &&
              groupDetails?.participants?.filter(
                (p) => p._id !== participantId
              )) ||
            [],
        };
        // Update the state with the modified group details.
        setGroupDetails(updatedGroupDetails as ChatListItemInterface);
        // Inform the user that the participant has been removed.
        alert("Participant removed");
      },
      // This may be a generic error alert or error handling function if the request fails.
      alert
    );
  };

  // Function to add a participant to a chat group.
  const addParticipant = async () => {
    // Check if there's a participant selected to be added.
    if (!participantToBeAdded)
      return alert("Please select a participant to add.");
    // Make a request to add the participant to the group.
    requestHandler(
      // Actual request to add the participant.
      async () => await addParticipantToGroup(chatId, participantToBeAdded),
      // No loading callback provided, so passing `null`.
      null,
      // Callback on success.
      (res) => {
        // Destructure the response to get the data.
        const { data } = res;
        // Create an updated group details object.
        const updatedGroupDetails = {
          ...groupDetails,
          participants: data?.participants || [],
        };
        // Update the group details state with the new details.
        setGroupDetails(updatedGroupDetails as ChatListItemInterface);
        // Alert the user that the participant was added.
        alert("Participant added");
      },
      // Use the `alert` function as the fallback error handler.
      alert
    );
  };

  // Function to fetch group information
  const fetchGroupInformation = async () => {
    requestHandler(
      // Fetching group info for a specific chatId
      async () => await getGroupInfo(chatId),
      // Placeholder for a loading callback (currently set to null)
      null,
      // If the request is successful, destructure the response and set group details and the group name
      (res) => {
        const { data } = res;
        setGroupDetails(data);
        setNewGroupName(data?.name || "");
      },
      // If the request fails, show an alert
      alert
    );
  };

  // Function to handle modal or component closure
  const handleClose = () => {
    onClose();
  };

  // React's effect hook to perform side effects, here to fetch group information and users
  useEffect(() => {
    // If the modal or component isn't open, exit early
    if (!open) return;

    // Fetch group information and users when the modal or component opens
    fetchGroupInformation();
    getUsers();
  }, [open]); // The effect is dependent on the 'open' state or prop, so it re-runs whenever 'open' changes

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="transform transition ease-in-out duration-500 sm:duration-700"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transform transition ease-in-out duration-500 sm:duration-700"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                  <div className="flex h-full flex-col overflow-y-scroll bg-secondary py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative rounded-md bg-secondary text-zinc-400 hover:text-zinc-500 focus:outline-none"
                            onClick={handleClose}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <div className="flex flex-col justify-center items-start">
                        <div className="flex pl-16 justify-center items-center relative w-full h-max gap-3">
                          {groupDetails?.participants.slice(0, 3).map((p) => {
                            return (
                              <img
                                className="w-24 h-24 -ml-16 rounded-full outline outline-4 outline-secondary"
                                key={p._id}
                                src={p.avatar.url}
                                alt="avatar"
                              />
                            );
                          })}
                          {groupDetails?.participants &&
                          groupDetails?.participants.length > 3 ? (
                            <p>+{groupDetails?.participants.length - 3}</p>
                          ) : null}
                        </div>
                        <div className="w-full flex flex-col justify-center items-center text-center">
                          {renamingGroup ? (
                            <div className="w-full flex justify-center items-center mt-5 gap-2">
                              <Input
                                placeholder="Enter new group name..."
                                value={newGroupName}
                                onChange={(e) =>
                                  setNewGroupName(e.target.value)
                                }
                              />
                              <Button
                                severity="primary"
                                onClick={handleGroupNameUpdate}
                              >
                                Save
                              </Button>
                              <Button
                                severity="secondary"
                                onClick={() => setRenamingGroup(false)}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <div className="w-full inline-flex justify-center items-center text-center mt-5">
                              <h1 className="text-2xl font-semibold truncate-1">
                                {groupDetails?.name}
                              </h1>
                              {groupDetails?.admin === user?._id ? (
                                <button onClick={() => setRenamingGroup(true)}>
                                  <PencilIcon className="w-5 h-5 ml-4" />
                                </button>
                              ) : null}
                            </div>
                          )}

                          <p className="mt-2 text-zinc-400 text-sm">
                            Group · {groupDetails?.participants.length}{" "}
                            participants
                          </p>
                        </div>
                        <hr className="border-[0.1px] border-zinc-600 my-5 w-full" />
                        <div className="w-full">
                          <p className="inline-flex items-center">
                            <UserGroupIcon className="h-6 w-6 mr-2" />{" "}
                            {groupDetails?.participants.length} Participants
                          </p>
                          <div className="w-full">
                            {groupDetails?.participants?.map((part) => {
                              return (
                                <React.Fragment key={part._id}>
                                  <div className="flex justify-between items-center w-full py-4">
                                    <div className="flex justify-start items-start gap-3 w-full">
                                      <img
                                        className="h-12 w-12 rounded-full"
                                        src={part.avatar.url}
                                      />
                                      <div>
                                        <p className="text-white font-semibold text-sm inline-flex items-center w-full">
                                          {part.username}{" "}
                                          {part._id === groupDetails.admin ? (
                                            <span className="ml-2 text-[10px] px-4 bg-success/10 border-[0.1px] border-success rounded-full text-success">
                                              admin
                                            </span>
                                          ) : null}
                                        </p>
                                        <small className="text-zinc-400">
                                          {part.email}
                                        </small>
                                      </div>
                                    </div>
                                    {groupDetails.admin === user?._id ? (
                                      <div>
                                        <Button
                                          onClick={() => {
                                            const ok = confirm(
                                              "Are you sure you want to remove " +
                                                user.username +
                                                " ?"
                                            );
                                            if (ok) {
                                              removeParticipant(part._id || "");
                                            }
                                          }}
                                          size="small"
                                          severity="danger"
                                        >
                                          Remove
                                        </Button>
                                      </div>
                                    ) : null}
                                  </div>
                                  <hr className="border-[0.1px] border-zinc-600 my-1 w-full" />
                                </React.Fragment>
                              );
                            })}
                            {groupDetails?.admin === user?._id ? (
                              <div className="w-full my-5 flex flex-col justify-center items-center gap-4">
                                {!addingParticipant ? (
                                  <Button
                                    onClick={() => setAddingParticipant(true)}
                                    fullWidth
                                    severity="primary"
                                  >
                                    <UserPlusIcon className="w-5 h-5 mr-1" />{" "}
                                    Add participant
                                  </Button>
                                ) : (
                                  <div className="w-full flex justify-start items-center gap-2">
                                    <Select
                                      placeholder="Select a user to add..."
                                      value={participantToBeAdded}
                                      options={users.map((user) => ({
                                        label: user.username,
                                        value: user._id,
                                      }))}
                                      onChange={({ value }) => {
                                        setParticipantToBeAdded(value);
                                      }}
                                    />
                                    <Button onClick={() => addParticipant()}>
                                      + Add
                                    </Button>
                                    <Button
                                      severity="secondary"
                                      onClick={() => {
                                        setAddingParticipant(false);
                                        setParticipantToBeAdded("");
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                )}
                                <Button
                                  fullWidth
                                  severity="danger"
                                  onClick={() => {
                                    const ok = confirm(
                                      "Are you sure you want to delete this group?"
                                    );
                                    if (ok) {
                                      deleteGroupChat();
                                    }
                                  }}
                                >
                                  <TrashIcon className="w-5 h-5 mr-1" /> Delete
                                  group
                                </Button>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default GroupChatDetailsModal;
